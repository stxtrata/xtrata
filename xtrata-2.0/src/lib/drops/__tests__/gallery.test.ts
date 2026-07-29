import { describe, expect, it } from 'vitest';
import {
  applyDropGalleryOwners,
  buildDropGalleryItems,
  dropGalleryHref,
  dropGalleryItemLabel,
  dropGalleryMediaTarget,
  dropGalleryOwnerKey,
  groupDropGalleries,
  parseDropGallerySelection,
  selectDropGallery,
  sortDropGalleryItems
} from '../gallery';
import { parseDropEventForTest, type DropActivityEvent } from '../history';

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v1-1';
const NFT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const CREATOR = 'SP10WCSMCVHRT4A5H2E4V7JBEP0MJT6RQPP5S1BS4';
const HOLDER_A = 'SP2VV8Z6RMT0TTB4KVWD97HEVD3VCDXFARK7XQEF2';
const HOLDER_B = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const TRADER = 'SP1G3R7SP9DAJXNXFTB9C3WFXHCM0TWNP8VMSFAB6';

/**
 * The one real captured mainnet payload from history.test.ts, re-used here so
 * the gallery is proven to build from the exact bytes the chain emits (drop 6,
 * edition 6, campaign 0, inscription 2846, claimed by SP2VV8…EF2).
 */
const CLAIM_CAMPAIGN_HEX =
  '0x0c0000000907626e732d6b65790a0200000020b09e11344fbf0b45715aa180df447930e3da9ed790fa1848201d6aa83925a6cd' +
  '0b63616d706169676e2d6964010000000000000000000000000000000007636c61696d65720516b7b47cd8a681ad2c93df1a93c5db68f6c6f5eac4' +
  '0763726561746f72051641c139d4394e910afadb7ff2b32ee14b273eb5180764726f702d69640100000000000000000000000000000006' +
  '0765646974696f6e0a0100000000000000000000000000000006056576656e740d0000000e636c61696d2d63616d706169676e' +
  '0c6e66742d636f6e74726163740616e55cbbaafd88b6e63b036a3a2303b029e039cbbd0d7874726174612d76332d322d33' +
  '08746f6b656e2d69640100000000000000000000000000000b1e';

const capturedClaim = (): DropActivityEvent =>
  parseDropEventForTest({
    event_index: 3,
    event_type: 'smart_contract_log',
    tx_id: '0xclaim6',
    block_height: 990,
    block_time_iso: '2026-07-02T10:00:00.000Z',
    contract_log: { topic: 'print', value: { hex: CLAIM_CAMPAIGN_HEX } }
  })!;

let sequence = 0;
const event = (partial: Partial<DropActivityEvent> & { type: DropActivityEvent['type']; dropId: bigint }): DropActivityEvent => {
  sequence += 1;
  return {
    id: `evt-${sequence}`,
    eventIndex: 1,
    blockHeight: 1000,
    txId: `0xtx${sequence}`,
    ...partial
  } as DropActivityEvent;
};

/**
 * A realistic campaign: three claimed editions, one cancelled drop, one drop
 * still live, plus a settle-refund (the event that deletes the on-chain row)
 * and a duplicate re-emitted claim.
 */
const campaignEvents = (): DropActivityEvent[] => [
  event({
    type: 'create-campaign-drop',
    dropId: 1n,
    campaignId: 0n,
    edition: 0n,
    tokenId: 2840n,
    nftContract: NFT,
    creator: CREATOR,
    funder: CREATOR,
    blockHeight: 900,
    timestamp: '2026-07-01T00:00:00.000Z'
  }),
  event({
    type: 'create-campaign-drop',
    dropId: 2n,
    campaignId: 0n,
    edition: 1n,
    tokenId: 2841n,
    nftContract: NFT,
    creator: CREATOR,
    blockHeight: 901
  }),
  event({
    type: 'create-campaign-drop',
    dropId: 3n,
    campaignId: 0n,
    edition: 2n,
    tokenId: 2842n,
    nftContract: NFT,
    creator: CREATOR,
    blockHeight: 902
  }),
  event({
    type: 'create-campaign-drop',
    dropId: 4n,
    campaignId: 0n,
    edition: 3n,
    tokenId: 2843n,
    nftContract: NFT,
    creator: CREATOR,
    blockHeight: 903
  }),
  // drop 3 claimed, then re-emitted at the same height (indexer replay).
  event({
    type: 'claim-campaign',
    dropId: 3n,
    campaignId: 0n,
    edition: 2n,
    tokenId: 2842n,
    nftContract: NFT,
    creator: CREATOR,
    claimer: HOLDER_A,
    blockHeight: 950,
    eventIndex: 2,
    txId: '0xclaim3',
    timestamp: '2026-07-02T00:00:00.000Z'
  }),
  event({
    type: 'claim-campaign',
    dropId: 3n,
    campaignId: 0n,
    edition: 2n,
    tokenId: 2842n,
    nftContract: NFT,
    creator: CREATOR,
    claimer: HOLDER_A,
    blockHeight: 950,
    eventIndex: 2,
    txId: '0xclaim3',
    timestamp: '2026-07-02T00:00:00.000Z'
  }),
  event({
    type: 'claim-campaign',
    dropId: 1n,
    campaignId: 0n,
    edition: 0n,
    tokenId: 2840n,
    nftContract: NFT,
    creator: CREATOR,
    claimer: HOLDER_B,
    blockHeight: 951,
    txId: '0xclaim1'
  }),
  // settle-refund deletes the Drops row; the item must survive it.
  event({ type: 'settle-refund', dropId: 3n, campaignId: 0n, blockHeight: 952 }),
  event({ type: 'claim-fee', dropId: 3n, blockHeight: 952, eventIndex: 4 }),
  // drop 2 was cancelled by its creator, never claimed.
  event({
    type: 'cancel-drop',
    dropId: 2n,
    campaignId: 0n,
    tokenId: 2841n,
    nftContract: NFT,
    creator: CREATOR,
    blockHeight: 953,
    txId: '0xcancel2'
  }),
  // A legacy, non-campaign drop that lives in its own gallery.
  event({
    type: 'create-drop',
    dropId: 90n,
    tokenId: 107n,
    groupId: 1n,
    nftContract: NFT,
    creator: CREATOR,
    blockHeight: 800
  }),
  event({
    type: 'claim',
    dropId: 90n,
    tokenId: 107n,
    groupId: 1n,
    nftContract: NFT,
    creator: CREATOR,
    claimer: HOLDER_B,
    blockHeight: 810,
    txId: '0xclaim90'
  })
];

describe('drop gallery — building the model from durable events', () => {
  it('builds one item per drop from a mixed event set', () => {
    const items = buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT });
    expect(items).toHaveLength(5);
    const byDrop = new Map(items.map((item) => [item.dropId.toString(), item]));
    expect(byDrop.get('1')!.status).toBe('claimed');
    expect(byDrop.get('2')!.status).toBe('cancelled');
    expect(byDrop.get('3')!.status).toBe('claimed');
    expect(byDrop.get('4')!.status).toBe('live');
    expect(byDrop.get('90')!.status).toBe('claimed');
  });

  it('keeps a claimed drop and its holder after settle-refund deletes the row', () => {
    const items = buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT });
    const settled = items.find((item) => item.dropId === 3n)!;
    expect(settled.settled).toBe(true);
    expect(settled.status).toBe('claimed');
    expect(settled.holder).toBe(HOLDER_A);
    expect(settled.tokenId).toBe(2842n);
    expect(settled.claimTxId).toBe('0xclaim3');
    expect(settled.claimBlockHeight).toBe(950);
    expect(settled.claimedAt).toBe('2026-07-02T00:00:00.000Z');
  });

  it('collapses duplicate and re-emitted claim events into one item', () => {
    const events = campaignEvents();
    const items = buildDropGalleryItems(events, { contractId: CONTRACT });
    expect(items.filter((item) => item.dropId === 3n)).toHaveLength(1);
    // Feeding the same events twice (two API pages overlapping) is idempotent.
    const doubled = buildDropGalleryItems(events.concat(events), { contractId: CONTRACT });
    expect(doubled).toHaveLength(items.length);
    expect(doubled.find((item) => item.dropId === 3n)!.holder).toBe(HOLDER_A);
  });

  it('lets the latest claim win when a drop is re-claimed at a later height', () => {
    const events = campaignEvents().concat([
      event({
        type: 'claim-campaign',
        dropId: 4n,
        campaignId: 0n,
        edition: 3n,
        tokenId: 2843n,
        nftContract: NFT,
        claimer: HOLDER_A,
        blockHeight: 960,
        txId: '0xfirst'
      }),
      event({
        type: 'claim-campaign',
        dropId: 4n,
        campaignId: 0n,
        edition: 3n,
        tokenId: 2843n,
        nftContract: NFT,
        claimer: HOLDER_B,
        blockHeight: 961,
        txId: '0xsecond'
      })
    ]);
    const item = buildDropGalleryItems(events, { contractId: CONTRACT }).find(
      (candidate) => candidate.dropId === 4n
    )!;
    expect(item.holder).toBe(HOLDER_B);
    expect(item.claimTxId).toBe('0xsecond');
  });

  it('does not invent items from fee or settlement events alone', () => {
    const items = buildDropGalleryItems(
      [
        event({ type: 'settle-refund', dropId: 777n }),
        event({ type: 'claim-fee', dropId: 778n })
      ],
      { contractId: CONTRACT }
    );
    expect(items).toEqual([]);
  });

  it('a stale cancel re-emit cannot un-claim a claimed drop', () => {
    const items = buildDropGalleryItems(
      [
        event({ type: 'create-campaign-drop', dropId: 5n, campaignId: 0n, edition: 4n, blockHeight: 10 }),
        event({ type: 'claim-campaign', dropId: 5n, campaignId: 0n, claimer: HOLDER_A, blockHeight: 20 }),
        event({ type: 'cancel-drop', dropId: 5n, campaignId: 0n, blockHeight: 30 })
      ],
      { contractId: CONTRACT }
    );
    expect(items[0].status).toBe('claimed');
    expect(items[0].holder).toBe(HOLDER_A);
  });

  it('builds from the real captured mainnet claim payload', () => {
    const items = buildDropGalleryItems([capturedClaim()], { contractId: CONTRACT });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      dropId: 6n,
      tokenId: 2846n,
      edition: 6n,
      campaignId: 0n,
      holder: 'SP2VV8Z6RMT0TTB4KVWD97HEVD3VCDXFARK7XQEF2',
      status: 'claimed'
    });
    expect(items[0].nftContract).toContain('xtrata-v3-2-3');
    expect(items[0].bnsKey).toMatch(/^[0-9a-f]{64}$/);
  });

  it('merges live contract-state drops that have not emitted a claim', () => {
    const items = buildDropGalleryItems([], {
      contractId: CONTRACT,
      liveDrops: [
        {
          contractId: CONTRACT,
          dropId: 50n,
          tokenId: 3000n,
          nftContract: NFT,
          creator: CREATOR,
          campaignId: 1n,
          edition: 0n,
          claimer: null,
          claimedAt: null
        }
      ]
    });
    expect(items).toHaveLength(1);
    expect(items[0].status).toBe('live');
    expect(items[0].tokenId).toBe(3000n);
  });
});

describe('drop gallery — sorting and campaign grouping', () => {
  it('sorts by edition, not by drop id or event order', () => {
    const items = buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT }).filter(
      (item) => item.campaignId === 0n
    );
    expect(items.map((item) => item.edition)).toEqual([0n, 1n, 2n, 3n]);
  });

  it('sorts drops without an edition after the numbered ones', () => {
    const sorted = sortDropGalleryItems([
      { ...buildDropGalleryItems([event({ type: 'create-drop', dropId: 9n })], { contractId: CONTRACT })[0] },
      ...buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT }).filter(
        (item) => item.campaignId === 0n
      )
    ]);
    expect(sorted[sorted.length - 1].edition).toBeNull();
  });

  it('groups campaign drops and legacy drops into separate galleries', () => {
    const galleries = groupDropGalleries(
      buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT })
    );
    expect(galleries.map((gallery) => gallery.id)).toEqual(['campaign-0', 'standalone']);
    expect(galleries.map((gallery) => gallery.scope)).toEqual(['campaign', 'standalone']);
    expect(galleries[0].items).toHaveLength(4);
    expect(galleries[0].totals).toEqual({ total: 4, claimed: 2, cancelled: 1, live: 1 });
    expect(galleries[0].holders).toEqual([HOLDER_B, HOLDER_A]);
    expect(galleries[1].items).toHaveLength(1);
    expect(galleries[1].title).toBe('Standalone drops');
  });
});

describe('drop gallery — URL selection', () => {
  it('parses campaign, item and all selections', () => {
    expect(parseDropGallerySelection(new URLSearchParams('campaign=0'))).toMatchObject({
      active: true,
      campaignId: 0n,
      dropId: null,
      all: false
    });
    expect(parseDropGallerySelection(new URLSearchParams('campaign=all'))).toMatchObject({
      active: true,
      all: true
    });
    expect(parseDropGallerySelection(new URLSearchParams('item=32'))).toMatchObject({
      active: true,
      dropId: 32n
    });
    expect(parseDropGallerySelection(new URLSearchParams(''))).toMatchObject({ active: false });
    expect(parseDropGallerySelection(new URLSearchParams('campaign=abc'))).toMatchObject({
      active: false
    });
    expect(parseDropGallerySelection(null)).toMatchObject({ active: false });
  });

  it('never uses ?gallery=, which the shell router hands to the Xplorer', () => {
    expect(dropGalleryHref({ campaignId: 0n })).toBe('/drops?campaign=0');
    expect(dropGalleryHref({ campaignId: 0n, dropId: 6n })).toBe('/drops?campaign=0&item=6');
    expect(dropGalleryHref({ all: true })).toBe('/drops?campaign=all');
    expect(dropGalleryHref({})).toBe('/drops');
    expect(dropGalleryHref({ campaignId: 0n })).not.toContain('gallery=');
  });

  it('round-trips a link back into the same gallery', () => {
    const items = buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT });
    const href = dropGalleryHref({ campaignId: 0n });
    const selection = parseDropGallerySelection(new URLSearchParams(href.split('?')[1]));
    const gallery = selectDropGallery(items, selection)!;
    expect(gallery.id).toBe('campaign-0');
    expect(gallery.items).toHaveLength(4);
  });

  it('selects a single drop and every drop', () => {
    const items = buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT });
    const single = selectDropGallery(items, parseDropGallerySelection(new URLSearchParams('item=3')))!;
    expect(single.title).toBe('Drop #3');
    expect(single.items).toHaveLength(1);
    expect(single.campaignId).toBe(0n);
    // Scope, not item count, decides whether "of N" can be printed: a
    // single-drop view holds one item and must not claim "edition 3 of 1".
    expect(single.scope).toBe('drop');

    const all = selectDropGallery(items, parseDropGallerySelection(new URLSearchParams('campaign=all')))!;
    expect(all.items).toHaveLength(5);
    expect(all.scope).toBe('all');
    expect(
      selectDropGallery(items, parseDropGallerySelection(new URLSearchParams('campaign=0')))!.scope
    ).toBe('campaign');
  });

  it('selects the legacy, non-campaign drops on their own', () => {
    const items = buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT });
    const selection = parseDropGallerySelection(new URLSearchParams('campaign=none'));
    expect(selection).toMatchObject({ active: true, standalone: true, campaignId: null });
    const gallery = selectDropGallery(items, selection)!;
    expect(gallery.items).toHaveLength(1);
    expect(gallery.items[0].dropId).toBe(90n);
    expect(dropGalleryHref({ standalone: true })).toBe('/drops?campaign=none');
  });

  it('returns null for a selection that matches nothing', () => {
    const items = buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT });
    expect(selectDropGallery(items, parseDropGallerySelection(new URLSearchParams('campaign=9')))).toBeNull();
    expect(selectDropGallery(items, parseDropGallerySelection(new URLSearchParams('item=4242')))).toBeNull();
    expect(selectDropGallery(items, parseDropGallerySelection(new URLSearchParams('')))).toBeNull();
    expect(selectDropGallery([], parseDropGallerySelection(new URLSearchParams('campaign=all')))).toBeNull();
  });
});

describe('drop gallery — holder vs current owner', () => {
  const items = () => buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT });

  it('flags divergence when the claimed inscription has since been traded', () => {
    const owners = new Map<string, string | null>([
      [`${NFT}:2842`, TRADER],
      [`${NFT}:2840`, HOLDER_B]
    ]);
    const joined = applyDropGalleryOwners(items(), owners);
    const traded = joined.find((item) => item.dropId === 3n)!;
    expect(traded.holder).toBe(HOLDER_A);
    expect(traded.owner).toBe(TRADER);
    expect(traded.ownerDiverged).toBe(true);

    const held = joined.find((item) => item.dropId === 1n)!;
    expect(held.ownerDiverged).toBe(false);
    expect(held.ownerKnown).toBe(true);
  });

  it('ignores case when comparing the holder against the current owner', () => {
    const joined = applyDropGalleryOwners(
      items(),
      new Map([[`${NFT}:2842`, HOLDER_A.toLowerCase()]])
    );
    expect(joined.find((item) => item.dropId === 3n)!.ownerDiverged).toBe(false);
  });

  it('leaves the item intact when the owner lookup failed or has not run', () => {
    const notLookedUp = applyDropGalleryOwners(items(), new Map());
    expect(notLookedUp.every((item) => item.ownerKnown === false)).toBe(true);
    expect(notLookedUp.find((item) => item.dropId === 3n)!.holder).toBe(HOLDER_A);

    // An explicit null (read failed / token burned) must not read as divergence.
    const failed = applyDropGalleryOwners(items(), new Map([[`${NFT}:2842`, null]]));
    const item = failed.find((candidate) => candidate.dropId === 3n)!;
    expect(item.ownerKnown).toBe(false);
    expect(item.ownerDiverged).toBe(false);
    expect(item.holder).toBe(HOLDER_A);
  });

  it('keys owner lookups by NFT contract and token, and skips tokenless drops', () => {
    const [first] = items();
    expect(dropGalleryOwnerKey(first)).toBe(`${NFT}:${first.tokenId}`);
    const tokenless = buildDropGalleryItems([event({ type: 'create-drop', dropId: 9n })], {
      contractId: CONTRACT
    })[0];
    expect(dropGalleryOwnerKey(tokenless)).toBeNull();
  });
});

describe('drop gallery — media and labels', () => {
  it('produces a market-compatible media target so thumbnail caches are reused', () => {
    const item = buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT }).find(
      (candidate) => candidate.dropId === 3n
    )!;
    const entry = { network: 'mainnet' };
    expect(dropGalleryMediaTarget(item, entry)).toEqual({
      contractId: CONTRACT,
      listingId: 3n,
      dropId: 3n,
      tokenId: 2842n,
      nftContract: NFT,
      entry
    });
  });

  it('falls back to null (placeholder tile) when the drop has no renderable token', () => {
    const tokenless = buildDropGalleryItems([event({ type: 'create-drop', dropId: 9n })], {
      contractId: CONTRACT
    })[0];
    expect(dropGalleryMediaTarget(tokenless)).toBeNull();

    const noContract = buildDropGalleryItems(
      [event({ type: 'create-drop', dropId: 11n, tokenId: 5n })],
      { contractId: CONTRACT }
    )[0];
    expect(dropGalleryMediaTarget(noContract)).toBeNull();
  });

  it('labels editions from one, and falls back to the drop id', () => {
    const items = buildDropGalleryItems(campaignEvents(), { contractId: CONTRACT });
    const edition = items.find((item) => item.dropId === 3n)!;
    expect(dropGalleryItemLabel(edition, 33)).toBe('Edition 3 of 33');
    expect(dropGalleryItemLabel(edition)).toBe('Edition 3');
    const legacy = items.find((item) => item.dropId === 90n)!;
    expect(dropGalleryItemLabel(legacy)).toBe('Drop #90');
  });
});
