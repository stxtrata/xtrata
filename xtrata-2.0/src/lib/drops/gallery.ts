import type { DropActivityEvent } from './history';
import { isClaimActivity, isCreateActivity } from './history';

/**
 * Historic drop gallery model.
 *
 * WHY THIS EXISTS: `settle-refund` DELETES the contract's `Drops` map row
 * (xtrata-drops-v1.1.clar), so once a claimed drop settles, `get-drop` returns
 * `none` and the drop vanishes from every state read. The print events are the
 * only durable record of the drop and its holder, so the gallery is built from
 * those events and joined with live NFT ownership — never from `get-drop`.
 *
 * Everything here is pure so the shaping can be tested without a chain, a DOM
 * or a network. The renderer in src/home/main.js only paints what comes out.
 */

export type DropGalleryStatus = 'claimed' | 'cancelled' | 'live' | 'unknown';

export type DropGalleryItem = {
  /** Stable identity: `${contractId}:${dropId}`. */
  key: string;
  contractId: string;
  dropId: bigint;
  /** Market-compatible alias so marketMediaFor / thumbnail caches work as-is. */
  listingId: bigint;
  tokenId: bigint | null;
  nftContract: string | null;
  campaignId: bigint | null;
  edition: bigint | null;
  groupId: bigint | null;
  creator: string | null;
  funder: string | null;
  /** The wallet that claimed the drop, per the claim event. Never changes. */
  holder: string | null;
  /** Current on-chain owner, joined in later. May differ once traded. */
  owner: string | null;
  ownerKnown: boolean;
  ownerDiverged: boolean;
  status: DropGalleryStatus;
  /** True once settle-refund has run, i.e. the Drops row is gone for good. */
  settled: boolean;
  claimTxId: string | null;
  createTxId: string | null;
  cancelTxId: string | null;
  claimBlockHeight: number | null;
  claimedAt: string | null;
  createdAt: string | null;
  bnsKey: string | null;
};

export type DropGalleryTotals = {
  total: number;
  claimed: number;
  cancelled: number;
  live: number;
};

export type DropGallery = {
  /** URL-ish id: `campaign-0`, `drop-6` or `standalone`. */
  id: string;
  /**
   * What the gallery represents. Only a `campaign` gallery holds the complete
   * edition set, so only it can say "edition 7 of 33" — a single-drop view
   * would otherwise claim "edition 33 of 1".
   */
  scope: 'campaign' | 'standalone' | 'all' | 'drop';
  campaignId: bigint | null;
  title: string;
  items: DropGalleryItem[];
  totals: DropGalleryTotals;
  /** Unique claiming wallets, in gallery order. */
  holders: string[];
  /** Unique current owners that are known, in gallery order. */
  owners: string[];
  creators: string[];
};

/** A live (unsettled) drop read from contract state, in readDrops' shape. */
export type DropGalleryLiveDrop = {
  contractId?: string;
  dropId: bigint;
  tokenId?: bigint | null;
  nftContract?: string | null;
  creator?: string | null;
  groupId?: bigint | null;
  campaignId?: bigint | null;
  edition?: bigint | null;
  claimer?: string | null;
  claimedAt?: bigint | null;
};

export type BuildDropGalleryOptions = {
  /** Contract the events came from; used for the item key. */
  contractId?: string;
  /** Live drops still present in contract state (unsettled). */
  liveDrops?: readonly DropGalleryLiveDrop[];
};

const addressesMatch = (a: string | null, b: string | null) =>
  Boolean(a && b && a.trim().toUpperCase() === b.trim().toUpperCase());

/**
 * Chain order for one event. Hiro returns newest first and re-emits can repeat
 * an id, so every merge decision is made on this rank rather than array order.
 */
const eventRank = (event: DropActivityEvent) =>
  (event.blockHeight ?? 0) * 100_000 + (event.eventIndex ?? 0);

const compareBigints = (a: bigint, b: bigint) => (a === b ? 0 : a < b ? -1 : 1);

const compareOptionalBigints = (a: bigint | null, b: bigint | null) => {
  if (a === null && b === null) return 0;
  // Unknown editions sort after known ones rather than pretending to be 0.
  if (a === null) return 1;
  if (b === null) return -1;
  return compareBigints(a, b);
};

const emptyItem = (contractId: string, dropId: bigint): DropGalleryItem => ({
  key: `${contractId}:${dropId}`,
  contractId,
  dropId,
  listingId: dropId,
  tokenId: null,
  nftContract: null,
  campaignId: null,
  edition: null,
  groupId: null,
  creator: null,
  funder: null,
  holder: null,
  owner: null,
  ownerKnown: false,
  ownerDiverged: false,
  status: 'unknown',
  settled: false,
  claimTxId: null,
  createTxId: null,
  cancelTxId: null,
  claimBlockHeight: null,
  claimedAt: null,
  createdAt: null,
  bnsKey: null
});

/** Fill a field only if it is still unknown; earliest authoritative value wins. */
const fill = <T>(current: T | null, next: T | null | undefined): T | null =>
  current !== null && current !== undefined ? current : (next ?? null);

/**
 * Sort a gallery: campaign first, then edition, then drop id. Editions are the
 * artist-facing ordering (1 of 33, 2 of 33 …) so they lead where they exist.
 */
export const sortDropGalleryItems = (items: readonly DropGalleryItem[]): DropGalleryItem[] =>
  [...items].sort((a, b) => {
    const byCampaign = compareOptionalBigints(a.campaignId, b.campaignId);
    if (byCampaign !== 0) return byCampaign;
    const byEdition = compareOptionalBigints(a.edition, b.edition);
    if (byEdition !== 0) return byEdition;
    return compareBigints(a.dropId, b.dropId);
  });

/**
 * Build the historic gallery items from durable print events, optionally
 * merging in drops that are still live in contract state.
 *
 * Only create / claim / cancel events mint an item: claim-fee and settle-refund
 * carry no token, so on their own they would produce a ghost row for a drop
 * whose real events have scrolled out of the event window.
 */
export const buildDropGalleryItems = (
  events: readonly DropActivityEvent[],
  options: BuildDropGalleryOptions = {}
): DropGalleryItem[] => {
  const contractId = options.contractId ?? '';
  const items = new Map<string, DropGalleryItem>();
  const claimRanks = new Map<string, number>();

  const ordered = [...events].sort((a, b) => eventRank(a) - eventRank(b));

  for (const event of ordered) {
    if (!event || typeof event.dropId !== 'bigint') continue;
    const key = `${contractId}:${event.dropId}`;
    const creates =
      isCreateActivity(event.type) || isClaimActivity(event.type) || event.type === 'cancel-drop';
    let item = items.get(key);
    if (!item) {
      if (!creates) continue;
      item = emptyItem(contractId, event.dropId);
      items.set(key, item);
    }

    item.tokenId = fill(item.tokenId, event.tokenId ?? null);
    item.nftContract = fill(item.nftContract, event.nftContract ?? null);
    item.creator = fill(item.creator, event.creator ?? null);
    item.funder = fill(item.funder, event.funder ?? null);
    item.groupId = fill(item.groupId, event.groupId ?? null);
    item.campaignId = fill(item.campaignId, event.campaignId ?? null);
    item.edition = fill(item.edition, event.edition ?? null);

    if (isCreateActivity(event.type)) {
      item.createTxId = fill(item.createTxId, event.txId ?? null);
      item.createdAt = fill(item.createdAt, event.timestamp ?? null);
      if (item.status === 'unknown') item.status = 'live';
    } else if (isClaimActivity(event.type)) {
      // Re-emitted or duplicated claims: the latest on-chain one is the truth.
      const rank = eventRank(event);
      const previous = claimRanks.get(key);
      if (previous === undefined || rank >= previous) {
        claimRanks.set(key, rank);
        item.holder = event.claimer ?? item.holder;
        item.claimTxId = event.txId ?? item.claimTxId;
        item.claimBlockHeight = event.blockHeight ?? item.claimBlockHeight;
        item.claimedAt = event.timestamp ?? item.claimedAt;
        item.bnsKey = event.bnsKey ?? item.bnsKey;
      }
      item.status = 'claimed';
    } else if (event.type === 'cancel-drop') {
      // A claim always wins: cancel can only apply to an unclaimed drop, so a
      // later cancel event on a claimed drop is a stale re-emit.
      if (item.status !== 'claimed') item.status = 'cancelled';
      item.cancelTxId = event.txId ?? item.cancelTxId;
    } else if (event.type === 'settle-refund') {
      item.settled = true;
    }
  }

  for (const drop of options.liveDrops ?? []) {
    if (!drop || typeof drop.dropId !== 'bigint') continue;
    const key = `${drop.contractId ?? contractId}:${drop.dropId}`;
    const item = items.get(key) ?? emptyItem(drop.contractId ?? contractId, drop.dropId);
    items.set(key, item);
    item.tokenId = fill(item.tokenId, drop.tokenId ?? null);
    item.nftContract = fill(item.nftContract, drop.nftContract ?? null);
    item.creator = fill(item.creator, drop.creator ?? null);
    item.groupId = fill(item.groupId, drop.groupId ?? null);
    item.campaignId = fill(item.campaignId, drop.campaignId ?? null);
    item.edition = fill(item.edition, drop.edition ?? null);
    if (drop.claimer) {
      item.holder = item.holder ?? drop.claimer;
      item.status = 'claimed';
    } else if (item.status !== 'claimed' && item.status !== 'cancelled') {
      item.status = 'live';
    }
  }

  return sortDropGalleryItems(Array.from(items.values()));
};

/** Cache key for the current-owner join: one read per NFT, not per drop. */
export const dropGalleryOwnerKey = (item: DropGalleryItem): string | null =>
  item.nftContract && item.tokenId !== null ? `${item.nftContract}:${item.tokenId}` : null;

/**
 * Join current NFT ownership onto the items. A missing entry means "not looked
 * up yet" and leaves the item's claiming holder as the only shown wallet — a
 * failed owner read must never blank a tile.
 */
export const applyDropGalleryOwners = (
  items: readonly DropGalleryItem[],
  owners: ReadonlyMap<string, string | null | undefined>
): DropGalleryItem[] =>
  items.map((item) => {
    const key = dropGalleryOwnerKey(item);
    if (!key || !owners.has(key)) return { ...item };
    const owner = owners.get(key) ?? null;
    return {
      ...item,
      owner,
      ownerKnown: owner !== null,
      ownerDiverged: owner !== null && item.holder !== null && !addressesMatch(owner, item.holder)
    };
  });

/**
 * A market-compatible listing for marketMediaFor(), or null when the item has
 * no token to render (cancelled-before-mint, or a truncated event window).
 * Callers render the placeholder tile on null.
 */
export const dropGalleryMediaTarget = (
  item: DropGalleryItem,
  entry: unknown = null
): {
  contractId: string;
  listingId: bigint;
  dropId: bigint;
  tokenId: bigint;
  nftContract: string;
  entry: unknown;
} | null => {
  if (item.tokenId === null || !item.nftContract) return null;
  return {
    contractId: item.contractId,
    listingId: item.dropId,
    dropId: item.dropId,
    tokenId: item.tokenId,
    nftContract: item.nftContract,
    entry
  };
};

const uniqueInOrder = (values: readonly (string | null)[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    const upper = value.trim().toUpperCase();
    if (seen.has(upper)) continue;
    seen.add(upper);
    out.push(value);
  }
  return out;
};

const totalsFor = (items: readonly DropGalleryItem[]): DropGalleryTotals => ({
  total: items.length,
  claimed: items.filter((item) => item.status === 'claimed').length,
  cancelled: items.filter((item) => item.status === 'cancelled').length,
  live: items.filter((item) => item.status === 'live').length
});

const galleryFrom = (
  campaignId: bigint | null,
  items: readonly DropGalleryItem[],
  overrides: { id?: string; title?: string; scope?: DropGallery['scope'] } = {}
): DropGallery => {
  const sorted = sortDropGalleryItems(items);
  return {
    id: overrides.id ?? (campaignId === null ? 'standalone' : `campaign-${campaignId}`),
    scope: overrides.scope ?? (campaignId === null ? 'standalone' : 'campaign'),
    campaignId,
    title:
      overrides.title ??
      (campaignId === null ? 'Standalone drops' : `Campaign ${campaignId}`),
    items: sorted,
    totals: totalsFor(sorted),
    holders: uniqueInOrder(sorted.map((item) => item.holder)),
    owners: uniqueInOrder(sorted.map((item) => item.owner)),
    creators: uniqueInOrder(sorted.map((item) => item.creator))
  };
};

/**
 * One gallery per campaign, plus a trailing "standalone" gallery for legacy
 * (non-campaign) drops. Campaigns sort by id; standalone always comes last.
 */
export const groupDropGalleries = (items: readonly DropGalleryItem[]): DropGallery[] => {
  const buckets = new Map<string, { campaignId: bigint | null; items: DropGalleryItem[] }>();
  for (const item of items) {
    const key = item.campaignId === null ? 'standalone' : `campaign-${item.campaignId}`;
    const bucket = buckets.get(key) ?? { campaignId: item.campaignId, items: [] };
    bucket.items.push(item);
    buckets.set(key, bucket);
  }
  return Array.from(buckets.values())
    .map((bucket) => galleryFrom(bucket.campaignId, bucket.items))
    .sort((a, b) => {
      if (a.campaignId === null) return 1;
      if (b.campaignId === null) return -1;
      return compareBigints(a.campaignId, b.campaignId);
    });
};

export type DropGallerySelection = {
  /** True when the URL asks for a gallery at all. */
  active: boolean;
  /** All completed drops across every campaign. */
  all: boolean;
  /** Only the legacy drops that belong to no campaign. */
  standalone: boolean;
  campaignId: bigint | null;
  /** Single-drop view. */
  dropId: bigint | null;
};

export const EMPTY_DROP_GALLERY_SELECTION: DropGallerySelection = {
  active: false,
  all: false,
  standalone: false,
  campaignId: null,
  dropId: null
};

const readParam = (params: { get?: (key: string) => string | null } | null, key: string) => {
  const raw = params?.get?.(key);
  return typeof raw === 'string' ? raw.trim() : '';
};

/**
 * Parse the gallery selection out of the Drops page query string.
 *
 *   /drops?campaign=0        → that campaign's gallery
 *   /drops?campaign=all      → every completed drop
 *   /drops?item=6            → one drop (campaign resolved from its events)
 *   /drops?campaign=0&item=6 → one drop, shown in its campaign's context
 *
 * `?gallery=` is deliberately NOT used: the shell's pre-paint router in
 * index.html treats that param as a curated Xplorer view and would route the
 * request away from the Drops page entirely.
 */
export const parseDropGallerySelection = (
  params: { get?: (key: string) => string | null } | null
): DropGallerySelection => {
  const campaignRaw = readParam(params, 'campaign').toLowerCase();
  const itemRaw = readParam(params, 'item');
  const all = campaignRaw === 'all';
  const standalone = campaignRaw === 'none' || campaignRaw === 'standalone';
  const campaignId = /^\d+$/.test(campaignRaw) ? BigInt(campaignRaw) : null;
  const dropId = /^\d+$/.test(itemRaw) ? BigInt(itemRaw) : null;
  return {
    active: all || standalone || campaignId !== null || dropId !== null,
    all,
    standalone,
    campaignId,
    dropId
  };
};

/** The canonical URL for a selection; used by every gallery link in the app. */
export const dropGalleryHref = (
  selection: Partial<DropGallerySelection> & { campaignId?: bigint | number | null }
): string => {
  const search = new URLSearchParams();
  if (selection.all) {
    search.set('campaign', 'all');
  } else if (selection.standalone) {
    search.set('campaign', 'none');
  } else if (selection.campaignId !== null && selection.campaignId !== undefined) {
    search.set('campaign', String(selection.campaignId));
  }
  if (selection.dropId !== null && selection.dropId !== undefined) {
    search.set('item', String(selection.dropId));
  }
  const query = search.toString();
  return query ? `/drops?${query}` : '/drops';
};

/**
 * Resolve a selection against the built items. Returns null only when the
 * selection matches nothing, which the renderer shows as the empty state.
 */
export const selectDropGallery = (
  items: readonly DropGalleryItem[],
  selection: DropGallerySelection
): DropGallery | null => {
  if (!selection.active) return null;
  if (selection.dropId !== null) {
    const match = items.filter((item) => item.dropId === selection.dropId);
    if (!match.length) return null;
    const campaignId = match[0].campaignId;
    return galleryFrom(campaignId, match, {
      id: `drop-${selection.dropId}`,
      title: `Drop #${selection.dropId}`,
      scope: 'drop'
    });
  }
  if (selection.all) {
    const shown = items.filter((item) => item.status !== 'unknown');
    if (!shown.length) return null;
    return galleryFrom(null, shown, { id: 'all', title: 'All drops', scope: 'all' });
  }
  if (selection.standalone) {
    const shown = items.filter((item) => item.campaignId === null);
    if (!shown.length) return null;
    return galleryFrom(null, shown, { scope: 'standalone' });
  }
  const match = items.filter((item) => item.campaignId === selection.campaignId);
  if (!match.length) return null;
  return galleryFrom(selection.campaignId, match, { scope: 'campaign' });
};

/** "Edition 7 of 33" / "Drop #12" — the tile's primary caption. */
export const dropGalleryItemLabel = (item: DropGalleryItem, total?: number): string => {
  if (item.edition !== null) {
    // Editions are 0-based on-chain; collectors count from one.
    const position = item.edition + 1n;
    return total ? `Edition ${position} of ${total}` : `Edition ${position}`;
  }
  return `Drop #${item.dropId}`;
};
