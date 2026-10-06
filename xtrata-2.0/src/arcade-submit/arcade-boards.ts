// The 26 Xtrata Arcade leaderboards (inscription #3076) on xtrata-arcade-scores-v2.
// Pure data, no engine: shared by the /arcade/submit page and the viewer's submit dialog.
// Game order is the arcade's replay GAME_IDS order (header byte 40): never reorder, only append.
export const ARCADE_GAME = 'xtrata-arcade';
export const XA_GAME_IDS = ['xa_block_defence', 'xa_block_drop', 'xa_block_runner', 'xa_brick_breaker', 'xa_bubble_pop', 'xa_cave_diver',
  'xa_helix_drop', 'xa_invader_wave', 'xa_lunar_lander', 'xa_maze_muncher', 'xa_merge_2048', 'xa_mine_sprint', 'xa_neon_snake',
  'xa_orbit_merge', 'xa_pong_streak', 'xa_reflex_tap', 'xa_road_hopper', 'xa_rock_drift', 'xa_stack_tower', 'xa_swerve', 'xa_tile_tap'] as const;

const TITLES: Record<string, string> = {
  xa_neon_snake: 'SnakeByte Taproot', xa_block_drop: 'Chainfall', xa_cave_diver: 'Deep Node Diver', xa_orbit_merge: 'Sat Galaxy',
  xa_block_runner: 'Neon Nonce', xa_brick_breaker: 'Block Breaker', xa_rock_drift: 'Nakamoto Drift', xa_stack_tower: 'Block Height',
  xa_road_hopper: 'Crosschain Hopper', xa_tile_tap: 'BlockBeat', xa_merge_2048: 'Merkle Match', xa_block_defence: 'Chain Sentinel',
  xa_maze_muncher: 'Sat Hunter', xa_invader_wave: 'Hashstorm', xa_helix_drop: 'Hash Helix', xa_bubble_pop: 'Fee Bubble',
  xa_swerve: 'Mempool Velocity', xa_lunar_lander: 'Satoshi One', xa_reflex_tap: 'Hash at High Noon', xa_mine_sprint: 'Proof of Ore',
  xa_pong_streak: 'Bit Pong'
};
// Timed variants: variant index 1 of the game (header byte 41), lower time wins.
const VARIANTS: Record<string, { key: string; label: string }> = {
  xa_block_drop: { key: 'sprint', label: 'Sprint 40' },
  xa_merge_2048: { key: 'race', label: 'Race to 512' },
  xa_mine_sprint: { key: 'classic', label: 'Classic' },
  xa_reflex_tap: { key: 'hit50', label: 'Hit 50' },
  xa_tile_tap: { key: 'rush', label: 'Rush 100' }
};

export type ArcadeBoard = { board: string; gameIdx: number; variantIdx: number; time: boolean; label: string };

export const ARCADE_BOARDS: Record<string, ArcadeBoard> = (() => {
  const out: Record<string, ArcadeBoard> = {};
  XA_GAME_IDS.forEach((id, gameIdx) => {
    out[id] = { board: id, gameIdx, variantIdx: 0, time: false, label: TITLES[id] };
    const v = VARIANTS[id];
    if (v) out[`${id}_${v.key}`] = { board: `${id}_${v.key}`, gameIdx, variantIdx: 1, time: true, label: `${TITLES[id]} · ${v.label}` };
  });
  return out;
})();

export const isArcadeBoard = (b: unknown): b is string => typeof b === 'string' && Object.prototype.hasOwnProperty.call(ARCADE_BOARDS, b);

/** Time boards store centiseconds. */
export function formatArcadeScore(board: string, score: number): string {
  if (!ARCADE_BOARDS[board]?.time) return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const m = Math.floor(score / 6000), s = Math.floor((score % 6000) / 100), c = score % 100;
  return `${m}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`;
}

export const ARCADE_SCORES_CONTRACT_ID = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-arcade-scores-v2';

/**
 * Inscriptions that are the Xtrata Arcade itself: v1.0 #3076, v1.1 #3077, v1.3 #3078 (single files) and the
 * recursive v1.4 parent #3081. Add each new parent here when the launch canary seals it.
 */
export const ARCADE_INSCRIPTION_IDS: readonly number[] = [3076, 3077, 3078, 3081];
export const isArcadeInscriptionLabel = (label: string) =>
  [...String(label).matchAll(/#(\d+)\b/g)].some((m) => ARCADE_INSCRIPTION_IDS.includes(Number(m[1])));
