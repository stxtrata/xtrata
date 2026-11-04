"""Observe moving reels in the real cabinet, including hidden-frame starvation.

PYTHONPATH=runtime-python python pool-party/checks/reels-motion-pool.py
--original runs the archived delivery; --starve drops only offscreen child-frame
rAF requests (a deliberate browser-throttling fault), never the parent clock.
All play actions use visible controls. Canvas hashes and engine snapshots are
read-only observations; no outcome, timing or balance is forced.
"""
import argparse, asyncio, hashlib, json, os, time
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
WORK=ROOT.parent
P=argparse.ArgumentParser()
P.add_argument('--original',action='store_true')
P.add_argument('--starve',action='store_true')
P.add_argument('--sequence',action='store_true',help='Also test fullscreen, return to cabinet and lever')
P.add_argument('--lite',action='store_true',help='Secondary performance fallback only')
P.add_argument('--software',action='store_true')
A=P.parse_args()
SOURCE=WORK/'recovered/Pool-Party.html' if A.original else ROOT/'index.html'
SUFFIX=('original' if A.original else 'fixed')+('-starved' if A.starve else '-native')+('-lite' if A.lite else '')+('-software' if A.software else '')
RESULT=ROOT/'checks/results'/('reels-motion-'+SUFFIX+'.json')
STARVE="""(() => { if(window.parent===window)return;
 const native=requestAnimationFrame.bind(window);window.__suppressedOffscreenRaf=0;
 window.requestAnimationFrame=function(callback){
  const r=window.frameElement&&window.frameElement.getBoundingClientRect();
  if(r&&(r.right<0||r.bottom<0)){window.__suppressedOffscreenRaf++;return -window.__suppressedOffscreenRaf;}
  return native(callback);
 };
})();"""
START_OBSERVER="""() => {
 const t=PoolPartyTest, w=t.frame.contentWindow, source=t.api.screen;
 const sample=document.createElement('canvas');sample.width=150;sample.height=60;
 const g=sample.getContext('2d',{willReadFrequently:true}),begin=performance.now();
 const rows=[],lever=t.model.getObjectByName('px-lever');
 function tick(){
  const s=w.PoolParty.snapshot(),hashes=[];
  g.clearRect(0,0,150,60);g.drawImage(source,45*2,(206+24)*2,1310*2,520*2,0,0,150,60);
  const d=g.getImageData(0,0,150,60).data;
  for(let i=0;i<5;i++){
   let h=2166136261;
   for(let y=0;y<60;y++)for(let x=i*30+3;x<i*30+27;x++)for(let k=0;k<4;k++)h=Math.imul(h^d[(y*150+x)*4+k],16777619);
   hashes.push((h>>>0).toString(16));
  }
  rows.push({ms:Math.round(performance.now()-begin),revision:t.api.revision(),
   spinning:s.spinning,spins:s.state.spins,pending:s.state.pending&&s.state.pending.id,
   balance:s.state.balance,bet:s.state.bet,lastWin:s.state.lastWin,
   historyCount:s.state.history.length,lastHistory:s.state.history[0]||null,
   scene:s.scene,fullscreen:s.fsOn,hashes,
   lever:lever?lever.rotation.x:null,perf:w.PoolParty.perf()});
 }
 tick();const timer=setInterval(tick,60);
 window.__reelObservation={rows,stop(){clearInterval(timer);tick();return rows;}};
 return {spins:w.PoolParty.snapshot().state.spins,revision:t.api.revision(),initial:rows[0]};
}"""
LEVER_POINT="""() => {
 const {model,camera}=PoolPartyTest;model.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 const lev=model.getObjectByName('px-lever');
 const pos=new THREE.Vector3(.06,.87,.12);lev.localToWorld(pos);pos.project(camera);
 return {x:(pos.x+1)*innerWidth/2,y:(1-pos.y)*innerHeight/2};
}"""

async def finish_bonus(page,game):
 for _ in range(20):
  s=await game.evaluate('PoolParty.snapshot()')
  if s['spinning']:
   await page.wait_for_timeout(200);continue
  if not s['scene'] and not s['freeMode']:return
  fs=s['fsOn'];scene=s['scene']
  if scene and scene['kind']=='gamble':
   await (game.locator('#fs_collect') if fs else page.locator('#portFeature #fbKeep')).click()
  elif scene and scene['stage']=='outro':
   await (game.locator('#fsAction') if fs else page.locator('#portFeature #fbGo')).click()
  else:
   await (game.locator('#fs_skip') if fs else page.locator('#cSkip')).click()
  await page.wait_for_timeout(150)
 raise RuntimeError('Bonus did not finish through visible Skip/Continue controls')

async def one_round(page,game,label,action):
 before=await page.evaluate(START_OBSERVER)
 started=time.monotonic()
 if action=='fullscreen':await game.locator('#fs_spin').click()
 elif action=='lever':
  point=await page.evaluate(LEVER_POINT);await page.mouse.click(point['x'],point['y'])
 elif action=='key':await page.keyboard.press('Space')
 else:await page.locator('#cSpin').click()
 settled=False
 try:
  await page.wait_for_function('old=>{const s=PoolPartyTest.frame.contentWindow.PoolParty.snapshot();return s.state.spins>old&&!s.spinning&&!s.state.pending;}',arg=before['spins'],timeout=12000,polling=100)
  settled=True
 except Exception:pass
 await page.wait_for_timeout(180)
 rows=await page.evaluate('window.__reelObservation.stop()')
 moving=[r for r in rows if r['spinning']]
 unique=[len(set(r['hashes'][i] for r in moving)) for i in range(5)]
 final=rows[-1]
 item={'label':label,'action':action,'seconds':round(time.monotonic()-started,3),
  'before':before,'after':final,'samples':len(rows),'spinningSamples':len(moving),
  'uniqueReelFramesWhileSpinning':unique,'revisionDelta':final['revision']-before['revision'],
  'settled':settled,'oneRound':final['spins']==before['spins']+1,
  'leverMoved':max(abs(r['lever'] or 0) for r in rows)>.03,'rows':rows,
  'accountingCorrect':round(final['balance']-(before['initial']['balance']-before['initial']['bet']+final['lastWin']),6)==0,
  'oneHistoryRecord':final['historyCount']==before['initial']['historyCount']+1,
  'ok':settled and final['spins']==before['spins']+1 and all(n>=2 for n in unique)}
 item['ok']=item['ok'] and item['accountingCorrect'] and item['oneHistoryRecord']
 print(json.dumps({k:v for k,v in item.items() if k not in ['rows','before','after']}),flush=True)
 return item

async def main():
 report={'source':str(SOURCE),'sourceSHA256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
  'completedAt':None,'faultInjection':'offscreen child rAF suppressed' if A.starve else 'none',
  'renderer':'CPU fallback' if A.software else 'Chromium SwiftShader WebGL',
  'viewport':{'width':1366,'height':900},'query':'lite=1' if A.lite else '',
  'pageErrors':[],'consoleErrors':[],'rounds':[]}
 async with async_playwright() as p:
  args=['--no-sandbox','--disable-dev-shm-usage']
  args+=['--disable-gpu','--disable-webgl'] if A.software else ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
  ignored=['--disable-background-timer-throttling','--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding']
  browser=await p.chromium.launch(executable_path=os.environ.get('CHROME',str(WORK/'runtime-browser/bin/chromium')),args=args,ignore_default_args=ignored)
  report['browser']=browser.version;report['removedPlaywrightDefaults']=ignored
  context=await browser.new_context(viewport=report['viewport'],offline=True)
  if A.starve:await context.add_init_script(STARVE)
  page=await context.new_page();page.set_default_timeout(60000)
  page.on('pageerror',lambda e:report['pageErrors'].append(str(e)))
  page.on('console',lambda e:report['consoleErrors'].append(e.text) if e.type=='error' else None)
  try:
   await page.goto(SOURCE.as_uri()+('?lite=1' if A.lite else ''),wait_until='domcontentloaded')
   await page.wait_for_function('window.PoolPartyTest&&PoolPartyTest.frame.contentWindow.PoolParty&&PoolPartyTest.frame.contentWindow.PoolParty.art().ready&&!PoolPartyTest.api.ui().spinDisabled',timeout=90000,polling=100)
   game=next(f for f in page.frames if f!=page.main_frame and f.url=='about:srcdoc')
   await page.wait_for_timeout(500)
   report['boot']=await page.evaluate('({webgl:PoolPartyTest.webglOK,gameReady:!!PoolPartyTest.frame.contentWindow.__bfReady,suppressedChildRequests:PoolPartyTest.frame.contentWindow.__suppressedOffscreenRaf||0,fullscreen:PoolPartyTest.api.ui().fullscreen,version:PoolPartyTest.frame.contentWindow.PoolParty.version})')
   report['rounds'].append(await one_round(page,game,'Default cabinet Spin button','button'))
   if A.sequence and report['rounds'][-1]['ok']:
    # Randomly awarded bonuses are completed with visible Skip/Continue controls.
    await finish_bonus(page,game)
    await page.locator('#fsBtn').click()
    await game.wait_for_function('PoolParty.snapshot().fsOn',polling=100)
    report['rounds'].append(await one_round(page,game,'Fullscreen Spin button','fullscreen'))
    await finish_bonus(page,game)
    await game.locator('#fs_exit').click()
    await page.wait_for_function('!PoolPartyTest.api.ui().fullscreen',polling=100)
    report['rounds'].append(await one_round(page,game,'Cabinet after leaving fullscreen','button'))
    await finish_bonus(page,game)
    report['rounds'].append(await one_round(page,game,'Cabinet physical lever','lever'))
   report['finalBoot']=await page.evaluate('({gameReady:!!PoolPartyTest.frame.contentWindow.__bfReady,suppressedChildRequests:PoolPartyTest.frame.contentWindow.__suppressedOffscreenRaf||0})')
  except Exception as e:
   report['exception']=str(e);print('EXCEPTION',str(e),flush=True)
  finally:
   report['completedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
   report['ok']=bool(report['rounds']) and all(r['ok'] for r in report['rounds']) and not report.get('exception') and not report['pageErrors']
   RESULT.parent.mkdir(exist_ok=True,parents=True);RESULT.write_text(json.dumps(report,indent=2)+'\n')
   await context.close();await browser.close()
 print(json.dumps({'result':str(RESULT),'ok':report['ok']}),flush=True)
 return 0 if report['ok'] else 1

if __name__=='__main__':raise SystemExit(asyncio.run(main()))
