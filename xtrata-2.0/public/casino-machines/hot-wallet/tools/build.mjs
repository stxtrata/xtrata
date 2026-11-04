#!/usr/bin/env node
// Builds the Hot Wallet machine into its own folder (this folder). Never writes to the casino.
//   node tools/build.mjs            (run tools/build-art.mjs first if art/facts.json changed)
//   PX_CASINO_HTML=/path/to/casino/index.html node tools/build.mjs
// Reads public/casino/index.html for reference only: the shared parts (LAYR account adapter, browser check, the Block
// Fortune v2 engine, XLOGO, and for the test page THREE and the SoftwareRenderer) are copied byte for byte out of the
// Forever Twins pack, and the engine is checked against a fixed SHA-256 so the maths cannot drift. The shared CSS is the
// Forever Twins stylesheet with its cyan palette turned to crimson (recolour()).
// Writes: pack.json + pack.js (one PX_MACHINE_PACKS entry), vendor/ (test-page libraries), dist/hot-wallet.html.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import crypto from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url)), MACHINE = resolve(TOOLS, '..'), REPO = resolve(MACHINE, '../../..');
const CASINO = process.env.PX_CASINO_HTML || (existsSync(join(REPO, 'public/casino/index.html')) ? join(REPO, 'public/casino/index.html') : '/mnt/user-data/uploads/xtrata/xtrata-2.0/public/casino/index.html');
const ENGINE_SHA256 = '7a5ae8482d70f1e09b7308103c52eb738f8e12a1fae36b9832488000a4f7b98e'; // Block Fortune v2, STATE_VERSION 2
const PACK = { name: 'Hot Wallet', description: 'The Heist Museum · real exchange hacks, 2011 to 2026', color: '#1a0d0a', accent: '#e11d48' };
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
const compat = slice("<script>(function(){\n 'use strict';\n function show(").replace("'Block Fortune needs '", "'Hot Wallet needs '");
const engine = slice('<script>/* Block Fortune v2 engine.');
const xlogo = slice('<script>/* Xtrata logo, traced');
const three = slice('<script>var THREE='), softRenderer = slice('<script>/* Canvas compatibility renderer');
if (sha(engine) !== ENGINE_SHA256) throw Error(`Engine changed: sha256 ${sha(engine)} != ${ENGINE_SHA256}.`);

// Turns the Forever Twins cyan (hue 175-235) into crimson and leaves every other colour alone. Lightness and saturation are kept.
function hslOf(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s = 0; if (d) { s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s, l]; }
function rgbOf(h, s, l) { const f = n => { const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l); return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return [f(0), f(8), f(4)].map(v => Math.round(v * 255)); }
function shiftRGB(r, g, b) { const [h, s, l] = hslOf(r, g, b); if (s < .08 || h < 175 || h > 235) return [r, g, b]; return rgbOf(((346 + (h - 200) * .12) % 360 + 360) % 360, Math.min(1, s * .98), l); }
const hex2 = n => n.toString(16).padStart(2, '0');
function recolour(css) {
  css = css.replace(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6})(?![0-9a-fA-F])/g, (m, h) => { const [r, g, b] = shiftRGB(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)); return '#' + hex2(r) + hex2(g) + hex2(b) + h.slice(6); });
  css = css.replace(/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])(?![0-9a-fA-F])/g, (m, a, b2, c) => { const [r, g, b] = shiftRGB(parseInt(a + a, 16), parseInt(b2 + b2, 16), parseInt(c + c, 16)); return '#' + hex2(r) + hex2(g) + hex2(b); });
  css = css.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+\s*)?\)/g, (m, r, g, b, a) => { const [R, G, B] = shiftRGB(+r, +g, +b); return a ? `rgba(${R},${G},${B}${a})` : `rgb(${R},${G},${B})`; });
  return css;
}
let css = recolour(ft.css);
css = css.replace(/\.coin\.inf\{[^}]*\}/, '') + '\n.co-logo{display:inline-flex;align-items:center;justify-content:center;border-radius:5px;padding:4px 8px;margin:0 8px 4px 0;border:1px solid #0007;box-shadow:0 1px 3px #0006;vertical-align:middle;max-width:132px}.co-logo img{display:block;max-width:116px;max-height:26px;width:auto;height:auto}.co-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:8px 0 12px}.co-cell{display:flex;flex-direction:column;gap:4px;align-items:flex-start;padding:8px;border:1px solid #c9a46a44;border-radius:8px;background:#0b060588}.co-cell b{font-size:13px}.fact .co-logo{margin-bottom:6px}\n.coin{background:radial-gradient(circle at 35% 30%,#fff4dc,#ecd29a 55%,#c9a46a);border-color:#ecd29a;box-shadow:0 0 12px #e11d4855}\n#loading p{color:#ecd29a}\n.lab-list{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0 4px}.lab-item{display:flex;flex-direction:column;gap:3px;text-align:left;border:1px solid #7d623885;border-radius:8px;padding:10px 12px;min-height:60px;background:#160d09;color:#fff4dc}.lab-item b{font-size:13px}.lab-item small{font-size:11px;color:#b79c6a;line-height:1.3}.lab-item[aria-pressed=true]{border-color:#ecd29a;background:#3a0f1a;box-shadow:0 0 0 1px #ecd29a55}\n#modal .ab{flex-wrap:wrap}#modal .outline[aria-pressed=true]{border-color:#ecd29a;color:#ecd29a}#modal .outline[disabled]{opacity:.4}#modal h3{font-size:11px;letter-spacing:1.5px;color:#ecd29a;margin:18px 0 6px}\n#modal .fact{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}#modal .fact-tile{border-radius:8px;box-shadow:0 0 0 2px #7d6238;background:#000}#modal .srcs{margin:4px 0 8px;padding-left:18px;font-size:12px}#modal .srcs a{color:#ecd29a;word-break:break-word}\n@media(max-width:560px){.lab-list{grid-template-columns:1fr}}\n' + '#fs{position:fixed;inset:0;z-index:40;background:#0a0504;display:flex;flex-direction:column}#fs[hidden]{display:none}\n#fsStage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:8px}#fsStage canvas{display:block;border-radius:10px;box-shadow:0 0 0 3px #7d6238,0 0 40px #e11d4833;touch-action:manipulation;cursor:pointer}\n#fsBar{display:flex;gap:6px;align-items:stretch;padding:8px max(10px,env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:#120907;border-top:1px solid #c9a46a55}\n#fsMain{display:flex;gap:6px;flex:0 0 auto}#fsMore{display:flex;gap:6px;flex:1 1 auto;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px}\n#fsBar .fb{flex:0 0 auto;min-width:64px;min-height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:1px solid #7d623885;border-radius:9px;color:#fff4dc;background:#1b0f0b;padding:4px 10px}\n#fsBar .fb b{font:900 13px Arial;letter-spacing:.5px;white-space:nowrap}#fsBar .fb small{font:600 9px Arial;color:#b79c6a;letter-spacing:.4px;white-space:nowrap}\n#fsBar .fb.primary{min-width:150px;background:linear-gradient(120deg,#ff5c7c,#e11d48);color:#fff4dc;border-color:#ecd29a}#fsBar .fb.primary small{color:#ffd0da}#fsBar .fb.primary b{font-size:16px}\n#fsBar .fb.gold{background:#2a0f14;border-color:#e11d48}#fsBar .fb.chip{background:#0a0504;cursor:default}#fsBar .fb.vol input{width:90px;accent-color:#e11d48}#fsBar [hidden]{display:none!important}#fsBar .fb[aria-pressed=true]{border-color:#ecd29a;color:#ecd29a}\nbody.fs-on #toast{z-index:60;bottom:auto;top:20px}body.fs-on #celebration{z-index:45}body.fs-on #featureBar{display:none}\n@media(max-width:760px){#fsBar{flex-direction:column}#fsMain{flex-wrap:wrap}#fsMain .fb{flex:1 1 30%}#fsMain .fb.primary{flex:1 1 100%;min-height:56px}#fsMore .fb{min-width:58px;padding:4px 8px}}\n';

const BODY = `
<div class="vignette"></div>
<header><a class="brand" href="#" aria-label="Hot Wallet"><canvas class="brandmark" id="brandmark" width="68" height="68" aria-hidden="true"></canvas> HOT WALLET <span class="arcade">/ PARALLAX CASINO</span></a><div class="top-right"><span class="pill"><i></i> LAYR PLAY</span><button id="sound" class="icon" aria-label="Mute sound" aria-pressed="true">♫</button><button id="help" class="icon" aria-label="The guide: the pays and the rules">?</button><button id="fullscreenBtn" class="icon" aria-label="Full screen (F)">⛶</button><button id="settings" class="icon" aria-label="Settings">⚙</button></div></header>
<main><section class="intro"><p class="eyebrow">THE HEIST MUSEUM &nbsp; / &nbsp; 2011 TO 2026</p><h1>HOT<br><em>WALLET</em></h1><p class="tagline">Every tile is a real exchange hack:<br>what was taken, how, and what it taught us.</p><div class="edition"><span></span> THE MUSEUM IS OPEN</div><div class="feature-list"><button data-info="free"><b>01</b><span>Time Machine<small>3+ Mt. Gox · 8 free spins · 2×</small></span><i>↗</i></button><button data-info="vault"><b>02</b><span>The Empty Vaults<small>Open 3 of 9 cold-storage vaults</small></span><i>↗</i></button><button data-info="chain"><b>03</b><span>The Timeline<small>Pin real headlines to the wall. Respin.</small></span><i>↗</i></button><button data-info="genesis"><b>04</b><span>Heist of the Century<small>5 BINANCE 2026 on the centre row</small></span><i>↗</i></button><button id="colsInfo"><b>05</b><span>The exhibits<small>Every tile, with its sources</small></span><i>↗</i></button><button id="timelineInfo"><b>06</b><span>The timeline<small>Sixteen hacks, 2011 to 2026</small></span><i>↗</i></button><button id="lessonsInfo"><b>07</b><span>Lessons and words<small>Not your keys, not your coins</small></span><i>↗</i></button><button id="holdersInfo"><b>08</b><span>Cold Storage Pot<small>1% of paid bets, every week</small></span><i>↗</i></button></div></section>
<aside class="session"><p class="eyebrow">YOUR SESSION</p><div class="session-row"><span>Spins</span><b id="spins">0</b></div><div class="session-row"><span>Total played</span><b id="wagered">0</b></div><div class="session-row"><span>Total paid out</span><b id="paidOut">0</b></div><div class="session-rule"></div><p class="eyebrow">HEIST OF THE CENTURY</p><p class="meter" id="meterSide">50,000</p><p class="eyebrow">COLD STORAGE POT · THIS WEEK</p><p class="meter" id="potSide">0</p><button class="text-button" id="history">Log ↗</button></aside>
<div class="machine-caption"><span class="live-dot"></span> <span id="status" role="status" aria-live="polite">THE MUSEUM IS OPEN</span></div></main>
<section id="featureBar" hidden aria-live="polite" aria-label="Bonus feature"><div class="fb-head"><span class="eyebrow" id="fbTag">FEATURE</span><strong id="fbTitle"></strong><span id="fbInfo"></span></div><div id="fbBody"></div></section>
<footer class="console"><div class="credit"><label>LAYR BALANCE <button id="account" aria-label="View shared LAYR account">LAYR account</button></label><strong id="balance">0</strong><small>LAYR</small></div><div class="bet"><label>TOTAL BET <span>20 LINES</span></label><div class="stepper"><button id="minus" aria-label="Fewer years: decrease bet">−</button><strong id="bet">100</strong><button id="plus" aria-label="More years: increase bet">+</button></div></div><div class="last"><label id="winLabel">LAST WIN</label><strong id="lastWin">0</strong><small id="freeCount">LAYR</small><button id="gamble" class="gamble-btn" hidden>HOT OR COLD ›</button></div><div class="actions"><button id="auto" class="secondary" aria-pressed="false">AUTO-TOUR</button><button id="maxBet" class="secondary">MAX YEARS</button><button id="spin" class="spin"><span id="spinText">TIME TRAVEL</span> <span class="spin-icon">⟲</span></button><button id="turbo" class="secondary" aria-pressed="false">TURBO</button></div><div class="utility"><button id="rules">GUIDE</button><button id="historyLink">LOG</button></div></footer>
<div id="fs" hidden><div id="fsStage"></div><nav id="fsBar" aria-label="Machine controls"><div id="fsMain"></div><div id="fsMore"></div></nav></div>
<div id="toast" role="status"></div><div id="celebration" aria-hidden="true"></div>
<dialog id="modal"><div class="modal-head"><span class="eyebrow" id="modalTag">HOT WALLET</span><button id="close" aria-label="Close dialog">×</button></div><div id="modalContent"></div></dialog>
<div id="loading" role="status"><canvas class="loader-mark" id="loaderMark" width="230" height="230" aria-hidden="true"></canvas><p id="loadMsg">OPENING THE MUSEUM</p><small>Hot Wallet · ParallaX Casino</small></div><noscript><p class="noscript">Hot Wallet needs JavaScript to run.</p></noscript>
`;


const factsJs = readFileSync(join(MACHINE, 'art/facts.js'), 'utf8');
const artScript = `<script>${factsJs}</script>`;
const game = readFileSync(join(MACHINE, 'src/game.js'), 'utf8');
const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0a0504"><meta name="color-scheme" content="dark"><title>Hot Wallet — ParallaX Casino machine</title><meta name="description" content="Hot Wallet: a ParallaX Casino slot set in The Heist Museum. Every reel tile is a real, sourced exchange hack from 2011 to 2026."><style>${css}</style></head><body>${BODY}${layrAccount}\n${compat}\n${engine}\n${xlogo}\n${artScript}\n<script>${game}</script>\n</body></html>`;
const model = readFileSync(join(MACHINE, 'src/model.json'), 'utf8'); JSON.parse(model);

mkdirSync(join(MACHINE, 'dist'), { recursive: true }); mkdirSync(join(MACHINE, 'vendor'), { recursive: true });
writeFileSync(join(MACHINE, 'dist/hot-wallet.html'), doc);
const pack = { ...PACK, model: b64gz(model), game: b64gz(doc), css };
const packJSON = asciiJSON(pack);
writeFileSync(join(MACHINE, 'pack.json'), packJSON);
writeFileSync(join(MACHINE, 'pack.js'), `/* Hot Wallet as one PX_MACHINE_PACKS entry (same content as pack.json), loadable with a script tag. */\nwindow.HW_PACK=${packJSON};\n`);
// Test-page libraries, copied from the casino so the studio renders the cabinet exactly as the room's THREE build would.
const strip = s => s.slice(8, -9);
writeFileSync(join(MACHINE, 'vendor/three-subset.js'), '/* THREE subset used by the ParallaX machines (copied from the Forever Twins pack). */\n' + strip(three));
writeFileSync(join(MACHINE, 'vendor/software-renderer.js'), strip(softRenderer));
writeFileSync(join(MACHINE, 'vendor/xlogo.js'), strip(xlogo));
// The test page's ParallaxLAYRAccount stub: the same adapter, on its own storage keys, with a play balance. Never the casino's.
writeFileSync(join(MACHINE, 'vendor/layr-test-stub.js'), '/* TEST STUB of window.ParallaxLAYRAccount for the standalone Hot Wallet page. It is the casino adapter with its own\n   storage keys, so it can never read or change a real casino balance. */\n' + strip(layrAccount).split("'xtrata.parallax.layr.account.v1'").join("'xtrata.parallax.test.hot-wallet.layr.v1'").split("'xtrata.parallax.layr.lease.v1'").join("'xtrata.parallax.test.hot-wallet.lease.v1'").split("LEGACY_KEY='royalflush_v2'").join("LEGACY_KEY='xtrata.parallax.test.none'").split("'xtrata-parallax-account-lock'").join("'xtrata-parallax-test-hot-wallet-lock'"));
if (sha(readFileSync(CASINO)) !== casinoHash) throw Error('The casino file changed during the build (another session?). Nothing in it was written by this script.');
console.log(`game ${(doc.length / 1024).toFixed(0)} KB, model ${(model.length / 1024).toFixed(0)} KB, pack.json ${(packJSON.length / 1024).toFixed(0)} KB; engine sha256 ${sha(engine).slice(0, 16)}… OK; casino read-only (sha256 ${casinoHash.slice(0, 12)}… unchanged)`);
