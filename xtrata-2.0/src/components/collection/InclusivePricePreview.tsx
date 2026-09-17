import { useEffect, useState } from 'react';
import { cvToJSON, hexToCV } from '@stacks/transactions';
import { readCollectionV15FeeUnits, quoteCollectionV15Mint, type CollectionV15FeeUnits } from '../../../packages/xtrata-sdk/src/collection-v15';

const core = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const format = (n: bigint) => `${Number(n) / 1000000} STX`;
export default function InclusivePricePreview({ maxChunks }: { maxChunks: number | null }) {
  const [target, setTarget] = useState('1');
  const [fees, setFees] = useState<CollectionV15FeeUnits | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    readCollectionV15FeeUnits(async name => {
      const response = await fetch(`/hiro/mainnet/v2/contracts/call-read/${core}/xtrata-v3-2-3/${name}`, {
        method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: core, arguments: [] })
      });
      if (!response.ok) throw Error('Fee lookup unavailable');
      const data = await response.json();
      if (!data.okay || !data.result) throw Error('Fee lookup unavailable');
      const decoded = cvToJSON(hexToCV(data.result));
      if (!decoded.success || decoded.value?.type !== 'uint') throw Error('Invalid fee response');
      return BigInt(decoded.value.value);
    }).then(setFees).catch(() => { if (!controller.signal.aborted) setError('Unable to load protocol fees. Refresh before pricing.'); });
    return () => controller.abort();
  }, []);
  const valid = /^\d+(\.\d{1,6})?$/.test(target);
  const parts = target.split('.');
  const total = valid ? BigInt(parts[0]) * 1000000n + BigInt((parts[1] ?? '').padEnd(6, '0')) : null;
  const protocol = fees && maxChunks && maxChunks > 0 ? quoteCollectionV15Mint(fees, maxChunks, 0n).total : null;
  const base = total !== null && protocol !== null ? total - protocol : null;
  const platform = base !== null && base >= 0n ? base * 500n / 10000n : null;
  return <section className="collection-settings-panel__group" aria-label="Inclusive pricing preview">
    <h3>Set your advertised sale price</h3>
    <p>Creator-only calculation preview — this does not change your live price or payout settings. Verify all files and lock the inventory before confirming a price.</p>
    <label>Advertised sale price (STX)
      <input inputMode="decimal" value={target} onChange={event => setTarget(event.target.value)} />
    </label>
    {error && <p role="alert">{error}</p>}
    {!maxChunks && <p>Complete and lock the staged inventory to calculate its largest-item allowance.</p>}
    {!valid && <p role="alert">Enter a positive STX amount with up to six decimal places.</p>}
    {base !== null && protocol !== null && <>
      <p>Based on the locked inventory maximum: {maxChunks} chunks. Current mainnet fees; recheck before applying.</p>
      <dl><dt>Price shown to buyers</dt><dd>{format(total!)}</dd>
      <dt>Inscription allowance deducted from your advertised price</dt><dd>{format(protocol)}</dd>
      <dt>Required v1.6 contract sale amount</dt><dd>{base >= 0n ? format(base) : 'Target is below inscription cost'}</dd>
      {platform !== null && <><dt>Example Xtrata share: 5% of contract sale amount</dt><dd>{format(platform)}</dd>
      <dt>Creator proceeds per mint (before any artist split)</dt><dd>{format(base - platform)}</dd></>}</dl>
      <p>Buyers see one advertised price. We subtract the largest-item inscription allowance to calculate the contract sale amount. Smaller files cost the buyer less; your contract payout base stays the same. The 5% platform share is taken from that base, not added to the buyer’s price. These proceeds assume a configured 5% share; verify the actual recipients and splits before signing.</p>
    </>}
    <p>Wallet network fees are additional and variable. Already-inscribed NFTs need a sale/transfer flow; they do not incur a new inscription charge.</p>
  </section>;
}
