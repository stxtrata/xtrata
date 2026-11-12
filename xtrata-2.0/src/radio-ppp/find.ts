/**
 * "Find music": search and browse the whole catalogue by song, artist or number, from the radio page.
 *
 * Names come from one place: the radio's catalogue (`/radio/counts`) with Xtrata's own corrections applied on top
 * (src/lib/radio/artist-credits.mjs: `radioArtist`, `radioTitle`), which is how early inscriptions with missing or
 * wrong credits get their proper artist. A song added tomorrow appears here with the metadata it was inscribed with,
 * with nothing to maintain. Picking a result plays it on the radio; nothing here pays or signs.
 */
export interface Song { id: number; title: string; artist: string }
export interface ArtistCount { name: string; songs: number }

const fold = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const untitled = (t: string) => !t || /^(?:Inscription )?#\d+$/.test(t.trim());

/** The catalogue as searchable songs: corrected names, no duplicates, in the order they were added. */
export function buildSongs(tracks: unknown, name: (id: number, raw: { title?: string; artist?: string }) => { title: string; artist: string }): Song[] {
  const seen = new Set<number>();
  const out: Song[] = [];
  for (const t of Array.isArray(tracks) ? tracks : []) {
    const id = Number((t as any)?.id);
    if (!Number.isSafeInteger(id) || id < 0 || seen.has(id)) continue;
    seen.add(id);
    const n = name(id, { title: typeof (t as any).title === 'string' ? (t as any).title : undefined, artist: typeof (t as any).artist === 'string' ? (t as any).artist : undefined });
    out.push({ id, title: untitled(n.title) ? `#${id}` : n.title.trim(), artist: (n.artist || '').trim() });
  }
  return out.sort((a, b) => a.id - b.id);
}

/** Every credited artist with how many songs they have, most songs first, then by name. Spelling variants that differ only by case or accents count as one. */
export function artistsOf(songs: Song[]): ArtistCount[] {
  const by = new Map<string, ArtistCount>();
  for (const s of songs) {
    if (!s.artist) continue;
    const k = fold(s.artist);
    const a = by.get(k);
    if (a) a.songs++; else by.set(k, { name: s.artist, songs: 1 });
  }
  return [...by.values()].sort((a, b) => b.songs - a.songs || a.name.localeCompare(b.name));
}

/**
 * Songs matching what was typed: every word must appear in the title, the artist or the number ("#123" or "123").
 * `artist` narrows to one artist first. Title matches come before artist-only matches. Nothing typed and no artist: none.
 */
export function findSongs(songs: Song[], query: string, artist = '', limit = 60): { songs: Song[]; total: number } {
  const words = fold(query).split(/\s+/).filter(Boolean);
  const only = fold(artist);
  if (!words.length && !only) return { songs: [], total: 0 };
  const hits: { s: Song; rank: number }[] = [];
  for (const s of songs) {
    const a = fold(s.artist), t = fold(s.title), n = String(s.id);
    if (only && a !== only) continue;
    let rank = 0, ok = true;
    for (const w of words) {
      const num = w.replace(/^#/, '');
      if (t.includes(w)) rank += t.startsWith(w) ? 0 : 1;
      else if (/^\d+$/.test(num) && n === num) rank += 0;
      else if (a.includes(w)) rank += 2;
      else if (/^\d+$/.test(num) && n.startsWith(num)) rank += 3;
      else { ok = false; break; }
    }
    if (ok) hits.push({ s, rank });
  }
  hits.sort((x, y) => x.rank - y.rank || x.s.id - y.s.id);
  return { songs: hits.slice(0, limit).map((h) => h.s), total: hits.length };
}

// ---------------------------------------------------------------- the box on the page

export interface FindDeps {
  /** Loads the catalogue (already corrected). Rejects when it cannot be read: the box then says so. */
  load(): Promise<Song[]>;
  play(id: number): void;
  /** The song on air, to mark it in the list. */
  current(): number | null;
  /** Is this song marked explicit? Such a song is shown with an E and asks before it plays. */
  explicit?(id: number): boolean;
  /** An album that plays only its own songs is open: finding other music is off until the listener leaves it. */
  locked(): boolean;
}

const el = (tag: string, cls = '', text = '') => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
const ARTISTS_SHOWN = 12;

export function createFindBox(mount: HTMLElement, deps: FindDeps) {
  let songs: Song[] | null = null;
  let state: 'idle' | 'loading' | 'ready' | 'failed' = 'idle';
  let query = '', artist = '', allArtists = false;
  const input = el('input', 'find-q') as HTMLInputElement;
  input.type = 'search'; input.placeholder = 'Search songs, artists or #'; input.setAttribute('aria-label', 'Search all music'); input.autocomplete = 'off';
  const status = el('div', 'hint'), chips = el('div', 'find-artists'), list = el('ol', 'likesList find-list');
  status.setAttribute('role', 'status');
  const tools = el('div', 'likesTools'); tools.append(input);
  mount.replaceChildren(tools, status, chips, list);
  input.oninput = () => { query = input.value; paint(); };

  function load() {
    if (state === 'loading' || state === 'ready') return;
    state = 'loading'; paint();
    deps.load().then((s) => { songs = s; state = 'ready'; paint(); }, () => { state = 'failed'; paint(); });
  }
  function paint() {
    const locked = deps.locked();
    input.disabled = locked;
    if (locked) { status.textContent = 'An album is open and plays only its own songs. Go back to My player to find other music.'; chips.replaceChildren(); list.replaceChildren(); return; }
    if (state === 'idle') { status.textContent = ''; return; }
    if (state === 'loading') { status.textContent = 'Loading the catalogue…'; return; }
    if (state === 'failed' || !songs) {
      status.textContent = 'The catalogue is unavailable right now. ';
      const again = el('button', '', 'Try again') as HTMLButtonElement; again.type = 'button'; again.onclick = () => { state = 'idle'; load(); };
      status.append(again); chips.replaceChildren(); list.replaceChildren();
      return;
    }
    const artists = artistsOf(songs);
    const shown = allArtists ? artists : artists.slice(0, ARTISTS_SHOWN);
    const chip = (label: string, on: boolean, run: () => void, title = '') => {
      const b = el('button', 'find-chip' + (on ? ' is-on' : ''), label) as HTMLButtonElement;
      b.type = 'button'; b.setAttribute('aria-pressed', String(on)); if (title) b.title = title; b.onclick = run;
      return b;
    };
    chips.replaceChildren(
      ...shown.map((a) => chip(`${a.name} · ${a.songs}`, fold(a.name) === fold(artist), () => { artist = fold(a.name) === fold(artist) ? '' : a.name; paint(); }, `Show ${a.name}’s ${a.songs === 1 ? 'song' : `${a.songs} songs`}`)),
      ...(artists.length > ARTISTS_SHOWN ? [chip(allArtists ? 'Fewer artists' : `All ${artists.length} artists`, false, () => { allArtists = !allArtists; paint(); })] : []));
    const found = findSongs(songs, query, artist);
    const now = deps.current();
    list.replaceChildren(...found.songs.map((s) => {
      const li = el('li', 'lrow' + (s.id === now ? ' now' : ''));
      const b = el('button', 'lt', s.title) as HTMLButtonElement;
      b.type = 'button'; b.title = `Play “${s.title}”${s.artist ? ` by ${s.artist}` : ''}`;
      b.onclick = () => deps.play(s.id);
      if (deps.explicit?.(s.id)) { const e = el('span', 'exp', 'E'); e.title = 'Explicit lyrics: only plays when you choose it'; b.append(' ', e); }
      li.append(b, el('span', 'find-by', `${s.artist ? s.artist + ' · ' : ''}#${s.id}`));
      return li;
    }));
    status.textContent = !query.trim() && !artist ? `${songs.length.toLocaleString()} songs by ${artists.length.toLocaleString()} artists. Search, or pick an artist.`
      : found.total === 0 ? 'Nothing matches. Try fewer words, or pick an artist.'
      : found.total > found.songs.length ? `Showing ${found.songs.length} of ${found.total.toLocaleString()}. Type more to narrow it down.`
      : `${found.total} ${found.total === 1 ? 'song' : 'songs'}${artist ? ` by ${artist}` : ''}. Tap one to play it.`;
  }
  return { load, refresh: paint };
}
