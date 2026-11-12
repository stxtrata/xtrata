import { describe, expect, it } from 'vitest';
import { canMove, methodOf, orderFromQuote, packOffers, paymentSettles, payText, playsCost, QUOTE_TTL_MS, quoteRestock, RATE_MAX_AGE_MS, restockMethods, roomForPlays } from '../restock';

const NOW = 1_800_000_000_000;
const PLAYER = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const ID = 'ab'.repeat(16);

describe('restock methods', () => {
  it('STX is always on; card and Bitcoin are written but off until a deployment switches them on', () => {
    expect(restockMethods().map((m) => [m.id, m.on])).toEqual([['stx', true], ['card', false], ['sbtc', false]]);
    expect(restockMethods({ card: true }).find((m) => m.id === 'card')!.on).toBe(true);
    expect(methodOf('sbtc', { sbtc: true })).toMatchObject({ on: true, settles: 'converted', unit: 'sats' });
    expect(methodOf('sbtc', { sbtc: 'yes' as never }).on).toBe(false); // only a real true switches it on
  });
});

describe('packs', () => {
  it('cost exactly plays x (fee + 50) and say whether they fit under 1 STX', () => {
    expect(playsCost(100)).toBe(35_000n);
    expect(playsCost(1000)).toBe(350_000n);
    expect(packOffers(0n).map((p) => [p.plays, p.fits])).toEqual([[100, true], [250, true], [500, true], [1000, true]]);
    expect(packOffers(700_000n).map((p) => [p.plays, p.fits])).toEqual([[100, true], [250, true], [500, true], [1000, false]]);
    expect(packOffers(990_000n).every((p) => !p.fits)).toBe(true);
    expect(roomForPlays(1_200_000n)).toBe(0);
    expect(roomForPlays(0n, 300n, 900_000n)).toBe(285); // a deposit already on its way counts
  });
  it('an unknown balance fits nothing: unavailable is never treated as empty', () => {
    expect(packOffers(undefined).every((p) => !p.fits)).toBe(true);
  });
});

describe('quotes', () => {
  const base = { plays: 250, balance: 0n, now: NOW };
  it('STX: the listener sends exactly what the player receives', () => {
    const q = quoteRestock({ ...base, method: 'stx' });
    expect(q).toMatchObject({ ok: true, plays: 250, stx: 87_500n, pay: { unit: 'microSTX', amount: 87_500n }, expires: NOW + QUOTE_TTL_MS });
    if (q.ok) expect(payText(q.pay)).toBe('0.0875 STX');
  });
  it('a method that is off can never be quoted, whatever rates are passed', () => {
    const rates = { satsPerStx: 300, pencePerStx: 20, at: NOW };
    expect(quoteRestock({ ...base, method: 'card', rates })).toEqual({ ok: false, method: 'card', reason: 'off' });
    expect(quoteRestock({ ...base, method: 'sbtc', rates })).toEqual({ ok: false, method: 'sbtc', reason: 'off' });
  });
  it('card: charged in pence, rounded up, never less than a penny', () => {
    const on = { switches: { card: true }, rates: { pencePerStx: 20.5, at: NOW } };
    const q = quoteRestock({ ...base, method: 'card', ...on }); // 0.0875 STX x 20.5p = 1.79p
    expect(q).toMatchObject({ ok: true, stx: 87_500n, pay: { unit: 'pence', amount: 2n } });
    const big = quoteRestock({ ...base, plays: 1000, method: 'card', ...on }); // 0.35 STX x 20.5p = 7.175p
    expect(big).toMatchObject({ ok: true, pay: { unit: 'pence', amount: 8n } });
    if (big.ok) expect(payText(big.pay)).toBe('£0.08');
  });
  it('Bitcoin: charged in sats, with the service cut on top when one is set', () => {
    const on = { switches: { sbtc: true }, rates: { satsPerStx: 300, at: NOW } };
    expect(quoteRestock({ ...base, plays: 1000, method: 'sbtc', ...on })).toMatchObject({ ok: true, pay: { unit: 'sats', amount: 105n } }); // 0.35 x 300
    expect(quoteRestock({ ...base, plays: 1000, method: 'sbtc', ...on, serviceBps: 500 })).toMatchObject({ ok: true, pay: { unit: 'sats', amount: 111n }, serviceBps: 500 }); // 110.25 up
    expect(quoteRestock({ ...base, method: 'sbtc', ...on, serviceBps: 5000 })).toMatchObject({ ok: false, reason: 'bad-fee' });
  });
  it('a missing, stale, future or nonsense rate is unavailable, never a guess', () => {
    const sw = { switches: { card: true, sbtc: true } };
    expect(quoteRestock({ ...base, method: 'card', ...sw })).toMatchObject({ ok: false, reason: 'no-rate' });
    expect(quoteRestock({ ...base, method: 'card', ...sw, rates: { satsPerStx: 300, at: NOW } })).toMatchObject({ ok: false, reason: 'no-rate' });
    expect(quoteRestock({ ...base, method: 'card', ...sw, rates: { pencePerStx: 20, at: NOW - RATE_MAX_AGE_MS - 1 } })).toMatchObject({ ok: false, reason: 'stale-rate' });
    expect(quoteRestock({ ...base, method: 'card', ...sw, rates: { pencePerStx: 20, at: NOW + 120_000 } })).toMatchObject({ ok: false, reason: 'stale-rate' });
    expect(quoteRestock({ ...base, method: 'sbtc', ...sw, rates: { satsPerStx: 0, at: NOW } })).toMatchObject({ ok: false, reason: 'bad-rate' });
    expect(quoteRestock({ ...base, method: 'sbtc', ...sw, rates: { satsPerStx: NaN, at: NOW } })).toMatchObject({ ok: false, reason: 'bad-rate' });
  });
  it('never takes a player over 1 STX, and never quotes a handful of plays', () => {
    expect(quoteRestock({ ...base, method: 'stx', plays: 1000, balance: 700_000n })).toMatchObject({ ok: false, reason: 'too-many' });
    expect(quoteRestock({ ...base, method: 'stx', plays: 5 })).toMatchObject({ ok: false, reason: 'too-few' });
    expect(quoteRestock({ ...base, method: 'stx', plays: 12.5 })).toMatchObject({ ok: false, reason: 'too-few' });
  });
});

describe('orders (converted methods)', () => {
  const quote = () => quoteRestock({ method: 'sbtc', plays: 1000, balance: 0n, now: NOW, switches: { sbtc: true }, rates: { satsPerStx: 300, at: NOW } });
  it('an order is the quote, pinned to one player and one id', () => {
    const o = orderFromQuote(quote(), PLAYER, ID, NOW);
    expect(o).toMatchObject({ id: ID, method: 'sbtc', player: PLAYER, plays: 1000, stx: '350000', pay: { unit: 'sats', amount: '105' }, state: 'quoted' });
    expect(() => orderFromQuote(quote(), 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA', ID, NOW)).toThrow(/mainnet/);
    expect(() => orderFromQuote(quote(), PLAYER, 'nope', NOW)).toThrow(/order id/);
    expect(() => orderFromQuote(quote(), PLAYER, ID, NOW + QUOTE_TTL_MS)).toThrow(/expired/);
    expect(() => orderFromQuote(quoteRestock({ method: 'stx', plays: 100, balance: 0n, now: NOW }), PLAYER, ID, NOW)).toThrow(/no order/);
  });
  it('only the right payment settles it: its id, its unit, at least its amount, in time, and only once', () => {
    const o = orderFromQuote(quote(), PLAYER, ID, NOW);
    const pay = { orderId: ID, unit: 'sats' as const, amount: 105n, at: NOW + 1000 };
    expect(paymentSettles(o, pay)).toBe(true);
    expect(paymentSettles(o, { ...pay, amount: 104n })).toBe(false);
    expect(paymentSettles(o, { ...pay, unit: 'pence' })).toBe(false);
    expect(paymentSettles(o, { ...pay, orderId: 'cd'.repeat(16) })).toBe(false);
    expect(paymentSettles(o, { ...pay, at: o.expires + 1 })).toBe(false);
    expect(paymentSettles({ ...o, state: 'paid' }, pay)).toBe(false); // a second notice for the same payment
  });
  it('an order only moves forward: STX is sent once, or the payment is refunded', () => {
    expect(canMove('quoted', 'paid')).toBe(true);
    expect(canMove('paid', 'sending')).toBe(true);
    expect(canMove('sending', 'sent')).toBe(true);
    expect(canMove('sent', 'sending')).toBe(false);
    expect(canMove('sent', 'refunding')).toBe(false);
    expect(canMove('quoted', 'sending')).toBe(false);
    expect(canMove('paid', 'refunding')).toBe(true);
    expect(canMove('refunded', 'paid')).toBe(false);
  });
});
