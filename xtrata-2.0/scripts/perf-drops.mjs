#!/usr/bin/env node
/* Measure the read phase behind the drops page, against a real origin.
 *
 *   node scripts/perf-drops.mjs                     # production proxy
 *   node scripts/perf-drops.mjs --origin http://localhost:5173
 *   node scripts/perf-drops.mjs --json              # machine-readable
 *
 * Reports, per registry entry: request count, wall clock, cache hit rate, and
 * how many of those reads returned nothing. Run it before and after a change so
 * "it feels faster" becomes a number. Nothing here mutates state.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const originFlag = args.indexOf('--origin');
const ORIGIN = originFlag === -1 ? 'https://xtrata.xyz' : args[originFlag + 1];
const CONCURRENCY = Number(args[args.indexOf('--concurrency') + 1]) || 6;

const registry = JSON.parse(readFileSync(join(ROOT, 'src/data/drops-registry.json'), 'utf8'))
  .filter((e) => e.network === 'mainnet');

const uintHex = (n) => {
  const hex = BigInt(n).toString(16).padStart(32, '0');
  return `0x01${hex}`;
};

const readOnly = async (entry, fn, argsHex = []) => {
  const url = `${ORIGIN}/hiro/${entry.network}/v2/contracts/call-read/${entry.address}/${entry.contractName}/${fn}`;
  const started = performance.now();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: entry.address, arguments: argsHex })
  });
  const body = await res.json().catch(() => null);
  return {
    ms: performance.now() - started,
    status: res.status,
    cache: res.headers.get('x-xtrata-proxy-cache') ?? 'miss',
    keyPresent: res.headers.get('x-xtrata-hiro-key-present') ?? '?',
    // get-drop returns a bare (optional (tuple ...)): 0x0a = some, 0x09 = none.
    // It is not wrapped in a response, so there is no leading 0x07.
    present: typeof body?.result === 'string' && body.result.startsWith('0x0a')
  };
};

// Same bounded-concurrency shape as runReadOnlyLimited in src/home/main.js.
const runLimited = async (items, limit, task) => {
  const out = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
      while (cursor < items.length) {
        const i = cursor;
        cursor += 1;
        out[i] = await task(items[i]);
      }
    })
  );
  return out;
};

const measureEntry = async (entry) => {
  const started = performance.now();
  const last = await readOnly(entry, 'get-last-drop-id');
  // get-last-drop-id returns (ok uint) — 0x07 then 0x01 then a 16-byte uint.
  const lastRes = await fetch(
    `${ORIGIN}/hiro/${entry.network}/v2/contracts/call-read/${entry.address}/${entry.contractName}/get-last-drop-id`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: entry.address, arguments: [] }) }
  ).then((r) => r.json());
  const hex = String(lastRes?.result ?? '').replace(/^0x07/, '');
  const top = hex.startsWith('01') ? Number(BigInt(`0x${hex.slice(2, 34)}`)) : 0;

  const ids = Array.from({ length: top + 1 }, (_, i) => top - i);
  const reads = await runLimited(ids, CONCURRENCY, (id) => readOnly(entry, 'get-drop', [uintHex(id)]));
  const wall = performance.now() - started;

  const hits = reads.filter((r) => r.cache === 'hit').length;
  const present = reads.filter((r) => r.present).length;
  return {
    contract: entry.contractName,
    lastDropId: top,
    requests: reads.length + 2,
    wallClockMs: Math.round(wall),
    slowestMs: Math.round(Math.max(...reads.map((r) => r.ms))),
    medianMs: Math.round(reads.map((r) => r.ms).sort((a, b) => a - b)[Math.floor(reads.length / 2)]),
    cacheHits: hits,
    cacheHitRate: reads.length ? `${Math.round((hits / reads.length) * 100)}%` : 'n/a',
    dropsPresent: present,
    wastedReads: reads.length - present,
    hiroKeyPresent: last.keyPresent
  };
};

const results = [];
for (const entry of registry) results.push(await measureEntry(entry));

const total = {
  origin: ORIGIN,
  concurrency: CONCURRENCY,
  totalRequests: results.reduce((a, r) => a + r.requests, 0),
  totalWallClockMs: results.reduce((a, r) => a + r.wallClockMs, 0),
  totalDropsPresent: results.reduce((a, r) => a + r.dropsPresent, 0),
  totalWastedReads: results.reduce((a, r) => a + r.wastedReads, 0)
};

if (asJson) {
  console.log(JSON.stringify({ total, entries: results }, null, 2));
} else {
  console.log(`\ndrops read phase — ${ORIGIN} (concurrency ${CONCURRENCY})\n`);
  for (const r of results) {
    console.log(`  ${r.contract}`);
    console.log(`    requests      ${r.requests}   (${r.dropsPresent} present, ${r.wastedReads} returned nothing)`);
    console.log(`    wall clock    ${r.wallClockMs} ms   median ${r.medianMs} ms, slowest ${r.slowestMs} ms`);
    console.log(`    proxy cache   ${r.cacheHits}/${r.requests - 2} hits (${r.cacheHitRate})`);
    console.log(`    hiro key      ${r.hiroKeyPresent === '1' ? 'present' : 'ABSENT'}`);
  }
  console.log(`\n  TOTAL         ${total.totalRequests} requests, ${total.totalWallClockMs} ms, ` +
              `${total.totalWastedReads} wasted\n`);
}
