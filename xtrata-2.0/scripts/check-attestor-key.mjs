#!/usr/bin/env node
/* Check a BNS attestor private key against the on-chain configuration.
 *
 *   node scripts/check-attestor-key.mjs            # prompts, input hidden
 *   BNS_ATTESTATION_PRIVATE_KEY=... node scripts/check-attestor-key.mjs
 *
 * Prints hash160s only — never the key. Read from a prompt or the environment,
 * never from argv, so it cannot land in shell history or `ps` output.
 *
 * Why this exists: createStacksPrivateKey infers compression from the key's
 * LENGTH. 64 hex chars -> uncompressed (65-byte) public key; 66 chars ending in
 * "01" -> compressed (33-byte). The same key therefore yields two different
 * hash160s, and the contract stores the compressed one. Uploading the bare
 * 64-char form is the usual cause of ATTESTOR_KEY_MISMATCH.
 */
import { createInterface } from 'node:readline';
import { createStacksPrivateKey, getPublicKey, publicKeyToString, hash160, hexToCV, cvToJSON } from '@stacks/transactions';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v1-1';
const [ADDR, NAME] = CONTRACT.split('.');

const hashFor = key => {
  const pub = publicKeyToString(getPublicKey(createStacksPrivateKey(key)));
  return {
    hash: Buffer.from(hash160(Buffer.from(pub, 'hex'))).toString('hex'),
    form: pub.length / 2 === 33 ? 'compressed (33-byte)' : 'uncompressed (65-byte)'
  };
};

async function onChainHash(){
  const res = await fetch(`https://api.hiro.so/v2/contracts/call-read/${ADDR}/${NAME}/get-bns-attestor-pubkey-hash`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: ADDR, arguments: [] })
  });
  const json = await res.json();
  if (!json.okay) throw new Error(`read failed: ${json.cause}`);
  // (response (optional (buff 20))) — three levels of {type, value}. Walk down
  // to the primitive instead of assuming a depth; cvToJSON nests one wrapper per
  // Clarity container and miscounting them is an easy way to read "not set".
  const walk = (node, depth = 0) => {
    if (depth > 8 || node === null || node === undefined) return null;
    if (typeof node === 'string') return node;
    if (typeof node === 'object' && 'value' in node) return walk(node.value, depth + 1);
    return null;
  };
  const value = walk(cvToJSON(hexToCV(json.result)));
  return typeof value === 'string' ? value.replace(/^0x/i, '').toLowerCase() : null;
}

const askHidden = () => new Promise(resolve => {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  process.stdout.write('attestor private key (hidden): ');
  const onData = ch => { if (![ '\n', '\r', '' ].includes(ch.toString())) process.stdout.write(''); };
  process.stdin.on('data', onData);
  rl.question('', answer => { process.stdin.off('data', onData); rl.close(); process.stdout.write('\n'); resolve(answer); });
  rl._writeToOutput = () => {};
});

const raw = (process.env.BNS_ATTESTATION_PRIVATE_KEY || await askHidden()).trim().replace(/^0x/i, '');
if (!/^[0-9a-f]{64}(?:01)?$/i.test(raw)) {
  console.error(`\nNot a valid key: expected 64 hex chars, optionally + "01". Got ${raw.length} chars.`);
  process.exit(1);
}

const bare = raw.slice(0, 64);
const variants = [
  ['64 chars, no suffix', bare],
  ['66 chars, +01      ', bare + '01']
];

const configured = await onChainHash().catch(e => { console.error(String(e.message)); return null; });

console.log(`\ncontract   ${CONTRACT}`);
console.log(`on-chain   ${configured ? '0x' + configured : '(not configured)'}\n`);

let match = null;
for (const [label, key] of variants) {
  const { hash, form } = hashFor(key);
  const hit = configured && hash === configured;
  if (hit) match = label.trim();
  console.log(`  ${label}  ${form.padEnd(22)} hash160 0x${hash}  ${hit ? '<-- MATCHES' : ''}`);
}

console.log();
if (!configured) console.log('No attestor hash is set on chain — nothing to match against.');
else if (match === '64 chars, no suffix') console.log('Matches WITHOUT the suffix. Upload the bare 64-char key.');
else if (match) console.log('Matches WITH the "01" suffix. Upload the 66-char form — this is the usual fix.');
else console.log('Neither form matches. This is not the key the contract was configured with;\n'
  + 'either find the right key, or rotate the chain with set-bns-attestor-pubkey-hash\n'
  + `(contract-owner only — get-owner returns ${ADDR}).`);
