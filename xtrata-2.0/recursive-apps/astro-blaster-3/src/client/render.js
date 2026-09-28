// ---------------------------------------------------------------------------
// Renderer: neon vector look on canvas. Reads sim state; never changes it.
// Cosmetic randomness (particles, flicker) uses Math.random, which is fine
// here because nothing in this file feeds back into the simulation.
// ---------------------------------------------------------------------------

var PALETTES = [
  { name: 'Perimeter Drift', bgTop: '#050a1f', bgBot: '#0a1636', main: '#39e6ff', alt: '#ff4fd8', neb: ['#1b3b8f', '#3a1670', '#0f5a7a'], star: '#bfe9ff' },
  { name: 'Ember Belt',      bgTop: '#140505', bgBot: '#2a0c07', main: '#ff8a3d', alt: '#ffd23f', neb: ['#7a1f0c', '#5a1030', '#8a4a10'], star: '#ffd9c2' },
  { name: 'Nebula Veil',     bgTop: '#0c0418', bgBot: '#1d0a33', main: '#b86bff', alt: '#3dffc8', neb: ['#4a1a8a', '#1a3a7a', '#6a1a6a'], star: '#e6d2ff' },
  { name: 'Glass Reef',      bgTop: '#021214', bgBot: '#062a2c', main: '#5fffd0', alt: '#9fd8ff', neb: ['#0a5a5a', '#0a3a6a', '#1a6a4a'], star: '#d2fff4' },
  { name: 'Storm Corridor',  bgTop: '#070a12', bgBot: '#121a2a', main: '#ffe14d', alt: '#6aa8ff', neb: ['#2a3a6a', '#3a3a1a', '#1a2a4a'], star: '#fff6c8' },
  { name: 'The Source',      bgTop: '#0f0208', bgBot: '#240616', main: '#ff4f9a', alt: '#ffd76a', neb: ['#6a0a3a', '#3a0a5a', '#7a3a0a'], star: '#ffd6ea' }
];
var WEAPON_COLORS = { pulse: '#5ff4ff', scatter: '#7dff7a', lance: '#c7d8ff', missile: '#ffa34d', drone: '#9ef7ff' };

var R = (function () {
  var cv, ctx, dpr = 1, cw = 0, ch = 0, scale = 1, ox = 0, oy = 0;
  var sprites = {};
  var particles = [];
  var stars = [];
  var nebulae = [];
  var shake = 0, flashA = 0, flashColor = '#fff';
  var palIdx = 0, palFrom = 0, palT = 1;
  var time = 0;
  var settings = { shake: true, flashes: true, contrast: false };
  var lightningFlash = 0;
  var fogCanvas = null;
  var lastChainLost = 0;

  function init(canvas) {
    cv = canvas; ctx = cv.getContext('2d');
    for (var i = 0; i < 170; i++) stars.push({ x: Math.random() * 1200 - 420, y: Math.random() * 640, z: Math.random() < 0.6 ? 1 : (Math.random() < 0.7 ? 2 : 3), tw: Math.random() * 6 });
    for (var j = 0; j < 7; j++) nebulae.push({ x: Math.random() * 1000 - 320, y: Math.random() * 900 - 130, r: 140 + Math.random() * 220, c: j % 3, sp: 0.08 + Math.random() * 0.12 });
    resize();
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = window.innerWidth; ch = window.innerHeight;
    cv.width = Math.floor(cw * dpr); cv.height = Math.floor(ch * dpr);
    cv.style.width = cw + 'px'; cv.style.height = ch + 'px';
    scale = Math.min(cw / AB3.W, ch / AB3.H);
    ox = (cw - AB3.W * scale) / 2; oy = (ch - AB3.H * scale) / 2;
    fogCanvas = null;
  }

  function toScreen(x, y) { return [ox + x * scale, oy + y * scale]; }
  function toWorld(sx, sy) { return [(sx - ox) / scale, (sy - oy) / scale]; }
  function metrics() { return { scale: scale, ox: ox, oy: oy, cw: cw, ch: ch }; }

  // ---------------------------------------------------------------- sprites
  function sprite(key, w, h, draw) {
    var s = sprites[key];
    if (s) return s;
    var c = document.createElement('canvas');
    var k = 2; // supersample for crispness when scaled up
    c.width = Math.ceil(w * k); c.height = Math.ceil(h * k);
    var g = c.getContext('2d');
    g.scale(k, k);
    draw(g, w, h);
    s = { c: c, w: w, h: h };
    sprites[key] = s;
    return s;
  }
  function blit(s, x, y, rotA, alpha) {
    if (alpha != null) ctx.globalAlpha = alpha;
    if (rotA) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rotA);
      ctx.drawImage(s.c, -s.w / 2, -s.h / 2, s.w, s.h);
      ctx.restore();
    } else ctx.drawImage(s.c, x - s.w / 2, y - s.h / 2, s.w, s.h);
    if (alpha != null) ctx.globalAlpha = 1;
  }

  function glowOrb(color, r, core) {
    return sprite('orb' + color + r + (core || ''), r * 5, r * 5, function (g, w) {
      var cx = w / 2;
      var gr = g.createRadialGradient(cx, cx, 0, cx, cx, w / 2);
      gr.addColorStop(0, color); gr.addColorStop(0.28, color); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.globalAlpha = 0.55; g.fillStyle = gr; g.beginPath(); g.arc(cx, cx, w / 2, 0, 6.2832); g.fill();
      g.globalAlpha = 1; g.fillStyle = color; g.beginPath(); g.arc(cx, cx, r, 0, 6.2832); g.fill();
      g.fillStyle = core || '#fff'; g.beginPath(); g.arc(cx, cx, r * 0.55, 0, 6.2832); g.fill();
    });
  }

  function shapeSprite(key, size, color, fill, pathFn, white) {
    var k = key + color + (white ? 'W' : '');
    return sprite(k, size, size, function (g, w) {
      g.translate(w / 2, w / 2);
      g.lineJoin = 'round'; g.lineCap = 'round';
      g.shadowColor = color; g.shadowBlur = size * 0.18;
      g.strokeStyle = white ? '#ffffff' : color; g.lineWidth = Math.max(1.6, size * 0.045);
      g.fillStyle = white ? 'rgba(255,255,255,0.85)' : (fill || 'rgba(8,10,30,0.75)');
      pathFn(g, size);
      g.shadowBlur = 0;
      g.lineWidth = Math.max(1, size * 0.02); g.strokeStyle = 'rgba(255,255,255,0.55)';
      pathFn(g, size, true);
    });
  }

  // path helpers draw in a box of `size` centred on 0,0; second pass (inner=true) adds detail
  var SHAPES = {
    dart: function (g, s, inner) {
      if (inner) { g.beginPath(); g.moveTo(0, s * 0.18); g.lineTo(0, -s * 0.15); g.stroke(); return; }
      g.beginPath(); g.moveTo(0, s * 0.32); g.lineTo(s * 0.24, -s * 0.24); g.lineTo(0, -s * 0.12); g.lineTo(-s * 0.24, -s * 0.24); g.closePath(); g.fill(); g.stroke();
    },
    weaver: function (g, s, inner) {
      if (inner) { g.beginPath(); g.arc(0, 0, s * 0.07, 0, 6.28); g.stroke(); return; }
      g.beginPath(); g.moveTo(0, s * 0.3); g.lineTo(s * 0.14, 0); g.lineTo(s * 0.34, -s * 0.12); g.lineTo(s * 0.12, -s * 0.2); g.lineTo(0, -s * 0.3);
      g.lineTo(-s * 0.12, -s * 0.2); g.lineTo(-s * 0.34, -s * 0.12); g.lineTo(-s * 0.14, 0); g.closePath(); g.fill(); g.stroke();
    },
    swarmer: function (g, s, inner) {
      if (inner) return;
      g.beginPath(); g.moveTo(0, s * 0.3); g.lineTo(s * 0.3, -s * 0.22); g.lineTo(0, -s * 0.05); g.lineTo(-s * 0.3, -s * 0.22); g.closePath(); g.fill(); g.stroke();
    },
    gunship: function (g, s, inner) {
      if (inner) { g.beginPath(); g.moveTo(-s * 0.12, s * 0.05); g.lineTo(s * 0.12, s * 0.05); g.stroke(); g.beginPath(); g.arc(0, -s * 0.06, s * 0.06, 0, 6.28); g.stroke(); return; }
      g.beginPath();
      for (var i = 0; i < 6; i++) { var a = i / 6 * 6.2832 + 0.5236; g.lineTo(Math.cos(a) * s * 0.26, Math.sin(a) * s * 0.26); }
      g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.rect(-s * 0.42, -s * 0.08, s * 0.12, s * 0.3); g.rect(s * 0.3, -s * 0.08, s * 0.12, s * 0.3); g.fill(); g.stroke();
    },
    splitter: function (g, s, inner) {
      if (inner) { g.beginPath(); g.moveTo(0, -s * 0.2); g.lineTo(0, s * 0.2); g.stroke(); return; }
      g.beginPath(); g.arc(-s * 0.12, 0, s * 0.2, 0, 6.28); g.fill(); g.stroke();
      g.beginPath(); g.arc(s * 0.12, 0, s * 0.2, 0, 6.28); g.fill(); g.stroke();
    },
    minelayer: function (g, s, inner) {
      if (inner) { for (var i = -1; i <= 1; i++) { g.beginPath(); g.arc(i * s * 0.14, 0, s * 0.04, 0, 6.28); g.stroke(); } return; }
      g.beginPath(); g.ellipse(0, 0, s * 0.4, s * 0.18, 0, 0, 6.28); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(-s * 0.1, s * 0.18); g.lineTo(0, s * 0.3); g.lineTo(s * 0.1, s * 0.18); g.stroke();
    },
    bearer: function (g, s, inner) {
      if (inner) { g.beginPath(); g.rect(-s * 0.08, -s * 0.08, s * 0.16, s * 0.16); g.stroke(); return; }
      g.beginPath(); g.rect(-s * 0.22, -s * 0.24, s * 0.44, s * 0.36); g.fill(); g.stroke();
    },
    sniper: function (g, s, inner) {
      if (inner) { g.beginPath(); g.arc(0, -s * 0.05, s * 0.07, 0, 6.28); g.stroke(); return; }
      g.beginPath(); g.moveTo(0, s * 0.36); g.lineTo(s * 0.13, -s * 0.2); g.lineTo(s * 0.3, -s * 0.3); g.lineTo(0, -s * 0.22); g.lineTo(-s * 0.3, -s * 0.3); g.lineTo(-s * 0.13, -s * 0.2); g.closePath(); g.fill(); g.stroke();
    },
    carrier: function (g, s, inner) {
      if (inner) { for (var i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * s * 0.12, -s * 0.12); g.lineTo(i * s * 0.12, s * 0.14); g.stroke(); } return; }
      g.beginPath(); roundRect(g, -s * 0.42, -s * 0.24, s * 0.84, s * 0.48, s * 0.1); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(-s * 0.2, s * 0.24); g.lineTo(-s * 0.12, s * 0.34); g.lineTo(s * 0.12, s * 0.34); g.lineTo(s * 0.2, s * 0.24); g.stroke();
    },
    turret: function (g, s, inner) {
      if (inner) { g.beginPath(); g.arc(0, 0, s * 0.1, 0, 6.28); g.stroke(); return; }
      g.beginPath();
      for (var i = 0; i < 8; i++) { var a = i / 8 * 6.2832; var r = i % 2 ? s * 0.3 : s * 0.36; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      g.closePath(); g.fill(); g.stroke();
    },
    mirror: function (g, s, inner) {
      g.beginPath();
      var rr = inner ? s * 0.16 : s * 0.34;
      for (var i = 0; i < 6; i++) { var a = i / 6 * 6.2832; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      g.closePath(); if (!inner) g.fill(); g.stroke();
    },
    crystal: function (g, s, inner) {
      if (inner) { g.beginPath(); g.moveTo(0, -s * 0.4); g.lineTo(0, s * 0.4); g.stroke(); return; }
      g.beginPath(); g.moveTo(0, -s * 0.44); g.lineTo(s * 0.16, 0); g.lineTo(0, s * 0.44); g.lineTo(-s * 0.16, 0); g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(s * 0.2, -s * 0.2); g.lineTo(s * 0.3, -s * 0.05); g.lineTo(s * 0.2, s * 0.14); g.lineTo(s * 0.12, -s * 0.02); g.closePath(); g.fill(); g.stroke();
    }
  };
  var ROCK_PTS = [];
  for (var ri = 0; ri < 9; ri++) ROCK_PTS.push(0.72 + ((ri * 7919) % 13) / 13 * 0.28);
  SHAPES.rock = function (g, s, inner) {
    if (inner) { g.beginPath(); g.moveTo(-s * 0.1, -s * 0.08); g.lineTo(s * 0.06, s * 0.04); g.stroke(); return; }
    g.beginPath();
    for (var i = 0; i < 9; i++) { var a = i / 9 * 6.2832; g.lineTo(Math.cos(a) * s * 0.4 * ROCK_PTS[i], Math.sin(a) * s * 0.4 * ROCK_PTS[i]); }
    g.closePath(); g.fill(); g.stroke();
  };
  SHAPES.pebble = SHAPES.rock;

  function roundRect(g, x, y, w, h, r) {
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
  }

  function enemyColor(e, pal) {
    if (e.elite) return '#ffd76a';
    switch (e.t) {
      case 'rock': case 'pebble': return '#c9a27a';
      case 'crystal': return '#e8fbff';
      case 'mirror': return '#d8c8ff';
      case 'sniper': return '#ff5f6d';
      case 'gunship': case 'carrier': case 'turret': return pal.alt;
      default: return pal.main;
    }
  }

  // ---------------------------------------------------------------- particles
  function addP(o) { if (particles.length < 1400) particles.push(o); }
  function burst(x, y, color, n, speed, life, size) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.2832, sp = speed * (0.3 + Math.random() * 0.9);
      addP({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: life * (0.6 + Math.random() * 0.6), size: size * (0.5 + Math.random()), color: color, k: 'spark' });
    }
  }
  function ring(x, y, color, r, life) { addP({ x: x, y: y, vx: 0, vy: 0, life: 0, max: life, size: r, color: color, k: 'ring' }); }
  function text(x, y, str, color, size) { addP({ x: x, y: y, vx: 0, vy: -0.6, life: 0, max: 50, size: size || 11, color: color, k: 'text', str: str }); }

  function onEvents(st, events) {
    var pal = PALETTES[st.sector];
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      switch (e.type) {
        case 'kill':
          burst(e.x, e.y, e.elite ? '#ffd76a' : pal.main, e.big ? 34 : 16, e.big ? 4 : 3, 34, e.big ? 3 : 2.2);
          burst(e.x, e.y, '#ffffff', 6, 2, 18, 1.6);
          ring(e.x, e.y, e.elite ? '#ffd76a' : pal.main, e.big ? 40 : 22, 22);
          if (e.pts >= 300) text(e.x, e.y - 8, fmt(e.pts), '#fff', e.pts >= 2000 ? 13 : 10);
          addShake(e.big ? 5 : 1.5);
          break;
        case 'hit': burst(e.x, e.y, '#ffffff', 2, 1.8, 10, 1.4); break;
        case 'block': case 'shieldHit': burst(e.x, e.y, '#9fd8ff', 3, 1.6, 12, 1.4); break;
        case 'ricochet': burst(e.x, e.y, '#e8fbff', 4, 2.2, 14, 1.4); break;
        case 'reflect': ring(e.x, e.y, '#d8c8ff', 12, 14); break;
        case 'graze': addP({ x: e.x, y: e.y, vx: 0, vy: 0, life: 0, max: 12, size: 3, color: '#ffffff', k: 'spark' }); break;
        case 'scrap': addP({ x: e.x, y: e.y, vx: 0, vy: -0.5, life: 0, max: 14, size: 2.4, color: '#7dffb0', k: 'spark' }); break;
        case 'playerHit':
          burst(e.x, e.y, '#ff4f6a', 40, 4.5, 44, 2.6); ring(e.x, e.y, '#ff4f6a', 70, 30);
          addShake(12); flash('#ff2040', 0.35); break;
        case 'shieldBreak': burst(e.x, e.y, '#9fd8ff', 30, 3.5, 34, 2.2); ring(e.x, e.y, '#9fd8ff', 60, 26); addShake(6); flash('#9fd8ff', 0.2); break;
        case 'playerDie': burst(e.x, e.y, '#ffffff', 60, 6, 70, 3); ring(e.x, e.y, '#ff4f6a', 140, 50); addShake(20); break;
        case 'bomb':
          ring(e.x, e.y, '#ffffff', 420, 40); ring(e.x, e.y, pal.alt, 300, 34); flash('#ffffff', 0.55); addShake(14); break;
        case 'mineBurst': ring(e.x, e.y, '#ff4f6a', 20, 14); break;
        case 'bossPartDown': burst(e.x, e.y, '#ffffff', 26, 4, 40, 2.4); burst(e.x, e.y, pal.alt, 30, 3, 50, 2.6); ring(e.x, e.y, pal.alt, e.r * 3, 30); addShake(8); break;
        case 'bossDead':
          for (var k = 0; k < 5; k++) burst(e.x + (Math.random() - 0.5) * 60, e.y + (Math.random() - 0.5) * 40, k % 2 ? '#ffffff' : pal.alt, 40, 5, 70, 3);
          ring(e.x, e.y, '#ffffff', 300, 60); flash('#ffffff', 0.6); addShake(24); break;
        case 'lightning': lightningFlash = 1; addShake(4); break;
        case 'beamFire': addShake(3); break;
        case 'sectorStart': palFrom = palIdx; palIdx = e.sector; palT = 0; break;
        case 'bossPhase': flash(pal.alt, 0.25); addShake(6); break;
        case 'chainLost': lastChainLost = time; break;
        case 'bombGained': text(st.player.x, st.player.y - 30, '+NOVA', '#ffd76a', 11); break;
        case 'launch': ring(e.x, e.y + 10, pal.alt, 20, 16); break;
      }
    }
  }
  function addShake(v) { if (settings.shake) shake = Math.min(26, shake + v); }
  function flash(c, a) { if (!settings.flashes) a *= 0.25; flashColor = c; flashA = Math.max(flashA, a); }

  function fmt(n) { return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  // ---------------------------------------------------------------- background
  function mix(a, b, t) {
    var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    var r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
    var g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
    var bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  function drawBackground(st, speed) {
    var pa = PALETTES[palFrom], pb = PALETTES[palIdx], t = palT;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var gr = ctx.createLinearGradient(0, 0, 0, cv.height);
    gr.addColorStop(0, mix(pa.bgTop, pb.bgTop, t)); gr.addColorStop(1, mix(pa.bgBot, pb.bgBot, t));
    ctx.fillStyle = gr; ctx.fillRect(0, 0, cv.width, cv.height);

    ctx.save();
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
    // nebulae
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < nebulae.length; i++) {
      var n = nebulae[i];
      n.y += n.sp * speed; if (n.y - n.r > 700) { n.y = -n.r - 40; n.x = Math.random() * 1000 - 320; }
      var col = pb.neb[n.c];
      var s = sprite('neb' + col, 200, 200, function (g) {
        var rg = g.createRadialGradient(100, 100, 0, 100, 100, 100);
        rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = rg; g.globalAlpha = 0.5; g.fillRect(0, 0, 200, 200);
      });
      ctx.globalAlpha = 0.55;
      ctx.drawImage(s.c, n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
    }
    ctx.globalAlpha = 1;
    // stars
    var sc = pb.star;
    for (var j = 0; j < stars.length; j++) {
      var s2 = stars[j];
      s2.y += s2.z * 0.45 * speed;
      if (s2.y > 650) { s2.y = -10; s2.x = Math.random() * 1200 - 420; }
      var a = s2.z === 3 ? 0.95 : (s2.z === 2 ? 0.6 : 0.35);
      ctx.globalAlpha = a * (0.75 + 0.25 * Math.sin(time * 0.05 + s2.tw));
      ctx.fillStyle = sc;
      var sz = s2.z * 0.55;
      if (s2.z === 3 && speed > 1.5) ctx.fillRect(s2.x, s2.y, sz, sz * 1 + speed * 2);
      else ctx.fillRect(s2.x, s2.y, sz, sz);
    }
    ctx.globalAlpha = 1;
    // sector flavour
    var sec = st ? st.sector : 0;
    if (sec === 1 || sec === 5) { // embers
      if (Math.random() < 0.5) addP({ x: Math.random() * 360, y: 650, vx: (Math.random() - 0.5) * 0.3, vy: -0.6 - Math.random() * 0.8, life: 0, max: 400, size: 1 + Math.random() * 1.6, color: sec === 1 ? '#ff8a3d' : '#ff4f9a', k: 'dust' });
    }
    if (sec === 3) { // reef shimmer
      ctx.strokeStyle = 'rgba(95,255,208,0.05)'; ctx.lineWidth = 1;
      for (var q = 0; q < 6; q++) { var yy = (time * 0.6 + q * 120) % 760 - 60; ctx.beginPath(); ctx.moveTo(-200, yy); ctx.lineTo(560, yy + 80); ctx.stroke(); }
    }
    if (sec === 5) { // pulsing rays
      ctx.globalAlpha = 0.05 + 0.03 * Math.sin(time * 0.03);
      ctx.fillStyle = '#ff4f9a';
      for (var rr = 0; rr < 8; rr++) { ctx.save(); ctx.translate(180, -60); ctx.rotate(rr * 0.2 - 0.7 + Math.sin(time * 0.004) * 0.1); ctx.fillRect(-6, 0, 12, 900); ctx.restore(); }
      ctx.globalAlpha = 1;
    }
    if (lightningFlash > 0) {
      ctx.fillStyle = 'rgba(200,220,255,' + (0.18 * lightningFlash) + ')'; ctx.fillRect(-500, -100, 1400, 900);
      lightningFlash = Math.max(0, lightningFlash - 0.08);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
    if (palT < 1) palT = Math.min(1, palT + 0.008);
  }

  // ---------------------------------------------------------------- frame
  function draw(st, opts) {
    opts = opts || {};
    time++;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!st) { drawBackground(null, 1); return; }
    var pal = PALETTES[st.sector];
    var speed = st.flow === 'bossDead' || st.flow === 'sectorIntro' && st.flowT < 150 ? 3 : 1;
    if (opts.paused) speed = 0;
    drawBackground(st, speed);

    var sx = 0, sy = 0;
    if (shake > 0.2) { sx = (Math.random() - 0.5) * shake; sy = (Math.random() - 0.5) * shake; shake *= 0.86; } else shake = 0;

    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * (ox + sx * scale), dpr * (oy + sy * scale));
    // playfield edge (visible on wide screens)
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, AB3.W, AB3.H); ctx.clip();

    drawLanes(st, pal);
    drawEnemies(st, pal);
    drawPickups(st);
    if (SECTORS_FOG(st)) drawFog(st);
    drawPlayerBullets(st);
    drawBeams(st, pal);
    drawEnemyBullets(st);
    drawPlayer(st, pal);
    drawParticles(opts.paused);
    ctx.restore();

    // frame glow lines
    ctx.strokeStyle = pal.main; ctx.globalAlpha = 0.25; ctx.lineWidth = 1;
    ctx.strokeRect(-0.5, -0.5, AB3.W + 1, AB3.H + 1);
    ctx.globalAlpha = 1;

    drawHUD(st, pal, opts);
    if (flashA > 0.01) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = flashA; ctx.fillStyle = flashColor; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.globalAlpha = 1; flashA *= 0.85;
    }
  }

  function SECTORS_FOG(st) { return st.sector === 2 && st.flow !== 'boss' && st.flow !== 'bossWarn'; }

  function drawFog(st) {
    var p = st.player;
    if (!fogCanvas) { fogCanvas = document.createElement('canvas'); fogCanvas.width = 360; fogCanvas.height = 640; }
    var g = fogCanvas.getContext('2d');
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, 360, 640);
    g.fillStyle = 'rgba(20,6,40,0.82)'; g.fillRect(0, 0, 360, 640);
    g.globalCompositeOperation = 'destination-out';
    var rg = g.createRadialGradient(p.x, p.y, 20, p.x, p.y, 175);
    rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 360, 640);
    // drifting holes
    for (var i = 0; i < 3; i++) {
      var hx = 180 + Math.sin(time * 0.004 + i * 2) * 150, hy = 200 + Math.cos(time * 0.003 + i) * 160;
      var hg = g.createRadialGradient(hx, hy, 0, hx, hy, 80);
      hg.addColorStop(0, 'rgba(0,0,0,0.6)'); hg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = hg; g.fillRect(0, 0, 360, 640);
    }
    ctx.drawImage(fogCanvas, 0, 0, 360, 640);
  }

  function drawLanes(st) {
    for (var i = 0; i < st.lanes.length; i++) {
      var ln = st.lanes[i];
      if (ln.age <= ln.warn) {
        var k = ln.age / ln.warn;
        ctx.fillStyle = 'rgba(255,225,77,' + (0.05 + 0.18 * k * (0.6 + 0.4 * Math.sin(time * 0.6))) + ')';
        ctx.fillRect(ln.x - ln.w / 2, 0, ln.w, AB3.H);
        ctx.strokeStyle = 'rgba(255,225,77,' + (0.3 + 0.5 * k) + ')'; ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]); ctx.lineDashOffset = -time;
        ctx.beginPath(); ctx.moveTo(ln.x - ln.w / 2, 0); ctx.lineTo(ln.x - ln.w / 2, AB3.H); ctx.moveTo(ln.x + ln.w / 2, 0); ctx.lineTo(ln.x + ln.w / 2, AB3.H); ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(255,240,160,0.25)'; ctx.fillRect(ln.x - ln.w / 2, 0, ln.w, AB3.H);
        for (var b = 0; b < 2; b++) {
          ctx.strokeStyle = b ? '#ffffff' : '#ffe14d'; ctx.lineWidth = b ? 1.5 : 5; ctx.globalAlpha = b ? 1 : 0.6;
          ctx.beginPath(); var x = ln.x;
          for (var y = 0; y <= AB3.H; y += 24) { ctx.lineTo(x + (Math.random() - 0.5) * ln.w * 0.8, y); }
          ctx.stroke();
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      }
    }
  }

  function drawEnemies(st, pal) {
    for (var i = 0; i < st.en.length; i++) {
      var e = st.en[i];
      if (e.dead) continue;
      if (e.boss) { drawBossPart(st, e, pal); continue; }
      var col = enemyColor(e, pal), size = e.r * 2.6;
      var white = e.flash > 0 || (e.t === 'mirror' && e.s.flashing && (time >> 2) % 2 === 0);
      var fillC = e.t === 'crystal' ? 'rgba(200,245,255,0.18)' : null;
      var spr = shapeSprite(e.t + size, size, col, fillC, SHAPES[e.t], white);
      var rotA = e.s.rot || 0;
      if (e.t === 'turret') rotA = e.s.a || 0;
      blit(spr, e.x, e.y, rotA);
      if (e.t === 'bearer') {
        ctx.strokeStyle = e.s.block ? '#ffffff' : '#9fd8ff'; ctx.lineWidth = e.s.block ? 3 : 2;
        ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(e.x, e.y - 4, e.r + 5, 0.5, Math.PI - 0.5); ctx.stroke(); ctx.globalAlpha = 1;
      }
      if (e.t === 'sniper' && e.s.aim > 0) {
        ctx.strokeStyle = 'rgba(255,79,106,' + (0.25 + 0.6 * (1 - e.s.aim / 48)) + ')'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + e.s.ax * 800, e.y + e.s.ay * 800); ctx.stroke();
      }
      if (e.t === 'mirror' && e.s.flashing) { ctx.strokeStyle = 'rgba(216,200,255,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(e.x, e.y, e.r + 6 + Math.sin(time * 0.4) * 2, 0, 6.28); ctx.stroke(); }
      if (e.elite) { ctx.strokeStyle = 'rgba(255,215,106,0.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(e.x, e.y, e.r + 4, time * 0.05, time * 0.05 + 4); ctx.stroke(); }
      // engine glow
      if (!e.hazard && e.t !== 'turret' && e.t !== 'mirror') { var eg = glowOrb(col, 2); blit(eg, e.x, e.y - e.r * 0.8, 0, 0.5 + Math.random() * 0.3); }
    }
  }

  function drawBossPart(st, e, pal) {
    var B = st.boss, kind = B ? B.kind : 'warden';
    var col = pal.alt, main = pal.main;
    var white = e.flash > 0;
    var vul = e.dmgMul >= 1;
    ctx.save(); ctx.translate(e.x, e.y);
    ctx.lineJoin = 'round';
    ctx.shadowColor = col; ctx.shadowBlur = 14;
    ctx.fillStyle = white ? 'rgba(255,255,255,0.8)' : 'rgba(10,8,24,0.85)';
    ctx.strokeStyle = white ? '#fff' : col; ctx.lineWidth = 2.4;
    var r = e.r, i, a;
    ctx.beginPath();
    switch (kind) {
      case 'warden':
        for (i = 0; i < 8; i++) { a = i / 8 * 6.2832 + 0.39; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.8); }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.rect(-r * 1.35, -r * 0.2, r * 0.4, r * 0.7); ctx.rect(r * 0.95, -r * 0.2, r * 0.4, r * 0.7); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = main; ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, 6.28); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, r * 0.62, time * 0.03, time * 0.03 + 2); ctx.stroke();
        break;
      case 'hive':
        for (i = 0; i < 12; i++) { a = i / 12 * 6.2832; var rr = r * (i % 2 ? 0.85 : 1.05); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        var open = B && B.open;
        ctx.strokeStyle = open ? '#fff' : main;
        for (i = 0; i < 6; i++) {
          a = i / 6 * 6.2832 + (open ? 0.26 : 0);
          ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * (open ? 0.55 : 0.2), Math.sin(a) * r * (open ? 0.55 : 0.2)); ctx.lineTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8); ctx.stroke();
        }
        if (open) { ctx.shadowColor = '#fff'; ctx.fillStyle = main; ctx.beginPath(); ctx.arc(0, 0, r * 0.35 + Math.sin(time * 0.3) * 2, 0, 6.28); ctx.fill(); }
        break;
      case 'twins':
        ctx.moveTo(0, r * 1.1); ctx.lineTo(r * 0.7, -r * 0.2); ctx.lineTo(r * 1.2, -r * 0.9); ctx.lineTo(0, -r * 0.5); ctx.lineTo(-r * 1.2, -r * 0.9); ctx.lineTo(-r * 0.7, -r * 0.2);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = B && B.enraged ? '#ff4f6a' : main; ctx.beginPath(); ctx.moveTo(0, -r * 0.3); ctx.lineTo(0, r * 0.8); ctx.stroke();
        break;
      case 'leviathan':
        var head = e.seg === 0;
        ctx.arc(0, 0, r, 0, 6.28); ctx.fill(); ctx.stroke();
        if (head) { ctx.strokeStyle = main; ctx.beginPath(); ctx.moveTo(-r * 0.6, r * 0.3); ctx.lineTo(0, r * 0.9); ctx.lineTo(r * 0.6, r * 0.3); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-r * 0.35, 0, 2.5, 0, 6.28); ctx.arc(r * 0.35, 0, 2.5, 0, 6.28); ctx.fill(); }
        else { ctx.strokeStyle = vul ? '#fff' : 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, 6.28); ctx.stroke(); }
        if (vul && !head) { ctx.strokeStyle = '#ff4f6a'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 0, r + 5 + Math.sin(time * 0.3) * 2, 0, 6.28); ctx.stroke(); }
        break;
      case 'prism':
        ctx.rotate(B ? B.ang : 0);
        for (i = 0; i < 3; i++) { a = i / 3 * 6.2832 - 1.5708; ctx.lineTo(Math.cos(a) * r * 1.2, Math.sin(a) * r * 1.2); }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.rotate(-(B ? B.ang : 0) * 2);
        ctx.strokeStyle = main; ctx.beginPath();
        for (i = 0; i < 3; i++) { a = i / 3 * 6.2832 + 1.5708; ctx.lineTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8); }
        ctx.closePath(); ctx.stroke();
        break;
      case 'signal':
        var ph = B ? B.phase : 0;
        for (var ringI = 0; ringI < 3; ringI++) {
          ctx.beginPath();
          var rr2 = r * (1 - ringI * 0.28), n = 5 + ringI * 2;
          for (i = 0; i < n; i++) { a = i / n * 6.2832 + time * 0.01 * (ringI % 2 ? -1 : 1) * (1 + ph); ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); }
          ctx.closePath(); if (ringI === 0) ctx.fill(); ctx.strokeStyle = ringI === 1 ? main : (white ? '#fff' : col); ctx.stroke();
        }
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 4 + Math.sin(time * 0.2) * 2 + ph * 2, 0, 6.28); ctx.fill();
        break;
    }
    ctx.restore();
    if (!vul && B && B.t > 110 && kind !== 'leviathan') {
      ctx.strokeStyle = 'rgba(160,200,255,0.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(e.x, e.y, e.r + 8, 0, 6.28); ctx.stroke();
    }
  }

  function drawPickups(st) {
    for (var i = 0; i < st.pk.length; i++) {
      var k = st.pk[i];
      if (k.kind === 'scrap') blit(glowOrb('#4dffa0', 2.2, '#eafff4'), k.x, k.y, 0, 0.9);
      else { blit(glowOrb('#ffd76a', 5, '#fff'), k.x, k.y); ctx.fillStyle = '#1a0f00'; ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('N', k.x, k.y + 2.5); }
    }
  }

  function drawPlayerBullets(st) {
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < st.pb.length; i++) {
      var b = st.pb[i];
      var col = WEAPON_COLORS[b.kind] || '#fff';
      if (b.kind === 'lance') {
        ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * 1.6, b.y - b.vy * 1.6); ctx.stroke();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.globalAlpha = 1; ctx.stroke();
      } else if (b.kind === 'missile') {
        blit(glowOrb(col, 2.4), b.x, b.y);
        if ((time & 1) === 0) addP({ x: b.x, y: b.y, vx: 0, vy: 0, life: 0, max: 14, size: 1.6, color: '#ffa34d', k: 'spark' });
      } else {
        ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * 0.9, b.y - b.vy * 0.9); ctx.stroke();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2; ctx.globalAlpha = 1; ctx.stroke();
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function drawEnemyBullets(st) {
    var hc = settings.contrast;
    for (var i = 0; i < st.eb.length; i++) {
      var b = st.eb[i], s;
      switch (b.kind) {
        case 'big': s = glowOrb(hc ? '#ffffff' : '#ff5a3d', 6.5, hc ? '#ff2040' : '#fff4e0'); break;
        case 'needle': s = glowOrb(hc ? '#ffff00' : '#ffe14d', 2.6, '#fff'); break;
        case 'shard': s = glowOrb(hc ? '#ff00ff' : '#c78bff', 3, '#fff'); break;
        case 'mine':
          var k = b.life / (b.fuse || 100);
          s = glowOrb('#ff2a4a', 6, (b.life >> 3) % 2 ? '#fff' : '#ff2a4a');
          ctx.strokeStyle = 'rgba(255,42,74,' + (0.3 + 0.5 * k) + ')'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(b.x, b.y, 10 + (1 - k) * 18, 0, 6.28); ctx.stroke();
          break;
        default: s = glowOrb(hc ? '#ff1060' : '#ff4f9a', 3.5, '#fff');
      }
      blit(s, b.x, b.y);
    }
  }

  function drawBeams(st, pal) {
    for (var i = 0; i < st.beams.length; i++) {
      var bm = st.beams[i];
      var ex = bm.x + bm.dx * bm.len, ey = bm.y + bm.dy * bm.len;
      if (bm.age <= bm.warn) {
        var k = bm.age / bm.warn;
        ctx.strokeStyle = 'rgba(255,79,106,' + (0.2 + 0.6 * k) + ')'; ctx.lineWidth = 1 + k * 1.5;
        ctx.setLineDash([8, 6]); ctx.lineDashOffset = -time * 2;
        ctx.beginPath(); ctx.moveTo(bm.x, bm.y); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
        blit(glowOrb('#ff4f6a', 3 + k * 5), bm.x, bm.y, 0, 0.5 + k * 0.5);
      } else {
        var fade = Math.min(1, (bm.warn + bm.act - bm.age) / 8);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.35 * fade; ctx.strokeStyle = pal.alt; ctx.lineWidth = bm.w * 1.8;
        ctx.beginPath(); ctx.moveTo(bm.x, bm.y); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.globalAlpha = 0.9 * fade; ctx.strokeStyle = '#ff6f8a'; ctx.lineWidth = bm.w;
        ctx.stroke();
        ctx.globalAlpha = fade; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = bm.w * 0.35 + Math.random() * 2;
        ctx.stroke();
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      }
    }
  }

  function drawPlayer(st, pal) {
    var p = st.player;
    if (st.overT > 0 || st.phase === 'over') return;
    if (p.inv > 0 && (time >> 2) % 2 === 0 && p.inv < 150) return;
    // drones
    for (var d = 0; d < p.mods.drone; d++) {
      var dx = p.x + (d === 0 ? -26 : 26), dy = p.y + 10 + Math.sin(time * 0.1 + d) * 2;
      var ds = shapeSprite('drone', 16, '#9ef7ff', null, function (g, s, inner) {
        if (inner) return; g.beginPath(); g.moveTo(0, -s * 0.36); g.lineTo(s * 0.26, 0); g.lineTo(0, s * 0.3); g.lineTo(-s * 0.26, 0); g.closePath(); g.fill(); g.stroke();
      });
      blit(ds, dx, dy);
    }
    // engine flame
    var fl = 6 + Math.random() * 6 + (p.vy < 0 ? 5 : 0);
    ctx.globalCompositeOperation = 'lighter';
    var fg = ctx.createLinearGradient(p.x, p.y + 8, p.x, p.y + 8 + fl);
    fg.addColorStop(0, 'rgba(160,240,255,0.95)'); fg.addColorStop(1, 'rgba(60,120,255,0)');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.moveTo(p.x - 4, p.y + 8); ctx.lineTo(p.x, p.y + 8 + fl); ctx.lineTo(p.x + 4, p.y + 8); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // ship
    var bank = Math.max(-1, Math.min(1, p.vx / 3));
    var ship = sprite('ship' + Math.round(bank * 2), 40, 40, function (g) {
      g.translate(20, 20);
      var b = Math.round(bank * 2) / 2;
      g.lineJoin = 'round'; g.shadowColor = '#5ff4ff'; g.shadowBlur = 8;
      g.fillStyle = 'rgba(10,30,50,0.9)'; g.strokeStyle = '#7ff8ff'; g.lineWidth = 1.8;
      g.beginPath();
      g.moveTo(0, -15); g.lineTo(4, -4); g.lineTo(12 - Math.abs(b) * 3, 8); g.lineTo(4, 5); g.lineTo(2, 9); g.lineTo(-2, 9); g.lineTo(-4, 5); g.lineTo(-12 + Math.abs(b) * 3, 8); g.lineTo(-4, -4);
      g.closePath(); g.fill(); g.stroke();
      g.shadowBlur = 0; g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, -10); g.lineTo(0, 3); g.stroke();
    });
    blit(ship, p.x, p.y);
    // shield bubble
    if (p.shield > 0) {
      ctx.strokeStyle = 'rgba(159,216,255,' + (0.35 + 0.15 * Math.sin(time * 0.15)) + ')'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, 6.28); ctx.stroke();
      if (p.shield > 1) { ctx.beginPath(); ctx.arc(p.x, p.y, 24, 0, 6.28); ctx.stroke(); }
    }
    // hitbox
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y + 1, 2.4, 0, 6.28); ctx.fill();
    ctx.strokeStyle = 'rgba(255,79,154,0.9)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y + 1, 3.6, 0, 6.28); ctx.stroke();
  }

  function drawParticles(paused) {
    ctx.globalCompositeOperation = 'lighter';
    var j = 0;
    for (var i = 0; i < particles.length; i++) {
      var q = particles[i];
      if (!paused) { q.life++; q.x += q.vx; q.y += q.vy; q.vx *= 0.94; q.vy *= q.k === 'dust' || q.k === 'text' ? 1 : 0.94; }
      var k = 1 - q.life / q.max;
      if (k <= 0) continue;
      particles[j++] = q;
      ctx.globalAlpha = k;
      if (q.k === 'spark' || q.k === 'dust') { ctx.fillStyle = q.color; ctx.fillRect(q.x - q.size / 2, q.y - q.size / 2, q.size, q.size); }
      else if (q.k === 'ring') { ctx.strokeStyle = q.color; ctx.lineWidth = 2 * k + 0.5; ctx.beginPath(); ctx.arc(q.x, q.y, q.size * (1 - k * k), 0, 6.28); ctx.stroke(); }
      else if (q.k === 'text') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = '700 ' + q.size + 'px ' + FONT_MONO; ctx.textAlign = 'center'; ctx.fillStyle = q.color;
        ctx.fillText(q.str, q.x, q.y);
        ctx.globalCompositeOperation = 'lighter';
      }
    }
    particles.length = j;
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  // ---------------------------------------------------------------- HUD
  var FONT_MONO = '"SF Mono", "JetBrains Mono", Menlo, Consolas, "Liberation Mono", monospace';
  var FONT_UI = '"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif';

  function glowText(str, x, y, size, color, align, weight, glow) {
    ctx.font = (weight || 700) + ' ' + size + 'px ' + FONT_UI;
    ctx.textAlign = align || 'left';
    if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glow; }
    ctx.fillStyle = color; ctx.fillText(str, x, y);
    ctx.shadowBlur = 0;
  }

  function drawHUD(st, pal, opts) {
    var p = st.player;
    // top gradient scrim
    var sg = ctx.createLinearGradient(0, 0, 0, 58);
    sg.addColorStop(0, 'rgba(0,0,0,0.55)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg; ctx.fillRect(0, 0, AB3.W, 58);
    ctx.font = '700 20px ' + FONT_MONO; ctx.textAlign = 'left'; ctx.fillStyle = '#fff';
    ctx.shadowColor = pal.main; ctx.shadowBlur = 8;
    ctx.fillText(fmt(st.score), 10, 25);
    ctx.shadowBlur = 0;
    // chain
    var mult = AB3.chainMult(st);
    var cw2 = 110, cx = 10, cy = 33;
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(cx, cy, cw2, 4);
    var win = 90 + 30 * p.mods.chain;
    var lostRecently = time - lastChainLost < 40;
    if (st.chain > 0) { ctx.fillStyle = mult >= 6 ? '#ffd76a' : pal.main; ctx.fillRect(cx, cy, cw2 * st.chainT / win, 4); }
    ctx.font = '700 10px ' + FONT_MONO; ctx.fillStyle = lostRecently ? '#ff4f6a' : (mult > 1 ? '#fff' : 'rgba(255,255,255,0.6)');
    ctx.fillText('x' + mult + '  CHAIN ' + st.chain, cx, cy + 15);
    // right: stage + hi
    ctx.textAlign = 'right';
    ctx.font = '600 10px ' + FONT_UI; ctx.fillStyle = 'rgba(255,255,255,0.7)';
    var stage = (st.loop ? 'LOOP ' + st.loop + ' · ' : '') + 'SECTOR ' + (st.sector + 1) + (st.wave < 4 ? ' · WAVE ' + (st.wave + 1) : ' · BOSS');
    ctx.fillText(stage, AB3.W - 10, 18);
    if (opts.hi != null) { ctx.font = '700 11px ' + FONT_MONO; ctx.fillStyle = st.score > opts.hi ? '#ffd76a' : 'rgba(255,255,255,0.55)'; ctx.fillText((st.score > opts.hi ? 'NEW #1  ' : 'TOP  ') + fmt(Math.max(opts.hi, st.score)), AB3.W - 10, 33); }
    if (opts.replay) { ctx.font = '700 10px ' + FONT_UI; ctx.fillStyle = '#ff4f9a'; ctx.fillText('● REPLAY ' + opts.replay, AB3.W - 10, 48); }

    // boss bar
    if (st.boss && st.boss.t > 30) {
      var B = st.boss, frac = Math.max(0, B.hp / B.maxHp);
      var bx = 30, by = 56, bw = AB3.W - 60;
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(bx, by, bw, 6);
      ctx.fillStyle = pal.alt; ctx.fillRect(bx, by, bw * frac, 6);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, 5);
      ctx.textAlign = 'center'; ctx.font = '700 9px ' + FONT_UI; ctx.fillStyle = '#fff';
      ctx.fillText(B.name.toUpperCase(), AB3.W / 2, by + 17);
    }

    // bottom
    var yb = AB3.H - 12;
    var bg = ctx.createLinearGradient(0, AB3.H - 44, 0, AB3.H);
    bg.addColorStop(0, 'rgba(0,0,0,0)'); bg.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = bg; ctx.fillRect(0, AB3.H - 44, AB3.W, 44);
    // lives
    for (var i = 0; i < p.lives; i++) {
      var lx = 14 + i * 14;
      ctx.fillStyle = '#7ff8ff'; ctx.beginPath(); ctx.moveTo(lx, yb - 10); ctx.lineTo(lx + 5, yb); ctx.lineTo(lx - 5, yb); ctx.closePath(); ctx.fill();
    }
    for (var s2 = 0; s2 < p.mods.shield; s2++) {
      ctx.strokeStyle = s2 < p.shield ? '#9fd8ff' : 'rgba(159,216,255,0.25)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(14 + p.lives * 14 + 6 + s2 * 12, yb - 5, 4.5, 0, 6.28); ctx.stroke();
    }
    // weapon
    ctx.textAlign = 'center'; ctx.font = '700 10px ' + FONT_UI; ctx.fillStyle = WEAPON_COLORS[p.weapon] || '#fff';
    ctx.fillText(AB3.WEAPON_NAMES[p.weapon].toUpperCase(), AB3.W / 2, yb - 8);
    for (var w = 0; w < 5; w++) { ctx.fillStyle = w < p.wlv ? (WEAPON_COLORS[p.weapon] || '#fff') : 'rgba(255,255,255,0.2)'; ctx.fillRect(AB3.W / 2 - 22 + w * 9, yb - 3, 7, 3); }
    // bombs + charge
    ctx.textAlign = 'right';
    for (var b = 0; b < p.bombMax; b++) {
      var bx2 = AB3.W - 14 - b * 14;
      ctx.strokeStyle = '#ffd76a'; ctx.lineWidth = 1.4; ctx.fillStyle = b < p.bombs ? '#ffd76a' : 'rgba(0,0,0,0)';
      ctx.beginPath(); ctx.arc(bx2, yb - 5, 4.5, 0, 6.28); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,215,106,0.25)'; ctx.fillRect(AB3.W - 14 - (p.bombMax - 1) * 14 - 5, yb + 3, (p.bombMax - 1) * 14 + 10, 2);
    ctx.fillStyle = '#ffd76a'; ctx.fillRect(AB3.W - 14 - (p.bombMax - 1) * 14 - 5, yb + 3, ((p.bombMax - 1) * 14 + 10) * p.bombCharge / 100, 2);
    ctx.font = '700 9px ' + FONT_MONO; ctx.fillStyle = '#7dffb0'; ctx.textAlign = 'right';
    ctx.fillText('SCRAP ' + st.scrap, AB3.W - 10, yb - 16);

    // banner
    if (st.banner) {
      var bn = st.banner, t = bn.max - bn.t, a = Math.min(1, t / 12, bn.t / 16);
      ctx.globalAlpha = a;
      var spacing = 1 + Math.max(0, 1 - t / 20) * 6;
      var warn = bn.title === 'WARNING' || bn.title === 'ENRAGED';
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 262, AB3.W, 66);
      var title = bn.title.split('').join(spacing > 2 ? ' ' : '');
      glowText(title, AB3.W / 2, 297, bn.title.length > 16 ? 18 : 26, warn ? '#ff4f6a' : '#ffffff', 'center', 800, 14);
      glowText(bn.sub, AB3.W / 2, 317, 11, warn ? '#ffb0bc' : pal.main, 'center', 600, 6);
      ctx.globalAlpha = 1;
    }
  }

  return {
    init: init, resize: resize, draw: draw, onEvents: onEvents, toWorld: toWorld, toScreen: toScreen,
    metrics: metrics, settings: settings, setPalette: function (i) { palIdx = palFrom = i; palT = 1; },
    clearParticles: function () { particles.length = 0; }, fmt: fmt
  };
})();
