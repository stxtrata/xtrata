// Finding a wallet, and the Xtrata bridge that decides whether one can be
// reached at all.
//
// This is a replication of logic that was arrived at painfully, not a design.
// Every rule below exists because a specific wallet on a specific platform did
// something unhelpful, and the comment says which. Do not simplify any of it
// without re-running harness/wallets/MATRIX.md.
//
// The single most important rule, and the one that is least obvious:
//
//   RESOLVE PROVIDERS PER CALL, NEVER AT STARTUP.
//
// Under the Xtrata runtime the wallet shim installs itself at load and again at
// 400ms, 1400ms, 3200ms and on focus. Anything that captured a provider early
// captured nothing.

export interface ProviderEntry {
  provider: WalletProvider;
  label: string;
  hasRequest: boolean;
  hasTransactionRequest: boolean;
}

export interface WalletProvider {
  request?: (method: string, params?: unknown) => Promise<unknown>;
  transactionRequest?: (payload: unknown) => Promise<unknown>;
  [key: string]: unknown;
}

type Global = typeof globalThis & Record<string, unknown>;

const g = (): Global => globalThis as Global;

// ---------------------------------------------------------------------------
// The Xtrata runtime and its bridge
// ---------------------------------------------------------------------------

export function bridgeToken(): string {
  try {
    return new URLSearchParams(g().location?.search || '').get('walletBridgeToken') || '';
  } catch {
    return '';
  }
}

export function isFramed(): boolean {
  try {
    return g().top !== g().self || Boolean(g().opener);
  } catch {
    // A cross-origin parent throws on access, which itself means we are framed.
    return true;
  }
}

export function shimInstalled(): boolean {
  return g().__xtrataRuntimeWalletShimInstalled === true;
}

/** Running inside the runtime with a host that can reach a wallet for us. */
export function usingHostBridge(): boolean {
  return Boolean(bridgeToken()) && isFramed();
}

/** The shim marks every provider it takes over. */
function shimPatched(provider: WalletProvider | undefined): boolean {
  try {
    return provider?.__xtrataRuntimeWalletPatched === true;
  } catch {
    // Some injected providers throw on unknown property access. Assume the shim
    // did not reach it, which errs towards letting somebody try.
    return false;
  }
}

/**
 * Can anything actually be signed from this page?
 *
 * `stx_callContract` is not merely routed through the shim, it is REFUSED
 * outright with -32601 unless a host bridge exists. A bridge exists only when
 * the page carries a walletBridgeToken and has a parent or an opener, which is
 * what the Xtrata site supplies.
 *
 * So a raw link to `/i/<id>` reads and replays perfectly and cannot sign
 * anything. The board says so up front rather than letting somebody meet it as
 * a failed transaction.
 */
export function canSignHere(): boolean {
  if (usingHostBridge()) return true;
  if (!shimInstalled()) return true;
  // A provider the shim did not reach, such as Xverse's BitcoinProvider, is
  // still a way through.
  return collectProviders().some((entry) => !shimPatched(entry.provider));
}

export type BlockedReason = 'no-bridge' | 'no-wallet' | null;

/**
 * Why signing is unavailable, or null when it is available.
 *
 * Kept apart from canSignHere so the board can say something useful rather than
 * only that something is wrong. The two cases need different advice: one is
 * fixed by opening a different link, the other by installing a wallet.
 */
export function signingBlockedReason(): BlockedReason {
  if (canSignHere()) return null;
  return collectProviders().length ? 'no-bridge' : 'no-wallet';
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

/**
 * Every usable provider in this page, best first.
 *
 * The suppression rules matter more than the ordering:
 *
 *  - Named wallets ALSO publish the generic aliases `window.StacksProvider` and
 *    `window.stacks`, pointing at the same extension. Offering those as
 *    separate candidates makes the user approve twice for one action.
 *  - `window.btc` is Leather's btckit alias. Routing a contract call through it
 *    lands on the deprecated transactionRequest screen, where Confirm is
 *    disabled and there is nothing to do but close it.
 *  - `window.BitcoinProvider` is the same trap for Xverse.
 *
 * The Xtrata shim is the exception to the first rule: when it is installed it
 * IS `window.StacksProvider`, and it may be the only route to a wallet, so it
 * is never suppressed.
 */
export function collectProviders(): ProviderEntry[] {
  const w = g();
  if (typeof w === 'undefined') return [];

  const named = Boolean(w.LeatherProvider || w.XverseProviders || w.xverseProviders);
  const shim = shimInstalled();
  const suppressGeneric = named && !shim;

  const xverse = (w.XverseProviders ?? {}) as Record<string, WalletProvider | undefined>;
  const xverseLower = (w.xverseProviders ?? {}) as Record<string, WalletProvider | undefined>;

  const candidates: [string, unknown][] = [
    ['window.StacksProvider', suppressGeneric ? null : w.StacksProvider],
    ['window.LeatherProvider', w.LeatherProvider],
    ['window.XverseProviders.StacksProvider', xverse.StacksProvider],
    ['window.xverseProviders.StacksProvider', xverseLower.StacksProvider],
    ['window.XverseProviders', w.XverseProviders],
    ['window.xverseProviders', w.xverseProviders],
    ['window.XverseProviders.BitcoinProvider', xverse.BitcoinProvider],
    ['window.btc', w.LeatherProvider ? null : w.btc],
    ['window.stacks', suppressGeneric ? null : w.stacks],
    ['window.BitcoinProvider', w.XverseProviders || w.xverseProviders ? null : w.BitcoinProvider]
  ];

  const out: ProviderEntry[] = [];
  const push = (provider: unknown, label: string): void => {
    if (!provider || typeof provider !== 'object') return;
    const p = provider as WalletProvider;
    const hasRequest = typeof p.request === 'function';
    const hasTransactionRequest = typeof p.transactionRequest === 'function';
    if (!hasRequest && !hasTransactionRequest) return;
    if (out.some((entry) => entry.provider === p)) return;
    out.push({ provider: p, label, hasRequest, hasTransactionRequest });
  };

  for (const [label, provider] of candidates) push(provider, label);

  // Wallets that register rather than inject.
  for (const key of ['btc_providers', 'webbtc_providers', 'wbip_providers']) {
    const registry = w[key];
    if (!Array.isArray(registry)) continue;
    for (const entry of registry) {
      const record = entry as Record<string, unknown>;
      const provider = record?.provider ?? record?.webBtcProvider ?? entry;
      push(provider, `registry:${record?.name ?? record?.id ?? 'unknown'}`);
    }
  }

  return out.sort((a, b) => score(b, shim) - score(a, shim));
}

/**
 * How good a candidate is.
 *
 * The weight that matters most is `bitcoinprovider`. Xverse injects BOTH a
 * StacksProvider whose `request()` is a stub that throws "request function is
 * not implemented", AND a BitcoinProvider that is the real sats-connect surface
 * and answers stx_* methods properly. Ranking StacksProvider first, as any
 * alphabetical or name-based ordering would, picks the broken one every time.
 *
 * Ranking is by `request()`, which is the only method this board ever calls.
 * Scoring `transactionRequest` - a capability we do not use - was what put
 * Xverse's stub above the provider that works.
 */
function score(item: ProviderEntry, shim: boolean): number {
  const label = String(item.label || '').toLowerCase();
  let value = 0;
  if (item.hasRequest) value += 10;
  else if (item.hasTransactionRequest) value -= 50;
  if (label.includes('bitcoinprovider')) value += 40;
  if (label.includes('xverse')) value += 20;
  if (label.startsWith('registry:')) value += 15;
  // Inside the runtime the shim IS window.StacksProvider and may be the only
  // route to a wallet, so it outranks everything there.
  if (shim && label === 'window.stacksprovider') value += 120;
  else if (label === 'window.stacksprovider') value -= 10;
  return value;
}

export function resolveProvider(preferredLabel?: string | null): ProviderEntry | null {
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
 * The shim reinstalls on a schedule and extensions inject at their own pace, so
 * a page that asks once at load and gives up will report no wallet on a machine
 * that has one.
 */
export function waitForProvider({
  timeoutMs = 4000,
  intervalMs = 250,
  now = () => Date.now()
}: { timeoutMs?: number; intervalMs?: number; now?: () => number } = {}): Promise<ProviderEntry | null> {
  return new Promise((resolve) => {
    const immediate = resolveProvider();
    if (immediate) {
      resolve(immediate);
      return;
    }

    const started = now();
    const timer = setInterval(() => {
      const found = resolveProvider();
      if (found || now() - started >= timeoutMs) {
        clearInterval(timer);
        resolve(found ?? null);
      }
    }, intervalMs);
  });
}
