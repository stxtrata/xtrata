import asyncio, json, sys, os
from playwright.async_api import async_playwright
URL='file://'+os.path.abspath(os.path.join(os.path.dirname(__file__),'..','dist','Xtrata-Record-Shop-3D.html'))
ARGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox','--autoplay-policy=no-user-gesture-required']
async def launch(p, w=1280, h=800, query='?qa=1&nolock=1', init=None, touch=False):
    b=await p.chromium.launch(headless=True,**({'executable_path':os.environ['CHROME']} if os.environ.get('CHROME') else {'channel':'chrome'}),args=ARGS)
    ctx=await b.new_context(viewport={'width':w,'height':h},has_touch=touch)
    page=await ctx.new_page()
    errs=[]
    page.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    page.on('pageerror',lambda e: errs.append('PAGEERROR '+str(e)))
    reqs=[]
    page.on('request',lambda r: reqs.append(r.url))
    if init: await page.add_init_script(init)
    if 'stream' not in query: query+='&offline=1'
    if 'sky=' not in query: query+='&sky=rain'
    await page.goto(URL+query)
    await page.wait_for_function('window.__QA && !document.getElementById("intro").hidden',timeout=90000)
    return b,page,errs,reqs
async def enter(page):
    await page.click('#enterBtn')
    await page.evaluate('__QA.setAuto(false)')
S='__QA.state()'
