// The gating cannot be walked around.
//
// This page drives irreversible acts: deploying a contract that cannot be
// edited, and inscribing bytes that cannot be withdrawn. The gating is the only
// thing standing between an operator and doing them in the wrong order, so it
// is tested like the contract rather than like a UI.

import { describe, expect, it } from 'vitest';
import {
  PHASE_TITLES,
  STEPS,
  blockedBy,
  initialStates,
  invalidateFrom,
  isAvailable,
  progress
} from '../../packages/ui/gates.js';
import type { StepStates } from '../../packages/ui/gates.js';
import { shortPrincipal } from '../../packages/ui/app.js';

const byId = (id: string) => STEPS.find((s) => s.id === id)!;

/** Walk the steps in order, marking each ok, up to and including `id`. */
function upTo(id: string): StepStates {
  const states = initialStates();
  for (const step of STEPS) {
    states[step.id] = 'ok';
    if (step.id === id) break;
  }
  return states;
}

describe('the steps themselves', () => {
  it('have unique ids', () => {
    expect(new Set(STEPS.map((s) => s.id)).size).toBe(STEPS.length);
  });

  it('only ever depend on a step that comes before them', () => {
    // A cycle, or a forward reference, would make some step permanently
    // unreachable, and the page would simply stop with no explanation.
    const seen = new Set<string>();
    for (const step of STEPS) {
      for (const need of step.needs) {
        expect(seen.has(need), `${step.id} needs ${need}, which does not come before it`).toBe(true);
      }
      seen.add(step.id);
    }
  });

  it('name a known phase, and every phase has a title', () => {
    for (const step of STEPS) {
      expect(PHASE_TITLES[step.phase], step.id).toBeTruthy();
    }
  });

  it('say what they prove, at length', () => {
    // A step nobody understands is a step that gets clicked through.
    for (const step of STEPS) {
      expect(step.why.length, `${step.id} does not explain itself`).toBeGreaterThan(60);
    }
  });

  it('starts with something that costs nothing', () => {
    expect(STEPS[0].irreversible).toBe(false);
    expect(STEPS[0].needs).toEqual([]);
  });

  it('ends with verifying the permanent inscription', () => {
    expect(STEPS.at(-1)!.id).toBe('launch-verified');
    expect(STEPS.at(-1)!.irreversible).toBe(false);
  });

  it('marks every act that spends or cannot be undone', () => {
    for (const id of [
      'deploy',
      'configure',
      'standard',
      'submit',
      'sponsored',
      'rebate',
      'inscribe-canary',
      'prod-contract',
      'prod-inscribe'
    ]) {
      expect(byId(id).irreversible, `${id} is not marked irreversible`).toBe(true);
    }
  });

  it('never marks a read as irreversible', () => {
    for (const id of ['wallet', 'account', 'name-free', 'source', 'deployed', 'configured', 'bootstrapped']) {
      expect(byId(id).irreversible, `${id} is marked irreversible but only reads`).toBe(false);
    }
  });
});

describe('nothing runs early', () => {
  it('offers only the first steps at the start', () => {
    const states = initialStates();
    const open = STEPS.filter((s) => isAvailable(s, states)).map((s) => s.id);
    // Exactly the two that need nothing.
    expect(open).toEqual(['wallet', 'source']);
  });

  it('will not deploy before the name has been checked', () => {
    const states = initialStates();
    states.wallet = 'ok';
    states.account = 'ok';
    states.source = 'ok';
    expect(isAvailable(byId('deploy'), states)).toBe(false);
    expect(blockedBy(byId('deploy'), states)).toContain('Check the contract name is free');
  });

  it('will not deploy before the source has been read and hashed', () => {
    const states = initialStates();
    states.wallet = 'ok';
    states.account = 'ok';
    states['name-free'] = 'ok';
    expect(isAvailable(byId('deploy'), states)).toBe(false);
  });

  it('will not touch the contract until the deploy has been READ BACK', () => {
    // The distinction the whole page exists for. A confirmed transaction is not
    // a contract that says what you meant.
    const states = upTo('deploy');
    expect(states.deploy).toBe('ok');
    expect(states.deployed).toBe('waiting');
    expect(isAvailable(byId('configure'), states)).toBe(false);
  });

  it('will not inscribe production before the canary inscription has been exercised', () => {
    // Invalidated properly rather than by hand: setting one step back to
    // waiting without cascading would be a state the app can never be in, and
    // a test that arranges an impossible state proves nothing about the real
    // one.
    const states = invalidateFrom('canary-live', upTo('prod-verified'));
    expect(states['canary-live']).toBe('waiting');
    expect(isAvailable(byId('prod-inscribe'), states)).toBe(false);
    expect(isAvailable(byId('prod-contract'), states)).toBe(false);
    expect(blockedBy(byId('prod-contract'), states)).toContain(
      'Run the whole matrix against the INSCRIPTION'
    );
  });

  it('will not reach production at all without the wallet matrix', () => {
    const states = upTo('build');
    expect(isAvailable(byId('inscribe-canary'), states)).toBe(false);
    expect(blockedBy(byId('inscribe-canary'), states)).toContain(
      'Sign off the wallet matrix against this build'
    );
  });

  it('refuses to re-run a completed irreversible step', () => {
    // Re-running a finished deploy is how a second contract gets created by
    // accident.
    const states = upTo('deploy');
    expect(isAvailable(byId('deploy'), states)).toBe(false);
  });

  it('refuses to run a step that is already running', () => {
    const states = upTo('name-free');
    states.source = 'ok';
    states.deploy = 'running';
    expect(isAvailable(byId('deploy'), states)).toBe(false);
  });

  it('does not unlock anything when a step FAILS', () => {
    const states = upTo('name-free');
    states.source = 'ok';
    states.deploy = 'failed';
    expect(isAvailable(byId('deployed'), states)).toBe(false);
  });
});

describe('redoing a step', () => {
  it('invalidates everything downstream of it', () => {
    // Without this, re-deploying and skipping the verify would leave every later
    // step marked ok against a contract that no longer exists. The states would
    // describe a run that never happened.
    const states = upTo('launch-verified');
    expect(progress(states).complete).toBe(true);

    const after = invalidateFrom('deploy', states);
    expect(after.deploy).toBe('waiting');
    expect(after.deployed).toBe('waiting');
    expect(after.configure).toBe('waiting');
    expect(after.rebate).toBe('waiting');
    expect(after['prod-inscribe']).toBe('waiting');
    expect(progress(after).complete).toBe(false);
  });

  it('leaves what came before it alone', () => {
    const states = upTo('launch-verified');
    const after = invalidateFrom('configure', states);
    expect(after.wallet).toBe('ok');
    expect(after.account).toBe('ok');
    expect(after.deploy).toBe('ok');
    expect(after.deployed).toBe('ok');
    expect(after.configure).toBe('waiting');
  });

  it('follows the dependency graph transitively, not just one level', () => {
    const states = upTo('launch-verified');
    // `settle` depends on `topup`, which depends on `rebate`.
    const after = invalidateFrom('rebate', states);
    expect(after.topup).toBe('waiting');
    expect(after.settle).toBe('waiting');
    expect(after.build).toBe('waiting');
  });

  it('invalidates the whole run from the very first step', () => {
    const states = upTo('launch-verified');
    const after = invalidateFrom('wallet', states);
    // Everything except the one step that depends on nothing else.
    expect(after.source).toBe('ok');
    for (const step of STEPS) {
      if (step.id === 'source') continue;
      expect(after[step.id], step.id).toBe('waiting');
    }
  });
});

describe('progress', () => {
  it('counts, and names the next runnable step', () => {
    const states = initialStates();
    const start = progress(states);
    expect(start.done).toBe(0);
    expect(start.total).toBe(STEPS.length);
    expect(start.next?.id).toBe('wallet');
    expect(start.complete).toBe(false);
  });

  it('is complete only when every single step is ok', () => {
    const states = upTo('launch-verified');
    expect(progress(states).complete).toBe(true);
    states.topup = 'waiting';
    expect(progress(states).complete).toBe(false);
  });

  it('reports failures without hiding them in the count', () => {
    const states = upTo('deploy');
    states.deployed = 'failed';
    const p = progress(states);
    expect(p.failed).toBe(1);
    expect(p.complete).toBe(false);
  });

  it('has a runnable next step at every point along a clean run', () => {
    // If this ever stops being true, some step is unreachable and the page
    // would simply stop with no explanation.
    let states = initialStates();
    const order: string[] = [];
    for (let i = 0; i < STEPS.length; i++) {
      const next = progress(states).next;
      expect(next, `stuck after ${order.length} steps: ${order.join(', ')}`).not.toBeNull();
      states = { ...states, [next!.id]: 'ok' };
      order.push(next!.id);
    }
    expect(order).toHaveLength(STEPS.length);
    expect(progress(states).complete).toBe(true);
  });
});

describe('abbreviating a principal', () => {
  it('keeps the head and the tail, which is what anybody checks', () => {
    expect(shortPrincipal('SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W')).toBe('SP1C...KXFF6W');
    expect(shortPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X')).toBe('SP3J...ZX743X');
  });

  it('tells two similar addresses apart', () => {
    // An abbreviation that collided would be worse than none: it would look
    // like verification while proving nothing.
    const a = shortPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X');
    const b = shortPrincipal('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743Y');
    expect(a).not.toBe(b);
  });

  it('leaves a short address whole rather than mangling it', () => {
    // Stacks addresses are not a fixed width; roughly a quarter are not 41
    // characters, because the encoding drops leading zero bytes.
    expect(shortPrincipal('SP000000000000000000002Q6VF78')).toBe('SP00...Q6VF78');
    expect(shortPrincipal('SPSHORT')).toBe('SPSHORT');
    expect(shortPrincipal('')).toBe('');
  });

  it('never returns something longer than what it was given', () => {
    for (const value of ['', 'SP', 'SPSHORT', 'S'.repeat(14), 'S'.repeat(41)]) {
      expect(shortPrincipal(value).length).toBeLessThanOrEqual(Math.max(value.length, 13));
    }
  });
});
