// Builds Mooneeb's self-contained game page and its PX_MACHINE_PACKS entry.
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
const r = p => readFile(join(ROOT, p), 'utf8'), rb = p => readFile(join(ROOT, p));
const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
const dataURI = async p => `data:${MIME[extname(p).toLowerCase()]};base64,${(await rb(p)).toString('base64')}`;
const sha = s => createHash('sha256').update(s).digest('hex');

// 1. Engine identity: must equal the BF engine extracted from the Forever Twins pack (sha recorded at extraction).
const engine = await r('src/engine.js');
const ENGINE_SHA = (await r('src/engine.sha256')).trim();
if (sha(engine) !== ENGINE_SHA) throw Error('src/engine.js differs from the Forever Twins BF engine. Refusing to build.');

// 2. Art: the original ladder illustrations, LEO Cats twins, any official logo files and an approved Muneeb image.
// Jim's supplied pop-art picks (art/ladder/pop, prepared by tools/prepare-supplied.py) take over from the original SVGs where they exist.
const ladder = {}, popPicks = existsSync(join(ROOT, 'art/ladder/pop/picks.json')) ? JSON.parse(await r('art/ladder/pop/picks.json')) : {};
for (const k of ['m', 'moo', 'moon', 'mooney', 'rocket', 'bag', 'mooBurst', 'astronaut', 'herd', 'crescent', 'field']) {
  if (popPicks[k] && existsSync(join(ROOT, popPicks[k].file))) ladder[k] = await dataURI(popPicks[k].file);
  else if (existsSync(join(ROOT, `art/ladder/${k}.svg`))) ladder[k] = await dataURI(`art/ladder/${k}.svg`);
}
const twinsMeta = JSON.parse(await r('art/twins/twins.json'));
const twins = []; for (const t of twinsMeta.twins) twins.push({ key: 'leo-cats', tokenId: t.tokenId, xtrataId: t.xtrataId, src: await dataURI(t.native || t.file) });
const logos = {}, logoNotes = JSON.parse(existsSync(join(ROOT, 'art/logos/logos.json')) ? await r('art/logos/logos.json') : '{}');
for (const k of ['stx', 'leo']) { for (const ext of ['.svg', '.png', '.webp', '.jpg']) { const p = `art/logos/${k}${ext}`; if (existsSync(join(ROOT, p))) { logos[k] = { src: await dataURI(p), source: logoNotes[k]?.source || p }; break; } } }
let muneeb = null; const mj = 'art/muneeb/approval.json';
if (existsSync(join(ROOT, mj))) { const a = JSON.parse(await r(mj)); if (a.approved === true && a.file && existsSync(join(ROOT, 'art/muneeb', a.file))) muneeb = { src: await dataURI(`art/muneeb/${a.file}`), approval: `Approved by ${a.approvedBy || 'Jim'} on ${a.approvedOn || 'unknown date'}. ${a.note || ''}`.trim() }; }
const artJS = `/* Mooneeb art, bundled so the reels show real art offline: original ladder illustrations (SVG), real LEO Cats Forever Twins
   read from their Xtrata inscriptions, and official logo files once supplied. Every source is listed in art/sources.json. */
window.MOONEEB_ART=${JSON.stringify({ ladder, twins, logos, muneeb })};`;

// 3. The game page, in the Forever Twins script order: LAYR account, compatibility, engine, Xtrata logo, art, game.
const css = await r('src/game.css'), body = await r('src/game-body.html');
const game = ['a', 'b', 'c', 'd', 'e'].map(p => `src/game.${p}.js`); const gameJS = (await Promise.all(game.map(r))).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0b0418"><meta name="color-scheme" content="dark"><title>Mooneeb — ParallaX Casino machine</title><meta name="description" content="Mooneeb: a ParallaX Casino fruit machine on the word ladder M, Moo, Moon, Mooney, Mooneeb, with Moonshot free spins, Mooney Bags, Spell It and the Full Mooneeb jackpot. Uses the shared casino LAYR account."><style>${css}</style></head><body>
${body}
<script>${await r('src/layr.js')}</script>
<script>${await r('src/compat.js')}</script>
<script>${engine}</script>
<script>${await r('src/xlogo.js')}</script>
<script>${artJS}</script>
<script>${gameJS}</script>
</body></html>`;
// The room patches pack HTML by exact text; check every hook it relies on is present exactly once.
const hooks = { layr: html.split('<script>/* One existing LAYR account').length - 1, engineLine: (html.match(/GAME_ID='mooneeb', *LAYR=window\.ParallaxLAYRAccount, *E=LAYR\.machine\(GAME_ID,BF\)/g) || []).length, screenLine: (html.match(/const screen *= *canvas\(2800, *1920\), *sg *= *screen\.getContext\('2d'\); *sg\.setTransform\(2, *0, *0, *2, *0, *0\);/g) || []).length, api: html.split('window.PX_CASINO_ENGINE={').length - 1, destination: (html.match(/connect\(\s*ac\.destination\s*\)/g) || []).length };
for (const [k, v] of Object.entries(hooks)) if (v !== 1) throw Error(`Room hook "${k}" found ${v} times (expected 1).`);
await mkdir(join(ROOT, 'dist'), { recursive: true });
await writeFile(join(ROOT, 'dist/game.html'), html);

// 4. The pack: one PX_MACHINE_PACKS entry, model and game gzip+base64, exactly like the existing five.
const modelPath = join(ROOT, 'build/model.json');
if (!existsSync(modelPath)) throw Error('build/model.json missing: run python3 tools/build-cabinet.py first.');
const model = await readFile(modelPath, 'utf8');
const gz = s => gzipSync(Buffer.from(s, 'utf8'), { level: 9 }).toString('base64');
const pack = { name: 'Mooneeb', description: 'Word ladder · Moonshot bonuses', color: '#2b145e', accent: '#c084fc', model: gz(model), game: gz(html), css };
// Round-trip check: the pack decodes to the same game and a valid model.
if (gunzipSync(Buffer.from(pack.game, 'base64')).toString('utf8') !== html) throw Error('Game did not round-trip.');
const m = JSON.parse(gunzipSync(Buffer.from(pack.model, 'base64')).toString('utf8'));
for (const k of ['root', 'geometries', 'materials', 'textures']) if (!m[k]) throw Error('Model missing ' + k);
await writeFile(join(ROOT, 'pack.json'), JSON.stringify(pack));
await writeFile(join(ROOT, 'pack.js'), `/* Mooneeb as one PX_MACHINE_PACKS entry, for the standalone test page (works from file:// too). Same content as pack.json. */\nwindow.MOONEEB_PACK=${JSON.stringify(pack)};\n`);

// 5. sources.json: every image, where it came from, and what still needs permission.
const sources = {
  machine: 'Mooneeb', builtAt: new Date().toISOString(),
  rule: 'Every image is listed here. Ladder pieces are original illustrations, the machine\'s one agreed exception to the nothing-generic rule.',
  ladder: Object.keys(ladder).map(k => popPicks[k] ? ({ key: k, file: popPicks[k].file, croppedFrom: popPicks[k].from, kind: 'Pop-art image supplied by Jim (2 November 2026), picked from his grid', slot: { m: 'cherry (M)', moo: 'lemon (Moo)', moon: 'chip (Moon)', mooney: 'block (Mooney)', rocket: 'scatter (Moonshot)', mooBurst: 'big-win and Moo gamble burst', astronaut: 'Moonshot intro', herd: 'Full Mooneeb jackpot backdrop', crescent: 'moon over the Mooney Bags field', field: 'Mooney Bags field: Mooney Mooney, NSW (map, pink pop style)' }[k] }) : ({ key: k, file: `art/ladder/${k}.svg`, slot: { m: 'cherry (M)', moo: 'lemon (Moo)', moon: 'chip (Moon)', mooney: 'block (Mooney)', rocket: 'scatter (Moonshot)', bag: 'vault (Mooney bag)' }[k], kind: 'Original illustration drawn for this machine (until a supplied image replaces it)' })),
  supplied: { grids: ['art/supplied/grid-popart.png', 'art/supplied/grid-mooney-mooney.png'], note: 'Supplied by Jim on 2 November 2026; every tile is cropped into art/supplied/. Unused tiles are kept for later.' },
  drawnInCode: [
    { slot: 'chain (letter tile)', kind: 'Original letter tiles M, O, N, E, B drawn in canvas code' },
    { slot: 'bitcoin (Mooneeb)', kind: muneeb ? 'Pop-art portrait of Muneeb Ali supplied by Jim (art/muneeb/portrait-hd.jpg)' : 'MOONEEB name card with an original crown, drawn in code (no likeness)', approval: muneeb ? muneeb.approval : 'A pop-art portrait supplied by Jim is waiting in art/muneeb/candidate-portrait.png. It stays off the reels until Muneeb has approved it (art/muneeb/approval.json).' },
    { slot: 'Xtrata mark', kind: 'XLOGO vector code (same trace as every machine)' },
    { slot: 'ParallaX Casino wordmark (souvenir ticket header)', kind: 'Brand SVG used as given', file: 'art/brand/parallax-casino-wordmark.svg' },
    { slot: 'Xtrata mark (brand file kept for reference)', kind: 'Brand SVG as given', file: 'art/brand/xtrata-mark.svg' }
  ],
  logos: [
    { slot: 'wild (STX)', name: 'Stacks / STX', status: logos.stx ? 'bundled' : 'fallback: name set in type on a Stacks-purple tile', source: logos.stx ? logos.stx.source : 'Official file to come from the Stacks brand resources (stacks.co/brand). Not reachable from the build sandbox.', permission: 'Needs the Stacks Foundation OK before public use' },
    { slot: 'artifact (Leopold, $LEO)', name: '$LEO token', status: logos.leo ? 'bundled' : 'fallback: name set in type on an orange tile; the game also tries the official image live from the token metadata', source: logos.leo ? logos.leo.source : 'leo-token metadata (SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token) → image_canonical_uri https://token-meta.s3.eu-central-1.amazonaws.com/icon.png. Blocked by the build sandbox\'s network policy.', permission: 'Needs the $LEO team\'s OK before public use' }
  ],
  twins: { collection: 'LEO Cats', helper: twinsMeta.helper, sourceContract: twinsMeta.source, core: twinsMeta.core, readAt: twinsMeta.readAt, inscribedCountAtBuild: twinsMeta.inscribedCount, items: twinsMeta.twins.map(t => ({ file: t.file, tokenId: t.tokenId, xtrataId: t.xtrataId, source: t.source, swapTx: t.swapTx })) },
  needsPermission: ['Stacks (STX) logo — Stacks Foundation', '$LEO token logo — the $LEO team', 'Muneeb Ali — his OK and an image he is happy with', 'LEO Cats art in the Moonshot starfield — the LEO Cats community (shown as Forever Twins, the same use as Forever Twins itself)']
};
await writeFile(join(ROOT, 'art/sources.json'), JSON.stringify(sources, null, 2));
const kb = n => (n / 1024).toFixed(0) + ' KB';
console.log(`game.html ${kb(html.length)} · model.json ${kb(model.length)} · pack.json ${kb(JSON.stringify(pack).length)} (game gz ${kb(pack.game.length)}, model gz ${kb(pack.model.length)})`);
console.log('room hooks ok:', JSON.stringify(hooks), '· engine sha', ENGINE_SHA.slice(0, 16));
