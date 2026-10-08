import path from 'node:path';
import { describe, expect, it } from 'vitest';

// The Analog Kit drum-beat collection: every existing groove re-voiced on the Analog Kit
// recordings plus the new Analog grooves. These are structural checks on the generated beat
// presets (the levels are verified by `node audionaut-library/tools/render-analog-beats.mjs`).
const JS = path.resolve(__dirname, '../../../public/audionaut/daw/js');
const load = async (file: string) => (await import(/* @vite-ignore */ path.join(JS, file))) as any;
const { ANALOG_PACK_ID } = await import(/* @vite-ignore */ path.join(JS, 'analog-pack.js'));
const KITS = ['auto', 'jazz', 'rusty', 'unruly', 'swirly', 'concert', 'modern'];

describe('Analog Kit beats', () => {
  it('has one beat per groove with unique ids, and every genre is listed', async () => {
    const { analogBeats, ANALOG_RECIPES, ANALOG_GENRE_ORDER } = await load('analog-kits.js');
    const { DRUM_RECIPES } = await load('drum-catalogue.js');
    const { ANALOG_GROOVES, ANALOG_GENRES_NEW } = await load('analog-grooves.js');
    const beats = analogBeats('auto');
    expect(beats.length).toBe(DRUM_RECIPES.length + ANALOG_GROOVES.length);
    expect(ANALOG_RECIPES.length).toBe(beats.length);
    expect(new Set(beats.map((b: any) => b.id)).size).toBe(beats.length);
    expect(ANALOG_GENRES_NEW.length).toBe(10);
    const genres = new Set(beats.map((b: any) => b.genre));
    for (const genre of genres) expect(ANALOG_GENRE_ORDER).toContain(genre);
    expect(genres.size).toBe(ANALOG_GENRE_ORDER.length);
  });

  it.each(KITS)('builds valid presets on the %s kit', async (kit) => {
    const { analogBeats } = await load('analog-kits.js');
    const { CAL } = await load('analog-calibration.js');
    for (const beat of analogBeats(kit)) {
      expect(beat.collection).toBe('analog');
      expect(beat.drumBeat).toBe(true);
      expect(beat.bars).toBe(4);
      expect(beat.bpm).toBeGreaterThanOrEqual(20);
      expect(beat.bpm).toBeLessThanOrEqual(420);
      expect(beat.channels.length).toBeGreaterThanOrEqual(1);
      expect(beat.channels.length).toBeLessThanOrEqual(16);
      for (const ch of beat.channels) {
        expect(ch.pattern).toMatch(/^[.xX]{64}$/);
        expect(ch.pattern).toMatch(/[xX]/); // no silent channels
        expect(ch.volume).toBeGreaterThan(0);
        expect(ch.volume).toBeLessThanOrEqual(1);
        expect(ch.trimSeconds[1]).toBeGreaterThan(ch.trimSeconds[0]);
        expect(ch.source.type).toBe('pack');
        // every source is a calibrated pack sound and carries its measured PCM hash
        expect(CAL[ch.source.value], `${beat.id}: ${ch.source.value}`).toBeTruthy();
        expect(ch.source.audioSha256).toBe(CAL[ch.source.value][5]);
      }
    }
  });

  it('uses every Analog Kit recording in at least one beat, on the Auto kit', async () => {
    const { analogBeats } = await load('analog-kits.js');
    const { CAL } = await load('analog-calibration.js');
    const used = new Set(analogBeats('auto').flatMap((b: any) => b.channels.map((c: any) => c.source.value)));
    const kit = Object.keys(CAL).filter((k) => k.startsWith(`${ANALOG_PACK_ID}/`));
    expect(kit.length).toBe(213);
    expect(kit.filter((k) => !used.has(k))).toEqual([]);
  });

  it('gives every genre several beats and never repeats a sound set within a genre', async () => {
    const { analogBeats } = await load('analog-kits.js');
    const beats = analogBeats('auto');
    const byGenre = new Map<string, any[]>();
    for (const b of beats) byGenre.set(b.genre, [...(byGenre.get(b.genre) ?? []), b]);
    for (const [genre, list] of byGenre) {
      expect(list.length, genre).toBeGreaterThanOrEqual(3);
      const sets = list.map((b) => b.channels.map((c: any) => c.source.value).sort().join(','));
      expect(new Set(sets).size, genre).toBe(list.length);
    }
  });

  it('describes triplet-swing grooves on a double grid at half the felt tempo', async () => {
    const { analogBeats } = await load('analog-kits.js');
    const swung = analogBeats('auto').filter((b: any) => b.feltBpm);
    expect(swung.length).toBeGreaterThanOrEqual(15);
    for (const b of swung) {
      expect(b.feltBpm, b.id).toBe(b.bpm * 2);
      expect(b.swing, b.id).toBeGreaterThanOrEqual(26);
      expect(b.swing, b.id).toBeLessThanOrEqual(40);
      expect(b.name, b.id).toMatch(/♩=/);
    }
  });

  it('takes the 808 bass of the bass beats from the Electronic Kit sub kicks', async () => {
    const { analogBeats } = await load('analog-kits.js');
    const bass = analogBeats('auto').filter((b: any) => b.withBass);
    expect(bass.length).toBe(3);
    for (const b of bass) {
      const ba = b.channels.filter((c: any) => c.role === 'BA');
      expect(ba.length).toBeGreaterThan(0);
      for (const c of ba) expect(c.source.value).toMatch(/^electronic\/electronic-sub-kicks-/);
      for (const c of b.channels.filter((c: any) => c.role !== 'BA')) expect(c.source.value).toMatch(new RegExp(`^${ANALOG_PACK_ID}/`));
    }
  });

  it('keeps the per-kit headroom table consistent with the beats', async () => {
    const { analogBeats } = await load('analog-kits.js');
    const { HEADROOM } = await load('analog-headroom.js');
    expect(Object.keys(HEADROOM).sort()).toEqual([...KITS].sort());
    for (const kit of KITS) {
      const ids = new Set(analogBeats(kit, { raw: true }).map((b: any) => b.recipeId));
      for (const [id, trim] of Object.entries<number>(HEADROOM[kit])) {
        expect(ids.has(id), `${kit}: ${id}`).toBe(true);
        expect(trim).toBeGreaterThan(0.2);
        expect(trim).toBeLessThan(1);
      }
    }
  });

  it('applies the headroom trims only to the final presets', async () => {
    const { analogBeats } = await load('analog-kits.js');
    const { HEADROOM } = await load('analog-headroom.js');
    const raw = new Map(analogBeats('auto', { raw: true }).map((b: any) => [b.recipeId, b]));
    for (const b of analogBeats('auto')) {
      const trim = HEADROOM.auto[b.recipeId] ?? 1;
      const r = raw.get(b.recipeId);
      b.channels.forEach((c: any, i: number) => {
        expect(c.volume).toBeCloseTo(Math.max(0.01, r.channels[i].volume * trim), 2);
      });
    }
  });
});
