import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { FakeChain, loadAgent, unloadAgent, PAYER } from './support/fake-chain';
import { jobKey } from '../unfinished';
import { XTRATA_FEE_ADDRESS } from '../referral';

/**
 * A delivery interrupted by a closed tab (job-1794301042013, 10 Nov 2026): the inscription had reached the
 * user, the page died before the wizard fee and the change sweep, and the job sat at DELIVERING for ever —
 * the watcher never resumed it and nothing on the card could. These pin the self-healing path.
 */
const agentSource = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');
const ELSEWHERE = 'SP8H248H248H248H248H248H248H248H24ARTQ82';   // throwaway valid address

let chain: FakeChain, agent: any, api: any;
let heldLocks: string[] = [];
beforeEach(async () => {
  chain = new FakeChain(); chain.realTxIds = true; chain.ledger = true;
  agent = await loadAgent(chain); api = (window as any).XtrataAgent;
  heldLocks = [];
  Object.defineProperty(navigator, 'locks', { configurable: true, value: {
    request: async (_n: string, o: any, cb: any) => (cb || o)({}),
    query: async () => ({ held: heldLocks.map((name) => ({ name })), pending: [] })
  } });
});
afterEach(() => { vi.restoreAllMocks(); unloadAgent(); });

const bytes = (n: number, v: number) => ({ name: `f${v}.ogg`, arrayBuffer: async () => new Uint8Array(n).fill(v).buffer });
const stored = (id: string) => JSON.parse(localStorage.getItem(jobKey(id))!);
const save = (j: any) => localStorage.setItem(jobKey(j.jobId), JSON.stringify(j));
async function settle<T>(p: Promise<T>, step = 2000): Promise<T> {
  let done = false; let out: any; let err: any;
  p.then((v) => { done = true; out = v; }, (e) => { done = true; err = e; });
  for (let i = 0; i < 400 && !done; i += 1) await vi.advanceTimersByTimeAsync(step);
  if (!done) throw new Error('did not settle');
  if (err) throw err; return out;
}

/** A funded job, inscribed as #77, stuck at DELIVERING with nothing running it. `where` = who holds #77 now. */
async function orphanedDelivery(o: { where?: 'deposit' | 'payer' | 'elsewhere'; batch?: boolean } = {}) {
  const base = { fastTrack: true, origin: 'music', receipt: false, expectedFunder: PAYER, user: PAYER };
  const created = o.batch
    ? await api.createJob({ ...base, items: [{ file: bytes(900, 1), uri: 'xtrata:a', mime: 'audio/ogg' }, { file: bytes(1700, 2), uri: 'xtrata:b', mime: 'audio/ogg' }] })
    : await api.createJob({ ...base, file: bytes(1200, 3), uri: 'xtrata:s', mime: 'audio/ogg' });
  const j = stored(created.jobId);
  const required = BigInt(j.requiredUstx);
  const spent = BigInt(j.protocolFee || j.sumProtocol || '0') + 150000n;
  chain.fund(j.depositAddress, required - spent, PAYER);
  chain.balances.set(PAYER, 0n);
  const holder = o.where === 'payer' ? PAYER : o.where === 'elsewhere' ? ELSEWHERE : j.depositAddress;
  Object.assign(j, { status: 'DELIVERING', funder: PAYER, depositReceivedUstx: required.toString(), fundedAt: new Date().toISOString(),
    tokenId: '77', progress: 'sending your inscription to your wallet', progressAt: new Date(Date.now() - 60 * 60_000).toISOString() });
  if (o.batch) j.items.forEach((it: any, i: number) => { it.tokenId = String(77 + i); it.status = 'INSCRIBED'; chain.owners.set(it.tokenId, j.depositAddress); });
  chain.owners.set('77', holder);
  chain.index.set(holder, ['77']);
  save(j);
  return { id: j.jobId, dep: j.depositAddress as string, fee: (required * 10n) / 100n };
}
const resume = async (id: string) => { await agent.watchTick(); return settle(agent.deliver(stored(id))); };

describe('an interrupted delivery heals itself', () => {
  it('the inscription already reached the user (the 10 Nov case): no second transfer, fee once, change home, key wiped', async () => {
    const s = await orphanedDelivery({ where: 'payer' });
    await agent.watchTick();
    const mid = stored(s.id);
    expect(mid.status).toBe('INSCRIBED');
    expect(mid.deliveryResumed).toBe(true);
    await settle(agent.deliver(mid));
    const j = stored(s.id);
    expect(j.status).toBe('COMPLETE');
    expect(j.inscriptionDelivered).toBe(true);
    expect(chain.nftTransfers.filter((t) => t.id === '77')).toHaveLength(0);          // never re-sent
    expect(chain.stxTransfers.filter((t) => t.to === XTRATA_FEE_ADDRESS)).toHaveLength(1);
    expect(chain.stxTransfers.find((t) => t.to === PAYER)!.amount).toBeGreaterThan(0n);
    expect(chain.balances.get(s.dep) ?? 0n).toBe(0n);
    expect(j.ephemeralMnemonic).toBeUndefined();
  });

  it('the transfer never went out: it is sent exactly once', async () => {
    const s = await orphanedDelivery({ where: 'deposit' });
    await resume(s.id);
    expect(chain.nftTransfers.filter((t) => t.id === '77')).toHaveLength(1);
    expect(chain.owners.get('77')).toBe(PAYER);
    expect(stored(s.id).status).toBe('COMPLETE');
  });

  it('a transfer still queued from the dead run: nothing is sent until it clears', async () => {
    const s = await orphanedDelivery({ where: 'deposit' });
    chain.pending = [{ nonce: 3, fee: 20000, kind: 'transfer' }];
    await agent.watchTick();
    await expect(settle(agent.deliver(stored(s.id)))).rejects.toThrow(/still pending/);
    expect(chain.nftTransfers).toHaveLength(0);
    expect(chain.stxTransfers).toHaveLength(0);
  });

  it('the wizard fee already paid by the dead run is found and not paid again', async () => {
    const s = await orphanedDelivery({ where: 'payer' });
    const j0 = stored(s.id);
    j0.agentFeeIntent = { to: XTRATA_FEE_ADDRESS, amountUstx: s.fee.toString(), at: new Date().toISOString() };
    save(j0);
    chain.stxTransfers.push({ txid: 'feefeefee', from: s.dep, to: XTRATA_FEE_ADDRESS, amount: s.fee, memo: '', fee: 20000n });
    chain.balances.set(s.dep, (chain.balances.get(s.dep) ?? 0n) - s.fee - 20000n);
    await resume(s.id);
    expect(chain.stxTransfers.filter((t) => t.to === XTRATA_FEE_ADDRESS)).toHaveLength(1);
    expect(stored(s.id).agentFeeTx).toBe('feefeefee');
    expect(stored(s.id).status).toBe('COMPLETE');
  });

  it('the inscription is somewhere it should never be: stop, spend nothing on it', async () => {
    const s = await orphanedDelivery({ where: 'elsewhere' });
    await agent.watchTick();
    await expect(settle(agent.deliver(stored(s.id)))).rejects.toThrow(/unrecoverable/);
    expect(chain.nftTransfers).toHaveLength(0);
    expect(stored(s.id).status).not.toBe('COMPLETE');
  });

  it('another tab holds the delivery lock: the watcher leaves the job alone', async () => {
    const s = await orphanedDelivery({ where: 'payer' });
    heldLocks = [`xao-deliver:${s.id}`];
    await agent.watchTick();
    expect(stored(s.id).status).toBe('DELIVERING');
    expect(stored(s.id).deliveryResumed).toBeUndefined();
  });

  it('without Web Locks a recently active delivery is not taken over', async () => {
    Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
    const s = await orphanedDelivery({ where: 'payer' });
    const j = stored(s.id); j.progressAt = new Date().toISOString(); save(j);
    await agent.watchTick();
    expect(stored(s.id).status).toBe('DELIVERING');
  });

  it('a batch delivery is parked with the Recover button rather than re-run', async () => {
    const s = await orphanedDelivery({ batch: true });
    await agent.watchTick();
    const j = stored(s.id);
    expect(j.status).toBe('NEEDS_RECOVERY');
    expect(j.keepKey).toBe(true);
    expect(j.ephemeralMnemonic).toBeTruthy();
  });

  it('the reaper never refund-cancels a job mid-delivery', () => {
    const reap = agentSource.slice(agentSource.indexOf('async function reapTick'), agentSource.indexOf('async function reapTick') + 1500);
    expect(reap).toContain("if (j.status === 'DELIVERING') continue;");
  });
});
