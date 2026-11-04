"""Build Mooneeb's cabinet model in headless Chrome (THREE r128) and write build/model.json plus preview renders.
Usage (from the machine folder, with a local web server on port 8765 serving it):
    python3 -m http.server 8765 &
    python3 tools/build-cabinet.py
The screen texture is a snapshot of the live game's idle screen, so the cabinet looks right before it connects."""
import asyncio, base64, json, os, sys
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.environ.get('MOONEEB_BASE', 'http://127.0.0.1:8765')
CHROME = os.environ.get('CHROME', '/usr/bin/google-chrome')

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None, args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': 1400, 'height': 1000})
        await pg.add_init_script("localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({bank:100000,layrGames:{}}))")
        await pg.goto(f'{BASE}/dist/game.html'); await pg.wait_for_timeout(3000)
        screen = await pg.evaluate("document.getElementById('pageCanvas').toDataURL('image/jpeg',.9)")
        pg2 = await b.new_page(viewport={'width': 900, 'height': 1100})
        errs = []; pg2.on('pageerror', lambda e: errs.append(str(e)))
        await pg2.goto(f'{BASE}/tools/cabinet-build.html'); await pg2.wait_for_timeout(500)
        model = await pg2.evaluate("s => buildAll(s)", screen)
        os.makedirs(os.path.join(ROOT, 'build'), exist_ok=True)
        open(os.path.join(ROOT, 'build/model.json'), 'w').write(model)
        m = json.loads(model)
        print('model', len(model) // 1024, 'KB ·', len(m['geometries']), 'geometries ·', len(m['materials']), 'materials ·', len(m['textures']), 'textures')
        for name, args in [('front', '.0,.08,12,2.9'), ('three-quarter', '.55,.14,12,2.9'), ('side', '1.45,.1,12,2.9'), ('deck', '.25,.5,5.2,1.9'), ('topper', '.4,.15,4.2,4.9')]:
            d = await pg2.evaluate(f"preview({args})")
            open(os.path.join(ROOT, f'build/preview-{name}.png'), 'wb').write(base64.b64decode(d.split(',')[1]))
        if errs: print('errors:', errs); sys.exit(1)
        await b.close()

asyncio.run(main())
