// The door-skin texture kit (src/parts/door-skins.js) without a browser: recipe validation, determinism, the catalogue, and a render of every skin.
// Run: node --test tests/door-skins.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Hall parts hang their API on module.exports; load them in this realm (a separate vm context makes typed-array work ~50x slower).
function load(file) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'parts', file), 'utf8'), m = { exports: {} };
  ['XADoorSkins', 'XADoors'].forEach((k) => { delete globalThis[k]; });
  vm.runInThisContext('(function (module) {' + src + '\n})', { filename: file })(m);
  return m.exports;
}
const K = load('door-skins.js');
const D = load('doors.js');
const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
const spread = (arr) => { let lo = 255, hi = 0; for (let i = 0; i < arr.length; i += 4) { lo = Math.min(lo, arr[i]); hi = Math.max(hi, arr[i]); } return hi - lo; };

test('limits and format are the ones the contract and docs promise', () => {
  assert.equal(K.FORMAT, 'door-skin-recipe/1');
  assert.equal(K.MAX_RECIPE_BYTES, 8192); assert.equal(K.MAX_LAYERS, 8); assert.equal(K.MAX_SIDE, 512);
  assert.deepEqual(K.STYLE_ORDER, Array.from(D.STYLE_NAMES), 'the style order is the bit order of the registry, and must follow the door styles');
});

test('catalogue integrity: every skin is registrable as the contract demands', () => {
  assert.equal(K.SKIN_KEYS.length, 19);
  const seen = new Set();
  K.SKIN_KEYS.forEach((k) => {
    const s = K.SKINS[k];
    assert.match(k, /^[a-z0-9-]{2,24}$/, k); assert.ok(!seen.has(k)); seen.add(k);
    assert.ok(s.name && s.name.length <= 32, k + ' name');
    assert.ok(Number.isInteger(s.familyId) && s.familyId >= 0 && s.familyId <= 5, k + ' family');
    assert.ok(Number.isInteger(s.soundId) && s.soundId >= 0 && s.soundId <= 3, k + ' sound');
    assert.ok(s.styles.length > 0 && s.styles.every((n) => K.STYLE_ORDER.includes(n)), k + ' styles');
    assert.equal(s.mask, K.maskOf(s.styles)); assert.deepEqual(K.stylesOf(s.mask), K.STYLE_ORDER.filter((n) => s.styles.includes(n)));
    assert.ok(s.mask > 0 && s.mask < Math.pow(2, 14), k + ' mask fits 14 bits');
    assert.ok(Object.prototype.hasOwnProperty.call(K.FRAMES, s.frame), k + ' frame ' + s.frame);
    assert.ok(Object.prototype.hasOwnProperty.call(K.HARDWARE, s.hardware), k + ' hardware ' + s.hardware);
    assert.ok(Number.isInteger(s.wear) && s.wear >= 0 && s.wear <= 100, k + ' wear');
    assert.ok(K.validateRecipe(s.recipe), k + ' recipe');
    assert.ok(JSON.stringify(s.recipe).length <= K.MAX_RECIPE_BYTES, k + ' recipe fits the inscription limit');
    Object.keys(K.FRAMES).forEach((f) => { if (K.FRAMES[f]) assert.ok(K.validateRecipe(K.FRAMES[f]), 'frame ' + f); });
  });
  assert.ok(seen.has('neon'), 'Neon Threshold stays a skin');
});

test('validateRecipe clamps, fills and refuses', () => {
  const warns = [];
  const r = K.validateRecipe({ format: K.FORMAT, base: 'nonsense', rough: 7, metal: -3, opacity: 0, layers: [{ op: 'grain', scale: 9999, stretch: -5, knots: 99, bogus: 1 }, { op: 'teleport' }, null] }, (w) => warns.push(w));
  assert.equal(r.base, '#808080'); assert.equal(r.rough, 1); assert.equal(r.metal, 0); assert.equal(r.opacity, 0.3);
  assert.equal(r.layers.length, 1); assert.equal(r.layers[0].scale, 80); assert.equal(r.layers[0].stretch, 1); assert.equal(r.layers[0].knots, 5);
  assert.ok(warns.some((w) => /teleport/.test(w)) && warns.some((w) => /bogus/.test(w)));
  assert.equal(K.validateRecipe('not json'), null); assert.equal(K.validateRecipe([]), null); assert.equal(K.validateRecipe(null), null); assert.equal(K.validateRecipe(5), null);
  assert.equal(K.validateRecipe(' '.repeat(K.MAX_RECIPE_BYTES + 1)), null, 'over 8192 bytes');
  const nine = { format: K.FORMAT, layers: Array.from({ length: 12 }, () => ({ op: 'speckle' })) };
  assert.equal(K.validateRecipe(nine).layers.length, 8, 'only 8 layers');
  assert.equal(K.validateRecipe({ format: K.FORMAT, pane: { pane: { base: '#fff' } } }).pane, null, 'panes do not nest');
  assert.equal(K.validateRecipe({ wear: { mode: 'melt' } }).wear.mode, 'none');
});

test('validateRecipe is idempotent and ignores prototype tricks', () => {
  const s = K.SKINS.oak.recipe, once = K.validateRecipe(s);
  assert.deepEqual(K.validateRecipe(once), once);
  assert.equal(K.validateRecipe({ layers: [{ op: '__proto__' }, { op: 'constructor' }, { op: 'toString' }] }).layers.length, 0);
});

test('render is deterministic, seeded, and finite for every skin', () => {
  K.SKIN_KEYS.forEach((k) => {
    const rec = K.SKINS[k].recipe;
    const a = K.render(rec, { w: 48, h: 96, seed: 7 }), b = K.render(rec, { w: 48, h: 96, seed: 7 }), c = K.render(rec, { w: 48, h: 96, seed: 8 });
    assert.ok(same(a.albedo, b.albedo) && same(a.orm, b.orm) && same(a.normal, b.normal), k + ' is deterministic');
    assert.equal(a.albedo.length, 48 * 96 * 4);
    assert.ok(a.height.every(Number.isFinite) && a.rough.every(Number.isFinite), k + ' finite');
    assert.ok(spread(a.albedo) > 6 || k === 'neon' || spread(a.orm) > 6, k + ' is not a flat colour');
    if (!['white', 'neon'].includes(k) && K.SKINS[k].recipe.layers.length) assert.ok(!same(a.albedo, c.albedo), k + ' changes with the seed');
  });
});

test('render sizes are clamped, and a bad recipe renders nothing', () => {
  const big = K.render(K.SKINS.oak.recipe, { w: 99999, h: 99999 }); assert.equal(big.w, K.MAX_SIDE); assert.equal(big.h, K.MAX_SIDE);
  const small = K.render(K.SKINS.oak.recipe, { w: 1, h: 1 }); assert.equal(small.w, 8);
  assert.equal(K.render('nope'), null);
});

test('tint and wear change the result; wear is deterministic', () => {
  const rec = K.SKINS.oak.recipe, base = K.render(rec, { w: 48, h: 96, seed: 3 });
  assert.ok(!same(base.albedo, K.render(rec, { w: 48, h: 96, seed: 3, tint: '#2060ff' }).albedo));
  const w1 = K.render(rec, { w: 48, h: 96, seed: 3, wear: 0.8 }), w2 = K.render(rec, { w: 48, h: 96, seed: 3, wear: 0.8 });
  assert.ok(same(w1.albedo, w2.albedo));
  const iron = K.SKINS.iron.recipe;
  assert.ok(!same(K.render(iron, { w: 48, h: 96, seed: 3, wear: 0 }).albedo, K.render(iron, { w: 48, h: 96, seed: 3, wear: 1 }).albedo), 'rust shows');
});

test('relief comes from the door styles: a mask, panels, and grooves, for every style', () => {
  D.STYLE_NAMES.forEach((n) => {
    const G = D.layoutOf(n), w = Math.round(G.W), h = Math.round(G.H);
    const ops = G.leaves.map((L) => D.faceOps(G, L, 0)).join('');
    const rel = K.relief(G.shape.pts, ops, G.W, G.H, w, h);
    assert.equal(rel.mask.length, w * h, n);
    let inside = 0, groove = 0;
    for (let i = 0; i < rel.mask.length; i++) { if (rel.mask[i] > 0.5) inside++; if (rel.groove[i] > 0.05) groove++; }
    assert.ok(inside > w * h * 0.3 && inside <= w * h, n + ' mask covers the door (' + inside + ')');
    assert.ok(groove > 0, n + ' has grooves from its drawing ops');
    assert.ok(rel.height.every(Number.isFinite) && rel.panels.every(Number.isFinite), n + ' finite');
    const mapped = K.render(K.SKINS.stained.recipe, { w, h, rel, seed: 1 });
    assert.equal(mapped.w, w); assert.ok(mapped.albedo.length === w * h * 4, n + ' render takes the relief size');
  });
});

test('normSkinParams: unknown skins fall back to neon, junk is cleaned', () => {
  assert.deepEqual(K.normSkinParams({ skin: 'oak', frame: 'brass', hardware: 'chrome', tint: '#ff0000', wear: 40 }), { skin: 'oak', frame: 'brass', hardware: 'chrome', tint: '#ff0000', wear: 40 });
  assert.deepEqual(K.normSkinParams({ skin: 'Oak!!', frame: 'gold', hardware: 'x', tint: 'red', wear: 900 }), { skin: 'neon', frame: '', hardware: '', tint: '', wear: 100 });
  assert.deepEqual(K.normSkinParams(null), { skin: 'neon', frame: '', hardware: '', tint: '', wear: -1 });
  assert.equal(K.normSkinParams({ skin: 'constructor' }).skin, 'neon');
  assert.equal(K.normSkinParams({ skin: 'future-skin' }, { 'future-skin': true }).skin, 'future-skin', 'registry skins pass when the table says so');
});

test('allowed: the styles mask is the registry bit order', () => {
  const m = K.maskOf(['rect', 'arch', 'scifi']);
  assert.equal(m, 1 + 8 + 8192);
  assert.ok(K.allowed(m, 'arch') && K.allowed(m, 'scifi') && !K.allowed(m, 'gothic') && !K.allowed(m, 'nope'));
});

test('a render of a whole skin sheet fits a time budget', () => {
  const t = Date.now();
  K.SKIN_KEYS.forEach((k) => K.render(K.SKINS[k].recipe, { w: 128, h: 256, seed: 1 }));
  assert.ok(Date.now() - t < 20000, 'took ' + (Date.now() - t) + ' ms');
});
