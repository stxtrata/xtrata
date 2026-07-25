import { DROP_ELIGIBILITY, DROP_MODES, type DropEligibility, type DropMode } from '@xtrata/collections-client';

/**
 * The one place drop modes are described to a human.
 *
 * Architecture §6 has a who-pays-what table and 05-SPONSORSHIP §"Fee policy"
 * restates the rule it implies:
 *
 *   > only mode-3 drops may be described as "free"; zero-price mint copy must
 *   > state the claimer pays network fees.
 *
 * That rule is enforced here rather than trusted to each screen: `costClaim`
 * is the sentence every surface prints for the claimer's cost, `freeToClaim`
 * is the only flag that may unlock the word "free", and `copy.test.ts` asserts
 * that mode 2's strings never claim to be free while mode 3's do.
 */

export interface ModeCopy {
  mode: DropMode;
  /** Contract's `mode` uint (1/2/3). */
  code: number;
  label: string;
  /** One line: what this mode is. */
  summary: string;
  /** Who pays the inscription/storage cost. */
  costInscription: string;
  /** What the claimer pays at claim time — the sentence with the rule in it. */
  costClaim: string;
  /** What the creator pays / escrows up front. */
  costCreator: string;
  /**
   * Creator-facing instruction about how this drop may be described. Only this
   * field is allowed to contain the word "free" for a non-sponsored mode, and
   * only to forbid it — it is never shown as a claimer-facing cost claim.
   */
  advertisingRule: string | null;
  /** Only mode 3 may be called free to claim. */
  freeToClaim: boolean;
  /** True when the drop needs a funded sponsor budget to activate. */
  needsBudget: boolean;
  /** Activation gates the creator must satisfy, in order. */
  activationGates: string[];
}

/**
 * Deployed `xtrata-drops-v3` settles EVERY mode out of escrow (`settle-claim`
 * requires an `EscrowedTokens` row, and `activate-drop` asserts
 * `escrowed-count == inventory-count` for all three modes). The mode therefore
 * selects the economics — who pays the claim transaction — not the delivery
 * mechanism. Copy says so instead of repeating the design doc's mode-2
 * "mint at claim time" wording, which this contract does not implement.
 */
const ESCROW_GATE = 'Every inventory item escrowed to the drops contract (escrow-batch, 25 per transaction)';

export const MODE_COPY: Record<DropMode, ModeCopy> = {
  'pre-inscribed': {
    mode: 'pre-inscribed',
    code: DROP_MODES['pre-inscribed'],
    label: 'Pre-inscribed',
    summary:
      'You inscribe and escrow the items up front. Claiming transfers an escrowed NFT to the claimer.',
    costInscription: 'You paid the inscription (core) fees when the collection was inscribed.',
    costClaim: 'The claimer pays the network fee for their own claim transaction.',
    costCreator: 'You pay the network fees for create, inventory, escrow and activate transactions.',
    advertisingRule:
      'Claimers pay their own network fee, so this drop must not be advertised as costing them nothing.',
    freeToClaim: false,
    needsBudget: false,
    activationGates: ['Inventory resolved (at least one item)', ESCROW_GATE]
  },
  'zero-price': {
    mode: 'zero-price',
    code: DROP_MODES['zero-price'],
    label: 'Zero-price',
    summary:
      'No mint price is charged for the item. The claimer still broadcasts and pays for their own transaction.',
    costInscription: 'You paid the inscription (core) fees when the collection was inscribed.',
    // The rule: no "free" here, and the network fee is stated explicitly.
    costClaim:
      'The claimer pays no mint price, but pays the network fee for their own claim transaction.',
    costCreator: 'You pay the network fees for create, inventory, escrow and activate transactions.',
    advertisingRule:
      'Do not advertise this drop as free. Zero price is not zero cost — the claimer still pays the network fee for their own transaction.',
    freeToClaim: false,
    needsBudget: false,
    activationGates: ['Inventory resolved (at least one item)', ESCROW_GATE]
  },
  sponsored: {
    mode: 'sponsored',
    code: DROP_MODES.sponsored,
    label: 'Sponsored',
    summary:
      'The claimer signs a fee-0 transaction and the relayer pays the network fee out of your funded budget.',
    costInscription: 'You paid the inscription (core) fees when the collection was inscribed.',
    costClaim: 'Free to the claimer: they pay nothing, not even the network fee.',
    costCreator:
      'You pay the network fees for your own transactions and fund the sponsor budget the relayer draws claim fees from.',
    advertisingRule:
      'This is the only mode that may be described as free to the claimer — and only while the budget lasts and the relayer is available.',
    freeToClaim: true,
    needsBudget: true,
    activationGates: [
      'Inventory resolved (at least one item)',
      ESCROW_GATE,
      'Sponsor budget ≥ minimum fee budget × claimable items'
    ]
  }
};

export const MODE_ORDER: readonly DropMode[] = ['pre-inscribed', 'zero-price', 'sponsored'];

export const modeByCode = (code: number): DropMode | null =>
  MODE_ORDER.find((mode) => DROP_MODES[mode] === code) ?? null;

/**
 * The claimer-facing cost statement, used verbatim by the claim page. Mode 2
 * is never allowed to shorten to "free".
 */
export const claimCostStatement = (mode: DropMode): string => MODE_COPY[mode].costClaim;

/** Guard used by the tests and by any surface tempted to write "free". */
export const mayBeCalledFree = (mode: DropMode): boolean => MODE_COPY[mode].freeToClaim;

export interface EligibilityCopy {
  eligibility: DropEligibility;
  code: number;
  label: string;
  summary: string;
  /** Extra setup the creator must do before activation. */
  requirement: string | null;
}

export const ELIGIBILITY_COPY: Record<DropEligibility, EligibilityCopy> = {
  public: {
    eligibility: 'public',
    code: DROP_ELIGIBILITY.public,
    label: 'Public',
    summary: 'Anyone may claim, subject to the total and per-wallet limits.',
    requirement: null
  },
  allowlist: {
    eligibility: 'allowlist',
    code: DROP_ELIGIBILITY.allowlist,
    label: 'Allowlist',
    summary:
      'Only wallets you list may claim, each up to its own allowance. The allowance is checked on chain at claim time.',
    requirement:
      'Set the allowlist before activation (set-allowlist-batch, up to 200 wallets per transaction).'
  },
  signed: {
    eligibility: 'signed',
    code: DROP_ELIGIBILITY.signed,
    label: 'Signed attestation',
    summary:
      'Claimers must present a signed attestation from the configured attestor. Claims go through claim-signed, not claim.',
    requirement:
      'The drops contract must have an attestor pubkey hash configured by its owner, and the relayer must hold the matching attestor key to issue attestations at /attest.'
  }
};

export const ELIGIBILITY_ORDER: readonly DropEligibility[] = ['public', 'allowlist', 'signed'];

export const eligibilityByCode = (code: number): DropEligibility | null =>
  ELIGIBILITY_ORDER.find((value) => DROP_ELIGIBILITY[value] === code) ?? null;

export interface WhoPaysRow {
  cost: string;
  /** Column value per mode, in MODE_ORDER. */
  byMode: Record<DropMode, string>;
}

/** Architecture §6, restricted to the three drop columns. */
export const WHO_PAYS_TABLE: WhoPaysRow[] = [
  {
    cost: 'Inscription storage (core fees)',
    byMode: {
      'pre-inscribed': 'Creator, up front',
      'zero-price': 'Creator, up front',
      sponsored: 'Creator, up front'
    }
  },
  {
    cost: 'Mint price',
    byMode: { 'pre-inscribed': 'None', 'zero-price': 'None', sponsored: 'None' }
  },
  {
    cost: 'Claim transaction network fee',
    byMode: {
      'pre-inscribed': 'Claimer',
      'zero-price': 'Claimer',
      sponsored: 'Sponsor budget'
    }
  },
  {
    cost: 'Failed claims / retries',
    byMode: {
      'pre-inscribed': 'Claimer',
      'zero-price': 'Claimer',
      sponsored: 'Budget, only when a fee was actually spent'
    }
  },
  {
    cost: 'Relayer settlement (claim-fee, settle-refund)',
    byMode: {
      'pre-inscribed': '—',
      'zero-price': '—',
      sponsored: 'Sponsor, reimbursed from the budget'
    }
  }
];
