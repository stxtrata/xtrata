// Pure helpers for the batch list in the music wizard: what each song found in its own file, the
// bulk actions, track numbering, per-song dependencies and the permission gate for linked sources.
// No DOM and no network, so they are unit-tested directly. The page owns rendering and rebuilding.
(function () {
  const LARGE_ART_BYTES = 250 * 1024;
  const text = (v) => String(v == null ? '' : v).trim();
  const HAS_ART = ['file', 'upload', 'linked'];

  // What a built row knows about itself, or null while it has not been built yet.
  function facts(it) {
    const info = it && it.info;
    if (!info) return null;
    const found = info.found || {};
    const name = ((it.origFile || it.file || {}).name || '').toString();
    let art = 'none';
    if (info.format === 'audio') art = 'n/a';
    else if (info.hasCover) art = info.coverSource || 'file';
    else if (found.cover) art = 'off'; // the song has art, this release leaves it out
    return {
      art,
      artId: info.coverRef ? info.coverRef.id : '',
      artFound: !!found.cover,
      lyrics: !!info.hasLyrics,
      tags: found.tags || 0,
      suno: !!info.isSuno,
      audioId: info.audioRef ? info.audioRef.id : '',
      type: info.audioRef ? '' : ((/\.([a-z0-9]{1,5})$/i.exec(name) || [])[1] || '').toUpperCase()
    };
  }

  // Short labels shown under each song. Tone is only a hint for styling; none of these block anything.
  function chips(it) {
    const f = facts(it);
    if (!f) return [];
    const out = [];
    if (f.art === 'file') out.push({ tone: 'ok', text: '🖼 art from the file' });
    else if (f.art === 'upload') out.push({ tone: 'ok', text: '🖼 your artwork' });
    else if (f.art === 'linked') out.push({ tone: 'accent', text: '🖼 artwork #' + f.artId });
    else if (f.art === 'off') out.push({ tone: 'muted', text: 'art in the file is left out' });
    else if (f.art === 'none') out.push({ tone: 'warn', text: 'no artwork' });
    if (f.lyrics) out.push({ tone: 'ok', text: '♪ lyrics' });
    if (f.tags) out.push({ tone: 'muted', text: f.tags + (f.tags === 1 ? ' tag' : ' tags') });
    if (f.suno) out.push({ tone: 'accent', text: 'Suno' });
    if (f.audioId) out.push({ tone: 'accent', text: '🔗 audio #' + f.audioId });
    else if (f.type) out.push({ tone: 'muted', text: f.type });
    return out;
  }

  const shrinkable = (it) =>
    !!(
      it &&
      it.status === 'ready' &&
      it.info &&
      it.info.coverB64 &&
      !it.info.coverRef &&
      it.info.artworkInfo &&
      !it.info.artworkInfo.animated &&
      it.info.artworkInfo.bytes > LARGE_ART_BYTES
    );

  function summary(items) {
    const s = {
      total: items.length,
      ready: 0,
      withArt: 0,
      withoutArt: 0,
      artLeftOut: 0,
      withLyrics: 0,
      suno: 0,
      linked: 0,
      largeArt: 0
    };
    for (const it of items) {
      const f = it.status === 'ready' ? facts(it) : null;
      if (!f) continue;
      s.ready++;
      if (HAS_ART.includes(f.art)) s.withArt++;
      else if (f.art === 'off') s.artLeftOut++;
      else if (f.art === 'none') s.withoutArt++;
      if (f.lyrics) s.withLyrics++;
      if (f.suno) s.suno++;
      if (f.audioId) s.linked++;
      if (shrinkable(it)) s.largeArt++;
    }
    return s;
  }

  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many || one + 's');
  function summaryText(s) {
    if (!s.ready) return '';
    const parts = [plural(s.ready, 'song')];
    parts.push(s.withArt + ' with artwork');
    if (s.withoutArt) parts.push(s.withoutArt + ' without');
    if (s.artLeftOut) parts.push(s.artLeftOut + ' with file art left out');
    parts.push(s.withLyrics + ' with lyrics');
    if (s.suno) parts.push(s.suno + ' from Suno');
    if (s.linked) parts.push(s.linked + ' linked to an inscription');
    return parts.join(' · ');
  }

  const requeue = (it) => {
    it.status = 'queued';
    it.err = null;
  };

  // Details that make sense to set once for a whole release. Everything else is per song.
  const SHARED_KEYS = [
    'artist',
    'album',
    'featuredArtists',
    'genre',
    'releaseDate',
    'language',
    'songwriters',
    'performers',
    'producer',
    'engineer',
    'rightsHolder',
    'license'
  ];

  // Set the same details on many songs. Boxes left empty change nothing. With onlyEmpty a song keeps
  // anything it already has.
  function applyShared(items, values, onlyEmpty) {
    const wanted = SHARED_KEYS.filter((k) => text(values && values[k]));
    let changed = 0;
    for (const it of items) {
      const patch = {};
      for (const key of wanted) {
        const current = text(
          (it.overrides && it.overrides[key]) !== undefined
            ? it.overrides[key]
            : it.info && it.info[key]
        );
        if (onlyEmpty && current) continue;
        patch[key] = text(values[key]);
      }
      if (!Object.keys(patch).length) continue;
      it.overrides = { ...it.overrides, ...patch };
      requeue(it);
      changed++;
    }
    return changed;
  }

  // A title or artist typed into one song's row. Returns true when it differs from what the song has.
  function applyQuick(it, drafts) {
    const patch = {};
    for (const key of ['title', 'artist']) {
      if (!drafts || drafts[key] === undefined) continue;
      const next = text(drafts[key]);
      const current = text(
        it.overrides && it.overrides[key] !== undefined
          ? it.overrides[key]
          : it.info && it.info[key]
      );
      if (next !== current) patch[key] = next;
    }
    if (!Object.keys(patch).length) return false;
    it.overrides = { ...it.overrides, ...patch };
    requeue(it);
    return true;
  }

  // Put one image on many songs. art is either { coverB64, coverMime } (the image itself) or
  // { coverInscription } (a verified link). With onlyEmpty a song that already shows artwork keeps it.
  // Audio-only songs cannot show artwork and songs not built yet cannot be judged; both are counted.
  function applyArt(items, art, onlyEmpty) {
    const out = { changed: 0, audioOnly: 0, skipped: 0 };
    const link = !!(art && art.coverInscription);
    if (!art || (!link && !art.coverB64)) return out;
    for (const it of items) {
      const f = it.status === 'ready' ? facts(it) : null;
      if (!f) {
        out.skipped++;
        continue;
      }
      if (f.art === 'n/a') {
        out.audioOnly++;
        continue;
      }
      if (onlyEmpty && HAS_ART.includes(f.art)) continue;
      const o = { ...it.overrides, format: 'artwork' };
      if (link) {
        o.coverInscription = art.coverInscription;
        delete o.coverB64;
        delete o.coverMime;
      } else {
        o.coverB64 = art.coverB64;
        o.coverMime = art.coverMime || 'image/png';
        delete o.coverInscription;
      }
      it.overrides = o;
      requeue(it);
      out.changed++;
    }
    return out;
  }

  // 'off' leaves existing artwork out of every song that has some; 'on' brings back art that a song
  // has in its file but is not using. Songs with no art at all are left alone.
  function setArt(items, mode) {
    let changed = 0;
    for (const it of items) {
      const f = it.status === 'ready' ? facts(it) : null;
      if (!f) continue;
      if (mode === 'off' && HAS_ART.includes(f.art))
        it.overrides = { ...it.overrides, format: 'details' };
      else if (mode === 'on' && f.art === 'off')
        it.overrides = { ...it.overrides, format: 'artwork' };
      else continue;
      requeue(it);
      changed++;
    }
    return changed;
  }

  const leadingNumber = (name) => {
    const m = /^\s*(\d{1,3})(?=[\s._)-]|$)/.exec(String(name || ''));
    return m ? Number(m[1]) : 0;
  };
  // Track numbers follow the file names when every name starts with its own number ("01 - Intro"),
  // otherwise the order of the list. Returns which rule was used.
  function numberTracks(items) {
    const nums = items.map((it) => leadingNumber((it.origFile || it.file || {}).name));
    const fromNames =
      nums.length > 0 && nums.every((n) => n > 0) && new Set(nums).size === nums.length;
    items.forEach((it, i) => {
      it.overrides = { ...it.overrides, trackNumber: String(fromNames ? nums[i] : i + 1) };
      requeue(it);
    });
    return fromNames ? 'filename' : 'order';
  }

  // Dependencies for one song: the ones shared by the whole batch plus any inscription it links to.
  const itemDeps = (shared, info) => [
    ...new Set([...(shared || []).map(String), ...((info && info.linkedIds) || []).map(String)])
  ];

  // The first linked inscription the user has neither been shown to hold nor confirmed, or ''.
  // A source whose check is missing counts as unconfirmed: this fails closed.
  function linkedBlocking(items, refInfo) {
    for (const it of items) {
      if (it.status !== 'ready' || !it.info) continue;
      for (const id of it.info.linkedIds || []) {
        const i = refInfo && refInfo[id];
        if (!i || (i.ownerState !== 'yours' && !i.confirmed))
          return 'Confirm you may link inscription #' + id;
      }
    }
    return '';
  }

  function move(items, index, delta) {
    const to = index + delta;
    if (index < 0 || index >= items.length || to < 0 || to >= items.length) return false;
    const [item] = items.splice(index, 1);
    items.splice(to, 0, item);
    return true;
  }

  window.XtrataMusicBatch = {
    LARGE_ART_BYTES,
    facts,
    chips,
    shrinkable,
    summary,
    summaryText,
    SHARED_KEYS,
    applyShared,
    applyQuick,
    applyArt,
    setArt,
    leadingNumber,
    numberTracks,
    itemDeps,
    linkedBlocking,
    move
  };
})();
