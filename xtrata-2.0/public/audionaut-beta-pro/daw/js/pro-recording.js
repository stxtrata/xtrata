import { engine } from './engine.js';
import { store } from './state.js';
import { registerAudioBuffer } from './assets.js';
import { assignDecodedSample } from './loader.js';
import { beatToSeconds, secondsToBeat } from './timeline.js';
import { autosave } from './persistence.js';
const DB='audionaut-beta-pro-takes-v1',MAX_BYTES=240*1024*1024;
let databasePromise,session=null,workletContext;
function database(){return databasePromise??=new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{r.result.createObjectStore('sessions',{keyPath:'id'});r.result.createObjectStore('chunks',{keyPath:['id','index']});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function transaction(stores,mode,fn){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction(stores,mode);let result;try{result=fn(tx);}catch(e){tx.abort();reject(e);return;}tx.oncomplete=()=>resolve(result?.result??result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Recording storage was interrupted.'));});}
export const listRecoverableTakes=()=>transaction(['sessions'],'readonly',tx=>tx.objectStore('sessions').getAll());
export async function deleteCapturedTake(id){await transaction(['sessions','chunks'],'readwrite',tx=>{tx.objectStore('sessions').delete(id);tx.objectStore('chunks').delete(IDBKeyRange.bound([id,0],[id,Number.MAX_SAFE_INTEGER]));});}
export const recordingStatus=()=>session?{...session.meta,recording:true,error:session.error,pending:session.pending}: {recording:false};
export async function audioInputDevices(){if(!navigator.mediaDevices?.enumerateDevices)return[];return(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='audioinput');}
export async function startAudioRecording({trackId,deviceId='',monitor=false,onUpdate=()=>{}}={}){
  if(session)throw new Error('A recording is already running.');if(!store.project.channels.some(t=>t.id===trackId))throw new Error('Choose a sample track for audio recording.');if(store.numChannels>=64)throw new Error('Free a sample channel before recording a new take.');
  const requestedProject=store.project,ctx=engine.ensureContext();await ctx.resume();
  if(!navigator.mediaDevices?.getUserMedia||!ctx.audioWorklet)throw new Error('Audio recording requires a secure browser with microphone and AudioWorklet support.');
  const stream=await navigator.mediaDevices.getUserMedia({audio:{deviceId:deviceId?{exact:deviceId}:undefined,channelCount:{ideal:2},echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
  try{
    if(requestedProject!==store.project||!store.track(trackId))throw new Error('Project changed while requesting the audio input. Start recording again.');
    if(workletContext!==ctx){await ctx.audioWorklet.addModule(new URL('./record-input-worklet.js',import.meta.url));workletContext=ctx;}
    if(!engine.isPlaying)await engine.play();
    if(requestedProject!==store.project||!store.track(trackId))throw new Error('Project changed while preparing recording. Start again.');
    const id=crypto.randomUUID(),project=store.project,meta={id,projectId:project.projectId,trackId,name:`Take ${new Date().toLocaleTimeString()}`,createdAt:Date.now(),sampleRate:ctx.sampleRate,frames:0,channels:0,chunks:0,startBeat:engine.getMusicalPosition().beat,firstFrame:null,complete:false};
    await transaction(['sessions'],'readwrite',tx=>tx.objectStore('sessions').put(meta));
    const clock=Math.max(ctx.currentTime,engine._transportStart||0),position=engine.getMusicalPosition().beat,punch=project.timeline.punch;
    const source=ctx.createMediaStreamSource(stream),node=new AudioWorkletNode(ctx,'audionaut-capture',{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2],processorOptions:{startFrame:Math.ceil((clock+(punch.enabled?Math.max(0,beatToSeconds(project,punch.start)-beatToSeconds(project,position)):0))*ctx.sampleRate),endFrame:punch.enabled?Math.ceil((clock+Math.max(0,beatToSeconds(project,punch.end)-beatToSeconds(project,position)))*ctx.sampleRate):null}}),silent=ctx.createGain();silent.gain.value=0;source.connect(node).connect(silent).connect(ctx.destination);
    const rec={meta,project,stream,source,node,silent,queue:Promise.resolve(),pending:0,onUpdate,error:null,monitor:null,stopping:false};session=rec;
    if(monitor){rec.monitor=ctx.createGain();rec.monitor.gain.value=.7;source.connect(rec.monitor).connect(engine.masterGain);}
    node.port.onmessage=e=>{
      if(e.data.done){rec.flushed?.();if(!rec.stopping)void stopAudioRecording().catch(()=>{});return;}if(rec.error)return;
      const {channels,frame}=e.data,bytes=channels.reduce((n,c)=>n+c.byteLength,0);
      if(rec.pending>64||meta.frames*channels.length*4+bytes>MAX_BYTES){rec.error='Recording reached its memory/storage safety limit. The captured audio can be recovered.';void stopAudioRecording().catch(()=>{});return;}
      if(meta.firstFrame===null){meta.firstFrame=frame;meta.startBeat=Math.max(0,engine.getMusicalPosition(frame/ctx.sampleRate-(project.recording.latencyMs||0)/1000).beat);}
      const index=meta.chunks++;meta.frames+=channels[0].length;meta.channels=channels.length;rec.pending++;
      rec.queue=rec.queue.then(()=>transaction(['sessions','chunks'],'readwrite',tx=>{tx.objectStore('chunks').put({id,index,channels,frame});tx.objectStore('sessions').put({...meta});})).catch(error=>{rec.error=`Recording storage failed: ${error.message}`;void stopAudioRecording().catch(()=>{});}).finally(()=>rec.pending--);onUpdate(recordingStatus());
    };
    rec.timer=setInterval(()=>{if(project!==store.project){rec.error='Project changed. The take is available for recovery.';void stopAudioRecording().catch(()=>{});}else if(project.timeline.punch.enabled&&engine.getMusicalPosition().beat>=project.timeline.punch.end)void stopAudioRecording().catch(()=>{});},100);
    for(const track of stream.getTracks())track.onended=()=>{if(!rec.stopping)void stopAudioRecording().catch(()=>{});};onUpdate(recordingStatus());return meta;
  }catch(error){stream.getTracks().forEach(t=>t.stop());throw error;}
}
export async function stopAudioRecording(){
  const rec=session;if(!rec)return null;if(rec.stopPromise)return rec.stopPromise;
  rec.stopPromise=(async()=>{
    rec.stopping=true;clearInterval(rec.timer);
    try{
      await new Promise(resolve=>{const timeout=setTimeout(resolve,1500);rec.flushed=()=>{clearTimeout(timeout);resolve();};rec.node.port.postMessage('stop');});
      await rec.queue;rec.meta.complete=!rec.error;if(rec.error)rec.meta.error=rec.error;
      await transaction(['sessions'],'readwrite',tx=>tx.objectStore('sessions').put({...rec.meta}));return rec.meta;
    }catch(error){rec.error=error.message;throw error;}
    finally{rec.node.port.onmessage=null;rec.node.port.close();rec.source.disconnect();rec.node.disconnect();rec.silent.disconnect();rec.monitor?.disconnect();rec.stream.getTracks().forEach(t=>{t.onended=null;t.stop();});rec.flushed=null;if(session===rec)session=null;rec.onUpdate({recording:false,...rec.meta,error:rec.error});}
  })();return rec.stopPromise;
}
export async function recoverCapturedTake(id,{trackId,onProgress=()=>{}}={}){
  if(session?.meta.id===id)throw new Error('Stop this recording before importing it.');
  const meta=await transaction(['sessions'],'readonly',tx=>tx.objectStore('sessions').get(id));if(!meta||!meta.frames)throw new Error('No recorded audio was captured.');
  const project=store.project,target=store.track(trackId||meta.trackId);if(!target||target.kind!=='sample')throw new Error('Choose a sample track to receive this take.');
  const existing=target.takes?.find(t=>t.id===id);if(existing){await autosave({force:true,reason:'recording-recovery'});await deleteCapturedTake(id);return existing;}
  const chunks=await transaction(['chunks'],'readonly',tx=>tx.objectStore('chunks').getAll(IDBKeyRange.bound([id,0],[id,Number.MAX_SAFE_INTEGER]))),frames=chunks.reduce((n,c)=>n+c.channels[0].length,0);
  const ctx=engine.ensureContext(),buffer=ctx.createBuffer(meta.channels,frames,meta.sampleRate);let offset=0;for(const [i,chunk]of chunks.entries()){for(let ch=0;ch<meta.channels;ch++)buffer.copyToChannel(chunk.channels[ch],ch,offset);offset+=chunk.channels[0].length;onProgress((i+1)/chunks.length);}
  const source=await registerAudioBuffer(buffer,{name:`${meta.name}.wav`,bitDepth:'float32'});
  if(project!==store.project||store.track(target.id)!==target)throw new Error('Project changed while recovering audio. The captured take remains available.');
  if(!store.addChannel())throw new Error('Free a sample channel to recover this take.');const ch=store.numChannels-1,sourceTrack=store.channel(ch);sourceTrack.name=`${meta.name} source`;sourceTrack.assetOnly=true;sourceTrack.mute=true;assignDecodedSample(ch,source,{audioBuffer:buffer,sampleName:meta.name,source});
  const start=meta.projectId===store.project.projectId?meta.startBeat:0,end=secondsToBeat(store.project,beatToSeconds(store.project,start)+buffer.duration),punch=store.project.timeline.punch;
  const left=punch.enabled?Math.max(start,punch.start):start,right=punch.enabled?Math.min(end,punch.end):end;
  const take={id:meta.id,name:meta.name,type:'audio',createdAt:meta.createdAt,sourceTrackId:sourceTrack.id,startBeat:start,durationBeats:end-start,clipIds:[]};
  if(right>left){const clip=store.addClip({trackId:target.id,type:'audio',name:meta.name,sourceTrackId:sourceTrack.id,start:left,duration:right-left,sourceOffsetSeconds:beatToSeconds(store.project,left)-beatToSeconds(store.project,start),gain:1,fadeIn:.005,fadeOut:.005});take.clipIds.push(clip.id);}
  store.setTrackProp(target.id,'takes',[...target.takes||[],take]);store.setTimeline({enabled:true});await autosave({force:true,reason:'recording-recovery'});await deleteCapturedTake(id);return take;
}
document.addEventListener('transport-stop',()=>{if(session&&!session.stopping)void stopAudioRecording().catch(()=>{});});
export function selectAudioTake(trackId,takeId,{start,end,comp=false}={}){
  const target=store.track(trackId),take=target?.takes.find(t=>t.id===takeId&&t.type==='audio');if(!take)throw new Error('Audio take not found.');
  start=Math.max(take.startBeat,start??take.startBeat);end=Math.min(take.startBeat+take.durationBeats,end??take.startBeat+take.durationBeats);if(!(end>start))throw new Error('Choose a range within the take.');
  for(const clip of store.project.timeline.clips.filter(c=>c.trackId===trackId&&c.type==='audio'&&c.start<end&&c.start+c.duration>start)){
    if(!comp){store.updateClip(clip.id,{muted:true});continue;}
    const old={...clip};store.removeClip(clip.id);if(old.start<start)store.addClip({...old,id:crypto.randomUUID(),duration:start-old.start});if(old.start+old.duration>end)store.addClip({...old,id:crypto.randomUUID(),start:end,duration:old.start+old.duration-end,sourceOffsetSeconds:(old.sourceOffsetSeconds||0)+(beatToSeconds(store.project,end)-beatToSeconds(store.project,old.start))*(old.playbackRate||1)});
  }
  return store.addClip({trackId,type:'audio',name:take.name,sourceTrackId:take.sourceTrackId,start,duration:end-start,sourceOffsetSeconds:beatToSeconds(store.project,start)-beatToSeconds(store.project,take.startBeat),gain:1,fadeIn:.005,fadeOut:.005});
}
