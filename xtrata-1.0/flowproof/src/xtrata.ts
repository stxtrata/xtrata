/**
 * Xtrata v3.2.3 client (record layer).
 *
 * Models the live contract ABI exactly:
 *   - mint-single-tx                 (asset / work inscription)
 *   - mint-single-tx-with-relationships(hash, mime, size, chunks, uri, deps, parents)
 *         -> (ok { token-id: uint, existed: bool })   [receipt + lineage, ONE tx]
 *   - quote-single-tx-fee(total-size, total-chunks)   [fee quoting]
 *   - get-inscription-summary / get-parents / get-dependencies / get-id-by-hash
 *
 * Single-tx mint is native in v3.2.3 (no helper contract), so a receipt and its
 * lineage edges are written atomically in a single transaction.
 */
import {
  AnchorMode,
  FungibleConditionCode,
  PostConditionMode,
  bufferCV,
  listCV,
  makeContractCall,
  makeStandardSTXPostCondition,
  stringAsciiCV,
  uintCV,
} from "@stacks/transactions";
import type { StacksNetwork } from "@stacks/network";
import { broadcast, callReadOnly, unwrapOptional, waitForConfirmation } from "./stacks.js";
import {
  computeExpectedHash,
  chunkBytes,
  prepareReceiptInscription,
  toHex,
} from "./receipt.js";
import type { FlowReceipt, InscriptionResult } from "./types.js";

export interface XtrataClientOpts {
  network: StacksNetwork;
  contractAddress: string;
  contractName: string; // default "xtrata-v3-2-3"
  senderKey: string;
  senderAddress: string;
  /** safety multiplier on the quoted fee for the STX post-condition cap. */
  feeCapMultiplier?: number;
}

export class XtrataClient {
  constructor(private readonly o: XtrataClientOpts) {}

  private base() {
    return { contractAddress: this.o.contractAddress, contractName: this.o.contractName };
  }

  /** Quote the single-tx mint fee (micro-STX) for a given payload shape. */
  async quoteSingleTxFee(totalSize: number, totalChunks: number): Promise<bigint> {
    const parsed = await callReadOnly({
      network: this.o.network,
      senderAddress: this.o.senderAddress,
      ...this.base(),
      functionName: "quote-single-tx-fee",
      functionArgs: [uintCV(totalSize), uintCV(totalChunks)],
    });
    // (ok { total-fee: uint, ... })
    const total = parsed?.value?.value?.["total-fee"]?.value;
    if (total == null) throw new Error(`quote-single-tx-fee returned no total-fee: ${JSON.stringify(parsed)}`);
    return BigInt(total);
  }

  async getIdByHash(expectedHashHex: string): Promise<number | null> {
    const parsed = await callReadOnly({
      network: this.o.network,
      senderAddress: this.o.senderAddress,
      ...this.base(),
      functionName: "get-id-by-hash",
      functionArgs: [bufferCV(Buffer.from(expectedHashHex.replace(/^0x/, ""), "hex"))],
    });
    const inner = unwrapOptional(parsed);
    return inner ? Number(inner.value) : null;
  }

  async getInscriptionSummary(id: number): Promise<any | null> {
    const parsed = await callReadOnly({
      network: this.o.network,
      senderAddress: this.o.senderAddress,
      ...this.base(),
      functionName: "get-inscription-summary",
      functionArgs: [uintCV(id)],
    });
    // (ok (optional {...}))
    return unwrapOptional(parsed?.value);
  }

  async getParents(id: number): Promise<number[]> {
    return this.readUintList("get-parents", id);
  }

  async getDependencies(id: number): Promise<number[]> {
    return this.readUintList("get-dependencies", id);
  }

  private async readUintList(fn: string, id: number): Promise<number[]> {
    const parsed = await callReadOnly({
      network: this.o.network,
      senderAddress: this.o.senderAddress,
      ...this.base(),
      functionName: fn,
      functionArgs: [uintCV(id)],
    });
    const list = parsed?.value;
    if (!Array.isArray(list)) return [];
    return list.map((e: any) => Number(e.value));
  }

  /**
   * Inscribe an arbitrary asset (the "work") via mint-single-tx.
   * Returns the new token id (the demo's asset inscription).
   */
  async inscribeAsset(data: Uint8Array, mime: string, tokenUri: string): Promise<InscriptionResult> {
    const chunks = chunkBytes(data);
    const expectedHash = computeExpectedHash(chunks);
    const expectedHashHex = `0x${toHex(expectedHash)}`;
    const fee = await this.quoteSingleTxFee(data.length, chunks.length);
    const tx = await makeContractCall({
      ...this.base(),
      functionName: "mint-single-tx",
      functionArgs: [
        bufferCV(Buffer.from(expectedHash)),
        stringAsciiCV(mime),
        uintCV(data.length),
        listCV(chunks.map((c) => bufferCV(Buffer.from(c)))),
        stringAsciiCV(tokenUri.slice(0, 256)),
      ],
      senderKey: this.o.senderKey,
      network: this.o.network,
      postConditions: [this.feeCap(fee)],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });
    const txid = await broadcast(tx, this.o.network);
    const confirmed = await waitForConfirmation(txid, this.o.network);
    const tokenId = this.parseTokenId(confirmed) ?? (await this.getIdByHash(expectedHashHex));
    if (tokenId == null) throw new Error(`Could not resolve asset token id for ${txid}`);
    return { tokenId, existed: false, txid, contentHashHex: expectedHashHex };
  }

  /**
   * Inscribe a Proof-of-Flow receipt and link its lineage in ONE transaction:
   *   dependencies = [assetInscription]   (the work; must already exist)
   *   parents      = [prevReceipt]         (previous receipt in the chain)
   */
  async inscribeReceipt(receipt: FlowReceipt): Promise<InscriptionResult> {
    const prep = prepareReceiptInscription(receipt);
    const dependencies = [receipt.links.assetInscription];
    const parents = receipt.links.prevReceipt != null ? [receipt.links.prevReceipt] : [];
    const fee = await this.quoteSingleTxFee(prep.totalSize, prep.chunks.length);

    const tx = await makeContractCall({
      ...this.base(),
      functionName: "mint-single-tx-with-relationships",
      functionArgs: [
        bufferCV(Buffer.from(prep.expectedHash)),
        stringAsciiCV(prep.mime),
        uintCV(prep.totalSize),
        listCV(prep.chunks.map((c) => bufferCV(Buffer.from(c)))),
        stringAsciiCV(prep.tokenUri),
        listCV(dependencies.map((d) => uintCV(d))),
        listCV(parents.map((p) => uintCV(p))),
      ],
      senderKey: this.o.senderKey,
      network: this.o.network,
      postConditions: [this.feeCap(fee)],
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
    });

    const txid = await broadcast(tx, this.o.network);
    const confirmed = await waitForConfirmation(txid, this.o.network);
    const tokenId = this.parseTokenId(confirmed) ?? (await this.getIdByHash(prep.expectedHashHex));
    if (tokenId == null) throw new Error(`Could not resolve receipt token id for ${txid}`);
    return { tokenId, existed: false, txid, contentHashHex: prep.expectedHashHex };
  }

  private feeCap(quoted: bigint) {
    const mult = BigInt(Math.max(1, Math.round((this.o.feeCapMultiplier ?? 2))));
    return makeStandardSTXPostCondition(
      this.o.senderAddress,
      FungibleConditionCode.LessEqual,
      quoted * mult
    );
  }

  /** Pull "token-id uN" out of a confirmed tx_result.repr. */
  private parseTokenId(confirmed: any): number | null {
    const repr: string | undefined = confirmed?.tx_result?.repr;
    if (!repr) return null;
    const m = repr.match(/token-id\s+u(\d+)/);
    return m && m[1] ? Number(m[1]) : null;
  }
}
