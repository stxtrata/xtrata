// Reading an inscription, for a board that wants to know what a tournament is.
//
// `resolveTournament` in packages/protocol/tournament.ts takes an `Inscribed`
// reader by injection so it can be tested without a network. This is the
// implementation that actually reaches Xtrata, and it is the only place in the
// application that knows the inscription contract exists.
//
// TWO SOURCES, AND THAT IS NOT A DESIGN CHOICE. Content, dependencies and
// creator come from `xtrata-v3-2-3`. WHEN AN INSCRIPTION HAPPENED DOES NOT.
// `get-inscription-meta` and `get-inscription-summary` return creator, hash,
// mime-type, owner, sealed, chunk count, size, dependencies, parents and
// migration-source — and no height, on either. So `mintedAt` goes to the Stacks
// API instead, by way of the SIP-009 mint event, and that is three hops rather
// than one because nothing shorter exists.
//
// The height matters: `provenance()` compares it against when the tournament's
// first game was opened, and that comparison is the whole difference between a
// manifest that committed to its games and one that described them afterwards.

import { deserialize, serializeUint } from './clarity.js';
import type { ClarityJs } from './clarity.js';
import { makeEndpoint } from './endpoint.js';
import type { Endpoint, EndpointOptions, Network } from './endpoint.js';

/**
 * The live inscription core. v2-1-0 is a migration target and never a read
 * target — a recursive read against it resolves the wrong owner for a token
 * that has since moved to v3.
 *
 * Partial on purpose: devnet has no Xtrata deployment. A devnet board falls
 * through to the mainnet contract id against a devnet endpoint, so the reads
 * simply fail and `text()` returns null, which is the honest answer to "what
 * does inscription 2993 say" on a chain where it does not exist.
 */
export const XTRATA: Partial<Record<Network, { address: string; name: string }>> = {
  mainnet: { address: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', name: 'xtrata-v3-2-3' },
  testnet: { address: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', name: 'xtrata-v3-2-3' }
};

/** The SIP-009 asset, needed to find a mint event. */
const ASSET_NAME = 'xtrata-inscription';

/**
 * How many chunks this will pull for one inscription.
 *
 * A manifest is a document, not a payload: 2993 is one chunk, and the entry
 * format caps an entry at 1,200 characters. Something claiming thirty-two
 * chunks is not a manifest, and reading half a megabyte to discover that is a
 * bad way to find out. A caller that needs a large inscription can raise it.
 */
export const MAX_CHUNKS = 4;

const READ_SENDER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

export interface XtrataOptions extends EndpointOptions {
  endpoint?: Endpoint;
  network?: Network;
  /** How many chunks to read before giving up. See MAX_CHUNKS. */
  maxChunks?: number;
}

/**
 * An inscription reader.
 *
 * Satisfies `Inscribed` from packages/protocol/tournament.ts, plus `mintedAt`,
 * which that interface does not ask for because the protocol layer takes heights
 * as arguments rather than fetching them.
 */
export class XtrataReader {
  private readonly endpoint: Endpoint;
  private readonly contract: { address: string; name: string };
  private readonly maxChunks: number;

  // An inscription is immutable and sealed, so anything read from one is true
  // forever. Caching it is not an optimisation with a staleness risk attached,
  // which is unusual enough here to be worth saying.
  private readonly texts = new Map<number, string | null>();
  private readonly heights = new Map<number, number | null>();

  constructor(options: XtrataOptions = {}) {
    const network: Network = options.network ?? 'mainnet';
    this.endpoint = options.endpoint ?? makeEndpoint(options);
    this.contract = XTRATA[network] ?? XTRATA.mainnet!;
    this.maxChunks = options.maxChunks ?? MAX_CHUNKS;
  }

  private async read(fn: string, args: string[] = []): Promise<ClarityJs | null> {
    const path = `/v2/contracts/call-read/${this.contract.address}/${this.contract.name}/${fn}`;
    const response = await this.endpoint.request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: READ_SENDER, arguments: args })
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { okay?: boolean; result?: string };
    if (!body.okay || typeof body.result !== 'string') return null;
    return deserialize(body.result);
  }

  /**
   * The whole inscription, as text.
   *
   * Chunks are fetched one at a time rather than through `get-chunk-batch`.
   * That is slower and it is what the endpoint's rate limiting is shaped for:
   * a batch is one request that either works or 429s as a unit, and for a
   * document of one to four chunks the saving is a round trip nobody notices.
   */
  async text(id: number): Promise<string | null> {
    const cached = this.texts.get(id);
    if (cached !== undefined) return cached;

    const count = unwrap(await this.read('get-inscription-chunks', [serializeUint(id)]));
    const total = typeof count === 'bigint' ? Number(count) : null;
    if (total === null || total < 1) return this.remember(id, null);

    // Refused rather than truncated. Half a manifest parses as a broken manifest
    // and would be reported as the entrant's fault rather than ours.
    if (total > this.maxChunks) return this.remember(id, null);

    const parts: Uint8Array[] = [];
    for (let index = 0; index < total; index++) {
      const chunk = unwrap(await this.read('get-chunk', [serializeUint(id), serializeUint(index)]));
      if (!(chunk instanceof Uint8Array)) return this.remember(id, null);
      parts.push(chunk);
    }

    let size = 0;
    for (const part of parts) size += part.length;
    const joined = new Uint8Array(size);
    let at = 0;
    for (const part of parts) {
      joined.set(part, at);
      at += part.length;
    }
    return this.remember(id, new TextDecoder().decode(joined));
  }

  private remember(id: number, text: string | null): string | null {
    this.texts.set(id, text);
    return text;
  }

  /** Inscription ids this one declares. Empty when it declares none, never null. */
  async dependencies(id: number): Promise<number[]> {
    const value = unwrap(await this.read('get-dependencies', [serializeUint(id)]));
    if (!Array.isArray(value)) return [];
    return value.filter((v): v is bigint => typeof v === 'bigint').map(Number);
  }

  /** Who made it. Same creator across a revision chain is the ownership proof. */
  async creator(id: number): Promise<string | null> {
    const value = unwrap(await this.read('get-inscription-creator', [serializeUint(id)]));
    return typeof value === 'string' ? value : null;
  }

  /**
   * The block an inscription was minted in, or null.
   *
   * THE ONE THING XTRATA DOES NOT KEEP, so this is the Stacks API and not the
   * contract. Three hops, and each is needed:
   *
   *   1. the NFT mint event for this token id
   *   2. that event's tx_id — `block_height` is NOT populated on the event
   *   3. the transaction, which does carry the height
   *
   * Null means "could not tell", never "recent". `provenance()` treats null as
   * unchecked and says so rather than guessing, because guessing here would
   * present a retrospective claim as a commitment.
   */
  async mintedAt(id: number): Promise<number | null> {
    const cached = this.heights.get(id);
    if (cached !== undefined) return cached;

    const asset = `${this.contract.address}.${this.contract.name}::${ASSET_NAME}`;
    // `serializeUint` already carries the 0x. Prepending another sent
    // `value=0x0x0100…`, which the API answered with an empty result set — so
    // this read as "no mint event" rather than as a malformed request, and
    // reported null for an inscription whose height is 8,787,817.
    const value = serializeUint(id);
    const history = await this.endpoint.request(
      `/extended/v1/tokens/nft/history?asset_identifier=${encodeURIComponent(asset)}` +
        `&value=${value}&limit=1`
    );
    if (!history.ok) return this.rememberHeight(id, null);

    const events = (await history.json()) as { results?: Array<{ tx_id?: string }> };
    const txid = events.results?.[0]?.tx_id;
    if (typeof txid !== 'string') return this.rememberHeight(id, null);

    const tx = await this.endpoint.request(`/extended/v1/tx/${txid}`);
    if (!tx.ok) return this.rememberHeight(id, null);

    const row = (await tx.json()) as { block_height?: number; tx_status?: string };
    // A transaction that did not succeed did not inscribe anything, whatever
    // height it landed at.
    if (row.tx_status !== 'success' || typeof row.block_height !== 'number') {
      return this.rememberHeight(id, null);
    }
    return this.rememberHeight(id, row.block_height);
  }

  private rememberHeight(id: number, height: number | null): number | null {
    this.heights.set(id, height);
    return height;
  }
}

/**
 * Unwrap a Clarity response or optional, if it is one.
 *
 * These reads come back variously as `(ok (some x))`, `(some x)` or `x`
 * depending on the function, and a caller that had to know which would be
 * coupled to the contract's signature rather than to its meaning.
 */
function unwrap(value: ClarityJs | null): ClarityJs | null {
  let at: ClarityJs | null = value;
  for (let step = 0; step < 4 && at !== null; step++) {
    if (typeof at === 'object' && !Array.isArray(at) && !(at instanceof Uint8Array)) {
      const record = at as { okay?: boolean; value?: ClarityJs; type?: string };
      if ('okay' in record && record.okay === false) return null;
      if ('value' in record) {
        at = record.value ?? null;
        continue;
      }
    }
    return at;
  }
  return at;
}
