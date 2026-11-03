// Sign transactions OFFLINE (the key stays in this workspace) and pack them for a browser that can reach the node.
// The browser only relays signed bytes; it never sees a key. For use when the workspace itself cannot reach the network.
import { gzipSync } from 'node:zlib';
import { makeContractDeploy, makeSTXTokenTransfer, ClarityVersion, PostConditionMode } from '@stacks/transactions';
import { buildCall } from './transport.mjs';

export async function signDeploy({ name, source, key, nonce, fee, network = 'testnet' }) {
  const tx = await makeContractDeploy({ contractName: name, codeBody: source, senderKey: key, network, clarityVersion: ClarityVersion.Clarity4, postConditionMode: PostConditionMode.Deny, fee, nonce });
  return { label: `deploy ${name}`, hex: tx.serialize() };
}
export async function signCall({ names, which, fn, args, key, nonce, fee, network = 'testnet', label }) {
  const tx = await buildCall({ names, which, fn, args, key, network, fee, nonce });
  return { label: label || `${which} ${fn}`, hex: tx.serialize() };
}
export async function signTransfer({ to, ustx, key, nonce, fee, network = 'testnet', label }) {
  const tx = await makeSTXTokenTransfer({ recipient: to, amount: ustx, senderKey: key, network, fee, nonce });
  return { label: label || `transfer ${ustx} uSTX to ${to}`, hex: tx.serialize() };
}
export const pack = (items) => gzipSync(Buffer.from(JSON.stringify(items))).toString('base64');
export const unpack = (s) => JSON.parse(require_gunzip(s));
import { gunzipSync } from 'node:zlib';
function require_gunzip(s) { return gunzipSync(Buffer.from(s, 'base64')).toString('utf8'); }
