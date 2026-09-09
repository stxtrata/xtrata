// Read-only transport policy. Wallet requests never enter this queue.
export type ReadPriority = 'high' | 'auto' | 'low';
export class ReadQueue {
  private active = 0;
  private pending: Array<{ priority: ReadPriority; at: number; run: () => void }> = [];
  private nextStart = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  constructor(private readonly width = 3, private readonly spacingMs: number | (() => number) = 0) {}
  run<T>(priority: ReadPriority, work: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.pending.push({priority, at: Date.now(), run: () => {
        this.active++;
        work().then(resolve, reject).finally(() => { this.active--; this.drain(); });
      }});
      this.drain();
    });
  }
  private drain(): void {
    const weight = {high: 0, auto: 1, low: 2};
    // Aging prevents discovery starving during sustained foreground traffic.
    this.pending.sort((a, b) => (Date.now() - a.at > 5000 ? -1 : weight[a.priority]) -
      (Date.now() - b.at > 5000 ? -1 : weight[b.priority]));
    while (this.active < this.width && this.pending.length) {
      const wait = this.nextStart - Date.now();
      if (wait > 0) {
        if (!this.timer) this.timer = setTimeout(() => { this.timer = null; this.drain(); }, wait);
        return;
      }
      this.nextStart = Date.now() + (typeof this.spacingMs === 'function' ? this.spacingMs() : this.spacingMs);
      this.pending.shift()!.run();
    }
  }
}
export const cancelledRead = (): DOMException => new DOMException('The read was cancelled', 'AbortError');
/** Fetch AND body consumption have one deadline; providers that ignore abort are still bounded. */
export async function fetchRead(fetcher: typeof fetch, url: string, init: RequestInit | undefined, timeoutMs: number): Promise<Response> {
  if (init?.signal?.aborted) throw cancelledRead();
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abort: () => void = () => {};
  const failure = new Promise<never>((_, reject) => {
    abort = () => { controller.abort(); reject(cancelledRead()); };
    init?.signal?.addEventListener('abort', abort, {once: true});
    timer = setTimeout(() => {
      controller.abort();
      reject(Object.assign(new Error('Chain read deadline exceeded'), {code: 'READ_TIMEOUT'}));
    }, timeoutMs);
  });
  try {
    return await Promise.race([failure, (async () => {
      const response = await fetcher(url, {...init, signal: controller.signal});
      // Test adapters and sealed readers can supply a lightweight Response interface.
      if (typeof response.arrayBuffer !== 'function') return response;
      const body = await response.arrayBuffer();
      return new Response([101, 204, 205, 304].includes(response.status) ? null : body,
        {status: response.status, statusText: response.statusText, headers: response.headers});
    })()]);
  } finally {
    clearTimeout(timer);
    init?.signal?.removeEventListener('abort', abort);
  }
}
export function retryAfterMs(value: string | null | undefined, now: number): number | null {
  if (!value?.trim()) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - now) : null;
}
