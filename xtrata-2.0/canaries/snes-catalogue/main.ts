/**
 * SNES game catalogue launch canary.
 *
 * Takes the on-chain SNES catalogue from nothing to a registered, emulator-tested state in the only safe order,
 * each step gated on the one before it and re-reading the chain instead of trusting this page:
 *
 *   deploy the catalogue (Clarity 4) -> verify it -> deploy the Xtrata adapter -> verify it reads the live core ->
 *   inscribe each game's ROM (and cover and icon) on Xtrata core v3.2.3 -> read every inscription back byte for byte ->
 *   a temporary wallet takes the admin role, registers the five games for your wallet (reader, publisher, add-game,
 *   transfer-game, add-version) and proves duplicate and wrong-size versions are refused -> admin goes back to your
 *   wallet -> a stranger is refused -> sweep the temporary wallet -> read the whole catalogue back from the chain ->
 *   load every game into the real emulator through the contract (and refuse a tampered ROM) -> load the same ROMs
 *   from "local files" and see them recognised by hash -> final audit.
 *
 * Wallet logic is the shared canary module (`../collection-v17/wallet.ts`, docs/WALLET-PLAYBOOK.md). Every call runs in
 * deny mode; calls that pay the core carry an exact-or-lower STX post-condition. Mainnet only: the adapter is written
 * for the live core.
 */
import { sha256 } from '@noble/hashes/sha256';
import {
  AnchorMode,
  boolCV,
  bufferCV,
  ClarityType,
  cvToString,
  FungibleConditionCode,
  getAddressFromPrivateKey,
  listCV,
  makeContractCall,
  makeRandomPrivKey,
  makeSTXTokenTransfer,
  makeStandardSTXPostCondition,
  makeUnsignedContractCall,
  makeUnsignedSTXTokenTransfer,
  noneCV,
  PostConditionMode,
  principalCV,
  privateKeyToString,
  someCV,
  stringAsciiCV,
  TransactionVersion,
  tupleCV,
  uintCV,
  type ClarityValue,
  type PostCondition,
  type StacksTransaction
} from '@stacks/transactions';
import CATALOGUE_SRC from '../../contracts/snes-game-catalogue/contracts/snes-game-catalogue-v1.clar';
import ADAPTER_SRC from '../../contracts/snes-game-catalogue/contracts/snes-xtrata-adapter-v3-2-3.clar';
import PACK from 'snes:pack';
import { Chain, toHex } from '../collection-v17/chain';
import * as wallet from '../collection-v17/wallet';
import { createWrapper, WrapperError } from './wrapper';
import type { Net, ProviderInfo } from '../collection-v17/wallet';

declare const __BUILD__: string;
declare const __BUILT_AT__: string;
declare const __CATALOGUE_SHA__: string;
declare const __ADAPTER_SHA__: string;
declare const __PACK_SHA__: string;

const NETWORK: Net = 'mainnet';
const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const CAT_NAME = 'snes-game-catalogue-v1';
const AD_NAME = 'snes-xtrata-adapter-v3-2-3';
/** Xtrata's standard token URI (same value the app and SDK use). */
const TOKEN_URI = 'https://xvgh3sbdkivby4blejmripeiyjuvji3d4tycym6hgaxalescegjq.arweave.net/vUx9yCNSKhxwKyJZFDyIwmlUo2Pk8CwzxzAuBZJCIZM';
const CHUNK = 16384;
const BATCH = 30; // the app and SDK cap staged uploads at 30 chunks per transaction
const SINGLE_MAX_CHUNKS = 32;
const READ_PER = 10; // chunks per read-only call (160 KB of response)
const TEMP_TX_FEE_FLOOR = 20_000n;
const SWEEP_TX_FEE = 20_000n; // the same 0.02 STX floor as every other transaction this page signs
const DEPLOY_FEE_ESTIMATE = 200_000n; // a 12 KB source; the wallet sets the real fee
const SAFETY_BUFFER = 500_000n;
const BAD_ID = 99_999_999n; // an inscription id that does not exist (adapter wiring probe)

type GameDef = (typeof PACK.games)[number];
const GAMES: GameDef[] = PACK.games;
const ROM_MIME = PACK.romMime;

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
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const stx = (micro: bigint | string | number) => `${(Number(micro) / 1e6).toLocaleString(undefined, { maximumFractionDigits: 6 })} STX`;
const short = (s: string) => (s && s.length > 18 ? `${s.slice(0, 8)}…${s.slice(-6)}` : s);
const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
const shaHex = (text: string) => toHex(sha256(new TextEncoder().encode(text)));
const hexBytes = (hex: string) => Uint8Array.from(hex.replace(/^0x/, '').match(/../g)!.map((h) => parseInt(h, 16)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64 = (b: Uint8Array) => { let s = ''; for (let i = 0; i < b.length; i += 0x4000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x4000) as unknown as number[]); return btoa(s); };
const concat = (a: Uint8Array, b: Uint8Array) => { const o = new Uint8Array(a.length + b.length); o.set(a, 0); o.set(b, a.length); return o; };
const joinBytes = (list: Uint8Array[]) => { const out = new Uint8Array(list.reduce((n, c) => n + c.length, 0)); let o = 0; for (const c of list) { out.set(c, o); o += c.length; } return out; };
const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));

// ---------- what gets inscribed, chunked the way the core hashes it ----------
/** The core's running hash: h0 = 32 zero bytes, h(i+1) = sha256(h(i) || chunk(i)). The final value is the upload's identity. */
const chainHash = (chunks: Uint8Array[]) => { let h: Uint8Array = new Uint8Array(32); for (const c of chunks) h = sha256(concat(h, c)); return h; };
/** The emulator's canonical ROM hash: drop a 512-byte copier header (size % 1024 == 512), then SHA-256. */
const canonical = (rom: Uint8Array) => (rom.length % 1024 === 512 ? rom.subarray(512) : rom);
const romSha = (rom: Uint8Array) => toHex(sha256(canonical(rom)));
type Kind = 'rom' | 'cover' | 'icon';
type Upload = { key: string; game: GameDef; kind: Kind; label: string; mime: string; bytes: Uint8Array; chunks: Uint8Array[]; hash: Uint8Array; sha: string };
const makeUpload = (game: GameDef, kind: Kind, mime: string, bytes: Uint8Array): Upload => {
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < bytes.length; i += CHUNK) chunks.push(bytes.subarray(i, Math.min(i + CHUNK, bytes.length)));
  return { key: `${game.slug}:${kind}`, game, kind, label: `${game.title} ${kind === 'rom' ? 'ROM' : kind}`, mime, bytes, chunks, hash: chainHash(chunks), sha: toHex(sha256(bytes)) };
};
const UPLOADS: Upload[] = GAMES.flatMap((g) => [
  makeUpload(g, 'rom', ROM_MIME, unb64(g.rom)),
  ...(g.cover ? [makeUpload(g, 'cover', 'image/png', unb64(g.cover))] : []),
  ...(g.icon ? [makeUpload(g, 'icon', 'image/png', unb64(g.icon))] : [])
]);
const uploadsOf = (g: GameDef) => UPLOADS.filter((u) => u.game === g);
const upload = (g: GameDef, kind: Kind) => UPLOADS.find((u) => u.game === g && u.kind === kind) ?? null;
const sigsFor = (u: Upload) => (u.chunks.length <= SINGLE_MAX_CHUNKS ? 1 : 2 + Math.ceil(u.chunks.length / BATCH));

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
const isNone = (cv: ClarityValue) => { let v: any = cv; while (v.type === ClarityType.ResponseOk) v = v.value; return v.type === ClarityType.OptionalNone; };
const asText = (cv: ClarityValue): string => {
  const v: any = inner(cv);
  switch (v.type) {
    case ClarityType.UInt: case ClarityType.Int: return BigInt(v.value).toString();
    case ClarityType.BoolTrue: return 'true';
    case ClarityType.BoolFalse: return 'false';
    case ClarityType.StringASCII: case ClarityType.StringUTF8: return v.data;
    case ClarityType.OptionalNone: return 'none';
    default: return cvToString(v);
  }
};
const tupleField = (cv: ClarityValue, key: string) => (inner(cv) as any).data[key] as ClarityValue;
const bufOf = (cv: ClarityValue): Uint8Array => { const v: any = inner(cv); return v.buffer ?? hexBytes(cvToString(v)); };
const optOf = (cv: ClarityValue): any | null => { const v: any = cv; return v.type === ClarityType.OptionalSome ? v.value : null; };

// ---------- state ----------
type TxRec = { label: string; txid: string; status: string; result?: string; pass?: boolean; block?: number };
type StepState = { status: 'todo' | 'running' | 'pass' | 'fail'; note?: string; data: Record<string, any>; txs: TxRec[] };
type State = {
  version: 1;
  deployer?: string;
  /** upload key (`slug:rom`, `slug:cover`, `slug:icon`) -> inscription id */
  ids: Record<string, string>;
  /** true when preflight found the whole launch already done and nothing of it ran here: one-time proofs are not repeated */
  alreadyLaunched?: boolean;
  steps: Record<string, StepState>;
  log: { t: string; level: string; msg: string; txid?: string }[];
};

let chain = new Chain(NETWORK);
let state!: State;
let connected: { address: string; publicKey: string | null; label: string } | null = null;
let busy = false;

// Progress is per release (the pinned pack), so a new set of games starts its own gated run.
const stateKey = () => `xtrata-snes-catalogue:v1:${NETWORK}:${__PACK_SHA__.slice(0, 12)}`;
const hotKeyName = () => `xtrata-snes-catalogue:hot:${NETWORK}`;
const freshState = (): State => ({ version: 1, ids: {}, steps: {}, log: [] });
const load = () => {
  try { const raw = localStorage.getItem(stateKey()); state = raw ? { ...freshState(), ...JSON.parse(raw) } : freshState(); } catch { state = freshState(); }
};
const save = () => { try { localStorage.setItem(stateKey(), JSON.stringify(state)); } catch { /* storage unavailable */ } };
const step = (id: string): StepState => (state.steps[id] ??= { status: 'todo', data: {}, txs: [] });
const catId = () => `${state.deployer}.${CAT_NAME}`;
const adId = () => `${state.deployer}.${AD_NAME}`;

const log = (level: 'info' | 'ok' | 'warn' | 'error', msg: string, txid?: string) => {
  const line = el('div', { class: `log-line ${level}` }, el('time', {}, new Date().toLocaleTimeString()), ' ', msg,
    txid ? [' ', el('a', { href: chain.txUrl(txid), target: '_blank', rel: 'noopener' }, short(txid))] : null);
  $('#log').prepend(line);
  state.log.unshift({ t: new Date().toISOString(), level, msg, txid });
  state.log = state.log.slice(0, 400);
  save();
  (level === 'error' ? console.warn : console.info)('[snes-catalogue]', msg, txid ?? '');
};
const status = (text: string, tone: 'info' | 'ok' | 'warn' | 'error' = 'info') => { const s = $('#status'); s.textContent = text; s.dataset.tone = tone; };

// ---------- the temporary wallet ----------
const hotKey = () => {
  let key: string | null = null;
  try { key = localStorage.getItem(hotKeyName()); } catch { /* ignore */ }
  if (!key) {
    key = privateKeyToString(makeRandomPrivKey());
    if (key.length === 64) key += '01';
    try { localStorage.setItem(hotKeyName(), key); } catch { /* ignore */ }
  }
  return key;
};
const hotAddress = () => getAddressFromPrivateKey(hotKey(), TransactionVersion.Mainnet);

// ---------- web-wallet actions ----------
const requireWallet = () => {
  if (!connected) throw new Error('Connect your wallet first (step 1).');
  if (state.deployer && connected.address !== state.deployer) throw new Error(`The wallet is connected as ${connected.address}, but this run belongs to ${state.deployer}. Switch accounts and reconnect.`);
  return connected;
};
const progress = (stage: string) => { if (['account-read', 'account-reconnect', 'signing-request'].includes(stage)) log('info', `wallet: ${stage.replace('-', ' ')}`); };
const settle = async (result: wallet.TxResult) => {
  if (result.txRaw && result.txRaw.length > 128) { try { await chain.broadcastRaw(result.txRaw); } catch { /* already known */ } }
  return result.txId;
};
const unsignedCall = async (target: string, fn: string, args: ClarityValue[], pcs: PostCondition[]) => {
  const w = requireWallet();
  const [address, name] = target.split('.');
  const nonce = await chain.nonce(w.address);
  const build = (fee: bigint) => makeUnsignedContractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
    publicKey: w.publicKey!, network: chain.stacks, nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: pcs });
  const size = (await build(20_000n)).serialize().length;
  return toHex((await build(BigInt(Math.max(20_000, Math.ceil(size * 1.1))))).serialize());
};
/** Deny mode always. Calls that move no STX pass no post-conditions; calls that pay the core pass an upper bound. */
const walletCall = async (target: string, fn: string, args: ClarityValue[], pcs: PostCondition[] = []) => {
  const w = requireWallet();
  const [address, name] = target.split('.');
  const result = await wallet.contractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
    postConditions: pcs, postConditionMode: PostConditionMode.Deny, network: NETWORK, stxAddress: w.address, onProgress: progress,
    buildUnsigned: w.publicKey ? () => unsignedCall(target, fn, args, pcs) : undefined });
  return settle(result);
};
const walletTransfer = async (recipient: string, amount: bigint, memo: string) => {
  const w = requireWallet();
  const result = await wallet.stxTransfer({ recipient, amount, memo, network: NETWORK, stxAddress: w.address, onProgress: progress,
    buildUnsigned: w.publicKey ? async () => {
      const nonce = await chain.nonce(w.address);
      return toHex((await makeUnsignedSTXTokenTransfer({ recipient, amount, memo, publicKey: w.publicKey!, network: chain.stacks, nonce, fee: 5_000n, anchorMode: AnchorMode.Any })).serialize());
    } : undefined });
  return settle(result);
};
const payAtMost = (amount: bigint) => [makeStandardSTXPostCondition(requireWallet().address, FungibleConditionCode.LessEqual, amount)];

/**
 * Sends once, remembers the txid, and on reload resumes waiting instead of re-sending.
 * `expect` = the exact failing result a step is designed to produce (e.g. "(err u101)").
 */
const runTx = async (stepId: string, label: string, send: () => Promise<string>, expect?: string) => {
  const s = step(stepId);
  const done = s.txs.find((t) => t.label === label && t.pass);
  if (done) return done;
  let rec = s.txs.find((t) => t.label === label && t.status === 'pending');
  if (!rec) {
    log('info', `${label}: waiting for signature…`);
    const txid = await send();
    rec = { label, txid, status: 'pending' };
    s.txs.push(rec); save();
    log('info', `${label}: broadcast`, txid);
  }
  const tx = await chain.wait(rec.txid, (st, secs) => status(`${label} · ${st} · ${secs}s`));
  rec.status = tx.tx_status; rec.result = tx.tx_result?.repr ?? ''; rec.block = tx.block_height;
  rec.pass = expect
    ? tx.tx_status === 'abort_by_response' && rec.result === expect
    : tx.tx_status === 'success' && !(rec.result ?? '').startsWith('(err');
  save();
  if (!rec.pass) {
    log('error', `${label}: ${tx.tx_status} ${rec.result}${expect ? ` (expected a refusal with ${expect})` : ''}`, rec.txid);
    s.txs = s.txs.filter((t) => t !== rec); save();
    throw new Error(`${label}: ${tx.tx_status} ${rec.result}${expect ? `, expected ${expect}` : ''}`);
  }
  log('ok', `${label}: ${expect ? 'refused as expected' : 'confirmed'} ${rec.result}`, rec.txid);
  return { ...rec, tx };
};
/** A label that stays the same while a transaction is pending (so a reload resumes) and changes once it has passed (so a later run sends again). */
const uniq = (stepId: string, base: string) => `${base} (${step(stepId).txs.filter((t) => t.pass && t.label.startsWith(`${base} (`)).length + 1})`;

/** The temporary wallet signs a call on the catalogue with its own key. Fee: twice the serialised size in micro-STX, floor 0.02 STX. */
const hotFeeFor = (tx: StacksTransaction) => { const n = BigInt(tx.serialize().length) * 2n; return n > TEMP_TX_FEE_FLOOR ? n : TEMP_TX_FEE_FLOOR; };
const hotCall = (stepId: string, label: string, fn: string, args: ClarityValue[], expect?: string) =>
  runTx(stepId, uniq(stepId, label), async () => {
    const hot = hotAddress();
    const [address, name] = catId().split('.');
    const nonce = await chain.nonce(hot);
    const mk = (fee: bigint) => makeContractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
      senderKey: hotKey(), network: chain.stacks, nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: [] });
    const tx = await mk(hotFeeFor(await mk(TEMP_TX_FEE_FLOOR)));
    return chain.broadcast(tx);
  }, expect);
/** Float for the temporary wallet: `calls` transactions at the fee floor, plus the sweep and a margin. */
const hotFloat = (calls: number) => TEMP_TX_FEE_FLOOR * BigInt(calls) + SWEEP_TX_FEE + 40_000n;
/**
 * Makes sure the temporary wallet holds at least `target`. Asks the connected wallet for exactly the difference; a wallet that
 * cannot sign a plain transfer from a web page (Xverse) gets the address and an amount to send by hand, and the canary waits
 * for it to arrive.
 */
const ensureHotFunds = async (stepId: string, target: bigint, what: string) => {
  const hot = hotAddress();
  const have = await chain.balance(hot);
  if (have < target) {
    const need = target - have;
    let sent = false;
    try {
      await runTx(stepId, uniq(stepId, `${what}: send ${stx(need)} to the temporary wallet`), () => walletTransfer(hot, need, 'snes catalogue canary'));
      sent = true;
    } catch (error) {
      const message = errText(error);
      if (/cancel/i.test(message) && !/not implemented/i.test(message)) throw error;
      log('warn', `The wallet could not sign the funding transfer from this page (${message}). Send it by hand instead.`);
    }
    if (!sent) {
      const deadline = Date.now() + 10 * 60_000;
      for (;;) {
        const b = await chain.balance(hot);
        if (b >= target) break;
        if (Date.now() > deadline) throw new Error(`Timed out waiting for ${stx(target - b)} to arrive at ${hot}. Send it from your wallet's own Send screen, then press the button again.`);
        status(`Send ${stx(target - b)} (or a little more) from your wallet to ${hot} — waiting for it to arrive (balance ${stx(b)})…`, 'warn');
        await sleep(5000);
      }
    }
  }
  await eventually('Temporary wallet funding', async () => { const b = await chain.balance(hot); return b >= target ? null : `balance ${stx(b)}`; });
  return chain.balance(hot);
};
/** Everything the temporary wallet still holds goes back to the deployer. */
const sweepHot = async (stepId: string) => {
  const hot = hotAddress();
  const balance = await chain.balance(hot);
  if (balance <= SWEEP_TX_FEE) return balance;
  await runTx(stepId, uniq(stepId, `sweep ${stx(balance - SWEEP_TX_FEE)}`), async () => {
    const nonce = await chain.nonce(hot);
    const tx = await makeSTXTokenTransfer({ recipient: state.deployer!, amount: balance - SWEEP_TX_FEE, senderKey: hotKey(), network: chain.stacks, nonce, fee: SWEEP_TX_FEE, memo: 'snes catalogue canary sweep', anchorMode: AnchorMode.Any });
    return chain.broadcast(tx);
  });
  return chain.balance(hot);
};
/** A backup copy of the temporary wallet's key, saved to disk before it is ever given the admin role. */
const downloadHotKey = () => {
  const blob = new Blob([JSON.stringify({ purpose: 'Xtrata SNES catalogue canary temporary wallet', network: NETWORK, address: hotAddress(), privateKey: hotKey(),
    note: 'Keep this file until the canary reports that the catalogue admin role is back with your wallet. Anyone holding it can act as the catalogue admin while the role is with this wallet.' }, null, 2)], { type: 'application/json' });
  const a = el('a', { href: URL.createObjectURL(blob), download: `xtrata-snes-catalogue-temp-wallet-${hotAddress().slice(0, 8)}.json` }) as HTMLAnchorElement;
  a.click(); URL.revokeObjectURL(a.href);
};

// ---------- reads ----------
const eventually = async (what: string, check: () => Promise<string | null>, attempts = 23) => {
  let seen: string | null = null;
  for (let i = 0; i < attempts; i++) {
    try { seen = await check(); } catch (error) { seen = `read failed: ${errText(error)}`; }
    if (seen === null) return;
    if (i === 0) log('info', `${what}: chain still shows ${seen}; waiting for it to catch up…`);
    status(`${what}: waiting for the chain to catch up (${(i + 1) * 4}s)…`, 'warn');
    await sleep(4000);
  }
  throw new Error(`${what}: the chain still shows ${seen} after 90s. The transaction itself is confirmed; press the button again in a minute to re-check (nothing is re-sent).`);
};
const readCat = (fn: string, args: ClarityValue[] = []) => chain.read(catId(), fn, args);
const readCore = (fn: string, args: ClarityValue[] = []) => chain.read(CORE, fn, args);
const getAdmin = async () => cvToString(inner(await readCat('get-admin')));
const getPending = async () => { const cv = await readCat('get-pending-admin'); return isNone(cv) ? null : cvToString(inner(cv)); };
const isPublisher = async (who: string) => asText(await readCat('is-publisher', [principalCV(who)])) === 'true';
const isReader = async (adapter: string) => asText(await readCat('is-reader', [principalCV(adapter)])) === 'true';
const gameIdBySlug = async (slug: string): Promise<number | null> => { const cv = await readCat('get-by-slug', [stringAsciiCV(slug)]); return isNone(cv) ? null : Number(asText(cv)); };
const ptr = (cv: any) => (cv.type === ClarityType.OptionalSome ? { core: cvToString(cv.value.data.core), id: BigInt(cv.value.data.id.value).toString() } : null);
type GameRow = { slug: string; title: string; owner: string; set: string; hidden: boolean; latest: number; versions: number; payout: string; licence: string; cover: { core: string; id: string } | null; icon: { core: string; id: string } | null };
const parseGame = (t: any): GameRow => {
  const d = t.data;
  return { slug: d.slug.data, title: d.title.data, owner: cvToString(d.owner), set: BigInt(d.set.value).toString(), hidden: d.hidden.type === ClarityType.BoolTrue,
    latest: Number(d.latest.value), versions: Number(d.versions.value), payout: cvToString(d.payout), licence: d.licence.data, cover: ptr(d.cover), icon: ptr(d.icon) };
};
const readGame = async (id: number): Promise<GameRow | null> => {
  const cv = await readCat('get-game', [uintCV(id)]);
  return isNone(cv) ? null : parseGame(inner(cv));
};
type VersionRow = { sha: string; size: number; core: string; ins: string; coreMin: number; profile: string; board: string | null; note: string; revoked: boolean };
const parseVersion = (t: any): VersionRow => {
  const d = t.data;
  return { sha: toHex(hexBytes(cvToString(d['rom-sha256']))), size: Number(d.size.value), core: cvToString(d.core), ins: BigInt(d.ins.value).toString(), coreMin: Number(d['core-min'].value),
    profile: d.profile.data, board: d.board.type === ClarityType.OptionalSome ? d.board.value.data : null, note: d.note.data, revoked: d.revoked.type === ClarityType.BoolTrue };
};
const readVersion = async (id: number, ver: number): Promise<VersionRow | null> => {
  const cv = await readCat('get-version', [uintCV(id), uintCV(ver)]);
  return isNone(cv) ? null : parseVersion(inner(cv));
};
const byHash = async (shaHexValue: string): Promise<{ id: number; ver: number } | null> => {
  const cv = await readCat('get-by-hash', [bufferCV(hexBytes(shaHexValue))]);
  if (isNone(cv)) return null;
  const t: any = inner(cv);
  return { id: Number(t.data.id.value), ver: Number(t.data.ver.value) };
};
const inscriptionMeta = async (id: string) => {
  const cv = await readCore('get-inscription-meta', [uintCV(BigInt(id))]);
  if (isNone(cv)) return null;
  return {
    creator: asText(tupleField(cv, 'creator')), mime: asText(tupleField(cv, 'mime-type')), size: Number(asText(tupleField(cv, 'total-size'))),
    chunks: Number(asText(tupleField(cv, 'total-chunks'))), sealed: asText(tupleField(cv, 'sealed')) === 'true', hash: toHex(bufOf(tupleField(cv, 'final-hash')))
  };
};
const uploadIndex = async (f: Upload): Promise<number | null> => {
  const cv = await readCore('get-upload-state', [bufferCV(f.hash), principalCV(state.deployer!)]);
  return isNone(cv) ? null : Number(asText(tupleField(cv, 'current-index')));
};
const stagedFees = async (size: number, chunks: number) => {
  const cv = await readCore('quote-staged-fee', [uintCV(size), uintCV(chunks)]);
  return { begin: BigInt(asText(tupleField(cv, 'begin-fee'))), seal: BigInt(asText(tupleField(cv, 'seal-fee'))) };
};
const singleFee = async (size: number, chunks: number) => {
  const cv = await readCore('quote-single-tx-fee', [uintCV(size), uintCV(chunks)]);
  return BigInt(asText(tupleField(cv, 'total-fee')));
};
/** What inscribing this file will cost the wallet: one transaction when it fits, otherwise begin + seal (plus uploads). */
const inscribeFee = async (size: number, chunks: number) => {
  if (chunks <= SINGLE_MAX_CHUNKS) return singleFee(size, chunks);
  const st = await stagedFees(size, chunks);
  return st.begin + st.seal;
};
const findInscription = async (f: Upload) => {
  const cv = await readCore('get-id-by-hash', [bufferCV(f.hash)]);
  return isNone(cv) ? null : asText(cv);
};
/** An inscription that already holds exactly these bytes, sealed: re-used instead of inscribed again. */
const findSealed = async (f: Upload) => {
  const id = await findInscription(f);
  if (!id) return null;
  const meta = await inscriptionMeta(id);
  return meta && meta.sealed && meta.hash === toHex(f.hash) && meta.size === f.bytes.length ? { id, meta } : null;
};
/** Every chunk of an inscription, read back from the core in batches. */
const readChunks = async (id: string, total: number, label: string) => {
  const out: Uint8Array[] = [];
  for (let i = 0; i < total; i += READ_PER) {
    status(`Reading ${label} (#${id}) back… ${Math.min(i + READ_PER, total)} of ${total} chunks`);
    const idxs = Array.from({ length: Math.min(READ_PER, total - i) }, (_, k) => uintCV(BigInt(i + k)));
    const cv: any = inner(await readCore('get-chunk-batch', [uintCV(BigInt(id)), listCV(idxs)]));
    const items = cv.list as ClarityValue[];
    if (items.length !== idxs.length) throw new Error(`Chunk read of #${id} returned ${items.length} of ${idxs.length} chunks at ${i}.`);
    for (const it of items) out.push(bufOf(it));
  }
  return out;
};

// ---------- inscribing one file: one transaction when it fits, else begin, upload, seal (each resumable from the chain) ----------
const inscribe = async (sid: string, f: Upload) => {
  const w = requireWallet();
  const existing = await findSealed(f);
  if (existing) {
    if (existing.meta.creator !== w.address) throw new Error(`${f.label}: identical bytes are already inscribed as #${existing.id} by ${existing.meta.creator}. The catalogue only accepts an inscription created by the game's owner (your wallet), and the core's hash lookup points at that earlier copy. Tell us before going on.`);
    return { id: existing.id, sent: false, note: `already on chain as #${existing.id}, identical bytes; re-used, nothing sent` };
  }
  const n = f.chunks.length;
  let id = '';
  if (n <= SINGLE_MAX_CHUNKS && (await uploadIndex(f)) === null) {
    const fee = await singleFee(f.bytes.length, n);
    await runTx(sid, `${f.label}: inscribe (one transaction)`, () => walletCall(CORE, 'mint-single-tx',
      [bufferCV(f.hash), stringAsciiCV(f.mime), uintCV(f.bytes.length), listCV(f.chunks.map((c) => bufferCV(c))), stringAsciiCV(TOKEN_URI)], payAtMost(fee)));
    await eventually(`${f.label} inscription id`, async () => {
      const found = await findSealed(f);
      if (!found) return 'not sealed yet';
      if (found.meta.creator !== w.address) return `sealed by ${short(found.meta.creator)}`;
      id = found.id; return null;
    });
    return { id, sent: true, note: `inscribed in one transaction as #${id} (${kb(f.bytes.length)}, ${n} chunk${n > 1 ? 's' : ''})` };
  }
  const fees = await stagedFees(f.bytes.length, n);
  if ((await uploadIndex(f)) === null) {
    await runTx(sid, `${f.label}: begin`, () => walletCall(CORE, 'begin-or-get',
      [bufferCV(f.hash), stringAsciiCV(f.mime), uintCV(f.bytes.length), uintCV(n)], payAtMost(fees.begin)));
  }
  await eventually(`${f.label} upload session`, async () => ((await uploadIndex(f)) === null ? 'no session yet' : null));
  let idx = (await uploadIndex(f))!;
  while (idx < n) {
    const from = idx, end = Math.min(idx + BATCH, n);
    status(`Uploading ${f.label} chunks ${from + 1}–${end} of ${n}…`);
    await runTx(sid, `${f.label}: chunks ${from}-${end - 1}`, () => walletCall(CORE, 'add-chunk-batch',
      [bufferCV(f.hash), listCV(f.chunks.slice(from, end).map((c) => bufferCV(c)))]));
    await eventually(`${f.label} chunk progress`, async () => { const i = await uploadIndex(f); return i !== null && i >= end ? null : `index ${i}`; });
    idx = (await uploadIndex(f))!;
  }
  await runTx(sid, `${f.label}: seal`, () => walletCall(CORE, 'seal-inscription', [bufferCV(f.hash), stringAsciiCV(TOKEN_URI)], payAtMost(fees.seal)));
  await eventually(`${f.label} inscription id`, async () => {
    const found = await findSealed(f);
    if (!found) return 'not sealed yet';
    if (found.meta.creator !== w.address) return `sealed by ${short(found.meta.creator)}`;
    id = found.id; return null;
  });
  return { id, sent: true, note: `sealed as #${id} (${kb(f.bytes.length)}, ${n} chunk${n > 1 ? 's' : ''})` };
};

// ---------- what the catalogue should hold, and what is still missing ----------
const optTuple = (map: Record<string, ClarityValue>) => someCV(tupleCV(map));
const artPtr = (u: Upload | null) => {
  const id = u ? state.ids[u.key] : null;
  return id ? optTuple({ core: principalCV(CORE), id: uintCV(BigInt(id)) }) : noneCV();
};
const addGameArgs = (g: GameDef): ClarityValue[] =>
  [stringAsciiCV(g.slug), stringAsciiCV(g.title), artPtr(upload(g, 'cover')), artPtr(upload(g, 'icon')), noneCV()];
const addVersionArgs = (g: GameDef, gameId: number): ClarityValue[] => {
  const rom = upload(g, 'rom')!;
  return [uintCV(gameId), principalCV(adId()), bufferCV(hexBytes(g.romSha)), uintCV(g.size), uintCV(BigInt(state.ids[rom.key])),
    uintCV(g.coreMin), stringAsciiCV(g.profile), g.board ? someCV(stringAsciiCV(g.board)) : noneCV(), stringAsciiCV(g.note), boolCV(true)];
};
type PlanGame = { g: GameDef; id: number | null; row: GameRow | null; hasVersion: boolean };
type Plan = { admin: string; pending: string | null; readerOk: boolean; deployerPublisher: boolean; hotPublisher: boolean; games: PlanGame[]; todo: string[] };
/** What still has to be done by the admin, read from the chain (never from this page's memory). */
const registerPlan = async (): Promise<Plan> => {
  const me = state.deployer!, hot = hotAddress();
  const admin = await getAdmin(), pending = await getPending();
  const readerOk = await isReader(adId());
  const deployerPublisher = await isPublisher(me), hotPublisher = await isPublisher(hot);
  const games: PlanGame[] = [];
  const todo: string[] = [];
  if (!readerOk) todo.push('allow the adapter');
  if (!deployerPublisher) todo.push('enrol your wallet as publisher');
  for (const g of GAMES) {
    const id = await gameIdBySlug(g.slug);
    const row = id ? await readGame(id) : null;
    if (row && row.owner !== me && row.owner !== hot) throw new Error(`The slug "${g.slug}" is already used by ${row.owner}. Nothing was sent.`);
    const hit = await byHash(g.romSha);
    if (hit && id && hit.id !== id) throw new Error(`The ROM hash of ${g.title} is already registered under game ${hit.id}. Nothing was sent.`);
    if (hit && !id) throw new Error(`The ROM hash of ${g.title} is already registered under game ${hit.id}, not under the slug "${g.slug}". Nothing was sent.`);
    const hasVersion = !!hit;
    games.push({ g, id, row, hasVersion });
    if (!id) todo.push(`add ${g.title}`);
    if (!row || row.owner !== me) todo.push(`move ${g.title} to your wallet`);
    if (!hasVersion) todo.push(`register the ${g.title} ROM`);
  }
  return { admin, pending, readerOk, deployerPublisher, hotPublisher, games, todo };
};
/** Calls the temporary wallet will sign for this plan, for the float. */
const callsFor = (games: number) => 12 + games * 3; // set-reader, 2 set-publisher, add-game + transfer-game + add-version per game, 2 refusal probes, accept, 2 hand-back, 3 stranger, 1 spare
const planCalls = (p: Plan) => callsFor(p.games.length);

/** Fields that can never change after registration (plus the game's identity); anything the owner may edit later is only reported. */
const gameProblems = (g: GameDef, row: GameRow | null, ver: VersionRow | null) => {
  const bad: string[] = [];
  if (!row) return [`${g.title} is not in the catalogue`];
  const rom = state.ids[`${g.slug}:rom`];
  if (row.title !== g.title) bad.push(`title "${row.title}"`);
  if (row.owner !== state.deployer) bad.push(`owner ${short(row.owner)}`);
  if (row.versions < 1) bad.push('no version');
  if (!ver) { bad.push('version 1 missing'); return bad; }
  if (ver.revoked) bad.push('version 1 is revoked');
  if (ver.sha !== g.romSha) bad.push(`hash ${short(ver.sha)}`);
  if (ver.size !== g.size) bad.push(`size ${ver.size}`);
  if (ver.core !== CORE) bad.push(`core ${short(ver.core)}`);
  if (rom && ver.ins !== rom) bad.push(`inscription #${ver.ins}, expected #${rom}`);
  if (ver.coreMin !== g.coreMin) bad.push(`core-min ${ver.coreMin}`);
  if (ver.profile !== g.profile) bad.push(`profile "${ver.profile}"`);
  if ((ver.board ?? '') !== (g.board ?? '')) bad.push(`board ${ver.board}`);
  if (ver.note !== g.note) bad.push('note');
  for (const kind of ['cover', 'icon'] as const) {
    const u = upload(g, kind), p = row[kind];
    if (u && (!p || p.core !== CORE || p.id !== state.ids[u.key])) bad.push(`${kind} pointer`);
  }
  return bad;
};

// ---------- the wrapper: what the Arcade page does between the catalogue, the core and the emulator ----------
type Card = { id: number; game: GameRow; version: VersionRow | null };
/** The whole menu, read the way the wrapper reads it: ten cards per call. */
const readCatalogue = async (): Promise<Card[]> => {
  const count = Number(asText(await readCat('get-count')));
  const cards: Card[] = [];
  for (let start = 1; start <= count; start += 10) {
    const list: any = inner(await readCat('get-page', [uintCV(start)]));
    for (const c of list.list as any[]) {
      if (c.type !== ClarityType.OptionalSome) continue;
      const t = c.value.data;
      cards.push({ id: Number(t.id.value), game: parseGame(t.game), version: t.version.type === ClarityType.OptionalSome ? parseVersion(t.version.value) : null });
    }
  }
  return cards;
};
/** The ROM exactly as the wrapper fetches it: chunks from the named core, size checked, canonical SHA-256 checked against the catalogue. */
const fetchRom = async (v: VersionRow, label: string): Promise<Uint8Array> => {
  if (v.core !== CORE) throw new Error(`${label}: the catalogue names core ${v.core}; this wrapper reads ${CORE} only.`);
  const meta = await inscriptionMeta(v.ins);
  if (!meta || !meta.sealed) throw new Error(`${label}: inscription #${v.ins} is missing or not sealed.`);
  if (meta.size !== v.size) throw new Error(`${label}: inscription #${v.ins} is ${meta.size} bytes, the catalogue says ${v.size}.`);
  const bytes = joinBytes(await readChunks(v.ins, meta.chunks, label));
  if (bytes.length !== v.size) throw new Error(`${label}: read ${bytes.length} bytes, expected ${v.size}.`);
  if (romSha(bytes) !== v.sha) throw new Error(`${label}: the bytes read from #${v.ins} do not hash to the catalogue's ${short(v.sha)}.`);
  return bytes;
};
const coverUrl = async (p: { core: string; id: string } | null, label: string): Promise<string | null> => {
  if (!p || p.core !== CORE) return null;
  const meta = await inscriptionMeta(p.id);
  if (!meta || !meta.sealed || meta.size > 200_000) return null;
  const bytes = joinBytes(await readChunks(p.id, meta.chunks, label));
  const url = `data:image/png;base64,${b64(bytes)}`;
  return url.length < 300_000 ? url : null;
};

// ---------- the real emulator in a frame, driven over its postMessage bridge ----------
type Emu = {
  frame: HTMLIFrameElement;
  win: any;
  request: (type: string, payload?: Record<string, any>, timeout?: number) => Promise<any>;
  wait: (type: string, pred?: (m: any) => boolean, timeout?: number) => Promise<any>;
  /** Registers a one-shot wait first, so a message sent right after an action is never missed. */
  expect: (type: string, pred?: (m: any) => boolean, timeout?: number) => Promise<any>;
  close: () => void;
};
const BRIDGE_NS = 'xtrata-snes';
const openEmulator = async (): Promise<Emu> => {
  const frame = el('iframe', { title: 'SNES emulator under test', class: 'emu-frame' }) as HTMLIFrameElement;
  const listeners = new Set<(m: any) => void>();
  const pending = new Map<number, { resolve: (m: any) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> }>();
  let seq = 0;
  const onMessage = (e: MessageEvent) => {
    if (e.source !== frame.contentWindow) return;
    const m = e.data;
    if (!m || typeof m !== 'object' || m.ns !== BRIDGE_NS) return;
    if (m.id != null && pending.has(m.id)) {
      const p = pending.get(m.id)!; pending.delete(m.id); clearTimeout(p.timer);
      if (m.type === 'error') p.reject(new Error(String(m.message))); else p.resolve(m);
      return;
    }
    for (const l of [...listeners]) l(m);
  };
  window.addEventListener('message', onMessage);
  const expect = (type: string, pred: (m: any) => boolean = () => true, timeout = 15_000) => {
    let listener!: (m: any) => void;
    const p = new Promise<any>((resolve, reject) => {
      const t = setTimeout(() => { listeners.delete(listener); reject(new Error(`the emulator did not send "${type}" within ${timeout / 1000}s`)); }, timeout);
      listener = (m) => { if (m.type === type && pred(m)) { clearTimeout(t); listeners.delete(listener); resolve(m); } };
      listeners.add(listener);
    });
    return p;
  };
  const request = (type: string, payload: Record<string, any> = {}, timeout = 20_000) => new Promise<any>((resolve, reject) => {
    const id = ++seq;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`the emulator did not answer "${type}" within ${timeout / 1000}s`)); }, timeout);
    pending.set(id, { resolve, reject, timer });
    frame.contentWindow!.postMessage({ ns: BRIDGE_NS, v: 1, id, type, ...payload }, '*');
  });
  const ready = expect('ready', undefined, 30_000);
  frame.srcdoc = PACK.emulator.html;
  $('#emu-stage').replaceChildren(frame);
  $('#emu-wrap').removeAttribute('hidden');
  const emu: Emu = {
    frame, win: null, request, wait: expect, expect,
    close: () => { window.removeEventListener('message', onMessage); for (const p of pending.values()) clearTimeout(p.timer); pending.clear(); }
  };
  await ready;
  emu.win = frame.contentWindow;
  return emu;
};
/** Something other than a blank screen: a few distinct colours in the frame the emulator draws. */
const frameLooksAlive = async (emu: Emu) => {
  const r = await emu.request('get-frame', { format: 'image/png' });
  if (typeof r.dataUrl !== 'string') throw new Error('the emulator returned no frame image');
  const img = new Image();
  img.src = r.dataUrl;
  await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const ctx = c.getContext('2d')!; ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  const seen = new Set<number>();
  for (let i = 0; i < d.length; i += 28) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
  return { width: c.width, height: c.height, colours: seen.size };
};
const provenanceText = (emu: Emu) => (emu.win.document.getElementById('provenance')?.textContent ?? '').trim();
const menuButton = (emu: Emu, title: string): HTMLButtonElement | null => {
  for (const g of Array.from(emu.win.document.querySelectorAll('#games .game')) as HTMLElement[]) {
    if (g.querySelector('b')?.textContent === title) return g.querySelector('button') as HTMLButtonElement;
  }
  return null;
};
/** Pause, run some frames, and check the screen is drawing. */
const runFrames = async (emu: Emu, frames: number) => {
  await emu.request('control', { action: 'pause' });
  const before = (await emu.request('get-info')).frame as number;
  const after = (await emu.request('step', { frames })).frame as number;
  if (!(after >= before + frames)) throw new Error(`the emulator ran ${after - before} of ${frames} frames`);
  return { frames: after, ...(await frameLooksAlive(emu)) };
};

// ---------- hand the admin role back (shared by the step and the recovery button) ----------
/**
 * Gives the catalogue admin role back to the deployer if the temporary wallet holds it. The temporary wallet first switches its own
 * publisher rights off, then proposes the deployer, and the deployer accepts. Safe to call at any point; sends nothing when the
 * role is already back and nothing is left over.
 */
const handBack = async () => {
  const me = state.deployer!, hot = hotAddress();
  let moved = false;
  let admin = await getAdmin();
  if (admin !== me && admin !== hot) throw new Error(`The catalogue admin is ${admin}, which is neither your wallet nor the temporary wallet.`);
  if (admin === hot) {
    await ensureHotFunds('handback', hotFloat(3), 'handing the admin role back');
    if (await isPublisher(hot)) {
      await hotCall('handback', 'temporary wallet drops its own publisher rights', 'set-publisher', [principalCV(hot), boolCV(false), stringAsciiCV('')]);
      await eventually('Temporary wallet publisher rights', async () => ((await isPublisher(hot)) ? 'still a publisher' : null));
    }
    if ((await getPending()) !== me) {
      await hotCall('handback', 'temporary wallet proposes your wallet as admin', 'propose-admin', [principalCV(me)]);
      await eventually('Pending admin', async () => ((await getPending()) === me ? null : 'not proposed yet'));
    }
    await runTx('handback', uniq('handback', 'your wallet accepts the admin role'), () => walletCall(catId(), 'accept-admin', []));
    await eventually('Admin', async () => ((await getAdmin()) === me ? null : 'not accepted yet'));
    moved = true;
  }
  // Leftovers: a proposal that was never accepted, or publisher rights the temporary wallet still has.
  if ((await getPending()) === hot) {
    await runTx('handback', uniq('handback', 'cancel the pending hand-over'), () => walletCall(catId(), 'propose-admin', [principalCV(me)]));
    await eventually('Pending admin', async () => ((await getPending()) === hot ? 'still the temporary wallet' : null));
  }
  if (await isPublisher(hot)) {
    await runTx('handback', uniq('handback', 'switch the temporary wallet\'s publisher rights off'), () => walletCall(catId(), 'set-publisher', [principalCV(hot), boolCV(false), stringAsciiCV('')]));
    await eventually('Temporary wallet publisher rights', async () => ((await isPublisher(hot)) ? 'still a publisher' : null));
  }
  admin = await getAdmin();
  if (admin !== me) throw new Error(`The catalogue admin is ${admin}, not your wallet.`);
  return moved;
};

const sourceMatches = (source: string, pin: string) => shaHex(source) === pin || shaHex(source.replace(/\r\n/g, '\n')) === pin;
const png = (b: Uint8Array) => {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (b.length < 24 || sig.some((x, i) => b[i] !== x)) return null;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  return { w: dv.getUint32(16), h: dv.getUint32(20) };
};
const loadLocalFile = (emu: Emu, bytes: Uint8Array, name: string) => {
  const w = emu.win;
  const input = w.document.getElementById('file') as HTMLInputElement;
  const dt = new w.DataTransfer();
  dt.items.add(new w.File([bytes], name));
  input.files = dt.files;
  input.dispatchEvent(new w.Event('change', { bubbles: true }));
};

type Step = { id: string; title: string; who: string; intro: string; action: string; run: () => Promise<string | void> };
const totalSigs = (g: GameDef) => uploadsOf(g).reduce((n, u) => n + sigsFor(u), 0);

const inscribeStep = (g: GameDef): Step => {
  const list = uploadsOf(g);
  const n = totalSigs(g);
  return {
    id: `ins-${g.slug}`, title: `Inscribe ${g.title}`, who: `Web wallet · ${n} signature${n === 1 ? '' : 's'}`,
    intro: `Inscribes ${list.map((u) => `the ${u.kind === 'rom' ? 'ROM' : u.kind} (${u.bytes.length.toLocaleString()} bytes, ${u.chunks.length} chunk${u.chunks.length > 1 ? 's' : ''}, ${u.mime}, sha256 ${short(u.sha)})`).join(', ')} on the live core. One transaction each; the fee is quoted from the core and capped by a post-condition. If these exact bytes are already inscribed by your wallet, that inscription is re-used and nothing is sent.${g.cover ? '' : ` ${g.title} has no cover or icon yet; it is registered without art.`}`,
    action: `Inscribe ${g.title}`,
    run: async () => {
      const notes: string[] = [];
      for (const f of list) {
        const r = await inscribe(`ins-${g.slug}`, f);
        state.ids[f.key] = r.id; save(); renderHeader();
        notes.push(`${f.kind} ${r.note}`);
      }
      return notes.join(' · ');
    }
  };
};

const STEPS: Step[] = [
  {
    id: 'connect', title: 'Connect your web wallet', who: 'Web wallet',
    intro: 'Opens the wallet chooser, then the wallet\'s own account picker. This account deploys the contracts, inscribes the games, owns the catalogue and is the publisher of every game in it.',
    action: 'Connect wallet',
    run: async () => {
      const result = await wallet.connect(NETWORK, chooseWallet);
      if (!result.isConnected) {
        if (result.wrongNetwork) throw new Error(`The wallet returned a ${result.wrongNetwork} address (${result.address}). Switch the wallet to mainnet and connect again.`);
        throw new Error('Connection was cancelled or returned no Stacks address.');
      }
      if (state.deployer && state.deployer !== result.address && Object.entries(state.steps).some(([id, s]) => id !== 'connect' && s.status === 'pass')) {
        connected = null;
        throw new Error(`This run belongs to ${state.deployer}; the wallet picked ${result.address}. Pick that account, or use "Forget local progress" to start over.`);
      }
      connected = { address: result.address, publicKey: result.publicKey, label: wallet.walletLabel() };
      if (state.deployer && state.deployer !== result.address) { state.ids = {}; state.alreadyLaunched = undefined; }
      state.deployer = result.address; save();
      renderHeader(); renderManage();
      let balance = 'could not check';
      try { balance = stx(await chain.balance(result.address)); } catch { /* shown as could not check */ }
      return `${connected.label} · ${result.address} · balance ${balance}${result.publicKey ? '' : ' · no public key (sign-only fallback unavailable)'}`;
    }
  },
  {
    id: 'preflight', title: 'Preflight: pins, core, funds, what is already on chain', who: 'Reads only',
    intro: `Checks every embedded file against its pin (two contracts, ${UPLOADS.length} inscriptions, the emulator), re-computes each ROM's canonical SHA-256, confirms the Xtrata core is open and quotes every inscription fee, then looks for anything already done so a re-run resumes instead of repeating.`,
    action: 'Run preflight',
    run: async () => {
      const w = requireWallet();
      if (shaHex(CATALOGUE_SRC) !== __CATALOGUE_SHA__) throw new Error('Embedded catalogue contract does not match its pin. Rebuild the canary.');
      if (shaHex(ADAPTER_SRC) !== __ADAPTER_SHA__) throw new Error('Embedded adapter contract does not match its pin. Rebuild the canary.');
      if (shaHex(PACK.emulator.html) !== PACK.emulator.sha256) throw new Error('Embedded emulator does not match its pin. Rebuild the canary.');
      for (const g of GAMES) {
        const rom = upload(g, 'rom')!;
        if (romSha(rom.bytes) !== g.romSha) throw new Error(`Embedded ${g.title} ROM hashes to ${romSha(rom.bytes)}, not the pinned ${g.romSha}. Rebuild the canary.`);
        if (rom.bytes.length !== g.size) throw new Error(`Embedded ${g.title} ROM is ${rom.bytes.length} bytes, expected ${g.size}.`);
        for (const kind of ['cover', 'icon'] as const) {
          const u = upload(g, kind);
          if (u && u.sha !== (g as any)[`${kind}Sha`]) throw new Error(`Embedded ${g.title} ${kind} does not match its pin. Rebuild the canary.`);
        }
      }
      const paused = asText(await readCore('is-paused'));
      if (paused !== 'false') throw new Error('The Xtrata core is paused, so nothing can be inscribed right now.');
      // What is already on chain.
      const catSrc = await chain.contractSource(catId()), adSrc = await chain.contractSource(adId());
      if (catSrc !== null && !sourceMatches(catSrc, __CATALOGUE_SHA__)) throw new Error(`${catId()} already exists with different source. Nothing was sent.`);
      if (adSrc !== null && !sourceMatches(adSrc, __ADAPTER_SHA__)) throw new Error(`${adId()} already exists with different source. Nothing was sent.`);
      let need = SAFETY_BUFFER;
      const plan: string[] = [];
      if (catSrc === null) { need += DEPLOY_FEE_ESTIMATE; plan.push('deploy catalogue'); } else plan.push('catalogue already deployed');
      if (adSrc === null) { need += DEPLOY_FEE_ESTIMATE; plan.push('deploy adapter'); } else plan.push('adapter already deployed');
      let sealed = 0;
      for (const f of UPLOADS) {
        const found = await findSealed(f);
        if (found && found.meta.creator === w.address) { state.ids[f.key] = found.id; sealed++; continue; }
        if (found) throw new Error(`${f.label}: identical bytes are already inscribed as #${found.id} by ${found.meta.creator}, not by your wallet. The catalogue needs an inscription created by the game's owner. Tell us before going on.`);
        const fee = await inscribeFee(f.bytes.length, f.chunks.length);
        need += fee + BigInt(Math.ceil(f.bytes.length * 1.1)) + 20_000n; // core fee + the wallet's network fee for a transaction this size
      }
      plan.push(`${sealed} of ${UPLOADS.length} inscriptions already sealed by this wallet`);
      let registered = '';
      let launched = false;
      if (catSrc !== null && adSrc !== null) {
        const p = await registerPlan();
        launched = UPLOADS.every((f) => state.ids[f.key]) && p.todo.length === 0 && p.admin === w.address && !p.hotPublisher;
        registered = ` · registration: ${p.todo.length ? `${p.todo.length} thing${p.todo.length === 1 ? '' : 's'} left (${p.todo.slice(0, 3).join(', ')}${p.todo.length > 3 ? ', …' : ''})` : 'complete'}`;
        need += hotFloat(planCalls(p)) + (p.todo.length ? 0n : 0n);
      } else need += hotFloat(callsFor(GAMES.length));
      save();
      const other = Object.entries(state.steps).some(([id, s]) => id !== 'connect' && id !== 'preflight' && s.status === 'pass');
      if (!other) state.alreadyLaunched = launched;
      save();
      const balance = await chain.balance(w.address);
      const funds = balance < need ? ` · WARNING balance ${stx(balance)} is below the ~${stx(need)} this run may need` : ` · balance ${stx(balance)} covers the ~${stx(need)} this run may need (most of it comes back: only fees are spent)`;
      return `${GAMES.length} games · pins match · ROM hashes re-computed · core open · ${plan.join(', ')}${registered}${state.alreadyLaunched ? ' · the launch was already complete before this session: one-time proofs are not repeated' : ''}${funds}`;
    }
  },
  {
    id: 'deploy-cat', title: 'Deploy the catalogue contract', who: 'Web wallet · 1 signature',
    intro: `Deploys ${CAT_NAME} at Clarity 4 from your wallet. It stores hashes and pointers, never ROM bytes. You become its admin. Skipped when it is already on chain with the pinned source.`,
    action: 'Deploy catalogue',
    run: async () => {
      const w = requireWallet();
      const existing = await chain.contractSource(catId());
      if (existing !== null) {
        if (!sourceMatches(existing, __CATALOGUE_SHA__)) throw new Error(`${catId()} already exists with different source.`);
        return 'already deployed with the pinned source; nothing to send';
      }
      const rec = await runTx('deploy-cat', 'deploy catalogue', async () => settle(await wallet.deployContract({ contractName: CAT_NAME, codeBody: CATALOGUE_SRC, clarityVersion: 4, network: NETWORK, stxAddress: w.address, onProgress: progress })));
      return `deployed in block ${rec.block}`;
    }
  },
  {
    id: 'verify-cat', title: 'Verify the catalogue contract', who: 'Reads only',
    intro: 'Re-reads the deployed source and state: pinned source, the admin is your wallet (or the temporary wallet mid-hand-over), no stray pending hand-over.',
    action: 'Verify catalogue',
    run: async () => {
      let source: string | null = null;
      await eventually('Catalogue visibility', async () => { source = await chain.contractSource(catId()); return source === null ? 'not visible yet' : null; });
      if (!sourceMatches(source!, __CATALOGUE_SHA__)) throw new Error('Deployed catalogue source differs from the pinned source.');
      const admin = await getAdmin(), hot = hotAddress();
      if (admin !== state.deployer && admin !== hot) throw new Error(`The catalogue admin is ${admin}, neither your wallet nor the temporary wallet.`);
      const pending = await getPending();
      const count = asText(await readCat('get-count'));
      return `source matches the pin · admin ${admin === state.deployer ? 'is your wallet' : 'is the temporary wallet (mid hand-over)'} · pending admin ${pending ? short(pending) : 'none'} · ${count} game${count === '1' ? '' : 's'} listed`;
    }
  },
  {
    id: 'deploy-adapter', title: 'Deploy the Xtrata adapter', who: 'Web wallet · 1 signature',
    intro: `Deploys ${AD_NAME} (Clarity 4) from the same wallet, after the catalogue because it implements the catalogue's check trait. It has no state and no owner: it only tells the catalogue whether an inscription on the live core exists, is sealed, has the stated size and was created by the game's owner. Skipped when already on chain with the pinned source.`,
    action: 'Deploy adapter',
    run: async () => {
      const w = requireWallet();
      const existing = await chain.contractSource(adId());
      if (existing !== null) {
        if (!sourceMatches(existing, __ADAPTER_SHA__)) throw new Error(`${adId()} already exists with different source.`);
        return 'already deployed with the pinned source; nothing to send';
      }
      const rec = await runTx('deploy-adapter', 'deploy adapter', async () => settle(await wallet.deployContract({ contractName: AD_NAME, codeBody: ADAPTER_SRC, clarityVersion: 4, network: NETWORK, stxAddress: w.address, onProgress: progress })));
      return `deployed in block ${rec.block}`;
    }
  },
  {
    id: 'verify-adapter', title: 'Verify the adapter reads the live core', who: 'Reads only',
    intro: `Re-reads the deployed source, checks it names ${short(CORE)}, and asks it (read-only) to check an inscription id that cannot exist: it must answer (err u200), which proves the adapter is wired to the live core.`,
    action: 'Verify adapter',
    run: async () => {
      let source: string | null = null;
      await eventually('Adapter visibility', async () => { source = await chain.contractSource(adId()); return source === null ? 'not visible yet' : null; });
      if (!sourceMatches(source!, __ADAPTER_SHA__)) throw new Error('Deployed adapter source differs from the pinned source.');
      const core = cvToString(inner(await chain.read(adId(), 'core')));
      if (core !== CORE) throw new Error(`The adapter names ${core}, expected ${CORE}.`);
      const probe: any = await chain.read(adId(), 'check', [uintCV(BAD_ID), uintCV(1n), principalCV(state.deployer!)]);
      if (probe.type !== ClarityType.ResponseErr || BigInt(probe.value.value) !== 200n) throw new Error(`The adapter answered ${cvToString(probe)} for a missing inscription; expected (err u200).`);
      return `source matches the pin · core ${short(core)} · check on a missing inscription answers (err u200)`;
    }
  },
  ...GAMES.map(inscribeStep),
  {
    id: 'verify-ins', title: 'Verify every inscription, byte for byte', who: 'Reads only',
    intro: 'Reads each ROM and image back from the core and checks: sealed, created by your wallet, type, size, chunk count, the sealed hash, the SHA-256 of the bytes, and for a ROM the emulator\'s canonical SHA-256 that goes into the catalogue. Images must be real PNGs of the artwork size.',
    action: 'Verify inscriptions',
    run: async () => {
      const w = requireWallet();
      const notes: string[] = [];
      let total = 0;
      for (const f of UPLOADS) {
        const id = state.ids[f.key];
        if (!id) throw new Error(`${f.label} has no inscription id yet. Run its inscribe step first.`);
        const meta = await inscriptionMeta(id);
        if (!meta) throw new Error(`${f.label} #${id} not found on the core.`);
        if (!meta.sealed) throw new Error(`${f.label} #${id} is not sealed.`);
        if (meta.creator !== w.address) throw new Error(`${f.label} #${id} was created by ${meta.creator}, not your wallet.`);
        if (meta.mime !== f.mime) throw new Error(`${f.label} #${id} is ${meta.mime}, expected ${f.mime}.`);
        if (meta.size !== f.bytes.length || meta.chunks !== f.chunks.length) throw new Error(`${f.label} #${id} is ${meta.size} bytes in ${meta.chunks} chunks; expected ${f.bytes.length} in ${f.chunks.length}.`);
        if (meta.hash !== toHex(f.hash)) throw new Error(`${f.label} #${id} hash differs from the declared hash.`);
        const out = await readChunks(id, meta.chunks, f.label);
        const bytes = joinBytes(out);
        if (toHex(sha256(bytes)) !== f.sha) throw new Error(`The bytes of ${f.label} #${id} read back from the chain do not match.`);
        if (toHex(chainHash(out)) !== meta.hash) throw new Error(`The chain hash of ${f.label} #${id} differs from the sealed hash.`);
        if (f.kind === 'rom' && romSha(bytes) !== f.game.romSha) throw new Error(`${f.label} #${id}: canonical SHA-256 is ${romSha(bytes)}, expected ${f.game.romSha}.`);
        if (f.kind !== 'rom') {
          const dims = png(bytes), want = f.kind === 'cover' ? [512, 384] : [256, 256];
          if (!dims || dims.w !== want[0] || dims.h !== want[1]) throw new Error(`${f.label} #${id} is not a ${want[0]}x${want[1]} PNG.`);
        }
        total += bytes.length;
      }
      for (const g of GAMES) notes.push(`${g.title} ROM #${state.ids[`${g.slug}:rom`]}${g.cover ? `, cover #${state.ids[`${g.slug}:cover`]}, icon #${state.ids[`${g.slug}:icon`]}` : ''}`);
      return `${UPLOADS.length} inscriptions read back (${kb(total)}): ${notes.join(' · ')}`;
    }
  },
  {
    id: 'tempwallet', title: 'Create and fund the temporary wallet', who: 'Web wallet · 1 signature',
    intro: `Registering ${GAMES.length} games takes about ${callsFor(GAMES.length)} admin calls, so the canary does them with a temporary wallet it creates in this browser instead of asking you to sign each one. This step saves that wallet's key to a file, then asks your wallet to send it a small float for network fees (about ${stx(hotFloat(callsFor(GAMES.length)))}; what is not spent is swept back at the end). Xverse cannot sign a plain transfer from a page: the address and amount are shown and the step waits for the funds to arrive. If everything is already registered nothing is created or sent.`,
    action: 'Create and fund the wallet',
    run: async () => {
      const me = state.deployer!, hot = hotAddress();
      const plan = await registerPlan();
      if (!plan.todo.length && plan.admin === me) return `everything is already registered: no temporary wallet needed, nothing sent · temporary wallet ${hot} holds ${stx(await chain.balance(hot))}`;
      if (plan.admin !== me && plan.admin !== hot) throw new Error(`The catalogue admin is ${plan.admin}, which is neither your wallet nor the temporary wallet ${hot}. Nothing was sent.`);
      const target = hotFloat(planCalls(plan));
      if (plan.admin === me && plan.pending !== hot && !step('tempwallet').data.keySaved) {
        downloadHotKey();
        step('tempwallet').data.keySaved = true; save();
        const msg = `${plan.todo.length} things need registering.\n\nThe temporary wallet ${hot} will sign them. Its key has just been saved to a file in your downloads: keep it until the canary says the admin role is back with your wallet.\n\nNext your wallet sends it about ${stx(target)} for network fees (what is unspent is swept back). Continue?`;
        if (!confirm(msg)) throw new Error('Cancelled before anything was sent.');
      }
      const have = await ensureHotFunds('tempwallet', target, 'temporary wallet');
      return `temporary wallet ${hot} created, key saved to a file, and funded: it holds ${stx(have)} for ${plan.todo.length} registration item${plan.todo.length === 1 ? '' : 's'}`;
    }
  },
  {
    id: 'handover', title: 'Make the temporary wallet the catalogue admin', who: 'Web wallet · 1 signature',
    intro: 'Your wallet proposes the temporary wallet as the catalogue admin (`propose-admin`) and the temporary wallet accepts (`accept-admin`, signed in this page). While it is admin it can allow adapters, enrol publishers, hide or revoke entries, and it does only the registrations listed in the next step. The step after that hands the role back to your wallet. If anything stops in between, the hand-back step or "Return admin role to my wallet" below finishes the job.',
    action: 'Hand over admin',
    run: async () => {
      const me = state.deployer!, hot = hotAddress();
      const plan = await registerPlan();
      if (plan.admin !== me && plan.admin !== hot) throw new Error(`The catalogue admin is ${plan.admin}, which is neither your wallet nor the temporary wallet. Nothing was sent.`);
      if (!plan.todo.length && plan.admin === me) return 'nothing to register: the admin role stays with your wallet, nothing sent';
      if (plan.admin === hot) return `the temporary wallet ${short(hot)} is already the admin (nothing sent)`;
      if ((await chain.balance(hot)) < hotFloat(planCalls(plan)) - 100_000n) throw new Error('The temporary wallet is not funded yet. Run the previous step first.');
      if (plan.pending !== hot) {
        await runTx('handover', uniq('handover', `make ${short(hot)} the catalogue admin (propose)`), () => walletCall(catId(), 'propose-admin', [principalCV(hot)]));
        await eventually('Pending admin', async () => ((await getPending()) === hot ? null : 'not proposed yet'));
      }
      await hotCall('handover', 'temporary wallet accepts the admin role', 'accept-admin', []);
      await eventually('Admin', async () => ((await getAdmin()) === hot ? null : 'not accepted yet'));
      return `the temporary wallet ${short(hot)} is now the catalogue admin (it hands the role back two steps from now) · ${plan.todo.length} item${plan.todo.length === 1 ? '' : 's'} to register`;
    }
  },
  {
    id: 'register', title: `Register the ${GAMES.length} games`, who: 'Temporary wallet (signed in this page)',
    intro: `The temporary wallet allows the adapter (\`set-reader\`), enrols your wallet as publisher, then for each game: \`add-game\` (an admin's game goes straight into the core set), \`transfer-game\` to your wallet (so your wallet is the owner and the inscription's creator matches), and \`add-version\` (the catalogue asks the adapter to check the ROM inscription on the live core). Each call is confirmed before the next, with no wallet prompts. It then proves the contract refuses a duplicate ROM hash and a wrong size. Anything already registered is skipped, so a reload or an error resumes where it stopped.`,
    action: 'Register games automatically',
    run: async () => {
      const me = state.deployer!, hot = hotAddress();
      let plan = await registerPlan();
      if (!plan.todo.length) return `all ${GAMES.length} games are already registered for your wallet · nothing sent`;
      if (plan.admin !== hot) throw new Error('The temporary wallet is not the catalogue admin yet. Run the two previous steps first.');
      let did = 0;
      try {
        if (!plan.readerOk) {
          await hotCall('register', 'allow the adapter (set-reader)', 'set-reader', [principalCV(adId()), boolCV(true)]); did++;
          await eventually('Adapter allowed', async () => ((await isReader(adId())) ? null : 'not allowed yet'));
        }
        if (!plan.deployerPublisher) {
          await hotCall('register', 'enrol your wallet as publisher', 'set-publisher', [principalCV(me), boolCV(true), stringAsciiCV('xtrata')]); did++;
          await eventually('Your publisher rights', async () => ((await isPublisher(me)) ? null : 'not enrolled yet'));
        }
        if (plan.games.some((p) => !p.id) && !plan.hotPublisher) {
          await hotCall('register', 'temporary wallet enrols itself as publisher (add-game needs one)', 'set-publisher', [principalCV(hot), boolCV(true), stringAsciiCV('temporary')]); did++;
          await eventually('Temporary wallet publisher rights', async () => ((await isPublisher(hot)) ? null : 'not enrolled yet'));
        }
        for (const p of plan.games) {
          const g = p.g;
          let id = p.id;
          if (!id) {
            status(`Adding ${g.title}…`);
            await hotCall('register', `add-game ${g.slug}`, 'add-game', addGameArgs(g)); did++;
            await eventually(`${g.title} listed`, async () => { id = await gameIdBySlug(g.slug); return id ? null : 'not listed yet'; });
          }
          const row = await readGame(id!);
          if (!row || row.owner !== me) {
            await hotCall('register', `transfer-game ${g.slug} → your wallet`, 'transfer-game', [uintCV(id!), principalCV(me)]); did++;
            await eventually(`${g.title} owner`, async () => (((await readGame(id!))?.owner) === me ? null : 'not moved yet'));
          }
          if (!p.hasVersion) {
            status(`Registering the ${g.title} ROM…`);
            await hotCall('register', `add-version ${g.slug}`, 'add-version', addVersionArgs(g, id!)); did++;
            await eventually(`${g.title} version`, async () => { const h = await byHash(g.romSha); return h && h.id === id ? null : 'not registered yet'; });
          }
        }
      } catch (error) {
        let held = false;
        try { held = (await getAdmin()) === hot; } catch { /* ignore */ }
        if (held) throw new Error(`${errText(error)} — The catalogue admin role is with the temporary wallet ${hot} until it is handed back. Press this step's button again to continue, or "Return admin role to my wallet" to give it back now. Its key was saved to a file (and stays in this browser).`);
        throw error;
      }
      // One-time proofs of refusal, signed by the temporary wallet while it is admin. Not repeated on a launch that was already complete.
      let proofs = 'refusal proofs not repeated (launch was already complete)';
      if (!state.alreadyLaunched) {
        const a = plan.games[0].g, b = GAMES[1];
        const id1 = (await gameIdBySlug(a.slug))!, id2 = (await gameIdBySlug(b.slug))!;
        const before = (await readGame(id1))!.versions;
        await ensureHotFunds('register', hotFloat(2), 'refusal proofs');
        const dup = addVersionArgs(b, id2); dup[2] = bufferCV(hexBytes(a.romSha));              // game 2's inscription, game 1's hash
        await hotCall('register', 'duplicate ROM hash is refused', 'add-version', dup, '(err u105)');
        const wrong = addVersionArgs(a, id1); wrong[2] = bufferCV(new Uint8Array(32).fill(0xaa)); wrong[3] = uintCV(a.size + 1); // wrong size
        await hotCall('register', 'wrong ROM size is refused', 'add-version', wrong, '(err u202)');
        if ((await readGame(id1))!.versions !== before) throw new Error('A refused add-version changed the catalogue.');
        proofs = 'a duplicate ROM hash is refused (err u105) and a wrong size is refused by the adapter (err u202); neither changed anything';
      }
      plan = await registerPlan();
      if (plan.todo.length) throw new Error(`Still to register: ${plan.todo.join(', ')}.`);
      return `${GAMES.length} games registered for your wallet in the core set (${did} calls signed by the temporary wallet) · ${proofs}`;
    }
  },
  {
    id: 'handback', title: 'Hand the admin role back', who: 'Web wallet · 1 signature',
    intro: 'The temporary wallet switches its own publisher rights off and proposes your wallet as admin again, and your wallet accepts (`accept-admin`). The step also clears a hand-over that was proposed but never accepted, so the temporary key can never become admin later. It succeeds, and sends nothing, when the role is already back.',
    action: 'Hand back admin',
    run: async () => {
      const me = state.deployer!;
      const moved = await handBack();
      const pending = await getPending();
      return `${moved ? 'the admin role is back with your wallet' : 'your wallet already holds the admin role (nothing to hand back)'} · temporary wallet has no publisher rights · pending admin ${pending ? short(pending) : 'none'} · admin ${short(me)}`;
    }
  },
  {
    id: 'stranger', title: 'A stranger is refused', who: 'Temporary wallet (signed in this page)',
    intro: 'The temporary wallet now has no powers at all. It tries three things the contract must refuse: adding a game (needs a publisher, `err u101`), hiding someone else\'s game (`err u102`) and removing the adapter (admin only, `err u100`). A refused transaction still pays its small fee. Not repeated on a launch that was already complete.',
    action: 'Try as a stranger',
    run: async () => {
      if (state.alreadyLaunched) return 'the stranger was already refused on chain in an earlier session (the launch was complete before this run): nothing sent';
      const me = state.deployer!, hot = hotAddress();
      if ((await getAdmin()) !== me) throw new Error('Hand the admin role back first.');
      if (await isPublisher(hot)) throw new Error('The temporary wallet is still a publisher. Run the hand-back step again.');
      const id1 = await gameIdBySlug(GAMES[0].slug);
      if (!id1) throw new Error('No game is registered yet.');
      await ensureHotFunds('stranger', hotFloat(3), 'stranger test');
      await hotCall('stranger', 'stranger tries add-game', 'add-game', [stringAsciiCV('stranger-game'), stringAsciiCV('STRANGER'), noneCV(), noneCV(), noneCV()], '(err u101)');
      await hotCall('stranger', 'stranger tries set-hidden', 'set-hidden', [uintCV(id1), boolCV(true)], '(err u102)');
      await hotCall('stranger', 'stranger tries set-reader', 'set-reader', [principalCV(adId()), boolCV(false)], '(err u100)');
      if ((await gameIdBySlug('stranger-game')) !== null) throw new Error('The stranger\'s game appears in the catalogue.');
      const row = await readGame(id1);
      if (!row || row.hidden) throw new Error('The stranger changed a game.');
      if (!(await isReader(adId()))) throw new Error('The stranger removed the adapter.');
      return 'add-game refused (err u101) · set-hidden refused (err u102) · set-reader refused (err u100) · the catalogue is unchanged';
    }
  },
  {
    id: 'sweep', title: 'Sweep the temporary wallet back', who: 'Temporary wallet (signed in this page)',
    intro: 'Returns what is left in the temporary wallet to your wallet.',
    action: 'Sweep back',
    run: async () => {
      const left = await sweepHot('sweep');
      return `temporary wallet balance now ${stx(left)}`;
    }
  },
  {
    id: 'verify-catalogue', title: 'Read the whole catalogue back from the chain', who: 'Reads only',
    intro: 'Reads every game, version, hash lookup and the ten-card menu pages exactly as the Arcade page will, and checks them against what was inscribed: owner, title, hash, size, core, inscription id, minimum emulator core, scoring profile, board, note, cover and icon pointers (resolving to sealed inscriptions made by your wallet). Fields the owner may change later (hidden, set, latest, licence, payout) are reported, not failed.',
    action: 'Verify catalogue',
    run: async () => {
      const me = state.deployer!, hot = hotAddress();
      if ((await getAdmin()) !== me) throw new Error('The admin role is not with your wallet. Run the hand-back step.');
      if (!(await isReader(adId()))) throw new Error('The adapter is not allowed in the catalogue.');
      if (!(await isPublisher(me))) throw new Error('Your wallet is not an active publisher.');
      if (await isPublisher(hot)) throw new Error('The temporary wallet is still an active publisher.');
      const cards = await readCatalogue();
      const notes: string[] = [];
      for (const g of GAMES) {
        const id = await gameIdBySlug(g.slug);
        const row = id ? await readGame(id) : null;
        const ver = id ? await readVersion(id, 1) : null;
        const bad = gameProblems(g, row, ver);
        const hit = await byHash(g.romSha);
        if (!hit || hit.id !== id || hit.ver !== 1) bad.push('hash lookup');
        const card = cards.find((c) => c.id === id);
        if (!card || !card.version || card.version.sha !== g.romSha) bad.push('menu card');
        for (const kind of ['cover', 'icon'] as const) {
          const u = upload(g, kind);
          if (!u) continue;
          const meta = await inscriptionMeta(state.ids[u.key]);
          if (!meta || !meta.sealed || meta.creator !== me) bad.push(`${kind} inscription`);
        }
        if (bad.length) throw new Error(`${g.title}: ${bad.join('; ')}.`);
        const flags = [row!.hidden ? 'hidden' : '', row!.set !== '0' ? 'not in the core set' : '', row!.latest !== 1 ? `latest is v${row!.latest}` : ''].filter(Boolean);
        notes.push(`${g.title} #${id}${flags.length ? ` (${flags.join(', ')})` : ''}`);
      }
      return `${GAMES.length} games match what was inscribed · menu read in ${Math.ceil(Number(asText(await readCat('get-count'))) / 10)} page call(s) · ${notes.join(' · ')}`;
    }
  },
  {
    id: 'emu-chain', title: 'Load every game into the emulator through the contract', who: 'Reads only · runs the real emulator in this page',
    intro: `Opens the pinned emulator (v1.0, sha256 ${short(PACK.emulator.sha256)}) in a frame below and does what the Arcade page will: reads the menu from the catalogue and sends it with the covers; clicks Play on each game; fetches the ROM from the core; checks size and SHA-256; hands it to the emulator with its catalogue hash (it shows "Verified on-chain copy"); then runs 300 frames and checks the screen is drawing. Finally it hands the emulator a ROM with one byte changed under a real catalogue hash: the emulator must refuse it. STAR PATROL is also built into the emulator, so its menu entry uses that copy; the canary loads the inscribed copy through the same bridge instead.`,
    action: 'Load games through the contract',
    run: async () => {
      const cards = (await readCatalogue()).filter((c) => GAMES.some((g) => g.slug === c.game.slug) && c.version && !c.version.revoked && !c.game.hidden)
        .sort((a, b) => GAMES.findIndex((g) => g.slug === a.game.slug) - GAMES.findIndex((g) => g.slug === b.game.slug));
      if (cards.length !== GAMES.length) throw new Error(`The menu shows ${cards.length} of ${GAMES.length} games.`);
      const emu = await openEmulator();
      try {
        const entries = [];
        for (const c of cards) {
          const v = c.version!;
          entries.push({ id: String(c.id), ver: String(c.game.latest), title: c.game.title, sha256: v.sha, size: v.size, note: v.note, publisher: short(c.game.owner),
            curated: c.game.set === '0', set: c.game.set === '0' ? 'core' : 'community', cover: await coverUrl(c.game.cover, `${c.game.title} cover`) });
        }
        const ack = await emu.request('catalogue', { games: entries });
        if (ack.count !== entries.length) throw new Error(`The emulator accepted ${ack.count} of ${entries.length} menu entries.`);
        const lines: string[] = [];
        let lastSha = '';
        for (const c of cards) {
          const v = c.version!, title = c.game.title;
          status(`Emulator: ${title}…`);
          const btn = menuButton(emu, title);
          if (!btn) throw new Error(`The emulator menu has no "${title}" entry.`);
          const wanted = emu.expect('want-rom', (m) => m.sha256 === v.sha, 3_000).catch(() => null);
          btn.click();
          const want = await wanted;
          if (want && (String(want.id) !== String(c.id) || String(want.ver) !== String(c.game.latest))) throw new Error(`${title}: the emulator asked for game ${want.id} v${want.ver}, expected ${c.id} v${c.game.latest}.`);
          const route = want ? 'menu → want-rom' : 'built-in menu entry; loaded through the bridge';
          const bytes = await fetchRom(v, title);
          const identity = emu.expect('rom', (m) => m.rom && m.rom.canonicalSha256 === v.sha, 20_000);
          await emu.request('load-rom', { bytes, name: `${c.game.slug}.sfc`, sha256: v.sha }, 30_000);
          await identity;
          const prov = provenanceText(emu);
          if (!/Verified on-chain copy/.test(prov)) throw new Error(`${title}: the emulator shows "${prov || 'nothing'}" instead of "Verified on-chain copy".`);
          const r = await runFrames(emu, 300);
          if (r.colours < 4) throw new Error(`${title}: the screen has only ${r.colours} distinct colours after ${r.frames} frames.`);
          lastSha = v.sha;
          lines.push(`${title} ${kb(bytes.length)} (${route}) verified, ${r.frames} frames, ${r.colours} colours`);
        }
        // A tampered ROM must be refused under a real catalogue hash.
        const first = cards[0], good = await fetchRom(first.version!, first.game.title);
        const bad = good.slice(); bad[Math.floor(bad.length / 2)] ^= 0xff;
        let refusal = '';
        try { await emu.request('load-rom', { bytes: bad, name: 'tampered.sfc', sha256: first.version!.sha }, 30_000); } catch (error) { refusal = errText(error); }
        if (!/do not match the catalogue hash/.test(refusal)) throw new Error(`The emulator did not refuse a tampered ROM (${refusal || 'it loaded it'}).`);
        const info = await emu.request('get-info');
        if (info.rom?.canonicalSha256 !== lastSha) throw new Error('The emulator changed ROM after refusing the tampered one.');
        return `${lines.join(' · ')} · tampered ROM refused ("${refusal.slice(0, 60)}…") and the previous game kept running`;
      } finally { emu.close(); }
    }
  },
  {
    id: 'emu-local', title: 'Load the same ROMs from local files', who: 'Reads only · runs the real emulator in this page',
    intro: 'Feeds each ROM to the emulator through its own file picker, as a player loading a file from disk would. The emulator reports the ROM\'s canonical hash; the canary looks it up in the catalogue (`get-by-hash`) and must land on the same game and version as the inscribed copy, with the label "Local file". A copy with a 512-byte copier header must give the same hash and the same game. A ROM with one byte changed must be unknown to the catalogue (play only, no scores).',
    action: 'Load local files',
    run: async () => {
      const emu = await openEmulator();
      try {
        const lines: string[] = [];
        const identify = async (bytes: Uint8Array, name: string) => {
          const rom = emu.expect('rom', undefined, 20_000);
          loadLocalFile(emu, bytes, name);
          const m = await rom;
          return { sha: m.rom.canonicalSha256 as string, hit: await byHash(m.rom.canonicalSha256) };
        };
        for (const g of GAMES) {
          status(`Local file: ${g.title}…`);
          const id = await gameIdBySlug(g.slug);
          const { sha, hit } = await identify(upload(g, 'rom')!.bytes, `${g.slug}.sfc`);
          if (sha !== g.romSha) throw new Error(`${g.title}: the emulator hashed the local file to ${short(sha)}, expected ${short(g.romSha)}.`);
          if (!hit || hit.id !== id || hit.ver !== 1) throw new Error(`${g.title}: the catalogue does not recognise the local file.`);
          const prov = provenanceText(emu);
          if (!/Local file/.test(prov)) throw new Error(`${g.title}: the emulator shows "${prov || 'nothing'}" instead of "Local file".`);
          const r = await runFrames(emu, 120);
          if (r.colours < 4) throw new Error(`${g.title}: the local copy draws only ${r.colours} colours.`);
          lines.push(`${g.title} → game ${hit.id} v${hit.ver}`);
        }
        const g0 = GAMES[0], rom0 = upload(g0, 'rom')!.bytes;
        const headered = new Uint8Array(rom0.length + 512); headered.set(rom0, 512);
        const hd = await identify(headered, `${g0.slug}-headered.smc`);
        if (hd.sha !== g0.romSha || !hd.hit || hd.hit.id !== (await gameIdBySlug(g0.slug))) throw new Error('A copy with a 512-byte header was not recognised as the same game.');
        const changed = rom0.slice(); changed[changed.length - 1] ^= 0xff;
        const un = await identify(changed, 'modified.sfc');
        if (un.hit) throw new Error('A modified ROM was recognised by the catalogue.');
        return `${lines.join(' · ')} · with a 512-byte copier header the same game · one byte changed → unknown to the catalogue (play only, no scores)`;
      } finally { emu.close(); }
    }
  },
  {
    id: 'emu-id', title: 'Open every game by its inscription ID', who: 'Reads only · runs the real emulator in this page',
    intro: 'The third way in, used by the Arcade page\'s "Open by inscription ID" box (the same wrapper code, `wrapper.ts`). For each game it types the ROM\'s inscription number, lets the wrapper check the inscription is sealed and a sane size, fetch it, hash it and look the hash up in the catalogue: it must land on the right game and version. The bytes go to the emulator WITHOUT a hash, so the emulator must not say "Verified on-chain copy". Then it checks the refusals: an id that does not exist, text that is not a number, another core, a file over the size cap (refused before a single chunk is read), and an inscription that is not a ROM in the catalogue (a cover image: reported as unlisted, play only).',
    action: 'Open games by ID',
    run: async () => {
      let chunkReads = 0;
      const w = createWrapper({ read: (c, f, a) => chain.read(c, f, a), core: CORE, catalogue: catId(), onChunkRead: () => { chunkReads++; } });
      const emu = await openEmulator();
      try {
        const lines: string[] = [];
        for (const g of GAMES) {
          status(`Open by ID: ${g.title}…`);
          const ins = state.ids[`${g.slug}:rom`];
          const r = await w.openById(ins);
          const id = await gameIdBySlug(g.slug);
          if (!r.match || r.match.id !== id || r.match.ver !== 1) throw new Error(`${g.title}: opening #${ins} did not land on game ${id} v1 (${w.describeOpen(r)}).`);
          if (!r.sameInscription) throw new Error(`${g.title}: the wrapper says #${ins} is not the registered inscription.`);
          if (r.sha !== g.romSha) throw new Error(`${g.title}: the wrapper hashed #${ins} to ${short(r.sha)}, expected ${short(g.romSha)}.`);
          const identity = emu.expect('rom', (m) => m.rom && m.rom.canonicalSha256 === g.romSha, 20_000);
          await emu.request('load-rom', { bytes: r.bytes, name: `inscription-${ins}.sfc` }, 30_000); // no sha256, on purpose
          await identity;
          const prov = provenanceText(emu);
          if (/Verified on-chain copy/.test(prov)) throw new Error(`${g.title}: the emulator claims "${prov}" for a ROM opened by ID. The page must never self-verify.`);
          const f = await runFrames(emu, 60);
          if (f.colours < 4) throw new Error(`${g.title}: the ROM opened by ID draws only ${f.colours} colours.`);
          lines.push(`${g.title} #${ins} → game ${r.match.id} v${r.match.ver}`);
        }
        const expectRefusal = async (what: string, input: string, code: string, opts?: { maxBytes?: number }) => {
          const before = chunkReads;
          try { await w.openById(input, opts); } catch (error) {
            if (!(error instanceof WrapperError) || error.code !== code) throw new Error(`${what}: expected the refusal "${code}", got "${errText(error)}".`);
            if (chunkReads !== before) throw new Error(`${what}: refused only after reading chunks.`);
            return code;
          }
          throw new Error(`${what}: was not refused.`);
        };
        await expectRefusal('a missing inscription', String(BAD_ID), 'missing');
        await expectRefusal('text that is not a number', 'abc', 'bad-id');
        await expectRefusal('another core', 'SP1ABC.other-core', 'other-core');
        await expectRefusal('a file over the size cap', state.ids[`${GAMES[0].slug}:rom`], 'too-big', { maxBytes: 1000 });
        const art = GAMES.map((g) => state.ids[`${g.slug}:cover`]).find(Boolean);
        if (!art) throw new Error('No cover inscription to use as an unlisted file.');
        const un = await w.openById(art);
        if (un.match) throw new Error('A cover image was recognised as a catalogue ROM.');
        return `${lines.join(' · ')} · loaded with no hash, so the emulator never said "Verified on-chain copy" · refused: missing id, not a number, another core, over the size cap (no chunk read) · a cover image (#${art}) is unlisted: play only, no scores`;
      } finally { emu.close(); }
    }
  },
  {
    id: 'audit', title: 'Final audit', who: 'Reads only',
    intro: 'Re-reads both contracts and every game one last time and ends with the values the Arcade page needs and the repo edits still to make.',
    action: 'Run audit',
    run: async () => {
      const me = state.deployer!;
      for (const [id, pin] of [[catId(), __CATALOGUE_SHA__], [adId(), __ADAPTER_SHA__]] as const) {
        const src = await chain.contractSource(id);
        if (src === null || !sourceMatches(src, pin)) throw new Error(`${id} is missing or differs from its pin.`);
      }
      if ((await getAdmin()) !== me) throw new Error('The admin is not your wallet.');
      if (await isPublisher(hotAddress())) throw new Error('The temporary wallet is a publisher.');
      const refs: string[] = [];
      for (const g of GAMES) {
        const id = await gameIdBySlug(g.slug);
        const row = id ? await readGame(id) : null, ver = id ? await readVersion(id, 1) : null;
        const bad = gameProblems(g, row, ver);
        if (bad.length) throw new Error(`${g.title}: ${bad.join('; ')}.`);
        for (const u of uploadsOf(g)) { const meta = await inscriptionMeta(state.ids[u.key]); if (!meta || !meta.sealed || meta.hash !== toHex(u.hash)) throw new Error(`${u.label} #${state.ids[u.key]} no longer matches.`); }
        refs.push(`${g.slug}=${id} (ROM #${state.ids[`${g.slug}:rom`]})`);
      }
      return `both contracts match their pins · admin is your wallet · ${GAMES.length} games intact: ${refs.join(', ')} · Next: give the Arcade wrapper catalogue ${catId()}, adapter ${adId()}, core ${CORE}; keep the exported report with the launch record; record the ids in canaries/snes-catalogue/launch-record.json; decide the publisher-gate asset and call set-gate from the Manage panel below; deploy the scores contract and link the boards named in the catalogue.`;
    }
  }
];

// ---------- wallet chooser (opens on every connect) ----------
const chooseWallet = (providers: ProviderInfo[]) => new Promise<string | null>((resolve) => {
  const close = (value: string | null) => { overlay.remove(); document.removeEventListener('keydown', onKey); resolve(value); };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(null); };
  const overlay = el('div', { class: 'chooser', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Choose a wallet' },
    el('div', { class: 'chooser__panel' },
      el('h2', {}, 'Choose a wallet'),
      providers.length
        ? providers.map((p) => el('button', { class: 'chooser__item', type: 'button', onclick: () => close(p.id) },
            p.icon ? el('img', { src: p.icon, alt: '' }) : null, el('span', {}, p.name || p.id), el('code', {}, p.id)))
        : el('p', {}, 'No Stacks wallet extension was found in this window. Install or enable Xverse or Leather for this site, then reload.'),
      el('button', { class: 'button ghost', type: 'button', onclick: () => close(null) }, 'Cancel')));
  document.addEventListener('keydown', onKey);
  document.body.append(overlay);
});

// ---------- rendering ----------
const unlocked = (index: number) => STEPS.slice(0, index).every((x) => step(x.id).status === 'pass');
const needsWallet = (s: Step) => s.who.startsWith('Web wallet');

const renderSteps = () => {
  const root = $('#steps');
  root.replaceChildren(...STEPS.map((s, i) => {
    const st = step(s.id);
    const open = unlocked(i);
    const blockedByWallet = needsWallet(s) && i > 0 && !connected;
    const tone = st.status === 'pass' ? 'success' : st.status === 'fail' ? 'error' : st.status === 'running' ? 'warning' : '';
    return el('section', { class: `step${open ? '' : ' locked'}` },
      el('div', { class: 'step__head' },
        el('span', { class: 'step__number' }, String(i + 1)),
        el('div', {}, el('h2', {}, s.title), el('p', { class: 'who' }, s.who)),
        el('span', { class: 'badge', 'data-tone': tone }, st.status === 'todo' ? (open ? 'ready' : 'locked') : st.status)),
      el('div', { class: 'step__body' },
        el('p', {}, s.intro),
        st.note ? el('p', { class: `note ${st.status}` }, st.note) : null,
        st.txs.length ? el('ul', { class: 'txs' }, st.txs.map((t) => el('li', {}, `${t.label} — ${t.status}${t.result ? ` ${t.result}` : ''} `, el('a', { href: chain.txUrl(t.txid), target: '_blank', rel: 'noopener' }, short(t.txid))))) : null,
        el('div', { class: 'actions' },
          el('button', { class: 'button', type: 'button', 'data-step': s.id, disabled: !open || busy || blockedByWallet, onclick: () => void execute(s) },
            st.status === 'pass' ? `Re-check · ${s.action}` : s.action),
          blockedByWallet && open ? el('span', { class: 'hint' }, 'Reconnect your wallet in step 1 to continue.') : null)));
  }));
  const passed = STEPS.filter((s) => step(s.id).status === 'pass').length;
  $('#summary').textContent = `${passed} of ${STEPS.length} steps passed`;
};

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
    st.status = 'fail'; st.note = errText(error);
    log('error', `${s.title}: ${st.note}`);
    status(`${s.title}: ${st.note}`, 'error');
  } finally {
    busy = false; save(); renderSteps(); renderHeader(); renderManage();
  }
};

const renderInscribing = () => {
  const built = new Date(__BUILT_AT__);
  const rows: [string, string][] = [
    ['Catalogue', `${CAT_NAME} · Clarity 4 · sha256 ${__CATALOGUE_SHA__}`],
    ['Adapter', `${AD_NAME} · Clarity 4 · sha256 ${__ADAPTER_SHA__} · reads ${CORE}`],
    ...GAMES.map((g): [string, string] => {
      const ids = uploadsOf(g).map((u) => state?.ids?.[u.key] ? `${u.kind} #${state.ids[u.key]}` : '').filter(Boolean).join(', ');
      return [g.title, `${kb(g.size)} · ${g.profile || 'no scoring profile'} · sha256 ${g.romSha}${g.cover ? '' : ' · no art'}${ids ? ` · ${ids}` : ''}`];
    }),
    ['Emulator under test', `snes-emulator-v1.0.html · ${kb(PACK.emulator.html.length)} · sha256 ${PACK.emulator.sha256} (not inscribed by this canary)`],
    ['Release', __PACK_SHA__],
    ['Canary built', `${built.toLocaleString()} (your time) · ${__BUILT_AT__} UTC`],
    ['Build stamp', __BUILD__]
  ];
  $('#inscribing').replaceChildren(
    el('div', { class: 'eyebrow' }, 'This canary deploys and inscribes'),
    el('div', { class: 'big' }, `SNES catalogue · ${GAMES.length} games`),
    el('dl', {}, ...rows.flatMap(([k, v]) => [el('dt', {}, k), el('dd', {}, v)])));
  document.title = `SNES catalogue launch canary · ${__BUILD__}`;
};
const renderHeader = () => {
  renderInscribing();
  $('#wallet').textContent = connected ? `${connected.label} · ${short(connected.address)}` : state.deployer ? `run owner ${short(state.deployer)} · not connected` : 'not connected';
  $('#hot').textContent = `${hotAddress()} (key kept in this browser only)`;
  $('#target').textContent = state.deployer ? `${catId()}  ·  ${AD_NAME}  →  ${CORE}` : `<your address>.${CAT_NAME}  ·  ${AD_NAME}  →  ${CORE}`;
  $('#disconnect').toggleAttribute('hidden', !connected);
};

// ---------- management terminal (any time after deployment) ----------
type Snapshot = { admin: string; pending: string | null; gate: string | null; count: number; adapterOk: boolean; games: { id: number; row: GameRow }[] };
let snap: Snapshot | null = null;
const snapshot = async (): Promise<Snapshot> => {
  if (!state.deployer) throw new Error('Connect your wallet first: the canary needs to know the deployer address.');
  if ((await chain.contractSource(catId())) === null) throw new Error(`${catId()} is not deployed yet: there is nothing to manage. Run the launch steps first.`);
  const gateCv = await readCat('get-gate');
  const count = Number(asText(await readCat('get-count')));
  const games: { id: number; row: GameRow }[] = [];
  for (let id = 1; id <= count; id++) { const row = await readGame(id); if (row) games.push({ id, row }); }
  return { admin: await getAdmin(), pending: await getPending(), gate: isNone(gateCv) ? null : cvToString(inner(gateCv)), count, adapterOk: await isReader(adId()), games };
};
/** Refuses before signing unless the chain says this wallet is the admin (or, to accept, the pending admin). */
const requireAdmin = async (mode: 'admin' | 'pending' = 'admin') => {
  const w = requireWallet();
  const admin = await getAdmin();
  if (mode === 'admin' && admin !== w.address) throw new Error(`The catalogue admin is ${admin}, not this wallet (${w.address}). Nothing was sent.`);
  if (mode === 'pending' && (await getPending()) !== w.address) throw new Error(`This wallet is not the pending admin. Nothing was sent.`);
};
const manage = async (label: string, fn: () => Promise<string>) => {
  if (busy) return;
  busy = true; renderSteps(); renderManage();
  status(`${label}…`);
  try {
    const note = await fn();
    snap = await snapshot();
    log('ok', `${label}: ${note}`); status(`${label}: ${note}`, 'ok');
  } catch (error) {
    log('error', `${label}: ${errText(error)}`); status(`${label}: ${errText(error)}`, 'error');
  } finally { busy = false; save(); renderSteps(); renderManage(); }
};
const principalInput = (raw: string, what: string) => {
  const v = raw.trim();
  if (!/^S[PT][0-9A-Z]{20,}(\.[a-zA-Z][a-zA-Z0-9-]*)?$/.test(v)) throw new Error(`${what} must be a Stacks address (SP…) or contract (SP….name).`);
  return v;
};
const uintInput = (raw: string, what: string) => {
  if (!/^[1-9][0-9]{0,9}$/.test(raw.trim())) throw new Error(`${what} must be a whole number of 1 or more.`);
  return Number(raw.trim());
};
const setPublisher = (addr: string, label: string, active: boolean) => manage(active ? 'Enrol publisher' : 'Remove publisher', async () => {
  const who = principalInput(addr, 'Publisher'); await requireAdmin();
  await runTx('manage', uniq('manage', `set-publisher ${short(who)} ${active ? 'on' : 'off'}`), () => walletCall(catId(), 'set-publisher', [principalCV(who), boolCV(active), stringAsciiCV(label.trim().slice(0, 32))]));
  await eventually('Publisher', async () => (((await isPublisher(who)) === active) ? null : 'not changed yet'));
  return `${short(who)} is ${active ? 'now' : 'no longer'} a publisher`;
});
const setHidden = (idRaw: string, hidden: boolean) => manage(hidden ? 'Hide game' : 'Show game', async () => {
  const id = uintInput(idRaw, 'Game id'); await requireAdmin();
  await runTx('manage', uniq('manage', `set-hidden ${id} ${hidden}`), () => walletCall(catId(), 'set-hidden', [uintCV(id), boolCV(hidden)]));
  await eventually('Game', async () => (((await readGame(id))?.hidden) === hidden ? null : 'not changed yet'));
  return `game ${id} is ${hidden ? 'hidden from' : 'shown in'} the menu`;
});
const setSet = (idRaw: string, set: 0 | 1) => manage('Move game', async () => {
  const id = uintInput(idRaw, 'Game id'); await requireAdmin();
  await runTx('manage', uniq('manage', `set-set ${id} ${set}`), () => walletCall(catId(), 'set-set', [uintCV(id), uintCV(set)]));
  await eventually('Game', async () => (((await readGame(id))?.set) === String(set) ? null : 'not changed yet'));
  return `game ${id} is in the ${set === 0 ? 'core' : 'community'} set`;
});
const revokeVersion = (idRaw: string, verRaw: string) => manage('Revoke version', async () => {
  const id = uintInput(idRaw, 'Game id'), ver = uintInput(verRaw, 'Version'); await requireAdmin();
  if (!confirm(`Revoke version ${ver} of game ${id}? The entry stays as history, its hash is freed, and the wrapper stops offering it.`)) throw new Error('Cancelled before anything was sent.');
  await runTx('manage', uniq('manage', `revoke-version ${id}.${ver}`), () => walletCall(catId(), 'revoke-version', [uintCV(id), uintCV(ver)]));
  await eventually('Version', async () => (((await readVersion(id, ver))?.revoked) ? null : 'not revoked yet'));
  return `version ${ver} of game ${id} is revoked`;
});
const setGate = (raw: string) => manage('Set publisher gate', async () => {
  await requireAdmin();
  const v = raw.trim();
  const arg = v === '' || v.toLowerCase() === 'none' ? noneCV() : someCV(principalCV(principalInput(v, 'Gate adapter')));
  await runTx('manage', uniq('manage', `set-gate ${v || 'none'}`), () => walletCall(catId(), 'set-gate', [arg]));
  await eventually('Gate', async () => { const g = await readCat('get-gate'); return (isNone(g) ? '' : cvToString(inner(g))) === (v.toLowerCase() === 'none' ? '' : v) ? null : 'not changed yet'; });
  return v === '' || v.toLowerCase() === 'none' ? 'the publisher gate is off (whitelist only)' : `holders passing ${short(v)} can enrol themselves as publishers`;
});
const proposeAdmin = (raw: string) => manage('Propose new admin', async () => {
  const to = principalInput(raw, 'New admin'); await requireAdmin();
  const typed = window.prompt(`Propose ${to} as the new admin of ${catId()}.\n\nNothing changes until that wallet signs accept-admin. Once it does, this wallet loses every admin power (adapters, publishers, set, revoke). You can withdraw the proposal before it is accepted by proposing your own address.\n\nType ${short(to)} to continue.`);
  if (typed !== short(to)) throw new Error('Cancelled before anything was sent.');
  await runTx('manage', uniq('manage', `propose-admin ${short(to)}`), () => walletCall(catId(), 'propose-admin', [principalCV(to)]));
  await eventually('Pending admin', async () => ((await getPending()) === to ? null : 'not proposed yet'));
  return `${short(to)} is the pending admin`;
});
const acceptAdmin = () => manage('Accept admin role', async () => {
  await requireAdmin('pending');
  await runTx('manage', uniq('manage', 'accept-admin'), () => walletCall(catId(), 'accept-admin', []));
  const me = requireWallet().address;
  await eventually('Admin', async () => ((await getAdmin()) === me ? null : 'not accepted yet'));
  return 'this wallet is now the catalogue admin';
});
const renderManage = () => {
  const intro = $('#manage-intro');
  intro.textContent = !state.deployer
    ? 'Connect your wallet in step 1. This panel works at any time after the catalogue is deployed, with or without the launch steps above.'
    : !connected ? 'Reconnect your wallet in step 1 to use these controls.' : snap
      ? `Admin ${short(snap.admin)}${snap.admin === connected.address ? ' (this wallet)' : ''} · pending ${snap.pending ? short(snap.pending) : 'none'} · gate ${snap.gate ? short(snap.gate) : 'off'} · adapter ${snap.adapterOk ? 'allowed' : 'NOT allowed'} · ${snap.count} game${snap.count === 1 ? '' : 's'}`
      : 'Press "Refresh from chain" to read the catalogue.';
  $('#manage-games').replaceChildren(...(snap?.games ?? []).map(({ id, row }) => el('li', {},
    `#${id} ${row.title} (${row.slug}) · ${row.set === '0' ? 'core' : 'community'} · ${row.hidden ? 'hidden' : 'shown'} · v${row.latest} of ${row.versions} · owner ${short(row.owner)}`)));
  const txs = step('manage').txs;
  $('#manage-txs').replaceChildren(...txs.map((t) => el('li', {}, `${t.label} — ${t.status}${t.result ? ` ${t.result}` : ''} `, el('a', { href: chain.txUrl(t.txid), target: '_blank', rel: 'noopener' }, short(t.txid)))));
  for (const b of Array.from(document.querySelectorAll('#manage button')) as HTMLButtonElement[]) b.disabled = busy || !connected;
};
const val = (id: string) => ($(`#${id}`) as HTMLInputElement).value;
const bindManage = () => {
  $('#m-refresh').addEventListener('click', () => void manage('Refresh from chain', async () => { snap = null; const s = await snapshot(); return `admin ${short(s.admin)} · ${s.count} games`; }));
  $('#m-pub-on').addEventListener('click', () => void setPublisher(val('m-pub'), val('m-pub-label'), true));
  $('#m-pub-off').addEventListener('click', () => void setPublisher(val('m-pub'), val('m-pub-label'), false));
  $('#m-hide').addEventListener('click', () => void setHidden(val('m-game'), true));
  $('#m-show').addEventListener('click', () => void setHidden(val('m-game'), false));
  $('#m-core').addEventListener('click', () => void setSet(val('m-game'), 0));
  $('#m-community').addEventListener('click', () => void setSet(val('m-game'), 1));
  $('#m-revoke').addEventListener('click', () => void revokeVersion(val('m-game'), val('m-ver')));
  $('#m-gate').addEventListener('click', () => void setGate(val('m-gate-in')));
  $('#m-propose').addEventListener('click', () => void proposeAdmin(val('m-admin')));
  $('#m-accept').addEventListener('click', () => void acceptAdmin());
};

const bind = () => {
  renderInscribing();
  $('#build').textContent = `${__BUILD__} · catalogue sha256 ${__CATALOGUE_SHA__.slice(0, 16)}… · adapter sha256 ${__ADAPTER_SHA__.slice(0, 16)}… · release sha256 ${__PACK_SHA__.slice(0, 16)}… · ${GAMES.length} games, ${UPLOADS.length} inscriptions`;
  $('#disconnect').addEventListener('click', async () => { await wallet.disconnect(); connected = null; step('connect').status = 'todo'; snap = null; save(); renderHeader(); renderSteps(); renderManage(); log('info', 'Wallet disconnected.'); });
  $('#export').addEventListener('click', () => {
    const report = { ...state, build: __BUILD__, builtAt: __BUILT_AT__, network: NETWORK, releaseSha256: __PACK_SHA__, catalogueSha256: __CATALOGUE_SHA__, adapterSha256: __ADAPTER_SHA__,
      emulatorSha256: PACK.emulator.sha256, core: CORE, catalogue: state.deployer ? catId() : null, adapter: state.deployer ? adId() : null, temporaryWallet: hotAddress(),
      games: GAMES.map((g) => ({ slug: g.slug, title: g.title, romSha256: g.romSha, size: g.size, profile: g.profile, board: g.board, coreMin: g.coreMin,
        romInscription: state.ids[`${g.slug}:rom`] ?? null, coverInscription: state.ids[`${g.slug}:cover`] ?? null, iconInscription: state.ids[`${g.slug}:icon`] ?? null })) };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `xtrata-snes-catalogue-launch-${Date.now()}.json` }) as HTMLAnchorElement;
    a.click(); URL.revokeObjectURL(a.href);
  });
  $('#keyfile').addEventListener('click', () => downloadHotKey());
  $('#rescue').addEventListener('click', async () => {
    if (busy) return;
    if (!state.deployer) { status('Connect first so the canary knows where to sweep.', 'error'); return; }
    busy = true;
    try { status(`Temporary wallet holds ${stx(await sweepHot('sweep'))}.`, 'ok'); }
    catch (error) { status(`Recovery sweep failed: ${errText(error)}`, 'error'); }
    finally { busy = false; }
  });
  $('#handback').addEventListener('click', async () => {
    if (busy) return;
    if (!state.deployer) { status('Connect first so the canary knows which wallet to hand the admin role back to.', 'error'); return; }
    try { requireWallet(); } catch (error) { status(errText(error), 'error'); return; }
    busy = true;
    try {
      const moved = await handBack();
      const left = await sweepHot('handback');
      status(moved ? `The admin role is back with your wallet. Temporary wallet holds ${stx(left)}.` : `Your wallet already holds the admin role. Temporary wallet holds ${stx(left)}.`, 'ok');
    } catch (error) { status(`Returning the admin role failed: ${errText(error)}`, 'error'); }
    finally { busy = false; }
  });
  $('#forget').addEventListener('click', async () => {
    let hotBalance = 0n;
    try { hotBalance = await chain.balance(hotAddress()); } catch { status('Could not check the temporary wallet balance, so progress was kept. Try again.', 'error'); return; }
    if (hotBalance > SWEEP_TX_FEE && !confirm(`The temporary wallet still holds ${stx(hotBalance)}. Forgetting progress keeps its key, so you can still sweep it later. Continue?`)) return;
    try { localStorage.removeItem(stateKey()); } catch { /* ignore */ }
    load(); restoreLog(); renderHeader(); renderSteps(); renderManage(); status('Local progress cleared. On-chain progress is re-read, so re-running resumes it.', 'ok');
  });
};
const restoreLog = () => {
  $('#log').replaceChildren(...state.log.map((l) => el('div', { class: `log-line ${l.level}` }, el('time', {}, new Date(l.t).toLocaleTimeString()), ' ', l.msg,
    l.txid ? [' ', el('a', { href: chain.txUrl(l.txid), target: '_blank', rel: 'noopener' }, short(l.txid))] : null)));
};

// ---------- boot ----------
load();
wallet.setConnectMessage('Xtrata SNES catalogue launch canary');
if (location.protocol === 'file:') $('#file-banner').removeAttribute('hidden');
if (state.steps.connect?.status === 'pass') state.steps.connect.status = 'todo'; // wallet connection never survives a reload
bind(); bindManage(); restoreLog(); renderHeader(); renderSteps(); renderManage();
