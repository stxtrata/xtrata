// Executes the actual cap registration, spring, and lever-curve functions extracted from src/host.html.
// Uses a plain object graph constructed from the shipped packed model. This is source-function
// evidence, separate from the real-pointer/browser/renderer checks in mechanics-pool.py.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const host = await readFile(join(ROOT, 'src/host.html'), 'utf8');
const packRaw = await readFile(join(ROOT, 'pack.json'), 'utf8');
const pack = JSON.parse(packRaw), modelRaw = gunzipSync(Buffer.from(pack.model, 'base64')).toString('utf8');
const packedModel = JSON.parse(modelRaw);
const sha = value => createHash('sha256').update(value).digest('hex');
function extract(startMarker, endMarker) {
  const start = host.indexOf(startMarker), end = host.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw Error(`Cannot extract actual source span: ${startMarker}`);
  return host.slice(start, end);
}
const capSource = extract('const caps = {}, heldAction', '// The lever:');
const leverSource = extract('function leverCurve(', 'const tagLights');
const nodes = [], byName = new Map();
function unpack(node, parent = null) {
  const object = { name: node.role ? 'px-' + node.role : '', position: { x: node.p[0], y: node.p[1], z: node.p[2] },
    parent, action: node.action || null, children: [] };
  nodes.push(object);
  if (object.name) byName.set(object.name, object);
  object.children = (node.children || []).map(child => unpack(child, object));
  return object;
}
unpack(packedModel.root);
const animations = ['crest', 'lever', 'spinPhysical', 'armPivot']
  .map(role => ({ role, o: byName.get('px-' + role) })).filter(item => item.o);
const context = vm.createContext({ Math, model: { traverse: fn => nodes.forEach(fn) }, animations });
vm.runInContext(capSource + '\n' + leverSource, context, { timeout: 1000 });
const execute = text => vm.runInContext(text, context, { timeout: 1000 });
const observe = expression => JSON.parse(execute('JSON.stringify(' + expression + ')'));
const checks = [];
const check = (name, ok, info = null) => checks.push({ name, ok: Boolean(ok), info });

const bindings = observe('Object.fromEntries(Object.entries(caps).map(([name,cap]) => [name,{parts:cap.parts.map(part=>part.o.name),depth:cap.depth}]))');
check('Actual cap registration binds each cap and label plus the spin group',
  ['pays', 'betDown', 'betUp', 'auto'].every(action => bindings[action]?.parts.includes('px-btn-' + action) &&
    bindings[action]?.parts.includes('px-btnface-' + action)) && bindings.spin?.parts.includes('px-spinPhysical'), bindings);
check('Packed cap and label share the deck coordinate system', ['pays', 'betDown', 'betUp', 'auto'].every(action => {
  const cap = byName.get('px-btn-' + action), label = byName.get('px-btnface-' + action);
  return cap.parent === label.parent && cap.parent.name === 'px-deckSurface';
}));
check('Packed model supplies unique lever, crest and water-jet roles', ['lever', 'crest', 'waterJet'].every(role =>
  nodes.filter(node => node.name === 'px-' + role).length === 1));

const initial = observe('Object.fromEntries(Object.entries(caps).map(([name,cap])=>[name,cap.parts.map(part=>part.o.position.z)]))');
execute('for(const cap of Object.values(caps))cap.hold=true;for(let i=0;i<15;i++)stepCaps(1/60,{buttons:{}})');
const held = observe('Object.fromEntries(Object.entries(caps).map(([name,cap])=>[name,{x:cap.x,positions:cap.parts.map(part=>part.o.position.z)}]))');
check('250 ms physical hold sinks every cap and label by the same 0.034 local-z units',
  ['pays', 'betDown', 'betUp', 'auto'].every(action => held[action].positions.every((z, index) =>
    Math.abs(initial[action][index] - z - .034) < 1e-9)), { initial, held });
check('Physical spin cap carries its attached label as one group with 0.05 travel',
  Math.abs(initial.spin[0] - held.spin.positions[0] - .05) < 1e-9 && byName.get('px-spinPhysical').children.length > 0);
execute('for(const cap of Object.values(caps))cap.hold=false;for(let i=0;i<66;i++)stepCaps(1/60,{buttons:{}})');
const released = observe('Object.fromEntries(Object.entries(caps).map(([name,cap])=>[name,cap.parts.map(part=>part.o.position.z)]))');
check('All caps and labels spring back to their original position after release', Object.keys(initial).every(action =>
  initial[action].every((z, index) => Math.abs(released[action][index] - z) < 1e-9)), released);
execute('for(let i=0;i<6;i++)stepCaps(1/60,{buttons:{betUp:1}})');
const pulse = observe('({x:caps.betUp.x,positions:caps.betUp.parts.map(part=>part.o.position.z)})');
check('The game mechanics button pulse drives the same physical spring',
  pulse.x > .9 && pulse.positions.every((z, index) => z < initial.betUp[index] - .03), pulse);

const samples = observe('Array.from({length:91},(_,i)=>({seconds:i/100,value:leverCurve(i/100),angle:leverCurve(i/100)*1.02,jet:1+.18*leverCurve(i/100)}))');
const sampleAt = second => samples[Math.round(second * 100)];
check('Lever eases down monotonically to its bottom stop', samples.slice(0, 27).every((sample, index, values) =>
  sample.value >= 0 && (index === 0 || sample.value >= values[index - 1].value)) && Math.abs(sampleAt(.26).angle - 1.02) < 1e-9,
  { at0: sampleAt(0), at100ms: sampleAt(.1), at260ms: sampleAt(.26) });
check('Lever dwells at the bottom stop before returning', samples.slice(26, 39).every(sample => sample.value >= .98 && sample.value <= 1.03),
  { at260ms: sampleAt(.26), at320ms: sampleAt(.32), at380ms: sampleAt(.38) });
check('Lever returns, rebounds once prominently, and approaches rest within its 900 ms pulse',
  sampleAt(.5).angle < .4 && sampleAt(.58).angle < .025 && sampleAt(.65).angle > sampleAt(.58).angle + .02 &&
  Math.abs(sampleAt(.9).angle) < .005,
  { at500ms: sampleAt(.5), at580ms: sampleAt(.58), rebound650ms: sampleAt(.65), at900ms: sampleAt(.9),
    note: 'The host ends the animation and clears the exact residual at u >= 1; this check executes the curve itself.' });
check('The lever curve gives the water jet a visible pulse and a return',
  sampleAt(.26).jet >= 1.18 && Math.abs(sampleAt(.9).jet - 1) < .001,
  { peakJet: Math.max(...samples.map(sample => sample.jet)), nearRest: sampleAt(.9).jet });

const report = {
  checkedAt: new Date().toISOString(),
  scope: 'Actual extracted host function execution against a plain object graph of the current packed model; no browser or GPU context',
  provenance: { hostSha256: sha(host), packedModelSha256: sha(modelRaw), packSha256: sha(packRaw),
    capRegistrationAndSpringSha256: sha(capSource), leverCurveSha256: sha(leverSource) },
  checks, ok: checks.every(item => item.ok),
  limitations: [
    'This is separate from pointer hit-testing and rendered-frame evidence in mechanics-pool.py.',
    'A renderer that stalls longer than a transient pulse can miss its visible peak; source evaluation does not claim a GPU pass.',
    'Real-GPU Safari and Chrome review remains outstanding.'
  ]
};
await mkdir(join(ROOT, 'checks/results'), { recursive: true });
await writeFile(join(ROOT, 'checks/results/mechanics-source.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
