#!/usr/bin/env node
// Renders the door skins to PNG files so they can be looked at: no browser, no THREE. Uses the same kit the hall will use
// (src/parts/door-skins.js) and the real door styles (src/parts/doors.js), then lights the maps with a small software shader.
//
//   node build/door-skins-sheet.cjs --out DIR [--skins oak,brass] [--styles rect,arch,gothic] [--scale 2] [--wear 0.3]
//
// Writes, per skin and style, DIR/door-<skin>-<style>.png (door in its frame on a wall), DIR/leaf-<skin>.png (the flat albedo
// texture of a plain leaf), and DIR/maps-<skin>-<style>-{albedo,normal,orm}.png for the three texture maps.
// Generated images are kept local (see AGENTS.md): point --out at a scratch folder, not at the repo.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');

const PARTS = path.join(__dirname, '..', 'src', 'parts');
// Hall parts are browser scripts that hang their API on the global and on module.exports. Load them in this realm
// (a separate vm context makes every Math and typed-array call cross a realm boundary, which is 50 times slower).
function load(file) {
  const src = fs.readFileSync(path.join(PARTS, file), 'utf8'), m = { exports: {} };
  ['XADoorSkins', 'XADoors', 'XABays'].forEach((k) => { delete globalThis[k]; });
  vm.runInThisContext('(function (module) {' + src + '\n})', { filename: file })(m);
  return m.exports;
}
const SK = load('door-skins.js');
const D = load('doors.js');

/* ---------------------------------------------------------------- PNG writer */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function png(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]);
}

/* ---------------------------------------------------------------- small helpers */
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const mix = (a, b, t) => a + (b - a) * t;
const norm3 = (x, y, z) => { const l = Math.sqrt(x * x + y * y + z * z) || 1; return [x / l, y / l, z / l]; };
const LIGHT = norm3(-0.45, -0.55, 0.7), VIEW = [0, 0, 1], HALF = norm3(LIGHT[0] + VIEW[0], LIGHT[1] + VIEW[1], LIGHT[2] + VIEW[2]);
const lin = (c) => Math.pow(clamp(c, 0, 1), 2.2), enc = (c) => Math.pow(clamp(c, 0, 1), 1 / 2.2);
// A tiny made-up environment so metal has something to reflect: bright above, dark floor, warm side.
function env(ny, nx) { const sky = [0.95, 0.98, 1.1], floor = [0.3, 0.26, 0.22], t = clamp(0.5 - ny * 0.5, 0, 1); return [mix(floor[0], sky[0], t) + Math.max(0, -nx) * 0.15, mix(floor[1], sky[1], t) + Math.max(0, -nx) * 0.08, mix(floor[2], sky[2], t)]; }

// Light one pixel of a surface. albedo sRGB 0..1, N unit normal, rough, metal, groove for emissive
function lit(albedo, N, rough, metal, ao) {
  const a = albedo.map(lin), ndl = Math.max(0, N[0] * LIGHT[0] + N[1] * LIGHT[1] + N[2] * LIGHT[2]), ndh = Math.max(0, N[0] * HALF[0] + N[1] * HALF[1] + N[2] * HALF[2]);
  const shin = mix(220, 6, Math.sqrt(rough)), spec = Math.pow(ndh, shin) * (shin + 8) / 28 * (1 - rough * 0.65);
  const e = env(N[1], N[0]).map(lin), amb = 0.22 * ao;
  const out = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    const diff = a[k] * (1 - metal) * (amb + ndl * 0.95);
    const f0 = mix(0.04, a[k], metal);
    out[k] = diff + f0 * spec * 0.9 + f0 * e[k] * (0.15 + 0.7 * metal) * (1 - rough * 0.75) * ao;
  }
  return out;
}

/* ---------------------------------------------------------------- one door */
const WALL = [0.085, 0.1, 0.15];
function renderDoor(skinKey, styleName, opts) {
  const skin = SK.SKINS[skinKey], S = opts.scale || 2, G = D.layoutOf(styleName), M = Math.round(G.fw + 16);          // margin in design units holds the frame and the wall
  const w = Math.round(G.W * S), h = Math.round(G.H * S), m = Math.round(M * S), CW = w + 2 * m, CH = h + 2 * m;
  const ops = G.leaves.map((L) => D.faceOps(G, L, 0)).join('');
  const rel = SK.relief(G.shape.pts, ops, G.W, G.H, w, h);
  const handle = [G.leaves[0].hx / G.W, G.hy / G.H];
  const maps = SK.render(skin.recipe, { w, h, rel, seed: 1234, wear: (opts.wear != null ? opts.wear : skin.wear / 100), handle });
  const frameKey = opts.frame || skin.frame, frameRec = SK.FRAMES[frameKey];
  // canvas-sized mask and outside distance (chamfer) for the frame
  const N = CW * CH, mask = new Uint8Array(N), dout = new Float32Array(N).fill(1e6);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (rel.mask[y * w + x] > 0.5) { mask[(y + m) * CW + x + m] = 1; dout[(y + m) * CW + x + m] = 0; }
  const pass = (x, y, nx, ny, c) => { if (nx < 0 || ny < 0 || nx >= CW || ny >= CH) return; const v = dout[ny * CW + nx] + c, i = y * CW + x; if (v < dout[i]) dout[i] = v; };
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { pass(x, y, x - 1, y, 1); pass(x, y, x, y - 1, 1); pass(x, y, x - 1, y - 1, 1.41); pass(x, y, x + 1, y - 1, 1.41); }
  for (let y = CH - 1; y >= 0; y--) for (let x = CW - 1; x >= 0; x--) { pass(x, y, x + 1, y, 1); pass(x, y, x, y + 1, 1); pass(x, y, x + 1, y + 1, 1.41); pass(x, y, x - 1, y + 1, 1.41); }
  const F = G.fw * S * 1.15;
  // frame height: a simple moulding (a rise, a flat, a small step down), then its normal map
  const fh = new Float32Array(N);
  for (let i = 0; i < N; i++) { const d = dout[i]; if (mask[i] || d > F || !frameRec) continue; const t = d / F; fh[i] = 0.5 + 0.1 * Math.sin(Math.min(1, t * 1.6) * Math.PI * 0.5) - (t > 0.82 ? 0.05 : 0); }
  const fn = frameRec ? SK.normalFromHeight(fh, CW, CH, 5) : null;
  const fmaps = frameRec ? SK.render(frameRec, { w: CW, h: CH, seed: 99, wear: 0 }) : null;
  const doorNormal = maps.normal;
  const img = new Uint8ClampedArray(N * 4);
  const behind = (x, y) => { const u = x / w, v = y / h, g = 0.55 + 0.45 * Math.sin(v * 3 + u * 2) * 0.5 + 0.5 * (1 - Math.abs(u - 0.5) * 1.4); return [1.0 * g, 0.82 * g, 0.5 * g]; };
  const emissiveCol = skin.recipe.emissive ? SK.hexToRgb(skin.recipe.emissive.color) : null, emI = skin.recipe.emissive ? skin.recipe.emissive.intensity : 0;
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    const i = y * CW + x, o = i * 4, d = dout[i];
    let c;
    if (mask[i]) {
      const dx = x - m, dy = y - m, j = dy * w + dx, a = maps.a[j];
      const N3 = norm3(doorNormal[j * 4] / 127.5 - 1, -(doorNormal[j * 4 + 1] / 127.5 - 1), doorNormal[j * 4 + 2] / 127.5 - 1);
      const edge = rel.dist[j], ao = clamp(0.55 + edge / 10, 0.55, 1) * (1 - maps.groove[j] * 0.35);
      c = lit([maps.r[j], maps.g[j], maps.b[j]], N3, maps.rough[j], maps.metal[j], ao);
      if (a < 0.999) {                                                                // glass: light from behind shows through
        const bk = behind(dx, dy), t = [maps.r[j], maps.g[j], maps.b[j]].map(lin);
        const trans = [bk[0] * t[0] * 1.5, bk[1] * t[1] * 1.5, bk[2] * t[2] * 1.5].map((v) => v * (skinKey === 'stained' ? 1.35 : 0.5));
        for (let k = 0; k < 3; k++) c[k] = mix(c[k], trans[k] + c[k] * 0.3, 1 - a);
      }
      if (emissiveCol) { const g = clamp(maps.groove[j], 0, 1) * emI; for (let k = 0; k < 3; k++) c[k] += lin(emissiveCol[k]) * g * 1.1; }
    } else if (frameRec && d <= F) {
      const N3 = norm3(fn[o] / 127.5 - 1, -(fn[o + 1] / 127.5 - 1), fn[o + 2] / 127.5 - 1);
      c = lit([fmaps.r[i], fmaps.g[i], fmaps.b[i]], N3, fmaps.rough[i], fmaps.metal[i], 0.9);
    } else {
      const dd = frameRec ? Math.max(0, d - F) : d, shadow = Math.exp(-dd / 7) * 0.55, v = y / CH, wall = WALL.map((k) => lin(k) * (0.7 + 0.5 * (1 - v)) * (1 - shadow));
      const n = SK._noise ? 0 : 0; c = wall.map((k) => k + n);
    }
    img[o] = enc(c[0]) * 255; img[o + 1] = enc(c[1]) * 255; img[o + 2] = enc(c[2]) * 255; img[o + 3] = 255;
  }
  // hardware on top: hinge straps and the lever with its rose, shaded like round metal
  const hw = SK.HARDWARE[opts.hardware || skin.hardware] || SK.HARDWARE.brass, hwCol = SK.hexToRgb(hw.color);
  const blit = (cx, cy, rx, ry, rot, shapeFn) => {   // shapeFn(u, v) -> normal or null in the shape's own coordinates
    const ca = Math.cos(rot), sa = Math.sin(rot), R = Math.ceil(Math.max(rx, ry) * 1.5);
    for (let yy = -R; yy <= R; yy++) for (let xx = -R; xx <= R; xx++) {
      const px = Math.round(cx + xx), py = Math.round(cy + yy); if (px < 0 || py < 0 || px >= CW || py >= CH) continue;
      const u = (xx * ca + yy * sa) / rx, v = (-xx * sa + yy * ca) / ry, nrm = shapeFn(u, v); if (!nrm) continue;
      const c = lit(hwCol, norm3(nrm[0] * ca - nrm[1] * sa, nrm[0] * sa + nrm[1] * ca, nrm[2]), hw.rough, hw.metal, 1), o = (py * CW + px) * 4;
      const shadowA = 0; img[o] = enc(c[0]) * 255; img[o + 1] = enc(c[1]) * 255; img[o + 2] = enc(c[2]) * 255;
    }
  };
  const L0 = G.leaves[0];
  G.leaves.forEach((L) => {
    const cx = m + L.hx * S, cy = m + G.hy * S;
    blit(cx, cy, 9 * S, 9 * S, 0, (u, v) => { const r = Math.sqrt(u * u + v * v); return r > 1 ? null : [u * 0.8, v * 0.8, Math.sqrt(Math.max(0.05, 1 - r * r * 0.64))]; });       // rose
    const len = L.Lh * (G.S.handle === 'bar' ? 1.25 : 1), x1 = cx + L.dir * len * S / 2;
    blit(x1, cy, len * S / 2 + 5 * S, 5.5 * S, 0, (u, v) => { if (Math.abs(u) > 1 || Math.abs(v) > 1) return null; const ru = Math.max(0, Math.abs(u) - 0.78) / 0.22, r = Math.sqrt(v * v + ru * ru); return r > 1 ? null : [ru * Math.sign(u) * 0.7, v * 0.9, Math.sqrt(Math.max(0.05, 1 - r * r * 0.8))]; });  // lever
    G.S.hingeYs.forEach((f) => {                                                                                                                                     // hinge straps
      const e = G.shape.edge(f * G.H), ax = L.hinge === 'R' ? e[1] : e[0], len2 = Math.max(14, G.S.strap * L.w), th = G.S.strapTh, sx = m + (ax + (L.hinge === 'R' ? -len2 / 2 : len2 / 2)) * S, sy = m + f * G.H * S;
      blit(sx, sy, len2 * S / 2, th * S / 2, 0, (u, v) => (Math.abs(u) > 1 || Math.abs(v) > 1 ? null : [0, v * 0.6, Math.sqrt(1 - v * v * 0.36)]));
    });
  });
  return { W: CW, H: CH, rgba: img, maps, rel, w, h };
}

/* ---------------------------------------------------------------- command line */
if (require.main === module) {
  const args = process.argv.slice(2), get = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
  const out = get('out'); if (!out) { console.error('usage: node build/door-skins-sheet.cjs --out DIR [--skins a,b] [--styles rect,arch,gothic] [--scale 2] [--wear 0.3]'); process.exit(2); }
  fs.mkdirSync(out, { recursive: true });
  const skins = (get('skins', '') ? get('skins').split(',') : SK.SKIN_KEYS), styles = get('styles', 'rect,arch,gothic').split(','), scale = Number(get('scale', 2)), wear = get('wear') != null ? Number(get('wear')) : null;
  const t0 = Date.now(), written = [];
  skins.forEach((k) => {
    if (!SK.SKINS[k]) { console.error('unknown skin ' + k); process.exit(2); }
    const leaf = SK.render(SK.SKINS[k].recipe, { w: 128, h: 256, seed: 7, wear: wear != null ? wear : SK.SKINS[k].wear / 100 });
    // flat leaf swatch on a checker so glass opacity shows
    const sw = new Uint8ClampedArray(128 * 256 * 4);
    for (let i = 0; i < 128 * 256; i++) { const x = i % 128, y = Math.floor(i / 128), chk = ((x >> 4) + (y >> 4)) & 1 ? 70 : 40, a = leaf.a[i]; sw[i * 4] = leaf.albedo[i * 4] * a + chk * (1 - a); sw[i * 4 + 1] = leaf.albedo[i * 4 + 1] * a + chk * (1 - a); sw[i * 4 + 2] = leaf.albedo[i * 4 + 2] * a + chk * (1 - a); sw[i * 4 + 3] = 255; }
    fs.writeFileSync(path.join(out, `leaf-${k}.png`), png(128, 256, sw)); written.push(`leaf-${k}.png`);
    styles.forEach((s) => {
      if (!SK.allowed(SK.SKINS[k].mask, s) && !args.includes('--force')) return;
      const r = renderDoor(k, s, { scale, wear });
      fs.writeFileSync(path.join(out, `door-${k}-${s}.png`), png(r.W, r.H, r.rgba)); written.push(`door-${k}-${s}.png`);
      if (args.includes('--maps')) {
        fs.writeFileSync(path.join(out, `maps-${k}-${s}-albedo.png`), png(r.w, r.h, r.maps.albedo));
        fs.writeFileSync(path.join(out, `maps-${k}-${s}-normal.png`), png(r.w, r.h, r.maps.normal));
        fs.writeFileSync(path.join(out, `maps-${k}-${s}-orm.png`), png(r.w, r.h, r.maps.orm));
      }
    });
  });
  console.log(`wrote ${written.length} files to ${out} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
module.exports = { renderDoor, png };
