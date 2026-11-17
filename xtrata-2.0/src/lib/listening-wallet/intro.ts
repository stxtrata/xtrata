/**
 * The intro song: the one song a brand-new player from the giveaway wall starts on while it is being claimed, so a
 * newcomer hears music within seconds instead of a minute's wait for their plays to land. It plays ONCE, as part of
 * claiming; a player never starts a song by itself on a later visit. The play is paid like any other: it waits in the
 * player's queue and is paid the moment the plays land.
 *
 * The operator changes it with one command and no redeploy (docs/radio/GIVEAWAY.md, action `intro`); this is only
 * what is used until they do.
 */
export const DEFAULT_INTRO_SONG = 317; // "Entertainment" by melophonic
export const isSongId = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 1 && v <= 999_999_999;
/** How long the intro may stand in for the player's own plays: a claim that takes longer than this has gone wrong. */
export const INTRO_MAX_MS = 15 * 60_000;
