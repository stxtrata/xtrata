// Where jobs live, and which of them the user still needs to deal with.
//
// Deliberately standalone: the home page needs to warn about an abandoned job, and it
// must not pull in the 490 KB agent bundle to do it. Both import from here, so there is
// one definition of "unfinished" and one place the storage key is written down.
//
// localStorage only — no network — so it is safe to call during page load anywhere.

export const JOB_PREFIX = 'xao-job-';
export const jobKey = (id: string) => JOB_PREFIX + id;

export function listJobsRaw(): any[] {
  const o: any[] = [];
  if (typeof localStorage === 'undefined') return o;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(JOB_PREFIX)) {
      try { o.push(JSON.parse(localStorage.getItem(k) as string)); } catch { /* corrupt entry */ }
    }
  }
  return o;
}

// EXPIRED belongs here: it means the deposit window closed WITHOUT a payment, so the
// job is over. Leaving it out made every expired job unfinished forever.
const FINISHED = ['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED', 'FAILED', 'EXPIRED'];

/**
 * True when the key is held purely as a late-payment precaution on a job that never
 * received a penny (see the cancelRequested / EXPIRED branches in agent-core).
 *
 * Nothing is at stake in that case. The key is kept only so a deposit confirming after
 * the window cannot land at a keyless address, and autoRunAll keeps polling those jobs
 * for exactly that — so dropping them from the reminder cannot strand anything. If a
 * late payment does land, the status moves into PAID_STATUS and the job legitimately
 * comes back.
 *
 * Without this, `keepKey` alone marked the job funded, and the banner claimed an
 * inscription was "still in progress" while its own subtitle said "never funded",
 * with a "Not now" button that could never dismiss it for good.
 *
 * The regex is the migration path: jobs already in localStorage were written before
 * keepKeyGrace existed, and both grace reasons end in this exact phrase.
 */
const graceKeyOnly = (j: any) =>
  j.keepKeyGrace === true || /late payment is never stranded/.test(String(j.keepKeyReason || ''));
// Statuses only reachable after payment. A job can also be funded without having moved
// on yet, which `depositReceivedUstx`/`fundedAt` catch.
const PAID_STATUS = ['FUNDED', 'INSCRIBING', 'INSCRIBED', 'DELIVERING', 'AWAITING_PARENT', 'NEEDS_RECOVERY', 'RECOVERING'];

export type UnfinishedJob = {
  jobId: string; status: string; origin: string; label: string;
  progress: string | null; createdAt: string | null; lastSeenAt: string | null;
  funded: boolean; hasKey: boolean; needsRecovery: boolean; href: string;
};

/**
 * Jobs this browser started and never saw through, most pressing first.
 *
 * `funded` is what makes a job urgent rather than merely open: the deposit sits on a
 * one-shot wallet only this browser holds the key to, so nobody else can finish it. An
 * unpaid job has nothing at stake and can simply be abandoned.
 *
 * `status` is what this browser LAST SAW, not what the chain says now — the job may have
 * completed since. Callers must offer to go and look, never assert that it is stuck.
 */
export function unfinishedJobs(): UnfinishedJob[] {
  return listJobsRaw()
    // A KEPT KEY means the job is not done with the user, whatever its status says.
    // COMPLETE only describes the inscription; never-strand keeps the key whenever STX
    // or an inscription is still sitting in the deposit wallet, and those jobs were
    // being filtered straight out — so a COMPLETE job holding 6.2 STX reported
    // "nothing was paid, so nothing is at stake".
    .filter(
      (j) =>
        j &&
        j.jobId &&
        (!FINISHED.includes(j.status) ||
          ((j.keepKey || j.ephemeralMnemonic) && !graceKeyOnly(j)))
    )
    .map((j) => ({
      jobId: String(j.jobId),
      status: String(j.status || 'UNKNOWN'),
      origin: j.origin || 'wizard',
      label: j.uri || j.fileName || (j.items ? `${j.items.length} items` : 'inscription'),
      progress: j.progress || null,
      createdAt: j.createdAt || null,
      lastSeenAt: j.progressAt || j.fundedAt || j.createdAt || null,
      // A kept key still implies money is at stake, EXCEPT when it is only being held
      // against a late payment on a job that was never funded.
      funded:
        !!(j.depositReceivedUstx || j.fundedAt) ||
        PAID_STATUS.includes(j.status) ||
        (!!j.keepKey && !graceKeyOnly(j)),
      // Why the key is still held, so the reminder can say what is actually owed.
      keepKeyReason: j.keepKeyReason || null,
      hasKey: !!j.ephemeralMnemonic,
      needsRecovery: j.status === 'NEEDS_RECOVERY',
      href: (j.origin === 'suno' ? '/wizard/suno' : '/wizard/') + `?job=${encodeURIComponent(j.jobId)}`
    }))
    .sort((a, b) => Number(b.funded) - Number(a.funded) || String(b.lastSeenAt).localeCompare(String(a.lastSeenAt)));
}
