// Playback and export share one musical event plan. Output encoding runs in a worker.
import {Engine} from './engine.js';
import {compilePlaybackPlan} from './playback-plan.js';
import {encodeWavAsync} from './audio-utils.js';
import {cleanReturns,BEAT_DIVS,calibratePluginLatency,pluginTailSeconds,PLUGIN_TYPES} from './plugins.js';
import {projectTracks,trackAddress,normalizeProjectModel} from './project-model.js';
import {projectLatencySeconds} from './mixer-runtime.js';
import {scheduleDspBoundary} from './plugin-automation.js';
import {synthTailSeconds} from './synths.js';
const abort=signal=>{if(signal?.aborted)throw new DOMException('Export cancelled.','AbortError');};
const yieldUI=()=>new Promise(resolve=>setTimeout(resolve,0));
function audible(project,owner){const owners=projectTracks(project);return !owner.mute&&(!owners.some(t=>t.solo)||owner.solo);}
function estimateTail(project,plan,buffers,stem=null){
  const leaves=projectTracks(project).filter(owner=>audible(project,owner)&&(!stem||owner.id===(typeof stem==='string'?stem:stem.id))),leafIds=new Set(leaves.map(owner=>owner.id));
  let last=plan.duration;
  for(const e of plan.events){
    const address=trackAddress(project,e.trackId);if(!address||!leafIds.has(address.track.id))continue;
    if(e.type==='note')last=Math.max(last,e.endTime+synthTailSeconds(address.track.synthId,address.track.params||{}));
    if(e.type==='sample'){
      // The shared plan includes printed clip tails in event.endTime, while its
      // nominal song duration stays musical. Count that extension exactly once.
      if(e.clip){last=Math.max(last,e.endTime??e.time+e.duration);continue;}
      const source=trackAddress(project,e.sourceTrackId||e.trackId),buffer=buffers[source?.index];if(!buffer)continue;
      const rate=e.playbackRate||e.over?.pitch||address.track.pitch||1;
      const length=buffer.duration*((e.over?.trimEnd??address.track.trimEnd??1)-(e.over?.trimStart??address.track.trimStart??0))/rate;
      last=Math.max(last,e.time+length);
    }
  }
  const returns=cleanReturns(project.returns),owners=[...projectTracks(project),...(project.buses||[]),project.master||{}],sendOwners=[...leaves,...(project.buses||[]).filter(owner=>!owner.mute),project.master||{}];
  let fx=0;
  if(sendOwners.some(o=>o.sends?.reverb?.enabled!==false&&o.sends?.reverb?.amount>0))fx=Math.max(fx,returns.reverb.decay+returns.reverb.predelay/1000);
  if(sendOwners.some(o=>o.sends?.delay?.enabled!==false&&o.sends?.delay?.amount>0)){
    const beats=BEAT_DIVS.find(([name])=>name===returns.delay.time)?.[1]||.75;
    const feedback=returns.delay.feedback,echoes=feedback>0?Math.ceil(Math.log(.0001)/Math.log(feedback)):1;
    const bpm=Math.min(project.bpm,...(project.timeline?.tempo||[]).map(t=>t.bpm));fx=Math.max(fx,beats*60/bpm*echoes);
  }
  const chains=new Map(owners.map(owner=>[owner.id||'master',owner])),memo=new Map();
  const routeTail=(id,seen=new Set())=>{
    if(memo.has(id))return memo.get(id);if(seen.has(id))throw new Error('Mixer routing cannot feed back into itself.');
    const owner=chains.get(id);if(!owner)return 0;seen=new Set(seen).add(id);
    const own=[...owner.inserts||[],...owner.fx||[]].reduce((sum,slot)=>{if(slot.enabled===false)return sum;const params=slot.params||{};return sum+Math.max(pluginTailSeconds(slot.type,params),0,Number(params.decay)||0,Number(params.tailSeconds)||0);},0);
    const routes=id==='master'?[]:[owner.output||'master',...(owner.auxSends||[]).filter(send=>send.amount>0).map(send=>send.busId)];
    const total=own+Math.max(0,...routes.map(next=>routeTail(next,seen)));memo.set(id,total);return total;
  };
  // Serial effects and downstream buses extend each other; taking only the
  // longest individual effect truncates cascaded tails. Shared returns are added
  // conservatively to the longest routed chain.
  const chainTail=Math.max(0,...leaves.map(owner=>routeTail(owner.id)));
  return Math.max(0,last-plan.duration)+chainTail+fx;
}
export function mixDuration(project,{scope='song',tail=4,range}={}){
  const plan=compilePlaybackPlan(project,{scope,range});return plan.duration+(tail==='auto'?estimateTail(project,plan,[]):Math.max(0,Math.min(120,Number(tail)||0)));
}
export async function renderMix(project,buffers,{scope='song',range,tail='auto',sampleRate=48000,bitDepth=24,dither=false,signal,onProgress=()=>{},seed=project.renderSeed,stem=null,stage='mix',maxMemoryBytes=512*1024*1024}={}){
  abort(signal);if(![22050,44100,48000,88200,96000].includes(sampleRate))throw new Error('Choose a supported export sample rate.');
  const snapshot=normalizeProjectModel(structuredClone(project));
  if(stage==='track'){
    if(!stem)throw new Error('Select a track for track-stage rendering.');
    snapshot.masterVolume=1;snapshot.master={inserts:[],fx:[],pan:0,mono:false};snapshot.buses=[];
    for(const owner of projectTracks(snapshot)){owner.output='master';owner.auxSends=[];owner.sends={};
      owner.inserts=(owner.inserts||[]).filter(slot=>!PLUGIN_TYPES[slot.type]?.shared);
      owner.fx=(owner.fx||[]).filter(slot=>!PLUGIN_TYPES[slot.type]?.shared);
    }
    const leafIds=new Set(projectTracks(snapshot).map(owner=>owner.id));
    snapshot.timeline.automation=snapshot.timeline.automation.filter(lane=>leafIds.has(lane.target?.trackId));
  }
  if(stem){for(const t of projectTracks(snapshot))t.solo=false;for(const bus of snapshot.buses||[])bus.solo=false;}
  const plan=compilePlaybackPlan(snapshot,{scope,range,seed,buffers});
  const events=plan.events.filter(e=>!['step','metronome'].includes(e.type));
  // A bounded graph is essential even for short, extremely dense imported projects.
  const notes=events.filter(e=>e.type==='note');
  if(notes.length>8192||events.length>65536)throw new Error('This range is too dense for one offline render. Export shorter timeline ranges or individual stems.');
  const required=new Set(events.filter(e=>e.type==='sample'&&audible(snapshot,trackAddress(snapshot,e.trackId)?.track||{})).map(e=>trackAddress(snapshot,e.sourceTrackId||e.trackId)?.index));
  const missing=[...required].filter(i=>i!=null&&!buffers[i]);if(missing.length)throw new Error(`Relink or load the audio for tracks ${missing.map(i=>i+1).join(', ')} before export.`);
  const tailSeconds=tail==='auto'?estimateTail(snapshot,plan,buffers,stem):Math.max(0,Math.min(120,Number(tail)||0));
  if(tailSeconds>120)throw new Error('The automatic effect tail exceeds two minutes. Reduce feedback or select an explicit tail length.');
  await calibratePluginLatency(sampleRate);abort(signal);
  const latency=Math.max(0,projectLatencySeconds(snapshot,sampleRate)),lead=.01+latency,duration=plan.duration+tailSeconds;
  const length=Math.ceil((duration+lead)*sampleRate),bytesPerSample=bitDepth==='float32'?4:bitDepth/8;
  if(length*(16+2*bytesPerSample)>maxMemoryBytes)throw new Error('This export exceeds the working-memory budget. Export a shorter range, a lower sample rate or individual stems.');
  const Context=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;if(!Context)throw new Error('Offline audio export is not supported in this browser.');
  const context=new Context(2,length,sampleRate),view={project:snapshot,get numChannels(){return snapshot.channels.length},channel:i=>snapshot.channels[i],instrument:i=>snapshot.instruments[i],on:()=>()=>{},selectSequence:i=>{snapshot.currentSequence=i;}};
  const renderer=new Engine({store:view,contextFactory:()=>context,offline:true,seed:plan.seed});
  const progressOwner={disposed:false};
  let cancelHandler;
  const cancelled=new Promise((_,reject)=>{cancelHandler=()=>{progressOwner.disposed=true;renderer.dispose?.();reject(new DOMException('Export cancelled.','AbortError'));};signal?.addEventListener('abort',cancelHandler,{once:true});});
  try{
    renderer.ensureContext();buffers.forEach((buffer,i)=>renderer.setBuffer(i,buffer));renderer.setMasterVolume(snapshot.masterVolume);renderer.syncMixer?.();
    const isolateStem=()=>{if(stem){
      const id=typeof stem==='string'?stem:stem.id,leaves=new Set(projectTracks(snapshot).map(t=>t.id));
      // Keep detector feeds sounding while isolating other tracks from mix outputs.
      // Shared-bus stems include the selected track's wet path; nonlinear master
      // processing means their sum need not equal the stereo mix.
      for(const link of renderer._mixer?.links||[])if(leaves.has(link.from)&&link.from!==id){try{link.source.disconnect(link.delay);}catch{}}
    }};
    onProgress({phase:'prepare',progress:0});
    await Promise.race([renderer.preparePlan(plan,{all:true,signal,onProgress:progress=>onProgress({phase:'prepare',progress})}),cancelled]);abort(signal);
    isolateStem();
    for(let i=0;i<events.length;i++){
      renderer.scheduleEvent({...events[i],time:events[i].time+.01});
      if(i%256===0){onProgress({phase:'schedule',progress:i/Math.max(1,events.length)});await yieldUI();abort(signal);}
    }
    onProgress({phase:'render',progress:0});
    // Periodic offline suspension provides real progress and a cancellation boundary.
    const total=length/sampleRate,interval=Math.max(.25,total/100);
    if(context.suspend&&context.resume)for(let at=interval;at<total;at+=interval){
      scheduleDspBoundary(context,progressOwner,at,()=>{abort(signal);onProgress({phase:'render',progress:at/total});});
    }
    const audio=await Promise.race([context.startRendering(),cancelled]);abort(signal);
    for(const chain of renderer.chains.values())for(const slot of chain.slots.values())if(slot.nodes.automationError)throw new Error(`Effect automation could not render: ${slot.nodes.automationError}`);
    onProgress({phase:'encode',progress:0});
    const blob=await encodeWavAsync(audio,{start:lead,end:Math.min(audio.duration,lead+duration),bitDepth,dither,seed:1,signal,onProgress:progress=>onProgress({phase:'encode',progress})});
    blob.renderReport={sampleRate,bitDepth,seconds:duration,tailSeconds,latencySeconds:latency,seed:plan.seed,events:events.length,stem};onProgress({phase:'complete',progress:1});return blob;
  }finally{progressOwner.disposed=true;signal?.removeEventListener('abort',cancelHandler);renderer.dispose?.();}
}
export async function renderStems(project,buffers,options={}){
  const tracks=projectTracks(project).filter(t=>!t.mute&&(!options.trackIds||options.trackIds.includes(t.id))),result=[];
  let bytes=0;
  for(let i=0;i<tracks.length;i++){
    abort(options.signal);const track=tracks[i];options.onProgress?.({phase:'stem',completed:i,total:tracks.length,name:track.name});
    const blob=await renderMix(project,buffers,{...options,stem:track.id,onProgress:progress=>options.onProgress?.({...progress,completed:i,total:tracks.length,name:track.name})});
    const item={trackId:track.id,name:`${String(i+1).padStart(2,'0')}-${String(track.name||'Track').replace(/[^\w -]/g,'')}.wav`,blob};
    if(options.onStem)await options.onStem(item);
    else{bytes+=blob.size;if(bytes>(options.maxMemoryBytes||512*1024*1024))throw new Error('The stem package exceeds its memory budget. Export fewer tracks or a shorter range.');result.push(item);}
  }return result;
}
