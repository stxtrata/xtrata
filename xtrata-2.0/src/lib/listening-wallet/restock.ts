/**
 * Restocking a player: how a listener adds plays once the ones they had are used up.
 *
 * Plays are always paid on-chain in STX from the listener's own player (policy.ts), so every way of restocking ends
 * the same way: STX arriving at the player's address. What differs is what the listener hands over:
 *
 *   stx    STX sent straight to the player. Live today. Nothing in between.
 *   sbtc   Bitcoin (sBTC) paid to a restock service, which sends the STX. WRITTEN, NOT SWITCHED ON.
 *   card   A card payment to a restock service, which sends the STX. WRITTEN, NOT SWITCHED ON.
 *
 * The two converted methods need a server that takes the payment and sends STX from a float (the gift treasury
 * already works this way for gifts). That server does not exist yet. This module is the part both sides will share:
 * the methods, the packs, the quote arithmetic and the order shape, as pure functions with tests. Nothing here
 * moves money, and a method that is off can never produce a quote.
 *
 * Rules that hold for every method:
 *   - a quote needs a fresh rate; a missing or stale rate is "unavailable", never a guess and never zero;
 *   - the listener is always charged rounded UP to a whole unit, the player always receives the exact STX;
 *   - a pack that would take the player over the 1 STX target is refused (policy.ts TARGET).
 */
import { costPerPlay, DEFAULT_PLAY_FEE, TARGET } from './policy';

export type RestockMethodId = 'stx' | 'sbtc' | 'card';
export type PayUnit = 'microSTX' | 'sats' | 'pence';

export interface RestockMethod {
  id: RestockMethodId;
  /** What the listener reads on the button. */
  label: string;
  /** One line under it. */
  blurb: string;
  unit: PayUnit;
  /** direct: the listener sends STX themselves. converted: a restock service takes the payment and sends the STX. */
  settles: 'direct' | 'converted';
  on: boolean;
}

/** Which converted methods a deployment has switched on. Absent means off. STX is always on. */
export interface RestockSwitches { sbtc?: boolean; card?: boolean }

export function restockMethods(switches: RestockSwitches = {}): RestockMethod[] {
  return [
    { id: 'stx', label: 'STX', blurb: 'Send STX straight to your player.', unit: 'microSTX', settles: 'direct', on: true },
    { id: 'card', label: 'Card', blurb: 'Pay by card or Apple Pay.', unit: 'pence', settles: 'converted', on: switches.card === true },
    { id: 'sbtc', label: 'Bitcoin', blurb: 'Pay with sBTC.', unit: 'sats', settles: 'converted', on: switches.sbtc === true }
  ];
}
export const methodOf = (id: RestockMethodId, switches: RestockSwitches = {}) => restockMethods(switches).find((m) => m.id === id)!;

/** The sizes offered, in plays. The listener only ever chooses plays; the money is worked out from them. */
export const RESTOCK_PACKS = [100, 250, 500, 1000] as const;
export const MIN_RESTOCK_PLAYS = 10;

/** What `plays` plays cost in microSTX at this play fee. The player receives exactly this. */
export const playsCost = (plays: number, fee: bigint = DEFAULT_PLAY_FEE) => BigInt(plays) * costPerPlay(fee);

/** The most plays that can be added without taking the player over the 1 STX target. */
export function roomForPlays(balance: bigint, fee: bigint = DEFAULT_PLAY_FEE, incoming = 0n): number {
  const room = TARGET - balance - incoming;
  return room > 0n ? Number(room / costPerPlay(fee)) : 0;
}

export interface PackOffer { plays: number; stx: bigint; fits: boolean }
/** Every pack with its STX cost and whether it fits this player right now. `balance` unknown: nothing is said to fit. */
export function packOffers(balance: bigint | undefined, fee: bigint = DEFAULT_PLAY_FEE, incoming = 0n): PackOffer[] {
  const room = balance === undefined ? 0 : roomForPlays(balance, fee, incoming);
  return RESTOCK_PACKS.map((plays) => ({ plays, stx: playsCost(plays, fee), fits: balance !== undefined && plays <= room }));
}

// ---------------------------------------------------------------- quotes (converted methods)

/** Prices of one whole STX, read by the restock service from its price source. `at` is when they were read (ms). */
export interface RestockRates { satsPerStx?: number; pencePerStx?: number; at: number }
/** A rate older than this cannot be quoted from. */
export const RATE_MAX_AGE_MS = 5 * 60_000;
/** A quote stands this long. */
export const QUOTE_TTL_MS = 10 * 60_000;
/** The service's cut on a converted payment, in basis points of the STX cost. Zero until Jim sets one. */
export const DEFAULT_SERVICE_BPS = 0;
export const MAX_SERVICE_BPS = 2_000;

export type QuoteRefusal = 'off' | 'too-few' | 'too-many' | 'no-rate' | 'stale-rate' | 'bad-rate' | 'bad-fee';
export type RestockQuote =
  | { ok: true; method: RestockMethodId; plays: number; stx: bigint; pay: { unit: PayUnit; amount: bigint }; serviceBps: number; expires: number }
  | { ok: false; method: RestockMethodId; reason: QuoteRefusal };

const ceilDiv = (a: bigint, b: bigint) => (a + b - 1n) / b;
/** A rate as an exact fraction (millionths), so no float ever touches an amount. */
const scaled = (rate: number) => BigInt(Math.round(rate * 1_000_000));

/**
 * What the listener pays for `plays` plays by this method. Pure: the same inputs always give the same quote.
 * STX is quoted from the play cost alone. A converted method also needs its rate, fresh, and is refused without it.
 */
export function quoteRestock(o: {
  method: RestockMethodId; plays: number; balance: bigint; now: number;
  fee?: bigint; incoming?: bigint; switches?: RestockSwitches; rates?: RestockRates | null; serviceBps?: number;
}): RestockQuote {
  const { method, plays, now } = o;
  const no = (reason: QuoteRefusal): RestockQuote => ({ ok: false, method, reason });
  const m = methodOf(method, o.switches);
  if (!m?.on) return no('off');
  if (!Number.isSafeInteger(plays) || plays < MIN_RESTOCK_PLAYS) return no('too-few');
  const fee = o.fee ?? DEFAULT_PLAY_FEE;
  if (plays > roomForPlays(o.balance, fee, o.incoming ?? 0n)) return no('too-many');
  const stx = playsCost(plays, fee);
  if (m.settles === 'direct') return { ok: true, method, plays, stx, pay: { unit: 'microSTX', amount: stx }, serviceBps: 0, expires: now + QUOTE_TTL_MS };
  const bps = o.serviceBps ?? DEFAULT_SERVICE_BPS;
  if (!Number.isSafeInteger(bps) || bps < 0 || bps > MAX_SERVICE_BPS) return no('bad-fee');
  const rates = o.rates;
  const rate = m.unit === 'sats' ? rates?.satsPerStx : rates?.pencePerStx;
  if (!rates || rate === undefined) return no('no-rate');
  if (!Number.isFinite(rates.at) || now - rates.at > RATE_MAX_AGE_MS || rates.at > now + 60_000) return no('stale-rate');
  if (!Number.isFinite(rate) || rate <= 0) return no('bad-rate');
  // microSTX -> units: stx/1e6 * rate, with the service cut on top, rounded up to a whole unit (never less than 1).
  const withCut = stx * BigInt(10_000 + bps);
  const amount = ceilDiv(withCut * scaled(rate), 10_000n * 1_000_000n * 1_000_000n);
  return { ok: true, method, plays, stx, pay: { unit: m.unit, amount: amount > 0n ? amount : 1n }, serviceBps: bps, expires: now + QUOTE_TTL_MS };
}

// ---------------------------------------------------------------- orders (converted methods)

/**
 * A converted restock, as the service will record it: what was quoted, for which player, and that it is sent once.
 * `id` is the idempotency key: a payment notice that arrives twice must never send STX twice.
 */
export interface RestockOrder {
  id: string;
  method: Exclude<RestockMethodId, 'stx'>;
  /** The player's address: the STX goes here and nowhere else. */
  player: string;
  plays: number;
  stx: string;
  pay: { unit: PayUnit; amount: string };
  created: number;
  expires: number;
  state: 'quoted' | 'paid' | 'sending' | 'sent' | 'expired' | 'refunding' | 'refunded';
}
export const isOrderId = (id: unknown): id is string => typeof id === 'string' && /^[0-9a-f]{32}$/.test(id);

/** The only moves an order may make. Anything else is a bug or a replay and must be refused by the service. */
const NEXT: Record<RestockOrder['state'], RestockOrder['state'][]> = {
  quoted: ['paid', 'expired'], paid: ['sending', 'refunding'], sending: ['sent', 'refunding'], sent: [], expired: [], refunding: ['refunded'], refunded: []
};
export const canMove = (from: RestockOrder['state'], to: RestockOrder['state']) => NEXT[from].includes(to);

export function orderFromQuote(q: RestockQuote, player: string, id: string, now: number): RestockOrder {
  if (!q.ok) throw new Error('No order without a quote.');
  if (q.method === 'stx') throw new Error('STX is sent by the listener: there is no order.');
  if (!isOrderId(id)) throw new Error('Bad order id.');
  if (!/^SP[0-9A-HJ-NP-TV-Z]{38,39}$/.test(player) && !/^SM[0-9A-HJ-NP-TV-Z]{38,39}$/.test(player)) throw new Error('Not a mainnet address.');
  if (q.expires <= now) throw new Error('That quote has expired.');
  return { id, method: q.method, player, plays: q.plays, stx: q.stx.toString(), pay: { unit: q.pay.unit, amount: q.pay.amount.toString() }, created: now, expires: q.expires, state: 'quoted' };
}

/** A payment settles an order only if it is for that order, in its unit, at least its amount, before it expired. */
export function paymentSettles(order: RestockOrder, p: { orderId: string; unit: PayUnit; amount: bigint; at: number }): boolean {
  return order.state === 'quoted' && p.orderId === order.id && p.unit === order.pay.unit && p.amount >= BigInt(order.pay.amount) && p.at <= order.expires;
}

// ---------------------------------------------------------------- words

const UNIT_TEXT: Record<PayUnit, (a: bigint) => string> = {
  microSTX: (a) => `${a / 1_000_000n}.${(a % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, '').padEnd(2, '0')} STX`,
  sats: (a) => `${a.toLocaleString('en-GB')} sats`,
  pence: (a) => `£${a / 100n}.${(a % 100n).toString().padStart(2, '0')}`
};
export const payText = (pay: { unit: PayUnit; amount: bigint }) => UNIT_TEXT[pay.unit](pay.amount);

export const REFUSAL_TEXT: Record<QuoteRefusal, string> = {
  off: 'Not available yet.',
  'too-few': 'Choose at least 10 plays.',
  'too-many': 'That is more than one player holds. Choose a smaller pack.',
  'no-rate': 'Price unavailable right now. Try again in a moment.',
  'stale-rate': 'Price unavailable right now. Try again in a moment.',
  'bad-rate': 'Price unavailable right now. Try again in a moment.',
  'bad-fee': 'Not available right now.'
};
