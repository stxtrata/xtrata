// Music Supporters: the homepage banner and hero that count paid plays and the
// addresses behind them. Both read one endpoint (/api/music-stats) so they can
// never disagree. A failed read is shown as unavailable or stale, never as zero.

const ENDPOINT = '/api/music-stats';
const CACHE_KEY = 'xtrata-music-supporters-v1';
const POLL_MS = 30000;
const LABEL_MS = 10000;
const EXPLORER = 'https://explorer.hiro.so/txid/';
const TX = /^0x[0-9a-f]{64}$/;
const ADDRESS = /^[A-Z0-9]{3,64}$/;

export const formatCount = (value) => new Intl.NumberFormat('en-GB').format(value);

export const formatStx = (microStx) => {
  const whole = Math.floor(microStx / 1e6);
  return `${formatCount(whole)}.${String(microStx % 1e6).padStart(6, '0')}`;
};

export const shortAddress = (value) => (value.length > 16 ? `${value.slice(0, 7)}…${value.slice(-6)}` : value);

export const formatAgo = (then, now = Date.now()) => {
  if (!Number.isFinite(then) || then <= 0) return '';
  const seconds = Math.max(1, Math.round((now - then) / 1000));
  if (seconds < 60) return `${seconds} s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
};

// Milestones step 1, 2.5 and 5 per decade from 100: 100, 250, 500, 1,000, 2,500, 5,000 ...
export const nextMilestone = (plays) => {
  let previous = 0;
  for (let scale = 100; scale <= 1e12; scale *= 10) {
    for (const step of [1, 2.5, 5]) {
      const next = scale * step;
      if (next > plays) return {previous, next, percent: Math.round(((plays - previous) / (next - previous)) * 100)};
      previous = next;
    }
  }
  return {previous, next: previous, percent: 100};
};

const count = (value) => Number.isSafeInteger(value) && value >= 0;

export const parseStats = (data) => {
  if (!data || data.version !== 1 || !count(data.plays) || !count(data.supporters) || !count(data.microStx)) return null;
  if (!Array.isArray(data.latest) || data.latest.length > 3) return null;
  const latest = [];
  for (const play of data.latest) {
    if (!play || !TX.test(play.txid) || !count(play.song) || !ADDRESS.test(play.payer)) return null;
    latest.push({txid: play.txid, song: play.song, payer: play.payer, at: Number.isFinite(play.at) && play.at > 0 ? play.at : null});
  }
  return {
    plays: data.plays,
    supporters: data.supporters,
    microStx: data.microStx,
    latest,
    complete: data.complete === true,
    checkedAt: Number.isFinite(data.checkedAt) && data.checkedAt > 0 ? data.checkedAt : null,
    syncError: Number.isInteger(data.syncError) ? data.syncError : null
  };
};

let snapshot = null;
let lastOk = 0;
let state = 'loading';
let started = false;
let inflight = false;
let generation = 0;
let pollTimer = null;
let labelTimer = null;
let onVisible = null;
let knownTx = new Set();

const all = (key) => document.querySelectorAll(`[data-sup="${key}"]`);
const setText = (key, text) => all(key).forEach((node) => { if (node.textContent !== text) node.textContent = text; });
const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const statusText = () => {
  if (state === 'live') {
    const ago = snapshot?.checkedAt ? formatAgo(snapshot.checkedAt) : '';
    return ago ? `Live · checked ${ago}` : 'Live';
  }
  if (state === 'syncing') return 'Still counting the full history · totals are rising';
  if (state === 'warming') return 'Counting the first batch from the chain… this can take a minute';
  if (state === 'stale') return `Can’t reach the server · last updated ${formatAgo(lastOk) || 'earlier'}`;
  if (state === 'unavailable') return 'Totals are unavailable right now. Try again soon.';
  return 'Checking the chain…';
};

const staleNote = () => {
  if (state === 'stale') return ` · last updated ${formatAgo(lastOk) || 'earlier'}`;
  if (state === 'syncing') return ' · still counting';
  return '';
};

const feedItem = (play, fresh) => {
  const item = document.createElement('li');
  item.className = `home-sup__rcpt${fresh ? ' is-new' : ''}`;
  const song = document.createElement('b');
  song.textContent = `Song #${play.song}`;
  const from = document.createElement('span');
  from.textContent = `from ${shortAddress(play.payer)} · 0.000050 STX`;
  item.append(song, from);
  const ago = play.at ? formatAgo(play.at) : '';
  if (ago) {
    const age = document.createElement('span');
    age.className = 'home-sup__age';
    age.dataset.at = String(play.at);
    age.textContent = ago;
    item.append(age);
  }
  const link = document.createElement('a');
  link.href = `${EXPLORER}${play.txid}?chain=mainnet`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Confirmed on-chain ↗';
  item.append(link);
  return item;
};

const skeletonItem = () => {
  const item = document.createElement('li');
  item.className = 'home-sup__rcpt is-skel';
  item.setAttribute('aria-hidden', 'true');
  return item;
};

const renderFeed = () => {
  const lists = document.querySelectorAll('[data-sup-feed]');
  if (!lists.length) return;
  if (!snapshot) {
    lists.forEach((list) => list.replaceChildren(skeletonItem(), skeletonItem(), skeletonItem()));
    return;
  }
  lists.forEach((list) => {
    if (!snapshot.latest.length) {
      const empty = document.createElement('li');
      empty.className = 'home-sup__empty';
      empty.textContent = 'No paid plays yet. The first one will appear here.';
      list.replaceChildren(empty);
    } else {
      list.replaceChildren(...snapshot.latest.map((play) => feedItem(play, knownTx.size > 0 && !knownTx.has(play.txid))));
    }
  });
  knownTx = new Set(snapshot.latest.map((play) => play.txid));
};

// Cheap refresh for the clock-driven text only, so links in the feed keep keyboard focus.
const renderLabels = () => {
  setText('status', statusText());
  setText('stale-note', staleNote());
  document.querySelectorAll('[data-at]').forEach((node) => {
    const text = formatAgo(Number(node.dataset.at));
    if (node.textContent !== text) node.textContent = text;
  });
};

const bump = (key) => {
  if (reduced()) return;
  all(key).forEach((node) => {
    node.classList.add('is-bumped');
    window.setTimeout(() => node.classList.remove('is-bumped'), 700);
  });
};

const render = (grew = {plays: false, supporters: false}) => {
  document.querySelectorAll('[data-sup-root]').forEach((node) => { node.dataset.state = state; });
  const banner = document.getElementById('musicBanner');
  if (banner) banner.hidden = state === 'unavailable';
  setText('status', statusText());
  setText('stale-note', staleNote());
  if (!snapshot) {
    const placeholder = state === 'unavailable' ? '—' : '…';
    ['plays', 'supporters', 'stx'].forEach((key) => setText(key, placeholder));
    setText('milestone-label', 'Next milestone');
    setText('milestone-left', '');
    all('bar').forEach((node) => { node.style.width = '0%'; });
    renderFeed();
    return;
  }
  setText('plays', formatCount(snapshot.plays));
  setText('supporters', formatCount(snapshot.supporters));
  setText('stx', `${formatStx(snapshot.microStx)} STX`);
  const milestone = nextMilestone(snapshot.plays);
  setText('milestone-label', `Next milestone · ${formatCount(milestone.next)} plays`);
  setText('milestone-left', `${formatCount(milestone.next - snapshot.plays)} to go`);
  all('bar').forEach((node) => {
    node.style.width = `${milestone.percent}%`;
    node.parentElement?.setAttribute('aria-valuenow', String(milestone.percent));
  });
  setText('feed-meta', 'Updated every 30 seconds');
  renderFeed();
  if (grew.plays) bump('plays');
  if (grew.supporters) bump('supporters');
};

const save = () => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({snapshot, savedAt: lastOk}));
  } catch { /* Private windows and blocked storage are fine; the page works without it. */ }
};

const restore = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    const parsed = saved && parseStats({version: 1, ...saved.snapshot});
    if (parsed && Number.isFinite(saved.savedAt)) {
      snapshot = parsed;
      lastOk = saved.savedAt;
      knownTx = new Set(parsed.latest.map((play) => play.txid));
      state = 'checking';
    }
  } catch { /* Ignore unreadable cache. */ }
};

const load = async () => {
  if (inflight) return;
  inflight = true;
  const mount = generation;
  try {
    const response = await fetch(ENDPOINT, {cache: 'no-store', headers: {accept: 'application/json'}, signal: AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const parsed = parseStats(await response.json());
    if (mount !== generation) return; // The page was left or remounted while this read was in flight.
    if (!parsed) throw new Error('Unexpected response');
    if (parsed.plays === 0 && !parsed.complete) {
      // Nothing has been counted yet. That is "not known", never "zero": keep any remembered
      // totals, otherwise show a warming-up state, or unavailable if the server cannot read the chain.
      state = snapshot ? 'stale' : parsed.syncError ? 'unavailable' : 'warming';
      render();
      return;
    }
    const grew = {plays: !!snapshot && parsed.plays > snapshot.plays, supporters: !!snapshot && parsed.supporters > snapshot.supporters};
    snapshot = parsed;
    lastOk = Date.now();
    state = parsed.complete ? 'live' : 'syncing';
    save();
    render(grew);
  } catch {
    if (mount !== generation) return;
    state = snapshot ? 'stale' : 'unavailable';
    render();
  } finally {
    if (mount === generation) inflight = false;
  }
};

export const initMusicSupporters = () => {
  if (started) return;
  if (!document.getElementById('musicBanner') && !document.getElementById('musicSupporters')) return;
  started = true;
  generation++;
  inflight = false;
  snapshot = null;
  state = 'loading';
  restore();
  render();
  void load();
  pollTimer = window.setInterval(() => { if (!document.hidden) void load(); }, POLL_MS);
  labelTimer = window.setInterval(() => { if (!document.hidden && snapshot) renderLabels(); }, LABEL_MS);
  onVisible = () => { if (!document.hidden) void load(); };
  document.addEventListener('visibilitychange', onVisible);
};

export const stopMusicSupporters = () => {
  if (!started) return;
  started = false;
  generation++;
  window.clearInterval(pollTimer);
  window.clearInterval(labelTimer);
  pollTimer = null;
  labelTimer = null;
  if (onVisible) document.removeEventListener('visibilitychange', onVisible);
  onVisible = null;
};
