#!/usr/bin/env node
// Builds src/model.json from src/cabinet.js in plain Node (no browser): THREE subset + XLOGO + a 2D canvas from @napi-rs/canvas.
//   node tools/build-cabinet-node.mjs            (needs: npm i @napi-rs/canvas, in a folder named by CANVAS_DIR or ~/chromebox)
// Same output format as the browser path. Textures are drawn by Skia instead of Chrome, so fonts come from the system
// (DejaVu Sans / Sans Condensed); nothing else differs. toDataURL quality: napi-rs takes 0-100, cabinet.js uses 0-1
// (as Chrome does), so the canvases are wrapped here to convert.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(join(process.env.CANVAS_DIR || join(process.env.HOME, 'chromebox'), 'x.js'));
const { createCanvas, Image } = req('@napi-rs/canvas');
const mk = (w, h) => { const c = createCanvas(w, h), td = c.toDataURL.bind(c); c.toDataURL = (type, q) => (q != null && q <= 1 && type !== 'image/png') ? td(type, Math.round(q * 100)) : td(type, q); return c; };
const doc = { createElement: t => { if (t !== 'canvas') throw Error('createElement ' + t); return mk(8, 8); }, createElementNS: (ns, t) => { if (t === 'canvas') return mk(8, 8); return { style: {}, setAttribute() {}, addEventListener() {} }; } };
const win = { document: doc, Image, devicePixelRatio: 1, addEventListener() {}, removeEventListener() {}, matchMedia: () => ({ matches: false }), navigator: { userAgent: 'node' } };
const ctx = vm.createContext(Object.assign(win, { window: win, self: win, console, setTimeout, clearTimeout, document: doc, navigator: win.navigator, Image, Math, JSON }));
const run = (f, name) => vm.runInContext(readFileSync(join(HERE, f), 'utf8'), ctx, { filename: name || f });
run('vendor/three-subset.js'); run('vendor/xlogo.js'); run('src/cabinet.js');
const t0 = Date.now();
const r = vm.runInContext('window.buildCabinet({})', ctx);
const out = typeof r.then === 'function' ? await r : r;
writeFileSync(join(HERE, 'src/model.json'), out.json);
console.log('src/model.json', (out.json.length / 1024).toFixed(0) + ' KB', JSON.stringify(out.stats), (Date.now() - t0) + ' ms');
