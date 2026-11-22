import { selectWorkspace } from './serve.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
// A stopped recorder must surrender its AudioWorklet lifetime after flushing.
let Capture;const captureScope={AudioWorkletProcessor:class{constructor(){this.port={messages:[],postMessage(value){this.messages.push(value);}};}},currentFrame:0,registerProcessor:(_name,type)=>{Capture=type;}};
vm.runInNewContext(await readFile(new URL('../daw/js/record-input-worklet.js',import.meta.url),'utf8'),captureScope);
const stoppedCapture=new Capture({processorOptions:{}});assert.equal(stoppedCapture.process([[new Float32Array(128).fill(.2)]]),true);stoppedCapture.port.onmessage({data:'stop'});assert.equal(stoppedCapture.process([[]]),false);assert.equal(stoppedCapture.port.messages[0].channels[0].length,128);assert.equal(stoppedCapture.port.messages.at(-1).done,true);
const punchedCapture=new Capture({processorOptions:{endFrame:64}});assert.equal(punchedCapture.process([[new Float32Array(128)]]),false);assert.equal(punchedCapture.port.messages[0].channels[0].length,64);assert.equal(punchedCapture.port.messages.at(-1).done,true);
import {serve,browser,page} from './serve.mjs';
const {srv,url}=await serve(),b=await browser(),logs=[];
let phase='launch',testPage;
const progress=(name,details='')=>{phase=name;console.log(`[workspace ${new Date().toISOString()}] ${name}${details?' '+JSON.stringify(details):''}`);};
const closePage=async p=>{progress('close workstation page');let timer;try{await Promise.race([p.close({runBeforeUnload:false}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Workstation page cleanup exceeded 10 seconds.')),10000);})]);}finally{clearTimeout(timer);}};
const watchdog=setTimeout(()=>{console.error(`Workspace exceeded 150 seconds during ${phase}.`,logs);const force=setTimeout(()=>process.exit(1),5000);b.close().finally(()=>{clearTimeout(force);process.exit(1);});},150000);
try{
 const p=testPage=await page(b,url,{logs});p.setDefaultTimeout(15000);p.setDefaultNavigationTimeout(30000);await p.exposeFunction('__workspaceProgress',progress);progress('load workstation',{browser:process.env.AUDIONAUT_TEST_BROWSER||'chromium',platform:process.platform});await p.goto(url+'/audionaut-beta/daw.html');await p.waitForSelector('#pro-workspace-nav');
 for(const name of ['Timeline','Mixer','Automation','Record & takes','Sampler','Performance','Sequences']){progress(`open ${name}`);await selectWorkspace(p, name);await p.waitForTimeout(250);const error=await p.locator('#pro-workspace').innerText();assert.ok(!/Failed to fetch|does not provide|is not a function|Cannot read/.test(error),`${name}: ${error}`);}
 progress('edit mixer effect');await selectWorkspace(p, 'Mixer');await p.getByRole('button',{name:'+ Group',exact:true}).click();
 await p.locator('.pro-strip').first().getByRole('button',{name:'Effects',exact:true}).click();await p.getByRole('dialog',{name:'Mixer effects'}).getByRole('button',{name:'Add effect',exact:true}).first().click();assert.equal(await p.getByRole('dialog',{name:'Mixer effects'}).getByRole('button',{name:'Remove',exact:true}).count(),1);await p.getByRole('dialog',{name:'Mixer effects'}).getByRole('button',{name:'Close',exact:true}).click();
 progress('edit automation');await selectWorkspace(p, 'Automation');await p.getByRole('button',{name:'Add lane',exact:true}).click();assert.equal(await p.getByLabel('Point 1 beat',{exact:true}).count(),1);
 progress('command palette');await p.keyboard.press(process.platform==='darwin'?'Meta+k':'Control+k');await p.getByRole('searchbox',{name:'Search commands'}).fill('Open mixer');await p.keyboard.press('Enter');await p.waitForSelector('.pro-mixer');
 const result=await p.evaluate(async()=>{
  let ctx,recording,destination,osc,amp;const inputRequests=[];let mockInput;let inputDevices;
  const details=()=>{const capture=recording?.recordingStatus();return {audioState:ctx?.state,audioTime:ctx?.currentTime,sampleRate:ctx?.sampleRate,inputRequests:inputRequests.length,inputMockRetained:!!inputDevices&&navigator.mediaDevices===inputDevices&&inputDevices.getUserMedia===mockInput,...(capture?{recording:capture.recording,frames:capture.frames,queuedWrites:capture.pending,captureError:capture.error}:{}),status:document.querySelector('#status-text')?.textContent};};
  const stage=async(name,fn,ms=20000)=>{await window.__workspaceProgress(name,details());let timer;try{const result=await Promise.race([Promise.resolve().then(fn),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(`${name} timed out after ${ms}ms: ${JSON.stringify(details())}`)),ms);})]);await window.__workspaceProgress(`${name} complete`,details());return result;}catch(error){await window.__workspaceProgress(`${name} failed`,{...details(),name:error.name,message:error.message,constraint:error.constraint,stack:error.stack});throw error;}finally{clearTimeout(timer);}};
  const {store,makeProject}=await import('/audionaut-beta/daw/js/state.js'),{engine}=await import('/audionaut-beta/daw/js/engine.js'),{openWorkspace}=await import('/audionaut-beta/daw/js/pro-workspace.js');
  window.__workspaceCleanup=async()=>{
   await stage('release recording sources',async()=>{if(recording?.recordingStatus().recording)await recording.stopAudioRecording();engine.stop();try{osc?.stop();}catch{}osc?.disconnect();amp?.disconnect();destination?.disconnect();destination?.stream.getTracks().forEach(track=>track.stop());});
   await stage('close audio context',async()=>{engine.dispose();if(ctx&&ctx.state!=='closed')await ctx.close();},10000);
   const state={audioState:ctx?.state,tracks:destination?.stream.getTracks().map(track=>track.readyState)||[],recording:recording?.recordingStatus().recording||false};
   if(state.audioState&&state.audioState!=='closed'||state.recording||state.tracks.some(value=>value!=='ended'))throw Error('Audio resources survived cleanup: '+JSON.stringify(state));return state;
  };
  store.loadProject(makeProject());ctx=engine.ensureContext();await stage('resume audio context',()=>ctx.resume(),10000);
  await stage('verify real-time audio clock',async()=>{const start=ctx.currentTime;await new Promise(r=>setTimeout(r,300));if(ctx.currentTime-start<.05)throw Error('Audio clock is not advancing. Linux CI needs a working PulseAudio output (a virtual sink is sufficient).');},2000);const source=ctx.createBuffer(2,ctx.sampleRate,ctx.sampleRate);for(let ch=0;ch<2;ch++){const data=source.getChannelData(ch);for(let i=0;i<data.length;i++)data[i]=Math.sin(i/ctx.sampleRate*Math.PI*2*220)*.2;}
  const{registerAudioBuffer}=await import('/audionaut-beta/daw/js/assets.js'),{assignDecodedSample}=await import('/audionaut-beta/daw/js/loader.js');const asset=await stage('encode sample asset',()=>registerAudioBuffer(source,{name:'test.wav',bitDepth:'float32'}));assignDecodedSample(0,asset,{audioBuffer:source,sampleName:'test',source:asset});
  const {createProcessedTrack,sliceToTimeline}=await import('/audionaut-beta/daw/js/sample-processing.js');const stretched=await stage('stretch sample in worker',()=>createProcessedTrack(store.channel(0).id,'stretch',{ratio:1.5}));const shifted=await stage('pitch sample in worker',()=>createProcessedTrack(store.channel(0).id,'pitch',{semitones:12}));const slices=await stage('slice sample in worker',()=>sliceToTimeline(store.channel(0).id));
  destination=ctx.createMediaStreamDestination();osc=ctx.createOscillator();amp=ctx.createGain();amp.gain.value=.2;osc.frequency.value=330;osc.connect(amp).connect(destination);osc.start();
  // Keep the exact MediaDevices wrapper alive across dynamic imports and GC.
  // Block its prototype as well: a lost instance mock must fail closed, never
  // request a real microphone or silently exercise host-device constraints.
  inputDevices=navigator.mediaDevices;
  Object.defineProperty(Object.getPrototypeOf(inputDevices),'getUserMedia',{configurable:true,value:async()=>{throw new Error('Synthetic capture fixture lost its input mock; native microphone access is blocked.');}});
  mockInput=async constraints=>{inputRequests.push(structuredClone(constraints));return destination.stream;};
  Object.defineProperty(inputDevices,'getUserMedia',{configurable:true,value:mockInput});
  Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:inputDevices});
  recording=await import('/audionaut-beta/daw/js/pro-recording.js');if(navigator.mediaDevices!==inputDevices||navigator.mediaDevices.getUserMedia!==mockInput)throw Error('Synthetic input mock changed before capture');const captureStarted=await stage('start AudioWorklet capture',()=>recording.startAudioRecording({trackId:store.channel(0).id}));if(inputRequests.length!==1)throw Error('Capture must request exactly one synthetic input');if(!document.querySelector('#btn-play').classList.contains('active'))throw Error('Recording transport is not reflected in the header');await stage('capture synthetic audio',()=>new Promise(r=>setTimeout(r,550)),2000);engine.stop();const meta=await stage('flush capture and storage',async()=>{
   // Transport-stop owns finalization. Wait for it, then resolve the durable take
   // by the ID returned at start; a second stop correctly returns null afterward.
   while(recording.recordingStatus().recording)await new Promise(resolve=>setTimeout(resolve,20));
   if(await recording.stopAudioRecording()!==null)throw Error('Completed recorder stop must be idempotent');
   const saved=(await recording.listRecoverableTakes()).find(take=>take.id===captureStarted.id);
   if(!saved?.complete||saved.frames<=0)throw Error('Transport stop did not persist a complete, nonempty take');return saved;
  });if(recording.recordingStatus().recording)throw Error('Transport stop must stop audio capture');if(destination.stream.getTracks().some(track=>track.readyState!=='ended'))throw Error('Recorder did not release its input tracks');const take=await stage('recover take and durable checkpoint',()=>recording.recoverCapturedTake(meta.id));osc.stop();amp.disconnect();const track=store.project.channels.find(t=>t.id===take.sourceTrackId),recorded=engine.buffers[store.project.channels.indexOf(track)],max=recorded.getChannelData(0).reduce((a,v)=>Math.max(a,Math.abs(v)),0);
  recording.selectAudioTake(store.channel(0).id,take.id,{start:take.startBeat+.05,end:take.startBeat+take.durationBeats-.05,comp:true});engine.stop();
  const persistence=await import('/audionaut-beta/daw/js/persistence.js');const exported=JSON.parse(await stage('portable project export',()=>persistence.exportProjectAsync()));await stage('portable project import',()=>persistence.importProject(exported));await stage('reopen mixer',()=>openWorkspace('mixer'));const {reloadAllSamples}=await import('/audionaut-beta/daw/js/loader.js');await stage('finish imported audio hydration',()=>reloadAllSamples());
  return{inputRequests,stretch:stretched.buffer.duration,pitch:shifted.buffer.duration,slices:slices.length,recorded:recorded.duration,max,takes:store.channel(0).takes.length,format:exported.format,sourceKept:!!store.project.channels.find(t=>t.id===take.sourceTrackId),errors:document.querySelector('#status-text')?.textContent};
 });
 assert.equal(result.inputRequests.length,1);assert.deepEqual(result.inputRequests[0],{audio:{deviceId:undefined,channelCount:{ideal:2},echoCancellation:false,noiseSuppression:false,autoGainControl:false}});assert.ok(Math.abs(result.stretch-1.5)<.01);assert.ok(Math.abs(result.pitch-1)<.01);assert.ok(result.slices>=1);assert.ok(result.recorded>.3);assert.ok(result.max>.1);assert.equal(result.takes,1);assert.equal(result.format,'audionaut-workstation/3');assert.ok(result.sourceKept);
 progress('capture screenshot');await p.screenshot({path:process.env.SCREENSHOT_PATH||'/tmp/audionaut-beta-mixer.png',fullPage:false});
 progress('explicit audio cleanup');const cleanup=await p.evaluate(()=>window.__workspaceCleanup());assert.equal(cleanup.audioState,'closed');assert.ok(cleanup.tracks.every(state=>state==='ended'));assert.equal(cleanup.recording,false);await closePage(p);
 assert.equal(logs.filter(l=>l.startsWith('pageerror:')).length,0,JSON.stringify(logs));console.log('PASS pro workspace, lazy panels, stereo sample processing, PCM capture/recovery/comp, portable binary roundtrip',result);
// Linux WebKit takes roughly 30 seconds to shut down its browser process even
// after the application context, input tracks and page have closed. Keep their
// strict deadlines above, and allow that normal driver grace period here.
}catch(error){console.error(`Workspace failed during ${phase}. Browser diagnostics:`,logs);throw error;}finally{clearTimeout(watchdog);const closing=setTimeout(()=>{console.error(`Browser cleanup stalled after ${phase}.`);process.exit(1);},45000);try{if(testPage&&!testPage.isClosed()){await testPage.evaluate(()=>window.__workspaceCleanup?.()).catch(error=>console.error('Audio cleanup after failure:',error.message));await closePage(testPage);}progress('close browser');const closeStarted=Date.now();await b.close();progress('browser closed',{milliseconds:Date.now()-closeStarted});}finally{clearTimeout(closing);srv.close();}}
