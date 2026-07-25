import {
  PostConditionMode,
  cvToHex,
  postConditionToHex,
  type ClarityValue,
  type NonFungiblePostCondition,
  type StxPostCondition
} from '@stacks/transactions';
import { XtrataClientError, type TxDescriptor } from '@xtrata/collections-client';
import { showContractCall } from '../wallet/connect';

/**
 * The bridge between the client's pure `TxDescriptor` and the wallet.
 *
 * `TxDescriptor` (client/src/collection/client.ts) is a signed-nothing
 * description of a call: contract, function, `@stacks/transactions` v7 Clarity
 * values, deny-mode STX post-conditions and the target network. The wallet
 * layer is built around @stacks/connect 7.x, whose bridge speaks the v6 wire
 * helpers. Rather than let two versions of `@stacks/transactions` meet, this
 * module serializes both Clarity values and post-conditions to hex here, with
 * the v7 encoder that produced them, and hands the wallet strings — a form both
 * versions accept unchanged (the wire format is identical; only the in-memory
 * object shapes differ).
 *
 * Guarantees this module is responsible for:
 * - `postConditionMode` is always Deny. The descriptor type only permits
 *   'deny'; this asserts it rather than trusting it.
 * - Post-conditions are never dropped. An empty list on a spending call would
 *   silently remove the spend cap, so an explicit list is always forwarded.
 * - Wallet cancellation is normalized to `wallet-rejected` (retryable, pauses
 *   the run) and every other failure to `broadcast-failed`.
 */

export interface SubmitResult {
  txid: string;
}

/**
 * The widest descriptor this bridge accepts: the collection client's
 * `TxDescriptor` (STX post-conditions only) and the drops client's
 * `DropsTxDescriptor` (which also carries NFT send conditions for escrow,
 * claims and recovery) are both structurally assignable to it. One bridge, so
 * the deny-mode and never-drop-post-conditions guarantees below hold for
 * collection AND drop transactions alike.
 */
export interface SubmittableTx {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions: (StxPostCondition | NonFungiblePostCondition)[];
  postConditionMode: 'deny';
  network: TxDescriptor['network'];
}

export interface SubmitService {
  (tx: TxDescriptor): Promise<SubmitResult>;
}

/** Submit seam for callers that pass drops descriptors. */
export interface AnySubmitService {
  (tx: SubmittableTx): Promise<SubmitResult>;
}

export interface WalletCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: string[];
  postConditions: string[];
  postConditionMode: PostConditionMode;
  network: TxDescriptor['network'];
  stxAddress?: string;
}

/** Pure mapping — the piece under test. No wallet, no promises. */
export const toWalletCallParams = (
  tx: SubmittableTx,
  options: { stxAddress?: string } = {}
): WalletCallParams => {
  if (tx.postConditionMode !== 'deny') {
    throw new XtrataClientError(
      'plan-invalid',
      `refusing to submit with postConditionMode="${String(tx.postConditionMode)}"; only deny mode is allowed`
    );
  }
  if (!Array.isArray(tx.postConditions)) {
    throw new XtrataClientError('plan-invalid', 'transaction descriptor has no post-condition list');
  }
  return {
    contractAddress: tx.contractAddress,
    contractName: tx.contractName,
    functionName: tx.functionName,
    functionArgs: tx.functionArgs.map((arg) => cvToHex(arg)),
    postConditions: tx.postConditions.map((pc) => postConditionToHex(pc)),
    postConditionMode: PostConditionMode.Deny,
    network: tx.network,
    ...(options.stxAddress !== undefined ? { stxAddress: options.stxAddress } : {})
  };
};

const normalizeTxId = (payload: { txId?: string; txid?: string }): string => {
  const raw = payload.txId ?? payload.txid;
  if (typeof raw !== 'string' || raw.length === 0) {
    throw new XtrataClientError('broadcast-failed', 'wallet returned no transaction id');
  }
  return raw.startsWith('0x') ? raw : `0x${raw}`;
};

export interface SubmitOptions {
  /** The connected account; used as the wallet's suggested signer. */
  stxAddress?: string;
  /** Test seam — defaults to the hardened wallet layer. */
  showContractCallImpl?: typeof showContractCall;
}

/**
 * Submit one descriptor and resolve with its txid. Rejects with a normalized
 * `XtrataClientError`; the executor reads `code` to decide between pausing the
 * run (wallet-rejected) and re-observing the chain (broadcast-failed).
 */
export const createSubmitService = (options: SubmitOptions = {}): AnySubmitService => {
  const call = options.showContractCallImpl ?? showContractCall;
  return (tx: SubmittableTx) =>
    new Promise<SubmitResult>((resolve, reject) => {
      const params = toWalletCallParams(
        tx,
        options.stxAddress !== undefined ? { stxAddress: options.stxAddress } : {}
      );
      let settled = false;
      const settle = (fn: () => void): void => {
        if (settled) return;
        settled = true;
        fn();
      };

      call({
        ...params,
        onFinish: (payload) => {
          settle(() => {
            try {
              resolve({ txid: normalizeTxId(payload) });
            } catch (error) {
              reject(error);
            }
          });
        },
        onCancel: () => {
          settle(() =>
            reject(
              new XtrataClientError('wallet-rejected', `wallet cancelled ${tx.functionName}`, {
                detail: { functionName: tx.functionName }
              })
            )
          );
        },
        onError: (error) => {
          settle(() =>
            reject(
              new XtrataClientError('broadcast-failed', `wallet failed to broadcast ${tx.functionName}`, {
                cause: error,
                detail: { functionName: tx.functionName }
              })
            )
          );
        }
      });
    });
};
