// Turning principals into names.
//
// The interesting question about a move is who played it, and a 41 character
// principal answers that badly. Where an address owns a BNS name, show it.
//
// THE TRAP, and it is a bad one: `/v1/names/<name>` answers from the legacy
// BNS v1 index and can be years out of date. Asked for a name that has moved to
// BNS-V2 it returns an address that has not held it since. That answer would go
// straight into a rules commitment and lock the real holder out of their own
// game, permanently, with the board enforcing it. Use the REGISTRY.
//
// Resolution is best effort and never blocks the board. The position comes from
// replay and is drawn immediately; names arrive afterwards and the log
// re-renders. A failed lookup is cached as "no name" so a board with a hundred
// anonymous senders does not re-ask on every poll.

import { deserialize, serializeBuffer, serializePrincipal } from './clarity.js';
import type { ClarityJs } from './clarity.js';
import type { Endpoint } from './endpoint.js';
import type { Network } from './endpoint.js';
import { pool } from './pool.js';

/** The registry, which is the only thing that knows which name is primary. */
export const BNS_V2: Partial<Record<Network, string>> = {
  mainnet: 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2',
  testnet: 'ST2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D9SZJQ0M.BNS-V2'
};

const PRINCIPAL_RE = /^S[0-9A-HJKMNP-TV-Z]{25,50}$/;

export function looksLikePrincipal(value: unknown): boolean {
  return typeof value === 'string' && PRINCIPAL_RE.test(value);
}

/**
 * Labels are ASCII. Anything outside that range means the response was misread,
 * and a wrong name is worse than no name.
 */
function decodeLabel(bytes: unknown): string | null {
  if (!(bytes instanceof Uint8Array) || !bytes.length) return null;
  let out = '';
  for (const byte of bytes) {
    if (byte < 0x20 || byte > 0x7e) return null;
    out += String.fromCharCode(byte);
  }
  return out;
}

export interface NamesOptions {
  endpoint: Endpoint;
  network?: Network;
  /** Names carried by the page rather than looked up. A sealed game has these. */
  known?: Record<string, string>;
}

export class Names {
  private readonly endpoint: Endpoint;
  private readonly network: Network;
  /** null means "asked, and there is no name". Distinct from "not asked". */
  private readonly cache = new Map<string, string | null>();
  private readonly inFlight = new Map<string, Promise<string | null>>();

  constructor(options: NamesOptions) {
    this.endpoint = options.endpoint;
    this.network = options.network ?? 'mainnet';
    for (const [address, name] of Object.entries(options.known ?? {})) {
      this.cache.set(address.toUpperCase(), name);
    }
  }

  /** Whatever is already known, without asking. Safe to call while rendering. */
  peek(principal: string): string | null {
    return this.cache.get(String(principal ?? '').toUpperCase()) ?? null;
  }

  /** How this address should be labelled right now. Never blocks. */
  label(principal: string): string {
    return this.peek(principal) ?? principal;
  }

  /**
   * The wallet's primary name, from the BNS-V2 registry.
   *
   *   get-primary(owner) -> (ok (some {name: (buff 20), namespace: (buff 20)}))
   *
   * The name LIST endpoint cannot say which of a wallet's names is primary.
   * Taking the first entry picks the wrong name for anybody whose primary is
   * not first.
   */
  async resolve(principal: string): Promise<string | null> {
    const key = String(principal ?? '').toUpperCase();
    if (!looksLikePrincipal(key)) return null;
    if (this.cache.has(key)) return this.cache.get(key) ?? null;

    // One request per address, however many callers ask at once.
    const existing = this.inFlight.get(key);
    if (existing) return existing;

    const work = this.lookup(key)
      .then((name) => {
        // A real answer, including "this address has no name". Worth keeping.
        this.cache.set(key, name);
        this.inFlight.delete(key);
        return name;
      })
      .catch((error: unknown) => {
        // A REFUSAL IS NOT AN ANSWER, and caching one made a passing rate limit
        // permanent for the session: one busy moment and every name stayed
        // blank until the page was reloaded, which reads to a player as the
        // board being broken rather than the host being busy.
        //
        // The rule is stated twelve lines below, in resolveName, which has
        // always got this right. This method did not.
        const code = (error as { code?: string })?.code;
        if (code !== 'RATE_LIMITED' && code !== 'CHAIN_UNAVAILABLE') {
          this.cache.set(key, null);
        }
        this.inFlight.delete(key);
        return null;
      });

    this.inFlight.set(key, work);
    return work;
  }

  /** Resolve several, and report whether anything new was learned. */
  async resolveAll(principals: readonly string[]): Promise<boolean> {
    const wanted = [...new Set(principals.map((p) => String(p ?? '').toUpperCase()))]
      .filter((p) => looksLikePrincipal(p) && !this.cache.has(p));
    if (!wanted.length) return false;
    // A few at a time. A bare Promise.all here fired one request per distinct
    // sender at once, from one IP, into an allowance the wallet also spends.
    await pool(3, wanted.map((p) => () => this.resolve(p)));
    return true;
  }

  /**
   * The other direction: a name to the principal that owns it.
   *
   * Needed because a game names its players in the rule set that gets HASHED,
   * and a hash of "jim.btc" would be a hash of something that can change hands.
   * The commitment has to be to the address, so a name typed into the form is
   * resolved BEFORE it is hashed, and what the game commits to is whoever owned
   * the name at that moment. Stated plainly in the form, because a name is not
   * an identity here - it is a lookup that happened once.
   *
   * Returns null for a name that does not resolve, which the form must treat as
   * "not ready" rather than as "anyone": committing a game to the wrong side is
   * not something a typo should be able to do.
   */
  /**
   * Did the last lookup fail because nobody answered, rather than because the
   * name is not registered?
   *
   * `owner` returns null for both, which is right for a caller that only wants
   * an address and wrong for one that wants to explain itself. Without this the
   * board told people to check the spelling of a name that resolves perfectly
   * well, because the public endpoint had briefly refused.
   */
  private lastFailed = false;

  async reachable(): Promise<boolean> {
    return !this.lastFailed;
  }

  async owner(name: string): Promise<string | null> {
    const raw = String(name ?? '').trim().toLowerCase().replace(/^@/, '');
    const match = /^([a-z0-9][a-z0-9-]*)\.([a-z0-9][a-z0-9-]*)$/.exec(raw);
    if (!match) return null;

    const key = `name:${raw}`;
    if (this.cache.has(key)) return this.cache.get(key) ?? null;
    const existing = this.inFlight.get(key);
    if (existing) return existing;

    const work = this.lookupOwner(match[1], match[2])
      .then((principal) => {
        this.lastFailed = false;
        this.cache.set(key, principal);
        this.inFlight.delete(key);
        return principal;
      })
      .catch(() => {
        // Deliberately NOT cached. A refusal is not an answer, and remembering
        // one would make a passing rate limit permanent for the session.
        this.lastFailed = true;
        this.inFlight.delete(key);
        return null;
      });
    this.inFlight.set(key, work);
    return work;
  }

  private async lookupOwner(label: string, namespace: string): Promise<string | null> {
    const contract = BNS_V2[this.network];
    if (!contract) return null;
    const [address, name] = contract.split('.');
    const ascii = (text: string): string =>
      serializeBuffer(
        [...new TextEncoder().encode(text)].map((b) => b.toString(16).padStart(2, '0')).join('')
      );

    const response = await this.endpoint.request(
      `/v2/contracts/call-read/${address}/${name}/get-owner-name`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: address,
          arguments: [ascii(label), ascii(namespace)]
        })
      }
    );
    if (!response.ok) throw new Error(`BNS lookup answered ${response.status}`);

    const body = (await response.json()) as { okay?: boolean; result?: string };
    if (!body?.okay || typeof body.result !== 'string') return null;

    const decoded = deserialize(body.result) as ClarityJs;
    const inner =
      decoded && typeof decoded === 'object' && 'ok' in decoded && decoded.ok === true
        ? decoded.value
        : null;
    return typeof inner === 'string' && looksLikePrincipal(inner) ? inner.toUpperCase() : null;
  }

  private async lookup(principal: string): Promise<string | null> {
    const contract = BNS_V2[this.network];
    if (!contract) return null;
    const [address, name] = contract.split('.');

    const response = await this.endpoint.request(
      `/v2/contracts/call-read/${address}/${name}/get-primary`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: principal, arguments: [serializePrincipal(principal)] })
      }
    );
    if (!response.ok) throw new Error(`BNS lookup answered ${response.status}`);

    const body = (await response.json()) as { okay?: boolean; result?: string };
    if (!body?.okay || typeof body.result !== 'string') return null;

    // (ok (some {name, namespace})). An error, an (ok none), or anything
    // unexpected all mean "no primary name".
    const decoded = deserialize(body.result) as ClarityJs;
    const record =
      decoded && typeof decoded === 'object' && 'ok' in decoded && decoded.ok === true
        ? (decoded.value as Record<string, ClarityJs>)
        : null;
    if (!record || typeof record !== 'object') return null;

    const label = decodeLabel(record.name);
    const namespace = decodeLabel(record.namespace);
    if (!label || !namespace) return null;
    return `${label}.${namespace}`.toLowerCase();
  }
}
