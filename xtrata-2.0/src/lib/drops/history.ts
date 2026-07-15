import { Cl, hexToCV } from '@stacks/transactions';
import { getContractId, type ContractConfig } from '../contract/config';
import { getApiBaseUrls } from '../network/config';
import {
  expectPrincipal,
  expectStringAscii,
  expectTuple,
  expectUInt,
  getTupleValue
} from '../protocol/clarity';

export type DropActivityType =
  | 'create-drop'
  | 'claim'
  | 'claim-fee'
  | 'settle-refund'
  | 'cancel-drop';

export type DropActivityEvent = {
  id: string;
  type: DropActivityType;
  dropId: bigint;
  tokenId?: bigint;
  groupId?: bigint;
  creator?: string;
  claimer?: string;
  nftContract?: string;
  txId?: string;
  blockHeight?: number;
  eventIndex?: number;
  timestamp?: string;
};

export type DropActivitySnapshot = {
  contractId: string;
  events: DropActivityEvent[];
  updatedAt: number;
};

type HiroContractEvent = {
  event_index?: number;
  event_type?: string;
  tx_id?: string;
  block_height?: number;
  block_time_iso?: string;
  contract_log?: {
    topic?: string;
    value?: {
      repr?: string;
      hex?: string;
    };
  };
};

type HiroContractEventResponse = {
  results?: HiroContractEvent[];
};

const DROP_EVENT_LIMIT = 50;
const DROP_MAX_EVENTS = 200;

const isHiroCompatibleBase = (baseUrl: string) =>
  baseUrl.includes('hiro.so') || baseUrl.includes('/hiro/');

const shouldTryFallback = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const lower = message.toLowerCase();
  return (
    lower.includes('429') ||
    lower.includes('too many requests') ||
    lower.includes('rate limit') ||
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('cors') ||
    lower.includes('access-control-allow-origin')
  );
};

const sortDropEventsDesc = (a: DropActivityEvent, b: DropActivityEvent) => {
  if (a.dropId !== b.dropId) return b.dropId > a.dropId ? 1 : -1;
  const heightA = a.blockHeight ?? 0;
  const heightB = b.blockHeight ?? 0;
  if (heightA !== heightB) return heightB - heightA;
  const indexA = a.eventIndex ?? 0;
  const indexB = b.eventIndex ?? 0;
  return indexB - indexA;
};

const parseDropEventValue = (
  value: unknown,
  meta: {
    txId?: string;
    blockHeight?: number;
    eventIndex?: number;
    timestamp?: string;
  }
): DropActivityEvent | null => {
  if (!value) return null;
  const tuple = expectTuple(value as any, 'drop.event');
  const type = expectStringAscii(
    getTupleValue(tuple, 'event', 'drop.event'),
    'drop.event.event'
  ) as DropActivityType;
  if (
    type !== 'create-drop' &&
    type !== 'claim' &&
    type !== 'claim-fee' &&
    type !== 'settle-refund' &&
    type !== 'cancel-drop'
  ) {
    return null;
  }
  const dropId = expectUInt(
    getTupleValue(tuple, 'drop-id', 'drop.event'),
    'drop.event.drop-id'
  );
  const tokenId = tuple['token-id'] ? expectUInt(tuple['token-id'], 'drop.event.token-id') : undefined;
  const groupId = tuple['group-id'] ? expectUInt(tuple['group-id'], 'drop.event.group-id') : undefined;
  const creator = tuple.creator ? expectPrincipal(tuple.creator, 'drop.event.creator') : undefined;
  const claimer = tuple.claimer ? expectPrincipal(tuple.claimer, 'drop.event.claimer') : undefined;
  const nftContract = tuple['nft-contract']
    ? expectPrincipal(tuple['nft-contract'], 'drop.event.nft-contract')
    : undefined;
  return {
    id: `${meta.txId ?? 'unknown'}:${meta.eventIndex ?? dropId.toString()}:${type}`,
    type,
    dropId,
    tokenId,
    groupId,
    creator,
    claimer,
    nftContract,
    txId: meta.txId,
    blockHeight: meta.blockHeight,
    eventIndex: meta.eventIndex,
    timestamp: meta.timestamp
  };
};

const parseDropEvent = (event: HiroContractEvent): DropActivityEvent | null => {
  if (!event || event.event_type !== 'smart_contract_log') return null;
  if (event.contract_log?.topic !== 'print') return null;
  const value = event.contract_log.value;
  if (!value) return null;
  try {
    const parsed = value.hex ? hexToCV(value.hex) : Cl.parse(value.repr ?? '');
    return parseDropEventValue(parsed, {
      txId: event.tx_id,
      blockHeight: event.block_height,
      eventIndex: event.event_index,
      timestamp: event.block_time_iso
    });
  } catch {
    return null;
  }
};

const fetchDropEventsPage = async (params: {
  baseUrl: string;
  contractId: string;
  limit: number;
  offset: number;
}) => {
  const url = `${params.baseUrl}/extended/v1/contract/${encodeURIComponent(
    params.contractId
  )}/events?limit=${params.limit}&offset=${params.offset}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Drops events fetch failed (${response.status})`);
  }
  const json = (await response.json()) as HiroContractEventResponse;
  const results = Array.isArray(json.results) ? json.results : [];
  return results.map(parseDropEvent).filter(Boolean) as DropActivityEvent[];
};

export const loadDropsActivity = async (params: {
  contract: ContractConfig;
}): Promise<DropActivitySnapshot> => {
  const contractId = getContractId(params.contract);
  const apiBaseUrls = getApiBaseUrls(params.contract.network).filter(isHiroCompatibleBase);
  let events: DropActivityEvent[] = [];
  let lastError: unknown = null;

  for (let index = 0; index < apiBaseUrls.length; index += 1) {
    const baseUrl = apiBaseUrls[index];
    try {
      for (let offset = 0; offset < DROP_MAX_EVENTS; offset += DROP_EVENT_LIMIT) {
        const page = await fetchDropEventsPage({
          baseUrl,
          contractId,
          limit: DROP_EVENT_LIMIT,
          offset
        });
        events = events.concat(page);
        if (page.length < DROP_EVENT_LIMIT) break;
      }
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
      const hasFallback = index < apiBaseUrls.length - 1;
      if (hasFallback && shouldTryFallback(error)) continue;
      break;
    }
  }

  if (lastError) {
    // History is an enhancement; callers should still render live drops.
    events = [];
  }

  const deduped = new Map<string, DropActivityEvent>();
  for (const event of events) deduped.set(event.id, event);
  return {
    contractId,
    events: Array.from(deduped.values()).sort(sortDropEventsDesc).slice(0, DROP_MAX_EVENTS),
    updatedAt: Date.now()
  };
};
