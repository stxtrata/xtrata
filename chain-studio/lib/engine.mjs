import { EventEmitter } from 'node:events';
import { mkdir, readFile, writeFile, readdir, rm, stat } from 'node:fs/promises';
import { mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { join, resolve, dirname, isAbsolute } from 'node:path';
import { randomUUID } from 'node:crypto';
import { codexBin, validateStages } from './catalog.mjs';
import { runProcess } from './process.mjs';
import { copyWorkspace, manifest, basicChecks, runWorkspaceTest } from './workspace.mjs';

const schema = {
  type: 'object', additionalProperties: false,
  properties: {
    refinedPrompt: { type: 'string' }, summary: { type: 'string' },
    changes: { type: 'array', items: { type: 'string' } },
    checks: { type: 'array', items: { type: 'string' } },
    unresolved: { type: 'array', items: { type: 'string' } },
  }, required: ['refinedPrompt', 'summary', 'changes', 'checks', 'unresolved'],
};
const rules = `\n# Chain Studio execution rules\nWork only in this stage's workspace. Do not access personal wallets, deployer wallets, sponsor wallets, credentials, browser sessions, or account secrets. Do not sign, broadcast, publish, deploy, send messages, or make payments. Use local simulations and disposable test data. Do not put secrets in output or code. Do not read sibling stages or harness state. Preserve the user's original requirements. Keep generated media local. Never weaken tests to make them pass.\n`;
const timestamp = () => new Date().toISOString();
const bounded = (v, fallback, min, max) => Number.isFinite(Number(v)) ? Math.max(min, Math.min(max, Number(v))) : fallback;
const text = (v, max = 20000) => String(v || '').slice(0, max);
export const usageTotal = run => run.stages.reduce((total, stage) => total + [stage, ...(stage.attempts || [])].reduce((n, attempt) => n + (attempt.usage?.input_tokens || 0) + (attempt.usage?.output_tokens || 0), 0), 0);

export class Engine extends EventEmitter {
  constructor(dataDir, { execute = runProcess } = {}) {
    super(); this.root = resolve(dataDir); this.runs = new Map(); this.active = new Map(); this.tests = new Map(); this.execute = execute;
  }
  async init() {
    await mkdir(this.root, { recursive: true });
    this.schemaPath = join(this.root, 'response-schema.json');
    await writeFile(this.schemaPath, JSON.stringify(schema));
    for (const entry of await readdir(this.root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      try {
        const run = JSON.parse(await readFile(join(this.root, entry.name, 'run.json'), 'utf8'));
        if (['running', 'pausing', 'preparing'].includes(run.status)) { run.status = 'interrupted'; run.error = 'The runner stopped. Resume to retry the unfinished stage.'; }
        for (const stage of run.stages) {
          if (['running', 'checking', 'preparing'].includes(stage.status)) stage.status = 'interrupted';
          for (const test of stage.tests || []) if (test.status === 'running') { test.status = 'interrupted'; test.output = 'Runner restarted before this test finished.'; }
        }
        this.runs.set(run.id, run); this.save(run);
      } catch { /* Ignore directories which are not run records. */ }
    }
  }
  get(id) { const run = this.runs.get(id); if (!run) throw new Error('Run not found.'); return run; }
  runDir(id) { this.get(id); return join(this.root, id); }
  stageDir(id, index) {
    const run = this.get(id); if (!Number.isInteger(index) || !run.stages[index]) throw new Error('Stage not found.');
    return join(this.root, id, 'stages', String(index));
  }
  snapshot(id, index) {
    const stage = this.get(id).stages[index]; if (!stage || stage.status !== 'completed') throw new Error('This snapshot is not ready yet.');
    return join(this.stageDir(id, index), 'snapshot');
  }
  save(run) {
    run.updatedAt = timestamp();
    const dir = join(this.root, run.id); mkdirSync(dir, { recursive: true });
    const tmp = join(dir, 'run.json.tmp'); writeFileSync(tmp, JSON.stringify(run, null, 2)); renameSync(tmp, join(dir, 'run.json'));
    this.emit('update', run);
  }
  log(run, stage, message, kind = 'info') {
    stage.events.push({ at: timestamp(), kind, message: text(message, 6000) });
    stage.events = stage.events.slice(-160); this.save(run);
  }
  async create(body, catalog) {
    if (this.active.size >= 3) throw new Error('Three chains are already running. Pause one before starting another.');
    const original = text(body.prompt);
    if (!original.trim()) throw new Error('Describe what you want to build.');
    const stages = validateStages(body.stages, catalog);
    const source = text(body.source, 2000).trim();
    if (source && !isAbsolute(source)) throw new Error('Use an absolute source folder path.');
    const run = {
      id: randomUUID(), name: text(body.name, 100).trim() || original.slice(0, 50), original,
      acceptance: text(body.acceptance, 12000), source, createdAt: timestamp(), status: 'preparing',
      pauseRequested: false, feedback: [], testCommand: text(body.testCommand, 4000),
      stageMinutes: bounded(body.stageMinutes, 15, 1, 120), tokenBudget: bounded(body.tokenBudget, 500000, 1000, 10000000),
      stages: stages.map(s => ({ ...s, status: 'pending', events: [], tests: [], checks: [], files: [], usage: null })),
    };
    this.runs.set(run.id, run); this.save(run);
    const controller = new AbortController(); this.active.set(run.id, controller);
    this.prepare(run, controller).catch(e => { if (run.status !== 'cancelled') { run.status = 'failed'; run.error = e.message; this.save(run); } }).finally(() => { if (this.active.get(run.id) === controller) this.active.delete(run.id); });
    return run;
  }
  async prepare(run, controller) {
    const seed = join(this.root, run.id, 'seed'); await mkdir(seed, { recursive: true });
    if (run.source) {
      const source = resolve(run.source);
      if (source === this.root || source.startsWith(this.root + '/')) throw new Error('Use a project folder outside the run store.');
      if (!(await stat(source)).isDirectory()) throw new Error('Source must be a directory.');
      await copyWorkspace(source, seed, { gitOnly: true });
      const ancestors = []; let current = source;
      while (true) { ancestors.unshift(current); if (dirname(current) === current) break; current = dirname(current); }
      let inherited = '';
      for (const parent of ancestors) { try { inherited += `\n# Instructions from ${parent}/AGENTS.md\n` + await readFile(join(parent, 'AGENTS.md'), 'utf8'); } catch {} }
      await writeFile(join(seed, 'AGENTS.md'), inherited + rules);
    } else await writeFile(join(seed, 'AGENTS.md'), rules);
    if (controller.signal.aborted) return;
    run.prepared = true; this.save(run); await this.drive(run, controller);
  }
  buildPrompt(run, index) {
    const stage = run.stages[index]; const previous = run.stages.slice(0, index).filter(s => s.status === 'completed');
    const last = previous.at(-1); const recent = previous.slice(-2).map(s => ({ model: s.model, effort: s.effort, summary: s.result?.summary, changes: s.result?.changes, unresolved: s.result?.unresolved, checks: s.checks, userTests: s.tests.map(t => ({ command: t.command, status: t.status, output: t.output?.slice(-3000) })) }));
    const role = {
      clarify: 'Clarify the request into a precise working prompt. Preserve ambiguities as explicit assumptions. Do not change product files.',
      build: 'Implement the requested software in the workspace. If an implementation exists, inspect and improve it rather than blindly starting over.',
      improve: 'Compare the current implementation with the recent stage reports. Find concrete gaps, improve the working prompt, and implement justified improvements. Preserve working behavior. A rewrite is allowed only if necessary to meet the request.',
      review: 'Review the current implementation against the ORIGINAL request and acceptance criteria. Run relevant safe checks. Report gaps honestly. Do not change product files. Improve the working prompt for any future stage.',
    }[stage.role];
    return `You are stage ${index + 1} of ${run.stages.length} in Chain Studio.\n${rules}\n\nORIGINAL USER REQUEST (authoritative, never replace or weaken):\n${run.original}\n\nACCEPTANCE CRITERIA (authoritative):\n${run.acceptance || 'Fulfil the original request. Explain any unverified requirements.'}\n\nCURRENT WORKING PROMPT:\n${last?.result?.refinedPrompt || run.original}\n\nYOUR ROLE:\n${role}\n\nSTAGE INSTRUCTIONS:\n${stage.instructions || 'Use judgment within the original scope.'}\n\nRECENT STAGE EVIDENCE:\n${JSON.stringify(recent, null, 2)}\n\nUSER FEEDBACK RECEIVED BEFORE THIS STAGE:\n${run.feedback.map(f => `Stage ${f.stage + 1}: ${f.text}`).join('\n') || 'None.'}\n\nDELIVERY:\nRead applicable AGENTS.md instructions. Your working directory contains a copy of the last completed snapshot. Do not access other run directories. For a new browser application, prefer a working self-contained index.html with local assets so it can be tested immediately in the snapshot preview; use a larger stack when the request needs it. The snapshot preview cannot run a backend or fetch remote resources. Do not install dependencies or fetch network resources without an explicit task requirement. Do not start persistent servers. Run relevant tests where available. Return JSON matching the requested schema. Checks in your report must distinguish executed checks from suggestions. RefinedPrompt must retain all original requirements; record assumptions and unresolved issues, never silently drop them.\n`;
  }
  async drive(run, controller) {
    run.status = 'running'; run.error = null; this.save(run);
    for (let index = 0; index < run.stages.length; index++) {
      const stage = run.stages[index]; if (stage.status === 'completed') continue;
      if (controller.signal.aborted) return;
      if (run.pauseRequested) { run.status = 'paused'; this.save(run); return; }
      const tokens = usageTotal(run);
      if (tokens >= run.tokenBudget) { run.status = 'budget_stopped'; run.error = 'Token threshold reached. Increase the threshold to resume. Usage is checked between stages.'; this.save(run); return; }
      const dir = this.stageDir(run.id, index); const work = join(dir, 'workspace');
      try {
        if (stage.startedAt) { stage.attempts ||= []; stage.attempts.push({ startedAt: stage.startedAt, finishedAt: stage.finishedAt, error: stage.error, usage: stage.usage }); }
        stage.status = 'preparing'; stage.startedAt = timestamp(); stage.finishedAt = null; stage.error = null; stage.providerError = null; stage.events = []; stage.usage = null;
        this.save(run); await rm(dir, { recursive: true, force: true }); await mkdir(dir, { recursive: true });
        await copyWorkspace(index ? this.snapshot(run.id, index - 1) : join(this.root, run.id, 'seed'), work);
        if (controller.signal.aborted) return;
        const initialized = await runProcess('git', ['init', '--quiet', work], { timeout: 10000, signal: controller.signal });
        if (initialized.code !== 0) throw new Error('Could not initialize the isolated stage repository.');
        stage.prompt = this.buildPrompt(run, index);
        if (index >= 2) {
          const diff = await runProcess('git', ['diff', '--no-index', '--no-ext-diff', '--', this.snapshot(run.id, index - 2), this.snapshot(run.id, index - 1)], { timeout: 20000, maxOutput: 30000 });
          stage.prompt += `\nACTUAL CODE DIFFERENCES BETWEEN THE LAST TWO SNAPSHOTS (bounded to 24,000 characters):\n${diff.stdout.slice(0, 24000) || 'No file differences.'}\n`;
        }
        await writeFile(join(dir, 'prompt.txt'), stage.prompt);
        if (controller.signal.aborted) return;
        stage.status = 'running'; this.log(run, stage, `Started ${stage.model} · ${stage.effort}.`);
        const output = join(dir, 'result.json');
        const args = ['exec', '--ignore-user-config', '--ephemeral', '--skip-git-repo-check', '--json', '--color', 'never', '-C', work, '-m', stage.model, '-s', ['clarify', 'review'].includes(stage.role) ? 'read-only' : 'workspace-write', '-c', `model_reasoning_effort=${JSON.stringify(stage.effort)}`, '-c', 'approval_policy="never"', '-c', 'sandbox_workspace_write.network_access=false', '--output-schema', this.schemaPath, '-o', output, '-'];
        const response = await this.execute(codexBin, args, {
          cwd: work, input: stage.prompt, signal: controller.signal, timeout: run.stageMinutes * 60000,
          onLine: line => {
            let event; try { event = JSON.parse(line); } catch { return; }
            if (event.type === 'turn.completed') { stage.usage = event.usage; this.save(run); }
            if (event.type === 'turn.failed') stage.providerError = event.error?.message || 'Model turn failed';
            if (event.type === 'item.completed' || event.type === 'item.started') {
              const item = event.item || {};
              if (item.type === 'agent_message') this.log(run, stage, item.text, 'agent');
              else if (item.type === 'command_execution') this.log(run, stage, `${item.command || 'Command'}\n${item.aggregated_output || item.status || ''}`, 'command');
              else if (item.type === 'file_change') this.log(run, stage, JSON.stringify(item.changes || []), 'files');
            }
            if (event.type === 'error') this.log(run, stage, event.message || JSON.stringify(event), 'error');
          },
        });
        if (controller.signal.aborted) return;
        if (response.code !== 0 || response.termination || stage.providerError) throw new Error(response.termination || stage.providerError || response.stderr.slice(-4000) || 'Codex exited unsuccessfully.');
        let result; try { result = JSON.parse(await readFile(output, 'utf8')); } catch { throw new Error('The model did not return a valid structured result. Retry this stage.'); }
        if (typeof result.refinedPrompt !== 'string' || typeof result.summary !== 'string' || !['changes', 'checks', 'unresolved'].every(k => Array.isArray(result[k]) && result[k].every(v => typeof v === 'string'))) throw new Error('The stage returned an incomplete result.');
        stage.result = result; stage.status = 'checking'; this.log(run, stage, 'Saving a separate snapshot and checking JavaScript syntax.');
        const snapshot = join(dir, 'snapshot'); await copyWorkspace(work, snapshot);
        stage.files = await manifest(snapshot); stage.checks = await basicChecks(snapshot, controller.signal);
        if (controller.signal.aborted) return;
        stage.status = 'completed'; stage.finishedAt = timestamp(); this.save(run);
        if (run.testCommand) await this.test(run.id, index, run.testCommand, controller.signal);
        if (controller.signal.aborted) return;
        if (stage.checks.some(c => !c.passed) || stage.tests.some(t => t.status === 'failed')) {
          run.status = 'paused'; run.pauseRequested = true; run.error = 'A check failed. Inspect the snapshot, add feedback, then continue to the next stage.'; this.save(run); return;
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        stage.status = 'failed'; stage.error = error.message; stage.finishedAt = timestamp(); run.status = 'failed'; run.error = error.message; this.save(run); return;
      }
    }
    if (run.status !== 'cancelled') { run.status = 'completed'; run.finishedAt = timestamp(); this.save(run); }
  }
  pause(id) {
    const run = this.get(id); if (!['running', 'preparing', 'pausing'].includes(run.status)) throw new Error('This chain is not running.');
    run.pauseRequested = true; run.status = 'pausing'; this.save(run); return run;
  }
  cancel(id) {
    const run = this.get(id); if (run.status === 'completed') throw new Error('This chain is already complete.');
    run.status = 'cancelled'; this.active.get(id)?.abort();
    for (const stage of run.stages) if (['running', 'preparing', 'checking'].includes(stage.status)) stage.status = 'cancelled';
    this.save(run); return run;
  }
  resume(id, budget) {
    const run = this.get(id); if (this.active.has(id)) throw new Error('The current process is still stopping. Try again shortly.');
    if (!['paused', 'failed', 'interrupted', 'budget_stopped'].includes(run.status)) throw new Error('This chain cannot be resumed.');
    if (this.active.size >= 3) throw new Error('Three chains are already running.');
    if (budget) run.tokenBudget = bounded(budget, run.tokenBudget, 1000, 10000000);
    run.pauseRequested = false; run.status = 'running'; run.error = null; this.save(run);
    const controller = new AbortController(); this.active.set(id, controller);
    const action = run.prepared ? this.drive(run, controller) : this.prepare(run, controller);
    action.catch(error => { run.status = 'failed'; run.error = error.message; this.save(run); }).finally(() => { if (this.active.get(id) === controller) this.active.delete(id); });
    return run;
  }
  feedback(id, index, value) {
    const run = this.get(id); if (!run.stages[index]) throw new Error('Stage not found.');
    const message = text(value, 6000).trim(); if (!message) throw new Error('Enter feedback first.');
    run.feedback.push({ stage: index, text: message, at: timestamp() }); this.save(run); return run;
  }
  async test(id, index, command, signal) {
    const run = this.get(id); const snapshot = this.snapshot(id, index); const stage = run.stages[index];
    if (this.tests.size >= 3) throw new Error('Three tests are already running.');
    if (!command.trim()) throw new Error('Enter a test command.');
    if (stage.tests.some(t => t.status === 'running')) throw new Error('A test is already running for this snapshot.');
    const test = { id: randomUUID(), command: text(command, 4000), status: 'running', startedAt: timestamp(), output: '' };
    const controller = new AbortController();
    stage.tests.push(test); this.tests.set(test.id, controller); this.save(run);
    const dir = join(this.root, id, 'tests', test.id);
    try {
      await copyWorkspace(snapshot, dir);
      const result = await runWorkspaceTest(dir, test.command, { signal: signal ? AbortSignal.any([signal, controller.signal]) : controller.signal });
      test.status = result.code === 0 && !result.termination ? 'passed' : 'failed';
      test.output = [result.stdout, result.stderr, result.termination].filter(Boolean).join('\n').slice(-30000); test.exitCode = result.code;
    } catch (e) { test.status = 'failed'; test.output = e.message; }
    finally { this.tests.delete(test.id); test.finishedAt = timestamp(); this.save(run); await rm(dir, { recursive: true, force: true }); }
    return test;
  }
  stop() { for (const controller of [...this.active.values(), ...this.tests.values()]) controller.abort(); }
}
