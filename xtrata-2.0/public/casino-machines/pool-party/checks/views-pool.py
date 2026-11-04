"""Pool Party's five-size screen-fit and physical action test. Starts its own HTTP server.
CHROME=/path/to/chromium python3 checks/views-pool.py
"""
import asyncio,json,os,threading,time
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'checks/screens';OUT.mkdir(exist_ok=True)
CHROME=os.environ.get('CHROME',str(ROOT.parent/'runtime-browser/bin/chromium'))
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
async def main():
 results={'renderer':'Chromium 153 / SwiftShader (software GPU)','sizes':{},'errors':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=CHROME,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
  for w,h in [(1440,900),(1366,768),(1024,768),(390,844),(844,390)]:
   key=f'{w}x{h}';ctx=await b.new_context(viewport={'width':w,'height':h},has_touch=w==390,device_scale_factor=1);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
   await pg.goto(BASE+'/index.html?lite=1')
   try:
    await pg.wait_for_function('!!window.PoolPartyTest',timeout=90000)
    await pg.locator('#vScr').click();await pg.evaluate('PoolPartyTest.snap()');await pg.wait_for_timeout(900)
    bounds=await pg.evaluate('PoolPartyTest.bounds()')
    vis={'topClear':bounds['screen']['top']>=bounds['topbar']+9,'deckAboveFooter':all(r['bottom']<=bounds['footer']+2 for r in bounds['actions'].values()),'allActionsInViewport':all(r['left']>=0 and r['right']<=w and r['top']>=bounds['topbar'] for r in bounds['actions'].values()),'sideMargins':bounds['deck']['left']>=w*.04-2 and bounds['deck']['right']<=w*.96+2,'pitch016':abs(bounds['pitch']-.16)<1e-9}
    await pg.screenshot(path=str(OUT/f'view-{key}-screen.png'),timeout=90000)
    acts={}
    for act in ['pays','betUp','betDown','auto','spin']:
     r=bounds['actions'][act];x=(r['left']+r['right'])/2;y=(r['top']+r['bottom'])/2
     before=await pg.evaluate('PoolPartyTest.actionLog().length')
     await pg.mouse.click(x,y);await pg.wait_for_timeout(170)
     log=await pg.evaluate('PoolPartyTest.actionLog()');acts[act]={'x':x,'y':y,'fired':len(log)>before and log[-1]['action']==act}
     await pg.evaluate('PoolPartyTest.api.closeModal()');await pg.wait_for_timeout(100)
    # Actual UI actions above ensure the raycast reaches each labelled cap, not an occluding bezel.
    sizes=await pg.evaluate("[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&getComputedStyle(b).visibility!=='hidden').map(b=>{const r=b.getBoundingClientRect();return [b.id||b.dataset.act,Math.round(r.width),Math.round(r.height)]})")
    results['sizes'][key]={'bounds':bounds,'assertions':vis,'physicalActions':acts,'smallTargets':[x for x in sizes if x[1]<44 or x[2]<44],'errors':errs,'pass':all(vis.values()) and all(a['fired'] for a in acts.values()) and not errs}
    print(key,json.dumps({'assertions':vis,'physical':{k:v['fired'] for k,v in acts.items()},'screenTop':bounds['screen']['top'],'footer':bounds['footer'],'errors':errs}),flush=True)
   except Exception as e:
    results['sizes'][key]={'pass':False,'exception':str(e),'errors':errs};await pg.screenshot(path=str(OUT/f'view-{key}-failure.png'),timeout=90000);print(key,'ERROR',str(e),errs,flush=True)
   await ctx.close()
  await b.close()
 results['pass']=all(x['pass'] for x in results['sizes'].values());(ROOT/'checks/results/views.json').write_text(json.dumps(results,indent=2));print('PASS',results['pass'],flush=True)
asyncio.run(main());server.shutdown()

if not json.loads((ROOT/'checks/results/views.json').read_text()).get('pass',False):raise SystemExit(1)
