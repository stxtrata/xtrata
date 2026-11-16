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
   * This wallet's passkey has been checked once, not twice (a free starter player made with `quick`). The radio asks
   * for `listening.prove` before the listener adds anything of their own; an ordinary unlock clears it too.
   */
  unproven?: true;
  /** The name the box gave this player's passkey when it made it (e.g. "Xtrata player · A1B2"), when it gave one: so the listener can tell passkeys apart in their device's list. */
  passkeyName?: string;
  /** This player has backup words (a version 2 key): `listening.backup` lets the listener write them down in the box. */
  phrase?: true;
  /** The listener wrote the backup words down and checked them on this device. */
  backedUp?: true;
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
 * `move` (listening.signMove: move STX between two wallets of the same passkey, no panel),
 * `award` (listening.signAward: claim a Music Hero record from the one award contract the box knows),
 * `sendRecord` (listening.signSendRecord: send an inscription the player holds to an address confirmed in the box),
 * `shelf` (listening.signShelf: sign a request about the albums this player keeps; no panel, moves nothing),
 * `likeFee` (listening.signLike accepts the 0.0003 STX like fee; a box without it signs likes at 0.0002 only),
 * `phrase` (new players have a 24-word backup phrase that opens in other Stacks wallets; listening.backup shows it in the box).
 */
export const LISTENING_FEATURES = ['cancel', 'like', 'standalone', 'multi', 'partial', 'slots', 'rootLike', 'move', 'phrase', 'award', 'sendRecord', 'shelf', 'another', 'forget', 'likeFee'] as const;

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
  /**
   * Create, passkey-only (no `main`): make a NEW, separate player on a device that already has one, with its own new
   * passkey. The existing player is untouched and still opens with its own passkey. Only for claiming a free player
   * by someone who made theirs before the giveaway; the box says plainly that it is a second player.
   */
  another?: boolean;
  /** Unlock: let the listener pick any listening-wallet passkey instead of this device's last one. */
  anyPasskey?: boolean;
  /**
   * Display only: a name for the linked main wallet (e.g. its BNS name), which the offline wallet box cannot look up.
   * The box sanitises it and always shows the main wallet's address beside it.
   */
  label?: string;
  /** Optional: approve these session terms in the same step as the passkey tap. */
  terms?: TermsParams;
  /**
   * Create only, and only without `main`: a free starter player. One passkey use is enough to start listening; the
   * second, matching check is put off until the next unlock or `listening.prove` (status says `unproven` meanwhile).
   */
  quick?: boolean;
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
/**
 * `listening.signAward`: claim a Music Hero record. The page hands over what the awards server signed (the record's
 * bytes and its note); the box reads the record itself, shows the listener what it says, and signs a claim to the one
 * award contract it knows, as the passkey's own wallet. `balance` and `nonce` are that wallet's (slot 0).
 */
export interface SignAwardParams {
  cls: number;
  number: number;
  plays: number;
  /** Hex: the record's bytes (at most 1024) and the 65-byte signature. */
  record: string;
  signature: string;
  fee: string;
  nonce: string;
  balance: string;
}
export interface SignAwardResult extends SignedResult {
  /** The address that claims (the passkey's own wallet), and what the record says. */
  hero: string;
  number: number;
  cls: number;
  name: string | null;
  fee: string;
}

/**
 * `listening.signSendRecord`: send an inscription the player holds (its Music Hero record) to another address. The
 * listener confirms the inscription number and the FULL address inside the box. The transaction can move that one
 * inscription and nothing else. `balance` and `nonce` are the passkey's own wallet's.
 */
export interface SendRecordParams {
  inscription: number;
  recipient: string;
  fee: string;
  nonce: string;
  balance: string;
}
export interface SendRecordResult extends SignedResult {
  from: string;
  recipient: string;
  inscription: number;
  fee: string;
}

/**
 * `listening.signShelf`: sign a request about the albums this player keeps (add, hide, show, remove, or read the
 * list). Signed by the passkey's own wallet with no panel: it is a structured message under its own domain, not a
 * transaction, and can move nothing. The box fills in the player and the time itself.
 */
export interface SignShelfParams { action: 'add' | 'hide' | 'show' | 'remove' | 'list'; release?: string }
export interface SignShelfResult { request: { action: string; release: string; player: string; issued: number }; signature: string }

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
