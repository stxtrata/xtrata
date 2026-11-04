// Genesis 21: fetch the real token art for the six collections that could not be fetched from the build sandbox
// (Arties, SatoSHE, Satoshibles, Stacks Punks, This Is #1, Boomboxes).
//
//   node tools/fetch-art.mjs [slug|all]        (Node 18 or newer; no packages needed)
//
// It reads art/manifests/<slug>.json (real token ids and token URIs verified on chain), resolves each token's image (token URI JSON -> image,
// IPFS gateways tried in turn), saves the ORIGINAL bytes unchanged to art/nfts/<slug>/<tokenId>.<ext>, and records every source URL, size and
// sha256 in art/sources.json under "fetched". It never invents, redraws or resizes art. A token it cannot fetch is listed as FAIL and left out.
// The game itself also resolves these images live in the browser; this script is only for bundling them into a later build of the pack.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'art');
const GATEWAYS = (process.env.IPFS_GATEWAYS || 'https://ipfs.io/ipfs/,https://cloudflare-ipfs.com/ipfs/,https://dweb.link/ipfs/').split(',');
const asUrls = u => !u ? [] : /^ipfs:\/\//.test(u) ? GATEWAYS.map(g => g + u.replace(/^ipfs:\/\/(ipfs\/)?/, '')) : /^ar:\/\//.test(u) ? ['https://arweave.net/' + u.slice(5)] : [u];
const get = async (u, asJson) => { try { const r = await fetch(u, { signal: AbortSignal.timeout(25000) }); if (!r.ok) return null; return asJson ? await r.json() : Buffer.from(await r.arrayBuffer()); } catch { return null; } };
async function firstOk(urls, asJson) { for (const u of urls) { const v = await get(u, asJson); if (v && (asJson || v.length > 200)) return { u, v }; } return null; }
const ext = b => b.slice(0, 4).toString('hex') === '89504e47' ? 'png' : b.slice(0, 3).toString('hex') === 'ffd8ff' ? 'jpg' : b.slice(0, 3).toString() === 'GIF' ? 'gif' : b.slice(0, 4).toString() === 'RIFF' ? 'webp' : b.slice(0, 5).toString() === '<?xml' || b.slice(0, 4).toString() === '<svg' ? 'svg' : 'bin';
const manifestDir = path.join(ROOT, 'manifests'), want = process.argv[2] && process.argv[2] !== 'all' ? [process.argv[2]] : fs.readdirSync(manifestDir).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));
const srcPath = path.join(ROOT, 'sources.json'), sources = JSON.parse(fs.readFileSync(srcPath, 'utf8')); sources.fetched = (sources.fetched || []).filter(f => !want.includes(f.slug));
for (const slug of want) {
  const m = JSON.parse(fs.readFileSync(path.join(manifestDir, slug + '.json'), 'utf8')); fs.mkdirSync(path.join(ROOT, 'nfts', slug), { recursive: true });
  for (const t of m.candidateTokens || []) {
    let img = await firstOk([...asUrls(t.imageUrl), ...asUrls(t.hiroCachedImage)], false), meta = null;
    if (!img && t.tokenUri) { meta = await firstOk(asUrls(t.tokenUri), true); const iu = meta && (meta.v.image || meta.v.image_url || meta.v.imageUrl); if (iu) img = await firstOk(asUrls(iu), false); }
    if (!img) { console.log(slug, t.tokenId, 'FAIL'); continue; }
    const file = `${slug}/${t.tokenId}.${ext(img.v)}`; fs.writeFileSync(path.join(ROOT, 'nfts', file), img.v);
    sources.fetched.push({ slug, collection: m.collection, contract: m.contract, tokenId: t.tokenId, file: 'nfts/' + file, sourceUrl: img.u, tokenUri: t.tokenUri || null, bytes: img.v.length, sha256: crypto.createHash('sha256').update(img.v).digest('hex'), fetchedAt: new Date().toISOString() });
    console.log(slug, t.tokenId, 'ok', img.v.length, 'bytes from', new URL(img.u).host);
  }
}
fs.writeFileSync(srcPath, JSON.stringify(sources, null, 1)); console.log('sources.json updated. Rebuild the pack (src/README.md) to bundle these images.');
