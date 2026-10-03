// Audionaut edition number (1 to 111) for a held token. The Xtrata token id says which
// inscription you hold; the edition is which of the 111 Audionauts it is. Each Audionaut
// is its own small HTML inscription that carries its edition, e.g.
//   <title>Audionaut 029</title> ... <script data-edition="29" data-seed="...">
// so we read the inscription's content from the same-origin /i/<id> route (immutable, so
// the browser and the edge cache it). Display only: access is still decided by core.ts.
import { CORE_ASSET_ID } from './core';

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
