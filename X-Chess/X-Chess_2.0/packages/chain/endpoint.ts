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
  //
  // WHY THE FIRST ENTRY IS SPELLED IN TWO PIECES.
  //
  // The Xtrata runtime rewrites `https://api.<network>.hiro.so` to its own proxy
  // in any text/html it serves. That is reasonable for a URL the page will
  // fetch, and it is a blind find-and-replace, so it also rewrote THIS TABLE -
  // the fallback list whose entire purpose is to survive one host going away.
  //
  // The effect under the runtime was that the served bytes no longer contained
  // the primary public host at all, and since endpointsFor unshifts the proxy on
  // top, entries 0 and 1 both pointed at the proxy and failed together. A list
  // of three had quietly become a list of two, one of which was a duplicate.
  //
  // Splitting the literal defeats the pattern without changing the value. It
  // must stay a `join` and not a `+`: esbuild folds string concatenation back
  // into a single literal, which the rewrite would match again. There is a test
  // over the BUILT file that fails exactly when the minifier changes its mind.
  //
  // This does not cost the operator the rate-limit protection it was added for:
  // underXtrataRuntime() puts the proxy first on its own evidence - the injected
  // script tags - and never depended on the rewritten string.
  mainnet: [
    ['https://api', 'mainnet.hiro.so'].join('.'),
    'https://stacks-node-api.stacks.co',
    'https://api.hiro.so'
  ],
  testnet: [
    ['https://api', 'testnet.hiro.so'].join('.'),
    'https://stacks-node-api.testnet.stacks.co'
  ],
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
  /** The clock, so the preference decay below can be tested without waiting. */
  now?: () => number;
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
 * The remaining-allowance headers, in the spellings seen in the wild.
 *
 * Shared by the two places that read them, because a permanent artefact should
 * not carry the same array twice.
 */
const BUDGET_HEADERS = ['x-ratelimit-remaining-minute', 'ratelimit-remaining'];

/**
 * How little allowance has to be left for a total failure to read as a rate
 * limit rather than an outage.
 *
 * The anonymous budget is fifty a minute — measured, `x-ratelimit-limit-minute`
 * — and a board watching one live game spends about two requests a poll. So a
 * handful remaining is not "nearly out", it is "out within a second or two",
 * which is exactly the window in which the next read fails.
 *
 * Small on purpose. Reporting an outage as a rate limit sends somebody to wait
 * when the host is genuinely gone, and that is the more misleading of the two
 * mistakes: waiting out a dead host never ends.
 */
const BUDGET_NEARLY_GONE = 4;

/**
 * How long the whole page stays quiet after concluding it is rate limited.
 *
 * The allowance refills per minute, so a full minute would be the certain
 * answer and a bad one: it stops a board dead for a minute over one unlucky
 * burst. Twelve seconds is about a block, long enough for a per-second limit to
 * clear completely and for a per-minute one to recover a usable slice, and
 * short enough that a game being watched picks up again within a move.
 *
 * If it is still exhausted the next attempt costs one sweep and puts the wall
 * straight back up, so being wrong here is self-correcting in the cheap
 * direction.
 */
const COOLDOWN_MS = 12_000;

/**
 * A fetch that tries every base, preferring the one that last answered.
 *
 * The choice is remembered, so one bad response does not make every later call
 * pay for two - but it EXPIRES, so a host that recovers is returned to. An
 * inscription cannot be corrected, so degrading is the only acceptable
 * behaviour: a board that broke because one host went away would break
 * permanently, and a board that never went back to it would be running on its
 * last fallback within a day.
 */
export function makeEndpoint(options: EndpointOptions = {}): Endpoint {
  const doFetch = options.fetch ?? (globalThis.fetch?.bind(globalThis) as typeof fetch);
  const bases = endpointsFor(options);
  const now = options.now ?? (() => Date.now());
  let index = 0;
  let remaining: number | null = null;

  /**
   * When it is worth asking again, after concluding we are rate limited.
   *
   * A SHARED SILENCE, and that is the point. Eight call sites reach for this
   * endpoint - the log, the mempool, names, block times, the game list, the
   * leaderboard - and each one previously discovered the rate limit for itself,
   * by spending requests on it. Labelling the failure correctly stopped the
   * RETRIES; it did nothing about the other seven callers still firing into an
   * allowance everybody already knew was gone. In a browser each of those lands
   * as a CORS error, so the console fills with them while the board is doing
   * nothing wrong except asking.
   *
   * So the first caller to find the wall puts it up for everybody, and until it
   * comes down nothing reaches the network at all. Failing without a request is
   * the only response that actually helps: the allowance refills on a clock,
   * and every request made meanwhile is one the refill has to outrun.
   */
  let coolUntil = 0;
  /** When the current preference stopped being the first base. */
  let preferredAt = 0;

  /**
   * How long a fallback stays preferred before the first base is tried again.
   *
   * Wrapping around the list stops a failure being fatal, but on its own it does
   * not bring the primary back: once the board is pinned to the second host,
   * that host answers first and the first host is never reached. So the
   * preference has to expire.
   *
   * A minute is chosen against what it costs to be wrong in each direction. Too
   * short and every recovery attempt spends a timeout on a host that is still
   * down; too long and the board sits on a fallback for an afternoon. At a
   * minute, a still-dead primary costs one failed attempt per minute against a
   * poll that runs every few seconds, and a recovered one is picked up while
   * somebody is still looking at the board.
   */
  const PREFER_MS = 60_000;

  /**
   * How many times to sweep every base before reporting a failure, and how long
   * to wait between sweeps.
   *
   * Three sweeps at 600ms and 1200ms adds under two seconds to the worst case
   * and removes nearly every transient banner - the board polls every few
   * seconds, so two seconds of quiet retrying is invisible where a red notice
   * is not. Deliberately small: this must never turn one struggling page into a
   * page hammering a host that is already struggling, which is how a rate limit
   * becomes a longer rate limit.
   */
  const SWEEPS = 3;
  const RETRY_MS = 600;
  const pause = (ms: number): Promise<void> =>
    new Promise((done) => {
      setTimeout(done, ms);
    });

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

  /**
   * A failing response that SAYS it is a rate limit, whatever its status code.
   *
   * `Retry-After` on a refusal, or a remaining-allowance header reading zero,
   * are the host telling us in as many words. Header names vary in the wild, so
   * the same two spellings `noteBudget` accepts are accepted here.
   */
  const rateLimitedByHeader = (response: Response): boolean => {
    if (response.headers?.get?.('retry-after') != null) return true;
    for (const header of BUDGET_HEADERS) {
      // The null check is load-bearing: `Number(null)` is 0, so dropping it
      // reads every response with no allowance header as an exhausted one, and
      // reports a plain outage as a rate limit.
      const raw = response.headers?.get?.(header);
      if (raw != null && Number(raw) === 0) return true;
    }
    return false;
  };

  const noteBudget = (response: Response): void => {
    // Whichever spelling is present wins.
    for (const header of BUDGET_HEADERS) {
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
    /**
     * One read, across every base, retried.
     *
     * A SWEEP OF THREE HOSTS THAT SHARE ONE RATE-LIMIT BUCKET IS NOT THREE
     * CHANCES. It is one, tried three ways - the comment on `PUBLIC_API` says so
     * - and this used to sweep once and give up. So a single bad moment produced
     * "Could not reach any Stacks endpoint" on a page that was working a second
     * earlier and would work a second later. Reported from a local board while
     * something else on the same address was reading hard.
     *
     * Sweeping again after a pause is the whole fix. The budget refills on a
     * clock, so the second sweep is not the same attempt repeated - it is an
     * attempt under different conditions, which is the only kind worth making.
     *
     * ONLY READS COME THROUGH HERE. A wallet broadcasts through its own
     * provider, so nothing in this retry can resend a transaction.
     */
    async request(path: string, init?: RequestInit): Promise<Response> {
      // Refuse without touching the network while the wall is up. Every caller
      // meets it, which is what makes the silence worth anything.
      if (now() < coolUntil) {
        const error = new Error(
          'this page is rate limited and is waiting rather than asking again. ' +
            'The chain is fine; it will resume on its own in a few seconds.'
        );
        (error as Error & { code?: string }).code = 'RATE_LIMITED';
        throw error;
      }

      let lastFailure: unknown = null;
      for (let sweep = 1; sweep <= SWEEPS; sweep++) {
        try {
          return await sweepBases(path, init);
        } catch (error) {
          lastFailure = error;
          const code = (error as Error & { code?: string }).code;

          // ONLY UNREACHABILITY IS RETRIED, and the exclusion is the important
          // half.
          //
          // A rate limit does not refill in a second - the window is a minute -
          // so sweeping again cannot succeed, and it triples the load on hosts
          // that are already refusing us. Retrying there would make the very
          // condition it was trying to survive worse, and the board has a
          // separate, slower answer for it: the poller reads `remaining` and
          // backs off by minutes, not milliseconds.
          //
          // A misconfiguration is not transient either, and sweeping would only
          // make the same complaint twice, more slowly.
          if (code !== 'CHAIN_UNAVAILABLE') throw error;
          if (sweep === SWEEPS) break;
          await pause(RETRY_MS * sweep);
        }
      }
      throw lastFailure;
    }
  };

  async function sweepBases(path: string, init?: RequestInit): Promise<Response> {
    {
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

      // EVERY base gets tried, starting from the remembered one and WRAPPING.
      //
      // This used to run `attempt = index; attempt < bases.length`, which made
      // the fallback a one-way ratchet: bases before the remembered one were
      // never retried, and `index` only ever moved forward, so a host that came
      // back was never returned to. After two bad moments the board was pinned
      // to the last entry, the list was a single point of failure, and one wobble
      // in that entry reported "no Stacks endpoint answered" with healthy hosts
      // sitting untried. That is what the first testers hit switching between
      // games, and it is the exact opposite of what a list of hosts is for.
      //
      // `index` is a PREFERENCE now, not a floor.
      // Let the preference expire, so a recovered primary is actually returned
      // to rather than being abandoned for the life of the page.
      if (index !== 0 && now() - preferredAt >= PREFER_MS) index = 0;

      const started = index;
      for (let n = 0; n < bases.length; n++) {
        const attempt = (started + n) % bases.length;
        const base = bases[attempt];
        try {
          const response = await doFetch(`${base}${path}`, init);
          noteBudget(response);
          // A 4xx is the chain answering. Only 5xx, 429 and transport failures
          // mean this base is not usable.
          if (!unavailable(response)) {
            if (attempt !== started) {
              options.onFallback?.(bases[started], base);
              // Whatever answered becomes the preference, including a base
              // EARLIER in the list than the one we started from.
              //
              // `preferredAt` records when the preference MOVED, not when it
              // last worked. Stamping it on every success would restart the
              // window on each request and the decay above could never fire.
              index = attempt;
              preferredAt = now();
            }
            return response;
          }
          // A 429 says it outright. Not every host does: some answer 503 and
          // put the truth in a header instead, and reporting that as "the chain
          // is unreachable" sends somebody looking for a problem that is not
          // there when the advice they need is "wait a minute".
          //
          // Only ON EVIDENCE, never by guessing from the status code. A bare 503
          // is a host with a problem, and saying otherwise would be the same
          // mistake in the opposite direction.
          if (response.status === 429 || rateLimitedByHeader(response)) limited = true;
          lastError = new Error(`${base} answered ${response.status}`);
        } catch (error) {
          lastError = error;
        }
      }

      // Nothing answered. Move the preference off the base that led this round,
      // so the next call does not pay for the same dead host's timeout first.
      index = (started + 1) % bases.length;

      // IN A BROWSER, A RATE LIMIT ARRIVES DISGUISED AS THE NETWORK BEING DOWN,
      // and the check above cannot see through the disguise.
      //
      // Hiro's 429 carries no `Access-Control-Allow-Origin` header — measured,
      // 39 of 39 refusals — so the browser blocks the response before any of
      // this code runs and `fetch` rejects as a transport error. `response` is
      // never reached, `response.status` is never read, and `limited` stays
      // false. The careful distinction directly above is unreachable on the one
      // surface that matters.
      //
      // The evidence that IS readable is what the server said last time it
      // answered at all. `x-ratelimit-remaining-minute` rides every successful
      // response; if it was nearly exhausted and now nothing answers, that is a
      // rate limit and not an outage. Inference from real evidence, rather than
      // a guess: an outage does not politely warn you first that you have two
      // requests left.
      //
      // This matters twice over, because `request` retries CHAIN_UNAVAILABLE and
      // deliberately does not retry a rate limit. Mislabelled, every rate-limited
      // read was being swept three times across three hosts — nine requests into
      // a budget already gone, which is precisely the harm the exclusion exists
      // to prevent.
      if (!limited && typeof remaining === 'number' && remaining <= BUDGET_NEARLY_GONE) {
        limited = true;
      }

      // Being rate limited is not the chain being down, and a board that said
      // so would send somebody looking for a problem that is not there. It is
      // this page having asked too often, which is a thing the person reading
      // can actually wait out.
      if (limited) {
        coolUntil = now() + COOLDOWN_MS;
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
  }
}
