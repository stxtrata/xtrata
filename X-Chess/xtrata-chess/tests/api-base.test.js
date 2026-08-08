// Which API the engine talks to.
//
// The runtime rewrites Hiro bases inside HTML inscriptions so viewers share a
// cached proxy instead of burning the public per-IP rate limit. It only rewrites
// HTML, and every API call in this project lives in the engine, which is
// inscribed as JavaScript. So the engine has to choose for itself, and these
// pin that choice.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PUBLIC_API,
  makeResilientFetch,
  preferredApiBase,
  publicApiBase,
  underXtrataRuntime
} from '../src/api-base.js';

const docWith = (srcs) => ({
  querySelectorAll: () => srcs.map((src) => ({ getAttribute: () => src }))
});

afterEach(() => {
  delete globalThis.__XTRATA_CHESS_API__;
});

describe('spotting the runtime', () => {
  // The runtime injects these into the head before writing the document, so
  // they are present by the time anything of ours runs. Looking for them needs
  // no network call, unlike probing for the proxy.
  it('recognises the injected support scripts', () => {
    expect(underXtrataRuntime(docWith(['/runtime/wallet-shim.js?network=mainnet']))).toBe(true);
    expect(underXtrataRuntime(docWith(['/runtime/url-support.js']))).toBe(true);
    expect(underXtrataRuntime(docWith(['/runtime/module-bootstrap.js']))).toBe(true);
  });

  it('is not fooled by an ordinary page', () => {
    expect(underXtrataRuntime(docWith(['./src/boot.js', '/i/2801']))).toBe(false);
    expect(underXtrataRuntime(docWith([]))).toBe(false);
    expect(underXtrataRuntime(null)).toBe(false);
  });
});

describe('choosing a base', () => {
  it('uses the shared proxy under the runtime', () => {
    const doc = docWith(['/runtime/wallet-shim.js']);
    expect(preferredApiBase('mainnet', { document: doc })).toBe('/hiro/mainnet');
    expect(preferredApiBase('testnet', { document: doc })).toBe('/hiro/testnet');
  });

  it('uses the public host anywhere else', () => {
    const doc = docWith([]);
    expect(preferredApiBase('mainnet', { document: doc })).toBe(PUBLIC_API.mainnet);
    expect(preferredApiBase('testnet', { document: doc })).toBe(PUBLIC_API.testnet);
  });

  it('lets a build override both', () => {
    globalThis.__XTRATA_CHESS_API__ = 'https://my-own-node.example/';
    expect(preferredApiBase('mainnet', { document: docWith(['/runtime/wallet-shim.js']) }))
      .toBe('https://my-own-node.example');
  });
});

describe('surviving a proxy that stops answering', () => {
  // An inscription cannot be corrected. If the proxy disappears the board has to
  // degrade to the public host rather than become permanently broken.
  it('falls back on a 5xx and remembers', async () => {
    const seen = [];
    const fetch = vi.fn(async (url) => {
      seen.push(url);
      return url.startsWith('/hiro') ? { status: 502 } : { status: 200 };
    });
    const fallbacks = [];

    const api = makeResilientFetch({
      network: 'mainnet',
      fetch,
      onFallback: (from, to) => fallbacks.push([from, to])
    });
    // Pretend we are under the runtime.
    globalThis.__XTRATA_CHESS_API__ = '/hiro/mainnet';

    const first = await api.request('/v2/info');
    expect(first.status).toBe(200);
    expect(seen[0]).toBe('/hiro/mainnet/v2/info');
    expect(seen[1]).toBe(`${PUBLIC_API.mainnet}/v2/info`);

    // Remembered, so later calls do not pay for two requests each.
    seen.length = 0;
    await api.request('/v2/info');
    expect(seen).toEqual([`${PUBLIC_API.mainnet}/v2/info`]);
  });

  it('falls back when the proxy cannot be reached at all', async () => {
    globalThis.__XTRATA_CHESS_API__ = '/hiro/mainnet';
    const fetch = vi.fn(async (url) => {
      if (url.startsWith('/hiro')) throw new Error('network down');
      return { status: 200 };
    });

    const api = makeResilientFetch({ network: 'mainnet', fetch });
    expect((await api.request('/v2/info')).status).toBe(200);
  });

  // A 404 from a contract read is a real answer about the contract. Treating it
  // as a dead proxy would send us asking a different server the same question
  // and getting the same answer more slowly.
  it('does not treat a 404 as the proxy being down', async () => {
    globalThis.__XTRATA_CHESS_API__ = '/hiro/mainnet';
    const seen = [];
    const fetch = vi.fn(async (url) => {
      seen.push(url);
      return { status: 404 };
    });

    const api = makeResilientFetch({ network: 'mainnet', fetch });
    expect((await api.request('/v2/contracts/interface/x/y')).status).toBe(404);
    expect(seen).toHaveLength(1);
  });

  it('never falls away from a base someone chose deliberately', async () => {
    const seen = [];
    const fetch = vi.fn(async (url) => {
      seen.push(url);
      return { status: 503 };
    });

    const api = makeResilientFetch({
      network: 'mainnet',
      base: 'https://my-own-node.example',
      fetch
    });

    await api.request('/v2/info');
    expect(seen).toEqual(['https://my-own-node.example/v2/info']);
  });
});

describe('publicApiBase', () => {
  it('names the host without deciding anything', () => {
    expect(publicApiBase('mainnet')).toBe(PUBLIC_API.mainnet);
    expect(publicApiBase('testnet')).toBe(PUBLIC_API.testnet);
    expect(publicApiBase()).toBe(PUBLIC_API.mainnet);
  });
});
