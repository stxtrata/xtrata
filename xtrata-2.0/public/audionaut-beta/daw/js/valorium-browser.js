// valorium-browser.js — the sound browser for VALORIUM's recorded instruments
// (valorium-sounds.js): categories, search, favourites and audition.
import { engine } from './engine.js';
import { RECORDED_SOUNDS, RECORDED_CATEGORIES, RECORDED_BY_KEY, loadRecordedSound, recordedZone } from './valorium-sounds.js';

const FAVOURITES = 'audionaut:valorium-favourites';
export function favouriteSounds() {
  try { const list = JSON.parse(localStorage.getItem(FAVOURITES) || '[]'); return new Set(Array.isArray(list) ? list.filter((k) => RECORDED_BY_KEY.has(k)) : []); }
  catch { return new Set(); }
}
function saveFavourites(set) { try { localStorage.setItem(FAVOURITES, JSON.stringify([...set])); } catch { /* storage unavailable */ } }

// Sounds matching a category ("", "★" or a pack title) and a search phrase (every word must match).
export function filterSounds({ category = '', query = '', favourites = favouriteSounds() } = {}) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return RECORDED_SOUNDS.filter((s) => {
    if (category === '★' ? !favourites.has(s.key) : category && s.category !== category) return false;
    const text = `${s.name} ${s.category} ${s.folder}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });
}

const STYLE = `
#valorium-browser{width:min(640px,calc(100vw - 24px));max-height:min(86vh,720px);padding:0;border:1px solid var(--border,#26303d);border-radius:10px;background:var(--panel,#121820);color:var(--text,#d7e0ea);font:12px/1.4 var(--font-mono,monospace)}
#valorium-browser::backdrop{background:#000a}
#valorium-browser form{display:flex;flex-direction:column;max-height:inherit}
#valorium-browser header{display:flex;gap:8px;align-items:center;justify-content:space-between;padding:12px 12px 8px}
#valorium-browser h2{margin:0;font:600 13px var(--font-display,sans-serif);letter-spacing:.06em}
#valorium-browser .vb-filters{display:grid;grid-template-columns:1fr 1.4fr;gap:8px;padding:0 12px 8px}
#valorium-browser select,#valorium-browser input[type=search]{min-height:32px;background:var(--panel-2,#1a222d);color:inherit;border:1px solid var(--border,#26303d);border-radius:6px;padding:2px 6px;font:inherit;min-width:0}
#valorium-browser ul{list-style:none;margin:0;padding:0 12px;overflow:auto;flex:1}
#valorium-browser li{display:grid;grid-template-columns:28px 1fr auto auto;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border,#26303d)}
#valorium-browser li small{display:block;color:var(--dim,#7b8794)}
#valorium-browser li[aria-current=true] strong{color:var(--accent,#2edb84)}
#valorium-browser button{min-height:30px}
#valorium-browser .vb-star{background:none;border:0;color:var(--dim,#7b8794);font-size:16px;cursor:pointer;padding:0}
#valorium-browser .vb-star[aria-pressed=true]{color:#ffd24a}
#valorium-browser footer{padding:8px 12px 12px;color:var(--dim,#7b8794)}
@media (max-width:520px){#valorium-browser .vb-filters{grid-template-columns:1fr}#valorium-browser li{grid-template-columns:28px 1fr auto}#valorium-browser li .vb-play{display:none}}
`;
const el = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids); return n; };

let previewing = null;
async function preview(key) {
  const ctx = engine.ensureContext(), entry = await loadRecordedSound(key, ctx);
  try { previewing?.stop(); } catch { /* already ended */ }
  const zone = recordedZone(entry, 60), source = ctx.createBufferSource(), gain = ctx.createGain();
  source.buffer = zone.buffer; source.playbackRate.value = 2 ** ((Math.max(entry.low, Math.min(entry.high, 60)) - zone.rootMidi) / 12); // middle C, or the nearest note the instrument reaches
  gain.gain.setValueAtTime(0.8, ctx.currentTime); gain.gain.setTargetAtTime(0, ctx.currentTime + 1.2, 0.15);
  source.connect(gain).connect(engine.masterGain || ctx.destination);
  source.start(); source.stop(ctx.currentTime + 2.2);
  source.onended = () => { try { gain.disconnect(); } catch { /* gone */ } };
  previewing = source;
}

// Opens the browser. onPick(key) is called with the chosen sound's key.
export function openSoundBrowser({ title = 'Recorded sounds', current = '', onPick }) {
  document.getElementById('valorium-browser')?.remove();
  if (!document.getElementById('valorium-browser-style')) document.head.append(el('style', { id: 'valorium-browser-style', textContent: STYLE }));
  const dialog = el('dialog', { id: 'valorium-browser' }), favourites = favouriteSounds();
  const startCategory = RECORDED_BY_KEY.get(current)?.category || '';
  const category = el('select', { ariaLabel: 'Category' });
  for (const [value, text] of [['', `All sounds (${RECORDED_SOUNDS.length})`], ['★', '★ Favourites'], ...RECORDED_CATEGORIES.map((c) => [c, c])]) category.append(new Option(text, value));
  category.value = startCategory;
  const search = el('input', { type: 'search', placeholder: 'Search: violin sustain, harp, organ…', ariaLabel: 'Search sounds' });
  const list = el('ul'), note = el('span', { textContent: '' });
  const close = el('button', { type: 'button', textContent: 'Close' });
  close.addEventListener('click', () => dialog.close());
  function paint() {
    const found = filterSounds({ category: category.value, query: search.value, favourites });
    list.replaceChildren(...found.map((s) => {
      const star = el('button', { type: 'button', className: 'vb-star', textContent: favourites.has(s.key) ? '★' : '☆', title: 'Favourite' });
      star.setAttribute('aria-pressed', String(favourites.has(s.key))); star.setAttribute('aria-label', `Favourite ${s.name}`);
      star.addEventListener('click', () => { if (favourites.has(s.key)) favourites.delete(s.key); else favourites.add(s.key); saveFavourites(favourites); paint(); });
      const play = el('button', { type: 'button', className: 'vb-play', textContent: '▶ Hear' });
      play.addEventListener('click', async () => { play.disabled = true; note.textContent = `Loading ${s.name}…`; try { await preview(s.key); note.textContent = `${s.name} · ${s.credit}`; } catch (error) { note.textContent = error.message; } play.disabled = false; });
      const use = el('button', { type: 'button', textContent: 'Use' });
      use.addEventListener('click', () => { dialog.close(); onPick?.(s.key); });
      const item = el('li', {}, star, el('div', {}, el('strong', { textContent: s.name }), el('small', { textContent: `${s.category} · ${s.zones.length} recorded notes${s.sustained ? ' · sustains' : ''}` })), play, use);
      if (s.key === current) item.setAttribute('aria-current', 'true');
      return item;
    }));
    if (!found.length) list.append(el('li', {}, el('span'), el('div', { textContent: category.value === '★' ? 'No favourites yet. Star a sound to keep it here.' : 'No sound matches that search.' })));
  }
  category.addEventListener('change', paint); search.addEventListener('input', paint);
  dialog.append(el('form', { method: 'dialog' },
    el('header', {}, el('h2', { textContent: title }), close),
    el('div', { className: 'vb-filters' }, category, search), list,
    el('footer', {}, el('div', { textContent: 'Every sound here is public domain (CC0): free to use in released music, no credit or fee.' }), note)));
  dialog.addEventListener('close', () => { try { previewing?.stop(); } catch { /* ended */ } dialog.remove(); });
  document.body.append(dialog); paint(); dialog.showModal(); search.focus();
  return dialog;
}
