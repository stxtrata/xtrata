import {
  Cl,
  Pc,
  type ClarityValue,
  type NonFungiblePostCondition,
  type StxPostCondition
} from '@stacks/transactions';
import { XtrataClientError } from '../errors.js';
import { hexToBytes } from '../hash.js';
import {
  assertPrincipalOnNetwork,
  parseContractId,
  type NetworkName
} from '../network.js';
import { encodeUintList } from '../protocol/codecs.js';

/**
 * Pure transaction BUILDERS for the xtrata-drops-v3 singleton. Every method
 * returns an unsigned payload descriptor — no signing, no broadcasting.
 *
 * Post-conditions are deny-mode:
 * - STX spend caps (LessEqual) on the sender for funding paths, zero-caps
 *   everywhere the sender must not spend;
 * - NFT send conditions for escrow (sender -> contract) and, when token ids
 *   are known, for contract-outbound transfers (claim settled from a
 *   reservation, recover-batch);
 * - contract-outbound STX caps for claim-fee / settle-refund / cancel-drop.
 *
 * Claims allocate sequentially on-chain, so a fresh (non-reserved) claim's
 * token id is not knowable in advance; the builder emits `expectedInbound`
 * allowance descriptors the wallet layer applies instead of an exact NFT
 * post-condition in that case.
 */

/** Contract constants mirrored from xtrata-drops-v3.clar (drift-tested). */
export const MIN_FEE_BUDGET = 50_000n;
export const REFUND_DELAY = 144;
export const CLAIM_RESERVATION_EXPIRY = 144;
export const MAX_RANGES = 25;
export const MAX_ESCROW_BATCH = 25;
export const MAX_INVENTORY_ITEMS = 50;
/**
 * Widest span one add-inventory-range call may cover: the collection's
 * assign-range-to-drop asserts `(<= (- end start) u50)`. Wider selections must
 * be split into several calls, each consuming one of the MAX_RANGES slots —
 * so range-based inventory tops out at MAX_RANGES * MAX_RANGE_WIDTH items.
 */
export const MAX_RANGE_WIDTH = 50;
export const NFT_ASSET_NAME = 'xtrata-inscription';

export type DropMode = 'pre-inscribed' | 'zero-price' | 'sponsored';
export type DropEligibility = 'public' | 'allowlist' | 'signed';
export type DropStatus = 'draft' | 'active' | 'paused' | 'ended' | 'cancelled';

export const DROP_MODES: Record<DropMode, number> = {
  'pre-inscribed': 1,
  'zero-price': 2,
  sponsored: 3
};

export const DROP_ELIGIBILITY: Record<DropEligibility, number> = {
  public: 1,
  allowlist: 2,
  signed: 3
};

export const DROP_STATUS: Record<number, DropStatus> = {
  0: 'draft',
  1: 'active',
  2: 'paused',
  3: 'ended',
  4: 'cancelled'
};

// Error table (u200–u231) lives with the other chain tables in
// protocol/codecs.ts; re-exported here for drops consumers.
export { DROPS_ERROR_CODES } from '../protocol/codecs.js';

export type DropsPostCondition = StxPostCondition | NonFungiblePostCondition;

/**
 * Inbound-asset allowance descriptor: post-conditions cannot express "I will
 * RECEIVE this asset", so the wallet layer applies these as allow-list hints
 * (e.g. Leather's expected-asset UI) alongside the deny-mode conditions.
 */
export interface InboundAllowance {
  /** `SPxxx.core::xtrata-inscription` asset identifier. */
  assetId: string;
  /** Exact token id when knowable (reserved claim); omitted for fresh claims. */
  tokenId?: number;
  count: number;
}

export interface DropsTxDescriptor {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions: DropsPostCondition[];
  postConditionMode: 'deny';
  network: NetworkName;
  expectedInbound?: InboundAllowance[];
}

export interface DropsTxBuilderConfig {
  /** `SPxxx.xtrata-drops-v3` singleton. */
  dropsContractId: string;
  /** `SPxxx.collection-name` — passed as the collection-trait argument. */
  collectionContractId: string;
  /** `SPxxx.core-name` — the pinned NFT core (ALLOWED-NFT-CONTRACT). */
  nftContractId: string;
  network: NetworkName;
  /** tx-sender — the principal post-conditions cap spends for. */
  sender: string;
}

const positiveInt = (value: number, label: string): void => {
  if (!Number.isInteger(value) || value < 0) {
    throw new XtrataClientError('plan-invalid', `${label} must be a non-negative integer, received ${value}`);
  }
};

export class DropsTxBuilder {
  readonly contractId: string;
  readonly nftAssetId: `${string}.${string}::${string}`;
  private readonly address: string;
  private readonly name: string;
  private readonly collectionCv: ClarityValue;
  private readonly config: DropsTxBuilderConfig;

  constructor(config: DropsTxBuilderConfig) {
    const drops = parseContractId(config.dropsContractId);
    const collection = parseContractId(config.collectionContractId);
    const nft = parseContractId(config.nftContractId);
    assertPrincipalOnNetwork(drops.address, config.network);
    assertPrincipalOnNetwork(collection.address, config.network);
    assertPrincipalOnNetwork(nft.address, config.network);
    assertPrincipalOnNetwork(config.sender, config.network);
    this.contractId = config.dropsContractId;
    this.address = drops.address;
    this.name = drops.name;
    this.collectionCv = Cl.contractPrincipal(collection.address, collection.name);
    this.nftAssetId = `${nft.address}.${nft.name}::${NFT_ASSET_NAME}`;
    this.config = config;
  }

  private descriptor(
    functionName: string,
    functionArgs: ClarityValue[],
    postConditions: DropsPostCondition[],
    expectedInbound?: InboundAllowance[]
  ): DropsTxDescriptor {
    return {
      contractAddress: this.address,
      contractName: this.name,
      functionName,
      functionArgs,
      postConditions,
      postConditionMode: 'deny',
      network: this.config.network,
      ...(expectedInbound !== undefined ? { expectedInbound } : {})
    };
  }

  /** Sender STX spend cap (0n = "sender spends nothing"). */
  private senderStxCap(maxSpendMicroStx: bigint): StxPostCondition {
    return Pc.principal(this.config.sender).willSendLte(maxSpendMicroStx).ustx();
  }

  /** Contract-outbound STX cap (refunds / fee settlement). */
  private contractStxCap(maxSendMicroStx: bigint): StxPostCondition {
    return Pc.principal(this.contractId).willSendLte(maxSendMicroStx).ustx();
  }

  private senderNft(tokenId: number): NonFungiblePostCondition {
    return Pc.principal(this.config.sender).willSendAsset().nft(this.nftAssetId, Cl.uint(tokenId));
  }

  private contractNft(tokenId: number): NonFungiblePostCondition {
    return Pc.principal(this.contractId).willSendAsset().nft(this.nftAssetId, Cl.uint(tokenId));
  }

  // --- drop lifecycle ---

  createDrop(params: {
    mode: DropMode;
    eligibility: DropEligibility;
    startBlock: number;
    endBlock: number;
    totalLimit: number;
    perWalletLimit: number;
  }): DropsTxDescriptor {
    positiveInt(params.startBlock, 'startBlock');
    positiveInt(params.endBlock, 'endBlock');
    positiveInt(params.totalLimit, 'totalLimit');
    positiveInt(params.perWalletLimit, 'perWalletLimit');
    if (params.endBlock !== 0 && params.startBlock > params.endBlock) {
      throw new XtrataClientError('plan-invalid', 'startBlock must not exceed endBlock');
    }
    return this.descriptor(
      'create-drop',
      [
        this.collectionCv,
        Cl.uint(DROP_MODES[params.mode]),
        Cl.uint(DROP_ELIGIBILITY[params.eligibility]),
        Cl.uint(params.startBlock),
        Cl.uint(params.endBlock),
        Cl.uint(params.totalLimit),
        Cl.uint(params.perWalletLimit)
      ],
      [this.senderStxCap(0n)]
    );
  }

  // --- inventory ---

  addInventoryRange(dropId: number, start: number, end: number): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    positiveInt(start, 'start');
    positiveInt(end, 'end');
    if (start >= end) {
      throw new XtrataClientError('plan-invalid', `range start ${start} must be < end ${end}`);
    }
    if (end - start > MAX_RANGE_WIDTH) {
      throw new XtrataClientError(
        'plan-invalid',
        `range [${start}, ${end}) spans ${end - start} indexes; the collection allows ${MAX_RANGE_WIDTH} per call — split it`
      );
    }
    return this.descriptor(
      'add-inventory-range',
      [this.collectionCv, Cl.uint(dropId), Cl.uint(start), Cl.uint(end)],
      [this.senderStxCap(0n)]
    );
  }

  addInventoryItems(dropId: number, indexes: number[]): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    if (indexes.length === 0 || indexes.length > MAX_INVENTORY_ITEMS) {
      throw new XtrataClientError(
        'plan-invalid',
        `inventory items batch must contain 1..${MAX_INVENTORY_ITEMS} indexes, received ${indexes.length}`
      );
    }
    return this.descriptor(
      'add-inventory-items',
      [this.collectionCv, Cl.uint(dropId), encodeUintList(indexes)],
      [this.senderStxCap(0n)]
    );
  }

  // --- escrow ---

  escrowBatch(dropId: number, entries: { index: number; tokenId: number }[]): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    if (entries.length === 0 || entries.length > MAX_ESCROW_BATCH) {
      throw new XtrataClientError(
        'plan-invalid',
        `escrow batch must contain 1..${MAX_ESCROW_BATCH} entries, received ${entries.length}`
      );
    }
    return this.descriptor(
      'escrow-batch',
      [
        Cl.uint(dropId),
        Cl.list(
          entries.map((e) => Cl.tuple({ index: Cl.uint(e.index), 'token-id': Cl.uint(e.tokenId) }))
        )
      ],
      [this.senderStxCap(0n), ...entries.map((e) => this.senderNft(e.tokenId))]
    );
  }

  // --- funding + activation ---

  fundBudget(dropId: number, amountMicroStx: bigint): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    if (amountMicroStx <= 0n) {
      throw new XtrataClientError('plan-invalid', 'fund-budget amount must be positive');
    }
    return this.descriptor(
      'fund-budget',
      [Cl.uint(dropId), Cl.uint(amountMicroStx)],
      [this.senderStxCap(amountMicroStx)]
    );
  }

  activateDrop(dropId: number): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    return this.descriptor('activate-drop', [Cl.uint(dropId)], [this.senderStxCap(0n)]);
  }

  pauseDrop(dropId: number): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    return this.descriptor('pause-drop', [Cl.uint(dropId)], [this.senderStxCap(0n)]);
  }

  resumeDrop(dropId: number): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    return this.descriptor('resume-drop', [Cl.uint(dropId)], [this.senderStxCap(0n)]);
  }

  endDrop(dropId: number): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    return this.descriptor('end-drop', [Cl.uint(dropId)], [this.senderStxCap(0n)]);
  }

  /**
   * Cancels the drop; the contract immediately refunds the remaining budget,
   * so the contract-outbound STX cap must cover it (`maxRefundMicroStx` — use
   * the observed fee-budget-remaining).
   */
  cancelDrop(dropId: number, maxRefundMicroStx: bigint): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    return this.descriptor(
      'cancel-drop',
      [Cl.uint(dropId)],
      [this.senderStxCap(0n), this.contractStxCap(maxRefundMicroStx)]
    );
  }

  // --- recovery ---

  /**
   * `escrowedTokenIds` are the token ids expected to leave escrow back to the
   * creator (subset of `indexes` — indexes that were assigned but never
   * escrowed recover nothing).
   */
  recoverBatch(dropId: number, indexes: number[], escrowedTokenIds: number[]): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    if (indexes.length === 0 || indexes.length > MAX_ESCROW_BATCH) {
      throw new XtrataClientError(
        'plan-invalid',
        `recover batch must contain 1..${MAX_ESCROW_BATCH} indexes, received ${indexes.length}`
      );
    }
    if (escrowedTokenIds.length > indexes.length) {
      throw new XtrataClientError('plan-invalid', 'more escrowed token ids than recovered indexes');
    }
    return this.descriptor(
      'recover-batch',
      [this.collectionCv, Cl.uint(dropId), encodeUintList(indexes, 25)],
      [this.senderStxCap(0n), ...escrowedTokenIds.map((id) => this.contractNft(id))]
    );
  }

  // --- claims ---

  /**
   * One-step claim (public/allowlist). Zero STX leaves the claimer; the drop
   * contract sends one escrowed NFT to the claimer. Pass `expectedTokenId`
   * when settling a reservation (the index's escrowed token is knowable) to
   * pin an exact contract-outbound NFT post-condition; otherwise the wallet
   * layer applies the `expectedInbound` allowance.
   */
  claim(dropId: number, options?: { expectedTokenId?: number }): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    return this.claimDescriptor('claim', [Cl.uint(dropId)], options);
  }

  /** One-step claim for signed-eligibility drops (65-byte RSV signature hex). */
  claimSigned(
    dropId: number,
    expiresAt: number,
    signatureHex: string,
    options?: { expectedTokenId?: number }
  ): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    positiveInt(expiresAt, 'expiresAt');
    const signature = hexToBytes(signatureHex);
    if (signature.length !== 65) {
      throw new XtrataClientError(
        'plan-invalid',
        `attestation signature must be 65 bytes, received ${signature.length}`
      );
    }
    return this.claimDescriptor(
      'claim-signed',
      [Cl.uint(dropId), Cl.uint(expiresAt), Cl.buffer(signature)],
      options
    );
  }

  private claimDescriptor(
    functionName: string,
    functionArgs: ClarityValue[],
    options?: { expectedTokenId?: number }
  ): DropsTxDescriptor {
    const postConditions: DropsPostCondition[] = [this.senderStxCap(0n)];
    if (options?.expectedTokenId !== undefined) {
      postConditions.push(this.contractNft(options.expectedTokenId));
    }
    return this.descriptor(functionName, functionArgs, postConditions, [
      {
        assetId: this.nftAssetId,
        count: 1,
        ...(options?.expectedTokenId !== undefined ? { tokenId: options.expectedTokenId } : {})
      }
    ]);
  }

  reserveClaim(dropId: number): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    return this.descriptor('reserve-claim', [Cl.uint(dropId)], [this.senderStxCap(0n)]);
  }

  releaseExpiredClaim(dropId: number, claimer: string): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    assertPrincipalOnNetwork(claimer, this.config.network);
    return this.descriptor(
      'release-expired-claim',
      [Cl.uint(dropId), Cl.principal(claimer)],
      [this.senderStxCap(0n)]
    );
  }

  // --- allowlist ---

  setAllowlistEntry(dropId: number, wallet: string, allowance: number): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    positiveInt(allowance, 'allowance');
    return this.descriptor(
      'set-allowlist-entry',
      [Cl.uint(dropId), Cl.principal(wallet), Cl.uint(allowance)],
      [this.senderStxCap(0n)]
    );
  }

  setAllowlistBatch(dropId: number, entries: { wallet: string; allowance: number }[]): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    if (entries.length === 0 || entries.length > 200) {
      throw new XtrataClientError(
        'plan-invalid',
        `allowlist batch must contain 1..200 entries, received ${entries.length}`
      );
    }
    return this.descriptor(
      'set-allowlist-batch',
      [
        Cl.uint(dropId),
        Cl.list(
          entries.map((e) =>
            Cl.tuple({ wallet: Cl.principal(e.wallet), allowance: Cl.uint(e.allowance) })
          )
        )
      ],
      [this.senderStxCap(0n)]
    );
  }

  // --- sponsorship settlement ---

  /** Sponsor reimburses itself: the drop contract sends `amount` out. */
  claimFee(dropId: number, amountMicroStx: bigint): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    if (amountMicroStx <= 0n) {
      throw new XtrataClientError('plan-invalid', 'claim-fee amount must be positive');
    }
    return this.descriptor(
      'claim-fee',
      [Cl.uint(dropId), Cl.uint(amountMicroStx)],
      [this.senderStxCap(0n), this.contractStxCap(amountMicroStx)]
    );
  }

  /** Refund remaining budget to the creator (cap = observed remaining). */
  settleRefund(dropId: number, maxRefundMicroStx: bigint): DropsTxDescriptor {
    positiveInt(dropId, 'dropId');
    return this.descriptor(
      'settle-refund',
      [Cl.uint(dropId)],
      [this.senderStxCap(0n), this.contractStxCap(maxRefundMicroStx)]
    );
  }

  // --- admin setters + two-step ownership ---

  setSponsor(newSponsor: string): DropsTxDescriptor {
    assertPrincipalOnNetwork(newSponsor, this.config.network);
    return this.descriptor('set-sponsor', [Cl.principal(newSponsor)], [this.senderStxCap(0n)]);
  }

  /** hash160 of the attestor's compressed public key (20-byte hex), or null to unset. */
  setAttestorPubkeyHash(pubkeyHashHex: string | null): DropsTxDescriptor {
    let value: ClarityValue;
    if (pubkeyHashHex === null) {
      value = Cl.none();
    } else {
      const bytes = hexToBytes(pubkeyHashHex);
      if (bytes.length !== 20) {
        throw new XtrataClientError(
          'plan-invalid',
          `attestor pubkey hash must be 20 bytes, received ${bytes.length}`
        );
      }
      value = Cl.some(Cl.buffer(bytes));
    }
    return this.descriptor('set-attestor-pubkey-hash', [value], [this.senderStxCap(0n)]);
  }

  setClaimFeeCap(newCapMicroStx: bigint): DropsTxDescriptor {
    return this.descriptor('set-claim-fee-cap', [Cl.uint(newCapMicroStx)], [this.senderStxCap(0n)]);
  }

  setPaused(value: boolean): DropsTxDescriptor {
    return this.descriptor('set-paused', [Cl.bool(value)], [this.senderStxCap(0n)]);
  }

  initiateOwnershipTransfer(newOwner: string): DropsTxDescriptor {
    assertPrincipalOnNetwork(newOwner, this.config.network);
    return this.descriptor(
      'initiate-contract-ownership-transfer',
      [Cl.principal(newOwner)],
      [this.senderStxCap(0n)]
    );
  }

  cancelOwnershipTransfer(): DropsTxDescriptor {
    return this.descriptor('cancel-contract-ownership-transfer', [], [this.senderStxCap(0n)]);
  }

  acceptOwnership(): DropsTxDescriptor {
    return this.descriptor('accept-contract-ownership', [], [this.senderStxCap(0n)]);
  }
}
