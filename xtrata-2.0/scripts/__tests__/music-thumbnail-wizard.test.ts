// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

const load = () => {
  const code = readFileSync('xtrata-agent-one/wizard/music-thumbnail.js', 'utf8');
  // eslint-disable-next-line no-new-func
  new Function(code)();
  return (window as unknown as { XtrataThumb: { readPlayer: (h: string) => any; postSongThumbnail: (...a: any[]) => Promise<boolean> } }).XtrataThumb;
};

const meta = JSON.stringify({ schema: 'xtrata-music', assetType: 'song', title: 'T', artist: 'A' });

describe('wizard song thumbnail helper', () => {
  it('reads title, artist and cover source from a song player', () => {
    const T = load();
    const r = T.readPlayer(
      `<script id="xtrata-music-metadata" type="application/json">${meta}</script><img id="coverArt" src="data:image/png;base64,AAAA">`
    );
    expect(r).toEqual({ title: 'T', artist: 'A', src: 'data:image/png;base64,AAAA' });
  });

  it('reads the opus template manifest and a lone cover image', () => {
    const T = load();
    const manifest = JSON.stringify({ metadata: { assetType: 'song', title: 'O', artist: 'B' } });
    const r = T.readPlayer(
      `<script id="xtrataPlayerManifest" type="application/json">${manifest}</script><div class="cover-media"><img src="https://xtrata.xyz/inscription/3075"></div>`
    );
    expect(r).toEqual({ title: 'O', artist: 'B', src: 'https://xtrata.xyz/inscription/3075' });
  });

  it('ignores files that are not songs', () => {
    const T = load();
    const other = JSON.stringify({ metadata: { assetType: 'game' } });
    expect(T.readPlayer(`<script id="xtrataPlayerManifest" type="application/json">${other}</script>`)).toBeNull();
  });

  it('never throws and never posts for an unknown cover source', async () => {
    const T = load();
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const html = `<script id="xtrata-music-metadata" type="application/json">${meta}</script><img id="coverArt" src="https://evil.example/x.png">`;
    expect(await T.postSongThumbnail('xtrata-v3-2-3', 9, html)).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
