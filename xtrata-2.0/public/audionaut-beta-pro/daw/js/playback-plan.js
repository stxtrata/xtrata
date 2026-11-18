import { beatToSeconds, secondsToBeat, swingStep, hashSeed, meterAt } from './timeline.js';
import { trackAddress } from './project-model.js';
export { beatToSeconds, secondsToBeat } from './timeline.js';
const val = s => s && typeof s === 'object' ? s.v || 1 : s || 0;
const off = s => s && typeof s === 'object' ? Math.max(0, Math.min(.999, Number(s.off) || 0)) : 0;

// Compiled once per edit/transport start. Export and realtime consume these exact events.
export function compilePlaybackPlan(project, { scope = 'song', range, buffers = [], seed = project.renderSeed || project.projectId || 'audionaut' } = {}) {
  const timeline = project.timeline || {}, events = [];
  const sequence = Math.max(0, Math.min(project.sequences.length - 1, project.currentSequence || 0));
  let startBeat = range?.start ?? (scope === 'sequence' ? sequence * 16 : 0);
  let endBeat = range?.end ?? (scope === 'sequence' ? (sequence + 1) * 16 : timeline.enabled ? Math.max(timeline.lengthBeats || 16, ...timeline.clips.map(c => c.start + c.duration)) : project.sequences.length * 16);
  if(!timeline.enabled&&scope==='song'&&!range){
    if(!project.playEmptySequences){const empty=project.sequences.findIndex((s,i)=>i>0&&s.steps.every(r=>r.every(v=>!val(v)))&&(s.notes||[]).every(n=>!n.length));if(empty>=0)endBeat=Math.min(endBeat,empty*16);}
    if(project.songEndStep>0)endBeat=Math.min(endBeat,project.songEndStep/4);
  }
  startBeat = Math.max(0, startBeat); endBeat = Math.max(startBeat + .001, endBeat);
  const startSeconds = beatToSeconds(project, startBeat);
  const add = e => {
    e.endBeat ??= e.beat;
    if (e.beat >= endBeat || e.endBeat < startBeat || (e.endBeat === e.beat && e.beat < startBeat)) return;
    const originalTime = beatToSeconds(project, e.beat), endTime = beatToSeconds(project, e.endBeat);
    e.rangeChaseSeconds=Math.max(0,startSeconds-originalTime);
    e.chaseOffsetSeconds = e.rangeChaseSeconds+(e.noteOffsetSeconds||0);
    e.time = Math.max(0, originalTime - startSeconds);
    e.duration = Math.max(0, endTime - Math.max(originalTime, startSeconds));
    e.endTime = e.time + e.duration;
    e.seed = hashSeed(`${seed}:${e.id || `${e.type}:${e.trackId}:${e.beat}:${e.pitch || 0}`}`);
    events.push(e);
  };
  function pattern(seq, sequenceIndex, baseBeat, length = 16, offset = 0, onlyTrack = null, clipId = seq.id || sequenceIndex, gain = 1) {
    for (let ch = 0; ch < project.channels.length; ch++) {
      const track = project.channels[ch]; if (onlyTrack && track.id !== onlyTrack) continue;
      for (let step = 0; step < 64; step++) {
        const raw = seq.steps[ch]?.[step]; if (!val(raw)) continue;
        const local = swingStep(step + off(raw), project.swing) / 4 - offset;
        if (local < 0 || local >= length) continue;
        const over=typeof raw==='object'?{...raw}:null,beat=baseBeat+local,bufferDuration=buffers[ch]?.duration||track.analysis?.duration||track.soundMetadata?.duration||0;
        const duration=(over?.gateSteps??track.gateSteps)>0?(over?.gateSteps??track.gateSteps)*60/project.bpm/4:bufferDuration*((over?.trimEnd??track.trimEnd??1)-(over?.trimStart??track.trimStart??0))/(over?.pitch??track.pitch??1);
        add({ type: 'sample', id: `${clipId}:${track.id}:${step}`, trackId: track.id, index: ch, sequenceIndex, step,
          beat,endBeat:secondsToBeat(project,beatToSeconds(project,beat)+duration),velocity: (val(raw) === 2 ? 1.25 : 1) * gain, over });
      }
    }
    for (let i = 0; i < project.instruments.length; i++) {
      const track = project.instruments[i]; if (onlyTrack && track.id !== onlyTrack) continue;
      for (const n of seq.notes[i] || []) {
        const local = swingStep(n.step, project.swing) / 4 - offset;
        const end = swingStep(n.step + n.dur, project.swing) / 4 - offset;
        if (local >= length || end <= 0) continue;
        const trimBeats=Math.max(0,-local),expression=(n.expression||[]).filter(p=>p.offset>=trimBeats).map(p=>({...p,offset:p.offset-trimBeats}));const bend=(n.expression||[]).filter(p=>p.type==='bend'&&p.offset<trimBeats).at(-1);if(bend)expression.unshift({...bend,offset:0});
        add({ type: 'note', id: `${clipId}:${n.id || `${i}:${n.step}:${n.pitch}`}`, noteId: n.id, tieId: n.tieId || ((local<0||end>length)&&n.id?`split:${n.id}`:undefined),noteOffsetSeconds:beatToSeconds(project,baseBeat)-beatToSeconds(project,baseBeat-trimBeats),
          trackId: track.id, index: i, sequenceIndex, step: n.step, beat: baseBeat + Math.max(0, local),
          endBeat: baseBeat + Math.min(length, end), pitch: n.pitch, velocity: (n.vel ?? 1) * gain, expression });
      }
    }
  }
  if (timeline.enabled) {
    for (const clip of timeline.clips) {
      if (clip.muted) continue;
      const address = trackAddress(project, clip.trackId); if (!address) continue;
      if (clip.type === 'pattern') {
        const si = project.sequences.findIndex(s => s.id === clip.sequenceId); if (si < 0) continue;
        pattern(project.sequences[si], si, clip.start, clip.duration, clip.offset || 0, clip.trackId, clip.id, clip.gain ?? 1);
      } else if (clip.type === 'midi' && address.kind === 'instrument') {
        const seq = { id: clip.id, steps: [], notes: [] }; seq.notes[address.index] = clip.notes || [];
        pattern(seq, Math.floor(clip.start / 16), clip.start, clip.duration, clip.offset || 0, clip.trackId, clip.id, clip.gain ?? 1);
      } else if (clip.type === 'audio' && address.kind === 'sample') {
        add({ type: 'sample', id: clip.id, clipId: clip.id, trackId: clip.trackId, index: address.index,
          sourceTrackId: clip.sourceTrackId || clip.trackId, beat: clip.start, endBeat: secondsToBeat(project,beatToSeconds(project,clip.start+clip.duration)+(clip.tailSeconds||0)),
          velocity: clip.gain ?? 1, sourceOffsetSeconds: clip.sourceOffsetSeconds || 0,
          playbackRate: clip.playbackRate || 1, fadeIn: clip.fadeIn || 0, fadeOut: clip.fadeOut || 0, clip: true });
      }
    }
  } else project.sequences.forEach((seq, i) => pattern(seq, i, i * 16));

  // Merge genuine recorded continuations into one voice/envelope across pattern boundaries.
  events.sort((a,b) => a.time-b.time);
  const ties = new Map(), removed = new Set();
  for (const e of events) if (e.type === 'note' && e.tieId) {
    const key = `${e.trackId}:${e.pitch}:${e.tieId}`, previous = ties.get(key);
    if (previous && Math.abs(previous.endBeat-e.beat) < 1e-6) {
      const delta = e.beat-previous.beat;
      previous.expression = [...previous.expression, ...e.expression.map(p => ({...p, offset:(p.offset || 0)+delta}))];
      previous.endBeat=e.endBeat; previous.endTime=e.endTime; previous.duration=previous.endTime-previous.time;
      removed.add(e);
    } else ties.set(key,e);
  }
  for (const lane of timeline.automation || []) {
    if (lane.enabled === false) continue;
    const points = [...lane.points].sort((a,b)=>a.beat-b.beat);
    const before = points.filter(p => p.beat < startBeat).at(-1);
    if (before) {const after=points.find(p=>p.beat>=startBeat),value=after&&before.curve!=='step'?before.value+(after.value-before.value)*(startBeat-before.beat)/(after.beat-before.beat):before.value;add({type:'automation',id:`${lane.id}:initial`,beat:startBeat,target:lane.target,value,curve:'step'});}
    points.forEach((p,i)=>{const previous=points[i-1];
      if(previous&&(previous.curve||'linear')==='linear'&&p.beat>previous.beat){
        const from=Math.max(startBeat,previous.beat),to=Math.min(endBeat,p.beat);if(to<=from)return;
        const boundaries=[from,...(timeline.enabled?timeline.tempo||[]:[]).filter(t=>t.beat>from&&t.beat<to).map(t=>t.beat),to].sort((a,b)=>a-b),valueAt=beat=>previous.value+(p.value-previous.value)*(beat-previous.beat)/(p.beat-previous.beat);
        for(let j=1;j<boundaries.length;j++)add({type:'automation',id:`${lane.id}:${i}:${j}`,beat:boundaries[j-1],endBeat:boundaries[j],target:lane.target,fromValue:valueAt(boundaries[j-1]),value:valueAt(boundaries[j]),curve:'linear'});
      }else add({type:'automation',id:`${lane.id}:${i}`,beat:p.beat,target:lane.target,value:p.value,curve:'step'});
    });
  }
  for (let beat=Math.ceil(startBeat*4)/4; beat<endBeat; beat+=.25) {
    add({type:'step',id:`step:${beat}`,beat,step:Math.floor(beat*4)%64,sequenceIndex:Math.floor(beat/16)});
  }
  if (project.recording?.metronome) for(let beat=Math.ceil(startBeat);beat<endBeat;beat++) {
    const meter=meterAt(project,beat), bar=meter.numerator*4/meter.denominator;
    add({type:'metronome',id:`click:${beat}`,beat,accent:Math.abs((beat-meter.beat)%bar)<1e-6});
  }
  const rank={automation:0,note:1,sample:1,step:2,metronome:3};
  return {events:events.filter(e=>!removed.has(e)).sort((a,b)=>a.time-b.time || rank[a.type]-rank[b.type] || String(a.id).localeCompare(String(b.id))),
    duration:beatToSeconds(project,endBeat)-startSeconds,startBeat,endBeat,startSeconds,seed};
}
