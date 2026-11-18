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
