#!/usr/bin/env node
/**
 * Collection file-expiry repair (2026-09-26).
 *
 * Bug: the /collections/:id/assets sweep marked `draft` files past `expires_at`
 * as `expired` for every collection except published collections that were
 * also listed on the public page. Hidden or deployed-but-unpublished live
 * collections (Numbers 1–10 among them) lost their mintable inventory three
 * days after upload. The code fix lives in functions/lib/asset-retention.ts.
 *
 * This script repairs production data in two guarded steps, for committed
 * collections only (published, or with a deployed contract):
 *
 *   1. Retain: `draft` files that still have an expiry get expires_at = NULL,
 *      so neither the old nor the new sweep can ever expire them.
 *   2. Restore: `expired` files go back to `draft` (expires_at = NULL) ONLY if
 *        - the stored bytes are still in storage, the right size, and hash to
 *          the file's recorded Xtrata hash, and
 *        - the core contract has no inscription with that hash (so it was
 *          never minted and is still mintable), and
 *        - no reservation for it is marked confirmed.
 *      Anything that fails a check is reported and left untouched.
 *
 * Default is a read-only DRY RUN against the public API. It writes a report,
 * the exact SQL, and nothing else.
 *
 *   node scripts/collection-expiry-restore.mjs              # dry run
 *   node scripts/collection-expiry-restore.mjs --apply      # back up, apply, verify
 *
 * --apply needs a logged-in wrangler (`npx wrangler login`) with access to the
 * xtrata-manage D1 database. Before writing it saves the affected rows and a
 * rollback SQL file. D1 Time Travel can also restore the database to any point
 * in the last 30 days.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { bufferCV, cvToJSON, hexToCV, serializeCV } from '@stacks/transactions';

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const BASE = (process.argv.find(a => a.startsWith('--base='))?.slice(7) ?? 'https://xtrata.xyz').replace(/\/$/, '');
const DATABASE = 'xtrata-manage';
const CHUNK = 16384;
const HEADERS = { 'User-Agent': 'xtrata-expiry-repair/1', Accept: 'application/json' };
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const OUT = join('_claude_scratch', 'expiry-restore', stamp);

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function fetchRetry(url, init = {}, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...init, headers: { ...HEADERS, ...(init.headers ?? {}) } });
      if (res.status === 429 || res.status >= 500) { last = new Error(`HTTP ${res.status} ${url}`); await sleep(800 * (i + 1)); continue; }
      return res;
    } catch (error) { last = error; await sleep(800 * (i + 1)); }
  }
  throw last;
}
async function json(url) {
  const res = await fetchRetry(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

/** Xtrata content hash: sha256 chained over 16 KiB chunks, seeded with 32 zero bytes. */
export function xtrataHash(bytes) {
  let hash = Buffer.alloc(32);
  for (let i = 0; i < bytes.length; i += CHUNK)
    hash = createHash('sha256').update(Buffer.concat([hash, bytes.subarray(i, i + CHUNK)])).digest();
  return hash.toString('hex');
}

async function readOnly(contractId, fn, argsHex) {
  const [address, name] = contractId.split('.');
  const res = await fetchRetry(`${BASE}/hiro/mainnet/v2/contracts/call-read/${address}/${name}/${fn}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: address, arguments: argsHex })
  });
  if (!res.ok) throw new Error(`read ${fn} HTTP ${res.status}`);
  const body = await res.json();
  if (!body.okay || !body.result) throw new Error(`read ${fn} failed: ${body.cause ?? 'no result'}`);
  return cvToJSON(hexToCV(body.result));
}
const unwrap = v => (v && (v.type?.startsWith('(response') || v.type?.startsWith('(optional')) && 'value' in v ? v.value : v);

const coreCache = new Map();
async function coreFor(collection) {
  const metadata = typeof collection.metadata === 'string' ? JSON.parse(collection.metadata || '{}') : (collection.metadata ?? {});
  if (typeof metadata.coreContractId === 'string' && metadata.coreContractId.includes('.')) return metadata.coreContractId;
  const helper = String(collection.contract_address ?? '');
  if (!helper.includes('.')) return null;
  if (coreCache.has(helper)) return coreCache.get(helper);
  try {
    const value = unwrap(await readOnly(helper, 'get-locked-core-contract', []));
    const core = typeof value?.value === 'string' ? value.value : null;
    coreCache.set(helper, core);
    return core;
  } catch { coreCache.set(helper, null); return null; }
}

/** { inscribed: boolean } or throws — a failed read is never "not inscribed". */
async function inscribedOnCore(core, hash) {
  const arg = `0x${Buffer.from(serializeCV(bufferCV(Buffer.from(hash, 'hex')))).toString('hex')}`;
  const value = await readOnly(core, 'get-id-by-hash', [arg]);
  const inner = value.type?.startsWith('(response') ? value.value : value;
  if (!inner || !inner.type?.startsWith('(optional')) throw new Error('unexpected get-id-by-hash shape');
  return { inscribed: inner.value !== null };
}

// ------------------------------------------------------------- wrangler
// The login can see more than one Cloudflare account; wrangler then refuses to
// run non-interactively. Pick the account that actually owns xtrata-manage.
const D1_ID = '7d7cf4b8-bc72-41b2-9eea-cc4af9aea54b';
function runWrangler(argv, account) {
  try {
    return execFileSync('npx', ['wrangler', ...argv], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, ...(account ? { CLOUDFLARE_ACCOUNT_ID: account } : {}) }
    });
  } catch (error) {
    const detail = [error.stderr, error.stdout].filter(Boolean).join('\n').trim();
    throw new Error(`wrangler ${argv.slice(0, 3).join(' ')} failed:\n${detail || error.message}`);
  }
}
function resolveAccount() {
  const flag = process.argv.find(a => a.startsWith('--account='))?.slice(10);
  if (flag) return flag;
  if (process.env.CLOUDFLARE_ACCOUNT_ID) return process.env.CLOUDFLARE_ACCOUNT_ID;
  const ids = [...new Set((runWrangler(['whoami']).match(/\b[0-9a-f]{32}\b/g) ?? []))];
  for (const id of ids) {
    try {
      const listed = runWrangler(['d1', 'list', '--json'], id);
      if (listed.includes(D1_ID)) return id;
    } catch { /* not this account */ }
  }
  throw new Error(`Could not find which Cloudflare account owns D1 ${D1_ID}. Re-run with --account=<account id>.`);
}

const sqlString = v => `'${String(v).replace(/'/g, "''")}'`;

async function main() {
  mkdirSync(OUT, { recursive: true });
  const all = await json(`${BASE}/collections?includeArchived=1`);
  const collections = (Array.isArray(all) ? all : all.collections ?? []).filter(c => {
    const state = String(c.state ?? '').toLowerCase();
    return state === 'published' || String(c.contract_address ?? '').trim().length > 0;
  });
  const report = { base: BASE, generatedAt: new Date().toISOString(), collections: [] };
  const retainByCollection = [];
  const restoreIds = [];

  for (const c of collections) {
    const assets = await json(`${BASE}/collections/${encodeURIComponent(c.id)}/assets`);
    let reservations = [];
    try { reservations = await json(`${BASE}/collections/${encodeURIComponent(c.id)}/reserve`); } catch { reservations = null; }
    const entry = { id: c.id, name: c.display_name, state: c.state, contract: c.contract_address,
      retain: 0, restore: [], skipped: [] };
    entry.retain = assets.filter(a => a.state === 'draft' && a.expires_at != null).length;
    if (entry.retain) retainByCollection.push(c.id);
    const expired = assets.filter(a => a.state === 'expired');
    const core = expired.length ? await coreFor(c) : null;
    for (const asset of expired) {
      const label = asset.filename ?? asset.asset_id;
      const skip = reason => entry.skipped.push({ assetId: asset.asset_id, file: label, reason });
      if (reservations === null) { skip('could not read reservations'); continue; }
      if (reservations.some(r => r.asset_id === asset.asset_id && r.status === 'confirmed')) { skip('has a confirmed reservation'); continue; }
      const expected = String(asset.expected_hash ?? '').replace(/^0x/, '').toLowerCase();
      if (!/^[0-9a-f]{64}$/.test(expected)) { skip('no recorded hash'); continue; }
      let bytes;
      try {
        const res = await fetchRetry(`${BASE}/collections/${encodeURIComponent(c.id)}/asset-preview?assetId=${encodeURIComponent(asset.asset_id)}`, { headers: { Accept: '*/*' } });
        if (!res.ok) { skip(`stored bytes unavailable (HTTP ${res.status})`); continue; }
        bytes = Buffer.from(await res.arrayBuffer());
      } catch (error) { skip(`could not read stored bytes: ${error.message}`); continue; }
      if (Number(asset.total_bytes) !== bytes.length) { skip(`size mismatch (${bytes.length} vs ${asset.total_bytes})`); continue; }
      if (xtrataHash(bytes) !== expected) { skip('stored bytes do not match the recorded hash'); continue; }
      if (!core) { skip('core contract unknown — cannot confirm it was never minted'); continue; }
      try {
        const { inscribed } = await inscribedOnCore(core, expected);
        if (inscribed) { skip('already inscribed on the core (minted or inscribed elsewhere)'); continue; }
      } catch (error) { skip(`could not check the core: ${error.message}`); continue; }
      entry.restore.push({ assetId: asset.asset_id, file: label, bytes: bytes.length });
      restoreIds.push(asset.asset_id);
    }
    report.collections.push(entry);
    console.log(`${c.display_name} [${c.state}] retain ${entry.retain} · restore ${entry.restore.length} · skipped ${entry.skipped.length}`);
    for (const s of entry.skipped) console.log(`    skip ${s.file}: ${s.reason}`);
  }

  const now = Date.now();
  const statements = [];
  if (retainByCollection.length)
    statements.push(`UPDATE assets SET expires_at = NULL, updated_at = ${now} WHERE state = 'draft' AND expires_at IS NOT NULL AND collection_id IN (${retainByCollection.map(sqlString).join(', ')});`);
  if (restoreIds.length)
    statements.push(`UPDATE assets SET state = 'draft', expires_at = NULL, updated_at = ${now} WHERE state = 'expired' AND asset_id IN (${restoreIds.map(sqlString).join(', ')});`);
  const sql = statements.join('\n') + '\n';
  writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  writeFileSync(join(OUT, 'apply.sql'), sql);
  console.log(`\nRetain in ${retainByCollection.length} collections; restore ${restoreIds.length} files.`);
  console.log(`Report and SQL: ${OUT}`);
  if (!statements.length) { console.log('Nothing to change.'); return; }
  if (!APPLY) { console.log('Dry run only. Re-run with --apply to back up and apply.'); return; }

  const touched = [...new Set([...retainByCollection])];
  const backupQuery = `SELECT asset_id, collection_id, state, expires_at, updated_at FROM assets WHERE (collection_id IN (${touched.map(sqlString).join(', ') || "''"}) AND state = 'draft' AND expires_at IS NOT NULL) OR asset_id IN (${restoreIds.map(sqlString).join(', ') || "''"});`;
  const account = resolveAccount();
  console.log(`Using Cloudflare account ${account}.`);
  const wrangler = (...rest) => runWrangler(['d1', 'execute', DATABASE, '--remote', '--yes', ...rest], account);
  const backup = wrangler('--json', '--command', backupQuery);
  writeFileSync(join(OUT, 'backup.json'), backup);
  const rows = JSON.parse(backup)[0]?.results ?? [];
  if (!rows.length) throw new Error('Backup returned no rows; refusing to apply.');
  const rollback = rows.map(r => `UPDATE assets SET state = ${sqlString(r.state)}, expires_at = ${r.expires_at == null ? 'NULL' : Number(r.expires_at)}, updated_at = ${Number(r.updated_at ?? now)} WHERE asset_id = ${sqlString(r.asset_id)};`).join('\n') + '\n';
  writeFileSync(join(OUT, 'rollback.sql'), rollback);
  console.log(`Backed up ${rows.length} rows. Rollback SQL: ${join(OUT, 'rollback.sql')}`);
  wrangler('--file', join(OUT, 'apply.sql'));
  console.log('Applied. Verifying through the public API…');
  let problems = 0;
  for (const entry of report.collections) {
    const assets = await json(`${BASE}/collections/${encodeURIComponent(entry.id)}/assets?fresh=${now}`);
    const byId = new Map(assets.map(a => [a.asset_id, a]));
    for (const r of entry.restore) if (byId.get(r.assetId)?.state !== 'draft') { problems++; console.log(`  NOT restored: ${entry.name} ${r.file}`); }
    const stillExpiring = assets.filter(a => a.state === 'draft' && a.expires_at != null).length;
    if (stillExpiring) { problems++; console.log(`  ${entry.name}: ${stillExpiring} files still have an expiry`); }
  }
  console.log(problems ? `Finished with ${problems} problem(s) — see above.` : 'Verified: all changes visible through the API.');
}

main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
