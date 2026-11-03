// The hall on xtrata-world-v2: the toolkit's calls (ops/v2.mjs, ops/lib/v2.mjs) run against the real contract in a simnet, and the hall's own
// reader (recursive-apps/xtrata-arcade/src/parts/world2.js) reads the result back. Nothing here touches a network or a key.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { Cl, cvToJSON, deserializeTransaction, randomPrivateKey, privateKeyToAddress } from '@stacks/transactions';
import { boot, pp } from './helpers.mjs';
import { argCv, signSteps } from '../ops/lib/steps.mjs';
import * as V2 from '../ops/lib/v2.mjs';
import { readHall, simnetRead, networkRead, describeHall } from '../ops/lib/hallread.mjs';
import { compileScenes } from '../ops/lib/scene.mjs';
import { snapshotAt } from '../ops/lib/snapshot.mjs';
import { hallBays } from '../ops/lib/catalogue.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const demo = JSON.parse(readFileSync(join(root, 'ops', 'examples', 'four-doorways-testnet-hall.scene.json'), 'utf8'));
const CONTRACT = 'xtrata-world-v2';

// A hall on a fresh simnet registry: every planned call is run for real and must succeed (so the predicted ids are the real ones).
async function hall() {
  const { simnet, deployer, W } = await boot();
  const names = { deployer, publisher: W[0], other: W[1] };
  const who = (v) => names[v] || v;
  const run = (plan) => {
    plan.steps.forEach((s, i) => {
      const r = simnet.callPublicFn(CONTRACT, s.fn, s.args.map((a) => argCv(a, who)), who(s.as));
      assert.equal(r.result.type, 'ok', `step ${i + 1} ${s.fn} (${s.note}): ${pp(r.result)}`);
    });
  };
  const read = () => readHall({ read: simnetRead(simnet, deployer), registry: `${deployer}.${CONTRACT}` });
  const ro = (fn, args = []) => simnet.callReadOnlyFn(CONTRACT, fn, args, deployer).result;
  const h = { simnet, deployer, W, run, read, ro, who };
  h.seed = (docs = [demo], o = {}) => {
    const plan = V2.planSeed(docs, { height: simnet.burnBlockHeight, ownerAddress: deployer, ...o });
    assert.deepEqual(plan.errors, []);
    run(plan); h.m = plan.manifest; return plan;
  };
  h.apply = (planner, a) => { const p = planner(h.m, { height: simnet.burnBlockHeight, ...a }); assert.deepEqual(p.errors, [], p.errors.join('; ')); run(p); h.m = p.manifest; return p; };
  return h;
}
// What the bay engine draws from a v1-style snapshot (scene contract) of the same scene file, at `height`, as plan keys: the parity yardstick.
const v1Plans = (doc, height, ctxHeight) => {
  const B = hallBays();
  const { scenes } = compileScenes(doc, { looks: V2.PLAN_BOOK, rooms: { 'arcade-hall': { bays: 4 }, lobby: { bays: 2 } }, height: ctxHeight, timelineUsed: {} });
  const snap = snapshotAt({ scenes, looks: V2.PLAN_BOOK, height, bayCount: 4 });
  return snap.bays.map((b) => B.planKey(B.planBay(b, snap.looks)));
};
// v2 links carry extra fields (to, arrival, title, lobby, still, depth) that v1 scenes never had; the drawing plan is compared on
// the three fields both share.
const v1Link = (l) => (l ? { 'target-room': l['target-room'], 'arrival-bay': l['arrival-bay'], path: l.path } : l);
const v2Plans = (r) => {
  const B = hallBays();
  return r.bays.map((b) => {
    const bay = b && b.scene ? { ...b, scene: { ...b.scene, link: v1Link(b.scene.link) } } : b;
    return B.planKey(B.planBay(bay, r.looks));
  });
};
const sign = (bay) => (bay.scene.layers.filter((l) => l.slot === 2));
const text = (l) => JSON.parse(l.params).text;

test('seed: the four-doorways demo is built from tier-0 kinds, bay objects, child layer objects and a portal; predicted ids are the real ids', async () => {
  const h = await hall();
  const plan = h.seed();
  // 24 kinds (bay + the 23 v1 looks), arcade/hall/lobby, 6 bays, 8 children
  assert.equal(Number(cvToJSON(h.ro('get-kind-count')).value), 24);
  assert.equal(plan.manifest.nextKind, 24);
  for (const [path, o] of Object.entries(plan.manifest.objects)) {
    const got = cvToJSON(h.ro('get-object', [Cl.uint(o.id)])).value;
    assert.ok(got, `${path} exists at id ${o.id}`);
    assert.equal(got.value.name.value, o.name);
    assert.equal(got.value.space.value, String(plan.manifest.spaces[o.space]));
    assert.equal(got.value.kind.value, String(plan.manifest.kinds[o.kind]));
  }
  const path = h.ro('resolve-path', [Cl.list([Cl.stringAscii('arcade'), Cl.stringAscii('hall')])]);
  assert.equal(pp(path), `(some u${plan.manifest.spaces.hall})`);
  // children hang off their bays
  const sign0 = cvToJSON(h.ro('get-object', [Cl.uint(plan.manifest.objects['hall/bay-0/sign'].id)])).value.value;
  assert.equal(sign0.parent.value, String(plan.manifest.objects['hall/bay-0'].id));
  assert.equal(sign0.depth.value, '2');
});

test('read back: before the scenes start the hall shows posters; after, the demo as the v1 snapshot the engine expects', async () => {
  const h = await hall();
  h.seed();
  let r = await h.read();
  assert.equal(r.bays.length, 4);
  r.bays.forEach((b) => assert.equal(b && b.scene, null, 'no active state yet: posters'));
  assert.equal(r.bays[0].nextHeight, h.simnet.burnBlockHeight + 4);          // the hall knows when to look again
  h.simnet.mineEmptyBurnBlocks(10);
  r = await h.read();
  const [b0, b1, b2, b3] = r.bays;
  const builtin = (id) => r.looks[id].builtin;
  // bay 0: wall + closed house curtain + gold "coming soon" sign, peek
  assert.equal(b0.scene.base, 'wall'); assert.equal(b0.scene.interaction, 2); assert.equal(b0.scene.link, null);
  assert.deepEqual(b0.scene.layers.map((l) => [l.slot, builtin(l.look), l.state]), [[1, 'curtain-house', 'closed'], [2, 'sign-board', '']]);
  assert.deepEqual(JSON.parse(b0.scene.layers[0].params), { color: '#7a1020' });
  assert.deepEqual(JSON.parse(b0.scene.layers[1].params), { text: 'coming soon', sub: 'far left', tone: 'gold' });
  // bay 1: arch door, knock, "staff only"
  assert.equal(b1.scene.base, 'door'); assert.equal(b1.scene.baseId, 2); assert.equal(b1.scene.interaction, 1);
  assert.equal(builtin(b1.scene.doorLook), 'door-arch'); assert.equal(r.looks[b1.scene.doorLook].kind, 0);
  assert.equal(text(sign(b1)[0]), 'staff only');
  // bay 2: gothic door, enter, the portal reads as a link to the lobby
  assert.equal(b2.scene.interaction, 3); assert.equal(builtin(b2.scene.doorLook), 'door-gothic');
  assert.equal(b2.scene.link['target-room'], 'lobby'); assert.equal(b2.scene.link.path, '');
  // bay 3: wall + sign + pulsing orange lamp
  assert.equal(b3.scene.base, 'wall'); assert.equal(b3.scene.interaction, 0);
  assert.deepEqual(b3.scene.layers.map((l) => [l.slot, builtin(l.look)]), [[2, 'sign-board'], [4, 'light-pulse']]);
  assert.deepEqual(JSON.parse(b3.scene.layers[1].params), { tone: 'orange', rate: 2 });
  // the lobby has its two bays (no scenes: posters)
  assert.equal(r.lobbyBays.length, 2); r.lobbyBays.forEach((b) => assert.equal(b.scene, null));
  assert.equal(b0.nextHeight, null);
  assert.match(describeHall(r), /bay 2: door door-gothic, enter, leads to lobby/);
});

test('parity: the bay engine draws exactly the same plan from the v2 objects as from the v1 scenes of the same file', async () => {
  const h = await hall();
  const t0 = h.simnet.burnBlockHeight;
  h.seed(); h.simnet.mineEmptyBurnBlocks(10);
  const r = await h.read();
  const want = v1Plans(demo, h.simnet.burnBlockHeight, t0);
  assert.deepEqual(v2Plans(r), want);
  assert.ok(want.every((k) => k !== ''), 'all four demo bays are drawn');
});

test('independent updates: change one sign (nothing else moves), add a new sign, hide one, schedule one', async () => {
  const h = await hall();
  h.seed(); h.simnet.mineEmptyBurnBlocks(10);
  const before = await h.read();
  // 1. one add-state on one object
  const p = h.apply(V2.planPatch, { object: 'hall/bay-1/sign', params: { text: 'NEW TEXT' } });
  assert.equal(p.steps.length, 1); assert.equal(p.steps[0].fn, 'add-state');
  let r = await h.read();
  assert.equal(text(sign(r.bays[1])[0]), 'NEW TEXT');
  assert.equal(JSON.parse(sign(r.bays[1])[0].params).tone, 'orange');            // the rest of that sign is untouched
  for (const i of [0, 2, 3]) assert.deepEqual(r.bays[i], before.bays[i], `bay ${i} untouched`);
  assert.deepEqual(r.bays[1].scene.doorLook, before.bays[1].scene.doorLook);
  assert.equal(r.bays[1].scene.layers.length, before.bays[1].scene.layers.length);
  // updating again keeps the earlier changed keys (the patch is carried by the planner) and replaces only the named one
  h.apply(V2.planPatch, { object: 'hall/bay-1/sign', params: { tone: 'blue' } });
  r = await h.read();
  assert.deepEqual(JSON.parse(sign(r.bays[1])[0].params), { text: 'NEW TEXT', sub: 'far right', tone: 'blue' });
  // 2. a new sign on bay 3 (create-object only), then it is drawn after the first one
  const add = h.apply(V2.planAdd, { bay: 'hall/bay-3', kind: 'sign-board', params: { text: 'SECOND', tone: 'blue', y: 1.4 } });
  assert.equal(add.steps.length, 1); assert.equal(add.steps[0].fn, 'create-object');
  r = await h.read();
  assert.deepEqual(sign(r.bays[3]).map(text), ['new room', 'SECOND']);
  assert.deepEqual(r.bays[3].scene.layers.map((l) => l.slot), [2, 4, 2]);        // sorted by creation: the lamp stays where it was
  // 3. hide the first sign: it disappears from the layers, the other stays
  h.apply(V2.planPatch, { object: 'hall/bay-3/sign', hide: true });
  r = await h.read();
  assert.deepEqual(sign(r.bays[3]).map(text), ['SECOND']);
  // and show it again with a different text
  h.apply(V2.planPatch, { object: 'hall/bay-3/sign', params: { text: 'BACK' } });
  r = await h.read();
  assert.deepEqual(sign(r.bays[3]).map(text), ['BACK', 'SECOND']);
  // 4. a lamp that appears 5 blocks from now: hidden first, then drawn; the reader says when to look again
  const t0 = h.simnet.burnBlockHeight;
  h.apply(V2.planAdd, { bay: 'hall/bay-0', kind: 'light-flicker', params: { tone: 'red' }, at: '+5' });
  r = await h.read();
  assert.equal(r.bays[0].scene.layers.filter((l) => l.slot === 4).length, 0);
  assert.equal(r.bays[0].nextHeight, t0 + 5);
  h.simnet.mineEmptyBurnBlocks(6);
  r = await h.read();
  assert.deepEqual(r.bays[0].scene.layers.filter((l) => l.slot === 4).map((l) => r.looks[l.look].builtin), ['light-flicker']);
  assert.equal(r.bays[0].nextHeight, null);
});

test('the curtain: its state is a param on its own object, so opening it is one small call', async () => {
  const h = await hall();
  h.seed(); h.simnet.mineEmptyBurnBlocks(10);
  h.apply(V2.planPatch, { object: 'hall/bay-0/curtain', params: { state: 'open' } });
  const r = await h.read();
  assert.deepEqual(r.bays[0].scene.layers.filter((l) => l.slot === 1).map((l) => l.state), ['open']);
  assert.deepEqual(JSON.parse(r.bays[0].scene.layers[0].params), { color: '#7a1020' });
  assert.deepEqual(r.bays[0].scene.layers.filter((l) => l.slot === 2).map(text), ['coming soon']);
});

test('a bay can change base and interaction; enter needs its portal; a door is a child with a skin in its params', async () => {
  const h = await hall();
  h.seed(); h.simnet.mineEmptyBurnBlocks(10);
  // bay 3 (wall) becomes a knock-only door with the newest door child on it
  h.apply(V2.planAdd, { bay: 'hall/bay-3', kind: 'door-arch', params: { skin: 'oak', frame: 'plain' } });
  h.apply(V2.planBay, { bay: 'hall/bay-3', base: 'door', interaction: 'knock' });
  let r = await h.read();
  const b3 = r.bays[3].scene;
  assert.equal(b3.base, 'door'); assert.equal(b3.interaction, 1);
  assert.equal(r.looks[b3.doorLook].builtin, 'door-arch');
  const skin = b3.layers.find((l) => r.looks[l.look].builtin === 'door-skin');
  assert.ok(skin && skin.slot === 2, 'the door’s own skin keys become a door-skin layer');
  assert.deepEqual(JSON.parse(skin.params), { skin: 'oak', frame: 'plain' });
  // no portal on bay 3: planner refuses "enter"; the contract would too
  const bad = V2.planBay(h.m, { bay: 'hall/bay-3', interaction: 'enter' });
  assert.match(bad.errors.join(), /no portal/);
  const direct = h.simnet.callPublicFn(CONTRACT, 'add-state', [argCv({ tuple: { obj: { uint: h.m.objects['hall/bay-3'].id }, from: { uint: 0 }, patch: { ascii: '{}' }, visibility: { uint: 0 }, interaction: { uint: 3 } } })], h.deployer);
  assert.equal(pp(direct.result), '(err u316)');
});

test('reset: retracting the bay states shows posters again; history stays; one call per state', async () => {
  const h = await hall();
  h.seed(); h.simnet.mineEmptyBurnBlocks(10);
  h.apply(V2.planBay, { bay: 'hall/bay-0', base: 'posters', interaction: 'none' });         // a second state on bay 0
  let r = await h.read();
  assert.equal(r.bays[0].scene.base, 'posters');
  const reset = h.apply(V2.planReset, { bay: 'hall/bay-0' });
  assert.deepEqual(reset.steps.map((s) => s.fn), ['retract-state', 'retract-state']);
  r = await h.read();
  assert.equal(r.bays[0].scene, null);
  assert.equal(r.bays[1].scene.base, 'door');                                                 // other bays unchanged
  // history stays readable
  assert.equal(pp(h.ro('get-state-count', [Cl.uint(h.m.objects['hall/bay-0'].id)])), 'u2');
  // the soft reset is one call and can be undone by a new state
  const soft = h.apply(V2.planReset, { bay: 'hall/bay-3', soft: true });
  assert.equal(soft.steps.length, 1);
  r = await h.read();
  assert.equal(r.bays[3].scene, null);
  h.apply(V2.planBay, { bay: 'hall/bay-3', base: 'wall' });
  r = await h.read();
  assert.equal(r.bays[3].scene.base, 'wall');
});

test('the timeline holds 8 live states per object: the planner stops, --compact frees the old ones', async () => {
  const h = await hall();
  h.seed(); h.simnet.mineEmptyBurnBlocks(10);
  for (let i = 0; i < 7; i++) { h.apply(V2.planPatch, { object: 'hall/bay-1/sign', params: { text: 'T' + i } }); h.simnet.mineEmptyBurnBlocks(1); }
  // the seed made no state for this sign (its params were its first appearance), so 7 changes = 7 live; the 9th would overflow
  h.apply(V2.planPatch, { object: 'hall/bay-1/sign', params: { text: 'T7' } });
  const full = V2.planPatch(h.m, { object: 'hall/bay-1/sign', params: { text: 'T8' }, height: h.simnet.burnBlockHeight });
  assert.match(full.errors.join(), /8 live states/);
  const p = h.apply(V2.planPatch, { object: 'hall/bay-1/sign', params: { text: 'T8' }, compact: true });
  assert.deepEqual(p.steps.map((s) => s.fn), ['compact-object', 'add-state']);
  h.simnet.mineEmptyBurnBlocks(1);
  const r = await h.read();
  assert.equal(text(sign(r.bays[1])[0]), 'T8');
});

test('a delegate with state rights (a "publisher" wizard) can change signs without the root key; a stranger cannot', async () => {
  const h = await hall();
  h.seed(undefined, { delegates: ['publisher'] }); h.simnet.mineEmptyBurnBlocks(10);
  h.apply(V2.planPatch, { object: 'hall/bay-2/sign', params: { text: 'BY DELEGATE' }, as: 'publisher' });
  const r = await h.read();
  assert.equal(text(sign(r.bays[2])[0]), 'BY DELEGATE');
  const stranger = V2.planPatch(h.m, { object: 'hall/bay-2/sign', params: { text: 'NOPE' }, as: 'other' });
  const res = h.simnet.callPublicFn(CONTRACT, stranger.steps[0].fn, stranger.steps[0].args.map((a) => argCv(a, h.who)), h.who('other'));
  assert.equal(pp(res.result), '(err u300)');
});

test('a story with several scenes on one bay: objects appear and disappear on their own timelines', async () => {
  const h = await hall();
  const t = h.simnet.burnBlockHeight;
  const story = { format: 'arcade-scene-file/1', room: 'arcade-hall', scenes: [
    { bay: 0, at: t + 5, base: 'wall', interaction: 'none', layers: [{ look: 'sign-board', params: { text: 'one' } }] },
    { bay: 0, at: t + 10, base: 'wall', interaction: 'none', layers: [{ look: 'sign-board', params: { text: 'two', tone: 'gold' } }, { look: 'light-pulse', params: {} }] },
    { bay: 0, at: t + 15, base: 'door', door: 'door-gothic', interaction: 'knock', layers: [{ look: 'sign-board', params: { text: 'two' } }] },
    { bay: 0, at: t + 20, base: 'posters', interaction: 'none' },
  ] };
  const plan = h.seed([story]);
  // one object per identity (sign, lamp, door), not one per scene
  assert.deepEqual(plan.steps.filter((s) => s.fn === 'create-object' && /bay-0\//.test(s.note)).map((s) => s.note), ['hall/bay-0/sign (sign-board)', 'hall/bay-0/lamp (light-pulse)', 'hall/bay-0/door (door-gothic)']);
  const at = async (n) => { h.simnet.mineEmptyBurnBlocks(Math.max(0, t + n - h.simnet.burnBlockHeight)); return (await h.read()).bays[0].scene; };
  const parity = async (n) => assert.deepEqual(v2Plans(await h.read()), v1Plans(story, h.simnet.burnBlockHeight, t), `parity at +${n}`);
  let s = await at(1); await parity(1); assert.equal(s, null);
  s = await at(6); await parity(6); assert.equal(s.base, 'wall'); assert.deepEqual(s.layers.map((l) => JSON.parse(l.params).text), ['one']);
  s = await at(11); await parity(11); assert.deepEqual(s.layers.map((l) => l.slot), [2, 4]); assert.equal(JSON.parse(s.layers[0].params).text, 'two'); assert.equal(JSON.parse(s.layers[0].params).tone, 'gold');
  s = await at(16); await parity(16); assert.equal(s.base, 'door'); assert.equal(s.interaction, 1); assert.deepEqual(s.layers.map((l) => l.slot), [2]); assert.equal(JSON.parse(s.layers[0].params).tone, undefined);
  s = await at(21); await parity(21); assert.equal(s.base, 'posters'); assert.deepEqual(s.layers, []);
});

test('the lobby: its two doorways are objects in the lobby space and read as bays 4 and 5 for the engine', async () => {
  const h = await hall();
  const lobby = { format: 'arcade-scene-file/1', room: 'lobby', scenes: [
    { bay: 1, at: 0, base: 'door', door: 'door-arch', interaction: 'knock', layers: [{ look: 'sign-board', params: { text: 'casino' } }] },
  ] };
  h.seed([demo, lobby]); h.simnet.mineEmptyBurnBlocks(10);
  const r = await h.read();
  assert.equal(r.lobbyBays[0].scene, null);
  assert.equal(r.lobbyBays[1].scene.base, 'door');
  assert.equal(text(r.lobbyBays[1].scene.layers[0]), 'casino');
  assert.equal(r.bays.length, 4);
});

test('a bay without an object, a hidden kind, a retired object and a moderated object are all left out', async () => {
  const h = await hall();
  h.seed(); h.simnet.mineEmptyBurnBlocks(10);
  // retire the lamp on bay 3 (the root owner may), hide the sign kind: signs vanish everywhere
  const lamp = h.m.objects['hall/bay-3/lamp'].id;
  assert.equal(pp(h.simnet.callPublicFn(CONTRACT, 'set-object-state', [Cl.uint(lamp), Cl.uint(2)], h.deployer).result), '(ok true)');
  let r = await h.read();
  assert.deepEqual(r.bays[3].scene.layers.map((l) => l.slot), [2]);
  const signKind = h.m.kinds['sign-board'];
  assert.equal(pp(h.simnet.callPublicFn(CONTRACT, 'set-kind-hidden', [Cl.uint(signKind), Cl.bool(true)], h.deployer).result), '(ok true)');
  r = await h.read();
  r.bays.forEach((b) => assert.equal(b.scene.layers.filter((l) => l.slot === 2).length, 0));
  // moderating a bay object itself: that bay shows posters
  const bay1 = h.m.objects['hall/bay-1'].id;
  assert.equal(pp(h.simnet.callPublicFn(CONTRACT, 'set-object-state', [Cl.uint(bay1), Cl.uint(3)], h.deployer).result), '(ok true)');
  r = await h.read();
  assert.equal(r.bays[1], null);
});

test('the signature changes when the hall changes, not when something elsewhere in the world does', async () => {
  const h = await hall();
  h.seed(); h.simnet.mineEmptyBurnBlocks(10);
  const a = (await h.read()).sig;
  // a write in another space (a plot elsewhere): the global version moves, the hall's signature does not
  const plots = h.simnet.callPublicFn(CONTRACT, 'create-space', [Cl.uint(1), Cl.stringAscii('plots'), Cl.stringAscii('Plots'), Cl.uint(0), Cl.principal(h.deployer), Cl.uint(0), Cl.bool(false), argCv(V2.policyArg({ children: 8, descendants: 8, objects: 8, depth: 2, runtimes: 1, tiers: 1, interfaces: 0 }))], h.deployer);
  assert.equal(plots.result.type, 'ok');
  assert.equal((await h.read()).sig, a);
  h.apply(V2.planPatch, { object: 'hall/bay-1/sign', params: { text: 'CHANGED' } });
  assert.notEqual((await h.read()).sig, a);
});

// ------------------------------------------------------------------------------------------------------------- offline tooling
test('steps: tuples, lists, optional tuples and buffers become the Clarity values the contract takes', () => {
  const cv = argCv({ tuple: { a: { int: -3 }, b: { list: [{ uint: 1 }, { uint: 2 }] }, c: { some: { tuple: { p: { ascii: '/x' } } } }, d: { none: true }, e: { hex: '' }, f: { hex: '0aff' } } });
  assert.equal(pp(cv), '{ a: -3, b: (list u1 u2), c: (some { p: "/x" }), d: none, e: 0x, f: 0x0aff }');
  assert.throws(() => argCv({ hex: 'abc' }), /pairs of hex/);
  assert.throws(() => argCv({ wat: 1 }), /unknown argument form/);
});

test('signing is offline, needs the guard, and the signed transaction carries the planned arguments', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'xa-v2-'));
  const key = randomPrivateKey(), addr = privateKeyToAddress(key, 'testnet');
  writeFileSync(join(dir, addr + '.key'), key);
  const plan = V2.planSeed([demo], { height: 5000, ownerAddress: addr });
  const doc = { ...plan.doc, steps: plan.doc.steps.map((s) => ({ ...s, as: addr })) };
  // without --execute / the confirmation nothing is signed
  await assert.rejects(signSteps(doc, { nonces: { [addr]: 0 }, keysDir: dir, execute: false }), /dry run/);
  await assert.rejects(signSteps(doc, { nonces: { [addr]: 0 }, keysDir: dir, execute: true, env: { XA_OPS_KILL: join(dir, 'none') } }), /XA_OPS_CONFIRM=broadcast-testnet/);
  const { items, nonces } = await signSteps(doc, { nonces: { [addr]: 7 }, keysDir: dir, execute: true, env: { XA_OPS_CONFIRM: 'broadcast-testnet', XA_OPS_KILL: join(dir, 'none') } });
  assert.equal(items.length, doc.steps.length);
  assert.equal(nonces[addr], 7 + doc.steps.length);
  const tx = (i) => deserializeTransaction(items[i].hex);
  assert.equal(tx(0).payload.functionName.content, 'register-kind');
  const space = items.findIndex((i, n) => doc.steps[n].fn === 'create-space');
  assert.equal(tx(space).payload.functionName.content, 'create-space');
  assert.equal(tx(space).payload.functionArgs.length, 8);
  assert.equal(String(tx(space).auth.spendingCondition.nonce), String(7 + space));
  const last = tx(items.length - 1);
  assert.equal(last.payload.functionName.content, 'add-states');
  assert.equal(last.payload.functionArgs[0].type, 'list');
  assert.ok(!items.map((i) => i.hex).join().includes(Buffer.from(key).toString('hex')));
});

test('the command line: dry run writes the steps and the manifest preview, refuses to sign without --execute, and the deploy step is a deploy', () => {
  const dir = mkdtempSync(join(tmpdir(), 'xa-v2cli-'));
  const run = (a, env = {}) => spawnSync('node', [join(root, 'ops', 'v2.mjs'), ...a], { encoding: 'utf8', env: { ...process.env, XA_OPS_CONFIRM: '', XA_OPS_KEY_FILE: '', XA_OPS_KILL: join(dir, 'none'), ...env } });
  const d = run(['deploy', '--out-dir', dir]);
  assert.equal(d.status, 0, d.stderr); assert.match(d.stdout, /deploy xtrata-world-v2/); assert.match(d.stdout, /DRY RUN/);
  assert.deepEqual(JSON.parse(readFileSync(join(dir, 'deploy.steps.json'), 'utf8')).steps.map((s) => s.deploy), [CONTRACT]);
  const s = run(['seed', join(root, 'ops', 'examples', 'four-doorways-testnet-hall.scene.json'), '--height', '1000', '--out-dir', dir]);
  assert.equal(s.status, 0, s.stderr); assert.match(s.stdout, /DRY RUN/);
  const steps = JSON.parse(readFileSync(join(dir, 'seed.steps.json'), 'utf8'));
  assert.equal(steps.contracts.reg, CONTRACT); assert.ok(steps.steps.length > 40);
  const m = JSON.parse(readFileSync(join(dir, 'seed.manifest.preview.json'), 'utf8'));
  assert.deepEqual(m.spaces, { arcade: 2, hall: 3, lobby: 4 });
  const e = run(['seed', join(root, 'ops', 'examples', 'four-doorways-testnet-hall.scene.json'), '--height', '1000', '--out-dir', dir, '--execute', '--nonces', 'deployer=0', '--keys', dir]);
  assert.equal(e.status, 2); assert.match(e.stderr, /REFUSED/);
  mkdirSync(dir, { recursive: true });
  // patch needs a manifest
  const p = run(['patch', '--object', 'hall/bay-0/sign', '--set', 'text=HI', '--manifest', join(dir, 'nope.json'), '--out-dir', dir]);
  assert.notEqual(p.status, 0); assert.match(p.stderr, /no manifest/);
  writeFileSync(join(dir, 'hall-v2.manifest.json'), JSON.stringify(m));
  const q = run(['patch', '--object', 'hall/bay-0/sign', '--set', 'text=HI', '--set', 'y=1.5', '--out-dir', dir]);
  assert.equal(q.status, 0, q.stderr);
  const one = JSON.parse(readFileSync(join(dir, 'patch.steps.json'), 'utf8')).steps;
  assert.equal(one.length, 1); assert.equal(one[0].fn, 'add-state');
  assert.equal(one[0].args[0].tuple.patch.ascii, '{"text":"HI","y":1.5}');
});

test('unpacked relay files hold signed hex only (no key) and the planned labels', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'xa-v2pk-'));
  const key = randomPrivateKey(), addr = privateKeyToAddress(key, 'testnet');
  const { pack } = await import('../ops/lib/relay.mjs');
  const plan = V2.planPatch(V2.planSeed([demo], { height: 5000, ownerAddress: addr }).manifest, { object: 'hall/bay-1/sign', params: { text: 'X' }, height: 5000 });
  const doc = { ...plan.doc, steps: plan.steps.map((s) => ({ ...s, as: addr })) };
  writeFileSync(join(dir, addr + '.key'), key);
  const { items } = await signSteps(doc, { nonces: { [addr]: 0 }, keysDir: dir, execute: true, env: { XA_OPS_CONFIRM: 'broadcast-testnet', XA_OPS_KILL: join(dir, 'none') } });
  const packed = pack(items);
  const back = JSON.parse(gunzipSync(Buffer.from(packed, 'base64')).toString('utf8'));
  assert.equal(back.length, 1); assert.match(back[0].label, /add-state \(hall\/bay-1\/sign change text\)/);
});

test('the hall fixtures (recursive-apps/xtrata-arcade/tests/fixtures/hall-v2-demo.json) still match what the contract and toolkit produce', async () => {
  const { buildFixture, FIXTURE } = await import('../scripts/make-hall-v2-fixture.mjs');
  const fresh = await buildFixture();
  const saved = JSON.parse(readFileSync(FIXTURE, 'utf8'));
  assert.deepEqual(JSON.parse(JSON.stringify(fresh)), saved, 'run: node scripts/make-hall-v2-fixture.mjs');
});

test('the read tool over HTTP: networkRead speaks the node\'s call-read API and the hall reader makes the same hall of it', async () => {
  const { FIXTURE } = await import('../scripts/make-hall-v2-fixture.mjs');
  const fx = JSON.parse(readFileSync(FIXTURE, 'utf8')), sc = fx.scenarios.active, urls = [];
  const fetchImpl = async (url, init) => {
    const fn = url.split('/').pop(), body = JSON.parse(init.body);
    urls.push(url);
    const i = sc.calls[fn + '|' + body.arguments.join(',')];
    return { ok: i !== undefined, status: i !== undefined ? 200 : 404, json: async () => ({ okay: true, result: fx.blobs[i] }) };
  };
  const [addr, name] = fx.registry.split('.');
  const r = await readHall({ read: networkRead({ apiBase: 'https://node.example/', fetchImpl }), registry: fx.registry });
  assert.deepEqual(r, sc.expect);
  assert.ok(urls.every((u) => u.startsWith(`https://node.example/v2/contracts/call-read/${addr}/${name}/`)));
  assert.match(describeHall(r), /bay 1: door door-arch, knock/);
  // a node that fails makes the read throw: the tool says so instead of printing an empty hall
  await assert.rejects(readHall({ read: networkRead({ fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) }) }), registry: fx.registry }), /HTTP 503/);
});

test('a destination room: planRoom makes a live space, a lobby door links to it, and the hall reader reads that door as a link to the room', async () => {
  const h = await hall();
  h.seed([demo]);
  const room = h.apply(V2.planRoom, { slug: 'casino', title: 'Royal Flush Casino' });
  const id = room.manifest.spaces.casino;
  assert.equal(room.steps.length, 2);
  assert.equal(room.manifest.nextId, id + 1);
  assert.deepEqual(V2.planRoom(h.m, { slug: 'casino', title: 'Again' }).errors.length, 1, 'a second room with the same slug is refused');
  assert.ok(V2.planRoom(h.m, { slug: 'Bad Slug', title: 'x' }).errors.length >= 1);
  const lobby = JSON.parse(readFileSync(join(root, 'ops', 'examples', 'lobby-casino-door.scene.json'), 'utf8'));
  h.seed([lobby], { linkRooms: { casino: id }, manifest: h.m }); h.simnet.mineEmptyBurnBlocks(10);
  const r = await h.read();
  const b = r.lobbyBays[0].scene;
  assert.equal(b.base, 'door'); assert.equal(b.interaction, 3);
  assert.equal(b.link['target-room'], 'casino', 'the lobby door leads to the casino room');
  assert.match(describeHall(r), /leads to casino/);
  assert.equal(r.lobbyBays[1].scene, null);
});
