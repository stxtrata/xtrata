"""Build Pool Party from src/cabinet.js with the canonical Three r128 export chain.

Serve the machine folder on port 8765, then run python3 tools/build-cabinet.py.
Dependencies: Python Playwright + Chromium. CHROME and POOLPARTY_BASE may override
the browser executable and server. The model stays in root/geometries/materials/
textures form and is validated before it is packaged. Uses the current live game
screen where available; the host always replaces screenMesh with its live canvas.
"""
import asyncio, base64, json, os, pathlib, shutil, sys
from playwright.async_api import async_playwright

ROOT=pathlib.Path(__file__).resolve().parent.parent
BASE=os.environ.get('POOLPARTY_BASE','http://127.0.0.1:8765')
CHROME=os.environ.get('CHROME') or shutil.which('google-chrome') or shutil.which('chromium')
VIEWS=[('front',0,.08,11.6,2.9,900,1100,0,0,36),('three-quarter',.5,.13,11.6,2.9,900,1100,0,0,36),('side',1.45,.1,11.6,2.9,900,1100,0,0,36),('deck',.2,.52,4.7,1.95,1000,760,0,.25,36),('topper',.25,.08,4.2,5.26,900,760,0,0,36),('door',.15,.10,3.8,1.0,1000,760,0,0,36),('lever',1.05,.1,3.6,2.85,900,900,1.3,.15,36)]

async def main():
 async with async_playwright() as p:
  args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
  browser=await p.chromium.launch(executable_path=CHROME,headless=True,args=args)
  screen=None
  if (ROOT/'dist/game.html').exists():
   try:
    g=await browser.new_page(viewport={'width':1400,'height':1000})
    await g.add_init_script("localStorage.setItem('xtrata.parallax.layr.account.v1',JSON.stringify({bank:100000,layrGames:{}}))")
    await g.goto(BASE+'/dist/game.html');await g.wait_for_function('window.PX_CASINO_ENGINE && window.PX_CASINO_ENGINE.screen')
    await g.evaluate('window.PX_CASINO_ENGINE.activate()');await g.wait_for_timeout(700)
    screen=await g.evaluate("({screen:window.PX_CASINO_ENGINE.screen.toDataURL('image/jpeg',.9),topper:window.PX_CASINO_ENGINE.topper?.toDataURL('image/png')||null})")
    await g.close();print('Cabinet screen snapshot: current game canvas')
   except Exception as e:print('Screen snapshot unavailable; live host will supply it:',str(e)[:200])
  page=await browser.new_page(viewport={'width':900,'height':1100});errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto(BASE+'/tools/cabinet-build.html');packed=await page.evaluate('s=>buildAll(s)',screen)
  info=await page.evaluate('modelInfo()');logos=await page.evaluate('logoInfo()');model=json.loads(packed)
  names={};actions={}
  def walk(n):
   if n.get('role'):names[n['role']]=names.get(n['role'],0)+1
   if n.get('action'):actions[n['action']]=actions.get(n['action'],0)+1
   for child in n.get('children',[]):walk(child)
  walk(model['root'])
  required=['screenMesh','crest','spinPhysical','lever','marqueeMeter','deckSurface']+[f'tag{i}' for i in range(8)]+[p+a for p in ['btn-','btnface-'] for a in ['pays','betDown','betUp','auto']]
  missing=[n for n in required if n not in names]+[a for a in ['spin','betDown','betUp','auto','pays'] if a not in actions]
  if missing:raise RuntimeError('Missing cabinet contract parts: '+', '.join(missing))
  if errors:raise RuntimeError('; '.join(errors))
  out=ROOT/'build';out.mkdir(exist_ok=True);(out/'model.next.json').write_text(packed);(out/'model.next.json').replace(out/'model.json')
  if os.environ.get('NO_PREVIEWS')!='1':
   for name,yaw,pitch,dist,ty,w,h,tx,tz,fov in VIEWS:
    data=await page.evaluate('(a)=>preview(...a)',[yaw,pitch,dist,ty,w,h,tx,tz,fov,.3])
    (out/f'preview-{name}.png').write_bytes(base64.b64decode(data.split(',')[1]))
  report={'machine':'pool-party','modelBytes':len(packed.encode()),'geometries':len(model['geometries']),'materials':len(model['materials']),'textures':len(model['textures']),'roles':names,'actions':actions,'logos':logos,**info,'rendering':'Chromium SwiftShader; real GPU Safari/Chrome sign-off outstanding','errors':errors,'missing':missing}
  (out/'cabinet-report.json').write_text(json.dumps(report,indent=2)+'\n')
  (out/'CABINET-DONE').write_text('Pool Party cabinet exported and contract-checked. See cabinet-report.json.\n')
  print(json.dumps({k:report[k] for k in ['modelBytes','geometries','materials','textures','logos','bounds','missing','errors']},indent=2))
  await browser.close()

if __name__=='__main__':asyncio.run(main())
