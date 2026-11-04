"""Pool Party browser behavior checks through actual controls and read-only diagnostics.

Run from the workspace containing runtime-python and runtime-browser:
  PYTHONPATH=runtime-python python pool-party/checks/behaviour-pool.py
On a normal installation with Python Playwright and its Chromium installed:
  python checks/behaviour-pool.py
Set CHROMIUM_PATH to select a different Chromium binary.
The HTTP server and Playwright run in the same invocation for isolated runtimes.
No engine RNG, game state, or private functions are changed by this test.
"""
import asyncio
import functools
import hashlib
import json
import os
from pathlib import Path
import sys
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT.parent
OUT = ROOT / "checks/results"
SHOTS = ROOT / "checks/screens/behavior"
OUT.mkdir(parents=True, exist_ok=True)
SHOTS.mkdir(parents=True, exist_ok=True)
ACCOUNT_KEY = "poolparty.test.layr.v1"
RESULTS = []


def browser_options():
    options = {"args": ["--no-sandbox", "--disable-dev-shm-usage", "--disable-webgl", "--disable-gpu"]}
    selected = os.environ.get("CHROMIUM_PATH")
    bundled = WORK / "runtime-browser/bin/chromium"
    if selected:
        options["executable_path"] = selected
    elif bundled.is_file():
        options["executable_path"] = str(bundled)
    # Otherwise Playwright uses its installed Chromium.
    return options


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


SERVER = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(ROOT)))
threading.Thread(target=SERVER.serve_forever, daemon=True).start()
URL = f"http://127.0.0.1:{SERVER.server_port}/index.html?lite=1"


def record(name, ok, info=None):
    row = {"check": name, "ok": bool(ok), "info": info}
    RESULTS.append(row)
    print(json.dumps(row), flush=True)
    (OUT / "behavior-pool-progress.json").write_text(json.dumps(RESULTS, indent=2) + "\n")


async def loaded(page):
    await page.wait_for_function("window.PoolPartyTest && PoolPartyTest.api", timeout=60000)
    game = next(frame for frame in page.frames if frame != page.main_frame and frame.url == "about:srcdoc")
    await game.wait_for_function("window.PoolParty && PoolParty.art().ready && !PoolParty.snapshot().sessionLock", timeout=60000)
    return game


async def fullscreen(page, game):
    if not await game.evaluate("PoolParty.snapshot().fsOn"):
        await page.locator("#fsBtn").click()
        await game.wait_for_function("PoolParty.snapshot().fsOn")


async def real_account(page):
    return await page.evaluate("key => JSON.parse(localStorage.getItem(key))", ACCOUNT_KEY)


async def select_preview(game, item, seed=4242):
    print(f"TRACE select {item}: open", flush=True)
    await game.locator("#fs_preview").click()
    print(f"TRACE select {item}: radio", flush=True)
    await game.locator(f'input[name="labItem"][value="{item}"]').check()
    await game.locator("#labBet").select_option("100")
    await game.locator("#labSeeded").click()
    await game.locator("#labSeed").fill(str(seed))
    await game.locator("#labAuto").uncheck()
    print(f"TRACE select {item}: run", flush=True)
    before = await game.evaluate("PoolParty.lab.balance()")
    await game.locator("#labRun").click()
    await game.wait_for_function("PoolParty.lab.active()", timeout=15000)
    print(f"TRACE select {item}: active", flush=True)
    return before


async def canvas_pick(game, index):
    button = await game.evaluate("i => PoolParty.buttons().find(button => button.id === 'tag' + i)", index)
    if not button:
        return False
    canvas = game.locator("#fsCanvas")
    bounds = await canvas.bounding_box()
    await canvas.click(position={
        "x": (button["x"] + button["w"] / 2) / 1400 * bounds["width"],
        "y": (button["y"] + button["h"] / 2) / 960 * bounds["height"],
    })
    return True


async def play_preview(game, label, skip=False, timeout=170, watch_particles=False):
    start = time.monotonic()
    stages = []
    screenshot_stages = set()
    max_particles = 0
    last_stage_key = None
    stage_entered = start
    while time.monotonic() - start < timeout:
        snapshot = await game.evaluate("PoolParty.snapshot()")
        if not snapshot["lab"]:
            return {"completed": True, "stages": stages, "maxParticles": max_particles,
                    "seconds": round(time.monotonic() - start, 2)}
        if watch_particles:
            max_particles = max(max_particles, await game.evaluate("PoolParty.fx()"))
        scene = snapshot["scene"]
        stage_key = f'{scene["kind"]}:{scene["stage"]}' if scene else ("free:play" if snapshot["freeMode"] else "reels")
        if stage_key != last_stage_key:
            print(f"TRACE {label}: {stage_key}", flush=True)
            stages.append(stage_key)
            last_stage_key = stage_key
            stage_entered = time.monotonic()
        if watch_particles and stage_key == "jackpot:play" and stage_key not in screenshot_stages:
            await game.locator("#fsCanvas").screenshot(path=str(SHOTS / "reduced-motion-jackpot.png"))
            # Re-read after every screenshot; drawing may advance while it is captured.
            snapshot = await game.evaluate("PoolParty.snapshot()")
            scene = snapshot["scene"]
            screenshot_stages.add(stage_key)
        if skip and (scene or snapshot["freeMode"]):
            if not scene or scene["stage"] != "outro":
                if await game.locator("#fs_skip").is_visible():
                    await game.locator("#fs_skip").click()
            elif time.monotonic() - stage_entered > 0.15:
                await game.locator("#fsAction").click()
        elif scene:
            kind, stage = scene["kind"], scene["stage"]
            if stage == "intro":
                if kind == "gamble":
                    await game.locator("#fs_callMoon").click()
                else:
                    await game.locator("#fsAction").click()
            elif stage == "play" and kind == "vault":
                picks = snapshot["state"]["features"][0]["picks"]
                next_pick = next((index for index in [0, 1, 2] if index not in picks), None)
                if next_pick is not None:
                    await canvas_pick(game, next_pick)
            elif stage == "outro" and time.monotonic() - stage_entered > 0.7:
                await game.locator("#fsAction").click()
        await asyncio.sleep(0.08 if watch_particles else 0.15)
    return {"completed": False, "stages": stages, "maxParticles": max_particles,
            "last": await game.evaluate("PoolParty.snapshot()"), "seconds": round(time.monotonic() - start, 2)}


async def clear_real_feature(game):
    for _ in range(300):
        snapshot = await game.evaluate("PoolParty.snapshot()")
        if not snapshot["spinning"] and not snapshot["scene"] and not snapshot["freeMode"] and not snapshot["state"]["features"]:
            return
        if snapshot["scene"] and snapshot["scene"]["stage"] == "outro":
            await game.locator("#fsAction").click()
        elif snapshot["scene"] or snapshot["freeMode"]:
            if await game.locator("#fs_skip").is_visible():
                await game.locator("#fs_skip").click()
        await asyncio.sleep(0.15)
    raise RuntimeError("Could not finish real feature before next check")


async def main():
    started = time.monotonic()
    initial_build_sha256 = hashlib.sha256((ROOT / "index.html").read_bytes()).hexdigest()
    errors = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(**browser_options())
        context = await browser.new_context(viewport={"width": 1366, "height": 900})
        page = await context.new_page()
        page.set_default_timeout(60000)
        page.on("pageerror", lambda error: errors.append(str(error)))
        try:
            await page.goto(URL, wait_until="domcontentloaded")
            game = await loaded(page)
            await fullscreen(page, game)
            record("Standalone initializes with test-only read-only diagnostics", await game.evaluate(
                "!!window.PoolParty && !PoolParty.lab.run && !PoolParty.lab.runAll && !window.startLab && !window.findStops"))
            print("TRACE turbo: click", flush=True)
            await game.locator("#fs_turbo").click()
            print("TRACE turbo: clicked", flush=True)
            real_before = await real_account(page)
            for item in ["vault", "chain", "chain-full", "free"]:
                before = await select_preview(game, item, 4242)
                played = await play_preview(game, item + "-played")
                played["net"] = await game.evaluate("PoolParty.lab.balance()") - before
                if not played["completed"]:
                    record(f"Played-through preview completes: {item}", False, played)
                    raise RuntimeError(f"Preview {item} stuck")
                before = await select_preview(game, item, 4242)
                skipped = await play_preview(game, item + "-skipped", skip=True)
                skipped["net"] = await game.evaluate("PoolParty.lab.balance()") - before
                record(f"Same seed and choices: Skip equals played total for {item}",
                       skipped["completed"] and played["net"] == skipped["net"], {"played": played, "skipped": skipped})
                if not skipped["completed"]:
                    raise RuntimeError(f"Skipped preview {item} stuck")
            real_after = await real_account(page)
            record("Preview restores balance, fund, meters, statistics and all saved account bytes", real_before == real_after,
                   {"before": real_before, "after": real_after})
            record("Preview history is marked LAB", await game.evaluate("PoolParty.lab.history().length > 0 && PoolParty.lab.history().every(row => row.lab === true)"))
            await game.locator("#fs_settings").click()
            await game.locator("#setReduced").check()
            await game.locator("#close").click()
            await asyncio.sleep(2.5)
            await select_preview(game, "jackpot", 5)
            reduced = await play_preview(game, "reduced-jackpot", watch_particles=True)
            record("Reduced-motion jackpot emits no more than three particles", reduced["completed"] and reduced["maxParticles"] <= 3, reduced)
            await game.locator("#fs_settings").click()
            await game.locator("#setReduced").uncheck()
            await game.locator("#setTurbo").uncheck()
            await game.locator("#close").click()
            await clear_real_feature(game)
            before = await game.evaluate("PoolParty.snapshot()")
            await game.locator("#fs_spin").click()
            await game.wait_for_function("PoolParty.snapshot().state.pending !== null", timeout=5000)
            pending = await game.evaluate("PoolParty.snapshot().state.pending")
            saved_pending = (await real_account(page))["layrGames"]["pool-party"]["state"]["pending"]
            record("Pending round and jackpot metadata saved before animation", saved_pending["id"] == pending["id"] and
                   saved_pending.get("jackpot") == pending.get("jackpot") and "jackpot" in saved_pending,
                   {"id": pending["id"], "jackpot": pending.get("jackpot")})
            await page.reload(wait_until="domcontentloaded")
            game = await loaded(page)
            after = await game.evaluate("PoolParty.snapshot()")
            expected_balance = before["state"]["balance"] - pending["bet"] + after["state"]["history"][0]["win"]
            first_reload_ok = (after["state"]["spins"] == before["state"]["spins"] + 1 and
                               after["state"]["pending"] is None and after["state"]["history"][0]["id"] == pending["id"] and
                               after["state"]["balance"] == expected_balance)
            saved_once = await real_account(page)
            await page.reload(wait_until="domcontentloaded")
            game = await loaded(page)
            twice = await game.evaluate("PoolParty.snapshot()")
            same_settlement = (twice["state"]["balance"] == after["state"]["balance"] and
                               twice["state"]["spins"] == after["state"]["spins"] and
                               twice["state"]["fund"] == after["state"]["fund"] and
                               twice["state"]["jackpots"] == after["state"]["jackpots"])
            record("Reload settles the same committed round exactly once", first_reload_ok and same_settlement,
                   {"roundId": pending["id"], "beforeBalance": before["state"]["balance"], "afterBalance": after["state"]["balance"],
                    "afterSecondReload": twice["state"]["balance"], "spinsBefore": before["state"]["spins"],
                    "spinsAfter": after["state"]["spins"], "spinsAfterSecondReload": twice["state"]["spins"],
                    "fundBefore": before["state"]["fund"], "fundAfter": after["state"]["fund"]})
            await fullscreen(page, game)
            await clear_real_feature(game)
            await game.locator("#fs_auto").click()
            await game.locator('[data-auto="10"]').click()
            auto_before = await game.evaluate("PoolParty.snapshot().autoLeft")
            await game.locator("#fs_preview").click()
            auto_after = await game.evaluate("PoolParty.snapshot().autoLeft")
            record("Opening Bonus preview stops autoplay immediately", auto_before > 0 and auto_after == 0,
                   {"before": auto_before, "after": auto_after})
            await game.locator("#close").click()
            record("No browser runtime errors", not errors, errors)
        except Exception as error:
            record("Browser suite completes", False, {"error": str(error), "pageErrors": errors})
        finally:
            await context.close()
            await browser.close()
    report = {"completedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
              "seconds": round(time.monotonic() - started, 2),
              "initialBuildSha256": initial_build_sha256,
              "finalBuildSha256": hashlib.sha256((ROOT / "index.html").read_bytes()).hexdigest(),
              "renderer": "Headless Chromium with WebGL disabled, same game canvas and DOM; cabinet WebGL coverage is in the separate view suite; real-GPU review remains outstanding",
              "interaction": "Actual DOM and canvas controls; read-only test diagnostics; no forced real-account outcomes",
              "checks": RESULTS, "ok": all(result["ok"] for result in RESULTS)}
    (OUT / "behavior-pool.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({"complete": True, "ok": report["ok"], "seconds": report["seconds"]}), flush=True)
    return 0 if report["ok"] else 1


async def pending_free_only():
    """Regression: Skip pressed while a committed free-spin result is still animating."""
    started = time.monotonic()
    build_sha256 = hashlib.sha256((ROOT / "index.html").read_bytes()).hexdigest()
    errors = []
    evidence = {}
    ok = False
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(**browser_options())
        context = await browser.new_context(viewport={"width": 1366, "height": 900})
        page = await context.new_page()
        page.set_default_timeout(60000)
        page.on("pageerror", lambda error: errors.append(str(error)))
        try:
            await page.goto(URL, wait_until="domcontentloaded")
            game = await loaded(page)
            await fullscreen(page, game)
            real_before = await real_account(page)
            balance_before = await select_preview(game, "free", 4242)
            await game.wait_for_function("PoolParty.scene()?.kind === 'free' && PoolParty.scene()?.stage === 'intro'", timeout=60000)
            # Measured mouse clicks use the real UI but avoid prolonged actionability waits.
            start_button = await game.locator("#fsAction").bounding_box()
            await page.mouse.click(start_button["x"] + start_button["width"] / 2,
                                   start_button["y"] + start_button["height"] / 2)
            await game.wait_for_function("(() => { const s=PoolParty.snapshot(); return s.freeMode && s.spinning && s.state.pending?.free; })()", timeout=15000)
            before_skip = await game.evaluate("PoolParty.snapshot()")
            skip_button = await game.locator("#fs_skip").bounding_box()
            await page.mouse.click(skip_button["x"] + skip_button["width"] / 2,
                                   skip_button["y"] + skip_button["height"] / 2)
            after_skip = await game.evaluate("PoolParty.snapshot()")
            print("TRACE pending Happy Hour Skip clicked", json.dumps({
                "roundId": before_skip["state"]["pending"]["id"],
                "freeCount": before_skip["state"]["freeCount"],
                "stillAnimating": after_skip["spinning"],
            }), flush=True)
            completed = await play_preview(game, "free-skip-during-animation", timeout=120)
            net = await game.evaluate("PoolParty.lab.balance()") - balance_before
            real_after = await real_account(page)
            previous = json.loads((OUT / "behavior-pool.json").read_text())
            reference = next(row for row in previous["checks"] if row["check"].endswith("for free"))["info"]["played"]["net"]
            before_round = before_skip["state"]["pending"]
            after_round = after_skip["state"]["pending"]
            retained = after_round is None or after_round["id"] == before_round["id"]
            evidence = {
                "seed": 4242, "bet": 100, "firstFreeSpin": before_skip["state"]["freeCount"] == 0,
                "pendingRoundId": before_round["id"], "pendingFreeResult": before_round["free"],
                "spinningWhenSkipPressed": before_skip["spinning"], "sameCommittedRoundRetained": retained,
                "completed": completed, "net": net, "playedReferenceNet": reference,
                "realAccountUnchanged": real_before == real_after, "pageErrors": errors,
            }
            ok = (evidence["firstFreeSpin"] and evidence["pendingFreeResult"] and evidence["spinningWhenSkipPressed"] and
                  retained and completed["completed"] and net == reference and real_before == real_after and not errors)
        except Exception as error:
            evidence = {"error": str(error), "pageErrors": errors}
        finally:
            await context.close()
            await browser.close()
    report = {
        "completedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "check": "Skip during the first in-flight Happy Hour spin retains the committed result and matches played payout",
        "buildSha256": build_sha256, "seconds": round(time.monotonic() - started, 2),
        "renderer": "WebGL-disabled Chromium; actual fullscreen UI and canvas",
        "ok": ok, "evidence": evidence,
    }
    (OUT / "behavior-pending-free.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report), flush=True)
    return 0 if ok else 1


if __name__ == "__main__":
    try:
        code = asyncio.run(pending_free_only() if "--pending-free-only" in sys.argv else main())
    finally:
        SERVER.shutdown()
        SERVER.server_close()
    raise SystemExit(code)
