// Confirms DOG Army's engine is byte-for-byte the Forever Twins BF engine, and that pack.json decodes to a valid pack.
//   node tools/check-engine.mjs [path/to/casino/index.html]   (default: fetch https://xtrata.xyz/casino/)
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), sha = s => createHash('sha256').update(s).digest('hex');
// The casino page is the reference for "identical to Forever Twins"; if it cannot be fetched (offline sandbox) the check falls back to the sha256 recorded when the engine was extracted from the Forever Twins pack.
let src = null, fetchNote = 'casino page read';
try { src = process.argv[2] ? await readFile(process.argv[2], 'utf8') : await (await fetch('https://xtrata.xyz/casino/', { signal: AbortSignal.timeout(15000) })).text(); } catch (e) { fetchNote = 'casino page NOT reachable (' + (e.cause?.code || e.message) + '): compared against src/engine.sha256 recorded from the Forever Twins pack instead'; }
let packs = [];
if (src) { const i = src.indexOf('window.PX_MACHINE_PACKS=[') + 'window.PX_MACHINE_PACKS='.length; try { packs = JSON.parse(src.slice(i, src.indexOf('];', i) + 1).replace(/;$/, '')); } catch (e) { fetchNote = 'casino page fetched but packs not parseable: fell back to engine.sha256'; } }
const gun = b => gunzipSync(Buffer.from(b, 'base64')).toString('utf8');
const engineOf = html => { const a = html.indexOf('/* Block Fortune v2 engine.'), b = html.indexOf('</script>', a); return a < 0 ? null : html.slice(a, b); };
const mine = await readFile(join(ROOT, 'src/engine.js'), 'utf8');
const recorded = (await readFile(join(ROOT, 'src/engine.sha256'), 'utf8')).trim();
const report = { reference: fetchNote, dogArmyEngineSha256: sha(mine), recordedForeverTwinsSha256: recorded, matchesRecorded: sha(mine) === recorded, packs: {} };
for (const p of packs) { const e = engineOf(gun(p.game)); report.packs[p.name] = e ? { sha256: sha(e), identical: e === mine } : 'no BF v2 engine block'; }
const pack = JSON.parse(await readFile(join(ROOT, 'pack.json'), 'utf8'));
const keys = Object.keys(pack).sort().join(','), want = packs.length ? Object.keys(packs[0]).sort().join(',') : 'color,css,description,game,model,name,accent'.split(',').sort().join(',');
const game = gun(pack.game), model = JSON.parse(gun(pack.model));
report.packJson = { keysMatchExistingPacks: keys === want, keys, gameEngineIdentical: engineOf(game) === mine, model: { nodes: JSON.stringify(model.root).split('"p":').length - 1, geometries: model.geometries.length, materials: model.materials.length, textures: model.textures.length, roles: [...new Set(JSON.stringify(model.root).match(/"role":"[a-zA-Z0-9]+"/g))].map(s => s.slice(8, -1)), actions: [...new Set(JSON.stringify(model.root).match(/"action":"[a-zA-Z]+"/g))].map(s => s.slice(10, -1)) } };
const rr = new Set(report.packJson.model.roles), aa = new Set(report.packJson.model.actions), pj = pack;
report.packJson.name = pack.name; report.packJson.fieldsOk = ['name', 'description', 'color', 'accent', 'model', 'game', 'css'].every(k => typeof pj[k] === 'string' && pj[k].length) && pack.color === '#0c0a09' && pack.accent === '#e7e5e4';
report.packJson.gzipBase64 = (() => { try { return gun(pack.game).startsWith('<!doctype html>') && !!JSON.parse(gun(pack.model)).root; } catch (e) { return false; } })();
report.packJson.requiredParts = ['screenMesh', 'crest', 'spinPhysical', 'lever', ...Array.from({ length: 8 }, (_, i) => 'tag' + i)].filter(x => !rr.has(x));
report.packJson.requiredActions = ['spin', 'betUp', 'betDown', 'auto', 'pays'].filter(x => !aa.has(x));
report.packJson.modelHasRootGeometriesMaterialsTextures = ['root', 'geometries', 'materials', 'textures'].every(k => model[k]);
console.log(JSON.stringify(report, null, 2));
const ok = (packs.length ? report.packs['Forever Twins']?.identical : report.matchesRecorded) && report.packJson.keysMatchExistingPacks && report.packJson.gameEngineIdentical && report.matchesRecorded && report.packJson.fieldsOk && report.packJson.gzipBase64 && !report.packJson.requiredParts.length && !report.packJson.requiredActions.length && report.packJson.modelHasRootGeometriesMaterialsTextures;
report.ok = !!ok; console.log('OK: ' + report.ok);
if (!ok) process.exit(1);
