import { sha256 } from '@noble/hashes/sha256';
import {
  AnchorMode,
  bufferCV,
  ClarityType,
  contractPrincipalCV,
  falseCV,
  trueCV,
  cvToString,
  FungibleConditionCode,
  getAddressFromPrivateKey,
  listCV,
  makeContractCall,
  makeRandomPrivKey,
  makeStandardSTXPostCondition,
  makeSTXTokenTransfer,
  makeUnsignedContractCall,
  makeUnsignedSTXTokenTransfer,
  PostConditionMode,
  privateKeyToString,
  stringAsciiCV,
  TransactionVersion,
  uintCV,
  type ClarityValue,
  type PostCondition
} from '@stacks/transactions';
import helperSource from '../../contracts/live/xtrata-collection-mint-v1.7.clar';
import { Chain, toHex } from './chain';
import * as wallet from './wallet';
import type { Net, ProviderInfo } from './wallet';

declare const __BUILD__: string;
declare const __SOURCE_SHA__: string;

const PINNED_SHA = 'd76e697e3d26fc828af21f046881b05e518ef456e86d863181672b55e2c16999';
const MAINNET_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const CORE_REFERENCES = 9; // ALLOWED-XTRATA-CONTRACT + 8 pinned static calls
const MIME = 'text/plain';
const TOKEN_URI = 'data:text/plain,xtrata-collection-v1-7-canary';
const MINT_TX_FEE = 20_000n;
const SWEEP_TX_FEE = 5_000n;
const FUND_BUFFER = 50_000n;
const EXPECTED_READS: Record<string, string> = { 'get-fee-model': 'fixed-collector-price', 'get-max-small-mint-chunks': '32' };

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
    default: return cvToString(v);
  }
};
const asBig = (cv: ClarityValue) => BigInt(asText(cv));
const field = (cv: ClarityValue, key: string) => (inner(cv) as any).data[key] as ClarityValue;

// ---------- state ----------
type TxRec = { label: string; txid: string; status: string; result?: string; pass?: boolean; block?: number };
type StepState = { status: 'todo' | 'running' | 'pass' | 'fail'; note?: string; data: Record<string, any>; txs: TxRec[] };
type State = {
  version: 1;
  contractName: string;
  core: string;
  priceMicro: string;
  deployer?: string;
  file?: { text: string; hash: string; size: number };
  steps: Record<string, StepState>;
  log: { t: string; level: string; msg: string; txid?: string }[];
};

let network: Net = (localStorage.getItem('xtrata-v17-canary:network') as Net) === 'testnet' ? 'testnet' : 'mainnet';
let chain = new Chain(network);
let state!: State;
let connected: { address: string; publicKey: string | null; label: string } | null = null;
let busy = false;

const stateKey = () => `xtrata-v17-canary:v1:${network}`;
const hotKeyName = () => `xtrata-v17-canary:hot:${network}`;
const today = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');
const freshState = (): State => ({
  version: 1,
  contractName: `xtrata-collection-v1-7-canary-${today()}`,
  core: network === 'mainnet' ? MAINNET_CORE : '',
  priceMicro: '300000',
  steps: {},
  log: []
});
const load = () => {
  try { const raw = localStorage.getItem(stateKey()); state = raw ? { ...freshState(), ...JSON.parse(raw) } : freshState(); } catch { state = freshState(); }
};
const save = () => { try { localStorage.setItem(stateKey(), JSON.stringify(state)); } catch { /* storage unavailable */ } };
const step = (id: string): StepState => (state.steps[id] ??= { status: 'todo', data: {}, txs: [] });
const contractId = () => `${state.deployer}.${state.contractName}`;
const price = () => BigInt(state.priceMicro);

const log = (level: 'info' | 'ok' | 'warn' | 'error', msg: string, txid?: string) => {
  const line = el('div', { class: `log-line ${level}` }, el('time', {}, new Date().toLocaleTimeString()), ' ', msg,
    txid ? [' ', el('a', { href: chain.txUrl(txid), target: '_blank', rel: 'noopener' }, short(txid))] : null);
  $('#log').prepend(line);
  state.log.unshift({ t: new Date().toISOString(), level, msg, txid });
  state.log = state.log.slice(0, 400);
  save();
  (level === 'error' ? console.warn : console.info)('[v17-canary]', msg, txid ?? '');
};
const status = (text: string, tone: 'info' | 'ok' | 'warn' | 'error' = 'info') => { const s = $('#status'); s.textContent = text; s.dataset.tone = tone; };

// ---------- hot wallet (throwaway collector) ----------
const hotKey = () => {
  let key: string | null = null;
  try { key = localStorage.getItem(hotKeyName()); } catch { /* ignore */ }
  if (!key) {
    key = privateKeyToString(makeRandomPrivKey());
    if (key.length === 64) key += '01'; // compressed
    try { localStorage.setItem(hotKeyName(), key); } catch { /* ignore */ }
  }
  return key;
};
const hotAddress = () => getAddressFromPrivateKey(hotKey(), network === 'mainnet' ? TransactionVersion.Mainnet : TransactionVersion.Testnet);

// ---------- source ----------
const sourceFor = () => {
  if (network === 'mainnet') return helperSource;
  if (!/^ST[0-9A-Z]{30,}\.[a-zA-Z][\w-]*$/.test(state.core)) throw new Error('Enter the testnet Xtrata core contract id (ST….name) first.');
  return helperSource.split(MAINNET_CORE).join(state.core);
};
const coreParts = () => state.core.split('.') as [string, string];

// ---------- web-wallet actions ----------
const requireWallet = () => {
  if (!connected) throw new Error('Connect your wallet first (step 1).');
  if (state.deployer && connected.address !== state.deployer) throw new Error(`The wallet is connected as ${connected.address}, but this run belongs to ${state.deployer}. Switch accounts and reconnect.`);
  return connected;
};
const progress = (stage: string) => { if (['account-read', 'account-reconnect', 'signing-request'].includes(stage)) log('info', `wallet: ${stage.replace('-', ' ')}`); };
/** Some wallets sign but only hand back the raw tx; broadcast it ourselves (harmless if already broadcast). */
const settle = async (result: wallet.TxResult) => {
  if (result.txRaw && result.txRaw.length > 128) { try { await chain.broadcastRaw(result.txRaw); } catch { /* already known */ } }
  return result.txId;
};
const unsignedCall = async (fn: string, args: ClarityValue[], pcs: PostCondition[]) => {
  const w = requireWallet();
  const [address, name] = contractId().split('.');
  const nonce = await chain.nonce(w.address);
  const build = (fee: bigint) => makeUnsignedContractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
    publicKey: w.publicKey!, network: chain.stacks, nonce, fee, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: pcs });
  const size = (await build(20_000n)).serialize().length;
  return toHex((await build(BigInt(Math.max(20_000, Math.ceil(size * 1.2))))).serialize());
};
const walletCall = async (fn: string, args: ClarityValue[], pcs: PostCondition[] = []) => {
  const w = requireWallet();
  const [address, name] = contractId().split('.');
  const result = await wallet.contractCall({ contractAddress: address, contractName: name, functionName: fn, functionArgs: args,
    postConditions: pcs, postConditionMode: PostConditionMode.Deny, network, stxAddress: w.address, onProgress: progress,
    buildUnsigned: w.publicKey ? () => unsignedCall(fn, args, pcs) : undefined });
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
    s.txs = s.txs.filter((t) => t !== rec); save(); // allow a clean retry
    throw new Error(`${label} failed on chain: ${tx.tx_status} ${rec.result}`);
  }
  log('ok', `${label}: confirmed ${rec.result}`, rec.txid);
  return { ...rec, tx };
};

// ---------- reads ----------
/**
 * A confirmed tx can be indexed before the node that answers read-only calls
 * has the block, so a read straight after confirmation may still show the old
 * state. Re-read until the expected state appears (up to ~90s) before calling
 * it a failure. `check` returns null when satisfied, else what it saw.
 */
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
const read = (fn: string, args: ClarityValue[] = [], sender?: string) => chain.read(contractId(), fn, args, sender);
const coreRead = (fn: string, args: ClarityValue[] = []) => chain.read(state.core, fn, args);
const coreFees = async () => {
  const [begin, chunk, batch, seal] = await Promise.all(['get-begin-fee-unit', 'get-upload-chunk-fee-unit', 'get-upload-batch-fee-unit', 'get-seal-fee-unit'].map((f) => coreRead(f).then(asBig)));
  const chunks = 1n;
  return { begin, chunk, batch, seal, total: begin + seal + chunk * chunks };
};
const makeTestFile = () => {
  const nonce = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const text = `Xtrata collection helper v1.7 canary\nnetwork: ${network}\ncontract: ${state.contractName}\ncreated: ${new Date().toISOString()}\nnonce: ${nonce}\n`;
  const bytes = new TextEncoder().encode(text);
  const hash = toHex(sha256(new Uint8Array([...new Uint8Array(32), ...bytes]))); // running hash of one chunk
  return { text, hash, size: bytes.length };
};

// ---------- steps ----------
type Step = { id: string; title: string; who: string; intro: string; action: string; run: () => Promise<string | void> };

const STEPS: Step[] = [
  {
    id: 'connect', title: 'Connect your web wallet', who: 'Web wallet',
    intro: 'Opens the wallet chooser, then the wallet\'s own account picker. The account you pick deploys the helper and owns it for the rest of the run.',
    action: 'Connect wallet',
    run: async () => {
      const result = await wallet.connect(network, chooseWallet);
      if (!result.isConnected) {
        if (result.wrongNetwork) throw new Error(`The wallet returned a ${result.wrongNetwork} address (${result.address}). Switch the wallet to ${network} and connect again.`);
        throw new Error('Connection was cancelled or returned no Stacks address.');
      }
      if (state.deployer && state.deployer !== result.address && Object.values(state.steps).some((s) => s.status === 'pass' && s !== state.steps.connect)) {
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
    id: 'preflight', title: 'Preflight: source, core and fees', who: 'Reads only',
    intro: 'Checks the helper source against the pinned SHA-256, reads the core\'s live fee units, prices the canary\'s one-chunk test file, and makes sure the contract name is free (or already holds this exact source).',
    action: 'Run preflight',
    run: async () => {
      const embedded = shaHex(helperSource);
      if (embedded !== PINNED_SHA) throw new Error(`Embedded helper source is ${embedded}, not the pinned ${PINNED_SHA}. Rebuild the canary.`);
      const count = helperSource.split(MAINNET_CORE).length - 1;
      if (count !== CORE_REFERENCES) throw new Error(`Expected ${CORE_REFERENCES} core references in the source, found ${count}.`);
      const code = sourceFor();
      const paused = asText(await coreRead('is-paused')) === 'true';
      if (paused) throw new Error(`${state.core} is paused. A new helper cannot inscribe until the core admin allows it (set-allowed-caller) or unpauses.`);
      const fees = await coreFees();
      if (price() < fees.total) throw new Error(`Price ${stx(price())} is below the ${stx(fees.total)} inscription cost of the test file; v1.7 would refuse the mint (u125). Raise the price.`);
      const existing = await chain.contractSource(contractId());
      let deployed: 'free' | 'ours' = 'free';
      if (existing !== null) {
        if (shaHex(existing) !== shaHex(code) && shaHex(existing.replace(/\r\n/g, '\n')) !== shaHex(code)) throw new Error(`${contractId()} already exists with different source. Choose another contract name.`);
        deployed = 'ours';
      }
      if (!state.file) { state.file = makeTestFile(); save(); }
      const known = inner(await coreRead('get-id-by-hash', [bufferCV(hexBytes(state.file.hash))]));
      if (known.type !== ClarityType.OptionalNone && !step('mint').txs.some((t) => t.pass)) {
        state.file = makeTestFile(); save();
        log('warn', 'Test file was already inscribed; generated a fresh one.');
      }
      let balanceNote = '';
      try {
        const balance = await chain.balance(state.deployer!);
        const needed = price() + FUND_BUFFER + 1_000_000n;
        balanceNote = balance < needed ? ` · WARNING balance ${stx(balance)} may be short (deploy fee + ${stx(price() + FUND_BUFFER)} test funding)` : ` · balance ${stx(balance)}`;
      } catch { balanceNote = ' · balance could not be checked'; }
      step('preflight').data = { sourceSha: shaHex(code), fees: Object.fromEntries(Object.entries(fees).map(([k, v]) => [k, v.toString()])), deployed };
      return `source ${short(shaHex(code))} ok · fees begin ${stx(fees.begin)} + seal ${stx(fees.seal + fees.chunk)} = ${stx(fees.total)} · payout per mint ${stx(price() - fees.total)} · ${deployed === 'ours' ? 'already deployed with this source' : 'name is free'}${balanceNote}`;
    }
  },
  {
    id: 'deploy', title: 'Deploy the helper', who: 'Web wallet',
    intro: 'Your wallet asks you to deploy the v1.7 helper (Clarity 4). The canary waits for the block and does not re-send if you reload.',
    action: 'Deploy contract',
    run: async () => {
      if (step('preflight').data.deployed === 'ours') return 'already deployed with the pinned source; nothing to send';
      const code = sourceFor();
      const w = requireWallet();
      const rec = await runTx('deploy', 'deploy', async () => settle(await wallet.deployContract({ contractName: state.contractName, codeBody: code, clarityVersion: 4, network, stxAddress: w.address, onProgress: progress })));
      return `deployed in block ${rec.block}`;
    }
  },
  {
    id: 'verify', title: 'Verify the deployed contract', who: 'Reads only',
    intro: 'Re-reads the deployed source and the helper\'s starting state: pinned core, fixed-price fee model, owner, paused, no supply yet.',
    action: 'Verify',
    run: async () => {
      const source = await chain.contractSource(contractId());
      if (source === null) throw new Error('The contract is not visible yet. Wait a block and retry.');
      if (shaHex(source) !== shaHex(sourceFor()) && shaHex(source.replace(/\r\n/g, '\n')) !== shaHex(sourceFor())) throw new Error('Deployed source differs from the pinned source.');
      const core = asText(await read('get-locked-core-contract'));
      if (core !== state.core) throw new Error(`Helper is locked to ${core}, expected ${state.core}.`);
      for (const [fn, want] of Object.entries(EXPECTED_READS)) {
        const got = asText(await read(fn));
        if (got !== want) throw new Error(`${fn} returned ${got}, expected ${want}.`);
      }
      const owner = asText(await read('get-owner'));
      if (owner !== state.deployer) throw new Error(`Owner is ${owner}, expected ${state.deployer}.`);
      return `source matches · core ${short(core)} · fee model fixed-collector-price · owner ${short(owner)} · paused ${asText(await read('is-paused'))} · max supply ${asText(await read('get-max-supply'))}`;
    }
  },
  {
    id: 'configure', title: 'Configure a one-file collection', who: 'Web wallet · up to 5 signatures',
    intro: 'Sets max supply to 1 (permanent), registers the test file, sets the fixed price, sends 100% of the payout to the artist recipient (you), and opens minting. Anything already set on chain is skipped.',
    action: 'Configure',
    run: async () => {
      const file = state.file!;
      const hash = bufferCV(hexBytes(file.hash));
      const supply = asBig(await read('get-max-supply'));
      if (supply === 0n) await runTx('configure', 'set-max-supply 1', () => walletCall('set-max-supply', [uintCV(1)]));
      else if (supply !== 1n) log('warn', `max supply is already ${supply}; continuing`);
      if (asText(await read('get-registered-token-uri', [hash])) === 'none') await runTx('configure', 'register test file', () => walletCall('set-registered-token-uri', [hash, stringAsciiCV(TOKEN_URI)]));
      if (asBig(await read('get-mint-price')) !== price()) await runTx('configure', `set-mint-price ${stx(price())}`, () => walletCall('set-mint-price', [uintCV(price())]));
      const splits = await read('get-splits');
      if (asText(field(splits, 'artist')) !== '10000') await runTx('configure', 'set-splits 100/0/0', () => walletCall('set-splits', [uintCV(10000), uintCV(0), uintCV(0)]));
      if (asText(await read('is-paused')) === 'true') await runTx('configure', 'set-paused false', () => walletCall('set-paused', [falseCV()]));
      await eventually('Configuration', async () => {
        const q = await read('get-mint-quote', [uintCV(1)]);
        const t = asBig(field(q, 'collector-total'));
        const paused = asText(await read('is-paused'));
        return t === price() && paused === 'false' ? null : `collector-total ${stx(t)}, paused ${paused}`;
      });
      const quote = await read('get-mint-quote', [uintCV(1)]);
      const total = asBig(field(quote, 'collector-total'));
      const payout = asBig(field(quote, 'payout'));
      if (asText(field(quote, 'covered')) !== 'true') throw new Error('get-mint-quote says the price does not cover the fees.');
      if (total !== price()) throw new Error(`get-mint-quote collector-total ${stx(total)} ≠ price ${stx(price())}.`);
      step('configure').data = { payout: payout.toString() };
      return `supply ${asText(await read('get-max-supply'))} · price ${stx(price())} · quote: collector pays ${stx(total)}, payout ${stx(payout)} · minting open`;
    }
  },
  {
    id: 'fund', title: 'Fund the test collector', who: 'Web wallet',
    intro: 'A throwaway collector key is created in this browser. Your wallet sends it the price plus a small fee buffer; the leftover is swept back in step 8.',
    action: 'Send test funds',
    run: async () => {
      const hot = hotAddress();
      const needed = price() + FUND_BUFFER;
      const have = await chain.balance(hot);
      if (have < needed) await runTx('fund', `fund collector ${stx(needed - have)}`, () => walletTransfer(hot, needed - have, 'xtrata v1.7 canary'));
      await eventually('Collector funding', async () => { const b = await chain.balance(hot); return b >= needed ? null : `balance ${stx(b)}`; });
      const now = await chain.balance(hot);
      return `collector ${hot} holds ${stx(now)}`;
    }
  },
  {
    id: 'mint', title: 'Test mint at the fixed price', who: 'Test collector (signed in this page)',
    intro: 'The test collector mints the file with mint-small-single-tx. A post-condition requires it to send EXACTLY the price, so a confirmed mint proves the fixed collector price on chain.',
    action: 'Mint',
    run: async () => {
      const hot = hotAddress();
      const file = state.file!;
      const [coreAddress, coreName] = coreParts();
      const bytes = new TextEncoder().encode(file.text);
      const args = [contractPrincipalCV(coreAddress, coreName), bufferCV(hexBytes(file.hash)), stringAsciiCV(MIME), uintCV(file.size), listCV([bufferCV(bytes)]), stringAsciiCV(TOKEN_URI)];
      const pcs = [makeStandardSTXPostCondition(hot, FungibleConditionCode.Equal, price())];
      const [address, name] = contractId().split('.');
      const rec: any = await runTx('mint', 'mint-small-single-tx', async () => {
        const nonce = await chain.nonce(hot);
        const tx = await makeContractCall({ contractAddress: address, contractName: name, functionName: 'mint-small-single-tx', functionArgs: args,
          senderKey: hotKey(), network: chain.stacks, nonce, fee: MINT_TX_FEE, anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Deny, postConditions: pcs });
        return chain.broadcast(tx);
      });
      const tokenId = (rec.result ?? '').match(/\(ok u(\d+)\)/)?.[1];
      const tx = rec.tx ?? await chain.tx(rec.txid);
      const out = (tx?.events ?? []).filter((e: any) => e.event_type === 'stx_asset' && e.asset?.asset_event_type === 'transfer' && e.asset.sender === hot);
      const spent = out.reduce((sum: bigint, e: any) => sum + BigInt(e.asset.amount), 0n);
      await eventually('Mint counters', async () => {
        const minted = asBig(await read('get-minted-count'));
        const reserved = asBig(await read('get-reserved-count'));
        return minted === 1n && reserved === 0n ? null : `minted ${minted}, reserved ${reserved} (expected 1 and 0)`;
      });
      if (tokenId) {
        await eventually(`Token #${tokenId} owner`, async () => {
          const owner = asText(await coreRead('get-owner', [uintCV(BigInt(tokenId))]));
          return owner === hot ? null : `owner ${owner}`;
        });
      }
      step('mint').data = { tokenId, spent: spent.toString(), transfers: out.map((e: any) => ({ to: e.asset.recipient, amount: e.asset.amount })) };
      if (out.length && spent !== price()) throw new Error(`Collector sent ${stx(spent)}, expected exactly ${stx(price())}.`);
      return `token #${tokenId ?? '?'} · collector paid ${out.length ? stx(spent) : `${stx(price())} (post-condition)`} in ${out.length} transfer${out.length === 1 ? '' : 's'} · minted 1/1`;
    }
  },
  {
    id: 'sweep', title: 'Sweep the test collector back', who: 'Test collector (signed in this page)',
    intro: 'Returns what is left in the throwaway collector to your wallet.',
    action: 'Sweep back',
    run: async () => {
      const hot = hotAddress();
      const balance = await chain.balance(hot);
      if (balance > SWEEP_TX_FEE) {
        await runTx('sweep', `sweep ${stx(balance - SWEEP_TX_FEE)}`, async () => {
          const nonce = await chain.nonce(hot);
          const tx = await makeSTXTokenTransfer({ recipient: state.deployer!, amount: balance - SWEEP_TX_FEE, senderKey: hotKey(), network: chain.stacks, nonce, fee: SWEEP_TX_FEE, memo: 'v1.7 canary sweep', anchorMode: AnchorMode.Any });
          return chain.broadcast(tx);
        });
      }
      return `collector balance now ${stx(await chain.balance(hot))}`;
    }
  },
  {
    id: 'close', title: 'Pause the helper again', who: 'Web wallet',
    intro: 'Leaves the canary collection paused. It is sold out (1/1), so nothing else can be minted either way.',
    action: 'Pause',
    run: async () => {
      if (asText(await read('is-paused')) === 'false') await runTx('close', 'set-paused true', () => walletCall('set-paused', [trueCV()]));
      await eventually('Pause', async () => { const p = asText(await read('is-paused')); return p === 'true' ? null : `paused ${p}`; });
      return `paused ${asText(await read('is-paused'))} · minted ${asText(await read('get-minted-count'))}/${asText(await read('get-max-supply'))} · canary complete`;
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
          el('button', { class: 'button', type: 'button', disabled: !open || busy || blockedByWallet, onclick: () => void execute(s) },
            st.status === 'pass' ? `Re-check · ${s.action}` : s.action),
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
  ($('#network') as HTMLSelectElement).value = network;
  const name = $('#contract-name') as HTMLInputElement;
  const core = $('#core') as HTMLInputElement;
  const priceInput = $('#price') as HTMLInputElement;
  const locked = Object.entries(state.steps).some(([id, s]) => id !== 'connect' && s.status === 'pass');
  name.value = state.contractName; name.disabled = locked;
  core.value = state.core; core.disabled = locked || network === 'mainnet';
  priceInput.value = (Number(state.priceMicro) / 1e6).toString(); priceInput.disabled = step('configure').status === 'pass' || step('mint').txs.length > 0;
  $('#wallet').textContent = connected ? `${connected.label} · ${short(connected.address)}` : state.deployer ? `run owner ${short(state.deployer)} · not connected` : 'not connected';
  $('#hot').textContent = `${hotAddress()} (key kept in this browser only)`;
  $('#disconnect').toggleAttribute('hidden', !connected);
};

const bind = () => {
  $('#build').textContent = `${__BUILD__} · helper sha256 ${__SOURCE_SHA__.slice(0, 16)}…`;
  $('#network').addEventListener('change', (e) => {
    network = (e.target as HTMLSelectElement).value as Net;
    try { localStorage.setItem('xtrata-v17-canary:network', network); } catch { /* ignore */ }
    chain = new Chain(network); connected = null; void wallet.disconnect();
    load(); restoreLog(); renderHeader(); renderSteps();
  });
  $('#contract-name').addEventListener('change', (e) => {
    const v = (e.target as HTMLInputElement).value.trim();
    if (!/^[a-zA-Z][a-zA-Z0-9-]{0,39}$/.test(v)) { status('Contract names start with a letter and use letters, digits and dashes (max 40).', 'error'); renderHeader(); return; }
    state.contractName = v; state.steps = { connect: step('connect') }; state.file = undefined; save(); renderSteps();
  });
  $('#core').addEventListener('change', (e) => { state.core = (e.target as HTMLInputElement).value.trim(); save(); });
  $('#price').addEventListener('change', (e) => {
    const v = Number((e.target as HTMLInputElement).value);
    if (!Number.isFinite(v) || v <= 0) { status('Enter a price in STX.', 'error'); renderHeader(); return; }
    state.priceMicro = String(Math.round(v * 1e6)); if (step('preflight').status === 'pass') state.steps.preflight.status = 'todo'; save(); renderSteps();
  });
  $('#disconnect').addEventListener('click', async () => { await wallet.disconnect(); connected = null; step('connect').status = 'todo'; save(); renderHeader(); renderSteps(); log('info', 'Wallet disconnected.'); });
  $('#export').addEventListener('click', () => {
    const report = { ...state, build: __BUILD__, network, helperSha256: __SOURCE_SHA__, contract: state.deployer ? contractId() : null, collector: hotAddress() };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `xtrata-v17-canary-${network}-${Date.now()}.json` }) as HTMLAnchorElement;
    a.click(); URL.revokeObjectURL(a.href);
  });
  $('#rescue').addEventListener('click', async () => {
    if (busy) return;
    if (!state.deployer) { status('Connect first so the canary knows where to sweep.', 'error'); return; }
    busy = true;
    try {
      const hot = hotAddress();
      const balance = await chain.balance(hot);
      if (balance <= SWEEP_TX_FEE) { status(`Test collector holds ${stx(balance)}; nothing to sweep.`, 'ok'); return; }
      const nonce = await chain.nonce(hot);
      const tx = await makeSTXTokenTransfer({ recipient: state.deployer, amount: balance - SWEEP_TX_FEE, senderKey: hotKey(), network: chain.stacks, nonce, fee: SWEEP_TX_FEE, memo: 'v1.7 canary sweep', anchorMode: AnchorMode.Any });
      log('info', `Recovery sweep of ${stx(balance - SWEEP_TX_FEE)} to ${short(state.deployer)}`, await chain.broadcast(tx));
      status('Recovery sweep broadcast.', 'ok');
    } catch (error) { status(`Recovery sweep failed: ${error instanceof Error ? error.message : String(error)}`, 'error'); }
    finally { busy = false; }
  });
  $('#forget').addEventListener('click', async () => {
    let hotBalance = 0n;
    try { hotBalance = await chain.balance(hotAddress()); } catch { status('Could not check the test collector balance, so progress was kept. Try again.', 'error'); return; }
    if (hotBalance > SWEEP_TX_FEE && !confirm(`The test collector still holds ${stx(hotBalance)}. Forgetting progress keeps its key, so you can still sweep it later. Continue?`)) return;
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
wallet.setConnectMessage('Xtrata collection v1.7 canary');
if (location.protocol === 'file:') $('#file-banner').removeAttribute('hidden');
if (state.steps.connect?.status === 'pass') state.steps.connect.status = 'todo'; // wallet connection never survives a reload
bind(); restoreLog(); renderHeader(); renderSteps();
