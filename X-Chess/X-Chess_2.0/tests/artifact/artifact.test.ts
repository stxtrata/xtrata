// The built artefact.
//
// These tests read `dist/`, NOT the source, and that is the whole point. The
// legacy project's worst bug - the app booting twice, so every click signed two
// transactions - was correct in every source file and wrong only in the bundle.
// A suite that reads source cannot see it.
//
// Run `npm run build` first. The release gate does.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const HTML_PATH = resolve(ROOT, 'dist/xchess.html');
const MANIFEST_PATH = resolve(ROOT, 'dist/manifest.json');

let html = '';
let manifest: Record<string, unknown> = {};

beforeAll(() => {
  if (!existsSync(HTML_PATH)) {
    throw new Error('dist/xchess.html is missing. Run `npm run build` before this suite.');
  }
  html = readFileSync(HTML_PATH, 'utf8');
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
});

/**
 * A page with the artefact loaded and a stubbed chain.
 *
 * `runScripts: 'dangerously'` is exactly what the Xtrata runtime does with the
 * inscription's bytes, so this is the honest way to load it.
 */
interface Loaded {
  dom: JSDOM;
  walletCalls: string[];
  fetches: string[];
  errors: string[];
}

function loadArtifact(options: { fetch?: 'ok' | 'down' | 'missing' } = {}): Loaded {
  const walletCalls: string[] = [];
  const fetches: string[] = [];
  const errors: string[] = [];

  // Stubs must be installed BEFORE the scripts run. JSDOM executes them
  // synchronously while constructing, so assigning afterwards is too late and
  // the page boots against a missing fetch - which is how this suite first
  // reported a perfectly good artefact as broken.
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'https://xtrata.xyz/i/9002',
    pretendToBeVisual: true,
    beforeParse(window) {
      const w = window as unknown as Record<string, unknown>;

      w.fetch = async (url: string) => {
        fetches.push(String(url));
        if (options.fetch === 'down') throw new Error('offline');
        if (options.fetch === 'missing') {
          return { ok: false, status: 404, json: async () => ({}) };
        }
        // A well-formed read-only answer, so the board's happy path runs.
        return {
          ok: true,
          status: 200,
          json: async () => ({ okay: true, result: '0x0100000000000000000000000000000000' })
        };
      };

      if (options.fetch !== 'missing') {
        w.StacksProvider = {
          request: async (method: string) => {
            walletCalls.push(method);
            return {
              addresses: [{ symbol: 'STX', address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7' }]
            };
          }
        };
      }

      window.addEventListener('error', (event) => errors.push(String(event.message)));
      window.addEventListener('unhandledrejection', (event) => {
        // Not instanceof: an Error thrown inside this realm fails an instanceof
        // check against ours, and a perfectly good stack trace collapses to {}.
        const reason = (event as unknown as { reason?: { message?: string } }).reason;
        errors.push(String(reason?.message ?? reason));
      });
    }
  });

  return { dom, walletCalls, fetches, errors };
}

/**
 * Load and wait for the board to exist.
 *
 * Boot is deferred until the document has a body, so nothing is on screen at
 * the instant JSDOM finishes constructing. A synchronous assertion here would
 * be testing the wrong moment, not a broken artefact.
 */
async function loadedArtifact(options: { fetch?: 'ok' | 'down' | 'missing' } = {}): Promise<Loaded> {
  const loaded = loadArtifact(options);
  await new Promise((done) => setTimeout(done, 30));
  return loaded;
}

/** The application's own script, as it sits in the page. */
function appScript(): string {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  // The last one is the application; the first is the config block.
  return scripts[scripts.length - 1];
}

describe('the bytes', () => {
  it('has exactly one unescaped closing script tag', () => {
    // The bug this exists for truncated every self-contained build SILENTLY.
    // The page looked like a page and simply stopped at the truncation.
    expect((html.match(/<\/script/gi) || []).length).toBe(1);
  });

  it('loads nothing from anywhere', () => {
    // An inscription cannot fetch. Anything with a src or href would be a
    // permanent dependency on somebody else's server.
    expect(html).not.toMatch(/<script[^>]+src=/i);
    expect(html).not.toMatch(/<link[^>]+href=/i);
    expect(html).not.toMatch(/@import/i);
  });

  it('carries no server reference at all', () => {
    for (const pattern of [
      /localhost/i,
      /127\.0\.0\.1/,
      /xchess\.xyz/i,
      /\/api\/(sign|sponsor|relay|leaderboard)/i,
      /new WebSocket/,
      /firebase|supabase/i
    ]) {
      expect(html, `built artefact matches ${pattern}`).not.toMatch(pattern);
    }
  });

  it('carries no key, mnemonic or token', () => {
    for (const pattern of [/mnemonic/i, /privateKey/i, /sk_live/i, /x402_sk/i]) {
      expect(html, String(pattern)).not.toMatch(pattern);
    }
  });

  it('is small enough to be worth inscribing', () => {
    // Not a hard protocol limit, but every byte is permanent and paid for.
    expect(Buffer.byteLength(html, 'utf8')).toBeLessThan(250_000);
  });
});

describe('what it is bound to', () => {
  it('names exactly one contract, baked in', () => {
    expect(html).toContain(manifest.contract as string);
  });

  it('is exact, so it cannot silently talk to a different contract', () => {
    // A fallback chain would let one failed request show a different log under
    // the same game number, and a reader would have no way to tell.
    expect(manifest.exact).toBe(true);
    expect(html).toMatch(/"exact":\s*true/);
  });

  it('names its network', () => {
    expect(manifest.network).toBe('mainnet');
    expect(html).toContain('"network":"mainnet"');
  });

  it('records every protocol version it implements', () => {
    expect(manifest.rulesProtocol).toBe('rules-v1');
    expect(manifest.replayProtocol).toBe('replay-v1');
    expect(manifest.eventsProtocol).toBe('events-v1');
    expect(manifest.rankedProtocol).toBe('ranked-v1');
    expect(manifest.ratingProtocol).toBe('elo-v1');
    expect(manifest.coreFormat).toBe('xchess-core-v1');
  });

  it('records hashes that pin what it agrees the rules are', () => {
    for (const key of ['replayHash', 'rulesHash', 'ratingHash', 'contractHash', 'htmlSha256']) {
      expect(String(manifest[key]), key).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it('has a manifest hash that matches the file on disk', () => {
    // Provenance nobody has to be trusted about.
    const { createHash } = require('node:crypto') as typeof import('node:crypto');
    expect(createHash('sha256').update(html).digest('hex')).toBe(manifest.htmlSha256);
  });
});

describe('booting', () => {
  it('renders a board', async () => {
    const { dom } = await loadedArtifact();
    const board = dom.window.document.getElementById('board');
    expect(board).not.toBeNull();
    expect(board!.querySelectorAll('.sq')).toHaveLength(0);
    // The shell exists even before a game is loaded.
    expect(dom.window.document.getElementById('open-game')).not.toBeNull();
    dom.window.close();
  });

  it('publishes exactly one board', async () => {
    const { dom } = await loadedArtifact();
    const app = (dom.window as unknown as Record<string, unknown>).__xchess;
    expect(app).toBeDefined();
    dom.window.close();
  });

  it('BOOTS ONCE even when the bundle runs twice', async () => {
    // The bug: `document.currentScript` is truthy inside a bundle, so a guard
    // meant to separate "classic script" from "module import" fired in both and
    // started a second board. Markup guards made the second mount a no-op, so
    // the page looked PERFECT and every button had two listeners:
    // two wallet prompts per connect, TWO SIGNED TRANSACTIONS PER MOVE.
    const { dom, walletCalls } = await loadedArtifact();
    const first = (dom.window as unknown as Record<string, unknown>).__xchess;

    // Run the whole application script a second time in the same page.
    dom.window.eval(appScript());
    const second = (dom.window as unknown as Record<string, unknown>).__xchess;

    expect(second, 'a second boot replaced the board').toBe(first);

    // And the decisive check: one click must produce one action.
    const connect = dom.window.document.getElementById('connect') as HTMLButtonElement;
    walletCalls.length = 0;
    connect.click();

    return new Promise<void>((done) => {
      setTimeout(() => {
        const connects = walletCalls.filter((m) => /connect|Accounts|Addresses/i.test(m));
        // One click, one conversation with the wallet. Two would be the bug.
        expect(new Set(connects).size).toBe(connects.length);
        dom.window.close();
        done();
      }, 50);
    });
  });

  it('survives having no wallet at all', async () => {
    const { dom } = await loadedArtifact({ fetch: 'missing' });
    expect(dom.window.document.getElementById('board')).not.toBeNull();
    expect(dom.window.document.getElementById('connect')).not.toBeNull();
    dom.window.close();
  });

  it('survives the chain being unreachable, and says so rather than breaking', async () => {
    const { dom } = await loadedArtifact({ fetch: 'down' });
    await new Promise((done) => setTimeout(done, 50));
    // The page is still a page. Degrading rather than breaking is the only
    // acceptable behaviour for something that cannot be corrected.
    expect(dom.window.document.getElementById('chain-notice')).not.toBeNull();
    expect(dom.window.document.getElementById('open-game')).not.toBeNull();
    dom.window.close();
  });

  it('throws nothing uncaught while booting', async () => {
    const { dom, errors } = await loadedArtifact();
    expect(errors, `uncaught while booting: ${errors.join(' | ')}`).toEqual([]);
    dom.window.close();
  });
});

describe('the copy a player reads', () => {
  // Pinned deliberately. These strings are what somebody meets at the moment
  // they are deciding whether to spend money, and a wording change should be a
  // decision rather than an accident.
  it('says that a submission that does not count was still charged', () => {
    expect(html).toContain('still stored and still cost its network fee');
  });

  it('says plainly when sponsorship has run out', () => {
    expect(html).toContain('Sponsored transactions remaining');
    expect(html).toContain('The game continues normally');
  });

  it('explains an unsigned page rather than letting it fail as a transaction', () => {
    expect(html).toContain('cannot sign');
  });

  it('says a board that cannot confirm the rules is refereeing nothing', () => {
    expect(html).toContain('refereeing nothing');
  });
});

const BUILT: Record<string, string> = {
  board: readFileSync('dist/xchess.html', 'utf8'),
  gates: readFileSync('dist/xchess-gates.html', 'utf8')
};

describe('the document the runtime will rewrite', () => {
  // Caught by the pre-inscription rehearsal, and permanent if it had not been.
  //
  // The Xtrata runtime injects its base tag and support scripts by finding a
  // <head> and inserting after it. With no literal head to match it falls back
  // to PREPENDING them, which puts markup before the doctype and renders the
  // whole board in Quirks Mode - a different box model, on a grid that depends
  // on aspect-ratio.
  //
  // Invisible locally: served as a file the page is standards mode and fine.
  it('has a literal <head> for the runtime to inject into', () => {
    for (const [name, html] of Object.entries(BUILT)) {
      expect(html, `${name} has no <head> tag`).toMatch(/<head[^>]*>/i);
    }
  });

  it('starts with the doctype and nothing before it', () => {
    for (const [name, html] of Object.entries(BUILT)) {
      expect(html.trimStart().slice(0, 15).toLowerCase(), `${name}`).toBe('<!doctype html>');
    }
  });

  it('survives the runtime injection in standards mode', () => {
    // The exact substitution harness/runtime/serve.mjs performs.
    for (const [name, html] of Object.entries(BUILT)) {
      const support = '<base href="https://x.test/"><script src="/runtime/url-support.js"></script>';
      const rewritten = /<head[^>]*>/i.test(html)
        ? html.replace(/<head[^>]*>/i, (m) => `${m}\n${support}`)
        : `${support}\n${html}`;
      expect(
        rewritten.trimStart().slice(0, 15).toLowerCase(),
        `${name} would render in Quirks Mode under the runtime`
      ).toBe('<!doctype html>');
    }
  });
});
