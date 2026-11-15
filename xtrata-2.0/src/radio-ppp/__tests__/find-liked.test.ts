// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { createFindBox, type Song } from '../find';

const SONGS: Song[] = [{ id: 315, title: 'Entertainment', artist: 'melophonic' }, { id: 319, title: 'Russian Rampage', artist: 'melophonic' }, { id: 3582, title: 'Fear of the Dark', artist: 'melophonic' }];

describe('find music: the songs you like', () => {
  it('shows a small heart beside a liked song, and it follows the likes as they change', async () => {
    const mount = document.createElement('div');
    const liked = new Set([319]);
    const played: number[] = [];
    const box = createFindBox(mount, { load: async () => SONGS, play: (id) => played.push(id), current: () => null, locked: () => false, liked: (id) => liked.has(id) });
    box.load();
    await vi.waitFor(() => expect(mount.querySelector('.find-chip')).not.toBeNull());
    (mount.querySelector('.find-chip') as HTMLButtonElement).click();
    const rows = () => [...mount.querySelectorAll('li.lrow')].map((li) => `${li.querySelector('.lt')!.textContent}${li.querySelector('.find-liked') ? ' ♥' : ''}`);
    expect(rows()).toEqual(['Entertainment', 'Russian Rampage ♥', 'Fear of the Dark']);
    const heart = mount.querySelector('.find-liked')!;
    expect(heart.tagName).toBe('SPAN');                         // a mark, not a button: tapping the row still just plays
    expect(heart.getAttribute('aria-label')).toBe('Liked');
    (mount.querySelectorAll('li.lrow .lt')[1] as HTMLButtonElement).click();
    expect(played).toEqual([319]);
    liked.delete(319); liked.add(3582);
    box.refresh();
    expect(rows()).toEqual(['Entertainment', 'Russian Rampage', 'Fear of the Dark ♥']);
  });

  it('shows no hearts when likes are not known', async () => {
    const mount = document.createElement('div');
    const box = createFindBox(mount, { load: async () => SONGS, play: () => {}, current: () => null, locked: () => false });
    box.load();
    await vi.waitFor(() => expect(mount.querySelector('.find-chip')).not.toBeNull());
    (mount.querySelector('.find-chip') as HTMLButtonElement).click();
    expect(mount.querySelector('.find-liked')).toBeNull();
  });
});
