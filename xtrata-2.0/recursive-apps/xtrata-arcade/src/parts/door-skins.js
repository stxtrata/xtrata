/*
 * Xtrata Arcade: door skins (hall pack part)
 *
 * What a door is MADE of. doors.js gives a door its shape and behaviour; this file gives it a finish: oak, brushed
 * steel, stained glass and so on. Everything here is pure (no THREE, no DOM): a skin is a small RECIPE (data), and
 * render() turns a recipe plus a seed into texture maps (albedo, opacity, roughness, metalness, height, groove, normal)
 * as plain typed arrays. The hall wraps them in canvas textures; the tests and the sheet tool read them directly.
 *
 *   1. NOISE      seeded value noise, so the same recipe and seed always give the same pixels
 *   2. OPS        the fixed table of texture layers a recipe may use (grain, brush, plates, cells, ...). Every param is
 *                 clamped, every op is looked up by name, so a recipe from chain data can only choose among prepared
 *                 pieces; it cannot run anything. Same trust rule as bays.js.
 *   3. RELIEF     turns a door style's drawing ops (panels, bevels, rivets) into a height map and a panel mask
 *   4. RENDER     recipe + relief + wear + tint -> maps; normal map from height
 *   5. CATALOGUE  the built-in skins (tier 0 of xtrata-door-skins-v1), the frames and the hardware finishes
 *
 * A tier 1 skin on chain is an inscription holding one recipe in this same format ("door-skin-recipe/1"); the hall
 * validates it with validateRecipe() and renders it with the same code as a built-in. See docs/door-skin-recipe.md.
 *
 * Not in the hall build yet: the skins contract and this kit land first, the hall wiring is the next phase.
 */
(function (root) {
  'use strict';
  if (root.XADoorSkins) return;

  var FORMAT = 'door-skin-recipe/1';
  var MAX_SIDE = 512, MAX_LAYERS = 8, MAX_RECIPE_BYTES = 8192;

  /* ================================================================ 1. NOISE + COLOUR */
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  function num(v, lo, hi, def) {
    v = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
    return typeof v === 'number' && isFinite(v) ? clamp(v, lo, hi) : def;
  }
  function hex(v, def) { return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v.toLowerCase() : def; }
  function rgb(h) { return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255]; }
  function toHex(c) { var s = '#'; for (var i = 0; i < 3; i++) { var n = Math.round(clamp(c[i], 0, 1) * 255).toString(16); s += n.length < 2 ? '0' + n : n; } return s; }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a || 1e-9), 0, 1); return t * t * (3 - 2 * t); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function strSeed(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  function ihash(x, y, s) {
    var h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1103515245)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function vnoise(x, y, s) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = ihash(xi, yi, s), b = ihash(xi + 1, yi, s), c = ihash(xi, yi + 1, s), d = ihash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, s, oct) {
    var sum = 0, amp = 0.5, norm = 0, f = 1;
    for (var i = 0; i < oct; i++) { sum += amp * vnoise(x * f, y * f, s + i * 101); norm += amp; amp *= 0.5; f *= 2.03; }
    return sum / norm;
  }

  /* ================================================================ 2. OPS (the fixed table of layers) */
  // Param specs: n number [lo, hi, def], i whole number, c colour, e one of a list, a list of colours.
  var SPEC = {
    grain:    { color2: ['c', '#3a2410'], scale: ['n', 2, 80, 18], stretch: ['n', 1, 80, 24], contrast: ['n', 0, 1, 0.6], warp: ['n', 0, 1, 0.5], knots: ['i', 0, 5, 0] },
    planks:   { count: ['i', 1, 8, 3], seam: ['n', 0, 1, 0.6], vary: ['n', 0, 0.4, 0.1] },
    brush:    { dir: ['e', ['h', 'v'], 'h'], freq: ['n', 40, 900, 300], amount: ['n', 0, 1, 0.5] },
    speckle:  { amount: ['n', 0, 1, 0.1], scale: ['n', 20, 600, 220] },
    blotch:   { color: ['c', '#7a5a1e'], amount: ['n', 0, 1, 0.5], scale: ['n', 0.5, 14, 5], th: ['n', 0, 1, 0.55], soft: ['n', 0.01, 0.5, 0.2], h: ['n', -1, 1, 0], r: ['n', -1, 1, 0.1], bias: ['n', -1, 1, 0] },
    plates:   { rows: ['i', 1, 8, 4], cols: ['i', 1, 4, 2], seam: ['n', 0, 1, 0.7], rivets: ['i', 0, 1, 1], vary: ['n', 0, 0.4, 0.08] },
    stripes:  { color: ['c', '#17171a'], color2: ['c', '#e0b81c'], width: ['n', 0.02, 0.3, 0.07], angle: ['n', 0, 90, 45] },
    cells:    { palette: ['a', ['#c0392b', '#2a6fb5', '#d4a017', '#2e8b57']], count: ['i', 4, 64, 22], lead: ['n', 0.002, 0.03, 0.012], leadColor: ['c', '#17171a'], opacity: ['n', 0.3, 1, 0.8] },
    frost:    { amount: ['n', 0, 1, 0.8], scale: ['n', 20, 400, 160], opacity: ['n', 0.3, 1, 0.7] },
    scratches:{ count: ['i', 0, 80, 12], len: ['n', 0.02, 0.4, 0.12], color: ['c', '#e8e8e8'], amount: ['n', 0, 1, 0.25] },
    blocks:   { rows: ['i', 2, 12, 6], cols: ['i', 1, 6, 2], mortar: ['n', 0, 1, 0.6], vary: ['n', 0, 0.4, 0.14], color: ['c', '#6c6a63'] }
  };
  var OP_NAMES = Object.keys(SPEC);

  function normLayer(layer, warn) {
    if (!layer || typeof layer !== 'object' || typeof layer.op !== 'string' || !Object.prototype.hasOwnProperty.call(SPEC, layer.op)) { if (warn) warn('unknown layer op ' + JSON.stringify(layer && layer.op)); return null; }
    var spec = SPEC[layer.op], out = { op: layer.op }, k;
    for (k in layer) if (k !== 'op' && !Object.prototype.hasOwnProperty.call(spec, k) && warn) warn(layer.op + ': param "' + k + '" means nothing and is ignored');
    for (k in spec) {
      var s = spec[k], v = layer[k];
      if (s[0] === 'n') out[k] = num(v, s[1], s[2], s[3]);
      else if (s[0] === 'i') out[k] = Math.round(num(v, s[1], s[2], s[3]));
      else if (s[0] === 'c') out[k] = hex(v, s[1]);
      else if (s[0] === 'e') out[k] = s[1].indexOf(v) >= 0 ? v : s[2];
      else if (s[0] === 'a') {
        var list = Array.isArray(v) ? v.map(function (x) { return hex(x, null); }).filter(Boolean).slice(0, 8) : [];
        out[k] = list.length ? list : s[1].slice();
      }
    }
    return out;
  }

  var WEAR_MODES = ['none', 'scuff', 'chip', 'rust'];
  // A recipe, cleaned: every field present and in range. Returns null if it is not a recipe at all.
  function validateRecipe(r, warn) {
    if (typeof r === 'string') { if (r.length > MAX_RECIPE_BYTES) { if (warn) warn('recipe is longer than ' + MAX_RECIPE_BYTES + ' bytes'); return null; } try { r = JSON.parse(r); } catch (e) { if (warn) warn('recipe is not valid JSON'); return null; } }
    if (!r || typeof r !== 'object' || Array.isArray(r)) { if (warn) warn('recipe is not an object'); return null; }
    if (r.format !== FORMAT && warn) warn('format should be "' + FORMAT + '"');
    var layers = [], src = Array.isArray(r.layers) ? r.layers : [];
    if (src.length > MAX_LAYERS && warn) warn('only the first ' + MAX_LAYERS + ' layers are used');
    src.slice(0, MAX_LAYERS).forEach(function (l) { var n = normLayer(l, warn); if (n) layers.push(n); });
    var w = r.wear && typeof r.wear === 'object' ? r.wear : {};
    var out = {
      format: FORMAT, base: hex(r.base, '#808080'), rough: num(r.rough, 0, 1, 0.6), metal: num(r.metal, 0, 1, 0), opacity: num(r.opacity, 0.3, 1, 1),
      layers: layers, wear: { mode: WEAR_MODES.indexOf(w.mode) >= 0 ? w.mode : 'none', color: hex(w.color, '#7a5a3a') },
      emissive: r.emissive && typeof r.emissive === 'object' ? { color: hex(r.emissive.color, '#3be6ff'), intensity: num(r.emissive.intensity, 0, 2, 0.8) } : null,
      pane: null
    };
    if (r.pane && typeof r.pane === 'object' && !r.pane.pane) out.pane = validateRecipe(r.pane, warn);
    return out;
  }

  // ---- buffers: the working maps for one render. Colours are sRGB 0..1 per channel.
  function makeBuffers(w, h, rec) {
    var n = w * h, b = { w: w, h: h, r: new Float32Array(n), g: new Float32Array(n), b: new Float32Array(n), a: new Float32Array(n), rough: new Float32Array(n),
      metal: new Float32Array(n), height: new Float32Array(n), groove: new Float32Array(n) };
    var c = rgb(rec.base);
    for (var i = 0; i < n; i++) { b.r[i] = c[0]; b.g[i] = c[1]; b.b[i] = c[2]; b.a[i] = rec.opacity; b.rough[i] = rec.rough; b.metal[i] = rec.metal; b.height[i] = 0.5; }
    return b;
  }
  function paint(b, i, col, t) { b.r[i] = mix(b.r[i], col[0], t); b.g[i] = mix(b.g[i], col[1], t); b.b[i] = mix(b.b[i], col[2], t); }
  function shade(b, i, f) { b.r[i] = clamp(b.r[i] * f, 0, 1); b.g[i] = clamp(b.g[i] * f, 0, 1); b.b[i] = clamp(b.b[i] * f, 0, 1); }

  var OPS = {
    grain: function (b, p, seed) {
      var w = b.w, h = b.h, c2 = rgb(p.color2), asp = w / h, i = 0, x, y, knots = [], k;
      for (k = 0; k < p.knots; k++) knots.push({ x: (0.15 + 0.7 * ihash(k, 7, seed)) * asp, y: 0.12 + 0.76 * ihash(k, 11, seed), r: 0.018 + 0.03 * ihash(k, 13, seed) });
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var X = x / h, Y = y / h, kd = 0, kw = 0;
        for (k = 0; k < knots.length; k++) {                                       // a knot bends the grain around it and leaves dark rings
          var dx = X - knots[k].x, dy = (Y - knots[k].y) * 0.7, d = Math.sqrt(dx * dx + dy * dy), kr = knots[k].r;
          if (d < kr * 3) { kw += (1 - d / (kr * 3)) * 0.06 * (dx > 0 ? 1 : -1); if (d < kr * 1.6) kd = Math.max(kd, 0.5 + 0.5 * Math.sin(d / kr * 9)) * smooth(kr * 1.6, kr * 0.2, d); }
        }
        var bend = fbm(X * 1.6, Y * 0.5, seed, 3) - 0.5, wob = fbm(X * 6, Y * 1.3, seed + 9, 2) - 0.5;
        var t = (X + kw) * p.scale + p.warp * 14 * bend + p.warp * 3 * wob, yf = Y * p.scale / p.stretch * 2.5;     // t runs across the grain, yf along it
        var s1 = vnoise(t, yf, seed + 1), s2 = vnoise(t * 3.1, yf * 2.7, seed + 2), s3 = vnoise(t * 9.7, yf * 6, seed + 3);
        var ring = Math.abs(t - Math.floor(t) - 0.5) * 2;
        var g = clamp((0.42 * s1 + 0.3 * s2 + 0.18 * s3 + 0.1 * ring + kd * 0.4 - 0.28) * 1.9, 0, 1);
        paint(b, i, c2, g * p.contrast);
        b.height[i] += (g - 0.5) * 0.02;
        b.rough[i] = clamp(b.rough[i] + (g - 0.5) * 0.12, 0, 1);
      }
    },
    planks: function (b, p, seed) {
      var w = b.w, h = b.h, i = 0, x, y;
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var u = x / w * p.count, id = Math.floor(u), f = u - id, edge = Math.min(f, 1 - f) * w / p.count;   // distance to the seam in px
        shade(b, i, 1 + (ihash(id, 3, seed) - 0.5) * 2 * p.vary);
        var s = smooth(2.2, 0.2, edge);
        if (s > 0) { shade(b, i, 1 - 0.55 * p.seam * s); b.height[i] -= 0.07 * p.seam * s; b.groove[i] = Math.max(b.groove[i], s * p.seam * 0.5); }
      }
    },
    brush: function (b, p, seed) {
      var w = b.w, h = b.h, i = 0, x, y;
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var a = p.dir === 'h' ? y / h * p.freq : x / w * p.freq, o = p.dir === 'h' ? x / w * 3 : y / h * 3;
        var n = vnoise(a, o, seed) * 0.6 + vnoise(a * 2.7, o * 2, seed + 9) * 0.4 - 0.5;
        shade(b, i, 1 + n * 0.5 * p.amount);
        b.rough[i] = clamp(b.rough[i] + n * 0.5 * p.amount, 0, 1);
        b.height[i] += n * 0.006 * p.amount;
      }
    },
    speckle: function (b, p, seed) {
      var w = b.w, h = b.h, i = 0, x, y;
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var n = fbm(x / w * p.scale, y / h * p.scale, seed, 2) - 0.5;
        shade(b, i, 1 + n * p.amount * 1.2);
        b.rough[i] = clamp(b.rough[i] + n * p.amount * 0.5, 0, 1);
        b.height[i] += n * 0.008 * p.amount;
      }
    },
    blotch: function (b, p, seed) {
      var w = b.w, h = b.h, i = 0, x, y, col = rgb(p.color);
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var v = y / h, bias = p.bias >= 0 ? mix(1, v * v * 2.2, p.bias) : mix(1, (1 - v) * (1 - v) * 2.2, -p.bias);
        var m = smooth(p.th - p.soft, p.th + p.soft, fbm(x / h * p.scale, v * p.scale, seed, 4) * bias) * p.amount;
        if (m <= 0) continue;
        paint(b, i, col, m);
        b.rough[i] = clamp(b.rough[i] + p.r * m, 0, 1);
        b.height[i] += p.h * m * 0.03;
        if (p.r > 0.15) b.metal[i] = mix(b.metal[i], 0, m * 0.8);   // corrosion is not shiny metal
      }
    },
    plates: function (b, p, seed) {
      var w = b.w, h = b.h, i = 0, x, y, rows = p.rows, cols = p.cols;
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var u = x / w * cols, v = y / h * rows, iu = Math.floor(u), iv = Math.floor(v), fu = u - iu, fv = v - iv;
        var ex = Math.min(fu, 1 - fu) * w / cols, ey = Math.min(fv, 1 - fv) * h / rows, e = Math.min(ex, ey);
        shade(b, i, 1 + (ihash(iu, iv, seed) - 0.5) * 2 * p.vary);
        var s = smooth(2.6, 0.3, e);
        if (s > 0) { shade(b, i, 1 - 0.6 * p.seam * s); b.height[i] -= 0.09 * p.seam * s; b.groove[i] = Math.max(b.groove[i], s * p.seam * 0.4); }
        if (p.rivets) {
          var rs = Math.max(2.2, Math.min(w / cols, h / rows) * 0.035), cx = fu < 0.5 ? 0.09 : 0.91, cy = fv < 0.5 ? 0.09 : 0.91;
          var dx = (fu - cx) * w / cols, dy = (fv - cy) * h / rows, d = Math.sqrt(dx * dx + dy * dy);
          if (d < rs) { var dome = Math.sqrt(1 - (d / rs) * (d / rs)); b.height[i] += 0.07 * dome; shade(b, i, 1 + 0.25 * dome - 0.15 * (dx + dy) / rs); }
        }
      }
    },
    stripes: function (b, p) {
      var w = b.w, h = b.h, i = 0, x, y, a = p.angle * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), c1 = rgb(p.color), c2 = rgb(p.color2);
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var t = ((x * ca + y * sa) / h) / p.width / 2, f = t - Math.floor(t), m = smooth(0.47, 0.53, f) - smooth(0.97, 1.03, f) + (f > 0.97 ? 1 : 0);
        b.r[i] = mix(c2[0], c1[0], m); b.g[i] = mix(c2[1], c1[1], m); b.b[i] = mix(c2[2], c1[2], m);
      }
    },
    cells: function (b, p, seed) {
      var w = b.w, h = b.h, i = 0, x, y, asp = w / h, G = Math.max(2, Math.round(Math.sqrt(p.count / asp))), Gx = Math.max(2, Math.round(G * asp)), lead = rgb(p.leadColor), pal = p.palette.map(rgb);
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var gx = x / w * Gx, gy = y / h * G, cx = Math.floor(gx), cy = Math.floor(gy), f1 = 9, f2 = 9, id = 0, dx, dy;
        for (dy = -1; dy <= 1; dy++) for (dx = -1; dx <= 1; dx++) {
          var nx = cx + dx, ny = cy + dy, px = nx + 0.15 + 0.7 * ihash(nx, ny, seed), py = ny + 0.15 + 0.7 * ihash(ny, nx, seed + 3);
          var d = Math.sqrt(((gx - px) * (w / Gx)) * ((gx - px) * (w / Gx)) + ((gy - py) * (h / G)) * ((gy - py) * (h / G))) / h;
          if (d < f1) { f2 = f1; f1 = d; id = nx * 7919 + ny; } else if (d < f2) f2 = d;
        }
        var edge = (f2 - f1) / p.lead;
        var col = pal[Math.floor(ihash(id, 5, seed) * pal.length) % pal.length], glow = 1.08 - f1 * 3.2;
        var m = smooth(0.4, 1.4, edge);                                                // 0 on the lead, 1 in the glass
        b.r[i] = mix(lead[0], clamp(col[0] * glow, 0, 1), m); b.g[i] = mix(lead[1], clamp(col[1] * glow, 0, 1), m); b.b[i] = mix(lead[2], clamp(col[2] * glow, 0, 1), m);
        b.a[i] = mix(1, p.opacity, m); b.rough[i] = mix(0.55, 0.05, m); b.metal[i] = mix(0.6, 0, m); b.height[i] += (1 - m) * 0.08 - 0.02;
        b.groove[i] = Math.max(b.groove[i], 1 - m);
      }
    },
    frost: function (b, p, seed) {
      var w = b.w, h = b.h, i = 0, x, y;
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var n = fbm(x / w * p.scale, y / h * p.scale, seed, 3), n2 = vnoise(x * 0.9, y * 0.9, seed + 2);
        paint(b, i, [0.92, 0.96, 0.98], p.amount * (0.35 + 0.5 * n));
        b.a[i] = clamp(p.opacity + (n2 - 0.5) * 0.25, 0.2, 1); b.rough[i] = clamp(0.5 + (n - 0.5) * 0.5, 0, 1); b.height[i] += (n2 - 0.5) * 0.01;
      }
    },
    scratches: function (b, p, seed) {
      var w = b.w, h = b.h, col = rgb(p.color), k, t;
      for (k = 0; k < p.count; k++) {
        var x0 = ihash(k, 1, seed) * w, y0 = ihash(k, 2, seed) * h, a = ihash(k, 3, seed) * Math.PI, L = p.len * h * (0.4 + ihash(k, 4, seed)), n = Math.max(2, Math.round(L));
        for (t = 0; t < n; t++) {
          var px = Math.round(x0 + Math.cos(a) * t), py = Math.round(y0 + Math.sin(a) * t);
          if (px < 0 || py < 0 || px >= w || py >= h) continue;
          var i = py * w + px, f = Math.sin(t / n * Math.PI) * p.amount;
          paint(b, i, col, f * 0.7); b.rough[i] = clamp(b.rough[i] - 0.1 * f, 0, 1); b.height[i] -= 0.01 * f;
        }
      }
    },
    blocks: function (b, p, seed) {
      var w = b.w, h = b.h, i = 0, x, y, col = rgb(p.color), rows = p.rows, cols = p.cols;
      for (y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
        var v = y / h * rows, iv = Math.floor(v), u = x / w * cols + (iv % 2 ? 0.5 : 0), iu = Math.floor(u), fu = u - iu, fv = v - iv;
        var ex = Math.min(fu, 1 - fu) * w / cols, ey = Math.min(fv, 1 - fv) * h / rows, e = Math.min(ex, ey);
        var tone = 1 + (ihash(iu, iv, seed) - 0.5) * 2 * p.vary, n = fbm(x / h * 9, y / h * 9, seed, 4);
        paint(b, i, col, 0.9); shade(b, i, tone * (0.8 + 0.4 * n));
        var s = smooth(2.6, 0.3, e);
        if (s > 0) { shade(b, i, 1 - 0.5 * p.mortar * s); b.height[i] -= 0.1 * p.mortar * s; }
        b.height[i] += (n - 0.5) * 0.03; b.rough[i] = clamp(0.8 + (n - 0.5) * 0.3, 0, 1);
      }
    }
  };

  function applyLayers(b, rec, seed) {
    rec.layers.forEach(function (l, k) { OPS[l.op](b, l, seed + k * 977); });
  }

  /* ================================================================ 3. RELIEF (from a door style's drawing ops) */
  // ops: the string faceOps() makes for each leaf ("kind<TAB>classes<TAB>args" per line, design units, y down).
  // Returns { height (delta, centred on 0), groove 0..1, panels 0..1 (inside a panel field), mask (door outline), dist }.
  function pathPoints(d) {
    var pts = [], toks = String(d).match(/[MLHVZmlhvz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [], i = 0, cmd = '', cx = 0, cy = 0, closed = false;
    while (i < toks.length) {
      if (/[A-Za-z]/.test(toks[i])) { cmd = toks[i++]; if (cmd === 'Z' || cmd === 'z') { closed = true; } continue; }
      if (cmd === 'M' || cmd === 'L') { cx = Number(toks[i++]); cy = Number(toks[i++]); pts.push([cx, cy]); if (cmd === 'M') cmd = 'L'; }
      else if (cmd === 'H') { cx = Number(toks[i++]); pts.push([cx, cy]); }
      else if (cmd === 'V') { cy = Number(toks[i++]); pts.push([cx, cy]); }
      else i++;                                                                     // curves are not used by faces; skip anything else
    }
    return { pts: pts, closed: closed };
  }
  function roundRect(x, y, w, h, r) {
    r = Math.min(r || 0, w / 2, h / 2);
    if (r < 0.5) return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    var o = [], n = 5, c = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]], k, j;
    for (k = 0; k < 4; k++) for (j = 0; j <= n; j++) { var t = c[k][2] + j / n * Math.PI / 2; o.push([c[k][0] + Math.cos(t) * r, c[k][1] + Math.sin(t) * r]); }
    return o;
  }
  function circle(cx, cy, r) { var o = [], n = Math.max(12, Math.min(48, Math.round(r * 1.5))), i; for (i = 0; i < n; i++) { var t = i / n * Math.PI * 2; o.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]); } return o; }

  function fillPoly(buf, w, h, pts, S, val, clip, op) {          // scanline fill, even-odd, 1 px anti-aliased edge by supersampling in x
    var minY = 1e9, maxY = -1e9, i, j;
    for (i = 0; i < pts.length; i++) { minY = Math.min(minY, pts[i][1] * S); maxY = Math.max(maxY, pts[i][1] * S); }
    var y0 = Math.max(clip[1], Math.floor(minY)), y1 = Math.min(clip[3] - 1, Math.ceil(maxY));
    for (var y = y0; y <= y1; y++) {
      for (var sub = 0; sub < 2; sub++) {
        var yy = y + 0.25 + sub * 0.5, xs = [];
        for (i = 0; i < pts.length; i++) {
          var a = pts[i], bb = pts[(i + 1) % pts.length], ay = a[1] * S, by = bb[1] * S;
          if ((ay <= yy && by > yy) || (by <= yy && ay > yy)) xs.push((a[0] + (yy / S - a[1]) / (bb[1] - a[1]) * (bb[0] - a[0])) * S);
        }
        xs.sort(function (p, q) { return p - q; });
        for (j = 0; j + 1 < xs.length; j += 2) {
          var xa = Math.max(clip[0], Math.floor(xs[j])), xb = Math.min(clip[2] - 1, Math.ceil(xs[j + 1]));
          for (var x = xa; x <= xb; x++) {
            var cov = clamp(Math.min(x + 1, xs[j + 1]) - Math.max(x, xs[j]), 0, 1) * 0.5;
            if (cov > 0) op(buf, y * w + x, val, cov);
          }
        }
      }
    }
  }
  function strokeSeg(buf, w, h, a, b2, S, width, depth, clip, op) {
    var x0 = a[0] * S, y0 = a[1] * S, x1 = b2[0] * S, y1 = b2[1] * S, hw = Math.max(0.7, width * S / 2);
    var xa = Math.max(clip[0], Math.floor(Math.min(x0, x1) - hw - 1)), xb = Math.min(clip[2] - 1, Math.ceil(Math.max(x0, x1) + hw + 1));
    var ya = Math.max(clip[1], Math.floor(Math.min(y0, y1) - hw - 1)), yb = Math.min(clip[3] - 1, Math.ceil(Math.max(y0, y1) + hw + 1));
    var dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1e-9;
    for (var y = ya; y <= yb; y++) for (var x = xa; x <= xb; x++) {
      var t = clamp(((x + 0.5 - x0) * dx + (y + 0.5 - y0) * dy) / L2, 0, 1), px = x0 + t * dx, py = y0 + t * dy, d = Math.sqrt((x + 0.5 - px) * (x + 0.5 - px) + (y + 0.5 - py) * (y + 0.5 - py));
      var f = 1 - smooth(hw - 0.6, hw + 0.9, d);
      if (f > 0) op(buf, y * w + x, depth, f);
    }
  }
  function polyArea(pts) { var s = 0, i; for (i = 0; i < pts.length; i++) { var a = pts[i], b2 = pts[(i + 1) % pts.length]; s += a[0] * b2[1] - b2[0] * a[1]; } return Math.abs(s) / 2; }
  function polyBox(pts) { var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); return [x0, y0, x1, y1]; }

  // outline: the door's shape points in design units; ops: one string per leaf face (joined); S: px per design unit.
  function relief(outline, ops, designW, designH, w, h) {
    var S = w / designW, N = w * h, out = { w: w, h: h, height: new Float32Array(N), groove: new Float32Array(N), panels: new Float32Array(N), mask: new Float32Array(N), dist: new Float32Array(N) };
    var add = function (buf, i, v, f) { buf[i] += v * f; }, setMax = function (buf, i, v, f) { buf[i] = Math.max(buf[i], v * f); },
      acc = function (buf, i, v, f) { buf[i] = Math.min(v, buf[i] + v * f); }, full = [0, 0, w, h], clip = full, clips = [];   // acc: coverage adds up over the two sub-scanlines, capped at v
    fillPoly(out.mask, w, h, outline, S, 1, full, acc);
    var lines = String(ops).split('\n'), li;
    var lw = 1.3;                                                                   // line width in design units
    for (li = 0; li < lines.length; li++) {
      var f = lines[li].split('\t'); if (f.length < 3 && f[0] !== 'E') continue;
      var kind = f[0], cl = (f[1] || '').split(' '), arg = f[2] || '', dim = cl.indexOf('d') >= 0, thick = cl.indexOf('t') >= 0, cls = cl[0], a = arg.split(' ').map(Number), pts = null, closed = false, wd = lw * (thick ? 1.8 : 1);
      if (kind === 'K') { clips.push(clip); clip = [Math.max(0, Math.floor(a[0] * S)), Math.max(0, Math.floor(a[1] * S)), Math.min(w, Math.ceil((a[0] + a[2]) * S)), Math.min(h, Math.ceil((a[1] + a[3]) * S))]; continue; }
      if (kind === 'E') { if (clips.length) clip = clips.pop(); continue; }
      if (kind === 'R') { pts = roundRect(a[0], a[1], a[2], a[3], a[4]); closed = true; }
      else if (kind === 'C') { pts = circle(a[0], a[1], a[2]); closed = true; }
      else if (kind === 'P') { var pp = pathPoints(arg); pts = pp.pts; closed = pp.closed; }
      if (!pts || pts.length < 2) continue;
      var box = polyBox(pts), whole = closed && (box[2] - box[0]) > designW * 0.9 && (box[3] - box[1]) > designH * 0.9, small = closed && polyArea(pts) < designW * designH * 0.004, i2;
      if (cls === 'k') {                                                            // solid dot: a rivet or stud, a little dome
        if (closed) { var c0 = [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2], rr = Math.max(0.6, (box[2] - box[0]) / 2);
          for (var yy = Math.max(clip[1], Math.floor((c0[1] - rr) * S) - 1); yy <= Math.min(clip[3] - 1, Math.ceil((c0[1] + rr) * S) + 1); yy++) for (var xx = Math.max(clip[0], Math.floor((c0[0] - rr) * S) - 1); xx <= Math.min(clip[2] - 1, Math.ceil((c0[0] + rr) * S) + 1); xx++) {
            var dd = Math.sqrt(Math.pow((xx + 0.5) / S - c0[0], 2) + Math.pow((yy + 0.5) / S - c0[1], 2)) / rr; if (dd < 1) out.height[yy * w + xx] += 0.07 * Math.sqrt(1 - dd * dd); } }
        continue;
      }
      if (closed && cls === 'f') { if (!whole) fillPoly(out.height, w, h, pts, S, 0.05, clip, add); continue; }   // a plate: strap, escutcheon
      if (closed && !whole) {
        if (dim) fillPoly(out.height, w, h, pts, S, 0.045, clip, add);                // plateau of a fielded panel
        else {
          fillPoly(out.height, w, h, pts, S, -0.05, clip, add);                        // the panel field is recessed
          if (!small) fillPoly(out.panels, w, h, pts, S, 1, clip, acc);
        }
      }
      var depth = dim ? -0.035 : -0.09, gv = dim ? 0.25 : 0.9;
      for (i2 = 0; i2 < pts.length - (closed ? 0 : 1); i2++) {
        var p0 = pts[i2], p1 = pts[(i2 + 1) % pts.length];
        strokeSeg(out.height, w, h, p0, p1, S, wd * (dim ? 0.8 : 1), depth, clip, add);
        strokeSeg(out.groove, w, h, p0, p1, S, wd * 0.7, gv, clip, setMax);
      }
    }
    // distance (px) from outside the door, by two chamfer passes: used for chipped edges and the frame bevel
    var INF = 1e6, d = out.dist, x, y, i;
    for (i = 0; i < N; i++) d[i] = out.mask[i] > 0.5 ? INF : 0;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) { i = y * w + x; if (d[i] === 0) continue; var m = d[i];
      if (x > 0) m = Math.min(m, d[i - 1] + 1); else m = Math.min(m, 1); if (y > 0) m = Math.min(m, d[i - w] + 1); else m = Math.min(m, 1);
      if (x > 0 && y > 0) m = Math.min(m, d[i - w - 1] + 1.41); d[i] = m; }
    for (y = h - 1; y >= 0; y--) for (x = w - 1; x >= 0; x--) { i = y * w + x; if (d[i] === 0) continue; var m2 = d[i];
      if (x < w - 1) m2 = Math.min(m2, d[i + 1] + 1); else m2 = Math.min(m2, 1); if (y < h - 1) m2 = Math.min(m2, d[i + w] + 1); else m2 = Math.min(m2, 1);
      if (x < w - 1 && y < h - 1) m2 = Math.min(m2, d[i + w + 1] + 1.41); d[i] = m2; }
    return out;
  }

  /* ================================================================ 4. RENDER */
  function applyTint(b, tint, amount) {
    var t = rgb(tint), lt = 0.299 * t[0] + 0.587 * t[1] + 0.114 * t[2] || 0.5, n = b.w * b.h, i;
    for (i = 0; i < n; i++) {
      var l = 0.299 * b.r[i] + 0.587 * b.g[i] + 0.114 * b.b[i];
      b.r[i] = mix(b.r[i], clamp(t[0] / lt * l, 0, 1), amount); b.g[i] = mix(b.g[i], clamp(t[1] / lt * l, 0, 1), amount); b.b[i] = mix(b.b[i], clamp(t[2] / lt * l, 0, 1), amount);
    }
  }
  // wear 0..1. mode from the recipe. rel may be null (then no edge chips).
  function applyWear(b, wear, mode, color, rel, seed, handle) {
    if (!(wear > 0) || mode === 'none') return;
    var w = b.w, h = b.h, n = w * h, i, x, y, col = rgb(color);
    for (i = 0, y = 0; y < h; y++) for (x = 0; x < w; x++, i++) {
      var u = x / w, v = y / h, nz = fbm(x / h * 14, v * 14, seed + 31, 3), nz2 = fbm(x / h * 5, v * 5, seed + 47, 3);
      var grime = smooth(0.6, 1, v) * smooth(0.35, 0.8, nz2) * wear * 0.55;                       // dirt gathers low down
      if (grime > 0) { shade(b, i, 1 - grime * 0.55); b.rough[i] = clamp(b.rough[i] + grime * 0.3, 0, 1); }
      if (mode === 'scuff' || mode === 'chip') {
        var hd = handle ? Math.sqrt(Math.pow(u - handle[0], 2) + Math.pow((v - handle[1]) * 1.6, 2)) : 9, scuff = smooth(0.2, 0.02, hd) * smooth(0.35, 0.7, nz) * wear;
        if (scuff > 0) { shade(b, i, 1 + scuff * 0.18); b.rough[i] = clamp(b.rough[i] - scuff * 0.1, 0, 1); }
      }
      if (mode === 'chip' && rel) {
        var e = rel.dist[i], chip = smooth(0.62 - wear * 0.45, 0.75 - wear * 0.45, nz) * smooth(14, 1, e) * wear * 1.8, inside = rel.mask[i] > 0.5 ? 1 : 0;
        chip = clamp(chip, 0, 1) * inside; if (chip > 0.5) { paint(b, i, col, 0.9); b.rough[i] = clamp(b.rough[i] + 0.25, 0, 1); b.height[i] -= 0.02; b.metal[i] = mix(b.metal[i], 0, 0.5); }
      }
      if (mode === 'rust') {
        var r = smooth(0.62 - wear * 0.3, 0.74 - wear * 0.3, fbm(x / h * 6, v * 6, seed + 61, 4) * (0.6 + 0.8 * v)) * Math.min(1, wear * 1.6);
        if (r > 0) { paint(b, i, col, r * 0.9); shade(b, i, 1 - 0.2 * nz * r); b.rough[i] = clamp(b.rough[i] + r * 0.35, 0, 1); b.metal[i] = mix(b.metal[i], 0, r * 0.7); b.height[i] += r * 0.02 * nz; }
      }
    }
  }

  // The tangent-space normal map from a height field, as RGBA bytes.
  function normalFromHeight(height, w, h, strength) {
    var out = new Uint8ClampedArray(w * h * 4), x, y, s = strength == null ? 6 : strength;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      var xl = Math.max(0, x - 1), xr = Math.min(w - 1, x + 1), yu = Math.max(0, y - 1), yd = Math.min(h - 1, y + 1);
      var dx = (height[y * w + xr] - height[y * w + xl]) * 0.5 * s * 8, dy = (height[yd * w + x] - height[yu * w + x]) * 0.5 * s * 8, l = Math.sqrt(dx * dx + dy * dy + 1), o = (y * w + x) * 4;
      out[o] = (-dx / l * 0.5 + 0.5) * 255; out[o + 1] = (dy / l * 0.5 + 0.5) * 255; out[o + 2] = (1 / l * 0.5 + 0.5) * 255; out[o + 3] = 255;
    }
    return out;
  }

  // Render one recipe. opts: { w, h, seed, wear 0..1, tint '#rrggbb', tintAmount, rel (from relief()), handle [u, v], reliefStrength }
  // Returns float maps (r g b a rough metal height groove, each w*h) plus bytes: albedo RGBA, normal RGBA, orm (R rough, G metal, B height) and the recipe used.
  function render(recipeIn, opts) {
    opts = opts || {};
    var rec = validateRecipe(recipeIn), w, h;
    if (!rec) return null;
    w = clamp(Math.round(opts.w || 128), 8, MAX_SIDE); h = clamp(Math.round(opts.h || 256), 8, MAX_SIDE);
    if (opts.rel) { w = opts.rel.w; h = opts.rel.h; }
    var seed = (opts.seed == null ? strSeed(JSON.stringify(rec)) : opts.seed) | 0;
    var b = makeBuffers(w, h, rec), n = w * h, i;
    applyLayers(b, rec, seed);
    if (rec.pane && opts.rel) {                                                      // glass (or whatever the pane recipe is) inside the panel fields
      var pb = makeBuffers(w, h, rec.pane); applyLayers(pb, rec.pane, seed + 4001);
      for (i = 0; i < n; i++) {
        var m = opts.rel.panels[i]; if (m <= 0) continue;
        b.r[i] = mix(b.r[i], pb.r[i], m); b.g[i] = mix(b.g[i], pb.g[i], m); b.b[i] = mix(b.b[i], pb.b[i], m); b.a[i] = mix(b.a[i], pb.a[i], m);
        b.rough[i] = mix(b.rough[i], pb.rough[i], m); b.metal[i] = mix(b.metal[i], pb.metal[i], m); b.height[i] += (pb.height[i] - 0.5) * m; b.groove[i] = Math.max(b.groove[i], pb.groove[i] * m);
      }
    }
    if (opts.rel) for (i = 0; i < n; i++) { b.height[i] += opts.rel.height[i]; b.groove[i] = Math.max(b.groove[i], opts.rel.groove[i]); }
    applyWear(b, num(opts.wear, 0, 1, 0), rec.wear.mode, rec.wear.color, opts.rel || null, seed, opts.handle || null);
    if (opts.tint && hex(opts.tint, null)) applyTint(b, hex(opts.tint, '#ffffff'), num(opts.tintAmount, 0, 1, 0.55));
    b.recipe = rec;
    b.albedo = new Uint8ClampedArray(n * 4); b.orm = new Uint8ClampedArray(n * 4);
    for (i = 0; i < n; i++) {
      b.albedo[i * 4] = b.r[i] * 255; b.albedo[i * 4 + 1] = b.g[i] * 255; b.albedo[i * 4 + 2] = b.b[i] * 255; b.albedo[i * 4 + 3] = b.a[i] * 255;
      b.orm[i * 4] = b.rough[i] * 255; b.orm[i * 4 + 1] = b.metal[i] * 255; b.orm[i * 4 + 2] = clamp(b.height[i], 0, 1) * 255; b.orm[i * 4 + 3] = 255;
    }
    b.normal = normalFromHeight(b.height, w, h, opts.reliefStrength);
    return b;
  }

  /* ================================================================ 5. CATALOGUE */
  var STYLE_ORDER = ['rect', 'tall', 'wide', 'arch', 'gothic', 'double', 'cathedral', 'circle', 'oval', 'hexagon', 'octagon', 'industrial', 'vintage', 'scifi'];
  function maskOf(names) { var m = 0; names.forEach(function (n) { var i = STYLE_ORDER.indexOf(n); if (i >= 0) m += Math.pow(2, i); }); return m; }
  function stylesOf(mask) { return STYLE_ORDER.filter(function (n, i) { return Math.floor(mask / Math.pow(2, i)) % 2 === 1; }); }
  var ALL = STYLE_ORDER.slice();
  var WOODY = ['rect', 'tall', 'wide', 'arch', 'gothic', 'double', 'cathedral', 'vintage'];
  var FAMILY = { wood: 0, painted: 1, metal: 2, glass: 3, future: 4 };
  var SOUND = { wood: 0, metal: 1, tech: 2, glass: 3 };

  function wood(base, c2, o) {
    o = o || {};
    return { format: FORMAT, base: base, rough: o.rough != null ? o.rough : 0.55, metal: 0, wear: { mode: 'scuff', color: c2 }, layers: [
      { op: 'grain', color2: c2, scale: o.scale || 20, stretch: o.stretch || 30, contrast: o.contrast || 0.65, warp: o.warp != null ? o.warp : 0.55, knots: o.knots || 0 },
      { op: 'speckle', amount: o.speck != null ? o.speck : 0.05, scale: 260 }, { op: 'scratches', count: o.scratch != null ? o.scratch : 8, len: 0.08, color: o.sc || '#d8c4a0', amount: 0.18 }].concat(o.extra || []) };
  }
  function paintSkin(base, o) {
    o = o || {};
    return { format: FORMAT, base: base, rough: 0.42, metal: 0, wear: { mode: 'chip', color: o.under || '#a98a5e' }, layers: [
      { op: 'brush', dir: 'v', freq: 180, amount: 0.07 }, { op: 'speckle', amount: 0.07, scale: 300 },
      { op: 'blotch', color: '#000000', amount: 0.18, scale: 3, th: 0.5, soft: 0.3, h: 0, r: 0.1, bias: 0.7 }] };
  }
  var DARK_OAK = wood('#2e2014', '#120a05', { scale: 16, stretch: 36, contrast: 0.7, rough: 0.5, scratch: 4 });

  var SKINS = {
    'oak':          { name: 'Oak', family: 'wood', sound: 'wood', frame: 'wood', hardware: 'brass', wear: 15, styles: WOODY, recipe: wood('#a2703b', '#5c3517', { scale: 22, stretch: 30, contrast: 0.62, warp: 0.55, knots: 1 }) },
    'walnut':       { name: 'Walnut', family: 'wood', sound: 'wood', frame: 'wood', hardware: 'bronze', wear: 10, styles: WOODY, recipe: wood('#563826', '#22130a', { scale: 18, stretch: 40, contrast: 0.72, warp: 0.7, rough: 0.42 }) },
    'pine':         { name: 'Rustic pine', family: 'wood', sound: 'wood', frame: 'wood', hardware: 'black-iron', wear: 45, styles: WOODY, recipe: wood('#cfa466', '#8d5b28', { scale: 14, stretch: 20, contrast: 0.75, warp: 0.85, knots: 4, rough: 0.78, scratch: 14, extra: [{ op: 'planks', count: 3, seam: 0.75, vary: 0.1 }] }) },
    'ebony':        { name: 'Ebony lacquer', family: 'wood', sound: 'wood', frame: 'wood', hardware: 'brass', wear: 4, styles: WOODY.concat(['industrial']), recipe: wood('#1c1614', '#050303', { scale: 30, stretch: 50, contrast: 0.45, rough: 0.12, speck: 0.02, scratch: 3, sc: '#8a8a8a' }) },
    'white':        { name: 'Classic white', family: 'painted', sound: 'wood', frame: 'painted', hardware: 'brass', wear: 25, styles: ALL.filter(function (s) { return s !== 'scifi'; }), recipe: paintSkin('#e8e5db', { under: '#b49a72' }) },
    'racing-green': { name: 'Racing green', family: 'painted', sound: 'wood', frame: 'painted', hardware: 'brass', wear: 20, styles: ALL.filter(function (s) { return s !== 'scifi'; }), recipe: paintSkin('#1d5a3b', { under: '#7a6a4a' }) },
    'oxblood':      { name: 'Oxblood red', family: 'painted', sound: 'wood', frame: 'painted', hardware: 'brass', wear: 20, styles: ALL.filter(function (s) { return s !== 'scifi'; }), recipe: paintSkin('#6a1822', { under: '#8c6a50' }) },
    'navy':         { name: 'Navy', family: 'painted', sound: 'wood', frame: 'painted', hardware: 'chrome', wear: 20, styles: ALL.filter(function (s) { return s !== 'scifi'; }), recipe: paintSkin('#18294f', { under: '#7e7360' }) },
    'mustard':      { name: 'Mustard', family: 'painted', sound: 'wood', frame: 'painted', hardware: 'black-iron', wear: 30, styles: ALL.filter(function (s) { return s !== 'scifi'; }), recipe: paintSkin('#d2a02a', { under: '#8a6a3a' }) },
    'brushed-steel':{ name: 'Brushed steel', family: 'metal', sound: 'metal', frame: 'steel', hardware: 'chrome', wear: 15, styles: ALL, recipe: { format: FORMAT, base: '#aeb4bb', rough: 0.36, metal: 1, wear: { mode: 'scuff', color: '#d0d4d8' }, layers: [
      { op: 'brush', dir: 'v', freq: 760, amount: 0.8 }, { op: 'speckle', amount: 0.04, scale: 200 }, { op: 'scratches', count: 26, len: 0.14, color: '#e6e9ec', amount: 0.3 }] } },
    'brass':        { name: 'Brass and bronze', family: 'metal', sound: 'metal', frame: 'brass', hardware: 'bronze', wear: 25, styles: ALL, recipe: { format: FORMAT, base: '#d2a843', rough: 0.3, metal: 1, wear: { mode: 'scuff', color: '#f0d890' }, layers: [
      { op: 'brush', dir: 'h', freq: 560, amount: 0.5 }, { op: 'blotch', color: '#8a6420', amount: 0.28, scale: 8, th: 0.55, soft: 0.25, h: 0.1, r: 0.2, bias: 0.5 }, { op: 'scratches', count: 14, len: 0.1, color: '#f0d890', amount: 0.25 }] } },
    'verdigris':    { name: 'Verdigris copper', family: 'metal', sound: 'metal', frame: 'brass', hardware: 'bronze', wear: 35, styles: ALL, recipe: { format: FORMAT, base: '#b46c3e', rough: 0.4, metal: 0.9, wear: { mode: 'rust', color: '#4fa58c' }, layers: [
      { op: 'brush', dir: 'h', freq: 420, amount: 0.3 }, { op: 'blotch', color: '#4fa88e', amount: 0.75, scale: 9, th: 0.5, soft: 0.14, h: 0.6, r: 0.45, bias: 0.8 },
      { op: 'blotch', color: '#2d6f5f', amount: 0.5, scale: 16, th: 0.58, soft: 0.14, h: 0.5, r: 0.3, bias: 0.5 }, { op: 'speckle', amount: 0.08, scale: 240 }] } },
    'iron':         { name: 'Riveted iron', family: 'metal', sound: 'metal', frame: 'iron', hardware: 'black-iron', wear: 45, styles: ALL, recipe: { format: FORMAT, base: '#3d3e43', rough: 0.68, metal: 0.8, wear: { mode: 'rust', color: '#8a4a1c' }, layers: [
      { op: 'speckle', amount: 0.12, scale: 180 }, { op: 'plates', rows: 5, cols: 2, seam: 0.85, rivets: 1, vary: 0.1 },
      { op: 'blotch', color: '#8a4a1c', amount: 0.32, scale: 11, th: 0.58, soft: 0.14, h: 0.5, r: 0.35, bias: 0.6 }, { op: 'scratches', count: 12, len: 0.1, color: '#8a8a8e', amount: 0.25 }] } },
    'hazard':       { name: 'Hazard steel', family: 'metal', sound: 'metal', frame: 'steel', hardware: 'black-iron', wear: 50, styles: ['rect', 'tall', 'wide', 'circle', 'oval', 'hexagon', 'octagon', 'industrial'], recipe: { format: FORMAT, base: '#d8b020', rough: 0.55, metal: 0.55, wear: { mode: 'chip', color: '#7b7e84' }, layers: [
      { op: 'stripes', color: '#17171a', color2: '#e0b81c', width: 0.07, angle: 45 }, { op: 'speckle', amount: 0.1, scale: 200 },
      { op: 'blotch', color: '#2a2418', amount: 0.4, scale: 4, th: 0.5, soft: 0.25, h: 0, r: 0.2, bias: 0.8 }, { op: 'scratches', count: 24, len: 0.1, color: '#c8c8c8', amount: 0.3 }] } },
    'frosted':      { name: 'Frosted glass panes', family: 'glass', sound: 'glass', frame: 'wood', hardware: 'brass', wear: 8, styles: ['rect', 'tall', 'arch', 'gothic', 'double', 'cathedral', 'vintage', 'oval', 'scifi'],
      recipe: { format: FORMAT, base: '#3a2a1c', rough: 0.5, metal: 0, wear: { mode: 'scuff', color: '#6a4a2a' }, layers: [{ op: 'grain', color2: '#150c06', scale: 16, stretch: 36, contrast: 0.7, warp: 0.5, knots: 0 }, { op: 'speckle', amount: 0.05, scale: 240 }],
        pane: { format: FORMAT, base: '#cfe2e8', rough: 0.5, metal: 0, opacity: 0.66, layers: [{ op: 'frost', amount: 0.85, scale: 170, opacity: 0.66 }] } } },
    'stained':      { name: 'Stained glass', family: 'glass', sound: 'glass', frame: 'stone', hardware: 'black-iron', wear: 8, styles: ['arch', 'gothic', 'double', 'cathedral', 'vintage', 'circle', 'oval'],
      recipe: { format: FORMAT, base: '#2e2014', rough: 0.5, metal: 0, wear: { mode: 'scuff', color: '#5a3a1c' }, layers: [{ op: 'grain', color2: '#120a05', scale: 16, stretch: 36, contrast: 0.7, warp: 0.5, knots: 0 }, { op: 'speckle', amount: 0.05, scale: 240 }],
        pane: { format: FORMAT, base: '#808080', rough: 0.1, metal: 0, opacity: 0.8, layers: [{ op: 'cells', palette: ['#c0392b', '#2a6fb5', '#d4a017', '#2e8b57', '#7b3fa0', '#e0762a'], count: 26, lead: 0.011, leadColor: '#14141a', opacity: 0.82 }] } } },
    'stone-oak':    { name: 'Stone-framed oak', family: 'glass', sound: 'wood', frame: 'stone', hardware: 'black-iron', wear: 20, styles: ['rect', 'tall', 'arch', 'gothic', 'double', 'cathedral', 'vintage'], recipe: wood('#8a5a30', '#4a2a10', { scale: 20, stretch: 32, contrast: 0.66, warp: 0.6, knots: 2, rough: 0.6 }) },
    'composite':    { name: 'Matte composite', family: 'future', sound: 'tech', frame: 'steel', hardware: 'chrome', wear: 6, styles: ['rect', 'tall', 'wide', 'arch', 'double', 'circle', 'oval', 'hexagon', 'octagon', 'industrial', 'scifi'], recipe: { format: FORMAT, base: '#2b2f37', rough: 0.55, metal: 0.15, wear: { mode: 'scuff', color: '#5a6070' }, emissive: { color: '#3be6ff', intensity: 0.9 }, layers: [
      { op: 'speckle', amount: 0.12, scale: 320 }, { op: 'brush', dir: 'v', freq: 520, amount: 0.15 }, { op: 'scratches', count: 8, len: 0.08, color: '#9aa4b4', amount: 0.15 }] } },
    'neon':         { name: 'Neon Threshold', family: 'future', sound: 'tech', frame: 'none', hardware: 'chrome', wear: 0, styles: ALL, recipe: { format: FORMAT, base: '#0b0d14', rough: 0.9, metal: 0, wear: { mode: 'none', color: '#000000' }, emissive: { color: '#3be6ff', intensity: 1.4 }, layers: [{ op: 'speckle', amount: 0.03, scale: 200 }] } }
  };
  var SKIN_KEYS = Object.keys(SKINS);
  SKIN_KEYS.forEach(function (k) { SKINS[k].key = k; SKINS[k].mask = maskOf(SKINS[k].styles); SKINS[k].familyId = FAMILY[SKINS[k].family]; SKINS[k].soundId = SOUND[SKINS[k].sound]; });

  var FRAMES = {
    none: null,
    wood: wood('#5a3a20', '#24140a', { scale: 12, stretch: 30, contrast: 0.7, rough: 0.55 }),
    painted: paintSkin('#dedacc', { under: '#a08a66' }),
    stone: { format: FORMAT, base: '#8d8a82', rough: 0.85, metal: 0, wear: { mode: 'scuff', color: '#6c6a63' }, layers: [{ op: 'blocks', rows: 8, cols: 1, mortar: 0.5, vary: 0.14, color: '#8d8a82' }] },
    steel: { format: FORMAT, base: '#8d949c', rough: 0.4, metal: 1, wear: { mode: 'none', color: '#000000' }, layers: [{ op: 'brush', dir: 'v', freq: 600, amount: 0.6 }] },
    brass: { format: FORMAT, base: '#b88c34', rough: 0.32, metal: 1, wear: { mode: 'none', color: '#000000' }, layers: [{ op: 'brush', dir: 'v', freq: 480, amount: 0.4 }, { op: 'blotch', color: '#6a4a18', amount: 0.4, scale: 5, th: 0.55, soft: 0.2, h: 0, r: 0.2, bias: 0.3 }] },
    iron: { format: FORMAT, base: '#2e2f33', rough: 0.7, metal: 0.8, wear: { mode: 'none', color: '#000000' }, layers: [{ op: 'speckle', amount: 0.12, scale: 160 }, { op: 'blotch', color: '#6a3a18', amount: 0.35, scale: 6, th: 0.58, soft: 0.2, h: 0.3, r: 0.3, bias: 0.4 }] }
  };
  var HARDWARE = {
    brass: { color: '#c9a24a', rough: 0.28, metal: 1 }, chrome: { color: '#d8dde2', rough: 0.12, metal: 1 }, bronze: { color: '#8e5e30', rough: 0.34, metal: 1 },
    'black-iron': { color: '#1e1e22', rough: 0.55, metal: 0.85 }
  };

  // The finish a scene's door-skin params ask for, cleaned. skinTable: the keys the registry says are usable ({ key: true }); null = the built-ins.
  function normSkinParams(p, skinTable) {
    p = p && typeof p === 'object' ? p : {};
    var key = typeof p.skin === 'string' && /^[a-z0-9-]{2,24}$/.test(p.skin) ? p.skin : '';
    var known = skinTable ? !!skinTable[key] : Object.prototype.hasOwnProperty.call(SKINS, key);
    return {
      skin: known ? key : 'neon',
      frame: Object.prototype.hasOwnProperty.call(FRAMES, p.frame) ? p.frame : '',        // '' = the skin's own frame
      hardware: Object.prototype.hasOwnProperty.call(HARDWARE, p.hardware) ? p.hardware : '',
      tint: hex(p.tint, ''), wear: p.wear == null ? -1 : num(p.wear, 0, 100, 0)               // -1 = the skin's own wear
    };
  }
  // May this skin dress this door style? (mask: the registry's styles bit mask)
  function allowed(mask, style) { var i = STYLE_ORDER.indexOf(style); return i >= 0 && Math.floor(mask / Math.pow(2, i)) % 2 === 1; }

  var API = {
    FORMAT: FORMAT, MAX_SIDE: MAX_SIDE, MAX_LAYERS: MAX_LAYERS, MAX_RECIPE_BYTES: MAX_RECIPE_BYTES, OP_NAMES: OP_NAMES, SPEC: SPEC, STYLE_ORDER: STYLE_ORDER,
    SKINS: SKINS, SKIN_KEYS: SKIN_KEYS, FRAMES: FRAMES, HARDWARE: HARDWARE, FAMILY: FAMILY, SOUND: SOUND,
    validateRecipe: validateRecipe, relief: relief, render: render, normalFromHeight: normalFromHeight, normSkinParams: normSkinParams, allowed: allowed,
    maskOf: maskOf, stylesOf: stylesOf, hexToRgb: rgb, toHex: toHex, _noise: { ihash: ihash, vnoise: vnoise, fbm: fbm }
  };
  root.XADoorSkins = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
