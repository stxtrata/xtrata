// Confirms Mooneeb's engine is byte-for-byte the Forever Twins BF engine, and that pack.json decodes to a valid pack.
//   node tools/check-engine.mjs [path/to/casino/index.html]   (default: fetch https://xtrata.xyz/casino/)
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), sha = s => createHash('sha256').update(s).digest('hex');
const src = process.argv[2] ? await readFile(process.argv[2], 'utf8') : await (await fetch('https://xtrata.xyz/casino/')).text();
const i = src.indexOf('window.PX_MACHINE_PACKS=[') + 'window.PX_MACHINE_PACKS='.length;
const packs = JSON.parse(src.slice(i, src.indexOf('];', i) + 1).replace(/;$/, ''));
const gun = b => gunzipSync(Buffer.from(b, 'base64')).toString('utf8');
const engineOf = html => { const a = html.indexOf('/* Block Fortune v2 engine.'), b = html.indexOf('</script>', a); return a < 0 ? null : html.slice(a, b); };
const mine = await readFile(join(ROOT, 'src/engine.js'), 'utf8');
const report = { mooneebEngineSha256: sha(mine), packs: {} };
for (const p of packs) { const e = engineOf(gun(p.game)); report.packs[p.name] = e ? { sha256: sha(e), identical: e === mine } : 'no BF v2 engine block'; }
const pack = JSON.parse(await readFile(join(ROOT, 'pack.json'), 'utf8'));
const keys = Object.keys(pack).sort().join(','), want = Object.keys(packs[0]).sort().join(',');
const game = gun(pack.game), model = JSON.parse(gun(pack.model));
report.packJson = { keysMatchExistingPacks: keys === want, keys, gameEngineIdentical: engineOf(game) === mine, model: { nodes: JSON.stringify(model.root).split('"p":').length - 1, geometries: model.geometries.length, materials: model.materials.length, textures: model.textures.length, roles: [...new Set(JSON.stringify(model.root).match(/"role":"[a-zA-Z0-9]+"/g))].map(s => s.slice(8, -1)), actions: [...new Set(JSON.stringify(model.root).match(/"action":"[a-zA-Z]+"/g))].map(s => s.slice(10, -1)) } };
console.log(JSON.stringify(report, null, 2));
if (!report.packs['Forever Twins']?.identical || !report.packJson.keysMatchExistingPacks || !report.packJson.gameEngineIdentical) process.exit(1);
