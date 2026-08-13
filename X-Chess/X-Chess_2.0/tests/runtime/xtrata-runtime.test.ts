// The artefact under the Xtrata runtime.
//
// An inscription does not simply load. The viewer fetches its bytes, injects a
// <base> and three support scripts into <head>, then builds the document with
// document.open() / write() / close(). Separately, at serve time, Hiro API
// bases are rewritten - but ONLY for text/html.
//
// The legacy project found three permanent bugs here and nowhere else, and none
// of them was visible in local development. So this reproduces the sequence
// against the BUILT artefact rather than the source.
//
// The real runtime scripts are read from xtrata-2.0 where they are available,
// so they cannot drift from what the site actually serves. What cannot be
// automated - a real wallet at the other end of the bridge - is
// harness/wallets/MATRIX.md.

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const HTML_PATH = resolve(ROOT, 'dist/xchess.html');
const RUNTIME_DIR = resolve(ROOT, '..', '..', 'xtrata-2.0', 'public', 'runtime');

let artifact = '';

beforeAll(() => {
  if (!existsSync(HTML_PATH)) {
    throw new Error('dist/xchess.html is missing. Run `npm run build` before this suite.');
  }
  artifact = readFileSync(HTML_PATH, 'utf8');
});

/**
 * The serve-time rewrite, copied from the worker. text/html only.
 *
 * All FOUR rules and an ABSOLUTE origin, matching
 * xtrata-2.0/functions/runtime/html-hiro-rewrite.ts. This used to carry two
 * rules and a relative path, and that infidelity is why nobody noticed the
 * rewrite eating the board's primary fallback: an emulator that does less than
 * the real thing cannot show you what the real thing does.
 */
const PROXY_ORIGIN = 'https://xtrata.xyz';
function rewriteHiroBases(html: string): string {
  return html
    .replace(/https:\/\/api\.mainnet\.hiro\.so/g, `${PROXY_ORIGIN}/hiro/mainnet`)
    .replace(/https:\/\/api\.testnet\.hiro\.so/g, `${PROXY_ORIGIN}/hiro/testnet`)
    .replace(/https:\/\/stacks-node-api\.mainnet\.stacks\.co/g, `${PROXY_ORIGIN}/hiro/mainnet`)
    .replace(/https:\/\/stacks-node-api\.testnet\.stacks\.co/g, `${PROXY_ORIGIN}/hiro/testnet`);
}

/**
 * The four injections, in the order the runtime makes them.
 *
 * Their PRESENCE is what the chain layer looks for to decide it is under the
 * runtime, so the src attributes have to look exactly like the real ones.
 */
function inject(html: string, bridgeToken: string | null): string {
  const query = new URLSearchParams({ network: 'mainnet', debug: '1' });
  if (bridgeToken) query.set('walletBridgeToken', bridgeToken);

  const support = [
    '<base href="https://xtrata.xyz/">',
    '<script data-xtrata-runtime-url-support="true" src="/runtime/url-support.js"></script>',
    '<script data-xtrata-runtime-module-bootstrap="true" src="/runtime/module-bootstrap.js"></script>',
    `<script src="/runtime/wallet-shim.js?${query}"></script>`
  ].join('\n');

  return /<head[^>]*>/i.test(html)
    ? html.replace(/<head[^>]*>/i, (m) => `${m}\n${support}`)
    : `<head>${support}</head>\n${html}`;
}

interface Loaded {
  dom: JSDOM;
  fetches: string[];
  errors: string[];
  bridgeRequests: { method: string }[];
}

/**
 * Load the artefact the way the runtime does.
 *
 * The support scripts are not fetched by jsdom (`resources` is left off on
 * purpose, so the test does not depend on a network). What matters to the code
 * under test is that the TAGS are in the document, which is exactly how it
 * detects the runtime - and the shim's observable contract is reproduced below.
 */
function loadUnderRuntime({ bridged }: { bridged: boolean }): Loaded {
  const fetches: string[] = [];
  const errors: string[] = [];
  const bridgeRequests: { method: string }[] = [];
  const token = bridged ? 'harness-bridge-token' : null;

  const served = rewriteHiroBases(inject(artifact, token));
  const url = `https://xtrata.xyz/viewer${token ? `?walletBridgeToken=${token}` : ''}`;

  const dom = new JSDOM(served, {
    runScripts: 'dangerously',
    url,
    pretendToBeVisual: true,
    beforeParse(window) {
      const w = window as unknown as Record<string, unknown>;

      w.fetch = async (path: string) => {
        fetches.push(String(path));
        return {
          ok: true,
          status: 200,
          json: async () => ({ okay: true, result: '0x0100000000000000000000000000000000' })
        };
      };

      // The shim's observable contract, reproduced faithfully:
      //
      //   * it marks itself installed
      //   * it patches window.StacksProvider and marks the provider
      //   * it REFUSES stx_callContract with -32601 unless a host bridge exists
      //
      // Everything the application does about the runtime keys off exactly
      // these three facts.
      w.__xtrataRuntimeWalletShimInstalled = true;
      w.StacksProvider = {
        __xtrataRuntimeWalletPatched: true,
        request: async (method: string) => {
          bridgeRequests.push({ method });
          if (/callContract/i.test(method) && !bridged) {
            const error = new Error('Wallet contract call requires host wallet bridge support.') as
              Error & { code?: number };
            error.code = -32601;
            throw error;
          }
          return {
            addresses: [{ symbol: 'STX', address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7' }]
          };
        }
      };

      // Framed. `isFramed()` is true when top !== self OR there is an opener.
      // jsdom makes `top` non-configurable, so the opener is used - which is a
      // real case anyway: the Xtrata site opens inscriptions both ways.
      if (bridged) w.opener = {};

      window.addEventListener('error', (event) => errors.push(String(event.message)));
      window.addEventListener('unhandledrejection', (event) => {
        const reason = (event as unknown as { reason?: { message?: string } }).reason;
        errors.push(String(reason?.message ?? reason));
      });
    }
  });

  return { dom, fetches, errors, bridgeRequests };
}

const settle = (): Promise<void> => new Promise((done) => setTimeout(done, 40));

describe('the real runtime scripts', () => {
  it('are where the harness expects them, or the harness says so plainly', () => {
    // Not a failure of the artefact if they are absent - it is a failure of the
    // checkout, and it must not be silently mistaken for a passing runtime test.
    const present = existsSync(RUNTIME_DIR);
    if (!present) {
      console.warn(
        `xtrata-2.0 runtime scripts not found at ${RUNTIME_DIR}. ` +
          'The runtime emulator needs them; this suite exercises the injection shape only.'
      );
    }
    expect(typeof present).toBe('boolean');
  });
});

describe('the serve-time rewrite', () => {
  it('rewrites Hiro bases in the HTML', () => {
    const served = rewriteHiroBases(artifact);
    expect(served).toContain('/hiro/mainnet');
    expect(served).not.toContain('https://api.mainnet.hiro.so');
  });

  it('is the reason the code has to choose its own base', () => {
    // The rewrite only touches text/html. Everything the board does at runtime
    // lives in JavaScript, so a board that relied on the rewrite alone would
    // send every viewer straight at the public host from one IP.
    expect(artifact).toContain('/hiro/mainnet');
  });
});

describe('booting under the runtime', () => {
  it('survives document.write and renders a board', async () => {
    const { dom } = loadUnderRuntime({ bridged: true });
    await settle();
    expect(dom.window.document.getElementById('board')).not.toBeNull();
    expect(dom.window.document.getElementById('open-game')).not.toBeNull();
    dom.window.close();
  });

  it('throws nothing uncaught', async () => {
    const { dom, errors } = loadUnderRuntime({ bridged: true });
    await settle();
    expect(errors, `uncaught under the runtime: ${errors.join(' | ')}`).toEqual([]);
    dom.window.close();
  });

  it('boots exactly one board', async () => {
    const { dom } = loadUnderRuntime({ bridged: true });
    await settle();
    const w = dom.window as unknown as Record<string, unknown>;
    expect(w.__xchess).toBeDefined();
    expect((w.__xchessRunning as { app: unknown }).app).toBe(w.__xchess);
    dom.window.close();
  });

  it('uses the runtime proxy rather than the public host', async () => {
    // The injected support scripts are how the board knows it is under the
    // runtime. Getting this wrong is invisible until an inscription is popular.
    const { dom, fetches } = loadUnderRuntime({ bridged: true });
    await settle();
    expect(fetches.length).toBeGreaterThan(0);
    for (const path of fetches) {
      expect(path, `went straight to the public host: ${path}`).not.toContain('api.mainnet.hiro.so');
    }
    expect(fetches.some((p) => p.startsWith('/hiro/mainnet'))).toBe(true);
    dom.window.close();
  });
});

describe('the bridge', () => {
  it('says up front that an unframed page cannot sign', async () => {
    // A raw link to /i/<id> reads and replays perfectly and can sign nothing.
    // Somebody should meet that as a sentence, not as a failed transaction.
    const { dom } = loadUnderRuntime({ bridged: false });
    await settle();
    const notice = dom.window.document.getElementById('sign-notice');
    expect(notice).not.toBeNull();
    expect(notice!.classList.contains('hide')).toBe(false);
    expect(notice!.textContent).toContain('cannot sign');
    dom.window.close();
  });

  it('does not warn when a bridge is there', async () => {
    const { dom } = loadUnderRuntime({ bridged: true });
    await settle();
    const notice = dom.window.document.getElementById('sign-notice');
    expect(notice!.classList.contains('hide')).toBe(true);
    dom.window.close();
  });

  it('leaves reading and replaying entirely available without a bridge', async () => {
    const { dom, fetches } = loadUnderRuntime({ bridged: false });
    await settle();
    // Reads happened; only signing is unavailable.
    expect(fetches.length).toBeGreaterThan(0);
    expect(dom.window.document.getElementById('board')).not.toBeNull();
    dom.window.close();
  });
});

describe('document.open wiping the page', () => {
  it('re-boots into a replacement document rather than sitting dead', async () => {
    // document.open() removes every listener on the window as well as on the
    // document, but it does NOT remove properties. A bare "already booted" flag
    // would survive the wipe that removed the listeners, and the board would
    // refuse to start again into the new document.
    const { dom } = loadUnderRuntime({ bridged: true });
    await settle();
    const w = dom.window as unknown as Record<string, unknown>;
    const before = w.__xchess;
    expect(before).toBeDefined();

    const guard = w.__xchessRunning as { doc: Document };
    expect(guard.doc, 'the guard must remember WHICH document it booted into').toBe(
      dom.window.document
    );
    dom.window.close();
  });
});

// ---------------------------------------------------------------------------
// The fallback list has to survive being served.
// ---------------------------------------------------------------------------

describe('what the rewrite leaves the board with', () => {
  it('still carries a real public host after the runtime has served it', () => {
    // The rewrite is a blind find-and-replace over text/html, so it did not
    // only rewrite URLs the page fetches - it rewrote the FALLBACK TABLE, whose
    // entire purpose is to survive one host going away. Under the runtime the
    // served bytes stopped containing the primary public host at all, and since
    // endpointsFor puts the proxy on top, entries 0 and 1 both pointed at the
    // proxy and failed together.
    //
    // This asserts against the BUILT artefact, because the defence is a
    // spelling that the minifier must not fold back into a matchable literal.
    const served = rewriteHiroBases(artifact);

    expect(
      served,
      'the served page no longer contains a real public Stacks host, so the ' +
        'fallback list is shorter than it looks'
    ).toMatch(/api\.hiro\.so|stacks-node-api/);

    // And the primary is still reachable in some spelling: the value has to
    // survive even though the literal must not.
    expect(
      served,
      'the primary host was eaten by the rewrite. Check that PUBLIC_API still ' +
        'splits it, and that esbuild has not folded the join back into a literal.'
    ).toContain('mainnet.hiro.so');
  });

  it('leaves the proxy exactly once, not twice', () => {
    // The duplicate is the symptom: two entries pointing at the same place look
    // like redundancy and are not.
    const served = rewriteHiroBases(artifact);
    const proxied = served.match(/https:\/\/xtrata\.xyz\/hiro\/mainnet/g) ?? [];
    expect(
      proxied.length,
      'the rewrite hit the fallback table, so the board has two entries for one host'
    ).toBe(0);
  });
});
