import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const coreSource = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');

describe('Agent One confirmed deposit polling', () => {
  it('uses the live v2 Hiro balance route and rejects HTTP/error bodies', () => {
    expect(coreSource).toContain('/extended/v2/addresses/${encodeURIComponent(addr)}/balances/stx');
    expect(coreSource).toContain("cache: 'no-store'");
    expect(coreSource).toContain('if (!response.ok) throw new Error(`balance lookup HTTP ${response.status}`)');
    expect(coreSource).toContain("throw new Error('balance lookup returned no valid balance')");
  });

  it('durably records a confirmed deposit and keeps history reads network-free', () => {
    expect(coreSource).toContain('job.depositReceivedUstx = bal.toString();');
    expect(coreSource).toContain("job.progress = 'deposit confirmed — queued for processing';");
    expect(coreSource).toContain('listJobs: async () => listJobsRaw()');
    expect(coreSource).not.toContain('listJobs: async () => Promise.all');
  });

  it('bounds background balance polling while retaining a 10–20 second sweep', () => {
    expect(coreSource).toContain('const MAX_DEPOSIT_POLLS_PER_TICK = 2;');
    expect(coreSource).toContain('const depositPollBudget = new Set<string>();');
    expect(coreSource).toContain('!depositPollBudget.has(j.jobId)');
    expect(coreSource).toContain("['AWAITING_DEPOSIT', 'EXPIRED', 'FUNDED', 'AWAITING_PARENT']");
  });

  it('records transient verification failures without losing the funded job', () => {
    expect(coreSource).toContain('job.depositCheckError = message;');
    expect(coreSource).toContain('deposit verification unavailable — retrying');
    expect(coreSource).toContain('delete job.depositCheckError;');
    expect(coreSource).toContain('verificationUnavailable = true;');
    expect(coreSource).toContain('!verificationUnavailable && !MOCK');
    expect(coreSource).toContain('const status = await statusJob(job);');
    expect(coreSource).toContain('return { job: publicJob(job), status };');
  });
});
