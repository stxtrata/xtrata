// Exercises the shipped animation scheduler and loop, with intentionally different
// parent/child clocks and a child whose own animation queue never runs.
// Browser reel-pixel checks are separate; this check isolates clock/lifecycle risk.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(join(ROOT, 'src/game.e.js'), 'utf8');
function extract(startText, endText) {
  const start = source.indexOf(startText), end = source.indexOf(endText, start);
  if (start < 0 || end < 0) throw Error('Source extraction failed: ' + startText);
  return source.slice(start, end);
}
const code = extract('const animationWindow =', 'function drawScreen(') +
  extract('let lastFrame = 0;', '/* ---------- Boot ---------- */');
const checks = [];
const check = (name, ok, info = null) => checks.push({ name, ok: Boolean(ok), info });
function fixture({ hosted = true, inaccessible = false } = {}) {
  let now = 1000, nextId = 1;
  const parentQueue = [], localQueue = [], draws = [], tagSteps = [];
  const local = { requestAnimationFrame: fn => (localQueue.push(fn), nextId++) };
  const parent = { requestAnimationFrame: fn => (parentQueue.push(fn), nextId++) };
  if (inaccessible) Object.defineProperty(local, 'parent', { get() { throw Error('SecurityError'); } });
  else local.parent = parent;
  const context = vm.createContext({
    HOSTED: hosted, window: local, performance: { now: () => now }, frameEl: { isConnected: true },
    pxEngineActive: true, spinning: false, animations: [], screenDirty: true,
    excite: 0, scene: null, freeMode: false, fx: [], burstAt: -Infinity,
    tagGlow: [0], drops: [], lastDraw: 0,
    drawScreen: (stamp, dt) => { draws.push({ stamp, dt }); context.screenDirty = false; },
    finishSpin: () => { context.spinning = false; context.settled++; },
    settled: 0, updateTags: (stamp, dt) => tagSteps.push({ stamp, dt }),
    labAutoTick() {}, highlightIndex: () => -1
  });
  vm.runInContext(code, context);
  const run = script => vm.runInContext(script, context);
  function frame(at, suppliedParentStamp = 900000) {
    now = at;
    const queue = parentQueue.length ? parentQueue : localQueue;
    const batch = queue.splice(0);
    for (const fn of batch) fn(suppliedParentStamp);
  }
  return { context, parentQueue, localQueue, draws, tagSteps, run, frame };
}

const hosted = fixture();
hosted.run('requestGameFrame(animate)');
check('Hosted game schedules on the host while the hidden child queue remains unused',
  hosted.parentQueue.length === 1 && hosted.localQueue.length === 0);
hosted.context.spinning = true;
hosted.context.animations = [{ start: 1000, duration: 800 }, { start: 1100, duration: 1200 }];
hosted.frame(1120);
check('Parent timestamps cannot jump the child spin to its end', hosted.context.spinning &&
  hosted.context.settled === 0 && hosted.draws.at(-1).stamp === 1120, hosted.draws.at(-1));
hosted.frame(1850, -40000);
check('A first reel ending does not settle before the last reel', hosted.context.spinning && hosted.context.settled === 0);
hosted.frame(2300);
hosted.frame(2400);
check('The committed spin settles once when its last child-clock deadline arrives',
  !hosted.context.spinning && hosted.context.settled === 1, { settled: hosted.context.settled });
check('Every loop tick schedules exactly one successor', hosted.parentQueue.length === 1 && hosted.localQueue.length === 0);
const before = hosted.run('perf.frames');
hosted.context.pxEngineActive = false;
hosted.frame(2500);
check('Deactivated game performs no animation work', hosted.run('perf.frames') === before);
hosted.context.pxEngineActive = true;
hosted.run('animate.last = performance.now()');
hosted.frame(2520);
check('Reactivation retains one loop and bounded nonnegative deltas',
  hosted.parentQueue.length === 1 && hosted.tagSteps.every(x => x.dt >= 0 && x.dt <= .06));

for (const [label, options] of [['Standalone', { hosted: false }], ['Inaccessible parent', { inaccessible: true }]]) {
  const f = fixture(options);
  f.run('requestGameFrame(animate)');
  f.frame(1200);
  check(label + ' uses its own animation queue', f.parentQueue.length === 0 && f.localQueue.length === 1 && f.draws.at(-1).stamp === 1200);
}

const detached = fixture();
detached.run('requestGameFrame(animate)');
detached.context.frameEl.isConnected = false;
detached.frame(1200);
check('Removing an embedded game stops its queued callback and prevents a retained parent loop',
  detached.parentQueue.length === 0 && detached.localQueue.length === 0 && detached.draws.length === 0 && detached.run('perf.frames') === 0);

const report = { checkedAt: new Date().toISOString(),
  scope: 'Actual extracted scheduler and animate function under stubbed window scheduling; no renderer or ledger claims',
  sourceSha256: createHash('sha256').update(source).digest('hex'),
  checks, ok: checks.every(c => c.ok) };
await mkdir(join(ROOT, 'checks/results'), { recursive: true });
await writeFile(join(ROOT, 'checks/results/reels-clock.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
