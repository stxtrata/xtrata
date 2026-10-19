// The dress rehearsal: the whole launch sequence, step by step, on a simnet, using the same library calls the real tools use.
// It proves the order of operations and the checks work. It cannot prove anything about a real network (fees, timing, explorers).
import { Cl } from '@stacks/transactions';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { simnetTransport } from './transport.mjs';
import { planSetup, runSetup } from './setup.mjs';
import { parseSceneFile, compileScenes } from './scene.mjs';
import { submitScenes } from './submit.mjs';
import { readLookBook, readRooms, readBayView, readScenes, verifyScenes, readWorldConfig, readPosterConfig, readLive, readAllPosters, resolveAt } from './readback.mjs';
import { snapshotAt } from './snapshot.mjs';
import { parsePosterFile, compilePosters, todayOf } from './posters.mjs';
import { rotation } from './campaign.mjs';
import { runBot, newJournal, botContext } from './bot.mjs';
import { waitingPosters, releasePosters } from './review.mjs';
import { revertBay } from './revert.mjs';
import { deploySources } from './deploy.mjs';
import { builtinSkins, planSkins, runSkins, readSkin } from './skins.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const example = (n) => parseSceneFile(readFileSync(join(here, '..', 'examples', n), 'utf8'));

// simnet: a booted Clarinet simnet. accounts: { deployer, publisher, newAdmin }.
export async function runRehearsal({ simnet, accounts, log = () => {} }) {
  const { deployer, publisher, newAdmin } = accounts;
  const t = simnetTransport(simnet, { deployer });
  const steps = [];
  const step = async (name, fn) => {
    try { const detail = await fn(); steps.push({ name, ok: true, detail: detail || '' }); log(`ok    ${name}${detail ? ': ' + detail : ''}`); }
    catch (e) { steps.push({ name, ok: false, detail: e.message }); log(`FAIL  ${name}: ${e.message}`); throw e; }
  };
  const must = (c, msg) => { if (!c) throw new Error(msg); };
  let admin = deployer;

  try {
    await step('1. deploy order is known and the contracts are live', async () => {
      const src = deploySources();
      must(src.map((s) => s.name).join() === 'mock-xtrata-core,xtrata-posters-v1,xtrata-world-v1,xtrata-door-skins-v1', 'deploy order changed');
      must((await t.ro('world', 'get-version')) === 0 && (await t.ro('posters', 'get-version')) === 0, 'contracts should start at version 0');
      return src.map((s) => `${s.name} ${s.bytes}B`).join(', ');
    });
    await step('2. the deployer is the admin of both contracts', async () => {
      must((await readWorldConfig(t)).admin === deployer && (await readPosterConfig(t)).admin === deployer, 'deployer should be admin');
    });
    await step('3. hand-over: propose, accept, and the old admin loses its powers', async () => {
      const cfgOf = (w) => (w === 'world' ? readWorldConfig(t) : readPosterConfig(t));
      for (const w of ['world', 'posters']) {
        must((await t.send(w, 'propose-admin', [Cl.principal(newAdmin)], deployer)).ok, `${w} propose-admin`);
        let c = await cfgOf(w);
        must(c.admin === deployer && c.pendingAdmin === newAdmin, `${w}: before accept the admin must not change`);
        must(!(await t.send(w, 'accept-admin', [], publisher)).ok, `${w}: only the proposed address can accept`);
        must((await t.send(w, 'accept-admin', [], newAdmin)).ok, `${w} accept-admin`);
        c = await cfgOf(w);
        must(c.admin === newAdmin && c.pendingAdmin === null, `${w}: new admin should hold it`);
      }
      admin = newAdmin;
      const old = await t.send('world', 'set-paused', [Cl.bool(true)], deployer);
      must(!old.ok && Number(old.value) === 200, 'the old admin must be refused (u200)');
      return `admin is now ${newAdmin}`;
    });
    let setup;
    await step('4. one-time set-up: 23 looks, 2 rooms, the publisher on both contracts', async () => {
      const plan = await planSetup(t, { owner: admin, publishers: [publisher] });
      must(plan.looks.length === 23 && plan.rooms.length === 2 && plan.publishers.length === 2, `unexpected plan ${plan.looks.length}/${plan.rooms.length}/${plan.publishers.length}`);
      setup = await runSetup(t, plan, { execute: true, from: admin });
      must(!setup.failed, setup.failed);
      const again = await planSetup(t, { owner: admin, publishers: [publisher] });
      must(!again.looks.length && !again.rooms.length && !again.publishers.length, 'running set-up again must find nothing to do');
      return `${setup.looks} looks, ${setup.rooms} rooms, ${setup.publishers} grants; a second run does nothing`;
    });
    let ctx;
    const mkCtx = async () => ({ looks: await readLookBook(t), rooms: await readRooms(t, ['arcade-hall', 'lobby']), height: await t.height(), timelineUsed: {} });
    await step('5. at launch both bays show posters, exactly as #3111', async () => {
      for (const b of [0, 1]) { const v = await readBayView(t, 'arcade-hall', b); must(v && v.active === null, `bay ${b} should have no scene`); }
    });
    await step('6. the launch story validates against the chain and goes in as one batch', async () => {
      ctx = await mkCtx();
      const { findings, scenes } = compileScenes(example('launch-story.scene.json'), ctx);
      must(findings.ok, JSON.stringify(findings.errors));
      const dry = await submitScenes(t, scenes, { execute: false });
      must(!dry.executed && (await readScenes(t, 'arcade-hall', 0)).length === 0, 'a dry run must send nothing');
      const r = await submitScenes(t, scenes, { execute: true, from: admin });
      must(!r.failed && r.sent === 1 && r.verify.ok, `submit failed ${JSON.stringify(r.failed)}`);
      const again = await submitScenes(t, scenes, { execute: true, from: admin });
      must(again.sent === 0 && again.skipped === 1, 're-running must send nothing');
      ctx.scenes = scenes;
      return `${scenes.length} scenes, 1 call, read back OK, re-run is a no-op`;
    });
    await step('7. the bay plays the story: posters, curtain, locked door, open door, as time passes', async () => {
      const starts = [...new Set(ctx.scenes.filter((s) => s.bay === 0).map((s) => s.from))];
      const seen = [];
      for (const h of [starts[0] - 1, ...starts]) {
        const now = await t.height(); if (h > now) t.mine(h - now);
        const v = await readBayView(t, 'arcade-hall', 0);
        seen.push(v.active ? ['wall', 'door'][v.active.base - 1] + '/' + ['none', 'knock', 'peek', 'enter'][v.active.interaction] : 'posters');
        const snap = snapshotAt({ scenes: ctx.scenes, looks: ctx.looks, height: h });
        must((snap.bays[0].scene === null) === (v.active === null), `preview and chain disagree at block ${h}`);
      }
      must(seen.join() === 'posters,wall/peek,door/knock,door/enter', 'unexpected sequence ' + seen.join());
      return seen.join(' -> ');
    });
    await step('8. revert drill: put bay 0 back to posters now', async () => {
      const r = await revertBay(t, { room: 'arcade-hall', bay: 0, execute: true, from: admin });
      must(!r.failed, r.failed);
      const v = await readBayView(t, 'arcade-hall', 0);
      must(v.active && v.active.base === 0, 'bay 0 should show a posters scene');
    });
    await step('9. retract-scene takes a scheduled scene out', async () => {
      const all = await readScenes(t, 'arcade-hall', 1);
      const r = await t.send('world', 'retract-scene', [Cl.stringAscii('arcade-hall'), Cl.uint(1), Cl.uint(all[all.length - 1].seq)], admin);
      must(r.ok, 'retract-scene');
    });
    await step('10. poster campaign: a week of posters from a generator, sent by the bot as the publisher', async () => {
      await t.send('posters', 'set-caps', [Cl.uint(24), Cl.uint(12), Cl.uint(1)], admin);
      const c = await botContext(t, publisher);
      const items = JSON.parse(readFileSync(join(here, '..', 'examples', 'week.items.json'), 'utf8'));
      const doc = rotation({ items, startDay: c.today + 1, days: 7, each: 1, defaults: { set: 'community', weight: 5 } });
      const { findings, posters } = compilePosters(doc, { today: c.today, role: 'publisher', config: c.cfg, usedToday: 0, liveOwned: c.liveOwned });
      must(findings.ok, JSON.stringify(findings.errors));
      const dry = await runBot(t, { posters, sender: publisher, execute: false });
      must(dry.sent === 0 && (await readAllPosters(t)).length === 0, 'dry run must send nothing');
      const r = await runBot(t, { posters, sender: publisher, execute: true, journal: newJournal(), maxBatches: 3, waitForGap: true });
      must(r.sent === 7 && (await readLive(t)).length === 7, `expected 7 live posters, got ${r.sent}/${(await readLive(t)).length}`);
      const again = await runBot(t, { posters, sender: publisher, execute: true, journal: newJournal() });
      must(again.status === 'nothing-to-do', 'a second run must find nothing to send');
      return '7 posters sent in one batch; a second run (journal lost) sends nothing';
    });
    await step('11. kill switch and caps stop the bot', async () => {
      const c = await botContext(t, publisher);
      const items = Array.from({ length: 8 }, (_, i) => ({ head: 'EXTRA ' + i, art: 'trophy' }));
      const doc = rotation({ items, startDay: c.today + 20, days: 8, each: 1, defaults: { set: 'community', weight: 5 } });
      const { posters } = compilePosters(doc, { today: c.today, role: 'publisher' });
      let r = await runBot(t, { posters, sender: publisher, execute: true, journal: newJournal(), kill: () => true });
      must(r.status === 'stopped' && /kill switch/.test(r.reason), 'kill switch must stop the run');
      t.mine(1);
      r = await runBot(t, { posters, sender: publisher, execute: true, journal: newJournal(), maxBatches: 3, waitForGap: true });
      must(r.status === 'capped' && /live cap/.test(r.reason), `expected the live cap to stop it, got ${r.status}: ${r.reason}`);
      return `stopped at the live cap after ${r.sent} more`;
    });
    await step('12. review lane: publisher posters wait hidden until the admin releases them', async () => {
      await t.send('posters', 'set-review-lane', [Cl.bool(true)], admin);
      const c = await botContext(t, publisher);
      // a publisher at its live cap can still queue posters while the lane is on (they are hidden, so they do not count as live)
      const doc = rotation({ items: [{ head: 'WAITING A', art: 'gate' }, { head: 'WAITING B', art: 'gear' }], startDay: c.today + 40, days: 2, defaults: { set: 'community', weight: 5 } });
      const { posters } = compilePosters(doc, { today: c.today, role: 'publisher' });
      t.mine(1);
      const before = (await readLive(t)).length;
      const r = await runBot(t, { posters, sender: publisher, execute: true, journal: newJournal() });
      must(r.sent === 2 && (await readLive(t)).length === before, 'queued posters must not be live');
      const waiting = await waitingPosters(t);
      must(waiting.length === 2, `expected 2 waiting, got ${waiting.length}`);
      const rel = await releasePosters(t, { ids: waiting.map((p) => p.id), execute: true, from: admin });
      must(!rel.failed && (await readLive(t)).length === before + 2, 'release should make them live');
      await t.send('posters', 'set-review-lane', [Cl.bool(false)], admin);
    });
    await step('13. pause drill: both contracts can be stopped; the admin can still retract scenes; others cannot add', async () => {
      const { sceneCv } = await import('./clar.mjs');
      const plain = sceneCv({ room: 'arcade-hall', bay: 1, from: 0, base: 1, doorLook: null, layers: [], interaction: 0, link: null });
      await t.send('posters', 'set-paused', [Cl.bool(true)], admin);
      t.mine(1);
      const r = await runBot(t, { posters: [], sender: publisher, execute: true });
      must(r.status === 'stopped' && /paused/.test(r.reason), 'the bot must stop while the poster contract is paused');
      const direct = await t.send('posters', 'add-poster', [(await import('./clar.mjs')).posterCv({ set: 1, kind: 0, head: 'X', sub: '', foot: '', colour: 'gold', art: 'trophy', imageId: 0, imageHash: new Uint8Array(0), imageSize: 0, cols: 0, frames: 0, fps: 0, actKind: 0, actId: 0, actText: '', weight: 5, startDay: todayOf(await t.height()) + 1, endDay: todayOf(await t.height()) + 2, scope: [], evergreen: false, payout: null })], publisher);
      must(!direct.ok && Number(direct.value) === 101, 'the contract must refuse writes while paused (u101)');
      await t.send('world', 'set-paused', [Cl.bool(true)], admin);
      const add = await t.send('world', 'add-scene', [plain], publisher);
      must(!add.ok && Number(add.value) === 201, 'a non-admin must be refused while the world is paused (u201)');
      const mine = (await readScenes(t, 'arcade-hall', 0)).filter((x) => !x.retracted);
      const ret = await t.send('world', 'retract-scene', [Cl.stringAscii('arcade-hall'), Cl.uint(0), Cl.uint(mine[mine.length - 1].seq)], admin);
      must(ret.ok, 'retract-scene must work while paused');
      await t.send('posters', 'set-paused', [Cl.bool(false)], admin);
      await t.send('world', 'set-paused', [Cl.bool(false)], admin);
      return 'writes refused while paused (u101/u201); retract still works; both unpaused again';
    });
    await step('14. the workshop scene and a final read-back of everything', async () => {
      ctx = await mkCtx();
      ctx.timelineUsed = { 'arcade-hall#1': (await t.ro('world', 'get-timeline', [Cl.stringAscii('arcade-hall'), Cl.uint(1)])).length };
      const { findings, scenes } = compileScenes(example('workshop.scene.json'), ctx);
      must(findings.ok, JSON.stringify(findings.errors));
      const r = await submitScenes(t, scenes, { execute: true, from: admin });
      must(!r.failed && r.verify.ok, 'workshop submit failed');
      const v = await verifyScenes(t, scenes, { submittedAt: await t.height() });
      must(v.ok, 'read-back should match');
      const res = await resolveAt(t, 'arcade-hall', 1, [scenes[0].from - 1, scenes[0].from]);
      must(res[0].seq !== res[1].seq, 'the workshop must start at its block');
    });
    await step('15. door skins: hand-over, then the built-in set registers once, a second run does nothing, publishers cannot add built-ins', async () => {
      must((await t.send('skins', 'propose-admin', [Cl.principal(newAdmin)], deployer)).ok && (await t.send('skins', 'accept-admin', [], newAdmin)).ok, 'skins hand-over');
      const plan = await planSkins(t);
      const all = builtinSkins();
      must(plan.todo.length === all.length && plan.drift.length === 0, `unexpected skins plan ${plan.todo.length}/${plan.drift.length}`);
      const dry = await runSkins(t, plan, { execute: false });
      must(!dry.failed && Number(await t.ro('skins', 'get-skin-count')) === 0, 'a dry run must send nothing');
      const r = await runSkins(t, plan, { execute: true, from: newAdmin });
      must(!r.failed && r.registered === all.length, r.failed || `registered ${r.registered}`);
      const again = await planSkins(t);
      must(!again.todo.length && !again.drift.length, 'running it again must find nothing to do');
      const oak = await readSkin(t, 'oak');
      must(oak && oak.tier === 0 && oak.approved && !oak.hidden, 'oak should be a usable built-in');
      await t.send('skins', 'set-publisher', [Cl.principal(publisher), Cl.bool(true)], newAdmin);
      const bad = await t.send('skins', 'register-skin', (await import('./skins.mjs')).skinArgs({ key: 'sneaky', name: 'Sneaky', family: 0, builtin: 'sneaky', styles: 1, sound: 0, frame: 'wood', hardware: 'brass', wear: 0 }), publisher);
      must(!bad.ok && Number(bad.value) === 300, 'a publisher must not be able to name a built-in (u300)');
      return `${r.registered} skins registered; a second run does nothing`;
    });
  } catch (e) { return { ok: false, steps, error: e.message }; }
  return { ok: true, steps };
}

export function reportMarkdown(result, { title = 'Arcade world dress rehearsal' } = {}) {
  const lines = [`# ${title}`, '', `Result: **${result.ok ? 'PASS' : 'FAIL'}** (${result.steps.filter((s) => s.ok).length} of ${result.steps.length} steps)`, 'Run on a simulated chain. Nothing was sent to any network.', ''];
  result.steps.forEach((s) => lines.push(`- ${s.ok ? 'PASS' : 'FAIL'} ${s.name}${s.detail ? ' - ' + s.detail : ''}`));
  return lines.join('\n') + '\n';
}
