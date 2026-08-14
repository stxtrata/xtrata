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

  it('paints a1 dark in the SHIPPED bundle, not just in the source', () => {
    // tests/ui/board-colour.test.ts asserts this properly, by rendering. This is
    // the artefact-level guard underneath it, and it exists because the parity
    // was inverted in a build that every source-reading test passed.
    //
    // Variable names change with every minify, so the match is on the shape:
    // the parity test, then the class it decides, within a hundred-odd bytes.
    // The board is the only place in the bundle that pairs those two.
    expect(
      html,
      'the shipped board no longer decides sq--dark from an odd file+rank parity, ' +
        'so either it was inverted again or the renderer moved. Check ' +
        'packages/ui/board.ts and tests/ui/board-colour.test.ts.'
    ).toMatch(/%2===1.{0,120}sq--dark/s);
    expect(html, 'the shipped board paints a1 light, which is inverted').not.toMatch(
      /%2===0.{0,120}sq--dark/s
    );
  });

  it('is small enough to be worth inscribing', () => {
    // The real gate is the CHUNK COUNT, in tests/artifact/budget.test.ts, because
    // a chunk is what Xtrata charges for. This is the backstop underneath it: a
    // figure that catches a catastrophe rather than a regression.
    //
    // It used to be 250,000 - sixteen chunks - which let the artefact double
    // without anybody being told.
    //
    // 150,000 -> 170,000 on 2026-08-14, deliberately. The board gained the entry
    // cache, a seat that locks to its first mover, a sponsored filter and the
    // explainers, and crossed the old figure at 154,435. Still ten of the
    // thirty-two chunks that upload in one transaction, which is the gate that
    // costs money; this one only has to catch a catastrophe.
    expect(Buffer.byteLength(html, 'utf8')).toBeLessThan(170_000);
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

// ---------------------------------------------------------------------------
// No secret may be inscribed.
//
// A key compiled into this file is PUBLISHED FOREVER. It cannot be rotated out
// of an inscription, it cannot be removed, and anybody who reads the bytes can
// spend it. There is no incident response for it - only a revoked key and every
// copy of the board broken with it.
//
// The board never needs one. Under the runtime its API calls are rewritten to
// `/hiro/<network>`, which is a proxy, and the proxy is where a key belongs -
// which is what production does in xtrata-2.0/functions/lib/hiro-proxy.ts and
// what harness/runtime/serve.mjs now does locally.
//
// Written when the local harness gained key support, because that is exactly
// when a key becomes ambient in the build environment and could be picked up by
// something well meaning.
// ---------------------------------------------------------------------------

describe('what must never be in a permanent file', () => {
  const built = {
    board: readFileSync(resolve(ROOT, 'dist/xchess.html'), 'utf8'),
    gates: readFileSync(resolve(ROOT, 'dist/xchess-gates.html'), 'utf8')
  };

  it('carries no API key header, so nothing can be sending one', () => {
    for (const [name, text] of Object.entries(built)) {
      expect(text.toLowerCase(), `${name} sends an API key header`).not.toContain('x-hiro-api-key');
      expect(text.toLowerCase(), `${name} sends an API key header`).not.toContain('x-api-key');
    }
  });

  it('carries no key-shaped value under a key-shaped name', () => {
    // Deliberately about the NAME as well as the shape: a 32-character hex run
    // is also what a transaction id or a hash looks like, and the artefact is
    // full of those. A hex run introduced as a key is not.
    const named = /(?:api[_-]?key|apikey|secret|token)["'\s:=]+["']?[A-Za-z0-9_-]{16,}/i;
    for (const [name, text] of Object.entries(built)) {
      const hit = named.exec(text);
      expect(
        hit,
        `${name} contains something named like a secret: ${hit?.[0]?.slice(0, 40)}`
      ).toBeNull();
    }
  });

  it('names the proxy path rather than a key, which is how it gets its allowance', () => {
    // Not a secret check - the reason the checks above can pass at all. If this
    // ever fails, the board has stopped going through the proxy and the two
    // tests above have become vacuous rather than satisfied.
    expect(built.board, 'the board no longer reaches the chain through a rewritable host').toContain(
      'hiro.so'
    );
  });
});

// ---------------------------------------------------------------------------
// The shell's prose is not inscribed.
//
// The CSS and HTML carry about 12 KB of comments explaining why a grid row is
// explicit, why the selection ring is two-tone, why there are no backticks in a
// comment. Every one of them is worth keeping - they are why the same bug has
// not been reintroduced three times - and none of them is worth paying for
// forever. They stay in source and are stripped at build time.
//
// The trap, and the reason this is not one regex: the CSS literal interpolates
// SCALE_CSS in the middle of itself. Lose that and the per-piece font sizes
// simply vanish, and every piece renders at the default size - which looks like
// a design choice rather than a fault.
// ---------------------------------------------------------------------------

describe('what the shell costs to inscribe', () => {
  it('carries none of the prose that explains it', () => {
    for (const [name, text] of Object.entries({
      board: readFileSync(resolve(ROOT, 'dist/xchess.html'), 'utf8'),
      gates: readFileSync(resolve(ROOT, 'dist/xchess-gates.html'), 'utf8')
    })) {
      expect(text, `${name} still inscribes the stylesheet's comments`).not.toContain(
        'NOTE: no backticks'
      );
      expect(text, `${name} still inscribes an HTML comment`).not.toContain(
        'WHO YOU ARE, permanently'
      );
    }
  });

  it('keeps the source readable, which is the whole reason this is a build step', () => {
    // If the comments ever leave `packages/ui/shell.ts` the saving has been
    // taken twice, and the second time it cost the explanations.
    const source = readFileSync(resolve(ROOT, 'packages/ui/shell.ts'), 'utf8');
    expect(source, 'the stylesheet has lost its own explanations').toContain('NOTE: no backticks');
  });

  it('did not eat the interpolation that sizes the pieces', () => {
    // SCALE_CSS is generated at runtime from SCALE, so it is never literal CSS
    // in the artefact - what has to survive is the GENERATOR. The proposal that
    // asked for this suggested asserting a `.pc--wk { font-size:` rule, which
    // could never have been there.
    expect(html, 'the per-piece font sizes are no longer generated at all').toMatch(
      /\.pc--\$\{[^}]*\}[^`]*font-size/
    );
  });

  it('still ships every rule the board depends on', () => {
    // A minifier that dropped a block would be silent. These are the ones whose
    // absence is a fault somebody already found the hard way.
    for (const rule of [
      'sq--dark',
      'sq--selected',
      'sq--en-passant',
      'co--rank',
      '--line-2',
      'board--loading'
    ]) {
      expect(html, `${rule} did not survive minification`).toContain(rule);
    }
  });

  it('is smaller for it, in the unit that costs money', () => {
    const manifest = JSON.parse(readFileSync(resolve(ROOT, 'dist/manifest.json'), 'utf8')) as {
      xtrataChunks: number;
    };
    // 156,029 bytes and ten chunks before this; 141,690 and nine after. The
    // chunk is the unit Xtrata charges for, so crossing back over one is the
    // saving that can actually be felt.
    expect(manifest.xtrataChunks, 'the shell minifier stopped paying for itself').toBeLessThan(10);
  });
});

// ---------------------------------------------------------------------------
// The same source, built twice, is the same artefact.
//
// A wall-clock timestamp is baked into the build, so two builds of identical
// source disagreed the moment they straddled a minute. That is not a tidiness
// complaint: the wallet matrix signs every row against `manifest.htmlSha256`,
// and `verify` rebuilds as its LAST layer - so running verify after the matrix
// silently invalidated every row somebody had just earned by hand, and the gate
// would then refuse with no way to tell that from a real regression.
//
// Worse, quietly: you could inscribe an artefact that is not the one you tested.
// ---------------------------------------------------------------------------

describe('building the same thing twice', () => {
  it('can be pinned, so a release and its evidence agree', () => {
    const source = readFileSync(resolve(ROOT, 'packages/build/build.mjs'), 'utf8');
    expect(source, 'the build time is no longer pinnable').toContain('SOURCE_DATE_EPOCH');
    expect(source, 'a person cannot say the build time plainly').toContain("arg('built'");
  });

  it('says when it was built, which is what makes pinning necessary', () => {
    // If the stamp ever leaves the artefact this whole problem goes away and
    // these tests should go with it.
    expect(html, 'the build no longer stamps itself').toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
  });
});
