import { HIDDEN_TRACK_MARKER } from '../song-sources.mjs';

const EBML = [0x1a, 0x45, 0xdf, 0xa3];
export const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));
/** A minimal WebM head: the EBML magic, a little padding, then one CodecID element (0x86) per codec. */
export const webm = (...codecs: string[]) => new Uint8Array([...EBML, 0x9f, 0x42, 0x86, 0x81, 0x01, ...codecs.flatMap((c) => [0x86, 0x80 | c.length, ...ascii(c)]), 0x00, 0x00]);
/** [visible file][hidden file][marker][u64 big-endian length of the hidden file] */
export const withHiddenTrack = (visible: Uint8Array, hidden: Uint8Array) => {
  const len = new Uint8Array(8); new DataView(len.buffer).setBigUint64(0, BigInt(hidden.length));
  return new Uint8Array([...visible, ...hidden, ...ascii(HIDDEN_TRACK_MARKER), ...len]);
};
/** Answer a fetch for these bytes the way the content route does: whole, or a 206 for a Range. */
export const served = (bytes: Uint8Array, type: string, range?: string | null) => {
  if (!range) return new Response(bytes, { headers: { 'content-type': type, 'content-length': String(bytes.length) } });
  const suffix = /^bytes=-(\d+)$/.exec(range), span = /^bytes=(\d+)-(\d*)$/.exec(range);
  const start = suffix ? Math.max(0, bytes.length - Number(suffix[1])) : Number(span![1]);
  const end = suffix ? bytes.length - 1 : span![2] ? Math.min(bytes.length - 1, Number(span![2])) : bytes.length - 1;
  return new Response(bytes.slice(start, end + 1), { status: 206, headers: { 'content-type': type, 'content-range': `bytes ${start}-${end}/${bytes.length}` } });
};
