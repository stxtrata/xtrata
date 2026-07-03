#!/usr/bin/env node
/**
 * Fully clear EVERY job's deposit wallet, back to your wallet: first return every
 * xtrata inscription it holds (escrowed parents, undelivered tokens/receipts, strays),
 * then sweep the STX. Never wipes keys. Stop the server first.
 *
 *   List balances (no spend):   node svc/recover-all.mjs
 *   Sweep to your wallet:        DEST=SP... DRY_RUN=0 node svc/recover-all.mjs
 *
 * Env: DEST (your SP… wallet)  JOB_DIR(=./job-state)  FEE_USTX(=6000)  HIRO_API_KEY  DRY_RUN(=1)
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listJobs, deriveFrom, balance, netOf, heldInscriptions, sendNft, DEPLOYER } from './core.mjs';
import { makeSTXTokenTransfer, broadcastTransaction, AnchorMode } from '@stacks/transactions';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JOB_DIR = process.env.JOB_DIR || path.resolve(__dirname, 'job-state');
const DEST = process.env.DEST;
const FEE = BigInt(process.env.FEE_USTX || '6000');
const HIRO = process.env.HIRO_API_KEY || '';
const DRY = process.env.DRY_RUN !== '0';
const log = (o) => console.log(JSON.stringify(o));
if (!DRY && !DEST) { console.error('Set DEST=<your SP… wallet> to sweep'); process.exit(2); }

const jobs = listJobs(JOB_DIR);
let totalFound = 0n, totalSwept = 0n;
for (const j of jobs) {
  if (!j.ephemeralMnemonic) { log({ job: j.jobId, action: 'skip — key already wiped (no funds expected)' }); continue; }
  const net = j.net || 'mainnet'; const network = netOf(net);
  const { key, address } = deriveFrom(j.ephemeralMnemonic, net);
  // 1) Inscriptions FIRST — a wallet is not clear until every NFT (escrowed parent, undelivered
  //    token/receipt, stray) has gone home. Requires enough STX for the transfer fees.
  let held = []; try { held = await heldInscriptions(network, [DEPLOYER, j.core || 'xtrata-v3-2-3'], address, HIRO); } catch (e) { log({ job: j.jobId, address, warn: 'could not list held inscriptions: ' + ((e && e.message) || e) }); }
  if (held.length && DRY) log({ job: j.jobId, address, heldInscriptions: held, action: 'would return to ' + (DEST || '<DEST>') });
  if (held.length && !DRY) for (const id of held) {
    try { const tx = await sendNft([DEPLOYER, j.core || 'xtrata-v3-2-3'], network, key, address, id, DEST, HIRO); log({ job: j.jobId, address, returnedInscription: id, to: DEST, txid: tx }); }
    catch (e) { log({ job: j.jobId, address, inscription: id, error: 'nft return: ' + ((e && e.message) || e) }); }
  }
  let bal = 0n; try { bal = await balance(network, address, HIRO); } catch (e) { log({ job: j.jobId, address, error: 'balance: ' + ((e && e.message) || e) }); continue; }
  if (bal <= FEE) { log({ job: j.jobId, address, balanceStx: (Number(bal) / 1e6).toFixed(6), action: held.length ? 'skip STX — empty/dust (inscriptions handled above)' : 'skip — empty/dust' }); continue; }
  totalFound += bal;
  if (DRY) { log({ job: j.jobId, address, balanceStx: (Number(bal) / 1e6).toFixed(6), action: 'would sweep' }); continue; }
  const amount = bal - FEE;
  try {
    const tx = await makeSTXTokenTransfer({ recipient: DEST, amount, senderKey: key, network, fee: FEE, anchorMode: AnchorMode.Any });
    const res = await broadcastTransaction(tx, network);
    if (res.error) { log({ job: j.jobId, address, error: 'broadcast: ' + res.error + ' ' + (res.reason || '') }); continue; }
    totalSwept += amount;
    log({ job: j.jobId, address, sweptStx: (Number(amount) / 1e6).toFixed(6), to: DEST, txid: res.txid || res, explorer: `https://explorer.hiro.so/txid/${res.txid || res}` });
  } catch (e) { log({ job: j.jobId, address, error: String((e && e.message) || e) }); }
}
log({ event: 'summary', dryRun: DRY, totalFoundStx: (Number(totalFound) / 1e6).toFixed(6), totalSweptStx: (Number(totalSwept) / 1e6).toFixed(6), dest: DEST || null });
