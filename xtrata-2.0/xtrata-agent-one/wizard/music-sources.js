// Reference an existing audio or image inscription instead of embedding a copy of it.
//
// Phase 1 handles PLAIN files only: an audio inscription (or an audio-only WebM that was
// minted as video/webm) and a raster image inscription. The finished player points at
// https://xtrata.xyz/inscription/<id>, which is the exact shape the radio already follows
// (src/lib/radio/song-sources.mjs: linkedAudioId / linkedImageId). Nothing here executes or
// parses third-party markup; it fetches bytes, identifies them by their first bytes, and
// checks them against the hash the content route reports.
//
// A read that FAILED is never reported as "does not exist" (xtrata-2.0/CLAUDE.md): the
// result's `reason` separates 'not-found' from 'unavailable'.
(function () {
  'use strict';
  const MAX_BYTES = 33554432; // the contract's 32 MiB cap
  const CHUNK_SIZE = 16384; // protocol chunk size, see src/lib/chunking/hash.ts
  const HEAD_BYTES = 16384; // enough of a WebM to reach its track list
  const CANONICAL = 'https://xtrata.xyz';
  const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];
  // Must stay identical to the audio type check in music-player.js build(), which silently
  // falls back to audio/mpeg for anything else.
  const AUDIO_MIME_RE = /^audio\/[\w.+-]+(?:;\s*codecs=[\w-]+)?$/i;

  const parseId = (value) => {
    const text = String(value == null ? '' : value)
      .trim()
      .replace(/^#/, '');
    return /^[1-9]\d{0,8}$/.test(text) ? text : '';
  };
  const canonicalUrl = (id) => CANONICAL + '/inscription/' + id;

  const at = (head, i, s) =>
    head.length >= i + s.length && [...s].every((c, k) => head[i + k] === c.charCodeAt(0));
  const isEbml = (b) =>
    b.length >= 4 && b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3;

  // Matroska/WebM CodecIDs (element 0x86) in a file's first bytes, e.g. ['A_OPUS'].
  // Same rule as webmCodecs() in src/lib/radio/song-sources.mjs.
  function webmCodecs(head) {
    const out = [];
    if (!isEbml(head)) return out;
    for (let i = 4; i + 2 < head.length && out.length < 16; i++) {
      if (head[i] !== 0x86 || !(head[i + 1] & 0x80)) continue;
      const n = head[i + 1] & 0x7f;
      if (n < 3 || n > 32 || i + 2 + n > head.length) continue;
      const id = String.fromCharCode(...head.subarray(i + 2, i + 2 + n));
      if (/^[AVSB]_[A-Z0-9_/.]+$/.test(id)) out.push(id);
    }
    return out;
  }

  // The audio type of a file from its first bytes, or ''. A WebM that has a video track is
  // not a song file. Same signatures as audioMime() in src/lib/radio/song-sources.mjs.
  function sniffAudio(head) {
    if (!(head instanceof Uint8Array) || head.length < 4) return '';
    if (isEbml(head)) {
      const codecs = webmCodecs(head);
      const audioOnly =
        codecs.some((c) => c.startsWith('A_')) && !codecs.some((c) => c.startsWith('V_'));
      return audioOnly ? 'audio/webm' : '';
    }
    if (at(head, 0, 'OggS')) return 'audio/ogg';
    if (at(head, 0, 'fLaC')) return 'audio/flac';
    if (at(head, 0, 'RIFF') && at(head, 8, 'WAVE')) return 'audio/wav';
    if (at(head, 4, 'ftyp')) return 'audio/mp4';
    if (at(head, 0, 'ID3') || (head[0] === 0xff && (head[1] & 0xe0) === 0xe0)) return 'audio/mpeg';
    return '';
  }

  // Raster images only. SVG is code, so it is deliberately not recognised here.
  function sniffImage(head) {
    if (!(head instanceof Uint8Array) || head.length < 12) return '';
    if (head[0] === 0x89 && at(head, 1, 'PNG') && head[4] === 0x0d && head[5] === 0x0a)
      return 'image/png';
    if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'image/jpeg';
    if (at(head, 0, 'RIFF') && at(head, 8, 'WEBP')) return 'image/webp';
    if (at(head, 0, 'GIF87a') || at(head, 0, 'GIF89a')) return 'image/gif';
    if (at(head, 4, 'ftyp') && (at(head, 8, 'avif') || at(head, 8, 'avis'))) return 'image/avif';
    return '';
  }

  const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  const normHash = (value) =>
    String(value || '')
      .trim()
      .replace(/^0x/i, '')
      .replace(/^"|"$/g, '')
      .toLowerCase();

  // The protocol's running hash: for each 16 KiB chunk, sha256(previousHash || chunk), starting
  // from 32 zero bytes. Identical to computeExpectedHash() in src/lib/chunking/hash.ts.
  async function finalHashHex(bytes, subtle) {
    const digest = subtle || (typeof crypto !== 'undefined' && crypto.subtle);
    if (!digest) throw new Error('This browser cannot verify the inscription hash.');
    let running = new Uint8Array(32);
    for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
      const chunk = bytes.subarray(offset, Math.min(offset + CHUNK_SIZE, bytes.length));
      const buffer = new Uint8Array(32 + chunk.length);
      buffer.set(running, 0);
      buffer.set(chunk, 32);
      running = new Uint8Array(await digest.digest('SHA-256', buffer));
    }
    return toHex(running);
  }

  async function readCapped(response, max) {
    if (response.body && typeof response.body.getReader === 'function') {
      const reader = response.body.getReader();
      const parts = [];
      let total = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.length;
        if (total > max) {
          try {
            await reader.cancel();
          } catch (_e) {}
          return null;
        }
        parts.push(value);
      }
      const out = new Uint8Array(total);
      let offset = 0;
      for (const part of parts) {
        out.set(part, offset);
        offset += part.length;
      }
      return out;
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    return bytes.length > max ? null : bytes;
  }

  const fail = (reason, message) => ({ ok: false, reason, message });

  // kind: 'audio' | 'image'. opts: { base, fetch, subtle }. `base` is '' on xtrata.xyz itself
  // (same-origin reads) or the canonical origin anywhere else.
  async function inspect(kind, rawId, opts) {
    opts = opts || {};
    if (kind !== 'audio' && kind !== 'image') return fail('invalid-kind', 'Unknown source kind.');
    const id = parseId(rawId);
    if (!id) return fail('invalid-id', 'Enter the inscription number, for example 8.');
    const doFetch = opts.fetch || (typeof fetch === 'function' ? fetch.bind(globalThis) : null);
    if (!doFetch) return fail('unavailable', 'This browser cannot read inscriptions here.');
    const label = '#' + id;
    const url = (opts.base || '') + '/inscription/' + id;

    let response;
    try {
      response = await doFetch(url);
    } catch (_e) {
      return fail('unavailable', 'Could not check ' + label + ' right now. Try again in a moment.');
    }
    if (response.status === 404 || response.status === 410)
      return fail('not-found', 'No inscription ' + label + ' was found. Check the number.');
    if (!response.ok)
      return fail('unavailable', 'Could not check ' + label + ' right now. Try again in a moment.');

    const header = (name) => response.headers.get(name) || '';
    const network = header('x-xtrata-runtime-network');
    if (network && network !== 'mainnet')
      return fail(
        'wrong-network',
        label + ' is not a mainnet inscription, so a player cannot link to it.'
      );

    const declaredFull = header('content-type').trim();
    const declared = declaredFull.split(';')[0].trim().toLowerCase();
    const advertised = Number(
      header('x-xtrata-runtime-total-size') || header('content-length') || 0
    );
    if (advertised > MAX_BYTES)
      return fail('too-large', label + ' is larger than the 32 MiB an inscription can hold.');

    // Decide from the label first so a web page or video is never downloaded in full.
    if (declared === 'text/html' || declared === 'application/xhtml+xml')
      return fail(
        'wrong-type',
        label +
          ' is a web page or HTML player, not a plain ' +
          (kind === 'audio' ? 'audio file' : 'image') +
          '. This version links to plain files only.'
      );
    if (kind === 'audio') {
      if (!declared.startsWith('audio/') && declared !== 'video/webm')
        return fail(
          'wrong-type',
          label + ' is ' + (declared || 'an unknown type') + ', not an audio file.'
        );
    } else {
      if (declared === 'image/svg+xml')
        return fail(
          'wrong-type',
          label + ' is an SVG. Only PNG, JPEG, WebP, GIF or AVIF images can be linked.'
        );
      if (!IMAGE_TYPES.includes(declared))
        return fail(
          'wrong-type',
          label +
            ' is ' +
            (declared || 'an unknown type') +
            ', not a PNG, JPEG, WebP, GIF or AVIF image.'
        );
    }

    let bytes;
    try {
      bytes = await readCapped(response, MAX_BYTES);
    } catch (_e) {
      return fail('unavailable', 'Could not read ' + label + ' right now. Try again in a moment.');
    }
    if (bytes === null)
      return fail('too-large', label + ' is larger than the 32 MiB an inscription can hold.');
    if (!bytes.length) return fail('wrong-type', label + ' is empty.');

    const warnings = [];
    let mime;
    if (kind === 'audio') {
      const sniffed = sniffAudio(bytes.subarray(0, HEAD_BYTES));
      if (!sniffed) {
        return fail(
          'wrong-type',
          declared === 'video/webm'
            ? label + ' is a video, not a song. Only audio-only files can be linked.'
            : label + ' is labelled as audio but its bytes are not a recognised audio file.'
        );
      }
      if (declared === 'video/webm') {
        // Audio-only WebM minted as video/webm: a song file whatever its label says (the radio treats it the same way).
        const codecs = webmCodecs(bytes.subarray(0, HEAD_BYTES));
        const suffix = codecs.includes('A_OPUS')
          ? '; codecs=opus'
          : codecs.includes('A_VORBIS')
            ? '; codecs=vorbis'
            : '';
        mime = 'audio/webm' + suffix;
      } else {
        mime = AUDIO_MIME_RE.test(declaredFull) ? declaredFull : sniffed;
        const family = (m) =>
          /mpeg|mp3/.test(m)
            ? 'mpeg'
            : /wav/.test(m)
              ? 'wav'
              : m.replace(/^audio\/(x-)?/, '').split(';')[0];
        if (family(declared) !== family(sniffed))
          warnings.push(
            label +
              ' is labelled ' +
              declared +
              ' but looks like ' +
              sniffed +
              '. It should still play.'
          );
      }
    } else {
      const sniffed = sniffImage(bytes.subarray(0, HEAD_BYTES));
      if (sniffed !== declared)
        return fail(
          'wrong-type',
          label +
            ' is labelled ' +
            declared +
            ' but its bytes are ' +
            (sniffed || 'not a recognised image') +
            '.'
        );
      mime = declared;
    }

    let finalHash;
    try {
      finalHash = await finalHashHex(bytes, opts.subtle);
    } catch (_e) {
      return fail('unavailable', 'This browser cannot verify ' + label + ' right now.');
    }
    const claimed = normHash(header('x-xtrata-runtime-final-hash'));
    let hashChecked = false;
    if (claimed) {
      if (claimed !== finalHash)
        return fail(
          'mismatch',
          'The bytes served for ' +
            label +
            ' do not match its recorded hash, so it was not used. Try again, and tell us if it keeps happening.'
        );
      hashChecked = true;
    } else {
      warnings.push(
        'The hash for ' +
          label +
          ' could not be compared here; the file was identified from its contents only.'
      );
    }

    return {
      ok: true,
      kind,
      id,
      url: canonicalUrl(id),
      mime,
      bytes,
      size: bytes.length,
      finalHash,
      hashChecked,
      warnings
    };
  }

  const EXT = {
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/flac': 'flac',
    'audio/mp4': 'm4a',
    'audio/ogg': 'ogg',
    'audio/webm': 'weba',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif'
  };
  const fileName = (result) =>
    'inscription-' +
    result.id +
    '.' +
    (EXT[String(result.mime).split(';')[0].toLowerCase()] || 'bin');

  window.XtrataMusicSources = {
    MAX_BYTES,
    CANONICAL,
    parseId,
    canonicalUrl,
    sniffAudio,
    sniffImage,
    webmCodecs,
    finalHashHex,
    inspect,
    fileName
  };
})();
