/* eslint-disable @typescript-eslint/no-explicit-any */
// chain-io.ts: the real-chain implementation of the large-token engine's `io` object.
//
// Reads and broadcasts go through the same-origin Hiro proxy (/hiro/mainnet; the API key stays server-side).
// Everything here follows the lessons written into Agent One (src/agent-one/agent-core.ts):
//  * a failed read THROWS, it never returns an empty answer that looks like "nothing there"
//  * balance uses the v2 endpoint (the v1 one is throttled)
//  * the payer is found from /transactions first, stx_inbound only as a backstop
//  * transactions are built at the node's LOW fee estimate; replacement happens in the engine
//  * a native STX transfer to the sender itself is rejected by the node, so the engine never sends one
import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import {
  makeContractCall, makeSTXTokenTransfer, broadcastTransaction, callReadOnlyFunction,
  estimateTransaction, estimateTransactionByteLength,
  uintCV, standardPrincipalCV, bufferCV, stringAsciiCV, listCV,
  makeStandardSTXPostCondition, makeStandardNonFungiblePostCondition, createAssetInfo,
  FungibleConditionCode, NonFungibleConditionCode, PostConditionMode, AnchorMode,
  cvToJSON, getAddressFromPrivateKey, TransactionVersion
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

export interface ChainIoOptions {
  hiroBase?: string;                 // default /hiro/mainnet
  core: string;                      // SP….xtrata-v3-2-3
  assetName: string;                 // xtrata-inscription
  helper: string;                    // SP….forever-twin-<collection>
  mismatch?: () => string | null;    // the page's registry-vs-chain check
  refetchBytes?: (job: any) => Promise<Uint8Array | null>;
}

const fromHex = (h: string) => new Uint8Array((h.replace(/^0x/i, '').match(/../g) || []).map((x) => parseInt(x, 16)));
const errMsg = (e: any) => String((e && e.message) || e);
const api = (message: string, extra: any = {}) => Object.assign(new Error(message), { kind: 'API' }, extra);

// Worker timers are exempt from background-tab throttling (same trick as Agent One), so confirmation polling
// keeps its pace when the visitor switches tabs while a job runs.
let sleepSeq = 0; const sleepWaiters = new Map<number, () => void>();
const sleepWorker: Worker | null = (() => {
  try {
    const w = new Worker(URL.createObjectURL(new Blob(['onmessage=(e)=>setTimeout(()=>postMessage(e.data.id),e.data.ms)'], { type: 'text/javascript' })));
    w.onmessage = (e: MessageEvent) => { const r = sleepWaiters.get(e.data); if (r) { sleepWaiters.delete(e.data); r(); } };
    return w;
  } catch { return null; }
})();
const sleep = (ms: number) => new Promise<void>((r) => { if (sleepWorker) { const id = ++sleepSeq; sleepWaiters.set(id, r); sleepWorker.postMessage({ id, ms }); } else setTimeout(r, ms); });

export function deriveFrom(mnemonic: string) {
  const c = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic.trim())).derive("m/44'/5757'/0'/0/0");
  const key = bytesToHex(c.privateKey as Uint8Array) + '01';
  return { key, address: getAddressFromPrivateKey(key, TransactionVersion.Mainnet) };
}

// ---- job + file-byte storage (browser only) ---------------------------------------------------------------
const JOB_PREFIX = 'xtrata.ftlarge.job.';
export const jobStore = {
  get(id: string) { try { const s = localStorage.getItem(JOB_PREFIX + id); return s ? JSON.parse(s) : null; } catch { return null; } },
  set(id: string, j: any) { localStorage.setItem(JOB_PREFIX + id, JSON.stringify(j)); },
  list(): any[] {
    const out: any[] = [];
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(JOB_PREFIX)) { try { out.push(JSON.parse(localStorage.getItem(k) as string)); } catch { /* skip */ } } } } catch { /* storage blocked */ }
    return out.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }
};
const idb = () => new Promise<IDBDatabase>((res, rej) => {
  const r = indexedDB.open('xtrata-ft-large', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('files');
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
});
const idbPut = async (k: string, v: Uint8Array) => { const db = await idb(); await new Promise<void>((res, rej) => { const t = db.transaction('files', 'readwrite'); t.objectStore('files').put(v, k); t.oncomplete = () => res(); t.onerror = () => rej(t.error); }); db.close(); };
const idbGet = async (k: string): Promise<Uint8Array | null> => { const db = await idb(); const v = await new Promise<any>((res, rej) => { const q = db.transaction('files').objectStore('files').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); db.close(); return v ? new Uint8Array(v) : null; };
const idbDel = async (k: string) => { try { const db = await idb(); db.transaction('files', 'readwrite').objectStore('files').delete(k); db.close(); } catch { /* best effort */ } };

// ---- the io object -----------------------------------------------------------------------------------------
export function createChainIo(o: ChainIoOptions) {
  const base = o.hiroBase || '/hiro/mainnet';
  const hfetch = (p: string, init?: any) => fetch(location.origin + base + p, init);
  const [coreAddr, coreName] = o.core.split('.');
  const network: any = new StacksMainnet();
  network.coreApiUrl = location.origin + base;
  const keys = new Map<string, string>();                      // wizard address -> key, filled by newWallet/registerWallet
  let lodCache: boolean | null = null;

  const plain = (j: any): any => {
    if (j == null) return null;
    const t = String(j.type || '');
    if (t.startsWith('(tuple')) { const out: any = {}; for (const [k, v] of Object.entries(j.value || {})) out[k] = plain(v); return out; }
    if (t.startsWith('(optional')) return j.value == null ? null : plain(j.value);
    if (t.startsWith('(response')) return plain(j.value);
    if (t.startsWith('(list')) return (j.value || []).map(plain);
    return j.value;
  };
  async function ro(contract: string, fn: string, args: any[] = []) {
    const [a, n] = contract.split('.');
    const run = () => callReadOnlyFunction({ contractAddress: a, contractName: n, functionName: fn, functionArgs: args, senderAddress: coreAddr, network } as any);
    let res: any;
    try { res = await run(); } catch (e) { await sleep(600); try { res = await run(); } catch (e2) { throw api(`${fn}: read failed (${errMsg(e2)})`); } }
    return cvToJSON(res);
  }

  // ---- CV encoding of the engine's neutral call description ----
  const cv = (a: any) => {
    if (a.t === 'uint') return uintCV(BigInt(a.v));
    if (a.t === 'buff') return bufferCV(fromHex(a.hex));
    if (a.t === 'ascii') return stringAsciiCV(a.v);
    if (a.t === 'list-buff') return listCV(a.bytes.map((b: Uint8Array) => bufferCV(b)));
    throw new Error(`unknown argument type ${a.t}`);
  };
  async function build(call: any, from: string, fee: bigint, nonce: bigint | undefined, spendCap: bigint | null) {
    const key = keys.get(from);
    if (!key) throw new Error('the job wallet key is not loaded in this tab');
    if (call.kind === 'stx') return makeSTXTokenTransfer({ recipient: call.to, amount: BigInt(call.amount), senderKey: key, network, fee, anchorMode: AnchorMode.Any, nonce } as any);
    if (call.kind === 'nft') {
      return makeContractCall({ contractAddress: coreAddr, contractName: coreName, functionName: 'transfer', functionArgs: [uintCV(BigInt(call.id)), standardPrincipalCV(from), standardPrincipalCV(call.to)],
        senderKey: key, network, fee, nonce, postConditionMode: PostConditionMode.Allow, anchorMode: AnchorMode.Any } as any);
    }
    const target = call.kind === 'helper' ? o.helper : o.core;
    const [ta, tn] = target.split('.');
    const pcs: any[] = [];
    if (spendCap != null) pcs.push(makeStandardSTXPostCondition(from, FungibleConditionCode.LessEqual, spendCap));
    if (call.nft) pcs.push(makeStandardNonFungiblePostCondition(from, NonFungibleConditionCode.Sends, createAssetInfo(coreAddr, coreName, o.assetName), uintCV(BigInt(call.nft.id))));
    return makeContractCall({ contractAddress: ta, contractName: tn, functionName: call.fn, functionArgs: call.args.map(cv), senderKey: key, network, fee, nonce,
      postConditionMode: PostConditionMode.Deny, postConditions: pcs, anchorMode: AnchorMode.Any } as any);
  }
  const lowEstimate = async (draft: any): Promise<bigint | null> => {
    try { const est: any = await estimateTransaction(draft.payload, estimateTransactionByteLength(draft), network); return est && est[0] && est[0].fee != null ? BigInt(est[0].fee) : null; } catch { return null; }
  };

  const io: any = {
    now: () => Date.now(),
    sleep,
    sha256: (u: Uint8Array) => sha256(u),
    newWallet() { const mnemonic = generateMnemonic(wordlist, 256); const w = deriveFrom(mnemonic); keys.set(w.address, w.key); return { mnemonic, address: w.address }; },
    registerWallet(mnemonic: string) { const w = deriveFrom(mnemonic); keys.set(w.address, w.key); return w.address; },

    async balance(addr: string): Promise<bigint> {
      const r = await hfetch(`/extended/v2/addresses/${addr}/balances/stx`);
      if (!r.ok) throw api(`balance lookup failed (HTTP ${r.status})`);
      const d: any = await r.json();
      if (d == null || d.balance == null) throw api('balance lookup returned no balance');
      return BigInt(d.balance);
    },
    async coreQuote(bytes: number, chunks: number) {
      const j: any = await ro(o.core, 'quote-inscription-fee', [uintCV(BigInt(bytes)), uintCV(BigInt(chunks)), uintCV(1n)]);
      const t = plain(j);
      if (!t || t['total-fee'] == null) throw api('the core did not return a fee quote');
      return { begin: BigInt(t['begin-fee']), seal: BigInt(t['seal-fee']), total: BigInt(t['total-fee']), batches: BigInt(t['upload-batches']) };
    },
    async helperFee(addr?: string): Promise<bigint> {
      const j: any = addr ? await ro(o.helper, 'fee-for', [standardPrincipalCV(addr)]) : await ro(o.helper, 'get-fee', []);
      const v = plain(j); if (v == null) throw api('the helper did not return its fee');
      return BigInt(typeof v === 'object' ? v.ok ?? v.value ?? 0 : v);
    },
    async congestionX10(): Promise<bigint> {
      // How far above the 1 µSTX/byte floor the node's LOW estimate currently is, for a sample transaction.
      try {
        const key = bytesToHex(crypto.getRandomValues(new Uint8Array(32))) + '01';
        const draft: any = await makeContractCall({ contractAddress: coreAddr, contractName: coreName, functionName: 'seal-inscription',
          functionArgs: [bufferCV(new Uint8Array(32)), stringAsciiCV('x'.repeat(60))], senderKey: key, network, fee: 1n, nonce: 0n, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Allow } as any);
        const low = await lowEstimate(draft);
        const len = BigInt(estimateTransactionByteLength(draft));
        if (low == null || len === 0n) return 10n;
        const x10 = (low * 10n + len - 1n) / len;
        return x10 < 10n ? 10n : x10 > 400n ? 400n : x10;
      } catch { return 10n; }
    },
    async helperReady() {
      const j: any = await ro(o.helper, 'is-finalized', []);
      const fin = plain(j);
      if (lodCache == null) {
        const r = await hfetch(`/v2/contracts/interface/${o.helper.split('.')[0]}/${o.helper.split('.')[1]}`);
        if (!r.ok) throw api(`helper interface lookup failed (HTTP ${r.status})`);
        const d: any = await r.json();
        lodCache = Array.isArray(d.functions) && d.functions.some((f: any) => f.name === 'inscribe-large');
      }
      return { finalized: fin === true || fin === 'true' || (fin && fin.ok === true), lod: lodCache, mismatch: o.mismatch ? o.mismatch() || undefined : undefined };
    },
    async canonical(token: string) {
      const t = plain(await ro(o.helper, 'get-canonical', [uintCV(BigInt(token))]));
      if (!t) return null;
      return { hash: t['content-hash'], totalSize: Number(t['total-size']), mime: t.mime, tokenUri: t['token-uri'] };
    },
    async binding(token: string) {
      const t = plain(await ro(o.helper, 'get-binding', [uintCV(BigInt(token))]));
      return t ? { xtrataId: String(t['xtrata-id']), escrowed: t['xtrata-escrowed'] === true, inscriber: t.inscriber } : null;
    },
    async uploadState(hash: string, owner: string) {
      const t = plain(await ro(o.core, 'get-upload-state', [bufferCV(fromHex(hash)), standardPrincipalCV(owner)]));
      return t && t['current-index'] != null ? { index: Number(t['current-index']) } : null;
    },
    async held(addr: string): Promise<string[]> {
      const asset = `${o.core}::${o.assetName}`; const ids: string[] = []; let offset = 0;
      for (;;) {
        const r = await hfetch(`/extended/v1/tokens/nft/holdings?principal=${addr}&asset_identifiers=${encodeURIComponent(asset)}&limit=50&offset=${offset}`);
        if (!r.ok) throw api(`holdings lookup failed (HTTP ${r.status})`);
        const d: any = await r.json();
        if (!Array.isArray(d?.results)) throw api('holdings lookup returned no results');
        for (const x of d.results) { const m = /u?(\d+)/.exec((x.value && x.value.repr) || ''); if (m) ids.push(m[1]); }
        offset += d.results.length;
        if (d.results.length < 50 || offset >= Number(d.total || 0)) break;
      }
      return ids;
    },
    async inscriptionOwner(id: string): Promise<string | null> {
      const v = plain(await ro(o.core, 'get-owner', [uintCV(BigInt(id))]));
      return v ? String(typeof v === 'object' ? v.value ?? v : v) : null;
    },
    async pendingTxs(addr: string) {
      const r = await hfetch(`/extended/v1/address/${addr}/mempool?limit=50`);
      if (!r.ok) throw api(`mempool lookup failed (HTTP ${r.status})`);
      const d: any = await r.json();
      if (!Array.isArray(d?.results)) throw api('mempool lookup returned no results');
      return d.results.map((t: any) => ({ nonce: BigInt(t.nonce), fee: BigInt(t.fee_rate || 0), kind: t.contract_call ? t.contract_call.function_name : t.tx_type }))
        .sort((a: any, b: any) => (a.nonce < b.nonce ? -1 : a.nonce > b.nonce ? 1 : 0));
    },
    /** Everything ever sent to this address, in µSTX (Hiro's confirmed total). Throws if it cannot be read. */
    async totalReceived(addr: string): Promise<bigint> {
      const r = await hfetch(`/extended/v1/address/${addr}/stx`);
      if (!r.ok) throw api(`balance summary failed (HTTP ${r.status})`);
      const d: any = await r.json();
      if (d == null || d.total_received == null || !/^\d+$/.test(String(d.total_received))) throw api('balance summary had no total_received');
      return BigInt(String(d.total_received));
    },
    async funderOf(addr: string): Promise<string | null> {
      const top = (m: Map<string, bigint>) => { let best: string | null = null, amt = -1n; for (const [k, v] of m) if (v > amt) { best = k; amt = v; } return best; };
      try {
        const r = await hfetch(`/extended/v1/address/${addr}/transactions?limit=50`);
        if (!r.ok) throw new Error(String(r.status));
        const d: any = await r.json(); const totals = new Map<string, bigint>();
        for (const e of (d.results || [])) { const tx = e.tx || e; if (tx.token_transfer && tx.token_transfer.recipient_address === addr && tx.sender_address && tx.tx_status === 'success') { const a = BigInt(tx.token_transfer.amount || '0'); if (a > 0n) totals.set(tx.sender_address, (totals.get(tx.sender_address) || 0n) + a); } }
        if (totals.size) return top(totals);
      } catch { /* fall through to the backstop */ }
      try {
        const r = await hfetch(`/extended/v1/address/${addr}/stx_inbound?limit=50`);
        if (!r.ok) throw new Error(String(r.status));
        const d: any = await r.json(); const totals = new Map<string, bigint>();
        for (const e of (d.results || [])) { const a = BigInt(e.amount || '0'); if (e.sender && a > 0n) totals.set(e.sender, (totals.get(e.sender) || 0n) + a); }
        if (totals.size) return top(totals);
      } catch { /* none */ }
      return null;
    },
    async nextNonce(addr: string): Promise<bigint> {
      const r = await hfetch(`/extended/v1/address/${addr}/nonces`);
      if (!r.ok) throw api(`nonce lookup failed (HTTP ${r.status})`);
      const d: any = await r.json();
      if (d?.possible_next_nonce == null) throw api('nonce lookup returned no possible_next_nonce');
      return BigInt(d.possible_next_nonce);
    },
    async estimateLowFee(call: any, from: string): Promise<bigint | null> {
      try { return await lowEstimate(await build(call, from, 1n, 0n, null)); } catch { return null; }
    },
    async broadcast(call: any, p: { from: string; fee: bigint; nonce: bigint; spendCap: bigint | null }) {
      const tx: any = await build(call, p.from, p.fee, p.nonce, p.spendCap);
      const res: any = await broadcastTransaction(tx, network);
      if (res && res.error) {
        const text = `${res.error} ${res.reason || ''}`;
        throw Object.assign(new Error(text), { kind: /FeeTooLow/i.test(text) ? 'FEE_TOO_LOW' : 'REJECTED' });
      }
      return { txid: String(res.txid || res), nonce: p.nonce };
    },
    async txStatus(txid: string) {
      const r = await hfetch(`/extended/v1/tx/${String(txid).replace(/^0x/, '0x')}`);
      if (r.status === 404) return { state: 'pending' };                         // just broadcast, not indexed yet
      if (!r.ok) throw api(`tx lookup failed (HTTP ${r.status})`);
      const d: any = await r.json();
      const s = String(d.tx_status || '');
      const result = d.tx_result && d.tx_result.repr ? d.tx_result.repr : s;
      if (s === 'success') return { state: 'success', result };
      if (s.startsWith('abort')) return { state: 'abort', result: `${result} (${s})` };
      if (s.startsWith('dropped')) return { state: 'dropped', result: s };
      return { state: 'pending' };
    },
    async loadBytes(job: any) {
      try { const b = await idbGet(job.id); if (b) return b; } catch { /* fall through to a refetch */ }
      if (o.refetchBytes) { const b = await o.refetchBytes(job); if (b) { try { await idbPut(job.id, b); } catch { /* ok */ } return b; } }
      return null;
    },
    async saveBytes(job: any, bytes: Uint8Array) { try { await idbPut(job.id, bytes); } catch { /* the engine can refetch and re-verify */ } },
    async dropBytes(job: any) { await idbDel(job.id); }
  };
  return io;
}
