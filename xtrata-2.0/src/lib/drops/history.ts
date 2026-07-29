import { Cl, ClarityType, hexToCV } from '@stacks/transactions';
import { getContractId, type ContractConfig } from '../contract/config';
import { getApiBaseUrls } from '../network/config';
import {
  expectPrincipal,
  expectStringAscii,
  expectTuple,
  expectUInt,
  getTupleValue
} from '../protocol/clarity';

/**
 * Every drop event the contract emits that describes a drop's lifecycle.
 *
 * The campaign variants matter: once a drop is claimed and settled the contract
 * DELETES its `Drops` row, so these print events are the only durable record of
 * that drop and its holder. Campaign drops (the v1.1 path) emit
 * `create-campaign-drop` / `claim-campaign` rather than `create-drop` / `claim`,
 * and omitting them made every settled campaign drop invisible to the history.
 */
export type DropActivityType =
  | 'create-drop'
  | 'create-campaign-drop'
  | 'create-campaign'
  | 'claim'
  | 'claim-campaign'
  | 'claim-fee'
  | 'settle-refund'
  | 'cancel-drop';

const DROP_ACTIVITY_TYPES: readonly DropActivityType[] = [
  'create-drop',
  'create-campaign-drop',
  'create-campaign',
  'claim',
  'claim-campaign',
  'claim-fee',
  'settle-refund',
  'cancel-drop'
];

/** True for both the legacy and campaign claim events. */
export const isClaimActivity = (type: DropActivityType): boolean =>
  type === 'claim' || type === 'claim-campaign';

/** True for both the legacy and campaign drop-creation events. */
export const isCreateActivity = (type: DropActivityType): boolean =>
  type === 'create-drop' || type === 'create-campaign-drop';

/** Unwrap a uint that may be wrapped in an optional, tolerating either shape. */
const optionalUInt = (value: unknown, context: string): bigint | undefined => {
  const cv = value as any;
  if (!cv) return undefined;
  if (cv.type === ClarityType.OptionalNone) return undefined;
  const inner = cv.type === ClarityType.OptionalSome ? cv.value : cv;
  if (!inner || inner.type !== ClarityType.UInt) return undefined;
  return expectUInt(inner, context);
};

/** Hex-encode a (buff 32) that may be wrapped in an optional. */
const optionalBufferHex = (value: unknown): string | undefined => {
  const cv = value as any;
  if (!cv) return undefined;
  if (cv.type === ClarityType.OptionalNone) return undefined;
  const inner = cv.type === ClarityType.OptionalSome ? cv.value : cv;
  if (!inner || inner.type !== ClarityType.Buffer) return undefined;
  const bytes: Uint8Array = inner.buffer ?? inner.value;
  if (!bytes) return undefined;
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export type DropActivityEvent = {
  id: string;
  type: DropActivityType;
  dropId: bigint;
  tokenId?: bigint;
  groupId?: bigint;
  creator?: string;
  claimer?: string;
  nftContract?: string;
  /** Campaign drops only: the campaign this drop belongs to. */
  campaignId?: bigint;
  /** Campaign drops only: 0-based position within the campaign. */
  edition?: bigint;
  /** Campaign claims only: the BNS key the claim was attested against. */
  bnsKey?: string;
  /** create-campaign-drop only: who funded the escrow. */
  funder?: string;
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
  if (!DROP_ACTIVITY_TYPES.includes(type)) {
    return null;
  }
  // create-campaign is campaign-scoped and carries no drop-id.
  if (type === 'create-campaign') {
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
  const funder = tuple.funder ? expectPrincipal(tuple.funder, 'drop.event.funder') : undefined;
  // campaign-id and edition are (optional uint) on some events and a bare uint
  // on others, so unwrap defensively rather than assuming one shape.
  const campaignId = tuple['campaign-id']
    ? optionalUInt(tuple['campaign-id'], 'drop.event.campaign-id')
    : undefined;
  const edition = tuple.edition ? optionalUInt(tuple.edition, 'drop.event.edition') : undefined;
  const bnsKey = tuple['bns-key'] ? optionalBufferHex(tuple['bns-key']) : undefined;
  return {
    id: `${meta.txId ?? 'unknown'}:${meta.eventIndex ?? dropId.toString()}:${type}`,
    type,
    dropId,
    tokenId,
    groupId,
    creator,
    claimer,
    nftContract,
    campaignId,
    edition,
    bnsKey,
    funder,
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

/** Exposed for tests: parse one raw Hiro contract event. */
export const parseDropEventForTest = (event: unknown): DropActivityEvent | null =>
  parseDropEvent(event as HiroContractEvent);

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
