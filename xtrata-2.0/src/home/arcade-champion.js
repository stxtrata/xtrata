// Astro Blaster 3 champion: the all-time #1 name and score in the homepage hero.
// Reads /api/arcade-champion (one shared chain read). A failed read hides the panel,
// it never shows an empty or made-up board. The name is player-chosen, so it is only
// ever written with textContent.

const ENDPOINT = '/api/arcade-champion';
const POLL_MS = 60000;
const NAME = /^[A-Za-z0-9 _.-]{1,12}$/;

export const formatScore = (value) => new Intl.NumberFormat('en-GB').format(value);

export const parseChampion = (data) => {
  if (!data || data.version !== 1) return null;
  if (data.empty === true) return {empty: true};
  if (typeof data.name !== 'string' || !NAME.test(data.name)) return null;
  if (!Number.isSafeInteger(data.score) || data.score <= 0) return null;
  return {empty: false, name: data.name, score: data.score};
};

let started = false;
let timer = null;
let inflight = false;
let current = null;
let onVisible = null;

const root = () => document.getElementById('heroChampion');
const setText = (key, value) => {
  const node = root()?.querySelector(`[data-champ="${key}"]`);
  if (node) node.textContent = value;
};

const render = (champion) => {
  const node = root();
  if (!node) return;
  if (!champion) { node.hidden = true; return; }
  const changed = !current || current.name !== champion.name || current.score !== champion.score || current.empty !== champion.empty;
  node.dataset.empty = champion.empty ? 'true' : 'false';
  setText('name', champion.empty ? 'Unclaimed' : champion.name);
  setText('score', champion.empty ? '' : `${formatScore(champion.score)} points`);
  setText('go', champion.empty ? 'The crown is empty. Be the first name here →' : 'Think you can beat it? Take the crown →');
  node.hidden = false;
  if (changed && current && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    node.classList.remove('is-new');
    void node.offsetWidth;
    node.classList.add('is-new');
  }
  current = champion;
};

const load = async () => {
  if (inflight) return;
  inflight = true;
  try {
    const response = await fetch(ENDPOINT, {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const parsed = parseChampion(await response.json());
    if (!parsed) throw new Error('unreadable');
    render(parsed);
  } catch {
    // Keep showing the last good champion; hide only if there never was one.
    if (!current) render(null);
  } finally {
    inflight = false;
  }
};

const schedule = () => {
  window.clearTimeout(timer);
  if (!started) return;
  timer = window.setTimeout(() => { if (!document.hidden) void load(); schedule(); }, POLL_MS);
};

export const initArcadeChampion = () => {
  if (started || !root()) return;
  started = true;
  current = null;
  void load();
  schedule();
  onVisible = () => { if (!document.hidden) void load(); };
  document.addEventListener('visibilitychange', onVisible);
};

export const stopArcadeChampion = () => {
  if (!started) return;
  started = false;
  window.clearTimeout(timer);
  timer = null;
  if (onVisible) document.removeEventListener('visibilitychange', onVisible);
  onVisible = null;
};
