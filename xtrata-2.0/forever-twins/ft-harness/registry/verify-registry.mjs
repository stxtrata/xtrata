#!/usr/bin/env node
// Read-only check of the registry against mainnet: one helper per collection,
// deployed code hash, and live state from each helper. No keys, nothing signed.
//   node registry/verify-registry.mjs [registry/registry.v1.json] [--api https://api.hiro.so] [--out results/registry-check.json]
import { readFileSync, writeFileSync } from 'node:fs';
import { makeReader, readHelper, registryProblems } from './clarity-lite.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const path = argv.find((a) => a.endsWith('.json') && !a.startsWith('--')) || new URL('./registry.v1.json', import.meta.url).pathname;
const reg = JSON.parse(readFileSync(path, 'utf8'));
const reader = makeReader(opt('api', 'https://api.hiro.so'), { delayMs: process.env.HIRO_API_KEY ? 150 : 1100, apiKey: process.env.HIRO_API_KEY });
const report = { checkedAt: new Date().toISOString(), registry: path, registryProblems: registryProblems(reg), helpers: [] };
for (const e of reg.helpers) {
  const r = await readHelper(reader, e);
  report.helpers.push(r);
  console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${e.key.padEnd(16)} ${e.helper}  ${JSON.stringify(r.state || {})} ${r.problems.join('; ')}`);
}
report.ok = report.registryProblems.length === 0 && report.helpers.every((h) => h.ok);
writeFileSync(opt('out', 'results/registry-check.json'), JSON.stringify(report, null, 2) + '\n');
process.exitCode = report.ok ? 0 : 1;
