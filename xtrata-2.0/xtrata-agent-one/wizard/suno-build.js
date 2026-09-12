// Compatibility builder for the existing acquisition page and wizard.
(function () {
  const { extract, runOnce, parseFfmeta, slug } = window.XtrataAudioProcessing;
  // Build a self-contained player File from an audio File (mp3, wav, flac, m4a —
  // anything ffmpeg.wasm decodes). onStatus(msg) for UI.
  // `overrides` (all optional) lets the page replace what was extracted:
  //   { title, artist, album, lyrics, description, license, bpm, note,
  //     coverB64, coverMime,          // embed THIS image as the artwork
  //     coverTokenId }                // OR reference an existing image INSCRIPTION (recursive artwork)
  async function build(file, onStatus, overrides) {
    if (!window.buildXtrataAudioPlayerHtml) throw new Error('player template not loaded (HTML_Template.js)');
    const o = overrides || {};
    const ex = await extract(file, onStatus);
    const meta = ex.meta;

    const pick = (ov, fallback) => {
      const v = ov != null ? String(ov).trim() : '';
      return ov != null ? v : fallback;
    };
    const title = pick(o.title, (meta.title || '').trim() || (file.name || 'Untitled').replace(/\.[^.]+$/, '')) || (file.name || 'Untitled').replace(/\.[^.]+$/, '');
    const artist = pick(o.artist, (meta.artist || '').trim());
    const album = pick(o.album, (meta.album || '').trim());
    const lyricsKey = Object.keys(meta).find((k) => /^lyrics/.test(k) || k === 'unsyncedlyrics');
    const extractedLyrics = (meta['lyrics-eng'] || meta['lyrics'] || (lyricsKey ? meta[lyricsKey] : '') || '').trim();
    const lyrics = pick(o.lyrics, extractedLyrics);
    const description = pick(o.description, '');
    const license = pick(o.license, '');
    const bpm = pick(o.bpm, '');
    const note = pick(o.note, '');
    const coverB64 = o.coverB64 !== undefined ? o.coverB64 : ex.coverB64;
    const coverMime = o.coverMime !== undefined ? o.coverMime : ex.coverMime;
    const comment = (meta.comment || '').trim();
    const isSuno = /made with suno/i.test(comment + ' ' + title + ' ' + artist) || /\bsuno\b/i.test(comment);

    onStatus && onStatus('Building the player…');
    const coverTokenId = o.coverTokenId != null ? String(o.coverTokenId).trim() : '';
    const cfg = {
      mode: 'embedded', audioMimeType: 'audio/webm; codecs=opus', audioBase64: ex.audioB64,
      artFit: 'cover',
      metadata: { assetType: 'song', title, artist, album, lyrics, description, license, bpm, note },
    };
    if (coverTokenId) {
      // Recursive artwork: the player references an already-inscribed image by token id
      // (audio stays embedded) — zero extra bytes for the art.
      cfg.visualSourceMode = 'recursive';
      cfg.recursive = { coverTokenId };
    } else if (coverB64) {
      cfg.imageMimeType = coverMime || undefined; cfg.imageBase64 = coverB64;
    }
    const html = window.buildXtrataAudioPlayerHtml(cfg);
    const playerFile = new File([html], slug(title || file.name) + '.player.html', { type: 'text/html' });
    return { playerFile, html, title, artist, album, lyrics, hasCover: !!(coverB64 || coverTokenId), coverTokenId: coverTokenId || null, hasLyrics: !!lyrics, isSuno, opusBytes: ex.opusBytes, playerBytes: playerFile.size, sourceBytes: file.size, coverB64, coverMime };
  }

  // Fast pre-check used to GATE the SUNO page: metadata + cover only (no Opus encode).
  // The page rejects MP3s without cover art / title / artist and sends them to the main wizard.
  async function probe(file, onStatus) {
    const inName = 'pr-' + Date.now() + '.' + ((file.name.match(/\.([a-z0-9]+)$/i) || [])[1] || 'mp3');
    let meta = {};
    try {
      const m = await runOnce(file, inName, ['-i', inName, '-f', 'ffmetadata', 'pr-meta.txt'], ['pr-meta.txt'], onStatus);
      if (m['pr-meta.txt'] && m['pr-meta.txt'].length) meta = parseFfmeta(new TextDecoder().decode(m['pr-meta.txt']));
    } catch (_e) {}
    let hasCover = false;
    try {
      const c = await runOnce(file, inName, ['-i', inName, '-an', '-map', '0:v:0', '-frames:v', '1', '-c:v', 'mjpeg', 'pr-cover.jpg'], ['pr-cover.jpg'], onStatus);
      hasCover = !!(c['pr-cover.jpg'] && c['pr-cover.jpg'].length);
    } catch (_e) {}
    const title = (meta.title || '').trim(), artist = (meta.artist || '').trim();
    return { title, artist, hasCover, hasTitle: !!title, hasArtist: !!artist };
  }

  window.XtrataSuno = { build, probe };
})();
