import { describe, expect, it } from 'vitest';
import { hasBannedWord, markPreviewed, newPreview, PLAIN_LABEL, PLAIN_NUDGE, PLAIN_STOP, plainLines, PREVIEW_MAX_MS, previewedAlbums, previewLive, readNovice, stepPreview, NOVICE_KEY } from '../novice';

const store = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { get: (k: string) => m.get(k) ?? null, set: (k: string, v: string | null) => { if (v === null) m.delete(k); else m.set(k, v); }, m };
};

describe('novice flag', () => {
  it('is off unless asked for, and remembers the choice on the device', () => {
    const s = store();
    expect(readNovice('', s)).toEqual({ on: false, preview: false });
    expect(readNovice('?novice=1', s)).toEqual({ on: true, preview: false });
    expect(readNovice('', s)).toEqual({ on: true, preview: false });
    expect(readNovice('?novice=preview', s)).toEqual({ on: true, preview: true });
    expect(readNovice('?x=1', s)).toEqual({ on: true, preview: true });
    expect(readNovice('?novice=0', s)).toEqual({ on: false, preview: false });
    expect(s.m.has(NOVICE_KEY)).toBe(false);
  });
  it('reads anything else as off', () => {
    expect(readNovice('?novice=yes', store())).toEqual({ on: false, preview: false });
    expect(readNovice('', store({ [NOVICE_KEY]: 'true' }))).toEqual({ on: false, preview: false });
    expect(readNovice('', { get: () => { throw new Error('blocked'); }, set: () => {} })).toEqual({ on: false, preview: false });
  });
});

describe('plain wording', () => {
  it('none of the words novice mode puts on the main path is a crypto word', () => {
    const all = [...Object.values(PLAIN_LABEL), ...Object.values(PLAIN_STOP), PLAIN_NUDGE,
      ...plainLines('fund', { played: false, arriving: false }), ...plainLines('fund', { played: true, arriving: false }), ...plainLines('over', { played: true, arriving: false })];
    expect(all.length).toBeGreaterThan(15);
    for (const t of all) expect(hasBannedWord(t), t).toBe(false);
  });
  it('catches the words it is meant to', () => {
    for (const t of ['Add 1 STX', 'your listening wallet', 'Copy my address', 'seed phrase', 'Sign and make player', 'two signatures', 'Wallets']) expect(hasBannedWord(t), t).toBe(true);
    for (const t of ['277 plays left', 'Make your player', 'A design for life', 'addressed']) expect(hasBannedWord(t), t).toBe(false);
  });
  it('says nothing extra while plays are on their way', () => {
    expect(plainLines('fund', { played: false, arriving: true })).toEqual([]);
    expect(plainLines('ready', { played: true, arriving: false })).toEqual([]);
  });
});

describe('the free first song', () => {
  const offered = () => stepPreview(newPreview(), { kind: 'offer', album: 'a1', already: false });
  it('opens once for an album this device has not previewed', () => {
    expect(offered().phase).toBe('open');
    expect(previewLive(offered())).toBe(true);
    expect(stepPreview(newPreview(), { kind: 'offer', album: 'a1', already: true }).phase).toBe('done');
  });
  it('ends when the radio moves to a second song', () => {
    let p = stepPreview(offered(), { kind: 'now', track: '11', playing: true, at: 1000 });
    expect(p).toMatchObject({ phase: 'playing', track: '11' });
    p = stepPreview(p, { kind: 'now', track: '11', playing: false, at: 2000 }); // paused: still the same song
    expect(p.phase).toBe('playing');
    p = stepPreview(p, { kind: 'listened', at: 31_000 }); // 30 seconds of the first song is the preview working
    expect(p.phase).toBe('playing');
    p = stepPreview(p, { kind: 'now', track: '12', playing: true, at: 200_000 });
    expect(p.phase).toBe('done');
    expect(previewLive(p)).toBe(false);
  });
  it('ends at a second counted listen, and at the time limit, even if the radio never changes song', () => {
    let p = stepPreview(offered(), { kind: 'now', track: '11', playing: true, at: 0 });
    p = stepPreview(stepPreview(p, { kind: 'listened', at: 30_000 }), { kind: 'listened', at: 90_000 });
    expect(p.phase).toBe('done');
    let q = stepPreview(offered(), { kind: 'now', track: '11', playing: true, at: 0 });
    expect(stepPreview(q, { kind: 'tick', at: PREVIEW_MAX_MS }).phase).toBe('playing');
    q = stepPreview(q, { kind: 'tick', at: PREVIEW_MAX_MS + 1 });
    expect(q.phase).toBe('done');
  });
  it('a re-offer of the same album never reopens a finished or running preview', () => {
    const playing = stepPreview(offered(), { kind: 'now', track: '11', playing: true, at: 0 });
    expect(stepPreview(playing, { kind: 'offer', album: 'a1', already: false })).toBe(playing);
    // Once it has started the page records it as previewed; the running song is not cut off by that.
    expect(stepPreview(playing, { kind: 'offer', album: 'a1', already: true })).toBe(playing);
    const done = stepPreview(playing, { kind: 'now', track: '12', playing: true, at: 1 });
    expect(stepPreview(done, { kind: 'offer', album: 'a1', already: false }).phase).toBe('done');
    expect(stepPreview(done, { kind: 'offer', album: 'b2', already: false }).phase).toBe('open'); // another album is its own preview
  });
  it('remembers previewed albums on the device', () => {
    const s = store();
    markPreviewed(s, 'a1'); markPreviewed(s, 'a2'); markPreviewed(s, 'a1');
    expect(previewedAlbums(s)).toEqual(['a2', 'a1']);
    expect(previewedAlbums(store({ 'xtrata.radio.novice.previewed.v1': '{bad' }))).toEqual([]);
  });
});
