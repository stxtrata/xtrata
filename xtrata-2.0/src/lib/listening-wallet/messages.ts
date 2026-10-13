/**
 * Bridge payloads between the radio page (xtrata.xyz) and the listening wallet origin.
 * Amounts cross the boundary as decimal microSTX strings. No payload can carry key
 * material; WalletBridgeHost runs assertNoSecrets on every reply.
 */

export type ListeningState = 'unsupported' | 'none' | 'known' | 'unlocked';

export interface SessionSummary {
  plays: number;
  spent: string;
  playsLeft: number;
  budgetLeft: string;
  expires: number;
}

export interface StatusResult {
  state: ListeningState;
  /** Listening address: known from this device's records, or the unlocked one. */
  address?: string;
  /** Main wallet this listening wallet is linked to, if verified on this device. */
  linked?: string;
  /**
   * Main wallets that OTHER listening wallets on this device are linked to (public addresses, other than the
   * one reported here), so the page can say "this device already has a listening wallet for ...". Absent when none.
   */
  others?: string[];
  session: SessionSummary | null;
  /**
   * What this wallet build can do, so the radio can tell an out-of-date wallet box (deployed
   * separately) from a broken one. Absent on builds older than this field.
   */
  features?: string[];
}

/**
 * Features of the current wallet build: `cancel` (listening.cancel), `like` (listening.signLike at LIKE_FEE),
 * `standalone` (returns to a page-supplied destination and likes without a linked main wallet),
 * `multi` (one listening wallet per main-wallet address: status, unlock and create take the connected `main`).
 */
export const LISTENING_FEATURES = ['cancel', 'like', 'standalone', 'multi'] as const;

/** `listening.status`: the connected main wallet, if any, so the box answers for that address's listening wallet. */
export interface StatusParams {
  main?: string;
}

export interface TermsParams {
  fee: string;
  maxPlays: number;
  budget: string;
  expires: number;
}

export interface UnlockParams {
  mode: 'create' | 'unlock';
  /**
   * The connected main wallet. Unlock opens the listening wallet linked to it (or a never-linked one it can
   * claim); create makes a new one for it. Only chooses among this device's wallets: it grants nothing.
   */
  main?: string;
  /** Unlock: let the listener pick any listening-wallet passkey instead of this device's last one. */
  anyPasskey?: boolean;
  /**
   * Display only: a name for the linked main wallet (e.g. its BNS name), which the offline wallet box cannot look up.
   * The box sanitises it and always shows the main wallet's address beside it.
   */
  label?: string;
  /** Optional: approve these session terms in the same step as the passkey tap. */
  terms?: TermsParams;
}

export interface UnlockResult {
  address: string;
  session: SessionSummary | null;
}

export interface LinkParams {
  main: string;
  issued: number;
  /** RSV signature from the main wallet over the link message. */
  mainSignature: string;
}

export interface LinkResult {
  main: string;
  listening: string;
  issued: number;
  listeningSignature: string;
}

export interface SignPlayParams {
  core: number;
  song: number;
  receipt: string;
  fee: string;
  nonce: string;
  /** Confirmed balance the page observed; the wallet refuses above the 1 STX target. */
  balance: string;
}

export interface SignLikeParams {
  song: number;
  liked: boolean;
  fee: string;
  nonce: string;
  /** Confirmed balance the page observed; the wallet refuses above the 1 STX target. */
  balance: string;
}

export interface ReturnParams {
  mode: 'excess' | 'all';
  balance: string;
  nonce: string;
  fee: string;
  /**
   * Where the funds go when no main wallet is linked (a passkey-only listener): the funder the
   * page found on chain, or an address the listener typed. Ignored when a main wallet is linked,
   * which always wins. The wallet shows the full address and the listener confirms it there.
   */
  destination?: string;
}

export interface SignedResult {
  raw: string;
  txid: string;
}

export interface ReturnResult extends SignedResult {
  amount: string;
  fee: string;
  recipient: string;
  mode: 'excess' | 'all';
}
