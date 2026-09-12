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
  const escape = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  let serial = Promise.resolve();
  function build(file, onStatus, overrides = {}) {
    const o = { ...overrides };
    o.format ||= document.querySelector('#musicFormat')?.value || 'details';
    o.quality ||= document.querySelector('#musicQuality')?.value || 'optimised';
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
    const ex = await window.XtrataAudioProcessing.extract(file, onStatus, o.quality);
    const audioMime = o.quality === 'original' ? mimeFor(file) : 'audio/webm; codecs=opus';
    const metadata = { schema: 'xtrata-music', schemaVersion: 1, assetType: 'song' };
    for (const field of FIELDS) metadata[field] = String(o[field] ?? ex.meta[field] ?? '').trim();
    metadata.title = metadata.title || file.name.replace(/\.[^.]+$/, '');
    metadata.lyrics = String(
      o.lyrics ?? ex.meta.lyrics ?? ex.meta['lyrics-eng'] ?? ex.meta.unsyncedlyrics ?? ''
    ).trim();
    const coverB64 =
      o.format === 'artwork' ? (o.coverB64 !== undefined ? o.coverB64 : ex.coverB64) : null;
    const coverMime = coverB64 ? o.coverMime || ex.coverMime || 'image/jpeg' : null;
    const audioLabel =
      o.quality === 'original'
        ? 'Original audio'
        : 'Opus ' + ({ compact: 48, optimised: 96, high: 128, premium: 160 })[o.quality] + ' kbps VBR';
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
      html = window.buildXtrataAudioPlayerHtml({
        mode: 'embedded',
        audioMimeType: audioMime,
        audioBase64: ex.audioB64,
        artFit: o.artFit || 'cover',
        imageBase64: coverB64 || undefined,
        imageMimeType: coverMime || undefined,
        metadata
      });
      // Include the complete versioned record, including credits not understood by older players.
      const json = JSON.stringify(metadata)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026');
      const credits = FIELDS.filter(
        (k) =>
          !['title', 'artist', 'album', 'lyrics', 'description', 'license', 'bpm', 'note'].includes(
            k
          ) && metadata[k]
      )
        .map(
          (k) =>
            '<div><dt>' +
            escape(k.replace(/([A-Z])/g, ' $1')) +
            '</dt><dd>' +
            escape(metadata[k]) +
            '</dd></div>'
        )
        .join('');
      html = html.replace(
        '</head>',
        '<script type="application/json" id="xtrata-music-metadata">' + json + '</script></head>'
      );
      if (credits) html = html.replace('</dl>', credits + '</dl>');
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
      playerFile,
      html,
      coverB64,
      coverMime,
      artworkInfo,
      hasCover: !!coverB64,
      hasLyrics: o.format !== 'audio' && !!metadata.lyrics,
      audioLabel,
      format: o.format,
      quality: o.quality,
      opusBytes: ex.opusBytes,
      sourceBytes: file.size,
      playerBytes: playerFile.size
    };
  }
  window.XtrataMusic = { build, FIELDS, mimeFor };
})();
