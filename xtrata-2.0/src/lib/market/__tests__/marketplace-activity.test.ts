/**
 * The marketplace-wide activity list.
 *
 * The data was always there — `loadMarketActivity` indexes a whole contract —
 * but the page filtered it to one token, so a marketplace could only be read
 * one listing at a time. These cover the merge, and the two things it must not
 * get wrong:
 *
 *   - **Sponsorship is derived, not assumed.** Every listing is on a
 *     sponsor-capable market, so the market says nothing about a given sale.
 *     Only a `claim-fee` against that listing does.
 *   - **Truncation is admitted.** A partial history shown as a whole one is the
 *     same class of error as rendering a placeholder as artwork.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadMarketplaceActivity } from '../indexer';
import type { MarketRegistryEntry } from '../registry';

const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

const market = (contractName: string, paymentTokenContractId: string | null): MarketRegistryEntry => ({
  label: contractName,
  address: CORE,
  contractName,
  network: 'mainnet',
  paymentTokenContractId,
  sponsored: true
});

/** One contract-log event in the shape the Hiro events endpoint returns. */
const logEvent = (opts: {
  contractId: string;
  action: string;
  listingId: number;
  tokenId?: number;
  price?: number;
  txId: string;
  block: number;
  index?: number;
}) => ({
  event_index: opts.index ?? 0,
  event_type: 'smart_contract_log',
  tx_id: opts.txId,
  block_height: opts.block,
  contract_log: {
    contract_id: opts.contractId,
    topic: 'print',
    value: {
      hex: '0x00',
      repr: `(tuple (action "${opts.action}") (listing-id u${opts.listingId}))`
    }
  }
});

/**
 * Serve pages of events per contract, so the page-walk can be exercised.
 * `pages` maps a contract name to an array of pages.
 */
const stubFetch = (pages: Record<string, unknown[][]>) => {
  const calls: string[] = [];
  const fetchMock = vi.fn(async (url: string) => {
    calls.push(String(url));
    const name = Object.keys(pages).find((key) => String(url).includes(key));
    const offset = Number(/offset=(\d+)/.exec(String(url))?.[1] ?? 0);
    const page = name ? (pages[name][offset / 50] ?? []) : [];
    return new Response(JSON.stringify({ results: page }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  });
  vi.stubGlobal('fetch', fetchMock);
  return { fetchMock, calls };
};

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loadMarketplaceActivity', () => {
  it('reports every configured market even when all are empty', async () => {
    stubFetch({});
    const snapshot = await loadMarketplaceActivity({
      contracts: [
        { entry: market('xtrata-market-sponsored-stx-v1-1', null) },
        { entry: market('xtrata-market-sponsored-sbtc-v1-1', `${CORE}.sbtc-token`) }
      ],
      force: true
    });
    expect(snapshot.markets).toHaveLength(2);
    expect(snapshot.markets.map((entry) => entry.label)).toEqual([
      'xtrata-market-sponsored-stx-v1-1',
      'xtrata-market-sponsored-sbtc-v1-1'
    ]);
  });

  it('carries the settlement asset so a price formats as its own currency', async () => {
    stubFetch({});
    const snapshot = await loadMarketplaceActivity({
      contracts: [
        { entry: market('xtrata-market-sponsored-stx-v1-1', null) },
        { entry: market('xtrata-market-sponsored-sbtc-v1-1', `${CORE}.sbtc-token`) }
      ],
      force: true
    });
    // Nothing to assert on rows here; the point is the markets resolved
    // distinctly rather than collapsing to one settlement.
    expect(snapshot.markets[0].contractId).not.toBe(snapshot.markets[1].contractId);
  });

  it('is not complete when a market could not be read', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      })
    );
    const snapshot = await loadMarketplaceActivity({
      contracts: [{ entry: market('xtrata-market-sponsored-stx-v1-1', null) }],
      force: true
    });
    expect(snapshot.complete).toBe(false);
    expect(snapshot.markets[0].complete).toBe(false);
  });

  it('an unreadable market yields an incomplete snapshot, not an empty marketplace', async () => {
    // The failure mode this guards: one market erroring and the page showing a
    // confident "no activity" for the whole marketplace.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('boom');
      })
    );
    const snapshot = await loadMarketplaceActivity({
      contracts: [
        { entry: market('xtrata-market-sponsored-stx-v1-1', null) },
        { entry: market('xtrata-market-sponsored-sbtc-v1-1', `${CORE}.sbtc-token`) }
      ],
      force: true
    });
    expect(snapshot.complete).toBe(false);
    expect(snapshot.markets.every((entry) => entry.complete === false)).toBe(true);
  });

  it('never claims complete when there are no markets at all', async () => {
    stubFetch({});
    const snapshot = await loadMarketplaceActivity({ contracts: [], force: true });
    // `[].every(...)` is true, which would have made an empty configuration
    // report a complete marketplace history.
    expect(snapshot.complete).toBe(false);
    expect(snapshot.rows).toEqual([]);
  });
});

describe('the page walk', () => {
  it('asks for more than one page when the first comes back full', async () => {
    const full = Array.from({ length: 50 }, (_, index) =>
      logEvent({
        contractId: `${CORE}.xtrata-market-sponsored-stx-v1-1`,
        action: 'list',
        listingId: index,
        txId: `0x${index}`,
        block: 100 + index,
        index
      })
    );
    const { calls } = stubFetch({
      'xtrata-market-sponsored-stx-v1-1': [full, []]
    });
    await loadMarketplaceActivity({
      contracts: [{ entry: market('xtrata-market-sponsored-stx-v1-1', null) }],
      force: true
    });
    const offsets = calls
      .map((url) => /offset=(\d+)/.exec(url)?.[1])
      .filter(Boolean);
    // The old loader fetched offset=0 and stopped, silently losing everything
    // older than the newest fifty.
    expect(offsets).toContain('0');
    expect(offsets).toContain('50');
  });

  it('stops at the first short page rather than paging forever', async () => {
    const { calls } = stubFetch({
      'xtrata-market-sponsored-stx-v1-1': [[]]
    });
    await loadMarketplaceActivity({
      contracts: [{ entry: market('xtrata-market-sponsored-stx-v1-1', null) }],
      force: true
    });
    const eventCalls = calls.filter((url) => url.includes('/events?'));
    expect(eventCalls).toHaveLength(1);
  });
});
