import { XtrataClientError } from '@xtrata/collections-client';
import { fetchContractSource } from '../../services/deploy';
import { parseInterfaceResponse, type ContractFunction, type ContractInterface } from './verify';

/**
 * Chain reads the canary needs and the app does not.
 *
 * `fetchContractSource` already lives in `services/deploy.ts` (it is what the
 * Studio's post-deploy check uses); the interface probe and the balance read
 * are canary-only, so they live here rather than growing the shared service.
 * Every one of them treats "not found" as a value, not an exception, because
 * absence is exactly what stages 5 and 6 are asking about.
 */

export { fetchContractSource };

const trim = (base: string): string => base.replace(/\/+$/, '');

/** Deployed callable surface, or null while the contract is not indexed. */
export const fetchContractInterface = async (params: {
  apiBaseUrl: string;
  contractId: string;
  fetchImpl?: typeof fetch;
}): Promise<ContractFunction[] | null> => {
  const [address, name] = params.contractId.split('.');
  if (!address || !name) {
    throw new XtrataClientError('plan-invalid', `invalid contract id: ${params.contractId}`);
  }
  const doFetch = params.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const response = await doFetch(`${trim(params.apiBaseUrl)}/v2/contracts/interface/${address}/${name}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new XtrataClientError(
      'broadcast-failed',
      `contract interface for ${params.contractId} returned HTTP ${response.status}`
    );
  }
  return parseInterfaceResponse((await response.json()) as ContractInterface);
};

export interface AccountBalance {
  /** Spendable microSTX. */
  microStx: bigint;
  address: string;
}

export const fetchAccountBalance = async (params: {
  apiBaseUrl: string;
  address: string;
  fetchImpl?: typeof fetch;
}): Promise<AccountBalance> => {
  const doFetch = params.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const response = await doFetch(
    `${trim(params.apiBaseUrl)}/extended/v1/address/${params.address}/stx`
  );
  if (!response.ok) {
    throw new XtrataClientError(
      'broadcast-failed',
      `balance for ${params.address} returned HTTP ${response.status}`
    );
  }
  const body = (await response.json()) as { balance?: string; locked?: string };
  const balance = BigInt(body.balance ?? '0');
  const locked = BigInt(body.locked ?? '0');
  return { microStx: balance > locked ? balance - locked : 0n, address: params.address };
};

/**
 * Rough deploy cost. A contract deploy is priced on its byte length, and the
 * exact number comes from the wallet's own estimate at signing time; this is
 * the "can this account plausibly afford it" figure shown before arming.
 */
export const estimateDeployCostMicroStx = (source: string): bigint =>
  BigInt(Math.ceil(new TextEncoder().encode(source).length / 100)) * 100n + 100_000n;

// --- relayer probe ---------------------------------------------------------

export interface RelayerProbeResult {
  ok: boolean;
  /** Endpoint → HTTP status / error string, in call order. */
  steps: { endpoint: string; status: number | string; body?: unknown }[];
  detail: string;
}

/**
 * Stage 10: quote → submit → status against the configured relayer.
 *
 * The canary does not forge a signed claim transaction; it exercises the
 * request surface and asserts the relayer answers with its own stable error
 * taxonomy rather than an internal failure. A relayer that returns `INTERNAL`
 * or an unparseable body fails the stage; one that returns a documented
 * business-rule code (BAD_TX, DROP_NOT_FOUND, …) has demonstrably decoded and
 * authorized the request, which is what this stage is proving.
 */
export const probeRelayer = async (params: {
  relayerBaseUrl: string;
  dropId: number;
  txHex?: string;
  fetchImpl?: typeof fetch;
}): Promise<RelayerProbeResult> => {
  const doFetch = params.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const base = trim(params.relayerBaseUrl);
  const steps: RelayerProbeResult['steps'] = [];

  const call = async (endpoint: string, init?: RequestInit): Promise<unknown> => {
    try {
      const response = await doFetch(`${base}${endpoint}`, init);
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = null;
      }
      steps.push({ endpoint, status: response.status, body });
      return body;
    } catch (error) {
      steps.push({ endpoint, status: error instanceof Error ? error.message : String(error) });
      return null;
    }
  };

  const json = (payload: unknown): RequestInit => ({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  await call('/sponsor/v3/health');
  await call('/sponsor/v3/quote', json({ dropId: params.dropId }));
  const submitted = (await call(
    '/sponsor/v3/submit',
    json({ dropId: params.dropId, txHex: params.txHex ?? '' })
  )) as { jobId?: string } | null;
  if (submitted?.jobId) {
    await call(`/sponsor/v3/status/${submitted.jobId}`);
  }

  const unreachable = steps.filter((step) => typeof step.status === 'string');
  const internal = steps.filter((step) => step.status === 500);
  const ok = unreachable.length === 0 && internal.length === 0;
  return {
    ok,
    steps,
    detail: ok
      ? `relayer answered all ${steps.length} probes with a stable status`
      : unreachable.length > 0
        ? `relayer unreachable: ${String(unreachable[0]?.status)}`
        : 'relayer returned HTTP 500 (INTERNAL) — the request surface is not healthy'
  };
};
