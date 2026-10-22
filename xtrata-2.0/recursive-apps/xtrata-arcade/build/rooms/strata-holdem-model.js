// Pure JS model of casino-holdem-v1 (heads-up no-limit Hold'em, one hand per match, independent decks).
// Same rules, same error codes and the same order of checks as the contract. The hand evaluator here is an independent
// brute-force implementation (best five of seven), used to prove the contract's evaluator. Needs strata-dice-model.js (sha256).
(function (root) {
  'use strict';
  const D = root.DiceModel || (typeof require !== 'undefined' ? require('./strata-dice-model.js') : null);
  const { sha256, toHex, concat } = D;

  const LIM = { MAX_RAKE_BPS: 500, MIN_TURN: 30, MAX_TURN: 3600, MIN_OPEN: 60, MAX_OPEN: 86400, REVEAL_SECS: 300, STREET_GRACE: 60, MIN_BB: 2, MIN_BUYIN_BBS: 10, MAX_BUYIN_BBS: 1000 };
  const S = { OPEN: 0, DEALING: 1, PLAYING: 2, SHOWDOWN: 3, DONE: 4, CANCELLED: 5, RUNOUT: 6 };
  const ERR = { GAME: 200, STATE: 201, PLAYER: 202, TURN: 203, ACTION: 204, NOT_DUE: 206, LATE: 207, COMMIT: 208, REVEALED: 209, PARAMS: 210, SELF_JOIN: 212, NOT_DEALT: 213, PAY: 299, FT_INSUFFICIENT: 1 };
  const RANK_NAMES = '23456789TJQKA', SUIT_NAMES = '♣♦♥♠';
  const rankOf = (c) => c % 13, suitOf = (c) => Math.floor(c / 13);
  const cardName = (c) => RANK_NAMES[rankOf(c)] + SUIT_NAMES[suitOf(c)];
  const CAT_NAMES = ['High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight', 'Flush', 'Full house', 'Four of a kind', 'Straight flush'];

  // ---------------- evaluator (brute force, independent of the contract's algorithm) ----------------
  function eval5(cards) {
    const rs = cards.map(rankOf).sort((a, b) => b - a), ss = cards.map(suitOf);
    const flush = ss.every((x) => x === ss[0]);
    const uniq = [...new Set(rs)];
    let top = -1;
    if (uniq.length === 5) { if (rs[0] - rs[4] === 4) top = rs[0]; else if (rs[0] === 12 && rs[1] === 3 && rs[4] === 0) top = 3; }
    const cnt = {}; rs.forEach((r) => (cnt[r] = (cnt[r] || 0) + 1));
    const groups = Object.entries(cnt).map(([r, n]) => [Number(r), n]).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
    let cat, digits;
    if (flush && top >= 0) { cat = 8; digits = [top]; }
    else if (groups[0][1] === 4) { cat = 7; digits = [groups[0][0], groups[1][0]]; }
    else if (groups[0][1] === 3 && groups[1][1] === 2) { cat = 6; digits = [groups[0][0], groups[1][0]]; }
    else if (flush) { cat = 5; digits = rs; }
    else if (top >= 0) { cat = 4; digits = [top]; }
    else if (groups[0][1] === 3) { cat = 3; digits = groups.map((g) => g[0]); }
    else if (groups[0][1] === 2 && groups[1][1] === 2) { cat = 2; digits = groups.map((g) => g[0]); }
    else if (groups[0][1] === 2) { cat = 1; digits = groups.map((g) => g[0]); }
    else { cat = 0; digits = rs; }
    let score = cat * 371293; digits.forEach((d, i) => (score += d * Math.pow(13, 4 - i)));
    return score;
  }
  function score7(cards) {
    let best = -1;
    const n = cards.length;
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) { // leave out two cards
      const five = cards.filter((_, i) => i !== a && i !== b);
      if (five.length === 5) best = Math.max(best, eval5(five));
    }
    return best;
  }
  const category = (score) => Math.floor(score / 371293);

  // ---------------- dealing ----------------
  const word = (h, i) => ((h[i * 4] << 24) >>> 0) + (h[i * 4 + 1] << 16) + (h[i * 4 + 2] << 8) + h[i * 4 + 3];
  function nthFree(used, n) { let left = n; for (let c = 0; c < 52; c++) { if (used.includes(c)) continue; if (left === 0) return c; left--; } return 0; }
  function drawCards(board, h, n) { const cards = board.slice(); for (let i = 0; i < n; i++) cards.push(nthFree(cards, word(h, i) % (52 - cards.length))); return cards; }
  const uintBuff = (n) => { const b = new Uint8Array(17); b[0] = 1; let x = BigInt(n); for (let i = 16; i >= 1; i--) { b[i] = Number(x & 0xffn); x >>= 8n; } return b; };
  const streetHash = (id, headerHash, tag) => (headerHash ? sha256(concat(headerHash, uintBuff(id * 100 + tag))) : null);
  function holeCards(seed, h, board) {
    const ha = sha256(concat(seed, h)), hb = sha256(ha);
    let h1 = 99, h2 = 99;
    for (let i = 0; i < 24 && h2 === 99; i++) {
      const cand = i < 8 ? word(ha, i) % 52 : i < 16 ? word(hb, i - 8) % 52 : i - 16;
      if (board.includes(cand) || cand === h1) continue;
      if (h1 === 99) h1 = cand; else h2 = cand;
    }
    return [h1, h2];
  }

  // ---------------- table ----------------
  // ctx = { time, height, hashAt(height) -> Uint8Array | null }
  function createTable({ rakeBps = 0, rakeTo = 'RAKE', balances = {} } = {}) {
    const games = new Map(), bal = Object.assign({ ESCROW: 0 }, balances), log = [];
    let next = 1;
    const err = (code) => ({ err: code }), ok = (value = true) => ({ ok: value });
    const move = (from, to, n) => { if ((bal[from] || 0) < n) return false; bal[from] -= n; bal[to] = (bal[to] || 0) + n; return true; };
    const emit = (e) => log.push(e);
    const isPlayer = (g, w) => w === g.a || w === g.b;

    function finish(id, amtA, amtB, rake, winner) {
      const g = games.get(id);
      if (amtA + amtB + rake !== 2 * g.buyin) return err(ERR.PAY);
      g.state = S.DONE; g.winner = winner; g.rake = rake;
      emit({ event: 'settled', id, winner, toA: amtA, toB: amtB, rake });
      move('ESCROW', g.a, amtA); move('ESCROW', g.b, amtB); move('ESCROW', rakeTo, rake);
      return ok();
    }
    function settleFold(id, winnerIsA) {
      const g = games.get(id), ca = g.buyin - g.stackA, cb = g.buyin - g.stackB, matched = 2 * Math.min(ca, cb);
      const rake = Math.floor((matched * g.rbps) / 10000), win = ca + cb - rake;
      return winnerIsA ? finish(id, win + g.stackA, g.stackB, rake, g.a) : finish(id, g.stackA, win + g.stackB, rake, g.b);
    }
    function settleShowdown(id, aWins) { // true, false or null (split)
      const g = games.get(id), c = g.buyin - g.stackA, pot = 2 * c, rake = Math.floor((pot * g.rbps) / 10000), net = pot - rake;
      if (aWins === true) return finish(id, net + g.stackA, g.stackB, rake, g.a);
      if (aWins === false) return finish(id, g.stackA, net + g.stackB, rake, g.b);
      const half = Math.floor(net / 2);
      return finish(id, half + g.stackA, half + g.stackB, rake + (net - 2 * half), null);
    }
    function create(ctx, sender, { buyin, bb, turn, open, commit }) {
      if (!(bb >= LIM.MIN_BB && bb % 2 === 0 && buyin >= bb * LIM.MIN_BUYIN_BBS && buyin <= bb * LIM.MAX_BUYIN_BBS && turn >= LIM.MIN_TURN && turn <= LIM.MAX_TURN && open >= LIM.MIN_OPEN && open <= LIM.MAX_OPEN)) return err(ERR.PARAMS);
      if (!move(sender, 'ESCROW', buyin)) return err(ERR.FT_INSUFFICIENT);
      const id = next++;
      games.set(id, { a: sender, b: null, buyin, bb, turn, state: S.OPEN, commitA: commit, commitB: null, expiresAt: ctx.time + open, dealHeight: 0, rbps: 0, buttonA: true, street: 0, nextStreetAt: 0, board: [],
        stackA: buyin, stackB: buyin, betA: 0, betB: 0, lastRaise: bb, acts: 0, aToAct: true, deadline: 0, holeA: null, holeB: null, winner: null, rake: 0 });
      emit({ event: 'created', id, a: sender, buyin, bb, turn, expiresAt: ctx.time + open });
      return ok(id);
    }
    function join(ctx, sender, id, commit) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (g.state !== S.OPEN) return err(ERR.STATE);
      if (!(ctx.time < g.expiresAt)) return err(ERR.LATE);
      if (sender === g.a) return err(ERR.SELF_JOIN);
      if (toHex(commit) === toHex(g.commitA)) return err(ERR.COMMIT);
      if (!move(sender, 'ESCROW', g.buyin)) return err(ERR.FT_INSUFFICIENT);
      Object.assign(g, { b: sender, commitB: commit, state: S.DEALING, dealHeight: ctx.height + 1, rbps: rakeBps });
      emit({ event: 'joined', id, b: sender, dealHeight: ctx.height + 1 });
      return ok(ctx.height + 1);
    }
    function startHand(ctx, id) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (g.state !== S.DEALING) return err(ERR.STATE);
      if (!(ctx.height > g.dealHeight)) return err(ERR.NOT_DEALT);
      const h = ctx.hashAt(g.dealHeight); if (!h) return err(ERR.NOT_DEALT);
      const buttonA = h[0] % 2 === 0, sb = g.bb / 2;
      Object.assign(g, { state: S.PLAYING, buttonA, street: 0, acts: 0, lastRaise: g.bb, betA: buttonA ? sb : g.bb, betB: buttonA ? g.bb : sb,
        stackA: g.buyin - (buttonA ? sb : g.bb), stackB: g.buyin - (buttonA ? g.bb : sb), aToAct: buttonA, deadline: ctx.time + g.turn });
      emit({ event: 'hand', id, buttonA });
      return ok(buttonA);
    }
    function dealPending(ctx, id) {
      const g = games.get(id);
      if (g.nextStreetAt === 0) return ok();
      const street = g.street + 1;
      const hash = streetHash(id, ctx.hashAt(g.nextStreetAt), street); if (!hash) return err(ERR.NOT_DEALT);
      if (!(ctx.height > g.nextStreetAt)) return err(ERR.NOT_DEALT);
      g.board = drawCards(g.board, hash, street === 1 ? 3 : 1);
      Object.assign(g, { street, nextStreetAt: 0, betA: 0, betB: 0, acts: 0, lastRaise: g.bb });
      emit({ event: 'street', id, street, board: g.board.slice() });
      return ok();
    }
    function closeStreet(ctx, id) {
      const g = games.get(id);
      if (g.street === 3) { emit({ event: 'showdown', id }); Object.assign(g, { state: S.SHOWDOWN, deadline: ctx.time + LIM.REVEAL_SECS }); }
      else if (g.stackA === 0 && g.stackB === 0) { emit({ event: 'all-in', id }); Object.assign(g, { state: S.RUNOUT, nextStreetAt: ctx.height + 1, deadline: 0 }); }
      else Object.assign(g, { nextStreetAt: ctx.height + 1, aToAct: !g.buttonA, deadline: ctx.time + g.turn + LIM.STREET_GRACE });
    }
    // The contract rolls back everything when a call returns an error, so the model snapshots and restores on error.
    function act(ctx, sender, id, action, amount) {
      const g0 = games.get(id); if (!g0) return err(ERR.GAME);
      const isA = sender === g0.a;
      if (g0.state !== S.PLAYING) return err(ERR.STATE);
      if (!(isA || sender === g0.b)) return err(ERR.PLAYER);
      if (isA !== g0.aToAct) return err(ERR.TURN);
      if (!(ctx.time < g0.deadline)) return err(ERR.LATE);
      const snap = structuredClone(g0), logLen = log.length;
      const rollback = () => { games.set(id, structuredClone(snap)); log.length = logLen; };
      const dp = dealPending(ctx, id); if (dp.err) { rollback(); return dp; }
      const g = games.get(id);
      const myBet = isA ? g.betA : g.betB, oppBet = isA ? g.betB : g.betA, myStack = isA ? g.stackA : g.stackB;
      if (action === 0) { emit({ event: 'fold', id, by: sender }); const r = settleFold(id, !isA); if (r.err) rollback(); return r; }
      if (action === 1) {
        const toCall = oppBet >= myBet ? oppBet - myBet : 0, acts = g.acts + 1;
        if (!(oppBet >= myBet)) { rollback(); return err(ERR.ACTION); }
        if (!(toCall <= myStack)) { rollback(); return err(ERR.ACTION); }
        emit({ event: toCall === 0 ? 'check' : 'call', id, by: sender, amount: toCall });
        Object.assign(g, isA ? { betA: oppBet, stackA: myStack - toCall } : { betB: oppBet, stackB: myStack - toCall });
        Object.assign(g, { acts, aToAct: !isA, deadline: ctx.time + g.turn });
        if (acts >= 2) closeStreet(ctx, id);
        return ok();
      }
      if (action === 2) {
        const cap = myBet + myStack, raiseBy = amount > oppBet ? amount - oppBet : 0, paid = amount > myBet ? amount - myBet : 0;
        if (!(amount > oppBet) || !(amount <= cap) || !(raiseBy >= g.lastRaise || amount === cap)) { rollback(); return err(ERR.ACTION); }
        emit({ event: 'raise', id, by: sender, to: amount });
        Object.assign(g, isA ? { betA: amount, stackA: myStack - paid } : { betB: amount, stackB: myStack - paid });
        Object.assign(g, { lastRaise: raiseBy >= g.lastRaise ? raiseBy : g.lastRaise, acts: g.acts + 1, aToAct: !isA, deadline: ctx.time + g.turn });
        return ok();
      }
      rollback(); return err(ERR.ACTION);
    }
    function advance(ctx, id) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (g.state !== S.RUNOUT) return err(ERR.STATE);
      if (!(ctx.height > g.nextStreetAt)) return err(ERR.NOT_DEALT);
      const hash = streetHash(id, ctx.hashAt(g.nextStreetAt), 9); if (!hash) return err(ERR.NOT_DEALT);
      g.board = drawCards(g.board, hash, 5 - g.board.length);
      emit({ event: 'street', id, street: 9, board: g.board.slice() });
      Object.assign(g, { street: 3, nextStreetAt: 0, state: S.SHOWDOWN, deadline: ctx.time + LIM.REVEAL_SECS });
      return ok(g.board.slice());
    }
    function reveal(ctx, sender, id, seed) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      const isA = sender === g.a;
      if (g.state !== S.SHOWDOWN) return err(ERR.STATE);
      if (!(isA || sender === g.b)) return err(ERR.PLAYER);
      if (!(ctx.time < g.deadline)) return err(ERR.LATE);
      if (toHex(sha256(seed)) !== toHex(isA ? g.commitA : g.commitB)) return err(ERR.COMMIT);
      if ((isA ? g.holeA : g.holeB) !== null) return err(ERR.REVEALED);
      const h = ctx.hashAt(g.dealHeight); if (!h) return err(ERR.NOT_DEALT);
      const hole = holeCards(seed, h, g.board);
      if (isA) g.holeA = hole; else g.holeB = hole;
      emit({ event: 'revealed', id, by: sender, hole });
      if (g.holeA && g.holeB) {
        const sa = score7(g.holeA.concat(g.board)), sb = score7(g.holeB.concat(g.board));
        return settleShowdown(id, sa > sb ? true : sb > sa ? false : null);
      }
      return ok();
    }
    function claimTimeout(ctx, id) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (!(ctx.time >= g.deadline)) return err(ERR.NOT_DUE);
      if (!(g.deadline > 0)) return err(ERR.NOT_DUE);
      if (g.state === S.PLAYING) { emit({ event: 'timeout', id, state: S.PLAYING }); return settleFold(id, !g.aToAct); }
      if (g.state === S.SHOWDOWN) {
        emit({ event: 'timeout', id, state: S.SHOWDOWN });
        if (g.holeA) return settleShowdown(id, true);
        if (g.holeB) return settleShowdown(id, false);
        return finish(id, g.buyin, g.buyin, 0, null);
      }
      return err(ERR.STATE);
    }
    function cancelOpen(ctx, sender, id) {
      const g = games.get(id); if (!g) return err(ERR.GAME);
      if (g.state !== S.OPEN) return err(ERR.STATE);
      if (!(sender === g.a || ctx.time >= g.expiresAt)) return err(ERR.PLAYER);
      g.state = S.CANCELLED; emit({ event: 'cancelled', id });
      move('ESCROW', g.a, g.buyin);
      return ok();
    }
    return { games, bal, log, create, join, startHand, act, advance, reveal, claimTimeout, cancelOpen };
  }

  // What can this player do right now? Drives the UI.
  function options(g, me) {
    if (!g || g.state !== S.PLAYING) return null;
    const isA = me === g.a; if (isA !== g.aToAct) return null;
    const pending = g.nextStreetAt > 0;
    const myBet = pending ? 0 : isA ? g.betA : g.betB, oppBet = pending ? 0 : isA ? g.betB : g.betA, myStack = isA ? g.stackA : g.stackB;
    const lastRaise = pending ? g.bb : g.lastRaise;
    const toCall = oppBet - myBet, cap = myBet + myStack, minRaiseTo = Math.min(cap, oppBet + lastRaise);
    return { toCall, canCheck: toCall === 0, canRaise: cap > oppBet, minRaiseTo, maxRaiseTo: cap, myBet, oppBet, myStack };
  }

  root.HoldemModel = { LIM, S, ERR, cardName, rankOf, suitOf, CAT_NAMES, category, eval5, score7, drawCards, streetHash, holeCards, nthFree, createTable, options };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.HoldemModel;
})(typeof globalThis !== 'undefined' ? globalThis : this);
