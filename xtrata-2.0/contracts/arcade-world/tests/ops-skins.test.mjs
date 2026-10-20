// Operator toolkit, door skins: the offline list, the registration plan, drift, and the CLI's refusal to send without --execute.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cl } from '@stacks/transactions';
import { boot } from './helpers.mjs';
import { simnetTransport } from '../ops/lib/transport.mjs';
import { builtinSkins, planSkins, runSkins, readSkin } from '../ops/lib/skins.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');

test('offline: the hall has 19 built-in skins, listed in a fixed order, all registrable', () => {
  const skins = builtinSkins();
  assert.equal(skins.length, 19);
  assert.equal(skins[0].key, 'oak');
  assert.equal(new Set(skins.map((s) => s.key)).size, 19);
  for (const s of skins) { assert.match(s.key, /^[a-z0-9-]{2,24}$/); assert.ok(s.name.length <= 32 && s.styles > 0 && s.styles < 16384); }
  const r = spawnSync('node', [join(root, 'ops', 'skins.mjs')], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /built-in skins/); assert.equal(r.stdout.split('\n').filter((l) => /frame .* hardware .* wear/.test(l)).length, 19);
});

test('the plan registers only what is missing, reports drift, and a dry run sends nothing', async () => {
  const { simnet, deployer } = await boot();
  const t = simnetTransport(simnet, { deployer });
  let plan = await planSkins(t);
  assert.equal(plan.todo.length, 19); assert.equal(plan.drift.length, 0);
  const dry = await runSkins(t, plan, { execute: false });
  assert.equal(dry.registered, 0); assert.equal((await planSkins(t)).todo.length, 19);
  // register just the first three, then plan again
  const part = { todo: plan.todo.slice(0, 3), drift: [] };
  const r = await runSkins(t, part, { execute: true, from: deployer });
  assert.equal(r.registered, 3, r.failed);
  plan = await planSkins(t); assert.equal(plan.todo.length, 16); assert.equal(plan.todo[0].key, builtinSkins()[3].key);
  // the admin changes which styles a skin may dress; the tool reports it and does not touch it
  const id = (await readSkin(t, 'oak')).id;
  const set = await t.send('skins', 'set-skin-styles', [Cl.uint(id), Cl.uint(1)], deployer); assert.ok(set.ok);
  plan = await planSkins(t); assert.equal(plan.drift.length, 1); assert.match(plan.drift[0], /oak/);
  const rest = await runSkins(t, plan, { execute: true, from: deployer }); assert.equal(rest.registered, 16);
  assert.equal((await planSkins(t)).todo.length, 0);
});

test('the CLI refuses to send on a network without --execute and needs the skins contract id', () => {
  const r = spawnSync('node', [join(root, 'ops', 'skins.mjs'), '--network', 'testnet', '--world', 'ST000000000000000000002AMW42H.xtrata-world-v1', '--posters', 'ST000000000000000000002AMW42H.xtrata-posters-v1'], { encoding: 'utf8' });
  assert.notEqual(r.status, 0); assert.match(r.stderr + r.stdout, /usage|--skins|--sender/);
});
