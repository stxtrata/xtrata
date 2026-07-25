import { describe, expect, it, vi } from 'vitest';
import {
  estimateDeployCostMicroStx,
  fetchAccountBalance,
  fetchContractInterface,
  fetchContractSource,
  probeRelayer
} from './chain';

/**
 * The canary's chain reads. Each one treats "absent" as a value rather than an
 * exception, because absence is exactly what the deploy preflight is asking
 * about — a 404 on a contract source IS the answer "this name is free".
 */

const API = 'https://api.testnet.hiro.so';
const CONTRACT = 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-drops-v3';

const response = (body: unknown, status = 200): Response =>
  ({ ok: status < 400, status, json: async () => body }) as Response;

describe('fetchContractSource', () => {
  it('returns null for a name nothing occupies', async () => {
    const fetchImpl = vi.fn(async () => response({}, 404));
    await expect(
      fetchContractSource({ apiBaseUrl: API, contractId: CONTRACT, fetchImpl: fetchImpl as never })
    ).resolves.toBeNull();
  });

  it('returns the stored source and tolerates a trailing slash on the base URL', async () => {
    const fetchImpl = vi.fn(async (_url: string) => response({ source: '(ok true)' }));
    await expect(
      fetchContractSource({
        apiBaseUrl: `${API}///`,
        contractId: CONTRACT,
        fetchImpl: fetchImpl as never
      })
    ).resolves.toBe('(ok true)');
    expect(fetchImpl.mock.calls[0]![0]).toBe(
      `${API}/v2/contracts/source/ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT/xtrata-drops-v3?proof=0`
    );
  });
});

describe('fetchContractInterface', () => {
  it('returns null while the contract is not indexed', async () => {
    const fetchImpl = vi.fn(async () => response({}, 404));
    await expect(
      fetchContractInterface({ apiBaseUrl: API, contractId: CONTRACT, fetchImpl: fetchImpl as never })
    ).resolves.toBeNull();
  });

  it('normalizes the callable surface and drops private functions', async () => {
    const fetchImpl = vi.fn(async () =>
      response({
        functions: [
          { name: 'claim', access: 'public', args: [{}] },
          { name: 'get-drop', access: 'read_only', args: [{}] },
          { name: 'inner', access: 'private', args: [] }
        ]
      })
    );
    await expect(
      fetchContractInterface({ apiBaseUrl: API, contractId: CONTRACT, fetchImpl: fetchImpl as never })
    ).resolves.toEqual([
      { name: 'claim', access: 'public', arity: 1 },
      { name: 'get-drop', access: 'read_only', arity: 1 }
    ]);
  });

  it('throws on a transport failure rather than reporting "not deployed"', async () => {
    const fetchImpl = vi.fn(async () => response({}, 503));
    await expect(
      fetchContractInterface({ apiBaseUrl: API, contractId: CONTRACT, fetchImpl: fetchImpl as never })
    ).rejects.toThrow(/HTTP 503/);
  });

  it('rejects a malformed contract id', async () => {
    await expect(
      fetchContractInterface({ apiBaseUrl: API, contractId: 'no-dot', fetchImpl: (() => {}) as never })
    ).rejects.toThrow(/invalid contract id/);
  });
});

describe('fetchAccountBalance', () => {
  it('reports spendable balance, excluding locked STX', async () => {
    const fetchImpl = vi.fn(async () => response({ balance: '5000000', locked: '2000000' }));
    await expect(
      fetchAccountBalance({ apiBaseUrl: API, address: 'ST1', fetchImpl: fetchImpl as never })
    ).resolves.toEqual({ microStx: 3_000_000n, address: 'ST1' });
  });

  it('never reports a negative balance', async () => {
    const fetchImpl = vi.fn(async () => response({ balance: '1', locked: '9' }));
    const balance = await fetchAccountBalance({
      apiBaseUrl: API,
      address: 'ST1',
      fetchImpl: fetchImpl as never
    });
    expect(balance.microStx).toBe(0n);
  });
});

describe('estimateDeployCostMicroStx', () => {
  it('grows with the source size', () => {
    const small = estimateDeployCostMicroStx('(ok true)');
    const large = estimateDeployCostMicroStx('x'.repeat(50_000));
    expect(large).toBeGreaterThan(small);
    expect(small).toBeGreaterThan(0n);
  });
});

describe('probeRelayer', () => {
  const relayer = 'https://relay.example';

  it('walks health → quote → submit → status and passes on stable statuses', async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith('/health')) return response({ ok: true });
      if (url.endsWith('/quote')) return response({ ok: true, feeUstx: '1000' });
      if (url.endsWith('/submit')) return response({ ok: true, jobId: 'job-1' }, 201);
      return response({ ok: true, jobId: 'job-1', state: 'SPONSORED' });
    });

    const result = await probeRelayer({
      relayerBaseUrl: relayer,
      dropId: 0,
      fetchImpl: fetchImpl as never
    });
    expect(result.ok).toBe(true);
    expect(result.steps.map((step) => step.endpoint)).toEqual([
      '/sponsor/v3/health',
      '/sponsor/v3/quote',
      '/sponsor/v3/submit',
      '/sponsor/v3/status/job-1'
    ]);
  });

  it('passes on a documented business-rule rejection — that IS the relayer working', async () => {
    // A 400 BAD_TX means the relayer decoded and authorized the request; only
    // an unreachable relayer or an INTERNAL failure means the surface is broken.
    const fetchImpl = vi.fn(async (url: string) =>
      url.endsWith('/health')
        ? response({ ok: true })
        : response({ ok: false, code: 'BAD_TX' }, 400)
    );
    const result = await probeRelayer({
      relayerBaseUrl: relayer,
      dropId: 0,
      fetchImpl: fetchImpl as never
    });
    expect(result.ok).toBe(true);
    // No jobId came back, so no status call was attempted.
    expect(result.steps).toHaveLength(3);
  });

  it('fails on HTTP 500', async () => {
    const fetchImpl = vi.fn(async () => response({ ok: false, code: 'INTERNAL' }, 500));
    const result = await probeRelayer({
      relayerBaseUrl: relayer,
      dropId: 0,
      fetchImpl: fetchImpl as never
    });
    expect(result.ok).toBe(false);
    expect(result.detail).toMatch(/INTERNAL/);
  });

  it('fails, with the transport error recorded, when the relayer is unreachable', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('ECONNREFUSED');
    });
    const result = await probeRelayer({
      relayerBaseUrl: relayer,
      dropId: 0,
      fetchImpl: fetchImpl as never
    });
    expect(result.ok).toBe(false);
    expect(result.detail).toMatch(/unreachable: ECONNREFUSED/);
    expect(result.steps[0]!.status).toBe('ECONNREFUSED');
  });
});
