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
  /** Which of the passkey's wallets is open (0 = the listener's own wallet; others belong to albums). Only while unlocked. */
  slot?: number;
  /** The passkey's own wallet (slot 0): it signs every like, so likes and plays all count for one listener. Only while unlocked. */
  root?: string;
  /**
   * What this wallet build can do, so the radio can tell an out-of-date wallet box (deployed
   * separately) from a broken one. Absent on builds older than this field.
   */
  features?: string[];
}

/**
 * Features of the current wallet build: `cancel` (listening.cancel), `like` (listening.signLike at LIKE_FEE),
 * `standalone` (returns to a page-supplied destination and likes without a linked main wallet),
 * `multi` (one listening wallet per main-wallet address: status, unlock and create take the connected `main`),
 * `partial` (listening.prepareReturn accepts mode `amount` with an `amount`, to return part of the balance),
 * `slots` (listening.slotAddress, listening.openSlot and listening.bindSlot: one passkey, many derived wallets),
 * `rootLike` (listening.signLike always signs with the passkey's own wallet, whichever album wallet is open, and status reports it as `root`),
 * `move` (listening.signMove: move STX between two wallets of the same passkey, no panel).
 */
export const LISTENING_FEATURES = ['cancel', 'like', 'standalone', 'multi', 'partial', 'slots', 'rootLike', 'move'] as const;

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
  mode: 'excess' | 'all' | 'amount';
  /** microSTX to send, as a decimal string. Required with mode `amount`, ignored otherwise. */
  amount?: string;
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
  mode: 'excess' | 'all' | 'amount';
}

/**
 * `listening.signMove`: sign a transfer between two wallets of the SAME passkey (e.g. from My player to an album wallet).
 * The destination is a wallet NUMBER, derived in the box, so the page can never aim it at another address; the money
 * stays with the listener, which is why no panel is shown. `from` defaults to the open wallet. The page supplies the
 * source wallet's balance and nonce (the box cannot read the chain) and broadcasts the result.
 */
export interface MoveParams {
  to: number;
  from?: number;
  amount: string;
  fee: string;
  nonce: string;
  balance: string;
}
export interface MoveResult extends SignedResult {
  from: string;
  to: string;
  amount: string;
  fee: string;
}

/** `listening.slotAddress`: the address of one of this passkey's wallets. Needs an unlocked wallet; moves nothing. */
export interface SlotParams {
  slot: number;
}
export interface SlotAddressResult {
  slot: number;
  address: string;
}
/** `listening.openSlot`: make that wallet the open one (plays, likes and returns then use it). No passkey tap. */
export interface OpenSlotResult extends UnlockResult {
  slot: number;
}
/**
 * `listening.bindSlot`: both the passkey's first wallet and the derived wallet sign that the derived one belongs to
 * the first (see slots.ts). The page sends the pair to the server, so credit follows the root's link.
 */
export interface BindSlotParams {
  slot: number;
  issued: number;
}
export interface BindSlotResult {
  root: string;
  slot: number;
  address: string;
  issued: number;
  rootSignature: string;
  slotSignature: string;
}
