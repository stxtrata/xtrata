/**
 * Primary BNS names (e.g. jim.btc) for display, looked up once per address per page view.
 *
 * `get` answers at once with what is known (a name, or null) and starts the lookup the first time an address
 * is asked about; `onChange` fires when a name arrives so the caller can draw again. A lookup that FAILED is
 * not the same as an address with no name: failures are tried again after `retryAfterMs` rather than being
 * remembered as "no name" for the rest of the page view.
 */
export interface NameCache {
  get(address?: string): string | null;
}

interface Entry { name: string | null; pending: boolean; failedAt?: number }

export function createNameCache(
  resolve: (address: string) => Promise<string | null>,
  onChange: () => void,
  options: { retryAfterMs?: number; now?: () => number } = {}
): NameCache {
  const retryAfterMs = options.retryAfterMs ?? 30_000;
  const now = options.now ?? Date.now;
  const entries = new Map<string, Entry>();

  const lookup = (address: string, entry: Entry) => {
    entry.pending = true;
    entry.failedAt = undefined;
    Promise.resolve()
      .then(() => resolve(address))
      .then((name) => {
        entry.pending = false;
        if (name) { entry.name = name; onChange(); }
      })
      .catch(() => {
        entry.pending = false;
        entry.failedAt = now();
      });
  };

  return {
    get(address) {
      if (!address) return null;
      let entry = entries.get(address);
      if (!entry) {
        entry = { name: null, pending: false };
        entries.set(address, entry);
        lookup(address, entry);
      } else if (!entry.pending && entry.name === null && entry.failedAt !== undefined && now() - entry.failedAt >= retryAfterMs) {
        lookup(address, entry);
      }
      return entry.name;
    }
  };
}
