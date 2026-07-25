import { sha256 } from '@noble/hashes/sha256';

/**
 * Hashing primitives for the xtrata-v3-2-3 core.
 *
 * Protocol chain hash (what the core keeps in UploadState and checks at seal):
 *
 *   H_0     = 0x00…00 (32 zero bytes)
 *   H_{i+1} = sha256(H_i || chunk_i)
 *
 * The final H_n over all chunks is the item's content hash.
 */

export const CHUNK_SIZE = 16_384;
/** v3.2.3 core: chunk batches are `(list 32 …)`. */
export const MAX_CHUNK_BATCH = 32;
/** v3.2.3 core: mint-single-tx* accepts at most 32 chunks (512 KiB). */
export const MAX_SINGLE_TX_CHUNKS = 32;
export const MAX_SINGLE_TX_BYTES = MAX_SINGLE_TX_CHUNKS * CHUNK_SIZE; // 524 288
/** Collection contract: seal batches are ≤ 50 sessions per tx. */
export const MAX_SEAL_BATCH = 50;

export const EMPTY_HASH: Uint8Array = new Uint8Array(32);
export const HASH_LENGTH = 32;

/**
 * Zero-copy chunking: returns subarray() views over the original buffer.
 * Chunks are consumed read-only (hashing, hex encoding, tx payloads), so
 * sharing the backing buffer is safe and avoids O(n) copies on large files.
 */
export const chunkBytes = (data: Uint8Array, chunkSize = CHUNK_SIZE): Uint8Array[] => {
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error('chunkSize must be a positive integer');
  }
  const chunks: Uint8Array[] = [];
  for (let offset = 0; offset < data.length; offset += chunkSize) {
    chunks.push(data.subarray(offset, offset + chunkSize));
  }
  return chunks;
};

export const chunkCount = (byteLength: number, chunkSize = CHUNK_SIZE): number =>
  byteLength === 0 ? 0 : Math.ceil(byteLength / chunkSize);

/**
 * The chain running hash after the first `count` chunks are folded, in order.
 * `runningHashAfter(chunks, 0)` is the 32-byte zero seed;
 * `runningHashAfter(chunks, chunks.length)` equals `computeChainHash(chunks)`.
 *
 * Incremental hashing feeds the two operands via successive update() calls,
 * byte-for-byte identical to hashing the concatenation without allocating a
 * combined buffer per chunk.
 */
export const runningHashAfter = (chunks: Uint8Array[], count: number): Uint8Array => {
  if (!Number.isInteger(count) || count < 0 || count > chunks.length) {
    throw new Error(`count must be an integer in [0, ${chunks.length}], received ${count}`);
  }
  let running: Uint8Array = EMPTY_HASH;
  for (let i = 0; i < count; i += 1) {
    running = sha256.create().update(running).update(chunks[i]!).digest();
  }
  return running;
};

/** Final chain hash over all chunks — the item's content hash. */
export const computeChainHash = (chunks: Uint8Array[]): Uint8Array =>
  runningHashAfter(chunks, chunks.length);

/** Chain hash of a whole file (chunked at the protocol chunk size). */
export const chainHashOfBytes = (bytes: Uint8Array, chunkSize = CHUNK_SIZE): Uint8Array =>
  computeChainHash(chunkBytes(bytes, chunkSize));

/** Plain (non-chained) sha256 of the file bytes — used for dedupe. */
export const plainSha256 = (bytes: Uint8Array): Uint8Array => sha256(bytes);

export const bytesToHex = (bytes: Uint8Array): string => {
  let out = '';
  for (let i = 0; i < bytes.length; i += 1) {
    out += bytes[i]!.toString(16).padStart(2, '0');
  }
  return out;
};

export const hexToBytes = (hex: string): Uint8Array => {
  const clean = hex.startsWith('0x') || hex.startsWith('0X') ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0 || /[^0-9a-fA-F]/.test(clean)) {
    throw new Error(`invalid hex string: ${hex}`);
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
};

/** Constant-shape byte comparison. */
export const bytesEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
};
