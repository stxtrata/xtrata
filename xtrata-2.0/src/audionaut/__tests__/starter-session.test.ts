import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// The session The Audionaut opens on first visit (public/audionaut/daw/data/starter-session.json).
// Structural checks only; levels and playback are checked by loading it in a browser.
const DAW = path.resolve(__dirname, '../../../public/audionaut/daw');
const starter = JSON.parse(fs.readFileSync(path.join(DAW, 'data/starter-session.json'), 'utf8'));
const lib = async (file: string) => (await import(/* @vite-ignore */ path.join(DAW, 'js', file))) as any;

describe('starter session', () => {
  it('is a native project with chained sequences', () => {
    expect(starter.format).toBe('audionaut-workstation/2');
    expect(starter.continuous).toBe(true);
    expect(starter.sequences.length).toBeGreaterThanOrEqual(2);
    for (const seq of starter.sequences) {
      expect(seq.steps.length).toBe(starter.channels.length);
      for (const row of seq.steps) expect(row.length).toBe(64);
    }
  });

  it('uses only CC0 sounds from the installed packs, so nothing needs attribution', async () => {
    const { packSoundRow } = await lib('pack-library.js');
    expect(starter.channels.length).toBeGreaterThan(0);
    for (const channel of starter.channels) {
      expect(channel.source.type).toBe('pack');
      const row = packSoundRow(channel.source.value);
      expect(row.pack.attribution).toBeFalsy();
      expect(row.pack.tier).not.toBe('unverified');
    }
  });

  it('has notes for every synth in range, and no lane is silent in the first sequence', () => {
    for (const seq of starter.sequences)
      for (const list of seq.notes)
        for (const n of list) {
          expect(n.step).toBeGreaterThanOrEqual(0);
          expect(n.step + n.dur).toBeLessThanOrEqual(64);
          expect(n.pitch).toBeGreaterThanOrEqual(0);
          expect(n.pitch).toBeLessThan(128);
        }
    const first = starter.sequences[0];
    expect(first.steps.every((row: number[]) => row.some((v) => v))).toBe(true);
    expect(first.notes.every((list: unknown[]) => list.length > 0)).toBe(true);
  });

  it('leaves headroom and is not muted', () => {
    expect(starter.masterVolume).toBeLessThanOrEqual(0.8);
    for (const c of starter.channels) expect(c.mute).toBe(false);
    for (const i of starter.instruments) expect(i.mute).toBe(false);
  });
});
