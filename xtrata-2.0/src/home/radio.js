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
    '<button class="xtrata-radio__toggle" type="button" aria-pressed="false" title="Xtrata Radio — random inscribed songs">',
    '  <span class="xtrata-radio__icon" aria-hidden="true">📻</span>',
    '  <span class="xtrata-radio__label">Radio</span>',
    '  <span class="xtrata-radio__wave" aria-hidden="true"><i></i><i></i><i></i></span>',
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

  // Radio tuning sound: filtered static with a frequency sweep + a soft click.
  const playTuning = (direction = 1) => {
    const context = getContext();
    if (!context) return 0;
    const duration = 0.55;
    const now = context.currentTime;

    const noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const channel = noiseBuffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * 0.6;
    }
    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = context.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.value = 9;
    const startHz = direction > 0 ? 500 : 3400;
    const endHz = direction > 0 ? 3400 : 500;
    bandpass.frequency.setValueAtTime(startHz, now);
    bandpass.frequency.exponentialRampToValueAtTime(endHz, now + duration * 0.9);

    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // A couple of "passing stations" blips inside the sweep.
    const blip = context.createOscillator();
    blip.type = 'sine';
    blip.frequency.setValueAtTime(direction > 0 ? 640 : 980, now + 0.12);
    blip.frequency.setValueAtTime(direction > 0 ? 880 : 720, now + 0.3);
    const blipGain = context.createGain();
    blipGain.gain.setValueAtTime(0.0001, now);
    blipGain.gain.exponentialRampToValueAtTime(0.05, now + 0.14);
    blipGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    noise.connect(bandpass).connect(gain).connect(context.destination);
    blip.connect(blipGain).connect(context.destination);
    noise.start(now);
    noise.stop(now + duration);
    blip.start(now + 0.1);
    blip.stop(now + 0.45);
    return duration;
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
    const tuningSeconds = playTuning(1);
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
    tuneToken += 1;
    playTuning(-1);
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
