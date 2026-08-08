// The built gates page.
//
// This artefact drives a contract deploy and a permanent inscription. What is
// tested here is not that it looks right - it is that a person cannot get
// ahead of themselves with it.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, it } from 'vitest';
import { STEPS } from '../../packages/ui/gates.js';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const PATH = resolve(ROOT, 'dist/xchess-gates.html');
const CONTRACT = resolve(ROOT, 'contracts/xchess-core-v1.clar');

let html = '';

beforeAll(() => {
  if (!existsSync(PATH)) {
    throw new Error('dist/xchess-gates.html is missing. Run `npm run build` before this suite.');
  }
  html = readFileSync(PATH, 'utf8');
});

function load(): JSDOM {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'https://xtrata.xyz/gates',
    beforeParse(window) {
      const w = window as unknown as Record<string, unknown>;
      w.fetch = async () => ({ ok: true, status: 200, json: async () => ({}) });
    }
  });
  return dom;
}

const settle = (): Promise<void> => new Promise((done) => setTimeout(done, 30));

describe('the bytes', () => {
  it('has exactly one unescaped closing script tag', () => {
    expect((html.match(/<\/script/gi) || []).length).toBe(1);
  });

  it('loads nothing from anywhere', () => {
    expect(html).not.toMatch(/<script[^>]+src=/i);
    expect(html).not.toMatch(/<link[^>]+href=/i);
  });

  it('carries the contract source it is going to deploy', () => {
    // The page deploys from its own bytes. If the source were fetched, the
    // thing deployed would depend on a server being up at that moment.
    expect(html).toContain('THE CONTRACT MAY FILTER, NEVER ADJUDICATE');
    expect(html).toContain('as-contract?');
  });

  it('carries the SAME source as the file on disk', () => {
    // A gates page built from a different contract than the repo holds would
    // deploy something nobody reviewed.
    const source = readFileSync(CONTRACT, 'utf8');
    const embedded = JSON.stringify(source).slice(1, -1);
    expect(html).toContain(embedded.slice(0, 400));
    expect(createHash('sha256').update(source).digest('hex')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('names Clarity 4, which the contract requires', () => {
    // `as-contract` does not exist in Clarity 4 and `as-contract?` does not
    // exist below it. Deploying at the wrong version fails, or worse, succeeds
    // against a different language.
    expect(html).toContain('"clarityVersion":4');
  });

  it('carries no key or mnemonic', () => {
    for (const pattern of [/mnemonic/i, /privateKey/i, /seedPhrase/i]) {
      expect(html, String(pattern)).not.toMatch(pattern);
    }
  });
});

describe('the page', () => {
  it('renders every step', async () => {
    const dom = load();
    await settle();
    const cards = dom.window.document.querySelectorAll('.step');
    expect(cards).toHaveLength(STEPS.length);
    dom.window.close();
  });

  it('shows each step in order, with its explanation', async () => {
    const dom = load();
    await settle();
    const titles = [...dom.window.document.querySelectorAll('.step-title')].map(
      (n) => n.textContent
    );
    expect(titles).toEqual(STEPS.map((s) => s.title));
    for (const why of dom.window.document.querySelectorAll('.step-why')) {
      expect(why.textContent!.length).toBeGreaterThan(60);
    }
    dom.window.close();
  });

  it('enables only the steps that need nothing', async () => {
    const dom = load();
    await settle();
    const enabled = [...dom.window.document.querySelectorAll('.step')]
      .map((card, index) => ({ index, button: card.querySelector('button:not([disabled])') }))
      .filter((x) => x.button)
      .map((x) => STEPS[x.index].id);
    expect(enabled).toEqual(['wallet', 'source']);
    dom.window.close();
  });

  it('says what a locked step is waiting on, rather than only greying out', async () => {
    const dom = load();
    await settle();
    const deploy = dom.window.document.querySelectorAll('.step')[
      STEPS.findIndex((s) => s.id === 'deploy')
    ];
    expect(deploy.textContent).toContain('Waiting on:');
    expect(deploy.textContent).toContain('Check the contract name is free');
    dom.window.close();
  });

  it('marks every irreversible step visibly', async () => {
    const dom = load();
    await settle();
    const cards = [...dom.window.document.querySelectorAll('.step')];
    for (const [index, step] of STEPS.entries()) {
      const tagged = cards[index].querySelector('.tag--irreversible') !== null;
      expect(tagged, `${step.id} tag`).toBe(step.irreversible);
    }
    dom.window.close();
  });

  it('demands the step name be typed before an irreversible step can run', async () => {
    // Not "yes" and not "confirm". Typing `prod-inscribe` requires having read
    // which step you are on, which is the mistake being guarded against.
    const dom = load();
    await settle();
    const cards = [...dom.window.document.querySelectorAll('.step')];
    for (const [index, step] of STEPS.entries()) {
      if (!step.irreversible) continue;
      const confirm = cards[index].querySelector('.confirm');
      expect(confirm, `${step.id} has no confirmation`).not.toBeNull();
      expect(confirm!.querySelector('code')!.textContent).toBe(step.id);
      const run = confirm!.querySelector('button') as HTMLButtonElement;
      expect(run.disabled, `${step.id} run button starts enabled`).toBe(true);
    }
    dom.window.close();
  });

  it('keeps the run button disabled when the wrong word is typed', async () => {
    const dom = load();
    await settle();
    const index = STEPS.findIndex((s) => s.id === 'deploy');
    const confirm = dom.window.document.querySelectorAll('.step')[index].querySelector('.confirm')!;
    const input = confirm.querySelector('input') as HTMLInputElement;
    const run = confirm.querySelector('button') as HTMLButtonElement;

    input.value = 'yes';
    input.dispatchEvent(new dom.window.Event('input'));
    expect(run.disabled).toBe(true);

    // Even the RIGHT word does not help while the step is still locked.
    input.value = 'deploy';
    input.dispatchEvent(new dom.window.Event('input'));
    expect(run.disabled, 'a locked step became runnable by typing its name').toBe(true);
    dom.window.close();
  });

  it('warns about what the page does, before anything is clicked', async () => {
    const dom = load();
    await settle();
    const text = dom.window.document.body.textContent ?? '';
    expect(text).toContain('read back off chain');
    expect(text).toContain('cannot be withdrawn');
    dom.window.close();
  });

  it('throws nothing while loading', async () => {
    const errors: string[] = [];
    const dom = new JSDOM(html, {
      runScripts: 'dangerously',
      url: 'https://xtrata.xyz/gates',
      beforeParse(window) {
        (window as unknown as Record<string, unknown>).fetch = async () => ({
          ok: true,
          status: 200,
          json: async () => ({})
        });
        window.addEventListener('error', (e) => errors.push(String(e.message)));
        window.addEventListener('unhandledrejection', (e) => {
          const reason = (e as unknown as { reason?: { message?: string } }).reason;
          errors.push(String(reason?.message ?? reason));
        });
      }
    });
    await settle();
    expect(errors, errors.join(' | ')).toEqual([]);
    dom.window.close();
  });
});
