#!/usr/bin/env node
// Compare a helper's on-chain canonical record with a manifest. READ-ONLY:
// uses only the node's /v2/contracts/call-read endpoint; no keys, nothing signed.
//
//   node manifest/check-canonical.mjs <manifest.json> --helper <SP...name>
//        [--api https://api.hiro.so] [--delay-ms 1100] [--out report.json]
//
// Checks get-twin-interface (collection key, source, asset, canonical-count,
// finalised flag, manifest-hash == sha256 of the manifest bytes) and every id's
// get-canonical (content-hash, mime, total-size, token-uri). Exit 0 only if all match.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Cl, cvToHex, hexToCV, cvToJSON } from '@stacks/transactions';
import { compareEntry } from './lib.mjs';

const val = (j) => (j && typeof j === 'object' && 'value' in j ? j.value : j);
function tupleOf(cv) {
  // cvToJSON: optional -> {type:'(optional ...)', value:{type:'(tuple..)', value:{k:{value}}}}
  let j = cvToJSON(cv);
  while (j && j.value && typeof j.value === 'object' && !('content-hash' in j.value) && !('collection-key' in j.value)) j = j.value;
  if (!j || j.value == null) return null;
  const o = {};
  for (const [k, v] of Object.entries(j.value)) o[k] = val(v);
  return o;
}

// readOnly(fn, cvArgs) -> ClarityValue
export async function checkHelper(text, readOnly, { onProgress } = {}) {
  const manifest = JSON.parse(text);
  const sha = createHash('sha256').update(text).digest('hex');
  const problems = [];
  const i = tupleOf(await readOnly('get-twin-interface', []));
  if (!i) return { ok: false, problems: ['get-twin-interface returned nothing'], manifestSha256: sha };
  const iface = {
    interfaceVersion: String(i['interface-version']), collectionKey: i['collection-key'], source: i.source,
    sourceAsset: i['source-asset'], group: i.group, finalized: i['canonical-finalized'] === true || i['canonical-finalized'] === 'true',
    canonicalCount: Number(i['canonical-count']), manifestHash: String(i['manifest-hash']).replace(/^0x/, ''),
    largeUnbound: i['large-unbound'] == null ? null : Number(i['large-unbound']),
  };
  if (iface.collectionKey !== manifest.collectionKey) problems.push(`collection-key ${iface.collectionKey} != ${manifest.collectionKey}`);
  if (iface.source !== manifest.source) problems.push(`source ${iface.source} != ${manifest.source}`);
  if (manifest.sourceAsset && iface.sourceAsset !== manifest.sourceAsset) problems.push(`source-asset ${iface.sourceAsset} != ${manifest.sourceAsset}`);
  if (iface.canonicalCount !== manifest.tokens.length) problems.push(`canonical-count ${iface.canonicalCount} != ${manifest.tokens.length} manifest tokens`);
  if (iface.finalized && iface.manifestHash !== sha) problems.push(`finalised manifest-hash ${iface.manifestHash} != sha256(manifest) ${sha}`);
  const mismatches = [];
  let n = 0;
  for (const t of manifest.tokens) {
    const c = tupleOf(await readOnly('get-canonical', [Cl.uint(t.id)]));
    const onchain = c && { contentHash: c['content-hash'], mime: c.mime, totalSize: c['total-size'], tokenUri: c['token-uri'] };
    const d = compareEntry(t, onchain);
    if (t.twin.route === 'preinscribed') {
      const b = tupleOf(await readOnly('get-binding', [Cl.uint(t.id)]));
      if (!b) d.push('pre-inscribed twin not bound yet');
      else if (String(b['content-hash']).toLowerCase() !== String(t.twin.contentHash).toLowerCase()) d.push(`bound twin hash ${b['content-hash']} != ${t.twin.contentHash}`);
    }
    if (d.length) mismatches.push({ id: t.id, differences: d });
    if (onProgress) onProgress(++n, manifest.tokens.length);
  }
  if (iface.largeUnbound) problems.push(`${iface.largeUnbound} large entr${iface.largeUnbound === 1 ? 'y' : 'ies'} not yet bound (finalise will refuse, u221)`);
  const ok = problems.length === 0 && mismatches.length === 0;
  return {
    ok, verdict: ok ? (iface.finalized ? 'finalised and matches manifest' : 'seeded record matches manifest; ready to finalise') : 'MISMATCH',
    manifestSha256: sha, interface: iface, checked: manifest.tokens.length, problems, mismatches,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
  const path = argv.find((a) => a.endsWith('.json') && !a.startsWith('--'));
  const helper = opt('helper');
  if (!path || !helper) { console.error('usage: check-canonical.mjs <manifest.json> --helper <SP...name> [--api url]'); process.exit(1); }
  const API = opt('api', process.env.FT_API || 'https://api.hiro.so').replace(/\/$/, '');
  const KEY = process.env.HIRO_API_KEY;
  const DELAY = Number(opt('delay-ms', KEY ? 150 : 1100));
  const [addr, name] = helper.split('.');
  const readOnly = async (fn, args) => {
    for (let attempt = 0; attempt < 6; attempt++) {
      await new Promise((r) => setTimeout(r, DELAY));
      const res = await fetch(`${API}/v2/contracts/call-read/${addr}/${name}/${fn}`, {
        method: 'POST', headers: { 'content-type': 'application/json', ...(KEY ? { 'x-api-key': KEY } : {}) },
        body: JSON.stringify({ sender: addr, arguments: args.map(cvToHex) }),
      });
      if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt)); continue; }
      const j = await res.json();
      if (!j.okay) throw new Error(`${fn}: ${j.cause}`);
      return hexToCV(j.result);
    }
    throw new Error(`${fn}: gave up after retries`);
  };
  const report = await checkHelper(readFileSync(path, 'utf8'), readOnly, {
    onProgress: (d, n) => { if (d % 50 === 0 || d === n) process.stderr.write(`  ${d}/${n}\n`); },
  });
  report.helper = helper; report.api = API; report.checkedAt = new Date().toISOString();
  const out = opt('out', path.replace(/\.manifest\.json$/, `.check.json`));
  writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
  console.log(`${report.verdict}: ${report.problems.length} interface problem(s), ${report.mismatches.length} token mismatch(es) of ${report.checked}\nwrote ${out}`);
  process.exitCode = report.ok ? 0 : 1;
}
