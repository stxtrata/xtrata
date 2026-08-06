import { Cl, hexToCV } from '@stacks/transactions';
import { getApiBaseUrls } from '../network/config';
import { getContractId, type ContractConfig } from '../contract/config';
import {
  expectPrincipal,
  expectStringAscii,
  expectTuple,
  expectUInt,
  getTupleValue
} from '../protocol/clarity';
import { logWarn } from '../utils/logger';
import { getMarketSettlementAsset } from './settlement';
import type { MarketRegistryEntry } from './registry';
import {
  loadMarketIndexSnapshot,
  loadNftIndexSnapshot,
  saveMarketIndexSnapshot,
  saveNftIndexSnapshot
} from './cache';
import type {
  MarketActivityEvent,
  MarketIndexSnapshot,
  MarketplaceActivityRow,
  MarketplaceActivitySnapshot,
  NftActivityEvent,
  NftIndexSnapshot,
  UnifiedActivityEvent
} from './types';

const EVENT_LIMIT = 50;
const MAX_EVENTS = 200;
/**
 * How many pages of 50 a single refresh will walk.
 *
 * The loader used to fetch ONE page at offset 0 and stop, so any market with
 * more than 50 events silently lost the older ones -- and said nothing about
 * it. The STX market was at 40 when this was written, so the truncation was
 * weeks away rather than hypothetical.
 *
 * Bounded rather than unbounded because this runs in a browser against a
 * rate-limited API. When the walk stops early the snapshot says so via
 * `complete: false`, and the UI is required to show that rather than present a
 * partial history as a whole one.
 */
const MAX_EVENT_PAGES = 8;
const MIN_REFRESH_MS = 60_000;
const MARKET_RATE_LIMIT_BACKOFF_MS = 300_000;
const NFT_EVENT_LIMIT = 50;
const NFT_MAX_EVENTS = 200;

export const buildMarketListingKey = (nftContract: string, tokenId: bigint) =>
  `${nftContract}:${tokenId.toString()}`;

type HiroContractEvent = {
  event_index?: number;
  event_type?: string;
  tx_id?: string;
  block_height?: number;
  block_time_iso?: string;
  contract_log?: {
    topic?: string;
    contract_id?: string;
    value?: {
      repr?: string;
      hex?: string;
    };
  };
};

type HiroContractEventResponse = {
  results?: HiroContractEvent[];
};

type HiroNftMintEvent = {
  event_index?: number;
  tx_id?: string;
  block_height?: number;
  block_time_iso?: string;
  recipient?: string;
  asset_identifier?: string;
  value?: {
    repr?: string;
    hex?: string;
  };
};

type HiroNftMintResponse = {
  results?: HiroNftMintEvent[];
};

const shouldTryFallback = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : String(error ?? '');
  const lower = message.toLowerCase();
  if (
    lower.includes('429') ||
    lower.includes('too many requests') ||
    lower.includes('rate limit')
  ) {
    return true;
  }
  return (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('cors') ||
    lower.includes('access-control-allow-origin')
  );
};

const isRateLimitError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const lower = message.toLowerCase();
  return (
    lower.includes('429') ||
    lower.includes('too many requests') ||
    lower.includes('rate limit')
  );
};

const marketBackoffUntil = new Map<string, number>();
const marketActivityInFlight = new Map<string, Promise<MarketIndexSnapshot>>();
const nftActivityInFlight = new Map<string, Promise<NftIndexSnapshot>>();

const getMarketBackoffMs = (key: string) =>
  Math.max(0, (marketBackoffUntil.get(key) ?? 0) - Date.now());

const isMarketBackoffActive = (key: string) => getMarketBackoffMs(key) > 0;

const noteMarketRateLimit = (key: string) => {
  marketBackoffUntil.set(key, Date.now() + MARKET_RATE_LIMIT_BACKOFF_MS);
};

const isHiroCompatibleBase = (baseUrl: string) =>
  baseUrl.includes('hiro.so') || baseUrl.includes('/hiro/');

const parseMarketEventFromValue = (
  value: unknown,
  meta: {
    txId?: string;
    blockHeight?: number;
    eventIndex?: number;
    timestamp?: string;
  }
): MarketActivityEvent | null => {
  if (!value) {
    return null;
  }
  const tuple = expectTuple(value as any, 'market.event');
  const type = expectStringAscii(
    getTupleValue(tuple, 'event', 'market.event'),
    'market.event.event'
  );
  // claim-fee and settle-refund were declared in MarketActivityType from the
  // start but dropped here, so the only evidence that a sale was SPONSORED --
  // the sponsor reimbursing itself -- never reached the UI at all.
  if (
    type !== 'list' &&
    type !== 'buy' &&
    type !== 'cancel' &&
    type !== 'claim-fee' &&
    type !== 'settle-refund'
  ) {
    return null;
  }
  const listingId = expectUInt(
    getTupleValue(tuple, 'listing-id', 'market.event'),
    'market.event.listing-id'
  );
  const tokenIdValue = tuple['token-id'];
  const priceValue = tuple['price'];
  const feeValue = tuple['fee'];
  // Verified against the live contracts on 2026-08-06:
  //   list          event fee-budget listing-id nft-contract price seller token-id
  //   buy           buyer event fee listing-id nft-contract price seller token-id
  //   cancel        budget-refunded event listing-id nft-contract seller token-id
  //   claim-fee     amount budget-remaining event listing-id sponsor
  //   settle-refund claimed event listing-id refunded seller
  const feeBudgetValue = tuple['fee-budget'];
  const budgetRemainingValue = tuple['budget-remaining'];
  const claimAmountValue = tuple['amount'];
  const refundedValue = tuple['refunded'] ?? tuple['budget-refunded'];
  const sellerValue = tuple['seller'];
  const buyerValue = tuple['buyer'];
  const nftContractValue = tuple['nft-contract'];
  const tokenId = tokenIdValue ? expectUInt(tokenIdValue, 'market.event.token-id') : undefined;
  const price = priceValue ? expectUInt(priceValue, 'market.event.price') : undefined;
  const fee = feeValue ? expectUInt(feeValue, 'market.event.fee') : undefined;
  const seller = sellerValue ? expectPrincipal(sellerValue, 'market.event.seller') : undefined;
  const buyer = buyerValue ? expectPrincipal(buyerValue, 'market.event.buyer') : undefined;
  const nftContract = nftContractValue
    ? expectPrincipal(nftContractValue, 'market.event.nft-contract')
    : undefined;
  const id = `${meta.txId ?? 'unknown'}:${meta.eventIndex ?? listingId.toString()}`;

  return {
    id,
    type,
    listingId,
    tokenId,
    price,
    fee,
    seller,
    buyer,
    nftContract,
    feeBudget: feeBudgetValue ? expectUInt(feeBudgetValue, 'market.event.fee-budget') : undefined,
    budgetRemaining: budgetRemainingValue
      ? expectUInt(budgetRemainingValue, 'market.event.budget-remaining')
      : undefined,
    claimAmount: claimAmountValue ? expectUInt(claimAmountValue, 'market.event.amount') : undefined,
    refunded: refundedValue ? expectUInt(refundedValue, 'market.event.refunded') : undefined,
    txId: meta.txId,
    blockHeight: meta.blockHeight,
    eventIndex: meta.eventIndex,
    timestamp: meta.timestamp
  };
};

const parseMarketEvent = (event: HiroContractEvent): MarketActivityEvent | null => {
  if (!event || event.event_type !== 'smart_contract_log') {
    return null;
  }
  if (event.contract_log?.topic !== 'print') {
    return null;
  }
  // Deserialize the HEX, not the repr.
  //
  // This read `Cl.parse(repr)` and swallowed the throw as `null`. Cl.parse
  // rejects every repr these contracts emit -- checked against all five event
  // shapes on mainnet -- so parseMarketEvent returned null for literally every
  // market event, and the per-listing activity panel had been silently empty
  // since it shipped. The hex round-trips exactly.
  //
  // The repr stays as a fallback rather than being deleted: it costs nothing,
  // and an event with a hex this version cannot decode is better read badly
  // than not at all.
  const hex = event.contract_log?.value?.hex;
  const repr = event.contract_log?.value?.repr;
  if (!hex && !repr) {
    return null;
  }
  try {
    const parsed = hex ? hexToCV(hex) : Cl.parse(repr as string);
    return parseMarketEventFromValue(parsed, {
      txId: event.tx_id,
      blockHeight: event.block_height,
      eventIndex: event.event_index,
      timestamp: event.block_time_iso
    });
  } catch (error) {
    return null;
  }
};

const sortEventsDesc = (a: MarketActivityEvent, b: MarketActivityEvent) => {
  const heightA = a.blockHeight ?? 0;
  const heightB = b.blockHeight ?? 0;
  if (heightA !== heightB) {
    return heightB - heightA;
  }
  const indexA = a.eventIndex ?? 0;
  const indexB = b.eventIndex ?? 0;
  return indexB - indexA;
};

const sortNftEventsDesc = (a: NftActivityEvent, b: NftActivityEvent) => {
  const heightA = a.blockHeight ?? 0;
  const heightB = b.blockHeight ?? 0;
  if (heightA !== heightB) {
    return heightB - heightA;
  }
  const indexA = a.eventIndex ?? 0;
  const indexB = b.eventIndex ?? 0;
  return indexB - indexA;
};

const sortUnifiedDesc = (a: UnifiedActivityEvent, b: UnifiedActivityEvent) => {
  const heightA = a.blockHeight ?? 0;
  const heightB = b.blockHeight ?? 0;
  if (heightA !== heightB) {
    return heightB - heightA;
  }
  const indexA = a.eventIndex ?? 0;
  const indexB = b.eventIndex ?? 0;
  return indexB - indexA;
};

export const buildActiveListingIndex = (
  events: MarketActivityEvent[],
  nftContractId?: string
) => {
  const seen = new Set<string>();
  const active = new Map<string, MarketActivityEvent>();
  const sorted = [...events].sort(sortEventsDesc);

  for (const event of sorted) {
    if (!event.tokenId || !event.nftContract) {
      continue;
    }
    if (nftContractId && event.nftContract !== nftContractId) {
      continue;
    }
    const key = buildMarketListingKey(event.nftContract, event.tokenId);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    if (event.type === 'list') {
      active.set(key, event);
    }
  }

  return active;
};

const mergeEvents = (existing: MarketActivityEvent[], incoming: MarketActivityEvent[]) => {
  const map = new Map<string, MarketActivityEvent>();
  existing.forEach((event) => map.set(event.id, event));
  incoming.forEach((event) => map.set(event.id, event));
  const merged = Array.from(map.values());
  merged.sort(sortEventsDesc);
  return merged.slice(0, MAX_EVENTS);
};

const mergeNftEvents = (existing: NftActivityEvent[], incoming: NftActivityEvent[]) => {
  const map = new Map<string, NftActivityEvent>();
  existing.forEach((event) => map.set(event.id, event));
  incoming.forEach((event) => map.set(event.id, event));
  const merged = Array.from(map.values());
  merged.sort(sortNftEventsDesc);
  return merged.slice(0, NFT_MAX_EVENTS);
};

const fetchMarketEventsPage = async (params: {
  baseUrl: string;
  contractId: string;
  limit: number;
  offset: number;
}): Promise<{ events: MarketActivityEvent[]; rawCount: number }> => {
  const url = `${params.baseUrl}/extended/v1/contract/${encodeURIComponent(
    params.contractId
  )}/events?limit=${params.limit}&offset=${params.offset}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Market events fetch failed (${response.status})`);
  }
  const json = (await response.json()) as HiroContractEventResponse;
  const results = Array.isArray(json.results) ? json.results : [];
  return {
    events: results.map(parseMarketEvent).filter(Boolean) as MarketActivityEvent[],
    // The RAW count decides whether to ask for another page. Paging on the
    // parsed count would stop the walk the moment a page contained anything
    // this parser ignores -- and a market's event feed is full of nft_transfer
    // and stx_transfer events alongside the prints, so on the real chain that
    // meant stopping after page one and silently losing all older history.
    rawCount: results.length
  };
};

const parseUintFromRepr = (repr?: string) => {
  if (!repr) {
    return undefined;
  }
  const trimmed = repr.trim();
  if (trimmed.startsWith('u')) {
    const value = trimmed.slice(1);
    if (/^\d+$/.test(value)) {
      return BigInt(value);
    }
  }
  if (/^\d+$/.test(trimmed)) {
    return BigInt(trimmed);
  }
  try {
    const parsed = Cl.parse(trimmed);
    return expectUInt(parsed, 'nft.event.token-id');
  } catch (error) {
    return undefined;
  }
};

const parseTokenIdFromMintEvent = (event: HiroNftMintEvent) => {
  if (event.value?.repr) {
    return parseUintFromRepr(event.value.repr);
  }
  return undefined;
};

const parseNftMintEvent = (
  event: HiroNftMintEvent,
  contractId: string,
  assetIdentifier: string
): NftActivityEvent | null => {
  const tokenId = parseTokenIdFromMintEvent(event);
  const id = `${event.tx_id ?? 'unknown'}:${event.event_index ?? tokenId?.toString() ?? 'event'}`;
  return {
    id,
    type: 'mint',
    tokenId,
    recipient: event.recipient ?? undefined,
    nftContract: contractId,
    assetIdentifier: event.asset_identifier ?? assetIdentifier,
    txId: event.tx_id,
    blockHeight: event.block_height,
    eventIndex: event.event_index,
    timestamp: event.block_time_iso
  };
};

const fetchNftMintsPage = async (params: {
  baseUrl: string;
  contractId: string;
  assetIdentifier: string;
  limit: number;
  offset: number;
}): Promise<NftActivityEvent[]> => {
  const encodedIdentifier = encodeURIComponent(params.assetIdentifier);
  const url = `${params.baseUrl}/extended/v1/tokens/nft/mints?asset_identifier=${encodedIdentifier}&limit=${params.limit}&offset=${params.offset}&unanchored=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NFT events fetch failed (${response.status})`);
  }
  const json = (await response.json()) as HiroNftMintResponse;
  const results = Array.isArray(json.results) ? json.results : [];
  return results
    .map((event) => parseNftMintEvent(event, params.contractId, params.assetIdentifier))
    .filter(Boolean) as NftActivityEvent[];
};

export const loadMarketActivity = async (params: {
  contract: ContractConfig;
  force?: boolean;
}): Promise<MarketIndexSnapshot> => {
  const contractId = getContractId(params.contract);
  const cached = await loadMarketIndexSnapshot(contractId);
  if (isMarketBackoffActive(contractId)) {
    return (
      cached ?? {
        contractId,
        events: [],
        updatedAt: Date.now()
      }
    );
  }
  if (
    cached &&
    !params.force &&
    Date.now() - cached.updatedAt < MIN_REFRESH_MS
  ) {
    return cached;
  }

  const inFlight = marketActivityInFlight.get(contractId);
  if (inFlight) {
    return inFlight;
  }

  const loadPromise = (async () => {
    const apiBaseUrls = getApiBaseUrls(params.contract.network).filter(
      isHiroCompatibleBase
    );
    let events: MarketActivityEvent[] = cached?.events ?? [];
    let lastError: unknown = null;
    let complete = false;

    if (apiBaseUrls.length === 0) {
      logWarn('market', 'Market activity fetch skipped: no Hiro API base configured');
      return {
        contractId,
        events,
        updatedAt: Date.now()
      };
    }

    for (let index = 0; index < apiBaseUrls.length; index += 1) {
      const baseUrl = apiBaseUrls[index];
      try {
        // Walk pages until one comes back short, which is the only signal
        // this API gives that there is nothing older.
        let offset = 0;
        let page = 0;
        let reachedEnd = false;
        for (; page < MAX_EVENT_PAGES; page += 1) {
          const fetched = await fetchMarketEventsPage({
            baseUrl,
            contractId,
            limit: EVENT_LIMIT,
            offset
          });
          events = mergeEvents(events, fetched.events);
          if (fetched.rawCount < EVENT_LIMIT) {
            reachedEnd = true;
            break;
          }
          offset += EVENT_LIMIT;
        }
        // Complete only if the walk ran out of events rather than out of pages,
        // AND the merge did not hit its own ceiling.
        complete = reachedEnd && events.length < MAX_EVENTS;
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        const hasFallback = index < apiBaseUrls.length - 1;
        if (hasFallback && shouldTryFallback(error)) {
          continue;
        }
        break;
      }
    }

    if (lastError) {
      if (isRateLimitError(lastError)) {
        noteMarketRateLimit(contractId);
      }
      logWarn('market', 'Market activity fetch failed', {
        error: lastError instanceof Error ? lastError.message : String(lastError)
      });
    }

    const snapshot: MarketIndexSnapshot = {
      contractId,
      events,
      complete,
      updatedAt: Date.now()
    };
    await saveMarketIndexSnapshot(snapshot);
    return snapshot;
  })();

  marketActivityInFlight.set(contractId, loadPromise);
  try {
    return await loadPromise;
  } finally {
    marketActivityInFlight.delete(contractId);
  }
};

export const loadNftActivity = async (params: {
  contract: ContractConfig;
  assetName: string;
  force?: boolean;
}): Promise<NftIndexSnapshot> => {
  const contractId = getContractId(params.contract);
  const assetIdentifier = `${contractId}::${params.assetName}`;
  const cached = await loadNftIndexSnapshot(assetIdentifier);
  if (isMarketBackoffActive(assetIdentifier)) {
    return (
      cached ?? {
        assetIdentifier,
        events: [],
        updatedAt: Date.now()
      }
    );
  }
  if (
    cached &&
    !params.force &&
    Date.now() - cached.updatedAt < MIN_REFRESH_MS
  ) {
    return cached;
  }

  const inFlight = nftActivityInFlight.get(assetIdentifier);
  if (inFlight) {
    return inFlight;
  }

  const loadPromise = (async () => {
    const apiBaseUrls = getApiBaseUrls(params.contract.network).filter(
      isHiroCompatibleBase
    );
    let events: NftActivityEvent[] = cached?.events ?? [];
    let lastError: unknown = null;

    if (apiBaseUrls.length === 0) {
      logWarn('market', 'NFT activity fetch skipped: no Hiro API base configured');
      return {
        assetIdentifier,
        events,
        updatedAt: Date.now()
      };
    }

    for (let index = 0; index < apiBaseUrls.length; index += 1) {
      const baseUrl = apiBaseUrls[index];
      try {
        const fetched = await fetchNftMintsPage({
          baseUrl,
          contractId,
          assetIdentifier,
          limit: NFT_EVENT_LIMIT,
          offset: 0
        });
        events = mergeNftEvents(events, fetched);
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        const hasFallback = index < apiBaseUrls.length - 1;
        if (hasFallback && shouldTryFallback(error)) {
          continue;
        }
        break;
      }
    }

    if (lastError) {
      if (isRateLimitError(lastError)) {
        noteMarketRateLimit(assetIdentifier);
      }
      logWarn('market', 'NFT activity fetch failed', {
        error: lastError instanceof Error ? lastError.message : String(lastError)
      });
    }

    const snapshot: NftIndexSnapshot = {
      assetIdentifier,
      events,
      updatedAt: Date.now()
    };
    await saveNftIndexSnapshot(snapshot);
    return snapshot;
  })();

  nftActivityInFlight.set(assetIdentifier, loadPromise);
  try {
    return await loadPromise;
  } finally {
    nftActivityInFlight.delete(assetIdentifier);
  }
};

export const buildUnifiedActivityTimeline = (params: {
  marketEvents: MarketActivityEvent[];
  nftEvents: NftActivityEvent[];
  nftContractId?: string;
}) => {
  const unified: UnifiedActivityEvent[] = [];
  const marketTxToken = new Set<string>();

  params.marketEvents.forEach((event) => {
    if (event.txId && event.tokenId !== undefined) {
      marketTxToken.add(`${event.txId}:${event.tokenId.toString()}`);
    }
    unified.push({
      id: `market:${event.id}`,
      source: 'market',
      type: event.type,
      listingId: event.listingId,
      tokenId: event.tokenId,
      price: event.price,
      fee: event.fee,
      seller: event.seller,
      buyer: event.buyer,
      nftContract: event.nftContract,
      txId: event.txId,
      blockHeight: event.blockHeight,
      eventIndex: event.eventIndex,
      timestamp: event.timestamp
    });
  });

  params.nftEvents.forEach((event) => {
    if (params.nftContractId && event.nftContract !== params.nftContractId) {
      return;
    }
    if (
      event.type === 'transfer' &&
      event.txId &&
      event.tokenId !== undefined &&
      marketTxToken.has(`${event.txId}:${event.tokenId.toString()}`)
    ) {
      return;
    }
    unified.push({
      id: `nft:${event.id}`,
      source: 'nft',
      type: event.type === 'mint' ? 'inscribe' : 'transfer',
      tokenId: event.tokenId,
      from: event.sender,
      to: event.recipient,
      nftContract: event.nftContract,
      txId: event.txId,
      blockHeight: event.blockHeight,
      eventIndex: event.eventIndex,
      timestamp: event.timestamp
    });
  });

  unified.sort(sortUnifiedDesc);
  return unified.slice(0, MAX_EVENTS);
};

export const __testing = {
  parseMarketEventFromValue,
  parseNftMintEvent,
  buildUnifiedActivityTimeline,
  resetMarketIndexerRuntimeState() {
    marketBackoffUntil.clear();
    marketActivityInFlight.clear();
    nftActivityInFlight.clear();
  }
};

/**
 * Every market's activity, merged into one list.
 *
 * The per-listing "Details" panel has always had this data -- `loadMarketActivity`
 * indexes a whole contract -- but the page then filtered it to a single token,
 * so the only way to read the marketplace was one listing at a time. This is
 * the same data with the filter removed and the three markets merged.
 *
 * Two things it refuses to fake:
 *
 *   1. **Sponsorship is derived, not assumed.** Every listing here is on a
 *      sponsor-capable market, so "sponsored market" says nothing about a given
 *      sale. What settles it is a `claim-fee` against the same listing: the
 *      sponsor reimbursing itself from the seller's escrowed budget, which only
 *      happens when the buyer paid no fee. Most sales so far are self-paid.
 *
 *   2. **Truncation is reported.** If any market's history was cut short, the
 *      snapshot says `complete: false` and the caller must show it. A partial
 *      history presented as a whole one is the same class of error as rendering
 *      a placeholder as artwork.
 *
 * Failures are per-market and non-fatal: one market being unreadable returns
 * the others plus `complete: false`, rather than an empty list that looks like
 * a quiet marketplace.
 */
export const loadMarketplaceActivity = async (params: {
  contracts: { entry: MarketRegistryEntry; label?: string }[];
  force?: boolean;
}): Promise<MarketplaceActivitySnapshot> => {
  const markets: MarketplaceActivitySnapshot['markets'] = [];
  const rows: MarketplaceActivityRow[] = [];

  const snapshots = await Promise.all(
    params.contracts.map(async ({ entry, label }) => {
      const contractId = getContractId(entry);
      try {
        const snapshot = await loadMarketActivity({ contract: entry, force: params.force });
        return { entry, label, contractId, snapshot, failed: false };
      } catch {
        return { entry, label, contractId, snapshot: null, failed: true };
      }
    })
  );

  for (const { entry, label, contractId, snapshot, failed } of snapshots) {
    const events = snapshot?.events ?? [];
    // A market that could not be read is not a complete market.
    const complete = failed ? false : snapshot?.complete === true;
    markets.push({
      contractId,
      label: label ?? entry.label,
      count: events.length,
      complete
    });

    // Which listings on THIS market had the sponsor reimburse itself. Scoped
    // per market because listing ids restart at zero on each contract, so a
    // set keyed on listing id alone would mark listing 6 on all three markets
    // sponsored the moment any one of them was.
    const sponsoredListings = new Set(
      events
        .filter((event) => event.type === 'claim-fee')
        .map((event) => event.listingId.toString())
    );

    const settlement = getMarketSettlementAsset(entry.paymentTokenContractId);
    for (const event of events) {
      rows.push({
        ...event,
        marketContractId: contractId,
        marketKey: entry.contractName,
        marketLabel: label ?? entry.label,
        settlement,
        sponsored: sponsoredListings.has(event.listingId.toString())
      });
    }
  }

  rows.sort(sortEventsDesc);

  return {
    rows,
    complete: markets.length > 0 && markets.every((market) => market.complete),
    markets,
    updatedAt: Date.now()
  };
};
