/**
 * GET /collection-drop/registry?contract=SP...proof-of-free-v1&campaign=0
 *
 * Claim-only public registry for recursive collection masters. Drops v1.1
 * stores campaign drops by global drop id, so the event index is the efficient
 * public read surface for reconstructing edition -> claim state. The result is
 * edge-cached and intentionally contains only claimed editions.
 */
import { cvToHex, cvToJSON, hexToCV, uintCV } from '@stacks/transactions';
import type { Env } from '../lib/db';
import { applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey } from '../lib/hiro-keys';
import { jsonResponse } from '../lib/utils';

const HIRO = 'https://api.hiro.so';
const DEFAULT_DROPS_CONTRACT =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v1-1';
const PAGE_SIZE = 50;
const PAGE_CONCURRENCY = 8;
const MAX_PAGES = 1000;
const CACHE_SECONDS = 60;

type RegistryEnv = Env & {
  HIRO_API_KEYS?: string;
  HIRO_API_KEY?: string;
  VITE_HIRO_API_KEY?: string;
  POF_CONTRACT_ID?: string;
};

type ContractEvent = {
  tx_id?: string;
  block_height?: number;
  event_index?: number;
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

const hiroFetch = async (
  env: RegistryEnv,
  url: string,
  init: RequestInit = {}
): Promise<Response> => {
  const attempts: Array<string | null> = [
    ...getHiroApiKeys(env as unknown as Record<string, unknown>),
    null
  ];
  let lastError: unknown;
  for (let index = 0; index < attempts.length; index += 1) {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    try {
      applyHiroApiKey(headers, attempts[index]);
      const response = await fetch(url, { ...init, headers });
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
  contractId: string,
  offset: number
): Promise<EventPage> => {
  const url =
    `${HIRO}/extended/v1/contract/${contractId}/events` +
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

const readOnlyTuple = async (
  env: RegistryEnv,
  contractId: string,
  functionName: string,
  args: string[] = []
): Promise<Record<string, JsonCv>> => {
  const [address, contractName, extra] = contractId.split('.');
  if (!address || !contractName || extra) throw new Error('invalid controller contract');
  const response = await hiroFetch(
    env,
    `${HIRO}/v2/contracts/call-read/${address}/${contractName}/${functionName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: address, arguments: args })
    }
  );
  if (!response.ok) throw new Error(`${functionName} ${response.status}`);
  const body = (await response.json()) as { okay?: boolean; result?: string };
  if (!body.okay || !body.result) throw new Error(`${functionName} failed`);
  const value = unwrap(cvToJSON(hexToCV(body.result))) as Record<string, JsonCv> | null;
  if (!value || typeof value !== 'object') throw new Error(`${functionName} returned invalid data`);
  return value;
};

const fetchProofOfFreeState = async (
  env: RegistryEnv,
  contractId: string,
  campaignId: number
) => {
  const [config, campaign] = await Promise.all([
    readOnlyTuple(env, contractId, 'get-collection-config'),
    readOnlyTuple(env, contractId, 'get-campaign', [cvToHex(uintCV(campaignId))])
  ]);
  const engineSha256 = (textField(config, 'engine-sha256') ?? '').replace(/^0x/, '').toLowerCase();
  const protocol = textField(config, 'protocol');
  const configuredCampaign = uintField(config, 'campaign-id');
  if (
    protocol !== 'proof-of-free/v3' ||
    configuredCampaign !== campaignId ||
    !/^[0-9a-f]{64}$/.test(engineSha256)
  ) {
    throw new Error('controller collection configuration mismatch');
  }
  return {
    engineId: uintField(config, 'engine-id'),
    engineSha256,
    maxSupply: uintField(config, 'max-supply'),
    active: textField(campaign, 'active') === 'true',
    dropsCreated: uintField(campaign, 'drops-created'),
    policy: {
      onePerWallet: textField(campaign, 'one-per-wallet') === 'true',
      requireBns: textField(campaign, 'require-bns') === 'true',
      onePerBns: textField(campaign, 'one-per-bns') === 'true'
    }
  };
};

const fetchAllEvents = async (env: RegistryEnv, contractId: string): Promise<ContractEvent[]> => {
  const first = await fetchEventPage(env, contractId, 0);
  const events = [...(first.results ?? [])];
  const reportedTotal = Number(first.total);
  if (Number.isFinite(reportedTotal) && reportedTotal > events.length) {
    const offsets: number[] = [];
    for (let offset = PAGE_SIZE; offset < reportedTotal; offset += PAGE_SIZE) offsets.push(offset);
    for (let index = 0; index < offsets.length; index += PAGE_CONCURRENCY) {
      const pages = await Promise.all(
        offsets.slice(index, index + PAGE_CONCURRENCY).map((offset) => fetchEventPage(env, contractId, offset))
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
        fetchEventPage(env, contractId, (pageIndex + index) * PAGE_SIZE)
      )
    );
    for (const page of pages) events.push(...(page.results ?? []));
    if (pages.some((page) => (page.results?.length ?? 0) < PAGE_SIZE)) return events;
  }
  throw new Error('contract event pagination exceeded safety limit');
};

export const buildCampaignRegistry = (
  events: ContractEvent[],
  campaignId: number,
  contractId = DEFAULT_DROPS_CONTRACT,
  engineSha256: string | null = null
) => {
  const claims = new Map<number, Record<string, unknown>>();
  let maxSupply: number | null = null;
  let dropsCreated = 0;
  let engineId: number | null = null;
  let active = false;
  let policy = { onePerWallet: false, requireBns: false, onePerBns: false };
  const dedicatedPoF = contractId.endsWith('.proof-of-free-v1');

  const orderedEvents = events.some((event) => Number.isFinite(event.block_height))
    ? [...events].sort((a, b) =>
        (Number(a.block_height ?? 0) - Number(b.block_height ?? 0)) ||
        (Number(a.event_index ?? 0) - Number(b.event_index ?? 0))
      )
    : events;
  for (const event of orderedEvents) {
    const tuple = tupleFromEvent(event);
    if (!tuple || uintField(tuple, 'campaign-id') !== campaignId) continue;
    const eventName = textField(tuple, 'event');
    if (eventName === 'create-campaign') {
      const createdActive = textField(tuple, 'active');
      // Drops v1.1 predates this event field and starts active. The dedicated
      // PoF controller emits false because provisioning happens while closed.
      active = createdActive === null ? true : createdActive === 'true';
      maxSupply = uintField(tuple, 'max-supply');
      engineId = uintField(tuple, 'engine-id');
      policy = {
        onePerWallet: textField(tuple, 'one-per-wallet') === 'true',
        requireBns: textField(tuple, 'require-bns') === 'true',
        onePerBns: textField(tuple, 'one-per-bns') === 'true'
      };
      continue;
    }
    if (eventName === 'set-campaign-active') {
      active = textField(tuple, 'active') === 'true';
      continue;
    }
    if (eventName === 'create-campaign-drop') {
      dropsCreated += 1;
      continue;
    }
    if (eventName !== 'claim-campaign') continue;

    const rawEdition = uintField(tuple, 'edition');
    const tokenId = uintField(tuple, 'token-id');
    const owner = textField(tuple, 'claimer');
    if (rawEdition === null || tokenId === null || !owner) continue;
    const edition = dedicatedPoF ? rawEdition : rawEdition + 1;
    claims.set(edition, {
      edition,
      claimed: true,
      tokenId,
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
    protocol: 'proof-of-free/claimed-registry',
    version: 1,
    campaignId,
    contractId,
    engineId,
    engineSha256,
    maxSupply,
    active,
    policy,
    dropsCreated,
    claimedCount: items.length,
    claims: items,
    // Compatibility alias for the existing collection-drop consumer.
    items
  };
};

export const onRequestGet: PagesFunction = async (context) => {
  const { request } = context;
  const env = context.env as RegistryEnv;
  const params = new URL(request.url).searchParams;
  const rawCampaign = params.get('campaign') ?? '0';
  const requestedContract = params.get('contract') ?? DEFAULT_DROPS_CONTRACT;
  if (!/^\d+$/.test(rawCampaign) || Number(rawCampaign) > 9999) {
    return jsonResponse(
      { error: 'INVALID_CAMPAIGN', message: 'campaign must be an integer from 0 to 9999' },
      400,
      { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    );
  }
  const allowedContracts = [DEFAULT_DROPS_CONTRACT, env.POF_CONTRACT_ID].filter(Boolean);
  if (!allowedContracts.includes(requestedContract)) {
    return jsonResponse(
      { error: 'CONTRACT_NOT_ALLOWED', message: 'contract is not an enabled collection controller' },
      403,
      { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    );
  }

  const campaignId = Number(rawCampaign);
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(new URL(request.url).toString(), request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const proofOfFreeState = requestedContract === env.POF_CONTRACT_ID
      ? await fetchProofOfFreeState(env, requestedContract, campaignId)
      : null;
    const registry = buildCampaignRegistry(
      await fetchAllEvents(env, requestedContract),
      campaignId,
      requestedContract,
      proofOfFreeState?.engineSha256 ?? null
    );
    if (proofOfFreeState) {
      registry.engineId = proofOfFreeState.engineId;
      registry.maxSupply = proofOfFreeState.maxSupply;
      registry.active = proofOfFreeState.active;
      registry.dropsCreated = proofOfFreeState.dropsCreated ?? registry.dropsCreated;
      registry.policy = proofOfFreeState.policy;
    }
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
