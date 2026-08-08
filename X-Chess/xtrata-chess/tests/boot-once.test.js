/**
 * @vitest-environment jsdom
 */
// One page, one board.
//
// This is here because of a bug that was invisible everywhere except the thing
// that actually gets inscribed. boot.js used to auto-start when
// document.currentScript was set, on the reasoning that a classic script wants
// starting and a module import does not. Inside the built engine both are true
// at once: the bundle is a classic script, so currentScript is set while the
// bundled module bodies run, and the bundle's own footer also calls boot.
//
// Two boards. mountShell sees the markup is already there and leaves it, so the
// page looks perfect, and every button carries two listeners. One click on
// Submit move signs two transactions: two fees, two entries in a log that
// cannot be edited.
//
// The dev page imports boot.js as a module, where currentScript is null, so
// none of this ever appeared in development.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const root = resolve(import.meta.dirname, '..');

// The real markup, pulled out of index.html the same way the build pulls it.
// A cut-down stand-in would not do: the app wires every element it names, so a
// missing one throws and the test would pass for the wrong reason.
function shellHtml() {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const body = (html.match(/<body>([\s\S]*?)<\/body>/) || [, ''])[1];
  return body.replace(/<script[\s\S]*?<\/script>/g, '').trim();
}

async function freshBoot() {
  // A clean module registry, so `running` starts empty rather than carrying
  // over from the previous test.
  vi.resetModules();
  const module = await import('../src/boot.js');
  module.SHELL.html = shellHtml();
  return module.boot;
}

describe('booting twice', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it('gives one board back, not two', async () => {
    const boot = await freshBoot();

    const first = boot();
    const second = boot();

    expect(second).toBe(first);
    expect(document.querySelectorAll('#board')).toHaveLength(1);
  });

  it('counts a click once when boot has been called twice', async () => {
    const boot = await freshBoot();
    const app = boot();
    boot();

    // Stand in for the wallet round trip. What is being counted is how many
    // times one click reaches the handler, which is what cost two fees.
    let connects = 0;
    app.connect = async () => { connects += 1; };

    document.getElementById('connect').click();
    expect(connects).toBe(1);
  });

  it('submits one transaction for one click', async () => {
    const boot = await freshBoot();
    const app = boot();
    boot();

    let submissions = 0;
    app.submit = async () => { submissions += 1; };

    // Submitting is a form submit, so go through the form rather than poking
    // the method: the duplicate listener lived on the form, not the button.
    document.getElementById('manual-input').value = 'e2e4';
    document.getElementById('manual-form')
      .dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    // This is the one that cost money: two listeners meant two transactions,
    // two fees, and two entries in a log nobody can edit.
    expect(submissions).toBe(1);
  });
});

describe('the built engine', () => {
  // Reading the artifact rather than the source, because the source was fine.
  const engine = readFileSync(resolve(root, 'dist/xtrata-chess-engine.js'), 'utf8');

  it('starts the board exactly once', () => {
    const starts = engine.match(/__boot\.boot\(\)/g) || [];
    // The footer's readyState branch names it twice: once for DOMContentLoaded,
    // once for a document that has already finished. Only one can run.
    expect(starts.length).toBeLessThanOrEqual(2);

    // And no currentScript guard survives as code. It is still described in a
    // comment in boot.js, which the bundler keeps, so the comments come out
    // before looking.
    const code = engine.replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toMatch(/document\.currentScript/);
  });

  it('has no second entry point hiding in a module body', () => {
    // Any addEventListener('DOMContentLoaded', ...) that boots, other than the
    // footer's, is a second board waiting to happen.
    const booters = engine.match(/DOMContentLoaded[^)]*\)[^;]*boot\(\)/g) || [];
    expect(booters.length).toBeLessThanOrEqual(1);
  });
});
