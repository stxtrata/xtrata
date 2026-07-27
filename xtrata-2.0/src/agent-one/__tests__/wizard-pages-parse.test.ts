import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

/**
 * Every inline script in the wizard pages must PARSE.
 *
 * The pages are edited by hand and by script, and a bad edit does not fail a build —
 * there is no build step for them. It fails silently in the browser: the whole script
 * block is discarded at parse time, so the page renders but nothing works, and the
 * console shows one SyntaxError with no logs at all after it.
 *
 * That is exactly how a mangled condition (`ifSB.active{`, from a regex replacement
 * that swallowed the surrounding parentheses) shipped: the absence of console output
 * reads like a clean page rather than a dead one.
 *
 * Also checks that every element the script reaches for actually exists, which is the
 * other way these pages break — a markup edit removing a node whose wiring stays.
 */

const PAGES = ['index.html', 'suno.html', 'manifests.html'] as const;
const read = (f: string) => readFileSync(new URL(`../../../xtrata-agent-one/wizard/${f}`, import.meta.url), 'utf8');
type Inline = { src: string; module: boolean };
const inlineScripts = (html: string): Inline[] =>
  [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
    .map((m) => ({ src: m[2], module: /type\s*=\s*["']module["']/.test(m[1]) }));

// Classic scripts and modules have DIFFERENT rules — top-level await is a syntax error
// in one and legal in the other — so each is compiled the way the browser would.
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as any;
const compile = (s: Inline) => (s.module ? new AsyncFunction(s.src) : new vm.Script(s.src));

describe.each(PAGES)('%s', (page) => {
  const html = read(page);

  it('has inline script to check', () => {
    expect(inlineScripts(html).filter((s) => s.src.trim().length > 100).length).toBeGreaterThan(0);
  });

  it('every inline script parses', () => {
    inlineScripts(html).forEach((src, i) => {
      // vm.Script compiles with CLASSIC SCRIPT semantics — the same rules the browser
      // applies to <script> without type=module — and does not execute. new Function
      // would be wrong here: it wraps the source in a function body, which changes
      // what is legal at the top level.
      expect(() => compile(src), `${page} inline script #${i}${src.module ? ' (module)' : ''} does not parse`).not.toThrow();
    });
  });

  it('every element the script reaches for exists in the markup', () => {
    const ids = new Set([...html.matchAll(/\bid="([A-Za-z0-9_-]+)"/g)].map((m) => m[1]));
    const refs = new Set([
      ...[...html.matchAll(/\$\('#([A-Za-z0-9_-]+)'\)/g)].map((m) => m[1]),
      ...[...html.matchAll(/getElementById\(['"]([A-Za-z0-9_-]+)/g)].map((m) => m[1])
    ]);
    const missing = [...refs].filter((r) => !ids.has(r));
    expect(missing, `${page} wires elements that are not in the markup`).toEqual([]);
  });

  it('opens and closes the same number of divs', () => {
    const body = html.slice(html.indexOf('<body'), html.indexOf('</body>'));
    const open = (body.match(/<div\b/g) || []).length;
    const close = (body.match(/<\/div>/g) || []).length;
    expect(close, `${page} div nesting is unbalanced`).toBe(open);
  });
});
