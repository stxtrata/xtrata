// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { coverArt, onArt } from '../art';
import { createAlbumView, ALBUM_STEPS, type AlbumInput } from '../album';
import { createWelcomeView } from '../welcome';

const player = { id: 'p1', title: 'Night Drive', subtitle: 'The Band', tracks: [{ id: 7, title: 'One', artist: 'The Band' }], cover: 4242, paidOnly: true as const };
const input = (over: Partial<AlbumInput> = {}): AlbumInput => ({ mode: 'arrive', player, from: 'jim.btc', offered: 50, status: [], asking: false, busy: false, topUps: [], primary: { label: 'Open album', run() {} }, ...over });
const mountAlbum = () => { const m = document.createElement('div'); document.body.append(m); return { m, view: createAlbumView(m, { radio: () => null, topUp() {}, openPlayer() {} }) }; };

afterEach(() => { vi.unstubAllGlobals(); document.body.replaceChildren(); });

describe('album covers while getting started', () => {
  it('finds a cover once, tells the views, and answers from memory afterwards', async () => {
    const fetched = vi.fn(async () => new Response('', { status: 200, headers: { 'content-type': 'image/png' } }));
    vi.stubGlobal('fetch', fetched);
    const drew = vi.fn();
    const stop = onArt(drew);
    expect(coverArt(9001)).toBe('');
    expect(coverArt(9001)).toBe('');
    await vi.waitFor(() => expect(drew).toHaveBeenCalled());
    expect(coverArt(9001)).toBe('/inscription/9001');
    expect(fetched).toHaveBeenCalledTimes(1);
    stop();
  });

  it('never asks for a cover that is not a plain inscription number', () => {
    const fetched = vi.fn();
    vi.stubGlobal('fetch', fetched);
    for (const bad of [null, undefined, 0, -3, 1.5, NaN]) expect(coverArt(bad as never)).toBe('');
    expect(fetched).not.toHaveBeenCalled();
  });

  it('a newcomer opening a gifted album sees the Xtrata mark and three lights; a returning listener sees no lights', () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 })));
    const { m, view } = mountAlbum();
    view.render(input({ step: 1 }));
    expect(m.querySelector('.al-brand svg.al-logo')).not.toBeNull();
    expect([...m.querySelectorAll('.al-steps li span')].map((n) => n.textContent)).toEqual([...ALBUM_STEPS]);
    expect(m.querySelector('.al-steps .is-now span')?.textContent).toBe('Passkey');
    expect(m.querySelector('.al-from')?.textContent).toContain('jim.btc');
    view.render(input());
    expect(m.querySelector('.al-steps')).toBeNull();
    view.render(null);
  });

  it('the welcome screen shows an album with its cover when one is known, and as a plain row when not', () => {
    const m = document.createElement('div');
    const view = createWelcomeView(m);
    const base = { mode: 'landed' as const, status: [], asking: false, busy: false, canStart: true, start() {}, returning() {}, unlock() {}, restock() {}, full() {} };
    view.render({ ...base, albums: [{ title: 'Night Drive', by: 'The Band', cover: '/inscription/4242', run() {} }, { title: 'Plain', by: 'Nobody', cover: '', run() {} }] });
    const rows = [...m.querySelectorAll('.al-album')];
    expect(rows[0].querySelector('img')?.getAttribute('src')).toBe('/inscription/4242');
    expect(rows[0].textContent).toBe('Night DriveThe Band');
    expect(rows[1].querySelector('img')).toBeNull();
    view.render(null);
  });
});
