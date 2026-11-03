// Sends a song's small cover thumbnail to the site right after it is minted, so
// the Explorer tile shows a picture at once. Best effort: a failure here never
// affects the mint. The server only accepts it for an indexed song player that has
// no thumbnail yet. It is a convenience: `backfill-all-thumbnails.mjs --kinds html --force`
// can replace any of these with a version read from the chain.
(function () {
  const EDGE = 256;
  const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
  const sent = new Set();

  function scriptJson(doc, id) {
    const node = doc.getElementById(id);
    if (!node) return null;
    try {
      return JSON.parse(node.textContent || '');
    } catch (_e) {
      return null;
    }
  }

  // Title, artist and the cover <img> source of a built song player (HTML text).
  function readPlayer(html) {
    const doc = new DOMParser().parseFromString(String(html), 'text/html');
    const music = scriptJson(doc, 'xtrata-music-metadata');
    const manifest = scriptJson(doc, 'xtrataPlayerManifest');
    const meta = (music && music.assetType === 'song' ? music : null) || (manifest && manifest.metadata) || {};
    if (meta.assetType && meta.assetType !== 'song') return null;
    const imgs = Array.from(doc.querySelectorAll('img'));
    const img =
      doc.getElementById('coverArt') ||
      doc.querySelector('.cover-media img, #xtrataCover img') ||
      (imgs.length === 1 ? imgs[0] : null);
    const src = img ? img.getAttribute('src') || '' : '';
    return { title: String(meta.title || ''), artist: String(meta.artist || ''), src };
  }

  async function toWebp(src) {
    // data: URLs and the site's own /inscription links are the only sources used.
    const ok = /^data:image\//i.test(src) || /^https:\/\/xtrata\.xyz\/(inscription|i)\/\d+/i.test(src);
    if (!ok) return null;
    const blob = await (await fetch(src)).blob();
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(1, EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
    const out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.8));
    if (!out || out.type !== 'image/webp' || out.size > 40 * 1024) return null;
    return { blob: out, w, h };
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // The token may not be in the site's index for a few seconds after the mint
  // (HTTP 409), so this retries for about two minutes.
  async function postSongThumbnail(core, tokenId, html) {
    try {
      const key = core + ':' + tokenId;
      if (sent.has(key)) return false;
      sent.add(key);
      if (!/^https?:$/.test(location.protocol)) return false;
      const song = readPlayer(html);
      if (!song || !song.src) return false;
      const thumb = await toWebp(song.src);
      if (!thumb) return false;
      const contract = DEPLOYER + '.' + String(core || 'xtrata-v3-2-3');
      const q = new URLSearchParams({ title: song.title, artist: song.artist, w: String(thumb.w), h: String(thumb.h) });
      const url = '/thumb/' + contract + '/' + encodeURIComponent(String(tokenId)) + '?' + q.toString();
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'image/webp' }, body: thumb.blob });
        if (res.status !== 409) return res.ok;
        await wait(10000);
      }
    } catch (_e) {
      // Never let a thumbnail problem reach the mint flow.
    }
    return false;
  }

  window.XtrataThumb = { postSongThumbnail, readPlayer };
})();
