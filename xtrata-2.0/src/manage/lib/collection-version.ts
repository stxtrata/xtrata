/** Unknown versions stay in the legacy section rather than masquerading as current. */
export function isCurrentCollection(collection: { metadata?: Record<string, unknown> | null }) {
  const metadata = collection.metadata;
  return /^xtrata-collection-mint-v1[.-]5$/.test(String(metadata?.templateVersion ?? '')) &&
    (!metadata?.coreContractId || String(metadata.coreContractId).endsWith('.xtrata-v3-2-3'));
}
