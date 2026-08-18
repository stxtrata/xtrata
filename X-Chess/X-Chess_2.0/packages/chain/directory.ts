// Finding manifests, when nothing indexes them.
//
// A board that makes you TYPE an inscription number can only ever show you what
// you already knew about. That is fine for whoever inscribed it and useless to
// everybody else — and this board is itself an inscription, so "we will add it
// later" is not one of the options.
//
// THE INDEX ONLY POINTS ONE WAY. Xtrata exposes `get-dependencies` and
// `get-parents` and nothing that asks what depends ON a token. So a chain of
// manifests, each naming the one before it, can be walked BACKWARD from one you
// already have and never forward to one inscribed after this board was.
// Whatever finds "the newest" cannot be the chain itself.
//
// WHAT POINTS FORWARD IS AN ADDRESS. A wallet's contents can grow after the
// board is permanent, which is the property nothing else here has. So a GROUP of
// manifests is defined by the wallet they are sent to, and the board needs to
// know one address per group and nothing more:
//
//   tournaments   the director's wallet
//   profiles      a wallet players send their own manifests to
//
// Two addresses, two directories, one mechanism — which is why this is generic
// over what a manifest IS. A third kind is a configuration, not a new class.
//
// HOLDING FINDS IT; CREATING PROVES IT, the same split `players.ts` draws.
// Anybody may send an NFT to any address unasked, so a document arriving in a
// wallet is a claim rather than a fact. This reports which is which and refuses
// to decide legitimacy, because that question is answered better elsewhere:
// `checkGames` verifies every pairing against the rules hash its game committed
// to, so a fabricated tournament reads `unverified` however it arrived.

import type { Endpoint } from './endpoint.js';
import type { XtrataReader } from './xtrata.js';

/** How many of an address's inscriptions to consider. Newest first. */
export const MAX_CANDIDATES = 25;

const PREFIX = 'xchess:directory:';

/** Storage, if there is any. Same degrade-to-nothing shape as everywhere else. */
function store(): Storage | null {
  try {
    const local = (globalThis as { localStorage?: Storage }).localStorage;
    if (!local) return null;
    const probe = `${PREFIX}probe`;
    local.setItem(probe, '1');
    local.removeItem(probe);
    return local;
  } catch {
    return null;
  }
}

export interface Found<T> {
  id: number;
  manifest: T;
  /** True when this address MINTED it, rather than merely holding it. */
  official: boolean;
}

export interface DirectoryOptions<T> {
  endpoint: Endpoint;
  reader: XtrataReader;
  /** The wallet that defines this group. */
  address: string;
  /**
   * What this directory collects, e.g. `tournament` or `player`.
   *
   * Part of the cache key, and not decoration. The cache remembers that an
   * inscription is NOT one of these, and an inscription that is not a
   * tournament may perfectly well be a profile — so one shared marker would
   * teach each directory to skip the other's manifests.
   */
  kind: string;
  /** Returns the manifest, or null when this text is not one. */
  parse: (text: string) => T | null;
  asset?: string;
  maxCandidates?: number;
}

export class ManifestDirectory<T> {
  private readonly endpoint: Endpoint;
  private readonly reader: XtrataReader;
  private readonly address: string;
  private readonly kind: string;
  private readonly parse: (text: string) => T | null;
  private readonly asset: string;
  private readonly maxCandidates: number;

  /**
   * How many inscriptions the wallet holds, and how many were looked at.
   *
   * NEVER TRUNCATE SILENTLY. This reads the newest `maxCandidates` inscriptions,
   * which is a bound on READS and not a statement about how many tournaments
   * exist. A wallet holding thirty inscriptions shows what it found in the
   * newest twenty-five, and a list that quietly stops is indistinguishable from
   * a complete one — the reader would conclude the older tournaments were never
   * inscribed.
   */
  lastScan: { scanned: number; held: number } = { scanned: 0, held: 0 };

  constructor(options: DirectoryOptions<T>) {
    this.endpoint = options.endpoint;
    this.reader = options.reader;
    this.address = String(options.address ?? '').trim().toUpperCase();
    this.kind = options.kind;
    this.parse = options.parse;
    this.asset =
      options.asset ?? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription';
    this.maxCandidates = options.maxCandidates ?? MAX_CANDIDATES;
  }

  /**
   * Every manifest of this kind in that wallet, newest first.
   *
   * One holdings call, then a read per candidate — and the reads are the part
   * that gets cheap, because AN INSCRIPTION IS IMMUTABLE. A document that
   * parsed as a tournament once will parse as the same tournament forever, so
   * it is remembered and never fetched again. Only the holdings list has to be
   * re-read, which is the one thing that can change.
   *
   * Failure THROWS rather than returning an empty list. "Could not ask" and
   * "there are none" must not look the same to a caller, or a rate limit turns
   * into an empty tab that looks authoritative.
   */
  async list(): Promise<Found<T>[]> {
    const ids = await this.candidates();
    const found: Found<T>[] = [];

    for (const id of ids) {
      const remembered = this.recall(id);
      if (remembered === 'not-this-kind') continue;

      const text = remembered ?? (await this.reader.text(id));
      if (text === null) continue;

      const manifest = this.parse(text);
      if (manifest === null) {
        // Remembered as well. Most of a wallet's contents are not the thing
        // being looked for — character sheets, an engine, an identity — and
        // without this every one is re-read on every visit forever.
        this.remember(id, null);
        continue;
      }
      if (remembered === null) this.remember(id, text);

      found.push({ id, manifest, official: await this.mintedHere(id) });
    }
    return found.sort((a, b) => b.id - a.id);
  }

  /**
   * Inscriptions worth reading, newest first.
   *
   * Holdings rather than mint history, because holdings is the one that still
   * works when a manifest is inscribed straight to a wallet by somebody else —
   * which is the direction this is going. `official` recovers the stricter
   * question for anybody who needs it.
   */
  private async candidates(): Promise<number[]> {
    const path =
      `/extended/v1/tokens/nft/holdings?principal=${encodeURIComponent(this.address)}` +
      `&asset_identifiers=${encodeURIComponent(this.asset)}&limit=${this.maxCandidates}`;
    const response = await this.endpoint.request(path);
    if (!response.ok) throw new Error(`${this.kind} holdings: HTTP ${response.status}`);

    const body = (await response.json()) as {
      results?: Array<{ value?: { hex?: string } }>;
      total?: number;
    };
    const ids: number[] = [];
    for (const row of body.results ?? []) {
      const hex = String(row.value?.hex ?? '').replace(/^0x01/, '');
      const id = Number.parseInt(hex, 16);
      if (Number.isSafeInteger(id) && id > 0) ids.push(id);
    }
    const unique = [...new Set(ids)].sort((a, b) => b - a);
    const taken = unique.slice(0, this.maxCandidates);
    // `total` is what the wallet holds; `taken` is what this will read.
    this.lastScan = { scanned: taken.length, held: Number(body.total ?? taken.length) };
    return taken;
  }

  /**
   * Was this MINTED here, or is it only sitting in the wallet?
   *
   * The distinction anybody can exploit otherwise: sending an NFT costs a fee
   * and needs no permission, so a wallet's contents are partly chosen by
   * strangers. Minting cannot be faked after the fact.
   */
  private async mintedHere(id: number): Promise<boolean> {
    try {
      const creator = await this.reader.creator(id);
      return creator !== null && creator.trim().toUpperCase() === this.address;
    } catch {
      // Unknown is not "official". A board that cannot check must not claim.
      return false;
    }
  }

  /** Remembered text, `'not-this-kind'`, or null for "never asked". */
  private recall(id: number): string | 'not-this-kind' | null {
    const local = store();
    if (!local) return null;
    try {
      const raw = local.getItem(this.key(id));
      if (raw === null) return null;
      return raw === '' ? 'not-this-kind' : raw;
    } catch {
      return null;
    }
  }

  private remember(id: number, text: string | null): void {
    const local = store();
    if (!local) return;
    try {
      local.setItem(this.key(id), text ?? '');
    } catch {
      // A full quota. It is a cache; the next visit simply reads again.
    }
  }

  private key(id: number): string {
    return `${PREFIX}${this.kind}:${id}`;
  }
}
