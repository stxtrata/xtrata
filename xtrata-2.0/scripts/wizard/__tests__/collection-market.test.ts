import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { TransactionVersion, getAddressFromPrivateKey } from '@stacks/transactions';

import { COLLECTIONS, KEEPING, MACHINERY, OMISSION, getCollection } from '../collections.mjs';
import {
  DEFAULT_LISTING_MARKET,
  DEFAULT_LISTING_RUN_SPEND_CAP_USTX,
  MIN_FEE_BUDGET_USTX,
  collectionListingPlan,
  formatCollectionListingPlan,
  formatCollectionListingReport,
  idsFromMintJournal,
  listCollection,
  listingRunIdFor
} from '../collection-market.mjs';
import { emptyCollectionJournal, formatCollectionPlan, planPiece, runCollection } from '../collection-run-core.mjs';
import { fakeFetch, makeFakeChain } from '../run-thread.mjs';
import { dryPorts, listingDryPorts, listingIdsFor } from '../collection-run.mjs';

const TIP = 8_700_000;
const FEE = 11_000n;
const MINER_FEE = 30_000n;
const JOURNAL_DIR = '/tmp/wizard-collection-market-tests';

/** Synthetic wallets, derived from fixed dummy keys. Never funded, never used to sign. */
const WALLETS = Object.fromEntries(
  ['archivist', 'skeptic', 'builder'].map((id, index) => {
    const key = String(index + 1).padStart(64, '0');
    return [id, { address: getAddressFromPrivateKey(key, TransactionVersion.Mainnet), key }];
  })
);
const ENV = {} as NodeJS.ProcessEnv;

/** Every member of a collection, with ids that are easy to read in a failure. */
const idsFor = (collectionId: string, base = 500) => {
  const art = getCollection(collectionId);
  const ids: Record<string, string> = {};
  for (const piece of art.pieces) ids[String(piece.index)] = String(base + piece.index);
  ids.manifest = String(base + 9);
  return ids;
};

/* ------------------------------------------------------------------ */
/* minting a collection that is not the Builder's                      */
/* ------------------------------------------------------------------ */

describe('any of the three can be minted', () => {
  const mintWorld = (collectionId: string) => {
    const art = getCollection(collectionId);
    const chain = makeFakeChain({ tip: TIP, feeUstx: FEE });
    const address = WALLETS[art.wizard].address;
    const submitted: Array<{ index: number | null; body: string }> = [];
    const said: string[] = [];
    let disk: string | null = null;
    let clock = Date.UTC(2026, 6, 31, 12, 0, 0);

    const ports = {
      fetchImpl: fakeFetch(chain) as unknown as typeof fetch,
      submit: vi.fn(async ({ plan }: { plan: any }) => {
        submitted.push({ index: plan.index, body: plan.body });
        return { txid: chain.mint(plan.body, address, MINER_FEE).txid };
      }),
      readJournal: () => (disk === null ? null : JSON.parse(disk)),
      writeJournal: (_path: string, journal: unknown) => {
        disk = JSON.stringify(journal);
      },
      killSwitch: () => null,
      now: () => (clock += 1_000),
      sleep: async () => {},
      say: (line: string) => said.push(String(line)),
      presentPlan: () => {}
    };

    return {
      art,
      chain,
      ports,
      submitted,
      said,
      journal: () => (disk === null ? null : JSON.parse(disk)),
      run: (overrides: Record<string, unknown> = {}) =>
        runCollection({
          ports,
          options: {
            collectionId,
            broadcast: true,
            env: ENV,
            wallets: WALLETS,
            journalDir: JOURNAL_DIR,
            confirmTimeoutMs: 120_000,
            confirmPollMs: 1_000,
            ...overrides
          }
        })
    };
  };

  for (const collection of COLLECTIONS) {
    it(`mints ${collection.id} end to end, out of ${collection.wizard}'s wallet`, async () => {
      const world = mintWorld(collection.id);
      const result = await world.run();

      expect(result.ok, JSON.stringify(result.halted)).toBe(true);
      expect(result.collectionId).toBe(collection.id);
      expect(result.members).toHaveLength(collection.length);
      expect(world.submitted.map((entry) => entry.index)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, null]);
      // The bytes that went to the fake chain are this collection's plates and
      // nobody else's. A runner that resolved the wrong collection would still
      // produce nine mints and a green report.
      for (const piece of collection.pieces) {
        expect(world.submitted[piece.index - 1].body).toBe(collection.renderPiece(piece.index));
      }
      const journal = world.journal();
      expect(journal.collectionId).toBe(collection.id);
      for (const piece of collection.pieces) {
        expect(journal.pieces[String(piece.index)].wizard).toBe(collection.wizard);
        expect(journal.pieces[String(piece.index)].tokenUri).toContain(collection.id);
      }
      expect(journal.pieces.manifest.parentIds).toHaveLength(collection.length);
    });
  }

  it('keeps each collection in its own journal file', async () => {
    const first = await mintWorld(KEEPING.id).run();
    const second = await mintWorld(OMISSION.id).run();
    expect(first.journalPath).toContain('.collection-c-keeping-001.json');
    expect(second.journalPath).toContain('.collection-c-omission-001.json');
    expect(first.journalPath).not.toBe(second.journalPath);
  });

  it('refuses to load a journal written for a different collection', async () => {
    const world = mintWorld(OMISSION.id);
    world.ports.writeJournal('', emptyCollectionJournal({ collectionId: KEEPING.id, startedAt: 'now' }));
    const result = await world.run();
    expect(result.halted?.reason).toBe('journal');
    expect(world.ports.submit).not.toHaveBeenCalled();
  });

  it('refuses an id that is not one of the three, rather than rendering the wrong plates under it', async () => {
    const world = mintWorld(KEEPING.id);
    await expect(world.run({ collectionId: 'c-not-a-collection' })).rejects.toThrow(/is not a collection/);
  });

  it('plans a plate of the named collection, with that collection in the plan header', async () => {
    const world = mintWorld(OMISSION.id);
    const plan = await planPiece({
      index: 3,
      collectionId: OMISSION.id,
      fetchImpl: world.ports.fetchImpl,
      senderAddress: WALLETS.skeptic.address,
      env: ENV
    });
    expect(plan.body).toBe(OMISSION.renderPiece(3));
    expect(plan.wizard.id).toBe('skeptic');
    expect(plan.askUstx).toBe(OMISSION.price.pieceUstx);
    const text = formatCollectionPlan(plan, { broadcast: false });
    expect(text).toContain('collection  : c-omission-001  (What the Hash Omits)');
    expect(text).toContain('piece       : 3 of 8  (seal)');
  });
});

/* ------------------------------------------------------------------ */
/* what would be listed                                                */
/* ------------------------------------------------------------------ */

describe('the listing plan', () => {
  it('lists every plate plus the manifest, at that collection price', () => {
    const plan = collectionListingPlan({ collectionId: KEEPING.id, ids: idsFor(KEEPING.id) });
    expect(plan.rows).toHaveLength(9);
    expect(plan.listable).toHaveLength(9);
    expect(plan.wizard).toBe('archivist');
    expect(plan.market.key).toBe(DEFAULT_LISTING_MARKET);
    for (const row of plan.rows.slice(0, 8)) expect(row.askUstx).toBe(KEEPING.price.pieceUstx);
    expect(plan.rows.at(-1)?.askUstx).toBe(KEEPING.price.manifestUstx);
    expect(plan.totalAskUstx).toBe(KEEPING.price.pieceUstx * 8n + KEEPING.price.manifestUstx);
    expect(plan.escrowUstx).toBe(MIN_FEE_BUDGET_USTX * 9n);
  });

  it('scales the price into each market own unit rather than carrying the number across', () => {
    // 2,500,000 microSTX is 2.5 STX and would be 0.025 BTC if the number were
    // carried unchanged, which on the one market whose buyers are not the fleet
    // is a listing worth roughly a thousand times what was intended.
    const stx = collectionListingPlan({ collectionId: KEEPING.id, ids: idsFor(KEEPING.id), market: 'stx' });
    const sbtc = collectionListingPlan({ collectionId: KEEPING.id, ids: idsFor(KEEPING.id), market: 'sbtc' });
    expect(stx.rows[0].priceAmount).toBe(2_500_000n);
    expect(sbtc.rows[0].priceAmount).toBe(25_000n);
    expect(sbtc.rows[0].priceLabel).toContain('sBTC');
  });

  it('says what is not listable instead of inventing an id for it', () => {
    const plan = collectionListingPlan({ collectionId: OMISSION.id, ids: { 1: '11', 3: '13' } });
    expect(plan.listable.map((row) => row.key)).toEqual(['1', '3']);
    expect(plan.missing).toHaveLength(7);
    expect(plan.rows[1].command).toBeNull();
  });

  it('hands off a runnable market-run command per row, against the same code path', () => {
    const plan = collectionListingPlan({ collectionId: OMISSION.id, ids: idsFor(OMISSION.id) });
    expect(plan.rows[0].command).toBe(
      'node scripts/wizard/market-run.mjs --run c-omission-001-1 --scenario list-stx --token-stx 501 ' +
        '--seller skeptic --price-ustx 500000 --broadcast'
    );
    expect(plan.rows.at(-1)?.command).toContain('--run c-omission-001-manifest');
    expect(listingRunIdFor({ collectionId: 'c-keeping-001', key: '4' })).toBe('c-keeping-001-4');
  });

  it('prints the price and the argument for it, not just the number', () => {
    const text = formatCollectionListingPlan(
      collectionListingPlan({ collectionId: KEEPING.id, ids: idsFor(KEEPING.id) })
    );
    expect(text).toContain('The Cost of Keeping, by Wizard-1, the Archivist');
    expect(text).toContain('why this price:');
    expect(text).toContain(KEEPING.pricing.reasoning.slice(0, 40));
    expect(text).toContain('a price and not a prediction');
    expect(text).toContain('cannot be overridden');
  });

  it('refuses a market that would reject a v3 inscription', () => {
    expect(() => collectionListingPlan({ collectionId: KEEPING.id, market: 'xtrata-market-v1-1' })).toThrow(
      /not one of the markets/
    );
  });
});

describe('where the ids come from', () => {
  it('takes only confirmed and adopted records out of a mint journal', () => {
    const journal = {
      pieces: {
        1: { status: 'confirmed', inscriptionId: '901' },
        2: { status: 'external', inscriptionId: '902' },
        3: { status: 'broadcast', inscriptionId: null, txid: '0xabc' },
        4: { status: 'broadcasting', inscriptionId: null },
        manifest: { status: 'confirmed', inscriptionId: '909' }
      }
    };
    expect(idsFromMintJournal(journal)).toEqual({ 1: '901', 2: '902', manifest: '909' });
    expect(idsFromMintJournal(null)).toEqual({});
  });

  it('lets an operator id override the journal, and drops keys the collection does not have', () => {
    const resolved = listingIdsFor({
      art: MACHINERY,
      ids: ['1', '2'],
      manifestId: '99',
      journal: { pieces: { 1: { status: 'confirmed', inscriptionId: '901' }, 3: { status: 'confirmed', inscriptionId: '903' } } }
    });
    expect(resolved).toEqual({ 1: '1', 2: '2', 3: '903', manifest: '99' });

    const overflow = listingIdsFor({ art: MACHINERY, ids: Array.from({ length: 12 }, (_, i) => String(i)), manifestId: null, journal: null });
    expect(Object.keys(overflow).sort()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
  });
});

/* ------------------------------------------------------------------ */
/* the sweep                                                           */
/* ------------------------------------------------------------------ */

describe('a wizard lists its own collection', () => {
  // The market runner's dry submit port announces every application on the
  // terminal directly rather than through an injected port, so twenty-seven
  // fake transactions here would be twenty-seven lines of noise in a test run.
  // Silenced for this block only, and only for stdout.
  let quiet: ReturnType<typeof vi.spyOn>;
  beforeAll(() => {
    quiet = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterAll(() => quiet.mockRestore());

  const sweepWorld = (collectionId: string, base = 500) => {
    const art = getCollection(collectionId);
    const ids = idsFor(collectionId, base);
    const { chain, ports } = listingDryPorts({ art, ids, wallets: WALLETS, minerFeeUstx: MINER_FEE, out: () => {} });
    return {
      art,
      ids,
      chain,
      ports,
      list: (overrides: Record<string, unknown> = {}) =>
        listCollection({
          ports,
          options: {
            collectionId,
            ids,
            broadcast: false,
            env: ENV,
            wallets: WALLETS,
            journalDir: JOURNAL_DIR,
            confirmTimeoutMs: 120_000,
            confirmPollMs: 0,
            minerFeeUstx: MINER_FEE,
            ...overrides
          }
        })
    };
  };

  it('lists all nine, each at the collection own price, with nothing broadcast', async () => {
    const world = sweepWorld(KEEPING.id);
    const result = await world.list();

    expect(result.ok, JSON.stringify(result.halted)).toBe(true);
    expect(result.rows).toHaveLength(9);
    expect(result.rows.every((row) => row.status === 'passed')).toBe(true);
    expect(result.rows.every((row) => row.listingId !== null)).toBe(true);
    expect(result.mode).toBe('dry');
    for (const row of result.rows.slice(0, 8)) expect(row.askUstx).toBe(KEEPING.price.pieceUstx);
    expect(result.rows.at(-1)?.askUstx).toBe(KEEPING.price.manifestUstx);
  });

  it('escrows the token and the STX fee budget for each one, as the contract does', async () => {
    const world = sweepWorld(OMISSION.id, 700);
    const market = world.chain.markets.get(
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-stx-v1-1'
    );
    await world.list();
    expect(market.listings.size).toBe(9);
    for (const listing of market.listings.values()) {
      expect(listing.seller).toBe(WALLETS.skeptic.address);
      expect(BigInt(listing.feeBudget)).toBe(MIN_FEE_BUDGET_USTX);
    }
    // The escrowed budget is real: it left the seller and it is held by the
    // market principal until a cancel or a settle.
    expect(world.chain.balanceOf('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-stx-v1-1')).toBe(
      MIN_FEE_BUDGET_USTX * 9n
    );
  });

  it('gives each member its own resumable journal, so a sweep is not one all-or-nothing run', async () => {
    const world = sweepWorld(MACHINERY.id, 800);
    const result = await world.list();
    const paths = result.rows.map((row) => row.journalPath);
    expect(new Set(paths).size).toBe(9);
    expect(paths[0]).toContain('.market-c-machinery-001-1.dry.json');
    expect(paths.at(-1)).toContain('.market-c-machinery-001-manifest.dry.json');
  });

  it('lists only what --only names', async () => {
    const world = sweepWorld(KEEPING.id, 900);
    const result = await world.list({ only: ['2', 'manifest'] });
    expect(result.rows.map((row) => row.key)).toEqual(['2', 'manifest']);
    expect(result.ok).toBe(true);
  });

  it('refuses to sell a collection out of a wallet that did not mint it', async () => {
    const world = sweepWorld(KEEPING.id, 1_000);
    const result = await world.list({ wallets: { skeptic: WALLETS.skeptic } });
    expect(result.ok).toBe(false);
    expect(result.halted?.reason).toBe('safety');
    expect(result.halted?.message).toMatch(/listed by the wizard that minted it/);
    expect(result.rows).toHaveLength(0);
  });

  it('halts rather than listing nothing when no id is known', async () => {
    const world = sweepWorld(KEEPING.id, 1_100);
    const result = await world.list({ ids: {} });
    expect(result.ok).toBe(false);
    expect(result.halted?.reason).toBe('predecessor');
    expect(result.halted?.message).toMatch(/nothing to list/);
  });

  it('stops at the sweep cap, which no single market run could see', async () => {
    // Each listing commits the 50,000 budget plus a 30,000 miner fee. A cap of
    // 200,000 admits two and refuses the third.
    const world = sweepWorld(OMISSION.id, 1_200);
    const result = await world.list({ runSpendCapUstx: 200_000n });
    expect(result.ok).toBe(false);
    expect(result.halted?.reason).toBe('spend-cap');
    expect(result.rows).toHaveLength(2);
    expect(result.halted?.message).toMatch(/Nothing was sent/);
  });

  it('is checked between every listing, not only at the start', async () => {
    const world = sweepWorld(MACHINERY.id, 1_300);
    let listed = 0;
    world.ports.killSwitch = () => (listed >= 3 ? 'KILL exists' : null);
    const original = world.ports.submit;
    world.ports.submit = (async (input: any) => {
      listed += 1;
      return original(input);
    }) as typeof original;

    const result = await world.list();
    expect(result.ok).toBe(false);
    expect(result.halted?.reason).toBe('kill-switch');
    // Either guard may be the one that catches it — the sweep checks between
    // members and the market run checks between steps — and both name the
    // member. What must not happen is the sweep carrying on to the next one.
    expect(result.halted?.message).toMatch(/kill switch engaged/);
    expect(result.halted?.message).toMatch(/listing/);
    expect(result.rows.length).toBeLessThan(9);
  });

  it('refuses if the dry submit port is ever asked to broadcast', async () => {
    const world = sweepWorld(MACHINERY.id, 1_400);
    await expect(
      world.ports.submit({ call: { contractId: 'x', functionName: 'y', functionArgs: [] }, broadcast: true, senderAddress: WALLETS.builder.address })
    ).rejects.toThrow(/cannot, and it did not/);
  });

  it('reports what it did, and says a listing is an offer and not a sale', async () => {
    const world = sweepWorld(KEEPING.id, 1_500);
    const text = formatCollectionListingReport(await world.list());
    expect(text).toContain('c-keeping-001');
    expect(text).toContain('2.5 STX');
    expect(text).toContain('Nothing was signed and nothing was sent');
    expect(text).toContain('comes back on a cancel');
  });

  it('says a broadcast sweep sold nothing, because a listing is an offer', () => {
    const text = formatCollectionListingReport({
      ok: true,
      halted: null,
      collectionId: KEEPING.id,
      collectionTitle: KEEPING.title,
      market: 'stx',
      broadcast: true,
      rows: [],
      committedUstx: 0n,
      runSpendCapUstx: DEFAULT_LISTING_RUN_SPEND_CAP_USTX
    } as never);
    expect(text).toContain('Nothing has been bought; a listing is an offer.');
  });
});

/* ------------------------------------------------------------------ */
/* the terminal wiring                                                 */
/* ------------------------------------------------------------------ */

describe('the dry mint ports', () => {
  it('mint into the fake chain under the collection wizard address, not always the Builder', async () => {
    const chain = makeFakeChain({ tip: TIP, feeUstx: FEE });
    const ports = dryPorts({ chain, wallets: WALLETS, wizard: 'archivist', out: () => {} });
    await ports.submit({ plan: { body: KEEPING.renderPiece(1) }, broadcast: false, wizardId: 'archivist', minerFeeUstx: MINER_FEE });
    const [entry] = [...chain.inscriptions.values()];
    expect(entry.creator).toBe(WALLETS.archivist.address);
    expect(entry.body).toBe(KEEPING.renderPiece(1));
  });

  it('refuse to broadcast', async () => {
    const chain = makeFakeChain({ tip: TIP, feeUstx: FEE });
    const ports = dryPorts({ chain, wallets: WALLETS, out: () => {} });
    await expect(ports.submit({ plan: { body: 'x' }, broadcast: true, wizardId: 'builder' })).rejects.toThrow(
      /cannot, and it did not/
    );
  });
});
