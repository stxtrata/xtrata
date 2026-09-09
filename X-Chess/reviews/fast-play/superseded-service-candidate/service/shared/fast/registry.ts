import { deserialize, serializeUint, bytesToHex } from '../chain/clarity.js';
import type { ClarityJs } from '../chain/clarity.js';
import { FAST_PROTOCOL, FAST_RULES, insist, integer, checkOpening } from './protocol.js';
import type { Opening } from './protocol.js';
export interface RegistryConfig { registry: string; network: Opening['network']; api: string; confirmations: number }
export interface Invitation { game: number; creator: string; opponent: string; creatorWhite: boolean; creatorKey: string; opponentKey: string | null; referee: string; baseMs: number; incrementMs: number; openedHeight: number; joinedHeight: number }
const n = (v: ClarityJs): number => { const result = Number(v); insist(integer(result, 0, Number.MAX_SAFE_INTEGER), 'Invalid registry number'); return result; };
const key = (v: ClarityJs): string => { insist(v instanceof Uint8Array, 'Invalid registry key'); return bytesToHex(v); };
export function invitation(game: number, raw: ClarityJs): Invitation {
  insist(raw && typeof raw === 'object' && !Array.isArray(raw), 'Game not found in registry');
  const r = raw as Record<string, ClarityJs>;
  insist(typeof r.creator === 'string' && typeof r.opponent === 'string' && typeof r['creator-white'] === 'boolean', 'Invalid registry row');
  return { game, creator: r.creator, opponent: r.opponent, creatorWhite: r['creator-white'], creatorKey: key(r['creator-key']),
    opponentKey: r['opponent-key'] === null ? null : key(r['opponent-key']), referee: key(r.referee),
    baseMs: n(r['base-ms']), incrementMs: n(r['increment-ms']), openedHeight: n(r['opened-height']), joinedHeight: n(r['joined-height']) };
}
export function openingFrom(config: Pick<RegistryConfig, 'registry' | 'network'>, row: Invitation): Opening {
  insist(row.opponentKey && row.joinedHeight > 0, 'Waiting for the invited opponent to join on chain');
  const o: Opening = { protocol: FAST_PROTOCOL, rules: FAST_RULES, network: config.network, registry: config.registry,
    game: row.game, white: row.creatorWhite ? row.creator : row.opponent, black: row.creatorWhite ? row.opponent : row.creator,
    whiteKey: row.creatorWhite ? row.creatorKey : row.opponentKey, blackKey: row.creatorWhite ? row.opponentKey : row.creatorKey,
    referee: row.referee, baseMs: row.baseMs, incrementMs: row.incrementMs, joinedHeight: row.joinedHeight };
  checkOpening(o); return o;
}
export async function loadOpening(config: RegistryConfig, game: number, fetcher = fetch): Promise<Opening> {
  insist(integer(game, 1, Number.MAX_SAFE_INTEGER), 'Invalid game number');
  insist(/^S[0-9A-Z]+\.[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(config.registry), 'Registry has not been configured');
  const [address, name] = config.registry.split('.');
  const call = async (fn: string, args: string[] = []): Promise<ClarityJs> => {
    const response = await fetcher(`${config.api}/v2/contracts/call-read/${address}/${name}/${fn}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000),
      body: JSON.stringify({ sender: address, arguments: args }) });
    insist(response.ok, 'Registry API unavailable');
    const body = await response.json() as {okay?: boolean; result?: string};
    insist(body.okay && typeof body.result === 'string', 'Registry read failed');
    return deserialize(body.result);
  };
  insist(await call('get-format') === 1n, 'Unsupported registry format');
  const row = invitation(game, await call('get-game', [serializeUint(game)]));
  const o = openingFrom(config, row);
  const response = await fetcher(config.api + '/v2/info', { signal: AbortSignal.timeout(15000) });
  insist(response.ok, 'Unable to check registry confirmation height');
  const tip = await response.json() as { stacks_tip_height?: number };
  insist(integer(tip.stacks_tip_height, 0, Number.MAX_SAFE_INTEGER) && tip.stacks_tip_height >= row.joinedHeight + config.confirmations, 'Waiting for registry confirmations');
  return o;
}
