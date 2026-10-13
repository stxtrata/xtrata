/**
 * Listening wallet engine. Runs ONLY inside the wallet origin (wallet.xtrata.xyz).
 *
 * The key is derived from the passkey on unlock (derive.ts), kept in this module's
 * memory, and dropped on lock or when the frame unloads. Nothing secret is written to
 * storage: the store holds only credential ids, addresses and public link signatures.
 *
 * Every interactive step (create, unlock, approve spending, return funds) is shown and
 * confirmed INSIDE this frame, so the embedding page can ask but cannot approve.
 */
import { makeContractCall, makeSTXTokenTransfer } from '@stacks/transactions';
import { deriveListeningIdentity, type ListeningIdentity } from '../../lib/listening-wallet/derive';
import { isMainnetStandardAddress, signLink, verifyLinkSignature } from '../../lib/listening-wallet/link';
import {
  costPerPlay, LIKE_FEE, RESERVE, returnPlan, SessionLedger, stx, TARGET, validateSessionTerms, type SessionTerms
} from '../../lib/listening-wallet/policy';
import { likeCallOptions, playCallOptions, returnTransferOptions } from '../../lib/listening-wallet/tx';
import type {
  LinkParams, LinkResult, ReturnParams, ReturnResult, SessionSummary, SignedResult, SignLikeParams, SignPlayParams,
  StatusParams, StatusResult, TermsParams, UnlockParams, UnlockResult
} from '../../lib/listening-wallet/messages';
import { LISTENING_FEATURES } from '../../lib/listening-wallet/messages';

export interface PasskeyPort {
  /** WebAuthn present at all. PRF support is only known after a real ceremony. */
  available(): boolean;
  /**
   * Create a discoverable passkey; `prf` is set when the authenticator evaluated PRF at creation.
   * `exclude` lists existing listening-wallet credentials the authenticator must not duplicate: given when making a
   * wallet with no main wallet, empty when making one for a specific main wallet (a new passkey beside the others).
   */
  create(exclude?: string[], name?: string): Promise<{ credentialId: string; prf?: Uint8Array }>;
  /** Assertion with PRF. Without a credential id the browser offers any listening-wallet passkey. */
  evaluate(credentialId?: string): Promise<{ credentialId: string; prf: Uint8Array }>;
}

export interface Panel {
  kind: 'create' | 'confirm-passkey' | 'verify-passkey' | 'unlock' | 'session' | 'return' | 'link';
  title: string;
  /**
   * One or two plain lines shown above the button. When set, `lines` and `warnings` fold into a
   * "Details" section below it, so the button is in view without scrolling. Without it, every line
   * stays visible (used where the detail IS the thing to check, e.g. the full return address).
   */
  summary?: string;
  lines: string[];
  confirmLabel: string;
  /** Lines the listener must not miss (shown as warnings). */
  warnings?: string[];
}

export interface IdleView {
  state: StatusResult['state'];
  address?: string;
  linked?: string;
  session: SessionSummary | null;
}

export interface UiPort {
  /**
   * Show `panel` and wait. When the listener presses confirm, `action` runs inside that
   * click handler (WebAuthn needs the user activation) and its result resolves the promise.
   * Cancel rejects with CancelledError.
   */
  act<T>(panel: Panel, action: () => Promise<T>): Promise<T>;
  /**
   * Withdraw the open panel as if Cancel were pressed, unless its confirmed action is already
   * running. Returns whether a waiting panel was withdrawn. Withdrawing can never approve anything.
   */
  cancel(): boolean;
  idle(view: IdleView): void;
}

export interface StorePort {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export class CancelledError extends Error {
  readonly code = 'CANCELLED';
  constructor() { super('Cancelled in the listening wallet. Nothing was signed.'); this.name = 'CancelledError'; }
}

interface WalletRecord {
  credentialId: string;
  address: string;
  link?: { main: string; issued: number; mainSignature: string };
}
interface Stored { version: 1; wallets: WalletRecord[]; last?: string }

const STORE_KEY = 'xtrata.listening-wallet.v1';
const MAX_WALLETS = 25;
const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-4);
/** STX without trailing zeros, for the one-line summaries (0.00035, 1). */
const stxs = (v: bigint) => stx(v).replace(/\.?0+$/, '');
/** The one-line terms: price per song and the cap before it asks again. */
const termsLine = (t: SessionTerms) => `${stxs(costPerPlay(t.fee))} STX a song · up to ${stxs(t.budget)} STX`;
const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
const equalBytes = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((v, i) => v === b[i]);

function bigintParam(value: unknown, label: string): bigint {
  if (typeof value !== 'string' || !/^(0|[1-9]\d{0,17})$/.test(value)) throw new Error(`Invalid ${label}.`);
  return BigInt(value);
}

function termsFrom(params: TermsParams | undefined, now: number): SessionTerms | undefined {
  if (!params) return undefined;
  return validateSessionTerms({
    fee: bigintParam(params.fee, 'fee'),
    maxPlays: params.maxPlays,
    budget: bigintParam(params.budget, 'budget'),
    expires: params.expires
  }, now);
}

function termsLines(t: SessionTerms): string[] {
  return [
    `Each song you listen to for 30 seconds pays ${stx(50n)} STX to its holder, plus a ${stx(t.fee)} STX network fee.`,
    t.maxPlays === 1
      ? 'This approves ONE paid play.'
      : `It keeps paying until you switch it off or the wallet runs out, for up to ${stx(t.budget)} STX before it asks again.`,
    'Songs skipped before 30 seconds play free, and paused or muted time does not count.',
    `Tapping the radio's heart likes or unlikes from this wallet too, for a ${stx(LIKE_FEE)} STX network fee, and counts for your linked main wallet (or for this listening address if none is linked).`
  ];
}

export function createListeningEngine(deps: {
  passkey: PasskeyPort;
  ui: UiPort;
  store: StorePort;
  now?: () => number;
}) {
  const now = deps.now ?? Date.now;
  let identity: ListeningIdentity | null = null;
  let credentialId: string | null = null;
  let ledger: SessionLedger | null = null;
  let interactive = false;
  let signing = false;

  const load = (): Stored => {
    try {
      const parsed = JSON.parse(deps.store.get(STORE_KEY) || 'null');
      if (parsed?.version === 1 && Array.isArray(parsed.wallets)) return parsed;
    } catch { /* fall through */ }
    return { version: 1, wallets: [] };
  };
  const save = (s: Stored) => deps.store.set(STORE_KEY, JSON.stringify(s));
  const record = (id: string | null) => (id ? load().wallets.find((w) => w.credentialId === id) : undefined);
  const lastRecord = () => { const s = load(); return s.wallets.find((w) => w.credentialId === s.last); };
  const remember = (rec: WalletRecord) => {
    const s = load();
    // One listening wallet per main-wallet address, plus a passkey-only one: never silently forget a wallet that may hold funds.
    s.wallets = [rec, ...s.wallets.filter((w) => w.credentialId !== rec.credentialId)].slice(0, MAX_WALLETS);
    s.last = rec.credentialId;
    save(s);
  };

  const summary = (): SessionSummary | null => {
    if (!ledger) return null;
    const x = ledger.summary;
    return { plays: x.plays, spent: x.spent.toString(), playsLeft: x.playsLeft, budgetLeft: x.budgetLeft.toString(), expires: x.expires };
  };

  const features = [...LISTENING_FEATURES];
  const validMain = (m: unknown): string | undefined => (typeof m === 'string' && isMainnetStandardAddress(m) ? m : undefined);
  /**
   * Which of this device's listening wallets serves a connected main wallet: the one linked to it; else a wallet
   * that was never linked (a passkey-only one) which that wallet can claim by linking; else none, and the page
   * offers a new one. Without a main wallet, the one used last. A wallet linked to a DIFFERENT main wallet is
   * never offered: each address keeps its own plays, likes and funds.
   */
  const pick = (main?: string): WalletRecord | undefined => {
    if (!main) return lastRecord();
    const wallets = load().wallets;
    return wallets.find((w) => w.link?.main === main) ?? wallets.find((w) => !w.link);
  };
  // The main wallet the open listening wallet was unlocked for, and the one the idle view follows.
  let unlockedFor: string | undefined;
  let viewMain: string | undefined;
  /** Main wallets the device's OTHER listening wallets belong to: not the reported wallet's, and not the connected one. */
  const othersOf = (shown: WalletRecord | undefined, main?: string): { others?: string[] } => {
    const mine = new Set([shown?.link?.main, main].filter(Boolean));
    const others = [...new Set(load().wallets.flatMap((w) => (w.link && !mine.has(w.link.main) ? [w.link.main] : [])))];
    return others.length ? { others } : {};
  };
  const status = (main?: string): StatusResult => {
    if (!deps.passkey.available()) return { state: 'unsupported', session: null, features };
    if (identity) {
      const open = record(credentialId);
      return { state: 'unlocked', address: identity.address, linked: open?.link?.main, ...othersOf(open, main), session: summary(), features };
    }
    const last = pick(main);
    return last
      ? { state: 'known', address: last.address, linked: last.link?.main, ...othersOf(last, main), session: null, features }
      : { state: 'none', ...othersOf(undefined, main), session: null, features };
  };
  const refreshIdle = () => deps.ui.idle(status(viewMain));
  const lockNow = () => { identity = null; ledger = null; credentialId = null; unlockedFor = undefined; };

  /** One panel at a time: the listener answers inside the frame, so stacking prompts would confuse. */
  async function interact<T>(run: () => Promise<T>): Promise<T> {
    if (interactive) throw new Error('The listening wallet is already waiting for you in its panel.');
    interactive = true;
    try { return await run(); } finally { interactive = false; refreshIdle(); }
  }

  const requireUnlocked = () => {
    if (!identity) throw new Error('Unlock the listening wallet first.');
    return identity;
  };

  async function create(terms?: SessionTerms, main?: string): Promise<ListeningIdentity> {
    const existing = load().wallets;
    const created = await deps.ui.act({
      kind: 'create',
      title: 'New listening wallet',
      // One glance: the price, and the one rule that matters. Everything else is under Details.
      summary: (terms ? termsLine(terms) + '. ' : '')
        + 'Keep under 1 STX: lose the passkey, lose the funds.'
        + (existing.length ? (main ? ` (A separate wallet for ${short(main)}.)` : ' (A second wallet on this device.)') : ''),
      lines: [
        'A small spending wallet for paying artists as you listen. It is made from a passkey on this device, so there is nothing to install and no key is stored anywhere.',
        'Your browser will ask you to save a passkey (Face ID, Touch ID, Windows Hello or your phone).',
        ...(terms ? termsLines(terms) : [])
      ],
      warnings: [
        'Keep no more than 1 STX in it.',
        'Anyone who can use this passkey on an unlocked device can spend it.',
        'If you lose the passkey, whatever is in this wallet is lost. You can return funds to a wallet of yours at any time.',
        ...(existing.length
          ? [`This device already has a listening wallet (${existing.map((w) => short(w.address)).join(', ')}). A new one is a separate wallet${main ? ` for ${short(main)}: each address keeps its own plays, likes and funds. The old one is still there for the wallet it belongs to` : ': to reach the old one later, choose its passkey when unlocking'}.`]
          : [])
      ],
      confirmLabel: terms ? 'Create and pay as I listen' : 'Create with passkey'
    }, () => deps.passkey.create(
      // A wallet for a specific address is meant to be a NEW passkey beside the others. Excluding the existing
      // credentials there makes the authenticator refuse ("already registered") on exactly the device that has them.
      // Without an address the old guard stays: do not quietly make a duplicate of a wallet this device already has.
      main ? [] : existing.map((w) => w.credentialId),
      main ? `Xtrata listening wallet · ${short(main)}` : undefined));

    // Prove PRF is live AND stable before the address is ever shown for funding
    // (docs/PASSKEY-WALLET.md §3.1). A wallet whose PRF output changes is unreachable.
    const outputs: Uint8Array[] = created.prf ? [created.prf] : [];
    try {
      while (outputs.length < 2) {
        const first = outputs.length === 0;
        const r = await deps.ui.act({
          kind: first ? 'confirm-passkey' : 'verify-passkey',
          title: first ? 'Confirm your passkey' : 'One more check',
          lines: [first
            ? 'Tap the passkey you just saved.'
            : 'Once more, to check it gives the same wallet every time.'],
          confirmLabel: 'Use passkey'
        }, () => deps.passkey.evaluate(created.credentialId));
        if (r.credentialId !== created.credentialId) throw new Error('A different passkey was used. Start again with the new one.');
        outputs.push(r.prf);
      }
      if (!equalBytes(outputs[0], outputs[1]))
        throw new Error('This passkey did not give a stable result, so pay-per-play is not available on this device. Nothing was funded. Listening stays free.');
      const id = await deriveListeningIdentity(outputs[0]);
      credentialId = created.credentialId;
      remember({ credentialId: created.credentialId, address: id.address });
      return id;
    } finally {
      outputs.forEach((o) => o.fill(0));
    }
  }

  /** A name from the page, kept to plain letters, digits and . _ - so it cannot carry anything but a name. */
  const cleanLabel = (v: unknown) => (typeof v === 'string' ? v.replace(/[^\p{L}\p{N}._ -]/gu, '').trim().slice(0, 40) : '');

  async function unlockExisting(anyPasskey = false, terms?: SessionTerms, label?: string, forMain?: string): Promise<ListeningIdentity> {
    const last = anyPasskey ? undefined : pick(forMain);
    // A listening wallet linked to a main wallet is that person's wallet: greet them by it. The listening
    // address is plumbing for them. Without a link (passkey-only) the listening address is the identity.
    const main = last?.link?.main;
    const owner = main ? [cleanLabel(label), short(main)].filter(Boolean).join(' · ') : '';
    const who = main ? (cleanLabel(label) || short(main)) : '';
    const r = await deps.ui.act({
      kind: 'unlock',
      title: who ? `Welcome back, ${who}` : 'Welcome back',
      summary: [main ? (cleanLabel(label) ? short(main) : '') : last ? short(last.address) : '', terms ? termsLine(terms) : 'Unlock for this visit'].filter(Boolean).join(' · '),
      // Kept short: on the radio this panel opens by itself and its button should sit in view.
      lines: terms
        ? [main ? `Plays and likes are credited to ${owner}. One passkey tap unlocks your listening wallet for this visit and carries on paying as you listen.`
            : last ? `Wallet ${short(last.address)}. One passkey tap unlocks it for this visit and carries on paying as you listen.` : 'Use your listening-wallet passkey to unlock it for this visit and carry on paying as you listen.',
          `Each song you listen to for 30 seconds pays ${stx(50n)} STX to its holder, plus a ${stx(terms.fee)} STX network fee, for up to ${stx(terms.budget)} STX before it asks again. Switch off any time.`]
        : [main ? `Plays and likes are credited to ${owner}. Use your listening wallet's passkey to unlock it for this visit.`
            : last ? `Wallet ${short(last.address)}. Use its passkey to unlock it for this visit.` : 'Use your listening-wallet passkey to unlock it for this visit.',
          'The key is rebuilt from your passkey and forgotten when you lock or close this page.'],
      confirmLabel: terms ? 'Unlock and keep paying' : 'Unlock with passkey'
    }, () => deps.passkey.evaluate(last?.credentialId));
    let second: Uint8Array | undefined;
    try {
      const known = record(r.credentialId);
      if (!known) {
        // First use of this passkey on this device (e.g. synced from another): prove PRF is stable
        // here too before showing an address that might be funded from this device.
        const again = await deps.ui.act({
          kind: 'verify-passkey',
          title: 'One more check',
          lines: ['New device: tap the same passkey once more to check it gives the same wallet.'],
          confirmLabel: 'Use passkey'
        }, () => deps.passkey.evaluate(r.credentialId));
        second = again.prf;
        if (again.credentialId !== r.credentialId || !equalBytes(r.prf, again.prf))
          throw new Error('This passkey did not give a stable result on this device. Nothing was signed. Use the device where you created it.');
      }
      const id = await deriveListeningIdentity(r.prf);
      if (known && known.address !== id.address)
        throw new Error('This passkey no longer gives the same wallet on this device. Nothing was signed. Use another device to return its funds.');
      credentialId = r.credentialId;
      remember({ ...(known ?? {}), credentialId: r.credentialId, address: id.address });
      return id;
    } finally {
      r.prf.fill(0);
      second?.fill(0);
    }
  }

  async function approve(terms: SessionTerms, title: string): Promise<void> {
    await deps.ui.act({
      kind: 'session', title, lines: termsLines(terms), confirmLabel: 'Approve',
      summary: `${stxs(costPerPlay(terms.fee))} STX a song · ${stxs(LIKE_FEE)} STX a like · up to ${stxs(terms.budget)} STX`
    }, async () => undefined);
    ledger = new SessionLedger(terms, now());
  }

  const handlers = {
    'listening.status': async (params?: unknown): Promise<StatusResult> => {
      const main = validMain((params as StatusParams | undefined)?.main);
      viewMain = main;
      // A different main wallet is connected than the one this wallet was opened for, and another of this
      // device's wallets serves it: close this one. Locking only ever denies service, and the page then
      // offers the right wallet (or a new one). A wallet opened for this same main wallet stays open.
      if (identity && main !== unlockedFor) {
        if (pick(main)?.credentialId !== credentialId) { lockNow(); refreshIdle(); }
        else unlockedFor = main;
      }
      return status(main);
    },

    'listening.unlock': (params: unknown): Promise<UnlockResult> => interact(async () => {
      const p = params as UnlockParams;
      if (p?.mode !== 'create' && p?.mode !== 'unlock') throw new Error('Choose create or unlock.');
      if (!deps.passkey.available()) throw new Error('This browser does not support passkeys. Listening stays free.');
      const terms = termsFrom(p.terms, now());
      const main = validMain(p.main);
      viewMain = main;
      if (!identity) {
        // The terms are shown on the same panel as the passkey button, so that one confirm click
        // inside the frame both unlocks and approves paying as you listen.
        const id = p.mode === 'create' ? await create(terms, main) : await unlockExisting(p.anyPasskey === true, terms, p.label, main);
        identity = id;
        unlockedFor = main;
        if (terms) ledger = new SessionLedger(terms, now());
      } else if (terms) await approve(terms, 'Approve paying as you listen');
      return { address: identity.address, session: summary() };
    }),

    // Linking sets the ONLY address funds can be returned to, so it is confirmed in the frame,
    // with the full address, even when the main wallet's signature is valid: anyone can sign a
    // link for an address they control.
    'listening.link': (params: unknown): Promise<LinkResult> => interact(async () => {
      const id = requireUnlocked();
      const p = params as LinkParams;
      const link = { main: p?.main, listening: id.address, issued: p?.issued };
      if (!isMainnetStandardAddress(link.main) || link.main === id.address || !Number.isSafeInteger(link.issued))
        throw new Error('Invalid main wallet for linking.');
      if (!verifyLinkSignature(link, p.mainSignature, link.main))
        throw new Error('The main wallet signature does not match this listening wallet. Nothing was linked.');
      const current = record(credentialId)?.link?.main;
      if (current === link.main) {
        return { main: link.main, listening: id.address, issued: link.issued, listeningSignature: signLink(link, id.privateKey) };
      }
      await deps.ui.act({
        kind: 'link',
        title: current ? 'Change where returns go?' : 'Confirm your main wallet',
        lines: [
          'Funds in this listening wallet can only ever be returned to:',
          link.main,
          'Check this is your own wallet address before confirming.'
        ],
        warnings: current ? [`Returns currently go to ${current}. Confirming replaces it. If you did not ask for this, press Cancel.`] : undefined,
        confirmLabel: current ? 'Yes, change it' : 'This is my wallet'
      }, async () => undefined);
      if (identity !== id) throw new Error('Wallet locked before linking finished.');
      const rec = record(credentialId);
      remember({ credentialId: credentialId!, address: id.address, ...(rec ?? {}), link: { main: link.main, issued: link.issued, mainSignature: p.mainSignature } });
      return { main: link.main, listening: id.address, issued: link.issued, listeningSignature: signLink(link, id.privateKey) };
    }),

    'listening.approveSession': (params: unknown): Promise<SessionSummary> => interact(async () => {
      requireUnlocked();
      const terms = termsFrom(params as TermsParams, now());
      if (!terms) throw new Error('Session terms required.');
      await approve(terms, 'Approve paying as you listen');
      return summary()!;
    }),

    'listening.signPlay': async (params: unknown): Promise<SignedResult> => {
      const id = requireUnlocked();
      if (!ledger) throw new Error('No approved listening session. This start plays free.');
      if (signing) throw new Error('Still signing the previous play. This start plays free.');
      signing = true;
      try {
        const p = params as SignPlayParams;
        const fee = bigintParam(p?.fee, 'fee'), nonce = bigintParam(p?.nonce, 'nonce'), balance = bigintParam(p?.balance, 'balance');
        if (balance > TARGET) throw new Error('This wallet holds more than 1 STX. Return the excess to keep paying.');
        if (balance < RESERVE + costPerPlay(fee)) throw new Error('Balance too low for another paid play. Top up to keep paying.');
        const options = playCallOptions(id.address, id.publicKey, { core: p.core, song: p.song, receipt: p.receipt, fee, nonce });
        const session = ledger;
        session.consume(fee, now());
        const tx = await makeContractCall({ ...options, senderKey: id.privateKey });
        if (identity !== id || ledger !== session) throw new Error('Listening stopped before signing finished. Nothing was returned.');
        refreshIdle();
        return { raw: toHex(tx.serialize()), txid: '0x' + tx.txid() };
      } finally {
        signing = false;
      }
    },

    // A like or unlike is a deliberate tap on the radio's heart, covered by the approved session:
    // it moves nothing (Deny mode, no post-conditions) and costs only the session's network fee.
    'listening.signLike': async (params: unknown): Promise<SignedResult> => {
      const id = requireUnlocked();
      if (!ledger) throw new Error('Paying is switched off, so likes go through your main wallet.');
      // Linked or not, the like is signed by this wallet. Unlinked likes count for the listening
      // address itself (the page lists passkey-only listeners under it).
      if (signing) throw new Error('Still signing. Try the like again in a moment.');
      signing = true;
      try {
        const p = params as SignLikeParams;
        const fee = bigintParam(p?.fee, 'fee'), nonce = bigintParam(p?.nonce, 'nonce'), balance = bigintParam(p?.balance, 'balance');
        if (balance > TARGET) throw new Error('This wallet holds more than 1 STX. Return the excess first.');
        if (balance < RESERVE + fee) throw new Error('Balance too low for the like fee. Top up first.');
        const options = likeCallOptions(id.publicKey, { song: p.song, liked: p.liked, fee, nonce });
        const session = ledger;
        session.consumeLike(fee, now());
        const tx = await makeContractCall({ ...options, senderKey: id.privateKey });
        if (identity !== id || ledger !== session) throw new Error('Listening stopped before signing finished. Nothing was returned.');
        refreshIdle();
        return { raw: toHex(tx.serialize()), txid: '0x' + tx.txid() };
      } finally {
        signing = false;
      }
    },

    'listening.prepareReturn': (params: unknown): Promise<ReturnResult> => interact(async () => {
      const id = requireUnlocked();
      const p = params as ReturnParams;
      // A linked main wallet always wins. Without one, the page supplies the destination (the
      // funder it found on chain, or an address the listener typed) and the listener confirms
      // the FULL address below; this frame cannot read the chain, so it cannot check where it came from.
      const linkedMain = record(credentialId)?.link?.main;
      const supplied = typeof p?.destination === 'string' ? p.destination.trim() : '';
      if (!linkedMain) {
        if (!supplied) throw new Error('Choose where to send the funds first, or link a main wallet.');
        if (!isMainnetStandardAddress(supplied)) throw new Error('Choose a standard mainnet address (starting SP) to send to.');
        if (supplied === id.address) throw new Error('That is this listening wallet itself. Choose a different address.');
      }
      const main = linkedMain ?? supplied;
      const toLabel = linkedMain ? 'your main wallet' : 'this address';
      if (p?.mode !== 'excess' && p?.mode !== 'all') throw new Error('Choose Return excess or Return all.');
      const plan = returnPlan(p.mode, bigintParam(p.balance, 'balance'), bigintParam(p.fee, 'fee'));
      const nonce = bigintParam(p.nonce, 'nonce');
      ledger = null; // pause new paid plays while a return is prepared
      await deps.ui.act({
        kind: 'return',
        title: p.mode === 'all' ? 'Return everything' : 'Return the excess',
        summary: `Send ${stx(plan.amount)} STX to ${toLabel} ${main}. Network fee ${stx(plan.fee)} STX.`,
        lines: [
          `Send ${stx(plan.amount)} STX to ${toLabel} ${main}.`,
          ...(linkedMain ? [] : ['Check every character of this address. A transfer to a wrong address cannot be undone. Do not send to an exchange deposit address unless it accepts transfers from other wallets.']),
          `Network fee ${stx(plan.fee)} STX. Left in this wallet: ${stx(plan.remaining)} STX.`,
          `Amounts use the balance the radio page reported (${stx(bigintParam(p.balance, 'balance'))} STX). If the real balance differs, the network rejects the transfer and nothing moves.`,
          'Paid listening is paused. Turn it back on any time after this confirms.'
        ],
        confirmLabel: 'Confirm return'
      }, async () => undefined);
      if (identity !== id) throw new Error('Wallet locked before the return was signed.');
      const tx = await makeSTXTokenTransfer({ ...returnTransferOptions(main, plan.amount, plan.fee, nonce), senderKey: id.privateKey });
      return { raw: toHex(tx.serialize()), txid: '0x' + tx.txid(), amount: plan.amount.toString(), fee: plan.fee.toString(), recipient: main, mode: plan.mode };
    }),

    // The page may withdraw a panel it asked for (e.g. to unlock a different wallet instead).
    'listening.cancel': async () => ({ cancelled: deps.ui.cancel() }),

    'listening.stop': async () => { ledger = null; refreshIdle(); return { stopped: true }; },

    'listening.lock': async () => { lockNow(); refreshIdle(); return { locked: true }; }
  };

  refreshIdle();
  return { handlers, status, lock: () => void handlers['listening.lock']() };
}
