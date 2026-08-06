// Which Stacks API this board should talk to.
//
// The Xtrata runtime rewrites `https://api.mainnet.hiro.so` to `/hiro/mainnet`
// inside HTML inscriptions at serve time, so every viewer shares a cached,
// key-rotating proxy instead of burning the public per-IP rate limit. The
// comment on that rewrite cites hundreds of 503s on a single inscription that
// called Hiro directly.
//
// That rewrite only touches text/html. This board's API calls all live in the
// engine, which is inscribed as JavaScript, so none of them would be rewritten
// and every viewer would go straight to the public API. Under load that is the
// exact failure the proxy exists to prevent.
//
// So the engine chooses for itself: use the proxy when it can see it is running
// under the runtime, and the public host otherwise.
//
// It also has to survive being wrong. An inscription cannot be corrected, so a
// proxy that stops existing must degrade to the public host rather than leaving
// a permanently broken board.

export const PUBLIC_API = {
  mainnet: 'https://api.mainnet.hiro.so',
  testnet: 'https://api.testnet.hiro.so'
};

export const PROXY_PATH = {
  mainnet: '/hiro/mainnet',
  testnet: '/hiro/testnet'
};

/**
 * Is this page being served by the Xtrata runtime?
 *
 * The runtime injects its support scripts into the head before writing the
 * document, so they are present by the time anything of ours runs. Looking for
 * them is synchronous and needs no network call, unlike probing for the proxy.
 */
export function underXtrataRuntime(doc = globalThis.document) {
  if (!doc?.querySelectorAll) return false;
  for (const script of doc.querySelectorAll('script[src]')) {
    const src = String(script.getAttribute('src') || '');
    if (/(^|\/)runtime\/(wallet-shim|url-support|module-bootstrap)\.js/.test(src)) {
      return true;
    }
  }
  return false;
}

/**
 * The base to try first.
 *
 * A build-time override wins over everything, so a board can be pointed at a
 * private node without changing any code.
 */
export function preferredApiBase(network = 'mainnet', options = {}) {
  const override = options.override ?? globalThis.__XTRATA_CHESS_API__;
  if (override) return String(override).replace(/\/+$/, '');

  const key = network === 'testnet' ? 'testnet' : 'mainnet';
  return underXtrataRuntime(options.document) ? PROXY_PATH[key] : PUBLIC_API[key];
}

export function publicApiBase(network = 'mainnet') {
  return PUBLIC_API[network === 'testnet' ? 'testnet' : 'mainnet'];
}

/**
 * A fetch that falls back to the public host when the proxy does not answer.
 *
 * Only a transport failure or a 5xx counts as the proxy being unavailable. A
 * 404 from a read-only call is a real answer about the contract and must not
 * send us somewhere else looking for a different one.
 *
 * The decision is remembered, so one bad response does not mean every later
 * call pays for two.
 */
export function makeResilientFetch({ network = 'mainnet', base, fetch: baseFetch, onFallback } = {}) {
  const doFetch = baseFetch || globalThis.fetch?.bind(globalThis);
  // An explicit base is a decision, not a preference: never fall away from one.
  const state = { base: base || null, fellBack: Boolean(base) };

  const looksDown = (response) => !response || response.status >= 500;

  return {
    get base() {
      if (!state.base) state.base = preferredApiBase(network);
      return state.base;
    },

    async request(path, init) {
      const primary = this.base;
      const fallback = publicApiBase(network);

      try {
        const response = await doFetch(`${primary}${path}`, init);
        if (!looksDown(response) || primary === fallback || state.fellBack) {
          return response;
        }
      } catch (error) {
        if (primary === fallback) throw error;
      }

      // The proxy is not answering. Use the public host from here on and say so
      // once, rather than silently halving the speed of every later call.
      state.base = fallback;
      state.fellBack = true;
      onFallback?.(primary, fallback);
      return doFetch(`${fallback}${path}`, init);
    }
  };
}
