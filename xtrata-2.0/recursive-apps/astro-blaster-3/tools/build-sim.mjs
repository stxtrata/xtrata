// Bundles the simulation into release/sim.js (usable from Node and the browser).
import { readFileSync, writeFileSync } from 'node:fs';
export const SIM_FILES = ['core', 'data', 'game', 'enemies', 'bosses', 'replay'].map(f => `src/sim/${f}.js`);
export const SIM_EXPORTS = ['ENGINE_VERSION','W','H','TAU','dsin','dcos','makeRng','fnv1a','dailySeed','SECTORS','ENEMIES','WEAPONS','WEAPON_NAMES','MODULE_MAX','MODULE_INFO','BOSSES','CMD','MODE_CAMPAIGN','MODE_DAILY','createGame','step','stateHash','diff','chainMult','loopMult','grazeRadius','Recorder','InputReader','encodeReplay','decodeReplay','verifyReplay','replaySession','readHeader','toBase64Url','fromBase64Url','REPLAY_MAX_BYTES','REPLAY_HEADER','REPLAY_MAX_FRAMES','botInput'];
export function simSource(opts = { bot: true }) {
  const files = opts.bot ? SIM_FILES.concat(['src/sim/bot.js']) : SIM_FILES;
  const body = files.map(f => readFileSync(new URL('../' + f, import.meta.url), 'utf8')).join('\n');
  const exportsList = opts.bot ? SIM_EXPORTS : SIM_EXPORTS.filter((n) => n !== 'botInput');
  return `(function (root) {\n'use strict';\n${body}\nroot.AB3 = {${exportsList.join(', ')}};\n})(typeof globalThis !== 'undefined' ? globalThis : this);\n`;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync(new URL('../release/sim.js', import.meta.url), simSource({ bot: true }));
  console.log('release/sim.js written');
}
