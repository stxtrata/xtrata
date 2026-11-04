const {chromium}=require(process.env.CK_PLAYWRIGHT || 'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const b=await chromium.launch({executablePath:process.env.CK_CHROMIUM || undefined,args:['--disable-webgl','--no-sandbox']});const out=[];
for(const width of [1366,390]){
const height=width===390?844:900,p=await b.newPage({viewport:{width,height},hasTouch:width===390,deviceScaleFactor:width===390?2:1});
const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('file://'+process.cwd()+'/index.html');await p.waitForFunction(()=>window.CKHostTest);
const result={width,height,errors};
if(width===1366){
result.lever=await p.evaluate(()=>{
const h=CKHostTest,lead=h.model.getObjectByName('px-leverGripTarget'),p=lead.getWorldPosition(lead.position.clone());
h.renderer.domElement.addEventListener('pointerup',()=>{
  window.verifiedLead=!!h.api.mechanics().lever&&!!h.api.inspect().state.pending;
},{once:true});
p.project(h.camera);return{x:(1+p.x)*innerWidth/2,y:(1-p.y)*innerHeight/2};
});
await p.mouse.click(result.lever.x,result.lever.y);
result.leverTriggered=await p.evaluate(()=>window.verifiedLead===true);
assert.ok(result.leverTriggered,'Clicking the brass grip should pull the lead and commit a spin');
await p.waitForFunction(()=>!CKHostTest.api.ui().spinning);
}
await p.locator('#viewFullscreen').click();
const frame=p.frameLocator('#gameFrame'),bar=frame.locator('#fullscreenBar');
await bar.locator('[data-action=betUp]').click();
assert.equal(await p.evaluate(()=>CKHostTest.api.ui().bet),200);
await bar.locator('[data-action=betDown]').click();
for(const action of ['turbo','sound','auto','auto']) await bar.locator(`[data-action=${action}]`).click();
result.controls=await bar.evaluate(b=>[...b.querySelectorAll('button,input')].filter(e=>e.getBoundingClientRect().width).map(e=>({label:e.getAttribute('aria-label')||e.innerText,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})));
result.overflow=await bar.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
result.panels=[];
for(const action of ['pays','fair','fund','history','settings','lab','test']){
await bar.locator(`[data-action=${action}]`).click();
result.panels.push({action,visible:await frame.locator('#modal').isVisible()});
await frame.locator('#closePanel').click();
}
await p.screenshot({path:`checks/results/current-fullscreen-${width}.png`});
await bar.locator('[data-action=exitFullscreen]').click();
assert.equal(await p.evaluate(()=>CKHostTest.api.ui().fullscreen),false);
assert.ok(result.panels.every(panel=>panel.visible));
assert.ok(result.controls.every(control=>control.width>=43.99&&control.height>=43.99));
assert.equal(result.overflow,false);
assert.equal(errors.length,0);
out.push(result);await p.close();
}
fs.writeFileSync('checks/results/current-file-smoke.json',JSON.stringify(out,null,2));
console.log(out.map(({width,errors,overflow,leverTriggered,panels,controls})=>({width,errors,overflow,leverTriggered,panels,small:controls.filter(c=>c.width<43.99||c.height<43.99)})));
await b.close();})().catch(e=>{console.error(e);process.exit(1)});
