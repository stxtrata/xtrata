// Audionaut edition number (1 to 111) for a held token. The Xtrata token id says which
// inscription you hold; the edition is which of the 111 Audionauts it is. Each Audionaut
// is its own small HTML inscription that carries its edition, e.g.
//   <title>Audionaut 029</title> ... <script data-edition="29" data-seed="...">
// so we read the inscription's content from the same-origin /i/<id> route (immutable, so
// the browser and the edge cache it). Display only: access is still decided by core.ts.
import { CORE_ASSET_ID, isAudionautToken, listHeldTokenIds, type GateOptions } from './core';

export const AUDIONAUT_COUNT = 111;
const CORE_CONTRACT_ID = CORE_ASSET_ID.split('::')[0];

export const parseEdition = (html: unknown): number | null => {
  if (typeof html !== 'string') return null;
  const match = /data-edition\s*=\s*["'](\d{1,3})["']/i.exec(html) ?? /<title>\s*Audionaut\s+(\d{1,3})\s*<\/title>/i.exec(html);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isInteger(n) && n >= 1 && n <= AUDIONAUT_COUNT ? n : null;
};

export type EditionOptions = { fetchImpl?: typeof fetch; signal?: AbortSignal };

const cache = new Map<number, number>();

export async function fetchEdition(tokenId: number, opts: EditionOptions = {}): Promise<number | null> {
  const known = cache.get(tokenId);
  if (known !== undefined) return known;
  try {
    const doFetch = opts.fetchImpl ?? fetch;
    const res = await doFetch(`/i/${tokenId}?contractId=${encodeURIComponent(CORE_CONTRACT_ID)}&network=mainnet`, {
      headers: { Accept: 'text/html' },
      signal: opts.signal
    });
    if (!res.ok) return null;
    const edition = parseEdition(await res.text());
    if (edition !== null) cache.set(tokenId, edition);
    return edition;
  } catch {
    return null; // display only: never let this get in the way of unlocking
  }
}

export type HeldAudionaut = { tokenId: number; edition: number | null };

// The Audionaut to show for a wallet: the lowest edition number among those it holds (so a
// wallet with #29 and #84 shows #29). Editions are read from the inscriptions; if none can
// be read the lowest Xtrata token id is used instead. Returns null when nothing is found or
// a lookup fails. Display only: access is still decided by findAudionaut in core.ts.
export async function lowestHeldAudionaut(
  address: string,
  opts: GateOptions & EditionOptions = {}
): Promise<HeldAudionaut | null> {
  try {
    const { ids } = await listHeldTokenIds(address, opts);
    const concurrency = Math.max(1, opts.concurrency ?? 8);
    const held: number[] = [];
    for (let i = 0; i < ids.length; i += concurrency) {
      const batch = ids.slice(i, i + concurrency);
      const flags = await Promise.all(batch.map((id) => isAudionautToken(id, address, opts)));
      batch.forEach((id, n) => flags[n] && held.push(id));
    }
    if (!held.length) return null;
    const found: HeldAudionaut[] = await Promise.all(
      held.map(async (tokenId) => ({ tokenId, edition: await fetchEdition(tokenId, opts) }))
    );
    found.sort((a, b) => (a.edition ?? Infinity) - (b.edition ?? Infinity) || a.tokenId - b.tokenId);
    return found[0];
  } catch {
    return null;
  }
}
