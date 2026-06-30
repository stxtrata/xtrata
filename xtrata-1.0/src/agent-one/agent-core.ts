// agent-core.ts — FULLY IN-BROWSER Agent One. No backend.
// Bundled by Vite into wizard/agent-one.js; exposes window.XtrataAgent for the wizard UI.
//
// - Reads/broadcasts via the same-origin /hiro Pages-Function proxy (HIRO_API_KEY stays server-side).
// - Ephemeral deposit wallet generated in-browser; key + job meta persisted to localStorage so the
//   user can always reclaim funds (resume-or-refund) even after a crash. File BYTES live in memory
//   only — on reload, a funded job whose bytes are gone is REFUNDED (never silently stranded).
// - Single-tx mint for <=32 chunks and for all receipts (incl. failure/refund receipts).
// - Guaranteed temporary: on success, error, OR timeout the wallet is emptied (deliver + refund),
//   then the key is discarded. The only time a key persists is if a refund can't confirm.
//
// UNTESTED IN THIS ENV — validate with XAO_CONFIG.mock=true in a browser first, then a small live job.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import {
  makeContractCall, makeSTXTokenTransfer, broadcastTransaction, callReadOnlyFunction,
  uintCV, standardPrincipalCV, bufferCV, stringAsciiCV, listCV,
  makeStandardSTXPostCondition, FungibleConditionCode, PostConditionMode, AnchorMode,
  cvToJSON, getAddressFromPrivateKey, TransactionVersion,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const cfg: any = (window as any).XAO_CONFIG || {};
const MOCK: boolean = !!cfg.mock;
const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CORE_NAME: string = cfg.core || 'xtrata-v3-2-3';
const CORE: [string, string] = [DEPLOYER, CORE_NAME];
const CHUNK = 16384, SINGLE_MAX = 32, BATCH = 32;
const HIRO_BASE: string = cfg.hiro || '/hiro';                 // same-origin proxy
const AGENT_FEE_PCT = BigInt(cfg.agentFeePct ?? 10);
const AGENT_FEE_ADDRESS: string = cfg.agentFeeAddress || DEPLOYER;
export const WINDOW_MS: number = Number(cfg.windowMs || 300000); // commence/stall window
const PERTX_MINER = 30000n, DELIVERY_RESERVE = 200000n, REFUND_TX_FEE = 5000n, MINT_CAP = 2000000n, RECEIPT_EST = 9000;

const network: any = new StacksMainnet();
network.coreApiUrl = location.origin + HIRO_BASE;   // routes read-only + broadcast through the proxy

const enc = new TextEncoder();
const hfetch = (p: string, init?: any) => fetch(location.origin + HIRO_BASE + p, init);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const chunkBytes = (d: Uint8Array) => { const o: Uint8Array[] = []; for (let i = 0; i < d.length; i += CHUNK) o.push(d.slice(i, i + CHUNK)); return o; };
const incHash = (chunks: Uint8Array[]) => { let h = new Uint8Array(32); for (const c of chunks) { const m = new Uint8Array(h.length + c.length); m.set(h, 0); m.set(c, h.length); h = sha256(m); } return h; };

function deriveFrom(mnemonic: string) {
  const c = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic.trim())).derive("m/44'/5757'/0'/0/0");
  const key = bytesToHex(c.privateKey as Uint8Array) + '01';
  return { key, address: getAddressFromPrivateKey(key, TransactionVersion.Mainnet) };
}
function newWallet() { const mnemonic = generateMnemonic(wordlist, 256); return { mnemonic, ...deriveFrom(mnemonic) }; }

async function ro(fn: string, args: any[] = []) {
  return cvToJSON(await callReadOnlyFunction({ contractAddress: CORE[0], contractName: CORE[1], functionName: fn, functionArgs: args, senderAddress: DEPLOYER, network } as any));
}
async function balance(addr: string): Promise<bigint> { const d = await (await hfetch(`/extended/v1/address/${addr}/stx`)).json(); return BigInt(d.balance || '0'); }
async function quoteFee(sizeBytes: number, chunks: number) {
  if (MOCK) return { single: chunks <= SINGLE_MAX, protocolFee: 100000n + BigInt(chunks) * 2000n, batches: Math.max(1, Math.ceil(chunks / SINGLE_MAX)) };
  const single = chunks <= SINGLE_MAX;
  const t: any = (await ro('quote-inscription-fee', [uintCV(BigInt(sizeBytes)), uintCV(BigInt(chunks)), uintCV(single ? 2 : 1)])).value.value;
  return { single, protocolFee: BigInt(t['total-fee'].value), batches: Number(t['upload-batches'].value) };
}
async function waitTx(txid: string) {
  for (let i = 0; i < 120; i++) { try { const d = await (await hfetch(`/extended/v1/tx/${txid}`)).json(); if (d.tx_status === 'success') return d; if (d.tx_status && String(d.tx_status).startsWith('abort')) throw new Error('TX ' + d.tx_status); } catch (e: any) { if (String(e).includes('TX abort')) throw e; } await sleep(8000); }
  throw new Error('not confirmed: ' + txid);
}
async function getIdByHash(h: Uint8Array) { const j: any = await ro('get-id-by-hash', [bufferCV(h)]); return j.value ? String(j.value.value) : null; }
async function ownerOf(id: string) { try { const o: any = await ro('get-owner', [uintCV(BigInt(id))]); const v = o.value && o.value.value; return v ? (v.value ?? v) : null; } catch { return null; } }

// ---- signed sends (browser) ----
async function send(key: string, from: string, fn: string, args: any[], spendCap: bigint | null) {
  const post = spendCap != null ? [makeStandardSTXPostCondition(from, FungibleConditionCode.LessEqual, spendCap)] : [];
  const tx: any = await makeContractCall({ contractAddress: CORE[0], contractName: CORE[1], functionName: fn, functionArgs: args, senderKey: key, network, postConditionMode: PostConditionMode.Deny, postConditions: post, anchorMode: AnchorMode.Any } as any);
  const fee = BigInt(tx.auth.spendingCondition.fee.toString());
  if (fee > MINT_CAP) throw new Error(`${fn} fee ${fee} exceeds cap`);
  const res: any = await broadcastTransaction(tx, network); if (res.error) throw new Error(`${fn}: ${res.error} ${res.reason || ''}`);
  const txid = res.txid || res; const d = await waitTx(txid); return { txid, d };
}
async function sendNft(key: string, from: string, id: string, to: string) {
  const tx: any = await makeContractCall({ contractAddress: CORE[0], contractName: CORE[1], functionName: 'transfer', functionArgs: [uintCV(BigInt(id)), standardPrincipalCV(from), standardPrincipalCV(to)], senderKey: key, network, postConditionMode: PostConditionMode.Allow, anchorMode: AnchorMode.Any } as any);
  const res: any = await broadcastTransaction(tx, network); if (res.error) throw new Error('nft: ' + res.error); const txid = res.txid || res; await waitTx(txid); return txid;
}
async function sendStx(key: string, amount: bigint, to: string, fee: bigint) {
  const tx: any = await makeSTXTokenTransfer({ recipient: to, amount, senderKey: key, network, fee, anchorMode: AnchorMode.Any } as any);
  const res: any = await broadcastTransaction(tx, network); if (res.error) throw new Error('stx: ' + res.error); const txid = res.txid || res; await waitTx(txid); return txid;
}
const tidFrom = (d: any) => { const r = d?.tx_result?.repr || ''; const m = /token-id u(\d+)/.exec(r) || /\(ok u(\d+)\)/.exec(r); return m ? m[1] : null; };

// ---- mint paths ----
async function mintSingle(key: string, from: string, data: Uint8Array, mime: string, uri: string, deps: string[], spendCap: bigint) {
  const chunks = chunkBytes(data); const h = incHash(chunks);
  const depCV = (deps || []).map((d) => uintCV(BigInt(d)));
  const fn = depCV.length ? 'mint-single-tx-recursive' : 'mint-single-tx';
  const args: any[] = [bufferCV(h), stringAsciiCV(mime), uintCV(BigInt(data.length)), listCV(chunks.map((c) => bufferCV(c))), stringAsciiCV(uri)];
  if (depCV.length) args.push(listCV(depCV));
  const { d } = await send(key, from, fn, args, spendCap);
  return tidFrom(d) || (await getIdByHash(h));
}
async function stagedInscribe(job: any, key: string, from: string, data: Uint8Array, onProg: (m: string) => void) {
  const chunks = chunkBytes(data); const total = chunks.length; const h = incHash(chunks);
  const existing = await getIdByHash(h); if (existing) { onProg(`already inscribed #${existing}`); return existing; }
  const q: any = (await ro('quote-inscription-fee', [uintCV(BigInt(data.length)), uintCV(BigInt(total)), uintCV(1)])).value.value;
  const beginFee = BigInt(q['begin-fee'].value), sealFee = BigInt(q['seal-fee'].value);
  onProg(`planned · ${total} chunks`);
  let idx: number | null = null;
  try { const st: any = (await ro('get-upload-state', [bufferCV(h), standardPrincipalCV(from)])); idx = st.value ? Number(st.value.value['current-index'].value) : null; } catch { idx = null; }
  if (idx === null) { await send(key, from, 'begin-or-get', [bufferCV(h), stringAsciiCV(job.mime), uintCV(BigInt(data.length)), uintCV(BigInt(total))], beginFee); idx = 0; onProg(`upload started · 0/${total}`); }
  while (idx < total) { const batch = chunks.slice(idx, idx + BATCH); await send(key, from, 'add-chunk-batch', [bufferCV(h), listCV(batch.map((c) => bufferCV(c)))], null); const st: any = (await ro('get-upload-state', [bufferCV(h), standardPrincipalCV(from)])); const ni = st.value ? Number(st.value.value['current-index'].value) : null; if (ni === null || ni <= idx) throw new Error(`upload stalled at ${idx}`); idx = ni; onProg(`uploading · ${idx}/${total}`); }
  const deps = (job.deps || []).map((d: string) => uintCV(BigInt(d)));
  const sealFn = deps.length ? 'seal-recursive' : 'seal-inscription';
  const sealArgs: any[] = deps.length ? [bufferCV(h), stringAsciiCV(job.uri), listCV(deps)] : [bufferCV(h), stringAsciiCV(job.uri)];
  const { d } = await send(key, from, sealFn, sealArgs, sealFee); onProg('sealed'); return tidFrom(d) || (await getIdByHash(h));
}

// ============================================================================
// REMAINING — implement per site-integration/CLIENT-PORT.md (port from svc/core.mjs):
//   estimate(), buildReceiptHtml() [success+refunded], deliverAndReceipt(),
//   refundAndClose() [failure receipt + sweep + discard], localStorage job-state
//   (+ resume-or-refund on reload, file bytes kept in an in-memory Map), the
//   in-browser watcher (auto-run funded fast-track) + reaper (stall/expiry refund),
//   and full MOCK paths. Wire them into window.XtrataAgent below.
// ============================================================================
const TODO = (n: string): never => { throw new Error('XtrataAgent.' + n + ' not implemented yet — see site-integration/CLIENT-PORT.md'); };
(window as any).XtrataAgent = {
  health: async () => ({ ok: true, mock: MOCK, core: CORE_NAME, net: 'mainnet', windowMs: WINDOW_MS }),
  estimate: async (_opts: any) => TODO('estimate'),     // {file|bytes, marginUstx} -> {protocolFee,receiptProtocol,minerReserve,agentFeeUstx,requiredUstx,single,chunks,batches}
  createJob: async (_opts: any) => TODO('createJob'),   // {file:File, uri, mime, deps, user?, marginUstx, fastTrack} -> publicJob
  listJobs: async () => TODO('listJobs'),               // -> [{...job, funded, balanceUstx}]
  getJob: async (_id: string) => TODO('getJob'),        // -> {job, status}
  runJob: async (_id: string) => TODO('runJob'),        // start inscribe (background)
  deliverJob: async (_id: string) => TODO('deliverJob'),// start deliver (background)
};
// helpers already ported and available to the implementer/tester:
export { deriveFrom, newWallet, balance, quoteFee, mintSingle, stagedInscribe, getIdByHash, ownerOf, send, sendNft, sendStx, network, MOCK, CORE, DEPLOYER, AGENT_FEE_PCT, AGENT_FEE_ADDRESS, CHUNK, SINGLE_MAX, PERTX_MINER, DELIVERY_RESERVE, REFUND_TX_FEE, RECEIPT_EST, incHash, chunkBytes };
