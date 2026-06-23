/**
 * Canonical receipt encoding + Xtrata content hashing.
 *
 * The hash MUST match the contract's `process-chunk` logic in xtrata-v3.2.3:
 *   next-hash = sha256(concat(current-hash, chunk))   starting from 32 zero bytes.
 * If this diverges, seal/mint fails with ERR-HASH-MISMATCH (u103).
 */
import { sha256 } from "@noble/hashes/sha256";
import type { FlowReceipt } from "./types.js";

export const CHUNK_SIZE = 16_384; // xtrata-v3.2.3 CHUNK-SIZE
export const MAX_SINGLE_TX_CHUNKS = 32; // xtrata-v3.2.3 MAX-SINGLE-TX-CHUNKS

/**
 * Deterministic JSON serialization (stable key order) so identical receipts
 * dedupe to the same canonical Xtrata token via content hash.
 */
export function canonicalJson(receipt: FlowReceipt): string {
  const ordered = {
    std: receipt.std,
    v: receipt.v,
    flow: receipt.flow,
    vault: receipt.vault,
    token: receipt.token,
    amount: receipt.amount,
    split: receipt.split,
    lock: receipt.lock,
    unlocked: receipt.unlocked,
    depositTxid: receipt.depositTxid,
    block: receipt.block,
    ts: receipt.ts,
    links: {
      assetInscription: receipt.links.assetInscription,
      prevReceipt: receipt.links.prevReceipt,
    },
  };
  return JSON.stringify(ordered);
}

export function receiptBytes(receipt: FlowReceipt): Uint8Array {
  return new TextEncoder().encode(canonicalJson(receipt));
}

export function chunkBytes(data: Uint8Array): Uint8Array[] {
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    chunks.push(data.slice(i, i + CHUNK_SIZE));
  }
  return chunks.length ? chunks : [new Uint8Array(0)];
}

/** Incremental SHA-256 chain hash — must mirror xtrata process-chunk. */
export function computeExpectedHash(chunks: Uint8Array[]): Uint8Array {
  let running = new Uint8Array(32); // 32 zero bytes
  for (const chunk of chunks) {
    const combined = new Uint8Array(running.length + chunk.length);
    combined.set(running, 0);
    combined.set(chunk, running.length);
    // Wrap in a fresh ArrayBuffer-backed Uint8Array (keeps strict typed-array libs happy).
    running = new Uint8Array(sha256(combined));
  }
  return running;
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Build the on-chain artifacts for a receipt: chunks, content hash, token-uri.
 * Receipts are tiny (< 1 chunk), so this is always a single-tx mint.
 */
export function prepareReceiptInscription(receipt: FlowReceipt) {
  const bytes = receiptBytes(receipt);
  const chunks = chunkBytes(bytes);
  if (chunks.length > MAX_SINGLE_TX_CHUNKS) {
    throw new Error(`Receipt too large for single-tx mint (${chunks.length} chunks)`);
  }
  const expectedHash = computeExpectedHash(chunks);
  // token-uri must be non-empty and <= 256 chars (ERR-INVALID-URI otherwise).
  const tokenUri = `flowproof:${receipt.flow}:asset${receipt.links.assetInscription}`.slice(0, 256);
  return {
    bytes,
    chunks,
    totalSize: bytes.length,
    expectedHash,
    expectedHashHex: `0x${toHex(expectedHash)}`,
    mime: "application/json",
    tokenUri,
  };
}
