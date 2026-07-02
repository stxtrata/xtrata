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
    '    <span class="xtrata-radio__dial">',
    '      <span class="xtrata-radio__scale">88&ensp;92&ensp;96&ensp;100&ensp;104&ensp;108</span>',
    '      <span class="xtrata-radio__needle"></span>',
    '    </span>',
    '    <span class="xtrata-radio__brand">XTRATA&nbsp;FM</span>',
    '  </span>',
    '  <span class="xtrata-radio__knob" aria-hidden="true"><i></i></span>',
    '</button>',
    '<span class="xtrata-radio__now" hidden></span>',
    '<button class="xtrata-radio__next" type="button" title="Next song" hidden>⏭</button>'
  ].join('');
  document.body.appendChild(root);

  const toggleButton = root.querySelector('.xtrata-radio__toggle');
  const nowLabel = root.querySelector('.xtrata-radio__now');
  const nextButton = root.querySelector('.xtrata-radio__next');

  // --- audio plumbing ---------------------------------------------------
  const player = new Audio();
  player.preload = 'auto';
  player.volume = 0.9;

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
          resolved = {
            src: match[1].replace(/&amp;/g, '&'),
            title: (titleMatch ? titleMatch[1].trim() : '') || `#${tokenId}`
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

  const setNow = (text, playing) => {
    nowLabel.textContent = text;
    nowLabel.hidden = !text;
    nextButton.hidden = !on;
    root.classList.toggle('is-playing', Boolean(playing));
  };

  const tuneToNextTrack = async () => {
    const token = ++tuneToken;
    setNow('tuning…', false);
    const startedTuning = performance.now();
    const tuningSeconds = playTuning(1, firstTune ? 'on' : 'between');
    firstTune = false;
    // Try a few candidates in case some inscriptions have no extractable audio.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const tokenId = pickNext();
      const track = await resolveTrack(tokenId);
      if (token !== tuneToken || !on) return;
      if (!track) continue;
      // Let the tuning sweep finish before the song lands — feels like a dial.
      const elapsed = (performance.now() - startedTuning) / 1000;
      if (elapsed < tuningSeconds) {
        await new Promise((resolve) => setTimeout(resolve, (tuningSeconds - elapsed) * 1000));
      }
      if (token !== tuneToken || !on) return;
      player.src = track.src;
      try {
        await player.play();
        setNow(`♪ ${track.title}`, true);
        return;
      } catch {
        // Autoplay refusal or decode failure — try another station.
      }
    }
    if (token === tuneToken && on) {
      setNow('no signal — try again', false);
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
    toggleButton.setAttribute('aria-pressed', 'false');
    root.classList.remove('is-on');
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

  return { switchOn, switchOff };
};
