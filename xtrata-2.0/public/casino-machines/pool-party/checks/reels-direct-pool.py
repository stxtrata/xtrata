"""Smoke the unhosted production game's own visible-window animation clock.
PYTHONPATH=runtime-python python pool-party/checks/reels-direct-pool.py
No developer flag, host frame, outcome forcing, or animation-clock modification.
"""
import asyncio,hashlib,json,os,time
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
FILE=ROOT/'dist/game.html'
KEY='xtrata.parallax.layr.account.v1'
OBSERVER="""() => {
 const c=document.createElement('canvas');c.width=150;c.height=60;
 const g=c.getContext('2d',{willReadFrequently:true}),rows=[],start=performance.now();
 function tick(){const a=PX_CASINO_ENGINE,u=a.ui(),hashes=[];
  g.drawImage(a.screen,90,460,2620,1040,0,0,150,60);
  const d=g.getImageData(0,0,150,60).data;
  for(let i=0;i<5;i++){let h=2166136261;
   for(let y=0;y<60;y++)for(let x=i*30+3;x<i*30+27;x++)for(let k=0;k<4;k++)h=Math.imul(h^d[(y*150+x)*4+k],16777619);
   hashes.push((h>>>0).toString(16));}
  rows.push({ms:Math.round(performance.now()-start),hashes,spinning:u.spinning,spins:u.spins,balance:u.balance,bet:u.bet,win:u.win,revision:a.revision()});
 }tick();const id=setInterval(tick,40);window.__directReelObserver={stop(){clearInterval(id);tick();return rows;}};return rows[0];
}"""
async def main():
 r={'sourceSHA256':hashlib.sha256(FILE.read_bytes()).hexdigest(),'pageErrors':[],'renderer':'Chromium CPU canvas; direct production game'}
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('CHROME',str(ROOT.parent/'runtime-browser/bin/chromium')),args=['--no-sandbox','--disable-gpu','--disable-webgl'],ignore_default_args=['--disable-background-timer-throttling','--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding'])
  c=await b.new_context(viewport={'width':1366,'height':1000},offline=True)
  await c.add_init_script("localStorage.setItem('xtrata.parallax.layr.account.v1',JSON.stringify({bank:100000,layrGames:{}}))")
  page=await c.new_page();page.on('pageerror',lambda e:r['pageErrors'].append(str(e)))
  try:
   await page.goto(FILE.as_uri(),wait_until='domcontentloaded')
   await page.wait_for_function('window.PX_CASINO_ENGINE&&!PX_CASINO_ENGINE.ui().spinDisabled&&window.__bfReady',timeout=60000,polling=100)
   await page.wait_for_timeout(300)
   r['production']=await page.evaluate('({unhosted:window===window.parent,dev:PX_CASINO_ENGINE.dev,diagnostic:typeof window.PoolParty})')
   r['before']=await page.evaluate(OBSERVER)
   await page.locator('#spin').click()
   await page.wait_for_function('old=>PX_CASINO_ENGINE.ui().spins===old+1&&!PX_CASINO_ENGINE.ui().spinning',arg=r['before']['spins'],timeout=15000,polling=100)
   rows=await page.evaluate('__directReelObserver.stop()');r['rows']=rows;r['after']=rows[-1]
   moving=[x for x in rows if x['spinning']]
   r['uniqueReelFramesWhileSpinning']=[len({x['hashes'][i] for x in moving}) for i in range(5)]
   r['accountingCorrect']=round(r['after']['balance']-(r['before']['balance']-r['before']['bet']+r['after']['win']),6)==0
   r['oneRound']=r['after']['spins']==r['before']['spins']+1
   r['saved']=await page.evaluate('k=>JSON.parse(localStorage.getItem(k))',KEY)
   r['ok']=all(x>=2 for x in r['uniqueReelFramesWhileSpinning']) and r['accountingCorrect'] and r['oneRound'] and not r['pageErrors'] and r['production']=={'unhosted':True,'dev':False,'diagnostic':'undefined'}
  except Exception as e:r['exception']=str(e);r['ok']=False
  finally:
   await c.close();await b.close()
 r['completedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
 (ROOT/'checks/results/reels-motion-direct.json').write_text(json.dumps(r,indent=2)+'\n')
 print(json.dumps({k:v for k,v in r.items() if k not in ['rows','saved']}),flush=True)
 return 0 if r['ok'] else 1
if __name__=='__main__':raise SystemExit(asyncio.run(main()))
