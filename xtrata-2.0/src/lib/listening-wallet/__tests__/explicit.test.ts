import { describe, expect, it } from 'vitest';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { playerHash, validatePlayer } from '../gift-players';

const def = { title: 'Proof of Sound', subtitle: 'The Artist', tracks: [785, 2186, 2187], cover: 785 as number | null };

describe('explicit marks on an album', () => {
  it('an album with none hashes exactly as it did before the mark existed', () => {
    const before = bytesToHex(sha256(new TextEncoder().encode(JSON.stringify({ title: def.title, subtitle: def.subtitle, tracks: def.tracks, cover: def.cover }))));
    expect(playerHash(def)).toBe(before);
    expect(playerHash({ ...def, explicit: [] })).toBe(before);
    expect(validatePlayer(def)).toEqual(def); // no `explicit` key is added
  });
  it('a marked song is part of what the creator signs, whatever order it was typed in', () => {
    expect(playerHash({ ...def, explicit: [2186] })).not.toBe(playerHash(def));
    expect(playerHash({ ...def, explicit: [2187, 2186, 2186] })).toBe(playerHash({ ...def, explicit: [2186, 2187] }));
    expect(validatePlayer({ ...def, explicit: [2187, 2186, 2186] }).explicit).toEqual([2186, 2187]);
  });
  it('only the album’s own songs can be marked', () => {
    expect(() => validatePlayer({ ...def, explicit: [999] })).toThrow(/one of the album/);
    expect(() => validatePlayer({ ...def, explicit: 'x' as never })).toThrow(/list of song numbers/);
  });
});
