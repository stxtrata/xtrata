// Wizard-only, offline transaction-construction check. No signing or broadcasting.
import assert from 'node:assert/strict';
import {
  createAddress,
  createStacksPrivateKey,
  cvToString,
  deserializeTransaction,
  getAddressFromPrivateKey,
  getPublicKey,
  makeUnsignedSTXTokenTransfer,
  publicKeyToString,
  TransactionVersion
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { loadWizardEnv } from './inscribe.mjs';

const env = loadWizardEnv({ ...(process.argv[2] ? { path: process.argv[2] } : {}), env: {} });
const key = env.WIZARD_KEY_ARCHIVIST;
const address = env.WIZARD_ADDRESS_ARCHIVIST;
const recipient = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
if (!key || !/^[0-9a-f]{64}(01)?$/i.test(key) || !address || address === recipient) {
  throw Error(
    'A provisioned Archivist wizard configuration is required; personal wallets are prohibited.'
  );
}
assert.equal(
  getAddressFromPrivateKey(key, TransactionVersion.Mainnet),
  address,
  'Wizard key/address mismatch'
);
// Derive the public key in memory. The private key never enters a transaction,
// browser, output file or log. All transaction signatures remain zero-filled.
const publicKey = publicKeyToString(getPublicKey(createStacksPrivateKey(key)));
const checks = [];
for (const payment of [
  { name: 'cafe', recipient, amount: 1_000_000n, fee: 3_000n, memo: 'TD:WEDNESDAY:1' },
  { name: 'save-memo', recipient: address, amount: 1n, fee: 3_000n, memo: 'TD1:000000000000:3f' }
]) {
  const tx = await makeUnsignedSTXTokenTransfer({
    ...payment,
    publicKey,
    nonce: 0n,
    network: new StacksMainnet()
  });
  const restored = deserializeTransaction(tx.serialize());
  assert.equal(restored.version, TransactionVersion.Mainnet);
  assert.equal(restored.auth.spendingCondition.signer, createAddress(address).hash160);
  assert.match(restored.auth.spendingCondition.signature.data, /^0+$/);
  assert.equal(restored.auth.spendingCondition.fee, payment.fee);
  assert.equal(restored.payload.amount, payment.amount);
  assert.equal(cvToString(restored.payload.recipient), payment.recipient);
  assert.equal(restored.payload.memo.content, payment.memo);
  checks.push(payment.name);
}
console.log(
  JSON.stringify(
    {
      wizard: 'Archivist',
      address,
      checks,
      signed: false,
      broadcast: false,
      note: 'Offline nonce/fee fixtures only. The save-memo fee is illustrative; the game leaves it to the wallet.'
    },
    null,
    2
  )
);
