import { afterEach, expect, it, vi } from 'vitest';
import { makeEndpoint } from '../../packages/chain/endpoint.js';
import { fetchRead, ReadQueue, retryAfterMs } from '../../packages/chain/read-transport.js';
afterEach(() => vi.useRealTimers());
it.each(['headers', 'body'])('bounds a hung response at %s and reaches a fallback', async stage => {
  vi.useFakeTimers();
  const calls: string[] = [];
  const endpoint = makeEndpoint({timeoutMs: 100, fetch: (async url => {
    calls.push(String(url));
    if (calls.length === 1) return stage === 'headers' ? new Promise<Response>(() => {}) :
      new Response(new ReadableStream({start() {}}));
    return new Response('healthy');
  }) as typeof fetch});
  const pending = endpoint.request('/v2/info');
  await vi.advanceTimersByTimeAsync(101);
  expect(await (await pending).text()).toBe('healthy');
  expect(calls).toHaveLength(2);
});
it('cancellation is immediate and does not trigger host fallback', async () => {
  const controller = new AbortController();
  const fetcher = vi.fn(() => new Promise<Response>(() => {}));
  const endpoint = makeEndpoint({fetch: fetcher});
  const pending = endpoint.request('/v2/info', {signal: controller.signal});
  const check = expect(pending).rejects.toMatchObject({name: 'AbortError'});
  controller.abort(); await check;
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it('honours Retry-After seconds and dates without making requests during cooldown', async () => {
  let now = 1000;
  const fetcher = vi.fn(async () => new Response('', {status: 429, headers: {'Retry-After': '120'}}));
  const endpoint = makeEndpoint({override: 'https://node.example', now: () => now, fetch: fetcher});
  await expect(endpoint.request('/v2/info')).rejects.toMatchObject({code: 'RATE_LIMITED'});
  now += 119_999;
  await expect(endpoint.request('/v2/info')).rejects.toMatchObject({code: 'RATE_LIMITED'});
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(retryAfterMs('Wed, 21 Oct 2015 07:28:00 GMT', Date.parse('2015-10-21T07:27:00Z'))).toBe(60_000);
  expect(retryAfterMs('nonsense', now)).toBeNull();
});
it('shares identical reads while giving each consumer an independent body', async () => {
  const fetcher = vi.fn(async () => new Response('{"value": 42}'));
  const endpoint = makeEndpoint({fetch: fetcher});
  const [a, b] = await Promise.all([endpoint.request('/v2/info'), endpoint.request('/v2/info')]);
  expect(await a.json()).toEqual({value: 42}); expect(await b.json()).toEqual({value: 42});
  expect(fetcher).toHaveBeenCalledTimes(1);
  await endpoint.request('/v2/info'); expect(fetcher).toHaveBeenCalledTimes(2);
});
it('refuses transaction broadcasts at the read transport boundary', async () => {
  const fetcher = vi.fn();
  await expect(makeEndpoint({fetch: fetcher}).request('/v2/transactions', {method: 'POST', body: 'tx'})).rejects.toThrow('reads only');
  expect(fetcher).not.toHaveBeenCalled();
});
it('lets the open game pass queued discovery while bounding concurrent work', async () => {
  const queue = new ReadQueue(1); const order: string[] = [];
  let unblock!: () => void;
  const first = queue.run('low', () => new Promise<void>(resolve => {unblock = resolve;}));
  const low = queue.run('low', async () => {order.push('discovery');});
  const high = queue.run('high', async () => {order.push('game');});
  unblock(); await Promise.all([first, low, high]);
  expect(order).toEqual(['game', 'discovery']);
});
it('cleans up the deadline after a successful complete body', async () => {
  vi.useFakeTimers();
  await fetchRead(async () => new Response('ok'), 'https://node.example', undefined, 500);
  expect(vi.getTimerCount()).toBe(0);
});
it('spaces network starts instead of releasing the whole concurrency window in a burst', async () => {
  vi.useFakeTimers();const queue=new ReadQueue(3,250);const started:number[]=[];
  const work=()=>queue.run('low',async()=>{started.push(Date.now());});
  const pending=Promise.all([work(),work(),work()]);
  expect(started).toHaveLength(1);await vi.advanceTimersByTimeAsync(249);expect(started).toHaveLength(1);
  await vi.advanceTimersByTimeAsync(251);await pending;
  expect(started[1]-started[0]).toBe(250);expect(started[2]-started[1]).toBe(250);
});
it('stops scheduling a failed batch and waits for in-flight work to settle before retry is possible', async () => {
  const {pool}=await import('../../packages/chain/pool.js');let release!:()=>void;const launched:number[]=[];
  const failed=Error('rate limited');
  const pending=pool(2,Array.from({length:20},(_,i)=>async()=>{
    launched.push(i);
    if(i===0)throw failed;
    await new Promise<void>(resolve=>{release=resolve;});return i;
  }));
  const check=expect(pending).rejects.toBe(failed);
  await Promise.resolve();expect(launched).toEqual([0,1]);release();await check;
  expect(launched).toEqual([0,1]);
});
it('adapts spacing when a proxy falls back to a public endpoint', async () => {
  vi.useFakeTimers();let spacing=250;const queue=new ReadQueue(3,()=>spacing);const starts:number[]=[];
  const run=()=>queue.run('auto',async()=>{starts.push(Date.now());spacing=1500;});
  const pending=Promise.all([run(),run(),run()]);
  await vi.advanceTimersByTimeAsync(1750);await pending;
  expect(starts[1]-starts[0]).toBe(250);expect(starts[2]-starts[1]).toBe(1500);
});
