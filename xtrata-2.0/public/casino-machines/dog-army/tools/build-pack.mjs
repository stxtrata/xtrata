// Builds DOG Army's self-contained game page and its PX_MACHINE_PACKS entry.
//   node tools/build-pack.mjs            → dist/game.html, pack.json, pack.js, art/sources.json
// The cabinet model comes from tools/build-cabinet.py (headless Chrome + THREE r128), written to build/model.json.
// The engine block in src/engine.js is the Forever Twins pack's BF engine, unchanged; this script checks that.
import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// FIXTURE=1 builds ONLY a test page from checks/fixture/dog (clearly fake data, never shipped) into dist-fixture/game.html; nothing else is written.
const FIXTURE = process.env.FIXTURE === '1', ART_DIR = FIXTURE ? 'checks/fixture/dog' : 'art/dog';
const r = p => readFile(join(ROOT, p), 'utf8'), rb = p => readFile(join(ROOT, p));
const MIME = { '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
const dataURI = async p => `data:${MIME[extname(p).toLowerCase()]};base64,${(await rb(p)).toString('base64')}`;
const sha = s => createHash('sha256').update(s).digest('hex');

// 1. Engine identity: must equal the BF engine extracted from the Forever Twins pack (sha recorded at extraction).
const engine = await r('src/engine.js');
const ENGINE_SHA = (await r('src/engine.sha256')).trim();
if (sha(engine) !== ENGINE_SHA) throw Error('src/engine.js differs from the Forever Twins BF engine. Refusing to build.');

// 2. Art: the DOG data and the small images the ART stream bundled under art/dog (data.json + img/**).
// DOGARMY_ART = { data: <data.json>, files: { 'img/...': dataURI } }, keyed by the same relative paths data.json uses.
const dogData = existsSync(join(ROOT, ART_DIR + '/data.json')) ? JSON.parse(await r(ART_DIR + '/data.json')) : {};
const files = {};
async function walk(dir, rel = '', pre = 'img/') { if (!existsSync(dir)) return; for (const e of await readdir(dir, { withFileTypes: true })) { const p = join(dir, e.name), q = rel ? rel + '/' + e.name : e.name; if (e.isDirectory()) await walk(p, q, pre); else if (MIME[extname(e.name).toLowerCase()]) files[pre + q] = `data:${MIME[extname(e.name).toLowerCase()]};base64,${(await readFile(p)).toString('base64')}`; } }
await walk(join(ROOT, ART_DIR + '/img'));
// art/supplied holds files Jim supplied himself (Leonidas's PFP); bundled as img/supplied/<name>, never touched by the ART stream.
await walk(join(ROOT, 'art/supplied'), 'supplied');
// art/audio: real CC0 drum and horn recordings (VSCO 2 CE) as small mp3s, bundled as audio/<name>.mp3.
await walk(join(ROOT, 'art/audio'), '', 'audio/');
const artJS = `/* DOG Army art, bundled so the reels show real material offline: art/dog/data.json (on-chain records, each with its status) and the small images under art/dog/img.
   Every source is listed in art/sources.json. Anything missing here is drawn as a labelled type tile by the game. */
window.DOGARMY_ART=${JSON.stringify({ data: dogData, files })};`;

// 3. The game page, in the Forever Twins script order: LAYR account, compatibility, engine, Xtrata logo, art, game.
const css = await r('src/game.css'), body = await r('src/game-body.html');
const game = ['a', 'b', 'c', 'scenes', 'd', 'e'].map(p => `src/game.${p}.js`); const gameJS = (await Promise.all(game.map(r))).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0c0a09"><meta name="color-scheme" content="dark"><title>DOG Army — ParallaX Casino machine</title><meta name="description" content="DOG Army: a ParallaX Casino fruit machine on the DOG rune, with The Airdrop free spins, Dog Tags, March of the Army, the To the Moon jackpot and Moon or Doom. Uses the shared casino LAYR account."><style>${css}</style></head><body>
${body}
<script>${await r('src/layr.js')}</script>
<script>${await r('src/compat.js')}</script>
<script>${engine}</script>
<script>${await r('src/xlogo.js')}</script>
<script>${artJS}</script>
<script>${gameJS}</script>
</body></html>`;
// The room patches pack HTML by exact text; check every hook it relies on is present exactly once.
const hooks = { layr: html.split('<script>/* One existing LAYR account').length - 1, engineLine: (html.match(/GAME_ID='dog-army', *LAYR=window\.ParallaxLAYRAccount, *E=LAYR\.machine\(GAME_ID,BF\)/g) || []).length, screenLine: (html.match(/const screen *= *canvas\(2800, *1920\), *sg *= *screen\.getContext\('2d'\); *sg\.setTransform\(2, *0, *0, *2, *0, *0\);/g) || []).length, api: html.split('window.PX_CASINO_ENGINE={').length - 1, destination: (html.match(/connect\(\s*ac\.destination\s*\)/g) || []).length };
for (const [k, v] of Object.entries(hooks)) if (v !== 1) throw Error(`Room hook "${k}" found ${v} times (expected 1).`);
if (FIXTURE) { await mkdir(join(ROOT, 'dist-fixture'), { recursive: true }); await writeFile(join(ROOT, 'dist-fixture/game.html'), html); console.log('FIXTURE page written to dist-fixture/game.html (test data, not for shipping)'); process.exit(0); }
await mkdir(join(ROOT, 'dist'), { recursive: true });
await writeFile(join(ROOT, 'dist/game.html'), html);

// 4. The pack: one PX_MACHINE_PACKS entry, model and game gzip+base64, exactly like the existing five.
const modelPath = join(ROOT, 'build/model.json');
if (!existsSync(modelPath)) throw Error('build/model.json missing: run python3 tools/build-cabinet.py first.');
const model = await readFile(modelPath, 'utf8');
const gz = s => gzipSync(Buffer.from(s, 'utf8'), { level: 9 }).toString('base64');
const pack = { name: 'DOG Army', description: 'The DOG rune · Airdrop, Dog Tags and March bonuses', color: '#0c0a09', accent: '#e7e5e4', model: gz(model), game: gz(html), css };
// Round-trip check: the pack decodes to the same game and a valid model.
if (gunzipSync(Buffer.from(pack.game, 'base64')).toString('utf8') !== html) throw Error('Game did not round-trip.');
const m = JSON.parse(gunzipSync(Buffer.from(pack.model, 'base64')).toString('utf8'));
for (const k of ['root', 'geometries', 'materials', 'textures']) if (!m[k]) throw Error('Model missing ' + k);
// The cabinet must carry the parts the room and the game drive. Strict once build/CABINET-DONE exists; a warning for the placeholder model.
const roles = new Set(), actions = new Set(); (function walkN(n) { if (n.role) roles.add(n.role); if (n.action) actions.add(n.action); (n.children || []).forEach(walkN); })(m.root);
const need = ['screenMesh', 'crest', 'spinPhysical', 'lever', ...Array.from({ length: 8 }, (_, i) => 'tag' + i)], needA = ['spin', 'betUp', 'betDown', 'auto', 'pays'];
const missing = [...need.filter(x => !roles.has(x)), ...needA.filter(x => !actions.has(x)).map(x => 'action:' + x)];
if (missing.length) { const msg = 'Model is missing: ' + missing.join(', '); if (existsSync(join(ROOT, 'build/CABINET-DONE'))) throw Error(msg); console.warn('WARNING (placeholder cabinet): ' + msg); }
await writeFile(join(ROOT, 'pack.json'), JSON.stringify(pack));
await writeFile(join(ROOT, 'pack.js'), `/* DOG Army as one PX_MACHINE_PACKS entry, for the standalone test page (works from file:// too). Same content as pack.json. */\nwindow.DOGARMY_PACK=${JSON.stringify(pack)};\n`);

// 5. sources.json: the ART stream owns the file; this stage only adds a "gameBundle" entry (never overwrites theirs) and writes art/game-bundle.json.
const bundle = { builtAt: new Date().toISOString(), dataJson: existsSync(join(ROOT, 'art/dog/data.json')), bundledImages: Object.keys(files).sort(), dataDone: existsSync(join(ROOT, 'art/dog/DATA-DONE')), cabinetDone: existsSync(join(ROOT, 'build/CABINET-DONE')),
  drawnInCode: ['Block, rune, supply and transfer tiles (black / white / khaki-brass, 480 px)', 'Leonidas wild fallback (used only if his PFP file is missing): name card with an original Spartan crest', 'Snapshot parachute crate', 'Dog tags, ranks of silhouettes, tents, cargo plane, parade ground (generic military imagery)', 'Xtrata mark (XLOGO vector code)'],
  supplied: [{ file: 'art/supplied/leonidas-pfp.jpg', what: 'Leonidas (@LeonidasNFT) profile picture, circle-cropped from a screenshot supplied by Jim, 448 px', needsPermission: 'Leonidas should OK it before a public build' }],
  notDrawn: ['The DOG mascot and the $DOG logo are never drawn: only the official files, when supplied (art/dog/img/dog-logo-*.png)'] };
const sp = join(ROOT, 'art/sources.json');
let sources = {}; try { if (existsSync(sp)) sources = JSON.parse(await readFile(sp, 'utf8')); } catch (e) { console.warn('art/sources.json unreadable; leaving it alone'); sources = null; }
await writeFile(join(ROOT, 'art/game-bundle.json'), JSON.stringify(bundle, null, 2));
if (sources && typeof sources === 'object' && !Array.isArray(sources)) { sources.gameBundle = bundle; await writeFile(sp, JSON.stringify(sources, null, 2)); }
const kb = n => (n / 1024).toFixed(0) + ' KB';
console.log(`game.html ${kb(html.length)} · model.json ${kb(model.length)} · pack.json ${kb(JSON.stringify(pack).length)} (game gz ${kb(pack.game.length)}, model gz ${kb(pack.model.length)})`);
console.log('room hooks ok:', JSON.stringify(hooks), '· engine sha', ENGINE_SHA.slice(0, 16), '· images', Object.keys(files).length, '· DATA-DONE', bundle.dataDone, '· CABINET-DONE', bundle.cabinetDone);
