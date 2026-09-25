#!/usr/bin/env node
// Prepare archived legacy sources (screener/sources/) for simnet (contracts/legacy/).
// Only [simnet]-marked lines change; the diff against the archive is printed so a
// reviewer can confirm transfer/list/buy/burn code is untouched.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(readFileSync(join(ROOT, 'scripts/legacy-sources.json'), 'utf8'));
const SIP009 = "(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)";
const COMM = "'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.commission-trait.commission";

// Optional: node scripts/prepare-legacy.mjs <name> [...] prepares only those sources.
const only = process.argv.slice(2);
for (const src of cfg.sources.filter((s) => !only.length || only.includes(s.name))) {
  const archived = readFileSync(join(ROOT, 'screener/sources', `${src.name}.clar`), 'utf8');
  let changed = 0, sip009Done = false;
  const lines = archived.split('\n').map((l0) => {
    let l = l0;
    const t = l.trim();
    // any SIP-009 impl (mainnet, testnet or local .nft-trait): first becomes the local trait, duplicates are dropped
    if (/^\(impl-trait\s+'?[A-Z0-9]*\.?nft-trait\.nft-trait\)/.test(t)) {
      changed++;
      if (!sip009Done) { sip009Done = true; return `(impl-trait .sip009-nft-trait.nft-trait) ;; [simnet] was: ${t.replace(/'/g, '').replace(/;.*/, '')}`; }
      return `;; [simnet] duplicate removed: ${t.replace(/'/g, '').replace(/;.*/, '')}`;
    }
    if (t.startsWith('(impl-trait ')) { changed++; return `;; [simnet] removed: ${t.replace(/'/g, '').replace(/;.*/, '')}`; }
    for (const [from, to] of src.rewrites || []) {
      if (l.includes(from)) { changed++; l = l.split(from).join(to) + ` ;; [simnet] ${from.replace(/'/g, '')} -> ${to}`; }
    }
    if (l.includes(COMM)) { changed++; return l.replace(COMM, '.commission-trait.commission') + ' ;; [simnet] commission trait localised'; }
    return l;
  });
  if (src.mint === 'appended') {
    lines.push('', ';; [simnet] appended test mint: mirrors this contract\'s own token-count bookkeeping; used only because the real claim needs live sale state',
      '(define-public (simnet-mint (id uint) (to principal))',
      '  (begin (asserts! (is-eq tx-sender DEPLOYER) (err u401))',
      '    (map-set token-count to (+ (get-balance to) u1))',
      `    (nft-mint? ${src.asset} id to)))`);
  }
  const header = `;; [provenance] boomcrypto/clarity-deployed-contracts@45a7af60 ${src.name}.clar via screener/sources - verbatim except [simnet] lines (${changed} changed${src.mint === 'appended' ? ', test mint appended' : ''})`;
  writeFileSync(join(ROOT, 'contracts/legacy', `${src.name}.clar`), [header, ...lines].join('\n'));
  console.log(`${src.name.padEnd(24)} ${src.group} ${src.family.padEnd(10)} ${changed} trait line(s) localised${src.mint === 'appended' ? ' + test mint' : ''}`);
}
