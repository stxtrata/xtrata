/**
 * The Salon's rule (docs/plans/CASINO-SALON-BNS-PLAN.md): only players with a primary BNS name may enter and play.
 *
 * The casino runs on testnet (ST... addresses) and BNS names live on mainnet. A Leather or Xverse account has the same key on
 * both networks, so the name that counts is the primary BNS name of the mainnet twin of the signed-in address: the same name
 * the room shows on that player's tag. It is read once at sign-in (and again when the player asks), from the BNS-V2 contract's
 * `get-primary`, through Hiro's mainnet API.
 *
 * Three answers, never two: a name, no name (the contract answered and there is none), or "could not check" (the API failed,
 * timed out or said something we cannot read). A failed read is never treated as "no name" (CLAUDE.md, the recurring bug class).
 */
import { addressToString, AddressVersion, createAddress, cvToHex, cvToJSON, hexToCV, principalCV } from '@stacks/transactions';
import { applyHiroApiKey, getHiroApiKeys } from './hiro-keys';

export const BNS_V2_MAINNET = 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2';
export const BNS_API_BASES = ['https://api.mainnet.hiro.so', 'https://api.hiro.so'] as const;
/** The whole lookup (every attempt together) gets this long, so a slow or dead API never holds up sign-in for more. */
export const BNS_TIMEOUT_MS = 3_000;
/** A name is remembered for 10 minutes; "no name" for 30 seconds, so "check again" right after registering works. */
export const BNS_NAME_CACHE_MS = 10 * 60_000;
export const BNS_NONE_CACHE_MS = 30_000;
/** What a BNS name can look like once read (name.namespace, lower case); anything else is treated as a failed read. */
export const BNS_NAME_RE = /^[a-z0-9_-][a-z0-9._-]{0,63}\.[a-z0-9-]{1,20}$/;

export type BnsCheck = { name: string | null; checked: boolean };

/** The mainnet address of the same key (ST... -> SP..., SN... -> SM...); a mainnet address is returned as it is. */
export const mainnetTwin = (address: string): string | null => {
  try {
    const parsed = createAddress(address.trim());
    const version = parsed.version === AddressVersion.TestnetSingleSig ? AddressVersion.MainnetSingleSig
      : parsed.version === AddressVersion.TestnetMultiSig ? AddressVersion.MainnetMultiSig
        : parsed.version;
    if (version !== AddressVersion.MainnetSingleSig && version !== AddressVersion.MainnetMultiSig) return null;
    return addressToString({ ...parsed, version });
  } catch {
    return null;
  }
};

const ascii = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const hex = value.startsWith('0x') ? value.slice(2) : value;
  if (!hex || hex.length % 2 || !/^[0-9a-f]+$/i.test(hex)) return null;
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.slice(i, i + 2), 16);
    if (code < 0x20 || code > 0x7e) return null;
    out += String.fromCharCode(code);
  }
  return out;
};

/**
 * Reads `get-primary`'s answer: (ok (some {name, namespace})) is a name; (ok none) or an (err ...) from the contract is "no
 * primary name" (the contract answered); anything we cannot read is a failed read.
 */
export const parsePrimaryResult = (resultHex: string): { ok: true; name: string | null } | { ok: false } => {
  let json: any;
  try { json = cvToJSON(hexToCV(resultHex)); } catch { return { ok: false }; }
  if (!json || typeof json !== 'object') return { ok: false };
  if (json.success === false) return { ok: true, name: null };
  const optional = json.value;
  if (optional === null || optional === undefined || optional.value === null || optional.value === undefined) {
    return optional && typeof optional === 'object' && 'type' in optional ? { ok: true, name: null } : { ok: false };
  }
  const fields = optional.value?.value;
  if (!fields || typeof fields !== 'object') return { ok: false };
  const name = ascii(fields.name?.value), namespace = ascii(fields.namespace?.value);
  if (!name || !namespace) return { ok: false };
  const full = `${name}.${namespace}`.toLowerCase();
  return BNS_NAME_RE.test(full) ? { ok: true, name: full } : { ok: false };
};

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;
const cache = new Map<string, { name: string | null; at: number }>();
/** For tests. */
export const clearBnsCache = () => cache.clear();

/**
 * The primary BNS name of the player behind `address` (its mainnet twin), as `{ name, checked }`.
 * `checked: false` means the lookup failed: the caller must say "could not check", not "no name".
 */
export const primaryNameOf = async (
  address: string,
  env: Record<string, unknown> = {},
  options: { fetcher?: Fetcher; now?: number; fresh?: boolean } = {}
): Promise<BnsCheck> => {
  const twin = mainnetTwin(address);
  if (!twin) return { name: null, checked: false };
  // Switch: the Pages variable CASINO_ROOM_BNS_LOOKUP = "off" skips the lookup (everyone is "could not check", so the Salon
  // stays closed). For when the BNS API is down, and for local tests that have no network.
  if (String(env.CASINO_ROOM_BNS_LOOKUP ?? '').toLowerCase() === 'off') return { name: null, checked: false };
  const now = options.now ?? Date.now();
  const hit = cache.get(twin);
  if (hit && !options.fresh && now - hit.at < (hit.name ? BNS_NAME_CACHE_MS : BNS_NONE_CACHE_MS)) return { name: hit.name, checked: true };

  const fetcher: Fetcher = options.fetcher ?? ((input, init) => fetch(input, init));
  const [contractAddress, contractName] = BNS_V2_MAINNET.split('.');
  const body = JSON.stringify({ sender: twin, arguments: [cvToHex(principalCV(twin))] });
  const keys = [...getHiroApiKeys(env as any).slice(0, 1), null];   // the first key if there is one, then without a key
  const deadline = AbortSignal.timeout(BNS_TIMEOUT_MS);
  for (const base of BNS_API_BASES) {
    for (const key of keys) {
      if (deadline.aborted) return { name: null, checked: false };
      try {
        const headers = new Headers({ 'content-type': 'application/json', accept: 'application/json' });
        applyHiroApiKey(headers, key);
        const response = await fetcher(`${base}/v2/contracts/call-read/${contractAddress}/${contractName}/get-primary`, {
          method: 'POST', headers, body, signal: deadline
        });
        if (!response.ok) continue;
        const json = (await response.json()) as { okay?: boolean; result?: unknown };
        if (!json?.okay || typeof json.result !== 'string') continue;
        const parsed = parsePrimaryResult(json.result);
        if (!parsed.ok) continue;
        cache.set(twin, { name: parsed.name, at: now });
        return { name: parsed.name, checked: true };
      } catch {
        /* timeout or network error: try the next way */
      }
    }
  }
  return { name: null, checked: false };
};
