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

const PRINCIPAL_RE = /^S[0-9A-HJKMNP-TV-Z]{25,50}$/;

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

  async _lookup(principal) {
    try {
      const response = await this.fetch(
        `${this.apiUrl}/v1/addresses/stacks/${encodeURIComponent(principal)}`
      );
      if (!response.ok) return null;
      const body = await response.json();
      const names = Array.isArray(body?.names) ? body.names : [];
      return names.length ? String(names[0]) : null;
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
