// Calling a wallet, and telling its failures apart.
//
// Distinguishing the failure modes is most of the value here. "The user pressed
// Cancel", "this provider has never heard of that method", "there is no bridge
// to carry a contract call" and "the wallet has decided to say nothing at all"
// need four different responses, and treating any of them as a generic error
// produces either a wrong message or an infinite wait.

import { collectProviders } from './providers.js';
import type { ProviderEntry } from './providers.js';

export type LogLevel = 'info' | 'ok' | 'warn' | 'error';
export type Logger = (level: LogLevel, message: string, detail?: unknown) => void;

export interface WalletError extends Error {
  code?: string | number;
}

/**
 * Cancelling is not failing.
 *
 * A wallet that says the user declined has done its job. Telling somebody to go
 * and try other parameter shapes because they chose Cancel is both wrong and
 * alarming.
 */
export function userCancelled(error: unknown): boolean {
  const err = error as WalletError;
  const message = String(err?.message || '').toLowerCase();
  return (
    err?.code === 4001 ||
    message.includes('cancel') ||
    message.includes('reject') ||
    message.includes('declin') ||
    message.includes('denied')
  );
}

/**
 * Did this fail because the page has no wallet bridge?
 *
 * -32601 alone is not enough to go on: it is also how a provider says it has
 * never heard of a method. The shim's wording is what tells them apart.
 */
export function needsWalletBridge(error: unknown): boolean {
  return String((error as WalletError)?.message || '')
    .toLowerCase()
    .includes('host wallet bridge');
}

/**
 * This provider never answered.
 *
 * A provider that hangs has, in every way that matters, declined - and the next
 * provider is the whole reason the list exists. Kept separate from
 * `providerCannot` because the two are different claims: one is a wallet saying
 * it cannot, the other is a wallet saying nothing at all.
 *
 * Xverse is why this exists. It injects a BitcoinProvider that ranks first
 * because it is usually the working surface, and that provider NEVER SETTLES on
 * `wallet_connect` - no result, no rejection. Treating that as fatal meant the
 * shim-patched StacksProvider sitting right behind it, which connects fine, was
 * never reached.
 */
export function providerDidNotAnswer(error: unknown): boolean {
  return (error as WalletError)?.code === 'TIMEOUT';
}

/** This provider cannot do this method. Move on to the next one. */
export function providerCannot(error: unknown): boolean {
  const err = error as WalletError;
  const message = String(err?.message || '').toLowerCase();
  return (
    err?.code === -32601 ||
    message.includes('not implemented') ||
    message.includes('method not found') ||
    message.includes('unsupported method')
  );
}

export interface RequestOptions {
  timeoutMs?: number;
}

/**
 * One request to one provider.
 *
 * Always the two-argument form. Sniffing `provider.request.length` to choose a
 * calling convention is what previously sent modern providers the legacy object
 * form: rest and default parameters report an arity of 0 or 1, so the sniff was
 * wrong precisely for the wallets that mattered.
 */
export async function walletRequest(
  entry: ProviderEntry,
  method: string,
  params: unknown,
  { timeoutMs = 180_000 }: RequestOptions = {}
): Promise<unknown> {
  const provider = entry?.provider;
  if (!provider || typeof provider.request !== 'function') {
    const error: WalletError = new Error('no wallet provider available');
    error.code = 'NO_WALLET';
    throw error;
  }

  // Leather mobile never settles a request it cannot handle: no result, no
  // rejection, the promise simply hangs. Desktop rejects -32601 at once.
  // Without a timeout a page waits forever on a wallet that has already decided
  // to do nothing.
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const error: WalletError = new Error(
        `wallet did not answer ${method} within ${Math.round(timeoutMs / 1000)}s`
      );
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
      const body = response as Record<string, unknown>;
      if (body.error) {
        const detail = body.error as { code?: number; message?: string };
        const error: WalletError = new Error(
          typeof body.error === 'string' ? body.error : detail.message || JSON.stringify(body.error)
        );
        error.code = detail?.code;
        throw error;
      }
      if (body.status === 'error') {
        throw new Error(JSON.stringify(body.result ?? body));
      }
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export interface CallResult {
  result: unknown;
  entry: ProviderEntry;
}

/**
 * Call a method against the best provider that can actually perform it.
 *
 * Moves on when a provider says it cannot do the method, rather than giving up.
 * A page with Xverse installed sees two providers where only the second works,
 * so stopping at the first is the difference between connecting and not.
 *
 * A real rejection - the user cancelled, the parameters were bad - is an
 * ANSWER, not a reason to go and ask a different wallet the same question.
 */
export async function walletCall(
  method: string,
  params: unknown | ((entry: ProviderEntry) => unknown),
  { timeoutMs, onLog }: RequestOptions & { onLog?: Logger } = {}
): Promise<CallResult> {
  const log: Logger = onLog ?? (() => {});
  const found = collectProviders();

  if (!found.length) {
    const error: WalletError = new Error('no Stacks wallet found');
    error.code = 'NO_WALLET';
    throw error;
  }

  let lastError: unknown = null;
  for (const entry of found) {
    try {
      // params may be a function, so a caller can shape the payload to the
      // provider that is actually going to receive it.
      const payload = typeof params === 'function'
        ? (params as (entry: ProviderEntry) => unknown)(entry)
        : params;
      const result = await walletRequest(entry, method, payload, { timeoutMs });
      return { result, entry };
    } catch (error) {
      lastError = error;
      if ((providerCannot(error) || providerDidNotAnswer(error)) && !needsWalletBridge(error)) {
        log(
          'info',
          providerDidNotAnswer(error)
            ? `${entry.label} did not answer ${method}, trying the next provider`
            : `${entry.label} cannot do ${method}, trying the next provider`
        );
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error(`no provider could perform ${method}`);
}

/**
 * Is this provider one that validates against the sats-connect schema?
 *
 * Xverse does, and the schema for `stx_callContract` knows only contract,
 * functionName, functionArgs/arguments, postConditions and postConditionMode.
 * Out-of-spec fields are NOT uniformly ignored: Xverse mobile reads an unknown
 * `sender` field as "sign as this address" and rejects the request before
 * showing any confirmation at all.
 */
export function validatesAgainstSchema(entry: ProviderEntry): boolean {
  const label = String(entry?.label || '').toLowerCase();
  // The runtime shim stands in for whatever the host has, which may well be
  // Xverse, and the host rebuilds the params anyway. Sending it the narrow
  // shape costs nothing and cannot trip a schema check.
  return (
    label.includes('xverse') ||
    label.includes('stacksprovider') ||
    label.includes('bitcoinprovider')
  );
}

export interface CallRequest {
  contract: string;
  functionName: string;
  functionArgs: string[];
  postConditionMode: 'deny' | 'allow';
  postConditions: string[];
  network: string;
  /**
   * The NETWORK fee to suggest, in microSTX, or undefined to leave it alone.
   *
   * NOTHING IN THIS PROJECT SETS IT, AND A BOARD MUST NOT. The tournament
   * runner pays 400 uSTX for the same `submit` a wallet would quote thousands
   * for, and that saving is not a better guess at the price — it is bought with
   * replace-by-fee. The runner holds the nonce, so forty-five seconds later it
   * re-signs the same one a rung higher and a fee that turned out to be too low
   * has cost it some waiting and nothing else.
   *
   * A board holds no nonce. A move left unmined stays unmined, and submitting
   * it again through a wallet takes the NEXT nonce rather than replacing
   * anything — two transactions, two fees, the same move stored twice. So the
   * cheap number is only safe for the party that can withdraw it, and the
   * remedy for a stuck move belongs to the wallet, which is the only party
   * holding the nonce at all.
   *
   * Where it would go if it were ever set, since the plumbing has moved:
   * `contractCallParams` sends it as `fee`, and a wallet that validates against
   * the sats-connect schema drops it. Under the Xtrata runtime the host rebuilds
   * the request itself and reads `feeMicroStx` — so this spelling would not
   * reach a wallet through the bridge either. Both are facts about plumbing.
   * The reason not to set it is the two paragraphs above.
   */
  fee?: number;
}

/**
 * The parameters to send this particular provider.
 *
 * Two shapes, because one does not fit. A wallet that validates gets exactly
 * the fields its schema names; anything else gets those plus the fee.
 *
 * `feeRate` is deliberately never sent. A rate is a fee PER BYTE, and a wallet
 * reading 10,000 there would compute a fee two orders of magnitude too large
 * rather than ignore it. A key that can only ever be misread as a hundredfold
 * overcharge is not worth sending on the chance a wallet reads it as intended.
 */
export function contractCallParams(entry: ProviderEntry, request: CallRequest): Record<string, unknown> {
  const core = {
    contract: request.contract,
    functionName: request.functionName,
    functionArgs: request.functionArgs,
    // Older builds validate with a schema that reads `arguments` and silently
    // drop `functionArgs`. Both spellings.
    arguments: request.functionArgs,
    postConditionMode: request.postConditionMode,
    postConditions: request.postConditions
  };

  if (validatesAgainstSchema(entry)) return core;

  const fee = Number(request.fee);
  const feeParams = Number.isFinite(fee) && fee > 0 ? { fee } : {};
  return { ...core, network: request.network, ...feeParams };
}

/** Wallets nest the address differently, and move it between versions. */
export function extractAddress(payload: unknown, depth = 0): string | null {
  if (depth > 7 || payload == null) return null;

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return /^S[PMTN][0-9A-Z]{20,}$/i.test(trimmed) ? trimmed.toUpperCase() : null;
  }
  if (Array.isArray(payload)) {
    // Prefer an entry that SAYS it is STX over one that merely looks like it.
    const labelled = payload.find(
      (item) =>
        item &&
        typeof item === 'object' &&
        /stx/i.test(String((item as Record<string, unknown>).symbol ?? (item as Record<string, unknown>).type ?? ''))
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

  const record = payload as Record<string, unknown>;
  for (const key of [
    'address',
    'stxAddress',
    'selectedAddress',
    'addresses',
    'accounts',
    'result',
    'mainnet',
    'stx'
  ]) {
    if (key in record) {
      const hit = extractAddress(record[key], depth + 1);
      if (hit) return hit;
    }
  }
  return null;
}

export function networkFromAddress(address: string | null): 'mainnet' | 'testnet' | null {
  const prefix = String(address || '').slice(0, 2).toUpperCase();
  if (prefix === 'SP' || prefix === 'SM') return 'mainnet';
  if (prefix === 'ST' || prefix === 'SN') return 'testnet';
  return null;
}
