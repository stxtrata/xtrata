<script>/* arcade-replay.js */
/*
 * Xtrata Arcade — replays (leaf module)
 *
 * Every ranked run is a pure function of (pilot wallet, nonce, per-step input). The room records the
 * input the game actually saw, packs it into a compact replay, and the leaderboard contract stores it
 * beside the score. Anyone can re-run the replay through the same inscribed game and check that it
 * reaches the same score.
 *
 * Replay bytes (little endian). The wallet hash sits at a fixed offset because the contract checks it.
 *    0-2  "XAR"      3  format (bit 7 set = body is not compressed)
 *    4-23 pilot hash160        24 pilot address version
 *    25   flags: bit0 time mode, bit1 completed (finish() was called)
 *    26-27 engine version      28-31 nonce (the run seed is derived from wallet + nonce + game)
 *    32-35 steps (updates)     36-39 score (time runs: centiseconds)
 *    40   game index           41 variant index (0 = base)     42-43 reserved
 *  then deflate-raw of the event stream:
 *    varint(step delta) · flags · fields
 *    flags: 1 held  2 hit  4 pointer  8 pointer-button changed  16 button is down  32 pointer moved  64 swipes
 */
(function (root) {
  'use strict';
  var XA = root.XA, S = root.XAScores;
  if (!XA || !S) throw new Error('arcade-kit and score-client must load before arcade-replay');
  var U = XA.util, C = S._codec;

  var ENGINE = 1, FORMAT = 1, HEADER = 44;
  var MAX_BYTES = 60000;                 // the contract allows 65,536; keep headroom
  var MAX_STEPS = 60 * 60 * 30;          // 30 minutes
  var STEP = 1 / 60, QN = 4;             // pointer positions are kept to a quarter of a playfield unit

  // Fixed order: an index in the header names the game. Never reorder; only append.
  var GAME_IDS = ['xa_block_defence', 'xa_block_drop', 'xa_block_runner', 'xa_brick_breaker', 'xa_bubble_pop', 'xa_cave_diver',
    'xa_helix_drop', 'xa_invader_wave', 'xa_lunar_lander', 'xa_maze_muncher', 'xa_merge_2048', 'xa_mine_sprint', 'xa_neon_snake',
    'xa_orbit_merge', 'xa_pong_streak', 'xa_reflex_tap', 'xa_road_hopper', 'xa_rock_drift', 'xa_stack_tower', 'xa_swerve', 'xa_tile_tap'];
  var BUTTONS = ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'd', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'f', 'start', 'hold', 'release'];
  var SWIPES = ['left', 'right', 'up', 'down', 'tap'];

  function q(v) { v = Math.round(v * QN); return v > 32000 ? 32000 : v < -32000 ? -32000 : v; }
  function qpt(v) { return q(v) / QN; }

  /* ------------------------------------------------- boards & pilots */
  function gameIndex(game) { return GAME_IDS.indexOf(game.id); }
  function variantForMode(game, mode) {
    return (game.variants || []).filter(function (v) { return v.mode === mode; })[0] || null;
  }
  // The contract board for a game in a mode: the base board is the game id; a timed variant adds its key.
  function boardFor(game, mode) {
    mode = mode || game.mode;
    if (mode === game.mode) return game.id;
    var v = variantForMode(game, mode);
    return v ? game.id + '_' + v.key : game.id;
  }
  function pilotFor(address) {
    if (!address) return null;
    try {
      var d = C.c32decodeAddress(address);
      if (!/^S[PM]/.test(String(address).toUpperCase())) return null;
      return { address: address, version: d.version, hash160: d.hash160 };
    } catch (e) { return null; }
  }
  // The run seed is bound to the wallet: rewriting the wallet bytes of someone else's replay changes the seed.
  function seedFor(hash160, nonce, gameIdx) {
    var h = 0x811c9dc5;
    function mix(b) { h ^= b & 255; h = Math.imul(h, 16777619) >>> 0; }
    for (var i = 0; i < 20; i++) mix(hash160[i]);
    for (var j = 0; j < 4; j++) mix(nonce >>> (j * 8));
    mix(gameIdx);
    return (h >>> 0) || 0x9e3779b9;
  }

  /* --------------------------------------------------------- bytes */
  function putVar(out, v) { while (v >= 128) { out.push((v % 128) | 128); v = Math.floor(v / 128); } out.push(v); }
  function zz(n) { return n < 0 ? -2 * n - 1 : 2 * n; }
  function unzz(u) { return u % 2 ? -(u + 1) / 2 : u / 2; }
  function Reader(b) { this.b = b; this.i = 0; }
  Reader.prototype.varint = function () {
    var v = 0, mul = 1, byte;
    do {
      if (this.i >= this.b.length) throw new Error('Replay ends early');
      byte = this.b[this.i++]; v += (byte & 127) * mul; mul *= 128;
    } while (byte & 128);
    return v;
  };
  Reader.prototype.byte = function () {
    if (this.i >= this.b.length) throw new Error('Replay ends early');
    return this.b[this.i++];
  };

  async function pipe(bytes, stream) {
    var res = new Response(new Blob([bytes]).stream().pipeThrough(stream));
    return new Uint8Array(await res.arrayBuffer());
  }
  async function pack(body) {
    if (typeof CompressionStream === 'function') {
      try { return { data: await pipe(body, new CompressionStream('deflate-raw')), raw: false }; } catch (e) { /* store raw */ }
    }
    return { data: body, raw: true };
  }
  async function unpack(body, raw) {
    if (raw) return body;
    if (typeof DecompressionStream !== 'function') throw new Error('This browser cannot unpack replays');
    return pipe(body, new DecompressionStream('deflate-raw'));
  }

  /* ------------------------------------------------------ recorder */
  function Recorder(meta, input, pointer) {
    this.meta = meta; this.input = input; this.pointer = pointer;
    this.body = []; this.step = 0; this.lastAt = 0;
    this.cur = { held: 0, px: 0, py: 0, down: 0 };
    this.prevMoved = 0; this.snap = null; this.sw = [];
    var self = this, take = input.takeSwipes;
    input.takeSwipes = function () {
      var r = take.call(input);
      for (var i = 0; i < r.length; i++) { var k = SWIPES.indexOf(r[i]); if (k >= 0) self.sw.push(k); }
      return r;
    };
  }
  Recorder.prototype.before = function () {
    var inp = this.input, hm = 0, ht = 0;
    for (var i = 0; i < BUTTONS.length; i++) {
      if (inp.held(BUTTONS[i])) hm |= 1 << i;
      if (inp.hit(BUTTONS[i])) ht |= 1 << i;
    }
    var p = this.pointer();
    var moved = p.moved !== this.prevMoved; this.prevMoved = p.moved;
    this.snap = { hm: hm, ht: ht, px: q(p.x), py: q(p.y), down: p.down ? 1 : 0, moved: moved };
    this.sw = [];
  };
  Recorder.prototype.after = function () {
    var s = this.snap, c = this.cur, sw = this.sw, f = 0;
    if (s.hm !== c.held) f |= 1;
    if (s.ht) f |= 2;
    if (s.px !== c.px || s.py !== c.py) f |= 4;
    if (s.down !== c.down) f |= 8 | (s.down ? 16 : 0);
    if (s.moved) f |= 32;
    if (sw.length) f |= 64;
    if (f) {
      var b = this.body;
      putVar(b, this.step - this.lastAt); b.push(f);
      if (f & 1) putVar(b, s.hm);
      if (f & 2) putVar(b, s.ht);
      if (f & 4) { putVar(b, zz(s.px - c.px)); putVar(b, zz(s.py - c.py)); }
      if (f & 64) { b.push(Math.min(sw.length, 255)); for (var i = 0; i < sw.length && i < 255; i++) b.push(sw[i]); }
      c.held = s.hm; c.px = s.px; c.py = s.py; c.down = s.down;
      this.lastAt = this.step;
    }
    this.step++;
  };
  // → Uint8Array, or null when the run is too long to store on-chain.
  Recorder.prototype.finish = async function (score, completed) {
    var m = this.meta;
    if (this.step < 1 || this.step > MAX_STEPS) return null;
    var packed = await pack(new Uint8Array(this.body));
    var out = new Uint8Array(HEADER + packed.data.length), dv = new DataView(out.buffer);
    out[0] = 88; out[1] = 65; out[2] = 82;                       // "XAR"
    out[3] = FORMAT | (packed.raw ? 128 : 0);
    out.set(m.hash160, 4); out[24] = m.version;
    out[25] = (m.time ? 1 : 0) | (completed ? 2 : 0);
    dv.setUint16(26, ENGINE, true); dv.setUint32(28, m.nonce >>> 0, true);
    dv.setUint32(32, this.step, true); dv.setUint32(36, Math.max(0, Math.floor(score)) >>> 0, true);
    out[40] = m.gameIdx; out[41] = m.variantIdx;
    out.set(packed.data, HEADER);
    return out.length <= MAX_BYTES ? out : null;
  };
  function record(game, variant, pilot, nonce, input, pointer) {
    var mode = variant ? variant.mode : game.mode;
    return new Recorder({ hash160: pilot.hash160, version: pilot.version, nonce: nonce, gameIdx: gameIndex(game),
      variantIdx: variant ? game.variants.indexOf(variant) + 1 : 0, time: mode === 'time' }, input, pointer);
  }

  /* ------------------------------------------------------ decoding */
  async function decode(bytes) {
    if (!(bytes instanceof Uint8Array)) bytes = new Uint8Array(bytes);
    if (bytes.length < HEADER) throw new Error('Replay too short');
    if (bytes[0] !== 88 || bytes[1] !== 65 || bytes[2] !== 82) throw new Error('Not an Xtrata Arcade replay');
    if ((bytes[3] & 127) !== FORMAT) throw new Error('Unsupported replay format ' + (bytes[3] & 127));
    var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    var h = { hash160: bytes.slice(4, 24), version: bytes[24], time: !!(bytes[25] & 1), completed: !!(bytes[25] & 2),
      engine: dv.getUint16(26, true), nonce: dv.getUint32(28, true), steps: dv.getUint32(32, true), score: dv.getUint32(36, true),
      gameIdx: bytes[40], variantIdx: bytes[41], events: [] };
    if (h.steps < 1 || h.steps > MAX_STEPS) throw new Error('Run length out of range');
    var body = await unpack(bytes.subarray(HEADER), !!(bytes[3] & 128));
    var r = new Reader(body), at = 0;
    while (r.i < body.length) {
      at += r.varint();
      var f = r.byte(), e = { at: at, f: f };
      if (f & 1) e.held = r.varint();
      if (f & 2) e.hit = r.varint();
      if (f & 4) { e.dx = unzz(r.varint()); e.dy = unzz(r.varint()); }
      if (f & 64) { var n = r.byte(); e.sw = []; for (var i = 0; i < n; i++) e.sw.push(SWIPES[r.byte()] || 'tap'); }
      h.events.push(e);
    }
    return h;
  }

  /* ------------------------------------------------------ playback */
  function playback(events) {
    var i = 0, held = 0, hit = 0, sw = [], down = 0, qx = 0, qy = 0;
    var P = { x: 0, y: 0, down: false, moved: 0 };
    var input = {
      held: function (n) { var k = BUTTONS.indexOf(n); return k >= 0 && !!((held >>> k) & 1); },
      hit: function (n) { var k = BUTTONS.indexOf(n); return k >= 0 && !!((hit >>> k) & 1); },
      takeSwipes: function () { var s = sw; sw = []; return s; },
      pointer: P, press: function () {}, release: function () {}, endFrame: function () {}, reset: function () {}, destroy: function () {}
    };
    return {
      input: input,
      pointer: function () { return { x: qx / QN, y: qy / QN, down: !!down, moved: P.moved }; },
      load: function (step) {
        hit = 0; sw = [];
        while (i < events.length && events[i].at === step) {
          var e = events[i++], f = e.f;
          if (f & 1) held = e.held;
          if (f & 2) hit = e.hit;
          if (f & 4) { qx += e.dx; qy += e.dy; }
          if (f & 8) down = (f & 16) ? 1 : 0;
          if (f & 32) P.moved++;
          if (f & 64) sw = e.sw.slice();
        }
      }
    };
  }
  var silentAudio = typeof Proxy === 'function'
    ? new Proxy({}, { get: function (t, k) { return k === 'isMuted' ? function () { return true; } : function () {}; } })
    : { tone: function () {}, arp: function () {}, noise: function () {}, isMuted: function () { return true; } };

  var nextTick = function () { return new Promise(function (res) { setTimeout(res, 0); }); };

  // Re-run a decoded replay through the game. Nothing is drawn, nothing is heard, nothing is saved.
  async function simulate(dec) {
    var game = XA.games.filter(function (g) { return g.id === GAME_IDS[dec.gameIdx]; })[0];
    if (!game) throw new Error('This replay is for a game that is not in this arcade');
    var variant = dec.variantIdx ? (game.variants || [])[dec.variantIdx - 1] : null;
    if (dec.variantIdx && !variant) throw new Error('Unknown game variant');
    var mode = variant ? variant.mode : game.mode;
    if ((mode === 'time') !== dec.time) throw new Error('Replay mode does not match the game');
    var pb = playback(dec.events), st = { score: 0, over: false, completed: false };
    var seed = seedFor(dec.hash160, dec.nonce, dec.gameIdx);
    var api = {
      W: game.size.w, H: game.size.h, input: pb.input, audio: silentAudio, fx: XA.createFx(),
      rng: U.rng(seed), seed: seed, ranked: true,
      shake: function () {}, setStatus: function () {},
      addScore: function (n) { if (!st.over) st.score += Math.max(0, Math.floor(n)); },
      setScore: function (n) { if (!st.over) st.score = Math.max(0, Math.floor(n)); },
      getScore: function () { return st.score; },
      gameOver: function () { st.over = true; },
      finish: function () { if (!st.over) { st.completed = true; st.over = true; } },
      mode: mode, variant: variant ? variant.key : null, pointer: pb.pointer
    };
    // Games remember bests in local storage for display only. Give the replay a blank one so it never leans on yours.
    var realStore = U.store, mem = {};
    var blank = function (k, v) { if (v === undefined) return k in mem ? mem[k] : null; mem[k] = v; return null; };
    var steps = 0;
    try {
      U.store = blank;
      var inst = game.create(api);
      while (steps < dec.steps && !st.over) {
        pb.load(steps);
        inst.update(STEP);
        steps++;
        if (steps % 4000 === 0) { U.store = realStore; await nextTick(); U.store = blank; }
      }
    } finally { U.store = realStore; }
    return { score: st.score, steps: steps, over: st.over, completed: st.completed };
  }

  // expect: { address, score, board } – whatever the leaderboard entry claims.
  async function verify(bytes, expect) {
    expect = expect || {};
    try {
      var dec = await decode(bytes);
      if (expect.address) {
        var p = pilotFor(expect.address);
        if (!p || C.bytesToHex(p.hash160) !== C.bytesToHex(dec.hash160)) return { ok: false, reason: 'Flown by a different wallet' };
      }
      if (expect.score != null && Number(expect.score) !== dec.score) return { ok: false, reason: 'Replay score differs from the board' };
      var game = XA.games.filter(function (g) { return g.id === GAME_IDS[dec.gameIdx]; })[0];
      if (!game) return { ok: false, reason: 'Unknown game' };
      var variant = dec.variantIdx ? (game.variants || [])[dec.variantIdx - 1] : null;
      if (expect.board && expect.board !== boardFor(game, variant ? variant.mode : game.mode)) return { ok: false, reason: 'Replay is for a different board' };
      var r = await simulate(dec);
      if (!r.over || r.steps !== dec.steps) return { ok: false, reason: 'Replay does not reach the end of the run' };
      if (r.score !== dec.score) return { ok: false, reason: 'Replay reaches ' + r.score + ', not ' + dec.score };
      if (r.completed !== dec.completed) return { ok: false, reason: 'Replay finishes differently' };
      return { ok: true, score: r.score, steps: r.steps, game: game.id };
    } catch (e) {
      return { ok: false, reason: (e && e.message) || String(e) };
    }
  }

  XA.replay = {
    ENGINE: ENGINE, HEADER: HEADER, MAX_BYTES: MAX_BYTES, GAME_IDS: GAME_IDS, BUTTONS: BUTTONS,
    boardFor: boardFor, pilotFor: pilotFor, seedFor: seedFor, gameIndex: gameIndex, qpt: qpt,
    record: record, decode: decode, simulate: simulate, verify: verify, playback: playback
  };
})(typeof window !== 'undefined' ? window : globalThis);
</script>
