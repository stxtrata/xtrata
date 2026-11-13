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
 *   kit(THREE, { lite, envMap, inscriptions }) -> { make(code, label) -> character, inscriptions(config | null), dispose() }
 *     character: group (add it to the scene; you place and turn it), update(dt, { speed, seated }, far), setLook(code), setLabel(text),
 *                setScreens(text), gesture(kind), show({ emoji } | { text }, ms), wave(), setGhost(on), height(seated) in metres,
 *                body ('h' | 'f'), dispose()
 *
 * Inscriptions on the screens (functions/lib/casino-screens.ts has the same pattern; casino-screens.test.ts checks they agree). The
 * six screens may each show an Xtrata inscription the player holds: "f9,b12,l340,t7" (front, back, left, right, top, under; then the
 * token id). On the front it takes the place of the face; a reaction still shows there for its moment. The kit is told where the pictures are with `inscriptions: { contract, base }`; without it (or
 * after `kit.inscriptions(null)`, the viewer's own switch) every screen shows the lab's graphics. A picture is this site's stored
 * thumbnail when there is one, else the inscription itself when it is a small still image; anything else is a numbered tile.
 *   SCREEN_FACES, parseScreens(text) -> { b?: id, ... } | null, encodeScreens(map) -> text, pictureSource(contract, token, lite, base)
 *   GESTURES    what gesture(kind) knows
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

  // ------------------------------------------------------------------ inscriptions on the screens

  var SCREEN_FACES = ['f', 'b', 'l', 'r', 't', 'u'];      // front, back, left, right, top, under: cells 0 to 5 of the sheet, in that order
  var SCREENS_PATTERN = /^[fblrtu](?:0|[1-9]\d{0,8})(?:,[fblrtu](?:0|[1-9]\d{0,8})){0,5}$/, SCREENS_MAX = 65;
  /** "b12,l340" as { b: 12, l: 340 }; "" as {}; null when it is not a screens string. */
  function parseScreens(text) {
    if (text === null || text === undefined || text === '') return {};
    if (typeof text !== 'string' || text.length > SCREENS_MAX || !SCREENS_PATTERN.test(text)) return null;
    var out = {}, parts = text.split(',');
    for (var i = 0; i < parts.length; i++) { var f = parts[i][0]; if (out[f] !== undefined) return null; out[f] = Number(parts[i].slice(1)); }
    return out;
  }
  function encodeScreens(map) {
    map = map || {};
    return SCREEN_FACES.filter(function (f) { return typeof map[f] === 'number' && map[f] >= 0 && Math.floor(map[f]) === map[f] && map[f] < 1e9; })
      .map(function (f) { return f + map[f]; }).join(',');
  }
  // Still pictures a canvas can take as they are. Not SVG (a document, and some browsers refuse to read a canvas back after drawing
  // one), and nothing that is not a picture: those get a numbered tile.
  var STILL = /^image\/(png|jpeg|jpg|webp|gif|avif|bmp)$/;
  /**
   * Where to get a picture of an inscription, from its row in this site's index (/index/page): the stored thumbnail when it has
   * one, else the inscription itself when it is a still image small enough (3 MB; 300 KB on phones and tablets).
   * -> { url, full, kind }: `url` null when there is nothing to draw; `kind` a word for the tile ("AUDIO", "HTML", "IMAGE"...).
   */
  function pictureSource(contract, token, lite, base) {
    base = base || '';
    var mime = String((token && token.mime) || '').toLowerCase().split(';')[0].trim(), size = +(token && token.totalSize) || 0;
    var kind = (mime.indexOf('html') >= 0 ? 'html' : mime.indexOf('svg') >= 0 ? 'svg' : mime.split('/')[0] || '').toUpperCase().slice(0, 12);
    var content = STILL.test(mime) && size > 0 && size <= (lite ? 300e3 : 3e6)
      ? base + '/runtime/content?contractId=' + encodeURIComponent(contract) + '&tokenId=' + token.id + '&network=mainnet' : null;
    if (token && typeof token.thumb === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(token.thumb))
      return { url: base + '/thumb/' + encodeURIComponent(contract) + '/' + token.id + '?v=' + token.thumb, full: content, kind: kind };
    return { url: content, full: null, kind: kind };
  }
  var GESTURES = ['greet', 'win', 'nod', 'look', 'lose', 'raise', 'clap', 'laugh', 'wow', 'dance', 'heart', 'bow'];
  var GESTURE_SECONDS = { greet: 2.6, win: 2.4, nod: 1.3, look: 1.8, lose: 2.4, raise: 2.2, clap: 2, laugh: 2, wow: 1.8, dance: 3.4, heart: 2.2, bow: 2 };

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
    drawFinish(g, look);
    g.restore();
  }
  /** The finish, over whatever a screen shows (in the 256-unit square). */
  function drawFinish(g, look) {
    if (look.finish === 'crt') { g.fillStyle = 'rgba(0,0,0,.2)'; for (var sy = 0; sy < 256; sy += 4) g.fillRect(0, sy, 256, 1.6); }
    else if (look.finish === 'frosted') { g.fillStyle = 'rgba(214,232,236,.2)'; g.fillRect(0, 0, 256, 256); }
    else if (look.finish === 'smoked') { g.fillStyle = 'rgba(0,0,0,.24)'; g.fillRect(0, 0, 256, 256); }
    else if (look.finish === 'glass') { var gl = g.createLinearGradient(0, 0, 200, 256); gl.addColorStop(0, 'rgba(255,255,255,.1)'); gl.addColorStop(0.42, 'rgba(255,255,255,0)'); g.fillStyle = gl; g.fillRect(0, 0, 256, 256); }
  }
  function cellOpen(g, ox, oy, size, look) {
    g.save(); g.translate(ox, oy); g.scale(size / 256, size / 256); g.beginPath(); g.rect(0, 0, 256, 256); g.clip();
    var bg = SCREEN_BG[look.finish] || SCREEN_BG.glass, gr = g.createLinearGradient(0, 0, 256, 256);
    gr.addColorStop(0, bg[0]); gr.addColorStop(1, bg[1]); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    g.textBaseline = 'middle'; g.textAlign = 'center'; g.lineCap = 'round'; g.lineJoin = 'round';
  }
  /** An inscription on a screen: its picture when there is one (a square canvas), else a tile with its number and what it is. */
  function drawInscription(g, ox, oy, size, look, id, picture, kind, waiting) {
    cellOpen(g, ox, oy, size, look);
    if (picture) g.drawImage(picture, 0, 0, 256, 256);
    else {
      var title = '#' + id, px = 64; g.fillStyle = '#e9f7f3'; g.font = '700 ' + px + 'px Arial,sans-serif';
      while (px > 22 && g.measureText(title).width > 200) { px -= 4; g.font = '700 ' + px + 'px Arial,sans-serif'; }
      g.fillText(title, 128, 122);
      g.fillStyle = look.accent; g.font = '700 ' + (size < 200 ? 20 : 13) + 'px Arial,sans-serif';
      g.fillText(waiting ? '· · ·' : (kind || 'INSCRIPTION'), 128, 176);
      if (size >= 200) { g.fillStyle = 'rgba(233,247,243,.72)'; g.font = '700 8px Arial,sans-serif'; g.fillText('X T R A T A', 128, 30); }
    }
    drawFinish(g, look);
    g.restore();
  }
  /** Something said with the face: a reaction's emoji, or a few words, in place of the face for a moment. */
  function drawSaying(g, ox, oy, size, look, what) {
    cellOpen(g, ox, oy, size, look);
    if (what.emoji) {
      g.font = '150px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.fillStyle = '#e9f7f3';
      g.fillText(String(what.emoji).slice(0, 8), 128, 136);
    } else {
      var words = String(what.text || '').slice(0, 60).split(/\s+/), lines = [''], px = 34;
      g.fillStyle = '#e9f7f3'; g.font = '700 ' + px + 'px Arial,sans-serif';
      words.forEach(function (w) { var last = lines.length - 1, next = lines[last] ? lines[last] + ' ' + w : w; if (g.measureText(next).width > 214 && lines[last]) lines.push(w); else lines[last] = next; });
      lines = lines.slice(0, 4);
      lines.forEach(function (line, n) { g.fillText(line, 128, 128 + (n - (lines.length - 1) / 2) * (px + 6), 220); });
    }
    g.strokeStyle = look.accent; g.lineWidth = 5; g.beginPath(); g.moveTo(96, 226); g.lineTo(160, 226); g.stroke();
    drawFinish(g, look);
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
    var shared = {}, materials = {}, live = [], glowTex = null;

    // ---- pictures of inscriptions: one small square canvas per token, shared by every character that shows it
    var ins = null, pics = {}, wanted = [], asking = null, PIC_MAX = lite ? 40 : 96, clock = 0;
    function insOf(config) {
      return config && typeof config.contract === 'string' && /^S[A-Z0-9]{20,60}\.[A-Za-z0-9-_]{1,40}$/.test(config.contract)
        ? { contract: config.contract, base: String(config.base || '').replace(/\/+$/, '') } : null;
    }
    ins = insOf(options.inscriptions);
    function settle(entry, state) {
      entry.state = state; var subs = entry.subs; entry.subs = [];
      subs.forEach(function (fn) { try { fn(); } catch (e) { /* a character that has gone */ } });
    }
    function keep(entry, img) {
      // cover the square, then let the picture itself go: a big image would otherwise stay decoded for as long as it is on a cube
      var c = document.createElement('canvas'); c.width = c.height = CELL;
      var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
      if (!w || !h) return false;
      var side = Math.min(w, h), g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
      try { g.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, CELL, CELL); } catch (e) { return false; }
      entry.canvas = c;
      var ids = Object.keys(pics).filter(function (k) { return pics[k].canvas; });
      if (ids.length > PIC_MAX) {       // the least recently drawn go; they are fetched again (from the browser's cache) if a cube shows them again
        ids.sort(function (a, b) { return pics[a].used - pics[b].used; }).slice(0, ids.length - PIC_MAX).forEach(function (k) { pics[k].canvas.width = pics[k].canvas.height = 0; delete pics[k]; });
      }
      return true;
    }
    function load(entry, url, fallback) {
      var img = new Image(); img.decoding = 'async';
      img.onload = function () { var ok = keep(entry, img); img.onload = img.onerror = null; img.src = ''; if (ok) settle(entry, 'ok'); else if (fallback) load(entry, fallback, null); else settle(entry, 'none'); };
      img.onerror = function () { img.onload = img.onerror = null; if (fallback) load(entry, fallback, null); else settle(entry, 'none'); };
      img.src = url;
    }
    function ask() {
      asking = null;
      var mine = ins, ids = wanted.splice(0, 100); if (!mine || !ids.length) return;
      var fail = function () {
        // could not ask: not the same as "no picture". The tiles stay, and the question is asked again a few times.
        ids.forEach(function (id) { var e = pics[mine.contract + ':' + id]; if (!e) return; e.tries++; settle(e, 'fail'); });
      };
      fetch(mine.base + '/index/page?primary=' + encodeURIComponent(mine.contract) + '&ids=' + ids.join(','), { credentials: 'omit' })
        .then(function (r) { if (!r.ok && r.status !== 400) throw new Error('index ' + r.status); return r.status === 400 ? { tokens: [] } : r.json(); })
        .then(function (j) {
          var rows = {}; (j && Array.isArray(j.tokens) ? j.tokens : []).forEach(function (t) { if (t && typeof t.id === 'number') rows[t.id] = t; });
          ids.forEach(function (id) {
            var e = pics[mine.contract + ':' + id]; if (!e) return;
            var src = rows[id] ? pictureSource(mine.contract, rows[id], lite, mine.base) : { url: null, kind: '' };
            e.kind = src.kind;
            if (src.url) load(e, src.url, src.full); else settle(e, 'none');
          });
        }).catch(fail);
      if (wanted.length) asking = setTimeout(ask, 60);
    }
    /** The picture of token `id`, as far as it is known: { state: 'wait' | 'ok' | 'none' | 'fail', canvas, kind }. `fn` is called once when that changes. */
    function picture(id, fn) {
      if (!ins) return null;
      var key = ins.contract + ':' + id, e = pics[key];
      if (e && e.state === 'fail' && e.tries < 4 && clock - e.at > 20 * e.tries) e = null;
      if (!e) {
        e = pics[key] = { state: 'wait', canvas: null, kind: '', subs: [], tries: (pics[key] && pics[key].tries) || 0, at: clock, used: clock };
        wanted.push(id); if (!asking) asking = setTimeout(ask, 60);
      }
      e.used = clock;
      if (fn && (e.state === 'wait' || e.state === 'fail') && e.subs.length < 64) e.subs.push(fn);
      return e;
    }

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
      var me = { group: group, body: null, look: look, label: String(label || ''), screens: '' };
      var shots = {}, saying = null, sayLeft = 0, gest = null, gone = false, later = null, lastClock = 0;
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
      /**
       * Draw the screens: the lab's graphics (the face in front), then the player's inscriptions over whichever screens they chose,
       * then what is being said, which covers the front for its moment whatever is there. `onlyFront` redraws the front alone.
       */
      function paint(blink, onlyFront) {
        if (gone) return;
        var g = sheet.getContext('2d');
        drawSheet(sheet, look, me.label, blink, onlyFront);
        if (ins) {
          var again = false;
          SCREEN_FACES.forEach(function (f, i) {
            if (shots[f] === undefined || (onlyFront && i > 0)) return;
            var e = picture(shots[f], repaint);
            if (!e) return;
            var retry = e.state === 'fail' && e.tries < 4; if (retry) again = true;      // asked again a few times, then it is simply a numbered tile
            drawInscription(g, (i % 3) * CELL, Math.floor(i / 3) * CELL, CELL, look, shots[f], e.state === 'ok' ? e.canvas : null, e.kind, e.state === 'wait' || retry);
          });
          if (again && !later) later = setTimeout(function () { later = null; paint(false); }, 25000);
        }
        if (saying) drawSaying(g, 0, 0, CELL, look, saying);
        tex.needsUpdate = true;
      }
      function repaint() { if (!gone) paint(false); }
      me.repaint = repaint;
      /** What it is doing right now, for tests: the gesture in progress and what is on its face. */
      Object.defineProperty(me, 'doing', { get: function () { return { gesture: gest ? gest.k : waveLeft > 0 ? 'greet' : null, saying: saying ? saying.emoji || saying.text : null }; } });
      me.sheet = sheet;
      /** Inscriptions for the screens: "f9,b12,l340" ("" for none). False when it is not a screens string. */
      me.setScreens = function (text) {
        var parsed = parseScreens(text); if (!parsed) return false;
        var canon = encodeScreens(parsed); if (canon === me.screens) return true;
        me.screens = canon; shots = parsed; paint(false); return true;
      };
      /** Put a reaction's emoji ({ emoji }) or a few words ({ text }) on the face for `ms` (2.6 s when not given). */
      me.show = function (what, ms) {
        if (!what || (!what.emoji && !what.text)) return;
        saying = what.emoji ? { emoji: what.emoji } : { text: what.text }; sayLeft = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000 + Math.max(0.4, Math.min(12, (+ms || 2600) / 1000)); blinking = 0; paint(false, true);
      };
      /** A gesture: one of GESTURES. A new one replaces the one in progress. */
      me.gesture = function (kind) {
        if (GESTURES.indexOf(kind) < 0) return false;
        if (kind === 'greet') { waveLeft = 2.6; gest = null; return true; }
        gest = { k: kind, t: 0, d: GESTURE_SECONDS[kind] }; return true;
      };
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
        paint(false);
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
          paint(false);
        }
        return true;
      };
      me.setLabel = function (text) { text = String(text || ''); if (text === me.label) return; me.label = text; paint(false); };
      me.wave = function () { waveLeft = 2.6; };
      /** How tall it is, in metres above where it stands or sits (a seated humanoid sits high: its legs are short for a bar stool). */
      me.height = function (seated) { return look.body === 'f' ? (seated ? HOVER_Y - 0.1 : HOVER_Y) + 1.02 * HOVER_SCALE / 2 + 0.04 : seated ? SEAT_TALL : TALL; };
      /** state: { speed (m/s over the floor), seated }. Call once a frame while the character is shown; `far` skips the fine movement. */
      me.update = function (dt, state, far) {
        state = state || {}; dt = Math.min(0.1, Math.max(0, dt || 0)); t += dt;
        clock = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
        // gestures run by the clock: where the room is drawn slowly (`dt` is capped), a wave still takes as long as a wave
        var real = Math.max(dt, lastClock ? Math.min(1, clock - lastClock) : 0); lastClock = clock;
        var speed = Math.max(0, +state.speed || 0), seated = !!state.seated, moving = !seated && speed > 0.25 ? 1 : 0;
        walk += (moving - walk) * Math.min(1, dt * 9);
        var run = Math.max(0, Math.min(1, (speed - 3.3) / 1.3)), yaw = group.rotation.y;
        if (lastYaw !== null && dt > 0) { var d = Math.atan2(Math.sin(yaw - lastYaw), Math.cos(yaw - lastYaw)) / dt; turn += (Math.max(-2, Math.min(2, d)) - turn) * Math.min(1, dt * 6); }
        lastYaw = yaw;
        var swagger = look.gait === 's' ? walk : 0, tipsy = look.gait === 't' ? 0.35 + 0.65 * walk : 0;
        if (waveLeft > 0) waveLeft = Math.max(0, waveLeft - real);
        var wv = waveLeft > 0 ? Math.sin(Math.PI * (1 - waveLeft / 2.6)) : 0;
        // what is being said leaves the face when its time is up
        if (saying && clock >= sayLeft) { saying = null; paint(false, true); }      // by the clock, so it leaves with the bubble over the head however slowly the room is drawn
        // a gesture in progress: G.e rises and falls over it, G.u runs 0 to 1, G.w is seconds into it; it is always drawn in full
        var G = null;
        if (gest) { gest.t += real; if (gest.t >= gest.d) gest = null; else { G = { k: gest.k, u: gest.t / gest.d, w: gest.t, e: Math.sin(Math.PI * gest.t / gest.d) }; far = false; } }
        // blinking: the front screen is redrawn twice per blink, and only for characters near enough to see it (a face that is
        // an inscription does not blink)
        if (!far && !saying && look.face !== 'cool' && !(ins && shots.f !== undefined)) {
          blinkAt -= dt;
          if (blinkAt <= 0 && !blinking) { blinking = 0.13; paint(true, true); }
          else if (blinking > 0 && (blinking -= dt) <= 0) { blinking = 0; blinkAt = 2.5 + Math.random() * 4; paint(false, true); }
        }
        if (nodes.hover) {
          var f = nodes.float, ph = t * 0.785, drive = Math.min(1, speed / 4.6);
          f.position.set(0.012 * Math.sin(ph) + tipsy * 0.03 * Math.sin(t * 1.7), (seated ? HOVER_Y - 0.1 : HOVER_Y) + 0.034 * Math.sin(ph * 2) + 0.02 * wv, 0);
          f.rotation.set(0.13 * drive + 0.014 * Math.sin(ph) + tipsy * 0.03 * Math.sin(ph * 3) - swagger * 0.02 + 0.1 * wv * Math.sin(t * 7),
            0.012 * Math.sin(ph) + (seated ? 0.1 * Math.sin(t * 0.45 + seed) : 0),
            -0.07 * Math.max(-1, Math.min(1, turn / 1.35)) + 0.012 * Math.sin(ph * 2) + swagger * 0.05 * Math.sin(ph * 2) + tipsy * (0.045 * Math.sin(ph * 3) + 0.025 * Math.sin(ph * 5)) + 0.09 * wv * Math.sin(t * 9), 'YXZ');
          nodes.ring.material.opacity = 0.42 + 0.1 * Math.sin(ph * 2); nodes.ring.scale.setScalar(0.8 + 0.05 * Math.sin(ph * 2));
          var size = HOVER_SCALE;
          if (G) {
            var he = G.e, hw = G.w;
            if (G.k === 'win') { f.position.y += 0.2 * he * Math.abs(Math.sin(hw * 6)); f.rotation.y += G.u * 6.2832; }
            else if (G.k === 'nod') f.rotation.x += 0.32 * he * Math.sin(hw * 9.5);
            else if (G.k === 'look') f.rotation.y += 0.8 * Math.sin(G.u * 6.2832);
            else if (G.k === 'lose') { f.position.y -= 0.24 * he; f.rotation.x += 0.45 * he; }
            else if (G.k === 'raise') { f.position.y += 0.12 * he; f.rotation.x -= 0.25 * he; }
            else if (G.k === 'clap') size = HOVER_SCALE * (1 + 0.07 * he * Math.abs(Math.sin(hw * 14)));
            else if (G.k === 'laugh') { f.rotation.z += 0.16 * he * Math.sin(hw * 12); f.position.y += 0.04 * he * Math.abs(Math.sin(hw * 12)); }
            else if (G.k === 'wow') { f.rotation.x -= 0.3 * he; f.position.y += 0.1 * he; }
            else if (G.k === 'dance') { f.position.x += 0.1 * he * Math.sin(hw * 5.5); f.position.y += 0.07 * he * Math.abs(Math.sin(hw * 5.5)); f.rotation.z += 0.22 * he * Math.sin(hw * 5.5); f.rotation.y += G.u * 12.5664; }
            else if (G.k === 'heart') size = HOVER_SCALE * (1 + 0.1 * he * Math.pow(Math.abs(Math.sin(hw * 5)), 3));
            else if (G.k === 'bow') { f.rotation.x += 0.6 * he; f.position.y -= 0.08 * he; }
          }
          if (f.scale.x !== size) f.scale.setScalar(size);
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
        var ge = G ? G.e : 0, gw = G ? G.w : 0, gk = G ? G.k : '';
        if (G) {
          // arms: z lifts one sideways (left +, right -), x swings it forward (-); the elbow's x bends it forward (-)
          var L = n.armL, R = n.armR, rest = 1 - ge;
          if (gk === 'win') {
            if (!seated) n.hip.position.y += 0.085 * ge * Math.abs(Math.sin(gw * 7));
            L.sh.rotation.set(L.sh.rotation.x * rest, 0, 0.07 + 2.6 * ge + 0.16 * ge * Math.sin(gw * 10)); R.sh.rotation.set(R.sh.rotation.x * rest, 0, -0.07 - 2.6 * ge - 0.16 * ge * Math.sin(gw * 10 + 1));
            L.el.rotation.x *= rest; R.el.rotation.x *= rest;
          } else if (gk === 'raise') {
            R.sh.rotation.set(R.sh.rotation.x * rest - 1.55 * ge, 0, R.sh.rotation.z * rest - 0.12 * ge); R.el.rotation.set(R.el.rotation.x * rest - 0.55 * ge, 0, 0);
          } else if (gk === 'clap') {
            var beat = 0.13 * ge * Math.sin(gw * 15);
            L.sh.rotation.set(L.sh.rotation.x * rest - 0.95 * ge, 0, 0.07 * rest - (0.2 + beat) * ge); R.sh.rotation.set(R.sh.rotation.x * rest - 0.95 * ge, 0, -0.07 * rest + (0.2 + beat) * ge);
            L.el.rotation.set(L.el.rotation.x * rest - 1.15 * ge, 0, 0); R.el.rotation.set(R.el.rotation.x * rest - 1.15 * ge, 0, 0);
          } else if (gk === 'lose') {
            n.spine.rotation.x += 0.26 * ge; if (!seated) n.hip.position.y -= 0.03 * ge;
            L.sh.rotation.x *= rest; R.sh.rotation.x *= rest;
          } else if (gk === 'laugh') {
            n.spine.rotation.x -= 0.1 * ge; if (!seated) n.hip.position.y += 0.02 * ge * Math.abs(Math.sin(gw * 11));
          } else if (gk === 'wow') {
            n.spine.rotation.x -= 0.13 * ge;
            L.sh.rotation.set(L.sh.rotation.x * rest, 0, 0.07 + 0.95 * ge); R.sh.rotation.set(R.sh.rotation.x * rest, 0, -0.07 - 0.95 * ge);
            L.el.rotation.x = L.el.rotation.x * rest - 0.5 * ge; R.el.rotation.x = R.el.rotation.x * rest - 0.5 * ge;
          } else if (gk === 'dance') {
            var d1 = Math.sin(gw * 5.5), d2 = Math.sin(gw * 11);
            if (!seated) { n.hip.position.x += 0.05 * ge * d1; n.hip.position.y -= 0.03 * ge * Math.abs(d2); }
            n.spine.rotation.y += 0.3 * ge * d1; n.spine.rotation.z += 0.09 * ge * d1;
            L.sh.rotation.set(L.sh.rotation.x * rest - 0.5 * ge, 0, 0.07 + (1.25 + 0.9 * d1) * ge); R.sh.rotation.set(R.sh.rotation.x * rest - 0.5 * ge, 0, -0.07 - (1.25 - 0.9 * d1) * ge);
            L.el.rotation.x = L.el.rotation.x * rest - 0.9 * ge; R.el.rotation.x = R.el.rotation.x * rest - 0.9 * ge;
          } else if (gk === 'heart') {
            // both hands to the chest
            L.sh.rotation.set(L.sh.rotation.x * rest - 0.55 * ge, 0, 0.07 * rest - 0.28 * ge); R.sh.rotation.set(R.sh.rotation.x * rest - 0.55 * ge, 0, -0.07 * rest + 0.28 * ge);
            L.el.rotation.set(L.el.rotation.x * rest - 1.75 * ge, 0, 0); R.el.rotation.set(R.el.rotation.x * rest - 1.75 * ge, 0, 0);
            n.spine.rotation.z += 0.05 * ge * Math.sin(gw * 4);
          } else if (gk === 'bow') {
            n.spine.rotation.x += 0.62 * ge;
            L.sh.rotation.x = L.sh.rotation.x * rest + 0.25 * ge; R.sh.rotation.x = R.sh.rotation.x * rest + 0.25 * ge;
          }
        }
        // the head keeps level and looks about a little, as the lab's neck does
        n.head.rotation.set(-0.7 * n.spine.rotation.x + 0.015 * Math.sin(t * 2.2) + tipsy * 0.05 * Math.sin(t * 1.8),
          -0.6 * n.spine.rotation.y + (1 - walk) * 0.16 * Math.sin(t * 0.47 + seed) + 0.1 * Math.max(-1, Math.min(1, turn)),
          -0.8 * n.spine.rotation.z + tipsy * 0.04 * Math.sin(t * 2.3 + 0.7) + 0.05 * wv * Math.sin(t * 5));
        if (G) {
          if (gk === 'nod') n.head.rotation.x += 0.3 * ge * Math.sin(gw * 9.5);
          else if (gk === 'look') n.head.rotation.y += 0.75 * Math.sin(G.u * 6.2832);
          else if (gk === 'lose') n.head.rotation.x += 0.5 * ge;
          else if (gk === 'laugh') n.head.rotation.x += -0.16 * ge + 0.09 * ge * Math.sin(gw * 11);
          else if (gk === 'wow') n.head.rotation.x -= 0.1 * ge;
          else if (gk === 'win') n.head.rotation.x -= 0.18 * ge;
          else if (gk === 'bow') n.head.rotation.x += 0.62 * 0.7 * ge + 0.2 * ge;      // the head goes down with the bow (the neck would otherwise keep it level)
          else if (gk === 'heart') n.head.rotation.z += 0.12 * ge * Math.sin(gw * 4);
        }
      };
      me.dispose = function () {
        gone = true; if (later) { clearTimeout(later); later = null; }
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
      /** Where inscriptions' pictures are ({ contract, base }), or null to show none (the viewer's own switch). Every character is redrawn. */
      inscriptions: function (config) {
        var next = insOf(config);
        if ((next && ins && next.contract === ins.contract && next.base === ins.base) || (!next && !ins)) return;
        ins = next; live.forEach(function (c) { c.repaint(); });
      },
      get showing() { return !!ins; },
      dispose: function () {
        live.slice().forEach(function (c) { c.dispose(); });
        Object.keys(materials).forEach(function (k) { materials[k].dispose(); }); materials = {};
        if (ghostMat) { ghostMat.dispose(); ghostMat = null; }
        if (glowTex) { glowTex.dispose(); glowTex = null; }
        shared = {};
      }
    };
  }

  global.PXCubes = { version: 2, FRAMES: FRAMES, FINISHES: FINISHES, FACES: FACES, GAITS: GAITS, BODIES: BODIES, ACCENTS: ACCENTS, MAX: MAX,
    parseLook: parseLook, encodeLook: encodeLook, fromLabLook: fromLabLook, drawScreen: drawScreen, kit: kit,
    SCREEN_FACES: SCREEN_FACES, SCREENS_PATTERN: SCREENS_PATTERN, SCREENS_MAX: SCREENS_MAX, parseScreens: parseScreens, encodeScreens: encodeScreens,
    pictureSource: pictureSource, GESTURES: GESTURES };
})(typeof window !== 'undefined' ? window : globalThis);
