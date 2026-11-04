import asyncio
from lib import *
async def main():
    async with async_playwright() as p:
        b, pg, logs = await open_page(p, 1000, 640, url='http://127.0.0.1:8765/index.html?q=low')
        # keyboard F in the parent
        await pg.keyboard.press('f'); await pg.wait_for_timeout(1500)
        print(await pg.evaluate("""JSON.stringify({fs:G21Test.api.isFullscreen(), cls:G21Test.frame.className, parentFE: !!document.fullscreenElement, innerFE: !!G21Test.frame.contentDocument.fullscreenElement, fe: document.fullscreenElement && document.fullscreenElement.tagName, apiOn: G21Test.frame.contentWindow.document.fullscreenEnabled})"""))
        await pg.screenshot(path='f1.png')
        # F inside the game (frame focused)
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(1000)
        print('after Esc', await pg.evaluate("""JSON.stringify({fs:G21Test.api.isFullscreen(), cls:G21Test.frame.className, fe: !!document.fullscreenElement})"""))
        await pg.keyboard.press('f'); await pg.wait_for_timeout(1000)
        await pg.keyboard.press('f'); await pg.wait_for_timeout(1000)
        print('after F,F', await pg.evaluate("""JSON.stringify({fs:G21Test.api.isFullscreen(), cls:G21Test.frame.className})"""))
        print('\n'.join(l for l in logs if 'Failed' not in l)[:500])
        await b.close()
asyncio.run(main())
