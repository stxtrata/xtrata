import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, it, expect } from 'vitest';

const root = new URL('../../../../', import.meta.url);
const source = (p: string) => readFileSync(new URL(p, root), 'utf8');

function loadBatch() {
  const window: any = {};
  new Function('window', source('xtrata-agent-one/wizard/music-batch.js'))(window);
  return window.XtrataMusicBatch;
}
const B = loadBatch();

// A row as the page holds it after a successful build.
const row = (name: string, info: any = {}, extra: any = {}) => ({
  file: { name },
  status: 'ready',
  overrides: {},
  info: {
    format: 'artwork',
    hasCover: false,
    hasLyrics: false,
    found: { cover: false, lyrics: false, tags: 0 },
    isSuno: false,
    linkedIds: [],
    ...info
  },
  ...extra
});
const withArt = (name: string, source = 'file') =>
  row(name, {
    hasCover: true,
    coverSource: source,
    found: { cover: true, lyrics: false, tags: 4 }
  });

describe('what each song found in its own file', () => {
  it('reports art that came from the file, with tags, lyrics and Suno', () => {
    const r = row('01 Neon.mp3', {
      hasCover: true,
      coverSource: 'file',
      hasLyrics: true,
      isSuno: true,
      found: { cover: true, lyrics: true, tags: 7 }
    });
    expect(B.facts(r)).toMatchObject({
      art: 'file',
      lyrics: true,
      tags: 7,
      suno: true,
      type: 'MP3'
    });
    expect(B.chips(r).map((c: any) => c.text)).toEqual([
      '🖼 art from the file',
      '♪ lyrics',
      '7 tags',
      'Suno',
      'MP3'
    ]);
  });

  it('says so plainly when a song has no artwork', () => {
    const r = row('b.wav');
    expect(B.facts(r).art).toBe('none');
    expect(B.chips(r)[0]).toEqual({ tone: 'warn', text: 'no artwork' });
    expect(B.chips(r).at(-1).text).toBe('WAV');
  });

  it('tells apart art that is used, left out, uploaded and linked', () => {
    expect(B.facts(withArt('a.mp3', 'upload')).art).toBe('upload');
    const linked = row('c.mp3', { hasCover: true, coverSource: 'linked', coverRef: { id: '134' } });
    expect(B.facts(linked)).toMatchObject({ art: 'linked', artId: '134' });
    expect(B.chips(linked)[0].text).toBe('🖼 artwork #134');
    const off = row('d.mp3', {
      format: 'details',
      hasCover: false,
      found: { cover: true, lyrics: false, tags: 1 }
    });
    expect(B.facts(off).art).toBe('off');
    expect(B.chips(off)[0].text).toBe('art in the file is left out');
    expect(B.facts(row('e.mp3', { format: 'audio' })).art).toBe('n/a');
  });

  it('shows a linked audio instead of a file type', () => {
    const r = row('inscription-8.weba', { audioRef: { id: '8' } });
    expect(B.facts(r)).toMatchObject({ audioId: '8', type: '' });
    expect(B.chips(r).at(-1)).toEqual({ tone: 'accent', text: '🔗 audio #8' });
  });

  it('has nothing to say until a song is built', () => {
    expect(B.facts({ file: { name: 'x.mp3' }, status: 'queued' })).toBeNull();
    expect(B.chips({ file: { name: 'x.mp3' }, status: 'queued' })).toEqual([]);
  });
});

describe('batch summary', () => {
  it('counts what is in the batch, ignoring songs that are not built', () => {
    const items = [
      withArt('1.mp3'),
      withArt('2.mp3', 'upload'),
      row('3.wav'),
      row('4.mp3', { format: 'details', found: { cover: true, lyrics: false, tags: 1 } }),
      row('5.mp3', { hasLyrics: true, isSuno: true }),
      { file: { name: '6.mp3' }, status: 'building' }
    ];
    const s = B.summary(items);
    expect(s).toMatchObject({
      total: 6,
      ready: 5,
      withArt: 2,
      withoutArt: 2,
      artLeftOut: 1,
      withLyrics: 1,
      suno: 1
    });
    expect(B.summaryText(s)).toBe(
      '5 songs · 2 with artwork · 2 without · 1 with file art left out · 1 with lyrics · 1 from Suno'
    );
  });

  it('is silent for an empty batch and singular for one song', () => {
    expect(B.summaryText(B.summary([]))).toBe('');
    expect(B.summaryText(B.summary([withArt('a.mp3')]))).toBe(
      '1 song · 1 with artwork · 0 with lyrics'
    );
  });

  it('flags large embedded covers only', () => {
    const big = (extra: any = {}) =>
      row('x.mp3', { coverB64: 'AAAA', artworkInfo: { bytes: 400 * 1024 }, ...extra });
    expect(B.shrinkable(big())).toBe(true);
    expect(B.shrinkable(big({ coverRef: { id: '1' } }))).toBe(false);
    expect(
      B.shrinkable(row('x.mp3', { coverB64: 'AAAA', artworkInfo: { bytes: 90 * 1024 } }))
    ).toBe(false);
    expect(B.shrinkable(row('x.mp3'))).toBe(false);
  });
});

describe('apply to all', () => {
  it('sets artist and album on every song and queues a rebuild', () => {
    const items = [row('a.mp3', { artist: 'Old' }), row('b.mp3')];
    expect(B.applyShared(items, { artist: ' Jim ', album: 'Debut' }, false)).toBe(2);
    expect(items.map((i: any) => [i.overrides.artist, i.overrides.album, i.status])).toEqual([
      ['Jim', 'Debut', 'queued'],
      ['Jim', 'Debut', 'queued']
    ]);
  });

  it('only fills what is empty when asked, and respects earlier edits', () => {
    const items = [
      row('a.mp3', { artist: 'Tagged' }),
      row('b.mp3', { artist: '' }),
      row('c.mp3', { artist: '' }, { overrides: { artist: 'Edited' } })
    ];
    expect(B.applyShared(items, { artist: 'Jim' }, true)).toBe(1);
    expect(items.map((i: any) => i.overrides.artist)).toEqual([undefined, 'Jim', 'Edited']);
    expect(items[0].status).toBe('ready'); // untouched songs are not rebuilt
  });

  it('sets any shared detail, not only artist and album', () => {
    const items = [row('a.mp3', { genre: 'Pop' }), row('b.mp3')];
    expect(
      B.applyShared(
        items,
        { genre: 'Synth', license: 'CC BY 4.0', title: 'Nope', lyrics: 'No' },
        false
      )
    ).toBe(2);
    expect(items[0].overrides).toEqual({ genre: 'Synth', license: 'CC BY 4.0' }); // title and lyrics are never shared
    expect(B.SHARED_KEYS).not.toContain('title');
    expect(B.SHARED_KEYS).not.toContain('lyrics');
    expect(B.SHARED_KEYS).not.toContain('trackNumber');
  });

  it('only fills a shared detail where it is empty, per detail', () => {
    const items = [
      row('a.mp3', { genre: 'Pop', producer: '' }),
      row('b.mp3', { genre: '', producer: 'Me' })
    ];
    expect(B.applyShared(items, { genre: 'Synth', producer: 'Jim' }, true)).toBe(2);
    expect(items[0].overrides).toEqual({ producer: 'Jim' });
    expect(items[1].overrides).toEqual({ genre: 'Synth' });
  });

  it('does nothing when both boxes are empty', () => {
    const items = [row('a.mp3')];
    expect(B.applyShared(items, { artist: '  ', album: '' }, false)).toBe(0);
    expect(items[0].status).toBe('ready');
  });
});

describe('a title or artist typed into one song', () => {
  it('changes only what differs and queues a rebuild', () => {
    const r = row('a.mp3', { title: 'Old', artist: 'Jim' });
    expect(B.applyQuick(r, { title: '  New name ', artist: 'Jim' })).toBe(true);
    expect(r.overrides).toEqual({ title: 'New name' });
    expect(r.status).toBe('queued');
  });

  it('ignores an untouched or identical value', () => {
    const r = row('a.mp3', { title: 'Old', artist: 'Jim' });
    expect(B.applyQuick(r, {})).toBe(false);
    expect(B.applyQuick(r, { title: 'Old' })).toBe(false);
    expect(r.status).toBe('ready');
  });

  it('compares with an earlier edit, and lets a name be cleared', () => {
    const r = row('a.mp3', { title: 'From tag' }, { overrides: { title: 'Edited' } });
    expect(B.applyQuick(r, { title: 'Edited' })).toBe(false);
    expect(B.applyQuick(r, { title: '' })).toBe(true);
    expect(r.overrides.title).toBe('');
  });
});

describe('the same artwork on many songs', () => {
  const withArt = (name: string) =>
    row(name, { hasCover: true, coverSource: 'file', found: { cover: true } });
  const noArt = (name: string) => row(name, { hasCover: false, found: {} });
  const audioOnly = (name: string) => row(name, { format: 'audio' });
  const img = { coverB64: 'AAAA', coverMime: 'image/png' };

  it('sets one image on every song that can show artwork', () => {
    const items = [withArt('a.mp3'), noArt('b.mp3'), audioOnly('c.mp3')];
    expect(B.applyArt(items, img, false)).toEqual({ changed: 2, audioOnly: 1, skipped: 0 });
    expect(items[0].overrides).toMatchObject({
      format: 'artwork',
      coverB64: 'AAAA',
      coverMime: 'image/png'
    });
    expect(items[1].status).toBe('queued');
    expect(items[2].overrides).toEqual({});
  });

  it('only fills songs without artwork when asked, and counts songs not built yet', () => {
    const items = [withArt('a.mp3'), noArt('b.mp3'), row('c.mp3', {}, { status: 'building' })];
    expect(B.applyArt(items, img, true)).toEqual({ changed: 1, audioOnly: 0, skipped: 1 });
    expect(items[0].overrides).toEqual({});
    expect(items[1].overrides?.coverB64).toBe('AAAA');
  });

  it('treats art left out of a song as empty', () => {
    const left = row('a.mp3', { hasCover: false, found: { cover: true } });
    expect(B.applyArt([left], img, true).changed).toBe(1);
  });

  it('links an inscription instead and drops any embedded image', () => {
    const ref = { id: '134', mimeType: 'image/jpeg', finalHash: 'abc' };
    const r = noArt('a.mp3');
    r.overrides = { coverB64: 'OLD', coverMime: 'image/png', title: 'Keep' };
    expect(B.applyArt([r], { coverInscription: ref }, false).changed).toBe(1);
    expect(r.overrides).toEqual({ format: 'artwork', coverInscription: ref, title: 'Keep' });
  });

  it('does nothing without an image', () => {
    const r = noArt('a.mp3');
    expect(B.applyArt([r], {}, false).changed).toBe(0);
    expect(B.applyArt([r], undefined as never, false).changed).toBe(0);
    expect(r.status).toBe('ready');
  });
});

describe('artwork on or off for the whole batch', () => {
  it('leaves art out of songs that have it, and brings file art back', () => {
    const items = [withArt('a.mp3'), row('b.wav'), withArt('c.mp3', 'linked')];
    expect(B.setArt(items, 'off')).toBe(2);
    expect(items.map((i: any) => i.overrides.format)).toEqual(['details', undefined, 'details']);
    expect(items[1].status).toBe('ready');

    // Rebuilt as the page would: art found in the file but not used.
    items[0].info = { ...items[0].info, format: 'details', hasCover: false };
    items[0].status = 'ready';
    expect(B.setArt(items, 'on')).toBe(1);
    expect(items[0].overrides.format).toBe('artwork');
  });
});

describe('track numbers', () => {
  const named = (...names: string[]) =>
    names.map((n) => ({ file: { name: n }, overrides: {}, status: 'ready' }));

  it('follows the file names when every song starts with its own number', () => {
    const items = named('02 - Second.mp3', '01 - First.mp3', '10_Tenth.wav');
    expect(B.numberTracks(items)).toBe('filename');
    expect(items.map((i: any) => i.overrides.trackNumber)).toEqual(['2', '1', '10']);
  });

  it('falls back to the list order when names do not carry numbers, or repeat them', () => {
    for (const names of [
      ['Intro.mp3', 'Outro.mp3'],
      ['01 A.mp3', 'B.mp3'],
      ['01 A.mp3', '01 B.mp3'],
      ['2024 mix.mp3', 'x.mp3']
    ]) {
      const items = named(...names);
      expect(B.numberTracks(items)).toBe('order');
      expect(items.map((i: any) => i.overrides.trackNumber)).toEqual(['1', '2']);
    }
  });

  it('uses the dropped file name, not the name of a file swapped in for a link', () => {
    const items = [
      {
        file: { name: 'inscription-8.weba' },
        origFile: { name: '02 Second.mp3' },
        overrides: {},
        status: 'ready'
      },
      {
        file: { name: 'x.mp3' },
        origFile: { name: '01 First.mp3' },
        overrides: {},
        status: 'ready'
      }
    ];
    expect(B.numberTracks(items)).toBe('filename');
    expect(items.map((i: any) => i.overrides.trackNumber)).toEqual(['2', '1']);
    expect(B.leadingNumber('03 Real.mp3')).toBe(3);
  });

  it('numbers a single song from its name when it has one', () => {
    const items = [{ file: { name: '03 Real.mp3' }, overrides: {}, status: 'ready' }];
    B.numberTracks(items);
    expect(items[0].overrides.trackNumber).toBe('3');
  });
});

describe('dependencies per song', () => {
  it('combines the batch-wide list with the song’s own links, once each', () => {
    expect(B.itemDeps(['134', '90'], { linkedIds: ['8', '134'] })).toEqual(['134', '90', '8']);
    expect(B.itemDeps([], { linkedIds: [] })).toEqual([]);
    expect(B.itemDeps(['5'], null)).toEqual(['5']);
  });
});

describe('permission gate for linked sources', () => {
  const linkedRow = (ids: string[], status = 'ready') =>
    row('x.mp3', { linkedIds: ids }, { status });

  it('blocks until a source not held by the wallet is confirmed', () => {
    const refs: any = { 8: { ownerState: 'other', confirmed: false } };
    expect(B.linkedBlocking([linkedRow(['8'])], refs)).toBe('Confirm you may link inscription #8');
    refs[8].confirmed = true;
    expect(B.linkedBlocking([linkedRow(['8'])], refs)).toBe('');
  });

  it('does not ask about sources the connected wallet holds', () => {
    expect(
      B.linkedBlocking([linkedRow(['8'])], { 8: { ownerState: 'yours', confirmed: false } })
    ).toBe('');
  });

  it('treats an unchecked owner as unconfirmed, and a missing check as blocking', () => {
    expect(
      B.linkedBlocking([linkedRow(['8'])], { 8: { ownerState: 'unchecked', confirmed: false } })
    ).toMatch(/#8/);
    expect(B.linkedBlocking([linkedRow(['9'])], {})).toBe('Confirm you may link inscription #9');
  });

  it('reports the first unconfirmed link across songs and ignores songs that are not ready', () => {
    const refs: any = { 8: { ownerState: 'yours' }, 9: { ownerState: 'other', confirmed: false } };
    expect(B.linkedBlocking([linkedRow(['8']), linkedRow(['8', '9'])], refs)).toBe(
      'Confirm you may link inscription #9'
    );
    expect(B.linkedBlocking([linkedRow(['9'], 'error')], refs)).toBe('');
    expect(B.linkedBlocking([row('plain.mp3')], {})).toBe('');
  });
});

describe('reordering', () => {
  it('moves a song up or down and refuses to leave the list', () => {
    const list = ['a', 'b', 'c'];
    expect(B.move(list, 1, -1)).toBe(true);
    expect(list).toEqual(['b', 'a', 'c']);
    expect(B.move(list, 0, -1)).toBe(false);
    expect(B.move(list, 2, 1)).toBe(false);
    expect(B.move(list, 0, 1)).toBe(true);
    expect(list).toEqual(['a', 'b', 'c']);
  });
});

// ---- the build: what a file carried, and not re-encoding for every small edit ----
function setupBuild(meta: Record<string, string> = {}, cover: string | null = 'T1JJR0lOQUw=') {
  const calls: string[] = [];
  const window: any = {
    XtrataAudioProcessing: {
      extract: async (_f: File, _s: any, quality: string) => {
        calls.push(quality);
        return {
          audioB64: 'RU1CRURERUQ=',
          audioBytes: new Uint8Array([1, 2, 3]),
          meta: { title: 'Tagged', artist: 'Someone', ...meta },
          coverB64: cover,
          coverMime: cover ? 'image/png' : null,
          opusBytes: null
        };
      },
      slug: () => 'track'
    }
  };
  vm.runInNewContext(source('xtrata-agent-one/wizard/music-player.js'), { window });
  new Function('window', source('xtrata-agent-one/wizard/music-sources.js'))(window);
  vm.runInNewContext(source('xtrata-agent-one/wizard/music-build.js'), {
    window,
    File,
    document: { querySelector: () => null }
  });
  return { window, calls };
}
const song = (name = 'a.mp3') => new File(['bytes'], name, { type: 'audio/mpeg' });

describe('build reports what the file carried', () => {
  it('uses the art in the file for the artwork style and says where it came from', async () => {
    const { window } = setupBuild();
    const r = await window.XtrataMusic.build(song(), () => {}, {
      format: 'artwork',
      quality: 'original'
    });
    expect(r).toMatchObject({ hasCover: true, coverSource: 'file', format: 'artwork' });
    expect(r.found).toEqual({ cover: true, lyrics: false, tags: 2 });
  });

  it('keeps knowing the song has art when the release leaves it out', async () => {
    const { window } = setupBuild();
    const r = await window.XtrataMusic.build(song(), () => {}, {
      format: 'details',
      quality: 'original'
    });
    expect(r).toMatchObject({ hasCover: false, coverSource: 'none' });
    expect(r.found.cover).toBe(true);
  });

  it('marks uploaded art as the user’s own, and a song with no art as having none', async () => {
    const { window } = setupBuild();
    const up = await window.XtrataMusic.build(song(), () => {}, {
      format: 'artwork',
      quality: 'original',
      coverB64: 'VVBMT0FE',
      coverMime: 'image/png'
    });
    expect(up.coverSource).toBe('upload');
    const bare = setupBuild({}, null);
    const none = await bare.window.XtrataMusic.build(song(), () => {}, {
      format: 'artwork',
      quality: 'original'
    });
    expect(none).toMatchObject({ hasCover: false, coverSource: 'none' });
    expect(none.found.cover).toBe(false);
  });

  it('notices lyrics and Suno, and ignores encoder noise when counting tags', async () => {
    const { window } = setupBuild({
      lyrics: 'La la',
      comment: 'made with suno studio',
      'aoe-generator': 'x',
      encoder: 'Lavf',
      major_brand: 'isom',
      genre: ''
    });
    const r = await window.XtrataMusic.build(song(), () => {}, {
      format: 'details',
      quality: 'original'
    });
    expect(r).toMatchObject({ isSuno: true, hasLyrics: true });
    expect(r.found).toMatchObject({ lyrics: true, tags: 4 }); // title, artist, lyrics, comment
  });

  it('does not call a song Suno because the word appears elsewhere', async () => {
    const { window } = setupBuild({ album: 'Suno-like beats' });
    const r = await window.XtrataMusic.build(song(), () => {}, {
      format: 'details',
      quality: 'original'
    });
    expect(r.isSuno).toBe(false);
  });
});

describe('re-using the audio engine’s result', () => {
  it('does not re-encode for an edit that leaves the audio alone', async () => {
    const { window, calls } = setupBuild();
    const f = song();
    await window.XtrataMusic.build(f, () => {}, { format: 'artwork', quality: 'optimised' });
    const edited = await window.XtrataMusic.build(f, () => {}, {
      format: 'artwork',
      quality: 'optimised',
      title: 'Renamed',
      artist: 'New Artist'
    });
    expect(calls).toEqual(['optimised']);
    expect(edited.title).toBe('Renamed');
    expect(edited.artist).toBe('New Artist');
  });

  it('re-encodes when the quality changes, and for a different file', async () => {
    const { window, calls } = setupBuild();
    const f = song();
    await window.XtrataMusic.build(f, () => {}, { format: 'details', quality: 'optimised' });
    await window.XtrataMusic.build(f, () => {}, { format: 'details', quality: 'compact' });
    await window.XtrataMusic.build(song('b.mp3'), () => {}, {
      format: 'details',
      quality: 'optimised'
    });
    expect(calls).toEqual(['optimised', 'compact', 'optimised']);
  });

  it('lets go of a file on request', async () => {
    const { window, calls } = setupBuild();
    const f = song();
    await window.XtrataMusic.build(f, () => {}, { format: 'details', quality: 'optimised' });
    window.XtrataMusic.forget(f);
    await window.XtrataMusic.build(f, () => {}, { format: 'details', quality: 'optimised' });
    expect(calls).toEqual(['optimised', 'optimised']);
  });

  it('serves a changed cover from the same engine result', async () => {
    const { window, calls } = setupBuild();
    const f = song();
    await window.XtrataMusic.build(f, () => {}, { format: 'artwork', quality: 'original' });
    const swapped = await window.XtrataMusic.build(f, () => {}, {
      format: 'artwork',
      quality: 'original',
      coverB64: 'TkVXQ09WRVI=',
      coverMime: 'image/jpeg'
    });
    expect(calls).toEqual(['original']);
    expect(swapped.html).toContain('data:image/jpeg;base64,TkVXQ09WRVI=');
    expect(swapped.html).not.toContain('T1JJR0lOQUw=');
  });
});

describe('several inscription numbers at once', () => {
  const S = (() => {
    const window: any = {};
    new Function('window', source('xtrata-agent-one/wizard/music-sources.js'))(window);
    return window.XtrataMusicSources;
  })();

  it('accepts commas, spaces, hashes and repeats', () => {
    expect(S.parseIdList('8, 9 #12 8;15')).toEqual({
      ids: ['8', '9', '12', '15'],
      bad: [],
      overflow: 0
    });
  });

  it('reports what it cannot read instead of guessing', () => {
    expect(S.parseIdList('8, abc, 0, 12x, 9')).toEqual({
      ids: ['8', '9'],
      bad: ['abc', '0', '12x'],
      overflow: 0
    });
    expect(S.parseIdList('')).toEqual({ ids: [], bad: [], overflow: 0 });
    expect(S.parseIdList(null)).toEqual({ ids: [], bad: [], overflow: 0 });
  });

  it('caps the list and says how many were left out', () => {
    const r = S.parseIdList('1 2 3 4 5', 3);
    expect(r.ids).toEqual(['1', '2', '3']);
    expect(r.overflow).toBe(2);
  });
});
