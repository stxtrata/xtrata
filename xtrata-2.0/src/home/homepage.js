import {
  HOMEPAGE_AUDIONAUTS,
  HOMEPAGE_CHESS,
  HOMEPAGE_FRESH,
  HOMEPAGE_INTENTS,
  HOMEPAGE_KP_LOOPS,
  HOMEPAGE_MUSIC,
  HOMEPAGE_PLAY,
  HOMEPAGE_PROGRAMMES,
  HOMEPAGE_STRIP_SLIDES,
  HOMEPAGE_WALL,
  validateHomepageContent
} from './homepage-content.js';

const HOME_ACTION_EVENT = 'xtrata:homepage-action';
const HOME_MOUNT_IDS = [
  'homeStrip',
  'featuredObjectStage',
  'homeNowPlaying',
  'homeMusicTabs',
  'homeMusicShelf',
  'homeAudionauts',
  'homeKpLoops',
  'homeFreshFilters',
  'homeFresh',
  'homePlayGrid',
  'homeProgrammes',
  'intentGrid'
];
const STRIP_INTERVAL_MS = 6000;
let actionTrackingInstalled = false;
let contentValidated = false;
let stripTimer = null;
let radioUnsubscribe = null;
let radioWaitTimer = null;
let radioSnapshot = null;

const element = (tagName, className, text) => {
  const node = document.createElement(tagName);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
};

const actionLink = (href, label, className, action, options = {}) => {
  const link = element('a', className, label);
  link.href = href;
  link.dataset.homeAction = action;
  if (options.newTab || !href.startsWith('/')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.target = '_self';
  }
  return link;
};

const image = (src, alt, className, options = {}) => {
  const img = element('img', className);
  img.src = src;
  img.alt = alt;
  img.loading = options.eager ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (options.position) {
    img.style.objectPosition = options.position;
  }
  return img;
};

const svgIcon = (kind) => {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('home-icon');
  const paths = {
    play: 'M7 4.5v15l13-7.5z',
    pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
    prev: 'M15 6l-6 6 6 6',
    next: 'M9 6l6 6-6 6'
  };
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', paths[kind]);
  if (kind === 'prev' || kind === 'next') {
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
  } else {
    path.setAttribute('fill', 'currentColor');
  }
  svg.append(path);
  return svg;
};

// ---------------------------------------------------------------------------
// Chess board: 64 plain squares, so the homepage never downloads the
// X Chess inscription until someone chooses to play.
const CHESS_GLYPHS = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟︎' };

const createChessBoard = (className = '') => {
  const board = element('div', `home-chess ${className}`.trim());
  board.setAttribute('role', 'img');
  board.setAttribute('aria-label', 'Chess board showing a game in progress');
  const highlighted = new Set(
    HOMEPAGE_CHESS.lastMove.map((square) => `${8 - Number(square[1])},${square.charCodeAt(0) - 97}`)
  );
  HOMEPAGE_CHESS.fen.split('/').forEach((row, r) => {
    let c = 0;
    for (const ch of row) {
      const empties = /\d/.test(ch) ? Number(ch) : 0;
      const count = empties || 1;
      for (let i = 0; i < count; i += 1) {
        const square = element('span', 'home-chess__sq');
        if ((r + c) % 2 === 1) {
          square.classList.add('home-chess__sq--dark');
        }
        if (highlighted.has(`${r},${c}`)) {
          square.classList.add('home-chess__sq--last');
        }
        if (!empties) {
          const white = ch === ch.toUpperCase();
          square.append(
            element('span', `home-chess__piece home-chess__piece--${white ? 'w' : 'b'}`, CHESS_GLYPHS[ch.toLowerCase()])
          );
        }
        board.append(square);
        c += 1;
      }
    }
  });
  return board;
};

// ---------------------------------------------------------------------------
// Radio: homepage plays go through the site radio already in the header, so
// there is only ever one player and plays are counted like any other listen.
// Free to the listener: the paid per-play path lives in the Xtrata Music app.
const radioApi = () =>
  window.XtrataRadio && typeof window.XtrataRadio.playToken === 'function' ? window.XtrataRadio : null;

const isSongPlaying = (tokenId) =>
  Boolean(radioSnapshot?.playing && String(radioSnapshot?.nowPlaying?.tokenId) === String(tokenId));

const playSong = (tokenId) => {
  const api = radioApi();
  if (!api) {
    window.open(HOMEPAGE_MUSIC.loungeHref, '_blank', 'noopener');
    return;
  }
  if (radioSnapshot?.on && String(radioSnapshot?.nowPlaying?.tokenId) === String(tokenId)) {
    api.playPause();
    return;
  }
  api.playToken(tokenId);
};

const syncSongButtons = () => {
  document.querySelectorAll('[data-song-id]').forEach((node) => {
    const playing = isSongPlaying(node.dataset.songId);
    node.classList.toggle('is-playing', playing);
    node.setAttribute('aria-pressed', playing ? 'true' : 'false');
    const badge = node.querySelector('.home-play-badge');
    if (badge && badge.dataset.state !== String(playing)) {
      badge.dataset.state = String(playing);
      badge.replaceChildren(svgIcon(playing ? 'pause' : 'play'));
    }
  });
  const radioPlaying = Boolean(radioSnapshot?.playing);
  document.querySelectorAll('[data-radio-toggle]').forEach((node) => {
    node.classList.toggle('is-playing', radioPlaying);
    node.setAttribute('aria-pressed', radioPlaying ? 'true' : 'false');
    const badge = node.querySelector('.home-play-badge');
    if (badge && badge.dataset.state !== String(radioPlaying)) {
      badge.dataset.state = String(radioPlaying);
      badge.replaceChildren(svgIcon(radioPlaying ? 'pause' : 'play'));
    }
    const text = node.querySelector('[data-radio-label]');
    if (text) {
      text.textContent = radioPlaying ? 'Xtrata Radio is playing' : text.dataset.radioLabel;
    }
  });
  renderNowPlaying();
};

const attachRadio = () => {
  if (radioUnsubscribe || radioWaitTimer) {
    return;
  }
  let tries = 0;
  const tryAttach = () => {
    const api = radioApi();
    if (api && typeof api.subscribe === 'function') {
      radioWaitTimer = null;
      radioUnsubscribe = api.subscribe((snapshot) => {
        radioSnapshot = snapshot;
        syncSongButtons();
      });
      return;
    }
    tries += 1;
    radioWaitTimer = tries < 60 ? window.setTimeout(tryAttach, 500) : null;
  };
  tryAttach();
};

const playBadge = () => {
  const badge = element('span', 'home-play-badge');
  badge.dataset.state = 'false';
  badge.append(svgIcon('play'));
  return badge;
};

const songButton = (song, className, content) => {
  const button = element('button', className);
  button.type = 'button';
  button.dataset.songId = String(song.id);
  button.dataset.homeAction = `play_song:${song.id}`;
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', `Play ${song.title}${song.artist ? ` by ${song.artist}` : ''}`);
  button.append(...content);
  button.addEventListener('click', () => playSong(song.id));
  return button;
};

// Plays (or pauses) the site radio in place. Used where the visual is silent,
// like the Audionauts logo, so pressing it still gives the visitor sound.
const toggleRadio = (fallbackHref) => {
  const api = radioApi();
  if (!api) {
    window.open(fallbackHref || '/radio', '_blank', 'noopener');
    return;
  }
  if (!api.isOn()) {
    api.switchOn();
  } else {
    api.playPause();
  }
};

const radioButton = (className, label, fallbackHref, action, content) => {
  const button = element('button', className);
  button.type = 'button';
  button.dataset.radioToggle = 'true';
  button.dataset.homeAction = action;
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', label);
  button.append(...content);
  button.addEventListener('click', () => toggleRadio(fallbackHref));
  return button;
};

const renderNowPlaying = () => {
  const mount = document.getElementById('homeNowPlaying');
  if (!mount) {
    return;
  }
  const track = radioSnapshot?.on ? radioSnapshot.nowPlaying : null;
  const state = !track ? 'idle' : radioSnapshot.playing ? 'playing' : 'paused';
  const key = `${state}:${track?.tokenId ?? ''}`;
  if (mount.dataset.key === key) {
    return;
  }
  mount.dataset.key = key;
  mount.dataset.state = state;
  mount.replaceChildren();
  if (!track) {
    mount.append(
      element('span', 'home-now__kicker', 'Free to play here'),
      element('span', 'home-now__hint', 'Press any cover to hear it. It plays through Xtrata Radio.')
    );
    return;
  }
  const row = element('div', 'home-now__row');
  row.append(image(HOMEPAGE_MUSIC.artworkUrl(track.tokenId), '', 'home-now__art', { eager: true }));
  const text = element('div', 'home-now__text');
  text.append(
    element('span', 'home-now__kicker', state === 'playing' ? 'Now playing' : 'Paused'),
    element('strong', 'home-now__title', track.title || `Inscription #${track.tokenId}`)
  );
  const toggle = element('button', 'home-now__toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-label', state === 'playing' ? 'Pause' : 'Play');
  toggle.append(svgIcon(state === 'playing' ? 'pause' : 'play'));
  toggle.addEventListener('click', () => radioApi()?.playPause());
  row.append(text, toggle);
  mount.append(row);
};

// ---------------------------------------------------------------------------
// Live song catalogue, shared by the shelf and the fresh feed. A failed read
// is reported as failed (curated fallback + a note), never as "no songs".
let catalogue = null;
const loadCatalogue = () => {
  if (!catalogue) {
    catalogue = fetch(HOMEPAGE_MUSIC.countsUrl)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((data) => {
        const tracks = (Array.isArray(data?.tracks) ? data.tracks : [])
          .filter((row) => Number.isInteger(Number(row.id)) && row.title && !/^Inscription #\d+$/.test(row.title))
          .map((row) => ({
            id: Number(row.id),
            title: row.title,
            artist: row.artist || '',
            plays: Number(row.plays) || 0,
            duration: Number(row.duration) || 0,
            cover: row.thumbnail || HOMEPAGE_MUSIC.artworkUrl(row.id),
            hasArt: Boolean(row.thumbnail)
          }));
        // The same song inscribed twice shows once: keep the newest inscription.
        const seen = new Set();
        const unique = tracks
          .sort((a, b) => b.id - a.id)
          .filter((t) => {
            const key = `${t.title.trim().toLowerCase()}|${t.artist.trim().toLowerCase()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        return { ok: unique.length > 0, tracks: unique };
      })
      .catch(() => ({ ok: false, tracks: [] }));
  }
  return catalogue;
};

const fallbackTracks = () =>
  HOMEPAGE_MUSIC.fallback.map((song) => ({
    ...song,
    plays: null,
    duration: 0,
    cover: HOMEPAGE_MUSIC.artworkUrl(song.id),
    hasArt: true
  }));

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const whole = Math.round(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

// ---------------------------------------------------------------------------
// Strip: one rotating line under the nav.
const renderStrip = () => {
  const mount = document.getElementById('homeStrip');
  if (!mount) {
    return;
  }
  window.clearInterval(stripTimer);
  mount.replaceChildren();
  let index = 0;
  let paused = false;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const slide = element('div', 'home-strip__slide');
  slide.setAttribute('aria-live', 'polite');
  const dots = element('div', 'home-strip__dots');
  const show = (next) => {
    index = (next + HOMEPAGE_STRIP_SLIDES.length) % HOMEPAGE_STRIP_SLIDES.length;
    const item = HOMEPAGE_STRIP_SLIDES[index];
    mount.dataset.tone = item.tone;
    slide.replaceChildren(
      element('span', 'home-strip__tag', item.tag),
      element('strong', 'home-strip__title', item.title),
      element('span', 'home-strip__line', item.line),
      actionLink(item.href, `${item.cta} →`, 'home-strip__cta', `strip:${item.id}`, { newTab: item.newTab })
    );
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', i === index ? 'true' : 'false'));
  };
  const restart = () => {
    window.clearInterval(stripTimer);
    if (!reduced) {
      stripTimer = window.setInterval(() => {
        if (!paused && !document.hidden) show(index + 1);
      }, STRIP_INTERVAL_MS);
    }
  };
  HOMEPAGE_STRIP_SLIDES.forEach((item, i) => {
    const dot = element('button', 'home-strip__dot');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show: ${item.title}`);
    dot.addEventListener('click', () => {
      show(i);
      restart();
    });
    dots.append(dot);
  });
  const arrow = (dir) => {
    const button = element('button', 'home-strip__arrow');
    button.type = 'button';
    button.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
    button.append(svgIcon(dir));
    button.addEventListener('click', () => {
      show(index + (dir === 'prev' ? -1 : 1));
      restart();
    });
    return button;
  };
  const controls = element('div', 'home-strip__controls');
  controls.append(dots, arrow('prev'), arrow('next'));
  mount.append(slide, controls);
  mount.onmouseenter = () => { paused = true; };
  mount.onmouseleave = () => { paused = false; };
  mount.onfocusin = () => { paused = true; };
  mount.onfocusout = () => { paused = false; };
  show(0);
  restart();
};

// ---------------------------------------------------------------------------
// Living wall
const wallCaption = (item) => {
  const caption = element('span', 'home-tile__caption');
  if (item.eyebrow) caption.append(element('span', 'home-tile__eyebrow', item.eyebrow));
  caption.append(element('strong', 'home-tile__title', item.title));
  if (item.subtitle) caption.append(element('span', 'home-tile__sub', item.subtitle));
  if (item.cta && item.kind !== 'chess') caption.append(element('span', 'home-tile__cta home-tile__cta--wall', `${item.cta} →`));
  return caption;
};

const renderWall = () => {
  const mount = document.getElementById('featuredObjectStage');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  HOMEPAGE_WALL.forEach((item, i) => {
    const classes = `home-tile home-tile--${item.kind} home-tile--${item.size || 'one'} home-tone--${item.tone || 'plain'}`;
    if (item.kind === 'song') {
      const song = { id: item.tokenId, title: item.title, artist: item.subtitle };
      mount.append(
        songButton(song, classes, [
          image(HOMEPAGE_MUSIC.artworkUrl(item.tokenId), '', 'home-tile__img', { eager: i < 4 }),
          playBadge(),
          wallCaption(item)
        ])
      );
      return;
    }
    if (item.kind === 'radio') {
      mount.append(
        radioButton(classes, `${item.title}: play Xtrata Radio`, item.href, `wall:${item.id}`, [
          image(item.image, item.title, 'home-tile__img', { eager: i < 4 }),
          playBadge(),
          wallCaption(item)
        ])
      );
      return;
    }
    const tile = actionLink(item.href, '', classes, `wall:${item.id}`, { newTab: item.newTab });
    if (item.kind === 'chess') {
      const foot = element('span', 'home-tile__chess-foot');
      foot.append(wallCaption(item), element('span', 'home-tile__cta', `${item.cta} →`));
      tile.append(createChessBoard('home-chess--wall'), foot);
    } else {
      const img = image(item.image, item.title, 'home-tile__img', { eager: i < 4, position: item.position });
      if (item.pixelated) img.classList.add('is-pixelated');
      tile.append(img, wallCaption(item));
      if (item.badge) tile.append(element('span', 'home-tile__badge', item.badge));
    }
    mount.append(tile);
  });
};

// ---------------------------------------------------------------------------
// Music shelf
let musicTab = 'new';
const renderMusic = async () => {
  const tabsMount = document.getElementById('homeMusicTabs');
  const mount = document.getElementById('homeMusicShelf');
  if (!mount) {
    return;
  }
  const { ok, tracks } = await loadCatalogue();
  if (document.documentElement.dataset.page !== 'home') {
    return;
  }
  const source = (ok ? tracks : fallbackTracks()).filter((t) => t.hasArt);
  const draw = () => {
    const list =
      musicTab === 'played' && ok
        ? source.slice().sort((a, b) => b.plays - a.plays || b.id - a.id)
        : source.slice().sort((a, b) => b.id - a.id);
    mount.replaceChildren();
    list.slice(0, HOMEPAGE_MUSIC.limit).forEach((track) => {
      const cover = element('span', 'home-song__cover');
      cover.append(image(track.cover, '', 'home-song__img'), playBadge());
      if (track.plays === 0) cover.append(element('span', 'home-song__new', 'New'));
      // Play counts are used for sorting only; they are not shown on the card.
      const meta = [`#${track.id}`, formatDuration(track.duration)]
        .filter(Boolean)
        .join(' · ');
      const text = element('span', 'home-song__text');
      text.append(
        element('strong', 'home-song__title', track.title),
        element('span', 'home-song__artist', track.artist || 'Unknown artist'),
        element('span', 'home-song__meta', meta)
      );
      mount.append(songButton(track, 'home-song', [cover, text]));
    });
    if (!ok) {
      mount.append(element('p', 'home-note', 'Live play counts could not be loaded just now, so this is a curated list.'));
    }
    syncSongButtons();
    if (tabsMount) {
      [...tabsMount.children].forEach((tab) =>
        tab.setAttribute('aria-selected', tab.dataset.tab === musicTab ? 'true' : 'false')
      );
    }
  };
  if (tabsMount) {
    tabsMount.replaceChildren();
    [['new', 'Newest'], ['played', 'Most played']].forEach(([id, label]) => {
      const tab = element('button', 'home-tab', label);
      tab.type = 'button';
      tab.dataset.tab = id;
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', () => {
        musicTab = id;
        draw();
      });
      tabsMount.append(tab);
    });
    tabsMount.hidden = !ok;
  }
  draw();
};

// ---------------------------------------------------------------------------
// Audionauts
const renderAudionauts = () => {
  const mount = document.getElementById('homeAudionauts');
  if (!mount) {
    return;
  }
  const a = HOMEPAGE_AUDIONAUTS;
  const live = a.status === 'live';
  mount.replaceChildren();
  const copy = element('div', 'home-aud__copy');
  const tags = element('div', 'home-aud__tags');
  tags.append(
    element('span', 'home-aud__pill', live ? 'Minting now' : 'Coming soon'),
    element('span', 'home-aud__kicker', 'New collection on Xtrata')
  );
  const lead = element('p', 'home-aud__lead');
  lead.append(document.createTextNode('A collection built from songs '), element('em', '', 'already on-chain.'));
  const stats = element('div', 'home-aud__stats');
  [
    [String(a.editions), 'editions'],
    ['Now', 'soundtrack on the radio'],
    [live ? 'Now' : a.mintLabel, 'mint opens']
  ].forEach(([value, label]) => {
    const stat = element('div', 'home-aud__stat');
    stat.append(element('strong', '', value), element('span', '', label));
    stats.append(stat);
  });
  const actions = element('div', 'home-aud__actions');
  actions.append(
    live
      ? actionLink(a.mintHref, 'Mint an Audionaut', 'home-btn home-btn--solid', 'audionauts:mint')
      : actionLink(a.alertsHref, 'Get launch alerts', 'home-btn home-btn--solid', 'audionauts:alerts', { newTab: true })
  );
  copy.append(
    tags,
    element('h2', 'home-aud__title', 'AUDIONAUTS'),
    lead,
    element(
      'p',
      'home-aud__body',
      'Each Audionaut carries a real inscribed song, and the soundtrack is already playing on Xtrata Radio.'
    ),
    stats,
    actions
  );
  const media = element('div', 'home-aud__media');
  const cue = element('span', 'home-aud__listen-cue');
  const cueText = element('span', '', 'Play Xtrata Radio');
  cueText.dataset.radioLabel = 'Play Xtrata Radio';
  cue.append(playBadge(), cueText);
  const listen = radioButton('home-aud__listen', 'Audionauts: play Xtrata Radio', a.listenHref, 'audionauts:radio', [
    image(a.poster, 'Audionauts', 'home-aud__poster'),
    cue
  ]);
  media.append(listen);
  const sound = element('div', 'home-aud__sound');
  const covers = element('div', 'home-aud__covers');
  a.soundtrackIds.forEach((id) => {
    covers.append(
      songButton({ id, title: `song #${id}` }, 'home-aud__cover', [image(HOMEPAGE_MUSIC.artworkUrl(id), '', ''), playBadge()])
    );
  });
  sound.append(
    element('span', 'home-aud__kicker', 'The soundtrack is already playable'),
    covers,
    element('span', 'home-aud__credit', a.soundtrackCredit)
  );
  media.append(sound);
  mount.append(copy, media);
};

// ---------------------------------------------------------------------------
// KP Loops
const renderKpLoops = () => {
  const mount = document.getElementById('homeKpLoops');
  if (!mount) {
    return;
  }
  const kp = HOMEPAGE_KP_LOOPS;
  const live = kp.status === 'live';
  mount.replaceChildren();
  const media = actionLink(kp.stationHref, '', 'home-kp__media', 'kp:art');
  media.append(image(kp.image, 'KP Loops by Kieron Pepper', 'home-kp__img'));
  const copy = element('div', 'home-kp__copy');
  const tags = element('div', 'home-kp__tags');
  tags.append(
    element('span', 'home-kp__pill', live ? 'On Xtrata now' : 'Launching on Xtrata'),
    element('span', 'home-kp__kicker', 'Play it today, no wallet')
  );
  const title = element('h2', 'home-kp__title');
  title.append(element('span', 'home-kp__kp', 'KP'), element('span', 'home-kp__loops', 'LOOPS'));
  const lead = element('p', 'home-kp__lead');
  lead.append(
    document.createTextNode('Signature drum loops from Kieron Pepper, former live drummer of The Prodigy. '),
    element('em', '', 'Raw rhythm. Ready for you to play with.')
  );
  const stats = element('div', 'home-kp__stats');
  kp.stats.forEach(([value, label]) => {
    const stat = element('div', 'home-kp__stat');
    stat.append(element('strong', '', value), element('span', '', label));
    stats.append(stat);
  });
  const actions = element('div', 'home-kp__actions');
  actions.append(
    actionLink(kp.stationHref, 'Enter the loop station →', 'home-btn home-btn--solid', 'kp:station'),
    live && kp.collectHref
      ? actionLink(kp.collectHref, 'Collect the loops', 'home-btn home-btn--ghost', 'kp:collect')
      : actionLink(kp.artistHref, 'Meet KP', 'home-btn home-btn--ghost', 'kp:artist')
  );
  copy.append(tags, title, lead, stats, actions);
  mount.append(copy, media);
};

// ---------------------------------------------------------------------------
// Fresh on-chain
let freshFilter = 'all';
const renderFresh = async () => {
  const filtersMount = document.getElementById('homeFreshFilters');
  const mount = document.getElementById('homeFresh');
  if (!mount) {
    return;
  }
  const { ok, tracks } = await loadCatalogue();
  if (document.documentElement.dataset.page !== 'home') {
    return;
  }
  const pinnedIds = new Set(HOMEPAGE_FRESH.pinned.map((item) => item.id));
  const songs = (ok ? tracks : fallbackTracks())
    .filter((t) => t.hasArt && !pinnedIds.has(t.id))
    .sort((a, b) => b.id - a.id)
    .map((t) => ({ id: t.id, kind: 'music', title: t.title, by: t.artist || 'Song', image: t.cover, song: t }));
  const items = [...HOMEPAGE_FRESH.pinned.map((p) => ({ ...p, pinned: true })), ...songs];
  const kindLabel = { music: 'Music', game: 'Game', code: 'Code' };
  const draw = () => {
    mount.replaceChildren();
    items
      .filter((item) => freshFilter === 'all' || item.kind === freshFilter)
      .slice(0, HOMEPAGE_FRESH.size)
      .forEach((item) => {
        const thumb = element('span', `home-fresh__thumb home-kind--${item.kind}`);
        if (item.chess) {
          thumb.append(createChessBoard('home-chess--thumb'));
        } else {
          thumb.append(image(item.image, '', 'home-fresh__img', { position: item.position }));
        }
        thumb.append(element('span', 'home-fresh__kind', kindLabel[item.kind]));
        if (item.pinned) thumb.append(element('span', 'home-fresh__pin', 'Pinned'));
        if (item.song || item.radio) thumb.append(playBadge());
        const text = element('span', 'home-fresh__text');
        text.append(
          element('strong', 'home-fresh__title', item.title),
          element('span', 'home-fresh__by', `#${item.id} · ${item.by}`)
        );
        if (item.song) {
          mount.append(songButton(item.song, 'home-fresh__card', [thumb, text]));
        } else if (item.radio) {
          mount.append(radioButton('home-fresh__card', `${item.title}: play Xtrata Radio`, item.href, `fresh:${item.id}`, [thumb, text]));
        } else {
          const card = actionLink(item.href, '', 'home-fresh__card', `fresh:${item.id}`, {
            newTab: !item.href.startsWith('/xplorer')
          });
          card.append(thumb, text);
          mount.append(card);
        }
      });
    syncSongButtons();
    if (filtersMount) {
      [...filtersMount.children].forEach((chip) =>
        chip.setAttribute('aria-pressed', chip.dataset.filter === freshFilter ? 'true' : 'false')
      );
    }
  };
  if (filtersMount) {
    filtersMount.replaceChildren();
    HOMEPAGE_FRESH.filters.forEach((filter) => {
      const chip = element('button', 'home-chip', filter.label);
      chip.type = 'button';
      chip.dataset.filter = filter.id;
      chip.addEventListener('click', () => {
        freshFilter = filter.id;
        draw();
      });
      filtersMount.append(chip);
    });
  }
  draw();
};

// ---------------------------------------------------------------------------
// Play row, programmes, intents
const renderPlay = () => {
  const mount = document.getElementById('homePlayGrid');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  HOMEPAGE_PLAY.forEach((item) => {
    const card = actionLink(item.href, '', `home-play home-tone--${item.tone}`, `play:${item.id}`, {
      newTab: !item.href.startsWith('/xplorer')
    });
    const media = element('span', 'home-play__media');
    media.append(
      item.kind === 'chess'
        ? createChessBoard('home-chess--card')
        : image(item.image, item.title, 'home-play__img', { position: item.position })
    );
    const body = element('span', 'home-play__body');
    body.append(
      element('span', 'home-play__tag', item.tag),
      element('strong', 'home-play__title', item.title),
      element('span', 'home-play__copy', item.copy)
    );
    card.append(media, body);
    mount.append(card);
  });
};

const renderProgrammes = () => {
  const mount = document.getElementById('homeProgrammes');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  HOMEPAGE_PROGRAMMES.forEach((item) => {
    const card = element('article', `home-prog home-tone--${item.tone}`);
    const media = element('div', 'home-prog__media');
    if (item.image) {
      media.append(image(item.image, item.title, 'home-prog__img'));
    } else if (item.art === 'covers') {
      media.classList.add('home-prog__media--covers');
      HOMEPAGE_MUSIC.fallback
        .slice(0, 3)
        .forEach((song) => media.append(image(HOMEPAGE_MUSIC.artworkUrl(song.id), '', 'home-prog__cover')));
    } else {
      media.classList.add('home-prog__media--soon');
      ['#001', '#002', '#003', '', '', ''].forEach((label) =>
        media.append(element('span', label ? 'home-prog__slot' : 'home-prog__slot home-prog__slot--empty', label))
      );
    }
    const body = element('div', 'home-prog__body');
    const actions = element('div', 'home-prog__actions');
    item.actions.forEach((action) => {
      const cls = `home-btn ${action.primary ? 'home-btn--solid' : 'home-btn--ghost'}`;
      if (action.radio) {
        const button = element('button', cls, action.label);
        button.type = 'button';
        button.dataset.homeAction = `programme:${item.id}:tune-in`;
        button.addEventListener('click', () => {
          const api = radioApi();
          if (!api) {
            window.open(HOMEPAGE_MUSIC.loungeHref, '_blank', 'noopener');
            return;
          }
          if (!api.isOn()) api.switchOn();
        });
        actions.append(button);
      } else {
        actions.append(
          actionLink(action.href, action.label, cls, `programme:${item.id}`, { newTab: !action.href.startsWith('/') })
        );
      }
    });
    body.append(
      element('span', 'home-prog__tag', item.tag),
      element('strong', 'home-prog__title', item.title),
      element('span', 'home-prog__copy', item.copy),
      actions
    );
    card.append(media, body);
    mount.append(card);
  });
};

const renderIntents = () => {
  const mount = document.getElementById('intentGrid');
  if (!mount) {
    return;
  }
  mount.replaceChildren();
  HOMEPAGE_INTENTS.forEach((item) => {
    const card = actionLink(item.href, '', 'intent-card', `intent:${item.id}`);
    card.setAttribute('aria-label', `${item.title}: ${item.description}`);
    card.append(
      element('span', 'intent-card__number', item.number),
      element('strong', 'intent-card__title', item.title),
      element('span', 'intent-card__copy', item.description),
      element('span', 'intent-card__cta', `${item.cta} →`)
    );
    mount.append(card);
  });
};

const installActionTracking = () => {
  if (actionTrackingInstalled) {
    return;
  }
  actionTrackingInstalled = true;
  document.addEventListener('click', (event) => {
    const origin = event.target instanceof Element ? event.target : null;
    const target = origin?.closest('[data-home-action]');
    if (!target) {
      return;
    }
    const detail = {
      action: target.dataset.homeAction,
      href: target instanceof HTMLAnchorElement ? target.href : null,
      page: 'home'
    };
    window.dispatchEvent(new CustomEvent(HOME_ACTION_EVENT, { detail }));
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: 'xtrata_home_action', ...detail });
    }
  });
};

const clearHomepage = () => {
  window.clearInterval(stripTimer);
  stripTimer = null;
  HOME_MOUNT_IDS.forEach((id) => {
    const node = document.getElementById(id);
    if (node) {
      node.replaceChildren();
      delete node.dataset.key;
    }
  });
};

export const initHomepage = () => {
  installActionTracking();
  if (!contentValidated) {
    contentValidated = true;
    const contentErrors = validateHomepageContent();
    if (contentErrors.length > 0) {
      console.warn('[xtrata-homepage] invalid content configuration', contentErrors);
    }
  }
  if (document.documentElement.dataset.page !== 'home') {
    // These mounts contain sandboxed live inscriptions. Removing them when a
    // different SPA page is active prevents hidden third-party frames from
    // issuing requests and polluting that page's browser diagnostics.
    clearHomepage();
    return;
  }
  renderStrip();
  renderWall();
  renderNowPlaying();
  void renderMusic();
  renderAudionauts();
  renderKpLoops();
  void renderFresh();
  renderPlay();
  renderProgrammes();
  renderIntents();
  attachRadio();
};

initHomepage();
const pageModeObserver = new MutationObserver(() => initHomepage());
pageModeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-page']
});
