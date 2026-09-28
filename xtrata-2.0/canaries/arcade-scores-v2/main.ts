/**
 * Arcade leaderboard v2 deployment canary.
 *
 * Deploys `xtrata-arcade-scores-v2` from a web wallet (Xverse or Leather) and
 * proves on chain that it works: a real Astro Blaster 3 run is submitted and
 * re-verified from the stored replay, a copied run from another wallet is
 * refused, void + bar works, and the canary board is closed again. Optionally
 * registers the production boards once the game inscription id is known.
 *
 * Wallet logic is the shared canary module (`../collection-v17/wallet.ts`),
 * the port of the X Chess v2 canary that follows docs/WALLET-PLAYBOOK.md.
 */
import { sha256 } from '@noble/hashes/sha256';
import {
  AnchorMode,
  boolCV,
  bufferCV,
  ClarityType,
  createAddress,
  cvToString,
  getAddressFromPrivateKey,
  makeContractCall,
  makeRandomPrivKey,
  makeSTXTokenTransfer,
  makeUnsignedContractCall,
  makeUnsignedSTXTokenTransfer,
  PostConditionMode,
  principalCV,
  privateKeyToString,
  stringAsciiCV,
  TransactionVersion,
  uintCV,
  type ClarityValue
} from '@stacks/transactions';
import contractSource from '../../contracts/arcade-scores-v2/contracts/xtrata-arcade-scores-v2.clar';
import '../../recursive-apps/astro-blaster-3/release/sim.js';
import { Chain, toHex } from '../collection-v17/chain';
import * as wallet from '../collection-v17/wallet';
import type { Net, ProviderInfo } from '../collection-v17/wallet';

declare const __BUILD__: string;
declare const __SOURCE_SHA__: string;
declare const __ENGINE_SHA__: string;

type Engine = {
  ENGINE_VERSION: number;
  createGame(o: object): { score: number; phase: string };
  step(st: unknown, i: unknown): void;
  botInput(st: unknown): { ax: number; ay: number; cmd: number };
  Recorder: new () => { push(i: unknown): void; frames: number };
  encodeReplay(st: unknown, rec: unknown): Promise<Uint8Array>;
  verifyReplay(b: Uint8Array, o?: object): Promise<{ ok: boolean; score: number; reason: string }>;
};
const AB3 = (globalThis as unknown as { AB3: Engine }).AB3;

const PINNED_SHA = __SOURCE_SHA__; // the build refuses to embed any other source
const DEFAULT_NAME = 'xtrata-arcade-scores-v2';
const CANARY_BOARD = 'canary';
const MAX_SCORE = 10_000_000_000n;
const COPY_TX_FEE = 30_000n;
const SWEEP_TX_FEE = 5_000n;
const FUND_AMOUNT = 60_000n;
const RUN_FRAMES = 3600; // one minute of play by the built-in pilot

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
const shaHex = (text: string) => toHex(sha256(new TextEncoder().encode(text)));
const hexBytes = (hex: string) => Uint8Array.from(hex.replace(/^0x/, '').match(/../g)!.map((h) => parseInt(h, 16)));
const b64 = (b: Uint8Array) => { let s = ''; b.forEach((x) => { s += String.fromCharCode(x); }); return btoa(s); };
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

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
    case ClarityType.PrincipalStandard: case ClarityType.PrincipalContract: return cvToString(v);
    default: return cvToString(v);
  }
};
const tupleField = (cv: ClarityValue, key: string) => (inner(cv) as any).data[key] as ClarityValue;

// ---------- state ----------
type TxRec = { label: string; txid: string; status: string; result?: string; pass?: boolean; block?: number };
type StepState = { status: 'todo' | 'running' | 'pass' | 'fail'; note?: string; data: Record<string, any>; txs: TxRec[] };
type State = {
  version: 1;
  contractName: string;
  engineId: string;
  deployer?: string;
  run?: { replay: string; score: number };
  steps: Record<string, StepState>;
  log: { t: string; level: string; msg: string; txid?: string }[];
};

let network: Net = (localStorage.getItem('xtrata-arcade-canary:network') as Net) === 'testnet' ? 'testnet' : 'mainnet';
let chain = new Chain(network);
let state!: State;
let connected: { address: string; publicKey: string | null; label: string } | null = null;
let busy = false;

const stateKey = () => `xtrata-arcade-canary:v1:${network}`;
const hotKeyName = () => `xtrata-arcade-canary:hot:${network}`;
const freshState = (): State => ({ version: 1, contractName: DEFAULT_NAME, engineId: '', steps: {}, log: [] });
const load = () => {
  try { const raw = localStorage.getItem(stateKey()); state = raw ? { ...freshState(), ...JSON.parse(raw) } : freshState(); } catch { state = freshState(); }
};
const save = () => { try { localStorage.setItem(stateKey(), JSON.stringify(state)); } catch { /* storage unavailable */ } };
const step = (id: string): StepState => (state.steps[id] ??= { status: 'todo', data: {}, txs: [] });
const contractId = () => `${state.deployer}.${state.contractName}`;

const log = (level: 'info' | 'ok' | 'warn' | 'error', msg: string, txid?: string) => {
  const line = el('div', { class: `log-line ${level}` }, el('time', {}, new Date().toLocaleTimeString()), ' ', msg,
    txid ? [' ', el('a', { href: chain.txUrl(txid), target: '_blank', rel: 'noopener' }, short(txid))] : null);
  $('#log').prepend(line);
  state.log.unshift({ t: new Date().toISOString(), level, msg, txid });
  state.log = state.log.slice(0, 400);
  save();
  (level === 'error' ? console.warn : console.info)('[arcade-canary]', msg, txid ?? '');
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
const unsignedCall = async (fn: string, args: ClarityValue[]) => {
  const w = requireWallet();
  const [address, name] = contractId().split('.');
  const nonce = await chain.nonce(w.address);
  const build = (fee: bigint) => makeUnsignedContractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
    publicKey: w.publicKey!, network: chain.stacks, nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: [] });
  const size = (await build(20_000n)).serialize().length;
  return toHex((await build(BigInt(Math.max(20_000, Math.ceil(size * 1.2))))).serialize());
};
/** Every call in this canary moves no STX, so deny mode with no post-conditions is exact. */
const walletCall = async (fn: string, args: ClarityValue[]) => {
  const w = requireWallet();
  const [address, name] = contractId().split('.');
  const result = await wallet.contractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
    postConditions: [], postConditionMode: PostConditionMode.Deny, network, stxAddress: w.address, onProgress: progress,
    buildUnsigned: w.publicKey ? () => unsignedCall(fn, args) : undefined });
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
    : tx.tx_status === 'success' && !(rec.result ?? '').startsWith('(err'); // a deploy reports (ok true) or just true
  save();
  if (!rec.pass) {
    log('error', `${label}: ${tx.tx_status} ${rec.result}${expect ? ` (expected a refusal with ${expect})` : ''}`, rec.txid);
    s.txs = s.txs.filter((t) => t !== rec); save();
    throw new Error(`${label}: ${tx.tx_status} ${rec.result}${expect ? `, expected ${expect}` : ''}`);
  }
  log('ok', `${label}: ${expect ? 'refused as expected' : 'confirmed'} ${rec.result}`, rec.txid);
  return { ...rec, tx };
};

// ---------- reads ----------
const eventually = async (what: string, check: () => Promise<string | null>, attempts = 23) => {
  let seen: string | null = null;
  for (let i = 0; i < attempts; i++) {
    try { seen = await check(); } catch (error) { seen = `read failed: ${error instanceof Error ? error.message : String(error)}`; }
    if (seen === null) return;
    if (i === 0) log('info', `${what}: chain still shows ${seen}; waiting for it to catch up…`);
    status(`${what}: waiting for the chain to catch up (${(i + 1) * 4}s)…`, 'warn');
    await new Promise((r) => setTimeout(r, 4000));
  }
  throw new Error(`${what}: the chain still shows ${seen} after 90s. The transaction itself is confirmed; press the button again in a minute to re-check (nothing is re-sent).`);
};
const read = (fn: string, args: ClarityValue[] = []) => chain.read(contractId(), fn, args);
const boardArgs = (id: string) => [stringAsciiCV(id)];
const topEntries = async (board: string, period = 0n) => {
  const list: any = await read('get-top10', [stringAsciiCV(board), uintCV(period)]);
  return (list.list as ClarityValue[]).filter((o: any) => o.type === ClarityType.OptionalSome).map((o: any) => {
    const t = o.value.data;
    return { player: cvToString(t.player), name: t.name.data as string, score: BigInt(t.score.value), hash: toHex(t['replay-hash'].buffer ?? hexBytes(cvToString(t['replay-hash']).replace(/^0x/, ''))) };
  });
};
const readBoard = async (id: string) => {
  const v = inner(await read('get-board', boardArgs(id)));
  if ((v as any).type === ClarityType.OptionalNone) return null;
  const f = (k: string) => asText(tupleField(v, k));
  return { mode: f('mode'), maxScore: f('max-score'), fee: f('fee'), engineId: f('engine-id'), daily: f('daily'), enabled: f('enabled') };
};

// ---------- the canary run ----------
const pilotOf = (address: string) => { const a = createAddress(address); return { hash: hexBytes(a.hash160), version: a.version }; };
const makeRun = async (address: string) => {
  const pilot = pilotOf(address);
  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  const st: any = AB3.createGame({ seed, pilot: pilot.hash, pilotVersion: pilot.version });
  const rec = new AB3.Recorder();
  for (let f = 0; f < RUN_FRAMES && st.phase !== 'over'; f++) {
    if (f % 600 === 0) { status(`Flying a canary run with the built-in pilot… ${Math.round(f / 60)}s of play`); await new Promise((r) => setTimeout(r, 0)); }
    const input = AB3.botInput(st); rec.push(input); AB3.step(st, input);
  }
  const bytes = await AB3.encodeReplay(st, rec);
  const check = await AB3.verifyReplay(bytes, { pilot: pilot.hash });
  if (!check.ok) throw new Error(`The engine could not verify its own run (${check.reason}). Do not deploy; report this.`);
  return { replay: b64(bytes), score: st.score as number };
};

type Step = { id: string; title: string; who: string; intro: string; action: string; optional?: boolean; run: () => Promise<string | void> };

const STEPS: Step[] = [
  {
    id: 'connect', title: 'Connect your web wallet', who: 'Web wallet',
    intro: 'Opens the wallet chooser, then the wallet\'s own account picker. The account you pick deploys the leaderboard and owns it.',
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
    id: 'preflight', title: 'Preflight: source, engine and name', who: 'Reads only',
    intro: 'Checks the embedded contract against the pinned SHA-256, confirms the embedded game engine can fly and verify a run for your wallet, and makes sure the contract name is free (or already holds this exact source).',
    action: 'Run preflight',
    run: async () => {
      const embedded = shaHex(contractSource);
      if (embedded !== PINNED_SHA) throw new Error(`Embedded contract is ${embedded}, not the pinned ${PINNED_SHA}. Rebuild the canary.`);
      const w = requireWallet();
      if (!state.run) { state.run = await makeRun(w.address); save(); }
      const existing = await chain.contractSource(contractId());
      let deployed: 'free' | 'ours' = 'free';
      if (existing !== null) {
        if (shaHex(existing) !== embedded && shaHex(existing.replace(/\r\n/g, '\n')) !== embedded) throw new Error(`${contractId()} already exists with different source. Choose another contract name.`);
        deployed = 'ours';
      }
      let balanceNote = '';
      try {
        const balance = await chain.balance(w.address);
        balanceNote = balance < 2_000_000n ? ` · WARNING balance ${stx(balance)} may be short (deploy + ~8 calls + ${stx(FUND_AMOUNT)} copycat funding)` : ` · balance ${stx(balance)}`;
      } catch { balanceNote = ' · balance could not be checked'; }
      step('preflight').data = { deployed };
      return `contract ${short(embedded)} ok · engine v${AB3.ENGINE_VERSION} (${short(__ENGINE_SHA__)}) flew a ${unb64(state.run.replay).length}-byte run scoring ${state.run.score.toLocaleString()} and verified it · ${deployed === 'ours' ? 'already deployed with this source' : 'name is free'}${balanceNote}`;
    }
  },
  {
    id: 'deploy', title: 'Deploy the leaderboard contract', who: 'Web wallet',
    intro: 'Your wallet asks you to deploy xtrata-arcade-scores-v2 (Clarity 4, the version wallets publish at; the contract suite passes at Clarity 4). The canary waits for the block and does not re-send if you reload.',
    action: 'Deploy contract',
    run: async () => {
      if (step('preflight').data.deployed === 'ours') return 'already deployed with the pinned source; nothing to send';
      const w = requireWallet();
      const rec = await runTx('deploy', 'deploy', async () => settle(await wallet.deployContract({ contractName: state.contractName, codeBody: contractSource, clarityVersion: 4, network, stxAddress: w.address, onProgress: progress })));
      return `deployed in block ${rec.block}`;
    }
  },
  {
    id: 'verify', title: 'Verify the deployed contract', who: 'Reads only',
    intro: 'Re-reads the deployed source and the starting state: you own it, it is not paused, and it can read the Bitcoin day.',
    action: 'Verify',
    run: async () => {
      let source: string | null = null;
      await eventually('Contract visibility', async () => { source = await chain.contractSource(contractId()); return source === null ? 'not visible yet' : null; });
      if (shaHex(source!) !== PINNED_SHA && shaHex(source!.replace(/\r\n/g, '\n')) !== PINNED_SHA) throw new Error('Deployed source differs from the pinned source.');
      const owner = asText(await read('get-owner'));
      if (owner !== state.deployer) throw new Error(`Owner is ${owner}, expected ${state.deployer}.`);
      const paused = asText(await read('is-paused'));
      if (paused !== 'false') throw new Error(`is-paused returned ${paused}.`);
      const period = asText(await read('current-period'));
      return `source matches · owner ${short(owner)} · paused false · current Bitcoin day ${period}`;
    }
  },
  {
    id: 'board', title: 'Open a canary board', who: 'Web wallet',
    intro: `Registers a board called "${CANARY_BOARD}" (higher wins, no fee). It is closed again at the end, so it never mixes with the real boards.`,
    action: 'Open canary board',
    run: async () => {
      const b = await readBoard(CANARY_BOARD);
      if (!b || b.enabled !== 'true') {
        await runTx('board', `set-board ${CANARY_BOARD}`, () => walletCall('set-board', [stringAsciiCV(CANARY_BOARD), uintCV(0), uintCV(MAX_SCORE), uintCV(0), uintCV(0), boolCV(false), boolCV(true)]));
      }
      await eventually('Canary board', async () => { const x = await readBoard(CANARY_BOARD); return x && x.enabled === 'true' ? null : `board ${x ? 'disabled' : 'missing'}`; });
      return `board "${CANARY_BOARD}" open · mode higher-wins · cap ${MAX_SCORE.toLocaleString()} · fee 0`;
    }
  },
  {
    id: 'submit', title: 'Submit a real run', who: 'Web wallet',
    intro: 'Submits the run the built-in pilot flew for your wallet in preflight, with its full replay. Then reads the board and the stored replay back, checks the on-chain hash, and re-plays it from the chain bytes.',
    action: 'Submit run',
    run: async () => {
      const run = state.run!;
      const bytes = unb64(run.replay);
      const entries = await topEntries(CANARY_BOARD);
      const mine = entries.find((e) => e.player === state.deployer);
      if (!mine || mine.score < BigInt(run.score)) {
        await runTx('submit', `submit-score ${run.score.toLocaleString()}`, () => walletCall('submit-score', [stringAsciiCV(CANARY_BOARD), uintCV(0), uintCV(run.score), stringAsciiCV('CANARY'), bufferCV(bytes)]));
      }
      await eventually('Board entry', async () => {
        const e = (await topEntries(CANARY_BOARD)).find((x) => x.player === state.deployer);
        return e && e.score === BigInt(run.score) ? null : e ? `score ${e.score}` : 'no entry';
      });
      const stored = inner(await read('get-replay', [stringAsciiCV(CANARY_BOARD), uintCV(0), principalCV(state.deployer!)])) as any;
      const chainBytes: Uint8Array = stored.buffer ?? hexBytes(cvToString(stored).replace(/^0x/, ''));
      const entry = (await topEntries(CANARY_BOARD)).find((x) => x.player === state.deployer)!;
      const hash = toHex(sha256(chainBytes));
      if (hash !== entry.hash) throw new Error(`Stored replay hashes to ${hash}, but the entry records ${entry.hash}.`);
      const v = await AB3.verifyReplay(chainBytes, { score: Number(entry.score), pilot: pilotOf(state.deployer!).hash, chunk: 6000 });
      if (!v.ok) throw new Error(`The replay stored on chain did not verify: ${v.reason}.`);
      return `rank #1 · score ${entry.score.toLocaleString()} · ${chainBytes.length}-byte replay stored, hash matches, re-played from chain: Verified`;
    }
  },
  {
    id: 'fund', title: 'Fund a copycat wallet', who: 'Web wallet',
    intro: `A throwaway wallet is created in this browser. Your wallet sends it ${stx(FUND_AMOUNT)} so it can pay the fee to try stealing your run in the next step. The rest is swept back.`,
    action: 'Send test funds',
    run: async () => {
      const hot = hotAddress();
      const have = await chain.balance(hot);
      if (have < FUND_AMOUNT) await runTx('fund', `fund copycat ${stx(FUND_AMOUNT - have)}`, () => walletTransfer(hot, FUND_AMOUNT - have, 'arcade canary'));
      await eventually('Copycat funding', async () => { const b = await chain.balance(hot); return b >= FUND_AMOUNT ? null : `balance ${stx(b)}`; });
      return `copycat ${hot} holds ${stx(await chain.balance(hot))}`;
    }
  },
  {
    id: 'copy', title: 'Copied run is refused', who: 'Copycat wallet (signed in this page)',
    intro: 'The copycat submits your exact replay bytes with a higher claimed score. The contract must refuse it with (err u113) because the replay names you as its pilot. A refused transaction still pays its small fee.',
    action: 'Try to steal the run',
    run: async () => {
      const run = state.run!;
      const hot = hotAddress();
      const [address, name] = contractId().split('.');
      await runTx('copy', 'copycat submit-score', async () => {
        const nonce = await chain.nonce(hot);
        const tx = await makeContractCall({ contractAddress: address, contractName: name, functionName: 'submit-score',
          functionArgs: [stringAsciiCV(CANARY_BOARD), uintCV(0), uintCV(run.score + 1000), stringAsciiCV('THIEF'), bufferCV(unb64(run.replay))],
          senderKey: hotKey(), network: chain.stacks, nonce, fee: COPY_TX_FEE, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: [] });
        return chain.broadcast(tx);
      }, '(err u113)');
      const entries = await topEntries(CANARY_BOARD);
      if (entries.some((e) => e.player === hot)) throw new Error('The copycat appears on the board.');
      return `refused on chain with (err u113) · the board still shows only your entry`;
    }
  },
  {
    id: 'sweep', title: 'Sweep the copycat back', who: 'Copycat wallet (signed in this page)',
    intro: 'Returns what is left in the throwaway wallet to your wallet.',
    action: 'Sweep back',
    run: async () => {
      const hot = hotAddress();
      const balance = await chain.balance(hot);
      if (balance > SWEEP_TX_FEE) {
        await runTx('sweep', `sweep ${stx(balance - SWEEP_TX_FEE)}`, async () => {
          const nonce = await chain.nonce(hot);
          const tx = await makeSTXTokenTransfer({ recipient: state.deployer!, amount: balance - SWEEP_TX_FEE, senderKey: hotKey(), network: chain.stacks, nonce, fee: SWEEP_TX_FEE, memo: 'arcade canary sweep', anchorMode: AnchorMode.Any });
          return chain.broadcast(tx);
        });
      }
      return `copycat balance now ${stx(await chain.balance(hot))}`;
    }
  },
  {
    id: 'void', title: 'Void and bar, then lift the bar', who: 'Web wallet · 2 signatures',
    intro: 'Exercises the owner tool for replays that fail verification: voids your canary entry (which also bars your wallet from this board), checks it, then lifts the bar again.',
    action: 'Void and restore',
    run: async () => {
      const me = principalCV(state.deployer!);
      if ((await topEntries(CANARY_BOARD)).some((e) => e.player === state.deployer)) {
        await runTx('void', 'void-entry', () => walletCall('void-entry', [stringAsciiCV(CANARY_BOARD), uintCV(0), me, stringAsciiCV('deployment canary')]));
      }
      await eventually('Void', async () => {
        const gone = !(await topEntries(CANARY_BOARD)).some((e) => e.player === state.deployer);
        const banned = asText(await read('is-banned', [stringAsciiCV(CANARY_BOARD), me]));
        return gone && (banned === 'true' || step('void').txs.some((t) => t.label === 'set-banned false' && t.pass)) ? null : `entry ${gone ? 'gone' : 'present'}, banned ${banned}`;
      });
      const replay = asText(await read('get-replay', [stringAsciiCV(CANARY_BOARD), uintCV(0), me]));
      if (replay !== 'none') throw new Error('The voided entry\'s replay is still stored.');
      if (asText(await read('is-banned', [stringAsciiCV(CANARY_BOARD), me])) === 'true') {
        await runTx('void', 'set-banned false', () => walletCall('set-banned', [stringAsciiCV(CANARY_BOARD), me, boolCV(false)]));
      }
      await eventually('Lift bar', async () => { const b = asText(await read('is-banned', [stringAsciiCV(CANARY_BOARD), me])); return b === 'false' ? null : `banned ${b}`; });
      return 'entry voided, replay deleted, wallet barred then restored';
    }
  },
  {
    id: 'close', title: 'Close the canary board', who: 'Web wallet',
    intro: 'Disables the canary board so nothing more can be submitted to it.',
    action: 'Close board',
    run: async () => {
      const b = await readBoard(CANARY_BOARD);
      if (b && b.enabled === 'true') await runTx('close', `disable ${CANARY_BOARD}`, () => walletCall('set-board-enabled', [stringAsciiCV(CANARY_BOARD), boolCV(false)]));
      await eventually('Close', async () => { const x = await readBoard(CANARY_BOARD); return x && x.enabled === 'false' ? null : `enabled ${x?.enabled}`; });
      return 'canary board closed · the contract is deployed and proven';
    }
  },
  {
    id: 'production', title: 'Register the production boards', who: 'Web wallet · 2 signatures', optional: true,
    intro: 'Only once Astro Blaster 3 is inscribed: enter its inscription id below. Registers "astro3" (campaign) and "astro3-daily" with that engine id, no fee and a 10 billion score cap. Existing identical boards are skipped.',
    action: 'Register boards',
    run: async () => {
      const id = state.engineId.trim();
      if (!/^\d+$/.test(id) || id === '0') throw new Error('Enter the Astro Blaster 3 inscription id first.');
      for (const [board, daily] of [['astro3', false], ['astro3-daily', true]] as const) {
        const b = await readBoard(board);
        const same = b && b.mode === '0' && b.maxScore === MAX_SCORE.toString() && b.fee === '0' && b.engineId === id && b.daily === String(daily) && b.enabled === 'true';
        if (!same) await runTx('production', `set-board ${board}`, () => walletCall('set-board', [stringAsciiCV(board), uintCV(0), uintCV(MAX_SCORE), uintCV(0), uintCV(BigInt(id)), boolCV(daily), boolCV(true)]));
      }
      await eventually('Production boards', async () => {
        const a = await readBoard('astro3'); const d = await readBoard('astro3-daily');
        return a?.engineId === id && d?.engineId === id && a.enabled === 'true' && d.enabled === 'true' ? null : 'boards not set yet';
      });
      return `astro3 and astro3-daily open · engine inscription #${id} · ready for players`;
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
const required = STEPS.filter((s) => !s.optional);
const unlocked = (index: number) => {
  const s = STEPS[index];
  if (s.optional) return step('verify').status === 'pass';
  return STEPS.slice(0, index).filter((x) => !x.optional).every((x) => step(x.id).status === 'pass');
};
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
        el('span', { class: 'step__number' }, s.optional ? '+' : String(i + 1)),
        el('div', {}, el('h2', {}, s.title), el('p', { class: 'who' }, s.who)),
        el('span', { class: 'badge', 'data-tone': tone }, st.status === 'todo' ? (open ? (s.optional ? 'optional' : 'ready') : 'locked') : st.status)),
      el('div', { class: 'step__body' },
        el('p', {}, s.intro),
        s.id === 'production' ? el('label', { class: 'inline' }, 'Astro Blaster 3 inscription id ',
          el('input', { id: 'engine-id', inputmode: 'numeric', value: state.engineId, onchange: (e: Event) => { state.engineId = (e.target as HTMLInputElement).value.trim(); save(); } })) : null,
        st.note ? el('p', { class: `note ${st.status}` }, st.note) : null,
        st.txs.length ? el('ul', { class: 'txs' }, st.txs.map((t) => el('li', {}, `${t.label} — ${t.status}${t.result ? ` ${t.result}` : ''} `, el('a', { href: chain.txUrl(t.txid), target: '_blank', rel: 'noopener' }, short(t.txid))))) : null,
        el('div', { class: 'actions' },
          el('button', { class: 'button', type: 'button', 'data-step': s.id, disabled: !open || busy || blockedByWallet, onclick: () => void execute(s) },
            st.status === 'pass' ? `Re-check · ${s.action}` : s.action),
          blockedByWallet && open ? el('span', { class: 'hint' }, 'Reconnect your wallet in step 1 to continue.') : null)));
  }));
  const passed = required.filter((s) => step(s.id).status === 'pass').length;
  $('#summary').textContent = `${passed} of ${required.length} required steps passed`;
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
  ($('#network') as HTMLSelectElement).value = network;
  const name = $('#contract-name') as HTMLInputElement;
  const locked = Object.entries(state.steps).some(([id, s]) => id !== 'connect' && id !== 'preflight' && s.status === 'pass');
  name.value = state.contractName; name.disabled = locked;
  $('#wallet').textContent = connected ? `${connected.label} · ${short(connected.address)}` : state.deployer ? `run owner ${short(state.deployer)} · not connected` : 'not connected';
  $('#hot').textContent = `${hotAddress()} (key kept in this browser only)`;
  $('#target').textContent = state.deployer ? contractId() : `<your address>.${state.contractName}`;
  $('#disconnect').toggleAttribute('hidden', !connected);
};

const bind = () => {
  $('#build').textContent = `${__BUILD__} · contract sha256 ${__SOURCE_SHA__.slice(0, 16)}… · engine v${AB3.ENGINE_VERSION} ${__ENGINE_SHA__.slice(0, 12)}…`;
  $('#network').addEventListener('change', (e) => {
    network = (e.target as HTMLSelectElement).value as Net;
    try { localStorage.setItem('xtrata-arcade-canary:network', network); } catch { /* ignore */ }
    chain = new Chain(network); connected = null; void wallet.disconnect();
    load(); restoreLog(); renderHeader(); renderSteps();
  });
  $('#contract-name').addEventListener('change', (e) => {
    const v = (e.target as HTMLInputElement).value.trim();
    if (!/^[a-zA-Z][a-zA-Z0-9-]{0,39}$/.test(v)) { status('Contract names start with a letter and use letters, digits and dashes (max 40).', 'error'); renderHeader(); return; }
    if (v !== DEFAULT_NAME) log('warn', `Deploying as ${v}: the game and /arcade/submit expect ${DEFAULT_NAME}; use another name only for a rehearsal.`);
    state.contractName = v; state.steps = { connect: step('connect') }; save(); renderHeader(); renderSteps();
  });
  $('#disconnect').addEventListener('click', async () => { await wallet.disconnect(); connected = null; step('connect').status = 'todo'; save(); renderHeader(); renderSteps(); log('info', 'Wallet disconnected.'); });
  $('#export').addEventListener('click', () => {
    const report = { ...state, run: state.run ? { score: state.run.score, bytes: unb64(state.run.replay).length } : null, build: __BUILD__, network, contractSha256: __SOURCE_SHA__, engineSha256: __ENGINE_SHA__, contract: state.deployer ? contractId() : null, copycat: hotAddress() };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `xtrata-arcade-canary-${network}-${Date.now()}.json` }) as HTMLAnchorElement;
    a.click(); URL.revokeObjectURL(a.href);
  });
  $('#rescue').addEventListener('click', async () => {
    if (busy) return;
    if (!state.deployer) { status('Connect first so the canary knows where to sweep.', 'error'); return; }
    busy = true;
    try {
      const hot = hotAddress();
      const balance = await chain.balance(hot);
      if (balance <= SWEEP_TX_FEE) { status(`Copycat holds ${stx(balance)}; nothing to sweep.`, 'ok'); return; }
      const nonce = await chain.nonce(hot);
      const tx = await makeSTXTokenTransfer({ recipient: state.deployer, amount: balance - SWEEP_TX_FEE, senderKey: hotKey(), network: chain.stacks, nonce, fee: SWEEP_TX_FEE, memo: 'arcade canary sweep', anchorMode: AnchorMode.Any });
      log('info', `Recovery sweep of ${stx(balance - SWEEP_TX_FEE)} to ${short(state.deployer)}`, await chain.broadcast(tx));
      status('Recovery sweep broadcast.', 'ok');
    } catch (error) { status(`Recovery sweep failed: ${error instanceof Error ? error.message : String(error)}`, 'error'); }
    finally { busy = false; }
  });
  $('#forget').addEventListener('click', async () => {
    let hotBalance = 0n;
    try { hotBalance = await chain.balance(hotAddress()); } catch { status('Could not check the copycat balance, so progress was kept. Try again.', 'error'); return; }
    if (hotBalance > SWEEP_TX_FEE && !confirm(`The copycat still holds ${stx(hotBalance)}. Forgetting progress keeps its key, so you can still sweep it later. Continue?`)) return;
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
wallet.setConnectMessage('Xtrata arcade leaderboard canary');
if (location.protocol === 'file:') $('#file-banner').removeAttribute('hidden');
if (state.steps.connect?.status === 'pass') state.steps.connect.status = 'todo'; // wallet connection never survives a reload
bind(); restoreLog(); renderHeader(); renderSteps();
