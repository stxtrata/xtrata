/**
 * A player's character in the casino room (docs/plans/CASINO-CHARACTER-PLAN.md): which body they are seen as and how it is finished.
 *
 * The whole look is one short code, at most LOOK_MAX characters, so it is cheap to keep on a connection, to store in the player's
 * profile and to send to everyone in the room:
 *
 *     <body><frame><finish><face><gait>-<accent>[-<frame colour>]        for example "h000n-4ed5bd"
 *
 *   body     p  the human figure every player had before (the default; a player with no code is drawn this way)
 *            h  the humanoid cube (cube head, neck, torso, arms and legs)
 *            f  the floating cube (the cube alone, hovering)
 *   frame    0-7  one of the cube lab's material presets, in LOOK_FRAMES order; x  a colour of the player's own (the last part)
 *   finish   0-5  the screens' finish, in LOOK_FINISHES order
 *   face     0-5  what the front screen shows, in LOOK_FACES order
 *   gait     n  natural   s  swagger   t  tipsy
 *   accent   six lower-case hex digits: the colour of the screens' graphics and the body's lights
 *
 * The page draws a look with public/casino/cube-avatars.js, which has its own copy of these lists and the same pattern
 * (functions/lib/__tests__/casino-look.test.ts checks the two agree). The room never draws anything: it only checks the code is
 * well formed, so nothing but these few characters can reach other players' pages.
 */
export const LOOK_BODIES = ['p', 'h', 'f'] as const;
export const LOOK_FRAMES = ['porcelain', 'titanium', 'obsidian', 'copper', 'carbon', 'walnut', 'mint', 'cobalt'] as const;
export const LOOK_FINISHES = ['glass', 'satin', 'matte', 'frosted', 'smoked', 'crt'] as const;
export const LOOK_FACES = ['happy', 'calm', 'wink', 'wow', 'cool', 'focus'] as const;
export const LOOK_GAITS = ['n', 's', 't'] as const;
export const LOOK_MAX = 19;
export const LOOK_PATTERN = /^[phf](?:[0-7][0-5][0-5][nst]-[0-9a-f]{6}|x[0-5][0-5][nst]-[0-9a-f]{6}-[0-9a-f]{6})$/;

/** The room's feature name: a client only sends a look to a room that lists it. */
export const LOOK_FEATURE = 'look';
/** A player may change their look this often (they try things in the mirror first; only Save is sent). */
export const LOOK_MIN_GAP_MS = 1_500;
export const LOOK_PER_MINUTE = 12;

/** A well-formed look code, or null. */
export const parseLook = (value: unknown): string | null =>
  typeof value === 'string' && value.length <= LOOK_MAX && LOOK_PATTERN.test(value) ? value : null;

/** Whether a code shows the player as one of the cubes (the human figure needs no code at all). */
export const isCubeLook = (code: string | null | undefined): boolean => !!code && code[0] !== 'p';

export type LookMessage = { t: 'look'; v: string | null };
/** `{ t: 'look', v }` from a page: a code, or null to go back to the human figure. Codes start with "look-" on refusal. */
export const parseLookMessage = (value: any): { ok: true; msg: LookMessage } | { ok: false; code: string } => {
  if (value?.v === null || value?.v === undefined || value?.v === '') return { ok: true, msg: { t: 'look', v: null } };
  const code = parseLook(value.v);
  if (!code) return { ok: false, code: 'look-bad' };
  // The human figure is the default and has nothing to finish, so it is kept as "no code".
  return { ok: true, msg: { t: 'look', v: code[0] === 'p' ? null : code } };
};
