import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// The starter song library behind the dropdown next to the Starter button
// (public/audionaut/daw/data/starters/, built by tools/make-starters.mjs).
// Structural checks only; levels are set by measurement when the library is built, and playback is
// checked by loading a song in a browser.
const DAW = path.resolve(__dirname, '../../../public/audionaut/daw');
const DATA = path.join(DAW, 'data');
const index = JSON.parse(fs.readFileSync(path.join(DATA, 'starters/index.json'), 'utf8')) as {
  songs: { id: string; name: string; genre: string; blurb: string; bpm: number; file: string }[];
};
const lib = async (file: string) => (await import(/* @vite-ignore */ path.join(DAW, 'js', file))) as any;
const load = (file: string) => JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));

describe('starter song library', () => {
  it('lists around twenty songs with unique ids, led by the welcome session', () => {
    expect(index.songs.length).toBeGreaterThanOrEqual(15);
    expect(new Set(index.songs.map((s) => s.id)).size).toBe(index.songs.length);
    expect(index.songs[0].id).toBe('welcome');
    expect(new Set(index.songs.map((s) => s.genre)).size).toBeGreaterThanOrEqual(15);
  });

  it('points every entry at a real native project that carries its own name', () => {
    for (const entry of index.songs) {
      expect(fs.existsSync(path.join(DATA, entry.file)), entry.id).toBe(true);
      const project = load(entry.file);
      expect(project.format, entry.id).toMatch(/^audionaut-workstation\//);
      expect(project.continuous, entry.id).toBe(true);
      expect(project.sequences.length, entry.id).toBeGreaterThanOrEqual(2);
      if (entry.id !== 'welcome') expect(project.projectName, entry.id).toBe(entry.name);
      expect(Math.round(project.bpm), entry.id).toBe(entry.bpm);
    }
  });

  it('uses only CC0 sounds from the installed packs, so nothing needs attribution', async () => {
    const { packSoundRow } = await lib('pack-library.js');
    for (const entry of index.songs) {
      const project = load(entry.file);
      for (const channel of project.channels) {
        expect(channel.source.type, entry.id).toBe('pack');
        const row = packSoundRow(channel.source.value);
        expect(row.pack.attribution, entry.id).toBeFalsy();
        expect(row.pack.tier, entry.id).not.toBe('unverified');
      }
    }
  });

  it('has in-range notes, four playing synths in the full sequence, and headroom', () => {
    for (const entry of index.songs) {
      const project = load(entry.file);
      for (const seq of project.sequences)
        for (const list of seq.notes)
          for (const n of list) {
            expect(n.step, entry.id).toBeGreaterThanOrEqual(0);
            expect(n.step + n.dur, entry.id).toBeLessThanOrEqual(64);
            expect(n.pitch, entry.id).toBeGreaterThanOrEqual(0);
            expect(n.pitch, entry.id).toBeLessThan(128);
          }
      const full = project.sequences[1];
      expect(full.notes.every((list: unknown[]) => list.length > 0), entry.id).toBe(true);
      expect(project.masterVolume, entry.id).toBeLessThanOrEqual(0.8);
      for (const c of project.channels) expect(c.mute, entry.id).toBe(false);
      for (const i of project.instruments) expect(i.mute, entry.id).toBe(false);
    }
  });
});
