#!/usr/bin/env node
// Builds src/model.json from src/cabinet.js in plain Node (no browser): THREE subset + XLOGO + a 2D canvas from @napi-rs/canvas.
//   node tools/build-cabinet-node.mjs            (needs: npm i @napi-rs/canvas, in a folder named by CANVAS_DIR or ~/chromebox)
// Same output format as tools/build-cabinet.mjs (which needs a browser). Textures are drawn by Skia instead of Chrome, so
// fonts come from the system (DejaVu); nothing else differs.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(join(process.env.CANVAS_DIR || join(process.env.HOME, 'chromebox'), 'x.js'));
const { createCanvas, Image, GlobalFonts } = req('@napi-rs/canvas');
const doc = { createElement: t => { if (t !== 'canvas') throw Error('createElement ' + t); return createCanvas(8, 8); }, createElementNS: (ns, t) => { if (t === 'canvas') return createCanvas(8, 8); return { style: {}, setAttribute() {}, addEventListener() {} }; } };
const win = { document: doc, Image, devicePixelRatio: 1, addEventListener() {}, removeEventListener() {}, matchMedia: () => ({ matches: false }), navigator: { userAgent: 'node' } };
const ctx = vm.createContext(Object.assign(win, { window: win, self: win, console, setTimeout, clearTimeout, document: doc, navigator: win.navigator, Image, Math, JSON }));
const run = (f, name) => vm.runInContext(readFileSync(join(HERE, f), 'utf8'), ctx, { filename: name || f });
run('vendor/three-subset.js'); run('vendor/xlogo.js'); run('art/snapshot.js'); run('src/cabinet.js');
const t0 = Date.now();
const r = vm.runInContext('window.buildCabinet({})', ctx);
const out = typeof r.then === 'function' ? await r : r;
writeFileSync(join(HERE, 'src/model.json'), out.json);
console.log('src/model.json', (out.json.length / 1024).toFixed(0) + ' KB', JSON.stringify(out.stats), (Date.now() - t0) + ' ms');
