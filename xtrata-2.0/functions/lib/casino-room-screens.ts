/**
 * Checking that a player holds the inscriptions they want on their cube's screens (functions/lib/casino-screens.ts).
 *
 * Read from the chain, not from an index: `get-owner` on the core contract, through Hiro's mainnet API, for each token (at most
 * six). The holder must be the mainnet twin of the signed-in address.
 *
 * Three answers, never two (CLAUDE.md, the recurring bug class): held, not held (the contract answered and the owner is somebody
 * else or nobody), or "could not check" (the API failed, timed out or said something we cannot read). A failed read is never
 * treated as "not held", and never as "held".
 */
import { cvToHex, cvToJSON, hexToCV, uintCV } from '@stacks/transactions';
import { applyHiroApiKey, getHiroApiKeys } from './hiro-keys';
import { BNS_API_BASES, mainnetTwin } from './casino-room-bns';
import { SCREENS_CONTRACT, encodeScreens, parseScreens, screenIds } from './casino-screens';

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;
/** Every read of one check together gets this long. */
export const SCREENS_TIMEOUT_MS = 4_000;

export type OwnerRead = { ok: true; owner: string | null } | { ok: false };

/** `get-owner`'s answer: (ok (some principal)) is an owner; (ok none) is nobody (no such token); anything else is a failed read. */
export const parseOwnerResult = (resultHex: string): OwnerRead => {
  let json: any;
  try { json = cvToJSON(hexToCV(resultHex)); } catch { return { ok: false }; }
  if (!json || json.success !== true) return { ok: false };
  const inner = json.value;
  if (!inner || typeof inner.type !== 'string') return { ok: false };
  if (inner.value === null || inner.value === undefined) return inner.type.startsWith('(optional') ? { ok: true, owner: null } : { ok: false };
  const principal = inner.value;
  return principal && typeof principal.value === 'string' && /^S[A-Z0-9]{20,60}(\.[A-Za-z0-9-_]{1,40})?$/.test(principal.value)
    ? { ok: true, owner: principal.value } : { ok: false };
};

/** Who holds token `id` on `contract` (mainnet). */
export const ownerOf = async (
  contract: string, id: number, env: Record<string, unknown> = {}, options: { fetcher?: Fetcher; signal?: AbortSignal } = {}
): Promise<OwnerRead> => {
  const [address, name] = contract.split('.');
  if (!address || !name || !Number.isSafeInteger(id) || id < 0) return { ok: false };
  const fetcher: Fetcher = options.fetcher ?? ((input, init) => fetch(input, init));
  const body = JSON.stringify({ sender: address, arguments: [cvToHex(uintCV(id))] });
  const keys = [...getHiroApiKeys(env as any).slice(0, 1), null];      // the first key if there is one, then without a key
  for (const base of BNS_API_BASES) {
    for (const key of keys) {
      if (options.signal?.aborted) return { ok: false };
      try {
        const headers = new Headers({ 'content-type': 'application/json', accept: 'application/json' });
        applyHiroApiKey(headers, key);
        const response = await fetcher(`${base}/v2/contracts/call-read/${address}/${name}/get-owner`, { method: 'POST', headers, body, signal: options.signal });
        if (!response.ok) continue;
        const json = (await response.json()) as { okay?: boolean; result?: unknown };
        if (!json?.okay || typeof json.result !== 'string') continue;
        const parsed = parseOwnerResult(json.result);
        if (parsed.ok) return parsed;
      } catch {
        /* timeout or network error: try the next way */
      }
    }
  }
  return { ok: false };
};

export type ScreensCheck =
  | { ok: true; sc: string }
  | { ok: false; code: 'screens-bad' | 'screens-no-address' | 'screens-off' }
  | { ok: false; code: 'screens-not-yours'; ids: number[] }
  | { ok: false; code: 'screens-could-not-check' };

/**
 * May the player signed in as `address` show these screens? `sc` comes back in its canonical form. An empty set needs no check.
 * The Pages variable CASINO_SCREENS_DISABLED = "1" switches inscriptions off (nobody can set any; clearing still works).
 */
export const checkScreens = async (
  address: string, sc: unknown, env: Record<string, unknown> = {}, options: { fetcher?: Fetcher; contract?: string } = {}
): Promise<ScreensCheck> => {
  const parsed = parseScreens(sc);
  if (!parsed) return { ok: false, code: 'screens-bad' };
  const ids = screenIds(parsed);
  if (!ids.length) return { ok: true, sc: '' };
  if (env.CASINO_SCREENS_DISABLED === '1') return { ok: false, code: 'screens-off' };
  const twin = mainnetTwin(address);
  const contract = options.contract ?? SCREENS_CONTRACT;
  if (!twin || !contract) return { ok: false, code: 'screens-no-address' };
  const signal = AbortSignal.timeout(SCREENS_TIMEOUT_MS);
  const reads = await Promise.all(ids.map((id) => ownerOf(contract, id, env, { fetcher: options.fetcher, signal })));
  if (reads.some((r) => !r.ok)) return { ok: false, code: 'screens-could-not-check' };
  const notMine = ids.filter((_, i) => { const r = reads[i]; return r.ok && r.owner !== twin; });
  if (notMine.length) return { ok: false, code: 'screens-not-yours', ids: notMine };
  return { ok: true, sc: encodeScreens(parsed) };
};
