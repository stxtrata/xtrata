"""Targeted visual regression check for the practice ribbon and Fund dialog.

Uses visible Lab controls, an isolated test account, and the actual canvas pixels.
No game state, RNG, scenes, or private functions are changed by this check.
"""
import asyncio
import base64
import functools
import hashlib
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import threading
import time
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT.parent
OUT = ROOT / 'checks/results'
SHOTS = ROOT / 'checks/screens'
OUT.mkdir(parents=True, exist_ok=True)
SHOTS.mkdir(parents=True, exist_ok=True)
RESULT = {'environment': 'Chromium, GPU disabled; visual regression evidence only', 'checks': [], 'captures': [], 'errors': []}


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def save():
    (OUT / 'banner.json').write_text(json.dumps(RESULT, indent=2) + '\n')


def check(name, ok, info=None):
    row = {'check': name, 'ok': bool(ok), 'info': info}
    RESULT['checks'].append(row)
    print(json.dumps(row), flush=True)
    save()


async def preview(page, item):
    await page.locator('#fs_preview').click()
    await page.locator(f'input[name="labItem"][value="{item}"]').check()
    await page.locator('#labSeeded').click()
    await page.locator('#labSeed').fill('1337')
    await page.locator('#labBet').select_option('100')
    await page.locator('#labAuto').uncheck()
    await page.locator('#labRun').click()
    await page.wait_for_function('item => PoolParty.snapshot().lab?.item===item', arg=item)


async def end_preview(page):
    await page.locator('#fs_preview').click()
    await page.locator('#labExit').click()
    await page.wait_for_function('!PoolParty.lab.active()')


async def capture_canvas(page, filename):
    data = await page.evaluate("""() => {
      const c=PX_CASINO_ENGINE.screen,g=c.getContext('2d'),d=g.getImageData(0,0,c.width,56).data;
      let coral=0;for(let i=0;i<d.length;i+=4)if(d[i]===255&&d[i+1]===177&&d[i+2]===106&&d[i+3]===255)coral++;
      return {png:c.toDataURL('image/png'),width:c.width,height:c.height,coralFraction:coral/(d.length/4),scene:PoolParty.scene()};
    }""")
    (SHOTS / filename).write_bytes(base64.b64decode(data.pop('png').split(',', 1)[1]))
    data['screenshot'] = str((SHOTS / filename).relative_to(ROOT))
    RESULT['captures'].append(data)
    return data


async def main():
    started = time.monotonic()
    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(executable_path=os.environ.get('CHROME', str(WORK / 'runtime-browser/bin/chromium')),
            args=['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-webgl'])
        context = await browser.new_context(viewport={'width': 1366, 'height': 980})
        await context.add_init_script("window.PX_STANDALONE_TEST=true;localStorage.setItem('xtrata.parallax.layr.account.v1',JSON.stringify({bank:100000,layrGames:{}}));")
        page = await context.new_page()
        page.set_default_timeout(15000)
        page.on('pageerror', lambda error: RESULT['errors'].append(str(error)))
        try:
            response = await page.goto(f'http://127.0.0.1:{server.server_port}/dist/game.html', wait_until='domcontentloaded')
            RESULT['loadedDocumentSHA256'] = hashlib.sha256(await response.body()).hexdigest()
            await page.wait_for_function('window.PoolParty && PoolParty.art().ready && !PoolParty.snapshot().sessionLock', timeout=60000)
            await page.locator('#turbo').click()
            await page.locator('#fullscreen').click()
            await page.wait_for_function('PoolParty.snapshot().fsOn')
            for item, kind, filename in [('vault', 'vault', 'banner-yield-farm.png'), ('jackpot', 'jackpot', 'banner-cannonball.png')]:
                await preview(page, item)
                await page.wait_for_function("kind => PoolParty.scene()?.kind===kind && PoolParty.scene()?.stage==='intro'", arg=kind)
                await page.locator('#fsAction').click()
                await page.wait_for_function("kind => PoolParty.scene()?.kind===kind && PoolParty.scene()?.stage==='play'", arg=kind)
                await page.wait_for_timeout(500)
                capture = await capture_canvas(page, filename)
                check(f'Practice ribbon remains visible above {item} scene', capture['coralFraction'] > .7 and capture['scene']['kind'] == kind, capture)
                await end_preview(page)
            await preview(page, 'fund-info')
            await page.wait_for_function("document.querySelector('#modalContent h2')?.textContent==='The Machine Fund.'")
            path = SHOTS / 'lab-fund-info-dialog.png'
            await page.locator('#modal').screenshot(path=str(path))
            text = await page.locator('#modal').inner_text()
            RESULT['fundInfoScreenshot'] = str(path.relative_to(ROOT))
            check('Machine Fund information stays available with Auto off', '1%' in text and 'eligible Forever Twin' in text,
                  {'title': await page.locator('#modalContent h2').inner_text(), 'screenshot': RESULT['fundInfoScreenshot']})
            await page.locator('#close').click()
            await end_preview(page)
            check('Targeted previews restore the real test account', await page.evaluate("ParallaxLAYRAccount.balance()===100000 && PoolParty.snapshot().state.spins===0"))
            check('No browser runtime errors', not RESULT['errors'], RESULT['errors'])
        except Exception as exc:
            check('Targeted visual check completes', False, str(exc))
        finally:
            await context.close()
            await browser.close()
            server.shutdown()
    RESULT['sourceUnchangedDuringTest'] = hashlib.sha256((ROOT / 'dist/game.html').read_bytes()).hexdigest() == RESULT.get('loadedDocumentSHA256')
    RESULT['seconds'] = round(time.monotonic() - started, 2)
    RESULT['ok'] = all(row['ok'] for row in RESULT['checks']) and RESULT['sourceUnchangedDuringTest']
    save()
    print(json.dumps({'ok': RESULT['ok'], 'seconds': RESULT['seconds'], 'result': str(OUT / 'banner.json')}), flush=True)
    if not RESULT['ok']:
        raise SystemExit(1)


if __name__ == '__main__':
    asyncio.run(main())
