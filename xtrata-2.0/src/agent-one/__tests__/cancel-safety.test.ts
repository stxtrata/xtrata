import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const agentSource = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');
const bundle = readFileSync(
  new URL('../../../xtrata-agent-one/wizard/agent-one.js', import.meta.url),
  'utf8'
);
const wizard = readFileSync(
  new URL('../../../xtrata-agent-one/wizard/index.html', import.meta.url),
  'utf8'
);
const suno = readFileSync(
  new URL('../../../xtrata-agent-one/wizard/suno.html', import.meta.url),
  'utf8'
);

const cancelStart = agentSource.indexOf('  cancelJob: async (id: string) =>');
const cancelSource = agentSource.slice(cancelStart, agentSource.indexOf('recoverJob:', cancelStart));

describe('Agent One cancel safety', () => {
  it('exposes a cancel that returns everything to the payer', () => {
    expect(cancelStart).toBeGreaterThan(-1);
    expect(cancelSource).toContain('job.cancelRequested = true');
    expect(cancelSource).toContain('refundAndClose');
  });

  it('refuses to cancel anything already minted', () => {
    // A minted token cannot be un-minted, so a refund it cannot honour is the
    // wrong answer — recovery, which returns the token, is the right one.
    expect(cancelSource).toContain('job.tokenId || (job.items || []).some');
    expect(cancelSource).toContain('use recovery');
    expect(cancelSource).toContain("['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED'].includes(job.status)");
  });

  it('persists the request so it survives a reload and a busy loop', () => {
    expect(agentSource).toContain('class JobCancelled extends Error');
    expect(agentSource).toContain('const isCancelRequested = (id: string)');
    // The flag is read back from storage, not held in memory — the loop doing the
    // work may be mid-tick in another call stack.
    expect(agentSource).toContain('return !!readJob(id).cancelRequested');
  });

  it('stops only at points where nothing is in flight', () => {
    // Between chunk batches (previous send settled, next not started)...
    expect(agentSource).toContain('assertNotCancelled(job.jobId);\n    const batch = chunks.slice(idx, idx + BATCH);');
    // ...and immediately before the seal, which is what actually mints.
    expect(agentSource).toContain('Last chance to stop: sealing is what MINTS');
    // ...and between batch items.
    expect(agentSource).toContain('Between items: stop before starting the next one');
  });

  it('treats a cancel as a cancel, not an error to retry', () => {
    expect(agentSource).toContain('if (e instanceof JobCancelled || isCancelRequested(id))');
    // The watcher must not cheerfully restart the job it was asked to stop.
    expect(agentSource).toContain('if (j.cancelRequested && !');
  });

  it('ships in the built bundle both pages load', () => {
    // The bundle is a checked-in artifact; a source-only change would leave the
    // button calling a function that is not there.
    expect(bundle).toContain('cancelJob:');
    expect(bundle).toContain('cancelRequested');
    expect(bundle).toContain('cancelled by request');
  });

  it('never leaves a keyless job re-runnable', () => {
    // Observed live: refundAndClose returned on noKey with the status untouched, so
    // the job stayed FUNDED, the watcher re-ran it every few seconds, autoRun threw
    // and the refund landed back here — an endless loop that hammered the API.
    const noKey = agentSource.slice(
      agentSource.indexOf('if (!job.ephemeralMnemonic) {'),
      agentSource.indexOf('return { noKey: true };') + 30
    );
    expect(noKey).toContain("job.status = job.depositReceivedUstx ? 'CANCELLED' : 'EXPIRED'");
    expect(noKey).toContain('writeJob(job)');
  });

  it('treats a funder-lookup failure as transient, not deterministic', () => {
    // It is a Hiro hiccup or a rate limit far more often than a real dead end, and
    // classing it fatal turned one failed lookup into a refund attempt every tick.
    const fatal = /const FATAL_ERR = \/([^/]+)\//.exec(agentSource)?.[1] ?? '';
    expect(fatal).not.toContain('could not determine');
    expect(fatal).toContain('TX abort');
    expect(agentSource).toContain("throw new Error('could not determine the paying address')");
  });

  it('stops re-running a job that has exhausted its retries', () => {
    // Observed live climbing to "attempt 28", two seconds apart. retryCount is
    // incremented inside the retry CONDITION, so it keeps growing even on the way
    // to the fatal path — and the fatal path never updated progressAt, so the
    // "15 s × attempt" backoff was measured against a stale timestamp and never
    // held anything back.
    expect(agentSource).toContain("if ((j.retryCount || 0) > MAX_RETRIES &&");
    expect(agentSource).toContain('parked as NEEDS_RECOVERY instead of resuming again');
    // Search forward from the stamp comment: an earlier `job.cancelReason = reason;`
    // exists in the mock branch, and slicing to that gave an empty string that
    // "contained" nothing and passed vacuously.
    const stampAt = agentSource.indexOf('// Stamp progress on every exit');
    expect(stampAt).toBeGreaterThan(-1);
    const refundEnd = agentSource.slice(
      stampAt,
      agentSource.indexOf('job.cancelReason = reason;', stampAt)
    );
    expect(refundEnd).toContain('job.progressAt = new Date().toISOString()');
  });

  it('lets an explicit cancel rest as cancelled, not expired', () => {
    // EXPIRED is re-runnable by the watcher and still offers its own Stop button,
    // so the job the user just stopped looked like it had not stopped at all.
    expect(agentSource).toContain('else if (job.cancelRequested) {');
    expect(agentSource).toContain("job.status = 'CANCELLED';");
    expect(agentSource).toContain('cancelled before funding — key kept');
    // The key is kept, but flagged as insurance rather than stranded value, so the
    // reminder does not claim a never-funded job is still in progress.
    expect(agentSource).toContain('job.keepKey = true; job.keepKeyGrace = true;');
  });

  it('is reachable from both pages, and degrades honestly on an old bundle', () => {
    for (const page of [wizard, suno]) {
      expect(page).toContain('/cancel$/');
      expect(page).toContain('this agent bundle has no cancel');
    }
    expect(wizard).toContain("act('cancel'");
    expect(suno).toContain("$('#cancelJobBtn')");
    // Offered right up to the mint, and not after it.
    for (const page of [wizard, suno]) {
      expect(page).toContain("['AWAITING_DEPOSIT','AWAITING_PARENT','FUNDED','INSCRIBING','EXPIRED'].includes(st)");
      expect(page).toContain('!job.tokenId');
    }
  });
});
