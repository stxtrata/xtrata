/*
 * Xtrata Arcade cartridge #11 -- MERGE 2048 (v2)
 *
 * Slide the whole grid; equal tiles merge and add their value to your score.
 * A new 2 (sometimes a 4) appears after every slide. Reaching 2048 is a
 * milestone, not the end: keep going until no move is left.
 *
 *   CLASSIC (base mode, contract mode 'score', higher is better)
 *     The endless game, with EARNED power tokens (see TOKENS below).
 *
 *   RACE TO 512 (variant 'race', contract mode 'time', lower is better)
 *     Pure 2048, no tokens. The clock starts on your first slide and stops
 *     the moment a 512 tile is made; the run is FINISHED after the merge
 *     celebration. A locked board is a DID NOT FINISH.
 *
 * The room is a lo-fi study: rain on the window, a desk lamp that breathes
 * with the beat, and a tile SKIN that evolves with your best tile
 * (paper -> neon -> gold -> cosmic).
 *
 * POWER TOKENS (Classic only; never free, so the leaderboard stays fair)
 *   Earned by MILESTONES (a best tile of 128, 256, 512 ...) and COMBOS
 *   (3+ merges in one slide, 4+ merges in one slide, 12 merging slides in a
 *   row). At most TOKEN_MAX of each kind are held.
 *     UNDO   Z / 1  revert the last slide. It restores the board, score,
 *                   best tile, milestones, tokens AND the spawn stream, so
 *                   repeating the same slide brings back the same new tile:
 *                   undo can change your decision, never re-roll luck.
 *                   Only the last slide can be undone; SWAP/SMASH clear it.
 *     SWAP   X / 2  pick two tiles of different value and swap them.
 *     SMASH  C / 3  pick one tile of value <= SMASH_MAX and remove it.
 *   SWAP/SMASH open a picker: tap tiles, or move the cursor with the arrows
 *   and confirm with Space/Enter; press the token key again to cancel.
 *   When the board locks but a token could still help, the run waits
 *   ("NO MOVES") until you use one or press Enter / tap END RUN.
 *
 * Music: swung lo-fi in Eb major, IVmaj7-iii7-ii7-Imaj7 under a low-pass,
 * with vinyl crackle. Each merge plays a marimba note whose degree is
 * log2 of the new tile; each new best tile raises the intensity (layers) and
 * every milestone plays a bell stinger that climbs with the tile; a nearly
 * full board closes the filter. 2048+ unlocks a cosmic arp. Tokens have
 * their own musical cues (undo rewinds, swap chimes, smash thumps).
 *
 * Contract game-id: xa_merge_2048
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-merge-2048');
  var U = XA.util;
  var M = function () { return XA.music; };

  /* ================================================================ layout */
  var W = 440, H = 600, N = 4;
  var BOARD = 384, BX = (W - BOARD) / 2, BY = 110, PAD = 10, TILE_R = 9;
  var CELL = (BOARD - PAD * (N + 1)) / N;       // 83.5
  var GLOW = 14;                                 // sprite margin for tile glow
  var DESK_Y = 470;                              // top edge of the desk
  var BAR_Y = BY + BOARD + 12;                   // token bar / race HUD
  var BAR_H = 62;
  var HINT_Y = H - 12;                           // bottom hint row
  var HEAD_X = 256;                              // centre of the header text
  var WINDOW = { x: 16, y: 12, w: 132, h: 84 };
  var LAMP = { x: 396, y: 30 };
  var ACCENT = '#ffae3f';
  var FONT_TILE = '"Arial Rounded MT Bold", "Trebuchet MS", ui-rounded, system-ui, sans-serif';
  var MONO = 'ui-monospace, Menlo, Consolas, monospace';
  var PIXEL = '"Press Start 2P", ' + MONO;
  var END_BTN = { x: W / 2 - 60, y: H - 23, w: 120, h: 20 };

  /* ================================================================ timing */
  var SLIDE = 0.11;          // seconds for a slide tween
  var SLIDE_FAST = 0.065;    // ... when another move is already queued
  var SWAP_TIME = 0.24;      // swap token tween
  var POP = 0.18;            // merge scale bounce
  var GROW = 0.15;           // spawn grow-in
  var QUEUE_MAX = 2;         // buffered moves while a slide animates
  var SKIN_FADE = 0.9;       // skin crossfade
  var OVER_DELAY = 1.4;      // locked board -> gameOver()
  var FINISH_DELAY = 1.4;    // race 512 -> finish() (after the merge pop)
  var BANNER_TIME = 2.2;
  var NOTICE_TIME = 1.8;

  /* ================================================================= rules */
  var FOUR_CHANCE = 0.1;     // a new tile is a 4 this often
  var RACE_GOAL = 512;
  var TOKEN_MAX = 3;
  var SMASH_MAX = 4;         // SMASH only removes tiles of this value or less
  var DIRS = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
  var DIR_NAMES = ['up', 'down', 'left', 'right'];

  // Token kinds. `keys` are kit input names (KEYMAP: Z/J=b, X/K=c, C/Shift=d, 1-3=k1-k3).
  var TOKENS = [
    { key: 'undo', label: 'UNDO', keys: ['b', 'k1'], hint: 'Z / 1', color: '#7fd4ff' },
    { key: 'swap', label: 'SWAP', keys: ['c', 'k2'], hint: 'X / 2', color: '#c79bff' },
    { key: 'smash', label: 'SMASH', keys: ['d', 'k3'], hint: 'C / 3', color: '#ff7a6b' }
  ];
  function tokenDef(kind) { for (var i = 0; i < TOKENS.length; i++) if (TOKENS[i].key === kind) return TOKENS[i]; return null; }

  // Milestones: every power of two from 128 up is celebrated once per run.
  // `gift` lists the tokens it earns (Classic only).
  var MILESTONES = [
    { v: 128, gift: { undo: 1 } },
    { v: 256, gift: { swap: 1 } },
    { v: 512, gift: { undo: 1, smash: 1 } },
    { v: 1024, gift: { undo: 1, swap: 1 } },
    { v: 2048, gift: { undo: 1, swap: 1, smash: 1 } },
    { v: 4096, gift: { undo: 1, swap: 1, smash: 1 } }
  ];
  var MILESTONE_MIN = 128;
  function milestoneFor(v) {
    for (var i = 0; i < MILESTONES.length; i++) if (MILESTONES[i].v === v) return MILESTONES[i];
    return { v: v, gift: { undo: 1, swap: 1, smash: 1 } };      // 8192 and beyond
  }

  // Combos: checked per slide, the first match wins.
  var COMBOS = [
    { name: 'QUAD MERGE', minMerges: 4, gift: 'smash' },
    { name: 'TRIPLE MERGE', minMerges: 3, gift: 'undo' }
  ];
  var STREAK_LEN = 12, STREAK_GIFT = 'swap';       // merging slides in a row

  /* ================================================================ helpers */
  function lvl(v) { return Math.round(Math.log(v) / Math.LN2); }
  function easeOutCubic(k) { return 1 - Math.pow(1 - k, 3); }
  function easeInOut(k) { return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
  function easeOutBack(k) { var c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); }
  function copyObj(o) { var r = {}; for (var k in o) if (o.hasOwnProperty(k)) r[k] = o[k]; return r; }
  function hexRgb(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgba(h, a) { var c = hexRgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  // amt > 0 mixes toward white, amt < 0 toward black
  function shade(h, amt) {
    var c = hexRgb(h), tgt = amt > 0 ? 255 : 0, k = Math.abs(amt);
    return 'rgb(' + Math.round(c[0] + (tgt - c[0]) * k) + ',' + Math.round(c[1] + (tgt - c[1]) * k) + ',' + Math.round(c[2] + (tgt - c[2]) * k) + ')';
  }
  function makeCanvas(w, h) {
    var c = root.document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
    return c;
  }
  // Resolution of cached art: the canvas transform scale, rounded up to 0.5.
  function resFor(ctx, mult) {
    var k = ctx.getTransform ? ctx.getTransform().a : 1;
    return Math.min(4, Math.max(1, Math.ceil(k * (mult || 1) * 2) / 2));
  }
  function cellX(c) { return BX + PAD + c * (CELL + PAD); }
  function cellY(r) { return BY + PAD + r * (CELL + PAD); }
  function inRect(p, r) { return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h; }
  function fmtTime(sec) {
    var cs = Math.max(0, Math.round(sec * 100)), m = Math.floor(cs / 6000), s = Math.floor(cs / 100) % 60, c = cs % 100;
    return (m ? m + ':' + (s < 10 ? '0' : '') : '') + s + '.' + (c < 10 ? '0' : '') + c + (m ? '' : 's');
  }

  // Spawn stream: mulberry32 with visible state, seeded once from api.rng so
  // UNDO can rewind it. (Same algorithm as XA.util.rng.)
  function streamNext(st) {
    st.s = (st.s + 0x6d2b79f5) >>> 0;
    var x = st.s;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  }

  /* ============================================================ tile skins
     Each skin paints one tile into a cached sprite (origin = tile top-left,
     units = playfield px). The skin in use follows the best tile.          */
  var PAPER = {   // [card, ink]
    2: ['#f4ead7', '#5a4030'], 4: ['#efdcbc', '#5a4030'], 8: ['#f3b98a', '#4e2a18'], 16: ['#ef9a6c', '#fff7ea'],
    32: ['#e5795c', '#fff7ea'], 64: ['#d2553f', '#fff7ea'], 128: ['#efcf6e', '#4a3210'], 256: ['#e2b843', '#402a08'],
    512: ['#9cc77a', '#1f3514'], 1024: ['#6fb8ae', '#0f2c2a'], 2048: ['#6e8fd6', '#ffffff'], 4096: ['#8a6cc4', '#ffffff']
  };
  var NEON = {
    2: '#5b7bff', 4: '#4fa3ff', 8: '#b04dff', 16: '#d43fd8', 32: '#ff3fa4', 64: '#ff4d6d',
    128: '#ff9f1c', 256: '#ffd23f', 512: '#39ff88', 1024: '#3ff0ff', 2048: '#ffffff', 4096: '#ff8af0'
  };
  var GOLD = {
    2: '#b9bcc6', 4: '#cfcab8', 8: '#c0834a', 16: '#cc934f', 32: '#d6a455', 64: '#e0b45c',
    128: '#e9c35f', 256: '#f1cf62', 512: '#f8da6a', 1024: '#ffe587', 2048: '#fff1b8', 4096: '#fffbe8'
  };
  function palette(table, v) { return table[Math.min(v, 4096)] || table[2]; }
  function cosmicHue(v) { return (220 + lvl(v) * 29) % 360; }

  var SKINS = [
    { key: 'paper', name: 'PAPER', from: 0, board: '#3a2a22', cell: 'rgba(255,236,210,0.09)', edge: '#ffc98a', paint: paintPaper,
      accent: function (v) { return palette(PAPER, v)[0]; } },
    { key: 'neon', name: 'NEON', from: 128, board: '#0e0b24', cell: 'rgba(120,140,255,0.07)', edge: '#b04dff', paint: paintNeon,
      accent: function (v) { return palette(NEON, v); } },
    { key: 'gold', name: 'GOLD', from: 512, board: '#24190b', cell: 'rgba(255,210,120,0.08)', edge: '#ffcf5a', paint: paintGold,
      accent: function (v) { return palette(GOLD, v); } },
    { key: 'cosmic', name: 'COSMIC', from: 2048, board: '#060920', cell: 'rgba(160,180,255,0.06)', edge: '#8fa8ff', paint: paintCosmic,
      accent: function (v) { return 'hsl(' + cosmicHue(v) + ',100%,72%)'; } }
  ];
  function skinFor(best) {
    for (var i = SKINS.length - 1; i > 0; i--) if (best >= SKINS[i].from) return i;
    return 0;
  }

  // Readable numbers at every size: pick by digit count, then shrink to fit.
  function numberSize(v) {
    var d = String(v).length;
    return Math.round(CELL * (d <= 2 ? 0.46 : d === 3 ? 0.38 : d === 4 ? 0.3 : d === 5 ? 0.25 : 0.21));
  }
  function setNumberFont(g, v) {
    var size = numberSize(v), txt = String(v);
    g.font = '900 ' + size + 'px ' + FONT_TILE;
    while (g.measureText(txt).width > CELL * 0.82 && size > 8) { size--; g.font = '900 ' + size + 'px ' + FONT_TILE; }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    return size;
  }
  function tilePath(g, inset) { U.roundRect(g, inset, inset, CELL - inset * 2, CELL - inset * 2, Math.max(2, TILE_R - inset * 0.6)); }

  // Cosmetic: a tiny "sats" caption under the tile value (skipped for 5+ digit tiles, where it would crowd).
  function paintSats(g, v, size, color) {
    if (String(v).length > 4) return;
    g.save();
    g.shadowBlur = 0;
    g.fillStyle = color;
    g.font = '700 9px ' + MONO; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('sats', CELL / 2, Math.min(CELL - 11, CELL / 2 + size * 0.42 + 9));
    g.restore();
  }

  function paintPaper(g, v, res) {
    var p = palette(PAPER, v), col = p[0], r = U.rng(v * 131 + 7);
    // card shadow + body
    g.fillStyle = 'rgba(25,12,4,0.45)';
    U.roundRect(g, 1.5, 3.5, CELL, CELL, TILE_R); g.fill();
    var gr = g.createLinearGradient(0, 0, 0, CELL);
    gr.addColorStop(0, shade(col, 0.16)); gr.addColorStop(1, shade(col, -0.06));
    g.fillStyle = gr; tilePath(g, 0); g.fill();
    // paper fibres
    g.save(); tilePath(g, 0); g.clip();
    for (var i = 0; i < 70; i++) {
      g.fillStyle = r() < 0.5 ? 'rgba(90,60,30,0.07)' : 'rgba(255,255,255,0.12)';
      g.fillRect(r() * CELL, r() * CELL, 1 + r() * 2.5, 0.8);
    }
    g.restore();
    // pressed border and a stamp corner for big cards
    g.strokeStyle = 'rgba(80,50,30,0.22)'; g.lineWidth = 1.2; tilePath(g, 4); g.stroke();
    if (v >= 64) {
      g.fillStyle = rgba('#ffffff', 0.25);
      g.beginPath(); g.moveTo(CELL - 20, 4); g.lineTo(CELL - 4, 4); g.lineTo(CELL - 4, 20); g.closePath(); g.fill();
    }
    var size = setNumberFont(g, v);
    g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillText(String(v), CELL / 2 + 1, CELL / 2 + 2 + size * 0.04);
    g.fillStyle = p[1]; g.fillText(String(v), CELL / 2, CELL / 2 + size * 0.04);
    paintSats(g, v, size, rgba(p[1], 0.6));
  }

  function paintNeon(g, v, res) {
    var col = palette(NEON, v), L = lvl(v);
    // outer halo, stronger for big tiles
    g.save();
    g.shadowColor = col; g.shadowBlur = (4 + Math.min(10, L)) * res;
    g.fillStyle = rgba(col, v >= 128 ? 0.55 : 0.3);
    tilePath(g, 1); g.fill();
    g.restore();
    var body = g.createLinearGradient(0, 0, 0, CELL);
    var k = Math.min(0.5, 0.08 + L * 0.035);
    body.addColorStop(0, '#1a1038'); body.addColorStop(1, '#0a0618');
    g.fillStyle = body; tilePath(g, 0); g.fill();
    g.fillStyle = rgba(col, k); tilePath(g, 0); g.fill();
    // neon tube edge
    g.save();
    g.shadowColor = col; g.shadowBlur = 8 * res;
    g.strokeStyle = col; g.lineWidth = 2.6; tilePath(g, 2.5); g.stroke();
    g.shadowBlur = 0;
    g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 0.8; tilePath(g, 2.5); g.stroke();
    g.restore();
    // number: glowing tube with a white core
    var size = setNumberFont(g, v);
    g.save();
    g.shadowColor = col; g.shadowBlur = 10 * res;
    g.fillStyle = col; g.fillText(String(v), CELL / 2, CELL / 2 + size * 0.04);
    g.restore();
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillText(String(v), CELL / 2, CELL / 2 + size * 0.04);
    paintSats(g, v, size, rgba(col, 0.75));
  }

  function paintGold(g, v, res) {
    var col = palette(GOLD, v), L = lvl(v);
    if (v >= 256) {
      g.save();
      g.shadowColor = rgba('#ffcf5a', 0.9); g.shadowBlur = (6 + (L - 8) * 2) * res;
      g.fillStyle = col; tilePath(g, 1); g.fill();
      g.restore();
    }
    g.fillStyle = 'rgba(20,10,0,0.5)'; U.roundRect(g, 1, 3, CELL, CELL, TILE_R); g.fill();
    var gr = g.createLinearGradient(0, 0, CELL, CELL);
    gr.addColorStop(0, shade(col, 0.45)); gr.addColorStop(0.35, col);
    gr.addColorStop(0.7, shade(col, -0.28)); gr.addColorStop(1, shade(col, 0.1));
    g.fillStyle = gr; tilePath(g, 0); g.fill();
    // bevel
    g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 1.5; tilePath(g, 3); g.stroke();
    g.strokeStyle = 'rgba(60,35,0,0.35)'; g.lineWidth = 1; tilePath(g, 5.5); g.stroke();
    // sheen
    g.save(); tilePath(g, 0); g.clip();
    g.fillStyle = 'rgba(255,255,255,0.16)';
    g.beginPath(); g.moveTo(0, CELL * 0.28); g.lineTo(CELL * 0.28, 0); g.lineTo(CELL * 0.46, 0); g.lineTo(0, CELL * 0.46); g.closePath(); g.fill();
    g.restore();
    // engraved number
    var size = setNumberFont(g, v), y = CELL / 2 + size * 0.04;
    g.fillStyle = 'rgba(255,250,225,0.6)'; g.fillText(String(v), CELL / 2, y + 1.3);
    g.fillStyle = '#3b2708'; g.fillText(String(v), CELL / 2, y);
    paintSats(g, v, size, 'rgba(59,39,8,0.6)');
  }

  function paintCosmic(g, v, res) {
    var hue = cosmicHue(v), L = lvl(v), r = U.rng(v * 977 + 3);
    if (v >= 64) {
      g.save();
      g.shadowColor = 'hsl(' + hue + ',100%,65%)'; g.shadowBlur = (4 + L) * res;
      g.fillStyle = 'hsla(' + hue + ',90%,50%,0.5)'; tilePath(g, 1); g.fill();
      g.restore();
    }
    var gr = g.createRadialGradient(CELL * 0.35, CELL * 0.3, 2, CELL / 2, CELL / 2, CELL * 0.8);
    gr.addColorStop(0, 'hsl(' + hue + ',75%,' + Math.min(58, 30 + L * 2) + '%)');
    gr.addColorStop(0.55, 'hsl(' + ((hue + 30) % 360) + ',65%,' + (14 + L) + '%)');
    gr.addColorStop(1, 'hsl(' + ((hue + 60) % 360) + ',70%,6%)');
    g.fillStyle = gr; tilePath(g, 0); g.fill();
    g.save(); tilePath(g, 0); g.clip();
    // nebula wisps + stars
    for (var i = 0; i < 3; i++) {
      g.fillStyle = 'hsla(' + ((hue + i * 40) % 360) + ',90%,70%,0.10)';
      g.beginPath(); g.ellipse(r() * CELL, r() * CELL, 18 + r() * 20, 6 + r() * 8, r() * 3, 0, Math.PI * 2); g.fill();
    }
    for (var s = 0; s < 8 + L * 2; s++) {
      g.fillStyle = 'rgba(255,255,255,' + (0.3 + r() * 0.6) + ')';
      var sz = r() < 0.15 ? 1.8 : 1;
      g.fillRect(r() * CELL, r() * CELL, sz, sz);
    }
    if (L >= 9) {   // a planet ring for the giants
      g.strokeStyle = 'hsla(' + hue + ',100%,80%,0.35)'; g.lineWidth = 1.5;
      g.beginPath(); g.ellipse(CELL / 2, CELL / 2, CELL * 0.44, CELL * 0.14, -0.35, 0, Math.PI * 2); g.stroke();
    }
    g.restore();
    g.strokeStyle = 'hsla(' + hue + ',100%,80%,0.45)'; g.lineWidth = 1.2; tilePath(g, 1.5); g.stroke();
    var size = setNumberFont(g, v);
    g.save();
    g.shadowColor = 'hsl(' + hue + ',100%,70%)'; g.shadowBlur = 9 * res;
    g.fillStyle = '#ffffff'; g.fillText(String(v), CELL / 2, CELL / 2 + size * 0.04);
    g.restore();
    paintSats(g, v, size, 'rgba(255,255,255,0.55)');
  }

  /* ========================================================= sprite cache */
  var spriteCache = {}, spriteCount = 0;
  function sprite(skinIdx, v, res) {
    var key = skinIdx + ':' + v + ':' + res;
    var c = spriteCache[key];
    if (c) return c;
    if (spriteCount > 320) { spriteCache = {}; spriteCount = 0; }
    var S = CELL + GLOW * 2;
    c = makeCanvas(S * res, S * res);
    var g = c.getContext('2d');
    g.scale(res, res);
    g.translate(GLOW, GLOW);
    SKINS[skinIdx].paint(g, v, res);
    spriteCache[key] = c; spriteCount++;
    return c;
  }
  // Draw a tile centred on (cx, cy) at `scale` of its size.
  function drawTile(ctx, skinIdx, v, cx, cy, scale, alpha, res) {
    var S = (CELL + GLOW * 2) * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite(skinIdx, v, res), cx - S / 2, cy - S / 2, S, S);
    ctx.globalAlpha = 1;
  }

  /* ============================================================ backdrop
     A lo-fi study, painted once per resolution: wallpaper, a rainy window
     over a night city, a desk lamp and a wooden desk. Rain and the lamp's
     beat glow are drawn live on top.                                      */
  var backdropCache = {}, backdropKeys = [];
  function backdrop(res) {
    var key = String(res);
    if (backdropCache[key]) return backdropCache[key];
    var c = makeCanvas(W * res, H * res), g = c.getContext('2d');
    g.scale(res, res);
    paintBackdrop(g);
    backdropCache[key] = c; backdropKeys.push(key);
    if (backdropKeys.length > 4) delete backdropCache[backdropKeys.shift()];
    return c;
  }
  function paintBackdrop(g) {
    var r = U.rng(4242);                 // fixed art seed (visual only)
    var wall = g.createLinearGradient(0, 0, 0, DESK_Y);
    wall.addColorStop(0, '#161120'); wall.addColorStop(1, '#2a1c26');
    g.fillStyle = wall; g.fillRect(0, 0, W, DESK_Y);
    g.fillStyle = 'rgba(255,220,180,0.025)';
    for (var x = 6; x < W; x += 18) g.fillRect(x, 0, 2, DESK_Y);
    paintWindow(g, r);
    paintLamp(g);
    paintDesk(g, r);
  }
  function paintWindow(g, r) {
    var w = WINDOW, bottom = w.y + w.h;
    g.save();
    g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
    var sky = g.createLinearGradient(0, w.y, 0, bottom);
    sky.addColorStop(0, '#090d2a'); sky.addColorStop(0.7, '#2a2150'); sky.addColorStop(1, '#4a2c5c');
    g.fillStyle = sky; g.fillRect(w.x, w.y, w.w, w.h);
    // moon
    var mx = w.x + w.w * 0.76, my = w.y + 20;
    var halo = g.createRadialGradient(mx, my, 3, mx, my, 26);
    halo.addColorStop(0, 'rgba(255,240,210,0.35)'); halo.addColorStop(1, 'rgba(255,240,210,0)');
    g.fillStyle = halo; g.fillRect(mx - 26, my - 26, 52, 52);
    g.fillStyle = '#fff1d2'; g.beginPath(); g.arc(mx, my, 6.5, 0, Math.PI * 2); g.fill();
    // two skyline layers with lit windows
    var layers = [{ col: '#1e1a3c', lo: 22, hi: 46, lit: 0.12 }, { col: '#0b0a1a', lo: 12, hi: 34, lit: 0.28 }];
    layers.forEach(function (L) {
      var x = w.x - 4;
      while (x < w.x + w.w) {
        var bw = 9 + r() * 16, bh = L.lo + r() * (L.hi - L.lo);
        g.fillStyle = L.col; g.fillRect(x, bottom - bh, bw, bh);
        for (var yy = bottom - bh + 4; yy < bottom - 3; yy += 5) {
          for (var xx = x + 2; xx < x + bw - 2; xx += 4) {
            if (r() < L.lit) { g.fillStyle = 'rgba(255,' + (190 + Math.floor(r() * 50)) + ',120,' + (0.45 + r() * 0.45) + ')'; g.fillRect(xx, yy, 2, 2); }
          }
        }
        x += bw + 1;
      }
    });
    // glass reflection
    g.fillStyle = 'rgba(255,255,255,0.05)';
    g.beginPath(); g.moveTo(w.x + 10, bottom); g.lineTo(w.x + 50, w.y); g.lineTo(w.x + 64, w.y); g.lineTo(w.x + 24, bottom); g.closePath(); g.fill();
    g.restore();
    // frame, mullions and sill
    g.strokeStyle = '#3e2c22'; g.lineWidth = 6; g.strokeRect(w.x - 1, w.y - 1, w.w + 2, w.h + 2);
    g.strokeStyle = 'rgba(255,200,150,0.15)'; g.lineWidth = 1; g.strokeRect(w.x - 4, w.y - 4, w.w + 8, w.h + 8);
    g.fillStyle = '#3e2c22';
    g.fillRect(w.x + w.w / 2 - 1.5, w.y, 3, w.h);
    g.fillRect(w.x, w.y + w.h * 0.45 - 1.5, w.w, 3);
    g.fillStyle = '#4d3627'; g.fillRect(w.x - 8, bottom + 2, w.w + 16, 6);
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(w.x - 8, bottom + 8, w.w + 16, 2);
    // a small plant on the sill
    var px = w.x + w.w - 16, py = bottom + 2;
    g.fillStyle = '#2f6b4a';
    [[-7, -12, -0.7], [6, -13, 0.6], [0, -17, 0], [-3, -10, -0.3]].forEach(function (l) {
      g.beginPath(); g.ellipse(px + l[0], py + l[1], 3.2, 8, l[2], 0, Math.PI * 2); g.fill();
    });
    g.fillStyle = '#b5623e';
    g.beginPath(); g.moveTo(px - 8, py - 6); g.lineTo(px + 8, py - 6); g.lineTo(px + 6, py); g.lineTo(px - 6, py); g.closePath(); g.fill();
  }
  function paintLamp(g) {
    var gl = g.createRadialGradient(LAMP.x - 8, LAMP.y + 12, 4, LAMP.x - 8, LAMP.y + 12, 300);
    gl.addColorStop(0, 'rgba(255,200,120,0.32)');
    gl.addColorStop(0.3, 'rgba(255,170,90,0.11)');
    gl.addColorStop(1, 'rgba(255,150,80,0)');
    g.fillStyle = gl; g.fillRect(0, 0, W, H);
    // arm from the right edge
    g.strokeStyle = '#2b2331'; g.lineWidth = 4; g.lineCap = 'round';
    g.beginPath(); g.moveTo(W + 4, 98); g.lineTo(426, 62); g.lineTo(404, 22); g.stroke();
    g.fillStyle = '#3b3142';
    g.beginPath(); g.arc(426, 62, 3.5, 0, Math.PI * 2); g.fill();
    // shade, tilted toward the board
    g.save();
    g.translate(LAMP.x, LAMP.y - 6); g.rotate(0.5);
    var sh = g.createLinearGradient(-20, 0, 20, 0);
    sh.addColorStop(0, '#7a2c22'); sh.addColorStop(0.5, '#c9573d'); sh.addColorStop(1, '#6a261d');
    g.fillStyle = sh;
    g.beginPath(); g.moveTo(-8, -14); g.lineTo(8, -14); g.lineTo(20, 8); g.lineTo(-20, 8); g.closePath(); g.fill();
    g.fillStyle = '#e8a070'; g.fillRect(-20, 7, 40, 2);
    g.fillStyle = '#fff2c8'; g.beginPath(); g.ellipse(0, 10, 9, 3.5, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function paintDesk(g, r) {
    var d = g.createLinearGradient(0, DESK_Y, 0, H);
    d.addColorStop(0, '#6b4630'); d.addColorStop(1, '#321f15');
    g.fillStyle = d; g.fillRect(0, DESK_Y, W, H - DESK_Y);
    g.strokeStyle = 'rgba(30,14,5,0.28)'; g.lineWidth = 1;
    for (var i = 0; i < 22; i++) {
      var y = DESK_Y + 8 + r() * (H - DESK_Y - 10), x = 0;
      g.beginPath(); g.moveTo(0, y);
      while (x < W) { var nx = x + 30 + r() * 50; g.quadraticCurveTo((x + nx) / 2, y + (r() - 0.5) * 4, nx, y + (r() - 0.5) * 2); x = nx; }
      g.stroke();
    }
    g.fillStyle = '#8c6043'; g.fillRect(0, DESK_Y, W, 3);
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(0, DESK_Y + 3, W, 2);
    var pool = g.createRadialGradient(330, DESK_Y + 40, 10, 330, DESK_Y + 40, 220);
    pool.addColorStop(0, 'rgba(255,190,110,0.2)'); pool.addColorStop(1, 'rgba(255,190,110,0)');
    g.fillStyle = pool; g.fillRect(0, DESK_Y, W, H - DESK_Y);
    // the board's shadow on the desk
    var sh = g.createRadialGradient(W / 2, BY + BOARD + 4, 10, W / 2, BY + BOARD + 4, BOARD * 0.6);
    sh.addColorStop(0, 'rgba(0,0,0,0.5)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    g.save(); g.translate(0, BY + BOARD + 4); g.scale(1, 0.08); g.translate(0, -(BY + BOARD + 4));
    g.fillStyle = sh; g.fillRect(0, BY, W, BOARD * 1.3);
    g.restore();
  }
  // Live layers: rain streaks on the window and a lamp glow that breathes with the beat.
  function drawRain(ctx, t) {
    var w = WINDOW;
    ctx.save();
    ctx.beginPath(); ctx.rect(w.x, w.y, w.w, w.h); ctx.clip();
    ctx.strokeStyle = 'rgba(170,190,255,0.32)'; ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (var i = 0; i < 30; i++) {
      var sp = 150 + (i * 37) % 70;
      var x = w.x + (i * 53.7) % w.w;
      var y = w.y - 8 + (t * sp + i * 31) % (w.h + 16);
      ctx.moveTo(x, y); ctx.lineTo(x - 1.8, y + 7);
    }
    ctx.stroke();
    // drops sliding down the glass
    ctx.fillStyle = 'rgba(200,215,255,0.35)';
    for (var d = 0; d < 6; d++) {
      var dy = w.y + ((t * (8 + d * 3) + d * 23) % w.h);
      ctx.fillRect(w.x + 8 + d * 21, dy, 1.4, 2.4);
    }
    ctx.restore();
  }
  function drawLampPulse(ctx, amt) {
    if (amt < 0.02) return;
    var gl = ctx.createRadialGradient(LAMP.x - 8, LAMP.y + 12, 4, LAMP.x - 8, LAMP.y + 12, 180);
    gl.addColorStop(0, 'rgba(255,200,120,' + (0.12 * amt) + ')');
    gl.addColorStop(1, 'rgba(255,170,90,0)');
    ctx.fillStyle = gl; ctx.fillRect(LAMP.x - 190, 0, 380, 220);
  }

  /* ================================================================= music
     Swung lo-fi in Eb major, IVmaj7-iii7-ii7-Imaj7 under a low-pass. Layers
     unlock as the best tile grows (intensity = f(best tile)).             */
  var LOFI = 3200, TENSE = 700;
  function song(race) {
    var tracks = [
      { name: 'crackle', inst: 'hat', layer: 0, gain: 0.12,
        fn: function (i) { return i.rng() < 0.22 ? { drum: true, vel: 0.15 + i.rng() * 0.35 } : null; } },
      { name: 'pad', inst: 'pad', layer: 0, gain: 0.35, chord: true, octave: 0, params: { cutoff: 900, attack: 0.6, release: 1.4 },
        fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }, { deg: 6, steps: 16 }] : null; } },
      { name: 'kick', inst: 'kick', layer: 0.1, gain: 0.55, pattern: 'x.....x...x.....' },
      { name: 'hat', inst: 'hat', layer: 0.2, gain: 0.3, pattern: 'x.x.x.x.x.x.x.xx' },
      { name: 'snare', inst: 'snare', layer: 0.3, gain: 0.4, pattern: '....x.......x...' },
      { name: 'bass', inst: 'sub', layer: 0.42, gain: 0.5, chord: true, octave: -1,
        pattern: '0 - - - . . . 4 - . 0 - - - . .' },
      { name: 'keys', inst: 'marimba', layer: 0.6, gain: 0.28, chord: true, octave: 1,
        fn: function (i) { return i.stepInBar === 3 || i.stepInBar === 11 ? [{ deg: 2, vel: 0.6 }, { deg: 6, vel: 0.5 }] : null; } },
      { name: 'shaker', inst: 'shaker', layer: 0.72, gain: 0.3, pattern: '..x...x...x..xx.' },
      { name: 'bell', inst: 'bell', layer: 0.85, gain: 0.25, chord: true, octave: 1, rate: 2,
        fn: function (i) { return i.rng() < 0.3 ? { deg: [4, 6, 7, 9][Math.floor(i.rng() * 4)], vel: 0.5 } : null; } },
      { name: 'cosmos', inst: 'arp', layer: 0.97, gain: 0.16, chord: true, octave: 2, rate: 2,
        fn: function (i) { var seq = [0, 2, 4, 6, 7, 6, 4, 2]; return { deg: seq[Math.floor(i.step / 2) % seq.length], vel: 0.45 }; } }
    ];
    // Race: a ticking clock hat under everything.
    if (race) tracks.push({ name: 'tick', inst: 'hat', layer: 0, gain: 0.2, pattern: 'X...x...X...x...' });
    return { bpm: race ? 88 : 80, key: 51, scale: 'major', chords: [3, 2, 1, 0], swing: 0.3, seed: 2048, filter: LOFI, tracks: tracks };
  }
  function intensityFor(best, race) {
    return race ? U.clamp(0.3 + (lvl(best) - 2) * 0.1, 0, 1) : U.clamp((lvl(best) - 2) / 9, 0, 1);
  }
  // The milestone stinger climbs with the tile: 128 tops at degree 7, 2048 at 11.
  function playStinger(v) {
    var m = M(), top = lvl(v) - 7;
    if (!m) return;
    m.stinger([{ deg: 0 }, { deg: 2, at: 1 }, { deg: 4, at: 2 }, { deg: 6, at: 3 }, { deg: 7 + top, at: 4, steps: 6 }],
      { inst: 'bell', quantize: '8', octave: 1, gain: 0.45 });
  }

  /* ============================================================== the game */
  function create(api) {
    var RACE = api.mode === 'time';
    var stream = { s: Math.floor(api.rng() * 4294967296) >>> 0 };   // spawn stream (see UNDO)
    var grid = [], tiles = [], nextId = 1;
    var slideT = 0, slideDur = SLIDE, slideKind = 'move';
    var queue = [];                       // buffered directions
    var pendingToken = null;              // token key pressed during a slide
    var pendingCelebrations = [];         // milestones reached by the current slide
    var best = 2, moves = 0, streak = 0;
    var celebrated = {};                  // milestone value -> true
    var tokens = { undo: 0, swap: 0, smash: 0 };
    var tokenFlash = { undo: 0, swap: 0, smash: 0 };
    var history = null;                   // snapshot before the last slide (UNDO)
    var pick = null;                      // { kind, r, c, first }
    var stuck = false, over = false, overT = 0, ended = false;
    var race = { started: false, elapsed: 0, done: false, doneT: 0, dnf: false };
    var skinIdx = 0, prevSkin = 0, skinT = 1;
    var banners = [], confetti = [], rings = [];
    var notice = null;                    // { text, color, t }
    var rewindT = 0;
    var tense = false;
    var t = 0;

    /* ------------------------------------------------------------ board */
    function emptyGrid() { var g = []; for (var r = 0; r < N; r++) g.push([null, null, null, null]); return g; }
    grid = emptyGrid();
    function addTile(v, r, c) {
      var tl = { id: nextId++, v: v, shown: v, r: r, c: c, fr: r, fc: c, born: 0, pop: 0, dying: false, merged: false, swapping: false };
      grid[r][c] = tl;
      tiles.push(tl);
      return tl;
    }
    function emptyCells() {
      var out = [];
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (!grid[r][c]) out.push([r, c]);
      return out;
    }
    function valuesOf() {
      var out = [];
      for (var r = 0; r < N; r++) { var row = []; for (var c = 0; c < N; c++) row.push(grid[r][c] ? grid[r][c].v : 0); out.push(row); }
      return out;
    }
    function canMoveVals(vals) {
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
        var v = vals[r][c];
        if (!v) return true;
        if (c < N - 1 && vals[r][c + 1] === v) return true;
        if (r < N - 1 && vals[r + 1][c] === v) return true;
      }
      return false;
    }
    function canMove() { return canMoveVals(valuesOf()); }
    function spawn() {
      var empty = emptyCells();
      if (!empty.length) return null;
      var e = empty[Math.floor(streamNext(stream) * empty.length)];
      var tl = addTile(streamNext(stream) < FOUR_CHANCE ? 4 : 2, e[0], e[1]);
      tl.born = GROW;
      return tl;
    }
    spawn(); spawn();

    /* ------------------------------------------------------------ music */
    if (M()) M().play(song(RACE), { fade: 1.2, intensity: intensityFor(2, RACE) });
    function setTense(on) {           // board nearly full: squeeze the filter
      if (on === tense) return;
      tense = on;
      if (M()) M().setFilter(on ? TENSE : LOFI, on ? 1.2 : 0.6);
    }
    function onBestChanged() { if (M()) M().setIntensity(intensityFor(best, RACE)); }
    function buzz() { api.audio.tone(140, 0.05, { type: 'square', vol: 0.05 }); }

    /* ------------------------------------------------------------ notices */
    function say(text, color) { notice = { text: text, color: color || '#ffe2bd', t: NOTICE_TIME }; }
    function deny(text) { buzz(); say(text, '#ff9a8a'); }

    /* ------------------------------------------------------------ tokens */
    function give(kind, reason) {
      var def = tokenDef(kind);
      if (tokens[kind] >= TOKEN_MAX) { if (reason) say(reason + ' - ' + def.label + ' FULL', def.color); return false; }
      tokens[kind]++;
      tokenFlash[kind] = 0.8;
      var rc = tokenRect(TOKENS.indexOf(def));
      api.fx.text(rc.x + rc.w / 2, rc.y - 6, '+1 ' + def.label, def.color, 10);
      if (reason) say(reason + '  +1 ' + def.label, def.color);
      if (M()) M().note('bell', 7 + TOKENS.indexOf(def) * 2, { octave: 1, quantize: '16', gain: 0.4 });
      return true;
    }
    function awardCombos(merges) {
      if (RACE) return;
      streak = merges > 0 ? streak + 1 : 0;
      for (var i = 0; i < COMBOS.length; i++) {
        if (merges >= COMBOS[i].minMerges) { give(COMBOS[i].gift, COMBOS[i].name); break; }
      }
      if (streak >= STREAK_LEN) { streak = 0; give(STREAK_GIFT, 'STREAK x' + STREAK_LEN); }
    }
    function smashable() { return tiles.some(function (tl) { return !tl.dying && tl.v <= SMASH_MAX; }); }
    // Would any swap of two different tiles unlock a move? (locked-board check)
    function swapHelps() {
      var vals = valuesOf(), cells = [];
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (vals[r][c]) cells.push([r, c]);
      for (var i = 0; i < cells.length; i++) for (var j = i + 1; j < cells.length; j++) {
        var a = cells[i], b = cells[j], va = vals[a[0]][a[1]], vb = vals[b[0]][b[1]];
        if (va === vb) continue;
        vals[a[0]][a[1]] = vb; vals[b[0]][b[1]] = va;
        var ok = canMoveVals(vals);
        vals[a[0]][a[1]] = va; vals[b[0]][b[1]] = vb;
        if (ok) return true;
      }
      return false;
    }
    function rescueAvailable() {
      return (tokens.undo > 0 && !!history) || (tokens.smash > 0 && smashable()) || (tokens.swap > 0 && swapHelps());
    }
    function activateToken(kind) {
      if (RACE || over || ended) return;
      if (slideT > 0) { pendingToken = kind; return; }
      var def = tokenDef(kind);
      if (pick) { var same = pick.kind === kind; pick = null; if (same) { say('CANCELLED'); return; } }
      if (!tokens[kind]) { deny('NO ' + def.label + ' TOKENS - EARN THEM AT 128+ AND WITH COMBOS'); return; }
      if (kind === 'undo') { useUndo(); return; }
      if (kind === 'smash' && !smashable()) { deny('SMASH NEEDS A 2 OR A 4'); return; }
      queue.length = 0;
      var start = firstCell(kind);
      pick = { kind: kind, r: start[0], c: start[1], first: null };
      say(kind === 'swap' ? 'SWAP: PICK TWO TILES' : 'SMASH: PICK A 2 OR A 4', def.color);
      api.audio.tone(kind === 'swap' ? 660 : 300, 0.06, { type: 'triangle', vol: 0.12 });
    }
    function firstCell(kind) {
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
        var tl = grid[r][c];
        if (tl && (kind !== 'smash' || tl.v <= SMASH_MAX)) return [r, c];
      }
      return [0, 0];
    }

    // UNDO: a full snapshot before each slide; restoring it also rewinds the
    // spawn stream, so the same slide brings back the same new tile.
    function snapshot() {
      return { vals: valuesOf(), score: api.getScore(), best: best, moves: moves, streak: streak,
        stream: stream.s, celebrated: copyObj(celebrated), tokens: copyObj(tokens) };
    }
    function useUndo() {
      if (!history) { deny('NOTHING TO UNDO'); return; }
      var s = history;
      history = null;
      tiles = []; grid = emptyGrid(); queue.length = 0;
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
        if (s.vals[r][c]) addTile(s.vals[r][c], r, c).born = GROW * 0.7;
      }
      best = s.best; moves = s.moves; streak = s.streak; stream.s = s.stream;
      celebrated = copyObj(s.celebrated);
      // Tokens earned by the undone slide go too; the undo itself costs one.
      tokens = copyObj(s.tokens);
      tokens.undo = Math.max(0, tokens.undo - 1);
      api.setScore(s.score);
      stuck = false;
      rewindT = 0.45;
      updateSkin();
      onBestChanged();
      setTense(emptyCells().length <= 2);
      say('UNDO', tokenDef('undo').color);
      var m = M();
      if (m) {
        m.duck(0.35, 0.4);
        m.stinger([{ deg: 7 }, { deg: 4, at: 1 }, { deg: 2, at: 2 }, { deg: 0, at: 3 }], { inst: 'marimba', quantize: '16', octave: 1, gain: 0.5 });
      } else api.audio.arp([880, 660, 523, 440], 0.05, { type: 'triangle', vol: 0.12 });
    }
    function doSwap(a, b) {
      a.fr = a.r; a.fc = a.c; b.fr = b.r; b.fc = b.c;
      var ar = a.r, ac = a.c;
      a.r = b.r; a.c = b.c; b.r = ar; b.c = ac;
      grid[a.r][a.c] = a; grid[b.r][b.c] = b;
      a.swapping = b.swapping = true;
      tokens.swap--;
      history = null;
      slideKind = 'swap'; slideDur = SWAP_TIME; slideT = SWAP_TIME;
      var m = M();
      if (m) { m.note('bell', lvl(a.v) - 1, { octave: 1, quantize: '16', gain: 0.45 }); m.note('bell', lvl(b.v) - 1, { octave: 1, quantize: '8', gain: 0.45 }); }
      else api.audio.arp([660, 880], 0.07, { type: 'triangle', vol: 0.12 });
    }
    function doSmash(tl) {
      var cx = cellX(tl.c) + CELL / 2, cy = cellY(tl.r) + CELL / 2;
      grid[tl.r][tl.c] = null;
      tiles.splice(tiles.indexOf(tl), 1);
      tokens.smash--;
      history = null;
      api.fx.burst(cx, cy, SKINS[skinIdx].accent(tl.v), 26, 220, 0.5);
      api.fx.burst(cx, cy, '#ffffff', 10, 120, 0.3);
      rings.push({ x: cx, y: cy, t: 0 });
      api.shake(7);
      api.audio.noise(0.25, { vol: 0.3, cutoff: 900 });
      var m = M();
      if (m) { m.duck(0.4, 0.35); m.note('kick', 0, { quantize: '16', gain: 0.9 }); m.note('sub', -7, { quantize: '16', gain: 0.6 }); }
      setTense(emptyCells().length <= 2);
      checkStuck();
    }
    // Picker: a tile was chosen (by tap or by cursor + confirm).
    function choose(r, c) {
      if (slideT > 0) return;
      var tl = grid[r][c];
      pick.r = r; pick.c = c;
      if (pick.kind === 'smash') {
        if (!tl) { deny('PICK A TILE'); return; }
        if (tl.v > SMASH_MAX) { deny('SMASH ONLY BREAKS 2s AND 4s'); return; }
        pick = null;
        doSmash(tl);
        return;
      }
      if (!tl) { deny('PICK A TILE'); return; }
      if (!pick.first) { pick.first = tl; api.audio.tone(760, 0.05, { type: 'triangle', vol: 0.1 }); return; }
      if (pick.first === tl) { pick.first = null; return; }
      if (pick.first.v === tl.v) { deny('SWAP TWO DIFFERENT TILES'); return; }
      var a = pick.first;
      pick = null;
      doSwap(a, tl);
    }

    /* ------------------------------------------------------------ slides */
    // Slide one tile as far as it goes; merge into an equal, unmerged tile.
    function slideTile(r, c, dr, dc, res) {
      var tl = grid[r][c];
      if (!tl) return;
      var nr = r, nc = c;
      while (true) {
        var tr = nr + dr, tc = nc + dc;
        if (tr < 0 || tr >= N || tc < 0 || tc >= N) break;
        var other = grid[tr][tc];
        if (!other) { nr = tr; nc = tc; continue; }
        if (other.v === tl.v && !other.merged) {
          grid[r][c] = null;
          tl.r = tr; tl.c = tc; tl.dying = true;
          other.v *= 2; other.merged = true;       // `shown` keeps the old value until the slide lands
          res.gained += other.v;
          res.merges.push(other.v);
          res.moved = true;
          return;
        }
        break;
      }
      if (nr !== r || nc !== c) {
        grid[r][c] = null; grid[nr][nc] = tl;
        tl.r = nr; tl.c = nc;
        res.moved = true;
      }
    }
    function slide(dir) {
      var d = DIRS[dir], dr = d[0], dc = d[1];
      var order = [0, 1, 2, 3];
      if (dr > 0 || dc > 0) order.reverse();
      var snap = RACE ? null : snapshot();
      var bestBefore = best;
      var res = { moved: false, gained: 0, merges: [] };
      tiles.forEach(function (tl) { tl.fr = tl.r; tl.fc = tl.c; tl.merged = false; tl.swapping = false; });
      order.forEach(function (i) {
        order.forEach(function (j) { slideTile(dr ? i : j, dc ? i : j, dr, dc, res); });
      });
      if (!res.moved) { buzz(); return false; }
      history = snap;
      moves++;
      if (RACE && !race.started) race.started = true;
      slideKind = 'move';
      slideDur = queue.length ? SLIDE_FAST : SLIDE;
      slideT = slideDur;
      res.merges.forEach(function (v) { if (v > best) best = v; });
      mergeMusic(res.merges, best > bestBefore);
      if (res.gained && !RACE) {
        api.addScore(res.gained);
        if (res.merges.length > 1) api.fx.text(HEAD_X, 96, res.merges.length + ' MERGES +' + res.gained, ACCENT, 10);
      }
      awardCombos(res.merges.length);
      for (var v = MILESTONE_MIN; v <= best; v *= 2) {
        if (v > bestBefore && !celebrated[v]) { celebrated[v] = true; pendingCelebrations.push(v); }
      }
      if (RACE && best >= RACE_GOAL && !race.done) { race.done = true; queue.length = 0; }
      return true;
    }
    function mergeMusic(merged, newBest) {
      var m = M();
      if (m && merged.length) {
        // one marimba note per merge (distinct degrees ring together as a chord)
        var seen = {};
        merged.slice().sort(function (a, b) { return a - b; }).forEach(function (v) {
          var d = Math.min(12, lvl(v) - 1);
          if (seen[d] || d < 0) return;
          seen[d] = true;
          m.note('marimba', d, { octave: 1, quantize: '16', gain: 0.75 });
        });
      } else if (!m) {
        api.audio.tone(merged.length ? 330 + lvl(best) * 30 : 220, 0.06, { type: 'triangle', vol: merged.length ? 0.16 : 0.08 });
      }
      if (newBest) onBestChanged();
    }
    // The slide (or swap) animation landed.
    function afterSlide() {
      var skin = SKINS[skinIdx];
      tiles = tiles.filter(function (tl) { return !tl.dying; });
      tiles.forEach(function (tl) {
        tl.fr = tl.r; tl.fc = tl.c;
        if (tl.merged) {
          tl.shown = tl.v; tl.pop = POP; tl.merged = false;
          api.fx.burst(cellX(tl.c) + CELL / 2, cellY(tl.r) + CELL / 2, skin.accent(tl.v), tl.v >= 64 ? 14 : 8, 120, 0.4);
        }
        if (tl.swapping) { tl.swapping = false; tl.pop = POP; }
      });
      if (slideKind === 'move') spawn();
      pendingCelebrations.forEach(celebrate);
      pendingCelebrations.length = 0;
      updateSkin();
      setTense(emptyCells().length <= 2);
      checkStuck();
    }
    function checkStuck() {
      if (canMove()) { stuck = false; return; }
      if (RACE) {
        if (race.done || race.dnf) return;
        race.dnf = true; overT = 0;
        api.shake(6);
        api.audio.tone(200, 0.5, { type: 'sawtooth', slide: 0.5, vol: 0.22 });
        if (M()) M().setFilter(500, 0.6);
        return;
      }
      if (rescueAvailable()) {
        if (!stuck) { say('NO MOVES - USE A TOKEN', '#ffd23f'); api.audio.tone(330, 0.2, { type: 'triangle', slide: 0.7, vol: 0.14 }); }
        stuck = true;
        return;
      }
      endRun();
    }
    function endRun() {
      if (over) return;
      over = true; overT = 0; stuck = false; pick = null;
      api.shake(6);
      api.audio.tone(200, 0.5, { type: 'sawtooth', slide: 0.5, vol: 0.25 });
      if (M()) M().setFilter(500, 0.8);
    }

    /* ------------------------------------------------------ celebrations */
    function updateSkin() {
      var s = skinFor(best);
      if (s === skinIdx) return;
      prevSkin = skinIdx; skinIdx = s; skinT = 0;
    }
    function celebrate(v) {
      var ms = milestoneFor(v), L = lvl(v);
      var sub = [];
      var newSkin = skinFor(v);
      if (newSkin !== skinIdx && newSkin > skinIdx) sub.push('NEW SKIN: ' + SKINS[newSkin].name);
      if (RACE && v >= RACE_GOAL) {
        sub.unshift('FINISHED IN ' + fmtTime(race.elapsed));
      } else if (!RACE) {
        TOKENS.forEach(function (td) {
          if (ms.gift[td.key] && give(td.key, null)) sub.push('+' + ms.gift[td.key] + ' ' + td.label);
        });
      }
      var color = SKINS[newSkin].accent(v);
      notice = null;                      // the banner says it all
      banners.push({ title: RACE && v >= RACE_GOAL ? '512 - FINISHED!' : v === 2048 ? 'MERKLE ROOT' : v + '!', sub: sub.join('   '), color: color, t: 0 });
      throwConfetti(60 + (L - 7) * 18, newSkin);
      api.shake(Math.min(12, 3 + (L - 7) * 2));
      if (M()) { playStinger(v); M().duck(0.2, 0.6); }
      else api.audio.arp([523, 659, 784, 1047, 1319, 1568].slice(0, 3 + Math.min(3, L - 7)), 0.08, { type: 'square', vol: 0.18 });
    }
    function throwConfetti(n, skin) {
      var cols = [SKINS[skin].edge, '#ffffff', ACCENT, SKINS[skin].accent(2048), SKINS[skin].accent(64)];
      for (var i = 0; i < n; i++) {
        var fromLeft = i % 2 === 0;
        confetti.push({
          x: fromLeft ? BX - 6 : BX + BOARD + 6, y: BY + 30 + Math.random() * 120,
          vx: (fromLeft ? 1 : -1) * (80 + Math.random() * 240), vy: -160 - Math.random() * 260,
          rot: Math.random() * 6, vr: (Math.random() - 0.5) * 14, w: 4 + Math.random() * 5, h: 2 + Math.random() * 3,
          color: cols[i % cols.length], life: 2.2 + Math.random() * 0.8
        });
      }
      if (confetti.length > 420) confetti.splice(0, confetti.length - 420);
    }

    /* ------------------------------------------------------------ input */
    function tokenRect(i) {
      var gap = 10, bw = (BOARD - gap * 2) / 3;
      return { x: BX + i * (bw + gap), y: BAR_Y, w: bw, h: BAR_H - 6 };
    }
    function cellAt(p) {
      var c = Math.floor((p.x - BX - PAD / 2) / (CELL + PAD)), r = Math.floor((p.y - BY - PAD / 2) / (CELL + PAD));
      if (p.x < BX || p.x > BX + BOARD || p.y < BY || p.y > BY + BOARD) return null;
      return [U.clamp(r, 0, N - 1), U.clamp(c, 0, N - 1)];
    }
    function handleTap(p) {
      if (!RACE) {
        for (var i = 0; i < TOKENS.length; i++) if (inRect(p, tokenRect(i))) { activateToken(TOKENS[i].key); return; }
      }
      if (stuck && !pick && inRect(p, END_BTN)) { endRun(); return; }
      if (pick) {
        var cell = cellAt(p);
        if (cell) choose(cell[0], cell[1]);
        else { pick = null; say('CANCELLED'); }
      }
    }
    function readInput() {
      var inp = api.input, dirs = [], taps = [];
      inp.takeSwipes().forEach(function (s) { if (s === 'tap') taps.push(api.pointer()); else dirs.push(s); });
      DIR_NAMES.forEach(function (d) { if (inp.hit(d)) dirs.push(d); });
      var tokenKeys = [];
      if (!RACE) TOKENS.forEach(function (td) { if (inp.hit(td.keys[0]) || inp.hit(td.keys[1])) tokenKeys.push(td.key); });
      return { dirs: dirs, taps: taps, tokens: tokenKeys, confirm: inp.hit('a') || inp.hit('start'), start: inp.hit('start') };
    }

    /* ------------------------------------------------------------ update */
    function animate(dt) {
      tiles.forEach(function (tl) {
        if (tl.born > 0) tl.born = Math.max(0, tl.born - dt);
        if (tl.pop > 0) tl.pop = Math.max(0, tl.pop - dt);
      });
      if (skinT < 1) skinT = Math.min(1, skinT + dt / SKIN_FADE);
      if (rewindT > 0) rewindT = Math.max(0, rewindT - dt);
      if (notice) { notice.t -= dt; if (notice.t <= 0) notice = null; }
      TOKENS.forEach(function (td) { if (tokenFlash[td.key] > 0) tokenFlash[td.key] = Math.max(0, tokenFlash[td.key] - dt); });
      if (banners.length) { banners[0].t += dt; if (banners[0].t >= BANNER_TIME) banners.shift(); }
      for (var i = confetti.length - 1; i >= 0; i--) {
        var p = confetti[i];
        p.life -= dt;
        if (p.life <= 0 || p.y > H + 20) { confetti.splice(i, 1); continue; }
        p.vy += 420 * dt; p.vx *= 0.985; p.vy *= 0.99;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      }
      for (var k = rings.length - 1; k >= 0; k--) { rings[k].t += dt; if (rings[k].t > 0.4) rings.splice(k, 1); }
    }
    function updateRaceClock(dt) {
      if (!RACE) return;
      if (race.started && !race.done && !race.dnf) race.elapsed += dt;
      api.setScore(Math.round(race.elapsed * 100));
    }
    // End states: returns true while the run is winding down.
    function updateEnd(dt) {
      if (RACE && race.done && slideT === 0) {
        race.doneT += dt;
        if (race.doneT > FINISH_DELAY && !ended) { ended = true; api.finish(); }
        return true;
      }
      if ((RACE && race.dnf) || over) {
        overT += dt;
        if (overT > OVER_DELAY && !ended) { ended = true; api.gameOver(); }
        return true;
      }
      return false;
    }
    function updatePicker(inp) {
      inp.dirs.forEach(function (d) {
        if (!DIRS[d]) return;
        pick.r = U.clamp(pick.r + DIRS[d][0], 0, N - 1);
        pick.c = U.clamp(pick.c + DIRS[d][1], 0, N - 1);
      });
      if (inp.confirm) choose(pick.r, pick.c);
    }
    function statusText() {
      if (RACE) {
        if (race.done) return 'RACE TO 512 \u00b7 FINISHED IN ' + fmtTime(race.elapsed);
        if (race.dnf) return 'RACE TO 512 \u00b7 BOARD LOCKED \u00b7 DID NOT FINISH';
        return 'RACE TO 512 \u00b7 BEST ' + best + (race.started ? ' \u00b7 ' + fmtTime(race.elapsed) : ' \u00b7 CLOCK STARTS ON YOUR FIRST SLIDE');
      }
      return 'BEST TILE ' + best + ' \u00b7 MOVES ' + moves + ' \u00b7 UNDO ' + tokens.undo + ' SWAP ' + tokens.swap + ' SMASH ' + tokens.smash +
        (stuck ? ' \u00b7 NO MOVES' : '');
    }

    function update(dt) {
      t += dt;
      var inp = readInput();
      animate(dt);
      updateRaceClock(dt);
      if (slideT > 0) {
        slideT -= dt;
        if (slideT <= 0) { slideT = 0; afterSlide(); }
      }
      if (!updateEnd(dt)) {
        inp.taps.forEach(handleTap);
        inp.tokens.forEach(activateToken);
        if (pendingToken && slideT === 0) { var k = pendingToken; pendingToken = null; activateToken(k); }
        if (pick) updatePicker(inp);
        else {
          if (stuck && inp.start) endRun();
          inp.dirs.forEach(function (d) { if (queue.length < QUEUE_MAX) queue.push(d); });
          while (slideT === 0 && queue.length && !over && !race.done && !race.dnf) {
            if (slide(queue.shift())) break;
          }
        }
      }
      api.setStatus(statusText());
    }

    /* ------------------------------------------------------------ render */
    function drawHeader(ctx) {
      var skin = SKINS[skinIdx];
      ctx.fillStyle = 'rgba(255,226,189,0.55)';
      ctx.font = '700 9px ' + PIXEL; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(RACE ? 'RACE TO 512 \u00b7 BEST TILE' : 'BEST TILE', HEAD_X, 20);
      var pulse = 1 + (banners.length ? Math.sin(Math.min(1, banners[0].t * 3) * Math.PI) * 0.15 : 0);
      ctx.save();
      ctx.translate(HEAD_X, 52); ctx.scale(pulse, pulse);
      U.glowText(ctx, String(best), 0, 0, 30, skin.accent(Math.max(best, 8)));
      ctx.restore();
      ctx.fillStyle = 'rgba(255,226,189,0.45)';
      ctx.font = '700 10px ' + MONO;
      ctx.fillText(RACE ? 'GOAL ' + RACE_GOAL : 'MOVES ' + moves + '  \u00b7  SKIN ' + skin.name, HEAD_X, 84);
    }
    function drawBoardFrame(ctx) {
      var skin = SKINS[skinIdx];
      ctx.save();
      ctx.shadowColor = skin.edge; ctx.shadowBlur = 18;
      ctx.fillStyle = skin.board;
      U.roundRect(ctx, BX, BY, BOARD, BOARD, 14); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = rgba('#ffffff', 0.08); ctx.lineWidth = 1;
      U.roundRect(ctx, BX + 0.5, BY + 0.5, BOARD - 1, BOARD - 1, 14); ctx.stroke();
      ctx.fillStyle = skin.cell;
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { U.roundRect(ctx, cellX(c), cellY(r), CELL, CELL, TILE_R); ctx.fill(); }
    }
    function drawTiles(ctx, res) {
      var k = slideT > 0 ? 1 - slideT / slideDur : 1;
      var e = slideKind === 'swap' ? easeInOut(k) : easeOutCubic(k);
      var fade = skinT < 1 ? easeInOut(skinT) : 1;
      var list = tiles.slice().sort(function (a, b) { return (a.dying ? 0 : 1) - (b.dying ? 0 : 1) || (a.swapping ? 1 : 0) - (b.swapping ? 1 : 0); });
      list.forEach(function (tl) {
        var x = cellX(tl.fc) + (cellX(tl.c) - cellX(tl.fc)) * e + CELL / 2;
        var y = cellY(tl.fr) + (cellY(tl.r) - cellY(tl.fr)) * e + CELL / 2;
        var s = 1;
        if (tl.born > 0) s = easeOutBack(1 - tl.born / GROW) * 0.98 + 0.02;
        if (tl.pop > 0) s = 1 + Math.sin((1 - tl.pop / POP) * Math.PI) * 0.18;
        if (tl.swapping && slideT > 0) s = 1 + Math.sin(k * Math.PI) * 0.16;
        if (fade < 1) {
          drawTile(ctx, prevSkin, tl.shown, x, y, s, 1, res);
          drawTile(ctx, skinIdx, tl.shown, x, y, s, fade, res);
        } else drawTile(ctx, skinIdx, tl.shown, x, y, s, 1, res);
      });
    }
    function drawPicker(ctx) {
      if (!pick) return;
      var def = tokenDef(pick.kind), a = 0.55 + Math.sin(t * 8) * 0.35;
      // dim tiles that SMASH cannot take
      if (pick.kind === 'smash') {
        ctx.fillStyle = 'rgba(5,4,15,0.5)';
        tiles.forEach(function (tl) { if (tl.v > SMASH_MAX) { U.roundRect(ctx, cellX(tl.c), cellY(tl.r), CELL, CELL, TILE_R); ctx.fill(); } });
      }
      if (pick.first) {
        ctx.strokeStyle = def.color; ctx.lineWidth = 3.5;
        U.roundRect(ctx, cellX(pick.first.c) - 3, cellY(pick.first.r) - 3, CELL + 6, CELL + 6, TILE_R + 3); ctx.stroke();
      }
      ctx.save();
      ctx.globalAlpha = a;
      ctx.strokeStyle = def.color; ctx.lineWidth = 2.5; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t * 30;
      U.roundRect(ctx, cellX(pick.c) - 5, cellY(pick.r) - 5, CELL + 10, CELL + 10, TILE_R + 5); ctx.stroke();
      ctx.restore();
      if (pick.kind === 'smash') {        // crosshair ticks outside the tile, so the number stays readable
        var cx = cellX(pick.c) + CELL / 2, cy = cellY(pick.r) + CELL / 2, o = CELL / 2 + 4;
        ctx.strokeStyle = def.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx - o - 8, cy); ctx.lineTo(cx - o + 2, cy); ctx.moveTo(cx + o - 2, cy); ctx.lineTo(cx + o + 8, cy);
        ctx.moveTo(cx, cy - o - 8); ctx.lineTo(cx, cy - o + 2); ctx.moveTo(cx, cy + o - 2); ctx.lineTo(cx, cy + o + 8); ctx.stroke();
      }
    }
    function drawRings(ctx) {
      rings.forEach(function (r) {
        var k = r.t / 0.4;
        ctx.strokeStyle = 'rgba(255,255,255,' + (1 - k) * 0.8 + ')'; ctx.lineWidth = 3 * (1 - k) + 0.5;
        ctx.beginPath(); ctx.arc(r.x, r.y, 10 + k * 60, 0, Math.PI * 2); ctx.stroke();
      });
    }
    function drawStrip(ctx, title, sub, color, alpha) {
      var cy = BY + BOARD / 2;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(6,4,14,0.82)'; ctx.fillRect(0, cy - 38, W, 76);
      ctx.fillStyle = color; ctx.fillRect(0, cy - 38, W, 2); ctx.fillRect(0, cy + 36, W, 2);
      U.glowText(ctx, title, W / 2, cy - (sub ? 9 : 0), 20, color);
      if (sub) {
        ctx.fillStyle = 'rgba(255,240,220,0.85)'; ctx.font = '700 11px ' + MONO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(sub, W / 2, cy + 20);
      }
      ctx.restore();
    }
    function drawBanner(ctx) {
      var b = banners[0];
      if (!b) return;
      var p = b.t / BANNER_TIME, cy = BY + BOARD / 2;
      var off = p < 0.15 ? (1 - easeOutBack(p / 0.15)) * -W : p > 0.85 ? easeInOut((p - 0.85) / 0.15) * W : 0;
      ctx.save();
      ctx.translate(off, 0);
      if (p > 0.85) ctx.globalAlpha = 1 - (p - 0.85) / 0.15;
      ctx.fillStyle = 'rgba(6,4,14,0.8)'; ctx.fillRect(0, cy - 46, W, 92);
      ctx.fillStyle = b.color; ctx.fillRect(0, cy - 46, W, 3); ctx.fillRect(0, cy + 43, W, 3);
      // ribbon tails
      var ga = ctx.globalAlpha;
      ctx.globalAlpha = ga * 0.5; ctx.fillRect(0, cy - 40, W, 1); ctx.fillRect(0, cy + 39, W, 1); ctx.globalAlpha = ga;
      var sz = b.title.length > 6 ? 22 : 32;
      U.glowText(ctx, b.title, W / 2, cy - (b.sub ? 10 : 0), sz, b.color);
      if (b.sub) {
        ctx.fillStyle = '#fff4e0'; ctx.font = '700 9px ' + PIXEL; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(b.sub, W / 2, cy + 26);
      }
      ctx.restore();
    }
    function drawConfetti(ctx) {
      for (var i = 0; i < confetti.length; i++) {
        var p = confetti[i];
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life * 1.5);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2 * Math.abs(Math.cos(p.rot * 1.7)), p.w, p.h);
        ctx.restore();
      }
    }
    function drawTokenIcon(ctx, kind, x, y, color) {
      ctx.save();
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      if (kind === 'undo') {
        ctx.arc(x, y, 8, -Math.PI * 0.9, Math.PI * 0.6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 12, y - 5); ctx.lineTo(x - 7.5, y - 1); ctx.lineTo(x - 4, y - 7); ctx.stroke();
      } else if (kind === 'swap') {
        ctx.moveTo(x - 9, y - 4); ctx.lineTo(x + 8, y - 4); ctx.moveTo(x + 4, y - 8); ctx.lineTo(x + 8, y - 4); ctx.lineTo(x + 4, y);
        ctx.moveTo(x + 9, y + 5); ctx.lineTo(x - 8, y + 5); ctx.moveTo(x - 4, y + 1); ctx.lineTo(x - 8, y + 5); ctx.lineTo(x - 4, y + 9);
        ctx.stroke();
      } else {
        for (var i = 0; i < 8; i++) {
          var a = i * Math.PI / 4, r0 = i % 2 ? 4 : 3, r1 = i % 2 ? 8 : 11;
          ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
    function drawTokenBar(ctx) {
      TOKENS.forEach(function (td, i) {
        var rc = tokenRect(i), n = tokens[td.key], on = n > 0, active = pick && pick.kind === td.key;
        var flash = tokenFlash[td.key];
        ctx.save();
        ctx.fillStyle = active ? rgba(td.color, 0.28) : 'rgba(12,8,20,0.72)';
        U.roundRect(ctx, rc.x, rc.y, rc.w, rc.h, 10); ctx.fill();
        if (flash > 0) { ctx.fillStyle = rgba(td.color, flash * 0.5); U.roundRect(ctx, rc.x, rc.y, rc.w, rc.h, 10); ctx.fill(); }
        ctx.strokeStyle = on || active ? td.color : 'rgba(255,255,255,0.14)';
        ctx.lineWidth = active ? 2.5 : 1.5;
        if (on) { ctx.shadowColor = td.color; ctx.shadowBlur = active ? 14 : 6; }
        U.roundRect(ctx, rc.x + 0.5, rc.y + 0.5, rc.w - 1, rc.h - 1, 10); ctx.stroke();
        ctx.restore();
        var col = on ? td.color : 'rgba(255,255,255,0.3)';
        drawTokenIcon(ctx, td.key, rc.x + 22, rc.y + rc.h / 2, col);
        ctx.fillStyle = on ? '#fff4e6' : 'rgba(255,255,255,0.35)';
        ctx.font = '700 11px ' + PIXEL; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(td.label, rc.x + 40, rc.y + 17);
        for (var p = 0; p < TOKEN_MAX; p++) {       // count pips
          ctx.beginPath(); ctx.arc(rc.x + 45 + p * 12, rc.y + 33, 3.8, 0, Math.PI * 2);
          if (p < n) { ctx.fillStyle = td.color; ctx.fill(); }
          else { ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1; ctx.stroke(); }
        }
        ctx.fillStyle = 'rgba(255,226,189,0.45)'; ctx.font = '700 9px ' + MONO;
        ctx.fillText(td.hint, rc.x + 40, rc.y + 47);
      });
    }
    function drawRaceHud(ctx) {
      var x = BX, y = BAR_Y, w = BOARD, h = BAR_H - 6;
      ctx.fillStyle = 'rgba(12,8,20,0.72)';
      U.roundRect(ctx, x, y, w, h, 10); ctx.fill();
      ctx.strokeStyle = race.done ? '#39ff88' : race.dnf ? '#ff4d6d' : 'rgba(255,174,63,0.6)'; ctx.lineWidth = 1.5;
      U.roundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 10); ctx.stroke();
      var col = race.done ? '#39ff88' : race.dnf ? '#ff4d6d' : '#ffe2bd';
      U.glowText(ctx, fmtTime(race.elapsed), x + 92, y + h / 2, 18, col);
      // progress ladder 2 .. 512
      var lx = x + 184, lw = w - 224, ly = y + h / 2 + 2, steps = lvl(RACE_GOAL);
      var prog = U.clamp((lvl(best) - 1) / (steps - 1), 0, 1);
      ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(lx, ly - 3, lw, 6);
      ctx.fillStyle = col; ctx.fillRect(lx, ly - 3, lw * prog, 6);
      ctx.font = '700 8px ' + MONO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      [64, 128, 256, 512].forEach(function (v) {
        var px = lx + lw * (lvl(v) - 1) / (steps - 1);
        ctx.fillStyle = best >= v ? col : 'rgba(255,255,255,0.35)';
        ctx.fillRect(px - 1, ly - 7, 2, 14);
        ctx.fillText(String(v), px, ly - 14);
      });
      ctx.fillStyle = 'rgba(255,226,189,0.45)'; ctx.fillText('BEST ' + best, lx + lw / 2, ly + 16);
    }
    function drawHint(ctx) {
      var text = null, color = '#ffe2bd', alpha = 0.85;
      if (notice) { text = notice.text; color = notice.color; alpha = Math.min(1, notice.t * 3); }
      else if (pick) text = pick.kind === 'swap' ? (pick.first ? 'PICK THE SECOND TILE' : 'SWAP: TAP TWO TILES \u00b7 ARROWS + SPACE') : 'SMASH: TAP A 2 OR 4 \u00b7 ARROWS + SPACE';
      else if (RACE && !race.started) text = 'CLOCK STARTS ON YOUR FIRST SLIDE';
      else if (moves === 0) { text = 'SWIPE OR USE THE ARROWS'; alpha = 0.6 + Math.sin(t * 5) * 0.4; }
      if (stuck && !pick) {
        ctx.fillStyle = 'rgba(255,90,90,0.18)'; U.roundRect(ctx, END_BTN.x, END_BTN.y, END_BTN.w, END_BTN.h, 6); ctx.fill();
        ctx.strokeStyle = '#ff7a6b'; ctx.lineWidth = 1; U.roundRect(ctx, END_BTN.x + 0.5, END_BTN.y + 0.5, END_BTN.w - 1, END_BTN.h - 1, 6); ctx.stroke();
        ctx.fillStyle = '#ffd0c8'; ctx.font = '700 8px ' + PIXEL; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('END RUN (ENTER)', W / 2, END_BTN.y + END_BTN.h / 2 + 1);
        return;
      }
      if (!text) return;
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.fillStyle = color; ctx.font = '700 9px ' + PIXEL; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, W / 2, HINT_Y);
      ctx.restore();
    }
    function drawRewind(ctx) {
      if (rewindT <= 0) return;
      var a = rewindT / 0.45;
      ctx.save();
      ctx.globalAlpha = a * 0.5;
      ctx.fillStyle = '#7fd4ff';
      for (var y = BY + ((t * 400) % 12); y < BY + BOARD; y += 12) ctx.fillRect(BX, y, BOARD, 2);
      ctx.globalAlpha = a;
      U.glowText(ctx, '\u25c0\u25c0 UNDO', W / 2, BY + BOARD / 2, 18, '#7fd4ff');
      ctx.restore();
    }
    function drawEndStates(ctx) {
      if (stuck && !pick) drawStrip(ctx, 'NO MOVES', 'USE A TOKEN BELOW - OR END THE RUN', '#ffd23f', 1);
      if (over) {
        ctx.fillStyle = 'rgba(5,4,15,' + Math.min(0.5, overT) + ')';
        U.roundRect(ctx, BX, BY, BOARD, BOARD, 14); ctx.fill();
        drawStrip(ctx, 'BOARD LOCKED', 'BEST TILE ' + best + ' IN ' + moves + ' MOVES', '#ff9a8a', Math.min(1, overT * 3));
      }
      if (RACE && race.dnf) {
        ctx.fillStyle = 'rgba(5,4,15,' + Math.min(0.5, overT) + ')';
        U.roundRect(ctx, BX, BY, BOARD, BOARD, 14); ctx.fill();
        drawStrip(ctx, 'DID NOT FINISH', 'BOARD LOCKED AT BEST TILE ' + best, '#ff4d6d', Math.min(1, overT * 3));
      }
    }

    function render(ctx) {
      var res = resFor(ctx);
      ctx.drawImage(backdrop(res), 0, 0, W, H);
      drawRain(ctx, t);
      drawLampPulse(ctx, M() ? M().pulse(5) : 0);
      drawHeader(ctx);
      drawBoardFrame(ctx);
      drawTiles(ctx, res);
      drawRings(ctx);
      drawPicker(ctx);
      drawRewind(ctx);
      drawEndStates(ctx);
      drawBanner(ctx);
      drawConfetti(ctx);
      if (RACE) drawRaceHud(ctx); else drawTokenBar(ctx);
      drawHint(ctx);
    }

    /* ------------------------------------------------------------ debug
       Read-only view of the run for tests and QA (copies, never live state). */
    function debug() {
      return {
        mode: api.mode, variant: api.variant, board: valuesOf(), best: best, moves: moves, score: api.getScore(),
        tokens: copyObj(tokens), canUndo: !!history, skin: SKINS[skinIdx].key, queued: queue.length, animating: slideT > 0,
        pick: pick ? { kind: pick.kind, r: pick.r, c: pick.c, first: pick.first ? [pick.first.r, pick.first.c] : null } : null,
        stuck: stuck, dead: over || race.dnf, streak: streak, celebrated: Object.keys(celebrated).map(Number),
        race: RACE ? { started: race.started, elapsed: Math.round(race.elapsed * 1000) / 1000, finished: race.done, dnf: race.dnf } : null
      };
    }

    var inst = { update: update, render: render, debug: debug };
    return inst;
  }

  /* ================================================================ attract
     The cabinet preview: the study backdrop with a demo board cycling
     through the four skins.                                               */
  var DEMO = [[2, 4, 8, 16], [256, 128, 64, 32], [512, 1024, 2048, 4096], [0, 8, 2, 0]];
  function attract(ctx, w, h, t) {
    var k = Math.max(w / W, h / H);
    ctx.save();
    ctx.translate((w - W * k) / 2, (h - H * k) / 2); ctx.scale(k, k);
    ctx.drawImage(backdrop(resFor(ctx)), 0, 0, W, H);
    drawRain(ctx, t);
    ctx.restore();
    var skinIdx = Math.floor(t / 3.5) % SKINS.length, skin = SKINS[skinIdx];
    var size = Math.min(w * 0.86, h * 0.72), x0 = (w - size) / 2, y0 = (h - size) / 2 + h * 0.06;
    var pad = size * 0.03, cell = (size - pad * 5) / 4, sc = cell / CELL;
    ctx.save();
    ctx.shadowColor = skin.edge; ctx.shadowBlur = 14;
    ctx.fillStyle = skin.board; U.roundRect(ctx, x0, y0, size, size, size * 0.04); ctx.fill();
    ctx.restore();
    var res = resFor(ctx, sc), step = Math.floor(t * 1.2);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      var cx = x0 + pad + c * (cell + pad) + cell / 2, cy = y0 + pad + r * (cell + pad) + cell / 2;
      ctx.fillStyle = skin.cell; U.roundRect(ctx, cx - cell / 2, cy - cell / 2, cell, cell, cell * 0.1); ctx.fill();
      var v = DEMO[r][c];
      if (!v || (r * 4 + c + step) % 7 === 0) continue;
      var pop = (r * 4 + c) === step % 16 ? 1 + Math.sin((t * 1.2 % 1) * Math.PI) * 0.12 : 1;
      drawTile(ctx, skinIdx, v, cx, cy, sc * pop, 1, res);
    }
    U.glowText(ctx, skin.name, w / 2, y0 - Math.max(10, h * 0.05), Math.max(8, Math.round(h * 0.045)), skin.edge);
  }

  XA.registerGame({
    id: 'xa_merge_2048',
    order: 11,
    title: 'Merkle Match',
    tagline: 'Slide, merge, reach 2048 and beyond.',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'dpad',
    controls: 'Arrows / WASD or swipe to slide. Earned tokens: Z/1 undo, X/2 swap, C/3 smash (tap tiles or arrows + Space)',
    modeLabel: 'Classic',
    variants: [{ key: 'race', label: 'Race to 512', mode: 'time', tagline: 'Make a 512 tile. Fastest time wins.' }],
    create: create,
    attract: attract
  });
})(window);
