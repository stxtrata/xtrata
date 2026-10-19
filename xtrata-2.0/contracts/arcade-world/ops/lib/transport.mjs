// How the tools talk to a chain. One interface, three implementations:
//   simnetTransport   a Clarinet simnet (tests, dress rehearsals). Never touches a network.
//   networkTransport  read-only calls over HTTP (Hiro-style API). Reads are safe; sends are refused unless a signer is attached.
//   signer            attached only after guard.authoriseBroadcast() passed; signs and broadcasts one call at a time.
//
// transport = { kind, names, height(), ro(which, fn, args), send(which, fn, args, from) , mine?(n) }
//   which: 'world' | 'posters'
import { cvToHex, hexToCV, makeContractCall, broadcastTransaction, PostConditionMode } from '@stacks/transactions';
import { toJs } from './util.mjs';

export function simnetTransport(simnet, { deployer, world = 'xtrata-world-v1', posters = 'xtrata-posters-v1' }) {
  const names = { world, posters };
  const t = {
    kind: 'simnet', names, deployer, simnet,
    async height() { return simnet.burnBlockHeight; },
    async ro(which, fn, args = []) {
      const r = simnet.callReadOnlyFn(names[which], fn, args, deployer).result;
      return toJs(r);
    },
    async send(which, fn, args, from) {
      const r = simnet.callPublicFn(names[which], fn, args, from);
      const v = toJs(r.result);
      return { ok: v.ok, value: v.value, txid: null, events: r.events };
    },
    mine(n = 1) { simnet.mineEmptyBurnBlocks(n); return simnet.burnBlockHeight; },
  };
  return t;
}

export const API_BASE = { testnet: 'https://api.testnet.hiro.so', mainnet: 'https://api.hiro.so' };

// names: { world: 'ST....xtrata-world-v1', posters: 'ST....xtrata-posters-v1' } (full contract identifiers)
export function networkTransport({ network, names, readSender, apiBase, fetchImpl = globalThis.fetch, signer = null }) {
  if (network !== 'testnet' && network !== 'mainnet' && network !== 'devnet') throw new Error('network must be testnet, mainnet or devnet');
  const base = (apiBase || API_BASE[network] || 'http://localhost:3999').replace(/\/+$/, '');
  const split = (id) => { const i = id.indexOf('.'); return [id.slice(0, i), id.slice(i + 1)]; };
  const t = {
    kind: 'network', network, names, signer,
    async height() { return (await t.ro('world', 'get-height', [])); },
    async ro(which, fn, args = []) {
      const [addr, name] = split(names[which]);
      const res = await fetchImpl(`${base}/v2/contracts/call-read/${addr}/${name}/${fn}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: readSender || addr, arguments: args.map((a) => cvToHex(a)) }),
      });
      if (!res.ok) throw new Error(`read ${fn} failed: HTTP ${res.status}`);
      const body = await res.json();
      if (!body || body.okay !== true) throw new Error(`read ${fn} failed: ${body && body.cause ? body.cause : 'no result'}`);
      return toJs(hexToCV(body.result));
    },
    async send(which, fn, args) {
      if (!t.signer) throw new Error('read-only transport: no signer attached (dry run)');
      const [addr, name] = split(names[which]);
      const tx = await makeContractCall({
        contractAddress: addr, contractName: name, functionName: fn, functionArgs: args,
        senderKey: t.signer.key, network, postConditionMode: PostConditionMode.Deny,
      });
      const sent = await broadcastTransaction({ transaction: tx, network });
      if (sent.error) throw new Error(`broadcast refused: ${sent.error} ${sent.reason || ''}`);
      const txid = sent.txid;
      for (let i = 0; i < 180; i++) {            // wait up to ~30 minutes
        await new Promise((r) => setTimeout(r, 10000));
        const r = await fetchImpl(`${base}/extended/v1/tx/${txid}`);
        if (!r.ok) continue;
        const j = await r.json();
        if (j.tx_status && j.tx_status !== 'pending') {
          const v = j.tx_result ? toJs(hexToCV(j.tx_result.hex)) : { ok: false, value: j.tx_status };
          return { ok: j.tx_status === 'success' && v.ok, value: v.value, txid, status: j.tx_status };
        }
      }
      throw new Error(`transaction ${txid} still pending after 30 minutes; check it in the explorer before retrying`);
    },
  };
  return t;
}

// Build and sign one call WITHOUT broadcasting (for tests and the "show me what would be sent" mode).
export async function buildCall({ names, which, fn, args, key, network, fee, nonce }) {
  const i = names[which].indexOf('.');
  return makeContractCall({
    contractAddress: names[which].slice(0, i), contractName: names[which].slice(i + 1), functionName: fn, functionArgs: args,
    senderKey: key, network, postConditionMode: PostConditionMode.Deny, ...(fee != null ? { fee } : {}), ...(nonce != null ? { nonce } : {}),
  });
}
