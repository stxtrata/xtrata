/* Xtrata wallet layer — shared by the Proof of Free V3 canaries.
 *
 * Ported verbatim from the Living Synth v5 canary, which came from the main
 * Xtrata app (src/lib/wallet/connect.ts). Do NOT "simplify" any of this: every
 * branch is a real wallet quirk diagnosed against a shipping Leather or Xverse
 * build. Both canaries depend on it, so a regression here breaks both.
 *
 * NETWORK is fixed to mainnet — these pages only ever touch mainnet.
 */
const NETWORK = 'mainnet';

// Pages pass their own logger so wallet diagnostics land in their log panel.
let log = () => {};
export function setLogger(fn){ log = typeof fn === 'function' ? fn : () => {}; }

// Chain libs load on demand — the page renders offline; the wallet only loads
// when you act. Versions are pinned: the wallet layer below is written against
// these exact APIs and an open range would silently change provider behaviour.
const LIB = {
  connect: 'https://esm.sh/@stacks/connect@8.2.6',
  connectUi: 'https://esm.sh/@stacks/connect-ui@8.1.2',
  connectUiLoader: 'https://esm.sh/@stacks/connect-ui@8.1.2/loader',
  transactions: 'https://esm.sh/@stacks/transactions@7.4.0'
};
let _sdk = null;
async function sdk(){
  if (!_sdk) {
    const [c, ui, loader, t] = await Promise.all([
      import(LIB.connect), import(LIB.connectUi), import(LIB.connectUiLoader), import(LIB.transactions)
    ]);
    _sdk = {
      DEFAULT_PROVIDERS: c.DEFAULT_PROVIDERS,
      disconnect: c.disconnect,
      clearLocalStorage: c.clearLocalStorage,
      getLocalStorage: c.getLocalStorage,
      getSelectedProviderId: ui.getSelectedProviderId,
      setSelectedProviderId: ui.setSelectedProviderId,
      clearSelectedProviderId: ui.clearSelectedProviderId,
      getProviderFromId: ui.getProviderFromId,
      defineCustomElements: loader.defineCustomElements,
      Cl: t.Cl,
      fetchCallReadOnlyFunction: t.fetchCallReadOnlyFunction,
      cvToJSON: t.cvToJSON,
      validateStacksAddress: t.validateStacksAddress
    };
    validateAddress = t.validateStacksAddress;
  }
  return _sdk;
}
// Upgraded to the real c32 checksum test as soon as @stacks/transactions loads.
let validateAddress = null;

/* ---- wallet layer, ported from the main Xtrata app (src/lib/wallet/connect.ts) ---- */

// This page may be viewed inside an iframe. Wallet extensions inject their
// providers into the TOP window only, while @stacks/connect ships an Asigna
// shim that defines window.AsignaProvider inside EVERY iframe — so detecting
// against the local window lists Asigna as the only "installed" wallet and
// hides Leather/Xverse. All detection goes through the top same-origin window
// when one exists; cross-origin embeds fall back to the local window.
function walletHostWindow(){
  try {
    const top = window.top;
    if (top && top !== window.self && top.location.origin === window.location.origin) return top;
  } catch { /* cross-origin parent: its providers are unreachable */ }
  return window;
}
function resolveProviderOnWindow(win, id){
  if (!win || !id) return undefined;
  return id.split('.').reduce((acc, part) => acc?.[part], win);
}
// connect-ui only reads webbtc_stx_providers / wbip_providers, while current
// Xverse builds register their WBIP provider in btc_providers (some releases
// used webbtc_providers). Merge all four so the chooser sees what is injected.
function registeredProviders(win){
  if (!win) return [];
  const merged = [
    ...(win.btc_providers ?? []), ...(win.wbip_providers ?? []),
    ...(win.webbtc_providers ?? []), ...(win.webbtc_stx_providers ?? [])
  ];
  return merged.filter((entry, i) => Boolean(entry?.id) && merged.findIndex(c =>
    c.id === entry.id || (c.name && entry.name && c.name.toLowerCase() === entry.name.toLowerCase())) === i);
}
const isLeatherProviderId = id => typeof id === 'string' && id.toLowerCase().includes('leather');
const isXverseProviderId = id => typeof id === 'string' && id.toLowerCase().includes('xverse');
function isRegisteredXverseProviderId(id){
  return !!id && registeredProviders(walletHostWindow()).some(e =>
    e.id === id && (isXverseProviderId(e.id) || e.name?.toLowerCase().includes('xverse')));
}
const XVERSE_RPC_IDS = ['XverseProviders.BitcoinProvider', 'xverseProviders.BitcoinProvider', 'BitcoinProvider'];
function xverseRpcProvider(){
  const host = walletHostWindow();
  const ids = registeredProviders(host)
    .filter(e => isXverseProviderId(e.id) || e.name?.toLowerCase().includes('xverse'))
    .map(e => e.id)
    .concat(XVERSE_RPC_IDS);
  for (const id of ids) {
    const p = resolveProviderOnWindow(host, id) ?? (host === window ? undefined : resolveProviderOnWindow(window, id));
    if (typeof p?.request === 'function') return p;
  }
  return undefined;
}
// The chooser still persists XverseProviders.StacksProvider, but current Xverse
// exposes only BitcoinProvider. Treat the old id as an alias for the real
// request bridge instead of falling through to window.StacksProvider's stub.
async function resolveProviderById(id){
  if (!id) return undefined;
  const { getProviderFromId } = await sdk();
  const host = walletHostWindow();
  const exact = resolveProviderOnWindow(host, id)
    ?? (host === window ? undefined : resolveProviderOnWindow(window, id))
    ?? getProviderFromId(id);
  if (exact) return exact;
  return (isXverseProviderId(id) || isRegisteredXverseProviderId(id)) ? xverseRpcProvider() : undefined;
}
function installedProvidersOnHost(defaults){
  const host = walletHostWindow();
  const registered = registeredProviders(host);
  return registered.concat(defaults.filter(d =>
    !registered.find(e => e.id === d.id) && !!resolveProviderOnWindow(host, d.id)));
}
async function selectedProviderId(){ return (await sdk()).getSelectedProviderId(); }
async function getStacksProvider(){
  const selected = await resolveProviderById(await selectedProviderId());
  if (selected) return selected;
  const w = walletHostWindow();
  return w.LeatherProvider ?? w.XverseProviders?.StacksProvider ?? w.xverseProviders?.StacksProvider
    ?? xverseRpcProvider() ?? w.StacksProvider ?? w.BlockstackProvider;
}
async function isSelectedXverse(provider){
  const id = await selectedProviderId();
  if (isXverseProviderId(id) || isRegisteredXverseProviderId(id)) return true;
  const w = walletHostWindow();
  return provider === w.XverseProviders?.StacksProvider || provider === w.xverseProviders?.StacksProvider
    || provider === xverseRpcProvider();
}

// Drive connect-ui's chooser ourselves so installedProviders comes from the
// host window rather than this frame.
async function selectProvider(){
  const { DEFAULT_PROVIDERS, defineCustomElements, setSelectedProviderId } = await sdk();
  defineCustomElements(window);
  const chosenId = await new Promise(resolve => {
    const modal = document.createElement('connect-modal');
    const overflow = document.body.style.overflow;
    const cleanup = () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); modal.remove(); };
    const onKey = e => { if (e.key === 'Escape') { cleanup(); resolve(null); } };
    modal.defaultProviders = DEFAULT_PROVIDERS;
    modal.installedProviders = installedProvidersOnHost(DEFAULT_PROVIDERS);
    modal.persistSelection = false; // persisted below, against the host-resolved provider
    modal.callback = sel => { cleanup(); resolve(typeof sel === 'string' ? sel : null); };
    modal.cancelCallback = () => { cleanup(); resolve(null); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    document.body.appendChild(modal);
  });
  if (!chosenId) return null;
  const provider = await resolveProviderById(chosenId);
  if (provider) { try { setSelectedProviderId(chosenId); } catch {} }
  log(`provider selected ${chosenId}${provider ? '' : ' (could not resolve — is the wallet unlocked?)'}`);
  return provider ?? null;
}

/* ---- provider request plumbing ---- */
function providerError(value){
  if (value instanceof Error) return value;
  const c = value && typeof value === 'object' ? value : {};
  const nested = c.error && typeof c.error === 'object' ? c.error : null;
  const err = new Error(String(nested?.message || c.message || c.error || value || 'wallet request failed'));
  err.code = nested?.code ?? c.code;
  return err;
}
function unwrapResponse(response){
  if (response && typeof response === 'object') {
    if (response.error) throw providerError(response);
    if (response.status === 'error') throw providerError(response.result ?? response);
  }
  return response;
}
async function providerRequest(provider, method, params){
  if (typeof provider?.request !== 'function') throw new Error(`wallet has no request("${method}") bridge`);
  try { return unwrapResponse(await provider.request(method, params)); }
  catch (e) { throw providerError(e); }
}
// Xverse account permission lives on the BitcoinProvider object that answered
// wallet_connect — keep every later call on that same bridge.
async function walletRpc(provider, method, params){
  if (!(await isSelectedXverse(provider))) return providerRequest(provider, method, params);
  const rpc = xverseRpcProvider();
  if (!rpc) throw Object.assign(new Error('Xverse request provider is not available'), { code:'XVERSE_RPC_UNAVAILABLE' });
  try { return unwrapResponse(await rpc.request(method, params)); }
  catch (e) { throw providerError(e); }
}
function isMethodUnsupported(error){
  const msg = String(error?.message ?? error ?? '').toLowerCase();
  return error?.code === -32601 || ['method not found','not supported','unsupported','not available',
    'not implemented','request function is not implemented'].some(s => msg.includes(s));
}
function isUserCancelled(error){
  if (error?.code === 4001 || error?.code === -31001) return true;
  const msg = String(error?.message ?? error ?? '').trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(msg)
    || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(msg)
    || msg === 'cancelled' || msg === 'canceled';
}
// Connect responses differ per wallet and per method (getAddresses, wallet_connect,
// stx_getAccounts, wallet_getAccount all nest the address differently), so walk
// the payload instead of guessing one shape. Bitcoin addresses fail the c32 test.
function collectStacksAddresses(payload, out = [], depth = 0){
  if (depth > 8 || payload === null || typeof payload === 'undefined') return out;
  if (typeof payload === 'string') {
    const t = payload.trim();
    if (isMainnetStacksAddress(t) && !out.includes(t)) out.push(t);
    return out;
  }
  if (Array.isArray(payload)) { payload.forEach(e => collectStacksAddresses(e, out, depth + 1)); return out; }
  if (typeof payload !== 'object') return out;
  for (const key of ['address','stxAddress','selectedAddress','identityAddress','mainnet',
    'addresses','accounts','result','data','payload','response','profile','userData']) {
    if (key in payload) collectStacksAddresses(payload[key], out, depth + 1);
  }
  return out;
}
function extractSupportedMethods(payload, depth = 0){
  if (depth > 5 || !payload) return [];
  if (Array.isArray(payload)) return [...new Set(payload.filter(v => typeof v === 'string'))];
  if (typeof payload !== 'object') return [];
  for (const key of ['supportedMethods','methods','result','data']) {
    if (key in payload) { const m = extractSupportedMethods(payload[key], depth + 1); if (m.length) return m; }
  }
  return [];
}
// Wallets disagree on the connect method: Xverse only answers wallet_connect /
// stx_getAccounts / wallet_getAccount, Leather documents getAddresses. A single
// hard-coded getAddresses fails outright on anything that doesn't advertise it.
async function connectAttempts(provider){
  if (await isSelectedXverse(provider)) return ['wallet_connect','stx_getAccounts','wallet_getAccount'];
  const leatherMethods = ['getAddresses','stx_getAccounts','stx_getAddresses','stx_requestAccounts','wallet_connect'];
  if (!isLeatherProviderId(await selectedProviderId())) {
    return ['wallet_connect','stx_requestAccounts','connect','getAddresses','stx_getAddresses',
      'stx_getAccounts','getAccounts','wallet_getAccount','requestAccounts'];
  }
  try {
    const supported = extractSupportedMethods(await providerRequest(provider, 'supportedMethods'));
    log(`leather advertises: ${supported.join(', ') || 'nothing'}`);
    const advertised = leatherMethods.filter(m => supported.includes(m));
    return advertised.length ? advertised : leatherMethods;
  } catch { return leatherMethods; } // capability discovery is advisory
}
async function connectViaRequest(provider){
  // Xverse only shows its account chooser on a FRESH wallet_connect — while a
  // per-origin permission exists it silently reuses the approved account.
  if (await isSelectedXverse(provider)) {
    try { await walletRpc(provider, 'wallet_disconnect'); } catch { /* older builds */ }
  }
  let lastError = null;
  for (const method of await connectAttempts(provider)) {
    try {
      const addresses = collectStacksAddresses(await walletRpc(provider, method));
      if (addresses.length) { log(`connected via ${method}`); return addresses; }
      log(`${method} returned no Stacks mainnet address`);
    } catch (e) {
      lastError = e;
      if (isUserCancelled(e)) return [];
      if (isMethodUnsupported(e)) { log(`${method} unsupported, trying next`); continue; }
      throw e;
    }
  }
  if (lastError) throw lastError;
  return [];
}

/* ---- Xverse signing session ---- */
// Xverse tracks the dapp connection per injected provider and per browsing
// session, and its mobile in-app browser starts a fresh session each visit. A
// signing request made without an active wallet_connect for this origin is
// rejected before any confirmation UI.
const XVERSE_ACCOUNT_CACHE_MS = 45_000;
const XVERSE_READ_TIMEOUT_MS = 30_000;
const XVERSE_SIGNING_WATCHDOG_MS = 120_000;
let xverseAccount = null;
const rememberXverseAccount = a => { if (a) xverseAccount = { address:a, at:Date.now() }; };
const clearXverseAccountCache = () => { xverseAccount = null; };
const readXverseAccountCache = () =>
  xverseAccount && Date.now() - xverseAccount.at <= XVERSE_ACCOUNT_CACHE_MS ? xverseAccount.address : null;

function withTimeout(promise, label, ms){
  let timer;
  return Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Xverse did not answer ${label} within ${ms/1000}s`)), ms);
  })]).finally(() => clearTimeout(timer));
}
// Xverse rejects with "Network mismatch" when its stored per-origin session was
// created under a different network setting than the wallet's active network —
// only the signing request exposes it. Drop the session, reconnect, retry once.
const isNetworkMismatch = e => {
  const m = String(e?.message ?? e ?? '').toLowerCase();
  return m.includes('network mismatch') || (m.includes('mismatch') && m.includes('network'));
};
async function ensureXverseAccount(rpc, expected){
  const assertExpected = (address, source) => {
    if (expected && address !== expected) {
      throw new Error(`Xverse active account ${address} (via ${source}) is not the connected ${expected}. Switch back to that account, or disconnect and reconnect.`);
    }
    return address;
  };
  const cached = readXverseAccountCache();
  if (cached) return assertExpected(cached, 'cached-session');

  let address = null;
  try {
    // Never probe with stx_getAccounts here: it opens a "Mismatched Network"
    // prompt that gets rejected and surfaces to the user as "Network mismatch".
    address = collectStacksAddresses(unwrapResponse(
      await withTimeout(rpc.request('wallet_getAccount'), 'wallet_getAccount', XVERSE_READ_TIMEOUT_MS)))[0] || null;
  } catch (e) {
    if (isUserCancelled(e)) throw providerError(e);
    log('xverse preflight: wallet_getAccount unavailable (' + (e.message||e) + ')');
  }
  if (address) { rememberXverseAccount(address); return assertExpected(address, 'wallet_getAccount'); }

  const connected = collectStacksAddresses(unwrapResponse(await rpc.request('wallet_connect')))[0] || null;
  if (!connected) throw new Error('Xverse did not return a Stacks account from wallet_connect');
  rememberXverseAccount(connected);
  return assertExpected(connected, 'wallet_connect');
}
async function requestXverseSigning(rpc, method, params, expected){
  try { return unwrapResponse(await rpc.request(method, params)); }
  catch (error) {
    const failure = providerError(error);
    if (!isNetworkMismatch(failure)) throw failure;
    log('xverse network mismatch — refreshing the session and retrying once');
    clearXverseAccountCache();
    try { await rpc.request('wallet_disconnect'); } catch {}
    const address = collectStacksAddresses(unwrapResponse(await rpc.request('wallet_connect')))[0] || null;
    rememberXverseAccount(address);
    if (!address || (expected && address !== expected)) {
      throw new Error(address ? `Xverse reconnected as ${address}, not ${expected}` : failure.message);
    }
    return unwrapResponse(await rpc.request(method, params));
  }
}
function extractTxid(payload, depth = 0){
  if (depth > 6 || !payload) return null;
  if (Array.isArray(payload)) { for (const e of payload) { const t = extractTxid(e, depth + 1); if (t) return t; } return null; }
  if (typeof payload !== 'object') return null;
  for (const key of ['txid','txId','transactionId']) {
    if (typeof payload[key] === 'string' && payload[key].trim()) return payload[key].trim();
  }
  for (const key of ['result','data','payload','response','params']) {
    if (key in payload) { const t = extractTxid(payload[key], depth + 1); if (t) return t; }
  }
  return null;
}
// Xverse validates stx_callContract against the sats-connect schema, which only
// knows contract, functionName, functionArgs/arguments and the post conditions.
// Out-of-spec fields are not ignored: an explicit network or sender is read as
// "sign as this address/chain" and rejected before any confirmation UI. Sender
// correctness is enforced by ensureXverseAccount instead.
async function callContract(provider, { contractId, functionName, functionArgs, stxAddress }){
  const { Cl } = await sdk();
  const args = functionArgs.map(a => typeof a === 'string' ? a : Cl.serialize(a));
  if (!(await isSelectedXverse(provider))) {
    return extractTxid(await providerRequest(provider, 'stx_callContract', {
      contract: contractId, functionName, functionArgs: args,
      network: NETWORK, address: stxAddress, postConditionMode: 'allow'
    }));
  }
  const rpc = xverseRpcProvider();
  if (!rpc) throw Object.assign(new Error('Xverse request provider is not available'), { code:'XVERSE_RPC_UNAVAILABLE' });

  // Xverse mobile can reject a request with only an in-app toast and leave the
  // RPC promise pending forever. Track the stage so the timeout is diagnostic.
  let stage = 'account-preflight';
  const run = async () => {
    const active = await ensureXverseAccount(rpc, stxAddress);
    stage = 'stx_callContract';
    return extractTxid(await requestXverseSigning(rpc, 'stx_callContract', {
      contract: contractId, functionName, functionArgs: args,
      // Older Xverse builds validate with a schema that reads only `arguments`
      // and silently drop `functionArgs`; send both spellings.
      arguments: args, postConditionMode: 'allow'
    }, active));
  };
  return Promise.race([run(), new Promise((_, reject) => setTimeout(() => reject(new Error(
    `Xverse did not answer the ${stage} request within ${XVERSE_SIGNING_WATCHDOG_MS/1000}s. If it showed an error toast, note the exact wording; if you approved, the transaction may still broadcast.`
  )), XVERSE_SIGNING_WATCHDOG_MS))]);
}

// Full teardown so the next connect re-opens the chooser and Xverse re-prompts
// for an account instead of silently reusing the approved one.
async function clearWalletSession(){
  const s = await sdk().catch(() => null);
  if (!s) return;
  const previousId = await selectedProviderId();
  const provider = await resolveProviderById(previousId).catch(() => undefined);
  if (provider && isLeatherProviderId(previousId)) {
    for (const method of ['stx_disconnect','wallet_disconnect','disconnect','deactivate']) {
      try { await providerRequest(provider, method); break; } catch { /* try the next */ }
    }
  }
  try { s.disconnect(); } catch {}
  try { s.clearLocalStorage(); } catch {}
  try { s.clearSelectedProviderId(); } catch {}
  clearXverseAccountCache();
}

// Shape first (c32 deliberately excludes I, L, O and U), then the real checksum
// once @stacks/transactions has loaded. The shape test alone accepts a mistyped
// character that happens to be valid c32; only the checksum rejects it.
function isMainnetStacksAddress(address){
  if (typeof address !== 'string' || !/^(SP|SM)[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26,39}$/.test(address)) return false;
  return validateAddress ? validateAddress(address) : true;
}

export {
  NETWORK, sdk,
  walletHostWindow, registeredProviders, resolveProviderById, installedProvidersOnHost,
  selectedProviderId, getStacksProvider, isSelectedXverse, selectProvider,
  providerError, unwrapResponse, providerRequest, walletRpc,
  isMethodUnsupported, isUserCancelled, collectStacksAddresses,
  connectViaRequest, clearWalletSession,
  rememberXverseAccount, clearXverseAccountCache,
  extractTxid, callContract, isMainnetStacksAddress
};
