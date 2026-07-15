export type WalletErrorCode =
  | 'ACCOUNT_CHANGED'
  | 'BUSY'
  | 'CAPABILITY_UNAVAILABLE'
  | 'MAINNET_REQUIRED'
  | 'PROVIDER_FAILURE'
  | 'PROVIDER_TIMEOUT'
  | 'RECONNECT_REQUIRED'
  | 'SESSION_UNAVAILABLE'
  | 'USER_CANCELLED';

const SAFE_MESSAGES: Record<WalletErrorCode, string> = {
  ACCOUNT_CHANGED: 'The wallet account changed. Reconnect before continuing.',
  BUSY: 'Another wallet request is already open. Finish or cancel it first.',
  CAPABILITY_UNAVAILABLE: 'The selected wallet does not support this operation.',
  MAINNET_REQUIRED: 'Xtrata wallet actions require a Stacks Mainnet account.',
  PROVIDER_FAILURE: 'The wallet could not complete the request.',
  PROVIDER_TIMEOUT: 'The wallet did not answer in time. Reconnect and try again.',
  RECONNECT_REQUIRED: 'Reconnect the wallet before continuing.',
  SESSION_UNAVAILABLE: 'Connect a wallet before continuing.',
  USER_CANCELLED: 'The wallet request was cancelled. No transaction was sent.'
};

export class WalletCoordinatorError extends Error {
  readonly code: WalletErrorCode;
  override readonly cause?: unknown;

  constructor(code: WalletErrorCode, message = SAFE_MESSAGES[code], cause?: unknown) {
    super(message);
    this.name = 'WalletCoordinatorError';
    this.code = code;
    this.cause = cause;
  }
}

export const walletErrorMessage = (error: unknown) => {
  if (error instanceof WalletCoordinatorError) {
    return SAFE_MESSAGES[error.code];
  }
  return SAFE_MESSAGES.PROVIDER_FAILURE;
};

export const asWalletError = (
  error: unknown,
  fallback: WalletErrorCode = 'PROVIDER_FAILURE'
) => {
  if (error instanceof WalletCoordinatorError) {
    return error;
  }
  const candidate = error && typeof error === 'object' ? error as { code?: unknown } : null;
  const code = candidate?.code;
  if (code === 4001 || code === -31001) {
    return new WalletCoordinatorError('USER_CANCELLED', undefined, error);
  }
  if (
    code === 'XVERSE_ACCOUNT_CHANGED' ||
    code === 'ACCOUNT_CHANGED'
  ) {
    return new WalletCoordinatorError('ACCOUNT_CHANGED', undefined, error);
  }
  if (code === 'RECONNECT_REQUIRED') {
    return new WalletCoordinatorError('RECONNECT_REQUIRED', undefined, error);
  }
  if (
    code === 'XVERSE_ACCOUNT_READ_TIMEOUT' ||
    code === 'PROVIDER_TIMEOUT'
  ) {
    return new WalletCoordinatorError('PROVIDER_TIMEOUT', undefined, error);
  }
  if (
    code === -32601 ||
    code === 'WALLET_SIGNING_UNSUPPORTED' ||
    code === 'WALLET_PUBLIC_KEY_UNAVAILABLE'
  ) {
    return new WalletCoordinatorError('CAPABILITY_UNAVAILABLE', undefined, error);
  }
  return new WalletCoordinatorError(fallback, undefined, error);
};

export const walletErrorUtils = { SAFE_MESSAGES };
