// Shared musical key identity and horizontal piano geometry. Widths include the
// final white key; black-key centres always sit on actual white-key boundaries.
export const KEYMAP = Object.freeze({
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
  k: 12,
  o: 13,
  l: 14
});
export const isBlackKey = (midi) => [1, 3, 6, 8, 10].includes(((midi % 12) + 12) % 12);
export const keyName = (midi) =>
  ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'][((midi % 12) + 12) % 12] +
  (Math.floor(midi / 12) - 1);
export function pianoLayout(from = 48, octaves = 3, to = from + 12 * octaves) {
  if (
    !Number.isInteger(from) ||
    from % 12 ||
    !Number.isInteger(octaves) ||
    octaves < 1 ||
    from < 0 ||
    !Number.isInteger(to) || to < from || to > 127
  )
    throw Error('Invalid piano keyboard range');
  const total = Array.from({ length: to - from + 1 }, (_, i) => from + i).filter(n => !isBlackKey(n)).length + (isBlackKey(to) ? 0.31 : 0),
    keys = [];
  let white = 0;
  for (let midi = from; midi <= to; midi++) {
    const black = isBlackKey(midi),
      width = (black ? 0.62 : 1) / total;
    keys.push({ midi, black, left: (white - (black ? 0.31 : 0)) / total, width });
    if (!black) white++;
  }
  return keys;
}
export function buildPianoKeys(container, { from = 48, octaves = 3, to = from + 12 * octaves, classic = false } = {}) {
  container.replaceChildren();
  const style = document.createElement('style');
  style.textContent =
    '.kb{position:relative;width:100%;height:100%;user-select:none;-webkit-user-select:none;touch-action:none;overflow:hidden}.kb-w,.kb-b{box-sizing:border-box;position:absolute;top:0;padding:0;margin:0;min-width:0;touch-action:none;user-select:none;transition:background-color 60ms}.kb-w{height:100%;background:#f4f4f4;border:1px solid #444;border-top:0;border-radius:0 0 4px 4px}.kb-w.on{background:#bbb}.kb-b{height:62%;background:#1a1a1a;border:0;border-radius:0 0 3px 3px;z-index:2}.kb-b.on{background:#555}';
  const kb = document.createElement('div');
  kb.className = 'kb';
  kb.setAttribute('role', 'group');
  kb.setAttribute('aria-label', 'Piano keyboard');
  container.append(style, kb);
  const keys = pianoLayout(from, octaves, to).map(({ midi, black, left, width }) => {
    const key = document.createElement('div');
    key.className = (black ? 'kb-b' : 'kb-w') + (classic ? ' sfp-key' + (black ? ' blk' : '') : '');
    key.dataset.base = String(midi);
    key.dataset.i = String(midi - from);
    key.dataset.midi = String(midi);
    key.setAttribute('aria-label', keyName(midi));
    key.style.left = `${left * 100}%`;
    key.style.width = `${width * 100}%`;
    kb.append(key);
    return key;
  });
  return { kb, keys };
}
