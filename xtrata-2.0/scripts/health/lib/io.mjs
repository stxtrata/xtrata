/**
 * File + network helpers for the health bins. Kept apart from core.mjs so the
 * logic stays pure and testable.
 *
 * Layout:
 *   <state>/ledger.json          issues, fix attempts, verdicts, harness PRs
 *   <state>/history/<date>.json  privacy-safe daily aggregates (counts only)
 *   <state>/runs.jsonl           one line per daily run (harness metrics)
 *   <work>/                      today's raw snapshots, brief, agent outputs
 *                                (CI artifact only — never committed)
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emptyLedger } from './core.mjs';

export const HEALTH_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function args(argv = process.argv.slice(2)) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next == null || next.startsWith('--')) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  out.state = resolve(out.state ?? process.env.HEALTH_STATE_DIR ?? '.health-state');
  out.work = resolve(out.work ?? process.env.HEALTH_WORK_DIR ?? '.health-work');
  return out;
}

export function loadConfig() {
  return readJson(join(HEALTH_DIR, 'config.json'));
}

export function readJson(path, fallback) {
  if (!existsSync(path)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`missing ${path}`);
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
}

export function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

export function loadLedger(state) {
  const l = readJson(join(state, 'ledger.json'), emptyLedger());
  l.issues ??= {};
  l.coverage ??= [];
  l.harness ??= [];
  return l;
}

export function saveLedger(state, ledger) {
  writeJson(join(state, 'ledger.json'), ledger);
}

export function loadHistory(state) {
  const dir = join(state, 'history');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort()
    .map((f) => readJson(join(dir, f)));
}

export function loadRuns(state) {
  const p = join(state, 'runs.jsonl');
  if (!existsSync(p)) return [];
  return readFileSync(p, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

export function appendRun(state, run) {
  mkdirSync(state, { recursive: true });
  appendFileSync(join(state, 'runs.jsonl'), JSON.stringify(run) + '\n');
}

export function setOutput(name, value) {
  const f = process.env.GITHUB_OUTPUT;
  const line = `${name}=${String(value).replace(/\n/g, ' ')}\n`;
  if (f) appendFileSync(f, line);
  else process.stdout.write(`[output] ${line}`);
}

/** GitHub REST helper (GITHUB_TOKEN + GITHUB_REPOSITORY from Actions). */
export async function gh(path, { token = process.env.GITHUB_TOKEN, repo = process.env.GITHUB_REPOSITORY } = {}) {
  if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are required');
  const res = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'xtrata-health'
    }
  });
  if (!res.ok) throw new Error(`GitHub ${path}: ${res.status}`);
  return res.json();
}
