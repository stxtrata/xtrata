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

describe('choosing a base', () => {
  it('sees the runtime by its injected scripts', () => {
    expect(underXtrataRuntime(runtimeDocument())).toBe(true);
    expect(underXtrataRuntime(plainDocument())).toBe(false);
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
    // Proxy plus every public host.
    expect(tried.length).toBe(endpoint.all.length);
  });

  it('does not fall away from an explicit override even when it fails', async () => {
    const fetchMock = vi.fn(async () => serverError());
    const endpoint = makeEndpoint({
      override: 'https://node.example',
      fetch: fetchMock as unknown as typeof fetch
    });
    await expect(endpoint.request('/v2/info')).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(1);
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

  it('tries every base exactly once per call, and no more', async () => {
    // The wrap must not turn one dead host into an unbounded retry loop. Every
    // call costs at most one attempt per base, which is what bounds the time a
    // caller waits when the network really is gone.
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
    expect(tried).toHaveLength(PUBLIC_API.mainnet.length);
    expect(new Set(tried).size, 'a base was tried twice in one call').toBe(tried.length);
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

    const names = new Names({
      endpoint: makeEndpoint({ fetch: fetchMock as unknown as typeof fetch, document: plainDocument() })
    });
    const who = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

    await names.resolve(who);
    const asked = fetchMock.mock.calls.length;
    expect(asked, 'the first attempt did not happen').toBeGreaterThan(0);

    // The host stops refusing. A cached refusal would mean this address is
    // never asked about again for the life of the page, so one busy moment
    // would leave every name blank until a reload.
    refuse = false;
    await names.resolve(who);
    expect(
      fetchMock.mock.calls.length,
      'the refusal was cached, so the name can never be learned this session'
    ).toBeGreaterThan(asked);
  });
});
