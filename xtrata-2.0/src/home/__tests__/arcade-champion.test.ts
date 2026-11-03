// @vitest-environment happy-dom
import {afterEach, describe, expect, it, vi} from 'vitest';
import {formatScore, initArcadeChampion, parseChampion, stopArcadeChampion} from '../arcade-champion.js';

const mount = () => {
  document.body.innerHTML = `<a id="heroChampion" hidden><span data-champ="name"></span><span data-champ="score"></span><span data-champ="go"></span></a>`;
};
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('arcade champion hero', () => {
  afterEach(() => { stopArcadeChampion(); vi.unstubAllGlobals(); document.body.innerHTML = ''; });

  it('accepts only well-formed champions', () => {
    expect(parseChampion({version: 1, name: 'JIMBO', score: 1200})).toEqual({empty: false, name: 'JIMBO', score: 1200});
    expect(parseChampion({version: 1, empty: true})).toEqual({empty: true});
    expect(parseChampion({version: 1, name: '<img onerror=x>', score: 5})).toBeNull();
    expect(parseChampion({version: 1, name: 'OK', score: 0})).toBeNull();
    expect(parseChampion({version: 2, name: 'OK', score: 5})).toBeNull();
  });

  it('formats scores with separators', () => { expect(formatScore(1234567)).toBe('1,234,567'); });

  it('shows the champion once the read succeeds', async () => {
    mount();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({version: 1, name: 'JIMBO', score: 123456}))));
    initArcadeChampion();
    await flush(); await flush();
    const node = document.getElementById('heroChampion')!;
    expect(node.hidden).toBe(false);
    expect(node.querySelector('[data-champ="name"]')!.textContent).toBe('JIMBO');
    expect(node.querySelector('[data-champ="score"]')!.textContent).toBe('123,456 points');
  });

  it('stays hidden when the read fails', async () => {
    mount();
    vi.stubGlobal('fetch', vi.fn(async () => new Response('x', {status: 503})));
    initArcadeChampion();
    await flush(); await flush();
    expect(document.getElementById('heroChampion')!.hidden).toBe(true);
  });
});
