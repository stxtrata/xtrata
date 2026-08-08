// Class names that already mean something on this page.
//
// `.notice info` is how an info-level message has always been marked. Adding a
// `.info` rule for the settings icons gave every one of those messages the
// icon's inline-flex display, its 15px width and its absolutely positioned hit
// area — turning a sentence into a squashed column sitting on top of the panel
// below it. Two visual bugs, one collision, and nothing in the tests to catch
// it because both parts worked perfectly on their own.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const html = readFileSync(resolve(import.meta.dirname, '..', 'index.html'), 'utf8');
const styles = html.slice(html.indexOf('<style>'), html.indexOf('</style>'));

// Class names the page applies to more than one kind of thing, so a new rule
// for one silently restyles the other.
const SHARED = ['info', 'warn', 'error', 'good', 'bad', 'active', 'named', 'current'];

describe('class names used as a status', () => {
  it.each(SHARED)('%s is only ever styled with something else', (name) => {
    // A bare `.info {` matches <p class="notice info"> as readily as an icon.
    // Qualified selectors like `.notice.info` or `.hint.bad` are fine.
    const bare = new RegExp(`(^|[\\\\s,])\\\\.${name}\\\\s*[,{]`, 'm');
    expect(styles).not.toMatch(bare);
  });
});

describe('the settings icons', () => {
  it('use a name of their own', () => {
    expect(html).toContain('class="help"');
    expect(html).toContain('class="help-text"');
    expect(html).not.toContain('class="info"');
  });

  it('are wired to that name', () => {
    const app = readFileSync(resolve(import.meta.dirname, '..', 'src', 'app.js'), 'utf8');
    expect(app).toContain("closest?.('.help')");
    expect(app).toContain('.help-text[data-info=');
  });

  // Every icon must find its own explainer: they sit at row level rather than
  // beside the button, and one row carries two of them.
  it('pair up one to one', () => {
    const buttons = [...html.matchAll(/class="help"[^>]*data-info="([a-z]+)"/g)].map((m) => m[1]);
    const texts = [...html.matchAll(/class="help-text" data-info="([a-z]+)"/g)].map((m) => m[1]);
    expect(buttons.sort()).toEqual(texts.sort());
    expect(buttons).toHaveLength(4);
  });
});

describe('the heading logo', () => {
  it('reads as X even when the inscription cannot be fetched', () => {
    expect(html).toMatch(/<img class="logo-x"[^>]*alt="X"/);
    const boot = readFileSync(resolve(import.meta.dirname, '..', 'src', 'boot.js'), 'utf8');
    expect(boot).toContain("addEventListener('error'");
    expect(boot).toContain('logo-x--text');
  });
});
