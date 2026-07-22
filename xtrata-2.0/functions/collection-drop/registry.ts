/**
 * GET /collection-drop/registry?campaign=0
 *
 * Claim-only public registry for recursive collection masters. Drops v1.1
 * stores campaign drops by global drop id, so the event index is the efficient
 * public read surface for reconstructing edition -> claim state. The result is
 * edge-cached and intentionally contains only claimed editions.
 */
import { cvToJSON, hexToCV } from '@stacks/transactions';
import type { Env } from '../lib/db';
import { applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey } from '../lib/hiro-keys';
import { jsonResponse } from '../lib/utils';

const HIRO = 'https://api.hiro.so';
const DROPS_CONTRACT =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v1-1';
const PAGE_SIZE = 50;
const PAGE_CONCURRENCY = 8;
const MAX_PAGES = 1000;
const CACHE_SECONDS = 60;

type RegistryEnv = Env & {
  HIRO_API_KEYS?: string;
  HIRO_API_KEY?: string;
  VITE_HIRO_API_KEY?: string;
};

type ContractEvent = {
  tx_id?: string;
  event_type?: string;
  contract_log?: {
    topic?: string;
    value?: { hex?: string };
  };
};

type EventPage = {
  total?: number;
  results?: ContractEvent[];
};

type JsonCv = { type?: string; value?: unknown };

const hiroFetch = async (env: RegistryEnv, url: string): Promise<Response> => {
  const attempts: Array<string | null> = [
    ...getHiroApiKeys(env as unknown as Record<string, unknown>),
    null
  ];
  let lastError: unknown;
  for (let index = 0; index < attempts.length; index += 1) {
    const headers = new Headers({ Accept: 'application/json' });
    try {
      applyHiroApiKey(headers, attempts[index]);
      const response = await fetch(url, { headers });
      if (index < attempts.length - 1 && shouldRetryWithNextHiroKey(response.status)) continue;
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Hiro request failed');
};

const fetchEventPage = async (
  env: RegistryEnv,
  offset: number
): Promise<EventPage> => {
  const url =
    `${HIRO}/extended/v1/contract/${DROPS_CONTRACT}/events` +
    `?limit=${PAGE_SIZE}&offset=${offset}`;
  const response = await hiroFetch(env, url);
  if (!response.ok) throw new Error(`contract events ${response.status}`);
  return (await response.json()) as EventPage;
};

const unwrap = (node: unknown): unknown => {
  let current = node as JsonCv | null;
  while (
    current &&
    typeof current.type === 'string' &&
    (current.type.startsWith('(optional') || current.type.startsWith('(response'))
  ) {
    current = current.value as JsonCv | null;
  }
  return current?.value;
};

const tupleFromEvent = (event: ContractEvent): Record<string, JsonCv> | null => {
  if (event.event_type !== 'smart_contract_log' || event.contract_log?.topic !== 'print') {
    return null;
  }
  const hex = event.contract_log.value?.hex;
  if (!hex) return null;
  try {
    const json = cvToJSON(hexToCV(hex)) as JsonCv;
    return typeof json.type === 'string' && json.type.startsWith('(tuple')
      ? (json.value as Record<string, JsonCv>)
      : null;
  } catch {
    return null;
  }
};

const textField = (tuple: Record<string, JsonCv>, field: string): string | null => {
  const value = unwrap(tuple[field]);
  return value === null || value === undefined ? null : String(value);
};

const uintField = (tuple: Record<string, JsonCv>, field: string): number | null => {
  const raw = textField(tuple, field);
  if (raw === null || !/^\d+$/.test(raw)) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : null;
};

const fetchAllEvents = async (env: RegistryEnv): Promise<ContractEvent[]> => {
  const first = await fetchEventPage(env, 0);
  const events = [...(first.results ?? [])];
  const reportedTotal = Number(first.total);
  if (Number.isFinite(reportedTotal) && reportedTotal > events.length) {
    const offsets: number[] = [];
    for (let offset = PAGE_SIZE; offset < reportedTotal; offset += PAGE_SIZE) offsets.push(offset);
    for (let index = 0; index < offsets.length; index += PAGE_CONCURRENCY) {
      const pages = await Promise.all(
        offsets.slice(index, index + PAGE_CONCURRENCY).map((offset) => fetchEventPage(env, offset))
      );
      for (const page of pages) events.push(...(page.results ?? []));
    }
    return events;
  }

  // Hiro's contract-events response does not always include `total`. In that
  // case, fetch offset batches until one page is short. The hard limit is well
  // above the Drops campaign maximum but prevents an unbounded upstream walk.
  if ((first.results?.length ?? 0) < PAGE_SIZE) return events;
  for (let pageIndex = 1; pageIndex < MAX_PAGES; pageIndex += PAGE_CONCURRENCY) {
    const pages = await Promise.all(
      Array.from({ length: Math.min(PAGE_CONCURRENCY, MAX_PAGES - pageIndex) }, (_, index) =>
        fetchEventPage(env, (pageIndex + index) * PAGE_SIZE)
      )
    );
    for (const page of pages) events.push(...(page.results ?? []));
    if (pages.some((page) => (page.results?.length ?? 0) < PAGE_SIZE)) return events;
  }
  throw new Error('contract event pagination exceeded safety limit');
};

export const buildCampaignRegistry = (events: ContractEvent[], campaignId: number) => {
  const claims = new Map<number, Record<string, unknown>>();
  let maxSupply: number | null = null;
  let dropsCreated = 0;

  for (const event of events) {
    const tuple = tupleFromEvent(event);
    if (!tuple || uintField(tuple, 'campaign-id') !== campaignId) continue;
    const eventName = textField(tuple, 'event');
    if (eventName === 'create-campaign') {
      maxSupply = uintField(tuple, 'max-supply');
      continue;
    }
    if (eventName === 'create-campaign-drop') {
      dropsCreated += 1;
      continue;
    }
    if (eventName !== 'claim-campaign') continue;

    const zeroBasedEdition = uintField(tuple, 'edition');
    const tokenId = uintField(tuple, 'token-id');
    const owner = textField(tuple, 'claimer');
    if (zeroBasedEdition === null || tokenId === null || !owner) continue;
    const edition = zeroBasedEdition + 1;
    claims.set(edition, {
      edition,
      claimed: true,
      inscription: String(tokenId),
      contentUrl: `https://xtrata.xyz/inscription/${tokenId}`,
      owner,
      tx: event.tx_id ?? ''
    });
  }

  const items = [...claims.values()].sort(
    (a, b) => Number(a.edition) - Number(b.edition)
  );
  return {
    campaignId,
    contractId: DROPS_CONTRACT,
    maxSupply,
    dropsCreated,
    claimedCount: items.length,
    items
  };
};

export const onRequestGet: PagesFunction = async (context) => {
  const { request } = context;
  const env = context.env as RegistryEnv;
  const rawCampaign = new URL(request.url).searchParams.get('campaign') ?? '0';
  if (!/^\d+$/.test(rawCampaign) || Number(rawCampaign) > 9999) {
    return jsonResponse(
      { error: 'INVALID_CAMPAIGN', message: 'campaign must be an integer from 0 to 9999' },
      400,
      { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    );
  }

  const campaignId = Number(rawCampaign);
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(new URL(request.url).toString(), request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const registry = buildCampaignRegistry(await fetchAllEvents(env), campaignId);
    const response = jsonResponse(
      { ...registry, updatedAt: Date.now() },
      200,
      {
        'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 5}`,
        'Access-Control-Allow-Origin': '*'
      }
    );
    context.waitUntil?.(cache.put(cacheKey, response.clone()));
    return response;
  } catch {
    return jsonResponse(
      { error: 'UPSTREAM_UNAVAILABLE', message: 'claim registry could not read Drops events' },
      503,
      { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    );
  }
};
