#!/usr/bin/env node
// Builds art/facts.js (window.HW_FACTS) from art/facts.json, inlining the official coin symbol files and the company logos Jim
// supplied (art/logos, made by art/_gen_logos.py) as data URIs.
// The facts are the only "data" the machine has: every tile, fact card, timeline row and lesson is drawn from them.
//   node tools/build-art.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const MACHINE = resolve(dirname(fileURLToPath(import.meta.url)), '..'), ART = join(MACHINE, 'art');
const facts = JSON.parse(readFileSync(join(ART, 'facts.json'), 'utf8'));
const must = (c, m) => { if (!c) throw Error('facts.json: ' + m); };
const SLOTS = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin', 'wild', 'scatter', 'vault'];
for (const s of SLOTS) { const e = facts.exhibits[s]; must(e, 'missing exhibit ' + s); for (const k of ['name', 'year', 'how', 'lesson']) must(e[k] != null && e[k] !== '', `${s}.${k}`); must(Array.isArray(e.sources) && e.sources.length, `${s} has no sources`); for (const x of e.sources) must(/^https?:\/\//.test(x.url), `${s} source url`); }
must(Array.isArray(facts.timeline) && facts.timeline.length >= 15, 'timeline needs at least 15 rows');
for (const r of facts.timeline) { must(r.year && r.exchange && r.headline && r.how && r.lesson, `timeline row ${r.exchange}`); must(r.headline.length <= 58, `headline too long: ${r.headline}`); must(Array.isArray(r.sources) && r.sources.length, `timeline row ${r.exchange} has no sources`); }
must(facts.lessons.length >= 10, 'lessons'); for (const t of ['NOT YOUR KEYS', 'COLD STORAGE', 'MULTI-SIG', 'PROOF OF RESERVES']) must(facts.lessons.some(l => l.title.toUpperCase().includes(t.split(' ')[0]) ), 'lesson ' + t);
const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png' };
const out = JSON.parse(JSON.stringify(facts)), used = [];
for (const [k, c] of Object.entries(out.coins || {})) if (c.status === 'file' && c.file) { const p = join(MACHINE, c.file); must(existsSync(p), 'coin file ' + c.file); c.svg = `data:${MIME[extname(p)]};base64,${readFileSync(p).toString('base64')}`; used.push(k); }
// Company logos: every exhibit and timeline row that is a company gets its logo key; BitGo and EY are listed as companies named in the cards.
const LOGO_MAN = JSON.parse(readFileSync(join(ART, 'logos/manifest.json'), 'utf8')); out.logos = {};
for (const [k, v] of Object.entries(LOGO_MAN)) { const p = join(ART, v.file); must(existsSync(p), 'logo file ' + v.file); out.logos[k] = { src: `data:image/png;base64,${readFileSync(p).toString('base64')}`, w: v.w, h: v.h, bg: v.bg, name: v.name }; }
const SLOT_LOGO = { cherry: 'bitstamp', lemon: 'cryptopia', chip: 'bitfinex', block: 'coincheck', artifact: 'bybit', bitcoin: 'binance', scatter: 'mtgox', vault: 'quadriga' };
for (const [s2, k] of Object.entries(SLOT_LOGO)) { must(out.logos[k], 'logo ' + k); out.exhibits[s2].logo = k; }
const ROW_LOGO = [[/^Mt\. Gox/, 'mtgox'], [/^Bitstamp/, 'bitstamp'], [/^Bitfinex/, 'bitfinex'], [/^Coincheck/, 'coincheck'], [/^Zaif/, 'zaif'], [/^Cryptopia/, 'cryptopia'], [/^QuadrigaCX/, 'quadriga'], [/^Bithumb/, 'bithumb'], [/^Binance/, 'binance'], [/^Upbit/, 'upbit'], [/^KuCoin/, 'kucoin'], [/^DMM/, 'dmm'], [/^WazirX/, 'wazirx'], [/^Bybit/, 'bybit']];
for (const r of out.timeline) { const m = ROW_LOGO.find(([re]) => re.test(r.exchange)); must(m, 'no logo for timeline row ' + r.exchange); r.logo = m[1]; }
out.companies = [...new Set(out.timeline.map(r => r.logo))].concat(['bitgo', 'ey']);
const ascii = v => JSON.stringify(v).replace(/[\u007f-￿]/g, ch => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));
writeFileSync(join(ART, 'facts.js'), `/* Hot Wallet facts: built from art/facts.json by tools/build-art.mjs. Every figure has its sources on the same record. */\nwindow.HW_FACTS=${ascii(out)};\n`);
console.log(`art/facts.js: ${SLOTS.length} exhibits, ${facts.timeline.length} timeline rows, ${facts.lessons.length} lessons, ${(facts.glossary || []).length} words; coin files inlined: ${used.join(', ') || 'none'}; logos: ${Object.keys(out.logos).length}`);
