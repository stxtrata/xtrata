#!/usr/bin/env node
/* Proof of Free — recursive collection builder & verifier.
 *
 * usage: node scripts/build-collection.mjs [engineUrl] [--engine-id N]
 *
 *   node scripts/build-collection.mjs
 *     -> wrappers carry the __ENGINE_URL__ placeholder (not inscribable yet)
 *
 *   node scripts/build-collection.mjs https://xtrata.xyz/i/2839 --engine-id 2839
 *     -> inscription-ready wrappers, gallery and manifest
 *
 * A root-relative path also works and is gateway-portable, because the runtime
 * injects <base href="null"> which resolves to the serving origin:
 *     node scripts/build-collection.mjs /i/2839 --engine-id 2839
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from '../packages/collection-genome/genome.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const idFlag = args.indexOf('--engine-id');
const engineId = idFlag === -1 ? 0 : Number(args[idFlag + 1]) || 0;
const engineUrl = args.find(a => !a.startsWith('--') && a !== String(engineId)) || '__ENGINE_URL__';

const ENGINE_FILE = 'proof-of-free-recursive-engine-v3.html';
const CHUNK_SIZE = 16384;
const sha256 = data => createHash('sha256').update(data).digest('hex');

/* The contract verifies an incremental chain, not a flat digest:
 * running = sha256(running || chunk), starting from 32 zero bytes. */
function chainHash(buf) {
  let running = Buffer.alloc(32);
  for (let i = 0; i < buf.length; i += CHUNK_SIZE) {
    running = createHash('sha256').update(Buffer.concat([running, buf.subarray(i, i + CHUNK_SIZE)])).digest();
  }
  return running.toString('hex');
}

/* ---- Pass 1: verify the engine artifact has not drifted from the genome ---- */
const enginePath = join(rootDir, 'artifacts', ENGINE_FILE);
const engineBuf = readFileSync(enginePath);
const engineSrc = engineBuf.toString('utf8');

function extract(name) {
  const m = engineSrc.match(new RegExp(`const ${name}=(\\[.*?\\]);`, 's'));
  if (!m) throw new Error(`engine artifact does not declare ${name}`);
  return JSON.parse(m[1]);
}
const drift = [];
for (const [name, expected] of [['TITLES', G.TITLES], ['SLUGS', G.SLUGS], ['PALETTES', G.PALETTES], ['V', G.V], ['PORTALS', G.PORTALS]]) {
  const actual = extract(name);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) drift.push(name);
}
if (drift.length) {
  console.error(`FAIL — engine artifact and genome disagree on: ${drift.join(', ')}`);
  process.exit(1);
}
if (!engineSrc.includes(`const PARENT_INSCRIPTION=${G.PARENT_INSCRIPTION}`)) {
  console.error(`FAIL — engine artifact does not name ${G.PARENT_INSCRIPTION} as parent`);
  process.exit(1);
}

/* ---- Pass 2: wrappers ---- */
const wrapperDir = join(rootDir, 'wrappers');
mkdirSync(wrapperDir, { recursive: true });
for (const f of readdirSync(wrapperDir)) if (f.endsWith('.html')) rmSync(join(wrapperDir, f));

const wrapperHtml = (n, title) =>
`<!doctype html><meta name=viewport content="width=device-width,initial-scale=1"><style>*{margin:0}iframe{border:0;width:100vw;height:100vh;display:block}</style><iframe id=i allow=autoplay title="Proof of Free #${G.pad(n)} — ${title}"></iframe><script>i.src=(location.protocol=="file:"?"../artifacts/${ENGINE_FILE}":${JSON.stringify(engineUrl)})+"#${n}"<\/script>`;

const items = [];
const seen = new Set();
for (const m of G.allMeta()) {
  const html = wrapperHtml(m.number, m.title);
  const buf = Buffer.from(html, 'utf8');
  const hash = sha256(buf);
  if (seen.has(hash)) throw new Error(`duplicate wrapper hash at edition ${m.number}`);
  seen.add(hash);
  writeFileSync(join(wrapperDir, m.filename), buf);
  const item = {
    edition: m.number,
    filename: m.filename,
    mime: 'text/html',
    bytes: buf.length,
    sha256: hash,
    title: m.title,
    slug: m.slug,
    family: m.family,
    mode: m.mode,
    seed: m.seed,
    selector: `#${m.number}`,
    palette: `P${m.paletteIndex + 1}`,
    accent: m.accentIndex === 3 ? 'Blue' : 'Orange',
    drift: m.direction < 0 ? 'Counter' : 'With',
    lobes: m.lobes,
    blades: m.blades,
    rings: m.rings,
    baseHz: m.baseHz
  };
  if (m.portalShape) item.portalShape = m.portalShape;
  items.push(item);
}

/* ---- Pass 3: gallery ---- */
const gallery = rows => `<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Proof of Free — Recursive Collection</title><style>
*{box-sizing:border-box}html{background:#080808;color:#f5ede2;font:14px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}body{margin:0;min-height:100vh}header{padding:24px clamp(16px,4vw,48px);border-bottom:1px solid #333;display:flex;justify-content:space-between;gap:24px;align-items:end}h1{margin:0;font-size:clamp(22px,4vw,46px);text-transform:uppercase;letter-spacing:.08em}header p{margin:0;opacity:.65;text-align:right}main{display:grid;grid-template-columns:minmax(300px,1fr) minmax(280px,430px);gap:24px;padding:24px clamp(16px,4vw,48px)}.viewer{position:sticky;top:24px;align-self:start}iframe{width:min(100%,78vh);aspect-ratio:1;border:1px solid #333;display:block;background:#000}.info{display:flex;justify-content:space-between;margin-top:12px;gap:18px;text-transform:uppercase;letter-spacing:.08em}.info small{opacity:.55}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}button{appearance:none;background:#111;color:inherit;border:1px solid #333;text-align:left;padding:12px;min-height:72px;font:inherit;cursor:pointer}button:hover,button[aria-current=true]{border-color:#ff6a00;background:#18120e}button b{display:block;margin-bottom:5px}button span{opacity:.56;font-size:11px;text-transform:uppercase;letter-spacing:.09em}footer{padding:0 clamp(16px,4vw,48px) 32px;opacity:.5}@media(max-width:850px){main{grid-template-columns:1fr}.viewer{position:relative;top:0}iframe{width:100%}header{align-items:start;flex-direction:column}header p{text-align:left}}
</style></head><body><header><h1>Proof of Free<br>33 Openings</h1><p>ONE ENGINE · 33 SEEDS<br>ONE NAME · ONE WALLET · ONE PROOF</p></header><main><section class=viewer><iframe id=v allow=autoplay title="Proof of Free artwork"></iframe><div class=info><b id=t></b><small id=m></small></div></section><section class=grid id=g></section></main><footer>Engine: ${engineUrl === '__ENGINE_URL__' ? 'local artifact — not yet inscribed' : engineUrl}</footer><script>
// The gallery is a local review tool, so it must work before an engine URL
// exists. Until the collection is built against a real inscription, and when
// opened straight off disk, it reads the artifact from the repo instead.
const E=${JSON.stringify(engineUrl)},SRC=(E=="__ENGINE_URL__"||location.protocol=="file:")?"../../artifacts/${ENGINE_FILE}":E;
const A=${JSON.stringify(rows)},v=document.querySelector('#v'),g=document.querySelector('#g'),t=document.querySelector('#t'),m=document.querySelector('#m');
function show(n){const x=A[n-1];v.src=SRC+'#'+n;t.textContent=String(n).padStart(2,'0')+' / 33 · '+x.title;m.textContent=x.family+' · seed '+x.seed;[...g.children].forEach((b,i)=>b.setAttribute('aria-current',i===n-1))}
A.forEach(x=>{const b=document.createElement('button');b.innerHTML='<b>'+String(x.edition).padStart(2,'0')+' · '+x.title+'</b><span>'+x.family+' · '+x.mode+'</span>';b.onclick=()=>show(x.edition);g.append(b)});show(1);
</script></body></html>`;
mkdirSync(join(rootDir, 'apps/gallery'), { recursive: true });
writeFileSync(join(rootDir, 'apps/gallery/index.html'), gallery(items));

/* ---- Pass 4: manifest ---- */
// Skips items lacking the key — only Thresholds carry a portalShape.
const tally = key => items.reduce((a, it) => (it[key] === undefined ? a : (a[it[key]] = (a[it[key]] || 0) + 1, a)), {});
const manifest = {
  collectionId: G.COLLECTION_ID,
  engineVersion: G.ENGINE_VERSION,
  engineId,
  engineUrl,
  parentInscription: G.PARENT_INSCRIPTION,
  lineage: { relationship: 'child', of: G.PARENT_INSCRIPTION, runtime: 'self-contained' },
  engine: {
    filename: ENGINE_FILE,
    mime: 'text/html',
    bytes: engineBuf.length,
    chunks: Math.ceil(engineBuf.length / CHUNK_SIZE),
    sha256: sha256(engineBuf),
    expectedHash: `0x${chainHash(engineBuf)}`
  },
  releasedSupply: G.RELEASED_SUPPLY,
  engineCapacity: 'open',
  claim: { price: 0, walletLimit: 1, bnsRequired: true, rule: 'One name. One wallet. One proof.' },
  familyCounts: tally('family'),
  modeCounts: tally('mode'),
  paletteCounts: tally('palette'),
  accentCounts: tally('accent'),
  portalCounts: tally('portalShape'),
  items
};
mkdirSync(join(rootDir, 'manifests'), { recursive: true });
writeFileSync(join(rootDir, 'manifests/collection-v6.json'), JSON.stringify(manifest, null, 2) + '\n');

/* ---- Report ---- */
const wrapperBytes = items.reduce((a, it) => a + it.bytes, 0);
console.log(`genome <-> engine  OK (TITLES, SLUGS, PALETTES, V, PORTALS, parent ${G.PARENT_INSCRIPTION})`);
console.log(`engine             ${ENGINE_FILE}  ${engineBuf.length} bytes, ${manifest.engine.chunks} chunks`);
console.log(`expected-hash      ${manifest.engine.expectedHash}`);
console.log(`wrappers           ${items.length} files, ${wrapperBytes} bytes total, ${Math.round(wrapperBytes / items.length)} avg`);
console.log(`engine URL         ${engineUrl}${engineUrl === '__ENGINE_URL__' ? '   <-- placeholder, not inscribable yet' : ''}`);
if (engineUrl === '__ENGINE_URL__') {
  console.log(`                   the gallery falls back to the local artifact, but the files in`);
  console.log(`                   wrappers/ will NOT render until you rebuild against a real URL.`);
}
console.log(`wrote              wrappers/, apps/gallery/index.html, manifests/collection-v6.json`);
