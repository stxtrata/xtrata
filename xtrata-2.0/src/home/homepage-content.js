// Homepage content. Everything the homepage shows is configured here so a new
// release (a song, a game, a collection) can be featured by editing data, not
// markup. homepage.js renders it; validateHomepageContent() guards the shape.

// One rotating strip under the nav. Replaces the Collections banner and the
// three campaign cards that used to sit above the hero.
// The original Audionauts ordinal (inscription 95768432). Every Audionauts
// "listen" link on the homepage opens it; its music streams from Bitcoin L1.
export const AUDIONAUTS_ORDINAL_HREF = 'https://ordinals.com/inscription/95768432';

// Audionauts mint opens Thursday 1 October 2026 at 19:00 BST (18:00 UTC).
export const AUDIONAUTS_LAUNCH_AT = '2026-10-01T18:00:00Z';
// The Audionauts collection / mint page. Before the launch time the homepage
// links to it as "See the collection" (the page itself shows the mint as paused)
// and keeps the "mints at 7pm" wording; from the launch time it switches itself
// to "Minting now" with a Mint button. Set this to null to hold the link back.
export const AUDIONAUTS_MINT_HREF = 'https://xtrata.xyz/collection/audionauts-1-0';

const PAGE_LOADED_AT = Date.now();
const AUDIONAUTS_MS_TO_LAUNCH = Date.parse(AUDIONAUTS_LAUNCH_AT) - PAGE_LOADED_AT;
const AUDIONAUTS_LIVE = Boolean(AUDIONAUTS_MINT_HREF) && AUDIONAUTS_MS_TO_LAUNCH <= 0;
const AUDIONAUTS_TONIGHT = AUDIONAUTS_MS_TO_LAUNCH > 0 && AUDIONAUTS_MS_TO_LAUNCH < 24 * 60 * 60 * 1000;
const AUDIONAUTS_WHEN = AUDIONAUTS_TONIGHT ? 'tonight, 7pm BST' : 'Thu 1 Oct, 7pm BST';

// The Create. Inscribe. Share. bounty, 1 to 21 October 2026. PDFs live in public/bounty/.
export const HOMEPAGE_BOUNTY = Object.freeze({
  tag: '#XtrataBounty',
  guideHref: '/bounty/xtrata-bounty-at-a-glance.pdf',
  rulesHref: '/bounty/xtrata-bounty-full-rules.pdf',
  telegramHref: 'https://t.me/+DSYbDCWx869hOWY0',
  stats: Object.freeze([
    Object.freeze(['500 STX', 'in prizes']),
    Object.freeze(['19', 'prizes to win']),
    Object.freeze(['Wed 28 Oct', 'winners announced'])
  ]),
  steps: Object.freeze([
    Object.freeze(['Announce', 'Post your wallet on X with #XtrataBounty.']),
    Object.freeze(['Inscribe', 'Make something new on Xtrata. That is your first raffle ticket.']),
    Object.freeze(['Use Xtrata', 'Play, collect, claim and list. Each different action adds a ticket.']),
    Object.freeze(['Share', 'Post your work on X and submit it by 21 October.'])
  ]),
  funding: 'Co-funded 50/50 by Xtrata and Zero Authority DAO.'
});

export const HOMEPAGE_STRIP_SLIDES = Object.freeze([
  Object.freeze({
    id: 'bounty', tag: 'Live', tone: 'lime',
    title: '500 STX bounty: Create. Inscribe. Share.',
    line: 'Open 1 to 21 October. Inscribe something new and share it on X.',
    cta: 'See how to enter', href: '/bounty/xtrata-bounty-at-a-glance.pdf', newTab: true
  }),
  Object.freeze({
    id: 'music-app', tag: 'New', tone: 'violet',
    title: 'Xtrata Music is out for Mac and Windows.',
    line: "Every play pays the song's holder, on-chain.",
    cta: 'Get the app', href: '/music/lounge', newTab: true
  }),
  Object.freeze({
    id: 'chess', tag: 'Play', tone: 'amber',
    title: 'On-Chain Chess is live.',
    line: 'Every move is a Stacks transaction. Casual games are free.',
    cta: 'Play now', href: '/i/3072', newTab: true
  }),
  Object.freeze({
    id: 'astro-blaster', tag: 'New', tone: 'cyan',
    title: 'Astro Blaster 3 is live.',
    line: 'Every top score lives on Bitcoin. Post yours on-chain.',
    cta: 'Play now', href: '/i/3075', newTab: true
  }),
  Object.freeze({
    id: 'kp-loops', tag: 'Play', tone: 'pink',
    title: 'KP Loops by Kieron Pepper.',
    line: "Signature drum loops from The Prodigy's former live drummer. Play them now.",
    cta: 'Enter the loop station', href: '/kp-loops/#kp-loops'
  }),
  Object.freeze(AUDIONAUTS_LIVE
    ? {
        id: 'audionauts', tag: 'Live', tone: 'teal',
        title: 'Audionauts is live.',
        line: '111 helmets, each hiding a star song. Mint yours now.',
        cta: 'Mint an Audionaut', href: AUDIONAUTS_MINT_HREF, newTab: true
      }
    : {
        id: 'audionauts', tag: 'Soon', tone: 'teal',
        title: `Audionauts mints ${AUDIONAUTS_WHEN}.`,
        // Before the mint opens, the banner already opens the (paused) collection page.
        line: AUDIONAUTS_MINT_HREF
          ? 'The collection page is up and the mint opens at 7pm BST. Look around now.'
          : 'Listen to the original Audionauts music, streamed straight from Bitcoin L1.',
        cta: AUDIONAUTS_MINT_HREF ? 'See the collection' : 'Listen on L1',
        href: AUDIONAUTS_MINT_HREF || AUDIONAUTS_ORDINAL_HREF, newTab: true
      }),
  Object.freeze({
    id: 'radio', tag: 'Live', tone: 'lime',
    title: 'Xtrata Radio.',
    line: 'Hear what is on-chain right now, or embed it on your own site.',
    cta: 'Open the Lounge', href: '/music/lounge', newTab: true
  }),
  Object.freeze({
    id: 'forever-twins', tag: 'Live', tone: 'orange',
    title: 'Forever Twins.',
    line: 'Give an existing collection a fully on-chain twin.',
    cta: 'Preserve yours', href: '/forever-twins/'
  })
]);

// The Living Wall beside the hero headline. Order matters: the grid is
// 4 columns x 3 rows on desktop and the spans below fill it exactly.
//   astro blaster: 2x2 (top billing)   chess: 1x2   two songs: 1x1
//   audionauts: 2x1   twins + DYLE: 1x1. Timeloop lives in the Play row.
export const HOMEPAGE_WALL = Object.freeze([
  Object.freeze({
    // Newest headline: the whole 3D arcade hall. Opens full screen in a new tab.
    id: 'xtrata-arcade', kind: 'image', size: 'big', tone: 'arcade',
    eyebrow: 'Brand new · 21 games', title: 'Xtrata Arcade',
    subtitle: 'Walk a neon 3D hall of cabinets, press START, and put your high score on Bitcoin.',
    image: '/home/wall/xtrata-arcade-3081.webp', position: 'center 35%', badge: '#3081', cta: 'Walk in',
    href: '/i/3081', newTab: true
  }),
  Object.freeze({
    id: 'astro-blaster', kind: 'image', size: 'big', tone: 'cyan',
    eyebrow: 'New · play', title: 'Astro Blaster 3', subtitle: 'Every top score lives on Bitcoin.',
    image: '/home/wall/astro-blaster-3075.webp', position: 'center 30%', badge: '#3075',
    href: '/i/3075', newTab: true
  }),
  Object.freeze({
    id: 'chess', kind: 'chess', size: 'tall', tone: 'amber',
    eyebrow: 'Play', title: 'On-Chain Chess', cta: 'Play free',
    href: '/i/3072', newTab: true, tokenId: 3072
  }),
  Object.freeze({
    id: 'song-3062', kind: 'song', tokenId: 3062,
    title: 'Neon Portal Bloom', subtitle: 'BotCupid'
  }),
  Object.freeze({
    id: 'song-3058', kind: 'song', tokenId: 3058,
    title: 'The Judge Is in the House', subtitle: '3ai3'
  }),
  Object.freeze({
    // Live: opens the collection page. Before the mint: the original Audionauts ordinal.
    id: 'audionauts-stream', kind: 'image', size: 'wide', tone: 'teal',
    eyebrow: AUDIONAUTS_LIVE ? 'Minting now' : `Mints ${AUDIONAUTS_WHEN}`, title: 'Audionauts',
    subtitle: AUDIONAUTS_LIVE ? 'Mint yours now →' : 'Listen to the original music, streamed from L1 →',
    image: '/home/wall/audionauts-3059.webp',
    // Once the mint is live every tile and banner goes to the collection page.
    href: AUDIONAUTS_LIVE ? AUDIONAUTS_MINT_HREF : AUDIONAUTS_ORDINAL_HREF, newTab: true, listen: true
  }),
  Object.freeze({
    id: 'forever-twins', kind: 'image', tone: 'orange',
    eyebrow: 'Preserve', title: 'Forever Twins',
    image: '/forever-twins/bitcoin-pepes/pepe-forever-twin.webp',
    href: '/forever-twins/'
  }),
  Object.freeze({
    id: 'dyle-296', kind: 'image', tone: 'pink', pixelated: true,
    eyebrow: 'Collect', title: 'Art by DYLE',
    image: '/i/296', href: '/xplorer?wallet=dyle.btc&sel=296'
  })
]);

// Music shelf. Live data comes from the radio catalogue; the fallback list is
// what shows if that read fails (it is shown as-is, never as "no songs").
export const HOMEPAGE_MUSIC = Object.freeze({
  countsUrl: '/radio/counts?range=all',
  artworkUrl: (id) => `/radio/artwork?id=${encodeURIComponent(id)}`,
  limit: 8,
  loungeHref: '/music/lounge',
  fallback: Object.freeze([
    { id: 3062, title: 'Neon Portal Bloom', artist: 'BotCupid' },
    { id: 3061, title: 'Swamp Pop Riot', artist: 'BotCupid' },
    { id: 3058, title: 'The Judge Is in the House', artist: '3ai3' },
    { id: 3055, title: 'XTRATA 8BAR 21 - Reggaeton Sub Roll 94 (Bass)', artist: 'Audionals' },
    { id: 3036, title: 'One Impresses, One Arrives', artist: '3ai3' },
    { id: 3032, title: 'Les Clés', artist: '3ai3' },
    { id: 2910, title: 'MORE LIKE THIS', artist: 'Audionals' },
    { id: 2892, title: 'A Thousand Small Percentages', artist: 'Audionals' }
  ])
});

// Audionauts teaser. Flip status to 'live' and set mintHref on launch day.
export const HOMEPAGE_AUDIONAUTS = Object.freeze({
  status: AUDIONAUTS_LIVE ? 'live' : 'soon',
  // Mint opens Thursday 1 October 2026 at 19:00 BST.
  mintLabel: AUDIONAUTS_TONIGHT ? 'Tonight 7pm' : 'Thu 7pm BST',
  editions: 111,
  // The original Audionauts ordinal streams its music from Bitcoin L1.
  listenHref: AUDIONAUTS_ORDINAL_HREF,
  // The poster goes to the collection once the mint is live.
  posterHref: AUDIONAUTS_LIVE ? AUDIONAUTS_MINT_HREF : AUDIONAUTS_ORDINAL_HREF,
  posterCue: AUDIONAUTS_LIVE ? 'Mint an Audionaut' : 'Listen to the original music, streamed from L1',
  poster: '/home/wall/audionauts-3059.webp',
  alertsHref: 'https://x.com/XtrataLayers',
  mintHref: AUDIONAUTS_MINT_HREF,
  soundtrackIds: Object.freeze([3062, 3061, 3058, 2910, 2892, 3036]),
  soundtrackCredit: 'Audionals · 3ai3 · BotCupid'
});

// KP Loops feature panel. The loop station plays today with no wallet;
// the collection launches on Xtrata. Set status to 'live' and collectHref on launch.
export const HOMEPAGE_KP_LOOPS = Object.freeze({
  status: 'soon',
  href: '/kp-loops/',
  stationHref: '/kp-loops/#kp-loops',
  artistHref: '/kp-loops/#kp-about',
  collectHref: null,
  image: '/home/kp-loops.webp',
  stats: Object.freeze([
    Object.freeze(['56', 'KP loops']),
    Object.freeze(['14', 'bonus cuts']),
    Object.freeze(['0', 'wallets needed to play'])
  ])
});

// Fresh on-chain. Pinned picks lead; the newest songs from the radio catalogue
// fill in behind them. Receipts, manifests and JS modules never appear here.
export const HOMEPAGE_FRESH = Object.freeze({
  size: 12,
  pinned: Object.freeze([
    { id: 3081, kind: 'game', title: 'Xtrata Arcade', by: '21 games · on-chain scores', image: '/home/wall/xtrata-arcade-3081.webp', position: 'center 35%', href: '/i/3081' },
    { id: 3072, kind: 'game', title: 'X Chess', by: 'HTML game', chess: true, href: '/i/3072' },
    { id: 3075, kind: 'game', title: 'Astro Blaster 3', by: 'On-chain high scores', image: '/home/wall/astro-blaster-3075.webp', position: 'center 30%', href: '/i/3075' },
    { id: 3059, kind: 'code', title: 'AUDIONAUTS', by: AUDIONAUTS_LIVE ? 'Minting now' : 'Original music from L1', image: '/home/wall/audionauts-3059.webp', href: AUDIONAUTS_LIVE ? AUDIONAUTS_MINT_HREF : AUDIONAUTS_ORDINAL_HREF, listen: true },
    { id: 3047, kind: 'game', title: 'Timeloop Detective · Meridian', by: 'HTML game', image: '/home/wall/timeloop-3047.webp', position: 'top', href: '/i/3047' },
    { id: 1107, kind: 'code', title: 'VST late night', by: 'HTML + audio', image: '/home/wall/vst-1107.webp', href: '/xplorer?gallery=jim-music&sel=1107' }
  ]),
  filters: Object.freeze([
    { id: 'all', label: 'All' },
    { id: 'music', label: 'Music' },
    { id: 'game', label: 'Games' },
    { id: 'code', label: 'Code' }
  ]),
  xplorerHref: '/xplorer'
});

export const HOMEPAGE_PLAY = Object.freeze([
  { id: 'chess', kind: 'chess', tag: '#3072 · Chess', title: 'Challenge anyone', copy: 'Play a person on-chain, or the computer for practice. Casual games are free.', href: '/i/3072', tone: 'amber' },
  { id: 'timeloop', image: '/home/wall/timeloop-3047.webp', position: 'top', tag: '#3047 · Mystery', title: 'Solve the Meridian heist', copy: 'One day, fifty million missing, and only you remember. Rewind until you prove it.', href: '/i/3047', tone: 'paper' },
  { id: 'kp-loops', image: '/home/kp-loops.webp', position: 'left center', tag: 'KP Loops · loop station', title: 'Play the KP loop station', copy: "Kieron Pepper's drum loops to layer and play. No wallet needed.", href: '/kp-loops/#kp-loops', tone: 'pink' },
  { id: 'astro-blaster', image: '/home/wall/astro-blaster-3075.webp', position: 'center 30%', tag: '#3075 · Arcade', title: 'Astro Blaster 3', copy: 'Every top score lives on Bitcoin. Set your pilot, beat the Top 10 and post your run on-chain.', href: '/i/3075', tone: 'cyan' },
  { id: 'xtrata-arcade', image: '/home/wall/xtrata-arcade-3081.webp', position: 'center 35%', tag: '#3081 · Arcade', title: 'Xtrata Arcade', copy: 'Walk a 3D hall of 21 cabinets. Every run is recorded and the Top 10 lives on Bitcoin.', href: '/i/3081', tone: 'violet' }
]);

export const HOMEPAGE_PROGRAMMES = Object.freeze([
  { id: 'music-app', tone: 'violet', art: 'covers', tag: 'App · Mac and Windows', title: 'Xtrata Music', copy: "Listen to on-chain songs. Every play pays the song's holder.",
    actions: [{ label: 'Download', href: '/music/lounge', primary: true }, { label: 'Put your music on', href: '/music/' }] },
  { id: 'radio', tone: 'amber', image: '/radio-face.jpg', tag: 'Radio · in your browser', title: 'Xtrata Radio', copy: "Press play and hear what's on-chain. Embed it on your own site too.",
    actions: [{ label: 'Tune in', radio: true, primary: true }, { label: 'Embed', href: '/radio/share' }] },
  { id: 'forever-twins', tone: 'orange', image: '/forever-twins/bitcoin-pepes/pepe-forever-twin.webp', tag: 'Preserve · live', title: 'Forever Twins', copy: 'Give an existing collection a self-contained, fully on-chain twin. Holders keep the link.',
    actions: [{ label: 'Preserve yours', href: '/forever-twins/', primary: true }] },
  { id: 'collections', tone: 'lime', art: 'soon', tag: 'Coming soon', title: 'Xtrata Collections', copy: 'Upload a whole collection, set a price, and let collectors mint each piece.',
    actions: [{ label: 'Follow for launch news', href: 'https://x.com/XtrataLayers' }] }
]);

export const HOMEPAGE_INTENTS = Object.freeze([
  {
    id: 'explore',
    number: '01',
    title: 'Explore',
    description: 'See what exists across art, music, code, collections, and experiments.',
    href: '/xplorer',
    cta: 'Enter the Xplorer'
  },
  {
    id: 'create',
    number: '02',
    title: 'Create',
    description: 'Turn a file, song, artwork, document, or app into an on-chain object.',
    href: '/inscribe',
    cta: 'Create something'
  },
  {
    id: 'claim',
    number: '03',
    title: 'Claim',
    description: 'Collect a sponsored drop without needing STX for the transaction.',
    href: '/drops',
    cta: 'Claim a sponsored drop'
  },
  {
    id: 'collect',
    number: '04',
    title: 'Collect',
    description: 'Discover listed objects and collect with STX, sBTC, or USDCx.',
    href: '/market',
    cta: 'Open the Market'
  },
  {
    id: 'preserve',
    number: '05',
    title: 'Preserve',
    description: 'Bring an existing collection fully on-chain with Forever Twins.',
    href: '/forever-twins/',
    cta: 'Preserve a collection'
  },
  {
    id: 'build',
    number: '06',
    title: 'Build',
    description: 'Use the protocol, SDK, and reconstruction tools in your own application.',
    href: '/#build',
    cta: 'Build with Xtrata'
  }
]);

// The fixed position drawn on the homepage chess board (Italian Game, 5.c3).
// The board is plain DOM squares so the homepage never loads the 365 KB
// X Chess inscription until someone chooses to play.
export const HOMEPAGE_CHESS = Object.freeze({
  fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R',
  lastMove: Object.freeze(['c2', 'c3'])
});

const hasUniqueIds = (items) => {
  const ids = items.map((item) => item.id);
  return ids.length === new Set(ids).size;
};

const isNavigableHref = (href) =>
  typeof href === 'string' && (href.startsWith('/') || href.startsWith('https://'));

export const validateHomepageContent = () => {
  const errors = [];
  const lists = {
    'strip slide': HOMEPAGE_STRIP_SLIDES,
    'wall tile': HOMEPAGE_WALL,
    'play card': HOMEPAGE_PLAY,
    programme: HOMEPAGE_PROGRAMMES,
    intent: HOMEPAGE_INTENTS,
    'fresh pin': HOMEPAGE_FRESH.pinned
  };
  Object.entries(lists).forEach(([name, items]) => {
    if (!hasUniqueIds(items)) {
      errors.push(`Homepage ${name} ids must be unique.`);
    }
  });
  HOMEPAGE_STRIP_SLIDES.forEach((item) => {
    if (!item.title || !item.cta || !isNavigableHref(item.href)) {
      errors.push(`Homepage strip slide ${item.id} is missing required content.`);
    }
  });
  HOMEPAGE_WALL.forEach((item) => {
    if (!item.title) {
      errors.push(`Homepage wall tile ${item.id} needs a title.`);
    }
    if (item.kind === 'song' && !Number.isInteger(item.tokenId)) {
      errors.push(`Homepage wall song ${item.id} needs a numeric tokenId.`);
    }
    if (item.kind !== 'song' && !isNavigableHref(item.href)) {
      errors.push(`Homepage wall tile ${item.id} needs a navigable href.`);
    }
    if ((item.kind === 'image' || item.kind === 'radio') && !item.image) {
      errors.push(`Homepage wall tile ${item.id} needs an image.`);
    }
  });
  [HOMEPAGE_BOUNTY.guideHref, HOMEPAGE_BOUNTY.rulesHref, HOMEPAGE_BOUNTY.telegramHref].forEach((href) => {
    if (!isNavigableHref(href)) {
      errors.push('Homepage bounty links must be navigable.');
    }
  });
  HOMEPAGE_FRESH.pinned.forEach((item) => {
    if (!item.title || !isNavigableHref(item.href) || (!item.image && !item.chess)) {
      errors.push(`Homepage fresh pin ${item.id} is missing required content.`);
    }
  });
  [...HOMEPAGE_PLAY, ...HOMEPAGE_INTENTS].forEach((item) => {
    if (!item.title || !isNavigableHref(item.href)) {
      errors.push(`Homepage item ${item.id} is missing required content.`);
    }
  });
  HOMEPAGE_PROGRAMMES.forEach((item) => {
    const actionsOk = item.actions.every((action) => action.radio || isNavigableHref(action.href));
    if (!item.title || !item.actions.length || !actionsOk) {
      errors.push(`Homepage programme ${item.id} is missing required content.`);
    }
  });
  if (!isNavigableHref(HOMEPAGE_KP_LOOPS.stationHref) || (HOMEPAGE_KP_LOOPS.status === 'live' && !isNavigableHref(HOMEPAGE_KP_LOOPS.collectHref))) {
    errors.push('KP Loops needs a station link, and a collect link once live.');
  }
  if (HOMEPAGE_AUDIONAUTS.status === 'live' && !isNavigableHref(HOMEPAGE_AUDIONAUTS.mintHref)) {
    errors.push('Audionauts is live but has no mint link.');
  }
  return errors;
};
