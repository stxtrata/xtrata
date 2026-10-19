/*
 * Xtrata Arcade: doors (hall pack part)
 *
 * Your "Threshold" wireframe doors (wireframe-doors.html), rebuilt for the Three.js hall. What is carried over unchanged:
 * the 14 door styles (outline plus face decoration, written as data), the spring and damper mechanics of the handle, the
 * latch and the leaf (same constants), the locked-handle rattle, and the synthesised door sounds with their three
 * material profiles. What changes: the page's CSS 3D and SVG become a Three.js group (leaf slabs hinged on their outer
 * edge, canvas-texture faces, a framed doorway), and the sounds ride the hall's own audio bus as positional voices.
 *
 *   1. STYLES      pure data and drawing ops (no DOM): outline points, decoration, hinge and handle art
 *   2. MODEL       DoorModel: the physics (pure, runs in Node), with a sound interface it calls but does not own
 *   3. SFX         createSfx(getEnv, getListener): the door sounds as positional voices on the room audio bus
 *   4. MESH        buildMesh(): the Three.js door for one bay
 *
 * Only what bays.js asks for runs here; nothing in this file touches the network or evaluates chain data.
 */
(function (root) {
  'use strict';
  if (root.XADoors) return;

  var DEG = Math.PI / 180, HMAX = 22, MAXA = 108, DEF_OPEN = 105;
  var KH = 900, CH = 37, KD = 150, CD = 17.6, RAT_LEN = 0.8, RAT_STOP = 13;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var r2 = function (n) { return Math.round(n * 100) / 100; };
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  /* ================================================================ 1. STYLES */
  // Drawing ops are small strings, one per line: "kind<TAB>classes<TAB>args". kinds: P path (SVG path data), R rounded
  // rect (x y w h r), C circle (x y r), K begin clip rect, E end clip. classes: l stroke, f filled panel, k solid, d dimmed, t thick.
  var P = function (d, c) { return 'P\t' + (c || 'l') + '\t' + d + '\n'; };
  var LN = function (x1, y1, x2, y2, c) { return P('M' + r2(x1) + ' ' + r2(y1) + 'L' + r2(x2) + ' ' + r2(y2), c); };
  var RC = function (x, y, w, h, c, r) { return 'R\t' + (c || 'l') + '\t' + [r2(x), r2(y), r2(w), r2(h), r || 0].join(' ') + '\n'; };
  var CI = function (x, y, r, c) { return 'C\t' + (c || 'l') + '\t' + [r2(x), r2(y), r2(r)].join(' ') + '\n'; };
  var ptsPath = function (pts) { return 'M' + pts.map(function (p) { return r2(p[0]) + ' ' + r2(p[1]); }).join('L') + 'Z'; };
  var poly = function (pts, c) { return P(ptsPath(pts), c); };
  var CLIP = function (x, y, w, h) { return 'K\t\t' + [r2(x), r2(y), r2(w), r2(h)].join(' ') + '\n'; };
  var ENDCLIP = 'E\t\t\n';

  function polyEdge(pts) {           // x-extent of a convex polygon at height y
    return function (y) {
      var lo = Infinity, hi = -Infinity;
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= y && b[1] >= y) || (b[1] <= y && a[1] >= y)) {
          if (a[1] === b[1]) { lo = Math.min(lo, a[0], b[0]); hi = Math.max(hi, a[0], b[0]); }
          else { var x = a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]); lo = Math.min(lo, x); hi = Math.max(hi, x); }
        }
      }
      return lo === Infinity ? [0, 0] : [lo, hi];
    };
  }
  function mkShape(pts, extra) { var s = { pts: pts, d: ptsPath(pts), edge: polyEdge(pts) }; for (var k in extra) s[k] = extra[k]; return s; }
  function rectShape(W, H) { return mkShape([[0, 0], [W, 0], [W, H], [0, H]]); }
  function arc(cx, cy, rx, ry, a0, a1, n) { var o = []; for (var i = 0; i <= n; i++) { var t = a0 + (a1 - a0) * i / n; o.push([cx + rx * Math.cos(t), cy - ry * Math.sin(t)]); } return o; }
  function ellipseShape(W, H) { var o = [], rx = W / 2, ry = H / 2; for (var i = 0; i < 56; i++) { var t = i / 56 * 2 * Math.PI; o.push([rx + rx * Math.cos(t), ry + ry * Math.sin(t)]); } return mkShape(o); }
  function archShape(W, H) { var r = W / 2; return mkShape([[0, H], [0, r]].concat(arc(r, r, r, r, Math.PI, 0, 24).slice(1, -1), [[W, r], [W, H]])); }
  function gothicShape(W, H) {
    var a = Math.min(0.866 * W, H * 0.55), R = (W * W / 4 + a * a) / W, tEnd = Math.acos(clamp((W / 2 - R) / R, -1, 1));
    var left = arc(R, a, R, R, Math.PI, tEnd, 20);                       // from the left edge up to the apex
    var right = left.slice(0, -1).reverse().map(function (p) { return [W - p[0], p[1]]; });
    return mkShape([[0, H]].concat(left, right, [[W, H]]), { a: a, R: R });
  }
  function vintageShape(W, H) {
    var s = W * 0.12, o = [[0, H], [0, s]];
    for (var i = 1; i < 18; i++) { var t = i / 18, u = 1 - t; o.push([u * u * 0 + 2 * u * t * (W / 2) + t * t * W, u * u * s + 2 * u * t * (-s) + t * t * s]); }
    return mkShape(o.concat([[W, s], [W, H]]));
  }

  /* raised panel + a grid of them (the building block of most door faces) */
  function panel(x, y, w, h, o) {
    o = o || {}; var b = o.bev != null ? o.bev : 5, r = o.r != null ? o.r : 2;
    if (w < b * 3 || h < b * 3) return RC(x, y, w, h, 'l', r);
    return RC(x, y, w, h, 'l', r) + RC(x + b, y + b, w - 2 * b, h - 2 * b, 'l d', 1) +
      LN(x, y, x + b, y + b, 'l d') + LN(x + w, y, x + w - b, y + b, 'l d') + LN(x, y + h, x + b, y + h - b, 'l d') + LN(x + w, y + h, x + w - b, y + h - b, 'l d');
  }
  function grid(c, o) {
    var cols = o.cols || 1, rows = o.rows || [1], gap = o.gap != null ? o.gap : 10,
      top = o.top != null ? o.top : c.rail, bottom = o.bottom != null ? o.bottom : (c.H - c.rail),
      x0 = o.x0 != null ? o.x0 : (c.x0 + c.sW), x1 = o.x1 != null ? o.x1 : (c.x1 - c.sW);
    var cw = (x1 - x0 - gap * (cols - 1)) / cols, sum = rows.reduce(function (a, b) { return a + b; }, 0), avail = bottom - top - gap * (rows.length - 1), y = top, s = '';
    rows.forEach(function (r) { var h = avail * r / sum; for (var i = 0; i < cols; i++) s += panel(x0 + i * (cw + gap), y, cw, h, o); y += h + gap; });
    return s;
  }

  var STYLES = {};
  function registerStyle(name, def) {
    var o = { name: name, label: name, leaves: 1, handle: 'lever', handleY: 0.54, hingeYs: [0.18, 0.5, 0.82], w: 120, h: 220, strap: 0.18, strapTh: 7, sfx: 'wood' };
    for (var k in def) o[k] = def[k];
    STYLES[name] = o; return o;
  }

  registerStyle('rect', { label: 'Classic six-panel', w: 120, h: 220, shape: rectShape,
    decor: function (c) { return grid(c, { cols: 2, rows: [1, 1.45, 1.15] }); } });
  registerStyle('tall', { label: 'Tall and narrow', w: 82, h: 300, shape: rectShape,
    decor: function (c) {
      var s = grid(c, { cols: 1, rows: [0.7, 2.6] });
      var x = c.x0 + c.sW + 5, w = c.w - 2 * c.sW - 10, avail = c.H - 2 * c.rail - 10, h1 = avail * 0.7 / 3.3, y = c.rail + 5;
      for (var k = 1; k < 4; k++) s += LN(x, y + (h1 - 10) * k / 4, x + w, y + (h1 - 10) * k / 4, 'l d');
      return s;
    } });
  registerStyle('wide', { label: 'Short and wide (barn)', w: 250, h: 168, handle: 'bar', shape: rectShape,
    decor: function (c) {
      var m = 10, s = RC(c.x0 + m, m, c.w - 2 * m, c.H - 2 * m, 'l', 2);
      for (var x = c.x0 + m + 24; x < c.x1 - m - 6; x += 24) s += LN(x, m, x, c.H - m, 'l d');
      return s + LN(c.x0 + m, c.H * 0.2, c.x1 - m, c.H * 0.2) + LN(c.x0 + m, c.H * 0.8, c.x1 - m, c.H * 0.8) + LN(c.x0 + m, c.H * 0.8, c.x1 - m, c.H * 0.2);
    } });
  registerStyle('arch', { label: 'Rounded arch', w: 130, h: 250, hingeYs: [0.38, 0.6, 0.82], shape: archShape,
    decor: function (c) {
      var cx = c.W / 2, r = c.W / 2, s = c.inset(8) + LN(6, r, c.W - 6, r);
      for (var i = 1; i < 7; i++) { var t = Math.PI * i / 7; s += LN(cx, r, cx - Math.cos(t) * (r - 8), r - Math.sin(t) * (r - 8), 'l d'); }
      return s + grid(c, { cols: 2, rows: [1, 1.15], top: r + 12 });
    } });
  registerStyle('gothic', { label: 'Gothic pointed arch', w: 120, h: 280, hingeYs: [0.45, 0.65, 0.85], shape: gothicShape,
    decor: function (c) {
      var a = c.shape.a, cx = c.W / 2, rr = Math.min(c.W * 0.12, a * 0.22);
      return c.inset(c.sW * 0.55) + grid(c, { cols: 2, rows: [1], top: a + 12 }) + CI(cx, a * 0.5, rr) + CI(cx, a * 0.5, rr * 0.45, 'l d') + LN(cx, a * 0.5 + rr, cx, a + 2, 'l d');
    } });
  registerStyle('double', { label: 'Double doors', w: 230, h: 236, leaves: 2, shape: rectShape,
    decor: function (c) {
      var s = grid(c, { cols: 1, rows: [1.25, 1] });
      var x = c.x0 + c.sW + 5, w = c.w - 2 * c.sW - 10, avail = c.H - 2 * c.rail - 10, h1 = avail * 1.25 / 2.25, y = c.rail + 5, hh = h1 - 10;
      s += LN(x + w / 2, y, x + w / 2, y + hh, 'l d');
      for (var k = 1; k < 4; k++) s += LN(x, y + hh * k / 4, x + w, y + hh * k / 4, 'l d');
      return s;
    } });
  registerStyle('cathedral', { label: 'Cathedral double', w: 240, h: 310, leaves: 2, hingeYs: [0.45, 0.65, 0.85], shape: gothicShape,
    decor: function (c) {
      var a = c.shape.a, cx = c.W / 2, rr = Math.min(c.W * 0.1, a * 0.2);
      return c.inset(c.sW * 0.5) + grid(c, { cols: 1, rows: [1], top: a + 12 }) + CI(cx, a * 0.55, rr) + CI(cx, a * 0.55, rr * 0.5, 'l d') + LN(cx, a * 0.55 + rr, cx, a + 2, 'l d');
    } });
  registerStyle('circle', { label: 'Round vault', sfx: 'metal', w: 190, h: 190, square: true, hOff: 36, handleY: 0.5, hingeYs: [0.3, 0.7], strap: 0.1,
    shape: function (W) { return ellipseShape(W, W); },
    decor: function (c) {
      var cx = c.W / 2, cy = c.H / 2, r = c.W / 2, s = CI(cx, cy, r - 12) + CI(cx, cy, r - 26, 'l d'), i, t;
      for (i = 0; i < 18; i++) { t = i / 18 * 2 * Math.PI; s += CI(cx + (r - 6) * Math.cos(t), cy + (r - 6) * Math.sin(t), 1.7, 'k'); }
      for (i = 0; i < 6; i++) { t = i / 6 * 2 * Math.PI + 0.26; s += LN(cx + r * 0.17 * Math.cos(t), cy + r * 0.17 * Math.sin(t), cx + (r - 26) * Math.cos(t), cy + (r - 26) * Math.sin(t), 'l d'); }
      return s + CI(cx, cy, r * 0.17, 'f') + CI(cx, cy, r * 0.07);
    } });
  registerStyle('oval', { label: 'Oval porthole', sfx: 'metal', w: 130, h: 210, hOff: 30, hingeYs: [0.3, 0.7], strap: 0.1, shape: ellipseShape,
    decor: function (c) {
      var cx = c.W / 2, s = c.inset(10) + c.inset(24, 'l d');
      return s + CI(cx, c.H * 0.3, c.W * 0.17, 'f') + CI(cx, c.H * 0.3, c.W * 0.1, 'l d') + LN(c.W * 0.2, c.H * 0.62, c.W * 0.8, c.H * 0.62, 'l d') + LN(c.W * 0.2, c.H * 0.7, c.W * 0.8, c.H * 0.7, 'l d');
    } });
  registerStyle('hexagon', { label: 'Hexagonal', sfx: 'metal', w: 170, h: 200, hOff: 32, hingeYs: [0.36, 0.64], strap: 0.1,
    shape: function (W, H) { return mkShape([[W / 2, 0], [W, H * 0.25], [W, H * 0.75], [W / 2, H], [0, H * 0.75], [0, H * 0.25]]); },
    decor: function (c) {
      var cx = c.W / 2, cy = c.H / 2, k = 0.74, inner = c.shape.pts.map(function (p) { return [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k]; });
      var s = poly(inner);
      c.shape.pts.forEach(function (p, i) { s += LN(p[0], p[1], inner[i][0], inner[i][1], 'l d'); });
      inner.forEach(function (p) { s += CI(p[0], p[1], 1.8, 'k'); });
      return s + CI(cx, cy, c.W * 0.11, 'f') + CI(cx, cy, c.W * 0.05);
    } });
  registerStyle('octagon', { label: 'Octagonal', sfx: 'metal', w: 170, h: 210, hOff: 30, hingeYs: [0.3, 0.7], strap: 0.1,
    shape: function (W, H) { var k = Math.min(W, H) * 0.26; return mkShape([[k, 0], [W - k, 0], [W, k], [W, H - k], [W - k, H], [k, H], [0, H - k], [0, k]]); },
    decor: function (c) {
      var cx = c.W / 2, cy = c.H / 2, sc = function (pts, k) { return pts.map(function (p) { return [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k]; }); };
      var i1 = sc(c.shape.pts, 0.72), i2 = sc(c.shape.pts, 0.42), s = poly(i1) + poly(i2, 'l d');
      c.shape.pts.forEach(function (p, i) { s += LN(p[0], p[1], i1[i][0], i1[i][1], 'l d'); });
      i1.forEach(function (p) { s += CI(p[0], p[1], 1.8, 'k'); });
      return s;
    } });
  registerStyle('industrial', { label: 'Heavy industrial', sfx: 'metal', w: 190, h: 232, handle: 'bar', strap: 0.4, strapTh: 11, hingeYs: [0.14, 0.5, 0.86],
    shape: function (W, H) { return mkShape([[18, 0], [W - 18, 0], [W, 18], [W, H], [0, H], [0, 18]]); },
    decor: function (c) {
      var m = 9, s = RC(c.x0 + m, m, c.w - 2 * m, c.H - 2 * m, 'l', 2), x, y;
      s += LN(c.x0 + m, c.H * 0.34, c.x1 - m, c.H * 0.34) + LN(c.x0 + m, c.H * 0.66, c.x1 - m, c.H * 0.66) + LN(c.x0 + m, c.H * 0.34, c.x1 - m, c.H * 0.66, 'l d') + LN(c.x1 - m, c.H * 0.34, c.x0 + m, c.H * 0.66, 'l d');
      for (x = c.x0 + m + 10; x < c.x1 - m - 4; x += 18) s += CI(x, m + 7, 1.6, 'k') + CI(x, c.H - m - 7, 1.6, 'k');
      for (y = m + 22; y < c.H - m - 10; y += 18) s += CI(c.x0 + m + 7, y, 1.6, 'k') + CI(c.x1 - m - 7, y, 1.6, 'k');
      var by = c.H - m - 36, bh = 20, bx = c.x0 + m + 14, bw = c.w - 2 * m - 28;
      s += CLIP(bx, by, bw, bh);
      for (x = bx - bh; x < bx + bw; x += 12) s += LN(x, by + bh, x + bh, by, 'l d');
      return s + ENDCLIP + RC(bx, by, bw, bh, 'l');
    } });
  registerStyle('vintage', { label: 'Vintage panelled', w: 140, h: 252, handle: 'knob', strap: 0.3, strapTh: 8, hingeYs: [0.16, 0.5, 0.84], shape: vintageShape,
    decor: function (c) {
      var cx = c.W / 2, s = grid(c, { cols: 2, rows: [1, 1.35, 1], top: c.rail + 8, bottom: c.H - c.rail - 6, bev: 7, r: 3 });
      s += RC(cx - 20, c.H * 0.4, 40, 10, 'f', 2) + LN(cx - 14, c.H * 0.4 + 5, cx + 14, c.H * 0.4 + 5, 'l d');
      return s + CI(cx, c.H * 0.17, 8) + CI(cx, c.H * 0.17 - 11, 3, 'f');
    } });
  registerStyle('scifi', { label: 'Sci-fi airlock', sfx: 'tech', w: 160, h: 262, handle: 'bar', hingeYs: [0.2, 0.5, 0.8],
    shape: function (W, H) { return mkShape([[26, 0], [W - 26, 0], [W, 26], [W, H - 14], [W - 14, H], [14, H], [0, H - 14], [0, 26]]); },
    decor: function (c) {
      var m = 9, s = c.inset(m), sx = c.x1 - m - 11, i;
      for (i = 0; i < 8; i++) s += RC(sx, c.H * 0.18 + i * 13, 5, 8, i % 3 ? 'k d' : 'k', 1);
      for (i = 0; i < 4; i++) { var x = c.x0 + 36 + i * 14, y = c.H * 0.09; s += P('M' + x + ' ' + y + 'l7 6l-7 6'); }
      var sy = c.H * 0.3, scx = c.x0 + c.w * 0.42;
      s += CI(scx, sy, 15) + CI(scx, sy, 6, 'l d') + CI(scx, sy, 2, 'k') + LN(scx - 21, sy, scx - 11, sy) + LN(scx + 11, sy, scx + 21, sy) + LN(scx, sy - 21, scx, sy - 11) + LN(scx, sy + 11, scx, sy + 21);
      s += P('M' + (c.x0 + m + 6) + ' ' + c.H * 0.82 + 'H' + (c.x0 + c.w * 0.42) + 'l12 -12H' + (c.x1 - m - 26), 'l d') + CI(c.x1 - m - 26, c.H * 0.82 - 12, 2.2, 'k');
      return s + P('M' + (c.x0 + m + 4) + ' ' + (m + 16) + 'v-12h12') + P('M' + (c.x1 - m - 4) + ' ' + (c.H - m - 16) + 'v12h-12');
    } });

  var STYLE_NAMES = Object.keys(STYLES);

  // Hinge straps drawn on a leaf face
  function hingeArt(c, S, L) {
    var len = Math.max(14, S.strap * L.w), th = S.strapTh, s = '';
    S.hingeYs.forEach(function (f) {
      var y = f * c.H, e = c.edge(y);
      if (L.hinge === 'R') { var x = e[1]; s += RC(x - len, y - th / 2, len, th, 'f', 1.5) + CI(x - len * 0.7, y, 1.2, 'k') + CI(x - len * 0.3, y, 1.2, 'k'); }
      else { var x2 = e[0]; s += RC(x2, y - th / 2, len, th, 'f', 1.5) + CI(x2 + len * 0.3, y, 1.2, 'k') + CI(x2 + len * 0.7, y, 1.2, 'k'); }
    });
    return s;
  }
  // The handle lever, centred on its axis (0,0), pointing along +x
  function leverArt(type, Lh) {
    if (type === 'knob') return CI(0, 0, 11, 'f') + P('M8 -2.8H' + (Lh - 4) + 'A2.8 2.8 0 0 1 ' + (Lh - 4) + ' 2.8H8Z', 'f') + CI(0, 0, 5.5, 'l d') + LN(0, 0, 9, 0, 'l d');
    if (type === 'bar') return RC(-6, -6.5, Lh * 1.25 + 6, 13, 'f', 6.5) + CI(Lh * 1.25 - 3, 0, 2.4, 'k') + LN(2, 0, Lh * 1.25 - 10, 0, 'l d') + CI(0, 0, 3.5, 'l');
    return P('M0 -5.5H' + (Lh - 2) + 'A5.5 5.5 0 0 1 ' + (Lh - 2) + ' 5.5H0A5.5 5.5 0 0 1 0 -5.5Z', 'f') + LN(6, 0, Lh - 8, 0, 'l d') + CI(0, 0, 4, 'l');
  }

  // The layout numbers every part of one door shares (design units, y down, as in the draft).
  function layoutOf(styleName, w, h) {
    var S = STYLES[styleName], W = clamp(Math.round(w || S.w), 60, 320), H = S.square ? W : clamp(Math.round(h || S.h), 110, 360);
    var nL = S.leaves, leafW = W / nL, shape = S.shape(W, H), hy = H * S.handleY;
    var thick = clamp(Math.round(W * 0.06), 6, 14), fw = clamp(Math.round(W * 0.07), 8, 14);
    var leaves = [];
    for (var i = 0; i < nL; i++) {
      var x0 = i * leafW, x1 = x0 + leafW, hinge = nL === 1 ? 'R' : (i === 0 ? 'L' : 'R'), sW = Math.max(24, 0.2 * leafW), off = Math.max(S.hOff || 0, sW / 2, 22);
      var L = { i: i, x0: x0, x1: x1, w: leafW, hinge: hinge, hy: hy, dir: hinge === 'R' ? 1 : -1, inw: hinge === 'R' ? 1 : -1, Lh: clamp(0.22 * leafW, 22, 44), sW: sW };
      L.hx = hinge === 'R' ? x0 + off : x1 - off;
      L.latch = hinge === 'R' ? (nL === 1 ? shape.edge(hy)[0] : x0) : (nL === 2 ? x1 : shape.edge(hy)[1]);
      L.axis = hinge === 'R' ? (nL === 1 ? W : x1) : x0;       // the hinge line, where the leaf is pivoted
      leaves.push(L);
    }
    return { S: S, W: W, H: H, nL: nL, leafW: leafW, shape: shape, hy: hy, thick: thick, fw: fw, leaves: leaves };
  }
  // The decoration ops for one face of one leaf (what drawFace paints), with the draft's context object.
  function faceOps(G, L, side) {
    var S = G.S, shape = G.shape;
    var c = { W: G.W, H: G.H, x0: L.x0, x1: L.x1, w: G.leafW, sW: L.sW, rail: Math.max(14, G.H * 0.055), shape: shape, edge: shape.edge, key: 'f' + L.i + side, leaf: L.i,
      inset: function (inn, cls) { var k = [(G.W - 2 * inn) / G.W, (G.H - 2 * inn) / G.H]; return poly(shape.pts.map(function (p) { return [inn + p[0] * k[0], inn + p[1] * k[1]]; }), cls || 'l'); } };
    var s = poly(shape.pts, 'f') + S.decor(c) + hingeArt(c, S, L) + CI(L.hx, G.hy, 9, 'f') + CI(L.hx, G.hy, 3, 'l d');
    if (G.nL > 1) s += LN(L.hinge === 'L' ? L.x1 : L.x0, 0, L.hinge === 'L' ? L.x1 : L.x0, G.H);
    return s;
  }

  // Paint ops onto a 2D context already scaled to design units. st: { line, fill, lw }.
  function drawOps(ctx, ops, st) {
    var lines = ops.split('\n'), clipDepth = 0, i;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (i = 0; i < lines.length; i++) {
      var f = lines[i].split('\t'); if (f.length < 3 && f[0] !== 'E') continue;
      var t = f[0], cl = (f[1] || '').split(' '), arg = f[2] || '', dim = cl.indexOf('d') >= 0, thick = cl.indexOf('t') >= 0, kind = cl[0];
      if (t === 'K') { var n = arg.split(' ').map(Number); ctx.save(); ctx.beginPath(); ctx.rect(n[0], n[1], n[2], n[3]); ctx.clip(); clipDepth++; continue; }
      if (t === 'E') { if (clipDepth) { ctx.restore(); clipDepth--; } continue; }
      var p = new Path2D(), a = arg.split(' ').map(Number);
      if (t === 'P') p = new Path2D(arg);
      else if (t === 'C') p.arc(a[0], a[1], a[2], 0, Math.PI * 2);
      else if (t === 'R') {
        var x = a[0], y = a[1], w = a[2], h = a[3], r = Math.min(a[4] || 0, w / 2, h / 2);
        p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.arcTo(x + w, y, x + w, y + r, r); p.lineTo(x + w, y + h - r); p.arcTo(x + w, y + h, x + w - r, y + h, r);
        p.lineTo(x + r, y + h); p.arcTo(x, y + h, x, y + h - r, r); p.lineTo(x, y + r); p.arcTo(x, y, x + r, y, r); p.closePath();
      } else continue;
      ctx.save(); ctx.globalAlpha = dim ? 0.42 : 1; ctx.lineWidth = st.lw * (thick ? 2.4 : 1); ctx.strokeStyle = st.line;
      if (kind === 'k') { ctx.fillStyle = st.line; ctx.fill(p); }
      else { if (kind === 'f') { ctx.fillStyle = st.fill; ctx.fill(p); } ctx.stroke(p); }
      ctx.restore();
    }
    while (clipDepth-- > 0) ctx.restore();
  }

  /* ================================================================ 2. MODEL (pure physics) */
  var NULL_SFX = { handleDown: noop, latchRetract: noop, handleReturn: noop, latch: noop, rattle: noop, bolt: noop, slam: noop, stop: noop, seal: noop, knock: noop, creak: noop, kill: noop };
  function noop() {}

  function rattleProfile(t, amp) {
    var h;
    if (t < 0.07) h = RAT_STOP * ease(t / 0.07);
    else { var u0 = t - 0.07; h = RAT_STOP - 5.5 * amp * Math.exp(-u0 * 6) * Math.abs(Math.sin(u0 * 2 * Math.PI * 10.5)); }
    var u = Math.max(0, t - 0.07), dec = Math.exp(-u * 7) * amp;
    return { h: h, sx: dec * 0.9 * Math.sin(u * 2 * Math.PI * 21), sr: dec * 0.32 * Math.abs(Math.sin(u * 2 * Math.PI * 10.5 + 0.4)) };
  }

  // cfg: { style, locked, openAngle }. sfx: an object with the NULL_SFX methods (all optional).
  function DoorModel(cfg, sfx) {
    var name = STYLES[cfg && cfg.style] ? cfg.style : 'rect';
    this.cfg = { style: name, locked: !(cfg && cfg.locked === false), openAngle: clamp(cfg && cfg.openAngle != null ? cfg.openAngle : DEF_OPEN, 20, MAXA - 3) };
    this.style = STYLES[name];
    this.sfx = Object.assign({}, NULL_SFX, sfx || {});
    this.pos = { x: 0, y: 1.2, z: 0 };
    this.angle = 0; this.vel = 0; this.mode = 'free'; this.drive = null; this.pendingOpen = false;
    this.handle = { a: 0, v: 0, hold: false, holdT: 0 }; this.rattle = { active: false, t: 0, amp: 1 };
    this.shakeX = 0; this.shakeR = 0; this.awake = false; this.dragging = false;
  }
  var DM = DoorModel.prototype;
  DM.wake = function () { this.awake = true; };
  DM.isOpen = function () { return this.angle > 0.6 || this.pendingOpen || (this.mode === 'drive' && this.drive.to > 0); };
  DM.startDrive = function (to) {
    var from = this.angle, dist = Math.abs(to - from), opening = to > from;
    if (opening && from < 1) this.sfx.seal(this);
    this.mode = 'drive'; this.drive = { from: from, to: to, t: 0, dur: opening ? 0.55 + 0.75 * dist / 105 : 0.5 + 0.7 * dist / 105 }; this.wake();
  };
  DM.startRattle = function (amp) {
    amp = amp == null ? 1 : amp; var r = this.rattle;
    r.amp = amp; r.t = (r.active && this.handle.a > 6) ? 0.07 : 0; r.active = true;
    this.handle.hold = false; this.pendingOpen = false; this.sfx.rattle(this, amp); this.wake();
  };
  DM.latchHit = function (imp) { this.handle.v += clamp(imp * 0.9, 25, 130); };
  DM.step = function (h) {
    var H = this.handle, R = this.rattle, sfx = this.sfx;
    if (R.active) {
      R.t += h;
      if (R.t >= RAT_LEN) { R.active = false; this.shakeX = this.shakeR = 0; H.v = 0; }
      else { var p = rattleProfile(R.t, R.amp); H.a = p.h; H.v = 0; this.shakeX = p.sx; this.shakeR = p.sr; }
    }
    if (!R.active && this.shakeX) { this.shakeX *= Math.exp(-18 * h); if (Math.abs(this.shakeX) < 0.01) this.shakeX = 0; }   // a knock's tremble dies away
    if (!R.active) {
      if (H.hold && !this.dragging && !this.pendingOpen) { H.holdT += h; if (this.angle > 2.5 || H.holdT > 0.35) H.hold = false; }
      H.v += (KH * ((H.hold ? HMAX : 0) - H.a) - CH * H.v) * h; H.a += H.v * h;
      if (H.a < -1.5) { H.a = -1.5; H.v = Math.abs(H.v) * 0.25; } else if (H.a > HMAX + 3) { H.a = HMAX + 3; H.v = -Math.abs(H.v) * 0.25; }
    }
    if (H.hold && !H.h1) { H.h1 = true; sfx.handleDown(this); } else if (!H.hold) H.h1 = false;
    if (H.a >= HMAX * 0.8 && !H.lt) { H.lt = true; sfx.latchRetract(this); } else if (H.a < HMAX * 0.5) H.lt = false;
    if (H.a > 8) H.out = Math.max(H.out || 0, H.a);
    else if (H.a < 2 && H.out) { sfx.handleReturn(this, clamp(H.out / HMAX, 0.3, 1)); H.out = 0; }
    // the leaf only starts to move once the handle has pulled the latch clear
    if (this.pendingOpen && H.a >= HMAX * 0.8 && !R.active) { this.pendingOpen = false; this.startDrive(this.cfg.openAngle); }
    if (this.mode === 'drive') {
      var D = this.drive; D.t += h; var u = Math.min(1, D.t / D.dur), ref = D.from + (D.to - D.from) * ease(u);
      this.vel += (KD * (ref - this.angle) - CD * this.vel) * h; this.angle += this.vel * h;
      if (u >= 1 && D.to > 0 && Math.abs(this.angle - D.to) < 0.25 && Math.abs(this.vel) < 2) { this.angle = D.to; this.vel = 0; this.mode = 'free'; }
    } else {
      var a = this.angle, acc = 0;
      if (this.cfg.locked && a < 3) acc = -420 * a - 26 * this.vel; else if (a < 3) acc = -20 * a;
      this.vel += acc * h; this.vel *= Math.exp(-1.9 * h);
      if (Math.abs(this.vel) < 3 && a > 3) this.vel *= Math.exp(-10 * h);   // hinge friction: the door stays where it is left
      this.angle += this.vel * h;
    }
    if (this.angle < 0) {            // closed against the stop: a small bounce and the latch clicks
      var imp = -this.vel; this.angle = 0;
      if (imp > 10) { this.vel = imp * 0.16; this.latchHit(imp); sfx.slam(this, imp); }
      else { this.vel = 0; if (imp > 2) sfx.latch(this, 0.55); }
      if (this.mode === 'drive' && this.drive.to <= 0) this.mode = 'free';
    }
    if (this.angle > MAXA) { var v = this.vel; this.angle = MAXA; this.vel = v > 0 ? -v * 0.22 : v; if (v > 25) sfx.stop(this, clamp(v / 220, 0.15, 0.8)); }
  };
  DM.update = function (dt) {
    dt = Math.min(0.05, Math.max(0, dt));
    var n = Math.max(1, Math.ceil(dt / (1 / 240))), h = dt / n;
    for (var i = 0; i < n; i++) this.step(h);
    this.sfx.creak(this, Math.abs(this.vel));
  };
  DM.settled = function () {
    var H = this.handle;
    return this.mode === 'free' && !this.pendingOpen && !this.rattle.active && !H.hold && !this.shakeX && Math.abs(this.vel) < 0.02 && Math.abs(H.v) < 0.05 && Math.abs(H.a) < 0.02 && (!this.cfg.locked || this.angle < 0.001);
  };
  // visitor operations
  DM.open = function (force) {
    if (this.cfg.locked && !force) { this.startRattle(1); return false; }
    if (this.angle >= this.cfg.openAngle - 1 || (this.mode === 'drive' && this.drive.to > 0)) return true;
    if (this.angle < 1) { this.handle.hold = true; this.handle.holdT = 0; this.pendingOpen = true; this.wake(); }
    else this.startDrive(this.cfg.openAngle);
    return true;
  };
  DM.close = function () {
    this.pendingOpen = false; this.handle.hold = false;
    if (this.angle < 0.3 && this.mode !== 'drive') { this.mode = 'free'; this.wake(); return true; }
    this.startDrive(-12); return true;
  };
  DM.toggle = function () { return this.isOpen() ? this.close() : this.open(); };
  DM.lock = function (quiet) { if (!this.cfg.locked && !quiet) this.sfx.bolt(this, true); this.cfg.locked = true; this.pendingOpen = false; this.handle.hold = false; this.wake(); };
  DM.unlock = function (quiet) { if (this.cfg.locked && !quiet) this.sfx.bolt(this, false); this.cfg.locked = false; this.wake(); };
  DM.knock = function () { this.sfx.knock(this); this.shakeX = 0.5; this.wake(); };
  DM.state = function () { return { style: this.cfg.style, locked: this.cfg.locked, angle: this.angle, open: this.isOpen(), mode: this.mode, handle: this.handle.a, rattling: this.rattle.active, awake: this.awake }; };

  /* ================================================================ 3. SFX (synthesised, positional on the room audio bus) */
  var PROF = { wood: { kind: 'wood', pitch: 1, ring: 0.3, thud: 78 }, metal: { kind: 'metal', pitch: 0.78, ring: 1, thud: 56 }, tech: { kind: 'tech', pitch: 1.25, ring: 0.1, thud: 84 } };
  var REACH = 10;
  // getEnv(): { ctx, master, wet } or null. getListener(): { x, z }.
  function createSfx(getEnv, getListener) {
    var noiseBuf = null, noiseCtx = null, winT = 0, winN = 0, log = [];
    function noise(ctx) {
      if (noiseBuf && noiseCtx === ctx) return noiseBuf;
      var n = ctx.sampleRate * 2, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      noiseCtx = ctx; return (noiseBuf = b);
    }
    function mkPan(ctx, pos) {
      var pan = ctx.createPanner(); pan.panningModel = 'HRTF'; pan.distanceModel = 'inverse'; pan.refDistance = 1.4; pan.rolloffFactor = 1.3; pan.maxDistance = 40;
      if (pan.positionX) { pan.positionX.value = pos.x; pan.positionY.value = pos.y; pan.positionZ.value = pos.z; } else pan.setPosition(pos.x, pos.y, pos.z);
      return pan;
    }
    function ready() { var e = getEnv(); return e && e.ctx && e.ctx.state === 'running' ? e : null; }
    function profOf(d) { return PROF[d.style.sfx || 'wood']; }
    function gate(d, v, name) {
      var e = ready(); if (!e) return null;
      var now = Date.now(); if (now - winT > 100) { winT = now; winN = 0; } if (++winN > 16) return null;
      var L = getListener() || { x: 0, z: 0 }; if (Math.hypot(d.pos.x - L.x, d.pos.z - L.z) > REACH) return null;
      var ctx = e.ctx, g = ctx.createGain(); g.gain.value = v;
      var pan = mkPan(ctx, d.pos), send = ctx.createGain(); send.gain.value = 0.2;
      g.connect(pan); pan.connect(e.master); g.connect(send); if (e.wet) send.connect(e.wet);
      setTimeout(function () { try { g.disconnect(); pan.disconnect(); send.disconnect(); } catch (er) {} }, 3500);
      log.push({ name: name, at: ctx.currentTime }); if (log.length > 60) log.shift();
      return { ctx: ctx, p: profOf(d), out: g, t: ctx.currentTime + 0.004 };
    }
    var env = function (g, t, peak, att, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); };
    function nz(G, dt, dur, type, f, q, peak, att) {
      var ctx = G.ctx, t = G.t + dt, s = ctx.createBufferSource(); s.buffer = noise(ctx);
      var fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      var g = ctx.createGain(); env(g, t, peak, att || 0.002, dur);
      s.connect(fl); fl.connect(g); g.connect(G.out); s.start(t, Math.random() * 1.4); s.stop(t + dur + 0.03);
    }
    function tn(G, dt, f0, f1, dur, type, peak, att) {
      var ctx = G.ctx, t = G.t + dt, o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t);
      if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      var g = ctx.createGain(); env(g, t, peak, att || 0.002, dur);
      o.connect(g); g.connect(G.out); o.start(t); o.stop(t + dur + 0.03);
    }
    var click = function (G, dt, v, pi) { nz(G, dt, 0.014, 'highpass', 3000 * pi, 0.7, 0.45 * v); tn(G, dt, 2400 * pi, 1500 * pi, 0.03, 'sine', 0.16 * v); };
    function knk(G, dt, v) {
      var k = G.p;
      tn(G, dt, 520 * k.pitch, 500 * k.pitch, 0.1 + 0.12 * k.ring, 'triangle', 0.2 * v);
      tn(G, dt, 1170 * k.pitch, 1150 * k.pitch, 0.06 + 0.1 * k.ring, 'sine', 0.1 * v * (0.5 + k.ring));
      nz(G, dt, 0.03, 'bandpass', 1500, 2, 0.3 * v); tn(G, dt, 150, 90, 0.06, 'sine', 0.25 * v);
    }
    var S = {
      handleDown: function (d) { var G = gate(d, 0.9, 'handleDown'); if (!G) return; var k = G.p;
        if (k.kind === 'tech') { tn(G, 0, 520, 780, 0.07, 'sine', 0.12); click(G, 0, 0.6, k.pitch); return; }
        nz(G, 0, 0.07, 'bandpass', 900 * k.pitch, 2.5, 0.14); click(G, 0.012, 0.8, k.pitch); tn(G, 0.012, 200 * k.pitch, 120 * k.pitch, 0.05, 'triangle', 0.12); },
      latchRetract: function (d) { var G = gate(d, 0.8, 'latchRetract'); if (!G) return; var k = G.p;
        click(G, 0, 1, k.pitch * 0.9); tn(G, 0, 700 * k.pitch, 320 * k.pitch, 0.06, 'triangle', 0.12); nz(G, 0.025, 0.04, 'bandpass', 2600, 3, 0.14);
        if (k.kind === 'tech') tn(G, 0.02, 1200, 1700, 0.05, 'sine', 0.08); },
      handleReturn: function (d, v) { var G = gate(d, 0.55 * (v || 1), 'handleReturn'); if (!G) return; var k = G.p;
        click(G, 0, 0.7, k.pitch * 0.9); tn(G, 0, 260 * k.pitch, 160 * k.pitch, 0.04, 'triangle', 0.1); },
      latch: function (d, v, delay) { var G = gate(d, v || 1, 'latch'); if (!G) return; var k = G.p; G.t += delay || 0;
        click(G, 0, 1, k.pitch); tn(G, 0, 950 * k.pitch, 480 * k.pitch, 0.05, 'triangle', 0.16);
        click(G, 0.05, 0.6, k.pitch * 0.7); nz(G, 0.05, 0.04, 'bandpass', 1800, 3, 0.1); },
      rattle: function (d, amp) { var G = gate(d, 0.9, 'rattle'); if (!G) return; var k = G.p;
        nz(G, 0, 0.07, 'bandpass', 900 * k.pitch, 2.5, 0.14); click(G, 0.01, 0.7, k.pitch);
        if (k.kind === 'tech') { tn(G, 0.07, 170, 170, 0.1, 'square', 0.07 * amp); tn(G, 0.2, 170, 170, 0.1, 'square', 0.06 * amp); }
        for (var i = 0; i < 14; i++) { var u = i / 21, v = amp * Math.exp(-6 * u); if (v < 0.07) break; knk(G, 0.07 + u, v * 0.75); }
        nz(G, 0.07, 0.45, 'bandpass', 650 * k.pitch, 1.2, 0.06 * amp, 0.01); },
      bolt: function (d, locking) { var G = gate(d, 0.9, locking ? 'lock' : 'unlock'); if (!G) return; var k = G.p;
        if (k.kind === 'tech') {
          if (locking) { tn(G, 0, 880, 880, 0.07, 'sine', 0.2); tn(G, 0.09, 620, 620, 0.1, 'sine', 0.2); } else { tn(G, 0, 620, 620, 0.07, 'sine', 0.2); tn(G, 0.09, 990, 990, 0.12, 'sine', 0.2); }
          nz(G, 0.2, 0.05, 'highpass', 2500, 0.7, 0.14); return;
        }
        if (locking) {
          nz(G, 0, 0.09, 'bandpass', 1400 * k.pitch, 2, 0.1); tn(G, 0.07, 160 * k.pitch, 62 * k.pitch, 0.16, 'sine', 0.55);
          nz(G, 0.07, 0.09, 'lowpass', 700, 0.7, 0.35); click(G, 0.07, 1, k.pitch); tn(G, 0.075, 1900 * k.pitch, 1880 * k.pitch, 0.1 + 0.25 * k.ring, 'sine', 0.05 * (0.4 + k.ring));
        } else {
          nz(G, 0, 0.08, 'bandpass', 1900 * k.pitch, 2, 0.09); tn(G, 0.06, 230 * k.pitch, 110 * k.pitch, 0.12, 'sine', 0.38);
          click(G, 0.06, 0.9, k.pitch * 1.15); nz(G, 0.06, 0.05, 'lowpass', 900, 0.7, 0.2); click(G, 0.12, 0.4, k.pitch * 1.3);
        } },
      thud: function (d, v) { var G = gate(d, v, 'thud'); if (!G) return; var k = G.p;
        tn(G, 0, k.thud * 1.25, k.thud * 0.5, 0.28, 'sine', 0.8); nz(G, 0, 0.2, 'lowpass', 240, 0.8, 0.5);
        if (k.kind === 'wood') nz(G, 0, 0.07, 'bandpass', 420, 1.2, 0.35);
        else if (k.kind === 'metal') { nz(G, 0, 0.05, 'bandpass', 2200, 2, 0.25); tn(G, 0, 330, 320, 0.5, 'sine', 0.12); tn(G, 0, 740, 730, 0.35, 'triangle', 0.06); }
        else nz(G, 0, 0.28, 'bandpass', 3800, 0.9, 0.18, 0.01); },
      slam: function (d, imp) { var v = clamp(imp / 150, 0.12, 1); S.thud(d, v); S.latch(d, 0.5 + 0.5 * v, 0.025); },
      stop: function (d, v) { S.thud(d, v * 0.6); },
      seal: function (d) { var G = gate(d, 0.9, 'seal'); if (!G) return;
        if (G.p.kind === 'tech') { nz(G, 0, 0.4, 'highpass', 3500, 0.6, 0.35, 0.03); return; }
        nz(G, 0, 0.14, 'lowpass', 420, 0.7, 0.9, 0.01); nz(G, 0.01, 0.08, 'bandpass', 900, 1, 0.15, 0.01); },
      // knuckles on the door: three raps (new here; the draft had no knocking)
      knock: function (d) { var G = gate(d, 1, 'knock'); if (!G) return; var k = G.p, t = 0;
        for (var i = 0; i < 3; i++) {
          var f = k.thud * (1.6 + Math.random() * 0.3); tn(G, t, f, f * 0.5, 0.09, 'sine', 0.55 - i * 0.06); nz(G, t, 0.04, 'bandpass', k.kind === 'metal' ? 2200 : 900, 1.4, 0.35 - i * 0.05);
          if (k.kind === 'metal') tn(G, t, 640, 630, 0.25, 'sine', 0.08);
          t += 0.17 + Math.random() * 0.07;
        } }
    };
    // the continuous hinge creak, one voice per moving door, driven by the leaf speed (deg/s)
    function makeVoice(d, e) {
      var ctx = e.ctx, p = profOf(d), out = ctx.createGain(); out.gain.value = 0;
      var pan = mkPan(ctx, d.pos); out.connect(pan); pan.connect(e.master);
      var V = { p: p, out: out, pan: pan, srcs: [], jit: 0, base: 1 };
      var mkNoise = function () { var s = ctx.createBufferSource(); s.buffer = noise(ctx); s.loop = true; s.start(0, Math.random() * 1.4); V.srcs.push(s); return s; };
      var rn = mkNoise(), rf = ctx.createBiquadFilter(); rf.type = 'lowpass'; rf.frequency.value = p.kind === 'metal' ? 140 : 200;
      V.rg = ctx.createGain(); V.rg.gain.value = 0; rn.connect(rf); rf.connect(V.rg); V.rg.connect(out);
      if (p.kind === 'tech') {
        var o = ctx.createOscillator(); o.type = 'sine'; V.o1 = o; V.cg = ctx.createGain(); V.cg.gain.value = 0; o.connect(V.cg); V.cg.connect(out); o.start(); V.srcs.push(o);
        var hn = mkNoise(), hf = ctx.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 3200; V.hg = ctx.createGain(); V.hg.gain.value = 0; hn.connect(hf); hf.connect(V.hg); V.hg.connect(out);
      } else {
        var o1 = ctx.createOscillator(), o2 = ctx.createOscillator(); o1.type = 'sawtooth'; o2.type = 'square'; V.o1 = o1; V.o2 = o2;
        V.f = ctx.createBiquadFilter(); V.f.type = 'bandpass'; V.f.Q.value = p.kind === 'metal' ? 12 : 8; V.f.frequency.value = 900;
        V.cg = ctx.createGain(); V.cg.gain.value = 0; o1.connect(V.f); o2.connect(V.f); V.f.connect(V.cg); V.cg.connect(out);
        var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 6.5; lg.gain.value = 14; lfo.connect(lg); lg.connect(o1.detune); lg.connect(o2.detune);
        o1.start(); o2.start(); lfo.start(); V.srcs.push(o1, o2, lfo);
      }
      return V;
    }
    function endVoice(d) {
      var V = d._snd, e = getEnv(); if (!V) return; d._snd = null;
      try { var t = e && e.ctx ? e.ctx.currentTime : 0; V.out.gain.cancelScheduledValues(t); V.out.gain.setTargetAtTime(0, t, 0.04); V.srcs.forEach(function (s) { try { s.stop(t + 0.3); } catch (er) {} });
        setTimeout(function () { try { V.out.disconnect(); V.pan.disconnect(); } catch (er) {} }, 600); } catch (er) {}
    }
    function creak(d, sp) {
      var e = ready(), V = d._snd;
      if (!e) { if (V) endVoice(d); return; }
      var L = getListener() || { x: 0, z: 0 };
      if (Math.hypot(d.pos.x - L.x, d.pos.z - L.z) > REACH) { if (V) endVoice(d); return; }
      if (!V) { if (sp < 10) return; V = d._snd = makeVoice(d, e); } else if (sp < 3) { endVoice(d); return; }
      var t = e.ctx.currentTime, k = V.p, a = clamp((sp - 4) / 90, 0, 1);
      V.rg.gain.setTargetAtTime(a * 0.3 * (k.kind === 'metal' ? 1.3 : 1), t, 0.06); V.out.gain.setTargetAtTime(1, t, 0.05);
      if (k.kind === 'tech') { V.o1.frequency.setTargetAtTime((260 + sp * 5) * k.pitch * 0.8, t, 0.05); V.cg.gain.setTargetAtTime(a * 0.035, t, 0.05); V.hg.gain.setTargetAtTime(a * 0.06, t, 0.08); }
      else {
        var now = Date.now(); if (now > V.jit) { V.jit = now + 90 + Math.random() * 130; V.base = 1 + (Math.random() - 0.5) * 0.35; }
        var f = (120 + sp * 1.4) * k.pitch * V.base;
        V.o1.frequency.setTargetAtTime(f, t, 0.03); V.o2.frequency.setTargetAtTime(f * 1.52, t, 0.03); V.f.frequency.setTargetAtTime(Math.min(2600, f * 4.5), t, 0.04); V.cg.gain.setTargetAtTime(a * a * 0.09, t, 0.04);
      }
    }
    var api = { creak: creak, kill: endVoice, _log: function () { return log.slice(); }, _syn: S };
    Object.keys(S).forEach(function (k) { api[k] = S[k]; });
    return api;
  }

  /* ================================================================ 4. MESH (needs THREE and a canvas) */
  var LINE_COLOR = { wood: '#62dcff', metal: '#ffb04a', tech: '#5dffa6' };
  var FILL = 'rgba(7,11,17,0.975)', FRAME = '#0f1722';

  // opts: { THREE, mkCanvas(w,h), tex(canvas), model, maxW, maxH (metres), color }
  function buildMesh(o) {
    var T = o.THREE, m = o.model, G = layoutOf(m.cfg.style, o.w, o.h), S = G.S, W = G.W, H = G.H;
    var s = Math.min((o.maxH || 2.25) / H, (o.maxW || 2.4) / W, 0.0105);       // metres per design unit
    var line = o.color || LINE_COLOR[S.sfx] || LINE_COLOR.wood, lw = 1.5;
    var ppu = Math.min(4, 1024 / Math.max(G.leafW, H, 1));
    var group = new T.Group(), disposables = [], pick = [];
    var zWall = 0.012, zFrame = 0.02, zLeaf = 0.03, th = G.thick * s;
    function canvasTex(w, h, paint) {
      var cv = o.mkCanvas(Math.ceil(w * ppu), Math.ceil(h * ppu)), x = cv.getContext('2d'); x.scale(ppu, ppu); paint(x);
      var t = o.tex(cv); t.anisotropy = 4; disposables.push(t); return t;
    }
    function basicMat(map, extra) { var mt = new T.MeshBasicMaterial(Object.assign({ map: map, transparent: true, depthWrite: false }, extra || {})); disposables.push(mt); return mt; }
    function shapeOf(pts, ox) { var sh = new T.Shape(); pts.forEach(function (p, i) { var x = (p[0] - ox) * s, y = (H - p[1]) * s; if (i) sh.lineTo(x, y); else sh.moveTo(x, y); }); sh.closePath(); return sh; }

    /* doorway: dark recess with depth lines, framed by a band (one plane behind the leaves) */
    var pad = G.fw + 4, doorW = (W + 2 * pad) * s, doorH = (H + 2 * pad) * s;
    var wayTex = canvasTex(W + 2 * pad, H + 2 * pad, function (x) {
      x.translate(pad, pad);
      var shp = new Path2D(G.shape.d), outerD = 'M' + -pad + ' ' + -pad + 'H' + (W + pad) + 'V' + (H + pad) + 'H' + -pad + 'Z';
      x.save(); x.clip(shp);
      var gr = x.createRadialGradient(W / 2, H * 0.45, 4, W / 2, H * 0.5, Math.max(W, H) * 0.75); gr.addColorStop(0, '#1c3550'); gr.addColorStop(1, '#04070b'); x.fillStyle = gr; x.fillRect(-pad, -pad, W + 2 * pad, H + 2 * pad);
      x.strokeStyle = line; x.globalAlpha = 0.22; x.lineJoin = 'round';
      for (var k = 0.84; k > 0.3; k -= 0.18) { x.save(); x.translate(W / 2, H / 2); x.scale(k, k); x.translate(-W / 2, -H / 2); x.lineWidth = lw / k; x.stroke(shp); x.restore(); }
      x.restore();
      x.save(); x.clip(new Path2D(outerD + G.shape.d), 'evenodd');     // the band lives outside the opening only
      x.lineJoin = 'round'; x.strokeStyle = FRAME; x.lineWidth = 2 * G.fw; x.stroke(shp);
      x.strokeStyle = line; x.globalAlpha = 0.35; x.lineWidth = G.fw * 1.1; x.stroke(shp);
      x.restore();
      x.save(); x.shadowColor = line; x.shadowBlur = 5; x.strokeStyle = line; x.lineWidth = lw; x.stroke(shp); x.restore();
    });
    var way = new T.Mesh(new T.PlaneGeometry(doorW, doorH), basicMat(wayTex)); way.position.set(0, (H / 2) * s, zWall); way.renderOrder = 2; group.add(way);

    /* leaves */
    var leafObjs = G.leaves.map(function (L) {
      var pivot = new T.Group(); pivot.position.set((L.axis - W / 2) * s, 0, zLeaf);
      // the slab: the outline clipped to this leaf's strip, extruded for thickness
      var clipped = clipStrip(G.shape.pts, L.x0, L.x1), body = new T.Mesh(new T.ExtrudeGeometry(shapeOf(clipped, L.axis), { depth: th, bevelEnabled: false }),
        new T.MeshBasicMaterial({ color: 0x070b11 }));
      disposables.push(body.material, body.geometry); pivot.add(body); pick.push(body);
      var faceTex = [0, 1].map(function (sd) { return canvasTex(L.w, H, function (x) {
        x.translate(-L.x0, 0);
        if (G.nL > 1) { x.beginPath(); x.rect(L.hinge === 'R' ? L.x0 - 4 : L.x0 - 4, -6, L.w + 8, H + 12); x.clip(); }
        x.shadowColor = line; x.shadowBlur = 4; drawOps(x, faceOps(G, L, sd), { line: line, fill: FILL, lw: lw });
      }); });
      var cx = ((L.x0 + L.x1) / 2 - L.axis) * s, front = new T.Mesh(new T.PlaneGeometry(L.w * s, H * s), basicMat(faceTex[0])), back = new T.Mesh(new T.PlaneGeometry(L.w * s, H * s), basicMat(faceTex[1]));
      front.position.set(cx, H * s / 2, th + 0.0015); back.position.set(cx, H * s / 2, -0.0015); back.rotation.y = Math.PI;
      front.raycast = back.raycast = function () {}; front.renderOrder = back.renderOrder = 3; pivot.add(front, back);
      // the handle (a lever that turns with the physics), on both faces
      var bs = 2 * (L.Lh + 16), levTex = canvasTex(bs, bs, function (x) { x.translate(bs / 2, bs / 2); x.shadowColor = line; x.shadowBlur = 3; drawOps(x, leverArt(S.handle, L.Lh), { line: line, fill: FILL, lw: lw }); });
      var hands = [th + 0.004, -0.004].map(function (z, k) {
        var hg = new T.Group(); hg.position.set((L.hx - L.axis) * s * (k ? 1 : 1), (H - G.hy) * s, z); if (k) hg.rotation.y = Math.PI; hg.scale.x = L.dir;
        var lm = new T.Mesh(new T.PlaneGeometry(bs * s, bs * s), basicMat(levTex)); lm.raycast = function () {}; lm.renderOrder = 4; hg.add(lm); pivot.add(hg); return { g: hg, lever: lm };
      });
      var led = new T.Mesh(new T.CircleGeometry(2.4 * s, 12), new T.MeshBasicMaterial({ color: 0xff6a6a })); led.position.set((L.hx - L.axis) * s, (H - G.hy - 16) * s, th + 0.005); led.raycast = function () {}; pivot.add(led); disposables.push(led.material, led.geometry);
      var bolt = new T.Mesh(new T.BoxGeometry(14 * s, 9 * s, 0.012), new T.MeshBasicMaterial({ color: 0xc9d4de })); bolt.position.set((L.latch - L.axis) * s, (H - G.hy) * s, th * 0.5); bolt.raycast = function () {}; pivot.add(bolt); disposables.push(bolt.material, bolt.geometry);
      group.add(pivot);
      return { L: L, pivot: pivot, hands: hands, led: led, bolt: bolt, boltX: (L.latch - L.axis) * s };
    });

    function sync() {
      var a = m.angle, hA = m.handle.a, r = clamp(hA / (HMAX * 0.8), 0, 1);
      leafObjs.forEach(function (lo) {
        var L = lo.L; lo.pivot.rotation.y = (L.hinge === 'R' ? 1 : -1) * (a + m.shakeR) * DEG; lo.pivot.position.x = (L.axis - W / 2) * s + m.shakeX * s;
        lo.hands.forEach(function (h) { h.lever.rotation.z = -hA * DEG; });
        var rr = r; if (m.vel < -5 && a < 3) rr = Math.max(rr, (a > 1 ? (3 - a) / 2 : a) * 0.85);
        lo.bolt.position.x = lo.boltX + L.inw * 7 * rr * s; lo.led.material.color.setHex(m.cfg.locked ? 0xff6a6a : 0x5dffa6);
      });
    }
    function dispose() {
      if (group.parent) group.parent.remove(group);
      group.traverse(function (ob) { if (ob.geometry && disposables.indexOf(ob.geometry) < 0) ob.geometry.dispose(); });
      disposables.forEach(function (d) { if (d.dispose) d.dispose(); });
    }
    sync();
    return { group: group, way: way, sync: sync, dispose: dispose, pick: pick, scale: s, size: { w: W * s, h: H * s }, layout: G };
  }

  // Sutherland-Hodgman: the part of a convex polygon between two vertical lines
  function clipStrip(pts, x0, x1) {
    function clipHalf(poly, keep, inside) {
      var out = [];
      for (var i = 0; i < poly.length; i++) {
        var a = poly[i], b = poly[(i + 1) % poly.length], ia = inside(a), ib = inside(b);
        if (ia) out.push(a);
        if (ia !== ib) { var t = (keep - a[0]) / (b[0] - a[0]); out.push([keep, a[1] + t * (b[1] - a[1])]); }
      }
      return out;
    }
    var p = clipHalf(pts, x0, function (q) { return q[0] >= x0 - 1e-9; });
    return clipHalf(p, x1, function (q) { return q[0] <= x1 + 1e-9; });
  }

  root.XADoors = {
    STYLES: STYLES, STYLE_NAMES: STYLE_NAMES, DoorModel: DoorModel, createSfx: createSfx, buildMesh: buildMesh,
    layoutOf: layoutOf, faceOps: faceOps, leverArt: leverArt, drawOps: drawOps, clipStrip: clipStrip, rattleProfile: rattleProfile,
    CONST: { HMAX: HMAX, MAXA: MAXA, DEF_OPEN: DEF_OPEN, KH: KH, CH: CH, KD: KD, CD: CD }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.XADoors;
})(typeof window !== 'undefined' ? window : globalThis);
