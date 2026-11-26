// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { createFindBox, isShortName, type Song } from '../find';

const SONGS: Song[] = [
  { id: 1, title: 'One', artist: 'melophonic' }, { id: 2, title: 'Two', artist: 'melophonic' },
  { id: 3, title: 'Three', artist: 'Cicada' },
  { id: 4, title: 'Four', artist: 'Xtrata Arcade' },
  { id: 5, title: 'Five', artist: 'Hundred Little Reasons' },
  { id: 6, title: 'Six', artist: 'Rex Speedway and The Denim Avengers' }
];

async function open(grid: boolean) {
  const mount = document.createElement('div');
  const box = createFindBox(mount, { load: async () => SONGS, play: () => {}, current: () => null, locked: () => false, grid });
  box.load();
  await vi.waitFor(() => expect(mount.querySelector('.find-chip')).not.toBeNull());
  const names = () => [...mount.querySelectorAll('.find-artists .find-chip')].map((b) => b.textContent);
  return { mount, names };
}

describe('find music: artists in three columns', () => {
  it('counts a name as short when it fits a column', () => {
    expect(isShortName('melophonic')).toBe(true);
    expect(isShortName('Xtrata Arcade')).toBe(true);        // 13 characters
    expect(isShortName('Hundred Little Reasons')).toBe(false);
  });

  it('lists every short name in the grid and keeps the long ones behind one button', async () => {
    const { mount, names } = await open(true);
    expect(mount.querySelector('.find-artists')!.classList.contains('find-artists--grid')).toBe(true);
    expect(names()).toEqual(['melophonic', 'Cicada', 'Xtrata Arcade', '2 more artists']);
    expect(mount.querySelector('.find-more')).not.toBeNull();
  });

  it('opens the long names underneath the button, and closes them again', async () => {
    const { mount, names } = await open(true);
    (mount.querySelector('.find-more') as HTMLButtonElement).click();
    expect(names()).toEqual(['melophonic', 'Cicada', 'Xtrata Arcade', 'Fewer artists', 'Hundred Little Reasons · 1', 'Rex Speedway and The Denim Avengers · 1']);
    expect(mount.querySelectorAll('.find-chip--long').length).toBe(2);
    (mount.querySelector('.find-more') as HTMLButtonElement).click();
    expect(names()).toEqual(['melophonic', 'Cicada', 'Xtrata Arcade', '2 more artists']);
  });

  it('picking an artist filters the songs, and a long artist stays visible if the list is closed after', async () => {
    const { mount, names } = await open(true);
    (mount.querySelectorAll('.find-chip')[1] as HTMLButtonElement).click();                 // Cicada
    expect([...mount.querySelectorAll('li .lt')].map((b) => b.textContent)).toEqual(['Three']);
    (mount.querySelector('.find-more') as HTMLButtonElement).click();
    (mount.querySelectorAll('.find-chip--long')[0] as HTMLButtonElement).click();           // Hundred Little Reasons
    (mount.querySelector('.find-more') as HTMLButtonElement).click();                       // close
    expect(names()).toEqual(['melophonic', 'Cicada', 'Xtrata Arcade', '2 more artists', 'Hundred Little Reasons · 1']);
    expect(mount.querySelector('.find-chip--long')!.getAttribute('aria-pressed')).toBe('true');
  });

  it('leaves the classic list alone', async () => {
    const { mount, names } = await open(false);
    expect(mount.querySelector('.find-artists')!.classList.contains('find-artists--grid')).toBe(false);
    expect(names()).toContain('melophonic · 2');
  });
});

describe('find music: artists in a section of their own (the radio page\'s Browse)', () => {
  it('draws the names in the mount it is given, and the results stay under the search box', async () => {
    const mount = document.createElement('div'), artists = document.createElement('div');
    mount.scrollIntoView = vi.fn();
    const box = createFindBox(mount, { load: async () => SONGS, play: () => {}, current: () => null, locked: () => false, grid: true, artistsMount: artists });
    box.load();
    await vi.waitFor(() => expect(artists.querySelector('.find-chip')).not.toBeNull());
    expect(mount.querySelector('.find-artists')).toBeNull();
    expect(mount.querySelector('input.find-q')).not.toBeNull();
    const chip = [...artists.querySelectorAll('.find-chip')].find((b) => b.textContent === 'melophonic') as HTMLButtonElement;
    chip.click();
    expect([...mount.querySelectorAll('.find-list .lt')].map((b) => b.textContent)).toEqual(['One', 'Two']);
    expect(mount.scrollIntoView).toHaveBeenCalled(); // the results are brought into view
  });
});
