import { proxyHiroRequest } from './hiro-proxy';
import { getHiroApiKeys } from './hiro-keys';
import type { Env } from './db';

/** Reuse the first-party key pool, cooldowns and read cache. Never forward
 * a key supplied by the chain reader to the public proxy. */
export function royaltyChainFetch(env: Env): typeof fetch {
  return async (input, init) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    if (!['https://api.mainnet.hiro.so', 'https://api.hiro.so'].includes(url.origin))
      throw Error('Unexpected royalty chain endpoint.');
    const headers = new Headers(request.headers);
    headers.delete('x-hiro-api-key'); headers.delete('x-api-key');
    const clean = new Request(request, { headers });
    if (getHiroApiKeys(env).length) {
      return proxyHiroRequest({ request: clean, env: env as Record<string, string | undefined>,
        network: 'mainnet', path: url.pathname.slice(1), signal: request.signal });
    }
    // Scheduled workers have no Hiro secret bindings; use the same service.
    return fetch(new Request('https://xtrata.xyz/hiro/mainnet' + url.pathname + url.search, clean));
  };
}
