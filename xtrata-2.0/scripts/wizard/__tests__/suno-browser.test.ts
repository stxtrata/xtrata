import { it, expect } from 'vitest';
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { installSunoFunding, sha256 } from '../suno-funding.mjs';

it.runIf(process.env.XTRATA_BROWSER_TESTS==='1')('real Suno page routes single and batch deposits through the local bridge, never the extension',async()=>{
  const browser=await chromium.launch({headless:true, channel:process.env.PLAYWRIGHT_CHANNEL || 'chrome'});
  try {
    const page=await browser.newPage();
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    const address='SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
    const deposit='SP350M055TC2KYXHC2DTD616XB3FNT0YZHS3XDXVQ';
    const url='https://suno-harness.test/suno.html';
    const html=readFileSync(new URL('../../../xtrata-agent-one/wizard/suno.html',import.meta.url),'utf8');
    await page.route('**/*',route=>route.fulfill({status:200,contentType:route.request().url()===url?'text/html':'application/javascript',body:route.request().url()===url?html:''}));
    const payments:any[]=[];
    await installSunoFunding(page,{url,address,fund:async request=>{payments.push(request);throw new Error('SIMULATION: no deposit sent');}});
    await page.addInitScript(({deposit})=>{
      const w=window as any;
      w.extensionCalls=0;
      w.XtrataWallet={getAddress:()=>{w.extensionCalls++;return 'PERSONAL';},connect:()=>{w.extensionCalls++;},pay:()=>{w.extensionCalls++;}};
      w.XAO_AGENT_BUILD='2026-09-11';
      w.XtrataAgent={health:async()=>({net:'mainnet',mock:false}),listJobs:async()=>[],
        estimate:async()=>({requiredUstx:'100000'}),estimateBatch:async()=>({requiredUstx:'100000'}),
        createJob:async payload=>{w.lastPayload={user:payload.user,expectedFunder:payload.expectedFunder};
          return {...w.lastPayload,jobId:'job-ui-test',depositAddress:deposit,requiredUstx:'100000'};},
        getJob:async()=>({job:{jobId:'job-ui-test',status:'AWAITING_DEPOSIT',depositAddress:deposit,requiredUstx:'100000'},status:{funded:false}})};
      const result=()=>({playerFile:new File(['<html>test song</html>'],'song.html',{type:'text/html'}),html:'<html>test song</html>',title:'Test song',artist:'Disposable wizard',lyrics:'Test lyrics',hasCover:true,hasTitle:true,hasArtist:true,hasLyrics:true});
      w.XtrataSuno={probe:async()=>result(),build:async()=>result()};
    },{deposit});
    await page.goto(url);
    await page.locator('#picker').setInputFiles({name:'song.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('fixture')});
    await page.waitForFunction(()=>!(document.querySelector('#go') as HTMLButtonElement).disabled);
    await page.locator('#go').click();
    await page.waitForFunction(()=>document.querySelector('#hint')?.textContent?.includes('SIMULATION'));
    expect(payments).toEqual([expect.objectContaining({recipient:deposit,expectedFunder:address,user:address,playerHashes:[sha256('<html>test song</html>')]})]);
    expect(await page.evaluate(()=>(window as any).extensionCalls)).toBe(0);
    // Exercise the batch payment construction with two prepared player Files.
    await page.evaluate(()=>{
      // @ts-ignore: classic-script state belongs to the real Suno page
      SB.active=true; SB.EST={requiredUstx:'100000'}; SB.items=[0,1].map(()=>({status:'ready',player:new File(['<html>test song</html>'],'song.html',{type:'text/html'}),info:{title:'Song'},needs:[]}));
      // @ts-ignore
      sbUpdateGo(); document.querySelector('#sunoBatch').style.display='block';
    });
    await page.locator('#sbGo').click();
    await page.waitForFunction(()=>document.querySelector('#sbHint')?.textContent?.includes('SIMULATION'));
    expect(payments[1].playerHashes).toEqual([sha256('<html>test song</html>'),sha256('<html>test song</html>')]);
    // A child player cannot invoke the local funding capability.
    const child=page.frames().find(f=>f!==page.mainFrame());
    if(!child) throw new Error('Expected the real preview iframe');
    await expect(child.evaluate(request=>(window as any).__xtrataWizardPay(request),payments[0])).rejects.toThrow();
    await page.locator('#connectBtn').click();
    expect(await page.evaluate(()=>(window as any).XtrataWizardFunding.getAddress())).toBe(null);
    expect(await page.evaluate(()=>(window as any).extensionCalls)).toBe(0);
    expect(errors).toEqual([]);
  } finally {await browser.close();}
},30000);
