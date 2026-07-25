import {
  cvToHex,
  cvToJSON,
  hexToCV,
  principalCV,
  validateStacksAddress
} from '@stacks/transactions';
import type { NetworkType } from '../network/types';
import { getApiBaseUrls } from '../network/config';
import { logDebug } from '../utils/logger';
import { getBnsV2ContractId } from './config';
import { normalizeBnsName } from './helpers';

// The BNSv2 API we use for the *list* of names a wallet holds does not report
// which one is primary — /names/address/<addr>/valid returns bare name records,
// and there is no /primary route. Guessing (first .btc alphabetically) picks the
// wrong name for any wallet whose primary is not first, so read the answer from
// the BNS-V2 contract instead:
//
//   get-primary(owner) -> (ok (some {name: (buff 20), namespace: (buff 20)}))
//
// get-primary-name exists too, but returns the internal name id as a uint.

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, '');

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message || error.name || 'Error';
  }
  return typeof error === 'string' ? error : String(error);
};

const decodeAsciiBuffer = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }
  const hex = value.startsWith('0x') ? value.slice(2) : value;
  if (!hex || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) {
    return null;
  }
  let decoded = '';
  for (let index = 0; index < hex.length; index += 2) {
    const code = Number.parseInt(hex.slice(index, index + 2), 16);
    // BNS labels are ASCII; anything else means we misread the response.
    if (code < 0x20 || code > 0x7e) {
      return null;
    }
    decoded += String.fromCharCode(code);
  }
  return decoded;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

// (ok (some {name, namespace))) unwraps to a plain {name, namespace} record.
// Errors, (ok none) and anything unexpected resolve to null.
export const parsePrimaryNameResult = (resultHex: string) => {
  let json: unknown;
  try {
    json = cvToJSON(hexToCV(resultHex));
  } catch (error) {
    return null;
  }

  const response = asRecord(json);
  if (!response || response.success === false) {
    return null;
  }

  const optional = asRecord(response.value);
  const tuple = asRecord(optional?.value);
  const fields = asRecord(tuple?.value);
  if (!fields) {
    return null;
  }

  const name = decodeAsciiBuffer(asRecord(fields.name)?.value);
  const namespace = decodeAsciiBuffer(asRecord(fields.namespace)?.value);
  if (!name || !namespace) {
    return null;
  }

  return normalizeBnsName(`${name}.${namespace}`);
};

const callGetPrimary = async (params: {
  baseUrl: string;
  contractId: string;
  address: string;
  signal?: AbortSignal;
}) => {
  const [contractAddress, contractName] = params.contractId.split('.');
  const url = `${normalizeBaseUrl(
    params.baseUrl
  )}/v2/contracts/call-read/${contractAddress}/${contractName}/get-primary`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: params.address,
      arguments: [cvToHex(principalCV(params.address))]
    }),
    signal: params.signal
  });
  if (!response.ok) {
    throw new Error(`BNS primary lookup failed (${response.status})`);
  }
  const body = (await response.json()) as { okay?: boolean; result?: string };
  if (!body?.okay || typeof body.result !== 'string') {
    return null;
  }
  return parsePrimaryNameResult(body.result);
};

/**
 * The wallet's on-chain primary BNS name, or null when it has none, when the
 * network has no configured BNS-V2 deployment, or when the lookup fails. A null
 * is never fatal — callers fall back to the name-list heuristics.
 */
export const resolvePrimaryBnsName = async (params: {
  address: string;
  network: NetworkType;
  signal?: AbortSignal;
}): Promise<string | null> => {
  const address = params.address.trim();
  if (!validateStacksAddress(address)) {
    return null;
  }

  const contractId = getBnsV2ContractId(params.network);
  if (!contractId) {
    return null;
  }

  let lastError: unknown = null;
  for (const baseUrl of getApiBaseUrls(params.network)) {
    try {
      return await callGetPrimary({
        baseUrl,
        contractId,
        address,
        signal: params.signal
      });
    } catch (error) {
      lastError = error;
    }
  }

  logDebug('bns', 'Primary BNS name lookup unavailable', {
    address,
    network: params.network,
    error: getErrorMessage(lastError)
  });
  return null;
};
