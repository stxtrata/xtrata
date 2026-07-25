/**
 * Route handlers over a minimal request/response abstraction so the same
 * router runs under Node tests and the Cloudflare adapter.
 *
 * Endpoints (05-SPONSORSHIP.md):
 *   POST /sponsor/v3/quote            { dropId }
 *   POST /sponsor/v3/submit           { txHex, dropId?, contractId?, functionName? }
 *   GET  /sponsor/v3/status/:jobId
 *   POST /sponsor/v3/attest           { dropId, claimer }   (signed-eligibility drops)
 *   GET  /sponsor/v3/health
 */
import { readDropForAttestation } from './preflight.js';
import { signAttestation } from './attest.js';
import type { SponsorRelayer } from './sponsor.js';
import type { ChainTransport, RelayerConfig } from './types.js';

export interface RelayerRequest {
  method: string;
  /** path relative to the mount, e.g. /sponsor/v3/submit */
  path: string;
  body?: unknown;
  /** stable caller key for per-origin rate limiting (e.g. client IP). */
  originKey?: string;
}

export interface RelayerResponse {
  status: number;
  body: unknown;
}

const ELIGIBILITY_SIGNED = 3n;
const STATUS_ACTIVE = 1n;

const json = (status: number, body: unknown): RelayerResponse => ({ status, body });
const err = (status: number, code: string, detail?: string): RelayerResponse =>
  json(status, { ok: false, code, ...(detail ? { detail } : {}) });

const parseUint = (value: unknown): bigint | null => {
  const raw = String(value ?? '');
  return /^\d+$/.test(raw) ? BigInt(raw) : null;
};

const STATUS_BY_CODE: Record<string, number> = {
  RATE_LIMITED: 429,
  CAPACITY: 503,
  LOW_FLOAT: 503,
  RELAYER_DISABLED: 503,
  DROP_SHUTDOWN: 503,
  SPONSOR_ERROR: 502,
  BROADCAST_REJECTED: 502,
  DROP_NOT_FOUND: 404
};

export const createRouter = (
  relayer: SponsorRelayer,
  cfg: RelayerConfig,
  transport: ChainTransport
) => {
  const router = async (req: RelayerRequest): Promise<RelayerResponse> => {
    const { method, path } = req;
    const body = (req.body ?? {}) as Record<string, unknown>;

    // Settlement is traffic-driven: advance a bounded batch on every request.
    try {
      await relayer.settle();
    } catch {
      /* settlement problems must never fail the user's request */
    }

    if (method === 'POST' && path === '/sponsor/v3/quote') {
      const dropId = parseUint(body.dropId);
      if (dropId === null) return err(400, 'BAD_REQUEST', 'dropId must be a canonical unsigned integer');
      const quote = await relayer.quote(dropId);
      if (!quote.ok) return err(STATUS_BY_CODE[quote.code ?? ''] ?? 400, quote.code ?? 'QUOTE_FAILED');
      return json(200, {
        ok: true,
        feeUstx: quote.feeUstx!.toString(),
        budgetRemaining: quote.budgetRemaining!.toString()
      });
    }

    if (method === 'POST' && path === '/sponsor/v3/submit') {
      if (typeof body.txHex !== 'string') return err(400, 'BAD_REQUEST', 'txHex required');
      const outcome = await relayer.submit(
        body.txHex,
        { contractId: body.contractId, dropId: body.dropId, functionName: body.functionName },
        req.originKey ?? 'unknown'
      );
      if (!outcome.ok) {
        return err(STATUS_BY_CODE[outcome.code] ?? 400, outcome.code, outcome.detail);
      }
      return json(outcome.existing ? 200 : 201, {
        ok: true,
        jobId: outcome.job.id,
        state: outcome.job.state,
        sponsorTxid: outcome.job.sponsorTxid,
        existing: Boolean(outcome.existing)
      });
    }

    const statusMatch = path.match(/^\/sponsor\/v3\/status\/([\w-]+)$/);
    if (method === 'GET' && statusMatch) {
      const job = await relayer.status(statusMatch[1]!);
      if (!job) return err(404, 'NOT_FOUND');
      return json(200, {
        ok: true,
        jobId: job.id,
        state: job.state,
        dropId: job.dropId,
        claimer: job.claimer,
        sponsorTxid: job.sponsorTxid,
        claimFeeTxid: job.claimFeeTxid,
        refundTxid: job.refundTxid,
        error: job.error,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
      });
    }

    if (method === 'POST' && path === '/sponsor/v3/attest') {
      if (!cfg.attestorKey) return err(503, 'ATTESTOR_NOT_CONFIGURED');
      const dropId = parseUint(body.dropId);
      const claimer = typeof body.claimer === 'string' ? body.claimer : null;
      if (dropId === null || !claimer || !/^S[PTMN][0-9A-Z]{1,40}$/.test(claimer)) {
        return err(400, 'BAD_REQUEST', 'dropId and a standard claimer principal are required');
      }
      // Network guard: mainnet relayer only attests for SP/SM principals.
      const mainnetPrincipal = /^S[PM]/.test(claimer);
      if ((cfg.network === 'mainnet') !== mainnetPrincipal) return err(400, 'WRONG_NETWORK');
      const drop = await readDropForAttestation(transport, cfg, dropId);
      if (!drop) return err(404, 'DROP_NOT_FOUND');
      if (drop.eligibility !== ELIGIBILITY_SIGNED) return err(400, 'WRONG_ELIGIBILITY');
      if (drop.status !== STATUS_ACTIVE) return err(400, 'DROP_NOT_ACTIVE');
      const tip = await transport.getTipHeight();
      const expiresAt = tip + cfg.attestationTtlBlocks;
      const signature = signAttestation(
        {
          chainId: cfg.chainId,
          claimer,
          collectionId: drop.collection,
          dropsContractId: cfg.dropsContractId,
          dropId,
          expiresAt
        },
        cfg.attestorKey
      );
      return json(200, { ok: true, dropId: dropId.toString(), claimer, expiresAt: expiresAt.toString(), signature });
    }

    if (method === 'GET' && path === '/sponsor/v3/health') {
      const health = await relayer.health();
      return json(200, health);
    }

    return err(404, 'NOT_FOUND');
  };

  /**
   * Nothing internal ever reaches the caller: an upstream transport failure or
   * a bug becomes a stable 500 code, never a stack trace or a node error body.
   */
  return async (req: RelayerRequest): Promise<RelayerResponse> => {
    try {
      return await router(req);
    } catch {
      return err(500, 'INTERNAL');
    }
  };
};
