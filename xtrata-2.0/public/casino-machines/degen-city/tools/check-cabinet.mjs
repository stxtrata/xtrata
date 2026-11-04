#!/usr/bin/env node
// Structural check of src/model.json (no browser needed): lists every node with a role or action, bounding boxes,
// texture sizes, samples texture pixels to make sure nothing is blank, checks the coin faces sit the right way round,
// and exits 1 if a required role/action is missing or any number is NaN.
//   node tools/check-cabinet.mjs [--dump-textures]      (needs @napi-rs/canvas like build-cabinet-node.mjs)
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(join(process.env.CANVAS_DIR || join(process.env.HOME, 'chromebox'), 'x.js'));
const { createCanvas, loadImage } = req('@napi-rs/canvas');
const file = join(HERE, 'src/model.json'), bytes = statSync(file).size, d = JSON.parse(readFileSync(file, 'utf8'));
const fails = [], warns = [], ok = (c, m) => { if (!c) fails.push(m); return c; };
const f3 = a => '(' + a.map(v => v.toFixed(3)).join(', ') + ')';
// --- tiny matrix helpers (column-major 4x4 like three) ---
const compose = (p, q, s) => { const [x, y, z, w] = q, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
  return [(1 - (yy + zz)) * s[0], (xy + wz) * s[0], (xz - wy) * s[0], 0, (xy - wz) * s[1], (1 - (xx + zz)) * s[1], (yz + wx) * s[1], 0, (xz + wy) * s[2], (yz - wx) * s[2], (1 - (xx + yy)) * s[2], 0, p[0], p[1], p[2], 1]; };
const mul = (a, b) => { const o = new Array(16).fill(0); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) o[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k]; return o; };
const apply = (m, x, y, z) => [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]];
// --- walk ---
const ID = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const all = []; let nan = 0;
(function walk(n, parent, world, path, depth) {
  [n.p, n.q, n.s].forEach(a => a.forEach(v => { if (!Number.isFinite(v)) nan++; }));
  const w = mul(world, compose(n.p, n.q, n.s)); const rec = { n, parent, world: w, path, depth, box: null }; all.push(rec);
  if (n.g != null) { const a = d.geometries[n.g].attributes.position.array; const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; for (let i = 0; i < a.length; i += 3) { const p = apply(w, a[i], a[i + 1], a[i + 2]); for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[k]); hi[k] = Math.max(hi[k], p[k]); } } rec.box = [lo, hi]; }
  n.children.forEach((c, i) => walk(c, rec, w, path + '/' + i, depth + 1));
})(d.root, null, ID, '', 0);
const grow = (b, r) => { if (!r.box) return b; if (!b) return [r.box[0].slice(), r.box[1].slice()]; for (let k = 0; k < 3; k++) { b[0][k] = Math.min(b[0][k], r.box[0][k]); b[1][k] = Math.max(b[1][k], r.box[1][k]); } return b; };
const subtree = rec => { let b = null; all.filter(r => r.path.startsWith(rec.path) && (r === rec || r.path.startsWith(rec.path + '/'))).forEach(r => { b = grow(b, r); }); return b; };
for (const g of d.geometries) for (const a of Object.values(g.attributes)) for (const v of a.array) if (!Number.isFinite(v)) { nan++; break; }
ok(nan === 0, `${nan} NaN/Infinity values`);
console.log(`model.json ${(bytes / 1024).toFixed(0)} KB (limit ~2560), nodes ${all.length}, meshes ${all.filter(r => r.n.g != null).length}, geometries ${d.geometries.length}, materials ${d.materials.length}, textures ${d.textures.length}`);
ok(bytes <= 2.5 * 1048576, 'model.json larger than 2.5 MB');
// --- roles ---
const eul = q => { const [x, y, z, w] = q; return { x: Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)), y: Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - z * x)))), z: Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)) }; };
console.log('\nROLES (role, node path, local position, world bbox of subtree)');
const byRole = {}; for (const r of all) if (r.n.role) (byRole[r.n.role] = byRole[r.n.role] || []).push(r);
for (const [role, rs] of Object.entries(byRole)) for (const r of rs) { const b = subtree(r); console.log(` ${role.padEnd(14)} ${('root' + r.path).padEnd(14)} p=${f3(r.n.p)} rotX=${eul(r.n.q).x.toFixed(3)} rotY=${eul(r.n.q).y.toFixed(3)} ${r.n.action ? 'action=' + r.n.action + ' ' : ''}${b ? 'bbox ' + f3(b[0]) + ' .. ' + f3(b[1]) : ''}`); }
for (const need of ['screenMesh', 'crest', 'spinPhysical', 'lever']) ok(byRole[need] && byRole[need].length === 1, `role ${need} missing or duplicated`);
// --- actions ---
console.log('\nACTIONS (count of nodes carrying it, with roles of their parent group)');
const acts = {}; for (const r of all) if (r.n.action) (acts[r.n.action] = acts[r.n.action] || []).push(r);
for (const [a, rs] of Object.entries(acts)) { const b = rs.reduce((bb, r) => grow(bb, r), null); console.log(` ${a.padEnd(8)} x${String(rs.length).padStart(2)}  bbox ${f3(b[0])} .. ${f3(b[1])}`); }
for (const a of ['spin', 'betUp', 'betDown', 'auto', 'pays']) ok(acts[a] && acts[a].length >= 3, `action ${a} needs >=3 meshes (base, cap/top, face); has ${acts[a] ? acts[a].length : 0}`);
// --- screen ---
{ const s = byRole.screenMesh && byRole.screenMesh[0]; if (s) { const b = s.box; const w = b[1][0] - b[0][0], h = b[1][1] - b[0][1]; console.log(`\nscreenMesh size ${w.toFixed(3)} x ${h.toFixed(3)} at z=${s.n.p[2]} centre y=${s.n.p[1]}`); ok(Math.abs(w - 1.98) < .01 && Math.abs(h - 1.36) < .01 && Math.abs(s.n.p[2] - .5215) < .001 && Math.abs(s.n.p[1] - 2.95) < .001 && Math.abs(s.n.p[0]) < 1e-4, 'screenMesh must be 1.98 x 1.36 at (0, 2.95, 0.5215)'); ok(s.parent === all[0], 'screenMesh must be a direct child of the root'); } }
{ const c = byRole.crest && byRole.crest[0]; if (c) { ok(Math.abs(c.n.p[0]) < 1e-3 && Math.abs(c.n.p[1] - 5.5) < .01 && Math.abs(c.n.p[2] + .05) < .01, 'crest should be at about (0, 5.5, -0.05)'); ok(c.n.g == null, 'crest must be a Group'); } }
{ const l = byRole.lever && byRole.lever[0]; if (l) { ok(l.n.g == null && l.n.children.length >= 2, 'lever must be a Group with >=2 children'); ok(l.n.children[1] && l.n.children[1].action === 'spin', 'lever.children[1] (click target) needs action spin'); ok(Math.abs(eul(l.n.q).x) > 1e-3, 'lever rest pose should be baked (rotation.x != 0)'); const t = all.find(r => r.n === l.n.children[1]); console.log(` lever click target children[1] at world ${f3(apply(t.world, 0, 0, 0))}, rest rotation.x ${eul(l.n.q).x.toFixed(3)}`); } }
{ const sp = byRole.spinPhysical && byRole.spinPhysical[0]; if (sp) { ok(sp.n.action === 'spin', 'spinPhysical needs action spin'); ok(sp.parent && sp.parent.parent === all[0], 'spinPhysical should be a child of the deck group'); } }
// --- textures ---
console.log('\nTEXTURES');
const outDir = join(HERE, 'dist/test/cabinet-textures'); if (process.argv.includes('--dump-textures')) mkdirSync(outDir, { recursive: true });
const imgs = [], px = [];
for (let i = 0; i < d.textures.length; i++) {
  const t = d.textures[i], mime = /^data:(image\/\w+)/.exec(t.image)[1], buf = Buffer.from(t.image.split(',')[1], 'base64'), im = await loadImage(buf); imgs.push(im);
  const c = createCanvas(im.width, im.height), g = c.getContext('2d'); g.drawImage(im, 0, 0); const data = g.getImageData(0, 0, im.width, im.height).data; px.push({ w: im.width, h: im.height, data });
  let sum = [0, 0, 0], sq = 0, op = 0, n = 0; for (let k = 0; k < data.length; k += 4 * 7) { n++; if (data[k + 3] > 8) op++; for (let j = 0; j < 3; j++) sum[j] += data[k + j]; sq += (data[k] + data[k + 1] + data[k + 2]) / 3; }
  const mean = sum.map(v => v / n), lum = sq / n; let varL = 0; for (let k = 0; k < data.length; k += 4 * 7) { const l = (data[k] + data[k + 1] + data[k + 2]) / 3; varL += (l - lum) ** 2; } const sd = Math.sqrt(varL / n);
  const users = d.materials.map((m, mi) => m.map === i ? mi : -1).filter(v => v >= 0);
  console.log(` #${String(i).padStart(2)} ${mime.padEnd(10)} ${String(Math.round(buf.length / 1024)).padStart(4)} KB ${im.width}x${im.height} mean rgb ${mean.map(v => v.toFixed(0)).join(',')} sd ${sd.toFixed(1)} opaque ${(100 * op / n).toFixed(0)}% materials ${users.join(',')}`);
  ok(sd > 3 || op / n < .02, `texture #${i} looks blank (sd ${sd.toFixed(1)})`); ok(op / n > .001, `texture #${i} is fully transparent`);
  if (process.argv.includes('--dump-textures')) writeFileSync(join(outDir, `tex-${String(i).padStart(2, '0')}.${mime === 'image/jpeg' ? 'jpg' : mime === 'image/webp' ? 'webp' : 'png'}`), buf);
}
const sample = (ti, u, v) => { const p = px[ti], x = Math.min(p.w - 1, Math.max(0, Math.round(u * p.w))), y = Math.min(p.h - 1, Math.max(0, Math.round((1 - v) * p.h))), k = (y * p.w + x) * 4; return [p.data[k], p.data[k + 1], p.data[k + 2]]; };
// --- coin: faces, orientation ---
{ const cr = byRole.crest && byRole.crest[0]; const mesh = cr && cr.n.children.find(c => Array.isArray(c.m) && c.m.length === 3);
  if (!ok(mesh, 'crest has no 3-material coin disc')) { } else {
    const geo = d.geometries[mesh.g], pos = geo.attributes.position.array, uv = geo.attributes.uv.array, idx = geo.index, mats = mesh.m.map(i => d.materials[i]);
    console.log('\nCOIN: disc materials', mesh.m.join(','), 'groups', JSON.stringify(geo.groups), 'face textures', mats.map(m => m.map));
    const triUV = (grp, x, y) => { for (let t = grp.start; t < grp.start + grp.count; t += 3) { const [a, b, c] = [idx[t], idx[t + 1], idx[t + 2]], A = [pos[a * 3], pos[a * 3 + 1]], B = [pos[b * 3], pos[b * 3 + 1]], C = [pos[c * 3], pos[c * 3 + 1]]; const den = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]); if (Math.abs(den) < 1e-12) continue; const l1 = ((B[1] - C[1]) * (x - C[0]) + (C[0] - B[0]) * (y - C[1])) / den, l2 = ((C[1] - A[1]) * (x - C[0]) + (A[0] - C[0]) * (y - C[1])) / den, l3 = 1 - l1 - l2; if (l1 >= -1e-6 && l2 >= -1e-6 && l3 >= -1e-6) return [l1 * uv[a * 2] + l2 * uv[b * 2] + l3 * uv[c * 2], l1 * uv[a * 2 + 1] + l2 * uv[b * 2 + 1] + l3 * uv[c * 2 + 1]]; } return null; };
    const zOf = grp => pos[idx[grp.start] * 3 + 2];
    const gp = geo.groups.find(g => g.materialIndex === 1), gn = geo.groups.find(g => g.materialIndex === 2);
    ok(gp && gn && zOf(gp) > 0 && zOf(gn) < 0, 'coin cap groups: material 1 must be the +z face and material 2 the -z face');
    const M = mats[1].map, N = mats[2].map, R = .47; const lum = c => (c[0] + c[1] + c[2]) / 3;
    // viewer at +z: world +x is the viewer's right; viewer at -z: world -x is the viewer's right.  S = coin diameter (2R).
    const at = (grp, ti, wx, wy) => { const t = triUV(grp, wx, wy); return t ? sample(ti, t[0], t[1]) : null; };
    const W = (fx, fy, side) => [side * (fx - .5) * 2 * R, -(fy - .5) * 2 * R]; // canvas fractions in the upright frame -> world x,y
    const sun = at(gp, M, ...W(.5, .55, 1)), palmL = at(gp, M, ...W(.25, .445, 1)), palmR = at(gp, M, ...W(.75, .445, 1));
    console.log(`  MIAMI (+z): sun ${sun}, big palm crown (viewer's left) ${palmL}, same spot mirrored ${palmR}`);
    ok(sun && lum(sun) > 150, 'Miami face: sun should be bright at the centre of the sky'); ok(palmL && palmR && lum(palmL) < 45 && lum(palmR) > lum(palmL) + 30, 'Miami face is mirrored or rotated (big palm should sit on the viewer\'s left)');
    const moon = at(gn, N, ...W(.72, .26, -1)), moonM = at(gn, N, ...W(.28, .26, -1)), sky = at(gn, N, ...W(.5, .05, -1));
    console.log(`  NEW YORK (-z): moon (viewer's right) ${moon}, mirrored spot ${moonM}, sky near the top ${sky}`);
    ok(moon && lum(moon) > 190 && lum(moonM) < 90, 'New York face is mirrored or rotated (moon should sit on the viewer\'s upper right)'); ok(sky && lum(sky) < 60, 'New York face: top should be dark night sky');
    // top/bottom: sky above sea on Miami; sea/water dark below skyline on NYC; the upright check above already fixes 'up'.
  } }
// --- colour split: every coloured mesh should sit on its own side of the seam ---
{ let bad = 0, total = 0; const isL = m => { const h = m.color; const r = (h >> 16) & 255, g = (h >> 8) & 255, b = h & 255; return r > b + 20 ? 'L' : b > r + 20 ? 'R' : null; };
  for (const r of all) { if (r.n.g == null || !r.box) continue; const m = d.materials[Array.isArray(r.n.m) ? r.n.m[0] : r.n.m], side = isL(m); if (!side || m.map != null && d.textures[m.map] && !m.metalness && m.type === 'basic') continue; const cx = (r.box[0][0] + r.box[1][0]) / 2; if (Math.abs(cx) < .02 && r.box[1][0] - r.box[0][0] > .1) continue; total++; if ((side === 'L') !== (cx < 0)) { bad++; if (bad < 8) warns.push(`colour/side mismatch: node root${r.path} colour #${m.color.toString(16)} centre x ${cx.toFixed(2)}`); } }
  console.log(`\nSPLIT: ${total - bad}/${total} orange/blue coloured meshes sit on their own side of x=0`); }
// --- overall ---
const rb = subtree(all[0]); console.log(`\nBOUNDS ${f3(rb[0])} .. ${f3(rb[1])}  size ${f3(rb[1].map((v, k) => v - rb[0][k]))}`);
ok(rb[1][1] - rb[0][1] > 5.7 && rb[1][1] - rb[0][1] < 6.3, 'overall height should be about 6 (same ~2.6 m proportions as the siblings)');
warns.forEach(w => console.log('warn:', w));
if (fails.length) { console.log('\nFAIL'); fails.forEach(f => console.log(' -', f)); process.exit(1); } else console.log('\nOK: all required roles/actions present, no NaN, textures non-blank, coin faces oriented.');
