import { describe, expect, it } from 'vitest';
import { artistsOf, buildSongs, findSongs } from '../find';

const RAW = [
  { id: 315, title: 'Entertainment', artist: 'melophonic' },
  { id: 319, title: 'Russian Rampage', artist: 'Melophonic' },
  { id: 12, title: 'Inscription #12', artist: '' },
  { id: 501, title: 'Silence', artist: 'old name' },
  { id: 502, title: 'Sound of Silence', artist: 'Audionals' },
  { id: 315, title: 'a duplicate', artist: 'x' },
  { id: 'nope', title: 'bad' }
];
// Xtrata's corrections: song 501's artist is fixed by the backend list, everything else keeps its own metadata.
const name = (id: number, raw: { title?: string; artist?: string }) => ({ title: raw.title ?? '', artist: id === 501 ? 'Audionals' : raw.artist ?? '' });
const songs = buildSongs(RAW, name);

describe('find music', () => {
  it('builds the catalogue with corrected names, in order, without duplicates or junk', () => {
    expect(songs.map((s) => s.id)).toEqual([12, 315, 319, 501, 502]);
    expect(songs.find((s) => s.id === 501)!.artist).toBe('Audionals'); // the override wins
    expect(songs.find((s) => s.id === 12)).toMatchObject({ title: '#12', artist: '' }); // a placeholder title is not a name
    expect(buildSongs(null, name)).toEqual([]);
  });
  it('lists artists by how many songs they have, treating case variants as one', () => {
    expect(artistsOf(songs)).toEqual([{ name: 'Audionals', songs: 2 }, { name: 'melophonic', songs: 2 }]);
  });
  it('searches titles, artists and numbers; every word must match; title matches come first', () => {
    expect(findSongs(songs, 'silence').songs.map((s) => s.id)).toEqual([501, 502]); // starts-with before contains
    expect(findSongs(songs, 'audionals').songs.map((s) => s.id)).toEqual([501, 502]);
    expect(findSongs(songs, 'MELOPHONIC rampage').songs.map((s) => s.id)).toEqual([319]);
    expect(findSongs(songs, '#315').songs.map((s) => s.id)).toEqual([315]);
    expect(findSongs(songs, '31').songs.map((s) => s.id)).toEqual([315, 319]);
    expect(findSongs(songs, 'zzz')).toEqual({ songs: [], total: 0 });
    expect(findSongs(songs, '   ')).toEqual({ songs: [], total: 0 });
  });
  it('filters by artist, alone or with a search, and says how many there were when it cuts the list', () => {
    expect(findSongs(songs, '', 'Melophonic').songs.map((s) => s.id)).toEqual([315, 319]);
    expect(findSongs(songs, 'sound', 'audionals').songs.map((s) => s.id)).toEqual([502]);
    expect(findSongs(songs, '', 'audionals', 1)).toMatchObject({ total: 2, songs: [{ id: 501 }] });
  });
});
