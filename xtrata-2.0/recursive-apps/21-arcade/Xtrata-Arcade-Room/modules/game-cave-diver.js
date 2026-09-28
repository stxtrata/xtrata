/*
 * Xtrata Arcade cartridge #3 — CAVE DIVER (v2)
 * One button: hold to swim up, release to sink. Dive through four zones —
 * Sunlit Reef, Kelp Forest, The Abyss and the Thermal Vents — each with its
 * own light, currents, creatures and hazards.
 *
 * Music: a generative ambient score that crossfades with each zone
 * (bright pentatonic marimba → dorian kelp ostinato → sparse phrygian bells
 * in the dark → driving harmonic-minor pulse at the vents). The whole mix
 * is low-passed by depth, pearl chains climb the zone's scale on the beat,
 * swimming lifts the intensity, and a crash is a tape stop.
 *
 * Contract game-id: xa_cave_diver (score mode, higher is better)
 */
(function (root) {
  'use strict';
  var XA = root.XA;
  if (!XA) throw new Error('arcade-kit must load before game-cave-diver');
  var U = XA.util;
  var M = function () { return XA.music; };

  var W = 600, H = 400, COL = 12, PLAYER_X = 150, R = 9;
  var ACCENT = '#ff9f1c', PEARL = '#ffe66d';

  var ZONES = [
    { name: 'SUNLIT REEF', from: 0, top: '#0a4d6e', bottom: '#052236', wall: '#1d6f5c', edge: '#5fffd0', dark: 0,
      filter: 9000, speck: 'rgba(255,255,220,0.5)' },
    { name: 'KELP FOREST', from: 400, top: '#07392f', bottom: '#021611', wall: '#10402a', edge: '#39ff88', dark: 0.25,
      filter: 6000, speck: 'rgba(160,255,190,0.4)' },
    { name: 'THE ABYSS', from: 1000, top: '#050818', bottom: '#010208', wall: '#0b0f24', edge: '#4d5bff', dark: 0.9,
      filter: 2400, speck: 'rgba(120,160,255,0.6)' },
    { name: 'THERMAL VENTS', from: 1800, top: '#2a0a0a', bottom: '#0a0303', wall: '#3a1208', edge: '#ff6a2a', dark: 0.45,
      filter: 5200, speck: 'rgba(255,160,90,0.5)' }
  ];
  function zoneIndex(m) {
    if (m < 400) return 0;
    if (m < 1000) return 1;
    if (m < 1800) return 2;
    if (m < 2600) return 3;
    return Math.floor((m - 2600) / 800) % 2 === 0 ? 2 : 3;   // the deep keeps alternating
  }

  function songs() {
    return [
      { bpm: 92, key: 62, scale: 'pentatonic', chords: [0, 3, 1, 4], seed: 21, tracks: [
        { name: 'sub', inst: 'sub', layer: 0, gain: 0.5, chord: true, octave: -2, pattern: '0 - - - - - - - 2 - - - - - - -' },
        { name: 'marimba', inst: 'marimba', layer: 0, gain: 0.55, chord: true, octave: 0,
          fn: function (i) { return i.step % 2 ? null : { deg: [0, 2, 4, 2, 5, 4, 2, 1][(i.step / 2) % 8], vel: 0.5 + (i.step % 8 === 0 ? 0.3 : 0) }; } },
        { name: 'shaker', inst: 'shaker', layer: 0.2, gain: 0.6, pattern: 'x.xxx.xxx.xxx.xx' },
        { name: 'kick', inst: 'kick', layer: 0.4, gain: 0.5, pattern: 'x.......x.......' },
        { name: 'bell', inst: 'bell', layer: 0.6, gain: 0.3, chord: true, octave: 1, pattern: '. . . . 4 . . . . . 2 . . . . .' }
      ] },
      { bpm: 84, key: 57, scale: 'dorian', chords: [0, 3, 0, 4], seed: 22, tracks: [
        { name: 'pad', inst: 'pad', layer: 0, gain: 0.45, chord: true, octave: -1, params: { cutoff: 800 },
          fn: function (i) { return i.stepInBar === 0 ? [{ deg: 0, steps: 16 }, { deg: 2, steps: 16 }, { deg: 4, steps: 16 }] : null; } },
        // a 12-step ostinato over a 16-step bar drifts against the beat
        { name: 'ostinato', inst: 'pluck', layer: 0, gain: 0.45, chord: true, params: { decay: 0.35, cutoff: 2600 },
          fn: function (i) { var k = i.step % 12; return [0, null, 2, null, 4, null, 7, null, 4, null, 2, null][k] == null ? null : { deg: [0, 0, 2, 0, 4, 0, 7, 0, 4, 0, 2, 0][k], vel: 0.6 }; } },
        { name: 'kick', inst: 'kick', layer: 0.25, gain: 0.5, pattern: 'x.........x.....' },
        { name: 'clap', inst: 'clap', layer: 0.45, gain: 0.3, pattern: '........x.......' },
        { name: 'bass', inst: 'bass', layer: 0.55, gain: 0.4, chord: true, octave: -2, params: { cutoff: 500 }, pattern: '0 . . 0 . . 0 . . . 0 . . . . .' }
      ] },
      { bpm: 60, key: 50, scale: 'phrygian', chords: [0, 1], barsPerChord: 2, seed: 23, filter: 2400, tracks: [
        { name: 'drone', inst: 'pad', layer: 0, gain: 0.55, chord: true, octave: -1, params: { cutoff: 500, attack: 1.2, release: 2 },
          fn: function (i) { return i.stepInBar === 0 && i.bar % 2 === 0 ? [{ deg: 0, steps: 32 }, { deg: 4, steps: 32 }] : null; } },
        { name: 'sub', inst: 'sub', layer: 0, gain: 0.5, chord: true, octave: -2, pattern: '0 - - - - - - - - - - - - - - -' },
        { name: 'heart', inst: 'kick', layer: 0.2, gain: 0.45, pattern: 'x..x............' },
        { name: 'bells', inst: 'bell', layer: 0, gain: 0.35, chord: true, octave: 1,
          fn: function (i) { return i.step % 2 === 0 && i.rng() < 0.18 ? { deg: [0, 1, 4, 5, 7][Math.floor(i.rng() * 5)], vel: 0.5 } : null; } }
      ] },
      { bpm: 110, key: 52, scale: 'harmonic', chords: [0, 5, 3, 4], seed: 24, tracks: [
        { name: 'pulse', inst: 'bass', layer: 0, gain: 0.45, chord: true, octave: -2, params: { cutoff: 600, q: 8 },
          fn: function (i) { return { deg: i.step % 8 === 6 ? 7 : 0, vel: i.step % 4 === 0 ? 0.9 : 0.55 }; } },
        { name: 'kick', inst: 'kick', layer: 0.15, gain: 0.7, pattern: 'x...x...x...x...' },
        { name: 'hat', inst: 'hat', layer: 0.3, gain: 0.45, pattern: '..x...x...x...x.' },
        { name: 'lead', inst: 'lead', layer: 0.5, gain: 0.3, octave: 0, pattern: '4 - - 3 4 - 6 - 7 - - - 6 - 4 - 3 - - - 1 - 3 - 4 - - - - - . .' },
        { name: 'snare', inst: 'snare', layer: 0.65, gain: 0.4, pattern: '....x.......x...' }
      ] }
    ];
  }

  function create(api) {
    var rng = api.rng;
    var cols = [], firstCol = 0;
    var center = H / 2, drift = 0;
    var dist = 0, speed = 190;
    var y = H / 2, vy = 0;
    var started = false, dead = false, deadT = 0;
    var things = [];           // pearls + hazards by world x
    var fishes = [];           // background sea life
    var pickups = 0, bonus = 0, chain = 0, closeCd = 0, bubbleT = 0, t = 0;
    var zone = 0, zoneBlend = 0, prevZone = 0, bannerT = 0;
    var SONGS = songs();
    var dark = document.createElement('canvas');
    dark.width = W; dark.height = H;
    var dctx = dark.getContext('2d');

    function gapFor(d) { return U.lerp(250, 120, U.clamp(d / 16000, 0, 1)); }
    function genCol(index) {
      var d = index * COL, m = d / 10, z = zoneIndex(m);
      drift += (rng() - 0.5) * 3.2;
      drift *= 0.94;
      center += drift;
      var gap = gapFor(d);
      center = U.clamp(center, 26 + gap / 2, H - 26 - gap / 2);
      var wob = Math.sin(index * 0.35) * 6;
      var c = { top: center - gap / 2 + wob, bot: center + gap / 2 + wob, z: z };
      if (index > 40) {
        if (rng() < 0.045) things.push({ kind: 'pearl', x: d, y: U.lerp(c.top + 22, c.bot - 22, rng()) });
        var r = rng();
        if (z === 0 && r < 0.02) things.push({ kind: 'urchin', x: d, y: rng() < 0.5 ? c.top + 8 : c.bot - 8, r: 11 });
        if (z === 1 && r < 0.03) {
          var fromTop = rng() < 0.5;
          things.push({ kind: 'kelp', x: d, base: fromTop ? c.top : c.bot, len: (c.bot - c.top) * (0.35 + rng() * 0.2), up: !fromTop, phase: rng() * 6 });
        }
        if (z === 2 && r < 0.014) things.push({ kind: 'lure', x: d, baseY: (c.top + c.bot) / 2, amp: (c.bot - c.top) * 0.3, phase: rng() * 6, r: 10 });
        if (z === 3 && r < 0.02) things.push({ kind: 'vent', x: d, floor: c.bot, top: c.top, reach: (c.bot - c.top) * (0.45 + rng() * 0.15), period: 2.6 + rng() * 1.5, phase: rng() * 3 });
      }
      return c;
    }
    function colAt(worldX) { return cols[U.clamp(Math.floor(worldX / COL) - firstCol, 0, cols.length - 1)]; }
    function fill() {
      var need = Math.ceil((dist + W + COL * 4) / COL);
      while (firstCol + cols.length < need) cols.push(genCol(firstCol + cols.length));
      var drop = Math.floor((dist - COL * 4) / COL) - firstCol;
      if (drop > 0) { cols.splice(0, drop); firstCol += drop; }
      things = things.filter(function (o) { return o.x > dist - 60; });
    }
    for (var i = 0; i < 40; i++) cols.push(genCol(i));
    center = H / 2;
    fill();
    for (i = 0; i < 14; i++) fishes.push({ x: rng() * W, y: 40 + rng() * (H - 80), s: 0.5 + rng() * 0.8, v: 20 + rng() * 40, p: rng() * 6 });

    var m0 = M();
    if (m0) { m0.play(SONGS[0], { fade: 1.5 }); m0.setFilter(ZONES[0].filter, 0.5); }

    function ventActive(o) { var ph = ((t + o.phase) % o.period) / o.period; return ph > 0.72; }
    function ventWarn(o) { var ph = ((t + o.phase) % o.period) / o.period; return ph > 0.5 && ph <= 0.72; }

    function die(reason) {
      dead = true;
      api.fx.burst(PLAYER_X, y, ACCENT, 36, 230, 0.9);
      api.fx.burst(PLAYER_X, y, '#bfefff', 20, 120, 1.1);
      if (reason) api.fx.text(PLAYER_X + 40, y - 24, reason, '#ff8a8a', 11);
      api.shake(12);
      if (M()) { M().setFilter(500, 0.2); M().tapeStop(1.2); }
      else api.audio.tone(200, 0.4, { type: 'sawtooth', slide: 0.3, vol: 0.28 });
    }
    function changeZone(z) {
      prevZone = zone; zone = z; zoneBlend = 0; bannerT = 2.6;
      var m = M();
      if (m) {
        m.play(SONGS[z], { fade: 2.8, intensity: m.intensity(), keepFilter: true });
        m.setFilter(ZONES[z].filter, 2.5);
        m.note('riser', 0, { dur: 1.6, gain: 0.35 });
      }
    }

    return {
      // Read-only test hook: what is on screen right now.
      debug: function () {
        var c = colAt(dist + PLAYER_X + 40);
        return { y: y, vy: vy, top: c.top, bot: c.bot, zone: zone, metres: Math.floor(dist / 10), dead: dead };
      },
      update: function (dt) {
        t += dt;
        var inp = api.input;
        var hold = inp.held('hold') || inp.held('a') || inp.held('up');
        inp.takeSwipes();
        fishes.forEach(function (f) { f.x -= (f.v + speed * 0.15 * f.s) * dt; if (f.x < -30) { f.x = W + 30; f.y = 40 + rng() * (H - 80); } });
        if (dead) { deadT += dt; if (deadT > 1.1) api.gameOver(); return; }
        if (bannerT > 0) bannerT -= dt;
        zoneBlend = Math.min(1, zoneBlend + dt / 2.5);
        if (!started) {
          var c0 = colAt(dist + PLAYER_X);
          y = (c0.top + c0.bot) / 2 + Math.sin(t * 3) * 8;          // bob in the middle of the gap
          if (hold || inp.hit('a') || inp.hit('up') || inp.hit('hold')) { started = true; vy = -120; if (M()) M().note('marimba', 4, { gain: 0.8 }); }
          return;
        }
        // physics + currents
        vy += (hold ? -1450 : 1050) * dt;
        if (zone === 1) vy += Math.sin(t * 0.9) * 240 * dt;               // kelp sways you
        vy = U.clamp(vy, -380, 420);
        y += vy * dt;
        speed = Math.min(430, 190 + dist * 0.012);
        dist += speed * dt;
        fill();
        var metres = Math.floor(dist / 10);
        var z = zoneIndex(metres);
        if (z !== zone) changeZone(z);

        var wx = dist + PLAYER_X, near = 999;
        for (var k = -1; k <= 1; k++) {
          var c = colAt(wx + k * R);
          if (y - R < c.top || y + R > c.bot) { die(); return; }
          near = Math.min(near, y - R - c.top, c.bot - (y + R));
        }
        closeCd -= dt;
        if (near < 7 && closeCd <= 0) {
          closeCd = 1.1; bonus += 15;
          api.fx.text(PLAYER_X + 30, y - 18, 'CLOSE +15', '#bfefff', 11);
          if (M()) M().note('pluck', 7, { chord: true, octave: 1, gain: 0.5 });
        }
        for (var j = 0; j < things.length; j++) {
          var o = things[j];
          var dx = o.x - wx;
          if (dx < -40 || dx > 60) continue;
          if (o.kind === 'pearl' && !o.got) {
            var dy = o.y - y;
            if (dx * dx + dy * dy < (R + 9) * (R + 9)) {
              o.got = true;
              chain = Math.min(12, chain + 1);
              var pts = 20 * chain;
              pickups += pts;
              api.fx.burst(PLAYER_X + dx, o.y, PEARL, 16, 150);
              api.fx.text(PLAYER_X + dx, o.y - 16, '+' + pts + (chain > 1 ? ' x' + chain : ''), PEARL, 12);
              // the chain climbs the current zone's scale, locked to the grid
              if (M()) M().note(zone === 2 ? 'bell' : 'marimba', chain - 1, { quantize: '16', octave: 1, gain: 0.75 });
            } else if (dx < -30 && !o.missed) {
              o.missed = true;
              if (chain > 1) api.fx.text(PLAYER_X, y + 22, 'CHAIN LOST', '#8899aa', 10);
              chain = 0;
            }
          } else if (o.kind === 'urchin') {
            if (Math.hypot(dx, o.y - y) < R + o.r - 3) { die('URCHIN'); return; }
          } else if (o.kind === 'kelp') {
            var tipY = o.up ? o.base - o.len : o.base + o.len;
            var sway = Math.sin(t * 2 + o.phase) * 10;
            if (Math.abs(dx - sway * 0.5) < 6 + R && (o.up ? y + R > tipY : y - R < tipY)) { die('TANGLED'); return; }
          } else if (o.kind === 'lure') {
            var ly = o.baseY + Math.sin(t * 1.4 + o.phase) * o.amp;
            if (Math.hypot(dx, ly - y) < R + o.r - 2) { die('ANGLERFISH'); return; }
          } else if (o.kind === 'vent') {
            if (Math.abs(dx) < 16) {
              if (ventActive(o) && y + R > o.floor - o.reach) { die('SCALDED'); return; }
              vy -= 900 * dt;                                           // warm updraft
            }
          }
        }
        api.setScore(metres + pickups + bonus);
        bubbleT += dt;
        if (bubbleT > 0.05) {
          bubbleT = 0;
          api.fx.trail(PLAYER_X - 12, y + (Math.random() - 0.5) * 6, 'rgba(190,240,255,0.8)', -speed * 0.4, -20 - Math.random() * 30);
        }
        if (M()) M().setIntensity(U.clamp(chain / 10 + (hold ? 0.25 : 0) + (speed - 190) / 600, 0, 1));
        api.setStatus(ZONES[zone].name + '  ·  ' + metres + ' m' + (chain > 1 ? '  ·  CHAIN x' + chain : ''));
      },

      render: function (ctx) {
        var Z = ZONES[zone], P = ZONES[prevZone], b = zoneBlend;
        function mix(a, c) {
          var pa = parseInt(a.slice(1), 16), pc = parseInt(c.slice(1), 16);
          var r = ((pa >> 16) & 255) * (1 - b) + ((pc >> 16) & 255) * b;
          var g = ((pa >> 8) & 255) * (1 - b) + ((pc >> 8) & 255) * b;
          var bl = (pa & 255) * (1 - b) + (pc & 255) * b;
          return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (bl | 0) + ')';
        }
        var grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, mix(P.top, Z.top));
        grad.addColorStop(1, mix(P.bottom, Z.bottom));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        var pulse = M() ? M().pulse(4) : 0;
        // god rays in the shallows
        if (zone <= 1) {
          ctx.save();
          ctx.globalAlpha = (zone === 0 ? 0.07 : 0.035) * (1 + pulse * 0.5);
          ctx.fillStyle = '#d6f7ff';
          for (var r = 0; r < 5; r++) {
            var rx = ((r * 150 - dist * 0.1) % (W + 200) + W + 200) % (W + 200) - 100;
            ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx + 70, 0); ctx.lineTo(rx - 40, H); ctx.lineTo(rx - 100, H); ctx.fill();
          }
          ctx.restore();
        }
        // background sea life
        ctx.save();
        fishes.forEach(function (f) {
          ctx.globalAlpha = zone === 2 ? 0.8 : 0.25;
          ctx.fillStyle = zone === 2 ? Z.speck : 'rgba(0,0,0,0.5)';
          if (zone === 2) { ctx.beginPath(); ctx.arc(f.x, f.y, Math.max(0.4, 1.5 * f.s + Math.sin(t * 3 + f.p)), 0, 7); ctx.fill(); return; }
          var s = 6 * f.s;
          ctx.beginPath();
          ctx.moveTo(f.x - s, f.y); ctx.quadraticCurveTo(f.x, f.y - s * 0.6, f.x + s, f.y);
          ctx.quadraticCurveTo(f.x, f.y + s * 0.6, f.x - s, f.y);
          ctx.lineTo(f.x + s * 1.6, f.y - s * 0.5 + Math.sin(t * 10 + f.p) * 1.5); ctx.lineTo(f.x + s * 1.6, f.y + s * 0.5); ctx.closePath();
          ctx.fill();
        });
        ctx.restore();

        // cave walls
        var offset = dist - firstCol * COL;
        function wall(isTop) {
          ctx.beginPath();
          ctx.moveTo(-COL, isTop ? 0 : H);
          for (var i = 0; i < cols.length; i++) {
            var sx = i * COL - offset;
            if (sx < -COL * 2 || sx > W + COL * 2) continue;
            ctx.lineTo(sx, isTop ? cols[i].top : cols[i].bot);
          }
          ctx.lineTo(W + COL, isTop ? 0 : H);
          ctx.closePath();
        }
        ctx.save();
        [true, false].forEach(function (isTop) {
          ctx.fillStyle = mix(P.wall, Z.wall);
          wall(isTop); ctx.fill();
          ctx.strokeStyle = mix(P.edge, Z.edge); ctx.lineWidth = 2; ctx.shadowColor = Z.edge; ctx.shadowBlur = 10 + pulse * 10;
          ctx.stroke(); ctx.shadowBlur = 0;
        });
        ctx.restore();

        // things (non-glowing ones first; lights go on top of the darkness)
        things.forEach(function (o) {
          var sx = o.x - dist;
          if (sx < -40 || sx > W + 40) return;
          if (o.kind === 'urchin') {
            ctx.save(); ctx.translate(sx, o.y);
            ctx.strokeStyle = '#2b1030'; ctx.fillStyle = '#51204f'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, o.r * 0.6, 0, 7); ctx.fill();
            for (var s = 0; s < 12; s++) { var a = s / 12 * 6.28 + t * 0.3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * o.r * 1.2, Math.sin(a) * o.r * 1.2); ctx.stroke(); }
            ctx.restore();
          } else if (o.kind === 'kelp') {
            ctx.save();
            ctx.strokeStyle = '#1f8a4a'; ctx.lineWidth = 7; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(sx, o.base);
            var segs = 8;
            for (var q = 1; q <= segs; q++) {
              var f = q / segs;
              ctx.lineTo(sx + Math.sin(t * 2 + o.phase + f * 2) * 10 * f, o.base + (o.up ? -1 : 1) * o.len * f);
            }
            ctx.stroke();
            ctx.strokeStyle = '#35c46e'; ctx.lineWidth = 2; ctx.stroke();
            ctx.restore();
          } else if (o.kind === 'vent') {
            var act = ventActive(o), warn = ventWarn(o);
            ctx.save();
            ctx.fillStyle = '#1a0a05';
            ctx.beginPath(); ctx.moveTo(sx - 16, o.floor + 2); ctx.lineTo(sx - 6, o.floor - 12); ctx.lineTo(sx + 6, o.floor - 12); ctx.lineTo(sx + 16, o.floor + 2); ctx.fill();
            var plumeTop = act ? o.floor - o.reach : warn ? o.floor - o.reach * 0.5 : o.floor - 40;
            var g2 = ctx.createLinearGradient(0, o.floor, 0, plumeTop);
            g2.addColorStop(0, act ? 'rgba(255,120,40,0.75)' : warn ? 'rgba(255,160,80,0.35)' : 'rgba(255,200,160,0.15)');
            g2.addColorStop(1, 'rgba(255,120,40,0)');
            ctx.fillStyle = g2;
            ctx.fillRect(sx - (act ? 14 : 8), plumeTop, act ? 28 : 16, o.floor - plumeTop);
            ctx.restore();
          }
        });

        // the carp
        if (!dead) {
          ctx.save();
          ctx.translate(PLAYER_X, y);
          ctx.rotate(U.clamp(vy / 900, -0.5, 0.5));
          var sw = Math.sin(t * 14) * 0.25;
          ctx.shadowColor = ACCENT; ctx.shadowBlur = 14; ctx.fillStyle = ACCENT;
          ctx.beginPath();
          ctx.moveTo(14, 0);
          ctx.bezierCurveTo(8, -9, -8, -9 + sw * 6, -11, 0);
          ctx.bezierCurveTo(-8, 9 + sw * 6, 8, 9, 14, 0);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-10, 0); ctx.lineTo(-22, -8 + sw * 10); ctx.lineTo(-19, 0); ctx.lineTo(-22, 8 + sw * 10); ctx.closePath(); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffd6a0';
          ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(-6, -13 + sw * 4); ctx.lineTo(-5, -6); ctx.fill();
          ctx.fillStyle = '#fff3e0';
          ctx.beginPath(); ctx.ellipse(3, 3, 7, 3, 0, 0, 7); ctx.fill();
          ctx.fillStyle = '#05060f';
          ctx.beginPath(); ctx.arc(8, -2.5, 1.8, 0, 7); ctx.fill();
          ctx.restore();
        }

        // darkness with the carp's own light (the abyss, dimmer at the vents)
        var darkness = P.dark * (1 - b) + Z.dark * b;
        if (darkness > 0.02) {
          dctx.globalCompositeOperation = 'source-over';
          dctx.clearRect(0, 0, W, H);
          dctx.fillStyle = 'rgba(0,0,6,' + darkness.toFixed(3) + ')';
          dctx.fillRect(0, 0, W, H);
          dctx.globalCompositeOperation = 'destination-out';
          var lx = PLAYER_X + 10, ly = y;
          var halo = dctx.createRadialGradient(lx, ly, 10, lx, ly, 90);
          halo.addColorStop(0, 'rgba(0,0,0,1)'); halo.addColorStop(1, 'rgba(0,0,0,0)');
          dctx.fillStyle = halo; dctx.fillRect(0, 0, W, H);
          var cone = dctx.createRadialGradient(lx, ly, 20, lx + 120, ly, 240);
          cone.addColorStop(0, 'rgba(0,0,0,0.95)'); cone.addColorStop(1, 'rgba(0,0,0,0)');
          dctx.fillStyle = cone;
          dctx.beginPath(); dctx.moveTo(lx, ly);
          dctx.lineTo(lx + 330, ly - 120 + vy * 0.1); dctx.lineTo(lx + 330, ly + 120 + vy * 0.1); dctx.closePath(); dctx.fill();
          ctx.drawImage(dark, 0, 0, W, H);
        }

        // lights on top of the darkness: pearls and anglerfish lures
        things.forEach(function (o) {
          var sx = o.x - dist;
          if (sx < -40 || sx > W + 40) return;
          if (o.kind === 'pearl' && !o.got) {
            ctx.save();
            ctx.shadowColor = PEARL; ctx.shadowBlur = 14 + pulse * 10; ctx.fillStyle = PEARL;
            var s2 = 7 + Math.sin(t * 5 + o.x) * 1.2 + pulse * 1.5;
            ctx.beginPath(); ctx.moveTo(sx, o.y - s2); ctx.lineTo(sx + s2, o.y); ctx.lineTo(sx, o.y + s2); ctx.lineTo(sx - s2, o.y); ctx.fill();
            ctx.restore();
          } else if (o.kind === 'lure') {
            var ly2 = o.baseY + Math.sin(t * 1.4 + o.phase) * o.amp;
            ctx.save();
            ctx.strokeStyle = 'rgba(120,160,255,0.35)'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(sx + 26, ly2 + 22); ctx.quadraticCurveTo(sx + 18, ly2 - 4, sx, ly2); ctx.stroke();
            ctx.fillStyle = '#aee6ff'; ctx.shadowColor = '#6fd0ff'; ctx.shadowBlur = 24;
            ctx.beginPath(); ctx.arc(sx, ly2, 5 + Math.sin(t * 6 + o.phase), 0, 7); ctx.fill();
            // the fish behind the light, only hinted
            ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(40,50,90,0.55)';
            ctx.beginPath(); ctx.ellipse(sx + 34, ly2 + 26, 20, 13, 0, 0, 7); ctx.fill();
            ctx.fillStyle = 'rgba(230,240,255,0.7)';
            for (var tt = 0; tt < 4; tt++) ctx.fillRect(sx + 18 + tt * 5, ly2 + 25, 2, 4);
            ctx.restore();
          }
        });

        if (bannerT > 0) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, bannerT) * 0.9;
          U.glowText(ctx, Z.name, W / 2, 70, 20, Z.edge);
          ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace'; ctx.textAlign = 'center';
          ctx.fillStyle = 'rgba(220,240,255,0.7)';
          ctx.fillText(Z.from + ' m', W / 2, 96);
          ctx.restore();
        }
        if (!started && !dead) {
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.4;
          U.glowText(ctx, 'HOLD TO SWIM', W / 2, H / 2 + 60, 16, '#bfefff');
          ctx.restore();
        }
      }
    };
  }

  function attract(ctx, w, h, t) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0a4d6e'); g.addColorStop(1, '#010812');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var off = t * 60;
    function edge(isTop) {
      ctx.beginPath();
      ctx.moveTo(0, isTop ? 0 : h);
      for (var x = 0; x <= w; x += 6) {
        var c = h / 2 + Math.sin((x + off) * 0.018) * h * 0.14;
        var gap = h * 0.5 + Math.sin((x + off) * 0.05) * h * 0.04;
        ctx.lineTo(x, isTop ? c - gap / 2 : c + gap / 2);
      }
      ctx.lineTo(w, isTop ? 0 : h);
      ctx.closePath();
      ctx.fillStyle = '#0c3a3a'; ctx.fill();
      ctx.strokeStyle = '#5fffd0'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    ctx.save(); ctx.shadowColor = '#5fffd0'; ctx.shadowBlur = 8; edge(true); edge(false); ctx.restore();
    var px = w * 0.3, py = h / 2 + Math.sin((px + off) * 0.018) * h * 0.14;
    ctx.save();
    ctx.shadowColor = ACCENT; ctx.shadowBlur = 10; ctx.fillStyle = ACCENT;
    ctx.beginPath(); ctx.ellipse(px, py, 8, 5, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(px - 6, py); ctx.lineTo(px - 13, py - 5 + Math.sin(t * 16) * 2); ctx.lineTo(px - 13, py + 5 + Math.sin(t * 16) * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = PEARL;
    var kx = ((w * 0.8 - t * 40) % w + w) % w;
    ctx.fillRect(kx, h / 2 + Math.sin((kx + off) * 0.018) * h * 0.14 - 3, 5, 5);
  }

  XA.registerGame({
    id: 'xa_cave_diver',
    order: 3,
    title: 'Cave Diver',
    tagline: 'Reef, kelp, abyss, vents. How deep?',
    color: ACCENT,
    size: { w: W, h: H },
    touch: 'hold',
    controls: 'Hold Space / ↑ / tap-and-hold',
    create: create,
    attract: attract
  });
})(window);
