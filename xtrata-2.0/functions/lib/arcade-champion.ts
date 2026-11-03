import {cvToHex, cvToValue, hexToCV, Cl} from '@stacks/transactions';
import {applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey} from './hiro-keys';

/**
 * The current Astro Blaster 3 champion (rank 1 on the all-time "astro3" board) for the homepage hero.
 * One read-only call to the scores contract. A failed read is reported as unavailable, never as
 * "no champion", so the hero hides itself instead of showing a made-up empty board.
 */
export const SCORES_CONTRACT = {address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', name: 'xtrata-arcade-scores-v2'} as const;
export const CHAMPION_BOARD = 'astro3';
const HIRO = 'https://api.mainnet.hiro.so';
const NAME_RE = /^[A-Za-z0-9 _.-]{1,12}$/;

export type Champion = {version: 1; name: string; score: number; player: string; stacksHeight: number | null};
type Transport = typeof fetch;

const field = (tuple: any, key: string): unknown => {
  const cell = tuple?.[key];
  return cell && typeof cell === 'object' && 'value' in cell ? cell.value : cell;
};

/** Turns the decoded optional tuple into a champion, or null when the entry is empty or malformed. */
export const parseChampion = (decoded: any): Champion | null => {
  const tuple = decoded && typeof decoded === 'object' && 'value' in decoded ? decoded.value : decoded;
  if (!tuple || typeof tuple !== 'object') return null;
  const name = String(field(tuple, 'name') ?? '').trim();
  const score = Number(field(tuple, 'score'));
  const player = String(field(tuple, 'player') ?? '');
  const height = Number(field(tuple, 'stacks-height'));
  if (!NAME_RE.test(name) || !Number.isSafeInteger(score) || score <= 0 || !/^S[A-Z0-9]{20,60}$/.test(player)) return null;
  return {version: 1, name, score, player, stacksHeight: Number.isSafeInteger(height) && height > 0 ? height : null};
};

export const readChampion = async (env: Record<string, unknown>, transport: Transport = fetch): Promise<Champion | null | 'failed'> => {
  const body = JSON.stringify({
    sender: SCORES_CONTRACT.address,
    arguments: [cvToHex(Cl.stringAscii(CHAMPION_BOARD)), cvToHex(Cl.uint(0)), cvToHex(Cl.uint(1))]
  });
  const keys: Array<string | null> = [...getHiroApiKeys(env as any), null];
  for (const key of keys) {
    try {
      const headers = new Headers({'content-type': 'application/json'});
      applyHiroApiKey(headers, key);
      const response = await transport(`${HIRO}/v2/contracts/call-read/${SCORES_CONTRACT.address}/${SCORES_CONTRACT.name}/get-entry`, {method: 'POST', headers, body});
      if (!response.ok) {
        if (shouldRetryWithNextHiroKey(response.status)) continue;
        return 'failed';
      }
      const json: any = await response.json();
      if (!json?.okay || typeof json.result !== 'string') return 'failed';
      return parseChampion(cvToValue(hexToCV(json.result), true));
    } catch {
      /* try the next key */
    }
  }
  return 'failed';
};

const json = (body: unknown, status: number, cache: string) =>
  new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json; charset=utf-8', 'cache-control': cache}});

export const handleChampion = async (env: Record<string, unknown>, transport: Transport = fetch) => {
  const result = await readChampion(env, transport);
  if (result === 'failed') return json({error: 'unavailable'}, 503, 'no-store');
  // A new high score shows within about half a minute; the edge shares one read between all visitors.
  return json(result ?? {version: 1, empty: true}, 200, 'public, max-age=20, s-maxage=30');
};
