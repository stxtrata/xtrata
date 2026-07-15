import { describe, expect, it } from 'vitest';
import { WalletCoordinatorError } from '../errors';
import { assertWalletWriteAllowed } from '../transactions';
import type { WalletSessionRecord } from '../types';

const connected: WalletSessionRecord = {
  version: 2,
  revision: 1,
  generation: 1,
  status: 'CONNECTED',
  providerId: 'LeatherProvider',
  transportId: 'LeatherProvider',
  walletType: 'leather',
  address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
  network: 'mainnet',
  updatedAt: 1
};

describe('wallet write boundary', () => {
  it('accepts the connected sender case-insensitively', () => {
    expect(() => assertWalletWriteAllowed(connected, {
      kind: 'contract-call',
      expectedSender: connected.address?.toLowerCase()
    })).not.toThrow();
  });

  it('blocks mismatched and reconnect-required sessions with typed errors', () => {
    for (const [session, code] of [
      [connected, 'ACCOUNT_CHANGED'],
      [{ ...connected, status: 'RECONNECT_REQUIRED' as const }, 'RECONNECT_REQUIRED']
    ] as const) {
      try {
        assertWalletWriteAllowed(session, {
          kind: 'stx-transfer',
          expectedSender: code === 'ACCOUNT_CHANGED'
            ? 'SP1QJJVMB6NQBGMZQVDR22PADW2E3BEP61R2Z8D7V'
            : connected.address
        });
        throw new Error('expected wallet boundary to reject');
      } catch (error) {
        expect(error).toBeInstanceOf(WalletCoordinatorError);
        expect((error as WalletCoordinatorError).code).toBe(code);
      }
    }
  });
});
