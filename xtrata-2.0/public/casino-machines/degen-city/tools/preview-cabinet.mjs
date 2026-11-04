#!/usr/bin/env node
// Software preview of src/model.json (z-buffered, perspective-correct textures, simple lighting): no browser or GPU needed.
// Rough stand-in for a render, good enough to check placement, colours and which way the faces point.
//   node tools/preview-cabinet.mjs [outDir]    writes front / three-quarter / back / top-detail PNGs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(join(process.env.CANVAS_DIR || join(process.env.HOME, 'chromebox'), 'x.js'));
const { createCanvas, loadImage, ImageData } = req('@napi-rs/canvas');
const OUT = resolve(process.argv[2] || join(HERE, 'dist/test/cabinet-previews')); mkdirSync(OUT, { recursive: true });
const d = JSON.parse(readFileSync(join(HERE, 'src/model.json'), 'utf8'));
const tex = []; for (const t of d.textures) { const im = await loadImage(Buffer.from(t.image.split(',')[1], 'base64')), c = createCanvas(im.width, im.height), g = c.getContext('2d'); g.drawImage(im, 0, 0); tex.push({ w: im.width, h: im.height, data: g.getImageData(0, 0, im.width, im.height).data, rep: t.wrapS === 1000 }); }
const compose = (p, q, s) => { const [x, y, z, w] = q, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2; return [(1 - (yy + zz)) * s[0], (xy + wz) * s[0], (xz - wy) * s[0], 0, (xy - wz) * s[1], (1 - (xx + zz)) * s[1], (yz + wx) * s[1], 0, (xz + wy) * s[2], (yz - wx) * s[2], (1 - (xx + yy)) * s[2], 0, p[0], p[1], p[2], 1]; };
const mul = (a, b) => { const o = new Array(16).fill(0); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) o[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k]; return o; };
const meshes = []; (function walk(n, w) { const m = mul(w, compose(n.p, n.q, n.s)); if (n.g != null) meshes.push({ n, m }); n.children.forEach(c => walk(c, m)); })(d.root, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
const srgb = c => c <= .0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - .055, lin = c => c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
function render(name, eye, target, fov, W, H, crestY) {
  const zb = new Float32Array(W * H).fill(1e9), img = new Uint8ClampedArray(W * H * 4);
  for (let i = 0; i < W * H; i++) { const y = Math.floor(i / W) / H; const k = 14 + 18 * (1 - y); img[i * 4] = k; img[i * 4 + 1] = k + 2; img[i * 4 + 2] = k + 8; img[i * 4 + 3] = 255; }
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], norm = a => { const l = Math.hypot(...a); return a.map(v => v / l); }, dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const f = norm(sub(target, eye)), r = norm(cross(f, [0, 1, 0])), u = cross(r, f), tn = Math.tan(fov * Math.PI / 360), asp = W / H;
  const toCam = p => { const v = sub(p, eye); return [dot(v, r), dot(v, u), dot(v, f)]; };
  const L1 = norm([.4, .8, .6]), L2 = norm([-.6, .3, .5]);
  for (const { n, m } of meshes) {
    const wm = m;
    const geo = d.geometries[n.g], P = geo.attributes.position.array, N = geo.attributes.normal && geo.attributes.normal.array, UV = geo.attributes.uv && geo.attributes.uv.array, idx = geo.index || Array.from({ length: P.length / 3 }, (_, i) => i);
    const mats = (Array.isArray(n.m) ? n.m : [n.m]).map(i => d.materials[i]);
    const nv = P.length / 3, V = new Array(nv), NN = new Array(nv);
    for (let i = 0; i < nv; i++) { const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2]; const wp = [wm[0] * x + wm[4] * y + wm[8] * z + wm[12], wm[1] * x + wm[5] * y + wm[9] * z + wm[13], wm[2] * x + wm[6] * y + wm[10] * z + wm[14]]; const c = toCam(wp); V[i] = { c, wp }; if (N) { const nx = N[i * 3], ny = N[i * 3 + 1], nz = N[i * 3 + 2]; NN[i] = norm([wm[0] * nx + wm[4] * ny + wm[8] * nz, wm[1] * nx + wm[5] * ny + wm[9] * nz, wm[2] * nx + wm[6] * ny + wm[10] * nz]); } }
    const groups = geo.groups && geo.groups.length ? geo.groups : [{ start: 0, count: idx.length, materialIndex: 0 }];
    for (const gr of groups) { const mat = mats[Math.min(gr.materialIndex, mats.length - 1)], T = mat.map != null ? tex[mat.map] : null; const col = [lin(((mat.color >> 16) & 255) / 255), lin(((mat.color >> 8) & 255) / 255), lin((mat.color & 255) / 255)];
      for (let t = gr.start; t < gr.start + gr.count; t += 3) {
        const ia = idx[t], ib = idx[t + 1], ic = idx[t + 2], A = V[ia], B = V[ib], C = V[ic]; if (A.c[2] < .1 || B.c[2] < .1 || C.c[2] < .1) continue;
        const sx = v => (v.c[0] / (v.c[2] * tn * asp) + 1) / 2 * W, sy = v => (1 - v.c[1] / (v.c[2] * tn)) / 2 * H;
        const x0 = sx(A), y0 = sy(A), x1 = sx(B), y1 = sy(B), x2 = sx(C), y2 = sy(C); const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0); if (Math.abs(area) < 1e-9) continue;
        const nrm = norm(cross(sub(B.wp, A.wp), sub(C.wp, A.wp))); if (dot(nrm, sub(eye, A.wp)) < 0 && mat.side !== 2) continue;
        const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2))), maxX = Math.min(W - 1, Math.ceil(Math.max(x0, x1, x2))), minY = Math.max(0, Math.floor(Math.min(y0, y1, y2))), maxY = Math.min(H - 1, Math.ceil(Math.max(y0, y1, y2)));
        const iw = [1 / A.c[2], 1 / B.c[2], 1 / C.c[2]];
        for (let py = minY; py <= maxY; py++) for (let px = minX; px <= maxX; px++) {
          const X = px + .5, Y = py + .5, l0 = ((x1 - X) * (y2 - Y) - (x2 - X) * (y1 - Y)) / area, l1 = ((x2 - X) * (y0 - Y) - (x0 - X) * (y2 - Y)) / area, l2 = 1 - l0 - l1; if (l0 < -1e-4 || l1 < -1e-4 || l2 < -1e-4) continue;
          const w = l0 * iw[0] + l1 * iw[1] + l2 * iw[2], z = 1 / w; if (z >= zb[py * W + px]) continue;
          const p0 = l0 * iw[0] / w, p1 = l1 * iw[1] / w, p2 = l2 * iw[2] / w; let rgb = col.slice(), alpha = 1;
          if (T && UV) { let uu = p0 * UV[ia * 2] + p1 * UV[ib * 2] + p2 * UV[ic * 2], vv = p0 * UV[ia * 2 + 1] + p1 * UV[ib * 2 + 1] + p2 * UV[ic * 2 + 1]; if (T.rep) { uu -= Math.floor(uu); vv -= Math.floor(vv); } const tx = Math.min(T.w - 1, Math.max(0, Math.floor(uu * T.w))), ty = Math.min(T.h - 1, Math.max(0, Math.floor((1 - vv) * T.h))), k = (ty * T.w + tx) * 4; rgb = [rgb[0] * lin(T.data[k] / 255), rgb[1] * lin(T.data[k + 1] / 255), rgb[2] * lin(T.data[k + 2] / 255)]; alpha = T.data[k + 3] / 255; if (mat.alphaTest && alpha < mat.alphaTest) continue; if (mat.transparent && alpha < .5) continue; }
          if (mat.type === 'standard') { let nn = NN[ia] ? norm([p0 * NN[ia][0] + p1 * NN[ib][0] + p2 * NN[ic][0], p0 * NN[ia][1] + p1 * NN[ib][1] + p2 * NN[ic][1], p0 * NN[ia][2] + p1 * NN[ib][2] + p2 * NN[ic][2]]) : nrm; const hemi = .5 + .5 * nn[1], diff = Math.max(0, dot(nn, L1)) * .75 + Math.max(0, dot(nn, L2)) * .25; const refl = mat.metalness * (.15 + .5 * Math.pow(Math.max(0, hemi), 2)); const sh = .22 + .5 * hemi * (1 - mat.metalness * .6) + diff * (1 - mat.metalness * .5) * .8 + refl; const sp = Math.pow(Math.max(0, dot(nn, norm([L1[0] + f[0] * -1, L1[1] - f[1], L1[2] - f[2]]))), 24 + (1 - mat.roughness) * 80) * (1 - mat.roughness) * .6; rgb = rgb.map((c, i) => c * sh + sp * (mat.metalness > .5 ? c + .2 : .3)); }
          zb[py * W + px] = z; const o = (py * W + px) * 4; img[o] = Math.min(255, srgb(Math.min(1, rgb[0])) * 255); img[o + 1] = Math.min(255, srgb(Math.min(1, rgb[1])) * 255); img[o + 2] = Math.min(255, srgb(Math.min(1, rgb[2])) * 255);
        }
      } }
  }
  const c = createCanvas(W, H), g = c.getContext('2d'); g.putImageData(new ImageData(img, W, H), 0, 0); writeFileSync(join(OUT, name + '.png'), c.toBuffer('image/png'));
}
const jobs = [['front', [0, 3.4, 12.5], [0, 2.9, 0], 34, 760, 1100], ['three-quarter', [6.5, 3.8, 9.5], [0, 2.9, 0], 34, 760, 1100], ['left-three-quarter', [-6.0, 3.0, 8.0], [0, 2.9, 0], 34, 760, 1100], ['back', [-3.5, 3.6, -10.5], [0, 2.9, 0], 34, 760, 1100], ['topper-front', [0, 5.3, 6.0], [0, 5.0, 0], 30, 900, 700], ['deck', [0, 3.6, 4.2], [0, 1.9, .5], 40, 1000, 800], ['marquee', [0, 4.5, 4.0], [0, 4.4, 0], 30, 1000, 520]];
for (const j of (process.argv[3] ? jobs.filter(x => x[0] === process.argv[3]) : jobs)) render(...j);
console.log('previews in', OUT);
