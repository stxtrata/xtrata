// Forever Twins launch canary. Ships one collection's helper in the only safe order, from a web wallet
// (Xverse or Leather): deploy -> verify -> seed the canonical record -> audit it -> finalise (one-way, gated)
// -> one test inscription -> hand-off for the sponsor script and the registry. Mainnet only.
// Every transaction is signed in the wallet, with ONE exception: seeding. Only the owner can seed and the owner would have to
// approve every batch by hand, so the page uses a temporary wallet it creates in this browser: the Xtrata wallet proposes it as
// owner, it accepts, seeds every batch by itself, then proposes the Xtrata wallet back and the Xtrata wallet accepts. The
// one-way finalise, the test inscription and everything else stay with the Xtrata wallet. Each step re-reads the chain.
import { sha256 } from '@noble/hashes/sha256';
import {
  AnchorMode, bufferCV, ClarityType, cvToString, FungibleConditionCode, getAddressFromPrivateKey, listCV, makeContractCall, makeRandomPrivKey,
  makeSTXTokenTransfer, makeStandardSTXPostCondition, makeUnsignedContractCall, makeUnsignedSTXTokenTransfer, PostConditionMode, principalCV,
  privateKeyToString, standardPrincipalCV, stringAsciiCV, TransactionVersion, tupleCV, uintCV, type ClarityValue, type PostCondition
} from '@stacks/transactions';
import { Chain, toHex } from '../collection-v17/chain';
import * as wallet from '../collection-v17/wallet';
import type { ProviderInfo } from '../collection-v17/wallet';

declare const __BUILD__: string;
declare const __CFG__: string;
declare const __HELPER__: string;
declare const __MANIFEST__: string;
declare const __PINS__: string;

type Cfg = {
  key: string; name: string; master: string; source: string; group: string; payees: [string, string];
  initialFeeUstx: number; maxFeeUstx: number; deployer: string; contractName: string; gateway: string; manifestPath: string;
  listingReadFn?: string; testToken?: number; largeOnDemand?: boolean; sourceOwnerRead?: string; heldIdsReadFn?: string;
};
type Tok = { id: number; original: { mediaUris: string[]; metadataUri?: string }; twin: { contentHash: string; sha256: string; mime: string; totalSize: number; tokenUri: string; route?: string } };
const CFG: Cfg = JSON.parse(__CFG__);
const PINS: { helperSha: string; manifestSha: string } = JSON.parse(__PINS__);
const MANIFEST = JSON.parse(__MANIFEST__) as { count: number; tokens: Tok[] };
const NET = 'mainnet' as const;
const MAX_SINGLE_TX = 524288;

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
const shaText = (text: string) => toHex(sha256(enc(text)));
const shaBytes = (bytes: Uint8Array) => toHex(sha256(bytes));
const hexBytes = (hex: string) => Uint8Array.from(hex.replace(/^0x/, '').match(/../g)!.map((h) => parseInt(h, 16)));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const bare = (hex: string) => hex.replace(/^0x/, '').toLowerCase();

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
    default: return cvToString(v);
  }
};
const asBig = (cv: ClarityValue) => BigInt(asText(cv));
const field = (cv: ClarityValue, key: string) => (inner(cv) as any).data[key] as ClarityValue;
const isNone = (cv: ClarityValue) => (cv as any).type === ClarityType.OptionalNone;

// ---------- state ----------
type TxRec = { label: string; txid: string; status: string; result?: string; pass?: boolean; block?: number };
type StepState = { status: 'todo' | 'running' | 'pass' | 'fail'; note?: string; data: Record<string, any>; txs: TxRec[] };
type State = { version: 1; contractName: string; seedBatch: number; testToken: number; gateway: string; deployer?: string; steps: Record<string, StepState>; log: { t: string; level: string; msg: string; txid?: string }[] };

const chain = new Chain(NET);
let state!: State;
let connected: { address: string; publicKey: string | null; label: string } | null = null;
let busy = false;

const stateKey = () => `xtrata-ft-launch:v1:${CFG.key}`;
const freshState = (): State => ({ version: 1, contractName: CFG.contractName, seedBatch: 100, testToken: CFG.testToken ?? (MANIFEST.tokens.find((t) => t.twin.route !== 'preinscribed' && t.twin.totalSize <= MAX_SINGLE_TX) ?? MANIFEST.tokens[0]).id, gateway: CFG.gateway, steps: {}, log: [] });
const load = () => { try { const raw = localStorage.getItem(stateKey()); state = raw ? { ...freshState(), ...JSON.parse(raw) } : freshState(); } catch { state = freshState(); } };
const save = () => { try { localStorage.setItem(stateKey(), JSON.stringify(state)); } catch { /* storage unavailable */ } };
const step = (id: string): StepState => (state.steps[id] ??= { status: 'todo', data: {}, txs: [] });
const helperId = () => `${CFG.deployer}.${state.contractName}`;
const tokens = MANIFEST.tokens;
const tokenById = (id: number) => tokens.find((t) => t.id === id);

const log = (level: 'info' | 'ok' | 'warn' | 'error', msg: string, txid?: string) => {
  const line = el('div', { class: `log-line ${level}` }, el('time', {}, new Date().toLocaleTimeString()), ' ', msg,
    txid ? [' ', el('a', { href: chain.txUrl(txid), target: '_blank', rel: 'noopener' }, short(txid))] : null);
  $('#log').prepend(line);
  state.log.unshift({ t: new Date().toISOString(), level, msg, txid });
  state.log = state.log.slice(0, 500);
  save();
  (level === 'error' ? console.warn : console.info)('[ft-launch]', msg, txid ?? '');
};
const status = (text: string, tone: 'info' | 'ok' | 'warn' | 'error' = 'info') => { const s = $('#status'); s.textContent = text; s.dataset.tone = tone; };

// ---------- web-wallet actions ----------
const requireWallet = () => {
  if (!connected) throw new Error('Connect your wallet first (step 1).');
  if (connected.address !== CFG.deployer) throw new Error(`The wallet is connected as ${connected.address}; this launch must be signed by ${CFG.deployer}.`);
  return connected;
};
const progress = (stage: string) => { if (['account-read', 'account-reconnect', 'signing-request'].includes(stage)) log('info', `wallet: ${stage.replace('-', ' ')}`); };
const settle = async (result: wallet.TxResult) => {
  if (result.txRaw && result.txRaw.length > 128) { try { await chain.broadcastRaw(result.txRaw); } catch { /* already known */ } }
  return result.txId;
};
const unsignedCall = async (fn: string, args: ClarityValue[], pcs: PostCondition[], mode: PostConditionMode) => {
  const w = requireWallet();
  const [address, name] = helperId().split('.');
  const nonce = await chain.nonce(w.address);
  const build = (fee: bigint) => makeUnsignedContractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
    publicKey: w.publicKey!, network: chain.stacks, nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: mode, postConditions: pcs });
  const size = (await build(20_000n)).serialize().length;
  return toHex((await build(BigInt(Math.max(20_000, Math.ceil(size * 1.5))))).serialize());
};
const walletCall = async (fn: string, args: ClarityValue[], pcs: PostCondition[] = [], mode: PostConditionMode = PostConditionMode.Deny) => {
  const w = requireWallet();
  const [address, name] = helperId().split('.');
  const result = await wallet.contractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
    postConditions: pcs, postConditionMode: mode, network: NET, stxAddress: w.address, onProgress: progress,
    buildUnsigned: w.publicKey ? () => unsignedCall(fn, args, pcs, mode) : undefined });
  return settle(result);
};

/** Sends once, remembers the txid, and on reload resumes waiting instead of re-sending. */
const runTx = async (stepId: string, label: string, send: () => Promise<string>) => {
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
  rec.pass = tx.tx_status === 'success' && (!rec.result || rec.result.startsWith('(ok'));
  save();
  if (!rec.pass) {
    log('error', `${label}: ${tx.tx_status} ${rec.result}`, rec.txid);
    s.txs = s.txs.filter((t) => t !== rec); save();
    throw new Error(`${label} failed on chain: ${tx.tx_status} ${rec.result}`);
  }
  log('ok', `${label}: confirmed ${rec.result}`, rec.txid);
  return { ...rec, tx };
};

// ---------- reads ----------
/** A confirmed tx can be indexed before the read node has it: re-read until the expected state appears (up to ~90s). */
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
const read = (fn: string, args: ClarityValue[] = [], sender?: string) => chain.read(helperId(), fn, args, sender);
const coreRead = (fn: string, args: ClarityValue[] = []) => chain.read(CFG.master, fn, args);
const iface = async () => { const v = await read('get-twin-interface'); return (k: string) => asText(field(v, k)); };
const canonRead = async (id: number) => {
  const v = await read('get-canonical', [uintCV(id)]);
  if (isNone(v)) return null;
  return { hash: asText(field(v, 'content-hash')), mime: asText(field(v, 'mime')), size: asText(field(v, 'total-size')), uri: asText(field(v, 'token-uri')) };
};
const canonDiff = (t: Tok, c: Awaited<ReturnType<typeof canonRead>>) => {
  if (!c) return ['missing'];
  const d: string[] = [];
  if (bare(c.hash) !== bare(t.twin.contentHash)) d.push('content-hash');
  if (c.mime !== t.twin.mime) d.push('mime');
  if (c.size !== String(t.twin.totalSize)) d.push('total-size');
  if (c.uri !== t.twin.tokenUri) d.push('token-uri');
  return d;
};
const pool = async <T,>(items: T[], size: number, fn: (item: T, index: number) => Promise<void>) => {
  let next = 0;
  await Promise.all(Array.from({ length: size }, async () => { while (next < items.length) { const i = next++; await fn(items[i], i); } }));
};
const entryCV = (t: Tok) => tupleCV({ id: uintCV(t.id), 'content-hash': bufferCV(hexBytes(t.twin.contentHash)), mime: stringAsciiCV(t.twin.mime), 'total-size': uintCV(t.twin.totalSize), 'token-uri': stringAsciiCV(t.twin.tokenUri) });
const batches = () => { const out: Tok[][] = []; for (let i = 0; i < tokens.length; i += state.seedBatch) out.push(tokens.slice(i, i + state.seedBatch)); return out; };

// rolling hash + chunking, identical to the Xtrata core (h0 = 32 zero bytes; h = sha256(h || chunk) per 16,384-byte chunk)
const CHUNK = 16384;
const chunkBytes = (bytes: Uint8Array) => { const out: Uint8Array[] = []; for (let i = 0; i < bytes.length; i += CHUNK) out.push(bytes.slice(i, i + CHUNK)); return out; };
const rolling = (chunks: Uint8Array[]) => { let h: Uint8Array = new Uint8Array(32); for (const c of chunks) { const b = new Uint8Array(h.length + c.length); b.set(h); b.set(c, h.length); h = sha256(b); } return toHex(h); };
const gatewayUrl = (uri: string) => uri.startsWith('ipfs://') ? `${state.gateway.replace(/\/$/, '')}/ipfs/${uri.slice(7)}` : uri;

// ---------- the temporary wallet: signs the seed batches ----------
const TEMP_TX_FEE = 20_000n;
const SWEEP_TX_FEE = 5_000n;
const hotKeyName = () => `xtrata-ft-launch:hot:${CFG.key}`;
const hotExists = () => { try { return !!localStorage.getItem(hotKeyName()); } catch { return false; } };
/** The temporary wallet's key lives in this browser (and in a file saved before it is ever given ownership). */
const hotKey = () => {
  let key: string | null = null;
  try { key = localStorage.getItem(hotKeyName()); } catch { /* ignore */ }
  if (!key) {
    key = privateKeyToString(makeRandomPrivKey());
    if (key.length === 64) key += '01';
    try { localStorage.setItem(hotKeyName(), key); } catch { throw new Error('This browser cannot store the temporary wallet key, so the automatic seeding cannot be used here.'); }
  }
  return key;
};
const hotAddress = () => getAddressFromPrivateKey(hotKey(), TransactionVersion.Mainnet);
/** A label that stays the same while a transaction is pending (so a reload resumes) and changes once it has passed (so a later run sends again). */
const uniq = (stepId: string, base: string) => `${base} (${step(stepId).txs.filter((t) => t.pass && t.label.startsWith(`${base} (`)).length + 1})`;
const downloadHotKey = () => {
  const blob = new Blob([JSON.stringify({ purpose: `Xtrata Forever Twins launch canary temporary wallet (${CFG.key})`, network: NET, address: hotAddress(), privateKey: hotKey(), helper: helperId(),
    note: 'Keep this file until the canary reports that contract ownership is back with your wallet. Anyone holding it can act as the helper owner (seed, set the fee up to its ceiling, propose a rescue) while ownership is with this wallet.' }, null, 2)], { type: 'application/json' });
  const a = el('a', { href: URL.createObjectURL(blob), download: `xtrata-ft-temp-wallet-${CFG.key}-${hotAddress().slice(0, 8)}.json` }) as HTMLAnchorElement;
  a.click(); URL.revokeObjectURL(a.href);
};
/** Priced from the real size of the signed transaction (a 100-record seed is about 20 KB), with room to spare. */
const hotContractTx = async (fn: string, args: ClarityValue[]) => {
  const [address, name] = helperId().split('.');
  const nonce = await chain.nonce(hotAddress());
  const build = (fee: bigint) => makeContractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args, senderKey: hotKey(), network: chain.stacks,
    nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: [] });
  const size = (await build(TEMP_TX_FEE)).serialize().length;
  const fee = BigInt(Math.max(Number(TEMP_TX_FEE), size * 2));
  return { tx: await build(fee), fee };
};
const hotCall = (stepId: string, label: string, fn: string, args: ClarityValue[]) =>
  runTx(stepId, uniq(stepId, label), async () => chain.broadcast((await hotContractTx(fn, args)).tx));
const walletTransfer = async (recipient: string, amount: bigint, memo: string) => {
  const w = requireWallet();
  const result = await wallet.stxTransfer({ recipient, amount, memo, network: NET, stxAddress: w.address, onProgress: progress,
    buildUnsigned: w.publicKey ? async () => {
      const nonce = await chain.nonce(w.address);
      return toHex((await makeUnsignedSTXTokenTransfer({ recipient, amount, memo, publicKey: w.publicKey!, network: chain.stacks, nonce, fee: 5_000n, anchorMode: AnchorMode.Any })).serialize());
    } : undefined });
  return settle(result);
};
/** What the temporary wallet needs: the seed batches, the calls around them, the final sweep, and a margin. */
const hotFloat = async (todo: Tok[][], o: { accept: boolean; propose: boolean }) => {
  let seeds = 0n;
  if (todo.length) { const { fee } = await hotContractTx('seed-canonical', [listCV(todo[0].map(entryCV))]); seeds = (fee * BigInt(todo.length) * 11n) / 10n; }
  return seeds + TEMP_TX_FEE * BigInt((o.accept ? 1 : 0) + (o.propose ? 1 : 0)) + SWEEP_TX_FEE + 40_000n;
};
/** Makes sure the temporary wallet holds at least `target`: the connected wallet is asked to send the difference; if it cannot sign a plain transfer from a page (Xverse), the amount is shown to send by hand. */
const ensureHotFunds = async (stepId: string, target: bigint, what: string) => {
  const hot = hotAddress();
  const have = await chain.balance(hot);
  if (have < target) {
    const need = target - have;
    let sent = false;
    try {
      await runTx(stepId, uniq(stepId, `${what}: send ${stx(need)} to the temporary wallet`), () => walletTransfer(hot, need, 'ft launch canary'));
      sent = true;
    } catch (error) {
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
  if (!hotExists()) return 0n;
  const hot = hotAddress();
  const balance = await chain.balance(hot);
  if (balance <= SWEEP_TX_FEE) return balance;
  await runTx(stepId, uniq(stepId, `sweep ${stx(balance - SWEEP_TX_FEE)}`), async () => {
    const nonce = await chain.nonce(hot);
    const tx = await makeSTXTokenTransfer({ recipient: CFG.deployer, amount: balance - SWEEP_TX_FEE, senderKey: hotKey(), network: chain.stacks, nonce, fee: SWEEP_TX_FEE, memo: 'ft launch canary sweep', anchorMode: AnchorMode.Any });
    return chain.broadcast(tx);
  });
  return chain.balance(hot);
};
const principalOrNull = (v: string) => (v === 'none' ? null : v.replace(/^"|"$/g, ''));
/**
 * Which tokens still have no canonical record. Seeding goes in manifest order, so normally the first `count` tokens are present and
 * the rest are missing: three reads confirm that. Anything else (records out of order) is found by reading every token.
 */
const missingTokens = async (count: number): Promise<Tok[]> => {
  if (count <= 0) return tokens.slice();
  if (count >= tokens.length) return [];
  const has = async (i: number) => !!(await canonRead(tokens[i].id));
  if ((await has(0)) && (await has(count - 1)) && !(await has(count))) return tokens.slice(count);
  const present = new Set<number>();
  let done = 0;
  await pool(tokens, 6, async (t) => { if (await canonRead(t.id)) present.add(t.id); if (++done % 100 === 0) status(`Checking which records are on chain: ${done}/${tokens.length}…`); });
  return tokens.filter((t) => !present.has(t.id));
};
/** Who owns the helper, who (if anyone) has been proposed, and which seed batches are still missing: all read from the chain. */
const seedPlan = async () => {
  const g = await iface();
  const count = Number(g('canonical-count'));
  const missing = await missingTokens(count);
  // chunk what is missing into batches of the chosen size: an earlier session may have seeded with a different batch size
  const todo: Tok[][] = [];
  for (let i = 0; i < missing.length; i += state.seedBatch) todo.push(missing.slice(i, i + state.seedBatch));
  return { todo, owner: g('owner').replace(/^"|"$/g, ''), pending: principalOrNull(g('pending-owner')), count: Number(g('canonical-count')), finalised: g('canonical-finalized') === 'true' };
};
/**
 * Gives helper ownership back to the deployer if the temporary wallet holds it: the temporary wallet proposes, the connected
 * wallet accepts. Safe to call at any point; does nothing when ownership is already back.
 */
const handBack = async () => {
  const me = CFG.deployer;
  const { owner, pending } = await seedPlan();
  if (owner === me) return false;
  const hot = hotExists() ? hotAddress() : null;
  if (!hot || owner !== hot) throw new Error(`The helper is owned by ${owner}, which is neither your wallet nor the temporary wallet.`);
  await ensureHotFunds('handback', TEMP_TX_FEE + SWEEP_TX_FEE + 20_000n, 'handing ownership back');
  if (pending !== me) {
    await hotCall('handback', 'temporary wallet hands ownership back (propose)', 'propose-ownership', [principalCV(me)]);
    await eventually('Pending owner', async () => ((await seedPlan()).pending === me ? null : 'not proposed yet'));
  }
  await runTx('handback', uniq('handback', 'your wallet accepts ownership back'), () => walletCall('accept-ownership', []));
  await eventually('Owner', async () => ((await seedPlan()).owner === me ? null : 'not accepted yet'));
  log('ok', `Helper ownership is back with ${short(me)}.`);
  return true;
};

// ---------- source checks ----------
// A source collection can change after the manifest snapshot (for example an owner who can still set a new base URI).
// Compare what the source reports now with what the manifest recorded, for a spread of tokens. Run at preflight and
// again just before the one-way finalise.
const normUri = (u: string) => u.trim().replace(/^ipfs:\/\/ipfs\//, 'ipfs://');
const fillId = (u: string, id: number) => u.replace(/\{id\}|\{token_id\}|\{tokenId\}|\$TOKEN_ID|\$ID/g, String(id));
const sourceChecks = async (): Promise<string> => {
  const n = tokens.length;
  const picks = [...new Set([0, 1, Math.floor(n / 4), Math.floor(n / 2), Math.floor((3 * n) / 4), n - 2, n - 1].filter((i) => i >= 0 && i < n))];
  const changed: string[] = [];
  let compared = 0;
  for (const i of picks) {
    const t = tokens[i];
    const recorded = t.original.metadataUri;
    if (!recorded || recorded === 'chain') continue;
    const now = normUri(fillId(asText(await chain.read(CFG.source, 'get-token-uri', [uintCV(t.id)])), t.id));
    compared += 1;
    if (now !== normUri(recorded)) changed.push(`#${t.id} is now ${now} (manifest ${normUri(recorded)})`);
  }
  if (changed.length) throw new Error(`The source collection's token URIs have changed since the manifest snapshot: ${changed.slice(0, 3).join('; ')}. Rebuild the manifest before going further.`);
  let g2 = '';
  if (CFG.group === 'G2') {
    const fn = CFG.listingReadFn || 'get-listing-in-ustx';
    try { await chain.read(CFG.source, fn, [uintCV(tokens[0].id)]); } catch (e) { throw new Error(`G2 source: ${fn} could not be read on the source (${(e as Error).message}). The helper's listing checks depend on it.`); }
    g2 = ` · ${fn} readable`;
  }
  return `source token URIs unchanged since the snapshot (${compared} sampled)${g2}`;
};

// ---------- steps ----------
type Step = { id: string; title: string; who: string; intro: string; action: string; run: () => Promise<string | void> };

const STEPS: Step[] = [
  {
    id: 'connect', title: 'Connect the Xtrata wallet', who: 'Web wallet',
    intro: `Opens the wallet chooser, then the wallet's account picker. Only ${CFG.deployer} can continue: it deploys the helper and owns it afterwards.`,
    action: 'Connect wallet',
    run: async () => {
      const result = await wallet.connect(NET, chooseWallet);
      if (!result.isConnected) {
        if (result.wrongNetwork) throw new Error(`The wallet returned a ${result.wrongNetwork} address (${result.address}). Switch the wallet to mainnet and connect again.`);
        throw new Error('Connection was cancelled or returned no Stacks address.');
      }
      if (result.address !== CFG.deployer) { connected = null; throw new Error(`The wallet picked ${result.address}, but this launch must be signed by ${CFG.deployer}. Pick that account and connect again.`); }
      connected = { address: result.address, publicKey: result.publicKey, label: wallet.walletLabel() };
      state.deployer = result.address; save(); renderHeader();
      let balance = 'could not check';
      try { balance = stx(await chain.balance(result.address)); } catch { /* shown as could not check */ }
      return `${connected.label} · ${result.address} · balance ${balance}${result.publicKey ? '' : ' · no public key (sign-only fallback unavailable)'}`;
    }
  },
  {
    id: 'preflight', title: 'Preflight: pins, manifest, core, name', who: 'Reads only',
    intro: 'Checks the embedded helper source and manifest against the build pins, the manifest against the contract rules (files over 512 KB only for a large-on-demand helper), that the core is open, the source collection is live, the contract name is free (or already holds this exact source), the balance, and whether the resolver is already serving this manifest.',
    action: 'Run preflight',
    run: async () => {
      const helperSha = shaText(__HELPER__);
      if (helperSha !== PINS.helperSha) throw new Error(`Embedded helper source is ${helperSha}, not the pinned ${PINS.helperSha}. Rebuild the canary.`);
      const manifestSha = shaText(__MANIFEST__);
      if (manifestSha !== PINS.manifestSha) throw new Error(`Embedded manifest is ${manifestSha}, not the pinned ${PINS.manifestSha}. Rebuild the canary.`);
      if (tokens.length !== MANIFEST.count) throw new Error(`Manifest count ${MANIFEST.count} ≠ ${tokens.length} tokens.`);
      if (new Set(tokens.map((t) => t.id)).size !== tokens.length) throw new Error('Manifest has duplicate token ids.');
      const big = tokens.filter((t) => t.twin.route === 'preinscribed' || t.twin.totalSize > MAX_SINGLE_TX);
      if (big.length && !CFG.largeOnDemand) throw new Error(`${big.length} file(s) are over 512 KB (pre-inscribe route). This canary only handles single-transaction files; use the harness for large ones.`);
      if (big.length && !/define-public \(inscribe-large /.test(__HELPER__)) throw new Error(`${big.length} file(s) are over 512 KB but the embedded helper has no inscribe-large (large-on-demand route). Refusing.`);
      const badUri = tokens.find((t) => !/^https:\/\//.test(t.twin.tokenUri) || t.twin.tokenUri.length > 256);
      if (badUri) throw new Error(`Token ${badUri.id} has an invalid token-uri.`);
      if (asText(await coreRead('is-paused')) === 'true') throw new Error(`${CFG.master} is paused.`);
      if ((await chain.contractSource(CFG.source)) === null) throw new Error(`Source collection ${CFG.source} not found on chain.`);
      if (CFG.sourceOwnerRead === 'public') {
        // The source's get-owner is a public function (cannot be called read-only). The helper variant reads the source's per-owner id list instead; check that read works.
        if (!CFG.heldIdsReadFn) throw new Error('Config says sourceOwnerRead public but has no heldIdsReadFn.');
        await chain.read(CFG.source, CFG.heldIdsReadFn, [principalCV(CFG.deployer)]);
      } else {
        await chain.read(CFG.source, 'get-owner', [uintCV(tokens[0].id)]);
      }
      const sourceNote = await sourceChecks();
      const existing = await chain.contractSource(helperId());
      let deployed: 'free' | 'ours' = 'free';
      if (existing !== null) {
        if (shaText(existing) !== helperSha && shaText(existing.replace(/\r\n/g, '\n')) !== helperSha) throw new Error(`${helperId()} already exists with different source. Choose another contract name.`);
        deployed = 'ours';
      }
      let balanceNote = '';
      try {
        const b = await chain.balance(CFG.deployer);
        balanceNote = b < 3_000_000n ? ` · WARNING balance ${stx(b)} is under 3 STX (deploy + ${batches().length} seeds + finalise + test inscription)` : ` · balance ${stx(b)}`;
      } catch { balanceNote = ' · balance could not be checked'; }
      // resolver readiness: informational here, a hard gate at finalise
      let resolver: string;
      try {
        const origin = new URL(tokens[0].twin.tokenUri).origin;
        const r = await fetch(`${origin}${CFG.manifestPath}`, { cache: 'no-store' });
        if (r.status === 200) resolver = shaBytes(new Uint8Array(await r.arrayBuffer())) === PINS.manifestSha ? 'resolver already serves this exact manifest' : 'WARNING resolver serves a DIFFERENT manifest (must match before finalising)';
        else resolver = `resolver manifest not live yet (HTTP ${r.status}; required before finalising)`;
      } catch { resolver = 'resolver not reachable from this page (required before finalising)'; }
      step('preflight').data = { helperSha, manifestSha, deployed };
      return `helper ${short(helperSha)} · manifest ${short(manifestSha)} · ${tokens.length} tokens · ${deployed === 'ours' ? 'already deployed with this source' : 'name is free'} · ${sourceNote}${balanceNote} · ${resolver}`;
    }
  },
  {
    id: 'deploy', title: 'Deploy the helper', who: 'Web wallet',
    intro: `Your wallet asks you to deploy the helper (Clarity 4) from ${CFG.deployer}. The canary waits for the block and does not re-send if you reload.`,
    action: 'Deploy contract',
    run: async () => {
      if (step('preflight').data.deployed === 'ours') return 'already deployed with the pinned source; nothing to send';
      const w = requireWallet();
      const rec = await runTx('deploy', 'deploy', async () => settle(await wallet.deployContract({ contractName: state.contractName, codeBody: __HELPER__, clarityVersion: 4, network: NET, stxAddress: w.address, onProgress: progress })));
      return `deployed in block ${rec.block}`;
    }
  },
  {
    id: 'verify', title: 'Verify the deployed contract', who: 'Reads only',
    intro: "Re-reads the deployed source and the helper's starting state against the config: master, source, group, both payees, fee, ceiling and owner, and shows the canonical, finalised and inscribed counts (safe to re-run at any stage).",
    action: 'Verify',
    run: async () => {
      let source: string | null = null;
      await eventually('Deployed contract', async () => { source = await chain.contractSource(helperId()); return source === null ? 'not visible yet' : null; });
      if (shaText(source!) !== PINS.helperSha && shaText(source!.replace(/\r\n/g, '\n')) !== PINS.helperSha) throw new Error('Deployed source differs from the pinned source.');
      const g = await iface();
      const want: Record<string, string> = {
        'collection-key': CFG.key, master: CFG.master, source: CFG.source, group: CFG.group, 'payee-a': CFG.payees[0], 'payee-b': CFG.payees[1],
        fee: String(CFG.initialFeeUstx), 'max-fee': String(CFG.maxFeeUstx), owner: CFG.deployer
      };
      for (const [k, v] of Object.entries(want)) {
        const got = g(k);
        if (got.replace(/^"|"$/g, '') !== v) throw new Error(`get-twin-interface ${k} is ${got}, expected ${v}.`);
      }
      return `source matches · master ${short(CFG.master)} · ${CFG.group} · payees ${short(CFG.payees[0])} / ${short(CFG.payees[1])} · fee ${stx(CFG.initialFeeUstx)} (max ${stx(CFG.maxFeeUstx)}) · owner ${short(CFG.deployer)} · canonical records ${g('canonical-count')} · finalised ${g('canonical-finalized')} · inscribed ${g('inscribed-count')}`;
    }
  },
  {
    id: 'tempwallet', title: 'Prepare the temporary seeding wallet', who: 'Web wallet · 1 transfer',
    intro: `Only the helper's owner can seed, and the owner would otherwise approve every batch by hand. So the canary creates a temporary wallet in this browser, saves its key to a file, and asks your wallet to send it just enough STX for the network fees of every seed batch plus the hand-over and hand-back (the rest is swept back to you at the end). Xverse cannot sign a plain transfer from a page: the address and amount are shown and the step waits for the funds to arrive. If every record is already on chain, nothing is created or sent.`,
    action: 'Create and fund the temporary wallet',
    run: async () => {
      const { todo, owner } = await seedPlan();
      if (!todo.length && owner === CFG.deployer) return `all ${tokens.length} records are already on chain: no temporary wallet needed, nothing sent`;
      const hot = hotAddress();
      if (owner !== CFG.deployer && owner !== hot) throw new Error(`The helper is owned by ${owner}, which is neither your wallet nor this canary's temporary wallet ${hot}. Nothing was sent.`);
      requireWallet();
      const target = await hotFloat(todo, { accept: owner !== hot, propose: true });
      if (!step('tempwallet').data.keySaved) {
        const msg = `${todo.length} seed batch(es) are still to write.\n\nThe temporary wallet ${hot} will sign them. Its key is about to be saved to a file in your downloads: keep that file until the canary says ownership is back with your wallet.\n\nNext your wallet sends it about ${stx(target)} for network fees (what is unspent is swept back). Continue?`;
        if (!window.confirm(msg)) throw new Error('Not confirmed; nothing was sent.');
        downloadHotKey();
        step('tempwallet').data.keySaved = true; save();
      }
      const have = await ensureHotFunds('tempwallet', target, 'seeding float');
      return `temporary wallet ${hot} created, key saved to a file, and funded: it holds ${stx(have)} for ${todo.length} seed batch(es)`;
    }
  },
  {
    id: 'handover', title: 'Make the temporary wallet the helper owner', who: 'Web wallet · 1 signature',
    intro: 'Your wallet proposes the temporary wallet as owner (propose-ownership) and the temporary wallet accepts (accept-ownership, signed in this page). It stays the owner only for the next step; the step after that hands ownership back to your wallet. If anything stops in between, press the next step\'s button again, or "Return ownership to my wallet" below, to finish the hand-back.',
    action: 'Hand over ownership',
    run: async () => {
      const { todo, owner, pending } = await seedPlan();
      if (!todo.length && owner === CFG.deployer) return 'nothing to seed: ownership stays with your wallet, nothing sent';
      const hot = hotAddress();
      if (owner === hot) return `the temporary wallet ${short(hot)} already owns the helper (nothing sent)`;
      if (owner !== CFG.deployer) throw new Error(`The helper is owned by ${owner}, which is neither your wallet nor the temporary wallet. Nothing was sent.`);
      requireWallet();
      const need = await hotFloat(todo, { accept: true, propose: true });
      // a stopped run has already spent fees (a failed batch still costs one), so top the float up rather than refuse
      if ((await chain.balance(hot)) < need) await ensureHotFunds('handover', need, 'topping up the seeding float');
      if (pending !== hot) {
        await runTx('handover', uniq('handover', `make ${short(hot)} the helper owner (propose)`), () => walletCall('propose-ownership', [principalCV(hot)]));
        await eventually('Pending owner', async () => ((await seedPlan()).pending === hot ? null : 'not proposed yet'));
      }
      await hotCall('handover', 'temporary wallet accepts ownership', 'accept-ownership', []);
      await eventually('Owner', async () => ((await seedPlan()).owner === hot ? null : 'not accepted yet'));
      return `the temporary wallet ${short(hot)} now owns the helper (the next step hands it back) · ${todo.length} seed batch(es) to write`;
    }
  },
  {
    id: 'seed', title: 'Seed the canonical record', who: 'Temporary wallet · automatic',
    intro: "Writes every token's content hash, mime, size and token-uri into the helper, in batches, signed by the temporary wallet with no prompts. Each batch is confirmed and re-read before the next is sent. A batch already on chain is skipped; a rerun after a stop continues where it left off and sends nothing twice.",
    action: 'Seed',
    run: async () => {
      const { todo, owner, count } = await seedPlan();
      if (!todo.length) return `all ${tokens.length} records are already on chain (canonical-count ${count}/${tokens.length}); nothing sent`;
      const hot = hotAddress();
      if (owner !== hot) throw new Error(`Seeding is signed by the temporary wallet, but the helper is owned by ${owner}. Run the hand-over step again.`);
      let sent = 0, expected = count;
      try {
        for (const b of todo) {
          const label = `seed-canonical #${b[0].id}-#${b[b.length - 1].id}`;
          status(`Seeding batch ${sent + 1} of ${todo.length} (#${b[0].id}-#${b[b.length - 1].id})…`);
          await hotCall('seed', label, 'seed-canonical', [listCV(b.map(entryCV))]);
          expected += b.length;
          await eventually(`Seed batch ${sent + 1}`, async () => { const c = Number((await iface())('canonical-count')); return c === expected ? null : `canonical-count ${c}, expected ${expected}`; });
          sent++;
        }
      } catch (error) {
        throw new Error(`${error instanceof Error ? error.message : String(error)} — The helper stays owned by the temporary wallet ${hot} until it is handed back. Press this step's button again to continue, or "Return ownership to my wallet" to give it back now. Its key was saved to a file (and stays in this browser).`);
      }
      return `${todo.length} batch(es) written by the temporary wallet · canonical-count ${(await iface())('canonical-count')}/${tokens.length}`;
    }
  },
  {
    id: 'handback', title: 'Hand ownership back and sweep the temporary wallet', who: 'Web wallet · 1 signature',
    intro: 'The temporary wallet proposes your wallet as owner again and your wallet accepts (accept-ownership). Then anything left in the temporary wallet is swept back to you. The step also clears a hand-over that was proposed but never accepted, so the temporary key can never take ownership later.',
    action: 'Hand back and sweep',
    run: async () => {
      requireWallet();
      const moved = await handBack();
      const { owner, pending, count } = await seedPlan();
      if (owner !== CFG.deployer) throw new Error(`The helper is owned by ${owner}, not your wallet.`);
      const hot = hotExists() ? hotAddress() : null;
      if (hot && pending === hot) {
        await runTx('handback', uniq('handback', 'cancel the pending hand-over'), () => walletCall('cancel-ownership-proposal', []));
        await eventually('Pending owner', async () => ((await seedPlan()).pending === hot ? 'still the temporary wallet' : null));
      }
      if (count !== tokens.length) throw new Error(`Ownership is back with your wallet, but only ${count} of ${tokens.length} records are on chain. Run the hand-over and seed steps again.`);
      const left = await sweepHot('handback');
      return `${moved ? 'ownership handed back to your wallet' : 'your wallet already owns the helper (nothing to hand back)'} · all ${tokens.length} records on chain${hot ? ` · temporary wallet holds ${stx(left)}` : ''}`;
    }
  },
  {
    id: 'audit', title: 'Audit the canonical record', who: 'Reads only',
    intro: 'Reads every record back and compares it with the manifest (hash, mime, size, token-uri), checks nothing extra exists either side of the id range, and that the count is right. The manifest sha256 you will finalise with is shown here.',
    action: 'Audit',
    run: async () => {
      const bad: string[] = [];
      let done = 0;
      await pool(tokens, 6, async (t) => { const d = canonDiff(t, await canonRead(t.id)); if (d.length) bad.push(`#${t.id}:${d.join('+')}`); if (++done % 40 === 0) status(`Audit: ${done}/${tokens.length} records read…`); });
      if (bad.length) throw new Error(`${bad.length} record(s) differ from the manifest: ${bad.slice(0, 8).join(', ')}`);
      const maxId = Math.max(...tokens.map((t) => t.id)), minId = Math.min(...tokens.map((t) => t.id));
      if (await canonRead(maxId + 1)) throw new Error(`An extra record exists at #${maxId + 1}.`);
      if (minId > 0 && (await canonRead(minId - 1))) throw new Error(`An extra record exists at #${minId - 1}.`);
      const g = await iface();
      if (g('canonical-count') !== String(tokens.length)) throw new Error(`canonical-count is ${g('canonical-count')}, expected ${tokens.length}.`);
      return `all ${tokens.length} records match the manifest · count ${g('canonical-count')} · finalised ${g('canonical-finalized')} · manifest sha256 ${PINS.manifestSha}`;
    }
  },
  {
    id: 'finalise', title: 'Finalise the canonical record (one-way)', who: 'Web wallet',
    intro: 'IRREVERSIBLE: after this the records and token-uris can never change. It first checks the live resolver at the token-uri origin (the published manifest must be byte-identical to the pin, and sample token-uris must answer), then you type the collection key to confirm.',
    action: 'Finalise',
    run: async () => {
      const g0 = await iface();
      if (g0('canonical-finalized') === 'true') {
        if (bare(g0('manifest-hash')) !== PINS.manifestSha) throw new Error(`The helper is finalised with manifest ${g0('manifest-hash')}, not the pinned ${PINS.manifestSha}.`);
        return `already finalised with the pinned manifest ${short(PINS.manifestSha)}`;
      }
      if (step('audit').status !== 'pass') throw new Error('Run the audit first.');
      if (g0('owner').replace(/^"|"$/g, '') !== CFG.deployer) throw new Error(`The helper is owned by ${g0('owner')}, not your wallet. Hand ownership back first.`);
      const origin = new URL(tokens[0].twin.tokenUri).origin;
      const mres = await fetch(`${origin}${CFG.manifestPath}`, { cache: 'no-store' });
      if (mres.status !== 200) throw new Error(`The resolver does not serve ${origin}${CFG.manifestPath} (HTTP ${mres.status}). Deploy it to production before finalising.`);
      const live = shaBytes(new Uint8Array(await mres.arrayBuffer()));
      if (live !== PINS.manifestSha) throw new Error(`The published manifest is ${live}, not the pin ${PINS.manifestSha}. Publish the exact same bytes first.`);
      const sample = [tokens[0], tokens[Math.floor(tokens.length / 2)], tokens[tokens.length - 1]];
      for (const t of sample) {
        const r = await fetch(t.twin.tokenUri, { cache: 'no-store' });
        if (r.status !== 200) throw new Error(`token-uri ${t.twin.tokenUri} answered HTTP ${r.status}. Fix the resolver before finalising.`);
        const j = await r.json();
        if (j?.properties?.original?.token_id !== t.id) throw new Error(`token-uri ${t.twin.tokenUri} returned metadata for a different token.`);
      }
      log('ok', `Resolver gate passed: manifest identical, ${sample.length} sample token-uris answered.`);
      log('ok', `Source gate passed: ${await sourceChecks()}.`);
      const typed = window.prompt(`This cannot be undone.\nType ${CFG.key} to finalise ${tokens.length} records with manifest ${PINS.manifestSha.slice(0, 12)}…`);
      if (typed !== CFG.key) throw new Error('Not confirmed; nothing was sent.');
      await runTx('finalise', 'finalize-canonical', () => walletCall('finalize-canonical', [bufferCV(hexBytes(PINS.manifestSha)), uintCV(tokens.length)]));
      await eventually('Finalise', async () => { const g = await iface(); return g('canonical-finalized') === 'true' && bare(g('manifest-hash')) === PINS.manifestSha ? null : `finalized ${g('canonical-finalized')}, hash ${g('manifest-hash')}`; });
      return `finalised: ${tokens.length} records, manifest ${PINS.manifestSha}`;
    }
  },
  {
    id: 'inscribe', title: 'Test inscription from this wallet', who: 'Web wallet',
    intro: 'Inscribes one twin (the test token id above) from the Xtrata wallet. This wallet is not a payee, so it pays the full fee, which proves the non-payee path. The file is read from your local gateway and checked against the manifest (size, sha256, rolling hash) before anything is signed; a sender post-condition caps what the wallet can send.',
    action: 'Inscribe test token',
    run: async () => {
      const t = tokenById(state.testToken);
      if (!t) throw new Error(`Token ${state.testToken} is not in the manifest.`);
      if (t.twin.totalSize > MAX_SINGLE_TX) throw new Error(`Token ${t.id} is ${t.twin.totalSize} bytes: over 512 KB, so it cannot be the test token (it is twinned through the large-file wizard). Pick a smaller token id.`);
      const bound = await read('get-binding', [uintCV(t.id)]);
      if (!isNone(bound) && !step('inscribe').txs.some((x) => x.pass)) throw new Error(`Token ${t.id} is already inscribed (not by this run). Pick another test token id.`);
      const w = requireWallet();
      const url = gatewayUrl(t.original.mediaUris[0]);
      status(`Reading #${t.id} from ${url}…`);
      const r = await fetch(url, { cache: 'no-store' }).catch((e) => { throw new Error(`Could not read ${url}: ${e instanceof Error ? e.message : e}. Is your local IPFS node running? (set the gateway above)`); });
      if (!r.ok) throw new Error(`Gateway answered HTTP ${r.status} for ${url}.`);
      const bytes = new Uint8Array(await r.arrayBuffer());
      if (bytes.length !== t.twin.totalSize) throw new Error(`File is ${bytes.length} bytes, manifest says ${t.twin.totalSize}.`);
      if (shaBytes(bytes) !== bare(t.twin.sha256)) throw new Error('File sha256 does not match the manifest.');
      const chunks = chunkBytes(bytes);
      if (rolling(chunks) !== bare(t.twin.contentHash)) throw new Error('File rolling hash does not match the manifest.');
      const feeFor = asBig(await read('fee-for', [standardPrincipalCV(w.address)]));
      const quote = inner(await coreRead('quote-single-tx-fee', [uintCV(bytes.length), uintCV(chunks.length)]));
      // The core returns a tuple (begin-fee, seal-fee, single-tx-fee, total-fee, ...); older/mock builds return a bare uint.
      const coreFee = asBig((quote as any).data ? field(quote, 'total-fee') : quote);
      const cap = feeFor + coreFee;
      log('info', `#${t.id}: ${bytes.length} B, ${chunks.length} chunks, helper fee ${stx(feeFor)} + core fee ${stx(coreFee)}`);
      const pcs = [makeStandardSTXPostCondition(w.address, FungibleConditionCode.LessEqual, cap)];
      const rec: any = await runTx('inscribe', `inscribe #${t.id}`, () => walletCall('inscribe', [uintCV(t.id), listCV(chunks.map((c) => bufferCV(c)))], pcs, PostConditionMode.Allow));
      const tx = rec.tx ?? await chain.tx(rec.txid);
      const sent = (tx?.events ?? []).filter((e: any) => e.event_type === 'stx_asset' && e.asset?.asset_event_type === 'transfer' && e.asset.sender === w.address);
      const out = sent.map((e: any) => ({ to: e.asset.recipient as string, amount: BigInt(e.asset.amount) }));
      const total = out.reduce((s: bigint, e: any) => s + e.amount, 0n);
      const half = feeFor / 2n;
      for (const p of CFG.payees) if (p !== w.address && !out.some((e: any) => e.to === p && e.amount === half)) throw new Error(`Expected ${stx(half)} to payee ${p}; transfers were ${JSON.stringify(out.map((e: any) => [e.to, e.amount.toString()]))}.`);
      if (total > cap) throw new Error(`Wallet sent ${stx(total)}, over the cap ${stx(cap)}.`);
      let xtrataId = '';
      await eventually(`Binding #${t.id}`, async () => { const b = await read('get-binding', [uintCV(t.id)]); if (isNone(b)) return 'no binding yet'; xtrataId = asText(field(b, 'xtrata-id')); return null; });
      await eventually('Custody', async () => {
        const c = await read('get-custody-state', [uintCV(t.id)]);
        return asText(field(c, 'consistent')) === 'true' && asText(field(c, 'xtrata-escrowed')) === 'true' ? null : 'custody not consistent yet';
      });
      const owner = asText(await chain.read(CFG.master, 'get-owner', [uintCV(BigInt(xtrataId))]));
      if (owner !== helperId()) throw new Error(`Twin #${xtrataId} is owned by ${owner}, expected the helper ${helperId()}.`);
      step('inscribe').data = { tokenId: t.id, xtrataId, feeFor: feeFor.toString(), coreFee: coreFee.toString(), sent: out.map((e: any) => ({ to: e.to, amount: e.amount.toString() })) };
      return `#${t.id} → Xtrata #${xtrataId} · wallet sent ${stx(total)} in ${out.length} transfers (${out.map((e: any) => `${short(e.to)} ${stx(e.amount)}`).join(', ')}) · twin held by the helper · custody consistent`;
    }
  },
  {
    id: 'handoff', title: 'Hand-off: sponsor run and registry entry', who: 'Reads only',
    intro: 'Re-reads the final state and prints what to do next: the resolver config change, the dry-run and execute commands for the sponsor script, and the registry entry.',
    action: 'Build hand-off',
    run: async () => {
      const g = await iface();
      if (g('canonical-finalized') !== 'true') throw new Error('The helper is not finalised.');
      const inscribed = g('inscribed-count');
      const id = helperId();
      const reg = { key: CFG.key, name: CFG.name, source: CFG.source, helper: id, interface: 'v3', group: CFG.group, status: 'live', ...(CFG.largeOnDemand ? { largeOnDemand: true } : {}),
        expectedSourceSha256: PINS.helperSha, evidence: `Forever Twins launch canary ${__BUILD__}: deployed, ${tokens.length} records seeded and audited, finalised with manifest ${PINS.manifestSha}, test inscription #${state.testToken} verified (${new Date().toISOString().slice(0, 10)})` };
      const out = [
        `HELPER           ${id}`,
        `MANIFEST SHA256  ${PINS.manifestSha}`,
        `INSCRIBED SO FAR ${inscribed}/${tokens.length}`,
        '',
        '1) Resolver: in functions/ft/collections.json set',
        `   "helper": "${id}"   and   "manifestStatus": "final"   then deploy.`,
        '',
        '2) Sponsor run (from forever-twins/ft-harness, local IPFS node running). Dry run first:',
        `   node manifest/sponsor-inscribe.mjs --manifest manifest/out/${CFG.key}.manifest.json --helper ${id}`,
        `   node manifest/sponsor-inscribe.mjs --manifest manifest/out/${CFG.key}.manifest.json --helper ${id} --only <id> --execute --confirm ${id}`,
        `   node manifest/sponsor-inscribe.mjs --manifest manifest/out/${CFG.key}.manifest.json --helper ${id} --execute --confirm ${id} --batch 20`,
        '   (needs SPONSOR_PRIVATE_KEY in the environment for the sponsoring wallet; a payee wallet pays only the other payee\'s half of the fee)',
        '',
        ...(CFG.largeOnDemand ? ['   NOTE: files over 512 KB are not sponsored by this script; visitors twin them through the large-file wizard (collection page, register the collection with "largeOnDemand": true).', ''] : []),
        '3) Registry entry (forever-twins/ft-harness/registry/registry.v1.json, helpers[]), then npm run registry:verify:',
        JSON.stringify(reg, null, 2)
      ].join('\n');
      step('handoff').data = { text: out };
      return `hand-off ready (${inscribed}/${tokens.length} inscribed)`;
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
const unlocked = (index: number) => STEPS.slice(0, index).every((s) => step(s.id).status === 'pass');
const needsWallet = (s: Step) => s.who.startsWith('Web wallet');

const renderSteps = () => {
  $('#steps').replaceChildren(...STEPS.map((s, i) => {
    const st = step(s.id);
    const open = unlocked(i);
    const blockedByWallet = needsWallet(s) && i > 0 && !connected;
    const tone = st.status === 'pass' ? 'success' : st.status === 'fail' ? 'error' : st.status === 'running' ? 'warning' : '';
    const text: string | null = s.id === 'handoff' ? (st.data.text ?? null) : null;
    return el('section', { class: `step${open ? '' : ' locked'}` },
      el('div', { class: 'step__head' },
        el('span', { class: 'step__number' }, String(i + 1)),
        el('div', {}, el('h2', {}, s.title), el('p', { class: 'who' }, s.who)),
        el('span', { class: 'badge', 'data-tone': tone }, st.status === 'todo' ? (open ? 'ready' : 'locked') : st.status)),
      el('div', { class: 'step__body' },
        el('p', {}, s.intro),
        st.note ? el('p', { class: `note ${st.status}` }, st.note) : null,
        st.txs.length ? el('ul', { class: 'txs' }, st.txs.map((t) => el('li', {}, `${t.label} — ${t.status}${t.result ? ` ${t.result}` : ''} `, el('a', { href: chain.txUrl(t.txid), target: '_blank', rel: 'noopener' }, short(t.txid))))) : null,
        text ? el('textarea', { readonly: true, onclick: (e: Event) => (e.target as HTMLTextAreaElement).select() }, text) : null,
        el('div', { class: 'actions' },
          el('button', { class: 'button', type: 'button', 'data-step': s.id, disabled: !open || busy || blockedByWallet, onclick: () => void execute(s) },
            st.status === 'pass' ? `Re-check · ${s.action}` : s.action),
          text ? el('button', { class: 'button ghost', type: 'button', onclick: () => void navigator.clipboard?.writeText(text) }, 'Copy') : null,
          blockedByWallet && open ? el('span', { class: 'hint' }, 'Reconnect your wallet in step 1 to continue.') : null)));
  }));
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
  const started = Object.entries(state.steps).some(([id, s]) => id !== 'connect' && id !== 'preflight' && (s.status === 'pass' || s.txs.length > 0));
  ($('#collection') as HTMLInputElement).value = `${CFG.name} (${CFG.group}) · ${tokens.length} tokens`;
  const name = $('#contract-name') as HTMLInputElement; name.value = state.contractName; name.disabled = started;
  ($('#deployer') as HTMLInputElement).value = CFG.deployer;
  const batch = $('#seed-batch') as HTMLSelectElement; batch.value = String(state.seedBatch); batch.disabled = step('seed').txs.length > 0 || step('seed').status === 'pass';
  const tt = $('#test-token') as HTMLInputElement; tt.value = String(state.testToken); tt.disabled = step('inscribe').txs.length > 0;
  ($('#gateway') as HTMLInputElement).value = state.gateway;
  $('#hot').textContent = hotExists() ? `${hotAddress()} (key kept in this browser, and in the file saved when it was created)` : 'not created yet';
  $('#wallet').textContent = connected ? `${connected.label} · ${short(connected.address)}` : 'not connected';
  $('#disconnect').toggleAttribute('hidden', !connected);
};

const bind = () => {
  $('#build').textContent = `${__BUILD__} · helper ${PINS.helperSha.slice(0, 12)}… · manifest ${PINS.manifestSha.slice(0, 12)}…`;
  $('#intro').textContent = `Ships the ${CFG.name} Forever Twins helper from the Xtrata wallet in the only safe order: deploy, verify, seed ${tokens.length} canonical records (signed by a temporary wallet the page creates, so you approve about four transactions instead of one per batch), audit them, finalise (one-way, gated on the live resolver) and inscribe one test twin. Each step unlocks only when the one before it has passed and re-reads the chain rather than trusting this page's memory. The sponsored inscription of the rest is done afterwards with the sponsor script.`;
  $('#contract-name').addEventListener('change', (e) => {
    const v = (e.target as HTMLInputElement).value.trim();
    if (!/^[a-zA-Z][a-zA-Z0-9-]{0,39}$/.test(v)) { status('Contract names start with a letter and use letters, digits and dashes (max 40).', 'error'); renderHeader(); return; }
    state.contractName = v; state.steps = { connect: step('connect') }; save(); renderSteps();
  });
  $('#seed-batch').addEventListener('change', (e) => { state.seedBatch = Number((e.target as HTMLSelectElement).value); save(); renderSteps(); });
  $('#test-token').addEventListener('change', (e) => {
    const v = Number((e.target as HTMLInputElement).value);
    if (!tokenById(v)) { status(`Token ${v} is not in the manifest.`, 'error'); renderHeader(); return; }
    state.testToken = v; save();
  });
  $('#gateway').addEventListener('change', (e) => { state.gateway = (e.target as HTMLInputElement).value.trim(); save(); });
  $('#disconnect').addEventListener('click', async () => { await wallet.disconnect(); connected = null; step('connect').status = 'todo'; save(); renderHeader(); renderSteps(); log('info', 'Wallet disconnected.'); });
  $('#export').addEventListener('click', () => {
    const report = { ...state, build: __BUILD__, network: NET, config: CFG, pins: PINS, helper: helperId() };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `ft-launch-${CFG.key}-${Date.now()}.json` }) as HTMLAnchorElement;
    a.click(); URL.revokeObjectURL(a.href);
  });
  $('#handback').addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    try {
      const moved = await handBack();
      status(moved ? 'Ownership is back with your wallet.' : 'Your wallet already owns the helper; nothing to hand back.', 'ok');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      log('error', `Return ownership: ${msg}`); status(msg, 'error');
    } finally { busy = false; renderHeader(); renderSteps(); }
  });
  $('#hotkey').addEventListener('click', () => { if (!hotExists()) { status('No temporary wallet has been created yet.', 'warn'); return; } downloadHotKey(); });
  $('#forget').addEventListener('click', () => {
    if (!confirm('Forget local progress? Nothing on chain changes; the canary re-reads the chain and resumes from what is already there. The temporary wallet key is kept in this browser either way, so you can still hand ownership back or sweep it.')) return;
    try { localStorage.removeItem(stateKey()); } catch { /* ignore */ }
    load(); restoreLog(); renderHeader(); renderSteps(); status('Local progress cleared.', 'ok');
  });
};
const restoreLog = () => {
  $('#log').replaceChildren(...state.log.map((l) => el('div', { class: `log-line ${l.level}` }, el('time', {}, new Date(l.t).toLocaleTimeString()), ' ', l.msg,
    l.txid ? [' ', el('a', { href: chain.txUrl(l.txid), target: '_blank', rel: 'noopener' }, short(l.txid))] : null)));
};

// ---------- boot ----------
load();
wallet.setConnectMessage(`Xtrata Forever Twins launch: ${CFG.name}`);
if (location.protocol === 'file:') $('#file-banner').removeAttribute('hidden');
if (state.steps.connect?.status === 'pass') state.steps.connect.status = 'todo'; // wallet connection never survives a reload
bind(); restoreLog(); renderHeader(); renderSteps();
