// Which Stacks node this board talks to, and what happens when it stops
// answering.
//
// A Stacks API endpoint is transport. It is unavoidable, and it must never
// become an application-level source of truth or a single permanent dependency.
// So this file holds an ORDERED LIST rather than a host: every entry is
// interchangeable, any of them answering is enough, and the board is correct as
// long as at least one is reachable.
//
// Two things the legacy board learned the hard way are preserved exactly:
//
//   * The Xtrata runtime rewrites `https://api.mainnet.hiro.so` to
//     `/hiro/mainnet` at serve time, but ONLY for `text/html`. Every API call
//     this board makes lives in JavaScript, which is inscribed as JavaScript and
//     never passes through that rewrite. So the code has to choose the proxy for
//     itself, or every viewer burns the public per-IP rate limit.
//
//   * A 404 IS AN ANSWER. It means the contract said "no such thing". Treating
//     it as the endpoint being down would send the board somewhere else looking
//     for a different answer to a question that has already been answered.
//     A transport failure, a 5xx or a 429 counts as an endpoint being
//     unavailable. A 429 is the only one of those three that is about US rather
//     than the host, and it is the one that bit: see `unavailable` below.

export type Network = 'mainnet' | 'testnet' | 'devnet';

export const PUBLIC_API: Record<Network, string[]> = {
  // More than one, deliberately. Naming a single commercial host would make
  // that host a permanent dependency of a permanent artefact.
  //
  // Be clear about what this list does and does not buy, because it is easy to
  // read it as more than it is. Measured on 2026-08-08:
  //
  //   * stacks-node-api.mainnet.stacks.co, the entry that used to be second
  //     here, IS DEAD. It does not connect at all. The list had one live host
  //     and looked like it had two.
  //   * api.mainnet.hiro.so, stacks-node-api.stacks.co and api.hiro.so all
  //     answer - and all SHARE ONE RATE-LIMIT BUCKET. Spending the allowance on
  //     one spends it on all three; they 429 together.
  //
  // So this list is insurance against a host being DOWN, and it is no help
  // whatever against a rate limit. The only defence against a rate limit is to
  // ask for less: see POLL_MS and the budget back-off in the application.
  mainnet: [
    'https://api.mainnet.hiro.so',
    'https://stacks-node-api.stacks.co',
    'https://api.hiro.so'
  ],
  testnet: ['https://api.testnet.hiro.so', 'https://stacks-node-api.testnet.stacks.co'],
  // Empty on purpose, and not an oversight.
  //
  // There is no well-known devnet host: a devnet is somebody's own machine.
  // Writing a default here would put a development address into a permanent
  // artefact, which the serverlessness audit rightly refuses, and it would be a
  // fiction anyway. A devnet user passes an override, which they have to do to
  // reach their own node regardless.
  devnet: []
};

export const PROXY_PATH: Record<Network, string> = {
  mainnet: '/hiro/mainnet',
  testnet: '/hiro/testnet',
  devnet: '/hiro/devnet'
};

/**
 * Is this page being served by the Xtrata runtime?
 *
 * The runtime injects its support scripts into the head before writing the
 * document, so they are already present by the time anything of ours runs.
 * Looking for them is synchronous and needs no network call, unlike probing for
 * the proxy.
 */
export function underXtrataRuntime(doc?: Document): boolean {
  const target = doc ?? (globalThis as { document?: Document }).document;
  if (!target?.querySelectorAll) return false;
  for (const script of target.querySelectorAll('script[src]')) {
    const src = String(script.getAttribute('src') || '');
    if (/(^|\/)runtime\/(wallet-shim|url-support|module-bootstrap)\.js/.test(src)) return true;
  }
  return false;
}

export interface EndpointOptions {
  network?: Network;
  /** A build-time or user-supplied base. Wins over everything, and never falls away. */
  override?: string | null;
  document?: Document;
  fetch?: typeof fetch;
  onFallback?: (from: string, to: string) => void;
}

const trim = (base: string): string => base.replace(/\/+$/, '');

/**
 * The bases to try, best first.
 *
 * An explicit override is a decision rather than a preference, so when one is
 * given it is the only entry: a board pointed at a private node must not
 * silently start talking to a public one.
 */
export function endpointsFor(options: EndpointOptions = {}): string[] {
  const network = options.network ?? 'mainnet';
  const override =
    options.override ?? (globalThis as { __XCHESS_API__?: string }).__XCHESS_API__ ?? null;
  if (override) return [trim(String(override))];

  const bases: string[] = [];
  // The runtime's caching proxy first when we can see we are under it, so that
  // every viewer shares it instead of hammering the public host from one IP.
  if (underXtrataRuntime(options.document)) bases.push(PROXY_PATH[network]);
  bases.push(...PUBLIC_API[network].map(trim));
  return bases;
}

export interface Endpoint {
  /** The base currently in use. */
  readonly base: string;
  /** Every base this endpoint may use, in order. */
  readonly all: readonly string[];
  request(path: string, init?: RequestInit): Promise<Response>;
  /**
   * Requests the current host says are left in this minute, or null if it does
   * not say.
   *
   * Read from the response headers rather than counted here, because the budget
   * is per IP and this board is not the only thing spending it. The WALLET
   * spends from the same budget, for the nonce, the fee estimate and the
   * broadcast, so a board that spends it all stops the player moving at all.
   */
  readonly remaining: number | null;
}

/**
 * What a public endpoint allows an anonymous caller per minute.
 *
 * Hiro's is 50. The number is not load-bearing - the headers are authoritative
 * and this is only the assumption made before any response has been seen - but
 * it is small enough to matter and worth stating.
 */
export const ASSUMED_BUDGET = 50;

/**
 * A fetch that moves to the next base when one stops answering.
 *
 * The choice is remembered, so one bad response does not make every later call
 * pay for two. An inscription cannot be corrected, so degrading is the only
 * acceptable behaviour: a board that broke because one host went away would
 * break permanently.
 */
export function makeEndpoint(options: EndpointOptions = {}): Endpoint {
  const doFetch = options.fetch ?? (globalThis.fetch?.bind(globalThis) as typeof fetch);
  const bases = endpointsFor(options);
  let index = 0;
  let remaining: number | null = null;

  /**
   * 429 IS NOT AN ANSWER, and this is the one place that distinction is made.
   *
   * A 404 is the contract saying "no such thing" and must be believed. A 429 is
   * the HOST saying "not from you, not right now" - it carries no information
   * about the chain at all, and the next base may well answer. Treating it as an
   * answer is what made a rate-limited read surface as "could not read the
   * sponsorship from the chain", which reads like the chain was asked and said
   * nothing, when in truth it was never asked.
   *
   * This mattered more than it sounds. The budget is per IP and the WALLET
   * spends from it too - for the nonce, the fee estimate, and the broadcast
   * itself. A board polling every five seconds can eat the whole minute's
   * allowance and then the wallet's broadcast is refused, which Xverse reports
   * as "unable to parse node response" because a rate-limit body is not the JSON
   * it expects. The board looked fine and the move could not be sent.
   */
  const unavailable = (response: Response | null): boolean =>
    !response || response.status >= 500 || response.status === 429;

  const noteBudget = (response: Response): void => {
    // Several spellings in the wild; whichever is present wins.
    for (const header of ['x-ratelimit-remaining-minute', 'ratelimit-remaining']) {
      const raw = response.headers?.get?.(header);
      if (raw == null) continue;
      const value = Number(raw);
      if (Number.isFinite(value)) {
        remaining = value;
        return;
      }
    }
  };

  return {
    get base(): string {
      return bases[index];
    },
    get all(): readonly string[] {
      return bases;
    },
    get remaining(): number | null {
      return remaining;
    },
    async request(path: string, init?: RequestInit): Promise<Response> {
      if (bases.length === 0) {
        // Only reachable on devnet with no override. Say what to do rather than
        // failing as though the network were down.
        const error = new Error(
          'no endpoint configured for this network. Pass an override, or set __XCHESS_API__.'
        );
        (error as Error & { code?: string }).code = 'NO_ENDPOINT';
        throw error;
      }

      let lastError: unknown = null;
      let limited = false;

      for (let attempt = index; attempt < bases.length; attempt++) {
        const base = bases[attempt];
        try {
          const response = await doFetch(`${base}${path}`, init);
          noteBudget(response);
          // A 4xx is the chain answering. Only 5xx, 429 and transport failures
          // mean this base is not usable.
          if (!unavailable(response)) {
            if (attempt !== index) {
              options.onFallback?.(bases[index], base);
              index = attempt;
            }
            return response;
          }
          if (response.status === 429) limited = true;
          lastError = new Error(`${base} answered ${response.status}`);
        } catch (error) {
          lastError = error;
        }
      }

      // Being rate limited is not the chain being down, and a board that said
      // so would send somebody looking for a problem that is not there. It is
      // this page having asked too often, which is a thing the person reading
      // can actually wait out.
      if (limited) {
        const error = new Error(
          `every endpoint is rate limiting this address (tried ${bases.length}). ` +
            'The chain is fine. This page has asked too many times in the last minute.'
        );
        (error as Error & { code?: string }).code = 'RATE_LIMITED';
        throw error;
      }

      // Every base is unreachable. That is chain unavailability, and the caller
      // must be able to tell it apart from the chain saying no.
      const error = new Error(
        `no Stacks endpoint answered (tried ${bases.length}): ${String(
          (lastError as Error)?.message ?? lastError
        )}`
      );
      (error as Error & { code?: string }).code = 'CHAIN_UNAVAILABLE';
      throw error;
    }
  };
}
