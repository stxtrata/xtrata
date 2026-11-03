// Offline signing for the browser relay: it signs and packs without any network, and refuses without the same confirmations as the other sending tools.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { randomPrivateKey } from '@stacks/transactions';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = (args, env = {}) => spawnSync('node', [join(root, 'ops', 'relay.mjs'), ...args], { encoding: 'utf8', env: { ...process.env, XA_OPS_CONFIRM: '', XA_OPS_KEY_FILE: '', XA_OPS_KILL: join(tmpdir(), 'no-such-kill-file'), ...env } });
const dir = mkdtempSync(join(tmpdir(), 'xa-relay-'));
const keyFile = join(dir, 'k.key'); writeFileSync(keyFile, randomPrivateKey());

test('relay refuses without --execute, without the confirmation, and with the kill switch on', () => {
  const a = run(['call', '--nonce', '0', '--key-file', keyFile, '--which', 'world', '--fn', 'set-paused', '--arg', 'bool:true']);
  assert.equal(a.status, 2); assert.match(a.stderr, /REFUSED: dry run/);
  const b = run(['call', '--execute', '--nonce', '0', '--key-file', keyFile, '--which', 'world', '--fn', 'set-paused', '--arg', 'bool:true']);
  assert.equal(b.status, 2); assert.match(b.stderr, /XA_OPS_CONFIRM=broadcast-testnet/);
  const kill = join(dir, 'KILL'); writeFileSync(kill, '');
  const c = run(['call', '--execute', '--nonce', '0', '--key-file', keyFile, '--which', 'world', '--fn', 'set-paused', '--arg', 'bool:true'], { XA_OPS_CONFIRM: 'broadcast-testnet', XA_OPS_KILL: kill });
  assert.equal(c.status, 2); assert.match(c.stderr, /kill switch is on/);
});

test('relay signs offline, with explicit nonces, and packs signed hex only (no key)', () => {
  const out = join(dir, 'setup.txt');
  const r = run(['setup', '--execute', '--nonce', '5', '--key-file', keyFile, '--out', out], { XA_OPS_CONFIRM: 'broadcast-testnet' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /25 transaction\(s\) signed offline .* nonces 5\.\.29/);
  const packed = readFileSync(out, 'utf8');
  const items = JSON.parse(gunzipSync(Buffer.from(packed, 'base64')).toString('utf8'));
  assert.equal(items.length, 25);
  assert.ok(items.every((i) => /^[0-9a-f]+$/.test(i.hex) && i.label));
  assert.ok(!packed.includes(readFileSync(keyFile, 'utf8').trim()) && !JSON.stringify(items).includes(readFileSync(keyFile, 'utf8').trim()));
});
