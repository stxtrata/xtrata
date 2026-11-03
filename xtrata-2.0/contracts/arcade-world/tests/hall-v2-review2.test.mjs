// The v2 operator tools after the second review (23 Oct 2026): hall-only seed and the lobby later, STATE-only publisher grants
// with expiry (review L8), rooms that open from an entry inscription read from the core, the pure browser call list, and the
// read-back that stops at the first predicted id the chain does not have. Everything runs against the real contract in a simnet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cl } from '@stacks/transactions';
import { boot, pp, hash32, mockInscription } from './helpers.mjs';
import { argCv } from '../ops/lib/steps.mjs';
import * as V2 from '../ops/lib/v2.mjs';
import * as Plan from '../ops/lib/v2-plan.mjs';
import { simnetReader, readEntry } from '../ops/lib/v2read.mjs';
import { readHall, simnetRead } from '../ops/lib/hallread.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const demo = JSON.parse(readFileSync(join(root, 'ops', 'examples', 'four-doorways-testnet-hall.scene.json'), 'utf8'));
const CONTRACT = 'xtrata-world-v2';
// the demo without its door to the lobby (a hall-only seed cannot link to a room it does not build)
const noLink = () => {
  const d = JSON.parse(JSON.stringify(demo));
  for (const s of d.scenes) if (s.link) { delete s.link; if (s.interaction === 'enter') s.interaction = 'knock'; }
  return d;
};
const lobbyDoc = { format: 'arcade-scene-file/1', room: 'lobby', scenes: [
  { bay: 1, at: 0, base: 'door', door: 'door-arch', interaction: 'knock', layers: [{ look: 'sign-board', params: { text: 'casino' } }] },
] };

async function chain() {
  const { simnet, deployer, W } = await boot();
  const names = { deployer, publisher: W[0], other: W[1] };
  const who = (v) => names[v] || v;
  const call = (s) => simnet.callPublicFn(CONTRACT, s.fn, s.args.map((a) => argCv(a, who)), who(s.as));
  const run = (plan, skip = -1) => plan.steps.forEach((s, i) => {
    if (i === skip) return;
    const r = call(s);
    assert.equal(r.result.type, 'ok', `step ${i + 1} ${s.fn} (${s.note}): ${pp(r.result)}`);
  });
  const reg = simnetReader(simnet, deployer, who)(`${deployer}.${CONTRACT}`);
  const hallRead = () => readHall({ read: simnetRead(simnet, deployer), registry: `${deployer}.${CONTRACT}` });
  return { simnet, deployer, W, who, call, run, reg, hallRead };
}

test('the pure planner has no imports and its frozen kind list is exactly the one read from the hall\'s source', () => {
  const src = readFileSync(join(root, 'ops', 'lib', 'v2-plan.mjs'), 'utf8');
  assert.equal(/^\s*import\s/m.test(src), false, 'v2-plan.mjs must not import anything (a browser loads it as is)');
  assert.equal(/\brequire\(|process\.|node:/.test(src), false);
  assert.deepEqual(Plan.HALL_KINDS.map((k) => ({ ...k })), V2.kindRegistry());
  // v2.mjs still exports everything it did, plus the new pieces
  for (const k of ['planSeed', 'planPatch', 'planAdd', 'planBay', 'planReset', 'planRoom', 'planDeploy', 'chunkSteps', 'whenOf', 'kindRegistry', 'PLAN_BOOK',
    'ROOMS', 'LIMITS', 'CAP', 'policyArg', 'stateArg', 'newManifest', 'stepsDoc', 'diffPatch', 'applyPatch', 'shortName', 'categoryOf',
    'planLobby', 'launchCalls', 'verifyManifest', 'clarityArg', 'HALL_KINDS']) assert.ok(k in V2, k);
});

test('seed --hall-only builds no lobby; the lobby comes later with its own plan; ids stay predicted and verified', async () => {
  const c = await chain();
  const hall = V2.planSeed([noLink()], { height: c.simnet.burnBlockHeight, ownerAddress: c.deployer, hallOnly: true });
  assert.deepEqual(hall.errors, []);
  assert.deepEqual(Object.keys(hall.manifest.spaces), ['arcade', 'hall']);
  assert.ok(!Object.keys(hall.manifest.objects).some((p) => p.startsWith('lobby/')));
  assert.ok(!hall.steps.some((s) => /lobby/.test(s.note)));
  // a lobby scene file, or a door to the lobby, is refused in a hall-only plan
  assert.ok(V2.planSeed([noLink(), lobbyDoc], { height: 1, hallOnly: true }).findings.some((f) => !f.ok));
  assert.match(V2.planSeed([demo], { height: 1, hallOnly: true }).errors.join(' '), /does not build/);
  c.run(hall);
  assert.deepEqual(await V2.verifyManifest(hall.manifest, c.reg), { ok: true, checked: 24 + 2 + 4 + Object.keys(hall.manifest.objects).length - 4 });
  c.simnet.mineEmptyBurnBlocks(10);
  let r = await c.hallRead();
  assert.equal(r.bays.filter((b) => b && b.scene).length, 4);
  assert.deepEqual(r.lobbyBays, [null, null]);                   // no lobby space: an empty room
  // later: the lobby, with a scene
  const lobby = V2.planLobby(hall.manifest, [lobbyDoc], { height: c.simnet.burnBlockHeight });
  assert.deepEqual(lobby.errors, []);
  assert.equal(lobby.steps[0].fn, 'create-space');
  assert.equal(lobby.steps[1].fn, 'set-space-state');
  assert.equal(lobby.manifest.spaces.lobby, hall.manifest.nextId);
  c.run(lobby);
  assert.equal((await V2.verifyManifest(lobby.manifest, c.reg)).ok, true);
  c.simnet.mineEmptyBurnBlocks(2);
  r = await c.hallRead();
  assert.equal(r.lobbyBays[1].scene.base, 'door');
  // planning the lobby twice is a no-op; a hall scene file is refused by the lobby command
  assert.equal(V2.planLobby(lobby.manifest, []).steps.length, 0);
  assert.equal(V2.planLobby(lobby.manifest, [demo]).errors.length, 1);
  assert.equal(V2.planLobby(V2.newManifest(), []).errors.length, 1);
});

test('the publisher grant is STATE only (review L8) and can expire: it changes signs, never adds objects', async () => {
  const c = await chain();
  const until = c.simnet.burnBlockHeight + 40;
  const plan = V2.planSeed([demo], { height: c.simnet.burnBlockHeight, ownerAddress: c.deployer, delegates: ['publisher'], delegateExpires: until });
  const grants = plan.steps.filter((s) => s.fn === 'grant');
  assert.equal(grants.length, 2);
  for (const g of grants) { assert.deepEqual(g.args[2], { uint: 1 }); assert.deepEqual(g.args[4], { uint: until }); }
  c.run(plan);
  c.simnet.mineEmptyBurnBlocks(10);
  assert.equal((await V2.verifyManifest(plan.manifest, c.reg)).ok, true);
  const patch = V2.planPatch(plan.manifest, { object: 'hall/bay-2/sign', params: { text: 'BY BOT' }, as: 'publisher' });
  assert.equal(c.call(patch.steps[0]).result.type, 'ok');
  const add = V2.planAdd(patch.manifest, { bay: 'hall/bay-3', kind: 'sign-board', params: { text: 'NEW' }, as: 'publisher' });
  assert.equal(pp(c.call(add.steps[0]).result), '(err u300)');   // no OBJECT right
  c.simnet.mineEmptyBurnBlocks(40);
  const late = V2.planPatch(patch.manifest, { object: 'hall/bay-2/sign', params: { text: 'TOO LATE' }, as: 'publisher' });
  assert.equal(pp(c.call(late.steps[0]).result), '(err u300)');  // expired
});

test('room --entry: the hash and size come from the core; the room opens from that inscription; an existing room only gets its entry', async () => {
  const c = await chain();
  const seed = V2.planSeed([demo], { height: c.simnet.burnBlockHeight, ownerAddress: c.deployer });
  c.run(seed);
  mockInscription(c.simnet, c.deployer, 4242, { hash: hash32(42), size: 12345, creator: c.W[3] });
  mockInscription(c.simnet, c.deployer, 4243, { hash: hash32(43), size: 99, creator: c.W[3], sealed: false });
  const core = simnetReader(c.simnet, c.deployer)(`${c.deployer}.mock-xtrata-core`);
  const entry = await readEntry(core, 4242);
  assert.deepEqual(entry, { id: 4242, hash: Buffer.from(hash32(42)).toString('hex'), size: 12345 });
  await assert.rejects(readEntry(core, 4243), /not sealed/);
  await assert.rejects(readEntry(core, 999999), /not in the core/);
  const room = V2.planRoom(seed.manifest, { slug: 'casino', title: 'Royal Flush Casino', entry });
  assert.deepEqual(room.steps.map((s) => s.fn), ['create-space', 'set-space-entry', 'set-space-state']);
  c.run(room);
  const sp = await c.reg('get-space', [{ uint: room.manifest.spaces.casino }]);
  assert.deepEqual({ ...sp.entry, hash: sp.entry.hash.replace(/^0x/, '') }, entry);
  assert.equal(sp.state, 1);
  assert.equal((await V2.verifyManifest(room.manifest, c.reg)).ok, true);
  // a new entry for the room that exists: one call
  mockInscription(c.simnet, c.deployer, 4244, { hash: hash32(44), size: 777, creator: c.W[3] });
  const again = V2.planRoom(room.manifest, { slug: 'casino', entry: await readEntry(core, 4244) });
  assert.deepEqual(again.steps.map((s) => s.fn), ['set-space-entry']);
  c.run(again);
  assert.equal((await V2.verifyManifest(again.manifest, c.reg)).ok, true);
  // a wrong hash is refused by the planner, and one that does not match the core by the contract
  assert.match(V2.planRoom(room.manifest, { slug: 'casino', entry: { id: 4244, hash: 'zz', size: 777 } }).errors.join(' '), /hash/);
  const wrong = V2.planRoom(again.manifest, { slug: 'casino', entry: { id: 4244, hash: Buffer.from(hash32(1)).toString('hex'), size: 777 } });
  assert.equal(pp(c.call(wrong.steps[0]).result), '(err u314)');
  // and verify notices an entry that is not what the manifest says
  const lie = JSON.parse(JSON.stringify(again.manifest)); lie.entries.casino.size = 1;
  const v = await V2.verifyManifest(lie, c.reg);
  assert.equal(v.ok, false); assert.equal(v.what, 'space casino entry');
});

test('verify stops at the first predicted id the chain does not hold', async () => {
  const c = await chain();
  const plan = V2.planSeed([demo], { height: c.simnet.burnBlockHeight, ownerAddress: c.deployer });
  const skip = plan.steps.findIndex((s) => s.fn === 'create-object' && s.note.startsWith('hall/bay-2'));
  // every later create-object would land on a shifted id; run the plan without that one call (and without what depends on it)
  plan.steps.slice(0, skip).forEach((s) => assert.equal(c.call(s).result.type, 'ok'));
  plan.steps.slice(skip + 1).filter((s) => s.fn === 'create-object').forEach((s) => c.call(s));
  const v = await V2.verifyManifest(plan.manifest, c.reg);
  assert.equal(v.ok, false);
  assert.match(v.what, /^object hall\/bay-2 \(id \d+\)$/);
  assert.equal(v.checked, 24 + 3 + 2);                          // kinds, spaces, bays 0 and 1
  assert.equal(v.expected.name, 'bay-2');
  assert.equal(v.got.name, 'bay-3');
});

test('launchCalls: the whole hall-only launch for a network and owner, replayable by a wallet with clarityArg', async () => {
  const c = await chain();
  assert.deepEqual(Plan.launchCalls({ network: 'mainnet', owner: c.deployer }).errors.length, 1);      // a testnet address on mainnet
  assert.deepEqual(Plan.launchCalls({ network: 'devnet', owner: c.deployer }).errors.length, 1);
  const L = Plan.launchCalls({ network: 'testnet', owner: c.deployer, publisher: c.W[0], publisherExpires: c.simnet.burnBlockHeight + 500 });
  assert.deepEqual(L.errors, []);
  assert.equal(L.contract, `${c.deployer}.${CONTRACT}`);
  assert.deepEqual(L.calls.map((s) => s.fn), [
    ...Array(24).fill('register-kind'), 'create-space', 'create-space', 'set-space-state', 'set-space-state', 'grant',
    'create-object', 'create-object', 'create-object', 'create-object']);
  // the same calls as the Node planner's hall-only seed with no scenes
  const node = V2.planSeed([], { ownerAddress: c.deployer, owner: c.deployer, hallOnly: true, delegates: [c.W[0]], delegateExpires: c.simnet.burnBlockHeight + 500 });
  assert.deepEqual(L.calls, node.steps.map((s) => ({ fn: s.fn, args: s.args, note: s.note })));
  // replay as a wallet would: Clarity values from the page's own Cl
  for (const s of L.calls) {
    const r = c.simnet.callPublicFn(CONTRACT, s.fn, s.args.map((a) => Plan.clarityArg(a, Cl)), c.deployer);
    assert.equal(r.result.type, 'ok', `${s.fn} ${s.note}: ${pp(r.result)}`);
  }
  assert.equal((await Plan.verifyManifest(L.manifest, c.reg)).ok, true);
  // with a room that opens from an entry
  const M = Plan.launchCalls({ network: 'mainnet', owner: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    rooms: [{ slug: 'casino', title: 'Royal Flush Casino', entry: { id: 7, hash: '00'.repeat(32), size: 10 } }] });
  assert.deepEqual(M.errors, []);
  assert.deepEqual(M.calls.slice(-3).map((s) => s.fn), ['create-space', 'set-space-entry', 'set-space-state']);
  assert.equal(M.contract, 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-world-v2');
});

test('the command line: seed --hall-only, lobby, room --entry (offline hash) and --delegate-expires plan what the library plans', () => {
  const dir = mkdtempSync(join(tmpdir(), 'xa-v2cli2-'));
  const run = (a) => spawnSync('node', [join(root, 'ops', 'v2.mjs'), ...a, '--out-dir', dir], { encoding: 'utf8', env: { ...process.env, XA_OPS_CONFIRM: '', XA_OPS_KEY_FILE: '', XA_OPS_KILL: join(dir, 'none') } });
  const hallFile = join(dir, 'hall.scene.json');
  writeFileSync(hallFile, JSON.stringify(noLink()));
  const s = run(['seed', hallFile, '--height', '1000', '--hall-only', '--delegate', 'publisher', '--delegate-expires', '+1d']);
  assert.equal(s.status, 0, s.stderr);
  assert.match(s.stdout, /hall only/);
  const m = JSON.parse(readFileSync(join(dir, 'seed.manifest.preview.json'), 'utf8'));
  assert.deepEqual(m.spaces, { arcade: 2, hall: 3 });
  const steps = JSON.parse(readFileSync(join(dir, 'seed.steps.json'), 'utf8')).steps;
  assert.deepEqual(steps.filter((x) => x.fn === 'grant').map((x) => [x.args[2].uint, x.args[4].uint]), [[1, 1144]]);
  writeFileSync(join(dir, 'hall-v2.manifest.json'), JSON.stringify(m));
  const l = run(['lobby']);
  assert.equal(l.status, 0, l.stderr);
  assert.deepEqual(JSON.parse(readFileSync(join(dir, 'lobby.steps.json'), 'utf8')).steps.map((x) => x.fn), ['create-space', 'set-space-state', 'create-object', 'create-object']);
  const r = run(['room', '--slug', 'casino', '--title', 'Royal Flush Casino', '--entry', '5', '--entry-hash', 'ab'.repeat(32), '--entry-size', '300']);
  assert.equal(r.status, 0, r.stderr);
  const rs = JSON.parse(readFileSync(join(dir, 'room-casino.steps.json'), 'utf8')).steps;
  assert.deepEqual(rs.map((x) => x.fn), ['create-space', 'set-space-entry', 'set-space-state']);
  assert.deepEqual(rs[1].args[1], { some: { tuple: { id: { uint: 5 }, hash: { hex: 'ab'.repeat(32) }, size: { uint: 300 } } } });
  const bad = run(['room', '--slug', 'casino', '--title', 'x', '--entry', '5', '--entry-hash', 'nothex', '--entry-size', '300']);
  assert.notEqual(bad.status, 0); assert.match(bad.stderr, /hash/);
});
