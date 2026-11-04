#!/usr/bin/env node
// Builds the Degen City machine inside its own folder. Reads only files in this folder; it never reads or writes the casino.
//   node tools/build.mjs
// Inputs:  src/game.js, src/style.css, src/model.json, src/shared/* (the casino's shared parts, byte for byte: LAYR account adapter,
//          browser check, the Block Fortune v2 engine, XLOGO), art/art.js + art/manifest.json.
// Outputs: dist/degen-city.html, pack.json + pack.js (one PX_MACHINE_PACKS entry), vendor/xlogo.js, vendor/layr-test-stub.js.
// The engine is checked against a fixed SHA-256 so the maths cannot drift.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import crypto from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MACHINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE_SHA256 = '7a5ae8482d70f1e09b7308103c52eb738f8e12a1fae36b9832488000a4f7b98e'; // Block Fortune v2, STATE_VERSION 2
const PACK = { name: 'Degen City', description: 'Miami Degens vs NYC Degens · the city race', color: '#1a0f12', accent: '#e8590c' };
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const b64gz = s => gzipSync(Buffer.from(s, 'utf8'), { level: 9 }).toString('base64');
const asciiJSON = v => JSON.stringify(v).replace(/[\u007f-￿]/g, ch => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));
const read = p => readFileSync(join(MACHINE, p), 'utf8');

const layrAccount = read('src/shared/layr-account.html'), xlogo = read('src/shared/xlogo.html'), engine = read('src/shared/engine.html');
const compatSrc = read('src/shared/compat.html');
if (!compatSrc.includes("'Ordinal Rush needs '") && !compatSrc.includes('Ordinal Rush needs ')) throw Error('compat.html: the product-name string was not found');
const compat = compatSrc.split('Ordinal Rush needs ').join('Degen City needs ');
if (sha(engine) !== ENGINE_SHA256) throw Error(`Engine changed: sha256 ${sha(engine)} != ${ENGINE_SHA256}.`);

const css = read('src/style.css');
const BODY = `
<div class="vignette"></div>
<header><a class="brand" href="#" aria-label="Degen City"><canvas class="brandmark" id="brandmark" width="68" height="68" aria-hidden="true"></canvas> DEGEN CITY <span class="arcade">/ PARALLAX CASINO</span></a><div class="top-right"><span class="pill"><i></i> LAYR PLAY</span><button id="sound" class="icon" aria-label="Mute sound" aria-pressed="true">♫</button><button id="help" class="icon" aria-label="Rates and pays">?</button><button id="fullscreenBtn" class="icon" aria-label="Full screen (F)">⛶</button><button id="settings" class="icon" aria-label="Settings">⚙</button></div></header>
<main><section class="intro"><p class="eyebrow">MIAMI &nbsp; / &nbsp; NEW YORK &nbsp; / &nbsp; FOREVER ON STACKS</p><h1>DEGEN<br><em>CITY</em></h1><p class="tagline">Every symbol is a real Degen,<br>a real CityCoin or an Xtrata record.</p><div class="edition"><span></span> MIAMI DEGENS VS NYC DEGENS · THE CITY RACE</div><div class="feature-list"><button data-info="free"><b>01</b><span>Mining Season<small>3+ CityCoins · 8 free spins · 2×</small></span><i>↗</i></button><button data-info="vault"><b>02</b><span>City Vault<small>Open 3 of 9 safe-deposit boxes</small></span><i>↗</i></button><button data-info="chain"><b>03</b><span>Block Party<small>Light the map. Respin.</small></span><i>↗</i></button><button data-info="genesis"><b>04</b><span>Key to the City<small>5 gold Degens on the centre row</small></span><i>↗</i></button><button id="colsInfo"><b>05</b><span>The Degens on the reels<small>Real tokens, real Xtrata IDs</small></span><i>↗</i></button><button id="holdersInfo"><b>06</b><span>Holder Pot<small>1% of paid bets · 60/40 city split</small></span><i>↗</i></button></div></section>
<aside class="session"><p class="eyebrow">YOUR SESSION</p><div class="session-row"><span>Spins</span><b id="spins">0</b></div><div class="session-row"><span>Total played</span><b id="wagered">0</b></div><div class="session-row"><span>Total paid out</span><b id="paidOut">0</b></div><div class="session-rule"></div><p class="eyebrow">KEY TO THE CITY JACKPOT</p><p class="meter" id="meterSide">50,000</p><p class="eyebrow">HOLDER POT · THIS WEEK</p><p class="meter" id="potSide">0</p><button class="text-button" id="history">Session history ↗</button></aside>
<div class="machine-caption"><span class="live-dot"></span> <span id="status" role="status" aria-live="polite">MIAMI DEGENS VS NYC DEGENS · FOREVER ON STACKS</span></div></main>
<section id="featureBar" hidden aria-live="polite" aria-label="Bonus feature"><div class="fb-head"><span class="eyebrow" id="fbTag">FEATURE</span><strong id="fbTitle"></strong><span id="fbInfo"></span></div><div id="fbBody"></div></section>
<footer class="console"><div class="credit"><label>LAYR BALANCE <button id="account" aria-label="View shared LAYR account">LAYR account</button></label><strong id="balance">0</strong><small>LAYR</small></div><div class="bet"><label>TOTAL BET <span>20 LINES</span></label><div class="stepper"><button id="minus" aria-label="Less stake: decrease bet">−</button><strong id="bet">100</strong><button id="plus" aria-label="More stake: increase bet">+</button></div></div><div class="last"><label id="winLabel">LAST WIN</label><strong id="lastWin">0</strong><small id="freeCount">LAYR</small><button id="gamble" class="gamble-btn" hidden>MIAMI OR NEW YORK ›</button></div><div class="actions"><button id="auto" class="secondary" aria-pressed="false">AUTO-PILOT</button><button id="maxBet" class="secondary">MAX STAKE</button><button id="spin" class="spin"><span id="spinText">DRIVE</span> <span class="spin-icon">₿</span></button><button id="turbo" class="secondary" aria-pressed="false">TURBO</button></div><div class="utility"><button id="rules">RATES / PAYS</button><button id="historyLink">SESSION HISTORY</button></div></footer>
<div id="fs" hidden><div id="fsStage"></div><nav id="fsBar" aria-label="Machine controls"><div id="fsMain"></div><div id="fsMore"></div></nav></div>
<div id="toast" role="status"></div><div id="celebration" aria-hidden="true"></div>
<dialog id="modal"><div class="modal-head"><span class="eyebrow" id="modalTag">DEGEN CITY</span><button id="close" aria-label="Close dialog">×</button></div><div id="modalContent"></div></dialog>
<div id="loading" role="status"><canvas class="loader-mark" id="loaderMark" width="230" height="230" aria-hidden="true"></canvas><p id="loadMsg">ENTERING THE CITY</p><small>Degen City · ParallaX Casino</small></div><noscript><p class="noscript">Degen City needs JavaScript to run.</p></noscript>
`;

const art = read('art/art.js');
const manifest = JSON.parse(read('art/manifest.json'));
const cityMeta = c => ({ name: c.name, helper: c.helper, tokenCount: c.tokenCount, inscribedCount: c.inscribedCount });
const artScript = `<script>${art}window.DC_MANIFEST=${asciiJSON({ miami: cityMeta(manifest.miami || {}), nyc: cityMeta(manifest.nyc || {}) })};</script>`;
const game = read('src/game.js');
const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#090b14"><meta name="color-scheme" content="dark"><title>Degen City — ParallaX Casino machine</title><meta name="description" content="Degen City: a ParallaX Casino slot where Miami Degens and NYC Degens, real CityCoins tokens and Xtrata records fill the reels."><style>${css}</style></head><body>${BODY}${layrAccount}\n${compat}\n${engine}\n${xlogo}\n${artScript}\n<script>${game}</script>\n</body></html>`;
const model = read('src/model.json'); JSON.parse(model);

mkdirSync(join(MACHINE, 'dist'), { recursive: true }); mkdirSync(join(MACHINE, 'vendor'), { recursive: true });
writeFileSync(join(MACHINE, 'dist/degen-city.html'), doc);
const pack = { ...PACK, model: b64gz(model), game: b64gz(doc), css };
const packJSON = asciiJSON(pack);
writeFileSync(join(MACHINE, 'pack.json'), packJSON);
writeFileSync(join(MACHINE, 'pack.js'), `/* Degen City as one PX_MACHINE_PACKS entry (same content as pack.json), loadable with a script tag. */\nwindow.DC_PACK=${packJSON};\n`);
const strip = s => s.slice(8, -9);
writeFileSync(join(MACHINE, 'vendor/xlogo.js'), strip(xlogo));
// The test page's ParallaxLAYRAccount stub: the same adapter, on its own storage keys, with a play balance. Never the casino's.
writeFileSync(join(MACHINE, 'vendor/layr-test-stub.js'), '/* TEST STUB of window.ParallaxLAYRAccount for the standalone Degen City page. It is the casino adapter with its own\n   storage keys, so it can never read or change a real casino balance. */\n' + strip(layrAccount).split("'xtrata.parallax.layr.account.v1'").join("'xtrata.parallax.test.degen-city.layr.v1'").split("'xtrata.parallax.layr.lease.v1'").join("'xtrata.parallax.test.degen-city.lease.v1'").split("LEGACY_KEY='royalflush_v2'").join("LEGACY_KEY='xtrata.parallax.test.none'").split("'xtrata-parallax-account-lock'").join("'xtrata-parallax-test-degen-city-lock'"));
console.log(`game ${(doc.length / 1024).toFixed(0)} KB, model ${(model.length / 1024).toFixed(0)} KB, pack.json ${(packJSON.length / 1024).toFixed(0)} KB; engine sha256 ${sha(engine).slice(0, 16)}… OK`);
