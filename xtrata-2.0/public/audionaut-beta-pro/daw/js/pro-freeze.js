import {store} from './state.js';
import {engine} from './engine.js';
import {renderMix} from './render-mix.js';
import {registerBlob} from './assets.js';
import {assignDecodedSample} from './loader.js';
import {PLUGIN_TYPES} from './plugins.js';
import {compilePlaybackPlan} from './playback-plan.js';
import {decodePcmWav} from './pcm-wav.js';
import {assertOfflineRenderSupported} from './audio-render-support.js';
export async function freezeTrack(trackId,{signal,onProgress}={}){
  assertOfflineRenderSupported();
  const track=store.track(trackId);if(!track||trackId==='master'||track.freezeState)throw Error('Choose an unfrozen sample or instrument track.');if(store.numChannels>=64)throw Error('Free a sample channel before freezing.');
  if((track.auxSends||[]).some(s=>s.preFader&&s.amount>0)||[...track.inserts||[],...track.fx||[]].some(s=>s.enabled!==false&&PLUGIN_TYPES[s.type]?.shared))throw Error('Use post-fader sends before freezing this track. Pre-fader or mid-chain shared sends need their own printed stem to preserve the mix.');
  if([...track.inserts||[],...track.fx||[]].some(s=>s.sidechainTrackId&&store.project.buses.some(b=>b.id===s.sidechainTrackId)))throw Error('Freeze a bus-sidechained track with a separate printed detector stem first.');
  const project=store.project,generation=store.generation,snapshot=structuredClone(project),plan=compilePlaybackPlan(snapshot,{buffers:engine.buffers}),timelineBefore={enabled:project.timeline.enabled,lengthBeats:project.timeline.lengthBeats,clips:structuredClone(project.timeline.clips)},blob=await renderMix(snapshot,engine.buffers,{stem:trackId,stage:'track',scope:'song',tail:'auto',bitDepth:'float32',sampleRate:engine.ensureContext().sampleRate,signal,onProgress});
  if(project!==store.project||generation!==store.generation)throw Error('Project changed while freezing. Please freeze the current project again.');
  const buffer=await decodePcmWav(engine.ctx,await blob.arrayBuffer(),{signal});if(!buffer)throw Error('The frozen render did not contain valid PCM audio.');if(project!==store.project||generation!==store.generation)throw Error('Project changed while decoding the freeze. Please try again.');const source=registerBlob(blob,{name:`${track.name} frozen.wav`});if(!store.addChannel())throw Error('The sample-channel limit was reached.');const index=store.numChannels-1,frozen=store.channel(index);
  assignDecodedSample(index,source,{audioBuffer:buffer,sampleName:`${track.name} frozen`,source});Object.assign(frozen,{name:`${track.name} frozen`,volume:1,pan:0,inputTrimDb:0,output:track.output||'master',auxSends:structuredClone(track.auxSends||[]),inserts:(track.inserts||[]).filter(s=>PLUGIN_TYPES[s.type]?.shared).map(s=>structuredClone(s)),fx:(track.fx||[]).filter(s=>PLUGIN_TYPES[s.type]?.shared).map(s=>structuredClone(s)),frozenFrom:trackId});
  frozen.sends=structuredClone(track.sends||{});frozen.solo=!!track.solo;frozen.pan=0;
  if(!project.timeline.enabled){store.enableTimeline();project.timeline.clips=project.timeline.clips.filter(c=>c.trackId!==frozen.id&&c.start<plan.endBeat).map(c=>({...c,duration:Math.min(c.duration,plan.endBeat-c.start)}));store.setTimeline({lengthBeats:plan.endBeat});}const beforeClips=JSON.stringify(project.timeline.clips);const clip=store.addClip({trackId:frozen.id,sourceTrackId:frozen.id,type:'audio',name:`${track.name} freeze`,start:0,duration:plan.endBeat,tailSeconds:Math.max(0,buffer.duration-plan.duration),sourceOffsetSeconds:0,gain:1,fadeIn:0,fadeOut:0});
  store.setTrackProp(trackId,'freezeState',{trackId:frozen.id,clipId:clip.id,wasMuted:!!track.mute,wasSolo:!!track.solo,timelineBefore,timelineLengthAfter:project.timeline.lengthBeats,beforeClips});store.setTrackProp(trackId,'solo',false);store.setTrackProp(trackId,'mute',true);engine.syncMixer();return frozen;
}
export function unfreezeTrack(trackId){
  const track=store.track(trackId),state=track?.freezeState;if(!state)return false;
  const frozen=store.track(state.trackId);store.removeClip(state.clipId);
  store.setTrackProp(trackId,'solo',state.wasSolo??track.solo);store.setTrackProp(trackId,'mute',state.wasMuted);store.setTrackProp(trackId,'freezeState',null);
  if(frozen){store.setTrackProp(frozen.id,'solo',false);store.setTrackProp(frozen.id,'mute',true);store.setTrackProp(frozen.id,'frozenFrom',null);store.setTrackProp(frozen.id,'name',`${frozen.name} (archived)`);if(store.project.channels.at(-1)===frozen){try{store.removeChannel();}catch{/* Other user-created references keep the printed audio available. */}}}
  const unchangedClips=JSON.stringify(store.project.timeline.clips)===state.beforeClips;
  if(state.timelineBefore&&unchangedClips&&store.project.timeline.lengthBeats===state.timelineLengthAfter)store.setTimeline(state.timelineBefore);
  engine.syncMixer();return true;
}
