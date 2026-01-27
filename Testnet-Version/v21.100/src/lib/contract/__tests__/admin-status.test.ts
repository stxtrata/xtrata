import { describe, expect, it, vi } from 'vitest';
import type { XStrataClient } from '../client';
import { fetchContractAdminStatus } from '../admin-status';

const makeClient = (overrides: Partial<XStrataClient> = {}): XStrataClient => {
  const base = {
    contract: {
      address: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
      contractName: 'u64bxr-v9-2-17',
      network: 'testnet'
    },
    getAdmin: vi.fn().mockResolvedValue('STADMIN'),
    getRoyaltyRecipient: vi.fn().mockResolvedValue('STROYALTY'),
    getFeeUnit: vi.fn().mockResolvedValue(100000n),
    isPaused: vi.fn().mockResolvedValue(false),
    getNextTokenId: vi.fn().mockResolvedValue(12n),
    getLastTokenId: vi.fn().mockResolvedValue(0n),
    getTokenUri: vi.fn(),
    getOwner: vi.fn(),
    getSvg: vi.fn(),
    getSvgDataUri: vi.fn(),
    getInscriptionMeta: vi.fn(),
    getDependencies: vi.fn(),
    getChunk: vi.fn(),
    getUploadState: vi.fn(),
    getPendingChunk: vi.fn()
  };
  return { ...base, ...overrides } as XStrataClient;
};

describe('contract admin status', () => {
  it('fetches admin status for v9.2.17', async () => {
    const client = makeClient();
    const status = await fetchContractAdminStatus({
      client,
      senderAddress: 'STTEST'
    });

    expect(status.admin).toBe('STADMIN');
    expect(status.royaltyRecipient).toBe('STROYALTY');
    expect(status.feeUnitMicroStx).toBe(100000n);
    expect(status.paused).toBe(false);
    expect(status.nextTokenId).toBe(12n);
    expect(client.getAdmin).toHaveBeenCalledTimes(1);
    expect(client.getRoyaltyRecipient).toHaveBeenCalledTimes(1);
    expect(client.getFeeUnit).toHaveBeenCalledTimes(1);
    expect(client.isPaused).toHaveBeenCalledTimes(1);
    expect(client.getNextTokenId).toHaveBeenCalledTimes(1);
  });

  it('returns nulls for v9.2.14 contracts', async () => {
    const client = makeClient({
      contract: {
        address: 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA',
        contractName: 'u64bxr-v9-2-14',
        network: 'testnet'
      }
    });

    const status = await fetchContractAdminStatus({
      client,
      senderAddress: 'STTEST'
    });

    expect(status.admin).toBeNull();
    expect(status.royaltyRecipient).toBeNull();
    expect(status.feeUnitMicroStx).toBeNull();
    expect(status.paused).toBeNull();
    expect(status.nextTokenId).toBeNull();
  });
});
