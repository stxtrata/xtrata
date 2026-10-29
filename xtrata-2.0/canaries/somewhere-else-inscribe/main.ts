// "Somewhere Else" inscriber canary. Takes the frozen article all the way on chain with NO wallet prompts:
//   1. a temporary wallet is created in this browser (its key is saved to a file first)
//   2. you fund it from any wallet or exchange, by hand, with the amount the page shows
//   3. it inscribes the 24 WebP images one by one
//   4. it builds the article HTML with each image's new inscription ID, and inscribes it
//   5. it builds the reader (loader) pinned to the article's ID and hash, and inscribes it
//   6. it reads all 26 back from the chain and re-checks every byte
//   7. it transfers all 26 inscriptions to YOUR wallet, then sweeps the leftover STX to it too
// Mainnet only. The chain is the memory: every step re-reads it and never re-sends something that is already there.
import { sha256 } from '@noble/hashes/sha256';
import {
  AnchorMode, bufferCV, ClarityType, createAssetInfo, cvToString, FungibleConditionCode, getAddressFromPrivateKey, listCV, makeContractCall,
  makeRandomPrivKey, makeSTXTokenTransfer, makeStandardNonFungiblePostCondition, makeStandardSTXPostCondition, NonFungibleConditionCode,
  PostConditionMode, privateKeyToString, standardPrincipalCV, stringAsciiCV, TransactionVersion, uintCV, validateStacksAddress, type ClarityValue, type StacksTransaction
} from '@stacks/transactions';
import { Chain, toHex } from '../collection-v17/chain';
import { buildArticle, buildLoader, LOADER_DEFAULTS, type Asset } from './article';

declare const __BUILD__: string;
declare const __CFG__: string;
declare const __FILES__: string;
declare const __PINS__: string;

type Man = Asset & { file: string; mime: string; sha256: string };
type Cfg = { core: string; resolver: string; tokenUri: string; ownerPin?: string; feeMult: number; nodes: string[] };
const CFG: Cfg = JSON.parse(__CFG__);
const FILES = JSON.parse(__FILES__) as { source: string; loaderTpl: string; manifest: Man[]; webp: string[] };
const PINS = JSON.parse(__PINS__) as { assetsSha: string; sourceSha: string; loaderSha: string };
const NET = 'mainnet' as const;
const [CORE_ADDR, CORE_NAME] = CFG.core.split('.');
const ASSET_NAME = 'xtrata-inscription';
const CHUNK = 16384;
const MIN_FEE = 5000;
const TAIL = 140_000n; // kept back while inscribing so the hand-over and sweep can always be paid

// ---------- tiny DOM helpers ----------
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector(sel) as T;
type Child = Node | string | null | undefined | false | Child[];
const el = (tag: string, attrs: Record<string, any> = {}, ...children: Child[]) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v === true ? '' : v);
  }
  const add = (c: Child) => { if (Array.isArray(c)) c.forEach(add); else if (c !== null && c !== undefined && c !== false) node.append(typeof c === 'string' ? document.createTextNode(c) : c); };
  children.forEach(add);
  return node;
};
const stx = (micro: bigint | string | number) => `${(Number(micro) / 1e6).toLocaleString(undefined, { maximumFractionDigits: 6 })} STX`;
const short = (s: string) => (s && s.length > 18 ? `${s.slice(0, 8)}…${s.slice(-6)}` : s);
const enc = (text: string) => new TextEncoder().encode(text);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const bare = (hex: string) => hex.replace(/^0x/, '').toLowerCase();
const hexBytes = (hex: string) => Uint8Array.from(bare(hex).match(/../g)!.map((h) => parseInt(h, 16)));
const b64Bytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const shaHex = (b: Uint8Array) => toHex(sha256(b));

// ---------- chunking + rolling hash, identical to the Xtrata core (h0 = 32 zero bytes; h = sha256(h || chunk)) ----------
const chunkBytes = (bytes: Uint8Array) => { const out: Uint8Array[] = []; for (let i = 0; i < bytes.length; i += CHUNK) out.push(bytes.slice(i, i + CHUNK)); return out; };
const rolling = (chunks: Uint8Array[]) => { let h: Uint8Array = new Uint8Array(32); for (const c of chunks) { const b = new Uint8Array(32 + c.length); b.set(h); b.set(c, 32); h = sha256(b); } return toHex(h); };

// ---------- clarity unwrapping ----------
const inner = (cv: ClarityValue): ClarityValue => {
  let v: any = cv;
  for (let i = 0; i < 6; i++) {
    if (v.type === ClarityType.ResponseErr) throw new Error(`contract returned ${cvToString(v)}`);
    if (v.type === ClarityType.ResponseOk || v.type === ClarityType.OptionalSome) { v = v.value; continue; }
    break;
  }
  return v;
};
const asText = (cv: ClarityValue): string => {
  const v: any = inner(cv);
  switch (v.type) {
    case ClarityType.UInt: case ClarityType.Int: return BigInt(v.value).toString();
    case ClarityType.BoolTrue: return 'true';
    case ClarityType.BoolFalse: return 'false';
    case ClarityType.StringASCII: case ClarityType.StringUTF8: return v.data;
    case ClarityType.OptionalNone: return 'none';
    case ClarityType.Buffer: return toHex(v.buffer);
    default: return cvToString(v).replace(/^"|"$/g, '');
  }
};
const asBig = (cv: ClarityValue) => BigInt(asText(cv));
const field = (cv: ClarityValue, key: string) => (inner(cv) as any).data[key] as ClarityValue;
const isNone = (cv: ClarityValue) => (cv as any).type === ClarityType.OptionalNone;

// ---------- the files this canary inscribes ----------
type Item = { key: string; label: string; bytes: Uint8Array; mime: string; hash: string; chunks: number };
const IMG = FILES.webp.map(b64Bytes);
const MAN = FILES.manifest;
const mkItem = (key: string, label: string, bytes: Uint8Array, mime: string): Item => {
  const ch = chunkBytes(bytes);
  return { key, label, bytes, mime, hash: rolling(ch), chunks: ch.length };
};
const slotKey = (slot: number) => `image-${String(slot).padStart(2, '0')}`;
const imageItem = (i: number) => mkItem(slotKey(MAN[i].slot), `image ${MAN[i].slot} of ${MAN.length}`, IMG[i], MAN[i].mime);
const IMAGE_ITEMS = MAN.map((_, i) => imageItem(i));

// ---------- state (a cache only: the chain is the memory) ----------
type TxRec = { step: string; label: string; txid: string; status: string; result?: string; pass?: boolean; block?: number };
type StepState = { status: 'todo' | 'running' | 'pass' | 'fail'; note?: string };
type State = {
  version: 1; owner: string; tokenUri: string; feeMult: number; keySaved: boolean;
  ids: Record<string, number>; hashes: Record<string, string>;
  steps: Record<string, StepState>; txs: TxRec[]; log: { t: string; level: string; msg: string; txid?: string }[]; report?: string;
};
const chain = new Chain(NET);
let state!: State;
let busy = false;
const stateKey = () => 'xtrata-somewhere-else:v1';
const hotStorage = () => 'xtrata-somewhere-else:hot';
const freshState = (): State => ({ version: 1, owner: CFG.ownerPin || '', tokenUri: CFG.tokenUri, feeMult: CFG.feeMult, keySaved: false, ids: {}, hashes: {}, steps: {}, txs: [], log: [] });
const load = () => { try { const raw = localStorage.getItem(stateKey()); state = raw ? { ...freshState(), ...JSON.parse(raw) } : freshState(); } catch { state = freshState(); } };
const save = () => { try { localStorage.setItem(stateKey(), JSON.stringify(state)); } catch { /* storage unavailable */ } };
const step = (id: string): StepState => (state.steps[id] ??= { status: 'todo' });

const log = (level: 'info' | 'ok' | 'warn' | 'error', msg: string, txid?: string) => {
  const line = el('div', { class: `log-line ${level}` }, el('time', {}, new Date().toLocaleTimeString()), ' ', msg,
    txid ? [' ', el('a', { href: chain.txUrl(txid), target: '_blank', rel: 'noopener' }, short(txid))] : null);
  $('#log').prepend(line);
  state.log.unshift({ t: new Date().toISOString(), level, msg, txid });
  state.log = state.log.slice(0, 600);
  save();
  (level === 'error' ? console.warn : console.info)('[somewhere-else]', msg, txid ?? '');
};
const status = (text: string, tone: 'info' | 'ok' | 'warn' | 'error' = 'info') => { const s = $('#status'); s.textContent = text; s.dataset.tone = tone; };

// ---------- the temporary wallet ----------
const hotExists = () => { try { return !!localStorage.getItem(hotStorage()); } catch { return false; } };
const hotKey = (): string => {
  let key: string | null = null;
  try { key = localStorage.getItem(hotStorage()); } catch { /* ignore */ }
  if (!key) throw new Error('The temporary wallet has not been created yet (step 3).');
  return key;
};
const createHot = () => {
  if (hotExists()) return;
  let key = privateKeyToString(makeRandomPrivKey());
  if (key.length === 64) key += '01';
  try { localStorage.setItem(hotStorage(), key); } catch { throw new Error('This browser cannot store the temporary wallet key, so this canary cannot run here. Use a normal (non-private) window.'); }
};
const hotAddress = () => getAddressFromPrivateKey(hotKey(), TransactionVersion.Mainnet);
const keyFile = () => JSON.stringify({
  purpose: 'Temporary wallet for the "Somewhere Else" inscription canary', network: NET, address: hotAddress(), privateKey: hotKey(), owner: state.owner,
  note: 'This wallet is created and used by the canary page only. It holds the STX you fund it with and the 26 inscriptions until the page hands them to your wallet, then it is swept empty. Keep this file until the canary reports "Done" and your own wallet shows the inscriptions. Anyone holding it can spend what the wallet holds.'
}, null, 2);
const download = (name: string, text: string, type = 'application/json') => {
  const a = el('a', { href: URL.createObjectURL(new Blob([text], { type })), download: name }) as HTMLAnchorElement;
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};
const downloadKey = () => download(`somewhere-else-temp-wallet-${hotAddress().slice(0, 8)}.json`, keyFile());
const restoreKey = (text: string) => {
  let key = text.trim();
  try { const j = JSON.parse(key); if (j && typeof j.privateKey === 'string') key = j.privateKey; } catch { /* plain hex */ }
  if (!/^[0-9a-fA-F]{64}([0-9a-fA-F]{2})?$/.test(key)) throw new Error('That is not a private key (64 or 66 hex characters, or the saved key file).');
  if (key.length === 64) key += '01';
  const address = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
  if (hotExists() && hotAddress() !== address && state.txs.length) throw new Error(`This browser already has a temporary wallet (${hotAddress()}) with progress recorded. Forget local progress first if you really want to switch.`);
  localStorage.setItem(hotStorage(), key);
  return address;
};

// ---------- fees ----------
// The network floor is 1 micro-STX per byte; big transactions are priced at that floor times a multiplier (observed congestion on live
// uploads ran 1.0x to 2.9x the floor). Do NOT use /v2/fees/transfer here: it is the per-byte rate for plain transfers (24 on 2026-10-29).
const txFee = (size: number) => BigInt(Math.max(MIN_FEE, Math.ceil(size * state.feeMult)));
const OVERHEAD = 900; // transaction envelope, post-condition, function args other than the chunks
const estSize = (it: Item) => it.bytes.length + 5 * it.chunks + OVERHEAD + state.tokenUri.length;
const quoteFee = async (size: number, chunks: number) => asBig(field(await chain.read(CFG.core, 'quote-single-tx-fee', [uintCV(size), uintCV(chunks)]), 'total-fee'));

// ---------- chain reads ----------
const coreRead = (fn: string, args: ClarityValue[] = []) => chain.read(CFG.core, fn, args);
const findByHash = async (hash: string): Promise<number | null> => {
  const v = await coreRead('get-id-by-hash', [bufferCV(hexBytes(hash))]);
  return isNone(v) ? null : Number(asBig(v));
};
const metaOf = async (id: number) => {
  const v = await coreRead('get-inscription-meta', [uintCV(id)]);
  if (isNone(v)) return null;
  return { owner: asText(field(v, 'owner')), creator: asText(field(v, 'creator')), mime: asText(field(v, 'mime-type')), size: Number(asText(field(v, 'total-size'))),
    chunks: Number(asText(field(v, 'total-chunks'))), sealed: asText(field(v, 'sealed')) === 'true', hash: bare(asText(field(v, 'final-hash'))) };
};
const ownerOf = async (id: number) => asText(await coreRead('get-owner', [uintCV(id)]));
const checkMeta = async (id: number, it: Item) => {
  const m = await metaOf(id);
  if (!m) throw new Error(`#${id} (${it.label}) has no metadata on chain.`);
  const bad: string[] = [];
  if (!m.sealed) bad.push('not sealed');
  if (m.hash !== it.hash) bad.push('hash differs');
  if (m.size !== it.bytes.length) bad.push(`size ${m.size} ≠ ${it.bytes.length}`);
  if (m.chunks !== it.chunks) bad.push(`chunks ${m.chunks} ≠ ${it.chunks}`);
  if (m.mime !== it.mime) bad.push(`mime ${m.mime}`);
  if (bad.length) throw new Error(`#${id} (${it.label}) does not match the file: ${bad.join(', ')}.`);
  return m;
};
/** A confirmed tx can be indexed before the read node has it: re-read until the expected state appears (up to ~2 min). */
const eventually = async (what: string, check: () => Promise<string | null>, attempts = 30) => {
  let seen: string | null = null;
  for (let i = 0; i < attempts; i++) {
    try { seen = await check(); } catch (error) { seen = `read failed: ${error instanceof Error ? error.message : String(error)}`; }
    if (seen === null) return;
    status(`${what}: waiting for the chain to catch up (${(i + 1) * 4}s) · ${seen}`, 'warn');
    await sleep(4000);
  }
  throw new Error(`${what}: the chain still shows "${seen}" after ${attempts * 4}s. The transaction itself is confirmed; press the button again in a minute to re-check (nothing is re-sent).`);
};
const pool = async <T,>(items: T[], size: number, fn: (item: T, index: number) => Promise<void>) => {
  let next = 0;
  await Promise.all(Array.from({ length: size }, async () => { while (next < items.length) { const i = next++; await fn(items[i], i); } }));
};

// ---------- sending ----------
const HIRO = 'https://api.hiro.so';
/** Large transactions go to Hiro first (the proxy is the fallback); the txid is the same either way. */
const broadcast = async (tx: StacksTransaction) => {
  const raw = tx.serialize() as Uint8Array;
  let last = 'no node reachable';
  for (const base of [HIRO, ...chain.bases]) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch(`${base}/v2/transactions`, { method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: raw as unknown as BodyInit });
        const text = await r.text();
        if (r.status === 200) { const j = JSON.parse(text); const id = typeof j === 'string' ? j : j.txid; return id.startsWith('0x') ? id : `0x${id}`; }
        last = `${base}: ${r.status} ${text.slice(0, 300)}`;
        if (r.status === 429 || r.status >= 500) { await sleep(1500 * (attempt + 1)); continue; }
        break;
      } catch (e) { last = `${base}: ${e instanceof Error ? e.message : String(e)}`; await sleep(800); }
    }
  }
  throw new Error(`broadcast failed: ${last}`);
};
const uniq = (stepId: string, base: string) => `${base} (${state.txs.filter((t) => t.step === stepId && t.pass && t.label.startsWith(`${base} (`)).length + 1})`;
/** Sends once, remembers the txid, and on reload resumes waiting instead of re-sending. */
const runTx = async (stepId: string, label: string, send: () => Promise<string>) => {
  const done = state.txs.find((t) => t.label === label && t.pass);
  if (done) return done;
  let rec = state.txs.find((t) => t.label === label && !t.pass && t.status === 'pending');
  if (!rec) {
    const txid = await send();
    rec = { step: stepId, label, txid, status: 'pending' };
    state.txs.push(rec); save();
    log('info', `${label}: broadcast`, txid);
  }
  const tx = await chain.wait(rec.txid, (st, secs) => status(`${label} · ${st} · ${secs}s`));
  rec.status = tx.tx_status; rec.result = tx.tx_result?.repr ?? ''; rec.block = tx.block_height;
  rec.pass = tx.tx_status === 'success' && (!rec.result || rec.result.startsWith('(ok'));
  save();
  if (!rec.pass) {
    log('error', `${label}: ${tx.tx_status} ${rec.result}`, rec.txid);
    state.txs = state.txs.filter((t) => t !== rec); save();
    throw new Error(`${label} failed on chain: ${tx.tx_status} ${rec.result}. Nothing was inscribed by it; the miner fee was spent.`);
  }
  log('ok', `${label}: confirmed`, rec.txid);
  return rec;
};
const waitForFunds = async (target: bigint, why: string) => {
  const hot = hotAddress();
  const deadline = Date.now() + 20 * 60_000;
  for (;;) {
    const b = await chain.balance(hot);
    if (b >= target) return b;
    status(`Send ${stx(target - b)} (or a little more) to ${hot} — waiting for it to arrive (${why}; balance ${stx(b)})…`, 'warn');
    if (Date.now() > deadline) throw new Error(`Timed out waiting for ${stx(target - b)} to arrive at ${hot}. Send it, then press the button again; nothing is lost.`);
    await sleep(5000);
  }
};
const mintCall = (it: Item, nonce: bigint, fee: bigint, cap: bigint) => makeContractCall({
  contractAddress: CORE_ADDR, contractName: CORE_NAME, functionName: 'mint-single-tx',
  functionArgs: [bufferCV(hexBytes(it.hash)), stringAsciiCV(it.mime), uintCV(it.bytes.length), listCV(chunkBytes(it.bytes).map((c) => bufferCV(c))), stringAsciiCV(state.tokenUri)],
  senderKey: hotKey(), network: chain.stacks, nonce, fee, anchorMode: AnchorMode.Any,
  postConditionMode: PostConditionMode.Deny, postConditions: [makeStandardSTXPostCondition(hotAddress(), FungibleConditionCode.LessEqual, cap)]
});

/** Inscribes one file if its hash is not already on chain; returns the inscription ID either way. */
const mintItem = async (stepId: string, it: Item): Promise<number> => {
  const have = await findByHash(it.hash);
  if (have !== null) { await checkMeta(have, it); state.ids[it.key] = have; state.hashes[it.key] = it.hash; save(); return have; }
  if (it.chunks > 32) throw new Error(`${it.label} has ${it.chunks} chunks; a single transaction takes at most 32.`);
  const protocol = await quoteFee(it.bytes.length, it.chunks);
  await runTx(stepId, `inscribe ${it.label}`, async () => {
    const hot = hotAddress();
    const nonce = await chain.nonce(hot);
    const size = (await mintCall(it, nonce, 0n, protocol)).serialize().length;
    const fee = txFee(size);
    await waitForFunds(fee + protocol + TAIL, `${it.label}: miner fee ${stx(fee)} + protocol fee ${stx(protocol)}`);
    return broadcast(await mintCall(it, nonce, fee, protocol));
  });
  let id = 0;
  await eventually(`${it.label}`, async () => { const f = await findByHash(it.hash); if (f === null) return 'not indexed yet'; id = f; return null; });
  await checkMeta(id, it);
  state.ids[it.key] = id; state.hashes[it.key] = it.hash; save();
  return id;
};

// ---------- the article and the loader, built from the IDs on chain ----------
const imageIds = (): number[] => IMAGE_ITEMS.map((it) => {
  const id = state.ids[it.key];
  if (id === undefined) throw new Error(`${it.label} has not been inscribed yet.`);
  return id;
});
const articleItem = (): Item => mkItem('article', 'the article', enc(buildArticle(FILES.source, MAN, imageIds(), CFG.resolver)), 'text/html');
const loaderItem = (): Item => {
  const id = state.ids.article, hash = state.hashes.article;
  if (id === undefined || !hash) throw new Error('The article has not been inscribed yet.');
  return mkItem('loader', 'the reader', enc(buildLoader(FILES.loaderTpl,
    { contract: CFG.core, articleId: id, articleHash: hash, nodes: CFG.nodes, timeoutMs: LOADER_DEFAULTS.timeoutMs, batch: LOADER_DEFAULTS.batch, parallel: LOADER_DEFAULTS.parallel, parallelImages: LOADER_DEFAULTS.parallelImages },
    CFG.resolver)), 'text/html');
};
/** Rebuilds the whole ID chain from the chain alone (images -> article -> loader), so progress survives a cleared browser. */
const discover = async () => {
  for (const it of IMAGE_ITEMS) { const id = await findByHash(it.hash); if (id !== null) { state.ids[it.key] = id; state.hashes[it.key] = it.hash; } }
  if (IMAGE_ITEMS.every((it) => state.ids[it.key] !== undefined)) {
    const a = articleItem(); const aid = await findByHash(a.hash);
    if (aid !== null) {
      state.ids.article = aid; state.hashes.article = a.hash;
      const l = loaderItem(); const lid = await findByHash(l.hash);
      if (lid !== null) { state.ids.loader = lid; state.hashes.loader = l.hash; }
    }
  }
  save();
};
const allKeys = () => [...IMAGE_ITEMS.map((i) => i.key), 'article', 'loader'];
const labelOf = (key: string) => IMAGE_ITEMS.find((i) => i.key === key)?.label ?? (key === 'article' ? 'the article' : 'the reader');

// ---------- cost plan ----------
type Plan = { need: bigint; miner: bigint; protocol: bigint; transfers: bigint; files: number };
const TRANSFER_EST = 5000n;
const SWEEP_EST = 5000n;
const planCost = async (): Promise<Plan> => {
  await discover();
  const todo: Item[] = IMAGE_ITEMS.filter((it) => state.ids[it.key] === undefined);
  // the article and reader are about the size of the real ones; build with placeholder IDs so the estimate does not need the images yet
  const placeholder = (n: number) => Array.from({ length: n }, (_, i) => 900000 + i);
  if (state.ids.article === undefined) todo.push(mkItem('article', 'the article', enc(buildArticle(FILES.source, MAN, placeholder(MAN.length), CFG.resolver)), 'text/html'));
  if (state.ids.loader === undefined) todo.push(mkItem('loader', 'the reader', enc(buildLoader(FILES.loaderTpl,
    { contract: CFG.core, articleId: 900100, articleHash: '0'.repeat(64), nodes: CFG.nodes, timeoutMs: 20000, batch: 16, parallel: 2, parallelImages: 3 }, CFG.resolver)), 'text/html'));
  let miner = 0n, protocol = 0n;
  for (const it of todo) { miner += txFee(estSize(it)); protocol += await quoteFee(it.bytes.length, it.chunks); }
  // transfers still to make: everything about to be inscribed, plus anything already on chain that your wallet does not hold yet
  ownerAddr();
  let toMove = todo.length;
  for (const k of allKeys()) { const id = state.ids[k]; if (id !== undefined && (await ownerOf(id)) === (hotExists() ? hotAddress() : '')) toMove++; }
  const pendingTransfers = toMove > 0 || todo.length > 0 ? BigInt(toMove) * TRANSFER_EST + SWEEP_EST : 0n;
  const need = todo.length === 0 && toMove === 0 ? 0n : ((miner + pendingTransfers) * 115n) / 100n + protocol + 100_000n;
  return { need, miner, protocol, transfers: pendingTransfers, files: todo.length };
};

// ---------- steps ----------
type Step = { id: string; title: string; who: string; intro: string; action: string; run: () => Promise<string | void> };
const ownerAddr = () => {
  const o = state.owner.trim();
  if (!validateStacksAddress(o) || !o.startsWith('SP') || o.includes('.')) throw new Error('Enter your Stacks mainnet address (starts with SP, no contract name), and the same again in the confirm box.');
  return o;
};
const handover = async (stepId: string, partial = false) => {
  const owner = ownerAddr(); const hot = hotAddress();
  await discover();
  const keys = allKeys().filter((k) => state.ids[k] !== undefined);
  if (!partial && keys.length !== allKeys().length) throw new Error('Not everything has been inscribed yet.');
  let moved = 0, already = 0, foreign = 0;
  for (const key of keys) {
    const id = state.ids[key];
    const cur = await ownerOf(id);
    if (cur === owner) { already++; continue; }
    if (cur !== hot) { foreign++; log('warn', `#${id} (${labelOf(key)}) is held by ${cur}, which is neither the temporary wallet nor your wallet, so it was not moved.`); continue; }
    await runTx(stepId, uniq(stepId, `transfer #${id} (${labelOf(key)})`), async () => {
      const nonce = await chain.nonce(hot);
      const make = (fee: bigint) => makeContractCall({
        contractAddress: CORE_ADDR, contractName: CORE_NAME, functionName: 'transfer', functionArgs: [uintCV(id), standardPrincipalCV(hot), standardPrincipalCV(owner)],
        senderKey: hotKey(), network: chain.stacks, nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny,
        postConditions: [makeStandardNonFungiblePostCondition(hot, NonFungibleConditionCode.Sends, createAssetInfo(CORE_ADDR, CORE_NAME, ASSET_NAME), uintCV(id))]
      });
      const fee = txFee((await make(0n)).serialize().length);
      await waitForFunds(fee + SWEEP_EST, `transferring #${id}`);
      return broadcast(await make(fee));
    });
    await eventually(`Owner of #${id}`, async () => ((await ownerOf(id)) === owner ? null : 'not yet'));
    moved++;
  }
  return `${moved} transferred, ${already} already with your wallet${foreign ? `, ${foreign} held by others` : ''}`;
};
const sweep = async (stepId: string) => {
  const owner = ownerAddr(); const hot = hotAddress();
  for (let i = 0; (await chain.pendingCount(hot)) > 0; i++) { if (i > 120) throw new Error('The temporary wallet still has transactions waiting; try again in a minute.'); status('Waiting for pending transactions to confirm before the sweep…'); await sleep(5000); }
  const balance = await chain.balance(hot);
  const nonce = await chain.nonce(hot);
  const make = (amount: bigint, fee: bigint) => makeSTXTokenTransfer({ recipient: owner, amount, senderKey: hotKey(), network: chain.stacks, nonce, fee, memo: 'somewhere else sweep', anchorMode: AnchorMode.Any });
  const fee = txFee((await make(1n, 0n)).serialize().length);
  if (balance <= fee) return `nothing worth sweeping (${stx(balance)} left, below the ${stx(fee)} fee)`;
  const amount = balance - fee;
  await runTx(stepId, uniq(stepId, `sweep ${stx(amount)} to your wallet`), async () => broadcast(await make(amount, fee)));
  await eventually('Sweep', async () => { const b = await chain.balance(hot); return b === 0n ? null : `${stx(b)} still in the temporary wallet`; });
  return `swept ${stx(amount)} to ${short(owner)}; the temporary wallet is empty`;
};
const readBack = async (id: number, it: Item) => {
  const idx = Array.from({ length: it.chunks }, (_, i) => i);
  const parts: Uint8Array[] = [];
  const batches: number[][] = [];
  for (let i = 0; i < idx.length; i += 16) batches.push(idx.slice(i, i + 16));
  const got: Uint8Array[][] = [];
  await pool(batches, 2, async (b, n) => {
    const v: any = inner(await coreRead('get-chunk-batch', [uintCV(id), listCV(b.map((x) => uintCV(x)))]));
    const list = (v.list ?? []) as any[];
    if (list.length !== b.length) throw new Error(`#${id}: asked for ${b.length} chunks, got ${list.length}.`);
    got[n] = list.map((c) => { const x: any = inner(c); if (!x?.buffer) throw new Error(`#${id}: a chunk is missing.`); return x.buffer as Uint8Array; });
  });
  for (const g of got) parts.push(...g);
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
  if (out.length !== it.bytes.length) throw new Error(`#${id}: read back ${out.length} bytes, expected ${it.bytes.length}.`);
  if (rolling(chunkBytes(out)) !== it.hash) throw new Error(`#${id}: read-back hash differs from the file.`);
  if (shaHex(out) !== shaHex(it.bytes)) throw new Error(`#${id}: read-back bytes differ from the file.`);
};

const STEPS: Step[] = [
  {
    id: 'owner', title: 'Your wallet', who: 'You type it in',
    intro: 'The address that receives all 26 inscriptions and every leftover STX. Type it above and again in the confirm box. Double-check it: a wrong address cannot be undone.',
    action: 'Confirm my address',
    run: async () => {
      const o = ownerAddr();
      if (CFG.ownerPin && o !== CFG.ownerPin) throw new Error(`This build only sends to ${CFG.ownerPin}.`);
      if (($('#owner2') as HTMLInputElement).value.trim() !== o) throw new Error('The confirm box does not match the address.');
      if (!confirm(`Everything goes to:\n\n${o}\n\nThe 26 inscriptions and all leftover STX. Is this your own wallet, copied exactly?`)) throw new Error('Cancelled.');
      return `all inscriptions and leftover STX go to ${o}`;
    }
  },
  {
    id: 'preflight', title: 'Preflight: files, core, cost', who: 'Reads only',
    intro: 'Checks that the 24 images, the article source and the reader template are exactly the pinned files, that the Xtrata core is open, what is already on chain from an earlier run, and the cost: miner fees, Xtrata protocol fees and the margin.',
    action: 'Run preflight',
    run: async () => {
      if (shaHex(enc(FILES.source)) !== PINS.sourceSha) throw new Error('The embedded article source is not the pinned one. Rebuild the canary.');
      if (shaHex(enc(FILES.loaderTpl)) !== PINS.loaderSha) throw new Error('The embedded reader template is not the pinned one. Rebuild the canary.');
      const joined: string[] = [];
      for (let i = 0; i < MAN.length; i++) {
        const m = MAN[i], b = IMG[i];
        if (b.length !== m.bytes || shaHex(b) !== m.sha256 || IMAGE_ITEMS[i].hash !== m.rolling) throw new Error(`Image ${m.slot} does not match its manifest entry.`);
        if (!(m.mime === 'image/webp')) throw new Error(`Image ${m.slot} has mime ${m.mime}.`);
        if (IMAGE_ITEMS[i].chunks > 32) throw new Error(`Image ${m.slot} is over 32 chunks.`);
        joined.push(m.sha256);
      }
      if (shaHex(enc(joined.join('\n'))) !== PINS.assetsSha) throw new Error('The image set is not the pinned one. Rebuild the canary.');
      if (asText(await coreRead('is-paused')) === 'true') throw new Error('The Xtrata core is paused right now.');
      if (!/^https:\/\//.test(state.tokenUri) || state.tokenUri.length > 256) throw new Error('The token URI must be an https address of at most 256 characters.');
      const plan = await planCost();
      const have = hotExists() ? await chain.balance(hotAddress()) : 0n;
      const shortfall = plan.need > have ? plan.need - have : 0n;
      const onChain = allKeys().filter((k) => state.ids[k] !== undefined).length;
      return `files verified · ${onChain} of ${allKeys().length} already on chain · ${plan.files} to inscribe · miner fees about ${stx(plan.miner)} (1 µSTX/byte × ${state.feeMult}) + protocol fees ${stx(plan.protocol)} + hand-over ${stx(plan.transfers)}`
        + ` · FUND ${stx(shortfall)} (includes a 15% margin; whatever is not spent is swept back)`;
    }
  },
  {
    id: 'wallet', title: 'Create the temporary wallet', who: 'This page',
    intro: 'Creates a fresh wallet in this browser and downloads its key file. Keep that file until the run says Done. It signs everything, so you are never asked to approve a transaction.',
    action: 'Create wallet and save key',
    run: async () => {
      const first = !hotExists();
      createHot();
      downloadKey();
      if (first || !state.keySaved) {
        if (!confirm(`The key file for ${hotAddress()} has just been downloaded.\n\nOpen your Downloads folder and check it is there before you continue. Is it saved somewhere safe?`)) throw new Error('Save the key file first, then press the button again.');
      }
      state.keySaved = true; save();
      return `temporary wallet ${hotAddress()} · key file saved`;
    }
  },
  {
    id: 'fund', title: 'Fund the temporary wallet', who: 'You send STX',
    intro: 'Send the amount from the preflight (or a little more) from any wallet or exchange to the address shown above. The page watches for it. Only send STX, only to this address.',
    action: 'Wait for funds',
    run: async () => {
      if (!state.keySaved) throw new Error('Save the key file first (step 3).');
      const plan = await planCost();
      const have = await chain.balance(hotAddress());
      if (plan.need <= 0n) return 'nothing left to pay for';
      await waitForFunds(plan.need, `target ${stx(plan.need)}`);
      return `funded: ${stx(await chain.balance(hotAddress()))} in ${hotAddress()} (needed ${stx(plan.need)}; had ${stx(have)} when checked)`;
    }
  },
  {
    id: 'images', title: 'Inscribe the 24 images', who: 'Temporary wallet',
    intro: 'One at a time, in document order: look up the file by its hash first (anything already on chain is reused, never re-sent), otherwise inscribe it and wait for confirmation. Each result is checked against the file.',
    action: 'Inscribe images',
    run: async () => {
      let n = 0;
      for (const it of IMAGE_ITEMS) {
        const id = await mintItem('images', it);
        n++;
        status(`${it.label}: #${id} · ${n}/${IMAGE_ITEMS.length}`, 'ok');
        renderSteps();
      }
      return `${IMAGE_ITEMS.length} images on chain: ${IMAGE_ITEMS.map((i) => `#${state.ids[i.key]}`).join(' ')}`;
    }
  },
  {
    id: 'article', title: 'Build and inscribe the article', who: 'Temporary wallet',
    intro: 'Builds the article HTML with each image pointing at its new inscription ID and carrying its hash, then inscribes it.',
    action: 'Inscribe article',
    run: async () => {
      const it = articleItem();
      const id = await mintItem('article', it);
      return `article #${id} · ${it.bytes.length.toLocaleString()} bytes · ${it.chunks} chunks · hash ${it.hash.slice(0, 16)}…`;
    }
  },
  {
    id: 'loader', title: 'Build and inscribe the reader', who: 'Temporary wallet',
    intro: 'Builds the chain-first reader pinned to the article\'s ID and hash, then inscribes it. This is the link that gets shared.',
    action: 'Inscribe reader',
    run: async () => {
      const it = loaderItem();
      const id = await mintItem('loader', it);
      return `reader #${id} · ${it.bytes.length.toLocaleString()} bytes · ${it.chunks} chunk(s) · ${CFG.resolver.replace('{id}', String(id))}`;
    }
  },
  {
    id: 'verify', title: 'Read everything back from the chain', who: 'Reads only',
    intro: 'Reads all 26 inscriptions back through the contract and recomputes every hash and byte, then checks that the article points at the 24 image IDs and the reader at the article.',
    action: 'Verify on chain',
    run: async () => {
      const items = [...IMAGE_ITEMS, articleItem(), loaderItem()];
      let done = 0;
      await pool(items, 2, async (it) => {
        const id = state.ids[it.key];
        if (id === undefined) throw new Error(`${it.label} is not inscribed.`);
        await checkMeta(id, it);
        await readBack(id, it);
        status(`Verified ${++done}/${items.length}`);
      });
      const html = new TextDecoder().decode(items[items.length - 2].bytes);
      const refs = [...html.matchAll(/data-ins="(\d+)"/g)].map((m) => Number(m[1]));
      if (refs.length !== IMAGE_ITEMS.length || refs.some((r, i) => r !== state.ids[IMAGE_ITEMS[i].key])) throw new Error('The article does not reference the 24 image IDs in order.');
      const ldr = new TextDecoder().decode(items[items.length - 1].bytes);
      if (!ldr.includes(`"articleId": ${state.ids.article}`) || !ldr.includes(state.hashes.article)) throw new Error('The reader is not pinned to the article.');
      let live = 'resolver not checked';
      try { const r = await fetch(CFG.resolver.replace('{id}', String(state.ids.loader)), { method: 'GET', mode: 'cors' }); live = `resolver answered ${r.status}`; } catch { live = 'resolver could not be reached from this page (not required)'; }
      return `all ${items.length} read back and identical to the files · article references the 24 images · reader pinned to article #${state.ids.article} · ${live}`;
    }
  },
  {
    id: 'handover', title: 'Hand the inscriptions to your wallet', who: 'Temporary wallet',
    intro: 'Transfers each of the 26 inscriptions from the temporary wallet to your wallet, one transaction each, with a post-condition that only that one inscription can leave.',
    action: 'Transfer to my wallet',
    run: () => handover('handover')
  },
  {
    id: 'sweep', title: 'Sweep the leftover STX', who: 'Temporary wallet',
    intro: 'Sends everything the temporary wallet still holds (minus the sweep fee) to your wallet, leaving it empty.',
    action: 'Sweep to my wallet',
    run: () => sweep('sweep')
  },
  {
    id: 'report', title: 'Done: IDs and next edits', who: 'Reads only',
    intro: 'Confirms that your wallet owns all 26 and the temporary wallet is empty, then prints the IDs, the reader link and what to change in the documents.',
    action: 'Build report',
    run: async () => {
      const owner = ownerAddr();
      const others: string[] = [];
      for (const k of allKeys()) {
        const o = await ownerOf(state.ids[k]);
        if (o === owner) continue;
        if (hotExists() && o === hotAddress()) throw new Error(`#${state.ids[k]} (${labelOf(k)}) is still in the temporary wallet. Run the hand-over again.`);
        others.push(`#${state.ids[k]} (${labelOf(k)}) held by ${o}`);
      }
      const left = hotExists() ? await chain.balance(hotAddress()) : 0n;
      const link = CFG.resolver.replace('{id}', String(state.ids.loader));
      const lines = [
        `READER (share this)  ${link}`, `ARTICLE              #${state.ids.article}  hash ${state.hashes.article}`, `READER INSCRIPTION   #${state.ids.loader}  hash ${state.hashes.loader}`, '',
        'IMAGES (document order)', ...IMAGE_ITEMS.map((it, i) => `  ${String(MAN[i].slot).padStart(2)}  #${state.ids[it.key]}  ${CFG.resolver.replace('{id}', String(state.ids[it.key]))}`), '',
        others.length ? `NOT OWNED BY YOU (an identical file was already on chain before this run, so it was reused): ${others.join('; ')}` : `OWNER of all ${allKeys().length}: ${owner}`, `CREATOR recorded on chain: ${hotAddress()} (the temporary wallet)`, `Temporary wallet balance: ${stx(left)}`, '',
        'NEXT: replace [LOADER] in the hook package, the plan doc and the launch posts with the reader link above; keep ids.json with the audit package; keep the temporary key file until you have seen the 26 inscriptions in your wallet.'
      ];
      state.report = lines.join('\n'); save();
      return `${allKeys().length - others.length} of ${allKeys().length} owned by your wallet${others.length ? ` (${others.length} reused from others)` : ''} · temporary wallet holds ${stx(left)}`;
    }
  }
];

// ---------- rendering ----------
const unlocked = (index: number) => STEPS.slice(0, index).every((s) => step(s.id).status === 'pass');
const renderSteps = () => {
  $('#steps').replaceChildren(...STEPS.map((s, i) => {
    const st = step(s.id);
    const open = unlocked(i);
    const tone = st.status === 'pass' ? 'success' : st.status === 'fail' ? 'error' : st.status === 'running' ? 'warning' : '';
    const txs = state.txs.filter((t) => t.step === s.id);
    const text = s.id === 'report' ? state.report : null;
    return el('section', { class: `step${open ? '' : ' locked'}` },
      el('div', { class: 'step__head' },
        el('span', { class: 'step__number' }, String(i + 1)),
        el('div', {}, el('h2', {}, s.title), el('p', { class: 'who' }, s.who)),
        el('span', { class: 'badge', 'data-tone': tone }, st.status === 'todo' ? (open ? 'ready' : 'locked') : st.status)),
      el('div', { class: 'step__body' },
        el('p', {}, s.intro),
        st.note ? el('p', { class: `note ${st.status}` }, st.note) : null,
        txs.length ? el('ul', { class: 'txs' }, txs.map((t) => el('li', {}, `${t.label} — ${t.status}${t.pass ? ' ✓' : ''} `, el('a', { href: chain.txUrl(t.txid), target: '_blank', rel: 'noopener' }, short(t.txid))))) : null,
        text ? el('textarea', { readonly: true, onclick: (e: Event) => (e.target as HTMLTextAreaElement).select() }, text) : null,
        el('div', { class: 'actions' },
          el('button', { class: 'button', type: 'button', 'data-step': s.id, disabled: !open || busy, onclick: () => void execute(s) }, st.status === 'pass' ? `Re-check · ${s.action}` : s.action),
          text ? el('button', { class: 'button ghost', type: 'button', onclick: () => void navigator.clipboard?.writeText(text) }, 'Copy') : null,
          s.id === 'report' && st.status === 'pass' ? el('button', { class: 'button ghost', type: 'button', onclick: () => download('somewhere-else-ids.json', idsJson()) }, 'Download ids.json') : null)));
  }));
};
const idsJson = () => JSON.stringify({
  article: 'Somewhere Else', core: CFG.core, owner: state.owner, creator: hotExists() ? hotAddress() : null, build: __BUILD__, tokenUri: state.tokenUri,
  reader: { id: state.ids.loader, hash: state.hashes.loader, url: CFG.resolver.replace('{id}', String(state.ids.loader)) },
  articleInscription: { id: state.ids.article, hash: state.hashes.article },
  images: IMAGE_ITEMS.map((it, i) => ({ slot: MAN[i].slot, id: state.ids[it.key], hash: it.hash, bytes: it.bytes.length, sha256: MAN[i].sha256 })),
  transactions: state.txs.map((t) => ({ label: t.label, txid: t.txid, block: t.block }))
}, null, 2);
const execute = async (s: Step) => {
  if (busy) return;
  busy = true;
  const st = step(s.id);
  st.status = 'running'; st.note = undefined; save(); renderSteps();
  status(`${s.title}…`);
  try {
    const note = await s.run();
    st.status = 'pass'; st.note = note || 'passed';
    log('ok', `${s.title}: ${st.note}`);
    status(`${s.title}: passed`, 'ok');
  } catch (error) {
    st.status = 'fail'; st.note = error instanceof Error ? error.message : String(error);
    log('error', `${s.title}: ${st.note}`);
    status(`${s.title}: ${st.note}`, 'error');
  } finally {
    busy = false; save(); renderSteps(); renderHeader();
  }
};
const renderHeader = async () => {
  const started = state.txs.length > 0 || step('wallet').status === 'pass';
  const owner = $('#owner') as HTMLInputElement; owner.value = state.owner; owner.disabled = started || !!CFG.ownerPin;
  ($('#owner2') as HTMLInputElement).disabled = started;
  const uri = $('#token-uri') as HTMLInputElement; uri.value = state.tokenUri; uri.disabled = state.txs.length > 0;
  const mult = $('#fee-mult') as HTMLInputElement; mult.value = String(state.feeMult);
  const hotEl = $('#hot');
  if (!hotExists()) { hotEl.textContent = 'not created yet (step 3)'; return; }
  hotEl.textContent = hotAddress();
  try { $('#hotbal').textContent = stx(await chain.balance(hotAddress())); } catch { $('#hotbal').textContent = 'could not check'; }
};
const mutate = async (label: string, fn: () => Promise<string | void>) => {
  if (busy) return;
  busy = true; renderSteps();
  try { const note = await fn(); log('ok', `${label}: ${note || 'done'}`); status(`${label}: ${note || 'done'}`, 'ok'); }
  catch (e) { const m = e instanceof Error ? e.message : String(e); log('error', `${label}: ${m}`); status(`${label}: ${m}`, 'error'); }
  finally { busy = false; renderSteps(); void renderHeader(); }
};
const bind = () => {
  $('#build').textContent = `${__BUILD__} · ${MAN.length} images · assets ${PINS.assetsSha.slice(0, 12)}… · core ${CFG.core}`;
  const owner = $('#owner') as HTMLInputElement;
  owner.addEventListener('input', () => { state.owner = owner.value.trim(); save(); });
  $('#token-uri').addEventListener('change', (e) => { state.tokenUri = (e.target as HTMLInputElement).value.trim(); save(); });
  $('#fee-mult').addEventListener('change', (e) => {
    const v = Number((e.target as HTMLInputElement).value);
    if (!(v >= 1 && v <= 10)) { status('The fee multiplier must be between 1 and 10.', 'error'); void renderHeader(); return; }
    state.feeMult = v; save();
  });
  $('#copyaddr').addEventListener('click', () => { if (hotExists()) void navigator.clipboard?.writeText(hotAddress()); });
  $('#savekey').addEventListener('click', () => { if (!hotExists()) { status('No temporary wallet has been created yet.', 'warn'); return; } downloadKey(); });
  $('#restorekey').addEventListener('click', () => {
    const text = prompt('Paste the temporary wallet key (the hex, or the whole saved key file):');
    if (!text) return;
    try { const a = restoreKey(text); log('ok', `Restored temporary wallet ${a}.`); state.keySaved = true; save(); void renderHeader(); renderSteps(); }
    catch (e) { status(e instanceof Error ? e.message : String(e), 'error'); }
  });
  $('#rescue').addEventListener('click', () => {
    if (!confirm('Send everything this temporary wallet holds to your wallet now?\n\nAll inscriptions it owns are transferred, then the leftover STX is swept. Nothing else is inscribed.')) return;
    void mutate('Send everything to my wallet', async () => { const a = await handover('rescue', true); const b = await sweep('rescue'); return `${a}; ${b}`; });
  });
  $('#forgetpending').addEventListener('click', () => {
    const n = state.txs.filter((t) => !t.pass).length;
    state.txs = state.txs.filter((t) => t.pass); save(); renderSteps(); log('info', `Forgot ${n} pending transaction record(s). The chain is re-checked before anything is sent again.`);
  });
  $('#export').addEventListener('click', () => download(`somewhere-else-report-${Date.now()}.json`, JSON.stringify({ ...state, build: __BUILD__, config: CFG, pins: PINS, temporaryWallet: hotExists() ? hotAddress() : null }, null, 2)));
  $('#forget').addEventListener('click', () => {
    if (!confirm('Forget local progress? Nothing on chain changes: the page re-reads the chain and resumes from what is already there, and sends nothing that is already inscribed. The temporary wallet key is kept in this browser either way.')) return;
    try { localStorage.removeItem(stateKey()); } catch { /* ignore */ }
    load(); restoreLog(); void renderHeader(); renderSteps(); status('Local progress cleared.', 'ok');
  });
  window.addEventListener('beforeunload', (e) => { if (busy) { e.preventDefault(); e.returnValue = ''; } });
};
const restoreLog = () => {
  $('#log').replaceChildren(...state.log.map((l) => el('div', { class: `log-line ${l.level}` }, el('time', {}, new Date(l.t).toLocaleTimeString()), ' ', l.msg,
    l.txid ? [' ', el('a', { href: chain.txUrl(l.txid), target: '_blank', rel: 'noopener' }, short(l.txid))] : null)));
};

// ---------- boot ----------
load();
for (const s of Object.values(state.steps)) if (s.status === 'running') s.status = 'todo';
bind(); restoreLog(); void renderHeader(); renderSteps();
setInterval(() => { if (!busy) void renderHeader(); }, 20000);
