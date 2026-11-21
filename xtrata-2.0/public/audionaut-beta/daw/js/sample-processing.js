import { engine } from './engine.js';
import { store } from './state.js';
import { registerAudioBuffer } from './assets.js';
import { assignDecodedSample } from './loader.js';
import { beatToSeconds,secondsToBeat } from './timeline.js';
export function processSample(buffer,operation,options={}){
  const {signal,onProgress=()=>{},...params}=options;
  if(signal?.aborted)return Promise.reject(new DOMException('Cancelled','AbortError'));
  if(buffer.length*buffer.numberOfChannels*4>128*1024*1024)throw Error('Choose a sample under 128 MiB for processing.');
  return new Promise((resolve,reject)=>{
    const worker=new Worker(new URL('./sample-worker.js',import.meta.url),{type:'module'}),channels=Array.from({length:buffer.numberOfChannels},(_,ch)=>buffer.getChannelData(ch).slice()),timer=setTimeout(()=>finish(new Error('Sample processing timed out.')),120000);
    const finish=(error,value)=>{clearTimeout(timer);worker.terminate();signal?.removeEventListener('abort',abort);error?reject(error):resolve(value);},abort=()=>finish(new DOMException('Cancelled','AbortError'));
    signal?.addEventListener('abort',abort,{once:true});worker.onerror=e=>finish(new Error(e.message||'Sample processing failed.'));worker.onmessage=({data})=>{if(data.progress!=null)onProgress(data.progress);else finish(data.error?new Error(data.error):null,data.result);};worker.postMessage({id:1,job:{operation,channels,sampleRate:buffer.sampleRate,...params}},channels.map(c=>c.buffer));
  });
}
export async function createProcessedTrack(sourceId,operation,options={}){
  const project=store.project,index=store.project.channels.findIndex(c=>c.id===sourceId),source=store.channel(index),buffer=engine.buffers[index];if(!buffer)throw Error('Load the sample before processing.');
  const result=await processSample(buffer,operation,options);if(!result.channels)return result;
  const audio=engine.ensureContext().createBuffer(result.channels.length,result.channels[0].length,buffer.sampleRate);result.channels.forEach((c,i)=>audio.copyToChannel(c,i));
  const label=`${source.name} ${operation}`,asset=await registerAudioBuffer(audio,{name:`${label}.wav`,bitDepth:'float32'});if(project!==store.project||store.channel(index)!==source||engine.buffers[index]!==buffer)throw Error('The project or source changed while processing. Run the operation again.');if(!store.addChannel())throw Error('The 64 sample-track limit was reached.');const ch=store.numChannels-1;assignDecodedSample(ch,asset,{audioBuffer:audio,sampleName:label,source:asset});store.channel(ch).name=label;store.emit('channel',{ch,prop:'name',value:label});return{track:store.channel(ch),buffer:audio};
}
export async function sliceToTimeline(sourceId,{threshold=.3,start=0,...options}={}){
  const project=store.project,ch=store.project.channels.findIndex(c=>c.id===sourceId),buffer=engine.buffers[ch];if(!buffer)throw Error('Load the sample before slicing.');const{slices}=await processSample(buffer,'slice',{threshold,...options}),offset=beatToSeconds(store.project,start),ends=[...slices.slice(1),buffer.duration];if(project!==store.project||store.project.channels[ch]?.id!==sourceId||engine.buffers[ch]!==buffer)throw Error('The project or source changed while slicing. Run the operation again.');
  const clips=slices.map((s,i)=>store.addClip({trackId:sourceId,type:'audio',name:`Slice ${i+1}`,sourceTrackId:sourceId,start:secondsToBeat(store.project,offset+s),duration:secondsToBeat(store.project,offset+ends[i])-secondsToBeat(store.project,offset+s),sourceOffsetSeconds:s,gain:1,fadeIn:.003,fadeOut:.003}));store.setTimeline({enabled:true});return clips;
}
