/**
 * Radio pay-per-play controller (runs on xtrata.xyz, holds NO key material).
 *
 * Walks a listener from "turn on" to their first confirmed paid play, then lets them pay
 * automatically for each song listened to for 30 seconds. The key lives only in the listening wallet frame on its
 * own origin; this side reads the chain, broadcasts what the frame signed, and keeps a
 * public history. Music always keeps playing: any failure means that start plays free.
 */
import { deserializeTransaction, cvToJSON } from '@stacks/transactions';
import { isMainnetStandardAddress, linkData, type LinkRequest } from '../lib/listening-wallet/link';
import { MIN_FUNDING, type FunderResult } from '../lib/listening-wallet/funder';
import { buildLedger, excessTarget, planReturns, type History, type LedgerPart, type ReturnStep } from '../lib/listening-wallet/ledger';
import type { PlayerView } from '../lib/listening-wallet/gift-players';
import {
  balanceState, costPerPlay, DEFAULT_PLAY_FEE, DEFAULT_RETURN_FEE, fundingAllowance, LIKE_FEE, playsCovered, RESERVE, TARGET,
  type BalanceState, type ReturnMode
} from '../lib/listening-wallet/policy';
import { RADIO_CORE_INDEX } from '../lib/listening-wallet/tx';
import type { BindSlotResult, OpenSlotResult, ReturnResult, SessionSummary, SignedResult, StatusResult, TermsParams } from '../lib/listening-wallet/messages';
import type { Entry } from '../radio-test-wallet/model';

export interface GateConfig {
  enabled: boolean;
  allowed: boolean;
  /** True only on the dedicated pay-per-play radio host; elsewhere the panel points there. */
  here: boolean;
  radioUrl: string | null;
  walletOrigin: string | null;
  canary: boolean;
  /** Listeners without a Stacks wallet may use a passkey listening wallet alone (default off). */
  passkeyOnly?: boolean;
  limits: { playFee: string; returnFee: string; maxSessionPlays: number; sessionHours: number };
  /** Gift wallets (functions/lib/radio-gifts.ts): off unless the deployment has a gift treasury. */
  gifts?: { enabled: boolean; treasury: string | null; turnstileSiteKey: string | null; admin: boolean; fee: string };
}
/** What the server knows about a gifted listening wallet (GET /radio/gift/for). */
export interface GiftInfo {
  /** Where the unused part of the gift goes back to: the friend who paid, or the treasury for a campaign. */
  returnTo: string;
  from: string | null;
  source: string;
  amount: string;
  /** The gift treasury: transfers from it are the gift, anything else that arrived is a top-up. */
  treasury: string;
  state: 'arriving' | 'arrived' | 'sending';
  /** The album this gift came with. Null for a plain gift: the radio then carries on as normal. */
  player: PlayerView | null;
}
export interface StoredLink { listening: string; issued: number; mainSignature: string }

export interface Bridge { request<T = unknown>(method: string, params?: unknown): Promise<T> }
export interface Chain {
  verify(): Promise<void>;
  balance(address: string): Promise<bigint>;
  account(address: string): Promise<{ balance: bigint; nonce: bigint }>;
  /** Next nonce from confirmed chain state (no mempool). */
  confirmedNonce(address: string): Promise<bigint>;
  owner(core: number, id: number): Promise<string>;
  broadcast(raw: string, txid: string): Promise<string>;
  transaction(txid: string): Promise<any | null>;
}
export interface PppDeps {
  now(): number;
  main(): string | undefined;
  config(main: string | undefined): Promise<GateConfig>;
  links(main: string): Promise<StoredLink[]>;
  saveLink(body: LinkRequest & { mainSignature: string; listeningSignature: string }): Promise<void>;
  /** Mounts the wallet frame for this origin (once) and resolves when it can take requests. */
  bridge(origin: string): Promise<Bridge>;
  chain: Chain;
  /** SIP-018 signature from the connected main wallet (one popup). */
  signWithMain(main: string, data: ReturnType<typeof linkData>): Promise<string>;
  /** STX transfer from the main wallet (one popup). Resolves with the txid. */
  deposit(main: string, recipient: string, amount: bigint): Promise<string>;
  /** Validates a signed play/return against its approved terms (radio-test-wallet validateSaved). */
  validate(entry: Entry): void;
  /** Hold the single-tab lock for this listening wallet; false if another tab has it. */
  tabLock(listening: string): Promise<boolean>;
  store: { get(key: string): string | null; set(key: string, value: string): void };
  changed(): void;
  /** A like or unlike from the listening wallet confirmed: the radio should re-read its likes. */
  likesChanged?(): void;
  /** Who funded this listening wallet (first meaningful deposit). `{ok:false}` means the lookup failed, not that there is none. */
  funder?(listening: string): Promise<FunderResult>;
  /**
   * The main wallet the server holds a verified, dual-signed link for (public). Used only to say whose
   * listening wallet this is when no Stacks wallet is connected, e.g. a passkey synced to a new device.
   */
  mainOf?(listening: string): Promise<string | null>;
  /** The song's on-chain like state for the main wallet, including linked listening wallets (`by`). */
  likeState?(main: string, song: number): Promise<{ liked: boolean; by: string[] }>;
  /** A like/unlike from the listening wallet was sent, or could not be: the radio's heart follows. */
  likeSent?(song: number, liked: boolean): void;
  likeFailed?(song: number): void;
  /** The wallet's own transaction check saw a like or unlike confirm: the heart stops waiting for the likes list. */
  likeConfirmed?(song: number, liked: boolean): void;
  /** Pause between checks while a like waits for an earlier transaction (tests pass a fake). */
  wait?(ms: number): Promise<void>;
  /** A display name (e.g. BNS) for a main wallet, if one is already known. Shown in the wallet box; never needed. */
  nameOf?(address: string): string | undefined;
  /**
   * Was this listening wallet gifted? `null` means it was not; a rejection means the server could not be asked (never read as "not a gift").
   */
  giftInfo?(listening: string): Promise<GiftInfo | null>;
  /** Every inbound (and outgoing) STX transfer of the listening wallet, or `{ok:false}` when the list is not complete. */
  history?(listening: string, withOutgoing: boolean): Promise<History>;
}

export type Step =
  | 'off' | 'elsewhere' | 'connect' | 'not-invited' | 'unsupported' | 'intro' | 'locked' | 'link' | 'loading'
  | 'wrong-wallet' | 'fund' | 'over' | 'ready';

export interface Snapshot {
  step: Step;
  busy: string | null;
  message: string;
  error: string;
  gate: GateConfig | null;
  main?: string;
  listening?: string;
  linked?: string;
  balance?: bigint;
  balanceState?: BalanceState;
  playsLeft: number;
  allowance: bigint;
  session: SessionSummary | null;
  /** The listener's switch: once on, every song listened to for 30 seconds pays until they switch it off or funds run out. */
  payingOn: boolean;
  entries: Entry[];
  depositTxid?: string;
  /** A deposit was sent and has not confirmed yet: no further deposit is offered. */
  depositPending: boolean;
  /**
   * The wallet box (deployed separately, at wallet.xtrata.xyz) is an older build without like
   * signing: the heart falls back to the main-wallet page until it is updated.
   */
  walletOutdated: boolean;
  /** Listening wallets linked to the connected main wallet (dual-signed, public), newest first. */
  linkedListening: string[];
  /** The server holds a link for this listening wallet, so linking needs no new wallet popup. */
  serverLinked: boolean;
  /**
   * The unlock confirm is already waiting inside the listening wallet, so the listener's first tap
   * there goes straight to their passkey.
   */
  armed: boolean;
  /** Unresolved payments older than 30 minutes that the chain has never seen. */
  stuck: number;
  /** Songs heard for 30 seconds and waiting to be paid (the wallet was busy with a like or an earlier payment). */
  queued: number;
  /** Passkey-only: no main wallet is involved; the listening address is the listener. */
  solo: boolean;
  /** Where a return would go: the linked main wallet, else the address the listener chose, else the funder. */
  returnTo?: string;
  returnToKind?: 'linked' | 'chosen' | 'funder';
  funderState: 'unknown' | 'found' | 'none' | 'failed';
  /** More than one address has sent meaningful funds, so the first is only a suggestion. */
  funderMultiple: boolean;
  /** Passkey-only needs a wallet box that can return to a chosen address and like unlinked. */
  walletCannotSolo: boolean;
  /** The wallet box predates one listening wallet per address: it answers with its last wallet whichever address is connected. */
  walletCannotMulti: boolean;
  /** Main wallets that other listening wallets on this device belong to (not the connected one, not this wallet's). */
  others: string[];
  /**
   * No Stacks wallet connected, but the server holds a link for this listening wallet: whose wallet it is
   * (display only: returns and signing still follow the wallet box's own records).
   */
  creditedTo?: string;
  /**
   * This wallet was created on this device (in this browser), not unlocked from a passkey made elsewhere. Only such
   * a wallet takes a gift: gifts are for brand-new listening wallets.
   */
  createdHere: boolean;
  /**
   * The open wallet has never held or sent anything (confirmed balance 0 and confirmed nonce 0): brand-new
   * whichever device made it, e.g. a passkey made in another tab after this page reloaded. Gifts may claim
   * into it. Unknown (not yet read, or the read failed) counts as false.
   */
  brandNew: boolean;
  /** This wallet was gifted (the server says so). `player` is the album that came with it, if any. */
  gift: { player: PlayerView | null; from: string | null; source: string; amount: string } | null;
  /** Paid plays this gifted wallet still buys, counting payments in flight and songs waiting to be paid. */
  giftPlays: number;
  /**
   * A curated album stays the only thing on the radio until its own wallet is topped up: a deposit of at least
   * 0.1 STX from an address that is neither the gifter nor the gift treasury (the listener's other wallets count).
   * A default of the radio page, not security. `known` is false until the answer has been read (the radio then waits).
   */
  albumLock: { locked: boolean; known: boolean } | null;
  /** Why a gift player is silent right now. Null while it may play. Transient failures never set it. */
  giftStop: { reason: GiftStopReason; text: string } | null;
  /** How a gifted wallet's balance will go back, worked out from the chain on request. */
  returnPlan: ReturnPlanView;
  /**
   * The wallet that signs and pays for every like: the passkey's own (main listener) wallet, whichever album is open.
   * `low` is set once its balance is known to be below what one like needs; `album` means an album wallet is the open one,
   * so this is a different address from `listening`. Null until a wallet is unlocked.
   */
  /** Which of the passkey's wallets is open: 0 is the listener's own, 1 and up belong to albums. */
  slot: number;
  /** The passkey's own wallet (it signs every like). Absent until a wallet is unlocked. */
  root?: string;
  /** The wallet box predates album wallets (`slots`): albums cannot be claimed or opened until it is updated. */
  walletCannotAlbums: boolean;
  likeFunds: { address: string; balance?: bigint; low: boolean; album: boolean; pending: boolean; txid?: string; main?: string } | null;
}
export type GiftStopReason = 'connect' | 'locked' | 'link' | 'over' | 'arriving' | 'out' | 'off' | 'tab';
export type ReturnPlanView =
  | { state: 'none' }
  | { state: 'ready'; steps: { to: string | null; kind: ReturnStep['kind']; send: string }[]; kept: number; excess: string | null }
  | { state: 'unavailable' };

const UNRESOLVED: Entry['status'][] = ['prepared', 'signed', 'unknown', 'pending'];
const STUCK_AFTER_MS = 30 * 60_000;

/** The node refused the transaction outright, so it never entered the mempool and its nonce is unused. */
export const definitelyRejected = (e: unknown) => {
  const err = e as { feeRejected?: boolean; message?: string };
  return err?.feeRejected === true || /\(400\)/.test(err?.message ?? '');
};
/** After a like or unlike confirms, the same song's heart stays locked this long. */
export const LIKE_COOLDOWN_MS = 3_000;
const OUT_OF_LIKES = 'Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.';
const randomId = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');

export function createPppController(deps: PppDeps) {
  let gate: GateConfig | null = null;
  let gateAt = -Infinity;
  let gateFor: string | undefined;
  let bridge: Bridge | null = null;
  let status: StatusResult | null = null;
  let balance: bigint | undefined;
  let balanceAt = -Infinity;
  // The passkey's own wallet signs the likes: its balance is read separately while an album wallet is open.
  let rootBalance: { for: string; value: bigint; at: number } | null = null;
  let busy: string | null = null;
  let paying = false;
  let liking = false;
  let checkingLike = false; // a heart tap is reading the song's state: no paid play signs meanwhile
  // A heart tap while locked: sent right after the listener unlocks (within 2 minutes).
  let likeAfterUnlock: { song: number; title?: string; artist?: string; likedBy?: string[]; at: number } | null = null;
  let likesConfirmed = false;
  let message = '';
  let error = '';
  let depositTxid: string | undefined;
  let serverLink: StoredLink | null = null;
  let serverLinkFor: string | undefined;
  let mainLinks: StoredLink[] = [];
  let mainLinksFor: string | undefined;
  let mainLinksAt = -Infinity;
  const notSeen = new Set<string>();
  // Passkey-only: who funded this wallet (first meaningful deposit), looked up on the page (the frame is offline).
  let funderRes: { for: string; res: FunderResult; at: number } | null = null;
  let funderLooking = false;
  let funderFails = 0;
  let creditedRes: { for: string; main: string | null; ok: boolean; at: number } | null = null;
  let unusedRes: { for: string; unused: boolean } | null = null;
  let creditedLooking = false;
  // Gift: what the server says about this wallet (kept on this device so the album survives an unreachable server).
  let giftRes: { for: string; info: GiftInfo | null; ok: boolean; at: number } | null = null;
  let giftLooking = false;
  let preview: { at: number; balance: bigint; plan: ReturnPlanView; steps: ReturnStep[]; parts: LedgerPart[] } | null = null;
  let previewFailed = false;
  let verified = false;
  let lockHeld = false;
  // One-tap unlock: an unlock panel opened in the frame on page load, waiting for the listener.
  let armed = false;
  let armOff = false;          // the listener cancelled an unlock: wait for them to ask again
  let armFailures = 0;
  let afterArm: (() => Promise<void>) | null = null;
  let armDone: Promise<void> = Promise.resolve();
  const fee = () => BigInt(gate?.limits.playFee ?? DEFAULT_PLAY_FEE.toString());
  // Builds before `features` existed report none: treat them as lacking every newer feature.
  const walletLacks = (feature: string) => !!status && !(status.features ?? []).includes(feature);

  const key = (kind: string, listening: string) => `xtrata.ppp.v1.${kind}:${listening}`;
  const entries = (listening = status?.address): Entry[] => {
    if (!listening) return [];
    try { const v = JSON.parse(deps.store.get(key('entries', listening)) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
  };
  const saveEntry = (e: Entry) => {
    const list = [e, ...entries(e.address).filter((x) => !(x.txid === e.txid && x.kind === e.kind))].slice(0, 200);
    deps.store.set(key('entries', e.address), JSON.stringify(list));
  };
  // On by default; only an explicit "Switch off" (or Return all) turns it off, and it stays off across visits.
  const payingOn = (listening = status?.address) => !!listening && deps.store.get(key('on', listening)) !== '0';
  const setPayingOn = (on: boolean) => { if (status?.address) deps.store.set(key('on', status.address), on ? '1' : '0'); };
  const unresolved = () => entries().filter((e) => UNRESOLVED.includes(e.status));
  /** Everything still confirming for the open wallet and, while an album is open, for the like-signing wallet too. */
  const unresolvedAll = () => (albumOpen() ? [...unresolved(), ...entries(likeAddr()).filter((e) => UNRESOLVED.includes(e.status))] : unresolved());
  type PendingDeposit = { txid: string; amount: string; at: number };
  const pendingDeposit = (): PendingDeposit | null => {
    return pendingDepositOf(status?.address);
  };
  const pendingDepositOf = (listening?: string): PendingDeposit | null => {
    if (!listening) return null;
    try { return JSON.parse(deps.store.get(key('deposit', listening)) || 'null'); } catch { return null; }
  };
  const setPendingDeposit = (d: PendingDeposit | null, listening = status?.address) => { if (listening) deps.store.set(key('deposit', listening), JSON.stringify(d)); };
  /** The wallet that signs likes: the passkey's own, even while an album wallet is open (boxes before `rootLike` sign with the open one). */
  const likeAddr = (): string | undefined => (walletLacks('rootLike') ? status?.address : status?.root ?? status?.address);
  const albumOpen = () => !!status?.address && likeAddr() !== status.address;
  const likeBalance = (): bigint | undefined => {
    if (!albumOpen()) return balance;
    return rootBalance && rootBalance.for === likeAddr() ? rootBalance.value : undefined;
  };
  const likeLow = (b: bigint | undefined) => b !== undefined && b < RESERVE + LIKE_FEE;
  const stuck = () => unresolved().filter((e) => deps.now() - e.created > STUCK_AFTER_MS && notSeen.has(e.txid!));

  /**
   * Passkey-only: the listener has no main wallet in play (none connected, or one that is not
   * invited), the deployment allows it, and this device's listening wallet is not linked to a main
   * wallet. A connected, invited main wallet keeps the linked flow.
   */
  // `gateFor` must be the current main: a gate fetched for a previous wallet says nothing about this one.
  // A listening wallet that is already linked to a main wallet belongs to a Stacks wallet holder: it is
  // never passkey-only. Without that main connected it asks for the wallet, exactly as before. Only a new
  // visitor, or a wallet that was never linked, goes passkey-only. (Until the frame has answered, `status`
  // is unknown and the visitor is treated as new, so the first check can run.)
  const soloOpen = () => gate?.passkeyOnly === true && (!deps.main() || (gateFor === deps.main() && !gate.allowed));
  const solo = () => soloOpen() && !status?.linked;
  /**
   * The listening wallet the box reports is linked to one main wallet and a different one is connected. A box that
   * supports one listening wallet per address (`multi`) never reports another address's wallet, so this only
   * happens with an older box: the listener then stays locked (nothing unlocks, pays, likes or links) until the
   * linked wallet is connected, and the panel says the box is updating.
   */
  const mismatch = () => {
    const main = deps.main();
    return !solo() && !!main && !!status?.linked && status.linked !== main;
  };
  const chosenKey = (listening: string) => key('return-to', listening);
  const chosenAddress = (listening = status?.address): string | undefined => {
    if (!listening) return undefined;
    const v = deps.store.get(chosenKey(listening));
    return v && isMainnetStandardAddress(v) && v !== listening ? v : undefined;
  };
  const funderFor = (listening = status?.address) => (funderRes && funderRes.for === listening ? funderRes.res : null);
  /** linked main wallet always wins, then the address the listener chose, then the funder. */
  function returnTarget(): { to: string; kind: 'linked' | 'chosen' | 'funder' } | undefined {
    if (!status?.address) return undefined;
    if (status.linked) return { to: status.linked, kind: 'linked' };
    const chosen = chosenAddress();
    if (chosen) return { to: chosen, kind: 'chosen' };
    const f = funderFor();
    if (f?.ok && f.funder) return { to: f.funder, kind: 'funder' };
    return undefined;
  }

  // ---------------------------------------------------------------- gifted wallets
  const giftKey = (listening: string) => key('gift', listening);
  /** The gift record for the open wallet: the latest answer, else the one kept from last time. */
  function giftNow(): GiftInfo | null {
    const listening = status?.address;
    if (!listening) return null;
    if (giftRes?.for === listening) return giftRes.info;
    try {
      const v = JSON.parse(deps.store.get(giftKey(listening)) || 'null');
      return v && typeof v.returnTo === 'string' && typeof v.treasury === 'string' ? (v as GiftInfo) : null;
    } catch { return null; }
  }
  /**
   * Asks the server whether this wallet was gifted. A failed answer keeps what was known and is tried again a
   * minute later; it never turns a gifted wallet into an ordinary one (and so never lets a gift player play free).
   */
  async function lookupGift() {
    const listening = status?.address;
    if (!listening || !deps.giftInfo || !gate?.gifts?.enabled || giftLooking) return;
    const known = giftRes?.for === listening ? giftRes : null;
    const wait = !known ? 0 : !known.ok ? 60_000 : known.info ? 30 * 60_000 : 10 * 60_000;
    if (known && deps.now() - known.at < wait) return;
    giftLooking = true;
    const before = giftNow();
    try {
      const info = await deps.giftInfo(listening);
      giftRes = { for: listening, info, ok: true, at: deps.now() };
      deps.store.set(giftKey(listening), JSON.stringify(info));
    } catch { giftRes = { for: listening, info: before, ok: false, at: deps.now() }; }
    finally { giftLooking = false; }
  }

  const inFlight = () => entries().reduce((sum, e) => (UNRESOLVED.includes(e.status) ? sum + BigInt(e.amount || '0') + BigInt(e.fee || '0') : sum), 0n);
  /** Paid plays this wallet can still buy: the balance less what is already on its way out and songs waiting to be paid. */
  function playsLeftNow(): number {
    if (balance === undefined) return 0;
    const spendable = balance - inFlight() - BigInt(queue.length) * costPerPlay(fee());
    return spendable > 0n ? playsCovered(spendable, fee()) : 0;
  }
  const OUT_TEXT = 'OUT OF PLAYS — ADD MORE TO KEEP LISTENING';
  /**
   * A gift player has no free mode: it plays only while paid plays are available. Anything that is merely
   * unknown (the balance is still loading, a read failed) is never a reason to stop.
   */
  function giftStop(): Snapshot['giftStop'] {
    if (!giftNow()?.player) return null;
    const stop = (reason: GiftStopReason, text: string) => ({ reason, text });
    switch (step()) {
      case 'connect': case 'wrong-wallet': return stop('connect', 'CONNECT YOUR WALLET TO LISTEN');
      case 'locked': return stop('locked', 'UNLOCK TO LISTEN');
      case 'link': return stop('link', 'FINISH SETUP TO LISTEN');
      case 'over': return stop('over', 'OVER 1 STX — RETURN THE EXCESS');
      case 'fund': return pendingDeposit() ? stop('arriving', 'YOUR PLAYS ARE ARRIVING') : stop('out', OUT_TEXT);
      case 'ready':
        if (!payingOn() || !status?.session || status.session.playsLeft < 1) return stop('off', 'PAYING IS OFF — SWITCH ON TO LISTEN');
        if (!lockHeld) return stop('tab', 'PLAYING IN ANOTHER TAB');
        return playsLeftNow() < 1 ? stop('out', OUT_TEXT) : null;
      default: return null;
    }
  }

  // ---------------------------------------------------------------- the album lock
  type Unlock = { for: string; ok: boolean; open: boolean; at: number };
  let unlockRes: Unlock | null = null;
  let unlockLooking = false;
  // Per album wallet: the listener's own wallet history says nothing about whether THIS album was ever topped up.
  const unlockKey = (album: string) => key('album-unlocked', album);
  /** Only a curated album (an album wallet that was gifted with a player) is ever locked. */
  const lockWanted = () => !!status?.address && albumOpen() && !!giftNow()?.player;
  function albumLock(): Snapshot['albumLock'] {
    if (!lockWanted()) return null;
    const album = status!.address!;
    if (deps.store.get(unlockKey(album)) === '1') return { locked: false, known: true };
    return unlockRes?.for === album && unlockRes.ok ? { locked: !unlockRes.open, known: true } : { locked: true, known: false };
  }
  /**
   * Reads the inbound transfers of the album's own wallet. A deposit of at least 0.1 STX from anyone but the gifter and the
   * gift treasury (the listener's own wallets count) opens it; a positive answer is remembered for good, an unreadable list
   * keeps it locked and is tried again.
   */
  async function lookupUnlock() {
    if (!lockWanted() || !deps.history || unlockLooking) return;
    const info = giftNow()!, album = status!.address!;
    if (deps.store.get(unlockKey(album)) === '1') return;
    if (unlockRes?.for === album && deps.now() - unlockRes.at < (unlockRes.ok ? 2 * 60_000 : 60_000)) return;
    unlockLooking = true;
    try {
      const h = await deps.history(album, false);
      if (!h.ok) unlockRes = { for: album, ok: false, open: false, at: deps.now() };
      else {
        const open = h.inbound.some((t) => isMainnetStandardAddress(t.sender) && t.sender !== album && t.sender !== info.from && t.sender !== info.treasury && BigInt(t.amount) >= MIN_FUNDING);
        unlockRes = { for: album, ok: true, open, at: deps.now() };
        if (open) deps.store.set(unlockKey(album), '1');
      }
    } catch { unlockRes = { for: album, ok: false, open: false, at: deps.now() }; }
    finally { unlockLooking = false; }
  }

  // ---------------------------------------------------------------- returns that follow the money
  const PREVIEW_MS = 3 * 60_000;
  /** A gifted, unlinked wallet splits its balance by where each part came from. A linked one returns to its main wallet. */
  const ledgerReturns = () => !!giftNow() && !!deps.history && !status?.linked;

  async function readLedger(): Promise<{ balance: bigint; nonce: bigint; parts: LedgerPart[]; steps: ReturnStep[]; tooSmall: number } | null> {
    const listening = status!.address!;
    const info = giftNow()!;
    const { balance: b, nonce } = await deps.chain.account(listening);
    const h = await deps.history!(listening, true);
    if (!h.ok) return null;
    const ledger = buildLedger({ self: listening, balance: b, inbound: h.inbound, outgoing: h.outgoing, gift: { sender: info.treasury, payer: info.returnTo } });
    if (!ledger.ok) return null;
    const plan = planReturns(ledger.parts, DEFAULT_RETURN_FEE);
    return { balance: b, nonce, parts: ledger.parts, steps: plan.steps, tooSmall: plan.tooSmall.length };
  }

  const returnPlanView = (): ReturnPlanView => {
    if (previewFailed) return { state: 'unavailable' };
    if (!preview || deps.now() - preview.at > PREVIEW_MS || (balance !== undefined && balance !== preview.balance)) return { state: 'none' };
    return preview.plan;
  };

  function step(): Step {
    if (!gate?.enabled) return 'off';
    if (!gate.here) return 'elsewhere';
    const main = deps.main();
    if (!solo()) {
      if (!main) return 'connect';
      if (!gate.allowed) return 'not-invited';
    }
    if (!status) return 'loading';
    if (status.state === 'unsupported') return 'unsupported';
    if (status.state === 'none') return 'intro';
    if (mismatch()) return 'wrong-wallet';
    if (status.state === 'known') return 'locked';
    if (!solo() && status.linked !== main) return 'link';
    if (balance === undefined) return 'loading';
    if (balance > TARGET) return 'over';
    if (balance < RESERVE + costPerPlay(fee())) return 'fund';
    return 'ready';
  }

  const snapshot = (): Snapshot => ({
    step: step(), busy, message, error, gate, main: deps.main(),
    listening: status?.address, linked: status?.linked, balance,
    balanceState: balance === undefined ? undefined : balanceState(balance, fee()),
    playsLeft: balance === undefined ? 0 : playsCovered(balance, fee()),
    allowance: balance === undefined ? TARGET : fundingAllowance(balance, BigInt(pendingDeposit()?.amount ?? '0')),
    session: status?.session ?? null,
    payingOn: payingOn(), entries: entries(), depositTxid: pendingDeposit()?.txid ?? depositTxid,
    depositPending: !!pendingDeposit(),
    walletOutdated: walletLacks('like'),
    linkedListening: mainLinksFor && mainLinksFor === deps.main() ? mainLinks.map((l) => l.listening) : [],
    serverLinked: !!serverLink && serverLinkFor === `${deps.main()}:${status?.address}`,
    stuck: stuck().length, armed,
    queued: queue.length,
    solo: solo(), returnTo: returnTarget()?.to, returnToKind: returnTarget()?.kind,
    funderState: (() => { const f = funderFor(); return !f ? 'unknown' : !f.ok ? 'failed' : f.funder ? 'found' : 'none'; })(),
    funderMultiple: (() => { const f = funderFor(); return !!f && f.ok && f.distinct > 1; })(),
    walletCannotSolo: solo() && walletLacks('standalone'),
    walletCannotMulti: walletLacks('multi'),
    others: (status?.others ?? []).filter((a) => a !== deps.main() && a !== status?.linked),
    creditedTo: solo() && status?.address && creditedRes?.for === status.address && creditedRes.main ? creditedRes.main : undefined,
    createdHere: !!status?.address && deps.store.get(key('created', status.address)) === '1',
    brandNew: !!status?.address && balance === 0n && unusedRes?.for === status.address && unusedRes.unused,
    gift: (() => { const g = giftNow(); return g ? { player: g.player, from: g.from, source: g.source, amount: g.amount } : null; })(),
    giftPlays: giftNow() ? playsLeftNow() : 0,
    giftStop: giftStop(),
    albumLock: albumLock(),
    returnPlan: returnPlanView(),
    slot: status?.state === 'unlocked' ? status.slot ?? 0 : 0,
    root: status?.state === 'unlocked' ? status.root ?? status.address : undefined,
    walletCannotAlbums: walletLacks('slots'),
    likeFunds: (() => {
      const address = likeAddr();
      if (!address || status?.state !== 'unlocked') return null;
      const b = likeBalance();
      return { address, balance: b, low: likeLow(b), album: albumOpen(), pending: !!pendingDepositOf(address), txid: pendingDepositOf(address)?.txid, main: deps.main() };
    })()
  });

  const say = (m: string, e = '') => { message = m; error = e; deps.changed(); };

  async function task(label: string, run: () => Promise<void>) {
    if (busy) return;
    busy = label; error = ''; deps.changed();
    try { await run(); }
    catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      error = /Cancelled in the listening wallet/.test(m) ? '' : m;
      if (!error) { message = 'Not now. Nothing was signed.'; armOff = true; }
    } finally { busy = null; await refresh(true); }
  }

  /** Pay-per-play is open to this visitor: on, on the radio host, and either invited with a main wallet or passkey-only. */
  const open = () => !!gate?.enabled && gate.here && (solo() || (!!deps.main() && gate.allowed));
  /** Open, and not a different wallet's listener: what every action that unlocks, pays or likes requires. */
  const usable = () => open() && !mismatch();
  const wrongWalletMessage = () => 'This device\'s listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.';
  const guardMatch = () => { if (mismatch()) throw new Error(wrongWalletMessage()); };

  // The bridge itself only needs `open`: the page must read which wallet the listener is linked to before it can know.
  async function ensureBridge() {
    if (!open()) throw new Error('Pay-per-play is not open to this wallet yet. Listening stays free.');
    if (!gate?.walletOrigin) throw new Error('Pay-per-play is switched off right now. Listening stays free.');
    bridge ??= await deps.bridge(gate.walletOrigin);
    return bridge;
  }

  /**
   * The wallet box answers for the connected main wallet's own listening wallet (one per address), or says it has
   * none for it. Boxes older than `multi` ignore the address and answer with their last wallet.
   */
  const readStatus = (b: Bridge) => { const main = deps.main(); return b.request<StatusResult>('listening.status', main ? { main } : undefined); };

  async function refreshBalance(force = false) {
    if (!status?.address) return;
    if (!force && deps.now() - balanceAt < 30_000) return;
    balance = await deps.chain.balance(status.address);
    balanceAt = deps.now();
    await refreshRootBalance(force);
  }

  /** While an album wallet is open, the main listener wallet that signs the likes needs its own balance reading. */
  async function refreshRootBalance(force = false) {
    const root = likeAddr();
    if (!albumOpen() || !root || status?.state !== 'unlocked') return;
    if (!force && rootBalance?.for === root && deps.now() - rootBalance.at < 30_000) return;
    try { rootBalance = { for: root, value: await deps.chain.balance(root), at: deps.now() }; }
    catch { /* unknown, not "empty": the banner waits for a real answer */ }
  }

  /**
   * The main wallet's public links: shown in the panel, and how a link saved from another device is
   * found. Using that link still needs the listener's confirm in the frame.
   */
  async function lookupServerLink(main: string) {
    if (mainLinksFor !== main || deps.now() - mainLinksAt >= 60_000) {
      mainLinks = await deps.links(main);
      mainLinksFor = main;
      mainLinksAt = deps.now();
    }
    if (status?.state !== 'unlocked' || status.linked === main) return;
    const id = `${main}:${status.address}`;
    if (serverLinkFor === id && serverLink) return;
    serverLink = mainLinks.find((l) => l.listening === status!.address) ?? null;
    serverLinkFor = id;
  }

  /**
   * Passkey-only: find who funded the wallet, once it holds something. A failed lookup is reported
   * as failed (and retried after a minute), never as "nobody funded it".
   */
  async function lookupFunder() {
    const listening = status?.address;
    if (!solo() || !listening || status?.linked || !deps.funder || funderLooking) return;
    if (!balance || balance <= 0n) return;
    const known = funderFor(listening);
    if (known?.ok && known.funder) return;
    // Back off after failures (1, 2, 4... minutes, at most 30) so a dust-heavy history cannot hammer the API.
    const wait = known?.ok ? 30_000 : Math.min(60_000 * 2 ** Math.max(0, funderFails - 1), 30 * 60_000);
    if (funderRes && funderRes.for === listening && deps.now() - funderRes.at < wait) return;
    funderLooking = true;
    try { funderRes = { for: listening, res: await deps.funder(listening), at: deps.now() }; }
    catch { funderRes = { for: listening, res: { ok: false }, at: deps.now() }; }
    finally { funderLooking = false; }
    funderFails = funderRes.res.ok ? 0 : funderFails + 1;
  }

  /**
   * Passkey-only view of a wallet that IS linked (its passkey synced to a device where no Stacks wallet is
   * connected): ask the server whose it is, so the panel can say so. A failed lookup is retried after a
   * minute rather than read as "not linked".
   */
  async function lookupCredited() {
    const listening = status?.address;
    if (!solo() || !listening || status?.linked || !deps.mainOf || creditedLooking) return;
    if (creditedRes && creditedRes.for === listening && (creditedRes.ok || deps.now() - creditedRes.at < 60_000)) return;
    creditedLooking = true;
    try { creditedRes = { for: listening, main: await deps.mainOf(listening), ok: true, at: deps.now() }; }
    catch { creditedRes = { for: listening, main: null, ok: false, at: deps.now() }; }
    finally { creditedLooking = false; }
  }

  /**
   * Whether an empty wallet has ever been used: its confirmed nonce is 0 only if it never sent anything, and a
   * balance of 0 then means it never held anything either. Read once per wallet; a failed read is retried later.
   */
  async function lookupUnused() {
    const listening = status?.address;
    if (!listening || status?.state !== 'unlocked' || balance !== 0n || unusedRes?.for === listening) return;
    if (deps.store.get(key('created', listening)) === '1') return; // made here: already known to be new
    try { unusedRes = { for: listening, unused: (await deps.chain.confirmedNonce(listening)) === 0n }; }
    catch { /* unknown: not brand-new for now; tried again on the next refresh */ }
  }

  async function reconcile(): Promise<boolean> {
    const listening = status?.address;
    if (!listening) return false;
    let confirmed: bigint | undefined;
    let landed = false;
    const nonces = new Map<string, bigint>();
    for (const e of unresolvedAll()) {
      try {
        const tx = await deps.chain.transaction(e.txid!);
        if (!tx) {
          notSeen.add(e.txid!);
          // A different transaction already used this nonce: ours can never confirm.
          // Only after 15 minutes: the node's nonce can run ahead of the transaction index for a while.
          if (deps.now() - e.created > 15 * 60_000 && !nonces.has(e.address)) nonces.set(e.address, await deps.chain.confirmedNonce(e.address));
          confirmed = nonces.get(e.address);
          if (confirmed !== undefined && confirmed > BigInt(e.nonce)) { saveEntry({ ...e, status: 'failed', note: 'nonce used by another transaction', raw: undefined }); continue; }
          // Never broadcast, or outcome unknown: resend the SAME signed bytes (idempotent), never a replacement.
          if ((e.status === 'unknown' || e.status === 'signed') && e.raw) {
            try { await deps.chain.broadcast(e.raw, e.txid!); saveEntry({ ...e, status: 'pending' }); }
            catch (err) { if (definitelyRejected(err)) saveEntry({ ...e, status: 'failed', note: (err as Error).message, raw: undefined }); }
          }
          continue;
        }
        notSeen.delete(e.txid!);
        const s = String(tx.tx_status);
        if (s === 'success' && tx.canonical !== false && tx.is_unanchored === false) {
          saveEntry({ ...e, status: 'confirmed', confirmedAt: deps.now(), actualFee: String(tx.fee_rate ?? e.fee), raw: undefined });
          landed = true;
          if (e.kind === 'like') {
            likesConfirmed = true;
            if (e.status !== 'confirmed' && typeof e.liked === 'boolean') try { deps.likeConfirmed?.(e.song, e.liked); } catch { /* radio */ }
          }
        } else if (s.startsWith('abort_') || s.startsWith('dropped_')) {
          saveEntry({ ...e, status: 'failed', note: s, raw: undefined });
        } else if (e.status !== 'pending') saveEntry({ ...e, status: 'pending' });
      } catch { /* try again on the next refresh */ }
    }
    for (const at of albumOpen() ? [listening, likeAddr()!] : [listening]) {
      const d = pendingDepositOf(at);
      if (!d) continue;
      try {
        const tx = await deps.chain.transaction(d.txid);
        const s = String(tx?.tx_status ?? '');
        if ((s === 'success' && tx.is_unanchored === false) || s.startsWith('abort_') || s.startsWith('dropped_') || (!tx && deps.now() - d.at > 2 * 3600_000)) {
          setPendingDeposit(null, at);
          balanceAt = -Infinity;
          rootBalance = null;
          // "Gift on its way" / "deposit on its way" is over: say nothing rather than leave it up while paying.
          if (/on its way/i.test(message)) message = '';
        }
      } catch { /* keep waiting */ }
    }
    return landed;
  }

  async function refresh(force = false) {
    try {
      const main = deps.main();
      // The kill switch and allowlist are re-read at least every 5 minutes, and on every action.
      if (force || !gate || gateFor !== main || deps.now() - gateAt > 300_000) { gate = await deps.config(main); gateAt = deps.now(); gateFor = main; }
      if (!gate.enabled || !gate.here || (!solo() && (!main || !gate.allowed))) {
        if (bridge && status?.session) await bridge.request('listening.stop').catch(() => undefined);
        if (armed) void disarm();
        deps.changed();
        return;
      }
      await ensureBridge();
      status = await readStatus(bridge!);
      if (mismatch() && status.state === 'unlocked') {
        // Another wallet was connected while this listener was unlocked (it is not that wallet's): lock it again.
        forgetQueue();
        await bridge!.request('listening.lock').catch(() => undefined);
        balance = undefined;
        status = await readStatus(bridge!);
      }
      if (main && gate.allowed) await lookupServerLink(main);
      await refreshBalance(force);
      await lookupFunder();
      await lookupCredited();
      await lookupUnused();
      await lookupGift();
      await lookupUnlock();
      // A payment that has just landed has changed the balance: read it again now, so plays-left is exact.
      if (await reconcile()) await refreshBalance(true);
      await refreshRootBalance(); // a confirmed top-up clears the cached one: read it again now
    } catch (e) {
      error = e instanceof Error ? e.message : 'Pay-per-play could not refresh. Listening stays free.';
    }
    if (step() === 'locked') arm();
    else if (armed) void disarm();
    if (likesConfirmed) { likesConfirmed = false; try { deps.likesChanged?.(); } catch { /* the radio re-reads on its own schedule */ } }
    deps.changed();
    // A confirmation may have freed the wallet for songs waiting to be paid.
    if (queue.length && !draining) void drain();
  }

  /** The album that was open when this wallet was last used on this device opens again after an unlock (best effort). */
  async function reopenAlbum(b: Bridge) {
    const root = status?.root;
    if (!root || status?.slot || walletLacks('slots')) return;
    const n = Number(deps.store.get(key('slot', root)));
    if (!Number.isSafeInteger(n) || n < 1) return;
    try { await b.request<OpenSlotResult>('listening.openSlot', { slot: n }); status = await readStatus(b); balance = undefined; balanceAt = -Infinity; }
    catch { /* stays on the listener's own wallet */ }
  }

  /** Unlock inside the frame, resuming paying unless this device switched it off. */
  async function unlockWith(b: Bridge, anyPasskey: boolean) {
    guardMatch();
    const resume = !status?.address || payingOn(status.address);
    const label = status?.linked ? deps.nameOf?.(status.linked) : undefined;
    await b.request('listening.unlock', { mode: 'unlock', terms: resume ? onTerms() : undefined, anyPasskey, ...(deps.main() ? { main: deps.main() } : {}), ...(label ? { label } : {}) });
    status = await readStatus(b);
    if (resume) {
      // Picked a different wallet that this device has switched off: honour that.
      if (!payingOn(status.address)) await b.request('listening.stop');
      else await holdTab();
    }
    await reopenAlbum(b);
    say(resume ? 'Unlocked ✓' : 'Unlocked ✓ Paying is off.');
    const queued = likeAfterUnlock;
    likeAfterUnlock = null;
    if (queued && deps.now() - queued.at < 120_000) setTimeout(() => void refresh(true).then(() => toggleLike(queued)), 0);
  }

  /**
   * A locked wallet opens its unlock confirm in the frame straight away (with the paying terms when
   * paying is switched on),
   * so one tap there goes directly to the passkey. Still the listener's own tap, inside the frame.
   */
  function arm() {
    if (armed || busy || armOff || armFailures >= 3 || !bridge || !status?.address) return;
    armed = true;
    armDone = (async () => {
      try { await unlockWith(bridge!, false); armFailures = 0; }
      catch (e) {
        const m = e instanceof Error ? e.message : String(e);
        if (/Cancelled in the listening wallet/.test(m)) {
          if (!afterArm) { armOff = true; say('Not now. Nothing was signed.'); }
        } else if (/did not answer/.test(m)) {
          // The page stopped waiting (30 minutes): withdraw the panel and show a fresh one.
          await bridge?.request('listening.cancel').catch(() => undefined);
        } else {
          armFailures++;
          error = m;
        }
      } finally {
        armed = false;
        const next = afterArm;
        afterArm = null;
        if (next) await next();
        else await refresh(true);
      }
    })();
  }

  /** Withdraw a waiting unlock panel, then run `then`. A panel already confirmed finishes first. */
  async function disarm(then?: () => Promise<void>) {
    if (armed) {
      afterArm = async () => {}; // leaving on purpose: no refresh, no re-arm, no "Cancelled" message
      await bridge?.request('listening.cancel').catch(() => undefined);
      await armDone;
    }
    if (then) await then();
    deps.changed();
  }

  /**
   * "Pay as I listen until I switch it off": up to 1 STX of plays per approval. The wallet still
   * refuses any play the balance cannot cover (songs then play free until a top-up), and the
   * session ends when the page closes; the next visit resumes with one passkey tap.
   */
  const onTerms = (): TermsParams => ({
    fee: fee().toString(),
    maxPlays: gate!.limits.maxSessionPlays,
    budget: TARGET.toString(),
    expires: deps.now() + gate!.limits.sessionHours * 3600_000
  });

  async function holdTab() {
    if (!status?.address) return false;
    lockHeld ||= await deps.tabLock(status.address);
    if (!lockHeld) {
      await bridge?.request('listening.stop').catch(() => undefined);
      throw new Error('Pay-per-play is already running in another tab. This tab plays free.');
    }
    return true;
  }

  /**
   * Ask the listening wallet to sign one return and send it. The page checks what came back against what it asked
   * for (destination and exact amount) before anything is broadcast, so a wallet box that signed something else
   * is caught here, not on-chain.
   */
  async function sendReturn(p: { mode: ReturnMode; to: string; linked: boolean; amount?: bigint }, acct?: { balance: bigint; nonce: bigint }) {
    const listening = status!.address!;
    const { balance: b, nonce } = acct ?? await deps.chain.account(listening);
    balance = b;
    const r = await bridge!.request<ReturnResult>('listening.prepareReturn', {
      mode: p.mode, balance: b.toString(), nonce: nonce.toString(), fee: DEFAULT_RETURN_FEE.toString(),
      ...(p.amount !== undefined ? { amount: p.amount.toString() } : {}),
      ...(p.linked ? {} : { destination: p.to })
    });
    if (r.recipient !== p.to) throw new Error('Return destination does not match what you approved. Nothing was sent.');
    const expected = p.mode === 'amount' ? p.amount : p.mode === 'all' ? b - DEFAULT_RETURN_FEE : b - TARGET - DEFAULT_RETURN_FEE;
    const tx = deserializeTransaction(r.raw) as any;
    if (cvToJSON(tx.payload.recipient).value !== p.to || String(tx.payload.amount) !== r.amount || (expected !== undefined && r.amount !== expected.toString()))
      throw new Error('Signed return does not match what you approved. Nothing was sent.');
    const entry: Entry = {
      id: randomId(), address: listening, kind: 'withdraw', core: 0, song: 0, recipient: r.recipient, amount: r.amount,
      fee: r.fee, nonce: nonce.toString(), created: deps.now(), status: 'signed', raw: r.raw, txid: r.txid
    };
    deps.validate(entry);
    saveEntry(entry);
    try { await deps.chain.broadcast(r.raw, r.txid); saveEntry({ ...entry, status: 'pending' }); }
    catch (e) { saveEntry({ ...entry, status: 'unknown', note: (e as Error).message }); throw e; }
    return r;
  }

  /**
   * A gifted wallet gives each part of its balance back to whoever it came from: the unused gift to the gifter (or
   * the treasury), a listener's own top-up to the listener who sent it. The first call works the split out and shows
   * it; the next one, with the same balance, returns the first part. Each part is its own transaction (one at a time).
   */
  async function returnByLedger(mode: ReturnMode) {
    if (unresolved().length) throw new Error('Wait for the pending payment to confirm, then return funds.');
    if (walletLacks('standalone')) throw new Error('The listening wallet box needs an update before it can return to another address. Try again shortly.');
    const led = await readLedger().catch(() => null);
    if (!led) {
      preview = null; previewFailed = true;
      throw new Error('Could not check where the funds came from right now. Nothing was sent. Try again shortly.');
    }
    previewFailed = false;
    balance = led.balance;
    const acct = { balance: led.balance, nonce: led.nonce };
    if (mode === 'excess') {
      const to = excessTarget(led.parts) ?? chosenAddress();
      if (!to) throw new Error('Choose where to send the excess first.');
      await sendReturn({ mode: 'excess', to, linked: false }, acct);
      preview = null;
      say('Excess returned ✓ Switch paying back on to continue.');
      return;
    }
    const steps = led.steps;
    if (!steps.length) throw new Error('What is left is too small to return: the network fee would take all of it.');
    const same = !!preview && preview.balance === led.balance && deps.now() - preview.at <= PREVIEW_MS
      && preview.steps.length === steps.length && preview.steps.every((x, i) => x.to === steps[i].to && x.mode === steps[i].mode && x.send === steps[i].send);
    if (!same) {
      preview = {
        at: deps.now(), balance: led.balance, steps, parts: led.parts,
        plan: { state: 'ready', steps: steps.map((x) => ({ to: x.to, kind: x.kind, send: x.send.toString() })), kept: led.tooSmall, excess: excessTarget(led.parts) }
      };
      say(steps.length > 1 ? `This goes back in ${steps.length} parts, each to whoever it came from. Check below, then confirm.` : 'Check where it goes, then confirm.');
      return;
    }
    const step = steps[0];
    const to = step.to ?? chosenAddress();
    if (!to) throw new Error('Choose where to send the rest first.');
    if (step.mode === 'amount' && walletLacks('partial')) throw new Error('The listening wallet box needs an update before it can return in parts. Try again shortly.');
    await sendReturn({ mode: step.mode, to, linked: false, ...(step.mode === 'amount' ? { amount: step.send } : {}) }, acct);
    preview = null;
    if (steps.length === 1) { setPayingOn(false); say('Returned ✓ Paying is off.'); }
    else say(`Returned ✓ ${steps.length - 1} more ${steps.length === 2 ? 'part' : 'parts'} to go. Return again once this one confirms.`);
  }

  const actions = {
    forceRefresh: () => refresh(true),

    create: () => task('Waiting for your passkey…', async () => {
      const b = await ensureBridge();
      await b.request('listening.unlock', { mode: 'create', terms: onTerms(), ...(deps.main() ? { main: deps.main() } : {}) });
      status = await readStatus(b);
      if (status.address) deps.store.set(key('created', status.address), '1');
      setPayingOn(true);
      say(solo() ? 'Wallet created ✓ Next: add 1 STX.' : 'Wallet created ✓ Next: link it.');
      await holdTab();
    }),

    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (txid: string, amount: bigint) => {
      if (!status?.address || pendingDeposit()) return;
      setPendingDeposit({ txid, amount: amount.toString(), at: deps.now() });
      balanceAt = -Infinity;
      giftRes = null; // the record now exists: ask for it (and the album that came with it) on the next refresh
      say('🎁 Gift on its way ✓ Usually arrives in a few minutes.');
    },

    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (slot: number): Promise<BindSlotResult> => {
      guardMatch();
      if (status?.state !== 'unlocked') throw new Error('Unlock the listening wallet first.');
      if (walletLacks('slots')) throw new Error('The listening wallet box needs an update before it can hold albums. Try again shortly.');
      return (await ensureBridge()).request<BindSlotResult>('listening.bindSlot', { slot, issued: deps.now() });
    },

    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (slot: number, address: string, txid: string, amount: bigint) => {
      setPendingDeposit({ txid, amount: amount.toString(), at: deps.now() }, address);
      giftRes = null;
      await actions.openAlbum(slot);
      say('🎁 Album on its way ✓ Usually arrives in a few minutes.');
    },

    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (slot: number): Promise<void> => task('Opening…', async () => {
      guardMatch();
      if (status?.state !== 'unlocked') throw new Error('Unlock the listening wallet first.');
      if (walletLacks('slots')) throw new Error('The listening wallet box needs an update before it can open albums. Try again shortly.');
      if (paying || liking || checkingLike) throw new Error('Still sending a payment. Open the album again in a moment.');
      if ((status.slot ?? 0) === slot) return;
      forgetQueue();
      await bridge!.request<OpenSlotResult>('listening.openSlot', { slot });
      status = await readStatus(bridge!);
      balance = undefined; balanceAt = -Infinity; preview = null; previewFailed = false;
      const root = status.root;
      if (root) deps.store.set(key('slot', root), String(slot));
      say(slot === 0 ? 'Back to your own wallet ✓' : 'Album opened ✓');
    }),

    unlock: (anyPasskey = false): Promise<void> => {
      const run = () => task('Waiting for your passkey…', async () => unlockWith(await ensureBridge(), anyPasskey));
      if (!armed) return run();
      if (!anyPasskey) return armDone; // the same unlock is already waiting in the frame
      if (walletLacks('cancel')) { say('Tap Cancel in the listening wallet box first, then choose a different wallet.'); return Promise.resolve(); }
      // A different wallet: withdraw the waiting panel, then ask for any listening-wallet passkey.
      return disarm(async () => { if (step() === 'locked' || step() === 'intro') await run(); });
    },

    link: () => task('Sign in your wallet…', async () => {
      guardMatch();
      const main = deps.main();
      if (!main || !status?.address) throw new Error('Connect your main wallet first.');
      const saved = (await deps.links(main)).find((l) => l.listening === status!.address);
      if (saved) {
        // Linked before (another device): no new signature popup, but the frame still asks to confirm.
        await bridge!.request('listening.link', { main, issued: saved.issued, mainSignature: saved.mainSignature });
      } else {
        const link: LinkRequest = { main, listening: status.address, issued: deps.now() };
        const mainSignature = await deps.signWithMain(main, linkData(link));
        const r = await bridge!.request<{ listeningSignature: string }>('listening.link', { main, issued: link.issued, mainSignature });
        await deps.saveLink({ ...link, mainSignature, listeningSignature: r.listeningSignature });
        mainLinksAt = -Infinity;
      }
      say('Linked ✓');
    }),

    deposit: () => task('Approve the deposit in your wallet…', async () => {
      guardMatch();
      const main = deps.main();
      if (!main || !status?.address) throw new Error('Connect your main wallet first.');
      if (pendingDeposit()) throw new Error('A deposit is still confirming. Wait for it before adding more.');
      await refreshBalance(true);
      const amount = fundingAllowance(balance ?? 0n);
      if (amount <= 0n) throw new Error('This wallet already holds 1 STX. No deposit needed.');
      depositTxid = await deps.deposit(main, status.address, amount);
      if (depositTxid) setPendingDeposit({ txid: depositTxid, amount: amount.toString(), at: deps.now() });
      say('Deposit sent ✓ Usually confirms in a few minutes.');
    }),

    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => task('Approve the top-up in your wallet…', async () => {
      guardMatch();
      const main = deps.main(), to = likeAddr();
      if (!main || !to) throw new Error('Connect your main wallet first, or send STX to the address shown.');
      if (pendingDepositOf(to)) throw new Error('A top-up is still confirming. Wait for it before adding more.');
      const current = await deps.chain.balance(to);
      if (albumOpen()) rootBalance = { for: to, value: current, at: deps.now() }; else { balance = current; balanceAt = deps.now(); }
      const amount = fundingAllowance(current);
      if (amount <= 0n) throw new Error('Your main listener wallet already holds 1 STX. No top-up needed.');
      const txid = await deps.deposit(main, to, amount);
      if (txid) setPendingDeposit({ txid, amount: amount.toString(), at: deps.now() }, to);
      say('Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.');
    }),

    switchOn: () => task('Confirm in the listening wallet…', async () => {
      if (!usable()) throw new Error('Connect your wallet first.');
      await holdTab();
      await bridge!.request('listening.approveSession', onTerms());
      setPayingOn(true);
      say('Paying is on ✓');
    }),

    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => task('Clearing…', async () => {
      for (const e of stuck()) {
        if (await deps.chain.transaction(e.txid!)) continue;
        saveEntry({ ...e, status: 'failed', note: 'never seen on-chain; cleared by listener', raw: undefined });
      }
      say('Cleared ✓');
    }),

    switchOff: () => task('Switching off…', async () => {
      forgetQueue();
      await bridge?.request('listening.stop');
      setPayingOn(false);
      say('Paying is off. Music stays free.');
    }),

    lock: () => task('Locking…', async () => {
      forgetQueue();
      await bridge?.request('listening.lock');
      balance = undefined;
      say('Locked ✓');
    }),

    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (address: string) => {
      const a = String(address ?? '').trim();
      if (!status?.address) return say('', 'Unlock the listening wallet first.');
      if (!isMainnetStandardAddress(a)) return say('', 'Enter a standard mainnet address (it starts with SP).');
      if (a === status.address) return say('', 'That is this listening wallet itself. Enter a different address.');
      deps.store.set(chosenKey(status.address), a);
      say('Returns will go to that address. You confirm it in the listening wallet before anything is sent.');
    },
    clearReturnAddress: () => {
      if (status?.address) deps.store.set(chosenKey(status.address), '');
      deps.changed();
    },

    returnFunds: (mode: ReturnMode) => task('Check the return in the listening wallet…', async () => {
      if (!usable()) throw new Error('Connect your wallet first.');
      if (!status?.address) throw new Error('Unlock the listening wallet first.');
      // A gifted wallet splits its balance by where each part came from (the gift, and each top-up).
      if (ledgerReturns()) return returnByLedger(mode);
      // A linked main wallet always wins; otherwise the destination is the one the listener chose
      // or the funder found on chain. The frame shows the full address and the listener confirms it.
      const target = returnTarget();
      if (!target) throw new Error(solo() ? 'Choose where to send the funds first.' : 'Link your main wallet first.');
      if (target.kind !== 'linked' && walletLacks('standalone')) throw new Error('The listening wallet box needs an update before it can return to another address. Try again shortly.');
      if (unresolved().length) throw new Error('Wait for the pending payment to confirm, then return funds.');
      await sendReturn({ mode, to: target.to, linked: target.kind === 'linked' });
      if (mode === 'all') setPayingOn(false);
      say(mode === 'all'
        ? (target.kind === 'linked' ? 'Returned to your wallet ✓ Paying is off.' : 'Returned ✓ Paying is off.')
        : 'Excess returned ✓ Switch paying back on to continue.');
    })
  };

  /**
   * A song heard for 30 seconds (half of a shorter song) is a play, and a play gets paid. It is queued the
   * moment it is heard and paid as soon as the wallet is free: only one transaction can be in flight per
   * wallet (nonces), so a like, a return or an earlier play still confirming used to make a play that
   * crossed 30 seconds at that moment go unpaid. Never throws and never affects playback.
   */
  type Heard = { song: number; id: string; title?: string; artist?: string; at: number };
  const queue: Heard[] = [];
  const QUEUE_MAX = 10;
  const QUEUE_TTL_MS = 30 * 60_000;
  let draining = false;
  const walletBusy = () => paying || !!busy || liking || checkingLike;
  const forgetQueue = () => { if (queue.length) { queue.length = 0; deps.changed(); } };

  async function onListened(detail: { song: number; id: string; title?: string; artist?: string }) {
    if (!queue.some((q) => q.id === detail.id) && !entries().some((e) => e.id === detail.id)) {
      queue.push({ ...detail, at: deps.now() });
      if (queue.length > QUEUE_MAX) queue.shift(); // oldest first: a long backlog is not worth paying hours later
    }
    if (walletBusy() || unresolved().length) {
      const n = queue.length;
      message = `Queued ${n === 1 ? 'this song' : n + ' songs'}: paid as soon as the wallet is free.`;
      deps.changed();
    }
    await drain();
  }

  /** Pay queued songs one at a time, oldest first. Called when a play is heard and whenever the wallet frees up. */
  async function drain() {
    if (draining) return;
    draining = true;
    try {
      while (queue.length) {
        while (queue.length && deps.now() - queue[0].at > QUEUE_TTL_MS) queue.shift(); // too old: that listen plays free
        if (!queue.length || walletBusy()) return; // the blocker calls drain() again when it finishes
        const outcome = await payOne(queue[0]);
        if (outcome === 'wait') return; // retried after the earlier transaction confirms (refresh)
        queue.shift();
      }
    } finally { draining = false; deps.changed(); }
  }

  /** 'wait' keeps the song queued; 'done' drops it (paid, or not payable now: it plays free). */
  async function payOne(detail: Heard): Promise<'wait' | 'done'> {
    paying = true;
    try {
      // Background tabs barely run timers: catch up on confirmations and the kill switch here.
      await refresh();
      const s = step();
      if (s === 'loading') return 'wait';
      if (s !== 'ready' || !payingOn() || !status?.session || status.session.playsLeft < 1 || !lockHeld) return 'done';
      if (unresolved().length) return 'wait'; // one transaction in flight per wallet
      if (!verified) { await deps.chain.verify(); verified = true; }
      const listening = status.address!;
      const { balance: b, nonce } = await deps.chain.account(listening);
      balance = b; balanceAt = deps.now();
      const recipient = await deps.chain.owner(RADIO_CORE_INDEX, detail.song);
      if (recipient === listening || recipient === deps.main()) return 'done'; // you hold this song: plays free
      const signed = await bridge!.request<SignedResult>('listening.signPlay', {
        core: RADIO_CORE_INDEX, song: detail.song, receipt: detail.id, fee: fee().toString(), nonce: nonce.toString(), balance: b.toString()
      });
      const entry: Entry = {
        id: detail.id, address: listening, kind: 'play', core: RADIO_CORE_INDEX, song: detail.song, recipient, amount: '50',
        fee: fee().toString(), nonce: nonce.toString(), created: deps.now(), status: 'signed', raw: signed.raw, txid: signed.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...(detail.title ? { title: String(detail.title).slice(0, 120) } : {}),
        ...(detail.artist ? { artist: String(detail.artist).slice(0, 120) } : {})
      } as Entry;
      deps.validate(entry);
      saveEntry(entry);
      const label = detail.title ? `“${detail.title}”${detail.artist ? ` by ${detail.artist}` : ''}` : `song #${detail.song}`;
      try { await deps.chain.broadcast(signed.raw, signed.txid); saveEntry({ ...entry, status: 'pending' }); message = `♪ Paid ${label}`; error = ''; }
      catch (e) {
        saveEntry({ ...entry, status: definitelyRejected(e) ? 'failed' : 'unknown', note: (e as Error).message, ...(definitelyRejected(e) ? { raw: undefined } : {}) });
        error = (e as Error).message;
      }
      status = await readStatus(bridge!);
      return 'done';
    } catch (e) {
      const why = e instanceof Error ? e.message : 'payment unavailable';
      // A gift player has no free mode: the song stays queued (and counts against the plays) and is tried again.
      if (giftNow()?.player) { message = 'Payment is taking a moment: ' + why; return 'wait'; }
      message = 'This song played free: ' + why;
      return 'done';
    } finally {
      paying = false;
      deps.changed();
    }
  }

  /**
   * The radio's heart on the pay-per-play radio: once a listener has a listening wallet, every tap
   * toggles the like from it, straight on the likes contract (0.0002 STX). It never opens the
   * main-wallet page; anything missing (locked, not linked, no funds) is said in the panel instead.
   */
  function heart(d: { song: number; title?: string; artist?: string; likedBy?: string[] }): boolean {
    if (!gate?.here || !['ready', 'fund', 'over', 'locked', 'link', 'loading'].includes(step())) return false;
    if (walletLacks('like')) return false; // an older wallet box cannot sign likes: the main wallet does it
    void toggleLike(d);
    return true;
  }

  async function toggleLike(d: { song: number; title?: string; artist?: string; likedBy?: string[] }) {
    const label = d.title ? `“${d.title}”` : `song #${d.song}`;
    const fail = (m: string) => { error = m; message = ''; try { deps.likeFailed?.(d.song); } catch { /* radio */ } deps.changed(); };
    // Likes are signed by the passkey's own wallet. While an album wallet is open its funds and plays are its own business:
    // only the main listener wallet's funds matter for a like.
    const album = albumOpen();
    const s0 = step(), main = deps.main();
    const s = album && (s0 === 'fund' || s0 === 'over') ? 'ready' : s0;
    // Passkey-only: the listening address itself is the liker.
    const who = solo() ? likeAddr() : main;
    if (s === 'locked') {
      likeAfterUnlock = { ...d, at: deps.now() };
      say(`Unlock to like ${label}. It sends straight after.`);
      return;
    }
    if (s === 'wrong-wallet') return fail(wrongWalletMessage());
    if (s === 'link') return fail('Link the listening wallet to your main wallet first, so your likes count for it.');
    if (solo() && walletLacks('standalone')) return fail('The listening wallet box needs an update before it can like on its own. Try again shortly.');
    if (s === 'fund') return fail('Top up the listening wallet to like: each like or unlike costs 0.0002 STX.');
    if (s === 'over') return fail('Return the excess first: the listening wallet holds more than 1 STX.');
    if (album) {
      await refreshRootBalance(true);
      const b = likeBalance();
      if (likeLow(b)) { deps.changed(); return fail(OUT_OF_LIKES); }
    }
    if (s !== 'ready' || !who) return fail('Still checking the listening wallet. Try the heart again in a moment.');
    if (!status?.session) return fail('Paying is switched off. Switch it on to like from the listening wallet.');
    if (!lockHeld) return fail('Pay-per-play is running in another tab. Like from that tab.');
    // One like per song at a time: locked until the last one confirms, then 3 more seconds, so a
    // like cannot be toggled on and off in quick succession (each costs a network fee).
    const previous = entries(likeAddr()).find((e) => e.kind === 'like' && e.song === d.song);
    if (previous && UNRESOLVED.includes(previous.status))
      return fail(`Your last like for ${label} is still on its way. It can change again once it confirms.`);
    if (liking) return fail('One like at a time: your last one is still being sent.');
    if (previous?.status === 'confirmed' && deps.now() - (previous.confirmedAt ?? 0) < LIKE_COOLDOWN_MS)
      return fail(`Your like for ${label} has only just confirmed. Try again in a moment.`);
    // Read the song's current state (it may have changed on another device), so the tap toggles it.
    let by: string[] | undefined;
    checkingLike = true;
    try { by = deps.likeState ? (await deps.likeState(who, d.song)).by : d.likedBy ?? []; }
    catch { by = d.likedBy; }
    finally { checkingLike = false; } // like() below takes over synchronously, before any await
    if (!by) return fail(`Could not check ${label} right now. Try the heart again.`);
    const listening = likeAddr()!;
    // The likes list can lag a few minutes behind a like this wallet has already seen confirm: trust our own
    // recent confirmed like or unlike of this song over a stale read, so the next tap goes the right way.
    const lastSure = previous?.status === 'confirmed' && typeof previous.liked === 'boolean' && deps.now() - (previous.confirmedAt ?? previous.created) < 5 * 60_000 ? previous.liked : undefined;
    const mine = lastSure ?? by.includes(listening);
    if (!mine && by.some((a) => a !== listening)) return fail(solo()
      ? `${label} was liked from another wallet of yours. Unlike it there.`
      : `${label} was liked from your main wallet${by.includes(main!) ? '' : ' or another listening wallet'}. Unlike it there (♥ ON-CHAIN).`);
    await like({ song: d.song, liked: !mine, title: d.title, artist: d.artist });
  }

  /** Sign and send a like/unlike from the listening wallet. Never throws. */
  async function like(d: { song: number; liked: boolean; title?: string; artist?: string }) {
    if (liking) { say('Still sending your last like. Try again in a moment.'); return; }
    liking = true;
    const label = d.title ? `“${d.title}”${d.artist ? ` by ${d.artist}` : ''}` : `song #${d.song}`;
    const wait = deps.wait ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
    try {
      say(`${d.liked ? 'Liking' : 'Unliking'} ${label}…`);
      // One transaction in flight per wallet (nonces): wait up to 2 minutes for an earlier one to confirm.
      const until = deps.now() + 120_000;
      while (paying || (albumOpen() ? entries(likeAddr()).some((e) => UNRESOLVED.includes(e.status)) : unresolved().length)) {
        if (deps.now() > until) throw new Error('An earlier payment is still confirming. Try the like again shortly.');
        await wait(5_000);
        await refresh(true);
      }
      if ((!albumOpen() && step() !== 'ready') || status?.state !== 'unlocked' || !status.session) throw new Error('Paying stopped before the like was sent.');
      const listening = likeAddr()!;
      const { balance: b, nonce } = await deps.chain.account(listening);
      if (albumOpen()) rootBalance = { for: listening, value: b, at: deps.now() };
      else { balance = b; balanceAt = deps.now(); }
      if (likeLow(b)) throw new Error(OUT_OF_LIKES);
      const signed = await bridge!.request<SignedResult>('listening.signLike', {
        song: d.song, liked: d.liked, fee: LIKE_FEE.toString(), nonce: nonce.toString(), balance: b.toString()
      });
      const entry = {
        id: randomId(), address: listening, kind: 'like', core: 0, song: d.song, liked: d.liked, recipient: '', amount: '0',
        fee: LIKE_FEE.toString(), nonce: nonce.toString(), created: deps.now(), status: 'signed', raw: signed.raw, txid: signed.txid,
        ...(d.title ? { title: String(d.title).slice(0, 120) } : {}),
        ...(d.artist ? { artist: String(d.artist).slice(0, 120) } : {})
      } as Entry;
      deps.validate(entry);
      saveEntry(entry);
      try {
        await deps.chain.broadcast(signed.raw, signed.txid);
        saveEntry({ ...entry, status: 'pending' });
        message = `${d.liked ? '♥ Liked' : 'Unliked'} ${label}`;
        error = '';
        try { deps.likeSent?.(d.song, d.liked); } catch { /* radio */ }
      } catch (e) {
        saveEntry({ ...entry, status: definitelyRejected(e) ? 'failed' : 'unknown', note: (e as Error).message, ...(definitelyRejected(e) ? { raw: undefined } : {}) });
        error = (e as Error).message;
        if (definitelyRejected(e)) try { deps.likeFailed?.(d.song); } catch { /* radio */ }
      }
      status = await readStatus(bridge!);
    } catch (e) {
      error = 'Like not sent: ' + (e instanceof Error ? e.message : 'the listening wallet is unavailable');
      try { deps.likeFailed?.(d.song); } catch { /* radio */ }
    } finally {
      liking = false;
      deps.changed();
      void drain(); // a play that crossed 30 seconds while this like was signing is paid next
    }
  }

  return { snapshot, refresh, onListened, heart, toggleLike, ...actions };
}
