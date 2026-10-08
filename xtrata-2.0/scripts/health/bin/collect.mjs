#!/usr/bin/env node
/**
 * Step 1 — pull today's numbers from the live /debug/data endpoint.
 *
 *   DEBUG_VIEW_KEY=… node scripts/health/bin/collect.mjs [--state dir] [--work dir]
 *   node scripts/health/bin/collect.mjs --fixture scripts/health/__fixtures__   # offline
 *
 * Writes the raw 7d + 24h responses to <work>/ (CI artifact only) and the
 * privacy-safe 24h aggregate to <state>/history/<date>.json.
 */
import { join } from 'node:path';
import { dayRecord, utcDate } from '../lib/core.mjs';
import { args, loadConfig, readJson, setOutput, writeJson } from '../lib/io.mjs';

const a = args();
const config = loadConfig();
const date = a.date ?? utcDate();

async function fetchRange(range) {
  if (a.fixture) return readJson(join(a.fixture, `snapshot-${range}.json`));
  const key = process.env.DEBUG_VIEW_KEY?.trim();
  if (!key) return { ready: false, reason: 'DEBUG_VIEW_KEY is not set' };
  const base = (process.env.HEALTH_SITE ?? config.site).replace(/\/$/, '');
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${base}/debug/data?range=${range}`, {
        headers: { 'x-debug-key': key, 'user-agent': 'xtrata-health' }
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 401) return { ready: false, reason: 'DEBUG_VIEW_KEY was rejected (401)' };
      if (res.ok || body.ready === false) return body;
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (attempt === 3) return { ready: false, reason: `fetch failed: ${err.message}` };
      await new Promise((r) => setTimeout(r, attempt * 5000));
    }
  }
}

const week = await fetchRange('7d');
const day = await fetchRange('24h');
writeJson(join(a.work, 'snapshot-7d.json'), week);
writeJson(join(a.work, 'snapshot-24h.json'), day);

if (day.ready) writeJson(join(a.state, 'history', `${date}.json`), dayRecord(day, date));

console.log(
  week.ready
    ? `collected: 7d ${week.kpis?.totalEvents ?? 0} events / ${week.kpis?.crashOuts ?? 0} crash-outs; 24h ${day.kpis?.totalEvents ?? 0} / ${day.kpis?.crashOuts ?? 0}`
    : `dashboard not ready: ${week.reason ?? week.hint ?? 'unknown'}`
);
setOutput('ready', Boolean(week.ready && day.ready));
