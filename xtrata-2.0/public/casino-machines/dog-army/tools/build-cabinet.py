"""Build the DOG Army cabinet model in headless Chromium (THREE r128) and write build/model.json plus preview renders.
Usage (from the machine folder):
    python3 -m http.server 8765 &        # serves this folder
    python3 tools/build-cabinet.py
The screen texture is a snapshot of the live game's idle screen when dist/game.html exists (the game stream builds it); otherwise the
cabinet draws its own parade-ground placeholder. The official $DOG logo is picked up automatically from art/dog/img/dog-logo-black.png
(preferred, it reads best on the pale moon) or dog-logo-white.png; if neither exists the moon carries "$DOG" in plain type. Re-run when
the file appears. Writes build/model.json, build/preview-*.png and build/CABINET-DONE."""
import asyncio, base64, json, os, sys
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.environ.get('DOGARMY_BASE', 'http://127.0.0.1:8765')
CHROME = os.environ.get('CHROME', '/usr/bin/google-chrome')
VIEWS = [  # name, yaw, pitch, dist, ty, w, h, tx, tz, fov
    ('front', .0, .08, 12, 2.9, 900, 1100, 0, 0, 36), ('three-quarter', .55, .14, 12, 2.9, 900, 1100, 0, 0, 36), ('side', 1.45, .1, 12, 2.9, 900, 1100, 0, 0, 36),
    ('deck', .25, .5, 5.2, 1.9, 900, 1100, 0, 0, 36), ('topper', .4, .1, 4.2, 5.35, 900, 1100, 0, 0, 36), ('moon-front', 0, 0, 2.6, 5.5, 900, 900, 0, 0, 36, 0),
    ('moon-side', 1.2, .05, 2.6, 5.5, 900, 900, 0, 0, 36), ('door', .2, .12, 4.2, 1.0, 1000, 800, 0, 0, 36), ('lever', 1.0, .12, 3.2, 2.7, 900, 1000, 1.3, 0, 36),
    ('tent', .3, .22, 5.2, 3.0, 1100, 800, 0, 0, 36), ('tags-side', 1.5, .08, 6.5, 2.4, 900, 1000, 1.2, 0, 36)]

def have(name):
    return os.path.exists(os.path.join(ROOT, name))

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None, args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        screen = None
        if have('dist/game.html'):
            try:
                pg = await b.new_page(viewport={'width': 1400, 'height': 1000})
                await pg.add_init_script("localStorage.setItem('xtrata.parallax.layr.account.v1', JSON.stringify({bank:100000,layrGames:{}}))")
                await pg.goto(f'{BASE}/dist/game.html'); await pg.wait_for_timeout(3000)
                screen = await pg.evaluate("document.getElementById('pageCanvas').toDataURL('image/jpeg',.9)")
                print('screen snapshot taken from dist/game.html')
            except Exception as e:
                print('could not snapshot the game screen, using the cabinet placeholder:', e)
        pg2 = await b.new_page(viewport={'width': 900, 'height': 1100})
        errs = []; pg2.on('pageerror', lambda e: errs.append(str(e))); pg2.on('console', lambda m: errs.append(m.text) if m.type == 'error' and '404' not in m.text else None)
        await pg2.goto(f'{BASE}/tools/cabinet-build.html'); await pg2.wait_for_timeout(500)
        model = await pg2.evaluate("s => buildAll(s)", screen)
        logo = await pg2.evaluate("logoInfo()")
        os.makedirs(os.path.join(ROOT, 'build'), exist_ok=True)
        open(os.path.join(ROOT, 'build/model.json'), 'w').write(model)
        m = json.loads(model)
        print('model', len(model) // 1024, 'KB ·', len(m['geometries']), 'geometries ·', len(m['materials']), 'materials ·', len(m['textures']), 'textures')
        print('logo:', logo)
        for v in VIEWS:
            name, yaw, pitch, dist, ty, w, h, tx, tz, fov = v[:10]; crest = v[10] if len(v) > 10 else .5
            d = await pg2.evaluate(f"preview({yaw},{pitch},{dist},{ty},{w},{h},{tx},{tz},{fov},{crest})")
            open(os.path.join(ROOT, f'build/preview-{name}.png'), 'wb').write(base64.b64decode(d.split(',')[1]))
        await pg2.evaluate("setTags(1)")
        d = await pg2.evaluate("preview(1.5,.08,6.5,2.4,900,1000,1.2,0,36)"); open(os.path.join(ROOT, 'build/preview-tags-lit.png'), 'wb').write(base64.b64decode(d.split(',')[1]))
        d = await pg2.evaluate("preview(.55,.14,12,2.9,900,1100)"); open(os.path.join(ROOT, 'build/preview-three-quarter-lit.png'), 'wb').write(base64.b64decode(d.split(',')[1]))
        if errs: print('errors:', errs); sys.exit(1)
        names = {}
        def walk(n):
            if n['role']: names[n['role']] = names.get(n['role'], 0) + 1
            for c in n['children']: walk(c)
        walk(m['root'])
        acts = {}
        def walka(n):
            if n.get('action'): acts[n['action']] = acts.get(n['action'], 0) + 1
            for c in n['children']: walka(c)
        walka(m['root'])
        need = ['screenMesh', 'crest', 'spinPhysical', 'lever'] + [f'tag{i}' for i in range(8)]
        missing = [n for n in need if n not in names] + [a for a in ['spin', 'betUp', 'betDown', 'auto', 'pays'] if a not in acts]
        size_kb = len(model.encode()) / 1024
        used = f"REAL $DOG LOGO TEXTURE USED: art/dog/img/dog-logo-{logo['kind']}.png ({logo['w']}x{logo['h']}), fitted uncropped inside the brass ring on both the front and the back of the moon." if logo else 'TYPESET FALLBACK: art/dog/img/dog-logo-black.png / dog-logo-white.png not found, so the moon carries "$DOG" in plain type. Re-run tools/build-cabinet.py when the official file appears (it is picked up automatically).'
        lines = ['DOG Army cabinet: build/model.json is final.', '',
                 'Part names present (room sees them as px-<name>): ' + ', '.join(sorted(names)),
                 'Deck button actions: ' + ', '.join(f'{k} x{v}' for k, v in sorted(acts.items())) + ' (spin also sits on the lever parts and spinPhysical)',
                 'Dog tag rows: px-tag0 (bottom) .. px-tag7 (top); every row is two meshes (left and right side column), 16 meshes with 16 separate materials (MeshStandardMaterial, emissive #c07a1c, base emissiveIntensity 0.12). Suggested drive: emissiveIntensity = 0.12 + 0.75 * glow (higher washes the stamped text out); `color` can also be multiplied as Mooneeb did.',
                 f'Model: {size_kb:.0f} KB uncompressed JSON ({len(m["geometries"])} geometries, {len(m["materials"])} materials, {len(m["textures"])} textures; same root/geometries/materials/textures format as Mooneeb).',
                 used, 'Missing required parts: ' + (', '.join(missing) if missing else 'none')]
        open(os.path.join(ROOT, 'build/CABINET-DONE'), 'w').write('\n'.join(lines) + '\n'); print('\n'.join(lines))
        await b.close()

asyncio.run(main())
