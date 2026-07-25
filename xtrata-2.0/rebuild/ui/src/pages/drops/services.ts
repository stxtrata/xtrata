import { createContext, useContext } from 'react';
import { PostConditionMode } from '@stacks/transactions';
import {
  XtrataClientError,
  type ChainTxResult,
  type DropsReads,
  type DropsTxBuilder,
  type DropsTxDescriptor,
  type ReadOnlyTransport
} from '@xtrata/collections-client';
import type { CollectionReadsLike } from './store';
import { showSponsoredContractCall } from '../../wallet/connect';
import type { NetworkType } from '../../wallet/network';
import { toWalletCallParams } from '../../services/submit';
import type { RelayerClient } from './relayer';
import type { SponsoredSigner } from './sponsoredClaim';

/**
 * Chain/wallet/relayer services for the Drop Builder and the claim page.
 *
 * Everything optional is "needs a connected wallet on the right network"; the
 * screens degrade to read-only rather than throwing, the same rule the Studio
 * follows.
 */
export interface DropsServices {
  apiBaseUrl: string;
  network: NetworkType;
  coreContractId: string;
  dropsContractId: string;
  /** Base URL the relayer's `/sponsor/v3` routes hang off. */
  relayerBaseUrl: string;
  address?: string;
  canSign: boolean;
  transport?: ReadOnlyTransport;
  dropsReads?: DropsReads;
  /**
   * Bound to the collection currently under the builder (or the drop's own).
   * Structural rather than the concrete `CollectionReads` class so the screens
   * can be driven by a fake collection in tests.
   */
  collectionReads?: CollectionReadsLike;
  builder?: DropsTxBuilder;
  submit?: (tx: DropsTxDescriptor) => Promise<{ txid: string }>;
  waitConfirm?: (txid: string) => Promise<ChainTxResult>;
  getBlockHeight?: () => Promise<number>;
  getNonce?: (address: string) => Promise<number>;
  relayer?: RelayerClient;
  /** Signs a fee-0 sponsored transaction WITHOUT broadcasting it. */
  signSponsored?: SponsoredSigner;
}

export const DropsServicesContext = createContext<DropsServices | null>(null);

export const useDropsServices = (): DropsServices => {
  const value = useContext(DropsServicesContext);
  if (!value) throw new Error('useDropsServices must be used inside its provider');
  return value;
};

/**
 * The sponsored-signing seam.
 *
 * `showContractCall` broadcasts; a sponsored claim must stop after the origin
 * signature so the relayer can attach the sponsor signature and pay the fee.
 * The wallet layer's `showSponsoredContractCall` does exactly that and hands
 * back the serialized signed transaction, which is what the relayer treats as
 * the sole source of truth.
 */
export const createSponsoredSigner = (options: {
  showSponsoredImpl?: typeof showSponsoredContractCall;
}): SponsoredSigner => {
  const call = options.showSponsoredImpl ?? showSponsoredContractCall;
  return ({ tx, nonce, stxAddress }) =>
    new Promise<{ txHex: string }>((resolve, reject) => {
      const params = toWalletCallParams(tx, { stxAddress });
      let settled = false;
      const settle = (fn: () => void): void => {
        if (settled) return;
        settled = true;
        fn();
      };
      call({
        contractAddress: params.contractAddress,
        contractName: params.contractName,
        functionName: params.functionName,
        functionArgs: params.functionArgs,
        postConditions: params.postConditions,
        postConditionMode: PostConditionMode.Deny,
        network: params.network,
        sponsored: true,
        fee: 0n,
        nonce,
        stxAddress,
        onFinish: (payload) => {
          settle(() => {
            const txHex =
              typeof payload.txRaw === 'string' && payload.txRaw.length > 0 ? payload.txRaw : null;
            if (txHex === null) {
              reject(
                new XtrataClientError(
                  'wallet-rejected',
                  'the wallet signed the claim but returned no transaction to sponsor'
                )
              );
              return;
            }
            resolve({ txHex });
          });
        },
        onCancel: () => {
          settle(() =>
            reject(new XtrataClientError('wallet-rejected', 'the wallet cancelled the sponsored claim'))
          );
        },
        onError: (error) => {
          settle(() =>
            reject(
              new XtrataClientError('broadcast-failed', 'the wallet could not sign the sponsored claim', {
                cause: error
              })
            )
          );
        }
      });
    });
};
