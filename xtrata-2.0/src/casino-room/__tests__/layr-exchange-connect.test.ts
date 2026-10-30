import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

/**
 * The LAYR Exchange "Connect testnet wallet" button, run for real.
 *
 * The exchange code is inline in the two casino pages. This cuts that module out of each page and runs it against fake wallets and a
 * fake of the Stacks library's wallet chooser, so the test fails if the page's own code regresses.
 *
 * Why it exists: on 2026-10-30 a player in Xverse's phone app got "Invalid parameters." and no wallet connected. The page asked every
 * wallet for getAddresses with { network: 'testnet' }. The library turns that into wallet_connect for Xverse and keeps the parameter,
 * and the phone app refuses it (the desktop extension accepts it). The wizard sends Xverse wallet_connect with no parameters
 * (WALLET-PLAYBOOK section 6), and now so does the casino.
 *
 * The fake chooser copies two things the real library does and an earlier version of this test got wrong: it saves the picked wallet in
 * STX_PROVIDER only AFTER a request succeeded, and for Xverse it rewrites getAddresses to wallet_connect with the same parameters.
 */
const PAGES = ['public/casino/index.html', 'public/casino-b/index.html'];
const ROOT = fileURLToPath(new URL('../../../', import.meta.url));

const pageCache = new Map<string, string>();
const page = (rel: string) => {
  if (!pageCache.has(rel)) pageCache.set(rel, readFileSync(ROOT + rel, 'utf8'));
  return pageCache.get(rel) as string;
};

function exchangeModule(html: string): string {
  const start = html.indexOf("(function(){'use strict';\nconst exchangeShut");
  expect(start, 'exchange module start not found').toBeGreaterThan(0);
  const freeze = html.indexOf('window.ParallaxTestnetLAYR=Object.freeze', start);
  expect(freeze, 'exchange module export not found').toBeGreaterThan(start);
  return html.slice(start, html.indexOf('})();', freeze) + 5);
}

const MINE = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'; // a testnet address
const MAINNET = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const BTC = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';
const XVERSE_ID = 'XverseProviders.BitcoinProvider';

type Wallet = (method: string, params?: unknown) => unknown;
type Call = { who: string; method: string; args: number; params?: unknown };

const err = (message: string, code?: number) => Object.assign(new Error(message), { code });

function makeWorld(page: string, o: { xverse?: Wallet; leather?: Wallet; picks?: 'xverse' | 'leather' | null; stored?: string; rewrites?: boolean }) {
  const calls: Call[] = [];
  const store = new Map<string, string>();
  if (o.stored) store.set('STX_PROVIDER', o.stored);
  const localStorage = {
    getItem: (k: string) => (store.has(k) ? (store.get(k) as string) : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k)
  };
  const provider = (who: string, fn: Wallet) => ({
    request: (method: string, ...rest: unknown[]) => {
      calls.push({ who, method, args: rest.length, params: rest[0] });
      return Promise.resolve().then(() => fn(method, rest[0]));
    }
  });
  const win: any = {
    localStorage,
    fetch: async () => ({ ok: true, json: async () => ({ available: '5000000' }) })
  };
  if (o.xverse) win.XverseProviders = { BitcoinProvider: provider('xverse', o.xverse) };
  if (o.leather) win.LeatherProvider = provider('leather', o.leather);
  // The library's chooser: the person picks a wallet and the request goes to it. Like the real library, it rewrites getAddresses to
  // wallet_connect for Xverse (keeping the parameters) unless `rewrites` is false (an Xverse build the library does not recognise),
  // and it saves the picked wallet only after the wallet answered.
  win.ParallaxStacksSDK = {
    validateStacksAddress: (a: string) => /^S[PMTN][0-9A-HJKMNP-TV-Z]{38,39}$/.test(a),
    request: async (_opts: unknown, method: string, params?: unknown) => {
      calls.push({ who: 'sdk', method, args: params === undefined ? 0 : 1, params });
      if (!o.picks) throw err('User canceled the request', -31001); // chooser closed without a pick
      const chosen = o.picks === 'xverse' ? win.XverseProviders.BitcoinProvider : win.LeatherProvider;
      const sent = o.picks === 'xverse' && o.rewrites !== false && method === 'getAddresses' ? 'wallet_connect' : method;
      const answer = await (params === undefined ? chosen.request(sent) : chosen.request(sent, params));
      store.set('STX_PROVIDER', o.picks === 'xverse' ? XVERSE_ID : 'LeatherProvider');
      return answer;
    }
  };
  const quiet = { log() {}, info() {}, warn() {}, error() {} };
  const sandbox: any = {
    window: win, localStorage, console: quiet, AbortController,
    document: { querySelectorAll: () => [], body: { style: {} } },
    setTimeout: (fn: () => void, ms?: number) => { const t: any = setTimeout(fn, ms); t?.unref?.(); return t; },
    clearTimeout
  };
  vm.runInNewContext(exchangeModule(page), sandbox);
  const ex = win.ParallaxTestnetLAYR.create({
    account: { ready: () => true, acquire: async () => true, error: () => '' },
    storage: localStorage,
    fetch: win.fetch
  });
  const methods = (who: string) => calls.filter((c) => c.who === who).map((c) => c.method);
  return { ex, calls, store, methods };
}

const failure = async (p: Promise<unknown>) => (await p.then(() => null, (e: unknown) => e)) as { message: string; code?: unknown } | null;
const until = async (check: () => boolean, ms = 2000) => {
  const t0 = Date.now();
  while (!check()) {
    if (Date.now() - t0 > ms) throw new Error('timed out waiting');
    await new Promise((r) => setTimeout(r, 5));
  }
};

// Xverse's phone app: refuses getAddresses, and refuses wallet_connect when it carries parameters ("Invalid parameters.").
const phoneApp = (answer: unknown = { addresses: [{ address: MINE, purpose: 'stacks' }] }): Wallet => (method, params) => {
  if (method === 'wallet_disconnect') return null;
  if (method === 'getAddresses') throw err('Invalid parameters.', -32602);
  if (method === 'wallet_connect') {
    if (params !== undefined) throw err('Invalid parameters.', -32602);
    return answer;
  }
  throw err('Method not found', -32601);
};
const noParams = (calls: Call[]) => calls.every((c) => c.params === undefined);

describe.each(PAGES)('LAYR exchange connect: %s', (rel) => {
  it('Xverse phone app: connects, and no parameter is sent to any wallet', async () => {
    const w = makeWorld(page(rel), { xverse: phoneApp(), picks: 'xverse' });
    await expect(w.ex.connect()).resolves.toBe(MINE);
    const s = w.ex.snapshot();
    expect(s.address).toBe(MINE);
    expect(s.busy).toBe(false);
    expect(s.error).toBe('');
    expect(w.methods('xverse')).toEqual(['wallet_disconnect', 'wallet_connect']);
    expect(noParams(w.calls)).toBe(true);
    expect(w.store.get('STX_PROVIDER')).toBe(XVERSE_ID); // the payment step finds the wallet through this
  });

  it('Xverse build the library does not recognise (it sends getAddresses): refused, so the casino asks wallet_connect itself', async () => {
    const w = makeWorld(page(rel), { xverse: phoneApp(), picks: 'xverse', rewrites: false });
    await expect(w.ex.connect()).resolves.toBe(MINE);
    expect(w.methods('xverse')).toEqual(['wallet_disconnect', 'getAddresses', 'wallet_connect']);
    expect(w.calls.find((c) => c.who === 'xverse' && c.method === 'wallet_connect')?.args).toBe(0);
    expect(w.store.get('STX_PROVIDER')).toBe(XVERSE_ID); // saved by the casino, because the library only saves after its own request worked
    expect(w.ex.snapshot().status).toMatch(/connected/i);
  });

  it('wallet_connect answers with bitcoin and stacks addresses and no symbol: the testnet Stacks one is used', async () => {
    const answer = { result: { addresses: [{ address: BTC, purpose: 'payment' }, { address: MINE, purpose: 'stacks' }] } };
    for (const rewrites of [true, false]) {
      const w = makeWorld(page(rel), { xverse: phoneApp(answer), picks: 'xverse', rewrites });
      await expect(w.ex.connect()).resolves.toBe(MINE);
    }
  });

  it('Xverse on mainnet: tells the player to switch to testnet and connects nothing', async () => {
    for (const rewrites of [true, false]) {
      const w = makeWorld(page(rel), { xverse: phoneApp({ addresses: [{ address: MAINNET, purpose: 'stacks' }] }), picks: 'xverse', rewrites });
      const e = await failure(w.ex.connect());
      expect(e?.message).toMatch(/Switch your wallet to Stacks testnet and reconnect/);
      expect(w.ex.snapshot().address).toBeNull();
      expect(w.methods('xverse')).not.toContain('wallet_getAccount');
    }
  });

  it('the player says no in Xverse: that is the answer, no second try', async () => {
    const xverse: Wallet = (method) => {
      if (method === 'wallet_disconnect') return null;
      throw err('User rejected the request.', 4001);
    };
    const w = makeWorld(page(rel), { xverse, picks: 'xverse' });
    const e = await failure(w.ex.connect());
    expect(e?.message).toMatch(/rejected/i);
    expect(w.methods('xverse')).toEqual(['wallet_disconnect', 'wallet_connect']);
    const s = w.ex.snapshot();
    expect(s.busy).toBe(false);
    expect(s.error).toMatch(/rejected/i);
    expect(s.address).toBeNull();
  });

  it('Xverse that accepts the request (the desktop extension): one request, no fallback', async () => {
    const xverse: Wallet = (method) => (method === 'wallet_disconnect' ? null : { addresses: [{ symbol: 'STX', address: MINE }] });
    const w = makeWorld(page(rel), { xverse, picks: 'xverse' });
    await expect(w.ex.connect()).resolves.toBe(MINE);
    expect(w.methods('xverse')).toEqual(['wallet_disconnect', 'wallet_connect']);
    expect(noParams(w.calls)).toBe(true);
  });

  it('chooser closed without a pick: not retried through Xverse, even if Xverse was the wallet used last time', async () => {
    const w = makeWorld(page(rel), { xverse: phoneApp(), picks: null, stored: XVERSE_ID });
    const e = await failure(w.ex.connect());
    expect(e?.message).toMatch(/cancel/i);
    expect(w.methods('xverse')).toEqual(['wallet_disconnect']);
  });

  it('Leather: asked with no parameters, and Xverse is left alone', async () => {
    const leather: Wallet = (method) => (method === 'getAddresses' ? { addresses: [{ symbol: 'BTC', address: BTC }, { symbol: 'STX', address: MINE }] } : null);
    const w = makeWorld(page(rel), { xverse: phoneApp(), leather, picks: 'leather' });
    await expect(w.ex.connect()).resolves.toBe(MINE);
    expect(w.methods('xverse')).toEqual(['wallet_disconnect']);
    expect(w.methods('leather')).toEqual(['getAddresses']);
    expect(noParams(w.calls)).toBe(true);
    expect(w.store.get('STX_PROVIDER')).toBe('LeatherProvider');
  });

  it('Leather refusing is not turned into an Xverse request', async () => {
    const leather: Wallet = () => { throw err('Something Leather said.', -32000); };
    const w = makeWorld(page(rel), { xverse: phoneApp(), leather, picks: 'leather' });
    const e = await failure(w.ex.connect());
    expect(e?.message).toBe('Something Leather said.');
    expect(w.methods('xverse')).toEqual(['wallet_disconnect']);
  });

  it('both Xverse routes fail: the message says what was tried, so a screenshot is enough to diagnose', async () => {
    const xverse: Wallet = (method) => {
      if (method === 'wallet_disconnect') return null;
      if (method === 'getAddresses') throw err('Invalid parameters.', -32602);
      throw err('Network mismatch', -32000);
    };
    const w = makeWorld(page(rel), { xverse, picks: 'xverse', rewrites: false });
    const e = await failure(w.ex.connect());
    expect(e?.message).toBe('Network mismatch (tried getAddresses: Invalid parameters.; wallet_connect: Network mismatch; wallet_getAccount: Network mismatch)');
    expect(w.ex.snapshot().busy).toBe(false);
  });

  it('the Cancel button still works while the Xverse approval is waiting', async () => {
    for (const rewrites of [true, false]) {
      const xverse: Wallet = (method) => {
        if (method === 'wallet_disconnect') return null;
        if (method === 'getAddresses') throw err('Invalid parameters.', -32602);
        return new Promise(() => {}); // the phone app never answers
      };
      const w = makeWorld(page(rel), { xverse, picks: 'xverse', rewrites });
      const pending = failure(w.ex.connect());
      await until(() => w.methods('xverse').includes('wallet_connect'));
      w.ex.cancel();
      const e = await pending;
      expect(e?.message).toMatch(/cancelled/i);
      expect(w.ex.snapshot().busy).toBe(false);
    }
  });
});

describe('both casino pages', () => {
  it('carry the same exchange module', () => {
    expect(exchangeModule(page(PAGES[0] as string))).toBe(exchangeModule(page(PAGES[1] as string)));
  });

  it('bring a connect error into view, because on a phone it sits below the button', () => {
    for (const rel of PAGES) {
      const html = page(rel);
      const at = html.indexOf('const act=fn=>');
      expect(at, rel).toBeGreaterThan(0);
      expect(html.slice(at, at + 400), rel).toContain('scrollIntoView');
    }
  });
});
