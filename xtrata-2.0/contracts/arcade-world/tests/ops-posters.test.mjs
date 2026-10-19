// Operator toolkit, posters: validator vs contract, campaign generators, publisher bot (caps, gap, kill switch, review lane). Simnet only.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { Cl } from '@stacks/transactions';
import { boot, mockInscription, hash32 } from './helpers.mjs';
import { simnetTransport } from '../ops/lib/transport.mjs';
import { setPublisher } from '../ops/lib/setup.mjs';
import { compilePosters, parsePosterFile, hallEntries, posterKey, chainPosterKey, todayOf, POSTER_FORMAT } from '../ops/lib/posters.mjs';
import { posterCv } from '../ops/lib/clar.mjs';
import { rotation, calendar } from '../ops/lib/campaign.mjs';
import { runBot, newJournal, botContext } from '../ops/lib/bot.mjs';
import { waitingPosters, releasePosters } from '../ops/lib/review.mjs';
import { readAllPosters, readLive, readPosterConfig } from '../ops/lib/readback.mjs';

let t, deployer, W, simnet;
const pub = () => W[0];
const doc = (posters, defaults = { set: 'community', weight: 5 }) => ({ format: POSTER_FORMAT, defaults, posters });
const mk = (n, day, extra = {}) => Array.from({ length: n }, (_, i) => ({ head: `POSTER ${n}-${i + 1}-${day}`, sub: 'x', art: 'launch', colour: 'gold', from: day + i % 3, days: 2, ...extra }));
const today = () => todayOf(simnet.burnBlockHeight);
const rawPoster = (o = {}) => ({
  set: 1, kind: 0, head: 'RAW', sub: '', foot: 'X', colour: 'gold', art: 'launch', imageId: 0, imageHash: new Uint8Array(0), imageSize: 0, cols: 0, frames: 0, fps: 0,
  actKind: 0, actId: 0, actText: '', weight: 5, startDay: today() + 1, endDay: today() + 3, scope: [], evergreen: false, payout: null, ...o,
});
const gap = () => simnet.mineEmptyBurnBlocks(2);

before(async () => {
  ({ simnet, deployer, W } = await boot());
  t = simnetTransport(simnet, { deployer });
  await setPublisher(t, 'posters', deployer, pub());
  mockInscription(simnet, deployer, 5, { hash: new Uint8Array(32), size: 100, creator: pub() });
});

// Each case: a poster-file entry the validator must reject, a hand-built poster that skips the validator, who sends it, the code.
const CASES = [
  { name: 'publisher adds a core poster', file: { set: 'core' }, raw: { set: 0 }, code: 100 },
  { name: 'publisher adds an evergreen poster', file: { evergreen: true }, raw: { evergreen: true }, code: 100 },
  { name: 'community weight above 20', file: { weight: 21 }, raw: { weight: 21 }, code: 105 },
  { name: 'weight zero', file: { weight: 0 }, raw: { weight: 0 }, code: 105 },
  { name: 'starts today', file: { from: 'TODAY' }, raw: { startDay: 'TODAY', endDay: 'TODAY+2' }, code: 104 },
  { name: 'ends before it starts', file: { from: '+3', until: '+2' }, raw: { startDay: 'T+3', endDay: 'T+2' }, code: 104 },
  { name: 'runs longer than 3650 days', file: { from: '+1', days: 3651 }, raw: { startDay: 'T+1', endDay: 'T+3652' }, code: 104 },
  { name: 'empty headline', file: { head: '' }, raw: { head: '' }, code: 103 },
  { name: 'live poster without art key', file: { kind: 'live', art: '' }, raw: { kind: 3, art: '' }, code: 103 },
  { name: 'sheet without frames', file: { kind: 'sheet', image: { id: 5, hash: '00'.repeat(32), size: 100 }, sheet: { cols: 4, frames: 0, fps: 10 } },
    raw: { kind: 2, imageId: 5, imageHash: new Uint8Array(32), imageSize: 100, cols: 4, frames: 0, fps: 10 }, code: 103 },
  { name: 'image over 128 KB', file: { kind: 'image', image: { id: 5, hash: '00'.repeat(32), size: 131073 } },
    raw: { kind: 1, imageId: 5, imageHash: new Uint8Array(32), imageSize: 131073 }, code: 106 },
];
const fix = (v) => (typeof v === 'string' && /^T/.test(v) ? today() + (Number(v.split('+')[1]) || 0) : v);
for (const c of CASES) {
  test(`validator and contract agree: ${c.name}`, async () => {
    const entry = { head: 'CHECK ME', sub: 'x', art: 'launch', from: '+1', days: 2, ...c.file };
    if (entry.from === 'TODAY') entry.from = today();
    const r = compilePosters(doc([entry]), { today: today(), role: 'publisher' });
    assert.ok(!r.findings.ok, 'the validator should reject this');
    assert.match(r.findings.errors.map((e) => e.msg).join('\n'), new RegExp(`u${c.code}`));
    gap();
    const raw = rawPoster({ ...c.raw, startDay: fix(c.raw.startDay ?? undefined) ?? today() + 1, endDay: fix(c.raw.endDay ?? undefined) ?? today() + 3 });
    if (c.raw.startDay === undefined) raw.startDay = today() + 1;
    if (c.raw.endDay === undefined) raw.endDay = today() + 3;
    const res = await t.send('posters', 'add-poster', [posterCv(raw)], pub());
    assert.equal(res.ok, false);
    assert.equal(Number(res.value), c.code);
  });
}

test('what the validator accepts, the contract accepts (all four kinds, admin and publisher)', async () => {
  mockInscription(simnet, deployer, 77, { hash: hash32(7), size: 5000, creator: pub() });
  gap();
  const hex = Buffer.from(hash32(7)).toString('hex');
  const d = doc([
    { head: 'TEMPLATE', sub: 'a', art: 'trophy', colour: 'orange', from: '+1', days: 2, action: { kind: 'path', path: '/arcade' } },
    { head: 'IMAGE', sub: 'b', kind: 'image', image: { id: 77, hash: hex, size: 5000 }, from: '+1', days: 2 },
    { head: 'SHEET', sub: 'c', kind: 'sheet', image: { id: 77, hash: hex, size: 5000 }, sheet: { cols: 4, frames: 16, fps: 12 }, from: '+2', days: 2 },
    { head: 'LIVE', sub: 'd', kind: 'live', art: 'blocks', from: '+1', days: 5 },
  ]);
  const { findings, posters } = compilePosters(d, { today: today(), role: 'publisher' });
  assert.ok(findings.ok, JSON.stringify(findings.errors));
  const res = await t.send('posters', 'add-posters', [Cl.list(posters.map(posterCv))], pub());
  assert.equal(res.ok, true, JSON.stringify(res.value));
  const chain = (await readAllPosters(t)).filter((p) => p.owner === pub() && ['TEMPLATE', 'IMAGE', 'SHEET', 'LIVE'].includes(p.head));
  assert.equal(chain.length, 4);
  posters.forEach((p, i) => assert.equal(chainPosterKey(chain[i]), posterKey(p)));
});

test('warnings: unknown art and colour, a path the hall will not open', () => {
  const r = compilePosters(doc([{ head: 'A', art: 'nope', colour: 'pink', from: '+1', days: 1, action: { kind: 'path', path: 'evil.example' } }]), { today: 10, role: 'publisher' });
  assert.ok(r.findings.ok);
  const w = r.findings.warnings.map((x) => x.msg).join('\n');
  assert.match(w, /art "nope"/); assert.match(w, /colour "pink"/); assert.match(w, /does nothing when clicked|would do nothing/);
});

test('publisher budgets are checked before anything is sent', () => {
  const r = compilePosters(doc(mk(13, 100)), { today: 10, role: 'publisher', config: { capPerDay: 24, capLivePerPublisher: 12, minGap: 1, reviewLane: false }, usedToday: 0, liveOwned: 0 });
  assert.ok(!r.findings.ok);
  assert.match(r.findings.errors[0].msg, /u108/);
  const r2 = compilePosters(doc(mk(5, 100)), { today: 10, role: 'publisher', config: { capPerDay: 24, capLivePerPublisher: 12, minGap: 1, reviewLane: false }, usedToday: 22, liveOwned: 0 });
  assert.match(r2.findings.errors[0].msg, /u107/);
});

test('campaign generators emit absolute days and valid files', () => {
  const items = [{ head: 'A', art: 'launch' }, { head: 'B', art: 'trophy' }];
  const r = rotation({ items, startDay: 50, days: 5, each: 1, defaults: { set: 'community', weight: 5 } });
  assert.deepEqual(r.posters.map((p) => [p.head, p.from, p.days]), [['A', 50, 1], ['B', 51, 1], ['A', 52, 1], ['B', 53, 1], ['A', 54, 1]]);
  assert.deepEqual(rotation({ items, startDay: 50, days: 5, each: 2, overlap: 2, defaults: {} }).posters.map((p) => [p.from, p.days]), [[50, 4], [52, 4], [54, 4]]);
  const c = calendar({ events: [{ date: '2026-11-02', head: 'EVENT' }, { day: 70, head: 'DAY', lead: 1 }], todayDay: 50, todayDate: '2026-10-19', lead: 2, defaults: {} });
  assert.deepEqual(c.posters.map((p) => [p.from, p.until]), [[62, 65], [69, 71]]);
  assert.throws(() => calendar({ events: [{ date: '2026-10-01', head: 'OLD' }], todayDay: 50, todayDate: '2026-10-19' }), /past/);
  const ok = compilePosters(r, { today: 49, role: 'publisher' });
  assert.ok(ok.findings.ok, JSON.stringify(ok.findings.errors));
  assert.deepEqual(rotation({ items, startDay: 50, days: 5, defaults: {} }), rotation({ items, startDay: 50, days: 5, defaults: {} }));
});

test('hall entries are shaped for the preview', () => {
  const { posters } = compilePosters(doc([{ head: 'A', colour: 'pink', art: 'trophy', from: '+1', days: 1 }]), { today: 10, role: 'publisher' });
  const [e] = hallEntries(posters);
  assert.equal(e.c, 'white');
  assert.equal(e.evergreen, true);
  assert.equal(e.hidden, false);
  assert.deepEqual(Object.keys(e).sort(), ['actId', 'actKind', 'actText', 'art', 'c', 'cols', 'end', 'evergreen', 'foot', 'fps', 'frames', 'head', 'hidden', 'id', 'imageHash', 'imageId', 'imageSize', 'kind', 'scope', 'set', 'start', 'sub', 'weight']);
});

/* ---------------- the bot ---------------- */
async function fresh() {
  ({ simnet, deployer, W } = await boot());
  t = simnetTransport(simnet, { deployer });
  await setPublisher(t, 'posters', deployer, pub());
}
const compile = async (posters, sender = pub()) => {
  const c = await botContext(t, sender);
  const r = compilePosters(doc(posters), { today: c.today, role: c.admin ? 'admin' : 'publisher' });
  assert.ok(r.findings.ok, JSON.stringify(r.findings.errors));
  return r.posters;
};

test('bot: a dry run changes nothing', async () => {
  await fresh();
  const posters = await compile(mk(5, today() + 1));
  const logs = [];
  const r = await runBot(t, { posters, sender: pub(), execute: false, log: (m) => logs.push(m) });
  assert.equal(r.sent, 0);
  assert.match(logs.join('\n'), /dry run/);
  assert.equal((await readAllPosters(t)).length, 0);
});

test('bot: stops at the daily cap, one batch at a time, and the contract agrees', async () => {
  await fresh();
  const posters = await compile(mk(30, today() + 1).map((p, i) => ({ ...p, head: 'P' + i })));
  // the live cap (12) bites before the daily cap (24) with the review lane off; raise it so the daily cap is what we meet
  await t.send('posters', 'set-caps', [Cl.uint(24), Cl.uint(30), Cl.uint(1)], deployer);
  const journal = newJournal();
  let r = await runBot(t, { posters, sender: pub(), execute: true, journal, maxBatches: 1 });
  assert.equal(r.sent, 10); assert.equal(r.status, 'more-to-do');
  r = await runBot(t, { posters, sender: pub(), execute: true, journal, maxBatches: 1 });
  assert.equal(r.status, 'waiting', 'a second write in the same burn block is too soon');
  simnet.mineEmptyBurnBlocks(1);
  r = await runBot(t, { posters, sender: pub(), execute: true, journal, maxBatches: 1 });
  assert.equal(r.sent, 10);
  simnet.mineEmptyBurnBlocks(1);
  r = await runBot(t, { posters, sender: pub(), execute: true, journal, maxBatches: 3 });
  assert.equal(r.sent, 4, 'only the 4 left of the 24 a day');
  assert.equal(r.status, 'capped');
  assert.equal((await readAllPosters(t)).length, 24);
  // the contract would have said the same
  simnet.mineEmptyBurnBlocks(1);
  const raw = await t.send('posters', 'add-poster', [posterCv(rawPoster({ head: 'ONE MORE' }))], pub());
  assert.equal(Number(raw.value), 107);
});

test('bot: a lost journal does not cause duplicates (the chain is checked too)', async () => {
  const posters = await compile(mk(2, today() + 1).map((p, i) => ({ ...p, head: 'P' + i })));
  simnet.mineEmptyBurnBlocks(1);
  const before = (await readAllPosters(t)).length;
  const r = await runBot(t, { posters, sender: pub(), execute: true, journal: newJournal() });
  assert.equal(r.status, 'nothing-to-do');
  assert.equal((await readAllPosters(t)).length, before);
});

test('bot: live cap, waitForGap and the contract agree', async () => {
  await fresh();
  const posters = await compile(mk(15, today() + 1).map((p, i) => ({ ...p, head: 'L' + i })));
  const r = await runBot(t, { posters, sender: pub(), execute: true, journal: newJournal(), maxBatches: 5, waitForGap: true });
  assert.equal(r.sent, 12);
  assert.equal(r.status, 'capped');
  assert.match(r.reason, /live cap of 12/);
  simnet.mineEmptyBurnBlocks(1);
  const raw = await t.send('posters', 'add-poster', [posterCv(rawPoster({ head: 'ONE MORE' }))], pub());
  assert.equal(Number(raw.value), 108);
});

test('bot: kill switch, before and in the middle of a run', async () => {
  await fresh();
  const posters = await compile(mk(25, today() + 1).map((p, i) => ({ ...p, head: 'K' + i })));
  await t.send('posters', 'set-caps', [Cl.uint(50), Cl.uint(50), Cl.uint(1)], deployer);
  let r = await runBot(t, { posters, sender: pub(), execute: true, journal: newJournal(), kill: () => true });
  assert.equal(r.status, 'stopped'); assert.match(r.reason, /kill switch/);
  assert.equal((await readAllPosters(t)).length, 0);
  let calls = 0;
  r = await runBot(t, { posters, sender: pub(), execute: true, journal: newJournal(), maxBatches: 5, waitForGap: true, kill: () => ++calls > 2 });
  assert.equal(r.status, 'stopped');
  assert.equal((await readAllPosters(t)).length, 10, 'exactly the first batch went out before the switch');
});

test('bot: paused contract, lost whitelist, core posters from a publisher, past start days', async () => {
  await fresh();
  const posters = await compile(mk(3, today() + 1).map((p, i) => ({ ...p, head: 'Z' + i })));
  await t.send('posters', 'set-paused', [Cl.bool(true)], deployer);
  let r = await runBot(t, { posters, sender: pub(), execute: true, journal: newJournal() });
  assert.match(r.reason, /paused/);
  await t.send('posters', 'set-paused', [Cl.bool(false)], deployer);
  await t.send('posters', 'set-publisher', [Cl.principal(pub()), Cl.bool(false)], deployer);
  r = await runBot(t, { posters, sender: pub(), execute: true, journal: newJournal() });
  assert.match(r.reason, /not the admin or a whitelisted publisher/);
  await setPublisher(t, 'posters', deployer, pub());
  const core = compilePosters(doc([{ head: 'CORE', from: '+1', days: 2, set: 'core' }]), { today: today(), role: 'admin' }).posters;
  r = await runBot(t, { posters: core, sender: pub(), execute: true, journal: newJournal() });
  assert.match(r.reason, /only the admin/);
  simnet.mineEmptyBurnBlocks(144 * 3);
  r = await runBot(t, { posters, sender: pub(), execute: true, journal: newJournal() });
  assert.equal(r.status, 'nothing-to-do');
  assert.equal(r.skipped.length, 3);
});

test('bot as admin: no caps, core posters allowed', async () => {
  await fresh();
  const core = compilePosters(doc(mk(10, today() + 1).map((p, i) => ({ ...p, head: 'A' + i })), { set: 'core', weight: 40 }), { today: today(), role: 'admin' }).posters;
  const r = await runBot(t, { posters: core, sender: deployer, execute: true, journal: newJournal() });
  assert.equal(r.sent, 10);
  assert.equal((await readLive(t)).length, 10);
});

test('review lane: publisher posters wait hidden, the admin releases them, nobody else can', async () => {
  await fresh();
  await t.send('posters', 'set-review-lane', [Cl.bool(true)], deployer);
  const posters = await compile(mk(3, today() + 1).map((p, i) => ({ ...p, head: 'R' + i })));
  const r = await runBot(t, { posters, sender: pub(), execute: true, journal: newJournal() });
  assert.equal(r.sent, 3);
  assert.equal((await readLive(t)).length, 0);
  const waiting = await waitingPosters(t);
  assert.equal(waiting.length, 3);
  const ids = waiting.map((p) => p.id);
  const dry = await releasePosters(t, { ids, execute: false });
  assert.equal(dry.released, 0);
  const bad = await releasePosters(t, { ids, execute: true, from: pub() });
  assert.match(bad.failed, /u100/);
  const ok = await releasePosters(t, { ids: ids.slice(0, 2), execute: true, from: deployer });
  assert.equal(ok.released, 2);
  assert.equal((await readLive(t)).length, 2);
  assert.equal((await waitingPosters(t)).length, 1);
  assert.equal((await readPosterConfig(t)).reviewLane, true);
});
