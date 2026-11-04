#!/usr/bin/env node
// Builds the Rune Pit machine into its own folder (this folder). Never writes to the casino.
//   node tools/build.mjs            (run tools/build-art.mjs first if the rune data or art changed)
//   PX_CASINO_HTML=/path/to/casino/index.html node tools/build.mjs
// Reads public/casino/index.html for reference only: the shared parts (LAYR account adapter, browser check, the Block
// Fortune v2 engine, XLOGO, and for the test page THREE and the SoftwareRenderer) are copied byte for byte out of the
// Forever Twins pack, and the engine is checked against a fixed SHA-256 so the maths cannot drift. The shared CSS is the
// Forever Twins stylesheet with its cyan palette remapped to ember and lava (RECOLOUR).
// Writes: pack.json + pack.js (one PX_MACHINE_PACKS entry), vendor/ (test-page libraries), dist/rune-pit.html.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import crypto from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url)), MACHINE = resolve(TOOLS, '..'), REPO = resolve(MACHINE, '../../..');
const CASINO = process.env.PX_CASINO_HTML || (existsSync(join(REPO, 'public/casino/index.html')) ? join(REPO, 'public/casino/index.html') : '/mnt/user-data/uploads/xtrata/xtrata-2.0/public/casino/index.html');
const ENGINE_SHA256 = '7a5ae8482d70f1e09b7308103c52eb738f8e12a1fae36b9832488000a4f7b98e'; // Block Fortune v2, STATE_VERSION 2
const PACK = { name: 'Rune Pit', description: 'Bitcoin Runes · volcanic forge reels', color: '#1a1214', accent: '#d64545' };
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
const compat = slice("<script>(function(){\n 'use strict';\n function show(").replace("'Block Fortune needs '", "'Rune Pit needs '");
const engine = slice('<script>/* Block Fortune v2 engine.');
const xlogo = slice('<script>/* Xtrata logo, traced');
const three = slice('<script>var THREE='), softRenderer = slice('<script>/* Canvas compatibility renderer');
if (sha(engine) !== ENGINE_SHA256) throw Error(`Engine changed: sha256 ${sha(engine)} != ${ENGINE_SHA256}.`);

const RECOLOUR = [['#39d8ff','#d64545'],['#7ff3ff','#ff8a3d'],['#1bb6e8','#b53030'],['#0b5f80','#6a1c1a'],['#6fefff','#ff8e47'],['#5fe6ff','#ff8e47'],['#2fc4ef','#b53030'],['#9fefff','#ffba8a'],['#c9f6ff','#efd3bd'],['#b8f6ff','#efd3bd'],['#5ff0ff','#ff8e47'],['#bff6ff','#efd3bd'],['#5fd8f5','#ff8e47'],['#cdeffc','#efd3bd'],['#9fdfff','#ffba8a'],['#7fdfff','#ff8a3d'],['#5f8fa6','#9c6a4a'],['#001521','#1a0800'],['#0d2230','#2a160b'],['#0a2c3c','#2a160b'],['#0f3446','#3a1b0c'],['#06141c','#160a05'],['#245a7066','#5a2c1466'],['#2a6f8660','#86482a60'],['#4d7c9370','#93624d70'],['#4d7c9360','#93624d60'],['#3f6e8666','#86523f66'],['#3f6e8685','#86523f85'],['#2b5468','#68442b'],['#05080c','#0c0c0e'],['#0a1017','#141110'],['#0b1219','#15120f'],['#081018','#13100d'],['#060b10','#0f0c0a'],['#020508c9','#080504c9'],['#e3f1f9','#f3e4da'],['#eef8ff','#f8ebe2'],['#e6f4fb','#f3e4da'],['#dcf3ff','#f3dfd0'],['#c9f9ff','#efd3bd'],['#17a9da','#b53030'],['#e9fbff','#f9efe9'],['#bfe9ff1f','#ffa76b1f'],['#a7bccb','#bfa697'],['#9aaebd','#b39a8a'],['#93a6b5','#a88f7f'],['#7f95a5','#8f786a'],['#adc2d0','#c4ab9b'],['#b9cbd7','#d0b8a8'],['#a8bccb','#c0a595'],['#8ea3b2','#a58c7c'],['#93a8b7','#a88f7f'],['#b6c8d4','#cdb5a6'],['#a0b5c4','#b89f8f'],['#a2b7c6','#baa190'],['#d8ecf6','#efdacc'],['#d6ebf7','#efdacc'],['#dcebf5','#f2ddcf'],['#cfe2ee','#e8d1c2'],['#8ba1b0','#a38a7a'],['#a9bdcb','#c1a696'],['#b2c6d4','#cab1a1'],['#6f8796','#8a6e60'],['#7e93a2','#977d6e']]; // Forever Twins cyan -> Rune Pit ember / lava (hue of the Ordinal Rush table moved toward red; accent #d64545)
let css = ft.css; for (const [from, to] of RECOLOUR) css = css.split(from).join(to);
css = css.replace(/\.coin\.inf\{[^}]*\}/, '') + '\n.coin{background:radial-gradient(circle at 35% 30%,#ffe0a0,#d64545 70%);border-color:#ff8a3d;box-shadow:0 0 12px #d6454555}\n#loading p{color:#ff8a3d}\n.lab-list{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0 4px}.lab-item{display:flex;flex-direction:column;gap:3px;text-align:left;border:1px solid #883d4085;border-radius:8px;padding:10px 12px;min-height:60px;background:#1d1214;color:#f3e3d6}.lab-item b{font-size:13px}.lab-item small{font-size:11px;color:#b09a8c;line-height:1.3}.lab-item[aria-pressed=true]{border-color:#ff8a3d;background:#3a1712;box-shadow:0 0 0 1px #ff8a3d55}\n#modal .ab{flex-wrap:wrap}#modal .outline[aria-pressed=true]{border-color:#ff8a3d;color:#ff8a3d}#modal .outline[disabled]{opacity:.4}#modal h3{font-size:11px;letter-spacing:1.5px;color:#ff8a3d;margin:18px 0 6px}\n@media(max-width:560px){.lab-list{grid-template-columns:1fr}}\n' + '#fs{position:fixed;inset:0;z-index:40;background:#050304;display:flex;flex-direction:column}#fs[hidden]{display:none}\n#fsStage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:8px}#fsStage canvas{display:block;border-radius:10px;box-shadow:0 0 0 3px #7a2a22,0 0 40px #d6454533;touch-action:manipulation;cursor:pointer}\n#fsBar{display:flex;gap:6px;align-items:stretch;padding:8px max(10px,env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:#140c0d;border-top:1px solid #d6454555}\n#fsMain{display:flex;gap:6px;flex:0 0 auto}#fsMore{display:flex;gap:6px;flex:1 1 auto;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px}\n#fsBar .fb{flex:0 0 auto;min-width:64px;min-height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:1px solid #8a3a2a85;border-radius:9px;color:#f3e3d6;background:#221518;padding:4px 10px}\n#fsBar .fb b{font:900 13px Arial;letter-spacing:.5px;white-space:nowrap}#fsBar .fb small{font:600 9px Arial;color:#b09a8c;letter-spacing:.4px;white-space:nowrap}\n#fsBar .fb.primary{min-width:150px;background:linear-gradient(120deg,#ff8a3d,#d64545);color:#1a0505;border-color:#ffd0a0}#fsBar .fb.primary small{color:#4a1410}#fsBar .fb.primary b{font-size:16px}\n#fsBar .fb.gold{background:#3a1410;border-color:#d64545}#fsBar .fb.chip{background:#120b0c;cursor:default}#fsBar .fb.vol input{width:90px;accent-color:#d64545}#fsBar [hidden]{display:none!important}#fsBar .fb[aria-pressed=true]{border-color:#d64545;color:#ff8a3d}\nbody.fs-on #toast{z-index:60;bottom:auto;top:20px}body.fs-on #celebration{z-index:45}body.fs-on #featureBar{display:none}\n@media(max-width:760px){#fsBar{flex-direction:column}#fsMain{flex-wrap:wrap}#fsMain .fb{flex:1 1 30%}#fsMain .fb.primary{flex:1 1 100%;min-height:56px}#fsMore .fb{min-width:58px;padding:4px 8px}}\n';

const BODY = `
<div class="vignette"></div>
<header><a class="brand" href="#" aria-label="Rune Pit"><canvas class="brandmark" id="brandmark" width="68" height="68" aria-hidden="true"></canvas> RUNE PIT <span class="arcade">/ PARALLAX CASINO</span></a><div class="top-right"><span class="pill"><i></i> LAYR PLAY</span><button id="sound" class="icon" aria-label="Mute sound" aria-pressed="true">♫</button><button id="help" class="icon" aria-label="Ledger: the runes and what they pay">?</button><button id="fullscreenBtn" class="icon" aria-label="Full screen (F)">⛶</button><button id="settings" class="icon" aria-label="Settings">⚙</button></div></header>
<main><section class="intro"><p class="eyebrow">BITCOIN RUNES &nbsp; / &nbsp; SINCE BLOCK 840,000</p><h1>RUNE<br><em>PIT</em></h1><p class="tagline">Every symbol is a real rune,<br>etched into Bitcoin itself.</p><div class="edition"><span></span> ETCHED AT THE HALVING</div><div class="feature-list"><button data-info="free"><b>01</b><span>Etching Season<small>3+ Etchings · 8 free spins · 2×</small></span><i>↗</i></button><button data-info="vault"><b>02</b><span>The Airdrop<small>Open 3 of 9 crates</small></span><i>↗</i></button><button data-info="chain"><b>03</b><span>First Hundred<small>Lock early runes. Respin.</small></span><i>↗</i></button><button data-info="genesis"><b>04</b><span>To the Moon Jackpot<small>5 DOG•GO•TO•THE•MOON on the centre row</small></span><i>↗</i></button><button id="colsInfo"><b>05</b><span>The runes on the reels<small>Real names, numbers and etchings</small></span><i>↗</i></button><button id="holdersInfo"><b>06</b><span>Holder Pot<small>1% of paid bets, weekly</small></span><i>↗</i></button></div></section>
<aside class="session"><p class="eyebrow">YOUR SESSION</p><div class="session-row"><span>Spins</span><b id="spins">0</b></div><div class="session-row"><span>Total played</span><b id="wagered">0</b></div><div class="session-row"><span>Total paid out</span><b id="paidOut">0</b></div><div class="session-rule"></div><p class="eyebrow">TO THE MOON JACKPOT</p><p class="meter" id="meterSide">50,000</p><p class="eyebrow">HOLDER POT · THIS WEEK</p><p class="meter" id="potSide">0</p><button class="text-button" id="history">Chronicle ↗</button></aside>
<div class="machine-caption"><span class="live-dot"></span> <span id="status" role="status" aria-live="polite">ETCHED ON BITCOIN</span></div></main>
<section id="featureBar" hidden aria-live="polite" aria-label="Bonus feature"><div class="fb-head"><span class="eyebrow" id="fbTag">FEATURE</span><strong id="fbTitle"></strong><span id="fbInfo"></span></div><div id="fbBody"></div></section>
<footer class="console"><div class="credit"><label>LAYR BALANCE <button id="account" aria-label="View shared LAYR account">LAYR account</button></label><strong id="balance">0</strong><small>LAYR</small></div><div class="bet"><label>TOTAL BET <span>20 LINES</span></label><div class="stepper"><button id="minus" aria-label="Fewer sats: decrease bet">−</button><strong id="bet">100</strong><button id="plus" aria-label="More sats: increase bet">+</button></div></div><div class="last"><label id="winLabel">LAST WIN</label><strong id="lastWin">0</strong><small id="freeCount">LAYR</small><button id="gamble" class="gamble-btn" hidden>ETCH OR BURN ›</button></div><div class="actions"><button id="auto" class="secondary" aria-pressed="false">AUTO-MINT</button><button id="maxBet" class="secondary">MAX SATS</button><button id="spin" class="spin"><span id="spinText">ETCH</span> <span class="spin-icon">₿</span></button><button id="turbo" class="secondary" aria-pressed="false">TURBO</button></div><div class="utility"><button id="rules">LEDGER</button><button id="historyLink">CHRONICLE</button></div></footer>
<div id="fs" hidden><div id="fsStage"></div><nav id="fsBar" aria-label="Machine controls"><div id="fsMain"></div><div id="fsMore"></div></nav></div>
<div id="toast" role="status"></div><div id="celebration" aria-hidden="true"></div>
<dialog id="modal"><div class="modal-head"><span class="eyebrow" id="modalTag">RUNE PIT</span><button id="close" aria-label="Close dialog">×</button></div><div id="modalContent"></div></dialog>
<div id="loading" role="status"><canvas class="loader-mark" id="loaderMark" width="230" height="230" aria-hidden="true"></canvas><p id="loadMsg">LIGHTING THE FORGE</p><small>Rune Pit · ParallaX Casino</small></div><noscript><p class="noscript">Rune Pit needs JavaScript to run.</p></noscript>
`;


const art = readFileSync(join(MACHINE, 'art/art.js'), 'utf8');
const manifest = JSON.parse(readFileSync(join(MACHINE, 'art/manifest.json'), 'utf8'));
const artScript = `<script>${art}window.RP_MANIFEST=${JSON.stringify({ runes: manifest.runes, runestone: manifest.runestone })};</script>`;
const game = readFileSync(join(MACHINE, 'src/game.js'), 'utf8');
const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0d0809"><meta name="color-scheme" content="dark"><title>Rune Pit — ParallaX Casino machine</title><meta name="description" content="Rune Pit: a ParallaX Casino slot whose reels show real Bitcoin Runes."><style>${css}</style></head><body>${BODY}${layrAccount}\n${compat}\n${engine}\n${xlogo}\n${artScript}\n<script>${game}</script>\n</body></html>`;
const model = readFileSync(join(MACHINE, 'src/model.json'), 'utf8'); JSON.parse(model);

mkdirSync(join(MACHINE, 'dist'), { recursive: true }); mkdirSync(join(MACHINE, 'vendor'), { recursive: true });
writeFileSync(join(MACHINE, 'dist/rune-pit.html'), doc);
const pack = { ...PACK, model: b64gz(model), game: b64gz(doc), css };
const packJSON = asciiJSON(pack);
writeFileSync(join(MACHINE, 'pack.json'), packJSON);
writeFileSync(join(MACHINE, 'pack.js'), `/* Rune Pit as one PX_MACHINE_PACKS entry (same content as pack.json), loadable with a script tag. */\nwindow.RP_PACK=${packJSON};\n`);
// Test-page libraries, copied from the casino so the studio renders the cabinet exactly as the room's THREE build would.
const strip = s => s.slice(8, -9);
writeFileSync(join(MACHINE, 'vendor/three-subset.js'), '/* THREE subset used by the ParallaX machines (copied from the Forever Twins pack). */\n' + strip(three));
writeFileSync(join(MACHINE, 'vendor/software-renderer.js'), strip(softRenderer));
writeFileSync(join(MACHINE, 'vendor/xlogo.js'), strip(xlogo));
// The test page's ParallaxLAYRAccount stub: the same adapter, on its own storage keys, with a play balance. Never the casino's.
writeFileSync(join(MACHINE, 'vendor/layr-test-stub.js'), '/* TEST STUB of window.ParallaxLAYRAccount for the standalone Rune Pit page. It is the casino adapter with its own\n   storage keys, so it can never read or change a real casino balance. */\n' + strip(layrAccount).split("'xtrata.parallax.layr.account.v1'").join("'xtrata.parallax.test.rune-pit.layr.v1'").split("'xtrata.parallax.layr.lease.v1'").join("'xtrata.parallax.test.rune-pit.lease.v1'").split("LEGACY_KEY='royalflush_v2'").join("LEGACY_KEY='xtrata.parallax.test.none'").split("'xtrata-parallax-account-lock'").join("'xtrata-parallax-test-rune-pit-lock'"));
if (sha(readFileSync(CASINO)) !== casinoHash) throw Error('The casino file changed during the build (another session?). Nothing in it was written by this script.');
console.log(`game ${(doc.length / 1024).toFixed(0)} KB, model ${(model.length / 1024).toFixed(0)} KB, pack.json ${(packJSON.length / 1024).toFixed(0)} KB; engine sha256 ${sha(engine).slice(0, 16)}… OK; casino read-only (sha256 ${casinoHash.slice(0, 12)}… unchanged)`);
