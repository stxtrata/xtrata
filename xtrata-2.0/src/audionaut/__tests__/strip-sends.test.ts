import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Delay and reverb sends are values on the strip (owner.sends), tapped after the last plugin.
// Older files hold them as send slots at the end of the FX list; normalizeOwner folds those in.
// Anything that cannot be folded without moving the tap point stays a slot.
const DAW = path.resolve(__dirname, '../../../public/audionaut/daw/js');
const lib = async (file: string) => (await import(/* @vite-ignore */ path.join(DAW, file))) as any;
const slot = (id: string, type: string, amount: number, enabled = true) => ({ id, type, enabled, params: { amount } });
const drive = (id = 'drv') => ({ id, type: 'drive', enabled: true, params: { amount: 0.4 } });

describe('strip sends', () => {
  it('folds trailing send slots into the strip, keeping amount and bypass', async () => {
    const { normalizeOwner } = await lib('plugins.js');
    const o: any = { inserts: [], fx: [drive(), slot('b', 'delaySend', 0.5), slot('c', 'reverbSend', 0.3, false)] };
    expect(normalizeOwner(o)).toBe(true);
    expect(o.fx.map((s: any) => s.type)).toEqual(['drive']);
    expect(o.sends).toEqual({ delay: { amount: 0.5, enabled: true }, reverb: { amount: 0.3, enabled: false } });
    expect(normalizeOwner(o)).toBe(false); // settled: running it again changes nothing
  });

  it('keeps a send that sits before another plugin as a slot', async () => {
    const { normalizeOwner } = await lib('plugins.js');
    const o: any = { inserts: [], fx: [slot('b', 'delaySend', 0.5), drive()] };
    normalizeOwner(o);
    expect(o.fx.map((s: any) => s.type)).toEqual(['delaySend', 'drive']);
    expect(o.sends).toEqual({});
  });

  it('folds sends that end the inserts list when the FX list is empty', async () => {
    const { normalizeOwner } = await lib('plugins.js');
    const o: any = { inserts: [drive(), slot('b', 'reverbSend', 0.6)], fx: [] };
    normalizeOwner(o);
    expect(o.inserts.map((s: any) => s.type)).toEqual(['drive']);
    expect(o.sends.reverb.amount).toBe(0.6);
  });

  it('keeps a second send for the same bus as a slot', async () => {
    const { normalizeOwner } = await lib('plugins.js');
    const o: any = { inserts: [], fx: [slot('x', 'delaySend', 0.5), slot('y', 'delaySend', 0.2)] };
    normalizeOwner(o);
    expect(o.sends.delay.amount).toBe(0.5);
    expect(o.fx.map((s: any) => s.id)).toEqual(['y']);
  });

  it('turns the original fixed FX object into plugins plus strip sends', async () => {
    const { normalizeOwner } = await lib('plugins.js');
    const o: any = { inserts: [], fx: { filter: 'lp', cutoff: 2000, drive: 0.2, delay: 0.35, reverb: 0.2 } };
    normalizeOwner(o);
    expect(o.fx.map((s: any) => s.type)).toEqual(['filter', 'drive']);
    expect(o.sends).toEqual({ delay: { amount: 0.35, enabled: true }, reverb: { amount: 0.2, enabled: true } });
  });

  it('reads the new shape as it is and cleans it into range', async () => {
    const { normalizeOwner, cleanSends } = await lib('plugins.js');
    const o: any = { inserts: [], fx: [], sends: { delay: { amount: 7, enabled: false }, reverb: { amount: 'x' }, bogus: { amount: 1 } } };
    normalizeOwner(o);
    expect(o.sends).toEqual({ delay: { amount: 1, enabled: false }, reverb: { amount: 0.25, enabled: true } });
    expect(cleanSends(null)).toEqual({});
    expect(cleanSends({ delay: 'no' })).toEqual({});
  });

  it('does not touch a strip that has no sends', async () => {
    const { normalizeOwner } = await lib('plugins.js');
    const o: any = { inserts: [], fx: [drive()], sends: {} };
    normalizeOwner(o); // fills the drive plugin's missing params once
    const settled = JSON.stringify(o);
    expect(normalizeOwner(o)).toBe(false);
    expect(JSON.stringify(o)).toBe(settled);
    expect(o.sends).toEqual({});
  });

  it('shows sends as slot-like rows that write straight to the strip', async () => {
    const { sendRows, addSend } = await lib('plugins.js');
    const o: any = { sends: { reverb: { amount: 0.3, enabled: true } } };
    expect(addSend(o, 'delay', 0.4)).toBe(true);
    expect(addSend(o, 'delay', 0.9)).toBe(false); // one per bus
    expect(addSend(o, 'nope')).toBe(false);
    const rows = sendRows(o);
    expect(rows.map((r: any) => [r.id, r.type])).toEqual([['send:delay', 'delaySend'], ['send:reverb', 'reverbSend']]);
    rows[0].enabled = false;
    rows[0].params = { amount: 0.8 };
    expect(o.sends.delay).toEqual({ amount: 0.8, enabled: false });
    rows[1].params = { amount: 5 };
    expect(o.sends.reverb.amount).toBe(1);
    expect(sendRows({})).toEqual([]);
  });

  it('every shipped starter loads with its sends on the strip and no send slots left', async () => {
    const { normalizeOwner } = await lib('plugins.js');
    const fs = await import('node:fs');
    const dir = path.resolve(DAW, '../data/starters');
    let withSends = 0;
    for (const f of fs.readdirSync(dir).filter((n: string) => n.endsWith('.json') && n !== 'index.json')) {
      const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      for (const o of [...p.channels, ...p.instruments]) {
        normalizeOwner(o);
        expect([...o.inserts, ...o.fx].some((s: any) => /Send$/.test(s.type)), f).toBe(false);
        if (Object.keys(o.sends).length) withSends++;
      }
    }
    expect(withSends).toBeGreaterThan(40);
  });
});
