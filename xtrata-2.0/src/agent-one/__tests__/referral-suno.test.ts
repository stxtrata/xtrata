import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { FakeChain, loadAgent, unloadAgent, PAYER } from './support/fake-chain';
import { jobKey } from '../unfinished';
import { clearReferralRegistryCache, REGISTRY_PATH, takesReferrals, REFERRAL_ORIGINS } from '../referral-registry';
import { XTRATA_FEE_ADDRESS } from '../referral';

// The Suno wizard ("SUNO More", origin 'suno') builds the same song players as the music wizard and
// charges the same wizard fee, so it takes partner referrals exactly the same way. These tests are the
// music referral guarantees, run against origin 'suno', plus the page and link wiring.

const PARTNER = 'SP8H248H248H248H248H248H248H248H24ARTQ82';
const SLUG = 'fak-fun';
const MEMO = 'xtrata-ref:' + SLUG;
const FEE_FLOOR = 20000n;
const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');

let chain: FakeChain, agent: any, api: any;
let partnerEntry: any;
let registryHits = 0;

beforeEach(async () => {
  chain = new FakeChain(); chain.realTxIds = true; chain.ledger = true;
  agent = await loadAgent(chain); api = (window as any).XtrataAgent;
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request: async (_n: string, o: any, cb: any) => (cb || o)({}) } });
  partnerEntry = { slug: SLUG, name: 'fak.fun', payoutAddress: PARTNER, active: true, share: 0.5, selfReferral: true };
  registryHits = 0; clearReferralRegistryCache();
  const inner = (globalThis as any).fetch;
  (globalThis as any).fetch = vi.fn(async (input: any, init?: any) => {
    if (String(input).endsWith(REGISTRY_PATH)) { registryHits += 1; return new Response(JSON.stringify({ version: 1, partners: [partnerEntry] })); }
    return inner(input, init);
  });
});
afterEach(() => { vi.restoreAllMocks(); unloadAgent(); });

const bytes = (n: number, v: number) => ({ name: `f${v}.html`, arrayBuffer: async () => new Uint8Array(n).fill(v).buffer });
const stored = (id: string) => JSON.parse(localStorage.getItem(jobKey(id))!);
const save = (j: any) => localStorage.setItem(jobKey(j.jobId), JSON.stringify(j));
async function settle<T>(p: Promise<T>, step = 2000): Promise<T> {
  let done = false; let out: any; let err: any;
  p.then((v) => { done = true; out = v; }, (e) => { done = true; err = e; });
  for (let i = 0; i < 400 && !done; i += 1) await vi.advanceTimersByTimeAsync(step);
  if (!done) throw new Error('did not settle');
  if (err) throw err; return out;
}

type Opts = { referral?: string; payer?: string; batch?: boolean; origin?: string };
const base = (o: Opts) => ({ fastTrack: true, origin: o.origin ?? 'suno', receipt: false, expectedFunder: o.payer ?? PAYER, user: o.payer ?? PAYER, referral: o.referral });
const create = (o: Opts) => o.batch
  ? api.createJob({ ...base(o), items: [{ file: bytes(900, 1), uri: 'xtrata:a', mime: 'text/html' }, { file: bytes(1700, 2), uri: 'xtrata:b', mime: 'text/html' }] })
  : api.createJob({ ...base(o), file: bytes(1200, 3), uri: 'xtrata:s', mime: 'text/html' });

/** A funded, inscribed job whose delivery has not started: the deposit holds what is left after minting. */
async function inscribedJob(o: Opts = {}) {
  const payer = o.payer ?? PAYER;
  const created = await create(o);
  const j = stored(created.jobId);
  const required = BigInt(j.requiredUstx);
  const spent = BigInt(j.protocolFee || j.sumProtocol || '0') + 150000n;
  chain.fund(j.depositAddress, required - spent, payer);
  chain.balances.set(payer, 0n);
  Object.assign(j, { status: 'DELIVERING', funder: payer, depositReceivedUstx: required.toString(), fundedAt: new Date().toISOString() });
  if (o.batch) { j.tokenId = '70'; j.items.forEach((it: any, i: number) => { it.tokenId = String(70 + i); it.status = 'INSCRIBED'; chain.owners.set(it.tokenId, j.depositAddress); chain.index.set(j.depositAddress, [...(chain.index.get(j.depositAddress) || []), it.tokenId]); }); }
  else { j.tokenId = '77'; chain.owners.set('77', j.depositAddress); chain.index.set(j.depositAddress, ['77']); }
  save(j);
  return { id: j.jobId, dep: j.depositAddress as string, required, payer, fee: (required * 10n) / 100n };
}
const run = async (id: string) => settle<any>(agent.deliver(stored(id)));

describe('which wizards take referrals', () => {
  it('music and suno do; the general wizard and anything else do not', () => {
    expect([...REFERRAL_ORIGINS].sort()).toEqual(['music', 'suno']);
    expect(takesReferrals('suno')).toBe(true); expect(takesReferrals('music')).toBe(true);
    for (const o of ['wizard', 'Suno', 'SUNO', '', undefined, null, 5, 'music ']) expect(takesReferrals(o as any)).toBe(false);
  });
});

describe('capture on suno jobs', () => {
  it('freezes the registry partner onto a single and a batch job, price unchanged', async () => {
    const plain = await create({}); const ref = await create({ referral: 'FAK-FUN' });
    expect(ref.referral).toMatchObject({ slug: SLUG, name: 'fak.fun', address: PARTNER, shareBps: 5000 });
    expect(stored(ref.jobId).referral.address).toBe(PARTNER);
    for (const k of ['requiredUstx', 'agentFeeUstx', 'agentFeeExpectedUstx', 'agentFeePct', 'protocolFee', 'minerReserve', 'agentFeeAddress']) expect(ref[k]).toEqual(plain[k]);
    const bPlain = await create({ batch: true }); const bRef = await create({ batch: true, referral: SLUG });
    expect(bRef.referral.address).toBe(PARTNER);
    for (const k of ['requiredUstx', 'agentFeeExpectedUstx', 'agentFeePct', 'sumProtocol', 'sumMiner', 'agentFeeAddress']) expect(bRef[k]).toEqual(bPlain[k]);
  });
  it('an unreferred suno job never fetches the registry and carries no referral', async () => {
    const j = await create({});
    expect('referral' in j).toBe(false); expect(registryHits).toBe(0);
  });
  it('the general wizard still ignores a referral, without fetching', async () => {
    const j = await create({ origin: 'wizard', referral: SLUG });
    expect('referral' in j).toBe(false); expect(registryHits).toBe(0);
  });
  it('only a slug is read: the payout address comes from the registry, never the request', async () => {
    const j = await create({ referral: SLUG, ...({ referralAddress: PAYER, address: PAYER, shareBps: 10000 } as any) });
    expect(j.referral.address).toBe(PARTNER); expect(j.referral.shareBps).toBe(5000);
    const k = await create({ referral: { slug: SLUG, address: PAYER } as any });
    expect('referral' in k).toBe(false);
  });
});

describe('referred payout on suno jobs', () => {
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
    const j = stored(s.id);
    expect(j.status).toBe('COMPLETE'); expect('0x' + j.referralTx).toBe(t[0].txid); expect(j.referralPaidUstx).toBe(partner.toString());
    expect(j.referralOwed).toBeUndefined();
    expect(chain.balances.get(s.dep) ?? 0n).toBe(0n);
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
  it('conserves every microSTX, referred or not, single or batch', async () => {
    const total = () => [...chain.balances.values()].reduce((x, y) => x + y, 0n);
    for (const batch of [false, true]) for (const referral of [undefined, SLUG]) {
      const s = await inscribedJob({ batch, referral });
      const before = total(); const fees0 = chain.feesPaid;
      await run(s.id);
      expect(before - total()).toBe(chain.feesPaid - fees0);
      expect(chain.balances.get(s.dep) ?? 0n).toBe(0n);
    }
  });
  it('an unreferred suno job pays exactly the old way: one memo-less transfer of the whole fee to Xtrata', async () => {
    const s = await inscribedJob();
    await run(s.id);
    const t = chain.stxTransfers.filter((x) => x.from === s.dep);
    expect(t.map((x) => [x.to, x.memo])).toEqual([[XTRATA_FEE_ADDRESS, ''], [s.payer, '']]);
    expect(t[0].amount).toBe(s.fee);
    for (const k of ['referral', 'referralTx', 'referralIntent', 'referralOwed']) expect(k in stored(s.id)).toBe(false);
  });
  it('the payer gets back exactly one transfer fee less on a referred job, and the quote is the same', async () => {
    const a = await inscribedJob(); await run(a.id); const changeA = chain.balances.get(a.payer)!;
    chain.balances.set(PARTNER, 0n); chain.balances.set(XTRATA_FEE_ADDRESS, 0n);
    const b = await inscribedJob({ referral: SLUG }); await run(b.id); const changeB = chain.balances.get(b.payer)!;
    expect(b.required).toBe(a.required);
    expect(changeA - changeB).toBe(FEE_FLOOR);
  });
  it('a referral stamped onto a job from another origin is never paid', async () => {
    const s = await inscribedJob({ referral: SLUG });
    const j = stored(s.id); j.origin = 'wizard'; save(j);
    await run(s.id);
    expect(chain.stxTransfers.some((x) => x.to === PARTNER)).toBe(false);
    expect(chain.stxTransfers.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee);
  });
  it('self-referral: no partner transfer, the rebate comes back as change', async () => {
    const plain = await inscribedJob(); await run(plain.id); const changePlain = chain.balances.get(plain.payer)!;
    chain.balances.set(XTRATA_FEE_ADDRESS, 0n); chain.stxTransfers.length = 0;
    const s = await inscribedJob({ referral: SLUG, payer: PARTNER });
    await run(s.id);
    const t = chain.stxTransfers.filter((x) => x.from === s.dep);
    expect(t.some((x) => x.to === PARTNER && x.memo === MEMO)).toBe(false);
    const rebate = s.fee / 2n;
    expect(t.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee - rebate);
    expect(stored(s.id).referralRebateUstx).toBe(rebate.toString());
    expect(chain.balances.get(PARTNER)).toBe(changePlain + rebate);
  });
  it('a permanent partner failure never touches the inscription: complete, Xtrata paid in full, owed recorded', async () => {
    chain.rejectStxTo = PARTNER;
    const s = await inscribedJob({ referral: SLUG });
    await run(s.id);
    const j = stored(s.id);
    expect(j.status).toBe('COMPLETE');
    expect(j.referralOwed).toMatchObject({ slug: SLUG, address: PARTNER });
    expect(chain.stxTransfers.find((x) => x.to === XTRATA_FEE_ADDRESS)!.amount).toBe(s.fee);
    expect(chain.balances.get(s.dep) ?? 0n).toBe(0n);
  });
});

describe('receipt from a real suno delivery', () => {
  it('names the partner, the amount and the payment tx, and the books balance', async () => {
    for (const batch of [false, true]) {
      const s = await inscribedJob({ referral: SLUG, batch });
      const { receipt } = await run(s.id);
      const paid = chain.stxTransfers.find((t) => t.to === PARTNER)!;
      expect(receipt.referral).toMatchObject({ slug: SLUG, name: 'fak.fun', kind: 'paid', amountUstx: (s.fee / 2n).toString() });
      expect(receipt.referralTx).toBe(paid.txid.replace(/^0x/, ''));
      expect(stored(s.id).receiptHtml).toContain('Referral · fak.fun');
      // (A batch receipt is branded 'Inscription Wizard' whatever the origin: that is how it already behaved.)
      if (!batch) expect(stored(s.id).receiptHtml).toContain('SUNO More');
      expect(receipt.agentFee).toBe(s.fee.toString());
      expect(BigInt(receipt.xtrataProtocol) + BigInt(receipt.receiptProtocol) + BigInt(receipt.networkFee) + BigInt(receipt.agentFee) + BigInt(receipt.changeReturned)).toBe(s.required);
      chain.stxTransfers.length = 0;
    }
  });
  it('an unreferred suno receipt has no referral text', async () => {
    const s = await inscribedJob();
    const { receipt } = await run(s.id);
    expect('referral' in receipt).toBe(false);
    expect(stored(s.id).receiptHtml).not.toMatch(/Referral/);
  });
});

describe('page and link wiring', () => {
  const redirects = read('../../../public/_redirects');
  const rules = redirects.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => l.split(/\s+/));
  const sunoPage = read('../../../xtrata-agent-one/wizard/suno.html');
  const musicPage = read('../../../music/index.html');

  it('/s/:slug opens the Suno wizard with only the slug, as a temporary redirect', () => {
    expect(rules.find((x) => x[0] === '/s/:slug')).toEqual(['/s/:slug', '/wizard/suno?ref=:slug', '302']);
    expect(rules.find((x) => x[0] === '/s')).toEqual(['/s', '/wizard/suno', '302']);
    expect(rules.find((x) => x[0] === '/s/')).toEqual(['/s/', '/wizard/suno', '302']);
    expect(rules.filter((x) => x[0] === '/s' || x[0].startsWith('/s/')).length).toBe(3);
  });
  it('no catch-all rule sits before the /s rules, and the /m rules are unchanged', () => {
    const first = rules.findIndex((x) => x[0] === '/s/:slug');
    expect(rules.slice(0, first).some((x) => /^\/(:\w+|\*)/.test(x[0]))).toBe(false);
    expect(rules.find((x) => x[0] === '/m/:slug')).toEqual(['/m/:slug', '/music/?ref=:slug', '302']);
  });
  it('the Suno page reads the slug exactly the way the music page does, and passes it to the agent', () => {
    const grab = (page: string) => /function referralSlug\(\)\{[\s\S]*?\n\}\n/.exec(page)?.[0].replace(/\s+/g, ' ').replace(/^\/\/.*$/gm, '');
    expect(grab(sunoPage)).toBeTruthy();
    expect(grab(sunoPage)).toBe(grab(musicPage));
    expect(sunoPage).toContain('A.createJob({...body,referral:referralSlug()})');
    expect(sunoPage).not.toContain('A.createJob(body)');
  });
  it('the Suno page only ever sends origin suno, and the slug reader cannot produce an address', () => {
    expect(sunoPage).toMatch(/origin:'suno'/);
    expect(sunoPage).not.toMatch(/referralAddress|payoutAddress/);
  });
});
