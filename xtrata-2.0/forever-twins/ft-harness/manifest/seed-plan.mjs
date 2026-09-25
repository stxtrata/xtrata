#!/usr/bin/env node
// Turn a manifest into a seeding plan for one deployed helper. PLAN ONLY:
// nothing is signed or broadcast; this script has no key and makes no network calls.
//
//   node manifest/seed-plan.mjs <manifest.json> --helper <SP...helper-name> [--out plan.json]
//
// Output (JSON):
//   steps[0..n-1]  seed-canonical, 100 entries each (ids, first/last, Clarity args hex,
//                  unsigned contract-call payload hex)
//   steps[n]       finalize-canonical(manifest-sha256, count)
// The manifest sha256 is recomputed from the file's bytes and must match the .sha256
// file next to it. Partial manifests are refused.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Cl, cvToHex } from '@stacks/transactions';
import * as tx from '@stacks/transactions';
import { seedEntries, batches, SEED_BATCH, MAX_BYTES, isAscii } from './lib.mjs';

export function entryCV(e) {
  return Cl.tuple({
    id: Cl.uint(e.id), 'content-hash': Cl.bufferFromHex(e.contentHash.replace(/^0x/, '')),
    mime: Cl.stringAscii(e.mime), 'total-size': Cl.uint(e.totalSize), 'token-uri': Cl.stringAscii(e.tokenUri),
  });
}

function unsignedPayloadHex(contractId, fn, args) {
  try {
    const [addr, name] = contractId.split('.');
    const p = tx.createContractCallPayload(addr, name, fn, args);
    const ser = tx.serializePayload ?? tx.serializePayloadBytes;
    const out = ser(p);
    return typeof out === 'string' ? out : Buffer.from(out).toString('hex');
  } catch (e) { return null; }
}

export function makePlan(text, helper, { sha256File } = {}) {
  const manifest = JSON.parse(text);
  const sha = createHash('sha256').update(text).digest('hex');
  if (sha256File && !sha256File.startsWith(sha)) throw new Error(`manifest sha256 ${sha} does not match its .sha256 file`);
  if (/subset|NOT for finalisation/.test(manifest.scope || '')) throw new Error(`refusing a partial manifest (scope: ${manifest.scope})`);
  const entries = seedEntries(manifest);
  const seen = new Set();
  for (const e of entries) {
    if (seen.has(e.id)) throw new Error(`duplicate id ${e.id}`);
    seen.add(e.id);
    if (!(e.totalSize > 0 && e.totalSize <= MAX_BYTES)) throw new Error(`id ${e.id}: size ${e.totalSize} outside 1..${MAX_BYTES}`);
    if (!isAscii(e.mime, 64) || !isAscii(e.tokenUri, 256)) throw new Error(`id ${e.id}: mime/token-uri not valid ascii`);
    if (!/^(0x)?[0-9a-f]{64}$/i.test(e.contentHash)) throw new Error(`id ${e.id}: bad content hash`);
  }
  if (manifest.count !== entries.length) throw new Error(`manifest count ${manifest.count} != ${entries.length} tokens`);
  const steps = batches(entries, SEED_BATCH).map((b, i) => {
    const args = [Cl.list(b.map(entryCV))];
    return {
      step: i + 1, function: 'seed-canonical', entries: b.length, firstId: b[0].id, lastId: b[b.length - 1].id,
      ids: b.map((e) => e.id), argsHex: args.map(cvToHex), unsignedPayloadHex: unsignedPayloadHex(helper, 'seed-canonical', args),
      expectResult: `(ok u${i * SEED_BATCH + b.length})  (running canonical-count, if ids are new)`,
    };
  });
  const fin = [Cl.bufferFromHex(sha), Cl.uint(entries.length)];
  steps.push({
    step: steps.length + 1, function: 'finalize-canonical', manifestSha256: sha, expectedCount: entries.length,
    argsHex: fin.map(cvToHex), unsignedPayloadHex: unsignedPayloadHex(helper, 'finalize-canonical', fin),
    warning: 'ONE-WAY. Run check-canonical.mjs against the seeded helper first; publish the manifest at the same bytes.',
  });
  return {
    kind: 'forever-twins-seed-plan', helper, collectionKey: manifest.collectionKey, source: manifest.source,
    manifestSha256: sha, count: entries.length, seedCalls: steps.length - 1,
    note: 'Unsigned plan. Sender must be the helper owner. Nothing here was signed or broadcast.',
    steps,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
  const path = argv.find((a) => a.endsWith('.json') && !a.startsWith('--'));
  const helper = opt('helper');
  if (!path || !helper) { console.error('usage: seed-plan.mjs <manifest.json> --helper <SP...name> [--out plan.json]'); process.exit(1); }
  const shaPath = path.replace(/\.json$/, '.sha256');
  const plan = makePlan(readFileSync(path, 'utf8'), helper, { sha256File: existsSync(shaPath) ? readFileSync(shaPath, 'utf8') : undefined });
  const out = opt('out', path.replace(/\.manifest\.json$/, '.seed-plan.json'));
  writeFileSync(out, JSON.stringify(plan, null, 2) + '\n');
  console.log(`${plan.count} entries -> ${plan.seedCalls} seed-canonical call(s) + finalize-canonical(0x${plan.manifestSha256}, u${plan.count})\nwrote ${out}`);
}
