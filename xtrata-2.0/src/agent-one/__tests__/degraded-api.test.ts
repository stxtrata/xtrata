import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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
