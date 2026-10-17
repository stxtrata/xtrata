// Audionaut gate: "sell" layer.
//
// Self-contained: it watches #stage (data-state / data-mode, set by audionaut-gate.js) and never
// touches the gate's own code. Wallet connected but no Audionaut ("denied") gets the full montage,
// story cards and optional music. No wallet yet ("sealed") gets a quiet, blurred version. Anything
// else (scanning, granted) shows nothing, so holders never load or hear any of this.
//
// Music is opt-in only (never autoplays). The loop clip lives at CLIP_URL; if it is missing the
// music button simply never appears. Add ?sell=tune to the URL to audition and trim the section
// from the full-length local file (see docs/audionaut-sell.md).

const BPM = 115; // measured from SuperUser__Universal.wav
const BAR = (60 / BPM) * 4;
const DOWNBEAT = 0.807; // seconds into the full track where a bar line falls
const CLIP_URL = '/audionaut/sell/super-user-loop.mp3';
const TUNE_URL = '/audionaut/sell/_local/super-user-full.mp3';
const CTA_HREF = '/collection/audionauts-1-0';
const CARD_MS = 8000;

const FACES = [
  ['JIBASS', 'BASS', 170], ['TINE', 'KEYS', 32], ['TONEWHEEL', 'ORGAN', 24], ['KIT', 'DRUMS', 8],
  ['ENSEMBLE', 'STRINGS', 200], ['MODAL', 'BELLS', 280], ['WINDS', 'AIR', 150], ['MORPH', 'PAD', 300],
  ['TEXTURE', 'NOISE', 190], ['LANTERN', 'GLOW', 40], ['PRISM', 'GLASS', 320], ['FM4', 'FM', 350],
  ['VOX', 'VOICE', 100], ['PLUCK', 'STRING', 60],
];

const CARDS = [
  ['01 · THE IDEA', 'Make music that cannot be taken down.',
    'The Audional Sequencer is a studio that runs in your browser. Your sounds and your songs live on Bitcoin, not on a company’s server.'],
  ['02 · THE SEQUENCER', 'A recording studio in a tab.',
    'Sixteen instruments, a step sequencer, a mixer and starter songs in a dozen styles. It is live now. Press play and make something in minutes.'],
  ['03 · ORDINALS AND AUDIONALS', 'Sound that you own.',
    'Ordinals let anyone inscribe data permanently on Bitcoin. Audionals do it for audio: samples, instruments and songs, each one a collectable you can hold, trade and play.'],
  ['04 · TOGETHER', 'Songs and samples are already waiting.',
    'Other artists have already put songs and samples on-chain for you to build with. Every new collaborator adds to the pile for the next one.'],
  ['05 · REMIX', 'Remix what others made.',
    'Pull their samples into your own track, or rework a whole song. The original stays on-chain, untouched, forever. Your Audionaut is the key that opens the studio.'],
];

const css = `
.sell-layer{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none;opacity:0;transition:opacity .9s ease}
.sell-layer[data-on="1"]{opacity:1}
.sell-grid{position:absolute;inset:-60px;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:22px;padding:60px;transform:rotate(-3deg) scale(1.08)}
.sell-layer[data-mode="guest"] .sell-grid{opacity:.45;filter:blur(1.5px)}
.sell-tile{border-radius:10px;border:1px solid var(--e);background:var(--b);opacity:.5;padding:18px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;transition:opacity .25s,box-shadow .25s,border-color .25s,background .25s}
.sell-tile[data-lit="1"]{opacity:1;border-color:var(--el);background:var(--bl);box-shadow:0 0 40px var(--g)}
.sell-tile .t{display:flex;justify-content:space-between;align-items:baseline;font:700 13px monospace;letter-spacing:3px;color:var(--i)}
.sell-tile .t em{font:10px monospace;letter-spacing:2px;opacity:.6;font-style:normal}
.sell-tile .k{display:flex;gap:16px}
.sell-tile .k i{width:34px;height:34px;border-radius:50%;border:2px solid var(--i);box-shadow:inset 0 0 0 5px var(--b),inset 0 0 0 7px var(--i);opacity:.7}
.sell-tile .s{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:5px}
.sell-tile .s i{height:16px;border-radius:2px;background:var(--i);opacity:.2}
.sell-tile .s i.x{opacity:.85}
.sell-vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(9,14,16,.15) 0%,rgba(9,14,16,.82) 100%)}
.sell-card,.sell-music,.sell-tune{box-sizing:border-box}
.sell-card,.sell-music{display:none}
.sell-on .sell-card{display:block}
.sell-on.sell-has-music .sell-music{display:flex}
.sell-card{position:fixed;left:44px;bottom:44px;width:420px;max-width:calc(100vw - 32px);padding:22px 24px;border-radius:10px;border:1px solid #284246;background:rgba(6,18,20,.88);color:#d8ebe3;z-index:2}
.sell-card .n{font:10px monospace;letter-spacing:3px;color:#ffb04d}
.sell-card h2{margin:10px 0 0;font:700 22px/1.15 Inter,system-ui,-apple-system,"Segoe UI",sans-serif}
.sell-card p{margin:10px 0 0;font:14px/1.5 Arial,Helvetica,sans-serif;color:#a9c5bc}
.sell-card a.cta{display:inline-block;margin-top:14px;padding:12px 16px;border-radius:6px;background:#ffb04d;color:#1a1208;font:700 11px monospace;letter-spacing:3px;text-decoration:none}
.sell-card .dots{display:flex;gap:6px;margin-top:16px}
.sell-card .dots i{flex:1;height:3px;background:#284246;transition:background .3s}
.sell-card .dots i[data-on="1"]{background:#46ffa4}
.sell-card[data-mode="guest"]{left:50%;transform:translateX(-50%);text-align:center;bottom:28px}
.sell-card[data-mode="guest"] .dots{display:none}
.sell-music{position:fixed;top:22px;right:28px;align-items:center;gap:12px;z-index:2;color:#8eb6aa;font:10px monospace;letter-spacing:2px}
.sell-music button{display:flex;align-items:center;gap:8px;border:1px solid #324246;background:#152024;border-radius:6px;padding:9px 14px;color:#93a7a4;font:10px monospace;letter-spacing:1.5px;cursor:pointer}
.sell-music button[aria-pressed="true"]{color:#ffb04d;border-color:#67583d}
.sell-music b{width:8px;height:8px;border-radius:50%;background:#53685e}
.sell-music button[aria-pressed="true"] b{background:#46ffa4;box-shadow:0 0 8px #46ffa4}
.sell-tune{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:60;width:min(760px,calc(100vw - 24px));padding:16px;border-radius:10px;border:1px solid #67583d;background:rgba(6,18,20,.96);color:#d8ebe3;font:11px monospace;letter-spacing:1.2px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 18px}
.sell-tune label{display:block}
.sell-tune input[type=range]{width:100%;accent-color:#ffb04d}
.sell-tune button{padding:9px 12px;border-radius:6px;border:1px solid #66705f99;background:#152024;color:#d7e1d8;font:11px monospace;letter-spacing:2px;cursor:pointer}
.sell-tune .wide{grid-column:1/-1;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
@media (max-width:820px){
  .sell-card{position:static;transform:none!important;width:100%;max-width:420px;margin:0 auto;left:auto;bottom:auto}
  .sell-music{position:static;margin:0 auto}
  .sell-grid{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(5,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){.sell-layer,.sell-tile{transition:none}}
`;

const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el(tag, props = {}, kids = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'text') n.textContent = v;
    else if (k === 'style') n.style.cssText = v;
    else n.setAttribute(k, v);
  }
  for (const c of kids) n.append(c);
  return n;
}

function makeTile([name, kind, hue]) {
  const sq = [1, 0, 0, 1, 1, 0, 1, 0].map((x) => el('i', x ? { class: 'x' } : {}));
  const t = el('div', { class: 'sell-tile' }, [
    el('div', { class: 't' }, [el('span', { text: name }), el('em', { text: kind })]),
    el('div', { class: 'k' }, [el('i'), el('i'), el('i'), el('i')]),
    el('div', { class: 's' }, sq),
  ]);
  const v = (p, s) => t.style.setProperty(p, s);
  v('--b', `hsl(${hue},30%,10%)`); v('--bl', `hsl(${hue},30%,16%)`);
  v('--e', `hsl(${hue},25%,26%)`); v('--el', `hsl(${hue},80%,60%)`);
  v('--i', `hsl(${hue},45%,58%)`); v('--g', `hsla(${hue},90%,60%,.45)`);
  return t;
}

export function initAudionautSell() {
  const stage = document.getElementById('stage');
  if (!stage || document.getElementById('sellLayer')) return;
  const tuneMode = new URLSearchParams(location.search).get('sell') === 'tune';

  document.head.append(el('style', { text: css }));

  const grid = el('div', { class: 'sell-grid' });
  const tiles = FACES.map(makeTile);
  tiles.forEach((t) => grid.append(t));
  grid.append(el('div', { class: 'sell-tile', style: 'justify-content:center;align-items:center;--b:#0e1a1d;--bl:#0e1a1d;--e:#284246;--el:#284246;--i:#8eb6aa;--g:transparent' }, [
    el('div', { class: 't', style: 'letter-spacing:6px', text: 'AUDIONAUT' }),
  ]));
  const layer = el('div', { class: 'sell-layer', id: 'sellLayer', 'aria-hidden': 'true' }, [grid, el('div', { class: 'sell-vig' })]);
  stage.prepend(layer);

  const nEl = el('div', { class: 'n' });
  const hEl = el('h2');
  const pEl = el('p');
  const cta = el('a', { class: 'cta', href: CTA_HREF, text: 'GET AN AUDIONAUT' });
  const dots = el('div', { class: 'dots' }, CARDS.map(() => el('i')));
  const card = el('aside', { class: 'sell-card', 'aria-label': 'About the Audional Sequencer' }, [nEl, hEl, pEl, cta, dots]);

  const musicLabel = el('span', { text: 'SUPER USER' });
  const musicBtn = el('button', { type: 'button', 'aria-pressed': 'false' }, [el('b'), el('span', { text: 'MUSIC OFF · TAP TO HEAR' })]);
  const music = el('div', { class: 'sell-music' }, [musicLabel, musicBtn]);
  stage.append(card, music);

  // ---------- state ----------
  let mode = 'off';
  let cardIx = 0;
  let cardTimer = 0;
  let raf = 0;
  let litIx = -1;
  let t0 = performance.now();
  let audio = null; // {ctx, gain, src, startedAt}
  let clipOk = null;

  const setCard = (i) => {
    cardIx = i % CARDS.length;
    const c = CARDS[cardIx];
    nEl.textContent = c[0]; hEl.textContent = c[1]; pEl.textContent = c[2];
    cta.style.display = (cardIx === CARDS.length - 1 && mode === 'denied') ? 'inline-block' : 'none';
    [...dots.children].forEach((d, k) => d.setAttribute('data-on', k <= cardIx ? '1' : '0'));
  };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    let beat;
    if (audio && audio.ctx.state === 'running') beat = Math.floor((audio.ctx.currentTime - audio.startedAt) / (60 / BPM));
    else beat = Math.floor((performance.now() - t0) / (reduceMotion() ? 4000 : (mode === 'guest' ? 2 : 1) * (60 / BPM) * 1000));
    const ix = ((beat % tiles.length) + tiles.length) % tiles.length;
    if (ix === litIx) return;
    if (litIx >= 0) tiles[litIx].removeAttribute('data-lit');
    tiles[ix].setAttribute('data-lit', '1');
    litIx = ix;
  };

  const start = (m) => {
    mode = m;
    layer.setAttribute('data-mode', m);
    layer.setAttribute('data-on', '1');
    card.setAttribute('data-mode', m);
    stage.classList.add('sell-on');
    clearInterval(cardTimer);
    if (m === 'guest') { setCard(0); }
    else { setCard(cardIx); cardTimer = setInterval(() => setCard(cardIx + 1), CARD_MS); }
    if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(tick); }
    if (clipOk === null) probeClip();
    stage.classList.toggle('sell-has-music', clipOk === true || tuneMode);
  };

  const stop = () => {
    mode = 'off';
    layer.setAttribute('data-on', '0');
    stage.classList.remove('sell-on');
    clearInterval(cardTimer);
    cancelAnimationFrame(raf); raf = 0;
    stopMusic();
  };

  // ---------- music ----------
  async function probeClip() {
    clipOk = false;
    try {
      const r = await fetch(CLIP_URL, { method: 'HEAD' });
      clipOk = r.ok && /audio|octet/.test(r.headers.get('content-type') || '');
    } catch (_) { clipOk = false; }
    if (mode !== 'off') stage.classList.toggle('sell-has-music', clipOk === true || tuneMode);
  }

  let buffer = null;
  async function loadBuffer(ctx, url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error('clip missing');
    return ctx.decodeAudioData(await r.arrayBuffer());
  }

  async function playMusic(win) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    stopMusic(true);
    const ctx = (audio && audio.ctx) || new AC();
    await ctx.resume();
    const url = win ? TUNE_URL : CLIP_URL;
    if (!buffer || buffer.url !== url) { const b = await loadBuffer(ctx, url); b.url = url; buffer = b; }
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    if (win) { src.loopStart = win.start; src.loopEnd = Math.min(buffer.duration, win.start + win.len); }
    src.connect(gain);
    const startedAt = ctx.currentTime + 0.05;
    src.start(startedAt, win ? win.start : 0);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 1.5);
    audio = { ctx, gain, src, startedAt };
    musicBtn.setAttribute('aria-pressed', 'true');
    musicBtn.lastChild.textContent = 'MUSIC ON';
  }

  function stopMusic(keepCtx) {
    if (!audio) return;
    const { ctx, gain, src } = audio;
    try {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      src.stop(ctx.currentTime + 0.45);
    } catch (_) { /* already stopped */ }
    if (!keepCtx) { setTimeout(() => { try { ctx.close(); } catch (_) { /* ignore */ } }, 600); audio = null; }
    musicBtn.setAttribute('aria-pressed', 'false');
    musicBtn.lastChild.textContent = 'MUSIC OFF · TAP TO HEAR';
  }

  musicBtn.addEventListener('click', async () => {
    if (musicBtn.getAttribute('aria-pressed') === 'true') { stopMusic(); return; }
    try { await playMusic(null); } catch (_) { stage.classList.remove('sell-has-music'); }
  });

  document.addEventListener('visibilitychange', () => {
    if (!audio) return;
    if (document.hidden) audio.ctx.suspend(); else audio.ctx.resume();
  });

  // ---------- gate state ----------
  const classify = () => {
    if (tuneMode) return 'denied';
    const s = stage.getAttribute('data-state');
    const m = stage.getAttribute('data-mode');
    if (document.body.getAttribute('data-view') === 'seq') return 'off';
    if (s === 'denied' || m === 'denied') return 'denied';
    if (s === 'sealed' && (!m || m === 'idle')) return 'guest';
    return 'off';
  };
  const sync = () => {
    const next = classify();
    if (next === mode) return;
    if (next === 'off') stop(); else start(next);
  };
  new MutationObserver(sync).observe(stage, { attributes: true, attributeFilter: ['data-state', 'data-mode'] });
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['data-view'] });
  sync();

  if (tuneMode) initTuner();

  // ---------- tuner: pick the loop section from the full local file ----------
  function initTuner() {
    const st = { start: 115.59, len: BAR * 16 };
    const mk = (min, max, step, val) => el('input', { type: 'range', min, max, step, value: val });
    const startIn = mk(0, 300, 0.01, st.start);
    const lenIn = mk(8, 60, 0.01, st.len);
    const out = el('div', { class: 'wide' });
    const readout = el('span');
    const status = el('span', { style: 'color:#8eb6aa' });
    const lab = (t, input) => el('label', { text: t }, [input]);
    const playBtn = el('button', { type: 'button', text: 'PLAY LOOP' });
    const stopBtn = el('button', { type: 'button', text: 'STOP' });
    const snapBtn = el('button', { type: 'button', text: 'SNAP START TO BAR' });
    const barsBtn = el('button', { type: 'button', text: 'LENGTH = 16 BARS' });
    const copyBtn = el('button', { type: 'button', text: 'COPY SETTINGS' });
    out.append(playBtn, stopBtn, snapBtn, barsBtn, copyBtn, readout, status);
    const panel = el('div', { class: 'sell-tune' }, [lab('MOVE: START', startIn), lab('TRIM: LENGTH', lenIn), out]);
    document.body.append(panel);

    const show = () => {
      readout.textContent = `START ${st.start.toFixed(2)}s  LENGTH ${st.len.toFixed(2)}s  (${(st.len / BAR).toFixed(2)} bars @ ${BPM} bpm)`;
    };
    let debounce = 0;
    const live = () => {
      show();
      if (!audio) return;
      clearTimeout(debounce);
      debounce = setTimeout(() => playMusic({ ...st }).catch(() => {}), 160);
    };
    startIn.addEventListener('input', () => { st.start = Number(startIn.value); live(); });
    lenIn.addEventListener('input', () => { st.len = Number(lenIn.value); live(); });
    snapBtn.addEventListener('click', () => {
      st.start = DOWNBEAT + Math.round((st.start - DOWNBEAT) / BAR) * BAR;
      startIn.value = st.start; live();
    });
    barsBtn.addEventListener('click', () => { st.len = BAR * 16; lenIn.value = st.len; live(); });
    playBtn.addEventListener('click', async () => {
      status.textContent = '';
      try { await playMusic({ ...st }); } catch (e) { status.textContent = 'Full file missing: see docs/audionaut-sell.md'; }
    });
    stopBtn.addEventListener('click', () => stopMusic());
    copyBtn.addEventListener('click', () => {
      const txt = `start=${st.start.toFixed(3)} length=${st.len.toFixed(3)} bpm=${BPM}`;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => { status.textContent = 'copied'; }, () => { status.textContent = txt; });
    });
    show();
  }
}

initAudionautSell();
