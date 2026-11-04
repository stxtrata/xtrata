// c7 chess chain: lost messages, catch-up, resume after a reload, message sizes and rate, time-out disputes. No browser.
const fs = require('fs'), assert = require('assert');
const FILE = process.argv[2] || 'public/casino/chess.js';   // run from the repo root: node scripts/test-casino-chain.cjs
// ---- a virtual clock: Date.now and the timers
let NOW = 1_800_000_000_000, SEQ = 0; const timers = new Map();
const realDate = Date; global.Date = class extends realDate { static now() { return NOW; } };
global.setInterval = (f, ms) => { const id = ++SEQ; timers.set(id, { f, ms, next: NOW + ms, rep: true }); return id; };
global.setTimeout = (f, ms) => { const id = ++SEQ; timers.set(id, { f, ms, next: NOW + (ms || 0), rep: false }); return id; };
global.clearInterval = global.clearTimeout = (id) => { timers.delete(id); };
function advance(ms) {
  const end = NOW + ms;
  for (;;) {
    let best = null, bid = 0; for (const [id, t] of timers) if (t.next <= end && (!best || t.next < best.next)) { best = t; bid = id; }
    if (!best) break; NOW = Math.max(NOW, best.next); if (best.rep) best.next += best.ms; else timers.delete(bid); best.f();
  }
  NOW = end;
}
global.window = global; global.document = { currentScript: null }; global.location = { href: 'http://x/casino/', search: '' };
global.crypto = require('crypto').webcrypto;
const store = {}; global.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } };
global.PointerEvent = undefined;
eval(fs.readFileSync(FILE, 'utf8'));
const E = (new Function(fs.readFileSync('public/casino/xchess-engine-3049.js', 'utf8') + ';return XChessHouseEngine;'))();
PXChess.engine.api = E;
const A = 'ST1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', Bx = 'ST2BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';

// ---- a pair of pages joined by a link we can cut; every message is checked against the room's limits
function pair({ hostIsA = true, stake = 100, roomHeld = true } = {}) {
  const P = { drop: { toGuest: false, toHost: false }, log: [], sent: [], sess: {}, chains: {}, held: [], saved: {} };
  const mk = (who, host, resume) => {
    const me = who, other = who === A ? Bx : A, side = host ? 'toGuest' : 'toHost';
    const send = (d) => {
      const wire = JSON.stringify(Object.assign({ tb: 'chess1' }, d)); assert.ok(wire.length <= 1500, 'message too large: ' + wire.length + ' ' + wire.slice(0, 80));
      P.sent.push({ at: NOW, from: who, k: d.k, size: wire.length });
      if (P.drop[side]) return;
      const dest = P.chains[other]; if (!dest) return;
      setTimeout(() => { if (P.drop[side]) return; const c = P.chains[other]; if (!c || c.dead) return; if (d.k === 'op') c.fromGuest(d); else if (d.k === 'block') c.fromHost(d); else c.onPeer(d); }, 40);
    };
    const chain = PXChess.makeChain({ host, me, other, send, blockMs: 1500, resume });
    P.chains[who] = chain;
    const S = PXChess.makeSession(chain, { me, opp: other, oppName: who === A ? 'Bob' : 'Alice', buyin: stake, tb: 'chess1', host, roomHeld });
    S.onSettle = (net, g) => P.log.push([who, 'settle', g.result, g.term, S.dispute ? 'dispute' : '']);
    S.onStall = () => P.log.push([who, 'stall']);
    { const orig = S.save; S.save = () => { const keep = store.pxChessLive; delete store.pxChessLive; orig(); P.saved[who] = store.pxChessLive; if (keep !== undefined) store.pxChessLive = keep; else delete store.pxChessLive; }; chain.onSave = S.save; }
    P.sess[who] = S; return S;
  };
  P.mk = mk;
  const hostWho = hostIsA ? A : Bx, guestWho = hostIsA ? Bx : A;
  P.host = mk(hostWho, true); P.guest = mk(guestWho, false);
  P.hw = hostWho; P.gw = guestWho;
  return P;
}
const turnWho = (S) => { const g = S.table.g; return (S.table.pos.turn === 0 ? g.white : g.black); };
const sessOf = (P, who) => P.sess[who];
async function playMove(P, mv) { const who = turnWho(P.host); const S = P.sess[who]; S.send(mv); advance(1700); }
const same = (P) => { const h = P.host.table.g, g = P.guest.table.g; return h && g && h.uci.join() === g.uci.join() && h.result === g.result && P.host.chain.height <= P.guest.chain.height + 1; };
const ROLL = ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6', 'd2d3', 'f8c5', 'c2c3', 'd7d6', 'b2b4', 'c5b6', 'a2a4', 'a7a6', 'a4a5', 'b6a7', 'e1g1', 'e8g8', 'h2h3', 'h7h6'];
let n = 0; const ok = (m) => { n++; console.log('  ✓ ' + m); };
const start = (P) => { P.host.open(); advance(1600); assert.ok(P.host.table.g && P.guest.table.g, 'the game is created on both pages'); };

(async () => {
  // 1. an ordinary game: both copies agree, a gid exists, the report hashes match
  {
    const P = pair(); start(P);
    assert.match(P.host.gid(), /^[0-9a-f]{16}$/); assert.equal(P.host.gid(), P.guest.gid());
    for (const mv of ROLL.slice(0, 8)) await playMove(P, mv);
    assert.ok(same(P)); assert.equal(P.host.table.g.uci.length, 8);
    assert.deepEqual(P.host.report().h, P.guest.report().h); assert.equal(P.host.report().n, 8); assert.match(P.host.report().h, /^[0-9a-f]{16}$/);
    ok('ordinary game: both copies equal, same gid, same move hash');
    P.host.chain.stop(); P.guest.chain.stop();
  }
  // 2. a guest move that is lost on the way is sent again; the host applies it once
  {
    const P = pair(); start(P);
    const guestMovesFirst = turnWho(P.host) === P.gw;
    if (!guestMovesFirst) await playMove(P, 'e2e4');
    // now it's the guest's turn (or white is the guest): drop toHost for a bit
    P.drop.toHost = true; const first = P.guest.send(guestMovesFirst ? 'e2e4' : 'e7e5'); advance(2500); P.drop.toHost = false; advance(5000);
    const r = await first; assert.equal(r.ok, 1, 'the guest\'s call got its answer in the end');
    assert.equal(P.host.table.g.uci.length, guestMovesFirst ? 1 : 2); assert.ok(same(P));
    // a repeat of an op that was already applied is dropped
    const len = P.host.table.g.uci.length; const id = [...P.host.chain.ids].find((i) => i.startsWith(P.gw + ':'));
    P.host.chain.fromGuest({ k: 'op', id, m: 'act', args: [P.gw, 'a7a6'] }); advance(3000); assert.equal(P.host.table.g.uci.length, len, 'a repeated id is ignored');
    ok('a lost guest move is sent again and applied once; a repeat is dropped');
    P.host.chain.stop(); P.guest.chain.stop();
  }
  // 3. blocks lost to the guest: it sees a gap, asks, and catches up (no dead chain)
  {
    const P = pair(); start(P);
    for (const mv of ROLL.slice(0, 4)) await playMove(P, mv);
    P.drop.toGuest = true; await playMove(P, ROLL[4]); await playMove(P, ROLL[5]); P.drop.toGuest = false;
    advance(10000);
    assert.equal(P.guest.chain.dead, false); assert.ok(same(P), 'guest caught up: ' + P.guest.table.g.uci.length + ' vs ' + P.host.table.g.uci.length);
    await playMove(P, ROLL[6]); assert.ok(same(P)); assert.equal(P.host.table.g.uci.length, 7);
    ok('blocks lost for 3 s: the guest asks and catches up, then follows live blocks again');
    P.host.chain.stop(); P.guest.chain.stop();
  }
  // 4. cut for a minute both ways (a phone that locks); the game carries on; message rate stays under the room's 30 per 10 s
  {
    const P = pair(); start(P);
    for (const mv of ROLL.slice(0, 6)) await playMove(P, mv);
    P.drop.toGuest = P.drop.toHost = true; advance(60000); P.drop.toGuest = P.drop.toHost = false;
    const mark = P.sent.length; advance(15000);
    assert.equal(P.guest.chain.dead, false); assert.ok(same(P)); await playMove(P, ROLL[6]); assert.ok(same(P));
    const win = (from, to) => P.sent.filter((s) => s.at >= from && s.at < to).length; let worst = 0;
    for (let t0 = P.sent[0].at; t0 < NOW; t0 += 1000) worst = Math.max(worst, win(t0, t0 + 10000)); assert.ok(worst <= 25, 'busiest 10 s window had ' + worst + ' messages');
    ok('a minute cut both ways: caught up; busiest 10 s window = ' + worst + ' messages (limit 30)');
    P.host.chain.stop(); P.guest.chain.stop();
  }
  // 5. a long game: a full replay for a reloaded guest is small and in a few pieces
  {
    const P = pair(); start(P);
    // shuffle knights for ~160 half-moves (repetition would end it: vary with pawn moves first)
    const seqs = []; const g = P.host.table; const p = g.pos;
    let count = 0; const avoid = new Set();
    while (count < 120 && !P.host.table.g.result) {
      const legal = P.host.table.pos.movesUci(); const mv = legal.filter((m) => !/[qrbn]$/.test(m))[(count * 7 + 3) % legal.length];
      const who = turnWho(P.host); P.sess[who].send(mv); advance(1600); count++;
    }
    const total = P.host.table.g.uci.length; assert.ok(total > 60, 'played ' + total);
    // the guest's page is gone and a new copy asks for everything
    const sentBefore = P.sent.length; P.guest.chain.stop(); delete P.chains[P.gw]; delete P.sess[P.gw];
    const fresh = P.mk(P.gw, false, null); fresh.chain.ask(); advance(12000);
    const blocks = P.sent.slice(sentBefore).filter((s) => s.k === 'blocks'), bytes = blocks.reduce((a, s) => a + s.size, 0);
    assert.equal(fresh.table.g.uci.length, total, 'fresh page replayed ' + fresh.table.g.uci.length + ' of ' + total);
    assert.ok(blocks.length <= 12, 'chunks: ' + blocks.length); 
    ok('a ' + total + '-half-move game replays on a fresh page in ' + blocks.length + ' messages / ' + bytes + ' bytes');
    P.host.chain.stop(); fresh.chain.stop();
  }
  // 6. a guest reloads mid-game and resumes from what its browser kept; a host reloads too
  for (const reloadHost of [false, true]) {
    for (const k in store) delete store[k];
    const P = pair(); start(P);
    for (const mv of ROLL.slice(0, 5)) await playMove(P, mv);
    const who = reloadHost ? P.hw : P.gw, saved = JSON.parse(P.saved[who]);
    assert.equal(saved.gid, P.host.gid()); assert.equal(saved.me, who);
    // the page closes; the other side plays on for a bit (the opponent's moves would need a turn; just let blocks flow)
    const old = P.chains[who]; old.stop(); delete P.chains[who]; delete P.sess[who];
    advance(8000);
    const S2 = P.mk(who, reloadHost, saved); advance(8000);
    assert.equal(S2.table.g.uci.length, 5); assert.equal(S2.gid(), saved.gid);
    // play on from the resumed page
    const other = who === P.hw ? P.gw : P.hw; 
    for (const mv of ROLL.slice(5, 9)) { const w = turnWho(P.sess[other].table.g ? P.sess[other] : S2); P.sess[w].send(mv); advance(1700); }
    assert.equal(P.sess[P.hw].table.g.uci.length, 9, 'host has ' + P.sess[P.hw].table.g.uci.length); assert.equal(P.sess[P.gw].table.g.uci.length, 9);
    assert.equal(P.sess[P.hw].report().h, P.sess[P.gw].report().h);
    ok((reloadHost ? 'host' : 'guest') + ' reloads mid-game: resumes from its browser, catches up, and play goes on (9 half-moves, same hash)');
    P.sess[P.hw].chain.stop(); P.sess[P.gw].chain.stop();
  }
  // 7. both reload at once: each keeps its own log, so they still agree
  {
    for (const k in store) delete store[k];
    const P = pair(); start(P);
    for (const mv of ROLL.slice(0, 4)) await playMove(P, mv);
    const rh = JSON.parse(P.saved[P.hw]), rg = JSON.parse(P.saved[P.gw]); P.host.chain.stop(); P.guest.chain.stop();
    delete P.chains[A]; delete P.chains[Bx];
    const H2 = P.mk(P.hw, true, rh), G2 = P.mk(P.gw, false, rg); advance(8000);
    assert.equal(H2.table.g.uci.length, 4); assert.equal(G2.table.g.uci.length, 4);
    P.sess[turnWho(H2)].send(ROLL[4]); advance(3000); assert.equal(H2.table.g.uci.length, 5); assert.equal(G2.table.g.uci.length, 5);
    ok('both pages reload at once: both replay their saved calls, agree, and play on');
    H2.chain.stop(); G2.chain.stop();
  }
  // 8. time-outs: honest, a host that flags early, a host whose clock stops
  {
    // 8a. honest flag: white (host or guest) leaves its clock to run out
    const P = pair({ hostIsA: true }); start(P);
    await playMove(P, ROLL[0]);                          // white's first move
    // now black to move; let black's clock run out for real (600 s base + 3 s increments): 11 minutes
    advance(11 * 60 * 1000);
    assert.equal(P.host.table.g.term, 'timeout'); assert.equal(P.guest.table.g.term, 'timeout');
    const lg = P.log.filter((l) => l[1] === 'settle'); assert.equal(lg.length, 2); assert.ok(lg.every((l) => l[4] === ''), 'no dispute on an honest time-out: ' + JSON.stringify(lg));
    assert.deepEqual(P.host.report(), P.guest.report());
    ok('honest time-out: both copies agree, no dispute');
    P.host.chain.stop(); P.guest.chain.stop();
  }
  {
    // 8b. a lying host: its block times jump ahead, so it flags the guest with plenty of time left
    const P = pair(); start(P);
    await playMove(P, ROLL[0]);
    const hostC = P.host.chain, realTick = hostC.tick; let skew = 0; 
    // the host writes block time = real + skew
    const origNow = Date.now; 
    hostC.tick = () => { const f = Date.now; Date.now = () => f() + skew; try { realTick(); } finally { Date.now = f; } };
    clearInterval(hostC.timer); hostC.timer = setInterval(hostC.tick, 1500);
    skew = 900 * 1000; advance(4000);          // the host's clock claims 15 minutes passed
    const settles = P.log.filter((l) => l[1] === 'settle');
    assert.ok(P.host.table.g.result, 'the lying host flagged the game'); 
    const gs = settles.find((l) => l[0] === P.gw); assert.ok(gs && gs[4] === 'dispute', 'the guest disputes: ' + JSON.stringify(settles));
    assert.equal(P.guest.report().tm, 'dispute'); assert.equal(P.guest.report().r, '*');
    ok('a host that flags with 15 minutes still on the clock: the guest reports a dispute');
    P.host.chain.stop(); P.guest.chain.stop();
  }
  {
    // 8c. a host whose block times stop: its own clock never runs down; the guest notices by its own count
    const P = pair(); start(P);
    const moves = []; 
    // make it the host's turn: if the host is white it already is
    const hostTurn = turnWho(P.host) === P.hw; if (!hostTurn) await playMove(P, ROLL[0]);
    const hostC = P.host.chain, realTick = hostC.tick; const frozen = Math.floor(Date.now() / 1000);
    hostC.tick = () => { const f = Date.now; Date.now = () => frozen * 1000; try { realTick(); } finally { Date.now = f; } };
    clearInterval(hostC.timer); hostC.timer = setInterval(hostC.tick, 1500);
    advance(11 * 60 * 1000 + 30 * 1000);
    assert.ok(!P.host.table.g.result, 'the host never flags itself');
    assert.ok(P.log.some((l) => l[0] === P.gw && l[1] === 'stall'), 'the guest reports the stall: ' + JSON.stringify(P.log));
    ok('a host whose clock stops: the guest\'s own count says its time is up, and it reports that');
    P.host.chain.stop(); P.guest.chain.stop();
  }
  {
    // 8d. a phone that sleeps through the end of a turn must not cause a dispute (its own count is not trusted after catch-up)
    const P = pair(); start(P);
    await playMove(P, ROLL[0]);
    P.drop.toGuest = P.drop.toHost = true; advance(11 * 60 * 1000); P.drop.toGuest = P.drop.toHost = false; advance(20000);
    assert.equal(P.host.table.g.term, 'timeout'); assert.equal(P.guest.table.g.term, 'timeout');
    assert.ok(P.log.filter((l) => l[1] === 'settle').every((l) => l[4] === ''), 'no dispute: ' + JSON.stringify(P.log));
    ok('a link cut across the whole turn: the time-out is accepted, not disputed');
    P.host.chain.stop(); P.guest.chain.stop();
  }
  // 9. the room ends a game the page has not (forfeit): S.end() closes the table copy and stops moves
  {
    const P = pair(); start(P); await playMove(P, ROLL[0]);
    P.guest.end('1-0', 'resignation'); assert.equal(P.guest.table.g.result, '1-0'); assert.equal(P.guest.table.g.winner, 'w');
    P.guest.end('0-1', 'x'); assert.equal(P.guest.table.g.result, '1-0', 'cannot end twice');
    ok('the room\'s word ends the page\'s copy once');
    P.host.chain.stop(); P.guest.chain.stop();
  }
  console.log('\nchain: ' + n + ' groups passed');
  process.exit(0);
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
