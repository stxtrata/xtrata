/**
 * Web-wallet bridge for the collection v1.7 canary.
 *
 * A direct port of the wallet logic in the X Chess v2 canary (build
 * v6-2026-09-26), which is the known-good reference for deploying and signing
 * from Xverse and Leather. Rules (docs/WALLET-PLAYBOOK.md):
 *  - providers are detected and resolved on the TOP same-origin window (§5)
 *  - the chooser opens on every connect; Xverse gets wallet_disconnect first (§4)
 *  - wallet_connect names the network the canary is running on
 *  - Xverse preflight: cache (45s) → wallet_getAccount (30s cap) → wallet_connect,
 *    never stx_getAccounts (§3); an account that disagrees aborts
 *  - stx_callContract never carries `sender` (§2)
 *  - a network-mismatch rejection first tries a sign-only broadcast, then one
 *    disconnect/reconnect retry; user rejections are never retried (§2b)
 *  - every Xverse call runs under a 90s watchdog (§6)
 */
import {
  deserializeTransaction,
  PostConditionMode,
  serializeCV,
  serializePostCondition,
  type ClarityValue,
  type PostCondition
} from '@stacks/transactions';

export type Net = 'mainnet' | 'testnet';
export type Provider = {
  request?: (method: string, params?: unknown) => Promise<unknown>;
  transactionRequest?: (payload: string) => Promise<unknown>;
};
export type ProviderInfo = { id: string; name: string; icon?: string };
export type ConnectResult =
  | { isConnected: true; address: string; network: Net; publicKey: string | null }
  | { isConnected: false; wrongNetwork?: Net; address?: string };
export type TxResult = { txId: string; txRaw?: string };
export type Progress = (stage: string) => void;

const USER_CANCEL_CODES = new Set([4001, -31001]);
const XVERSE_SIGNING_IDS = ['XverseProviders.BitcoinProvider', 'xverseProviders.BitcoinProvider', 'BitcoinProvider'];
const RAW_TX_KEYS = ['txRaw', 'txHex', 'rawTx', 'rawTransaction', 'transaction', 'signedTransaction', 'hex', 'serializedTx'];
const NESTED_KEYS = ['result', 'data', 'payload', 'response', 'params'];
const ACCOUNT_CACHE_MS = 45_000;
const ACCOUNT_READ_TIMEOUT_MS = 30_000;
export const SIGNING_TIMEOUT_MS = 90_000;
export const ADDRESS_MISMATCH = 'WALLET_ADDRESS_MISMATCH';

// ---------- small helpers ----------
const strip0x = (v: string) => (/^0x/i.test(v) ? v.slice(2) : v);
const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
const big = (v: unknown) => (v === undefined || v === null ? undefined : typeof v === 'bigint' ? v.toString(10) : String(v).trim() || undefined);
const isStacksAddress = (v: string) => /^S[PMTN][0-9A-HJKMNP-TV-Z]{38,40}$/.test(v);
export const networkOfAddress = (address: string): Net | null => {
  const p = address.slice(0, 2).toUpperCase();
  return p === 'SP' || p === 'SM' ? 'mainnet' : p === 'ST' || p === 'SN' ? 'testnet' : null;
};

let selectedId: string | null = null;
let currentNetwork: Net = 'mainnet';
let connectMessage = 'Xtrata collection v1.7 canary';
export const setConnectMessage = (m: string) => { connectMessage = m; };

// ---------- provider discovery on the top window (§5) ----------
export const hostWindow = (): any => {
  try {
    const top = window.top;
    if (top && top !== window.self && top.location.origin === window.location.origin) return top;
  } catch { /* cross-origin parent */ }
  return window;
};
const byPath = (root: any, id: string) => (!root || !id ? undefined : id.split('.').reduce((o: any, k) => o?.[k], root));
const sameProvider = (a: ProviderInfo, b: ProviderInfo) => a.id === b.id || !!(a.name && b.name && a.name.toLowerCase() === b.name.toLowerCase());
const registered = (host: any): ProviderInfo[] => {
  if (!host) return [];
  const all = [...(host.btc_providers ?? []), ...(host.webbtc_providers ?? []), ...(host.webbtc_stx_providers ?? [])];
  return all.filter((p: ProviderInfo, i) => !!p?.id && all.findIndex((q: ProviderInfo) => sameProvider(q, p)) === i);
};
const isLeatherId = (id: string | null) => !!id && id.toLowerCase().includes('leather');
const isXverseId = (id: string | null) => !!id && id.toLowerCase().includes('xverse');
const isRegisteredXverse = (id: string | null) =>
  !!id && registered(hostWindow()).some((p) => p.id === id && (isXverseId(p.id) || p.name?.toLowerCase().includes('xverse')));

/** Xverse's registered request bridge (BitcoinProvider). */
export const xverseRpc = (): Provider | undefined => {
  const host = hostWindow();
  for (const p of registered(host).filter((p) => isXverseId(p.id) || p.name?.toLowerCase().includes('xverse'))) {
    const found = byPath(host, p.id);
    if (typeof found?.request === 'function') return found;
  }
  for (const id of XVERSE_SIGNING_IDS) {
    const found = byPath(host, id) ?? (host === window ? undefined : byPath(window, id));
    if (typeof found?.request === 'function') return found;
  }
  return undefined;
};
/** Xverse's dotted StacksProvider (the payment bridge, §1). */
const xverseDottedStacks = (): Provider | undefined => {
  const host = hostWindow();
  for (const id of ['XverseProviders.StacksProvider', 'xverseProviders.StacksProvider']) {
    const found = byPath(host, id) ?? (host === window ? undefined : byPath(window, id));
    if (found) return found;
  }
  return undefined;
};
const isXverse = (provider: Provider) => {
  if (isXverseId(selectedId) || isRegisteredXverse(selectedId)) return true;
  const host = hostWindow() ?? window;
  return provider === host.XverseProviders?.StacksProvider || provider === host.xverseProviders?.StacksProvider || provider === xverseRpc();
};
const resolveProvider = (id: string): Provider | undefined => {
  const host = hostWindow();
  const found = byPath(host, id) ?? (host === window ? undefined : byPath(window, id));
  if (found) return found;
  if (isXverseId(id) || isRegisteredXverse(id)) return xverseRpc();
  return undefined;
};
export const listProviders = (): ProviderInfo[] => {
  const host = hostWindow();
  const list = registered(host);
  const known: ProviderInfo[] = [
    { id: 'LeatherProvider', name: 'Leather' },
    { id: 'XverseProviders.BitcoinProvider', name: 'Xverse' }
  ];
  return list.concat(known.filter((k) => !list.some((p) => sameProvider(p, k)) && !!byPath(host, k.id)));
};
const selectedProvider = (): Provider | undefined => {
  const found = selectedId ? resolveProvider(selectedId) : undefined;
  if (found) return found;
  const host = hostWindow() ?? window;
  return host.LeatherProvider ?? host.XverseProviders?.StacksProvider ?? host.xverseProviders?.StacksProvider ?? host.StacksProvider;
};
export const walletLabel = () => (isLeatherId(selectedId) ? 'Leather' : isXverseId(selectedId) || isRegisteredXverse(selectedId) ? 'Xverse' : selectedId ?? 'Wallet');

// ---------- responses and errors ----------
const toError = (e: unknown): Error & { code?: unknown; data?: unknown } => {
  if (e instanceof Error) return e;
  const o: any = e && typeof e === 'object' ? e : {};
  const inner = o.error && typeof o.error === 'object' ? o.error : null;
  const err: any = new Error(str(inner?.message) ?? str(o.message) ?? str(o.error) ?? str(e) ?? 'Wallet provider request failed.');
  err.code = inner?.code ?? o.code;
  err.data = inner?.data ?? o.data;
  return err;
};
const unwrap = (r: any) => {
  if (r && typeof r === 'object') {
    if (r.error) throw toError(r);
    if (r.status === 'error') throw toError(r.result ?? r);
  }
  return r;
};
export const isUnsupported = (e: unknown) => {
  const code = e && typeof e === 'object' && 'code' in e ? (e as any).code : undefined;
  const m = (e instanceof Error ? e.message : String(e ?? '')).toLowerCase();
  return code === -32601 || ['method not found', 'not supported', 'unsupported', 'not available', 'not implemented'].some((s) => m.includes(s));
};
export const isUserCancel = (e: unknown) => {
  const code = e && typeof e === 'object' ? (e as any).code : undefined;
  if (typeof code === 'number' && USER_CANCEL_CODES.has(code)) return true;
  const m = (e instanceof Error ? e.message : String(e ?? '')).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(m) ||
    /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(m) ||
    /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(m) || m === 'cancelled' || m === 'canceled';
};
const isNetworkMismatch = (e: unknown) => {
  const m = (e instanceof Error ? e.message : String(e ?? '')).toLowerCase();
  return m.includes('network mismatch') || (m.includes('mismatch') && m.includes('network'));
};
const cancelMessage = (e: any, startedAt: number) => {
  const detail = `${e?.code !== undefined ? `code ${e.code}: ` : ''}${e?.message || 'no message'}`;
  return Date.now() - startedAt < 1500
    ? new Error(`The wallet refused the request immediately, without showing it (${detail}).`)
    : new Error(`You cancelled the request in the wallet (${detail}).`);
};
const request = async (p: Provider, method: string, params?: unknown) => {
  if (typeof p.request !== 'function') throw new Error(`Wallet provider does not support request("${method}").`);
  try { return unwrap(await p.request(method, params)); } catch (e) { throw toError(e); }
};
/** Xverse requests always go to the registered request bridge, never a stub. */
const requestRouted = async (p: Provider, method: string, params?: unknown) => {
  if (!isXverse(p)) return request(p, method, params);
  const rpc = xverseRpc();
  if (!rpc) throw Object.assign(new Error('Xverse modern request provider is not available.'), { code: 'XVERSE_RPC_UNAVAILABLE' });
  try { return unwrap(await rpc.request!(method, params)); } catch (e) { throw toError(e); }
};

// ---------- tx id extraction ----------
const rawTxHex = (v: unknown) => {
  const s = str(v); if (!s) return null;
  const h = strip0x(s);
  return h.length < 128 || h.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(h) ? null : h;
};
const txidFromRaw = (v: unknown) => {
  const h = rawTxHex(v); if (!h) return null;
  try { const id = deserializeTransaction(h).txid(); return id.startsWith('0x') ? id : `0x${id}`; } catch { return null; }
};
const asTxid = (v: unknown) => {
  const s = str(v); if (!s) return null;
  const h = strip0x(s);
  return /^[0-9a-f]{64}$/i.test(h) ? `0x${h}` : null;
};
export const findTx = (payload: unknown, depth = 0): TxResult | null => {
  if (depth > 6 || payload == null) return null;
  const direct = asTxid(payload) ?? txidFromRaw(payload);
  if (direct) return { txId: direct, txRaw: rawTxHex(payload) ?? undefined };
  if (Array.isArray(payload)) { for (const x of payload) { const r = findTx(x, depth + 1); if (r) return r; } return null; }
  if (typeof payload !== 'object') return null;
  const o = payload as Record<string, unknown>;
  const raw = RAW_TX_KEYS.map((k) => rawTxHex(o[k])).find(Boolean) ?? undefined;
  const id = asTxid(o.txId) ?? asTxid(o.txid) ?? asTxid(o.transactionId);
  if (id) return { txId: id, txRaw: raw };
  for (const k of RAW_TX_KEYS) { const t = txidFromRaw(o[k]); if (t) return { txId: t, txRaw: rawTxHex(o[k]) ?? undefined }; }
  for (const k of NESTED_KEYS) { const r = findTx(o[k], depth + 1); if (r) return r; }
  return null;
};
const needTx = (payload: unknown): TxResult => {
  const r = findTx(payload);
  if (r) return r;
  throw new Error('Wallet response did not include a transaction id.');
};

// ---------- addresses (§6: walk the payload, validate) ----------
export const extractAddress = (v: unknown, depth = 0): string | null => {
  if (depth > 8 || !v) return null;
  if (typeof v === 'string') return isStacksAddress(v.trim()) ? v.trim() : null;
  if (Array.isArray(v)) { for (const x of v) { const r = extractAddress(x, depth + 1); if (r) return r; } return null; }
  if (typeof v !== 'object') return null;
  const o = v as any;
  for (const k of ['address', 'selectedAddress', 'identityAddress', 'stxAddress', 'addresses', 'accounts', 'result', 'profile', 'authResponsePayload', 'userData']) {
    if (!(k in o)) continue;
    const r = extractAddress(o[k], depth + 1); if (r) return r;
  }
  if (typeof o.mainnet === 'string' && isStacksAddress(o.mainnet.trim())) return o.mainnet.trim();
  if (typeof o.testnet === 'string' && isStacksAddress(o.testnet.trim())) return o.testnet.trim();
  return null;
};
const extractAddressOn = (v: unknown, net: Net) => {
  const found: string[] = [];
  const walk = (x: unknown, d = 0) => {
    if (d > 8 || !x) return;
    if (typeof x === 'string') { if (isStacksAddress(x.trim())) found.push(x.trim()); return; }
    if (Array.isArray(x)) { x.forEach((y) => walk(y, d + 1)); return; }
    if (typeof x === 'object') for (const k in x as any) walk((x as any)[k], d + 1);
  };
  walk(v);
  return found.find((a) => networkOfAddress(a) === net) ?? null;
};
const extractPublicKey = (v: unknown, address: string, depth = 0): string | null => {
  if (depth > 8 || !v || typeof v !== 'object') return null;
  if (Array.isArray(v)) { for (const x of v) { const r = extractPublicKey(x, address, depth + 1); if (r) return r; } return null; }
  const o = v as any;
  const addr = str(o.address) ?? str(o.stxAddress);
  const key = [o.publicKey, o.public_key, o.stxPublicKey].map((k) => { const s = str(k); return s && /^[0-9a-f]{66}$/i.test(strip0x(s)) ? strip0x(s) : null; }).find(Boolean);
  if (key && addr === address) return key;
  for (const k of ['addresses', 'accounts', 'result', 'data', 'payload']) {
    if (k in o) { const r = extractPublicKey(o[k], address, depth + 1); if (r) return r; }
  }
  return null;
};
const parseConnect = (payload: unknown, net: Net): ConnectResult => {
  const address = extractAddressOn(payload, net) ?? extractAddress(payload);
  if (!address) return { isConnected: false };
  const actual = networkOfAddress(address) ?? net;
  return actual !== net
    ? { isConnected: false, wrongNetwork: actual, address }
    : { isConnected: true, address, network: actual, publicKey: extractPublicKey(payload, address) };
};

// ---------- Xverse account preflight (§3) ----------
const connectParams = () => ({ addresses: ['stacks', 'payment'], network: currentNetwork === 'mainnet' ? 'Mainnet' : 'Testnet', message: connectMessage });
let cachedAccount: { address: string; at: number } | null = null;
const remember = (a: string | null) => { if (a) cachedAccount = { address: a, at: Date.now() }; };
const forget = () => { cachedAccount = null; };
const cached = () => (cachedAccount && Date.now() - cachedAccount.at <= ACCOUNT_CACHE_MS ? cachedAccount.address : null);
const report = (p: Progress | undefined, stage: string) => { try { p?.(stage); } catch { /* ignore */ } };

const withTimeout = <T>(promise: Promise<T>, what: string) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error(`Xverse did not answer ${what} within ${ACCOUNT_READ_TIMEOUT_MS / 1000}s.`), { code: 'XVERSE_ACCOUNT_READ_TIMEOUT' })), ACCOUNT_READ_TIMEOUT_MS);
  });
  return Promise.race([promise, timeout]).finally(() => timer && clearTimeout(timer));
};

export const ensureXverseAccount = async (rpc: Provider, expected: string | undefined, progress?: Progress) => {
  const check = (address: string, via: string) => {
    if (expected && address !== expected) {
      throw Object.assign(new Error(`Xverse active account ${address} (via ${via}) does not match the connected address ${expected}. Disconnect and reconnect the wallet, or switch back to the connected account.`), { code: ADDRESS_MISMATCH });
    }
    return address;
  };
  const hit = cached();
  if (hit) { report(progress, 'account-cached'); return check(hit, 'cached-session'); }
  let address: string | null = null;
  report(progress, 'account-read');
  try {
    address = extractAddress(unwrap(await withTimeout(rpc.request!('wallet_getAccount'), 'wallet_getAccount')));
  } catch (e) {
    if (isUserCancel(e)) throw toError(e);
    report(progress, 'account-read-failed');
  }
  if (address) { remember(address); return check(address, 'wallet_getAccount'); }
  report(progress, 'account-reconnect');
  const response = unwrap(await rpc.request!('wallet_connect').catch((e) => { throw toError(e); }));
  address = extractAddress(response);
  if (!address) throw Object.assign(new Error('Xverse did not return a Stacks account from wallet_connect.'), { code: 'WALLET_ACCOUNT_UNAVAILABLE' });
  remember(address);
  return check(address, 'wallet_connect');
};

const reconnectXverse = async (rpc: Provider) => {
  forget();
  try { await rpc.request!('wallet_disconnect'); } catch { /* best effort */ }
  const response = unwrap(await rpc.request!('wallet_connect', connectParams()));
  const address = extractAddressOn(response, currentNetwork) ?? extractAddress(response);
  remember(address);
  return address;
};

/** Network-mismatch recovery (§2b): sign-only broadcast first, then ONE reconnect + retry. */
const requestWithRecovery = async (rpc: Provider, method: string, params: unknown, expected: string | undefined, signOnly?: (p: Provider) => Promise<unknown>) => {
  try {
    return unwrap(await rpc.request!(method, params));
  } catch (first) {
    const err = toError(first);
    if (isNetworkMismatch(err) && signOnly) {
      console.info('[wallet:xverse-preflight]', { stage: 'NETWORK_MISMATCH_SIGN_ONLY', method });
      try { return await signOnly(rpc); } catch (e) { if (!isNetworkMismatch(toError(e))) throw toError(e); }
    }
    if (!isNetworkMismatch(err)) throw err;
    console.info('[wallet:xverse-preflight]', { stage: 'NETWORK_MISMATCH_RECOVERY', method, message: err.message });
    let address: string | null = null;
    try { address = await reconnectXverse(rpc); } catch (e) {
      console.info('[wallet:xverse-preflight]', { stage: 'RECOVERY_RECONNECT_FAILED', message: e instanceof Error ? e.message : String(e) });
      throw err;
    }
    if (!address || (expected && address !== expected)) {
      throw Object.assign(new Error(address ? `Xverse reconnected as ${address}, not the expected ${expected}. Switch back to that account and retry.` : err.message), { code: address ? ADDRESS_MISMATCH : undefined });
    }
    try { return unwrap(await rpc.request!(method, params)); } catch (e) { throw toError(e); }
  }
};
const signOnlyFrom = (build?: () => Promise<string>) => build && (async (rpc: Provider) => {
  const hex = await build();
  console.info('[wallet:xverse-preflight]', { stage: 'SIGN_ONLY_REQUEST', bytes: hex.length / 2 });
  return unwrap(await rpc.request!('stx_signTransaction', { transaction: hex, broadcast: true }));
});

const watchdog = async <T>(run: (stage: (s: string) => void) => Promise<T>, describe: (stage: string) => string) => {
  let stage = 'account-preflight';
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error(describe(stage)), { code: 'XVERSE_SIGNING_TIMEOUT', stage })), SIGNING_TIMEOUT_MS);
  });
  try { return await Promise.race([run((s) => { stage = s; }), timeout]); } finally { if (timer) clearTimeout(timer); }
};

// ---------- connect / disconnect ----------
const connectMethods = async (p: Provider): Promise<readonly string[]> => {
  if (isXverse(p)) return ['wallet_connect', 'stx_getAccounts', 'wallet_getAccount'];
  if (!isLeatherId(selectedId)) {
    return ['wallet_connect', 'stx_requestAccounts', 'connect', 'getAddresses', 'stx_getAddresses', 'stx_getAccounts', 'getAccounts', 'wallet_getAccount', 'requestAccounts'];
  }
  const leather = ['getAddresses', 'stx_getAccounts', 'stx_getAddresses', 'stx_requestAccounts', 'wallet_connect'];
  try {
    const supportedRaw = await request(p, 'supportedMethods');
    const flat = (x: any, d = 0): string[] => {
      if (d > 5 || x == null) return [];
      if (Array.isArray(x)) return [...new Set(x.filter((y) => typeof y === 'string'))];
      if (typeof x !== 'object') return [];
      for (const k of ['supportedMethods', 'methods', 'result', 'data']) if (k in x) { const r = flat(x[k], d + 1); if (r.length) return r; }
      return [];
    };
    const supported = flat(supportedRaw);
    console.info('[wallet:connect]', { stage: 'CAPABILITIES', provider: 'leather', supportedMethods: supported });
    const advertised = leather.filter((m) => supported.includes(m));
    return advertised.length ? advertised : leather;
  } catch (e) {
    console.info('[wallet:connect]', { stage: 'CAPABILITIES_UNAVAILABLE', provider: 'leather', message: e instanceof Error ? e.message : String(e) });
    return leather;
  }
};

const connectViaRequest = async (p: Provider, net: Net): Promise<ConnectResult> => {
  if (isXverse(p)) { try { await requestRouted(p, 'wallet_disconnect'); } catch { /* best effort, §4 */ } }
  let lastError: unknown = null;
  let wrong: ConnectResult | null = null;
  for (const method of await connectMethods(p)) {
    try {
      console.info('[wallet:connect]', { stage: 'REQUEST', method });
      const result = parseConnect(await requestRouted(p, method, isXverse(p) && method === 'wallet_connect' ? connectParams() : undefined), net);
      if (result.isConnected) {
        console.info('[wallet:connect]', { stage: 'CONNECTED', method });
        if (isXverse(p)) remember(result.address);
        return result;
      }
      if (result.wrongNetwork) wrong = result;
      console.info('[wallet:connect]', { stage: 'EMPTY_RESPONSE', method });
    } catch (e) {
      lastError = e;
      const unsupported = isUnsupported(e);
      (unsupported ? console.info : console.warn)('[wallet:connect]', { stage: 'REQUEST_ERROR', method, code: (e as any)?.code, message: e instanceof Error ? e.message : String(e) });
      if (isUserCancel(e)) return { isConnected: false };
      if (unsupported) continue;
      throw e;
    }
  }
  if (wrong) return wrong;
  if (lastError) throw lastError;
  return { isConnected: false };
};

/** Shows the chooser (every time, §4). Resolves to a provider id, or null if closed. */
export type Chooser = (providers: ProviderInfo[]) => Promise<string | null>;

export async function connect(net: Net, choose: Chooser): Promise<ConnectResult> {
  currentNetwork = net;
  const id = await choose(listProviders());
  if (!id) return { isConnected: false };
  const provider = resolveProvider(id);
  console.info('[wallet:connect]', { stage: 'PROVIDER_SELECTED', providerId: id, resolved: !!provider, requestBridge: typeof provider?.request === 'function' });
  if (!provider) throw new Error(`${id} was not found in this window. Is the extension enabled for this site?`);
  selectedId = id;
  if (typeof provider.request !== 'function') {
    throw new Error('This wallet has no request() bridge. Use a current Xverse or Leather build.');
  }
  try {
    return await connectViaRequest(provider, net);
  } catch (e) {
    if (isUserCancel(e)) return { isConnected: false };
    throw e;
  }
}

export async function disconnect() {
  const p = selectedProvider();
  if (p && isLeatherId(selectedId)) {
    for (const m of ['stx_disconnect', 'wallet_disconnect', 'disconnect', 'deactivate']) {
      try { await request(p, m); break; } catch (e) { if (isUserCancel(e) || isUnsupported(e)) continue; }
    }
  }
  selectedId = null;
  forget();
}

// ---------- signing ----------
const hexArg = (cv: ClarityValue) => { const s = serializeCV(cv) as unknown; return typeof s === 'string' ? strip0x(s) : toHex(s as Uint8Array); };
const hexPc = (pc: PostCondition) => { const s = serializePostCondition(pc) as unknown; return typeof s === 'string' ? strip0x(s) : toHex(s as Uint8Array); };

export type CallOptions = {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions: PostCondition[];
  postConditionMode?: PostConditionMode;
  network: Net;
  stxAddress: string;
  onProgress?: Progress;
  /** Builds the unsigned tx hex for the sign-only fallback (needs the public key). */
  buildUnsigned?: () => Promise<string>;
};

const fullCallParams = (o: CallOptions) => ({
  contract: `${o.contractAddress}.${o.contractName}`,
  functionName: o.functionName,
  functionArgs: o.functionArgs.map(hexArg),
  network: o.network,
  address: o.stxAddress,
  sponsored: false,
  postConditionMode: o.postConditionMode === PostConditionMode.Allow ? 'allow' : 'deny',
  postConditions: o.postConditions.length ? o.postConditions.map(hexPc) : undefined
});
/** Xverse shape: no `sender` (§2); `arguments` duplicates `functionArgs` for older builds. */
export const xverseCallParams = (o: CallOptions) => {
  const p = fullCallParams(o);
  return { contract: p.contract, functionName: p.functionName, functionArgs: p.functionArgs, arguments: p.functionArgs,
    postConditionMode: p.postConditionMode, postConditions: p.postConditions, network: p.network, address: p.address };
};

export async function contractCall(o: CallOptions): Promise<TxResult> {
  const p = selectedProvider();
  if (!p || typeof p.request !== 'function') throw new Error('Connect a wallet first.');
  const startedAt = Date.now();
  try {
    if (!isXverse(p)) { report(o.onProgress, 'signing-request'); return needTx(await request(p, 'stx_callContract', fullCallParams(o))); }
    const rpc = xverseRpc();
    if (!rpc) throw Object.assign(new Error('Xverse modern request provider is not available.'), { code: 'XVERSE_RPC_UNAVAILABLE' });
    let active: string | undefined;
    return await watchdog(async (stage) => {
      active = await ensureXverseAccount(rpc, o.stxAddress, o.onProgress);
      stage('stx_callContract'); report(o.onProgress, 'signing-request');
      return needTx(await requestWithRecovery(rpc, 'stx_callContract', xverseCallParams(o), o.stxAddress ?? active, signOnlyFrom(o.buildUnsigned)));
    }, (stage) => `Xverse did not answer the ${stage} request within ${SIGNING_TIMEOUT_MS / 1000}s (expected=${o.stxAddress}, active=${active ?? 'unknown'}, call=${o.contractAddress}.${o.contractName}::${o.functionName}). If you approved a transaction, it may still broadcast.`);
  } catch (e) {
    if (isUserCancel(e)) throw cancelMessage(e, startedAt);
    throw e;
  }
}

export type DeployOptions = { contractName: string; codeBody: string; clarityVersion: number; network: Net; stxAddress: string; onProgress?: Progress };
export const deployParams = (o: DeployOptions) => ({
  name: o.contractName, clarityCode: o.codeBody, clarityVersion: o.clarityVersion, network: o.network,
  address: o.stxAddress, sponsored: false, postConditionMode: 'deny'
});

export async function deployContract(o: DeployOptions): Promise<TxResult> {
  const p = selectedProvider();
  if (!p || typeof p.request !== 'function') throw new Error('Connect a wallet first.');
  const startedAt = Date.now();
  try {
    // Same account check as contract calls: never deploy from an account the
    // canary did not connect as (the playbook's abort-on-mismatch rule).
    if (isXverse(p)) { const rpc = xverseRpc(); if (rpc) await ensureXverseAccount(rpc, o.stxAddress, o.onProgress); }
    report(o.onProgress, 'signing-request');
    return needTx(await request(p, 'stx_deployContract', deployParams(o)));
  } catch (e) {
    if (isUserCancel(e)) throw cancelMessage(e, startedAt);
    throw e;
  }
}

export type TransferOptions = { recipient: string; amount: bigint; memo?: string; network: Net; stxAddress: string; onProgress?: Progress; buildUnsigned?: () => Promise<string> };
const fullTransferParams = (o: TransferOptions) => ({
  recipient: o.recipient, amount: o.amount.toString(), memo: o.memo, network: o.network, address: o.stxAddress, sponsored: false
});

export async function stxTransfer(o: TransferOptions): Promise<TxResult> {
  const p = selectedProvider();
  if (!p || typeof p.request !== 'function') throw new Error('Connect a wallet first.');
  const startedAt = Date.now();
  try {
    if (!isXverse(p)) return needTx(await request(p, 'stx_transferStx', fullTransferParams(o)));
    const rpc = xverseRpc();
    const dotted = xverseDottedStacks();
    if (rpc) {
      try {
        await ensureXverseAccount(rpc, o.stxAddress, o.onProgress);
        return needTx(await requestWithRecovery(rpc, 'stx_transferStx',
          { recipient: o.recipient, amount: o.amount.toString(), ...(o.memo ? { memo: o.memo } : {}), network: o.network, address: o.stxAddress },
          o.stxAddress, signOnlyFrom(o.buildUnsigned)));
      } catch (e) {
        console.warn('[wallet:stx-transfer]', { stage: 'XVERSE_MODERN_FAILED', code: (e as any)?.code, message: (e as any)?.message });
        if (!(isUnsupported(e) && typeof dotted?.request === 'function')) throw e;
      }
    }
    if (typeof dotted?.request === 'function') return needTx(await request(dotted, 'stx_transferStx', fullTransferParams(o)));
    throw Object.assign(new Error('Xverse payment provider is not available.'), { code: 'XVERSE_RPC_UNAVAILABLE' });
  } catch (e) {
    if (isUserCancel(e)) throw cancelMessage(e, startedAt);
    throw e;
  }
}

export const __testing = { parseConnect, requestWithRecovery, setSelected: (id: string | null) => { selectedId = id; }, setNetwork: (n: Net) => { currentNetwork = n; }, forget };
