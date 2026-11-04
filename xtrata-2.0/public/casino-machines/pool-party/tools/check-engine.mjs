// Pool Party: verify the unmodified canonical engine and its packed copy.
// node tools/check-engine.mjs [--source-only] [--reference /path/to/engine.js]
// The recorded full-file hash comes unchanged from the supplied DOG Army source.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXPECTED_FILE_SHA = '7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168';
const EXPECTED_BLOCK_SHA = '203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed';
const sha = value => createHash('sha256').update(value).digest('hex');
const gun = value => gunzipSync(Buffer.from(value, 'base64')).toString('utf8');
function blockOf(text) {
  const start = text.indexOf('const BF = (() => {');
  const end = text.indexOf('\n})();', start);
  if (start < 0 || end < 0) throw Error('Canonical const BF block not found');
  return text.slice(start, end + '\n})();'.length);
}
const source = await readFile(join(ROOT, 'src/engine.js'), 'utf8');
const recorded = (await readFile(join(ROOT, 'src/engine.sha256'), 'utf8')).trim();
const block = blockOf(source), sourceOnly = process.argv.includes('--source-only');
const report = {
  checkedAt: new Date().toISOString(),
  scope: sourceOnly ? 'source-only; pack not checked' : 'source and final pack',
  canonicalReference: 'User-supplied dog-army.zip / src/engine.js',
  fullFile: { bytes: Buffer.byteLength(source), sha256: sha(source), recordedSha256: recorded,
    expectedSha256: EXPECTED_FILE_SHA, identical: sha(source) === recorded && recorded === EXPECTED_FILE_SHA },
  engineBlock: { characters: block.length, bytes: Buffer.byteLength(block), sha256: sha(block),
    expectedSha256: EXPECTED_BLOCK_SHA, identical: block.length === 11429 && sha(block) === EXPECTED_BLOCK_SHA },
  checks: []
};
const check = (name, ok, info = null) => report.checks.push({ name, ok: Boolean(ok), info });
check('Recorded canonical full-file hash', report.fullFile.identical);
check('Canonical 11,429-character BF block and exact hash', report.engineBlock.identical);
check('STATE_VERSION remains 2', block.includes('const STATE_VERSION = 2;'));
const ri = process.argv.indexOf('--reference');
if (ri >= 0) {
  const reference = await readFile(resolve(process.argv[ri + 1]), 'utf8');
  check('Byte-for-byte equality to supplied reference', source === reference, { sha256: sha(reference) });
}
if (!sourceOnly) {
  const packPath = join(ROOT, 'pack.json');
  const packRaw = await readFile(packPath, 'utf8');
  const pack = JSON.parse(packRaw), game = gun(pack.game), model = JSON.parse(gun(pack.model));
  const expectedKeys = ['name', 'description', 'color', 'accent', 'model', 'game', 'css'].sort();
  check('Existing seven-field PX_MACHINE_PACKS format', JSON.stringify(Object.keys(pack).sort()) === JSON.stringify(expectedKeys));
  check('Nonempty string fields', expectedKeys.every(k => typeof pack[k] === 'string' && pack[k].length > 0));
  check('Pool Party identity and accent', pack.name === 'Pool Party' && pack.accent === '#06b6d4', { name: pack.name, accent: pack.accent });
  check('Packed engine full source is unchanged', game.includes(source));
  check('Packed engine block is canonical', blockOf(game) === block);
  check('Packed game is self-contained HTML', /^<!doctype html>/i.test(game.trimStart()));
  check('Packed model has root/geometries/materials/textures', ['root', 'geometries', 'materials', 'textures'].every(k => model[k] != null));
  const roles = new Set(), actions = new Set(); let nodes = 0;
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    nodes++;
    if (node.role) roles.add(node.role);
    if (node.action) actions.add(node.action);
    for (const child of node.children || []) visit(child);
  }
  visit(model.root);
  check('Named cabinet parts', ['screenMesh', 'crest', 'spinPhysical'].every(r => roles.has(r)) && (roles.has('lever') || roles.has('armPivot')), [...roles]);
  check('Physical deck actions', ['spin', 'betUp', 'betDown', 'auto', 'pays'].every(a => actions.has(a)), [...actions]);
  const anchors = [
    ['Direct LAYR account engine anchor', /E=LAYR\.machine\(GAME_ID,BF\)/g],
    ['Canonical screen canvas anchor', /const screen=canvas\(2800,1920\)/g],
    ['Audio destination anchor', /connect\(ac\.destination\)/g],
    ['Casino engine export anchor', /window\.PX_CASINO_ENGINE=\{/g]
  ];
  for (const [name, pattern] of anchors) {
    const count = (game.match(pattern) || []).length;
    check(name + ' appears once', count === 1, { count });
  }
  report.pack = { bytes: Buffer.byteLength(packRaw), gameBytes: Buffer.byteLength(game), modelNodes: nodes,
    geometries: model.geometries.length, materials: model.materials.length, textures: model.textures.length,
    sizeBudgetBytes: 2 * 1024 * 1024, withinSizeBudget: Buffer.byteLength(packRaw) <= 2 * 1024 * 1024 };
  check('Pack is within stated 2 MiB budget', report.pack.withinSizeBudget, { bytes: report.pack.bytes });
}
report.ok = report.checks.every(c => c.ok);
await mkdir(join(ROOT, 'checks/results'), { recursive: true });
await writeFile(join(ROOT, 'checks/results', sourceOnly ? 'engine-source.json' : 'engine.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
