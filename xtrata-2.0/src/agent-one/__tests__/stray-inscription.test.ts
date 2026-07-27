import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DEPOSIT, FakeChain, OTHER, PAYER, loadAgent, unloadAgent } from './support/fake-chain';

/**
 * The live failure this file exists for:
 *
 *   ⚠ Inscription #2887 arrived but was not declared as a parent —
 *     everything will be returned to the sender automatically.
 *
 * The declared parent was #2878. #2887 was a digit transposition. The job was
 * 416/459 chunks in and ~35 minutes deep, and the stray refunded it — forfeiting
 * the miner fees already spent on thirteen batches.
 *
 * A stray cannot threaten the mint: only `job.parents` is ever passed to it. The
 * abort was a safety rule aimed at the wrong risk. It must now be returned to
 * whoever sent it while the job carries on.
 */

let chain: FakeChain;
let agent: any;

beforeEach(async () => {
  chain = new FakeChain();
  agent = await loadAgent(chain);
});
afterEach(() => unloadAgent());

const REQUIRED = 2_000_000n;

const job = (overrides: any = {}) => ({
  jobId: 'job-stray',
  depositAddress: DEPOSIT,
  requiredUstx: String(REQUIRED),
  parents: ['2878'],
  user: PAYER,
  status: 'AWAITING_DEPOSIT',
  ephemeralMnemonic: null,
  ...overrides
});

describe('a stray inscription must not void the job', () => {
  it('does not cancel when a stray arrives and a parent is still awaited', async () => {
    chain.fund(DEPOSIT, REQUIRED);
    chain.owners.set('2878', PAYER);              // declared parent: not sent yet
    chain.owners.set('2887', OTHER);
    chain.transfer('2887', DEPOSIT);              // the transposed id, sent by mistake

    const j = job();
    const out = await agent.autoRun(j);

    // Shipped behaviour: { rejected: true, unexpected: ['2887'] } and a refund.
    expect(out.rejected).toBeUndefined();
    expect(out.awaitingParent).toBe(true);
    expect(out.missing).toEqual(['2878']);
    expect(j.status).toBe('AWAITING_PARENT');
    expect(j.cancelReason).toBeUndefined();
  });

  it('proceeds to inscribe when the declared parent is held and a stray is also present', async () => {
    chain.fund(DEPOSIT, REQUIRED);
    chain.owners.set('2878', PAYER);
    chain.transfer('2878', DEPOSIT);              // declared parent has arrived
    chain.owners.set('2887', OTHER);
    chain.transfer('2887', DEPOSIT);              // stray alongside it

    const j = job();
    // Gets past the gate and on to the mint, which this harness does not stand up —
    // reaching a mint failure IS the pass condition; being refunded is the regression.
    await agent.autoRun(j).catch(() => {});

    expect(j.status).not.toBe('CANCELLED');
    expect(j.cancelReason).toBeUndefined();
    expect(j.status === 'INSCRIBING' || j.status === 'DELIVERING').toBe(true);
  });

  it('reports the job as mintable even while holding a stray', async () => {
    chain.owners.set('2878', DEPOSIT);
    chain.index.set(DEPOSIT, ['2878', '2887']);
    const status = await agent.parentsStatus(job());
    expect(status.unexpected).toEqual(['2887']);
    expect(status.missing).toEqual([]);
    expect(status.ok).toBe(true);
  });
});

describe('the stray goes back to whoever sent it', () => {
  it('returns it to the sender the transfer history names', async () => {
    chain.owners.set('2887', OTHER);
    chain.transfer('2887', DEPOSIT);
    chain.fund(DEPOSIT, 1_000_000n);
    const { key, address } = agent.deriveFrom(agent.newWallet().mnemonic);
    chain.owners.set('2887', address);            // the stray sits in the deposit wallet
    chain.nftHistory.set('2887', [{ sender: OTHER, recipient: address }]);

    const j = job({ jobId: 'job-return' });
    const out = await agent.returnStrays(j, key, address, ['2887']);

    expect(out).toHaveLength(1);
    expect(out[0].to).toBe(OTHER);
    expect(out[0].tx).toBeTruthy();
    expect(j.strayReturns).toHaveLength(1);
  });

  it('never throws when the return cannot be made — recovery picks it up', async () => {
    const { key, address } = agent.deriveFrom(agent.newWallet().mnemonic);
    chain.owners.set('2887', address);
    chain.nftHistory.set('2887', [{ sender: OTHER, recipient: address }]);
    chain.fail('/v2/contracts/call-read/', 503);   // cannot even confirm we hold it

    const j = job({ jobId: 'job-return-fail' });
    const out = await agent.returnStrays(j, key, address, ['2887']);

    expect(out[0].error).toBeTruthy();
    expect(out[0].tx).toBeUndefined();
  });

  it('skips a token the deposit wallet no longer owns', async () => {
    const { key, address } = agent.deriveFrom(agent.newWallet().mnemonic);
    chain.owners.set('2887', OTHER);               // already gone home
    const j = job({ jobId: 'job-return-moved' });
    expect(await agent.returnStrays(j, key, address, ['2887'])).toEqual([]);
  });
});
