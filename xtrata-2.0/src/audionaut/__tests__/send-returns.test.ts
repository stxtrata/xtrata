import path from 'node:path';
import { describe, expect, it } from 'vitest';

// The Blocktime (delay) and Liquidity (reverb) sends share project-wide return settings that live
// in project.returns (public/audionaut/daw/js/plugins.js). Defaults must equal the values the
// buses always had, so projects saved before this change sound the same.
const DAW = path.resolve(__dirname, '../../../public/audionaut/daw/js');
const lib = async (file: string) => (await import(/* @vite-ignore */ path.join(DAW, file))) as any;

describe('send returns', () => {
  it('defaults reproduce the original fixed delay and reverb', async () => {
    const { returnDefaults } = await lib('plugins.js');
    const d = returnDefaults();
    expect(d.delay).toMatchObject({ time: '1/8.', feedback: 0.35, tone: 4000, spread: 0, ret: 1 });
    expect(d.reverb).toMatchObject({ decay: 2.2, shape: 3, predelay: 0, damp: 20000, width: 1, ret: 1 });
  });

  it('cleans anything loaded from a file back into range', async () => {
    const { cleanReturns, RETURN_SCHEMA, returnDefaults } = await lib('plugins.js');
    const r = cleanReturns({ delay: { time: 'banana', feedback: 9, tone: 'x' }, reverb: { decay: -4, width: 2 } });
    expect(r.delay.time).toBe('1/8.');
    expect(r.delay.feedback).toBe(0.92);
    expect(r.delay.tone).toBe(4000);
    expect(r.reverb.decay).toBe(0.3);
    expect(r.reverb.width).toBe(1);
    expect(Object.keys(r.delay)).toEqual(RETURN_SCHEMA.delay.map((p: { key: string }) => p.key));
    expect(cleanReturns(undefined)).toEqual(returnDefaults());
  });

  it('names the two sends and ties each to its return', async () => {
    const { PLUGIN_TYPES, typeParams, sharedKeys } = await lib('plugins.js');
    expect(PLUGIN_TYPES.delaySend).toMatchObject({ name: 'Blocktime', role: 'Delay send', shared: 'delay' });
    expect(PLUGIN_TYPES.reverbSend).toMatchObject({ name: 'Liquidity', role: 'Reverb send', shared: 'reverb' });
    // the slot itself still only stores its own Send amount
    expect(PLUGIN_TYPES.delaySend.params.map((p: { key: string }) => p.key)).toEqual(['amount']);
    expect(sharedKeys(PLUGIN_TYPES.delaySend).has('feedback')).toBe(true);
    expect(typeParams(PLUGIN_TYPES.reverbSend).length).toBe(7);
  });

  it('creates returns on first use so older projects need no migration', async () => {
    const { returnsOf, returnDefaults } = await lib('plugins.js');
    const project: Record<string, unknown> = {};
    expect(returnsOf(project)).toEqual(returnDefaults());
    expect(project.returns).toBeTruthy();
  });
});
