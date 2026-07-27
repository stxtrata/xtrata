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
