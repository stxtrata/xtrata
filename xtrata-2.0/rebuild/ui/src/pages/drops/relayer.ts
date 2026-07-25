import { XtrataClientError, type ClientErrorCode } from '@xtrata/collections-client';

/**
 * Browser client for the sponsor relayer (`rebuild/relayer`, routes under
 * `/sponsor/v3`).
 *
 * Two rules shape this module:
 *
 * 1. **The relayer is never trusted to be available.** Every refusal is
 *    classified into "the drop itself would reject this claim too" versus
 *    "only the sponsorship is unavailable". The second class always leaves the
 *    claimer a self-paid path, which is the documented fallback — a sponsored
 *    drop whose relayer is down is still claimable, it just stops being free.
 * 2. **Codes, not prose.** The relayer returns stable machine codes and never
 *    returns internals; the UI maps those codes to its own copy here and does
 *    not print `detail` as if it were an explanation.
 */

export type RelayerErrorCode =
  // 400 — the request or the signed transaction
  | 'BAD_REQUEST'
  | 'BAD_TX'
  | 'TX_TOO_LARGE'
  | 'NOT_SPONSORED'
  | 'NONZERO_FEE'
  | 'NOT_CONTRACT_CALL'
  | 'CONTRACT_NOT_ALLOWED'
  | 'FUNCTION_NOT_ALLOWED'
  | 'BAD_ARGS'
  | 'WRONG_NETWORK'
  | 'PC_MODE'
  | 'WRONG_POST_CONDITIONS'
  | 'UNSUPPORTED_ORIGIN'
  | 'BODY_MISMATCH'
  | 'DUPLICATE_CLAIM'
  | 'JOB_RACE'
  // 404 / 400 — the drop
  | 'DROP_NOT_FOUND'
  | 'DROP_NOT_ACTIVE'
  | 'DROP_NOT_SPONSORED'
  | 'CONTRACT_PAUSED'
  | 'WINDOW_CLOSED'
  | 'BUDGET_EXHAUSTED'
  | 'WALLET_LIMIT'
  | 'SOLD_OUT'
  | 'WRONG_ELIGIBILITY'
  // 429 / 503 — the relayer's own capacity
  | 'RATE_LIMITED'
  | 'CAPACITY'
  | 'LOW_FLOAT'
  | 'RELAYER_DISABLED'
  | 'DROP_SHUTDOWN'
  | 'ATTESTOR_NOT_CONFIGURED'
  // 502 / 500
  | 'BROADCAST_REJECTED'
  | 'SPONSOR_ERROR'
  | 'INTERNAL'
  // client-side only: the relayer could not be reached or answered nonsense
  | 'UNREACHABLE';

/**
 * Refusals where the *sponsorship* is unavailable but the claim itself is
 * still legal on chain. These are the only ones that may fall back to a
 * self-paid claim: everything else means the contract would reject the same
 * claim, so a fallback would just burn the claimer's own fee on a failure.
 *
 * `BUDGET_EXHAUSTED` is in this set deliberately — the drop is fine, the
 * creator's budget simply ran out, and the claimer may choose to pay.
 */
export const SELF_PAID_FALLBACK_CODES: ReadonlySet<RelayerErrorCode> = new Set<RelayerErrorCode>([
  'RATE_LIMITED',
  'CAPACITY',
  'LOW_FLOAT',
  'RELAYER_DISABLED',
  'DROP_SHUTDOWN',
  'BUDGET_EXHAUSTED',
  'BROADCAST_REJECTED',
  'SPONSOR_ERROR',
  'INTERNAL',
  'UNREACHABLE'
]);

export const canFallBackToSelfPaid = (code: RelayerErrorCode): boolean =>
  SELF_PAID_FALLBACK_CODES.has(code);

const MESSAGES: Record<RelayerErrorCode, string> = {
  BAD_REQUEST: 'The relayer rejected the request shape.',
  BAD_TX: 'The relayer could not decode the signed transaction.',
  TX_TOO_LARGE: 'The signed transaction is larger than the relayer accepts.',
  NOT_SPONSORED: 'The signed transaction was not built for sponsorship.',
  NONZERO_FEE: 'A sponsored transaction must carry a zero origin fee.',
  NOT_CONTRACT_CALL: 'The signed transaction is not a contract call.',
  CONTRACT_NOT_ALLOWED: 'The relayer only sponsors its configured drops contract.',
  FUNCTION_NOT_ALLOWED: 'The relayer only sponsors claim, claim-signed and reserve-claim.',
  BAD_ARGS: 'The relayer rejected the call arguments.',
  WRONG_NETWORK: 'The signed transaction targets a different network than the relayer.',
  PC_MODE: 'The signed transaction must use deny-mode post-conditions.',
  WRONG_POST_CONDITIONS: 'The signed transaction carries post-conditions the relayer will not sponsor.',
  UNSUPPORTED_ORIGIN: 'The relayer does not support this wallet signature type.',
  BODY_MISMATCH: 'The request hints contradict the signed transaction.',
  DUPLICATE_CLAIM: 'This wallet already has a claim in flight for this drop.',
  JOB_RACE: 'Another claim for this wallet is already being processed.',
  DROP_NOT_FOUND: 'The relayer does not know this drop.',
  DROP_NOT_ACTIVE: 'The drop is not accepting claims right now.',
  DROP_NOT_SPONSORED: 'This drop is not a sponsored drop.',
  CONTRACT_PAUSED: 'The drops contract is paused.',
  WINDOW_CLOSED: 'The claim window is closed.',
  BUDGET_EXHAUSTED: 'The sponsor budget for this drop cannot cover another claim fee.',
  WALLET_LIMIT: 'This wallet has reached the per-wallet limit for the drop.',
  SOLD_OUT: 'There is nothing left to claim.',
  WRONG_ELIGIBILITY: 'This drop needs a different claim entrypoint than the one signed.',
  RATE_LIMITED: 'The relayer is rate-limiting requests. Try again shortly.',
  CAPACITY: 'The relayer is at capacity.',
  LOW_FLOAT: 'The relayer is below its float floor and is not sponsoring right now.',
  RELAYER_DISABLED: 'Sponsorship is switched off.',
  DROP_SHUTDOWN: 'Sponsorship for this drop has been shut down by the relayer operator.',
  ATTESTOR_NOT_CONFIGURED: 'The relayer holds no attestor key, so it cannot issue an attestation.',
  BROADCAST_REJECTED: 'The node rejected the sponsored broadcast.',
  SPONSOR_ERROR: 'The relayer could not sponsor the transaction.',
  INTERNAL: 'The relayer failed unexpectedly.',
  UNREACHABLE: 'The relayer could not be reached.'
};

const isRelayerErrorCode = (value: unknown): value is RelayerErrorCode =>
  typeof value === 'string' && value in MESSAGES;

export class RelayerError extends Error {
  readonly code: RelayerErrorCode;
  readonly status: number | null;
  readonly detail: string | undefined;
  /** True when a self-paid claim is still a sensible next step. */
  readonly selfPaidFallback: boolean;

  constructor(code: RelayerErrorCode, options: { status?: number; detail?: string } = {}) {
    super(`${code}: ${MESSAGES[code]}`);
    this.name = 'RelayerError';
    this.code = code;
    this.status = options.status ?? null;
    this.detail = options.detail;
    this.selfPaidFallback = canFallBackToSelfPaid(code);
  }

  get userMessage(): string {
    return MESSAGES[this.code];
  }

  /**
   * Project onto the shared client taxonomy so relayer failures reach the
   * toast layer looking like every other failure in the app.
   */
  toClientError(): XtrataClientError {
    const code: ClientErrorCode = this.selfPaidFallback ? 'broadcast-failed' : 'chain-rejected';
    return new XtrataClientError(code, `relayer ${this.code}: ${MESSAGES[this.code]}`, {
      detail: {
        relayerCode: this.code,
        ...(this.status !== null ? { status: this.status } : {}),
        ...(this.detail !== undefined ? { detail: this.detail } : {})
      }
    });
  }
}

export type JobState =
  | 'RECEIVED'
  | 'SIGNING'
  | 'SPONSORED'
  | 'CONFIRMED'
  | 'FEE_CLAIMING'
  | 'FEE_CLAIMED'
  | 'REFUNDING'
  | 'SETTLED'
  | 'FAILED';

/** Job states from which the claim transaction is known to have succeeded. */
export const SETTLED_STATES: ReadonlySet<JobState> = new Set<JobState>([
  'CONFIRMED',
  'FEE_CLAIMING',
  'FEE_CLAIMED',
  'REFUNDING',
  'SETTLED'
]);

/** Job states where the claim is signed and broadcast but not yet mined. */
export const IN_FLIGHT_STATES: ReadonlySet<JobState> = new Set<JobState>([
  'RECEIVED',
  'SIGNING',
  'SPONSORED'
]);

export interface QuoteResult {
  feeUstx: bigint;
  budgetRemaining: bigint;
}

export interface SubmitResult {
  jobId: string;
  state: JobState;
  sponsorTxid: string | null;
  /** True when an identical txHex was already accepted (idempotent resubmit). */
  existing: boolean;
}

export interface StatusResult {
  jobId: string;
  state: JobState;
  dropId: number | null;
  claimer: string | null;
  sponsorTxid: string | null;
  claimFeeTxid: string | null;
  refundTxid: string | null;
  error: string | null;
}

export interface AttestationResult {
  dropId: number;
  claimer: string;
  expiresAt: number;
  /** 65-byte RSV signature hex. */
  signature: string;
}

export interface HealthResult {
  sponsorAddress: string;
  floatUstx: bigint;
  unsettled: number;
  disabled: boolean;
  shutdownDrops: number[];
}

export interface RelayerConfig {
  /** Base URL the `/sponsor/v3` routes hang off, e.g. `https://xtrata.io`. */
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

const toBigInt = (value: unknown, field: string): bigint => {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number' && Number.isInteger(value)) return BigInt(value);
  if (typeof value === 'string' && /^\d+$/.test(value)) return BigInt(value);
  throw new RelayerError('INTERNAL', { detail: `relayer returned a non-numeric ${field}` });
};

const asJobState = (value: unknown): JobState => {
  const states: JobState[] = [
    'RECEIVED',
    'SIGNING',
    'SPONSORED',
    'CONFIRMED',
    'FEE_CLAIMING',
    'FEE_CLAIMED',
    'REFUNDING',
    'SETTLED',
    'FAILED'
  ];
  if (typeof value === 'string' && (states as string[]).includes(value)) return value as JobState;
  throw new RelayerError('INTERNAL', { detail: `relayer returned an unknown job state: ${String(value)}` });
};

const text = (value: unknown): string | null => (typeof value === 'string' && value.length > 0 ? value : null);

export class RelayerClient {
  private readonly base: string;
  private readonly doFetch: typeof fetch;

  constructor(config: RelayerConfig) {
    this.base = `${config.baseUrl.replace(/\/+$/, '')}/sponsor/v3`;
    this.doFetch = config.fetchImpl ?? globalThis.fetch.bind(globalThis);
  }

  private async request(
    path: string,
    init: { method: 'GET' | 'POST'; body?: unknown }
  ): Promise<Record<string, unknown>> {
    let response: Response;
    try {
      response = await this.doFetch(`${this.base}${path}`, {
        method: init.method,
        ...(init.body !== undefined
          ? { headers: { 'content-type': 'application/json' }, body: JSON.stringify(init.body) }
          : {})
      });
    } catch (cause) {
      throw new RelayerError('UNREACHABLE', {
        detail: cause instanceof Error ? cause.message : String(cause)
      });
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    const record = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;

    if (!response.ok || record['ok'] === false) {
      const code = isRelayerErrorCode(record['code']) ? record['code'] : 'INTERNAL';
      throw new RelayerError(code, {
        status: response.status,
        ...(typeof record['detail'] === 'string' ? { detail: record['detail'] } : {})
      });
    }
    return record;
  }

  async quote(dropId: number): Promise<QuoteResult> {
    const body = await this.request('/quote', { method: 'POST', body: { dropId } });
    return {
      feeUstx: toBigInt(body['feeUstx'], 'feeUstx'),
      budgetRemaining: toBigInt(body['budgetRemaining'], 'budgetRemaining')
    };
  }

  async submit(params: {
    txHex: string;
    dropId?: number;
    contractId?: string;
    functionName?: string;
  }): Promise<SubmitResult> {
    const body = await this.request('/submit', { method: 'POST', body: params });
    const jobId = text(body['jobId']);
    if (jobId === null) {
      throw new RelayerError('INTERNAL', { detail: 'relayer accepted the claim but returned no job id' });
    }
    return {
      jobId,
      state: asJobState(body['state']),
      sponsorTxid: text(body['sponsorTxid']),
      existing: body['existing'] === true
    };
  }

  async status(jobId: string): Promise<StatusResult> {
    const body = await this.request(`/status/${encodeURIComponent(jobId)}`, { method: 'GET' });
    return {
      jobId,
      state: asJobState(body['state']),
      dropId: typeof body['dropId'] === 'number' ? body['dropId'] : null,
      claimer: text(body['claimer']),
      sponsorTxid: text(body['sponsorTxid']),
      claimFeeTxid: text(body['claimFeeTxid']),
      refundTxid: text(body['refundTxid']),
      error: text(body['error'])
    };
  }

  /** Signed-eligibility drops: fetch the attestation for this claimer. */
  async attest(params: { dropId: number; claimer: string }): Promise<AttestationResult> {
    const body = await this.request('/attest', { method: 'POST', body: params });
    const signature = text(body['signature']);
    if (signature === null) {
      throw new RelayerError('INTERNAL', { detail: 'attestation response carried no signature' });
    }
    const expiresAt = body['expiresAt'];
    if (typeof expiresAt !== 'number') {
      throw new RelayerError('INTERNAL', { detail: 'attestation response carried no expiry height' });
    }
    return { dropId: params.dropId, claimer: params.claimer, expiresAt, signature };
  }

  async health(): Promise<HealthResult> {
    const body = await this.request('/health', { method: 'GET' });
    const shutdown = body['shutdownDrops'];
    return {
      sponsorAddress: text(body['sponsorAddress']) ?? '',
      floatUstx: toBigInt(body['floatUstx'] ?? 0, 'floatUstx'),
      unsettled: typeof body['unsettled'] === 'number' ? body['unsettled'] : 0,
      disabled: body['disabled'] === true,
      shutdownDrops: Array.isArray(shutdown) ? shutdown.filter((id): id is number => typeof id === 'number') : []
    };
  }
}
