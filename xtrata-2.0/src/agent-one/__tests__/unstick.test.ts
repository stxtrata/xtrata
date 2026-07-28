import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FakeChain, PAYER, loadAgent, unloadAgent } from './support/fake-chain';

/**
 * Unsticking a jammed wallet, tested against the rule that actually broke it.
 *
 * Nonces execute in order, so one transaction the miners will not take freezes every
 * transaction behind it. The fix is replace-by-fee: same nonce, a fee that will be
 * mined. The first implementation cancelled each nonce with a 1 uSTX transfer to the
 * wallet ITSELF — and mainnet rejects that outright with
 * TransferRecipientCannotEqualSender, so not one replacement ever reached the mempool
 * while the UI reported the attempt as made.
 *
 * The fake node now enforces that rule, so this can never pass by accident again.
 */

let chain: FakeChain;
let agent: any;
const api = () => (globalThis as any).window.XtrataAgent;

beforeEach(async () => {
  chain = new FakeChain();
  agent = await loadAgent(chain);
});
afterEach(() => unloadAgent());

const seedJammedJob = () => {
  const { mnemonic } = agent.newWallet();
  const dep = agent.deriveFrom(mnemonic);
  chain.selfTransferAddress = dep.address;          // the node's self-transfer rule
  chain.fund(dep.address, 9_725_513n, PAYER);       // funded by PAYER, so refunds resolve
  chain.lastExecutedNonce = 23;                     // no hole: 24 is genuinely next
  chain.pending = [
    { nonce: 24, fee: 604, kind: 'transfer', sinceIso: new Date(Date.now() - 23 * 3600_000).toISOString() },
    { nonce: 25, fee: 389, kind: 'transfer', sinceIso: new Date(Date.now() - 22 * 3600_000).toISOString() }
  ];
  localStorage.setItem('xao-job-jam', JSON.stringify({
    jobId: 'jam', status: 'NEEDS_RECOVERY', depositAddress: dep.address,
    ephemeralMnemonic: mnemonic, user: PAYER, funder: PAYER, requiredUstx: '17740000'
  }));
  return dep;
};

describe('seeing the jam', () => {
  it('reports every pending transaction with its fee and age', async () => {
    seedJammedJob();
    const st = await api().stuckStatus('jam');
    expect(st.stuck).toBe(true);
    expect(st.pending.map((p: any) => p.nonce)).toEqual(['24', '25']);
    expect(st.pending[0].fee).toBe('604');
    expect(Math.round(st.oldestAgeMs / 3600_000)).toBe(23);
  });

  it('says UNKNOWN rather than "clear" when the mempool cannot be read', async () => {
    seedJammedJob();
    chain.fail('/mempool', 429);
    const st = await api().stuckStatus('jam');
    expect(st.unknown).toBe(true);
    expect(st.stuck).toBe(false);     // but flagged unknown, so the UI does not claim health
  });
});

describe('clearing the jam', () => {
  it('never sends the replacement to the wallet itself', async () => {
    // THE regression. A self-transfer is refused by the node, so every replacement
    // failed while the log claimed each one had been attempted.
    const dep = seedJammedJob();
    await api().unstickJob('jam');
    expect(chain.transferRecipients.length).toBeGreaterThan(0);
    expect(chain.transferRecipients).not.toContain(dep.address);
  });

  it('sends it to the payer, which is where a refund would go anyway', async () => {
    seedJammedJob();
    await api().unstickJob('jam');
    expect(new Set(chain.transferRecipients)).toEqual(new Set([PAYER]));
  });

  it('reuses the stuck nonce — a new nonce would just join the queue', async () => {
    seedJammedJob();
    await api().unstickJob('jam');
    expect(chain.broadcastNonces.map(String)).toEqual(['24', '25']);
  });

  it('pays enough to actually be mined', async () => {
    seedJammedJob();
    await api().unstickJob('jam');
    // Each replacement must beat both the stuck fee and the floor by a clear margin;
    // a marginally higher fee is just another stuck transaction.
    for (const fee of chain.broadcasts) expect(fee).toBeGreaterThanOrEqual(40000n);
  });

  it('reports the reason when the node refuses, instead of claiming success', async () => {
    const dep = seedJammedJob();
    chain.rejectAllBroadcasts = 'TransferRecipientCannotEqualSender';
    const out = await api().unstickJob('jam');
    expect(out.replaced.every((r: any) => r.error)).toBe(true);
    expect(JSON.stringify(out.replaced)).toContain('TransferRecipientCannotEqualSender');
    const job = JSON.parse(localStorage.getItem('xao-job-jam') as string);
    expect(job.unstickError).toContain('TransferRecipientCannotEqualSender');
    expect(job.progress).toMatch(/could not replace/i);
    expect(dep.address).toBeTruthy();
  });

  it('refuses when there is no payer to send to', async () => {
    const { mnemonic } = agent.newWallet();
    localStorage.setItem('xao-job-jam', JSON.stringify({
      jobId: 'jam', status: 'NEEDS_RECOVERY', ephemeralMnemonic: mnemonic,
      depositAddress: agent.deriveFrom(mnemonic).address
    }));
    await expect(api().unstickJob('jam')).rejects.toThrow(/nowhere safe to send/i);
  });

  it('fills a nonce the chain is waiting for but nothing occupies', async () => {
    // The mempool garbage-collects old transactions. When the ones holding the LOW
    // nonces age out, everything above them is stranded for ever — correctly priced
    // and unmineable, because nonces execute in order. Replacing the visible queue
    // cannot fix it: the hole is beneath the queue.
    seedJammedJob();
    chain.lastExecutedNonce = 20;                   // chain wants 21; 21-23 have aged out
    const st = await api().stuckStatus('jam');
    expect(st.missingNonces).toEqual(['21', '22', '23']);

    const out = await api().unstickJob('jam');
    const filled = out.replaced.filter((r: any) => r.filledGap).map((r: any) => r.nonce);
    expect(filled).toEqual(['21', '22', '23']);
    // and the gap is filled BEFORE the queue is replaced, or the queue stays stuck
    expect(chain.broadcastNonces.map(String)).toEqual(['21', '22', '23', '24', '25']);
  });

  it('does NOT invent a gap when the mempool is simply empty', async () => {
    // last_executed 20 with nothing queued is a healthy wallet: the next transaction
    // just takes nonce 21. A "gap" only matters when something is queued ABOVE it and
    // therefore waiting on it.
    seedJammedJob();
    chain.pending = [];
    chain.lastExecutedNonce = 20;
    const st = await api().stuckStatus('jam');
    expect(st.missingNonces).toEqual([]);
    expect(st.stuck).toBe(false);
  });

  it('says so plainly when nothing is stuck', async () => {
    seedJammedJob();
    chain.pending = [];
    chain.lastExecutedNonce = 23;
    const out = await api().unstickJob('jam');
    expect(out.alreadyClear).toBe(true);
    expect(chain.broadcasts).toEqual([]);
  });
});
