export const MIDI_QUANTIZE_CHOICES = [
  ['0', 'Off'], ['0.125', '1/32'], ['0.25', '1/16'], ['0.5', '1/8'], ['1', '1/4']
];

export function activeMidiTake(track) {
  const takes = (track?.takes || []).filter(take => take.type !== 'audio' && Array.isArray(take.notes));
  return takes.find(take => take.id === track?.activeTakeId) || takes.at(-1) || null;
}

// Reapply quantisation from the original performance, never from a previous snap.
// Only timing changes; note identity, expression, pitch and velocity survive.
export function requantizeNoteTiming(note, grid, strength, steps = 64) {
  note.rawStep ??= note.step;
  note.rawDur ??= note.dur;
  grid = Number(grid);
  strength = Math.max(0, Math.min(1, Number(strength) || 0));
  if (!(Number.isFinite(grid) && grid > 0) || !strength) {
    note.step = note.rawStep;
    note.dur = note.rawDur;
    return note;
  }
  const quantum = grid * 4, snap = v => v + (Math.round(v / quantum) * quantum - v) * strength;
  const start = Math.max(0, Math.min(steps, snap(note.rawStep)));
  const end = Math.max(0, Math.min(steps, snap(note.rawStep + note.rawDur)));
  if (end > start) {
    note.step = start;
    note.dur = end - start;
  } else {
    note.dur = Math.min(steps, quantum);
    note.step = Math.max(0, Math.min(steps - note.dur, start));
  }
  return note;
}

// Convert an audio-clock performance into pattern-local notes, preserving every wrap.
export function quantizeRecordedSpan(segments, pitch, vel, steps = 64, { grid = .25, strength = 1, tieId, expression = [] } = {}) {
  const result = [];
  const quantum=grid*4, quantize=v=>quantum>0?v+(Math.round(v/quantum)*quantum-v)*strength:v;
  let elapsed=0;
  for (const segment of segments) {
    const step = Math.max(0, Math.min(steps, quantize(segment.startStep)));
    const end = Math.max(0, Math.min(steps, quantize(segment.endStep)));
    const length=(segment.endStep-segment.startStep)/4;
    const events=expression.filter(p=>p.offset>=elapsed&&p.offset<elapsed+length).map(p=>({...p,offset:p.offset-elapsed}));
    const before=expression.filter(p=>p.type==='bend'&&p.offset<elapsed).at(-1);if(before)events.unshift({...before,offset:0});
    if (end > step) result.push({ sequenceIndex: segment.sequenceIndex, note: { step, dur: end - step, rawStep:segment.startStep, rawDur:segment.endStep-segment.startStep, pitch, vel, ...(tieId&&{tieId}), expression:events } });
    elapsed+=length;
  }
  if (!result.length && segments.length) {
    const first = segments[0];
    result.push({ sequenceIndex: first.sequenceIndex, note: { step: Math.max(0, Math.min(steps - (quantum||1/960), quantize(first.startStep))), dur: quantum||Math.max(1/960,first.endStep-first.startStep), rawStep:first.startStep,rawDur:first.endStep-first.startStep,pitch,vel,...(tieId&&{tieId}),expression } });
  }
  return result;
}
