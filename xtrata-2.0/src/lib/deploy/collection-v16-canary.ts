/** Pinned candidate verified by the Clarity 4 collection simulation suite. */
export const COLLECTION_V16_NAME = 'xtrata-collection-mint-v1-6';
export const COLLECTION_V16_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
export const COLLECTION_V16_SHA256 = 'a3ced7925b6e6f144fbc37a3af394430a8bc4475d7a4459e801f144a93db49ee';
export function inspectCollectionV16Source(_code: string, hash: string): string[] {
  return hash === COLLECTION_V16_SHA256 ? [] : ['Collection v1.6 source differs from the pinned candidate.'];
}
export const COLLECTION_V16_READS = ['get-locked-core-contract', 'get-owner', 'get-pending-owner', 'get-operator-admin', 'get-finance-admin', 'is-paused', 'get-finalized', 'get-max-supply', 'get-minted-count', 'get-reserved-count', 'get-minted-index-count', 'get-mint-price', 'get-recipients', 'get-splits', 'get-collection-metadata', 'get-default-dependencies', 'get-max-small-mint-chunks', 'get-reservation-expiry-blocks'] as const;
export function unwrapCollectionRead(read: any): any {
  if (read?.success !== true || !read.value) throw new Error('Expected a successful Clarity response');
  return read.value.value;
}
export function inspectCollectionV16State(reads: Record<string, any>): string[] {
  const issues: string[] = [];
  if (unwrapCollectionRead(reads['get-locked-core-contract']) !== COLLECTION_V16_CORE) issues.push('Deployed helper is not pinned to the expected v3.2.3 core.');
  if (String(unwrapCollectionRead(reads['get-max-small-mint-chunks'])) !== '32') issues.push('Unexpected atomic mint chunk limit.');
  const minted = BigInt(unwrapCollectionRead(reads['get-minted-count']));
  const reserved = BigInt(unwrapCollectionRead(reads['get-reserved-count']));
  const supply = BigInt(unwrapCollectionRead(reads['get-max-supply']));
  if (minted + reserved > supply) issues.push('Minted plus reserved exceeds maximum supply.');
  if (BigInt(unwrapCollectionRead(reads['get-minted-index-count'])) !== minted) issues.push('Mint index count differs from minted count.');
  return issues;
}
