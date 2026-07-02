// Xtrata Radio — a little embedded radio station for the homepage soundtrack.
// Toggling on makes a radio-tuning noise (WebAudio, no assets) and then plays a
// random rotation of inscribed songs. Tracks are ordinary inscriptions: raw
// audio ones play directly from /inscription/<id>; HTML player inscriptions
// (the Opus players) are fetched and their embedded data:audio source is
// extracted and played, so the station works across formats.

export const initXtrataRadio = ({ tokenIds = [], stationName = 'XTRATA FM' } = {}) => {
  if (!tokenIds.length || typeof document === 'undefined') {
    return null;
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
    '  <span class="xtrata-radio__knob" role="slider" aria-label="Volume" aria-valuemin="-1" aria-valuemax="10" title="Volume — scroll or drag; below 0 clicks off"><i></i></span>',
    '</button>',
    '<span class="xtrata-radio__now xtrata-radio__analog" hidden>',
    '  <span class="xtrata-radio__scale">88&ensp;92&ensp;96&ensp;100&ensp;104&ensp;108</span>',
    '  <span class="xtrata-radio__needle"></span>',
    '</span>',
    '<button class="xtrata-radio__next" type="button" title="Next song" hidden>⏭</button>'
  ].join('');
  document.body.appendChild(root);

  const toggleButton = root.querySelector('.xtrata-radio__toggle');
  const nowLabel = root.querySelector('.xtrata-radio__now');
  const screenText = root.querySelector('.xtrata-radio__screen-text');
  const nextButton = root.querySelector('.xtrata-radio__next');
  const knob = root.querySelector('.xtrata-radio__knob');

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
    let resolved = null;
    try {
      const response = await fetch(`/inscription/${tokenId}`);
      const mime = (response.headers.get('content-type') || '').toLowerCase();
      if (response.ok && mime.startsWith('audio/')) {
        await response.body?.cancel?.();
        resolved = { src: `/inscription/${tokenId}`, title: `#${tokenId}` };
      } else if (response.ok && mime.includes('text/html')) {
        const html = await response.text();
        // Opus players embed their audio as a data: URI on a <source> element.
        const match = html.match(/<source[^>]+src="(data:audio\/[^"]+)"/i);
        if (match) {
          const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
          const artistMatch = html.match(/"artist":\s*"([^"]*)"/);
          resolved = {
            src: match[1].replace(/&amp;/g, '&'),
            title: (titleMatch ? titleMatch[1].trim() : '') || `#${tokenId}`,
            artist: artistMatch ? artistMatch[1].trim() : ''
          };
        }
      } else {
        await response.body?.cancel?.();
      }
    } catch {
      resolved = null;
    }
    trackCache.set(tokenId, resolved);
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
  const playlist = tokenIds.map((id) => id.toString());
  let on = false;
  let tuneToken = 0;
  let recent = [];
  let firstTune = true;

  const pickNext = () => {
    const candidates = playlist.filter((id) => !recent.includes(id));
    const pool = candidates.length ? candidates : playlist;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    recent.push(choice);
    if (recent.length > Math.min(4, playlist.length - 1)) {
      recent.shift();
    }
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

  const warmHttpCache = async (src) => {
    if (src.startsWith('data:')) return; // already in memory
    try { await (await fetch(src)).arrayBuffer(); } catch { /* best-effort */ }
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

  // Start warming a few seconds after init, off the critical page-load path.
  const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 2500));
  idle(() => { void preloadNextTrack(); });

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
  // Shows one section; calls onDone only after the text has been fully readable:
  // fits → dwell; overflows → hold, scroll to the very end, hold, done.
  const writeScreen = (text, onDone) => {
    if (!screenText) return;
    clearSectionTimers();
    screenText.classList.remove('is-scroll');
    screenText.style.removeProperty('--shift');
    screenText.style.removeProperty('--dur');
    screenText.textContent = text;
    const screen = screenText.parentElement;
    const overflow = screen ? screenText.scrollWidth - screen.clientWidth : 0;
    if (overflow > 4) {
      sectionTimers.push(window.setTimeout(() => {
        const seconds = Math.max(2, (overflow + 8) / SCROLL_PX_PER_S);
        screenText.style.setProperty('--shift', `-${overflow + 8}px`);
        screenText.style.setProperty('--dur', `${seconds}s`);
        screenText.classList.add('is-scroll');
        sectionTimers.push(window.setTimeout(() => {
          if (onDone) onDone();
        }, seconds * 1000 + END_HOLD_MS));
      }, HOLD_MS));
    } else if (onDone) {
      sectionTimers.push(window.setTimeout(onDone, HOLD_SHORT_MS));
    }
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
    nowLabel.hidden = !on;
    nextButton.hidden = !on;
    root.classList.toggle('is-playing', Boolean(playing));
  };

  const tuneToNextTrack = async () => {
    const token = ++tuneToken;
    stopTicker();
    setNow('~ TUNING ~', false);
    const startedTuning = performance.now();
    const tuningSeconds = playTuning(1, firstTune ? 'on' : 'between');
    firstTune = false;
    // Try a few candidates in case some inscriptions have no extractable audio.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      let track;
      if (preloadQueue.length) {
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
      try {
        await player.play();
        setNow('', true);
        startTicker(track);
        startVu();
        window.setTimeout(() => { void preloadNextTrack(); }, 1500);
        return;
      } catch {
        // Autoplay refusal or decode failure — try another station.
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
  player.addEventListener('error', () => {
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
    nextButton.hidden = true;
  };

  toggleButton.addEventListener('click', () => (on ? switchOff() : switchOn()));
  nextButton.addEventListener('click', () => {
    if (on) {
      player.pause();
      void tuneToNextTrack();
    }
  });

  renderKnob();

  return { switchOn, switchOff };
};
