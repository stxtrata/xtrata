/**
 * Pure logic for the daily health cycle. No I/O here — everything is
 * deterministic and unit-tested (scripts/health/__tests__/health.test.ts).
 *
 *   /debug/data snapshot ──▶ dayRecord()   (aggregated, privacy-safe history row)
 *   history + ledger     ──▶ evaluateAttempts() (did merged fixes actually work?)
 *   7d + 24h + ledger    ──▶ triage()      (what should today's run work on?)
 *   ledger               ──▶ scorecard()   (how well is the harness itself doing?)
 */

const int = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function utcDate(ms = Date.now()) {
  return new Date(ms).toISOString().slice(0, 10);
}

export function codeClass(code, config) {
  const c = code ?? '';
  const classes = config.codeClasses;
  if (classes.ops.includes(c)) return 'ops';
  if (classes.user.includes(c)) return 'user';
  if (classes.unknown.includes(c)) return 'unknown';
  return 'review';
}

/**
 * Reduce a /debug/data response to the privacy-safe aggregate kept in history.
 * Deliberately drops samples, stacks, context, routes and per-person fields:
 * history lives on a git branch and must never hold anything but counts.
 */
export function dayRecord(snapshot, date) {
  const k = snapshot?.kpis ?? {};
  return {
    date,
    generatedAt: int(snapshot?.generatedAt) || null,
    totals: {
      events: int(k.totalEvents),
      crashOuts: int(k.crashOuts),
      sessions: int(k.sessionsTotal),
      sessionsAffected: int(k.sessionsAffected),
      distinctIssues: int(k.distinctIssues),
      erroredJourneys: int(k.erroredJourneys),
      recoveredJourneys: int(k.recoveredJourneys),
      recoveryPct: k.recoveryPct == null ? null : int(k.recoveryPct)
    },
    byFlow: (snapshot?.byFlow ?? []).map((f) => ({
      flow: String(f.flow ?? ''),
      errors: int(f.errors),
      events: int(f.events)
    })),
    issues: (snapshot?.topIssues ?? []).map((i) => ({
      fp: String(i.fingerprint ?? ''),
      code: i.errorCode ?? null,
      flow: i.flow ?? null,
      step: i.step ?? null,
      occ: int(i.occurrences),
      sessions: int(i.sessions),
      wallets: int(i.wallets)
    })),
    funnels: (snapshot?.funnels ?? []).flatMap((f) =>
      (f.steps ?? []).map((s) => ({
        flow: String(f.flow ?? s.flow ?? ''),
        step: s.step ?? null,
        started: int(s.started),
        succeeded: int(s.succeeded),
        errored: int(s.errored),
        abandoned: int(s.abandoned)
      }))
    )
  };
}

export function emptyLedger() {
  return { version: 1, issues: {}, coverage: [], harness: [] };
}

/**
 * Make sure every fingerprint seen has a ledger row. Only the last-24h list
 * (`reopen: true`) can re-open a resolved issue — the 7-day list still contains
 * days from before the fix and would un-resolve everything immediately. A fix
 * that cut an issue by 90% still leaves the odd occurrence, so a resolved issue
 * is only reopened when today's rate climbs back above the "resolved" line
 * (baseline × (1 − resolvedDrop)).
 */
export function touchLedger(ledger, issues, date, { reopen = false, events = 0, resolvedDrop = 0.8 } = {}) {
  for (const i of issues) {
    const fp = i.fingerprint ?? i.fp;
    if (!fp) continue;
    const row = (ledger.issues[fp] ??= {
      code: i.errorCode ?? i.code ?? null,
      flow: i.flow ?? null,
      step: i.step ?? null,
      firstSeen: date,
      lastSeen: date,
      status: 'open',
      attempts: []
    });
    if (!reopen) continue;
    row.lastSeen = date;
    if (row.status === 'resolved') {
      const perK = events > 0 ? (int(i.occurrences ?? i.occ) / events) * 1000 : Infinity;
      const baseline = row.resolvedBaselinePerK ?? 0;
      if (perK > baseline * (1 - resolvedDrop)) {
        row.status = 'open';
        row.regressedOn = date;
      }
    }
  }
  return ledger;
}

function rateFor(day, fp) {
  const events = day.totals.events;
  const hit = day.issues.find((i) => i.fp === fp);
  const occ = hit ? hit.occ : 0;
  return { occ, events, perK: events > 0 ? (occ / events) * 1000 : occ > 0 ? Infinity : 0 };
}

function average(xs) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

/**
 * For every merged attempt without a verdict, compare the issue's rate per 1k
 * events over `windowDays` before the merge day with `windowDays` after it.
 * Rates (not raw counts) so a traffic swing does not read as a fix or regression.
 */
export function evaluateAttempts(ledger, history, config, today) {
  const { windowDays, resolvedDrop, improvedDrop, regressedRise, minBaselineOccurrences } =
    config.evaluation;
  const days = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const verdicts = [];
  for (const [fp, row] of Object.entries(ledger.issues)) {
    for (const att of row.attempts) {
      if (att.state !== 'merged' || att.verdict || !att.mergedAt) continue;
      const mergeDay = utcDate(Date.parse(att.mergedAt));
      const before = days.filter((d) => d.date < mergeDay).slice(-windowDays);
      const after = days.filter((d) => d.date > mergeDay && d.date <= today).slice(0, windowDays);
      if (after.length < windowDays) continue; // still waiting for data
      const b = before.map((d) => rateFor(d, fp));
      const a = after.map((d) => rateFor(d, fp));
      const beforeOcc = b.reduce((s, x) => s + x.occ, 0);
      const bRate = average(b.map((x) => x.perK));
      const aRate = average(a.map((x) => x.perK));
      let verdict;
      if (beforeOcc < minBaselineOccurrences) verdict = 'inconclusive';
      else if (aRate === 0 || aRate <= bRate * (1 - resolvedDrop)) verdict = 'resolved';
      else if (aRate <= bRate * (1 - improvedDrop)) verdict = 'improved';
      else if (aRate >= bRate * (1 + regressedRise)) verdict = 'regressed';
      else verdict = 'no_effect';
      att.verdict = verdict;
      att.evaluatedAt = today;
      att.before = { days: before.length, occ: beforeOcc, perK: round(bRate) };
      att.after = { days: after.length, occ: a.reduce((s, x) => s + x.occ, 0), perK: round(aRate) };
      if (verdict === 'resolved') {
        row.status = 'resolved';
        row.resolvedBaselinePerK = att.before.perK;
      } else row.status = 'open';
      verdicts.push({ fp, code: row.code, pr: att.pr, verdict, before: att.before, after: att.after });
    }
  }
  return verdicts;
}

function round(x) {
  return Number.isFinite(x) ? Math.round(x * 100) / 100 : x;
}

/** Derive each ledger row's status from its attempts (PR states + verdicts). */
export function refreshStatuses(ledger, config) {
  for (const row of Object.values(ledger.issues)) {
    const atts = row.attempts;
    if (atts.some((a) => a.state === 'open')) row.status = 'in_review';
    else if (atts.some((a) => a.state === 'merged' && !a.verdict)) row.status = 'awaiting_eval';
    else if (row.status === 'resolved') continue;
    else {
      const failed = atts.filter(
        (a) => a.state === 'closed' || ['no_effect', 'regressed'].includes(a.verdict)
      ).length;
      row.status = failed >= config.limits.maxAttemptsPerIssue ? 'needs_human' : 'open';
    }
  }
  return ledger;
}

export function openSitePrs(ledger) {
  const prs = new Set();
  for (const row of Object.values(ledger.issues))
    for (const a of row.attempts) if (a.state === 'open' && a.pr) prs.add(a.pr);
  for (const a of ledger.coverage ?? []) if (a.state === 'open' && a.pr) prs.add(a.pr);
  return prs.size;
}

/**
 * Rank issues and choose today's single target. One focused PR a day is the
 * point: small, reviewable, and attributable when we later measure its effect.
 */
export function triage({ week, day, ledger, history, config, today }) {
  const s = config.scoring;
  const prior = history.filter((d) => d.date < today);
  const seenBefore = new Set(prior.flatMap((d) => d.issues.map((i) => i.fp)));
  const dayIssues = new Map((day?.topIssues ?? []).map((i) => [i.fingerprint, i]));
  const weekDays = Math.max(1, int(week?.rangeHours) / 24 || 7);

  const ranked = (week?.topIssues ?? []).map((i) => {
    const fp = i.fingerprint;
    const cls = codeClass(i.errorCode, config);
    const sessions = int(i.sessions);
    const occ = int(i.occurrences);
    const today24 = int(dayIssues.get(fp)?.occurrences);
    const dailyAvg = occ / weekDays;
    const isNew = prior.length > 0 && !seenBefore.has(fp);
    const rising = today24 > 0 && dailyAvg > 0 && today24 >= dailyAvg * s.risingRatio;
    let score = (sessions + occ * s.occurrenceWeight) * s.classWeight[cls];
    if (isNew) score *= s.newMultiplier;
    if (rising) score *= s.risingMultiplier;
    const row = ledger.issues[fp];
    const status = row?.status ?? 'open';
    let skip = null;
    if (sessions < s.minSessions) skip = 'too few people affected';
    if (status === 'in_review') skip = 'a fix PR is already open';
    if (status === 'awaiting_eval') skip = 'a fix was merged; waiting to measure it';
    if (status === 'resolved') skip = 'a merged fix measured as resolved';
    if (status === 'needs_human') skip = `${config.limits.maxAttemptsPerIssue} attempts did not fix it — needs Jim`;
    return {
      fingerprint: fp,
      code: i.errorCode ?? null,
      flow: i.flow ?? null,
      step: i.step ?? null,
      cls,
      occurrences: occ,
      sessions,
      wallets: int(i.wallets),
      today: today24,
      isNew,
      rising,
      regressed: Boolean(row?.regressedOn),
      priorAttempts: (row?.attempts ?? []).map((a) => ({
        pr: a.pr,
        state: a.state,
        verdict: a.verdict ?? null,
        feedback: a.feedback ?? null
      })),
      score: round(score),
      skip,
      sample: i.sample ?? null,
      route: i.route ?? null,
      appVersion: i.appVersion ?? null,
      walletKind: i.walletKind ?? null,
      browser: i.browser ?? null,
      device: i.device ?? null,
      stack: i.stack ?? null,
      context: i.context ?? null
    };
  });
  ranked.sort((a, b) => b.score - a.score);

  const gaps = coverageGaps(week, config);
  const open = openSitePrs(ledger);
  const eligible = ranked.filter((r) => !r.skip);

  let action = { kind: 'none', reason: 'nothing actionable today' };
  if (!week?.ready) action = { kind: 'none', reason: 'dashboard data unavailable' };
  else if (open >= config.limits.maxOpenSitePrs)
    action = { kind: 'none', reason: `${open} health PRs already waiting for review` };
  else if (eligible.length) action = { kind: 'fix', target: eligible[0].fingerprint };
  else if (gaps.length) action = { kind: gaps[0].kind, target: gaps[0].flow ?? gaps[0].kind, gap: gaps[0] };

  return { ranked, eligible, gaps, openSitePrs: open, action };
}

export function coverageGaps(week, config) {
  const gaps = [];
  if (!week?.ready) return gaps;
  const flows = new Map((week.byFlow ?? []).map((f) => [f.flow, int(f.events)]));
  for (const flow of config.expectedFlows) {
    if ((flows.get(flow) ?? 0) < config.coverage.minEventsForFlow)
      gaps.push({ kind: 'instrument', flow, why: `no telemetry events from "${flow}" in 7 days` });
  }
  const errors = int(week.kpis?.crashOuts);
  const uncaught = (week.topIssues ?? [])
    .filter((i) => codeClass(i.errorCode, config) === 'unknown')
    .reduce((s, i) => s + int(i.occurrences), 0);
  if (errors > 0 && uncaught / errors >= config.coverage.uncaughtShareForClassify)
    gaps.push({
      kind: 'classify',
      flow: null,
      why: `${Math.round((uncaught / errors) * 100)}% of crash-outs have no specific error code`
    });
  return gaps;
}

/** How well the harness is doing — the input to its own daily self-review. */
export function scorecard(ledger, runs = []) {
  const atts = Object.values(ledger.issues).flatMap((r) =>
    r.attempts.map((a) => ({ ...a, code: r.code }))
  );
  const by = (k, v) => atts.filter((a) => a[k] === v).length;
  const merged = by('state', 'merged');
  const closed = by('state', 'closed');
  const verdicts = ['resolved', 'improved', 'no_effect', 'regressed', 'inconclusive'];
  const v = Object.fromEntries(verdicts.map((x) => [x, by('verdict', x)]));
  const conclusive = v.resolved + v.improved + v.no_effect + v.regressed;
  const recentRuns = runs.slice(-14);
  return {
    prsOpened: atts.length,
    open: by('state', 'open'),
    merged,
    closedUnmerged: closed,
    mergeRate: merged + closed ? round(merged / (merged + closed)) : null,
    verdicts: v,
    fixPrecision: conclusive ? round((v.resolved + v.improved) / conclusive) : null,
    needsHuman: Object.values(ledger.issues).filter((r) => r.status === 'needs_human').length,
    rejected: atts
      .filter((a) => a.state === 'closed')
      .slice(-5)
      .map((a) => ({ pr: a.pr, code: a.code, feedback: a.feedback ?? null })),
    failedFixes: atts
      .filter((a) => ['no_effect', 'regressed'].includes(a.verdict))
      .slice(-5)
      .map((a) => ({ pr: a.pr, code: a.code, verdict: a.verdict, before: a.before, after: a.after })),
    harnessPrs: ledger.harness.slice(-5),
    recentRuns: {
      count: recentRuns.length,
      noAction: recentRuns.filter((r) => r.action === 'none').length,
      claudeProducedNoChange: recentRuns.filter((r) => r.action !== 'none' && !r.siteChanged).length,
      testFailures: recentRuns.filter((r) => r.testsPassed === false).length,
      guardViolations: recentRuns.reduce((s, r) => s + (r.guardViolations ?? 0), 0)
    }
  };
}

/** Path rules for the guard step. Paths are relative to xtrata-2.0/. */
export function checkPaths(files, mode, config) {
  const p = config.paths;
  const violations = [];
  const sensitive = [];
  for (const f of files) {
    const starts = (prefix) => f === prefix || f.startsWith(prefix);
    if (mode === 'harness') {
      if (!p.harnessAllowed.some(starts)) violations.push(f);
    } else {
      if (f.startsWith('../') || p.siteForbidden.some(starts) || f.includes('.timestamp-'))
        violations.push(f);
      else if (p.siteSensitive.some(starts)) sensitive.push(f);
    }
  }
  return { violations, sensitive };
}
