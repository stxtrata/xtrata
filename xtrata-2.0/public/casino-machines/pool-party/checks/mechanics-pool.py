"""Actual pointer tests for cap/label motion, lever motion and independent crest."""
import asyncio,json,os,threading
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
async def main():
 checks=[];errors=[]
 def add(name,ok,info=None):checks.append({'check':name,'ok':bool(ok),'info':info});print(name,ok,flush=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('CHROME',str(ROOT.parent/'runtime-browser/bin/chromium')),args=['--no-sandbox','--disable-gpu','--disable-webgl','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'])
  pg=await b.new_page(viewport={'width':1440,'height':900});pg.on('pageerror',lambda e:errors.append(str(e)))
  await pg.goto(f'http://127.0.0.1:{server.server_port}/index.html?lite=1');await pg.wait_for_function('!!window.PoolPartyTest',timeout=60000)
  # WebGL view/hit tests run separately. Make the fallback screen pointer-transparent
  # so this component test can exercise the same underlying model mechanics on the CPU.
  await pg.locator('#fallback2d').evaluate("e=>e.style.pointerEvents='none'")
  await pg.locator('#vScr').click();await pg.evaluate('PoolPartyTest.snap()');await pg.wait_for_timeout(1000)
  r=await pg.evaluate('PoolPartyTest.bounds().actions.pays');x=(r['left']+r['right'])/2;y=(r['top']+r['bottom'])/2
  read="(()=>{const m=PoolPartyTest.model;return {cap:m.getObjectByName('px-btn-pays').position.z,label:m.getObjectByName('px-btnface-pays').position.z}})()"
  base=await pg.evaluate(read);await pg.mouse.move(x,y);await pg.mouse.down();await pg.wait_for_timeout(1500);held=await pg.evaluate(read)
  add('Deck cap sinks along local z and label moves by identical distance',held['cap']<base['cap']-.01 and abs((held['cap']-base['cap'])-(held['label']-base['label']))<1e-6,{'base':base,'held':held})
  await pg.mouse.up();await pg.keyboard.press('Escape');await pg.wait_for_timeout(1100);released=await pg.evaluate(read)
  add('Cap and label spring home after release',abs(released['cap']-base['cap'])<.001 and abs(released['label']-base['label'])<.001,released)
  await pg.locator('#vCab').click();await pg.evaluate('PoolPartyTest.snap()');await pg.wait_for_timeout(700)
  await pg.evaluate("window.__motion=[];document.querySelector('#stage canvas').addEventListener('pointerup',()=>{window.__motionOnAction=PoolPartyTest.api.mechanics()});window.__observe=setInterval(()=>{const t=PoolPartyTest,m=t.model,lever=m.getObjectByName('px-lever'),jet=m.getObjectByName('px-waterJet');__motion.push({at:performance.now(),mechanics:t.api.mechanics(),angle:lever.rotation.x,jet:jet.scale.y,crest:m.getObjectByName('px-crest').rotation.y})},15)")
  point=await pg.evaluate("(()=>{const t=PoolPartyTest,p=t.model.getObjectByName('px-lever').localToWorld(new THREE.Vector3(.06,.88,.4)).project(t.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2}})()")
  old=await pg.evaluate('PoolPartyTest.actionLog().length');await pg.mouse.click(point['x'],point['y']);await pg.wait_for_timeout(2600)
  data=await pg.evaluate('(()=>{clearInterval(__observe);return{trace:__motion,onAction:window.__motionOnAction,actions:PoolPartyTest.actionLog()}})()')
  add('Diving-board lever pointer fires canonical spin action',len(data['actions'])>old and data['actions'][-1]['action']=='spin',point)
  angles=[v['angle'] for v in data['trace']];jets=[v['jet'] for v in data['trace']]
  add('Host moves the lever in response to its timing and returns it to rest',bool(angles) and max(angles)>.005 and abs(angles[-1])<.005,{'min':min(angles),'max':max(angles),'final':angles[-1]})
  add('Water-jet flourish responds to lever and returns',max(jets)>1.0008 and abs(jets[-1]-1)<.005,{'max':max(jets),'final':jets[-1]})
  add('mechanics exposes button pulse and lever timing together',bool(data.get('onAction',{}).get('lever')) and data.get('onAction',{}).get('buttons',{}).get('spin')==1,data.get('onAction'))
  add('Crest turns on its own animation clock',abs(data['trace'][-1]['crest']-data['trace'][0]['crest'])>.05)
  add('No browser runtime errors',not errors,errors)
  await b.close()
 (ROOT/'checks/results/mechanics-trace.json').write_text(json.dumps(data,indent=2))
 (ROOT/'checks/results/mechanics.json').write_text(json.dumps({'environment':'Chromium153 CPU SoftwareRenderer; fallback canvas pointer-transparent for mechanics component testing. Separate views suite covers rendered WebGL raycasts.','frameTimingNote':'CPU/software GPU can skip short animation peaks. Exact down/dwell/bounce shape is separately checked in mechanics-source.json; real-GPU smoothness remains a sign-off.', 'sampleCount':len(data['trace']),'checks':checks,'ok':all(c['ok'] for c in checks)},indent=2))
asyncio.run(main());server.shutdown()

if not json.loads((ROOT/'checks/results/mechanics.json').read_text()).get('ok',False):raise SystemExit(1)
