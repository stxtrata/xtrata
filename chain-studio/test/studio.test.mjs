import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Engine, usageTotal } from '../lib/engine.mjs';
import { validateStages } from '../lib/catalog.mjs';
import { copyWorkspace, safePath, runWorkspaceTest } from '../lib/workspace.mjs';
import { runProcess } from '../lib/process.mjs';
import { createStudio } from '../server.mjs';

const catalog = { models: [{ id: 'test-model', efforts: ['low', 'ultra'] }] };
const config = { name: 'Test chain', prompt: 'Build a counter without losing keyboard access.', acceptance: 'The count must never be negative.', stages: [{ model: 'test-model', effort: 'low', role: 'build' }, { model: 'test-model', effort: 'ultra', role: 'improve' }] };
async function waitFor(predicate) { const start = Date.now(); while (!predicate()) { if (Date.now() - start > 10000) throw new Error('Condition timed out.'); await new Promise(r => setTimeout(r, 15)); } }
async function temp(t) { const dir = await mkdtemp(join(tmpdir(), 'chain-studio-test-')); t.after(() => rm(dir, { recursive: true, force: true })); return dir; }
function fakeExecutor({ failFirst = false, hold, output = 'valid' } = {}) {
  let calls = 0; const prompts = [];
  const execute = async (_bin, args, options) => {
    calls++; prompts.push(options.input);
    if (failFirst && calls === 1) { options.onLine(JSON.stringify({ type: 'turn.failed', error: { message: 'Temporary model failure' } })); return { code: 1, stderr: '', stdout: '' }; }
    if (hold) await hold(options.signal);
    if (options.signal.aborted) return { code: 1, termination: 'Cancelled', stderr: '', stdout: '' };
    const file = join(options.cwd, 'counter.js');
    await writeFile(file, output === 'invalid' ? 'function {' : `export const count = ${calls};\n`);
    await writeFile(join(options.cwd, 'index.html'), `<!doctype html><html><body><h1>Version ${calls}</h1><button onclick="this.textContent='Clicked'">Try me</button></body></html>`);
    await writeFile(args[args.indexOf('-o') + 1], JSON.stringify({ refinedPrompt: `Preserve the original request; improve iteration ${calls}.`, summary: `Version ${calls}`, changes: ['Updated the counter'], checks: ['Syntax was checked'], unresolved: [] }));
    options.onLine(JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 600, output_tokens: 100, cached_input_tokens: 200 } }));
    return { code: 0, stderr: '', stdout: '' };
  };
  return { execute, prompts, calls: () => calls };
}

test('validates every requested model/effort combination, without silently downgrading', () => {
  assert.equal(validateStages(config.stages, catalog)[1].effort, 'ultra');
  assert.throws(() => validateStages([{ model: 'test-model', effort: 'high', role: 'build' }], catalog), /unsupported/);
  assert.throws(() => validateStages([], catalog), /between 1 and 64/);
});

test('snapshots stay independent, original intent is retained, and prompt evolves', async t => {
  const dir = await temp(t); const fake = fakeExecutor(); const engine = new Engine(dir, fake); await engine.init();
  const run = await engine.create(config, catalog); await waitFor(() => !engine.active.has(run.id));
  assert.equal(run.status, 'completed'); assert.equal(fake.calls(), 2);
  assert.match(await readFile(join(engine.snapshot(run.id, 0), 'counter.js'), 'utf8'), /count = 1/);
  assert.match(await readFile(join(engine.snapshot(run.id, 1), 'counter.js'), 'utf8'), /count = 2/);
  assert.ok(fake.prompts.every(p => p.includes(config.prompt) && p.includes(config.acceptance)));
  assert.match(fake.prompts[1], /improve iteration 1/);
  assert.equal(run.stages[0].usage.cached_input_tokens, 200);
  const restarted = new Engine(dir); await restarted.init(); assert.equal(restarted.get(run.id).status, 'completed');
});

test('pause finishes current stage and feedback reaches the resumed next stage', async t => {
  const fake = fakeExecutor(); const engine = new Engine(await temp(t), fake); await engine.init(); let paused = false;
  engine.on('update', run => { if (!paused && run.stages[0].status === 'completed') { paused = true; engine.pause(run.id); } });
  const run = await engine.create(config, catalog); await waitFor(() => !engine.active.has(run.id));
  assert.equal(run.status, 'paused'); assert.equal(fake.calls(), 1);
  engine.feedback(run.id, 0, 'Keep the reset button accessible.'); engine.resume(run.id); await waitFor(() => !engine.active.has(run.id));
  assert.equal(run.status, 'completed'); assert.match(fake.prompts[1], /Keep the reset button accessible/);
});

test('token threshold stops before another stage and can be increased on resume', async t => {
  const fake = fakeExecutor(); const engine = new Engine(await temp(t), fake); await engine.init();
  const run = await engine.create({ ...config, tokenBudget: 1000, stages: [...config.stages, config.stages[1]] }, catalog);
  await waitFor(() => !engine.active.has(run.id)); assert.equal(run.status, 'budget_stopped'); assert.equal(fake.calls(), 2);
  engine.resume(run.id, 5000); await waitFor(() => !engine.active.has(run.id)); assert.equal(run.status, 'completed'); assert.equal(fake.calls(), 3);
  assert.match(fake.prompts[2], /ACTUAL CODE DIFFERENCES/);
});

test('failed provider stage can be retried without retaining the old provider error', async t => {
  const fake = fakeExecutor({ failFirst: true }); const engine = new Engine(await temp(t), fake); await engine.init();
  const run = await engine.create({ ...config, stages: config.stages.slice(0, 1) }, catalog); await waitFor(() => !engine.active.has(run.id));
  assert.equal(run.status, 'failed'); engine.resume(run.id); await waitFor(() => !engine.active.has(run.id));
  assert.equal(run.status, 'completed'); assert.equal(fake.calls(), 2);
});

test('retry accounting retains tokens reported by earlier failed attempts', async t => {
  const fake = fakeExecutor(); let attempt = 0;
  const execute = async (...args) => {
    if (++attempt === 1) { args[2].onLine(JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 1100, output_tokens: 200 } })); return { code: 1, stderr: 'Output write failed', stdout: '' }; }
    return fake.execute(...args);
  };
  const engine = new Engine(await temp(t), { execute }); await engine.init(); const run = await engine.create({ ...config, stages: config.stages.slice(0, 1) }, catalog);
  await waitFor(() => !engine.active.has(run.id)); assert.equal(usageTotal(run), 1300);
  engine.resume(run.id); await waitFor(() => !engine.active.has(run.id)); assert.equal(run.status, 'completed'); assert.equal(usageTotal(run), 2000);
});

test('unfinished runs recover as interrupted and resume from the previous saved snapshot', async t => {
  const dir = await temp(t); const fake = fakeExecutor(); const engine = new Engine(dir, fake); await engine.init();
  const run = await engine.create({ ...config, stages: config.stages.slice(0, 1) }, catalog); await waitFor(() => !engine.active.has(run.id));
  run.stages.push({ ...config.stages[1], status: 'running', events: [], tests: [], checks: [], files: [] }); run.status = 'running'; engine.save(run);
  const recovered = new Engine(dir, fake); await recovered.init(); assert.equal(recovered.get(run.id).status, 'interrupted');
  recovered.resume(run.id); await waitFor(() => !recovered.active.has(run.id)); assert.equal(recovered.get(run.id).status, 'completed');
  assert.match(await readFile(join(recovered.snapshot(run.id, 0), 'counter.js'), 'utf8'), /count = 1/);
});

test('failed automated checks pause the ladder and keep the inspectable snapshot', async t => {
  const fake = fakeExecutor({ output: 'invalid' }); const engine = new Engine(await temp(t), fake); await engine.init();
  const run = await engine.create(config, catalog); await waitFor(() => !engine.active.has(run.id));
  assert.equal(run.status, 'paused'); assert.equal(run.stages[0].status, 'completed'); assert.ok(run.stages[0].checks.some(c => !c.passed)); assert.equal(fake.calls(), 1);
});

test('cancel aborts the current process and never starts the next stage', async t => {
  const fake = fakeExecutor({ hold: signal => new Promise(resolve => signal.addEventListener('abort', resolve, { once: true })) });
  const engine = new Engine(await temp(t), fake); await engine.init(); const run = await engine.create(config, catalog);
  await waitFor(() => fake.calls() === 1); engine.cancel(run.id); await waitFor(() => !engine.active.has(run.id));
  assert.equal(run.status, 'cancelled'); assert.equal(run.stages[1].status, 'pending'); assert.equal(fake.calls(), 1);
});

test('source copying excludes secrets and symlinks; file reads reject traversal', async t => {
  const dir = await temp(t); const src = join(dir, 'src'); const dest = join(dir, 'dest'); await mkdir(src);
  await writeFile(join(src, 'index.html'), 'hello'); await writeFile(join(src, '.env'), 'secret'); await symlink('/etc/passwd', join(src, 'outside.txt'));
  await copyWorkspace(src, dest); assert.equal(await readFile(join(dest, 'index.html'), 'utf8'), 'hello');
  await assert.rejects(readFile(join(dest, '.env'))); await assert.rejects(readFile(join(dest, 'outside.txt')));
  await assert.rejects(safePath(src, '../missing'), /outside/); await assert.rejects(safePath(src, 'outside.txt'), /outside/);
});

test('process timeout terminates a child instead of leaving an abandoned run', async () => {
  const result = await runProcess(process.execPath, ['-e', 'setInterval(()=>{},1000)'], { timeout: 50 });
  assert.equal(result.termination, 'Time limit reached');
});

test('manual command testing uses a copy; sandbox blocks network and external writes', { skip: process.platform !== 'darwin' }, async t => {
  const dir = await temp(t); const fake = fakeExecutor(); const engine = new Engine(dir, fake); await engine.init();
  const run = await engine.create({ ...config, stages: config.stages.slice(0, 1) }, catalog); await waitFor(() => !engine.active.has(run.id));
  const result = await engine.test(run.id, 0, 'echo changed > counter.js; echo TEST-PASSED');
  assert.equal(result.status, 'passed', result.output); assert.match(result.output, /TEST-PASSED/);
  assert.match(await readFile(join(engine.snapshot(run.id, 0), 'counter.js'), 'utf8'), /count = 1/);
  const denied = await runWorkspaceTest(engine.snapshot(run.id, 0), `echo bad > '${join(dir, 'outside-sandbox.txt')}'`);
  assert.notEqual(denied.code, 0); await assert.rejects(readFile(join(dir, 'outside-sandbox.txt')));
  const network = await runWorkspaceTest(engine.snapshot(run.id, 0), '/usr/bin/curl -s --max-time 1 http://127.0.0.1:4317/');
  assert.notEqual(network.code, 0);
});

test('HTTP API rejects cross-origin writes and previews are isolated from controller APIs', async t => {
  const studio = await createStudio({ port: 0, previewPort: 0, dataDir: await temp(t), execute: fakeExecutor().execute });
  t.after(() => studio.close());
  const bootstrap = await (await fetch(studio.origin + '/api/bootstrap')).json(); assert.ok(bootstrap.catalog.models.length);
  const denied = await fetch(studio.origin + '/api/runs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); assert.equal(denied.status, 403);
  const m = bootstrap.catalog.models[0]; const response = await fetch(studio.origin + '/api/runs', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: studio.origin, 'X-Chain-Token': bootstrap.token }, body: JSON.stringify({ ...config, stages: [{ model: m.id, effort: m.efforts[0], role: 'build' }] }) });
  assert.equal(response.status, 201); const run = await response.json(); await waitFor(() => !studio.engine.active.has(run.id));
  const preview = await fetch(`${studio.previewOrigin}/${run.id}/0/index.html`); assert.equal(preview.status, 200); assert.match(preview.headers.get('content-security-policy'), /sandbox allow-scripts allow-forms/); assert.match(preview.headers.get('content-security-policy'), /connect-src 'none'/);
  assert.match(await preview.text(), /Version 1/);
  const file = await (await fetch(`${studio.origin}/api/runs/${run.id}/stages/0/file?path=counter.js`)).json(); assert.match(file.content, /count = 1/);
  const escape = await fetch(`${studio.origin}/api/runs/${run.id}/stages/0/file?path=..%2F..%2Frun.json`); assert.equal(escape.status, 400);
  const archive = await fetch(`${studio.origin}/api/runs/${run.id}/stages/0/download`); assert.equal(archive.status, 200); assert.equal(archive.headers.get('content-type'), 'application/gzip');
});
