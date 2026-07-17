// Pure data/configuration constants for the Xtrata homepage.
// Extracted verbatim from the former index.html inline script.
import { FOREVER_TWIN_COLLECTIONS } from '/src/lib/twins/registry.ts';

export const XTRATA_BRAND_MARK_URL = '/favicon.svg';

export const THEME_STORAGE_KEY = 'xtrata.simple-homepage.theme';

export const OPUS_HTML_HANDOFF_KEY = 'xtrata.opusHtmlPlayer.pendingInscription';

export const OPUS_HTML_HANDOFF_DB = 'xtrata-opus-html-handoff';

export const OPUS_HTML_HANDOFF_STORE = 'pending';

export const THEME_IDS = new Set(['classic', 'terminal', 'midnight', 'neon', 'monochrome', 'obsidian', 'ember', 'ultraviolet', 'arctic', 'ruby']);

export const CURATED_GALLERIES = [

      {
        id: 'jim-music',
        title: 'music',
        htmlFirst: true,
        tokenIds: [1107n, 1105n, 1101n, 1099n, 1097n, 1091n, 1065n, 1050n, 1048n, 785n, 577n]
      },
      {
        id: 'code-various',
        title: 'code',
        tokenIds: [287n, 17n, 19n, 41n, 43n, 44n, 55n, 73n, 151n, 153n]
      },
      {
        id: 'agent-27',
        title: 'Agent 27',
        tokenIds: [ 107n, 112n, 121n, 123n, 128n, 135n,137n, 152n, 161n, 162n, 163n, 175n, 188n, 194n, 196n, 200n, 213n]
      },
      {
        id: 'v1-origins',
        title: 'v1 origins',
        // Read strictly from the original core, xtrata-v1-1-1.
        contractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1',
        tokenIds: [1n, 3n, 4n, 5n, 6n, 7n, 9n, 10n, 11n, 14n, 18n, 19n, 24n]
      },
      {
        id: 'stacksboard',
        title: 'Stacksboard',
        tokenIds: [394n]
      }
    ];

export const EXAMPLE_VIEW_DESCRIPTIONS = Object.freeze({
  'dyle.btc': {
    label: 'Art by DYLE',
    heading: 'Viewing Art by DYLE',
    tooltip: 'Early Stacks-native art inscriptions by DYLE.',
    description:
      'A very early Stacks art collection by OG artist DYLE, inscribed through Xtrata as permanent on-chain media.'
  },


  'jim-music': {
    label: 'Music by Various',
    heading: 'Viewing Music by Various',
    tooltip: 'Early on-chain music, audio, samples, stems, and songs.',
    description:
      'Full-resolution audio can live here: songs, samples, stems, albums, anthologies, and other permanent music records.'
  },

  'code-various': {
    label: 'Code by Various',
    heading: 'Viewing Code by Various',
    tooltip: 'Early code inscriptions and recursive Web3 experiments.',
    description:
      'Code, apps, recursion, and rich media can all be inscribed as durable Web3 building blocks on Stacks, secured by Bitcoin.'
  },

  'agent-27': {
    label: 'Agent 27',
    heading: 'Viewing Agent 27',
    tooltip: 'Early autonomous agent memory inscriptions.',
    description:
      'An early on-chain agent memory test, where an automated agent used a wallet to inscribe its thoughts over time.'
  },

  'v1-origins': {
    label: 'v1 origins',
    heading: 'Viewing v1 origins',
    tooltip: 'The original Xtrata core, xtrata-v1-1-1.',
    description:
      'The earliest inscriptions on the original Xtrata core (xtrata-v1-1-1), still live and readable on-chain.'
  },

  'stacksboard': {
    label: 'Stacksboard',
    heading: 'Viewing Stacksboard',
    tooltip: 'The Stacksboard inscription (#350).',
    description:
      'A single featured inscription: Stacksboard, recorded on-chain through Xtrata as #350.'
  },

  latest: {
    label: 'Latest',
    heading: 'Viewing latest inscriptions',
    tooltip: 'Newest inscriptions from the active Xtrata core.',
    description:
      'The newest page of inscriptions from the active Xtrata core.'
  }
});

export const WALLET_PAGE_SIZE = 16;

export const WALLET_FALLBACK_SCAN_LIMIT = 2000;

export const MAX_GRID_EAGER_FULL_LOAD_BYTES = 10n * 1024n * 1024n;

export const GRID_THUMBNAIL_HYDRATION_CONCURRENCY = 2;

// Max number of HTML inscription iframes allowed to execute simultaneously
// in the grid. Sized to a full visible grid page so the whole 4x4 page can
// render at once without per-tile clicking — off-screen tiles are torn down
// by the IntersectionObserver, so concurrency stays bounded to ~one page as
// the user scrolls. Tiles still beyond this budget show a static poster
// until a slot frees or the user clicks them. Boards that complete the embed
// handshake (phase two) are exempt — they self-throttle in the trusted lane.
export const MAX_LIVE_HTML_FRAMES = WALLET_PAGE_SIZE;

export const GRID_SUMMARY_CACHE_MAX_SCOPES = 12;

export const GRID_SUMMARY_CACHE_MAX_ENTRIES = 512;

export const EXPLORER_FILTER_INDEX_CHUNK_SIZE = 48;

export const CONNECTED_LEDGER_MODE_STORAGE_PREFIX = 'xtrata.simple-homepage.connected-ledger-mode';

// Forever Twin registry: derived from the single source of truth in
// src/lib/twins/registry.ts (FOREVER_TWIN_COLLECTIONS). Add collections
// there; only add a label override here if the default "<itemNoun> holder"
// isn't wanted.
export const TWIN_HOLDER_LABELS = {
  'bitcoin-pepes': 'Pepe holder',
  'leo-cats': 'LeoCat holder',
  'miami-degens': 'Miami Degen holder'
};

export const PEPE_ESCROW_RESOLVERS = new Map(
  FOREVER_TWIN_COLLECTIONS.map((collection) => [
    collection.helperContractId,
    {
      helperContractId: collection.helperContractId,
      sourceContractId: collection.sourceContractId,
      sourceAssetName: collection.sourceAssetName,
      collectionName: collection.name,
      itemNoun: collection.itemNoun,
      label: TWIN_HOLDER_LABELS[collection.key] ?? `${collection.itemNoun} holder`
    }
  ])
);

export const GRID_MIME_LABELS = new Map([
  ['text/plain', 'PLAIN TEXT'],
  ['text/javascript', 'JAVASCRIPT'],
  ['application/javascript', 'JAVASCRIPT'],
  ['application/ecmascript', 'JAVASCRIPT'],
  ['text/ecmascript', 'JAVASCRIPT'],
  ['application/json', 'JSON'],
  ['text/json', 'JSON'],
  ['text/css', 'CSS'],
  ['text/markdown', 'MARKDOWN'],
  ['text/csv', 'CSV'],
  ['application/xml', 'XML'],
  ['text/xml', 'XML'],
  ['application/yaml', 'YAML'],
  ['text/yaml', 'YAML']
]);

export const EXPLORER_CODE_MIME_TYPES = new Set([
  'application/ecmascript',
  'application/javascript',
  'application/json',
  'application/typescript',
  'application/xml',
  'application/yaml',
  'text/css',
  'text/ecmascript',
  'text/javascript',
  'text/json',
  'text/typescript',
  'text/xml',
  'text/yaml'
]);

export const EXPLORER_FILTER_LABELS = Object.freeze({
  image: 'Images',
  html: 'HTML',
  video: 'Video',
  audio: 'Audio',
  text: 'Text',
  code: 'Code',
  document: 'Docs',
  other: 'Other'
});
