// Endpoint selection and what happens when a node stops answering.
//
// The rule this file defends: an endpoint is transport, never truth. No single
// host may be essential to a permanent artefact, and a host that goes away must
// degrade rather than break, because an inscription cannot be corrected.

import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import {
  PROXY_PATH,
  PUBLIC_API,
  endpointsFor,
  makeEndpoint,
  underXtrataRuntime
} from '../../packages/chain/endpoint.js';

const ok = (body = '{}'): Response => new Response(body, { status: 200 });
const notFound = (): Response => new Response('{}', { status: 404 });
const serverError = (): Response => new Response('nope', { status: 503 });
const rateLimited = (): Response => new Response('slow down', { status: 429 });

function runtimeDocument(): Document {
  // The four scripts the Xtrata runtime injects into the head before it writes
  // the document. Their presence is how a page can tell, synchronously and with
  // no network call, that it is running under the runtime.
  return new JSDOM(`<!doctype html><html><head>
    <base href="https://xtrata.xyz/">
    <script data-xtrata-runtime-url-support="true" src="/runtime/url-support.js"></script>
    <script data-xtrata-runtime-module-bootstrap="true" src="/runtime/module-bootstrap.js"></script>
    <script src="/runtime/wallet-shim.js?network=mainnet&walletBridgeToken=abc"></script>
  </head><body></body></html>`).window.document;
}

const plainDocument = (): Document => new JSDOM('<!doctype html><html><head></head><body></body></html>').window.document;

/**
 * What an inscription ACTUALLY arrives as, copied from the served bytes of
 * `https://xtrata.xyz/i/3008` on 2026-08-18.
 *
 * The fixture above it is a runtime that injects support scripts, and no real
 * inscription has ever been served that way — 3008 and 2988 both arrive with
 * zero script tags. That is the whole reason the proxy went unused for
 * months: detection was proved against a shape that does not occur, so it
 * passed while returning false on every real viewer.
 *
 * A rewritten page is recognisable anyway. `<base href="null">` is injected
 * into both, it is the same tag that breaks relative links throughout the UI,
 * and nothing that was not rewritten would ever set it.
 */
const inscribedDocument = (): Document =>
  new JSDOM(
    `<!doctype html><html lang="en"><head><base href="null">
<meta charset="utf-8"><title>X Chess</title></head><body></body></html>`
  ).window.document;

describe('choosing a base', () => {
  it('sees the runtime by its injected scripts', () => {
    expect(underXtrataRuntime(runtimeDocument())).toBe(true);
    expect(underXtrataRuntime(plainDocument())).toBe(false);
  });

  it('sees a real inscription, which injects no scripts at all', () => {
    // The bug this exists to prevent, and it cost an inscription to find.
    // Detection returned false on every live viewer, so `/hiro/mainnet` was
    // never tried and every reader went straight to the public host from their
    // own address. The refusals arrive without an Access-Control-Allow-Origin
    // header, so a browser reports them as CORS failures rather than as the
    // rate limit they are: hundreds of them, and a board saying it could not
    // reach any endpoint while the proxy answered 200 throughout.
    expect(underXtrataRuntime(inscribedDocument())).toBe(true);
  });

  it('puts the proxy first for a real inscription', () => {
    // The consequence that matters. Detection is only interesting because of
    // which base it chooses, so assert the base and not the boolean.
    expect(endpointsFor({ document: inscribedDocument() })[0]).toBe('/hiro/mainnet');
  });

  it('does not mistake an ordinary base tag for the runtime', () => {
    const ordinary = new JSDOM(
      '<!doctype html><html><head><base href="https://example.test/app/"></head><body></body></html>'
    ).window.document;
    expect(underXtrataRuntime(ordinary)).toBe(false);
  });

  it('prefers the runtime proxy when running under the runtime', () => {
    // The serve-time Hiro rewrite only touches text/html, and every API call
    // this board makes lives in JavaScript. Without choosing the proxy here,
    // every viewer would hit the public host directly and burn its per-IP rate
    // limit, which is the exact failure the proxy exists to prevent.
    const bases = endpointsFor({ document: runtimeDocument() });
    expect(bases[0]).toBe(PROXY_PATH.mainnet);
  });

  it('uses public hosts when not under the runtime', () => {
    const bases = endpointsFor({ document: plainDocument() });
    expect(bases[0]).toBe(PUBLIC_API.mainnet[0]);
  });

  it('offers more than one public host, so none of them is essential', () => {
    // A permanent artefact that named one commercial API would have made that
    // company a permanent dependency.
    expect(PUBLIC_API.mainnet.length).toBeGreaterThan(1);
    expect(PUBLIC_API.testnet.length).toBeGreaterThan(1);
    expect(endpointsFor({ document: plainDocument() }).length).toBeGreaterThan(1);
  });

  it('lets an override be the only base, and never falls away from it', () => {
    // Pointing a board at a private node is a decision. A board that silently
    // started talking to a public host instead would be showing a different
    // chain under the same game number.
    const bases = endpointsFor({ override: 'https://node.example/', document: runtimeDocument() });
    expect(bases).toEqual(['https://node.example']);
  });

  it('has no default devnet host, because a devnet is somebody\'s own machine', () => {
    // Writing one would put a development address into a permanent artefact,
    // and it would be a fiction: there is no well-known devnet.
    expect(endpointsFor({ network: 'devnet', document: plainDocument() })).toEqual([]);
  });

  it('says what to do when a network has no endpoint configured', async () => {
    const endpoint = makeEndpoint({ network: 'devnet', fetch: (async () => ok()) as unknown as typeof fetch });
    await expect(endpoint.request('/v2/info')).rejects.toThrow(/no endpoint configured/);
  });

  it('takes an override for devnet, which is how a developer reaches their node', () => {
    expect(endpointsFor({ network: 'devnet', override: 'http://127.0.0.1:3999' })).toEqual([
      'http://127.0.0.1:3999'
    ]);
  });
});

describe('degrading', () => {
  it('does not treat a 404 as the endpoint being down', () => {
    // A 404 is the chain answering. Going somewhere else to ask again would be
    // looking for a different answer to a question already answered.
    const fetchMock = vi.fn(async () => notFound());
    const endpoint = makeEndpoint({ document: plainDocument(), fetch: fetchMock as unknown as typeof fetch });

    return endpoint.request('/v2/whatever').then((response) => {
      expect(response.status).toBe(404);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(endpoint.base).toBe(PUBLIC_API.mainnet[0]);
    });
  });

  it('moves to the next base on a 5xx', async () => {
    const calls: string[] = [];
    const fetchMock = vi.fn(async (url: string) => {
      calls.push(url);
      return url.startsWith(PUBLIC_API.mainnet[0]) ? serverError() : ok();
    });
    const onFallback = vi.fn();
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch,
      onFallback
    });

    const response = await endpoint.request('/v2/info');
    expect(response.status).toBe(200);
    expect(calls).toHaveLength(2);
    expect(onFallback).toHaveBeenCalledWith(PUBLIC_API.mainnet[0], PUBLIC_API.mainnet[1]);
  });

  it('moves to the next base on a transport failure', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith(PUBLIC_API.mainnet[0])) throw new Error('network down');
      return ok();
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });
    expect((await endpoint.request('/v2/info')).status).toBe(200);
    expect(endpoint.base).toBe(PUBLIC_API.mainnet[1]);
  });

  it('remembers the move, so one bad response does not cost every later call twice', async () => {
    let firstHostCalls = 0;
    const fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith(PUBLIC_API.mainnet[0])) {
        firstHostCalls++;
        return serverError();
      }
      return ok();
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await endpoint.request('/one');
    await endpoint.request('/two');
    await endpoint.request('/three');
    expect(firstHostCalls, 'the dead host should be tried once, not once per call').toBe(1);
  });

  it('reports chain unavailability distinctly when every base is down', async () => {
    // The application has to be able to tell "the network is unreachable" from
    // "the chain says no". They call for different things on screen.
    const fetchMock = vi.fn(async () => {
      throw new Error('offline');
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await expect(endpoint.request('/v2/info')).rejects.toThrow(/no Stacks endpoint answered/);
    try {
      await endpoint.request('/v2/info');
    } catch (error) {
      expect((error as Error & { code?: string }).code).toBe('CHAIN_UNAVAILABLE');
    }
  });

  it('tries every base before giving up', async () => {
    const tried: string[] = [];
    const fetchMock = vi.fn(async (url: string) => {
      tried.push(new URL(url, 'https://x/').origin);
      return serverError();
    });
    const endpoint = makeEndpoint({
      document: runtimeDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });
    await expect(endpoint.request('/v2/info')).rejects.toThrow();
    // Proxy plus every public host, once per sweep. Sweeping is what stops a
    // single bad moment showing as "could not reach any Stacks endpoint".
    expect(tried.length).toBe(endpoint.all.length * 3);
    expect(new Set(tried).size, 'a base was skipped').toBe(endpoint.all.length);
  });

  it('does not fall away from an explicit override even when it fails', async () => {
    const fetchMock = vi.fn(async () => serverError());
    const endpoint = makeEndpoint({
      override: 'https://node.example',
      fetch: fetchMock as unknown as typeof fetch
    });
    await expect(endpoint.request('/v2/info')).rejects.toThrow();
    // Retried, but never anywhere else: three sweeps of a one-base list.
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(endpoint.all).toEqual(['https://node.example']);
  });

  // --------------------------------------------------------------------------
  // The one-way ratchet, reported by the first testers on 2026-08-12.
  //
  // Switching from game 8 to game 1 gave "Could not reach any Stacks endpoint".
  // The chain was fine and so were two of the three hosts. The loop ran
  // `attempt = index; attempt < bases.length`, so it only ever walked FORWARD:
  // a recovered host was never returned to, and a host earlier in the list was
  // never retried. After two bad moments the board was pinned to the last entry,
  // and the list of three had become a single point of failure.
  // --------------------------------------------------------------------------

  it('comes back to the primary once it recovers', async () => {
    let primaryDown = true;
    let clock = 0;
    const fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith(PUBLIC_API.mainnet[0]) && primaryDown) throw new Error('ECONNRESET');
      return ok();
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch,
      now: () => clock
    });

    await endpoint.request('/one');
    expect(endpoint.base, 'it should have fallen forward').toBe(PUBLIC_API.mainnet[1]);

    // Within the preference window it stays put, which is the whole point of
    // remembering the move: one bad response must not cost every later call two
    // round trips.
    primaryDown = false;
    clock = 30_000;
    await endpoint.request('/two');
    expect(endpoint.base, 'it gave up on the fallback far too eagerly').toBe(
      PUBLIC_API.mainnet[1]
    );

    // Past it, the primary is tried again and answers.
    clock = 61_000;
    await endpoint.request('/three');
    expect(
      endpoint.base,
      'the primary recovered and was never tried again, so the fallback is permanent'
    ).toBe(PUBLIC_API.mainnet[0]);
  });

  it('does not keep retrying a primary that is still down', async () => {
    // The decay costs one failed attempt per window while the primary is dead.
    // It must not cost one per request, or a poll every few seconds would pay a
    // timeout every few seconds.
    let clock = 0;
    let primaryTries = 0;
    const fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith(PUBLIC_API.mainnet[0])) {
        primaryTries++;
        throw new Error('ECONNRESET');
      }
      return ok();
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch,
      now: () => clock
    });

    await endpoint.request('/one');
    expect(primaryTries).toBe(1);

    for (const t of [5_000, 10_000, 20_000, 40_000]) {
      clock = t;
      await endpoint.request('/poll');
    }
    expect(primaryTries, 'the dead primary was retried inside its own window').toBe(1);

    clock = 61_000;
    await endpoint.request('/later');
    expect(primaryTries, 'the window expired and the primary was not retried').toBe(2);
  });

  it('wraps around, so being pinned to the last base is not a dead end', async () => {
    // Walk it to the end of the list, then let ONLY that last base fail. The
    // earlier hosts are healthy the whole time.
    const dead = new Set<string>([PUBLIC_API.mainnet[0], PUBLIC_API.mainnet[1]]);
    const fetchMock = vi.fn(async (url: string) => {
      for (const base of dead) if (url.startsWith(base)) throw new Error('ECONNRESET');
      return ok();
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await endpoint.request('/one');
    const last = PUBLIC_API.mainnet[PUBLIC_API.mainnet.length - 1];
    expect(endpoint.base).toBe(last);

    // Everything recovers except the one it is now pinned to.
    dead.clear();
    dead.add(last);

    const response = await endpoint.request('/two');
    expect(
      response.status,
      'pinned to the last base, a failure there threw CHAIN_UNAVAILABLE while ' +
        'two healthy hosts were never asked'
    ).toBe(200);
    expect(endpoint.base).not.toBe(last);
  });

  it('believes a host that says it is rate limiting, even without a 429', async () => {
    // Some hosts refuse with a 503 and put the truth in a header. Reported as
    // chain unavailability that sends somebody looking for an outage; reported
    // as a rate limit it says "wait a minute", which is the useful advice.
    const limitedBy503 = (): Response =>
      new Response('slow down', { status: 503, headers: { 'retry-after': '30' } });
    const fetchMock = vi.fn(async () => limitedBy503());
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await expect(endpoint.request('/one')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('does not mistake a plain 503 for a rate limit', async () => {
    // The same care in the other direction. A host with a problem is a host with
    // a problem, and guessing from the status code would be the same error.
    const fetchMock = vi.fn(async () => serverError());
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await expect(endpoint.request('/one')).rejects.toMatchObject({ code: 'CHAIN_UNAVAILABLE' });
  });

  it('sweeps every base, and retries the sweep a bounded number of times', async () => {
    // The wrap must not turn one dead host into an unbounded retry loop. What
    // bounds the time a caller waits is that the sweeps are counted: three
    // passes over the bases and then the failure is reported.
    //
    // Sweeping again at all is the fix for a real complaint - a local board
    // showing "Could not reach any Stacks endpoint" during one bad moment,
    // while working a second either side of it. Three hosts sharing one
    // rate-limit bucket are not three chances; they are one, tried three ways.
    const tried: string[] = [];
    const fetchMock = vi.fn(async (url: string) => {
      tried.push(url);
      throw new Error('ECONNRESET');
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await expect(endpoint.request('/one')).rejects.toThrow();
    expect(tried, 'the sweep is no longer bounded').toHaveLength(PUBLIC_API.mainnet.length * 3);
    // Every base still gets tried within each sweep, rather than one host
    // absorbing all the attempts.
    for (const base of PUBLIC_API.mainnet) {
      expect(tried.filter((url) => url.startsWith(base))).toHaveLength(3);
    }
  });

  it('does NOT retry a rate limit, which retrying can only make worse', async () => {
    // The exclusion that keeps the retry honest. A 429 window is a minute, so a
    // second sweep cannot succeed - it can only triple the load on hosts that
    // are already refusing us. The board's answer to a rate limit is the
    // poller's back-off, measured in minutes, not another request now.
    const fetchMock = vi.fn(async () => rateLimited());
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await expect(endpoint.request('/one')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
    expect(fetchMock, 'a rate limit was retried').toHaveBeenCalledTimes(PUBLIC_API.mainnet.length);
  });

});

// ---------------------------------------------------------------------------
// Not spending the whole minute's allowance on the first paint.
// ---------------------------------------------------------------------------

describe('being polite with a shared allowance', () => {
  it('asks a few at a time rather than all at once', async () => {
    const { BlockTimes } = await import('../../packages/chain/block-time.js');
    let inFlight = 0;
    let peak = 0;
    const fetchMock = vi.fn(async () => {
      inFlight++;
      peak = Math.max(peak, inFlight);
      await new Promise((done) => setTimeout(done, 4));
      inFlight--;
      return ok('{"block_time":1760000000}');
    });

    // Heights rather than addresses: both resolvers share this pool, and a
    // height needs no checksum, so the test exercises the cap rather than the
    // address encoding.
    const times = new BlockTimes(
      makeEndpoint({ fetch: fetchMock as unknown as typeof fetch, document: plainDocument() })
    );
    await times.resolveAll(Array.from({ length: 40 }, (_, i) => 900_000 + i));

    expect(
      fetchMock.mock.calls.length,
      'nothing was asked, so the cap was never exercised'
    ).toBeGreaterThan(10);
    // A bare Promise.all here fired one request per distinct height at once,
    // into an allowance the WALLET also spends - so a board that emptied it
    // stopped its own player from moving.
    expect(peak, `${peak} requests were in flight at once`).toBeLessThanOrEqual(3);
  });

  it('does not remember a refusal as though it were an answer', async () => {
    const { Names } = await import('../../packages/chain/bns.js');
    let refuse = true;
    const fetchMock = vi.fn(async () => {
      if (refuse) return new Response('slow down', { status: 429 });
      return ok('{"okay":true,"result":"0x09"}');
    });

    const clock = { t: 0 };
    const names = new Names({
      endpoint: makeEndpoint({
        fetch: fetchMock as unknown as typeof fetch,
        document: plainDocument(),
        now: () => clock.t
      })
    });
    const who = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

    await names.resolve(who);
    const asked = fetchMock.mock.calls.length;
    expect(asked, 'the first attempt did not happen').toBeGreaterThan(0);

    // The host stops refusing. A cached refusal would mean this address is
    // never asked about again for the life of the page, so one busy moment
    // would leave every name blank until a reload.
    //
    // The clock moves past the endpoint's cooldown first. A refusal now buys
    // twelve seconds of silence across the whole page, deliberately — but that
    // is a pause, and this test is about the difference between a pause and a
    // permanent blank.
    refuse = false;
    clock.t += 15_000;
    await names.resolve(who);
    expect(
      fetchMock.mock.calls.length,
      'the refusal was cached, so the name can never be learned this session'
    ).toBeGreaterThan(asked);
  });
});

describe('a rate limit the browser is not allowed to see', () => {
  // MEASURED, 2026-08-16: Hiro's 429 carries no Access-Control-Allow-Origin
  // header — 39 of 39 refusals under load. A browser therefore blocks the
  // response before any application code runs, and `fetch` rejects as a
  // transport error. The status is never readable, so the 429 branch is
  // unreachable on the one surface that matters, and every rate limit was
  // being reported as "could not reach any Stacks endpoint".
  //
  // It was also being RETRIED, because that is what CHAIN_UNAVAILABLE gets:
  // three sweeps across three hosts, nine requests into an allowance already
  // spent. The exclusion that exists to prevent exactly that was defeated by
  // a missing response header.
  const okWithBudget = (left: number): Response =>
    new Response('{}', { status: 200, headers: { 'x-ratelimit-remaining-minute': String(left) } });

  it('calls it a rate limit when the last real answer said the budget was gone', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      // One good read that reports an almost-empty allowance, then the CORS
      // wall: rejections with no status to inspect.
      if (calls === 1) return okWithBudget(1);
      throw new TypeError('Failed to fetch');
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await endpoint.request('/warm');
    await expect(endpoint.request('/then')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('does not retry it, which is the whole point of naming it correctly', async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      if (calls === 1) return okWithBudget(0);
      throw new TypeError('Failed to fetch');
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await endpoint.request('/warm');
    const before = fetchMock.mock.calls.length;
    await expect(endpoint.request('/then')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
    const spent = fetchMock.mock.calls.length - before;
    // One sweep of the bases, not three. Nine requests into an exhausted
    // budget is the harm, not the symptom.
    expect(spent, 'a rate limit was swept more than once').toBe(PUBLIC_API.mainnet.length);
  });

  it('still calls a real outage an outage, when the budget was healthy', async () => {
    // The mistake in the other direction, and the worse one: telling somebody
    // to wait out a host that is genuinely gone never ends.
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      if (calls === 1) return okWithBudget(48);
      throw new TypeError('Failed to fetch');
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });

    await endpoint.request('/warm');
    await expect(endpoint.request('/then')).rejects.toMatchObject({ code: 'CHAIN_UNAVAILABLE' });
  });

  it('calls it an outage when nothing has ever reported a budget', async () => {
    // No evidence is not evidence of a rate limit. A first read that fails
    // outright is an unreachable host until something says otherwise.
    const fetchMock = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    const endpoint = makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as unknown as typeof fetch
    });
    await expect(endpoint.request('/cold')).rejects.toMatchObject({ code: 'CHAIN_UNAVAILABLE' });
  });
});

describe('going quiet, rather than each caller finding the wall alone', () => {
  // Eight call sites reach for this endpoint — log, mempool, names, block
  // times, game list, leaderboard. Labelling a rate limit correctly stopped the
  // retries and did nothing about the other seven callers, each of which went
  // on firing into an allowance everybody already knew was spent. In a browser
  // every one of those lands as a CORS error, which is what fills a console
  // while the board is doing nothing wrong except asking.
  const okWithBudget = (left: number): Response =>
    new Response('{}', { status: 200, headers: { 'x-ratelimit-remaining-minute': String(left) } });

  function endpointAt(clock: { t: number }, fetchMock: unknown) {
    return makeEndpoint({
      document: plainDocument(),
      fetch: fetchMock as typeof fetch,
      now: () => clock.t
    } as Parameters<typeof makeEndpoint>[0]);
  }

  it('makes no request at all while the wall is up', async () => {
    const clock = { t: 0 };
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      if (calls === 1) return okWithBudget(0);
      throw new TypeError('Failed to fetch');
    });
    const endpoint = endpointAt(clock, fetchMock);

    await endpoint.request('/warm');
    await expect(endpoint.request('/hits-the-wall')).rejects.toMatchObject({
      code: 'RATE_LIMITED'
    });

    // Everything after this costs nothing, which is the entire point: a request
    // made now is one the refill has to outrun.
    const spent = fetchMock.mock.calls.length;
    for (let i = 0; i < 6; i++) {
      await expect(endpoint.request('/quiet')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
    }
    expect(fetchMock.mock.calls.length, 'it kept asking while rate limited').toBe(spent);
  });

  it('comes back on its own, without anybody clearing it', async () => {
    const clock = { t: 0 };
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      if (calls === 1) return okWithBudget(0);
      if (calls <= 4) throw new TypeError('Failed to fetch');
      return okWithBudget(50);
    });
    const endpoint = endpointAt(clock, fetchMock);

    await endpoint.request('/warm');
    await expect(endpoint.request('/wall')).rejects.toMatchObject({ code: 'RATE_LIMITED' });

    clock.t += 12_000;
    const response = await endpoint.request('/later');
    expect(response.status, 'the wall never came down').toBe(200);
  });

  it('never silences a page that is merely offline', async () => {
    // The mistake that would be worse than the noise. A dead host is not a rate
    // limit, and a board that went quiet for it would look broken while the
    // fallback hosts sat untried.
    const clock = { t: 0 };
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls++;
      if (calls === 1) return okWithBudget(48);
      throw new TypeError('Failed to fetch');
    });
    const endpoint = endpointAt(clock, fetchMock);

    await endpoint.request('/warm');
    await expect(endpoint.request('/down')).rejects.toMatchObject({ code: 'CHAIN_UNAVAILABLE' });

    const spent = fetchMock.mock.calls.length;
    await expect(endpoint.request('/again')).rejects.toMatchObject({ code: 'CHAIN_UNAVAILABLE' });
    expect(fetchMock.mock.calls.length, 'an outage was treated as a rate limit').toBeGreaterThan(
      spent
    );
  });
});
