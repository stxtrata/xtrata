import { describe, expect, it } from 'vitest';
import { STAGES, stageOf } from '../stages';

const base = { payingOn: true, session: { playsLeft: 10 } as any, entries: [] as any[], gate: null };
const at = (step: string, extra: object = {}) => stageOf({ ...base, step: step as any, ...extra });

describe('pay-per-play stages', () => {
  it('numbers every gate in order, from the radio address to the first paid play', () => {
    expect(STAGES).toEqual(['Radio address', 'Connect wallet', 'Access', 'Passkey wallet', 'Link', 'Add funds', 'Switch on', 'First paid play']);
    const order = ['elsewhere', 'connect', 'not-invited', 'intro', 'link', 'fund'].map((s) => at(s)!.at);
    expect(order).toEqual([0, 1, 2, 3, 4, 5]);
    expect(at('ready', { payingOn: false })!.at).toBe(6);
    expect(at('ready')!).toMatchObject({ at: 7, blocked: false, caption: 'Stage 8 of 8 · listen to a song for 30 seconds' });
  });

  it('marks gates that block rather than wait', () => {
    expect(at('not-invited')).toMatchObject({ at: 2, blocked: true });
    expect(at('unsupported')).toMatchObject({ at: 3, blocked: true });
    expect(at('over')).toMatchObject({ at: 5, blocked: true });
    expect(at('locked')).toMatchObject({ at: 3, blocked: false, caption: 'Stage 4 of 8 · unlock your passkey listening wallet' });
  });

  it('needs paying switched on with session plays left before the paid-play stage', () => {
    expect(at('ready', { session: null })!.at).toBe(6);
    expect(at('ready', { session: { playsLeft: 0 } })!.at).toBe(6);
  });

  it('completes only once a paid play has confirmed on-chain', () => {
    expect(at('ready', { entries: [{ kind: 'withdraw', status: 'confirmed' }] })!.at).toBe(7);
    expect(at('ready', { entries: [{ kind: 'play', status: 'pending' }] })!.caption).toBe('Stage 8 of 8 · first paid play sent, confirming on-chain');
    expect(at('ready', { entries: [{ kind: 'play', status: 'failed' }] })!.caption).toBe('Stage 8 of 8 · listen to a song for 30 seconds');
    expect(at('ready', { entries: [{ kind: 'play', status: 'confirmed' }] })).toEqual({ at: STAGES.length, blocked: false, caption: 'All stages done · paid plays are taking place' });
  });

  it('has nothing new to show while hidden or loading', () => {
    expect(at('off')).toBeNull();
    expect(at('loading')).toBeNull();
  });
});
