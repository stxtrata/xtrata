import { XtrataClientError } from '@xtrata/collections-client';
import { showContractDeploy } from '../wallet/connect';
import type { NetworkType } from '../wallet/network';

/**
 * Contract deployment.
 *
 * Clarity version is pinned EXPLICITLY, never left to the wallet. The
 * collection defaults to 3: it proxies the Clarity-3 core through
 * `as-contract`, and wallets that default to the latest Clarity version produce
 * a contract whose `as-contract` composition does not resolve. Callers that
 * deploy something else (the drops singleton is Clarity 4) pass their own
 * version. A wallet that silently ignores `clarityVersion` is caught by the
 * post-deploy source check, not by trusting the request.
 */

export const COLLECTION_CLARITY_VERSION = 3;

export interface DeployParams {
  contractName: string;
  codeBody: string;
  network: NetworkType;
  stxAddress?: string;
  /** Defaults to the collection's Clarity 3. */
  clarityVersion?: number;
}

export interface DeployOptions {
  showContractDeployImpl?: typeof showContractDeploy;
}

export const createDeployService = (options: DeployOptions = {}) => {
  const deploy = options.showContractDeployImpl ?? showContractDeploy;
  return (params: DeployParams): Promise<{ txid: string }> =>
    new Promise((resolve, reject) => {
      let settled = false;
      const settle = (fn: () => void): void => {
        if (settled) return;
        settled = true;
        fn();
      };
      deploy({
        contractName: params.contractName,
        codeBody: params.codeBody,
        clarityVersion: params.clarityVersion ?? COLLECTION_CLARITY_VERSION,
        network: params.network,
        ...(params.stxAddress !== undefined ? { stxAddress: params.stxAddress } : {}),
        onFinish: (payload) => {
          const raw = (payload.txId ?? payload.txid) as string | undefined;
          settle(() => {
            if (typeof raw !== 'string' || raw.length === 0) {
              reject(new XtrataClientError('broadcast-failed', 'wallet returned no deploy txid'));
              return;
            }
            resolve({ txid: raw.startsWith('0x') ? raw : `0x${raw}` });
          });
        },
        onCancel: () => {
          settle(() =>
            reject(new XtrataClientError('wallet-rejected', 'wallet cancelled the contract deploy'))
          );
        },
        onError: (error) => {
          settle(() =>
            reject(
              new XtrataClientError('broadcast-failed', 'wallet failed to broadcast the deploy', {
                cause: error
              })
            )
          );
        }
      });
    });
};

/**
 * Read the source the chain actually stored for a deployed contract. Returns
 * null while the contract is not yet indexed (404), so the caller can poll.
 */
export const fetchContractSource = async (params: {
  apiBaseUrl: string;
  contractId: string;
  fetchImpl?: typeof fetch;
}): Promise<string | null> => {
  const [address, name] = params.contractId.split('.');
  if (!address || !name) {
    throw new XtrataClientError('plan-invalid', `invalid contract id: ${params.contractId}`);
  }
  const base = params.apiBaseUrl.replace(/\/+$/, '');
  const doFetch = params.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const response = await doFetch(`${base}/v2/contracts/source/${address}/${name}?proof=0`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new XtrataClientError(
      'broadcast-failed',
      `contract source for ${params.contractId} returned HTTP ${response.status}`
    );
  }
  const body = (await response.json()) as { source?: string };
  if (typeof body.source !== 'string') {
    throw new XtrataClientError('internal', 'contract source response has no source field');
  }
  return body.source;
};
