/**
 * Xtrata Arcade v2 launch canary: the step engine.
 *
 * No DOM in here. The page (main.ts) supplies a Host (log, status, confirm, file save, storage, the wallet connection and
 * the browser-only checks: flying a run in the embedded arcade, reading the registry with the hall's own reader, booting
 * the parent in a hidden frame). A Node runner can supply a Host with a key-file signer and run the same steps.
 *
 *   connect -> preflight -> (testnet: deploy the core, inscribe the bundle and a stand-in for #55) -> deploy
 *   xtrata-posters-v1, xtrata-world-v2, xtrata-screen-v1 from the root wallet -> registry: 24 built-in kinds (signed by a
 *   temporary KINDS admin), arcade + hall spaces owned by the root wallet and set live, four bay objects, one add-states
 *   batch that puts every bay on posters -> posters / screen / treasury setup -> read the registry back with the hall's
 *   own reader -> inscribe the changed packs -> inscribe the parent with CONFIG.world = { posters, registry, screen } ->
 *   verify the release and boot it -> canary board, real run, copycat refusal, close -> 26 boards to the new parent
 *   through a temporary owner -> final ownership check -> audit.
 *
 * Every step re-reads the chain before it sends anything, so a re-run after "Forget local progress" sends nothing that
 * is already done. Everything is deny mode; calls that pay the core carry a "send at most" post-condition.
 */
import { sha256 } from '@noble/hashes/sha256';
import {
  addressFromVersionHash, AddressVersion, addressToString, AnchorMode, boolCV, Cl, createAddress, bufferCV, ClarityType, cvToString, FungibleConditionCode, getAddressFromPrivateKey, hexToCV,
  intCV, listCV, makeContractCall, makeRandomPrivKey, makeSTXTokenTransfer, makeStandardSTXPostCondition,
  PostConditionMode, principalCV, privateKeyToString, someCV, stringAsciiCV, TransactionVersion, tupleCV, uintCV,
  type ClarityValue, type PostCondition
} from '@stacks/transactions';
import LAUNCH from 'xa:launch';
import HallParts from '../../recursive-apps/xtrata-arcade/build/hall-parts.cjs';
import ParentRender from '../../recursive-apps/xtrata-arcade/build/parent-render.cjs';
import * as V2 from '../../contracts/arcade-world/ops/lib/v2-plan.mjs';
import { Chain, toHex } from '../collection-v17/chain';
import type { Net } from '../collection-v17/wallet';

export const RELEASE = LAUNCH.release;
export const RELEASE_SHA = LAUNCH.releaseSha;
export const VERSION = RELEASE.version;
export const NAMES = { posters: 'xtrata-posters-v1', world: 'xtrata-world-v2', screen: 'xtrata-screen-v1', games: 'xtrata-games-v1', scores: 'xtrata-arcade-scores-v2' } as const;
const NEW_CONTRACTS = [NAMES.world, NAMES.posters, NAMES.screen, NAMES.games];
const CORE_TRIO = ['nft-trait', 'xtrata-v1-1-1', 'xtrata-v2-1-0', 'xtrata-v3-2-3'];
/** Xtrata's standard token URI (same value the app and SDK use). */
const TOKEN_URI = 'https://xvgh3sbdkivby4blejmripeiyjuvji3d4tycym6hgaxalescegjq.arweave.net/vUx9yCNSKhxwKyJZFDyIwmlUo2Pk8CwzxzAuBZJCIZM';
const CHUNK = 16384;
const BATCH = 30;               // the app and SDK cap uploads at 30 chunks per transaction
const SINGLE_MAX_CHUNKS = 32;   // one-transaction inscription limit (512 KB)
const CANARY_BOARD = 'arcade-canary';
const CANARY_MAX = 1_000_000_000n;
const PROOF_GAME = 'xa_swerve';
const COPY_TX_FEE = 30_000n;
const SWEEP_TX_FEE = 5_000n;
const FUND_AMOUNT = 60_000n;
/** Network fee the temporary wallet pays per call it signs (what is not spent is swept back). */
const TEMP_TX_FEE = 20_000n;
/** Estimates for the balance check only; the wallet sets the real network fee of every transaction it signs. */
export const FEE_EST = { deployPerByte: 30n, call: 20_000n, inscribePerByte: 1n, buffer: 3_000_000n };
/** xtrata-world-v2 admin caps: 1 PAUSE, 2 KINDS, 4 TRUST, 8 MOD. */
const ADMIN_KINDS = 2;
const HALL_BAYS = 4;
const STAND_IN_TEXT = 'Xtrata Arcade testnet rehearsal: this inscription stands in for #55, the parent of every arcade inscription on mainnet.';

type Board = { id: string; game: string; mode: number; max: number };
const PRODUCTION = LAUNCH.boards as Board[];

// ---------- small helpers ----------
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const stx = (micro: bigint | string | number) => `${(Number(micro) / 1e6).toLocaleString(undefined, { maximumFractionDigits: 6 })} STX`;
export const short = (s: string) => (s && s.length > 18 ? `${s.slice(0, 8)}…${s.slice(-6)}` : s);
export const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
export const shaHex = (text: string) => toHex(sha256(new TextEncoder().encode(text)));
const hexBytes = (hex: string) => { const c = hex.replace(/^0x/, ''); const out = new Uint8Array(c.length / 2); for (let i = 0; i < out.length; i++) out[i] = parseInt(c.substr(i * 2, 2), 16); return out; };
export const b64 = (b: Uint8Array) => { let s = ''; b.forEach((x) => { s += String.fromCharCode(x); }); return btoa(s); };
export const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const concat = (a: Uint8Array, b: Uint8Array) => { const o = new Uint8Array(a.length + b.length); o.set(a, 0); o.set(b, a.length); return o; };
const joinBytes = (list: Uint8Array[]) => { const out = new Uint8Array(list.reduce((n, c) => n + c.length, 0)); let o = 0; for (const c of list) { out.set(c, o); o += c.length; } return out; };
const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));

// ---------- Clarity ----------
/** A relay-steps argument ({ uint }, { ascii }, { tuple } …, as plan.mjs writes them) as a Clarity value. */
export const toCV = (a: any): ClarityValue => {
  if ('uint' in a) return uintCV(a.uint);
  if ('int' in a) return intCV(a.int);
  if ('ascii' in a) return stringAsciiCV(a.ascii);
  if ('principal' in a) return principalCV(a.principal);
  if ('bool' in a) return boolCV(a.bool);
  if ('hex' in a) return bufferCV(hexBytes(a.hex));
  if ('list' in a) return listCV(a.list.map(toCV));
  if ('some' in a) return someCV(toCV(a.some));
  if ('tuple' in a) return tupleCV(Object.fromEntries(Object.entries(a.tuple).map(([k, v]) => [k, toCV(v)])));
  throw new Error(`unknown argument form ${JSON.stringify(a)}`);
};
/** A Clarity value as plain JS: uints as numbers (bigint when large), tuples as objects, none as null. An (err …) throws. */
export const plain = (cv: any): any => {
  switch (cv.type) {
    case ClarityType.UInt: case ClarityType.Int: { const n = BigInt(cv.value); return n <= BigInt(Number.MAX_SAFE_INTEGER) && n >= -BigInt(Number.MAX_SAFE_INTEGER) ? Number(n) : n; }
    case ClarityType.BoolTrue: return true;
    case ClarityType.BoolFalse: return false;
    case ClarityType.StringASCII: case ClarityType.StringUTF8: return cv.data;
    case ClarityType.PrincipalStandard: case ClarityType.PrincipalContract: return cvToString(cv);
    case ClarityType.Buffer: return toHex(cv.buffer);
    case ClarityType.OptionalNone: return null;
    case ClarityType.OptionalSome: case ClarityType.ResponseOk: return plain(cv.value);
    case ClarityType.ResponseErr: throw new Error(`contract returned ${cvToString(cv)}`);
    case ClarityType.List: return cv.list.map(plain);
    case ClarityType.Tuple: return Object.fromEntries(Object.entries(cv.data).map(([k, v]) => [k, plain(v)]));
    default: return cvToString(cv);
  }
};
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

// ---------- what gets inscribed, chunked the way the core hashes it ----------
/** The core's running hash: h0 = 32 zero bytes, h(i+1) = sha256(h(i) || chunk(i)). */
const chainHash = (chunks: Uint8Array[]) => { let h: Uint8Array = new Uint8Array(32); for (const c of chunks) h = sha256(concat(h, c)); return h; };
export type Upload = { key: string; label: string; mime: string; text: string; bytes: Uint8Array; chunks: Uint8Array[]; hash: Uint8Array; sha: string };
const makeUpload = (key: string, label: string, mime: string, text: string): Upload => makeUploadBytes(key, label, mime, new TextEncoder().encode(text), text);
const makeUploadBytes = (key: string, label: string, mime: string, bytes: Uint8Array, text = ''): Upload => {
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < bytes.length; i += CHUNK) chunks.push(bytes.subarray(i, Math.min(i + CHUNK, bytes.length)));
  return { key, label, mime, text, bytes, chunks, hash: chainHash(chunks), sha: toHex(sha256(bytes)) };
};
export const PACKS: Upload[] = RELEASE.inscribe.map((name) => makeUpload(name, `${name} pack`, 'text/plain', RELEASE.packs[name]));
const PART_NAMES = Object.keys(RELEASE.partSha);
/** The bundle (#3078 on mainnet): its chain hash is pinned by the build. Only the testnet rehearsal inscribes it, from mainnet's own bytes. */
const BUNDLE_HASH = hexBytes(RELEASE.bundle.chainHash);
const BUNDLE_LABEL = 'bundle (v1.3, #3078 on mainnet)';
const standInUpload = () => makeUpload('stand-in', 'testnet stand-in for #55', 'text/plain', STAND_IN_TEXT);

// ---------- state ----------
export type TxRec = { label: string; txid: string; status: string; result?: string; pass?: boolean; block?: number };
export type StepState = { status: 'todo' | 'running' | 'pass' | 'fail'; note?: string; data: Record<string, any>; txs: TxRec[] };
export type State = {
  version: 2;
  core: string;
  root?: string;
  packIds?: Record<string, string>;
  /** the parent: the arcade's engine id on every board */
  inscriptionId?: string;
  /** testnet only: the bundle and the stand-in for #55 on the testnet core */
  bundleId?: string;
  standIn?: string;
  run?: { replay: string; score: number; game: string };
  /** sign the 24 kinds with the root wallet itself instead of a temporary KINDS admin */
  kindsSelf?: boolean;
  steps: Record<string, StepState>;
  log: { t: string; level: string; msg: string; txid?: string }[];
};

/** What signs for the root wallet: the web wallet in the page, a key file in a Node runner. Each returns a txid once broadcast. */
export type Signer = {
  address: string;
  label: string;
  call(target: string, fn: string, args: ClarityValue[], pcs: PostCondition[]): Promise<string>;
  deploy(name: string, code: string, clarityVersion: number): Promise<string>;
  transfer(recipient: string, amount: bigint, memo: string): Promise<string>;
  balanceNote?: string;
};
export type HallRead = { bays: any[]; lobbyBays: any[]; looks: any; meta: { hall: number | null; lobby: number | null; objects: number; kinds: number } };
export type BootInfo = { worldConfig: any; gamesConfig: any; games: any; mode: number; enabled: boolean; registry: string; posters: string; screen: string; wall: { head: any; shown: boolean }[]; bays: any[] | null; errors: string[] };
export type Host = {
  log(level: 'info' | 'ok' | 'warn' | 'error', msg: string, txid?: string): void;
  status(text: string, tone?: 'info' | 'ok' | 'warn' | 'error'): void;
  confirm(msg: string): Promise<boolean>;
  saveFile(name: string, data: unknown): void;
  storage: { get(k: string): string | null; set(k: string, v: string): void; remove(k: string): void };
  /** Opens the wallet (chooser every time) and returns a signer for the account picked. */
  connect(): Promise<Signer & { publicKey: string | null; wrongNetwork?: string }>;
  /** Browser only: run fn against the embedded single-file arcade (flying and re-playing runs). */
  withArcade?<T>(fn: (win: any) => Promise<T>): Promise<T>;
  /** Browser only (or a vm in Node): read the registry with the hall's own reader (world.js + world2.js). */
  readHall?(registry: string): Promise<HallRead>;
  /** Browser only: boot a parent's bytes in a hidden frame and report what its world reader is set to. */
  bootParent?(html: string, opts: { network: Net; core: string; apiBase: string }): Promise<BootInfo>;
  render?(): void;
};

export let network: Net = 'mainnet';
export let chain = new Chain(network);
export let state!: State;
let host!: Host;
let signer: Signer | null = null;

export const NET = () => LAUNCH.networks[network];
export const rootAddr = () => NET().root as string;
export const cid = (name: string) => `${rootAddr()}.${name}`;
const stateKey = () => `xtrata-arcade-v2-launch:v1:${network}:${RELEASE_SHA.slice(0, 12)}`;
const hotKeyName = () => `xtrata-arcade-v2-launch:hot:${network}`;
const freshState = (): State => ({ version: 2, core: NET().core, packIds: {}, steps: {}, log: [] });
export const load = () => {
  try { const raw = host.storage.get(stateKey()); state = raw ? { ...freshState(), ...JSON.parse(raw) } : freshState(); } catch { state = freshState(); }
  if (state.steps.connect?.status === 'pass') state.steps.connect.status = 'todo'; // a wallet connection never survives a reload
};
export const save = () => { try { host.storage.set(stateKey(), JSON.stringify(state)); } catch { /* storage unavailable */ } };
export const forget = () => { try { host.storage.remove(stateKey()); } catch { /* ignore */ } load(); };
export const step = (id: string): StepState => (state.steps[id] ??= { status: 'todo', data: {}, txs: [] });
export const connectedSigner = () => signer;
export const setSigner = (s: Signer | null) => { signer = s; };
export const init = (net: Net, h: Host) => { network = net; chain = new Chain(net); host = h; signer = null; load(); };

const log = (level: 'info' | 'ok' | 'warn' | 'error', msg: string, txid?: string) => {
  state.log.unshift({ t: new Date().toISOString(), level, msg, txid });
  state.log = state.log.slice(0, 400);
  save();
  host.log(level, msg, txid);
};
export const logLine = log;
const status = (text: string, tone: 'info' | 'ok' | 'warn' | 'error' = 'info') => host.status(text, tone);

// ---------- the root wallet (review H1) ----------
export const H1 = () => `This launch must run from the final root owner, ${rootAddr()}. xtrata-world-v2 makes the wallet that deploys it the root owner and the treasury, and a space belongs to the wallet named when it is created. If another wallet deployed or built it and root were handed to ${short(rootAddr())} later, that wallet could not build in the spaces the deployer owns, and moving a space to it bumps the space's epoch, which drops its scheduled states and grants. So everything here is deployed and created from ${short(rootAddr())}, with every space owned by it.`;
/** The connected wallet, which must be the configured root owner for this network. Every sending step goes through this. */
export const requireRoot = () => {
  if (!signer) throw new Error('Connect your wallet first (step 1).');
  if (signer.address !== rootAddr()) throw new Error(`The connected wallet is ${signer.address}, not the root owner. ${H1()}`);
  return signer;
};
const payAtMost = (amount: bigint): PostCondition[] => [makeStandardSTXPostCondition(requireRoot().address, FungibleConditionCode.LessEqual, amount)];
const rootCall = (target: string, fn: string, args: ClarityValue[], pcs: PostCondition[] = []) => requireRoot().call(target, fn, args, pcs);

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
    s.txs.push(rec); save(); host.render?.();
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
/**
 * Waits until `address` has nothing in the mempool. A step that decides from the chain whether a call is still needed must not
 * decide while an earlier copy of that call is still pending (a reload, or progress forgotten mid-run), or it would send it twice.
 */
const quiet = async (address: string) => {
  const until = Date.now() + 10 * 60_000;
  for (;;) {
    const n = await chain.pendingCount(address);
    if (n === 0) return;
    if (Date.now() > until) throw new Error(`${short(address)} still has ${n} pending transaction(s) after 10 minutes. Wait for them to confirm (or drop), then press the button again.`);
    status(`Waiting for ${n} pending transaction(s) from ${short(address)} to confirm before deciding what is left to send…`, 'warn');
    await sleep(5000);
  }
};

// ---------- the temporary wallet: copycat, KINDS admin for the 24 kinds, and leaderboard owner for the 26 boards ----------
export const hotKey = () => {
  let key: string | null = null;
  try { key = host.storage.get(hotKeyName()); } catch { /* ignore */ }
  if (!key) {
    key = privateKeyToString(makeRandomPrivKey());
    if (key.length === 64) key += '01';
    try { host.storage.set(hotKeyName(), key); } catch { /* ignore */ }
  }
  return key;
};
export const hotAddress = () => getAddressFromPrivateKey(hotKey(), network === 'mainnet' ? TransactionVersion.Mainnet : TransactionVersion.Testnet);
/** The temporary wallet signs a call with its own key. */
const hotCall = (stepId: string, label: string, target: string, fn: string, args: ClarityValue[]) =>
  runTx(stepId, uniq(stepId, label), async () => {
    const hot = hotAddress();
    const [address, name] = target.split('.');
    const nonce = await chain.nonce(hot);
    const tx = await makeContractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
      senderKey: hotKey(), network: chain.stacks, nonce, fee: TEMP_TX_FEE, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: [] });
    return chain.broadcast(tx);
  });
/**
 * Makes sure the temporary wallet holds at least `target`. Asks the root wallet for exactly the difference; a wallet that cannot
 * sign a plain transfer from a web page (Xverse) gets the address and an amount to send by hand, and the canary waits for it.
 */
const ensureHotFunds = async (stepId: string, target: bigint, what: string) => {
  const hot = hotAddress();
  const have = await chain.balance(hot);
  if (have < target) {
    const need = target - have;
    let sent = false;
    try {
      await runTx(stepId, uniq(stepId, `${what}: send ${stx(need)} to the temporary wallet`), () => requireRoot().transfer(hot, need, 'arcade v2 canary'));
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
/** Everything the temporary wallet still holds goes back to the root wallet. */
export const sweepHot = async (stepId: string) => {
  const hot = hotAddress();
  const balance = await chain.balance(hot);
  if (balance <= SWEEP_TX_FEE) return balance;
  await runTx(stepId, uniq(stepId, `sweep ${stx(balance - SWEEP_TX_FEE)}`), async () => {
    const nonce = await chain.nonce(hot);
    const tx = await makeSTXTokenTransfer({ recipient: rootAddr(), amount: balance - SWEEP_TX_FEE, senderKey: hotKey(), network: chain.stacks, nonce, fee: SWEEP_TX_FEE, memo: 'arcade v2 canary sweep', anchorMode: AnchorMode.Any });
    return chain.broadcast(tx);
  });
  return chain.balance(hot);
};
export const hotKeyFile = (purpose: string) => ({ purpose: `Xtrata arcade v2 launch canary temporary wallet (${purpose})`, network, address: hotAddress(), privateKey: hotKey(),
  note: 'Keep this file until the canary reports that every role it handed this wallet is back with the root wallet (KINDS admin removed, leaderboard ownership returned). While it holds a role, anyone with this key can use it.' });

// ---------- reads: core ----------
const readCore = (fn: string, args: ClarityValue[] = []) => chain.read(state.core, fn, args);
const inscriptionMeta = async (id: string) => {
  const cv = await readCore('get-inscription-meta', [uintCV(BigInt(id))]);
  if (isNone(cv)) return null;
  return {
    creator: asText(tupleField(cv, 'creator')), mime: asText(tupleField(cv, 'mime-type')), size: Number(asText(tupleField(cv, 'total-size'))),
    chunks: Number(asText(tupleField(cv, 'total-chunks'))), sealed: asText(tupleField(cv, 'sealed')) === 'true', hash: toHex(bufOf(tupleField(cv, 'final-hash')))
  };
};
const uploadIndex = async (f: Upload): Promise<number | null> => {
  const cv = await readCore('get-upload-state', [bufferCV(f.hash), principalCV(rootAddr())]);
  return isNone(cv) ? null : Number(asText(tupleField(cv, 'current-index')));
};
const stagedFees = async (size: number, chunks: number) => {
  const cv = await readCore('quote-staged-fee', [uintCV(size), uintCV(chunks)]);
  return { begin: BigInt(asText(tupleField(cv, 'begin-fee'))), seal: BigInt(asText(tupleField(cv, 'seal-fee'))) };
};
const singleFee = async (size: number, chunks: number) => BigInt(asText(tupleField(await readCore('quote-single-tx-fee', [uintCV(size), uintCV(chunks)]), 'total-fee')));
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
const findSealedBy = async (hash: Uint8Array, size: number) => {
  const cv = await readCore('get-id-by-hash', [bufferCV(hash)]);
  if (isNone(cv)) return null;
  const id = asText(cv);
  const meta = await inscriptionMeta(id);
  return meta && meta.sealed && meta.hash === toHex(hash) && meta.size === size ? { id, meta } : null;
};
const findSealed = (f: Upload) => findSealedBy(f.hash, f.bytes.length);
const readChunks = async (id: string, total: number, label: string, via: { chain: Chain; core: string } = { chain, core: state.core }) => {
  const out: Uint8Array[] = [];
  const per = 6;   // a 16 KB chunk costs ~20 KB of read_length; testnet caps a read-only call at 200,000 (10 chunks measured 200,316 and failed)
  for (let i = 0; i < total; i += per) {
    status(`Reading ${label} (#${id}) back… ${Math.min(i + per, total)} of ${total} chunks`);
    const idxs = Array.from({ length: Math.min(per, total - i) }, (_, k) => uintCV(BigInt(i + k)));
    const cv: any = inner(await via.chain.read(via.core, 'get-chunk-batch', [uintCV(BigInt(id)), listCV(idxs)]));
    const items = cv.list as ClarityValue[];
    if (items.length !== idxs.length) throw new Error(`Chunk read of #${id} returned ${items.length} of ${idxs.length} chunks at ${i}.`);
    for (const it of items) out.push(bufOf(it));
  }
  return out;
};

// ---------- network-specific ids: the bundle and the parent (#55, or its testnet stand-in) ----------
const bundleId = (): bigint => {
  if (network === 'mainnet') return BigInt(RELEASE.bundle.id);
  if (!state.bundleId) throw new Error('The testnet bundle has no inscription id yet. Run the testnet fixtures step first.');
  return BigInt(state.bundleId);
};
const parentIds = (): bigint[] => {
  if (network === 'mainnet') return (NET().parents as number[]).map((p) => BigInt(p));
  if (!state.standIn) throw new Error('The testnet stand-in for #55 has no inscription id yet. Run the testnet fixtures step first.');
  return [BigInt(state.standIn)];
};
const parentList = () => { try { return parentIds().map((p) => `#${p}`).join(', '); } catch { return network === 'mainnet' ? '#55' : 'the testnet stand-in for #55'; } };

// ---------- inscribing one file: one transaction when it fits, else begin / upload / seal (each resumable) ----------
const inscribe = async (sid: string, f: Upload, deps: bigint[], parents: bigint[]) => {
  const w = requireRoot();
  const existing = await findSealed(f);
  if (existing) {
    const have = await idList('get-parents', existing.id);
    const warn = sameIds(have, parents) ? '' : ` · note: it has parents [${have.map((x) => '#' + x).join(', ') || 'none'}], not [${parents.map((x) => '#' + x).join(', ') || 'none'}]`;
    return { id: existing.id, sent: false, note: `already on chain as #${existing.id}${existing.meta.creator === w.address ? '' : ` (inscribed by ${short(existing.meta.creator)})`}, identical bytes; re-used, nothing sent${warn}` };
  }
  const n = f.chunks.length;
  const rel = `${parents.length ? `, child of ${parents.map((p) => '#' + p).join(', ')}` : ''}${deps.length ? `, depends on ${deps.map((d) => '#' + d).join(', ')}` : ''}`;
  let id = '';
  const sealedId = async () => eventually(`${f.label} inscription id`, async () => {
    const found = await findSealed(f);
    if (!found) return 'not sealed yet';
    if (found.meta.creator !== w.address) return `sealed by ${short(found.meta.creator)}`;
    id = found.id; return null;
  });
  if (n <= SINGLE_MAX_CHUNKS && (await uploadIndex(f)) === null) {
    const fee = await singleFee(f.bytes.length, n);
    await runTx(sid, `${f.label}: inscribe (one transaction)`, () => rootCall(state.core, 'mint-single-tx-with-relationships',
      [bufferCV(f.hash), stringAsciiCV(f.mime), uintCV(f.bytes.length), listCV(f.chunks.map((c) => bufferCV(c))), stringAsciiCV(TOKEN_URI),
        listCV(deps.map((d) => uintCV(d))), listCV(parents.map((p) => uintCV(p)))], payAtMost(fee)));
    await sealedId();
    return { id, sent: true, note: `inscribed in one transaction as #${id} (${kb(f.bytes.length)}, ${n} chunk${n > 1 ? 's' : ''})${rel}` };
  }
  const fees = await stagedFees(f.bytes.length, n);
  if ((await uploadIndex(f)) === null) {
    await runTx(sid, `${f.label}: begin`, () => rootCall(state.core, 'begin-or-get',
      [bufferCV(f.hash), stringAsciiCV(f.mime), uintCV(f.bytes.length), uintCV(n)], payAtMost(fees.begin)));
  }
  await eventually(`${f.label} upload session`, async () => ((await uploadIndex(f)) === null ? 'no session yet' : null));
  let idx = (await uploadIndex(f))!;
  while (idx < n) {
    const from = idx, end = Math.min(idx + BATCH, n);
    status(`Uploading ${f.label} chunks ${from + 1}–${end} of ${n}…`);
    await runTx(sid, `${f.label}: chunks ${from}-${end - 1}`, () => rootCall(state.core, 'add-chunk-batch',
      [bufferCV(f.hash), listCV(f.chunks.slice(from, end).map((c) => bufferCV(c)))]));
    await eventually(`${f.label} chunk progress`, async () => { const i = await uploadIndex(f); return i !== null && i >= end ? null : `index ${i}`; });
    idx = (await uploadIndex(f))!;
  }
  await runTx(sid, `${f.label}: seal`, () => rootCall(state.core, 'seal-with-relationships',
    [bufferCV(f.hash), stringAsciiCV(TOKEN_URI), listCV(deps.map((d) => uintCV(d))), listCV(parents.map((p) => uintCV(p)))], payAtMost(fees.seal)));
  await sealedId();
  return { id, sent: true, note: `sealed as #${id} (${kb(f.bytes.length)}, ${n} chunks, staged route)${rel}` };
};
/** Testnet only: the bundle's bytes from mainnet (#3078), from the gateway or else the mainnet core, used only if they hash to the pin. */
const mainnetBundle = async (): Promise<Uint8Array> => {
  try {
    const r = await fetch(`https://xtrata.xyz/i/${RELEASE.bundle.id}?raw=1`, { cache: 'no-store', credentials: 'omit' });
    if (r.ok) { const b = new Uint8Array(await r.arrayBuffer()); if (toHex(sha256(b)) === RELEASE.bundle.sha256) return b; }
  } catch { /* fall back to the chain */ }
  const b = joinBytes(await readChunks(String(RELEASE.bundle.id), RELEASE.bundle.chunks, 'mainnet bundle', { chain: new Chain('mainnet'), core: LAUNCH.networks.mainnet.core }));
  if (toHex(sha256(b)) !== RELEASE.bundle.sha256) throw new Error(`#${RELEASE.bundle.id} read from mainnet is not the pinned bundle.`);
  return b;
};
const sigs = (chunks: number) => (chunks <= SINGLE_MAX_CHUNKS ? 1 : 2 + Math.ceil(chunks / BATCH));

// ---------- the parent ----------
/** The world block the parent hands the hall (window.XA_WORLD_CONFIG). */
export const worldIds = () => ({ posters: cid(NAMES.posters), registry: cid(NAMES.world), screen: cid(NAMES.screen) });
/** The games block the parent hands the hall (window.XA_GAMES_CONFIG): the contract it reads the extra games from. */
export const gamesIds = () => ({ contract: cid(NAMES.games) });
const parentConfig = (packIds: Record<string, string>) => {
  const bid = Number(bundleId());
  const hashes: Record<string, string> = { [String(bid)]: RELEASE.bundle.sha256 };
  for (const n of RELEASE.inscribe) if (packIds[n]) hashes[String(packIds[n])] = RELEASE.packSha[n];
  return ParentRender.parentConfig({ ...RELEASE.ids, bundleId: bid, packs: Object.fromEntries(RELEASE.inscribe.map((n) => [n, Number(packIds[n] || 0)])), hashes, world: worldIds(), games: gamesIds() }, RELEASE.packOrder);
};
let parentCache: { key: string; upload: Upload } | null = null;
export const parentUpload = (): Upload => {
  const ids = state.packIds || {};
  const missing = RELEASE.inscribe.filter((n) => !ids[n]);
  if (missing.length) throw new Error(`The ${missing.join(' and ')} pack${missing.length > 1 ? 's have' : ' has'} no inscription id yet. Run the pack steps first.`);
  const key = JSON.stringify([ids, network, String(bundleId())]);
  if (parentCache?.key !== key) {
    const cfg = parentConfig(ids);
    if (JSON.stringify(cfg.world) !== JSON.stringify(worldIds())) throw new Error('The parent renderer did not carry the world block through. Rebuild the canary.');
    if (JSON.stringify(cfg.games) !== JSON.stringify(gamesIds())) throw new Error('The parent renderer did not carry the games block through. Rebuild the canary.');
    parentCache = { key, upload: makeUpload('parent', 'parent', 'text/html', ParentRender.fillParent(RELEASE.shell, cfg)) };
  }
  return parentCache.upload;
};
export const parentEstimate = () => {
  try {
    const bid = network === 'mainnet' ? RELEASE.bundle.id : 9999999;
    const cfg = ParentRender.parentConfig({ ...RELEASE.ids, bundleId: bid, packs: Object.fromEntries(RELEASE.inscribe.map((n) => [n, 9999999])),
      hashes: { [String(bid)]: RELEASE.bundle.sha256, ...Object.fromEntries(RELEASE.inscribe.map((n, i) => [String(9999990 + i), RELEASE.packSha[n]])) }, world: worldIds(), games: gamesIds() }, RELEASE.packOrder);
    return new TextEncoder().encode(ParentRender.fillParent(RELEASE.shell, cfg)).length;
  } catch { return RELEASE.shell.length + 2000; }
};
const parentDeps = (): bigint[] => [bundleId(), ...RELEASE.inscribe.map((n) => BigInt(state.packIds![n]))];

// ---------- reads: the three new contracts ----------
const wread = async (fn: string, args: ClarityValue[] = []) => plain(await chain.read(cid(NAMES.world), fn, args));
const pread = async (fn: string, args: ClarityValue[] = []) => plain(await chain.read(cid(NAMES.posters), fn, args));
const sread = async (fn: string, args: ClarityValue[] = []) => plain(await chain.read(cid(NAMES.screen), fn, args));
const gread = async (fn: string, args: ClarityValue[] = []) => plain(await chain.read(cid(NAMES.games), fn, args));
type Kind = { id: number; category: number; name: string; tier: number; builtin: string; hidden: boolean; approved: boolean; owner: string };
const readKinds = async (): Promise<Kind[]> => {
  const count = Number(await wread('get-kind-count'));
  const out: Kind[] = [];
  for (let i = 0; i < count; i += 20) {
    const ids = Array.from({ length: Math.min(20, count - i) }, (_, k) => i + k);
    const rows = await wread('get-kinds', [listCV(ids.map((x) => uintCV(x)))]);
    rows.forEach((k: any, j: number) => { if (k) out.push({ id: ids[j], ...k }); });
  }
  return out;
};
/** The built-in kinds by key. A planned key that exists but is hidden, unapproved or of another category is a problem, not "done". */
const kindPlan = async () => {
  const have = await readKinds();
  const byKey: Record<string, Kind> = {};
  for (const k of have) if (k.tier === 0 && !byKey[k.builtin]) byKey[k.builtin] = k;
  const problems: string[] = [];
  for (const k of V2.HALL_KINDS as { key: string; category: number }[]) {
    const got = byKey[k.key];
    if (!got) continue;
    if (got.hidden || !got.approved) problems.push(`kind ${k.key} (#${got.id}) is ${got.hidden ? 'hidden' : 'not approved'}`);
    if (got.category !== k.category) problems.push(`kind ${k.key} (#${got.id}) has category ${got.category}, the schema says ${k.category}`);
  }
  return { have, byKey, count: have.length, problems };
};
const resolvePath = async (slugs: string[]): Promise<number | null> => {
  const id = await wread('resolve-path', [listCV(slugs.map((s) => stringAsciiCV(s)))]);
  return typeof id === 'number' && id > 1 ? id : null;
};
const getSpace = async (id: number) => wread('get-space', [uintCV(id)]);
const pathOf = (slug: string): string[] => (slug === 'arcade' ? ['arcade'] : ['arcade', slug]);
/** Objects of a space, read with the light page (get-objects-8: 8 rows, 16 map reads) up to its object slots. */
const spaceObjects = async (spaceId: number) => {
  const sp = await getSpace(spaceId);
  const slots = Number(sp?.['object-slots'] ?? 0);
  const out: { id: number; object: any }[] = [];
  for (let p = 0; p * 8 < slots; p++) {
    const rows = await wread('get-objects-8', [uintCV(spaceId), uintCV(p)]);
    for (const r of rows) if (r && r.object) out.push({ id: r.id, object: r.object });
  }
  return out;
};
const stateCount = async (obj: number) => Number(await wread('get-state-count', [uintCV(obj)]));
const worldRoot = async () => wread('get-root');
const worldAdmin = async (who: string) => Number(await wread('get-admin', [principalCV(who)]));

// ---------- the registry plan: contracts/arcade-world/ops/lib/v2-plan.mjs launchCalls(), replayed against the chain ----------
type Call = { fn: string; args: any[]; note: string };
/** The full ordered hall-only launch for the root wallet (24 kinds, arcade + hall, live, the publisher grant if configured, 4 bays). */
export const launchPlan = () => {
  const r = V2.launchCalls({ network, owner: rootAddr(), publisher: NET().hallPublisher || undefined });
  if (r.errors.length) throw new Error(`The registry planner refused: ${r.errors.join('; ')}`);
  return r as { contract: string; calls: Call[]; manifest: any };
};
const cvArg = (a: any) => V2.clarityArg(a, Cl) as ClarityValue;
/** A read in the planner's form (relay-steps args in, plain JS out), for verifyManifest(). */
const planRead = async (fn: string, args: any[]) => plain(await chain.read(cid(NAMES.world), fn, args.map(cvArg)));
type Ctx = { k: Awaited<ReturnType<typeof kindPlan>>; spaces: Record<string, { id: number | null; sp: any }>; objs: Record<number, { id: number; object: any }[]> };
const readCtx = async (m: any): Promise<Ctx> => {
  const k = await kindPlan();
  const spaces: Ctx['spaces'] = {};
  for (const slug of Object.keys(m.spaces)) { const id = await resolvePath(pathOf(slug)); spaces[slug] = { id, sp: id ? await getSpace(id) : null }; }
  const objs: Ctx['objs'] = {};
  for (const s of Object.values(spaces)) if (s.id) objs[s.id] = await spaceObjects(s.id);
  return { k, spaces, objs };
};
/**
 * Is this planned call already on chain? The planner PREDICTS ids (spaces and objects share next-id, kinds count from 0), so a
 * call that is done with a different id than planned is a problem: something else wrote to the registry, and the plan's later
 * arguments would point at the wrong ids. The canary stops there instead of guessing.
 */
const judge = async (c: Call, m: any, x: Ctx): Promise<{ done: boolean; problem?: string }> => {
  const me = rootAddr();
  switch (c.fn) {
    case 'register-kind': {
      const key = c.args[4].ascii, got = x.k.byKey[key];
      if (!got) return { done: false };
      return got.id === m.kinds[key] ? { done: true } : { done: true, problem: `kind ${key} is #${got.id}; the plan expects #${m.kinds[key]}` };
    }
    case 'create-space': {
      const slug = c.args[1].ascii, s = x.spaces[slug];
      if (!s?.id) return { done: false };
      if (s.id !== m.spaces[slug]) return { done: true, problem: `space ${pathOf(slug).join('/')} is #${s.id}; the plan expects #${m.spaces[slug]}` };
      if (s.sp.owner !== me) return { done: true, problem: `space ${pathOf(slug).join('/')} (#${s.id}) is owned by ${s.sp.owner}, not the root wallet. ${H1()}` };
      return { done: true };
    }
    case 'set-space-state': {
      const id = c.args[0].uint, s = Object.values(x.spaces).find((v) => v.id === id);
      if (!s?.sp) return { done: false };
      if (s.sp.state === 1) return { done: true };
      if (s.sp.state === 0) return { done: false };
      return { done: true, problem: `space #${id} is ${['draft', 'live', 'suspended', 'retired'][s.sp.state]}; only its moderators can change that` };
    }
    case 'grant': {
      const space = c.args[0].uint, who = c.args[1].principal;
      const s = Object.values(x.spaces).find((v) => v.id === space);
      if (!s?.sp) return { done: false };
      const g = await wread('get-grant', [uintCV(space), principalCV(who)]);
      return { done: !!g && g.caps === c.args[2].uint && g.epoch === s.sp.epoch && g.expires === c.args[4].uint };
    }
    case 'create-object': {
      const space = c.args[0].uint, name = c.args[3].ascii;
      const slug = Object.keys(m.spaces).find((k) => m.spaces[k] === space)!;
      const want = m.objects[`${slug}/${name}`];
      const o = (x.objs[space] || []).find((r) => r.object.name === name && r.object.parent === c.args[1].uint);
      if (!o) return { done: false };
      if (o.id !== want.id) return { done: true, problem: `${slug}/${name} is #${o.id}; the plan expects #${want.id}` };
      if (o.object.kind !== c.args[2].uint) return { done: true, problem: `${slug}/${name} (#${o.id}) is kind #${o.object.kind}, not #${c.args[2].uint}` };
      if (o.object.state >= 2) return { done: true, problem: `${slug}/${name} (#${o.id}) is retired or moderated (state ${o.object.state})` };
      return { done: true };
    }
    default: return { done: false, problem: `the plan has a call this canary does not know how to check: ${c.fn}` };
  }
};
/** Where the registry stands against the plan: the calls still to make, and anything the canary must not paper over. */
const registryStatus = async () => {
  const plan = launchPlan(), m = plan.manifest;
  const x = await readCtx(m);
  const todo: Call[] = [];
  const problems = [...x.k.problems];
  for (const c of plan.calls) { const j = await judge(c, m, x); if (j.problem) problems.push(j.problem); if (!j.done) todo.push(c); }
  return { plan, m, x, todo, problems };
};

// ---------- the leaderboard (the v1 launch canary's code, with the parent as engine id) ----------
const scoresId = () => cid(NAMES.scores);
const readScores = (fn: string, args: ClarityValue[] = []) => chain.read(scoresId(), fn, args);
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
const engineOk = (engineId: string) => engineId === state.inscriptionId;
const canaryDone = async () => { const b = await readBoard(CANARY_BOARD); return !!b && b.enabled === 'false' && b.engineId === state.inscriptionId; };
const boardMatches = (b: Awaited<ReturnType<typeof readBoard>>, want: Board) =>
  !!b && b.mode === String(want.mode) && b.maxScore === String(want.max) && b.fee === '0' && engineOk(b.engineId) && b.daily === 'false' && b.enabled === 'true';
const boardFloat = (n: number, o: { propose?: boolean; accept?: boolean } = {}) =>
  TEMP_TX_FEE * BigInt(n + (o.propose === false ? 0 : 1) + (o.accept === false ? 0 : 1)) + SWEEP_TX_FEE + 20_000n;
const boardPlan = async () => {
  const todo: Board[] = [];
  for (const b of PRODUCTION) if (!boardMatches(await readBoard(b.id), b)) todo.push(b);
  return { todo, owner: await ownerOf(), pending: await pendingOwnerOf() };
};
/** Gives leaderboard ownership back to the root wallet if the temporary wallet holds it. Does nothing when it is already back. */
export const handBack = async () => {
  const me = rootAddr(), hot = hotAddress();
  const owner = await ownerOf();
  if (owner === me) return false;
  if (owner !== hot) throw new Error(`The leaderboard is owned by ${owner}, which is neither the root wallet nor the temporary wallet.`);
  await ensureHotFunds('production', TEMP_TX_FEE + SWEEP_TX_FEE + 20_000n, 'handing ownership back');
  if ((await pendingOwnerOf()) !== me) {
    await hotCall('production', 'temporary wallet hands ownership back (propose)', scoresId(), 'propose-owner', [principalCV(me)]);
    await eventually('Pending owner', async () => ((await pendingOwnerOf()) === me ? null : 'not proposed yet'));
  }
  await runTx('production', uniq('production', 'your wallet accepts ownership back'), () => rootCall(scoresId(), 'accept-owner', []));
  await eventually('Owner', async () => ((await ownerOf()) === me ? null : 'not accepted yet'));
  log('ok', `Leaderboard ownership is back with ${short(me)}.`);
  return true;
};
/** Removes the temporary wallet's KINDS admin role if it still has one (root wallet signs set-admin … u0). */
export const revokeHotAdmin = async (stepId: string) => {
  const hot = hotAddress();
  if (!(await chain.contractSource(cid(NAMES.world)))) return false;
  if ((await worldAdmin(hot)) === 0) return false;
  await runTx(stepId, uniq(stepId, `remove the temporary KINDS admin ${short(hot)}`), () => rootCall(cid(NAMES.world), 'set-admin', [principalCV(hot), uintCV(0)]));
  await eventually('KINDS admin removed', async () => ((await worldAdmin(hot)) === 0 ? null : 'still an admin'));
  return true;
};

// ---------- the arcade engine (browser): flying a real run ----------
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
  for (let steps = 0; steps < 20000 && !st.over; steps++) {
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
  return { st, rec };
};
const withArcade = <T,>(fn: (win: any) => Promise<T>) => {
  if (!host.withArcade) throw new Error('Flying and re-playing a run needs the embedded arcade, which only the browser page has.');
  return host.withArcade(fn);
};
/**
 * The address the arcade flies a run as. The engine only pilots mainnet-form addresses (arcade-replay.js pilotFor), while the
 * leaderboard checks only the replay's hash160 (bytes 4..24) against the sender, which is the same key on both networks. So on
 * testnet the run is flown, and re-played, as the root key's mainnet form, and the testnet leaderboard accepts it from the ST address.
 */
const pilotAddress = (address: string) => (network === 'testnet' ? addressToString(addressFromVersionHash(AddressVersion.MainnetSingleSig, createAddress(address).hash160)) : address);
const makeRun = async (signer: string) => { const address = pilotAddress(signer); return withArcade(async (win) => {
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
}); };

// ---------- contracts on chain ----------
type Presence = 'free' | 'ours' | 'other';
const sameSource = (have: string, want: string) => shaHex(have) === shaHex(want) || shaHex(have.replace(/\r\n/g, '\n')) === shaHex(want);
const presence = async (id: string, want: string): Promise<Presence> => {
  const src = await chain.contractSource(id);
  return src === null ? 'free' : sameSource(src, want) ? 'ours' : 'other';
};
const contractSrc = (name: string): string => LAUNCH.contracts[network][name];
/** Deploys `name` from the root wallet if it is not on chain; refuses a name taken by other source; waits until visible. */
const deployOne = async (sid: string, name: string, code: string, clarityVersion: number) => {
  const id = cid(name);
  const p = await presence(id, code);
  if (p === 'other') throw new Error(`${id} already exists with different source. It cannot be replaced; nothing was sent.`);
  if (p === 'ours') return `${name} already deployed with the pinned source`;
  const rec = await runTx(sid, `deploy ${name}`, () => requireRoot().deploy(name, code, clarityVersion));
  await eventually(`${name} visible`, async () => ((await chain.contractSource(id)) === null ? 'not visible yet' : null));
  if ((await presence(id, code)) !== 'ours') throw new Error(`${id} was deployed but its source on chain differs from the pinned source.`);
  return `${name} deployed (Clarity ${clarityVersion}) in block ${(rec as any).block ?? '?'}`;
};
const estDeploy = (code: string) => BigInt(new TextEncoder().encode(code).length) * FEE_EST.deployPerByte;

// ---------- the steps ----------
export type Step = { id: string; title: string; who: string; intro: string; action: string; testnetOnly?: boolean; browserOnly?: boolean; run: () => Promise<string | void> };

const packStep = (f: Upload): Step => ({
  id: `pack-${f.key}`, title: `Inscribe the ${f.label}`, who: `Web wallet · ${sigs(f.chunks.length)} signature${sigs(f.chunks.length) === 1 ? '' : 's'} (none if these bytes are already inscribed)`,
  intro: `Inscribes the ${f.label} (${HallParts.PACKS[f.key].join(', ')}): ${f.bytes.length.toLocaleString()} bytes, ${f.chunks.length} chunk${f.chunks.length > 1 ? 's' : ''}, sha256 ${short(f.sha)}, as a child of ${parentList()}. ${f.chunks.length <= SINGLE_MAX_CHUNKS ? 'One transaction (mint-single-tx-with-relationships), the fee capped by a post-condition.' : 'Begin, upload and seal, each resumed from the chain.'} If these exact bytes are already inscribed, that inscription is re-used and nothing is sent.`,
  action: `Inscribe ${f.label}`,
  run: async () => {
    const r = await inscribe(`pack-${f.key}`, f, [], parentIds());
    state.packIds = { ...(state.packIds || {}), [f.key]: r.id }; save();
    return `${f.label}: ${r.note}`;
  }
});

export const STEPS: Step[] = [
  {
    id: 'connect', title: 'Connect the root wallet', who: 'Web wallet',
    intro: 'Opens the wallet chooser, then the wallet\'s own account picker. Pick the root owner for this network: it deploys the three contracts, owns every space, owns #55 and the leaderboard, inscribes the release and moves the boards.',
    action: 'Connect wallet',
    run: async () => {
      const s = await host.connect();
      if (s.wrongNetwork) throw new Error(`The wallet returned a ${s.wrongNetwork} address (${s.address}). Switch the wallet to ${network} and connect again.`);
      signer = s;
      state.root = rootAddr(); save();
      let balance = 'could not check';
      try { balance = stx(await chain.balance(s.address)); } catch { /* shown as could not check */ }
      const who = s.address === rootAddr() ? 'the configured root owner' : `NOT the root owner ${rootAddr()}: preflight will stop. ${H1()}`;
      if (s.address !== rootAddr()) log('warn', `Connected ${s.address}, which is not the root owner for ${network}.`);
      return `${s.label} · ${s.address} · ${who} · balance ${balance}${s.publicKey ? '' : ' · no public key (sign-only fallback unavailable)'}`;
    }
  },
  {
    id: 'preflight', title: 'Preflight: pins, root wallet, core, fees, what exists', who: 'Reads only',
    intro: `Checks every embedded contract and pack against its pin, that the connected wallet is the root owner for this network (a hard stop otherwise), that the core is live, quotes every inscription fee, estimates the deploy and call fees, checks the balance covers them, flies a real run in the ${VERSION} arcade, and reads what is already on chain (contracts by source, inscriptions by chain hash, the registry) so a re-run resumes instead of repeating.`,
    action: 'Run preflight',
    run: async () => {
      const w = requireRoot();
      const notes: string[] = [];
      // pins
      for (const [n, src] of Object.entries(LAUNCH.contracts[network] as Record<string, string>)) if (shaHex(src) !== LAUNCH.contractSha[network][n]) throw new Error(`Embedded ${n} does not match its pin. Rebuild the canary.`);
      for (const f of PACKS) if (f.sha !== RELEASE.packSha[f.key]) throw new Error(`Embedded ${f.label} is ${f.sha}, not the pinned ${RELEASE.packSha[f.key]}. Rebuild the canary.`);
      if (shaHex(RELEASE.shell) !== RELEASE.shellSha) throw new Error('Embedded parent shell does not match its pin. Rebuild the canary.');
      if (shaHex(RELEASE.single) !== RELEASE.singleSha) throw new Error('Embedded single-file arcade does not match its pin. Rebuild the canary.');
      for (const f of PACKS) {
        const got = HallParts.parsePack(f.text);
        for (const p of HallParts.PACKS[f.key]) if (shaHex(got[p]) !== RELEASE.partSha[p]) throw new Error(`The ${f.label} does not carry the pinned ${p}.`);
      }
      notes.push(`release ${short(RELEASE_SHA)} and ${Object.keys(LAUNCH.contracts[network]).length} contracts match their pins`);
      // the core
      if (state.core !== NET().core) throw new Error(`The core is set to ${state.core}, but this canary's ${network} contracts were built for ${NET().core} (their inscription checks call it). Use that core, or rebuild with XA_TESTNET_CORE.`);
      const coreSrc = await chain.contractSource(state.core);
      const coreMissing = coreSrc === null;
      if (coreMissing) {
        if (network === 'mainnet') throw new Error(`The core ${state.core} is not on mainnet.`);
        if (!NET().canDeployCore) throw new Error(`The testnet core ${state.core} is not deployed, and it is not at the root wallet's address, so this canary cannot deploy it.`);
        notes.push('testnet core not deployed yet: the next step deploys it');
      } else {
        const paused = asText(await readCore('is-paused'));
        let admin = '';
        try { admin = asText(await readCore('get-admin')); } catch { /* optional read */ }
        if (paused !== 'false' && admin !== w.address) throw new Error('The core inscription contract is paused, and this wallet is not its admin.');
        notes.push(`core ${short(state.core)} ${paused === 'false' ? 'open' : 'paused (you are its admin)'}`);
      }
      // bundle and parents
      let need = FEE_EST.buffer;
      if (network === 'mainnet') {
        const bundle = await inscriptionMeta(String(RELEASE.bundle.id));
        if (!bundle) throw new Error(`Bundle #${RELEASE.bundle.id} does not exist on this core.`);
        if (!bundle.sealed || bundle.hash !== RELEASE.bundle.chainHash || bundle.size !== RELEASE.bundle.bytes)
          throw new Error(`#${RELEASE.bundle.id} is not the pinned bundle (sealed ${bundle.sealed}, ${bundle.size} bytes, hash ${short(bundle.hash)}).`);
        for (const p of parentIds()) {
          const ownerCv = await readCore('get-owner', [uintCV(p)]);
          if (isNone(ownerCv)) throw new Error(`Parent inscription #${p} does not exist on this core.`);
          const owner = asText(ownerCv);
          if (owner !== w.address) throw new Error(`Parent inscription #${p} is owned by ${owner}, not the root wallet. Move it to ${w.address} first: the core only accepts a parent the signer owns.`);
        }
        notes.push(`bundle #${RELEASE.bundle.id} verified · ${parentList()} owned by the root wallet`);
      } else if (!coreMissing) {
        const b = await findSealedBy(BUNDLE_HASH, RELEASE.bundle.bytes), s = await findSealed(standInUpload());
        if (b) state.bundleId = b.id;
        if (s) state.standIn = s.id;
        save();
        notes.push(`testnet bundle ${b ? `#${b.id}` : 'not inscribed yet'} · stand-in for #55 ${s ? `#${s.id}` : 'not inscribed yet'}`);
        if (!b) need += await inscribeFee(RELEASE.bundle.bytes, RELEASE.bundle.chunks) + BigInt(RELEASE.bundle.bytes) * FEE_EST.inscribePerByte;
        if (!s) need += await inscribeFee(standInUpload().bytes.length, 1) + FEE_EST.call;
      }
      if (coreMissing) for (const n of CORE_TRIO) need += estDeploy(LAUNCH.coreTestnet[n]);
      // contracts
      const plan: string[] = [];
      for (const n of [...NEW_CONTRACTS, NAMES.scores]) {
        const p = await presence(cid(n), contractSrc(n));
        if (p === 'other') throw new Error(`${cid(n)} already exists with different source. This canary refuses to work with it. ${n === NAMES.scores ? '' : 'A contract name cannot be reused; the launch needs that exact name at the root address.'}`);
        if (p === 'free') {
          if (n === NAMES.scores && network === 'mainnet') throw new Error(`${cid(n)} is not on mainnet. The leaderboard is expected to be live (it holds every Top 10); stop and check.`);
          const est = estDeploy(contractSrc(n));
          need += est;
          plan.push(`deploy ${n} (${kb(contractSrc(n).length)}, ~${stx(est)} network fee estimated at ${FEE_EST.deployPerByte} µSTX per byte; the wallet sets the real fee)`);
        } else plan.push(`${n} already deployed`);
      }
      const scoresUp = (await chain.contractSource(scoresId())) !== null;
      if (scoresUp) {
        const owner = await ownerOf();
        if (owner !== w.address) throw new Error(`The leaderboard ${scoresId()} is owned by ${owner}. The board steps need the root wallet to own it; hand it back first.`);
        const b = await readBoard(PRODUCTION[0].id);
        notes.push(b ? `boards currently on engine #${b.engineId}` : 'no production boards yet');
      }
      // the registry
      const fullPlan = launchPlan();
      const kindCalls = fullPlan.calls.filter((c) => c.fn === 'register-kind').length;
      let reg = `registry: ${fullPlan.calls.length} calls to make (fresh; planned by ops/lib/v2-plan.mjs launchCalls)`;
      if ((await chain.contractSource(cid(NAMES.world))) !== null) {
        const root = await worldRoot();
        if (root.owner !== w.address) throw new Error(`${cid(NAMES.world)} has root owner ${root.owner}, not the root wallet. ${H1()}`);
        const r = await registryStatus();
        if (r.problems.length) throw new Error(`The registry holds things this launch cannot fix: ${r.problems.join('; ')}.`);
        const k = r.todo.filter((c) => c.fn === 'register-kind').length;
        reg = `registry: ${r.todo.length} of ${fullPlan.calls.length} planned calls still to make (${k} kinds, ${r.todo.length - k} hall calls)`;
        need += BigInt(r.todo.length - k) * FEE_EST.call + (k ? boardFloat(k) + 3n * FEE_EST.call : 0n);
      } else need += BigInt(fullPlan.calls.length - kindCalls + 3) * FEE_EST.call + boardFloat(kindCalls);
      plan.push(reg);
      // inscriptions
      const known: Record<string, string> = { ...(state.packIds || {}) };
      if (!coreMissing) {
        for (const f of PACKS) {
          const found = await findSealed(f);
          if (found) { known[f.key] = found.id; plan.push(`${f.key} pack already #${found.id}`); continue; }
          const fee = await inscribeFee(f.bytes.length, f.chunks.length);
          need += fee + BigInt(f.bytes.length) * FEE_EST.inscribePerByte;
          plan.push(`${f.key} pack ${kb(f.bytes.length)} (${stx(fee)})`);
        }
        state.packIds = known; save();
        let parentNote = '';
        if (PACKS.every((f) => known[f.key]) && (network === 'mainnet' || state.bundleId)) {
          const found = await findSealed(parentUpload());
          if (found) { state.inscriptionId = found.id; parentNote = `parent already #${found.id}`; }
        }
        if (!parentNote) {
          const size = parentEstimate();
          const fee = await inscribeFee(size, Math.ceil(size / CHUNK));
          need += fee + BigInt(size) * FEE_EST.inscribePerByte;
          parentNote = `parent ~${kb(size)} (${stx(fee)})`;
        }
        plan.push(parentNote);
      }
      // boards
      need += FUND_AMOUNT + boardFloat(PRODUCTION.length) + 8n * FEE_EST.call;
      save();
      // The run proof needs the embedded arcade (the page). A host without it (the Node runner) stops before the score steps.
      if (!state.run && host.withArcade) { state.run = await makeRun(w.address); save(); }
      const balance = await chain.balance(w.address);
      if (balance < need) throw new Error(`The root wallet holds ${stx(balance)}, below the ~${stx(need)} this run may need (deploys estimated at ${FEE_EST.deployPerByte} µSTX per byte, about ${stx(FEE_EST.call)} per call, inscription fees as quoted, the temporary wallet's floats, and a ${stx(FEE_EST.buffer)} buffer). Top it up and run preflight again.`);
      step('preflight').data = { coreMissing };
      return `${network} · root wallet ${short(w.address)} confirmed · ${notes.join(' · ')} · to do: ${plan.join(', ')} · ${state.run ? `real run flown: ${state.run.game} scored ${state.run.score} and verified` : 'no run flown (this host has no arcade: the score steps need the page)'} · balance ${stx(balance)} covers the ~${stx(need)} estimated`;
    }
  },
  {
    id: 'core', title: 'Testnet only: deploy the Xtrata core if missing', who: 'Web wallet · 4 signatures on a fresh testnet', testnetOnly: true,
    intro: `Deploys the standard SIP-009 trait (nft-trait; the old testnet trait address is gone), then xtrata-v1-1-1, xtrata-v2-1-0 and xtrata-v3-2-3 (contracts/live, pointed at that trait) at Clarity 3 from the root wallet, in that order (the core reads the two older contracts), so a full rehearsal with inscriptions is possible on testnet. Each is skipped when it is already there with the pinned source. Never on mainnet.`,
    action: 'Deploy the testnet core',
    run: async () => {
      if (network !== 'testnet') throw new Error('The core is never deployed on mainnet.');
      requireRoot();
      if (state.core !== cid('xtrata-v3-2-3')) {
        if ((await chain.contractSource(state.core)) === null) throw new Error(`The core ${state.core} is missing and is not at the root wallet's address.`);
        return `core ${state.core} is already deployed (not by this canary): nothing to send`;
      }
      const out: string[] = [];
      for (const n of CORE_TRIO) out.push(await deployOne('core', n, LAUNCH.coreTestnet[n], 3));
      const admin = asText(await readCore('get-admin'));
      if (admin !== rootAddr()) throw new Error(`The core's admin is ${admin}, not the root wallet.`);
      return `${out.join(' · ')} · admin ${short(admin)} · paused ${asText(await readCore('is-paused'))} (the admin can inscribe while paused)`;
    }
  },
  {
    id: 'fixtures', title: 'Testnet only: the bundle and a stand-in for #55', who: `Web wallet · ${sigs(RELEASE.bundle.chunks) + 1} signatures on a fresh testnet core`, testnetOnly: true,
    intro: `On mainnet the parent depends on #3078 (the v1.3 bundle) and every arcade inscription is a child of #55. A fresh testnet core has neither, so this step inscribes the same bundle bytes (${kb(RELEASE.bundle.bytes)}, read from mainnet #${RELEASE.bundle.id} and used only if they hash to the pin, staged route) and a small text that stands in for #55, each found by its chain hash and re-used if already there. Never on mainnet.`,
    action: 'Inscribe the testnet fixtures',
    run: async () => {
      if (network !== 'testnet') throw new Error('Fixtures are for testnet only.');
      const s = await inscribe('fixtures', standInUpload(), [], []);
      state.standIn = s.id; save();
      const have = await findSealedBy(BUNDLE_HASH, RELEASE.bundle.bytes);
      let note = '';
      if (have) { state.bundleId = have.id; note = `already on chain as #${have.id}, identical bytes; re-used, nothing sent`; }
      else {
        status('Reading the bundle from mainnet…');
        const b = await inscribe('fixtures', makeUploadBytes('bundle', BUNDLE_LABEL, 'text/html', await mainnetBundle()), [], []);
        state.bundleId = b.id; note = b.note;
      }
      save();
      return `stand-in for #55: ${s.note} · bundle: ${note}`;
    }
  },
  {
    id: 'deploy', title: 'Deploy xtrata-world-v2, xtrata-posters-v1, xtrata-screen-v1, xtrata-games-v1', who: 'Web wallet · 4 signatures (fewer when some are already deployed)',
    intro: `Deploys the four contracts at Clarity 4 from the root wallet, so it becomes the registry's root owner and treasury and the posters, screen and games admin. Each is skipped when it is already on chain with the pinned source, and refused when the name exists with any other source. On testnet the leaderboard (xtrata-arcade-scores-v2) is deployed too if it is missing; on mainnet it is already live. Then every source is read back and compared with its pin.`,
    action: 'Deploy contracts',
    run: async () => {
      const w = requireRoot();
      const out: string[] = [];
      for (const n of NEW_CONTRACTS) out.push(await deployOne('deploy', n, contractSrc(n), 4));
      if (network === 'testnet') out.push(await deployOne('deploy', NAMES.scores, contractSrc(NAMES.scores), 4));
      for (const n of [...NEW_CONTRACTS, NAMES.scores]) if ((await presence(cid(n), contractSrc(n))) !== 'ours') throw new Error(`${cid(n)} does not hold the pinned source.`);
      const root = await worldRoot();
      if (root.owner !== w.address || (root.treasury !== w.address && root.treasury !== NET().treasury)) throw new Error(`${NAMES.world}: root owner ${root.owner}, treasury ${root.treasury}; expected ${w.address}. ${H1()}`);
      const pc = await pread('get-config');
      if (pc.admin !== w.address) throw new Error(`${NAMES.posters} admin is ${pc.admin}, not the root wallet.`);
      const sa = await sread('get-admin');
      if (sa !== w.address) throw new Error(`${NAMES.screen} admin is ${sa}, not the root wallet.`);
      const ga = await gread('get-admin');
      if (ga !== w.address) throw new Error(`${NAMES.games} admin is ${ga}, not the root wallet.`);
      return `${out.join(' · ')} · all sources match their pins · registry root owner ${short(root.owner)}, treasury ${short(root.treasury)} · posters, screen and games admin ${short(w.address)}`;
    }
  },
  {
    id: 'kinds', title: 'Registry: the 24 built-in kinds', who: 'Web wallet · 3 signatures (fund, add and remove a temporary KINDS admin); the kinds are signed by the temporary wallet',
    intro: `Registers the tier-0 kinds the hall draws (the bay, the curtain, signs, tape, sounds, lamps, the door skin and the 14 door styles), the first 24 calls of the launch plan (contracts/arcade-world/ops/lib/v2-plan.mjs launchCalls), in its order, skipping any already registered. The plan predicts every id, so before each kind the canary checks the next kind id is the one planned and stops otherwise. Rather than 24 wallet prompts, the root wallet makes the canary's temporary wallet a KINDS-only admin (set-admin … u2), the temporary wallet registers the kinds one after another, then the root wallet removes it (set-admin … u0) and its leftover funds are swept back. While it is an admin it can only register, hide or approve kinds; the root wallet can remove it at any point ("Remove the temporary KINDS admin" below). Its key is saved to a file first. Each kind records the temporary wallet in its "owner" field; neither the hall nor the contract uses that field. Tick "sign the kinds with my wallet" to sign all of them yourself instead. With 3 or fewer missing, the root wallet signs them itself.`,
    action: 'Register kinds',
    run: async () => {
      const w = requireRoot();
      const world = cid(NAMES.world);
      const hot = hotAddress();
      const { calls, manifest: m } = launchPlan();
      const kinds = calls.filter((c) => c.fn === 'register-kind');
      const status0 = await registryStatus();
      if (status0.problems.length) throw new Error(`The registry holds things this launch cannot fix: ${status0.problems.join('; ')}.`);
      const missing = () => kinds.filter((c) => !status0.x.k.byKey[c.args[4].ascii]);
      const removed = async () => { const r = await revokeHotAdmin('kinds'); const left = await sweepHot('kinds'); return `${r ? 'temporary KINDS admin removed · ' : ''}temporary wallet holds ${stx(left)}`; };
      if (!missing().length) return `all ${kinds.length} kinds registered with the planned ids 0..${kinds.length - 1}: nothing sent · ${await removed()}`;
      /** Sends one planned register-kind, but only if the next kind id on chain is the one the plan gives it. */
      const registerNext = async (signedBy: 'root' | 'hot') => {
        const k = await kindPlan();
        const next = kinds.find((c) => !k.byKey[c.args[4].ascii]);
        if (!next) return false;
        const key = next.args[4].ascii;
        if (k.count !== m.kinds[key]) throw new Error(`The registry holds ${k.count} kinds, so ${key} would get id ${k.count}, but the plan gives it ${m.kinds[key]}. Something else registered kinds; nothing was sent.`);
        status(`Registering kind ${key} (${m.kinds[key] + 1} of ${kinds.length})…`);
        if (signedBy === 'root') await runTx('kinds', `register-kind ${key}`, () => rootCall(world, next.fn, next.args.map(cvArg)));
        else await hotCall('kinds', `register-kind ${key}`, world, next.fn, next.args.map(cvArg));
        await eventually(`kind ${key}`, async () => { const got = (await kindPlan()).byKey[key]; return got ? (got.id === m.kinds[key] ? null : `id ${got.id}`) : 'not registered yet'; });
        return true;
      };
      const selfSign = state.kindsSelf || missing().length <= 3;
      if (selfSign) {
        await quiet(w.address);
        while (await registerNext('root')) { /* one at a time */ }
      } else {
        const n = missing().length;
        const float = boardFloat(n, { propose: false, accept: false });
        if (((await worldAdmin(hot)) & ADMIN_KINDS) === 0) {
          host.saveFile(`xtrata-arcade-v2-temp-wallet-${hot.slice(0, 8)}.json`, hotKeyFile('KINDS admin for the 24 built-in kinds'));
          if (!(await host.confirm(`${n} kinds to register.\n\nThe temporary wallet ${hot} will sign them as a KINDS-only admin of ${NAMES.world}. Its key has just been saved to a file: keep it until this step reports the admin role removed.\n\nYour wallet will: send it about ${stx(float)} for fees, make it a KINDS admin, and remove it again at the end. Continue?`))) throw new Error('Cancelled before anything was sent.');
        }
        await ensureHotFunds('kinds', float, 'kinds');
        if (((await worldAdmin(hot)) & ADMIN_KINDS) === 0) {
          await runTx('kinds', uniq('kinds', `make ${short(hot)} a KINDS admin`), () => rootCall(world, 'set-admin', [principalCV(hot), uintCV(ADMIN_KINDS)]));
          await eventually('KINDS admin', async () => (((await worldAdmin(hot)) & ADMIN_KINDS) ? null : 'not an admin yet'));
        }
        await quiet(hot);
        try {
          while (await registerNext('hot')) { /* one at a time, each confirmed */ }
        } catch (error) {
          throw new Error(`${errText(error)} — The temporary wallet is still a KINDS admin. Press this step's button again to continue, or "Remove the temporary KINDS admin" below.`);
        }
      }
      const after = await registryStatus();
      const left = after.todo.filter((c) => c.fn === 'register-kind');
      if (left.length || after.problems.length) throw new Error(`Kinds still missing or wrong: ${[...left.map((c) => c.args[4].ascii), ...after.problems].join(', ')}.`);
      return `all ${kinds.length} kinds registered with the planned ids (${selfSign ? 'signed by your wallet' : 'signed by the temporary KINDS admin'}) · ${await removed()}`;
    }
  },
  {
    id: 'hall', title: 'Registry: the arcade and hall spaces, four bays', who: `Web wallet · ${NET().hallPublisher ? 9 : 8} signatures on a fresh registry (2 spaces, 2 set live, ${NET().hallPublisher ? '1 grant, ' : ''}4 bays)`,
    intro: `Replays the rest of the launch plan (ops/lib/v2-plan.mjs launchCalls, hall only) in its order: creates the arcade domain and the hall room with owner = the root wallet (native runtime, the schema's policies), sets both live, ${NET().hallPublisher ? `grants ${NET().hallPublisher} STATE only on the hall, ` : ''}and creates the four bay objects (bay-0 far left, bay-1 far right, bay-2 near left, bay-3 near right). A bay with no state shows its posters, so nothing more is written: no lobby, no doors, no casino (those come later by contract writes). Before each call it waits for the wallet's pending transactions to clear and re-reads the chain; a call already on chain is skipped, and one on chain with an id the plan did not predict stops the step. At the end the planner's verifyManifest() reads everything back in plan order.`,
    action: 'Build the hall',
    run: async () => {
      const w = requireRoot();
      const world = cid(NAMES.world);
      const { calls, manifest: m } = launchPlan();
      const rest = calls.filter((c) => c.fn !== 'register-kind');
      const done: string[] = [];
      let x = await readCtx(m);
      if (x.k.problems.length) throw new Error(x.k.problems.join('; '));
      for (const c of calls.filter((k) => k.fn === 'register-kind')) if (!(await judge(c, m, x)).done) throw new Error('Not every kind is registered yet. Run the kinds step first.');
      for (const c of rest) {
        let j = await judge(c, m, x);
        if (j.problem) throw new Error(`${j.problem}. Nothing more was sent.`);
        if (j.done) continue;
        await quiet(w.address);
        x = await readCtx(m);
        j = await judge(c, m, x);
        if (j.problem) throw new Error(`${j.problem}. Nothing more was sent.`);
        if (j.done) continue;
        await runTx('hall', c.note, () => rootCall(world, c.fn, c.args.map(cvArg)));
        await eventually(c.note, async () => { x = await readCtx(m); const r = await judge(c, m, x); return r.problem ? `${r.problem} (stop and check)` : r.done ? null : 'not on chain yet'; });
        const r = await judge(c, m, x);
        if (r.problem) throw new Error(`${r.problem}. Nothing more was sent.`);
        done.push(c.note);
      }
      const v = await V2.verifyManifest(m, planRead);
      if (!v.ok) throw new Error(`verifyManifest stopped at ${v.what}: expected ${JSON.stringify(v.expected)}, the chain has ${JSON.stringify(v.got)}.`);
      const changed: string[] = [];
      for (let i = 0; i < HALL_BAYS; i++) { const n = await stateCount(m.objects[`hall/bay-${i}`].id); if (n) changed.push(`bay-${i} has ${n} state${n > 1 ? 's' : ''}`); }
      step('hall').data = { spaces: m.spaces, bays: Array.from({ length: HALL_BAYS }, (_, i) => m.objects[`hall/bay-${i}`].id) };
      return `${done.length ? `${done.length} call${done.length > 1 ? 's' : ''} sent (${done.join(', ')})` : 'everything was already on chain: nothing sent'} · verifyManifest: ${v.checked} items match the plan · arcade #${m.spaces.arcade}, hall #${m.spaces.hall} owned by the root wallet and live · bays ${Array.from({ length: HALL_BAYS }, (_, i) => `${i}=#${m.objects[`hall/bay-${i}`].id}`).join(', ')}${changed.length ? ` · changed after launch by contract writes (left alone): ${changed.join(', ')}` : ' · no bay has a state: all four show posters'}`;
    }
  },
  {
    id: 'setup', title: 'Posters, screen and treasury setup', who: 'Web wallet · none with the default settings',
    intro: `Brings the three contracts to the configured launch settings and nothing more: the registry's treasury (${short(NET().treasury)}), the screen's fee recipient (${short(NET().screenFeeRecipient)}), ${(NET().posterPublishers as string[]).length ? `poster publishers ${(NET().posterPublishers as string[]).map(short).join(', ')}` : 'no poster publishers'}. With the defaults the deployer already holds every role, so nothing is sent.`,
    action: 'Check setup',
    run: async () => {
      const w = requireRoot();
      const out: string[] = [];
      const root = await worldRoot();
      if (root.owner !== w.address) throw new Error(`${NAMES.world} root owner is ${root.owner}. ${H1()}`);
      if (root.pending) throw new Error(`${NAMES.world} has a pending root owner ${root.pending}. The launch does not hand root anywhere; clear it (propose-root-owner to yourself) before continuing.`);
      if (root.treasury !== NET().treasury) {
        await quiet(w.address);
        await runTx('setup', `set-treasury ${short(NET().treasury)}`, () => rootCall(cid(NAMES.world), 'set-treasury', [principalCV(NET().treasury)]));
        out.push(`treasury set to ${short(NET().treasury)}`);
      }
      for (const who of NET().posterPublishers as string[]) {
        if (await pread('is-publisher', [principalCV(who)])) continue;
        await runTx('setup', `posters set-publisher ${short(who)}`, () => rootCall(cid(NAMES.posters), 'set-publisher', [principalCV(who), boolCV(true)]));
        out.push(`poster publisher ${short(who)}`);
      }
      const sc = await sread('get-config');
      if (sc['fee-recipient'] !== NET().screenFeeRecipient) {
        await runTx('setup', `screen set-fee-recipient ${short(NET().screenFeeRecipient)}`, () => rootCall(cid(NAMES.screen), 'set-fee-recipient', [principalCV(NET().screenFeeRecipient)]));
        out.push(`screen fee recipient ${short(NET().screenFeeRecipient)}`);
      }
      // The games contract: the wait before a new game goes live, and (mainnet) the one-way lock on it.
      let gc = await gread('get-config');
      if (!gc['delay-locked'] && Number(gc.delay) !== NET().gamesDelay) {
        await runTx('setup', `games set-delay ${NET().gamesDelay}`, () => rootCall(cid(NAMES.games), 'set-delay', [uintCV(NET().gamesDelay)]));
        out.push(`games delay ${NET().gamesDelay} blocks`);
        gc = await gread('get-config');
      }
      if (Number(gc.delay) !== NET().gamesDelay) throw new Error(`${NAMES.games} delay is ${gc.delay} blocks and is locked; the launch wants ${NET().gamesDelay}.`);
      if (NET().lockGamesDelay && !gc['delay-locked']) {
        await runTx('setup', 'games lock-delay', () => rootCall(cid(NAMES.games), 'lock-delay', [uintCV(NET().gamesDelay)]));
        out.push('games delay locked for ever');
      }
      return `${out.length ? out.join(' · ') : 'all at the launch settings: nothing sent'} · games delay ${NET().gamesDelay} blocks${NET().lockGamesDelay ? ' (locked)' : ''} · registry treasury ${short(NET().treasury)} · screen fee recipient ${short(NET().screenFeeRecipient)} · paid screen slots ${sc['slots-enabled'] ? 'ON' : 'off'} · posters review lane ${(await pread('get-config'))['review-lane'] ? 'on' : 'off'}`;
    }
  },
  {
    id: 'registry', title: 'Read the hall back with the hall\'s own reader', who: 'Reads only',
    intro: 'Runs the hall\'s own world reader (world.js and world2.js from the hall pack) against the registry, exactly as the parent will, and checks it finds the hall space live and four bay objects that all resolve to posters.',
    action: 'Read the hall',
    run: async () => {
      if (!host.readHall) throw new Error('This host cannot run the hall reader.');
      const r = await registryStatus();
      if (r.problems.length) throw new Error(r.problems.join('; '));
      if (r.todo.length) throw new Error(`The registry still needs ${r.todo.length} planned call(s). Run the kinds and hall steps first.`);
      const got = await host.readHall(cid(NAMES.world));
      if (got.meta.hall !== r.m.spaces.hall) throw new Error(`The hall reader resolved arcade/hall to ${got.meta.hall}, expected #${r.m.spaces.hall}.`);
      if (!Array.isArray(got.bays) || got.bays.length !== HALL_BAYS) throw new Error(`The hall reader returned ${got.bays?.length} bays, expected ${HALL_BAYS}.`);
      const bad: string[] = [];
      got.bays.forEach((b: any, i: number) => {
        if (!b) bad.push(`bay-${i} has no usable bay object`);
        else if (b.scene && (b.scene.baseId !== 0 || (b.scene.layers || []).length)) bad.push(`bay-${i} shows ${['posters', 'a wall', 'a door'][b.scene.baseId]}${(b.scene.layers || []).length ? ` with ${b.scene.layers.length} layer(s)` : ''}`);
      });
      if (bad.length) throw new Error(`Not every bay resolves to posters: ${bad.join('; ')}.`);
      return `hall space #${got.meta.hall} live · lobby ${got.meta.lobby ? `#${got.meta.lobby}` : 'none (as planned)'} · ${got.meta.objects} objects, ${got.meta.kinds} kind(s) in use · all four bays resolve to posters`;
    }
  },
  ...PACKS.map(packStep),
  {
    id: 'parent', title: 'Inscribe the parent with the world and games contracts', who: 'Web wallet · 1 signature (none if already inscribed)',
    intro: `Writes the pack ids, CONFIG.world = { posters, registry, screen } and CONFIG.games = { contract } (the four contracts at the root address) into the parent with the same renderer as modular.mjs build, and inscribes it as text/html, a child of ${parentList()} that depends on the bundle and the packs. This inscription is the arcade people open, and every board's engine id.`,
    action: 'Inscribe parent',
    run: async () => {
      const f = parentUpload();
      const r = await inscribe('parent', f, parentDeps(), parentIds());
      state.inscriptionId = r.id; save();
      return `Xtrata Arcade ${VERSION} parent: ${r.note} · ${f.bytes.length.toLocaleString()} bytes, sha256 ${short(f.sha)} · world ${JSON.stringify(worldIds())} · games ${JSON.stringify(gamesIds())}`;
    }
  },
  {
    id: 'release', title: 'Verify the release and boot it', who: 'Reads only',
    intro: `Reads every new inscription back (bytes, hash, type, size, parents, dependencies), resolves all ${PART_NAMES.length} parts from the chain as the parent does, then boots the parent in a hidden frame and checks the hall's world reader is on with exactly the three contract ids (and, on mainnet, that xtrata.xyz serves the parent).`,
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
        if (f === parent && !sameIds(parents, parentIds())) throw new Error(`Parent #${fid} has parents [${parents.map((x) => '#' + x).join(', ') || 'none'}], expected ${parentList()}.`);
        notes.push(`${f.key} #${fid} ${bytes.length.toLocaleString()} bytes ok${sameIds(parents, parentIds()) ? '' : ` (parents [${parents.join(', ') || 'none'}])`}`);
      }
      const deps = await idList('get-dependencies', id);
      if (!sameIds(deps, parentDeps())) throw new Error(`Parent #${id} depends on [${deps.map((x) => '#' + x).join(', ') || 'none'}], expected ${parentDeps().map((x) => '#' + x).join(', ')}.`);
      const bid = String(bundleId());
      const bundleBytes = joinBytes(await readChunks(bid, RELEASE.bundle.chunks, 'bundle'));
      if (toHex(sha256(bundleBytes)) !== RELEASE.bundle.sha256) throw new Error(`#${bid} read back from the chain is not the pinned bundle.`);
      const fromBundle = HallParts.splitRelease(new TextDecoder().decode(bundleBytes)).parts;
      const config = parentConfig(state.packIds!);
      const fromPack: Record<string, Record<string, string>> = {};
      for (const f of PACKS) fromPack[f.key] = HallParts.parsePack(chainText[state.packIds![f.key]]);
      const bad: string[] = [];
      const source: Record<string, number> = {};
      for (const name of PART_NAMES) {
        const pack = HallParts.packOf(name);
        const fromId = Number(config.packs[pack] || 0) > 0 ? String(config.packs[pack]) : bid;
        const text = fromId === bid ? fromBundle[name] : fromPack[pack]?.[name];
        if (typeof text !== 'string' || shaHex(text) !== RELEASE.partSha[name]) bad.push(`${name} (from #${fromId})`);
        source[fromId] = (source[fromId] || 0) + 1;
      }
      if (bad.length) throw new Error(`These parts do not resolve to the pinned ${VERSION} source: ${bad.join(', ')}.`);
      // Boot it.
      let boot = 'boot check skipped (this host has no browser)';
      if (host.bootParent) {
        const want = worldIds();
        const info = await host.bootParent(chainText[id], { network, core: state.core, apiBase: network === 'mainnet' ? 'https://api.mainnet.hiro.so' : 'https://api.testnet.hiro.so' });
        if (info.errors.length) throw new Error(`The parent booted with errors: ${info.errors.slice(0, 3).join(' | ')}`);
        if (JSON.stringify(info.worldConfig) !== JSON.stringify(want)) throw new Error(`The booted hall got XA_WORLD_CONFIG ${JSON.stringify(info.worldConfig)}, expected ${JSON.stringify(want)}.`);
        if (info.mode !== 2 || !info.enabled || info.registry !== want.registry || info.posters !== want.posters) throw new Error(`The hall's world reader is not on the registry (mode ${info.mode}, enabled ${info.enabled}, registry ${info.registry}).`);
        if (info.screen !== want.screen) throw new Error(`The hall's screen reads ${info.screen || 'nothing'}, expected ${want.screen}.`);
        if (JSON.stringify(info.gamesConfig) !== JSON.stringify(gamesIds())) throw new Error(`The booted hall got XA_GAMES_CONFIG ${JSON.stringify(info.gamesConfig)}, expected ${JSON.stringify(gamesIds())}.`);
        if (!info.games || info.games.ok !== true) throw new Error(`The hall could not read the games contract: ${(info.games && info.games.error) || 'no reader'}.`);
        boot = `booted in a hidden frame: world reader on (mode 2) with posters ${short(want.posters)}, registry ${short(want.registry)}, screen ${short(want.screen)}, games ${short(gamesIds().contract)} (read ok: ${info.games.count} added so far, ${info.games.loaded.length} loaded)${network === 'testnet' ? ' (testnet: run with its mainnet reads pointed at the testnet core and API, see the README)' : ''}`;
      }
      let served = 'site check skipped (testnet)';
      if (network === 'mainnet') {
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
      return `${notes.join(' · ')} · parent child of ${parentList()}, depends on ${deps.map((x) => '#' + x).join(', ')} · all ${PART_NAMES.length} parts resolve (${where}) · ${boot} · ${served}`;
    }
  },
  // ---- the leaderboard: the v1 launch canary's steps, unchanged but for the root wallet check ----
  {
    id: 'board', title: 'Open a canary board bound to the parent', who: 'Web wallet · 1 signature',
    intro: `Registers "${CANARY_BOARD}" (higher wins, no fee) with the parent inscription as its engine id. It is closed again before the production boards move.`,
    action: 'Open canary board',
    run: async () => {
      requireRoot();
      const id = state.inscriptionId!;
      if (await canaryDone()) return `canary board "${CANARY_BOARD}" is already closed on parent #${id}: this step ran in an earlier session (nothing sent)`;
      const want = () => readBoard(CANARY_BOARD);
      const ok = (b: Awaited<ReturnType<typeof want>>) => !!b && b.enabled === 'true' && b.engineId === id;
      if (!ok(await want())) {
        await runTx('board', `set-board ${CANARY_BOARD} → #${id}`, () => rootCall(scoresId(), 'set-board',
          [stringAsciiCV(CANARY_BOARD), uintCV(0), uintCV(CANARY_MAX), uintCV(0), uintCV(BigInt(id)), boolCV(false), boolCV(true)]));
      }
      await eventually('Canary board', async () => { const b = await want(); return ok(b) ? null : `board ${b ? `engine ${b.engineId}, enabled ${b.enabled}` : 'missing'}`; });
      return `board "${CANARY_BOARD}" open · engine inscription #${id} · fee 0`;
    }
  },
  {
    id: 'submit', title: 'Submit a real arcade run', who: 'Web wallet · 1 signature',
    intro: `Submits the ${PROOF_GAME} run the ${VERSION} arcade flew for your wallet (skipped when your entry from an earlier launch is already as good). Then reads the board and the stored replay back, checks the on-chain hash, and re-plays the chain's bytes in the ${VERSION} arcade.`,
    action: 'Submit run',
    run: async () => {
      const me = requireRoot().address;
      const run = state.run!;
      const bytes = unb64(run.replay);
      if (await canaryDone()) return `the canary board is already closed on parent #${state.inscriptionId}: the run was submitted and checked in an earlier session (nothing sent)`;
      const mine = (await topEntries(CANARY_BOARD)).find((e) => e.player === me);
      const earlier = !!mine && mine.score >= BigInt(run.score);
      if (!earlier) {
        await runTx('submit', `submit-score ${run.score.toLocaleString()}`, () => rootCall(scoresId(), 'submit-score',
          [stringAsciiCV(CANARY_BOARD), uintCV(0), uintCV(run.score), stringAsciiCV('CANARY'), bufferCV(bytes)]));
      }
      await eventually('Board entry', async () => {
        const e = (await topEntries(CANARY_BOARD)).find((x) => x.player === me);
        return e && e.score >= BigInt(run.score) ? null : e ? `score ${e.score}` : 'no entry';
      });
      const chainBytes = bufOf(await readScores('get-replay', [stringAsciiCV(CANARY_BOARD), uintCV(0), principalCV(me)]));
      const entry = (await topEntries(CANARY_BOARD)).find((x) => x.player === me)!;
      if (toHex(sha256(chainBytes)) !== entry.hash) throw new Error('Stored replay does not hash to the recorded replay hash.');
      const v: any = await withArcade<any>((win) => win.XA.replay.verify(new Uint8Array(chainBytes), { address: pilotAddress(me), score: Number(entry.score) }));
      if (!v.ok) throw new Error(`The replay stored on chain did not verify in the ${VERSION} arcade: ${v.reason}.`);
      return `${earlier ? 'your entry from an earlier launch stands (nothing sent) · ' : ''}${run.game} score ${entry.score.toLocaleString()} · ${chainBytes.length}-byte replay stored, hash matches, re-played from chain bytes in ${VERSION}: Verified`;
    }
  },
  {
    id: 'fund', title: 'Fund a copycat wallet', who: 'Web wallet · 1 signature',
    intro: `Your wallet sends the canary's temporary wallet ${stx(FUND_AMOUNT)} so it can pay the fee to try stealing your run. If your wallet cannot sign a plain transfer from a web page, the step shows the address and waits for you to send the amount by hand. The rest is swept back.`,
    action: 'Send test funds',
    run: async () => {
      requireRoot();
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
      const stored = bufOf(await readScores('get-replay', [stringAsciiCV(CANARY_BOARD), uintCV(0), principalCV(rootAddr())]));
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
    intro: 'Returns what is left in the temporary wallet to the root wallet.',
    action: 'Sweep back',
    run: async () => `copycat balance now ${stx(await sweepHot('sweep'))}`
  },
  {
    id: 'close', title: 'Close the canary board', who: 'Web wallet · 1 signature',
    intro: 'Disables the canary board so nothing more can be submitted to it. The production boards move only after this passes.',
    action: 'Close board',
    run: async () => {
      requireRoot();
      const b = await readBoard(CANARY_BOARD);
      if (b && b.enabled === 'true') await runTx('close', `disable ${CANARY_BOARD}`, () => rootCall(scoresId(), 'set-board-enabled', [stringAsciiCV(CANARY_BOARD), boolCV(false)]));
      await eventually('Close', async () => { const x = await readBoard(CANARY_BOARD); return x && x.enabled === 'false' ? null : `enabled ${x?.enabled}`; });
      return `canary board closed · the ${VERSION} release and leaderboard are proven`;
    }
  },
  {
    id: 'boardwallet', title: 'Create and fund the board-signing wallet', who: 'Web wallet · 1 signature',
    intro: `Only the leaderboard owner can register boards. The canary's temporary wallet signs all ${PRODUCTION.length} updates instead of ${PRODUCTION.length} wallet prompts: this step saves its key to a file, then your wallet sends it enough for the fees (about ${stx(boardFloat(PRODUCTION.length))}; unspent funds are swept back). Boards that already match are not counted; if none need updating, nothing is sent.`,
    action: 'Create and fund the wallet',
    run: async () => {
      const me = requireRoot().address, hot = hotAddress();
      const { todo, owner, pending } = await boardPlan();
      if (owner !== me && owner !== hot) throw new Error(`The leaderboard is owned by ${owner}, which is neither the root wallet nor the temporary wallet ${hot}. Nothing was sent.`);
      if (!todo.length && owner === me) return `all ${PRODUCTION.length} boards already match: no board-signing wallet needed, nothing sent · temporary wallet ${hot} holds ${stx(await chain.balance(hot))}`;
      const target = owner === me ? boardFloat(todo.length) : boardFloat(todo.length, { propose: pending !== me, accept: false });
      if (owner === me && pending !== hot) {
        host.saveFile(`xtrata-arcade-v2-temp-wallet-${hot.slice(0, 8)}.json`, hotKeyFile('leaderboard owner for the board updates'));
        if (!(await host.confirm(`${todo.length} boards need updating.\n\nThe temporary wallet ${hot} will sign them. Its key has just been saved to a file: keep it until the canary says ownership is back with your wallet.\n\nNext your wallet sends it about ${stx(target)} for network fees (what is unspent is swept back). Continue?`))) throw new Error('Cancelled before anything was sent.');
      }
      const have = await ensureHotFunds('production', target, 'board-signing wallet');
      return `temporary wallet ${hot} funded: it holds ${stx(have)} for ${todo.length} board update${todo.length === 1 ? '' : 's'}`;
    }
  },
  {
    id: 'handover', title: 'Make the temporary wallet the leaderboard owner', who: 'Web wallet · 1 signature',
    intro: 'Your wallet proposes the temporary wallet as the leaderboard\'s owner (`propose-owner`) and the temporary wallet accepts (`accept-owner`, signed in this page). It stays the owner only for the next step; the one after hands ownership back. If anything stops in between, "Return leaderboard ownership to my wallet" below finishes the hand-back.',
    action: 'Hand over ownership',
    run: async () => {
      const me = requireRoot().address, hot = hotAddress();
      const { todo, owner, pending } = await boardPlan();
      if (owner !== me && owner !== hot) throw new Error(`The leaderboard is owned by ${owner}, which is neither the root wallet nor the temporary wallet. Nothing was sent.`);
      if (!todo.length && owner === me) return 'no boards need updating: ownership stays with your wallet, nothing sent';
      if (owner === hot) return `the temporary wallet ${short(hot)} already owns the leaderboard (nothing sent)`;
      if ((await chain.balance(hot)) < boardFloat(todo.length, { propose: true, accept: true }) - 40_000n) throw new Error('The temporary wallet is not funded yet. Run the previous step first.');
      if (pending !== hot) {
        await runTx('production', uniq('production', `make ${short(hot)} the leaderboard owner (propose)`), () => rootCall(scoresId(), 'propose-owner', [principalCV(hot)]));
        await eventually('Pending owner', async () => ((await pendingOwnerOf()) === hot ? null : 'not proposed yet'));
      }
      await hotCall('production', 'temporary wallet accepts ownership', scoresId(), 'accept-owner', []);
      await eventually('Owner', async () => ((await ownerOf()) === hot ? null : 'not accepted yet'));
      return `the temporary wallet ${short(hot)} now owns the leaderboard (handed back in the step after next) · ${todo.length} boards to update`;
    }
  },
  {
    id: 'production', title: `Point the ${PRODUCTION.length} production boards at the parent`, who: 'Temporary wallet (signed in this page)',
    intro: `The temporary wallet signs \`set-board\` for every arcade board: the parent as engine id, no entry fee, enabled, one after another, each confirmed before the next. The contract keeps each board's Top 10 and stored replays when its engine id changes. Boards that already match are skipped, so a reload or an error resumes where it stopped.`,
    action: 'Update boards automatically',
    run: async () => {
      const id = state.inscriptionId!, hot = hotAddress();
      const { todo, owner } = await boardPlan();
      if (!todo.length) return `${PRODUCTION.length} boards already on engine inscription #${id} · nothing sent`;
      if (owner !== hot) throw new Error('The temporary wallet does not own the leaderboard yet. Run the two previous steps first.');
      let updated = 0;
      try {
        for (const b of todo) {
          status(`Pointing ${b.id} at #${id} (${updated + 1} of ${todo.length})…`);
          await hotCall('production', `set-board ${b.id} → #${id}`, scoresId(), 'set-board',
            [stringAsciiCV(b.id), uintCV(b.mode), uintCV(b.max), uintCV(0), uintCV(BigInt(id)), boolCV(false), boolCV(true)]);
          await eventually(b.id, async () => (boardMatches(await readBoard(b.id), b) ? null : 'not set yet'));
          updated++;
        }
      } catch (error) {
        let held = false;
        try { held = (await ownerOf()) === hot; } catch { /* ignore */ }
        if (held) throw new Error(`${errText(error)} — The leaderboard is owned by the temporary wallet ${hot} until it is handed back. Press this step's button again to continue, or "Return leaderboard ownership to my wallet" to give it back now. Its key was saved to a file (and stays in this browser).`);
        throw error;
      }
      return `${PRODUCTION.length} boards on engine inscription #${id} · ${updated} updated automatically by the temporary wallet`;
    }
  },
  {
    id: 'handback', title: 'Hand leaderboard ownership back and sweep', who: 'Web wallet · 1 signature',
    intro: 'The temporary wallet proposes your wallet as owner again and your wallet accepts. Then anything left in the temporary wallet is swept back. It also clears a hand-over that was proposed but never accepted.',
    action: 'Hand back and sweep',
    run: async () => {
      const me = requireRoot().address, hot = hotAddress();
      const moved = await handBack();
      if ((await ownerOf()) !== me) throw new Error(`The leaderboard is owned by ${await ownerOf()}, not the root wallet.`);
      if ((await pendingOwnerOf()) === hot) {
        await runTx('production', uniq('production', 'cancel the pending hand-over'), () => rootCall(scoresId(), 'propose-owner', [principalCV(me)]));
        await eventually('Pending owner', async () => ((await pendingOwnerOf()) === hot ? 'still the temporary wallet' : null));
      }
      for (const b of PRODUCTION) if (!boardMatches(await readBoard(b.id), b)) throw new Error(`Board ${b.id} does not match the parent yet. Run the board step again before finishing.`);
      const left = await sweepHot('production');
      return `${moved ? 'ownership handed back to your wallet' : 'your wallet already owns the leaderboard (nothing to hand back, nothing sent)'} · all ${PRODUCTION.length} boards match · temporary wallet holds ${stx(left)}`;
    }
  },
  {
    id: 'ownership', title: 'Final ownership check', who: 'Reads only',
    intro: 'Reads who holds every role: the registry\'s root owner, pending owner and treasury; that no address is left as a registry admin (the temporary wallet, and every address an admin-set event ever named); the screen\'s admin and fee recipient; the posters admin and publishers; the leaderboard owner. Prints the explorer links.',
    action: 'Check ownership',
    run: async () => {
      const me = rootAddr(), hot = hotAddress();
      const bad: string[] = [];
      const root = await worldRoot();
      if (root.owner !== me) bad.push(`registry root owner is ${root.owner}`);
      if (root.pending) bad.push(`registry has a pending root owner ${root.pending}`);
      if (root.treasury !== NET().treasury) bad.push(`registry treasury is ${root.treasury}, configured ${NET().treasury}`);
      if (root.paused) bad.push('registry is paused');
      // admins: the map cannot be listed, so check every address an admin-set event named, plus the ones this canary used
      const named = new Set<string>([hot, me, NET().treasury]);
      let scan = 'admin-set events scanned';
      try { for (const who of await adminEvents(cid(NAMES.world))) named.add(who); } catch (error) { scan = `admin-set events could not be scanned (${errText(error)}); checked the known addresses only`; }
      const admins: string[] = [];
      for (const who of named) { const caps = await worldAdmin(who); if (caps) admins.push(`${who} (caps ${caps})`); }
      if (admins.length) bad.push(`registry admins left: ${admins.join(', ')}`);
      const sc = await sread('get-config');
      const sAdmin = await sread('get-admin');
      if (sAdmin !== me) bad.push(`screen admin is ${sAdmin}`);
      if (sc['pending-admin']) bad.push(`screen has a pending admin ${sc['pending-admin']}`);
      if (sc['fee-recipient'] !== NET().screenFeeRecipient) bad.push(`screen fee recipient is ${sc['fee-recipient']}`);
      const gc = await gread('get-config');
      if (gc.admin !== me) bad.push(`games admin is ${gc.admin}`);
      if (Number(gc.delay) !== NET().gamesDelay) bad.push(`games delay is ${gc.delay}, configured ${NET().gamesDelay}`);
      if (NET().lockGamesDelay && !gc['delay-locked']) bad.push('the games delay is not locked');
      if (gc.paused) bad.push('the games contract is paused');
      if (await gread('get-successor').then((x: any) => x && x.successor)) bad.push('the games contract has a successor set');
      const pc = await pread('get-config');
      if (pc.admin !== me) bad.push(`posters admin is ${pc.admin}`);
      if (pc['pending-admin']) bad.push(`posters has a pending admin ${pc['pending-admin']}`);
      for (const who of NET().posterPublishers as string[]) if (!(await pread('is-publisher', [principalCV(who)]))) bad.push(`${who} is not a poster publisher`);
      if (await pread('is-publisher', [principalCV(hot)])) bad.push('the temporary wallet is a poster publisher');
      const owner = await ownerOf(), pending = await pendingOwnerOf();
      if (owner !== me) bad.push(`leaderboard owner is ${owner}`);
      if (pending) bad.push(`leaderboard has a pending owner ${pending}`);
      if (bad.length) throw new Error(bad.join(' · '));
      const links = [...NEW_CONTRACTS, NAMES.scores].map((n) => `${n}: ${chain.contractUrl(cid(n))}`).join(' · ');
      return `registry root owner and treasury ${short(me)}, no pending owner, no admins (${named.size} addresses checked; ${scan}) · screen admin ${short(me)}, fee recipient ${short(NET().screenFeeRecipient)} · posters admin ${short(me)}, ${(NET().posterPublishers as string[]).length} publisher(s) as configured · leaderboard owner ${short(me)} · ${links}`;
    }
  },
  {
    id: 'audit', title: 'Final audit', who: 'Reads only',
    intro: 'Re-reads every contract, inscription and board one last time and lists what to change in the repo and on the site.',
    action: 'Run audit',
    run: async () => {
      const id = state.inscriptionId!;
      for (const n of [...NEW_CONTRACTS, NAMES.scores]) if ((await presence(cid(n), contractSrc(n))) !== 'ours') throw new Error(`${cid(n)} no longer holds the pinned source.`);
      const bad: string[] = [];
      for (const b of PRODUCTION) if (!boardMatches(await readBoard(b.id), b)) bad.push(b.id);
      if (bad.length) throw new Error(`Boards not matching: ${bad.join(', ')}`);
      for (const f of [...PACKS, parentUpload()]) {
        const fid = f.key === 'parent' ? id : state.packIds![f.key];
        const meta = await inscriptionMeta(fid);
        if (!meta || !meta.sealed || meta.hash !== toHex(f.hash)) throw new Error(`${f.label} #${fid} no longer matches.`);
      }
      const r = await registryStatus();
      if (r.todo.length || r.problems.length) throw new Error(`The registry no longer matches the launch plan: ${r.todo.length} call(s) missing${r.problems.length ? `; ${r.problems.join('; ')}` : ''}.`);
      const vm = await V2.verifyManifest(r.m, planRead);
      if (!vm.ok) throw new Error(`verifyManifest stopped at ${vm.what}.`);
      const packIds = RELEASE.inscribe.map((n) => `"${n}": ${state.packIds![n]}`).join(', ');
      const w = worldIds();
      return `contracts, ${PACKS.length + 1} inscriptions, the registry (arcade #${r.m.spaces.arcade}, hall #${r.m.spaces.hall}, verifyManifest ${vm.checked} items) and all ${PRODUCTION.length} boards re-read and match · Next, in one commit: recursive-apps/xtrata-arcade/parent/ids.json: packs {${packIds}} and "world": {"posters": "${w.posters}", "registry": "${w.registry}", "screen": "${w.screen}"} and "games": {"contract": "${gamesIds().contract}"}; public/_redirects: /arcade → /i/${id}; the homepage arcade tile → #${id}; src/arcade-submit/arcade-boards.ts: add ${id} to ARCADE_INSCRIPTION_IDS. Then open https://xtrata.xyz/x/${id} and play one run.`;
    }
  },
  {
    id: 'boards26', testnetOnly: true, title: `Register all ${PRODUCTION.length} arcade boards on the leaderboard (testnet)`, who: `Web wallet · up to ${PRODUCTION.length} signatures (none for boards already set)`,
    intro: `Testnet only. On mainnet the ${PRODUCTION.length} boards are moved by a temporary wallet (the production step) so you are not prompted ${PRODUCTION.length} times; on testnet the root key signs each \`set-board\` itself: the parent as engine id, no entry fee, enabled, one after another, each confirmed before the next. Boards that already match are skipped. This gives the testnet leaderboard the same boards the mainnet one will have.`,
    action: 'Register the boards',
    run: async () => {
      const w = requireRoot(), id = state.inscriptionId;
      if (!id) throw new Error('The parent is not inscribed yet: run the parent step first (the boards name it as their engine).');
      const { todo, owner } = await boardPlan();
      if (!todo.length) return `${PRODUCTION.length} boards already on engine inscription #${id} · nothing sent`;
      if (owner !== w.address) throw new Error(`The leaderboard is owned by ${owner}, not the root wallet.`);
      let n = 0;
      for (const b of todo) {
        status(`Registering ${b.id} (${n + 1} of ${todo.length})…`);
        await runTx('boards26', `set-board ${b.id} → #${id}`, () => rootCall(scoresId(), 'set-board',
          [stringAsciiCV(b.id), uintCV(b.mode), uintCV(b.max), uintCV(0), uintCV(BigInt(id)), boolCV(false), boolCV(true)]));
        await eventually(b.id, async () => (boardMatches(await readBoard(b.id), b) ? null : 'not set yet'));
        n++;
      }
      return `${PRODUCTION.length} boards on engine inscription #${id} · ${n} registered by the root key`;
    }
  },
  {
    id: 'testgames', testnetOnly: true, title: `Add the ${LAUNCH.testGames.length} test games to the games contract`, who: `Web wallet · ${LAUNCH.testGames.length * 3} signatures (fewer for what is already done)`,
    intro: `Testnet only, for watching how the hall reacts to new games. For each of ${LAUNCH.testGames.map((g) => `"${g.title}" (${g.id})`).join(' and ')}: inscribes its cartridge script (re-used when the same bytes are already inscribed), registers its score board on the leaderboard (the parent as engine id; ${LAUNCH.testGames.map((g) => `${g.id} ${g.mode ? 'lowest wins' : 'highest wins'}`).join(', ')}), then calls add-game on the games contract. Each is skipped when it is already done, so a re-run resumes. The game goes live after the contract's delay (${NET().gamesDelay} blocks on testnet); the hall then shows it without any change to the hall.`,
    action: 'Add the test games',
    run: async () => {
      const w = requireRoot(), parent = state.inscriptionId;
      if (!parent) throw new Error('The parent is not inscribed yet: run the parent step first (the boards name it as their engine).');
      if ((await ownerOf()) !== w.address) throw new Error(`The leaderboard is owned by ${await ownerOf()}, not the root wallet. Hand it back first (the handback step), then run this.`);
      const ga = await gread('get-admin');
      if (ga !== w.address) throw new Error(`${NAMES.games} admin is ${ga}, not the root wallet.`);
      const lines: string[] = [];
      for (const g of LAUNCH.testGames) {
        const up = makeUpload(`game-${g.id}`, g.title, 'text/plain', g.source);
        const ins = await inscribe('testgames', up, [], []);
        const id = BigInt(ins.id);
        const wantBoard = (b: Awaited<ReturnType<typeof readBoard>>) => !!b && b.enabled === 'true' && b.engineId === String(parent) && b.mode === String(g.mode);
        if (!wantBoard(await readBoard(g.id))) {
          await runTx('testgames', `set-board ${g.id} → #${parent}`, () => rootCall(scoresId(), 'set-board',
            [stringAsciiCV(g.id), uintCV(g.mode), uintCV(g.max), uintCV(0), uintCV(BigInt(parent)), boolCV(false), boolCV(true)]));
          await eventually(`${g.id} board`, async () => (wantBoard(await readBoard(g.id)) ? null : 'board not set yet'));
        }
        let n = await gread('get-game-number', [stringAsciiCV(g.id)]);
        if (n === null) {
          await runTx('testgames', `add-game ${g.id}`, () => rootCall(cid(NAMES.games), 'add-game',
            [stringAsciiCV(g.id), stringAsciiCV(g.title), uintCV(id), bufferCV(up.hash), uintCV(up.bytes.length), uintCV(1), uintCV(1)]));
          n = await eventually(`${g.id} on the games contract`, async () => ((await gread('get-game-number', [stringAsciiCV(g.id)])) === null ? 'not listed yet' : null)).then(() => gread('get-game-number', [stringAsciiCV(g.id)]));
        }
        const rec: any = await gread('get-game', [uintCV(BigInt(String(n).replace(/^u/, '')))]);
        if (!rec || String(rec['code-id']).replace(/^u/, '') !== id.toString() || String(rec['code-hash']).replace(/^0x/, '') !== toHex(up.hash)) {
          throw new Error(`${g.id} is on the games contract with a different cartridge than ${ins.note}; use a new id for a changed game.`);
        }
        lines.push(`${g.id}: game ${String(n).replace(/^u/, '')}, replay number ${String(rec.index).replace(/^u/, '')}, cartridge #${id}, live at burn block ${String(rec['live-at']).replace(/^u/, '')}`);
      }
      const h = await gread('get-height');
      return `${lines.join(' · ')} · burn height now ${String(h).replace(/^u/, '')}: a game shows in the hall once its live-at block has passed (delay ${NET().gamesDelay} blocks); reload the hall then`;
    }
  }
];
export const steps = () => STEPS.filter((s) => !s.testnetOnly || network === 'testnet');
/**
 * Steps only the page can run: the run proof (flying and re-playing a run needs the embedded arcade) and everything gated on it
 * (the production boards move only after the canary board has proven the release), and the audit, which checks the boards.
 */
export const BROWSER_ONLY = new Set(['board', 'submit', 'fund', 'copy', 'sweep', 'close', 'boardwallet', 'handover', 'production', 'handback', 'audit']);

/** Every address an `admin-set` print event of `contractId` named (Hiro's contract events, newest first, at most 20 pages). */
const adminEvents = async (contractId: string) => {
  const out = new Set<string>();
  for (let offset = 0, page = 0; page < 20; page++, offset += 50) {
    const { status: st, body } = await chain.json(`/extended/v1/contract/${contractId}/events?limit=50&offset=${offset}`);
    if (st !== 200 || !Array.isArray(body?.results)) throw new Error(`HTTP ${st}`);
    for (const e of body.results) {
      const hex = e?.contract_log?.value?.hex;
      if (!hex) continue;
      try { const v = plain(hexToCV(hex)); if (v && v.event === 'admin-set' && typeof v.who === 'string') out.add(v.who); } catch { /* not ours */ }
    }
    if (body.results.length < 50) break;
  }
  return [...out];
};

/** The run's report (Export report button). */
export const report = () => ({
  ...state, run: state.run ? { game: state.run.game, score: state.run.score, bytes: unb64(state.run.replay).length } : null,
  arcadeVersion: VERSION, releaseSha256: RELEASE_SHA, network, root: rootAddr(), world: worldIds(), contractSha256: LAUNCH.contractSha[network],
  packs: Object.fromEntries(PACKS.map((f) => [f.key, { id: state.packIds?.[f.key] ?? null, bytes: f.bytes.length, chunks: f.chunks.length, sha256: f.sha, chainHash: toHex(f.hash) }])),
  parent: (() => { try { const f = parentUpload(); return { id: state.inscriptionId ?? null, bytes: f.bytes.length, sha256: f.sha, chainHash: toHex(f.hash), dependencies: parentDeps().map(String) }; } catch { return null; } })(),
  temporaryWallet: hotAddress()
});
