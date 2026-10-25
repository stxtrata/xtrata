import { createHash } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeChain, loadAgent, unloadAgent, PAYER } from './support/fake-chain';
import { jobKey } from '../unfinished';
import { clearReferralRegistryCache, REGISTRY_PATH } from '../referral-registry';
import { XTRATA_FEE_ADDRESS } from '../referral';

const PARTNER = 'SP8H248H248H248H248H248H248H248H24ARTQ82';
const SLUG = 'fak-fun';
const sha = (s: string) => createHash('sha256').update(s).digest('hex');

const single = (extra: any = {}) => ({
  jobId: 'job-1', core: 'xtrata-v3-2-3', date: '2026-10-25T12:00:00.000Z', uri: 'xtrata:song/a', mime: 'audio/ogg', bytes: 1048576, chunks: 64, single: false,
  tokenId: '77', receiptTokenId: '78', recipient: PAYER, agentIdentityId: null, origin: 'music', parents: [], outcome: 'inscribed', note: null,
  depositReceived: '5000000', xtrataProtocol: '200000', receiptProtocol: '10000', networkFee: '1500000', agentFeePct: 10, agentFee: '500000',
  changeReturned: '2790000', totalPaid: '2210000', stxUsd: 0.5, totalPaidUsd: '1.10', audioOpt: null, player: null, ...extra,
});
const batch = (extra: any = {}) => ({
  jobId: 'job-2', core: 'xtrata-v3-2-3', date: '2026-10-25T12:00:00.000Z', batch: true, outcome: 'inscribed', note: null,
  items: [{ idx: 0, uri: 'xtrata:a', mime: 'audio/ogg', bytes: 900000, tokenId: '70', status: 'INSCRIBED', error: null }, { idx: 1, uri: 'xtrata:b', mime: 'audio/ogg', bytes: 1700000, tokenId: '71', status: 'INSCRIBED', error: null }],
  counts: { total: 2, minted: 2, failed: 0, skipped: 0 }, parents: [], receiptTokenId: '72', recipient: PAYER, agentIdentityId: null, origin: 'music',
  depositReceived: '6000000', xtrataProtocol: '400000', receiptProtocol: '10000', networkFee: '2000000', agentFeePct: 10, agentFee: '600000',
  changeReturned: '2990000', totalPaid: '3010000', stxUsd: null, ...extra,
});
const ref = (kind: string, amountUstx = '250000', name = 'fak.fun') => ({ slug: SLUG, name, kind, amountUstx });

let chain: FakeChain, agent: any;
beforeEach(async () => { chain = new FakeChain(); agent = await loadAgent(chain); });
afterEach(() => { vi.restoreAllMocks(); unloadAgent(); });

describe('receipt HTML', () => {
  it('unreferred single and batch receipts are byte-for-byte what they were before referrals existed', () => {
    // Hashes taken from the receipt builders as they stood before this change.
    expect(sha(agent.buildReceiptHtml(single()))).toBe('0c5742966bb016516c0d13ca48df2802fcf01308447d7c918a0b9be6804a9a28');
    expect(sha(agent.buildReceiptHtml(single({ note: 'a note', parents: ['5'], audioOpt: { from: 3e6, to: 1e6, preset: 'p', bitrate: '96k', savedPct: 60 } })))).toBe('3d089988a72940605f0db1d7d4610be717263824920bea46e6f1a989badad64a');
    expect(sha(agent.buildBatchReceiptHtml(batch()))).toBe('9019d4261dd31253fd31bca35986259e1915fd5447f56bca33f34d7b77ccf475');
    expect(sha(agent.buildBatchReceiptHtml(batch({ outcome: 'refunded' })))).toBe('50a9f9ae04d4d290fdb814c5ac684bdea3a505d1582ae5fb87969bddaf18f213');
  });
  it('a referred receipt shows one line under the wizard fee, in both receipt types', () => {
    for (const html of [agent.buildReceiptHtml(single({ referral: ref('paid') })), agent.buildBatchReceiptHtml(batch({ referral: ref('paid') }))]) {
      expect(html).toContain('Referral · fak.fun');
      expect(html).toContain('0.25 STX');
      expect(html.indexOf('Wizard fee')).toBeLessThan(html.indexOf('Referral · fak.fun'));
      expect(html.indexOf('Referral · fak.fun')).toBeLessThan(html.indexOf('Change returned'));
      expect((html.match(/Referral ·/g) || []).length).toBe(1);
    }
  });
  it('shows the planned share on the on-chain receipt, a settle-later note when unpaid, and a rebate line for self-referral', () => {
    expect(agent.buildReceiptHtml(single({ referral: ref('planned') }))).toContain('Referral · fak.fun');
    const pending = agent.buildReceiptHtml(single({ referral: ref('pending') }));
    expect(pending).toContain('to be settled by Xtrata'); expect(pending).not.toContain('0.25 STX');
    const rebate = agent.buildBatchReceiptHtml(batch({ referral: ref('rebate') }));
    expect(rebate).toContain('Referral rebate · fak.fun'); expect(rebate).toContain('back in your change');
  });
  it('escapes the partner name', () => {
    for (const html of [agent.buildReceiptHtml(single({ referral: ref('paid', '1', '<img src=x onerror=1>') })), agent.buildBatchReceiptHtml(batch({ referral: ref('pending', '1', '<script>x</script>') }))]) {
      expect(html).not.toContain('<img src=x'); expect(html).not.toContain('<script>x');
      expect(html).toMatch(/&lt;(img|script)/);
    }
  });
});

describe('receipts produced by a real delivery', () => {
  let regEntry: any;
  beforeEach(async () => {
    chain.ledger = true; chain.realTxIds = true; agent = await loadAgent(chain); // reload with ledger on
    Object.defineProperty(navigator, 'locks', { configurable: true, value: { request: async (_n: string, o: any, cb: any) => (cb || o)({}) } });
    regEntry = { slug: SLUG, name: 'fak.fun', payoutAddress: PARTNER, active: true, share: 0.5 };
    clearReferralRegistryCache();
    const inner = (globalThis as any).fetch;
    (globalThis as any).fetch = vi.fn(async (input: any, init?: any) => String(input).endsWith(REGISTRY_PATH) ? new Response(JSON.stringify({ version: 1, partners: [regEntry] })) : inner(input, init));
  });
  const api = () => (window as any).XtrataAgent;
  const file = (n: number, v: number) => ({ name: `f${v}.ogg`, arrayBuffer: async () => new Uint8Array(n).fill(v).buffer });
  const stored = (id: string) => JSON.parse(localStorage.getItem(jobKey(id))!);
  async function settle<T>(p: Promise<T>): Promise<T> {
    let done = false; let out: any; let err: any;
    p.then((v) => { done = true; out = v; }, (e) => { done = true; err = e; });
    for (let i = 0; i < 400 && !done; i += 1) await vi.advanceTimersByTimeAsync(2000);
    if (err) throw err; return out;
  }
  async function deliverJob(o: { referral?: string; payer?: string; batch?: boolean }) {
    const payer = o.payer ?? PAYER;
    const base = { fastTrack: true, origin: 'music', receipt: false, expectedFunder: payer, user: payer, referral: o.referral };
    const created = o.batch
      ? await api().createJob({ ...base, items: [{ file: file(900, 1), uri: 'xtrata:a', mime: 'audio/ogg' }, { file: file(1700, 2), uri: 'xtrata:b', mime: 'audio/ogg' }] })
      : await api().createJob({ ...base, file: file(1200, 3), uri: 'xtrata:s', mime: 'audio/ogg' });
    const j = stored(created.jobId); const required = BigInt(j.requiredUstx);
    chain.fund(j.depositAddress, required - BigInt(j.protocolFee || j.sumProtocol) - 150000n, payer); chain.balances.set(payer, 0n);
    Object.assign(j, { status: 'DELIVERING', funder: payer, depositReceivedUstx: required.toString() });
    if (o.batch) { j.tokenId = '70'; j.items.forEach((it: any, i: number) => { it.tokenId = String(70 + i); it.status = 'INSCRIBED'; chain.owners.set(it.tokenId, j.depositAddress); chain.index.set(j.depositAddress, [...(chain.index.get(j.depositAddress) ?? []), it.tokenId]); }); }
    else { j.tokenId = '77'; chain.owners.set('77', j.depositAddress); chain.index.set(j.depositAddress, ['77']); }
    localStorage.setItem(jobKey(j.jobId), JSON.stringify(j));
    const fees0 = chain.feesPaid;
    const { receipt } = await settle<any>(agent.deliver(stored(j.jobId)));
    return { id: j.jobId, receipt, job: stored(j.jobId), required, fee: (required * 10n) / 100n, tailFees: chain.feesPaid - fees0 };
  }
  /** deposit = protocol + receipt + network + wizard fee actually borne + change, to the microSTX. */
  /** The reported network fee is the 150,000 already spent minting plus every fee the delivery tail really paid. */
  const networkIsReal = (r: any, tail: bigint) => expect(BigInt(r.networkFee)).toBe(150000n + tail);
  const adds = (r: any) => BigInt(r.xtrataProtocol) + BigInt(r.receiptProtocol) + BigInt(r.networkFee) + BigInt(r.agentFee) + BigInt(r.changeReturned);

  it('unreferred delivery: receipt has no referral key and no referral text', async () => {
    for (const batch of [false, true]) {
      const r = await deliverJob({ batch });
      expect('referral' in r.receipt).toBe(false); expect('referralTx' in r.receipt).toBe(false);
      expect(r.job.receiptHtml).not.toMatch(/Referral/);
    }
  });
  it('referred delivery: the receipt names the partner, the amount and the payment tx', async () => {
    for (const batch of [false, true]) {
      const r = await deliverJob({ referral: SLUG, batch });
      const paid = chain.stxTransfers.find((t) => t.to === PARTNER)!;
      expect(r.receipt.referral).toMatchObject({ slug: SLUG, name: 'fak.fun', kind: 'paid', amountUstx: (r.fee / 2n).toString() });
      expect(r.receipt.referralTx).toBe(paid.txid.replace(/^0x/, ''));
      expect(r.job.receiptHtml).toContain('Referral · fak.fun');
      expect(r.receipt.agentFee).toBe(r.fee.toString());          // the user's fee line is unchanged by the referral
      expect(adds(r.receipt)).toBe(r.required);                    // and the books still balance
      networkIsReal(r.receipt, r.tailFees);                        // incl. the extra partner transfer fee
      chain.stxTransfers.length = 0;
    }
  });
  it('partner payout failed: the receipt says it will be settled and carries the owed record', async () => {
    chain.rejectStxTo = PARTNER;
    const r = await deliverJob({ referral: SLUG });
    expect(r.receipt.referral.kind).toBe('pending');
    expect(r.receipt.referralOwed).toMatchObject({ slug: SLUG, address: PARTNER });
    expect(r.job.receiptHtml).toContain('to be settled by Xtrata');
    expect(adds(r.receipt)).toBe(r.required);
    networkIsReal(r.receipt, r.tailFees);
  });
  it('self-referral: the receipt shows the rebate, the fee borne is lower, and the books still balance', async () => {
    const r = await deliverJob({ referral: SLUG, payer: PARTNER, batch: false });
    const rebate = r.fee / 2n;
    expect(r.receipt.referral).toMatchObject({ kind: 'rebate', amountUstx: rebate.toString() });
    expect(r.receipt.agentFee).toBe((r.fee - rebate).toString());
    expect(r.job.receiptHtml).toContain('Referral rebate · fak.fun');
    expect(adds(r.receipt)).toBe(r.required);
    networkIsReal(r.receipt, r.tailFees);
    expect(chain.stxTransfers.find((t) => t.to === XTRATA_FEE_ADDRESS)!.amount).toBe(r.fee - rebate);
  });
});
