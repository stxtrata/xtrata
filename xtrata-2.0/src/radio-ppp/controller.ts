/**
 * Radio pay-per-play controller (runs on xtrata.xyz, holds NO key material).
 *
 * Walks a listener from "turn on" to their first confirmed paid play, then lets them pay
 * automatically for each new song. The key lives only in the listening wallet frame on its
 * own origin; this side reads the chain, broadcasts what the frame signed, and keeps a
 * public history. Music always keeps playing: any failure means that start plays free.
 */
import { deserializeTransaction, cvToJSON } from '@stacks/transactions';
import { linkData, type LinkRequest } from '../lib/listening-wallet/link';
import {
  balanceState, costPerPlay, DEFAULT_PLAY_FEE, DEFAULT_RETURN_FEE, fundingAllowance, playsCovered, RESERVE, TARGET,
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
  /** The listener's switch: once on, every new song pays until they switch it off or funds run out. */
  payingOn: boolean;
  entries: Entry[];
  depositTxid?: string;
  /** A deposit was sent and has not confirmed yet: no further deposit is offered. */
  depositPending: boolean;
  /** The server holds a link for this listening wallet, so linking needs no new wallet popup. */
  serverLinked: boolean;
  /** Unresolved payments older than 30 minutes that the chain has never seen. */
  stuck: number;
}

const UNRESOLVED: Entry['status'][] = ['prepared', 'signed', 'unknown', 'pending'];
const STUCK_AFTER_MS = 30 * 60_000;

/** The node refused the transaction outright, so it never entered the mempool and its nonce is unused. */
export const definitelyRejected = (e: unknown) => {
  const err = e as { feeRejected?: boolean; message?: string };
  return err?.feeRejected === true || /\(400\)/.test(err?.message ?? '');
};
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
  let message = '';
  let error = '';
  let depositTxid: string | undefined;
  let serverLink: StoredLink | null = null;
  let serverLinkFor: string | undefined;
  let serverLinkAt = -Infinity;
  const notSeen = new Set<string>();
  let verified = false;
  let lockHeld = false;
  const fee = () => BigInt(gate?.limits.playFee ?? DEFAULT_PLAY_FEE.toString());

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

  function step(): Step {
    if (!gate?.enabled) return 'off';
    if (!gate.here) return 'elsewhere';
    const main = deps.main();
    if (!main) return 'connect';
    if (!gate.allowed) return 'not-invited';
    if (!status) return 'loading';
    if (status.state === 'unsupported') return 'unsupported';
    if (status.state === 'none') return 'intro';
    if (status.state === 'known') return 'locked';
    if (status.linked !== main) return 'link';
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
    depositPending: !!pendingDeposit(), serverLinked: !!serverLink && serverLinkFor === `${deps.main()}:${status?.address}`,
    stuck: stuck().length
  });

  const say = (m: string, e = '') => { message = m; error = e; deps.changed(); };

  async function task(label: string, run: () => Promise<void>) {
    if (busy) return;
    busy = label; error = ''; deps.changed();
    try { await run(); }
    catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      error = /Cancelled in the listening wallet/.test(m) ? '' : m;
      if (!error) message = 'Cancelled. Nothing was signed.';
    } finally { busy = null; await refresh(true); }
  }

  async function ensureBridge() {
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

  /** Look up a link saved from another device. Using it still needs the listener's confirm in the frame. */
  async function lookupServerLink(main: string) {
    if (status?.state !== 'unlocked' || status.linked === main) return;
    const id = `${main}:${status.address}`;
    if (serverLinkFor === id && (serverLink || deps.now() - serverLinkAt < 60_000)) return;
    serverLink = (await deps.links(main)).find((l) => l.listening === status!.address) ?? null;
    serverLinkFor = id;
    serverLinkAt = deps.now();
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
      if (!gate.enabled || !gate.here || !main || !gate.allowed) {
        if (bridge && status?.session) await bridge.request('listening.stop').catch(() => undefined);
        deps.changed();
        return;
      }
      await ensureBridge();
      status = await bridge!.request<StatusResult>('listening.status');
      await lookupServerLink(main);
      await refreshBalance(force);
      await reconcile();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Pay-per-play could not refresh. Listening stays free.';
    }
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

    create: () => task('Waiting for your passkey in the listening wallet…', async () => {
      const b = await ensureBridge();
      await b.request('listening.unlock', { mode: 'create', terms: onTerms() });
      status = await b.request<StatusResult>('listening.status');
      setPayingOn(true);
      say('Listening wallet created and paying is switched on. Next, link it to your main wallet.');
      await holdTab();
    }),

    unlock: (anyPasskey = false) => task('Waiting for your passkey in the listening wallet…', async () => {
      const b = await ensureBridge();
      // A wallet known on this device resumes paying unless the listener switched it off.
      const resume = !status?.address || payingOn(status.address);
      await b.request('listening.unlock', { mode: 'unlock', terms: resume ? onTerms() : undefined, anyPasskey });
      status = await b.request<StatusResult>('listening.status');
      if (resume) {
        // Picked a different wallet that this device has switched off: honour that.
        if (!payingOn(status.address)) await b.request('listening.stop');
        else await holdTab();
      }
      say(resume ? 'Unlocked. Each new song you hear pays its holder.' : 'Unlocked. Paying is switched off.');
    }),

    link: () => task('Waiting for your main wallet to sign…', async () => {
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
      }
      serverLinkAt = -Infinity;
      say('Linked. Returns from the listening wallet can only go to your main wallet.');
    }),

    deposit: () => task('Waiting for your main wallet to approve the deposit…', async () => {
      const main = deps.main();
      if (!main || !status?.address) throw new Error('Connect your main wallet first.');
      if (pendingDeposit()) throw new Error('A deposit is still confirming. Wait for it before adding more.');
      await refreshBalance(true);
      const amount = fundingAllowance(balance ?? 0n);
      if (amount <= 0n) throw new Error('This wallet already holds 1 STX. No deposit needed.');
      depositTxid = await deps.deposit(main, status.address, amount);
      if (depositTxid) setPendingDeposit({ txid: depositTxid, amount: amount.toString(), at: deps.now() });
      say('Deposit sent. It usually confirms within a few minutes; this page checks automatically.');
    }),

    switchOn: () => task('Confirm in the listening wallet…', async () => {
      await holdTab();
      await bridge!.request('listening.approveSession', onTerms());
      setPayingOn(true);
      say('Switched on. Each new song you hear pays its holder until you switch it off or the wallet runs out.');
    }),

    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => task('Clearing…', async () => {
      for (const e of stuck()) {
        if (await deps.chain.transaction(e.txid!)) continue;
        saveEntry({ ...e, status: 'failed', note: 'never seen on-chain; cleared by listener', raw: undefined });
      }
      say('Cleared. If one of those still confirms later, it will simply show in your wallet history on the explorer.');
    }),

    switchOff: () => task('Switching off…', async () => {
      await bridge?.request('listening.stop');
      setPayingOn(false);
      say('Switched off. Music plays free until you switch it back on.');
    }),

    lock: () => task('Locking…', async () => {
      await bridge?.request('listening.lock');
      balance = undefined;
      say('Locked. The listening key has been forgotten.');
    }),

    returnFunds: (mode: ReturnMode) => task('Review the return in the listening wallet…', async () => {
      if (!status?.address || !status.linked) throw new Error('Link your main wallet first.');
      if (unresolved().length) throw new Error('Wait for the pending payment to confirm, then return funds.');
      const { balance: b, nonce } = await deps.chain.account(status.address);
      balance = b;
      const r = await bridge!.request<ReturnResult>('listening.prepareReturn', { mode, balance: b.toString(), nonce: nonce.toString(), fee: DEFAULT_RETURN_FEE.toString() });
      if (r.recipient !== status.linked) throw new Error('Return destination does not match your linked main wallet. Nothing was sent.');
      const tx = deserializeTransaction(r.raw) as any;
      if (cvToJSON(tx.payload.recipient).value !== status.linked || String(tx.payload.amount) !== r.amount)
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
        ? 'Return sent to your main wallet. Paying is switched off; switch it back on after adding funds.'
        : 'Excess sent to your main wallet. Switch paying back on to continue.');
    })
  };

  /** Called on every new audible start. Never throws and never delays playback. */
  async function onAudibleStart(detail: { song: number; id: string; title?: string; artist?: string }) {
    if (paying || busy) return;
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
      try { await deps.chain.broadcast(signed.raw, signed.txid); saveEntry({ ...entry, status: 'pending' }); message = `Paid play sent for ${label}.`; error = ''; }
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

  return { snapshot, refresh, onAudibleStart, ...actions };
}
