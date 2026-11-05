// One-time migration for public/casino/index.html (2026-11-05): moves the three big embedded blobs out of the page into
// separate, content-hashed files in public/casino-assets/, and swaps the boot screen for one that shows real download progress.
//
//   node scripts/casino-externalise-assets.mjs            (from xtrata-2.0/)
//
// Why: index.html was 24 MB, of which ~21 MB was base64 data (the Adrian model, five machine packs, the bar atlas). Every visit
// had to download and parse all of it. The files in public/casino-assets/ are binary (a quarter smaller), have the hash of their
// content in their name, and are served `immutable` (public/_headers), so a return visit downloads none of them.
//
// What it changes in index.html:
//   1. Adrian:   <script>window.XA_ADRIAN_B64="..."</script> is removed; the code that used it now calls window.pxAsset('adrian').
//   2. Machines: window.PX_MACHINE_PACKS keeps its metadata, but `model` and `game` (gzipped, base64) become `modelKey` and
//                `gameKey`. The model is fetched at start (the room needs it); the game only when a player sits down to play.
//                Packs loaded from public/casino-machines/<id>/pack.json still carry `model` and `game` inline and work as before.
//   3. Bar:      window.ParallaxBarAtlas is a URL instead of a data: URI.
//   4. Boot screen: replaced; it fetches the "eager" assets itself (so the bar is real) and goes when the room draws its first frame.
//
// Safe to run twice: it stops if the page has already been migrated. Nothing in the old files is lost: the bytes are the same.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.argv.includes('--root') ? path.resolve(process.argv[process.argv.indexOf('--root') + 1]) : path.resolve(here, '..');
const pagePath = path.join(root, 'public', 'casino', 'index.html');
const assetDir = path.join(root, 'public', 'casino-assets');
const URL_BASE = '/casino-assets/';

let html = fs.readFileSync(pagePath, 'utf8');
const startBytes = Buffer.byteLength(html);
if (html.includes('window.PX_ASSETS') || !html.includes('window.XA_ADRIAN_B64="')) {
  console.log('index.html looks already migrated; nothing to do.');
  process.exit(0);
}
fs.mkdirSync(assetDir, { recursive: true });

const manifest = {}; // key -> { u, n, e }
function put(key, name, bytes, ext, eager, unzip) {
  const h = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 10);
  const file = `${name}.${h}.${ext}`;
  fs.writeFileSync(path.join(assetDir, file), bytes);
  if (key) manifest[key] = { u: URL_BASE + file, n: bytes.length, ...(eager ? { e: 1 } : {}), ...(unzip ? { z: 1 } : {}) };
  return URL_BASE + file;
}
function once(str, label) {
  const first = html.indexOf(str);
  if (first < 0 || html.indexOf(str, first + 1) >= 0) throw new Error(`expected exactly one: ${label}`);
  return first;
}
function replaceOnce(from, to, label) {
  const i = once(from, label);
  html = html.slice(0, i) + to + html.slice(i + from.length);
}

// ---- 1. Adrian ------------------------------------------------------------------------------------------------------------
{
  const re = /<script>window\.XA_ADRIAN_B64="([A-Za-z0-9+/=]+)";?\s*<\/script>\n?/;
  const m = re.exec(html);
  if (!m) throw new Error('Adrian script not found');
  // stored gzipped (36% smaller; a .glb is not always compressed by the host) and unpacked by pxAsset ('z')
  put('adrian', 'adrian-glb-gz', zlib.gzipSync(Buffer.from(m[1], 'base64'), { level: 9 }), 'bin', true, true);
  html = html.slice(0, m.index) + html.slice(m.index + m[0].length);
  const a = html.indexOf('(window.XA_ADRIAN_B64 ? ');
  const endStr = "return r.arrayBuffer(); }))";
  const b = html.indexOf(endStr, a);
  if (a < 0 || b < 0 || b - a > 900) throw new Error('Adrian loader code not as expected');
  html = html.slice(0, a) + "(window.pxAsset('adrian'))" + html.slice(b + endStr.length);
}

// ---- 2. Machine packs ----------------------------------------------------------------------------------------------------
{
  const head = '<script>window.PX_MACHINE_PACKS=';
  const s = once(head, 'PX_MACHINE_PACKS script');
  const e = html.indexOf('</script>', s);
  const body = html.slice(s + head.length, e).trim().replace(/;$/, '');
  const packs = JSON.parse(body);
  if (!Array.isArray(packs) || packs.length !== 5) throw new Error('expected the five built-in packs');
  const slim = packs.map((p, i) => {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const { model, game, ...rest } = p;
    if (typeof model !== 'string' || typeof game !== 'string') throw new Error('pack without model/game: ' + p.name);
    const modelKey = `m${i}model`, gameKey = `m${i}game`;
    put(modelKey, `machine-${slug}-model`, Buffer.from(model, 'base64'), 'bin', true);
    put(gameKey, `machine-${slug}-game`, Buffer.from(game, 'base64'), 'bin', false);
    return { ...rest, modelKey, gameKey };
  });
  html = html.slice(0, s) + head + JSON.stringify(slim) + ';' + html.slice(e);
  // helper next to decodePXGzip, and its four call sites
  const dec = 'async function decodePXGzip(encoded){';
  const d = once(dec, 'decodePXGzip');
  const close = html.indexOf('\n  }\n', d) + '\n  }\n'.length;
  const helper = `  // A pack's model or game as text: from its own file (built-in machines: modelKey / gameKey; slim packs from the deploy step:
  // modelUrl / gameUrl; each fetched once and kept) or inline (a pack.json loaded as it is).
  async function pxPackText(pack,field){
    const key=pack&&pack[field+'Key'],url=pack&&pack[field+'Url'];
    if(!key&&!url)return decodePXGzip(pack[field]);
    const buf=await (key?window.pxAsset(key):window.pxAssetUrl(url,pack[field+'Bytes'],false));
    return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  }
`;
  html = html.slice(0, close) + helper + html.slice(close);
  replaceOnce('JSON.parse(await decodePXGzip(p.model))', "JSON.parse(await pxPackText(p,'model'))", 'model call');
  replaceOnce('await decodePXGzip(window.PX_MACHINE_PACKS[machine.type].game)', "await pxPackText(window.PX_MACHINE_PACKS[machine.type],'game')", 'game call 1');
  replaceOnce('await decodePXGzip(window.PX_MACHINE_PACKS[type].game)', "await pxPackText(window.PX_MACHINE_PACKS[type],'game')", 'game call 2');
  replaceOnce('await decodePXGzip(window.PX_MACHINE_PACKS[m.type].game)', "await pxPackText(window.PX_MACHINE_PACKS[m.type],'game')", 'game call 3');
}

// ---- 2b. Machines loaded from public/casino-machines/<id>/pack.json: use pack.slim.json (written by the deploy step, see
//          scripts/split-casino-packs-dist.mjs) when there is one, and start each model downloading as soon as its pack is known --------
{
  const re = /const res=await fetch\(base\+k\+'\/pack\.json',\{signal:ctl\.signal\}\);clearTimeout\(timer\);\s*if\(!res\.ok\)throw Error\('HTTP '\+res\.status\);\s*const pack=await res\.json\(\);/;
  const m = re.exec(html);
  if (!m) throw new Error('pack fetch code not as expected');
  const code = `let pack=null;
        try{const r=await fetch(base+k+'/pack.slim.json',{signal:ctl.signal});if(r.ok)pack=await r.json();}catch(_){pack=null;}   // the deploy writes this slim copy (model and game as separate, cached files)
        if(!pack||typeof pack.modelUrl!=='string'){const res=await fetch(base+k+'/pack.json',{signal:ctl.signal});if(!res.ok)throw Error('HTTP '+res.status);pack=await res.json();}   // no slim copy: the full pack
        clearTimeout(timer);`;
  html = html.slice(0, m.index) + code + html.slice(m.index + m[0].length);
  replaceOnce(
    "typeof pack.model!=='string'||typeof pack.game!=='string'||!/^#[0-9a-fA-F]{6}$/.test(pack.accent||'')",
    "!(typeof pack.model==='string'||typeof pack.modelUrl==='string')||!(typeof pack.game==='string'||typeof pack.gameUrl==='string')||!/^#[0-9a-fA-F]{6}$/.test(pack.accent||'')",
    'pack validation'
  );
  replaceOnce(
    "throw Error('not a machine pack');\n        return {key:k,gameId:k,pack};",
    "throw Error('not a machine pack');\n        if(typeof pack.modelUrl==='string'&&window.pxAssetUrl)window.pxAssetUrl(pack.modelUrl,pack.modelBytes,true);   // start the model downloading now (the game waits until someone plays)\n        return {key:k,gameId:k,pack};",
    'pack prefetch'
  );
}

// ---- 3. Bar atlas ---------------------------------------------------------------------------------------------------------
{
  const re = /window\.ParallaxBarAtlas="data:image\/png;base64,([A-Za-z0-9+/=]+)";/;
  const m = re.exec(html);
  if (!m) throw new Error('bar atlas not found');
  const url = put(null, 'bar-atlas', Buffer.from(m[1], 'base64'), 'png', false);
  html = html.slice(0, m.index) + `window.ParallaxBarAtlas="${url}";` + html.slice(m.index + m[0].length);
}

// ---- 4. The room has drawn: tell the boot screen ----------------------------------------------------------------------------
replaceOnce(
  'renderer.render(scene, camera);\n    if (!readySent && ++drawn >= 3)',
  'renderer.render(scene, camera);\n    if (!window.__pxBootFired) { window.__pxBootFired = 1; try { if (window.pxBootDone) window.pxBootDone(); } catch (e) { } }   // the boot screen can go: the room has drawn a frame\n    if (!readySent && ++drawn >= 3)',
  'first frame hook'
);

// ---- 5. Boot screen --------------------------------------------------------------------------------------------------------
{
  const a = html.indexOf('<!-- Boot screen');
  const endMark = 'tick();\n})();</script>\n';
  const b = html.indexOf(endMark, a);
  if (a < 0 || b < 0) throw new Error('old boot screen not found');
  const boot = fs.readFileSync(path.join(here, 'casino-boot-screen.html'), 'utf8').replace('__MANIFEST__', JSON.stringify(manifest));
  if (boot.includes('__MANIFEST__')) throw new Error('manifest placeholder left');
  html = html.slice(0, a) + boot + html.slice(b + endMark.length);
}

fs.writeFileSync(pagePath, html);
const endBytes = Buffer.byteLength(html);
console.log(`index.html: ${(startBytes / 1e6).toFixed(2)} MB -> ${(endBytes / 1e6).toFixed(2)} MB`);
let total = 0;
for (const f of fs.readdirSync(assetDir)) { const n = fs.statSync(path.join(assetDir, f)).size; total += n; console.log('  ' + f + '  ' + (n / 1e6).toFixed(2) + ' MB'); }
console.log(`assets: ${(total / 1e6).toFixed(2)} MB in public/casino-assets/`);
