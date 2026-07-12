#!/usr/bin/env node
// Sweep the sponsor relayer hot wallet back to another address (reclaim the
// float, e.g. after a key rotation or shutdown). Signs locally with the saved
// SPONSOR_KEY; the key is read from an interactive prompt so it never lands
// in shell history.
//
// Usage:
//   node scripts/sweep-sponsor-wallet.mjs <recipient SP address>              # dry run
//   node scripts/sweep-sponsor-wallet.mjs <recipient SP address> --broadcast
//
// Sends the FULL balance minus a 0.003 STX fee.

import readline from 'node:readline';
import { StacksMainnet } from '@stacks/network';
import {
  AnchorMode,
  TransactionVersion,
  broadcastTransaction,
  getAddressFromPrivateKey,
  makeSTXTokenTransfer
} from '@stacks/transactions';

const FEE = 3000n; // 0.003 STX
const recipient = process.argv[2];
const broadcast = process.argv.includes('--broadcast');

if (!recipient || !/^S[PM][A-Z0-9]{38,40}$/.test(recipient)) {
  console.error('Usage: node scripts/sweep-sponsor-wallet.mjs <recipient SP address> [--broadcast]');
  process.exit(1);
}

const askKey = () =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Paste SPONSOR_KEY (hidden nowhere, so paste carefully): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

const main = async () => {
  const key = process.env.SPONSOR_KEY?.trim() || (await askKey());
  if (!/^[0-9a-f]{66}$/.test(key)) {
    throw new Error('key must be 66 hex chars (raw 32-byte key + 01 suffix)');
  }
  const network = new StacksMainnet();
  const from = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
  console.log('Sweeping from :', from);
  console.log('To            :', recipient);

  const balRes = await fetch(`https://api.hiro.so/extended/v1/address/${from}/stx`);
  const bal = BigInt(((await balRes.json()).balance ?? '0'));
  console.log('Balance       :', (Number(bal) / 1e6).toFixed(6), 'STX');
  if (bal <= FEE) {
    console.log('Nothing to sweep (balance does not cover the fee).');
    return;
  }
  const amount = bal - FEE;
  console.log('Sending       :', (Number(amount) / 1e6).toFixed(6), 'STX (balance minus 0.003 fee)');

  const nonceRes = await fetch(`https://api.hiro.so/extended/v1/address/${from}/nonces`);
  const nonce = BigInt((await nonceRes.json()).possible_next_nonce ?? 0);

  const tx = await makeSTXTokenTransfer({
    recipient,
    amount,
    senderKey: key,
    network,
    fee: FEE,
    nonce,
    memo: 'sponsor float sweep',
    anchorMode: AnchorMode.Any
  });
  console.log('Built txid    :', tx.txid());
  if (!broadcast) {
    console.log('\nDry run complete. Re-run with --broadcast to send.');
    return;
  }
  const res = await broadcastTransaction(tx, network);
  if (res.error) throw new Error(`${res.error} ${res.reason ?? ''}`);
  const txid = res.txid || res;
  console.log('Broadcast OK  :', `https://explorer.hiro.so/txid/0x${String(txid).replace(/^0x/, '')}?chain=mainnet`);
};

main().catch((e) => {
  console.error('Sweep error:', e.message);
  process.exit(1);
});
