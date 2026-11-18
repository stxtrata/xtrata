// Convert an audio-clock performance into pattern-local notes, preserving every wrap.
export function quantizeRecordedSpan(segments, pitch, vel, steps = 64) {
  const result = [];
  for (const segment of segments) {
    const step = Math.max(0, Math.min(steps, Math.round(segment.startStep)));
    const end = Math.max(0, Math.min(steps, Math.round(segment.endStep)));
    if (end > step) result.push({ sequenceIndex: segment.sequenceIndex, note: { step, dur: end - step, pitch, vel } });
  }
  if (!result.length && segments.length) {
    const first = segments[0];
    result.push({ sequenceIndex: first.sequenceIndex, note: { step: Math.max(0, Math.min(steps - 1, Math.round(first.startStep))), dur: 1, pitch, vel } });
  }
  return result;
}
