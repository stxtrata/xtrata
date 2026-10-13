// Makes a song's Explorer thumbnail the first time anyone opens it, when the
// site has none yet. Songs made outside the Inscription Wizard (or before its
// post-mint ping existed) have no thumbnail, but the Explorer already holds the
// song player's HTML at that moment, so the cover can be read, shrunk and sent.
//
// Best effort and silent: any failure just leaves the tile as it was. The server
// (POST /thumb/<contract>/<id>) is the gate: it accepts a small WebP only for an
// indexed HTML token that has no ready thumbnail, and never replaces one.
import { MAX_COVER_BYTES, extractSongFromHtml } from '../../scripts/lib/song-cover.mjs';

const EDGE = 256;
const MAX_UPLOAD_BYTES = 40 * 1024;
const attempted = new Set();

const isHtmlMime = (mime) => String(mime ?? '').toLowerCase().startsWith('text/html');

/** URL of the inscription a song uses as artwork, on this site. */
export const coverUrlFor = (ref) => {
  if (!ref || !Number.isInteger(ref.tokenId)) return null;
  if (!ref.contractId) return `/inscription/${ref.tokenId}`;
  const q = new URLSearchParams({ contractId: ref.contractId, tokenId: String(ref.tokenId) });
  return `/runtime/content?${q.toString()}`;
};

/** Shrinks a picture to a small WebP in the browser. Returns { blob, w, h } or null. */
export const encodeWebp = async (blob) => {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  const out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.8));
  if (!out || out.type !== 'image/webp' || out.size > MAX_UPLOAD_BYTES) return null;
  return { blob: out, w, h };
};

/**
 * @param {object} args
 * @param {string} args.contractId   full contract id of the token
 * @param {string|number|bigint} args.tokenId
 * @param {Uint8Array} args.bytes     the inscription content
 * @param {string} [args.mimeType]
 * @param {boolean} args.hasThumb     true when the index already lists a thumbnail
 * @returns {Promise<'stored'|'skipped'|'failed'>}
 */
export const maybeUploadSongThumbnail = async ({
  contractId,
  tokenId,
  bytes,
  mimeType,
  hasThumb,
  fetchImpl = (...a) => fetch(...a),
  encode = encodeWebp
}) => {
  try {
    if (hasThumb || !contractId || !bytes?.length || !isHtmlMime(mimeType)) return 'skipped';
    const key = `${contractId}:${String(tokenId)}`;
    if (attempted.has(key)) return 'skipped';
    attempted.add(key);
    const song = extractSongFromHtml(new TextDecoder().decode(bytes));
    if (!song) return 'skipped';

    let source = song.cover ? new Blob([song.cover]) : null;
    if (!source) {
      const url = coverUrlFor(song.coverRef);
      if (!url) return 'skipped';
      const res = await fetchImpl(url);
      if (!res.ok) return 'failed';
      const blob = await res.blob();
      if (!String(blob.type).startsWith('image/') || blob.size > MAX_COVER_BYTES) return 'failed';
      source = blob;
    }
    const thumb = await encode(source);
    if (!thumb) return 'failed';
    const q = new URLSearchParams({
      title: song.title,
      artist: song.artist,
      w: String(thumb.w),
      h: String(thumb.h)
    });
    const res = await fetchImpl(
      `/thumb/${encodeURIComponent(contractId)}/${encodeURIComponent(String(tokenId))}?${q.toString()}`,
      { method: 'POST', headers: { 'content-type': 'image/webp' }, body: thumb.blob }
    );
    return res.status === 201 ? 'stored' : res.ok ? 'skipped' : 'failed';
  } catch {
    return 'failed';
  }
};
