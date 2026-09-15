import { validateStacksAddress } from '@stacks/transactions';
/** Simple address,allowance CSV or whitespace-separated wallet list. No silent conflicts. */
export function importAllowlist(raw: string) {
  const entries = new Map<string, string>();
  const errors: string[] = [];
  let duplicates = 0;
  const lines = raw.replace(/^\uFEFF/, '').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    const columns = line.trim().split(/[\s,]+/);
    if (index === 0 && /^(wallet|address)$/i.test(columns[0]) && /^allowance$/i.test(columns[1])) return;
    const [address, allowance] = columns;
    if (columns.length !== 2 || !validateStacksAddress(address) || !/^\d+$/.test(allowance)) { errors.push(`Line ${index + 1}: use a valid wallet address and a non-negative whole-number allowance.`); return; }
    const count = BigInt(allowance).toString();
    if (BigInt(count) > (1n << 128n) - 1n) { errors.push(`Line ${index + 1}: allowance is too large.`); return; }
    if (entries.has(address)) {
      if (entries.get(address) !== count) errors.push(`Line ${index + 1}: conflicting allowances for ${address}.`);
      else duplicates++;
    } else entries.set(address, count);
  });
  if (!entries.size) errors.push('Add at least one wallet.');
  if (entries.size > 200) errors.push('Import at most 200 unique wallets per transaction.');
  return { text: [...entries].map(([address, allowance]) => `${address} ${allowance}`).join('\n'), count: entries.size, duplicates, errors };
}
