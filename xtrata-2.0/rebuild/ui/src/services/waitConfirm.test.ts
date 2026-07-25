import { describe, expect, it, vi } from 'vitest';
import { createWaitConfirm, fetchTxStatus, mapTxStatus, parseChainErrorCode } from './waitConfirm';

const API = 'https://api.example.test';

const jsonResponse = (body: unknown, status = 200): Response =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as Response;

describe('mapTxStatus', () => {
  it('passes through the terminal outcomes the executor branches on', () => {
    expect(mapTxStatus('success')).toBe('success');
    expect(mapTxStatus('abort_by_response')).toBe('abort_by_response');
    expect(mapTxStatus('abort_by_post_condition')).toBe('abort_by_post_condition');
  });

  it('collapses every dropped variant to `dropped`', () => {
    for (const status of [
      'dropped_replace_by_fee',
      'dropped_replace_across_fork',
      'dropped_too_expensive',
      'dropped_stale_garbage_collect',
      'dropped_problematic'
    ]) {
      expect(mapTxStatus(status)).toBe('dropped');
    }
  });

  it('treats anything unknown as still pending rather than as a failure', () => {
    expect(mapTxStatus('pending')).toBe('pending');
    expect(mapTxStatus('some_future_status')).toBe('pending');
    expect(mapTxStatus(undefined)).toBe('pending');
  });
});

describe('parseChainErrorCode', () => {
  it('extracts uNNN from an err repr', () => {
    expect(parseChainErrorCode('(err u105)')).toBe(105);
    expect(parseChainErrorCode('(err   u4)')).toBe(4);
  });

  it('returns undefined for a success repr or no repr', () => {
    expect(parseChainErrorCode('(ok u1)')).toBeUndefined();
    expect(parseChainErrorCode(undefined)).toBeUndefined();
  });
});

describe('fetchTxStatus', () => {
  it('returns the client ChainTxResult shape with the contract error code', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ tx_status: 'abort_by_response', tx_result: { repr: '(err u105)' }, block_height: 42 })
    );

    const result = await fetchTxStatus({ apiBaseUrl: API, fetchImpl: fetchImpl as never }, 'abc');

    expect(result).toEqual({
      txid: '0xabc',
      status: 'abort_by_response',
      chainErrorCode: 105,
      blockHeight: 42
    });
    expect(fetchImpl).toHaveBeenCalledWith(`${API}/extended/v1/tx/0xabc`);
  });

  it('treats a not-yet-indexed transaction as pending, not as an error', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({}, 404));
    await expect(
      fetchTxStatus({ apiBaseUrl: API, fetchImpl: fetchImpl as never }, '0xdef')
    ).resolves.toEqual({ txid: '0xdef', status: 'pending' });
  });

  it('normalizes a transport failure onto broadcast-failed', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('offline');
    });
    await expect(
      fetchTxStatus({ apiBaseUrl: API, fetchImpl: fetchImpl as never }, '0xaaa')
    ).rejects.toMatchObject({ code: 'broadcast-failed' });
  });
});

describe('createWaitConfirm', () => {
  it('polls until the transaction leaves the pending state', async () => {
    const statuses = ['pending', 'pending', 'success'];
    let call = 0;
    const waitConfirm = createWaitConfirm({
      apiBaseUrl: API,
      intervalMs: 1,
      sleep: async () => undefined,
      fetchImpl: (async () => jsonResponse({ tx_status: statuses[call++] })) as never
    });

    await expect(waitConfirm('0x01')).resolves.toMatchObject({ status: 'success' });
    expect(call).toBe(3);
  });

  it('gives up as `pending` rather than throwing, so the caller re-observes', async () => {
    let now = 0;
    const waitConfirm = createWaitConfirm({
      apiBaseUrl: API,
      intervalMs: 1,
      timeoutMs: 10,
      now: () => now,
      sleep: async () => {
        now += 20;
      },
      fetchImpl: (async () => jsonResponse({ tx_status: 'pending' })) as never
    });

    await expect(waitConfirm('0x02')).resolves.toEqual({ txid: '0x02', status: 'pending' });
  });
});
