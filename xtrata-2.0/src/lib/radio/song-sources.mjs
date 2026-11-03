// Where a song can live in an inscription, beyond the two classic shapes (a plain audio file, or an HTML player
// with its audio embedded as data:audio). Shared by the radio (to play them) and the server (to list them), so the
// station, the catalogue and the album maker agree on what a song is. Pure functions: bytes and strings in, answers out.
//
//   1. Hidden track: any file (usually a video) with an audio file appended, then the marker and the hidden file's
//      length as an 8-byte big-endian number:  [visible file][hidden audio][XTRATA-HIDDEN-TRACK-v1][u64 length]
//   2. Audio-only WebM minted as video/webm: every track is audio, so it is a song file whatever its label says.
//   3. Linked audio: an HTML player whose <source>/<audio> points at another inscription (/inscription/<id>).

export const HIDDEN_TRACK_MARKER = 'XTRATA-HIDDEN-TRACK-v1';
export const HIDDEN_TRAILER_BYTES = HIDDEN_TRACK_MARKER.length + 8;
/** Enough of a WebM to reach its track list (CodecIDs sit in the first few hundred bytes in practice). */
export const MEDIA_HEAD_BYTES = 16384;

const isBytes = (b) => b instanceof Uint8Array;
const isEbml = (b) => isBytes(b) && b.length >= 4 && b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3;

/**
 * The hidden track's byte range [start, end) in a file of `total` bytes, from the file's last bytes (at least
 * HIDDEN_TRAILER_BYTES of them), or null when the file carries none.
 */
export function hiddenTrackRange(tail, total) {
  if (!isBytes(tail) || tail.length < HIDDEN_TRAILER_BYTES || !Number.isSafeInteger(total) || total < tail.length) return null;
  const t = tail.subarray(tail.length - HIDDEN_TRAILER_BYTES);
  for (let i = 0; i < HIDDEN_TRACK_MARKER.length; i++) if (t[i] !== HIDDEN_TRACK_MARKER.charCodeAt(i)) return null;
  let length = 0;
  for (let i = HIDDEN_TRACK_MARKER.length; i < HIDDEN_TRAILER_BYTES; i++) length = length * 256 + t[i];
  const end = total - HIDDEN_TRAILER_BYTES;
  if (!Number.isSafeInteger(length) || length < 1 || length > end) return null;
  return { start: end - length, end };
}

/** The audio type of a file from its first bytes, or '' when it is not an audio file the radio knows. */
export function audioMime(head) {
  if (!isBytes(head) || head.length < 4) return '';
  const at = (i, s) => head.length >= i + s.length && [...s].every((c, k) => head[i + k] === c.charCodeAt(0));
  if (isEbml(head)) return 'audio/webm';
  if (at(0, 'OggS')) return 'audio/ogg';
  if (at(0, 'fLaC')) return 'audio/flac';
  if (at(0, 'RIFF') && at(8, 'WAVE')) return 'audio/wav';
  if (at(4, 'ftyp')) return 'audio/mp4';
  if (at(0, 'ID3') || (head[0] === 0xff && (head[1] & 0xe0) === 0xe0)) return 'audio/mpeg';
  return '';
}

/** The Matroska/WebM CodecIDs (element 0x86) found in a file's first bytes, e.g. ['V_VP9', 'A_OPUS']. */
export function webmCodecs(head) {
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

/** A WebM whose tracks are all audio: a song file, even when it was minted as video/webm. */
export function webmAudioOnly(head) {
  const codecs = webmCodecs(head);
  return codecs.some((c) => c.startsWith('A_')) && !codecs.some((c) => c.startsWith('V_'));
}

const SELF = '(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?';
const linked = (tags, html) => {
  if (typeof html !== 'string') return null;
  const m = html.match(new RegExp(`<(?:${tags})\\b[^>]*\\bsrc=["']${SELF}\\/inscription\\/(\\d{1,9})["']`, 'i'));
  return m ? Number(m[1]) : null;
};
/** An HTML player whose audio is another inscription: that inscription's id, or null. */
export const linkedAudioId = (html) => linked('source|audio', html);
/** The image an HTML player links to (its cover), or null. */
export const linkedImageId = (html) => linked('img', html);
