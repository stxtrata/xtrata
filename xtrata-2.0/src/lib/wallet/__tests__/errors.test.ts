import { describe, expect, it } from 'vitest';
import { asWalletError, WalletCoordinatorError, walletErrorMessage } from '../errors';

describe('wallet coordinator errors', () => {
  it('preserves stable account and reconnect error codes', () => {
    expect(asWalletError({ code: 'ACCOUNT_CHANGED' }).code).toBe('ACCOUNT_CHANGED');
    expect(asWalletError({ code: 'RECONNECT_REQUIRED' }).code).toBe('RECONNECT_REQUIRED');
  });

  it('does not expose an underlying provider failure message', () => {
    const error = asWalletError(new Error('signed payload 0xsecret'));
    expect(error.code).toBe('PROVIDER_FAILURE');
    expect(walletErrorMessage(error)).toBe('The wallet could not complete the request.');
    expect(error).toBeInstanceOf(WalletCoordinatorError);
  });
});
