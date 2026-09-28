// Tests for xtrata-arcade-scores-v2. Run: node --test tests/
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl, randomPrivateKey, getAddressFromPrivateKey } from '@stacks/transactions';

const C = 'xtrata-arcade-scores-v2';
let simnet, A, deployer, W;

const pp = (cv) => Cl.prettyPrint(cv);
const call = (fn, args, sender) => simnet.callPublicFn(C, fn, args, sender);
const ro = (fn, args) => simnet.callReadOnlyFn(C, fn, args, deployer).result;
const okU = (n) => `(ok u${n})`;
const errU = (n) => `(err u${n})`;

const hash160 = (addr) => Buffer.from(Cl.serialize(Cl.principal(addr)).slice(4, 44), 'hex');
// A replay whose bytes 4..23 name its pilot (the submitting wallet), as the game writes them.
const replay = (seed, size = 64, pilot = null) => {
  const b = new Uint8Array(Math.max(size, 24));
  for (let i = 0; i < b.length; i++) b[i] = (seed * 31 + i * 7) & 255;
  if (pilot) b.set(hash160(pilot), 4);
  return b;
};

function setBoard(id, { mode = 0, max = 100_000_000, fee = 0, engine = 4242, daily = false, enabled = true } = {}) {
  return call('set-board', [Cl.stringAscii(id), Cl.uint(mode), Cl.uint(max), Cl.uint(fee), Cl.uint(engine), Cl.bool(daily), Cl.bool(enabled)], deployer);
}
function submit(board, period, score, name, who, rp = replay(score, 64, who)) {
  return call('submit-score', [Cl.stringAscii(board), Cl.uint(period), Cl.uint(score), Cl.stringAscii(name), Cl.buffer(rp)], who);
}
function top10(board, period = 0) {
  const list = ro('get-top10', [Cl.stringAscii(board), Cl.uint(period)]);
  return list.value.map((o) => (o.type === 'some' ? {
    player: o.value.value.player.value,
    score: Number(o.value.value.score.value),
    name: o.value.value.name.value,
  } : null));
}
const scores = (b, p = 0) => top10(b, p).filter(Boolean).map((e) => e.score);

before(async () => {
  simnet = await initSimnet('./Clarinet.toml');
  A = simnet.getAccounts();
  deployer = A.get('deployer');
  W = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => A.get(`wallet_${i}`));
  const extra = ['faucet'].map((k) => A.get(k));
  W.push(...extra);
});

test('only registered boards accept scores', () => {
  assert.equal(pp(submit('nope', 0, 10, 'AAA', W[0]).result), errU(102));
});

test('only the owner can set boards', () => {
  const r = call('set-board', [Cl.stringAscii('x'), Cl.uint(0), Cl.uint(10), Cl.uint(0), Cl.uint(1), Cl.bool(false), Cl.bool(true)], W[0]);
  assert.equal(pp(r.result), errU(100));
  assert.equal(pp(setBoard('bad-mode', { mode: 2 }).result), errU(110));
  assert.equal(pp(setBoard('bad-fee', { fee: 1_000_001 }).result), errU(110));
});

test('ranks, ordering and ties (earlier keeps its place)', () => {
  setBoard('t-order');
  assert.equal(pp(submit('t-order', 0, 500, 'AAA', W[0]).result), okU(1));
  assert.equal(pp(submit('t-order', 0, 900, 'BBB', W[1]).result), okU(1));
  assert.equal(pp(submit('t-order', 0, 700, 'CCC', W[2]).result), okU(2));
  assert.equal(pp(submit('t-order', 0, 700, 'DDD', W[3]).result), okU(3)); // tie goes below
  assert.deepEqual(scores('t-order'), [900, 700, 700, 500]);
  assert.deepEqual(top10('t-order').slice(0, 4).map((e) => e.name), ['BBB', 'CCC', 'DDD', 'AAA']);
  // player-rank index kept in sync after shifts
  assert.equal(pp(ro('get-player-rank', [Cl.stringAscii('t-order'), Cl.uint(0), Cl.principal(W[0])])), '(some u4)');
});

test('one entry per wallet: worse refused, better replaces', () => {
  setBoard('t-one');
  submit('t-one', 0, 300, 'AAA', W[0]);
  submit('t-one', 0, 200, 'BBB', W[1]);
  assert.equal(pp(submit('t-one', 0, 300, 'AAA', W[0]).result), errU(108)); // equal is not an improvement
  assert.equal(pp(submit('t-one', 0, 250, 'AAA', W[0]).result), errU(108));
  assert.equal(pp(submit('t-one', 0, 150, 'BBB', W[1]).result), errU(108));
  assert.equal(pp(submit('t-one', 0, 400, 'BB2', W[1]).result), okU(1));
  assert.deepEqual(scores('t-one'), [400, 300]);
  assert.equal(top10('t-one')[0].name, 'BB2');
});

test('a full board evicts rank 10 and deletes its replay', () => {
  setBoard('t-full');
  for (let i = 0; i < 9; i++) submit('t-full', 0, 1000 + i * 10, 'P' + i + 'x', W[i]);
  submit('t-full', 0, 500, 'LOW', deployer); // 10th, lowest
  assert.equal(scores('t-full').length, 10);
  assert.equal(pp(ro('get-replay', [Cl.stringAscii('t-full'), Cl.uint(0), Cl.principal(deployer)])).startsWith('(some'), true);
  // a lower score cannot enter
  // (all 10 players are on the board, so reuse one of them trying to go lower is NOT-IMPROVED; use a fresh account)
  const fresh = A.get('wallet_1'); // already on board; use improvement path instead
  assert.equal(pp(submit('t-full', 0, 999, 'IMP', fresh).result), errU(108));
  // deployer improves from 500 to 1200 -> rank 1, nobody evicted (own entry replaced)
  assert.equal(pp(submit('t-full', 0, 1200, 'TOP', deployer).result), okU(1));
  assert.equal(scores('t-full').length, 10);
  assert.equal(scores('t-full')[9], 1000);
});

test('an outsider evicts rank 10, whose replay and index are deleted', () => {
  setBoard('t-evict');
  const ten = [...W.slice(0, 9), deployer];
  ten.forEach((w, i) => submit('t-evict', 0, 100 + i, 'N' + i + 'x', w));
  assert.equal(scores('t-evict').length, 10);
  const outsider = getAddressFromPrivateKey(randomPrivateKey(), 'testnet');
  assert.equal(pp(submit('t-evict', 0, 50, 'OUT', outsider).result), errU(109));
  assert.equal(pp(submit('t-evict', 0, 104, 'OUT', outsider).result), okU(7)); // ties stay ahead
  assert.deepEqual(scores('t-evict'), [109, 108, 107, 106, 105, 104, 104, 103, 102, 101]);
  const evicted = ten[0];
  assert.equal(pp(ro('get-replay', [Cl.stringAscii('t-evict'), Cl.uint(0), Cl.principal(evicted)])), 'none');
  assert.equal(pp(ro('get-player-rank', [Cl.stringAscii('t-evict'), Cl.uint(0), Cl.principal(evicted)])), 'none');
});

test('score cap, name rules and empty replay', () => {
  setBoard('t-rules', { max: 1000 });
  assert.equal(pp(submit('t-rules', 0, 0, 'AAA', W[0]).result), errU(104));
  assert.equal(pp(submit('t-rules', 0, 1001, 'AAA', W[0]).result), errU(104));
  assert.equal(pp(submit('t-rules', 0, 10, 'AB', W[0]).result), errU(105));
  assert.equal(pp(submit('t-rules', 0, 10, '<b>', W[0]).result), errU(105));
  assert.equal(pp(submit('t-rules', 0, 10, 'Jim.btc', W[0], new Uint8Array(0)).result), errU(107));
  assert.equal(pp(submit('t-rules', 0, 10, 'Jim.btc', W[0], new Uint8Array(10)).result), errU(113));
  assert.equal(pp(submit('t-rules', 0, 1000, 'Jim.btc', W[0]).result), okU(1));
});

test('non-daily boards only accept period 0', () => {
  setBoard('t-period');
  assert.equal(pp(submit('t-period', 1, 10, 'AAA', W[0]).result), errU(106));
});

test('daily boards accept the current and previous period only', () => {
  setBoard('t-daily', { daily: true });
  simnet.mineEmptyBurnBlocks(300);
  const cur = Number(ro('current-period', []).value);
  assert.ok(cur >= 2);
  assert.equal(pp(submit('t-daily', cur, 10, 'AAA', W[0]).result), okU(1));
  assert.equal(pp(submit('t-daily', cur - 1, 10, 'AAA', W[0]).result), okU(1));
  assert.equal(pp(submit('t-daily', cur - 2, 10, 'AAA', W[0]).result), errU(106));
  assert.equal(pp(submit('t-daily', cur + 1, 10, 'AAA', W[0]).result), errU(106));
  // separate periods are separate boards
  assert.deepEqual(scores('t-daily', cur), [10]);
  assert.deepEqual(scores('t-daily', cur - 1), [10]);
});

test('replay bytes and hash are stored', () => {
  setBoard('t-replay');
  const rp = replay(7, 65536, W[0]);
  const r = submit('t-replay', 0, 77, 'REP', W[0], rp);
  assert.equal(pp(r.result), okU(1));
  const stored = ro('get-replay', [Cl.stringAscii('t-replay'), Cl.uint(0), Cl.principal(W[0])]);
  assert.equal(Buffer.from(stored.value.value, 'hex').equals(Buffer.from(rp)), true);
  const entry = ro('get-entry', [Cl.stringAscii('t-replay'), Cl.uint(0), Cl.uint(1)]);
  const hash = entry.value.value['replay-hash'].value;
  assert.equal(hash, createHash('sha256').update(rp).digest('hex'));
  assert.equal(Number(entry.value.value['engine-id'].value), 4242);
});

test('fees are paid only when the board sets one', () => {
  setBoard('t-fee', { fee: 10_000 });
  const r = submit('t-fee', 0, 5, 'FEE', W[0]);
  assert.equal(pp(r.result), okU(1));
  const t = r.events.find((e) => e.event === 'stx_transfer_event');
  assert.ok(t, 'expected an STX transfer');
  assert.equal(t.data.amount, '10000');
  assert.equal(t.data.recipient, deployer);
  setBoard('t-free');
  const r2 = submit('t-free', 0, 5, 'FRE', W[0]);
  assert.equal(r2.events.some((e) => e.event === 'stx_transfer_event'), false);
});

test('void-entry: owner only, closes the gap, deletes replay', () => {
  setBoard('t-void');
  submit('t-void', 0, 300, 'AAA', W[0]);
  submit('t-void', 0, 200, 'BBB', W[1]);
  submit('t-void', 0, 100, 'CCC', W[2]);
  const args = [Cl.stringAscii('t-void'), Cl.uint(0), Cl.principal(W[0]), Cl.stringAscii('replay mismatch')];
  assert.equal(pp(call('void-entry', args, W[1]).result), errU(100));
  assert.equal(pp(call('void-entry', args, deployer).result), '(ok true)');
  assert.deepEqual(scores('t-void'), [200, 100]);
  assert.equal(pp(ro('get-replay', [Cl.stringAscii('t-void'), Cl.uint(0), Cl.principal(W[0])])), 'none');
  assert.equal(pp(ro('get-player-rank', [Cl.stringAscii('t-void'), Cl.uint(0), Cl.principal(W[2])])), '(some u2)');
  assert.equal(pp(call('void-entry', args, deployer).result), errU(111));
});

test('lower-wins (time) boards', () => {
  setBoard('t-time', { mode: 1 });
  submit('t-time', 0, 5000, 'AAA', W[0]);
  assert.equal(pp(submit('t-time', 0, 4000, 'BBB', W[1]).result), okU(1));
  assert.equal(pp(submit('t-time', 0, 6000, 'AAA', W[0]).result), errU(108));
  assert.equal(pp(submit('t-time', 0, 3000, 'AAA', W[0]).result), okU(1));
  assert.deepEqual(scores('t-time'), [3000, 4000]);
});

test('pause and disabled boards block submissions', () => {
  setBoard('t-pause');
  assert.equal(pp(call('set-paused', [Cl.bool(true)], W[0]).result), errU(100));
  call('set-paused', [Cl.bool(true)], deployer);
  assert.equal(pp(submit('t-pause', 0, 1, 'AAA', W[0]).result), errU(101));
  call('set-paused', [Cl.bool(false)], deployer);
  call('set-board-enabled', [Cl.stringAscii('t-pause'), Cl.bool(false)], deployer);
  assert.equal(pp(submit('t-pause', 0, 1, 'AAA', W[0]).result), errU(103));
});

test('two-step ownership', () => {
  assert.equal(pp(call('accept-owner', [], W[0]).result), errU(112));
  call('propose-owner', [Cl.principal(W[0])], deployer);
  assert.equal(pp(call('accept-owner', [], W[1]).result), errU(100));
  assert.equal(pp(call('accept-owner', [], W[0]).result), '(ok true)');
  assert.equal(pp(ro('get-owner', [])), `'${W[0]}`);
  // hand it back
  call('propose-owner', [Cl.principal(deployer)], W[0]);
  call('accept-owner', [], deployer);
  assert.equal(pp(ro('get-owner', [])), `'${deployer}`);
});

test('fuzz: contract matches a reference model and preview-rank', () => {
  setBoard('t-fuzz', { max: 5000 });
  const players = [...W, deployer];
  let model = []; // [{p, s}] sorted, earlier first on ties
  let seed = 12345;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);
  for (let i = 0; i < 250; i++) {
    const p = players[Math.floor(rnd() * players.length)];
    const s = 1 + Math.floor(rnd() * 5000);
    const preview = Number(ro('preview-rank', [Cl.stringAscii('t-fuzz'), Cl.uint(0), Cl.uint(s), Cl.principal(p)]).value);
    // model
    const mine = model.find((e) => e.p === p);
    let expect;
    if (mine && !(s > mine.s)) expect = 'err108';
    else {
      const others = model.filter((e) => e.p !== p);
      const ahead = others.filter((e) => e.s >= s).length;
      if (ahead + 1 > 10) expect = 'err109';
      else {
        others.splice(ahead, 0, { p, s });
        model = others.slice(0, 10);
        expect = ahead + 1;
      }
    }
    const r = pp(submit('t-fuzz', 0, s, 'FUZ', p).result);
    if (expect === 'err108') { assert.equal(r, errU(108)); assert.equal(preview, 0); }
    else if (expect === 'err109') { assert.equal(r, errU(109)); assert.equal(preview, 0); }
    else { assert.equal(r, okU(expect)); assert.equal(preview, expect); }
    assert.deepEqual(scores('t-fuzz'), model.map((e) => e.s));
  }
  // every stored replay belongs to an on-board player, and only those
  for (const p of players) {
    const onBoard = model.some((e) => e.p === p);
    const rp = pp(ro('get-replay', [Cl.stringAscii('t-fuzz'), Cl.uint(0), Cl.principal(p)]));
    assert.equal(rp !== 'none', onBoard, `replay presence for ${p}`);
  }
});

test('a replay cannot be submitted by any wallet other than its pilot', () => {
  setBoard('t-pilot');
  const run = replay(99, 200, W[0]);
  assert.equal(pp(submit('t-pilot', 0, 500, 'OWN', W[0], run).result), okU(1));
  // an exact copy from another wallet (e.g. lifted from get-replay or the mempool)
  assert.equal(pp(submit('t-pilot', 0, 600, 'THF', W[1], run).result), errU(113));
  assert.equal(scores('t-pilot').length, 1);
});

test('void-entry bars the wallet from that board until lifted', () => {
  setBoard('t-ban');
  submit('t-ban', 0, 900, 'BAD', W[3]);
  call('void-entry', [Cl.stringAscii('t-ban'), Cl.uint(0), Cl.principal(W[3]), Cl.stringAscii('replay mismatch')], deployer);
  assert.equal(pp(submit('t-ban', 0, 950, 'BAD', W[3]).result), errU(114));
  assert.equal(Number(ro('preview-rank', [Cl.stringAscii('t-ban'), Cl.uint(0), Cl.uint(950), Cl.principal(W[3])]).value), 0);
  assert.equal(pp(call('set-banned', [Cl.stringAscii('t-ban'), Cl.principal(W[3]), Cl.bool(false)], W[0]).result), errU(100));
  call('set-banned', [Cl.stringAscii('t-ban'), Cl.principal(W[3]), Cl.bool(false)], deployer);
  assert.equal(pp(submit('t-ban', 0, 950, 'BAD', W[3]).result), okU(1));
});

test('a board cannot change its ordering once created', () => {
  setBoard('t-mode', { mode: 0 });
  assert.equal(pp(setBoard('t-mode', { mode: 1 }).result), errU(110));
  assert.equal(pp(setBoard('t-mode', { mode: 0, max: 5 }).result), '(ok true)');
});
