// What one address holds, listed once and shared.
//
// HOLDINGS ARE THE ONLY INDEX THAT POINTS THIS WAY. Xtrata cannot answer "what
// did this address inscribe", so both self-attested documents — the name in
// `players.ts` and the picture in `pictures.ts` — are found the same way: list
// what the wallet holds, walk it newest first, and take the first document that
// parses and attests.
//
// WHICH MEANT ASKING TWICE FOR ONE ANSWER. Both resolvers made the same
// `/nft/holdings` request for the same address, moments apart, and neither knew
// the other had. That was invisible while the only caller was a Profile panel
// looking up one person on demand. It stops being invisible the moment a list
// wants a name AND a face for every row: a page of twenty-five games has up to
// fifty distinct addresses, and the duplication is fifty avoidable requests
// against a rate limit the wallet spends from too.
//
// The document READS are already shared — `XtrataReader` caches text and meta
// by id, so whichever resolver walks the list second re-reads nothing. This is
// the one piece that was not.
//
// It caches the ID LIST and nothing about what the ids mean. A holding can be
// sold and one resolver's conclusion must never be reachable through the
// other's; each keeps its own answer, and `forget` here drops only the list.

import type { Endpoint } from './endpoint.js';

/** How many holdings to list. Both resolvers stop at the same bound. */
export const MAX_HOLDINGS = 12;

const XTRATA_ASSET =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription';

export interface HoldingsOptions {
  endpoint: Endpoint;
  asset?: string;
  limit?: number;
}

export class Holdings {
  private readonly endpoint: Endpoint;
  private readonly asset: string;
  private readonly limit: number;
  private readonly cache = new Map<string, number[]>();
  private readonly inFlight = new Map<string, Promise<number[]>>();

  constructor(options: HoldingsOptions) {
    this.endpoint = options.endpoint;
    this.asset = options.asset ?? XTRATA_ASSET;
    this.limit = options.limit ?? MAX_HOLDINGS;
  }

  /** The list already read, or undefined. No network, ever. */
  peek(address: string): number[] | undefined {
    return this.cache.get(key(address));
  }

  /**
   * Inscription ids this address holds, newest first.
   *
   * THROWN, NOT RETURNED, on a failed read — the distinction both resolvers
   * already draw and the reason they cache the way they do. A lookup that
   * returns "nothing found" when it means "could not ask" gets remembered as an
   * absence, and one rate limit makes somebody anonymous and faceless for the
   * rest of the session. Same mistake as reading a 429 on a balance as zero.
   *
   * Concurrent callers share one request rather than racing: a list wanting a
   * name and a face for the same row asks once.
   */
  async list(address: string): Promise<number[]> {
    const who = key(address);
    if (!who) return [];

    const known = this.cache.get(who);
    if (known !== undefined) return known;
    const running = this.inFlight.get(who);
    if (running) return running;

    const work = this.read(who)
      .then((ids) => {
        this.cache.set(who, ids);
        this.inFlight.delete(who);
        return ids;
      })
      .catch((error: unknown) => {
        this.inFlight.delete(who);
        throw error;
      });
    this.inFlight.set(who, work);
    return work;
  }

  private async read(address: string): Promise<number[]> {
    const path =
      `/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(address)}` +
      `&asset_identifiers=${encodeURIComponent(this.asset)}&limit=${this.limit}`;
    const response = await this.endpoint.request(path);
    if (!response.ok) throw new Error(`holdings lookup: HTTP ${response.status}`);

    const body = (await response.json()) as { results?: Array<{ value?: { hex?: string } }> };
    const ids: number[] = [];
    for (const row of body.results ?? []) {
      // A uint Clarity value: 0x01 then sixteen bytes big-endian.
      const hex = String(row.value?.hex ?? '').replace(/^0x01/, '');
      const id = Number.parseInt(hex, 16);
      if (Number.isSafeInteger(id) && id > 0) ids.push(id);
    }
    return ids.slice(0, this.limit);
  }

  /**
   * List this address again next time.
   *
   * Called after somebody inscribes, where the whole point is that what they
   * hold has just changed. Drops only the list: what each resolver concluded
   * from it is that resolver's to forget.
   */
  forget(address: string): void {
    const who = key(address);
    this.cache.delete(who);
    this.inFlight.delete(who);
  }
}

const key = (address: string): string => String(address ?? '').trim().toUpperCase();
