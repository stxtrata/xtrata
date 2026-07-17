import { sha256 } from '@noble/hashes/sha256';

export const CHUNK_SIZE = 16_384;
export const MAX_BATCH_SIZE = 50;
export const MAX_UPLOAD_BATCH_SIZE = 30;
export const EMPTY_HASH = new Uint8Array(32);

export const chunkBytes = (data: Uint8Array, chunkSize = CHUNK_SIZE) => {
  if (chunkSize <= 0) {
    throw new Error('chunkSize must be greater than zero');
  }

  // Zero-copy: return subarray() views over the original buffer instead of
  // slice() copies. Chunks are consumed read-only (hashing, hex encoding, tx
  // payloads), so sharing the backing buffer is safe and avoids O(n) copies on
  // large files.
  const chunks: Uint8Array[] = [];
  for (let offset = 0; offset < data.length; offset += chunkSize) {
    chunks.push(data.subarray(offset, offset + chunkSize));
  }
  return chunks;
};

export const batchChunks = (chunks: Uint8Array[], batchSize = MAX_UPLOAD_BATCH_SIZE) => {
  if (!Number.isFinite(batchSize) || batchSize <= 0) {
    throw new Error('batchSize must be greater than zero');
  }

  const resolvedBatchSize = Math.min(MAX_UPLOAD_BATCH_SIZE, Math.floor(batchSize));
  const batches: Uint8Array[][] = [];
  for (let offset = 0; offset < chunks.length; offset += resolvedBatchSize) {
    batches.push(chunks.slice(offset, offset + resolvedBatchSize));
  }
  return batches;
};

export const computeExpectedHash = (chunks: Uint8Array[]) => {
  // Protocol running hash: for each chunk, hash (previousHash || chunk).
  // Incremental hashing feeds the two operands via successive update() calls,
  // which is byte-for-byte identical to hashing their concatenation but avoids
  // allocating a combined buffer per chunk.
  let runningHash: Uint8Array = EMPTY_HASH;
  for (const chunk of chunks) {
    runningHash = sha256.create().update(runningHash).update(chunk).digest();
  }
  return runningHash;
};
