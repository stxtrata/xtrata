#!/usr/bin/env node
/**
 * Step 5 — deterministic guardrail between the agent and a pull request.
 *
 *   node scripts/health/bin/guard.mjs --mode site|harness   (run from the repo root)
 *
 * Reverts any change outside the paths the mode allows (and records it), then
 * enforces size limits. The agent is told the same rules in its playbook; this
 * step is what actually holds them.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { checkPaths } from '../lib/core.mjs';
import { args, loadConfig, readJson, setOutput, writeJson } from '../lib/io.mjs';

const a = args();
const mode = a.mode === 'harness' ? 'harness' : 'site';
const config = loadConfig();
const APP = 'xtrata-2.0/';
const git = (...xs) => execFileSync('git', xs, { encoding: 'utf8' });

function changes() {
  const out = [];
  for (const line of git('status', '--porcelain=v1', '-uall').split('\n').filter(Boolean)) {
    const code = line.slice(0, 2);
    let path = line.slice(3);
    if (path.includes(' -> ')) path = path.split(' -> ')[1];
    path = path.replace(/^"|"$/g, '');
    out.push({ path, untracked: code === '??' });
  }
  return out;
}
const rel = (p) => (p.startsWith(APP) ? p.slice(APP.length) : `../${p}`);

let files = changes();
const { violations } = checkPaths(files.map((f) => rel(f.path)), mode, config);
for (const v of violations) {
  const f = files.find((x) => rel(x.path) === v);
  if (f.untracked) rmSync(f.path, { force: true, recursive: true });
  else git('checkout', '--', f.path);
}

files = changes();
const relPaths = files.map((f) => rel(f.path));
const { sensitive } = checkPaths(relPaths, mode, config);
let lines = 0;
for (const row of git('diff', '--numstat').split('\n').filter(Boolean)) {
  const [add, del] = row.split('\t');
  lines += (Number(add) || 0) + (Number(del) || 0);
}
for (const f of files.filter((x) => x.untracked)) {
  try {
    lines += readFileSync(f.path, 'utf8').split('\n').length;
  } catch {
    /* binary or directory */
  }
}

const maxLines = mode === 'harness' ? config.limits.maxHarnessChangedLines : config.limits.maxChangedLines;
const tooBig = lines > maxLines || files.length > config.limits.maxChangedFiles;
const result = {
  mode,
  changed: files.length > 0,
  files: relPaths,
  lines,
  reverted: violations,
  sensitive,
  tooBig,
  ok: files.length > 0 && !tooBig
};
const prev = readJson(join(a.work, 'guard.json'), {});
writeJson(join(a.work, 'guard.json'), { ...prev, [mode]: result });

console.log(JSON.stringify(result, null, 2));
setOutput('changed', result.changed);
setOutput('ok', result.ok);
setOutput('sensitive', sensitive.length > 0);
setOutput('reverted', violations.length);
