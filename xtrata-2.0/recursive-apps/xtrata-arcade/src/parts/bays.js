/*
 * Xtrata Arcade: the bay engine (hall pack part)
 *
 * A bay is a reserved wall area built into the hall (the four spans at the ends of the rows). The world contract decides what is in
 * it; this file turns that decision into something the hall can show and play. Three parts:
 *
 *   1. PLAN    pure functions (no THREE, no DOM). planBay() takes one bay as the reader read it plus the looks table
 *              and returns a validated plan, or null for "show the posters as always". Only built-in looks (tier 0)
 *              are drawn here; every param is clamped and every key is looked up in a fixed table, so chain data
 *              can choose among prepared pieces and cannot run anything.
 *   2. ENGINE  create(env) builds the pieces in the hall's THREE scene (curtain, sign board, caution tape, lights,
 *              a plain door slab until the door port) and animates scene changes.
 *   3. AUDIO   synthesised work and fabric sounds as positional voices on the hall's room audio bus.
 *
 * Off unless the hall creates it (which it does only when the world reader is enabled): the hall is #3111 otherwise.
 * Doors (phase 3b) and recipes (3c) are not here yet: a door scene shows a plain slab.
 */
(function (root) {
  'use strict';
  if (root.XABays) return;

  /* ================================================================ 1. PLAN (pure) */
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  function num(v, lo, hi, def) {
    v = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
    return typeof v === 'number' && isFinite(v) ? clamp(v, lo, hi) : def;
  }
  function txt(v, max) { return String(v == null ? '' : v).toUpperCase().replace(/[^A-Z0-9 .,!?:'&\/-]/g, '').slice(0, max); }
  function hex(v, def) { return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v.toLowerCase() : def; }
  var WHITE = null;   // set once THREE is known (create)
  var TONES = { blue: '#3d86ff', orange: '#ff8a2a', gold: '#ffc53d', white: '#e8ecff', red: '#ff4d4d', green: '#4dff9a' };
  function slug(v, max) { return typeof v === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v) && v.length >= 2 && v.length <= max ? v : ''; }
  function tone(v, def) { return Object.prototype.hasOwnProperty.call(TONES, v) ? v : def; }
  var WORK_SOUNDS = ['hammer', 'saw', 'drill', 'clatter'];

  // The built-in looks. kind: 1 cover, 2 overlay, 3 sound, 4 light (the contract's look kinds). norm() returns clean params.
  var BUILTIN = {
    'curtain-house': { kind: 1, norm: function (p) { return { color: hex(p.color, null), trim: hex(p.trim, null), openness: num(p.openness, 0, 1, 0), speed: num(p.speed, 0.1, 5, 1) }; } },
    // the sign's x, y and w place it on its own, whatever door or curtain is in the bay
    'sign-board': { kind: 2, norm: function (p) { return { text: txt(p.text, 22), sub: txt(p.sub, 34), tone: tone(p.tone, 'orange'), y: num(p.y, 0.4, 2.9, 2.55), x: num(p.x, -3, 3, 0), w: num(p.w, 0.4, 3, 2), front: p.front === true }; } },
    'caution-tape': { kind: 2, norm: function (p) { return { y: num(p.y, 0.4, 2.6, 1.2) }; } },
    'work-site': { kind: 3, norm: function (p) {
      var kinds = (typeof p.kinds === 'string' ? p.kinds.split(',') : Array.isArray(p.kinds) ? p.kinds : WORK_SOUNDS)
        .map(function (k) { return String(k).trim(); }).filter(function (k, i, a) { return WORK_SOUNDS.indexOf(k) >= 0 && a.indexOf(k) === i; });
      return { kinds: kinds.length ? kinds : WORK_SOUNDS.slice(), volume: num(p.volume, 0, 1, 0.6), radius: num(p.radius, 2, 12, 7), gap: num(p.gap, 0.3, 8, 1.6) };
    } },
    'hum': { kind: 3, norm: function (p) { return { volume: num(p.volume, 0, 1, 0.4), radius: num(p.radius, 2, 12, 6), pitch: num(p.pitch, 40, 400, 110) }; } },
    'light-steady': { kind: 4, norm: function (p) { return { tone: tone(p.tone, 'white'), intensity: num(p.intensity, 0, 2, 0.8), rate: 1 }; } },
    'light-pulse': { kind: 4, norm: function (p) { return { tone: tone(p.tone, 'orange'), intensity: num(p.intensity, 0, 2, 0.9), rate: num(p.rate, 0.2, 8, 1) }; } },
    'light-flicker': { kind: 4, norm: function (p) { return { tone: tone(p.tone, 'white'), intensity: num(p.intensity, 0, 2, 0.9), rate: num(p.rate, 0.2, 8, 1) }; } },
    // The finish of a door (xtrata-door-skins-v1). Keys only; door-skins.js looks them up in its fixed tables and the registry says which exist.
    // Not drawn by the bay engine itself: the door port reads it from plan.overlays. '' means "the skin's own"; wear -1 likewise.
    'door-skin': { kind: 2, norm: function (p) { return { skin: slug(p.skin, 24), frame: slug(p.frame, 16), hardware: slug(p.hardware, 16), tint: hex(p.tint, ''), wear: p.wear == null ? -1 : num(p.wear, 0, 100, -1) }; } }
  };
  var COVER_STATE = { open: 1, half: 0.5, closed: 0 };
  // The door looks the hall can draw: a kind 0 look whose built-in key is 'door-<style>' (styles live in doors.js).
  var DOOR_STYLES = ['rect', 'tall', 'wide', 'arch', 'gothic', 'double', 'cathedral', 'circle', 'oval', 'hexagon', 'octagon', 'industrial', 'vintage', 'scifi'];
  function doorStyle(sc, looks) {
    var dl = sc.doorLook != null && looks ? looks[sc.doorLook] : null, key = dl && !dl.hidden && dl.approved && dl.tier === 0 && dl.kind === 0 && typeof dl.builtin === 'string' ? dl.builtin : '';
    return key.indexOf('door-') === 0 && DOOR_STYLES.indexOf(key.slice(5)) >= 0 ? key.slice(5) : 'rect';   // no (usable) look: the classic door
  }
  var MAX_OVERLAYS = 4;

  function parseParams(s) {
    if (typeof s !== 'string' || !s || s.length > 256) return {};
    try { var o = JSON.parse(s); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; }
  }

  // bay: one entry of snapshot.bays ({scene:{base,interaction,doorLook,layers,link}} or {scene:null}); looks: snapshot.looks.
  // Returns null when the bay shows its posters with nothing added.
  function planBay(bay, looks) {
    var sc = bay && bay.scene;
    if (!sc) return null;
    var base = sc.base === 'wall' || sc.base === 'door' ? sc.base : 'posters';
    var plan = { base: base, interaction: num(sc.interaction, 0, 3, 0) | 0, link: sc.link || null, door: base === 'door' ? { style: doorStyle(sc, looks) } : null, cover: null, overlays: [], sound: null, light: null };
    (Array.isArray(sc.layers) ? sc.layers : []).forEach(function (layer) {
      var look = looks && looks[layer.look];
      if (!look || look.hidden || !look.approved || look.tier !== 0) return;             // only hall built-ins are drawn
      var def = Object.prototype.hasOwnProperty.call(BUILTIN, look.builtin) ? BUILTIN[look.builtin] : null;
      if (!def || def.kind !== look.kind || layer.slot !== look.kind) return;
      var p = def.norm(parseParams(layer.params)), state = String(layer.state || '');
      if (look.kind === 1) {
        if (Object.prototype.hasOwnProperty.call(COVER_STATE, state)) p.openness = COVER_STATE[state];
        plan.cover = { key: look.builtin, p: p };
      } else if (look.kind === 2) {
        if (plan.overlays.length < MAX_OVERLAYS) plan.overlays.push({ key: look.builtin, p: p });
      } else if (look.kind === 3) {
        if (state !== 'off') plan.sound = { key: look.builtin, p: p };
      } else if (look.kind === 4) {
        if (state !== 'off') plan.light = { key: look.builtin, p: p };
      }
    });
    return plan;
  }
  function planKey(plan) { return plan ? JSON.stringify(plan) : ''; }
  // Can a visitor pull this bay's curtain with the mouse? Only when the scene lets them look behind it, or it is already open.
  function curtainGrabbable(plan) { return !!(plan && plan.cover && (plan.interaction === 2 || plan.cover.p.openness >= 0.9)); }

  /* ================================================================ 3. AUDIO (synthesised, positional) */
  function createAudio() {
    var env = null;                        // { ctx, master, wet } once the hall's room audio exists
    var noiseBuf = null, voices = {};      // bay index -> voice
    var specs = {};                        // bay index -> { pos, sound }
    var log = [];                          // recent bursts, for tests

    function attach(e) { env = e && e.ctx ? e : null; }
    function noise(ctx) {
      if (noiseBuf && noiseBuf.sampleRate === ctx.sampleRate) return noiseBuf;
      var n = ctx.sampleRate, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      return (noiseBuf = b);
    }
    function env2(g, t, a, d, peak) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
    function hit(ctx, out, t, peak, freq, q, dur) {   // a burst of band-passed noise
      var s = ctx.createBufferSource(); s.buffer = noise(ctx); s.loop = true;
      var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
      var g = ctx.createGain(); env2(g, t, 0.003, dur, peak);
      s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
    }
    function tonePulse(ctx, out, t, type, f0, f1, dur, peak) {
      var o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
      var g = ctx.createGain(); env2(g, t, 0.004, dur, peak);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05);
    }
    var SYN = {
      hammer: function (ctx, out, t) {            // three or four knocks, wood on nail
        var n = 3 + Math.floor(Math.random() * 2), gap = 0.26 + Math.random() * 0.08;
        for (var i = 0; i < n; i++) { var tt = t + i * gap, v = 0.8 - i * 0.07; hit(ctx, out, tt, 0.55 * v, 2200, 1.4, 0.05); tonePulse(ctx, out, tt, 'sine', 170, 62, 0.11, 0.5 * v); }
        return n * gap;
      },
      saw: function (ctx, out, t) {               // short strokes of a hand saw
        var strokes = 3 + Math.floor(Math.random() * 2), len = 0.32;
        for (var i = 0; i < strokes; i++) {
          var tt = t + i * len, o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 200 + Math.random() * 40;
          var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(900, tt); f.frequency.linearRampToValueAtTime(1500, tt + len * 0.9); f.Q.value = 2.2;
          var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, tt); g.gain.linearRampToValueAtTime(0.28, tt + 0.04); g.gain.linearRampToValueAtTime(0.2, tt + len * 0.8); g.gain.linearRampToValueAtTime(0.0001, tt + len);
          o.connect(f); f.connect(g); g.connect(out); o.start(tt); o.stop(tt + len + 0.02);
        }
        return strokes * len;
      },
      drill: function (ctx, out, t) {             // a cordless drill spinning up and holding
        var dur = 0.6 + Math.random() * 0.5, o = ctx.createOscillator(); o.type = 'square';
        o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(190, t + 0.18); o.frequency.setValueAtTime(190, t + dur - 0.1); o.frequency.exponentialRampToValueAtTime(90, t + dur);
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1700;
        var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.22, t + 0.08); g.gain.setValueAtTime(0.2, t + dur - 0.1); g.gain.linearRampToValueAtTime(0.0001, t + dur);
        o.connect(lp); lp.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.02);
        hit(ctx, out, t, 0.12, 3200, 1.1, dur);
        return dur;
      },
      clatter: function (ctx, out, t) {           // something metal dropped and rolling
        var n = 6 + Math.floor(Math.random() * 4), tt = t;
        for (var i = 0; i < n; i++) { hit(ctx, out, tt, 0.4 * (1 - i / (n + 2)), 1500 + Math.random() * 3500, 3, 0.05); tt += 0.035 + Math.random() * 0.06 * (1 + i * 0.3); }
        return tt - t;
      },
      swish: function (ctx, out, t, strength) {   // cloth on a rail: a breath of filtered noise and a few rings
        var dur = 0.5 + strength * 0.5, s = ctx.createBufferSource(); s.buffer = noise(ctx); s.loop = true;
        var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(700, t); f.frequency.linearRampToValueAtTime(1800, t + dur * 0.5); f.frequency.linearRampToValueAtTime(900, t + dur); f.Q.value = 0.8;
        var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.22 * strength + 0.05, t + dur * 0.35); g.gain.linearRampToValueAtTime(0.0001, t + dur);
        s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
        for (var i = 0; i < 4; i++) hit(ctx, out, t + Math.random() * dur, 0.08, 4200 + Math.random() * 1500, 6, 0.04);
        return dur;
      }
    };

    function makeVoice(i, spec) {
      var ctx = env.ctx, g = ctx.createGain(); g.gain.value = 0.0001;
      var pan = ctx.createPanner(); pan.panningModel = 'HRTF'; pan.distanceModel = 'inverse'; pan.refDistance = 1.4; pan.rolloffFactor = 1.3; pan.maxDistance = 40;
      var p = spec.pos;
      if (pan.positionX) { pan.positionX.value = p.x; pan.positionY.value = p.y; pan.positionZ.value = p.z; } else pan.setPosition(p.x, p.y, p.z);
      var send = ctx.createGain(); send.gain.value = 0.22;
      g.connect(pan); pan.connect(env.master); g.connect(send); send.connect(env.wet);
      var v = { g: g, pan: pan, send: send, next: 0.15, hum: null, dying: false, kind: spec.sound.key };
      if (spec.sound.key === 'hum') {
        var o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600;
        o1.type = 'sine'; o1.frequency.value = spec.sound.p.pitch; o2.type = 'triangle'; o2.frequency.value = spec.sound.p.pitch * 2.003;
        var hg = ctx.createGain(); hg.gain.value = 0.5; o1.connect(lp); o2.connect(hg); hg.connect(lp); lp.connect(g); o1.start(); o2.start();
        v.hum = [o1, o2];
      }
      return v;
    }
    function dropVoice(i) {
      var v = voices[i]; if (!v) return; delete voices[i];
      try { if (v.hum) v.hum.forEach(function (o) { try { o.stop(); } catch (e) {} }); v.g.disconnect(); v.pan.disconnect(); v.send.disconnect(); } catch (e) {}
    }
    function fadeOut(i, secs) {
      var v = voices[i]; if (!v || v.dying || !env) return;
      v.dying = true; var t = env.ctx.currentTime;
      v.g.gain.cancelScheduledValues(t); v.g.gain.setValueAtTime(Math.max(0.0001, v.g.gain.value), t); v.g.gain.exponentialRampToValueAtTime(0.0001, t + secs);
      setTimeout(function () { if (voices[i] === v) dropVoice(i); }, secs * 1000 + 80);
    }

    // The scene for bay i changed (or was cleared). pos is where it sounds from, in hall coordinates.
    function setBay(i, pos, sound) {
      var old = specs[i];
      specs[i] = sound ? { pos: pos, sound: sound } : null;
      if (voices[i] && (!sound || !old || old.sound.key !== sound.key || JSON.stringify(old.sound.p) !== JSON.stringify(sound.p))) fadeOut(i, 0.6);
    }
    // Called every frame from the hall's room audio. gate: { active, listener:{x,z}, dt }.
    function update(dt, listener, active) {
      if (!env) return;
      var ctx = env.ctx, now = ctx.currentTime;
      Object.keys(specs).forEach(function (k) {
        var spec = specs[k], i = +k, v = voices[i];
        var near = !!spec && active && Math.hypot(spec.pos.x - listener.x, spec.pos.z - listener.z) < spec.sound.p.radius;
        if (!near) { if (v && !v.dying) fadeOut(i, 0.5); return; }
        if (v && v.dying) return;                           // let it finish fading, a new one starts after
        if (!v) { v = voices[i] = makeVoice(i, spec); v.g.gain.setValueAtTime(0.0001, now); v.g.gain.exponentialRampToValueAtTime(Math.max(0.0002, spec.sound.p.volume * 0.9), now + 0.6); }
        if (spec.sound.key === 'work-site') {
          v.next -= dt;
          if (v.next <= 0) {
            var kinds = spec.sound.p.kinds, k2 = kinds[Math.floor(Math.random() * kinds.length)];
            var len = SYN[k2](ctx, v.g, now + 0.02);
            log.push({ bay: i, kind: k2, at: now }); if (log.length > 40) log.shift();
            v.next = len + spec.sound.p.gap * (0.6 + Math.random() * 0.9);
          }
        }
      });
      Object.keys(voices).forEach(function (k) { if (!specs[k] && !voices[k].dying) fadeOut(+k, 0.5); });
    }
    // A one-off sound from a bay (cloth moving), only if the listener is inside `radius` metres.
    function oneShot(name, pos, listener, strength, radius) {
      if (!env || !SYN[name]) return false;
      if (Math.hypot(pos.x - listener.x, pos.z - listener.z) > (radius || 7)) return false;
      var ctx = env.ctx, g = ctx.createGain(); g.gain.value = 0.9;
      var pan = ctx.createPanner(); pan.panningModel = 'HRTF'; pan.distanceModel = 'inverse'; pan.refDistance = 1.4; pan.rolloffFactor = 1.3; pan.maxDistance = 40;
      if (pan.positionX) { pan.positionX.value = pos.x; pan.positionY.value = pos.y; pan.positionZ.value = pos.z; } else pan.setPosition(pos.x, pos.y, pos.z);
      g.connect(pan); pan.connect(env.master);
      var len = SYN[name](ctx, g, ctx.currentTime + 0.01, strength == null ? 0.7 : strength);
      log.push({ bay: -1, kind: name, at: ctx.currentTime });
      setTimeout(function () { try { g.disconnect(); pan.disconnect(); } catch (e) {} }, (len + 0.6) * 1000);
      return true;
    }
    function hush() { Object.keys(voices).forEach(function (k) { if (!voices[k].dying) fadeOut(+k, 0.3); }); }
    return {
      env: function () { return env; }, attach: attach, setBay: setBay, update: update, oneShot: oneShot, hush: hush,
      _log: function () { return log.slice(); },
      _voices: function () { return Object.keys(voices).filter(function (k) { return !voices[k].dying; }).map(Number); },
      _syn: SYN
    };
  }

  /* ================================================================ 2. ENGINE (needs THREE and the hall) */
  /*
   * env: {
   *   THREE, scene, camera, mkCanvas(w,h), tex(canvas),
   *   RW, RH,                       room width and ceiling height
   *   bays: [{ side:-1|1, z, width }],          one per bay, in contract order (0 = far left, 1 = far right)
   *   prompt(hint|null),            shows a one-line hint ('PULL THE CURTAIN') in the hall's HUD
   *   listener(): {x,z}             where the player stands
   * }
   */
  function create(env) {
    var T = env.THREE, scene = env.scene, audio = createAudio();
    WHITE = new T.Color(0xffffff);
    var DOORS = root.XADoors || null, SKINS = root.XADoorSkins || null;
    var doorSfx = DOORS ? DOORS.createSfx(function () { return audio.env(); }, function () { return env.listener(); }) : null;
    // Layering, from the wall outwards (metres in front of the wall): the door, set into the wall (its slab front is at about 0.045),
    // the tape stretched across it a few centimetres proud of it, and the curtain rail and cloth hung in front of all that. A sign board is
    // fixed to the wall behind the curtain (Z_SIGN_WALL) unless its scene sets front:true, which hangs it on the cloth (Z_SIGN).
    // The cloth is see-through and does not write depth, so a see-through door face would draw over it whatever its distance:
    // the door's own pieces (doors.js) draw at render order 0 to 2, the curtain after them.
    var RO_CURTAIN = 5;
    var Z_SIGN_WALL = 0.03, Z_TAPE = 0.085, Z_RAIL = 0.2, Z_CURTAIN = 0.21, Z_SIGN = 0.25;
    var DOOR_SILL = 0.09;                         // the hall's skirting strip is a 3 cm bar centred at 7 cm: its top is at 8.5 cm
    var CURTAIN_MARGIN_M = 0.8;                   // how far past each rail end the cloth can be pulled and still be seen
    var CW = 720;                                // curtain canvas width, px (its height follows the bay)
    var bays = env.bays.map(function (d, i) { return makeBay(d, i); });
    var rayc = new T.Raycaster(); rayc.far = 4;
    var grab = null;                              // { bay, ndc }
    var firstApplied = false;
    var scope = null;                             // (bay index) -> true: only these bays can be looked at, grabbed or used (the hall's, or the lobby's)

    function makeBay(def, i) {
      // A bay is on a side wall of the hall, or (def.parent) on the wall of a room built in the parent group: placed there in that group's own frame.
      var g = new T.Group();
      if (def.parent) { g.position.set(def.x || 0, 0, def.z || 0); g.rotation.y = def.rot || 0; } else { g.position.set(def.side * (env.RW / 2 - 0.02), 0, def.z); g.rotation.y = def.side < 0 ? Math.PI / 2 : -Math.PI / 2; }
      g.visible = false; (def.parent || scene).add(g);              // nothing is shown until a scene needs it
      // The lamp: a real fixture you can see, a work lamp on a short arm above the door with a bare bulb under its shade, and the light comes from the bulb.
      // (It used to be an invisible point light in the air in front of the wall: you saw the glow on things and could not tell where it came from.)
      var light = new T.PointLight(0xffffff, 0, 7, 2); light.position.set(0, 2.96, 0.42); g.add(light);
      var fix = new T.Group(); fix.visible = false; g.add(fix);
      var metal = new T.MeshStandardMaterial({ color: 0x23232b, metalness: 0.7, roughness: 0.45 });
      var arm = new T.Mesh(new T.BoxGeometry(0.035, 0.035, 0.38), metal); arm.position.set(0, 3.1, 0.19);
      var plate = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 0.02), metal); plate.position.set(0, 3.1, 0.01);
      var shade = new T.Mesh(new T.CylinderGeometry(0.05, 0.15, 0.13, 20, 1, true), new T.MeshStandardMaterial({ color: 0x2c2c36, metalness: 0.7, roughness: 0.4, side: T.DoubleSide })); shade.position.set(0, 3.07, 0.42);
      var bulbMat = new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false });
      var bulb = new T.Mesh(new T.SphereGeometry(0.045, 14, 10), bulbMat); bulb.position.set(0, 2.98, 0.42);
      var cage = new T.Mesh(new T.CylinderGeometry(0.062, 0.062, 0.1, 8, 1, true), new T.MeshBasicMaterial({ color: 0x15151a, wireframe: true })); cage.position.set(0, 2.98, 0.42);
      var gcv = env.mkCanvas(64, 64), gx = gcv.getContext('2d'), gg = gx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gg.addColorStop(0, 'rgba(255,255,255,1)'); gg.addColorStop(0.25, 'rgba(255,255,255,0.45)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); gx.fillStyle = gg; gx.fillRect(0, 0, 64, 64);
      var glowMat = new T.SpriteMaterial({ map: env.tex(gcv), color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending, fog: false });
      var glow = new T.Sprite(glowMat); glow.scale.set(0.7, 0.7, 1); glow.position.set(0, 2.98, 0.42);
      arm.raycast = plate.raycast = shade.raycast = bulb.raycast = cage.raycast = glow.raycast = function () {};
      fix.add(arm, plate, shade, bulb, cage, glow);
      var width = Math.min(2.8, Math.max(1.2, def.width - 0.2));
      return { i: i, def: def, group: g, light: light, fixture: fix, bulbMat: bulbMat, glowMat: glowMat, lightSpec: null, plan: null, key: '', width: width, curtain: null, overlays: [], door: null,
        pos: def.parent ? { x: 0, y: 1.6, z: 0 } : { x: def.side * (env.RW / 2 - 0.4), y: 1.6, z: def.z } };
    }
    // A bay in a room that can move (the lobby is put behind whichever wall holds its door): its place in the world, for sounds and the door's own sounds.
    var _wp = null;
    function refreshPos(bay) {
      if (!bay.def.parent) return;
      _wp = _wp || new T.Vector3(); bay.group.updateWorldMatrix(true, false); _wp.set(0, 1.6, 0.4); bay.group.localToWorld(_wp);
      bay.pos.x = _wp.x; bay.pos.z = _wp.z; var dm0 = bay.door && bay.door.model; if (dm0) { dm0.pos.x = _wp.x; dm0.pos.z = _wp.z; }
    }

    /* ---- pieces ---- */
    function disposeMesh(m) { if (!m) return; m.children.slice().forEach(function (c) { if (c.material) c.material.dispose(); if (c.geometry) c.geometry.dispose(); }); if (m.parent) m.parent.remove(m); if (m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); } if (m.geometry) m.geometry.dispose(); }

    function buildCurtain(bay, spec, instant) {
      var C = root.XACurtain; if (!C) return null;
      var openness = spec.p.openness;
      // the cloth hangs from the rail to just above the floor: the canvas keeps the cloth's proportions at any bay width
      var railY = Math.min(env.RH - 0.25, 2.95), ch = clamp(Math.round(CW * (railY - 0.04) / bay.width), 400, 1400);
      // room beside the rail ends so cloth pulled past them is drawn, not cut off at the edge of the picture
      var mg = Math.round(CURTAIN_MARGIN_M * CW / bay.width), cwFull = CW + 2 * mg;
      var sim = C.createCurtainSim({ width: CW, height: ch, reach: mg - 2, color: spec.p.color || undefined, trim: spec.p.trim || undefined, openness: openness, speed: spec.p.speed });
      var cv = env.mkCanvas(cwFull, ch), r = C.createCurtainRenderer(sim, cv.getContext('2d'), { margin: mg });
      r.draw();
      var t = env.tex(cv); t.anisotropy = 4;
      var h = bay.width * ch / CW;
      var mesh = new T.Mesh(new T.PlaneGeometry(bay.width * cwFull / CW, h), new T.MeshBasicMaterial({ map: t, transparent: true, color: 0xd2d2da, depthWrite: false }));
      mesh.position.set(0, railY - h / 2, Z_CURTAIN); mesh.renderOrder = RO_CURTAIN; bay.group.add(mesh);
      var rail = new T.Mesh(new T.BoxGeometry(bay.width + 0.24, 0.035, 0.06), new T.MeshStandardMaterial({ color: 0x2a2a33, metalness: 0.8, roughness: 0.3 }));
      rail.position.set(0, railY + 0.02, Z_RAIL); bay.group.add(rail);
      return { sim: sim, r: r, cv: cv, tex: t, mesh: mesh, rail: rail, style: JSON.stringify([spec.p.color, spec.p.trim]), target: openness, h: h, railY: railY, mg: mg, cwFull: cwFull };
    }
    function disposeCurtain(c) { if (!c) return; disposeMesh(c.mesh); disposeMesh(c.rail); }

    function signTexture(p) {
      var cv = env.mkCanvas(1024, 256), x = cv.getContext('2d'), col = TONES[p.tone];
      x.fillStyle = '#0a0912'; x.fillRect(0, 0, 1024, 256);
      x.strokeStyle = col; x.lineWidth = 8; x.strokeRect(14, 14, 996, 228);
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = col; x.shadowBlur = 18; x.fillStyle = col;
      var size = p.text.length > 14 ? 78 : 104; x.font = size + 'px Bungee, Impact, sans-serif';
      x.fillText(p.text, 512, p.sub ? 100 : 128, 940);
      if (p.sub) { x.shadowBlur = 8; x.fillStyle = '#e8ecff'; x.font = '54px VT323, monospace'; x.fillText(p.sub, 512, 192, 940); }
      return cv;
    }
    function tapeTexture() {
      var cv = env.mkCanvas(512, 64), x = cv.getContext('2d');
      x.fillStyle = '#f5c518'; x.fillRect(0, 0, 512, 64); x.fillStyle = '#16130a';
      for (var s = -64; s < 576; s += 64) { x.beginPath(); x.moveTo(s, 64); x.lineTo(s + 32, 64); x.lineTo(s + 64, 0); x.lineTo(s + 32, 0); x.closePath(); x.fill(); }
      return cv;
    }
    function buildOverlay(bay, spec) {
      if (spec.key === 'sign-board') {
        var w = Math.min(spec.p.w, bay.width - 0.2), m = new T.Mesh(new T.PlaneGeometry(w, w / 4), new T.MeshBasicMaterial({ map: env.tex(signTexture(spec.p)), color: 0xdadada })),
            sx = Math.max(-(bay.width / 2 - w / 2 - 0.05), Math.min(bay.width / 2 - w / 2 - 0.05, spec.p.x));   // kept on the wall of this bay
        m.position.set(sx, spec.p.y, spec.p.front ? Z_SIGN : Z_SIGN_WALL); m.renderOrder = 3; m.userData.key = spec.key; bay.group.add(m); return m;
      }
      if (spec.key === 'caution-tape') {
        var tw = bay.width - 0.02, tt = env.tex(tapeTexture()); tt.wrapS = T.RepeatWrapping; tt.repeat.set(Math.round(tw * 2), 1);
        var tm = new T.Mesh(new T.PlaneGeometry(tw, 0.14), new T.MeshBasicMaterial({ map: tt, color: 0xdadada, side: T.DoubleSide }));
        tm.position.set(0, spec.p.y, Z_TAPE); tm.rotation.z = 0.035; tm.renderOrder = 1; tm.userData.key = spec.key; bay.group.add(tm);
        // a soft shadow just under the tape, on whatever is behind it, so it reads as stretched across the door and not painted on
        var sh = new T.Mesh(new T.PlaneGeometry(tw, 0.17), new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false }));
        sh.position.set(0, -0.045, -0.02); sh.renderOrder = 1; sh.raycast = function () {}; tm.add(sh);   // a child: it tilts with the tape
        return tm;
      }
      return null;
    }
    // A small generated environment for metal and gloss to reflect: a dim room with a few soft lights. One for the whole hall.
    var skinEnv = null;
    function getSkinEnv() {
      if (skinEnv) return skinEnv;
      var cv = env.mkCanvas(256, 128), x = cv.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, '#9aa6d8'); g.addColorStop(0.45, '#6b5f8c'); g.addColorStop(0.5, '#3a2f4a'); g.addColorStop(1, '#120c18'); x.fillStyle = g; x.fillRect(0, 0, 256, 128);
      [[40, 36, 26, '#fff3dd'], [128, 30, 34, '#ffffff'], [210, 40, 24, '#ffd9a8'], [90, 58, 18, '#b8c8ff']].forEach(function (l) {
        var r = x.createRadialGradient(l[0], l[1], 0, l[0], l[1], l[2]); r.addColorStop(0, l[3]); r.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = r; x.fillRect(l[0] - l[2], l[1] - l[2], l[2] * 2, l[2] * 2);
      });
      var t = new T.CanvasTexture(cv); t.mapping = T.EquirectangularReflectionMapping; t.encoding = T.sRGBEncoding; skinEnv = t; return t;
    }
    // A second generated room for the door hardware: metal only shows its colour where it has something bright to reflect, so this one has a
    // bright ceiling, warm walls at the horizon, a few soft windows and lamps, and a darker floor. One for the whole hall.
    var hwEnv = null;
    function getHwEnv() {
      if (hwEnv) return hwEnv;
      var cv = env.mkCanvas(256, 128), x = cv.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, '#f2f4ff'); g.addColorStop(0.3, '#c8cadc'); g.addColorStop(0.44, '#dcd8d2'); g.addColorStop(0.53, '#c4c0ba'); g.addColorStop(0.64, '#6c6660'); g.addColorStop(1, '#241d1b'); x.fillStyle = g; x.fillRect(0, 0, 256, 128);
      [[20, 52, 34, 14, '#fff4e0'], [86, 44, 40, 18, '#ffffff'], [150, 56, 30, 12, '#ffe2b8'], [206, 48, 38, 16, '#e8f0ff'], [128, 20, 70, 10, '#ffffff'], [52, 70, 24, 8, '#ffd9a0']].forEach(function (l) {
        var r = x.createRadialGradient(l[0], l[1], 0, l[0], l[1], l[2]); r.addColorStop(0, l[4]); r.addColorStop(0.6, l[4]); r.addColorStop(1, 'rgba(255,255,255,0)');
        x.save(); x.translate(l[0], l[1]); x.scale(1, l[3] / l[2]); x.translate(-l[0], -l[1]); x.fillStyle = r; x.fillRect(l[0] - l[2], l[1] - l[2], l[2] * 2, l[2] * 2); x.restore();
      });
      var t = new T.CanvasTexture(cv); t.mapping = T.EquirectangularReflectionMapping; t.encoding = T.sRGBEncoding; hwEnv = t; return t;
    }
    // The finish the plan asks for (an overlay with the door-skin look), or null: the neon Threshold look as before.
    // Unknown skins, and skins that do not suit this door style, fall back to the neon look.
    function skinOf(plan, style) {
      if (!SKINS || !plan) return null;
      var ov = null; (plan.overlays || []).forEach(function (s) { if (s.key === 'door-skin') ov = s; });
      if (!ov) return null;
      var p = SKINS.normSkinParams(ov.p), def = SKINS.SKINS[p.skin];
      if (!def || p.skin === 'neon' || !SKINS.allowed(def.mask, style)) return null;
      var fk = p.frame || def.frame;
      return { kit: SKINS, key: p.skin, sound: def.sound, rec: def.recipe, frameRec: SKINS.FRAMES[fk] || null, hw: SKINS.HARDWARE[p.hardware || def.hardware] || null, wear: (p.wear < 0 ? def.wear : p.wear) / 100, tint: p.tint || '', maxSide: root.XA_LOWFX || (root.navigator && root.navigator.hardwareConcurrency && root.navigator.hardwareConcurrency <= 2) ? 256 : 512, env: getSkinEnv(), envHw: getHwEnv(), family: def.family || '', sig: JSON.stringify([p.skin, fk, p.hardware || def.hardware, p.tint, p.wear]) };
    }
    // The real door when doors.js is loaded (the Threshold port), else a plain slab.
    function buildDoor(bay, style, interaction, skin) {
      if (DOORS) {
        var model = new DOORS.DoorModel({ style: style, locked: interaction < 2, sound: skin ? skin.sound : '' }, doorSfx);
        model.pos = { x: bay.pos.x, y: 1.2 + DOOR_SILL, z: bay.pos.z };
        var mesh = DOORS.buildMesh({ THREE: T, mkCanvas: env.mkCanvas, tex: env.tex, model: model, maxW: bay.width - 0.4, maxH: 2.2, skin: skin || null });
        mesh.group.position.y = DOOR_SILL;                       // the door stands on the top of the orange skirting strip, not in front of it
        bay.group.add(mesh.group);
        return { style: style, skin: skin ? skin.sig : '', model: model, mesh: mesh };
      }
      var g = new T.Group(), w = Math.min(1.1, bay.width - 0.4);
      var frame = new T.Mesh(new T.BoxGeometry(w + 0.16, 2.26, 0.05), new T.MeshStandardMaterial({ color: 0x1b1b22, metalness: 0.6, roughness: 0.4 }));
      var leaf = new T.Mesh(new T.BoxGeometry(w, 2.1, 0.06), new T.MeshStandardMaterial({ color: 0x3a3f52, metalness: 0.5, roughness: 0.5 }));
      var knob = new T.Mesh(new T.SphereGeometry(0.035, 10, 8), new T.MeshStandardMaterial({ color: 0xc99a45, metalness: 0.9, roughness: 0.3 }));
      frame.position.set(0, 1.13, 0.03); leaf.position.set(0, 1.08, 0.065); knob.position.set(w / 2 - 0.12, 1.05, 0.12);
      g.add(frame, leaf, knob); bay.group.add(g); return { style: style, skin: '', group: g };
    }
    function disposeDoor(bay) {
      var d = bay.door; if (!d) return; bay.door = null;
      bay.portalOn = false;
      if (d.model) { try { d.model.sfx.kill(d.model); } catch (e) {} d.mesh.dispose(); } else disposeGroup(d.group);
    }
    // interaction 0 none, 1 knock (locked), 2 peek and 3 enter (unlocked, the visitor can open it)
    function setDoorMode(bay, interaction, quiet) {
      var m = bay.door && bay.door.model; if (!m) return;
      var locked = interaction < 2;
      if (m.cfg.locked && !locked) m.unlock(quiet);
      else if (!m.cfg.locked && locked) { if (m.isOpen()) m.close(); m.lock(quiet); }
    }
    function disposeGroup(g) { if (!g) return; g.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); if (g.parent) g.parent.remove(g); }

    /* ---- applying a plan ---- */
    function setPlan(bay, plan, instant) {
      var old = bay.plan; bay.plan = plan;
      bay.group.visible = !!plan;
      // cover
      var want = plan && plan.cover;
      if (!want) { if (bay.curtain) { disposeCurtain(bay.curtain); bay.curtain = null; } }
      else {
        var style = JSON.stringify([want.p.color, want.p.trim]);
        if (!bay.curtain || bay.curtain.style !== style) { disposeCurtain(bay.curtain); bay.curtain = buildCurtain(bay, want, instant); }
        else if (Math.abs(bay.curtain.target - want.p.openness) > 0.001) {
          bay.curtain.target = want.p.openness;
          bay.curtain.sim.setOpenAmount(want.p.openness, !instant, want.p.speed);
          if (!instant) audio.oneShot('swish', bay.pos, env.listener(), 0.5 + 0.5 * Math.abs(bay.curtain.sim.getOpenAmount() - want.p.openness), 9);
        }
      }
      // overlays (rebuilt when they change)
      var ok = JSON.stringify(old ? old.overlays : []), nk = JSON.stringify(plan ? plan.overlays : []);
      if (ok !== nk) { bay.overlays.forEach(disposeMesh); bay.overlays = []; (plan ? plan.overlays : []).forEach(function (s) { var m = buildOverlay(bay, s); if (m) bay.overlays.push(m); }); }
      // door slab
      var wantDoor = !!(plan && plan.base === 'door' && plan.door);
      if (!wantDoor) disposeDoor(bay);
      else {
        var skin = skinOf(plan, plan.door.style);
        if (bay.door && (bay.door.style !== plan.door.style || bay.door.skin !== (skin ? skin.sig : ''))) disposeDoor(bay);
        var fresh = !bay.door;
        if (fresh) bay.door = buildDoor(bay, plan.door.style, plan.interaction, skin);
        else setDoorMode(bay, plan.interaction, instant);
      }
      // light
      bay.lightSpec = plan && plan.light ? plan.light : null;
      if (!bay.lightSpec) bay.light.intensity = 0; else bay.light.color.set(TONES[bay.lightSpec.p.tone]);
      bay.fixture.visible = !!bay.lightSpec;
      // sound
      audio.setBay(bay.i, bay.pos, plan && plan.sound ? plan.sound : null);
    }

    function apply(snap, opts) {
      opts = opts || {};
      var changed = false;
      bays.forEach(function (bay) {
        var plan = snap && snap.bays ? planBay(snap.bays[bay.i], snap.looks) : null, key = planKey(plan);
        if (key === bay.key) return;
        bay.key = key; changed = true;
        setPlan(bay, plan, !!opts.instant || !firstApplied);
      });
      firstApplied = true;
      return changed;
    }

    /* ---- per frame ---- */
    function update(dt, time) {
      for (var b = 0; b < bays.length; b++) {
        var bay = bays[b], c = bay.curtain;
        if (bay.def.parent && bay.group.visible) refreshPos(bay);
        if (c && c.sim.update(dt)) { c.r.draw(); c.tex.needsUpdate = true; }
        var dm = bay.door && bay.door.model;
        if (bay.portal && dm && bay.door.mesh.portal) { var po = dm.angle > 6; if (po !== !!bay.portalOn) { bay.portalOn = po; bay.door.mesh.portal(po, env.wallT); } }   // a door onto a real room: the doorway is open while the door is
        if (dm && dm.awake) { dm.update(dt); bay.door.mesh.sync(); if (dm.settled()) { dm.awake = false; bay.door.mesh.sync(); } }
        var ls = bay.lightSpec;
        if (ls) {
          var k = ls.p.intensity * 1.6, m = ls.key;
          if (m === 'light-pulse') k *= 0.55 + 0.45 * Math.sin(time * ls.p.rate * 2 * Math.PI);
          else if (m === 'light-flicker') k *= (Math.sin(time * 31 * ls.p.rate) + Math.sin(time * 47.3 * ls.p.rate + 1.7) > 0.8 ? 0.15 : 1) * (0.85 + 0.15 * Math.sin(time * 5.1));
          bay.light.intensity = k;
          var br = Math.max(0, Math.min(1.2, k / (ls.p.intensity * 1.6 || 1)));    // 0..1: how bright the bulb is right now, so it flickers with the light it gives
          bay.bulbMat.color.set(TONES[ls.p.tone]).lerp(WHITE, 0.55).multiplyScalar(0.2 + 0.8 * br); bay.glowMat.color.set(TONES[ls.p.tone]); bay.glowMat.opacity = 0.85 * br;
        }
      }
    }

    /* ---- the curtain as something to touch ---- */
    function curtainHit(ndc, maxDist) {
      rayc.far = maxDist || 3.6; rayc.setFromCamera(ndc, env.camera);
      var best = null;
      bays.forEach(function (bay) {
        if (!bay.curtain || !bay.group.visible || (scope && !scope(bay.i))) return;
        bay.curtain.mesh.updateMatrixWorld(true);
        var h = rayc.intersectObject(bay.curtain.mesh, false)[0];
        if (h && (!best || h.distance < best.h.distance)) best = { bay: bay, h: h };
      });
      return best;
    }
    function uAlong(bay, ndc) {   // where the ray crosses the cloth's plane, as 0..1 across it (may be outside 0..1)
      rayc.setFromCamera(ndc, env.camera);
      var m = bay.curtain.mesh, n = new T.Vector3(0, 0, 1).transformDirection(m.matrixWorld), p0 = new T.Vector3().setFromMatrixPosition(m.matrixWorld);
      var pl = new T.Plane().setFromNormalAndCoplanarPoint(n, p0), pt = new T.Vector3();
      if (!rayc.ray.intersectPlane(pl, pt)) return null;
      m.worldToLocal(pt); return pt.x / bay.width + 0.5;
    }
    // depth of each piece in front of the wall, for the layering test: door slab, tape, curtain, sign
    function layersOf(b) {
      var o = { door: null, doorOrder: null, curtainOrder: b.curtain ? b.curtain.mesh.renderOrder : null, tape: null, curtain: b.curtain ? b.curtain.mesh.position.z : null, rail: b.curtain ? b.curtain.rail.position.z : null, sign: null };
      b.overlays.forEach(function (m) { if (m.userData.key === 'caution-tape') o.tape = m.position.z; else if (m.userData.key === 'sign-board') o.sign = m.position.z; });
      if (b.door && b.door.mesh) {
        b.group.updateMatrixWorld(true); b.door.mesh.group.updateMatrixWorld(true);
        var bb = new T.Box3().setFromObject(b.door.mesh.group), a = b.group.worldToLocal(bb.min.clone()), c = b.group.worldToLocal(bb.max.clone());
        var ro = 0; b.door.mesh.group.traverse(function (x) { if (x.renderOrder > ro) ro = x.renderOrder; }); o.doorOrder = ro;
        o.door = Math.max(a.z, c.z);                                  // the front of the closed door
      }
      return o;
    }
    /* ---- doors as something to touch ---- */
    function doorUsable(bay) {
      var p = bay.plan, d = bay.door; if (!p || p.base !== 'door' || !d || !d.model || !bay.group.visible || p.interaction === 0) return false;
      return !bay.curtain || bay.curtain.sim.getOpenAmount() >= 0.6;      // a closed curtain hides the door
    }
    function doorHit(ndc, maxDist) {
      rayc.far = maxDist || 3.6; rayc.setFromCamera(ndc, env.camera);
      var best = null;
      bays.forEach(function (bay) {
        if (!doorUsable(bay) || (scope && !scope(bay.i))) return;
        bay.door.mesh.group.updateMatrixWorld(true);
        var h = rayc.intersectObjects(bay.door.mesh.pick, false)[0], kind = 'leaf';
        if (!h && bay.door.model.angle > 50) { h = rayc.intersectObject(bay.door.mesh.way, false)[0]; kind = 'doorway'; }   // looking through the open door
        if (h && (!best || h.distance < best.h.distance)) best = { bay: bay, h: h, kind: kind };
      });
      return best;
    }
    function doorHint(bay, kind) {
      var p = bay.plan, m = bay.door.model;
      if (p.interaction === 1) return 'KNOCK ON THE DOOR';
      return m.isOpen() ? 'CLOSE THE DOOR' : 'OPEN THE DOOR';
    }
    // What is the player looking at? Returns { bay, hint, kind } or null. Used for the HUD line.
    function focus(ndc) {
      var c0 = ndc || new T.Vector2(0, 0), out = null, dist = Infinity;
      var hit = curtainHit(c0, 3.2);
      if (hit && curtainGrabbable(hit.bay.plan)) { dist = hit.h.distance; out = { bay: hit.bay.i, hint: hit.bay.curtain.sim.getOpenAmount() > 0.5 ? 'CLOSE THE CURTAIN' : 'PULL THE CURTAIN', kind: 'curtain', hold: true }; }
      var dh = doorHit(c0, 3.2);
      if (dh && dh.kind !== 'doorway' && dh.h.distance < dist) out = { bay: dh.bay.i, hint: doorHint(dh.bay, dh.kind), kind: 'door' };   // (looking through an open doorway is not an action: you walk through it)
      return out;
    }
    function grabStart(ndc) {
      if (grab) return false;
      var ch = curtainHit(ndc, 3.6), dh = doorHit(ndc, 3.6);
      if (dh && dh.kind !== 'doorway' && (!ch || dh.h.distance < ch.h.distance)) {       // a door: the click is the whole action
        var bay = dh.bay, m = bay.door.model;
        if (bay.plan.interaction === 1) m.open(); else m.toggle();
        return true;
      }
      var hit = ch;
      if (!hit || !curtainGrabbable(hit.bay.plan)) return false;
      var uv = hit.h.uv; if (!uv) return false;
      var cu = hit.bay.curtain, us = (uv.x * cu.cwFull - cu.mg) / CW;           // the plane is wider than the cloth: back to the cloth's own 0..1
      if (!cu.sim.grabUV(us, 1 - uv.y)) return false;
      grab = { bay: hit.bay, ndc: ndc.clone() };
      audio.oneShot('swish', hit.bay.pos, env.listener(), 0.35, 8);
      return true;
    }
    function grabMove(dx, dy) {   // dx, dy in NDC units
      if (!grab) return;
      grab.ndc.x = clamp(grab.ndc.x + dx, -1.5, 1.5); grab.ndc.y = clamp(grab.ndc.y + dy, -1.5, 1.5);
      var u = uAlong(grab.bay, grab.ndc);
      if (u !== null) { var mf = CURTAIN_MARGIN_M / grab.bay.width, lim = Math.max(0.5 * mf, mf - 0.1);   // the cloth hangs up to about 0.09 of its width past the hand
        grab.bay.curtain.sim.moveGrabUV(clamp(u, -lim, 1 + lim)); }   // so the hand cannot take the cloth off the picture
    }
    function grabEnd() { if (!grab) return; grab.bay.curtain.sim.release(); grab = null; }
    function toggleFocused() {   // E on what you are looking at
      var f = focus(); if (!f) return false;
      var bay = bays[f.bay];
      if (f.kind === 'door') {
        if (bay.plan.interaction === 1) bay.door.model.knock(); else bay.door.model.toggle();
        return true;
      }
      var c = bay.curtain, now = c.sim.getOpenAmount() > 0.5;
      c.target = now ? 0 : 1; c.sim.setOpenAmount(c.target, true, bay.plan.cover.p.speed);
      audio.oneShot('swish', bay.pos, env.listener(), 0.8, 9);
      return true;
    }

    return {
      apply: apply, update: update, focus: focus, grabStart: grabStart, grabMove: grabMove, grabEnd: grabEnd, toggleFocused: toggleFocused,
      isGrabbing: function () { return !!grab; },
      setScope: function (fn) { scope = typeof fn === 'function' ? fn : null; },
      // A bay whose door opens onto a room built behind the wall: while the door is open its doorway is see-through (the hall owns the room).
      setPortal: function (i, on) { var b = bays[i]; if (!b) return; b.portal = !!on; if (!on && b.portalOn) { b.portalOn = false; if (b.door && b.door.mesh.portal) b.door.mesh.portal(false); } },
      portalOpen: function (i) { var b = bays[i]; return !!(b && b.portalOn); },
      // Where a point of the world is, in the frame of bay i's door (x along the wall, z out from it into the room), when the door is open enough to
      // walk through; null otherwise. The hall uses it to let you simply walk into an open doorway. link: where that door leads.
      doorwayAt: function (i, x, z) {
        var b = bays[i], m = b && b.door && b.door.model; if (!b || !m || !doorUsable(b) || !(m.angle > 50)) return null;
        var v = new T.Vector3(x, 0, z); b.group.updateWorldMatrix(true, false); b.group.worldToLocal(v);
        return { x: v.x, z: v.z, half: b.door.mesh && b.door.mesh.size ? b.door.mesh.size.w / 2 : 0.5, link: b.plan.link, interaction: b.plan.interaction };
      },
      posOf: function (i) { var b = bays[i]; return b ? { x: b.pos.x, z: b.pos.z } : null; },
      doorHalfWidth: function (i) { var b = bays[i]; return b && b.door && b.door.mesh && b.door.mesh.size ? b.door.mesh.size.w / 2 : 0.5; },
      doorOpen: function (i) { var b = bays[i], m = b && b.door && b.door.model; if (m && !m.isOpen()) m.open(); },
      _curtain: function (i) { var c = bays[i] && bays[i].curtain; return c ? { sim: c.sim, mg: c.mg, w: bays[i].width } : null; },   // tests only
      _handle: function (i) { var d = bays[i] && bays[i].door; return d && d.mesh && d.mesh.handle ? d.mesh.handle() : null; },   // tests only
      _model: function (i) { var d = bays[i] && bays[i].door; return d && d.model ? d.model : null; },   // tests only
      showPosters: function (i) { var p = bays[i] && bays[i].plan; return !p || p.base === 'posters'; },
      audio: audio,
      // state for tests and the preview
      debug: function () {
        return bays.map(function (b) {
          return { plan: b.plan, visible: b.group.visible, pos: b.pos, overlays: b.overlays.length, layers: layersOf(b), door: !!b.door, portal: !!b.portalOn, doorSkin: b.door ? (b.door.skin || '') : null, latch: b.door && b.door.mesh && b.door.mesh.latch ? b.door.mesh.latch() : null, doorSound: b.door && b.door.model ? b.door.model.cfg.sound : null, doorState: b.door && b.door.model ? b.door.model.state() : null,
            curtain: b.curtain ? { margin: b.curtain.mg, planeW: b.curtain.mesh.geometry.parameters.width, bottom: b.curtain.railY - b.curtain.h, openness: b.curtain.sim.getOpenAmount(), asleep: b.curtain.sim.isAsleep(), animating: b.curtain.sim.isAnimating(), target: b.curtain.target } : null,
            light: b.lightSpec ? { key: b.lightSpec.key, intensity: b.light.intensity, fixture: b.fixture.visible } : null };
        });
      }
    };
  }

  var API = { DOOR_STYLES: DOOR_STYLES, planBay: planBay, planKey: planKey, curtainGrabbable: curtainGrabbable, BUILTIN: BUILTIN, TONES: TONES, create: create, createAudio: createAudio, _num: num };
  root.XABays = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
