/** Collection v1.5 uses core v3.2.3's staged fee model, even for its atomic route. */
export type CollectionV15FeeUnits = {
  begin: bigint;
  chunk: bigint;
  batch: bigint;
  seal: bigint;
};
/** Helpers on core v3.2.3's staged fee model with registered inventory (v1.5–v1.7). */
export const isCollectionV15 = (version: string) =>
  /^xtrata-collection-mint-v1[.-][5-7]$/.test(version.trim());

/**
 * v1.7+: `mint-price` is the fixed all-in amount a collector pays for any file.
 * The helper deducts that file's protocol fees and pays out the rest.
 */
export const isFixedPriceCollection = (version: string) =>
  /^xtrata-collection-mint-v1[.-]7$/.test(version.trim());

export const readCollectionV15FeeUnits = async (
  read: (functionName: string) => Promise<bigint | null>
): Promise<CollectionV15FeeUnits> => {
  const values = await Promise.all([
    'get-begin-fee-unit', 'get-upload-chunk-fee-unit',
    'get-upload-batch-fee-unit', 'get-seal-fee-unit'
  ].map(read));
  if (values.some(value => typeof value !== 'bigint' || value < 0n))
    throw new Error('All four core fee units must be available before minting.');
  return { begin: values[0]!, chunk: values[1]!, batch: values[2]!, seal: values[3]! };
};

/**
 * Collector spend for one mint.
 * - v1.5/v1.6 (default): total = protocol fees + mint price.
 * - v1.7 (`fixedPrice: true`): total = the fixed mint price (protocol fees come
 *   out of it); price 0 = free mint, collector pays only the protocol fees.
 *   `seal` is a safe upper bound for the seal transaction's STX spend
 *   (post-conditions use less-than-or-equal), valid whatever begin fee the
 *   reservation recorded.
 */
export const quoteCollectionV15Mint = (
  units: CollectionV15FeeUnits,
  chunks: number,
  mintPrice: bigint,
  options: { fixedPrice?: boolean } = {}
) => {
  if (!Number.isSafeInteger(chunks) || chunks < 1 || mintPrice < 0n ||
      Object.values(units).some(value => typeof value !== 'bigint' || value < 0n))
    throw new Error('Invalid collection fee quote.');
  const count = BigInt(chunks);
  const first = count < 32n ? count : 32n;
  const extra = count <= 32n ? 0n : (count - 32n + 31n) / 32n;
  const sealProtocol = units.seal + first * units.chunk + extra * units.batch;
  if (options.fixedPrice) {
    const fees = units.begin + sealProtocol;
    const payout = mintPrice > fees ? mintPrice - fees : 0n;
    return { begin: units.begin, upload: 0n, sealProtocol, payout,
      seal: mintPrice > sealProtocol ? mintPrice : sealProtocol,
      total: units.begin + sealProtocol + payout };
  }
  return { begin: units.begin, upload: 0n, sealProtocol, payout: mintPrice,
    seal: mintPrice + sealProtocol, total: units.begin + sealProtocol + mintPrice };
};
