/*
 * Xtrata Arcade — shared kit (leaf module)
 *
 * Every game cartridge and the room itself depend on this module. It owns:
 *   - the game registry            XA.registerGame(def) / XA.games
 *   - input (keys, touch pads, swipes, hold)   XA.createInput(el)
 *   - a tiny WebAudio synth        XA.audio
 *   - particles / floating text    XA.createFx()
 *   - small helpers                XA.util
 *
 * No network access and no wallet code live here, so a cartridge can never
 * reach the score contract except through the room.
 */
(function (root) {
  'use strict';
  if (root.XA && root.XA.kitVersion) return;

  var KIT_VERSION = '1.0.0';

  /* ------------------------------------------------------------ util */
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  // mulberry32 — small seeded RNG so a run can be replayed from its seed.
  function rng(seed) {
    var s = (seed >>> 0) || 0x9e3779b9;
    var f = function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.int = function (n) { return Math.floor(f() * n); };
    f.range = function (a, b) { return a + f() * (b - a); };
    f.pick = function (arr) { return arr[Math.floor(f() * arr.length)]; };
    return f;
  }
  function newSeed() {
    try {
      var a = new Uint32Array(1);
      root.crypto.getRandomValues(a);
      return a[0] >>> 0;
    } catch (e) {
      return (Date.now() ^ (Math.random() * 4294967296)) >>> 0;
    }
  }
  function store(key, value) {
    try {
      if (value === undefined) {
        var raw = root.localStorage.getItem('xa:' + key);
        return raw == null ? null : JSON.parse(raw);
      }
      root.localStorage.setItem('xa:' + key, JSON.stringify(value));
    } catch (e) { /* storage may be blocked in sandboxed frames */ }
    return null;
  }
  function fmt(n) {
    return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function glowText(ctx, text, x, y, size, color, align, weight) {
    ctx.save();
    ctx.font = (weight || 800) + ' ' + size + 'px "Press Start 2P", ui-monospace, Menlo, Consolas, monospace';
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.6;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.globalAlpha = 0.35;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ----------------------------------------------------------- audio */
  var audio = (function () {
    var ctx = null;
    var master = null;
    var muted = !!store('muted');
    function ensure() {
      if (ctx) return ctx;
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.32;
        master.connect(ctx.destination);
      } catch (e) { ctx = null; }
      return ctx;
    }
    function unlock() {
      var c = ensure();
      if (c && c.state === 'suspended' && c.resume) c.resume();
    }
    // tone(freq, dur, {type, vol, slide, delay})
    function tone(freq, dur, o) {
      o = o || {};
      var c = ensure();
      if (!c || muted) return;
      var t0 = c.currentTime + (o.delay || 0);
      var osc = c.createOscillator();
      var g = c.createGain();
      osc.type = o.type || 'square';
      osc.frequency.setValueAtTime(freq, t0);
      if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * o.slide), t0 + dur);
      var v = o.vol == null ? 0.25 : o.vol;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(v, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g); g.connect(master);
      osc.start(t0); osc.stop(t0 + dur + 0.02);
    }
    function noise(dur, o) {
      o = o || {};
      var c = ensure();
      if (!c || muted) return;
      var len = Math.max(1, Math.floor(c.sampleRate * dur));
      var buf = c.createBuffer(1, len, c.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      var src = c.createBufferSource();
      src.buffer = buf;
      var filter = c.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = o.cutoff || 1800;
      var g = c.createGain();
      g.gain.value = o.vol == null ? 0.3 : o.vol;
      src.connect(filter); filter.connect(g); g.connect(master);
      src.start(c.currentTime + (o.delay || 0));
    }
    function arp(notes, step, o) {
      for (var i = 0; i < notes.length; i++) {
        tone(notes[i], step * 1.4, Object.assign({}, o, { delay: i * step }));
      }
    }
    function setMuted(m) {
      muted = !!m;
      store('muted', muted);
      if (master) master.gain.value = muted ? 0 : 0.32;
    }
    return {
      unlock: unlock, tone: tone, noise: noise, arp: arp,
      // Shared graph access for the music engine: it plays through the same
      // master gain, so the mute button silences music and effects alike.
      context: function () { return ensure(); },
      bus: function () { ensure(); return master; },
      isMuted: function () { return muted; }, setMuted: setMuted
    };
  })();

  /* -------------------------------------------------------------- fx */
  function createFx() {
    var parts = [];
    var texts = [];
    return {
      burst: function (x, y, color, n, speed, life) {
        n = n || 14; speed = speed || 120; life = life || 0.6;
        for (var i = 0; i < n; i++) {
          var a = Math.random() * Math.PI * 2;
          var s = speed * (0.35 + Math.random() * 0.65);
          parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
            life: life * (0.6 + Math.random() * 0.4), max: life, color: color,
            size: 1.5 + Math.random() * 2.5 });
        }
        if (parts.length > 900) parts.splice(0, parts.length - 900);
      },
      trail: function (x, y, color, vx, vy) {
        parts.push({ x: x, y: y, vx: vx || 0, vy: vy || 0, life: 0.35, max: 0.35, color: color, size: 2 });
      },
      text: function (x, y, str, color, size) {
        texts.push({ x: x, y: y, str: str, color: color || '#fff', life: 0.9, size: size || 14 });
      },
      update: function (dt) {
        var i;
        for (i = parts.length - 1; i >= 0; i--) {
          var p = parts[i];
          p.life -= dt;
          if (p.life <= 0) { parts.splice(i, 1); continue; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          p.vx *= 0.96; p.vy *= 0.96;
        }
        for (i = texts.length - 1; i >= 0; i--) {
          texts[i].life -= dt;
          texts[i].y -= 28 * dt;
          if (texts[i].life <= 0) texts.splice(i, 1);
        }
      },
      draw: function (ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          ctx.globalAlpha = Math.max(0, p.life / p.max);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.restore();
        for (var j = 0; j < texts.length; j++) {
          var t = texts[j];
          ctx.save();
          ctx.globalAlpha = Math.min(1, t.life * 2);
          glowText(ctx, t.str, t.x, t.y, t.size, t.color);
          ctx.restore();
        }
      },
      clear: function () { parts.length = 0; texts.length = 0; }
    };
  }

  /* ----------------------------------------------------------- input */
  var KEYMAP = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    Space: 'a',
    KeyZ: 'b', KeyJ: 'b',
    KeyX: 'c', KeyK: 'c',
    KeyC: 'd', ShiftLeft: 'd', ShiftRight: 'd',
    Digit1: 'k1', Digit2: 'k2', Digit3: 'k3', Digit4: 'k4', Digit5: 'k5',
    Digit6: 'k6', Digit7: 'k7', Digit8: 'k8', Digit9: 'k9',
    Numpad1: 'k1', Numpad2: 'k2', Numpad3: 'k3', Numpad4: 'k4', Numpad5: 'k5',
    Numpad6: 'k6', Numpad7: 'k7', Numpad8: 'k8', Numpad9: 'k9',
    KeyF: 'f',
    Enter: 'start',
    Escape: 'pause', KeyP: 'pause'
  };

  // One input object per play session. `surface` receives pointer events
  // (hold + swipe); on-screen pads call press()/release() directly.
  function createInput(surface) {
    var held = {};
    var hitQ = {};
    var swipes = [];
    var pointer = { down: false, x: 0, y: 0, sx: 0, sy: 0, t: 0, id: null, swiped: false, moved: 0 };
    var listeners = [];

    function press(name) {
      if (!held[name]) hitQ[name] = true;
      held[name] = true;
    }
    function release(name) { held[name] = false; }
    function on(target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      listeners.push(function () { target.removeEventListener(type, fn, opts); });
    }

    on(root, 'keydown', function (e) {
      var name = KEYMAP[e.code];
      if (!name) return;
      e.preventDefault();
      if (e.repeat) return;
      press(name);
    });
    on(root, 'keyup', function (e) {
      var name = KEYMAP[e.code];
      if (name) release(name);
    });
    on(root, 'blur', function () { held = {}; pointer.down = false; });

    if (surface) {
      var SWIPE = 24;
      on(surface, 'pointerdown', function (e) {
        // Leave real UI (overlay buttons, name input) alone: capturing the
        // pointer here would retarget their click to the surface.
        var t = e.target;
        if (t && t !== surface && t.closest && t.closest('button, a, input, select, textarea, [data-xa-ui]')) return;
        audio.unlock();
        pointer.down = true; pointer.id = e.pointerId; pointer.swiped = false;
        pointer.sx = pointer.x = e.clientX; pointer.sy = pointer.y = e.clientY; pointer.moved++;
        pointer.t = performance.now();
        press('hold');
        try { surface.setPointerCapture(e.pointerId); } catch (err) {}
        e.preventDefault();
      }, { passive: false });
      on(surface, 'pointermove', function (e) {
        // Hover (mouse) still updates the position so aiming games can follow it.
        if (!pointer.down) {
          if (e.pointerType === 'mouse') { pointer.x = e.clientX; pointer.y = e.clientY; pointer.moved++; }
          return;
        }
        if (e.pointerId !== pointer.id) return;
        pointer.x = e.clientX; pointer.y = e.clientY; pointer.moved++;
        var dx = pointer.x - pointer.sx, dy = pointer.y - pointer.sy;
        if (Math.abs(dx) > SWIPE || Math.abs(dy) > SWIPE) {
          var dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
          swipes.push(dir);
          pointer.swiped = true;
          pointer.sx = pointer.x; pointer.sy = pointer.y;
        }
      });
      var end = function (e) {
        if (e.pointerId !== pointer.id) return;
        if (pointer.down && !pointer.swiped && performance.now() - pointer.t < 260) swipes.push('tap');
        pointer.down = false;
        release('hold');
        // Edge event so a press+release inside one frame is never lost.
        hitQ.release = true;
      };
      on(surface, 'pointerup', end);
      on(surface, 'pointercancel', end);
    }

    return {
      // held: is the virtual button down right now?
      held: function (name) { return !!held[name]; },
      // hit: was it pressed since the last endFrame()? (edge-triggered)
      hit: function (name) { return !!hitQ[name]; },
      takeSwipes: function () { var s = swipes; swipes = []; return s; },
      pointer: pointer,
      press: press,
      release: release,
      endFrame: function () { hitQ = {}; },
      reset: function () { held = {}; hitQ = {}; swipes = []; },
      destroy: function () { listeners.forEach(function (off) { off(); }); listeners = []; }
    };
  }

  /* -------------------------------------------------------- registry */
  var games = [];
  function registerGame(def) {
    var required = ['id', 'title', 'create', 'attract', 'size'];
    for (var i = 0; i < required.length; i++) {
      if (!def[required[i]]) throw new Error('Game is missing "' + required[i] + '"');
    }
    if (!/^[a-z0-9_]{3,32}$/.test(def.id)) throw new Error('Invalid game id ' + def.id);
    if (games.some(function (g) { return g.id === def.id; })) return;
    def.mode = def.mode === 'time' ? 'time' : 'score';
    games.push(def);
    games.sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
    if (typeof root.dispatchEvent === 'function') {
      try { root.dispatchEvent(new CustomEvent('xa:game-registered', { detail: def.id })); } catch (e) {}
    }
  }

  root.XA = {
    kitVersion: KIT_VERSION,
    games: games,
    registerGame: registerGame,
    createInput: createInput,
    createFx: createFx,
    audio: audio,
    util: {
      clamp: clamp, lerp: lerp, rng: rng, newSeed: newSeed, store: store,
      fmt: fmt, glowText: glowText, roundRect: roundRect
    }
  };
})(typeof window !== 'undefined' ? window : this);
