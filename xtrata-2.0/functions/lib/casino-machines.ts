/**
 * Which fruit machines the casino knows about, in one place for the room service, the round log and the progress rules.
 *
 * CORE_MACHINES are the five that have always stood on the floor of /casino. Their short ids ('drop', 'twins', 'ds', 'bf', 'nv')
 * are what the daily missions, the slot tournament rotation and the Slot fan badge are built from, so that list must not grow:
 * a longer list would change which machine the tournament picks each day and make the badge nearly impossible to earn.
 *
 * ROTATION_MACHINES are the ParallaX series machines in public/casino-machines/<id>/. Any of them can be put on the floor by
 * editing `floor` in public/casino/machine-rotation.js, so the room service accepts all of them all the time: a spin on any of
 * them is logged, feeds the shared progressive jackpot and can win it, whichever five are on the floor today. For these the
 * short id is simply the folder name, which is also the game id inside the pack, so nothing needs mapping.
 */
export const CORE_MACHINES = ['drop', 'twins', 'ds', 'bf', 'nv'] as const;

export const ROTATION_MACHINES = [
  'ordinal-rush', 'snow-crash', 'genesis-21', 'the-archive', 'plebs-legends', 'robot-factory', 'monkey-hash', 'nine-lives',
  'degen-city', 'the-stack', 'who-is-satoshi', 'rare-pepe-directory', 'rune-pit', 'xtrata-originals', 'the-halving', 'mooneeb',
  'club-x', 'rugged', 'sat-hunter', 'mempool-madness', 'corgi-kennel', 'launchpad', 'pool-party', 'dog-army', 'hot-wallet'
] as const;

/** Every machine the room service accepts spins from. */
export const ALL_MACHINES = [...CORE_MACHINES, ...ROTATION_MACHINES] as const;
export type AnyMachine = (typeof ALL_MACHINES)[number];

const ALL_SET = new Set<string>(ALL_MACHINES);
export const isAnyMachine = (v: unknown): v is AnyMachine => typeof v === 'string' && ALL_SET.has(v);
