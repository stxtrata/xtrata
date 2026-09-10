// The picture an address chose for itself.
//
// Same shape as `PlayerNames` and for the same reasons, which are written out
// there: holdings are the only index that points this way, a failed lookup is
// never cached as an absence, and lookups are shared so one address is asked for
// once however many rows mention it.
//
// A NOTE ON WHAT THIS DOES NOT DO, because the obvious optimisation is already
// there and adding it again would cost. The plan for this feature said the scan
// should ask `get-inscription-meta` what each candidate IS before reading it, to
// avoid fetching a 443 KB image as text. `XtrataReader.text` already reads the
// chunk COUNT first and refuses anything over `MAX_CHUNKS = 4` — so a
// twenty-eight chunk image costs one call and is declined, and a meta call in
// front of that would add a round trip to replace a guard that already exists.
// `meta` is used below for judging the PICTURE, which nothing else can do.
//
// TWO CHECKS, AND THEY ARE NOT THE SAME CHECK. The manifest must be attested by
// its CREATOR, because a document somebody else inscribed about you is a
// stranger's assertion. The picture it points at must be HELD, because a picture
// you bought is the normal case and requiring you to have made it would rule out
// every piece of art anybody ever collected.

import { attestedPfp, parsePfp, pictureProblem, PFP_HEADER } from '../protocol/pfp.js';
import type { Endpoint } from './endpoint.js';
import { Holdings } from './holdings.js';
import type { XtrataReader } from './xtrata.js';

/** How many holdings to consider before giving up. Same bound as a name. */
export const MAX_SCAN = 12;

export interface PlayerPicturesOptions {
  endpoint: Endpoint;
  reader: XtrataReader;
  asset?: string;
  maxScan?: number;
  /** Shared with the name resolver, so one address is listed once. */
  holdings?: Holdings;
}

export interface Picture {
  /** The inscription to show. */
  image: number;
  /** The manifest that chose it, so a reader can check the claim. */
  manifest: number;
}

export class PlayerPictures {
  // The listing lives in `Holdings` now, so the endpoint and the asset id are
  // its business. Both are still ACCEPTED by the constructor and passed
  // through, so no caller changes.
  private readonly reader: XtrataReader;
  private readonly maxScan: number;
  private readonly index: Holdings;
  private readonly cache = new Map<string, Picture | null>();
  private readonly inFlight = new Map<string, Promise<Picture | null>>();

  constructor(options: PlayerPicturesOptions) {
    this.index =
      options.holdings ??
      new Holdings({ endpoint: options.endpoint, asset: options.asset, limit: options.maxScan });
    this.reader = options.reader;
    this.maxScan = options.maxScan ?? MAX_SCAN;
  }

  /** What is already known, with no network at all. */
  known(address: string): Picture | null | undefined {
    return this.cache.get(String(address ?? '').trim().toUpperCase());
  }

  async resolve(address: string): Promise<Picture | null> {
    const key = String(address ?? '').trim().toUpperCase();
    if (!key) return null;
    const cached = this.cache.get(key);
    if (cached !== undefined) return cached;

    const running = this.inFlight.get(key);
    if (running) return running;

    const work = this.look(key)
      .then((found) => {
        this.cache.set(key, found);
        this.inFlight.delete(key);
        return found;
      })
      .catch(() => {
        // NOT CACHED. "Could not reach the API" must never become "this address
        // has no picture" for the rest of the session.
        this.inFlight.delete(key);
        return null;
      });
    this.inFlight.set(key, work);
    return work;
  }

  private async look(address: string): Promise<Picture | null> {
    // Listed by `Holdings`, shared with the name resolver so one address is
    // asked about once however many things want to know about it. It throws
    // rather than returning an empty list on a failed read, which is what the
    // cache above depends on.
    const ids = await this.index.list(address);

    // Newest first, so the first manifest that attests is the current one — the
    // same "latest wins" rule names and tournament revisions already use.
    for (const id of ids.slice(0, this.maxScan)) {
      const text = await this.reader.text(id);
      if (text === null || !text.startsWith(PFP_HEADER)) continue;
      const parsed = parsePfp(text);
      if (!parsed.ok) continue;
      if (parsed.pfp!.address.trim().toUpperCase() !== address) continue;
      if (!attestedPfp(parsed.pfp, await this.reader.creator(id))) continue;

      // The manifest is genuine. Whether the picture is still SHOWABLE is a
      // separate and changing fact — an NFT transfers, so a wallet can choose a
      // picture on Monday and sell it on Tuesday, and the document goes on
      // saying what it said. Checked here rather than trusted, because a board
      // whose purpose is never to repeat an unchecked claim should not make an
      // exception for the one part of the screen somebody chose about themself.
      const image = parsed.pfp!.image;
      if (pictureProblem(await this.reader.meta(image), address)) return null;
      return { image, manifest: id };
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
    const key = String(address ?? '').trim().toUpperCase();
    this.cache.delete(key);
    this.inFlight.delete(key);
  }

  /**
   * The pictures this address could choose from.
   *
   * Judged by `pictureProblem`, so what comes back is exactly what the board
   * would agree to show — the picker cannot offer something the canvas would
   * then refuse. One meta read per holding and no content fetched at all, which
   * is what makes showing a grid affordable.
   */
  async holdings(address: string): Promise<Array<{ id: number; mime: string }>> {
    const key = String(address ?? '').trim().toUpperCase();
    if (!key) return [];

    // The same list the two resolvers walk. This made a THIRD request for one
    // wallet before it was shared — the picker, the name and the picture each
    // asking the API the same question within a second of each other.
    const ids = await this.index.list(key);
    const out: Array<{ id: number; mime: string }> = [];
    for (const id of ids) {
      const meta = await this.reader.meta(id);
      if (pictureProblem(meta, key)) continue;
      out.push({ id, mime: meta!.mime as string });
    }
    return out;
  }

  /** Resolve several, serially, for the same rate-limit reason as names. */
  async resolveAll(addresses: readonly string[]): Promise<boolean> {
    const wanted = [...new Set(addresses)]
      .map((a) => String(a ?? '').trim().toUpperCase())
      .filter((a) => a && this.cache.get(a) === undefined);
    if (!wanted.length) return false;
    for (const address of wanted) await this.resolve(address);
    return wanted.some((a) => this.cache.get(a));
  }
}
