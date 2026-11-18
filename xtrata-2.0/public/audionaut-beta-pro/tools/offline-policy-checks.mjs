import assert from 'node:assert/strict';

// This is a product-policy test, not a claim that a short native render probe
// proves WebKit offline fidelity. Source processing and real-time audio remain
// useful and supported when delivery APIs explicitly refuse final audio output.
export async function checkOfflinePolicy(page, url) {
  await page.goto(`${url}/audionaut-beta-pro/daw.html`);
  await page.waitForFunction(() => document.querySelectorAll('.channel.instrument').length >= 4);
  const result = await page.evaluate(async () => {
    const base='/audionaut-beta-pro/daw/js/';
    const {offlineRenderSupport}=await import(base+'audio-render-support.js');
    const support=offlineRenderSupport();
    const {store,makeProject}=await import(base+'state.js');
    const {engine,Engine}=await import(base+'engine.js');
    const {renderMix,renderStems}=await import(base+'render-mix.js');
    const {freezeTrack}=await import(base+'pro-freeze.js');
    const {exportProject}=await import(base+'persistence.js');
    const {compilePlaybackPlan}=await import(base+'playback-plan.js');
    store.loadProject(makeProject());
    const snapshot=JSON.stringify(store.project),generation=store.generation,progress=[];
    const Native=globalThis.OfflineAudioContext;let contexts=0;const failures=[],injected=[];let graphNodes=0;
    if(!support.supported){
      globalThis.OfflineAudioContext=class extends Native {constructor(...args){contexts++;super(...args);}};
      try{
        for(const [name,call] of [
          ['mix',()=>renderMix(store.project,[],{onProgress:p=>progress.push(p)})],
          ['stems',()=>renderStems(store.project,[],{onProgress:p=>progress.push(p)})],
          ['freeze',()=>freezeTrack(store.instrument(0).id,{onProgress:p=>progress.push(p)})],
          ['engine',()=>new Engine({offline:true})],
        ]){try{await call();failures.push({name,unexpectedSuccess:true});}catch(error){failures.push({name,code:error.code,message:error.message});}}
      }finally{globalThis.OfflineAudioContext=Native;}
      // An injected offline context must not bypass the public Engine guard.
      // A mock avoids allocating native resources and proves graph construction
      // is never reached, even on a second ensureContext attempt.
      const candidate=new Engine({contextFactory:()=>({startRendering(){},createGain(){graphNodes++;throw Error('Unexpected graph creation');}})});
      for(let attempt=0;attempt<2;attempt++){try{candidate.ensureContext();injected.push({unexpectedSuccess:true});}catch(error){injected.push({code:error.code,contextRetained:candidate.ctx!==null});}}
    }
    const unchanged=JSON.stringify(store.project)===snapshot&&store.generation===generation;
    const portable=JSON.parse(exportProject());
    const trackId=store.instrument(0).id;store.setTimeline({enabled:true,clips:[],lengthBeats:4});
    const left=store.addClip({id:'left',trackId,type:'midi',start:0,duration:1,offset:0,notes:[{id:'held-note',step:0,dur:8,pitch:60,vel:.8,expression:[{offset:.5,type:'bend',value:2}]}]});
    store.addClip({...structuredClone(left),id:'right',start:1,duration:1,offset:1});
    const notes=compilePlaybackPlan(store.project).events.filter(e=>e.type==='note');
    let invalidLoop=false;try{store.setTimeline({loop:{enabled:true,start:4,end:2}});}catch{invalidLoop=true;}
    store.setAutomationLane({target:{trackId,kind:'pan'},points:[{beat:0,value:0,curve:'step'},{beat:4,value:1,curve:'linear'}]});
    const stepAutomation=compilePlaybackPlan(store.project).events.filter(e=>e.type==='automation').every(e=>e.curve==='step');
    const {exportMidiFile,parseMidiFile}=await import(base+'midi-file.js');
    const midi=parseMidiFile(exportMidiFile(store.project));
    const {pianoStarterSample}=await import(base+'synths/keys/concertpiano.js');
    const ctx=engine.ensureContext(),sample=pianoStarterSample(ctx,60,2);
    const {processSample}=await import(base+'sample-processing.js');
    const processed=await processSample(sample,'peaks');
    const worker={length:processed.peaks[0].length,finite:processed.peaks[0].every(Number.isFinite),audible:processed.peaks[0].some(v=>Math.abs(v)>.01)};
    store.setInstrumentProp(0,'synthId','concertpiano');
    // Install a real click listener: browser autoplay policies must be exercised,
    // rather than mistaking a suspended context for a working live instrument.
    const button=document.createElement('button');button.id='policy-live-audio';button.textContent='Test live piano';document.body.append(button);
    button.addEventListener('click',()=>{window.policyLiveResult=(async()=>{
      await ctx.resume();const analyser=ctx.createAnalyser();analyser.fftSize=2048;engine.masterGain.connect(analyser);
      const note=engine.startNote(0,60,.8),data=new Float32Array(analyser.fftSize);let peak=0;
      for(let i=0;i<24&&peak<.001;i++){await new Promise(r=>setTimeout(r,25));analyser.getFloatTimeDomainData(data);for(const v of data)peak=Math.max(peak,Math.abs(v));}
      engine.releaseNote(note);await new Promise(r=>setTimeout(r,500));const released=!engine._synthVoices.has(note);engine.releaseAll(null,{immediate:true});analyser.disconnect();button.remove();return{peak,released,time:ctx.currentTime};
    })();},{once:true});
    return{support,failures,injected,graphNodes,contexts,progress:progress.length,unchanged,projectExport:portable.format,split:{count:notes.length,duration:notes[0].duration,bend:notes[0].expression.some(p=>p.value===2)},invalidLoop,stepAutomation,midiNotes:midi.tracks.reduce((n,t)=>n+t.notes.length,0),worker};
  });
  assert.equal(result.unchanged,true);assert.equal(result.contexts,0);assert.equal(result.progress,0);assert.equal(result.graphNodes,0);
  assert.equal(result.projectExport,'audionaut-workstation/3');
  assert.deepEqual(result.split,{count:1,duration:1,bend:true});assert.equal(result.invalidLoop,true);assert.equal(result.stepAutomation,true);assert.ok(result.midiNotes>0);
  assert.deepEqual(result.worker,{length:2048,finite:true,audible:true});
  if(!result.support.supported){assert.equal(result.failures.length,4);assert.deepEqual(result.injected,[{code:'AUDIONAUT_OFFLINE_WEBKIT_UNSUPPORTED',contextRetained:false},{code:'AUDIONAUT_OFFLINE_WEBKIT_UNSUPPORTED',contextRetained:false}]);for(const failure of result.failures){assert.equal(failure.code,'AUDIONAUT_OFFLINE_WEBKIT_UNSUPPORTED',JSON.stringify(failure));assert.equal(failure.message,result.support.reason);}}
  await page.locator('#policy-live-audio').click();result.live=await page.evaluate(()=>window.policyLiveResult);
  assert.ok(result.live.peak>.001,JSON.stringify(result.live));assert.equal(result.live.released,true);assert.ok(result.live.time>0);
  await page.locator('#btn-publish').click();
  const ui=await page.evaluate(()=>({notice:document.querySelector('#publish-audio-support').textContent,visible:!document.querySelector('#publish-audio-support').hidden,disabled:[...document.querySelector('#publish-format').options].filter(o=>['audio','stems'].includes(o.value)).map(o=>o.disabled)}));
  assert.deepEqual(ui.disabled,[!result.support.supported,!result.support.supported]);assert.equal(ui.visible,!result.support.supported);
  if(!result.support.supported){
    assert.equal(ui.notice,result.support.reason);
    for(const format of ['audio','stems']){
      await page.locator('#publish-format').evaluate((select,value)=>{select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));},format);
      assert.equal(await page.locator('#publish-prepare').isDisabled(),true);assert.equal(await page.locator('#publish-status').textContent(),result.support.reason);
    }
    await page.selectOption('#publish-format','project');assert.equal(await page.locator('#publish-prepare').isEnabled(),true);
    await page.locator('#publish-prepare').click();await page.waitForFunction(()=>!document.querySelector('#publish-download').disabled);
  }
  await page.locator('#publish-close').click();
  await page.evaluate(async()=>{const{openWorkspace}=await import('/audionaut-beta-pro/daw/js/pro-workspace.js');await openWorkspace('performance');});
  const freeze=page.getByRole('button',{name:'Freeze track',exact:true});await freeze.waitFor();assert.equal(await freeze.isDisabled(),!result.support.supported);
  if(!result.support.supported)assert.equal(await page.locator('#freeze-audio-support').textContent(),result.support.reason);
  result.ui={publishRestricted:!result.support.supported,freezeRestricted:await freeze.isDisabled(),projectPreparationAvailable:true};
  return result;
}
