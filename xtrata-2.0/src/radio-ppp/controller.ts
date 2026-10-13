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
import type { FunderResult } from '../lib/listening-wallet/funder';
import {
  balanceState, costPerPlay, DEFAULT_PLAY_FEE, DEFAULT_RETURN_FEE, fundingAllowance, LIKE_FEE, playsCovered, RESERVE, TARGET,
  type BalanceState, type ReturnMode
} from '../lib/listening-wallet/policy';
import { RADIO_CORE_INDEX } from '../lib/listening-wallet/tx';
import type { ReturnResult, SessionSummary, SignedResult, StatusResult, TermsParams } from '../lib/listening-wallet/messages';
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
  /** The song's on-chain like state for the main wallet, including linked listening wallets (`by`). */
  likeState?(main: string, song: number): Promise<{ liked: boolean; by: string[] }>;
  /** A like/unlike from the listening wallet was sent, or could not be: the radio's heart follows. */
  likeSent?(song: number, liked: boolean): void;
  likeFailed?(song: number): void;
  /** Pause between checks while a like waits for an earlier transaction (tests pass a fake). */
  wait?(ms: number): Promise<void>;
}

export type Step =
  | 'off' | 'elsewhere' | 'connect' | 'not-invited' | 'unsupported' | 'intro' | 'locked' | 'link' | 'loading'
  | 'fund' | 'over' | 'ready';

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
}

const UNRESOLVED: Entry['status'][] = ['prepared', 'signed', 'unknown', 'pending'];
const STUCK_AFTER_MS = 30 * 60_000;

/** The node refused the transaction outright, so it never entered the mempool and its nonce is unused. */
export const definitelyRejected = (e: unknown) => {
  const err = e as { feeRejected?: boolean; message?: string };
  return err?.feeRejected === true || /\(400\)/.test(err?.message ?? '');
};
/** After a like or unlike confirms, the same song's heart stays locked this long. */
export const LIKE_COOLDOWN_MS = 3_000;
const randomId = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');

export function createPppController(deps: PppDeps) {
  let gate: GateConfig | null = null;
  let gateAt = -Infinity;
  let gateFor: string | undefined;
  let bridge: Bridge | null = null;
  let status: StatusResult | null = null;
  let balance: bigint | undefined;
  let balanceAt = -Infinity;
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
  type PendingDeposit = { txid: string; amount: string; at: number };
  const pendingDeposit = (): PendingDeposit | null => {
    if (!status?.address) return null;
    try { return JSON.parse(deps.store.get(key('deposit', status.address)) || 'null'); } catch { return null; }
  };
  const setPendingDeposit = (d: PendingDeposit | null) => { if (status?.address) deps.store.set(key('deposit', status.address), JSON.stringify(d)); };
  const stuck = () => unresolved().filter((e) => deps.now() - e.created > STUCK_AFTER_MS && notSeen.has(e.txid!));

  /**
   * Passkey-only: the listener has no main wallet in play (none connected, or one that is not
   * invited) and the deployment allows it. A connected, invited main wallet keeps the linked flow.
   */
  // `gateFor` must be the current main: a gate fetched for a previous wallet says nothing about this one.
  const solo = () => gate?.passkeyOnly === true && (!deps.main() || (gateFor === deps.main() && !gate.allowed));
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
    solo: solo(), returnTo: returnTarget()?.to, returnToKind: returnTarget()?.kind,
    funderState: (() => { const f = funderFor(); return !f ? 'unknown' : !f.ok ? 'failed' : f.funder ? 'found' : 'none'; })(),
    funderMultiple: (() => { const f = funderFor(); return !!f && f.ok && f.distinct > 1; })(),
    walletCannotSolo: solo() && walletLacks('standalone')
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
  const usable = () => !!gate?.enabled && gate.here && (solo() || (!!deps.main() && gate.allowed));

  async function ensureBridge() {
    if (!usable()) throw new Error('Pay-per-play is not open to this wallet yet. Listening stays free.');
    if (!gate?.walletOrigin) throw new Error('Pay-per-play is switched off right now. Listening stays free.');
    bridge ??= await deps.bridge(gate.walletOrigin);
    return bridge;
  }

  async function refreshBalance(force = false) {
    if (!status?.address) return;
    if (!force && deps.now() - balanceAt < 30_000) return;
    balance = await deps.chain.balance(status.address);
    balanceAt = deps.now();
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

  async function reconcile() {
    const listening = status?.address;
    if (!listening) return;
    let confirmed: bigint | undefined;
    for (const e of unresolved()) {
      try {
        const tx = await deps.chain.transaction(e.txid!);
        if (!tx) {
          notSeen.add(e.txid!);
          // A different transaction already used this nonce: ours can never confirm.
          // Only after 15 minutes: the node's nonce can run ahead of the transaction index for a while.
          if (deps.now() - e.created > 15 * 60_000) confirmed ??= await deps.chain.confirmedNonce(listening);
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
          if (e.kind === 'like') likesConfirmed = true;
        } else if (s.startsWith('abort_') || s.startsWith('dropped_')) {
          saveEntry({ ...e, status: 'failed', note: s, raw: undefined });
        } else if (e.status !== 'pending') saveEntry({ ...e, status: 'pending' });
      } catch { /* try again on the next refresh */ }
    }
    const d = pendingDeposit();
    if (d) {
      try {
        const tx = await deps.chain.transaction(d.txid);
        const s = String(tx?.tx_status ?? '');
        if ((s === 'success' && tx.is_unanchored === false) || s.startsWith('abort_') || s.startsWith('dropped_') || (!tx && deps.now() - d.at > 2 * 3600_000)) {
          setPendingDeposit(null);
          balanceAt = -Infinity;
        }
      } catch { /* keep waiting */ }
    }
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
      status = await bridge!.request<StatusResult>('listening.status');
      if (main && gate.allowed) await lookupServerLink(main);
      await refreshBalance(force);
      await lookupFunder();
      await reconcile();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Pay-per-play could not refresh. Listening stays free.';
    }
    if (step() === 'locked') arm();
    else if (armed) void disarm();
    if (likesConfirmed) { likesConfirmed = false; try { deps.likesChanged?.(); } catch { /* the radio re-reads on its own schedule */ } }
    deps.changed();
  }

  /** Unlock inside the frame, resuming paying unless this device switched it off. */
  async function unlockWith(b: Bridge, anyPasskey: boolean) {
    const resume = !status?.address || payingOn(status.address);
    await b.request('listening.unlock', { mode: 'unlock', terms: resume ? onTerms() : undefined, anyPasskey });
    status = await b.request<StatusResult>('listening.status');
    if (resume) {
      // Picked a different wallet that this device has switched off: honour that.
      if (!payingOn(status.address)) await b.request('listening.stop');
      else await holdTab();
    }
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

  const actions = {
    forceRefresh: () => refresh(true),

    create: () => task('Waiting for your passkey…', async () => {
      const b = await ensureBridge();
      await b.request('listening.unlock', { mode: 'create', terms: onTerms() });
      status = await b.request<StatusResult>('listening.status');
      setPayingOn(true);
      say(solo() ? 'Wallet created ✓ Next: add 1 STX.' : 'Wallet created ✓ Next: link it.');
      await holdTab();
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

    switchOn: () => task('Confirm in the listening wallet…', async () => {
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
      await bridge?.request('listening.stop');
      setPayingOn(false);
      say('Paying is off. Music stays free.');
    }),

    lock: () => task('Locking…', async () => {
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
      if (!status?.address) throw new Error('Unlock the listening wallet first.');
      // A linked main wallet always wins; otherwise the destination is the one the listener chose
      // or the funder found on chain. The frame shows the full address and the listener confirms it.
      const target = returnTarget();
      if (!target) throw new Error(solo() ? 'Choose where to send the funds first.' : 'Link your main wallet first.');
      if (target.kind !== 'linked' && walletLacks('standalone')) throw new Error('The listening wallet box needs an update before it can return to another address. Try again shortly.');
      if (unresolved().length) throw new Error('Wait for the pending payment to confirm, then return funds.');
      const { balance: b, nonce } = await deps.chain.account(status.address);
      balance = b;
      const r = await bridge!.request<ReturnResult>('listening.prepareReturn', {
        mode, balance: b.toString(), nonce: nonce.toString(), fee: DEFAULT_RETURN_FEE.toString(),
        ...(target.kind === 'linked' ? {} : { destination: target.to })
      });
      if (r.recipient !== target.to) throw new Error('Return destination does not match what you approved. Nothing was sent.');
      const tx = deserializeTransaction(r.raw) as any;
      if (cvToJSON(tx.payload.recipient).value !== target.to || String(tx.payload.amount) !== r.amount)
        throw new Error('Signed return does not match what you approved. Nothing was sent.');
      const entry: Entry = {
        id: randomId(), address: status.address, kind: 'withdraw', core: 0, song: 0, recipient: r.recipient, amount: r.amount,
        fee: r.fee, nonce: nonce.toString(), created: deps.now(), status: 'signed', raw: r.raw, txid: r.txid
      };
      deps.validate(entry);
      saveEntry(entry);
      try { await deps.chain.broadcast(r.raw, r.txid); saveEntry({ ...entry, status: 'pending' }); }
      catch (e) { saveEntry({ ...entry, status: 'unknown', note: (e as Error).message }); throw e; }
      if (mode === 'all') setPayingOn(false);
      say(mode === 'all'
        ? (target.kind === 'linked' ? 'Returned to your wallet ✓ Paying is off.' : 'Returned ✓ Paying is off.')
        : 'Excess returned ✓ Switch paying back on to continue.');
    })
  };

  /**
   * Called once a song has been heard for 30 seconds (half of a shorter song): that is a play,
   * and a play gets paid. Never throws and never affects playback.
   */
  async function onListened(detail: { song: number; id: string; title?: string; artist?: string }) {
    if (paying || busy || liking || checkingLike) return;
    paying = true;
    try {
      // Background tabs barely run timers: catch up on confirmations and the kill switch here.
      await refresh();
      const s = step();
      if (s !== 'ready' || !payingOn() || !status?.session || status.session.playsLeft < 1 || !lockHeld || unresolved().length) return;
      if (!verified) { await deps.chain.verify(); verified = true; }
      const listening = status.address!;
      const { balance: b, nonce } = await deps.chain.account(listening);
      balance = b; balanceAt = deps.now();
      const recipient = await deps.chain.owner(RADIO_CORE_INDEX, detail.song);
      if (recipient === listening || recipient === deps.main()) return; // you hold this song: plays free
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
      status = await bridge!.request<StatusResult>('listening.status');
    } catch (e) {
      message = 'This song played free: ' + (e instanceof Error ? e.message : 'payment unavailable');
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
    const s = step(), main = deps.main();
    // Passkey-only: the listening address itself is the liker.
    const who = solo() ? status?.address : main;
    if (s === 'locked') {
      likeAfterUnlock = { ...d, at: deps.now() };
      say(`Unlock to like ${label}. It sends straight after.`);
      return;
    }
    if (s === 'link') return fail('Link the listening wallet to your main wallet first, so your likes count for it.');
    if (solo() && walletLacks('standalone')) return fail('The listening wallet box needs an update before it can like on its own. Try again shortly.');
    if (s === 'fund') return fail('Top up the listening wallet to like: each like or unlike costs 0.0002 STX.');
    if (s === 'over') return fail('Return the excess first: the listening wallet holds more than 1 STX.');
    if (s !== 'ready' || !who) return fail('Still checking the listening wallet. Try the heart again in a moment.');
    if (!status?.session) return fail('Paying is switched off. Switch it on to like from the listening wallet.');
    if (!lockHeld) return fail('Pay-per-play is running in another tab. Like from that tab.');
    // One like per song at a time: locked until the last one confirms, then 3 more seconds, so a
    // like cannot be toggled on and off in quick succession (each costs a network fee).
    const previous = entries().find((e) => e.kind === 'like' && e.song === d.song);
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
    const listening = status.address!;
    const mine = by.includes(listening);
    if (!mine && by.length) return fail(solo()
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
      while (paying || unresolved().length) {
        if (deps.now() > until) throw new Error('An earlier payment is still confirming. Try the like again shortly.');
        await wait(5_000);
        await refresh(true);
      }
      if (step() !== 'ready' || !status?.session) throw new Error('Paying stopped before the like was sent.');
      const listening = status.address!;
      const { balance: b, nonce } = await deps.chain.account(listening);
      balance = b; balanceAt = deps.now();
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
      status = await bridge!.request<StatusResult>('listening.status');
    } catch (e) {
      error = 'Like not sent: ' + (e instanceof Error ? e.message : 'the listening wallet is unavailable');
      try { deps.likeFailed?.(d.song); } catch { /* radio */ }
    } finally {
      liking = false;
      deps.changed();
    }
  }

  return { snapshot, refresh, onListened, heart, toggleLike, ...actions };
}
