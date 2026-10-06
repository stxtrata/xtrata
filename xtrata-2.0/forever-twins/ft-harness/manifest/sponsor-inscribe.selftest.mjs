// Plain-node self-test for sponsor-inscribe.mjs (no network beyond localhost, no real key).
//   node manifest/sponsor-inscribe.selftest.mjs
import assert from 'node:assert/strict';
import http from 'node:http';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { privateKeyToAddress, deserializeTransaction } from '@stacks/transactions';
import { parseIds, verifyToken, fetchBytes, buildInscribeTx } from './sponsor-inscribe.mjs';
import { sha256Hex, xtrataHashHex, chunk } from './lib.mjs';

const files = { 1: randomBytes(40000), 2: randomBytes(500) };
const tokens = [];
for (const [id, b] of Object.entries(files)) {
  tokens.push({ id: Number(id), twin: {
    totalSize: b.length, sha256: await sha256Hex(b), contentHash: '0x' + (await xtrataHashHex(b)) },
    original: { mediaUris: [`ipfs://QmTestCid/${id}.png`] } });
}
const srv = http.createServer((q, r) => { const m = /(\d+)\.png$|\/f\/(\d+)$/.exec(q.url); if (!m) { r.writeHead(404); return r.end(); } r.end(files[m[1] || m[2]]); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const port = srv.address().port;

// 1 parseIds
assert.deepEqual(parseIds('174'), [174]);
assert.deepEqual(parseIds('1-3,10,2'), [1, 2, 3, 10]);
assert.throws(() => parseIds('5-2')); assert.throws(() => parseIds('x'));
// 2 fetch + verify
const got = await fetchBytes(`http://127.0.0.1:${port}/f/1`);
assert.equal(got.length, 40000);
const ch = await verifyToken(tokens[0], got);
assert.equal(ch.length, 3); assert.equal(ch[0].length, 16384);
// 3 tamper detection
const bad = new Uint8Array(got); bad[100] ^= 1;
await assert.rejects(() => verifyToken(tokens[0], bad), /sha256/);
await assert.rejects(() => verifyToken(tokens[0], got.slice(0, 39999)), /size/);
// 4 offline tx build
const key = randomBytes(32).toString('hex') + '01';
const addr = privateKeyToAddress(key, 'mainnet');
const helper = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-test';
const t = await buildInscribeTx({ helper, token: tokens[0], chunks: ch, senderKey: key, senderAddress: addr, nonce: 7, capUstx: 150000n, feeUstx: 3000 });
const d = deserializeTransaction(t.serialize());
assert.equal(d.payload.functionName.content, 'inscribe');
assert.equal(BigInt(d.auth.spendingCondition.nonce), 7n);
assert.equal(d.postConditions.values.length, 1);
// 5 CLI: offline dry run against local server via a temp manifest
const dir = mkdtempSync(join(tmpdir(), 'si-'));
const mf = { collectionKey: 'test', tokens };
writeFileSync(join(dir, 'm.json'), JSON.stringify(mf));
const run = (args, env = {}) => new Promise((res) => {
  const c = spawn('node', [new URL('./sponsor-inscribe.mjs', import.meta.url).pathname, ...args], { env: { ...process.env, ...env } });
  let stdout = '', stderr = ''; c.stdout.on('data', (d) => stdout += d); c.stderr.on('data', (d) => stderr += d);
  c.on('close', (status) => res({ status, stdout, stderr }));
});
const r1 = await run(['--manifest', join(dir, 'm.json'), '--offline', '--gateway', `http://127.0.0.1:${port}`]);
console.log(r1.stdout, r1.stderr);
assert.equal(r1.status, 0); assert.match(r1.stdout, /nothing was signed/);
// 6 execute refuses without confirm / key
const r2 = await run(['--manifest', join(dir, 'm.json'), '--helper', helper, '--execute']);
assert.notEqual(r2.status, 0);
const r3 = await run(['--manifest', join(dir, 'm.json'), '--helper', helper, '--execute', '--confirm', helper], { SPONSOR_PRIVATE_KEY: '' });
assert.notEqual(r3.status, 0);
srv.close();
console.log('ALL SELF-TESTS PASSED');
