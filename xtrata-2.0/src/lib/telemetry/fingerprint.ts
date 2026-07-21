/**
 * Turn a raw error into a STABLE fingerprint so the same bug — whose messages
 * differ only in addresses / tx ids / amounts / nonces — collapses to ONE
 * "unique issue" the /debug page can count and rank.
 */
export function normaliseMessage(raw: string): string {
  return (raw || '')
    .replace(/0x[0-9a-fA-F]{6,}/g, '0x…') // hex / tx ids / hashes
    .replace(/\bS[PT][0-9A-Z]{20,}\b/g, '<addr>') // stacks addresses
    .replace(/\b[0-9a-fA-F]{64}\b/g, '<hash>') // 32-byte hashes
    .replace(/\b\d[\d,]*(\.\d+)?\b/g, '<n>') // amounts, nonces, heights, fees
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

/** Deterministic, dependency-free 16-hex fingerprint (double FNV-1a). */
export function fingerprint(
  flow: string,
  step: string | undefined,
  errorCode: string | undefined,
  message: string
): string {
  const basis = `${flow}|${step ?? ''}|${errorCode ?? ''}|${normaliseMessage(message)}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ 0x9e3779b9;
  for (let i = 0; i < basis.length; i += 1) {
    const c = basis.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ ((c << 5) | (c >>> 3)), 0x01000193);
  }
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  return (hex(h1) + hex(h2)).slice(0, 16);
}
