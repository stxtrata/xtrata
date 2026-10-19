// Operator toolkit, launch rehearsal and safety: the whole sequence on a simnet, and proof that nothing can be sent for real by accident.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomPrivateKey } from '@stacks/transactions';
import { boot } from './helpers.mjs';
import { runRehearsal, reportMarkdown } from '../ops/lib/rehearsal.mjs';
import { deploySources, DEPLOY_ORDER } from '../ops/lib/deploy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ops = (...a) => spawnSync('node', [join(root, 'ops', ...a.slice(0, 1)), ...a.slice(1)], { encoding: 'utf8', env: { ...process.env, XA_OPS_CONFIRM: '', XA_OPS_KEY_FILE: '', XA_OPS_KILL: join(tmpdir(), 'xa-no-kill') }, timeout: 60000 });

test('the full launch rehearsal passes on a simulated chain', async () => {
  const { simnet, deployer, W } = await boot();
  const logs = [];
  const r = await runRehearsal({ simnet, accounts: { deployer, publisher: W[0], newAdmin: W[5] }, log: (m) => logs.push(m) });
  assert.equal(r.ok, true, r.error || JSON.stringify(r.steps.filter((s) => !s.ok)));
  assert.equal(r.steps.length, 14);
  assert.ok(r.steps.every((s) => s.ok));
  const md = reportMarkdown(r);
  assert.match(md, /Result: \*\*PASS\*\* \(14 of 14 steps\)/);
  assert.match(md, /Nothing was sent to any network/);
});

test('deploy list: three contracts in dependency order, test-network sources are the simnet sources unchanged', () => {
  assert.deepEqual(DEPLOY_ORDER, ['mock-xtrata-core', 'xtrata-posters-v1', 'xtrata-world-v1']);
  for (const s of deploySources()) {
    assert.equal(s.source, readFileSync(join(root, 'contracts', `${s.name}.clar`), 'utf8'));
    assert.equal(s.clarityVersion, 4);
    if (s.name !== 'mock-xtrata-core') assert.match(s.source, /\.mock-xtrata-core/, `${s.name} calls the stand-in core on a test network`);
  }
});

const NET = ['--network', 'testnet', '--world', 'ST000000000000000000002AMW42H.xtrata-world-v1', '--posters', 'ST000000000000000000002AMW42H.xtrata-posters-v1'];
const SENDING = [
  ['submit.mjs', join(root, 'ops', 'examples', 'launch-story.scene.json'), '--height', '1000', ...NET, '--execute'],
  ['setup-chain.mjs', ...NET, '--sender', 'ST000000000000000000002AMW42H', '--execute'],
  ['revert.mjs', ...NET, '--room', 'arcade-hall', '--bay', '0', '--sender', 'ST000000000000000000002AMW42H', '--execute'],
  ['review.mjs', ...NET, '--release', '1', '--execute'],
  ['bot.mjs', join(root, 'ops', 'examples', 'week.items.json'), ...NET, '--sender', 'ST000000000000000000002AMW42H', '--execute'],
  ['deploy.mjs', '--network', 'testnet', '--execute'],
];
for (const cmd of SENDING) {
  test(`${cmd[0]} --execute is refused without the confirmation, before it reads anything`, () => {
    const r = ops(...cmd);
    assert.equal(r.status, 2, r.stdout + r.stderr);
    assert.match(r.stderr, /REFUSED: set XA_OPS_CONFIRM=broadcast-testnet/);
  });
  test(`${cmd[0]} --execute is refused with the confirmation but no key file`, () => {
    const r = spawnSync('node', [join(root, 'ops', cmd[0]), ...cmd.slice(1)], { encoding: 'utf8', env: { ...process.env, XA_OPS_CONFIRM: 'broadcast-testnet', XA_OPS_KEY_FILE: '', XA_OPS_KILL: join(tmpdir(), 'xa-no-kill') }, timeout: 60000 });
    assert.equal(r.status, 2, r.stdout + r.stderr);
    assert.match(r.stderr, /key file/);
  });
}

test('mainnet: deploy.mjs refuses outright, others need the extra flag', () => {
  const d = ops('deploy.mjs', '--network', 'mainnet');
  assert.notEqual(d.status, 0); assert.match(d.stderr, /testnet only/);
  const kf = join(mkdtempSync(join(tmpdir(), 'xa-k-')), 'k'); writeFileSync(kf, randomPrivateKey());
  const r = spawnSync('node', [join(root, 'ops', 'submit.mjs'), join(root, 'ops', 'examples', 'launch-story.scene.json'), '--height', '1000', '--network', 'mainnet', '--world', 'SP1.a', '--posters', 'SP1.b', '--execute', '--key-file', kf],
    { encoding: 'utf8', env: { ...process.env, XA_OPS_CONFIRM: 'broadcast-mainnet', XA_OPS_KILL: join(tmpdir(), 'xa-no-kill') }, timeout: 60000 });
  assert.equal(r.status, 2); assert.match(r.stderr, /i-mean-mainnet/);
});

test('the kill switch file stops every sending tool', () => {
  const kill = join(mkdtempSync(join(tmpdir(), 'xa-kill-')), 'KILL'); writeFileSync(kill, '');
  const kf = join(mkdtempSync(join(tmpdir(), 'xa-k-')), 'k'); writeFileSync(kf, randomPrivateKey());
  for (const cmd of SENDING) {
    const r = spawnSync('node', [join(root, 'ops', cmd[0]), ...cmd.slice(1), '--key-file', kf], { encoding: 'utf8', env: { ...process.env, XA_OPS_CONFIRM: 'broadcast-testnet', XA_OPS_KILL: kill }, timeout: 60000 });
    assert.equal(r.status, 2, cmd[0] + ' ' + r.stdout + r.stderr);
    assert.match(r.stderr, /kill switch/, cmd[0]);
  }
});

test('offline commands work without a network or a key, and a dry run says so', () => {
  const ex = (n) => join(root, 'ops', 'examples', n);
  let r = ops('validate.mjs', ex('launch-story.scene.json'), '--height', '1000'); assert.equal(r.status, 0, r.stderr);
  r = ops('submit.mjs', ex('launch-story.scene.json'), '--height', '1000'); assert.equal(r.status, 0, r.stderr); assert.match(r.stdout, /DRY RUN: nothing was sent/);
  r = ops('validate-posters.mjs', ex('week.items.json')); assert.notEqual(r.status, 0);   // not a poster file: rejected, not crashed
  const out = join(mkdtempSync(join(tmpdir(), 'xa-camp-')), 'week.poster.json');
  r = ops('campaign.mjs', 'rotation', ex('week.items.json'), '--height', '1000', '--days', '4', '--out', out); assert.equal(r.status, 0, r.stderr);
  r = ops('validate-posters.mjs', out, '--height', '1000'); assert.equal(r.status, 0, r.stdout + r.stderr);
  r = ops('deploy.mjs', '--network', 'testnet', '--sender', 'ST000000000000000000002AMW42H'); assert.equal(r.status, 0, r.stderr); assert.match(r.stdout, /DRY RUN: nothing was sent/);
});

test('local output is git-ignored: previews, kill file, journals, keys', () => {
  const gi = readFileSync(join(root, 'ops', '.gitignore'), 'utf8');
  for (const p of ['out/', 'KILL', '.run-*.json', '*.key']) assert.ok(gi.split('\n').includes(p), p);
  assert.ok(existsSync(join(root, 'ops', 'README.md')));
  assert.ok(existsSync(join(root, 'ops', 'TESTNET-RUNBOOK.md')));
});
