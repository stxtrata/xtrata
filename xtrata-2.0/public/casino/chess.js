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
  const TABLE_Z = 1.25, TABLE_R = 0.5;          // the coffee table, in front of each sofa (sofa-local z), and its radius
  const SOFAS = [{ id: 'chess1', name: 'Chess · west lounge', x: -8.1, z: 8.1, ry: 0.25, side: -1, person: 'f2' },
                 { id: 'chess2', name: 'Chess · east lounge', x: 8.1, z: 8.1, ry: -0.25, side: 1, person: 'm2' }];
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

  // ======================================================================= the relay table (player against player)
  // Run by both browsers on their own copy: the host applies calls in its blocks, the guest replays the same blocks. Every rule is
  // XChess's Position; this only adds seats, clocks (from block time, in seconds) and the XChess game events resgn, draw? and draw!.
  function makeRelayTable(E) {
    const T = { g: null, pos: null };
    const side = (who) => (!T.g ? null : who === T.g.white ? 'w' : who === T.g.black ? 'b' : null);
    const turn = () => (T.pos.turn === 0 ? 'w' : 'b');
    const end = (result, term) => { T.g.result = result; T.g.term = term; T.g.winner = result === '1-0' ? 'w' : result === '0-1' ? 'b' : null; };
    const flagFell = (ctx) => { const g = T.g, s = turn(); if (ctx.time - g.last <= g.clock[s]) return false; g.clock[s] = 0; end(s === 'w' ? '0-1' : '1-0', 'timeout'); return true; };
    const int = (v, lo, hi, d) => (Number.isSafeInteger(v) && v >= lo && v <= hi ? v : d);
    T.create = (ctx, who, o) => {
      if (T.g || !o || typeof o.white !== 'string' || typeof o.black !== 'string' || o.white === o.black || (who !== o.white && who !== o.black)) return { err: 1 };
      const base = int(o.base, 60, 3600, PVP_BASE), inc = int(o.inc, 0, 30, PVP_INC);
      T.pos = new E.Position(START, 'legal-en-passant');
      T.g = { white: o.white, black: o.black, stake: int(o.stake, 0, 1e9, 0), base, inc, clock: { w: base, b: base }, last: ctx.time, seenAt: Date.now(), uci: [], san: [], offer: null, result: null, term: null, winner: null, lastMove: null };
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
    return T;
  }
  // A player-against-player game on a relay chain (PvpCore.makeRelayChain), shaped like the Salon's sessions for the lobby.
  function makeSession(chain, opts) {
    if (!engine.api) throw new Error('The XChess engine is not loaded yet.');
    const T = makeRelayTable(engine.api); chain.table = T;
    const S = { kind: 'chess', chain, table: T, me: opts.me, opp: opts.opp, oppName: opts.oppName || 'Opponent', stake: opts.buyin || opts.stake || 0, settled: false, claiming: 0, onSettle: null, onChange: null };
    S.open = () => {
      const white = crypto.getRandomValues(new Uint8Array(1))[0] & 1 ? S.me : S.opp;
      return chain.call('create', 'create', [S.me, { white, black: white === S.me ? S.opp : S.me, stake: S.stake, base: PVP_BASE, inc: PVP_INC }]);
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
    S.dispose = () => { };
    chain.listeners.push(() => {
      const g = T.g;
      if (g && g.result && !S.settled) {
        S.settled = true;
        const mine = S.myColour(), net = g.winner === null ? 0 : g.winner === mine ? S.stake : -S.stake;
        if (S.onSettle) try { S.onSettle(net, g); } catch (e) { console.error(e); }
      }
      // the host calls the flag: the side to move has run out of time
      if (chain.host && g && !g.result && Date.now() > S.claiming) {
        const s = T.pos.turn === 0 ? 'w' : 'b';
        if (chain.ctx().time - g.last > g.clock[s]) { S.claiming = Date.now() + 4000; chain.call('claim', 'claimTimeout', [S.me]); }
      }
      if (S.onChange) try { S.onChange(); } catch (e) { console.error(e); }
    });
    return S;
  }

  // ======================================================================= 3D: board and pieces
  const SQ = 0.05, BOARD_Y = 0.541, HALF = SQ * 4;
  const sqName = (f, r) => 'abcdefgh'[f] + (r + 1);
  const sqFR = (s) => [s.charCodeAt(0) - 97, s.charCodeAt(1) - 49];
  const sqPos = (s) => { const [f, r] = sqFR(s); return [(f - 3.5) * SQ, (3.5 - r) * SQ]; };     // board-local, white at +z
  function profiles(THREE) {
    const base = [[0, 0], [0.37, 0], [0.37, 0.05], [0.33, 0.08], [0.34, 0.11], [0.27, 0.15]];
    const P = {
      p: [[0.2, 0.19], [0.14, 0.3], [0.11, 0.45], [0.17, 0.48], [0.17, 0.51], [0.1, 0.54], [0.16, 0.6], [0.18, 0.67], [0.16, 0.75], [0.1, 0.81], [0, 0.83]],
      r: [[0.25, 0.2], [0.22, 0.3], [0.2, 0.72], [0.26, 0.76], [0.27, 0.93], [0.2, 0.93], [0.2, 0.86], [0, 0.86]],
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
    geo.crossV = new THREE.BoxGeometry(0.07 * SQ, 0.26 * SQ, 0.07 * SQ); geo.crossH = new THREE.BoxGeometry(0.2 * SQ, 0.07 * SQ, 0.07 * SQ);
    geo.band = new THREE.TorusGeometry(0.3 * SQ, 0.028 * SQ, 6, 22); geo.band.rotateX(Math.PI / 2);
    return geo;
  }
  function boardTexture(THREE) {
    const N = 1024, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d');
    const m = Math.round(N * (0.025 / (SQ * 8 + 0.05))), s = (N - 2 * m) / 8;
    g.fillStyle = '#081627'; g.fillRect(0, 0, N, N);
    g.strokeStyle = '#d4a83a'; g.lineWidth = 6; g.strokeRect(8, 8, N - 16, N - 16); g.lineWidth = 3; g.strokeRect(m - 6, m - 6, N - 2 * m + 12, N - 2 * m + 12);
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
      const light = (r + f) % 2 === 1, x = m + f * s, y = m + (7 - r) * s;
      g.fillStyle = light ? '#e8dec6' : '#16385e'; g.fillRect(x, y, s, s);
      g.fillStyle = light ? 'rgba(120,100,70,.06)' : 'rgba(150,190,255,.05)';
      for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x, y + Math.random() * s); g.bezierCurveTo(x + s * 0.3, y + Math.random() * s, x + s * 0.7, y + Math.random() * s, x + s, y + Math.random() * s); g.lineWidth = 1 + Math.random() * 2; g.strokeStyle = g.fillStyle; g.stroke(); }
    }
    g.fillStyle = '#d9b26a'; g.font = '600 ' + Math.round(m * 0.55) + 'px Georgia,serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 0; i < 8; i++) { g.fillText('abcdefgh'[i], m + (i + 0.5) * s, N - m / 2); g.fillText(String(i + 1), m / 2, m + (7 - i + 0.5) * s); }
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
    return t;
  }
  let GEO = null;
  function makeBoard(ctx, parent) {
    const { THREE } = ctx; GEO = GEO || profiles(THREE);
    const root = new THREE.Group(); root.position.y = BOARD_Y; parent.add(root);
    const gold = ctx.GOLDM(), W = SQ * 8 + 0.05;
    ctx.box(W + 0.012, 0.016, W + 0.012, gold, 0, 0.008, 0, root);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(W, W), new THREE.MeshStandardMaterial({ map: boardTexture(THREE), roughness: 0.32, metalness: 0.08, envMap: ctx.envTex ? ctx.envTex() : null, envMapIntensity: 0.35 }));
    top.rotation.x = -Math.PI / 2; top.position.y = 0.0165; top.name = 'chess board'; root.add(top);
    const mats = { w: ctx.M(0xeee2c4, { roughness: 0.3, metalness: 0.06 }), b: ctx.M(0x15171e, { roughness: 0.2, metalness: 0.42 }) };
    const pieceRoot = new THREE.Group(); pieceRoot.position.y = 0.0165; root.add(pieceRoot);
    // highlights: a small pool of flat squares and dots just above the board
    const hl = new THREE.Group(); hl.position.y = 0.0175; root.add(hl);
    const flat = (color, op, size) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(size || SQ * 0.96, size || SQ * 0.96), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.visible = false; m.userData.noShadow = true; hl.add(m); return m; };
    const ring = (color, op, r0, r1) => { const m = new THREE.Mesh(new THREE.RingGeometry(r0, r1, 28), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.visible = false; hl.add(m); return m; };
    const H = { last: [flat(0xd4a83a, 0.34), flat(0xd4a83a, 0.34)], sel: flat(0xff9a3c, 0.6), check: flat(0xff2b2b, 0.5), hint: [flat(0x3dff9a, 0.45), flat(0x3dff9a, 0.45)], dots: [], caps: [] };
    for (let i = 0; i < 28; i++) { H.dots.push(ring(0x5ec8ff, 0.95, 0, SQ * 0.16)); H.caps.push(ring(0xff7a3d, 0.9, SQ * 0.36, SQ * 0.46)); }
    const place = (m, s) => { const [x, z] = sqPos(s); m.position.set(x, 0, z); m.visible = true; };

    const B = { root, top, pieces: new Map(), captured: { w: [], b: [] }, tweens: [], flip: false, checkSq: null };
    function makePiece(type, colour) {
      const g = new THREE.Group(), mat = mats[colour];
      const body = new THREE.Mesh(GEO[type], mat); body.castShadow = true; g.add(body);
      const band = new THREE.Mesh(GEO.band, gold); band.position.y = 0.15 * SQ; g.add(band);
      if (type === 'n') { const h = new THREE.Mesh(GEO.head, mat); h.castShadow = true; h.rotation.y = colour === 'w' ? -Math.PI / 2 + 0.6 : Math.PI / 2 - 0.6; /* three-quarters on, so the head reads from your seat */ g.add(h); }
      if (type === 'k') { const v = new THREE.Mesh(GEO.crossV, gold), h = new THREE.Mesh(GEO.crossH, gold); v.position.y = 1.42 * SQ; h.position.y = 1.44 * SQ; g.add(v, h); }
      g.userData = { type, colour }; pieceRoot.add(g); return g;
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
    B.marks = ({ last, sel, targets, check, hint }) => {
      H.last.forEach((m, i) => (last ? place(m, last[i]) : (m.visible = false)));
      if (sel) place(H.sel, sel); else H.sel.visible = false;
      for (const [s2, m] of B.pieces) { const up = s2 === sel ? 0.012 : 0; if (Math.abs(m.position.y - up) > 1e-4 && !B.tweens.some((t) => t.obj === m)) m.position.y = up; }
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
  function specChip(text) {
    if (!chip) { chip = document.createElement('div'); chip.id = 'pxChessWatch'; chip.setAttribute('role', 'status'); chip.style.cssText = 'position:fixed;left:50%;top:calc(' + (innerWidth < 600 ? 150 : 102) + 'px + env(safe-area-inset-top));transform:translateX(-50%);z-index:30;max-width:calc(100vw - 32px);padding:7px 14px;border-radius:999px;background:rgba(8,18,32,.88);border:1px solid rgba(212,168,58,.55);color:#f1e3b8;font:600 13px Georgia,serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;display:none'; document.body.appendChild(chip); }
    chip.style.display = text ? 'block' : 'none'; if (text && chip.textContent !== text) chip.textContent = text;
  }
  const GLYPH = { wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙', bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟' };

  // ======================================================================= the stations
  function makeStation(ctx, def) {
    const { THREE } = ctx;
    const g = new THREE.Group(); g.name = def.id;
    const board = makeBoard(ctx, g);
    makeArmchair(ctx, g, -0.97);
    const SEATS = [{ x: 0, z: 1.2, sofa: true, stand: { x: def.side * 1.95, z: 0.9 } }, { x: 0, z: -0.97, stand: { x: def.side * 0.95, z: -0.8 } }];
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
    const watchingHere = () => ctx.focus() === st && !!(ctx.seat() && ctx.seat().watch);
    const liveR = () => !!R && Date.now() - R.rx < (R.result ? SPEC_AFTER : SPEC_FRESH);
    // what the board shows: your own game against a player, else a game you are watching, else your house game
    const showR = () => !S && liveR() && !(H && ctx.focus() === st && !watchingHere());
    const me = () => (S ? S.myColour() : showR() ? 'w' : H ? H.me : 'w');
    const pos = () => (S && S.table.pos ? S.table.pos : showR() ? R.pos : H ? H.pos : null);
    const mySeatIsSofa = () => { const s = ctx.seat(); return !s || s.z > 0 || ctx.focus() !== st; };
    const stats = () => store.get().stats || {};
    function record(profile, outcome) { const v = store.get(); v.stats = v.stats || {}; const r = v.stats[profile] = v.stats[profile] || { w: 0, d: 0, l: 0 }; r[outcome]++; store.set(v); }
    function saveHouse() { const v = store.get(); v.profile = pick.profile; v.colour = pick.colour; v.games = v.games || {}; v.games[def.id] = H && !H.over ? { profile: H.profile, me: H.me, seed: H.seed, uci: H.uci } : null; store.set(v); }

    // ---- what the board shows
    function orient() { const flip = (me() === 'w') !== mySeatIsSofa(); if (flip !== board.flip) board.setFlip(flip); }
    function paint(instant) {
      orient(); const p = pos();
      if (!p) { if (engine.api) board.sync(boardMap(new (engine.api.Position)(START)), instant); board.marks({}); return; }
      const lm = S ? S.table.g && S.table.g.lastMove : showR() ? R.last : H && H.last;
      const bm = boardMap(p); board.sync(bm, instant, lm); if (instant) board.rebuildTrays(bm);
      const check = p.inCheck() ? kingSquare(p, p.turn === 0 ? 'w' : 'b') : null;
      board.marks({ last: lm, sel, targets, check, hint: hint && performance.now() < hintUntil ? hint : null });
    }
    const myTurn = () => { const p = pos(); if (!p || (!S && showR())) return false; if (S) return !!S.table.g && !S.table.g.result && (p.turn === 0 ? 'w' : 'b') === me(); return !!H && !H.over && !H.thinking && (p.turn === 0 ? 'w' : 'b') === H.me; };
    function refresh() { paint(false); if (ctx.focus() === st) ctx.render(); }

    // ---- house games
    async function startHouse(resume) {
      try { await loadEngine(); } catch (e) { msg = engine.error; tone = 'lose'; refresh(); return; }
      const E = engine.api;
      const r = resume || { profile: pick.profile, me: pick.colour === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : pick.colour, seed: 'parallax-casino:' + def.id + ':' + rand(16), uci: [] };
      const p = new E.Position(START, 'legal-en-passant'); let last = null;
      for (const u of r.uci) { const m = p.applyUci(u); if (!m) break; last = [m.uci.slice(0, 2), m.uci.slice(2, 4)]; }
      H = { profile: r.profile, me: r.me, seed: r.seed, uci: r.uci.slice(0, p.history().length), pos: p, last, over: null, verified: null, thinking: false };
      sel = null; targets = []; promo = null; hint = null; result = null; board.clear(); paint(true);
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
      const p = pos(); if (!p || !myTurn()) return;
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
    function clickSquare(s) {
      const p = pos(); if (!p) { return false; }
      if (!S && showR()) { ctx.toast('You are watching ' + R.wn + ' and ' + R.bn + '.'); return true; }
      if (!myTurn()) { if ((H && H.over) || (S && S.table.g && S.table.g.result)) return true; ctx.toast(H && H.thinking ? houseName(H.profile) + ' is thinking…' : 'Wait for your turn.'); return true; }
      if (sel && targets.some((t) => t.sq === s)) { tryMove(sel, s); return true; }
      const piece = boardMap(p).get(s);
      if (piece && piece[0] === me()) {
        if (sel === s) { sel = null; targets = []; } else {
          sel = s; const occ = boardMap(p);
          targets = [...new Set(p.movesUci().filter((u) => u.startsWith(s)).map((u) => u.slice(2, 4)))].map((sq) => ({ sq, capture: occ.has(sq) || (piece[1] === 'p' && sq[0] !== s[0]) }));
          ctx.sfx('select');
        }
      } else { sel = null; targets = []; }
      promo = null; refresh(); return true;
    }

    // ---- watching: the host of a game sends snapshots for the people at the table; everyone else draws them
    function snapshot() {
      const g = S && S.table.g; if (!g) return null;
      const c = S.clocks(), m = packMoves(g.uci);
      const d = { k: 1, w: g.white, b: g.black, on: S.oppName, f: S.table.pos.fen(), l: g.uci.length ? g.uci[g.uci.length - 1] : '', c: [Math.round(c.w), Math.round(c.b)], st: S.stake };
      if (m.length <= 1000) d.m = m;          // a very long game sends the position only
      if (g.result) { d.r = g.result; d.tm = g.term; }
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
      const was = R;
      R = { key, w: d.w, b: d.b, wn: name(senderIsWhite ? m.n : d.on) || 'White', bn: name(senderIsWhite ? d.on : m.n) || 'Black', pos: p, uci, last: l, clocks: c, rx: Date.now(),
            result: typeof d.r === 'string' && /^(1-0|0-1|1\/2-1\/2)$/.test(d.r) ? d.r : null, term: typeof d.tm === 'string' ? d.tm.slice(0, 24) : null, stake: Number.isSafeInteger(d.st) && d.st > 0 ? d.st : 0, offer: d.of === 'w' || d.of === 'b' ? d.of : null };
      if (showR()) { if (!same) { sel = null; targets = []; board.clear(); } paint(!same); if (was && !was.result && R.result) ctx.sfx('win'); }
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
      S = session; H = null; R = null; specSent = { key: '', at: 0 }; sel = null; targets = []; promo = null; hint = null; result = null; board.clear();
      S.onChange = () => { if (S === session) { specSend(false); refresh(); } };
      S.onSettle = (net, gm) => {
        const mine = S.myColour(), won = gm.winner === mine, draw = gm.winner === null;
        if (S.stake > 0) ctx.setBank(ctx.bank() + (draw ? S.stake : won ? 2 * S.stake : 0));
        result = { won, draw, term: gm.term, res: gm.result };
        msg = (draw ? 'Draw' : won ? 'You win' : S.oppName + ' wins') + ' · ' + gm.result + ' by ' + (TERM[gm.term] || gm.term) + (S.stake > 0 ? (draw ? '. Stakes returned.' : won ? '. You take ' + ctx.money(2 * S.stake) + '.' : '.') : '.');
        tone = draw ? '' : won ? 'win' : 'lose'; ctx.sfx(won ? 'win' : draw ? 'move' : 'lose');
        if (S.stake > 0) ctx.outcome(st, net, S.stake);
      };
      msg = 'Game on against ' + S.oppName + '. Colours are being drawn…'; tone = '';
      paint(true); if (ctx.focus() === st) ctx.render();
    };
    lobby.onEnd = () => { S = null; result = null; sel = null; targets = []; board.clear(); paint(true); msg = ''; if (ctx.focus() === st) ctx.render(); };

    // ---- the station
    const st = {
      id: def.id, name: def.name, group: g, noStools: true, chipMode: 'none', board, lobby,
      cam: { off: new THREE.Vector3(0, 1.3, 0.8), look: new THREE.Vector3(0, 0.55, -0.04) },
      frameCentre: new THREE.Vector3(0, 0.56, 0),
      rules: { title: 'Chess', steps: ['Play one of the ten XChess house players for free, or a player in the room. Pick a house player and a colour, then Play.', 'Tap one of your pieces, then a glowing square to move it. Castling, en passant and promotion all work; you choose the promotion piece.', 'Checkmate, stalemate, threefold repetition, the fifty-move rule and insufficient material end the game, exactly as in XChess.', 'Against a player: 10 minutes each plus 3 seconds a move. Friendly, or a LAYR stake where the winner takes both. Leaving or losing the connection voids the game and returns stakes.', 'House moves come from XChess engine inscription #3049 with a seed fixed at the start. After each house game the whole game is replayed with the engine to check every house move.'] },
      seats: SEATS,
      camFor(seat, view, asp) {
        const sg = seat && seat.z < 0 ? -1 : 1; let off, lk;
        if (seat && seat.watch && view !== 'overhead') {   // watching: from beside the table, a little above it
          const sx = Math.sign(seat.x) || 1, tallW = asp < 0.9;
          off = new THREE.Vector3(sx * (tallW ? 0.62 : 0.92), tallW ? 1.38 : 1.3, 0.04); lk = new THREE.Vector3(0, 0.55, 0);
          if (view === 'seat') { off.set(sx * 0.8, 1.05, 0.04); lk.set(-sx * 0.05, 0.55, 0); }
          return [off, lk];
        }
        // On a phone held upright the board has to span the screen's width (squares big enough for a fingertip), so the camera comes
        // in steep and close; the bottom sheet's space is handled by the page (frameFit).
        const tall = asp < 0.9, fit = tall ? Math.max(0.5, 0.78 * (0.46 / Math.max(0.3, asp))) : 1;
        if (view === 'overhead') { off = new THREE.Vector3(0, tall ? 0.55 + fit * 1.05 : 1.48, 0.06 * sg); lk = new THREE.Vector3(0, 0.55, 0); }
        else if (view === 'seat') { off = new THREE.Vector3(0, 1.05, 1.02 * sg); lk = new THREE.Vector3(0, 0.55, -0.06 * sg); if (tall) off.sub(lk).multiplyScalar(1 + (0.9 - asp) * 1.15).add(lk); }
        else if (tall) { off = new THREE.Vector3(0, 0.55 + fit * 0.86, fit * 0.5 * sg); lk = new THREE.Vector3(0, 0.55, -0.015 * sg); }
        else { off = new THREE.Vector3(0, 1.3, 0.8 * sg); lk = new THREE.Vector3(0, 0.55, -0.04 * sg); }
        return [off, lk];
      },
      canLeave() { return !(S && S.table.g && !S.table.g.result) && !busy; },
      leaveCash() { },
      held() { return S && !S.settled ? S.stake : 0; },
      pickClick(ev) {
        if (ctx.focus() !== st) return false;
        const s = board.pick(ctx.ray(ev)); if (!s) return false;
        ctx.audio(); return clickSquare(s);
      },
      update(t) {
        board.update(); lobby.frame(ctx.focus() === st);
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
        return false;
      },
      view() {
        injectCss(); const loaded = !!engine.api; if (!loaded) loadEngine().then(() => { paint(true); if (ctx.focus() === st) ctx.render(); }).catch(() => { });
        const a = []; let game = '';
        const p = pos(), live = (H && !H.over) || (S && S.table.g && !S.table.g.result);
        const moves = p ? p.pgnMoveText() : '';
        const promoHtml = promo ? `<div class="row promo"><span class="dim">Promote to</span>${['q', 'r', 'b', 'n'].map((x) => `<button data-a="promo" data-p="${x}" aria-label="${NAMES[x]}">${GLYPH[me() + x]}</button>`).join('')}</div>` : '';
        if (!S && showR()) {
          const c = watchClocks(), turn = turnOf(R.pos);
          const ck = (s, who) => `${c ? `<span class="clk ${!R.result && turn === s ? 'on' : ''} ${c[s] < 30 ? 'low' : ''}">${clock(c[s])}</span> ` : ''}<span class="who">${esc(who)} ${s === 'w' ? '♔' : '♚'}</span>`;
          const mv = R.uci ? (R.pos.pgnMoveText() || '<span class="dim">No moves yet.</span>') : '<span class="dim">Position only (a long game).</span>';
          game = `<div class="pxc"><div class="row">${ck('b', R.bn)}</div><div class="row">${ck('w', R.wn)}<span class="dim">· ${R.stake ? ctx.money(R.stake) + ' each' : 'friendly'}</span></div><div class="moves">${R.uci ? esc(mv) : mv}</div>${R.offer && !R.result ? `<div class="dim">${esc(R.offer === 'w' ? R.wn : R.bn)} has offered a draw.</div>` : ''}</div>`;
          msg = R.result ? (R.result === '1/2-1/2' ? 'Drawn' : (R.result === '1-0' ? R.wn : R.bn) + ' wins') + ' · ' + R.result + ' by ' + (TERM[R.term] || R.term || 'agreement') + '.' : 'Watching · ' + (turn === 'w' ? R.wn : R.bn) + ' to move' + (R.pos.inCheck() ? ' (check!)' : '') + '.';
          tone = '';
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
            const ck = (s, who) => `<span class="clk ${!gm.result && turn === s ? 'on' : ''} ${c[s] < 30 ? 'low' : ''}">${clock(c[s])}</span> <span class="who">${esc(who)} ${s === 'w' ? '♔' : '♚'}</span>`;
            game = `<div class="pxc"><div class="row">${ck(theirs, S.oppName)}</div><div class="row">${ck(mine, 'You')}${S.stake ? `<span class="dim">· ${ctx.money(S.stake)} each</span>` : '<span class="dim">· friendly</span>'}</div>${promoHtml}<div class="moves">${esc(moves) || '<span class="dim">No moves yet.</span>'}</div>${gm.offer && gm.offer !== mine && !gm.result ? `<div class="who">${esc(S.oppName)} offers a draw.</div>` : ''}</div>`;
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
          game = `<div class="pxc"><div class="row"><span class="who">${esc(prof.name)} ${H.me === 'w' ? '♚' : '♔'}</span><span class="dim">${stars(prof.stars)} · ${esc(prof.description)}</span></div><div class="row"><span class="who">You ${H.me === 'w' ? '♔' : '♚'}</span>${H.thinking ? '<span class="dim">· ' + esc(prof.name) + ' is thinking…</span>' : ''}</div>${promoHtml}<div class="moves">${esc(moves) || '<span class="dim">No moves yet.</span>'}</div>${ver}</div>`;
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
        if (id === 'newgame') { H = null; result = null; msg = ''; board.clear(); paint(true); saveHouse(); return; }
        if (id === 'promo' && promo) { tryMove(promo.from, promo.to, d.p); return; }
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
    st.onSpec = onSpec; st.watchSeat = watchSeat;
    // for tests and bug reports (scripts/test-casino-chess.mjs): what the table holds now
    st.debug = () => { const p = pos(), g = S && S.table.g; return { mode: S ? 'pvp' : showR() ? 'watch' : H ? 'house' : 'idle', watch: R ? { wn: R.wn, bn: R.bn, moves: R.uci ? R.uci.length : null, result: R.result, clocks: watchClocks(), seat: watchingHere() } : null, fen: p ? p.fen() : null, uci: H ? H.uci.slice() : g ? g.uci.slice() : [], me: p ? me() : null, over: H ? H.over : g && g.result ? { result: g.result, termination: g.term } : null, verified: H ? H.verified : null, thinking: !!(H && H.thinking), legal: p ? p.movesUci() : [], flip: board.flip, seed: H ? H.seed : null, clocks: S ? S.clocks() : null, stake: S ? S.stake : 0, host: S ? !!S.chain.host : null, msg }; };
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
    SEATS_OUT[s.id] = [{ x: 0, z: 1.2, stand: { x: s.side * 1.95, z: 0.9 } }, { x: 0, z: -0.97, stand: { x: s.side * 0.95, z: -0.8 } }];
    VERB[s.id] = 'PLAY';
  });
  let built = [];
  root.PXChess = {
    version: 'c2', ENGINE_ID, ENGINE_SHA256, TABLE_Z, TABLE_R, START,
    placement, TAGS, SEATS: SEATS_OUT, VERB, engine, loadEngine, ask, houseList, makeRelayTable, makeSession,
    makeStations(ctx) {
      // the station's seats must be the very objects in the page's SEATS (the room maps a seat to its spot by identity)
      // the room hooks are optional: a page without them simply never shows other people's games
      ctx = Object.assign({ roomSend: () => { }, roomHas: () => false, roomMe: () => null, watching: () => null, taken: () => [] }, ctx);
      built = SOFAS.map((def) => { const st = makeStation(ctx, def); return st; });
      built.forEach((st) => { SEATS_OUT[st.id] = st.seats; });
      return built;
    },
    // the house player across the table, while you play one (only on your own page)
    addHosts(hosts) {
      built.forEach((st, i) => {
        const def = SOFAS[i], wear = { shirt: 0x14141c, trousers: 0x191b20 };
        hosts.add({ group: st.group, x: 0, z: -0.97, yaw: 0, person: def.person, wear, seat: { h: 0.47 }, noLook: false, showWhen: () => st.houseShown('chair') });
        hosts.add({ group: st.group, x: 0, z: 1.2, yaw: Math.PI, person: def.person, wear, seat: { h: 0.66 }, showWhen: () => st.houseShown('sofa') });
      });
    },
    // a `spec` message from the room (watching a game): to the table it names
    onSpec(m) { const st = built.find((s) => s.id === (m && m.tb)); if (st && st.onSpec) try { st.onSpec(m); } catch (e) { console.warn('[chess] a snapshot failed', e); } },
    packMoves, unpackMoves,
    stations: () => built
  };
})(window);
