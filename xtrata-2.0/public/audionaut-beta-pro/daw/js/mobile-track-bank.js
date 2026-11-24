// The bank follows editor selection. Paging alone never changes a track or transport.
import { action, el } from './pro-ui.js';
import { SYNTH_BANK } from './synths.js';
import { markRecordTrack } from './record-controls.js';

const bankSize = 16;
export function createTrackBank(selectPad) {
  const region = el('section', null, {
    className: 'mobile-track-bank',
    'aria-label': 'Track pads'
  });
  const grid = el('div', null, { className: 'mobile-track-grid', id: 'mobile-track-grid' });
  const header = el('div', null, { className: 'mobile-bank-head' });
  const fold = action(
    'Track pads',
    () => {
      grid.hidden = !grid.hidden;
      pagination.hidden = grid.hidden || tracks.length <= bankSize;
      fold.setAttribute('aria-expanded', String(!grid.hidden));
    },
    {
      'aria-label': 'Track pads',
      'aria-expanded': 'true',
      'aria-controls': grid.id,
      title: 'Show or hide track pads'
    }
  );
  const pagination = el('div', null, { className: 'mobile-bank-pages' });
  const range = el('span', '', { 'aria-live': 'polite' });
  const previous = action('‹', () => showPage(page - 1), { 'aria-label': 'Previous track bank' });
  const next = action('›', () => showPage(page + 1), { 'aria-label': 'Next track bank' });
  pagination.append(previous, range, next);
  header.append(fold, pagination);
  region.append(header, grid);

  let tracks = [],
    selected,
    page = 0,
    buttons = new Map(),
    soloActive = false;
  function updatePad(track) {
    const button = buttons.get(track.id);
    if (!button) return;
    const muted = !!track.mute;
    const quiet = soloActive && !track.solo;
    const state = muted ? 'muted' : quiet ? 'outside-solo' : 'live';
    const description = muted
      ? 'Muted. Tap to select and unmute.'
      : quiet
        ? 'Outside the solo mix. Tap to select.'
        : 'Tap to select.';
    button.dataset.sound = state;
    button.setAttribute('aria-pressed', String(selected === track.id));
    button.setAttribute('aria-label', track.name + '. ' + description);
    button.title = track.name + '. ' + description;
    if (button.lastElementChild.textContent !== track.name)
      button.lastElementChild.textContent = track.name;
    const color = track.kind === 'instrument' ? SYNTH_BANK[track.synthId]?.color : track.color;
    button.style.setProperty('--pad-color', color || '#69cdc1');
    if (track.kind === 'instrument') markRecordTrack(button, track.id);
  }
  function showPage(index) {
    page = Math.max(0, Math.min(index, Math.ceil(tracks.length / bankSize) - 1));
    const start = page * bankSize,
      visible = tracks.slice(start, start + bankSize);
    // Keep the same DOM buttons through edits and loop boundaries, including keyboard focus.
    const retained = new Map();
    for (const [i, owner] of visible.entries()) {
      let button = buttons.get(owner.id);
      if (!button) {
        button = action('', () => selectPad(owner.id), { className: 'mobile-track-pad' });
        button.dataset.trackId = owner.id;
        button.append(el('i', null, { 'aria-hidden': 'true' }), el('span'));
      }
      retained.set(owner.id, button);
      if (grid.children[i] !== button) grid.insertBefore(button, grid.children[i] || null);
    }
    for (const [id, button] of buttons) if (!retained.has(id)) button.remove();
    buttons = retained;
    visible.forEach(updatePad);
    pagination.hidden = grid.hidden || tracks.length <= bankSize;
    previous.disabled = !page;
    next.disabled = start + bankSize >= tracks.length;
    const label = start + 1 + '–' + (start + visible.length) + ' / ' + tracks.length;
    if (range.textContent !== label) range.textContent = label;
    region.hidden = !tracks.length;
  }
  function reveal(id) {
    const old = selected;
    selected = id;
    const index = tracks.findIndex((t) => t.id === id);
    if (index >= 0 && Math.floor(index / bankSize) !== page)
      return showPage(Math.floor(index / bankSize));
    for (const t of tracks) if (t.id === id || t.id === old) updatePad(t);
  }
  function rebuild(owners, id, solo, grouped) {
    // First bank holds the sounds in use before spare sampler channels. A named group
    // keeps project order. A blank song starts with its empty sample tracks ready to load.
    const useSoundOrder = !grouped && owners.some((t) => t.kind === 'sample' && t.source);
    const playable = (t) => t.kind === 'instrument' || t.source;
    const ordered = useSoundOrder
      ? [...owners.filter(playable), ...owners.filter((t) => !playable(t))]
      : owners;
    const layoutChanged =
      ordered.length !== tracks.length || ordered.some((t, i) => t.id !== tracks[i]?.id);
    const follow = selected !== id || layoutChanged;
    tracks = ordered;
    selected = id;
    soloActive = solo;
    const index = follow ? tracks.findIndex((t) => t.id === id) : -1;
    showPage(index >= 0 ? Math.floor(index / bankSize) : page);
  }
  function refresh(owner, solo) {
    if (solo !== soloActive) {
      soloActive = solo;
      tracks.slice(page * bankSize, (page + 1) * bankSize).forEach(updatePad);
    } else if (owner) updatePad(owner);
  }
  return { region, reveal, rebuild, refresh };
}
