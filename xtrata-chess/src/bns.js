// Turning principals into names.
//
// On an open board the interesting question about a move is who played it, and
// a 41 character principal answers that badly. Where an address owns a BNS
// name, show the name instead.
//
// Resolution is best effort and never blocks the board. The position comes from
// replay and is drawn immediately; names arrive afterwards and the log
// re-renders. A lookup that fails is cached as "no name" so a board with a
// hundred anonymous senders does not re-ask on every poll.

import { deserialize, serializePrincipal } from './clarity.js';

const PRINCIPAL_RE = /^S[0-9A-HJKMNP-TV-Z]{25,50}$/;

// The BNS-V2 registry, which is the only thing that knows which of a wallet's
// names is its primary.
const BNS_V2 = {
  mainnet: 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2',
  testnet: 'ST2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D9SZJQ0M.BNS-V2'
};

// Labels are ASCII. Anything outside that range means the response was misread,
// and a wrong name is worse than no name.
function decodeLabel(bytes) {
  if (!bytes || !bytes.length) return null;
  let out = '';
  for (const byte of bytes) {
    if (byte < 0x20 || byte > 0x7e) return null;
    out += String.fromCharCode(byte);
  }
  return out;
}

// Only real Stacks principals are worth asking about. Simulation senders like
// "GRIEFER" and "SIM-WHITE" are already the clearest label they will ever have.
export function looksLikePrincipal(value) {
  return typeof value === 'string' && PRINCIPAL_RE.test(value);
}

// Names that came with the page rather than from a lookup.
//
// A sealed game cannot reach the network, so whatever it knows about its
// senders has to be carried inside it. Without this a sealed artifact would
// lose its attribution the moment it was sealed, which is the opposite of the
// point: the record should get more durable when it is inscribed, not less.
export class StaticNames {
  constructor(source = {}) {
    this.names = source instanceof Map ? new Map(source) : new Map(Object.entries(source));
  }

  get(address) {
    return this.names.get(address);
  }

  known(address) {
    return this.names.has(address);
  }
}

export class NameResolver {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl;
    this.network = options.network || (String(options.apiUrl || '').includes('testnet') ? 'testnet' : 'mainnet');
    this.fetch = options.fetch || globalThis.fetch?.bind(globalThis);
    this.concurrency = options.concurrency ?? 4;
    // principal -> name string, or null for "asked, no name"
    this.cache = new Map();
    this.inFlight = new Map();
  }

  // Synchronous lookup for rendering. Undefined means not asked yet.
  get(principal) {
    return this.cache.get(principal);
  }

  known(principal) {
    return this.cache.has(principal);
  }

  /**
   * The wallet's primary name, read from the BNS-V2 contract.
   *
   * The name *list* endpoint does not say which name is primary. Taking the
   * first entry, which is what this used to do, picks the wrong name for any
   * wallet whose primary is not first in the list. The registry answers the
   * actual question:
   *
   *   get-primary(owner) -> (ok (some {name: (buff 20), namespace: (buff 20)}))
   */
  async _lookupPrimary(principal) {
    const contract = BNS_V2[this.network];
    if (!contract) return null;

    const [address, name] = contract.split('.');
    const response = await this.fetch(
      `${this.apiUrl}/v2/contracts/call-read/${address}/${name}/get-primary`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: principal,
          arguments: [serializePrincipal(principal)]
        })
      }
    );
    if (!response.ok) return null;

    const body = await response.json();
    if (!body?.okay || typeof body.result !== 'string') return null;

    // (ok (some {name, namespace})) unwraps to a plain record. An error, an
    // (ok none), or anything unexpected all mean "no primary name".
    const decoded = deserialize(body.result);
    const record = decoded && decoded.ok === true ? decoded.value : null;
    if (!record || typeof record !== 'object') return null;

    const label = decodeLabel(record.name);
    const namespace = decodeLabel(record.namespace);
    if (!label || !namespace) return null;

    return `${label}.${namespace}`.toLowerCase();
  }

  // The old list endpoint, kept only as a fallback for a wallet that holds names
  // but has set no primary. It cannot say which is preferred, so it is used only
  // when the registry has already said there is no answer.
  async _lookupAny(principal) {
    const response = await this.fetch(
      `${this.apiUrl}/v1/addresses/stacks/${encodeURIComponent(principal)}`
    );
    if (!response.ok) return null;
    const body = await response.json();
    const names = Array.isArray(body?.names) ? body.names : [];
    return names.length ? String(names[0]).toLowerCase() : null;
  }

  async _lookup(principal) {
    try {
      const primary = await this._lookupPrimary(principal);
      if (primary) return primary;
    } catch {
      // Fall through: a registry that is unreachable should not mean no name.
    }
    try {
      return await this._lookupAny(principal);
    } catch {
      return null;
    }
  }

  /**
   * Resolve any principals not already known.
   * @returns {Promise<boolean>} whether anything new was learned
   */
  async resolve(principals) {
    const pending = [...new Set(principals)].filter(
      (value) => looksLikePrincipal(value) && !this.cache.has(value) && !this.inFlight.has(value)
    );
    if (!pending.length) return false;

    let learned = false;

    // A small pool rather than all at once: an open board can have dozens of
    // distinct senders and the API is somebody else's to be gentle with.
    const queue = pending.slice();
    const workers = Array.from({ length: Math.min(this.concurrency, queue.length) }, async () => {
      for (;;) {
        const principal = queue.shift();
        if (!principal) return;

        const task = this._lookup(principal);
        this.inFlight.set(principal, task);
        try {
          const name = await task;
          this.cache.set(principal, name);
          if (name) learned = true;
        } finally {
          this.inFlight.delete(principal);
        }
      }
    });

    await Promise.all(workers);
    return learned;
  }
}
