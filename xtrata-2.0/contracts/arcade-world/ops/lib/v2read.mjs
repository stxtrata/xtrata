// Read-only calls for the v2 tools (Node): a node's HTTP API or a Clarinet simnet, returning plain JS (lib/util.mjs toJs).
// Used by `v2.mjs verify` (the manifest read back, see v2-plan.mjs verifyManifest) and `v2.mjs room --entry` (an inscription's
// hash and size, read from the core). Nothing here signs or sends anything.
import { cvToHex, hexToCV } from '@stacks/transactions';
import { argCv } from './steps.mjs';
import { toJs } from './util.mjs';

// (contractId) -> (fn, args in relay-steps forms) -> plain JS
export function httpReader({ apiBase = 'https://api.testnet.hiro.so', fetchImpl = globalThis.fetch, sender = null } = {}) {
  return (contractId) => async (fn, args = []) => {
    const i = contractId.indexOf('.'), addr = contractId.slice(0, i), name = contractId.slice(i + 1);
    const res = await fetchImpl(`${apiBase.replace(/\/+$/, '')}/v2/contracts/call-read/${addr}/${name}/${fn}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: sender || addr, arguments: args.map((a) => cvToHex(argCv(a))) }),
    });
    if (!res.ok) throw new Error(`read ${fn} failed: HTTP ${res.status}`);
    const body = await res.json();
    if (!body || body.okay !== true || typeof body.result !== 'string') throw new Error(`read ${fn} failed: ${body && body.cause ? body.cause : 'no result'}`);
    return toJs(hexToCV(body.result));
  };
}

export function simnetReader(simnet, sender, who) {
  return (contractId) => async (fn, args = []) => {
    const name = contractId.slice(contractId.indexOf('.') + 1);
    return toJs(simnet.callReadOnlyFn(name, fn, args.map((a) => argCv(a, who)), sender).result);
  };
}

// An inscription's entry for set-space-entry, read from the core: { id, hash (hex, no 0x), size }. Refuses one that does not
// exist or is not sealed (the registry would refuse it too).
export async function readEntry(readCore, id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 0) throw new Error(`--entry: an inscription id (got ${id})`);
  const sealed = await readCore('is-inscription-sealed', [{ uint: n }]);
  const hash = await readCore('get-inscription-hash', [{ uint: n }]);
  const size = await readCore('get-inscription-size', [{ uint: n }]);
  if (hash == null || size == null) throw new Error(`inscription #${n} is not in the core`);
  if (sealed !== true) throw new Error(`inscription #${n} is not sealed yet: the registry only takes sealed inscriptions as an entry`);
  return { id: n, hash: String(hash).replace(/^0x/, '').toLowerCase(), size };
}
