"""Opens every panel on the game page (fixture or real) at desktop and phone width and screenshots it: python3 checks/panels.py [page]  -> checks/screens/panel-<label>-<name>.png, checks/results/panels.json"""
import asyncio, sys, os, json
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); page = sys.argv[1] if len(sys.argv) > 1 else 'dist'
async def main():
    res = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        for label, vp, mob in [('desktop', {'width': 1440, 'height': 900}, False), ('phone', {'width': 390, 'height': 844}, True)]:
            ctx = await b.new_context(viewport=vp, is_mobile=mob, has_touch=mob); pg = await ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.add_init_script("localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({bank:100000,layrGames:{}}))")
            await pg.goto(f'http://127.0.0.1:8765/{page}/game.html?lab=1'); await pg.wait_for_timeout(2500)
            await pg.screenshot(path=f'{ROOT}/checks/screens/panel-{label}-home.png')
            for name, btn in [('orders', 'rules'), ('fair', 'fairplay'), ('history', 'historyLink'), ('settings', 'settings'), ('lab', 'labBtn'), ('test', 'testBtn'), ('account', 'account')]:
                await pg.evaluate(f"document.getElementById('{btn}').click()"); await pg.wait_for_timeout(400)
                await pg.screenshot(path=f'{ROOT}/checks/screens/panel-{label}-{name}.png')
                if name == 'orders':
                    await pg.evaluate("document.getElementById('modal').scrollTop=99999"); await pg.wait_for_timeout(200); await pg.screenshot(path=f'{ROOT}/checks/screens/panel-{label}-orders-end.png')
                    await pg.evaluate("document.getElementById('rulesPot').click()"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{ROOT}/checks/screens/panel-{label}-holder.png')
                await pg.evaluate("document.getElementById('close').click()"); await pg.wait_for_timeout(150)
            res[label] = {'errors': errs, 'noHorizontalScroll': await pg.evaluate("document.documentElement.scrollWidth<=innerWidth+1")}
            await ctx.close()
        await b.close()
    json.dump(res, open(f'{ROOT}/checks/results/panels-{page}.json', 'w'), indent=1); print(res)
asyncio.run(main())
