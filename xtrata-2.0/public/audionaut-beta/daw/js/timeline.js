// One musical/audio time conversion, used by playback, editing, MIDI and export.
export function tempoMap(project) {
  const source = project.timeline?.enabled ? project.timeline.tempo : null;
  const map = (source?.length ? source : [{ beat: 0, bpm: project.bpm || 120 }])
    .map(p => ({ beat: Math.max(0, Number(p.beat) || 0), bpm: Math.max(20, Math.min(420, Number(p.bpm) || 120)) }))
    .sort((a, b) => a.beat - b.beat);
  if (map[0].beat > 0) map.unshift({ beat: 0, bpm: project.bpm || 120 });
  return map.filter((p, i) => i === map.length - 1 || p.beat !== map[i + 1].beat);
}
export function beatToSeconds(project, beat) {
  const map = tempoMap(project); let seconds = 0;
  if (beat < 0) return beat * 60 / map[0].bpm;
  for (let i = 0; i < map.length; i++) {
    const end = Math.min(beat, map[i + 1]?.beat ?? beat);
    if (end > map[i].beat) seconds += (end - map[i].beat) * 60 / map[i].bpm;
    if (end === beat) break;
  }
  return seconds;
}
export function secondsToBeat(project, seconds) {
  const map = tempoMap(project); if (seconds < 0) return seconds * map[0].bpm / 60;
  for (let i = 0; i < map.length; i++) {
    const length = ((map[i + 1]?.beat ?? Infinity) - map[i].beat) * 60 / map[i].bpm;
    if (seconds <= length) return map[i].beat + seconds * map[i].bpm / 60;
    seconds -= length;
  }
  return 0;
}
export function swingStep(step, swing = 0) {
  const s = Math.floor(step), fraction = step - s, amount = Math.max(0, Math.min(.6, swing / 100));
  return s + (s % 2 ? amount : 0) + fraction * (1 + (s % 2 ? -amount : amount));
}
export function unswingStep(position, swing = 0) {
  const amount = Math.max(0, Math.min(.6, swing / 100)), pair = Math.floor(position / 2) * 2, part = position - pair;
  return part <= 1 + amount ? pair + part / (1 + amount) : pair + 1 + (part - 1 - amount) / (1 - amount);
}
export function stepToSeconds(project, step, sequenceIndex = 0) { return beatToSeconds(project, sequenceIndex * 16 + swingStep(step, project.swing) / 4); }
export function stepSpanSeconds(project, start, end, sequenceIndex = 0) { return stepToSeconds(project, end, sequenceIndex) - stepToSeconds(project, start, sequenceIndex); }
export function meterAt(project, beat) {
  const entries = [...(project.timeline?.meter?.length?project.timeline.meter:[{ beat: 0, numerator: 4, denominator: 4 }])].sort((a,b) => a.beat-b.beat);
  return entries.filter(m => m.beat <= beat).at(-1) || entries[0];
}
export function hashSeed(value) { let h = 2166136261; for (const c of String(value)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function seededRandom(seed) { let a = typeof seed === 'number' ? seed >>> 0 : hashSeed(seed); return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
