// Neutral music outputs. Originals are never transcoded implicitly.
(function () {
  const FIELDS = [
    'title',
    'artist',
    'album',
    'lyrics',
    'description',
    'license',
    'bpm',
    'note',
    'version',
    'trackNumber',
    'featuredArtists',
    'songwriters',
    'performers',
    'producer',
    'engineer',
    'genre',
    'releaseDate',
    'language',
    'musicalKey',
    'isrc',
    'rightsHolder'
  ];
  const MIME = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    flac: 'audio/flac',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    oga: 'audio/ogg',
    opus: 'audio/ogg',
    weba: 'audio/webm',
    webm: 'audio/webm',
    aiff: 'audio/aiff',
    aif: 'audio/aiff',
    wma: 'audio/x-ms-wma'
  };
  const mimeFor = (f) =>
    MIME[f.name.split('.').pop().toLowerCase()] ||
    (f.type.startsWith('audio/') ? f.type : 'application/octet-stream');
  // Re-running the audio engine is the slow part of every change, so its result is kept per file and
  // quality. A title, artist, artwork or link edit then rebuilds from memory instead of re-encoding.
  // Bounded (about 200 MB of text) and least-recently-used, so a large batch cannot exhaust memory.
  const CACHE_LIMIT = 200 * 1048576;
  const cache = new Map(); // File -> { size, byQuality: { [quality]: extractResult } }
  let cacheSize = 0;
  const weigh = (ex) =>
    (ex.audioB64 ? ex.audioB64.length : 0) +
    (ex.audioBytes ? ex.audioBytes.length : 0) +
    (ex.coverB64 ? ex.coverB64.length : 0);
  function forget(file) {
    const entry = cache.get(file);
    if (!entry) return;
    cacheSize -= entry.size;
    cache.delete(file);
  }
  function remember(file, quality, ex) {
    const size = weigh(ex);
    if (size > CACHE_LIMIT) return;
    const entry = cache.get(file) || { size: 0, byQuality: {} };
    cacheSize -= entry.size;
    entry.size += size - (entry.byQuality[quality] ? weigh(entry.byQuality[quality]) : 0);
    entry.byQuality[quality] = ex;
    cacheSize += entry.size;
    cache.delete(file);
    cache.set(file, entry); // most recently used goes last
    for (const [key, stale] of cache) {
      if (cacheSize <= CACHE_LIMIT || key === file) break;
      cacheSize -= stale.size;
      cache.delete(key);
    }
  }
  async function extractCached(file, onStatus, quality) {
    const entry = cache.get(file);
    if (entry && entry.byQuality[quality]) {
      cache.delete(file);
      cache.set(file, entry);
      return entry.byQuality[quality];
    }
    const ex = await window.XtrataAudioProcessing.extract(file, onStatus, quality);
    remember(file, quality, ex);
    return ex;
  }
  // What the file itself carried, whether or not the chosen release style uses it.
  const NOT_A_TAG = /^(aoe-|encoder$|major_brand$|minor_version$|compatible_brands$|handler_name$)/;
  function describeFile(meta) {
    const m = meta || {};
    const tags = Object.keys(m).filter((k) => String(m[k] ?? '').trim() && !NOT_A_TAG.test(k));
    const comment = String(m.comment ?? m.description ?? '');
    return {
      tags: tags.length,
      lyrics: !!String(m.lyrics ?? m['lyrics-eng'] ?? m.unsyncedlyrics ?? '').trim(),
      suno:
        /made with suno/i.test([comment, m.title, m.artist].join(' ')) || /\bsuno\b/i.test(comment)
    };
  }
  let serial = Promise.resolve();
  function build(file, onStatus, overrides = {}) {
    const o = { ...overrides };
    o.format ||= document.querySelector('#musicFormat')?.value || 'details';
    o.quality ||= document.querySelector('#musicQuality')?.value || 'optimised';
    o.appearance = window.XtrataMusicPlayer.normalize(
      o.appearance || window.musicAppearance?.get()
    );
    if (o.artFit)
      o.appearance = window.XtrataMusicPlayer.normalize({ ...o.appearance, artFit: o.artFit });
    const diagnostic = (phase, message) => {
      if (window.XtrataMusicDiagnostics) window.XtrataMusicDiagnostics.log(phase, message);
    };
    diagnostic(
      'queued',
      (file.size / 1048576).toFixed(2) + ' MiB audio; ' + o.format + '; ' + o.quality + '.'
    );
    const work = serial.then(async () => {
      diagnostic('prepare', 'Starting audio preparation.');
      try {
        const result = await buildOutput(file, onStatus, o);
        diagnostic(
          'prepared',
          'Output ready: ' + result.playerFile.size + ' bytes (' + result.playerFile.type + ').'
        );
        return result;
      } catch (error) {
        diagnostic('error', 'Preparation failed; see the error below the action button.');
        throw error;
      }
    });
    serial = work.catch(() => {});
    return work;
  }
  async function buildOutput(file, onStatus, o) {
    if (
      !['audio', 'details', 'artwork'].includes(o.format) ||
      !['original', 'optimised', 'compact', 'high', 'premium'].includes(o.quality)
    )
      throw new Error('Choose a valid release format and audio quality.');
    if (!file.size) throw new Error('This audio file is empty.');
    // An existing audio inscription is linked, not embedded. The fetched copy of it is only used
    // here to read tags, cover art and waveform, so it is always read at original quality.
    const audioRef = o.audioInscription || null;
    if (audioRef && o.format === 'audio')
      throw new Error(
        'A linked audio inscription needs a player. Choose "Audio + metadata" or "Audio + metadata + artwork".'
      );
    const quality = audioRef ? 'original' : o.quality;
    const ex = await extractCached(file, onStatus, quality);
    const seen = describeFile(ex.meta);
    const audioMime = audioRef
      ? audioRef.mimeType
      : quality === 'original'
        ? mimeFor(file)
        : 'audio/webm; codecs=opus';
    const metadata = { schema: 'xtrata-music', schemaVersion: 1, assetType: 'song' };
    for (const field of FIELDS) metadata[field] = String(o[field] ?? ex.meta[field] ?? '').trim();
    metadata.title = metadata.title || file.name.replace(/\.[^.]+$/, '');
    metadata.lyrics = String(
      o.lyrics ?? ex.meta.lyrics ?? ex.meta['lyrics-eng'] ?? ex.meta.unsyncedlyrics ?? ''
    ).trim();
    const coverRef = o.format === 'artwork' ? o.coverInscription || null : null;
    const coverB64 = coverRef
      ? null
      : o.format === 'artwork'
        ? o.coverB64 !== undefined
          ? o.coverB64
          : ex.coverB64
        : null;
    const coverMime = coverB64 ? o.coverMime || ex.coverMime || 'image/jpeg' : null;
    const audioLabel = audioRef
      ? 'Linked to inscription #' + audioRef.id
      : o.quality === 'original'
        ? 'Original audio'
        : 'Opus ' +
          { compact: 48, optimised: 96, high: 128, premium: 160 }[o.quality] +
          ' kbps VBR';
    let artworkInfo = null;
    if (coverB64 && window.XtrataMusicArtwork) {
      try {
        artworkInfo = await window.XtrataMusicArtwork.inspect(
          window.XtrataMusicArtwork.fromBase64(coverB64, coverMime)
        );
      } catch {
        artworkInfo = {
          warnings: [
            'Artwork could not be inspected. Use the artwork editor to check or replace it.'
          ]
        };
      }
    }
    let playerFile, html;
    if (o.format === 'audio') {
      playerFile =
        o.quality === 'original'
          ? new File([file], file.name, { type: audioMime, lastModified: file.lastModified })
          : new File([ex.audioBytes], metadata.title + '.weba', { type: audioMime });
      html = null;
    } else {
      metadata.appearance = o.appearance;
      metadata.template = window.XtrataMusicPlayer.VERSION;
      if (o.appearance.timeline === 'waveform' && onStatus) onStatus('Preparing the waveform…');
      const peaks =
        o.appearance.timeline === 'waveform' ? await window.XtrataMusicPlayer.preparePeaks(ex) : [];
      html = window.XtrataMusicPlayer.build({
        audioMimeType: audioMime,
        audioBase64: audioRef ? '' : ex.audioB64,
        audioInscription: audioRef,
        imageInscription: coverRef,
        imageBase64: coverB64,
        imageMimeType: coverMime,
        metadata,
        appearance: o.appearance,
        peaks
      });
      playerFile = new File(
        [html],
        window.XtrataAudioProcessing.slug(metadata.title) + '.music.html',
        { type: 'text/html' }
      );
    }
    if (playerFile.size > 33554432)
      throw new Error(
        'The finished inscription exceeds 32 MiB. Optimise the audio, reduce artwork, or use a shorter recording.'
      );
    return {
      ...metadata,
      metadata,
      appearance: o.appearance,
      playerFile,
      html,
      coverB64,
      coverMime,
      artworkInfo,
      hasCover: !!coverB64 || !!coverRef,
      // 'file' = the song's own embedded art, 'upload' = chosen by the user, 'linked' = an existing
      // inscription, 'none' = this release has no cover.
      coverSource: coverRef ? 'linked' : coverB64 ? (o.coverB64 ? 'upload' : 'file') : 'none',
      found: { cover: !!ex.coverB64, lyrics: seen.lyrics, tags: seen.tags },
      isSuno: seen.suno,
      audioRef,
      coverRef,
      coverUrl: coverRef ? window.XtrataMusicSources.canonicalUrl(coverRef.id) : null,
      linkedIds: [...new Set([audioRef && audioRef.id, coverRef && coverRef.id].filter(Boolean))],
      hasLyrics: o.format !== 'audio' && !!metadata.lyrics,
      audioLabel,
      format: o.format,
      quality,
      opusBytes: ex.opusBytes,
      sourceBytes: file.size,
      playerBytes: playerFile.size
    };
  }
  window.XtrataMusic = { build, FIELDS, mimeFor, forget };
})();
