/**
 * Pattern B client: calls flowproof-treasury.deposit-and-prove, which routes a
 * FlowVault deposit AND inscribes the Xtrata receipt in ONE atomic transaction.
 *
 * The returned txid is BOTH the deposit and the receipt's inscription tx -- so a
 * verifier can prove the money movement and its permanent record happened
 * together (see scripts/verify.ts, atomic path).
 */
import {
  AnchorMode,
  FungibleConditionCode,
  PostConditionMode,
  bufferCV,
  contractPrincipalCV,
  listCV,
  makeContractCall,
  makeStandardSTXPostCondition,
  stringAsciiCV,
  uintCV,
} from "@stacks/transactions";
import type { StacksNetwork } from "@stacks/network";
import { broadcast, waitForConfirmation } from "./stacks.js";
import { prepareReceiptInscription } from "./receipt.js";
import type { FlowReceipt, InscriptionResult } from "./types.js";

export interface TreasuryClientOpts {
  network: StacksNetwork;
  treasury: { address: string; name: string };
  token: { address: string; name: string };
  senderKey: string;
  senderAddress: string;
  /** STX post-condition cap (micro) for the inscription fee portion. */
  stxFeeCap?: bigint;
}

export class TreasuryClient {
  constructor(private readonly o: TreasuryClientOpts) {}

  /**
   * Atomically: FlowVault.deposit(token, amount) + Xtrata receipt inscription.
   * Routing rules for the caller must already be set (deposit reads them).
   */
  async depositAndProve(receipt: FlowReceipt): Promise<InscriptionResult & { atomicTxid: string }> {
    const prep = prepareReceiptInscription(receipt);
    const dependencies = [receipt.links.assetInscription];
    const parents = receipt.links.prevReceipt != null ? [receipt.links.prevReceipt] : [];

    const tx = await makeContractCall({
      contractAddress: this.o.treasury.address,
      contractName: this.o.treasury.name,
      functionName: "deposit-and-prove",
      functionArgs: [
        contractPrincipalCV(this.o.token.address, this.o.token.name),
        uintCV(BigInt(receipt.amount)),
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
      // The token amount leaves the user's account inside FlowVault; allow it.
      postConditions: [
        makeStandardSTXPostCondition(
          this.o.senderAddress,
          FungibleConditionCode.LessEqual,
          this.o.stxFeeCap ?? 5_000_000n
        ),
      ],
      postConditionMode: PostConditionMode.Allow,
      anchorMode: AnchorMode.Any,
    });

    const txid = await broadcast(tx, this.o.network);
    const confirmed = await waitForConfirmation(txid, this.o.network);
    const tokenId = this.parseReceiptId(confirmed);
    if (tokenId == null) throw new Error(`deposit-and-prove: could not resolve receipt id for ${txid}`);
    return { tokenId, existed: false, txid, contentHashHex: prep.expectedHashHex, atomicTxid: txid };
  }

  /** Pull "(receipt-)?id uN" out of the confirmed tx_result.repr. */
  private parseReceiptId(confirmed: any): number | null {
    const repr: string | undefined = confirmed?.tx_result?.repr;
    if (!repr) return null;
    const m = repr.match(/token-id\s+u(\d+)/) ?? repr.match(/receipt-id\s+u(\d+)/);
    return m && m[1] ? Number(m[1]) : null;
  }
}
