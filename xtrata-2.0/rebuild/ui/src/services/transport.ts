import {
  Cl,
  cvToHex,
  hexToCV,
  type ClarityValue
} from '@stacks/transactions';
import {
  parseContractId,
  XtrataClientError,
  type ReadOnlyTransport
} from '@xtrata/collections-client';

/**
 * Read-only transport for `CollectionReads` / `DropsReads`.
 *
 * Talks the Hiro `/v2/contracts/call-read` endpoint directly rather than going
 * through `fetchCallReadOnlyFunction`, so the base URL is configurable per
 * environment and every failure is normalized onto the client taxonomy before
 * it reaches the UI.
 */

export interface TransportConfig {
  apiBaseUrl: string;
  /** `sender` for read-only evaluation; any valid principal works. */
  senderAddress: string;
  fetchImpl?: typeof fetch;
}

interface CallReadResponse {
  okay: boolean;
  result?: string;
  cause?: string;
}

export const createReadOnlyTransport = (config: TransportConfig): ReadOnlyTransport => {
  const base = config.apiBaseUrl.replace(/\/+$/, '');
  const doFetch = config.fetchImpl ?? globalThis.fetch.bind(globalThis);

  return async (contractId: string, functionName: string, functionArgs: ClarityValue[]) => {
    const { address, name } = parseContractId(contractId);
    const url = `${base}/v2/contracts/call-read/${address}/${name}/${functionName}`;

    let response: Response;
    try {
      response = await doFetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sender: config.senderAddress,
          arguments: functionArgs.map((arg) => cvToHex(arg))
        })
      });
    } catch (cause) {
      throw new XtrataClientError('broadcast-failed', `read-only call to ${functionName} failed`, {
        cause,
        detail: { contractId, functionName }
      });
    }

    if (!response.ok) {
      throw new XtrataClientError(
        'broadcast-failed',
        `read-only call to ${functionName} returned HTTP ${response.status}`,
        { detail: { contractId, functionName, status: response.status } }
      );
    }

    const body = (await response.json()) as CallReadResponse;
    if (!body.okay || typeof body.result !== 'string') {
      throw new XtrataClientError(
        'chain-rejected',
        `read-only call to ${functionName} was not evaluated: ${body.cause ?? 'unknown cause'}`,
        { detail: { contractId, functionName, cause: body.cause } }
      );
    }
    return hexToCV(body.result);
  };
};

/** Current chain tip height (used for reservation-expiry math). */
export const createBlockHeightReader = (config: TransportConfig): (() => Promise<number>) => {
  const base = config.apiBaseUrl.replace(/\/+$/, '');
  const doFetch = config.fetchImpl ?? globalThis.fetch.bind(globalThis);
  return async () => {
    const response = await doFetch(`${base}/v2/info`);
    if (!response.ok) {
      throw new XtrataClientError('broadcast-failed', `chain info returned HTTP ${response.status}`);
    }
    const body = (await response.json()) as { stacks_tip_height?: number; burn_block_height?: number };
    const height = body.stacks_tip_height ?? body.burn_block_height;
    if (typeof height !== 'number') {
      throw new XtrataClientError('internal', 'chain info response has no height');
    }
    return height;
  };
};

/**
 * Next usable nonce for an account.
 *
 * Only the sponsored-claim path needs this: a sponsored transaction is built
 * and signed by the page (fee 0, origin = claimer) before the relayer attaches
 * its own signature, so the origin nonce cannot be left to the wallet. Hiro's
 * `possible_next_nonce` already accounts for the mempool.
 */
export const createNonceReader = (config: TransportConfig): ((address: string) => Promise<number>) => {
  const base = config.apiBaseUrl.replace(/\/+$/, '');
  const doFetch = config.fetchImpl ?? globalThis.fetch.bind(globalThis);
  return async (address: string) => {
    let response: Response;
    try {
      response = await doFetch(`${base}/extended/v1/address/${address}/nonces`);
    } catch (cause) {
      throw new XtrataClientError('broadcast-failed', `could not read the nonce for ${address}`, {
        cause
      });
    }
    if (!response.ok) {
      throw new XtrataClientError(
        'broadcast-failed',
        `nonce lookup for ${address} returned HTTP ${response.status}`
      );
    }
    const body = (await response.json()) as {
      possible_next_nonce?: number;
      last_executed_tx_nonce?: number;
    };
    const nonce = body.possible_next_nonce;
    if (typeof nonce !== 'number') {
      throw new XtrataClientError('internal', `nonce response for ${address} has no next nonce`);
    }
    return nonce;
  };
};

/**
 * Core fee quote: `quote-inscription-fee(total-size, total-chunks)` on the
 * pinned core. Returns microSTX. The Studio uses this instead of a hardcoded
 * schedule so the plan totals track the on-chain fee units.
 */
export const quoteInscriptionFee = async (
  transport: ReadOnlyTransport,
  coreContractId: string,
  params: { totalSize: number; totalChunks: number }
): Promise<bigint> => {
  const cv = await transport(coreContractId, 'quote-inscription-fee', [
    Cl.uint(params.totalSize),
    Cl.uint(params.totalChunks)
  ]);
  return extractUint(cv);
};

const extractUint = (cv: ClarityValue): bigint => {
  const value = cv as { type?: string; value?: unknown };
  if (value.type === 'uint' && typeof value.value === 'bigint') return value.value;
  if (value.type === 'ok') return extractUint(value.value as ClarityValue);
  if (value.type === 'tuple') {
    const data = (value as unknown as { value: Record<string, ClarityValue> }).value;
    const total = data['total'] ?? data['fee'] ?? data['amount'];
    if (total) return extractUint(total);
  }
  throw new XtrataClientError('internal', `expected a uint fee quote, received ${String(value.type)}`);
};
