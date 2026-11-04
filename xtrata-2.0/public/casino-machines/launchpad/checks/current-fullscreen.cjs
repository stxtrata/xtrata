const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs');
const assert=require('assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-webgl']});
const results=[];
try{
for(const [width,height] of [[1366,900],[390,844]]){
 const page=await browser.newPage({viewport:{width,height},hasTouch:width===390});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+process.cwd()+'/index.html?qa=fullscreen-'+width+'-'+Date.now());
 await page.waitForFunction(()=>PX_STUDIO?.diagnostics().ready);
 // Exercise the iPhone-style fixed layer by disabling only the native call.
 await page.evaluate(()=>document.documentElement.requestFullscreen=undefined);
 await page.locator('#fullTop').click();
 const frame=page.frameLocator('#gameFrame');
 const out=await frame.locator('#fullControls').evaluate(nav=>{
   const api=window.PX_CASINO_ENGINE, doc=document;
   const control=name=>nav.querySelector('[data-action="'+name+'"]');
   const items=[...nav.querySelectorAll('button,input')].filter(el=>!el.hidden).map(el=>({name:el.dataset.action||el.dataset.input,width:el.offsetWidth,height:el.offsetHeight,top:el.offsetTop}));
   const before=api.ui().bet;control('betUp').click();const up=api.ui().bet;control('betDown').click();
   const menus=['pays','fair','history','fund','settings','preview','lab','test'].map(name=>{
    control(name).click();const u=api.ui(),panel=doc.getElementById('panel').getBoundingClientRect(),bar=nav.getBoundingClientRect();
    doc.getElementById('closePanel').click();return {name,opened:u.modalOpen,above:panel.bottom<=bar.top+1,closed:!api.ui().modalOpen};
   });
   return {fullscreen:api.ui().fullscreen,items,menus,bets:[before,up,api.ui().bet],noOverflow:doc.documentElement.scrollWidth<=innerWidth};
 });
 assert.ok(width!==1366||Math.max(...out.items.map(i=>i.top))-Math.min(...out.items.map(i=>i.top))<12,'Desktop controls must stay on one row');
 assert.equal(out.fullscreen,true);assert.deepEqual(out.bets,[100,200,100]);
 assert.ok(out.menus.every(m=>m.opened&&m.above&&m.closed));
 assert.ok(out.items.every(i=>i.width>=44&&i.height>=44));assert.ok(out.noOverflow);
 await page.screenshot({path:'checks/results/rebuild-fullscreen-'+width+'.jpg'});
 await frame.locator('[data-action="fullscreenExit"]').click();
 assert.equal(await page.evaluate(()=>PX_STUDIO.diagnostics().fullscreen),false);
 assert.deepEqual(errors,[]);results.push({width,height,...out,errors,pass:true});
 await page.close();
}
}finally{await browser.close();fs.writeFileSync('checks/results/rebuild-fullscreen-smoke.json',JSON.stringify({pass:results.length===2,results},null,2)+'\n');}
})().catch(e=>{console.error(e);process.exit(1)});
