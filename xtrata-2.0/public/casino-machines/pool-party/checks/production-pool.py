"""Production pack safety: public practice preview, no developer flag or forcing globals.

python checks/production-pool.py
Requires Python Playwright and its Chromium, or CHROMIUM_PATH.
In the build workspace: PYTHONPATH=runtime-python python pool-party/checks/production-pool.py
"""
import asyncio
import functools
import hashlib
import json
import os
from pathlib import Path
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT.parent
OUT = ROOT / "checks/results"
KEY = "xtrata.parallax.layr.account.v1"


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


SERVER = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(ROOT)))
threading.Thread(target=SERVER.serve_forever, daemon=True).start()


async def main():
    start = time.monotonic()
    checks, errors = [], []
    def record(name, ok, info=None):
        item = {"check": name, "ok": bool(ok), "info": info}
        checks.append(item)
        print(json.dumps(item), flush=True)
    source_hash = hashlib.sha256((ROOT / "dist/game.html").read_bytes()).hexdigest()
    async with async_playwright() as playwright:
        options = {"args": ["--no-sandbox", "--disable-dev-shm-usage", "--disable-webgl", "--disable-gpu"]}
        local_browser = WORK / "runtime-browser/bin/chromium"
        if os.environ.get("CHROMIUM_PATH"):
            options["executable_path"] = os.environ["CHROMIUM_PATH"]
        elif local_browser.is_file():
            options["executable_path"] = str(local_browser)
        browser = await playwright.chromium.launch(**options)
        context = await browser.new_context(viewport={"width": 1440, "height": 1000})
        page = await context.new_page()
        page.set_default_timeout(60000)
        page.on("pageerror", lambda error: errors.append(str(error)))
        # Initialize an isolated test origin. No developer/test flag is set.
        await page.add_init_script("if(!localStorage.getItem('xtrata.parallax.layr.account.v1'))localStorage.setItem('xtrata.parallax.layr.account.v1',JSON.stringify({bank:100000,layrGames:{}}));")
        try:
            await page.goto(f"http://127.0.0.1:{SERVER.server_port}/dist/game.html", wait_until="domcontentloaded")
            await page.wait_for_function("window.PX_CASINO_ENGINE && ParallaxLAYRAccount.ready() && !PX_CASINO_ENGINE.ui().spinDisabled", timeout=60000)
            flags = await page.evaluate("({testFlag:typeof window.PX_STANDALONE_TEST,diagnostic:typeof window.PoolParty,startLab:typeof window.startLab,findStops:typeof window.findStops,dev:PX_CASINO_ENGINE.dev})")
            record("Production exposes neither developer diagnostics nor forced-outcome functions", flags == {
                "testFlag": "undefined", "diagnostic": "undefined", "startLab": "undefined", "findStops": "undefined", "dev": False,
            }, flags)
            record("Developer Lab and Test controls are hidden", await page.locator("#labBtn").is_hidden() and await page.locator("#testBtn").is_hidden())
            await page.evaluate("PX_CASINO_ENGINE.action('test')")
            record("Production Test-panel action is refused", not await page.locator("#modal").evaluate("element => element.open"))
            await page.locator("#turbo").click()
            account_before = await page.evaluate("key => JSON.parse(localStorage.getItem(key))", KEY)
            await page.locator("#rules").click()
            record("Pays contains a public Bonus preview entry", await page.locator("#rulesPreview").is_visible())
            await page.locator("#rulesPreview").click()
            record("Public preview clearly identifies practice chips", "PRACTICE CHIPS, NOT REAL LAYR" in await page.locator("#modalTag").inner_text())
            await page.locator('input[name="labItem"][value="vault"]').check()
            await page.locator("#labBet").select_option("100")
            await page.locator("#labSeeded").click()
            await page.locator("#labSeed").fill("4242")
            await page.locator("#labAuto").uncheck()
            await page.locator("#labRun").click()
            await page.wait_for_function("PX_CASINO_ENGINE.ui().lab && PX_CASINO_ENGINE.ui().scene === 'vault:intro'", timeout=60000)
            await page.locator("#fbGo").click()
            await page.wait_for_function("PX_CASINO_ENGINE.ui().scene === 'vault:play'")
            await page.locator('[data-pick="0"]').click()
            pick = page.locator('[data-pick="0"]')
            record("A seeded pick plays through the actual production UI", await pick.is_disabled() and "×" in await pick.inner_text(),
                   {"scene": await page.evaluate("PX_CASINO_ENGINE.ui().scene"), "revealed": await pick.inner_text()})
            account_during = await page.evaluate("key => JSON.parse(localStorage.getItem(key))", KEY)
            record("Real saved account is unchanged while preview is active", account_before == account_during)
            await page.locator("#previewBtn").click()
            record("Active public preview has an End preview control", await page.locator("#labExit").is_visible())
            await page.locator("#labExit").click()
            await page.wait_for_function("!PX_CASINO_ENGINE.ui().lab && PX_CASINO_ENGINE.ui().scene === ''")
            account_after = await page.evaluate("key => JSON.parse(localStorage.getItem(key))", KEY)
            record("Ending production preview restores account, fund, meters and statistics exactly", account_before == account_after,
                   {"balanceBefore": account_before["bank"], "balanceAfter": account_after["bank"],
                    "revisionBefore": account_before["layrGames"]["pool-party"]["revision"],
                    "revisionAfter": account_after["layrGames"]["pool-party"]["revision"],
                    "allSavedBytesEqual": account_before == account_after})
            record("No production runtime errors", not errors, errors)
        except Exception as error:
            record("Production safety suite completes", False, {"error": str(error), "pageErrors": errors})
        finally:
            await context.close()
            await browser.close()
    report = {"completedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
              "seconds": round(time.monotonic() - start, 2), "gameSha256": source_hash,
              "renderer": "Chromium with WebGL disabled; direct final game HTML without test flag",
              "checks": checks, "ok": all(item["ok"] for item in checks)}
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "production-pool.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({"complete": True, "ok": report["ok"], "seconds": report["seconds"]}), flush=True)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    try:
        result = asyncio.run(main())
    finally:
        SERVER.shutdown()
        SERVER.server_close()
    raise SystemExit(result)
