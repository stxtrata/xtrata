/**
 * Which fruit machines the casino knows about, in one place for the room service, the round log and the progress rules.
 *
 * CORE_MACHINES are the five that were built into the page of /casino ('drop', 'twins', 'ds', 'bf', 'nv').
 *
 * FLOOR_MACHINES are the five the daily "Spin <machine> 20 times" missions, the daily slot tournament and the Slot fan badge are built
 * from: the five that stand on the standard floor (`floor` in public/casino/machine-rotation.js). Until 2026-11-12 those three
 * were built from CORE_MACHINES whichever five stood on the floor, so after the floor changed (2026-11-05) four of the five missions
 * could not be completed, the tournament was held on machines nobody could reach and the badge could not be earned. The list must
 * stay FIVE long (a longer list would change how often each machine has the tournament and make the badge much harder), and a
 * machine that stays on the floor keeps its PLACE in the list when the floor is rotated, so its missions and its tournament days do
 * not move. functions/lib/__tests__/casino-machines.test.ts fails when this list and the rotation file's floor are different sets:
 * change both together, then redeploy the room Worker.
 *
 * ROTATION_MACHINES are the ParallaX series machines in public/casino-machines/<id>/. Any of them can be put on the floor by
 * editing `floor` in public/casino/machine-rotation.js, so the room service accepts all of them all the time: a spin on any of
 * them is logged, feeds the shared progressive jackpot and can win it, whichever five are on the floor today. For these the
 * short id is simply the folder name, which is also the game id inside the pack, so nothing needs mapping.
 */
export const CORE_MACHINES = ['drop', 'twins', 'ds', 'bf', 'nv'] as const;

/** The standard floor (see above). Forever Twins keeps the place it had in the old list. */
export const FLOOR_MACHINES = ['who-is-satoshi', 'twins', 'hot-wallet', 'snow-crash', 'ordinal-rush'] as const;

/** What a machine is called in a mission or a tournament notice. A machine without an entry is named from its id ("rune-pit" -> "Rune Pit"). */
const MACHINE_NAMES: Record<string, string> = {
  drop: 'The Drop', twins: 'Forever Twins', ds: 'Deep Strata', bf: 'Block Fortune', nv: 'Neon Vault',
  'who-is-satoshi': 'Who Is Satoshi?', 'hot-wallet': 'Hot Wallet', 'snow-crash': 'Snow Crash', 'ordinal-rush': 'Ordinal Rush'
};
export const machineName = (id: string): string =>
  MACHINE_NAMES[id] || id.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');

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
