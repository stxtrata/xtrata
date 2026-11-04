import asyncio
from lib import *
async def main():
    async with async_playwright() as p:
        b, pg, logs = await open_page(p, 1000, 640, url='http://127.0.0.1:8765/index.html?q=low')
        st = "JSON.stringify({fs:G21Test.api.isFullscreen(), cls:G21Test.frame.className, fe: !!document.fullscreenElement})"
        await pg.keyboard.press('f'); await pg.wait_for_timeout(1500); print('F    ', await pg.evaluate(st))
        # what the browser does on Esc: leaves full screen itself
        await pg.evaluate("document.exitFullscreen()"); await pg.wait_for_timeout(1500); print('browser exit', await pg.evaluate(st))
        await pg.keyboard.press('f'); await pg.wait_for_timeout(1500); print('F again', await pg.evaluate(st))
        await pg.evaluate("G21Test.frame.contentDocument.querySelector('#fsBar [data-fs=exit]').click()"); await pg.wait_for_timeout(1500); print('bar Exit', await pg.evaluate(st))
        # fallback: API off
        await pg.evaluate("Element.prototype.requestFullscreen=undefined;G21Test.frame.contentWindow.Element.prototype.requestFullscreen=undefined;G21Test.frame.contentDocument.documentElement.requestFullscreen=undefined")
        await pg.keyboard.press('f'); await pg.wait_for_timeout(1500); print('fallback F', await pg.evaluate(st))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(1000); print('fallback Esc', await pg.evaluate(st))
        print('\n'.join(l for l in logs if 'Failed' not in l)[:400])
        await b.close()
asyncio.run(main())
