import type { ClaimReservationRow, DropRow } from '@xtrata/collections-client';
import { eligibilityOf } from './store';

/**
 * Claim-side eligibility, evaluated in the same order the contract asserts it
 * (`assert-claimable` → entrypoint eligibility → `check-wallet-eligibility` →
 * `allocate-index`). Doing it in this order means the reason shown to a
 * would-be claimer is the reason the chain would actually give, instead of the
 * first thing the UI happened to notice.
 *
 * A reservation short-circuits most of it: the contract checked eligibility
 * when the index was reserved, and `claim` settles a held reservation without
 * re-checking limits.
 */

export type EligibilityKind =
  | 'connect-wallet'
  | 'wrong-network'
  | 'contract-paused'
  | 'not-active'
  | 'window-not-open'
  | 'window-closed'
  | 'sold-out'
  | 'not-allowlisted'
  | 'allowance-used'
  | 'wallet-limit'
  | 'attestor-not-configured'
  | 'attestation-required'
  | 'holds-reservation'
  | 'eligible';

export interface EligibilityVerdict {
  kind: EligibilityKind;
  /** May this wallet broadcast a claim right now? */
  canClaim: boolean;
  /** Sentence shown to the claimer. */
  message: string;
  /** The entrypoint a claim would use. */
  entrypoint: 'claim' | 'claim-signed' | null;
  /** Set when the wallet already holds a reserved index. */
  reservedIndex?: number;
}

export interface EligibilityInput {
  drop: DropRow;
  /** Reads for the connected wallet; null when no wallet is connected. */
  wallet: string | null;
  wrongNetwork?: boolean;
  contractPaused: boolean;
  tipHeight: number | null;
  remaining: number;
  walletClaims: number;
  /** null when the drop is not allowlist-gated or the entry is missing. */
  allowlistAllowance: number | null;
  reservation: ClaimReservationRow | null;
  /** Whether the drops contract has an attestor pubkey hash configured. */
  attestorConfigured: boolean | null;
  /** An attestation already fetched for this wallet, if any. */
  hasAttestation?: boolean;
}

const verdict = (
  kind: EligibilityKind,
  canClaim: boolean,
  message: string,
  entrypoint: EligibilityVerdict['entrypoint'],
  extra: Partial<EligibilityVerdict> = {}
): EligibilityVerdict => ({ kind, canClaim, message, entrypoint, ...extra });

export const evaluateEligibility = (input: EligibilityInput): EligibilityVerdict => {
  const eligibility = eligibilityOf(input.drop.eligibility);
  const entrypoint = eligibility === 'signed' ? 'claim-signed' : 'claim';

  if (!input.wallet) {
    return verdict('connect-wallet', false, 'Connect a wallet to check whether you can claim.', null);
  }
  if (input.wrongNetwork) {
    return verdict(
      'wrong-network',
      false,
      'The connected account is on a different network than this drop.',
      null
    );
  }
  if (input.contractPaused) {
    return verdict('contract-paused', false, 'The drops contract is paused. No claims can be made.', entrypoint);
  }

  // A held reservation settles regardless of the limits below — but the drop
  // still has to be claimable at all.
  const reserved = input.reservation;

  if (input.drop.statusName !== 'active') {
    return verdict(
      'not-active',
      false,
      input.drop.statusName === 'draft'
        ? 'This drop has not been activated yet.'
        : `This drop is ${input.drop.statusName}.`,
      entrypoint
    );
  }
  if (input.tipHeight !== null && input.tipHeight < input.drop.startBlock) {
    return verdict(
      'window-not-open',
      false,
      `Claims open at block ${input.drop.startBlock.toLocaleString()} — ${(
        input.drop.startBlock - input.tipHeight
      ).toLocaleString()} blocks from now.`,
      entrypoint
    );
  }
  if (
    input.tipHeight !== null &&
    input.drop.endBlock !== 0 &&
    input.tipHeight > input.drop.endBlock
  ) {
    return verdict(
      'window-closed',
      false,
      `The claim window closed at block ${input.drop.endBlock.toLocaleString()}.`,
      entrypoint
    );
  }

  if (reserved) {
    return verdict(
      'holds-reservation',
      true,
      `You hold a reservation for item #${reserved.index}. Claim it to receive the NFT.`,
      entrypoint,
      { reservedIndex: reserved.index }
    );
  }

  if (input.remaining <= 0) {
    return verdict('sold-out', false, 'Every claimable item in this drop has been taken.', entrypoint);
  }

  if (input.drop.perWalletLimit > 0 && input.walletClaims >= input.drop.perWalletLimit) {
    return verdict(
      'wallet-limit',
      false,
      `This wallet has claimed ${input.walletClaims} of its ${input.drop.perWalletLimit} allowed item(s).`,
      entrypoint
    );
  }

  if (eligibility === 'allowlist') {
    if (input.allowlistAllowance === null) {
      return verdict('not-allowlisted', false, 'This wallet is not on the drop allowlist.', entrypoint);
    }
    if (input.walletClaims >= input.allowlistAllowance) {
      return verdict(
        'allowance-used',
        false,
        `This wallet has used its allowlist allowance (${input.walletClaims} of ${input.allowlistAllowance}).`,
        entrypoint
      );
    }
  }

  if (eligibility === 'signed') {
    if (input.attestorConfigured === false) {
      return verdict(
        'attestor-not-configured',
        false,
        'This drop requires a signed attestation, but the contract has no attestor configured. Nobody can claim until its owner sets one.',
        entrypoint
      );
    }
    if (input.hasAttestation !== true) {
      return verdict(
        'attestation-required',
        false,
        'This drop requires a signed attestation. Request one before claiming.',
        entrypoint
      );
    }
  }

  return verdict('eligible', true, 'You can claim from this drop.', entrypoint);
};
