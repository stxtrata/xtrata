#!/usr/bin/env node
// Bundles every leaf into one self-contained HTML page for quick sharing/testing.
// This preview is view-only (no wallet bridge); scores post from the inscribed parent on xtrata.xyz.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
const m = (f) => readFileSync(join(here, '..', 'modules', f), 'utf8').replace(/<\/script/gi, '<\\/script');
const js = ['arcade-kit.js', 'score-client.js', 'arcade-room.js', 'game-neon-snake.js', 'game-block-drop.js', 'game-cave-diver.js', 'game-orbit-merge.js', 'game-block-runner.js', 'game-brick-breaker.js'];
const html = `<title>Xtrata Arcade</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>${m('arcade-room.css')}</style>
<div id="xa-root"></div>
${js.map((f) => `<script>/* ${f} */\n${m(f)}</script>`).join('\n')}
<script>
window.XA_CONFIG = { subtitle: 'Preview cabinet · six games, one on-chain leaderboard contract · post scores from xtrata.xyz' };
XARoom.boot(document.getElementById('xa-root'));
</script>
`;
mkdirSync(join(here, '..', 'preview'), { recursive: true });
const out = join(here, '..', 'preview', 'xtrata-arcade-preview.html');
writeFileSync(out, html);
console.log('Wrote', out, (html.length / 1024).toFixed(1) + ' KB');
