/**
 * Inscriptions on a cube character's screens (docs/plans/CASINO-CHARACTER-PLAN.md, "Programmable screens").
 *
 * A cube has six screens, and a player may put an Xtrata inscription they hold on any of them. On the front it takes the place
 * of the face (a reaction still shows there for a moment). What the room keeps and passes on is one short string, at most
 * SCREENS_MAX characters:
 *
 *     <face><token id>[,<face><token id>...]        for example "b12,l340,t7"
 *
 *   face   f front · b back · l left · r right · t top · u under        each at most once, in that order
 *   id     the inscription's token id on SCREENS_CONTRACT (the newest Xtrata core on MAINNET); ids start at 0
 *
 * Who may show what: only the holder. The casino's identity is a testnet address and inscriptions live on mainnet; a wallet has
 * the same key on both, so the holder that counts is the mainnet twin of the signed-in address (as for the Salon's BNS name).
 * The check is made by the Pages Function POST /casino/room/screens (functions/lib/casino-room-screens.ts), which reads
 * `get-owner` from the chain and only then tells the room. The room itself never reads the chain and never sees a picture:
 * pages fetch the pictures themselves, from this site's own thumbnail and content endpoints.
 *
 * This file is the pure part (the string and the contract), shared by the room, the Pages Function and the room client. The
 * page's plain script public/casino/cube-avatars.js has its own copy of the pattern; casino-screens.test.ts checks they agree.
 */
import registry from '../../src/data/contract-registry.json';

export const SCREEN_FACES = ['f', 'b', 'l', 'r', 't', 'u'] as const;
export type ScreenFace = (typeof SCREEN_FACES)[number];
export const SCREENS_PATTERN = /^[fblrtu](?:0|[1-9]\d{0,8})(?:,[fblrtu](?:0|[1-9]\d{0,8})){0,5}$/;
export const SCREENS_MAX = 65;
/** The room's feature name: a page only offers inscriptions to a room that lists it. */
export const SCREENS_FEATURE = 'screens';
/**
 * How long the room shows screens without a fresh check. The holder's own page asks for the check again once a day while they
 * play; a player whose page never does (or who sold the inscription and stayed away) loses the screens after this long.
 */
export const SCREENS_KEEP_MS = 7 * 24 * 60 * 60 * 1000;

type RegistryEntry = { address: string; contractName: string; network: string };
/** The one contract inscriptions are shown from: the newest mainnet core in the registry (CLAUDE.md, "newest only"). */
export const SCREENS_CONTRACT = ((registry as RegistryEntry[]).filter((e) => e.network === 'mainnet').map((e) => `${e.address}.${e.contractName}`).pop()) || '';
/** The NFT's asset name on the core contract (what a holdings lookup filters by). */
export const SCREENS_ASSET = 'xtrata-inscription';

export type Screens = Partial<Record<ScreenFace, number>>;

/** "b12,l340" as { b: 12, l: 340 }; "" (or nothing) as {}; null when it is not a screens string or names a face twice. */
export const parseScreens = (value: unknown): Screens | null => {
  if (value === null || value === undefined || value === '') return {};
  if (typeof value !== 'string' || value.length > SCREENS_MAX || !SCREENS_PATTERN.test(value)) return null;
  const out: Screens = {};
  for (const part of value.split(',')) {
    const face = part[0] as ScreenFace;
    if (out[face] !== undefined) return null;
    out[face] = Number(part.slice(1));
  }
  return out;
};

/** The one way to write a set of screens (faces in SCREEN_FACES order); "" for none. */
export const encodeScreens = (screens: Screens): string =>
  SCREEN_FACES.filter((f) => Number.isSafeInteger(screens[f]) && (screens[f] as number) >= 0).map((f) => `${f}${screens[f]}`).join(',');

/** A screens string in its one canonical form, "" for none, or null when it is not one. */
export const normalizeScreens = (value: unknown): string | null => {
  const parsed = parseScreens(value);
  if (!parsed) return null;
  const text = encodeScreens(parsed);
  return text.length <= SCREENS_MAX ? text : null;
};

/** The token ids in a set of screens, each once. */
export const screenIds = (screens: Screens): number[] => [...new Set(SCREEN_FACES.map((f) => screens[f]).filter((n): n is number => typeof n === 'number'))];
