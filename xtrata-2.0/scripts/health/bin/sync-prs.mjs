#!/usr/bin/env node
/**
 * Step 2 — refresh the state of every PR the harness has opened (open / merged /
 * closed) and, for closed-unmerged ones, keep the maintainers' review comments
 * so the next runs can learn from the rejection.
 *
 * Only comments from OWNER / MEMBER / COLLABORATOR are kept: on a public repo
 * anyone can comment, and those words feed an agent prompt.
 */
import { gh, args, loadLedger, saveLedger } from '../lib/io.mjs';

const a = args();
const ledger = loadLedger(a.state);
const TRUSTED = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

async function refresh(att) {
  if (!att.pr || att.state === 'merged' || att.state === 'closed') return false;
  const pr = await gh(`/pulls/${att.pr}`);
  const state = pr.merged_at ? 'merged' : pr.state === 'closed' ? 'closed' : 'open';
  if (state === att.state) return false;
  att.state = state;
  att.mergedAt = pr.merged_at ?? null;
  att.closedAt = pr.closed_at ?? null;
  if (state === 'closed') {
    const [comments, reviews] = await Promise.all([
      gh(`/issues/${att.pr}/comments?per_page=50`),
      gh(`/pulls/${att.pr}/reviews?per_page=50`)
    ]);
    att.feedback =
      [...comments, ...reviews]
        .filter((c) => TRUSTED.has(c.author_association) && c.body)
        .map((c) => c.body.trim())
        .join(' | ')
        .slice(0, 1500) || null;
  }
  return true;
}

let changed = 0;
try {
  for (const row of Object.values(ledger.issues))
    for (const att of row.attempts) if (await refresh(att)) changed++;
  for (const att of ledger.coverage ?? []) if (await refresh(att)) changed++;
  for (const att of ledger.harness) if (await refresh(att)) changed++;
} catch (err) {
  console.warn(`PR sync incomplete: ${err.message}`);
}
saveLedger(a.state, ledger);
console.log(`PR states updated: ${changed}`);
