"""Test page views at desktop and phone width: cabinet view, screen view, touch targets. Writes checks/screens/view-*.png
and checks/views.json.   python3 checks/views.py   (with a local server on 8765)"""
import asyncio, json, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = os.path.join(ROOT, 'checks/screens')
BASE = os.environ.get('MOONEEB_BASE', 'http://127.0.0.1:8765')
async def main():
    res = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        for label, vp, mobile in [('desktop', {'width': 1440, 'height': 900}, False), ('phone', {'width': 390, 'height': 844}, True)]:
            ctx = await b.new_context(viewport=vp, is_mobile=mobile, has_touch=mobile, device_scale_factor=2 if mobile else 1); pg = await ctx.new_page(); errors = []
            pg.on('pageerror', lambda e: errors.append(str(e)))
            await pg.goto(f'{BASE}/index.html?lite=1'); await pg.wait_for_timeout(6500)
            await pg.screenshot(path=f'{OUT}/view-{label}-cabinet.png')
            await pg.dispatch_event('#cSpin', 'click'); await pg.wait_for_timeout(4500)
            await pg.dispatch_event('#vScr', 'click'); await pg.wait_for_timeout(3000); await pg.screenshot(path=f'{OUT}/view-{label}-screen.png')
            sizes = await pg.evaluate("[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&getComputedStyle(b).visibility!=='hidden').map(b=>{const r=b.getBoundingClientRect();return [b.id||b.dataset.act||b.textContent.trim().slice(0,12),Math.round(r.width),Math.round(r.height)]})")
            small = [s for s in sizes if s[1] < 44 or s[2] < 44]
            over = await pg.evaluate("document.documentElement.scrollWidth<=innerWidth+1")
            res[label] = {'buttons': len(sizes), 'under44px': small, 'noHorizontalScroll': over, 'errors': errors}
            print(label, res[label]); await ctx.close()
        await b.close()
    json.dump(res, open(os.path.join(ROOT, 'checks/views.json'), 'w'), indent=1)
asyncio.run(main())
