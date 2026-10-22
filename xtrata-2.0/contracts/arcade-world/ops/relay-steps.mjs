#!/usr/bin/env node
// Sign a list of contract calls from SEVERAL testnet wizards, offline, and pack them for a browser to relay. TESTNET ONLY.
// Same gate as the other tools (--execute, XA_OPS_CONFIRM=broadcast-testnet, no KILL file, never the admin wallet's key).
// Nothing is sent from here. Used for the screen contract (buying, approving, refunds need STX post-conditions), but works for any
// of the arcade contracts.
//
//   node ops/relay-steps.mjs --execute --steps ops/examples/screen-testnet-setup.steps.json --nonces deployer=40,buyer=0 [--keys ~/.xa-testnet-wizards] [--out file]
//
// The steps file:
//   { "owner": "ST…deployer address", "contracts": { "screen": "xtrata-screen-v1", … },
//     "steps": [ { "as": "buyer", "contract": "screen", "fn": "buy-slot", "args": [ {"uint":2}, {"ascii":"HEAD"}, … ],
//                  "pay": 10000000,               // optional: this wizard sends exactly this many uSTX (post-condition)
//                  "release": 10000000 } ] }     // optional: the contract sends exactly this many uSTX (post-condition)
// Argument forms: {uint}, {ascii}, {bool}, {principal} (a wizard name or an address), {hex} (a buffer), {none}, {some:<arg>}.
// Wizard names come from ops/testnet-wizards.json; keys are read from <keys dir>/<name>.key.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
import { Cl, Pc, PostConditionMode, makeContractCall } from '@stacks/transactions';
import { parseArgs, die } from './lib/cli.mjs';
import { authoriseBroadcast, Refused } from './lib/guard.mjs';
import { pack } from './lib/relay.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2), { steps: 'value', nonces: 'value', keys: 'value', out: 'value', fee: 'value' });
if (!args.steps || !args.nonces) die('usage: node ops/relay-steps.mjs --execute --steps FILE --nonces name=N,name=N [--keys DIR] [--out FILE]');
const doc = JSON.parse(readFileSync(args.steps, 'utf8'));
const wiz = JSON.parse(readFileSync(join(here, 'testnet-wizards.json'), 'utf8')).wizards;
const keysDir = args.keys || join(homedir(), '.xa-testnet-wizards');
const nonce = Object.fromEntries(String(args.nonces).split(',').map((p) => { const [n, v] = p.split('='); return [n, Number(v)]; }));
const fee = Number(args.fee || 30000);

const who = (v) => (wiz[v] ? wiz[v].address : v);
function cv(a) {
  if ('uint' in a) return Cl.uint(a.uint);
  if ('ascii' in a) return Cl.stringAscii(a.ascii);
  if ('bool' in a) return Cl.bool(a.bool);
  if ('principal' in a) return Cl.principal(who(a.principal));
  if ('hex' in a) return Cl.buffer(Uint8Array.from((a.hex.match(/../g) || []).map((h) => parseInt(h, 16))));
  if ('none' in a) return Cl.none();
  if ('some' in a) return Cl.some(cv(a.some));
  throw new Error('unknown argument form ' + JSON.stringify(a));
}

const keys = {};
const keyOf = (name) => {
  if (keys[name]) return keys[name];
  try { return (keys[name] = authoriseBroadcast({ network: 'testnet', execute: !!args.execute, keyFile: join(keysDir, name + '.key') })); }
  catch (e) { if (e instanceof Refused) die('REFUSED: ' + e.message, 2); throw e; }
};

const items = [];
for (const [i, s] of doc.steps.entries()) {
  const k = keyOf(s.as);
  if (k.sender !== who(s.as)) die(`${s.as}: key file does not match testnet-wizards.json (${k.sender})`);
  if (nonce[s.as] == null) die(`no starting nonce for ${s.as}; pass --nonces ${s.as}=N`);
  const name = doc.contracts[s.contract] || s.contract, id = `${doc.owner}.${name}`;
  const pcs = [];
  if (s.pay) pcs.push(Pc.principal(k.sender).willSendEq(s.pay).ustx());
  if (s.release) pcs.push(Pc.principal(id).willSendEq(s.release).ustx());
  const tx = await makeContractCall({
    contractAddress: doc.owner, contractName: name, functionName: s.fn, functionArgs: (s.args || []).map(cv),
    senderKey: k.key, network: 'testnet', fee: s.fee || fee, nonce: nonce[s.as]++,
    postConditionMode: PostConditionMode.Deny, postConditions: pcs,
  });
  items.push({ label: `${i + 1}. ${s.as}: ${name}.${s.fn}${s.note ? ' (' + s.note + ')' : ''}`, hex: tx.serialize() });
}
const out = args.out || join(here, 'out', 'relay', 'steps.packed.txt');
mkdirSync(dirname(out), { recursive: true });
const packed = pack(items);
writeFileSync(out, packed);
console.log(`${items.length} transaction(s) signed offline; packed -> ${out}`);
console.log(`pack length ${packed.length}, sha256 ${createHash('sha256').update(packed).digest('hex').slice(0, 12)} (check this after pasting into the browser)`);
items.forEach((i) => console.log('  ' + i.label));
console.log('next nonces: ' + Object.entries(nonce).map(([n, v]) => `${n}=${v}`).join(','));
