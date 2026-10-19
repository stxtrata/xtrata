// Homepage giveaway hero: the free album drop, live. Reads the same endpoint as /giveaway
// (GET /radio/giveaway) and draws one disc per copy: claimed ones stamped, the live one glowing.
// Counts down against the server clock (`now`), so a phone with the wrong time still counts right.
// Without data (offline, loading, error) the hero still reads well and links to /giveaway.
const ENDPOINT = '/radio/giveaway';
const CLAIM_BASE = 'https://radio.xtrata.xyz/radio.html#gift=';
const DROP_HREF = '/giveaway';
const CODE_RE = /^[A-Za-z0-9_-]{22}$/;

let timer = 0;
let tickTimer = 0;
let stopped = true;
let drawn = 0;
let nextAt = 0;
let skew = 0;
let state = 'loading';

const $ = (root, key) => root.querySelector(`[data-give="${key}"]`);

export const summarise = (v) => {
  const held = Math.max(0, Number(v?.held) || 0);
  const claimed = Math.max(0, Number(v?.claimed) || 0);
  const left = Math.max(0, Number(v?.left) || 0);
  const code = typeof v?.code === 'string' && CODE_RE.test(v.code) ? v.code : '';
  let st = typeof v?.state === 'string' ? v.state : 'error';
  if (st === 'live' && !code) st = 'waiting';
  return { state: st, code, held, claimed, left, gone: held + claimed, total: held + claimed + left,
    nextAt: typeof v?.nextAt === 'number' ? v.nextAt : 0, now: typeof v?.now === 'number' ? v.now : 0 };
};

const drawDiscs = (root, s) => {
  const box = $(root, 'discs');
  if (!box) return;
  if (s.total < 1) { box.hidden = true; return; }
  box.hidden = false;
  if (drawn !== s.total) {
    box.textContent = '';
    for (let i = 0; i < s.total; i += 1) box.appendChild(document.createElement('i'));
    drawn = s.total;
  }
  const label = `${s.total} discs, ${s.gone} already gone${s.state === 'live' ? `, copy ${s.gone + 1} live now` : ''}`;
  box.setAttribute('aria-label', label);
  [...box.children].forEach((node, i) => {
    node.className = i < s.held ? 'is-held' : i < s.gone ? 'is-done' : (s.state === 'live' && i === s.gone ? 'is-now' : '');
  });
};

const fmt = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

const paintClock = (root) => {
  const kicker = $(root, 'kicker');
  if (!kicker || state === 'live' || !nextAt) return;
  const secs = Math.max(0, Math.ceil((nextAt - (Date.now() + skew)) / 1000));
  kicker.textContent = secs > 0 ? `Next copy in ${fmt(secs)}` : 'Next copy any second now';
};

const render = (root, s) => {
  state = s.state;
  nextAt = s.state === 'taken' || s.state === 'waiting' ? s.nextAt : 0;
  skew = s.now ? s.now - Date.now() : 0;
  root.dataset.state = s.state;
  const title = $(root, 'total');
  const lead = $(root, 'lead');
  const cta = $(root, 'cta');
  const status = $(root, 'status');
  const kicker = $(root, 'kicker');
  if (s.total > 0 && title) title.textContent = `${s.total} copies.`;
  drawDiscs(root, s);
  if (status) {
    status.textContent = s.total > 0 ? `${s.gone} gone · ${s.left} still to come` : '';
    status.hidden = s.total < 1;
  }
  if (s.state === 'live') {
    const w = String(s.total).length;
    if (kicker) kicker.textContent = `Live now · Copy No. ${String(s.gone + 1).padStart(w, '0')} of ${s.total}`;
    if (lead) lead.textContent = 'Tap the live copy first and it is yours to keep. Your face or fingerprint is the only sign-up.';
    if (cta) { cta.textContent = 'Claim this copy →'; cta.href = CLAIM_BASE + s.code; cta.target = '_blank'; cta.rel = 'noopener'; }
  } else if (s.state === 'done') {
    if (kicker) kicker.textContent = 'Finished';
    if (lead) lead.textContent = 'Every copy has found a home. Come and see who got them.';
    if (cta) { cta.textContent = 'See the drop →'; cta.href = DROP_HREF; cta.removeAttribute('target'); }
  } else {
    if (lead) lead.textContent = 'A new copy goes live here on a timer. Tap it first and it is yours to keep, with only your face or fingerprint to sign up.';
    if (cta) { cta.textContent = 'Watch the drop →'; cta.href = DROP_HREF; cta.removeAttribute('target'); }
    if (s.state !== 'taken' && s.state !== 'waiting' && kicker) kicker.textContent = 'Free album drop';
    paintClock(root);
  }
};

const poll = (root) => {
  clearTimeout(timer);
  if (stopped) return;
  fetch(ENDPOINT, { cache: 'no-store' })
    .then((r) => { if (!r.ok) throw new Error(`http ${r.status}`); return r.json(); })
    .then((v) => render(root, summarise(v)))
    .catch(() => { if (state === 'loading') render(root, summarise({ state: 'error' })); })
    .then(() => {
      if (stopped) return;
      let wait = document.hidden ? 20000 : 8000;
      if (nextAt && !document.hidden) wait = (nextAt - (Date.now() + skew)) / 1000 > 30 ? 15000 : 3000;
      if (state === 'done') wait = 60000;
      timer = setTimeout(() => poll(root), wait);
    });
};

export const initGiveawayHero = () => {
  const root = document.getElementById('giveawayHero');
  if (!root || !stopped) return;
  stopped = false;
  drawn = 0;
  poll(root);
  tickTimer = setInterval(() => paintClock(root), 1000);
  document.addEventListener('visibilitychange', onVisible);
};

const onVisible = () => {
  const root = document.getElementById('giveawayHero');
  if (root && !stopped && !document.hidden) poll(root);
};

export const stopGiveawayHero = () => {
  stopped = true;
  clearTimeout(timer);
  clearInterval(tickTimer);
  document.removeEventListener('visibilitychange', onVisible);
};
