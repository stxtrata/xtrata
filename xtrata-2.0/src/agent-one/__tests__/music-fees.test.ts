import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEPOSIT, PAYER, OTHER, FakeChain, loadAgent, unloadAgent } from './support/fake-chain';
import { jobKey } from '../unfinished';
import { readMusicFees, writeMusicFees, musicTransactionCap, verifyMusicTopUp } from '../music-fees';
import { bufferCV, listCV, deserializeTransaction } from '@stacks/transactions';

const KEY = '0'.repeat(63) + '1';
const id = 'music-policy-test';
let chain: FakeChain, agent: any, api: any;
function job() { return JSON.parse(localStorage.getItem(jobKey(id))!); }
function changeJob(p: any) { localStorage.setItem(jobKey(id), JSON.stringify({ ...job(), ...p })); }
const args = () => [bufferCV(new Uint8Array(32)), listCV([bufferCV(new Uint8Array(16384))])];
function seed() {
  localStorage.setItem(jobKey(id), JSON.stringify({ jobId: id, status: 'FEE_WAITING', origin: 'music',
    depositAddress: DEPOSIT, funder: PAYER, expectedFunder: PAYER, user: PAYER, parents: [],
    bytes: 1048576, single: false, batches: 2, protocolFee: '2000', minerReserve: '1168576',
    requiredUstx: '1530000', depositReceivedUstx: '1530000', agentFeePct: 10, receipt: false }));
  writeMusicFees(id, { version: 1, mode: 'economy', networkBudget: '1168576', spent: '0', protocolSpent: '0',
    remainingWeight: '1168576', approvedTotal: '1530000', extraReceived: '0', service: '153000', lastConfirmedAt: Date.now(), waitSince: 0 });
  chain.fund(DEPOSIT, 1530000n);
}
beforeEach(async () => {
  chain = new FakeChain(); chain.realTxIds = true; agent = await loadAgent(chain); api = (window as any).XtrataAgent;
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request: async (_name: string, options: any, callback: any) => (callback || options)({}) } });
  seed();
});
afterEach(() => { vi.restoreAllMocks(); unloadAgent(); });

describe('Music Economy budgets and confirmed payments', () => {
  it('persists initial funding before a small single-transaction job pauses', async () => {
    const file = { name: 'small.ogg', arrayBuffer: async () => new Uint8Array(1024).buffer };
    const created = await api.createJob({ file, uri: 'xtrata:small', mime: 'audio/ogg', fastTrack: true, origin: 'music', feeMode: 'economy', receipt: false, expectedFunder: PAYER });
    chain.fund(created.depositAddress, BigInt(created.requiredUstx)); chain.minFeeToConfirm = 999999n;
    const privateJob = JSON.parse(localStorage.getItem(jobKey(created.jobId))!);
    await expect(agent.autoRun(privateJob)).rejects.toThrow(/Waiting/);
    const stored = JSON.parse(localStorage.getItem(jobKey(created.jobId))!);
    expect(stored.depositReceivedUstx).toBe(created.requiredUstx);
    expect(readMusicFees(created.jobId)?.pending?.fn).toBe('mint-single-tx');
  });
  it('quotes lower Economy mining while keeping Standard unchanged for single and batch', async () => {
    for (const bytes of [65536, 1048576, 4970250]) {
      const standard = await api.estimate({ bytes, receipt: false });
      const economy = await api.estimate({ bytes, receipt: false, feeMode: 'economy' });
      expect(BigInt(economy.requiredUstx)).toBeLessThan(BigInt(standard.requiredUstx));
      expect(economy.protocolFee).toBe(standard.protocolFee);
      expect(economy.minerReserve).toBe(String(BigInt(bytes) + BigInt(economy.single ? 1 : economy.batches + 2) * 30000n));
    }
    const batch = await api.estimateBatch({ itemsBytes: [65536, 1048576], receipt: false, feeMode: 'economy' });
    expect(BigInt(batch.sumMiner)).toBe(BigInt(65536 + 30000 + 1048576 + 120000));
  });
  it('never increases the Economy fee despite high estimator quotes and a long wait', async () => {
    chain.minFeeToConfirm = 999999n; chain.feeQuotes = [900000n];
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow(/Waiting/);
    const saved = readMusicFees(id)!;
    expect(saved.pending?.ids).toHaveLength(1); expect(chain.broadcasts).toHaveLength(1);
    vi.setSystemTime(Date.now() + 600000);
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow(/Waiting/);
    expect(chain.broadcasts).toHaveLength(1); expect(readMusicFees(id)?.mode).toBe('economy');
    expect(chain.requests.some(p => p.includes('/fees/transaction'))).toBe(false);
  });
  it('persists signed identity before an ambiguous broadcast and does not submit another nonce', async () => {
    chain.fail('/v2/transactions', 503);
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow();
    expect(readMusicFees(id)?.pending?.nonce).toBe('1');
    chain.clearFaults();
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow(/Waiting/);
    expect(chain.broadcasts).toHaveLength(0);
  });
  it('repairs a missing broadcast by resubmitting only the identical signed transaction', async () => {
    chain.fail('/v2/transactions', 503);
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow();
    const original = readMusicFees(id)!.pending!;
    chain.clearFaults(); chain.fail('/extended/v1/tx/', 404); vi.setSystemTime(Date.now() + 61000);
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow(/Waiting/);
    expect(chain.lastSignedId).toBe(original.ids[0]); expect(chain.broadcasts).toEqual([BigInt(original.fee)]);
    expect(chain.broadcastNonces).toEqual([BigInt(original.nonce)]);
    chain.clearFaults(); await agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id);
    expect(readMusicFees(id)?.pending).toBeUndefined();
  });
  it('records only the winning transaction fee once and reloads the journal', async () => {
    const result = await agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id);
    expect(readMusicFees(id)?.spent).toBe(String(chain.broadcasts[0]));
    expect(readMusicFees(id)?.pending).toBeUndefined();
    expect(result.d.tx_status).toBe('success');
    const raw = localStorage.getItem('xao:music-fees:' + id)!;
    localStorage.removeItem('xao:music-fees:' + id); localStorage.setItem('xao:music-fees:' + id, raw);
    expect(readMusicFees(id)?.spent).toBe(String(chain.broadcasts[0]));
  });
  it('allows a zero-payment upgrade when confirmed reserves already cover it', async () => {
    chain.balances.set(DEPOSIT, 5000000n);
    const q = await api.quoteMusicSpeedUp(id); expect(q.additional).toBe('0');
    await api.approveMusicSpeedUp(id, q.id);
    expect(readMusicFees(id)?.mode).toBe('standard'); expect(readMusicFees(id)?.extraReceived).toBe('0');
  });
  it('rejects expired reviews and duplicate approvals', async () => {
    const q = await api.quoteMusicSpeedUp(id);
    vi.setSystemTime(Date.now() + 121000);
    await expect(api.approveMusicSpeedUp(id, q.id)).rejects.toThrow(/quote/);
    const next = await api.quoteMusicSpeedUp(id); await api.approveMusicSpeedUp(id, next.id);
    await expect(api.approveMusicSpeedUp(id, next.id)).rejects.toThrow(/quote/);
    expect(readMusicFees(id)?.mode).toBe('economy');
  });
  it('activates additional budget only after verified success; receipts account for it exactly once', async () => {
    const q = await api.quoteMusicSpeedUp(id); expect(BigInt(q.additional)).toBeGreaterThan(0n);
    await api.approveMusicSpeedUp(id, q.id);
    expect(readMusicFees(id)?.mode).toBe('economy');
    const txid = 'a'.repeat(64);
    await api.recordMusicTopUp(id, q.id, txid);
    expect(readMusicFees(id)?.mode).toBe('economy');
    chain.txDetails.set('0x' + txid, { tx_id: '0x' + txid, tx_status: 'success', canonical: true, block_height: 1001, nonce: 1,
      tx_type: 'token_transfer', sender_address: PAYER, token_transfer: { recipient_address: DEPOSIT, amount: q.additional } });
    await api.getJob(id); await api.getJob(id);
    const s = readMusicFees(id)!;
    expect(s.mode).toBe('standard'); expect(s.extraReceived).toBe(q.additional); expect(s.service).toBe(q.service);
    expect(BigInt(s.approvedTotal)).toBe(1530000n + BigInt(q.additional));
    expect(agent.receivedForJob(job())).toBe(1530000n + BigInt(q.additional));
  });
  it('rejects old, wrong-sender, wrong-amount, wrong-recipient and noncanonical transfers', () => {
    const q: any = { sender: PAYER, additional: '1000', minNonce: 8, minBlockHeight: 1001 };
    const tx: any = { tx_status: 'success', canonical: true, block_height: 1001, nonce: 8, tx_type: 'token_transfer', sender_address: PAYER,
      token_transfer: { recipient_address: DEPOSIT, amount: '1000' } };
    expect(verifyMusicTopUp(tx, job(), q)).toBe(true);
    for (const bad of [{ block_height: 1000 }, { nonce: 7 }, { sender_address: OTHER }, { token_transfer: { recipient_address: OTHER, amount: '1000' } }, { token_transfer: { recipient_address: DEPOSIT, amount: '1001' } }]) {
      expect(() => verifyMusicTopUp({ ...tx, ...bad }, job(), q)).toThrow(/does not match/);
    }
    for (const bad of [{ canonical: false }, { tx_status: 'pending' }, { is_unanchored: true }, { microblock_canonical: false }]) {
      expect(verifyMusicTopUp({ ...tx, ...bad }, job(), q)).toBe(false);
    }
  });
  it('replaces the original nonce after upgrade and stays within the approved budget', async () => {
    chain.minFeeToConfirm = 999999n;
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow(/Waiting/);
    chain.balances.set(DEPOSIT, 5000000n);
    const q = await api.quoteMusicSpeedUp(id); await api.approveMusicSpeedUp(id, q.id);
    vi.setSystemTime(Date.now() + 100000); chain.minFeeToConfirm = 0n;
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow(/Waiting/);
    expect(chain.broadcasts).toHaveLength(2); expect(chain.broadcastNonces).toEqual([1n, 1n]);
    expect(chain.broadcasts[1]).toBeGreaterThan(chain.broadcasts[0]);
    const p = readMusicFees(id)!.pending!;
    chain.txStatus.set('0x' + p.ids[0], 'pending');
    await agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id);
    expect(readMusicFees(id)?.spent).toBe(String(chain.broadcasts[1]));
  });
  it('cannot cancel, discard or start another payment while a transaction is pending', async () => {
    chain.minFeeToConfirm = 999999n;
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow();
    expect((await api.cancelJob(id)).error).toMatch(/pending/);
    expect((await api.discardCheck(id)).safe).toBe(false);
    await expect(api.discardJob(id, '')).rejects.toThrow(/Pending/);
    const q = await api.quoteMusicSpeedUp(id); await api.approveMusicSpeedUp(id, q.id);
    expect((await api.quoteMusicSpeedUp(id)).id).toBe(q.id);
    await expect(api.approveMusicSpeedUp(id, q.id)).rejects.toThrow();
  });
  it('keeps Economy active when the wallet explicitly rejects a top-up', async () => {
    const q = await api.quoteMusicSpeedUp(id); await api.approveMusicSpeedUp(id, q.id);
    await api.dismissMusicTopUp(id, q.id);
    expect(readMusicFees(id)?.upgrade).toBeUndefined(); expect(readMusicFees(id)?.mode).toBe('economy');
  });
  it('completes a staged upload in init → batches → seal order within the Economy reserve', async () => {
    const originalFetch = globalThis.fetch;
    const calls: string[] = [];
    globalThis.fetch = vi.fn(async (input: any, init?: any) => {
      const response = await originalFetch(input, init);
      if (String(input).endsWith('/v2/transactions') && init?.body) {
        const tx: any = deserializeTransaction(init.body); const fn = tx.payload.functionName.content;
        calls.push(fn); const hash = Buffer.from(tx.payload.functionArgs[0].buffer).toString('hex');
        const key = hash + ':' + DEPOSIT;
        if (fn === 'begin-or-get') chain.uploads.set(key, 0);
        if (fn === 'add-chunk-batch') chain.uploads.set(key, (chain.uploads.get(key) || 0) + tx.payload.functionArgs[1].list.length);
        if (fn.startsWith('seal-')) chain.txDetails.set('0x' + tx.txid(), { tx_status: 'success', canonical: true, tx_result: { repr: '(ok u42)' } });
        const fee = BigInt(tx.auth.spendingCondition.fee);
        chain.balances.set(DEPOSIT, chain.balances.get(DEPOSIT)! - fee - (fn === 'add-chunk-batch' ? 0n : 1000n));
      }
      return response;
    });
    changeJob({ mime: 'audio/ogg', uri: 'xtrata:test' });
    const token = await agent.stagedInscribe(job(), KEY, DEPOSIT, new Uint8Array(1048576), () => {});
    expect(token).toBe('42'); expect(chain.broadcastNonces).toEqual([1n, 2n, 3n, 4n]); expect(calls).toEqual(['begin-or-get', 'add-chunk-batch', 'add-chunk-batch', 'seal-inscription']);
    const s = readMusicFees(id)!;
    expect(s.remainingWeight).toBe('0'); expect(s.protocolSpent).toBe('2000');
    expect(BigInt(s.spent)).toBeLessThanOrEqual(BigInt(s.networkBudget));
    expect(chain.balances.get(DEPOSIT)).toBeGreaterThan(BigInt(s.service) + 200000n);
    globalThis.fetch = originalFetch;
  });
  it('refuses a lost fee-control record instead of falling back to Standard spending', async () => {
    changeJob({ feePolicy: 'music-v1' }); localStorage.removeItem('xao:music-fees:' + id);
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow(/record is missing/);
    expect(chain.broadcasts).toHaveLength(0);
  });
  it('allows correction of a proven wrong payment ID and resumes Economy after an on-chain failed top-up', async () => {
    const q = await api.quoteMusicSpeedUp(id); await api.approveMusicSpeedUp(id, q.id);
    const wrong = 'b'.repeat(64);
    chain.txDetails.set('0x' + wrong, { tx_id: '0x' + wrong, tx_status: 'success', canonical: true, block_height: 1001, nonce: 1,
      tx_type: 'token_transfer', sender_address: OTHER, token_transfer: { recipient_address: DEPOSIT, amount: q.additional } });
    await api.recordMusicTopUp(id, q.id, wrong);
    expect(readMusicFees(id)?.upgrade?.txid).toBeUndefined(); expect(readMusicFees(id)?.mode).toBe('economy');
    const failed = 'c'.repeat(64);
    chain.txDetails.set('0x' + failed, { tx_id: '0x' + failed, tx_status: 'abort_by_response', canonical: true });
    await api.recordMusicTopUp(id, q.id, failed);
    expect(readMusicFees(id)?.upgrade?.state).toBe('failed'); expect(readMusicFees(id)?.extraReceived).toBe('0');
    expect((await api.quoteMusicSpeedUp(id)).id).not.toBe(q.id);
  });
  it('protects later transactions even if there is a large live balance', () => {
    const s = readMusicFees(id)!;
    const cap = musicTransactionCap(s, 500000n, 500000);
    expect(cap).toBe(500000n);
    s.spent = '1000000';
    expect(musicTransactionCap(s, 500000n, 500000)).toBeLessThan(100000n);
  });
  it('refuses new transactions when a staged upload has expired or expiry cannot be read', async () => {
    changeJob({ uploadHash: '00'.repeat(32) }); chain.uploads.set('00'.repeat(32) + ':' + DEPOSIT, 1);
    chain.stacksHeight = 5320;
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow(/expiry/);
    expect(chain.broadcasts).toHaveLength(0);
    chain.fail('/v2/info', 503);
    await expect(agent.send(KEY, DEPOSIT, 'add-chunk-batch', args(), null, undefined, id)).rejects.toThrow(/expiry/);
    expect(readMusicFees(id)?.expiryUnknown).toBe(true);
  });
});
