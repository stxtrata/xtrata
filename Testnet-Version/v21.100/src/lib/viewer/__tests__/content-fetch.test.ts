import { describe, expect, it, vi } from 'vitest';
import type { XStrataClient } from '../../contract/client';

vi.mock('../cache', () => ({
  loadInscriptionFromCache: vi.fn().mockResolvedValue(null),
  saveInscriptionToCache: vi.fn().mockResolvedValue(undefined)
}));

import { fetchOnChainContent } from '../content';

const buildClient = (params: {
  supportsBatch: boolean;
  getChunk: XStrataClient['getChunk'];
  getChunkBatch: XStrataClient['getChunkBatch'];
}) =>
  ({
    contract: {
      address: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
      contractName: 'xStrata-v1-0-5',
      network: 'testnet'
    },
    supportsChunkBatchRead: params.supportsBatch,
    getChunk: params.getChunk,
    getChunkBatch: params.getChunkBatch
  }) as unknown as XStrataClient;

describe('fetchOnChainContent', () => {
  it('uses batch reads when available', async () => {
    const first = new Uint8Array([1, 2]);
    const second = new Uint8Array([3, 4]);
    const third = new Uint8Array([5, 6]);
    const getChunk = vi.fn(async (_id: bigint, index: bigint) => {
      if (index === 0n) {
        return first;
      }
      return null;
    });
    const getChunkBatch = vi.fn(async () => [second, third]);
    const client = buildClient({
      supportsBatch: true,
      getChunk,
      getChunkBatch
    });

    const result = await fetchOnChainContent({
      client,
      id: 1n,
      senderAddress: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
      totalSize: 6n,
      mimeType: 'application/octet-stream'
    });

    expect(Array.from(result)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(getChunk).toHaveBeenCalledTimes(1);
    expect(getChunkBatch).toHaveBeenCalledTimes(1);
  });

  it('falls back to per-chunk reads when batch is unavailable', async () => {
    const first = new Uint8Array([1, 2]);
    const second = new Uint8Array([3, 4]);
    const third = new Uint8Array([5, 6]);
    const getChunk = vi.fn(async (_id: bigint, index: bigint) => {
      if (index === 0n) {
        return first;
      }
      if (index === 1n) {
        return second;
      }
      if (index === 2n) {
        return third;
      }
      return null;
    });
    const getChunkBatch = vi.fn(async () => []);
    const client = buildClient({
      supportsBatch: false,
      getChunk,
      getChunkBatch
    });

    const result = await fetchOnChainContent({
      client,
      id: 2n,
      senderAddress: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
      totalSize: 6n,
      mimeType: 'application/octet-stream'
    });

    expect(Array.from(result)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(getChunkBatch).not.toHaveBeenCalled();
    expect(getChunk).toHaveBeenCalledTimes(3);
  });

  it('falls back to per-chunk reads when batch calls exceed cost', async () => {
    const first = new Uint8Array([1, 2]);
    const second = new Uint8Array([3, 4]);
    const third = new Uint8Array([5, 6]);
    const getChunk = vi.fn(async (_id: bigint, index: bigint) => {
      if (index === 0n) {
        return first;
      }
      if (index === 1n) {
        return second;
      }
      if (index === 2n) {
        return third;
      }
      return null;
    });
    const getChunkBatch = vi.fn(async () => {
      throw new Error('CostBalanceExceeded');
    });
    const client = buildClient({
      supportsBatch: true,
      getChunk,
      getChunkBatch
    });

    const result = await fetchOnChainContent({
      client,
      id: 3n,
      senderAddress: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
      totalSize: 6n,
      mimeType: 'application/octet-stream'
    });

    expect(Array.from(result)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(getChunkBatch).toHaveBeenCalled();
    expect(getChunk).toHaveBeenCalledTimes(3);
  });
});
