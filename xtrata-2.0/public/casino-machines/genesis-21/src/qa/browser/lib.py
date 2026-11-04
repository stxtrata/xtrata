import asyncio, re
from playwright.async_api import async_playwright
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']
async def open_page(p, w=1400, h=860, touch=False, scale=1, reduced=False, url='file:///tmp/g21/index.html'):
    b = await p.chromium.launch(args=ARGS)
    ctx = await b.new_context(viewport={'width':w,'height':h}, has_touch=touch, is_mobile=touch, device_scale_factor=scale, reduced_motion='reduce' if reduced else 'no-preference', permissions=[])
    await ctx.route(re.compile(r'^https?://(?!127\.0\.0\.1)'), lambda r: r.abort())
    pg = await ctx.new_page(); logs=[]
    pg.on('console', lambda m: logs.append(m.type+': '+m.text[:240]) if 'TUNNEL' not in m.text and 'Allow attribute' not in m.text else None)
    pg.on('pageerror', lambda e: logs.append('PAGEERR '+str(e)[:300]))
    pg.set_default_timeout(90000); await pg.goto(url); await pg.wait_for_function("window.G21Test && G21Test.api", timeout=60000)
    await pg.wait_for_timeout(1500)
    return b, pg, logs
