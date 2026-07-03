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
const loadState = () => {
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') || {}; }
  catch { return {}; }
};
const saveState = (state) => {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
};

export const initXtrataRadio = ({ tokenIds = [], stationName = 'XTRATA FM' } = {}) => {
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
    '<button class="xtrata-radio__set xtrata-radio__toggle" type="button" aria-pressed="false" title="Xtrata Radio — random inscribed songs">',
    '  <span class="xtrata-radio__grille" aria-hidden="true"></span>',
    '  <span class="xtrata-radio__face" aria-hidden="true">',
    '    <span class="xtrata-radio__screen">',
    '      <span class="xtrata-radio__screen-text"></span>',
    '    </span>',
    '    <span class="xtrata-radio__meta">',
    '      <span class="xtrata-radio__brandwrap"><img class="xtrata-radio__logo" src="/favicon.svg" alt="" /><span class="xtrata-radio__brand">XTRATA&nbsp;FM</span></span>',
    '      <span class="xtrata-radio__vu"><i></i><i></i><i></i><i></i><i></i><i></i></span>',
    '    </span>',
    '  </span>',
    '  <span class="xtrata-radio__side">',
    '    <span class="xtrata-radio__knob" role="slider" aria-label="Volume" aria-valuemin="-1" aria-valuemax="10" title="Volume — scroll or drag; below 0 clicks off"><i></i></span>',
    '    <span class="xtrata-radio__transport">',
    '      <span class="xtrata-radio__tbtn" role="button" tabindex="0" data-dir="prev" title="Previous song">⏮</span>',
    '      <span class="xtrata-radio__tbtn" role="button" tabindex="0" data-dir="next" title="Next song">⏭</span>',
    '    </span>',
    '  </span>',
    '</button>'
  ].join('');
  document.body.appendChild(root);

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
    const totalEnergy = bins.reduce((sum, v) => sum + v, 0);
    if (totalEnergy > 40) {
      silentSince = 0;
    } else if (player.currentTime > 0.5) {
      if (!silentSince) silentSince = performance.now();
      else if (performance.now() - silentSince > 8000 && on) {
        radioLog(`silent track detected #${currentTokenId}`, 'no audio signal for 8s — skipping and marking dud', currentTokenId);
        if (currentTokenId) trackCache.set(String(currentTokenId), null);
        silentSince = 0;
        player.pause();
        void tuneToNextTrack();
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
  const trackCache = new Map(); // tokenId -> { src, title } | null
  const resolveTrack = async (tokenId) => {
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
        if (!attempt.ok) definitive = false; // transient — retry later
        try { await attempt.body?.cancel(); } catch { /* noop */ }
      }
      if (!response) {
        radioLog(`verdict #${tokenId}`, definitive ? 'DUD (no playable content on any core)' : 'TRANSIENT (will retry; warm requested)', tokenId);
        if (definitive) trackCache.set(tokenId, null); else trackCache.delete(tokenId);
        return null;
      }
      if (response.ok && (mime.startsWith('audio/') || mime.startsWith('video/'))) {
        // Plain audio inscriptions AND movies: the Audio element happily plays
        // the soundtrack of video containers (webm/mp4), so films join the
        // station as audio-only broadcasts.
        await response.body?.cancel?.();
        resolved = { src, title: `#${tokenId}${mime.startsWith('video/') ? ' (film audio)' : ''}`, tokenId };
      } else if (response.ok && mime.includes('text/html')) {
        const html = await response.text();
        // Opus players embed their audio as a data: URI on a <source> element.
        // Opus players embed data:audio; some players/films embed data:video —
        // both are playable through the audio element.
        const match = html.match(/<source[^>]+src="(data:(?:audio|video)\/[^"]+)"/i);
        if (match) {
          const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
          const artistMatch = html.match(/"artist":\s*"([^"]*)"/);
          resolved = {
            src: match[1].replace(/&amp;/g, '&'),
            title: (titleMatch ? titleMatch[1].trim() : '') || `#${tokenId}`,
            artist: artistMatch ? artistMatch[1].trim() : '',
            tokenId
          };
        }
      } else {
        await response.body?.cancel?.();
      }
    } catch {
      resolved = null;
      definitive = false;
    }
    radioLog(`verdict #${tokenId}`, resolved ? { playable: true, src: resolved.src.slice(0, 80), title: resolved.title } : (definitive ? 'DUD' : 'TRANSIENT'), tokenId);
    if (resolved || definitive) {
      trackCache.set(tokenId, resolved);
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

  // --- station logic -----------------------------------------------------
  // The curated ids are seeds; the station also explores the ENTIRE contract.
  // resolveTrack() is the gatekeeper: anything without playable audio returns
  // null and is skipped (cached), so the dial only ever lands on real music.
  // Known-good tracks outside the curated gallery (early-era opus/mp3s that
  // live on legacy cores) join the seed rotation so they play regularly rather
  // than waiting on a lucky random pick.
  const EXTRA_SEEDS = ['8', '1636', '1122'];
  const playlist = [...new Set([...tokenIds.map((id) => id.toString()), ...EXTRA_SEEDS])];
  let maxTokenId = 0;
  const EXPLORE_RATIO = 0.5; // half the picks roam the full id range

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
        if (Number.isFinite(value) && value > 0) maxTokenId = value;
      }
    } catch { /* stay curated-only */ }
  };
  void discoverRange();
  let on = false;
  let tuneToken = 0;
  let recent = [];
  let firstTune = true;

  const pickNext = () => {
    let choice;
    // Explore the whole chain when we know its size; skip ids already known
    // to be unplayable (cached as null in trackCache).
    if (maxTokenId > 0 && Math.random() < EXPLORE_RATIO) {
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const candidate = String(1 + Math.floor(Math.random() * maxTokenId));
        if (recent.includes(candidate)) continue;
        if (trackCache.get(candidate) === null) continue; // known dud
        choice = candidate;
        break;
      }
    }
    if (!choice) {
      const candidates = playlist.filter((id) => !recent.includes(id));
      const pool = candidates.length ? candidates : playlist;
      choice = pool[Math.floor(Math.random() * pool.length)];
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
    'INSCRIBE YOUR OWN → /agent-one',
    'SUNO TRACK? FAST-TRACK IT → /agent-one/suno',
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
        startVu();
        currentTokenId = track.tokenId || null;
        persist();
        if (history[history.length - 1] !== track) history.push(track);
        if (history.length > 12) history.shift();
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
      setNow('-- NO SIGNAL — TRY AGAIN --', false);
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
    persist();
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

  return { switchOn, switchOff };
};
