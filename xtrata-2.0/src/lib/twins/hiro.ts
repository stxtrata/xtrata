import { cvToHex, hexToCV, cvToJSON, uintCV } from '@stacks/transactions';
import type { ClarityValue } from '@stacks/transactions';
import { getApiBaseUrls } from '../network/config';
import type { NetworkType } from '../network/types';

/**
 * Thin Hiro REST helpers used by the Forever Twin resolver. Kept dependency-free
 * of the per-contract XtrataClient so the resolver can read arbitrary contracts
 * (helper index, source NFT) across the registry. Mirrors the fetch-based
 * approach already used by the standalone viewer.
 */

const splitContractId = (contractId: string): [string, string] => {
  const [address, name] = contractId.split('.');
  if (!address || !name) {
    throw new Error(`Invalid contract id: ${contractId}`);
  }
  return [address, name];
};

const fetchJsonWithFallback = async (
  path: string,
  network: NetworkType,
  init?: RequestInit
): Promise<unknown> => {
  const bases = getApiBaseUrls(network);
  let lastError: unknown = null;
  for (const base of bases) {
    const url = `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        throw new Error(`Hiro request failed (${response.status}) for ${path}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`Hiro request failed for ${path}`);
};

/** Decoded JSON view (via cvToJSON) of a read-only function result. */
export const callReadOnly = async (params: {
  contractId: string;
  functionName: string;
  args?: ClarityValue[];
  senderAddress?: string;
  network: NetworkType;
}): Promise<ReturnType<typeof cvToJSON>> => {
  const [address, name] = splitContractId(params.contractId);
  const sender = params.senderAddress ?? address;
  const body = JSON.stringify({
    sender,
    arguments: (params.args ?? []).map((arg) => cvToHex(arg))
  });
  const result = (await fetchJsonWithFallback(
    `/v2/contracts/call-read/${address}/${name}/${params.functionName}`,
    params.network,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    }
  )) as { okay?: boolean; result?: string; cause?: string };
  if (!result?.okay || typeof result.result !== 'string') {
    throw new Error(
      `Read-only call ${params.contractId}::${params.functionName} failed: ${
        result?.cause ?? 'unknown'
      }`
    );
  }
  return cvToJSON(hexToCV(result.result));
};

export const uintArg = (value: bigint | number | string): ClarityValue =>
  uintCV(value);

export type ContractLogEvent = {
  /** Decoded print payload (cvToJSON value map), or null when not a print. */
  print: Record<string, unknown> | null;
};

type RawContractEvent = {
  event_type?: string;
  contract_log?: {
    topic?: string;
    value?: { hex?: string };
  };
};

/**
 * Stream a contract's events (newest first) and yield decoded `print` payloads.
 * Used to reconstruct the helper's binding history (xtrata-id <-> local id)
 * without a dedicated reverse-lookup function on-chain.
 */
export const fetchContractPrintEvents = async function* (params: {
  contractId: string;
  network: NetworkType;
  pageSize?: number;
  maxEvents?: number;
}): AsyncGenerator<Record<string, unknown>> {
  const [address, name] = splitContractId(params.contractId);
  const pageSize = Math.min(params.pageSize ?? 50, 50);
  const maxEvents = params.maxEvents ?? 5000;
  let offset = 0;
  let seen = 0;
  while (seen < maxEvents) {
    const page = (await fetchJsonWithFallback(
      `/extended/v1/contract/${address}.${name}/events?limit=${pageSize}&offset=${offset}`,
      params.network
    )) as { results?: RawContractEvent[] };
    const results = page.results ?? [];
    if (results.length === 0) {
      return;
    }
    for (const event of results) {
      seen += 1;
      if (
        event.event_type === 'smart_contract_log' &&
        event.contract_log?.topic === 'print' &&
        typeof event.contract_log.value?.hex === 'string'
      ) {
        try {
          const decoded = cvToJSON(hexToCV(event.contract_log.value.hex));
          const value = unwrapTuple(decoded);
          if (value) {
            yield value;
          }
        } catch {
          // Ignore malformed events; continue scanning.
        }
      }
    }
    if (results.length < pageSize) {
      return;
    }
    offset += pageSize;
  }
};

type CvJson = { type: string; value: unknown; success?: boolean };

/** Flatten a cvToJSON tuple node into a plain { key: cvJsonNode } map. */
export const unwrapTuple = (
  node: CvJson | null | undefined
): Record<string, CvJson> | null => {
  if (!node) {
    return null;
  }
  // Unwrap optionals / responses to reach the underlying tuple.
  let current: CvJson | null = node;
  while (
    current &&
    (current.type.startsWith('(optional') ||
      current.type.startsWith('(response'))
  ) {
    current = (current.value as CvJson | null) ?? null;
  }
  if (current && current.type.startsWith('(tuple') && current.value) {
    return current.value as Record<string, CvJson>;
  }
  return null;
};

/** Read a uint field from a cvToJSON tuple map as a bigint, or null. */
export const tupleUint = (
  tuple: Record<string, CvJson> | null,
  key: string
): bigint | null => {
  const node = tuple?.[key];
  if (!node || typeof node.value !== 'string') {
    return null;
  }
  try {
    return BigInt(node.value);
  } catch {
    return null;
  }
};

/** Read a bool field from a cvToJSON tuple map, or null. */
export const tupleBool = (
  tuple: Record<string, CvJson> | null,
  key: string
): boolean | null => {
  const node = tuple?.[key];
  if (!node || typeof node.value !== 'boolean') {
    return null;
  }
  return node.value;
};

/** Read a principal field from a cvToJSON tuple map, or null. */
export const tuplePrincipal = (
  tuple: Record<string, CvJson> | null,
  key: string
): string | null => {
  const node = tuple?.[key];
  if (!node || typeof node.value !== 'string') {
    return null;
  }
  return node.value;
};

/** Unwrap a SIP-009 get-owner result `(ok (optional principal))` to a string. */
export const unwrapOwnerResult = (
  node: CvJson | null | undefined
): string | null => {
  let current: CvJson | null = node ?? null;
  while (
    current &&
    (current.type.startsWith('(response') ||
      current.type.startsWith('(optional'))
  ) {
    current = (current.value as CvJson | null) ?? null;
  }
  if (current && typeof current.value === 'string') {
    return current.value;
  }
  return null;
};

export type { CvJson };
