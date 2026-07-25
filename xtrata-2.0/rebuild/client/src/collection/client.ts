import { Cl, Pc, type ClarityValue, type StxPostCondition } from '@stacks/transactions';
import { XtrataClientError } from '../errors.js';
import { CHUNK_SIZE } from '../hash.js';
import type { FeeSchedule } from '../planner.js';
import {
  assertPrincipalOnNetwork,
  parseContractId,
  type NetworkName
} from '../network.js';
import {
  encodeChunkList,
  encodeHash,
  encodeOptionalAscii,
  encodeSealBatchItems,
  encodeUintList
} from '../protocol/codecs.js';

/**
 * Pure transaction BUILDERS for one deployed xtrata-collection-v3 instance.
 * Every method returns an unsigned payload descriptor — no signing, no
 * broadcasting; the wallet/UI layer owns those effects.
 *
 * STX post-conditions are deny-mode spend caps (LessEqual) derived from the
 * fee schedule (core quote-inscription-fee shape) + the collection mint price.
 */

export interface TxDescriptor {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions: StxPostCondition[];
  postConditionMode: 'deny';
  network: NetworkName;
}

export interface CollectionTxBuilderConfig {
  /** `SPxxx.collection-name` of the deployed collection instance. */
  collectionContractId: string;
  /** `SPxxx.core-name` — the pinned core, passed as the trait argument. */
  coreContractId: string;
  network: NetworkName;
  /** tx-sender — the principal post-conditions cap spends for. */
  sender: string;
  /** Spend-cap inputs (microSTX); mintPrice is the collection price at seal. */
  fees: FeeSchedule;
}

const DEFAULT_TOKEN_URI_FALLBACK = 'data:text/plain,xtrata-collection-default';

export class CollectionTxBuilder {
  readonly contractId: string;
  private readonly address: string;
  private readonly name: string;
  private readonly coreCv: ClarityValue;
  private readonly config: CollectionTxBuilderConfig;

  constructor(config: CollectionTxBuilderConfig) {
    const collection = parseContractId(config.collectionContractId);
    const core = parseContractId(config.coreContractId);
    assertPrincipalOnNetwork(collection.address, config.network);
    assertPrincipalOnNetwork(core.address, config.network);
    assertPrincipalOnNetwork(config.sender, config.network);
    this.contractId = config.collectionContractId;
    this.address = collection.address;
    this.name = collection.name;
    this.coreCv = Cl.contractPrincipal(core.address, core.name);
    this.config = config;
  }

  private descriptor(
    functionName: string,
    functionArgs: ClarityValue[],
    maxSpendMicroStx: bigint
  ): TxDescriptor {
    const postConditions: StxPostCondition[] =
      maxSpendMicroStx > 0n
        ? [Pc.principal(this.config.sender).willSendLte(maxSpendMicroStx).ustx()]
        : [Pc.principal(this.config.sender).willSendLte(0n).ustx()];
    return {
      contractAddress: this.address,
      contractName: this.name,
      functionName,
      functionArgs,
      postConditions,
      postConditionMode: 'deny',
      network: this.config.network
    };
  }

  // --- mint lifecycle ---

  reserve(params: { contentHashHex: string; itemUri?: string }): TxDescriptor {
    return this.descriptor(
      'reserve',
      [encodeHash(params.contentHashHex), encodeOptionalAscii(params.itemUri, 256)],
      0n
    );
  }

  mintBegin(params: {
    contentHashHex: string;
    mimeType: string;
    totalSize: number;
    totalChunks: number;
  }): TxDescriptor {
    if (params.totalChunks <= 0) {
      throw new XtrataClientError('plan-invalid', 'totalChunks must be positive');
    }
    return this.descriptor(
      'mint-begin',
      [
        this.coreCv,
        encodeHash(params.contentHashHex),
        Cl.stringAscii(params.mimeType),
        Cl.uint(params.totalSize),
        Cl.uint(params.totalChunks)
      ],
      this.config.fees.beginFee
    );
  }

  mintAddChunkBatch(params: { contentHashHex: string; chunks: Uint8Array[] }): TxDescriptor {
    return this.descriptor(
      'mint-add-chunk-batch',
      [this.coreCv, encodeHash(params.contentHashHex), encodeChunkList(params.chunks)],
      this.config.fees.chunkBatchFee(params.chunks.length)
    );
  }

  mintSeal(params: { contentHashHex: string; tokenUri?: string; chunkCount: number }): TxDescriptor {
    return this.descriptor(
      'mint-seal',
      [
        this.coreCv,
        encodeHash(params.contentHashHex),
        Cl.stringAscii(params.tokenUri ?? DEFAULT_TOKEN_URI_FALLBACK)
      ],
      this.config.fees.sealFee(params.chunkCount) + this.config.fees.mintPrice
    );
  }

  mintSealBatch(params: {
    items: { contentHashHex: string; tokenUri?: string; chunkCount: number }[];
  }): TxDescriptor {
    const cap = params.items.reduce(
      (sum, item) => sum + this.config.fees.sealFee(item.chunkCount) + this.config.fees.mintPrice,
      0n
    );
    return this.descriptor(
      'mint-seal-batch',
      [
        this.coreCv,
        encodeSealBatchItems(
          params.items.map((item) => ({
            contentHashHex: item.contentHashHex,
            tokenUri: item.tokenUri ?? DEFAULT_TOKEN_URI_FALLBACK
          }))
        )
      ],
      cap
    );
  }

  mintSmallSingleTx(params: {
    contentHashHex: string;
    mimeType: string;
    totalSize: number;
    chunks: Uint8Array[];
    tokenUri?: string;
    dependencies?: number[];
  }): TxDescriptor {
    if (params.totalSize > params.chunks.length * CHUNK_SIZE) {
      throw new XtrataClientError('plan-invalid', 'totalSize exceeds chunk capacity');
    }
    const cap = this.config.fees.singleTxFee(params.chunks.length) + this.config.fees.mintPrice;
    const baseArgs = [
      this.coreCv,
      encodeHash(params.contentHashHex),
      Cl.stringAscii(params.mimeType),
      Cl.uint(params.totalSize),
      encodeChunkList(params.chunks),
      Cl.stringAscii(params.tokenUri ?? DEFAULT_TOKEN_URI_FALLBACK)
    ];
    if (params.dependencies !== undefined && params.dependencies.length > 0) {
      return this.descriptor(
        'mint-small-single-tx-recursive',
        [...baseArgs, encodeUintList(params.dependencies)],
        cap
      );
    }
    return this.descriptor('mint-small-single-tx', baseArgs, cap);
  }

  cancelReservation(contentHashHex: string): TxDescriptor {
    return this.descriptor('cancel-reservation', [encodeHash(contentHashHex)], 0n);
  }

  releaseExpiredReservation(owner: string, contentHashHex: string): TxDescriptor {
    assertPrincipalOnNetwork(owner, this.config.network);
    return this.descriptor(
      'release-expired-reservation',
      [Cl.principal(owner), encodeHash(contentHashHex)],
      0n
    );
  }

  // --- admin: roles + ownership ---

  setOperatorAdmin(operator: string): TxDescriptor {
    return this.descriptor('set-operator-admin', [Cl.principal(operator)], 0n);
  }

  setFinanceAdmin(finance: string): TxDescriptor {
    return this.descriptor('set-finance-admin', [Cl.principal(finance)], 0n);
  }

  initiateOwnershipTransfer(newOwner: string): TxDescriptor {
    return this.descriptor('initiate-contract-ownership-transfer', [Cl.principal(newOwner)], 0n);
  }

  cancelOwnershipTransfer(): TxDescriptor {
    return this.descriptor('cancel-contract-ownership-transfer', [], 0n);
  }

  acceptOwnership(): TxDescriptor {
    return this.descriptor('accept-contract-ownership', [], 0n);
  }

  // --- admin: metadata + config ---

  setCollectionMetadata(params: {
    name: string;
    symbol: string;
    description: string;
    artworkUri: string;
    baseUri: string;
  }): TxDescriptor {
    return this.descriptor(
      'set-collection-metadata',
      [
        Cl.stringAscii(params.name),
        Cl.stringAscii(params.symbol),
        Cl.stringAscii(params.description),
        Cl.stringAscii(params.artworkUri),
        Cl.stringAscii(params.baseUri)
      ],
      0n
    );
  }

  setReservationExpiryBlocks(expiry: number): TxDescriptor {
    return this.descriptor('set-reservation-expiry-blocks', [Cl.uint(expiry)], 0n);
  }

  setDefaultTokenUri(tokenUri: string): TxDescriptor {
    return this.descriptor('set-default-token-uri', [Cl.stringAscii(tokenUri)], 0n);
  }

  setDefaultDependencies(dependencies: number[]): TxDescriptor {
    return this.descriptor('set-default-dependencies', [encodeUintList(dependencies)], 0n);
  }

  setRegisteredTokenUri(contentHashHex: string, tokenUri: string): TxDescriptor {
    return this.descriptor(
      'set-registered-token-uri',
      [encodeHash(contentHashHex), Cl.stringAscii(tokenUri)],
      0n
    );
  }

  clearRegisteredTokenUri(contentHashHex: string): TxDescriptor {
    return this.descriptor('clear-registered-token-uri', [encodeHash(contentHashHex)], 0n);
  }

  setRegisteredTokenUriBatch(entries: { contentHashHex: string; tokenUri: string }[]): TxDescriptor {
    if (entries.length === 0 || entries.length > 200) {
      throw new XtrataClientError('plan-invalid', `batch must contain 1..200 entries, received ${entries.length}`);
    }
    return this.descriptor(
      'set-registered-token-uri-batch',
      [
        Cl.list(
          entries.map((e) =>
            Cl.tuple({ hash: encodeHash(e.contentHashHex), 'token-uri': Cl.stringAscii(e.tokenUri) })
          )
        )
      ],
      0n
    );
  }

  // --- admin: supply / phases / allowlists ---

  setSupplyMode(mode: number, max: number): TxDescriptor {
    return this.descriptor('set-supply-mode', [Cl.uint(mode), Cl.uint(max)], 0n);
  }

  closeSupply(): TxDescriptor {
    return this.descriptor('close-supply', [], 0n);
  }

  setPhase(params: {
    phaseId: number;
    enabled: boolean;
    startBlock: number;
    endBlock: number;
    mintPrice: bigint;
    maxPerWallet: number;
    maxSupply: number;
    allowlistMode: number;
  }): TxDescriptor {
    return this.descriptor(
      'set-phase',
      [
        Cl.uint(params.phaseId),
        Cl.bool(params.enabled),
        Cl.uint(params.startBlock),
        Cl.uint(params.endBlock),
        Cl.uint(params.mintPrice),
        Cl.uint(params.maxPerWallet),
        Cl.uint(params.maxSupply),
        Cl.uint(params.allowlistMode)
      ],
      0n
    );
  }

  clearPhase(phaseId: number): TxDescriptor {
    return this.descriptor('clear-phase', [Cl.uint(phaseId)], 0n);
  }

  setActivePhase(phaseId: number): TxDescriptor {
    return this.descriptor('set-active-phase', [Cl.uint(phaseId)], 0n);
  }

  setAllowlistEnabled(value: boolean): TxDescriptor {
    return this.descriptor('set-allowlist-enabled', [Cl.bool(value)], 0n);
  }

  setMaxPerWallet(amount: number): TxDescriptor {
    return this.descriptor('set-max-per-wallet', [Cl.uint(amount)], 0n);
  }

  setAllowlist(owner: string, allowance: number): TxDescriptor {
    return this.descriptor('set-allowlist', [Cl.principal(owner), Cl.uint(allowance)], 0n);
  }

  clearAllowlist(owner: string): TxDescriptor {
    return this.descriptor('clear-allowlist', [Cl.principal(owner)], 0n);
  }

  setAllowlistBatch(entries: { owner: string; allowance: number }[]): TxDescriptor {
    return this.descriptor(
      'set-allowlist-batch',
      [
        Cl.list(
          entries.map((e) => Cl.tuple({ owner: Cl.principal(e.owner), allowance: Cl.uint(e.allowance) }))
        )
      ],
      0n
    );
  }

  setPhaseAllowlist(phaseId: number, owner: string, allowance: number): TxDescriptor {
    return this.descriptor(
      'set-phase-allowlist',
      [Cl.uint(phaseId), Cl.principal(owner), Cl.uint(allowance)],
      0n
    );
  }

  clearPhaseAllowlist(phaseId: number, owner: string): TxDescriptor {
    return this.descriptor('clear-phase-allowlist', [Cl.uint(phaseId), Cl.principal(owner)], 0n);
  }

  setPhaseAllowlistBatch(phaseId: number, entries: { owner: string; allowance: number }[]): TxDescriptor {
    return this.descriptor(
      'set-phase-allowlist-batch',
      [
        Cl.uint(phaseId),
        Cl.list(
          entries.map((e) => Cl.tuple({ owner: Cl.principal(e.owner), allowance: Cl.uint(e.allowance) }))
        )
      ],
      0n
    );
  }

  // --- admin: finance / pause / drops / finalize ---

  setMintPrice(amount: bigint): TxDescriptor {
    return this.descriptor('set-mint-price', [Cl.uint(amount)], 0n);
  }

  setRecipients(artist: string, marketplace: string, operator: string): TxDescriptor {
    return this.descriptor(
      'set-recipients',
      [Cl.principal(artist), Cl.principal(marketplace), Cl.principal(operator)],
      0n
    );
  }

  setSplits(artistBps: number, marketplaceBps: number, operatorBps: number): TxDescriptor {
    return this.descriptor(
      'set-splits',
      [Cl.uint(artistBps), Cl.uint(marketplaceBps), Cl.uint(operatorBps)],
      0n
    );
  }

  setPaused(value: boolean): TxDescriptor {
    return this.descriptor('set-paused', [Cl.bool(value)], 0n);
  }

  setDropsAuthority(authority: string | null): TxDescriptor {
    return this.descriptor(
      'set-drops-authority',
      [authority === null ? Cl.none() : Cl.some(Cl.principal(authority))],
      0n
    );
  }

  releaseReservation(owner: string, contentHashHex: string): TxDescriptor {
    return this.descriptor(
      'release-reservation',
      [Cl.principal(owner), encodeHash(contentHashHex)],
      0n
    );
  }

  finalize(): TxDescriptor {
    return this.descriptor('finalize', [], 0n);
  }
}
