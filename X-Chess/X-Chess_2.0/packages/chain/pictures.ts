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
import type { XtrataReader } from './xtrata.js';

/** How many holdings to consider before giving up. Same bound as a name. */
export const MAX_SCAN = 12;

export interface PlayerPicturesOptions {
  endpoint: Endpoint;
  reader: XtrataReader;
  asset?: string;
  maxScan?: number;
}

export interface Picture {
  /** The inscription to show. */
  image: number;
  /** The manifest that chose it, so a reader can check the claim. */
  manifest: number;
}

export class PlayerPictures {
  private readonly endpoint: Endpoint;
  private readonly reader: XtrataReader;
  private readonly asset: string;
  private readonly maxScan: number;
  private readonly cache = new Map<string, Picture | null>();
  private readonly inFlight = new Map<string, Promise<Picture | null>>();

  constructor(options: PlayerPicturesOptions) {
    this.endpoint = options.endpoint;
    this.reader = options.reader;
    this.asset =
      options.asset ??
      'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription';
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
    const path =
      `/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(address)}` +
      `&asset_identifiers=${encodeURIComponent(this.asset)}&limit=${this.maxScan}`;
    const response = await this.endpoint.request(path);
    // Thrown rather than returned, so a rate limit cannot be remembered as an
    // answer. See the same line in players.ts.
    if (!response.ok) throw new Error(`holdings lookup: HTTP ${response.status}`);

    const body = (await response.json()) as { results?: Array<{ value?: { hex?: string } }> };
    const ids: number[] = [];
    for (const row of body.results ?? []) {
      const hex = String(row.value?.hex ?? '').replace(/^0x01/, '');
      const id = Number.parseInt(hex, 16);
      if (Number.isSafeInteger(id) && id > 0) ids.push(id);
    }

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
    const path =
      `/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(key)}` +
      `&asset_identifiers=${encodeURIComponent(this.asset)}&limit=${this.maxScan}`;
    const response = await this.endpoint.request(path);
    if (!response.ok) throw new Error(`holdings lookup: HTTP ${response.status}`);

    const body = (await response.json()) as { results?: Array<{ value?: { hex?: string } }> };
    const out: Array<{ id: number; mime: string }> = [];
    for (const row of body.results ?? []) {
      const hex = String(row.value?.hex ?? '').replace(/^0x01/, '');
      const id = Number.parseInt(hex, 16);
      if (!Number.isSafeInteger(id) || id < 1) continue;
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
