#!/usr/bin/env node
/**
 * Fully clear a job's one-shot deposit wallet: return every inscription it holds
 * (escrowed parents, undelivered tokens/receipts, strays) to DEST, then sweep the STX.
 * Use when funds were sent to a deposit address you need to reclaim — e.g. a MOCK
 * job, or a job you cancelled. Runs on YOUR machine; YOU broadcast the sweep.
 *
 *   Step 1 — verify (offline, no spend): confirms the saved key controls the address
 *     cd xtrata-agent-one/svc
 *     JOB=job-XXXXXXXX node recover-deposit.mjs
 *
 *   Step 2 — sweep the balance to your wallet (live, broadcasts):
 *     JOB=job-XXXXXXXX DEST=SP_your_wallet DRY_RUN=0 node recover-deposit.mjs
 *
 * Env: JOB  JOB_DIR(=./job-state)  DEST  FEE_USTX(=6000)  HIRO_API_KEY  DRY_RUN(=1)
 */
import { readJob, deriveFrom, balance, netOf, heldInscriptions, sendNft, DEPLOYER } from './core.mjs';
import { makeSTXTokenTransfer, broadcastTransaction, AnchorMode } from '@stacks/transactions';

const JOB_DIR = process.env.JOB_DIR || './job-state';
const JOB = process.env.JOB;
const DEST = process.env.DEST;
const FEE = BigInt(process.env.FEE_USTX || '6000');
const HIRO = process.env.HIRO_API_KEY || '';
const DRY = process.env.DRY_RUN !== '0';
const log = (o) => console.log(JSON.stringify(o));
if (!JOB) { console.error('Set JOB=<jobId>'); process.exit(2); }

const job = readJob(JOB_DIR, JOB);
const net = job.net || 'mainnet';
if (!job.ephemeralMnemonic) { console.error('No key in this job (already wiped on delivery) — cannot recover from here.'); process.exit(2); }
const { key, address } = deriveFrom(job.ephemeralMnemonic, net);
if (address !== job.depositAddress) { console.error(`Derived ${address} != deposit ${job.depositAddress} — aborting`); process.exit(1); }
log({ event: 'key-ok', depositAddress: address, controlsAddress: true });

if (DRY) { log({ event: 'dry-run', note: 'Saved key controls the deposit address. To sweep: add DEST=SP... and DRY_RUN=0', dest: DEST || null }); process.exit(0); }
if (!DEST) { console.error('Set DEST=<your SP... wallet> to sweep to'); process.exit(2); }

const network = netOf(net);
// Inscriptions FIRST — the wallet isn't clear until every NFT it holds (escrowed parent,
// undelivered token/receipt, stray) has gone home to DEST.
let held = []; try { held = await heldInscriptions(network, [DEPLOYER, job.core || 'xtrata-v3-2-3'], address, HIRO); } catch (e) { log({ warn: 'could not list held inscriptions: ' + ((e && e.message) || e) }); }
for (const id of held) {
  try { const tx = await sendNft([DEPLOYER, job.core || 'xtrata-v3-2-3'], network, key, address, id, DEST, HIRO); log({ event: 'inscription-returned', tokenId: id, to: DEST, txid: tx }); }
  catch (e) { log({ event: 'inscription-return-failed', tokenId: id, error: String((e && e.message) || e) }); }
}
const bal = await balance(network, address, HIRO);
if (bal <= FEE) { console.error(`balance ${bal} uSTX <= fee ${FEE} uSTX; nothing to sweep`); process.exit(1); }
const amount = bal - FEE;
log({ event: 'sweeping', from: address, to: DEST, balanceUstx: bal.toString(), feeUstx: FEE.toString(), amountUstx: amount.toString() });
const tx = await makeSTXTokenTransfer({ recipient: DEST, amount, senderKey: key, network, fee: FEE, anchorMode: AnchorMode.Any });
const res = await broadcastTransaction(tx, network);
if (res.error) { console.error('broadcast failed: ' + res.error + ' ' + (res.reason || '')); process.exit(1); }
log({ event: 'broadcast', txid: res.txid || res, explorer: `https://explorer.hiro.so/txid/${res.txid || res}` });
