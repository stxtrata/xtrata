import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
// Paths relative to src/lib/music/__tests__ -> src, then repository.
const root = new URL('../../../../', import.meta.url);
const source = (p: string) => readFileSync(new URL(p, root), 'utf8');
function setup() {
  const window: any = {
    XtrataAudioProcessing: {
      extract: async (f: File, _s: any, q: string) => ({
        audioB64: 'YWJj',
        audioBytes: new Uint8Array([1, 2, 3]),
        meta: { title: 'Embedded', artist: '', lyrics: 'Imported lyrics' },
        coverB64: 'YXJ0',
        coverMime: 'image/png',
        opusBytes: q === 'optimised' ? 3 : null
      }),
      slug: () => 'track'
    }
  };
  vm.runInNewContext(source('xtrata-agent-one/wizard/music-player.js'), { window });
  vm.runInNewContext(source('xtrata-agent-one/wizard/music-build.js'), {
    window,
    File,
    document: { querySelector: () => null }
  });
  return window;
}
describe('music output contract', () => {
  it('preserves original bytes and MIME in audio-only mode', async () => {
    const w = setup(),
      f = new File(['exact recording bytes'], 'song.wav');
    const r = await w.XtrataMusic.build(f, () => {}, { format: 'audio', quality: 'original' });
    expect(await r.playerFile.text()).toBe(await f.text());
    expect(r.playerFile.type).toBe('audio/wav');
    expect(r.html).toBe(null);
    expect(r.hasCover).toBe(false);
  });
  it('uses encoded bytes only when optimisation is selected', async () => {
    const r = await setup().XtrataMusic.build(new File(['source'], 'song.wav'), () => {}, {
      format: 'audio',
      quality: 'optimised'
    });
    expect([...new Uint8Array(await r.playerFile.arrayBuffer())]).toEqual([1, 2, 3]);
    expect(r.playerFile.type).toContain('audio/webm');
  });
  it('accepts missing credits/art and excludes art in details mode', async () => {
    const r = await setup().XtrataMusic.build(new File(['x'], 'song.mp3'), () => {}, {
      format: 'details',
      quality: 'original',
      artist: '',
      lyrics: ''
    });
    expect(r.artist).toBe('');
    expect(r.hasCover).toBe(false);
    expect(r.hasLyrics).toBe(false);
    expect(r.playerFile.type).toBe('text/html');
  });
  it('preserves rich credits with safe versioned metadata and explicit art removal', async () => {
    const r = await setup().XtrataMusic.build(new File(['x'], 'song.mp3'), () => {}, {
      format: 'artwork',
      quality: 'original',
      songwriters: '</script><script>alert(1)</script>',
      coverB64: null
    });
    expect(r.html).toContain('schemaVersion');
    expect(r.html).toContain('\\u003c/script');
    expect(r.hasCover).toBe(false);
  });
  it('rejects empty files and invalid output modes', async () => {
    await expect(setup().XtrataMusic.build(new File([], 'song.wav'), () => {}, {})).rejects.toThrow(
      'empty'
    );
    await expect(
      setup().XtrataMusic.build(new File(['x'], 'song.wav'), () => {}, { format: 'bad' })
    ).rejects.toThrow('valid release');
  });
  it('ships an independent neutral route and shared encoder dependency', () => {
    const html = source('music/index.html');
    expect(html).not.toMatch(/suno/i);
    expect(html).toContain("origin:'music'");
    expect(html).toContain('mime:PLAYER.type');
    expect(html).toContain('mime:it.player.type');
    expect(source('xtrata-agent-one/wizard/suno.html')).toContain('audio-processing.js');
    expect(source('xtrata-agent-one/wizard/index.html')).toContain('audio-processing.js');
  });
});
