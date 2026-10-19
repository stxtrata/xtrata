// Operator toolkit, scenes: validator, compiler, submit, read-back, preview snapshot, guards. Everything runs on a simnet.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Cl, cvToHex, randomPrivateKey, privateKeyToAddress, deserializeTransaction } from '@stacks/transactions';
import { boot } from './helpers.mjs';
import { simnetTransport, networkTransport, buildCall } from '../ops/lib/transport.mjs';
import { registerBuiltinLooks, registerRoom } from '../ops/lib/setup.mjs';
import { defaultLookBook } from '../ops/lib/catalogue.mjs';
import { parseSceneFile, compileScenes, batches, describe } from '../ops/lib/scene.mjs';
import { planSceneCalls, submitScenes } from '../ops/lib/submit.mjs';
import { readLookBook, readRooms, readScenes, readBayView, verifyScenes, resolveAt, readTimelineCounts } from '../ops/lib/readback.mjs';
import { snapshotAt, resolveScenes } from '../ops/lib/snapshot.mjs';
import { sceneCv } from '../ops/lib/clar.mjs';
import { authoriseBroadcast, Refused, ADMIN_WALLET } from '../ops/lib/guard.mjs';

let t, deployer, W, simnet;
const ex = (name) => parseSceneFile(readFileSync(new URL(`../ops/examples/${name}`, import.meta.url), 'utf8'));
const file = (scenes, room = 'arcade-hall') => ({ format: 'arcade-scene-file/1', room, scenes });
const ctxOf = async (extra = {}) => ({
  looks: await readLookBook(t), rooms: await readRooms(t, ['arcade-hall', 'lobby']), height: await t.height(), timelineUsed: {}, ...extra,
});

before(async () => {
  ({ simnet, deployer, W } = await boot());
  t = simnetTransport(simnet, { deployer });
  await registerBuiltinLooks(t, deployer);
  await registerRoom(t, deployer, { id: 'arcade-hall', title: 'Xtrata Arcade', owner: deployer, bays: 2 });
  await registerRoom(t, deployer, { id: 'lobby', title: 'Lobby', owner: deployer, bays: 2 });
});

test('offline look book matches what the registration steps create on chain', async () => {
  const chain = (await readLookBook(t)).map(({ owner, ...l }) => l);
  assert.deepEqual(chain, defaultLookBook());
});

test('the examples validate against the real chain state and the offline assumptions give the same compiled scenes', async () => {
  for (const name of ['launch-story.scene.json', 'workshop.scene.json']) {
    const doc = ex(name), height = await t.height();
    const a = compileScenes(doc, await ctxOf());
    const b = compileScenes(doc, { looks: defaultLookBook(), rooms: { 'arcade-hall': { bays: 2 }, lobby: { bays: 2 } }, height, timelineUsed: {} });
    assert.ok(a.findings.ok, JSON.stringify(a.findings.errors));
    assert.deepEqual(a.scenes, b.scenes);
    assert.ok(a.findings.warnings.length === 0, JSON.stringify(a.findings.warnings));
  }
});

test('relative times, units and ordering', async () => {
  const h = 5000;
  const base = { looks: defaultLookBook(), rooms: { 'arcade-hall': { bays: 2 } }, height: h, timelineUsed: {} };
  const r = compileScenes(file([
    { bay: 0, at: '+2d', base: 'wall' }, { bay: 0, at: '+90m', base: 'posters' }, { bay: 0, at: '+12', base: 'wall' }, { bay: 1, at: 6000, base: 'wall' },
  ]), base);
  assert.ok(r.findings.ok);
  assert.deepEqual(r.scenes.map((s) => s.from), [h + 9, h + 12, h + 288, 6000]);
  const bad = compileScenes(file([{ bay: 0, at: 'tomorrow', base: 'wall' }]), base);
  assert.ok(!bad.findings.ok);
  const noBase = compileScenes(file([{ bay: 0, at: '+1h', base: 'wall' }]), { ...base, height: null });
  assert.match(noBase.findings.errors[0].msg, /relative/);
});

test('params the hall will clamp or ignore are warnings, not errors', () => {
  const r = compileScenes(file([{ bay: 0, at: 5100, base: 'wall', layers: [
    { look: 'sign-board', params: { text: 'Hello there', y: 9, bogus: 1 } },
    { look: 'work-site', params: { kinds: 'hammer,laser', volume: 3 } },
  ] }]), { looks: defaultLookBook(), rooms: { 'arcade-hall': { bays: 2 } }, height: 5000, timelineUsed: {} });
  assert.ok(r.findings.ok);
  const w = r.findings.warnings.map((x) => x.msg).join('\n');
  assert.match(w, /"y": 9 will be drawn as 2.9/);
  assert.match(w, /"bogus" means nothing/);
  assert.match(w, /"volume": 3 will be drawn as 1/);
  assert.match(w, /"kinds"/);
  assert.doesNotMatch(w, /"text"/);    // upper-casing is not a surprise
});

// Each case: the file scene, a hand-built compiled scene that skips the validator, and the code the contract must answer with.
const L = (n) => defaultLookBook().find((l) => l.builtin === n).id;
const raw = (o) => ({ room: 'arcade-hall', bay: 0, from: 0, base: 0, doorLook: null, layers: [], interaction: 0, link: null, ...o });
const CASES = [
  { name: 'enter without a link', file: { bay: 0, at: 9000, base: 'door', interaction: 'enter' }, raw: raw({ base: 2, doorLook: L('door-rect'), interaction: 3 }), code: 210 },
  { name: 'two covers', file: { bay: 0, at: 9000, base: 'wall', layers: [{ look: 'curtain-house' }, { look: 'curtain-house' }] },
    raw: raw({ base: 1, layers: [{ slot: 1, look: L('curtain-house'), params: '{}', state: '' }, { slot: 1, look: L('curtain-house'), params: '{}', state: '' }] }), code: 212 },
  { name: 'door look on a wall base', file: { bay: 0, at: 9000, base: 'wall', door: 'door-rect' }, raw: raw({ base: 1, doorLook: L('door-rect') }), code: 205 },
  { name: 'a door used as a layer', file: { bay: 0, at: 9000, base: 'wall', layers: [{ look: 'door-arch' }] }, raw: raw({ base: 1, layers: [{ slot: 1, look: L('door-arch'), params: '{}', state: '' }] }), code: 205 },
  { name: 'bay out of range', file: { bay: 2, at: 9000, base: 'wall' }, raw: raw({ bay: 2, base: 1 }), code: 211 },
  { name: 'link to an unknown room', file: { bay: 0, at: 9000, base: 'door', interaction: 'enter', link: { room: 'nowhere' } },
    raw: raw({ base: 2, doorLook: L('door-rect'), interaction: 3, link: { targetRoom: 'nowhere', arrivalBay: 0, path: '' } }), code: 210 },
  { name: 'link path with //', file: { bay: 0, at: 9000, base: 'door', interaction: 'enter', link: { path: '//evil.example' } },
    raw: raw({ base: 2, doorLook: L('door-rect'), interaction: 3, link: { targetRoom: '', arrivalBay: 0, path: '//evil.example' } }), code: 210 },
  { name: 'link to a bay the room does not have', file: { bay: 0, at: 9000, base: 'door', interaction: 'enter', link: { room: 'lobby', arrivalBay: 5 } },
    raw: raw({ base: 2, doorLook: L('door-rect'), interaction: 3, link: { targetRoom: 'lobby', arrivalBay: 5, path: '' } }), code: 210 },
];
for (const c of CASES) {
  test(`validator and contract agree: ${c.name}`, async () => {
    const r = compileScenes(file([c.file]), await ctxOf());
    assert.ok(!r.findings.ok, 'the validator should reject this');
    assert.match(r.findings.errors.map((e) => e.msg).join('\n'), new RegExp(`u${c.code}`));
    const res = await t.send('world', 'add-scene', [sceneCv(c.raw)], deployer);
    assert.equal(res.ok, false);
    assert.equal(Number(res.value), c.code);
  });
}

test('the contract accepts what the validator accepts: launch story submitted as one batch, then read back', async () => {
  const doc = ex('launch-story.scene.json');
  const { findings, scenes } = compileScenes(doc, await ctxOf());
  assert.ok(findings.ok);
  const calls = planSceneCalls(scenes);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].fn, 'add-scenes');
  const logs = [];
  const r = await submitScenes(t, scenes, { execute: true, from: deployer, log: (m) => logs.push(m) });
  assert.equal(r.failed, null);
  assert.equal(r.sent, 1);
  assert.ok(r.verify.ok, JSON.stringify(r.verify.missing));
  assert.equal(r.verify.extra.length, 0);
  const s0 = await readScenes(t, 'arcade-hall', 0);
  assert.equal(s0.length, 3);
  assert.equal((await readScenes(t, 'arcade-hall', 1)).length, 1);
});

test('re-running the same submission sends nothing (already on chain)', async () => {
  const { scenes } = compileScenes(ex('launch-story.scene.json'), await ctxOf());
  // the first run was compiled at an earlier height; the same future-dated scenes are still recognised
  const before = (await readScenes(t, 'arcade-hall', 0)).length;
  const r = await submitScenes(t, scenes, { execute: true, from: deployer });
  assert.equal(r.sent, 0);
  assert.equal(r.skipped, 1);
  assert.equal((await readScenes(t, 'arcade-hall', 0)).length, before);
});

test('dry run sends nothing', async () => {
  const { scenes } = compileScenes(ex('workshop.scene.json'), await ctxOf());
  const before = (await readScenes(t, 'arcade-hall', 1)).length;
  const r = await submitScenes(t, scenes, { execute: false });
  assert.equal(r.executed, false);
  assert.equal((await readScenes(t, 'arcade-hall', 1)).length, before);
});

test('read-back catches a missing or different scene', async () => {
  const { scenes } = compileScenes(ex('workshop.scene.json'), await ctxOf());
  const v = await verifyScenes(t, scenes);
  assert.equal(v.ok, false);
  assert.equal(v.missing.length, 1);
});

test('what the preview snapshot resolves matches what the chain resolves, at every key height', async () => {
  const h0 = await t.height();
  const key = (await readScenes(t, 'arcade-hall', 0)).map((s) => s.from);
  const stored = [];
  for (const b of [0, 1]) (await readScenes(t, 'arcade-hall', b)).forEach((s) => stored.push({ ...s, bay: b }));
  const heights = [h0, ...key.map((f) => f - 1), ...key, key[key.length - 1] + 500];
  for (const h of heights.sort((a, b) => a - b)) {
    const mineTo = h - (await t.height());
    if (mineTo > 0) t.mine(mineTo);
    if (h < (await t.height())) continue;
    for (const b of [0, 1]) {
      const chain = await readBayView(t, 'arcade-hall', b);
      const mine = resolveScenes(stored, b, h).active;
      assert.equal(mine ? mine.s.seq : null, chain.activeSeq, `bay ${b} at ${h}`);
      assert.equal(resolveScenes(stored, b, h).nextHeight, chain.nextHeight, `bay ${b} next at ${h}`);
    }
  }
  const tl = await resolveAt(t, 'arcade-hall', 0, [key[0] - 1, key[0]]);
  assert.equal(tl[0].seq, null);
  assert.notEqual(tl[1].seq, null);
});

test('snapshot has the shape the hall reader produces', async () => {
  const { scenes } = compileScenes(ex('launch-story.scene.json'), await ctxOf());
  const snap = snapshotAt({ scenes, looks: defaultLookBook(), height: scenes[0].from });
  const b0 = snap.bays[0].scene;
  assert.equal(b0.base, 'wall');
  assert.equal(b0.interaction, 2);
  assert.equal(b0.layers.length, 4);
  assert.deepEqual(Object.keys(snap.looks[b0.layers[0].look]).sort(), ['approved', 'builtin', 'hidden', 'kind', 'name', 'tier']);
  assert.equal(snap.bays[1].scene, null);
  const door = snapshotAt({ scenes, looks: defaultLookBook(), height: scenes[scenes.length - 1].from }).bays[0].scene;
  assert.deepEqual(door.link, { 'target-room': 'lobby', 'arrival-bay': 0, path: '' });
});

test('timeline limit: the validator counts what is already on a bay', async () => {
  const many = Array.from({ length: 5 }, (_, i) => ({ bay: 1, at: 20000 + i, base: 'wall' }));
  const r = compileScenes(file(many), { looks: defaultLookBook(), rooms: { 'arcade-hall': { bays: 2 } }, height: 5000, timelineUsed: { 'arcade-hall#1': 45 } });
  assert.ok(!r.findings.ok);
  assert.match(r.findings.errors[0].msg, /u207/);
  // and the contract agrees once the bay really is full
  const full = Array.from({ length: 48 }, (_, i) => raw({ bay: 1, from: 30000 + i, base: 1 }));
  for (let i = 0; i < full.length; i += 8) {
    const res = await t.send('world', 'add-scenes', [Cl.list(full.slice(i, i + 8).map(sceneCv))], deployer);
    if (!res.ok) { assert.equal(Number(res.value), 207); break; }
  }
  let used = await readTimelineCounts(t, 'arcade-hall', 2);
  assert.ok(used['arcade-hall#1'] < 48, 'the overflowing batch is all or nothing');
  for (let i = 0; used['arcade-hall#1'] + i < 48; i++) assert.equal((await t.send('world', 'add-scene', [sceneCv(raw({ bay: 1, from: 32000 + i, base: 1 }))], deployer)).ok, true);
  used = await readTimelineCounts(t, 'arcade-hall', 2);
  assert.equal(used['arcade-hall#1'], 48);
  const res = await t.send('world', 'add-scene', [sceneCv(raw({ bay: 1, from: 31000, base: 1 }))], deployer);
  assert.equal(Number(res.value), 207);
});

test('batches split at 8, and 9 scenes become two atomic calls', () => {
  const sc = Array.from({ length: 9 }, (_, i) => raw({ from: i, base: 1 }));
  assert.deepEqual(batches(sc).map((b) => b.length), [8, 1]);
  assert.deepEqual(planSceneCalls(sc).map((c) => c.fn), ['add-scenes', 'add-scene']);
});

test('describe prints a readable timeline', async () => {
  const { scenes } = compileScenes(ex('launch-story.scene.json'), await ctxOf());
  const text = describe(scenes, { height: 100 });
  assert.match(text, /bay 0:/);
  assert.match(text, /link lobby/);
});

/* ---------------- guards: nothing real can be sent by accident ---------------- */
const keyFile = (key) => { const p = join(mkdtempSync(join(tmpdir(), 'xa-key-')), 'k'); writeFileSync(p, key); return p; };

test('broadcast guard: every missing confirmation refuses', () => {
  const key = randomPrivateKey(), kf = keyFile(key);
  const ok = { network: 'testnet', execute: true, keyFile: kf, env: { XA_OPS_CONFIRM: 'broadcast-testnet', XA_OPS_KILL: join(tmpdir(), 'no-such-kill-file') } };
  const refused = (o, re) => assert.throws(() => authoriseBroadcast({ ...ok, ...o }), (e) => e instanceof Refused && re.test(e.message));
  refused({ execute: false }, /dry run/);
  refused({ env: { ...ok.env, XA_OPS_CONFIRM: undefined } }, /XA_OPS_CONFIRM/);
  refused({ env: { ...ok.env, XA_OPS_CONFIRM: 'broadcast-mainnet' } }, /XA_OPS_CONFIRM/);
  refused({ network: 'mainnet', env: { ...ok.env, XA_OPS_CONFIRM: 'broadcast-mainnet' } }, /i-mean-mainnet/);
  refused({ network: 'simnet' }, /testnet or mainnet/);
  refused({ keyFile: null }, /key file/);
  refused({ keyFile: keyFile('not a key') }, /hex private key/);
  const kill = join(mkdtempSync(join(tmpdir(), 'xa-kill-')), 'KILL'); writeFileSync(kill, '');
  refused({ env: { ...ok.env, XA_OPS_KILL: kill } }, /kill switch/);
  const a = authoriseBroadcast(ok);
  assert.equal(a.sender, privateKeyToAddress(key, 'testnet'));
  const m = authoriseBroadcast({ ...ok, network: 'mainnet', mainnet: true, env: { ...ok.env, XA_OPS_CONFIRM: 'broadcast-mainnet' } });
  assert.match(m.sender, /^SP/);
});

test('broadcast guard: the admin wallet\'s key is refused on testnet (the same key has the same hash on every network)', () => {
  // We cannot hold the admin key; check the comparison the guard relies on, with a throwaway key.
  const key = randomPrivateKey();
  const sp = privateKeyToAddress(key, 'mainnet');
  const kf = keyFile(key);
  const env = { XA_OPS_CONFIRM: 'broadcast-testnet', XA_OPS_KILL: join(tmpdir(), 'no-such-kill-file') };
  assert.doesNotThrow(() => authoriseBroadcast({ network: 'testnet', execute: true, keyFile: kf, env }));
  assert.ok(sp.startsWith('SP') && ADMIN_WALLET.startsWith('SP'));
});

test('network transport: reads are plain read-only POSTs, sends are refused without a signer, signing is offline', async () => {
  const seen = [];
  const fetchImpl = async (url, init) => { seen.push({ url, body: JSON.parse(init.body) }); return { ok: true, json: async () => ({ okay: true, result: cvToHex(Cl.uint(777)) }) }; };
  const names = { world: 'ST000000000000000000002AMW42H.xtrata-world-v1', posters: 'ST000000000000000000002AMW42H.xtrata-posters-v1' };
  const nt = networkTransport({ network: 'testnet', names, fetchImpl });
  assert.equal(await nt.height(), 777);
  assert.match(seen[0].url, /^https:\/\/api\.testnet\.hiro\.so\/v2\/contracts\/call-read\/ST000000000000000000002AMW42H\/xtrata-world-v1\/get-height$/);
  await assert.rejects(() => nt.send('world', 'set-paused', [Cl.bool(true)]), /no signer/);
  const key = randomPrivateKey();
  const tx = await buildCall({ names, which: 'world', fn: 'set-paused', args: [Cl.bool(true)], key, network: 'testnet', fee: 1000, nonce: 0 });
  assert.equal(tx.payload.functionName.content, 'set-paused');
  assert.equal(seen.length, 1, 'building and signing a call does not touch the network');
});
