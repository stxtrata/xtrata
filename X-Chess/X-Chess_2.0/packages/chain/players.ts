// Finding the manifest an address wrote about itself.
//
// THE INDEX ONLY POINTS ONE WAY. Xtrata can answer "who made inscription 2993"
// and cannot answer "what did SP4ERAJ8 make" — there is no lookup by creator,
// and finding one by reading all three thousand inscriptions is not a lookup.
//
// So this goes where `mintedAt` goes for the same reason: an inscription is a
// SIP-009 NFT, and NFT HOLDINGS ARE INDEXED BY PRINCIPAL even though creators
// are not. One call lists what an address holds, newest first, and the rest is
// reading candidates until one attests.
//
// HOLDING FINDS IT; CREATING PROVES IT, and keeping those apart is the whole
// security of the thing. A manifest can be transferred like any NFT, so holding
// one says nothing — but `attested` compares the document's address against the
// inscription's CREATOR, which no transfer changes. A name therefore cannot be
// bought, sold or gifted. It can only be inscribed by the key it names, and that
// falls out of the design rather than needing a rule.

import { attested, parsePlayer } from '../protocol/player.js';
import type { Endpoint } from './endpoint.js';
import type { XtrataReader } from './xtrata.js';

/**
 * How many of an address's inscriptions to read before giving up.
 *
 * Holdings come back newest first, so the first that parses and attests is the
 * latest — the same "latest wins" rule tournament revisions use. Somebody with
 * hundreds of inscriptions and no player manifest would otherwise cost hundreds
 * of reads to learn nothing.
 */
export const MAX_SCAN = 12;

export interface PlayerNamesOptions {
  endpoint: Endpoint;
  reader: XtrataReader;
  asset?: string;
  maxScan?: number;
}

export class PlayerNames {
  private readonly endpoint: Endpoint;
  private readonly reader: XtrataReader;
  private readonly asset: string;
  private readonly maxScan: number;

  // null means "asked, and this address has not named itself" — which is a
  // real answer and must not be confused with "not asked yet".
  private readonly cache = new Map<string, string | null>();
  private readonly inFlight = new Map<string, Promise<string | null>>();

  constructor(options: PlayerNamesOptions) {
    this.endpoint = options.endpoint;
    this.reader = options.reader;
    this.asset =
      options.asset ?? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription';
    this.maxScan = options.maxScan ?? MAX_SCAN;
  }

  /** What is already known, without asking. Undefined means "not asked". */
  peek(address: string): string | null | undefined {
    return this.cache.get(address);
  }

  /**
   * The name this address has inscribed for itself, or null.
   *
   * Null covers three different situations on purpose — no manifest, an
   * unreadable one, and one that fails attestation — because a caller can do
   * nothing different about any of them. What matters is that none of them ever
   * produces a name, so a stranger's document cannot become somebody's label.
   */
  async resolve(address: string): Promise<string | null> {
    const known = this.cache.get(address);
    if (known !== undefined) return known;
    const running = this.inFlight.get(address);
    if (running) return running;

    const work = this.look(address).then(
      (name) => {
        this.cache.set(address, name);
        this.inFlight.delete(address);
        return name;
      },
      () => {
        // A failed lookup is NOT cached. "Could not reach the API" must not
        // become "this address has no name" for the rest of the session.
        this.inFlight.delete(address);
        return null;
      }
    );
    this.inFlight.set(address, work);
    return work;
  }

  private async look(address: string): Promise<string | null> {
    const path =
      `/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(address)}` +
      `&asset_identifiers=${encodeURIComponent(this.asset)}&limit=${this.maxScan}`;
    const response = await this.endpoint.request(path);
    // THROWN, NOT RETURNED, and the difference is the whole point of the cache
    // above. Returning null here resolves normally, so "could not ask" was
    // stored as "asked, and this address has no name" — and one rate limit
    // would have made somebody anonymous for the rest of the session. Same
    // mistake as reading a 429 on a balance as a balance of zero.
    if (!response.ok) throw new Error(`holdings lookup: HTTP ${response.status}`);

    const body = (await response.json()) as { results?: Array<{ value?: { hex?: string } }> };
    const ids: number[] = [];
    for (const row of body.results ?? []) {
      // A uint Clarity value: 0x01 then sixteen bytes big-endian.
      const hex = String(row.value?.hex ?? '').replace(/^0x01/, '');
      const id = Number.parseInt(hex, 16);
      if (Number.isSafeInteger(id) && id > 0) ids.push(id);
    }

    for (const id of ids.slice(0, this.maxScan)) {
      const text = await this.reader.text(id);
      if (text === null) continue;
      const parsed = parsePlayer(text);
      if (!parsed.ok) continue;

      // The claim is only worth checking once the document says it is about
      // this address; otherwise it is somebody else's manifest that happens to
      // be held here.
      if (parsed.player!.address.trim().toUpperCase() !== address.trim().toUpperCase()) continue;
      if (attested(parsed.player, await this.reader.creator(id))) return parsed.player!.name;
    }
    return null;
  }

  /** Resolve several, and say whether anything new was learned. */
  async resolveAll(addresses: readonly string[]): Promise<boolean> {
    const wanted = [...new Set(addresses)].filter((a) => a && this.cache.get(a) === undefined);
    if (!wanted.length) return false;
    // Serial rather than parallel: each address costs a holdings call plus a
    // read per candidate, and the rate limit is per IP and shared with the
    // board's own polling.
    for (const address of wanted) await this.resolve(address);
    return wanted.some((a) => this.cache.get(a));
  }
}
