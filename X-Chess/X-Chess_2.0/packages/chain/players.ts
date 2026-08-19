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
import { Holdings } from './holdings.js';
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
  /** Shared with the picture resolver, so one address is listed once. */
  holdings?: Holdings;
}

export class PlayerNames {
  private readonly reader: XtrataReader;
  private readonly maxScan: number;
  // The listing moved to `Holdings`, so the endpoint and the asset id are now
  // its business rather than this class's — they are still ACCEPTED here, so
  // every existing caller works unchanged, and passed straight through.
  private readonly index: Holdings;

  // null means "asked, and this address has not named itself" — which is a
  // real answer and must not be confused with "not asked yet".
  private readonly cache = new Map<string, string | null>();
  private readonly inFlight = new Map<string, Promise<string | null>>();
  /**
   * Which inscription supplied the name, when one did.
   *
   * Kept beside the cache rather than folded into it, so `resolve` keeps
   * returning a name and every caller that only wants one is untouched. It
   * exists because a person who has just inscribed a manifest needs the board to
   * say WHICH document it is reading — "your name is Jim Dude" and "your name is
   * Jim Dude, from inscription 3021" answer different questions, and after
   * paying a fee it is the second one being asked.
   */
  private readonly from = new Map<string, number>();

  constructor(options: PlayerNamesOptions) {
    // SHARED WHEN ONE IS GIVEN. A list wanting a name and a face for the same
    // row would otherwise make the same holdings request twice, moments apart.
    // Falls back to its own so a caller that only wants names needs no wiring.
    this.index =
      options.holdings ??
      new Holdings({ endpoint: options.endpoint, asset: options.asset, limit: options.maxScan });
    this.reader = options.reader;
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
    // Listed by `Holdings`, which shares the request with the picture resolver
    // and throws rather than returning an empty list on a failed read — the
    // distinction the cache above depends on. See holdings.ts.
    const ids = await this.index.list(address);

    for (const id of ids.slice(0, this.maxScan)) {
      const text = await this.reader.text(id);
      if (text === null) continue;
      const parsed = parsePlayer(text);
      if (!parsed.ok) continue;

      // The claim is only worth checking once the document says it is about
      // this address; otherwise it is somebody else's manifest that happens to
      // be held here.
      if (parsed.player!.address.trim().toUpperCase() !== address.trim().toUpperCase()) continue;
      if (attested(parsed.player, await this.reader.creator(id))) {
        this.from.set(address, id);
        return parsed.player!.name;
      }
    }
    return null;
  }

  /**
   * Ask again about this address next time.
   *
   * EXISTS BECAUSE OF THE MOMENT AFTER INSCRIBING. A "no" here is cached like
   * any other answer, and it is the answer somebody has just paid to change —
   * so without this, checking whether the manifest landed would report the
   * absence it remembered from before the transaction, for the rest of the
   * session.
   */
  forget(address: string): void {
    const key = address;
    this.cache.delete(key);
    this.inFlight.delete(key);
    this.from.delete(key);
  }

  /** The inscription a name came from, if one is known. */
  manifestFor(address: string): number | null {
    return this.from.get(address) ?? null;
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
