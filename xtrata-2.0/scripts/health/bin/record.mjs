#!/usr/bin/env node
/**
 * Step 6/7 — remember what was opened, and close out the run.
 *
 *   record.mjs --mode site    --pr 123 [--tests pass|fail]   after the site PR is opened
 *   record.mjs --mode harness --pr 124                        after the harness PR is opened
 *   record.mjs --mode finish                                  always, at the end
 *
 * The agent's own claim of which issues it addressed comes from
 * <work>/site-result.json; the planned target is the fallback.
 */
import { join } from 'node:path';
import { refreshStatuses } from '../lib/core.mjs';
import { appendRun, args, loadConfig, loadLedger, readJson, saveLedger, writeJson } from '../lib/io.mjs';

const a = args();
const config = loadConfig();
const ledger = loadLedger(a.state);
const brief = readJson(join(a.work, 'brief.json'), {});
const runPath = join(a.work, 'run.json');
const run = readJson(runPath, { date: brief.date });
const pr = a.pr ? Number(a.pr) : null;

if (a.mode === 'site') {
  const result = readJson(join(a.work, 'site-result.json'), {});
  const fps = (Array.isArray(result.fingerprints) && result.fingerprints.length
    ? result.fingerprints
    : [brief.action?.kind === 'fix' ? brief.action.target : null]
  ).filter((fp) => fp && ledger.issues[fp]);
  for (const fp of fps)
    ledger.issues[fp].attempts.push({
      date: brief.date,
      pr,
      kind: result.kind ?? brief.action?.kind ?? 'fix',
      state: pr ? 'open' : 'not_opened',
      tests: a.tests ?? null
    });
  if (!fps.length && pr) (ledger.coverage ??= []).push({ date: brief.date, pr, kind: brief.action?.kind, target: brief.action?.target, state: 'open' });
  Object.assign(run, { siteChanged: true, sitePr: pr, testsPassed: a.tests ? a.tests === 'pass' : null, addressed: fps });
} else if (a.mode === 'harness') {
  if (pr) ledger.harness.push({ date: brief.date, pr, state: 'open' });
  Object.assign(run, { harnessPr: pr });
} else if (a.mode === 'finish') {
  const guard = readJson(join(a.work, 'guard.json'), {});
  run.guardViolations = (guard.site?.reverted?.length ?? 0) + (guard.harness?.reverted?.length ?? 0);
  run.siteChanged ??= Boolean(guard.site?.changed);
  run.finishedAt = new Date().toISOString();
  appendRun(a.state, run);
}

refreshStatuses(ledger, config);
saveLedger(a.state, ledger);
writeJson(runPath, run);
console.log(`recorded ${a.mode}${pr ? ` PR #${pr}` : ''}`);
