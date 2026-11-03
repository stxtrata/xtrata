import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * A browser-held agent that waits for ever is worse than one that fails: nothing downstream can tell a hang
 * from a slow step, so a stuck job can sit on a payer's money for days while the screen says "cancelling".
 * These tests hold the primitives that turn "waits for ever" into "fails loudly and gets retried".
 *
 * net-guard fixes its own deadline timers when it loads, so it is loaded here AFTER fake timers are installed,
 * the same order the agent tests use. A fresh copy per test keeps every test's clock its own.
 */
type Guard = typeof import('../net-guard');
let DeadlineError: Guard['DeadlineError'], FetchTimeoutError: Guard['FetchTimeoutError'], RunTracker: Guard['RunTracker'],
  buildDiagnostics: Guard['buildDiagnostics'], isTimeoutError: Guard['isTimeoutError'], makeSleep: Guard['makeSleep'],
  netStats: Guard['netStats'], sleepStats: Guard['sleepStats'], withDeadline: Guard['withDeadline'], withTimeout: Guard['withTimeout'];

beforeEach(async () => {
  vi.useFakeTimers();
  vi.resetModules();
  ({ DeadlineError, FetchTimeoutError, RunTracker, buildDiagnostics, isTimeoutError, makeSleep, netStats, sleepStats, withDeadline, withTimeout } =
    await import('../net-guard'));
});
afterEach(() => { vi.useRealTimers(); });

const never = () => new Promise<any>(() => {});
const okResponse = (body: any = { ok: true }) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });

describe('withTimeout', () => {
  it('passes a normal answer straight through', async () => {
    const f = withTimeout(async () => okResponse({ n: 1 }), { readMs: 1000 });
    const res = await f('https://x.test/a');
    expect(await res.json()).toEqual({ n: 1 });
  });

  it('turns a request that never answers into a timeout error, not a hang', async () => {
    const f = withTimeout(() => never(), { readMs: 1000 });
    const p = f('https://x.test/extended/v1/tx/0xabc');
    const caught = p.catch((e) => e);
    await vi.advanceTimersByTimeAsync(1001);
    const e = await caught;
    expect(e).toBeInstanceOf(FetchTimeoutError);
    expect(isTimeoutError(e)).toBe(true);
    expect(e.message).toMatch(/timed out after 1s/);
    expect(e.message).toContain('/extended/v1/tx/0xabc');
  });

  it('aborts the underlying request when it gives up, so the socket is released', async () => {
    let seen: AbortSignal | undefined;
    const f = withTimeout((_u: any, init: any) => { seen = init.signal; return never(); }, { readMs: 500 });
    const caught = f('https://x.test/a').catch((e) => e);
    await vi.advanceTimersByTimeAsync(501);
    await caught;
    expect(seen?.aborted).toBe(true);
  });

  it('also covers the BODY: headers arriving and the body stalling must not hang', async () => {
    const stalled = okResponse();
    (stalled as any).json = () => never();
    const f = withTimeout(async () => stalled, { readMs: 800 });
    const res = await f('https://x.test/a');
    const caught = res.json().catch((e: any) => e);
    await vi.advanceTimersByTimeAsync(801);
    expect(await caught).toBeInstanceOf(FetchTimeoutError);
  });

  it('stops the clock once the body has been read', async () => {
    const f = withTimeout(async () => okResponse({ a: 1 }), { readMs: 800 });
    const res = await f('https://x.test/a');
    expect(await res.json()).toEqual({ a: 1 });
    // The deadline firing afterwards must not surface as an unhandled rejection.
    await vi.advanceTimersByTimeAsync(5000);
  });

  it('gives a big POST more time than a read, up to a cap', async () => {
    const body = new Uint8Array(400); // 400 bytes -> +100 ms on top of the 10 ms read allowance
    const f = withTimeout(() => never(), { readMs: 10, postMs: 100_000 });
    let state = 'pending';
    f('https://x.test/v2/transactions', { method: 'POST', body }).catch(() => { state = 'timed out'; });
    await vi.advanceTimersByTimeAsync(50);
    expect(state).toBe('pending');
    await vi.advanceTimersByTimeAsync(100);
    expect(state).toBe('timed out');
  });

  it('never lets a POST wait longer than the cap', async () => {
    const body = new Uint8Array(10_000_000);
    const f = withTimeout(() => never(), { readMs: 10, postMs: 2000 });
    let state = 'pending';
    f('https://x.test/v2/transactions', { method: 'POST', body }).catch(() => { state = 'timed out'; });
    await vi.advanceTimersByTimeAsync(2001);
    expect(state).toBe('timed out');
  });

  it('counts timeouts so the diagnostics can say how flaky the link was', async () => {
    const before = netStats.timeouts;
    const f = withTimeout(() => never(), { readMs: 100 });
    const caught = f('https://x.test/a').catch((e) => e);
    await vi.advanceTimersByTimeAsync(101);
    await caught;
    expect(netStats.timeouts).toBe(before + 1);
    expect(netStats.lastError).toMatch(/timed out/);
  });

  it('leaves ordinary network errors alone', async () => {
    const f = withTimeout(async () => { throw new TypeError('Failed to fetch'); }, { readMs: 1000 });
    await expect(f('https://x.test/a')).rejects.toThrow('Failed to fetch');
  });

  it('honours a caller that aborts first', async () => {
    const outer = new AbortController();
    const f = withTimeout((_u: any, init: any) => new Promise((_res, rej) => init.signal.addEventListener('abort', () => rej(new Error('caller aborted')))), { readMs: 10_000 });
    const caught = f('https://x.test/a', { signal: outer.signal }).catch((e) => e);
    outer.abort();
    const e = await caught;
    expect(isTimeoutError(e)).toBe(false);
    expect(e.message).toBe('caller aborted');
  });
});

describe('deadlines survive a later timer swap', () => {
  it('a timer double installed after load neither fires the deadline early nor counts it as waiting', async () => {
    // The fee tests replace setTimeout with "run it now, and add its delay to a virtual clock". The request
    // deadline must not go through that: it would time every request out instantly and bill 25 s each time.
    const seen: number[] = [];
    const spy = vi.spyOn(globalThis, 'setTimeout').mockImplementation(((f: any, ms = 0) => { seen.push(Number(ms)); f(); return 0 as any; }) as any);
    try {
      const f = withTimeout(async () => okResponse({ n: 2 }), { readMs: 25_000 });
      const res = await f('https://x.test/a');
      expect(await res.json()).toEqual({ n: 2 });
      expect(seen).toEqual([]);
      await expect(withDeadline(Promise.resolve(5), 60_000, 'x')).resolves.toBe(5);
      expect(seen).toEqual([]);
    } finally { spy.mockRestore(); }
  });
});

describe('makeSleep', () => {
  it('uses the worker when it answers', async () => {
    const worker: any = { postMessage: ({ id, ms }: any) => setTimeout(() => worker.onmessage({ data: id }), ms) };
    const sleep = makeSleep(() => worker, 3000);
    const before = sleepStats.workerFired;
    let done = false;
    sleep(1000).then(() => { done = true; });
    await vi.advanceTimersByTimeAsync(999);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(2);
    expect(done).toBe(true);
    expect(sleepStats.workerFired).toBe(before + 1);
  });

  it('still wakes up when the worker exists but never answers', async () => {
    // The in-app browser case: the Worker is constructed, then no message is ever delivered.
    const worker: any = { postMessage: () => {} };
    const sleep = makeSleep(() => worker, 3000);
    const before = sleepStats.fallbackFired;
    let done = false;
    sleep(1000).then(() => { done = true; });
    await vi.advanceTimersByTimeAsync(3999);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(2);
    expect(done).toBe(true);
    expect(sleepStats.fallbackFired).toBe(before + 1);
  });

  it('falls back to a plain timer when no worker can be built', async () => {
    const sleep = makeSleep(() => { throw new Error('no workers here'); });
    expect(sleepStats.workerCreated).toBe(false);
    let done = false;
    sleep(500).then(() => { done = true; });
    await vi.advanceTimersByTimeAsync(501);
    expect(done).toBe(true);
  });

  it('survives a worker whose postMessage throws', async () => {
    const worker: any = { postMessage: () => { throw new Error('dead'); } };
    const sleep = makeSleep(() => worker, 3000);
    let done = false;
    sleep(500).then(() => { done = true; });
    await vi.advanceTimersByTimeAsync(501);
    expect(done).toBe(true);
  });

  it('resolves exactly once even when both timers fire', async () => {
    const worker: any = { postMessage: ({ id, ms }: any) => setTimeout(() => worker.onmessage({ data: id }), ms + 5000) };
    const sleep = makeSleep(() => worker, 1000);
    let n = 0;
    sleep(1000).then(() => { n += 1; });
    await vi.advanceTimersByTimeAsync(20_000);
    expect(n).toBe(1);
  });
});

describe('RunTracker', () => {
  it('measures how long a run has been silent, and a touch resets it', () => {
    let t = 1000;
    const r = new RunTracker(() => t);
    r.start('job');
    t += 50_000;
    expect(r.idleMs('job')).toBe(50_000);
    r.touch('job');
    expect(r.idleMs('job')).toBe(0);
  });

  it('only the current run may end a job; a released run no longer counts', () => {
    const r = new RunTracker(() => 0);
    const first = r.start('job');
    r.release('job');
    const second = r.start('job');
    expect(r.isCurrent('job', first)).toBe(false);
    expect(r.end('job', first)).toBe(false);          // the late stuck run cannot tear down its successor
    expect(r.isCurrent('job', second)).toBe(true);
    expect(r.end('job', second)).toBe(true);
  });

  it('ignores touches for jobs that are not running', () => {
    const r = new RunTracker(() => 5);
    r.touch('ghost');
    expect(r.idleMs('ghost')).toBe(0);
  });

  it('touchAll keeps every running job alive', () => {
    let t = 0;
    const r = new RunTracker(() => t);
    r.start('a'); r.start('b');
    t = 100_000;
    r.touchAll();
    expect(r.idleMs('a')).toBe(0);
    expect(r.idleMs('b')).toBe(0);
  });
});

describe('withDeadline', () => {
  it('resolves with the value when the work finishes in time', async () => {
    await expect(withDeadline(Promise.resolve(7), 1000, 'x')).resolves.toBe(7);
  });

  it('rejects when the work does not finish, naming what timed out', async () => {
    const caught = withDeadline(never(), 1000, 'the refund receipt').catch((e) => e);
    await vi.advanceTimersByTimeAsync(1001);
    const e = await caught;
    expect(e).toBeInstanceOf(DeadlineError);
    expect(e.message).toMatch(/the refund receipt gave no answer within 1s/);
  });

  it('does not raise an unhandled rejection when the work fails after the deadline', async () => {
    let fail: (e: Error) => void = () => {};
    const slow = new Promise<never>((_r, rej) => { fail = rej; });
    const caught = withDeadline(slow, 100, 'x').catch((e) => e);
    await vi.advanceTimersByTimeAsync(101);
    await caught;
    fail(new Error('late'));
    await vi.advanceTimersByTimeAsync(10);
  });
});

describe('buildDiagnostics', () => {
  const env = { build: '2026-10-29.1', nowIso: '2026-10-29T18:00:00.000Z', userAgent: 'Mozilla/5.0 (Linux; Android 14) Xverse', visibility: 'visible', online: true, connection: '4g', storage: 'NOT persistent', workerOk: true };
  const job = {
    jobId: 'job-1', status: 'INSCRIBING', progress: 'planned · 36 chunks', depositAddress: 'SPDEPOSIT', user: 'SPUSER',
    cancelRequested: true, retryCount: 2, uploadHash: 'ab'.repeat(32), uploadTotal: 36,
    ephemeralMnemonic: 'abandon abandon abandon secret words here', privateKey: 'deadbeef', receiptHtml: '<html>big</html>',
    log: ['2026-10-29T17:41:03.000Z plan: 36 chunks', '2026-10-29T17:41:35.000Z begin-or-get: confirmed in 3.1s'],
  };
  let text = '';
  beforeEach(() => { text = buildDiagnostics(job, env, { ...netStats, ok: 10, timeouts: 2, errors: 1, lastError: 'request timed out after 25s' }, { ...sleepStats }, ['run: 312s idle']); });

  it('never contains the deposit key, under any field name', () => {
    expect(text).not.toContain('abandon');
    expect(text).not.toContain('deadbeef');
    expect(text).not.toContain('ephemeralMnemonic');
  });

  it('does not copy bulky or unknown fields by default', () => {
    expect(text).not.toContain('<html>');
  });

  it('carries what support needs: build, browser, timers, network, job state and the log', () => {
    expect(text).toContain('agent build 2026-10-29.1');
    expect(text).toContain('Android 14');
    expect(text).toContain('timers: worker ok');
    expect(text).toContain('timeouts 2');
    expect(text).toContain('run: 312s idle');
    expect(text).toContain('status: INSCRIBING');
    expect(text).toContain('cancelRequested: true');
    expect(text).toContain('depositAddress: SPDEPOSIT');
    expect(text).toContain('2026-10-29T17:41:35.000Z begin-or-get: confirmed in 3.1s');
    expect(text).toContain('LOG (2 lines');
  });

  it('copes with a job that has no log yet', () => {
    expect(() => buildDiagnostics({ jobId: 'j' }, env, netStats, sleepStats)).not.toThrow();
  });
});
