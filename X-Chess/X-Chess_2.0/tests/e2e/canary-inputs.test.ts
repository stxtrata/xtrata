// What the operator types must survive the page redrawing.
//
// This is a regression suite for a bug that made the gates page unusable at the
// first step that needed an input, and did it in the most misleading way
// possible: the page reported "type the address of a wallet holding exactly
// zero STX" at somebody who had typed exactly that.
//
// The cause: `render()` rebuilds every card, and marking a step `running`
// triggers a render. So clicking Run destroyed the input element and recreated
// it empty BEFORE the handler read it. Reading values off the DOM at handler
// time was reading a field that no longer existed.
//
// The fix is that typed values live outside the DOM. These tests hold it there.

import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Canary } from '../../packages/ui/canary.js';
import type { StepResult } from '../../packages/ui/canary.js';

let dom: JSDOM;

beforeEach(() => {
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/gates'
  });
  const g = globalThis as unknown as Record<string, unknown>;
  g.document = dom.window.document;
});

const ADDRESS = 'SP3T4YDPEXJSASYYEX2VRZYQY7SYPH9E3TJ8H1KFZ';

function type(name: string, value: string): void {
  const input = dom.window.document.querySelector(`[data-input='${name}']`) as HTMLInputElement;
  expect(input, `no input rendered for ${name}`).not.toBeNull();
  input.value = value;
  input.dispatchEvent(new dom.window.Event('input'));
}

function clickRun(stepIndex: number): void {
  const card = dom.window.document.querySelectorAll('.step')[stepIndex];
  const button = [...card.querySelectorAll('button')].find((b) => b.textContent?.includes('Run') || b.textContent?.includes('Record'));
  expect(button, 'no run button on that step').toBeDefined();
  (button as HTMLButtonElement).click();
}

describe('a typed value survives the page redrawing', () => {
  it('reaches the handler that needs it', async () => {
    let seen: string | null = null;
    const canary = new Canary({
      document: dom.window.document,
      build: { network: 'testnet', contract: 'ST0.test' },
      inputs: { wallet: [{ name: 'opponent', label: 'address' }] },
      handlers: {
        wallet: async (ctx): Promise<StepResult> => {
          seen = ctx.input('opponent');
          return { ok: true, detail: 'read it' };
        }
      }
    });

    type('opponent', ADDRESS);
    clickRun(0);
    await new Promise((done) => setTimeout(done, 20));

    // Before the fix this was '' — the input had been destroyed and recreated
    // by the render that marking the step `running` triggered.
    expect(seen, 'the handler saw an empty field').toBe(ADDRESS);
    expect(canary.stepStates.wallet).toBe('ok');
  });

  it('is still in the box after the step runs', async () => {
    new Canary({
      document: dom.window.document,
      build: { network: 'testnet', contract: 'ST0.test' },
      inputs: { wallet: [{ name: 'opponent', label: 'address' }] },
      handlers: {
        wallet: async (): Promise<StepResult> => ({ ok: false, detail: 'not this time' })
      }
    });

    type('opponent', ADDRESS);
    clickRun(0);
    await new Promise((done) => setTimeout(done, 20));

    // A failed step must not also lose what was typed, or the operator has to
    // retype an address on every retry.
    const input = dom.window.document.querySelector("[data-input='opponent']") as HTMLInputElement;
    expect(input.value).toBe(ADDRESS);
  });

  it('is trimmed, so a stray space pasted with an address does not fail it', async () => {
    let seen: string | null = null;
    new Canary({
      document: dom.window.document,
      build: { network: 'testnet', contract: 'ST0.test' },
      inputs: { wallet: [{ name: 'opponent', label: 'address' }] },
      handlers: {
        wallet: async (ctx): Promise<StepResult> => {
          seen = ctx.input('opponent');
          return { ok: true, detail: 'ok' };
        }
      }
    });

    type('opponent', `  ${ADDRESS} `);
    clickRun(0);
    await new Promise((done) => setTimeout(done, 20));
    expect(seen).toBe(ADDRESS);
  });

  it('keeps each step\'s fields apart', async () => {
    const seen: Record<string, string> = {};
    new Canary({
      document: dom.window.document,
      build: { network: 'testnet', contract: 'ST0.test' },
      inputs: {
        wallet: [{ name: 'a', label: 'a' }],
        source: [{ name: 'b', label: 'b' }]
      },
      handlers: {
        wallet: async (ctx): Promise<StepResult> => {
          seen.a = ctx.input('a');
          seen.b = ctx.input('b');
          return { ok: true, detail: 'ok' };
        }
      }
    });

    type('a', 'first');
    type('b', 'second');
    clickRun(0);
    await new Promise((done) => setTimeout(done, 20));
    expect(seen).toEqual({ a: 'first', b: 'second' });
  });

  it('reports an empty field as empty, rather than as something stale', async () => {
    let seen: string | null = null;
    new Canary({
      document: dom.window.document,
      build: { network: 'testnet', contract: 'ST0.test' },
      inputs: { wallet: [{ name: 'opponent', label: 'address' }] },
      handlers: {
        wallet: async (ctx): Promise<StepResult> => {
          seen = ctx.input('opponent');
          return { ok: true, detail: 'ok' };
        }
      }
    });
    clickRun(0);
    await new Promise((done) => setTimeout(done, 20));
    expect(seen).toBe('');
  });
});

describe('a run survives a reload', () => {
  it('remembers which steps were verified', async () => {
    const build = { network: 'testnet', contract: 'ST0.test' };
    const handlers = {
      wallet: async (): Promise<StepResult> => ({ ok: true, detail: 'done' })
    };

    const first = new Canary({ document: dom.window.document, build, handlers });
    clickRun(0);
    await new Promise((done) => setTimeout(done, 20));
    expect(first.stepStates.wallet).toBe('ok');

    // A second page against the same contract picks the run back up. Losing
    // this is how a contract gets deployed twice.
    const second = new Canary({ document: dom.window.document, build, handlers });
    expect(second.stepStates.wallet).toBe('ok');
  });

  it('does not resume into a run against a DIFFERENT contract', async () => {
    const handlers = {
      wallet: async (): Promise<StepResult> => ({ ok: true, detail: 'done' })
    };
    new Canary({
      document: dom.window.document,
      build: { network: 'testnet', contract: 'ST0.one' },
      handlers
    });
    clickRun(0);
    await new Promise((done) => setTimeout(done, 20));

    const other = new Canary({
      document: dom.window.document,
      build: { network: 'testnet', contract: 'ST0.two' },
      handlers
    });
    expect(other.stepStates.wallet).toBe('waiting');
  });

  it('does not resume a step that was left mid-flight', async () => {
    // Nobody knows whether a `running` step's transaction landed, so it must
    // come back open rather than claiming to be done.
    const build = { network: 'testnet', contract: 'ST0.mid' };
    dom.window.localStorage.setItem(
      `xchess-gates:testnet:ST0.mid`,
      JSON.stringify({ states: { wallet: 'running' }, details: {}, values: {}, records: {} })
    );
    const canary = new Canary({ document: dom.window.document, build, handlers: {} });
    expect(canary.stepStates.wallet).toBe('waiting');
  });

  it('survives a corrupt stored run rather than refusing to start', async () => {
    dom.window.localStorage.setItem('xchess-gates:testnet:ST0.bad', 'not json');
    expect(
      () =>
        new Canary({
          document: dom.window.document,
          build: { network: 'testnet', contract: 'ST0.bad' },
          handlers: {}
        })
    ).not.toThrow();
  });
});
