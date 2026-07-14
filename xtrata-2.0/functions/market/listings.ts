/**
 * GET /market/listings — aggregated live market listings, edge-cached.
 *
 * The market page previously made ~1 + N read-only calls per market contract
 * per visitor straight to the Hiro API (rate-limit and latency exposure).
 * This endpoint does that work once server-side (with the project HIRO key),
 * caches the result at the Cloudflare edge for CACHE_SECONDS, and serves every
 * visitor from cache. The frontend falls back to direct reads if this
 * endpoint is unavailable (e.g. local dev without wrangler).
 *
 * Response: { updatedAt, listings: [{ contractId, label, paymentTokenContractId,
 *   sponsored, listingId, seller, nftContract, tokenId, price, createdAt,
 *   feeBudget?, budgetRemaining?, claimed?, soldAt? }] }
 * (uint fields serialised as strings; sold listings included with soldAt set so
 * seller dashboards can offer reclaim — the public grid filters them out.)
 */
import { cvToHex, cvToJSON, hexToCV, uintCV } from '@stacks/transactions';
import { jsonResponse } from '../lib/utils';
import type { Env } from '../lib/db';
import { applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey } from '../lib/hiro-keys';
import registry from '../../src/data/market-registry.json';

const HIRO = 'https://api.hiro.so';
const LISTINGS_PER_CONTRACT = 24;
const CACHE_SECONDS = 30;

type RegistryEntry = {
  label: string;
  address: string;
  contractName: string;
  network: string;
  paymentTokenContractId?: string | null;
  sponsored?: boolean;
};

type MarketEnv = Env & {
  HIRO_API_KEYS?: string;
  HIRO_API_KEY?: string;
  VITE_HIRO_API_KEY?: string;
};

const hiroFetch = async (env: MarketEnv, url: string, init: RequestInit): Promise<Response> => {
  const attempts: Array<string | null> = [
    ...getHiroApiKeys(env as unknown as Record<string, unknown>),
    null
  ];
  let lastError: unknown;
  for (let index = 0; index < attempts.length; index += 1) {
    const headers = new Headers(init.headers);
    try {
      applyHiroApiKey(headers, attempts[index]);
      const response = await fetch(url, { ...init, headers });
      if (index < attempts.length - 1 && shouldRetryWithNextHiroKey(response.status)) {
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Hiro request failed');
};

const callRead = async (
  env: MarketEnv,
  contractId: string,
  fn: string,
  args: string[] = []
) => {
  const [address, name] = contractId.split('.');
  const r = await hiroFetch(env, `${HIRO}/v2/contracts/call-read/${address}/${name}/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: address, arguments: args })
  });
  if (!r.ok) throw new Error(`${fn} ${r.status}`);
  const j = (await r.json()) as { okay?: boolean; result?: string };
  if (!j.okay || !j.result) throw new Error(`${fn} no result`);
  return cvToJSON(hexToCV(j.result));
};

const unwrapTuple = (node: unknown): Record<string, { value: unknown }> | null => {
  let current = node as { type?: string; value?: unknown } | null;
  while (
    current &&
    typeof current.type === 'string' &&
    (current.type.startsWith('(optional') || current.type.startsWith('(response'))
  ) {
    current = current.value as typeof current;
  }
  return current && typeof current.type === 'string' && current.type.startsWith('(tuple')
    ? (current.value as Record<string, { value: unknown }>)
    : null;
};

const readMarket = async (
  env: MarketEnv,
  entry: RegistryEntry,
  seller: string | null = null
) => {
  const contractId = `${entry.address}.${entry.contractName}`;
  const lastJson = (await callRead(env, contractId, 'get-last-listing-id')) as {
    value?: { value?: string };
  };
  const lastId = BigInt(lastJson?.value?.value ?? 0);
  // The public market only needs the newest window. A seller wallet must scan
  // the full listing map: otherwise a still-live escrow silently disappears
  // after enough newer listings are created.
  const floor = seller === null && lastId > BigInt(LISTINGS_PER_CONTRACT)
    ? lastId - BigInt(LISTINGS_PER_CONTRACT)
    : 0n;
  const listings: Record<string, unknown>[] = [];
  for (let id = lastId; id >= floor; id -= 1n) {
    try {
      const json = await callRead(env, contractId, 'get-listing', [cvToHex(uintCV(id))]);
      const tuple = unwrapTuple(json);
      if (!tuple) {
        if (id === 0n) break;
        continue;
      }
      if (seller !== null && String(tuple.seller.value) !== seller) {
        if (id === 0n) break;
        continue;
      }
      const opt = (field: string) => {
        const raw = tuple[field]?.value as { value?: unknown } | null | undefined;
        if (raw === null || raw === undefined) return null;
        return String((raw as { value?: unknown }).value ?? raw);
      };
      listings.push({
        contractId,
        label: entry.label,
        paymentTokenContractId: entry.paymentTokenContractId ?? null,
        sponsored: entry.sponsored === true,
        listingId: id.toString(),
        seller: String(tuple.seller.value),
        nftContract: String(tuple['nft-contract'].value),
        tokenId: String(tuple['token-id'].value),
        price: String(tuple.price.value),
        createdAt: tuple['created-at'] ? String(tuple['created-at'].value) : null,
        feeBudget: tuple['fee-budget'] ? String(tuple['fee-budget'].value) : null,
        budgetRemaining: tuple['budget-remaining'] ? String(tuple['budget-remaining'].value) : null,
        claimed: tuple.claimed ? String(tuple.claimed.value) : null,
        soldAt: tuple['sold-at'] ? opt('sold-at') : null
      });
    } catch {
      // sparse / deleted ids
    }
    if (id === 0n) break;
  }
  return listings;
};

export const onRequestGet: PagesFunction<MarketEnv> = async (context) => {
  const { request, env } = context;
  const sellerParam = new URL(request.url).searchParams.get('seller');
  const seller = sellerParam?.trim().toUpperCase() || null;
  if (seller !== null && !/^(SP|SM)[0-9A-Z]{20,50}$/.test(seller)) {
    return jsonResponse(
      { error: 'INVALID_SELLER', message: 'seller must be a mainnet Stacks address' },
      400,
      { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    );
  }
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(new URL(request.url).toString(), request);

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const entries = (registry as RegistryEntry[]).filter((entry) => entry.network === 'mainnet');
  const perMarket = await Promise.all(
    entries.map((entry) =>
      readMarket(env, entry, seller).then(
        (listings) => ({ ok: true as const, listings }),
        () => ({ ok: false as const, listings: [] as Record<string, unknown>[] })
      )
    )
  );
  // If ANY market read failed (Hiro outage / rate limit), a partial or empty
  // response would look authoritative and get edge-cached — the market page
  // would show "no listings" while listings exist on-chain. Serve degraded
  // results without caching them, and fail loudly when everything failed so
  // the frontend falls back to its own direct reads.
  const degraded = perMarket.some((r) => !r.ok);
  if (perMarket.length > 0 && perMarket.every((r) => !r.ok)) {
    return jsonResponse(
      { error: 'UPSTREAM_UNAVAILABLE', message: 'all market reads failed' },
      503,
      { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    );
  }
  const listings = perMarket.flatMap((r) => r.listings);

  const response = jsonResponse(
    { updatedAt: Date.now(), listings, degraded },
    200,
    {
      'Cache-Control': degraded
        ? 'no-store'
        : `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 4}`,
      'Access-Control-Allow-Origin': '*'
    }
  );
  if (!degraded) context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
};
