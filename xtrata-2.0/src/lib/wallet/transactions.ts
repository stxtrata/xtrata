import { WalletCoordinatorError } from './errors';
import type { WalletSessionRecord } from './types';

export type WalletWriteKind =
  | 'stx-transfer'
  | 'contract-call'
  | 'contract-deploy'
  | 'sponsored-sign';

export type WalletWriteBoundary = {
  kind: WalletWriteKind;
  expectedSender?: string | null;
};

const normalizeAddress = (value?: string | null) => value?.trim().toUpperCase() ?? '';

/** Enforces sender identity before any provider popup is opened. */
export const assertWalletWriteAllowed = (
  session: WalletSessionRecord,
  request: WalletWriteBoundary
) => {
  if (session.status === 'RECONNECT_REQUIRED') {
    throw new WalletCoordinatorError('RECONNECT_REQUIRED');
  }
  if (session.status !== 'CONNECTED' || !session.address) {
    throw new WalletCoordinatorError('SESSION_UNAVAILABLE');
  }
  if (session.network !== 'mainnet') {
    throw new WalletCoordinatorError('MAINNET_REQUIRED');
  }
  const expected = normalizeAddress(request.expectedSender);
  if (expected && expected !== normalizeAddress(session.address)) {
    throw new WalletCoordinatorError('ACCOUNT_CHANGED');
  }
};
