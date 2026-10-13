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

// Every step is logged so the process can be followed in the browser console.
// Filter the console by "song-thumb".
const log = (step, detail = {}) => {
  try {
    console.info(`[song-thumb] ${step}`, detail);
  } catch {
    // no console
  }
};

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
  onStored,
  fetchImpl = (...a) => fetch(...a),
  encode = encodeWebp
}) => {
  const id = String(tokenId);
  try {
    log('check', { tokenId: id, hasThumb: Boolean(hasThumb), mimeType, bytes: bytes?.length ?? 0, contractId });
    if (hasThumb) return (log('skip: index already lists a thumbnail', { tokenId: id }), 'skipped');
    if (!contractId) return (log('skip: no contract id', { tokenId: id }), 'skipped');
    if (!bytes?.length) return (log('skip: no content bytes', { tokenId: id }), 'skipped');
    if (!isHtmlMime(mimeType)) return (log('skip: not HTML', { tokenId: id, mimeType }), 'skipped');
    const key = `${contractId}:${id}`;
    if (attempted.has(key)) return (log('skip: already tried in this page', { tokenId: id }), 'skipped');
    attempted.add(key);
    const song = extractSongFromHtml(new TextDecoder().decode(bytes));
    if (!song) return (log('skip: not a song player (no song metadata found)', { tokenId: id }), 'skipped');
    log('song found', {
      tokenId: id,
      title: song.title,
      artist: song.artist,
      embeddedCoverBytes: song.cover ? song.cover.length : 0,
      coverRef: song.coverRef
    });

    let source = song.cover ? new Blob([song.cover]) : null;
    if (!source) {
      const url = coverUrlFor(song.coverRef);
      if (!url) return (log('skip: song has no embedded cover and no cover reference', { tokenId: id }), 'skipped');
      log('fetching artwork inscription', { tokenId: id, url });
      const res = await fetchImpl(url);
      if (!res.ok) return (log('fail: artwork fetch', { tokenId: id, status: res.status }), 'failed');
      const blob = await res.blob();
      if (!String(blob.type).startsWith('image/') || blob.size > MAX_COVER_BYTES) {
        return (log('fail: artwork is not a usable picture', { tokenId: id, type: blob.type, size: blob.size }), 'failed');
      }
      source = blob;
    }
    const thumb = await encode(source);
    if (!thumb) return (log('fail: could not make a small WebP (too big or unsupported)', { tokenId: id }), 'failed');
    log('thumbnail made', { tokenId: id, bytes: thumb.blob.size, w: thumb.w, h: thumb.h });
    const q = new URLSearchParams({
      title: song.title,
      artist: song.artist,
      w: String(thumb.w),
      h: String(thumb.h)
    });
    const res = await fetchImpl(
      `/thumb/${encodeURIComponent(contractId)}/${encodeURIComponent(id)}?${q.toString()}`,
      { method: 'POST', headers: { 'content-type': 'image/webp' }, body: thumb.blob }
    );
    let reply = null;
    try {
      reply = await res.clone().json();
    } catch {
      // body not JSON
    }
    log('server replied', { tokenId: id, status: res.status, reply });
    if (res.status === 201) {
      if (typeof onStored === 'function') onStored(reply?.etag ?? null, { title: song.title, artist: song.artist });
      return 'stored';
    }
    return res.ok ? 'skipped' : 'failed';
  } catch (error) {
    log('fail: error', { tokenId: id, error: String(error?.message ?? error) });
    return 'failed';
  }
};
