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
});
