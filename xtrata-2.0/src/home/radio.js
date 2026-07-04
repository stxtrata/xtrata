// Xtrata Radio — a little embedded radio station for the homepage soundtrack.
// Toggling on makes a radio-tuning noise (WebAudio, no assets) and then plays a
// random rotation of inscribed songs. Tracks are ordinary inscriptions: raw
// audio ones play directly from /inscription/<id>; HTML player inscriptions
// (the Opus players) are fetched and their embedded data:audio source is
// extracted and played, so the station works across formats.

import radioCss from './radio.css?inline';

const STORAGE_KEY = 'xtrata.radio.v1';

// --- debug logging -----------------------------------------------------
// Enable everything:  localStorage.setItem('xtrata.radio.debug','1')  or ?radiodebug=1
// Watched ids always log, even with debug off (e.g. the troublesome #1065).
const DEBUG_IDS = new Set(['1065', '8']);
const debugEnabled = () => {
  try {
    return window.localStorage.getItem('xtrata.radio.debug') === '1' ||
      new URLSearchParams(window.location.search).get('radiodebug') === '1';
  } catch { return false; }
};
const radioLog = (event, detail, tokenId) => {
  if (!debugEnabled() && !(tokenId && DEBUG_IDS.has(String(tokenId)))) return;
  // eslint-disable-next-line no-console
  console.log(`[radio ${new Date().toISOString().slice(11, 23)}] ${event}`, detail ?? '');
};
const LIKES_KEY = 'xtrata.radio.likes';
const loadLikes = () => {
  try { return JSON.parse(window.localStorage.getItem(LIKES_KEY) || '[]') || []; }
  catch { return []; }
};
const saveLikes = (likes) => {
  try { window.localStorage.setItem(LIKES_KEY, JSON.stringify(likes.slice(0, 200))); } catch { /* noop */ }
};
const loadState = () => {
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') || {}; }
  catch { return {}; }
};
const saveState = (state) => {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
};

export const initXtrataRadio = ({ tokenIds = [], stationName = 'XTRATA FM', mount = null } = {}) => {
  if (!tokenIds.length || typeof document === 'undefined') {
    return null;
  }
  if (document.querySelector('.xtrata-radio')) {
    return null; // one radio per page, whichever bundle loads first
  }
  if (!document.getElementById('xtrata-radio-css')) {
    const style = document.createElement('style');
    style.id = 'xtrata-radio-css';
    style.textContent = radioCss;
    document.head.appendChild(style);
  }

  // --- UI -------------------------------------------------------------
  const root = document.createElement('div');
  root.className = 'xtrata-radio';
  root.innerHTML = [
    // Hidden power element: the engine binds on/off to .xtrata-radio__toggle.
    '<button class="xtrata-radio__toggle" type="button" aria-pressed="false" hidden></button>',
    '<div class="xtrata-radio__stage">',
    '  <div class="xtrata-radio__display" role="button" tabindex="0" title="Xtrata Radio">',
    '    <div class="xtrata-radio__dmain">',
    '      <div class="xtrata-radio__meta">',
    '        <span class="xtrata-radio__brand">XTRATA FM</span>',
    '      </div>',
    '      <div class="xtrata-radio__screen"><span class="xtrata-radio__screen-text"></span></div>',
    '    </div>',
    '    <div class="xtrata-radio__drail">',
    '      <span class="xtrata-radio__vu"><i></i><i></i><i></i><i></i><i></i><i></i></span>',
    '      <a class="xtrata-radio__art" target="_blank" rel="noopener" title="View the inscribed original">',
    '        <img alt="" loading="lazy" />',
    '      </a>',
    '    </div>',
    '  </div>',
    '  <button class="xtrata-radio__btn xtrata-radio__btn--playlist" type="button" title="Your station (liked band)"><span class="xtrata-radio__ring"></span></button>',
    '  <button class="xtrata-radio__btn xtrata-radio__btn--shuffle" type="button" title="Discovery preset"><span class="xtrata-radio__lit"></span><span class="xtrata-radio__ring"></span></button>',
    '  <button class="xtrata-radio__btn xtrata-radio__btn--heart" type="button" title="Like this song"><span class="xtrata-radio__lit"></span><span class="xtrata-radio__ring"></span></button>',
    '  <button class="xtrata-radio__btn xtrata-radio__btn--repeat" type="button" title="Loop this song"><span class="xtrata-radio__lit"></span><span class="xtrata-radio__ring"></span></button>',
    '  <button class="xtrata-radio__btn xtrata-radio__btn--prev xtrata-radio__tbtn" type="button" data-dir="prev" title="Previous song"><span class="xtrata-radio__ring"></span></button>',
    '  <button class="xtrata-radio__btn xtrata-radio__btn--play" type="button" title="Play / pause"><span class="xtrata-radio__lit xtrata-radio__lit--play"></span><span class="xtrata-radio__lit xtrata-radio__lit--pause"></span><span class="xtrata-radio__ring"></span></button>',
    '  <button class="xtrata-radio__btn xtrata-radio__btn--next xtrata-radio__tbtn" type="button" data-dir="next" title="Next song"><span class="xtrata-radio__ring"></span></button>',
    '  <span class="xtrata-radio__pot xtrata-radio__pot--band" role="button" tabindex="0" title="Band: FM / Liked / Chain"><span class="xtrata-radio__potcore"></span></span>',
    '  <span class="xtrata-radio__pot xtrata-radio__pot--preset" role="button" tabindex="0" title="Preset: All / Music"><span class="xtrata-radio__potcore"></span></span>',
    '  <span class="xtrata-radio__pot xtrata-radio__pot--tone" aria-hidden="true"><span class="xtrata-radio__potcore"></span></span>',
    '  <span class="xtrata-radio__pot xtrata-radio__pot--balance" aria-hidden="true"><span class="xtrata-radio__potcore"></span></span>',
    '  <span class="xtrata-radio__pot xtrata-radio__pot--volume"><span class="xtrata-radio__knob" role="slider" aria-label="Volume" aria-valuemin="-1" aria-valuemax="10" title="Volume - scroll or drag; below 0 clicks off"></span></span>',
    '  <button class="xtrata-radio__mini" type="button" title="Minimise radio"></button>',
    '</div>',
    '<button class="xtrata-radio__fs-close" type="button" title="Exit fullscreen (Esc)">✕</button>',
    '<div class="xtrata-radio__rel" aria-label="Related inscriptions">',
    '  <span class="xtrata-radio__rel-label">RELATED</span>',
    '  <div class="xtrata-radio__rel-row"></div>',
    '</div>',
    '<div class="xtrata-radio__pctl" aria-label="Radio controls">',
    '  <button type="button" data-p="power" title="Power">\u23fb</button>',
    '  <button type="button" data-p="prev" title="Previous song">\u23ee</button>',
    '  <button type="button" data-p="pp" title="Play / pause">\u25b6</button>',
    '  <button type="button" data-p="next" title="Next song">\u23ed</button>',
    '</div>',
    '<div class="xtrata-radio__fs-hint">Click the <b>XTRATA&nbsp;FM</b> logo or press <b>Esc</b> to exit fullscreen — the music keeps playing</div>'
  ].join('');
  // Optional header dock: pass `mount` and the radio lives there as a compact
  // pill; clicking it opens the fullscreen receiver. No mount → the classic
  // floating widget (bottom-left) used by the standalone pages.
  const dockHost = mount && typeof mount.appendChild === 'function' ? mount : null;
  if (dockHost) root.classList.add('is-docked');
  (dockHost || document.body).appendChild(root);

  const toggleButton = root.querySelector('.xtrata-radio__toggle');
  const screenText = root.querySelector('.xtrata-radio__screen-text');
  const knob = root.querySelector('.xtrata-radio__knob');
  const transportButtons = Array.from(root.querySelectorAll('.xtrata-radio__tbtn'));

  // --- audio plumbing ---------------------------------------------------
  const player = new Audio();
  player.preload = 'auto';
  player.volume = 0.8; // knob default 8/10

  let audioContext = null;
  const getContext = () => {
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioContext = Ctx ? new Ctx() : null;
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  };

  // --- live visuals: beat-pulsing speaker + VU meter -----------------------
  // The <audio> element is routed through an AnalyserNode the first time a
  // song plays. A rAF loop drives: grille pulse from the bass bins, and six
  // log-spaced VU LEDs with peak-hold decay.
  let analyser = null;
  let mediaWired = false;
  let vuFrame = 0;
  let vuLevels = [0, 0, 0, 0, 0, 0];
  let silentSince = 0;
  let silentClockStart = 0;
  const grille = root.querySelector('.xtrata-radio__grille');
  const vuBars = Array.from(root.querySelectorAll('.xtrata-radio__vu i'));

  const wireAnalyser = () => {
    if (mediaWired) return;
    const context = getContext();
    if (!context) return;
    try {
      const source = context.createMediaElementSource(player);
      analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyser.connect(context.destination);
      mediaWired = true;
    } catch {
      analyser = null; // element may already be wired elsewhere — degrade gracefully
    }
  };

  const VU_BANDS = [[1, 3], [3, 6], [6, 12], [12, 24], [24, 48], [48, 96]];
  const vuLoop = () => {
    vuFrame = 0;
    if (!analyser || player.paused || player.ended) {
      // power down: let the LEDs and speaker settle
      vuLevels = vuLevels.map((v) => v * 0.8);
      vuBars.forEach((bar, i) => bar.style.setProperty('--vu', vuLevels[i].toFixed(3)));
      if (grille) grille.style.setProperty('--pulse', '0');
      root.style.setProperty('--pulse', '0');
      if (vuLevels.some((v) => v > 0.02)) vuFrame = window.requestAnimationFrame(vuLoop);
      return;
    }
    const bins = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(bins);
    // Silence detector: a "playing" track with no signal for 8s has no usable
    // audio (e.g. a video-only mp4). Mark it a dud and retune.
    // CRUCIAL mobile guard: a buffering stall also reads as zeros (element not
    // paused, analyser silent) and a suspended AudioContext reads zeros while
    // audio may still be audible. Both froze songs ~15-20s in and skipped them.
    // Real silent audio ADVANCES the media clock while producing no signal, so
    // require the clock to have consumed most of the window before skipping.
    const totalEnergy = bins.reduce((sum, v) => sum + v, 0);
    const contextRunning = !audioContext || audioContext.state === 'running';
    if (totalEnergy > 40) {
      silentSince = 0;
    } else if (!contextRunning || player.readyState < 3 || player.seeking) {
      silentSince = 0; // suspended context or buffering — not evidence of silence
    } else if (player.currentTime > 0.5) {
      if (!silentSince) {
        silentSince = performance.now();
        silentClockStart = player.currentTime;
      } else if (performance.now() - silentSince > 8000 && on) {
        const consumed = player.currentTime - silentClockStart;
        if (consumed < 6) {
          // clock barely moved: the network stalled mid-song — give it another
          // window instead of skipping a perfectly good track
          silentSince = 0;
        } else {
          radioLog(`silent track detected #${currentTokenId}`, 'decoder consumed 8s with no signal — skipping (session-only dud)', currentTokenId);
          // session-only: a false positive must never permanently blacklist a song
          if (currentTokenId) trackCache.set(String(currentTokenId), null);
          silentSince = 0;
          player.pause();
          void tuneToNextTrack();
        }
      }
    }
    // bass drive for the speaker pulse
    let bass = 0;
    for (let i = 1; i < 7; i += 1) bass += bins[i];
    bass = Math.min(1, bass / (6 * 255));
    const drive = (bass * bass).toFixed(3);
    if (grille) grille.style.setProperty('--pulse', drive);
    root.style.setProperty('--pulse', drive);
    // six log-spaced bands with peak hold
    VU_BANDS.forEach(([lo, hi], index) => {
      let sum = 0;
      for (let i = lo; i < hi; i += 1) sum += bins[i];
      const level = Math.min(1, (sum / (hi - lo) / 255) * 1.35);
      vuLevels[index] = Math.max(level, vuLevels[index] * 0.88);
      vuBars[index].style.setProperty('--vu', vuLevels[index].toFixed(3));
    });
    vuFrame = window.requestAnimationFrame(vuLoop);
  };
  const startVu = () => { wireAnalyser(); if (!vuFrame) vuFrame = window.requestAnimationFrame(vuLoop); };

  // --- retro sound engine (all synthesized, no assets) ------------------
  // Layers: a mechanical switch clack, a warm noise bed swept through a
  // band-pass (the "between stations" wash), a heterodyne whistle that glides
  // as the dial moves, and a squelch tail when the station locks in.
  const MASTER_LEVEL = 0.55;

  const makeNoise = (context, seconds) => {
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * seconds), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = Math.random() * 2 - 1;
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    return source;
  };

  const playClick = (context, master, at, strength = 1) => {
    // Bakelite switch: a tight noise tick plus a low, woody thump.
    const tick = makeNoise(context, 0.03);
    const tickFilter = context.createBiquadFilter();
    tickFilter.type = 'highpass';
    tickFilter.frequency.value = 1800;
    const tickGain = context.createGain();
    tickGain.gain.setValueAtTime(0.5 * strength, at);
    tickGain.gain.exponentialRampToValueAtTime(0.001, at + 0.03);
    tick.connect(tickFilter).connect(tickGain).connect(master);
    tick.start(at);

    const thump = context.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(140, at);
    thump.frequency.exponentialRampToValueAtTime(55, at + 0.09);
    const thumpGain = context.createGain();
    thumpGain.gain.setValueAtTime(0.6 * strength, at);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, at + 0.11);
    thump.connect(thumpGain).connect(master);
    thump.start(at);
    thump.stop(at + 0.12);
  };

  const playStaticSweep = (context, master, at, seconds, fromHz, toHz, level) => {
    const noise = makeNoise(context, seconds);
    const band = context.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = 6;
    band.frequency.setValueAtTime(fromHz, at);
    band.frequency.exponentialRampToValueAtTime(toHz, at + seconds * 0.85);
    // gentle amplitude flutter so the static breathes like a real dial
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 0.05);
    const steps = Math.max(3, Math.floor(seconds * 10));
    for (let index = 1; index < steps; index += 1) {
      const when = at + (seconds * index) / steps;
      gain.gain.linearRampToValueAtTime(level * (0.55 + Math.random() * 0.45), when);
    }
    gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
    noise.connect(band).connect(gain).connect(master);
    noise.start(at);
    noise.stop(at + seconds);
  };

  const playHeterodyne = (context, master, at, seconds, direction) => {
    // The classic passing-station whistle: two close oscillators beating,
    // pitch gliding with the dial.
    const osc = context.createOscillator();
    const osc2 = context.createOscillator();
    osc.type = 'sine';
    osc2.type = 'sine';
    const startHz = direction > 0 ? 1400 : 600;
    const endHz = direction > 0 ? 500 : 1600;
    osc.frequency.setValueAtTime(startHz, at);
    osc.frequency.exponentialRampToValueAtTime(endHz, at + seconds);
    osc2.frequency.setValueAtTime(startHz * 1.012, at);
    osc2.frequency.exponentialRampToValueAtTime(endHz * 1.012, at + seconds);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.10, at + seconds * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(master);
    osc.start(at); osc2.start(at);
    osc.stop(at + seconds); osc2.stop(at + seconds);
  };

  const playSquelchTail = (context, master, at) => {
    // Station lock: a short "fsst" that snaps shut.
    const noise = makeNoise(context, 0.16);
    const band = context.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = 2.5;
    band.frequency.setValueAtTime(2600, at);
    band.frequency.exponentialRampToValueAtTime(900, at + 0.14);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.35, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
    noise.connect(band).connect(gain).connect(master);
    noise.start(at);
    noise.stop(at + 0.17);
  };

  // kind: 'on' (full power-up sweep), 'between' (quick squelch retune), 'off'.
  const playTuning = (direction = 1, kind = 'on') => {
    const context = getContext();
    if (!context) return 0;
    const master = context.createGain();
    master.gain.value = MASTER_LEVEL;
    master.connect(context.destination);
    const now = context.currentTime;

    if (kind === 'off') {
      playClick(context, master, now, 1);
      playStaticSweep(context, master, now + 0.02, 0.38, 2800, 300, 0.22);
      playHeterodyne(context, master, now + 0.02, 0.3, -1);
      return 0.42;
    }
    if (kind === 'between') {
      playStaticSweep(context, master, now, 0.4, 700, 2600, 0.3);
      playHeterodyne(context, master, now + 0.05, 0.28, 1);
      playSquelchTail(context, master, now + 0.32);
      return 0.5;
    }
    // full power-on: clack → warm static sweep with whistle → squelch lock
    playClick(context, master, now, 1);
    playStaticSweep(context, master, now + 0.06, 0.85, 350, 3200, 0.34);
    playHeterodyne(context, master, now + 0.18, 0.5, direction);
    playSquelchTail(context, master, now + 0.82);
    return 1.0;
  };

  // --- track resolution ---------------------------------------------------
  // Hardcoded ignore list: inscriptions that resolve as media but must never
  // air (e.g. #1065 — a video-only mp4 with no decodable audio track).
  const IGNORE_IDS = new Set(['1065', '5', '319', '1090']);
  const trackCache = new Map(); // tokenId -> { src, title } | null
  // Duds persist across visits so each page load doesn't burn tune attempts
  // re-discovering the same dead ids (a big source of NO SIGNAL runs).
  const DUDS_KEY = 'xtrata.radio.duds.v1';
  try {
    JSON.parse(window.localStorage.getItem(DUDS_KEY) || '[]').forEach((id) => trackCache.set(String(id), null));
  } catch { /* fresh cache */ }
  // Share what this browser learned with every other listener (D1-backed).
  const reportedVerdicts = new Set();
  const reportVerdict = (tokenId, verdict, reason) => {
    const key = String(tokenId) + ':' + verdict;
    if (reportedVerdicts.has(key)) return;
    reportedVerdicts.add(key);
    try {
      void fetch('/index/verdict', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contract: PLAYABLE_CONTRACT, tokenId: Number(tokenId), verdict, reason: reason || '' })
      });
    } catch { /* advisory only */ }
  };
  const persistDud = (tokenId) => {
    try {
      const duds = JSON.parse(window.localStorage.getItem(DUDS_KEY) || '[]');
      if (!duds.includes(String(tokenId))) {
        duds.push(String(tokenId));
        window.localStorage.setItem(DUDS_KEY, JSON.stringify(duds.slice(-2000)));
      }
    } catch { /* noop */ }
  };
  const resolveTrack = async (tokenId) => {
    if (IGNORE_IDS.has(String(tokenId))) {
      radioLog(`ignored #${tokenId}`, 'on the hardcoded ignore list', tokenId);
      trackCache.set(String(tokenId), null);   // cache as dud so pickers stop selecting it
      return null;
    }
    if (trackCache.has(tokenId)) {
      return trackCache.get(tokenId);
    }
    // Content-source ladder: migrated tokens keep their id on v3 but their
    // chunks stay on the core they were minted on (early ids like #8 live on
    // v1-1-1), so probe newest -> oldest and use the first real response.
    const CORES = [
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0',
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1'
    ];
    let resolved = null;
    let definitive = true; // network hiccups must stay retryable, not become duds
    try {
      let response = null;
      let mime = '';
      let src = `/inscription/${tokenId}`;
      for (const core of CORES) {
        const url = `/runtime/content?contractId=${encodeURIComponent(core)}&tokenId=${tokenId}&network=mainnet`;
        const attempt = await fetch(url);
        const attemptMime = (attempt.headers.get('content-type') || '').toLowerCase();
        radioLog(`resolve #${tokenId}`, { core: core.split('.').pop(), status: attempt.status, mime: attemptMime, length: attempt.headers.get('content-length') }, tokenId);
        if (attempt.ok && !attemptMime.includes('application/json')) {
          response = attempt;
          mime = attemptMime;
          // '&m=1' gives the media element its own cache entry — Chrome otherwise
          // replays this probe's cached response (or vice versa a stored 206) and
          // can wedge large-video loads with mismatched range state.
          src = url + '&m=1';
          break;
        }
        // 404/410 mean the content genuinely isn't on this core — that is a
        // definitive answer. Only server errors / rate limits are transient;
        // treating 404s as transient made dead ids immortal and caused
        // recurring NO SIGNAL runs.
        if (!attempt.ok && attempt.status !== 404 && attempt.status !== 410) definitive = false;
        try { await attempt.body?.cancel(); } catch { /* noop */ }
      }
      if (!response) {
        radioLog(`verdict #${tokenId}`, definitive ? 'DUD (no playable content on any core)' : 'TRANSIENT (will retry; warm requested)', tokenId);
        if (definitive) { trackCache.set(tokenId, null); persistDud(tokenId); reportVerdict(tokenId, 'dud', 'no-content'); }
        else trackCache.delete(tokenId);
        return null;
      }
      if (response.ok && mime.startsWith('audio/')) {
        // SONGS ONLY: plain audio inscriptions (mp3, opus, weba — including the
        // films that were re-encoded webm -> weba). Raw video/* is rejected
        // below: "film audio" mp4s were the main source of silent duds.
        await response.body?.cancel?.();
        resolved = { src, title: `#${tokenId}`, tokenId };
      } else if (response.ok && mime.includes('text/html')) {
        const html = await response.text();
        // Opus players embed their audio as a data: URI on a <source> element.
        // Opus players embed data:audio; some players/films embed data:video —
        // both are playable through the audio element.
        // players must embed data:audio — data:video is no longer accepted
        const match = html.match(/<source[^>]+src="(data:audio\/[^"]+)"/i);
        if (match) {
          const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
          const artistMatch = html.match(/"artist":\s*"([^"]*)"/);
          const coverMatch = html.match(/<img[^>]+src="(data:image\/[^"]+)"/i);
          resolved = {
            src: match[1].replace(/&amp;/g, '&'),
            title: (titleMatch ? titleMatch[1].trim() : '') || `#${tokenId}`,
            artist: artistMatch ? artistMatch[1].trim() : '',
            cover: coverMatch ? coverMatch[1] : '',
            tokenId
          };
        }
      } else {
        // A real response with a non-audio, non-html mime (video, image, …)
        // is a definitive "not a song" — remember and share it.
        await response.body?.cancel?.();
        radioLog(`verdict #${tokenId}`, `not a song (mime ${mime}) — dud`, tokenId);
      }
    } catch {
      resolved = null;
      definitive = false;
    }
    radioLog(`verdict #${tokenId}`, resolved ? { playable: true, src: resolved.src.slice(0, 80), title: resolved.title } : (definitive ? 'DUD' : 'TRANSIENT'), tokenId);
    if (resolved || definitive) {
      trackCache.set(tokenId, resolved);
      if (!resolved) { persistDud(tokenId); reportVerdict(tokenId, 'dud', 'no-audio'); }
    } else {
      trackCache.delete(tokenId); // transient failure — eligible again next pass
      pingWarm(tokenId); // server reconstructs it into R2 for the retry
    }
    return resolved;
  };

  // --- volume knob ---------------------------------------------------------
  // 0..10 steps, default 8. Anticlockwise past 0 hits -1: the power-off click.
  // Turning up from off powers the set back on. Scroll or drag vertically.
  let volumeStep = 8;
  const knobAngle = (step) => -132 + (step + 1) * 24; // -1 -> -132deg … 10 -> +132deg
  const renderKnob = () => {
    if (!knob) return;
    knob.style.transform = `rotate(${knobAngle(on ? volumeStep : -1)}deg)`;
    knob.setAttribute('aria-valuenow', String(on ? volumeStep : -1));
  };
  const applyVolume = () => { player.volume = Math.max(0, Math.min(1, volumeStep / 10)); };

  const flashScreen = (text) => {
    clearSectionTimers();
    screenText.classList.remove('is-scroll');
    screenText.style.removeProperty('--shift');
    screenText.textContent = text;
    sectionTimers.push(window.setTimeout(() => {
      if (currentTrackInfo) tickerStep();
    }, 1100));
  };

  const knobTick = () => {
    const context = getContext();
    if (!context) return;
    const master = context.createGain();
    master.gain.value = 0.3;
    master.connect(context.destination);
    playClick(context, master, context.currentTime, 0.35);
  };

  const nudgeVolume = (delta) => {
    if (!on) {
      if (delta > 0) { volumeStep = Math.max(1, volumeStep); switchOn(); }
      return;
    }
    const next = volumeStep + delta;
    if (next < 0) { switchOff(); return; }        // -1: clicks off like the power switch
    volumeStep = Math.min(10, next);
    applyVolume();
    knobTick();
    renderKnob();
    flashScreen(`VOL ${'▮'.repeat(volumeStep)}${'▯'.repeat(10 - volumeStep)} ${volumeStep}/10`);
  };

  if (knob) {
    knob.addEventListener('click', (event) => event.stopPropagation());
    knob.addEventListener('wheel', (event) => {
      event.preventDefault();
      event.stopPropagation();
      nudgeVolume(event.deltaY < 0 ? 1 : -1);
    }, { passive: false });
    let dragY = null;
    knob.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
      dragY = event.clientY;
      knob.setPointerCapture(event.pointerId);
    });
    knob.addEventListener('pointermove', (event) => {
      if (dragY === null) return;
      const moved = dragY - event.clientY;
      if (Math.abs(moved) >= 12) { nudgeVolume(moved > 0 ? 1 : -1); dragY = event.clientY; }
    });
    knob.addEventListener('pointerup', () => { dragY = null; });
  }

  // --- likes, bands, presets, events ---------------------------------------
  let likes = loadLikes();                 // [{tokenId,title,artist,likedAt}]
  let band = 'fm';                         // 'fm' | 'liked' | 'chain'
  let preset = 'all';                      // within FM: 'music' | 'all'
  // Shuffle is OFF by default: the dial plays in order (likes/curated/chain
  // sequence per band). Neither shuffle nor loop persists across visits —
  // the heart (likes) is the only remembered button.
  let shuffleMode = false;
  const listeners = new Set();
  let nowPlaying = null;                   // {tokenId,title,artist,cover}
  // One canonical snapshot everywhere (emit / getState / subscribe), including
  // `playing` — the ACTUAL audio-element state — so UIs never have to guess
  // play/pause from `on` (which only means "powered").
  // Relatives of the playing song (parents/children/siblings from the edge
  // index). Songs are clickable-to-play; images and other files are shown as
  // display-only context.
  let relatives = [];
  let relativesFor = null;

  const stateSnapshot = () => ({
    on,
    playing: on && !player.paused && !player.ended,
    band, preset, nowPlaying, likes: likes.slice(), volumeStep,
    shuffle: shuffleMode,
    loop: player.loop,
    relatives: relatives.slice()
  });
  const emit = () => {
    const snapshot = stateSnapshot();
    listeners.forEach((cb) => { try { cb(snapshot); } catch { /* listener error */ } });
  };
  // Play/pause state changes must reach subscribers immediately, whatever
  // triggered them (button, media keys, OS controls, stall, ended).
  ['play', 'pause', 'playing', 'ended'].forEach((ev) => player.addEventListener(ev, emit));
  const isLiked = (id) => likes.some((l) => l.tokenId === String(id));
  const toggleLike = () => {
    if (!nowPlaying) return false;
    if (isLiked(nowPlaying.tokenId)) {
      likes = likes.filter((l) => l.tokenId !== nowPlaying.tokenId);
      writeScreen('♡ REMOVED FROM YOUR STATION');
    } else {
      likes.unshift({ tokenId: nowPlaying.tokenId, title: nowPlaying.title, artist: nowPlaying.artist || '', likedAt: Date.now() });
      writeScreen('♥ SAVED TO YOUR STATION');
      knobTick();
    }
    saveLikes(likes);
    sectionTimers.push(window.setTimeout(() => { if (currentTrackInfo) tickerStep(); }, 1400));
    emit();
    return isLiked(nowPlaying.tokenId);
  };
  const classifyRelative = (mime) => {
    const m = String(mime || '').toLowerCase();
    if (m.startsWith('audio/')) return 'audio';
    if (m.includes('text/html')) return 'player';   // song candidate (opus player)
    if (m.startsWith('image/')) return 'image';
    return 'other';
  };

  const fetchRelatives = async (tokenId) => {
    const id = String(tokenId);
    relativesFor = id;
    try {
      const response = await fetch('/index/relations/' + PLAYABLE_CONTRACT + '?id=' + id);
      if (!response.ok) return;
      const data = await response.json();
      if (relativesFor !== id) return;   // a different song landed meanwhile
      const ids = [...new Set([...(data.parents || []), ...(data.children || []), ...(data.siblings || [])])]
        .map(String)
        .filter((rid) => rid !== id)
        .slice(0, 16);
      const mimes = data.mimes || {};
      relatives = ids.map((rid) => {
        const kind = classifyRelative(mimes[rid]);
        const playable = (kind === 'audio' || kind === 'player') && trackCache.get(rid) !== null;
        return { id: rid, kind, playable };
      });
      emit();
    } catch { /* relatives are decorative — never disturb playback */ }
  };

  const BANDS = ['fm', 'liked', 'chain'];
  const setBand = (next) => {
    if (!BANDS.includes(next)) return;
    band = next;
    persistExtras();
    if (on) {
      writeScreen(band === 'fm' ? 'BAND: FM — CURATED + CHAIN' : band === 'liked' ? (likes.length ? 'BAND: LIKED — YOUR STATION' : 'BAND: LIKED — NO SONGS SAVED YET (♥ TO ADD)') : 'BAND: CHAIN — FULL EXPLORATION');
      sectionTimers.push(window.setTimeout(() => { if (currentTrackInfo) tickerStep(); }, 1600));
      // The current song keeps playing — only what's CUED changes.
      requeueForMode();
    }
    emit();
  };
  const cycleBand = () => setBand(BANDS[(BANDS.indexOf(band) + 1) % BANDS.length]);
  const PRESETS = ['all', 'music'];
  const cyclePreset = () => {
    preset = PRESETS[(PRESETS.indexOf(preset) + 1) % PRESETS.length];
    persistExtras();
    if (on) {
      writeScreen(preset === 'music' ? 'PRESET: MUSIC — CURATED ONLY' : 'PRESET: ALL — CURATED + DISCOVERY');
      sectionTimers.push(window.setTimeout(() => { if (currentTrackInfo) tickerStep(); }, 1600));
      requeueForMode(); // current song keeps playing; the queue re-cues
    }
    emit();
  };

  // Flush songs preloaded under the previous mode and cue fresh ones, WITHOUT
  // touching the song that's currently on air.
  function requeueForMode() {
    preloadQueue.length = 0;
    window.setTimeout(() => { void preloadNextTrack(); }, 150);
  }

  const setShuffle = (nextOn) => {
    shuffleMode = Boolean(nextOn);
    if (on) {
      writeScreen(shuffleMode ? 'SHUFFLE: ON — RANDOM PICKS' : 'SHUFFLE: OFF — IN ORDER');
      sectionTimers.push(window.setTimeout(() => { if (currentTrackInfo) tickerStep(); }, 1600));
      requeueForMode();
    }
    emit();
  };

  const setLoop = (nextOn) => {
    player.loop = Boolean(nextOn);
    if (on) {
      writeScreen(player.loop ? 'LOOP: THIS SONG' : 'LOOP: OFF');
      sectionTimers.push(window.setTimeout(() => { if (currentTrackInfo) tickerStep(); }, 1600));
    }
    emit();
  };
  const persistExtras = () => {
    try {
      const state = loadState();
      state.band = band; state.preset = preset;
      saveState(state);
    } catch { /* noop */ }
  };

  // --- station logic -----------------------------------------------------
  // The curated ids are seeds; the station also explores the ENTIRE contract.
  // resolveTrack() is the gatekeeper: anything without playable audio returns
  // null and is skipped (cached), so the dial only ever lands on real music.
  // Known-good tracks outside the curated gallery (early-era opus/mp3s that
  // live on legacy cores) join the seed rotation so they play regularly rather
  // than waiting on a lucky random pick.
  const EXTRA_SEEDS = ['8', '315', '1636', '1122'];
  // Curated seeds NEVER include ignored ids (e.g. #1065 is a curated gallery
  // token but has no decodable audio) — otherwise the picker keeps selecting
  // them, each one burns a tune attempt, and a run of them ends in NO SIGNAL.
  const playlist = [...new Set([...tokenIds.map((id) => id.toString()), ...EXTRA_SEEDS])]
    .filter((id) => !IGNORE_IDS.has(id));
  let maxTokenId = 0;
  const EXPLORE_RATIO = 0.5; // half the picks roam the full id range

  // --- no-repeat memory ----------------------------------------------------
  // Once a song has actually played, it won't play again until the dial has
  // cycled through every other known playable song. Persists across visits;
  // resets automatically when a cycle completes.
  const PLAYED_KEY = 'xtrata.radio.played.v1';
  let played = new Set();
  try { played = new Set(JSON.parse(window.localStorage.getItem(PLAYED_KEY) || '[]')); } catch { /* fresh set */ }
  const savePlayed = () => { try { window.localStorage.setItem(PLAYED_KEY, JSON.stringify([...played].slice(-5000))); } catch { /* noop */ } };
  const markPlayed = (id) => { if (id) { played.add(String(id)); savePlayed(); } };
  const clearPlayed = () => { played = new Set(); savePlayed(); radioLog('no-repeat cycle complete — every known song has aired, starting a fresh cycle'); };
  // Fresh mints (ids that appear while the radio is on) jump the queue so new songs air fast.
  const freshIds = [];

  // --- known-song pool (D1-backed) ------------------------------------------
  // /index/playable serves the FULL list of audio-capable tokens from the edge
  // in one query (the D1 index syncs incrementally from the append-only
  // minted-id list, so only new ids are ever scanned). With this pool the dial
  // never wastes a spin on images/documents, "all known songs" is exact for the
  // no-repeat cycle, and new mints arrive within a refresh.
  const PLAYABLE_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
  let knownPool = [];                 // audio/video first, then html player candidates
  const knownSet = new Set();
  const fetchPlayable = async () => {
    try {
      const response = await fetch('/index/playable?contract=' + encodeURIComponent(PLAYABLE_CONTRACT));
      if (!response.ok) return;
      const data = await response.json();
      // Pre-seed the dud cache with community-reported unplayables so this
      // browser never wastes a tune attempt rediscovering them.
      (data.duds || []).forEach((id) => trackCache.set(String(id), null));
      const ids = [...(data.audio || []), ...(data.html || [])].map(String);
      if (!ids.length) return;
      const hadPool = knownSet.size > 0;
      for (const id of ids) {
        if (!knownSet.has(id)) {
          knownSet.add(id);
          if (hadPool) { freshIds.push(id); radioLog('new song indexed — queued for airplay', { tokenId: id }, id); }
        }
      }
      knownPool = ids;
      if (Number(data.mintedCount) > maxTokenId) maxTokenId = Number(data.mintedCount);
    } catch { /* endpoint down — random exploration below still works */ }
  };

  const discoverRange = async () => {
    try {
      const response = await fetch(
        '/hiro/mainnet/v2/contracts/call-read/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3/get-last-token-id',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sender: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', arguments: [] })
        }
      );
      if (!response.ok) return;
      const data = await response.json();
      const hex = String(data.result || '').replace(/^0x/, '');
      // (ok uint): 07 then 01 then 16 bytes big-endian
      if (data.okay && hex.startsWith('0701')) {
        const value = parseInt(hex.slice(2 + 2), 16);
        if (Number.isFinite(value) && value > 0) {
          if (maxTokenId > 0 && value > maxTokenId) {
            for (let id = maxTokenId + 1; id <= value; id += 1) freshIds.push(String(id));
            radioLog('new inscriptions on-chain — queued for airplay', { from: maxTokenId + 1, to: value });
          }
          maxTokenId = value;
        }
      }
    } catch { /* stay curated-only */ }
  };
  void discoverRange();
  void fetchPlayable();
  // Keep the dial aware of new mints: an open tab re-reads the indexed song list
  // (and the contract ceiling as fallback) every 5 minutes, so a freshly
  // inscribed song becomes playable without a reload.
  window.setInterval(() => { void fetchPlayable(); void discoverRange(); }, 5 * 60 * 1000);
  // STUCK-WATCHDOG: if the radio is switched on but silent for >20 s with no
  // tune in flight, no user pause, and a prior user gesture (autoplay policy),
  // retune automatically — the dial recovers by itself instead of needing a
  // page refresh or an off/on cycle.
  window.setInterval(() => {
    if (!on || manualPause || !hadGesture) return;
    if (!player.paused || player.seeking) return;
    if (Date.now() - lastTuneAt < 20000) return;   // a tune/backoff is still in progress
    radioLog('watchdog: radio is on but silent — auto-retuning');
    void tuneToNextTrack();
  }, 15000);
  let on = false;
  let tuneToken = 0;
  let recent = [];
  let firstTune = true;
  // Self-healing state: the radio must never stay silently stuck — see the
  // NO SIGNAL retry (bottom of tuneToNextTrack) and the stuck-watchdog below.
  let noSignalRetries = 0;
  let manualPause = false;       // user pressed pause — the watchdog must respect it
  let lastTuneAt = 0;
  let hadGesture = false;        // autoplay policy: only auto-retry after a real user gesture
  try {
    if (navigator.userActivation && navigator.userActivation.hasBeenActive) hadGesture = true;
    document.addEventListener('pointerdown', () => { hadGesture = true; }, { capture: true, passive: true });
  } catch { /* conservative default: stays false until a click */ }

  let forcedNext = null;
  // Ordered pool for shuffle-OFF playback: liked band follows your saved list;
  // FM plays the curated order (then known chain songs ascending, preset ALL);
  // CHAIN walks every known song by ascending id.
  const sequentialPool = () => {
    if (band === 'liked') return likes.map((l) => String(l.tokenId));
    const known = knownPool.slice().sort((a, b) => Number(a) - Number(b));
    if (band === 'chain') return known;
    if (preset === 'music') return playlist.slice();
    const curatedSet = new Set(playlist);
    return [...playlist, ...known.filter((id) => !curatedSet.has(id))];
  };

  const pickNext = () => {
    let choice;
    if (forcedNext) { choice = forcedNext; forcedNext = null; recent.push(choice); if (recent.length > 8) recent.shift(); return choice; }
    if (!shuffleMode) {
      // IN-ORDER MODE: continue from the current song's position, skipping
      // known duds; wrap at the end. No random lottery, no no-repeat memory —
      // a fixed order cycles naturally.
      const pool = sequentialPool();
      if (pool.length) {
        const cur = currentTokenId ? String(currentTokenId) : null;
        const start = cur ? pool.indexOf(cur) : -1;
        for (let step = 1; step <= pool.length; step += 1) {
          const candidate = pool[(start + step) % pool.length];
          if (trackCache.get(candidate) === null) continue;
          if (candidate === cur && pool.length > 1) continue;
          choice = candidate;
          break;
        }
      }
      if (choice) {
        recent.push(choice);
        if (recent.length > 8) recent.shift();
        return choice;
      }
      // nothing playable in order (e.g. empty liked list) — fall through to
      // the random logic below rather than going silent
    }
    // Band routing: LIKED = your station only; CHAIN = pure exploration;
    // FM = curated (+ discovery unless preset MUSIC).
    if (band === 'liked' && likes.length) {
      const pool = likes.map((l) => l.tokenId).filter((id) => !recent.includes(id) && trackCache.get(id) !== null);
      choice = (pool.length ? pool : likes.map((l) => l.tokenId))[Math.floor(Math.random() * (pool.length || likes.length))];
      recent.push(choice);
      if (recent.length > 8) recent.shift();
      return choice;
    }
    const exploreChance = band === 'chain' ? 1 : (band === 'fm' && preset === 'music' ? 0 : EXPLORE_RATIO);
    // FRESH-MINT PRIORITY: anything inscribed since load airs next (any band with
    // discovery enabled) — a new song shouldn't have to win the random lottery.
    if (exploreChance > 0) {
      while (!choice && freshIds.length) {
        const candidate = freshIds.shift();
        if (recent.includes(candidate) || played.has(candidate) || trackCache.get(candidate) === null) continue;
        choice = candidate;
      }
    }
    // KNOWN-POOL EXPLORATION: with the D1 station list, pick only from tokens
    // that can actually carry audio, and the no-repeat cycle is exact — a new
    // cycle starts precisely when every known song has aired.
    if (!choice && knownPool.length && Math.random() < exploreChance) {
      let candidates = knownPool.filter((id) => !recent.includes(id) && !played.has(id) && trackCache.get(id) !== null);
      // Only declare the cycle complete if PLAYED songs were what emptied the pool
      // (an all-duds/recent pool must not wipe the no-repeat memory).
      if (!candidates.length && knownPool.some((id) => played.has(id))) {
        clearPlayed();
        candidates = knownPool.filter((id) => !recent.includes(id) && trackCache.get(id) !== null);
      }
      if (candidates.length) choice = candidates[Math.floor(Math.random() * candidates.length)];
    }
    // Fallback (station list unavailable): blind random ids across the range.
    if (!choice && !knownPool.length && maxTokenId > 0 && Math.random() < exploreChance) {
      let playedRejects = 0;
      for (let attempt = 0; attempt < 25; attempt += 1) {
        const candidate = String(1 + Math.floor(Math.random() * maxTokenId));
        if (recent.includes(candidate)) continue;
        if (trackCache.get(candidate) === null) continue; // known dud
        if (played.has(candidate)) { playedRejects += 1; continue; }  // no repeats within a cycle
        choice = candidate;
        break;
      }
      // Every sampled candidate had already aired → the cycle is (statistically)
      // complete. Reset and pick again so the dial keeps spinning, never repeats early.
      if (!choice && playedRejects >= 20) {
        clearPlayed();
        for (let attempt = 0; attempt < 10 && !choice; attempt += 1) {
          const candidate = String(1 + Math.floor(Math.random() * maxTokenId));
          if (!recent.includes(candidate) && trackCache.get(candidate) !== null) choice = candidate;
        }
      }
    }
    if (!choice) {
      let candidates = playlist.filter((id) => !recent.includes(id) && !played.has(id) && trackCache.get(id) !== null);
      // Curated cycle complete (everything played or a known dud) → open a new cycle for these ids.
      if (!candidates.length && playlist.every((id) => played.has(id) || trackCache.get(id) === null)) {
        playlist.forEach((id) => played.delete(id)); savePlayed();
        candidates = playlist.filter((id) => !recent.includes(id) && trackCache.get(id) !== null);
      }
      const pool = candidates.length ? candidates : playlist.filter((id) => !recent.includes(id));
      const finalPool = pool.length ? pool : playlist;
      choice = finalPool[Math.floor(Math.random() * finalPool.length)];
    }
    recent.push(choice);
    if (recent.length > 8) recent.shift();
    return choice;
  };

  // --- warm start: cue the first song while the page idles -----------------
  // The slow part of starting is fetching the inscription (often an HTML player
  // whose audio is a large embedded data: URI) and letting the <audio> element
  // buffer it. We do all of that ahead of time so the first click drops the
  // needle almost instantly.
  // A small queue of fully resolved (and cache-warmed) tracks so both the
  // first switch-on AND skip-button retunes land instantly.
  const PRELOAD_TARGET = 3;
  const preloadQueue = [];
  let preloading = false;

  const WARM_MAX_BYTES = 6 * 1024 * 1024;
  const warmHttpCache = async (src) => {
    if (src.startsWith('data:')) return; // already in memory
    try {
      const response = await fetch(src);
      const length = Number(response.headers.get('content-length') || '0');
      if (length > WARM_MAX_BYTES) {
        // Big file (e.g. an 11MB film): don't hold the whole thing in memory —
        // reading the headers has already warmed the server-side R2 cache, and
        // the audio element streams it with range requests when it plays.
        try { await response.body?.cancel(); } catch { /* noop */ }
        return;
      }
      await response.arrayBuffer();
    } catch { /* best-effort */ }
  };

  const preloadNextTrack = async () => {
    if (preloading) return;
    preloading = true;
    try {
      let attempts = 0;
      while (preloadQueue.length < PRELOAD_TARGET && attempts < PRELOAD_TARGET * 3) {
        attempts += 1;
        const tokenId = pickNext();
        if (preloadQueue.some((t) => t.tokenId === tokenId)) continue;
        const track = await resolveTrack(tokenId);
        if (!track) continue;
        await warmHttpCache(track.src);
        radioLog(`preloaded #${tokenId}`, { queue: preloadQueue.length + 1 }, tokenId);
        preloadQueue.push({ ...track, tokenId });
        // Stage the head of the queue in the element while idle so it decodes now.
        if (!on && preloadQueue.length === 1) {
          player.src = preloadQueue[0].src;
          try { player.load(); } catch { /* noop */ }
        }
      }
    } finally {
      preloading = false;
    }
  };

  // Crowd-warming: every visit asks the server to pre-reconstruct a couple of
  // random inscriptions into the R2 cache in the background (server-side only —
  // nothing downloads to this browser). Big films get warm before anyone tunes in.
  const pingWarm = (ids) => {
    radioLog('warm ping', ids || 'auto=2', ids);
    try { void fetch(ids ? `/warm?ids=${ids}` : '/warm?auto=2'); } catch { /* noop */ }
  };
  // Start warming a few seconds after init, off the critical page-load path.
  const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 2500));
  idle(() => { void preloadNextTrack(); pingWarm(); });

  // --- digital screen ticker ---------------------------------------------
  // While a song plays the screen cycles: NOW PLAYING info interleaved with a
  // varied pool of station idents, Xtrata facts and plugs — never the same two
  // fillers back to back, and the track info returns every other slot.
  // Self-paced ticker: each section holds, scrolls fully to its end so it can
  // be read in full, then advances. No fixed timers cutting text off.
  const HOLD_MS = 2400;        // pause before scrolling starts
  const HOLD_SHORT_MS = 5000;  // dwell time for text that fits without scrolling
  const END_HOLD_MS = 1800;    // pause at the end of a scrolled section
  const SCROLL_PX_PER_S = 26;  // reading-speed scroll
  const FILLERS = [
    'ALL MUSIC 100% ON-CHAIN',
    'NO SERVERS · NO STREAMS · JUST STACKS',
    'EVERY SONG IS AN INSCRIPTION',
    'ANCHORED TO BITCOIN VIA STACKS',
    'INSCRIBE YOUR OWN → /wizard',
    'SUNO TRACK? FAST-TRACK IT → /wizard/suno',
    'BUILD A GALLERY → /manifests',
    'FIND ARTISTS AT /g/name.btc',
    'RECORD IT · REFERENCE IT · RETRIEVE IT',
    'NO HOSTING BILLS. EVER.',
    'THIS RADIO HAS NO PLAYLIST SERVER',
    'PERMANENT MEDIA RECORDS SINCE BLOCK ONE',
    'YOU ARE LOCKED TO XTRATA FM',
    'TELL A FRIEND — IT LIVES ON-CHAIN',
    'OWN YOUR MASTERS. LITERALLY.',
    'FOREVER TWINS: NFTS MADE PERMANENT',
    'THE DIAL NEVER RUSTS',
    'BROADCASTING FROM THE BLOCKCHAIN',
    '96K OPUS · INSCRIBED FOREVER',
    'UPDATES? JUST INSCRIBE A NEW MANIFEST'
  ];
  let tickerSlot = 0;
  let currentTrackInfo = null;
  let lastFillers = [];

  const pickFiller = () => {
    const pool = FILLERS.filter((f) => !lastFillers.includes(f));
    const choice = pool[Math.floor(Math.random() * pool.length)];
    lastFillers.push(choice);
    if (lastFillers.length > 6) lastFillers.shift();
    return choice;
  };

  let sectionTimers = [];
  const clearSectionTimers = () => {
    sectionTimers.forEach((t) => window.clearTimeout(t));
    sectionTimers = [];
  };
  // One section at a time: it appears, holds so reading can start, then scrolls
  // at reading speed until it has left the screen COMPLETELY. Only then does
  // onDone fire and the next section appear from the right edge.
  const writeScreen = (text, onDone) => {
    if (!screenText) return;
    clearSectionTimers();
    screenText.classList.remove('is-scroll');
    screenText.style.removeProperty('--shift');
    screenText.style.removeProperty('--dur');
    screenText.textContent = text;
    if (!onDone) return; // status messages sit until replaced
    sectionTimers.push(window.setTimeout(() => {
      const distance = screenText.scrollWidth + 16; // fully offscreen left
      const seconds = Math.max(2.5, distance / SCROLL_PX_PER_S);
      screenText.style.setProperty('--shift', `-${distance}px`);
      screenText.style.setProperty('--dur', `${seconds}s`);
      screenText.classList.add('is-scroll');
      sectionTimers.push(window.setTimeout(onDone, seconds * 1000 + 250));
    }, HOLD_MS));
  };

  const tickerStep = () => {
    if (!currentTrackInfo) return;
    const { title, artist } = currentTrackInfo;
    // Sequential sections: TITLE -> ARTIST -> random info -> repeat.
    const phase = tickerSlot % 3;
    tickerSlot += 1;
    const text =
      phase === 0 ? `♪ ${title}`
      : phase === 1 ? (artist ? `BY ${artist.toUpperCase()}` : pickFiller())
      : pickFiller();
    writeScreen(text, tickerStep); // advance only once fully read
  };

  const startTicker = (track) => {
    currentTrackInfo = { title: track.title, artist: track.artist || '' };
    tickerSlot = 0;
    tickerStep();
  };

  const stopTicker = () => {
    clearSectionTimers();
    currentTrackInfo = null;
  };

  const setNow = (text, playing) => {
    if (text) writeScreen(text);
    else if (screenText && !currentTrackInfo) { screenText.textContent = ''; }
    root.classList.toggle('is-playing', Boolean(playing));
  };

  const history = [];
  const tuneToNextTrack = async (trackOverride) => {
    const token = ++tuneToken;
    manualPause = false;
    lastTuneAt = Date.now();
    stopTicker();
    setNow('~ TUNING ~', false);
    const startedTuning = performance.now();
    const tuningSeconds = playTuning(1, firstTune ? 'on' : 'between');
    firstTune = false;
    // Try a few candidates in case some inscriptions have no extractable audio.
    for (let attempt = 0; attempt < 10; attempt += 1) {
      let track;
      if (trackOverride) {
        track = trackOverride;
        trackOverride = null;
      } else if (preloadQueue.length) {
        track = preloadQueue.shift();    // cued ahead of time — instant
      } else {
        const tokenId = pickNext();
        track = await resolveTrack(tokenId);
      }
      // Keep the queue topped up in the background.
      window.setTimeout(() => { void preloadNextTrack(); }, 300);
      if (token !== tuneToken || !on) return;
      if (!track) continue;
      // Let the tuning sweep finish before the song lands — feels like a dial.
      const elapsed = (performance.now() - startedTuning) / 1000;
      if (elapsed < tuningSeconds) {
        await new Promise((resolve) => setTimeout(resolve, (tuningSeconds - elapsed) * 1000));
      }
      if (token !== tuneToken || !on) return;
      if (player.src !== track.src) {
        player.src = track.src;
      }
      radioLog(`play #${track.tokenId}`, { src: (track.src || '').slice(0, 80) }, track.tokenId);
      try {
        // Watchdog: a broken stream (e.g. bad 206 range responses on big
        // videos) can leave play() pending forever. If playback hasn't
        // actually started within 12s, give up on this track and retune.
        await Promise.race([
          player.play(),
          new Promise((_resolve, reject) => {
            const timer = window.setTimeout(() => {
              reject(new Error('stall-watchdog: no playback within 12s'));
            }, 12000);
            player.addEventListener('playing', () => window.clearTimeout(timer), { once: true });
          })
        ]);
        setNow('', true);
        startTicker(track);
        void fetchRelatives(track.tokenId);
        startVu();
        currentTokenId = track.tokenId || null;
        nowPlaying = { tokenId: track.tokenId, title: track.title, artist: track.artist || '', cover: track.cover || '', href: `/inscription/${track.tokenId}` };
        emit();
        persist();
        if (history[history.length - 1] !== track) history.push(track);
        if (history.length > 12) history.shift();
        markPlayed(track.tokenId);   // no-repeat: this song sits out until the cycle completes
        noSignalRetries = 0;
        window.setTimeout(() => { void preloadNextTrack(); }, 1500);
        return;
      } catch (error) {
        radioLog(`play FAILED #${track.tokenId}`, { error: String(error), mediaError: player.error && player.error.code, ready: player.readyState, net: player.networkState }, track.tokenId);
        try { player.pause(); player.removeAttribute('src'); player.load(); } catch { /* reset for next attempt */ }
        trackCache.delete(track.tokenId); // stalled stream: retry later, don't dud
        // Autoplay refusal, decode failure, or stall — try another station.
      }
    }
    if (token === tuneToken && on) {
      stopTicker();
      // SELF-HEALING: never park on a dead dial. Widen the pool (forget the
      // recent list), back off, and retune automatically while switched on.
      noSignalRetries += 1;
      recent = [];
      const delay = Math.min(30000, 5000 * noSignalRetries);
      setNow(`-- NO SIGNAL — RETUNING IN ${Math.round(delay / 1000)}S --`, false);
      radioLog('no signal — scheduling auto-retune', { retry: noSignalRetries, delayMs: delay });
      window.setTimeout(() => {
        if (on && token === tuneToken && player.paused && hadGesture) void tuneToNextTrack();
      }, delay);
    }
  };

  player.addEventListener('ended', () => {
    if (on) {
      void tuneToNextTrack();
    }
  });
  // Trace the media element's life for debugging (watched ids always log).
  ['loadstart', 'loadedmetadata', 'canplay', 'playing', 'waiting', 'stalled', 'suspend', 'abort', 'emptied'].forEach((name) => {
    player.addEventListener(name, () => {
      radioLog(`media:${name}`, { t: player.currentTime.toFixed(1), ready: player.readyState, net: player.networkState }, currentTokenId);
    });
  });

  player.addEventListener('error', () => {
    radioLog('player element error', { code: player.error && player.error.code, src: (player.currentSrc || '').slice(0, 80) }, currentTokenId);
    if (on) {
      void tuneToNextTrack();
    }
  });

  const switchOn = () => {
    on = true;
    if (volumeStep < 1) volumeStep = 8; // knob was clicked off — restore default
    applyVolume();
    renderKnob();
    toggleButton.setAttribute('aria-pressed', 'true');
    root.classList.add('is-on');
    void tuneToNextTrack();
  };

  const switchOff = () => {
    on = false;
    relatives = [];
    relativesFor = null;
    firstTune = true;
    tuneToken += 1;
    playTuning(-1, 'off');
    player.pause();
    player.removeAttribute('src');
    try { player.load(); } catch { /* noop */ }
    // Re-cue for the next switch-on.
    window.setTimeout(() => { void preloadNextTrack(); }, 1200);
    toggleButton.setAttribute('aria-pressed', 'false');
    root.classList.remove('is-on');
    renderKnob();
    stopTicker();
    setNow('', false);
    nowPlaying = null;
    persist();
    emit();
  };

  toggleButton.addEventListener('click', () => (on ? switchOff() : switchOn()));
  const skip = (direction) => {
    if (!on) return;
    player.pause();
    if (direction === 'prev' && history.length > 1) {
      history.pop(); // current
      void tuneToNextTrack(history.pop());
    } else if (direction === 'prev' && history.length === 1) {
      void tuneToNextTrack(history.pop()); // restart current
    } else {
      void tuneToNextTrack();
    }
  };
  transportButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      skip(button.dataset.dir);
    });
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        skip(button.dataset.dir);
      }
    });
  });

  // --- cross-page continuity ----------------------------------------------
  let currentTokenId = null;
  const persist = () => {
    saveState({
      on,
      volumeStep,
      tokenId: currentTokenId,
      position: Number.isFinite(player.currentTime) ? player.currentTime : 0,
      savedAt: Date.now()
    });
  };
  let lastPersist = 0;
  player.addEventListener('timeupdate', () => {
    const now = Date.now();
    if (now - lastPersist > 1500) { lastPersist = now; persist(); }
  });
  window.addEventListener('pagehide', persist);

  renderKnob();

  // Resume a previous session: same song, same position, no retune noise.
  const saved = loadState();
  if (saved && typeof saved.volumeStep === 'number') {
    volumeStep = Math.max(0, Math.min(10, saved.volumeStep));
    applyVolume();
    renderKnob();
  }
  if (saved && saved.on && saved.tokenId) {
    const resume = async () => {
      const track = await resolveTrack(String(saved.tokenId));
      if (!track) return;
      on = true;
      firstTune = false;
      toggleButton.setAttribute('aria-pressed', 'true');
      root.classList.add('is-on');
      applyVolume();
      renderKnob();
      player.src = track.src;
      const begin = () => {
        try { if (Number(saved.position) > 1 && player.currentTime < 1) player.currentTime = Number(saved.position); } catch { /* noop */ }
        currentTokenId = track.tokenId || null;
        setNow('', true);
        startTicker(track);
        void fetchRelatives(track.tokenId);
        startVu();
        if (history[history.length - 1] !== track) history.push(track);
        window.setTimeout(() => { void preloadNextTrack(); }, 2000);
        persist();
      };
      try { player.currentTime = Math.max(0, Number(saved.position) || 0); } catch { /* pre-metadata */ }
      try {
        await player.play();
        begin();
      } catch {
        writeScreen('▶ TAP ANYWHERE TO RESUME');
        const once = () => {
          document.removeEventListener('pointerdown', once, true);
          player.play().then(begin).catch(() => { writeScreen('▶ RADIO PAUSED — CLICK TO RETUNE'); });
        };
        document.addEventListener('pointerdown', once, true);
      }
    };
    void resume();
  }

  // Band/preset/shuffle/loop deliberately reset every visit — the heart
  // (your liked songs) is the only control that remembers.

  // Public API for the full-screen /radio page (and anything else).
  const api = {
    switchOn, switchOff,
    isOn: () => on,
    playPause: () => {
      if (!on) { switchOn(); }
      else if (player.paused) { manualPause = false; player.play().catch(() => { void tuneToNextTrack(); }); }
      else { manualPause = true; player.pause(); }
    },
    next: () => skip('next'),
    prev: () => skip('prev'),
    toggleLike,
    isLiked: () => (nowPlaying ? isLiked(nowPlaying.tokenId) : false),
    getLikes: () => likes.slice(),
    cycleBand, setBand, cyclePreset,
    setShuffle, toggleShuffle: () => setShuffle(!shuffleMode),
    setLoop, toggleLoop: () => setLoop(!player.loop),
    getState: () => stateSnapshot(),
    unlike: (id) => { likes = likes.filter((l) => l.tokenId !== String(id)); saveLikes(likes); emit(); },
    playToken: (id) => { forcedNext = String(id); if (!on) { switchOn(); } else { player.pause(); void tuneToNextTrack(); } },
    nudgeVolume,
    subscribe: (cb) => { listeners.add(cb); cb(stateSnapshot()); return () => listeners.delete(cb); }
  };
  // --- receiver faceplate wiring -----------------------------------------
  const UIMIN_KEY = 'xtrata.radio.ui.min';
  const displayEl = root.querySelector('.xtrata-radio__display');
  const faceBtn = (name) => root.querySelector('.xtrata-radio__btn--' + name);
  const setMin = (min) => {
    root.classList.toggle('is-min', Boolean(min));
    if (!dockHost) {
      try { window.localStorage.setItem(UIMIN_KEY, min ? '1' : '0'); } catch { /* noop */ }
    }
  };
  let startMin = true; // default: unobtrusive pill
  try { startMin = window.localStorage.getItem(UIMIN_KEY) !== '0'; } catch { /* keep default */ }
  setMin(dockHost ? true : startMin); // docked radio always rests as the header pill

  const onDisplayTap = () => {
    if (dockHost && !root.classList.contains('is-full')) {
      // Header pill tap = open the full receiver and get music going in one move.
      setFull(true);
      if (!on) switchOn();
      return;
    }
    if (root.classList.contains('is-min')) {
      setMin(false);
      if (!on) switchOn();   // one tap: open the receiver AND tune in
      return;
    }
    if (!on) switchOn();
  };
  displayEl.addEventListener('click', onDisplayTap);
  displayEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onDisplayTap(); }
  });
  root.querySelector('.xtrata-radio__mini').addEventListener('click', (event) => {
    event.stopPropagation();
    setMin(true);
  });

  faceBtn('play').addEventListener('click', (event) => { event.stopPropagation(); api.playPause(); });
  faceBtn('heart').addEventListener('click', (event) => { event.stopPropagation(); toggleLike(); });
  faceBtn('playlist').addEventListener('click', (event) => { event.stopPropagation(); setBand(band === 'liked' ? 'fm' : 'liked'); });
  faceBtn('shuffle').addEventListener('click', (event) => { event.stopPropagation(); setShuffle(!shuffleMode); });
  faceBtn('repeat').addEventListener('click', (event) => { event.stopPropagation(); setLoop(!player.loop); });

  // band / preset pots: discrete positions, click to cycle
  const bandCore = root.querySelector('.xtrata-radio__pot--band .xtrata-radio__potcore');
  const presetCore = root.querySelector('.xtrata-radio__pot--preset .xtrata-radio__potcore');
  const renderPots = () => {
    if (bandCore) bandCore.style.transform = 'rotate(' + ((BANDS.indexOf(band) - 1) * 45) + 'deg)';
    if (presetCore) presetCore.style.transform = 'rotate(' + (preset === 'music' ? 45 : -45) + 'deg)';
  };
  root.querySelector('.xtrata-radio__pot--band').addEventListener('click', (event) => { event.stopPropagation(); cycleBand(); });
  root.querySelector('.xtrata-radio__pot--preset').addEventListener('click', (event) => { event.stopPropagation(); cyclePreset(); });

  // artwork thumb: cover of the playing song, linking to the inscribed original
  const artEl = root.querySelector('.xtrata-radio__art');
  const artImg = artEl.querySelector('img');
  artEl.addEventListener('click', (event) => event.stopPropagation());
  const renderArt = (snap) => {
    const np = snap.nowPlaying;
    const cover = np && np.cover;
    if (cover) {
      if (artImg.getAttribute('src') !== cover) artImg.src = cover;
      artEl.href = '/i/' + np.tokenId;
      artEl.classList.add('has-art');
    } else {
      artEl.classList.remove('has-art');
      artImg.removeAttribute('src');
      artEl.removeAttribute('href');
    }
  };

  // engine state -> lit buttons / pot positions / playing class
  const renderFace = (snap) => {
    renderArt(snap);
    renderRelatives(snap);
    renderPctl(snap);
    faceBtn('heart').classList.toggle('is-lit', Boolean(snap.nowPlaying && isLiked(snap.nowPlaying.tokenId)));
    faceBtn('playlist').classList.toggle('is-lit', snap.band === 'liked');
    faceBtn('shuffle').classList.toggle('is-lit', Boolean(snap.shuffle));
    faceBtn('repeat').classList.toggle('is-lit', Boolean(snap.loop));
    root.classList.toggle('is-playing', Boolean(snap.playing));
    renderPots();
  };
  listeners.add(renderFace);
  renderFace(stateSnapshot());

  // relatives strip (fullscreen only, styled in CSS)
  const relRow = root.querySelector('.xtrata-radio__rel-row');
  const relWrap = root.querySelector('.xtrata-radio__rel');
  let relSignature = '';
  const renderRelatives = (snap) => {
    const rels = snap.relatives || [];
    const signature = rels.map((r) => r.id + r.kind + (r.playable ? '1' : '0')).join(',');
    if (signature === relSignature) return;
    relSignature = signature;
    relRow.textContent = '';
    relWrap.classList.toggle('has-rel', rels.length > 0);
    rels.forEach((rel) => {
      if (rel.playable) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'xtrata-radio__rtile is-song';
        b.title = 'Play inscription #' + rel.id;
        b.innerHTML = '<span>\u266a</span><i>#' + rel.id + '</i>';
        b.addEventListener('click', (event) => { event.stopPropagation(); api.playToken(rel.id); });
        relRow.appendChild(b);
      } else if (rel.kind === 'image') {
        const img = document.createElement('img');
        img.className = 'xtrata-radio__rtile is-static';
        img.loading = 'lazy';
        img.alt = '';
        img.title = 'Related inscription #' + rel.id;
        img.src = '/i/' + rel.id;
        img.addEventListener('error', () => img.remove());
        relRow.appendChild(img);
      } else {
        const t = document.createElement('span');
        t.className = 'xtrata-radio__rtile is-static is-doc';
        t.title = 'Related inscription #' + rel.id;
        t.innerHTML = '<span>\u25c7</span><i>#' + rel.id + '</i>';
        relRow.appendChild(t);
      }
    });
  };

  // pill quick controls: power / prev / play-pause / next without expanding
  const pctl = root.querySelector('.xtrata-radio__pctl');
  const ppBtn = pctl.querySelector('[data-p="pp"]');
  pctl.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    event.stopPropagation();
    if (btn.dataset.p === 'power') { on ? switchOff() : switchOn(); }
    else if (btn.dataset.p === 'prev') skip('prev');
    else if (btn.dataset.p === 'next') skip('next');
    else if (btn.dataset.p === 'pp') api.playPause();
  });
  const renderPctl = (snap) => {
    ppBtn.textContent = snap.playing ? '\u23f8' : '\u25b6';
    pctl.querySelector('[data-p="power"]').classList.toggle('is-lit', Boolean(snap.on));
  };

  // --- fullscreen mode ----------------------------------------------------
  // Click the XTRATA FM logo (or the docked header pill) to fill the screen;
  // Esc, ✕, or the logo again exits. Pure CSS state on the same element, so
  // playback is never interrupted entering or leaving fullscreen.
  const brandEl = root.querySelector('.xtrata-radio__brand');
  const setFull = (full) => {
    const want = Boolean(full);
    if (want && root.classList.contains('is-min')) setMin(false);
    root.classList.toggle('is-full', want);
    if (!want && dockHost) setMin(true); // docked radio returns to the header pill
  };
  const toggleFull = () => setFull(!root.classList.contains('is-full'));
  brandEl.title = 'Click to toggle fullscreen radio';
  brandEl.addEventListener('click', (event) => { event.stopPropagation(); toggleFull(); });
  root.querySelector('.xtrata-radio__fs-close').addEventListener('click', (event) => {
    event.stopPropagation();
    setFull(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('is-full')) setFull(false);
  });
  api.setFullscreen = setFull;
  api.toggleFullscreen = toggleFull;
  api.isFullscreen = () => root.classList.contains('is-full');

  // Deep link for listeners: /?radio=fullscreen (also full/fs/1/on) opens the
  // page with the receiver already fullscreen. Autoplay needs a gesture, so a
  // fresh session shows a tap-to-start prompt; a resumed session just plays.
  try {
    const wantRadio = (new URLSearchParams(window.location.search).get('radio') || '').toLowerCase();
    if (['fullscreen', 'full', 'fs', '1', 'on'].includes(wantRadio)) {
      setFull(true);
      if (!(saved && saved.on && saved.tokenId)) {
        writeScreen('▶ TAP ANYWHERE TO START THE RADIO');
        const onceStart = () => {
          document.removeEventListener('pointerdown', onceStart, true);
          if (!on) switchOn();
        };
        document.addEventListener('pointerdown', onceStart, true);
      }
    }
  } catch { /* noop */ }

  // --- attract mode: while off, invite the tap ----------------------------
  // First-ever visitors get the full treatment (pulsing display + cycling
  // messages); anyone who has tuned in before gets a calm single invitation.
  const EVER_ON_KEY = 'xtrata.radio.everon';
  const everOn = () => { try { return window.localStorage.getItem(EVER_ON_KEY) === '1'; } catch { return false; } };
  const ATTRACT_MESSAGES = [
    '\u25b6 TAP TO TUNE IN',
    '\u266a MUSIC LIVE FROM THE CHAIN',
    'EVERY SONG INSCRIBED FOREVER',
    '100% ON-CHAIN RADIO'
  ];
  let attractSlot = 0;
  const attractTick = () => {
    if (on || !screenText) return;        // engine owns the screen while on
    if (!everOn()) {
      screenText.textContent = ATTRACT_MESSAGES[attractSlot % ATTRACT_MESSAGES.length];
      attractSlot += 1;
    } else if (!screenText.textContent) {
      screenText.textContent = '\u25b6 TAP TO TUNE IN';
    }
  };
  const applyAttract = () => {
    const off = !on;
    root.classList.toggle('is-attract', off);
    root.classList.toggle('is-attract--strong', off && !everOn());
    if (off) attractTick();
  };
  window.setInterval(() => { if (!on) attractTick(); }, 3600);
  listeners.add((snap) => {
    if (snap.on) { try { window.localStorage.setItem(EVER_ON_KEY, '1'); } catch { /* noop */ } }
    applyAttract();
  });
  applyAttract();

  window.XtrataRadio = api;
  return api;
};
