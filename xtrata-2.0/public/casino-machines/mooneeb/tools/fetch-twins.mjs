// Fetch a sample of real LEO Cats Forever Twins for the Moonshot starfield and bundle them in art/twins.
// Reads the helper's events through xtrata.xyz's Hiro proxy and each twin's art from its Xtrata inscription.
// Usage: node tools/fetch-twins.mjs [count=18]
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COUNT = Number(process.argv[2] || 18);
const ORIGIN = 'https://xtrata.xyz';
const REGISTRY = `${ORIGIN}/forever-twins/data/registry.v2.json`;

const getJSON = async url => { const r = await fetch(url); if (!r.ok) throw Error(`${r.status} ${url}`); return r.json(); };
function parseEvents(json) {
  const out = []; let count = 0;
  for (const e of json.results || []) {
    const repr = e.contract_log?.value?.repr || '';
    const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr);
    if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1], tx: e.tx_id });
    if (n) count = Math.max(count, Number(n[1]));
  }
  return { list: out, count, rows: (json.results || []).length };
}

const reg = await getJSON(REGISTRY);
const col = reg.collections.find(c => c.key === 'leo-cats');
const core = reg.core.contract; const [addr, name] = core.split('.');
const found = new Map(); let inscribed = 0;
for (let offset = 0; offset < 400 && found.size < COUNT * 3; offset += 50) {
  const page = parseEvents(await getJSON(`${ORIGIN}/hiro/mainnet/extended/v1/contract/${col.helper}/events?limit=50&offset=${offset}`));
  page.list.forEach(t => found.set(t.tokenId, t)); inscribed = Math.max(inscribed, page.count);
  if (page.rows < 50) break;
}
const pick = [...found.values()].sort(() => Math.random() - .5);
await mkdir(join(ROOT, 'art/twins'), { recursive: true });
const twins = [];
for (const t of pick) {
  if (twins.length >= COUNT) break;
  const url = `${ORIGIN}/inscription/mainnet/${addr}/${name}/${t.xtrataId}`;
  try {
    const r = await fetch(url); if (!r.ok) throw Error(r.status);
    const type = (r.headers.get('content-type') || '').split(';')[0];
    if (!/^image\//.test(type)) throw Error('not an image: ' + type);
    const buf = Buffer.from(await r.arrayBuffer());
    const ext = type.split('/')[1].replace('svg+xml', 'svg').replace('jpeg', 'jpg');
    const file = `art/twins/leo-cat-${t.tokenId}.${ext}`;
    await writeFile(join(ROOT, file), buf);
    twins.push({ key: 'leo-cats', tokenId: t.tokenId, xtrataId: t.xtrataId, file, type, bytes: buf.length, source: url, helper: col.helper, sourceContract: col.source, swapTx: t.tx });
    console.log('ok', t.tokenId, t.xtrataId, type, buf.length);
  } catch (e) { console.log('skip', t.tokenId, e.message); }
}
await writeFile(join(ROOT, 'art/twins/twins.json'), JSON.stringify({ collection: 'leo-cats', name: col.name, helper: col.helper, source: col.source, accent: col.theme?.accent, core, readAt: new Date().toISOString(), helperEventsSeen: found.size, inscribedCount: inscribed || null, twins }, null, 2));
console.log(`bundled ${twins.length} of ${found.size} twins seen`);
