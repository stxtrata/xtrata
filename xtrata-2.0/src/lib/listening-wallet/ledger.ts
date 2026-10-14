/**
 * Who owns what is in a passkey listening wallet that was given as a gift (and maybe topped up).
 * Public chain data only, read by the radio page; the wallet frame stays offline and never calls this.
 *
 * The rule that makes returns safe: attribute the MONEY, not the address. A single "who deposited last"
 * address would let dust or a small deposit capture a whole balance. Instead every deposit is an entry,
 * and each source can only ever steer its own entry:
 *
 *  - the gift (a deposit from the gift treasury) belongs to whoever paid for it (`gift.payer`);
 *  - a deposit of at least MIN_FUNDING from an ordinary address belongs to that sender;
 *  - anything else (dust, a contract sender) is counted in the arithmetic but has no destination:
 *    it is the listener's, and goes along with the last return.
 *
 * What has been returned reduces the entry of the address it went to first. Everything else that has
 * left the wallet (play payments, fees, likes) is taken from the OLDEST entries first, so the gift is
 * spent before anyone's top-up and what is left belongs to the most recent depositors.
 *
 * "Deposits minus balance" alone is not enough once a return has happened, because that return would be
 * charged to the oldest entry (the gift). So the wallet's own outgoing transfers are read as well.
 *
 * A read that FAILED is never an answer. Anything unreadable, incomplete or inconsistent gives
 * `{ ok: false }` and the caller says "could not check" and lets the listener choose an address.
 */
import { MIN_FUNDING, parseInbound, type InboundTransfer } from './funder';
import { isMainnetStandardAddress } from './link';

const PAGE = 50;
/** Hiro lists newest first. A gift wallet holds about 1 STX, so its deposit history is short. */
export const MAX_INBOUND_PAGES = 6;
/** Plays are contract calls and share this list with returns, so it is long for a heavy listener. */
export const MAX_OUTGOING_PAGES = 20;

export interface Outgoing {
  recipient: string;
  amount: bigint;
  txId: string;
  blockHeight: number;
  txIndex: number;
}

const order = (a: { blockHeight: number; txIndex: number }, b: { blockHeight: number; txIndex: number }) =>
  a.blockHeight - b.blockHeight || a.txIndex - b.txIndex;

/**
 * One page of `/extended/v1/address/<wallet>/transactions` (rows are the transaction itself, or
 * `{ tx }` on the with-transfers variant). Only successful STX transfers SENT by the wallet are kept;
 * contract calls (plays, likes) are skipped. A malformed row makes the whole page unreadable.
 */
export function parseOutgoing(body: unknown, self: string): { total: number; sent: Outgoing[]; rows: string[] } | null {
  const b = body as { total?: unknown; results?: unknown };
  if (!b || typeof b.total !== 'number' || !Number.isSafeInteger(b.total) || b.total < 0 || !Array.isArray(b.results)) return null;
  const sent: Outgoing[] = [], rows: string[] = [];
  for (const row of b.results as Record<string, any>[]) {
    const r = row && typeof row === 'object' && row.tx && typeof row.tx === 'object' ? row.tx : row;
    if (!r || typeof r.tx_id !== 'string' || typeof r.tx_type !== 'string') return null;
    rows.push(r.tx_id);
    if (r.tx_type !== 'token_transfer' || r.sender_address !== self) continue;
    if (r.tx_status !== 'success') continue; // pending, aborted or dropped: nothing left the wallet
    const t = r.token_transfer;
    if (!t || typeof t.recipient_address !== 'string' || typeof t.amount !== 'string' || !/^\d+$/.test(t.amount)) return null;
    const blockHeight = Number(r.block_height), txIndex = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(blockHeight) || !Number.isSafeInteger(txIndex)) return null;
    sent.push({ recipient: t.recipient_address, amount: BigInt(t.amount), txId: r.tx_id, blockHeight, txIndex });
  }
  return { total: b.total, sent, rows };
}

export type History = { ok: true; inbound: InboundTransfer[]; outgoing: Outgoing[] } | { ok: false };

/**
 * Reads every inbound transfer and, when `withOutgoing`, every outgoing transfer. Anything short of the
 * complete list (too long, a page that will not parse, rows that shifted while paging) is `{ ok: false }`.
 */
export async function readHistory(
  address: string,
  get: (path: string) => Promise<unknown>,
  withOutgoing: boolean
): Promise<History> {
  if (!isMainnetStandardAddress(address)) return { ok: false };
  try {
    const inbound = new Map<string, InboundTransfer>();
    const first = parseInbound(await get(`/extended/v1/address/${address}/stx_inbound?limit=${PAGE}&offset=0`));
    if (!first || first.total > MAX_INBOUND_PAGES * PAGE) return { ok: false };
    for (const t of first.transfers) inbound.set(t.txId + ':' + t.txIndex, t);
    for (let offset = PAGE; offset < first.total; offset += PAGE) {
      const page = parseInbound(await get(`/extended/v1/address/${address}/stx_inbound?limit=${PAGE}&offset=${offset}`));
      if (!page || !page.transfers.length) return { ok: false };
      for (const t of page.transfers) inbound.set(t.txId + ':' + t.txIndex, t);
    }
    // A transfer landing while paging shifts the offsets and repeats or hides a row: not complete, so not an answer.
    if (inbound.size !== first.total) return { ok: false };

    const outgoing = new Map<string, Outgoing>();
    if (withOutgoing) {
      const url = (offset: number) => `/extended/v1/address/${address}/transactions?limit=${PAGE}&offset=${offset}`;
      const head = parseOutgoing(await get(url(0)), address);
      if (!head || head.total > MAX_OUTGOING_PAGES * PAGE) return { ok: false };
      const seen = new Set(head.rows);
      for (const o of head.sent) outgoing.set(o.txId, o);
      for (let offset = PAGE; offset < head.total; offset += PAGE) {
        const page = parseOutgoing(await get(url(offset)), address);
        if (!page || !page.rows.length) return { ok: false };
        for (const id of page.rows) seen.add(id);
        for (const o of page.sent) outgoing.set(o.txId, o);
      }
      if (seen.size !== head.total) return { ok: false };
    }
    return { ok: true, inbound: [...inbound.values()], outgoing: [...outgoing.values()] };
  } catch {
    return { ok: false };
  }
}

export type PartKind = 'gift' | 'deposit' | 'dust';
export interface LedgerPart {
  /** Where this part goes by default; null when nobody can be named (dust, a contract sender). */
  to: string | null;
  kind: PartKind;
  amount: bigint;
  /** Position of the newest deposit in the part (0 = oldest overall), to order parts and find the newest depositor. */
  newest: number;
}

export interface LedgerInput {
  /** The listening wallet itself. */
  self: string;
  /** Confirmed balance, microSTX. */
  balance: bigint;
  inbound: InboundTransfer[];
  outgoing: Outgoing[];
  /** Transfers from `sender` (the gift treasury) are the gift; it goes back to `payer` (the gifter, or the treasury for a campaign). */
  gift?: { sender: string; payer: string };
}

export type Ledger =
  | { ok: true; parts: LedgerPart[]; hasTopUp: boolean }
  | { ok: false; reason: string };

interface Entry { sender: string; left: bigint; kind: PartKind; to: string | null; at: number }

export function buildLedger(input: LedgerInput): Ledger {
  const { self, balance, gift } = input;
  if (typeof balance !== 'bigint' || balance < 0n) return { ok: false, reason: 'balance' };

  const entries: Entry[] = [...input.inbound]
    .filter((t) => t && typeof t.sender === 'string' && t.sender !== self && /^\d+$/.test(t.amount) && BigInt(t.amount) > 0n)
    .sort(order)
    .map((t, at) => {
      const amount = BigInt(t.amount);
      if (gift && t.sender === gift.sender) return { sender: t.sender, left: amount, kind: 'gift' as const, to: gift.payer, at };
      if (isMainnetStandardAddress(t.sender) && amount >= MIN_FUNDING) return { sender: t.sender, left: amount, kind: 'deposit' as const, to: t.sender, at };
      return { sender: t.sender, left: amount, kind: 'dust' as const, to: null, at };
    });

  const totalIn = entries.reduce((s, e) => s + e.left, 0n);
  const returns = [...input.outgoing]
    .filter((o) => o && o.recipient !== self && isMainnetStandardAddress(o.recipient) && o.amount > 0n)
    .sort(order);
  const returned = returns.reduce((s, o) => s + o.amount, 0n);

  // Everything that is neither a return nor still here was spent (plays, fees, likes).
  const spent = totalIn - balance - returned;
  if (spent < 0n) return { ok: false, reason: 'balance is higher than the deposits and returns account for' };

  const take = (list: Entry[], amount: bigint): bigint => {
    let rest = amount;
    for (const e of list) {
      if (rest <= 0n) break;
      const n = e.left < rest ? e.left : rest;
      e.left -= n;
      rest -= n;
    }
    return rest;
  };

  // A return reduces what the address it went to had put in; anything beyond that was someone else's money.
  for (const r of returns) {
    const rest = take(entries.filter((e) => e.to === r.recipient), r.amount);
    if (rest > 0n) take(entries, rest);
  }
  if (take(entries, spent) > 0n) return { ok: false, reason: 'more has left the wallet than was deposited' };
  if (entries.reduce((s, e) => s + e.left, 0n) !== balance) return { ok: false, reason: 'the ledger does not add up to the balance' };

  const byKey = new Map<string, LedgerPart>();
  for (const e of entries) {
    if (e.left <= 0n) continue;
    const key = `${e.kind}:${e.to ?? ''}`;
    const part = byKey.get(key);
    if (part) { part.amount += e.left; part.newest = Math.max(part.newest, e.at); }
    else byKey.set(key, { to: e.to, kind: e.kind, amount: e.left, newest: e.at });
  }
  return {
    ok: true,
    parts: [...byKey.values()].sort((a, b) => a.newest - b.newest),
    hasTopUp: entries.some((e) => e.kind === 'deposit')
  };
}

export interface ReturnStep {
  /** Destination for this step; null means nobody can be named and the listener must choose an address. */
  to: string | null;
  kind: 'deposit' | 'gift' | 'rest';
  /** `amount` sends exactly `send`; `all` sends whatever is left after the fee. */
  mode: 'amount' | 'all';
  /** microSTX the recipient gets (for `all`, the part's own amount less the fee, an estimate until the balance is read). */
  send: bigint;
}

export interface ReturnPlanResult {
  steps: ReturnStep[];
  /**
   * Parts too small to cover their own network fee. They are not returned on their own: they stay in
   * the wallet, or travel with the final `all` step when it sweeps everything that is left.
   */
  tooSmall: LedgerPart[];
}

/**
 * Splits the balance into returns, one per owner, in the order they should run. Each step pays its own
 * network fee out of the part it returns, so nobody's return is charged to someone else's money.
 * Top-ups are returned first and the last step is always `all`, which sweeps the gift's remainder and
 * any dust to the gift's payer (or to an address the listener chooses when there is none).
 */
export function planReturns(parts: LedgerPart[], fee: bigint): ReturnPlanResult {
  const deposits = parts.filter((p) => p.kind === 'deposit').sort((a, b) => a.newest - b.newest);
  const gift = parts.find((p) => p.kind === 'gift');
  const dust = parts.filter((p) => p.kind === 'dust');
  const restAmount = (gift?.amount ?? 0n) + dust.reduce((s, p) => s + p.amount, 0n);

  const steps: ReturnStep[] = [];
  const tooSmall: LedgerPart[] = [];
  const hasRest = restAmount > fee;
  deposits.forEach((p, i) => {
    if (p.amount <= fee) { tooSmall.push(p); return; }
    const last = i === deposits.length - 1 && !hasRest;
    steps.push({ to: p.to, kind: 'deposit', mode: last ? 'all' : 'amount', send: p.amount - fee });
  });
  if (hasRest) steps.push({ to: gift?.to ?? null, kind: gift ? 'gift' : 'rest', mode: 'all', send: restAmount - fee });
  else {
    if (gift) tooSmall.push(gift);
    tooSmall.push(...dust);
  }
  return { steps, tooSmall };
}

/**
 * Default destination for "Return excess" (the balance is above 1 STX): the newest depositor, since an
 * accidental large deposit is almost always the most recent one. The listener still confirms the full
 * address in the wallet frame and can choose another.
 */
export function excessTarget(parts: LedgerPart[]): string | null {
  const newest = parts.filter((p) => p.kind === 'deposit' && p.to).sort((a, b) => b.newest - a.newest)[0];
  return newest?.to ?? null;
}
