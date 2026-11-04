"""Smoke the standalone file origin and the no-WebGL compatibility path.

Run with the workspace Playwright installation, for example:
  PYTHONPATH=runtime-python python pool-party/checks/fallback-pool.py

Both scenarios use file://index.html with the browser network offline. The first
denies only WebGL canvas contexts; 2D contexts and game logic remain untouched.
All play actions use visible controls. Diagnostics are read-only. This runtime
uses Chromium/SwiftShader, so the normal case is not real-GPU browser signoff.
"""
import asyncio
import hashlib
import json
import os
from pathlib import Path
import time
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT.parent
OUT = ROOT / "checks/results"
SHOTS = ROOT / "checks/screens"
OUT.mkdir(parents=True, exist_ok=True)
SHOTS.mkdir(parents=True, exist_ok=True)
INDEX = ROOT / "index.html"
ACCOUNT_KEY = "poolparty.test.layr.v1"
RESULT = {"environment": "Chromium software GPU (SwiftShader), not hardware GPU signoff",
          "origin": INDEX.as_uri(), "networkOffline": True, "scenarios": []}

FORCE_NO_WEBGL = """(() => {
  const original = HTMLCanvasElement.prototype.getContext;
  window.__forcedWebGLRequests = [];
  HTMLCanvasElement.prototype.getContext = function(type, ...args) {
    if (/^(webgl|experimental-webgl|webgl2)$/i.test(String(type))) {
      window.__forcedWebGLRequests.push(String(type));
      return null;
    }
    return original.call(this, type, ...args);
  };
})();"""

PIXELS = """selector => {
  const source = document.querySelector(selector), sample = document.createElement('canvas');
  sample.width = sample.height = 64;
  const g = sample.getContext('2d'); g.drawImage(source, 0, 0, 64, 64);
  const d = g.getImageData(0, 0, 64, 64).data, bins = new Set(); let opaque = 0, sum = 0;
  for (let i=0; i<d.length; i+=4) {
    if (d[i+3]) opaque++;
    bins.add([d[i]>>4,d[i+1]>>4,d[i+2]>>4,d[i+3]>>4].join(','));
    sum += d[i]+d[i+1]+d[i+2];
  }
  return {width:source.width,height:source.height,opaque,colourBins:bins.size,rgbSum:sum};
}"""


def save():
    (OUT / "fallback.json").write_text(json.dumps(RESULT, indent=2) + "\n")


def check(row, name, ok, info=None):
    item = {"check": name, "ok": bool(ok)}
    if info is not None:
        item["info"] = info
    row["checks"].append(item)
    print(json.dumps({"scenario": row["name"], **item}), flush=True)
    save()


async def loaded(page):
    await page.wait_for_function("window.PoolPartyTest && PoolPartyTest.api", timeout=60000)
    game = next(frame for frame in page.frames if frame != page.main_frame and frame.url == "about:srcdoc")
    await game.wait_for_function("window.PoolParty && PoolParty.art().ready && !PoolParty.snapshot().sessionLock", timeout=60000)
    await page.wait_for_function("document.getElementById('loading').hidden && PoolPartyTest.api.revision()>0", timeout=20000)
    return game


async def concise_state(game):
    return await game.evaluate("""() => {
      const x=PoolParty.snapshot(),s=x.state;
      return {spins:s.spins,balance:s.balance,bet:s.bet,pending:s.pending&&s.pending.id,
        last:s.history[0]?{id:s.history[0].id,win:s.history[0].win}:null,
        spinning:x.spinning,scene:x.scene,art:PoolParty.art()};
    }""")


async def scenario(browser, forced):
    name = "file-software-fallback" if forced else "file-swiftshader-webgl"
    row = {"name": name, "checks": [], "requests": [], "requestFailures": [],
           "pageErrors": [], "consoleErrors": [], "forcedWebGL": forced}
    RESULT["scenarios"].append(row)
    context = await browser.new_context(viewport={"width": 1366, "height": 900}, offline=True)
    if forced:
        await context.add_init_script(FORCE_NO_WEBGL)
    page = await context.new_page()
    page.set_default_timeout(30000)
    page.on("request", lambda request: row["requests"].append(request.url))
    page.on("requestfailed", lambda request: row["requestFailures"].append({"url": request.url, "failure": request.failure}))
    page.on("pageerror", lambda error: row["pageErrors"].append(str(error)))
    page.on("console", lambda message: row["consoleErrors"].append(message.text) if message.type == "error" else None)
    try:
        await page.goto(INDEX.as_uri() + "?lite=1", wait_until="domcontentloaded")
        game = await loaded(page)
        details = await page.evaluate("""() => {
          let storage = false, storageError = null;
          try {const k='poolparty.smoke.storage';localStorage.setItem(k,'ok');storage=localStorage.getItem(k)==='ok';localStorage.removeItem(k);}catch(e){storageError=String(e);}
          return {protocol:location.protocol,secureContext:isSecureContext,
            decompressionStream:typeof DecompressionStream,webgl:PoolPartyTest.webglOK,
            fallbackVisible:!document.getElementById('fallback2d').hidden,
            scriptSources:[...document.querySelectorAll('script[src]')].map(s=>s.src),
            storage,storageError,forcedRequests:window.__forcedWebGLRequests||[],
            revision:PoolPartyTest.api.revision(),art:PoolPartyTest.frame.contentWindow.PoolParty.art()};
        }""")
        row["boot"] = details
        check(row, "Standalone file origin initializes and decompresses both embedded payloads",
              details["protocol"] == "file:" and details["decompressionStream"] == "function" and details["revision"] > 0,
              {"protocol": details["protocol"], "secureContext": details["secureContext"], "revision": details["revision"]})
        check(row, "File-origin storage reads and writes without a security error", details["storage"], details["storageError"])
        check(row, "Correct renderer and visible screen path selected",
              details["webgl"] == (not forced) and details["fallbackVisible"] == forced,
              {"webgl": details["webgl"], "fallbackVisible": details["fallbackVisible"], "forcedRequests": details["forcedRequests"]})
        check(row, "All six embedded official token logos are ready", details["art"]["ready"] and details["art"]["logos"] == 6, details["art"])
        if forced:
            await page.wait_for_timeout(180)
            stage_pixels = await page.evaluate(PIXELS, "#stage canvas")
            screen_pixels = await page.evaluate(PIXELS, "#fallback2d")
            check(row, "SoftwareRenderer draws the cabinet scene", stage_pixels["opaque"] == 4096 and stage_pixels["colourBins"] > 30, stage_pixels)
            check(row, "Fallback canvas draws the live game", screen_pixels["opaque"] == 4096 and screen_pixels["colourBins"] > 50, screen_pixels)
        await page.screenshot(path=str(SHOTS / (name + ".png")))
        row["screenshot"] = str((SHOTS / (name + ".png")).relative_to(ROOT))

        before_bet = await page.evaluate("PoolPartyTest.api.ui().bet")
        await page.locator('[data-act="betUp"]').click()
        await page.wait_for_function("old => PoolPartyTest.api.ui().bet>old", arg=before_bet)
        raised = await page.evaluate("PoolPartyTest.api.ui().bet")
        await page.locator('[data-act="betDown"]').click()
        await page.wait_for_function("old => PoolPartyTest.api.ui().bet===old", arg=before_bet)
        check(row, "Bet controls work from a local file", raised > before_bet, {"before": before_bet, "raised": raised})

        # Fullscreen stops the room render while the normal-case game is exercised.
        if not forced:
            await page.locator('#fsBtn').click()
            await game.wait_for_function("PoolParty.snapshot().fsOn")
            await game.locator('#fs_turbo').click()
        else:
            await page.locator('#cTurbo').click()
        before = await concise_state(game)
        if forced:
            await page.locator('#cSpin').click()
        else:
            await game.locator('#fs_spin').click()
        await game.wait_for_function("old => PoolParty.snapshot().state.spins>old && !PoolParty.snapshot().spinning && PoolParty.snapshot().state.pending===null", arg=before["spins"], timeout=30000)
        after = await concise_state(game)
        saved = await page.evaluate("key => JSON.parse(localStorage.getItem(key))", ACCOUNT_KEY)
        check(row, "Visible SWAP control commits and settles a paid test-credit round",
              after["spins"] == before["spins"] + 1 and after["last"] is not None and after["pending"] is None,
              {"before": before, "after": after})
        check(row, "Settled round persists at file origin",
              saved["layrGames"]["pool-party"]["state"]["spins"] == after["spins"] and saved["bank"] == after["balance"],
              {"savedSpins": saved["layrGames"]["pool-party"]["state"]["spins"], "savedBank": saved["bank"]})
        if forced:
            await page.reload(wait_until="domcontentloaded")
            game = await loaded(page)
            resumed = await concise_state(game)
            check(row, "File-origin reload restores the settled round exactly once",
                  resumed["spins"] == after["spins"] and resumed["last"] == after["last"] and resumed["balance"] == after["balance"], resumed)
        # Deferred logo work is scheduled after boot, so remain until that point.
        await page.wait_for_timeout(1700)
        external = [url for url in row["requests"] if url.startswith(("http://", "https://", "ws://", "wss://"))]
        check(row, "No external requests or external script assets are needed", not external and not details["scriptSources"],
              {"externalRequests": external, "externalScriptSources": details["scriptSources"], "observedRequests": row["requests"]})
        expected = "THREE.WebGLRenderer: Error creating WebGL context."
        unexpected = [error for error in row["consoleErrors"] if not (forced and error == expected)]
        check(row, "No unexpected runtime or console errors", not row["pageErrors"] and not unexpected,
              {"pageErrors": row["pageErrors"], "unexpectedConsoleErrors": unexpected,
               "expectedWebGLFailureCount": row["consoleErrors"].count(expected) if forced else 0})
    except Exception as exc:
        row["exception"] = str(exc)
        check(row, "Scenario completes", False, str(exc))
        try:
            row["failureText"] = (await page.locator('body').inner_text())[:3000]
        except Exception:
            pass
    finally:
        await context.close()
        row["ok"] = bool(row["checks"]) and all(item["ok"] for item in row["checks"])
        save()


async def main():
    started = time.monotonic()
    RESULT["sourceSHA256"] = hashlib.sha256(INDEX.read_bytes()).hexdigest()
    RESULT["sourceBytes"] = INDEX.stat().st_size
    async with async_playwright() as playwright:
        for forced in [True, False]:
            args = ["--no-sandbox", "--disable-dev-shm-usage", "--disable-background-networking"]
            # Prevent canvas2D from dispatching thousands of cabinet triangles to
            # SwiftShader. This exercises the real CPU fallback, and keeps its
            # verification independent of other GPU-heavy browser checks.
            args += ["--disable-gpu"] if forced else ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
            browser = await playwright.chromium.launch(
                executable_path=os.environ.get("CHROME", str(WORK / "runtime-browser/bin/chromium")), args=args)
            RESULT["browserVersion"] = browser.version
            try:
                await scenario(browser, forced)
            finally:
                await browser.close()
    RESULT["sourceUnchangedDuringTest"] = hashlib.sha256(INDEX.read_bytes()).hexdigest() == RESULT["sourceSHA256"]
    RESULT["seconds"] = round(time.monotonic() - started, 2)
    RESULT["ok"] = all(row["ok"] for row in RESULT["scenarios"]) and RESULT["sourceUnchangedDuringTest"]
    save()
    print(json.dumps({"ok": RESULT["ok"], "seconds": RESULT["seconds"], "result": str(OUT / "fallback.json")}), flush=True)
    if not RESULT["ok"]:
        raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
