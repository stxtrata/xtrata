#!/usr/bin/env node
// Builds the Ordinal Rush machine into its own folder, public/casino-machines/ordinal-rush/. Never writes to the casino.
//   node public/casino-machines/ordinal-rush/tools/build.mjs
// Reads public/casino/index.html for reference only: the shared parts (LAYR account adapter, browser check, the Block
// Fortune v2 engine, XLOGO, and for the test page THREE and the SoftwareRenderer) are copied byte for byte out of the
// Forever Twins pack, and the engine is checked against a fixed SHA-256 so the maths cannot drift.
// Writes: pack.json + pack.js (one PX_MACHINE_PACKS entry), vendor/ (test-page libraries), dist/ordinal-rush.html.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import crypto from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url)), MACHINE = resolve(TOOLS, '..'), REPO = resolve(MACHINE, '../../..');
const CASINO = process.env.PX_CASINO_HTML || join(REPO, 'public/casino/index.html');
const ENGINE_SHA256 = '7a5ae8482d70f1e09b7308103c52eb738f8e12a1fae36b9832488000a4f7b98e'; // Block Fortune v2, STATE_VERSION 2
const PACK = { name: 'Ordinal Rush', description: 'Ordinals · inscription reels', color: '#2a2420', accent: '#f7931a' };
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const b64gz = s => gzipSync(Buffer.from(s, 'utf8'), { level: 9 }).toString('base64');
const asciiJSON = v => JSON.stringify(v).replace(/[\u007f-￿]/g, ch => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));

const casinoBefore = readFileSync(CASINO), casinoHash = sha(casinoBefore), html = casinoBefore.toString('utf8');
const OPEN = '<script>window.PX_MACHINE_PACKS=', a = html.indexOf(OPEN), b = html.indexOf('];</script>', a);
if (a < 0 || b < 0) throw Error('PX_MACHINE_PACKS not found in ' + CASINO);
const ft = JSON.parse(html.slice(a + OPEN.length, b + 1)).find(p => p.name === 'Forever Twins'); if (!ft) throw Error('Forever Twins pack (the template) is missing');
const ftGame = gunzipSync(Buffer.from(ft.game, 'base64')).toString('utf8');
const slice = m => { const s = ftGame.indexOf(m); if (s < 0) throw Error('Template part missing: ' + m.slice(0, 50)); return ftGame.slice(s, ftGame.indexOf('</script>', s) + 9); };
const layrAccount = slice('<script>/* One existing LAYR account');
const compat = slice("<script>(function(){\n 'use strict';\n function show(").replace("'Block Fortune needs '", "'Ordinal Rush needs '");
const engine = slice('<script>/* Block Fortune v2 engine.');
const xlogo = slice('<script>/* Xtrata logo, traced');
const three = slice('<script>var THREE='), softRenderer = slice('<script>/* Canvas compatibility renderer');
if (sha(engine) !== ENGINE_SHA256) throw Error(`Engine changed: sha256 ${sha(engine)} != ${ENGINE_SHA256}.`);

const RECOLOUR = [['#39d8ff', '#f7931a'], ['#7ff3ff', '#ffc56b'], ['#1bb6e8', '#d9770f'], ['#0b5f80', '#7a3e06'], ['#6fefff', '#ffb347'], ['#5fe6ff', '#ffb347'], ['#2fc4ef', '#d9770f'], ['#9fefff', '#ffd18a'], ['#c9f6ff', '#ffe2ad'], ['#b8f6ff', '#ffe2ad'], ['#5ff0ff', '#ffb347'], ['#bff6ff', '#ffe2ad'], ['#5fd8f5', '#ffb347'], ['#cdeffc', '#ffe2ad'], ['#9fdfff', '#ffd18a'], ['#7fdfff', '#ffc56b'], ['#5f8fa6', '#9c7a4a'], ['#001521', '#1a0d00'], ['#0d2230', '#2a1c0b'], ['#0a2c3c', '#2a1c0b'], ['#0f3446', '#3a240c'], ['#06141c', '#160d05'], ['#245a7066', '#5a3a1466'], ['#2a6f8660', '#865a2a60'], ['#4d7c9370', '#93704d70'], ['#4d7c9360', '#93704d60'], ['#3f6e8666', '#86603f66'], ['#3f6e8685', '#86603f85'], ['#2b5468', '#68502b'], ['#05080c', '#0c0c0e'], ['#0a1017', '#141210'], ['#0b1219', '#15130f'], ['#081018', '#13110d'], ['#060b10', '#0f0d0a'], ['#020508c9', '#080604c9'], ['#e3f1f9', '#f3e9da'], ['#eef8ff', '#f8efe2'], ['#e6f4fb', '#f3e9da'], ['#dcf3ff', '#f3e6d0'], ['#c9f9ff', '#ffe2ad'], ['#17a9da', '#d9770f'], ['#e9fbff', '#fff4e3'], ['#bfe9ff1f', '#ffc56b1f'], ['#a7bccb', '#bfae97'], ['#9aaebd', '#b3a28a'], ['#93a6b5', '#a8977f'], ['#7f95a5', '#8f7f6a'], ['#adc2d0', '#c4b39b'], ['#b9cbd7', '#d0c0a8'], ['#a8bccb', '#c0ae95'], ['#8ea3b2', '#a5947c'], ['#93a8b7', '#a8977f'], ['#b6c8d4', '#cdbda6'], ['#a0b5c4', '#b8a78f'], ['#a2b7c6', '#baa990'], ['#d8ecf6', '#efe1cc'], ['#d6ebf7', '#efe1cc'], ['#dcebf5', '#f2e4cf'], ['#cfe2ee', '#e8d9c2'], ['#8ba1b0', '#a3927a'], ['#a9bdcb', '#c1af96'], ['#b2c6d4', '#cab9a1'], ['#6f8796', '#8a7660'], ['#7e93a2', '#97856e']];
let css = ft.css; for (const [from, to] of RECOLOUR) css = css.split(from).join(to);
css = css.replace(/\.coin\.inf\{[^}]*\}/, '') + '\n.coin{background:radial-gradient(circle at 35% 30%,#fff1b8,#f7931a 70%);border-color:#ffd18a;box-shadow:0 0 12px #f7931a55}\n#loading p{color:#ffd18a}\n' + '#fs{position:fixed;inset:0;z-index:40;background:#050505;display:flex;flex-direction:column}#fs[hidden]{display:none}\n#fsStage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:8px}#fsStage canvas{display:block;border-radius:10px;box-shadow:0 0 0 3px #a77a2e,0 0 40px #f7931a33;touch-action:manipulation;cursor:pointer}\n#fsBar{display:flex;gap:6px;align-items:stretch;padding:8px max(10px,env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:#141210;border-top:1px solid #f7931a55}\n#fsMain{display:flex;gap:6px;flex:0 0 auto}#fsMore{display:flex;gap:6px;flex:1 1 auto;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px}\n#fsBar .fb{flex:0 0 auto;min-width:64px;min-height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:1px solid #86603f85;border-radius:9px;color:#f3e6d0;background:#1d1a16;padding:4px 10px}\n#fsBar .fb b{font:900 13px Arial;letter-spacing:.5px;white-space:nowrap}#fsBar .fb small{font:600 9px Arial;color:#a8977f;letter-spacing:.4px;white-space:nowrap}\n#fsBar .fb.primary{min-width:150px;background:linear-gradient(120deg,#ffc56b,#d9770f);color:#1a0d00;border-color:#fff1b8}#fsBar .fb.primary small{color:#3a1f05}#fsBar .fb.primary b{font-size:16px}\n#fsBar .fb.gold{background:#3a240c;border-color:#f7931a}#fsBar .fb.chip{background:#0f0d0a;cursor:default}#fsBar .fb.vol input{width:90px;accent-color:#f7931a}#fsBar [hidden]{display:none!important}#fsBar .fb[aria-pressed=true]{border-color:#f7931a;color:#ffc56b}\nbody.fs-on #toast{z-index:60;bottom:auto;top:20px}body.fs-on #celebration{z-index:45}body.fs-on #featureBar{display:none}\n@media(max-width:760px){#fsBar{flex-direction:column}#fsMain{flex-wrap:wrap}#fsMain .fb{flex:1 1 30%}#fsMain .fb.primary{flex:1 1 100%;min-height:56px}#fsMore .fb{min-width:58px;padding:4px 8px}}\n';

const BODY = `
<div class="vignette"></div>
<header><a class="brand" href="#" aria-label="Ordinal Rush"><canvas class="brandmark" id="brandmark" width="68" height="68" aria-hidden="true"></canvas> ORDINAL RUSH <span class="arcade">/ PARALLAX CASINO</span></a><div class="top-right"><span class="pill"><i></i> LAYR PLAY</span><button id="sound" class="icon" aria-label="Mute sound" aria-pressed="true">♫</button><button id="help" class="icon" aria-label="Rarity and pays">?</button><button id="fullscreenBtn" class="icon" aria-label="Full screen (F)">⛶</button><button id="settings" class="icon" aria-label="Settings">⚙</button></div></header>
<main><section class="intro"><p class="eyebrow">BITCOIN ORDINALS &nbsp; / &nbsp; ALREADY FOREVER</p><h1>ORDINAL<br><em>RUSH</em></h1><p class="tagline">Every symbol is a real inscription,<br>loaded from Bitcoin itself.</p><div class="edition"><span></span> EVERY SAT HAS A NUMBER</div><div class="feature-list"><button data-info="free"><b>01</b><span>The Airdrop<small>3+ Runestones · 8 free spins · 2×</small></span><i>↗</i></button><button data-info="vault"><b>02</b><span>Wizard Vault<small>Open 3 of 9 sealed sats</small></span><i>↗</i></button><button data-info="chain"><b>03</b><span>Bitmap Land Grab<small>Claim parcels. Respin.</small></span><i>↗</i></button><button data-info="genesis"><b>04</b><span>Inscription #0 Jackpot<small>5 NodeMonkes on the centre row</small></span><i>↗</i></button><button id="colsInfo"><b>05</b><span>The inscriptions on the reels<small>Live from ordinals.com</small></span><i>↗</i></button><button id="holdersInfo"><b>06</b><span>Holder Pot<small>1% of paid bets, weekly</small></span><i>↗</i></button></div></section>
<aside class="session"><p class="eyebrow">YOUR SESSION</p><div class="session-row"><span>Spins</span><b id="spins">0</b></div><div class="session-row"><span>Total played</span><b id="wagered">0</b></div><div class="session-row"><span>Total paid out</span><b id="paidOut">0</b></div><div class="session-rule"></div><p class="eyebrow">INSCRIPTION #0 JACKPOT</p><p class="meter" id="meterSide">50,000</p><p class="eyebrow">HOLDER POT · THIS WEEK</p><p class="meter" id="potSide">0</p><button class="text-button" id="history">Session history ↗</button></aside>
<div class="machine-caption"><span class="live-dot"></span> <span id="status" role="status" aria-live="polite">EVERY SAT HAS A NUMBER</span></div></main>
<section id="featureBar" hidden aria-live="polite" aria-label="Bonus feature"><div class="fb-head"><span class="eyebrow" id="fbTag">FEATURE</span><strong id="fbTitle"></strong><span id="fbInfo"></span></div><div id="fbBody"></div></section>
<footer class="console"><div class="credit"><label>LAYR BALANCE <button id="account" aria-label="View shared LAYR account">LAYR account</button></label><strong id="balance">0</strong><small>LAYR</small></div><div class="bet"><label>TOTAL BET <span>20 LINES</span></label><div class="stepper"><button id="minus" aria-label="Fewer sats: decrease bet">−</button><strong id="bet">100</strong><button id="plus" aria-label="More sats: increase bet">+</button></div></div><div class="last"><label id="winLabel">LAST WIN</label><strong id="lastWin">0</strong><small id="freeCount">LAYR</small><button id="gamble" class="gamble-btn" hidden>ODD OR EVEN SAT ›</button></div><div class="actions"><button id="auto" class="secondary" aria-pressed="false">AUTO-MINE</button><button id="maxBet" class="secondary">MAX SATS</button><button id="spin" class="spin"><span id="spinText">INSCRIBE</span> <span class="spin-icon">₿</span></button><button id="turbo" class="secondary" aria-pressed="false">TURBO</button></div><div class="utility"><button id="rules">RARITY / PAYS</button><button id="historyLink">SESSION HISTORY</button></div></footer>
<div id="fs" hidden><div id="fsStage"></div><nav id="fsBar" aria-label="Machine controls"><div id="fsMain"></div><div id="fsMore"></div></nav></div>
<div id="toast" role="status"></div><div id="celebration" aria-hidden="true"></div>
<dialog id="modal"><div class="modal-head"><span class="eyebrow" id="modalTag">ORDINAL RUSH</span><button id="close" aria-label="Close dialog">×</button></div><div id="modalContent"></div></dialog>
<div id="loading" role="status"><canvas class="loader-mark" id="loaderMark" width="230" height="230" aria-hidden="true"></canvas><p id="loadMsg">READING THE CHAIN</p><small>Ordinal Rush · ParallaX Casino</small></div><noscript><p class="noscript">Ordinal Rush needs JavaScript to run.</p></noscript>
`;


const art = readFileSync(join(MACHINE, 'art/art.js'), 'utf8');
const manifest = JSON.parse(readFileSync(join(MACHINE, 'art/manifest.json'), 'utf8'));
const compact = {};
for (const [key, col] of Object.entries(manifest.collections)) compact[key] = col.items.map(it => key === 'bitmap' ? [it.id, it.number, it.block] : [it.id, it.number]);
const artScript = `<script>${art}window.OR_MANIFEST=${JSON.stringify(compact)};</script>`;
const game = readFileSync(join(MACHINE, 'src/game.js'), 'utf8');
const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0c0c0e"><meta name="color-scheme" content="dark"><title>Ordinal Rush — ParallaX Casino machine</title><meta name="description" content="Ordinal Rush: a ParallaX Casino slot whose reels show real Bitcoin inscriptions."><style>${css}</style></head><body>${BODY}${layrAccount}\n${compat}\n${engine}\n${xlogo}\n${artScript}\n<script>${game}</script>\n</body></html>`;
const model = readFileSync(join(MACHINE, 'src/model.json'), 'utf8'); JSON.parse(model);

mkdirSync(join(MACHINE, 'dist'), { recursive: true }); mkdirSync(join(MACHINE, 'vendor'), { recursive: true });
writeFileSync(join(MACHINE, 'dist/ordinal-rush.html'), doc);
const pack = { ...PACK, model: b64gz(model), game: b64gz(doc), css };
const packJSON = asciiJSON(pack);
writeFileSync(join(MACHINE, 'pack.json'), packJSON);
writeFileSync(join(MACHINE, 'pack.js'), `/* Ordinal Rush as one PX_MACHINE_PACKS entry (same content as pack.json), loadable with a script tag. */\nwindow.OR_PACK=${packJSON};\n`);
// Test-page libraries, copied from the casino so the studio renders the cabinet exactly as the room's THREE build would.
const strip = s => s.slice(8, -9);
writeFileSync(join(MACHINE, 'vendor/three-subset.js'), '/* THREE subset used by the ParallaX machines (copied from the Forever Twins pack). */\n' + strip(three));
writeFileSync(join(MACHINE, 'vendor/software-renderer.js'), strip(softRenderer));
writeFileSync(join(MACHINE, 'vendor/xlogo.js'), strip(xlogo));
// The test page's ParallaxLAYRAccount stub: the same adapter, on its own storage keys, with a play balance. Never the casino's.
writeFileSync(join(MACHINE, 'vendor/layr-test-stub.js'), '/* TEST STUB of window.ParallaxLAYRAccount for the standalone Ordinal Rush page. It is the casino adapter with its own\n   storage keys, so it can never read or change a real casino balance. */\n' + strip(layrAccount).split("'xtrata.parallax.layr.account.v1'").join("'xtrata.parallax.test.ordinal-rush.layr.v1'").split("'xtrata.parallax.layr.lease.v1'").join("'xtrata.parallax.test.ordinal-rush.lease.v1'").split("LEGACY_KEY='royalflush_v2'").join("LEGACY_KEY='xtrata.parallax.test.none'").split("'xtrata-parallax-account-lock'").join("'xtrata-parallax-test-ordinal-rush-lock'"));
if (sha(readFileSync(CASINO)) !== casinoHash) throw Error('The casino file changed during the build (another session?). Nothing in it was written by this script.');
console.log(`game ${(doc.length / 1024).toFixed(0)} KB, model ${(model.length / 1024).toFixed(0)} KB, pack.json ${(packJSON.length / 1024).toFixed(0)} KB; engine sha256 ${sha(engine).slice(0, 16)}… OK; casino read-only (sha256 ${casinoHash.slice(0, 12)}… unchanged)`);
