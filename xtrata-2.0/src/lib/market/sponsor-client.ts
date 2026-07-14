/**
 * Client for the Xtrata sponsor relayer (xtrata-agent-one/svc/sponsor-service.mjs).
 * Lets a buyer purchase a sponsored listing with zero STX: the buyer's wallet
 * signs the market `buy` as a sponsored transaction (fee 0), we POST the signed
 * payload here, and the relayer attaches + pays the mining fee, then settles
 * the seller's fee-budget escrow (claim + dust refund) on-chain.
 */

export type SponsorQuote = {
  estimatedFeeUstx: bigint;
  budgetUstx: bigint;
  minBudgetUstx: bigint;
  expiresAt: number;
};

export type SponsorJobState =
  | 'RECEIVED'
  | 'SPONSORED'
  | 'CONFIRMED'
  | 'CLAIMING'
  | 'CLAIMED'
  | 'REFUNDING'
  | 'SETTLED'
  | 'ABANDONED';

export type SponsorJob = {
  id: string;
  state: SponsorJobState;
  txids: { buy?: string; claim?: string; refund?: string };
  error?: string;
};

export type SponsorErrorCode =
  | 'RELAYER_UNAVAILABLE'
  | 'AT_CAPACITY'
  | 'LOW_BALANCE'
  | 'RATE_LIMITED'
  | 'DUPLICATE'
  | 'LISTING_BUSY'
  | 'BUDGET_TOO_SMALL'
  | 'LISTING_SOLD'
  | 'VALIDATION'
  | 'RELAYER_INTERNAL'
  | 'RELAYER_KEY_INVALID'
  | 'BROADCAST'
  | 'UNKNOWN';

type SponsorErrorDetails = {
  httpStatus?: number;
  requestId?: string;
  stage?: string;
  traceId?: string;
  relayerCode?: string;
};

export class SponsorClientError extends Error {
  code: SponsorErrorCode;
  /** true when the buyer can still complete the purchase self-paid */
  fallbackToSelfPaid: boolean;
  existingJob?: SponsorJob;
  httpStatus?: number;
  requestId?: string;
  stage?: string;
  traceId?: string;
  relayerCode?: string;
  constructor(
    code: SponsorErrorCode,
    message: string,
    existingJob?: SponsorJob,
    details: SponsorErrorDetails = {}
  ) {
    super(message);
    this.code = code;
    this.existingJob = existingJob;
    this.httpStatus = details.httpStatus;
    this.requestId = details.requestId;
    this.stage = details.stage;
    this.traceId = details.traceId;
    this.relayerCode = details.relayerCode;
    this.fallbackToSelfPaid = code !== 'LISTING_SOLD' && code !== 'DUPLICATE' && code !== 'LISTING_BUSY';
  }
}

const VALIDATION_CODES = new Set([
  'VALIDATION',
  'BAD_TX',
  'NOT_SPONSORED',
  'NONZERO_FEE',
  'NOT_CONTRACT_CALL',
  'CONTRACT_NOT_ALLOWED',
  'FUNCTION_NOT_ALLOWED',
  'NO_POST_CONDITIONS',
  'PC_MODE',
  'BAD_FEE',
  'FEE_TOO_LARGE'
]);

export const mapRelayerError = (
  code: string | undefined,
  message: string,
  existingJob?: SponsorJob,
  details: SponsorErrorDetails = {}
) => {
  if (!code) {
    return new SponsorClientError('UNKNOWN', message, existingJob, details);
  }
  if (VALIDATION_CODES.has(code)) {
    return new SponsorClientError('VALIDATION', message, existingJob, details);
  }
  const known: SponsorErrorCode[] = [
    'AT_CAPACITY',
    'LOW_BALANCE',
    'RATE_LIMITED',
    'DUPLICATE',
    'LISTING_BUSY',
    'BUDGET_TOO_SMALL',
    'LISTING_SOLD',
    'RELAYER_INTERNAL',
    'RELAYER_KEY_INVALID',
    'BROADCAST'
  ];
  return new SponsorClientError(
    (known as string[]).includes(code) ? (code as SponsorErrorCode) : 'UNKNOWN',
    message,
    existingJob,
    { ...details, relayerCode: code }
  );
};

type FetchLike = typeof fetch;

const request = async (
  fetchImpl: FetchLike,
  url: string,
  init?: RequestInit
): Promise<unknown> => {
  let response: Response;
  try {
    response = await fetchImpl(url, init);
  } catch {
    throw new SponsorClientError('RELAYER_UNAVAILABLE', 'sponsor relayer unreachable');
  }
  let body: Record<string, unknown> = {};
  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    // fallthrough — handled below
  }
  if (!response.ok) {
    const possibleJob = typeof body.id === 'string' && typeof body.state === 'string'
      ? (body as unknown as SponsorJob)
      : undefined;
    const requestId = typeof body.requestId === 'string' ? body.requestId : undefined;
    const stage = typeof body.stage === 'string' ? body.stage : undefined;
    const traceId = response.headers?.get?.('cf-ray') ?? undefined;
    const baseMessage =
      typeof body.message === 'string'
        ? body.message
        : typeof body.error === 'string'
          ? body.error
          : `relayer returned non-JSON HTTP ${response.status}`;
    const references = [
      requestId ? `request ${requestId}` : '',
      stage ? `stage ${stage}` : '',
      traceId ? `trace ${traceId}` : ''
    ].filter(Boolean);
    throw mapRelayerError(
      typeof body.code === 'string' ? body.code : undefined,
      references.length > 0 ? `${baseMessage} (${references.join('; ')})` : baseMessage,
      possibleJob,
      {
        httpStatus: response.status,
        requestId,
        stage,
        traceId,
        relayerCode: typeof body.code === 'string' ? body.code : undefined
      }
    );
  }
  return body;
};

export const createSponsorClient = (
  baseUrl: string,
  fetchImpl: FetchLike = fetch
) => {
  const base = baseUrl.replace(/\/+$/, '');
  return {
    /** Budget quote for the list flow ("sponsorship deposit"). */
    async quote(): Promise<SponsorQuote> {
      const body = (await request(fetchImpl, `${base}/sponsor/quote`, {
        method: 'POST'
      })) as Record<string, string | number>;
      return {
        estimatedFeeUstx: BigInt(body.estimatedFeeUstx ?? 0),
        budgetUstx: BigInt(body.budgetUstx ?? 0),
        minBudgetUstx: BigInt(body.minBudgetUstx ?? 0),
        expiresAt: Number(body.expiresAt ?? 0)
      };
    },

    /** Submit the buyer-signed sponsored tx. Returns the relayer job. */
    async submit(params: {
      txHex: string;
      contractId: string;
      listingId: bigint;
    }): Promise<SponsorJob> {
      const body = (await request(fetchImpl, `${base}/sponsor/submit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          txHex: params.txHex,
          contractId: params.contractId,
          listingId: params.listingId.toString()
        })
      })) as SponsorJob;
      return body;
    },

    async status(jobId: string): Promise<SponsorJob> {
      return (await request(
        fetchImpl,
        `${base}/sponsor/status/${encodeURIComponent(jobId)}`
      )) as SponsorJob;
    },

    /** Cheap availability probe so the UI can fall back to self-paid buys. */
    async available(): Promise<boolean> {
      try {
        await this.quote();
        return true;
      } catch {
        return false;
      }
    }
  };
};

export type SponsorClient = ReturnType<typeof createSponsorClient>;
