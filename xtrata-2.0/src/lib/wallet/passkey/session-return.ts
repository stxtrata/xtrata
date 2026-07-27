/**
 * Pre-signed rolling return for temporary session wallets.
 *
 * The problem: a session wallet should return its remaining balance to the
 * depositor after ~24h, but by then the user's browser is closed and the seed
 * is sealed behind a passkey nobody can present. The server cannot sign, by
 * design — that is the whole point of not holding the key.
 *
 * The fix: while the browser IS open, sign a return transaction and hand the
 * finished, signed transaction to the server to hold. It is not a key. It can
 * do exactly one thing — send a specific amount back to the depositor — so a
 * compromised server cannot steal with it. The worst it can do is return the
 * user's own money to them early.
 *
 * "Rolling" because a signed transaction pins both nonce and amount: after
 * every job that moves either, the browser replaces the held transaction. The
 * server always holds the current one and broadcasts it at expiry.
 *
 * This replaces the custodial deposit-wallet model flagged as unresolved in
 * xtrata-agent-one/site-integration/DEPLOY-BACKEND.md.
 */

import { AnchorMode, makeSTXTokenTransfer } from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import type { StacksNetworkName } from './seed';

/** Matches scripts/sweep-sponsor-wallet.mjs so return fees are predictable. */
export const RETURN_FEE_MICRO_STX = 3000n;

/** Mainnet SP/SM and testnet ST/SN, Crockford base32 (no I, L, O, U). */
const STACKS_ADDRESS = /^S[PMTN][0-9A-HJKMNP-Z]{38,40}$/;

export class SessionReturnError extends Error {
  constructor(
    readonly code:
      | 'BAD_RECIPIENT'
      | 'SELF_RETURN'
      | 'DUST'
      | 'OVER_CAP',
    message: string
  ) {
    super(message);
    this.name = 'SessionReturnError';
  }
}

export interface ReturnRequest {
  /** Session wallet's key, freshly unsealed. Never persisted. */
  senderKey: string;
  /** Session wallet's own address, for the self-return guard. */
  senderAddress: string;
  /**
   * Where the funds go home to. MUST be user-confirmed, not silently taken
   * from the observed depositor: funds returned to an exchange deposit address
   * are routinely lost, and exchanges are a common funding source.
   */
  recipient: string;
  /** Current session-wallet balance in microSTX. */
  balanceMicroStx: bigint;
  /** Session wallet's next nonce. A signed tx pins this — re-sign if it moves. */
  nonce: bigint;
  network?: StacksNetworkName;
  feeMicroStx?: bigint;
}

export interface PreSignedReturn {
  /** Serialized signed transaction for the server to hold and later broadcast. */
  txHex: string;
  /** Amount actually returned, after the fee. */
  amountMicroStx: bigint;
  /** Nonce this transaction is pinned to. Invalid once the wallet passes it. */
  nonce: bigint;
  recipient: string;
}

/**
 * Enforce a testing cap on deposits.
 *
 * Note what this cannot do: nothing stops someone pasting the address into any
 * wallet and sending more. The cap is only actionable *after* funds arrive —
 * treat an over-cap balance as "return it immediately", never as "reject it".
 */
export const assertWithinCap = (balanceMicroStx: bigint, capMicroStx: bigint): void => {
  if (balanceMicroStx > capMicroStx) {
    throw new SessionReturnError(
      'OVER_CAP',
      `Session wallet holds ${balanceMicroStx} microSTX, over the ${capMicroStx} cap. Return it now rather than transacting.`
    );
  }
};

/**
 * Build and sign a return transaction that sends the whole remaining balance,
 * less the fee, back to the depositor.
 */
export const buildPreSignedReturn = async (req: ReturnRequest): Promise<PreSignedReturn> => {
  const fee = req.feeMicroStx ?? RETURN_FEE_MICRO_STX;
  const recipient = req.recipient.trim().toUpperCase();

  if (!STACKS_ADDRESS.test(recipient)) {
    throw new SessionReturnError('BAD_RECIPIENT', `"${req.recipient}" is not a valid Stacks address.`);
  }
  if (recipient === req.senderAddress.trim().toUpperCase()) {
    throw new SessionReturnError(
      'SELF_RETURN',
      'Return address is the session wallet itself — the funds would never come back.'
    );
  }

  const amountMicroStx = req.balanceMicroStx - fee;
  if (amountMicroStx <= 0n) {
    throw new SessionReturnError(
      'DUST',
      `Balance ${req.balanceMicroStx} microSTX does not cover the ${fee} microSTX fee; nothing to return.`
    );
  }

  const network = req.network === 'testnet' ? new StacksTestnet() : new StacksMainnet();
  const tx = await makeSTXTokenTransfer({
    recipient,
    amount: amountMicroStx,
    senderKey: req.senderKey,
    network,
    fee,
    nonce: req.nonce,
    memo: 'xtrata session return',
    anchorMode: AnchorMode.Any
  });

  return {
    txHex: Buffer.from(tx.serialize()).toString('hex'),
    amountMicroStx,
    nonce: req.nonce,
    recipient
  };
};

/**
 * Whether a held return is still valid.
 *
 * A signed transaction pins its nonce, so once the session wallet's nonce moves
 * past it the held copy is dead on arrival and the browser must sign a
 * replacement. The server should check this before relying on what it holds.
 */
export const isReturnStale = (held: PreSignedReturn, currentNonce: bigint): boolean =>
  currentNonce > held.nonce;
