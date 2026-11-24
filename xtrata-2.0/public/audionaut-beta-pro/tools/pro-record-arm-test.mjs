import assert from 'node:assert/strict';
import { serve, browser, page, selectWorkspace } from './serve.mjs';
import { makeProject } from '../daw/js/state.js';
import { STORAGE_KEYS } from '../daw/js/storage-config.js';
const edition = new URL('../',import.meta.url).pathname.split('/').filter(Boolean).at(-1);
const {srv,url}=await serve();
let b;
const fresh=async(width,height,hasTouch=false)=>{
  const logs=[],p=await page(b,url,{width,height,hasTouch,logs});
  const project=makeProject();
  await p.addInitScript(({key,project})=>localStorage.setItem(key,JSON.stringify({...project,format:'audionaut-workstation/3'})),{key:STORAGE_KEYS.legacyProject,project});
  await p.goto(url+'/'+edition+'/daw.html');
  await p.waitForSelector('#pro-workspace-nav');
  await p.evaluate(async base=>{
    window.test={...(await import(base+'state.js')),engine:(await import(base+'engine.js')).engine,
      live:await import(base+'live-keys.js'),roll:await import(base+'pianoroll.js')};
  },'/'+edition+'/daw/js/');
  await p.waitForFunction(id=>test.store.project.projectId===id,project.projectId);
  await p.waitForFunction(()=>document.querySelector('#btn-record')?.dataset.recordArm===test.store.instrument(0).id);
  return {p,logs};
};
const advance=async(p,seconds)=>p.evaluate(async seconds=>{
  const ctx=test.engine.ensureContext();await ctx.resume();
  const until=ctx.currentTime+seconds,deadline=performance.now()+4500;
  while(ctx.currentTime<until){
    if(performance.now()>deadline)throw Error('Audio clock stopped');
    await new Promise(resolve=>setTimeout(resolve,10));
  }
},seconds);
const noteCount=p=>p.evaluate(()=>test.store.seq.notes[0].length);
try {
  b=await browser();
  const {p,logs}=await fresh(1400,900);
  await selectWorkspace(p,'Sequences');
  const dock=p.locator('#synth-dock');
  const arm=dock.locator('#synth-record-arm');
  const main=p.locator('#btn-record');
  await dock.locator('[data-midi-quantize-grid]').selectOption('0');
  await arm.click();
  assert.equal(await arm.getAttribute('data-record-mode'),'armed');
  assert.equal(await main.getAttribute('aria-pressed'),'true');
  assert.equal(await p.locator('#instruments .record-arm-btn').first().getAttribute('aria-pressed'),'true');
  await advance(p,.03);
  await p.keyboard.down('a');await advance(p,.18);await p.keyboard.up('a');
  await p.waitForFunction(()=>test.store.seq.notes[0].length===1);
  const first=await p.evaluate(()=>test.store.seq.notes[0][0]);
  assert.ok(first.rawStep<.05&&first.rawDur>0.8,JSON.stringify(first));
  assert.equal(await arm.getAttribute('data-record-mode'),'recording');
  await advance(p,.16);
  await p.keyboard.down('s');await advance(p,.12);await p.keyboard.up('s');
  assert.equal(await noteCount(p),2);
  await p.keyboard.down('d');await advance(p,.09);await arm.click();await p.keyboard.up('d');
  assert.equal(await noteCount(p),3,'disarm finalizes the held recorded note');
  assert.equal(await p.evaluate(()=>test.engine.isPlaying),true,'disarming never stops playback');
  await p.keyboard.down('f');await advance(p,.1);await p.keyboard.up('f');
  assert.equal(await noteCount(p),3,'disarmed notes are only auditioned');
  await p.click('#btn-stop');
  const before=await p.evaluate(()=>test.store.seq.notes[0].map(n=>[n.rawStep,n.rawDur]));
  await dock.locator('[data-midi-quantize-grid]').selectOption('1');
  await dock.locator('.record-quantize-apply').click();
  assert.ok(await p.evaluate(()=>test.store.seq.notes[0].some(n=>Math.abs(n.rawStep-n.step)>.01)));
  await dock.locator('[data-midi-quantize-grid]').selectOption('0');
  await dock.locator('.record-quantize-apply').click();
  assert.deepEqual(await p.evaluate(()=>test.store.seq.notes[0].map(n=>[n.step,n.dur])),before);
  assert.deepEqual(logs.filter(e=>e.startsWith('pageerror')),[]);
  await p.close();

  const mobile=await fresh(390,844,true),m=mobile.p;
  await selectWorkspace(m,'Mobile');
  const trackId=await m.evaluate(()=>test.store.instrument(0).id);
  await m.locator('#mobile-track').selectOption(trackId);
  const mobileArm=m.locator('.mobile-record-tools .record-arm-btn');
  await mobileArm.click();
  assert.equal(await mobileArm.getAttribute('data-record-mode'),'armed');
  await m.getByRole('button',{name:'Play live',exact:true}).first().click();
  const player=m.locator('dialog.expanded-keyboard.playing-full');
  await player.locator('.live-ready').filter({hasText:'Ready'}).waitFor();
  const liveArm=player.locator('.record-arm-btn');
  assert.equal(await liveArm.getAttribute('data-record-mode'),'armed');
  await player.locator('.expanded-keybed [data-midi][aria-disabled=false]').first().tap();
  await m.waitForFunction(()=>test.store.seq.notes[0].length===1);
  await player.getByRole('button',{name:'Stop transport',exact:true}).click();
  assert.equal(await liveArm.getAttribute('data-record-mode'),'armed');
  await player.locator('[data-midi-quantize-grid]').selectOption('0.5');
  await player.locator('.record-quantize-apply').click();
  assert.ok(await m.evaluate(()=>test.store.seq.notes[0][0].dur>0));
  await liveArm.click();
  assert.equal(await liveArm.getAttribute('aria-pressed'),'false');
  assert.ok(await player.locator('.expanded-record-controls').evaluate(n=>{
    const r=n.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;
  }));
  await player.getByRole('button',{name:'Done',exact:true}).click();
  await m.setViewportSize({width:320,height:568});
  await m.locator('#btn-record').scrollIntoViewIfNeeded();
  assert.ok(await m.locator('#btn-record').evaluate(n=>n.getBoundingClientRect().right<=innerWidth));
  assert.deepEqual(mobile.logs.filter(e=>e.startsWith('pageerror')),[]);
  await m.close();
  console.log('PASS desktop and mobile record arm, first note, disarm during playback, re-quantisation and full-screen controls');
}finally{await b?.close();await new Promise(resolve=>srv.close(resolve));}
