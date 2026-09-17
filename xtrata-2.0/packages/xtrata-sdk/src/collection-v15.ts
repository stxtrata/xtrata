/** Collection v1.5 uses core v3.2.3's staged fee model, even for its atomic route. */
export type CollectionV15FeeUnits = {
  begin: bigint;
  chunk: bigint;
  batch: bigint;
  seal: bigint;
};
export const isCollectionV15 = (version: string) =>
  /^xtrata-collection-mint-v1[.-][56]$/.test(version.trim());

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

export const quoteCollectionV15Mint = (units: CollectionV15FeeUnits, chunks: number, mintPrice: bigint) => {
  if (!Number.isSafeInteger(chunks) || chunks < 1 || mintPrice < 0n ||
      Object.values(units).some(value => typeof value !== 'bigint' || value < 0n))
    throw new Error('Invalid collection fee quote.');
  const count = BigInt(chunks);
  const first = count < 32n ? count : 32n;
  const extra = count <= 32n ? 0n : (count - 32n + 31n) / 32n;
  const sealProtocol = units.seal + first * units.chunk + extra * units.batch;
  return { begin: units.begin, upload: 0n, sealProtocol,
    seal: mintPrice + sealProtocol, total: units.begin + sealProtocol + mintPrice };
};
