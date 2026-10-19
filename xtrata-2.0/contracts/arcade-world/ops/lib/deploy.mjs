// The deploy list for a test network, built from the simnet sources, unmodified. (Mainnet uses contracts/live, made by make-live.mjs,
// and is NOT handled here: it is a separate decision.) On a test network the stand-in core is deployed first, by the same address,
// because the other two call it as `.mock-xtrata-core`.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeContractDeploy, broadcastTransaction, ClarityVersion, PostConditionMode } from '@stacks/transactions';

const here = dirname(fileURLToPath(import.meta.url));
export const CONTRACT_DIR = join(here, '..', '..', 'contracts');
export const DEPLOY_ORDER = ['mock-xtrata-core', 'xtrata-posters-v1', 'xtrata-world-v1'];

export function deploySources() {
  return DEPLOY_ORDER.map((name) => {
    const source = readFileSync(join(CONTRACT_DIR, `${name}.clar`), 'utf8');
    return { name, source, bytes: Buffer.byteLength(source), sha256: createHash('sha256').update(source).digest('hex'), clarityVersion: 4 };
  });
}

export async function contractExists(fetchImpl, base, address, name) {
  const r = await fetchImpl(`${base}/v2/contracts/interface/${address}/${name}`);
  return r.ok;
}

// Deploy each source in order, skipping any already on chain. `t` is a network transport with a signer attached.
export async function deployAll(t, sources, { execute = false, log = () => {}, fetchImpl = globalThis.fetch, base }) {
  const address = t.signer ? t.signer.address : null;
  const res = { deployed: [], skipped: [], failed: null };
  for (const s of sources) {
    let exists = false;
    if (address) {
      try { exists = await contractExists(fetchImpl, base, address, s.name); }
      catch (e) { if (execute) { res.failed = `cannot check whether ${s.name} is already deployed (${e.message}); not deploying blind`; return res; } log(`(could not reach the network to check whether ${s.name} exists: dry run goes on)`); }
    }
    if (exists) { res.skipped.push(s.name); log(`${s.name}: already deployed, skipped`); continue; }
    if (!execute) { log(`dry run: deploy ${s.name} (${s.bytes} bytes, sha256 ${s.sha256.slice(0, 12)}...)`); continue; }
    const tx = await makeContractDeploy({ contractName: s.name, codeBody: s.source, senderKey: t.signer.key, network: t.network, clarityVersion: ClarityVersion.Clarity4, postConditionMode: PostConditionMode.Deny });
    const sent = await broadcastTransaction({ transaction: tx, network: t.network });
    if (sent.error) { res.failed = `${s.name}: ${sent.error} ${sent.reason || ''}`; return res; }
    log(`${s.name}: broadcast ${sent.txid}`);
    let done = false;
    for (let i = 0; i < 180 && !done; i++) {
      await new Promise((r) => setTimeout(r, 10000));
      const q = await fetchImpl(`${base}/extended/v1/tx/${sent.txid}`);
      if (!q.ok) continue;
      const j = await q.json();
      if (j.tx_status && j.tx_status !== 'pending') {
        if (j.tx_status !== 'success') { res.failed = `${s.name}: ${j.tx_status}`; return res; }
        done = true; res.deployed.push(s.name); log(`${s.name}: confirmed`);
      }
    }
    if (!done) { res.failed = `${s.name}: still pending after 30 minutes (${sent.txid}); check the explorer before retrying`; return res; }
  }
  return res;
}
