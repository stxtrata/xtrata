import { ERROR_TAXONOMY, XtrataClientError, type ClientErrorCode } from '@xtrata/collections-client';

/**
 * Single mapping from anything thrown anywhere in the app onto the client's
 * error taxonomy (`client/src/errors.ts`). The UI never invents its own error
 * copy: it shows `userMessage` from the taxonomy plus the technical detail, and
 * decides whether to offer "retry" from `retryable`.
 */

export interface DisplayError {
  code: ClientErrorCode;
  /** Taxonomy copy — what the person should understand. */
  userMessage: string;
  /** Technical message — what actually happened. */
  detail: string;
  retryable: boolean;
  /** Contract error code (uNNN) when the chain rejected the transaction. */
  chainErrorCode?: number;
}

const USER_CANCEL_PATTERNS = [
  'user rejected',
  'user cancel',
  'user denied',
  'cancelled by user',
  'canceled by user',
  'request rejected',
  'rejected by user'
];

const looksLikeWalletRejection = (message: string): boolean => {
  const lower = message.toLowerCase();
  return USER_CANCEL_PATTERNS.some((pattern) => lower.includes(pattern));
};

const messageOf = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const candidate = error as { message?: unknown };
    if (typeof candidate.message === 'string') return candidate.message;
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }
  return String(error);
};

/** Normalize any thrown value into the taxonomy. */
export const toDisplayError = (error: unknown): DisplayError => {
  if (error instanceof XtrataClientError) {
    return {
      code: error.code,
      userMessage: error.userMessage,
      detail: error.message,
      retryable: error.retryable,
      ...(error.chainErrorCode !== undefined ? { chainErrorCode: error.chainErrorCode } : {})
    };
  }
  const detail = messageOf(error);
  const code: ClientErrorCode = looksLikeWalletRejection(detail) ? 'wallet-rejected' : 'internal';
  return {
    code,
    userMessage: ERROR_TAXONOMY[code].userMessage,
    detail,
    retryable: ERROR_TAXONOMY[code].retryable
  };
};

/** Severity used by the toast layer. */
export const severityOf = (error: DisplayError): 'warn' | 'error' =>
  error.retryable ? 'warn' : 'error';
