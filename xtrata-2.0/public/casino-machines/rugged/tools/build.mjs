#!/usr/bin/env node
// Builds the Rugged machine inside its own folder. Reads only files in this folder; it never reads or writes the casino.
//   node tools/build.mjs
// Inputs:  src/game/*.js (the theme layer, joined in order), src/style.css, src/model.json (the packed cabinet, from
//          tools/build-cabinet.mjs), src/shared/* (the casino's shared parts, byte for byte: LAYR account adapter, browser check,
//          the Block Fortune v2 engine, XLOGO), art/art.js + art/manifest.json (from tools/make-art.mjs).
// Outputs: dist/rugged.html, pack.json + pack.js (one PX_MACHINE_PACKS entry), vendor/xlogo.js, vendor/layr-test-stub.js.
// The engine is checked against a fixed SHA-256 so the maths cannot drift.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import crypto from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MACHINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE_SHA256 = '7a5ae8482d70f1e09b7308103c52eb738f8e12a1fae36b9832488000a4f7b98e'; // Block Fortune v2, STATE_VERSION 2
const PACK = { name: 'Rugged', description: 'Rescued Stacks art · woven back', color: '#2a1408', accent: '#b5532c' };
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const b64gz = s => gzipSync(Buffer.from(s, 'utf8'), { level: 9 }).toString('base64');
const asciiJSON = v => JSON.stringify(v).replace(/[\u007f-￿]/g, ch => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));
const read = p => readFileSync(join(MACHINE, p), 'utf8');

const layrAccount = read('src/shared/layr-account.html'), xlogo = read('src/shared/xlogo.html'), engine = read('src/shared/engine.html');
const compatSrc = read('src/shared/compat.html');
if (!compatSrc.includes('Ordinal Rush needs ')) throw Error('compat.html: the product-name string was not found');
const compat = compatSrc.split('Ordinal Rush needs ').join('Rugged needs ');
if (sha(engine) !== ENGINE_SHA256) throw Error(`Engine changed: sha256 ${sha(engine)} != ${ENGINE_SHA256}.`);

const css = read('src/style.css');
const BODY = `
<div class="vignette"></div>
<header><a class="brand" href="#" aria-label="Rugged"><canvas class="brandmark" id="brandmark" width="68" height="68" aria-hidden="true"></canvas> RUGGED <span class="arcade">/ PARALLAX CASINO</span></a><div class="top-right"><span class="pill"><i></i> LAYR PLAY</span><button id="sound" class="icon" aria-label="Mute sound" aria-pressed="true">♫</button><button id="help" class="icon" aria-label="Catalogue and pays">?</button><button id="fullscreenBtn" class="icon" aria-label="Full screen (F)">⛶</button><button id="settings" class="icon" aria-label="Settings">⚙</button></div></header>
<main><section class="intro"><p class="eyebrow">RESCUED STACKS ART &nbsp; / &nbsp; WOVEN BACK</p><h1>RUG<br><em>GED</em></h1><p class="tagline">Art whose own link went dark,<br>woven back into rugs, forever on chain.</p><div class="edition"><span></span> NOTHING ON-CHAIN GETS RUGGED</div><div class="feature-list"><button data-info="free"><b>01</b><span>404<small>3+ broken frames · 8 free spins · 2×</small></span><i>↗</i></button><button data-info="vault"><b>02</b><span>Unroll<small>Unroll 3 of 9 rolled rugs</small></span><i>↗</i></button><button data-info="chain"><b>03</b><span>Fully Woven<small>Tie 15 bands. Respin.</small></span><i>↗</i></button><button data-info="genesis"><b>04</b><span>Magic Carpet Ride<small>5 Flying Carpets on the centre row</small></span><i>↗</i></button><button id="colsInfo"><b>05</b><span>The rescued rugs<small>Real twins, real dead links</small></span><i>↗</i></button><button id="holdersInfo"><b>06</b><span>Rescue Pot<small>1% of paid bets, weekly</small></span><i>↗</i></button></div></section>
<aside class="session"><p class="eyebrow">YOUR SESSION</p><div class="session-row"><span>Spins</span><b id="spins">0</b></div><div class="session-row"><span>Total played</span><b id="wagered">0</b></div><div class="session-row"><span>Total paid out</span><b id="paidOut">0</b></div><div class="session-rule"></div><p class="eyebrow">MAGIC CARPET RIDE</p><p class="meter" id="meterSide">50,000</p><p class="eyebrow">RESCUE POT · THIS WEEK</p><p class="meter" id="potSide">0</p><button class="text-button" id="history">Session history ↗</button></aside>
<div class="machine-caption"><span class="live-dot"></span> <span id="status" role="status" aria-live="polite">NOTHING ON-CHAIN GETS RUGGED</span></div></main>
<section id="featureBar" hidden aria-live="polite" aria-label="Bonus feature"><div class="fb-head"><span class="eyebrow" id="fbTag">FEATURE</span><strong id="fbTitle"></strong><span id="fbInfo"></span></div><div id="fbBody"></div></section>
<footer class="console"><div class="credit"><label>LAYR BALANCE <button id="account" aria-label="View shared LAYR account">LAYR account</button></label><strong id="balance">0</strong><small>LAYR</small></div><div class="bet"><label>KNOTS <span>20 LINES</span></label><div class="stepper"><button id="minus" aria-label="Fewer knots: decrease bet">−</button><strong id="bet">100</strong><button id="plus" aria-label="More knots: increase bet">+</button></div></div><div class="last"><label id="winLabel">LAST WIN</label><strong id="lastWin">0</strong><small id="freeCount">LAYR</small><button id="gamble" class="gamble-btn" hidden>PULL OR HOLD ›</button></div><div class="actions"><button id="auto" class="secondary" aria-pressed="false">AUTO-WEAVE</button><button id="maxBet" class="secondary">MAX KNOTS</button><button id="spin" class="spin"><span id="spinText">WEAVE</span> <span class="spin-icon">∞</span></button><button id="turbo" class="secondary" aria-pressed="false">TURBO</button></div><div class="utility"><button id="rules">CATALOGUE / PAYS</button><button id="historyLink">SESSION HISTORY</button></div></footer>
<div id="fs" hidden><div id="fsStage"></div><nav id="fsBar" aria-label="Machine controls"><div id="fsMain"></div><div id="fsMore"></div></nav></div>
<div id="toast" role="status"></div><div id="celebration" aria-hidden="true"></div>
<dialog id="modal"><div class="modal-head"><span class="eyebrow" id="modalTag">RUGGED</span><button id="close" aria-label="Close dialog">×</button></div><div id="modalContent"></div></dialog>
<div id="loading" role="status"><canvas class="loader-mark" id="loaderMark" width="230" height="230" aria-hidden="true"></canvas><p id="loadMsg">UNROLLING THE STALL</p><small>Rugged · ParallaX Casino</small></div><noscript><p class="noscript">Rugged needs JavaScript to run.</p></noscript>
`;

const art = read('art/art.js');
const manifest = JSON.parse(read('art/manifest.json'));
const artScript = `<script>${art}window.RUG_MANIFEST=${asciiJSON({ collections: manifest.collections.map(c => ({ key: c.key, tokens: c.tokens })) })};</script>`;
const parts = readdirSync(join(MACHINE, 'src/game')).filter(f => /^\d\d-.*\.js$/.test(f)).sort();
const game = parts.map(f => read(`src/game/${f}`)).join('\n');
new Function(game); // a syntax check of the joined theme layer
const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#120906"><meta name="color-scheme" content="dark"><title>Rugged — ParallaX Casino machine</title><meta name="description" content="Rugged: a ParallaX Casino slot that weaves rescued Stacks art back into rugs. Every symbol is real: Bitcoin Birds twins on Xtrata, the WELSH logo, the dead art link from the chain."><style>${css}</style></head><body>${BODY}${layrAccount}\n${compat}\n${engine}\n${xlogo}\n${artScript}\n<script>${game}</script>\n</body></html>`;
const model = read('src/model.json'); JSON.parse(model);

mkdirSync(join(MACHINE, 'dist'), { recursive: true }); mkdirSync(join(MACHINE, 'vendor'), { recursive: true });
writeFileSync(join(MACHINE, 'dist/rugged.html'), doc);
const pack = { ...PACK, model: b64gz(model), game: b64gz(doc), css };
const packJSON = asciiJSON(pack);
writeFileSync(join(MACHINE, 'pack.json'), packJSON);
writeFileSync(join(MACHINE, 'pack.js'), `/* Rugged as one PX_MACHINE_PACKS entry (same content as pack.json), loadable with a script tag. */\nwindow.RUG_PACK=${packJSON};\n`);
const strip = s => s.slice(8, -9);
writeFileSync(join(MACHINE, 'vendor/xlogo.js'), strip(xlogo));
// The test page's ParallaxLAYRAccount stub: the same adapter, on its own storage keys, with a play balance. Never the casino's.
writeFileSync(join(MACHINE, 'vendor/layr-test-stub.js'), '/* TEST STUB of window.ParallaxLAYRAccount for the standalone Rugged page. It is the casino adapter with its own\n   storage keys, so it can never read or change a real casino balance. */\n' + strip(layrAccount).split("'xtrata.parallax.layr.account.v1'").join("'xtrata.parallax.test.rugged.layr.v1'").split("'xtrata.parallax.layr.lease.v1'").join("'xtrata.parallax.test.rugged.lease.v1'").split("LEGACY_KEY='royalflush_v2'").join("LEGACY_KEY='xtrata.parallax.test.none'").split("'xtrata-parallax-account-lock'").join("'xtrata-parallax-test-rugged-lock'"));
console.log(`game ${(doc.length / 1024).toFixed(0)} KB (${parts.join(', ')}), model ${(model.length / 1024).toFixed(0)} KB, pack.json ${(packJSON.length / 1024).toFixed(0)} KB; engine sha256 ${sha(engine).slice(0, 16)}… OK`);
