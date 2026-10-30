/**
 * Guards that keep a browser-held agent from hanging silently.
 *
 * A one-shot deposit wallet lives in ONE browser tab. If something inside that tab waits
 * for ever (a request that never answers, a timer that never fires, a promise nobody
 * resolves), nothing downstream can notice: the job sits in "processing", the watcher
 * skips it because it is processing, the reaper skips it for the same reason, and a
 * Stop request is only honoured at a checkpoint the stuck run never reaches. The payer's
 * money is safe on chain but unreachable, and the screen says "Cancelling" for days.
 *
 * Everything here exists to turn "waits for ever" into "fails loudly, gets logged, and
 * is handed back to the code that already knows how to retry or refund":
 *
 *  - withTimeout:  every request has a deadline, including reading the response body.
 *  - makeSleep:    a timer that still fires if the Web Worker timer never answers.
 *  - RunTracker:   remembers when each running job last did anything, so the watcher can
 *                  release a run that has gone quiet.
 *  - buildDiagnostics: one block of plain text a stuck user can paste into a DM. It never
 *                  includes the deposit key.
 *
 * Kept free of agent-core imports so it can be tested on its own.
 */

// ---------------------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------------------

/** Healthy answers from the Hiro proxy arrive in a second or two; 25 s is generous. */
export const READ_TIMEOUT_MS = 25_000;
/** A signed chunk batch is ~525 KB. Slow mobile uplinks need time, but not for ever. */
export const POST_TIMEOUT_MS = 120_000;

export class FetchTimeoutError extends Error {
  readonly ms: number;
  constructor(what: string, ms: number) {
    super(`request timed out after ${Math.round(ms / 1000)}s (${what})`);
    this.name = 'FetchTimeoutError';
    this.ms = ms;
  }
}

export interface NetStats {
  ok: number;
  timeouts: number;
  errors: number;
  lastOkAt: number;
  lastError: string;
  lastErrorAt: number;
}
export const netStats: NetStats = { ok: 0, timeouts: 0, errors: 0, lastOkAt: 0, lastError: '', lastErrorAt: 0 };

type FetchLike = (url: any, init?: any) => Promise<any>;

const shortUrl = (url: any): string => {
  const s = typeof url === 'string' ? url : url && url.url ? String(url.url) : String(url);
  const i = s.indexOf('://');
  const path = i >= 0 ? s.slice(s.indexOf('/', i + 3) >= 0 ? s.indexOf('/', i + 3) : s.length) : s;
  return path.length > 80 ? path.slice(0, 77) + '...' : path;
};

// The guard's own deadlines use the timer functions that existed when this module loaded, not whatever
// `setTimeout` happens to be later. A harness that swaps in an "everything fires now" timer to make sleeps
// instant (the fee tests do) would otherwise make every guarded request "time out" the moment it started, and
// would count each 25 s deadline as 25 s of waiting. Sleeps themselves still use the live global (see makeSleep).
const guardSetTimeout: typeof setTimeout = globalThis.setTimeout.bind(globalThis);
const guardClearTimeout: typeof clearTimeout = globalThis.clearTimeout.bind(globalThis);

/**
 * Arm a one-shot deadline. A real timer can never fire before the code that armed it has finished, so a callback
 * that runs *inside* the setTimeout call came from a timer double that runs everything eagerly. That is not a
 * deadline passing, so it is ignored (belt and braces for a double that was installed before this module loaded).
 */
function armDeadline(fire: () => void, ms: number): () => void {
  let armed = false;
  const t: any = guardSetTimeout(() => { if (armed) fire(); }, ms);
  armed = true;
  return () => guardClearTimeout(t);
}

const bodyLength = (body: any): number => {
  if (!body) return 0;
  if (typeof body === 'string') return body.length;
  if (typeof body.byteLength === 'number') return body.byteLength;
  if (typeof body.length === 'number') return body.length;
  return 0;
};

/**
 * Wrap a fetch so no request can wait for ever.
 *
 * The deadline covers the whole exchange: if the headers arrive and the body stalls (a
 * common failure in mobile in-app browsers after the app was backgrounded), reading the
 * body rejects at the same deadline rather than hanging.
 *
 * Reads get `readMs`. A POST gets `readMs` plus time proportional to its body, capped at
 * `postMs`, so a 525 KB chunk batch has time to upload while a small read-only call does not.
 */
export function withTimeout(
  base: FetchLike,
  opts: { readMs?: number; postMs?: number; now?: () => number } = {}
): FetchLike {
  const readMs = opts.readMs ?? READ_TIMEOUT_MS;
  const postMs = opts.postMs ?? POST_TIMEOUT_MS;
  const now = opts.now ?? Date.now;
  return async (url: any, init: any = {}) => {
    const method = String((init && init.method) || 'GET').toUpperCase();
    const ms = method === 'GET' || method === 'HEAD'
      ? readMs
      : Math.min(postMs, readMs + Math.floor(bodyLength(init && init.body) / 4));
    const what = `${method} ${shortUrl(url)}`;
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const outer: any = init && init.signal;
    if (ctl && outer) {
      if (outer.aborted) ctl.abort();
      else if (outer.addEventListener) outer.addEventListener('abort', () => ctl.abort(), { once: true });
    }
    let stop: () => void = () => {};
    const deadline = new Promise<never>((_, reject) => {
      stop = armDeadline(() => {
        try { ctl && ctl.abort(); } catch { /* already finished */ }
        reject(new FetchTimeoutError(what, ms));
      }, ms);
    });
    deadline.catch(() => { /* surfaced through the race below; never an unhandled rejection */ });
    const t0 = now();
    try {
      const res: any = await Promise.race([base(url, ctl ? { ...init, signal: ctl.signal } : init), deadline]);
      netStats.ok += 1;
      netStats.lastOkAt = now();
      // The clock keeps running until the body has been read.
      if (res && typeof res === 'object') {
        for (const m of ['json', 'text', 'arrayBuffer', 'blob']) {
          const orig = res[m];
          if (typeof orig !== 'function') continue;
          try {
            res[m] = (...a: any[]) => {
              const read = Promise.resolve(orig.apply(res, a));
              return Promise.race([read, deadline]).then(
                (v) => { stop(); return v; },
                (e) => { stop(); noteFailure(e, now() - t0); throw e; }
              );
            };
          } catch { /* a frozen Response keeps the plain reader */ }
        }
      }
      return res;
    } catch (e: any) {
      stop();
      const err = e instanceof FetchTimeoutError
        ? e
        : ctl && ctl.signal.aborted && !(outer && outer.aborted) ? new FetchTimeoutError(what, ms) : e;
      noteFailure(err, now() - t0);
      throw err;
    }
  };
}

function noteFailure(e: any, _elapsedMs: number) {
  if (e instanceof FetchTimeoutError) netStats.timeouts += 1; else netStats.errors += 1;
  netStats.lastError = String((e && e.message) || e).slice(0, 160);
  netStats.lastErrorAt = Date.now();
}

/** True for the errors withTimeout throws, so callers can treat them as "try again later". */
export const isTimeoutError = (e: any) => e instanceof FetchTimeoutError || (e && e.name === 'FetchTimeoutError');

// ---------------------------------------------------------------------------------------
// Timers
// ---------------------------------------------------------------------------------------

export interface SleepStats { workerCreated: boolean; workerFired: number; fallbackFired: number; workerErrors: number }
export const sleepStats: SleepStats = { workerCreated: false, workerFired: 0, fallbackFired: 0, workerErrors: 0 };

/** A worker that never answers costs this much extra before the plain timer takes over. */
export const SLEEP_GRACE_MS = 3_000;

/**
 * Build a sleep() that survives a dead timer worker.
 *
 * Window timers are throttled in background tabs, so the precise timer lives in a Web
 * Worker. But "the worker was created" is not "the worker answers": some in-app browsers
 * construct it and then never deliver a message, which makes every await sleep() hang. So
 * each sleep also arms an ordinary timer slightly later; whichever fires first wins.
 */
export function makeSleep(createWorker: () => any | null, graceMs: number = SLEEP_GRACE_MS) {
  let worker: any = null;
  try { worker = createWorker(); } catch { worker = null; }
  sleepStats.workerCreated = !!worker;
  let seq = 0;
  const waiters = new Map<number, () => void>();
  if (worker) {
    worker.onmessage = (e: any) => { const w = waiters.get(e.data); if (w) { waiters.delete(e.data); w(); } };
    worker.onerror = () => { sleepStats.workerErrors += 1; worker = null; };
  }
  return (ms: number) => new Promise<void>((resolve) => {
    let done = false;
    let fallback: any;
    let id = 0;
    const finish = (viaWorker: boolean) => {
      if (done) return;
      done = true;
      clearTimeout(fallback);
      if (id) waiters.delete(id);
      if (viaWorker) sleepStats.workerFired += 1; else sleepStats.fallbackFired += 1;
      resolve();
    };
    if (worker) {
      id = ++seq;
      waiters.set(id, () => finish(true));
      try { worker.postMessage({ id, ms }); } catch { waiters.delete(id); id = 0; worker = null; sleepStats.workerErrors += 1; }
    }
    fallback = setTimeout(() => finish(false), worker ? ms + graceMs : ms);
  });
}

// ---------------------------------------------------------------------------------------
// Run tracking
// ---------------------------------------------------------------------------------------

/** A running job that has logged and polled nothing for this long is stuck, not slow. */
export const STALL_BREAK_MS = 240_000;
/** Same, once the user has pressed Stop: they are waiting on it, so give up sooner. */
export const CANCEL_STALL_MS = 90_000;

/**
 * Remembers when each running job last did something and which run currently owns it.
 * "Did something" means: wrote a log line, wrote progress, or completed one poll of a
 * confirmation loop. A promise that simply never settles touches nothing, so its idle time
 * grows until the watcher releases it.
 */
export class RunTracker {
  private last = new Map<string, number>();
  private owner = new Map<string, number>();
  private seq = 0;
  constructor(private now: () => number = Date.now) {}

  /** Begin a run; the returned token is what that run must present when it ends. */
  start(id: string): number {
    const token = ++this.seq;
    this.owner.set(id, token);
    this.last.set(id, this.now());
    return token;
  }
  touch(id: string) { if (this.owner.has(id)) this.last.set(id, this.now()); }
  touchAll() { const t = this.now(); for (const id of this.owner.keys()) this.last.set(id, t); }
  idleMs(id: string): number { const t = this.last.get(id); return t == null ? 0 : this.now() - t; }
  isCurrent(id: string, token: number) { return this.owner.get(id) === token; }
  /** Called when a run ends. A superseded run's token no longer matches, so it changes nothing. */
  end(id: string, token: number): boolean {
    if (this.owner.get(id) !== token) return false;
    this.owner.delete(id); this.last.delete(id);
    return true;
  }
  /** Give up on whatever run owns this job; its eventual result is ignored. */
  release(id: string) { this.owner.delete(id); this.last.delete(id); }
}

// ---------------------------------------------------------------------------------------
// Time-boxing
// ---------------------------------------------------------------------------------------

export class DeadlineError extends Error {
  constructor(what: string, ms: number) { super(`${what} gave no answer within ${Math.round(ms / 1000)}s`); this.name = 'DeadlineError'; }
}

/** Resolve with `p`, or reject after `ms`. The work behind `p` is not cancelled, only no longer waited for. */
export function withDeadline<T>(p: Promise<T>, ms: number, what: string): Promise<T> {
  let cancel: () => void = () => {};
  const timeout = new Promise<never>((_, rej) => { cancel = armDeadline(() => rej(new DeadlineError(what, ms)), ms); });
  p.catch(() => { /* a late failure after the deadline is not news */ });
  return Promise.race([p, timeout]).finally(() => cancel());
}

// ---------------------------------------------------------------------------------------
// Diagnostics
// ---------------------------------------------------------------------------------------

export interface DiagnosticsEnv {
  build: string;
  nowIso: string;
  userAgent: string;
  visibility: string;
  online: boolean | null;
  connection: string;
  storage: string;
  workerOk: boolean;
}

const FIELDS = [
  'jobId', 'status', 'progress', 'progressAt', 'createdAt', 'error', 'retryCount', 'cancelRequested',
  'cancelReason', 'cancelledAt', 'keepKey', 'keepKeyReason', 'depositAddress', 'user', 'expectedFunder',
  'funder', 'depositReceivedUstx', 'requiredUstx', 'protocolFee', 'minerReserve', 'mime', 'size', 'sizeBytes',
  'uploadHash', 'uploadTotal', 'tokenId', 'receiptTokenId', 'refundTx', 'refundedUstx', 'feePolicy',
];

/**
 * Plain-text support block for one job. Whitelist, not blacklist: only the fields named
 * above are copied, so a field added to the job later can never leak by default. The
 * deposit key is not on the list.
 */
export function buildDiagnostics(job: any, env: DiagnosticsEnv, net: NetStats, sleep: SleepStats, extra: string[] = []): string {
  const out: string[] = [];
  out.push('XTRATA AGENT DIAGNOSTICS');
  out.push(`generated ${env.nowIso}`);
  out.push(`agent build ${env.build}`);
  out.push(`browser ${env.userAgent}`);
  out.push(`page ${env.visibility} · online ${env.online == null ? '?' : env.online} · link ${env.connection || '?'} · storage ${env.storage}`);
  out.push(`timers: worker ${env.workerOk ? 'ok' : 'MISSING'} · fired by worker ${sleep.workerFired} · by fallback ${sleep.fallbackFired} · worker errors ${sleep.workerErrors}`);
  out.push(`network: ok ${net.ok} · timeouts ${net.timeouts} · errors ${net.errors}${net.lastError ? ` · last: ${net.lastError}` : ''}`);
  for (const line of extra) out.push(line);
  out.push('');
  out.push('JOB');
  for (const k of FIELDS) {
    const v = job && job[k];
    if (v == null || v === '' || v === false) continue;
    out.push(`${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`);
  }
  if (job && Array.isArray(job.partialUpload) && job.partialUpload.length) out.push(`partialUpload: ${JSON.stringify(job.partialUpload)}`);
  out.push('');
  const log: string[] = (job && Array.isArray(job.log) ? job.log : []) as string[];
  out.push(`LOG (${log.length} lines, oldest first)`);
  for (const line of log) out.push(String(line));
  return out.join('\n');
}
