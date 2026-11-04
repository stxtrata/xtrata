"""Fast canvas grabs (toDataURL) at fixed intervals while a scene plays: python3 checks/grab.py <item> <name> <n> <dt_ms> [stage_to_start_grabbing]
Drives the scene itself (primary at trigger/intro) so play stages are captured in real time."""
import asyncio, sys, base64, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
item, name, n, dt = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]); page = os.environ.get('PAGE', 'dist-fixture'); vw = int(os.environ.get('VW', 1440)); vh = int(os.environ.get('VH', 900)); seed = os.environ.get('SEED', '1337')
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = await (await b.new_context(viewport={'width': vw, 'height': vh})).new_page()
        pg.on('pageerror', lambda e: print('PAGEERR', e))
        await pg.add_init_script("localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({bank:100000,layrGames:{}}))")
        await pg.goto(f'http://127.0.0.1:8765/{page}/game.html?lab=1'); await pg.wait_for_timeout(2000)
        await pg.evaluate(f"DogArmy.lab.run('{item}',100,{seed},false)")
        for _ in range(200):
            sc = await pg.evaluate("DogArmy.scene()")
            if sc and sc['stage'] in ('trigger', 'intro'): break
            await pg.wait_for_timeout(100)
        # step past trigger and intro
        for _ in range(2):
            sc = await pg.evaluate("DogArmy.scene()")
            if sc and sc['stage'] in ('trigger', 'intro'): await pg.wait_for_timeout(1300); await pg.evaluate("DogArmy.act.primary()")
        for k in range(n):
            await pg.wait_for_timeout(dt)
            d = await pg.evaluate("document.getElementById('pageCanvas').toDataURL('image/png')"); open(f'{ROOT}/checks/screens/shot-{name}-{k}.png', 'wb').write(base64.b64decode(d.split(',')[1]))
            print(k, await pg.evaluate("JSON.stringify(DogArmy.scene())"))
        await b.close()
asyncio.run(main())
