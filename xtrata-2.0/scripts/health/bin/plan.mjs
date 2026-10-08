#!/usr/bin/env node
/**
 * Step 3 — decide today's work and measure yesterday's.
 *
 * Reads the snapshots from collect.mjs plus the ledger/history, measures any
 * merged fixes that now have enough after-data, ranks today's issues and writes:
 *   <work>/brief.md       human + agent brief (also the job summary)
 *   <work>/brief.json     machine-readable decision for the workflow
 *   <work>/scorecard.md   input for the harness self-review agent
 *   <work>/run.json       this run's metrics (finished by record/finish)
 */
import { join } from 'node:path';
import {
  evaluateAttempts,
  refreshStatuses,
  scorecard,
  touchLedger,
  triage,
  utcDate
} from '../lib/core.mjs';
import { renderBrief, renderScorecard } from '../lib/brief.mjs';
import {
  args,
  loadConfig,
  loadHistory,
  loadLedger,
  loadRuns,
  readJson,
  saveLedger,
  setOutput,
  writeJson,
  writeText
} from '../lib/io.mjs';

const a = args();
const config = loadConfig();
const date = a.date ?? utcDate();
const week = readJson(join(a.work, 'snapshot-7d.json'), { ready: false });
const day = readJson(join(a.work, 'snapshot-24h.json'), { ready: false });
const ledger = loadLedger(a.state);
const history = loadHistory(a.state);

if (week.ready) touchLedger(ledger, week.topIssues ?? [], date);
if (day.ready)
  touchLedger(ledger, day.topIssues ?? [], date, {
    reopen: true,
    events: day.kpis?.totalEvents ?? 0,
    resolvedDrop: config.evaluation.resolvedDrop
  });
refreshStatuses(ledger, config);
const verdicts = evaluateAttempts(ledger, history, config, date);
refreshStatuses(ledger, config);

const t = triage({ week, day, ledger, history, config, today: date });
const card = scorecard(ledger, loadRuns(a.state));

writeText(join(a.work, 'brief.md'), renderBrief({ date, week, day, triage: t, verdicts, card }));
writeText(join(a.work, 'scorecard.md'), renderScorecard({ date, card, verdicts, config }));
const target = t.action.kind === 'fix' ? t.ranked.find((r) => r.fingerprint === t.action.target) : null;
writeJson(join(a.work, 'brief.json'), {
  date,
  action: t.action,
  target: target && {
    fingerprint: target.fingerprint,
    code: target.code,
    flow: target.flow,
    step: target.step,
    sessions: target.sessions,
    occurrences: target.occurrences
  },
  verdicts,
  card
});
writeJson(join(a.work, 'run.json'), {
  date,
  dataReady: Boolean(week.ready),
  action: t.action.kind,
  target: t.action.target ?? null,
  crashOuts24h: day.kpis?.crashOuts ?? null,
  recoveryPct7d: week.kpis?.recoveryPct ?? null,
  verdicts: verdicts.map((v) => v.verdict)
});
saveLedger(a.state, ledger);

// Self-review only has something to learn from once there is outcome evidence.
const evidence = card.closedUnmerged + Object.values(card.verdicts).reduce((s, n) => s + n, 0) + card.recentRuns.count;
setOutput('action', t.action.kind);
setOutput('target', t.action.target ?? '');
setOutput('review_harness', evidence > 0);
console.log(`action: ${t.action.kind}${t.action.target ? ` → ${t.action.target}` : ''} (${t.action.reason ?? ''})`);
