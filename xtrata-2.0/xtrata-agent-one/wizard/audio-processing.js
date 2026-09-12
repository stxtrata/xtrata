// Shared local audio inspection, encoding and metadata extraction. No wallet access.
(function () {
  // The threaded core needs SharedArrayBuffer → cross-origin isolation, which is only
  // enabled on the isolated audio page (COEP breaks wallet popups elsewhere). Everywhere else (e.g. the
  // batch wizard) use the SINGLE-THREADED core: slower encode, zero isolation needs.
  const isolated = () =>
    typeof crossOriginIsolated !== 'undefined' &&
    crossOriginIsolated &&
    typeof SharedArrayBuffer !== 'undefined';
  const CORE_MT = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js';
  const CORE_ST = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js';
  const report = (phase, message, percent = null) => {
    if (typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined')
      window.dispatchEvent(
        new CustomEvent('xtrata:audio-diagnostic', { detail: { phase, message, percent } })
      );
  };
  async function loadEngine(f, core, onStatus) {
    const started = Date.now();
    let expired = false,
      timer;
    report(
      'engine-load',
      'Loading ' +
        (core === CORE_MT ? 'multi-threaded' : 'single-threaded') +
        ' engine from jsDelivr; download and WebAssembly initialisation may take time.'
    );
    const heartbeat = setInterval(() => {
      const seconds = Math.round((Date.now() - started) / 1000);
      const message =
        'Audio engine is still loading (' +
        seconds +
        's). Waiting for download / WebAssembly initialisation.';
      report('engine-wait', message);
      onStatus?.(message);
    }, 10000);
    try {
      const loading = f.load().then(() => {
        if (expired) {
          try {
            f.exit();
          } catch {}
        }
      });
      await Promise.race([
        loading,
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            expired = true;
            try {
              f.exit();
            } catch {}
            reject(
              new Error(
                'Audio engine did not load within 120 seconds. Check your connection or content blocker, then drop the file again to retry.'
              )
            );
          }, 120000);
        })
      ]);
      report(
        'engine-ready',
        'Audio engine ready after ' + ((Date.now() - started) / 1000).toFixed(1) + 's.'
      );
    } catch (error) {
      report(
        'engine-error',
        expired ? 'Engine load timed out after 120s.' : 'Engine download or initialisation failed.'
      );
      throw error;
    } finally {
      clearTimeout(timer);
      clearInterval(heartbeat);
    }
  }
  let _ff = null,
    _loading = null;
  async function ffPersistent(onStatus) {
    // threaded singleton (isolated pages: the isolated audio page)
    if (_ff) return _ff;
    if (_loading) return _loading;
    _loading = (async () => {
      const FF = window.FFmpeg;
      if (!FF || !FF.createFFmpeg) throw new Error('ffmpeg.wasm not loaded');
      onStatus && onStatus('Loading the audio engine…');
      const f = FF.createFFmpeg({ log: false, corePath: CORE_MT });
      await loadEngine(f, CORE_MT, onStatus);
      _ff = f;
      return f;
    })();
    // Do NOT cache a rejection — a transient CDN/network failure must stay retryable.
    try {
      return await _loading;
    } catch (e) {
      _loading = null;
      throw e;
    }
  }
  async function ffFresh(onStatus) {
    // ST core: FRESH instance per command (see runOnce)
    const FF = window.FFmpeg;
    if (!FF || !FF.createFFmpeg) throw new Error('ffmpeg.wasm not loaded');
    onStatus && onStatus('Loading the audio engine…');
    const f = FF.createFFmpeg({ log: false, corePath: CORE_ST, mainName: 'main' });
    await loadEngine(f, CORE_ST, onStatus);
    return f;
  }
  /**
   * Run ONE ffmpeg command against `file`, returning the requested outputs
   * ({ name: Uint8Array|null }). On non-isolated pages every command gets a FRESH
   * single-threaded instance that is discarded afterwards — the 0.11 ST core leaves
   * its internal `running` flag stuck after ANY failed command (e.g. probing cover
   * art on a song that has none), which would poison all later commands.
   */
  async function runOnce(file, inName, args, outputs, onStatus) {
    const iso = isolated();
    const stage = args.includes('cover.jpg')
      ? 'artwork extraction'
      : args.includes('out.weba')
        ? 'Opus conversion'
        : 'original audio validation';
    report('stage', 'Starting ' + stage + '.');
    const f = iso ? await ffPersistent(onStatus) : await ffFresh(onStatus);
    const clean = (n) => {
      try {
        f.FS('unlink', n);
      } catch (_e) {}
    };
    const seconds = (value) => value.split(':').reduce((total, n) => total * 60 + Number(n), 0);
    let duration = 0;
    let lastProgress = 0,
      lastSignal = Date.now(),
      heartbeat;
    if (f.setLogger)
      f.setLogger(({ message }) => {
        const text = String(message || '');
        const durationMatch = text.match(/Duration:\s*(\d+:\d+:\d+(?:\.\d+)?)/);
        if (durationMatch) duration = seconds(durationMatch[1]);
        const match = text.match(/time=\s*(\d+:\d+:\d+(?:\.\d+)?)/);
        if (match) {
          lastSignal = Date.now();
          if (Date.now() - lastProgress > 2000) {
            lastProgress = Date.now();
            const message = stage + ': processed ' + match[1] + ' of audio';
            report(
              'progress',
              message,
              stage === 'Opus conversion' && duration > 0
                ? Math.min(99, Math.floor((seconds(match[1]) / duration) * 100))
                : null
            );
            onStatus?.(message);
          }
        }
      });
    try {
      report(
        'input',
        'Reading ' + (file.size / 1048576).toFixed(2) + ' MiB into the audio engine.'
      );
      f.FS('writeFile', inName, await fetchFile(file));
      report('processing', 'Running ' + stage + '.');
      onStatus?.('Running ' + stage + '…');
      const started = Date.now();
      heartbeat = setInterval(
        () =>
          report(
            'processing-wait',
            stage +
              ' running for ' +
              Math.round((Date.now() - started) / 1000) +
              's; last encoder progress ' +
              Math.round((Date.now() - lastSignal) / 1000) +
              's ago.'
          ),
        10000
      );
      await f.run(...args);
      report(
        'processing-done',
        stage + ' command finished in ' + ((Date.now() - started) / 1000).toFixed(1) + 's.'
      );
      const out = {};
      for (const name of outputs) {
        try {
          const d = f.FS('readFile', name);
          out[name] = d && d.length ? d : null;
        } catch (_e) {
          out[name] = null;
        }
      }
      report(
        'output',
        Object.entries(out)
          .map(([name, data]) => name + ': ' + (data ? data.length + ' bytes' : 'not present'))
          .join('; ')
      );
      return out;
    } catch (error) {
      report(
        'processing-error',
        stage + ' failed; see the preparation error below the action button.'
      );
      throw error;
    } finally {
      clearInterval(heartbeat);
      if (iso) {
        [inName, ...outputs].forEach(clean);
      } else {
        try {
          f.exit();
        } catch (_e) {}
      } // ST: discard the whole instance (also frees FS)
    }
  }

  const fetchFile = async (file) =>
    window.FFmpeg && window.FFmpeg.fetchFile
      ? window.FFmpeg.fetchFile(file)
      : new Uint8Array(await file.arrayBuffer());
  const slug = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'track';
  function b64(u8) {
    let s = '';
    const CH = 0x8000;
    for (let i = 0; i < u8.length; i += CH)
      s += String.fromCharCode.apply(null, u8.subarray(i, i + CH));
    return btoa(s);
  }

  // ffmetadata parser (handles \-escapes + multi-line continuation, e.g. lyrics)
  const ffUnescape = (s) => String(s).replace(/\\(.)/g, (_m, c) => c);
  function parseFfmeta(text) {
    const out = {};
    const lines = String(text).split('\n');
    let i = 0;
    const endsEscaped = (s) => {
      let n = 0;
      for (let j = s.length - 1; j >= 0 && s[j] === '\\'; j--) n++;
      return n % 2 === 1;
    };
    while (i < lines.length) {
      let line = lines[i++];
      if (!line || line[0] === ';' || line[0] === '#') continue;
      while (endsEscaped(line) && i < lines.length) line = line.slice(0, -1) + '\n' + lines[i++];
      let eq = -1;
      for (let j = 0; j < line.length; j++)
        if (line[j] === '=') {
          let n = 0,
            k = j - 1;
          while (k >= 0 && line[k] === '\\') {
            n++;
            k--;
          }
          if (n % 2 === 0) {
            eq = j;
            break;
          }
        }
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim().toLowerCase();
      if (!(key in out)) out[key] = ffUnescape(line.slice(eq + 1));
    }
    return out;
  }

  // The opus tool's Music (High Quality) → .weba command (+ Audional/Xtrata tags).
  const OPUS_ARGS = (inName, bitrate = 96) => [
    '-i',
    inName,
    '-map',
    '0:a:0',
    '-map_chapters',
    '-1',
    '-vn',
    '-sn',
    '-dn',
    '-metadata',
    'AOE-Generator=AudionalOpusEncoder_v1.0',
    '-metadata',
    'X-AudionalTool-Origin=AudionalOpusEncoder_v1.0',
    '-metadata',
    'comment=Generated by AudionalOpusEncoder_v1.0',
    '-metadata',
    'xtrata_mime=audio/webm; codecs=opus',
    '-metadata',
    'xtrata_media_kind=audio',
    '-metadata:s:a:0',
    'handler_name=Audio',
    '-metadata:s:a:0',
    'media_type=audio',
    '-c:a',
    'libopus',
    '-b:a',
    bitrate + 'k',
    '-vbr',
    '1',
    '-compression_level',
    '7',
    '-application',
    'audio',
    '-f',
    'webm',
    'out.weba'
  ];

  // Cache of the heavy extraction (Opus encode + tag/cover pull) per source file.
  // Lets the music editor rebuild the player instantly when the user only edits
  // metadata or swaps the artwork — no re-encode.
  const extracts = new WeakMap();

  async function extract(file, onStatus, quality = 'optimised') {
    if (!['original', 'optimised', 'compact', 'high', 'premium'].includes(quality))
      throw new Error('Unsupported audio quality');
    const bitrate = ({ compact: 48, optimised: 96, high: 128, premium: 160 })[quality];
    const cached = extracts.get(file);
    if (cached && cached[quality]) {
      report('cache', 'Reusing prepared audio for this file (' + quality + ').');
      return cached[quality];
    }
    const inName =
      'in-' + Date.now() + '.' + ((file.name.match(/\.([a-z0-9]+)$/i) || [])[1] || 'mp3');

    // Command 1 (always succeeds on valid audio): Opus encode + the source
    // metadata dumped as ffmetadata, FOLDED into ONE ffmpeg invocation. One
    // command instead of two keeps the fresh-instance ST path fast, and the
    // -metadata SET flags bind to out.weba only — meta.txt gets the *source*
    // title/artist/lyrics via -map_metadata 0 (see OPUS_ARGS).
    onStatus &&
      onStatus(
        quality === 'original'
          ? 'Checking original audio…'
          : 'Optimising to Opus (' + bitrate + ' kbps VBR)…'
      );
    const args =
      quality === 'original'
        ? [
            '-i',
            inName,
            '-map',
            '0:a:0',
            '-t',
            '0.05',
            '-f',
            's16le',
            'check.pcm',
            '-map_metadata',
            '0',
            '-f',
            'ffmetadata',
            'meta.txt'
          ]
        : [...OPUS_ARGS(inName, bitrate), '-map_metadata', '0', '-f', 'ffmetadata', 'meta.txt'];
    const enc = await runOnce(file, inName, args, ['out.weba', 'meta.txt', 'check.pcm'], onStatus);
    if (quality === 'original' && !enc['check.pcm']?.length)
      throw new Error('This file does not contain decodable audio. Choose a valid recording.');
    const weba =
      quality === 'original' ? new Uint8Array(await file.arrayBuffer()) : enc['out.weba'];
    if (!weba || !weba.length) throw new Error('Opus encode produced no audio');
    let meta = {};
    if (enc['meta.txt'] && enc['meta.txt'].length) {
      try {
        meta = parseFfmeta(new TextDecoder().decode(enc['meta.txt']));
      } catch (_e) {}
    }

    // Command 2 (MAY fail — art-less songs have no video stream): cover art.
    // It runs on its OWN fresh ST instance, so a failure here can neither poison
    // the encode above nor the next file's build (the 0.11 stuck-`running` bug).
    onStatus && onStatus('Extracting cover art…');
    let coverB64 = null,
      coverMime = null;
    try {
      const cov = await runOnce(
        file,
        inName,
        ['-i', inName, '-an', '-map', '0:v:0', '-frames:v', '1', '-c:v', 'mjpeg', 'cover.jpg'],
        ['cover.jpg'],
        onStatus
      );
      const cb = cov['cover.jpg'];
      if (cb && cb.length) {
        coverB64 = b64(cb);
        coverMime = 'image/jpeg';
      }
    } catch (_e) {
      report('artwork-optional', 'No extractable cover artwork; continuing without artwork.');
    }

    report('packaging', 'Preparing audio bytes for the selected output.');
    const result = {
      audioB64: b64(weba),
      audioBytes: weba,
      opusBytes: quality === 'original' ? null : weba.length,
      meta,
      coverB64,
      coverMime
    };
    extracts.set(file, { ...(extracts.get(file) || {}), [quality]: result });
    return result;
  }

  window.XtrataAudioProcessing = { extract, runOnce, parseFfmeta, slug };
})();
