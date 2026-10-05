// Resolve a source collection's token URI to its art bytes through public gateways.
// Ported from the original collection pages so the shared page behaves the same way.
// The art is only ever USED if its rolling hash equals the helper's finalised record.

export function resolveUriTemplate(uri, tokenId) {
  const id = String(tokenId ?? '').trim();
  let r = String(uri || '').trim().replace(/%7B/ig, '{').replace(/%7D/ig, '}');
  if (id) {
    r = r.replace(/\{id\}/ig, id).replace(/\{token_id\}/ig, id).replace(/\{tokenId\}/g, id)
      .replace(/\$TOKEN_ID\b/ig, id).replace(/\$TOKENID\b/ig, id).replace(/\$ID\b/ig, id)
      .replace(/%24TOKEN_ID\b/ig, id).replace(/%24TOKENID\b/ig, id).replace(/%24ID\b/ig, id);
  }
  r = r.replace(/^ipfs:\/\/ipfs\//i, 'ipfs://');
  try {
    const u = new URL(r);
    if (/^https?:$/i.test(u.protocol)) {
      while (/\/ipfs\/ipfs\//i.test(u.pathname)) u.pathname = u.pathname.replace(/\/ipfs\/ipfs\//i, '/ipfs/');
      return u.toString();
    }
  } catch { /* not an absolute URL */ }
  return r.replace(/\/ipfs\/ipfs\//i, '/ipfs/');
}

function ipfsPath(resolved) {
  if (/^ipfs:\/\//i.test(resolved)) return resolved.replace(/^ipfs:\/\//i, '').replace(/^ipfs\//i, '');
  try {
    const parts = new URL(resolved).pathname.split('/').filter(Boolean);
    const i = parts.findIndex((p) => p.toLowerCase() === 'ipfs');
    if (i < 0 || !parts[i + 1]) return '';
    let s = i + 1;
    if ((parts[s] || '').toLowerCase() === 'ipfs') s += 1;
    return parts.slice(s).join('/');
  } catch { return ''; }
}

export function uriCandidates(uri, tokenId) {
  const resolved = resolveUriTemplate(uri, tokenId);
  const out = [];
  if (/^https?:\/\//i.test(resolved)) out.push(resolved);
  if (/^ar:\/\//i.test(resolved)) out.push(`https://arweave.net/${resolved.replace(/^ar:\/\//i, '')}`);
  const p = ipfsPath(resolved);
  if (p) out.push(`https://dweb.link/ipfs/${p}`, `https://ipfs.io/ipfs/${p}`, `https://w3s.link/ipfs/${p}`);
  return [...new Set(out.filter(Boolean).map((c) => encodeURI(c)))];
}

export function imageFrom(meta) {
  if (!meta || typeof meta !== 'object') return null;
  const c = [meta.image, meta.image_url, meta.imageUrl, meta.image_uri, meta.imageURI, meta.imageUri,
    meta.raw_image, meta.rawImage, meta.properties && meta.properties.image, meta.media && meta.media.uri,
    meta.properties && meta.properties.files && meta.properties.files[0] && meta.properties.files[0].uri];
  return c.find((v) => typeof v === 'string' && v.trim()) || null;
}

async function firstOk(candidates, mode, fetchFn, timeoutMs = 10000) {
  let last = null;
  for (const url of candidates) {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), timeoutMs);
      const res = await fetchFn(url, { cache: 'no-store', signal: ctl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (mode === 'bytes') return { url, bytes: new Uint8Array(await res.arrayBuffer()), contentType: res.headers.get('content-type') || '' };
      return { url, json: JSON.parse(await res.text()) };
    } catch (e) { last = e; }
  }
  throw last || new Error('No usable gateway URL');
}

/** token URI -> metadata JSON -> image -> bytes. Returns { bytes, imageUrl, metaUrl, contentType }. */
export async function fetchArt(tokenUri, tokenId, fetchFn = globalThis.fetch) {
  const direct = uriCandidates(tokenUri, tokenId);
  if (!direct.length) throw new Error('The source returned a token URI this page cannot open');
  const meta = await firstOk(direct, 'json', fetchFn);
  const image = imageFrom(meta.json);
  if (!image) throw new Error('The token metadata has no image field');
  const img = await firstOk(uriCandidates(image, tokenId), 'bytes', fetchFn);
  return { bytes: img.bytes, imageUrl: img.url, metaUrl: meta.url, contentType: img.contentType };
}
