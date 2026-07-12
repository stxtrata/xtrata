#!/usr/bin/env node
// Replace a stuck/doomed pending transaction on the admin account by
// broadcasting a 0.000001 STX transfer at the SAME nonce with a HIGHER fee.
// Exists because wallet UIs (Xverse) cap fees at 0.5 STX, which cannot outbid
// a stuck 0.5 STX transaction.
//
// Usage:
//   XTRATA_MAINNET_MNEMONIC="..." node scripts/replace-nonce.mjs --nonce 330 --fee 0.51 --to SP3EHW9BYF23GNAQ3CC6818J1ZZRWVQM3DSRSN0AF
//   add --broadcast to actually send (dry run by default)
//
// Key handling identical to scripts/mainnet-deploy-contract.mjs
// (m/44'/5757'/3'/0/0, the SP3J…743X wallet).

import process from 'node:process';
import { StacksMainnet } from '@stacks/network';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';
import {
  AnchorMode,
  TransactionVersion,
  broadcastTransaction,
  getAddressFromPrivateKey,
  makeSTXTokenTransfer
} from '@stacks/transactions';

const arg = (name, fallback = null) => {
  const index = process.argv.indexOf(`--${name}`);
  return index > -1 ? process.argv[index + 1] : fallback;
};
const broadcast = process.argv.includes('--broadcast');
const nonce = arg('nonce');
const feeStx = arg('fee', '0.51');
const recipient = arg('to');

if (!nonce || !/^\d+$/.test(nonce) || !recipient || !/^S[PM][A-Z0-9]{38,40}$/.test(recipient)) {
  console.error('Usage: node scripts/replace-nonce.mjs --nonce <n> --fee <stx> --to <SP address> [--broadcast]');
  process.exit(1);
}

const resolveKey = async () => {
  const explicit = process.env.XTRATA_MAINNET_DEPLOYER_KEY?.trim();
  if (explicit) return explicit;
  const raw = process.env.XTRATA_MAINNET_MNEMONIC;
  if (!raw?.trim()) throw new Error('set XTRATA_MAINNET_MNEMONIC or XTRATA_MAINNET_DEPLOYER_KEY');
  const mnemonic = raw.normalize('NFKD').trim().replace(/\s+/g, ' ').toLowerCase();
  const seed = await mnemonicToSeed(mnemonic);
  const node = HDKey.fromMasterSeed(seed).derive(`m/44'/5757'/${Number(process.env.XTRATA_MAINNET_ACCOUNT_INDEX ?? '3')}'/0/0`);
  if (!node.privateKey) throw new Error('key derivation failed');
  return Buffer.from(node.privateKey).toString('hex') + '01';
};

const main = async () => {
  const key = await resolveKey();
  const from = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
  const feeUstx = BigInt(Math.round(Number(feeStx) * 1_000_000));
  console.log('From   :', from);
  console.log('To     :', recipient, '(0.000001 STX)');
  console.log('Nonce  :', nonce, '(replacing the stuck tx at this nonce)');
  console.log('Fee    :', feeStx, 'STX — must exceed the stuck transaction fee');

  const tx = await makeSTXTokenTransfer({
    recipient,
    amount: 1n,
    senderKey: key,
    network: new StacksMainnet(),
    fee: feeUstx,
    nonce: BigInt(nonce),
    memo: 'nonce unblock',
    anchorMode: AnchorMode.Any
  });
  console.log('Txid   :', tx.txid());
  if (!broadcast) {
    console.log('\nDry run. Re-run with --broadcast to send.');
    return;
  }
  const res = await broadcastTransaction(tx, new StacksMainnet());
  if (res.error) throw new Error(`${res.error} ${res.reason ?? ''}`);
  console.log('Broadcast OK:', `https://explorer.hiro.so/txid/0x${String(res.txid ?? res).replace(/^0x/, '')}?chain=mainnet`);
};

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
