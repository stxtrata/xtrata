// Shared simnet helpers. Simnet only: nothing here can reach a real network.
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl, cvToValue } from '@stacks/transactions';
import { createHash } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export { Cl };

export async function boot() {
  const s = await initSimnet(join(ROOT, 'Clarinet.toml'));
  const acc = s.getAccounts();
  const D = acc.get('deployer');
  const W = (n) => acc.get(`wallet_${n}`);
  const C = (name) => `${D}.${name}`;
  const CORE = C('xtrata-v3-2-3');
  s.callPublicFn(CORE, 'set-paused', [Cl.bool(false)], D); // core deploys paused
  return { s, D, W, C, CORE };
}

const jsonable = (x) => JSON.parse(JSON.stringify(x, (k, v) => (typeof v === 'bigint' ? v.toString() : v)));
export const val = (r) => cvToValue(r.result, true);
export const isOk = (r) => r.result.type === 'ok';
export const errCode = (r) => {
  const j = jsonable(r.result);
  return j.type === 'err' ? (j.value?.value ?? JSON.stringify(j.value)) : null;
};
export const okUint = (r) => Number(val(r).value ?? val(r));

// xtrata rolling hash: h0 = 32 zero bytes; h = sha256(h || chunk). Not plain SHA-256.
export function xtrataHash(chunks) {
  let h = Buffer.alloc(32);
  for (const c of chunks) h = createHash('sha256').update(Buffer.concat([h, c])).digest();
  return h;
}
export const art = (label) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><text>${label}</text></svg>`);

export function makeRunner(title) {
  const results = [];
  let current = null;
  return {
    scenario(id, t, specRef = '') { current = { id, title: t, specRef, checks: [], notes: [] }; results.push(current); },
    check(label, cond, detail = '') { current.checks.push({ label, pass: !!cond, detail: String(detail ?? '') }); if (!cond) console.log(`   ✗ [${current.id}] ${label} ${detail}`); },
    note(t) { current.notes.push(t); },
    finish(outName) {
      let pass = 0, fail = 0;
      for (const r of results) {
        const f = r.checks.filter((c) => !c.pass).length;
        pass += r.checks.length - f; fail += f;
        console.log(`${f ? 'FAIL' : 'ok  '} ${r.id.padEnd(6)} ${r.title}${r.specRef ? `  [${r.specRef}]` : ''}`);
      }
      console.log(`\n${title}: ${pass} checks passed, ${fail} failed across ${results.length} scenarios`);
      mkdirSync(join(ROOT, 'results'), { recursive: true });
      writeFileSync(join(ROOT, 'results', outName), JSON.stringify({ suite: title, ranAt: new Date().toISOString(),
        environment: 'clarinet-sdk simnet (local). Not mainnet state.', pass, fail, results }, null, 2));
      process.exitCode = fail ? 1 : 0;
    },
  };
}

// Owner of an NFT via the contract's own get-owner, returned as a principal string or null.
export function ownerOf(s, D, contract, id) {
  const v = cvToValue(s.callReadOnlyFn(contract, 'get-owner', [Cl.uint(id)], D).result, true);
  const inner = v?.value ?? v;
  return inner?.value ?? inner ?? null;
}
