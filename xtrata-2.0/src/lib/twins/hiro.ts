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

/**
 * Outcome of a direct data-map read. `ok` separates "the node answered" from
 * "the request failed": a failed read must never be treated as "no such entry"
 * (see the `ownerOfChecked` convention in xtrata-2.0/CLAUDE.md).
 *
 *   { ok: true,  value: 1296n } - the map has an entry
 *   { ok: true,  value: null  } - the node answered and there is no entry
 *   { ok: false, value: null  } - the read failed; the caller should fall back
 */
export type MapUintResult = { ok: boolean; value: bigint | null };

/**
 * Read `(map-get? <mapName> <uint key>)` straight from a contract's data map via
 * Hiro's `map_entry` endpoint, for maps whose value is a uint. This needs no
 * read-only wrapper on the contract, which is what makes it usable against
 * helpers (e.g. `BoundTwins` on the FACFUN Monkeys helper) that keep the reverse
 * xtrata-id -> local-id map but never exposed a getter for it.
 */
export const readMapUint = async (params: {
  contractId: string;
  mapName: string;
  key: bigint | number | string;
  network: NetworkType;
}): Promise<MapUintResult> => {
  try {
    const [address, name] = splitContractId(params.contractId);
    const response = (await fetchJsonWithFallback(
      `/v2/map_entry/${address}/${name}/${params.mapName}?proof=0`,
      params.network,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The body is the key's hex-encoded Clarity value, as a JSON string.
        body: JSON.stringify(cvToHex(uintCV(params.key)))
      }
    )) as { data?: unknown };
    if (typeof response?.data !== 'string') {
      return { ok: false, value: null };
    }
    let node = cvToJSON(hexToCV(response.data)) as {
      type?: string;
      value?: unknown;
    } | null;
    // `(some u1296)` arrives as an optional wrapping the uint; `none` has a
    // null value. Anything else is not a uint map and is reported as a failure.
    while (node && typeof node.type === 'string' && node.type.startsWith('(optional')) {
      if (node.value === null || node.value === undefined) {
        return { ok: true, value: null };
      }
      node = node.value as typeof node;
    }
    if (node && node.type === 'uint' && typeof node.value === 'string') {
      return { ok: true, value: BigInt(node.value) };
    }
    return { ok: false, value: null };
  } catch {
    return { ok: false, value: null };
  }
};

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
