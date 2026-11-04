/* ParallaX Casino · Chess at the lounge tables, powered by XChess.
 *
 * The rules and the ten house players are XChess's own house engine, inscription #3049 on Xtrata (XChessHouseEngine,
 * xchess-house-engine-1.1.0). It is loaded from the chain at /i/3049 and checked against its SHA-256 before it is used; the
 * byte-identical copy beside this file (xchess-engine-3049.js) is the fallback. Nothing here re-implements chess.
 *
 *  - House games: you against one of XChess's ten house players (Gambit, Ledger, Mason, ...). Their moves come from
 *    XChessHouseEngine.choose() with a seed fixed at the start of the game, in a Web Worker so the room never stutters. At the end
 *    the game is written as an XChess house archive and replayed with XChessHouseEngine.verifyArchive(): the panel says whether every
 *    house move was the engine's own. House games are free (no LAYR at stake): the house players are deterministic and beatable.
 *  - Player against player: the Salon lobby ("Find a player", the room's waiting list) and its relay chain. The player who waited
 *    hosts the blocks; every move is an `act` call both browsers apply to their own copy of the game, so the two stay identical.
 *    Ten minutes each plus three seconds a move, read from the host's block times. Friendly, or a LAYR stake (winner takes both).
 *
 * The page builds the two stations with PXChess.makeStations(ctx) and adds a few hooks (see docs/plans/CASINO-CHESS-PLAN.md).
 * Play money throughout, as at every other table.
 */
(function (root) {
  'use strict';
  const ENGINE_ID = 3049;
  const ENGINE_SHA256 = '10622134e974b4c3505d2ed935d009647fba0d7c14a72acae6d913036af814ec';
  const HERE = (() => { try { return new URL('.', document.currentScript && document.currentScript.src || location.href).href; } catch (_) { return ''; } })();
  const ENGINE_URLS = ['/i/' + ENGINE_ID, HERE + 'xchess-engine-3049.js'];
  const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const PROTOCOL = 'replay-v3';                 // XChess replay-v3: engine 1.1.0, legal en passant in the repetition key
  const SOFA_BACK = 0.15;                      // the sofas stand 15 cm further back than the room first had them: room for the player on the sofa
  const TABLE_Z = 1.25 + SOFA_BACK, TABLE_R = 0.5;   // the coffee table, in front of each sofa (sofa-local z), and its radius
  // table-local; h: the seat's height (cushion top). The sofa seat is near the cushion's front edge: the room's seated figures are
  // posed for a bar stool, legs straight down from the knee, so sitting deeper would put their shins inside the sofa's front.
  const SOFA_SEAT = { z: TABLE_Z - 0.25, h: 0.7 }, CHAIR_SEAT = { z: -0.97, h: 0.5 };
  const SOFAS = [{ id: 'chess1', name: 'Chess · west lounge', x: -8.1, z: 8.1, ry: 0.25, side: -1, person: 'f2' },
                 { id: 'chess2', name: 'Chess · east lounge', x: 8.1, z: 8.1, ry: -0.25, side: 1, person: 'm2' }]
    .map((d) => Object.assign(d, { x: d.x - Math.sin(d.ry) * SOFA_BACK, z: d.z - Math.cos(d.ry) * SOFA_BACK }));
  const PVP_BASE = 600, PVP_INC = 3;            // seconds
  const PVP_STAKES = [0, 1000, 10000];          // 0 is a friendly
  const STORE_KEY = 'parallax.chess.v1';
  const PIECE = ['', 'p', 'n', 'b', 'r', 'q', 'k'];
  const NAMES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

  // ======================================================================= the engine (XChess #3049)
  const engine = { api: null, src: null, from: null, verified: false, error: null, worker: null, jobs: new Map(), seq: 0, ready: null };
  async function sha256Hex(text) {
    if (!(root.crypto && crypto.subtle)) return null;
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('');
  }
  function loadEngine() {
    if (engine.ready) return engine.ready;
    engine.ready = (async () => {
      for (const url of ENGINE_URLS) {
        try {
          const r = await fetch(url, { cache: 'force-cache' }); if (!r.ok) continue;
          const text = await r.text(), h = await sha256Hex(text);
          if (h !== null && h !== ENGINE_SHA256) { console.warn('[chess] engine at ' + url + ' does not match inscription #3049; skipped'); continue; }
          const api = (new Function(text + '\n;return XChessHouseEngine;'))();
          if (!api || typeof api.choose !== 'function' || typeof api.Position !== 'function') continue;
          Object.assign(engine, { api, src: text, from: url, verified: h === ENGINE_SHA256 });
          startWorker(); return api;
        } catch (e) { console.warn('[chess] engine load failed from ' + url, e); }
      }
      engine.error = 'The XChess engine could not be loaded.'; engine.ready = null;
      throw new Error(engine.error);
    })();
    return engine.ready;
  }
  // The worker is the engine's own source plus this function: it answers choose() and verifyArchive() off the main thread.
  function workerMain(E) {
    const sum = (v) => ({ engineCompliant: v.engineCompliant, deviations: v.deviations, accepted: v.accepted.length, historyHash: v.historyHash, rulesHash: v.rulesHash, result: v.state.result, termination: v.state.termination });
    self.onmessage = (e) => {
      const { id, fn, args } = e.data || {};
      try { const out = fn === 'choose' ? E.choose.apply(null, args) : fn === 'verify' ? sum(E.verifyArchive(args[0])) : null; self.postMessage({ id, out }); }
      catch (err) { self.postMessage({ id, err: String(err && err.message || err) }); }
    };
  }
  function summarize(v) { return { engineCompliant: v.engineCompliant, deviations: v.deviations, accepted: v.accepted.length, historyHash: v.historyHash, rulesHash: v.rulesHash, result: v.state.result, termination: v.state.termination }; }
  function inline(fn, args) { return fn === 'choose' ? engine.api.choose.apply(null, args) : summarize(engine.api.verifyArchive(args[0])); }
  function startWorker() {
    if (/[?&]chessworker=0/.test(location.search) || typeof Worker !== 'function') return;
    try {
      const url = URL.createObjectURL(new Blob([engine.src + '\n;(' + workerMain.toString() + ')(XChessHouseEngine);'], { type: 'text/javascript' }));
      const w = new Worker(url);
      w.onmessage = (e) => { const j = engine.jobs.get(e.data.id); if (!j) return; engine.jobs.delete(e.data.id); if (e.data.err) j.rej(new Error(e.data.err)); else j.res(e.data.out); };
      w.onerror = () => {                       // a worker that cannot run: answer everything on the page instead
        engine.worker = null; try { w.terminate(); } catch (_) { }
        for (const [id, j] of engine.jobs) { engine.jobs.delete(id); try { j.res(inline(j.fn, j.args)); } catch (e) { j.rej(e); } }
      };
      engine.worker = w;
    } catch (_) { engine.worker = null; }
  }
  function ask(fn, args) {
    return loadEngine().then(() => new Promise((res, rej) => {
      if (engine.worker) { const id = ++engine.seq; engine.jobs.set(id, { res, rej, fn, args }); engine.worker.postMessage({ id, fn, args }); return; }
      setTimeout(() => { try { res(inline(fn, args)); } catch (e) { rej(e); } }, 0);
    }));
  }

  // The house players, as XChess defines them (PROFILES). Strength is read from the profile: search depth, and how far from the best
  // score a player is willing to stray for its style (window).
  const HOUSE_FALLBACK = [['gambit', 'Gambit', 'Attacks and calculated sacrifices', 80, 2], ['ledger', 'Ledger', 'Material and favourable trades', 18, 2], ['mason', 'Mason', 'Pawn structure, outposts and open files', 30, 2], ['wager', 'Wager', 'Complications and bounded risk', 110, 2], ['plumb', 'Plumb', 'Prophylaxis and king safety', 22, 2], ['oblique', 'Oblique', 'Offbeat development and flank play', 65, 2], ['fathom', 'Fathom', 'Endgame planning and conversion', 16, 3], ['cadence', 'Cadence', 'Development, initiative and tempo', 40, 2], ['bulwark', 'Bulwark', 'Defensive resilience and shelter', 26, 2], ['canon', 'Canon', 'Classical development and balanced play', 12, 3]]
    .map(([id, name, description, window, depth]) => ({ id, name, description, window, depth }));
  const houseList = () => (engine.api ? engine.api.PROFILES : HOUSE_FALLBACK).map((p) => {
    const s = p.depth * 100 - p.window;
    return { id: p.id, name: p.name, description: p.description, stars: s >= 250 ? 5 : s >= 175 ? 4 : s >= 160 ? 3 : s >= 120 ? 2 : 1 };
  }).sort((a, b) => a.stars - b.stars || a.name.localeCompare(b.name));

  // ======================================================================= results, game ids, hashes (CASINO-CHESS-BETTING-PLAN)
  const HEX16 = /^[0-9a-f]{16}$/;
  // 16 hex characters from a string (two 32-bit mixes, cyrb-style): the room compares two pages' copies of a game by this hash of the
  // move list, without seeing the moves
  function hash16(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
  }
  const RESULT_RE = /^(1-0|0-1|1\/2-1\/2)$/;

  // ======================================================================= the relay table (player against player)
  // Run by both browsers on their own copy: the host applies calls in its blocks, the guest replays the same blocks. Every rule is
  // XChess's Position; this only adds seats, clocks (from block time, in seconds) and the XChess game events resgn, draw? and draw!.
  function makeRelayTable(E) {
    const T = { g: null, pos: null };
    const side = (who) => (!T.g ? null : who === T.g.white ? 'w' : who === T.g.black ? 'b' : null);
    const turn = () => (T.pos.turn === 0 ? 'w' : 'b');
    const end = (result, term) => { T.g.result = result; T.g.term = term; T.g.winner = result === '1-0' ? 'w' : result === '0-1' ? 'b' : null; };
    const flagFell = (ctx) => { const g = T.g, s = turn(); if (ctx.time - g.last <= g.clock[s]) return false; g.flagLeft = g.clock[s]; g.clock[s] = 0; end(s === 'w' ? '0-1' : '1-0', 'timeout'); return true; };
    const int = (v, lo, hi, d) => (Number.isSafeInteger(v) && v >= lo && v <= hi ? v : d);
    T.create = (ctx, who, o) => {
      if (T.g || !o || typeof o.white !== 'string' || typeof o.black !== 'string' || o.white === o.black || (who !== o.white && who !== o.black)) return { err: 1 };
      const base = int(o.base, 60, 3600, PVP_BASE), inc = int(o.inc, 0, 30, PVP_INC);
      T.pos = new E.Position(START, 'legal-en-passant');
      T.g = { gid: HEX16.test(o.gid) ? o.gid : null, flagLeft: null, white: o.white, black: o.black, stake: int(o.stake, 0, 1e9, 0), base, inc, clock: { w: base, b: base }, last: ctx.time, seenAt: Date.now(), uci: [], san: [], offer: null, result: null, term: null, winner: null, lastMove: null };
      return { ok: 1 };
    };
    T.act = (ctx, who, mv) => {
      const g = T.g; if (!g || g.result) return { err: 2 };
      const s = side(who); if (!s || typeof mv !== 'string' || mv.length > 5) return { err: 3 };
      if (mv === 'resgn') { end(s === 'w' ? '0-1' : '1-0', 'resignation'); return { ok: 1 }; }
      if (mv === 'draw?') { if (g.offer) return { err: 4 }; g.offer = s; return { ok: 1 }; }
      if (mv === 'draw!') { if (!g.offer || g.offer === s) return { err: 5 }; end('1/2-1/2', 'agreement'); return { ok: 1 }; }
      if (s !== turn()) return { err: 6 };
      if (flagFell(ctx)) return { ok: 1 };
      const r = T.pos.applyUci(mv); if (!r) return { err: 7 };
      g.clock[s] = Math.min(g.base * 2, g.clock[s] - (ctx.time - g.last) + g.inc); g.last = ctx.time; g.seenAt = Date.now();
      g.uci.push(r.uci); g.san.push(r.san); g.offer = null; g.lastMove = [r.uci.slice(0, 2), r.uci.slice(2, 4)];
      const o = T.pos.outcome(); if (o) end(o.result, o.termination);
      return { ok: 1 };
    };
    T.claimTimeout = (ctx) => { if (!T.g || T.g.result) return { err: 2 }; flagFell(ctx); return { ok: 1 }; };
    // the room's word (cend) ends a game this page's copy has not ended: a forfeit, or '*' for a game that is called off
    T.force = (result, term) => { if (!T.g || T.g.result) return false; end(result, term); return true; };
    return T;
  }
  // ---- the chess relay chain: the Salon's relay chain (PvpCore.makeRelayChain in the page) plus what a leaving rule needs.
  // The host makes a block every 1.5 s; the guest's calls go to the host and come back in a block; both browsers run the same calls with
  // the block's own time. Added here, for chess only (Hold'em and Liar's Dice keep the page's chain):
  //  - catch-up: a page that sees a gap, or has just reloaded, asks the other page for the blocks it is missing (d.k 'resend'); the
  //    answer ('blocks') carries only the calls, one short row each, in a few small pieces sent a little apart (the room allows 30 `pvp`
  //    messages per 10 s per sender and 1,500 bytes each); the receiver fills in the empty blocks itself;
  //  - the guest sends a call again until it sees it in a block, and the host drops a repeat by its id;
  //  - the calls so far are kept in this browser, so a reload carries on (the other page fills in what was missed).
  const CHAIN_METHODS = { create: 1, act: 1, claimTimeout: 1 };
  const LIVE_KEY = 'pxChessLive', LIVE_MAX_AGE = 25 * 60 * 1000;
  const okOp = (o) => o && typeof o.id === 'string' && o.id.length <= 80 && CHAIN_METHODS[o.m] === 1 && Array.isArray(o.args) && o.args.length >= 1 && o.args.length <= 3;
  // one call as a short row: [kind, value, who, seq]; who 0 is the writer of the rows, 1 the other player; the id is address:seq
  function encOp(op, self) {
    const k = op.id.lastIndexOf(':'), by = op.id.slice(0, k), seq = +op.id.slice(k + 1) || 0, who = by === self ? 0 : 1;
    return op.m === 'act' ? ['a', op.args[1], who, seq] : op.m === 'claimTimeout' ? ['c', 0, who, seq] : ['n', op.args[1], who, seq];
  }
  function decOp(r, A, B) {
    if (!Array.isArray(r) || r.length !== 6 || !Number.isSafeInteger(r[0]) || r[0] < 0 || !Number.isSafeInteger(r[1]) || !Number.isSafeInteger(r[5]) || (r[4] !== 0 && r[4] !== 1)) return null;
    const who = r[4] ? B : A, id = who + ':' + r[5];
    if (r[2] === 'a') return typeof r[3] === 'string' && r[3].length <= 5 ? { dh: r[0], dt: r[1], op: { id, m: 'act', args: [who, r[3]] } } : null;
    if (r[2] === 'c') return { dh: r[0], dt: r[1], op: { id, m: 'claimTimeout', args: [who] } };
    if (r[2] === 'n') return r[3] && typeof r[3] === 'object' && !Array.isArray(r[3]) ? { dh: r[0], dt: r[1], op: { id, m: 'create', args: [who, r[3]] } } : null;
    return null;
  }
  // blocks (height, time, calls) to rows with the heights and times as steps from the one before: [dh, dt, kind, value, who, seq]
  function encRows(blocks, h0, t0, self) {
    const rows = []; let h = h0, t = t0;
    for (const [bh, bt, ops] of blocks) { ops.forEach((op, i) => { const e = encOp(op, self); rows.push([i ? 0 : bh - h, i ? 0 : bt - t, e[0], e[1], e[2], e[3]]); }); h = bh; t = bt; }
    return rows;
  }
  function decRows(rows, h0, t0, A, B) {
    const groups = []; let h = h0, t = t0;
    for (const r of rows) {
      const x = decOp(r, A, B); if (!x) return null;
      h += x.dh; t += x.dt; let g = groups[groups.length - 1];
      if (!g || g.h !== h) { if (x.dh === 0 && g) return null; g = { h, t, ops: [] }; groups.push(g); }
      g.ops.push(x.op);
    }
    return groups;
  }
  function makeChain({ host, me, other, send, blockMs, resume }) {
    const now0 = Date.now();
    const c = { height: 1000, listeners: [], blockMs: blockMs || 1500, table: null, waiting: new Map(), pending: new Map(), seq: 0, lastBlockAt: now0, dead: false, relay: true, host, kind: 'chess',
      queue: [], ids: new Set(), log: [], syncing: false, askAt: 0, arrivedAt: now0, streakFrom: now0, catchingUp: false, sending: null, resumeFrom: resume || null, logDirty: false, onSave: null };
    c.ctx = () => ({ time: Math.floor(Date.now() / 1000), height: c.height, hashAt: () => null });
    const run = (op, ctx) => { const f = c.table && c.table[op.m]; if (typeof f !== 'function') return { err: -1 }; try { return f(ctx, ...op.args); } catch (e) { console.warn('[chess] a relayed call failed:', op.m, e); return { err: -2 }; } };
    const notify = () => c.listeners.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
    function applyBlock(h, t, ops) {
      c.height = h; const ctx = { time: t, height: h, hashAt: () => null };
      for (const op of ops) { c.ids.add(op.id); const r = run(op, ctx); c.pending.delete(op.id); const w = c.waiting.get(op.id); if (w) { c.waiting.delete(op.id); w(r); } }
      if (ops.length) { c.log.push([h, t, ops]); c.logDirty = true; }
    }
    c.submit = () => Promise.resolve({ err: -3 });
    c.call = (label, m, args) => new Promise((resolve) => {
      if (c.dead) { resolve({ err: -4 }); return; }
      const id = me + ':' + (++c.seq);
      c.waiting.set(id, resolve);
      if (host) { c.ids.add(id); c.queue.push({ id, m, args }); }
      else { c.pending.set(id, { m, args, at: Date.now(), tries: 1 }); send({ k: 'op', id, m, args }); }
      if (c.onSave) c.onSave();
    });
    // host: the other player's call, checked (nobody can play as someone else); a call it has already seen is dropped
    c.fromGuest = (d) => {
      if (!host || c.dead || typeof d.m !== 'string' || !Array.isArray(d.args) || typeof d.id !== 'string' || d.id.length > 80 || !d.id.startsWith(other + ':')) return;
      if (CHAIN_METHODS[d.m] !== 1 || d.m === 'create' || d.args.length > 3) return;
      if (d.m === 'act' && d.args[0] !== other) return;
      if (c.ids.has(d.id)) return;
      c.ids.add(d.id); c.queue.push({ id: d.id, m: d.m, args: d.args });
    };
    c.tick = () => {
      if (!host || c.dead || c.syncing) return;
      const t = Math.floor(Date.now() / 1000), q = c.queue; c.queue = [];
      applyBlock(c.height + 1, t, q);
      send({ k: 'block', h: c.height, hash: rand(32), t, ops: q.map((o) => ({ id: o.id, m: o.m, args: o.args })) });   // (hash: pages before c7 insist on one)
      c.lastBlockAt = Date.now();
      notify();
    };
    // guest: a block from the host, in order; a block from further on means one was missed, and the host is asked for the rest
    c.fromHost = (d) => {
      if (host || c.dead || !d || !Number.isSafeInteger(d.h) || !Number.isSafeInteger(d.t) || !Array.isArray(d.ops) || d.ops.length > 20 || !d.ops.every(okOp)) return;
      const now = Date.now();
      if (now - c.arrivedAt > 6000) c.streakFrom = now;       // this page was away or the host went quiet: its own count of a turn is not to be trusted
      c.arrivedAt = now; c.lastBlockAt = now;
      if (d.h <= c.height) return;
      if (d.h !== c.height + 1) { c.streakFrom = now; c.ask(); return; }
      applyBlock(d.h, d.t, d.ops.map((o) => ({ id: o.id, m: o.m, args: o.args })));
      notify();
    };
    c.ask = () => { const now = Date.now(); if (c.dead || now - c.askAt < 2500) return; c.askAt = now; send({ k: 'resend', from: c.height }); };
    // the other page's catch-up messages
    c.onPeer = (d) => {
      if (c.dead || !d) return;
      if (d.k === 'resend') {
        const from = d.from; if (!Number.isSafeInteger(from) || from < 1000) return;
        const now = Date.now(); if (c.sending && now < c.sending.end && from >= c.sending.from) return;     // that one is already on its way
        const items = c.log.filter((e) => e[0] > from), chunks = [];
        let a = from, h = from, t = 0, t0 = 0, rows = [], size = 0;
        for (const e of items) {
          const part = encRows([e], h, t, me), len = JSON.stringify(part).length;
          if (rows.length && size + len > 900) { chunks.push({ a, z: h, t0, b: rows }); a = h; t0 = t; rows = []; size = 0; }
          rows.push(...encRows([e], h, t, me)); size += len; h = e[0]; t = e[1];
        }
        chunks.push({ a, z: Math.max(c.height, from), t0, b: rows });
        c.sending = { from, end: now + 500 * chunks.length + 1500 };
        chunks.forEach((ch, i) => setTimeout(() => { if (!c.dead) send({ k: 'blocks', a: ch.a, z: ch.z, t0: ch.t0, b: ch.b }); }, i * 500));
        return;
      }
      if (d.k === 'blocks') {
        if (!Number.isSafeInteger(d.a) || !Number.isSafeInteger(d.z) || !Number.isSafeInteger(d.t0) || !Array.isArray(d.b) || d.b.length > 80) return;
        if (c.syncing) { c.syncing = false; clearTimeout(c.syncTimer); }
        if (d.a > c.height) return;                               // not the next piece: it will be asked for again
        const groups = decRows(d.b, d.a, d.t0, other, me); if (!groups) return;
        c.streakFrom = Date.now(); c.catchingUp = true;
        try { for (const g of groups) if (g.h > c.height) applyBlock(g.h, g.t, g.ops); if (d.z > c.height) c.height = d.z; c.lastBlockAt = c.arrivedAt = Date.now(); notify(); } finally { c.catchingUp = false; }
      }
    };
    // what this browser keeps so that a reload carries on
    c.exportLog = () => ({ rows: encRows(c.log, 1000, 0, me), height: c.height, seq: c.seq });
    c.start = () => {            // called once the table is attached: replay what was kept, then ask the other page what came after
      const r = c.resumeFrom; if (!r) return; c.resumeFrom = null;
      const groups = decRows(r.rows || [], 1000, 0, me, other);
      c.catchingUp = true;
      try { for (const g of groups || []) applyBlock(g.h, g.t, g.ops); if (Number.isSafeInteger(r.height) && r.height > c.height) c.height = r.height; c.seq = Math.max(c.seq, (+r.seq || 0) + 20); } finally { c.catchingUp = false; }
      c.syncing = true; c.syncTimer = setTimeout(() => { c.syncing = false; }, 5000);       // the other page may be gone: carry on without it
      c.streakFrom = Date.now(); c.askAt = 0; c.ask();
    };
    c.timer = host ? setInterval(c.tick, c.blockMs) : 0;
    c.rtimer = setInterval(() => {      // a call not yet seen in a block is sent again; a quiet host is asked
      if (c.dead) return; const now = Date.now();
      if (!host) {
        for (const [id, p] of c.pending) if (now - p.at > 3000 && p.tries < 10) { p.at = now; p.tries++; send({ k: 'op', id, m: p.m, args: p.args }); }
        if (now - c.lastBlockAt > 5000) c.ask();
      } else if (c.syncing) c.ask();
    }, 1000);
    c.stop = (why) => { c.dead = why || 'stopped'; clearInterval(c.timer); clearInterval(c.rtimer); clearTimeout(c.syncTimer); for (const w of c.waiting.values()) w({ err: -4 }); c.waiting.clear(); c.pending.clear(); };
    return c;
  }
  // The saved game of this browser (only a game the room holds the stakes for): where to carry on after a reload
  const live = {
    get() { try { const r = JSON.parse(localStorage.getItem(LIVE_KEY)); return r && r.v === 1 && Date.now() - r.at < LIVE_MAX_AGE && HEX16.test(r.gid) ? r : null; } catch (_) { return null; } },
    set(r) { try { localStorage.setItem(LIVE_KEY, JSON.stringify(r)); } catch (_) { } },
    clear(gid) { try { const r = JSON.parse(localStorage.getItem(LIVE_KEY)); if (!gid || !r || r.gid === gid) localStorage.removeItem(LIVE_KEY); } catch (_) { try { localStorage.removeItem(LIVE_KEY); } catch (__) { } } }
  };

  // A player-against-player game on a relay chain, shaped like the Salon's sessions for the lobby.
  // opts: me, opp, oppName, buyin, tb (the table), host, roomHeld (the room holds the stakes and decides the result: cres)
  function makeSession(chain, opts) {
    if (!engine.api) throw new Error('The XChess engine is not loaded yet.');
    const T = makeRelayTable(engine.api); chain.table = T;
    const S = { kind: 'chess', chain, table: T, me: opts.me, opp: opts.opp, oppName: opts.oppName || 'Opponent', stake: opts.buyin || opts.stake || 0, tb: opts.tb || null, roomHeld: !!opts.roomHeld,
      settled: false, final: null, claiming: 0, onSettle: null, onChange: null, onStall: null, dispute: null, stalled: false, moveN: -1, turnLocal: 0 };
    S.gid = () => (T.g && T.g.gid) || null;
    S.open = () => {
      const white = crypto.getRandomValues(new Uint8Array(1))[0] & 1 ? S.me : S.opp;
      return chain.call('create', 'create', [S.me, { white, black: white === S.me ? S.opp : S.me, stake: S.stake, base: PVP_BASE, inc: PVP_INC, gid: rand(8) }]);
    };
    S.send = (mv) => chain.call('act', 'act', [S.me, mv]);
    S.myColour = () => (T.g ? (T.g.white === S.me ? 'w' : 'b') : null);
    S.view = () => (T.g ? { done: !!T.g.result, g: T.g } : { done: false, g: null });
    // seconds left on each clock, as the host's block clock would read it now
    S.clocks = () => {
      const g = T.g; if (!g) return null; const c = { w: g.clock.w, b: g.clock.b };
      if (!g.result) { const s = T.pos.turn === 0 ? 'w' : 'b'; c[s] = Math.max(0, g.clock[s] - (Date.now() - g.seenAt) / 1000); }
      return c;
    };
    // what this page's copy says, for the room (cres): the result, and a hash of the move list
    S.report = () => { const g = T.g; if (!g || !g.gid) return null; return { gid: g.gid, r: S.dispute ? '*' : g.result || '*', n: g.uci.length, h: hash16(g.uci.join(' ')), ...(S.dispute ? { tm: 'dispute' } : g.result ? { tm: g.term } : {}) }; };
    // the room's word ends the game on this page too (a forfeit, or a game called off)
    S.end = (result, term) => { S.settled = true; T.force(result, term); if (S.onChange) try { S.onChange(); } catch (e) { console.error(e); } };
    // keep the calls so far in this browser, for a reload (only while the room holds the stakes)
    S.save = () => {
      if (!S.roomHeld || !T.g || !T.g.gid || S.final) return;
      const e = chain.exportLog(); live.set({ v: 1, tb: S.tb, gid: T.g.gid, host: !!chain.host, me: S.me, other: S.opp, otherName: S.oppName, stake: S.stake, at: Date.now(), rows: e.rows, height: e.height, seq: e.seq });
    };
    chain.onSave = S.save;
    S.dispose = () => { if (S.roomHeld && (S.final || (T.g && T.g.result))) live.clear(S.gid()); };
    chain.listeners.push(() => {
      const g = T.g;
      if (g && g.uci.length !== S.moveN) { S.moveN = g.uci.length; S.turnLocal = chain.catchingUp ? -1 : Date.now(); }   // when this page saw the turn begin (-1: late, by catch-up)
      if (chain.logDirty) { chain.logDirty = false; S.save(); }
      if (g && g.result && !S.settled) {
        S.settled = true;
        // a time-out the host flagged long before this page's own count of the turn says it was due: the guest calls it a dispute
        if (!chain.host && g.term === 'timeout' && g.flagLeft != null && S.turnLocal > 0 && chain.streakFrom <= S.turnLocal) {
          const left = g.flagLeft, real = (Date.now() - S.turnLocal) / 1000;
          if (real < left - (5 + 0.05 * left)) S.dispute = { real, left };
        }
        const mine = S.myColour(), net = g.winner === null ? 0 : g.winner === mine ? S.stake : -S.stake;
        if (S.onSettle) try { S.onSettle(net, g); } catch (e) { console.error(e); }
      }
      // the host's clock stopped moving while the real turn went on: the guest, by its own count, says the host has run out of time
      if (!chain.host && g && !g.result && !S.stalled && S.turnLocal > 0 && chain.streakFrom <= S.turnLocal) {
        const s = T.pos.turn === 0 ? 'w' : 'b', hostSide = g.white === S.opp ? 'w' : 'b';
        if (s === hostSide) { const left = g.clock[s], real = (Date.now() - S.turnLocal) / 1000; if (real > left + 5 + 0.05 * left) { S.stalled = true; if (S.onStall) try { S.onStall(); } catch (e) { console.error(e); } } }
      }
      // the host calls the flag: the side to move has run out of time
      if (chain.host && g && !g.result && Date.now() > S.claiming) {
        const s = T.pos.turn === 0 ? 'w' : 'b';
        if (chain.ctx().time - g.last > g.clock[s]) { S.claiming = Date.now() + 4000; chain.call('claim', 'claimTimeout', [S.me]); }
      }
      if (S.onChange) try { S.onChange(); } catch (e) { console.error(e); }
    });
    if (chain.start) chain.start();       // a game being resumed after a reload replays here
    return S;
  }

  // ======================================================================= 3D: board and pieces
  const SQ = 0.058, BOARD_Y = 0.541, HALF = SQ * 4;   // 51 cm of squares (was 45): easier to read from the seats and to tap
  const sqName = (f, r) => 'abcdefgh'[f] + (r + 1);
  const sqFR = (s) => [s.charCodeAt(0) - 97, s.charCodeAt(1) - 49];
  const sqPos = (s) => { const [f, r] = sqFR(s); return [(f - 3.5) * SQ, (3.5 - r) * SQ]; };     // board-local, white at +z
  function profiles(THREE) {
    const base = [[0, 0], [0.37, 0], [0.37, 0.05], [0.33, 0.08], [0.34, 0.11], [0.27, 0.15]];
    const P = {
      p: [[0.2, 0.19], [0.14, 0.3], [0.11, 0.45], [0.17, 0.48], [0.17, 0.51], [0.1, 0.54], [0.16, 0.6], [0.18, 0.67], [0.16, 0.75], [0.1, 0.81], [0, 0.83]],
      r: [[0.25, 0.2], [0.22, 0.3], [0.2, 0.7], [0.27, 0.74], [0.28, 0.84], [0, 0.84]],   // the battlements are four blocks on top (geo.merlon)
      b: [[0.2, 0.19], [0.13, 0.3], [0.1, 0.68], [0.17, 0.71], [0.17, 0.74], [0.11, 0.77], [0.17, 0.86], [0.19, 0.95], [0.16, 1.04], [0.09, 1.11], [0.05, 1.14], [0.07, 1.17], [0.05, 1.21], [0, 1.22]],
      q: [[0.22, 0.19], [0.15, 0.32], [0.11, 0.86], [0.19, 0.9], [0.19, 0.94], [0.12, 0.97], [0.2, 1.12], [0.24, 1.22], [0.17, 1.24], [0.13, 1.26], [0.08, 1.33], [0.08, 1.39], [0.06, 1.43], [0, 1.45]],
      k: [[0.23, 0.19], [0.16, 0.32], [0.12, 0.95], [0.2, 0.99], [0.2, 1.03], [0.13, 1.06], [0.2, 1.2], [0.22, 1.28], [0, 1.3]],
      n: [[0.24, 0.2], [0.22, 0.3], [0, 0.3]]
    };
    const geo = {};
    for (const k in P) geo[k] = new THREE.LatheGeometry(base.concat(P[k]).map(([r, y]) => new THREE.Vector2(r * SQ, y * SQ)), 22);
    // the knight's head: a horse silhouette, extruded and bevelled
    const sh = new THREE.Shape(), pts = [[-0.2, 0.28], [0.24, 0.28], [0.2, 0.5], [0.28, 0.66], [0.3, 0.86], [0.22, 1.02], [0.08, 1.12], [-0.06, 1.1], [-0.16, 1.0], [-0.3, 0.86], [-0.34, 0.77], [-0.25, 0.71], [-0.12, 0.75], [-0.03, 0.72], [-0.15, 0.55], [-0.22, 0.4]];
    pts.forEach(([x, y], i) => (i ? sh.lineTo(x * SQ, y * SQ) : sh.moveTo(x * SQ, y * SQ)));
    geo.head = new THREE.ExtrudeGeometry(sh, { depth: 0.2 * SQ, bevelEnabled: true, bevelThickness: 0.04 * SQ, bevelSize: 0.035 * SQ, bevelSegments: 2, curveSegments: 4 });
    geo.head.translate(0, 0, -0.1 * SQ);
    geo.crossV = new THREE.BoxGeometry(0.09 * SQ, 0.34 * SQ, 0.09 * SQ); geo.crossH = new THREE.BoxGeometry(0.27 * SQ, 0.09 * SQ, 0.09 * SQ);
    geo.merlon = new THREE.BoxGeometry(0.13 * SQ, 0.13 * SQ, 0.1 * SQ);                 // the rook's battlements
    geo.slit = new THREE.BoxGeometry(0.3 * SQ, 0.035 * SQ, 0.3 * SQ);                   // the bishop's mitre cut
    geo.pearl = new THREE.SphereGeometry(0.05 * SQ, 10, 8);                             // the queen's coronet
    geo.head.scale(1.15, 1.12, 1.15);
    geo.band = new THREE.TorusGeometry(0.3 * SQ, 0.028 * SQ, 6, 22); geo.band.rotateX(Math.PI / 2);
    geo.hitH = 1.8 * SQ; geo.hit = new THREE.CylinderGeometry(0.47 * SQ, 0.47 * SQ, geo.hitH, 10);
    return geo;
  }
  // The squares are tiles (geometry), not a painted texture: iPad Safari has a fixed budget for the page's drawing canvases and
  // the room already spends much of it, so a 1024 px board canvas came out empty there (a black board). Only the coordinates
  // a-h / 1-8 are drawn on a small canvas, which is turned into an image straight away so its canvas memory is given back.
  function squaresGeometry(THREE, light) {
    const pos = [], nor = [], idx = [];
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
      if (((r + f) % 2 === 1) !== light) continue;
      const x0 = (f - 4) * SQ, z0 = (3 - r) * SQ, k = pos.length / 3;
      pos.push(x0, 0, z0, x0 + SQ, 0, z0, x0 + SQ, 0, z0 + SQ, x0, 0, z0 + SQ); nor.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
      idx.push(k, k + 2, k + 1, k, k + 3, k + 2);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
    return g;
  }
  function labelsTexture(THREE, W) {
    const N = 512, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d');
    const t = new THREE.CanvasTexture(c); if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
    if (!g) return t;
    const m = N * (0.025 / W), s = (N - 2 * m) / 8;
    g.fillStyle = '#d9b26a'; g.font = '600 ' + Math.round(m * 0.62) + 'px Georgia,serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 0; i < 8; i++) { g.fillText('abcdefgh'[i], m + (i + 0.5) * s, N - m / 2); g.fillText(String(i + 1), m / 2, m + (7 - i + 0.5) * s); }
    try { c.toBlob((b) => { if (!b) return; const img = new Image(); img.onload = () => { t.image = img; t.needsUpdate = true; c.width = c.height = 0; }; img.src = URL.createObjectURL(b); }, 'image/png'); } catch (_) { }
    return t;
  }
  let GEO = null, HIT_MAT = null; const OUTLINES = [];
  // An outline drawn as the piece's own back faces pushed out along their normals, by a fixed number of screen pixels, so it reads
  // the same up close and from the sofa. One flat colour, no post-processing (the iPad's canvas budget rules that out).
  function outlineMat(THREE, color) {
    const m = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(color) }, px: { value: 1.7 }, res: { value: new THREE.Vector2(1280, 800) } },
      vertexShader: 'uniform float px; uniform vec2 res; void main() { vec4 c = projectionMatrix * modelViewMatrix * vec4(position, 1.0); vec3 n = normalize(normalMatrix * normal); vec2 d = (projectionMatrix * vec4(n, 0.0)).xy; float l = length(d); if (l > 1e-5) c.xy += d / l * px * 2.0 / res * c.w; gl_Position = c; }',
      fragmentShader: 'uniform vec3 color; void main() { gl_FragColor = vec4(color, 1.0); }',
      side: THREE.BackSide
    });
    m.cut = new THREE.MeshBasicMaterial({ color });   // the bishop's cut, in the outline colour
    return m;
  }
  // a soft rim of light where the surface turns away from you, so a piece's edge never sinks into a square of the same darkness
  function rimLit(THREE, mat, rim, strength, glow) {
    mat.emissive = new THREE.Color(glow);
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.rimColor = { value: new THREE.Color(rim) }; sh.uniforms.rimStrength = { value: strength };
      sh.fragmentShader = 'uniform vec3 rimColor; uniform float rimStrength;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n\ttotalEmissiveRadiance += rimColor * rimStrength * pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 2.5);');
    };
    mat.customProgramCacheKey = () => 'pxchess-rim';
    return mat;
  }
  function makeBoard(ctx, parent) {
    const { THREE } = ctx; GEO = GEO || profiles(THREE); HIT_MAT = HIT_MAT || new THREE.MeshBasicMaterial({ visible: false });
    const root = new THREE.Group(); root.position.y = BOARD_Y; parent.add(root);
    const gold = ctx.GOLDM(), W = SQ * 8 + 0.05;
    ctx.box(W + 0.012, 0.016, W + 0.012, gold, 0, 0.008, 0, root);
    const env = ctx.envTex ? ctx.envTex() : null;
    const top = new THREE.Mesh(new THREE.PlaneGeometry(W, W), new THREE.MeshStandardMaterial({ color: 0x081627, roughness: 0.4, metalness: 0.1, envMap: env, envMapIntensity: 0.3 }));
    top.rotation.x = -Math.PI / 2; top.position.y = 0.0165; top.name = 'chess board'; root.add(top);
    for (const light of [true, false]) {
      const sq = new THREE.Mesh(squaresGeometry(THREE, light), new THREE.MeshStandardMaterial({ color: light ? 0xe8dec6 : 0x16385e, roughness: light ? 0.38 : 0.3, metalness: light ? 0.04 : 0.12, envMap: env, envMapIntensity: 0.35 }));
      sq.position.y = 0.0168; sq.receiveShadow = true; sq.userData.noShadow = true; root.add(sq);
    }
    // a fine gold line round the squares, and the coordinates
    [[0, -HALF - 0.003, W - 0.034, 0.003], [0, HALF + 0.003, W - 0.034, 0.003], [-HALF - 0.003, 0, 0.003, W - 0.034], [HALF + 0.003, 0, 0.003, W - 0.034]].forEach(([x, z, w, d]) => { const l = ctx.box(w, 0.0012, d, gold, x, 0.0172, z, root); l.userData.noShadow = true; });
    const labels = new THREE.Mesh(new THREE.PlaneGeometry(W, W), new THREE.MeshBasicMaterial({ map: labelsTexture(THREE, W), transparent: true, depthWrite: false }));
    labels.rotation.x = -Math.PI / 2; labels.position.y = 0.0171; labels.userData.noShadow = true; root.add(labels);
    // Clearer pieces (CASINO-CHESS-NEXT-PLAN section 3): warm ivory and graphite, with very little metal (metal mirrored the dark
    // room, so a black piece on a dark square had no edge), a rim light that always catches the outline, and an outline (outlineMat).
    const mats = { w: rimLit(THREE, ctx.M(0xf4ecd8, { roughness: 0.42, metalness: 0.0 }), 0x3a3020, 0.10, 0x1a1712), b: rimLit(THREE, ctx.M(0x262a33, { roughness: 0.32, metalness: 0.1 }), 0x9db2dc, 0.32, 0x07080c) };
    const outl = { w: outlineMat(THREE, 0x2a1d10), b: outlineMat(THREE, 0xe6cf98) }; OUTLINES.push(outl.w, outl.b);
    const pieceRoot = new THREE.Group(); pieceRoot.position.y = 0.0165; root.add(pieceRoot);
    // highlights: a small pool of flat squares and dots just above the board
    const hl = new THREE.Group(); hl.position.y = 0.0175; root.add(hl);
    const flat = (color, op, size) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(size || SQ * 0.96, size || SQ * 0.96), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.visible = false; m.userData.noShadow = true; hl.add(m); return m; };
    const ring = (color, op, r0, r1) => { const m = new THREE.Mesh(new THREE.RingGeometry(r0, r1, 28), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.visible = false; hl.add(m); return m; };
    const H = { last: [flat(0xd4a83a, 0.34), flat(0xd4a83a, 0.34)], sel: flat(0xff9a3c, 0.6), check: flat(0xff2b2b, 0.5), hint: [flat(0x3dff9a, 0.45), flat(0x3dff9a, 0.45)], hover: flat(0x9fe8ff, 0.42), dots: [], caps: [] };
    for (let i = 0; i < 28; i++) { H.dots.push(ring(0x5ec8ff, 0.95, 0, SQ * 0.22)); H.caps.push(ring(0xff7a3d, 0.92, SQ * 0.33, SQ * 0.48)); }
    const place = (m, s) => { const [x, z] = sqPos(s); m.position.set(x, 0, z); m.visible = true; };

    const B = { root, top, pieces: new Map(), captured: { w: [], b: [] }, tweens: [], flip: false, checkSq: null };
    function makePiece(type, colour) {
      const g = new THREE.Group(), mat = mats[colour];
      const body = new THREE.Mesh(GEO[type], mat); body.castShadow = true; g.add(body);
      const band = new THREE.Mesh(GEO.band, gold); band.position.y = 0.15 * SQ; g.add(band);
      if (type === 'n') { const h = new THREE.Mesh(GEO.head, mat); h.castShadow = true; h.rotation.y = colour === 'w' ? -Math.PI / 2 + 0.6 : Math.PI / 2 - 0.6; /* three-quarters on, so the head reads from your seat */ g.add(h); }
      if (type === 'k') { const v = new THREE.Mesh(GEO.crossV, gold), h = new THREE.Mesh(GEO.crossH, gold); v.position.y = 1.47 * SQ; h.position.y = 1.5 * SQ; g.add(v, h); }
      if (type === 'r') for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4, m = new THREE.Mesh(GEO.merlon, mat); m.position.set(Math.sin(a) * 0.205 * SQ, 0.9 * SQ, Math.cos(a) * 0.205 * SQ); m.rotation.y = a; m.castShadow = true; g.add(m); }
      if (type === 'b') { const c = new THREE.Mesh(GEO.slit, outl[colour].cut); c.position.y = 1.02 * SQ; c.rotation.set(0, Math.PI / 4, 0.55); g.add(c); }
      if (type === 'q') for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, m = new THREE.Mesh(GEO.pearl, gold); m.position.set(Math.sin(a) * 0.2 * SQ, 1.27 * SQ, Math.cos(a) * 0.2 * SQ); g.add(m); }
      // an outline round everything you see of the piece (dark on the white pieces, light gold on the black), a couple of pixels wide
      g.children.slice().forEach((o) => { if (!o.isMesh || o.material === gold && type !== 'k') return; const ol = new THREE.Mesh(o.geometry, outl[colour]); ol.position.copy(o.position); ol.rotation.copy(o.rotation); ol.scale.copy(o.scale); ol.userData.outline = true; ol.renderOrder = -1; g.add(ol); });
      // the tap area: an invisible column a little wider and taller than the piece, so its head and body both count
      const hit = new THREE.Mesh(GEO.hit, HIT_MAT); hit.position.y = GEO.hitH / 2; hit.userData.hit = true; g.add(hit);
      g.userData = { type, colour, hit }; pieceRoot.add(g); return g;
    }
    const tween = (obj, dur, fn, done) => B.tweens.push({ obj, t0: performance.now(), dur: dur * 1000, fn, done });
    B.update = () => {
      const now = performance.now();
      B.tweens = B.tweens.filter((tw) => { const u = Math.min(1, (now - tw.t0) / tw.dur); tw.fn(u < 1 ? u * u * (3 - 2 * u) : 1); if (u >= 1 && tw.done) tw.done(); return u < 1; });
      if (H.check.visible) H.check.material.opacity = 0.32 + 0.22 * Math.sin(now / 160);
    };
    // Brings the meshes to a position. squares: Map name -> 'wp', 'bk' ... A piece that left a square moves to a square that
    // gained the same piece (that covers castling and promotion-free moves); a piece with nowhere to go was captured.
    B.sync = (squares, instant, lastMove) => {
      const leaving = [], arriving = [];
      for (const [s, m] of B.pieces) { const want = squares.get(s); if (want !== m.userData.colour + m.userData.type) leaving.push([s, m]); }
      for (const [s, code] of squares) { const m = B.pieces.get(s); if (!m || m.userData.colour + m.userData.type !== code) arriving.push([s, code]); }
      leaving.forEach(([s]) => B.pieces.delete(s));
      for (const [s, code] of arriving) {
        let i = lastMove ? leaving.findIndex(([f, m]) => f === lastMove[0] && m.userData.colour + m.userData.type === code) : -1;
        if (i < 0) i = leaving.findIndex(([, m]) => m.userData.colour + m.userData.type === code);
        if (i < 0 && lastMove && s === lastMove[1]) { const pi = leaving.findIndex(([f, m]) => f === lastMove[0] && m.userData.type === 'p' && m.userData.colour === code[0]); if (pi >= 0) { const pm = leaving.splice(pi, 1)[0][1]; pieceRoot.remove(pm); } }
        const [x, z] = sqPos(s);
        if (i >= 0) {
          const m = leaving.splice(i, 1)[0][1]; B.pieces.set(s, m);
          if (instant) { m.position.set(x, 0, z); continue; }
          const x0 = m.position.x, z0 = m.position.z, arc = m.userData.type === 'n' ? 0.07 : 0.025 + Math.hypot(x - x0, z - z0) * 0.08;
          tween(m, 0.38 + Math.hypot(x - x0, z - z0) * 0.9, (u) => m.position.set(x0 + (x - x0) * u, Math.sin(u * Math.PI) * arc, z0 + (z - z0) * u));
        } else {
          const m = makePiece(code[1], code[0]); B.pieces.set(s, m); m.position.set(x, 0, z);
          if (!instant) { m.scale.setScalar(0.01); tween(m, 0.35, (u) => m.scale.setScalar(Math.max(0.01, u))); }
        }
      }
      for (const [, m] of leaving) {     // captured (or promoted away): to the tray beside the board
        const c = m.userData.colour;
        const list = B.captured[c]; const i = list.length; list.push(m);
        const side = c === 'b' ? 1 : -1, x = side * (HALF + 0.065 + Math.floor(i / 8) * 0.04), z = side * (-HALF + 0.03 + (i % 8) * 0.048);
        m.scale.setScalar(0.72);
        if (instant) { m.position.set(x, -0.0165 + 0.001, z); continue; }
        const x0 = m.position.x, z0 = m.position.z;
        tween(m, 0.55, (u) => m.position.set(x0 + (x - x0) * u, Math.sin(u * Math.PI) * 0.06 + (-0.0165) * u, z0 + (z - z0) * u));
      }
    };
    B.rebuildTrays = (squares) => {
      for (const c of ['w', 'b']) { B.captured[c].forEach((m) => pieceRoot.remove(m)); B.captured[c] = []; }
      const have = {}; for (const code of squares.values()) have[code] = (have[code] || 0) + 1;
      const START_SET = { p: 8, n: 2, b: 2, r: 2, q: 1 };
      for (const c of ['w', 'b']) for (const t of ['q', 'r', 'b', 'n', 'p']) for (let k = have[c + t] || 0; k < START_SET[t]; k++) {
        const m = makePiece(t, c), list = B.captured[c], i = list.length; list.push(m);
        const side = c === 'b' ? 1 : -1; m.scale.setScalar(0.72); m.position.set(side * (HALF + 0.065 + Math.floor(i / 8) * 0.04), -0.0165 + 0.001, side * (-HALF + 0.03 + (i % 8) * 0.048));
      }
    };
    B.clear = () => { for (const m of B.pieces.values()) pieceRoot.remove(m); for (const c of ['w', 'b']) { B.captured[c].forEach((m) => pieceRoot.remove(m)); B.captured[c] = []; } B.pieces.clear(); B.tweens = []; };
    B.setFlip = (flip) => { B.flip = !!flip; root.rotation.y = flip ? Math.PI : 0; };
    // pieces that are off their square (after a drag) glide back, except the one in your hand and one dropped while its move is sent
    B.held = null; B.parked = null;
    B.home = () => {
      if (B.parked && performance.now() > B.parked.until) B.parked = null;
      for (const [s2, m] of B.pieces) {
        if (m === B.held || (B.parked && B.parked.m === m) || B.tweens.some((t) => t.obj === m)) continue;
        const [x, z] = sqPos(s2); if (Math.hypot(m.position.x - x, m.position.z - z) < 1e-4) continue;
        const x0 = m.position.x, z0 = m.position.z, y0 = m.position.y;
        tween(m, 0.22, (u) => m.position.set(x0 + (x - x0) * u, y0 * (1 - u), z0 + (z - z0) * u));
      }
    };
    // what is under the pointer: the nearest piece's square (its tap area), and the square of the board itself
    const HEIGHT = { p: 0.83, n: 1.15, b: 1.22, r: 0.93, q: 1.45, k: 1.5 }, A = new THREE.Vector3(), Bv = new THREE.Vector3();
    // what is under the pointer, in the order you see it: the piece actually drawn there (nearest), the board square, and for a
    // near miss on a slim piece, the piece whose upright centre line passes closest to the pointer (within half a square)
    B.pickAt = (ray) => {
      const owner = new Map(), meshes = [];
      for (const [s2, m] of B.pieces) m.traverse((o) => { if (o.isMesh && !o.userData.hit && !o.userData.outline) { owner.set(o, s2); meshes.push(o); } });
      const real = ray.intersectObjects(meshes, false)[0];
      let near = null, best = (SQ * 0.5) ** 2;
      for (const [s2, m] of B.pieces) {
        m.getWorldPosition(A); Bv.copy(A); Bv.y += HEIGHT[m.userData.type] * SQ;
        const d = ray.ray.distanceSqToSegment(A, Bv); if (d < best) { best = d; near = s2; }
      }
      return { piece: real ? owner.get(real.object) : null, board: B.pick(ray), near };
    };
    B.pickPiece = (ray) => { const r = B.pickAt(ray); return r.piece || r.near; };
    const PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), V = new THREE.Vector3();
    // where the pointer meets the top of the board (board-local x, z), for dragging
    B.onBoard = (ray) => {
      top.updateMatrixWorld(); PLANE.constant = -top.getWorldPosition(V).y;
      if (!ray.ray.intersectPlane(PLANE, V)) return null;
      const p = root.worldToLocal(V.clone()), f = Math.floor(p.x / SQ + 4), r = Math.floor(4 - p.z / SQ);
      return { x: p.x, z: p.z, sq: f >= 0 && f < 8 && r >= 0 && r < 8 ? sqName(f, r) : null };
    };
    B.lift = (s2, up) => { const m = B.pieces.get(s2); if (m && m !== B.held && !B.tweens.some((t) => t.obj === m)) m.position.y = up; };
    B.hover = (s2) => { if (s2) place(H.hover, s2); else H.hover.visible = false; };
    B.marks = ({ last, sel, targets, check, hint }) => {
      H.last.forEach((m, i) => (last ? place(m, last[i]) : (m.visible = false)));
      if (sel) place(H.sel, sel); else H.sel.visible = false;
      for (const [s2, m] of B.pieces) { if (m === B.held) continue; const up = s2 === sel ? 0.014 : 0; if (Math.abs(m.position.y - up) > 1e-4 && !B.tweens.some((t) => t.obj === m)) m.position.y = up; }
      H.dots.forEach((m) => (m.visible = false)); H.caps.forEach((m) => (m.visible = false));
      (targets || []).slice(0, 28).forEach((t, i) => place(t.capture ? H.caps[i] : H.dots[i], t.sq));
      if (check) place(H.check, check); else H.check.visible = false;
      H.hint.forEach((m, i) => (hint ? place(m, hint[i]) : (m.visible = false)));
    };
    // a click on the board: the square under the pointer, or null
    B.pick = (ray) => {
      const hit = ray.intersectObject(top, false)[0]; if (!hit) return null;
      const p = root.worldToLocal(hit.point.clone()), f = Math.floor(p.x / SQ + 4), r = Math.floor(4 - p.z / SQ);
      return f >= 0 && f < 8 && r >= 0 && r < 8 ? sqName(f, r) : null;
    };
    return B;
  }
  const boardMap = (pos) => { const m = new Map(); for (const q of pos.squares()) if (q.piece) m.set(q.square, (q.piece.color ? 'b' : 'w') + PIECE[q.piece.type]); return m; };
  // Material (CASINO-CHESS-NEXT-PLAN section 1): worked out from the position every time, never kept as a running total. A side has
  // taken whatever of the other side's starting set is missing; the score is the points on the board (a promoted pawn counts as its
  // new piece, as chess.com shows it).
  const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }, START_SET = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  function material(squares) {
    const have = {}; let w = 0, b = 0;
    for (const code of squares.values()) { have[code] = (have[code] || 0) + 1; if (code[0] === 'w') w += VAL[code[1]]; else b += VAL[code[1]]; }
    const took = (c) => { const o = c === 'w' ? 'b' : 'w', out = []; for (const t of ['p', 'n', 'b', 'r', 'q']) for (let k = have[o + t] || 0; k < START_SET[t]; k++) out.push(t); return out; };
    return { w: { took: took('w'), pts: w }, b: { took: took('b'), pts: b }, lead: w - b };
  }
  const kingSquare = (pos, colour) => { for (const q of pos.squares()) if (q.piece && q.piece.type === 6 && (q.piece.color ? 'b' : 'w') === colour) return q.square; return null; };

  // the armchair across the table (the second player's seat)
  function makeArmchair(ctx, parent, z) {
    const { THREE } = ctx, g = new THREE.Group(); g.position.set(0, 0, z); parent.add(g);
    const velvet = ctx.M(0x0c2852, { roughness: 0.88, metalness: 0.02 }), gold = ctx.GOLDM();
    ctx.box(0.76, 0.1, 0.62, gold, 0, 0.12, 0, g);
    ctx.box(0.72, 0.26, 0.6, velvet, 0, 0.3, 0, g);
    ctx.box(0.6, 0.1, 0.5, velvet, 0, 0.47, 0.03, g);
    ctx.box(0.76, 0.5, 0.16, velvet, 0, 0.66, -0.25, g);
    [-1, 1].forEach((s) => { ctx.box(0.12, 0.34, 0.6, velvet, s * 0.33, 0.55, 0, g); ctx.box(0.13, 0.012, 0.61, gold, s * 0.33, 0.725, 0, g); });
    for (let i = 0; i < 5; i++) ctx.box(0.012, 0.42, 0.018, gold, -0.24 + i * 0.12, 0.68, -0.168, g);
    [[-0.32, -0.25], [0.32, -0.25], [-0.32, 0.25], [0.32, 0.25]].forEach(([x, zz]) => ctx.cyl(0.025, 0.018, 0.08, gold, x, 0.04, zz, g, 10));
    return g;
  }

  // ======================================================================= saved state (this browser)
  const store = { get() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (_) { return {}; } }, set(v) { try { localStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch (_) { } } };
  function rand(n) { return Array.from(crypto.getRandomValues(new Uint8Array(n)), (x) => x.toString(16).padStart(2, '0')).join(''); }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clock = (s) => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const TERM = { checkmate: 'checkmate', stalemate: 'stalemate', 'insufficient-material': 'insufficient material', repetition: 'threefold repetition', 'fifty-move': 'the fifty-move rule', resignation: 'resignation', agreement: 'agreement', timeout: 'time' };
  function injectCss() {
    if (document.getElementById('pxChessCss')) return;
    const st = document.createElement('style'); st.id = 'pxChessCss';
    st.textContent = `.pxc{display:flex;flex-direction:column;gap:8px}.pxc .row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.pxc-house{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:6px;max-height:212px;overflow:auto;padding:2px}
.pxc-house button{all:unset;cursor:pointer;box-sizing:border-box;padding:7px 9px;border-radius:10px;border:1px solid rgba(212,168,58,.35);background:rgba(8,18,32,.75);color:#f1e3b8;font:600 13px Georgia,serif;line-height:1.2;min-height:44px}
.pxc .st{color:#ffd86b;font-size:11px;letter-spacing:1px}.pxc-house button small{display:block;font:11px system-ui,sans-serif;color:#b7a587;margin-top:2px}.pxc-house button .st{color:#ffd86b;font-size:11px;letter-spacing:1px}
.pxc-house button[aria-pressed=true]{border-color:#ffd86b;background:rgba(212,168,58,.18);box-shadow:0 0 0 1px #ffd86b inset}
.pxc-seg{display:inline-flex;border:1px solid rgba(212,168,58,.45);border-radius:999px;overflow:hidden}.pxc-seg button{all:unset;cursor:pointer;padding:6px 12px;min-height:30px;font:600 12px system-ui,sans-serif;color:#d8c9a2}
.pxc-seg button[aria-pressed=true]{background:#d4a83a;color:#170c04}.pxc .clk{font:700 20px ui-monospace,Menlo,monospace;padding:3px 9px;border-radius:8px;background:rgba(8,18,32,.8);border:1px solid rgba(212,168,58,.3);color:#f1e3b8}
.pxc .clk.on{border-color:#ffd86b;color:#ffd86b}.pxc .clk.low{color:#ff8a6a}.pxc .moves{font:12px ui-monospace,Menlo,monospace;color:#cbbd98;max-height:46px;overflow:auto;white-space:normal}
.pxc .ver{font:12px system-ui,sans-serif;color:#9fd8b0}.pxc .ver.bad{color:#ff9a7a}.pxc .who{font:600 13px Georgia,serif;color:#f1e3b8}.pxc .dim{color:#9c8f74;font-size:12px}
.pxc .mat{display:inline-flex;align-items:center;gap:4px;font-size:15px;line-height:1;color:#e9dcb8}.pxc .mat .g{letter-spacing:-2px}.pxc .mat b{font:700 12px system-ui,sans-serif;color:#9fd8b0}
.pxc .moves{max-height:64px}.pxc .moves .mn{color:#7f735b;margin:0 2px 0 6px}.pxc .moves .mv{all:unset;cursor:pointer;padding:1px 3px;border-radius:4px;color:#d9cba4}.pxc .moves .mv:hover{background:rgba(212,168,58,.18)}.pxc .moves .mv.on{background:#d4a83a;color:#170c04}
.pxc .rv{gap:4px}.pxc .rv button{all:unset;cursor:pointer;min-width:34px;min-height:34px;box-sizing:border-box;text-align:center;padding:6px 8px;border-radius:8px;border:1px solid rgba(212,168,58,.45);background:rgba(8,18,32,.8);color:#f1e3b8;font:700 13px system-ui,sans-serif}
.pxc .rv button:disabled{opacity:.35;cursor:default}.pxc .rv button.live{padding:6px 12px;border-color:#d4a83a;color:#ffd86b}.pxc .rv button.live.go{background:#d4a83a;color:#170c04;animation:pxcGo 1.2s ease-in-out infinite}
@keyframes pxcGo{50%{box-shadow:0 0 0 4px rgba(255,216,107,.25)}}
.pxc-bets{display:flex;flex-direction:column;gap:5px;padding:7px 9px;border-radius:10px;border:1px solid rgba(212,168,58,.35);background:rgba(8,18,32,.6)}.pxc-bets b{color:#ffd86b}.pxc-bets .gone{color:#ff9a7a}
.pxc .promo button{all:unset;cursor:pointer;font-size:28px;line-height:1;padding:6px 10px;border-radius:8px;border:1px solid rgba(212,168,58,.5);background:rgba(8,18,32,.8);color:#f1e3b8;min-width:28px;text-align:center}`;
    document.head.appendChild(st);
  }
  const stars = (n) => `<span class="st" aria-label="strength ${n} of 5">${'★'.repeat(n)}<span style="opacity:.25">${'★'.repeat(5 - n)}</span></span>`;
  // ---- watching (section 7 of the plan): a game travels as a small snapshot. Moves pack into two characters each (from and to
  // square, 0..63, in a 64-letter alphabet) with a mark after a promotion, so even a long game fits one room message.
  const SQ64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_', PROMO_MARK = { q: '!', r: '~', b: '*', n: '^' };
  const sqIdx = (s) => (s.charCodeAt(1) - 49) * 8 + (s.charCodeAt(0) - 97), idxSq = (i) => 'abcdefgh'[i % 8] + (Math.floor(i / 8) + 1);
  function packMoves(uci) { return uci.map((u) => SQ64[sqIdx(u.slice(0, 2))] + SQ64[sqIdx(u.slice(2, 4))] + (u[4] ? PROMO_MARK[u[4]] : '')).join(''); }
  function unpackMoves(str) {
    if (typeof str !== 'string' || str.length > 1400) return null;
    const out = [], back = Object.fromEntries(Object.entries(PROMO_MARK).map(([k, v]) => [v, k]));
    for (let i = 0; i < str.length;) {
      const f = SQ64.indexOf(str[i]), t = SQ64.indexOf(str[i + 1]); if (f < 0 || t < 0) return null; i += 2;
      let u = idxSq(f) + idxSq(t); if (back[str[i]]) { u += back[str[i]]; i++; }
      out.push(u);
    }
    return out;
  }
  const SPEC_FRESH = 45000, SPEC_AFTER = 30000, SPEC_BEAT = 15000;   // a live game unseen this long is gone; a finished one stays shown; the host repeats itself
  let chip = null, chipOwner = null;
  let pointerOn = false, touchOwner = null, touchSaved = null, lockTravel = 0;
  // the mouse is captured (a click into the room at the table, on a computer): every press, move and release is then at the dot in the
  // middle of the screen, and how far the mouse has moved since the press decides drag or click (the pointer itself stays put)
  function lockedEl(ctx) { const el = ctx.canvasEl && ctx.canvasEl(); return el && document.pointerLockElement === el ? el : null; }
  function centreEv(el, ev) { const r = el.getBoundingClientRect(); return { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerId: ev && ev.pointerId != null ? ev.pointerId : 1, pointerType: 'mouse', button: (ev && ev.button) || 0, locked: true, travel: lockTravel }; }
  function attachPointer(ctx) {
    if (pointerOn) return; const el = ctx.canvasEl(); if (!el || !root.PointerEvent) return; pointerOn = true;
    const to = (kind) => (ev) => {
      const st = built.find((s) => ctx.focus() === s); if (!st || !st.pointer) return;
      const lk = lockedEl(ctx); if (lk) { if (kind === 'down') lockTravel = 0; else if (kind === 'move') lockTravel += Math.abs(ev.movementX || 0) + Math.abs(ev.movementY || 0); }
      const e = lk ? centreEv(lk, ev) : ev;
      if (kind === 'down') { if (st.pointer('down', e)) try { el.setPointerCapture(ev.pointerId); } catch (_) { } }
      else st.pointer(kind, e);
    };
    el.addEventListener('pointerdown', to('down')); el.addEventListener('pointermove', to('move'));
    el.addEventListener('pointerup', to('up')); el.addEventListener('pointercancel', to('cancel'));
  }
  // while you sit at a chess table, a drag on the board moves a piece: the browser may not pan, zoom or show its press menu
  function touchMode(owner, caller) {
    if (owner === touchOwner || (!owner && touchOwner !== caller)) return;
    const el = document.getElementById('gl'); if (!el) return;
    if (owner) { if (!touchSaved) touchSaved = [el.style.touchAction, el.style.webkitTouchCallout, el.style.webkitUserSelect]; el.style.touchAction = 'none'; el.style.webkitTouchCallout = 'none'; el.style.webkitUserSelect = 'none'; }
    else if (touchSaved) { [el.style.touchAction, el.style.webkitTouchCallout, el.style.webkitUserSelect] = touchSaved; touchSaved = null; }
    touchOwner = owner;
  }
  function specChip(text) {
    if (!chip) { chip = document.createElement('div'); chip.id = 'pxChessWatch'; chip.setAttribute('role', 'status'); chip.style.cssText = 'position:fixed;left:50%;top:calc(' + (innerWidth < 600 ? 150 : 102) + 'px + env(safe-area-inset-top));transform:translateX(-50%);z-index:30;max-width:calc(100vw - 32px);padding:7px 14px;border-radius:999px;background:rgba(8,18,32,.88);border:1px solid rgba(212,168,58,.55);color:#f1e3b8;font:600 13px Georgia,serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;display:none'; document.body.appendChild(chip); }
    chip.style.display = text ? 'block' : 'none'; if (text && chip.textContent !== text) chip.textContent = text;
  }
  // ---- the X-Chess view's pieces (CASINO-CHESS-NEXT-PLAN section 4): our own flat set in the familiar chess.com / lichess manner,
  // drawn for this page (no third-party artwork): bold silhouettes, white with a dark outline, black with a light one. SVG, not
  // text glyphs, so they look the same on every device (chess glyphs can turn into emoji on an iPhone).
  const P2D = {
    p: '<circle cx="22.5" cy="13" r="5.2"/><path d="M18 19.5h9l-1 2.5c1 5 4 8.5 7 12.5H12c3-4 6-7.5 7-12.5z"/>',
    r: '<path d="M12 9h4v3h3.5V9h6v3H29V9h4v6l-3 3v11l3 3v3H12v-3l3-3V18l-3-3z"/><path class="d" d="M15 18h15M15 29h15"/>',
    n: '<path d="M24 9c8 1 13 7 12 26H17c0-6 5-7 4-12-2 2-4 2-5 4-1 1-4 2-5 0-1-2-1-3 1-6 3-4 6-6 7-9 0-2 1-3 1-4l2-3z"/><circle class="e" cx="16.5" cy="15.5" r="1.3"/><path class="d" d="M26.5 11.5c5 3 7.5 10 7.5 21.5"/>',
    b: '<circle cx="22.5" cy="8" r="2.4"/><path d="M22.5 10.5c-5 4-7 8-7 11 0 3 2.5 5 7 5s7-2 7-5c0-3-2-7-7-11z"/><path d="M16 28h13l-1.5 2.5h-10z"/><path d="M17 30.5h11c.5 2 2 3 4 4.5H13c2-1.5 3.5-2.5 4-4.5z"/><path class="d" d="M20 21.5l5-5"/>',
    q: '<path d="M13 27L9 13l6 7 .5-10 4.5 9 2.5-11 2.5 11 4.5-9 .5 10 6-7-4 14z"/><circle cx="9" cy="12.5" r="2.1"/><circle cx="15.5" cy="9.5" r="2.1"/><circle cx="22.5" cy="7.5" r="2.1"/><circle cx="29.5" cy="9.5" r="2.1"/><circle cx="36" cy="12.5" r="2.1"/><path d="M13 27h19l-1 3H14z"/><path d="M14 30h17c0 2 2 3 3 5H11c1-2 3-3 3-5z"/>',
    k: '<path d="M21 3h3v3h3v3h-3v10h-3V9h-3V6h3z"/><path d="M12 19c0-3 3-5 6-4 2 .7 3.5 2.5 4.5 4 1-1.5 2.5-3.3 4.5-4 3-1 6 1 6 4 0 4-3 8-4.5 10h-12C15 27 12 23 12 19z"/><path d="M15.5 29h14l-.7 2.5H16.2z"/><path d="M16 31.5h13c0 1.6 2 2.6 3.5 3.5h-20c1.5-.9 3.5-1.9 3.5-3.5z"/>'
  };
  const pieceSvg = (code) => `<svg class="pc ${code[0]}" viewBox="0 0 45 45" aria-hidden="true">${P2D[code[1]]}<rect x="10" y="35" width="25" height="4" rx="1.5"/></svg>`;
  const X2D_CSS = `#pxc2d{position:fixed;z-index:6;display:flex;align-items:center;justify-content:center;background:rgba(4,8,14,.74);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);touch-action:none;-webkit-user-select:none;user-select:none}
#pxc2d[hidden]{display:none}#pxc2d .wrap{display:flex;flex-direction:column;gap:6px}
#pxc2d .pl{display:flex;align-items:center;gap:8px;min-height:30px;font:600 14px Georgia,serif;color:#f1e3b8}#pxc2d .pl .clk{font:700 17px ui-monospace,Menlo,monospace;padding:2px 8px;border-radius:7px;background:#0b1624;border:1px solid rgba(212,168,58,.35)}
#pxc2d .pl .clk.on{border-color:#ffd86b;color:#ffd86b}#pxc2d .pl .clk.low{color:#ff8a6a}#pxc2d .pl .turn{width:9px;height:9px;border-radius:50%;background:#ffd86b;box-shadow:0 0 8px #ffd86b}
#pxc2d .mat{display:inline-flex;align-items:center;gap:3px}#pxc2d .mat .g{font-size:17px;letter-spacing:-3px;color:#e9dcb8}#pxc2d .mat b{font:700 13px system-ui,sans-serif;color:#9fd8b0;margin-left:4px}
#pxc2d .bd{position:relative;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);border:3px solid #b8913f;border-radius:4px;box-shadow:0 10px 40px rgba(0,0,0,.6);touch-action:none}
#pxc2d .sq{position:relative;background:#b9a98f}#pxc2d .sq.dk{background:#6d5b46}
#pxc2d .sq .co{position:absolute;font:700 11px system-ui,sans-serif;pointer-events:none;color:#6d5b46}#pxc2d .sq.dk .co{color:#d9ccb3}#pxc2d .sq .co.r{left:3px;top:2px}#pxc2d .sq .co.f{right:3px;bottom:1px}
#pxc2d .sq.last::before,#pxc2d .sq.sel::before,#pxc2d .sq.hint::before,#pxc2d .sq.chk::before{content:"";position:absolute;inset:0}
#pxc2d .sq.last::before{background:rgba(255,214,90,.42)}#pxc2d .sq.sel::before{background:rgba(255,154,60,.6)}#pxc2d .sq.hint::before{background:rgba(61,255,154,.4)}#pxc2d .sq.chk::before{background:radial-gradient(circle,rgba(255,40,40,.95) 0,rgba(255,40,40,.5) 45%,transparent 72%)}
#pxc2d .sq.tg::after{content:"";position:absolute;left:36%;top:36%;width:28%;height:28%;border-radius:50%;background:rgba(18,14,10,.38);pointer-events:none}
#pxc2d .sq.tg.cap::after{left:4%;top:4%;width:92%;height:92%;box-sizing:border-box;background:none;border:5px solid rgba(18,14,10,.4)}#pxc2d .sq.hov{box-shadow:inset 0 0 0 3px rgba(255,255,255,.75)}
#pxc2d .pc{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}#pxc2d .pc *{stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round}
#pxc2d .pc.w *{fill:#fbfaf6;stroke:#1e1a14}#pxc2d .pc.b *{fill:#2a2622;stroke:#e6dcc4;stroke-width:1.3}#pxc2d .pc .d{fill:none!important}#pxc2d .pc.w .e{fill:#1e1a14}#pxc2d .pc.b .e{fill:#e6dcc4}
#pxc2d .pc.lift{opacity:.3}#pxc2d .ghost{position:fixed;pointer-events:none;z-index:7;filter:drop-shadow(0 6px 8px rgba(0,0,0,.5))}#pxc2d .ghost .pc{position:static}
#pxc2d .rvbar{display:flex;flex-wrap:wrap;gap:4px;align-items:center}#pxc2d .rvbar button{all:unset;cursor:pointer;min-width:36px;min-height:36px;box-sizing:border-box;text-align:center;padding:7px 9px;border-radius:8px;border:1px solid rgba(212,168,58,.45);background:#0b1624;color:#f1e3b8;font:700 13px system-ui,sans-serif}
#pxc2d .rvbar button:disabled{opacity:.35;cursor:default}#pxc2d .rvbar button.live{border-color:#d4a83a;color:#ffd86b}#pxc2d .rvbar button.live.go{background:#d4a83a;color:#170c04}#pxc2d .rvbar .dim{color:#9c8f74;font:12px system-ui,sans-serif}
#pxc2d .promo{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:6px;background:rgba(4,8,14,.6);z-index:2}#pxc2d .promo button{all:unset;cursor:pointer;width:22%;aspect-ratio:1;position:relative;border-radius:8px;background:#b9a98f;border:2px solid #ffd86b}
#pxc2d .say{font:12px system-ui,sans-serif;color:#cbbd98;min-height:16px}`;
  const GLYPH = { wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙', bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟' };

  // ======================================================================= the stations
  function makeStation(ctx, def) {
    const { THREE } = ctx;
    const g = new THREE.Group(); g.name = def.id;
    const board = makeBoard(ctx, g);
    makeArmchair(ctx, g, -0.97);
    const SEATS = [{ x: 0, z: SOFA_SEAT.z, h: SOFA_SEAT.h, sofa: true, stand: { x: def.side * 1.95, z: 1.05 } }, { x: 0, z: CHAIR_SEAT.z, h: CHAIR_SEAT.h, stand: { x: def.side * 0.95, z: -0.8 } }];
    const lobby = ctx.lobby({ tb: def.id, kind: 'chess', label: 'Chess' });
    const saved = store.get();
    // house game state (this browser only)
    let H = null;            // { profile, me, seed, uci:[], pos, over:{result,termination,winner}, verified, thinking }
    let R = null;            // a game between two other people at this table, as their snapshots show it (watching)
    let specSent = { key: '', at: 0 }, specAskAt = 0, specAnswerAt = 0, hereSince = 0;
    // on the side of the table away from the glasses (sofa x +0.37 is table x -0.37 at both lounges)
    const WATCH_SEAT = { x: 1.08, z: 0.12, pad: true, watch: true, stand: { x: 1.45, z: 0.35 } };
    let pick = { profile: saved.profile || 'gambit', colour: saved.colour || 'w', stake: 0 };
    let sel = null, targets = [], promo = null, hint = null, hintUntil = 0, msg = '', tone = '', busy = false, lastSec = -1, S = null, result = null;
    let B = null, betAmt = 100, goneInfo = null, resumeTry = 0, askBetAt = 0;   // the bets on the game being watched; a player who has left (cgone); the saved game to carry on
    // move review (CASINO-CHESS-NEXT-PLAN section 2): null is the live game, a number the position after that many half-moves
    let rv = null, rvNew = false, rvTimer = 0, rvLen = 0;
    const watchingHere = () => ctx.focus() === st && !!(ctx.seat() && ctx.seat().watch);
    const liveR = () => !!R && Date.now() - R.rx < (R.result ? SPEC_AFTER : SPEC_FRESH);
    // what the board shows: your own game against a player, else a game you are watching, else your house game
    const showR = () => !S && liveR() && !(H && ctx.focus() === st && !watchingHere());
    const me = () => (S ? S.myColour() : showR() ? 'w' : H ? H.me : 'w');
    const pos = () => (S && S.table.pos ? S.table.pos : showR() ? R.pos : H ? H.pos : null);
    const movesNow = () => (S ? (S.table.g ? S.table.g.uci : null) : showR() ? R.uci : H ? H.uci : null);
    // the position after the first k moves (and the move that led to it), replayed with XChess's own Position
    function positionAt(k) {
      const u = movesNow() || [], E = engine.api; if (!E) return null;
      const p = new E.Position(START, 'legal-en-passant'); let last = null, san = '';
      for (let i = 0; i < Math.min(k, u.length); i++) { const m = p.applyUci(u[i]); if (!m) break; last = [m.uci.slice(0, 2), m.uci.slice(2, 4)]; san = m.san; }
      return { p, last, san };
    }
    const shown = () => (rv !== null ? positionAt(rv) : null);
    function rvGo(k) {
      const n = (movesNow() || []).length; if (!n) { rv = null; return; }
      k = Math.max(0, Math.min(n, k)); rv = k >= n ? null : k; if (rv === null) { rvNew = false; stopPlay(); }
      sel = null; targets = []; ctx.sfx('move'); refresh();
    }
    const stopPlay = () => { if (rvTimer) { clearInterval(rvTimer); rvTimer = 0; } };
    function sanList() {   // every move's SAN, replayed (for the clickable moves list)
      const u = movesNow() || [], E = engine.api; if (!E || !u.length) return [];
      const p = new E.Position(START, 'legal-en-passant'), out = [];
      for (const x of u) { const m = p.applyUci(x); if (!m) break; out.push(m.san); }
      return out;
    }
    const matOf = () => { const v = shown(), p = v ? v.p : pos(); return p ? material(boardMap(p)) : null; };
    // pieces a side has taken (in the other side's colour), and +N when that side is ahead
    function matHtml(side) {
      const m = matOf(); if (!m) return '';
      const o = side === 'w' ? 'b' : 'w', took = m[side].took, lead = side === 'w' ? m.lead : -m.lead;
      if (!took.length && lead <= 0) return '';
      const groups = []; let prev = null; for (const t of took) { if (t !== prev) groups.push(''); groups[groups.length - 1] += GLYPH[o + t]; prev = t; }
      const say = (lead > 0 ? (side === 'w' ? 'White' : 'Black') + ' is up ' + lead + '. ' : '') + 'Taken: ' + (took.length ? took.map((t) => NAMES[t]).join(', ') : 'nothing') + '.';
      return `<span class="mat" aria-label="${say}"><span class="g">${groups.join(' ')}</span>${lead > 0 ? `<b>+${lead}</b>` : ''}</span>`;
    }
    // the moves list (each move takes you to it) and the review row: |◀ ◀ ▶ ▶| and Back to the game
    function movesHtml() {
      const sans = sanList(), n = sans.length; if (!n) return '<div class="moves"><span class="dim">No moves yet.</span></div>';
      const at = rv === null ? n : rv; let out = '';
      sans.forEach((x, i) => { if (i % 2 === 0) out += `<span class="mn">${i / 2 + 1}.</span>`; out += `<button data-a="rv" data-to="${i + 1}" class="mv${i + 1 === at ? ' on' : ''}">${esc(x)}</button>`; });
      return `<div class="moves" data-at="${at}">${out}</div>`;
    }
    function reviewHtml() {
      const n = (movesNow() || []).length; if (!n) return '';
      const at = rv === null ? n : rv, over = (H && H.over) || (S && S.table.g && S.table.g.result) || (showR() && R.result);
      const b = (to, label, title, dis) => `<button data-a="rv" data-to="${to}" title="${title}" aria-label="${title}"${dis ? ' disabled' : ''}>${label}</button>`;
      let live = '';
      if (rv !== null) live = `<button data-a="rvlive" class="live${myTurn() ? ' go' : ''}">${over ? 'Back to the end' : 'Back to the game'}${rvNew ? ' •' : ''}${myTurn() ? ' · your move' : ''}</button>`;
      const play = rv !== null || over ? `<button data-a="rvplay" title="${rvTimer ? 'Pause' : 'Play through the moves'}" aria-label="${rvTimer ? 'Pause' : 'Play'}">${rvTimer ? '❚❚' : '▷'}</button>` : '';
      return `<div class="row rv" role="group" aria-label="Look through the moves">${b(0, '|◀', 'First move', at === 0)}${b(at - 1, '◀', 'Back one move', at === 0)}${play}${b(at + 1, '▶', 'Forward one move', at >= n)}${b(n, '▶|', 'Latest move', at >= n)}${live}<span class="dim" role="status">move ${at} of ${n}</span></div>`;
    }
    const reviewSay = () => { const v = shown(); if (!v) return ''; const n = (movesNow() || []).length; return v.san ? 'Move ' + rv + ' of ' + n + ' · ' + (rv % 2 ? 'white' : 'black') + ' played ' + v.san + '.' : 'The start of the game.'; };
    const mySeatIsSofa = () => { const s = ctx.seat(); return !s || s.z > 0 || ctx.focus() !== st; };
    const stats = () => store.get().stats || {};
    function record(profile, outcome) { const v = store.get(); v.stats = v.stats || {}; const r = v.stats[profile] = v.stats[profile] || { w: 0, d: 0, l: 0 }; r[outcome]++; store.set(v); }
    function saveHouse() { const v = store.get(); v.profile = pick.profile; v.colour = pick.colour; v.games = v.games || {}; v.games[def.id] = H && !H.over ? { profile: H.profile, me: H.me, seed: H.seed, uci: H.uci } : null; store.set(v); }

    // ---- what the board shows
    function orient() { const flip = (me() === 'w') !== mySeatIsSofa(); if (flip !== board.flip) board.setFlip(flip); }
    function paint(instant) {
      orient(); let p = pos();
      if (!p) { if (engine.api) board.sync(boardMap(new (engine.api.Position)(START)), instant); board.marks({}); paint2d(); return; }
      let lm = S ? S.table.g && S.table.g.lastMove : showR() ? R.last : H && H.last;
      const v = shown(), rvWas = paint.rv; paint.rv = rv;
      if (v) { p = v.p; lm = v.last; }
      const bm = boardMap(p); board.sync(bm, instant, lm); if (instant || v || rvWas !== null && rvWas !== undefined) board.rebuildTrays(bm); board.home();
      const check = p.inCheck() ? kingSquare(p, p.turn === 0 ? 'w' : 'b') : null;
      board.marks({ last: lm, sel: v ? null : sel, targets: v ? [] : targets, check, hint: !v && hint && performance.now() < hintUntil ? hint : null });
      paint2d();
    }
    const myTurn = () => { const p = pos(); if (!p || (!S && showR())) return false; if (S) return !!S.table.g && !S.table.g.result && (p.turn === 0 ? 'w' : 'b') === me(); return !!H && !H.over && !H.thinking && (p.turn === 0 ? 'w' : 'b') === H.me; };
    function refresh() { const n = (movesNow() || []).length; if (rv !== null && n > rvLen) rvNew = true; rvLen = n; paint(false); if (ctx.focus() === st) ctx.render(); }

    // ---- house games
    async function startHouse(resume) {
      try { await loadEngine(); } catch (e) { msg = engine.error; tone = 'lose'; refresh(); return; }
      const E = engine.api;
      const r = resume || { profile: pick.profile, me: pick.colour === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : pick.colour, seed: 'parallax-casino:' + def.id + ':' + rand(16), uci: [] };
      const p = new E.Position(START, 'legal-en-passant'); let last = null;
      for (const u of r.uci) { const m = p.applyUci(u); if (!m) break; last = [m.uci.slice(0, 2), m.uci.slice(2, 4)]; }
      H = { profile: r.profile, me: r.me, seed: r.seed, uci: r.uci.slice(0, p.history().length), pos: p, last, over: null, verified: null, thinking: false };
      sel = null; targets = []; promo = null; hint = null; result = null; rv = null; rvNew = false; stopPlay(); board.clear(); paint(true);
      const prof = houseList().find((x) => x.id === H.profile);
      msg = resume ? 'Game resumed against ' + prof.name + '.' : (H.me === 'w' ? 'You have white. Your move.' : 'You have black. ' + prof.name + ' opens.'); tone = '';
      saveHouse(); checkOver(); houseMove(); ctx.render();
    }
    function checkOver() {
      const p = H.pos, o = p.outcome(); if (!o) return false;
      endHouse(o.result, o.termination); return true;
    }
    function endHouse(res, term) {
      if (H.over) return;
      const winner = res === '1-0' ? 'w' : res === '0-1' ? 'b' : null, prof = houseList().find((x) => x.id === H.profile);
      H.over = { result: res, termination: term, winner };
      const out = winner === null ? 'd' : winner === H.me ? 'w' : 'l'; record(H.profile, out);
      msg = (out === 'w' ? 'You beat ' + prof.name + '!' : out === 'l' ? prof.name + ' wins.' : 'A draw with ' + prof.name + '.') + ' ' + res + ' by ' + (TERM[term] || term) + '.';
      tone = out === 'w' ? 'win' : out === 'l' ? 'lose' : '';
      if (out === 'w') ctx.sfx('win'); else if (out === 'l') ctx.sfx('lose');
      saveHouse();
      // the XChess check: replay the whole game with the engine and compare every house move
      const archive = { format: 'xchess-house-archive-v1', engine: engine.api.ENGINE_VERSION, seed: H.seed, profiles: { white: H.me === 'w' ? null : H.profile, black: H.me === 'b' ? null : H.profile }, rules: { replayProtocol: PROTOCOL, eventsProtocol: 'events-v1' }, entries: H.uci.map((mv, i) => ({ mv, sender: (i % 2 === 0) === (H.me === 'w') ? 'player' : 'house:' + H.profile, seq: i, height: null })) };
      H.archive = archive; const game = H;
      ask('verify', [archive]).then((v) => { game.verified = v; if (H === game) refresh(); }).catch((e) => { game.verified = { error: String(e.message || e) }; if (H === game) refresh(); });
      refresh();
    }
    function houseMove() {
      const game = H; if (!game || game.over || game.thinking) return;
      const p = game.pos; if ((p.turn === 0 ? 'w' : 'b') === game.me) return;
      game.thinking = true; const t0 = performance.now(); ctx.render();
      ask('choose', [game.profile, game.uci.slice(), game.seed, START, PROTOCOL]).then((r) => {
        setTimeout(() => {
          if (H !== game) return; game.thinking = false;
          const m = r && r.move ? game.pos.applyUci(r.move) : null;
          if (!m) { msg = 'The house player could not move.'; tone = 'lose'; refresh(); return; }
          game.uci.push(m.uci); game.last = [m.uci.slice(0, 2), m.uci.slice(2, 4)]; hint = null;
          ctx.sfx(m.captured ? 'capture' : 'move'); msg = houseName(game.profile) + ' plays ' + m.san + '.'; tone = '';
          saveHouse(); if (!checkOver()) { if (game.pos.inCheck()) msg += ' Check!'; } refresh();
        }, Math.max(0, 650 + Math.random() * 500 - (performance.now() - t0)));
      }).catch((e) => { game.thinking = false; msg = 'The engine stopped: ' + (e.message || e); tone = 'lose'; refresh(); });
    }
    const houseName = (id) => (houseList().find((x) => x.id === id) || { name: id }).name;

    // ---- moving (your own move, in either kind of game)
    function tryMove(from, to, promoPiece) {
      const p = pos(); if (!p || !myTurn() || rv !== null) return;
      const uci = from + to + (promoPiece || '');
      if (!promoPiece) { const pr = p.movesUci().filter((u) => u.startsWith(from + to)); if (pr.length > 1) { promo = { from, to }; sel = from; refresh(); return; } }
      promo = null; sel = null; targets = []; hint = null;
      if (S) {
        if (busy) return; busy = true; ctx.sfx('move');
        S.send(uci).then((r) => { busy = false; if (r && r.err) { msg = r.err === -4 ? 'The game connection closed.' : 'That move was not accepted.'; tone = 'lose'; } refresh(); });
        msg = 'Sending your move…'; tone = ''; refresh(); return;
      }
      const m = H.pos.applyUci(uci); if (!m) { msg = 'That move is not legal.'; tone = 'lose'; refresh(); return; }
      H.uci.push(m.uci); H.last = [m.uci.slice(0, 2), m.uci.slice(2, 4)]; ctx.sfx(m.captured ? 'capture' : 'move');
      msg = 'You play ' + m.san + '.'; tone = ''; saveHouse();
      if (!checkOver()) houseMove();
      refresh();
    }
    function select(q) {
      const p = pos(), occ = boardMap(p), piece = occ.get(q); sel = q;
      targets = [...new Set(p.movesUci().filter((u) => u.startsWith(q)).map((u) => u.slice(2, 4)))].map((sq) => ({ sq, capture: occ.has(sq) || (piece[1] === 'p' && sq[0] !== q[0]) }));
      ctx.sfx('select');
    }
    const isTarget = (q) => !!q && !!sel && targets.some((t) => t.sq === q);
    const mineAt = (q) => { const p = pos(); if (!q || !p) return false; const c = boardMap(p).get(q); return !!c && c[0] === me(); };
    // What a press means, from what is under it (board.pickAt): the piece you can see there decides (yours: pick it up; one you may
    // capture: take it; an enemy piece you cannot take: the destination behind it, if any). With no piece drawn there, the square
    // decides, then a near miss on a slim piece.
    function resolve(r) {
      const kind = (q) => (!q ? null : isTarget(q) ? 'target' : mineAt(q) ? 'mine' : null);
      // the held piece is lifted, so from a seat its head covers the near part of the square in front: a destination there wins
      if (r.piece && r.piece === sel && isTarget(r.board)) return { kind: 'target', sq: r.board };
      if (r.piece) {
        const k = kind(r.piece); if (k) return { kind: k, sq: r.piece };
        // an enemy piece you cannot take means nothing to tap: it is standing in front of where you aimed, so a destination behind it counts
        if (isTarget(r.board)) return { kind: 'target', sq: r.board };
        if (isTarget(r.near)) return { kind: 'target', sq: r.near };
        return { kind: null, sq: null };
      }
      const kb = kind(r.board); if (kb) return { kind: kb, sq: r.board };
      const kn = kind(r.near); return kn ? { kind: kn, sq: r.near } : { kind: null, sq: null };
    }
    // A tap (or a click): a destination moves the piece you hold there; one of your pieces is picked up, or put down if already held.
    function tapRes(res) {
      const p = pos(); if (!p) return false;
      if (rv !== null) { rvGo(Infinity); return true; }   // looking back: a touch on the board brings you back to the game
      if (!S && showR()) { ctx.toast('You are watching ' + R.wn + ' and ' + R.bn + '.'); return true; }
      if (!myTurn()) { if ((H && H.over) || (S && S.table.g && S.table.g.result)) return true; ctx.toast(H && H.thinking ? houseName(H.profile) + ' is thinking…' : 'Wait for your turn.'); return true; }
      if (res.kind === 'target') { tryMove(sel, res.sq); return true; }
      if (res.kind === 'mine') { if (sel === res.sq) { sel = null; targets = []; } else select(res.sq); } else { sel = null; targets = []; }
      promo = null; refresh(); return true;
    }
    const clickSquare = (q) => tapRes(resolve({ piece: null, board: q, near: null }));

    // ---- the X-Chess view: a flat board over the room (CASINO-CHESS-NEXT-PLAN section 4). Same state, same moves as the 3D board.
    const view2d = () => ctx.focus() === st && !!ctx.tableView && ctx.tableView() === 'xchess';
    let ov = null, g2 = null, ovKey = '';
    function overlay() {
      if (ov) return ov;
      if (!document.getElementById('pxChess2dCss')) { const c = document.createElement('style'); c.id = 'pxChess2dCss'; c.textContent = X2D_CSS; document.head.appendChild(c); }
      let el = document.getElementById('pxc2d');
      if (!el) { el = document.createElement('div'); el.id = 'pxc2d'; el.hidden = true; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'X-Chess board'); el.innerHTML = '<div class="wrap"><div class="pl top"></div><div class="bd" role="grid" aria-label="Chessboard"></div><div class="pl bot"></div><div class="rvbar"></div><div class="say" role="status"></div></div>'; document.body.appendChild(el); }
      ov = { el, bd: el.querySelector('.bd'), top: el.querySelector('.top'), bot: el.querySelector('.bot'), rvb: el.querySelector('.rvbar'), say: el.querySelector('.say'), owner: null, box: '' };
      // buttons (review, promotion) act on whichever chess table owns the view now
      el.addEventListener('click', (e) => { const b = e.target.closest('button[data-a]'); if (!b || b.disabled || !ov.owner) return; e.stopPropagation(); ov.owner.act(b.dataset.a, Object.assign({}, b.dataset)); ctx.render(); });
      const sqAt = (x, y) => { const c = document.elementFromPoint(x, y); const q = c && c.closest && c.closest('#pxc2d .sq'); return q ? q.dataset.sq : null; };
      el.addEventListener('pointerdown', (e) => { if (ov.owner && ov.owner.down2d) ov.owner.down2d(e, sqAt(e.clientX, e.clientY)); });
      el.addEventListener('pointermove', (e) => { if (ov.owner && ov.owner.move2d) ov.owner.move2d(e, sqAt(e.clientX, e.clientY)); });
      el.addEventListener('pointerup', (e) => { if (ov.owner && ov.owner.up2d) ov.owner.up2d(e, sqAt(e.clientX, e.clientY)); });
      el.addEventListener('pointercancel', () => { if (ov.owner && ov.owner.cancel2d) ov.owner.cancel2d(); });
      return ov;
    }
    // where the board goes: the room's space beside the docked controls (a computer), or above the bottom controls (a phone)
    function place2d() {
      const o = overlay(), W = innerWidth, H0 = innerHeight, panel = document.getElementById('panel'), tools = document.getElementById('tools');
      const pr = panel && panel.getClientRects().length ? panel.getBoundingClientRect() : null, top = Math.max(8, tools ? tools.getBoundingClientRect().bottom + 6 : 8);
      let x0 = 0, y0 = top, x1 = W, y1 = H0;
      if (pr && pr.width) { if (pr.left > W * 0.45 && pr.width < W * 0.6) x1 = pr.left - 6; else y1 = Math.min(y1, pr.top - 4); }
      const extra = 2 * 32 + 64, size = Math.max(160, Math.floor(Math.min(x1 - x0 - 16, y1 - y0 - extra - 8) / 8) * 8);
      const box = [x0, y0, x1 - x0, Math.max(120, y1 - y0), size].map(Math.round).join(',');
      if (box !== o.box) { o.box = box; Object.assign(o.el.style, { left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: Math.max(120, y1 - y0) + 'px' }); o.bd.style.width = o.bd.style.height = size + 'px'; o.el.querySelector('.wrap').style.width = size + 'px'; }
    }
    function plHtml(side, name) {
      const p = pos(), g = S && S.table.g, c = S ? S.clocks() : showR() ? watchClocks() : null, over = (H && H.over) || (g && g.result) || (showR() && R.result);
      const turn = p && !over && rv === null ? (p.turn === 0 ? 'w' : 'b') : null;
      return `${c ? `<span class="clk ${turn === side ? 'on' : ''} ${c[side] < 30 ? 'low' : ''}">${clock(c[side])}</span>` : turn === side ? '<span class="turn" aria-label="to move"></span>' : ''}<span>${esc(name)} ${side === 'w' ? '♔' : '♚'}</span>${matHtml(side)}`;
    }
    function names() {
      if (S) { const m = S.myColour(); return { w: m === 'w' ? 'You' : S.oppName, b: m === 'b' ? 'You' : S.oppName }; }
      if (showR()) return { w: R.wn, b: R.bn };
      if (H) { const n = houseName(H.profile); return { w: H.me === 'w' ? 'You' : n, b: H.me === 'b' ? 'You' : n }; }
      return { w: 'White', b: 'Black' };
    }
    function paint2d() {
      const on = view2d();
      if (!on) { if (ov && ov.owner === st) { ov.el.hidden = true; ov.owner = null; g2 = null; } return; }
      const o = overlay(); o.owner = st; o.el.hidden = false; place2d();
      const v = shown(), p = v ? v.p : pos() || (engine.api ? new engine.api.Position(START) : null); if (!p) return;
      const bm = boardMap(p), bottom = me(), files = bottom === 'w' ? 'abcdefgh' : 'hgfedcba', ranks = bottom === 'w' ? '87654321' : '12345678';
      const last = v ? v.last : S ? S.table.g && S.table.g.lastMove : showR() ? R.last : H && H.last, chk = p.inCheck() ? kingSquare(p, p.turn === 0 ? 'w' : 'b') : null;
      const hn = !v && hint && performance.now() < hintUntil ? hint : null, tset = new Map((v ? [] : targets).map((t) => [t.sq, t.capture]));
      let html = '';
      for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
        const sq = files[f] + ranks[r], dk = (f + r) % 2 === 1, code = bm.get(sq), cls = ['sq'];
        if (dk) cls.push('dk'); if (last && (sq === last[0] || sq === last[1])) cls.push('last'); if (!v && sel === sq) cls.push('sel');
        if (hn && (sq === hn[0] || sq === hn[1])) cls.push('hint'); if (chk === sq) cls.push('chk'); if (tset.has(sq)) { cls.push('tg'); if (tset.get(sq)) cls.push('cap'); }
        const label = sq + (code ? ', ' + (code[0] === 'w' ? 'white ' : 'black ') + NAMES[code[1]] : '');
        html += `<div class="${cls.join(' ')}" data-sq="${sq}" role="gridcell" aria-label="${label}">${f === 0 ? `<span class="co r">${ranks[r]}</span>` : ''}${r === 7 ? `<span class="co f">${files[f]}</span>` : ''}${code ? pieceSvg(code) : ''}</div>`;
      }
      if (promo && !v) html += `<div class="promo">${['q', 'r', 'b', 'n'].map((x) => `<button data-a="promo" data-p="${x}" aria-label="Promote to ${NAMES[x]}">${pieceSvg(me() + x)}</button>`).join('')}</div>`;
      const nm = names(), topSide = bottom === 'w' ? 'b' : 'w';
      const key = html + '|' + plHtml(topSide, nm[topSide]) + plHtml(bottom, nm[bottom]) + reviewHtml() + (v ? reviewSay() : msg);
      if (key === ovKey && !g2) return; ovKey = key;
      o.bd.innerHTML = html; o.top.innerHTML = plHtml(topSide, nm[topSide]); o.bot.innerHTML = plHtml(bottom, nm[bottom]);
      o.rvb.innerHTML = reviewHtml(); o.say.textContent = v ? reviewSay() : msg;
      if (g2 && g2.from) { const c = o.bd.querySelector(`[data-sq="${g2.from}"] .pc`); if (c && g2.dragging) c.classList.add('lift'); }
    }
    // pressing on the flat board: the same meaning as on the 3D board (a piece of yours is picked up and can be dragged)
    const down2d = (e, sq) => {
      if (!sq || (e.button || 0) > 0) return; ctx.audio(); e.preventDefault();
      if (rv !== null) { rvGo(Infinity); return; }
      const p = pos(); if (!p) return;
      const has = boardMap(p).has(sq), res = resolve({ piece: has ? sq : null, board: sq, near: null });
      g2 = { id: e.pointerId, x: e.clientX, y: e.clientY, res, from: null, wasSel: sel, dragging: false, ghost: null };
      if (res.kind === 'mine' && myTurn() && !promo) { g2.from = sq; if (sel !== sq) { select(sq); refresh(); } }
      try { ov.el.setPointerCapture(e.pointerId); } catch (_) { }
    };
    const move2d = (e, sq) => {
      if (!g2 || e.pointerId !== g2.id) { if (e.pointerType === 'mouse' && ov) { ov.bd.querySelectorAll('.hov').forEach((x) => x.classList.remove('hov')); if (sq && isTarget(sq)) { const c = ov.bd.querySelector(`[data-sq="${sq}"]`); if (c) c.classList.add('hov'); } } return; }
      if (!g2.dragging) {
        if (!g2.from || Math.hypot(e.clientX - g2.x, e.clientY - g2.y) < 6) return;
        g2.dragging = true; const c = ov.bd.querySelector(`[data-sq="${g2.from}"] .pc`); if (c) c.classList.add('lift');
        const size = ov.bd.getBoundingClientRect().width / 8, gh = document.createElement('div'); gh.className = 'ghost'; gh.style.width = gh.style.height = size + 'px';
        gh.innerHTML = pieceSvg(boardMap(pos()).get(g2.from)); ov.el.appendChild(gh); g2.ghost = gh; g2.size = size;
      }
      g2.ghost.style.left = (e.clientX - g2.size / 2) + 'px'; g2.ghost.style.top = (e.clientY - g2.size / 2) + 'px';
      ov.bd.querySelectorAll('.hov').forEach((x) => x.classList.remove('hov')); if (sq && isTarget(sq)) { const c = ov.bd.querySelector(`[data-sq="${sq}"]`); if (c) c.classList.add('hov'); }
    };
    const up2d = (e, sq) => {
      if (!g2 || e.pointerId !== g2.id) return;
      const g = g2; g2 = null; if (g.ghost) g.ghost.remove(); ovKey = '';
      if (g.dragging) { if (sq && sq !== g.from && isTarget(sq) && myTurn()) tryMove(g.from, sq); else refresh(); return; }
      if (g.from) { if (g.wasSel === g.from) { sel = null; targets = []; } refresh(); return; }
      if (Math.hypot(e.clientX - g.x, e.clientY - g.y) > 12) return;
      tapRes(g.res);
    };
    const cancel2d = () => { if (g2 && g2.ghost) g2.ghost.remove(); g2 = null; ovKey = ''; refresh(); };

    // ---- touch, pen and mouse on the board. Pointer events, not `click`: while walking, the room cancels every touch at its end
    // (so a tap never scrolls the page), and on an iPad that also cancels the click a tap would have made.
    let grab = null, hoverLift = null, lastHandled = 0, aimOn = false;
    const far = (ev, g) => ev.locked ? ev.travel : Math.hypot(ev.clientX - g.x, ev.clientY - g.y);   // how far a press has travelled
    const clampB = (v) => Math.max(-(HALF + SQ * 0.5), Math.min(HALF + SQ * 0.5, v));
    function setCursor(c) { const el = ctx.canvasEl(); if (el && c) el.style.cursor = c; }
    function hoverAt(ev) {
      if (ev.pointerType !== 'mouse' || promo || rv !== null) return;
      const res = resolve(board.pickAt(ctx.ray(ev)));
      let cur = '', lift = null;
      if (myTurn()) { if (res.kind === 'target') cur = 'pointer'; else if (res.kind === 'mine') { cur = 'grab'; lift = res.sq; } }
      if (hoverLift !== lift) { if (hoverLift && hoverLift !== sel) board.lift(hoverLift, 0); hoverLift = lift; if (lift && lift !== sel) board.lift(lift, 0.007); }
      aimOn = !!cur; setCursor(cur);
    }
    const pointer = {
      down(ev) {
        if (ev.button > 0 || grab) return false;
        const r = board.pickAt(ctx.ray(ev)); if (!r.piece && !r.board && !r.near) return false;
        ctx.audio(); lastHandled = performance.now();
        if (rv !== null) { rvGo(Infinity); return true; }
        const res = resolve(r);
        grab = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, res, dragging: false, from: null, wasSel: sel };
        // one of your pieces, on your turn: it is picked up now (its moves show) and follows a drag
        if (res.kind === 'mine' && myTurn() && !promo) { grab.from = res.sq; if (sel !== res.sq) { select(res.sq); refresh(); } }
        return true;
      },
      move(ev) {
        if (!grab || ev.pointerId !== grab.id) { if (!grab) hoverAt(ev); return; }
        if (!grab.dragging) {
          if (!grab.from || far(ev, grab) < 8) return;
          grab.dragging = true; board.held = board.pieces.get(grab.from) || null; setCursor('grabbing');
        }
        const at = board.onBoard(ctx.ray(ev)); if (!at || !board.held) return;
        board.held.position.set(clampB(at.x), 0.03, clampB(at.z));
        board.hover(isTarget(at.sq) ? at.sq : null);
      },
      up(ev) {
        if (!grab || ev.pointerId !== grab.id) return;
        const g = grab; grab = null; board.hover(null); lastHandled = performance.now();
        if (g.dragging) {
          const m = board.held; board.held = null; setCursor('grab');
          const at = board.onBoard(ctx.ray(ev)), to = at && at.sq;
          if (m && to && to !== g.from && isTarget(to) && myTurn()) {
            // set down exactly on the square: it waits there while a move to a player goes out, and is simply there in a house game
            const [x, z] = sqPos(to); m.position.set(x, 0, z); board.parked = { m, until: performance.now() + 4000 };
            tryMove(g.from, to); if (!S) board.parked = null;
          } else board.home();
          refresh(); return;
        }
        if (g.from) { if (g.wasSel === g.from) { sel = null; targets = []; refresh(); } return; }   // picked up on press; tapping it again puts it down
        if (far(ev, g) > 12) return;   // a swipe, not a tap
        tapRes(g.res);
      },
      cancel() { if (!grab) return; grab = null; board.held = null; board.hover(null); board.home(); }
    };

    // ---- watching: the host of a game sends snapshots for the people at the table; everyone else draws them
    function snapshot() {
      const g = S && S.table.g; if (!g) return null;
      const c = S.clocks(), m = packMoves(g.uci);
      const d = { k: 1, w: g.white, b: g.black, on: S.oppName, f: S.table.pos.fen(), l: g.uci.length ? g.uci[g.uci.length - 1] : '', c: [Math.round(c.w), Math.round(c.b)], st: S.stake, sk: S.stake };
      if (g.gid) d.gid = g.gid;               // the room opens the bets on the first snapshot of a game id
      if (m.length <= 900) d.m = m;           // a very long game sends the position only
      if (g.result && RESULT_RE.test(g.result)) { d.r = g.result; d.tm = g.term; }
      if (g.offer) d.of = g.offer;
      return d;
    }
    function specSend(force) {
      if (!S || !S.chain.host || !ctx.roomHas('spec')) return;
      const g = S.table.g; if (!g) return;
      const key = g.uci.length + '|' + (g.result || '') + '|' + (g.offer || ''), now = Date.now();
      if (!force && key === specSent.key && now - specSent.at < SPEC_BEAT) return;
      if (g.result && key === specSent.key && !force) return;   // a finished game is announced once (and to anyone who asks)
      const d = snapshot(); if (!d) return;
      specSent = { key, at: now }; ctx.roomSend({ t: 'spec', tb: def.id, d });
    }
    const onSpec = (m) => {
      if (m.ask) { if (S && S.chain.host && Date.now() - specAnswerAt > 1000) { specAnswerAt = Date.now(); specSend(true); } return; }
      if (S) return;                                       // you are playing at this table: your own copy is the truth
      const d = m.d, E = engine.api;
      if (!E || !d || typeof d !== 'object' || typeof d.f !== 'string' || typeof d.w !== 'string' || typeof d.b !== 'string' || (m.a !== d.w && m.a !== d.b)) return;
      const me0 = ctx.roomMe(); if (me0 && (d.w === me0 || d.b === me0) && lobby.match) return;
      // the moves are replayed with XChess and must reach the position sent; without them, the position alone is shown
      let p = null, uci = null; const moves = d.m !== undefined ? unpackMoves(d.m) : null;
      if (moves) { const q = new E.Position(START, 'legal-en-passant'); if (moves.every((u) => q.applyUci(u)) && q.fen().split(' ').slice(0, 4).join(' ') === d.f.split(' ').slice(0, 4).join(' ')) { p = q; uci = moves; } }
      if (!p) { p = E.Position.tryFrom(d.f, 'legal-en-passant'); if (!p) return; }
      const name = (s) => String(s || '').slice(0, 40), senderIsWhite = m.a === d.w;
      const key = d.w + '|' + d.b, same = R && R.key === key && (!uci || !R.uci || uci.length >= R.uci.length);
      const l = typeof d.l === 'string' && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(d.l) ? [d.l.slice(0, 2), d.l.slice(2, 4)] : null;
      const c = Array.isArray(d.c) && d.c.length === 2 && d.c.every((x) => Number.isFinite(x) && x >= 0 && x < 1e5) ? { w: d.c[0], b: d.c[1] } : null;
      const was = R, gid = typeof d.gid === 'string' && HEX16.test(d.gid) ? d.gid : null;
      R = { key, gid, w: d.w, b: d.b, wn: name(senderIsWhite ? m.n : d.on) || 'White', bn: name(senderIsWhite ? d.on : m.n) || 'Black', pos: p, uci, last: l, clocks: c, rx: Date.now(),
            result: typeof d.r === 'string' && /^(1-0|0-1|1\/2-1\/2)$/.test(d.r) ? d.r : null, term: typeof d.tm === 'string' ? d.tm.slice(0, 24) : null, stake: Number.isSafeInteger(d.st) && d.st > 0 ? d.st : 0, offer: d.of === 'w' || d.of === 'b' ? d.of : null };
      if (!was || was.gid !== R.gid) { B = null; goneInfo = null; askBets(true); }
      if (showR()) { if (!same) { sel = null; targets = []; rv = null; rvNew = false; stopPlay(); board.clear(); } paint(!same); if (was && !was.result && R.result) ctx.sfx('win'); }
      if (ctx.focus() === st) ctx.render();
    };
    const turnOf = (p) => (p.turn === 0 ? 'w' : 'b');
    function watchClocks() {
      if (!R || !R.clocks) return null; const c = { w: R.clocks.w, b: R.clocks.b };
      if (!R.result) { const s = turnOf(R.pos); c[s] = Math.max(0, c[s] - (Date.now() - R.rx) / 1000); }
      return c;
    }
    function specFrame() {
      const now = Date.now();
      if (S) { specSend(false); return; }
      // standing by (or sitting to watch) a table where other people sit: ask the host for the game, unless it is already showing
      const here = ctx.watching() === def.id, taken = ctx.taken().filter((x) => x.split('.')[0] === def.id).length;
      if (!here) hereSince = 0; else if (!hereSince) hereSince = now;
      // the page tells the room which table it is watching about once a second: ask only once that has gone, or the room says "not here"
      if (here && taken && now - hereSince > 1500 && ctx.roomHas('spec') && (!R || now - R.rx > 20000) && now - specAskAt > (R ? 20000 : 6000)) { specAskAt = now; ctx.roomSend({ t: 'spec', tb: def.id, ask: true }); }
      if (R && !liveR()) { const had = showR.was; R = null; if (had) { msg = ''; board.clear(); paint(true); if (ctx.focus() === st) ctx.render(); } }
      showR.was = showR();
      return here;
    }
    // the place to stand when two other people are playing here: beside the table, not in a player's seat (the room never sees it)
    const watchSeat = () => (!S && (liveR() || ctx.taken().filter((x) => x.split('.')[0] === def.id).length >= 2) ? WATCH_SEAT : null);

    // ---- player against player
    lobby.busy = () => !!(H && !H.over && H.uci.length > 0);
    lobby.onStart = (session) => {
      S = session; H = null; R = null; B = null; goneInfo = null; specSent = { key: '', at: 0 }; sel = null; targets = []; promo = null; hint = null; result = null; rv = null; rvNew = false; stopPlay(); board.clear();
      S.onChange = () => { if (S === session) { specSend(false); refresh(); } };
      S.onStall = () => { if (S !== session) return; const win = S.myColour() === 'w' ? '1-0' : '0-1'; msg = 'Your opponent\'s clock has run out by this page\'s count. Waiting for the room…'; tone = ''; sendReport({ r: win, tm: 'timeout' }, true); refresh(); };
      S.onSettle = (net, gm) => {
        const mine = S.myColour(), won = gm.winner === mine, draw = gm.winner === null;
        if (S.roomHeld) {
          // the room holds the stakes and decides: say what this page's copy shows, send it to the room, and wait for cend
          result = { won, draw, term: gm.term, res: gm.result, pending: true };
          msg = (draw ? 'Draw' : won ? 'You win' : S.oppName + ' wins') + ' · ' + gm.result + ' by ' + (TERM[gm.term] || gm.term) + '. Waiting for the room to confirm…'; tone = '';
          sendReport(null, true); return;
        }
        if (S.stake > 0) ctx.setBank(ctx.bank() + (draw ? S.stake : won ? 2 * S.stake : 0));
        result = { won, draw, term: gm.term, res: gm.result };
        msg = (draw ? 'Draw' : won ? 'You win' : S.oppName + ' wins') + ' · ' + gm.result + ' by ' + (TERM[gm.term] || gm.term) + (S.stake > 0 ? (draw ? '. Stakes returned.' : won ? '. You take ' + ctx.money(2 * S.stake) + '.' : '.') : '.');
        tone = draw ? '' : won ? 'win' : 'lose'; ctx.sfx(won ? 'win' : draw ? 'move' : 'lose');
        if (S.stake > 0) ctx.outcome(st, net, S.stake);
      };
      msg = 'Game on against ' + S.oppName + '. Colours are being drawn…'; tone = '';
      paint(true); if (ctx.focus() === st) ctx.render();
    };
    lobby.onEnd = () => { stopReports(); S = null; result = null; goneInfo = null; sel = null; targets = []; rv = null; rvNew = false; stopPlay(); board.clear(); paint(true); msg = ''; if (ctx.focus() === st) ctx.render(); };

    // ---- the room decides (cres): this page reports what its copy of the game says, the room compares the two and answers with cend
    const emit = (m) => ctx.roomSend(Object.assign({ tb: def.id }, m));
    let repTimer = 0, repLast = null, repTries = 0;
    function stopReports() { clearInterval(repTimer); repTimer = 0; repLast = null; repTries = 0; }
    function sendReport(extra, keep) {
      if (!S || !S.roomHeld || !ctx.roomHas('cres')) return; const rp = S.report(); if (!rp) return;
      repLast = Object.assign(rp, extra || {}); emit(Object.assign({ t: 'cres' }, repLast));
      if (keep && !repTimer) { repTries = 0; repTimer = setInterval(() => { if (!S || S.final || ++repTries > 6) { stopReports(); return; } emit(Object.assign({ t: 'cres' }, repLast)); }, 15000); }
    }
    const cleanName = (a) => (S && a === S.opp ? S.oppName : R && a === R.w ? R.wn : R && a === R.b ? R.bn : 'A player');
    function onCend(m) {
      const gid = typeof m.gid === 'string' ? m.gid : null, r = typeof m.r === 'string' ? m.r : '*', how = typeof m.how === 'string' ? m.how : 'void', tm = typeof m.tm === 'string' ? m.tm : '';
      if (!S || (S.gid() && gid && S.gid() !== gid)) {
        // a game this page is not running (it was reloaded, or the room decided while the player was away): say how it ended
        const live0 = live.get(); if (live0 && (!gid || live0.gid === gid)) live.clear(live0.gid);
        if (R && R.gid === gid) { ctx.render(); return; }
        if (how === 'forfeit' && m.a && m.a === ctx.roomMe()) ctx.toast('Your chess game ended while you were away: it counted as a resignation.');
        else if (how === 'forfeit') ctx.toast('Your opponent left your chess game: you win ' + (r === '1-0' ? '1-0' : r === '0-1' ? '0-1' : '') + ' by forfeit.');
        else if (how === 'agreed' || how === 'unchallenged') ctx.toast('Your chess game ended ' + r + '.');
        else ctx.toast('Your chess game was called off and the stakes were returned.');
        return;
      }
      stopReports(); const mine = S.myColour(), winner = r === '1-0' ? 'w' : r === '0-1' ? 'b' : null, off = how === 'disputed' || how === 'expired' || how === 'void' || r === '*';
      const won = !off && winner === mine, draw = !off && winner === null, net = off || draw ? 0 : won ? S.stake : -S.stake, stake = S.stake;
      S.final = { r, tm, how, a: m.a || null }; S.end(off ? '*' : r, off ? how : tm || (how === 'forfeit' ? 'resignation' : 'agreement'));
      result = { won, draw, off, term: tm, res: r };
      const left = how === 'forfeit' && m.a === S.me, they = how === 'forfeit' && m.a && m.a !== S.me;
      if (how === 'disputed') msg = 'The two copies of the game did not match, so the room called it off.' + (stake ? ' Your stake was returned.' : '');
      else if (how === 'expired') msg = 'The room could not confirm a result in time, so the game was called off.' + (stake ? ' Your stake was returned.' : '');
      else if (off) msg = 'The game could not be started by the room' + (stake ? ' (a stake could not be covered), so it was called off and nothing was taken.' : ', so it was called off.');
      else if (left) msg = 'You were away too long, so the game counted as a resignation.' + (stake ? ' ' + S.oppName + ' takes ' + ctx.money(2 * stake) + '.' : '');
      else if (they) msg = S.oppName + ' left the game, so you win by forfeit' + (stake ? '. You take ' + ctx.money(2 * stake) + '.' : '.');
      else msg = (draw ? 'Draw' : won ? 'You win' : S.oppName + ' wins') + ' · ' + r + ' by ' + (TERM[tm] || tm || 'agreement') + (stake > 0 ? (draw ? '. Stakes returned.' : won ? '. You take ' + ctx.money(2 * stake) + '.' : '.') : '.');
      tone = off || draw ? '' : won ? 'win' : 'lose'; ctx.sfx(won ? 'win' : draw ? 'move' : 'lose');
      if (stake > 0 && !off && !draw) ctx.outcome(st, net, stake);          // the look of it only: the room has already paid, through bal
      live.clear(S.gid()); goneInfo = null; refresh();
    }
    function onGone(m) {
      const g = S ? S.gid() : R && R.gid; if (!g || m.gid !== g) return;
      goneInfo = m.back ? null : { a: m.a, until: m.until, at: Date.now() };
      if (!m.back && S && m.a === S.opp) ctx.toast(S.oppName + ' has left the table. If they do not come back in about 90 seconds, you win.');
      if (ctx.focus() === st) ctx.render();
    }
    const SIDE = { w: 'White', b: 'Black' };
    function askBets(first) {
      if (!ctx.roomHas('cbet') || !R || !R.gid) return; const me0 = ctx.roomMe(); if (!me0 || me0 === R.w || me0 === R.b) return;
      const now = Date.now(); if (!first && now - askBetAt < 6000) return; askBetAt = now; emit({ t: 'cbet', gid: R.gid, ask: true });
    }
    const BET_ERR = { closed: 'Bets on this game are closed.', self: 'You cannot bet on a game you are playing.', min: 'The smallest bet is 100 LAYR.', max: 'That is over the largest bet (10,000 LAYR on a game).', full: 'This game already has as many people betting as it can take.', side: 'You have backed the other side in this game.', funds: 'Not enough LAYR for that bet.', off: 'Betting is switched off right now.', 'not-here': 'Stand or sit at this table to bet on its game.', 'too-fast': 'One bet at a time.' };
    function onBet(m) {
      const g = R && R.gid; if (!g || (m.gid && m.gid !== g)) return;
      if (!B || B.gid !== g) B = { gid: g, pool: { w: 0, b: 0 }, n: 0, closes: 0, my: null, closed: false };
      if (m.err) { if (m.err === 'closed') B.closed = true; ctx.toast(BET_ERR[m.err] || 'The room did not take that bet.'); }
      else if (m.ok) { B.my = { side: m.side, amt: m.amt }; ctx.toast('Your bet: ' + ctx.money(m.amt) + ' on ' + SIDE[m.side] + ' (play money).'); }
      if (m.pool && Number.isFinite(m.pool.w) && Number.isFinite(m.pool.b)) B.pool = { w: m.pool.w, b: m.pool.b };
      if (Number.isFinite(m.closes) && m.closes > 0) B.closes = m.closes;
      if (ctx.focus() === st) ctx.render();
    }
    function onPool(m) {
      const g = (S && S.gid()) || (R && R.gid); if (!g || m.gid !== g) return;
      if (!B || B.gid !== g) B = { gid: g, pool: { w: 0, b: 0 }, n: 0, closes: 0, my: null, closed: false };
      if (m.pool && Number.isFinite(m.pool.w) && Number.isFinite(m.pool.b)) B.pool = { w: m.pool.w, b: m.pool.b };
      if (Number.isFinite(m.n)) B.n = m.n; if (Number.isFinite(m.closes) && m.closes > 0) B.closes = m.closes;
      if (ctx.focus() === st) ctx.render();
    }
    function onPay(m) {
      const won = Number.isFinite(m.won) ? m.won : 0, stake = Number.isFinite(m.stake) ? m.stake : 0, side = SIDE[m.side] || '';
      if (won > stake) { ctx.toast('You won ' + ctx.money(won) + ' on ' + side + ' (play money).'); ctx.sfx('win'); }
      else if (won > 0) ctx.toast('Your ' + ctx.money(stake) + ' bet on ' + side + ' was returned.');
      else ctx.toast('You lost ' + ctx.money(stake) + ' on ' + side + ' (play money).');
      B = null; if (ctx.focus() === st) ctx.render();
    }
    // the room's messages about this table's game (PXChess.onRoom hands them over by table)
    const onRoomMsg = (m) => {
      if (m.t === 'cres') {            // the room asks for this page's copy
        if (m.ask && S && S.roomHeld && S.gid() && m.gid === S.gid()) { const rp = S.report(); if (rp) emit(Object.assign({ t: 'cres' }, rp)); }
        return;
      }
      if (m.t === 'cend') return onCend(m);
      if (m.t === 'cgone') return onGone(m);
      if (m.t === 'cbet') return onBet(m);
      if (m.t === 'cpool') return onPool(m);
      if (m.t === 'cpay') return onPay(m);
    };
    // the bets panel for people watching (the two players do not see the buttons)
    function betsView() {
      const none = { html: '', actions: [] };
      if (!ctx.roomHas('cbet') || !R || !R.gid || R.result) return none;
      const me0 = ctx.roomMe(), isPlayer = !!me0 && (me0 === R.w || me0 === R.b), b = B && B.gid === R.gid ? B : null;
      const left = b && b.closes ? (b.closes - (ctx.roomNow ? ctx.roomNow() : Date.now())) / 1000 : null, open = !(b && b.closed) && (left === null || left > 0);
      const pool = b ? b.pool : { w: 0, b: 0 };
      const head = `<div class="row"><span class="who">Bets</span><span class="dim">${open ? (left === null ? 'open' : 'close in ' + clock(left)) : 'closed'} · play money</span></div>`;
      const pools = `<div class="row"><span>White <b>${ctx.money(pool.w)}</b></span><span>Black <b>${ctx.money(pool.b)}</b></span>${b && b.n ? `<span class="dim">· ${b.n} backing</span>` : ''}</div>`;
      if (isPlayer) return { html: open ? '' : `<div class="pxc-bets">${head}${pools}</div>`, actions: [] };
      const mine = b && b.my ? `<div class="who">Your bet: ${ctx.money(b.my.amt)} on ${SIDE[b.my.side]}</div>` : '';
      const amts = [100, 500, 1000, 5000].map((v) => `<button data-a="betamt" data-v="${v}" aria-pressed="${betAmt === v}">${v >= 1000 ? v / 1000 + 'k' : v}</button>`).join('');
      const picker = open ? `<div class="row"><span class="dim">Bet</span><span class="pxc-seg">${amts}</span><span class="dim">LAYR (100 to 10,000)</span></div>` : '';
      const acts = open ? ['w', 'b'].map((sd) => ({ id: 'cbet:' + sd, label: 'Back ' + SIDE[sd] + ' · ' + ctx.money(betAmt), dis: !!(b && b.my && b.my.side !== sd) || ctx.bank() < betAmt })) : [];
      return { html: `<div class="pxc-bets">${head}${pools}${mine}${picker}</div>`, actions: acts };
    }
    // the two players see what is riding on the game once the betting has closed
    function poolsLine() {
      if (!S || !B || B.gid !== S.gid() || !B.closes || (ctx.roomNow ? ctx.roomNow() : Date.now()) < B.closes) return '';
      return `<div class="pxc-bets"><div class="row"><span class="who">Spectator bets</span><span class="dim">closed · play money</span></div><div class="row"><span>White <b>${ctx.money(B.pool.w)}</b></span><span>Black <b>${ctx.money(B.pool.b)}</b></span></div></div>`;
    }
    function goneLine() {
      if (!goneInfo || S && S.final) return '';
      if (S) return goneInfo.a === S.opp ? `<div class="who gone">${esc(S.oppName)} has left the table. If they do not come back in about 90 seconds, you win.</div>` : '';
      if (!R) return ''; const gn = cleanName(goneInfo.a), other = goneInfo.a === R.w ? R.bn : R.wn;
      return `<div class="who gone">${esc(gn)} has left the table. If they do not come back in about 90 seconds, ${esc(other)} wins.</div>`;
    }
    // a game of this browser that was on when the page reloaded: carry on once the room knows who you are again (cres only)
    function tryResume() {
      if (S || H || !engine.api || !lobby.resume || !ctx.roomHas('cres') || Date.now() - resumeTry < 1500) return; resumeTry = Date.now();
      const r = live.get(); if (!r || r.tb !== def.id || ctx.roomMe() !== r.me || !lobby.available()) return;
      if (lobby.resume(r)) ctx.toast('Your chess game against ' + (r.otherName || 'your opponent') + ' is still on. Sit back down at the table to carry on.');
    }

    // ---- the station
    const st = {
      id: def.id, name: def.name, group: g, noStools: true, chipMode: 'none', board, lobby,
      cam: { off: new THREE.Vector3(0, 1.3, 0.8), look: new THREE.Vector3(0, 0.55, -0.04) },
      frameCentre: new THREE.Vector3(0, 0.56, 0),
      rules: { title: 'Chess', steps: ['Play one of the ten XChess house players for free, or a player in the room. Pick a house player and a colour, then Play.', 'Tap one of your pieces, then a glowing square to move it. Castling, en passant and promotion all work; you choose the promotion piece.', 'Checkmate, stalemate, threefold repetition, the fifty-move rule and insufficient material end the game, exactly as in XChess.', 'Against a player: 10 minutes each plus 3 seconds a move. Friendly, or a LAYR stake where the winner takes both. Leaving the room, or going silent for about 90 seconds, counts as resigning: your opponent takes the stakes. A short drop is fine; the game catches up when you come back (sit at the table again). People watching can back a side with play money before the game is 90 seconds old.', 'House moves come from XChess engine inscription #3049 with a seed fixed at the start. After each house game the whole game is replayed with the engine to check every house move.', 'The pieces each side has taken, and +N for the side ahead (pawn 1, knight and bishop 3, rook 5, queen 9), are shown by each name. |◀ ◀ ▶ ▶| (or the arrow keys) look back through the moves; Back to the game returns, and so does touching the board.', 'X-Chess, under View, gives a flat board in the X-Chess style, the easiest way to see the position. Tap or drag the pieces there in the same way; Esc goes back to the room.'] },
      seats: SEATS,
      camFor(seat, view, asp) {
        if (view === 'xchess') view = 'overhead';   // behind the X-Chess view, the room keeps the top-down shot
        const sg = seat && seat.z < 0 ? -1 : 1; let off, lk;
        if (seat && seat.watch && view !== 'overhead') {   // watching: from beside the table, a little above it
          const sx = Math.sign(seat.x) || 1, tallW = asp < 0.9;
          off = new THREE.Vector3(sx * (tallW ? 0.7 : 1.0), tallW ? 1.45 : 1.36, 0.04); lk = new THREE.Vector3(0, 0.55, 0);
          if (view === 'seat') { off.set(sx * 0.8, 1.05, 0.04); lk.set(-sx * 0.05, 0.55, 0); }
          return [off, lk];
        }
        // On a phone held upright the board has to span the screen's width (squares big enough for a fingertip), so the camera comes
        // in steep and close; the bottom sheet's space is handled by the page (frameFit).
        const tall = asp < 0.9, fit = tall ? Math.max(0.5, 0.78 * (0.46 / Math.max(0.3, asp))) * (SQ / 0.05) : 1;
        if (view === 'overhead') { off = new THREE.Vector3(0, tall ? 0.55 + fit * 1.05 : 1.6, 0.06 * sg); lk = new THREE.Vector3(0, 0.55, 0); }
        else if (view === 'seat') { off = new THREE.Vector3(0, 1.2, 1.0 * sg); lk = new THREE.Vector3(0, 0.55, -0.08 * sg); /* eyes a little higher: the far ranks open up */ if (tall) off.sub(lk).multiplyScalar(1 + (0.9 - asp) * 1.15).add(lk); }
        else if (tall) { off = new THREE.Vector3(0, 0.55 + fit * 0.86, fit * 0.5 * sg); lk = new THREE.Vector3(0, 0.55, -0.015 * sg); }
        else { off = new THREE.Vector3(0, 1.38, 0.88 * sg); lk = new THREE.Vector3(0, 0.55, -0.04 * sg); }
        return [off, lk];
      },
      canLeave() { return !(S && S.table.g && !S.table.g.result) && !busy; },
      leaveCash() { },
      held() { return S && !S.settled && !S.roomHeld ? S.stake : 0; },
      pickClick(ev) {
        if (ctx.focus() !== st) return false;
        if (performance.now() - lastHandled < 800) return true;              // the same tap, already handled as a pointer
        const lk = lockedEl(ctx), r = board.pickAt(ctx.ray(lk ? centreEv(lk, ev) : ev)); if (!r.piece && !r.board && !r.near) return false;
        ctx.audio(); return tapRes(resolve(r));
      },
      pointer(kind, ev) { return pointer[kind](ev); },
      holding() { return !!(grab && grab.from); },                 // a piece is in your hand: a drag moves it, not the view
      lookStart() { if (grab && !grab.from) grab = null; },        // the page took the drag to look around: that press is no tap
      aim() { return aimOn; },                                     // the dot (mouse captured) is on something you can pick up or move to
      update(t) {
        board.update(); lobby.frame(ctx.focus() === st); tryResume(); if (R && R.gid && !S) askBets(false);
        if (!grab) board.home();
        if (ctx.focus() === st) {
          const cv = ctx.canvasEl(); if (cv && cv.clientWidth) OUTLINES.forEach((m) => { m.uniforms.res.value.set(cv.clientWidth, cv.clientHeight); m.uniforms.px.value = cv.clientWidth < 700 ? 2.0 : 1.7; });
          const vw = ctx.tableView ? ctx.tableView() : null;
          if (!st.wasFocus) { st.wasFocus = true; st.lastView = null; if (store.get().view === 'xchess' && ctx.setView && vw !== 'xchess') ctx.setView('xchess'); }
          if (vw !== st.lastView) { st.lastView = vw; ovKey = ''; paint2d(); }
          else if (vw === 'xchess') { place2d(); const sec = Math.floor(performance.now() / 1000); if (sec !== st.sec2d) { st.sec2d = sec; if ((S && S.table.g && !S.table.g.result) || (showR() && R.clocks && !R.result) || (hint && performance.now() > hintUntil)) paint2d(); } }
        } else if (st.wasFocus) { st.wasFocus = false; paint2d(); }
        { const lk = ctx.focus() === st && lockedEl(ctx);   // mouse captured: the view turns under the dot, so the dot's piece (or the one in your hand) is followed every frame
          if (lk) { if (grab && grab.dragging) pointer.move(centreEv(lk, { pointerId: grab.id })); else if (!grab) hoverAt(centreEv(lk, null)); } }
        if (ctx.focus() === st) attachPointer(ctx); if (!ctx.ownsTouch) touchMode(ctx.focus() === st ? st : null, st);
        if (engine.api && (t - (st.specT || 0) > 0.5)) {
          st.specT = t; const here = specFrame();
          if (here && !ctx.focus() && showR()) { chipOwner = def.id; specChip('♟ ' + R.wn + ' vs ' + R.bn + (R.result ? ' · ' + R.result : '') + ' · tap the table to watch'); }
          else if (chipOwner === def.id) { chipOwner = null; specChip(null); }
        }
        if (!S && showR() && ctx.focus() === st && R && !R.result) { const sec = Math.floor(performance.now() / 1000); if (sec !== lastSec) { lastSec = sec; ctx.render(); } }
        if (ctx.focus() === st && engine.api) { const was = board.flip; orient(); if (was !== board.flip) paint(true); }
        if (st.sign && !st.signSet) { st.signSet = true; st.sign.position.y = 1.95; st.sign.scale.multiplyScalar(0.75); }
        if (st.sign) st.sign.visible = ctx.focus() !== st;
        if (hint && performance.now() > hintUntil) { hint = null; paint(false); }
        if (S && S.table.g && !S.table.g.result && ctx.focus() === st) { const sec = Math.floor(performance.now() / 1000); if (sec !== lastSec) { lastSec = sec; ctx.render(); } }
      },
      key(k) {
        if (promo && /^[qrbn]$/.test(k)) { tryMove(promo.from, promo.to, k); return true; }
        const n = (movesNow() || []).length, at = rv === null ? n : rv;
        if (n && (k === 'arrowleft' || k === 'arrowright' || k === 'home' || k === 'end')) { stopPlay(); rvGo(k === 'home' ? 0 : k === 'end' ? n : at + (k === 'arrowleft' ? -1 : 1)); return true; }
        return false;
      },
      // Esc: first closes the X-Chess view, then leaves the review, and only then does the page stand you up
      escape() { if (view2d()) { ctx.setView && ctx.setView('table'); return true; } if (rv !== null) { rvGo(Infinity); return true; } return false; },
      extraViews: ['xchess'],
      view() { const v = st.view0(); if (rv !== null && v) { v.msg = reviewSay(); v.tone = ''; } return v; },
      view0() {
        injectCss(); const loaded = !!engine.api; if (!loaded) loadEngine().then(() => { paint(true); if (ctx.focus() === st) ctx.render(); }).catch(() => { });
        const a = []; let game = '';
        const p = pos(), live = (H && !H.over) || (S && S.table.g && !S.table.g.result);
        const moves = p ? p.pgnMoveText() : '';
        const promoHtml = promo ? `<div class="row promo"><span class="dim">Promote to</span>${['q', 'r', 'b', 'n'].map((x) => `<button data-a="promo" data-p="${x}" aria-label="${NAMES[x]}">${GLYPH[me() + x]}</button>`).join('')}</div>` : '';
        if (!S && showR()) {
          const c = watchClocks(), turn = turnOf(R.pos);
          const ck = (s, who) => `${c ? `<span class="clk ${!R.result && turn === s ? 'on' : ''} ${c[s] < 30 ? 'low' : ''}">${clock(c[s])}</span> ` : ''}<span class="who">${esc(who)} ${s === 'w' ? '♔' : '♚'}</span>${matHtml(s)}`;
          const mv = R.uci ? movesHtml() + reviewHtml() : '<div class="moves"><span class="dim">Only the current position is sent for very long games.</span></div>';
          game = `<div class="pxc"><div class="row">${ck('b', R.bn)}</div><div class="row">${ck('w', R.wn)}<span class="dim">· ${R.stake ? ctx.money(R.stake) + ' each' : 'friendly'}</span></div>${mv}${R.offer && !R.result ? `<div class="dim">${esc(R.offer === 'w' ? R.wn : R.bn)} has offered a draw.</div>` : ''}</div>`;
          msg = R.result ? (R.result === '1/2-1/2' ? 'Drawn' : (R.result === '1-0' ? R.wn : R.bn) + ' wins') + ' · ' + R.result + ' by ' + (TERM[R.term] || R.term || 'agreement') + '.' : 'Watching · ' + (turn === 'w' ? R.wn : R.bn) + ' to move' + (R.pos.inCheck() ? ' (check!)' : '') + '.';
          tone = '';
          const bv = betsView(); game = game.replace(/<\/div>$/, goneLine() + bv.html + '</div>'); a.push(...bv.actions);
          return { msg, tone, hint: '', game, actions: a, chips: null, lock: false, canGetLAYR: false };
        }
        if (!S && watchingHere()) {
          return { msg: 'Nobody is playing here now.', tone: '', hint: '', game: '<div class="pxc"><div class="dim">Stand up, then sit down to play.</div></div>', actions: [], chips: null, lock: false, canGetLAYR: false };
        }
        if (S) {
          const gm = S.table.g, c = S.clocks(), mine = S.myColour();
          if (!gm) game = `<div class="pxc"><div class="who">${esc(S.oppName)}${S.stake ? ' · ' + ctx.money(S.stake) + ' each' : ' · friendly'}</div><div class="dim">Setting up the board…</div></div>`;
          else {
            const turn = p.turn === 0 ? 'w' : 'b', theirs = mine === 'w' ? 'b' : 'w';
            const ck = (s, who) => `<span class="clk ${!gm.result && turn === s ? 'on' : ''} ${c[s] < 30 ? 'low' : ''}">${clock(c[s])}</span> <span class="who">${esc(who)} ${s === 'w' ? '♔' : '♚'}</span>${matHtml(s)}`;
            game = `<div class="pxc"><div class="row">${ck(theirs, S.oppName)}</div><div class="row">${ck(mine, 'You')}${S.stake ? `<span class="dim">· ${ctx.money(S.stake)} each</span>` : '<span class="dim">· friendly</span>'}</div>${promoHtml}${movesHtml()}${reviewHtml()}${gm.offer && gm.offer !== mine && !gm.result ? `<div class="who">${esc(S.oppName)} offers a draw.</div>` : ''}${goneLine()}${poolsLine()}</div>`;
            if (!gm.result) {
              if (gm.offer && gm.offer !== mine) a.push({ id: 'drawyes', label: 'Accept draw', kind: 'primary' });
              else a.push({ id: 'drawoffer', label: gm.offer === mine ? 'Draw offered' : 'Offer draw', dis: !!gm.offer || busy });
              a.push({ id: 'resign', label: 'Resign', kind: 'danger', dis: busy });
              if (!msg || /^Game on|^Sending/.test(msg) && !busy) { msg = turn === mine ? 'Your move' + (p.inCheck() ? ' (check!)' : '') + '.' : S.oppName + ' to move.'; tone = ''; }
            } else a.push({ id: 'pvpdone', label: 'Back to the board', kind: 'primary', key: 'n' });
          }
        } else if (H) {
          const prof = houseList().find((x) => x.id === H.profile), turn = p.turn === 0 ? 'w' : 'b';
          const v = H.verified;
          const ver = !H.over ? '' : !v ? '<div class="ver">Checking the house moves against XChess engine #3049…</div>' : v.error ? `<div class="ver bad">The XChess check could not run (${esc(v.error)}).</div>` : v.engineCompliant ? `<div class="ver">✓ XChess check: every move ${esc(prof.name)} made (${H.uci.filter((_, i) => (i % 2 === 0) !== (H.me === 'w')).length}) matches engine #3049 for this game's seed.</div>` : `<div class="ver bad">✗ XChess check: ${v.deviations.length} house move(s) differ from engine #3049.</div>`;
          const them = H.me === 'w' ? 'b' : 'w';
          game = `<div class="pxc"><div class="row"><span class="who">${esc(prof.name)} ${H.me === 'w' ? '♚' : '♔'}</span>${matHtml(them)}<span class="dim">${stars(prof.stars)} · ${esc(prof.description)}</span></div><div class="row"><span class="who">You ${H.me === 'w' ? '♔' : '♚'}</span>${matHtml(H.me)}${H.thinking ? '<span class="dim">· ' + esc(prof.name) + ' is thinking…</span>' : ''}</div>${promoHtml}${movesHtml()}${reviewHtml()}${ver}</div>`;
          if (!H.over) {
            a.push({ id: 'hint', label: 'Hint', key: 'h', dis: !myTurn() });
            a.push({ id: 'resign', label: 'Resign', kind: 'danger' });
            if (!msg) msg = turn === H.me ? 'Your move.' : prof.name + ' to move.';
          } else { a.push({ id: 'again', label: 'Rematch ' + prof.name, kind: 'primary', key: 'n' }, { id: 'newgame', label: 'Choose a player' }, { id: 'pgn', label: 'Copy game' }); }
        } else {
          // the start screen: choose a house player and a colour, or find a player in the room
          const sts = stats();
          const list = houseList().map((x) => { const r = sts[x.id]; return `<button data-a="house" data-p="${x.id}" aria-pressed="${pick.profile === x.id}">${stars(x.stars)} ${esc(x.name)}<small>${esc(x.description)}${r ? ` · W${r.w} D${r.d} L${r.l}` : ''}</small></button>`; }).join('');
          const seg = [['w', 'White'], ['b', 'Black'], ['r', 'Random']].map(([k, l]) => `<button data-a="colour" data-c="${k}" aria-pressed="${pick.colour === k}">${l}</button>`).join('');
          let pvp = '';
          if (lobby.available()) {
            const wait = lobby.waiting();
            wait.slice(0, 3).forEach((w) => a.push({ id: 'join:' + w.a, label: `Play ${w.n} · ${w.stake ? ctx.money(w.stake) : 'friendly'}`, kind: 'primary', dis: ctx.bank() < w.stake || !!lobby.pendingJoin }));
            if (lobby.seeking) { a.push({ id: 'stopseek', label: 'Stop waiting' }); pvp = `<div class="dim">Waiting for a player (${lobby.seeking.stake ? ctx.money(lobby.seeking.stake) + ' each' : 'friendly'}). Everyone in the room can see the board is open.</div>`; }
            else {
              const stakes = PVP_STAKES.map((s) => `<button data-a="stake" data-s="${s}" aria-pressed="${pick.stake === s}">${s ? ctx.money(s) : 'Friendly'}</button>`).join('');
              pvp = `<div class="row"><span class="dim">Against a player:</span><span class="pxc-seg">${stakes}</span></div>${wait.length ? `<div class="who">${wait.length === 1 ? esc(wait[0].n) + ' is' : wait.length + ' players are'} waiting for a game here.</div>` : ''}`;
              a.push({ id: 'seek', label: 'Find a player', dis: ctx.bank() < pick.stake });
            }
          } else pvp = '<div class="dim">Sign in with a wallet to play other people in the room.</div>';
          game = `<div class="pxc"><div class="pxc-house" role="group" aria-label="House players">${list}</div><div class="row"><span class="dim">You play</span><span class="pxc-seg">${seg}</span></div>${pvp}<div class="dim">Engine: XChess #3049${engine.api ? (engine.verified ? ' · verified' : '') : ' · loading…'}</div></div>`;
          a.unshift({ id: 'play', label: 'Play ' + houseName(pick.profile), kind: 'primary', key: 'p', dis: !loaded });
          if (!msg) msg = 'Chess at the lounge · powered by XChess.';
        }
        return { msg, tone, hint: '', game, actions: a, chips: null, lock: busy, canGetLAYR: false };
      },
      async act(id, d) {
        d = d || {}; ctx.audio();
        if (id === 'house') { pick.profile = d.p; msg = ''; saveHouse(); return; }
        if (id === 'colour') { pick.colour = d.c; saveHouse(); return; }
        if (id === 'stake') { pick.stake = +d.s || 0; return; }
        if (id === 'play' || id === 'again') { if (id === 'again') pick.profile = H.profile; msg = ''; await startHouse(); return; }
        if (id === 'newgame') { H = null; result = null; msg = ''; rv = null; rvNew = false; stopPlay(); board.clear(); paint(true); saveHouse(); return; }
        if (id === 'promo' && promo) { tryMove(promo.from, promo.to, d.p); return; }
        if (id === 'betamt') { betAmt = [100, 500, 1000, 5000].includes(+d.v) ? +d.v : 100; return; }
        if (id === 'cbet:w' || id === 'cbet:b') { if (!R || !R.gid || !ctx.roomHas('cbet')) return; if (ctx.bank() < betAmt) { ctx.toast('Not enough LAYR for that bet.'); return; } emit({ t: 'cbet', gid: R.gid, side: id.slice(5), amt: betAmt }); return; }
        if (id === 'rv') { stopPlay(); rvGo(+d.to); return; }
        if (id === 'rvlive') { rvGo(Infinity); return; }
        if (id === 'rvplay') {
          if (rvTimer) { stopPlay(); return; }
          const n = (movesNow() || []).length; if (rv === null || rv >= n) rvGo(0);
          rvTimer = setInterval(() => { const n2 = (movesNow() || []).length; if (rv === null || rv + 1 >= n2) { stopPlay(); rvGo(n2); } else rvGo(rv + 1); }, 1000); refresh(); return;
        }
        if (id === 'hint' && H && myTurn()) {
          msg = 'Thinking about a hint…'; const game = H;
          try { const r = await ask('choose', ['canon', H.uci.slice(), 'hint:' + H.seed + ':' + H.uci.length, START, PROTOCOL]); if (H === game && r.move) { hint = [r.move.slice(0, 2), r.move.slice(2, 4)]; hintUntil = performance.now() + 5000; msg = 'Canon would play ' + r.move.slice(0, 2) + '–' + r.move.slice(2, 4) + '.'; paint(false); } } catch (_) { msg = 'No hint right now.'; }
          return;
        }
        if (id === 'resign') {
          if (S) { busy = true; S.send('resgn').then(() => { busy = false; refresh(); }); return; }
          if (H && !H.over) endHouse(H.me === 'w' ? '0-1' : '1-0', 'resignation'); return;
        }
        if (id === 'drawoffer' && S) { busy = true; S.send('draw?').then(() => { busy = false; refresh(); }); msg = 'Draw offered.'; return; }
        if (id === 'drawyes' && S) { busy = true; S.send('draw!').then(() => { busy = false; refresh(); }); return; }
        if (id === 'pvpdone') { lobby.finish(); return; }
        if (id === 'pgn') { const p = pos(); const txt = `[Event "ParallaX Casino"]\n[Site "xtrata.xyz/casino"]\n[White "${H.me === 'w' ? 'You' : houseName(H.profile) + ' (XChess)'}"]\n[Black "${H.me === 'b' ? 'You' : houseName(H.profile) + ' (XChess)'}"]\n[Result "${H.over ? H.over.result : '*'}"]\n[XChessEngine "#3049 ${engine.api.ENGINE_VERSION}"]\n[XChessSeed "${H.seed}"]\n\n${p.pgnMoveText()} ${H.over ? H.over.result : '*'}\n`; try { await navigator.clipboard.writeText(txt); ctx.toast('Game copied (PGN).'); } catch (_) { ctx.toast('Copy is not available here.'); } return; }
        if (id === 'seek') { if (ctx.bank() < pick.stake) { ctx.toast('Not enough LAYR for that stake.'); return; } try { await loadEngine(); } catch (_) { ctx.toast('The XChess engine is not available.'); return; } lobby.seek(pick.stake); return; }
        if (id === 'stopseek') { lobby.stopSeek(); return; }
        if (id.startsWith('join:')) { const w = lobby.waiting().find((x) => x.a === id.slice(5)); try { await loadEngine(); } catch (_) { ctx.toast('The XChess engine is not available.'); return; } if (w) lobby.join(w.a, w.stake); return; }
      }
    };
    // a house game left unfinished in this browser carries on where it was
    const resume = saved.games && saved.games[def.id];
    loadEngine().then(() => { if (resume && !H && !S) startHouse(resume); else paint(true); }).catch(() => { });
    st.onSpec = onSpec; st.onRoom = onRoomMsg; st.watchSeat = watchSeat;
    Object.assign(st, { down2d, move2d, up2d, cancel2d });
    // the page says when you choose a view: the X-Chess view opens or closes at once, and the choice is remembered in this browser
    st.onView = (v) => { const sv = store.get(); sv.view = v === 'xchess' ? 'xchess' : '3d'; store.set(sv); st.lastView = v; ovKey = ''; paint2d(); };   // the X-Chess view's board hands its presses to the table that owns it
    // for tests and bug reports (scripts/test-casino-chess.mjs): what the table holds now
    st.debug = () => { const p = pos(), g = S && S.table.g; return { rv, rvNew, view2d: view2d(), mat: matOf(), mode: S ? 'pvp' : showR() ? 'watch' : H ? 'house' : 'idle', sel, targets: targets.map((t) => t.sq), watch: R ? { wn: R.wn, bn: R.bn, moves: R.uci ? R.uci.length : null, result: R.result, clocks: watchClocks(), seat: watchingHere() } : null, fen: p ? p.fen() : null, uci: H ? H.uci.slice() : g ? g.uci.slice() : [], me: p ? me() : null, over: H ? H.over : g && g.result ? { result: g.result, termination: g.term } : null, verified: H ? H.verified : null, thinking: !!(H && H.thinking), legal: p ? p.movesUci() : [], flip: board.flip, seed: H ? H.seed : null, clocks: S ? S.clocks() : null, stake: S ? S.stake : 0, host: S ? !!S.chain.host : null, gid: S ? S.gid() : R ? R.gid : null, roomHeld: S ? S.roomHeld : null, final: S ? S.final : null, bets: B ? { pool: B.pool, my: B.my, closes: B.closes, closed: B.closed, n: B.n } : null, gone: goneInfo, msg }; };
    st.debugMove = (mv) => (S ? S.send(mv) : null); st.debugSession = () => S; st.debugCall = (m) => onRoomMsg(m);   // tests: play a move without the mouse, reach the session
    st.debugPick = (x, y) => { const r = board.pickAt(ctx.ray({ clientX: x, clientY: y })); return { ...r, res: resolve(r), myTurn: myTurn(), sel }; };
    st.squareFromPoint = (x, y) => board.pick(ctx.ray({ clientX: x, clientY: y }));
    st.squareAt = (sq) => { const [x, z] = sqPos(sq); return board.root.localToWorld(new THREE.Vector3(x, 0.017, z)); };
    st.houseShown = (where) => !!(H && !H.over) && !showR() && !watchingHere() && ctx.focus() === st && (where === 'chair') === mySeatIsSofa();
    return st;
  }

  // ======================================================================= what the page calls
  const placement = {}, TAGS = {}, SEATS_OUT = {}, VERB = {};
  SOFAS.forEach((s) => {
    const x = s.x + Math.sin(s.ry) * TABLE_Z, z = s.z + Math.cos(s.ry) * TABLE_Z;
    placement[s.id] = [x, z, s.ry + Math.PI];
    TAGS[s.id] = ['CHESS', 'powered by XChess'];
    SEATS_OUT[s.id] = [{ x: 0, z: SOFA_SEAT.z, h: SOFA_SEAT.h, stand: { x: s.side * 1.95, z: 1.05 } }, { x: 0, z: CHAIR_SEAT.z, h: CHAIR_SEAT.h, stand: { x: s.side * 0.95, z: -0.8 } }];
    VERB[s.id] = 'PLAY';
  });
  let built = [], lastCtx = null;
  root.PXChess = {
    version: 'c7', ENGINE_ID, ENGINE_SHA256, TABLE_Z, TABLE_R, START,
    sofas: SOFAS.map((d) => [d.x, d.z, d.ry]),   // where the page draws the two lounge sofas
    placement, TAGS, SEATS: SEATS_OUT, VERB, engine, loadEngine, ask, houseList, makeRelayTable, makeSession, makeChain, hash16,
    roomSettles() { return !!(lastCtx && lastCtx.roomHas('cres')); },     // the room holds chess stakes and decides results (the page skips its own bank for chess)
    makeStations(ctx) {
      // the station's seats must be the very objects in the page's SEATS (the room maps a seat to its spot by identity)
      // the room hooks are optional: a page without them simply never shows other people's games
      ctx = Object.assign({ roomSend: () => { }, roomHas: () => false, roomMe: () => null, roomNow: () => Date.now(), watching: () => null, taken: () => [], canvasEl: () => document.getElementById('gl') }, ctx); lastCtx = ctx;
      built = SOFAS.map((def) => { const st = makeStation(ctx, def); return st; });
      built.forEach((st) => { SEATS_OUT[st.id] = st.seats; });
      return built;
    },
    // the house player across the table, while you play one (only on your own page)
    addHosts(hosts) {
      built.forEach((st, i) => {
        const def = SOFAS[i], wear = { shirt: 0x14141c, trousers: 0x191b20 };
        hosts.add({ group: st.group, x: 0, z: CHAIR_SEAT.z, yaw: 0, person: def.person, wear, seat: { h: CHAIR_SEAT.h }, noLook: false, showWhen: () => st.houseShown('chair') });
        hosts.add({ group: st.group, x: 0, z: SOFA_SEAT.z, yaw: Math.PI, person: def.person, wear, seat: { h: SOFA_SEAT.h }, showWhen: () => st.houseShown('sofa') });
      });
    },
    // a `spec` message from the room (watching a game): to the table it names
    onSpec(m) { const st = built.find((s) => s.id === (m && m.tb)); if (st && st.onSpec) try { st.onSpec(m); } catch (e) { console.warn('[chess] a snapshot failed', e); } },
    // the room's messages about a game (cres ask, cend, cgone, cbet, cpool, cpay, and the refusals cres-* / cbet-*): to the table they name
    onRoom(m) {
      if (!m) return;
      if (m.t === 'err') { const T = { 'cbet-too-fast': 'One bet at a time.', 'cbet-bad': 'The room did not understand that bet.', 'cres-too-fast': '' }; if (lastCtx && /^c(bet|res)-/.test(m.code || '') && T[m.code] !== '') lastCtx.toast(T[m.code] || 'The room refused that (' + String(m.code).slice(0, 24) + ').'); return; }
      const st = built.find((x) => x.id === m.tb); if (st && st.onRoom) try { st.onRoom(m); } catch (e) { console.warn('[chess] a room message failed', e); }
    },
    packMoves, unpackMoves, material,
    input: () => ({ pointerOn, touch: !!touchOwner }),   // for tests
    stations: () => built
  };
})(window);
