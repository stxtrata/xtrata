// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { unfinishedJobs, jobKey } from '../unfinished';
import { dismissUnfinished, unfinishedBanner } from '../ui-panels';

/**
 * The agent runs in the tab, so a job the user walked away from is invisible from
 * everywhere else. When it was PAID for, the deposit is on a one-shot wallet only
 * this browser holds the key to — nobody else can finish it or send it back.
 *
 * The line these tests hold: the reminder reports what this browser LAST SAW. It must
 * never assert that a job is stuck, because it may well have completed since.
 */

const put = (j: any) => localStorage.setItem(jobKey(j.jobId), JSON.stringify(j));
const iso = (minsAgo: number) => new Date(Date.now() - minsAgo * 60000).toISOString();

beforeEach(() => { localStorage.clear(); document.body.innerHTML = ''; document.head.innerHTML = ''; });

describe('which jobs count as unfinished', () => {
  it('ignores jobs that reached an end state', () => {
    for (const status of ['COMPLETE', 'COMPLETE_WITH_SKIPS', 'CANCELLED', 'FAILED']) {
      put({ jobId: `j-${status}`, status });
    }
    expect(unfinishedJobs()).toEqual([]);
  });

  it('treats a job as funded once the deposit landed, whatever the status says', () => {
    put({ jobId: 'paid', status: 'AWAITING_DEPOSIT', depositReceivedUstx: '2000000' });
    expect(unfinishedJobs()[0].funded).toBe(true);
  });

  it('does not call an unpaid job funded', () => {
    put({ jobId: 'unpaid', status: 'AWAITING_DEPOSIT', createdAt: iso(30) });
    expect(unfinishedJobs()[0].funded).toBe(false);
  });

  it('counts every status only reachable after payment', () => {
    for (const status of ['FUNDED', 'INSCRIBING', 'INSCRIBED', 'DELIVERING', 'AWAITING_PARENT', 'NEEDS_RECOVERY']) {
      localStorage.clear();
      put({ jobId: 'j', status });
      expect(unfinishedJobs()[0].funded, `${status} should count as paid`).toBe(true);
    }
  });

  it('puts money at the top, then the most recently seen', () => {
    put({ jobId: 'old-paid', status: 'INSCRIBING', progressAt: iso(600) });
    put({ jobId: 'new-unpaid', status: 'AWAITING_DEPOSIT', createdAt: iso(1) });
    put({ jobId: 'newer-paid', status: 'FUNDED', progressAt: iso(5) });
    expect(unfinishedJobs().map((j) => j.jobId)).toEqual(['newer-paid', 'old-paid', 'new-unpaid']);
  });

  it('sends the user back to the surface they started on', () => {
    put({ jobId: 'song', status: 'FUNDED', origin: 'suno' });
    put({ jobId: 'file', status: 'FUNDED', origin: 'wizard' });
    const by = Object.fromEntries(unfinishedJobs().map((j) => [j.jobId, j.href]));
    expect(by.song).toBe('/wizard/suno?job=song');
    expect(by.file).toBe('/wizard/?job=file');
  });

  it('survives a corrupt entry rather than losing the rest', () => {
    localStorage.setItem(jobKey('broken'), '{not json');
    put({ jobId: 'fine', status: 'FUNDED' });
    expect(unfinishedJobs().map((j) => j.jobId)).toEqual(['fine']);
  });

  it('never exposes the deposit key', () => {
    put({ jobId: 'j', status: 'FUNDED', ephemeralMnemonic: 'twelve words that must not leak' });
    const j: any = unfinishedJobs()[0];
    expect(JSON.stringify(j)).not.toContain('twelve words');
    expect(j.hasKey).toBe(true);
  });
});

describe('a job that is "finished" but still holds money', () => {
  it('is still unfinished while the key is kept', () => {
    // COMPLETE describes the INSCRIPTION, not the wallet. Never-strand keeps the key
    // whenever STX or an inscription is still sitting there, and those jobs were being
    // filtered out entirely — so a COMPLETE job holding 6.2 STX reported "nothing was
    // paid, so nothing is at stake".
    put({ jobId: 'done-but-holding', status: 'COMPLETE', keepKey: true,
          keepKeyReason: 'wallet still holds 6199461 uSTX — sweep with recover-all',
          progressAt: iso(5) });
    const [j] = unfinishedJobs();
    expect(j.jobId).toBe('done-but-holding');
    expect(j.funded).toBe(true);                    // there is money in it right now
    expect(j.keepKeyReason).toContain('6199461');
  });

  it('leaves a genuinely finished job alone', () => {
    put({ jobId: 'really-done', status: 'COMPLETE', progressAt: iso(5) });
    expect(unfinishedJobs()).toEqual([]);
  });

  it('counts a cancelled job that never released its key', () => {
    put({ jobId: 'cancelled-holding', status: 'CANCELLED', ephemeralMnemonic: 'x', progressAt: iso(5) });
    expect(unfinishedJobs().map((j) => j.jobId)).toEqual(['cancelled-holding']);
  });
});

/**
 * A key kept ONLY against a late payment is not money at stake.
 *
 * Reported from production: four EXPIRED jobs and a permanent banner reading "You have
 * an inscription still in progress" whose own subtitle said "never funded". EXPIRED was
 * missing from the finished list, and `keepKey` alone was enough to mark a job funded,
 * so the reminder was both wrong and impossible to dismiss.
 */
describe('a key kept only against a late payment', () => {
  const GRACE = 'never funded — key kept so a late payment is never stranded';

  it('does not keep an expired, never-funded job alive forever', () => {
    put({ jobId: 'expired-grace', status: 'EXPIRED', keepKey: true, keepKeyGrace: true,
          keepKeyReason: GRACE, progressAt: iso(90) });
    expect(unfinishedJobs()).toEqual([]);
  });

  it('does the same for a job cancelled before it was ever funded', () => {
    put({ jobId: 'cancelled-grace', status: 'CANCELLED', keepKey: true, keepKeyGrace: true,
          keepKeyReason: 'cancelled before funding — key kept so a late payment is never stranded',
          progressAt: iso(90) });
    expect(unfinishedJobs()).toEqual([]);
  });

  // Jobs already in localStorage predate the flag, so the reason string has to work too,
  // or the fix would not clear the banner for anyone already seeing it.
  it('recognises jobs stored before keepKeyGrace existed', () => {
    put({ jobId: 'legacy-grace', status: 'EXPIRED', keepKey: true, keepKeyReason: GRACE, progressAt: iso(90) });
    expect(unfinishedJobs()).toEqual([]);
  });

  it('still surfaces an expired job that DID take money', () => {
    put({ jobId: 'expired-but-paid', status: 'EXPIRED', keepKey: true,
          depositReceivedUstx: '6199461',
          keepKeyReason: 'wallet still holds 6199461 uSTX — sweep with recover-all',
          progressAt: iso(90) });
    const [j] = unfinishedJobs();
    expect(j.jobId).toBe('expired-but-paid');
    expect(j.funded).toBe(true);
  });

  it('shows no banner at all for a grace-only job', () => {
    put({ jobId: 'expired-grace', status: 'EXPIRED', keepKey: true, keepKeyGrace: true,
          keepKeyReason: GRACE, label: 'xtrata:audio/where-every-note-remains', progressAt: iso(90) });
    expect(unfinishedBanner()).toBeNull();
    expect(document.querySelector('.xao-unfinished')).toBeNull();
  });

  it('never claims a never-funded job is in progress', () => {
    // The contradiction users actually saw: the funded headline above the unfunded reason.
    put({ jobId: 'grace-plus-real', status: 'EXPIRED', keepKey: true, keepKeyGrace: true,
          keepKeyReason: GRACE, progressAt: iso(90) });
    put({ jobId: 'genuinely-open', status: 'AWAITING_DEPOSIT', uri: 'xtrata:text/thing', createdAt: iso(30) });
    const job = unfinishedBanner();
    expect(job?.jobId).toBe('genuinely-open');
    const text = document.querySelector('.xao-unfinished')?.textContent ?? '';
    expect(text).not.toContain('still in progress');
    expect(text).toContain('never paid for it');
  });
});

describe('the reminder itself', () => {
  it('says nothing when there is nothing to say', () => {
    expect(unfinishedBanner()).toBeNull();
    expect(document.querySelector('.xao-unfinished')).toBeNull();
  });

  it('does not nag about the job the page is already running', () => {
    put({ jobId: 'live', status: 'INSCRIBING' });
    expect(unfinishedBanner({ skipJobId: 'live' })).toBeNull();
  });

  it('explains why a paid job needs them, not just that it exists', () => {
    put({ jobId: 'j', status: 'INSCRIBING', label: 'song.mp3', uri: 'song.mp3', progressAt: iso(90) });
    unfinishedBanner();
    const text = document.querySelector('.xao-unfinished')!.textContent!;
    expect(text).toContain('still in progress');
    expect(text).toContain('only this browser holds the key');
    expect(text).toContain('song.mp3');
    // Local memory, not a claim about the chain.
    expect(text).toContain('last seen');
    expect(text).not.toMatch(/stuck|failed|lost/i);
  });

  it('is explicit that an unpaid job costs nothing', () => {
    put({ jobId: 'j', status: 'AWAITING_DEPOSIT', uri: 'draft.txt', createdAt: iso(200) });
    unfinishedBanner();
    const text = document.querySelector('.xao-unfinished')!.textContent!;
    expect(text).toContain('never paid');
    expect(text).toContain('nothing at stake');
  });

  it('lets an unpaid job be dismissed for good', () => {
    put({ jobId: 'j', status: 'AWAITING_DEPOSIT', createdAt: iso(10) });
    unfinishedBanner();
    (document.querySelector('.xao-dismiss') as HTMLElement).click();
    expect(document.querySelector('.xao-unfinished')).toBeNull();
    expect(unfinishedBanner()).toBeNull();          // stays gone next visit
  });

  it('brings a PAID job back next visit however often it is waved away', () => {
    put({ jobId: 'j', status: 'FUNDED', progressAt: iso(10) });
    unfinishedBanner();
    (document.querySelector('.xao-dismiss') as HTMLElement).click();
    expect(document.querySelector('.xao-unfinished')).toBeNull();   // gone for now
    // Money is still on that wallet, so the reminder is not the user's to switch off.
    dismissUnfinished('j');
    expect(unfinishedBanner()).not.toBeNull();
  });

  it('shows one banner, not one per visit', () => {
    put({ jobId: 'j', status: 'FUNDED', progressAt: iso(10) });
    unfinishedBanner();
    unfinishedBanner();
    expect(document.querySelectorAll('.xao-unfinished')).toHaveLength(1);
  });

  it('renders the file name as text, never as markup', () => {
    put({ jobId: 'j', status: 'FUNDED', uri: '<img src=x onerror=alert(1)>', progressAt: iso(5) });
    unfinishedBanner();
    expect(document.querySelector('.xao-unfinished')!.querySelector('img')).toBeNull();
  });

  it('survives storage being unreadable instead of breaking the page', () => {
    const real = Object.getOwnPropertyDescriptor(Storage.prototype, 'length');
    Object.defineProperty(Storage.prototype, 'length', { get() { throw new Error('denied'); }, configurable: true });
    expect(() => unfinishedBanner()).not.toThrow();
    if (real) Object.defineProperty(Storage.prototype, 'length', real);
  });
});
