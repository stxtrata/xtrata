import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEPOSIT, FakeChain, OTHER, PAYER, loadAgent, unloadAgent } from './support/fake-chain';

// These run agent-core for real against a chain we break on purpose. Every case here
// is a failure that actually shipped, reproduced at the level it happened rather than
// asserted on in source.

let chain: FakeChain;
let agent: any;

beforeEach(async () => {
  chain = new FakeChain();
  agent = await loadAgent(chain);
});
afterEach(() => unloadAgent());

const REQUIRED = 11_660_000n;

describe('balance under a degraded API', () => {
  it('reads the funded balance when the API is healthy', async () => {
    chain.fund(DEPOSIT, REQUIRED);
    await expect(agent.balance(DEPOSIT)).resolves.toBe(REQUIRED);
  });

  it('THROWS on a throttled read instead of reporting an empty wallet', async () => {
    chain.fund(DEPOSIT, REQUIRED);
    chain.fail('/balances/stx', 429, {
      message: 'Please update to the v2 endpoint /extended/v2/addresses/:address/balances/stx'
    });
    // The shipped bug returned 0n here, which read as "not funded, have 0" on a
    // wallet holding 11.66 STX and drove the fee cap to zero.
    await expect(agent.balance(DEPOSIT)).rejects.toThrow(/balance lookup failed/i);
  });

  it('throws when the response omits the balance field', async () => {
    chain.fail('/balances/stx', 200, { note: 'no balance here' });
    await expect(agent.balance(DEPOSIT)).rejects.toThrow(/no balance/i);
  });

  it('throws on a server error rather than defaulting to zero', async () => {
    chain.fund(DEPOSIT, REQUIRED);
    chain.fail('/balances/stx', 503);
    await expect(agent.balance(DEPOSIT)).rejects.toThrow();
  });

  it('does not touch the deprecated v1 balance route', async () => {
    chain.fund(DEPOSIT, REQUIRED);
    await agent.balance(DEPOSIT);
    // Hiro throttles /extended/v1/address/:addr/stx regardless of API key.
    expect(chain.requests.some((u) => /\/extended\/v1\/address\/[^/]+\/stx$/.test(u))).toBe(false);
    expect(chain.requests.some((u) => u.includes('/extended/v2/addresses/'))).toBe(true);
  });
});

describe('detectFunder under a degraded API', () => {
  it('identifies the payer, and picks the largest sender over a dust tx', async () => {
    chain.fund(DEPOSIT, REQUIRED, PAYER);
    chain.inbound.get(DEPOSIT)!.push({ sender: OTHER, amount: 1n });   // dust must not win
    await expect(agent.detectFunder(DEPOSIT)).resolves.toBe(PAYER);
  });

  it('still works when stx_inbound is throttled', async () => {
    chain.fund(DEPOSIT, REQUIRED, PAYER);
    chain.fail('/stx_inbound', 429);
    // "could not determine the paying address" fired for exactly this reason while
    // the payment sat plainly on chain.
    await expect(agent.detectFunder(DEPOSIT)).resolves.toBe(PAYER);
  });

  it('returns null rather than a wrong answer when every source is down', async () => {
    chain.fund(DEPOSIT, REQUIRED, PAYER);
    chain.fail('/stx_inbound', 429);
    chain.fail('/transactions', 429);
    await expect(agent.detectFunder(DEPOSIT)).resolves.toBeNull();
  });

  it('does not read a throttled response as "nobody paid"', async () => {
    chain.fund(DEPOSIT, REQUIRED, PAYER);
    // A 429 body has no `results`, which the old code silently read as an empty
    // sender list — a failure indistinguishable from an unfunded wallet.
    chain.fail('/transactions', 429, { message: 'rate limited' });
    await expect(agent.detectFunder(DEPOSIT)).resolves.toBe(PAYER);   // falls back, still right
  });
});

describe('the parent gate when the holdings index lags the chain', () => {
  const job = (parents: string[]) => ({ depositAddress: DEPOSIT, parents, mock: false });

  it('reports the parent as held once the CONTRACT says the deposit owns it', async () => {
    chain.owners.set('2878', PAYER);
    chain.index.set(PAYER, ['2878']);
    // Transfer lands on chain; the index has not caught up.
    chain.transfer('2878', DEPOSIT, false);

    const status = await agent.parentsStatus(job(['2878']));
    // The shipped bug reported it missing here, so the job kept asking the user to
    // send an inscription they had already sent.
    expect(status.held).toEqual(['2878']);
    expect(status.missing).toEqual([]);
    expect(status.ok).toBe(true);
  });

  it('reports it missing while it genuinely is', async () => {
    chain.owners.set('2878', PAYER);
    const status = await agent.parentsStatus(job(['2878']));
    expect(status.missing).toEqual(['2878']);
    expect(status.ok).toBe(false);
  });

  it('still flags a stray the index can see and we never declared', async () => {
    chain.owners.set('2878', DEPOSIT);
    chain.index.set(DEPOSIT, ['2878', '9999']);
    const status = await agent.parentsStatus(job(['2878']));
    expect(status.held).toEqual(['2878']);
    expect(status.unexpected).toEqual(['9999']);
    expect(status.ok).toBe(false);
  });

  it('degrades to holdingsUnverified when the index is down, without blocking', async () => {
    chain.owners.set('2878', DEPOSIT);
    chain.fail('/nft/holdings', 500);
    const status = await agent.parentsStatus(job(['2878']));
    expect(status.held).toEqual(['2878']);
    expect(status.ok).toBe(true);
    expect(status.holdingsUnverified).toBe(true);
  });
});

describe('a failed holdings read is not "this wallet holds nothing"', () => {
  it('throws so the never-strand guards can actually fire', async () => {
    chain.owners.set('2878', DEPOSIT);
    chain.index.set(DEPOSIT, ['2878']);
    chain.fail('/nft/holdings', 429);
    // Found by this harness on its first run. heldInscriptions returned [] on a bad
    // read, so refundAndClose's guard saw "no inscription held" and discarded the
    // deposit key — which would strand an escrowed parent at an address nobody can
    // spend from. Every caller already had a try/catch expecting a throw; none of
    // them could ever fire.
    await expect(agent.heldInscriptions(DEPOSIT)).rejects.toThrow(/holdings lookup failed/i);
  });
});

describe('a degraded read is never reported as a fact about the chain', () => {
  let logged: string[];
  beforeEach(() => {
    // waitTx sleeps between polls; run timers eagerly so the loop completes fast.
    vi.spyOn(globalThis, 'setTimeout').mockImplementation(((f: any) => { f(); return 0 as any; }) as any);
    // xaoLog only persists to a job record that already exists, but it always writes
    // the same line to the console — that is the observable we care about here.
    logged = [];
    vi.spyOn(console, 'info').mockImplementation(((m: any) => { logged.push(String(m)); }) as any);
  });
  afterEach(() => vi.restoreAllMocks());

  const job = () => ({
    jobId: 'j1', depositAddress: DEPOSIT, requiredUstx: String(REQUIRED),
    status: 'AWAITING_DEPOSIT', parents: [], mock: false
  });

  it('does not call a throttled mempool "no payment in flight"', async () => {
    // The status line flipped between "payment seen — confirming" and "waiting for
    // payment to land" because a 429 here read as an empty mempool.
    chain.balances.set(DEPOSIT, 0n);
    chain.fail('/mempool', 429);
    const s = await agent.statusJob(job());
    expect(s.funded).toBe(false);
    expect(s.pending).toBe(false);          // unknown, reported as not-pending
    expect(logged.join('\n')).toMatch(/mempool check unavailable/i);
  });

  it('sees a real pending payment when the mempool is readable', async () => {
    chain.balances.set(DEPOSIT, 0n);
    const original = chain.handle.bind(chain);
    chain.handle = (url: string) => url.includes('/mempool')
      ? new Response(JSON.stringify({ results: [{ token_transfer: { recipient_address: DEPOSIT } }] }),
          { status: 200, headers: { 'content-type': 'application/json' } })
      : original(url);
    const s = await agent.statusJob(job());
    expect(s.pending).toBe(true);
  });

  it('distinguishes "the API was unreachable" from "the tx never confirmed"', async () => {
    chain.fail('/extended/v1/tx/', 503);
    await expect(agent.waitTx('0xdeadbeef')).rejects.toThrow(/could not reach the API/i);
  });

  it('still reports a genuine non-confirmation as such', async () => {
    // Reachable, but the tx stays pending forever.
    await expect(agent.waitTx('0xabc123')).rejects.toThrow(/not confirmed/i);
  });

  it('logs rather than hides a nonce lookup it could not make', async () => {
    chain.fail('/nonces', 429);
    await expect(agent.safeNonce(DEPOSIT, 'j1')).resolves.toBeUndefined();
    expect(logged.join('\n')).toMatch(/nonce lookup failed/i);
  });
});

describe('a parent that has arrived stays arrived', () => {
  const job = (parents: string[]) => ({ jobId: 'j1', depositAddress: DEPOSIT, parents, mock: false, fundedAt: new Date().toISOString() });

  it('does not report a parent missing when the ownership read simply failed', async () => {
    chain.owners.set('2878', DEPOSIT);          // it IS at the deposit wallet
    chain.fail('/get-owner', 500);              // ...but the read does not answer
    const s = await agent.parentsStatus(job(['2878']));
    // The flicker: ownerOf() returns null on any error, so a transient RPC failure
    // was bucketed as "missing" and the checklist flipped green → not arrived → green.
    expect(s.missing).toEqual([]);
    expect(s.unknown).toEqual(['2878']);
    expect(s.ok).toBe(false);                   // unknown still blocks the mint
  });

  it('still reports a genuinely absent parent as missing', async () => {
    chain.owners.set('2878', PAYER);
    const s = await agent.parentsStatus(job(['2878']));
    expect(s.missing).toEqual(['2878']);
    expect(s.unknown).toEqual([]);
  });

  it('reports it held when the read answers and the deposit owns it', async () => {
    chain.owners.set('2878', DEPOSIT);
    const s = await agent.parentsStatus(job(['2878']));
    expect(s.held).toEqual(['2878']);
    expect(s.unknown).toEqual([]);
    expect(s.ok).toBe(true);
  });
});
