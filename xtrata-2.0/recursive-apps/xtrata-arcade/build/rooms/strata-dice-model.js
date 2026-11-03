// Pure JS model of casino-liars-dice-v1. Same rules, same error codes, same order of checks as the contract.
// Used by the table UI (demo mode, move validation, replay) and proven equal to the contract by test-diff.mjs.
// No dependencies; runs in the browser and in node. UMD-ish: exposes DiceModel.
(function (root) {
  'use strict';

  // ---- sha256 (sync, so the UI can derive dice without awaiting SubtleCrypto) ----
  const K = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
  function sha256(bytes) {
    const l = bytes.length, bitLen = l * 8;
    const padded = new Uint8Array(((l + 9 + 63) >> 6) << 6);
    padded.set(bytes); padded[l] = 0x80;
    const dv = new DataView(padded.buffer);
    dv.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000)); dv.setUint32(padded.length - 4, bitLen >>> 0);
    const H = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    const w = new Uint32Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let off = 0; off < padded.length; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i-15], 7) ^ rotr(w[i-15], 18) ^ (w[i-15] >>> 3);
        const s1 = rotr(w[i-2], 17) ^ rotr(w[i-2], 19) ^ (w[i-2] >>> 10);
        w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] += a; H[1] += b; H[2] += c; H[3] += d; H[4] += e; H[5] += f; H[6] += g; H[7] += h;
    }
    const out = new Uint8Array(32), odv = new DataView(out.buffer);
    for (let i = 0; i < 8; i++) odv.setUint32(i * 4, H[i]);
    return out;
  }
  const toHex = (u8) => Array.from(u8, (x) => x.toString(16).padStart(2, '0')).join('');
  const fromHex = (h) => { h = h.replace(/^0x/, ''); const o = new Uint8Array(h.length / 2); for (let i = 0; i < o.length; i++) o[i] = parseInt(h.substr(i * 2, 2), 16); return o; };
  const concat = (a, b) => { const o = new Uint8Array(a.length + b.length); o.set(a); o.set(b, a.length); return o; };

  // dice = five dice from sha256(seed || H), 4 bytes each, mod 6, plus 1
  function deriveDice(seed, h) {
    const hash = sha256(concat(seed, h)), dv = new DataView(hash.buffer);
    return [0, 1, 2, 3, 4].map((k) => (dv.getUint32(k * 4) % 6) + 1);
  }
  const countFace = (dice, f) => dice.filter((d) => d === f).length;

  const LIMITS = { MAX_RAKE_BPS: 500, MIN_TURN: 30, MAX_TURN: 3600, MIN_OPEN: 60, MAX_OPEN: 86400, REVEAL_SECS: 300, DEAL_GRACE: 60, MAX_QTY: 10 };
  const S = { OPEN: 0, BIDDING: 1, REVEAL: 2, DONE: 3, CANCELLED: 4 };
  const ERR = { DIRECT: 106, GAME: 200, STATE: 201, PLAYER: 202, TURN: 203, BID: 204, NO_BID: 205, NOT_DUE: 206, LATE: 207, COMMIT: 208, REVEALED: 209, PARAMS: 210, SELF_JOIN: 212, NOT_DEALT: 213, FT_INSUFFICIENT: 1 };

  // A table: games plus a chip ledger. ctx = { time, height, hashAt(height) } is supplied per call, exactly as the chain supplies it.
  function createTable({ rakeBps = 0, rakeTo = 'RAKE', balances = {} } = {}) {
    const games = new Map();
    const bal = Object.assign({ ESCROW: 0 }, balances);
    let next = 1;
    const log = []; // event log, same shape as the contract's print events
    const err = (code) => ({ err: code });
    const ok = (value = true) => ({ ok: value });
    const move = (from, to, n) => { if ((bal[from] || 0) < n) return false; bal[from] -= n; bal[to] = (bal[to] || 0) + n; return true; };
    const emit = (e) => log.push(e);

    function payout(id, winner) {
      const g = games.get(id), pot = 2 * g.stake, rake = Math.floor((pot * g.rbps) / 10000);
      g.state = S.DONE; g.winner = winner; g.rake = rake;
      emit({ event: 'settled', id, winner, pot, rake });
      move('ESCROW', winner, pot - rake); move('ESCROW', rakeTo, rake);
      return ok();
    }
    function create(ctx, sender, { stake, turn, open, commit }) {
      if (!(stake > 0 && turn >= LIMITS.MIN_TURN && turn <= LIMITS.MAX_TURN && open >= LIMITS.MIN_OPEN && open <= LIMITS.MAX_OPEN)) return err(ERR.PARAMS);
      if (!move(sender, 'ESCROW', stake)) return err(ERR.FT_INSUFFICIENT);
      const id = next++;
      games.set(id, { a: sender, b: null, stake, turn, state: S.OPEN, commitA: commit, commitB: null, expiresAt: ctx.time + open, dealHeight: 0, aToAct: true,
        qty: 0, face: 0, bidderA: true, deadline: 0, challengerA: false, diceA: null, diceB: null, rbps: 0, winner: null, rake: 0 });
      emit({ event: 'created', id, a: sender, stake, turn, expiresAt: ctx.time + open });
      return ok(id);
    }
    function join(ctx, sender, id, commit) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (g.state !== S.OPEN) return err(ERR.STATE);
      if (!(ctx.time < g.expiresAt)) return err(ERR.LATE);
      if (sender === g.a) return err(ERR.SELF_JOIN);
      if (toHex(commit) === toHex(g.commitA)) return err(ERR.COMMIT);
      if (!move(sender, 'ESCROW', g.stake)) return err(ERR.FT_INSUFFICIENT);
      Object.assign(g, { b: sender, commitB: commit, state: S.BIDDING, dealHeight: ctx.height + 1, aToAct: true, deadline: ctx.time + g.turn + LIMITS.DEAL_GRACE, rbps: rakeBps });
      emit({ event: 'joined', id, b: sender, dealHeight: ctx.height + 1 });
      return ok(ctx.height + 1);
    }
    const isPlayer = (g, who) => who === g.a || who === g.b;
    const actor = (g) => (g.aToAct ? g.a : g.b);
    function bid(ctx, sender, id, qty, face) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (g.state !== S.BIDDING) return err(ERR.STATE);
      if (!isPlayer(g, sender)) return err(ERR.PLAYER);
      if (!(ctx.height > g.dealHeight)) return err(ERR.NOT_DEALT);
      if (sender !== actor(g)) return err(ERR.TURN);
      if (!(ctx.time < g.deadline)) return err(ERR.LATE);
      if (!(qty >= 1 && qty <= LIMITS.MAX_QTY && face >= 1 && face <= 6)) return err(ERR.BID);
      if (!(g.qty === 0 || qty > g.qty || (qty === g.qty && face > g.face))) return err(ERR.BID);
      Object.assign(g, { qty, face, bidderA: g.aToAct, aToAct: !g.aToAct, deadline: ctx.time + g.turn });
      emit({ event: 'bid', id, by: sender, qty, face });
      return ok();
    }
    function challenge(ctx, sender, id) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (g.state !== S.BIDDING) return err(ERR.STATE);
      if (!isPlayer(g, sender)) return err(ERR.PLAYER);
      if (sender !== actor(g)) return err(ERR.TURN);
      if (!(g.qty > 0)) return err(ERR.NO_BID);
      if (!(ctx.time < g.deadline)) return err(ERR.LATE);
      Object.assign(g, { state: S.REVEAL, challengerA: g.aToAct, deadline: ctx.time + LIMITS.REVEAL_SECS });
      emit({ event: 'challenged', id, by: sender });
      return ok();
    }
    function reveal(ctx, sender, id, seed) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      const isA = sender === g.a;
      if (g.state !== S.REVEAL) return err(ERR.STATE);
      if (!(isA || sender === g.b)) return err(ERR.PLAYER);
      if (!(ctx.time < g.deadline)) return err(ERR.LATE);
      if (toHex(sha256(seed)) !== toHex(isA ? g.commitA : g.commitB)) return err(ERR.COMMIT);
      if ((isA ? g.diceA : g.diceB) !== null) return err(ERR.REVEALED);
      const h = ctx.hashAt(g.dealHeight); if (!h) return err(ERR.NOT_DEALT);
      const dice = deriveDice(seed, h);
      if (isA) g.diceA = dice; else g.diceB = dice;
      emit({ event: 'revealed', id, by: sender, dice });
      if (g.diceA && g.diceB) {
        const total = countFace(g.diceA, g.face) + countFace(g.diceB, g.face);
        const bidder = g.bidderA ? g.a : g.b, challenger = g.challengerA ? g.a : g.b;
        return payout(id, total >= g.qty ? bidder : challenger);
      }
      return ok();
    }
    function claimTimeout(ctx, id) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (g.state !== S.BIDDING && g.state !== S.REVEAL) return err(ERR.STATE);
      if (!(ctx.time >= g.deadline)) return err(ERR.NOT_DUE);
      if (g.state === S.BIDDING) { emit({ event: 'timeout', id, state: S.BIDDING }); return payout(id, g.aToAct ? g.b : g.a); }
      emit({ event: 'timeout', id, state: S.REVEAL });
      if (g.diceA) return payout(id, g.a);
      if (g.diceB) return payout(id, g.b);
      g.state = S.CANCELLED; emit({ event: 'refunded', id });
      move('ESCROW', g.a, g.stake); move('ESCROW', g.b, g.stake);
      return ok();
    }
    function cancelOpen(ctx, sender, id) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (g.state !== S.OPEN) return err(ERR.STATE);
      if (!(sender === g.a || ctx.time >= g.expiresAt)) return err(ERR.PLAYER);
      g.state = S.CANCELLED; emit({ event: 'cancelled', id });
      move('ESCROW', g.a, g.stake);
      return ok();
    }
    return { games, bal, log, create, join, bid, challenge, reveal, claimTimeout, cancelOpen };
  }

  // Who is it to act on, what can they do, and by when? Drives the UI's buttons and clocks.
  function view(g, ctx, me) {
    if (!g) return null;
    const state = g.state, mine = me === g.a ? 'a' : me === g.b ? 'b' : null;
    const toAct = state === S.BIDDING ? (g.aToAct ? g.a : g.b) : null;
    const secsLeft = g.deadline ? g.deadline - ctx.time : null;
    const dealt = state >= S.BIDDING && ctx.height > g.dealHeight;
    return { state, mine, toAct, secsLeft, dealt, myTurn: !!mine && toAct === me, expired: !!(g.deadline && ctx.time >= g.deadline) };
  }
  // The smallest legal raises over the current bid, for the bid picker.
  function nextBids(g) {
    const out = [];
    for (let q = 1; q <= LIMITS.MAX_QTY; q++) for (let f = 1; f <= 6; f++) if (g.qty === 0 || q > g.qty || (q === g.qty && f > g.face)) out.push([q, f]);
    return out;
  }
  // Probability that the bid is true from one player's point of view: they hold `mine` (known) and the other 5 dice are random.
  function oddsBidTrue(mine, qty, face) {
    const need = Math.max(0, qty - countFace(mine, face));
    if (need <= 0) return 1;
    if (need > 5) return 0;
    let p = 0; const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
    for (let k = need; k <= 5; k++) p += C(5, k) * Math.pow(1 / 6, k) * Math.pow(5 / 6, 5 - k);
    return p;
  }

  root.DiceModel = { sha256, toHex, fromHex, concat, deriveDice, countFace, LIMITS, S, ERR, createTable, view, nextBids, oddsBidTrue };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.DiceModel;
})(typeof globalThis !== 'undefined' ? globalThis : this);
