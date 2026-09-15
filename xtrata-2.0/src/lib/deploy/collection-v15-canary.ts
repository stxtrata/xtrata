/** Pinned candidate; the shared browser publisher currently forces Clarity 4. */
export const COLLECTION_V15_NAME = 'xtrata-collection-mint-v1-5';
export const COLLECTION_V15_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
export const COLLECTION_V15_SHA256 = '0f2dcba375a863a8c3c4ef8516d81fbd305a3c208961a85612f3ee9eb38ede57';
export function inspectCollectionV15Source(_code: string, hash: string): string[] {
  return hash === COLLECTION_V15_SHA256 ? [] : ['Collection v1.5 source differs from the pinned candidate.'];
}
export const COLLECTION_V15_READS = ['get-locked-core-contract', 'get-owner', 'get-pending-owner', 'get-operator-admin', 'get-finance-admin', 'is-paused', 'get-finalized', 'get-max-supply', 'get-minted-count', 'get-reserved-count', 'get-minted-index-count', 'get-mint-price', 'get-recipients', 'get-splits', 'get-collection-metadata', 'get-default-dependencies', 'get-max-small-mint-chunks', 'get-reservation-expiry-blocks'] as const;
export function unwrapCollectionRead(read: any): any {
  if (read?.success !== true || !read.value) throw new Error('Expected a successful Clarity response');
  return read.value.value;
}
export function inspectCollectionV15State(reads: Record<string, any>): string[] {
  const issues: string[] = [];
  if (unwrapCollectionRead(reads['get-locked-core-contract']) !== COLLECTION_V15_CORE) issues.push('Deployed helper is not pinned to the expected v3.2.3 core.');
  if (String(unwrapCollectionRead(reads['get-max-small-mint-chunks'])) !== '30') issues.push('Unexpected atomic mint chunk limit.');
  const minted = BigInt(unwrapCollectionRead(reads['get-minted-count']));
  const reserved = BigInt(unwrapCollectionRead(reads['get-reserved-count']));
  const supply = BigInt(unwrapCollectionRead(reads['get-max-supply']));
  if (minted + reserved > supply) issues.push('Minted plus reserved exceeds maximum supply.');
  if (BigInt(unwrapCollectionRead(reads['get-minted-index-count'])) !== minted) issues.push('Mint index count differs from minted count.');
  return issues;
}
