import {
  Cl,
  fetchCallReadOnlyFunction,
  type ClarityValue
} from '@stacks/transactions';
import type { ChainObservation } from '../reconcile.js';
import { parseContractId, NETWORKS, type NetworkName } from '../network.js';
import {
  decodeAssignment,
  decodeCollectionInfo,
  decodeHashIndex,
  decodeItem,
  decodeMintedReserved,
  decodeOkUint,
  decodeOkUintList,
  decodeOptionalUint,
  decodePhase,
  decodeRegisteredTokenUri,
  decodeSession,
  decodeUnassignedScan,
  decodeUploadState,
  encodeHash,
  encodeUintList,
  expectList,
  expectOk,
  type AssignmentRow,
  type CollectionInfo,
  type ItemRow,
  type MintedReserved,
  type PhaseRow,
  type ScanEntry,
  type SessionRow,
  type UploadStateRow
} from '../protocol/codecs.js';

/**
 * Read-only query client over a pluggable transport. The transport is the only
 * I/O seam — tests inject a fake, production injects the fetch-based
 * implementation below.
 */

export type ReadOnlyTransport = (
  contractId: string,
  functionName: string,
  args: ClarityValue[]
) => Promise<ClarityValue>;

/** Production transport: Stacks API `call-read` via @stacks/transactions. */
export const fetchTransport = (params: {
  network: NetworkName;
  senderAddress: string;
  coreApiUrl?: string;
}): ReadOnlyTransport => {
  const url = params.coreApiUrl ?? NETWORKS[params.network].coreApiUrl;
  return async (contractId, functionName, functionArgs) => {
    const { address, name } = parseContractId(contractId);
    return fetchCallReadOnlyFunction({
      contractAddress: address,
      contractName: name,
      functionName,
      functionArgs,
      senderAddress: params.senderAddress,
      network: params.network,
      client: { baseUrl: url }
    });
  };
};

export interface CollectionReadsConfig {
  collectionContractId: string;
  coreContractId: string;
  transport: ReadOnlyTransport;
  /** Current burn/stacks block height provider (for expiry computation). */
  getBlockHeight: () => Promise<number>;
}

export class CollectionReads {
  constructor(private readonly config: CollectionReadsConfig) {
    parseContractId(config.collectionContractId);
    parseContractId(config.coreContractId);
  }

  private call(fn: string, args: ClarityValue[]): Promise<ClarityValue> {
    return this.config.transport(this.config.collectionContractId, fn, args);
  }

  private callCore(fn: string, args: ClarityValue[]): Promise<ClarityValue> {
    return this.config.transport(this.config.coreContractId, fn, args);
  }

  // --- collection read-onlys ---

  async getCollectionInfo(): Promise<CollectionInfo> {
    return decodeCollectionInfo(await this.call('get-collection-info', []));
  }

  async getSession(owner: string, contentHashHex: string): Promise<SessionRow | null> {
    return decodeSession(await this.call('get-session', [Cl.principal(owner), encodeHash(contentHashHex)]));
  }

  async getItem(index: number): Promise<ItemRow | null> {
    return decodeItem(await this.call('get-item', [Cl.uint(index)]));
  }

  async getItems(indexes: number[]): Promise<(ItemRow | null)[]> {
    const cv = await this.call('get-items', [encodeUintList(indexes)]);
    return expectList(expectOk(cv)).map((entry) => decodeItem(entry));
  }

  async getHashIndex(contentHashHex: string): Promise<number | null> {
    return decodeHashIndex(await this.call('get-hash-index', [encodeHash(contentHashHex)]));
  }

  async getAssignment(index: number): Promise<AssignmentRow | null> {
    return decodeAssignment(await this.call('get-assignment', [Cl.uint(index)]));
  }

  async getUnassignedScan(start: number): Promise<ScanEntry[]> {
    return decodeUnassignedScan(await this.call('get-unassigned-scan', [Cl.uint(start)]));
  }

  async getPhase(phaseId: number): Promise<PhaseRow | null> {
    return decodePhase(await this.call('get-phase', [Cl.uint(phaseId)]));
  }

  async getPhaseStats(phaseId: number): Promise<MintedReserved> {
    return decodeMintedReserved(await this.call('get-phase-stats', [Cl.uint(phaseId)]));
  }

  async getWalletStats(owner: string): Promise<MintedReserved> {
    return decodeMintedReserved(await this.call('get-wallet-stats', [Cl.principal(owner)]));
  }

  async getPhaseWalletStats(phaseId: number, owner: string): Promise<MintedReserved> {
    return decodeMintedReserved(
      await this.call('get-phase-wallet-stats', [Cl.uint(phaseId), Cl.principal(owner)])
    );
  }

  async getFreeCount(): Promise<number> {
    return Number(decodeOkUint(await this.call('get-free-count', [])));
  }

  async getDefaultDependencies(): Promise<number[]> {
    return decodeOkUintList(await this.call('get-default-dependencies', []));
  }

  async getRegisteredTokenUri(contentHashHex: string): Promise<string | null> {
    return decodeRegisteredTokenUri(
      await this.call('get-registered-token-uri', [encodeHash(contentHashHex)])
    );
  }

  // --- core read-onlys used by the observer ---

  async getUploadState(owner: string, contentHashHex: string): Promise<UploadStateRow | null> {
    return decodeUploadState(
      await this.callCore('get-upload-state', [encodeHash(contentHashHex), Cl.principal(owner)])
    );
  }

  async getCoreIdByHash(contentHashHex: string): Promise<number | null> {
    return decodeOptionalUint(await this.callCore('get-id-by-hash', [encodeHash(contentHashHex)]));
  }

  /**
   * The consolidated ChainObserver observation for {owner, hash}: collection
   * session + hash index + item row, core upload state + advisory sealed id.
   * `sessionExpired` is computed against the collection's expiry window and
   * the injected block height.
   */
  async observeItem(owner: string, contentHashHex: string): Promise<ChainObservation> {
    const [session, hashIndexedAt, upload, sealedTokenId, info, height] = await Promise.all([
      this.getSession(owner, contentHashHex),
      this.getHashIndex(contentHashHex),
      this.getUploadState(owner, contentHashHex),
      this.getCoreIdByHash(contentHashHex),
      this.getCollectionInfo(),
      this.config.getBlockHeight()
    ]);

    const observation: ChainObservation = { sessionExists: session !== null };
    if (session !== null) {
      observation.sessionIndex = session.index;
      const expiry = info.reservationExpiryBlocks;
      observation.sessionExpired = expiry > 0 && height >= session.createdAt + expiry;
    }
    if (upload !== null) {
      observation.uploadState = {
        currentIndex: upload.currentIndex,
        totalChunks: upload.totalChunks,
        runningHashHex: upload.runningHashHex
      };
    }
    if (sealedTokenId !== null) observation.sealedTokenId = sealedTokenId;
    if (hashIndexedAt !== null) {
      observation.hashIndexedAt = hashIndexedAt;
      const item = await this.getItem(hashIndexedAt);
      // HashIndex also exists during reservation; only a minted Items row with
      // this content hash marks the item as indexed.
      if (item !== null && item.contentHashHex === contentHashHex.toLowerCase()) {
        observation.itemIndexedAt = item.mintedAt;
      } else if (session !== null) {
        // Reserved-but-unminted: the HashIndex hit is our own session, not a
        // terminal state — do not report it as indexed.
        delete observation.hashIndexedAt;
        observation.sessionIndex = session.index;
      }
    }
    return observation;
  }
}
