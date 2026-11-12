/* ParallaX Casino · CUBE CHARACTERS  (docs/plans/CASINO-CHARACTER-PLAN.md)
 *
 * Xtrata's cube-headed characters, drawn for the casino: the humanoid cube and the floating cube from the "Xtrata Cube Comparison &
 * Material Lab" (edition 2.2). The lab's own runtime is about 1 MB, carries its own copy of three.js and gives every character six
 * 512 px canvases and about a hundred meshes, which is far too much for a room full of players on a phone. This file is a small
 * renderer written for the room instead, to the lab's measurements (cube 1.02, bezel 0.948, screen 0.9, the humanoid's torso, neck
 * and pelvis panels), its six default screens, its eight material presets and its six screen finishes:
 *
 *   - a humanoid is 11 draw calls and about 6,500 triangles, a floating cube 3 draw calls and under 500 (the human figure is a
 *     163-bone skinned mesh);
 *   - every character shares the same vertex data; only a small colour table and ONE screen texture belong to a character
 *     (all six screens are cells of it: 768 x 512, or 384 x 256 on phones and tablets);
 *   - movement is worked out from a few sines per frame, with no animation mixer and no bones.
 *
 * A look is one short code, the same one the room keeps and passes on (functions/lib/casino-look.ts, which has the same lists and
 * pattern; functions/lib/__tests__/casino-look.test.ts checks they agree):
 *
 *     <body><frame><finish><face><gait>-<accent>[-<frame colour>]     for example "h000n-4ed5bd"
 *
 * window.PXCubes:
 *   FRAMES, FINISHES, FACES, GAITS, BODIES, ACCENTS    the choices, for menus
 *   parseLook(code) -> look | null     encodeLook(look) -> code     fromLabLook(json) -> partial look | null
 *   kit(THREE, { lite, envMap }) -> { make(code, label) -> character, dispose() }
 *     character: group (add it to the scene; you place and turn it), update(dt, { speed, seated }, far), setLook(code), setLabel(text),
 *                wave(), setGhost(on), height(seated) in metres, body ('h' | 'f'), dispose()
 */
(function (global) {
  'use strict';

  var FRAMES = [
    { id: 'porcelain', label: 'Porcelain', color: '#e9e8e2', rough: 0.32, metal: 0.15 },
    { id: 'titanium', label: 'Brushed titanium', color: '#9eacb7', rough: 0.3, metal: 0.88 },
    { id: 'obsidian', label: 'Obsidian', color: '#17232e', rough: 0.15, metal: 0.48 },
    { id: 'copper', label: 'Copper', color: '#d38b54', rough: 0.34, metal: 0.84 },
    { id: 'carbon', label: 'Carbon', color: '#505c67', rough: 0.38, metal: 0.4 },
    { id: 'walnut', label: 'Walnut', color: '#a27346', rough: 0.58, metal: 0 },
    { id: 'mint', label: 'Mint', color: '#63d5b6', rough: 0.48, metal: 0.12 },
    { id: 'cobalt', label: 'Cobalt', color: '#386ce5', rough: 0.24, metal: 0.62 }
  ];
  var FINISHES = [
    { id: 'glass', label: 'Glass', glow: 0.52, rough: 0.12 },
    { id: 'satin', label: 'Satin', glow: 0.46, rough: 0.42 },
    { id: 'matte', label: 'Matte', glow: 0.4, rough: 0.88 },
    { id: 'frosted', label: 'Frosted', glow: 0.5, rough: 0.6 },
    { id: 'smoked', label: 'Smoked', glow: 0.36, rough: 0.18 },
    { id: 'crt', label: 'CRT', glow: 0.6, rough: 0.3 }
  ];
  var FACES = [
    { id: 'happy', label: 'Happy' }, { id: 'calm', label: 'Calm' }, { id: 'wink', label: 'Wink' },
    { id: 'wow', label: 'Wow' }, { id: 'cool', label: 'Cool' }, { id: 'focus', label: 'Focus' }
  ];
  var GAITS = [{ id: 'n', label: 'Natural' }, { id: 's', label: 'Swagger' }, { id: 't', label: 'Tipsy' }];
  var BODIES = [
    { id: 'p', label: 'Classic figure', note: 'The human figure, dressed in your own colours' },
    { id: 'h', label: 'Humanoid cube', note: 'Cube head on a robot body' },
    { id: 'f', label: 'Floating cube', note: 'Just the cube, hovering' }
  ];
  var ACCENTS = ['#4ed5bd', '#e3b84a', '#ff6b8b', '#7aa8ff', '#b48cff', '#ff9a4a', '#8fe36b', '#f4f1e8'];
  var PATTERN = /^[phf](?:[0-7][0-5][0-5][nst]-[0-9a-f]{6}|x[0-5][0-5][nst]-[0-9a-f]{6}-[0-9a-f]{6})$/;
  var MAX = 19;

  function hex6(value, fallback) {
    var s = String(value == null ? '' : value).trim().toLowerCase().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/.test(s)) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    return /^[0-9a-f]{6}$/.test(s) ? s : fallback;
  }
  function indexOfId(list, value) {
    if (typeof value === 'number' && value >= 0 && value < list.length && Math.floor(value) === value) return value;
    for (var i = 0; i < list.length; i++) if (list[i].id === value) return i;
    return 0;
  }
  /** A look code as an object: { body, frame, frameColor, finish, face, gait, accent }, or null when it is not a look. */
  function parseLook(code) {
    if (typeof code !== 'string' || code.length > MAX || !PATTERN.test(code)) return null;
    var parts = code.split('-'), h = parts[0], custom = h[1] === 'x';
    return {
      body: h[0], frame: custom ? 'x' : FRAMES[+h[1]].id, frameColor: '#' + (custom ? parts[2] : FRAMES[+h[1]].color.slice(1)),
      finish: FINISHES[+h[2]].id, face: FACES[+h[3]].id, gait: h[4], accent: '#' + parts[1]
    };
  }
  /** The code for a look. Anything missing or odd becomes the default, so the result is always a code the room accepts. */
  function encodeLook(look) {
    look = look || {};
    var body = look.body === 'h' || look.body === 'f' ? look.body : 'p';
    var custom = look.frame === 'x' && hex6(look.frameColor, null);
    var head = body + (custom ? 'x' : indexOfId(FRAMES, look.frame)) + indexOfId(FINISHES, look.finish) + indexOfId(FACES, look.face) +
      (look.gait === 's' || look.gait === 't' ? look.gait : 'n');
    return head + '-' + hex6(look.accent, '4ed5bd') + (custom ? '-' + custom : '');
  }
  /**
   * A look saved by the cube lab ("Material settings / JSON": { edge: { color }, screens: { front: { finish } } }, or the lab's saved
   * file with three of them): the frame colour (a preset when it is one) and the front screen's finish. JSON is data; nothing is run.
   */
  function fromLabLook(json) {
    var v = json;
    try { if (typeof v === 'string') v = JSON.parse(v); } catch (e) { return null; }
    if (!v || typeof v !== 'object') return null;
    if (v.looks && typeof v.looks === 'object') v = v.looks.humanoid || v.looks.hover || v.looks.classic || v.looks[Object.keys(v.looks)[0]];
    if (v && v.settings) v = v.settings;
    if (!v || typeof v !== 'object' || !v.edge) return null;
    var colour = hex6(v.edge.color, null), out = {};
    if (colour) {
      var preset = null;
      for (var i = 0; i < FRAMES.length; i++) if (FRAMES[i].color.slice(1) === colour) preset = FRAMES[i].id;
      out.frame = preset || 'x'; out.frameColor = '#' + colour;
    }
    var front = v.screens && v.screens.front;
    if (front && typeof front.finish === 'string') for (var j = 0; j < FINISHES.length; j++) if (FINISHES[j].id === front.finish) out.finish = front.finish;
    return out.frame || out.finish ? out : null;
  }

  // ------------------------------------------------------------------ drawing the six screens (one cell each, in the lab's style)

  var SCREEN_BG = { glass: ['#1c2c35', '#0d1a20'], satin: ['#22333b', '#13222a'], matte: ['#27363c', '#1b2a30'], frosted: ['#33474f', '#22343c'], smoked: ['#11191e', '#070d10'], crt: ['#10261f', '#06120e'] };
  function rr(g, x, y, w, h, r) {
    g.beginPath();
    if (g.roundRect) g.roundRect(x, y, w, h, r); else { g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  }
  /** One screen: `i` 0 front, 1 back, 2 left, 3 right, 4 top, 5 bottom; drawn in a 256-unit square at (ox, oy), scaled to `size`. */
  function drawScreen(g, i, ox, oy, size, look, label, blink) {
    var k = size / 256, accent = look.accent, bg = SCREEN_BG[look.finish] || SCREEN_BG.glass, ink = '#e9f7f3';
    g.save(); g.translate(ox, oy); g.scale(k, k);
    g.beginPath(); g.rect(0, 0, 256, 256); g.clip();
    var gr = g.createLinearGradient(0, 0, 256, 256); gr.addColorStop(0, bg[0]); gr.addColorStop(1, bg[1]); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    var small = size < 200;      // phones: the captions would be a smear, so the picture gets the room
    if (!small) {
      g.font = '700 8px Arial,sans-serif'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(233,247,243,.72)'; g.textAlign = 'left';
      g.fillText('X T R A T A', 21, 22); g.fillStyle = accent; g.textAlign = 'right'; g.fillText('0' + (i + 1), 235, 22);
      g.fillStyle = 'rgba(233,247,243,.12)'; g.fillRect(21, 40, 214, 1);
    }
    g.lineCap = 'round'; g.lineJoin = 'round';
    var name = String(label || '').slice(0, 22), cy = small ? 118 : 128;
    if (i === 0) {
      // the face
      var eye = function (x, open, kind) {
        if (kind === 'line' || open < 0.2) { g.strokeStyle = ink; g.lineWidth = 7; g.beginPath(); g.moveTo(x - 13, cy - 12); g.lineTo(x + 13, cy - 12); g.stroke(); return; }
        if (kind === 'arc') { g.strokeStyle = ink; g.lineWidth = 7; g.beginPath(); g.arc(x, cy - 6, 13, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); return; }
        var w = kind === 'round' ? 34 : 27, h = (kind === 'round' ? 34 : kind === 'narrow' ? 20 : 33);
        g.fillStyle = ink; rr(g, x - w / 2, cy - 14 - h / 2, w, h, kind === 'round' ? 17 : 11); g.fill();
        g.fillStyle = '#12303a'; rr(g, x - 5, cy - 14 - (kind === 'narrow' ? 6 : 9), 10, kind === 'narrow' ? 12 : 18, 5); g.fill();
        g.fillStyle = ink; g.beginPath(); g.arc(x - 2, cy - 19, 2, 0, 6.3); g.fill();
        if (kind === 'narrow') { g.strokeStyle = bg[1]; g.lineWidth = 9; g.beginPath(); g.moveTo(x - 20, cy - 30 + (x < 128 ? 0 : 7)); g.lineTo(x + 20, cy - 23 - (x < 128 ? 0 : 7)); g.stroke(); }
      };
      var f = look.face, open = blink ? 0 : 1;
      if (f === 'cool') {
        g.fillStyle = '#0a1418'; rr(g, 62, cy - 30, 132, 34, 10); g.fill(); g.strokeStyle = accent; g.lineWidth = 3; rr(g, 62, cy - 30, 132, 34, 10); g.stroke();
        g.fillStyle = 'rgba(233,247,243,.35)'; g.fillRect(74, cy - 24, 30, 4); g.fillRect(140, cy - 24, 30, 4);
      } else {
        eye(90, open, f === 'calm' ? 'line' : f === 'wow' ? 'round' : f === 'focus' ? 'narrow' : 'oval');
        eye(166, open, f === 'calm' ? 'line' : f === 'wink' ? 'arc' : f === 'wow' ? 'round' : f === 'focus' ? 'narrow' : 'oval');
      }
      g.strokeStyle = accent; g.lineWidth = 7;
      if (f === 'wow') { g.beginPath(); g.ellipse(128, cy + 36, 10, 13, 0, 0, 6.3); g.stroke(); }
      else if (f === 'focus') { g.beginPath(); g.moveTo(112, cy + 36); g.lineTo(144, cy + 36); g.stroke(); }
      else if (f === 'cool') { g.beginPath(); g.moveTo(108, cy + 34); g.quadraticCurveTo(132, cy + 44, 152, cy + 28); g.stroke(); }
      else { g.beginPath(); g.arc(128, cy + 18, f === 'calm' ? 16 : 22, Math.PI * 0.18, Math.PI * 0.82); g.stroke(); }
      if (f !== 'cool' && f !== 'focus') { g.strokeStyle = 'rgba(78,213,189,.45)'; g.lineWidth = 4; g.beginPath(); g.moveTo(64, cy + 20); g.lineTo(76, cy + 20); g.moveTo(180, cy + 20); g.lineTo(192, cy + 20); g.stroke(); }
      if (!small) { g.fillStyle = 'rgba(233,247,243,.72)'; g.font = '700 7px Arial,sans-serif'; g.textAlign = 'center'; g.fillText((name || 'happy to be here').toUpperCase(), 128, 222); }
    } else if (i === 1) {
      // the back: the player's name, and the lab's wave
      g.fillStyle = ink; g.textAlign = 'center';
      var title = name || 'CUBE', px = 34; g.font = '700 ' + px + 'px Arial,sans-serif';
      while (px > 13 && g.measureText(title).width > 206) { px -= 2; g.font = '700 ' + px + 'px Arial,sans-serif'; }
      g.fillText(title, 128, 88);
      if (!small) { g.font = '700 8px Arial,sans-serif'; g.fillStyle = 'rgba(233,247,243,.8)'; g.fillText('PARALLAX CASINO', 128, 118); }
      g.strokeStyle = accent; g.lineWidth = 5; g.beginPath();
      for (var x = 32; x <= 224; x += 4) { var u = (x - 32) / 192, a = Math.sin(u * Math.PI) * 20, y = 166 + Math.sin(u * 30) * a; if (x === 32) g.moveTo(x, y); else g.lineTo(x, y); }
      g.stroke();
    } else if (i === 2) {
      if (!small) { g.fillStyle = 'rgba(233,247,243,.72)'; g.font = '700 8px Arial,sans-serif'; g.textAlign = 'left'; g.fillText('ENERGY', 21, 62); }
      for (var b = 0; b < 5; b++) { g.fillStyle = b < 4 ? accent : 'rgba(233,247,243,.14)'; rr(g, 30 + b * 41, small ? 70 : 95, 29, small ? 110 : 66, 7); g.fill(); }
      if (!small) { g.fillStyle = 'rgba(233,247,243,.14)'; g.fillRect(30, 180, 196, 1); g.fillStyle = ink; g.font = '700 11px Arial,sans-serif'; g.textAlign = 'left'; g.fillText('READY TO PLAY', 30, 199); }
    } else if (i === 3) {
      var pts = [[54, 110], [104, 78], [172, 102], [192, 169], [114, 182], [74, 154]], links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4]];
      g.strokeStyle = 'rgba(233,247,243,.3)'; g.lineWidth = 2; g.beginPath();
      links.forEach(function (l) { g.moveTo(pts[l[0]][0], pts[l[0]][1]); g.lineTo(pts[l[1]][0], pts[l[1]][1]); }); g.stroke();
      pts.forEach(function (p, n) { g.fillStyle = n === 2 ? ink : accent; g.beginPath(); g.arc(p[0], p[1], n === 2 ? 8 : 6, 0, 6.3); g.fill(); });
    } else if (i === 4) {
      g.lineWidth = 9; g.strokeStyle = 'rgba(233,247,243,.16)'; g.beginPath(); g.arc(128, 132, 60, 0, 6.3); g.stroke();
      g.strokeStyle = accent; g.beginPath(); g.arc(128, 132, 60, -Math.PI / 2, Math.PI * 0.95); g.stroke();
      g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(128, 102); g.lineTo(128, 158); g.moveTo(113, 143); g.lineTo(128, 158); g.lineTo(143, 143); g.stroke();
    } else {
      for (var r = 0; r < 5; r++) for (var c = 0; c < 7; c++) {
        var n2 = (r * 7 + c) * 37 % 11, on = n2 < 3, s2 = 3 + (n2 % 3) * 1.5; g.fillStyle = on ? accent : 'rgba(233,247,243,.26)';
        rr(g, 51 + c * 25.5 - s2 / 2, 78 + r * 24.5 - s2 / 2, s2, s2, 1.5); g.fill();
      }
      if (!small) { g.fillStyle = 'rgba(233,247,243,.1)'; rr(g, 45, 203, 166, 22, 5); g.fill(); g.fillStyle = ink; g.font = '700 8px Arial,sans-serif'; g.textAlign = 'center'; g.fillText('XTRATA / CUBE', 128, 215); }
    }
    // the finish, over the picture
    if (look.finish === 'crt') { g.fillStyle = 'rgba(0,0,0,.2)'; for (var sy = 0; sy < 256; sy += 4) g.fillRect(0, sy, 256, 1.6); }
    else if (look.finish === 'frosted') { g.fillStyle = 'rgba(214,232,236,.2)'; g.fillRect(0, 0, 256, 256); }
    else if (look.finish === 'smoked') { g.fillStyle = 'rgba(0,0,0,.24)'; g.fillRect(0, 0, 256, 256); }
    else if (look.finish === 'glass') { var gl = g.createLinearGradient(0, 0, 200, 256); gl.addColorStop(0, 'rgba(255,255,255,.1)'); gl.addColorStop(0.42, 'rgba(255,255,255,0)'); g.fillStyle = gl; g.fillRect(0, 0, 256, 256); }
    g.restore();
  }
  /** All six screens on one canvas, three across and two down (front, back, left / right, top, bottom). */
  function drawSheet(canvas, look, label, blink, onlyFront) {
    var cell = canvas.width / 3, g = canvas.getContext('2d');
    for (var i = 0; i < (onlyFront ? 1 : 6); i++) drawScreen(g, i, (i % 3) * cell, Math.floor(i / 3) * cell, cell, look, label, blink);
  }

  // ------------------------------------------------------------------ the renderer

  // Colour slots of a part's vertices: the frame (the lab's porcelain), then the fixed trims, then the accent.
  var FRAME = 0, GRAPHITE = 1, METAL = 2, ACCENT = 3, INK = 4, SOLE = 5;
  var FIXED = [null, '#313d44', '#89969d', null, '#152027', '#405159'];
  // The lab's humanoid stands 2.94 units tall. In the room it is 1.65 m: a little shorter than the human figures, because its head is
  // half a metre across and a taller one fills a neighbour's view at a table (tried at 1.92 m: the next seat's head covered a third of the screen).
  var S = 0.56, TALL = 1.65;
  var HIP = 0.69;         // hip height above the floor (lab units), standing
  var SEAT_HIP = 1.15;    // seated: the pelvis rests on a 0.57 m stool (lab units; the legs are short, so the feet hang)
  var SEAT_TALL = 1.91;   // ... which puts the top of the head this high (metres)
  var HOVER_SCALE = 0.5, HOVER_Y = 1.22;      // the floating cube is 0.51 m across, with its centre 1.22 m up

  function kit(THREE, options) {
    options = options || {};
    var lite = !!options.lite, env = options.envMap || null, CELL = options.cell || (lite ? 128 : 256);
    var shared = {}, materials = {}, live = [], glowTex = null, tmpColor = new THREE.Color();

    function rbox(w, h, d, r, seg) {
      var n = seg * 2 + 1; r = Math.min(w / 2, h / 2, d / 2, r);
      var box = new THREE.BoxGeometry(1, 1, 1, n, n, n), g = box.toNonIndexed(); box.dispose();
      var P = g.attributes.position.array, N = g.attributes.normal.array, bx = w / 2 - r, by = h / 2 - r, bz = d / 2 - r, half = 0.5 / n;
      for (var i = 0; i < P.length; i += 3) {
        var x = P[i], y = P[i + 1], z = P[i + 2];
        var nx = x - Math.sign(x) * half, ny = y - Math.sign(y) * half, nz = z - Math.sign(z) * half, l = Math.hypot(nx, ny, nz) || 1;
        nx /= l; ny /= l; nz /= l;
        P[i] = bx * Math.sign(x) + nx * r; P[i + 1] = by * Math.sign(y) + ny * r; P[i + 2] = bz * Math.sign(z) + nz * r;
        N[i] = nx; N[i + 1] = ny; N[i + 2] = nz;
      }
      return g;
    }
    function ball(r) { var s = new THREE.SphereGeometry(r, 10, 7), g = s.toNonIndexed(); s.dispose(); return g; }
    function tube(top, bottom, height) { var c = new THREE.CylinderGeometry(top, bottom, height, 12, 1, false), g = c.toNonIndexed(); c.dispose(); return g; }
    function roundedSquare(size, radius, withUv) {
      var a = size / 2, r = radius, sh = new THREE.Shape();
      sh.moveTo(-a + r, -a); sh.lineTo(a - r, -a); sh.quadraticCurveTo(a, -a, a, -a + r); sh.lineTo(a, a - r); sh.quadraticCurveTo(a, a, a - r, a);
      sh.lineTo(-a + r, a); sh.quadraticCurveTo(-a, a, -a, a - r); sh.lineTo(-a, -a + r); sh.quadraticCurveTo(-a, -a, -a + r, -a);
      var s = new THREE.ShapeGeometry(sh, 3), g = s.toNonIndexed(); s.dispose();
      if (withUv) { var P = g.attributes.position, U = g.attributes.uv; for (var i = 0; i < P.count; i++) U.setXY(i, P.getX(i) / size + 0.5, P.getY(i) / size + 0.5); }
      return g;
    }
    var M = function (x, y, z, rx, ry, rz, s) {
      var m = new THREE.Matrix4();
      m.compose(new THREE.Vector3(x || 0, y || 0, z || 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0)), new THREE.Vector3(s || 1, s || 1, s || 1));
      return m;
    };
    /** Several pieces as one set of vertices, each piece in its colour slot. `uvOf(piece index)` keeps texture coordinates too. */
    function merge(pieces, keepUv) {
      var count = 0; pieces.forEach(function (p) { count += p[0].attributes.position.count; });
      var pos = new Float32Array(count * 3), nor = new Float32Array(count * 3), slots = new Uint8Array(count), uv = keepUv ? new Float32Array(count * 2) : null, o = 0;
      var v = new THREE.Vector3(), nm = new THREE.Matrix3();
      pieces.forEach(function (p) {
        var g = p[0], m = p[1] || new THREE.Matrix4(), P = g.attributes.position, N = g.attributes.normal; nm.getNormalMatrix(m);
        for (var i = 0; i < P.count; i++, o++) {
          v.fromBufferAttribute(P, i).applyMatrix4(m); pos[o * 3] = v.x; pos[o * 3 + 1] = v.y; pos[o * 3 + 2] = v.z;
          v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); nor[o * 3] = v.x; nor[o * 3 + 1] = v.y; nor[o * 3 + 2] = v.z;
          slots[o] = p[2] || 0;
          if (uv) { var t = p[3]; uv[o * 2] = t[0] + g.attributes.uv.getX(i) * t[2]; uv[o * 2 + 1] = t[1] + g.attributes.uv.getY(i) * t[3]; }
        }
        g.dispose();
      });
      var out = { position: new THREE.BufferAttribute(pos, 3), normal: new THREE.BufferAttribute(nor, 3), slots: slots, count: count, uv: uv ? new THREE.BufferAttribute(uv, 2) : null };
      var tmp = new THREE.BufferGeometry(); tmp.setAttribute('position', out.position); tmp.computeBoundingSphere(); out.sphere = tmp.boundingSphere;
      return out;
    }
    // where each screen sits on the cube (the lab's table): rotation, then the outward normal
    var FACE = [[0, 0, 0, 0, 0, 1], [0, Math.PI, 0, 0, 0, -1], [0, Math.PI / 2, 0, 1, 0, 0], [0, -Math.PI / 2, 0, -1, 0, 0], [-Math.PI / 2, 0, 0, 0, 1, 0], [Math.PI / 2, 0, 0, 0, -1, 0]];
    function cubePieces(at, scale) {
      var list = [[rbox(1.02, 1.02, 1.02, 0.072, lite ? 1 : 2), M(0, at, 0, 0, 0, 0, scale), FRAME]];
      FACE.forEach(function (f) { list.push([roundedSquare(0.948, 0.077), M(f[3] * 0.516 * scale, at + f[4] * 0.516 * scale, f[5] * 0.516 * scale, f[0], f[1], f[2], scale), INK]); });
      return list;
    }
    function screenPieces(at, scale) {
      var pad = 1.5 / CELL;
      return FACE.map(function (f, i) {
        var col = i % 3, row = Math.floor(i / 3);      // the canvas's top row is the texture's upper half
        return [roundedSquare(0.9, 0.058, true), M(f[3] * 0.522 * scale, at + f[4] * 0.522 * scale, f[5] * 0.522 * scale, f[0], f[1], f[2], scale), 0,
          [(col + pad) / 3, (1 - row + pad) / 2, (1 - 2 * pad) / 3, (1 - 2 * pad) / 2]];
      });
    }
    function build() {
      if (shared.trunk) return shared;
      // All heights below are from the hip (0.69 above the floor); the measurements are the lab humanoid's (edition 2.0).
      var chest = rbox(0.65, 0.83, 0.42, 0.08, 1), cp = chest.attributes.position;
      for (var i = 0; i < cp.count; i++) { var u = Math.max(0, Math.min(1, cp.getY(i) / 0.83 + 0.5)), e = u * u * (3 - 2 * u); cp.setX(i, cp.getX(i) * (0.75 + 0.34 * e)); cp.setZ(i, cp.getZ(i) * (0.88 + 0.16 * u)); }
      var trunk = [
        [rbox(0.58, 0.32, 0.43, 0.08, 1), M(0, 0.03, 0), FRAME], [rbox(0.53, 0.095, 0.46, 0.026, 1), M(0, 0.17, 0), GRAPHITE],
        [rbox(0.38, 0.17, 0.06, 0.03, 1), M(0, 0.033, 0.232), METAL], [rbox(0.13, 0.022, 0.018, 0.006, 1), M(0, 0.03, 0.267), ACCENT],
        [ball(0.112), M(0.295, -0.015, 0), METAL], [ball(0.112), M(-0.295, -0.015, 0), METAL],
        [chest, M(0, 0.53, 0), FRAME], [rbox(0.47, 0.29, 0.055, 0.027, 1), M(0, 0.675, 0.234), FRAME], [rbox(0.54, 0.105, 0.43, 0.04, 1), M(0, 0.959, 0), GRAPHITE],
        [rbox(0.43, 0.19, 0.31, 0.052, 1), M(0, 0.158, 0), GRAPHITE], [ball(0.178), M(0, 0.13, 0), METAL],
        [rbox(0.17, 0.27, 0.35, 0.055, 1), M(0.345, 0.75, -0.015), FRAME], [rbox(0.17, 0.27, 0.35, 0.055, 1), M(-0.345, 0.75, -0.015), FRAME],
        [rbox(0.12, 0.04, 0.016, 0.008, 1), M(0, 0.735, 0.274), ACCENT], [rbox(0.48, 0.025, 0.018, 0.008, 1), M(0, 0.501, 0.238), GRAPHITE],
        [rbox(0.42, 0.41, 0.04, 0.02, 1), M(0, 0.57, -0.24), METAL],
        [tube(0.145, 0.166, 0.105), M(0, 1.03, -0.035), GRAPHITE], [tube(0.172, 0.172, 0.03), M(0, 1.097, -0.035), METAL]
      ];
      if (!lite) trunk.push([ball(0.085), M(0.41, 0.65, 0), GRAPHITE], [ball(0.085), M(-0.41, 0.65, 0), GRAPHITE],
        [rbox(0.035, 0.48, 0.037, 0.01, 1), M(0.145, 0.52, -0.245), METAL], [rbox(0.035, 0.48, 0.037, 0.01, 1), M(-0.145, 0.52, -0.245), METAL]);
      shared.trunk = merge(trunk);
      // the head turns about the neck's gimbal: the gimbal, the rear spine and its yoke, and the cube (0.87 of full size) above them
      var head = [[ball(0.115), M(0, 0.014, -0.05), METAL], [rbox(0.105, 0.34, 0.084, 0.025, 1), M(0, 0.335, -0.265), GRAPHITE]];
      [1, -1].forEach(function (s) { head.push([rbox(0.063, 0.17, 0.065, 0.015, 1), M(s * 0.174, 0.495, -0.287), METAL]); });
      shared.head = merge(head.concat(cubePieces(0.65, 0.87)));
      shared.headScreens = merge(screenPieces(0.65, 0.87), true);
      shared.cube = merge(cubePieces(0, 1));
      shared.cubeScreens = merge(screenPieces(0, 1), true);
      // arms (left is +x): shoulder socket and cap, upper arm; then elbow, forearm, wrist and a mitten hand
      shared.upperArm = [1, -1].map(function (s) {
        return merge([[ball(0.097), null, GRAPHITE], [tube(0.059, 0.059, 0.014), M(s * 0.094, 0, 0, 0, 0, Math.PI / 2), ACCENT], [rbox(0.158, 0.228, 0.164, 0.058, 1), M(0, -0.128, 0), FRAME]]);
      });
      shared.foreArm = merge([[ball(0.074), null, GRAPHITE], [rbox(0.148, 0.207, 0.153, 0.056, 1), M(0, -0.1225, 0), FRAME], [ball(0.055), M(0, -0.245, 0), GRAPHITE],
        [rbox(0.115, 0.13, 0.07, 0.03, 1), M(0, -0.325, 0.005), FRAME], [rbox(0.1, 0.07, 0.055, 0.024, 1), M(0, -0.41, 0.012), GRAPHITE]]);
      // legs: hip joint and thigh; then knee, shin, ankle and foot
      shared.thigh = merge([[ball(0.1), null, GRAPHITE], [rbox(0.187, 0.24, 0.188, 0.065, 1), M(0, -0.15, 0), FRAME]]);
      shared.shin = merge([[ball(0.082), null, GRAPHITE], [rbox(0.173, 0.235, 0.176, 0.058, 1), M(0, -0.15, 0), FRAME], [ball(0.062), M(0, -0.3, 0), GRAPHITE],
        [rbox(0.27, 0.075, 0.39, 0.035, 1), M(0, -0.335, 0.06), FRAME], [rbox(0.265, 0.035, 0.385, 0.012, 1), M(0, -0.3725, 0.06), SOLE]]);
      return shared;
    }
    function bodyMaterial(frame) {
      var key = lite ? 'lite' : frame.rough + '|' + frame.metal;
      if (!materials[key]) {
        materials[key] = lite ? new THREE.MeshLambertMaterial({ vertexColors: true })
          : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: frame.rough, metalness: Math.min(0.8, frame.metal), envMap: env, envMapIntensity: env ? 1 : 0 });
        materials[key].name = 'Cube character body';
      }
      return materials[key];
    }
    // A character that is nearly in the camera is drawn as a ghost, so it never hides the table or fills the screen.
    var ghostMat = null;
    function ghostMaterial() {
      if (!ghostMat) {
        ghostMat = lite ? new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0.13, depthWrite: false })
          : new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.13, depthWrite: false, roughness: 0.5, metalness: 0.1 });
        ghostMat.name = 'Cube character body (ghost)';
      }
      return ghostMat;
    }
    function glow() {
      if (glowTex) return glowTex;
      var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 4, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,.0)'); gr.addColorStop(0.45, 'rgba(255,255,255,.55)'); gr.addColorStop(0.7, 'rgba(255,255,255,.16)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); glowTex = new THREE.CanvasTexture(c); return glowTex;
    }

    function make(code, label) {
      build();
      var look = parseLook(code) || parseLook('h000n-4ed5bd');
      if (look.body === 'p') look.body = 'h';
      var group = new THREE.Group(); group.name = 'Cube character';
      var sheet = document.createElement('canvas'); sheet.width = CELL * 3; sheet.height = CELL * 2;
      var tex = new THREE.CanvasTexture(sheet); tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
      // The screens are lit from inside: drawn exactly as painted, whatever the room's lights and tone mapping do (and no lighting to work out).
      var screenMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, fog: false });
      screenMat.name = 'Cube character screens';
      var me = { group: group, body: null, look: look, label: String(label || '') };
      var ghost = false, parts = [], geos = [], nodes = null, t = Math.random() * 20, phase = Math.random() * 6, walk = 0, blinkAt = 2 + Math.random() * 4, blinking = 0, waveLeft = 0, lastYaw = null, turn = 0, seed = Math.random() * 10, palette = [];

      function colours() {
        palette = FIXED.map(function (hex, i) { return new THREE.Color(i === FRAME ? look.frameColor : i === ACCENT ? look.accent : hex); });
        // the frame is drawn a little under full white, so porcelain keeps its shape under the room's many lights
        palette[FRAME].multiplyScalar(0.92);
        parts.forEach(function (p) {
          var c = p.geometry.attributes.color, sl = p.userData.slots;
          for (var i = 0; i < sl.length; i++) { var k = palette[sl[i]]; c.array[i * 3] = k.r; c.array[i * 3 + 1] = k.g; c.array[i * 3 + 2] = k.b; }
          c.needsUpdate = true;
        });
      }
      function mesh(src, parent, x, y, z, screens, shadow) {
        var g = new THREE.BufferGeometry(); g.setAttribute('position', src.position); g.setAttribute('normal', src.normal);
        if (screens) g.setAttribute('uv', src.uv); else g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(src.count * 3), 3));
        g.boundingSphere = src.sphere.clone(); geos.push(g);
        var m = new THREE.Mesh(g, screens ? screenMat : bodyMaterial(frameOf())); m.position.set(x || 0, y || 0, z || 0);
        if (!screens) { m.userData.slots = src.slots; parts.push(m); m.userData.shadow = !!shadow && !lite && !!options.shadows; m.castShadow = m.userData.shadow && !ghost; }      // only the big parts: every shadow light draws them again
        parent.add(m); return m;
      }
      function shine() { for (var i = 0; i < FINISHES.length; i++) if (FINISHES[i].id === look.finish) screenMat.color.setScalar(0.8 + FINISHES[i].glow * 0.4); }
      function frameOf() { for (var i = 0; i < FRAMES.length; i++) if (FRAMES[i].id === look.frame) return FRAMES[i]; return { rough: 0.4, metal: 0.2 }; }
      function pivot(parent, x, y, z) { var g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; }

      function assemble() {
        while (group.children.length) group.remove(group.children[0]);
        geos.forEach(function (g) { g.dispose(); }); geos = []; parts = [];
        me.body = look.body;
        if (look.body === 'f') {
          var rig = pivot(group, 0, 0, 0), float = pivot(rig, 0, HOVER_Y, 0); float.scale.setScalar(HOVER_SCALE);
          mesh(shared.cube, float, 0, 0, 0, false, true); mesh(shared.cubeScreens, float, 0, 0, 0, true);
          var ring = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glow(), color: look.accent, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
          ring.rotation.x = -Math.PI / 2; ring.position.y = 0.025; ring.scale.setScalar(0.85); ring.renderOrder = 2; rig.add(ring); geos.push(ring.geometry);
          nodes = { hover: true, float: float, ring: ring };
        } else {
          var r = pivot(group, 0, 0, 0); r.scale.setScalar(S);
          var hip = pivot(r, 0, HIP, 0), spine = pivot(hip, 0, 0, 0);
          mesh(shared.trunk, spine, 0, 0, 0, false, true);
          var head = pivot(spine, 0, 1.16, 0); mesh(shared.head, head, 0, 0, 0, false, true); mesh(shared.headScreens, head, 0, 0, 0, true);
          var arm = function (s, i) { var sh = pivot(spine, s * 0.495, 0.75, 0); mesh(shared.upperArm[i], sh); var el = pivot(sh, 0, -0.255, 0); mesh(shared.foreArm, el); return { sh: sh, el: el }; };
          var leg = function (s) { var th = pivot(hip, s * 0.2, -0.005, 0); mesh(shared.thigh, th); var kn = pivot(th, 0, -0.3, 0); mesh(shared.shin, kn); return { th: th, kn: kn }; };
          nodes = { hip: hip, spine: spine, head: head, armL: arm(1, 0), armR: arm(-1, 1), legL: leg(1), legR: leg(-1) };
        }
        colours();
        shine(); skin();
        drawSheet(sheet, look, me.label, false); tex.needsUpdate = true;
      }
      function skin() {
        parts.forEach(function (p) { p.material = ghost ? ghostMaterial() : bodyMaterial(frameOf()); p.castShadow = p.userData.shadow && !ghost; });
        screenMat.transparent = ghost; screenMat.opacity = ghost ? 0.14 : 1; screenMat.depthWrite = !ghost; screenMat.needsUpdate = true;
        if (nodes && nodes.ring) nodes.ring.visible = !ghost;
      }
      /** Drawn faintly (true) or solid (false): for a character the camera is almost touching. */
      me.setGhost = function (on) { on = !!on; if (on !== ghost) { ghost = on; skin(); } };

      me.setLook = function (next) {
        var parsed = parseLook(next); if (!parsed) return false;
        if (parsed.body === 'p') parsed.body = look.body;
        var rebuild = parsed.body !== look.body; look = me.look = parsed;
        if (rebuild) assemble();
        else {
          colours(); skin();
          if (nodes.ring) nodes.ring.material.color.set(look.accent);
          shine();
          drawSheet(sheet, look, me.label, false); tex.needsUpdate = true;
        }
        return true;
      };
      me.setLabel = function (text) { text = String(text || ''); if (text === me.label) return; me.label = text; drawSheet(sheet, look, me.label, false); tex.needsUpdate = true; };
      me.wave = function () { waveLeft = 2.6; };
      /** How tall it is, in metres above where it stands or sits (a seated humanoid sits high: its legs are short for a bar stool). */
      me.height = function (seated) { return look.body === 'f' ? (seated ? HOVER_Y - 0.1 : HOVER_Y) + 1.02 * HOVER_SCALE / 2 + 0.04 : seated ? SEAT_TALL : TALL; };
      /** state: { speed (m/s over the floor), seated }. Call once a frame while the character is shown; `far` skips the fine movement. */
      me.update = function (dt, state, far) {
        state = state || {}; dt = Math.min(0.1, Math.max(0, dt || 0)); t += dt;
        var speed = Math.max(0, +state.speed || 0), seated = !!state.seated, moving = !seated && speed > 0.25 ? 1 : 0;
        walk += (moving - walk) * Math.min(1, dt * 9);
        var run = Math.max(0, Math.min(1, (speed - 3.3) / 1.3)), yaw = group.rotation.y;
        if (lastYaw !== null && dt > 0) { var d = Math.atan2(Math.sin(yaw - lastYaw), Math.cos(yaw - lastYaw)) / dt; turn += (Math.max(-2, Math.min(2, d)) - turn) * Math.min(1, dt * 6); }
        lastYaw = yaw;
        var swagger = look.gait === 's' ? walk : 0, tipsy = look.gait === 't' ? 0.35 + 0.65 * walk : 0;
        if (waveLeft > 0) waveLeft = Math.max(0, waveLeft - dt);
        var wv = waveLeft > 0 ? Math.sin(Math.PI * (1 - waveLeft / 2.6)) : 0;
        // blinking: the front screen is redrawn twice per blink, and only for characters near enough to see it
        if (!far && look.face !== 'cool') {
          blinkAt -= dt;
          if (blinkAt <= 0 && !blinking) { blinking = 0.13; drawSheet(sheet, look, me.label, true, true); tex.needsUpdate = true; }
          else if (blinking > 0 && (blinking -= dt) <= 0) { blinking = 0; blinkAt = 2.5 + Math.random() * 4; drawSheet(sheet, look, me.label, false, true); tex.needsUpdate = true; }
        }
        if (nodes.hover) {
          var f = nodes.float, ph = t * 0.785, drive = Math.min(1, speed / 4.6);
          f.position.set(0.012 * Math.sin(ph) + tipsy * 0.03 * Math.sin(t * 1.7), (seated ? HOVER_Y - 0.1 : HOVER_Y) + 0.034 * Math.sin(ph * 2) + 0.02 * wv, 0);
          f.rotation.set(0.13 * drive + 0.014 * Math.sin(ph) + tipsy * 0.03 * Math.sin(ph * 3) - swagger * 0.02 + 0.1 * wv * Math.sin(t * 7),
            0.012 * Math.sin(ph) + (seated ? 0.1 * Math.sin(t * 0.45 + seed) : 0),
            -0.07 * Math.max(-1, Math.min(1, turn / 1.35)) + 0.012 * Math.sin(ph * 2) + swagger * 0.05 * Math.sin(ph * 2) + tipsy * (0.045 * Math.sin(ph * 3) + 0.025 * Math.sin(ph * 5)) + 0.09 * wv * Math.sin(t * 9), 'YXZ');
          nodes.ring.material.opacity = 0.42 + 0.1 * Math.sin(ph * 2); nodes.ring.scale.setScalar(0.8 + 0.05 * Math.sin(ph * 2));
          return;
        }
        var n = nodes, freq = Math.max(1, Math.min(2.8, speed / 1.7));
        phase += dt * freq * 6.2832 * (moving ? 1 : 0.0);
        var s = Math.sin(phase), c = Math.cos(phase), A = (0.5 + 0.28 * run) * walk, breathe = Math.sin(t * 1.6 + seed);
        var roll = tipsy * (0.07 * Math.sin(t * 2 + 0.4) + 0.035 * Math.sin(t * 3.9 + 1.4)) - swagger * 0.07 * c;
        if (seated) {
          n.hip.position.set(0, SEAT_HIP, 0);
          n.spine.rotation.set(0.03 + 0.008 * breathe, 0, roll * 0.3);
          n.legL.th.rotation.x = n.legR.th.rotation.x = -1.42; n.legL.kn.rotation.x = n.legR.kn.rotation.x = 1.36;
          n.armL.sh.rotation.set(-0.42, 0, 0.1); n.armR.sh.rotation.set(-0.42 - 1.9 * wv, 0, -0.1 - 0.5 * wv);
          n.armL.el.rotation.set(-0.95, 0, 0); n.armR.el.rotation.set(-0.95 + 0.3 * wv, 0, wv * 0.5 * Math.sin(t * 9));
        } else {
          n.hip.position.set(tipsy * 0.04 * Math.sin(t * 1.3), HIP - walk * (0.022 + 0.02 * run) * (0.5 + 0.5 * Math.cos(phase * 2)) + (1 - walk) * 0.006 * breathe, 0);
          n.spine.rotation.set((0.04 + 0.11 * run) * walk + (1 - walk) * 0.012 * breathe - swagger * 0.03, (0.06 + 0.14 * swagger) * s * walk, roll - 0.02 * c * walk);
          if (far) return;
          n.legL.th.rotation.x = -A * s; n.legR.th.rotation.x = A * s;
          n.legL.kn.rotation.x = walk * (0.12 + (0.75 + 0.35 * run) * Math.max(0, c)); n.legR.kn.rotation.x = walk * (0.12 + (0.75 + 0.35 * run) * Math.max(0, -c));
          var arms = (0.42 + 0.3 * run + 0.2 * swagger) * walk;
          n.armL.sh.rotation.set(arms * s, 0, 0.07 + 0.05 * swagger); n.armR.sh.rotation.set(-arms * s * (1 - wv) - 0.3 * wv, 0, -0.07 - 0.05 * swagger - 2.35 * wv);
          n.armL.el.rotation.set(-(0.18 + 0.5 * walk + 0.3 * run), 0, 0); n.armR.el.rotation.set(-(0.18 + 0.5 * walk + 0.3 * run) * (1 - wv), 0, wv * (-0.5 + 0.45 * Math.sin(t * 9)));
        }
        if (far) return;
        // the head keeps level and looks about a little, as the lab's neck does
        n.head.rotation.set(-0.7 * n.spine.rotation.x + 0.015 * Math.sin(t * 2.2) + tipsy * 0.05 * Math.sin(t * 1.8),
          -0.6 * n.spine.rotation.y + (1 - walk) * 0.16 * Math.sin(t * 0.47 + seed) + 0.1 * Math.max(-1, Math.min(1, turn)),
          -0.8 * n.spine.rotation.z + tipsy * 0.04 * Math.sin(t * 2.3 + 0.7) + 0.05 * wv * Math.sin(t * 5));
      };
      me.dispose = function () {
        geos.forEach(function (g) { g.dispose(); }); tex.dispose(); screenMat.dispose();
        if (nodes && nodes.ring) nodes.ring.material.dispose();
        if (group.parent) group.parent.remove(group);
        sheet.width = sheet.height = 0;        // iPad Safari counts canvas memory: give it back at once
        var i = live.indexOf(me); if (i >= 0) live.splice(i, 1);
      };
      assemble(); me.update(0, {});
      live.push(me);
      return me;
    }
    return {
      make: make,
      get count() { return live.length; },
      dispose: function () {
        live.slice().forEach(function (c) { c.dispose(); });
        Object.keys(materials).forEach(function (k) { materials[k].dispose(); }); materials = {};
        if (ghostMat) { ghostMat.dispose(); ghostMat = null; }
        if (glowTex) { glowTex.dispose(); glowTex = null; }
        shared = {};
      }
    };
  }

  global.PXCubes = { version: 1, FRAMES: FRAMES, FINISHES: FINISHES, FACES: FACES, GAITS: GAITS, BODIES: BODIES, ACCENTS: ACCENTS, MAX: MAX,
    parseLook: parseLook, encodeLook: encodeLook, fromLabLook: fromLabLook, drawScreen: drawScreen, kit: kit };
})(typeof window !== 'undefined' ? window : globalThis);
