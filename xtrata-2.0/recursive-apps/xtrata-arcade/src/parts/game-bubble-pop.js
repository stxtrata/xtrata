/*
 * Xtrata Arcade cartridge #16 - BUBBLE POP (v2)
 * Aim and fire orbs into the cluster. Three or more of a colour pop, and
 * anything left hanging falls for a bigger bonus. Miss too often and the
 * ceiling pushes down. Clear the board for the next designed layout.
 *
 * Contract game-id: xa_bubble_pop (score mode, higher is better)
 *
 * File map
 *   1. geometry + tuning constants
 *   2. data tables: COLOURS, SPECIALS
 *   3. BOARDS (designed layouts as honeycomb ASCII art)
 *   4. colour + canvas helpers
 *   5. sprite painting (cached glossy bubbles, stone, bomb, ice, rainbow)
 *   6. soundtrack (C major pentatonic, each colour is a scale degree)
 *   7. create(): the game
 *        grid helpers - board building - queue - aim trace - landing rules
 *        (match, rainbow, bombs, ice, orphans) - ceiling - effects - update
 *        - render
 *   8. attract() + registration
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-bubble-pop');
  var U = XA.util;
  var TAU = Math.PI * 2;

  /* ============================================================ 1. GEOMETRY */
  var W = 420, H = 600, R = 18, D = R * 2, COLS = 11, ROWH = R * 1.732;
  var LEFT = (W - COLS * D) / 2, TOP = 40, MAX_ROWS = 14;
  var SX = W / 2, SY = 548, SPEED = 880;
  var XMIN = LEFT + R, XMAX = W - LEFT - R;   // shot centre bounces off these walls
  var HIT_DIST = D * 0.86;                    // shot-to-bubble contact distance
  var BOMB_RADIUS = D * 1.8;                  // ring 1 plus the six nearest ring-2 cells
  var DANGER_ROW = MAX_ROWS - 4;              // lowest bubble at/after this row: warning
  var DEAD_ROW = MAX_ROWS - 1;                // lowest bubble reaches this row: game over
  var FLOOR_Y = H - 6;                        // falling bubbles bounce here once, then pop
  var NEXT_X = SX - 76, NEXT_Y = SY + 20;     // queue slots beside the launcher
  var AFTER_X = SX - 116, AFTER_Y = SY + 26;
  var ACCENT = '#ff8fd8';
  var MAX_FALLING = 70, MAX_DROPLETS = 260, MAX_POPS = 160;
  var CAPTION_SECS = 3.4, BANNER_SECS = 2.6, CLEAR_SECS = 2.6, CEIL_ANIM_SECS = 0.35;
  var M = function () { return XA.music; };

  /* ========================================================= 2. DATA TABLES */
  // Each colour is also a scale degree (index = degree in C major pentatonic)
  // and carries its own symbol, so the board reads without relying on hue.
  var COLOURS = [
    { key: 'r', name: 'RED', hex: '#ff4d6d', sym: 'heart' },
    { key: 'y', name: 'YELLOW', hex: '#ffd23f', sym: 'star' },
    { key: 'g', name: 'GREEN', hex: '#39ff88', sym: 'triangle' },
    { key: 'c', name: 'CYAN', hex: '#3ff0ff', sym: 'diamond' },
    { key: 'p', name: 'PURPLE', hex: '#b04dff', sym: 'ring' },
    { key: 'o', name: 'ORANGE', hex: '#ff9f1c', sym: 'square' }
  ];
  var PALETTE = COLOURS.map(function (c) { return c.hex; });
  var COLOUR_INDEX = {};
  COLOURS.forEach(function (c, i) { COLOUR_INDEX[c.key] = i; });

  // Special bubbles. `intro` is the level where the kind can first appear;
  // the first time a run meets one, a "NEW: X" caption explains it.
  var SPECIALS = {
    bomb: { label: 'BOMB', desc: 'HIT IT OR POP BESIDE IT - BOOM', hex: '#ff6a3d', intro: 3 },
    rainbow: { label: 'RAINBOW', desc: 'WILD SHOT - MATCHES ANY COLOUR', hex: '#ffffff', intro: 4 },
    stone: { label: 'STONE', desc: 'NEVER POPS - CUT IT LOOSE', hex: '#c9c2d8', intro: 5 },
    ice: { label: 'ICE', desc: 'POP A MATCH BESIDE IT TO CRACK', hex: '#bfefff', intro: 6 }
  };

  /* ============================================================== 3. BOARDS */
  // Honeycomb ASCII art. Even rows hold 11 cells, odd rows 10 cells and are
  // indented by one space, so cells that touch on the board touch
  // diagonally in the text. Spaces are ignored when parsing.
  //
  //   .  empty                 r y g c p o   colour bubble (see COLOURS)
  //   *  random colour         R Y G C P O   that colour frozen in ICE
  //   +  random colour in ICE  #  STONE      @  BOMB
  //
  // `colours` is the set '*' and '+' pick from (clumped so groups form).
  // After the last design, levels mix two designs with fresh colours.
  var BOARDS = [
    { name: 'WARM UP', colours: 'ryc', rows: [
      'r r y y c c r r y y c',
      ' r y y c c r r y y c',
      'c c r r y y c c r r y',
      ' c r r y y c c r r y',
      'y y c c r r y y c c r'
    ] },
    { name: 'HEART', colours: 'pyc', rows: [
      '. r r r . . . r r r .',
      ' r * * r . . r * * r',
      'r * * * * r * * * * r',
      ' r * * * * * * * * r',
      '. r * * * * * * * r .',
      ' . r * * * * * * r .',
      '. . r * * * * * r . .',
      ' . . . r * * r . . .'
    ] },
    { name: 'DIAMOND', colours: 'gyo', rows: [
      'o o . . c c c . . o o',
      ' o . . c * * c . . o',
      'o . . c * * * c . . o',
      ' . . c * * * * c . .',
      '. . c * * @ * * c . .',
      ' . . c * * * * c . .',
      '. . . c * * * c . . .',
      ' . . . . @ @ . . . .'
    ] },
    { name: 'TOWERS', colours: 'rgpy', rows: [
      'r r r . g g g . p p p',
      ' r r . . g g . . p p',
      'y y y . p p p . r r r',
      ' y y . . p p . . r r',
      'g g g . r r r . y y y',
      ' g g . . r r . . y y',
      'p p p . y y y . g g g'
    ] },
    { name: 'ZIGZAG', colours: 'gycp', rows: [
      'g g . . y # c . . p p',
      ' g g . . y c . . p p',
      '. g g . y * c . p p .',
      ' . g g y y c c p p .',
      '. . g # y . c # p . .',
      ' . . g y . . c p . .',
      '. . . # . . . # . . .'
    ] },
    { name: 'SMILEY', colours: 'yo', rows: [
      '. . . o o o o o . . .',
      ' . . o y y y y o . .',
      '. . o y C y C y o . .',
      ' . o y C y y C y o .',
      '. . o y y y y y o . .',
      ' . . o r y y r o . .',
      '. . . o r r r o . . .',
      ' . . . . o o . . . .'
    ] },
    { name: 'ARROWHEAD', colours: 'gcpy', rows: [
      '* * . . g g g . . * *',
      ' * . . . g g . . . *',
      '* * . . g # g . . * *',
      ' * . . . g g . . . *',
      '* . r r g g g r r . *',
      ' . . r r r r r r . .',
      '. . . . r @ r . . . .',
      ' . . . . r r . . . .'
    ] },
    { name: 'INVADER', colours: 'gco', rows: [
      '. . y . . . . . y . .',
      ' . . y . . . . y . .',
      '. . * * * * * * * . .',
      ' . * * @ * * @ * * .',
      '* * * * * * * * * * *',
      ' * . * * * * * * . *',
      'p . p . . . . . p . p',
      ' . . p p . . p p . .'
    ] },
    { name: 'FROST', colours: 'rycp', rows: [
      '* * * * * * * * * * *',
      ' + * + * + * + * + *',
      '* + * + * + * + * + *',
      ' * * * * * * * * * *',
      '+ * + * + * + * + * +',
      ' * + * + * + * + * +'
    ] },
    { name: 'HOURGLASS', colours: 'ypg', rows: [
      'c c c c c c c c c c c',
      ' . c * * * * * * c .',
      '. . c * * * * * c . .',
      ' . . c o o o o c . .',
      '. . . # o @ o # . . .',
      ' . . c o o o o c . .',
      '. . c * * * * * c . .',
      ' . c * * * * * * c .'
    ] },
    { name: 'FORTRESS', colours: 'ycop', rows: [
      '# y y y y # c c c c #',
      ' # y y y # # c c c #',
      '# o o o # @ # p p p #',
      ' # o o # . . # p p #',
      '. # O # . . . # P # .',
      ' . # . . . . . . # .'
    ] }
  ];

  /* ========================================================== 4. HELPERS */
  function hexRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function rgba(hex, a) { var c = hexRgb(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  // Blend two hex colours; t = 0 gives a, t = 1 gives b.
  function mix(a, b, t) {
    var x = hexRgb(a), y = hexRgb(b);
    var o = [0, 1, 2].map(function (i) { return Math.round(x[i] + (y[i] - x[i]) * t); });
    return 'rgb(' + o[0] + ',' + o[1] + ',' + o[2] + ')';
  }
  function mkCanvas(w, h) {
    var c = root.document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
    return c;
  }
  function disc(g, x, y, r) { g.beginPath(); g.arc(x, y, Math.max(0.1, r), 0, TAU); g.fill(); }
  function ring(g, x, y, r) { g.beginPath(); g.arc(x, y, Math.max(0.1, r), 0, TAU); g.stroke(); }
  function ellipse(g, x, y, rx, ry, rot) { g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, TAU); g.fill(); }
  function starPath(g, x, y, points, outer, inner, rot) {
    g.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var a = (rot || -Math.PI / 2) + i * Math.PI / points, rr = i % 2 ? inner : outer;
      if (i) g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    g.closePath();
  }
  function easeOut(k) { return 1 - (1 - k) * (1 - k); }

  /* ================================================== 5. SPRITE PAINTING */
  // Sprites are painted once at SS x resolution and blitted every frame.
  var SS = 3;              // supersampling so sprites stay crisp on 2-3x screens
  var SPR = R + 5;         // sprite half-size in playfield px (room for shadow + fuse)
  var sprites = null;

  function newSprite(paint) {
    var c = mkCanvas(SPR * 2 * SS, SPR * 2 * SS);
    var g = c.getContext('2d');
    g.scale(SS, SS); g.translate(SPR, SPR);
    paint(g);
    return c;
  }
  function paintShadow(g) {
    var sh = g.createRadialGradient(0, 3, R * 0.4, 0, 3, R + 3);
    sh.addColorStop(0, 'rgba(0,0,0,0.42)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = sh; disc(g, 0, 3, R + 3);
  }
  // Glossy sphere: tinted body, dark rim, bounce light, specular highlight.
  function paintBubble(g, hex, matte) {
    paintShadow(g);
    var b = g.createRadialGradient(-R * 0.35, -R * 0.4, R * 0.08, 0, 0, R);
    b.addColorStop(0, mix(hex, '#ffffff', matte ? 0.25 : 0.6));
    b.addColorStop(0.42, hex);
    b.addColorStop(1, mix(hex, '#000000', 0.55));
    g.fillStyle = b; disc(g, 0, 0, R - 1);
    g.lineWidth = 1.4; g.strokeStyle = mix(hex, '#000000', 0.62); ring(g, 0, 0, R - 1);
    g.lineWidth = 1.6; g.strokeStyle = rgba('#ffffff', matte ? 0.12 : 0.28);
    g.beginPath(); g.arc(0, 0, R - 3.6, 0.25, 1.9); g.stroke();
    if (matte) return;
    g.fillStyle = 'rgba(255,255,255,0.5)'; ellipse(g, -R * 0.3, -R * 0.44, R * 0.4, R * 0.2, -0.55);
    g.fillStyle = 'rgba(255,255,255,0.92)'; disc(g, -R * 0.46, -R * 0.5, R * 0.1);
  }
  // Small dark symbol with a light edge so it reads on every hue.
  function paintSymbol(g, sym) {
    var k = R * 0.4, y0 = R * 0.06;
    g.save();
    g.translate(0, y0);
    g.fillStyle = 'rgba(24,8,40,0.55)';
    g.strokeStyle = 'rgba(255,255,255,0.55)';
    g.lineWidth = 1;
    g.lineJoin = 'round';
    g.beginPath();
    if (sym === 'heart') {
      g.moveTo(0, k * 0.95);
      g.bezierCurveTo(-k * 1.35, -k * 0.05, -k * 0.65, -k * 1.15, 0, -k * 0.42);
      g.bezierCurveTo(k * 0.65, -k * 1.15, k * 1.35, -k * 0.05, 0, k * 0.95);
    } else if (sym === 'star') {
      starPath(g, 0, 0, 5, k * 1.05, k * 0.45);
    } else if (sym === 'triangle') {
      g.moveTo(0, -k); g.lineTo(k * 0.98, k * 0.72); g.lineTo(-k * 0.98, k * 0.72);
    } else if (sym === 'diamond') {
      g.moveTo(0, -k * 1.05); g.lineTo(k * 0.72, 0); g.lineTo(0, k * 1.05); g.lineTo(-k * 0.72, 0);
    } else if (sym === 'ring') {
      g.arc(0, 0, k * 0.9, 0, TAU); g.arc(0, 0, k * 0.42, 0, TAU, true);
    } else if (sym === 'square') {
      U.roundRect(g, -k * 0.72, -k * 0.72, k * 1.44, k * 1.44, k * 0.25);
    }
    g.closePath();
    g.fill(); g.stroke();
    g.restore();
  }
  // Cosmetic: a small embossed ₿ on every colour orb so the board reads as coloured bitcoin bubbles.
  function paintBtcMark(g, hex) {
    var c = hexRgb(hex), light = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) > 150;
    U.btc(g, R * 0.44, -R * 0.4, R * 0.34, { coin: false, ink: light ? '#2a0f3c' : '#ffffff', alpha: light ? 0.4 : 0.48 });
  }
  function paintStone(g) {
    paintBubble(g, '#8a8499', true);
    var vr = U.rng(7);                        // fixed seed: same granite every run
    for (var i = 0; i < 46; i++) {
      var a = vr() * TAU, m = Math.sqrt(vr()) * (R - 4);
      g.fillStyle = vr() < 0.5 ? 'rgba(40,34,52,0.35)' : 'rgba(230,225,240,0.28)';
      disc(g, Math.cos(a) * m, Math.sin(a) * m, 0.6 + vr() * 1.3);
    }
    g.strokeStyle = 'rgba(30,24,40,0.75)'; g.lineWidth = 1.3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-R * 0.55, -R * 0.2); g.lineTo(-R * 0.15, R * 0.05); g.lineTo(-R * 0.2, R * 0.45); g.stroke();
    g.beginPath(); g.moveTo(-R * 0.15, R * 0.05); g.lineTo(R * 0.35, -R * 0.1); g.lineTo(R * 0.55, R * 0.25); g.stroke();
    // chiselled bevel
    g.strokeStyle = 'rgba(255,255,255,0.3)'; g.lineWidth = 1.5;
    g.beginPath(); g.arc(0, 0, R - 3, Math.PI * 1.05, Math.PI * 1.6); g.stroke();
  }
  function paintBomb(g) {
    paintBubble(g, '#3a3e52');
    // hazard band + burst icon
    g.strokeStyle = 'rgba(255,90,60,0.85)'; g.lineWidth = 2.2; ring(g, 0, R * 0.05, R * 0.66);
    g.fillStyle = '#ffb23d'; starPath(g, 0, R * 0.05, 8, R * 0.44, R * 0.2, 0.2); g.fill();
    g.fillStyle = '#fff3c8'; disc(g, 0, R * 0.05, R * 0.12);
    // fuse cap + fuse
    g.save(); g.translate(R * 0.52, -R * 0.62); g.rotate(0.7);
    g.fillStyle = '#6d7288'; g.fillRect(-R * 0.2, -R * 0.14, R * 0.4, R * 0.28);
    g.restore();
    g.strokeStyle = '#d8c7a0'; g.lineWidth = 1.6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(R * 0.62, -R * 0.74); g.quadraticCurveTo(R * 0.95, -R * 0.95, R * 0.86, -R * 1.08); g.stroke();
  }
  var BOMB_SPARK = { x: R * 0.86, y: -R * 1.08 };
  function paintRainbow(g) {
    paintShadow(g);
    for (var i = 0; i < COLOURS.length; i++) {
      g.fillStyle = COLOURS[i].hex;
      g.beginPath(); g.moveTo(0, 0);
      g.arc(0, 0, R - 1, i * TAU / COLOURS.length, (i + 1) * TAU / COLOURS.length);
      g.closePath(); g.fill();
    }
    var sh = g.createRadialGradient(-R * 0.3, -R * 0.35, R * 0.1, 0, 0, R);
    sh.addColorStop(0, 'rgba(255,255,255,0.55)'); sh.addColorStop(0.5, 'rgba(255,255,255,0.05)'); sh.addColorStop(1, 'rgba(0,0,0,0.45)');
    g.fillStyle = sh; disc(g, 0, 0, R - 1);
    g.strokeStyle = '#ffffff'; g.lineWidth = 1.6; ring(g, 0, 0, R - 1);
    g.fillStyle = '#ffffff'; starPath(g, 0, 0, 4, R * 0.5, R * 0.14, -Math.PI / 2); g.fill();
    g.strokeStyle = 'rgba(40,20,60,0.5)'; g.lineWidth = 1; g.stroke();
  }
  // Translucent shell drawn over a colour sprite.
  function paintIce(g) {
    var b = g.createRadialGradient(-R * 0.3, -R * 0.4, R * 0.1, 0, 0, R);
    b.addColorStop(0, 'rgba(245,252,255,0.75)'); b.addColorStop(0.55, 'rgba(190,235,255,0.42)'); b.addColorStop(1, 'rgba(140,210,255,0.6)');
    g.fillStyle = b; disc(g, 0, 0, R);
    g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 1;
    g.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = i * TAU / 6 + 0.3, x = Math.cos(a) * R * 0.55, y = Math.sin(a) * R * 0.55;
      if (i) g.lineTo(x, y); else g.moveTo(x, y);
    }
    g.closePath(); g.stroke();
    for (var j = 0; j < 6; j++) {
      var b2 = j * TAU / 6 + 0.3;
      g.beginPath(); g.moveTo(Math.cos(b2) * R * 0.55, Math.sin(b2) * R * 0.55);
      g.lineTo(Math.cos(b2 + 0.12) * R * 0.95, Math.sin(b2 + 0.12) * R * 0.95); g.stroke();
    }
    g.strokeStyle = 'rgba(225,250,255,0.95)'; g.lineWidth = 2; ring(g, 0, 0, R - 1);
    g.fillStyle = 'rgba(255,255,255,0.85)'; ellipse(g, -R * 0.35, -R * 0.45, R * 0.28, R * 0.12, -0.6);
  }
  function buildSprites() {
    return {
      colour: COLOURS.map(function (col) {
        return newSprite(function (g) { paintBubble(g, col.hex); paintBtcMark(g, col.hex); paintSymbol(g, col.sym); });
      }),
      stone: newSprite(paintStone),
      bomb: newSprite(paintBomb),
      rainbow: newSprite(paintRainbow),
      ice: newSprite(paintIce),
      petrified: newSprite(function (g) { paintBubble(g, '#5d5870', true); })
    };
  }
  function spriteSet() { if (!sprites) sprites = buildSprites(); return sprites; }
  function blit(ctx, spr, x, y, scale, rot) {
    var s = SPR * (scale == null ? 1 : scale);
    if (rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.drawImage(spr, -s, -s, s * 2, s * 2);
      ctx.restore();
    } else ctx.drawImage(spr, x - s, y - s, s * 2, s * 2);
  }
  // Draw a board cell or queue item: { kind: colour|stone|bomb|rainbow, colour, ice }.
  function drawItem(ctx, item, x, y, scale, t, rot) {
    var sp = spriteSet();
    if (item.kind === 'colour') {
      blit(ctx, sp.colour[item.colour], x, y, scale, rot);
      if (item.ice) blit(ctx, sp.ice, x, y, scale, rot);
    } else if (item.kind === 'stone') blit(ctx, sp.stone, x, y, scale, rot);
    else if (item.kind === 'rainbow') blit(ctx, sp.rainbow, x, y, scale, (t || 0) * 1.6);
    else if (item.kind === 'bomb') {
      blit(ctx, sp.bomb, x, y, scale, rot);
      if (t != null) drawSpark(ctx, x + BOMB_SPARK.x * (scale || 1), y + BOMB_SPARK.y * (scale || 1), t, scale || 1);
    }
  }
  function drawSpark(ctx, x, y, t, s) {
    var f = 0.7 + 0.3 * Math.sin(t * 31) * Math.sin(t * 17);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,170,60,' + (0.35 * f) + ')'; disc(ctx, x, y, 5 * s * f);
    ctx.fillStyle = 'rgba(255,240,180,' + (0.9 * f) + ')'; disc(ctx, x, y, 1.8 * s);
    ctx.restore();
  }

  /* ============================================================ 6. MUSIC */
  // Bubbly C major pentatonic: marimba + bell + soft shaker. Each colour is a
  // scale degree, so every pop plays the note of the colour you matched.
  function song() {
    return {
      bpm: 100, key: 60, scale: 'pentatonic', chords: [0, 3, 1, 4], seed: 16, swing: 0.1,
      tracks: [
        { name: 'mallet', inst: 'marimba', layer: 0, gain: 0.42, chord: true, pattern: '0 . 2 . . 4 . 2 . 0 . . 2 . . .' },
        { name: 'bell', inst: 'bell', layer: 0.08, gain: 0.26, chord: true, octave: 1, rate: 4,
          fn: function (i) { return i.rng() < 0.45 ? { deg: [0, 2, 4, 5][Math.floor(i.rng() * 4)], vel: 0.55 } : null; } },
        { name: 'shaker', inst: 'shaker', layer: 0.18, gain: 0.38, pattern: 'x.xxx.xxx.xxx.xX' },
        { name: 'bass', inst: 'sub', layer: 0.3, gain: 0.5, chord: true, octave: -2, pattern: '0 . . . . . 0 . . . 2 . . . . .' },
        { name: 'kick', inst: 'kick', layer: 0.45, gain: 0.5, pattern: 'x.......x.....x.' },
        { name: 'pad', inst: 'pad', layer: 0.58, gain: 0.3, chord: true, octave: -1,
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        // danger layer: comes in as the cluster creeps towards the line
        { name: 'tension', inst: 'arp', layer: 0.8, gain: 0.26, chord: true, octave: 1, params: { cutoff: 1500 },
          fn: function (i) { return [0, 1, 2, 1][i.step % 4]; } },
        { name: 'hat', inst: 'hat', layer: 0.8, gain: 0.3, pattern: '..x...x...x...xx' }
      ]
    };
  }

  /* =========================================================== 7. GAME */
  function create(api) {
    var rng = api.rng;

    // ---- state -------------------------------------------------------
    var grid = [];          // grid[r][c] = cell object or null
    var parity = 0;         // which rows are shifted right by R (flips on ceiling drop)
    var gridVersion = 0;    // bumps whenever the grid changes (aim trace cache)
    var level = 0, boardName = '', boardColours = [];
    var queue = [];         // [current, next, after]
    var aim = -Math.PI / 2, lastMoved = api.pointer().moved;
    var shot = null;
    var misses = 0, missLimit = 6, combo = 0, bestCombo = 0;
    var shotsTotal = 0, levelShots = 0;
    var over = false, overT = 0, clearT = 0, clearBonus = 0, t = 0;
    var bannerT = 0, ceilAnim = 0, plateFlash = 0, fireworkT = 0;
    var danger = false;
    var seen = {};          // specials this run has already been told about
    var captions = [];      // queued "NEW: X" captions { kind, t }
    var falling = [], pops = [], droplets = [];
    var traceCache = { key: '', result: null };

    // ---- grid helpers ------------------------------------------------
    function shifted(r) { return (r + parity) % 2 === 1; }
    function cols(r) { return shifted(r) ? COLS - 1 : COLS; }
    function cx(r, c) { return LEFT + R + c * D + (shifted(r) ? R : 0); }
    function cy(r) { return TOP + R + r * ROWH; }
    function inside(r, c) { return r >= 0 && r < grid.length && c >= 0 && c < cols(r); }
    function get(r, c) { return inside(r, c) ? grid[r][c] : null; }
    function key(r, c) { return r + ',' + c; }
    function emptyRow(r) { var a = []; for (var c = 0; c < cols(r); c++) a.push(null); return a; }
    function ensureRows(n) { while (grid.length < n) grid.push(emptyRow(grid.length)); }
    function neighbours(r, c) {
      var dcs = shifted(r) ? [0, 1] : [-1, 0];
      var out = [[r, c - 1], [r, c + 1], [r - 1, c + dcs[0]], [r - 1, c + dcs[1]], [r + 1, c + dcs[0]], [r + 1, c + dcs[1]]];
      return out.filter(function (p) { return p[0] >= 0 && p[1] >= 0 && p[1] < cols(p[0]); });
    }
    function eachCell(fn) {
      for (var r = 0; r < grid.length; r++) for (var c = 0; c < cols(r); c++) if (grid[r][c]) fn(grid[r][c], r, c);
    }
    function lowestRow() {
      for (var r = grid.length - 1; r >= 0; r--) {
        for (var c = 0; c < grid[r].length; c++) if (grid[r][c]) return r;
      }
      return -1;
    }
    function census() {
      var s = { total: 0, colour: 0, bomb: 0, stone: 0, ice: 0 };
      eachCell(function (cell) {
        s.total++;
        if (cell.kind === 'colour') { s.colour++; if (cell.ice) s.ice++; } else s[cell.kind]++;
      });
      return s;
    }
    // Colours still on the board (ice counts: you can build a group beside it).
    function present() {
      var set = {}, list = [];
      eachCell(function (cell) { if (cell.kind === 'colour') set[cell.colour] = true; });
      for (var i = 0; i < COLOURS.length; i++) if (set[i]) list.push(i);
      return list.length ? list : boardColours.slice();
    }

    // ---- cells -------------------------------------------------------
    function colourCell(colour, ice) { return { kind: 'colour', colour: colour, ice: !!ice, jig: 0, jx: 0, jy: 0 }; }
    function plainCell(kind) { return { kind: kind, jig: 0, jx: 0, jy: 0 }; }
    function matchable(cell, colour) { return !!cell && cell.kind === 'colour' && !cell.ice && cell.colour === colour; }

    /* ---------------------------------------------------- board building */
    function designFor(n) {
      if (n <= BOARDS.length) {
        var b = BOARDS[n - 1];
        return { name: b.name, colours: b.colours, rows: b.rows, map: null };
      }
      return mixedDesign(n);
    }
    // After the designed run: top rows from one design, the rest from
    // another (sometimes mirrored), every colour letter re-dealt.
    function mixedDesign(n) {
      var a = BOARDS[Math.floor(rng() * BOARDS.length)];
      var b = BOARDS[Math.floor(rng() * BOARDS.length)];
      var split = 2 + Math.floor(rng() * 3);
      var mirror = rng() < 0.5;
      var rows = [];
      for (var r = 0; r < Math.max(a.rows.length, b.rows.length); r++) {
        var src = r < split ? a.rows[r] : b.rows[r];
        if (!src) src = a.rows[r] || b.rows[r];
        var chars = src.replace(/ /g, '').split('');
        if (mirror && r >= split) chars.reverse();
        rows.push(chars.join(''));
      }
      var nCol = Math.min(6, 4 + Math.floor((n - BOARDS.length) / 3));
      var deal = [0, 1, 2, 3, 4, 5];
      for (var i = deal.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)), tmp = deal[i]; deal[i] = deal[j]; deal[j] = tmp; }
      deal = deal.slice(0, nCol);
      var colours = deal.map(function (k) { return COLOURS[k].key; }).join('');
      var map = {};
      COLOURS.forEach(function (c, k) { map[c.key] = deal[k % nCol]; });
      return { name: a.name === b.name ? a.name + ' REMIX' : a.name + ' / ' + b.name, colours: colours, rows: rows, map: map, sprinkle: true };
    }
    // Clumpy random colour: often copies the neighbour to the left or above.
    function clumpyColour(r, c) {
      var left = get(r, c - 1), up = neighbours(r, c).filter(function (p) { return p[0] === r - 1; })[0];
      var above = up ? get(up[0], up[1]) : null;
      if (left && left.kind === 'colour' && boardColours.indexOf(left.colour) >= 0 && rng() < 0.35) return left.colour;
      if (above && above.kind === 'colour' && boardColours.indexOf(above.colour) >= 0 && rng() < 0.3) return above.colour;
      return boardColours[Math.floor(rng() * boardColours.length)];
    }
    function cellFromChar(ch, r, c, map) {
      if (ch === '.') return null;
      if (ch === '#') return plainCell('stone');
      if (ch === '@') return plainCell('bomb');
      if (ch === '*') return colourCell(clumpyColour(r, c), false);
      if (ch === '+') return colourCell(clumpyColour(r, c), true);
      var lower = ch.toLowerCase();
      if (COLOUR_INDEX[lower] == null) return null;
      var colour = map ? map[lower] : COLOUR_INDEX[lower];
      return colourCell(colour, ch !== lower);
    }
    // Later mixed boards: a few specials scattered over colour cells.
    function sprinkleSpecials() {
      var caps = { stone: 4, bomb: 3 };
      eachCell(function (cell, r, c) {
        if (cell.kind !== 'colour') return;
        var roll = rng();
        if (roll < 0.035 && caps.stone > 0) { caps.stone--; grid[r][c] = plainCell('stone'); }
        else if (roll < 0.055 && caps.bomb > 0) { caps.bomb--; grid[r][c] = plainCell('bomb'); }
        else if (roll < 0.11) cell.ice = true;
      });
    }
    function buildBoard(design) {
      grid = []; parity = 0;
      boardColours = design.colours.split('').map(function (k) { return design.map ? design.map[k] : COLOUR_INDEX[k]; });
      boardColours = boardColours.filter(function (v, i) { return boardColours.indexOf(v) === i; });
      design.rows.forEach(function (text, r) {
        var chars = text.replace(/ /g, '').split('');
        grid.push(emptyRow(r));
        for (var c = 0; c < cols(r); c++) grid[r][c] = cellFromChar(chars[c] || '.', r, c, design.map);
      });
      ensureRows(MAX_ROWS + 1);
      if (design.sprinkle) sprinkleSpecials();
      // anything a mix left floating is removed quietly
      var anchored = anchoredSet();
      eachCell(function (cell, r, c) { if (!anchored[key(r, c)]) grid[r][c] = null; });
      gridVersion++;
    }
    function startLevel(n) {
      level = n;
      var design = designFor(n);
      boardName = design.name;
      buildBoard(design);
      misses = 0; combo = 0; levelShots = 0;
      missLimit = Math.max(3, 6 - Math.floor((n - 1) / 4));
      bannerT = BANNER_SECS;
      queue = [];
      while (queue.length < 3) queue.push(pick());
      // first rainbow level: guarantee one in the queue so it gets shown
      var hasRainbow = queue.some(function (q) { return q.kind === 'rainbow'; });
      if (n >= SPECIALS.rainbow.intro && !seen.rainbow && !hasRainbow) queue[1] = { kind: 'rainbow' };
      announceSpecials();
      syncMusic();
    }

    /* ------------------------------------------------------------- queue */
    function rainbowAllowed() { return level >= SPECIALS.rainbow.intro; }
    function pick() {
      var hasRainbow = queue.some(function (q) { return q && q.kind === 'rainbow'; });
      if (rainbowAllowed() && !hasRainbow && rng() < 0.08) return { kind: 'rainbow' };
      var p = present();
      return { kind: 'colour', colour: p[Math.floor(rng() * p.length)] };
    }
    // Colours that left the board are re-dealt so every shot is useful.
    function refreshQueue() {
      var p = present();
      for (var i = 0; i < queue.length; i++) {
        if (queue[i].kind === 'colour' && p.indexOf(queue[i].colour) < 0) queue[i] = { kind: 'colour', colour: p[Math.floor(rng() * p.length)] };
      }
    }
    function swapQueue() {
      if (shot || over) return;
      var tmp = queue[0]; queue[0] = queue[1]; queue[1] = tmp;
      api.audio.tone(420, 0.06, { type: 'triangle', vol: 0.1, slide: 1.4 });
    }
    function describe(item) { return item.kind === 'colour' ? COLOURS[item.colour].name.toLowerCase() : item.kind; }

    /* ------------------------------------------------------- specials intro */
    function announce(kind) {
      if (seen[kind]) return;
      seen[kind] = true;
      captions.push({ kind: kind, t: CAPTION_SECS });
    }
    function announceSpecials() {
      var s = census();
      if (s.bomb) announce('bomb');
      if (s.stone) announce('stone');
      if (s.ice) announce('ice');
      queue.forEach(function (q) { if (q.kind === 'rainbow') announce('rainbow'); });
    }

    /* ------------------------------------------------------------- music */
    var lastI = -1;
    // Danger = how far the lowest bubble has crept towards the line.
    function syncMusic() {
      var m = M();
      if (!m) return;
      var d = U.clamp((lowestRow() - 3) / (MAX_ROWS - 5), 0, 1);
      var v = Math.round(U.clamp(d + (level - 1) * 0.03, 0, 1) * 20) / 20;
      if (v !== lastI) { lastI = v; m.setIntensity(v); }
    }
    function musicPop(colour, size) {
      var m = M();
      if (m) {
        m.note('marimba', colour, { quantize: '16', octave: 1, gain: 0.85 });
        if (size > 4) m.note('bell', colour, { quantize: '16', octave: 2, gain: 0.35 });
        if (combo >= 2) m.note('bell', colour + Math.min(combo, 6), { quantize: '16', octave: 1, gain: 0.3 });
      } else api.audio.arp([523, 659, 784].slice(0, Math.min(3, size - 1)), 0.04, { type: 'triangle', vol: 0.16 });
    }
    // One bell per orphan, a 16th apart, always climbing.
    function musicCascade(cols) {
      var m = M();
      if (m) {
        var t0 = m.nextGrid('16'), sps = 15 / Math.max(40, m.tempo() || 100), deg = -1;
        cols.sort(function (a, b) { return a - b; }).forEach(function (c, i) {
          deg = Math.max(deg + 1, c);
          m.note('bell', deg, { at: t0 + (i + 1) * sps, octave: 1, gain: 0.45 });
        });
      } else api.audio.arp([392, 523, 659, 784, 1047].slice(0, Math.min(5, cols.length + 1)), 0.05, { type: 'square', vol: 0.16 });
    }
    function musicRainbow() {
      var m = M();
      if (!m) { api.audio.arp([523, 659, 784, 1047], 0.04, { type: 'triangle', vol: 0.14 }); return; }
      var t0 = m.nextGrid('16'), sps = 15 / Math.max(40, m.tempo() || 100);
      for (var i = 0; i < 6; i++) m.note('bell', i, { at: t0 + i * sps * 0.5, octave: 1, gain: 0.35 });
    }
    function musicBomb() {
      api.audio.noise(0.45, { vol: 0.35, cutoff: 900 });
      api.audio.tone(70, 0.4, { type: 'sine', vol: 0.3, slide: 0.5 });
      var m = M();
      if (m) { m.duck(0.35, 0.5); m.note('sub', 0, { octave: -2, dur: 0.3, gain: 0.7 }); m.note('kick', 0, { gain: 0.8 }); }
    }
    function musicIce(colour) {
      api.audio.noise(0.08, { vol: 0.12, cutoff: 6000 });
      var m = M();
      if (m) m.note('pluck', colour, { quantize: '16', octave: 2, gain: 0.35 });
      else api.audio.tone(1800, 0.05, { type: 'triangle', vol: 0.08 });
    }
    function musicClear() {
      var m = M();
      if (!m) { api.audio.arp([523, 659, 784, 1047, 1319], 0.08, { type: 'triangle', vol: 0.18 }); return; }
      m.stinger([{ deg: 0 }, { deg: 2, at: 2 }, { deg: 4, at: 4 }, { deg: 5, at: 6, steps: 8 }], { inst: 'bell', quantize: 'beat', octave: 1, gain: 0.55 });
      var nextKey = 60 + (level * 5) % 12;
      m.setKey(nextKey > 65 ? nextKey - 12 : nextKey);
    }
    if (M()) M().play(song(), { fade: 1.2, intensity: 0 });

    /* ------------------------------------------------------------ aiming */
    function touching(x, y) {
      var r0 = Math.round((y - TOP - R) / ROWH);
      for (var r = Math.max(0, r0 - 1); r <= Math.min(grid.length - 1, r0 + 1); r++) {
        for (var c = 0; c < cols(r); c++) {
          if (grid[r][c] && Math.hypot(cx(r, c) - x, cy(r) - y) < HIT_DIST) return true;
        }
      }
      return false;
    }
    // Nearest empty cell that is attached to something (or on the top row).
    function snap(x, y) {
      var rMid = U.clamp(Math.round((y - TOP - R) / ROWH), 0, grid.length - 1);
      var best = null, bd = 1e9;
      function scan(r0, r1) {
        for (var rr = Math.max(0, r0); rr <= Math.min(grid.length - 1, r1); rr++) {
          for (var c = 0; c < cols(rr); c++) {
            if (grid[rr][c]) continue;
            var ok = rr === 0 || neighbours(rr, c).some(function (p) { return !!get(p[0], p[1]); });
            if (!ok) continue;
            var d = Math.hypot(cx(rr, c) - x, cy(rr) - y);
            if (d < bd) { bd = d; best = [rr, c]; }
          }
        }
      }
      scan(rMid - 1, rMid + 1);
      if (!best) scan(0, grid.length - 1);
      return best;
    }
    // Follow a shot from the launcher: bounces off the side walls and stops
    // on contact. The live shot flies exactly this path, so the preview and
    // the landing always agree.
    function trace(angle) {
      var x = SX, y = SY, vx = Math.cos(angle), vy = Math.sin(angle), step = 4, len = 0;
      var pts = [{ x: x, y: y }];
      while (len < 4000) {
        x += vx * step; y += vy * step; len += step;
        if (x < XMIN || x > XMAX) {
          var wall = x < XMIN ? XMIN : XMAX, back = Math.abs(x - wall) / Math.abs(vx * step);
          pts.push({ x: wall, y: y - vy * step * back });
          x = wall - (x - wall); vx = -vx;
        }
        if (y <= TOP + R) { y = TOP + R; break; }
        if (touching(x, y)) break;
      }
      var cell = snap(x, y);
      if (cell) pts.push({ x: cx(cell[0], cell[1]), y: cy(cell[0]) });
      else pts.push({ x: x, y: y });
      return { pts: pts, cell: cell };
    }
    function aimTrace() {
      var k = aim.toFixed(4) + '|' + gridVersion + '|' + parity;
      if (traceCache.key !== k) { traceCache.key = k; traceCache.result = trace(aim); }
      return traceCache.result;
    }
    function fire() {
      if (shot || over || clearT > 0 || ceilAnim > 0) return;
      var tr = aimTrace();
      shot = { pts: tr.pts, cell: tr.cell, seg: 0, along: 0, x: SX, y: SY, item: queue[0] };
      queue.shift();
      queue.push(pick());
      queue.forEach(function (q) { if (q.kind === 'rainbow') announce('rainbow'); });
      api.audio.tone(600, 0.05, { type: 'triangle', vol: 0.12, slide: 1.5 });
    }
    function updateShot(dt) {
      var left = SPEED * dt;
      while (shot && left > 0) {
        var a = shot.pts[shot.seg], b = shot.pts[shot.seg + 1];
        if (!b) { landShot(); return; }
        var segLen = Math.hypot(b.x - a.x, b.y - a.y), room = segLen - shot.along;
        if (left < room) {
          shot.along += left; left = 0;
          var k = segLen ? shot.along / segLen : 1;
          shot.x = a.x + (b.x - a.x) * k; shot.y = a.y + (b.y - a.y) * k;
        } else {
          left -= room; shot.seg++; shot.along = 0; shot.x = b.x; shot.y = b.y;
          if (shot.seg < shot.pts.length - 1 && (b.x === XMIN || b.x === XMAX)) api.audio.tone(900, 0.03, { type: 'triangle', vol: 0.06 });
        }
      }
      if (shot) api.fx.trail(shot.x, shot.y, shot.item.kind === 'colour' ? PALETTE[shot.item.colour] : '#ffffff', 0, 30);
    }
    function landShot() {
      var s = shot;
      shot = null;
      if (!s.cell || get(s.cell[0], s.cell[1])) {
        // nowhere to stick (should not happen): let it fall away
        spawnFalling(s.item, s.x, s.y);
        return;
      }
      settle(s.cell[0], s.cell[1], s.item);
    }

    /* ----------------------------------------------------- landing rules */
    // Flood from (r,c) through un-iced bubbles of `colour`; the start cell is
    // always accepted (it may be a rainbow standing in for the colour).
    function flood(r, c, colour) {
      var seenK = {}, group = [], stack = [[r, c]];
      while (stack.length) {
        var p = stack.pop(), k = key(p[0], p[1]);
        if (seenK[k]) continue;
        seenK[k] = true;
        if (!(p[0] === r && p[1] === c) && !matchable(get(p[0], p[1]), colour)) continue;
        group.push(p);
        neighbours(p[0], p[1]).forEach(function (n) { stack.push(n); });
      }
      return group;
    }
    // RAINBOW: joins every touching colour that makes a group of 3+.
    function rainbowGroups(r, c) {
      var byColour = {}, out = [], added = {};
      neighbours(r, c).forEach(function (n) {
        var cell = get(n[0], n[1]);
        if (cell && cell.kind === 'colour' && !cell.ice) byColour[cell.colour] = true;
      });
      Object.keys(byColour).forEach(function (k) {
        var g = flood(r, c, +k);
        if (g.length < 3) return;
        g.forEach(function (p) { var kk = key(p[0], p[1]); if (!added[kk]) { added[kk] = true; out.push(p); } });
      });
      return out;
    }
    // A rainbow that matched nothing settles as the commonest touching colour.
    function rainbowFallback(r, c) {
      var count = {}, best = -1, bestN = 0;
      neighbours(r, c).forEach(function (n) {
        var cell = get(n[0], n[1]);
        if (cell && cell.kind === 'colour') {
          count[cell.colour] = (count[cell.colour] || 0) + 1;
          if (count[cell.colour] > bestN) { bestN = count[cell.colour]; best = cell.colour; }
        }
      });
      if (best >= 0) return best;
      var p = present();
      return p[Math.floor(rng() * p.length)];
    }
    // BOMBS: blast everything within BOMB_RADIUS; bombs caught in it chain.
    function detonate(bombs, doomed) {
      var blasted = 0, booms = [];
      while (bombs.length) {
        var b = bombs.shift(), bk = key(b[0], b[1]);
        if (doomed[bk] && doomed[bk].why !== 'match') continue;
        doomed[bk] = { r: b[0], c: b[1], why: 'bomb' };
        booms.push(b);
        var bx = cx(b[0], b[1]), by = cy(b[0]);
        eachCell(function (cell, r, c) {
          var k = key(r, c);
          if (doomed[k] || Math.hypot(cx(r, c) - bx, cy(r) - by) > BOMB_RADIUS) return;
          if (cell.kind === 'bomb') { bombs.push([r, c]); return; }
          doomed[k] = { r: r, c: c, why: 'blast' };
          blasted++;
        });
      }
      return { blasted: blasted, booms: booms };
    }
    function anchoredSet() {
      var anchored = {}, st = [];
      for (var c0 = 0; c0 < cols(0); c0++) if (grid[0] && grid[0][c0]) st.push([0, c0]);
      while (st.length) {
        var q = st.pop(), k = key(q[0], q[1]);
        if (anchored[k] || !get(q[0], q[1])) continue;
        anchored[k] = true;
        neighbours(q[0], q[1]).forEach(function (n) { st.push(n); });
      }
      return anchored;
    }
    // Everything no longer hanging from the ceiling falls (with physics).
    function dropOrphans(all) {
      var anchored = all ? {} : anchoredSet(), dropped = 0, dropCols = [];
      eachCell(function (cell, r, c) {
        if (anchored[key(r, c)]) return;
        spawnFalling(cell, cx(r, c), cy(r));
        if (cell.kind === 'colour' && dropCols.length < 8) dropCols.push(cell.colour);
        grid[r][c] = null;
        dropped++;
      });
      return { n: dropped, cols: dropCols };
    }
    function jiggleAround(r, c) {
      neighbours(r, c).forEach(function (n) {
        var cell = get(n[0], n[1]);
        if (!cell) return;
        var dx = cx(n[0], n[1]) - cx(r, c), dy = cy(n[0]) - cy(r), l = Math.hypot(dx, dy) || 1;
        cell.jig = 0.3; cell.jx = dx / l; cell.jy = dy / l;
      });
    }

    // The heart of the game: a shot has come to rest at (r, c).
    function settle(r, c, item) {
      levelShots++; shotsTotal++;
      grid[r][c] = item.kind === 'rainbow' ? plainCell('rainbow') : colourCell(item.colour, false);
      jiggleAround(r, c);

      // 1. matching group (3+ of a colour, or rainbow wildcard groups)
      var group = item.kind === 'rainbow' ? rainbowGroups(r, c) : flood(r, c, item.colour);
      if (group.length < 3) group = [];
      var popColour = item.kind === 'colour' ? item.colour : groupColour(group);
      if (item.kind === 'rainbow') {
        if (group.length) musicRainbow();
        else grid[r][c] = colourCell(rainbowFallback(r, c), false);
      }
      var doomed = {};
      group.forEach(function (p) { doomed[key(p[0], p[1])] = { r: p[0], c: p[1], why: 'match' }; });

      // 2. bombs touched by the shot or beside a popped bubble go off
      var bombs = [];
      function bombsBeside(p) {
        neighbours(p[0], p[1]).forEach(function (n) { var cell = get(n[0], n[1]); if (cell && cell.kind === 'bomb') bombs.push(n); });
      }
      bombsBeside([r, c]);
      group.forEach(bombsBeside);
      var blast = detonate(bombs, doomed);

      // 3. ice beside a match cracks (bomb blasts shatter it outright)
      var cracked = 0;
      group.forEach(function (p) {
        neighbours(p[0], p[1]).forEach(function (n) {
          var cell = get(n[0], n[1]);
          if (cell && cell.kind === 'colour' && cell.ice && !doomed[key(n[0], n[1])]) {
            cell.ice = false; cracked++;
            crackFx(cx(n[0], n[1]), cy(n[0]));
            if (cracked <= 2) musicIce(cell.colour);
          }
        });
      });

      // 4. remove everything doomed, popping outwards from the impact
      var ix = cx(r, c), iy = cy(r), removed = 0;
      Object.keys(doomed).forEach(function (k) {
        var d = doomed[k], cell = grid[d.r][d.c];
        if (!cell) return;
        var px = cx(d.r, d.c), py = cy(d.r);
        spawnPop(cell, px, py, Math.hypot(px - ix, py - iy) / D * 0.035);
        grid[d.r][d.c] = null;
        removed++;
      });
      blast.booms.forEach(function (b) { boomFx(cx(b[0], b[1]), cy(b[0])); });
      if (blast.booms.length) musicBomb();

      // 5. score the shot
      var popped = removed > 0;
      if (popped) { combo++; bestCombo = Math.max(bestCombo, combo); misses = 0; } else combo = 0;
      var mult = Math.min(5, Math.max(1, combo));
      if (group.length) {
        api.addScore((group.length * 10 + Math.max(0, group.length - 3) * 10) * mult);
        musicPop(popColour, group.length);
      }
      if (blast.blasted) api.addScore(blast.blasted * 15 * mult);
      if (cracked) api.addScore(cracked * 5);
      if (combo >= 2) api.fx.text(ix, iy - 26, 'COMBO x' + mult, '#ff8fd8', 11);

      // 6. orphans fall
      var drop = dropOrphans(false);
      if (drop.n) {
        var dp = 20 * drop.n * Math.min(8, drop.n);
        api.addScore(dp);
        api.fx.text(W / 2, Math.min(cy(r) + 34, SY - 90), (drop.n >= 6 ? 'FEES CLEARED x' : 'DROP x') + drop.n + '  +' + dp, '#ffd23f', 13);
        musicCascade(drop.cols);
      }

      // 7. misses push the ceiling
      if (!popped) {
        misses++;
        api.audio.tone(260, 0.05, { type: 'square', vol: 0.1 });
        if (misses >= missLimit) { misses = 0; pushCeiling(); }
      }

      gridVersion++;
      afterBoardChange();
    }
    // First real colour in a group (a rainbow group's note).
    function groupColour(group) {
      for (var i = 0; i < group.length; i++) {
        var p = group[i];
        var cell = get(p[0], p[1]);
        if (cell && cell.kind === 'colour') return cell.colour;
      }
      return 0;
    }
    // Clear check, queue refresh, danger + game-over checks.
    function afterBoardChange() {
      if (census().colour === 0) { boardCleared(); return; }
      refreshQueue();
      syncMusic();
      var low = lowestRow();
      var nowDanger = low >= DANGER_ROW;
      if (nowDanger && !danger) api.audio.tone(330, 0.25, { type: 'sawtooth', vol: 0.12, slide: 0.7 });
      danger = nowDanger;
      if (low >= DEAD_ROW) {
        over = true;
        api.shake(12);
        api.audio.tone(140, 0.6, { type: 'sawtooth', vol: 0.28, slide: 0.4 });
      }
    }
    function boardCleared() {
      // leftover stones and bombs tumble away as a bonus
      var rest = dropOrphans(true);
      if (rest.n) api.addScore(50 * rest.n);
      clearBonus = 1000 * level;
      api.addScore(clearBonus);
      clearT = CLEAR_SECS;
      fireworkT = 0;
      danger = false;
      api.shake(6);
      for (var i = 0; i < 5; i++) api.fx.burst(LEFT + Math.random() * COLS * D, TOP + 40 + Math.random() * 220, PALETTE[i % PALETTE.length], 18, 200, 0.8);
      musicClear();
      syncMusic();
    }

    /* ----------------------------------------------------------- ceiling */
    function rowCell(r, c) {
      var p = present(), roll = rng();
      if (level >= SPECIALS.stone.intro && roll < 0.04) return plainCell('stone');
      if (level >= SPECIALS.bomb.intro && roll < 0.065) return plainCell('bomb');
      var left = c > 0 ? grid[r][c - 1] : null;
      var colour = left && left.kind === 'colour' && p.indexOf(left.colour) >= 0 && rng() < 0.4 ? left.colour : p[Math.floor(rng() * p.length)];
      return colourCell(colour, level >= SPECIALS.ice.intro && rng() < 0.08);
    }
    function pushCeiling() {
      grid.unshift(null);
      parity ^= 1;
      grid[0] = [];
      for (var c = 0; c < cols(0); c++) grid[0].push(rowCell(0, c));
      // rows keep their own lengths after the parity flip: rebuild widths
      for (var r = 1; r < grid.length; r++) {
        if (!grid[r]) grid[r] = emptyRow(r);
        while (grid[r].length > cols(r)) grid[r].pop();
        while (grid[r].length < cols(r)) grid[r].push(null);
      }
      ensureRows(MAX_ROWS + 1);
      ceilAnim = 1; plateFlash = 1;
      api.shake(5);
      api.audio.tone(90, 0.3, { type: 'square', vol: 0.18 });
      var m = M();
      if (m) { m.duck(0.55, 0.8); m.note('sub', 0, { octave: -2, dur: 0.4, gain: 0.6 }); }
      api.fx.text(W / 2, TOP + 24, 'CEILING DROP', ACCENT, 12);
      eachCell(function (cell) { if (cell.kind === 'bomb') announce('bomb'); if (cell.kind === 'stone') announce('stone'); if (cell.ice) announce('ice'); });
      gridVersion++;
    }

    /* ----------------------------------------------------------- effects */
    function spawnPop(cell, x, y, delay) {
      if (pops.length >= MAX_POPS) pops.shift();
      pops.push({ cell: cell, x: x, y: y, delay: delay, t: 0, burst: false });
    }
    function cellHex(cell) {
      if (cell.kind === 'colour') return PALETTE[cell.colour];
      if (cell.kind === 'stone') return '#b8b2c8';
      if (cell.kind === 'bomb') return '#ff8a3d';
      return '#ffffff';
    }
    function spawnDroplets(x, y, hex, n, speed) {
      for (var i = 0; i < n; i++) {
        if (droplets.length >= MAX_DROPLETS) droplets.shift();
        var a = Math.random() * TAU, s = speed * (0.4 + Math.random() * 0.6);
        droplets.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, life: 0.45 + Math.random() * 0.35, max: 0.8, hex: hex, r: 1.2 + Math.random() * 2 });
      }
    }
    function spawnFalling(cell, x, y) {
      if (falling.length >= MAX_FALLING) {
        var old = falling.shift();
        spawnPop(old.cell, old.x, old.y, 0);
      }
      falling.push({ cell: cell, x: x, y: y, vx: (Math.random() - 0.5) * 110, vy: -40 - Math.random() * 110,
        rot: 0, vr: (Math.random() - 0.5) * 5, bounced: false });
    }
    function crackFx(x, y) {
      spawnDroplets(x, y, '#dff7ff', 8, 150);
      api.fx.text(x, y - 14, 'CRACK', '#bfefff', 8);
    }
    function boomFx(x, y) {
      api.shake(9);
      api.fx.burst(x, y, '#ffb23d', 26, 260, 0.6);
      api.fx.burst(x, y, '#ff4d3d', 14, 160, 0.5);
      if (pops.length < MAX_POPS) pops.push({ boom: true, x: x, y: y, delay: 0, t: 0, burst: true });
    }
    function updateEffects(dt) {
      var i;
      for (i = pops.length - 1; i >= 0; i--) {
        var p = pops[i];
        if (p.delay > 0) { p.delay -= dt; continue; }
        if (!p.burst) {
          p.burst = true;
          var hex = cellHex(p.cell);
          spawnDroplets(p.x, p.y, hex, 7, 170);
          api.fx.burst(p.x, p.y, hex, 4, 120, 0.35);
        }
        p.t += dt;
        if (p.t > (p.boom ? 0.45 : 0.32)) pops.splice(i, 1);
      }
      for (i = droplets.length - 1; i >= 0; i--) {
        var d = droplets[i];
        d.life -= dt;
        if (d.life <= 0) { droplets.splice(i, 1); continue; }
        d.vy += 700 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
      }
      var tapped = false;
      for (i = falling.length - 1; i >= 0; i--) {
        var f = falling[i];
        f.vy += 1500 * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.rot += f.vr * dt;
        if (f.x < XMIN) { f.x = XMIN; f.vx = Math.abs(f.vx) * 0.6; }
        if (f.x > XMAX) { f.x = XMAX; f.vx = -Math.abs(f.vx) * 0.6; }
        if (f.y + R > FLOOR_Y && f.vy > 0) {
          if (!f.bounced) {
            f.bounced = true; f.y = FLOOR_Y - R; f.vy = -f.vy * 0.42; f.vx *= 0.8;
            if (!tapped) { tapped = true; api.audio.tone(f.cell.kind === 'stone' ? 110 : 520 + Math.random() * 200, 0.04, { type: 'triangle', vol: 0.06 }); }
          } else {
            spawnPop(f.cell, f.x, f.y, 0);
            falling.splice(i, 1);
          }
        }
      }
      eachCell(function (cell) { if (cell.jig > 0) cell.jig = Math.max(0, cell.jig - dt); });
    }

    /* ------------------------------------------------------------ start */
    startLevel(1);

    return {
      // Read-only test hook: a fresh snapshot every call.
      debug: function () {
        var s = census();
        return {
          bubbles: s.total, board: level, level: level, name: boardName,
          rows: lowestRow() + 1, shots: shotsTotal, levelShots: levelShots,
          current: describe(queue[0]), next: describe(queue[1]), queue: queue.map(describe),
          specials: { bomb: s.bomb, stone: s.stone, ice: s.ice, rainbowQueued: queue.some(function (q) { return q.kind === 'rainbow'; }) },
          seen: Object.keys(seen), combo: combo, bestCombo: bestCombo, misses: misses, missLimit: missLimit,
          falling: falling.length, flying: !!shot, danger: danger, clearing: clearT > 0, dead: over
        };
      },

      update: function (dt) {
        t += dt;
        var inp = api.input;
        inp.takeSwipes();
        updateEffects(dt);
        if (bannerT > 0) bannerT -= dt;
        if (plateFlash > 0) plateFlash = Math.max(0, plateFlash - dt * 2);
        if (ceilAnim > 0) ceilAnim = Math.max(0, ceilAnim - dt / CEIL_ANIM_SECS);
        if (captions.length && bannerT <= 0.4) { captions[0].t -= dt; if (captions[0].t <= 0) captions.shift(); }
        if (over) { overT += dt; if (overT > 1.4) api.gameOver(); return; }
        if (clearT > 0) {
          clearT -= dt;
          fireworkT -= dt;
          if (fireworkT <= 0) {
            fireworkT = 0.28;
            api.fx.burst(LEFT + 30 + Math.random() * (COLS * D - 60), TOP + 30 + Math.random() * 260, PALETTE[Math.floor(Math.random() * 6)], 22, 220, 0.8);
          }
          if (clearT <= 0) startLevel(level + 1);
          return;
        }
        // aim with the pointer when it moves, or with the keys
        var p = api.pointer();
        if (p.moved !== lastMoved) {
          lastMoved = p.moved;
          if (p.y < SY - 10) aim = Math.atan2(p.y - SY, p.x - SX);
        }
        if (inp.held('left')) aim -= 1.6 * dt;
        if (inp.held('right')) aim += 1.6 * dt;
        aim = U.clamp(aim, -Math.PI + 0.16, -0.16);
        var onQueue = Math.hypot(p.x - NEXT_X, p.y - NEXT_Y) < R + 8;
        if (inp.hit('release') && onQueue) swapQueue();
        else if (inp.hit('release') || inp.hit('a') || inp.hit('up')) fire();
        if (inp.hit('d') || inp.hit('b')) swapQueue();

        if (shot) updateShot(dt);
        var rowsLeft = DEAD_ROW - lowestRow();
        api.setStatus('LV ' + level + ' ' + boardName + '  \u00b7  CEILING IN ' + (missLimit - misses) + '  \u00b7  ROWS LEFT ' + rowsLeft +
          (combo >= 2 ? '  \u00b7  COMBO x' + Math.min(5, combo) : ''));
      },

      render: function (ctx) {
        var sp = spriteSet();
        drawBackground(ctx);
        drawFrame(ctx);

        // --- the board (slides down while the ceiling drops)
        var oy = -ROWH * easeOut(ceilAnim);
        ctx.save();
        ctx.beginPath(); ctx.rect(LEFT - 2, TOP - 1, COLS * D + 4, SY - TOP + 16); ctx.clip();
        for (var r = 0; r < grid.length; r++) {
          for (var c = 0; c < cols(r); c++) {
            var cell = grid[r][c];
            if (!cell) continue;
            var x = cx(r, c), y = cy(r) + oy;
            if (cell.jig > 0) { var k = Math.sin(cell.jig / 0.3 * Math.PI) * 3; x += cell.jx * k; y += cell.jy * k; }
            if (over && r * 0.09 < overT) blit(ctx, sp.petrified, x, y);
            else drawItem(ctx, cell, x, y, 1, t);
          }
        }
        ctx.restore();

        drawPops(ctx);
        drawDangerLine(ctx);
        if (!shot && !over && clearT <= 0) drawAimGuide(ctx);
        drawLauncher(ctx);
        if (shot) drawItem(ctx, shot.item, shot.x, shot.y, 1, t);
        for (var i = 0; i < falling.length; i++) {
          var f = falling[i];
          drawItem(ctx, f.cell, f.x, f.y, 1, t, f.rot);
        }
        drawDroplets(ctx);
        drawHud(ctx);
        drawCaption(ctx);
        drawBanner(ctx);
        if (clearT > 0) drawClear(ctx);
      }
    };

    /* ------------------------------------------------------------ render */
    function drawFrame(ctx) {
      // side walls + floor lip
      ctx.strokeStyle = 'rgba(255,143,216,0.35)'; ctx.lineWidth = 2;
      ctx.strokeRect(LEFT - 3, TOP - 3, COLS * D + 6, SY - TOP + 20);
      // ceiling plate with rivets; flashes when it pushes down
      var pg = ctx.createLinearGradient(0, TOP - 12, 0, TOP);
      pg.addColorStop(0, '#4a3a6e'); pg.addColorStop(1, '#221a38');
      ctx.fillStyle = pg; ctx.fillRect(LEFT - 3, TOP - 12, COLS * D + 6, 10);
      if (plateFlash > 0) { ctx.fillStyle = 'rgba(255,143,216,' + (plateFlash * 0.7) + ')'; ctx.fillRect(LEFT - 3, TOP - 12, COLS * D + 6, 10); }
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      for (var i = 0; i < 12; i++) disc(ctx, LEFT + 6 + i * (COLS * D - 12) / 11, TOP - 7, 1.2);
    }
    function drawDangerLine(ctx) {
      var dl = cy(DEAD_ROW) - R;
      ctx.save();
      var pulse = danger ? 0.55 + 0.45 * Math.sin(t * 9) : 0.5;
      if (danger) {
        var vg = ctx.createLinearGradient(0, dl - 90, 0, dl + 20);
        vg.addColorStop(0, 'rgba(255,40,80,0)'); vg.addColorStop(1, 'rgba(255,40,80,' + (0.3 * pulse) + ')');
        ctx.fillStyle = vg; ctx.fillRect(LEFT, dl - 90, COLS * D, 110);
      }
      ctx.setLineDash([6, 6]); ctx.lineDashOffset = -t * 12;
      ctx.strokeStyle = danger ? 'rgba(255,77,109,' + pulse + ')' : 'rgba(255,77,109,0.45)';
      ctx.lineWidth = danger ? 2.5 : 1.5;
      ctx.beginPath(); ctx.moveTo(LEFT, dl); ctx.lineTo(W - LEFT, dl); ctx.stroke();
      ctx.restore();
      if (danger) {
        ctx.save(); ctx.globalAlpha = 0.45 + 0.55 * pulse;
        U.glowText(ctx, '! DANGER !', W / 2, dl + 14, 9, '#ff4d6d');
        ctx.restore();
      }
    }
    function drawAimGuide(ctx) {
      var tr = aimTrace(), pts = tr.pts, item = queue[0];
      var hex = item.kind === 'colour' ? PALETTE[item.colour] : '#ffffff';
      // marching dots along the path, fading with distance
      var gap = 11, phase = (t * 38) % gap, travelled = 0, total = 0, i;
      for (i = 1; i < pts.length; i++) total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      ctx.save();
      ctx.fillStyle = hex;
      for (i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i], len = Math.hypot(b.x - a.x, b.y - a.y);
        var s0 = Math.ceil((travelled - phase) / gap) * gap + phase - travelled;
        for (var s = Math.max(s0, 0); s < len; s += gap) {
          var along = travelled + s;
          if (along < 30 || along > total - R) continue;
          var k = s / len;
          ctx.globalAlpha = 0.85 * (1 - along / (total + 60)) + 0.1;
          disc(ctx, a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, 2.1);
        }
        travelled += len;
      }
      // bounce marks
      ctx.globalAlpha = 0.6; ctx.strokeStyle = hex; ctx.lineWidth = 1.5;
      for (i = 1; i < pts.length - 1; i++) ring(ctx, pts[i].x, pts[i].y, 4);
      ctx.restore();
      // ghost at the landing cell
      if (tr.cell) {
        var gx = cx(tr.cell[0], tr.cell[1]), gy = cy(tr.cell[0]);
        ctx.save();
        ctx.globalAlpha = 0.55 + 0.12 * Math.sin(t * 6);
        drawItem(ctx, item, gx, gy, 1, t);
        ctx.globalAlpha = 0.14; ctx.fillStyle = '#ffffff'; disc(ctx, gx, gy, R - 1);
        ctx.globalAlpha = 0.8; ctx.setLineDash([4, 4]); ctx.lineDashOffset = t * 10;
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ring(ctx, gx, gy, R + 1);
        ctx.restore();
      }
    }
    function drawLauncher(ctx) {
      // base dome
      var bg = ctx.createRadialGradient(SX, SY + 8, 4, SX, SY + 8, 40);
      bg.addColorStop(0, '#3b2c63'); bg.addColorStop(1, '#150e28');
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.arc(SX, SY + 18, 36, Math.PI, TAU); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
      // barrel
      ctx.save();
      ctx.translate(SX, SY); ctx.rotate(aim + Math.PI / 2);
      var brl = ctx.createLinearGradient(-10, 0, 10, 0);
      brl.addColorStop(0, '#2a1f4a'); brl.addColorStop(0.5, '#5a4690'); brl.addColorStop(1, '#2a1f4a');
      ctx.fillStyle = brl; ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
      U.roundRect(ctx, -10, -44, 20, 40, 5); ctx.fill(); ctx.stroke();
      ctx.restore();
      if (!over) drawItem(ctx, queue[0], SX, SY, 1, t);
      // queue: next (swappable) + the one after
      ctx.save();
      ctx.fillStyle = 'rgba(20,12,40,0.7)'; disc(ctx, NEXT_X, NEXT_Y, R * 0.85 + 5);
      ctx.strokeStyle = 'rgba(255,143,216,0.45)'; ctx.lineWidth = 1.5; ring(ctx, NEXT_X, NEXT_Y, R * 0.85 + 5);
      ctx.restore();
      drawItem(ctx, queue[1], NEXT_X, NEXT_Y, 0.8, t);
      ctx.save(); ctx.globalAlpha = 0.6; drawItem(ctx, queue[2], AFTER_X, AFTER_Y, 0.55, t); ctx.restore();
      // swap arrow between the next slot and the launcher
      ctx.save();
      ctx.strokeStyle = 'rgba(255,220,240,0.55)'; ctx.fillStyle = 'rgba(255,220,240,0.55)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc((NEXT_X + SX) / 2, SY + 6, 26, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
      var ax = (NEXT_X + SX) / 2 + Math.cos(Math.PI * 1.8) * 26, ay = SY + 6 + Math.sin(Math.PI * 1.8) * 26;
      ctx.beginPath(); ctx.moveTo(ax + 4, ay + 1); ctx.lineTo(ax - 3, ay - 3); ctx.lineTo(ax - 1, ay + 5); ctx.fill();
      ctx.font = '700 9px ui-monospace, Menlo, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,220,240,0.6)';
      ctx.fillText('NEXT \u00b7 C SWAP', NEXT_X, NEXT_Y + 28);
      ctx.restore();
    }
    function drawPops(ctx) {
      var sp = spriteSet();
      for (var i = 0; i < pops.length; i++) {
        var p = pops[i];
        if (p.delay > 0) { drawItem(ctx, p.cell, p.x, p.y, 1 + (0.08 - Math.min(0.08, p.delay)), t); continue; }
        var k = p.t / (p.boom ? 0.45 : 0.32);
        ctx.save();
        if (p.boom) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 1 - k;
          ctx.fillStyle = 'rgba(255,190,90,0.5)'; disc(ctx, p.x, p.y, BOMB_RADIUS * easeOut(k));
          ctx.strokeStyle = '#fff1c0'; ctx.lineWidth = 3 * (1 - k) + 1; ring(ctx, p.x, p.y, BOMB_RADIUS * 1.1 * easeOut(k));
        } else {
          var hex = cellHex(p.cell);
          ctx.globalAlpha = Math.max(0, 1 - k * 1.6);
          blit(ctx, p.cell.kind === 'colour' ? sp.colour[p.cell.colour] : sp[p.cell.kind] || sp.bomb, p.x, p.y, 1 + k * 0.5);
          ctx.globalAlpha = 1 - k;
          ctx.strokeStyle = hex; ctx.lineWidth = 3 * (1 - k) + 0.5;
          ring(ctx, p.x, p.y, R * (0.9 + k * 1.1));
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ring(ctx, p.x, p.y, R * (0.6 + k * 0.9));
        }
        ctx.restore();
      }
    }
    function drawDroplets(ctx) {
      ctx.save();
      for (var i = 0; i < droplets.length; i++) {
        var d = droplets[i];
        ctx.globalAlpha = Math.max(0, Math.min(1, d.life / 0.3));
        ctx.fillStyle = d.hex;
        disc(ctx, d.x, d.y, d.r);
      }
      ctx.restore();
    }
    function drawHud(ctx) {
      ctx.save();
      ctx.font = '700 10px ui-monospace, Menlo, Consolas, monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255,220,240,0.8)';
      ctx.fillText('LV ' + level + '  ' + boardName, LEFT, 16);
      // ceiling pressure: one light per shot left before the drop
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,220,240,0.55)';
      var right = W - LEFT, lx0 = right - missLimit * 12 + 6;
      ctx.fillText('CEILING', lx0 - 10, 16);
      for (var i = 0; i < missLimit; i++) {
        var left = i < missLimit - misses;
        ctx.fillStyle = left ? (missLimit - misses <= 2 ? '#ff4d6d' : '#ffd23f') : 'rgba(255,255,255,0.12)';
        disc(ctx, lx0 + i * 12, 16, 3.6);
      }
      if (combo >= 2) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ff8fd8';
        ctx.fillText('COMBO x' + Math.min(5, combo), W - LEFT, SY + 20);
      }
      ctx.restore();
    }
    function drawCaption(ctx) {
      if (!captions.length || captions[0].t >= CAPTION_SECS) return;
      var cap = captions[0], sp = SPECIALS[cap.kind];
      var a = Math.min(1, cap.t * 2, (CAPTION_SECS - cap.t) * 4), y = 432;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(10,6,26,0.85)'; U.roundRect(ctx, W / 2 - 160, y - 30, 320, 60, 12); ctx.fill();
      ctx.strokeStyle = rgba(sp.hex, 0.7); ctx.lineWidth = 1.5; ctx.stroke();
      var demo = cap.kind === 'ice' ? colourCell(3, true) : cap.kind === 'rainbow' ? { kind: 'rainbow' } : plainCell(cap.kind);
      drawItem(ctx, demo, W / 2 - 124, y, 1, t);
      U.glowText(ctx, 'NEW: ' + sp.label, W / 2 + 20, y - 9, 12, sp.hex);
      U.glowText(ctx, sp.desc, W / 2 + 20, y + 13, 7, '#e6e8ff');
      ctx.restore();
    }
    function drawBanner(ctx) {
      if (bannerT <= 0 || clearT > 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, bannerT * 1.5, (BANNER_SECS - bannerT) * 3));
      U.glowText(ctx, 'LEVEL ' + level, W / 2, 348, 24, '#ff8fd8');
      U.glowText(ctx, boardName, W / 2, 378, 11, '#ffffff');
      ctx.restore();
    }
    function drawClear(ctx) {
      var k = 1 - clearT / CLEAR_SECS;
      ctx.save();
      ctx.globalAlpha = Math.min(1, k * 4, clearT * 2);
      ctx.fillStyle = 'rgba(8,4,20,0.55)'; U.roundRect(ctx, W / 2 - 150, 230, 300, 120, 16); ctx.fill();
      var bounce = 1 + Math.max(0, 0.25 - k) * 2;
      ctx.translate(W / 2, 268); ctx.scale(bounce, bounce);
      U.glowText(ctx, 'BOARD CLEAR!', 0, 0, 20, '#39ff88');
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = Math.min(1, k * 4, clearT * 2);
      U.glowText(ctx, '+' + U.fmt(clearBonus), W / 2, 302, 14, '#ffd23f');
      U.glowText(ctx, 'NEXT: LEVEL ' + (level + 1), W / 2, 330, 8, '#ffffff');
      ctx.restore();
    }
  }

  /* ---------------------------------------------------- shared backdrop */
  var bgCache = null;
  function drawBackground(ctx) {
    if (!bgCache) {
      bgCache = mkCanvas(W * 2, H * 2);
      var g = bgCache.getContext('2d');
      g.scale(2, 2);
      var gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, '#170b2c'); gr.addColorStop(0.6, '#0c0620'); gr.addColorStop(1, '#05030e');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // faint honeycomb behind the play area
      g.strokeStyle = 'rgba(255,143,216,0.05)'; g.lineWidth = 1;
      for (var r = 0; r < MAX_ROWS + 1; r++) {
        for (var c = 0; c < COLS - (r % 2); c++) ring(g, LEFT + R + c * D + (r % 2 ? R : 0), TOP + R + r * ROWH, R - 2);
      }
      var vg = g.createRadialGradient(W / 2, H * 0.45, H * 0.2, W / 2, H * 0.45, H * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.5)');
      g.fillStyle = vg; g.fillRect(0, 0, W, H);
    }
    ctx.drawImage(bgCache, 0, 0, W, H);
  }

  /* ============================================================ 8. ATTRACT */
  // The HEART board hanging from the top, a swinging aim guide, a bouncing shot.
  function attract(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#170b2c'); g.addColorStop(1, '#05030e');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    var r = Math.max(5, w / 23), s = r / R, rowh = r * 1.732, left = (w - COLS * r * 2) / 2;
    var art = BOARDS[1].rows, fill = [4, 1, 3];
    var hide = Math.floor(t * 0.9) % 12;           // one cell pops per beat-ish cycle
    var n = 0;
    for (var row = 0; row < art.length && r + row * rowh < h * 0.62; row++) {
      var chars = art[row].replace(/ /g, '').split('');
      for (var c = 0; c < chars.length; c++) {
        if (chars[c] === '.') continue;
        n++;
        var x = left + r + c * r * 2 + (row % 2 ? r : 0), y = r + row * rowh;
        var colour = chars[c] === 'r' ? 0 : fill[(row * 3 + c * 5) % 3];
        if (n % 12 === hide && row > 1) {
          var k = (t * 0.9) % 1;
          ctx.strokeStyle = PALETTE[colour]; ctx.globalAlpha = 1 - k; ctx.lineWidth = 2;
          ring(ctx, x, y, r * (0.9 + k));
          ctx.globalAlpha = 1;
          continue;
        }
        blit(ctx, spriteSet().colour[colour], x, y, s);
      }
    }
    // swinging aim guide with a wall bounce
    var sx = w / 2, sy = h * 0.92, a = -Math.PI / 2 + Math.sin(t * 0.9) * 0.9;
    var vx = Math.cos(a), vy = Math.sin(a), x0 = sx, y0 = sy, wallL = left + r, wallR = w - left - r;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (var d = 8; d < h * 0.7; d += r * 0.7) {
      var px = sx + vx * d, py = sy + vy * d;
      while (px < wallL || px > wallR) px = px < wallL ? 2 * wallL - px : 2 * wallR - px;
      if (py < r * 9) break;
      disc(ctx, px, py, Math.max(1, r * 0.12));
      x0 = px; y0 = py;
    }
    blit(ctx, spriteSet().colour[Math.floor(t * 0.9) % 6], sx, sy, s);
    ctx.globalAlpha = 0.5;
    blit(ctx, spriteSet().colour[(Math.floor(t * 0.9) + 1) % 6], x0, y0, s);
    ctx.globalAlpha = 1;
  }

  XA.registerGame({
    id: 'xa_bubble_pop',
    order: 16,
    title: 'Fee Bubble',
    tagline: 'Match three. Drop the rest.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hint',
    touchHint: 'DRAG TO AIM \u00b7 LIFT YOUR FINGER TO FIRE \u00b7 TAP NEXT TO SWAP',
    controls: 'Mouse aim + click \u00b7 or \u2190\u2192 aim, Space fire, C swap',
    create: create,
    attract: attract
  });
})(window);
