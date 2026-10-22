// Steps files: a list of contract calls (and contract deploys) from several testnet wizards, signed OFFLINE and packed for a browser relay.
// Shared by relay-steps.mjs and v2.mjs. Nothing here sends anything; keys are read only through the guard (ops/lib/guard.mjs).
//
//   { "owner": "ST…deployer address", "contracts": { "reg": "xtrata-world-v2", … },
//     "steps": [ { "as": "deployer", "contract": "reg", "fn": "create-space", "args": [ … ], "note": "…",
//                  "pay": 10000000,         // optional: this wizard sends exactly this many uSTX (post-condition)
//                  "release": 10000000 },   // optional: the contract sends exactly this many uSTX (post-condition)
//                { "as": "deployer", "deploy": "xtrata-world-v2" } ] }          // a contract deploy (source from contracts/)
//
// Argument forms:
//   {uint:n} {int:n} {ascii:"…"} {bool:b} {principal:"wizard name or address"} {hex:"…"} (a buffer; "" is the empty buffer)
//   {none:true} {some:<arg>}                       optional
//   {list:[<arg>, …]}                              list
//   {tuple:{ key: <arg>, … }}                      tuple (keys exactly as the contract names them)
// An optional tuple is {some:{tuple:{…}}}.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cl, Pc, PostConditionMode, makeContractCall, makeContractDeploy, ClarityVersion } from '@stacks/transactions';
import { authoriseBroadcast, Refused } from './guard.mjs';
import { CONTRACT_DIR } from './deploy.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const WIZARDS = JSON.parse(readFileSync(join(here, '..', 'testnet-wizards.json'), 'utf8')).wizards;
export const DEFAULT_FEE = 30000;

const hexBytes = (h) => Uint8Array.from((h.match(/../g) || []).map((x) => parseInt(x, 16)));

// One step argument -> a Clarity value. `who` maps a wizard name to an address (an address passes through).
export function argCv(a, who = (v) => (WIZARDS[v] ? WIZARDS[v].address : v)) {
  if (a == null || typeof a !== 'object') throw new Error('bad argument ' + JSON.stringify(a));
  const cv = (x) => argCv(x, who);
  if ('uint' in a) return Cl.uint(a.uint);
  if ('int' in a) return Cl.int(a.int);
  if ('ascii' in a) return Cl.stringAscii(a.ascii);
  if ('bool' in a) return Cl.bool(a.bool);
  if ('principal' in a) return Cl.principal(who(a.principal));
  if ('hex' in a) { if (!/^([0-9a-fA-F]{2})*$/.test(a.hex)) throw new Error('hex argument must be pairs of hex digits'); return Cl.buffer(hexBytes(a.hex)); }
  if ('none' in a) return Cl.none();
  if ('some' in a) return Cl.some(cv(a.some));
  if ('list' in a) { if (!Array.isArray(a.list)) throw new Error('list argument needs an array'); return Cl.list(a.list.map(cv)); }
  if ('tuple' in a) return Cl.tuple(Object.fromEntries(Object.entries(a.tuple).map(([k, v]) => [k, cv(v)])));
  throw new Error('unknown argument form ' + JSON.stringify(a));
}

// Sign every step of a steps document, offline. Returns { items: [{label, hex}], nonces } (nonces = next nonce per wizard).
//   opts: { nonces: {wizard: N}, keysDir, execute, fee, network? ('testnet') }
// Each wizard's key goes through authoriseBroadcast (needs execute, XA_OPS_CONFIRM, no KILL file, not the admin wallet).
export async function signSteps(doc, opts) {
  const nonce = { ...opts.nonces };
  const fee = opts.fee ?? DEFAULT_FEE;
  const keys = {};
  const keyOf = (name) => {
    if (keys[name]) return keys[name];
    return (keys[name] = authoriseBroadcast({ network: 'testnet', execute: !!opts.execute, keyFile: join(opts.keysDir, name + '.key'), env: opts.env || process.env }));
  };
  const who = (v) => (WIZARDS[v] ? WIZARDS[v].address : v);
  const items = [];
  for (const [i, s] of doc.steps.entries()) {
    const k = keyOf(s.as);
    if (k.sender !== who(s.as)) throw new Refused(`${s.as}: key file does not match testnet-wizards.json (${k.sender})`);
    if (nonce[s.as] == null) throw new Error(`no starting nonce for ${s.as}; pass --nonces ${s.as}=N`);
    if (s.deploy) {
      if (!/^[a-z0-9-]{3,40}$/.test(s.deploy)) throw new Error('bad contract name ' + s.deploy);
      const source = readFileSync(join(CONTRACT_DIR, s.deploy + '.clar'), 'utf8');
      const tx = await makeContractDeploy({ contractName: s.deploy, codeBody: source, senderKey: k.key, network: 'testnet',
        clarityVersion: ClarityVersion.Clarity4, postConditionMode: PostConditionMode.Deny, fee: s.fee || opts.deployFee || 2500000, nonce: nonce[s.as]++ });
      items.push({ label: `${i + 1}. ${s.as}: deploy ${s.deploy}`, hex: tx.serialize() });
      continue;
    }
    const name = (doc.contracts && doc.contracts[s.contract]) || s.contract, id = `${doc.owner}.${name}`;
    const pcs = [];
    if (s.pay) pcs.push(Pc.principal(k.sender).willSendEq(s.pay).ustx());
    if (s.release) pcs.push(Pc.principal(id).willSendEq(s.release).ustx());
    const tx = await makeContractCall({
      contractAddress: doc.owner, contractName: name, functionName: s.fn, functionArgs: (s.args || []).map((a) => argCv(a, who)),
      senderKey: k.key, network: 'testnet', fee: s.fee || fee, nonce: nonce[s.as]++,
      postConditionMode: PostConditionMode.Deny, postConditions: pcs,
    });
    items.push({ label: `${i + 1}. ${s.as}: ${name}.${s.fn}${s.note ? ' (' + s.note + ')' : ''}`, hex: tx.serialize() });
  }
  return { items, nonces: nonce };
}

// "deployer=40,buyer=0" -> { deployer: 40, buyer: 0 }
export function parseNonces(text) {
  return Object.fromEntries(String(text || '').split(',').filter(Boolean).map((p) => { const [n, v] = p.split('='); return [n, Number(v)]; }));
}
