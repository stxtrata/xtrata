#!/usr/bin/env node
// Writes parent/xtrata-arcade.inscription-manifest.json with size + sha256 per leaf.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const leaves = [
  ['css', 'arcade-room.css', 'text/css'],
  ['kit', 'arcade-kit.js', 'text/javascript'],
  ['music', 'arcade-music.js', 'text/javascript'],
  ['scores', 'score-client.js', 'text/javascript'],
  ['room', 'arcade-room.js', 'text/javascript'],
  ['snake', 'game-neon-snake.js', 'text/javascript'],
  ['blocks', 'game-block-drop.js', 'text/javascript'],
  ['cave', 'game-cave-diver.js', 'text/javascript'],
  ['merge', 'game-orbit-merge.js', 'text/javascript'],
  ['runner', 'game-block-runner.js', 'text/javascript'],
  ['bricks', 'game-brick-breaker.js', 'text/javascript'],
  ['drift', 'game-rock-drift.js', 'text/javascript'],
  ['stack', 'game-stack-tower.js', 'text/javascript'],
  ['hopper', 'game-road-hopper.js', 'text/javascript'],
  ['tiles', 'game-tile-tap.js', 'text/javascript'],
  ['merge2048', 'game-merge-2048.js', 'text/javascript'],
  ['defence', 'game-block-defence.js', 'text/javascript'],
  ['muncher', 'game-maze-muncher.js', 'text/javascript'],
  ['invaders', 'game-invader-wave.js', 'text/javascript'],
  ['helix', 'game-helix-drop.js', 'text/javascript'],
  ['bubbles', 'game-bubble-pop.js', 'text/javascript'],
  ['swerve', 'game-swerve.js', 'text/javascript'],
  ['lander', 'game-lunar-lander.js', 'text/javascript'],
  ['reflex', 'game-reflex-tap.js', 'text/javascript'],
  ['mines', 'game-mine-sprint.js', 'text/javascript'],
  ['pong', 'game-pong-streak.js', 'text/javascript']
];
const manifest = {
  schema: 'xtrata-standalone-inscription-manifest@1',
  appId: 'xtrata_arcade_room',
  release: 'v2.1-music-engine',
  createdAt: new Date().toISOString().slice(0, 10),
  contentContract: { address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', name: 'xtrata-v3-2-3', network: 'mainnet' },
  scoreContract: { address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', name: 'xtrata-arcade-scores-v1-3', network: 'mainnet',
    gameIds: ['xa_neon_snake', 'xa_block_drop', 'xa_cave_diver', 'xa_orbit_merge', 'xa_block_runner', 'xa_brick_breaker', 'xa_rock_drift', 'xa_stack_tower', 'xa_road_hopper', 'xa_tile_tap', 'xa_merge_2048', 'xa_block_defence', 'xa_maze_muncher', 'xa_invader_wave', 'xa_helix_drop', 'xa_bubble_pop', 'xa_swerve', 'xa_lunar_lander', 'xa_reflex_tap', 'xa_mine_sprint', 'xa_pong_streak'] },
  leafModules: leaves.map(([key, file, mimeType], i) => {
    const buf = readFileSync(join(here, '..', 'modules', file));
    return { key, path: 'modules/' + file, mimeType, sizeBytes: buf.length,
      sha256: createHash('sha256').update(buf).digest('hex'), mintOrder: i + 1, mintedInscriptionId: 0 };
  }),
  parent: { path: 'parent/xtrata-arcade-parent.template.html', mimeType: 'text/html', mintOrder: leaves.length + 1,
    dependencyOrder: leaves.map(([k]) => k) }
};
const out = join(here, 'xtrata-arcade.inscription-manifest.json');
writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
const total = manifest.leafModules.reduce((a, m) => a + m.sizeBytes, 0);
console.log(`Wrote ${out} — ${manifest.leafModules.length} leaves, ${total.toLocaleString()} bytes`);
