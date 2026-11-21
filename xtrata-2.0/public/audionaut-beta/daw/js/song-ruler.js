// Display bars/beats using the existing meter map, including changes mid-song.
function segments(project) {
  const map = [...(project.timeline.meter || [])].sort((a, b) => a.beat - b.beat);
  if (!map.length || map[0].beat > 0) map.unshift({ beat: 0, numerator: 4, denominator: 4 });
  let bar = 1;
  return map.map((m, i) => {
    const size = (m.numerator * 4) / m.denominator,
      end = map[i + 1]?.beat ?? Infinity,
      result = { start: m.beat, end, size, unit: 4 / m.denominator, bar };
    if (Number.isFinite(end)) bar += Math.ceil((end - m.beat) / size);
    return result;
  });
}
export function songPosition(project, beat) {
  const m = segments(project)
      .filter((m) => m.start <= beat)
      .at(-1),
    offset = Math.max(0, beat - m.start);
  return { bar: m.bar + Math.floor(offset / m.size), beat: (offset % m.size) / m.unit + 1 };
}
export function songBarMarks(project, start, end) {
  const marks = [];
  for (const m of segments(project)) {
    if (m.end < start || m.start > end) continue;
    for (
      let n = Math.max(0, Math.ceil((start - m.start) / m.size));
      m.start + n * m.size <= end && m.start + n * m.size < m.end;
      n++
    )
      marks.push({ beat: m.start + n * m.size, bar: m.bar + n });
  }
  return marks;
}
