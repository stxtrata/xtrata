import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeChain, loadAgent, unloadAgent, PAYER } from './support/fake-chain';
import { jobKey } from '../unfinished';
import { freezeReferral, loadPartners, clearReferralRegistryCache, REGISTRY_PATH } from '../referral-registry';

// Throwaway valid address (not anyone's wallet), same one referral.test.ts uses.
const PARTNER_A = 'SP8H248H248H248H248H248H248H248H24ARTQ82';
const REGISTRY = {
  version: 1,
  partners: [
    { slug: 'fak-fun', name: 'fak.fun', payoutAddress: PARTNER_A, active: true, share: 0.5 },
    { slug: 'retired', name: 'Retired', payoutAddress: 'SPH248H248H248H248H248H248H248H249PPB6QW', active: false },
  ],
};

let chain: FakeChain, api: any;
let registry: { status: number; body: unknown } = { status: 200, body: REGISTRY };
let registryHits = 0;

beforeEach(async () => {
  chain = new FakeChain(); chain.realTxIds = true;
  await loadAgent(chain); api = (window as any).XtrataAgent;
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request: async (_n: string, o: any, cb: any) => (cb || o)({}) } });
  registry = { status: 200, body: REGISTRY }; registryHits = 0; clearReferralRegistryCache();
  const inner = (globalThis as any).fetch;
  (globalThis as any).fetch = vi.fn(async (input: any, init?: any) => {
    if (String(input).endsWith(REGISTRY_PATH)) {
      registryHits += 1;
      return new Response(JSON.stringify(registry.body), { status: registry.status });
    }
    return inner(input, init);
  });
});
afterEach(() => { vi.restoreAllMocks(); unloadAgent(); });

const file = (n = 1024) => ({ name: 'a.ogg', arrayBuffer: async () => new Uint8Array(n).fill(7).buffer });
const single = (extra: any = {}) => api.createJob({ file: file(), uri: 'xtrata:s', mime: 'audio/ogg', fastTrack: true, origin: 'music', receipt: false, expectedFunder: PAYER, ...extra });
const batch = (extra: any = {}) => api.createJob({
  items: [{ file: file(1000), uri: 'xtrata:a', mime: 'audio/ogg' }, { file: { name: 'b.ogg', arrayBuffer: async () => new Uint8Array(2000).fill(9).buffer }, uri: 'xtrata:b', mime: 'audio/ogg' }],
  fastTrack: true, origin: 'music', receipt: false, expectedFunder: PAYER, ...extra,
});
const stored = (j: any) => JSON.parse(localStorage.getItem(jobKey(j.jobId))!);
// The agent sleeps between registry retries; the harness fakes timers, so drive them.
const failing = async (p: Promise<unknown>) => { const r = p.then(() => null, (e) => e); await vi.advanceTimersByTimeAsync(5000); return r; };
const jobKeys = () => Object.keys(localStorage as any).filter((k) => k.includes('job-'));

describe('referral capture on music jobs', () => {
  it('freezes the registry partner onto a single job and stores it', async () => {
    const j = await single({ referral: 'fak-fun' });
    expect(j.referral).toMatchObject({ slug: 'fak-fun', name: 'fak.fun', address: PARTNER_A, shareBps: 5000, minPayoutUstx: '10000' });
    expect(stored(j).referral.address).toBe(PARTNER_A);
  });
  it('freezes it onto a batch job too', async () => {
    const j = await batch({ referral: 'FAK-FUN' });
    expect(j.referral.slug).toBe('fak-fun');
    expect(stored(j).referral.address).toBe(PARTNER_A);
  });
  it('does not change the price, for single and batch, Standard and Economy', async () => {
    for (const feeMode of [undefined, 'economy']) {
      const a = await single({ feeMode }); const b = await single({ feeMode, referral: 'fak-fun' });
      for (const k of ['requiredUstx', 'agentFeeUstx', 'agentFeeExpectedUstx', 'agentFeePct', 'protocolFee', 'minerReserve', 'agentFeeAddress']) expect(b[k]).toEqual(a[k]);
      const c = await batch({ feeMode }); const d = await batch({ feeMode, referral: 'fak-fun' });
      for (const k of ['requiredUstx', 'agentFeeExpectedUstx', 'agentFeePct', 'sumProtocol', 'sumMiner', 'agentFeeAddress']) expect(d[k]).toEqual(c[k]);
    }
  });
  it('a job with no referral is untouched and never fetches the registry', async () => {
    const j = await single();
    expect('referral' in j).toBe(false); expect(registryHits).toBe(0);
  });
  it('ignores a referral on any origin other than music, without fetching', async () => {
    const j = await single({ origin: 'wizard', referral: 'fak-fun' });
    expect('referral' in j).toBe(false); expect(registryHits).toBe(0);
  });
  it('unknown, inactive and malformed slugs mean no referral and no error', async () => {
    for (const r of ['nobody', 'retired', '../x', 'a b', 'x'.repeat(40), '', null, undefined, 5]) {
      const j = await single({ referral: r as any });
      expect('referral' in j).toBe(false);
    }
  });
  it('only a string slug is read: an object naming an address is ignored', async () => {
    for (const r of [{ slug: 'fak-fun', address: PAYER }, { address: PAYER }, ['fak-fun']]) {
      const j = await single({ referral: r as any, referralAddress: PAYER, partner: { address: PAYER } });
      expect('referral' in j).toBe(false);
    }
  });
  it('the payout address comes from the registry, not from the request', async () => {
    const j = await single({ referral: 'fak-fun', referralAddress: PAYER, address: PAYER, shareBps: 10000 });
    expect(j.referral.address).toBe(PARTNER_A); expect(j.referral.shareBps).toBe(5000);
  });
  it('stays frozen: later registry edits do not change a stored job', async () => {
    const j = await single({ referral: 'fak-fun' });
    registry = { status: 200, body: { version: 1, partners: [{ slug: 'fak-fun', name: 'fak.fun', payoutAddress: PAYER, active: true, share: 0.9 }] } };
    clearReferralRegistryCache();
    expect(stored(j).referral).toMatchObject({ address: PARTNER_A, shareBps: 5000 });
    const viaApi = await api.getJob(j.jobId);
    expect((viaApi.job || viaApi).referral.address).toBe(PARTNER_A);
  });
  it('registry read failure creates NO job and says so', async () => {
    registry = { status: 503, body: {} };
    const before = jobKeys().length;
    expect(String(await failing(single({ referral: 'fak-fun' })))).toMatch(/No job was created/);
    expect(String(await failing(batch({ referral: 'fak-fun' })))).toMatch(/No job was created/);
    expect(jobKeys().length).toBe(before);
  });
  it('an unreadable registry is a failure, not "no partners"', async () => {
    registry = { status: 200, body: { version: 2, partners: [] } };
    expect(String(await failing(single({ referral: 'fak-fun' })))).toMatch(/No job was created/);
  });
  it('an empty but valid registry is a normal "no referral"', async () => {
    registry = { status: 200, body: { version: 1, partners: [] } };
    const j = await single({ referral: 'fak-fun' });
    expect('referral' in j).toBe(false);
  });
  it('one bad entry does not disable the others', async () => {
    registry = { status: 200, body: { version: 1, partners: [{ slug: 'BAD SLUG' }, REGISTRY.partners[0]] } };
    const j = await single({ referral: 'fak-fun' });
    expect(j.referral.address).toBe(PARTNER_A);
  });
});

describe('registry loader', () => {
  it('retries a transient failure and caches a good read', async () => {
    let n = 0;
    const inner = (globalThis as any).fetch;
    (globalThis as any).fetch = vi.fn(async (u: any, i?: any) => {
      if (String(u).endsWith(REGISTRY_PATH)) { n += 1; if (n === 1) throw new Error('network down'); return new Response(JSON.stringify(REGISTRY)); }
      return inner(u, i);
    });
    const sleep = vi.fn(async () => {});
    const p = await loadPartners({ sleep });
    expect(p.map((x) => x.slug)).toEqual(['fak-fun', 'retired']); expect(n).toBe(2); expect(sleep).toHaveBeenCalledTimes(1);
    await loadPartners({ sleep }); expect(n).toBe(2);
  });
  it('freezeReferral returns null (no fetch) for non-string input', async () => {
    expect(await freezeReferral(undefined, 'music')).toBeNull();
    expect(registryHits).toBe(0);
  });
});
