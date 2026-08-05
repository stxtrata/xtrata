// Wallet discovery and calling, matching what Astro Blaster does.
//
// This is a replication of logic that was arrived at painfully, not a design.
// Each rule below exists because a specific wallet on a specific platform did
// something unhelpful, and the comments say which. Do not simplify it without
// re-running the wallet matrix.
//
// The Xtrata sandbox
// ------------------
// An inscription served at /i/<id> runs under Xtrata's runtime, which injects
// its own wallet shim. That shim patches window.StacksProvider (creating one if
// no wallet is installed) and routes every request either to a real injected
// wallet or, when the page is framed and carries a walletBridgeToken, over
// postMessage to the host that can reach one.
//
// The bridge is therefore invisible from here: calling provider.request is
// correct whether the wallet is in this frame, in the parent, or in the opener.
// What we must not do is resolve a provider once at startup and hold it, since
// the shim installs itself at load and again at 400ms, 1400ms, 3200ms, and on
// focus. Anything that captured a provider early would capture nothing.

const BRIDGE_REQUEST = 'xtrata:wallet:request';
const BRIDGE_RESPONSE = 'xtrata:wallet:response';

// Reads the same query parameter the Xtrata runtime uses to mark a framed page.
export function bridgeToken() {
  try {
    return new URLSearchParams(globalThis.location?.search || '').get('walletBridgeToken') || '';
  } catch {
    return '';
  }
}

export function isFramed() {
  try {
    return globalThis.top !== globalThis.self || !!globalThis.opener;
  } catch {
    // A cross-origin parent throws on access, which itself means we are framed.
    return true;
  }
}

export function shimInstalled() {
  return globalThis.__xtrataRuntimeWalletShimInstalled === true;
}

// True when this page is running inside the Xtrata runtime with a host that can
// reach a wallet on its behalf.
export function usingHostBridge() {
  return !!bridgeToken() && isFramed();
}

/**
 * Every usable provider in this page, best first.
 *
 * The suppression rules matter more than the ordering:
 *
 *  - Named wallets also publish the generic aliases window.StacksProvider and
 *    window.stacks pointing at the same extension. Offering those as separate
 *    candidates makes the user approve twice for one action.
 *  - window.btc is Leather's btckit alias. Routing a contract call through it
 *    lands on the deprecated transactionRequest screen, where Confirm is
 *    disabled and the user can do nothing but close it.
 *  - window.BitcoinProvider is the same trap for Xverse.
 *
 * The Xtrata shim is the exception to the first rule: when it is installed it
 * *is* window.StacksProvider, and it may be the only route to a wallet, so it is
 * never suppressed.
 */
export function collectProviders() {
  const w = globalThis;
  if (typeof w === 'undefined') return [];

  const named = !!(w.LeatherProvider || w.XverseProviders || w.xverseProviders);
  const shim = shimInstalled();
  const suppressGeneric = named && !shim;

  const candidates = [
    ['window.StacksProvider', suppressGeneric ? null : w.StacksProvider],
    ['window.LeatherProvider', w.LeatherProvider],
    ['window.XverseProviders.StacksProvider', w.XverseProviders?.StacksProvider],
    ['window.xverseProviders.StacksProvider', w.xverseProviders?.StacksProvider],
    ['window.XverseProviders', w.XverseProviders],
    ['window.xverseProviders', w.xverseProviders],
    ['window.XverseProviders.BitcoinProvider', w.XverseProviders?.BitcoinProvider],
    ['window.btc', w.LeatherProvider ? null : w.btc],
    ['window.stacks', suppressGeneric ? null : w.stacks],
    ['window.BitcoinProvider', w.XverseProviders || w.xverseProviders ? null : w.BitcoinProvider]
  ];

  const out = [];
  const push = (provider, label) => {
    if (!provider) return;
    const hasRequest = typeof provider.request === 'function';
    const hasTransactionRequest = typeof provider.transactionRequest === 'function';
    if (!hasRequest && !hasTransactionRequest) return;
    if (out.some((entry) => entry.provider === provider)) return;
    out.push({ provider, label, hasRequest, hasTransactionRequest });
  };

  for (const [label, provider] of candidates) push(provider, label);

  // Wallets that register rather than inject.
  for (const registry of [w.btc_providers, w.webbtc_providers, w.wbip_providers]) {
    if (!Array.isArray(registry)) continue;
    for (const entry of registry) {
      const provider = entry?.provider || entry?.webBtcProvider || entry;
      push(provider, `registry:${entry?.name || entry?.id || 'unknown'}`);
    }
  }

  const score = (item) => {
    const label = String(item.label || '').toLowerCase();
    let value = 0;
    if (item.hasRequest) value += 10;
    // The shim is the only route to a wallet inside the sandbox, so it wins
    // there and is otherwise a thin pass-through to the real provider anyway.
    if (shim && label === 'window.stacksprovider') value += 60;
    if (label.includes('leather')) value += 25;
    if (label.includes('xverse')) value += 20;
    if (label.startsWith('registry:')) value += 15;
    if (!shim && label === 'window.stacksprovider') value -= 10;
    return value;
  };

  return out.sort((a, b) => score(b) - score(a));
}

export function resolveProvider(preferredLabel) {
  const found = collectProviders();
  if (!found.length) return null;
  if (preferredLabel) {
    const match = found.find((entry) => entry.label === preferredLabel);
    if (match) return match;
  }
  return found[0];
}

/**
 * Wait for a provider to appear.
 *
 * The Xtrata shim reinstalls on a schedule, and extensions inject at their own
 * pace, so a page that asks once at load and gives up will report no wallet on a
 * machine that has one.
 */
export function waitForProvider({ timeoutMs = 4000, intervalMs = 250 } = {}) {
  return new Promise((resolve) => {
    const immediate = resolveProvider();
    if (immediate) return resolve(immediate);

    const started = Date.now();
    const timer = setInterval(() => {
      const found = resolveProvider();
      if (found || Date.now() - started >= timeoutMs) {
        clearInterval(timer);
        resolve(found || null);
      }
    }, intervalMs);
  });
}

/**
 * Call a wallet method.
 *
 * Always the two-argument form. Sniffing provider.request.length to choose a
 * calling convention is what previously sent modern providers the legacy object
 * form: rest and default parameters report an arity of 0 or 1, so the sniff was
 * wrong precisely for the wallets that mattered.
 */
export async function walletRequest(entry, method, params, { timeoutMs = 180_000 } = {}) {
  const provider = entry?.provider || entry;
  if (!provider || typeof provider.request !== 'function') {
    const error = new Error('no wallet provider available');
    error.code = 'NO_WALLET';
    throw error;
  }

  // Leather mobile never settles a request it cannot handle: no result, no
  // rejection, the promise simply hangs. Desktop rejects -32601 immediately.
  // Without a timeout a page waits forever on a wallet that has already
  // decided to do nothing.
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`wallet did not answer ${method} within ${Math.round(timeoutMs / 1000)}s`);
      error.code = 'TIMEOUT';
      reject(error);
    }, timeoutMs);
  });

  try {
    const response = await Promise.race([
      Promise.resolve(provider.request(method, params)),
      timeout
    ]);

    // Some providers resolve with an error payload rather than rejecting.
    if (response && typeof response === 'object') {
      if (response.error) {
        const error = new Error(
          typeof response.error === 'string' ? response.error : JSON.stringify(response.error)
        );
        error.code = response.error?.code;
        throw error;
      }
      if (response.status === 'error') {
        throw new Error(JSON.stringify(response.result || response));
      }
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
}

// Wallets nest the address differently, and move it between versions.
export function extractAddress(payload, depth = 0) {
  if (depth > 7 || payload == null) return null;

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return /^S[PMTN][0-9A-Z]{20,}$/i.test(trimmed) ? trimmed.toUpperCase() : null;
  }
  if (Array.isArray(payload)) {
    // Prefer an entry that says it is STX over one that merely looks like it.
    const labelled = payload.find(
      (item) => item && typeof item === 'object' && /stx/i.test(String(item.symbol || item.type || ''))
    );
    if (labelled) {
      const hit = extractAddress(labelled, depth + 1);
      if (hit) return hit;
    }
    for (const item of payload) {
      const hit = extractAddress(item, depth + 1);
      if (hit) return hit;
    }
    return null;
  }
  if (typeof payload !== 'object') return null;

  for (const key of ['address', 'stxAddress', 'selectedAddress', 'addresses', 'accounts', 'result', 'mainnet', 'stx']) {
    if (key in payload) {
      const hit = extractAddress(payload[key], depth + 1);
      if (hit) return hit;
    }
  }
  return null;
}

export function networkFromAddress(address) {
  const prefix = String(address || '').slice(0, 2).toUpperCase();
  if (prefix === 'SP' || prefix === 'SM') return 'mainnet';
  if (prefix === 'ST' || prefix === 'SN') return 'testnet';
  return null;
}

// Methods that ask a wallet who it is, in the order least likely to annoy.
// getAddresses answers on both wallets without a permission storm; the rest are
// fallbacks for older builds.
const ADDRESS_METHODS = [
  'getAddresses',
  'stx_getAddresses',
  'wallet_connect',
  'stx_getAccounts',
  'wallet_getAccount',
  'stx_requestAccounts'
];

/**
 * Connect, and reuse an existing session when the host already has one.
 *
 * The Xtrata runtime and the arcade launcher both publish a session so that a
 * framed app does not have to re-prompt. A locked Leather can take twenty
 * seconds to answer, so one interactive read per page lifecycle is the budget.
 */
export async function connectWallet({ preferredLabel, onLog } = {}) {
  const log = onLog || (() => {});

  const shared =
    globalThis.ArcadeWalletSession ||
    globalThis.XtrataWalletSession ||
    globalThis.__xtrataWalletSession;
  const sharedAddress = extractAddress(shared);
  if (sharedAddress) {
    log('ok', 'reused the session the host already had', sharedAddress);
    return {
      address: sharedAddress,
      network: networkFromAddress(sharedAddress) || 'mainnet',
      via: 'host-session',
      provider: resolveProvider(preferredLabel)
    };
  }

  const entry = await waitForProvider();
  if (!entry) {
    const error = new Error('no Stacks wallet found');
    error.code = 'NO_WALLET';
    throw error;
  }
  log('info', `using ${entry.label}`, {
    framed: isFramed(),
    hostBridge: usingHostBridge(),
    shim: shimInstalled()
  });

  let lastError = null;
  for (const method of ADDRESS_METHODS) {
    try {
      // A locked wallet can take a long time to answer the first call.
      const result = await walletRequest(entry, method, {}, { timeoutMs: 45_000 });
      const address = extractAddress(result);
      if (address) {
        const session = {
          address,
          network: networkFromAddress(address) || 'mainnet',
          via: method,
          provider: entry
        };
        try {
          globalThis.XtrataWalletSession = { address, network: session.network };
        } catch {
          // Sandboxed pages can throw on window writes. Not worth failing over.
        }
        log('ok', `connected via ${method}`, address);
        return session;
      }
      log('warn', `${method} answered without an address`, result);
    } catch (error) {
      lastError = error;
      log('warn', `${method}: ${error.message}`);
    }
  }

  const error = new Error(
    `wallet found (${entry.label}) but no method returned an address${lastError ? `: ${lastError.message}` : ''}`
  );
  error.code = 'NO_ADDRESS';
  throw error;
}

export const BRIDGE = { REQUEST: BRIDGE_REQUEST, RESPONSE: BRIDGE_RESPONSE };
