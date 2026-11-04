"""Screenshot a Lab item through its stages (auto-advance) on the game page.  python3 checks/shots.py <item> [page=dist-fixture] [n=10] [dt=1500] [w=1440] [h=900]
Writes checks/screens/shot-<item>-<k>.png (canvas only for desktop; full page for phone widths)."""
import asyncio, sys, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
item = sys.argv[1]; page = sys.argv[2] if len(sys.argv) > 2 else 'dist-fixture'; n = int(sys.argv[3]) if len(sys.argv) > 3 else 10; dt = int(sys.argv[4]) if len(sys.argv) > 4 else 1500
w = int(sys.argv[5]) if len(sys.argv) > 5 else 1440; h = int(sys.argv[6]) if len(sys.argv) > 6 else 900; tag = sys.argv[7] if len(sys.argv) > 7 else ''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        ctx = await b.new_context(viewport={'width': w, 'height': h}, is_mobile=w < 600, has_touch=w < 600); pg = await ctx.new_page()
        pg.on('pageerror', lambda e: print('PAGEERR', e)); pg.on('console', lambda m: print('CON', m.text) if m.type == 'error' and 'TUNNEL' not in m.text and '404' not in m.text else None)
        await pg.add_init_script("localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({bank:100000,layrGames:{}}))")
        await pg.goto(f'http://127.0.0.1:8765/{page}/game.html?lab=1'); await pg.wait_for_timeout(2500)
        await pg.evaluate(f"DogArmy.lab.run('{item}',100,1337,true)")
        for k in range(n):
            await pg.wait_for_timeout(dt)
            sc = await pg.evaluate("JSON.stringify(DogArmy.scene())"); print(k, sc)
            if w >= 600: await pg.locator('#pageCanvas').screenshot(path=f'{ROOT}/checks/screens/shot-{item}{tag}-{k}.png')
            else: await pg.screenshot(path=f'{ROOT}/checks/screens/shot-{item}{tag}-{k}.png')
            if not await pg.evaluate("DogArmy.lab.active()"): break
        await b.close()
asyncio.run(main())
