// The chess desk inside the REAL room code (workers/casino-room/index.ts, bundled with a tiny stand-in for the Workers runtime):
// four connections (two players and two spectators), real JSON frames, a clock we move by hand. No browser needed.
// Checks that the Worker is wired to functions/lib/casino-chess-room.ts: features and kill switches, a game opening from a
// snapshot, bets, agreed results, a dispute, the leaving rule (forfeit, and coming back in time), and that nothing is created or
// lost (the sum of all balances never changes except by what the room says it kept).
// Usage: node scripts/test-casino-chess-room.mjs
import { build } from 'esbuild';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = new URL('..', import.meta.url).pathname;
const dir = await mkdtemp(join(tmpdir(), 'pxchess-'));
await writeFile(join(dir, 'cf.mjs'), 'export class DurableObject { constructor(ctx, env) { this.ctx = ctx; this.env = env; } }\n');
await build({ entryPoints: [join(root, 'workers/casino-room/index.ts')], bundle: true, format: 'esm', platform: 'node', outfile: join(dir, 'room.mjs'), alias: { 'cloudflare:workers': join(dir, 'cf.mjs') }, logLevel: 'error' });
const { CasinoRoom } = await import(join(dir, 'room.mjs'));

let clock = 1_800_000_000_000;
Date.now = () => clock;
const advance = (ms) => { clock += ms; };

function makeRoom(env = {}) {
  const sockets = new Set(), store = new Map(), ops = { written: 0, deleted: 0, reads: 0 };
  const ctx = {
    getWebSockets: () => [...sockets].filter((s) => s.open),
    acceptWebSocket: (ws) => sockets.add(ws),
    storage: {
      get: async (k) => { ops.reads++; return store.has(k) ? structuredClone(store.get(k)) : undefined; },
      put: async (k, v) => { if (typeof k === 'object') for (const [x, y] of Object.entries(k)) { store.set(x, structuredClone(y)); ops.written++; } else { store.set(k, structuredClone(v)); ops.written++; } },
      delete: async (k) => { let n = 0; for (const x of [].concat(k)) if (store.delete(x)) { n++; ops.deleted++; } return n; },
      list: async ({ prefix = '', reverse = false, limit = 1000 } = {}) => {
        const keys = [...store.keys()].filter((k) => k.startsWith(prefix)).sort(); if (reverse) keys.reverse();
        return new Map(keys.slice(0, limit).map((k) => [k, structuredClone(store.get(k))]));
      }
    }
  };
  const room = new CasinoRoom(ctx, env);
  return { room, ctx, store, ops, sockets };
}

const addr = (n) => ('ST' + n.toUpperCase() + '0'.repeat(30)).slice(0, 38);
async function enter(R, name, { bal = 100_000, spot = null, watch = null } = {}) {
  const a = addr(name), log = [];
  const sock = { open: true, att: null, serializeAttachment(v) { this.att = structuredClone(v); }, deserializeAttachment() { return this.att; }, send(t) { if (this.open) log.push(JSON.parse(t)); }, close() { this.open = false; } };
  if (bal !== null && !R.store.has('b:k' + a)) R.store.set('b:k' + a, { v: bal, rev: 1 });
  await R.room.accept(sock, a, 'k' + a, true, { name: name + '.btc', checked: true });
  const p = { name, a, sock, log, R };
  if (spot) await tell(p, { t: 'sit', spot });
  if (watch) await tell(p, { t: 'watch', tb: watch });
  return p;
}
const tell = async (p, msg) => { await p.R.room.webSocketMessage(p.sock, JSON.stringify(msg)); advance(3000); };
const leave = async (p) => { p.sock.open = false; await p.R.room.webSocketClose(p.sock, 1000, 'bye'); };
const got = (p, t) => p.log.filter((m) => m.t === t);
const last = (p, t) => got(p, t).slice(-1)[0];
const bal = (R, p) => R.store.get('b:k' + p.a)?.v;
const sum = (R) => [...R.store.entries()].filter(([k]) => k.startsWith('b:')).reduce((n, [, v]) => n + v.v, 0);
const GID = (n) => n.toString(16).padStart(16, '0');
const snap = (w, b, sk, gid) => ({ k: 1, gid, w: w.a, b: b.a, sk, st: sk, m: '' });
const H = 'a'.repeat(16);
const cres = (gid, r, tm = 'checkmate', h = H) => ({ t: 'cres', tb: 'chess1', gid, r, tm, n: 40, h });
const cbet = (gid, side, amt) => ({ t: 'cbet', tb: 'chess1', gid, side, amt });
const table = async (R) => {
  const alice = await enter(R, 'alice', { spot: 'chess1.1' }), bob = await enter(R, 'bob', { spot: 'chess1.2' });
  const carol = await enter(R, 'carol', { watch: 'chess1' }), dan = await enter(R, 'dan', { watch: 'chess1' });
  return { alice, bob, carol, dan };
};
const open = async (T, gid, sk = 1000) => {
  await tell(T.alice, { t: 'seek', tb: 'chess1', stake: sk });
  await tell(T.alice, { t: 'seek', off: true });
  await tell(T.alice, { t: 'spec', tb: 'chess1', d: snap(T.alice, T.bob, sk, gid) });
};

// ---- features and kill switches
{
  const R = makeRoom(); const p = await enter(R, 'alice');
  const f = got(p, 'room')[0].features;
  assert.ok(f.includes('cres') && f.includes('cbet'), 'the room lists cres and cbet');
  const B = makeRoom({ CASINO_BETS_DISABLED: '1' }); const q = await enter(B, 'alice');
  assert.ok(got(q, 'room')[0].features.includes('cres') && !got(q, 'room')[0].features.includes('cbet'), 'bets off: results stay');
  const C = makeRoom({ CASINO_CHESS_RES_DISABLED: 'true' }); const r = await enter(C, 'alice');
  assert.ok(!got(r, 'room')[0].features.includes('cres') && !got(r, 'room')[0].features.includes('cbet'), 'chess off: neither');
  console.log('ok features and kill switches');
}

// ---- a game, bets, an agreed result
{
  const R = makeRoom(); const T = await table(R); const total0 = sum(R);
  await open(T, GID(1));
  assert.equal(bal(R, T.alice), 99_000); assert.equal(bal(R, T.bob), 99_000);
  assert.equal(last(T.alice, 'bal').why, 'chess-stake');
  assert.ok(R.store.get('cg:' + GID(1)) && R.store.get('ct:chess1') === GID(1));
  assert.ok(got(T.carol, 'spec').length >= 1, 'the spectator still gets the snapshot');
  await tell(T.carol, { t: 'cbet', tb: 'chess1', gid: GID(1), ask: true });
  assert.ok(last(T.carol, 'cpool'), 'an ask is answered with the pool');
  await tell(T.carol, cbet(GID(1), 'w', 1000)); await tell(T.dan, cbet(GID(1), 'b', 3000));
  assert.equal(last(T.carol, 'cbet').ok, true); assert.equal(bal(R, T.carol), 99_000); assert.equal(bal(R, T.dan), 97_000);
  await tell(T.alice, cbet(GID(1), 'b', 500)); assert.equal(last(T.alice, 'cbet').err, 'self');
  await tell(T.alice, cres(GID(1), '1-0')); assert.deepEqual(last(T.bob, 'cres'), { t: 'cres', tb: 'chess1', gid: GID(1), ask: true });
  await tell(T.bob, cres(GID(1), '1-0'));
  assert.equal(last(T.carol, 'cend').how, 'agreed'); assert.equal(last(T.bob, 'cend').r, '1-0');
  assert.equal(bal(R, T.alice), 101_000); assert.equal(bal(R, T.bob), 99_000); assert.equal(bal(R, T.carol), 103_000); assert.equal(bal(R, T.dan), 97_000);
  assert.equal(last(T.carol, 'cpay').won, 4000);
  assert.equal(sum(R), total0, 'nothing created or lost');
  assert.equal(R.store.get('ct:chess1'), undefined);
  const counters = [...R.store.entries()].filter(([k]) => k.startsWith('c:')).map(([, v]) => v)[0];
  assert.equal(counters.cg, 1);
  console.log('ok a game with two bets, agreed and paid; balances conserved');
}

// ---- a refused snapshot, a stake nobody offered, a dispute
{
  const R = makeRoom(); const T = await table(R); const total0 = sum(R);
  await tell(T.alice, { t: 'spec', tb: 'chess1', d: { ...snap(T.alice, T.bob, 0, GID(2)), b: T.carol.a } });
  assert.equal(last(T.alice, 'err').code, 'spec-bad-players'); assert.equal(got(T.carol, 'spec').length, 0, 'not passed on');
  await tell(T.alice, { t: 'spec', tb: 'chess1', d: snap(T.alice, T.bob, 1000, GID(2)) });          // no seek was made
  assert.equal(last(T.bob, 'cend').how, 'void'); assert.equal(bal(R, T.alice), 100_000);
  await open(T, GID(3));
  await tell(T.alice, cres(GID(3), '1-0')); await tell(T.bob, cres(GID(3), '1-0', 'checkmate', 'b'.repeat(16)));
  assert.equal(last(T.alice, 'cend').how, 'disputed'); assert.equal(bal(R, T.alice), 100_000); assert.equal(bal(R, T.bob), 100_000);
  assert.equal(sum(R), total0);
  const counters = [...R.store.entries()].filter(([k]) => k.startsWith('c:')).map(([, v]) => v)[0];
  assert.equal(counters.cd, 1, 'the dispute is counted');
  await tell(T.alice, { t: 'spec', tb: 'chess1', d: { k: 1, w: T.alice.a, b: 'house:gambit', h: 'gambit', st: 0 } });
  assert.ok(got(T.carol, 'spec').length >= 1 && !R.store.get('ct:chess1'), 'a house game is shown to the table and starts no record');
  console.log('ok refused snapshot, unoffered stake, dispute, house game');
}

// ---- leaving: a forfeit after the grace, found by the existing once-a-minute check
{
  const R = makeRoom(); const T = await table(R); const total0 = sum(R);
  await open(T, GID(4)); await tell(T.carol, cbet(GID(4), 'w', 500));
  await leave(T.bob);
  const gone = last(T.alice, 'cgone'); assert.equal(gone.a, T.bob.a); assert.ok(gone.until > Date.now() && gone.until <= Date.now() + 90_000);
  assert.ok(last(T.carol, 'cgone'), 'the table is told too');
  advance(60_000); await R.room.alarm(); assert.equal(R.store.get('cg:' + GID(4)).end, undefined, 'still inside the grace');
  advance(60_000); await R.room.alarm();
  const end = last(T.alice, 'cend'); assert.equal(end.how, 'forfeit'); assert.equal(end.a, T.bob.a); assert.equal(end.r, '1-0');
  assert.equal(bal(R, T.alice), 101_000); assert.equal(bal(R, T.bob), 99_000); assert.equal(bal(R, T.carol), 100_000);
  assert.equal(sum(R), total0);
  // Bob comes back later and is told once how it ended
  const bob2 = await enter(R, 'bob'); assert.equal(last(bob2, 'cend').how, 'forfeit');
  const bob3 = await enter(R, 'bob'); assert.equal(got(bob3, 'cend').length, 0);
  console.log('ok leaving: forfeit after the grace, found at the next check; the leaver is told on return');
}

// ---- leaving: back inside the grace
{
  const R = makeRoom(); const T = await table(R);
  await open(T, GID(5)); await leave(T.bob);
  advance(30_000);
  const bob2 = await enter(R, 'bob', { spot: 'chess1.2' });
  assert.deepEqual(last(T.alice, 'cgone'), { t: 'cgone', tb: 'chess1', gid: GID(5), a: T.bob.a, back: true });
  advance(300_000); await R.room.alarm();
  assert.equal(R.store.get('cg:' + GID(5)).end, undefined, 'no forfeit for a player who came back');
  await tell(bob2, cres(GID(5), '1-0', 'resignation'));
  assert.equal(last(T.alice, 'cend').how, 'unchallenged'); assert.equal(bal(R, T.alice), 101_000);
  console.log('ok leaving: back inside the grace, then a resignation');
}

// ---- the rows a whole game writes
{
  const R = makeRoom(); const T = await table(R); const fans = [];
  for (let i = 0; i < 20; i++) fans.push(await enter(R, 'fan' + String(i).padStart(2, '0'), { watch: 'chess1' }));
  R.ops.written = R.ops.deleted = R.ops.reads = 0;
  await open(T, GID(6), 1000); const start = R.ops.written;
  for (let i = 0; i < 20; i++) await tell(fans[i], cbet(GID(6), i % 2 ? 'w' : 'b', 500));
  const afterBets = R.ops.written;
  for (let i = 0; i < 100; i++) await tell(T.alice, { t: 'spec', tb: 'chess1', d: snap(T.alice, T.bob, 1000, GID(6)) });
  const afterSnaps = R.ops.written;
  await tell(T.alice, cres(GID(6), '1-0')); await tell(T.bob, cres(GID(6), '1-0'));
  console.log('[room cost] game with 20 bettors: rows written/deleted - opening ' + start + ', 20 bets ' + (afterBets - start) + ', 100 snapshots ' + (afterSnaps - afterBets) + ', end ' + (R.ops.written + R.ops.deleted - afterSnaps) + '; total ' + (R.ops.written + R.ops.deleted) + ' (the sweep and the other counters included)');
  assert.equal(afterSnaps - afterBets, 0, 'snapshots, pool updates and asks write nothing');
  assert.equal(last(T.alice, 'cend').how, 'agreed');
}
console.log('ALL OK');
