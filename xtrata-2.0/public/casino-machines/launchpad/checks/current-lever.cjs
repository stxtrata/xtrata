const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs');
const assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-webgl']});
 try {
  const p=await browser.newPage({viewport:{width:1024,height:768}});
  await p.goto('file://'+process.cwd()+'/index.html?qa=raycast-'+Date.now());
  await p.waitForFunction(()=>PX_STUDIO?.diagnostics().ready);
  await p.mouse.click(625,431);
  const hit=await p.evaluate(()=>{const api=document.querySelector('#gameFrame').contentWindow.PX_CASINO_ENGINE;return {actions:PX_STUDIO.diagnostics().actions,mechanics:api.mechanics(),pendingId:api.ui().pendingId};});
  assert.equal(hit.actions.lever,1);assert.ok(hit.mechanics.lever);assert.ok(hit.pendingId);
  await p.waitForFunction(()=>ParallaxLAYRAccount.snapshot().games.launchpad?.spins===1);
  const settled=await p.evaluate(()=>ParallaxLAYRAccount.snapshot().games.launchpad);
  assert.equal(settled.pending,null);
  fs.writeFileSync('checks/results/rebuild-lever.json',JSON.stringify({pass:true,renderer:'software',hit,settledSpins:settled.spins},null,2)+'\n');
  console.log('Lever raycast, motion payload and one settlement passed');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
