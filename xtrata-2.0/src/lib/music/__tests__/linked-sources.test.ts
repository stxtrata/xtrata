import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, it, expect } from 'vitest';
import { linkedAudioId, linkedImageId } from '../../radio/song-sources.mjs';

const root = new URL('../../../../', import.meta.url);
const source = (p: string) => readFileSync(new URL(p, root), 'utf8');

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);
const linkedAudio = { id: '8', mimeType: 'audio/webm; codecs=opus', finalHash: HASH_A };
const linkedImage = { id: '134', mimeType: 'image/jpeg', finalHash: HASH_B };

function loadPlayer() {
  const window: any = {};
  vm.runInNewContext(source('xtrata-agent-one/wizard/music-player.js'), { window });
  return window.XtrataMusicPlayer;
}
const config = (extra: any = {}) => ({
  audioMimeType: 'audio/webm; codecs=opus',
  audioBase64: '',
  metadata: { title: 'Linked song', artist: 'Someone' },
  ...extra
});
const manifestOf = (html: string) =>
  JSON.parse(
    /<script type="application\/json" id="xtrataPlayerManifest">([\s\S]*?)<\/script>/.exec(html)![1]
  );

describe('player linked to existing inscriptions', () => {
  const player = loadPlayer();

  it('emits the exact link shape the radio already follows', () => {
    const html = player.build(
      config({ audioInscription: linkedAudio, imageInscription: linkedImage })
    );
    expect(html).toContain(
      '<source src="https://xtrata.xyz/inscription/8" type="audio/webm; codecs=opus">'
    );
    expect(html).toContain('<img id="coverArt" src="https://xtrata.xyz/inscription/134"');
    // The radio's own detectors resolve both links.
    expect(linkedAudioId(html)).toBe(8);
    expect(linkedImageId(html)).toBe(134);
    // And its embedded-asset matchers (src/home/radio.js) correctly find nothing to extract inline.
    expect(/<source[^>]+src="(data:audio\/[^"]+)"/i.exec(html)).toBeNull();
    expect(/<img[^>]+src="(data:image\/[^"]+)"/i.exec(html)).toBeNull();
  });

  it('records what was linked in the manifest', () => {
    const html = player.build(
      config({ audioInscription: linkedAudio, imageInscription: linkedImage })
    );
    const m = manifestOf(html);
    expect(m.mode).toBe('reference');
    expect(m.sourceKind).toBe('xtrata-inscription');
    expect(m.dependencies).toEqual(['8', '134']);
    expect(m.assets.audio).toMatchObject({
      sourceKind: 'xtrata-inscription',
      inscriptionId: '8',
      url: 'https://xtrata.xyz/inscription/8',
      finalHash: HASH_A
    });
    expect(m.assets.visual).toMatchObject({
      inscriptionId: '134',
      mimeType: 'image/jpeg',
      finalHash: HASH_B
    });
    expect(html).toContain('data-xtrata-dependencies="8,134"');
    expect(html).toContain('plays from inscription #');
  });

  it('can link only the audio, or only the artwork', () => {
    const audioOnly = player.build(config({ audioInscription: linkedAudio }));
    expect(manifestOf(audioOnly).dependencies).toEqual(['8']);
    expect(linkedImageId(audioOnly)).toBeNull();

    const artOnly = player.build({
      audioMimeType: 'audio/wav',
      audioBase64: 'YWJj',
      imageInscription: linkedImage,
      metadata: { title: 'Mixed' }
    });
    const m = manifestOf(artOnly);
    expect(m.mode).toBe('reference');
    expect(m.sourceKind).toBe('embedded-base64');
    expect(m.dependencies).toEqual(['134']);
    expect(artOnly).toContain('data:audio/wav;base64,YWJj');
    expect(linkedAudioId(artOnly)).toBeNull();
    expect(linkedImageId(artOnly)).toBe(134);
  });

  it('keeps embedded players exactly as they were', () => {
    const html = player.build({
      audioMimeType: 'audio/wav',
      audioBase64: 'YWJj',
      imageBase64: 'YXJ0',
      imageMimeType: 'image/png',
      metadata: { title: 'Plain' }
    });
    const m = manifestOf(html);
    expect(m.mode).toBe('embedded');
    expect(m.dependencies).toEqual([]);
    expect(html).toContain('data:audio/wav;base64,YWJj');
    expect(html).toContain('data:image/png;base64,YXJ0');
    expect(html).not.toContain('data-xtrata-dependencies');
    expect(linkedAudioId(html)).toBeNull();
  });

  it('fails closed on malformed links instead of building a silent player', () => {
    for (const id of ['', '0', '8x', '8"><script>', '../8', '1234567890', 8.5]) {
      expect(
        () => player.build(config({ audioInscription: { ...linkedAudio, id } })),
        String(id)
      ).toThrow('Invalid linked audio');
      expect(
        () => player.build(config({ imageInscription: { ...linkedImage, id } })),
        String(id)
      ).toThrow('Invalid linked artwork');
    }
    expect(() =>
      player.build(config({ audioInscription: linkedAudio, audioMimeType: 'text/html' }))
    ).toThrow('Invalid linked audio type');
    expect(() =>
      player.build(config({ audioInscription: linkedAudio, audioMimeType: 'audio/webm"><script>' }))
    ).toThrow('Invalid linked audio type');
    for (const mimeType of ['image/svg+xml', 'text/html', 'image/png"><script>', '']) {
      expect(
        () => player.build(config({ imageInscription: { ...linkedImage, mimeType } })),
        mimeType
      ).toThrow('Invalid linked artwork type');
    }
  });

  it('never trusts a pinned hash that is not a sha256', () => {
    const html = player.build(
      config({ audioInscription: { ...linkedAudio, finalHash: '"><script>alert(1)</script>' } })
    );
    expect(manifestOf(html).assets.audio.finalHash).toBe('');
    expect(html).not.toContain('<script>alert(1)');
  });
});

// The build step, with the audio engine stubbed as in music.test.ts.
function setupBuild() {
  const seen: string[] = [];
  const window: any = {
    XtrataAudioProcessing: {
      extract: async (_f: File, _s: any, quality: string) => {
        seen.push(quality);
        return {
          audioB64: 'RU1CRURERUQ=',
          audioBytes: new Uint8Array([1, 2, 3]),
          meta: { title: 'Tagged title', artist: 'Tagged artist' },
          coverB64: 'VEFHQ09WRVI=',
          coverMime: 'image/png',
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
  return { window, seen };
}
const song = () => new File(['fetched bytes'], 'inscription-8.weba', { type: 'audio/webm' });

describe('build with linked sources', () => {
  it('links the audio, reads tags at original quality, and never embeds the audio', async () => {
    const { window, seen } = setupBuild();
    const r = await window.XtrataMusic.build(song(), () => {}, {
      format: 'details',
      quality: 'compact',
      audioInscription: linkedAudio
    });
    expect(seen).toEqual(['original']); // no transcode, whatever the quality menu says
    expect(r.audioRef.id).toBe('8');
    expect(r.linkedIds).toEqual(['8']);
    expect(r.audioLabel).toBe('Linked to inscription #8');
    expect(r.title).toBe('Tagged title');
    expect(r.html).toContain('https://xtrata.xyz/inscription/8');
    expect(r.html).not.toContain('RU1CRURERUQ='); // the fetched copy's bytes are not in the player
    expect(linkedAudioId(r.html)).toBe(8);
    expect(r.playerFile.type).toBe('text/html');
    expect(r.playerFile.size).toBeLessThan(40000); // a player, not a recording
  });

  it('refuses audio-only output for a linked inscription', async () => {
    const { window } = setupBuild();
    await expect(
      window.XtrataMusic.build(song(), () => {}, {
        format: 'audio',
        quality: 'original',
        audioInscription: linkedAudio
      })
    ).rejects.toThrow(/needs a player/);
  });

  it('links artwork instead of embedding the extracted or uploaded cover', async () => {
    const { window } = setupBuild();
    const r = await window.XtrataMusic.build(new File(['x'], 'song.mp3'), () => {}, {
      format: 'artwork',
      quality: 'original',
      coverInscription: linkedImage,
      coverB64: 'VVBMT0FERUQ=',
      coverMime: 'image/png'
    });
    expect(r.hasCover).toBe(true);
    expect(r.coverRef.id).toBe('134');
    expect(r.coverUrl).toBe('https://xtrata.xyz/inscription/134');
    expect(r.linkedIds).toEqual(['134']);
    expect(linkedImageId(r.html)).toBe(134);
    expect(r.html).not.toContain('VEFHQ09WRVI='); // cover tag in the file
    expect(r.html).not.toContain('VVBMT0FERUQ='); // an upload that was replaced
  });

  it('ignores a linked cover when the format has no artwork', async () => {
    const { window } = setupBuild();
    const r = await window.XtrataMusic.build(new File(['x'], 'song.mp3'), () => {}, {
      format: 'details',
      quality: 'original',
      coverInscription: linkedImage
    });
    expect(r.hasCover).toBe(false);
    expect(r.linkedIds).toEqual([]);
    expect(linkedImageId(r.html)).toBeNull();
  });

  it('links both and lists each once as a dependency', async () => {
    const { window } = setupBuild();
    const r = await window.XtrataMusic.build(song(), () => {}, {
      format: 'artwork',
      quality: 'original',
      audioInscription: linkedAudio,
      coverInscription: { ...linkedImage, id: '8', mimeType: 'image/png' }
    });
    expect(r.linkedIds).toEqual(['8']);
  });

  it('leaves ordinary uploads untouched', async () => {
    const { window, seen } = setupBuild();
    const r = await window.XtrataMusic.build(new File(['x'], 'song.mp3'), () => {}, {
      format: 'details',
      quality: 'optimised'
    });
    expect(seen).toEqual(['optimised']);
    expect(r.linkedIds).toEqual([]);
    expect(r.audioRef).toBeNull();
    expect(r.html).toContain('data:audio/webm; codecs=opus;base64,RU1CRURERUQ=');
  });
});
