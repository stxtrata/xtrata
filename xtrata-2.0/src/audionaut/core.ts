// Audionaut gate: pure logic (no DOM, no wallet). Decides whether a Stacks address
// holds at least one Audionaut. Audionauts are inscriptions on the Xtrata core
// contract that were minted through the Audionauts collection contract, so:
//   1. list the core-contract inscriptions the wallet holds (Hiro NFT holdings), then
//   2. ask the collection contract whether any of those ids were minted by it
//      (get-token-mint-context returns (some ...) only for its own mints).
// This is a client-side check: fine for a members' page, not a vault.

export const CORE_ASSET_ID =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription';
export const COLLECTION_CONTRACT_ID =
  'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX.xtrata-collection-audionauts-1-3c855746';

export const STX_MAINNET_RE = /^S[PM][0-9A-HJKMNP-TV-Z]{37,40}$/;

export type GateOptions = {
  hiroBase?: string;
  fetchImpl?: typeof fetch;
  maxHeld?: number;
  concurrency?: number;
  signal?: AbortSignal;
};

export type GateResult = { holds: boolean; tokenId?: number; checked: number; truncated: boolean };

// Clarity `uint` as a hex-encoded Clarity value: 0x01 + 16 byte big-endian.
export const uintArgHex = (value: number | bigint): string =>
  '0x01' + BigInt(value).toString(16).padStart(32, '0');

export const parseUintRepr = (repr: unknown): number | null => {
  if (typeof repr !== 'string') return null;
  const match = /^u(\d+)$/.exec(repr.trim());
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isSafeInteger(n) ? n : null;
};

// A call-read `result` for an `(optional ...)`: 0x0a = some, 0x09 = none.
export const isSomeResult = (hex: unknown): boolean =>
  typeof hex === 'string' && hex.toLowerCase().startsWith('0x0a');

const trimBase = (base: string) => base.replace(/\/$/, '');

export async function listHeldTokenIds(address: string, opts: GateOptions = {}): Promise<{ ids: number[]; truncated: boolean }> {
  const base = trimBase(opts.hiroBase ?? '/hiro/mainnet');
  const doFetch = opts.fetchImpl ?? fetch;
  const maxHeld = opts.maxHeld ?? 1000;
  const pageSize = 50;
  const ids: number[] = [];
  let offset = 0;
  let truncated = false;
  while (ids.length < maxHeld) {
    const url =
      `${base}/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(address)}` +
      `&asset_identifiers=${encodeURIComponent(CORE_ASSET_ID)}&limit=${pageSize}&offset=${offset}`;
    const res = await doFetch(url, { headers: { Accept: 'application/json' }, signal: opts.signal });
    if (!res.ok) throw new Error(`Holdings lookup failed (HTTP ${res.status}).`);
    const json = (await res.json()) as { total?: number; results?: Array<{ value?: { repr?: string } }> };
    const results = json.results ?? [];
    for (const item of results) {
      const id = parseUintRepr(item?.value?.repr);
      if (id !== null) ids.push(id);
    }
    const total = Number(json.total ?? results.length);
    offset += pageSize;
    if (results.length < pageSize || offset >= total) break;
    if (ids.length >= maxHeld) truncated = true;
  }
  return { ids, truncated };
}

export async function isAudionautToken(tokenId: number, sender: string, opts: GateOptions = {}): Promise<boolean> {
  const base = trimBase(opts.hiroBase ?? '/hiro/mainnet');
  const doFetch = opts.fetchImpl ?? fetch;
  const [contractAddress, contractName] = COLLECTION_CONTRACT_ID.split('.');
  const res = await doFetch(
    `${base}/v2/contracts/call-read/${contractAddress}/${contractName}/get-token-mint-context`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ sender, arguments: [uintArgHex(tokenId)] }),
      signal: opts.signal
    }
  );
  if (!res.ok) throw new Error(`Collection lookup failed (HTTP ${res.status}).`);
  const json = (await res.json()) as { okay?: boolean; result?: string };
  if (json.okay === false) throw new Error('Collection lookup was rejected.');
  return isSomeResult(json.result);
}

export async function findAudionaut(address: string, opts: GateOptions = {}): Promise<GateResult> {
  if (!STX_MAINNET_RE.test(address)) throw new Error('Connect a mainnet Stacks address.');
  const { ids, truncated } = await listHeldTokenIds(address, opts);
  const concurrency = Math.max(1, opts.concurrency ?? 8);
  let checked = 0;
  for (let i = 0; i < ids.length; i += concurrency) {
    const batch = ids.slice(i, i + concurrency);
    const flags = await Promise.all(batch.map((id) => isAudionautToken(id, address, opts)));
    checked += batch.length;
    const hit = flags.findIndex(Boolean);
    if (hit !== -1) return { holds: true, tokenId: batch[hit], checked, truncated };
  }
  return { holds: false, checked, truncated };
}
