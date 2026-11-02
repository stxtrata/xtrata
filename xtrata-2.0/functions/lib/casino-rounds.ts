/**
 * Shared rounds at the roulette, baccarat and Sic Bo tables (docs/plans/CASINO-PLAY-TOGETHER-PLAN.md, phase 2).
 *
 * Everyone at a shared table plays the same round: the same roulette number, the same baccarat cards. Rounds run on the room's
 * clock: round `n` of a table starts at `n * period` milliseconds since 1970 and its bets close `close` milliseconds later. No timer
 * is needed anywhere (the room's Durable Object has none, so it can sleep): the schedule is arithmetic on the time.
 *
 * Fairness (commit, then reveal): each round's result comes from a 32-byte seed, seed = HMAC-SHA256(room secret, "<table>:<n>").
 * While bets are open the room only says sha256(seed) (the commitment); once they close it reveals the seed, and every player's
 * browser checks the seed against the commitment and works the result out from the seed itself, with the functions below. So the
 * room cannot change a result after seeing the bets, and nobody can know it before the bets close.
 *
 * This file is pure (no Cloudflare or DOM types) so it is unit tested, and the same derivation runs in the room client (room.js).
 * The chips are play money kept in each player's browser (LAYR); nothing here moves money.
 */

export const ROUND_TABLES = ['roulette', 'baccarat', 'sicbo'] as const;
export type RoundTable = (typeof ROUND_TABLES)[number];
export const isRoundTable = (value: unknown): value is RoundTable =>
  typeof value === 'string' && (ROUND_TABLES as readonly string[]).includes(value);

/** period: one round, start to start. close: bets close this long after the round starts (the result is shown from then on). */
export const ROUND_TIMING: Record<RoundTable, { period: number; close: number }> = {
  roulette: { period: 32_000, close: 17_000 },
  baccarat: { period: 30_000, close: 15_000 },
  sicbo: { period: 30_000, close: 15_000 }
};

export const roundAt = (table: RoundTable, now: number) => Math.floor(now / ROUND_TIMING[table].period);
export const roundStart = (table: RoundTable, n: number) => n * ROUND_TIMING[table].period;
export const roundClose = (table: RoundTable, n: number) => roundStart(table, n) + ROUND_TIMING[table].close;
export const betsOpen = (table: RoundTable, n: number, now: number) => now >= roundStart(table, n) && now < roundClose(table, n);

// ------------------------------------------------------------------ bets (what a player says they have on the table)

/** The most separate bets one player may have on a round, and the most on one spot (play money; the page has its own limits). */
export const MAX_BET_KEYS = 40;
export const MAX_BET_AMOUNT = 1_000_000;
const ROULETTE_KEY = /^(?:n:(?:[0-9]|[12][0-9]|3[0-6])|m:(?:[0-9]|[12][0-9]|3[0-6])(?:,(?:[0-9]|[12][0-9]|3[0-6])){1,5}|red|black|odd|even|low|high|d[123]|c[123])$/;
const BACCARAT_KEYS = new Set(['player', 'banker', 'tie', 'pp', 'bp']);
/** Sic Bo: small, big, odd, even, any triple; totals n4 to n17; a double d1-d6, a triple t1-t6, a single number s1-s6 (37 in all). */
const SICBO_KEY = /^(?:small|big|odd|even|any|n(?:[4-9]|1[0-7])|[dts][1-6])$/;
export const isBetKey = (table: RoundTable, key: string) =>
  table === 'roulette' ? ROULETTE_KEY.test(key) : table === 'baccarat' ? BACCARAT_KEYS.has(key) : SICBO_KEY.test(key);

export type Bets = Record<string, number>;
/** A player's bets for one round, cleaned: known keys only, whole positive amounts, no more than the limits. Null when not valid. */
export const cleanBets = (table: RoundTable, value: unknown): Bets | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > MAX_BET_KEYS) return null;
  const out: Bets = {};
  for (const [key, amount] of entries) {
    if (!isBetKey(table, key)) return null;
    if (!Number.isSafeInteger(amount) || (amount as number) <= 0 || (amount as number) > MAX_BET_AMOUNT) return null;
    out[key] = amount as number;
  }
  return out;
};

// ------------------------------------------------------------------ results from a seed (run in the browser and in tests)

const hexBytes = (hex: string): Uint8Array<ArrayBuffer> => {
  if (!/^[0-9a-f]{64}$/.test(hex)) throw new Error('A round seed is 64 hex characters.');
  const out = new Uint8Array(new ArrayBuffer(32));
  for (let i = 0; i < 32; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
};

/**
 * A small deterministic generator (sfc32) started from the seed's 32 bytes (folded into its 16-byte state). The seed itself is unpredictable and committed
 * before the round, so the generator only has to spread it out evenly and the same way everywhere.
 */
export const seedRandom = (hex: string) => {
  const b = hexBytes(hex);
  const word = (i: number) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0;
  let a = word(0) ^ word(16), c = word(4) ^ word(20), d = word(8) ^ word(24), e = word(12) ^ word(28);      // all 32 bytes count
  const next = () => {
    a >>>= 0; c >>>= 0; d >>>= 0; e >>>= 0;
    const t = (a + c + e) >>> 0;
    e = (e + 1) >>> 0;
    a = c ^ (c >>> 9);
    c = (d + (d << 3)) >>> 0;
    d = (d << 21) | (d >>> 11);
    d = (d + t) >>> 0;
    return t;
  };
  for (let i = 0; i < 12; i++) next();       // stir before use
  /** A whole number from 0 to n - 1, equally likely (rejection sampling, no modulo bias). */
  const below = (n: number) => {
    const limit = Math.floor(0x1_0000_0000 / n) * n;
    for (;;) { const x = next(); if (x < limit) return x % n; }
  };
  return { next, below };
};

/** The pocket (0 to 36) a roulette round's ball lands in. */
export const rouletteResult = (seedHex: string) => seedRandom(seedHex).below(37);

export type Card = { r: number; s: 'S' | 'H' | 'D' | 'C' };
const SUITS: Card['s'][] = ['S', 'H', 'D', 'C'];
/**
 * The first six cards of a freshly shuffled eight-deck shoe (416 cards), in the order they are dealt: player, banker, player,
 * banker, then a third card for either side as the rules need. `r` is 2 to 14 (14 is the ace), as the casino's own cards are.
 */
export const baccaratCards = (seedHex: string, count = 6): Card[] => {
  const rand = seedRandom(seedHex);
  const shoe = Array.from({ length: 416 }, (_, i) => i);
  const out: Card[] = [];
  for (let i = 0; i < count; i++) {
    const j = i + rand.below(shoe.length - i);
    const pick = shoe[j]; shoe[j] = shoe[i]; shoe[i] = pick;
    const inDeck = pick % 52;
    out.push({ r: 2 + (inDeck % 13), s: SUITS[Math.floor(inDeck / 13)] });
  }
  return out;
};

/** The three dice (1 to 6) of a Sic Bo round, in the order they are shown. */
export const sicboDice = (seedHex: string): [number, number, number] => {
  const rand = seedRandom(seedHex);
  return [rand.below(6) + 1, rand.below(6) + 1, rand.below(6) + 1];
};

// ------------------------------------------------------------------ seeds and commitments (the room's side; async WebCrypto)

const subtle = () => {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c?.subtle) throw new Error('WebCrypto is not available.');
  return c.subtle;
};
const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');

/** The round's seed: HMAC-SHA256 of "<table>:<n>" under the room's secret (32 random bytes kept in the room's storage). */
export const roundSeed = async (secret: Uint8Array, table: RoundTable, n: number): Promise<string> => {
  const key = await subtle().importKey('raw', Uint8Array.from(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await subtle().sign('HMAC', key, new TextEncoder().encode(`${table}:${n}`)));
};

/** What the room shows while bets are open: sha256 of the seed's 32 bytes. */
export const commitOf = async (seedHex: string): Promise<string> => toHex(await subtle().digest('SHA-256', hexBytes(seedHex)));

/** The browser's check: does this seed belong to this commitment? */
export const verifySeed = async (seedHex: string, commit: string): Promise<boolean> => {
  try { return (await commitOf(seedHex)) === commit; } catch { return false; }
};

export type RoundInfo = {
  t: 'round'; tb: RoundTable; n: number; period: number; close: number; start: number; closesAt: number;
  commit: string; seed: string | null; prev: { n: number; seed: string; commit: string }; at: number;
};

/** Everything a table needs to know about the round now: its commitment, and its seed once bets have closed (and the last round's). */
export const roundInfo = async (secret: Uint8Array, table: RoundTable, now: number): Promise<RoundInfo> => {
  const n = roundAt(table, now), { period, close } = ROUND_TIMING[table];
  const seed = await roundSeed(secret, table, n), prevSeed = await roundSeed(secret, table, n - 1);
  return {
    t: 'round', tb: table, n, period, close, start: roundStart(table, n), closesAt: roundClose(table, n),
    commit: await commitOf(seed), seed: now >= roundClose(table, n) ? seed : null,
    prev: { n: n - 1, seed: prevSeed, commit: await commitOf(prevSeed) }, at: now
  };
};
