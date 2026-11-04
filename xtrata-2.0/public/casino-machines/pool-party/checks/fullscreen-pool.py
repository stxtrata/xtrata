"""Pool Party fullscreen interaction check, using actual DOM and canvas controls.
Run from the workspace with PYTHONPATH=runtime-python and the primary Python.
The HTTP server runs in this invocation. No fixture art or forced engine results.
POOL_QA_MODE=layout checks final responsive bars; =retest rechecks complete jackpot paths.
The default full mode exercises all controls and representative bonus sessions.
"""
import asyncio, json, os, threading, time, traceback, hashlib
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'checks/screens';OUT.mkdir(exist_ok=True)
MODE=os.environ.get('POOL_QA_MODE','full')
RESULT=ROOT/('checks/results/fullscreen-pool.json' if MODE=='full' else f'checks/results/fullscreen-{MODE}.json')
CHROME=os.environ.get('CHROME',str(ROOT.parent/'runtime-browser/bin/chromium'))
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
RESULTS={'buildSHA256':hashlib.sha256((ROOT/'index.html').read_bytes()).hexdigest(),'mode':MODE,'browser':'Chromium 153; host SoftwareRenderer fallback (GPU disabled to avoid shared SwiftShader saturation)','sessions':{},'scope':'Actual standalone host; bottom-bar and canvas controls only while fullscreen. Separate Bonus Lab practice state. No external fixtures.'}

def save():
 RESULT.write_text(json.dumps(RESULTS,indent=2))

async def session(browser,label,width,height,mobile=False,fallback=False):
 ctx=await browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=1)
 if fallback:
  await ctx.add_init_script("Object.defineProperty(Element.prototype,'requestFullscreen',{configurable:true,value:undefined});Object.defineProperty(Element.prototype,'webkitRequestFullscreen',{configurable:true,value:undefined});")
 pg=await ctx.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 res={'viewport':[width,height],'mobile':mobile,'withoutFullscreenAPI':fallback,'steps':[],'screens':[]};RESULTS['sessions'][label]=res
 async def check(name,ok,detail=None):
  item={'step':name,'pass':bool(ok)}
  if detail is not None:item['detail']=detail
  res['steps'].append(item);save();print(label,name,'PASS' if ok else 'FAIL',json.dumps(detail) if detail is not None else '',flush=True)
 async def shot(name):
  path=OUT/f'fullscreen-{label}-{name}.png';await pg.screenshot(path=str(path),timeout=60000);res['screens'].append(str(path.relative_to(ROOT)));save()
 try:
  await pg.goto(BASE+'/index.html?lite=1')
  await pg.wait_for_function('!!window.PoolPartyTest',timeout=90000)
  res['webglOK']=await pg.evaluate('PoolPartyTest.webglOK')
  frame=next(f for f in pg.frames if f!=pg.main_frame)
  await frame.wait_for_function('window.PoolParty && PoolParty.art().ready',timeout=60000)
  async def G(js):return await frame.evaluate(js)
  async def snap():return await G('PoolParty.snapshot()')
  async def bar(key):await frame.locator('#fs_'+key).click(timeout=60000)
  async def tap(selector):
   node=frame.locator(selector)
   if await node.count() and await node.is_visible() and await node.is_enabled():
    await node.click(timeout=60000);return True
   return False
  async def wait_idle(timeout=70):
   end=time.monotonic()+timeout
   while time.monotonic()<end:
    s=await snap()
    if not s['spinning'] and not s['scene'] and not s['freeMode'] and not s['state'].get('free'):return True
    if await G("document.getElementById('modal').open"):await frame.locator('#close').click()
    elif s['scene']:
     if s['scene']['kind']=='gamble' and s['scene']['stage']=='intro':await tap('#fs_collect')
     elif s['scene']['stage']=='outro':
      if not await tap('#fsAction'):await tap('#fs_spin')
     else:await tap('#fs_skip')
    await pg.wait_for_timeout(250)
   return False
  async def geom():
   return await G("""(()=>{const bar=document.getElementById('fsBar'),stage=document.getElementById('fsStage'),canvas=document.getElementById('fsCanvas'),r=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}},items=[...bar.querySelectorAll('.fsb')].filter(e=>e.offsetParent);return {viewport:[innerWidth,innerHeight],bar:r(bar),stage:r(stage),canvas:r(canvas),scrollWidth:bar.scrollWidth,clientWidth:bar.clientWidth,rows:new Set(items.map(e=>Math.round(e.getBoundingClientRect().top))).size,targets:items.map(e=>({id:e.id||e.className,...r(e)})),volume:r(document.getElementById('fsVol')),allInBar:items.every(e=>{const a=e.getBoundingClientRect(),b=bar.getBoundingClientRect();return a.top>=b.top&&a.bottom<=b.bottom+1})}})()""")
  await pg.locator('#fsBtn').click();await pg.wait_for_timeout(500)
  st=await pg.evaluate("(()=>{const f=document.querySelector('.pxLogicFrame'),r=f.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,root:document.fullscreenElement?.tagName||null,apiAvailable:typeof document.documentElement.requestFullscreen==='function',hostClass:document.body.classList.contains('machine-fs')}})()")
  await check('fullscreen fills host; native root or fixed fallback',st['x']==0 and st['y']==0 and abs(st['w']-width)<2 and abs(st['h']-height)<2 and st['hostClass'] and await G('PoolParty.snapshot().fsOn') and (st['root']=='HTML' if not fallback else st['root'] is None),st)
  geometry=await geom();res['entryGeometry']=geometry
  await check('all visible bottom bar targets at least 44px',all(x['w']>=43.9 and x['h']>=43.9 for x in geometry['targets']),[[x['id'],round(x['w']),round(x['h'])] for x in geometry['targets']])
  await check('volume input itself at least 44px',geometry['volume']['w']>=43.9 and geometry['volume']['h']>=43.9,geometry['volume'])
  await check('bottom bar one row desktop; wraps phone without horizontal overflow',geometry['bar']['bottom']<=height+1 and geometry['scrollWidth']<=geometry['clientWidth']+1 and (geometry['rows']>=2 if width<1100 else geometry['rows']==1),{k:geometry[k] for k in ['rows','scrollWidth','clientWidth','bar']})
  ca,ba=geometry['canvas'],geometry['bar'];await check('screen remains inside viewport and above bar',ca['x']>=-1 and ca['right']<=width+1 and ca['y']>=-1 and ca['bottom']<=ba['y']+1,{'canvas':ca,'bar':ba})
  await shot('entered')
  if fallback:
   await bar('pays');await check('fixed fallback opens same-frame modal',await G("document.getElementById('modal').open"));await frame.locator('#close').click()
   await bar('exit');await pg.wait_for_timeout(300)
   await check('fixed fallback exit restores cabinet',not await G('PoolParty.snapshot().fsOn') and not await pg.evaluate("document.body.classList.contains('machine-fs')"))
   return
  if MODE=='layout':
   for it in (['free','vault','chain','gamble-win'] if width>=1100 else ['free','gamble-win'] if width>700 else ['vault','gamble-win']):
    await wait_idle();await bar('lab')
    await frame.locator(f'input[name=labItem][value="{it}"]').check()
    await frame.locator('#labSeeded').click();await frame.locator('#labSeed').fill('1337');await frame.locator('#labAuto').uncheck();await frame.locator('#labRun').click()
    await frame.wait_for_function('PoolParty.scene()?.stage==="intro"',timeout=35000)
    geometry=await geom()
    await check(it+' active-scene bar has no hidden overflow',geometry['scrollWidth']<=geometry['clientWidth']+1 and geometry['allInBar'] and (geometry['rows']==1 if width>=1100 else geometry['rows']>=2),{k:geometry[k] for k in ['rows','scrollWidth','clientWidth','bar']})
    await shot('layout-'+it)
    if it=='gamble-win':await bar('collect')
    else:await bar('skip')
    await wait_idle()
   await bar('exit');await pg.wait_for_timeout(250)
   await check('layout exit restores cabinet',not await G('PoolParty.snapshot().fsOn'))
   return
  if MODE!='retest':
   b0=(await snap())['state']['bet'];await bar('betUp');b1=(await snap())['state']['bet'];await bar('betDown');b2=(await snap())['state']['bet']
   await check('bet controls change and restore wager',b1>b0 and b2==b0,[b0,b1,b2])
   for key,prop in [('turbo','turbo'),('sound','muted')]:
    a=(await snap())['state'][prop];await bar(key);b=(await snap())['state'][prop]
    await check(key+' toggle responds',a!=b,[a,b])
    if key=='sound':await bar(key)
   slider=frame.locator('#fsVol');await slider.focus();a=(await snap())['state']['volume'];await slider.press('Home');await slider.press('ArrowRight');b=(await snap())['state']['volume'];await check('volume range updates game setting',b==0.05 and b!=a,[a,b])
   before=(await snap())['state']['spins'];await bar('spin');await pg.wait_for_timeout(250);started=(await snap())['spinning'];await wait_idle();after=(await snap())['state']['spins'];await check('bar starts and settles an actual paid spin',started and after>=before+1,[before,after])
   if await frame.locator('#fs_collect').is_visible():await bar('collect')
   for name in ['pays','fair','history','settings','holder','preview','lab','test']:
    await bar(name);await pg.wait_for_timeout(100)
    info=await G("(()=>{const d=document.getElementById('modal'),r=d.getBoundingClientRect();return {open:d.open,tag:document.getElementById('modalTag').textContent,top:r.top,bottom:r.bottom,width:r.width,insideFrame:d.ownerDocument===document,root:!!window.frameElement.ownerDocument.fullscreenElement}})()")
    if name in ['pays','lab']:await shot('panel-'+name)
    await frame.locator('#close').click();await check(name+' panel opens and closes inside fullscreen',info['open'] and info['insideFrame'] and info['top']>=-1 and info['bottom']<=height+1 and not await G("document.getElementById('modal').open"),info)
   await bar('auto');await frame.locator('[data-auto="10"]').click();await pg.wait_for_timeout(100)
   on=(await snap())['autoLeft'];await bar('auto');off=(await snap())['autoLeft'];await wait_idle()
   await check('auto can start and stop from bottom bar',on>0 and off==0,[on,off])
   if await frame.locator('#fs_collect').is_visible():await bar('collect')
  account_before=await pg.evaluate('ParallaxLAYRAccount.snapshot().balance')
  real_before=await G('JSON.stringify({wagered:PoolParty.snapshot().state.wagered,paidOut:PoolParty.snapshot().state.paidOut,jackpots:PoolParty.jackpots(),fund:PoolParty.snapshot().state.fund})')
  items=['chain-full','jackpot'] if MODE=='retest' else ['free','vault','chain','chain-full','jackpot','gamble-win','gamble-loss'] if not mobile else ['vault','gamble-loss']
  for it in items:
   await wait_idle();await bar('lab')
   await frame.locator(f'input[name=labItem][value="{it}"]').check()
   await frame.locator('#labBet').select_option('100')
   await frame.locator('#labSeeded').click();await frame.locator('#labSeed').fill('1337');await frame.locator('#labAuto').uncheck();await frame.locator('#labRun').click()
   await frame.wait_for_function('PoolParty.lab.active()',timeout=10000)
   seen=[];beg=time.monotonic();taps=[];outroCaptured=False
   while await G('PoolParty.lab.active()') and time.monotonic()-beg<125:
    s=await snap();sc=await G('PoolParty.scene()');key=(sc['kind']+':'+sc['stage']) if sc else ('free:play' if s['freeMode'] else '')
    if key and key not in seen:
     seen.append(key)
     if key.endswith('outro') or key.endswith('intro') or (sc and sc['kind']=='vault' and sc['stage']=='play'):
      await shot(it+'-'+key.replace(':','-'))
     if key.endswith('outro'):outroCaptured=True
    if sc:
     if sc['stage']=='trigger':pass
     elif sc['kind']=='gamble' and sc['stage']=='intro':await bar('callDoom' if it=='gamble-loss' else 'callMoon')
     elif sc['kind']=='gamble' and sc['stage']=='play':pass
     elif sc['kind']=='vault' and sc['stage']=='play' and len(sc['picks'] or [])<3:
      before=len(sc['picks'] or [])
      if before==0:
       pos=await G("(()=>{const b=PoolParty.buttons().find(b=>/^tag/.test(b.id));if(!b)return null;const c=document.getElementById('fsCanvas').getBoundingClientRect();return [c.left+(b.x+b.w/2)/1400*c.width,c.top+(b.y+b.h/2)/960*c.height]})()")
       if pos:await pg.mouse.click(*pos);await pg.wait_for_timeout(100)
       aft=await G('PoolParty.scene()');taps.append({'canvas':True,'before':before,'after':len((aft or {}).get('picks') or [])})
      else:await tap('#fsAction')
     elif sc['stage']=='intro':await tap('#fsAction')
     elif sc['kind']=='chain' and sc['stage']=='play':
      # The canonical state machine automatically reveals respins at each nextAt.
      # Observe the animation and summary; do not race the automatic transition.
      pass
     elif sc['kind']=='jackpot' and sc['stage']=='play':
      # Its automatic outro follows the complete splash. No stale delayed click.
      pass
     elif sc['stage']=='outro':await tap('#fsAction')
    await pg.wait_for_timeout(200)
   still=await G('PoolParty.lab.active()');await check(it+' completes from intro through summary and returns account',not still and outroCaptured and any(k.endswith('intro') for k in seen),{'stages':seen,'seconds':round(time.monotonic()-beg,1),'canvasPicks':taps})
   if taps:await check(it+' canvas lounger hit matches selection',all(t['after']==t['before']+1 for t in taps),taps)
   if still:raise RuntimeError('Lab scenario did not finish: '+it)
   if it=='vault':
    geometry=await geom();res['afterBonusGeometry']=geometry
  account_after=await pg.evaluate('ParallaxLAYRAccount.snapshot().balance')
  real_after=await G('JSON.stringify({wagered:PoolParty.snapshot().state.wagered,paidOut:PoolParty.snapshot().state.paidOut,jackpots:PoolParty.jackpots(),fund:PoolParty.snapshot().state.fund})')
  await check('all Bonus Lab sessions isolate account and RTP/fund/jackpot state',account_before==account_after and real_before==real_after,{'balanceBefore':account_before,'balanceAfter':account_after})
  # Skip is a normal presentation action; preview state still settles and returns.
  await bar('lab');await frame.locator('input[name=labItem][value="vault"]').check();await frame.locator('#labRun').click();await frame.wait_for_function('PoolParty.scene()?.stage==="intro"',timeout=30000);await bar('skip');await pg.wait_for_timeout(200)
  await check('skip goes to bonus summary',await G('PoolParty.scene()?.stage==="outro"'))
  await tap('#fsAction');await pg.wait_for_timeout(300)
  await bar('exit');await pg.wait_for_timeout(350)
  ex=await pg.evaluate("(()=>{const f=document.querySelector('.pxLogicFrame'),r=f.getBoundingClientRect();return {x:r.x,api:!!document.fullscreenElement,hostClass:document.body.classList.contains('machine-fs'),ariaHidden:f.getAttribute('aria-hidden')}})()")
  await check('exit restores cabinet, hidden logic frame and browser fullscreen',not await G('PoolParty.snapshot().fsOn') and ex['x']<-1000 and not ex['api'] and not ex['hostClass'] and ex['ariaHidden']=='true',ex)
  await shot('exited')
 except Exception as e:
  await check('session completed',False,{'error':str(e),'trace':traceback.format_exc()})
  try:await shot('failure')
  except Exception:pass
 finally:
  await check('no JavaScript page errors',not errors,errors)
  res['pass']=all(s['pass'] for s in res['steps']);save();await ctx.close()

async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=CHROME,args=['--no-sandbox','--disable-gpu','--disable-webgl'])
  await session(b,'desktop',1366,768)
  if MODE!='retest':await session(b,'phone',390,844,True)
  if MODE=='layout':await session(b,'landscape',844,390,True)
  if MODE!='retest':await session(b,'fallback',1366,768,False,True)
  await b.close()
 RESULTS['pass']=all(s['pass'] for s in RESULTS['sessions'].values());save();print('PASS',RESULTS['pass'],flush=True)
try:asyncio.run(main())
finally:server.shutdown()

if not RESULTS.get('pass',False):raise SystemExit(1)
