/**
 * Normalized error taxonomy for the collections client. Every failure the
 * engine or UI needs to react to maps onto one of these codes; `retryable`
 * tells the executor whether a plain retry is a legal recovery.
 */

export type ClientErrorCode =
  | 'wallet-rejected'
  | 'broadcast-failed'
  | 'timeout-unconfirmed'
  | 'chain-rejected'
  | 'reconcile-mismatch'
  | 'manifest-invalid'
  | 'checksum-mismatch'
  | 'duplicate-content'
  | 'plan-invalid'
  | 'internal';

export interface ClientErrorDescriptor {
  retryable: boolean;
  userMessage: string;
}

export const ERROR_TAXONOMY: Record<ClientErrorCode, ClientErrorDescriptor> = {
  'wallet-rejected': {
    retryable: true,
    userMessage: 'The wallet rejected or cancelled the transaction. You can retry when ready.'
  },
  'broadcast-failed': {
    retryable: true,
    userMessage:
      'The transaction could not be broadcast. Check your connection; state will be reconciled against the chain before any retry.'
  },
  'timeout-unconfirmed': {
    retryable: true,
    userMessage:
      'The transaction was broadcast but has not confirmed in time. Do not resubmit blindly — the engine will re-read chain state first.'
  },
  'chain-rejected': {
    retryable: false,
    userMessage: 'The contract rejected the transaction. See the error code for details.'
  },
  'reconcile-mismatch': {
    retryable: false,
    userMessage:
      'On-chain upload state diverges from the local file. The session must be restarted for this item.'
  },
  'manifest-invalid': {
    retryable: false,
    userMessage: 'The manifest is malformed or fails schema validation.'
  },
  'checksum-mismatch': {
    retryable: false,
    userMessage: 'The manifest checksum does not match its contents — the file was modified or corrupted.'
  },
  'duplicate-content': {
    retryable: false,
    userMessage: 'Two items have identical content, which this collection does not allow.'
  },
  'plan-invalid': {
    retryable: false,
    userMessage: 'The transaction plan is inconsistent with the manifest.'
  },
  internal: {
    retryable: false,
    userMessage: 'An internal client error occurred.'
  }
};

export class XtrataClientError extends Error {
  readonly code: ClientErrorCode;
  readonly retryable: boolean;
  readonly userMessage: string;
  /** Contract error code (uNNN) when code === 'chain-rejected'. */
  readonly chainErrorCode?: number;
  readonly detail?: Record<string, unknown>;

  constructor(
    code: ClientErrorCode,
    message: string,
    options?: { chainErrorCode?: number; detail?: Record<string, unknown>; cause?: unknown }
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'XtrataClientError';
    this.code = code;
    const descriptor = ERROR_TAXONOMY[code];
    this.retryable = descriptor.retryable;
    this.userMessage = descriptor.userMessage;
    if (options?.chainErrorCode !== undefined) this.chainErrorCode = options.chainErrorCode;
    if (options?.detail !== undefined) this.detail = options.detail;
  }
}

export const isRetryable = (error: unknown): boolean =>
  error instanceof XtrataClientError && error.retryable;

/** Known v3.2.3 core error codes surfaced by chain-rejected failures. */
export const CORE_ERROR_CODES: Record<number, string> = {
  102: 'ERR-INVALID-BATCH (upload incomplete or batch shape wrong)',
  103: 'ERR-HASH-MISMATCH (running hash diverges from expected hash)',
  111: 'ERR-DEPENDENCY-MISSING (declared dependency token does not exist)'
};

export const chainRejected = (chainErrorCode: number, detail?: Record<string, unknown>): XtrataClientError =>
  new XtrataClientError(
    'chain-rejected',
    `Contract rejected transaction: u${chainErrorCode}${
      CORE_ERROR_CODES[chainErrorCode] ? ` ${CORE_ERROR_CODES[chainErrorCode]}` : ''
    }`,
    { chainErrorCode, ...(detail !== undefined ? { detail } : {}) }
  );
