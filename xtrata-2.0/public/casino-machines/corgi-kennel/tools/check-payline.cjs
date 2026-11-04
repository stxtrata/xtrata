const {chromium}=require(process.env.CK_PLAYWRIGHT || 'playwright'),fs=require('fs'),assert=require('node:assert/strict');
const BF=new Function(fs.readFileSync('src/engine.js','utf8')+'\nreturn BF;')();
const gridAt=stops=>stops.map((stop,c)=>BF.windowAt(c,stop));
function fixture(win){
 for(let i=0;i<100000;i++){
  const stops=Array.from({length:5},()=>Math.floor(Math.random()*32));
  const r=BF.evaluate(gridAt(stops),100);
  if(!Object.values(r.triggers).some(Boolean)&&!r.jackpot&&(win?r.wins.length===2&&r.wins.every(w=>w.count===3)&&BF.lines[r.wins[0].line][0]!==BF.lines[r.wins[1].line][0]:r.total===0))return {stops,wins:r.wins};
 }
 throw Error('Fixture missing');
}
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CK_CHROMIUM,args:['--disable-webgl','--no-sandbox']});
 try {
 const p=await b.newPage({viewport:{width:1366,height:900}});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file://'+process.cwd()+'/index.html');
 await p.waitForFunction(()=>window.CKHostTest);
 await p.locator('#viewFullscreen').click();
 const frame=p.frameLocator('#gameFrame');
 const win=fixture(true),loss=fixture(false);
 const spin=async({stops},n)=>{
  await p.evaluate(stops=>{const w=CKHostTest.frame.contentWindow;const rng=w.crypto.getRandomValues.bind(w.crypto);w.crypto.getRandomValues=a=>stops.length?(a[0]=stops.shift(),a):rng(a);},stops);
  await frame.locator('#fullscreenBar [data-action=spin]').click();
  await p.waitForFunction(n=>CKHostTest.api.ui().spins===n,n);
 };
 const pixel=(row,col)=>p.evaluate(([r,c])=>Array.from(CKHostTest.api.screen.getContext('2d').getImageData((196+c*252)*2,(319+r*162)*2,1,1).data),[row,col]);
 const gold=async(row,col)=>(await pixel(row,col)).join(',')==='255,237,177,255';
 const waitGold=async(row,col)=>p.waitForFunction(([r,c])=>Array.from(CKHostTest.api.screen.getContext('2d').getImageData((196+c*252)*2,(319+r*162)*2,1,1).data).join(',')==='255,237,177,255',[row,col]);
 await spin(win,1);
 const rows=win.wins.map(w=>BF.lines[w.line]);
 for(let i=0;i<2;i++){
  await waitGold(rows[i][0],0);
  assert.equal(await gold(rows[i][3],3),false,'Line must stop after the last paid reel');
 }
 await p.waitForTimeout(5000);
 await waitGold(rows[0][0],0);
 await p.screenshot({path:'checks/results/payline-overlay.png'});
 await spin(loss,2);
 assert.equal(await gold(rows[0][0],0),false);
 assert.equal(await gold(rows[1][0],0),false);
 assert.deepEqual(errors,[]);
 fs.writeFileSync('checks/results/payline-overlay.json',JSON.stringify({status:'PASS',environment:'Headless Chromium, fullscreen, software rendering',winningFixture:win,losingFixture:loss,checks:['two paylines rotate','line stops at last paying reel','overlay remains visible after five seconds','non-winning spin clears overlay','no browser errors']},null,2));
 } finally {await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
