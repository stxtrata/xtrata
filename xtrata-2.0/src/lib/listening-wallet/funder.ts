/**
 * Who funded a passkey-only listening wallet. Public chain data only, read by the radio page
 * (the wallet frame stays offline and never calls this).
 *
 * A passkey-only listener has no main wallet to return funds to, so the return goes back to
 * where the money came from: the sender of the FIRST meaningful deposit. The rule is
 * deliberately simple so a listener can predict it, and it is never applied silently: the
 * wallet frame shows the full address and the listener confirms it there, and can pick a
 * different address instead.
 *
 *  - "meaningful" = at least MIN_FUNDING (0.1 STX). Dust is the standard address-poisoning
 *    trick (a stranger sends a few microSTX so they appear in the history), so it never counts.
 *  - the sender must be a plain mainnet address. Contract callers (bulk-send, escrow) are
 *    skipped: they cannot be assumed to be able to receive a refund.
 *  - a deposit from the wallet to itself is ignored.
 *
 * Exchange hot wallets look like ordinary senders. A refund to one can be lost, which is why
 * the confirm step and the "different address" option exist; this module only reports facts.
 */
import { isMainnetStandardAddress } from './link';

export const MIN_FUNDING = 100_000n;

export interface InboundTransfer {
  sender: string;
  /** microSTX, decimal string as Hiro reports it. */
  amount: string;
  txId: string;
  blockHeight: number;
  /** Position inside the block, to order transfers that share one. */
  txIndex: number;
}

export type FunderResult =
  | { ok: true; funder: string | null; txId?: string; amount?: string; distinct: number }
  | { ok: false };

/** Oldest-first order. Hiro lists newest first; ties inside a block use the transaction index. */
const oldestFirst = (a: InboundTransfer, b: InboundTransfer) => a.blockHeight - b.blockHeight || a.txIndex - b.txIndex;

/**
 * Pure rule over one page of transfers. `distinct` counts different qualifying senders so the
 * page can say "more than one address has sent funds" and prompt for a deliberate choice.
 */
export function pickFunder(transfers: InboundTransfer[], self: string): FunderResult {
  const qualifying = transfers
    .filter((t) => {
      if (!t || typeof t.sender !== 'string' || t.sender === self || !isMainnetStandardAddress(t.sender)) return false;
      if (!/^\d+$/.test(t.amount)) return false;
      return BigInt(t.amount) >= MIN_FUNDING;
    })
    .sort(oldestFirst);
  if (!qualifying.length) return { ok: true, funder: null, distinct: 0 };
  const first = qualifying[0];
  return { ok: true, funder: first.sender, txId: first.txId, amount: first.amount, distinct: new Set(qualifying.map((t) => t.sender)).size };
}

const PAGE = 50;

/** Parse Hiro's `stx_inbound` page strictly: anything malformed returns null ("could not read"), never a partial list. */
export function parseInbound(body: unknown): { total: number; transfers: InboundTransfer[] } | null {
  const b = body as { total?: unknown; results?: unknown };
  if (!b || typeof b.total !== 'number' || !Number.isSafeInteger(b.total) || b.total < 0 || !Array.isArray(b.results)) return null;
  const transfers: InboundTransfer[] = [];
  for (const r of b.results as Record<string, unknown>[]) {
    // One unreadable row makes the whole page unreadable: skipping it could hide the real first funder
    // (or turn a changed API shape into "nobody funded this"). A failed read is not an empty one.
    if (typeof r?.sender !== 'string' || typeof r.amount !== 'string' || typeof r.tx_id !== 'string') return null;
    const blockHeight = Number(r.block_height), txIndex = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(blockHeight) || !Number.isSafeInteger(txIndex)) return null;
    transfers.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight, txIndex });
  }
  return { total: b.total, transfers };
}

/**
 * Finds the first meaningful funder. Reads the OLDEST page of inbound transfers (Hiro returns
 * newest first, so the start is at offset total-PAGE) and, if that page holds only dust,
 * walks forward until a qualifying deposit or the end. Bounded to a few pages.
 *
 * A failed read is `{ ok: false }` and never "no funder": the caller must say it could not check.
 */
export async function findFunder(
  address: string,
  get: (path: string) => Promise<unknown>,
  maxPages = 4
): Promise<FunderResult> {
  if (!isMainnetStandardAddress(address)) return { ok: false };
  try {
    const url = (offset: number) => `/extended/v1/address/${address}/stx_inbound?limit=${PAGE}&offset=${offset}`;
    const head = parseInbound(await get(url(0)));
    if (!head || (head.total > 0 && !head.transfers.length)) return { ok: false };
    if (head.total === 0) return { ok: true, funder: null, distinct: 0 };
    // Walk from the oldest page forward.
    let offset = Math.max(0, head.total - PAGE);
    for (let i = 0; i < maxPages; i++) {
      const page = offset === 0 && head.total <= PAGE ? head : parseInbound(await get(url(offset)));
      if (!page || !page.transfers.length) return { ok: false };
      const picked = pickFunder(page.transfers, address);
      // Newer pages exist and were not read, so other senders may exist: never claim "only one".
      if (picked.ok && picked.funder) return offset > 0 ? { ...picked, distinct: Math.max(picked.distinct, 2) } : picked;
      if (offset === 0) return picked;
      offset = Math.max(0, offset - PAGE);
    }
    // Ran out of budget on an address with a long dust-only history: say so, do not guess.
    return { ok: false };
  } catch {
    return { ok: false };
  }
}
