/**
 * GET /drops/listings — aggregated live drops with a deliberately short edge TTL.
 *
 * The browser used to issue one get-last-drop-id call followed by up to 250
 * sequential get-drop calls. This route performs bounded concurrent reads once
 * at the edge and shares the result between visitors. Mutable claim state is
 * cached for only a few seconds so settled drops disappear quickly.
 */
import { cvToHex, cvToJSON, hexToCV, uintCV } from '@stacks/transactions';
import { jsonResponse } from '../lib/utils';
import type { Env } from '../lib/db';
import { applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey } from '../lib/hiro-keys';
import registry from '../../src/data/drops-registry.json';

const HIRO = 'https://api.hiro.so';
const DISPLAY_LIMIT = 25;
const SCAN_LIMIT = DISPLAY_LIMIT * 10;
const READ_BATCH_SIZE = 16;
const EDGE_CACHE_SECONDS = 5;

type RegistryEntry = {
  label: string;
  address: string;
  contractName: string;
  network: string;
  sponsored?: boolean;
  sponsorApi?: string;
};

type DropsEnv = Env & {
  HIRO_API_KEYS?: string;
  HIRO_API_KEY?: string;
  VITE_HIRO_API_KEY?: string;
};

const hiroFetch = async (env: DropsEnv, url: string, init: RequestInit): Promise<Response> => {
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
  env: DropsEnv,
  contractId: string,
  functionName: string,
  args: string[] = []
) => {
  const [address, name] = contractId.split('.');
  const response = await hiroFetch(
    env,
    `${HIRO}/v2/contracts/call-read/${address}/${name}/${functionName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: address, arguments: args })
    }
  );
  if (!response.ok) throw new Error(`${functionName} ${response.status}`);
  const json = (await response.json()) as { okay?: boolean; result?: string };
  if (!json.okay || !json.result) throw new Error(`${functionName} returned no result`);
  return cvToJSON(hexToCV(json.result));
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

const optionalValue = (node?: { value: unknown }) => {
  const value = node?.value as { value?: unknown } | null | undefined;
  if (value === null || value === undefined) return null;
  return String(value.value ?? value);
};

const readDrop = async (env: DropsEnv, entry: RegistryEntry, dropId: bigint) => {
  const contractId = `${entry.address}.${entry.contractName}`;
  try {
    const tuple = unwrapTuple(
      await callRead(env, contractId, 'get-drop', [cvToHex(uintCV(dropId))])
    );
    if (!tuple) return null;
    const claimedAt = optionalValue(tuple['claimed-at']);
    if (claimedAt !== null) return null;
    return {
      contractId,
      dropId: dropId.toString(),
      creator: String(tuple.creator.value),
      nftContract: String(tuple['nft-contract'].value),
      tokenId: String(tuple['token-id'].value),
      groupId: String(tuple['group-id'].value),
      feeBudget: tuple['fee-budget'] ? String(tuple['fee-budget'].value) : null,
      budgetRemaining: tuple['budget-remaining']
        ? String(tuple['budget-remaining'].value)
        : null,
      claimer: optionalValue(tuple.claimer),
      claimedAt: null
    };
  } catch {
    return null;
  }
};

const readDropsContract = async (env: DropsEnv, entry: RegistryEntry) => {
  const contractId = `${entry.address}.${entry.contractName}`;
  const lastJson = (await callRead(env, contractId, 'get-last-drop-id')) as {
    value?: { value?: string };
  };
  const lastId = BigInt(lastJson?.value?.value ?? 0);
  const drops: Array<Record<string, unknown>> = [];
  let nextId = lastId;
  let scanned = 0;

  while (nextId >= 0n && drops.length < DISPLAY_LIMIT && scanned < SCAN_LIMIT) {
    const ids: bigint[] = [];
    while (nextId >= 0n && ids.length < READ_BATCH_SIZE && scanned < SCAN_LIMIT) {
      ids.push(nextId);
      nextId -= 1n;
      scanned += 1;
    }
    const rows = await Promise.all(ids.map((id) => readDrop(env, entry, id)));
    for (const row of rows) {
      if (row) drops.push(row);
      if (drops.length >= DISPLAY_LIMIT) break;
    }
  }
  return drops;
};

export const onRequestGet: PagesFunction<DropsEnv> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const fresh = url.searchParams.get('fresh') === '1';
  const edgeCache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(`${url.origin}${url.pathname}`);

  if (!fresh) {
    const cached = await edgeCache.match(cacheKey);
    if (cached) return cached;
  }

  const entries = (registry as RegistryEntry[]).filter((entry) => entry.network === 'mainnet');
  const perContract = await Promise.all(
    entries.map((entry) =>
      readDropsContract(env, entry).then(
        (drops) => ({ ok: true as const, drops }),
        () => ({ ok: false as const, drops: [] as Array<Record<string, unknown>> })
      )
    )
  );
  const degraded = perContract.some((result) => !result.ok);
  if (perContract.length > 0 && perContract.every((result) => !result.ok)) {
    return jsonResponse(
      { error: 'UPSTREAM_UNAVAILABLE', message: 'all drops reads failed' },
      503,
      { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    );
  }

  const drops = perContract
    .flatMap((result) => result.drops)
    .sort((left, right) => BigInt(String(right.dropId)) > BigInt(String(left.dropId)) ? 1 : -1)
    .slice(0, DISPLAY_LIMIT);
  const response = jsonResponse(
    { updatedAt: Date.now(), drops, degraded },
    200,
    {
      'Cache-Control': fresh || degraded
        ? 'no-store'
        : `public, max-age=2, s-maxage=${EDGE_CACHE_SECONDS}`,
      'Access-Control-Allow-Origin': '*'
    }
  );
  if (!fresh && !degraded) {
    context.waitUntil(edgeCache.put(cacheKey, response.clone()));
  }
  return response;
};
