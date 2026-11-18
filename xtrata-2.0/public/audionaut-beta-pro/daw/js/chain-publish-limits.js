// Conservative preparation bound for current Xtrata core: 2,048 × 16,384 bytes.
// Reading existing verified inscriptions has separate, larger manifest limits.
// Contracts with lower caps still require their normal contract-specific review.
export const CHAIN_PUBLICATION_MAX_BYTES = 32 * 1024 * 1024;

export function assertChainPublicationSize(bytes, name = 'Inscription file') {
  if (!Number.isSafeInteger(bytes) || bytes < 1) throw new Error(`${name} is empty or has an invalid size.`);
  if (bytes > CHAIN_PUBLICATION_MAX_BYTES) {
    const error = new Error(`${String(name).slice(0, 160)} is ${(bytes / 1024 / 1024).toFixed(2)} MiB (${bytes.toLocaleString('en-GB')} bytes). New inscriptions prepared here must be at most 32 MiB (33,554,432 bytes), the current Xtrata core limit. Shorten, compress or split the file before inscription review.`);
    error.code = 'CHAIN_PUBLICATION_SIZE';
    throw error;
  }
  return bytes;
}

export function assertChainPublicationFiles(files) {
  for (const file of files) assertChainPublicationSize(file.size, file.name || 'Inscription file');
  return files;
}
