export const HOMEPAGE_CAMPAIGN_BANNERS = Object.freeze([
  Object.freeze({
    id: 'proof-zero',
    status: 'live',
    eyebrow: 'Live bounty · 200 STX prize pool',
    title: 'Inscribe your first masterpiece',
    description: 'Create original work, put it fully on-chain, and enter to become one of four winners.',
    stat: '200',
    statLabel: 'STX',
    href: '/masterpiece',
    cta: 'Enter the bounty',
    tone: 'proof-zero'
  }),
  Object.freeze({
    id: 'forever-twins',
    status: 'live',
    eyebrow: 'On-chain legacy',
    title: 'Forever Twins',
    description: 'Give an existing collectible a permanent, self-contained on-chain counterpart.',
    artwork: '/forever-twins/assets/forever-twins-logo.webp',
    href: '/forever-twins/',
    cta: 'Preserve yours',
    tone: 'twins'
  }),
  Object.freeze({
    id: 'suno-more',
    status: 'live',
    eyebrow: 'AI music permanence',
    title: 'Suno More',
    description: 'Inscribe the master, preserve attribution, and connect editions and remixes.',
    artwork: '/suno-more/assets/suno-more-logo.webp',
    href: '/wizard/suno',
    cta: 'Inscribe a song',
    tone: 'suno'
  })
]);

export const HOMEPAGE_OBJECTS = Object.freeze([
  {
    id: 'music-history',
    eyebrow: 'Listen',
    title: 'Music that carries its own history',
    description:
      'Play a working on-chain music object, then follow the wider collection of songs, tools, credits, and experiments around it.',
    href: '/xplorer?gallery=jim-music&sel=1107',
    cta: 'Open the music gallery',
    accent: 'violet',
    preview: {
      type: 'iframe',
      src: 'https://xtrata.xyz/i/1107',
      title: 'Interactive on-chain music inscription #1107',
      label: 'HTML + audio · inscription #1107'
    }
  },
  {
    id: 'travelling-art',
    eyebrow: 'Collect',
    title: 'Art that can travel',
    description:
      'A creation can move between wallets, galleries, marketplaces, and applications while keeping its on-chain identity.',
    href: '/xplorer?wallet=dyle.btc&sel=296',
    cta: 'Explore art by DYLE',
    accent: 'coral',
    preview: {
      type: 'image',
      src: 'https://xtrata.xyz/i/296',
      title: 'On-chain visual artwork inscription #296',
      label: 'Image · inscription #296'
    }
  },
  {
    id: 'living-app',
    eyebrow: 'Use',
    title: 'Apps that live on-chain',
    description:
      'Open a functioning HTML inscription rather than a screenshot. The object is both the work and the software that runs it.',
    href: '/xplorer?gallery=stacksboard&sel=394',
    cta: 'Open Stacksboard',
    accent: 'cyan',
    preview: {
      type: 'iframe',
      src: 'https://xtrata.xyz/i/394',
      title: 'Interactive Stacksboard inscription #394',
      label: 'HTML app · inscription #394'
    }
  },
  {
    id: 'free-drops',
    eyebrow: 'Claim',
    title: 'Sponsored drops anyone can claim',
    description:
      'Creators prepay the network fee. A collector only needs a Stacks wallet—no STX is required for sponsored claims.',
    href: '/drops',
    cta: 'See live drops',
    accent: 'lime',
    preview: {
      type: 'claim',
      title: 'Sponsored Xtrata claim receipt',
      label: 'Xtrata Drops · sponsored claim'
    }
  },
  {
    id: 'forever-twins',
    eyebrow: 'Preserve',
    title: 'Collections rescued from dependencies',
    description:
      'Forever Twins make an existing collectible self-contained while preserving its collection identity and holder relationship.',
    href: '/forever-twins/',
    cta: 'Meet Forever Twins',
    accent: 'amber',
    preview: {
      type: 'image',
      src: '/forever-twins/bitcoin-pepes/pepe-forever-twin.webp',
      title: 'Bitcoin Pepe Forever Twin',
      label: 'Forever Twin · live collection'
    }
  },
  {
    id: 'playable-code',
    eyebrow: 'Build with',
    title: 'Objects that become playable',
    description:
      'Code inscriptions can become game pieces, instruments, interfaces, or reusable components inside another experience.',
    href: '/xplorer?gallery=code-various&sel=287',
    cta: 'Explore on-chain code',
    accent: 'blue',
    preview: {
      type: 'iframe',
      src: 'https://xtrata.xyz/i/287',
      title: 'Interactive code inscription #287',
      label: 'HTML code · inscription #287'
    }
  }
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

export const HOMEPAGE_ACTIVITY_DOORS = Object.freeze([
  {
    id: 'created',
    verb: 'Recently created',
    description: 'Newest objects from the active Xtrata core',
    href: '/xplorer'
  },
  {
    id: 'claiming',
    verb: 'Sponsored claims',
    description: 'Creator-funded drops with zero-STX claim support',
    href: '/drops'
  },
  {
    id: 'collecting',
    verb: 'Now collecting',
    description: 'Live STX, sBTC, and USDCx listings',
    href: '/market'
  },
  {
    id: 'connecting',
    verb: 'Connected works',
    description: 'Parents, dependencies, and recursive objects',
    href: '/xplorer?gallery=code-various'
  }
]);

export const HOMEPAGE_CAMPAIGN = Object.freeze({
  id: 'proof-zero-2026',
  status: 'live',
  eyebrow: 'Live bounty · Xtrata × Zero Authority DAO',
  title: 'Inscribe your first masterpiece.',
  description:
    'Create an original song, artwork, photograph, poem, animation or film. Put it fully on-chain through Xtrata and enter to win part of 200 STX. Four winners. No theme. Permanent by design.',
  stat: '200',
  statLabel: 'STX · prize pool',
  primaryAction: {
    label: 'Enter the bounty',
    href: '/masterpiece'
  },
  secondaryAction: {
    label: 'Start inscribing',
    href: '/wizard/'
  },
  startDate: null,
  endDate: null,
  featuredInscriptions: [],
  sponsor: null
});

const hasUniqueIds = (items) => {
  const ids = items.map((item) => item.id);
  return ids.length === new Set(ids).size;
};

const isNavigableHref = (href) =>
  typeof href === 'string' && (href.startsWith('/') || href.startsWith('https://'));

export const validateHomepageContent = () => {
  const errors = [];
  if (!hasUniqueIds(HOMEPAGE_CAMPAIGN_BANNERS)) {
    errors.push('Homepage campaign banner ids must be unique.');
  }
  if (!hasUniqueIds(HOMEPAGE_OBJECTS)) {
    errors.push('Homepage object ids must be unique.');
  }
  if (!hasUniqueIds(HOMEPAGE_INTENTS)) {
    errors.push('Homepage intent ids must be unique.');
  }
  if (!hasUniqueIds(HOMEPAGE_ACTIVITY_DOORS)) {
    errors.push('Homepage activity ids must be unique.');
  }
  HOMEPAGE_CAMPAIGN_BANNERS.forEach((item) => {
    if (
      !item.title ||
      !item.description ||
      (!item.artwork && !item.stat) ||
      !isNavigableHref(item.href)
    ) {
      errors.push(`Homepage campaign banner ${item.id} is missing required content.`);
    }
  });
  HOMEPAGE_OBJECTS.forEach((item) => {
    if (!item.title || !item.description || !isNavigableHref(item.href)) {
      errors.push(`Homepage object ${item.id} is missing required content.`);
    }
    if (!item.preview?.type || !item.preview?.title || !item.preview?.label) {
      errors.push(`Homepage object ${item.id} is missing preview metadata.`);
    }
  });
  HOMEPAGE_INTENTS.forEach((item) => {
    if (!item.title || !item.description || !isNavigableHref(item.href)) {
      errors.push(`Homepage intent ${item.id} is missing required content.`);
    }
  });
  if (
    !HOMEPAGE_CAMPAIGN.id ||
    !HOMEPAGE_CAMPAIGN.title ||
    !isNavigableHref(HOMEPAGE_CAMPAIGN.primaryAction?.href)
  ) {
    errors.push('Homepage campaign is missing required content.');
  }
  return errors;
};
