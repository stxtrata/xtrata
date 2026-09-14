// Standalone Xtrata Music player. No runtime network, fonts or third-party code.
(function () {
  'use strict';
  const VERSION = 'xtrata-music-player-v1';
  const palettes = {
    charcoal: { page: '#151918', ink: '#f4f3ed', muted: '#b9c3bd', accent: '#c7e6a2' },
    paper: { page: '#f4efe5', ink: '#242820', muted: '#585d52', accent: '#385e46' },
    midnight: { page: '#101c2c', ink: '#edf3fa', muted: '#b0c3d7', accent: '#a9cfff' },
    monochrome: { page: '#151515', ink: '#ffffff', muted: '#bbbbbb', accent: '#ffffff' }
  };
  const choices = {
    style: ['classic', 'sleeve', 'studio'],
    palette: Object.keys(palettes),
    font: ['sans', 'serif', 'mono'],
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
  const normalize = (input = {}) => {
    input = input && typeof input === 'object' ? input : {};
    const result = { ...defaults };
    for (const key of Object.keys(choices))
      if (choices[key].includes(input[key])) result[key] = input[key];
    if (/^#[0-9a-f]{6}$/i.test(input.accent || '')) result.accent = input.accent.toLowerCase();
    for (const key of ['showAlbum', 'showLyrics', 'showCredits'])
      if (typeof input[key] === 'boolean') result[key] = input[key];
    return result;
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
  const peakCache = new WeakMap();
  async function preparePeaks(ex) {
    if (peakCache.has(ex)) return peakCache.get(ex);
    const pending = (async () => {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return [];
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
        return peaks.map((v) => Math.round((v / max) * 100));
      } catch {
        return [];
      } finally {
        clearTimeout(timer);
        if (context) await context.close().catch(() => {});
      }
    })();
    peakCache.set(ex, pending);
    return pending;
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
    audio.addEventListener('error', () => report('Audio unavailable. Try another browser.'));
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
  function build(config) {
    const a = normalize(config.appearance),
      p = palettes[a.palette],
      accent = a.accent || p.accent;
    const m = config.metadata || {},
      title = m.title || 'Untitled',
      artist = m.artist || '';
    const mime = /^audio\/[\w.+-]+(?:;\s*codecs=[\w-]+)?$/i.test(config.audioMimeType)
      ? config.audioMimeType
      : 'audio/mpeg';
    const b64 = (v) => String(v || '').replace(/\s/g, '');
    if (!/^[a-z\d+/]*={0,2}$/i.test(b64(config.audioBase64)))
      throw Error('Invalid embedded audio.');
    const hasArt =
      !!config.imageBase64 &&
      ['image/png', 'image/jpeg', 'image/webp'].includes(config.imageMimeType);
    if (hasArt && !/^[a-z\d+/]*={0,2}$/i.test(b64(config.imageBase64)))
      throw Error('Invalid embedded artwork.');
    const art = hasArt
      ? `<img id="coverArt" src="data:${config.imageMimeType};base64,${b64(config.imageBase64)}" alt="${esc(title)} artwork">`
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
    const wave = peaks.length
      ? `<svg viewBox="0 0 640 100" preserveAspectRatio="none" aria-hidden="true">${peaks.map((v, i) => `<rect x="${(i * 640) / peaks.length}" y="${50 - Math.max(2, v) / 2}" width="${Math.max(1, 640 / peaks.length - 1)}" height="${Math.max(2, v)}" rx="1"/>`).join('')}</svg>`
      : '';
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
    const manifest = {
      template: VERSION,
      mode: 'embedded',
      sourceKind: 'embedded-base64',
      audioMimeType: mime,
      visualMimeType: hasArt ? config.imageMimeType : null,
      appearance: a,
      dependencies: [],
      assets: {
        audio: { sourceKind: 'embedded-base64', mimeType: mime, inlinedIn: 'audio' },
        visual: hasArt
          ? { sourceKind: 'embedded-base64', mimeType: config.imageMimeType, inlinedIn: 'cover' }
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
        '.art{position:absolute;right:6%;top:6%;width:26%;height:26%;border-radius:6px;overflow:hidden}.body{height:100%;padding:7%;justify-content:flex-end}.identity{position:absolute;top:8%;left:7%;width:56%}h1{font-size:clamp(18px,7cqw,42px)}.timeline{height:18cqw!important}.placeholder small{display:none}'
    }[a.style];
    const font = {
      sans: 'ui-sans-serif,system-ui,sans-serif',
      serif: 'Georgia,serif',
      mono: 'ui-monospace,monospace'
    }[a.font];
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>
:root{color-scheme:${a.palette === 'paper' ? 'light' : 'dark'};--page:${p.page};--ink:${p.ink};--muted:${p.muted};--accent:${accent};--on-accent:${contrastInk(accent)}}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font:14px ${font};height:100dvh;display:grid;place-items:center}button,input{font:inherit}button{cursor:pointer;border:1px solid var(--muted);border-radius:999px;color:var(--ink);background:var(--page);min-height:44px;padding:0 14px}button:hover{filter:brightness(1.15)}:focus-visible{outline:3px solid var(--ink);outline-offset:3px}#xtrataPlayer{container-type:inline-size;position:relative;width:min(100vmin,760px);aspect-ratio:1;overflow:hidden;border-radius:${a.corners === 'soft' ? '16px' : '0'};background:var(--page)}.art img{width:100%;height:100%;object-fit:${a.artFit};object-position:${a.position};display:block}.placeholder{height:100%;display:flex;flex-direction:column;gap:14px;align-items:center;justify-content:center;background:${a.placeholder === 'gradient' ? 'radial-gradient(ellipse at 20% 10%,color-mix(in srgb,var(--accent) 25%,var(--page)),var(--page))' : 'var(--page)'};color:var(--ink);border:1px solid var(--muted)}.placeholder span{font-size:14cqw}.placeholder small{color:var(--muted);font-size:3cqw}.body{display:flex;flex-direction:column;gap:1.5cqw}h1{font-size:clamp(16px,5.3cqw,34px);line-height:1.1;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}.artist,.album{margin:1cqw 0 0;color:var(--muted);font-size:clamp(12px,3cqw,19px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.album{font-size:clamp(11px,2.5cqw,15px)}.controls{display:flex;align-items:center;gap:2cqw}.controls .secondary{font-size:clamp(11px,2.6cqw,15px);padding:0 10px}#playToggleButton{border:0;border-radius:50%;background:var(--accent);color:var(--on-accent);width:clamp(44px,12cqw,64px);height:clamp(44px,12cqw,64px);font-size:24px;flex-shrink:0}.extras{margin-left:auto;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.extras button{font-size:clamp(11px,2.6cqw,15px);padding:0 10px}.timeline{position:relative;height:${wave ? '8cqw' : '24px'};min-height:24px}.rail{position:absolute;top:45%;height:4px;width:100%;background:var(--muted);border-radius:4px}.rail:after{content:'';display:block;width:var(--played,0%);height:100%;background:var(--ink)}.timeline svg{width:100%;height:100%;fill:var(--muted)}.timeline:has(svg) .rail{opacity:.5}.timeline input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}.timeline:focus-within{outline:2px solid var(--ink);outline-offset:3px}.times{display:flex;justify-content:space-between;font-size:clamp(11px,2.5cqw,14px);font-variant-numeric:tabular-nums;color:var(--muted)}#playerStatus{margin:0;min-height:1.2em;font-size:clamp(11px,2.4cqw,14px);color:var(--muted)}audio{display:none}dialog{color:var(--ink);background:var(--page);border:1px solid var(--muted);border-radius:12px;width:min(92vw,620px);max-height:88dvh;padding:20px}dialog::backdrop{background:#000a}dialog header{display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:-20px;background:var(--page);padding:8px 0}h2{font-size:20px}dl{display:grid;gap:16px}dt{font-size:12px;color:var(--muted);text-transform:capitalize}dd{margin:4px 0 0;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.8}.description{white-space:pre-wrap;overflow-wrap:anywhere}${style}
@container(min-width:341px) and (max-width:560px){.art{height:42%}.body{height:58%}${a.style === 'studio' ? '.art{height:26%}.body{height:100%}' : ''}}
@container(max-width:340px){.art{height:30%}.body{height:70%;padding:3%}.album{display:none}.controls{gap:4px}.controls .secondary{display:none}.extras button{padding:0 8px}.body .timeline{height:24px!important}.body h1{font-size:17px}.body .artist{font-size:12px}.body #playerStatus{font-size:11px}${a.style === 'studio' ? '.art{height:25%;width:25%}.body{height:100%;padding:5%}.identity{top:7%;left:5%}' : ''}}
@container(max-width:240px){.art{height:15%}.body{height:85%;padding:3%;gap:2px}.body h1{font-size:14px;-webkit-line-clamp:1}.artist,.album,.times{display:none}.body #playerStatus{font-size:10px}.extras{gap:4px}.extras button{width:36px;min-height:36px;font-size:0;padding:0}.extras button:after{font-size:15px;content:'i'}.extras button[data-open="lyricsDialog"]:after{content:'♫'}#playToggleButton{width:36px;height:36px;min-height:36px;font-size:20px}${a.style === 'studio' ? '.art{height:20%;width:20%;top:4%;right:4%}.body{height:100%;padding:4%}.identity{top:5%;left:4%;width:66%}' : ''}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style></head><body><main id="xtrataPlayer" class="player" tabindex="0" aria-label="${esc(title)} music player" data-xtrata-template="${VERSION}" data-style="${a.style}"><div class="art">${art}</div><div class="body"><div class="identity"><h1>${esc(title)}</h1>${artist ? `<p class="artist">${esc(artist)}</p>` : ''}${a.showAlbum && m.album ? `<p class="album">${esc(m.album)}</p>` : ''}</div><div class="timeline" id="timeline">${wave}<div class="rail"></div><input id="seekRange" aria-label="Seek playback position" type="range" min="0" max="1000" value="0"></div><div class="times"><span id="currentTime">0:00</span><span id="durationTime">0:00</span></div><div class="controls"><button id="playToggleButton" aria-label="Play">▶</button><button class="secondary" id="restartButton">Restart</button><button class="secondary" id="muteButton" aria-pressed="false">Mute</button><div class="extras">${hasDetails ? '<button data-open="detailsDialog">Details</button>' : ''}${hasLyrics ? '<button data-open="lyricsDialog">Lyrics</button>' : ''}</div></div><p id="playerStatus" role="status">Loading audio…</p></div><audio id="xtrataAudio" preload="metadata" data-xtrata-asset="audio"><source src="data:${mime};base64,${b64(config.audioBase64)}" type="${mime}"></audio></main>${hasDetails ? dialog('detailsDialog', 'Track details', `${m.description ? `<p class="description">${esc(m.description)}</p>` : ''}<dl>${details.map(([k, v]) => `<div><dt>${esc(labels[k] || k.replace(/([A-Z])/g, ' $1'))}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`) : ''}${hasLyrics ? dialog('lyricsDialog', 'Lyrics', `<pre>${esc(m.lyrics)}</pre>`) : ''}<script type="application/json" id="xtrataPlayerManifest">${json(manifest)}</script><script type="application/json" id="xtrata-music-metadata">${json(m)}</script><script>(${runtime.toString()})();</script></body></html>`;
  }
  window.XtrataMusicPlayer = {
    VERSION,
    palettes,
    choices,
    defaults,
    normalize,
    contrastInk,
    preparePeaks,
    build
  };
})();
