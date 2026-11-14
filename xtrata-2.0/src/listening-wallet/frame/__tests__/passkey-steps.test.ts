// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { showPasskeySteps } from '../ui';

const lights = () => Array.from(document.querySelectorAll('#p-steps li')).map((li) => li.className || '-').join(' ');

describe('the passkey lights in the wallet box (decoration only)', () => {
  beforeEach(() => { document.body.innerHTML = '<ol id="p-steps" class="steps" hidden><li></li><li></li><li></li></ol>'; });

  it('lights one step per passkey screen and hides for every other panel', () => {
    showPasskeySteps('create'); expect(lights()).toBe('now - -');
    showPasskeySteps('confirm-passkey'); expect(lights()).toBe('done now -');
    showPasskeySteps('verify-passkey'); expect(lights()).toBe('done done now');
    expect((document.getElementById('p-steps') as HTMLElement).hidden).toBe(false);
    for (const kind of ['unlock', 'session', 'return', 'link'] as const) { showPasskeySteps(kind); expect((document.getElementById('p-steps') as HTMLElement).hidden).toBe(true); }
  });

  it('does nothing, and throws nothing, in a frame that has no lights (the casino wallet)', () => {
    document.body.innerHTML = '';
    expect(() => showPasskeySteps('create')).not.toThrow();
  });

  it('adds nothing that can be tapped, and nothing the confirm button could be hidden by', () => {
    for (const file of ['index.html', 'create.html']) {
      const html = readFileSync(`src/listening-wallet/frame/${file}`, 'utf8');
      const added = html.match(/<ol[^>]*class="steps[\s\S]*?<\/ol>|<svg class="mark"[\s\S]*?<\/svg>/g) ?? [];
      expect(added.length).toBeGreaterThan(1);
      for (const part of added) expect(part).not.toMatch(/<button|<a |href=|onclick|<script|style=/i);
    }
    // The stylesheet's own rule: the confirm button's visibility check reads opacity, transform, filter or animation as "hidden".
    const css = readFileSync('src/listening-wallet/frame/wallet.css', 'utf8');
    const mine = css.slice(css.indexOf('/* Decoration only'), css.indexOf('h1 {'));
    expect(mine).toContain('.steps');
    expect(mine.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/opacity|transform|filter|animation|position:\s*(fixed|absolute)[^}]*inset/i);
    // The buttons, and the order of everything in the panel, are as they were.
    const index = readFileSync('src/listening-wallet/frame/index.html', 'utf8');
    expect(index).toContain('<button id="p-ok" type="button" class="primary"></button>\n      <button id="p-cancel" type="button">Not now</button>');
  });
});
