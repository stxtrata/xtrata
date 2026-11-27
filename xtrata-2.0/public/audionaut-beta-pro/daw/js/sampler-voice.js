import { detuneControl } from './voicing.js';
// Saved UI zones originally used normalized 0..1 velocity; MIDI zones use 1..127.
export function velocityBounds(zone,unit) {
  const normalized=unit!=='midi'&&zone.highVelocity!=null&&zone.highVelocity<=1;
  return normalized?[Math.max(1,Math.round((zone.lowVelocity??0)*127)),Math.max(1,Math.round(zone.highVelocity*127))]:[zone.lowVelocity??1,zone.highVelocity??127];
}
// Multisample/velocity-zone voice with the same note ownership contract as synths.
export function createSamplerVoice(ctx,destination,sampler,note,bufferForTrack,onEnded) {
  const velocity=Math.max(1,Math.min(127,Math.round(note.vel*127)));
  const zones=(sampler.zones||[]).filter(z=>{const [low,high]=velocityBounds(z,sampler.velocityUnit);return note.pitch>=(z.lowMidi??0)&&note.pitch<=(z.highMidi??127)&&velocity>=low&&velocity<=high;});
  const zone=zones.sort((a,b)=>Math.abs(note.pitch-(a.rootMidi??60))-Math.abs(note.pitch-(b.rootMidi??60)))[0];
  const buffer=zone&&bufferForTrack(zone.sourceTrackId);if(!buffer)throw new Error('This sampler zone has no loaded audio.');
  const src=ctx.createBufferSource(),gain=ctx.createGain(),time=note.time,attack=Math.max(.001,sampler.attack||.005),release=Math.max(.005,sampler.release||.1);
  src.buffer=buffer;src.playbackRate.value=2**((note.pitch-(zone.rootMidi??60))/12);src.connect(gain).connect(destination);
  if(zone.loopEndSeconds>zone.loopStartSeconds){src.loop=true;src.loopStart=Math.max(0,zone.loopStartSeconds);src.loopEnd=Math.min(buffer.duration,zone.loopEndSeconds);}
  gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(note.vel,time+attack);
  let ended=false,released=false;
  const finish=()=>{if(ended)return;ended=true;src.disconnect();gain.disconnect();onEnded?.();};src.onended=finish;
  const pitch=detuneControl(ctx,()=>[src.detune]);
  const voice={get ended(){return ended;},get released(){return released;},ready:Promise.resolve(true),latencySeconds:0,tailSeconds:release,
    release(at=ctx.currentTime,seconds=release){if(ended||released)return;released=true;gain.gain.cancelAndHoldAtTime?.(at);gain.gain.setTargetAtTime(0,at,Math.max(.002,seconds/5));try{src.stop(at+seconds);}catch{}},
    stop(at=ctx.currentTime){if(ended)return;released=true;try{src.stop(at);}catch{finish();}},
    setBend(semitones,at){pitch.setBend(semitones,at);},setGlide(semitones,at,seconds,from){pitch.setGlide(semitones,at,seconds,from);},
    setParameters(patch,at=ctx.currentTime){if(Number.isFinite(patch.volume))gain.gain.setTargetAtTime(note.vel*patch.volume,at,.008);},
  };
  src.start(time,Math.min(buffer.duration-.001,Math.max(0,note.offset||0)));
  if(!note.held)voice.release(time+note.dur,release);
  return voice;
}
