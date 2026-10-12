// Shared reader for Xtrata Music song player files (the single-file HTML made by
// the song templates). Plain JS with no dependencies so it runs both in Node
// scripts and in Cloudflare Pages Functions. Nothing is run or fetched: the file
// is only read as text.

export const MAX_COVER_BYTES = 15 * 1024 * 1024;

const decodeBase64 = (b64) => {
  const clean = b64.replace(/\s+/g, '');
  if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(clean, 'base64'));
  const bin = atob(clean);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
};

/**
 * Song details from a song player file. Two templates exist: the original one
 * keeps them in a #xtrata-music-metadata script, the "opus player" keeps them
 * in the metadata of its #xtrataPlayerManifest script. Returns null for anything
 * that does not declare itself a song.
 */
export const readSongMetadata = (source) => {
  const script = (id) =>
    new RegExp(`<script\\b[^>]*\\bid=["']${id}["'][^>]*>([\\s\\S]*?)<\\/script>`, 'i').exec(source)?.[1] ?? null;
  const parse = (text) => {
    try {
      return text === null ? null : JSON.parse(text);
    } catch {
      return null;
    }
  };
  const music = parse(script('xtrata-music-metadata'));
  if (music && music.schema === 'xtrata-music' && music.assetType === 'song') return music;
  const manifest = parse(script('xtrataPlayerManifest'));
  const meta = manifest?.metadata ?? manifest?.template?.metadata ?? null;
  if (meta && typeof meta === 'object' && meta.assetType === 'song') return meta;
  return null;
};

/**
 * The inscription a song uses as its artwork when the picture is referenced
 * rather than embedded: { tokenId, contractId } (contractId null when the link
 * uses the site's default contract), or null.
 */
export const findCoverReference = (source) => {
  for (const tag of String(source).matchAll(/<img\b[^>]*>/gi)) {
    const src = /\bsrc=["']([^"']+)["']/i.exec(tag[0])?.[1];
    if (!src || src.startsWith('data:')) continue;
    const short = /^https:\/\/xtrata\.xyz\/(?:inscription|i)\/(\d{1,10})(?:[/?#]|$)/i.exec(src);
    if (short) return { tokenId: Number(short[1]), contractId: null };
    try {
      const url = new URL(src.replace(/&amp;/g, '&'));
      if (url.origin === 'https://xtrata.xyz' && url.pathname === '/runtime/content') {
        const id = url.searchParams.get('tokenId');
        const contractId = url.searchParams.get('contractId');
        if (id && /^\d{1,10}$/.test(id)) return { tokenId: Number(id), contractId: contractId || null };
      }
    } catch {
      // not a URL we understand
    }
  }
  return null;
};

/**
 * Reads an Xtrata Music song player (the single-file HTML made by the song
 * templates). Returns { title, artist, cover } where cover is the embedded
 * picture bytes or null, or null when the file is not a song player. Nothing is
 * run or fetched: the file is only read as text.
 */
export const extractSongFromHtml = (html) => {
  const source = String(html);
  const data = readSongMetadata(source);
  if (!data) return null;
  const title = typeof data.title === 'string' ? data.title : '';
  const artist = typeof data.artist === 'string' ? data.artist : '';
  // The cover is the picture tagged coverArt; otherwise the one inside the
  // player's cover frame; otherwise the page's only embedded picture.
  const pictures = [];
  for (const tag of source.matchAll(/<img\b[^>]*>/gi)) {
    const src = /\bsrc=["']data:image\/(?:png|jpe?g|webp|gif);base64,([A-Za-z0-9+/=\s]+)["']/i.exec(tag[0]);
    if (!src) continue;
    pictures.push({
      tagged: /\bid=["']coverArt["']/i.test(tag[0]),
      framed: /cover-media|xtrataCover/i.test(source.slice(Math.max(0, tag.index - 300), tag.index)),
      data: src[1]
    });
  }
  const chosen =
    pictures.find((p) => p.tagged) ?? pictures.find((p) => p.framed) ?? (pictures.length === 1 ? pictures[0] : null);
  let cover = null;
  if (chosen) {
    const bytes = decodeBase64(chosen.data);
    if (bytes.length > 0 && bytes.length <= MAX_COVER_BYTES) cover = bytes;
  }
  // Artwork that points at an existing inscription costs the song no bytes, so
  // there is nothing embedded: report which inscription it is instead.
  const coverRef = cover ? null : findCoverReference(source);
  return { title, artist, cover, coverRef };
};

