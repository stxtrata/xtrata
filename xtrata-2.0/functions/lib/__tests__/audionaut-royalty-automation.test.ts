import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { makeRandomPrivKey, privateKeyToString, getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';
import { catalogue, royaltyRows, type Snapshot } from '../audionaut-royalties';
import { runRoyaltyAutomation, memoEditions, decodeRoyaltyMemo, payerAddresses, automationInfo, type AutomationDependencies } from '../audionaut-royalty-automation';
import { memoryDb, sqliteAvailable } from './storage/fixtures';
const address = () => getAddressFromPrivateKey(privateKeyToString(makeRandomPrivKey()), TransactionVersion.Mainnet);
const PAYEE = address(), PAYER = address(), OTHER = address(), HASH = '0x' + 'b'.repeat(64);
const memo = (s: string) => '0x' + Buffer.from(s).toString('hex').padEnd(68, '0');
const tx = (id: number, text = 'audionaut:1', patch = {}) => ({ tx_id: '0x' + id.toString(16).padStart(64, '0'), block_height: 110,
  canonical: true, tx_status: 'success', tx_type: 'token_transfer', sender_address: PAYER,
  token_transfer: { recipient_address: PAYEE, amount: '5000000', memo: memo(text) }, ...patch });
const snapshot: Snapshot = { checkedAt: 1, blockHeight: 120, minted: [catalogue.editions[0], catalogue.editions[11]].map(e => ({ ...e, tokenId: 3100 + e.edition, mintedAt: 100 })),
  artists: catalogue.artists.map(a => ({ ...a, address: PAYEE, error: null })) };
function fixture(transactions: any[] = []) {
  const DB = memoryDb();
  for (const name of ['023_audionaut_royalties.sql', '024_audionaut_royalty_automation.sql']) DB.sqlite.exec(readFileSync(new URL('../../migrations/' + name, import.meta.url), 'utf8'));
  const deps: AutomationDependencies = { snapshot: vi.fn(async () => snapshot), canonical: vi.fn(async () => undefined), block: vi.fn(async () => HASH),
    page: vi.fn(async (_env, _address, _height, offset) => ({ total: transactions.length, results: transactions.slice(offset, offset + 50) })),
    verify: vi.fn(async () => undefined), rows: (env, live, records) => royaltyRows(env, live, records, async () => undefined) };
  return { env: { DB } as any, DB, deps };
}
describe('explicit royalty tags and monitored addresses', () => {
  it('decodes only a valid transfer memo and a strict collection/edition list', () => {
    expect(decodeRoyaltyMemo(memo('audionaut:2,5'))).toBe('audionaut:2,5');
    expect(memoEditions('audionaut:2,5')).toEqual([2, 5]);
    for (const s of ['royalty', 'audionaut:0', 'audionaut:112', 'audionaut:1,1', 'audionaut: 1', 'other:1', 'audionaut:1\0x']) expect(memoEditions(s)).toBeNull();
    expect(decodeRoyaltyMemo('0xZZ')).toBe('');
    expect(() => payerAddresses(['not an address'])).toThrow();
    expect(payerAddresses([PAYER, PAYER.toLowerCase()])).toEqual([PAYER]);
  });
});
describe.skipIf(!sqliteAvailable)('automatic receipt reconciliation', () => {
  it('imports an explicitly tagged transfer once and hides operational data from holders', async () => {
    const { env, DB, deps } = fixture([tx(1)]);
    expect((await runRoyaltyAutomation(env, deps, 1000)).imported).toBe(1);
    expect((await runRoyaltyAutomation(env, deps, 2000)).imported).toBe(0);
    expect(DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_allocations').get().n).toBe(1);
    const info = await automationInfo(env, false);
    expect(info.payers).toBeUndefined(); expect(info.candidates).toBeUndefined();
    expect(info.summary.paid).toBe(1);
  });
  it('retains unlabelled payments from a configured payer without guessing editions', async () => {
    const { env, DB, deps } = fixture([tx(1, '')]);
    DB.sqlite.prepare('UPDATE audionaut_royalty_automation SET payers_json=?').run(JSON.stringify([PAYER]));
    await runRoyaltyAutomation(env, deps, 1000);
    expect(deps.verify).not.toHaveBeenCalled();
    expect((await automationInfo(env, true)).candidates).toHaveLength(1);
    expect(DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_payments').get().n).toBe(0);
  });
  it('ignores unrelated unlabelled incoming payments, failed transfers and wrong amounts', async () => {
    const { env, DB, deps } = fixture([tx(1, ''), tx(2, 'audionaut:1', { tx_status: 'abort_by_response' }),
      tx(3, 'audionaut:1', { token_transfer: { recipient_address: PAYEE, amount: '4999999', memo: memo('audionaut:1') } })]);
    await runRoyaltyAutomation(env, deps, 1000);
    expect(DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_candidates').get().n).toBe(0);
  });
  it('retries failed historical verification and does not record an invalid receipt', async () => {
    const { env, DB, deps } = fixture([tx(1)]);
    deps.verify = vi.fn(async () => { throw Error('Historical owner unavailable'); });
    await runRoyaltyAutomation(env, deps, 1000);
    expect(DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_payments').get().n).toBe(0);
    expect((await automationInfo(env, true)).candidates[0].note).toMatch('Historical owner');
    deps.verify = vi.fn(async () => undefined);
    expect((await runRoyaltyAutomation(env, deps, 2000)).imported).toBe(1);
  });
  it('rolls back all allocations in a conflicting tagged batch', async () => {
    const { env, DB, deps } = fixture([tx(1), tx(2, 'audionaut:1,12', { token_transfer: { recipient_address: PAYEE, amount: '10000000', memo: memo('audionaut:1,12') } })]);
    await runRoyaltyAutomation(env, deps, 1000);
    expect(DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_payments').get().n).toBe(1);
    expect(DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_allocations').get().n).toBe(1);
    expect((await automationInfo(env, true)).candidates[0].note).toMatch('already has');
  });
  it('resumes bounded, block-pinned history without offsets shifting under new activity', async () => {
    const history = Array.from({ length: 160 }, (_, i) => tx(i + 1, '', { block_height: 119 - Math.floor(i / 10) }));
    const { env, DB, deps } = fixture(history);
    expect((await runRoyaltyAutomation(env, deps, 1000)).incomplete).toBe(1);
    expect(DB.sqlite.prepare('SELECT scan_offset FROM audionaut_royalty_scans').get().scan_offset).toBe(150);
    deps.snapshot = async () => ({ ...snapshot, blockHeight: 130 });
    expect((await runRoyaltyAutomation(env, deps, 2000)).incomplete).toBe(0);
    expect(deps.page).toHaveBeenLastCalledWith(env, PAYEE, 120, 150);
    await runRoyaltyAutomation(env, deps, 3000);
    expect(deps.page).toHaveBeenCalledWith(env, PAYEE, 130, 0);
  });
  it('does not advance the cursor when history is missing, and retries on next run', async () => {
    const { env, DB, deps } = fixture();
    deps.page = vi.fn(async () => ({ total: 100, results: [] }));
    expect((await runRoyaltyAutomation(env, deps, 1000)).errors).toHaveLength(1);
    expect(DB.sqlite.prepare('SELECT COUNT(*) AS n FROM audionaut_royalty_scans').get().n).toBe(0);
    expect((await automationInfo(env, false)).error).toMatch('Incomplete payment history');
  });
  it('rewinds history after a changed anchor and retains prior receiving wallets', async () => {
    const { env, deps } = fixture();
    await runRoyaltyAutomation(env, deps, 1000);
    deps.canonical = vi.fn(async (_env, _height, hash) => { if (hash === HASH) throw Error('Changed canonical block'); });
    deps.block = async () => '0x' + 'c'.repeat(64);
    deps.snapshot = async () => ({ ...snapshot, blockHeight: 130, artists: snapshot.artists.map(a => ({ ...a, address: OTHER })) });
    await runRoyaltyAutomation(env, deps, 2000);
    expect(deps.page).toHaveBeenCalledWith(env, PAYEE, 130, 0);
    expect(deps.page).toHaveBeenCalledWith(env, OTHER, 130, 0);
  });
  it('skips overlapping runs and releases the lease after a failed mint read', async () => {
    const { env, DB, deps } = fixture();
    DB.sqlite.prepare('UPDATE audionaut_royalty_automation SET lease_until=10000').run();
    expect(await runRoyaltyAutomation(env, deps, 1000)).toEqual({ skipped: true });
    expect(deps.snapshot).not.toHaveBeenCalled();
    deps.snapshot = async () => { throw Error('Chain unavailable'); };
    await expect(runRoyaltyAutomation(env, deps, 20000)).rejects.toThrow('Chain unavailable');
    expect(DB.sqlite.prepare('SELECT lease_until FROM audionaut_royalty_automation').get().lease_until).toBe(0);
  });
});
