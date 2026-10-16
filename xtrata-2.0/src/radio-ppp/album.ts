/**
 * Album First: what a listener who was sent an album sees on /radio. A player, not a wallet: the cover, the artist,
 * the songs and how many plays are left. Everything else (the radio, the wallet, history, sending music) stays exactly
 * as it was and is reached from "More" or "My music", which open the existing panels as sheets.
 *
 * The view only reads the panel's snapshot and the radio's state and calls the same actions the panel does: it holds
 * no money logic. public/radio.html hides the rest of the page while `html[data-view="album"]` is set.
 */
import type { PlayerView } from '../lib/listening-wallet/gift-players';

export type AlbumMode = 'arrive' | 'locked' | 'open';
export type AlbumSheet = '' | 'more' | 'music' | 'device' | 'gifts';

export interface AlbumInput {
  /** arrive: a gift link with an album, not in a wallet yet. locked: the album this device had open, wallet locked. open: playing. */
  mode: AlbumMode;
  player: PlayerView;
  /** Who sent it, as a name to show (arrive). */
  from?: string | null;
  /** Plays that come with the gift (arrive). */
  offered?: number;
  /** Plays left (open); null while the balance is still being read. */
  plays?: number | null;
  /** Plays are on their way (a gift or a top-up not confirmed yet). */
  playsComing?: boolean;
  /** Progress, waits and real errors, already worded: gift claim lines, a passkey cancelled, the network slow. */
  status: HTMLElement[];
  primary?: { label: string; run: () => void } | null;
  secondary?: { label: string; run: () => void } | null;
  hint?: string;
  /** The wallet box is asking for a tap: it is shown in its own sheet, so the view says where to look. */
  asking: boolean;
  busy: boolean;
  /** Plays My player could move into this album, when known. */
  myPlays?: number;
  topUps: readonly number[];
}

export interface AlbumDeps {
  radio(): any;
  topUp(plays: number): void;
  /** Leave the album for My player (the open radio). */
  openPlayer(): void;
}

const LOW = 20;

const svg = (body: string, size = 22, fill = false) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${body}</svg>`;
const ICON = {
  grid: svg('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, true),
  prev: svg('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, true),
  next: svg('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, true),
  play: svg('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, true),
  playSmall: svg('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, true),
  pause: svg('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, true),
  eq: svg('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, true),
  down: svg('<path d="M6 9l6 6 6-6"/>', 18),
  right: svg('<path d="M9 6l6 6-6 6"/>', 16),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: svg('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: svg('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: svg('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};

type Kids = (Node | string | null | undefined | false)[];
function h(tag: string, props: Record<string, unknown> = {}, ...kids: Kids): HTMLElement {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') n.className = String(v);
    else if (k === 'html') n.innerHTML = String(v); // only our own static icon markup
    else if (k.startsWith('on') && typeof v === 'function') (n as any)[k.toLowerCase()] = v;
    else if (k === 'disabled') (n as HTMLButtonElement).disabled = !!v;
    else n.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of kids) if (c !== null && c !== undefined && c !== false) n.append(c);
  return n;
}
const btn = (props: Record<string, unknown>, ...kids: Kids) => h('button', { type: 'button', ...props }, ...kids);
const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const plural = (n: number, one: string, many: string) => `${n.toLocaleString()} ${n === 1 ? one : many}`;

/** Where each "More" row leads: the existing panel folds, opened as a sheet. */
const SHEET_TITLE: Record<Exclude<AlbumSheet, '' | 'more'>, string> = { music: 'My music', device: 'This device', gifts: 'Send music to a friend' };
const SHEET_FOLDS: Record<Exclude<AlbumSheet, '' | 'more'>, string[]> = { music: ['.ppp-shelf'], device: ['.ppp-wallets', '.ppp-recent', '.ppp-more'], gifts: ['.ppp-gifts'] };

export function createAlbumView(mount: HTMLElement, deps: AlbumDeps) {
  let last: AlbumInput | null = null;
  let sheet: AlbumSheet = '';
  let howOpen = false;
  const root = document.documentElement;

  // ---------------------------------------------------------------- cover art
  // The album's cover inscription: an image is used as it is; a page gives its first embedded image. The radio's own
  // resolved cover wins once it has one. Not found: the cover block shows the title instead, never an error.
  const covers = new Map<number, string>();
  const asked = new Set<number>();
  function cover(id: number | null | undefined): string {
    if (!id || !Number.isSafeInteger(id)) return '';
    const fromRadio = deps.radio()?.getState?.()?.albumCover;
    if (fromRadio?.url && Number(fromRadio.tokenId) === id) return fromRadio.url;
    if (covers.has(id)) return covers.get(id)!;
    if (!asked.has(id)) {
      asked.add(id);
      fetch('/inscription/' + id, { signal: AbortSignal.timeout(20_000) })
        .then(async (r) => {
          const type = (r.headers.get('content-type') || '').toLowerCase();
          if (!r.ok) { await r.body?.cancel(); throw new Error('no cover'); }
          if (type.startsWith('image/')) { await r.body?.cancel(); return '/inscription/' + id; }
          if (type.includes('text/html')) return ((await r.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)?.[1] ?? '').replace(/&amp;/g, '&');
          await r.body?.cancel();
          return '';
        })
        .then((url) => { covers.set(id, url); paint(); })
        .catch(() => { asked.delete(id); });
    }
    return '';
  }

  // ---------------------------------------------------------------- sheets
  function setSheet(next: AlbumSheet) {
    sheet = next;
    if (next) root.dataset.sheet = next; else delete root.dataset.sheet;
    const side = document.querySelector('.side');
    if (next && next !== 'more') {
      for (const sel of SHEET_FOLDS[next]) { const d = side?.querySelector(sel) as HTMLDetailsElement | null; if (d) d.open = true; }
      const title = document.getElementById('sheetTitle');
      if (title) title.textContent = SHEET_TITLE[next];
      const extra = document.getElementById('sheetExtra');
      if (extra) extra.replaceChildren(...(next === 'music' ? [radioRow()] : []));
      (side as HTMLElement | null)?.scrollTo?.({ top: 0 });
    }
    paint();
  }
  const closeBtn = document.getElementById('sheetClose');
  if (closeBtn) closeBtn.onclick = () => setSheet('');
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet && root.dataset.view === 'album') setSheet(''); });

  const radioRow = () => btn({ class: 'al-row', onClick: () => { setSheet(''); deps.openPlayer(); } },
    h('span', { class: 'al-row-i', html: ICON.radio }),
    h('span', { class: 'al-row-t' }, h('b', {}, 'Xtrata Radio'), h('small', {}, 'Every song on-chain · FM, liked, all')),
    h('span', { class: 'al-row-go', html: ICON.right }));

  // ---------------------------------------------------------------- radio state
  let st: any = null;
  let subscribed = false;
  const watch = () => {
    const r = deps.radio();
    if (subscribed || !r?.subscribe) return;
    subscribed = true;
    r.subscribe((s: any) => { st = s; if (last?.mode === 'open') paint(); });
    st = r.getState?.() ?? null;
  };
  setInterval(() => {
    if (last?.mode !== 'open' || !st?.playing) return;
    const p = deps.radio()?.getPosition?.();
    const bar = mount.querySelector('.al-bar > i') as HTMLElement | null;
    const times = mount.querySelectorAll('.al-times span');
    if (!p || !bar) return;
    bar.style.width = p.duration ? `${Math.min(100, (p.current / p.duration) * 100)}%` : '0%';
    if (times.length === 2) { times[0].textContent = time(p.current || 0); times[1].textContent = p.duration ? time(p.duration) : '–:––'; }
  }, 500);

  // ---------------------------------------------------------------- pieces
  /** The album's cover until a song with artwork of its own plays; then that song's. */
  function coverBox(p: PlayerView, big: boolean, songCover = '') {
    const url = songCover || cover(p.cover);
    return h('div', { class: 'al-cover' + (big ? '' : ' al-cover--small') },
      url ? h('img', { src: url, alt: `${p.title} cover` }) : h('div', { class: 'al-cover-fallback' }, h('b', {}, p.title), p.subtitle ? h('span', {}, p.subtitle) : null));
  }

  function playsChip(i: AlbumInput) {
    if (i.plays === null || i.plays === undefined) return h('span', { class: 'al-chip al-chip--quiet' }, i.playsComing ? 'Plays on their way…' : '…');
    if (i.plays === 0) return h('span', { class: 'al-chip al-chip--out' }, i.playsComing ? 'Plays on their way…' : 'No plays left');
    return h('span', { class: 'al-chip' + (i.plays <= LOW ? ' al-chip--low' : '') }, `${plural(i.plays, 'play', 'plays')} left`);
  }

  function intro(i: AlbumInput): Node[] {
    const p = i.player;
    const songs = p.tracks.filter((t) => !t.hidden);
    const out: Node[] = [];
    if (i.mode === 'arrive' && i.from) out.push(h('p', { class: 'al-from' }, h('span', { html: ICON.gift }), h('span', {}, h('b', {}, i.from), ' sent you an album')));
    out.push(coverBox(p, true));
    out.push(h('div', { class: 'al-intro' },
      h('h1', {}, p.title),
      p.subtitle ? h('p', { class: 'al-artist' }, p.subtitle) : null,
      songs.length ? h('p', { class: 'al-songline' }, songs.map((t) => t.title || `#${t.id}`).join(' · ')) : null,
      h('span', { class: 'al-chip' }, [plural(songs.length, 'song', 'songs'), i.offered ? plural(i.offered, 'play', 'plays') : ''].filter(Boolean).join(' · '))));
    if (i.status.length) out.push(h('div', { class: 'al-status', role: 'status' }, ...i.status));
    out.push(h('div', { class: 'al-grow' }));
    if (i.asking) out.push(h('p', { class: 'al-hint al-hint--ask' }, 'Continue in the box below.'));
    else if (i.primary) out.push(btn({ class: 'al-primary', onClick: i.primary.run, disabled: i.busy }, h('span', { html: ICON.playSmall }), i.primary.label));
    if (i.hint && !i.asking) out.push(h('p', { class: 'al-hint' }, i.hint));
    if (i.secondary && !i.asking) out.push(btn({ class: 'al-link', onClick: i.secondary.run, disabled: i.busy }, i.secondary.label));
    return out;
  }

  function player(i: AlbumInput): Node[] {
    const p = i.player;
    const songs = p.tracks.filter((t) => !t.hidden);
    const r = deps.radio();
    const np = st?.nowPlaying;
    const current = np && p.tracks.some((t) => String(t.id) === String(np.tokenId)) ? String(np.tokenId) : null;
    const song = current ? p.tracks.find((t) => String(t.id) === current) : null;
    const out = i.plays === 0 && !i.playsComing;
    // Plays on their way and none to spend yet: the controls rest (greyed out) until they land. Nothing is wrong.
    const waiting = !!i.playsComing && !i.plays;
    const playing = !!st?.playing && !!current;
    const heart = st?.heart;
    const nodes: Node[] = [coverBox(p, !out, current ? String(np?.cover || '') : '')];

    nodes.push(h('div', { class: 'al-now' },
      h('div', { class: 'al-now-t' },
        h('div', { class: 'al-song' }, song ? (song.title || np?.title || `#${song.id}`) : p.title),
        h('div', { class: 'al-artist' }, song ? (song.artist || np?.artist || p.subtitle) : p.subtitle || 'Press play')),
      current ? btn({ class: 'al-icon' + (heart?.liked ? ' is-on' : ''), 'aria-label': heart?.liked ? 'Unlike this song' : 'Like this song', 'aria-pressed': String(!!heart?.liked), disabled: !!heart?.pending || !!heart?.locked || waiting, onClick: () => r?.toggleLike?.(), html: heart?.liked ? ICON.heartOn : ICON.heart }) : null));

    if (!out) {
      const pos = current ? r?.getPosition?.() : null;
      const at = pos?.duration ? Math.min(100, (pos.current / pos.duration) * 100) : 0;
      nodes.push(h('div', { class: 'al-prog' }, h('div', { class: 'al-bar' }, h('i', { style: `width: ${at}%` })),
        h('div', { class: 'al-times' }, h('span', {}, time(pos?.current || 0)), h('span', {}, pos?.duration ? time(pos.duration) : '–:––'))));
    } else {
      nodes.push(h('div', { class: 'al-out' },
        h('p', { class: 'al-out-k' }, '0 PLAYS LEFT'),
        h('p', { class: 'al-out-t' }, "You've played this album out"),
        h('p', { class: 'al-out-s' }, 'Add plays to keep listening.'),
        topUpButtons(i, true)));
    }
    nodes.push(h('div', { class: 'al-ctl' + (out || waiting ? ' is-off' : '') },
      btn({ class: 'al-icon al-icon--big', 'aria-label': 'Previous song', disabled: out || waiting, onClick: () => r?.prev?.(), html: ICON.prev }),
      btn({ class: 'al-play', 'aria-label': playing ? 'Pause' : 'Play', disabled: out || waiting, onClick: () => r?.playPause?.(), html: playing ? ICON.pause : ICON.play }),
      btn({ class: 'al-icon al-icon--big', 'aria-label': 'Next song', disabled: out || waiting, onClick: () => r?.next?.(), html: ICON.next })));
    if (i.status.length) nodes.push(h('div', { class: 'al-status', role: 'status' }, ...i.status));

    nodes.push(h('div', { class: 'al-listhead' }, h('span', {}, h('b', {}, p.title), ` · ${plural(songs.length, 'song', 'songs')}`), playsChip(i)));
    nodes.push(h('ol', { class: 'al-tracks' }, ...songs.map((t, n) => {
      const on = String(t.id) === current;
      return h('li', {}, btn({ class: 'al-track' + (on ? ' is-on' : ''), 'aria-label': `Play ${t.title || '#' + t.id}`, 'aria-current': on ? 'true' : undefined, disabled: out || waiting, onClick: () => r?.playToken?.(t.id) },
        h('span', { class: 'al-n' }, String(n + 1)),
        h('span', { class: 'al-tt' }, t.title || `#${t.id}`),
        on ? h('span', { class: 'al-eq', html: ICON.eq }) : null));
    })));
    nodes.push(h('div', { class: 'al-grow' }));
    nodes.push(btn({ class: 'al-more', 'aria-expanded': String(sheet === 'more'), onClick: () => setSheet(sheet === 'more' ? '' : 'more') },
      h('span', {}, 'More ', h('span', { class: 'al-mute' }, '· add plays, send, radio, settings')), h('span', { html: ICON.down })));
    return nodes;
  }

  function topUpButtons(i: AlbumInput, primary: boolean): HTMLElement {
    const box = h('div', { class: 'al-topups' + (primary ? ' al-topups--primary' : '') });
    const pick = primary ? [i.topUps[1] ?? i.topUps[0]] : [...i.topUps];
    for (const n of pick) {
      const can = i.myPlays !== undefined && i.myPlays >= n && !i.playsComing && !i.busy;
      box.append(btn({ class: 'al-topup', disabled: !can, onClick: () => deps.topUp(n) }, primary ? `Add ${n.toLocaleString()} plays` : `+${n.toLocaleString()}`));
    }
    if (primary) box.append(btn({ class: 'al-link', onClick: () => setSheet('more') }, 'Other amounts'));
    return box;
  }

  function moreSheet(i: AlbumInput): HTMLElement {
    const enough = i.myPlays !== undefined && i.myPlays >= (i.topUps[0] ?? 0);
    const add = h('div', { class: 'al-card' },
      h('div', { class: 'al-card-h' }, h('b', {}, `Add plays to ${i.player.title}`), h('span', { class: 'al-mono' }, i.plays === null || i.plays === undefined ? '' : `${i.plays.toLocaleString()} left`)),
      topUpButtons(i, false),
      h('p', { class: 'al-mute al-small' }, i.playsComing ? 'Plays are on their way. Add more once they arrive.'
        : i.myPlays === undefined ? 'Checking My player…'
        : enough ? `Moved from My player · ${plural(i.myPlays, 'play', 'plays')} there.`
        : 'My player needs plays first.'),
      !enough && !i.playsComing && i.myPlays !== undefined ? btn({ class: 'al-link', onClick: () => { setSheet(''); deps.openPlayer(); } }, 'Open My player') : null);
    const row = (icon: string, title: string, sub: string, run: () => void) => btn({ class: 'al-row', onClick: run },
      h('span', { class: 'al-row-i', html: icon }), h('span', { class: 'al-row-t' }, h('b', {}, title), h('small', {}, sub)), h('span', { class: 'al-row-go', html: ICON.right }));
    const how = h('div', { class: 'al-how' + (howOpen ? ' is-open' : '') },
      row(ICON.info, 'How plays work', 'Every play counts for the song’s owner', () => { howOpen = !howOpen; paint(); }),
      howOpen ? h('p', { class: 'al-mute al-small' }, 'A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.') : null);
    return h('div', { class: 'al-sheet', role: 'dialog', 'aria-label': 'More' },
      h('div', { class: 'al-sheet-h' }, h('b', {}, 'More'), btn({ class: 'al-icon', 'aria-label': 'Close', onClick: () => setSheet(''), html: ICON.close })),
      i.mode === 'open' ? add : null,
      h('div', { class: 'al-rows' },
        row(ICON.grid, 'My music', 'Your albums and the radio', () => setSheet('music')),
        row(ICON.radio, 'Xtrata Radio', 'FM · Liked · every song', () => { setSheet(''); deps.openPlayer(); }),
        row(ICON.gift, 'Send music to a friend', 'They open it with a link', () => setSheet('gifts')),
        row(ICON.device, 'This device', 'Backup, history, Stacks wallet, returns', () => setSheet('device')),
        how));
  }

  // ---------------------------------------------------------------- paint
  function paint() {
    const i = last;
    if (!i) { mount.hidden = true; mount.replaceChildren(); return; }
    watch();
    mount.hidden = false;
    const top = h('header', { class: 'al-top' },
      h('a', { class: 'al-brand', href: '/radio' }, 'Xtrata ', h('b', {}, 'Music')),
      i.mode === 'open' ? btn({ class: 'al-icon', 'aria-label': 'My music', onClick: () => setSheet('music'), html: ICON.grid }) : null);
    const body = h('div', { class: 'al-body al-body--' + i.mode }, ...(i.mode === 'open' ? player(i) : intro(i)));
    mount.replaceChildren(top, body, ...(sheet === 'more' ? [h('div', { class: 'al-scrim', onClick: () => setSheet('') }), moreSheet(i)] : []));
  }

  return {
    render(input: AlbumInput | null) {
      const wasOn = !!last;
      last = input;
      if (!input && (wasOn || sheet)) { sheet = ''; delete root.dataset.sheet; }
      if (input) root.dataset.view = 'album'; else delete root.dataset.view;
      if (input?.asking) root.dataset.asking = '1'; else delete root.dataset.asking;
      paint();
    },
    sheet: () => sheet,
    setSheet
  };
}
