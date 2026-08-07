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

import { parseAddress, bytesToHex } from './clarity.js';

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

// The shim marks every provider it takes over. A marked provider will refuse a
// contract call unless there is a bridge to carry it.
function shimPatched(provider) {
  try {
    return provider?.__xtrataRuntimeWalletPatched === true;
  } catch {
    // Some injected providers throw on unknown property access. Assume the shim
    // did not reach it, which errs towards letting someone try.
    return false;
  }
}

/**
 * Can a move actually be signed from this page?
 *
 * Reading wallet-shim.js, `stx_callContract` is not merely routed through the
 * shim, it is refused outright with -32601 unless a host bridge exists:
 *
 *     if (isContractCallMethod(lower)) {
 *       if (!hasHostBridge()) return Promise.reject(createShimError(
 *         'Wallet contract call requires host wallet bridge support.', -32601));
 *
 * A bridge exists only when the page carries a walletBridgeToken and has a
 * parent or an opener, which is what the Xtrata site supplies. Open the same
 * inscription by its bare URL and the board reads and replays perfectly but
 * cannot sign anything.
 *
 * The shim also patches Leather's provider and the Xverse Stacks providers in
 * place, so having an extension installed is not enough on its own. What is
 * enough is a provider the shim did not reach, such as Xverse's BitcoinProvider.
 * walletCall already falls through to one of those on -32601; this only reports
 * whether such a provider is there to fall through to.
 */
export function canSignHere() {
  if (usingHostBridge()) return true;
  if (!shimInstalled()) return true;
  return collectProviders().some((entry) => !shimPatched(entry.provider));
}

/**
 * Why signing is unavailable, or null when it is available.
 *
 * Separate from canSignHere so a caller can say something useful rather than
 * only that something is wrong. Both cases below are worth distinguishing: one
 * is fixed by opening a different link, the other by installing a wallet.
 */
export function signingBlockedReason() {
  if (canSignHere()) return null;
  return collectProviders().length ? 'no-bridge' : 'no-wallet';
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

  // Astro Blaster's weights, kept verbatim. The one that matters most is
  // bitcoinprovider: Xverse injects both a StacksProvider whose request() is a
  // stub that throws "request function is not implemented", and a
  // BitcoinProvider that is the real sats-connect surface and answers stx_*
  // methods properly. Ranking StacksProvider first, as an alphabetical or
  // name-based ordering would, picks the broken one every time.
  const score = (item) => {
    const label = String(item.label || '').toLowerCase();
    let value = 0;
    // Astro Blaster ranks transactionRequest +100 because it calls that path.
    // This board never does: it only speaks request(), and a provider is useful
    // here exactly insofar as request() works. Scoring a capability we do not
    // use put Xverse's stub StacksProvider, which has transactionRequest, above
    // the BitcoinProvider that actually answers.
    if (item.hasRequest) value += 10;
    else if (item.hasTransactionRequest) value -= 50;
    if (label.includes('bitcoinprovider')) value += 40;
    if (label.includes('xverse')) value += 20;
    if (label.startsWith('registry:')) value += 15;
    // Inside the Xtrata runtime the shim is window.StacksProvider and may be
    // the only route to a wallet, so it outranks everything there.
    if (shim && label === 'window.stacksprovider') value += 120;
    else if (label === 'window.stacksprovider') value -= 10;
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
// Some providers exist, expose request(), and then refuse everything. Xverse's
// StacksProvider throws "request function is not implemented" for every method;
// others answer -32601. Either way the right move is the next provider, not a
// failure, which is what the Xtrata shim does with the same error string.
// Cancelling is not failing. A wallet that says the user declined has done its
// job, and telling someone to go try other parameter shapes because they chose
// Cancel is both wrong and alarming.
export function userCancelled(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    error?.code === 4001 ||
    message.includes('cancel') ||
    message.includes('reject') ||
    message.includes('declin') ||
    message.includes('denied')
  );
}

/**
 * Did this fail because the page has no wallet bridge?
 *
 * The shim rejects a contract call with -32601 and this wording when there is no
 * host to carry it. -32601 alone is not enough to go on: it is also how a
 * provider says it has never heard of a method.
 */
export function needsWalletBridge(error) {
  return String(error?.message || '')
    .toLowerCase()
    .includes('host wallet bridge');
}

export function providerCannot(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    error?.code === -32601 ||
    message.includes('not implemented') ||
    message.includes('method not found') ||
    message.includes('unsupported method')
  );
}

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

/**
 * Call a method against the best provider that can actually perform it.
 *
 * Tries each discovered provider in order, moving on when one says it cannot do
 * the method rather than giving up. A page with Xverse installed sees two
 * providers where only the second works, so stopping at the first is the
 * difference between connecting and not.
 */
export async function walletCall(method, params, { timeoutMs, onLog } = {}) {
  const log = onLog || (() => {});
  const found = collectProviders();

  if (!found.length) {
    const error = new Error('no Stacks wallet found');
    error.code = 'NO_WALLET';
    throw error;
  }

  let lastError = null;
  for (const entry of found) {
    try {
      // params may be a function, so a caller can shape the payload to the
      // provider that is actually going to receive it.
      const payload = typeof params === 'function' ? params(entry) : params;
      const result = await walletRequest(entry, method, payload, { timeoutMs });
      return { result, entry };
    } catch (error) {
      lastError = error;
      if (providerCannot(error)) {
        log('info', `${entry.label} cannot do ${method}, trying the next provider`);
        continue;
      }
      // A real rejection (user cancelled, bad params) is an answer, not a
      // reason to go asking a different wallet the same question.
      throw error;
    }
  }

  throw lastError || new Error(`no provider could perform ${method}`);
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
// Order matters, and not for speed. Xverse answers getAddresses silently from
// its cache, so leading with it "connects" without the wallet ever appearing,
// which looks broken and gives no chance to pick an account. stx_getAccounts
// and wallet_connect raise a real prompt. Silent methods stay as fallbacks for
// wallets that have no prompting equivalent.
const ADDRESS_METHODS = [
  'wallet_connect',
  'stx_requestAccounts',
  'stx_getAccounts',
  'getAddresses',
  'stx_getAddresses',
  'wallet_getAccount'
];

// Probing is not signing. A wallet that has not answered a "who are you" call in
// this long is not going to, and waiting the full signing timeout on each of six
// methods leaves the button looking dead for minutes. Xverse never answers
// stx_getAccounts at all, so this is the difference between a pause and a hang.
//
// The first call gets the long budget because it may be sitting behind an unlock
// screen, and someone typing a password needs more than a moment.
const PROBE_TIMEOUT_MS = 15_000;

// Once any provider has answered anything, the wallet is awake and unlocked.
// From then on a method it intends to answer answers immediately, and one it
// does not is not going to start. Measured against Xverse under the runtime:
// three of the six methods never settle at all, and at the full budget that is
// forty-five seconds of a Connect button that looks broken.
const AWAKE_PROBE_TIMEOUT_MS = 3_000;

// Connect methods raise the wallet's chooser. Some answer it and still hand back
// no address, which is not a failure, it is a wallet that has connected and
// expects to be asked separately who it connected as.
function isConnectish(method) {
  return method === 'wallet_connect' || method === 'stx_requestAccounts';
}

// The method that actually produces an address once a wallet is connected.
// Trying it straight after a connect skips the ones in between that hang.
const READ_AFTER_CONNECT = 'stx_getAddresses';

// What to send with each address method.
//
// wallet_connect remembers. Once a wallet has been chosen it answers from its
// own session, so the second Connect is silent and the person is stuck with
// whichever account they picked first. forceWalletSelect asks it to put the
// chooser up regardless, and persistWalletSession false stops it caching the
// answer for next time. Both are ignored by wallets that do not know them.
function paramsFor(method, forcePrompt) {
  if (method !== 'wallet_connect') return {};
  return forcePrompt
    ? { forceWalletSelect: true, persistWalletSession: false }
    : {};
}

/**
 * Connect, and reuse an existing session when the host already has one.
 *
 * The Xtrata runtime and the arcade launcher both publish a session so that a
 * framed app does not have to re-prompt. A locked Leather can take twenty
 * seconds to answer, so one interactive read per page lifecycle is the budget.
 */
export async function connectWallet({ preferredLabel, onLog, forcePrompt = false } = {}) {
  const log = onLog || (() => {});

  // A canary wants to see the wallet appear, so it asks for the prompt even when
  // a session is already lying around. Ordinary pages take the cached one.
  const shared = forcePrompt
    ? null
    :
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

  const first = await waitForProvider();
  if (!first) {
    const error = new Error('no Stacks wallet found');
    error.code = 'NO_WALLET';
    throw error;
  }

  const all = collectProviders();
  // An explicit choice is a choice: try only that provider, so picking one in a
  // dropdown means something. Without a choice, try them all in ranked order.
  const chosen = preferredLabel ? all.filter((entry) => entry.label === preferredLabel) : [];
  const found = chosen.length ? chosen : all;

  if (preferredLabel && !chosen.length) {
    log('warn', `${preferredLabel} is no longer present, falling back to whatever is`);
  }

  log('info', `${found.length} provider(s) to try`, {
    order: found.map((entry) => entry.label),
    chosen: preferredLabel || '(best available)',
    framed: isFramed(),
    hostBridge: usingHostBridge(),
    shim: shimInstalled()
  });

  // Method-first, provider-second. A wallet that cannot do getAddresses may
  // still answer wallet_connect, and a provider that refuses everything must not
  // stop us reaching the one beside it that works.
  //
  // The order is deliberately not tuned for any one wallet: it is what decides
  // whether the chooser appears, and demoting a prompting method to reach a
  // faster one would trade a visible wallet for a silent reconnect. What is
  // tuned is how long we wait, and jumping ahead when a connect has already told
  // us the wallet is there.
  let lastError = null;
  let awake = false;
  const tried = new Set();

  // Returns the session when one was found, and otherwise says whether the
  // provider answered at all. The difference matters: a connect that answered
  // without an address means the wallet is there and can be asked again, while
  // one that threw means this route is closed and the normal order should
  // continue undisturbed.
  const attempt = async (method, entry) => {
    const key = `${method}|${entry.label}`;
    if (tried.has(key)) return { answered: false };
    tried.add(key);

    try {
      const result = await walletRequest(entry, method, paramsFor(method, forcePrompt), {
        timeoutMs: awake ? AWAKE_PROBE_TIMEOUT_MS : PROBE_TIMEOUT_MS
      });
      // It answered, so whatever else is true, it is not locked or asleep.
      awake = true;

      const address = extractAddress(result);
      if (address) {
        const session = {
          address,
          network: networkFromAddress(address) || 'mainnet',
          via: `${method} on ${entry.label}`,
          provider: entry
        };
        try {
          globalThis.XtrataWalletSession = { address, network: session.network };
        } catch {
          // Sandboxed pages can throw on window writes. Not worth failing over.
        }
        log('ok', `connected via ${method} on ${entry.label}`, address);
        return { session, answered: true };
      }
      log('warn', `${entry.label} answered ${method} without an address`, result);
      return { answered: true };
    } catch (error) {
      lastError = error;
      // A refusal is still an answer. Only a timeout leaves us none the wiser
      // about whether anyone is home.
      if (error.code !== 'TIMEOUT') awake = true;
      if (providerCannot(error)) {
        log('info', `${entry.label} does not implement ${method}`);
      } else {
        log('warn', `${entry.label} ${method}: ${error.message}`);
      }
      return { answered: false };
    }
  };

  for (const method of ADDRESS_METHODS) {
    for (const entry of found) {
      const outcome = await attempt(method, entry);
      if (outcome.session) return outcome.session;

      // A connect that answered without naming anybody means the wallet is now
      // connected and simply expects to be asked who it connected as. Ask it
      // now rather than walking the methods in between, which is where Xverse
      // under the runtime loses most of its time: it answers wallet_connect,
      // hands back no address, then never settles the next three at all.
      //
      // Only after an answer. Jumping ahead on a refusal would reach a silent
      // read before the prompting methods have had their turn, and a Connect
      // that never shows the wallet is the bug this ordering exists to avoid.
      if (outcome.answered && isConnectish(method)) {
        const followUp = await attempt(READ_AFTER_CONNECT, entry);
        if (followUp.session) return followUp.session;
      }
    }
  }

  const error = new Error(
    `found ${found.length} provider(s) but none returned an address` +
      (lastError ? `. Last error: ${lastError.message}` : '')
  );
  error.code = 'NO_ADDRESS';
  throw error;
}

/**
 * Ask the wallet to forget too.
 *
 * Clearing our own session is not enough: the wallet keeps its own, and the
 * next Connect would be answered from it without asking. Wallets that do not
 * implement this simply say so, which is not a failure.
 */
export async function disconnectWallet({ onLog } = {}) {
  const log = onLog || (() => {});
  for (const entry of collectProviders()) {
    for (const method of ['wallet_disconnect', 'stx_disconnect', 'disconnect']) {
      try {
        await walletRequest(entry, method, {}, { timeoutMs: 5_000 });
        log('info', `${entry.label} disconnected via ${method}`);
        break;
      } catch {
        // Try the next spelling, then the next provider.
      }
    }
  }

  for (const key of ['XtrataWalletSession', 'ArcadeWalletSession', '__xtrataWalletSession']) {
    try {
      delete globalThis[key];
    } catch {
      // Sandboxed pages can refuse window writes.
    }
  }
}

/**
 * Post conditions for a call that may move STX.
 *
 * A contract that transfers nothing wants deny with an empty list: the wallet
 * then refuses any transfer at all, which is the strongest thing that can be
 * asked for and is exactly right for v1.
 *
 * A contract that charges a fee cannot use that. Deny with no conditions
 * forbids the very transfer the contract is about to make, so every call aborts.
 * The fix is not to give up and allow everything: it is to permit exactly the
 * fee and nothing more, so a contract that tried to take more would still fail.
 *
 * Wallets have spelled post conditions two ways. The object form below is what
 * current sats-connect and Leather expect; `shape` exists so a canary can fall
 * back rather than leaving somebody stuck.
 */
/**
 * The transaction fee to suggest for a call, in microSTX.
 *
 * This is the network's fee for including the transaction, and is a different
 * thing from whatever the contract charges for playing. Left alone, wallets
 * suggest around 0.5 STX for a call that uses 9,150 units of a 5,000,000,000
 * runtime budget, which would make the fee the dominant cost of a move.
 *
 * Sent as a number rather than a string. Nothing in this repo had ever set a
 * fee through a wallet, so the string form was a guess, and Xverse ignored it
 * and went on estimating. A number is what a wallet building the transaction
 * would parse.
 *
 * Only `fee`, and deliberately not `feeRate` as well.
 *
 * `feeRate` was sent alongside on the reasoning that an unknown key is ignored,
 * so spelling it both ways could only help. That reasoning is wrong for this
 * particular key: a rate is a fee *per byte*, and a wallet reading 10,000 there
 * would compute a fee two orders of magnitude too large rather than ignore it.
 * Xverse has quoted both 0.003 STX and 0.5 STX for the same 10,000 we sent, and
 * 0.5 STX is what 10,000 per byte comes to on a transaction this size.
 *
 * Whether that is the cause is not proven — wallets estimate from the mempool
 * and their own numbers move. But a key that can only ever be misread as a
 * hundredfold overcharge is not worth sending on the chance a wallet reads it
 * the way we meant.
 *
 * A wallet is still free to overrule this and show its own estimate; the figure
 * is editable in the wallet either way.
 */
/**
 * Is this provider one that validates against the sats-connect schema?
 *
 * Xverse does, and the schema for stx_callContract knows only contract,
 * functionName, functionArgs/arguments, postConditions and postConditionMode.
 * Out-of-spec fields are not uniformly ignored: xtrata-2.0's wallet layer
 * records that Xverse mobile reads an unknown `sender` field as "sign as this
 * address" and rejects the request before showing any confirmation UI.
 */
function validatesAgainstSchema(entry) {
  const label = String(entry?.label || '').toLowerCase();
  // The runtime shim stands in for whatever the host has, which may well be
  // Xverse, and the host rebuilds the params anyway. Sending it the narrow
  // shape costs nothing and cannot trip a schema check.
  return label.includes('xverse') || label.includes('stacksprovider') || label.includes('bitcoinprovider');
}

/**
 * The parameters to send this particular provider.
 *
 * Two shapes, because one does not fit. A wallet that validates gets exactly
 * the fields its schema names; anything else gets those plus the fee, which is
 * the only place a fee has ever had an effect.
 *
 * Worth being plain about the limit: under the Xtrata runtime none of this
 * reaches the wallet unchanged. The host parses the request and keeps only the
 * contract, the function, its arguments, the network and the post conditions —
 * `fee` is dropped before a wallet sees it. An inscribed board cannot set the
 * network fee. What it can do is not send fields that might get it rejected,
 * and say clearly what the fee ought to be.
 */
export function contractCallParams(entry, params) {
  const {
    contract, functionName, functionArgs, postConditionMode, postConditions
  } = params;

  const core = {
    contract,
    functionName,
    functionArgs,
    // Older builds validate with a schema that reads `arguments` and silently
    // drop `functionArgs`. Both spellings, as xtrata-2.0 settled on.
    arguments: functionArgs,
    postConditionMode,
    postConditions
  };

  if (validatesAgainstSchema(entry)) return core;
  return { ...core, network: params.network, ...callFeeParams(params.fee) };
}

export function callFeeParams(microStx) {
  const fee = Number(microStx);
  if (!Number.isFinite(fee) || fee <= 0) return {};
  return { fee };
}

// Fungible condition codes, as they appear on the wire.
const SENT_EQUAL_TO = 0x01;
const SENT_LESS_THAN_OR_EQUAL_TO = 0x05;

/**
 * A serialised STX post condition.
 *
 *   00        STX condition
 *   02        standard principal
 *   version   one byte
 *   hash160   twenty bytes
 *   code      one byte
 *   amount    eight bytes, big endian
 *
 * A hex string, not an object. Xverse accepts this and hangs on the object form
 * without ever settling the promise, which reads as a wallet that never opened.
 * This repo's wallet canary settled on this shape and it is what the arcade
 * sends, so it is copied rather than reinvented.
 */
export function stxPostConditionHex(address, amountMicro, code = SENT_LESS_THAN_OR_EQUAL_TO) {
  const { version, hash160 } = parseAddress(address);
  const amount = BigInt(amountMicro).toString(16).padStart(16, '0');
  const versionHex = version.toString(16).padStart(2, '0');
  const codeHex = Number(code).toString(16).padStart(2, '0');
  return `00${'02'}${versionHex}${bytesToHex(hash160)}${codeHex}${amount}`;
}

/**
 * Post conditions for a call that may move STX.
 *
 * A contract that transfers nothing wants deny with an empty list: the wallet
 * then refuses any transfer at all, which is the strongest thing that can be
 * asked for and is exactly right for v1.
 *
 * A contract that charges cannot use that. Deny with no conditions forbids the
 * very transfer the contract is about to make, so every call aborts. The fix is
 * not to allow everything but to cap what may leave.
 *
 * The cap is "at most the fee" rather than "exactly the fee". Both bound the
 * loss identically, but if the owner lowers the fee between the board reading it
 * and the wallet signing, an exact condition fails a transaction that was
 * perfectly fine. A cap does not.
 */
export function feePostConditions({ sender, fee, shape = 'strict' }) {
  const amount = Number(fee) || 0;

  if (!amount) {
    // Nothing should move. Say so as forcefully as the wallet allows.
    return { postConditionMode: 'deny', postConditions: [] };
  }

  if (shape === 'allow') {
    // A last resort. The transfer will go through, but so would a larger one,
    // so this is weaker than it looks and should not be the default.
    return { postConditionMode: 'allow', postConditions: [] };
  }

  if (shape === 'exact') {
    return {
      postConditionMode: 'deny',
      postConditions: [stxPostConditionHex(sender, amount, SENT_EQUAL_TO)]
    };
  }

  return {
    postConditionMode: 'deny',
    postConditions: [stxPostConditionHex(sender, amount, SENT_LESS_THAN_OR_EQUAL_TO)]
  };
}

export const BRIDGE = { REQUEST: BRIDGE_REQUEST, RESPONSE: BRIDGE_RESPONSE };
