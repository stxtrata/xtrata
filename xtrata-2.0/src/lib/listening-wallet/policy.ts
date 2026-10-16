/**
 * Pay-per-play policy for the temporary listening wallet. Pure functions only, shared
 * by the wallet origin (which enforces them before signing) and the radio page (which
 * uses them for display). All amounts are microSTX as bigint.
 *
 * 1 STX is the supported funding TARGET, not an enforceable cap: anyone can send more
 * to a normal address. Above the target, new paid plays pause until the listener
 * returns the excess or everything. Nothing is ever swept automatically.
 */

export const MICRO_PER_STX = 1_000_000n;
export const TARGET = 1_000_000n;
/** Paid to the song's holder by xtrata-radio-plays-v1-0 on every paid start. */
export const HOLDER_PAYMENT = 50n;
/** Kept back from plays so a return can always pay its own fee. Released by Return all. */
export const RESERVE = 3_000n;
/** 257 has confirmed in recorded tests; 300 is the conservative default. Never auto-raised. */
export const DEFAULT_PLAY_FEE = 300n;
export const MIN_PLAY_FEE = 257n;
export const MAX_PLAY_FEE = 1_000n;
export const DEFAULT_RETURN_FEE = 3_000n;
export const MAX_RETURN_FEE = 10_000n;
/** "Running low" prompt threshold: about 140 plays at the default fee. */
export const LOW_BALANCE = 50_000n;
/** Starts closer together than this play free. Bounds how fast a hostile page could spend. */
export const MIN_PLAY_INTERVAL_MS = 20_000;
/** Likes cost only the network fee; this spacing stops a runaway page from spending the budget on them. */
export const MIN_LIKE_INTERVAL_MS = 3_000;
/** Network fee for one like or unlike (set-liked): 0.0002 STX, the same as the main-wallet like page. */
export const LIKE_FEE = 200n;
/** Money moved between a passkey's own wallets: at least this much, and the network fee may not exceed the cap. */
export const MOVE_MIN = 5_000n;
export const MOVE_FEE_CAP = 10_000n;
/**
 * Likes float: the first wallet (it signs every like) gets this much from a new album's gift, once. About 60 likes.
 * Whoever pays for an album copy adds it to the copy's amount, so the album keeps its full plays.
 */
export const LIKES_FLOAT = 15_000n;
/** A session only lives in the wallet frame's memory, so it also ends when the page closes. */
export const MAX_SESSION_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_SESSION_PLAYS = 3_000;

export const costPerPlay = (fee: bigint) => fee + HOLDER_PAYMENT;

export function stx(value: bigint): string {
  const sign = value < 0n ? '-' : '';
  const n = value < 0n ? -value : value;
  return `${sign}${n / MICRO_PER_STX}.${(n % MICRO_PER_STX).toString().padStart(6, '0')}`;
}

/** Whole plays the balance covers after keeping the return reserve. */
export function playsCovered(balance: bigint, fee = DEFAULT_PLAY_FEE): number {
  if (balance <= RESERVE) return 0;
  return Number((balance - RESERVE) / costPerPlay(fee));
}

/** How much may be requested in a deposit so the wallet does not exceed the target. */
export function fundingAllowance(balance: bigint, incoming = 0n): bigint {
  const room = TARGET - balance - incoming;
  return room > 0n ? room : 0n;
}

export type BalanceState = 'empty' | 'low' | 'ok' | 'over';
export function balanceState(balance: bigint, fee = DEFAULT_PLAY_FEE): BalanceState {
  if (balance > TARGET) return 'over';
  if (balance < RESERVE + costPerPlay(fee)) return 'empty';
  if (balance < LOW_BALANCE) return 'low';
  return 'ok';
}

/**
 * `amount` returns a chosen part of the balance (the radio page works out the split between
 * the gift and what a listener added, and asks for each part in turn).
 */
export type ReturnMode = 'excess' | 'all' | 'amount';
export interface ReturnPlan {
  mode: ReturnMode;
  amount: bigint;
  fee: bigint;
  remaining: bigint;
}

/**
 * Return excess leaves exactly the target; Return all leaves zero (releasing the reserve);
 * Return an amount sends exactly that much and leaves the rest.
 * Throws with a listener-facing reason when the transfer cannot proceed at this fee.
 */
export function returnPlan(mode: ReturnMode, balance: bigint, fee = DEFAULT_RETURN_FEE, requested?: bigint): ReturnPlan {
  if (fee < 1n || fee > MAX_RETURN_FEE) throw new Error('Return fee is outside the allowed range.');
  if (mode === 'amount') {
    if (typeof requested !== 'bigint' || requested <= 0n) throw new Error('Choose an amount to return.');
    // The fee comes out of what stays in the wallet, so the recipient gets exactly the amount shown.
    if (requested + fee > balance) throw new Error('The balance cannot cover that amount and the network fee.');
    return { mode, amount: requested, fee, remaining: balance - requested - fee };
  }
  if (mode === 'excess') {
    const amount = balance - TARGET - fee;
    if (amount <= 0n) throw new Error('The excess cannot cover the network fee. Use Return all instead.');
    return { mode, amount, fee, remaining: TARGET };
  }
  const amount = balance - fee;
  if (amount <= 0n) throw new Error('The balance cannot cover the network fee for a return.');
  return { mode, amount, fee, remaining: 0n };
}

export interface SessionTerms {
  /** Network fee per paid play. */
  fee: bigint;
  maxPlays: number;
  /** Total the session may spend, fees included. */
  budget: bigint;
  /** Epoch ms after which the session stops paying. */
  expires: number;
}

export function validateSessionTerms(terms: SessionTerms, now = Date.now()): SessionTerms {
  if (typeof terms?.fee !== 'bigint' || terms.fee < MIN_PLAY_FEE || terms.fee > MAX_PLAY_FEE)
    throw new Error(`Play fee must be between ${stx(MIN_PLAY_FEE)} and ${stx(MAX_PLAY_FEE)} STX.`);
  if (!Number.isInteger(terms.maxPlays) || terms.maxPlays < 1 || terms.maxPlays > MAX_SESSION_PLAYS)
    throw new Error(`A session can pay for 1 to ${MAX_SESSION_PLAYS} plays.`);
  if (typeof terms.budget !== 'bigint' || terms.budget < costPerPlay(terms.fee) || terms.budget > TARGET)
    throw new Error('Session budget must cover one play and be at most 1 STX.');
  if (!Number.isFinite(terms.expires) || terms.expires <= now || terms.expires > now + MAX_SESSION_MS)
    throw new Error('Session must end within 7 days.');
  return terms;
}

/**
 * Spending ledger for one approved session. Lives in the wallet origin's memory only;
 * locking, closing the tab or approving new terms discards it.
 */
export class SessionLedger {
  private spent = 0n;
  private count = 0;
  private lastAt = -Infinity;
  private lastLikeAt = -Infinity;

  constructor(readonly terms: SessionTerms, now = Date.now()) {
    validateSessionTerms(terms, now);
  }

  /** Reserve one play. Throws (and changes nothing) if the terms do not allow it. */
  consume(fee: bigint, now = Date.now()): void {
    const t = this.terms;
    if (now >= t.expires) throw new Error('This listening session has ended. Approve a new one to keep paying.');
    if (fee !== t.fee) throw new Error('Play fee differs from the approved session.');
    if (this.count >= t.maxPlays) throw new Error('Approved number of paid plays reached.');
    if (this.spent + costPerPlay(fee) > t.budget) throw new Error('Approved session budget reached.');
    if (now - this.lastAt < MIN_PLAY_INTERVAL_MS) throw new Error('Too soon after the last paid play; this start plays free.');
    this.spent += costPerPlay(fee);
    this.count++;
    this.lastAt = now;
  }

  /** Reserve one like: the network fee only, from the same approved budget. Throws and changes nothing if not allowed. */
  consumeLike(fee: bigint, now = Date.now()): void {
    const t = this.terms;
    if (now >= t.expires) throw new Error('This listening session has ended. Approve a new one to keep paying.');
    if (fee !== LIKE_FEE) throw new Error('Like fee must be 0.0002 STX.');
    if (this.spent + fee > t.budget) throw new Error('Approved session budget reached.');
    if (now - this.lastLikeAt < MIN_LIKE_INTERVAL_MS) throw new Error('Too soon after the last like. Try again in a moment.');
    this.spent += fee;
    this.lastLikeAt = now;
  }

  get summary() {
    return {
      plays: this.count,
      spent: this.spent,
      // Whichever runs out first: the approved number of plays or the approved budget.
      playsLeft: Math.max(0, Math.min(this.terms.maxPlays - this.count, Number((this.terms.budget - this.spent) / costPerPlay(this.terms.fee)))),
      budgetLeft: this.terms.budget - this.spent,
      expires: this.terms.expires
    };
  }
}
