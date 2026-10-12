import { describe, expect, it } from 'vitest';
import { showSteps, STAGES, stageOf } from '../stages';

const base = { payingOn: true, session: { playsLeft: 10 } as any, entries: [] as any[], gate: null };
const at = (step: string, extra: object = {}) => stageOf({ ...base, step: step as any, ...extra });

describe('pay-per-play steps', () => {
  it('groups every gate into four plain steps', () => {
    expect(STAGES).toEqual(['Connect', 'Passkey', 'Link & fund', 'Listen']);
    const order = ['elsewhere', 'connect', 'not-invited', 'intro', 'locked', 'link', 'fund'].map((s) => at(s)!.at);
    expect(order).toEqual([0, 0, 0, 1, 1, 2, 2]);
    expect(at('ready', { payingOn: false })!.at).toBe(3);
    expect(at('ready')!).toMatchObject({ at: 3, blocked: false, caption: 'Step 4 of 4 · listen to a song for 30 seconds' });
  });

  it('marks steps that block rather than wait', () => {
    expect(at('not-invited')).toMatchObject({ at: 0, blocked: true });
    expect(at('unsupported')).toMatchObject({ at: 1, blocked: true });
    expect(at('over')).toMatchObject({ at: 2, blocked: true });
    expect(at('locked')).toMatchObject({ at: 1, blocked: false, caption: 'Step 2 of 4 · unlock your passkey listening wallet' });
  });

  it('completes only once a paid play has confirmed on-chain', () => {
    expect(at('ready', { entries: [{ kind: 'like', status: 'confirmed' }] })!.at).toBe(3);
    expect(at('ready', { entries: [{ kind: 'play', status: 'pending' }] })!.caption).toBe('Step 4 of 4 · first paid play sent, confirming');
    expect(at('ready', { entries: [{ kind: 'play', status: 'confirmed' }] })).toEqual({ at: STAGES.length, blocked: false, caption: 'Paid plays are taking place' });
  });

  it('shows the steps only during first-time setup', () => {
    const intro = at('intro');
    expect(showSteps({ step: 'intro', entries: [], linked: undefined }, intro)).toBe(true);
    expect(showSteps({ step: 'fund', entries: [], linked: 'SP1' }, at('fund'))).toBe(true); // linked, not yet paid: still setting up
    expect(showSteps({ step: 'locked', entries: [], linked: 'SP1' }, at('locked'))).toBe(false); // returning: just unlock
    expect(showSteps({ step: 'fund', entries: [{ kind: 'play' }] as any, linked: 'SP1' }, at('fund'))).toBe(false); // out of funds: just top up
    expect(showSteps({ step: 'ready', entries: [{ kind: 'play' }] as any, linked: 'SP1' }, at('ready', { entries: [{ kind: 'play', status: 'confirmed' }] }))).toBe(false);
    expect(showSteps({ step: 'intro', entries: [], linked: undefined }, null)).toBe(false);
  });

  it('has nothing new to show while hidden or loading', () => {
    expect(at('off')).toBeNull();
    expect(at('loading')).toBeNull();
  });
});
