import { vi } from 'vitest';

/**
 * Fault-injection harness for the browser agent.
 *
 * Every failure that shipped this week had the same shape: a call that fails, lags
 * or answers with a missing field, and code that treats the degraded answer as
 * fact. Source assertions cannot catch that — the code reads fine. This stands up
 * enough of a browser and a Stacks API to import agent-core.ts for real and run its
 * functions against a chain we can break on purpose.
 *
 * Usage:
 *   const chain = new FakeChain();
 *   const agent = await loadAgent(chain);
 *   chain.fail('/extended/v2/addresses/', 429);
 *   await expect(agent.balance(ADDR)).rejects.toThrow();
 */

export const DEPOSIT = 'SP350M055TC2KYXHC2DTD616XB3FNT0YZHS3XDXVQ';
export const PAYER = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
export const OTHER = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const CORE_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

type Fault = { status: number; body?: unknown };

export class FakeChain {
  /** µSTX per address. */
  balances = new Map<string, bigint>();
  /** token id → owning address, as the CONTRACT sees it (authoritative, current). */
  owners = new Map<string, string>();
  /** address → token ids, as the HOLDINGS INDEX sees it (may lag `owners`). */
  index = new Map<string, string[]>();
  /** inbound STX transfers per address: {sender, amount}. */
  inbound = new Map<string, Array<{ sender: string; amount: bigint }>>();

  // --- fee estimator + mempool ---
  /** Fees the estimator quotes, consumed in order; the last value repeats. */
  feeQuotes: bigint[] = [3000n];
  /** Node minimum: a broadcast at or below this is rejected as FeeTooLow. */
  minAcceptedFee = 0n;
  /** Fees actually broadcast, in order — lets a test assert what reached the node. */
  broadcasts: bigint[] = [];
  /** tx id → status returned by the tx endpoint. */
  txStatus = new Map<string, string>();
  private feeIdx = 0;
  private txSeq = 0;

  nextFee(): bigint {
    const q = this.feeQuotes[Math.min(this.feeIdx, this.feeQuotes.length - 1)] ?? 3000n;
    this.feeIdx += 1;
    return q;
  }

  /** URL fragment → forced failure. */
  private faults: Array<{ match: string; fault: Fault }> = [];
  /** Every path requested, in order — lets a test assert what was NOT called. */
  requests: string[] = [];

  fail(match: string, status: number, body?: unknown) {
    this.faults.push({ match, fault: { status, body } });
  }
  clearFaults() { this.faults = []; }

  private faultFor(url: string) {
    return this.faults.find((f) => url.includes(f.match))?.fault ?? null;
  }

  /** Give an address a funded deposit that every source agrees on. */
  fund(addr: string, ustx: bigint, from = PAYER) {
    this.balances.set(addr, ustx);
    this.inbound.set(addr, [...(this.inbound.get(addr) ?? []), { sender: from, amount: ustx }]);
  }

  /** Move a token on-chain. `alsoIndex: false` simulates the index lagging behind. */
  transfer(tokenId: string, to: string, alsoIndex = true) {
    const from = this.owners.get(tokenId);
    this.owners.set(tokenId, to);
    if (!alsoIndex) return;
    if (from) this.index.set(from, (this.index.get(from) ?? []).filter((id) => id !== tokenId));
    this.index.set(to, [...(this.index.get(to) ?? []), tokenId]);
  }

  handle(url: string): Response {
    this.requests.push(url);
    const fault = this.faultFor(url);
    if (fault) {
      return new Response(JSON.stringify(fault.body ?? { message: 'injected failure' }), {
        status: fault.status,
        headers: { 'content-type': 'application/json' }
      });
    }

    const json = (body: unknown, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

    // --- balances (v2) ---
    let m = /\/extended\/v2\/addresses\/([^/]+)\/balances\/stx/.exec(url);
    if (m) return json({ balance: String(this.balances.get(m[1]) ?? 0n) });

    // --- balances (v1, deprecated upstream — present so a test can prove we left it) ---
    m = /\/extended\/v1\/address\/([^/]+)\/stx$/.exec(url);
    if (m) return json({ balance: String(this.balances.get(m[1]) ?? 0n) });

    // --- inbound transfers ---
    m = /\/extended\/v1\/address\/([^/]+)\/stx_inbound/.exec(url);
    if (m) {
      const rows = (this.inbound.get(m[1]) ?? []).map((r) => ({ sender: r.sender, amount: String(r.amount) }));
      return json({ results: rows });
    }

    // --- transaction list ---
    m = /\/extended\/v1\/address\/([^/]+)\/transactions/.exec(url);
    if (m) {
      const addr = m[1];
      const rows = (this.inbound.get(addr) ?? []).map((r) => ({
        tx_type: 'token_transfer',
        sender_address: r.sender,
        token_transfer: { recipient_address: addr, amount: String(r.amount) }
      }));
      return json({ results: rows });
    }

    // --- NFT holdings index ---
    m = /\/extended\/v1\/tokens\/nft\/holdings\?principal=([^&]+)/.exec(url);
    if (m) {
      const ids = this.index.get(decodeURIComponent(m[1])) ?? [];
      return json({ total: ids.length, results: ids.map((id) => ({ value: { repr: `u${id}` } })) });
    }

    // --- read-only contract calls ---
    if (url.includes('/v2/contracts/call-read/')) {
      if (url.endsWith('/get-owner')) {
        // Answered from `owners` — the contract, not the index.
        const tokenId = this.lastReadArgTokenId;
        const owner = tokenId ? this.owners.get(tokenId) : undefined;
        return json({ okay: true, result: owner ? someOwnerHex(owner) : NONE_HEX });
      }
      return json({ okay: true, result: NONE_HEX });
    }

    if (url.includes('/nonces')) return json({ possible_next_nonce: 1 });

    // --- fee estimation ---
    if (url.includes('/v2/fees/transaction')) {
      const f = Number(this.nextFee());
      return json({ estimated_cost_scalar: 1, estimations: [{ fee: f }, { fee: f }, { fee: f }] });
    }
    if (url.includes('/v2/fees/transfer')) return json(1);

    // --- broadcast ---
    if (url.includes('/v2/transactions')) {
      const fee = this.lastBroadcastFee ?? 0n;
      this.broadcasts.push(fee);
      if (fee <= this.minAcceptedFee) {
        return json({ error: 'transaction rejected', reason: 'FeeTooLow', reason_data: { expected: String(this.minAcceptedFee + 1n) } }, 400);
      }
      const txid = `0x${(++this.txSeq).toString(16).padStart(64, '0')}`;
      this.txStatus.set(txid, 'success');
      return json(txid.replace(/^0x/, ''));
    }

    // --- tx status ---
    // Hiro returns the txid WITHOUT a 0x prefix from /v2/transactions but accepts
    // either form on lookup, so normalise both ends here.
    m = /\/extended\/v1\/tx\/(?:0x)?([0-9a-f]+)/.exec(url);
    if (m) { const id = `0x${m[1]}`; return json({ tx_status: this.txStatus.get(id) ?? 'pending', tx_id: id }); }

    if (url.includes('/v2/accounts/')) return json({ balance: '0x0', nonce: 1 });

    return json({ message: `unrouted: ${url}` }, 404);
  }

  /** Set by the fetch shim from the POST body of a read-only call. */
  lastReadArgTokenId: string | null = null;
  /** Fee on the transaction currently being broadcast, decoded by the fetch shim. */
  lastBroadcastFee: bigint | null = null;
}

// (some u<id>) / none, as Clarity hex — built with the real serializer at load time.
let someOwnerHexImpl: (addr: string) => string;
let NONE_HEX = '0x09';
const someOwnerHex = (addr: string) => someOwnerHexImpl(addr);

export async function loadAgent(chain: FakeChain, opts: { core?: string } = {}) {
  const stacks = await import('@stacks/transactions');
  someOwnerHexImpl = (addr: string) =>
    stacks.cvToHex(stacks.responseOkCV(stacks.someCV(stacks.standardPrincipalCV(addr))));
  NONE_HEX = stacks.cvToHex(stacks.responseOkCV(stacks.noneCV()));

  const store = new Map<string, string>();
  const localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() { return store.size; }
  };

  const g = globalThis as any;
  g.window = g.window ?? {};
  g.window.XAO_CONFIG = { hiro: '/hiro/mainnet', mock: false, core: opts.core ?? CORE_CONTRACT.split('.')[1] };
  g.window.localStorage = localStorage;
  g.localStorage = localStorage;
  g.location = { origin: 'https://xtrata.test' };
  g.window.location = g.location;
  if (!g.navigator) { try { g.navigator = {}; } catch { /* node exposes it read-only */ } }
  // No Worker in node → agent-core's sleep falls back to setTimeout, which fake
  // timers can drive. Leaving it undefined is the point, not an oversight.
  g.Worker = undefined;
  g.indexedDB = undefined;

  g.fetch = vi.fn(async (input: any, init?: any) => {
    const url = String(input);
    if (init?.body) {
      // Read-only call: remember which token id was asked about.
      try {
        const body = JSON.parse(String(init.body));
        const arg = Array.isArray(body.arguments) ? body.arguments[0] : null;
        if (typeof arg === 'string') {
          const cv: any = stacks.hexToCV(arg);
          chain.lastReadArgTokenId = cv?.value != null ? String(cv.value) : null;
        }
      } catch { /* not a read-only call */ }
      // Broadcast: pull the real fee out of the serialized transaction, so the fake
      // node judges the fee the agent actually signed rather than one we were told.
      if (url.includes('/v2/transactions')) {
        try {
          const raw = init.body instanceof Uint8Array ? init.body : new Uint8Array(init.body);
          const tx: any = stacks.deserializeTransaction(raw);
          chain.lastBroadcastFee = BigInt(tx.auth.spendingCondition.fee.toString());
        } catch { chain.lastBroadcastFee = null; }
      }
    }
    return chain.handle(url);
  });

  // Timers are faked BEFORE import so the module-scope watcher/reaper intervals
  // never fire on their own and race the assertions.
  vi.useFakeTimers();
  const mod = await import('../../agent-core');
  return mod;
}

export function unloadAgent() {
  vi.useRealTimers();
  vi.resetModules();
}
