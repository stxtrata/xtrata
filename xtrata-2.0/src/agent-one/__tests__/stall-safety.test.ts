import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeChain, PAYER, loadAgent, unloadAgent } from './support/fake-chain';

/**
 * A payer's job sat at 0% for 10 minutes, then "Cancelling - returning everything to the payer" for days, with
 * 4.39 STX untouched in the one-shot wallet. Nothing had been broadcast after the first transaction.
 *
 * The shape of the bug: a run whose promise never settles stays in PROCESSING, and the watcher and the
 * reaper both skip anything in PROCESSING, so the very mechanisms built to refund a stalled job could not see it.
 * Stop only set a flag that the stuck run would never read.
 *
 * These tests run the real agent against a fake chain that can be made to hang on purpose.
 */

const source = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');

let chain: FakeChain;
let agent: any;
const api = () => (globalThis as any).window.XtrataAgent;
const fetchMock = () => (globalThis as any).fetch as any;

beforeEach(async () => {
  chain = new FakeChain();
  chain.ledger = true;
  agent = await loadAgent(chain);
});
afterEach(() => unloadAgent());

const BALANCE = 4_389_715n;   // what the stuck payer's deposit wallet still held

function seed(over: any = {}) {
  const w = agent.newWallet();
  const job = {
    jobId: 'job-stuck', depositAddress: w.address, ephemeralMnemonic: w.mnemonic, user: PAYER, funder: PAYER,
    requiredUstx: '5000000', depositReceivedUstx: '5000000', status: 'INSCRIBING', uri: 'song.mp3', mime: 'audio/mpeg',
    protocolFee: '100000', minerReserve: '300000',   // set at quote time on every real job; the refund receipt reads them
    createdAt: new Date().toISOString(), progressAt: new Date().toISOString(), ...over,
  };
  agent.writeJob(job);
  chain.fund(w.address, BALANCE);
  return { job, w };
}

/** Let fake time run until the promise settles. */
async function settle<T>(p: Promise<T>, maxSeconds = 600): Promise<T> {
  let done = false;
  p.then(() => { done = true; }, () => { done = true; });
  for (let i = 0; i < maxSeconds && !done; i += 1) await vi.advanceTimersByTimeAsync(1000);
  return p;
}

/** Make requests whose URL contains `needle` hang for ever; everything else behaves. */
function hangOn(needle: string) {
  const real = fetchMock().getMockImplementation();
  fetchMock().mockImplementation((input: any, init?: any) =>
    String(input).includes(needle) ? new Promise(() => {}) : real(input, init));
}

describe('a request that never answers', () => {
  it('becomes an error instead of freezing the job', async () => {
    hangOn('/balances/stx');
    const caught = agent.balance('SP1111111111111111111111111111111111111').catch((e: any) => e);
    await vi.advanceTimersByTimeAsync(26_000);
    const e = await caught;
    expect(e).toBeInstanceOf(Error);
    expect(String(e.message)).toMatch(/timed out/);
  });

  it('is retried by the standard transient path, not treated as a deterministic failure', () => {
    // FATAL_ERR is what sends a job straight to a refund. A timeout must not match it.
    const fatal = /TX abort|locked to|unrecoverable|file bytes|empty file/i;
    expect(fatal.test('request timed out after 25s (GET /extended/v1/tx/0xabc)')).toBe(false);
    expect(source).toContain('const FATAL_ERR = /TX abort|locked to|unrecoverable|file bytes|empty file/i;');
  });

  it('does not pay twice when a broadcast reply is lost but the transaction landed', async () => {
    const txid = 'ab'.repeat(32);
    chain.txStatus.set(`0x${txid}`, 'success');
    hangOn('/v2/transactions');
    const fakeTx = { txid: () => txid, serialize: () => new Uint8Array(64) };
    const r = agent.broadcastSafe(fakeTx, null, 'add-chunk-batch');
    const out = await settle(r, 120);
    expect(out).toEqual({ txid: `0x${txid}` });
    expect(chain.broadcasts.length).toBe(0);          // the POST itself never reached the node
  });

  it('gives up honestly when the transaction is not on chain either', async () => {
    const txid = 'cd'.repeat(32);
    hangOn('/v2/transactions');
    fetchMock().mockImplementation(((impl: any) => (input: any, init?: any) => {
      if (String(input).includes(`/extended/v1/tx/0x${txid}`)) return Promise.resolve(new Response('{}', { status: 404 }));
      return impl(input, init);
    })(fetchMock().getMockImplementation()));
    const fakeTx = { txid: () => txid, serialize: () => new Uint8Array(64) };
    const caught = agent.broadcastSafe(fakeTx, null, 'add-chunk-batch').catch((e: any) => e);
    const e = await settle(caught, 120);
    expect(String((e as any).message)).toMatch(/timed out/);
  });
});

describe('refund order: the money goes first', () => {
  it('sends the STX home BEFORE it attempts the optional receipt', async () => {
    const { job } = seed({ cancelRequested: true });
    await settle(agent.refundAndClose(agent.readJob(job.jobId), 'cancelled by request'));

    expect(chain.stxTransfers.length).toBeGreaterThanOrEqual(1);
    expect(chain.stxTransfers[0].to).toBe(PAYER);
    // Everything except what the receipt needs (210k) plus the float send() insists on keeping (220k).
    expect(chain.stxTransfers[0].amount).toBe(BALANCE - 20_000n - 430_000n);

    const firstBroadcast = chain.requests.findIndex((u) => u.includes('/v2/transactions'));
    const firstReceiptRead = chain.requests.findIndex((u) => u.includes('quote-inscription-fee'));
    expect(firstBroadcast).toBeGreaterThan(-1);
    if (firstReceiptRead > -1) expect(firstBroadcast).toBeLessThan(firstReceiptRead);
  });

  it('still finishes, and returns nearly everything, when the receipt step hangs for ever', async () => {
    const { job, w } = seed({ cancelRequested: true });
    hangOn('quote-inscription-fee');
    await settle(agent.refundAndClose(agent.readJob(job.jobId), 'cancelled by request'));

    const returned = chain.stxTransfers.filter((t) => t.to === PAYER).reduce((n, t) => n + t.amount, 0n);
    const left = chain.balances.get(w.address) ?? 0n;
    expect(left).toBeLessThanOrEqual(20_000n);
    expect(returned).toBeGreaterThan(BALANCE - 100_000n);
    const j = agent.readJob(job.jobId);
    expect(j.status).toBe('CANCELLED');
    expect(j.refundedUstx).toBe(returned.toString());
    expect((j.log || []).join('\n')).toMatch(/receipt skipped/);
  });

  it('writes each stage to the job card and keeps the log it wrote', async () => {
    const { job } = seed({ cancelRequested: true });
    await settle(agent.refundAndClose(agent.readJob(job.jobId), 'cancelled by request'));
    const log = (agent.readJob(job.jobId).log || []).join('\n');
    expect(log).toContain('refund 1/4');
    expect(log).toContain('refund 2/4');
    expect(log).toContain('refund 4/4');
    // The final save used to overwrite the log with the older copy held by the refund.
    expect(log).toMatch(/refund: \d+ µSTX sent to /);
  });

  it('with too little for a receipt, just sweeps everything', async () => {
    const { job, w } = seed({ cancelRequested: true });
    chain.balances.set(w.address, 200_000n);
    await settle(agent.refundAndClose(agent.readJob(job.jobId), 'cancelled by request'));
    expect(chain.stxTransfers.length).toBe(1);
    expect(chain.stxTransfers[0].amount).toBe(180_000n);
  });
});

describe('refund while HTML inscribing is paused (the gateway lock is on)', () => {
  it('does not start a receipt that cannot finish, and sends everything home in one transfer', async () => {
    unloadAgent();
    chain = new FakeChain();
    chain.ledger = true;
    agent = await loadAgent(chain, { inscribeLock: true });
    const { job } = seed({ cancelRequested: true });
    await settle(agent.refundAndClose(agent.readJob(job.jobId), 'cancelled by request'));

    expect(chain.stxTransfers.length).toBe(1);
    expect(chain.stxTransfers[0].to).toBe(PAYER);
    expect(chain.stxTransfers[0].amount).toBe(BALANCE - 20_000n);
    // The receipt's first step pays a protocol fee that is not refundable: it must not be attempted.
    expect(chain.requests.some((u) => u.includes('quote-inscription-fee'))).toBe(false);
    expect((agent.readJob(job.jobId).log || []).join('\n')).toMatch(/receipt skipped while HTML inscribing is paused/);
    expect(agent.readJob(job.jobId).status).toBe('CANCELLED');
  });
});

describe('a run that stops doing anything', () => {
  it('is released after four silent minutes and handed back to the normal retry path', async () => {
    const { job } = seed({ status: 'FUNDED' });
    agent.background(job.jobId, () => new Promise<void>(() => {}));
    expect(agent.PROCESSING.has(job.jobId)).toBe(true);

    await vi.advanceTimersByTimeAsync(230_000);
    await agent.watchTick();
    expect(agent.PROCESSING.has(job.jobId)).toBe(true);        // still inside the allowance

    await vi.advanceTimersByTimeAsync(20_000);
    await agent.watchTick();
    expect(agent.PROCESSING.has(job.jobId)).toBe(false);
    const j = agent.readJob(job.jobId);
    expect(j.status).toBe('FUNDED');
    expect(j.retryCount).toBe(1);
    expect(j.error).toMatch(/stalled/);
    expect((j.log || []).join('\n')).toMatch(/STALL: no activity for 2\d\ds/);
  });

  it('is not released while it is genuinely working (every poll counts as activity)', async () => {
    const { job } = seed({ status: 'FUNDED' });
    agent.background(job.jobId, async () => {
      for (let i = 0; i < 20; i += 1) { agent.runs.touchAll(); await new Promise((r) => setTimeout(r, 30_000)); }
    });
    await vi.advanceTimersByTimeAsync(300_000);
    await agent.watchTick();
    expect(agent.PROCESSING.has(job.jobId)).toBe(true);
  });

  it('ignores whatever a released run eventually does, and leaves its successor alone', async () => {
    const { job } = seed({ status: 'FUNDED' });
    let wake: () => void = () => {};
    agent.background(job.jobId, () => new Promise<void>((r) => { wake = r; }));
    await vi.advanceTimersByTimeAsync(250_000);
    await agent.watchTick();
    expect(agent.PROCESSING.has(job.jobId)).toBe(false);

    agent.background(job.jobId, () => new Promise<void>(() => {}));   // the successor
    wake();
    await vi.advanceTimersByTimeAsync(10);
    expect(agent.PROCESSING.has(job.jobId)).toBe(true);               // the late finisher did not clear it
    expect((agent.readJob(job.jobId).log || []).join('\n')).toMatch(/released has now finished/);
  });

  it('a late FAILURE from a released run does not trigger a refund', async () => {
    const { job } = seed({ status: 'FUNDED' });
    let blow: (e: Error) => void = () => {};
    agent.background(job.jobId, () => new Promise<void>((_r, rej) => { blow = rej; }));
    await vi.advanceTimersByTimeAsync(250_000);
    await agent.watchTick();
    expect(agent.PROCESSING.has(job.jobId)).toBe(false);
    agent.background(job.jobId, () => new Promise<void>(() => {}));   // the successor, held in place so only the late failure is under test
    blow(new Error('socket hung up'));
    await vi.advanceTimersByTimeAsync(60_000);
    expect(chain.stxTransfers.length).toBe(0);
    expect(agent.PROCESSING.has(job.jobId)).toBe(true);
    expect(agent.readJob(job.jobId).status).toBe('FUNDED');
    expect((agent.readJob(job.jobId).log || []).join('\n')).toMatch(/released has now failed \(socket hung up\)/);
  });

  it('after the retries are spent, a stall ends in a refund rather than another wait', async () => {
    const { job } = seed({ status: 'FUNDED', retryCount: 4 });
    agent.background(job.jobId, () => new Promise<void>(() => {}));
    await vi.advanceTimersByTimeAsync(250_000);
    await agent.watchTick();
    await settle(Promise.resolve().then(async () => { for (let i = 0; i < 300 && agent.PROCESSING.has(job.jobId); i += 1) await vi.advanceTimersByTimeAsync(1000); }));
    expect(chain.stxTransfers.length).toBeGreaterThanOrEqual(1);
    expect(chain.stxTransfers[0].to).toBe(PAYER);
  });
});

describe('Stop on a stuck job', () => {
  it('does not just show "cancelling": it takes the job from the stuck run and refunds', async () => {
    const { job, w } = seed({ status: 'INSCRIBING' });
    agent.background(job.jobId, () => new Promise<void>(() => {}));        // the stuck upload

    const first = await api().cancelJob(job.jobId);                        // right away: the run might just be busy
    expect(first.wasRunning).toBe(true);
    expect(chain.stxTransfers.length).toBe(0);

    await vi.advanceTimersByTimeAsync(50_000);                             // ...50 s of silence later
    const second = await api().cancelJob(job.jobId);
    expect(second.forced).toBe(true);

    for (let i = 0; i < 300 && agent.readJob(job.jobId).status !== 'CANCELLED'; i += 1) await vi.advanceTimersByTimeAsync(1000);
    const j = agent.readJob(job.jobId);
    expect(j.status).toBe('CANCELLED');
    expect(j.ephemeralMnemonic).toBeUndefined();                           // emptied, so the one-shot key is discarded
    expect(chain.balances.get(w.address) ?? 0n).toBeLessThanOrEqual(20_000n);
    expect(chain.stxTransfers[0].to).toBe(PAYER);
  });

  it('the watcher also forces it once the stop has been waiting 90 s on a silent run', async () => {
    const { job } = seed({ status: 'INSCRIBING', cancelRequested: true });
    agent.background(job.jobId, () => new Promise<void>(() => {}));
    await vi.advanceTimersByTimeAsync(80_000);
    await agent.watchTick();
    expect(chain.stxTransfers.length).toBe(0);
    await vi.advanceTimersByTimeAsync(15_000);
    await agent.watchTick();
    for (let i = 0; i < 300 && agent.readJob(job.jobId).status !== 'CANCELLED'; i += 1) await vi.advanceTimersByTimeAsync(1000);
    expect(agent.readJob(job.jobId).status).toBe('CANCELLED');
    expect(chain.stxTransfers[0].to).toBe(PAYER);
  });

  it('a refund that keeps failing is retried with a growing delay, not every 4 seconds', async () => {
    const { job } = seed({ status: 'INSCRIBING', cancelRequested: true });
    chain.fail('/balances/stx', 500);
    let runs = 0;
    for (let tick = 0; tick < 12; tick += 1) {
      const before = (agent.readJob(job.jobId).log || []).filter((l: string) => l.includes('run started')).length;
      await agent.watchTick();
      await vi.advanceTimersByTimeAsync(4000);
      const after = (agent.readJob(job.jobId).log || []).filter((l: string) => l.includes('run started')).length;
      runs += after - before;
    }
    expect(runs).toBeLessThan(6);
  });
});

describe('diagnostics', () => {
  it('can be built for a job, carries the step log, and never contains the key', async () => {
    const { job, w } = seed({ log: ['2026-10-29T17:41:35.000Z begin-or-get: confirmed in 3.1s'] });
    const text = await api().getDiagnostics(job.jobId);
    expect(text).toContain('XTRATA AGENT DIAGNOSTICS');
    expect(text).toContain(`depositAddress: ${w.address}`);
    expect(text).toContain('begin-or-get: confirmed in 3.1s');
    expect(text).not.toContain(w.mnemonic);
    expect(text).not.toContain('ephemeralMnemonic');
  });

  it('says so, rather than throwing, for a job this browser does not have', async () => {
    expect(await api().getDiagnostics('nope')).toMatch(/No job nope/);
  });
});

describe('the wiring that makes the above true', () => {
  it('every Stacks library request goes through the timeout wrapper', () => {
    expect(source).toContain("from './net-guard'");
    expect(source).toContain('network.fetchFn = withTimeout(network.fetchFn);');
    expect(source).toContain('const hfetch = (p: string, init?: any) => timedFetch(location.origin + HIRO_BASE + p, init);');
  });

  it('the only direct call to broadcastTransaction is inside broadcastSafe', () => {
    const calls = source.match(/broadcastTransaction\(/g) || [];
    expect(calls.length).toBe(1);
    const at = source.indexOf('broadcastTransaction(');
    expect(source.slice(source.lastIndexOf('async function broadcastSafe', at), at)).toContain('broadcastSafe');
  });

  it('the timers have a plain-timer safety net', () => {
    expect(source).toContain('const sleep = makeSleep(');
    expect(source).not.toContain('const sleepWorker');
  });

  it('PROCESSING entries are checked by the stall breaker before they are skipped', () => {
    const start = source.indexOf('async function watchTick()');
    const body = source.slice(start, start + 1200);
    expect(body.indexOf('releaseStalledRun')).toBeGreaterThan(-1);
    expect(body.indexOf('releaseStalledRun')).toBeLessThan(body.indexOf('continue;'));
  });

  it('the refund sweeps before the receipt, and the receipt has a deadline', () => {
    const start = source.indexOf('async function refundAndClose');
    const body = source.slice(start, start + 12000);
    const early = body.indexOf('sweepStxTo(dep.key, dep.address, returnTo, 5, keep)');
    const receipt = body.indexOf('inscribeReceipt(');
    const final = body.indexOf('sweepStxTo(dep.key, dep.address, returnTo))');
    expect(early).toBeGreaterThan(-1);
    expect(early).toBeLessThan(receipt);
    expect(receipt).toBeLessThan(final);
    expect(body).toContain('RECEIPT_BUDGET_MS');
    expect(body).toContain('withDeadline(inscribeReceipt(');
  });

  it('a run only clears PROCESSING while it still holds the lease', () => {
    const start = source.indexOf('function background(');
    const body = source.slice(start, source.indexOf('function releaseStalledRun', start));
    expect(body).toContain('const token = runs.start(id);');
    expect(body).toContain('runs.isCurrent(id, token)');
    expect((body.match(/PROCESSING\.delete\(id\)/g) || []).length).toBe(1);   // only inside release()
  });

  it('Stop does not wait on a run that has gone silent', () => {
    const start = source.indexOf('  cancelJob: async (id: string) =>');
    const body = source.slice(start, source.indexOf('recoverJob:', start));
    expect(body).toContain('releaseStalledRun(id, idle)');
  });

  it('a save of an older copy of the job cannot erase newer log lines', () => {
    const start = source.indexOf('function writeJob(');
    const body = source.slice(start, start + 1500);
    expect(body).toContain('j.log.includes(storedLast)');
  });
});
