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
      await f.load();
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
    await f.load();
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
    const f = iso ? await ffPersistent(onStatus) : await ffFresh(onStatus);
    const clean = (n) => {
      try {
        f.FS('unlink', n);
      } catch (_e) {}
    };
    try {
      f.FS('writeFile', inName, await fetchFile(file));
      await f.run(...args);
      const out = {};
      for (const name of outputs) {
        try {
          const d = f.FS('readFile', name);
          out[name] = d && d.length ? d : null;
        } catch (_e) {
          out[name] = null;
        }
      }
      return out;
    } finally {
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
  const OPUS_ARGS = (inName) => [
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
    '96k',
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
    const cached = extracts.get(file);
    if (cached && cached[quality]) return cached[quality];
    const inName =
      'in-' + Date.now() + '.' + ((file.name.match(/\.([a-z0-9]+)$/i) || [])[1] || 'mp3');

    // Command 1 (always succeeds on valid audio): Opus encode + the source
    // metadata dumped as ffmetadata, FOLDED into ONE ffmpeg invocation. One
    // command instead of two keeps the fresh-instance ST path fast, and the
    // -metadata SET flags bind to out.weba only — meta.txt gets the *source*
    // title/artist/lyrics via -map_metadata 0 (see OPUS_ARGS).
    onStatus &&
      onStatus(
        quality === 'original' ? 'Checking original audio…' : 'Optimising to Opus (96 kbps VBR)…'
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
        : [...OPUS_ARGS(inName), '-map_metadata', '0', '-f', 'ffmetadata', 'meta.txt'];
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
    } catch (_e) {}

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
