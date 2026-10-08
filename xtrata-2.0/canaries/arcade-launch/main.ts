/**
 * Xtrata Arcade launch canary.
 *
 * Walks an Xtrata Arcade release in the only safe order, each step gated on the one
 * before it and re-reading the chain instead of trusting this page.
 *
 * From v1.4 the arcade is recursive (recursive-apps/xtrata-arcade/README.md). Only the
 * packs that changed since the single-file bundle (#3078) are inscribed; then a small
 * parent is inscribed that loads every part from those packs or from the bundle:
 *
 *   leaderboard contract (deploy only if missing) -> verify it -> inscribe each changed
 *   pack -> inscribe the parent, written with those pack ids, as a recursive child of #55
 *   that depends on the bundle and the packs -> verify every inscription byte for byte and
 *   resolve every one of the hall's parts from the chain exactly as the parent does ->
 *   open a canary board bound to the parent -> submit a real arcade run and re-play it ->
 *   prove a copied run is refused -> close the canary board -> point the 26 production
 *   boards at the parent -> final audit.
 *
 * Wallet logic is the shared canary module (`../collection-v17/wallet.ts`, the port of
 * the X Chess v2 canary, docs/WALLET-PLAYBOOK.md). Every call runs in deny mode with an
 * exact-or-lower STX post-condition.
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
  PostConditionMode,
  principalCV,
  privateKeyToString,
  stringAsciiCV,
  TransactionVersion,
  uintCV,
  type ClarityValue,
  type PostCondition
} from '@stacks/transactions';
import contractSource from '../../contracts/arcade-scores-v2/contracts/xtrata-arcade-scores-v2.clar';
import BOARDS from '../../recursive-apps/xtrata-arcade/boards.json';
import HallParts from '../../recursive-apps/xtrata-arcade/build/hall-parts.cjs';
import ParentRender from '../../recursive-apps/xtrata-arcade/build/parent-render.cjs';
import RELEASE from 'xa:release';
import { Chain, toHex } from '../collection-v17/chain';
import * as wallet from '../collection-v17/wallet';
import type { Net, ProviderInfo } from '../collection-v17/wallet';

declare const __BUILD__: string;
declare const __BUILT_AT__: string;
declare const __SOURCE_SHA__: string;
declare const __RELEASE_SHA__: string;

const PINNED_SHA = __SOURCE_SHA__; // leaderboard contract (the build refuses any other)
const RELEASE_SHA = __RELEASE_SHA__; // the packs + parent shell + part list (the build refuses any other)
const VERSION = RELEASE.version;
const BUNDLE_ID = BigInt(RELEASE.bundle.id);
const DEFAULT_NAME = 'xtrata-arcade-scores-v2';
const CORE_DEFAULT: Record<Net, string> = {
  mainnet: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
  testnet: ''
};
/** Xtrata's standard token URI (same value the app and SDK use). */
const TOKEN_URI = 'https://xvgh3sbdkivby4blejmripeiyjuvji3d4tycym6hgaxalescegjq.arweave.net/vUx9yCNSKhxwKyJZFDyIwmlUo2Pk8CwzxzAuBZJCIZM';
const CHUNK = 16384;
/**
 * Parent inscriptions (Xtrata's "child of" relationship) for everything this canary seals. The core only
 * accepts parents the signing wallet owns at seal time, so preflight checks ownership first. Every arcade
 * release is a child of #55.
 */
const PARENT_IDS: bigint[] = [55n];
const parentList = () => PARENT_IDS.map((p) => `#${p}`).join(', ');
const BATCH = 30; // the app and SDK cap uploads at 30 chunks per transaction
const CANARY_BOARD = 'arcade-canary';
const CANARY_MAX = 1_000_000_000n;
const PROOF_GAME = 'xa_swerve';
const COPY_TX_FEE = 30_000n;
const SWEEP_TX_FEE = 5_000n;
const FUND_AMOUNT = 60_000n;
/** Network fee the temporary wallet pays per call it signs (what is not spent is swept back). */
const TEMP_TX_FEE = 20_000n;
const SAFETY_BUFFER = 3_000_000n; // network fees for the uploads, seals and ~35 small calls

type Board = { id: string; game: string; mode: number; max: number };
const PRODUCTION = BOARDS as Board[];

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
const b64 = (b: Uint8Array) => { let s = ''; b.forEach((x) => { s += String.fromCharCode(x); }); return btoa(s); };
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const concat = (a: Uint8Array, b: Uint8Array) => { const o = new Uint8Array(a.length + b.length); o.set(a, 0); o.set(b, a.length); return o; };
const joinBytes = (list: Uint8Array[]) => { const out = new Uint8Array(list.reduce((n, c) => n + c.length, 0)); let o = 0; for (const c of list) { out.set(c, o); o += c.length; } return out; };

// ---------- what gets inscribed, chunked the way the core hashes it ----------
/** The core's running hash: h0 = 32 zero bytes, h(i+1) = sha256(h(i) || chunk(i)). The final value is the upload's identity. */
const chainHash = (chunks: Uint8Array[]) => { let h: Uint8Array = new Uint8Array(32); for (const c of chunks) h = sha256(concat(h, c)); return h; };
type Upload = { key: string; label: string; mime: string; text: string; bytes: Uint8Array; chunks: Uint8Array[]; hash: Uint8Array; sha: string };
const makeUpload = (key: string, label: string, mime: string, text: string): Upload => {
  const bytes = new TextEncoder().encode(text);
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < bytes.length; i += CHUNK) chunks.push(bytes.subarray(i, Math.min(i + CHUNK, bytes.length)));
  return { key, label, mime, text, bytes, chunks, hash: chainHash(chunks), sha: toHex(sha256(bytes)) };
};
/** The packs that differ from the bundle, in load order. The rest of the hall is read out of the bundle. */
const PACKS: Upload[] = RELEASE.inscribe.map((name) => makeUpload(name, `${name} pack`, 'text/plain', RELEASE.packs[name]));
const PART_NAMES = Object.keys(RELEASE.partSha);

/** The parent's CONFIG for the pack ids this run has inscribed (or adopted). Same renderer as `modular.mjs build`. */
const parentConfig = (packIds: Record<string, string>) => {
  // The parent takes an inscription from the gateway (R2) only when its bytes hash to these values.
  const hashes: Record<string, string> = { [String(RELEASE.bundle.id)]: RELEASE.bundle.sha256 };
  for (const n of RELEASE.inscribe) if (packIds[n]) hashes[String(packIds[n])] = RELEASE.packSha[n];
  return ParentRender.parentConfig({ ...RELEASE.ids, packs: Object.fromEntries(RELEASE.inscribe.map((n) => [n, Number(packIds[n] || 0)])), hashes }, RELEASE.packOrder);
};
let parentCache: { key: string; upload: Upload } | null = null;
const parentUpload = (): Upload => {
  const ids = state.packIds || {};
  const missing = RELEASE.inscribe.filter((n) => !ids[n]);
  if (missing.length) throw new Error(`The ${missing.join(' and ')} pack${missing.length > 1 ? 's have' : ' has'} no inscription id yet. Run the pack steps first.`);
  const key = JSON.stringify(ids);
  if (parentCache?.key !== key) parentCache = { key, upload: makeUpload('parent', 'parent', 'text/html', ParentRender.fillParent(RELEASE.shell, parentConfig(ids))) };
  return parentCache.upload;
};
/** Size of the parent once real ids are in it (ids are at most 7 digits here), for fee quotes before the packs exist. */
const parentEstimate = () => new TextEncoder().encode(ParentRender.fillParent(RELEASE.shell, parentConfig(Object.fromEntries(RELEASE.inscribe.map((n) => [n, '9999999']))))).length;
const parentDeps = (): bigint[] => [BUNDLE_ID, ...RELEASE.inscribe.map((n) => BigInt(state.packIds![n]))];

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

// ---------- state ----------
type TxRec = { label: string; txid: string; status: string; result?: string; pass?: boolean; block?: number };
type StepState = { status: 'todo' | 'running' | 'pass' | 'fail'; note?: string; data: Record<string, any>; txs: TxRec[] };
type State = {
  version: 1;
  contractName: string;
  core: string;
  deployer?: string;
  /** pack name -> inscription id */
  packIds?: Record<string, string>;
  /** the parent: the arcade's engine id on every board */
  inscriptionId?: string;
  /** earlier parents proven to load the same parts (boards on them are left alone) */
  equivalent?: string[];
  run?: { replay: string; score: number; game: string };
  steps: Record<string, StepState>;
  log: { t: string; level: string; msg: string; txid?: string }[];
};

let network: Net = (localStorage.getItem('xtrata-arcade-launch:network') as Net) === 'testnet' ? 'testnet' : 'mainnet';
let chain = new Chain(network);
let state!: State;
let connected: { address: string; publicKey: string | null; label: string } | null = null;
let busy = false;

// Progress is per release, so a new arcade version starts its own gated run.
const stateKey = () => `xtrata-arcade-launch:v2:${network}:${RELEASE_SHA.slice(0, 12)}`;
const hotKeyName = () => `xtrata-arcade-launch:hot:${network}`;
const freshState = (): State => ({ version: 1, contractName: DEFAULT_NAME, core: CORE_DEFAULT[network], packIds: {}, steps: {}, log: [] });
const load = () => {
  try { const raw = localStorage.getItem(stateKey()); state = raw ? { ...freshState(), ...JSON.parse(raw) } : freshState(); } catch { state = freshState(); }
};
const save = () => { try { localStorage.setItem(stateKey(), JSON.stringify(state)); } catch { /* storage unavailable */ } };
const step = (id: string): StepState => (state.steps[id] ??= { status: 'todo', data: {}, txs: [] });
const scoresId = () => `${state.deployer}.${state.contractName}`;

const log = (level: 'info' | 'ok' | 'warn' | 'error', msg: string, txid?: string) => {
  const line = el('div', { class: `log-line ${level}` }, el('time', {}, new Date().toLocaleTimeString()), ' ', msg,
    txid ? [' ', el('a', { href: chain.txUrl(txid), target: '_blank', rel: 'noopener' }, short(txid))] : null);
  $('#log').prepend(line);
  state.log.unshift({ t: new Date().toISOString(), level, msg, txid });
  state.log = state.log.slice(0, 400);
  save();
  (level === 'error' ? console.warn : console.info)('[arcade-launch]', msg, txid ?? '');
};
const status = (text: string, tone: 'info' | 'ok' | 'warn' | 'error' = 'info') => { const s = $('#status'); s.textContent = text; s.dataset.tone = tone; };

// ---------- throwaway "copycat" wallet ----------
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
const hotAddress = () => getAddressFromPrivateKey(hotKey(), network === 'mainnet' ? TransactionVersion.Mainnet : TransactionVersion.Testnet);

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
    postConditions: pcs, postConditionMode: PostConditionMode.Deny, network, stxAddress: w.address, onProgress: progress,
    buildUnsigned: w.publicKey ? () => unsignedCall(target, fn, args, pcs) : undefined });
  return settle(result);
};
const walletTransfer = async (recipient: string, amount: bigint, memo: string) => {
  const w = requireWallet();
  const result = await wallet.stxTransfer({ recipient, amount, memo, network, stxAddress: w.address, onProgress: progress,
    buildUnsigned: w.publicKey ? async () => {
      const nonce = await chain.nonce(w.address);
      return toHex((await makeUnsignedSTXTokenTransfer({ recipient, amount, memo, publicKey: w.publicKey!, network: chain.stacks, nonce, fee: 5_000n, anchorMode: AnchorMode.Any })).serialize());
    } : undefined });
  return settle(result);
};
const payAtMost = (amount: bigint) => [makeStandardSTXPostCondition(requireWallet().address, FungibleConditionCode.LessEqual, amount)];

/**
 * Sends once, remembers the txid, and on reload resumes waiting instead of re-sending.
 * `expect` = the exact failing result a step is designed to produce (e.g. "(err u113)").
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

// ---------- the temporary wallet: pays for, and signs, a long run of owner calls ----------
/** A label that stays the same while a transaction is pending (so a reload resumes) and changes once it has passed (so a later run sends again). */
const uniq = (stepId: string, base: string) => `${base} (${step(stepId).txs.filter((t) => t.pass && t.label.startsWith(`${base} (`)).length + 1})`;
/** The temporary wallet signs a call on the leaderboard contract with its own key. */
const hotCall = (stepId: string, label: string, fn: string, args: ClarityValue[]) =>
  runTx(stepId, uniq(stepId, label), async () => {
    const hot = hotAddress();
    const [address, name] = scoresId().split('.');
    const nonce = await chain.nonce(hot);
    const tx = await makeContractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
      senderKey: hotKey(), network: chain.stacks, nonce, fee: TEMP_TX_FEE, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: [] });
    return chain.broadcast(tx);
  });
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
      await runTx(stepId, uniq(stepId, `${what}: send ${stx(need)} to the temporary wallet`), () => walletTransfer(hot, need, 'arcade canary'));
      sent = true;
    } catch (error) {
      // A cancelled request is the user's decision; anything else falls back to sending the float by hand.
      const message = error instanceof Error ? error.message : String(error);
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
    const tx = await makeSTXTokenTransfer({ recipient: state.deployer!, amount: balance - SWEEP_TX_FEE, senderKey: hotKey(), network: chain.stacks, nonce, fee: SWEEP_TX_FEE, memo: 'arcade launch canary sweep', anchorMode: AnchorMode.Any });
    return chain.broadcast(tx);
  });
  return chain.balance(hot);
};
/** Fees the temporary wallet needs for `n` board updates, accepting ownership, handing it back, and the sweep, with a margin. */
const boardFloat = (n: number, o: { propose?: boolean; accept?: boolean } = {}) =>
  TEMP_TX_FEE * BigInt(n + (o.propose === false ? 0 : 1) + (o.accept === false ? 0 : 1)) + SWEEP_TX_FEE + 20_000n;
/** Which boards still need updating, and who owns the contract, read from the chain. */
const boardPlan = async () => {
  const todo: Board[] = [];
  for (const b of PRODUCTION) if (!boardMatches(await readBoard(b.id), b)) todo.push(b);
  return { todo, owner: await ownerOf(), pending: await pendingOwnerOf() };
};
/**
 * Gives contract ownership back to the deployer if the temporary wallet holds it: the temporary wallet proposes, the connected
 * wallet accepts. Safe to call at any point; does nothing when ownership is already back.
 */
const handBack = async () => {
  const me = state.deployer!, hot = hotAddress();
  let owner = await ownerOf();
  if (owner === me) return false;
  if (owner !== hot) throw new Error(`The leaderboard is owned by ${owner}, which is neither your wallet nor the temporary wallet.`);
  await ensureHotFunds('production', TEMP_TX_FEE + SWEEP_TX_FEE + 20_000n, 'handing ownership back');
  if ((await pendingOwnerOf()) !== me) {
    await hotCall('production', 'temporary wallet hands ownership back (propose)', 'propose-owner', [principalCV(me)]);
    await eventually('Pending owner', async () => ((await pendingOwnerOf()) === me ? null : 'not proposed yet'));
  }
  await runTx('production', uniq('production', 'your wallet accepts ownership back'), () => walletCall(scoresId(), 'accept-owner', []));
  await eventually('Owner', async () => ((await ownerOf()) === me ? null : 'not accepted yet'));
  log('ok', `Leaderboard ownership is back with ${short(me)}.`);
  return true;
};
/** A backup copy of the temporary wallet's key, saved to disk before it is ever given ownership. */
const downloadHotKey = () => {
  const blob = new Blob([JSON.stringify({ purpose: 'Xtrata arcade launch canary temporary wallet', network, address: hotAddress(), privateKey: hotKey(),
    note: 'Keep this file until the canary reports that contract ownership is back with your wallet. Anyone holding it can act as the leaderboard owner while ownership is with this wallet.' }, null, 2)], { type: 'application/json' });
  const a = el('a', { href: URL.createObjectURL(blob), download: `xtrata-arcade-temp-wallet-${hotAddress().slice(0, 8)}.json` }) as HTMLAnchorElement;
  a.click(); URL.revokeObjectURL(a.href);
};

// ---------- reads ----------
const eventually = async (what: string, check: () => Promise<string | null>, attempts = 23) => {
  let seen: string | null = null;
  for (let i = 0; i < attempts; i++) {
    try { seen = await check(); } catch (error) { seen = `read failed: ${error instanceof Error ? error.message : String(error)}`; }
    if (seen === null) return;
    if (i === 0) log('info', `${what}: chain still shows ${seen}; waiting for it to catch up…`);
    status(`${what}: waiting for the chain to catch up (${(i + 1) * 4}s)…`, 'warn');
    await sleep(4000);
  }
  throw new Error(`${what}: the chain still shows ${seen} after 90s. The transaction itself is confirmed; press the button again in a minute to re-check (nothing is re-sent).`);
};
const readScores = (fn: string, args: ClarityValue[] = []) => chain.read(scoresId(), fn, args);
const readCore = (fn: string, args: ClarityValue[] = []) => chain.read(state.core, fn, args);
const topEntries = async (board: string, period = 0n) => {
  const list: any = await readScores('get-top10', [stringAsciiCV(board), uintCV(period)]);
  return (list.list as ClarityValue[]).filter((o: any) => o.type === ClarityType.OptionalSome).map((o: any) => {
    const t = o.value.data;
    return { player: cvToString(t.player), name: t.name.data as string, score: BigInt(t.score.value), hash: toHex(bufOf(t['replay-hash'])) };
  });
};
const readBoard = async (id: string) => {
  const cv = await readScores('get-board', [stringAsciiCV(id)]);
  if (isNone(cv)) return null;
  const f = (k: string) => asText(tupleField(cv, k));
  return { mode: f('mode'), maxScore: f('max-score'), fee: f('fee'), engineId: f('engine-id'), daily: f('daily'), enabled: f('enabled') };
};
const ownerOf = async () => cvToString(inner(await readScores('get-owner')));
const pendingOwnerOf = async () => { const cv = await readScores('get-pending-owner'); return isNone(cv) ? null : cvToString(inner(cv)); };
/** Engines a production board may point at: this parent, or an earlier parent proven (in preflight) to load the same parts. */
const engineOk = (engineId: string) => engineId === state.inscriptionId || (state.equivalent || []).includes(engineId);
/** The canary board is closed and bound to this parent: the board, submit, copy and close steps all ran in an earlier session. */
const canaryDone = async () => { const b = await readBoard(CANARY_BOARD); return !!b && b.enabled === 'false' && b.engineId === state.inscriptionId; };
const boardMatches = (b: Awaited<ReturnType<typeof readBoard>>, want: Board) =>
  !!b && b.mode === String(want.mode) && b.maxScore === String(want.max) && b.fee === '0' && engineOk(b.engineId) && b.daily === 'false' && b.enabled === 'true';
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
/** One-transaction inscription (up to 32 chunks, 512 KB): the whole cost, begin + upload + seal together. */
const SINGLE_MAX_CHUNKS = 32;
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
const idList = async (fn: 'get-parents' | 'get-dependencies', id: string): Promise<string[]> => {
  const cv: any = inner(await readCore(fn, [uintCV(BigInt(id))]));
  return ((cv.list ?? []) as ClarityValue[]).map((x) => asText(x));
};
const sameIds = (have: string[], want: bigint[]) => have.length === want.length && want.every((p) => have.includes(p.toString()));
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
/**
 * An earlier parent counts as the same engine when, on chain, it is sealed by this wallet and its CONFIG loads
 * exactly the same packs over the same bundle with no single-part overrides: then it assembles exactly the same parts.
 */
const provenEquivalents = async (owner: string, packIds: Record<string, string>) => {
  const proven: string[] = [];
  const notes: string[] = [];
  for (const raw of RELEASE.equivalentParents || []) {
    const id = String(raw);
    try {
      const meta = await inscriptionMeta(id);
      if (!meta || !meta.sealed || meta.mime !== 'text/html' || meta.creator !== owner) { notes.push(`#${id} is not a parent sealed by this wallet`); continue; }
      const text = new TextDecoder().decode(joinBytes(await readChunks(id, meta.chunks, `earlier parent`)));
      const m = /var CONFIG = (\{[\s\S]*?\n    \});/.exec(text);
      const cfg = m ? JSON.parse(m[1]) : null;
      const same = !!cfg && Number(cfg.bundleId) === RELEASE.bundle.id && Object.keys(cfg.parts || {}).length === 0 &&
        RELEASE.packOrder.every((n) => Number(cfg.packs?.[n] || 0) === (RELEASE.inscribe.includes(n) ? Number(packIds[n] || -1) : 0));
      if (same) proven.push(id); else notes.push(`#${id} loads different packs`);
    } catch (error) { notes.push(`#${id} could not be read (${error instanceof Error ? error.message : String(error)})`); }
  }
  return { proven, notes };
};
/** Every chunk of an inscription, read back from the core in batches. */
const readChunks = async (id: string, total: number, label: string) => {
  const out: Uint8Array[] = [];
  const per = 10;
  for (let i = 0; i < total; i += per) {
    status(`Reading ${label} (#${id}) back… ${Math.min(i + per, total)} of ${total} chunks`);
    const idxs = Array.from({ length: Math.min(per, total - i) }, (_, k) => uintCV(BigInt(i + k)));
    const cv: any = inner(await readCore('get-chunk-batch', [uintCV(BigInt(id)), listCV(idxs)]));
    const items = cv.list as ClarityValue[];
    if (items.length !== idxs.length) throw new Error(`Chunk read of #${id} returned ${items.length} of ${idxs.length} chunks at ${i}.`);
    for (const it of items) out.push(bufOf(it));
  }
  return out;
};

// ---------- inscribing one file: begin, upload, seal (each resumable from the chain) ----------
const inscribe = async (sid: string, f: Upload, deps: bigint[]) => {
  const w = requireWallet();
  const existing = await findSealed(f);
  if (existing) {
    const parents = await idList('get-parents', existing.id);
    const warn = sameIds(parents, PARENT_IDS) ? '' : ` · note: it has parents [${parents.map((x) => '#' + x).join(', ') || 'none'}], not ${parentList()}`;
    return { id: existing.id, sent: false, note: `already on chain as #${existing.id}${existing.meta.creator === w.address ? '' : ` (inscribed by ${short(existing.meta.creator)})`}, identical bytes; re-used, nothing sent${warn}` };
  }
  const n = f.chunks.length;
  // A file that fits in one transaction is inscribed in one signature. A half-finished staged upload (or a file over
  // 32 chunks) goes through the staged route below, which resumes from the chain.
  let id = '';
  if (n <= SINGLE_MAX_CHUNKS && (await uploadIndex(f)) === null) {
    const fee = await singleFee(f.bytes.length, n);
    await runTx(sid, `${f.label}: inscribe (one transaction)`, () => walletCall(state.core, 'mint-single-tx-with-relationships',
      [bufferCV(f.hash), stringAsciiCV(f.mime), uintCV(f.bytes.length), listCV(f.chunks.map((c) => bufferCV(c))), stringAsciiCV(TOKEN_URI),
        listCV(deps.map((d) => uintCV(d))), listCV(PARENT_IDS.map((p) => uintCV(p)))], payAtMost(fee)));
    await eventually(`${f.label} inscription id`, async () => {
      const found = await findSealed(f);
      if (!found) return 'not sealed yet';
      if (found.meta.creator !== w.address) return `sealed by ${short(found.meta.creator)}`;
      id = found.id; return null;
    });
    return { id, sent: true, note: `inscribed in one transaction as #${id} (${kb(f.bytes.length)}, ${n} chunk${n > 1 ? 's' : ''}), child of ${parentList()}${deps.length ? `, depends on ${deps.map((d) => '#' + d).join(', ')}` : ''}` };
  }
  const fees = await stagedFees(f.bytes.length, n);
  if ((await uploadIndex(f)) === null) {
    await runTx(sid, `${f.label}: begin`, () => walletCall(state.core, 'begin-or-get',
      [bufferCV(f.hash), stringAsciiCV(f.mime), uintCV(f.bytes.length), uintCV(n)], payAtMost(fees.begin)));
  }
  await eventually(`${f.label} upload session`, async () => ((await uploadIndex(f)) === null ? 'no session yet' : null));
  let idx = (await uploadIndex(f))!;
  while (idx < n) {
    const from = idx, end = Math.min(idx + BATCH, n);
    status(`Uploading ${f.label} chunks ${from + 1}–${end} of ${n}…`);
    await runTx(sid, `${f.label}: chunks ${from}-${end - 1}`, () => walletCall(state.core, 'add-chunk-batch',
      [bufferCV(f.hash), listCV(f.chunks.slice(from, end).map((c) => bufferCV(c)))]));
    await eventually(`${f.label} chunk progress`, async () => { const i = await uploadIndex(f); return i !== null && i >= end ? null : `index ${i}`; });
    idx = (await uploadIndex(f))!;
  }
  await runTx(sid, `${f.label}: seal`, () => walletCall(state.core, 'seal-with-relationships',
    [bufferCV(f.hash), stringAsciiCV(TOKEN_URI), listCV(deps.map((d) => uintCV(d))), listCV(PARENT_IDS.map((p) => uintCV(p)))], payAtMost(fees.seal)));
  await eventually(`${f.label} inscription id`, async () => {
    const found = await findSealed(f);
    if (!found) return 'not sealed yet';
    if (found.meta.creator !== w.address) return `sealed by ${short(found.meta.creator)}`;
    id = found.id; return null;
  });
  return { id, sent: true, note: `sealed as #${id} (${kb(f.bytes.length)}, ${n} chunk${n > 1 ? 's' : ''}), child of ${parentList()}${deps.length ? `, depends on ${deps.map((d) => '#' + d).join(', ')}` : ''}` };
};

// ---------- the arcade engine, run in a hidden frame from the embedded file ----------
/** Loads the single-file build of the same parts that get inscribed, headless, so the canary flies and verifies a real arcade run. */
const withArcade = async <T,>(fn: (win: any) => Promise<T>): Promise<T> => {
  const frame = el('iframe', { style: 'position:fixed;left:-9999px;top:0;width:900px;height:700px;border:0', title: 'arcade engine (hidden)' }) as HTMLIFrameElement;
  frame.srcdoc = RELEASE.single;
  document.body.append(frame);
  try {
    const win: any = frame.contentWindow;
    const t0 = Date.now();
    while (!(win && win.XA && win.XA.replay && win.XA.games && win.XA.games.length && win.document.readyState === 'complete')) {   // every inline cartridge has run, not just the first
      if (Date.now() - t0 > 60_000) throw new Error('The embedded arcade did not start in a hidden frame.');
      await sleep(300);
    }
    return await fn(win);
  } finally { frame.remove(); }
};
/** Same driver the replay test used: real Input object, recorder wrapped around the fixed-step loop, pseudo-random pilot. */
const flyRun = (win: any, address: string, gameId: string, seed: number) => {
  const XA = win.XA;
  const game = XA.games.find((g: any) => g.id === gameId);
  if (!game) throw new Error(`Game ${gameId} is not in the embedded arcade.`);
  const mode = game.mode;
  const pilot = XA.replay.pilotFor(address);
  if (!pilot) throw new Error('This address cannot pilot a ranked run.');
  const nonce = (seed * 7919 + 13) >>> 0;
  const sd = XA.replay.seedFor(pilot.hash160, nonce, XA.replay.gameIndex(game));
  const stage = win.document.createElement('div'); win.document.body.appendChild(stage);
  const input = XA.createInput(stage);
  const st = { score: 0, over: false, completed: false };
  const U = XA.util, W = game.size.w, H = game.size.h, q = XA.replay.qpt;
  let px = W / 2, py = H / 2, pm = 0, pd = false;
  const api: any = { W, H, input, audio: XA.audio, fx: XA.createFx(), rng: U.rng(sd), seed: sd, ranked: true, shake() {}, setStatus() {},
    addScore(n: number) { if (!st.over) st.score += Math.max(0, Math.floor(n)); }, setScore(n: number) { if (!st.over) st.score = Math.max(0, Math.floor(n)); },
    getScore: () => st.score, gameOver() { st.over = true; }, finish() { if (!st.over) { st.completed = true; st.over = true; } },
    mode, variant: null, pointer: () => ({ x: q(px), y: q(py), down: pd, moved: pm }) };
  const rec = XA.replay.record(game, null, pilot, nonce, input, api.pointer);
  const inst = game.create(api);
  const rnd = U.rng(seed * 31 + 5);
  const keys = ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'd', 'k1', 'k2', 'k3', 'f'];
  const release: Record<string, number> = {};
  let steps = 0;
  for (; steps < 20000 && !st.over; steps++) {
    for (const k of keys) {
      if (release[k] !== undefined && steps >= release[k]) { input.release(k); delete release[k]; }
      else if (release[k] === undefined && rnd() < 0.05) { input.press(k); release[k] = steps + 3 + Math.floor(rnd() * 12); }
    }
    if (rnd() < 0.5) { px = Math.max(0, Math.min(W, px + (rnd() - 0.5) * W * 0.2)); py = Math.max(0, Math.min(H, py + (rnd() - 0.5) * H * 0.2)); pm++; }
    if (rnd() < 0.03) pd = !pd;
    rec.before(); inst.update(1 / 60); rec.after(); input.endFrame();
  }
  input.destroy && input.destroy();
  stage.remove();
  return { st, rec, steps };
};
const makeRun = async (address: string) => withArcade(async (win) => {
  for (let seed = 1; seed <= 24; seed++) {
    status(`Flying a canary run in the arcade engine… attempt ${seed}`);
    await sleep(0);
    const { st, rec } = flyRun(win, address, PROOF_GAME, seed);
    if (!st.over || !(st.score > 0)) continue;
    const bytes: Uint8Array | null = await rec.finish(st.score, st.completed);
    if (!bytes) continue;
    const v = await win.XA.replay.verify(bytes, { address, score: st.score });
    if (!v.ok) throw new Error(`The arcade could not verify its own run (${v.reason}). Do not continue; report this.`);
    return { replay: b64(new Uint8Array(bytes)), score: st.score, game: PROOF_GAME };
  }
  throw new Error('Could not fly a scoring run in 24 attempts.');
});

type Step = { id: string; title: string; who: string; intro: string; action: string; run: () => Promise<string | void> };
const sigs = (f: { chunks: number }) => (f.chunks <= SINGLE_MAX_CHUNKS ? 1 : 2 + Math.ceil(f.chunks / BATCH));

const packStep = (f: Upload): Step => ({
  id: `pack-${f.key}`, title: `Inscribe the ${f.label}`, who: `Web wallet · ${sigs({ chunks: f.chunks.length })} signature${sigs({ chunks: f.chunks.length }) === 1 ? '' : 's'}`,
  intro: `Inscribes the ${f.label} (${HallParts.PACKS[f.key].join(', ')}): ${f.bytes.length.toLocaleString()} bytes, ${f.chunks.length} chunk${f.chunks.length > 1 ? 's' : ''}, sha256 ${short(f.sha)}. Begin, upload and seal, each resumed from the chain's own progress after a reload or a rejected signature; the fees are capped by post-conditions. If these exact bytes are already inscribed, that inscription is re-used and nothing is sent.`,
  action: `Inscribe ${f.label}`,
  run: async () => {
    const r = await inscribe(`pack-${f.key}`, f, []);
    state.packIds = { ...(state.packIds || {}), [f.key]: r.id }; save(); renderHeader();
    return `${f.label}: ${r.note}`;
  }
});

const STEPS: Step[] = [
  {
    id: 'connect', title: 'Connect your web wallet', who: 'Web wallet',
    intro: 'Opens the wallet chooser, then the wallet\'s own account picker. This account owns the leaderboard and #55, inscribes the release and points the boards at it.',
    action: 'Connect wallet',
    run: async () => {
      const result = await wallet.connect(network, chooseWallet);
      if (!result.isConnected) {
        if (result.wrongNetwork) throw new Error(`The wallet returned a ${result.wrongNetwork} address (${result.address}). Switch the wallet to ${network} and connect again.`);
        throw new Error('Connection was cancelled or returned no Stacks address.');
      }
      if (state.deployer && state.deployer !== result.address && Object.entries(state.steps).some(([id, s]) => id !== 'connect' && s.status === 'pass')) {
        connected = null;
        throw new Error(`This run belongs to ${state.deployer}; the wallet picked ${result.address}. Pick that account, or use "Forget local progress" to start over.`);
      }
      connected = { address: result.address, publicKey: result.publicKey, label: wallet.walletLabel() };
      state.deployer = result.address; save();
      renderHeader();
      let balance = 'could not check';
      try { balance = stx(await chain.balance(result.address)); } catch { /* shown as could not check */ }
      return `${connected.label} · ${result.address} · balance ${balance}${result.publicKey ? '' : ' · no public key (sign-only fallback unavailable)'}`;
    }
  },
  {
    id: 'preflight', title: 'Preflight: release, bundle, core contract, funds', who: 'Reads only',
    intro: `Checks the embedded packs and parent against their pins, checks on chain that #${RELEASE.bundle.id} holds exactly the bundle the unchanged parts come from, checks this wallet owns ${parentList()}, confirms the core is open and quotes every inscription fee, flies a real run in the ${VERSION} arcade, and looks for anything already done so a re-run resumes instead of repeating.`,
    action: 'Run preflight',
    run: async () => {
      const w = requireWallet();
      if (shaHex(contractSource) !== PINNED_SHA) throw new Error('Embedded leaderboard contract does not match its pin. Rebuild the canary.');
      for (const f of PACKS) if (f.sha !== RELEASE.packSha[f.key]) throw new Error(`Embedded ${f.label} is ${f.sha}, not the pinned ${RELEASE.packSha[f.key]}. Rebuild the canary.`);
      if (shaHex(RELEASE.shell) !== RELEASE.shellSha) throw new Error('Embedded parent does not match its pin. Rebuild the canary.');
      if (shaHex(RELEASE.single) !== RELEASE.singleSha) throw new Error('Embedded single-file arcade does not match its pin. Rebuild the canary.');
      // Every part the parent will load resolves to the pinned bytes: packs from this page, the rest from the bundle (checked on chain below).
      for (const f of PACKS) {
        const got = HallParts.parsePack(f.text);
        for (const p of HallParts.PACKS[f.key]) if (shaHex(got[p]) !== RELEASE.partSha[p]) throw new Error(`The ${f.label} does not carry the pinned ${p}.`);
      }
      if (!state.core) throw new Error('Enter the core inscription contract for this network.');
      const paused = asText(await readCore('is-paused'));
      let admin = '';
      try { admin = asText(await readCore('get-admin')); } catch { /* optional read */ }
      if (paused !== 'false' && admin !== w.address) throw new Error('The core inscription contract is paused, and this wallet is not its admin.');
      // The bundle every unchanged part is read from.
      const bundle = await inscriptionMeta(String(BUNDLE_ID));
      if (!bundle) throw new Error(`Bundle #${BUNDLE_ID} does not exist on this core.`);
      if (!bundle.sealed || bundle.hash !== RELEASE.bundle.chainHash || bundle.size !== RELEASE.bundle.bytes)
        throw new Error(`#${BUNDLE_ID} is not the pinned bundle (sealed ${bundle.sealed}, ${bundle.size} bytes, hash ${short(bundle.hash)}; expected ${RELEASE.bundle.bytes} bytes, hash ${short(RELEASE.bundle.chainHash)}).`);
      // Parents: each must exist and be owned by this wallet, or the seals would be refused (u111 / u100).
      for (const p of PARENT_IDS) {
        const ownerCv = await readCore('get-owner', [uintCV(p)]);
        if (isNone(ownerCv)) throw new Error(`Parent inscription #${p} does not exist on this core.`);
        const owner = asText(ownerCv);
        if (owner !== w.address) throw new Error(`Parent inscription #${p} is owned by ${owner}, not this wallet (${w.address}). Connect the wallet that holds #${p}, or move it there first.`);
      }
      // Scores contract
      const existing = await chain.contractSource(scoresId());
      let deployed: 'free' | 'ours' = 'free';
      let boardsNow = '';
      if (existing !== null) {
        if (shaHex(existing) !== PINNED_SHA && shaHex(existing.replace(/\r\n/g, '\n')) !== PINNED_SHA) throw new Error(`${scoresId()} already exists with different source. Choose another contract name.`);
        deployed = 'ours';
        const b = await readBoard(PRODUCTION[0].id);
        boardsNow = b ? ` · boards currently point at engine #${b.engineId}` : ' · no production boards yet';
      }
      // Fees and anything already inscribed.
      let need = SAFETY_BUFFER;
      const plan: string[] = [];
      const known: Record<string, string> = { ...(state.packIds || {}) };
      for (const f of PACKS) {
        const found = await findSealed(f);
        if (found) { known[f.key] = found.id; plan.push(`${f.key} already #${found.id}`); continue; }
        const fee = await inscribeFee(f.bytes.length, f.chunks.length);
        need += fee;
        plan.push(`${f.key} ${kb(f.bytes.length)} (${stx(fee)})`);
      }
      state.packIds = known;
      let parentNote = '';
      if (PACKS.every((f) => known[f.key])) {
        const found = await findSealed(parentUpload());
        if (found) { state.inscriptionId = found.id; parentNote = `parent already #${found.id}`; }
      }
      if (!parentNote) {
        const size = parentEstimate();
        const fee = await inscribeFee(size, Math.ceil(size / CHUNK));
        need += fee;
        parentNote = `parent ~${kb(size)} (${stx(fee)})`;
      }
      plan.push(parentNote);
      let equivalentNote = '';
      if (PACKS.every((f) => known[f.key]) && (RELEASE.equivalentParents || []).length) {
        const eq = await provenEquivalents(w.address, known);
        state.equivalent = eq.proven;
        equivalentNote = eq.proven.length
          ? ` · boards already on ${eq.proven.map((x) => '#' + x).join(', ')} (proven to load the same parts) are left as they are`
          : '';
        if (eq.notes.length) equivalentNote += ` · not treated as the same engine: ${eq.notes.join('; ')}`;
      } else state.equivalent = [];
      save();
      if (!state.run) { state.run = await makeRun(w.address); save(); }
      const balance = await chain.balance(w.address);
      const funds = balance < need ? ` · WARNING balance ${stx(balance)} is below the ~${stx(need)} this run needs` : ` · balance ${stx(balance)} covers the ~${stx(need)} needed`;
      step('preflight').data = { deployed };
      return `Xtrata Arcade ${VERSION} · release ${short(RELEASE_SHA)} · bundle #${BUNDLE_ID} verified on chain (${RELEASE.fromBundle.join(', ')} come from it) · ${parentList()} owned by this wallet · core open · to inscribe: ${plan.join(', ')} · real run flown: ${state.run.game} scored ${state.run.score} and verified · leaderboard ${deployed === 'ours' ? 'already deployed' : 'name is free'}${boardsNow}${equivalentNote}${funds}`;
    }
  },
  {
    id: 'deploy', title: 'Deploy the leaderboard contract', who: 'Web wallet',
    intro: 'Deploys xtrata-arcade-scores-v2 at Clarity 4 if it is not already on chain with the pinned source. Skipped automatically when it is (every release after the first).',
    action: 'Deploy contract',
    run: async () => {
      if (step('preflight').data.deployed === 'ours') return 'already deployed with the pinned source; nothing to send';
      const w = requireWallet();
      const rec = await runTx('deploy', 'deploy', async () => settle(await wallet.deployContract({ contractName: state.contractName, codeBody: contractSource, clarityVersion: 4, network, stxAddress: w.address, onProgress: progress })));
      return `deployed in block ${rec.block}`;
    }
  },
  {
    id: 'verify', title: 'Verify the leaderboard contract', who: 'Reads only',
    intro: 'Re-reads the deployed source and state: pinned source, you own it, it is not paused, it can read the Bitcoin day.',
    action: 'Verify',
    run: async () => {
      let source: string | null = null;
      await eventually('Contract visibility', async () => { source = await chain.contractSource(scoresId()); return source === null ? 'not visible yet' : null; });
      if (shaHex(source!) !== PINNED_SHA && shaHex(source!.replace(/\r\n/g, '\n')) !== PINNED_SHA) throw new Error('Deployed source differs from the pinned source.');
      const owner = asText(await readScores('get-owner'));
      if (owner !== state.deployer) throw new Error(`Owner is ${owner}, expected ${state.deployer}.`);
      if (asText(await readScores('is-paused')) !== 'false') throw new Error('The leaderboard contract is paused.');
      return `source matches · owner ${short(owner)} · not paused · current Bitcoin day ${asText(await readScores('current-period'))}`;
    }
  },
  ...PACKS.map(packStep),
  {
    id: 'parent', title: 'Inscribe the recursive parent', who: 'Web wallet · 1 signature',
    intro: `Writes the pack ids from the steps above into the parent (${VERSION}; ${RELEASE.inscribe.map((n) => `${n} from its pack`).join(', ')}, ${RELEASE.fromBundle.join(', ')} from #${RELEASE.bundle.id}) and inscribes it as text/html, a child of ${parentList()} that depends on #${RELEASE.bundle.id} and the packs. This inscription is the arcade people open, and every board's engine id.`,
    action: 'Inscribe parent',
    run: async () => {
      const f = parentUpload();
      const r = await inscribe('parent', f, parentDeps());
      state.inscriptionId = r.id; save(); renderHeader();
      return `Xtrata Arcade ${VERSION} parent: ${r.note} · ${f.bytes.length.toLocaleString()} bytes, sha256 ${short(f.sha)}`;
    }
  },
  {
    id: 'inscription', title: 'Verify the release, byte for byte and part for part', who: 'Reads only',
    intro: `Reads every new inscription back from the core and checks its bytes, hash, type, parents and (for the parent) dependencies. Then reads #${RELEASE.bundle.id} and the packs from the chain and resolves all ${PART_NAMES.length} of the hall's parts exactly as the parent does, checking each against the pinned ${VERSION} source. Then, where the browser can reach xtrata.xyz, checks the site serves the parent.`,
    action: 'Verify release',
    run: async () => {
      const parent = parentUpload();
      const id = state.inscriptionId;
      if (!id) throw new Error('No parent inscription id yet. Inscribe the parent first.');
      const files: { f: Upload; id: string }[] = [...PACKS.map((f) => ({ f, id: state.packIds![f.key] })), { f: parent, id }];
      const chainText: Record<string, string> = {};
      const notes: string[] = [];
      for (const { f, id: fid } of files) {
        const meta = await inscriptionMeta(fid);
        if (!meta) throw new Error(`${f.label} #${fid} not found on the core.`);
        if (!meta.sealed) throw new Error(`${f.label} #${fid} is not sealed.`);
        if (meta.mime !== f.mime) throw new Error(`${f.label} #${fid} is ${meta.mime}, expected ${f.mime}.`);
        if (meta.size !== f.bytes.length || meta.chunks !== f.chunks.length) throw new Error(`${f.label} #${fid} is ${meta.size} bytes in ${meta.chunks} chunks; expected ${f.bytes.length} in ${f.chunks.length}.`);
        if (meta.hash !== toHex(f.hash)) throw new Error(`${f.label} #${fid} hash differs from the declared hash.`);
        const out = await readChunks(fid, meta.chunks, f.label);
        const bytes = joinBytes(out);
        if (toHex(sha256(bytes)) !== f.sha) throw new Error(`The bytes of ${f.label} #${fid} read back from the chain do not match.`);
        if (toHex(chainHash(out)) !== meta.hash) throw new Error(`The chain hash of ${f.label} #${fid} differs from the sealed hash.`);
        chainText[fid] = new TextDecoder().decode(bytes);
        const parents = await idList('get-parents', fid);
        notes.push(`${f.key} #${fid} ${bytes.length.toLocaleString()} bytes ok${sameIds(parents, PARENT_IDS) ? '' : ` (parents [${parents.join(', ') || 'none'}])`}`);
        if (f === parent && !sameIds(parents, PARENT_IDS)) throw new Error(`Parent #${fid} has parents [${parents.map((x) => '#' + x).join(', ') || 'none'}], expected ${parentList()}.`);
      }
      const deps = await idList('get-dependencies', id);
      if (!sameIds(deps, parentDeps())) throw new Error(`Parent #${id} depends on [${deps.map((x) => '#' + x).join(', ') || 'none'}], expected ${parentDeps().map((x) => '#' + x).join(', ')}.`);
      // Resolve every part the way the parent's partText() does: its pack when the pack has an id, else the bundle.
      const bundleBytes = joinBytes(await readChunks(String(BUNDLE_ID), RELEASE.bundle.chunks, `bundle`));
      if (toHex(sha256(bundleBytes)) !== RELEASE.bundle.sha256) throw new Error(`#${BUNDLE_ID} read back from the chain is not the pinned bundle.`);
      const fromBundle = HallParts.splitRelease(new TextDecoder().decode(bundleBytes)).parts;
      const config = parentConfig(state.packIds!);
      const fromPack: Record<string, Record<string, string>> = {};
      for (const f of PACKS) fromPack[f.key] = HallParts.parsePack(chainText[state.packIds![f.key]]);
      const bad: string[] = [];
      const source: Record<string, number> = {};
      for (const name of PART_NAMES) {
        const pack = HallParts.packOf(name);
        const fromId = Number(config.packs[pack] || 0) > 0 ? String(config.packs[pack]) : String(BUNDLE_ID);
        const text = fromId === String(BUNDLE_ID) ? fromBundle[name] : fromPack[pack]?.[name];
        if (typeof text !== 'string' || shaHex(text) !== RELEASE.partSha[name]) bad.push(`${name} (from #${fromId})`);
        source[fromId] = (source[fromId] || 0) + 1;
      }
      if (bad.length) throw new Error(`These parts do not resolve to the pinned ${VERSION} source: ${bad.join(', ')}.`);
      let served = 'site check skipped (testnet)';
      if (network === 'mainnet') {
        // The xtrata.xyz runtime serves an inscription with two documented rewrites: it injects <base href="null">
        // after <head>, and points the Hiro API hosts at its own /hiro proxy. Undo exactly those, then compare.
        // Advisory only: the bytes were already proven from the chain above.
        try {
          const r = await fetch(`https://xtrata.xyz/i/${id}`, { cache: 'no-store' });
          if (!r.ok) served = `site check: HTTP ${r.status} (the viewer may still be indexing it; not a failure)`;
          else {
            const raw = new Uint8Array(await r.arrayBuffer());
            if (toHex(sha256(raw)) === parent.sha) served = 'xtrata.xyz serves the parent byte-identical';
            else {
              const text = new TextDecoder().decode(raw)
                .replace('<head><base href="null">', '<head>')
                .split('https://xtrata.xyz/hiro/testnet').join('https://api.testnet.hiro.so')
                .split('https://xtrata.xyz/hiro/mainnet').join('https://api.mainnet.hiro.so');
              served = shaHex(text) === parent.sha
                ? 'xtrata.xyz serves the parent, with only its two standard runtime rewrites'
                : `NOTE: xtrata.xyz serves ${raw.length.toLocaleString()} bytes that differ from the chain beyond its standard rewrites; the chain copy is verified, so check the viewer`;
            }
          }
        } catch { served = 'site check: could not reach xtrata.xyz from this page (not a failure)'; }
      }
      const where = Object.entries(source).map(([k, v]) => `${v} from #${k}`).join(', ');
      return `${notes.join(' · ')} · parent child of ${parentList()}, depends on ${deps.map((x) => '#' + x).join(', ')} · all ${PART_NAMES.length} parts resolve to the pinned ${VERSION} source (${where}) · ${served}`;
    }
  },
  {
    id: 'board', title: 'Open a canary board bound to the parent', who: 'Web wallet',
    intro: `Registers "${CANARY_BOARD}" (higher wins, no fee) with the parent inscription as its engine id. It is closed again before the production boards move.`,
    action: 'Open canary board',
    run: async () => {
      const id = state.inscriptionId!;
      if (await canaryDone()) return `canary board "${CANARY_BOARD}" is already closed on parent #${id}: this step ran in an earlier session (nothing sent)`;
      const want = () => readBoard(CANARY_BOARD);
      const ok = (b: Awaited<ReturnType<typeof want>>) => !!b && b.enabled === 'true' && b.engineId === id;
      if (!ok(await want())) {
        await runTx('board', `set-board ${CANARY_BOARD} → #${id}`, () => walletCall(scoresId(), 'set-board',
          [stringAsciiCV(CANARY_BOARD), uintCV(0), uintCV(CANARY_MAX), uintCV(0), uintCV(BigInt(id)), boolCV(false), boolCV(true)]));
      }
      await eventually('Canary board', async () => { const b = await want(); return ok(b) ? null : `board ${b ? `engine ${b.engineId}, enabled ${b.enabled}` : 'missing'}`; });
      return `board "${CANARY_BOARD}" open · engine inscription #${id} · fee 0`;
    }
  },
  {
    id: 'submit', title: 'Submit a real arcade run', who: 'Web wallet',
    intro: `Submits the ${PROOF_GAME} run the ${VERSION} arcade flew for your wallet (skipped when your entry from an earlier launch is already as good: the board refuses a worse or equal run). Then reads the board and the stored replay back from the chain, checks the on-chain hash, and re-plays the chain's bytes in the ${VERSION} arcade.`,
    action: 'Submit run',
    run: async () => {
      const run = state.run!;
      const bytes = unb64(run.replay);
      const mine = (await topEntries(CANARY_BOARD)).find((e) => e.player === state.deployer);
      const earlier = !!mine && mine.score >= BigInt(run.score);
      if (!earlier) {
        await runTx('submit', `submit-score ${run.score.toLocaleString()}`, () => walletCall(scoresId(), 'submit-score',
          [stringAsciiCV(CANARY_BOARD), uintCV(0), uintCV(run.score), stringAsciiCV('CANARY'), bufferCV(bytes)]));
      }
      await eventually('Board entry', async () => {
        const e = (await topEntries(CANARY_BOARD)).find((x) => x.player === state.deployer);
        return e && e.score >= BigInt(run.score) ? null : e ? `score ${e.score}` : 'no entry';
      });
      const chainBytes = bufOf(await readScores('get-replay', [stringAsciiCV(CANARY_BOARD), uintCV(0), principalCV(state.deployer!)]));
      const entry = (await topEntries(CANARY_BOARD)).find((x) => x.player === state.deployer)!;
      if (toHex(sha256(chainBytes)) !== entry.hash) throw new Error('Stored replay does not hash to the recorded replay hash.');
      const v: any = await withArcade<any>((win) => win.XA.replay.verify(new Uint8Array(chainBytes), { address: state.deployer, score: Number(entry.score) }));
      if (!v.ok) throw new Error(`The replay stored on chain did not verify in the ${VERSION} arcade: ${v.reason}.`);
      return `${earlier ? 'your entry from an earlier launch stands (nothing sent) · ' : ''}${run.game} score ${entry.score.toLocaleString()} · ${chainBytes.length}-byte replay stored, hash matches, re-played from chain bytes in ${VERSION}: Verified`;
    }
  },
  {
    id: 'fund', title: 'Fund a copycat wallet', who: 'Web wallet',
    intro: `A throwaway wallet is created in this browser. Your wallet sends it ${stx(FUND_AMOUNT)} so it can pay the fee to try stealing your run. If your wallet cannot sign a plain transfer from a web page, the step shows the copycat address and waits for you to send the amount from the wallet's own Send screen. The rest is swept back.`,
    action: 'Send test funds',
    run: async () => {
      const hot = hotAddress();
      if (await canaryDone()) return `the copycat test already ran for parent #${state.inscriptionId} (canary board closed): nothing sent · temporary wallet holds ${stx(await chain.balance(hot))}`;
      await ensureHotFunds('fund', FUND_AMOUNT, 'copycat test');
      return `copycat ${hot} holds ${stx(await chain.balance(hot))}`;
    }
  },
  {
    id: 'copy', title: 'Copied run is refused', who: 'Copycat wallet (signed in this page)',
    intro: 'The copycat submits your stored replay bytes with a higher claimed score. The contract must refuse it with (err u113) because the replay names you as its pilot. A refused transaction still pays its small fee.',
    action: 'Try to steal the run',
    run: async () => {
      const run = state.run!;
      const hot = hotAddress();
      if (await canaryDone()) return 'the copycat was already refused on chain in an earlier session (canary board closed on this parent): nothing sent';
      const [address, name] = scoresId().split('.');
      const stored = bufOf(await readScores('get-replay', [stringAsciiCV(CANARY_BOARD), uintCV(0), principalCV(state.deployer!)]));
      await runTx('copy', 'copycat submit-score', async () => {
        const nonce = await chain.nonce(hot);
        const tx = await makeContractCall({ contractAddress: address, contractName: name, functionName: 'submit-score',
          functionArgs: [stringAsciiCV(CANARY_BOARD), uintCV(0), uintCV(run.score + 1000), stringAsciiCV('THIEF'), bufferCV(stored)],
          senderKey: hotKey(), network: chain.stacks, nonce, fee: COPY_TX_FEE, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: [] });
        return chain.broadcast(tx);
      }, '(err u113)');
      if ((await topEntries(CANARY_BOARD)).some((e) => e.player === hot)) throw new Error('The copycat appears on the board.');
      return 'refused on chain with (err u113) · the board still shows only your entry';
    }
  },
  {
    id: 'sweep', title: 'Sweep the copycat back', who: 'Copycat wallet (signed in this page)',
    intro: 'Returns what is left in the throwaway wallet to your wallet.',
    action: 'Sweep back',
    run: async () => {
      const left = await sweepHot('sweep');
      return `copycat balance now ${stx(left)}`;
    }
  },
  {
    id: 'close', title: 'Close the canary board', who: 'Web wallet',
    intro: 'Disables the canary board so nothing more can be submitted to it. The production boards move only after this passes.',
    action: 'Close board',
    run: async () => {
      const b = await readBoard(CANARY_BOARD);
      if (b && b.enabled === 'true') await runTx('close', `disable ${CANARY_BOARD}`, () => walletCall(scoresId(), 'set-board-enabled', [stringAsciiCV(CANARY_BOARD), boolCV(false)]));
      await eventually('Close', async () => { const x = await readBoard(CANARY_BOARD); return x && x.enabled === 'false' ? null : `enabled ${x?.enabled}`; });
      return `canary board closed · the ${VERSION} release and leaderboard are proven`;
    }
  },
  {
    id: 'boardwallet', title: 'Create and fund the board-signing wallet', who: 'Web wallet · 1 signature',
    intro: `Only the leaderboard owner can register boards, and the owner would otherwise have to approve all ${PRODUCTION.length} updates by hand. So the canary uses the temporary wallet it created in this browser (the same one as the copycat test). This step saves that wallet's key to a file, then asks your wallet to send it enough STX for the network fees of every board update plus the hand-back (about ${stx(boardFloat(PRODUCTION.length))} for ${PRODUCTION.length} boards; what is not spent is swept back at the end). Xverse cannot sign a plain transfer from a page: the address and amount are shown and the step waits for the funds to arrive. Boards that already match are not counted; if none need updating, nothing is created or sent.`,
    action: 'Create and fund the wallet',
    run: async () => {
      const me = state.deployer!, hot = hotAddress();
      const { todo, owner, pending } = await boardPlan();
      if (owner !== me && owner !== hot) throw new Error(`The leaderboard is owned by ${owner}, which is neither your wallet nor the canary's temporary wallet ${hot}. Nothing was sent.`);
      if (!todo.length && owner === me) return `all ${PRODUCTION.length} boards already match: no board-signing wallet needed, nothing sent · temporary wallet ${hot} holds ${stx(await chain.balance(hot))}`;
      const target = owner === me ? boardFloat(todo.length) : boardFloat(todo.length, { propose: pending !== me, accept: false });
      if (owner === me && pending !== hot) {
        downloadHotKey();
        const msg = `${todo.length} boards need updating.\n\nThe temporary wallet ${hot} will sign them. Its key has just been saved to a file in your downloads: keep it until the canary says ownership is back with your wallet.\n\nNext your wallet sends it about ${stx(target)} for network fees (what is unspent is swept back). Continue?`;
        if (!confirm(msg)) throw new Error('Cancelled before anything was sent.');
      }
      const have = await ensureHotFunds('production', target, 'board-signing wallet');
      return `temporary wallet ${hot} created, key saved to a file, and funded: it holds ${stx(have)} for ${todo.length} board update${todo.length === 1 ? '' : 's'}`;
    }
  },
  {
    id: 'handover', title: 'Make the temporary wallet the contract owner', who: 'Web wallet · 1 signature',
    intro: 'Your wallet proposes the temporary wallet as the leaderboard contract\'s owner (`propose-owner`) and the temporary wallet accepts (`accept-owner`, signed in this page). It stays the owner only for the next step; the one after that hands ownership back to your wallet. If anything stops in between, the next step\'s button, or "Return ownership to my wallet" below, finishes the hand-back.',
    action: 'Hand over ownership',
    run: async () => {
      const me = state.deployer!, hot = hotAddress();
      const { todo, owner, pending } = await boardPlan();
      if (owner !== me && owner !== hot) throw new Error(`The leaderboard is owned by ${owner}, which is neither your wallet nor the temporary wallet. Nothing was sent.`);
      if (!todo.length && owner === me) return 'no boards need updating: ownership stays with your wallet, nothing sent';
      if (owner === hot) return `the temporary wallet ${short(hot)} already owns the contract (nothing sent)`;
      if ((await chain.balance(hot)) < boardFloat(todo.length, { propose: true, accept: true }) - 40_000n) throw new Error('The temporary wallet is not funded yet. Run the previous step first.');
      if (pending !== hot) {
        await runTx('production', uniq('production', `make ${short(hot)} the contract owner (propose)`), () => walletCall(scoresId(), 'propose-owner', [principalCV(hot)]));
        await eventually('Pending owner', async () => ((await pendingOwnerOf()) === hot ? null : 'not proposed yet'));
      }
      await hotCall('production', 'temporary wallet accepts ownership', 'accept-owner', []);
      await eventually('Owner', async () => ((await ownerOf()) === hot ? null : 'not accepted yet'));
      return `the temporary wallet ${short(hot)} now owns the leaderboard contract (hand it back in the last board step) · ${todo.length} boards to update`;
    }
  },
  {
    id: 'production', title: `Point the ${PRODUCTION.length} production boards at the parent`, who: 'Temporary wallet (signed in this page)',
    intro: `The temporary wallet signs \`set-board\` for every arcade board (${PRODUCTION.filter((b) => b.mode === 0).length} score boards, ${PRODUCTION.filter((b) => b.mode === 1).length} time boards): the parent inscription as engine id, no entry fee, enabled. One after another, each confirmed before the next, with no wallet prompts. The contract keeps each board's Top 10 and stored replays when its engine id changes. Boards that already match (including boards on an earlier parent proven to load the same parts) are skipped, so a reload or an error resumes where it stopped.`,
    action: 'Update boards automatically',
    run: async () => {
      const id = state.inscriptionId!, hot = hotAddress();
      const { todo, owner } = await boardPlan();
      const kept = (state.equivalent || []).length ? ` or an equivalent earlier parent (${(state.equivalent || []).map((x) => '#' + x).join(', ')})` : '';
      if (!todo.length) return `${PRODUCTION.length} boards already on engine inscription #${id}${kept} · nothing sent`;
      if (owner !== hot) throw new Error('The temporary wallet does not own the contract yet. Run the two previous steps first.');
      let updated = 0;
      try {
        for (const b of todo) {
          status(`Pointing ${b.id} at #${id} (${updated + 1} of ${todo.length})…`);
          await hotCall('production', `set-board ${b.id} → #${id}`, 'set-board',
            [stringAsciiCV(b.id), uintCV(b.mode), uintCV(b.max), uintCV(0), uintCV(BigInt(id)), boolCV(false), boolCV(true)]);
          await eventually(b.id, async () => (boardMatches(await readBoard(b.id), b) ? null : 'not set yet'));
          updated++;
        }
      } catch (error) {
        let held = false;
        try { held = (await ownerOf()) === hot; } catch { /* ignore */ }
        if (held) throw new Error(`${error instanceof Error ? error.message : String(error)} — The leaderboard is owned by the temporary wallet ${hot} until it is handed back. Press this step's button again to continue, or "Return ownership to my wallet" to give it back now. Its key was saved to a file (and stays in this browser).`);
        throw error;
      }
      return `${PRODUCTION.length} boards on engine inscription #${id}${kept} · ${updated} updated automatically by the temporary wallet`;
    }
  },
  {
    id: 'handback', title: 'Hand ownership back and sweep the temporary wallet', who: 'Web wallet · 1 signature',
    intro: 'The temporary wallet proposes your wallet as owner again and your wallet accepts (`accept-owner`). Then anything left in the temporary wallet is swept back to you. The step also clears a hand-over that was proposed but never accepted, so the temporary key can never take ownership later.',
    action: 'Hand back and sweep',
    run: async () => {
      const me = state.deployer!, hot = hotAddress();
      const moved = await handBack();
      let owner = await ownerOf();
      if (owner !== me) throw new Error(`The leaderboard is owned by ${owner}, not your wallet.`);
      if ((await pendingOwnerOf()) === hot) {
        await runTx('production', uniq('production', 'cancel the pending hand-over'), () => walletCall(scoresId(), 'propose-owner', [principalCV(me)]));
        await eventually('Pending owner', async () => ((await pendingOwnerOf()) === hot ? 'still the temporary wallet' : null));
      }
      for (const b of PRODUCTION) if (!boardMatches(await readBoard(b.id), b)) throw new Error(`Board ${b.id} does not match the parent yet. Run the board step again before finishing.`);
      const left = await sweepHot('production');
      return `${moved ? 'ownership handed back to your wallet' : 'your wallet already owns the contract (nothing to hand back, nothing sent)'} · all ${PRODUCTION.length} boards match · temporary wallet holds ${stx(left)}`;
    }
  },
  {
    id: 'audit', title: 'Final audit', who: 'Reads only',
    intro: 'Re-reads every board and every inscription of the release one last time, and checks whether the xtrata.xyz submit page already knows the arcade boards. Ends with what to change in the repo and on the site.',
    action: 'Run audit',
    run: async () => {
      const id = state.inscriptionId!;
      const bad: string[] = [];
      for (const b of PRODUCTION) if (!boardMatches(await readBoard(b.id), b)) bad.push(b.id);
      if (bad.length) throw new Error(`Boards not matching: ${bad.join(', ')}`);
      for (const f of [...PACKS, parentUpload()]) {
        const fid = f.key === 'parent' ? id : state.packIds![f.key];
        const meta = await inscriptionMeta(fid);
        if (!meta || !meta.sealed || meta.hash !== toHex(f.hash)) throw new Error(`${f.label} #${fid} no longer matches.`);
      }
      let site = 'site allow-list not checked (xtrata.xyz not reachable from this page)';
      try {
        const page = await (await fetch('https://xtrata.xyz/arcade/submit', { cache: 'no-store' })).text();
        const srcs = [...page.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => new URL(m[1], 'https://xtrata.xyz/arcade/submit').href).filter((u) => /submit/.test(u));
        let known = /xa_neon_snake/.test(page);
        for (const s of srcs) { if (known) break; try { known = /xa_neon_snake/.test(await (await fetch(s, { cache: 'no-store' })).text()); } catch { /* ignore */ } }
        site = known ? 'the submit page already lists the arcade boards' : 'NOTE the xtrata.xyz submit page does not list the arcade boards yet, so scores cannot be posted from the site until it is updated (the arcade signs through the wallet itself)';
      } catch { /* keep default */ }
      const packIds = RELEASE.inscribe.map((n) => `"${n}": ${state.packIds![n]}`).join(', ');
      return `all ${PRODUCTION.length} boards match · ${VERSION} parent #${id} and packs sealed · ${site} · Next: open https://xtrata.xyz/x/${id} and play one run; set packs {${packIds}} in recursive-apps/xtrata-arcade/parent/ids.json; point /arcade (public/_redirects) and the homepage arcade tile at #${id}; add #${id} to ARCADE_INSCRIPTION_IDS in src/arcade-submit/arcade-boards.ts.`;
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
    st.status = 'fail'; st.note = error instanceof Error ? error.message : String(error);
    log('error', `${s.title}: ${st.note}`);
    status(`${s.title}: ${st.note}`, 'error');
  } finally {
    busy = false; save(); renderSteps(); renderHeader();
  }
};

const renderHeader = () => {
  renderInscribing();
  ($('#network') as HTMLSelectElement).value = network;
  const locked = Object.entries(state.steps).some(([id, s]) => id !== 'connect' && id !== 'preflight' && s.status === 'pass');
  const name = $('#contract-name') as HTMLInputElement;
  name.value = state.contractName; name.disabled = locked;
  const core = $('#core') as HTMLInputElement;
  core.value = state.core; core.disabled = locked;
  $('#wallet').textContent = connected ? `${connected.label} · ${short(connected.address)}` : state.deployer ? `run owner ${short(state.deployer)} · not connected` : 'not connected';
  $('#hot').textContent = `${hotAddress()} (key kept in this browser only)`;
  $('#target').textContent = state.deployer ? `${scoresId()}  ·  arcade → ${state.core || '(set core)'}${state.inscriptionId ? `  ·  inscription #${state.inscriptionId}` : ''}` : `<your address>.${state.contractName}`;
  $('#disconnect').toggleAttribute('hidden', !connected);
};

const renderInscribing = () => {
  const built = new Date(__BUILT_AT__);
  const rows: [string, string][] = [
    ...PACKS.map((f): [string, string] => [`${f.label[0].toUpperCase()}${f.label.slice(1)}`,
      `${f.bytes.length.toLocaleString()} bytes · ${f.chunks.length} chunks · sha256 ${f.sha}${state?.packIds?.[f.key] ? ` · #${state.packIds[f.key]}` : ''}`]),
    ['Parent', `${kb(parentEstimate())} text/html · child of ${parentList()} · depends on #${RELEASE.bundle.id} + the packs${state?.inscriptionId ? ` · #${state.inscriptionId}` : ''}`],
    [`From #${RELEASE.bundle.id}`, `${RELEASE.fromBundle.join(', ')} (bundle sha256 ${short(RELEASE.bundle.sha256)}, not re-inscribed)`],
    ['Release', RELEASE_SHA],
    ['Canary built', `${built.toLocaleString()} (your time) · ${__BUILT_AT__} UTC`],
    ['Build stamp', __BUILD__]
  ];
  $('#inscribing').replaceChildren(
    el('div', { class: 'eyebrow' }, 'This canary inscribes'),
    el('div', { class: 'big' }, `Xtrata Arcade ${VERSION} · recursive`),
    el('dl', {}, ...rows.flatMap(([k, v]) => [el('dt', {}, k), el('dd', {}, v)])));
  document.title = `Arcade ${VERSION} launch canary · ${__BUILD__}`;
};

const bind = () => {
  renderInscribing();
  $('#build').textContent = `${__BUILD__} · contract sha256 ${__SOURCE_SHA__.slice(0, 16)}… · release sha256 ${RELEASE_SHA.slice(0, 16)}… · inscribes ${PACKS.map((f) => `${f.key} ${kb(f.bytes.length)}`).join(', ')} + parent`;
  $('#network').addEventListener('change', (e) => {
    network = (e.target as HTMLSelectElement).value as Net;
    try { localStorage.setItem('xtrata-arcade-launch:network', network); } catch { /* ignore */ }
    chain = new Chain(network); connected = null; void wallet.disconnect();
    load(); restoreLog(); renderHeader(); renderSteps();
  });
  $('#contract-name').addEventListener('change', (e) => {
    const v = (e.target as HTMLInputElement).value.trim();
    if (!/^[a-zA-Z][a-zA-Z0-9-]{0,39}$/.test(v)) { status('Contract names start with a letter and use letters, digits and dashes (max 40).', 'error'); renderHeader(); return; }
    if (v !== DEFAULT_NAME) log('warn', `Deploying as ${v}: the arcade and /arcade/submit expect ${DEFAULT_NAME}; use another name only for a rehearsal.`);
    state.contractName = v; state.steps = { connect: step('connect') }; save(); renderHeader(); renderSteps();
  });
  $('#core').addEventListener('change', (e) => {
    const v = (e.target as HTMLInputElement).value.trim();
    if (!/^S[PT][0-9A-Z]{20,}\.[a-zA-Z][a-zA-Z0-9-]*$/.test(v)) { status('Enter the core as ADDRESS.contract-name.', 'error'); renderHeader(); return; }
    state.core = v; save(); renderHeader();
  });
  $('#disconnect').addEventListener('click', async () => { await wallet.disconnect(); connected = null; step('connect').status = 'todo'; save(); renderHeader(); renderSteps(); log('info', 'Wallet disconnected.'); });
  $('#export').addEventListener('click', () => {
    const report = { ...state, run: state.run ? { game: state.run.game, score: state.run.score, bytes: unb64(state.run.replay).length } : null, build: __BUILD__, builtAt: __BUILT_AT__,
      arcadeVersion: VERSION, releaseSha256: RELEASE_SHA, parents: PARENT_IDS.map(String), network, contractSha256: __SOURCE_SHA__,
      bundle: RELEASE.bundle, fromBundle: RELEASE.fromBundle,
      packs: Object.fromEntries(PACKS.map((f) => [f.key, { id: state.packIds?.[f.key] ?? null, bytes: f.bytes.length, chunks: f.chunks.length, sha256: f.sha, chainHash: toHex(f.hash) }])),
      parent: (() => { try { const f = parentUpload(); return { id: state.inscriptionId ?? null, bytes: f.bytes.length, sha256: f.sha, chainHash: toHex(f.hash), dependencies: parentDeps().map(String) }; } catch { return null; } })(),
      idsJson: { version: VERSION, bundleId: RELEASE.bundle.id, packs: parentConfig(state.packIds || {}).packs, parts: {}, parentTokenId: 0 },
      leaderboard: state.deployer ? scoresId() : null, copycat: hotAddress() };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `xtrata-arcade-launch-${network}-${Date.now()}.json` }) as HTMLAnchorElement;
    a.click(); URL.revokeObjectURL(a.href);
  });
  $('#rescue').addEventListener('click', async () => {
    if (busy) return;
    if (!state.deployer) { status('Connect first so the canary knows where to sweep.', 'error'); return; }
    busy = true;
    try {
      const left = await sweepHot('production');
      status(`Temporary wallet holds ${stx(left)}.`, 'ok');
    } catch (error) { status(`Recovery sweep failed: ${error instanceof Error ? error.message : String(error)}`, 'error'); }
    finally { busy = false; }
  });
  $('#handback').addEventListener('click', async () => {
    if (busy) return;
    if (!state.deployer) { status('Connect first so the canary knows which wallet to hand ownership back to.', 'error'); return; }
    try { requireWallet(); } catch (error) { status(error instanceof Error ? error.message : String(error), 'error'); return; }
    busy = true;
    try {
      const moved = await handBack();
      const left = await sweepHot('production');
      status(moved ? `Ownership is back with your wallet. Temporary wallet holds ${stx(left)}.` : `Your wallet already owns the leaderboard. Temporary wallet holds ${stx(left)}.`, 'ok');
    } catch (error) { status(`Returning ownership failed: ${error instanceof Error ? error.message : String(error)}`, 'error'); }
    finally { busy = false; }
  });
  $('#forget').addEventListener('click', async () => {
    let hotBalance = 0n;
    try { hotBalance = await chain.balance(hotAddress()); } catch { status('Could not check the copycat balance, so progress was kept. Try again.', 'error'); return; }
    if (hotBalance > SWEEP_TX_FEE && !confirm(`The copycat still holds ${stx(hotBalance)}. Forgetting progress keeps its key, so you can still sweep it later. Continue?`)) return;
    try { localStorage.removeItem(stateKey()); } catch { /* ignore */ }
    load(); restoreLog(); renderHeader(); renderSteps(); status('Local progress cleared. On-chain progress is re-read, so re-running resumes it.', 'ok');
  });
};
const restoreLog = () => {
  $('#log').replaceChildren(...state.log.map((l) => el('div', { class: `log-line ${l.level}` }, el('time', {}, new Date(l.t).toLocaleTimeString()), ' ', l.msg,
    l.txid ? [' ', el('a', { href: chain.txUrl(l.txid), target: '_blank', rel: 'noopener' }, short(l.txid))] : null)));
};

// ---------- boot ----------
load();
wallet.setConnectMessage('Xtrata arcade launch canary');
if (location.protocol === 'file:') $('#file-banner').removeAttribute('hidden');
if (state.steps.connect?.status === 'pass') state.steps.connect.status = 'todo'; // wallet connection never survives a reload
bind(); restoreLog(); renderHeader(); renderSteps();
