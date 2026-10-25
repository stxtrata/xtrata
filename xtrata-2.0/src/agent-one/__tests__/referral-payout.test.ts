import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeChain, loadAgent, unloadAgent, PAYER } from './support/fake-chain';
import { jobKey } from '../unfinished';
import { clearReferralRegistryCache, REGISTRY_PATH } from '../referral-registry';
import { XTRATA_FEE_ADDRESS } from '../referral';

// Throwaway valid addresses (nobody's wallets).
const PARTNER = 'SP8H248H248H248H248H248H248H248H24ARTQ82';
const SLUG = 'fak-fun';
const MEMO = 'xtrata-ref:' + SLUG;
const FEE_FLOOR = 20000n;

let chain: FakeChain, agent: any, api: any;
let partnerEntry: any;
let regOverride: any = null;

beforeEach(async () => {
  chain = new FakeChain(); chain.realTxIds = true; chain.ledger = true;
  agent = await loadAgent(chain); api = (window as any).XtrataAgent;
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request: async (_n: string, o: any, cb: any) => (cb || o)({}) } });
  partnerEntry = { slug: SLUG, name: 'fak.fun', payoutAddress: PARTNER, active: true, share: 0.5 };
  regOverride = null; clearReferralRegistryCache();
  const inner = (globalThis as any).fetch;
  (globalThis as any).fetch = vi.fn(async (input: any, init?: any) => {
    if (String(input).endsWith(REGISTRY_PATH)) return new Response(JSON.stringify(regOverride ?? { version: 1, partners: [partnerEntry] }));
    return inner(input, init);
  });
});
afterEach(() => { vi.restoreAllMocks(); unloadAgent(); });

const bytes = (n: number, v: number) => ({ name: `f${v}.ogg`, arrayBuffer: async () => new Uint8Array(n).fill(v).buffer });
const stored = (id: string) => JSON.parse(localStorage.getItem(jobKey(id))!);
const save = (j: any) => localStorage.setItem(jobKey(j.jobId), JSON.stringify(j));
/** Drive an async agent call to completion under the harness's fake timers. */
async function settle<T>(p: Promise<T>, step = 2000): Promise<T> {
  let done = false; let out: any; let err: any;
  p.then((v) => { done = true; out = v; }, (e) => { done = true; err = e; });
  for (let i = 0; i < 400 && !done; i += 1) await vi.advanceTimersByTimeAsync(step);
  if (!done) throw new Error('did not settle');
  if (err) throw err; return out;
}

type Opts = { referral?: string; payer?: string; batch?: boolean; receipt?: boolean; feeMode?: string; parents?: string[] };
/** A funded, inscribed job whose delivery has not started: the deposit holds what is left after minting. */
async function inscribedJob(o: Opts = {}) {
  const payer = o.payer ?? PAYER;
  const base = { fastTrack: true, origin: 'music', receipt: o.receipt ?? false, expectedFunder: payer, user: payer, feeMode: o.feeMode, referral: o.referral, parents: o.parents };
  const created = o.batch
    ? await api.createJob({ ...base, items: [{ file: bytes(900, 1), uri: 'xtrata:a', mime: 'audio/ogg' }, { file: bytes(1700, 2), uri: 'xtrata:b', mime: 'audio/ogg' }] })
    : await api.createJob({ ...base, file: bytes(1200, 3), uri: 'xtrata:s', mime: 'audio/ogg' });
  const j = stored(created.jobId);
  const required = BigInt(j.requiredUstx);
  const spent = BigInt(j.protocolFee || j.sumProtocol || '0') + 150000n;    // protocol + some mining already paid
  chain.fund(j.depositAddress, required - spent, payer);
  chain.balances.set(payer, 0n);
  Object.assign(j, { status: 'DELIVERING', funder: payer, depositReceivedUstx: required.toString(), fundedAt: new Date().toISOString() });
  if (o.batch) j.tokenId = '70';
  if (o.batch) j.items.forEach((it: any, i: number) => { it.tokenId = String(70 + i); it.status = 'INSCRIBED'; chain.owners.set(it.tokenId, j.depositAddress); chain.index.set(j.depositAddress, [...(chain.index.get(j.depositAddress) ?? []), it.tokenId]); });
  else { j.tokenId = '77'; chain.owners.set('77', j.depositAddress); chain.index.set(j.depositAddress, ['77']); }
  save(j);
  return { id: j.jobId, dep: j.depositAddress as string, required, payer, fee: (required * 10n) / 100n };
}
const run = async (id: string) => settle(agent.deliver(stored(id)));
const feeTransfers = () => chain.stxTransfers.filter((t) => t.to === XTRATA_FEE_ADDRESS || t.to === PARTNER);

describe('referred payout: where the money goes', () => {
  it('single: partner first with the memo, Xtrata the remainder, change to the payer', async () => {
    const s = await inscribedJob({ referral: SLUG });
    await run(s.id);
    const t = chain.stxTransfers.filter((x) => x.from === s.dep);
    const partner = s.fee / 2n;
    expect(t.map((x) => [x.to, x.amount, x.memo])).toEqual([
      [PARTNER, partner, MEMO],
      [XTRATA_FEE_ADDRESS, s.fee - partner, ''],
      [s.payer, t[2].amount, ''],
    ]);
    expect(partner + (s.fee - partner)).toBe(s.fee);
    const j = stored(s.id);
    expect(j.status).toBe('COMPLETE'); expect('0x' + j.referralTx).toBe(t[0].txid); expect(j.referralPaidUstx).toBe(partner.toString());
    expect(j.referralOwed).toBeUndefined();
    expect(j.ephemeralMnemonic).toBeUndefined();
    expect(chain.balances.get(s.dep) ?? 0n).toBe(0n);
    expect(chain.balances.get(s.payer)).toBe(t[2].amount);
    expect(chain.owners.get('77')).toBe(s.payer);
  });
  it('batch: same split, once per job (not per item)', async () => {
    const s = await inscribedJob({ referral: SLUG, batch: true });
    await run(s.id);
    const t = chain.stxTransfers.filter((x) => x.from === s.dep);
    expect(t.filter((x) => x.to === PARTNER)).toHaveLength(1);
    expect(t.filter((x) => x.to === XTRATA_FEE_ADDRESS)).toHaveLength(1);
    expect(t.find((x) => x.to === PARTNER)).toMatchObject({ amount: s.fee / 2n, memo: MEMO });
    expect(t.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee - s.fee / 2n);
    expect(stored(s.id).status).toBe('COMPLETE');
    expect(chain.balances.get(s.dep) ?? 0n).toBe(0n);
  });
  it('conserves every microSTX: whatever leaves the system is exactly the network fees; nothing is left in the wallet', async () => {
    const total = () => [...chain.balances.values()].reduce((x, y) => x + y, 0n);
    for (const batch of [false, true]) {
      for (const ref of [undefined, SLUG]) {
        const s = await inscribedJob({ referral: ref, batch });
        const start = total(); const fees0 = chain.feesPaid;
        await run(s.id);
        expect(start - total()).toBe(chain.feesPaid - fees0);
        expect(chain.balances.get(s.dep) ?? 0n).toBe(0n);
        expect(stored(s.id).ephemeralMnemonic).toBeUndefined();
      }
    }
  });
  it('partner + Xtrata + rebate always equals the fee (odd amounts)', async () => {
    for (const share of [0.3333, 0.5, 0.7, 0.9999, 1, 0.0001]) {
      chain = chain; chain.stxTransfers.length = 0; clearReferralRegistryCache(); partnerEntry.share = share;
      const s = await inscribedJob({ referral: SLUG });
      await run(s.id);
      const t = chain.stxTransfers.filter((x) => x.from === s.dep);
      const p = t.filter((x) => x.to === PARTNER).reduce((a, x) => a + x.amount, 0n);
      const x = t.filter((x2) => x2.to === XTRATA_FEE_ADDRESS).reduce((a, y) => a + y.amount, 0n);
      expect(p + x).toBe(s.fee);
      chain.balances.set(PARTNER, 0n); chain.balances.set(XTRATA_FEE_ADDRESS, 0n);
    }
  });
});

describe('regression and price', () => {
  it('an unreferred job pays exactly the old way: one memo-less transfer of the whole fee to Xtrata', async () => {
    const s = await inscribedJob();
    await run(s.id);
    const t = chain.stxTransfers.filter((x) => x.from === s.dep);
    expect(t.map((x) => [x.to, x.memo])).toEqual([[XTRATA_FEE_ADDRESS, ''], [s.payer, '']]);
    expect(t[0].amount).toBe(s.fee);
    const j = stored(s.id);
    for (const k of ['referral', 'referralTx', 'referralIntent', 'referralOwed', 'referralSplit']) expect(k in j).toBe(false);
  });
  it('the payer gets back exactly one transfer fee less on a referred job, and the quote is the same', async () => {
    const a = await inscribedJob(); await run(a.id); const changeA = chain.balances.get(a.payer)!;
    chain.balances.set(PARTNER, 0n); chain.balances.set(XTRATA_FEE_ADDRESS, 0n);
    const b = await inscribedJob({ referral: SLUG }); await run(b.id); const changeB = chain.balances.get(b.payer)!;
    expect(b.required).toBe(a.required);
    expect(changeA - changeB).toBe(FEE_FLOOR);
  });
  it('a referral on a non-music job is never paid', async () => {
    const s = await inscribedJob({ referral: SLUG });
    const j = stored(s.id); j.origin = 'wizard'; save(j);
    await run(s.id);
    expect(chain.stxTransfers.some((x) => x.to === PARTNER)).toBe(false);
    expect(chain.stxTransfers.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee);
  });
});

describe('self-referral and minimum payout', () => {
  it('payer is the partner and self-referral is on: no partner transfer, the rebate comes back as change', async () => {
    const plain = await inscribedJob(); await run(plain.id); const changePlain = chain.balances.get(plain.payer)!;
    chain.balances.set(XTRATA_FEE_ADDRESS, 0n); chain.stxTransfers.length = 0;
    const s = await inscribedJob({ referral: SLUG, payer: PARTNER });
    await run(s.id);
    const t = chain.stxTransfers.filter((x) => x.from === s.dep);
    expect(t.some((x) => x.to === PARTNER && x.memo === MEMO)).toBe(false);
    const rebate = s.fee / 2n;
    expect(t.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee - rebate);
    expect(stored(s.id).referralTx).toBeUndefined();
    expect(stored(s.id).referralRebateUstx).toBe(rebate.toString());
    expect(chain.balances.get(PARTNER)).toBe(changePlain + rebate);     // no extra transfer fee either
  });
  it('self-referral switched off: the partner is paid like anyone else', async () => {
    partnerEntry.selfReferral = false;
    const s = await inscribedJob({ referral: SLUG, payer: PARTNER });
    await run(s.id);
    expect(chain.stxTransfers.find((x) => x.to === PARTNER && x.memo === MEMO)!.amount).toBe(s.fee / 2n);
  });
  it('a partner share under the minimum is not sent; Xtrata keeps it', async () => {
    partnerEntry.minPayoutUstx = 100_000_000;     // 100 STX: far above any share
    const s = await inscribedJob({ referral: SLUG });
    await run(s.id);
    expect(chain.stxTransfers.some((x) => x.to === PARTNER)).toBe(false);
    expect(chain.stxTransfers.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee);
    expect(stored(s.id).referralOwed).toBeUndefined();
  });
});

describe('failure paths: the inscription is never affected', () => {
  it('a permanent partner failure: job complete, Xtrata gets the full fee, owed is recorded, wallet emptied', async () => {
    chain.rejectStxTo = PARTNER;
    const s = await inscribedJob({ referral: SLUG });
    await run(s.id);
    const j = stored(s.id);
    expect(j.status).toBe('COMPLETE'); expect(j.inscriptionDelivered).toBe(true);
    expect(chain.owners.get('77')).toBe(s.payer);
    expect(chain.stxTransfers.some((x) => x.to === PARTNER)).toBe(false);
    expect(chain.stxTransfers.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee);
    expect(j.referralOwed).toMatchObject({ slug: SLUG, address: PARTNER, amountUstx: (s.fee / 2n).toString() });
    expect(j.referralTx).toBeUndefined();
    expect(j.ephemeralMnemonic).toBeUndefined();
    expect(chain.balances.get(s.dep) ?? 0n).toBe(0n);
  });
  it('a transient rejection is retried and the partner is paid exactly once', async () => {
    chain.rejectStxTo = PARTNER; chain.rejectStxToTimes = 1; chain.rejectStxReason = 'TooMuchChaining';
    const s = await inscribedJob({ referral: SLUG });
    await run(s.id);
    expect(chain.stxTransfers.filter((x) => x.to === PARTNER)).toHaveLength(1);
    expect(stored(s.id).referralOwed).toBeUndefined();
    expect(stored(s.id).referralTx).toBeTruthy();
  });
  it('a failure does not touch the other leg: batch too', async () => {
    chain.rejectStxTo = PARTNER;
    const s = await inscribedJob({ referral: SLUG, batch: true });
    await run(s.id);
    const j = stored(s.id);
    expect(j.status).toBe('COMPLETE'); expect(j.referralOwed).toBeTruthy();
    expect(chain.stxTransfers.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee);
    expect(j.items.every((i: any) => chain.owners.get(i.tokenId) === s.payer)).toBe(true);
  });
});

describe('crash safety around the partner broadcast', () => {
  it('the intent is on the stored job BEFORE the transfer is broadcast, and the tx id is not yet', async () => {
    const s = await inscribedJob({ referral: SLUG });
    let seen: any = null;
    chain.onBroadcast = (info) => { if (info.memo === MEMO) seen = { ...stored(s.id) }; };
    await run(s.id);
    expect(seen.referralIntent).toMatchObject({ to: PARTNER, amountUstx: (s.fee / 2n).toString(), memo: MEMO });
    expect(seen.referralTx).toBeUndefined();
  });
  it('accepted but never confirmed in time: found on chain afterwards, adopted — paid once, no false "owed"', async () => {
    chain.hangConfirmFor = MEMO;
    const s = await inscribedJob({ referral: SLUG });
    await settle(agent.deliver(stored(s.id)), 6000);
    expect(chain.stxTransfers.filter((x) => x.to === PARTNER)).toHaveLength(1);
    const j = stored(s.id);
    expect(j.referralOwed).toBeUndefined(); expect(j.referralTx).toBe(chain.stxTransfers.find((x) => x.to === PARTNER)!.txid.replace(/^0x/, ''));
    expect(chain.stxTransfers.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee - s.fee / 2n);
  });
});

describe('re-entry: the partner is never paid twice', () => {
  it('a recorded referralTx is trusted: only the Xtrata remainder is sent', async () => {
    const s = await inscribedJob({ referral: SLUG });
    const j = stored(s.id); j.referralTx = '0xabc'; j.referralPaidUstx = (s.fee / 2n).toString(); j.referralIntent = { to: PARTNER }; save(j);
    await run(s.id);
    expect(chain.stxTransfers.some((x) => x.to === PARTNER)).toBe(false);
    expect(chain.stxTransfers.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee - s.fee / 2n);
  });
  it('intent recorded but no tx id, and the transfer is on chain: it is adopted, not repeated', async () => {
    const s = await inscribedJob({ referral: SLUG });
    const amt = s.fee / 2n;
    chain.stxTransfers.push({ txid: '0xfeed', from: s.dep, to: PARTNER, amount: amt, memo: MEMO, fee: FEE_FLOOR });
    chain.txStatus.set('0xfeed', 'success');
    const j = stored(s.id); j.referralIntent = { to: PARTNER, amountUstx: amt.toString() }; save(j);
    await run(s.id);
    expect(chain.stxTransfers.filter((x) => x.to === PARTNER)).toHaveLength(1);
    expect(stored(s.id).referralTx).toBe('feed');
    expect(chain.stxTransfers.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee - amt);
  });
  it('intent recorded, nothing on chain: it is sent now', async () => {
    const s = await inscribedJob({ referral: SLUG });
    const j = stored(s.id); j.referralIntent = { to: PARTNER }; save(j);
    await run(s.id);
    expect(chain.stxTransfers.filter((x) => x.to === PARTNER)).toHaveLength(1);
  });
  it('intent recorded and the lookup FAILS: not treated as "nothing there" — nothing is sent twice, owed is recorded, Xtrata is never over-asked', async () => {
    const s = await inscribedJob({ referral: SLUG });
    const j = stored(s.id); j.referralIntent = { to: PARTNER }; save(j);
    chain.fail(`/extended/v1/address/${s.dep}/mempool`, 500);
    await run(s.id);
    const t = chain.stxTransfers.filter((x) => x.from === s.dep);
    expect(t.some((x) => x.to === PARTNER)).toBe(false);
    expect(stored(s.id).referralOwed).toMatchObject({ slug: SLUG });
    expect(t.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee - s.fee / 2n);
    expect(stored(s.id).status).toBe('COMPLETE');
  });
});

describe('Economy protection and headroom', () => {
  it('musicProtected reserves the partner transfer fee for referred music jobs only', async () => {
    const mk = (referral: any, origin = 'music') => ({ jobId: 'x', protocolFee: '1000', receiptProtocol: '0', receiptMiner: '0', parents: [], items: undefined, origin, referral });
    const s = { protocolSpent: '0', service: '150000' } as any;
    const plain = agent.musicProtected(mk(undefined), s);
    expect(agent.musicProtected(mk({ slug: SLUG }), s) - plain).toBe(FEE_FLOOR);
    expect(agent.musicProtected(mk({ slug: SLUG }, 'wizard'), s)).toBe(plain);
  });
  it('Economy single and batch jobs deliver with a referral', async () => {
    for (const batch of [false, true]) {
      chain.stxTransfers.length = 0;
      const s = await inscribedJob({ referral: SLUG, feeMode: 'economy', batch });
      const j = stored(s.id); j.status = 'DELIVERING'; save(j);
      await run(s.id);
      expect(chain.stxTransfers.find((x) => x.to === PARTNER)).toMatchObject({ memo: MEMO });
      expect(stored(s.id).status).toBe('COMPLETE');
      chain.balances.set(PARTNER, 0n); chain.balances.set(XTRATA_FEE_ADDRESS, 0n);
    }
  });
  it('the extra transfer fits the delivery headroom: a worst-case tail still leaves change >= 0', async () => {
    const s = await inscribedJob({ referral: SLUG, batch: true, receipt: false });
    const j = stored(s.id);
    // Make the wallet as poor as the quote allows: only protocol fee + the whole miner reserve spent.
    const required = BigInt(j.requiredUstx);
    chain.balances.set(s.dep, required - BigInt(j.sumProtocol || j.protocolFee) - BigInt(j.sumMiner || j.minerReserve));
    await run(s.id);
    expect(stored(s.id).status).toBe('COMPLETE');
    expect(chain.stxTransfers.some((x) => x.to === PARTNER)).toBe(true);
    expect(chain.balances.get(s.payer)!).toBeGreaterThanOrEqual(0n);
    expect(chain.balances.get(s.dep) ?? 0n).toBe(0n);
  });
});
