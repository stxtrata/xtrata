#!/usr/bin/env node
// Fully automated pre-deployment audit gate for a large-on-demand Forever Twins helper.
// Nothing here signs or broadcasts anything. The only network use is the stxer mainnet FORK simulation (stage 9).
//
//   node scripts/audit-lod.mjs --config scripts/configs/mainnet-bitcoin-monkeys.v3.json \
//        --manifest manifest/out/bitcoin-monkeys.manifest.json [--gateway http://127.0.0.1:8080] \
//        [--deployer SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X] [--skip-fork] [--fuzz-ops 400] [--fuzz-seeds 3]
//
//   Exit 0 and "CLEARED FOR DEPLOYMENT" only if EVERY stage passes (and the fork stage was not skipped).
//   The result, with the sha256 of the exact helper source that was audited, is written to results/audit-lod-<key>.json.
//
//   After deploying, smoke-test what actually landed (read-only):
//   node scripts/audit-lod.mjs --config ... --manifest ... --post-deploy SP...forever-twin-bitcoin-monkeys [--stage seeded|finalized]
//
// Stages
//  1  render the helper twice (deterministic), parameters match the agreed deal, source sha256 recorded
//  2  the manifest is internally sound and belongs to this config
//  3  shipped helpers are untouched: re-rendering Megapont and NYC reproduces the registry-pinned source sha256
//  4  code delta: the large-on-demand helper differs from the same helper with the flag off ONLY by inscribe-large
//     (no new state, no STX movement, no new external calls) and the removal of one finalise check
//  5  static lint of the whole source (no panics, no burns, external calls only to the core and the source)
//  6  the code that ran in simnet is the code that will run on mainnet (inscribe-large byte-identical)
//  7  every test suite: large-on-demand, families, prebind, manifest, registry, wizard engine
//  8  seeded random-call invariant fuzzer (several seeds)
//  9  mutation testing: break the helper in 10 targeted ways; every break must be caught by the tests
// 10  mainnet fork simulation on stxer, results read back and checked automatically
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { render } from './render-helper-v3.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const flag = (n) => argv.includes(`--${n}`);
const sha = (s) => createHash('sha256').update(s).digest('hex');
const rd = (p) => readFileSync(join(ROOT, p), 'utf8');

const JIM = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const RAPHA = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22';
const XTRATA = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CORE = `${XTRATA}.xtrata-v3-2-3`;
const LARGE = 524288;

const configPath = opt('config'), manifestPath = opt('manifest');
if (!configPath || !manifestPath) { console.error('need --config and --manifest'); process.exit(2); }
const cfg = JSON.parse(rd(configPath));
const manifestText = rd(manifestPath);
const manifest = JSON.parse(manifestText);
const key = cfg.collectionKey;
const deployer = opt('deployer', XTRATA);
const outFile = `results/audit-lod-${key}.json`;

// ------------------------------------------------------------------------------------------------ harness
const stages = [];
const t0 = Date.now();
const only = opt('only') ? new Set(String(opt('only')).split(',')) : null;     // developer aid: run some stages (1 and 2 always run)
async function stage(id, title, fn) {
  if (only && !only.has(String(id)) && ![1, 2].includes(id)) return { pass: true, skipped: true };
  const s = { id, title, pass: false, detail: [], ms: 0 };
  const start = Date.now();
  process.stdout.write(`\n[${id}] ${title}\n`);
  const log = (m) => { s.detail.push(m); console.log(`     ${m}`); };
  const ok = (cond, m) => { if (cond) log(`✓ ${m}`); else { log(`✗ ${m}`); s.failed = true; } return !!cond; };
  try { await fn({ log, ok, s }); s.pass = !s.failed; } catch (e) { s.pass = false; log(`✗ stage crashed: ${e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : e}`); }
  s.ms = Date.now() - start;
  console.log(`   => ${s.pass ? 'PASS' : 'FAIL'} (${(s.ms / 1000).toFixed(1)} s)`);
  stages.push(s); return s;
}
function run(cmd, args, { env = {}, timeout = 15 * 60_000 } = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout });
  return { code: r.status, out: `${r.stdout || ''}${r.stderr || ''}`, signal: r.signal };
}
const passLine = (out) => { const m = [...out.matchAll(/(\d+) (?:checks )?passed, (\d+) failed/g)].pop(); return m ? { pass: Number(m[1]), fail: Number(m[2]) } : null; };

// ------------------------------------------------------------------------------------------------ helpers over source text
const stripComments = (src) => src.split('\n').map((l) => l.replace(/;;.*$/, '')).join('\n');
const norm = (l) => l.trim().replace(/\s+/g, ' ');
function lineDiff(a, b) {               // multiset difference of normalised non-comment, non-empty lines
  const cnt = (src) => { const m = new Map(); for (const l of stripComments(src).split('\n').map(norm).filter(Boolean)) m.set(l, (m.get(l) || 0) + 1); return m; };
  const A = cnt(a), B = cnt(b), onlyA = [], onlyB = [];
  for (const [l, n] of A) { const d = n - (B.get(l) || 0); for (let i = 0; i < d; i++) onlyA.push(l); }
  for (const [l, n] of B) { const d = n - (A.get(l) || 0); for (let i = 0; i < d; i++) onlyB.push(l); }
  return { onlyA, onlyB };
}
function extractFn(src, name) {          // balanced-paren text of (define-public (name ...
  const mm = new RegExp(`\\(define-public \\(${name}[\\s)]`).exec(src); if (!mm) return null; const i = mm.index;
  let depth = 0;
  for (let j = i; j < src.length; j++) { const c = src[j]; if (c === '(') depth++; else if (c === ')') { depth--; if (depth === 0) return src.slice(i, j + 1); } }
  return null;
}
const count = (src, re) => (stripComments(src).match(re) || []).length;
const names = (src, kind) => [...stripComments(src).matchAll(new RegExp(`\\(define-${kind} \\(([a-z0-9-]+)`, 'g'))].map((m) => m[1]).sort();

let onSrc = null, offSrc = null, helperSha = null, mainnetFile = null;
const cfgOff = { ...cfg, largeOnDemand: false };

// ================================================================================================ POST-DEPLOY MODE
if (opt('post-deploy')) {
  const contract = opt('post-deploy'); const [addr, name] = contract.split('.');
  const stageName = opt('stage', 'deployed');                           // deployed | seeded | finalized
  const API = (opt('api', process.env.FT_API || 'https://api.hiro.so')).replace(/\/$/, '');
  const { Cl, cvToHex, hexToCV, cvToJSON } = await import('@stacks/transactions');
  const auditPath = join(ROOT, outFile);
  const audit = existsSync(auditPath) ? JSON.parse(readFileSync(auditPath, 'utf8')) : null;
  const hdr = { 'content-type': 'application/json', ...(process.env.HIRO_API_KEY ? { 'x-api-key': process.env.HIRO_API_KEY } : {}) };
  const readOnly = async (fn, args = []) => {
    const r = await fetch(`${API}/v2/contracts/call-read/${addr}/${name}/${fn}`, { method: 'POST', headers: hdr, body: JSON.stringify({ sender: addr, arguments: args.map(cvToHex) }) });
    if (!r.ok) throw new Error(`${fn}: HTTP ${r.status}`);
    const d = await r.json(); if (!d.okay) throw new Error(`${fn}: ${d.cause}`);
    return cvToJSON(hexToCV(d.result));
  };
  await stage('P1', `the deployed contract is exactly the audited source (${contract})`, async ({ ok, log }) => {
    ok(audit && audit.verdict === 'CLEARED', 'a CLEARED audit result exists for this config');
    const r = await fetch(`${API}/v2/contracts/source/${addr}/${name}?proof=0`, { headers: hdr });
    ok(r.ok, `source fetched (HTTP ${r.status})`);
    if (r.ok) { const d = await r.json(); const s = sha(d.source); log(`on-chain source sha256 ${s}`); ok(audit && s === audit.helperSha256, `equals the audited helper sha256 ${audit && audit.helperSha256}`); }
  });
  await stage('P2', `read-only state matches the deal (${stageName})`, async ({ ok, log }) => {
    const j = (await readOnly('get-twin-interface')).value;
    const v = (k) => j[k] && j[k].value;
    ok(v('collection-key') === key, `collection-key ${v('collection-key')}`);
    ok(v('master') === cfg.master, `master ${v('master')}`);
    ok(v('source') === cfg.source, `source ${v('source')}`);
    ok(v('group') === cfg.group, `group ${v('group')}`);
    ok(v('fee') === String(cfg.initialFeeUstx) && v('max-fee') === String(cfg.maxFeeUstx), `fee ${v('fee')} (max ${v('max-fee')})`);
    ok([v('payee-a'), v('payee-b')].sort().join() === [...cfg.payees].sort().join(), `payees ${v('payee-a')} / ${v('payee-b')}`);
    ok(v('rescue-enabled') === cfg.rescueEnabled && v('rescue-delay') === String(cfg.rescueDelayBurnBlocks), 'rescue settings');
    ok(v('owner') === deployer, `owner ${v('owner')} is the deployer`);
    const fin = v('canonical-finalized');
    if (stageName === 'deployed') ok(fin === false && v('canonical-count') === '0' && v('inscribed-count') === '0', 'fresh: not finalised, empty record, nothing inscribed');
    if (stageName === 'seeded') ok(fin === false && v('canonical-count') === String(manifest.count), `all ${manifest.count} records seeded, not finalised yet`);
    if (stageName === 'finalized') {
      const largeN = manifest.tokens.filter((t) => t.twin.totalSize > LARGE).length;
      ok(fin === true && v('canonical-count') === String(manifest.count), 'finalised with the full record');
      ok(Number(v('large-unbound')) <= largeN, `large-unbound ${v('large-unbound')} (${largeN} large records)`);
      ok(v('manifest-hash') === `0x${sha(manifestText)}`, 'manifest-hash on-chain equals the sha256 of the manifest file');
    }
    const fee = (await readOnly('fee-for', [Cl.principal(JIM)])).value;
    log(`fee-for(sample payer) = ${JSON.stringify(fee)}`);
  });
  if (stageName !== 'deployed') {
    await stage('P3', 'every record on-chain equals the manifest (read-only)', async ({ ok, log }) => {
      const r = run('node', ['manifest/check-canonical.mjs', manifestPath, '--helper', contract, '--api', API], { timeout: 60 * 60_000 });
      log(r.out.trim().split('\n').slice(-4).join(' | '));
      ok(r.code === 0, 'check-canonical exit 0');
    });
  }
  const bad = stages.filter((s) => !s.pass);
  console.log(`\nSMOKE TEST (${stageName}): ${bad.length ? 'FAIL' : 'PASS'}`);
  process.exit(bad.length ? 1 : 0);
}

// ================================================================================================ PRE-DEPLOY GATE
await stage(1, 'render deterministically; parameters match the agreed deal', async ({ ok, log }) => {
  onSrc = render(cfg); const again = render(cfg);
  helperSha = sha(onSrc);
  ok(onSrc === again && sha(again) === helperSha, `two renders are byte-identical, sha256 ${helperSha}`);
  ok(cfg.largeOnDemand === true, 'config has largeOnDemand: true');
  ok(cfg.master === CORE, 'master is the mainnet core xtrata-v3-2-3');
  ok(cfg.payees.length === 2 && cfg.payees.includes(JIM) && cfg.payees.includes(RAPHA), 'payees are exactly Jim and Rapha');
  ok(cfg.initialFeeUstx === 1_000_000, 'fee is 1 STX');
  ok(cfg.maxFeeUstx >= cfg.initialFeeUstx && cfg.maxFeeUstx <= 5_000_000, `fee cap ${cfg.maxFeeUstx} µSTX`);
  ok(cfg.rescueEnabled === true, 'rescue enabled (decision D2)');
  if (opt('expect-sha')) ok(helperSha === opt('expect-sha'), `matches --expect-sha`);
  mainnetFile = `contracts/rendered/forever-twin-${key}.v3.clar`;
  writeFileSync(join(ROOT, mainnetFile), onSrc);
  log(`wrote ${mainnetFile} (${onSrc.length} bytes)`);
  offSrc = render(cfgOff);
});

await stage(2, 'the manifest is sound and belongs to this config', async ({ ok, log }) => {
  ok(manifest.collectionKey === key && manifest.source === cfg.source && manifest.sourceAsset === cfg.sourceAsset, 'collection key, source and asset match the config');
  ok(manifest.count === manifest.tokens.length, `count ${manifest.count} equals the token list`);
  const ids = new Set(manifest.tokens.map((t) => t.id)); ok(ids.size === manifest.tokens.length, 'token ids are unique');
  const hex = /^0x[0-9a-f]{64}$/;
  const badTok = manifest.tokens.filter((t) => !hex.test(t.twin.contentHash) || !/^[\x20-\x7e]{1,256}$/.test(t.twin.tokenUri) || !t.twin.mime || !(t.twin.totalSize > 0 && t.twin.totalSize <= 33554432));
  ok(badTok.length === 0, `every record has a 32-byte hash, ASCII token-uri, a mime and a size up to 32 MiB (${badTok.length} bad)`);
  const side = manifestPath.replace(/\.json$/, '.sha256');
  if (existsSync(join(ROOT, side))) ok(rd(side).trim().split(/\s+/)[0] === sha(manifestText), 'matches the .sha256 file next to it');
  const large = manifest.tokens.filter((t) => t.twin.totalSize > LARGE);
  log(`${large.length} of ${manifest.count} records are over 512 KB; largest ${Math.max(...manifest.tokens.map((t) => t.twin.totalSize))} B; manifest sha256 ${sha(manifestText)}`);
  ok(large.length > 0, 'there are large records (otherwise this route is not needed)');
  const rep = join(ROOT, manifestPath.replace(/\.manifest\.json$/, '.report.json'));
  if (existsSync(rep)) { const r = JSON.parse(readFileSync(rep, 'utf8')); const f = r.failures ?? r.failed ?? []; ok((Array.isArray(f) ? f.length : Number(f)) === 0, 'the build report lists 0 failures'); }
});

await stage(3, 'shipped helpers are untouched by the template change', async ({ ok, log }) => {
  const reg = JSON.parse(rd('registry/registry.v1.json'));
  const pins = new Set((reg.helpers || []).map((h) => h.expectedSourceSha256).filter(Boolean));
  for (const f of ['mainnet-megapont-ape-club.v3.json', 'mainnet-nyc-degens.v3.json']) {
    const c = JSON.parse(rd(`scripts/configs/${f}`));
    ok(!c.largeOnDemand, `${f} does not enable large-on-demand`);
    const s = sha(render(c)); ok(pins.has(s), `${f} re-renders to a registry-pinned sha256 (${s.slice(0, 12)}…)`);
  }
  const pep = JSON.parse(rd('scripts/configs/mainnet-ordinal-pepe.v3.json')); ok(!pep.largeOnDemand, 'the Ordinal Pepe helper does not use the new code path');
});

await stage(4, 'code delta: only inscribe-large is added, nothing else changes', async ({ ok, log }) => {
  const { onlyA: removed, onlyB: added } = lineDiff(offSrc, onSrc);
  log(`${added.length} lines added, ${removed.length} lines removed versus the flag-off helper`);
  ok(removed.length === 1 && /\(asserts! \(is-eq \(var-get large-unbound\) u0\) ERR-PREBIND-PENDING\)/.test(removed[0]), 'the only removed line is the "all large tokens bound before finalising" check');
  const addedText = added.join('\n');
  ok(count(onSrc, /\(define-public \(inscribe-large /g) === 1 && count(offSrc, /\(define-public \(inscribe-large /g) === 0, 'exactly one new public function, inscribe-large');
  for (const k of ['public', 'private', 'read-only']) { const a = names(onSrc, k), b = names(offSrc, k); ok(JSON.stringify(a.filter((n) => !b.includes(n))) === JSON.stringify(k === 'public' ? ['inscribe-large'] : []) && b.every((n) => a.includes(n)), `define-${k}: ${k === 'public' ? 'inscribe-large added, none removed' : 'unchanged'}`); }
  for (const k of ['map', 'data-var', 'constant', 'non-fungible-token', 'fungible-token', 'trait']) ok(count(onSrc, new RegExp(`\\(define-${k} `, 'g')) === count(offSrc, new RegExp(`\\(define-${k} `, 'g')), `no new define-${k}`);
  for (const bad of ['as-contract', 'stx-transfer?', 'stx-burn?', 'unwrap-panic', 'unwrap-err-panic', 'map-delete', 'ft-transfer?', 'nft-transfer?', 'nft-burn?', 'set-contract-owner', 'var-set contract-owner', 'var-set inscribe-fee', 'map-set Canonical', 'map-insert Canonical']) ok(!addedText.includes(bad), `the new code never uses ${bad}`);
  const calls = [...addedText.matchAll(/\(contract-call\? ([A-Z]+) ([a-z0-9-]+)/g)].map((m) => `${m[1]}.${m[2]}`);
  ok(calls.every((c) => ['MASTER.get-inscription-meta', 'MASTER.get-token-uri-raw', 'MASTER.transfer'].includes(c)) && calls.length === 3, `external calls are only the core's get-inscription-meta, get-token-uri-raw, transfer (${[...new Set(calls)].join(', ')})`);
  const fn = extractFn(onSrc, 'inscribe-large') || '';
  ok(!/assert-owner/.test(fn), 'inscribe-large is permissionless on purpose (no owner gate)');
  for (const must of ['(var-get canonical-finalized)', 'is-large (get total-size c)', 'map-get? Bindings token-id', '(get sealed m)', '(get final-hash m) (get content-hash c)', '(get total-size m) (get total-size c)', '(get mime-type m) (get mime c)', 'uri (get token-uri c)', '(twin-owner xtrata-id) (some tx-sender)', 'map-insert TwinToOriginal', 'charge-fee tx-sender', 'MASTER transfer xtrata-id tx-sender current-contract', 'twin-owner xtrata-id) (some current-contract)'])
    ok(norm(fn).includes(norm(must)), `inscribe-large contains: ${must}`);
  // the order that matters: every check before the fee, the fee before the transfer, so a refusal costs nothing
  const idx = (s) => norm(fn).indexOf(norm(s));
  ok(idx('(var-get canonical-finalized)') < idx('charge-fee') && idx('map-insert TwinToOriginal') < idx('charge-fee') && idx('charge-fee') < idx('MASTER transfer xtrata-id'), 'checks, then fee, then custody transfer');
});

await stage(5, 'static lint of the whole helper source', async ({ ok, log }) => {
  const offCalls = (src) => [...new Set([...stripComments(src).matchAll(/\(contract-call\? ([A-Z]+) /g)].map((m) => m[1]))].sort();
  ok(JSON.stringify(offCalls(onSrc)) === JSON.stringify(offCalls(offSrc)) && offCalls(onSrc).every((c) => ['MASTER', 'SOURCE'].includes(c)), `external calls only to the core and the source (${offCalls(onSrc).join(', ')})`);
  for (const bad of ['unwrap-panic', 'unwrap-err-panic', 'stx-burn?', 'ft-burn?', 'nft-burn?', 'at-block', 'use-trait', 'impl-trait']) ok(count(onSrc, new RegExp(`\\(${bad.replace('?', '\\?')}`, 'g')) === count(offSrc, new RegExp(`\\(${bad.replace('?', '\\?')}`, 'g')), `${bad}: no more uses than the shipped helper (${count(onSrc, new RegExp(`\\(${bad.replace('?', '\\?')}`, 'g'))})`);
  ok(count(onSrc, /\(as-contract /g) === count(offSrc, /\(as-contract /g), `as-contract uses unchanged (${count(onSrc, /\(as-contract /g)})`);
  const owner = names(onSrc, 'public').filter((n) => /assert-owner/.test(extractFn(onSrc, n) || ''));
  log(`owner-gated public functions: ${owner.join(', ') || '(none found)'}`);
  ok(['seed-canonical', 'finalize-canonical', 'set-fee', 'propose-ownership'].every((n) => owner.includes(n)), 'seeding, finalising, set-fee and ownership transfer are owner-only');
  ok(!owner.includes('swap-original-for-twin') && !owner.includes('swap-twin-for-original'), 'swaps are never owner-gated or pausable');
  ok(/MAX-FEE/.test(extractFn(onSrc, 'set-fee') || ''), 'set-fee is capped by the deploy-time maximum');
});

await stage(6, 'the code tested in simnet is the code that goes to mainnet', async ({ ok, log }) => {
  run('node', ['scripts/render-all-v3.mjs']);
  const simFile = 'contracts/rendered/ft3lod-bitcoin-monkeys.clar';
  ok(existsSync(join(ROOT, simFile)), 'simnet helper rendered');
  const simSrc = rd(simFile);
  const a = norm(extractFn(simSrc, 'inscribe-large') || 'x'), b = norm(extractFn(onSrc, 'inscribe-large') || 'y');
  ok(a === b, `inscribe-large is character-identical in the simnet and mainnet renders (${b.length} chars)`);
  // the two renders name the source and the core differently (simnet: .bitcoin-monkeys; mainnet: 'SP….bitcoin-monkeys): compare with those names masked
  const mask = (src) => src.replace(new RegExp(`'?(?:S[PT][0-9A-Z]{28,41})?\\.${key}(?![a-z0-9-])`, 'g'), 'SRC').replace(/'?(?:S[PT][0-9A-Z]{28,41})?\.xtrata-v3-2-3(?![a-z0-9-])/g, 'MST');
  const { onlyA, onlyB } = lineDiff(mask(simSrc), mask(onSrc));
  const other = [...onlyA, ...onlyB].filter((l) => !/define-constant|source-asset|SOURCE|MASTER|PAYEE|COLLECTION|^\(define-data-var inscribe-fee/.test(l));
  log(`${onlyA.length + onlyB.length} differing lines, all configuration constants: ${other.length === 0}`);
  ok(other.length === 0, 'the simnet and mainnet helpers differ only in configuration constants' + (other.length ? ` (unexpected: ${other.slice(0, 3).join(' | ')})` : ''));
});

const suiteTotals = [];
await stage(7, 'every test suite passes', async ({ ok, log }) => {
  const suites = [
    ['large-on-demand (real core, G1 + G2)', 'sim/large-on-demand-v3.mjs'],
    ['family suite v3', 'sim/family-suite-v3.mjs'],
    ['prebind v3', 'sim/prebind-v3.mjs'],
    ['manifest pipeline', 'sim/manifest-pipeline.mjs'],
    ['registry v2', 'sim/registry-v2.mjs'],
    ['large-file wizard engine (simulated chain)', 'sim/large-wizard-engine.mjs'],
  ];
  for (const [label, file] of suites) {
    const r = run('node', [file]); const p = passLine(r.out);
    suiteTotals.push({ label, ...p, exit: r.code });
    ok(r.code === 0 && p && p.fail === 0 && p.pass > 0, `${label}: ${p ? `${p.pass} checks passed, ${p.fail} failed` : 'no result line'} (exit ${r.code})`);
  }
});

await stage(8, 'randomised invariant fuzzing (seeded, reproducible)', async ({ ok, log }) => {
  const seeds = Number(opt('fuzz-seeds', 3)), ops = Number(opt('fuzz-ops', 400));
  for (let i = 0; i < seeds; i++) {
    const seed = 20261006 + i * 7919;
    const r = run('node', ['sim/lod-fuzz-v3.mjs'], { env: { FUZZ_SEED: String(seed), FUZZ_OPS: String(ops) } });
    const p = passLine(r.out); const cov = (r.out.match(/coverage: (\{.*\})/) || [])[1];
    ok(r.code === 0 && p && p.fail === 0, `seed ${seed}, ${ops} random calls: ${p ? `${p.pass} checks passed, ${p.fail} failed` : 'no result'}${cov ? ` · ${cov}` : ''}`);
  }
});

await stage(9, 'mutation testing: every deliberate bug must be caught', async ({ ok, log }) => {
  const simFile = join(ROOT, 'contracts/rendered/ft3lod-bitcoin-monkeys.clar');
  const original = readFileSync(simFile, 'utf8');
  const fn0 = extractFn(original, 'inscribe-large'); if (!fn0) throw new Error('inscribe-large not found in the simnet render');
  const inFn = (a, b) => ({ find: a, repl: b, scope: 'fn' });
  const mutants = [
    ['no fee charged', inFn('(try! (charge-fee tx-sender))', 'true')],
    ['caller need not hold the inscription', inFn('(asserts! (is-eq (twin-owner xtrata-id) (some tx-sender)) ERR-CUSTODY)', 'true')],
    ['token can be bound twice', inFn('(asserts! (is-none (map-get? Bindings token-id)) ERR-ALREADY-INSCRIBED)', 'true')],
    ['works before finalisation', inFn('(asserts! (var-get canonical-finalized) ERR-NOT-FINALIZED)', 'true')],
    ['token-uri not checked', inFn('(is-eq uri (get token-uri c))', 'true')],
    ['content hash not checked', inFn('(is-eq (get final-hash m) (get content-hash c))', 'true')],
    ['small tokens accepted', inFn('(asserts! (is-large (get total-size c)) ERR-PREBIND-MISMATCH)', 'true')],
    ['large-unbound counter not decremented', inFn('(var-set large-unbound (- (var-get large-unbound) u1))', 'true')],
    ['twin can be reused for another token', inFn('(asserts! (map-insert TwinToOriginal xtrata-id token-id) ERR-ALREADY-INSCRIBED)', 'true')],
    ['set-fee open to everyone', { find: '(define-public (set-fee (new-fee uint))\n  (begin\n    (try! (assert-owner))', repl: '(define-public (set-fee (new-fee uint))\n  (begin\n    (try! (if true (ok true) (err u204)))', scope: 'file' }],
  ];
  let restored = false;
  try {
    for (const [label, m] of mutants) {
      let mutated;
      if (m.scope === 'fn') { const idx = original.indexOf(fn0); const fnNew = fn0.split(m.find).join(m.repl); if (fnNew === fn0) { ok(false, `mutant "${label}": the text to mutate was not found (the contract changed; update the audit)`); continue; } mutated = original.slice(0, idx) + fnNew + original.slice(idx + fn0.length); }
      else { if (!original.includes(m.find)) { ok(false, `mutant "${label}": the text to mutate was not found (the contract changed; update the audit)`); continue; } mutated = original.replace(m.find, m.repl); }
      writeFileSync(simFile, mutated);
      let caught = false, how = '';
      const r1 = run('node', ['sim/large-on-demand-v3.mjs']); const p1 = passLine(r1.out);
      if (!p1) { ok(false, `mutant "${label}": does not compile or the suite crashed (invalid mutant)`); continue; }
      if (r1.code !== 0 || p1.fail > 0) { caught = true; how = `large-on-demand suite (${p1.fail} checks failed)`; }
      else { const r2 = run('node', ['sim/lod-fuzz-v3.mjs'], { env: { FUZZ_SEED: '20261006', FUZZ_OPS: '300' } }); const p2 = passLine(r2.out); if (p2 && (r2.code !== 0 || p2.fail > 0)) { caught = true; how = `fuzzer (${p2.fail} invariants failed)`; } }
      ok(caught, `mutant "${label}": ${caught ? `caught by the ${how}` : 'SURVIVED: the tests would not notice this bug'}`);
    }
  } finally {
    writeFileSync(simFile, original); restored = true;
    run('node', ['scripts/render-all-v3.mjs']);
    ok(rd('contracts/rendered/ft3lod-bitcoin-monkeys.clar') === original, 'the simnet helper was restored exactly after mutation testing');
  }
});

if (only && !only.has('10')) { /* partial run */ } else if (flag('skip-fork')) {
  stages.push({ id: 10, title: 'mainnet fork simulation', pass: false, skipped: true, detail: ['skipped by --skip-fork: the helper cannot be cleared without it'], ms: 0 });
  console.log('\n[10] mainnet fork simulation\n   => SKIPPED (--skip-fork). The helper is NOT cleared until this stage passes.');
} else {
  await stage(10, 'mainnet fork simulation (stxer), results read back and checked', async ({ ok, log }) => {
    const gateway = opt('gateway', 'http://127.0.0.1:8080');
    // --fork-sim <id> re-reads an existing simulation instead of running a new one (for re-checking after the first run)
    const reuse = opt('fork-sim');
    const r = reuse ? { code: 0, out: `stxer.xyz/simulations/mainnet/${reuse}` } : run('node', ['manifest/stxer-fork-test-large.mjs', '--manifest', manifestPath, '--helper-file', mainnetFile, '--deployer', deployer, '--gateway', gateway], { timeout: 40 * 60_000 });
    const m = r.out.match(/stxer\.xyz\/simulations\/mainnet\/([0-9a-f]+)/);
    log((r.out.match(/predicted[^\n]*/i) || [''])[0]);
    ok(r.code === 0 && !!m, `fork script ran and produced a simulation${m ? ` https://stxer.xyz/simulations/mainnet/${m[1]}` : ` (exit ${r.code}: ${r.out.trim().split('\n').slice(-3).join(' | ')})`}`);
    if (!m) return;
    const { getSimulationResult } = await import('stxer');
    const { hexToCV, cvToJSON } = await import('@stacks/transactions');
    let res = null; for (let i = 0; i < 6 && !res; i++) { try { res = await getSimulationResult(m[1]); } catch (e) { await new Promise((z) => setTimeout(z, 5000)); } }
    ok(!!res, 'simulation results fetched back from stxer'); if (!res) return;
    // stxer returns Clarity values SIP-005 hex-serialised, with or without a 0x prefix
    const repr = (x) => { const t = String(x); if (!/^(0x)?[0-9a-fA-F]{2,}$/.test(t)) return t; try { const j = cvToJSON(hexToCV(t.replace(/^0x/, ''))); return `(${j.success === false ? 'err' : 'ok'} ${JSON.stringify(j.value && j.value.value !== undefined ? j.value.value : j.value)})`; } catch { return t; } };
    try { writeFileSync(join(ROOT, `results/fork-${m[1]}.json`), JSON.stringify(res, (k, v) => (k === 'events' ? undefined : v), 1)); } catch { /* the dump is a convenience */ }
    const txs = [];
    for (const s of res.steps) { const t = s.Result && s.Result.Transaction; if (t) txs.push(t); }
    if (!txs.length) log(`could not find transaction results; step shape: ${JSON.stringify(res.steps.slice(0, 2)).slice(0, 1200)}`);
    ok(txs.length >= 40, `${txs.length} transactions simulated`);
    const engineErr = txs.filter((t) => t.Err); ok(engineErr.length === 0, `no transaction failed at engine level${engineErr[0] ? `: ${engineErr[0].Err}` : ''}`);
    const rec = txs.filter((t) => t.Ok).map((t) => t.Ok);
    ok(rec.every((x) => !x.vm_error && !x.post_condition_aborted), 'no VM error and no post-condition abort anywhere');
    const results = rec.map((x) => repr(x.result));
    if (!rec.length || !results.some((x) => /^\(ok/.test(x))) log(`unexpected result format, first receipts: ${JSON.stringify(rec.slice(0, 2).map((x) => x.result)).slice(0, 600)}`);
    const errs = results.filter((x) => /^\(err/.test(x)).map((x) => (x.match(/u?(\d{3})/) || [])[1]);
    log(`refused calls (expected by design): ${errs.join(', ')}`);
    ok(errs.length === 5 || errs.length === 4, `exactly the designed refusals happened (${errs.length})`);
    ok(errs.every((c) => ['201', '220', '207', '204'].includes(c)) && errs.filter((c) => c === '207').length === 1 && errs.filter((c) => c === '204').length === 1 && errs.includes('201') && errs.includes('220'), `refusal codes are 201 (already bound), 220 (route/mismatch), 207 (prebind after finalise), 204 (not owner): ${errs.join(', ')}`);
    ok(results.filter((x) => !/^\(err/.test(x)).every((x) => !/err|abort/i.test(x)), 'every other transaction succeeded');
    const reads = [...res.steps.map((s) => s.Result && s.Result.Reads).filter(Boolean).flat(), ...res.steps.map((s) => s.Result && s.Result.Eval).filter(Boolean)];   // the final (var-get large-unbound) is an Eval step
    const lu = reads.map((x) => (x.Ok ? repr(x.Ok) : '')).filter(Boolean);
    const largeN = manifest.tokens.filter((t) => t.twin.totalSize > LARGE).length;
    ok(lu.some((x) => x.includes(String(largeN - 2))), `final large-unbound read is ${largeN - 2} (${largeN} large records, 2 bound in the simulation): ${lu.join(' ')}`);
    log(`full simulation: https://stxer.xyz/simulations/mainnet/${m[1]}`);
    stages[stages.length - 1].simulation = `https://stxer.xyz/simulations/mainnet/${m[1]}`;
  });
}

// ------------------------------------------------------------------------------------------------ verdict
const allPass = !only && stages.length === 10 && stages.every((s) => s.pass);
const result = {
  verdict: allPass ? 'CLEARED' : 'NOT CLEARED',
  helperSha256: helperSha, helperFile: mainnetFile, helperBytes: onSrc ? onSrc.length : null,
  configFile: configPath, configSha256: sha(JSON.stringify(cfg)), manifestFile: manifestPath, manifestSha256: sha(manifestText),
  ranAt: new Date().toISOString(), node: process.version, seconds: Math.round((Date.now() - t0) / 1000),
  suites: suiteTotals, stages: stages.map((s) => ({ id: s.id, title: s.title, pass: s.pass, skipped: !!s.skipped, simulation: s.simulation, detail: s.detail })),
};
mkdirSync(join(ROOT, 'results'), { recursive: true });
writeFileSync(join(ROOT, outFile), JSON.stringify(result, null, 2));
console.log(`\n${'='.repeat(78)}`);
for (const s of stages) console.log(`  ${s.pass ? 'PASS' : s.skipped ? 'SKIP' : 'FAIL'}  [${String(s.id).padEnd(2)}] ${s.title}`);
console.log('='.repeat(78));
if (allPass) console.log(`CLEARED FOR DEPLOYMENT\n  ${mainnetFile}\n  sha256 ${helperSha}\n  record: ${outFile}\n  After deploying, run this script with --post-deploy <contract-id> to smoke-test what landed.`);
else console.log(`NOT CLEARED. Do not deploy. Failing: ${stages.filter((s) => !s.pass).map((s) => s.id).join(', ')}`);
process.exit(allPass ? 0 : 1);
