#!/usr/bin/env node
// Builds the Mempool Madness machine into its own folder (this folder). Never writes to the casino.
//   node tools/build.mjs            (run tools/build-art.mjs first if the mempool snapshot changed)
//   PX_CASINO_HTML=/path/to/casino/index.html node tools/build.mjs
// Reads public/casino/index.html for reference only: the shared parts (LAYR account adapter, browser check, the Block
// Fortune v2 engine, XLOGO, and for the test page THREE and the SoftwareRenderer) are copied byte for byte out of the
// Forever Twins pack, and the engine is checked against a fixed SHA-256 so the maths cannot drift. The shared CSS is the
// Forever Twins stylesheet with its cyan palette turned to radar green (recolour()).
// Writes: pack.json + pack.js (one PX_MACHINE_PACKS entry), vendor/ (test-page libraries), dist/mempool-madness.html.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import crypto from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url)), MACHINE = resolve(TOOLS, '..'), REPO = resolve(MACHINE, '../../..');
const CASINO = process.env.PX_CASINO_HTML || (existsSync(join(REPO, 'public/casino/index.html')) ? join(REPO, 'public/casino/index.html') : '/mnt/user-data/uploads/xtrata/xtrata-2.0/public/casino/index.html');
const ENGINE_SHA256 = '7a5ae8482d70f1e09b7308103c52eb738f8e12a1fae36b9832488000a4f7b98e'; // Block Fortune v2, STATE_VERSION 2
const PACK = { name: 'Mempool Madness', description: 'Bitcoin mempool · live fee reels', color: '#0b130f', accent: '#14f195' };
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
const compat = slice("<script>(function(){\n 'use strict';\n function show(").replace("'Block Fortune needs '", "'Mempool Madness needs '");
const engine = slice('<script>/* Block Fortune v2 engine.');
const xlogo = slice('<script>/* Xtrata logo, traced');
const three = slice('<script>var THREE='), softRenderer = slice('<script>/* Canvas compatibility renderer');
if (sha(engine) !== ENGINE_SHA256) throw Error(`Engine changed: sha256 ${sha(engine)} != ${ENGINE_SHA256}.`);

// Turns the Forever Twins cyan (hue 175-235) into radar green and leaves every other colour alone. Lightness and saturation are kept.
function hslOf(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s = 0; if (d) { s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s, l]; }
function rgbOf(h, s, l) { const f = n => { const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l); return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return [f(0), f(8), f(4)].map(v => Math.round(v * 255)); }
function shiftRGB(r, g, b) { const [h, s, l] = hslOf(r, g, b); if (s < .08 || h < 175 || h > 235) return [r, g, b]; return rgbOf(152 + (h - 200) * .22, Math.min(1, s * .98), l); }
const hex2 = n => n.toString(16).padStart(2, '0');
function recolour(css) {
  css = css.replace(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6})(?![0-9a-fA-F])/g, (m, h) => { const [r, g, b] = shiftRGB(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)); return '#' + hex2(r) + hex2(g) + hex2(b) + h.slice(6); });
  css = css.replace(/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])(?![0-9a-fA-F])/g, (m, a, b2, c) => { const [r, g, b] = shiftRGB(parseInt(a + a, 16), parseInt(b2 + b2, 16), parseInt(c + c, 16)); return '#' + hex2(r) + hex2(g) + hex2(b); });
  css = css.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+\s*)?\)/g, (m, r, g, b, a) => { const [R, G, B] = shiftRGB(+r, +g, +b); return a ? `rgba(${R},${G},${B}${a})` : `rgb(${R},${G},${B})`; });
  return css;
}
let css = recolour(ft.css);
css = css.replace(/\.coin\.inf\{[^}]*\}/, '') + '\n.coin{background:radial-gradient(circle at 35% 30%,#e9fff6,#14f195 70%);border-color:#7dffc8;box-shadow:0 0 12px #14f19555}\n#loading p{color:#7dffc8}\n.lab-list{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0 4px}.lab-item{display:flex;flex-direction:column;gap:3px;text-align:left;border:1px solid #2f8f6885;border-radius:8px;padding:10px 12px;min-height:60px;background:#0c1511;color:#d8fff0}.lab-item b{font-size:13px}.lab-item small{font-size:11px;color:#7fb59d;line-height:1.3}.lab-item[aria-pressed=true]{border-color:#7dffc8;background:#08301f;box-shadow:0 0 0 1px #7dffc855}\n#modal .ab{flex-wrap:wrap}#modal .outline[aria-pressed=true]{border-color:#7dffc8;color:#7dffc8}#modal .outline[disabled]{opacity:.4}#modal h3{font-size:11px;letter-spacing:1.5px;color:#7dffc8;margin:18px 0 6px}\n@media(max-width:560px){.lab-list{grid-template-columns:1fr}}\n' + '#fs{position:fixed;inset:0;z-index:40;background:#030806;display:flex;flex-direction:column}#fs[hidden]{display:none}\n#fsStage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:8px}#fsStage canvas{display:block;border-radius:10px;box-shadow:0 0 0 3px #1a7a52,0 0 40px #14f19533;touch-action:manipulation;cursor:pointer}\n#fsBar{display:flex;gap:6px;align-items:stretch;padding:8px max(10px,env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:#08110d;border-top:1px solid #14f19555}\n#fsMain{display:flex;gap:6px;flex:0 0 auto}#fsMore{display:flex;gap:6px;flex:1 1 auto;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px}\n#fsBar .fb{flex:0 0 auto;min-width:64px;min-height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:1px solid #2f8f6885;border-radius:9px;color:#d8fff0;background:#0e1a14;padding:4px 10px}\n#fsBar .fb b{font:900 13px Arial;letter-spacing:.5px;white-space:nowrap}#fsBar .fb small{font:600 9px Arial;color:#7fb59d;letter-spacing:.4px;white-space:nowrap}\n#fsBar .fb.primary{min-width:150px;background:linear-gradient(120deg,#7dffc8,#14f195);color:#02140b;border-color:#d8fff0}#fsBar .fb.primary small{color:#0a3a24}#fsBar .fb.primary b{font-size:16px}\n#fsBar .fb.gold{background:#0d2a1d;border-color:#14f195}#fsBar .fb.chip{background:#060d0a;cursor:default}#fsBar .fb.vol input{width:90px;accent-color:#14f195}#fsBar [hidden]{display:none!important}#fsBar .fb[aria-pressed=true]{border-color:#14f195;color:#7dffc8}\nbody.fs-on #toast{z-index:60;bottom:auto;top:20px}body.fs-on #celebration{z-index:45}body.fs-on #featureBar{display:none}\n@media(max-width:760px){#fsBar{flex-direction:column}#fsMain{flex-wrap:wrap}#fsMain .fb{flex:1 1 30%}#fsMain .fb.primary{flex:1 1 100%;min-height:56px}#fsMore .fb{min-width:58px;padding:4px 8px}}\n';

const BODY = `
<div class="vignette"></div>
<header><a class="brand" href="#" aria-label="Mempool Madness"><canvas class="brandmark" id="brandmark" width="68" height="68" aria-hidden="true"></canvas> MEMPOOL MADNESS <span class="arcade">/ PARALLAX CASINO</span></a><div class="top-right"><span class="pill"><i></i> LAYR PLAY</span><button id="sound" class="icon" aria-label="Mute sound" aria-pressed="true">♫</button><button id="help" class="icon" aria-label="Fees: the pays and the rules">?</button><button id="fullscreenBtn" class="icon" aria-label="Full screen (F)">⛶</button><button id="settings" class="icon" aria-label="Settings">⚙</button></div></header>
<main><section class="intro"><p class="eyebrow">BITCOIN MEMPOOL &nbsp; / &nbsp; LIVE FROM MEMPOOL.SPACE</p><h1>MEMPOOL<br><em>MADNESS</em></h1><p class="tagline">Every symbol is a real fee,<br>a real transaction, a real block.</p><div class="edition"><span></span> EVERYONE WAITS FOR THE NEXT BLOCK</div><div class="feature-list"><button data-info="free"><b>01</b><span>Rush Hour<small>3+ Fee spikes · 8 free spins · 2×</small></span><i>↗</i></button><button data-info="vault"><b>02</b><span>Accelerate<small>Boost 3 of 9 stuck transactions</small></span><i>↗</i></button><button data-info="chain"><b>03</b><span>Block Template<small>Pack pending transactions. Respin.</small></span><i>↗</i></button><button data-info="genesis"><b>04</b><span>Block Found Jackpot<small>5 NEXT BLOCK on the centre row</small></span><i>↗</i></button><button id="colsInfo"><b>05</b><span>The data on the reels<small>Real fees, whales and transactions</small></span><i>↗</i></button><button id="holdersInfo"><b>06</b><span>Daily Pot<small>1% of paid bets, every 144 blocks</small></span><i>↗</i></button></div></section>
<aside class="session"><p class="eyebrow">YOUR SESSION</p><div class="session-row"><span>Spins</span><b id="spins">0</b></div><div class="session-row"><span>Total played</span><b id="wagered">0</b></div><div class="session-row"><span>Total paid out</span><b id="paidOut">0</b></div><div class="session-rule"></div><p class="eyebrow">BLOCK FOUND JACKPOT</p><p class="meter" id="meterSide">50,000</p><p class="eyebrow">DAILY POT · THIS PERIOD</p><p class="meter" id="potSide">0</p><button class="text-button" id="history">Log ↗</button></aside>
<div class="machine-caption"><span class="live-dot"></span> <span id="status" role="status" aria-live="polite">EVERYONE WAITS FOR THE NEXT BLOCK</span></div></main>
<section id="featureBar" hidden aria-live="polite" aria-label="Bonus feature"><div class="fb-head"><span class="eyebrow" id="fbTag">FEATURE</span><strong id="fbTitle"></strong><span id="fbInfo"></span></div><div id="fbBody"></div></section>
<footer class="console"><div class="credit"><label>LAYR BALANCE <button id="account" aria-label="View shared LAYR account">LAYR account</button></label><strong id="balance">0</strong><small>LAYR</small></div><div class="bet"><label>TOTAL BET <span>20 LINES</span></label><div class="stepper"><button id="minus" aria-label="Lower fee: decrease bet">−</button><strong id="bet">100</strong><button id="plus" aria-label="Raise fee: increase bet">+</button></div></div><div class="last"><label id="winLabel">LAST WIN</label><strong id="lastWin">0</strong><small id="freeCount">LAYR</small><button id="gamble" class="gamble-btn" hidden>CONFIRM OR EVICT ›</button></div><div class="actions"><button id="auto" class="secondary" aria-pressed="false">AUTO-BUMP</button><button id="maxBet" class="secondary">MAX FEE</button><button id="spin" class="spin"><span id="spinText">BROADCAST</span> <span class="spin-icon">₿</span></button><button id="turbo" class="secondary" aria-pressed="false">TURBO</button></div><div class="utility"><button id="rules">FEES</button><button id="historyLink">LOG</button></div></footer>
<div id="fs" hidden><div id="fsStage"></div><nav id="fsBar" aria-label="Machine controls"><div id="fsMain"></div><div id="fsMore"></div></nav></div>
<div id="toast" role="status"></div><div id="celebration" aria-hidden="true"></div>
<dialog id="modal"><div class="modal-head"><span class="eyebrow" id="modalTag">MEMPOOL MADNESS</span><button id="close" aria-label="Close dialog">×</button></div><div id="modalContent"></div></dialog>
<div id="loading" role="status"><canvas class="loader-mark" id="loaderMark" width="230" height="230" aria-hidden="true"></canvas><p id="loadMsg">WATCHING THE MEMPOOL</p><small>Mempool Madness · ParallaX Casino</small></div><noscript><p class="noscript">Mempool Madness needs JavaScript to run.</p></noscript>
`;


const snapshot = readFileSync(join(MACHINE, 'art/snapshot.js'), 'utf8');
const artScript = `<script>${snapshot}</script>`;
const game = readFileSync(join(MACHINE, 'src/game.js'), 'utf8');
const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#030806"><meta name="color-scheme" content="dark"><title>Mempool Madness — ParallaX Casino machine</title><meta name="description" content="Mempool Madness: a ParallaX Casino slot whose reels show the live Bitcoin mempool."><style>${css}</style></head><body>${BODY}${layrAccount}\n${compat}\n${engine}\n${xlogo}\n${artScript}\n<script>${game}</script>\n</body></html>`;
const model = readFileSync(join(MACHINE, 'src/model.json'), 'utf8'); JSON.parse(model);

mkdirSync(join(MACHINE, 'dist'), { recursive: true }); mkdirSync(join(MACHINE, 'vendor'), { recursive: true });
writeFileSync(join(MACHINE, 'dist/mempool-madness.html'), doc);
const pack = { ...PACK, model: b64gz(model), game: b64gz(doc), css };
const packJSON = asciiJSON(pack);
writeFileSync(join(MACHINE, 'pack.json'), packJSON);
writeFileSync(join(MACHINE, 'pack.js'), `/* Mempool Madness as one PX_MACHINE_PACKS entry (same content as pack.json), loadable with a script tag. */\nwindow.MM_PACK=${packJSON};\n`);
// Test-page libraries, copied from the casino so the studio renders the cabinet exactly as the room's THREE build would.
const strip = s => s.slice(8, -9);
writeFileSync(join(MACHINE, 'vendor/three-subset.js'), '/* THREE subset used by the ParallaX machines (copied from the Forever Twins pack). */\n' + strip(three));
writeFileSync(join(MACHINE, 'vendor/software-renderer.js'), strip(softRenderer));
writeFileSync(join(MACHINE, 'vendor/xlogo.js'), strip(xlogo));
// The test page's ParallaxLAYRAccount stub: the same adapter, on its own storage keys, with a play balance. Never the casino's.
writeFileSync(join(MACHINE, 'vendor/layr-test-stub.js'), '/* TEST STUB of window.ParallaxLAYRAccount for the standalone Mempool Madness page. It is the casino adapter with its own\n   storage keys, so it can never read or change a real casino balance. */\n' + strip(layrAccount).split("'xtrata.parallax.layr.account.v1'").join("'xtrata.parallax.test.mempool-madness.layr.v1'").split("'xtrata.parallax.layr.lease.v1'").join("'xtrata.parallax.test.mempool-madness.lease.v1'").split("LEGACY_KEY='royalflush_v2'").join("LEGACY_KEY='xtrata.parallax.test.none'").split("'xtrata-parallax-account-lock'").join("'xtrata-parallax-test-mempool-madness-lock'"));
if (sha(readFileSync(CASINO)) !== casinoHash) throw Error('The casino file changed during the build (another session?). Nothing in it was written by this script.');
console.log(`game ${(doc.length / 1024).toFixed(0)} KB, model ${(model.length / 1024).toFixed(0)} KB, pack.json ${(packJSON.length / 1024).toFixed(0)} KB; engine sha256 ${sha(engine).slice(0, 16)}… OK; casino read-only (sha256 ${casinoHash.slice(0, 12)}… unchanged)`);
