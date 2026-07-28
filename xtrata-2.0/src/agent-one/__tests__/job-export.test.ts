import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FakeChain, PAYER, loadAgent, unloadAgent } from './support/fake-chain';

/**
 * Jobs live in localStorage, which is per-ORIGIN: xtrata.xyz and a pages.dev preview
 * keep entirely separate histories, so an inscription completed on one is invisible on
 * the other. This moves the RECORDS across.
 *
 * The line that must never move with them is the deposit key. A key is what makes
 * "only this browser can spend that wallet" true; copying one to a second origin makes
 * that claim false and lets two tabs race each other's recovery over the same funds.
 */

let chain: FakeChain;
let agent: any;
const api = () => (globalThis as any).window.XtrataAgent;

beforeEach(async () => {
  chain = new FakeChain();
  agent = await loadAgent(chain);
  localStorage.clear();
});
afterEach(() => unloadAgent());

const put = (j: any) => localStorage.setItem(`xao-job-${j.jobId}`, JSON.stringify(j));

describe('exporting', () => {
  it('carries the receipt and the details that make a job worth keeping', () => {
    put({ jobId: 'done', status: 'COMPLETE', tokenId: '2896', uri: 'xtrata:audio/when-the-server-falls',
          receiptHtml: '<html>receipt</html>', receiptTokenId: '2897' });
    const out = api().exportJobs();
    expect(out.format).toBe('xtrata-jobs-v1');
    const j = out.jobs.find((x: any) => x.jobId === 'done');
    expect(j.tokenId).toBe('2896');
    expect(j.receiptHtml).toContain('receipt');
  });

  it('NEVER exports a deposit key', () => {
    put({ jobId: 'holding', status: 'NEEDS_RECOVERY', ephemeralMnemonic: 'twelve words that must not travel' });
    const out = api().exportJobs();
    expect(JSON.stringify(out)).not.toContain('twelve words');
  });

  it('says which site can actually finish a job that still holds one', () => {
    put({ jobId: 'holding', status: 'NEEDS_RECOVERY', ephemeralMnemonic: 'x' });
    const j = api().exportJobs().jobs.find((x: any) => x.jobId === 'holding');
    // Exported as a record, tagged so the other site does not offer a recovery it
    // cannot perform.
    expect(j.keyHeldOn).toBeTruthy();
    expect(j.ephemeralMnemonic).toBeUndefined();
  });
});

describe('importing', () => {
  const file = (jobs: any[], origin = 'https://main-staging.xtrata.pages.dev') =>
    JSON.stringify({ format: 'xtrata-jobs-v1', exportedAt: new Date(0).toISOString(), origin, jobs });

  it('adds jobs this browser has never seen', () => {
    const r = api().importJobs(file([{ jobId: 'from-preview', status: 'COMPLETE', tokenId: '2896' }]));
    expect(r.added).toBe(1);
    expect(JSON.parse(localStorage.getItem('xao-job-from-preview') as string).tokenId).toBe('2896');
  });

  it('records where an imported job came from', () => {
    api().importJobs(file([{ jobId: 'from-preview', status: 'COMPLETE' }]));
    const j = JSON.parse(localStorage.getItem('xao-job-from-preview') as string);
    expect(j.importedFrom).toContain('pages.dev');
    expect(j.importedAt).toBeTruthy();
  });

  it('never overwrites a job this browser already has', () => {
    // The local copy is the one that has been RUNNING; an export is a snapshot that
    // may be hours stale, and clobbering a live job with it could hide a held key.
    put({ jobId: 'shared', status: 'NEEDS_RECOVERY', ephemeralMnemonic: 'local key', progress: 'live' });
    const r = api().importJobs(file([{ jobId: 'shared', status: 'COMPLETE', progress: 'stale snapshot' }]));
    expect(r.added).toBe(0);
    expect(r.skipped).toBe(1);
    const j = JSON.parse(localStorage.getItem('xao-job-shared') as string);
    expect(j.status).toBe('NEEDS_RECOVERY');
    expect(j.ephemeralMnemonic).toBe('local key');
  });

  it('strips a key even if one is in the file', () => {
    // Defence in depth: the exporter removes keys, but an imported file is untrusted
    // input and a key arriving here would quietly break the custody promise.
    const r = api().importJobs(file([{ jobId: 'sneaky', status: 'COMPLETE', ephemeralMnemonic: 'should not survive' }]));
    expect(r.keysStripped).toBe(1);
    expect(localStorage.getItem('xao-job-sneaky')).not.toContain('should not survive');
  });

  it('refuses anything that is not an Xtrata export', () => {
    expect(() => api().importJobs('{"hello":"world"}')).toThrow(/does not look like/i);
    expect(() => api().importJobs(JSON.stringify({ format: 'xtrata-jobs-v1' }))).toThrow(/does not look like/i);
  });

  it('round-trips through export without losing a receipt', () => {
    put({ jobId: 'done', status: 'COMPLETE', tokenId: '2896', receiptHtml: '<html>keep me</html>' });
    const exported = JSON.stringify(api().exportJobs());
    localStorage.clear();                                  // a different origin
    api().importJobs(exported);
    expect(JSON.parse(localStorage.getItem('xao-job-done') as string).receiptHtml).toContain('keep me');
    expect(PAYER).toBeTruthy();
  });
});
