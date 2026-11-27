// Standalone Xtrata Music player. No runtime network, fonts or third-party code.
(function () {
  'use strict';
  const VERSION = 'xtrata-music-player-v1';
  // A player that uses any extra below is marked v2. One that uses none is byte-for-byte a v1 player.
  const VERSION2 = 'xtrata-music-player-v2';
  const palettes = {
    charcoal: { page: '#151918', ink: '#f4f3ed', muted: '#b9c3bd', accent: '#c7e6a2' },
    paper: { page: '#f4efe5', ink: '#242820', muted: '#585d52', accent: '#385e46' },
    midnight: { page: '#101c2c', ink: '#edf3fa', muted: '#b0c3d7', accent: '#a9cfff' },
    monochrome: { page: '#151515', ink: '#ffffff', muted: '#bbbbbb', accent: '#ffffff' }
  };
  const choices = {
    style: ['classic', 'sleeve', 'studio', 'vinyl', 'poster'],
    // 'cover' uses colours picked from the artwork when the player is built (appearance.coverColors).
    palette: [...Object.keys(palettes), 'cover'],
    font: ['sans', 'serif', 'mono', 'rounded'],
    artFit: ['contain', 'cover'],
    position: ['center', 'top', 'bottom', 'left', 'right'],
    corners: ['soft', 'square'],
    timeline: ['progress', 'waveform'],
    placeholder: ['gradient', 'plain', 'initials']
  };
  const defaults = {
    style: 'classic',
    palette: 'charcoal',
    font: 'sans',
    artFit: 'contain',
    position: 'center',
    corners: 'soft',
    timeline: 'progress',
    placeholder: 'gradient',
    accent: '',
    showAlbum: true,
    showLyrics: true,
    showCredits: true
  };
  // Player extras (v2). Every one is off by default.
  const extraChoices = {
    backdrop: ['solid', 'blur', 'grain', 'paper', 'scanlines'],
    waveStyle: ['bars', 'mirror', 'line', 'dots', 'needles', 'blocks'],
    // Where the timeline (waveform or progress bar) sits, and how tall it is.
    wavePos: ['inline', 'below', 'edge', 'cover'],
    waveSize: ['regular', 'slim', 'tall'],
    visualiser: ['off', 'bars', 'ring'],
    vizPos: ['cover', 'edge'],
    align: ['left', 'center'],
    titleSize: ['regular', 'large'],
    motion: ['still', 'zoom', 'breathe', 'tilt'],
    lyricsView: ['panel', 'overlay'],
    button: ['circle', 'square', 'pill']
  };
  const extraDefaults = {
    backdrop: 'solid',
    waveStyle: 'bars',
    wavePos: 'inline',
    waveSize: 'regular',
    visualiser: 'off',
    vizPos: 'cover',
    align: 'left',
    titleSize: 'regular',
    motion: 'still',
    lyricsView: 'panel',
    button: 'circle',
    fullArt: false,
    repeat: false,
    artWhilePlaying: false,
    stamp: false,
    artGlow: false,
    waveColor: '',
    waveBase: '',
    vizColor: '',
    note: '',
    signature: '',
    cues: [],
    coverColors: null
  };
  const HEX = /^#[0-9a-f]{6}$/i;
  const cleanText = (v, max) =>
    (typeof v === 'string' ? v : '')
      .replace(/[\u0000-\u001f\u007f]+/g, ' ')
      .trim()
      .slice(0, max);
  const normalize = (input = {}) => {
    input = input && typeof input === 'object' ? input : {};
    const result = { ...defaults };
    for (const key of Object.keys(choices))
      if (choices[key].includes(input[key])) result[key] = input[key];
    if (/^#[0-9a-f]{6}$/i.test(input.accent || '')) result.accent = input.accent.toLowerCase();
    for (const key of ['showAlbum', 'showLyrics', 'showCredits'])
      if (typeof input[key] === 'boolean') result[key] = input[key];
    for (const key of Object.keys(extraChoices))
      result[key] = extraChoices[key].includes(input[key]) ? input[key] : extraDefaults[key];
    for (const key of ['fullArt', 'repeat', 'artWhilePlaying', 'stamp', 'artGlow'])
      result[key] = input[key] === true;
    for (const key of ['waveColor', 'waveBase', 'vizColor'])
      result[key] = HEX.test(input[key] || '') ? input[key].toLowerCase() : '';
    result.note = cleanText(input.note, 200);
    result.signature = cleanText(input.signature, 60);
    result.cues = (Array.isArray(input.cues) ? input.cues : [])
      .map((c) => ({
        t: Math.round(Number(c && c.t) * 10) / 10,
        label: cleanText(c && c.label, 24)
      }))
      .filter((c) => Number.isFinite(c.t) && c.t >= 0 && c.t < 86400 && c.label)
      .sort((x, y) => x.t - y.t)
      .slice(0, 12);
    const cc = input.coverColors;
    result.coverColors =
      cc && typeof cc === 'object' && ['page', 'ink', 'muted', 'accent'].every((k) => HEX.test(cc[k] || ''))
        ? {
            page: cc.page.toLowerCase(),
            ink: cc.ink.toLowerCase(),
            muted: cc.muted.toLowerCase(),
            accent: cc.accent.toLowerCase()
          }
        : null;
    return result;
  };
  // What is stored with a player: the v1 keys always, an extra only when it is switched on.
  const compact = (input) => {
    const a = normalize(input),
      out = {};
    for (const key of Object.keys(defaults)) out[key] = a[key];
    for (const key of Object.keys(extraDefaults)) {
      if (key === 'coverColors' && a.palette !== 'cover') continue;
      if (key === 'waveStyle' && a.timeline !== 'waveform') continue;
      if ((key === 'vizPos' || key === 'vizColor') && a.visualiser === 'off') continue;
      if (JSON.stringify(a[key]) !== JSON.stringify(extraDefaults[key])) out[key] = a[key];
    }
    return out;
  };
  // Timed lyrics in LRC form ("[01:02.50] a line"). Two or more timed lines make them synced.
  const STAMP = /\[(\d{1,3}):(\d{1,2}(?:[.:]\d{1,3})?)\]/g;
  const syncedLines = (text) => {
    const out = [];
    for (const line of String(text || '').split(/\r?\n/)) {
      const stamps = [...line.matchAll(STAMP)];
      if (!stamps.length) continue;
      const words = line.replace(STAMP, '').trim();
      for (const s of stamps)
        out.push({ t: Math.round((Number(s[1]) * 60 + Number(s[2].replace(':', '.'))) * 100) / 100, text: words });
    }
    return out.length >= 2 ? out.sort((x, y) => x.t - y.t) : [];
  };
  const isV2 = (a, synced) =>
    synced ||
    a.style === 'vinyl' ||
    a.style === 'poster' ||
    a.palette === 'cover' ||
    a.font === 'rounded' ||
    Object.keys(compact(a)).length > Object.keys(defaults).length;
  const versionFor = (appearance, lyrics) => {
    const a = normalize(appearance);
    return isV2(a, a.showLyrics && syncedLines(lyrics).length > 0) ? VERSION2 : VERSION;
  };
  const esc = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  const json = (v) =>
    JSON.stringify(v).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
  const luminance = (hex) => {
    const rgb = hex
      .slice(1)
      .match(/../g)
      .map((c) => parseInt(c, 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const contrastInk = (hex) => (luminance(hex) > 0.179 ? '#000000' : '#ffffff');
  // One decode, on the creator's device, gives both the waveform and the loudness track that drives
  // the visualiser. Listeners never decode or analyse anything: the player only reads these numbers
  // against audio.currentTime, so linked audio, the radio and iPhones play exactly as before.
  const ENV = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const ENV_RATE = 10; // loudness values per second, one character each
  const peakCache = new WeakMap();
  function prepareAnalysis(ex) {
    if (peakCache.has(ex)) return peakCache.get(ex);
    const empty = { peaks: [], envelope: '', duration: 0 };
    const pending = (async () => {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return empty;
      let context, timer;
      try {
        context = new Context();
        const bytes = ex.audioBytes
          ? new Uint8Array(ex.audioBytes).buffer
          : Uint8Array.from(atob(ex.audioB64), (c) => c.charCodeAt(0)).buffer;
        const decoded = await Promise.race([
          context.decodeAudioData(bytes),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('Waveform timeout')), 12000);
          })
        ]);
        const peaks = Array(160).fill(0);
        for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
          const samples = decoded.getChannelData(channel);
          for (let i = 0; i < peaks.length; i++) {
            const start = Math.floor((i * samples.length) / peaks.length);
            const end = Math.floor(((i + 1) * samples.length) / peaks.length);
            for (let j = start; j < end; j++) peaks[i] = Math.max(peaks[i], Math.abs(samples[j]));
          }
        }
        const max = Math.max(...peaks, 0.001);
        const step = Math.max(1, Math.round(decoded.sampleRate / ENV_RATE)),
          frames = Math.min(36000, Math.ceil(decoded.length / step)),
          rms = new Float32Array(frames);
        for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
          const samples = decoded.getChannelData(channel);
          for (let f = 0; f < frames; f++) {
            let sum = 0;
            const end = Math.min(samples.length, (f + 1) * step);
            for (let j = f * step; j < end; j++) sum += samples[j] * samples[j];
            rms[f] += sum / step;
          }
        }
        const levels = Array.from(rms, (v) => Math.sqrt(v / decoded.numberOfChannels));
        const sorted = [...levels].sort((x, y) => x - y);
        const ref = sorted[Math.floor(sorted.length * 0.98)] || sorted[sorted.length - 1] || 1e-4;
        const envelope = levels
          .map((v) => ENV[Math.round(Math.min(1, v / Math.max(ref, 1e-4)) ** 0.8 * 63)])
          .join('');
        return {
          peaks: peaks.map((v) => Math.round((v / max) * 100)),
          envelope,
          duration: decoded.duration
        };
      } catch {
        return empty;
      } finally {
        clearTimeout(timer);
        if (context) await context.close().catch(() => {});
      }
    })();
    peakCache.set(ex, pending);
    return pending;
  }
  const preparePeaks = (ex) => prepareAnalysis(ex).then((r) => r.peaks);
  // Colours picked from the cover on the creator's device: a dark page in the cover's own hue and its
  // strongest bright colour as the accent. Contrast is fixed by lightness, whatever the cover.
  function hsl(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);
    const mx = Math.max(r, g, b),
      mn = Math.min(r, g, b),
      l = (mx + mn) / 2,
      d = mx - mn;
    if (!d) return [0, 0, l];
    const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s, l];
  }
  function hex(h, s, l) {
    const k = (n) => (n + h / 30) % 12,
      a = s * Math.min(l, 1 - l),
      f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return '#' + [0, 8, 4].map((n) => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('');
  }
  async function coverColors(src) {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 40;
    const g = canvas.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, 40, 40);
    const data = g.getImageData(0, 0, 40, 40).data;
    let x = 0,
      y = 0,
      sat = 0,
      n = 0;
    const bins = new Map();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      const [h, s, l] = hsl(data[i], data[i + 1], data[i + 2]);
      x += Math.cos((h * Math.PI) / 180) * s;
      y += Math.sin((h * Math.PI) / 180) * s;
      sat += s;
      n++;
      if (s > 0.2 && l > 0.2 && l < 0.88) {
        const key = Math.round(h / 15) % 24,
          bin = bins.get(key) || { score: 0, h: 0, s: 0, l: 0, n: 0 };
        bin.score += s * (1 - Math.abs(l - 0.58));
        bin.h += h;
        bin.s += s;
        bin.l += l;
        bin.n++;
        bins.set(key, bin);
      }
    }
    if (!n) return null;
    const avgHue = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360,
      avgSat = Math.min(0.42, sat / n);
    const best = [...bins.values()].sort((p, q) => q.score - p.score)[0];
    const accent = best
      ? hex(best.h / best.n, Math.max(0.45, best.s / best.n), Math.min(0.8, Math.max(0.64, best.l / best.n)))
      : hex(avgHue, 0.4, 0.74);
    return {
      page: hex(avgHue, avgSat, 0.1),
      ink: hex(avgHue, 0.18, 0.95),
      muted: hex(avgHue, 0.14, 0.74),
      accent
    };
  }
  // This function is embedded into the inscription, and must have no outer dependencies.
  function runtime() {
    const $ = (id) => document.getElementById(id),
      audio = $('xtrataAudio'),
      play = $('playToggleButton'),
      seek = $('seekRange'),
      status = $('playerStatus');
    const manifest = JSON.parse($('xtrataPlayerManifest').textContent);
    const fmt = (s) =>
      Number.isFinite(s)
        ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0')
        : '0:00';
    const report = (message) => {
      status.textContent = message;
    };
    const start = () => {
      report('Starting audio…');
      audio.play().catch((error) => {
        if (error.name === 'AbortError' && audio.paused) return;
        report('Could not play audio. Try Play again.');
      });
    };
    const pause = () => audio.pause();
    const toggle = () => (audio.paused ? start() : pause());
    const update = () => {
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const pct = duration ? (audio.currentTime / duration) * 100 : 0;
      seek.value = String(pct * 10);
      seek.disabled = !duration;
      seek.setAttribute('aria-valuetext', fmt(audio.currentTime) + ' of ' + fmt(duration));
      $('currentTime').textContent = fmt(audio.currentTime);
      $('durationTime').textContent = fmt(duration);
      $('timeline').style.setProperty('--played', pct + '%');
      play.textContent = audio.paused ? '▶' : 'Ⅱ';
      play.setAttribute('aria-label', audio.paused ? 'Play' : 'Pause');
      $('muteButton').textContent = audio.muted ? 'Unmute' : 'Mute';
      $('muteButton').setAttribute('aria-pressed', String(audio.muted));
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = audio.paused ? 'paused' : 'playing';
        if (duration && navigator.mediaSession.setPositionState) {
          try {
            navigator.mediaSession.setPositionState({
              duration,
              playbackRate: audio.playbackRate,
              position: Math.min(audio.currentTime, duration)
            });
          } catch {}
        }
      }
    };
    play.addEventListener('click', toggle);
    $('restartButton').addEventListener('click', () => {
      audio.currentTime = 0;
      update();
    });
    $('muteButton').addEventListener('click', () => {
      audio.muted = !audio.muted;
      update();
    });
    seek.addEventListener('input', () => {
      if (Number.isFinite(audio.duration))
        audio.currentTime = (audio.duration * Number(seek.value)) / 1000;
      update();
    });
    // Native button/range keyboard behaviour is preserved. Only the focused player surface uses shortcuts.
    $('xtrataPlayer').addEventListener('keydown', (e) => {
      if (e.target !== $('xtrataPlayer')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    });
    ['loadedmetadata', 'durationchange', 'timeupdate', 'volumechange'].forEach((name) =>
      audio.addEventListener(name, update)
    );
    audio.addEventListener('play', () => {
      report('Playing');
      update();
    });
    audio.addEventListener('playing', () => report('Playing'));
    audio.addEventListener('pause', () => {
      report(audio.ended ? 'Finished — play again' : 'Paused');
      update();
    });
    audio.addEventListener('ended', () => {
      report('Finished — play again');
      update();
    });
    audio.addEventListener('waiting', () => report('Loading audio…'));
    audio.addEventListener('canplay', () => {
      if (audio.paused) report('Ready to play');
    });
    audio.addEventListener('error', () => {
      const linked =
        manifest.assets && manifest.assets.audio && manifest.assets.audio.inscriptionId;
      report(
        linked
          ? 'Audio unavailable. It plays from inscription #' + linked + '.'
          : 'Audio unavailable. Try another browser.'
      );
    });
    document
      .querySelectorAll('[data-open]')
      .forEach((button) =>
        button.addEventListener('click', () => $(button.dataset.open).showModal())
      );
    document
      .querySelectorAll('[data-close]')
      .forEach((button) =>
        button.addEventListener('click', () => button.closest('dialog').close())
      );
    if ('mediaSession' in navigator && typeof MediaMetadata !== 'undefined') {
      const art = $('coverArt'),
        m = manifest.metadata;
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: m.title,
          artist: m.artist,
          album: m.album,
          artwork: art ? [{ src: art.src, type: manifest.visualMimeType }] : []
        });
        const handlers = {
          play: start,
          pause,
          seekto: (e) => {
            audio.currentTime = e.seekTime;
            update();
          },
          seekbackward: (e) => {
            audio.currentTime = Math.max(0, audio.currentTime - (e.seekOffset || 15));
          },
          seekforward: (e) => {
            if (Number.isFinite(audio.duration))
              audio.currentTime = Math.min(
                audio.duration,
                audio.currentTime + (e.seekOffset || 15)
              );
          }
        };
        for (const [name, handler] of Object.entries(handlers)) {
          try {
            navigator.mediaSession.setActionHandler(name, handler);
          } catch {}
        }
      } catch {}
    }
    update();
  }
  // Extras. Each function below is copied into the inscription only when its extra is switched on,
  // so it must have no outer dependencies. A = the audio element, P = the player.
  function fxState(A, P) {
    const set = () => P.classList.toggle('is-playing', !A.paused);
    ['play', 'pause', 'ended'].forEach((e) => A.addEventListener(e, set));
    set();
  }
  function fxKeys(A) {
    document.addEventListener('keydown', (e) => {
      if (e.defaultPrevented || /^(INPUT|TEXTAREA|BUTTON|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === ' ') {
        e.preventDefault();
        document.getElementById('playToggleButton').click();
      } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && Number.isFinite(A.duration)) {
        e.preventDefault();
        A.currentTime = Math.max(0, Math.min(A.duration, A.currentTime + (e.key === 'ArrowRight' ? 5 : -5)));
      }
    });
  }
  function fxFull(A, P) {
    const b = document.getElementById('fullArtButton');
    const set = (on) => {
      P.classList.toggle('full', on);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', on ? 'Close full-screen artwork' : 'Show artwork full screen');
    };
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      set(!P.classList.contains('full'));
    });
    P.querySelector('.art').addEventListener('click', () => set(!P.classList.contains('full')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') set(false);
    });
  }
  function fxRepeat(A) {
    const b = document.getElementById('repeatButton');
    b.addEventListener('click', () => {
      A.loop = !A.loop;
      b.setAttribute('aria-pressed', String(A.loop));
      b.classList.toggle('on', A.loop);
    });
  }
  function fxLyrics(A) {
    const lines = [...document.querySelectorAll('.lrc p')],
      out = document.getElementById('lyricLine');
    let last = -1;
    const tick = () => {
      let i = -1;
      for (let k = 0; k < lines.length && Number(lines[k].dataset.t) <= A.currentTime + 0.15; k++) i = k;
      if (i === last) return;
      if (last >= 0) lines[last].classList.remove('now');
      last = i;
      if (i >= 0) {
        lines[i].classList.add('now');
        if (lines[i].closest('dialog').open) lines[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      if (out) out.textContent = i >= 0 ? lines[i].textContent : '';
    };
    ['timeupdate', 'seeked'].forEach((e) => A.addEventListener(e, tick));
    lines.forEach((p) => p.addEventListener('click', () => (A.currentTime = Number(p.dataset.t))));
  }
  function fxCues(A) {
    const cues = document.querySelectorAll('.cue');
    const place = () =>
      cues.forEach((c) => {
        const t = Number(c.dataset.t);
        c.hidden = !(A.duration > t);
        if (A.duration > t) c.style.left = Math.min(96, Math.max(4, (t / A.duration) * 100)) + '%';
      });
    ['loadedmetadata', 'durationchange'].forEach((e) => A.addEventListener(e, place));
    cues.forEach((c) =>
      c.addEventListener('click', () => {
        A.currentTime = Number(c.dataset.t);
        if (A.paused) A.play().catch(() => {});
      })
    );
    place();
  }
  function fxViz(A, P, E) {
    const KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      bars = [...P.querySelectorAll('.viz i')];
    const lvl = (k) => (k >= 0 && k < E.length ? KEY.indexOf(E[k]) / 63 : 0);
    const at = (t) => {
      const x = t * 10,
        i = Math.floor(x);
      return lvl(i) * (1 - (x - i)) + lvl(i + 1) * (x - i);
    };
    let raf = 0;
    const frame = () => {
      const t = A.currentTime;
      P.style.setProperty('--lvl', at(t).toFixed(3));
      bars.forEach((b, i) => {
        const h = at(t - i * 0.025) * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.9 + t * 2.3)));
        b.style.height = Math.max(6, h * 100) + '%';
      });
      raf = A.paused ? 0 : requestAnimationFrame(frame);
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    A.addEventListener('play', () => {
      if (!raf) raf = requestAnimationFrame(frame);
    });
    A.addEventListener('pause', () => {
      cancelAnimationFrame(raf);
      raf = 0;
      P.style.setProperty('--lvl', '0');
    });
  }
  function fxStamp() {
    let id = '';
    try {
      id = new URLSearchParams(location.search).get('tokenId') || '';
      if (!/^\d{1,9}$/.test(id)) id = (String(location.pathname).match(/\/(\d{1,9})(?:\/|$)/) || [])[1] || '';
    } catch {}
    if (id) document.getElementById('xStamp').textContent = 'XTRATA · #' + id;
  }
  function fxGif(A) {
    const img = document.getElementById('coverArt');
    if (!img) return;
    const src = img.src;
    let still = '';
    const freeze = () => {
      if (!still)
        try {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          c.getContext('2d').drawImage(img, 0, 0);
          still = c.toDataURL();
        } catch {
          still = '-';
        }
      if (still !== '-' && A.paused) img.src = still;
    };
    if (img.complete) freeze();
    else img.addEventListener('load', freeze, { once: true });
    A.addEventListener('play', () => {
      if (img.src !== src) img.src = src;
    });
    A.addEventListener('pause', freeze);
  }
  function fxBackdrop(A, P) {
    const img = document.getElementById('coverArt');
    if (!img) return;
    const b = document.createElement('div');
    b.className = 'backdrop';
    b.style.backgroundImage = 'url("' + img.src + '")';
    P.prepend(b);
  }
  function fxWave(A) {
    const a = document.getElementById('wpA'),
      b = document.getElementById('wpB');
    const set = () => {
      const f = A.duration > 0 ? A.currentTime / A.duration : 0;
      a.setAttribute('offset', f);
      b.setAttribute('offset', f);
    };
    ['timeupdate', 'seeked', 'loadedmetadata'].forEach((e) => A.addEventListener(e, set));
  }
  function build(config) {
    let a = normalize(config.appearance);
    // "Colours from cover" needs colours picked from an artwork; without them it is the default palette.
    if (a.palette === 'cover' && !a.coverColors) a = { ...a, palette: 'charcoal' };
    const p = a.palette === 'cover' ? a.coverColors : palettes[a.palette],
      accent = a.accent || p.accent;
    const m = config.metadata || {},
      title = m.title || 'Untitled',
      artist = m.artist || '';
    const mime = /^audio\/[\w.+-]+(?:;\s*codecs=[\w-]+)?$/i.test(config.audioMimeType)
      ? config.audioMimeType
      : 'audio/mpeg';
    const b64 = (v) => String(v || '').replace(/\s/g, '');
    // Existing inscriptions (plain audio or a raster image) can be linked instead of embedded.
    // The link is the exact shape the radio follows: src="https://xtrata.xyz/inscription/<id>".
    const refId = (r) => (r && /^[1-9]\d{0,8}$/.test(String(r.id)) ? String(r.id) : '');
    const refUrl = (id) => `https://xtrata.xyz/inscription/${id}`;
    const refHash = (r) =>
      /^[0-9a-f]{64}$/.test(String((r && r.finalHash) || '')) ? r.finalHash : '';
    const audioRefId = refId(config.audioInscription);
    const imageRefId = refId(config.imageInscription);
    // A link that was asked for but is malformed must fail, never fall back to an empty embedded asset.
    if (config.audioInscription && !audioRefId) throw Error('Invalid linked audio.');
    if (config.imageInscription && !imageRefId) throw Error('Invalid linked artwork.');
    if (audioRefId && !/^audio\/[\w.+-]+(?:;\s*codecs=[\w-]+)?$/i.test(config.audioMimeType))
      throw Error('Invalid linked audio type.');
    if (
      imageRefId &&
      !['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'].includes(
        config.imageInscription.mimeType
      )
    )
      throw Error('Invalid linked artwork type.');
    if (!audioRefId && !/^[a-z\d+/]*={0,2}$/i.test(b64(config.audioBase64)))
      throw Error('Invalid embedded audio.');
    const hasArt =
      !!imageRefId ||
      (!!config.imageBase64 &&
        ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(config.imageMimeType));
    if (hasArt && !imageRefId && !/^[a-z\d+/]*={0,2}$/i.test(b64(config.imageBase64)))
      throw Error('Invalid embedded artwork.');
    const visualMime = imageRefId ? config.imageInscription.mimeType : config.imageMimeType;
    const art = hasArt
      ? imageRefId
        ? `<img id="coverArt" src="${refUrl(imageRefId)}" alt="${esc(title)} artwork">`
        : `<img id="coverArt" src="data:${config.imageMimeType};base64,${b64(config.imageBase64)}" alt="${esc(title)} artwork">`
      : `<div class="placeholder"><span>${
          a.placeholder === 'initials'
            ? esc(
                title
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
              )
            : '♫'
        }</span><small>${esc(artist || 'Music, preserved.')}</small></div>`;
    const peaks =
      a.timeline === 'waveform' && Array.isArray(config.peaks)
        ? config.peaks
            .filter(Number.isFinite)
            .slice(0, 160)
            .map((v) => Math.max(0, Math.min(100, v)))
        : [];
    // v2 waveform styles colour the played part in the accent (fxWave moves the gradient stops).
    // Chosen timeline colours, or a non-bar style, colour the played part (fxWave moves the stops).
    const waveV2 = peaks.length > 0 && (a.waveStyle !== 'bars' || !!a.waveColor || !!a.waveBase);
    const wx = (i) => Math.round(((i + 0.5) * 6400) / peaks.length) / 10,
      ww = Math.max(1, 640 / peaks.length - 1);
    const waveBody = !waveV2 || a.waveStyle === 'bars'
      ? peaks
          .map(
            (v, i) =>
              `<rect x="${(i * 640) / peaks.length}" y="${50 - Math.max(2, v) / 2}" width="${Math.max(1, 640 / peaks.length - 1)}" height="${Math.max(2, v)}" rx="1"/>`
          )
          .join('')
      : a.waveStyle === 'needles'
        ? `<path d="${peaks.map((v, i) => `M${wx(i) - 0.5} ${50 - Math.max(2, v) / 2}h1v${Math.max(2, v)}h-1z`).join('')}"/>`
      : a.waveStyle === 'blocks'
        ? // Blocks: four peaks per block, heights in steps, so the song reads as a chunky bar chart.
          peaks
            .filter((v, i) => i % 4 === 0)
            .map((v, i, all) => {
              const h = Math.max(12, Math.round(Math.max(...peaks.slice(i * 4, i * 4 + 4)) / 12.5) * 12.5),
                w = 640 / all.length;
              return `<rect x="${Math.round((i * w + 1) * 10) / 10}" y="${50 - h / 2}" width="${Math.round((w - 2) * 10) / 10}" height="${h}" rx="2"/>`;
            })
            .join('')
      : a.waveStyle === 'mirror'
        ? `<path d="${peaks.map((v, i) => `M${wx(i) - ww / 2} 60v${-Math.round(Math.max(2, v) * 6) / 10}h${ww}V60z`).join('')}"/><path opacity=".35" d="${peaks.map((v, i) => `M${wx(i) - ww / 2} 61v${Math.round(Math.max(1, v * 0.3) * 10) / 10}h${ww}V61z`).join('')}"/>`
        : a.waveStyle === 'line'
          ? `<polygon points="${[
              ...peaks.map((v, i) => wx(i) + ',' + (50 - Math.max(1, v) / 2)),
              ...peaks.map((v, i) => wx(i) + ',' + (50 + Math.max(1, v) / 2)).reverse()
            ].join(' ')}"/>`
          : // Dots: a dotted outline of the song's shape, above and below the centre line.
            `<path d="${peaks
              .map((v, i) => {
                const h = Math.max(1, v) / 2;
                return `M${wx(i) - ww / 2} ${50 - h}h${ww}v7h${-ww}zM${wx(i) - ww / 2} ${50 + h - 7}h${ww}v7h${-ww}z`;
              })
              .join('')}"/>`;
    const wave = peaks.length
      ? `<svg${waveV2 ? ' class="wv"' : ''} viewBox="0 0 640 100" preserveAspectRatio="none" aria-hidden="true">${waveV2 ? '<defs><linearGradient id="wp" gradientUnits="userSpaceOnUse" x1="0" x2="640" y1="0" y2="0"><stop offset="0" style="stop-color:var(--wave-on)"/><stop id="wpA" offset="0" style="stop-color:var(--wave-on)"/><stop id="wpB" offset="0" style="stop-color:var(--wave-off)"/><stop offset="1" style="stop-color:var(--wave-off)"/></linearGradient></defs>' : ''}${waveBody}</svg>`
      : '';
    // Loudness track for the visualiser and "breathe" (see prepareAnalysis). No track, no visualiser.
    const envelope =
      typeof config.envelope === 'string' && /^[A-Za-z0-9+/]{1,36000}$/.test(config.envelope)
        ? config.envelope
        : '';
    const viz = envelope ? a.visualiser : 'off',
      breathe = !!envelope && a.motion === 'breathe';
    const lrc = a.showLyrics && m.lyrics ? syncedLines(m.lyrics) : [];
    const version = isV2(a, lrc.length > 0) ? VERSION2 : VERSION;
    const lyricLine = lrc.length > 0 && (a.lyricsView === 'overlay' || a.fullArt);
    const isGif = visualMime === 'image/gif';
    // The timeline (waveform or progress bar) can sit above or below the controls, along the bottom
    // edge of the player or across the artwork. "inline" is the v1 layout, byte for byte.
    const pos = a.style === 'studio' && a.wavePos === 'cover' ? 'edge' : a.wavePos;
    const timelineHtml = `<div class="timeline${pos === 'inline' ? '' : ' tl-' + pos}" id="timeline">${wave}<div class="rail"></div><input id="seekRange" aria-label="Seek playback position" type="range" min="0" max="1000" value="0"></div>`;
    const timesHtml = '<div class="times"><span id="currentTime">0:00</span><span id="durationTime">0:00</span></div>';
    const vizEdge = viz === 'bars' && a.vizPos === 'edge';
    const artInner = a.style === 'vinyl' ? `<div class="disc"><div class="label">${art}</div></div>` : art;
    const overlays =
      (a.stamp ? '<span class="stamp" id="xStamp">XTRATA MUSIC</span>' : '') +
      (a.signature ? `<span class="sig">${esc(a.signature)}</span>` : '') +
      (viz === 'bars' && a.vizPos === 'cover' ? `<div class="viz" aria-hidden="true">${'<i></i>'.repeat(24)}</div>` : '') +
      (viz === 'ring' && a.style !== 'vinyl' ? '<div class="ring" aria-hidden="true"></div>' : '') +
      (lyricLine ? '<p class="lline" id="lyricLine" aria-hidden="true"></p>' : '') +
      (pos === 'cover' ? timelineHtml : '') +
      (a.fullArt
        ? '<button id="fullArtButton" class="xo" aria-label="Show artwork full screen" aria-pressed="false">⤢</button>'
        : '');
    const labels = {
      isrc: 'ISRC',
      bpm: 'BPM',
      rightsHolder: 'Rights holder',
      musicalKey: 'Musical key',
      featuredArtists: 'Featured artists',
      trackNumber: 'Track number'
    };
    const excluded = new Set([
      'schema',
      'schemaVersion',
      'assetType',
      'lyrics',
      'description',
      'appearance',
      'template'
    ]);
    const details = Object.entries(m).filter(
      ([k, v]) => !excluded.has(k) && typeof v === 'string' && v.trim()
    );
    const hasDetails = a.showCredits && (details.length || m.description);
    const hasLyrics = a.showLyrics && !!m.lyrics;
    const dialog = (id, heading, body) =>
      `<dialog id="${id}" aria-labelledby="${id}Title"><header><h2 id="${id}Title">${heading}</h2><button data-close aria-label="Close ${heading.toLowerCase()}">Close ×</button></header>${body}</dialog>`;
    const dependencies = [...new Set([audioRefId, imageRefId].filter(Boolean))];
    const linked = (id, mimeType, source) => ({
      sourceKind: 'xtrata-inscription',
      inscriptionId: id,
      url: refUrl(id),
      mimeType,
      finalHash: refHash(source)
    });
    const manifest = {
      template: version,
      mode: dependencies.length ? 'reference' : 'embedded',
      sourceKind: audioRefId ? 'xtrata-inscription' : 'embedded-base64',
      audioMimeType: mime,
      visualMimeType: hasArt ? visualMime : null,
      appearance: compact(a),
      dependencies,
      assets: {
        audio: audioRefId
          ? linked(audioRefId, mime, config.audioInscription)
          : { sourceKind: 'embedded-base64', mimeType: mime, inlinedIn: 'audio' },
        visual: hasArt
          ? imageRefId
            ? linked(imageRefId, visualMime, config.imageInscription)
            : { sourceKind: 'embedded-base64', mimeType: config.imageMimeType, inlinedIn: 'cover' }
          : null
      },
      metadata: m
    };
    const style = {
      classic:
        '.art{height:58%;padding:4% 4% 0}.art img{border-radius:6px}.body{height:42%;padding:3% 5%}.identity{flex:1}',
      sleeve:
        '.art{height:58%}.body{height:42%;padding:3% 5%;background:var(--page)}.identity{flex:1}',
      studio:
        '.art{position:absolute;right:6%;top:6%;width:26%;height:26%;border-radius:6px;overflow:hidden}.body{height:100%;padding:7%;justify-content:flex-end}.identity{position:absolute;top:8%;left:7%;width:56%}h1{font-size:clamp(18px,7cqw,42px)}.timeline{height:18cqw!important}.placeholder small{display:none}',
      vinyl:
        ".art{height:58%;padding:4% 4% 0;display:flex;justify-content:center;align-items:center}.disc{height:100%;aspect-ratio:1;max-width:100%;border-radius:50%;background:repeating-radial-gradient(circle,#101010 0 1px,#1e1e1e 1px 3px);display:grid;place-items:center;box-shadow:0 1cqw 4cqw #0009,0 0 calc(var(--lvl,0)*5cqw) var(--accent)}.label{width:40%;aspect-ratio:1;border-radius:50%;overflow:hidden;position:relative}.label:after{content:'';position:absolute;left:46%;top:46%;width:8%;height:8%;border-radius:50%;background:#101010}.label img{object-fit:cover!important}.label .placeholder{border:0}.label .placeholder span{font-size:7cqw}.label .placeholder small{display:none}.body{height:42%;padding:3% 5%}.identity{flex:1}",
      poster:
        '.art{position:absolute;inset:0}.art img{object-fit:cover!important}.body{position:absolute;left:0;right:0;bottom:0;padding:18% 5% 4%;background:linear-gradient(transparent,color-mix(in srgb,var(--page) 80%,transparent) 36%,var(--page))}.identity{flex:1}'
    }[a.style];
    const font = {
      sans: 'ui-sans-serif,system-ui,sans-serif',
      serif: 'Georgia,serif',
      mono: 'ui-monospace,monospace',
      rounded: 'ui-rounded,"SF Pro Rounded","Nunito","Varela Round",system-ui,sans-serif'
    }[a.font];
    // Extras: CSS and code for what is switched on, nothing for what is not.
    const posterFit = a.style === 'poster' ? '.art{height:100%}.body{height:auto}' : '';
    const cueRow = a.cues.length
      ? `<div class="cues">${a.cues.map((c) => `<button class="cue" data-t="${c.t}" hidden>${esc(c.label)}</button>`).join('')}</div>`
      : '';
    const spins = a.style === 'vinyl',
      zoom = a.motion === 'zoom',
      gifPause = a.artWhilePlaying && isGif,
      backdrop = hasArt ? a.backdrop : a.backdrop === 'blur' ? 'solid' : a.backdrop;
    const grainSvg =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";
    const layer = "#xtrataPlayer:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:6;";
    const tlH = { slim: wave ? '5cqw' : '14px', regular: wave ? '8cqw' : '24px', tall: wave ? '14cqw' : '34px' }[a.waveSize],
      railPx = { slim: 2, regular: 4, tall: 8 }[a.waveSize],
      vizColor = a.vizColor || 'var(--accent)';
    const timelineCss = [
      waveV2 || a.waveColor || a.waveBase
        ? `#xtrataPlayer{--wave-on:${a.waveColor || 'var(--accent)'};--wave-off:${a.waveBase || 'var(--muted)'}}`
        : '',
      a.waveColor || a.waveBase ? '.rail{background:var(--wave-off)}.rail:after{background:var(--wave-on)}' : '',
      a.waveSize !== 'regular' && (pos === 'inline' || pos === 'below')
        ? `@container(min-width:341px){#timeline{height:${tlH}!important}}.rail{height:${railPx}px}`
        : '',
      pos === 'edge'
        ? `#timeline{position:absolute;left:0;right:0;bottom:0;z-index:3;height:${tlH}!important;min-height:0}#timeline .rail{top:auto;bottom:0;height:${railPx}px}.body{padding-bottom:calc(${tlH} + 3%)!important}`
        : '',
      pos === 'cover'
        ? `#timeline{position:absolute;left:5%;right:5%;bottom:5%;z-index:3;height:${tlH}!important;min-height:0}#timeline .rail{height:${railPx}px}.art .viz{bottom:calc(8% + ${tlH})}`
        : '',
      pos === 'below' ? '.controls{order:0}' : '',
      vizEdge
        ? `#xtrataPlayer{isolation:isolate}.viz.edge{left:0;right:0;bottom:0;height:20%;gap:.6%;z-index:${a.style === 'sleeve' ? '1;opacity:.25' : '-1;opacity:.35'}}`
        : '',
      a.vizColor ? `.viz i{background:${vizColor}}.ring{border-color:${vizColor}}.disc{box-shadow:0 1cqw 4cqw #0009,0 0 calc(var(--lvl,0)*5cqw) ${vizColor}}` : '',
      a.align === 'center' ? '.identity{text-align:center}.controls{justify-content:center;flex-wrap:wrap}.extras{margin-left:0}' : '',
      a.titleSize === 'large'
        ? `.identity h1{font-size:clamp(18px,${a.style === 'studio' ? '9.5cqw,58px' : '7.5cqw,48px'})}`
        : '',
      a.artGlow
        ? '.art img,.art .placeholder,.disc{filter:drop-shadow(0 0 3cqw color-mix(in srgb,var(--accent) 55%,transparent))}'
        : ''
    ];
    const css2 =
      version === VERSION
        ? ''
        : [
            ['classic', 'sleeve', 'vinyl'].includes(a.style) ? '.art{position:relative}' : '',
            zoom || breathe ? '.art{overflow:hidden}' : '',
            a.button === 'square' ? '#playToggleButton{border-radius:24%}' : '',
            a.button === 'pill'
              ? '#playToggleButton{border-radius:999px;width:auto;padding:0 clamp(18px,6cqw,34px)}'
              : '',
            backdrop === 'blur'
              ? '#xtrataPlayer{isolation:isolate}.backdrop{position:absolute;inset:-12%;z-index:-1;background:center/cover no-repeat;filter:blur(36px) saturate(1.4);opacity:.5}'
              : '',
            backdrop === 'grain'
              ? layer + `opacity:.18;mix-blend-mode:overlay;background:url("${grainSvg}")}`
              : '',
            backdrop === 'paper'
              ? layer +
                'background:repeating-linear-gradient(115deg,#ffffff08 0 2px,#00000008 2px 5px),radial-gradient(circle at 30% 20%,#ffffff12,transparent 60%)}'
              : '',
            backdrop === 'scanlines'
              ? layer + 'background:repeating-linear-gradient(0deg,#00000030 0 1px,transparent 1px 3px)}'
              : '',
            waveV2 ? '.timeline svg.wv{fill:url(#wp)}' : '',
            viz === 'bars'
              ? '.viz{position:absolute;left:8%;right:8%;bottom:5%;height:22%;display:flex;align-items:flex-end;gap:1.5%;pointer-events:none;z-index:2}.viz i{flex:1;height:6%;background:var(--accent);opacity:.85;border-radius:2px}'
              : '',
            viz === 'ring' && !spins
              ? `.ring{position:absolute;inset:4%;border:3px solid var(--accent);border-radius:12px;pointer-events:none;z-index:2;opacity:calc(var(--lvl,0)*.9);transform:scale(calc(.97 + var(--lvl,0)*.05))}`
              : '',
            breathe ? '.art img{transform:scale(calc(1 + var(--lvl,0)*.045))}' : '',
            zoom
              ? '.is-playing .art img{animation:xzoom 24s ease-in-out infinite alternate}@keyframes xzoom{to{transform:scale(1.09)}}'
              : '',
            a.motion === 'tilt'
              ? '.art img{transition:transform .4s}.art:hover img{transform:perspective(700px) rotateX(3deg) rotateY(-5deg) scale(1.02)}'
              : '',
            spins ? '.is-playing .disc{animation:xspin 3.6s linear infinite}@keyframes xspin{to{transform:rotate(1turn)}}' : '',
            a.fullArt
              ? '.xo{position:absolute;right:3%;bottom:3%;z-index:5;width:44px;height:44px;min-height:44px;padding:0;border:0;border-radius:50%;background:#000000b0;color:#fff;font-size:20px}.full .art{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;padding:0!important;z-index:4;background:var(--page);border-radius:0}.full .art img{object-fit:contain!important}.full .label img{object-fit:cover!important}.full .viz,.full .ring{display:none}'
              : '',
            a.stamp
              ? '.stamp{position:absolute;left:3%;top:3%;z-index:3;font:700 clamp(9px,2.2cqw,12px)/1 ui-monospace,monospace;letter-spacing:.08em;padding:.6em .9em;border-radius:999px;background:#000000b0;color:#fff}'
              : '',
            a.signature
              ? '.sig{position:absolute;right:4%;top:4%;z-index:3;font:italic 600 clamp(11px,3.4cqw,22px) Georgia,serif;color:#fff;text-shadow:0 1px 6px #000c;pointer-events:none}'
              : '',
            a.note
              ? '.note{margin:1cqw 0 0;font-style:italic;font-size:clamp(11px,2.6cqw,16px);opacity:.9;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}@container(max-width:340px){.note{display:none}}'
              : '',
            a.cues.length
              ? '.cues{position:relative;height:clamp(22px,5cqw,30px)}.cue{position:absolute;bottom:0;transform:translateX(-50%);min-height:0;padding:.2em .55em;font-size:clamp(10px,2.3cqw,13px);border-radius:6px;white-space:nowrap}@container(max-width:340px){.cues{display:none}}'
              : '',
            a.repeat ? '#repeatButton.on{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}' : '',
            lrc.length ? '.lrc p{margin:0;padding:.35em 0;opacity:.55;cursor:pointer}.lrc p.now{opacity:1;font-weight:700;color:var(--accent)}' : '',
            lyricLine
              ? `.lline{position:absolute;left:6%;right:6%;bottom:${a.style === 'poster' ? '52%' : viz === 'bars' ? '30%' : '8%'};z-index:3;margin:0;text-align:center;font-weight:700;font-size:clamp(13px,4.4cqw,30px);line-height:1.25;color:#fff;text-shadow:0 2px 12px #000;pointer-events:none}${a.lyricsView === 'overlay' ? '' : '.lline{display:none}.full .lline{display:block}'}`
              : '',
            a.style === 'poster' ? '.art .viz{bottom:auto;top:10%}.xo{bottom:auto;top:3%}.sig{top:auto;bottom:60%}' : '',
            a.fullArt && viz === 'bars' && a.style !== 'poster' ? '.art .viz{right:calc(8% + 40px)}' : '',
            ...timelineCss,
            '@media(prefers-reduced-motion:reduce){.disc,.art img{animation:none!important;transform:none!important}.viz,.ring{display:none}}'
          ].join('');
    const fx = [];
    if (version === VERSION2) fx.push(`(${fxKeys})(A,P)`);
    if (spins || zoom || viz !== 'off' || breathe) fx.push(`(${fxState})(A,P)`);
    if (a.fullArt) fx.push(`(${fxFull})(A,P)`);
    if (a.repeat) fx.push(`(${fxRepeat})(A,P)`);
    if (lrc.length) fx.push(`(${fxLyrics})(A,P)`);
    if (a.cues.length) fx.push(`(${fxCues})(A,P)`);
    if (viz !== 'off' || breathe) fx.push(`(${fxViz})(A,P,${json(envelope)})`);
    if (a.stamp) fx.push(`(${fxStamp})(A,P)`);
    if (gifPause && !imageRefId) fx.push(`(${fxGif})(A,P)`);
    if (backdrop === 'blur') fx.push(`(${fxBackdrop})(A,P)`);
    if (waveV2) fx.push(`(${fxWave})(A,P)`);
    const fxScript = fx.length
      ? `<script>(function(){var A=document.getElementById('xtrataAudio'),P=document.getElementById('xtrataPlayer');${fx.join(';')}})();</script>`
      : '';
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>
:root{color-scheme:${a.palette === 'paper' || (a.palette === 'cover' && luminance(p.page) > 0.4) ? 'light' : 'dark'};--page:${p.page};--ink:${p.ink};--muted:${p.muted};--accent:${accent};--on-accent:${contrastInk(accent)}}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font:14px ${font};height:100dvh;display:grid;place-items:center}button,input{font:inherit}button{cursor:pointer;border:1px solid var(--muted);border-radius:999px;color:var(--ink);background:var(--page);min-height:44px;padding:0 14px}button:hover{filter:brightness(1.15)}:focus-visible{outline:3px solid var(--ink);outline-offset:3px}#xtrataPlayer{container-type:inline-size;position:relative;width:min(100vmin,760px);aspect-ratio:1;overflow:hidden;border-radius:${a.corners === 'soft' ? '16px' : '0'};background:var(--page)}.art img{width:100%;height:100%;object-fit:${a.artFit};object-position:${a.position};display:block}.placeholder{height:100%;display:flex;flex-direction:column;gap:14px;align-items:center;justify-content:center;background:${a.placeholder === 'gradient' ? 'radial-gradient(ellipse at 20% 10%,color-mix(in srgb,var(--accent) 25%,var(--page)),var(--page))' : 'var(--page)'};color:var(--ink);border:1px solid var(--muted)}.placeholder span{font-size:14cqw}.placeholder small{color:var(--muted);font-size:3cqw}.body{display:flex;flex-direction:column;gap:1.5cqw}h1{font-size:clamp(16px,5.3cqw,34px);line-height:1.1;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}.artist,.album{margin:1cqw 0 0;color:var(--muted);font-size:clamp(12px,3cqw,19px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.album{font-size:clamp(11px,2.5cqw,15px)}.controls{display:flex;align-items:center;gap:2cqw}.controls .secondary{font-size:clamp(11px,2.6cqw,15px);padding:0 10px}#playToggleButton{border:0;border-radius:50%;background:var(--accent);color:var(--on-accent);width:clamp(44px,12cqw,64px);height:clamp(44px,12cqw,64px);font-size:24px;flex-shrink:0}.extras{margin-left:auto;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.extras button{font-size:clamp(11px,2.6cqw,15px);padding:0 10px}.timeline{position:relative;height:${wave ? '8cqw' : '24px'};min-height:24px}.rail{position:absolute;top:45%;height:4px;width:100%;background:var(--muted);border-radius:4px}.rail:after{content:'';display:block;width:var(--played,0%);height:100%;background:var(--ink)}.timeline svg{width:100%;height:100%;fill:var(--muted)}.timeline:has(svg) .rail{opacity:.5}.timeline input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}.timeline:focus-within{outline:2px solid var(--ink);outline-offset:3px}.times{display:flex;justify-content:space-between;font-size:clamp(11px,2.5cqw,14px);font-variant-numeric:tabular-nums;color:var(--muted)}#playerStatus{margin:0;min-height:1.2em;font-size:clamp(11px,2.4cqw,14px);color:var(--muted)}audio{display:none}dialog{color:var(--ink);background:var(--page);border:1px solid var(--muted);border-radius:12px;width:min(92vw,620px);max-height:88dvh;padding:20px}dialog::backdrop{background:#000a}dialog header{display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:-20px;background:var(--page);padding:8px 0}h2{font-size:20px}dl{display:grid;gap:16px}dt{font-size:12px;color:var(--muted);text-transform:capitalize}dd{margin:4px 0 0;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.8}.description{white-space:pre-wrap;overflow-wrap:anywhere}${style}${css2}
@container(min-width:341px) and (max-width:560px){.art{height:42%}.body{height:58%}${a.style === 'studio' ? '.art{height:26%}.body{height:100%}' : ''}${posterFit}}
@container(max-width:340px){.art{height:30%}.body{height:70%;padding:3%}.album{display:none}.controls{gap:4px}.controls .secondary{display:none}.extras button{padding:0 8px}.body .timeline{height:24px!important}.body h1{font-size:17px}.body .artist{font-size:12px}.body #playerStatus{font-size:11px}${a.style === 'studio' ? '.art{height:25%;width:25%}.body{height:100%;padding:5%}.identity{top:7%;left:5%}' : ''}${posterFit}}
@container(max-width:240px){.art{height:15%}.body{height:85%;padding:3%;gap:2px}.body h1{font-size:14px;-webkit-line-clamp:1}.artist,.album,.times{display:none}.body #playerStatus{font-size:10px}.extras{gap:4px}.extras button{width:36px;min-height:36px;font-size:0;padding:0}.extras button:after{font-size:15px;content:'i'}.extras button[data-open="lyricsDialog"]:after{content:'♫'}#playToggleButton{width:36px;height:36px;min-height:36px;font-size:20px}${a.style === 'studio' ? '.art{height:20%;width:20%;top:4%;right:4%}.body{height:100%;padding:4%}.identity{top:5%;left:4%;width:66%}' : ''}${posterFit}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style></head><body><main id="xtrataPlayer" class="player" tabindex="0" aria-label="${esc(title)} music player" data-xtrata-template="${version}" data-style="${a.style}"${dependencies.length ? ` data-xtrata-dependencies="${dependencies.join(',')}"` : ''}><div class="art">${artInner}${overlays}</div><div class="body"><div class="identity"><h1>${esc(title)}</h1>${artist ? `<p class="artist">${esc(artist)}</p>` : ''}${a.showAlbum && m.album ? `<p class="album">${esc(m.album)}</p>` : ''}${a.note ? `<p class="note">${esc(a.note)}</p>` : ''}</div>${pos === 'inline' ? cueRow + timelineHtml + timesHtml : pos === 'below' ? '' : cueRow + timesHtml}<div class="controls"><button id="playToggleButton" aria-label="Play">▶</button><button class="secondary" id="restartButton">Restart</button><button class="secondary" id="muteButton" aria-pressed="false">Mute</button>${a.repeat ? '<button class="secondary" id="repeatButton" aria-pressed="false">Repeat</button>' : ''}<div class="extras">${hasDetails ? '<button data-open="detailsDialog">Details</button>' : ''}${hasLyrics ? '<button data-open="lyricsDialog">Lyrics</button>' : ''}</div></div>${pos === 'below' ? cueRow + timelineHtml + timesHtml : ''}<p id="playerStatus" role="status">Loading audio…</p></div>${vizEdge ? `<div class="viz edge" aria-hidden="true">${'<i></i>'.repeat(32)}</div>` : ''}${pos === 'edge' ? timelineHtml : ''}<audio id="xtrataAudio" preload="metadata" data-xtrata-asset="audio"><source src="${audioRefId ? refUrl(audioRefId) : `data:${mime};base64,${b64(config.audioBase64)}`}" type="${mime}"></audio></main>${hasDetails ? dialog('detailsDialog', 'Track details', `${m.description ? `<p class="description">${esc(m.description)}</p>` : ''}<dl>${details.map(([k, v]) => `<div><dt>${esc(labels[k] || k.replace(/([A-Z])/g, ' $1'))}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`) : ''}${hasLyrics ? dialog('lyricsDialog', 'Lyrics', lrc.length ? `<div class="lrc">${lrc.map((l) => `<p data-t="${l.t}">${esc(l.text) || '♪'}</p>`).join('')}</div>` : `<pre>${esc(m.lyrics)}</pre>`) : ''}<script type="application/json" id="xtrataPlayerManifest">${json(manifest)}</script><script type="application/json" id="xtrata-music-metadata">${json(m)}</script><script>(${runtime.toString()})();</script>${fxScript}</body></html>`;
  }
  window.XtrataMusicPlayer = {
    VERSION,
    VERSION2,
    palettes,
    choices,
    defaults,
    extraChoices,
    extraDefaults,
    normalize,
    compact,
    versionFor,
    syncedLines,
    contrastInk,
    preparePeaks,
    prepareAnalysis,
    coverColors,
    build
  };
})();
