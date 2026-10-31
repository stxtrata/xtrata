/**
 * Casino wallet engine (ParallaX Casino, TESTNET). Runs ONLY inside the casino wallet origin (casino-wallet.xtrata.xyz).
 *
 * The radio's listening wallet, cut down to what the LAYR exchange needs:
 *   - a passkey wallet: key = HKDF(passkey PRF), re-derived on every unlock, kept in memory, dropped on lock (src/lib/casino-wallet/derive.ts);
 *   - or, where passkeys are not available, a "this browser only" wallet whose random key lives in this origin's storage. Testnet only.
 * It signs exactly one thing: a 1-10 STX testnet transfer to the LAYR exchange (src/lib/casino-wallet/tx.ts). No returns, no links,
 * no contract calls. Opening the wallet is a tap inside this frame, and that same tap approves buys for the visit, so the casino can
 * buy chips without asking again (Jim's decision 4: no spending cap on testnet).
 *
 * The passkey ceremonies, the PRF-twice rule (docs/PASSKEY-WALLET.md §3.1), the half-made-passkey pick-up and the WebKit new-tab
 * create are the radio's (src/listening-wallet/frame/engine.ts), copied here so the radio's live box is untouched.
 * Plan: docs/plans/CASINO-PASSKEY-WALLET-PLAN.md.
 */
import { bytesToHex } from '@stacks/common';
import { createStacksPrivateKey, encodeStructuredData, makeSTXTokenTransfer, signMessageHashRsv } from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { ROOM_CHALLENGE_TTL_MS, roomProofData } from '../../../functions/lib/casino-room-proof';
import {
  casinoBase, deriveCasinoIdentity, identityFromKeyHex, randomCasinoKeyHex, type CasinoIdentity
} from '../../lib/casino-wallet/derive';
import { buyTransferOptions, EXCHANGE_ADDRESS, validateBuy } from '../../lib/casino-wallet/tx';
import {
  CASINO_FEATURES, type CasinoOpenParams, type CasinoOpenResult, type CasinoSignBuyResult, type CasinoStatus, type CasinoWalletKind
} from '../../lib/casino-wallet/messages';
import { CancelledError, type Panel, type PasskeyPort, type StorePort } from '../../listening-wallet/frame/engine';
import { PASSKEY_NAME } from './options';

export { PASSKEY_NAME };

export const CANCELLED_MESSAGE = 'Cancelled in the casino wallet. Nothing was signed.';

export interface CasinoIdleView { state: CasinoStatus['state']; kind?: CasinoWalletKind; address?: string; passkeys: boolean }

export interface CasinoUiPort {
  act<T>(panel: Panel, action: () => Promise<T>): Promise<T>;
  cancel(): boolean;
  idle(view: CasinoIdleView): void;
}

interface PasskeyRecord { credentialId: string; address: string }
interface PendingPasskey { at: number; tries: number; credentialId?: string; userId?: string; label?: string }
interface Stored {
  version: 1;
  wallets: PasskeyRecord[];
  last?: string;
  pending?: PendingPasskey;
  /** The no-passkey fallback. Its key is the ONLY secret this origin ever stores, and only because it is testnet. */
  device?: { key: string; address: string };
  /** Which kind the player used last, so the next visit offers it first. */
  lastKind?: CasinoWalletKind;
}

export const STORE_KEY = 'xtrata.casino-wallet.v1';
const MAX_WALLETS = 10;
const PENDING_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const PENDING_MAX_TRIES = 3;
const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-4);
const b64u = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const equalBytes = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((v, i) => v === b[i]);

const TESTNET_LINES = [
  'A testnet wallet for the ParallaX Casino. Testnet STX have no value: they are free practice money.',
  'It only ever pays the LAYR exchange, to buy chips. Opening it lets the casino do that without asking each time, until you lock it or close the page.'
];

export function createCasinoEngine(deps: { passkey: PasskeyPort; ui: CasinoUiPort; store: StorePort; now?: () => number }) {
  const now = deps.now ?? Date.now;
  let identity: CasinoIdentity | null = null;
  let kind: CasinoWalletKind | null = null;
  let interactive = false;

  const load = (): Stored => {
    try {
      const parsed = JSON.parse(deps.store.get(STORE_KEY) || 'null');
      if (parsed?.version === 1 && Array.isArray(parsed.wallets)) return parsed;
    } catch { /* fall through */ }
    return { version: 1, wallets: [] };
  };
  const save = (s: Stored) => deps.store.set(STORE_KEY, JSON.stringify(s));
  const record = (id: string) => load().wallets.find((w) => w.credentialId === id);
  const lastRecord = () => { const s = load(); return s.wallets.find((w) => w.credentialId === s.last); };
  const remember = (rec: PasskeyRecord) => {
    const s = load();
    s.wallets = [rec, ...s.wallets.filter((w) => w.credentialId !== rec.credentialId)].slice(0, MAX_WALLETS);
    s.last = rec.credentialId;
    s.lastKind = 'passkey';
    delete s.pending;
    save(s);
  };
  const pendingNow = (): PendingPasskey | undefined => {
    const p = load().pending;
    return p && now() - p.at < PENDING_MAX_AGE_MS && p.tries < PENDING_MAX_TRIES ? p : undefined;
  };
  const setPending = (p: PendingPasskey | undefined) => {
    const s = load();
    if (!p && !s.pending) return;
    if (p) s.pending = p; else delete s.pending;
    save(s);
  };
  const afterFailure = (resume: PendingPasskey | undefined, e: unknown) => {
    const keep = e instanceof CancelledError || !!(e as { retryable?: boolean })?.retryable;
    if (!keep) setPending(undefined);
    else if (resume) setPending({ ...resume, tries: resume.tries + 1 });
  };

  const status = (): CasinoStatus => {
    const passkeys = deps.passkey.available();
    const features = [...CASINO_FEATURES];
    const s = load();
    const last = lastRecord();
    // Both kinds this device holds, as public addresses, so the page can offer "open my passkey wallet" or "create one".
    const held = { ...(last ? { passkeyAddress: last.address } : {}), ...(s.device ? { deviceAddress: s.device.address } : {}) };
    if (identity && kind) return { state: 'unlocked', kind, address: identity.address, passkeys, features, ...held };
    // Offer what the player used last: the passkey wallet, or the browser-only one.
    if (s.lastKind === 'device' && s.device) return { state: 'known', kind: 'device', address: s.device.address, passkeys, features, ...held };
    if (last) return { state: 'known', kind: 'passkey', address: last.address, passkeys, features, ...held };
    if (s.device) return { state: 'known', kind: 'device', address: s.device.address, passkeys, features, ...held };
    return { state: 'none', passkeys, features };
  };
  const refreshIdle = () => { const v = status(); deps.ui.idle({ state: v.state, kind: v.kind, address: v.address, passkeys: v.passkeys }); };
  const lockNow = () => { identity = null; kind = null; };

  async function interact<T>(run: () => Promise<T>): Promise<T> {
    if (interactive) throw new Error('The casino wallet is already waiting for you in its panel.');
    interactive = true;
    try { return await run(); } finally { interactive = false; refreshIdle(); }
  }

  /** Make a passkey (in a new tab on WebKit), prove PRF twice, derive. Same order as the radio, so a funded wallet always opens. */
  async function create(): Promise<CasinoIdentity> {
    const existing = load().wallets;
    const exclude = existing.map((w) => w.credentialId);
    const createPanel: Panel = {
      kind: 'create',
      title: 'Make your casino wallet',
      summary: 'Saved with your passkey (Face ID, fingerprint or device code). Nothing to install, no seed phrase.',
      lines: [
        ...TESTNET_LINES,
        'Your browser will ask you to save a passkey. The wallet is rebuilt from it each visit; no key is stored anywhere.'
      ],
      warnings: ['If you delete the passkey, this wallet is gone. It only ever holds free testnet STX.'],
      confirmLabel: 'Create with passkey'
    };
    const resume = pendingNow();
    let created: { credentialId: string; prf?: Uint8Array };
    try {
      if (!deps.passkey.createsInNewTab?.() || !deps.passkey.openCreator) {
        if (resume?.credentialId) created = { credentialId: resume.credentialId };
        else {
          created = await deps.ui.act(createPanel, () => deps.passkey.create(exclude, PASSKEY_NAME));
          setPending({ at: now(), tries: 0, credentialId: created.credentialId });
        }
      } else {
        // WebKit will not create a passkey inside a cross-origin frame: make it on casino-wallet.xtrata.xyz/create in a new tab.
        let userId: string, label: string;
        if (resume?.userId && resume.label) { userId = resume.userId; label = resume.label; }
        else {
          const idBytes = crypto.getRandomValues(new Uint8Array(16));
          userId = b64u(idBytes);
          const tag = Array.from(idBytes.slice(0, 2), (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
          label = `${PASSKEY_NAME} · ${tag}`;
          const [u, l] = [userId, label];
          await deps.ui.act({
            ...createPanel,
            lines: [...createPanel.lines, 'On this browser the passkey is made on a page that opens in a new tab. Make it there, then come back to this tab.'],
            confirmLabel: 'Make my passkey (new tab)'
          }, async () => { setPending({ at: now(), tries: 0, userId: u, label: l }); deps.passkey.openCreator!(exclude, l, u); return true; });
        }
        const wanted = userId;
        created = await deps.ui.act({
          kind: 'confirm-passkey',
          title: 'Made your passkey?',
          summary: `In the new tab, tap "Create passkey". Then come back here, tap below and choose "${label}".`,
          lines: ['The wallet is ready as soon as that passkey is confirmed.'],
          confirmLabel: 'I made it: use my passkey'
        }, async () => {
          const r = await deps.passkey.evaluate();
          if (r.userHandle !== wanted) {
            r.prf.fill(0);
            throw Object.assign(new Error(`That is a different passkey. Choose "${label}", the one you just made.`), { retryable: true });
          }
          return r;
        });
        setPending({ at: now(), tries: 0, credentialId: created.credentialId });
      }
    } catch (e) {
      afterFailure(resume, e);
      throw e;
    }

    const outputs: Uint8Array[] = created.prf ? [created.prf] : [];
    try {
      while (outputs.length < 2) {
        const first = outputs.length === 0;
        const r = await deps.ui.act({
          kind: first ? 'confirm-passkey' : 'verify-passkey',
          title: first ? 'Confirm your passkey' : 'One more check',
          lines: [first ? 'Tap the passkey you just saved.' : 'Once more, to check it gives the same wallet every time.'],
          confirmLabel: 'Use passkey'
        }, () => deps.passkey.evaluate(created.credentialId));
        if (r.credentialId !== created.credentialId) throw new Error('A different passkey was used. Start again with the new one.');
        outputs.push(r.prf);
      }
      if (!equalBytes(outputs[0], outputs[1]))
        throw new Error('This passkey did not give a stable result on this device, so no wallet was made. Use "Play without a passkey" instead.');
      const id = await deriveCasinoIdentity(await casinoBase(outputs[0]));
      remember({ credentialId: created.credentialId, address: id.address });
      return id;
    } catch (e) {
      afterFailure(resume, e);
      throw e;
    } finally {
      outputs.forEach((o) => o.fill(0));
    }
  }

  async function unlock(anyPasskey: boolean): Promise<CasinoIdentity> {
    const last = anyPasskey ? undefined : lastRecord();
    const r = await deps.ui.act({
      kind: 'unlock',
      title: 'Welcome back',
      summary: (last ? short(last.address) + ' · ' : '') + 'One tap to open your casino wallet for this visit',
      lines: [...TESTNET_LINES, 'The key is rebuilt from your passkey and forgotten when you lock or close this page.'],
      confirmLabel: 'Open with passkey'
    }, () => deps.passkey.evaluate(last?.credentialId));
    let second: Uint8Array | undefined;
    try {
      const known = record(r.credentialId);
      if (!known) {
        // First use of this (synced) passkey here: prove PRF is stable on this device too.
        const again = await deps.ui.act({
          kind: 'verify-passkey',
          title: 'One more check',
          lines: ['New device: tap the same passkey once more to check it gives the same wallet.'],
          confirmLabel: 'Use passkey'
        }, () => deps.passkey.evaluate(r.credentialId));
        second = again.prf;
        if (again.credentialId !== r.credentialId || !equalBytes(r.prf, again.prf))
          throw new Error('This passkey did not give a stable result on this device. Nothing was signed.');
      }
      const id = await deriveCasinoIdentity(await casinoBase(r.prf));
      if (known && known.address !== id.address)
        throw new Error('This passkey no longer gives the same wallet on this device. Nothing was signed.');
      remember({ credentialId: r.credentialId, address: id.address });
      return id;
    } finally {
      r.prf.fill(0);
      second?.fill(0);
    }
  }

  /** The no-passkey wallet: made on first use, kept in this origin's storage. One tap to open, like the passkey one. */
  async function openDevice(): Promise<CasinoIdentity> {
    const existing = load().device;
    return deps.ui.act({
      kind: existing ? 'unlock' : 'create',
      title: existing ? 'Welcome back' : 'Play without a passkey',
      summary: existing
        ? `${short(existing.address)} · One tap to open your casino wallet`
        : 'A testnet wallet kept in this browser only. No passkey, nothing to install.',
      lines: TESTNET_LINES,
      warnings: existing ? undefined : ['Clearing this browser\'s data deletes this wallet. It only ever holds free testnet STX.'],
      confirmLabel: existing ? 'Open wallet' : 'Make my wallet'
    }, async () => {
      const s = load();
      let id: CasinoIdentity;
      if (s.device) id = identityFromKeyHex(s.device.key);
      else {
        const key = randomCasinoKeyHex();
        id = identityFromKeyHex(key);
        s.device = { key, address: id.address };
      }
      s.lastKind = 'device';
      save(s);
      return id;
    });
  }

  const handlers = {
    'casino.status': async (): Promise<CasinoStatus> => status(),

    'casino.open': (params: unknown): Promise<CasinoOpenResult> => interact(async () => {
      const p = params as CasinoOpenParams | undefined;
      const mode = p?.mode;
      if (mode !== 'create' && mode !== 'unlock' && mode !== 'device') throw new Error('Choose create, unlock or device.');
      if (identity && kind && (mode === 'device') === (kind === 'device')) return { address: identity.address, kind };
      if (mode !== 'device' && !deps.passkey.available()) throw new Error('This browser cannot use passkeys. Choose "Play without a passkey".');
      const opened = mode === 'device' ? await openDevice() : mode === 'create' ? await create() : await unlock(p?.anyPasskey === true);
      if (opened.address === EXCHANGE_ADDRESS) throw new Error('This wallet is the exchange itself and cannot buy chips.');
      identity = opened;
      kind = mode === 'device' ? 'device' : 'passkey';
      return { address: opened.address, kind };
    }),

    'casino.signBuy': async (params: unknown): Promise<CasinoSignBuyResult> => {
      if (!identity) throw new Error('Open the casino wallet first.');
      const buy = validateBuy((params ?? {}) as { stx: unknown; fee: unknown; nonce: unknown });
      const tx = await makeSTXTokenTransfer({ ...buyTransferOptions(buy), senderKey: identity.privateKey });
      const raw = tx.serialize() as unknown;
      return { raw: typeof raw === 'string' ? raw : bytesToHex(raw as Uint8Array), txid: '0x' + tx.txid() };
    },

    /**
     * The casino room's free sign-in (functions/lib/casino-room-proof.ts): the SIP-018 sentence the room server checks, for THIS
     * wallet's own address only, rebuilt here from the challenge's public fields so the page cannot make it sign anything else.
     * No panel while the wallet is open: the player's tap on "Casino wallet" in the Room panel is the consent
     * (docs/plans/CASINO-ROOM-NEW-WALLETS-PLAN.md, decision 1). It sends nothing and moves nothing.
     */
    'casino.signRoomJoin': async (params: unknown): Promise<{ signature: string }> => {
      if (!identity) throw new Error('Open the casino wallet first.');
      const p = (params ?? {}) as { address?: unknown; network?: unknown; nonce?: unknown; expires?: unknown };
      if (p.address !== identity.address) throw new Error('That room sign-in is for a different wallet.');
      if (p.network !== 'testnet') throw new Error('The casino wallet signs in on testnet only.');
      if (typeof p.nonce !== 'string' || !/^[a-f0-9]{64}$/.test(p.nonce)) throw new Error('Invalid room sign-in request.');
      const t = now();
      if (typeof p.expires !== 'number' || !Number.isSafeInteger(p.expires) || p.expires <= t || p.expires > t + ROOM_CHALLENGE_TTL_MS + 30_000)
        throw new Error('That room sign-in request has expired. Try again.');
      const data = roomProofData({ address: identity.address, network: 'testnet', nonce: p.nonce, expires: p.expires });
      const messageHash = bytesToHex(sha256(encodeStructuredData(data)));
      return { signature: signMessageHashRsv({ messageHash, privateKey: createStacksPrivateKey(identity.privateKey) }).data };
    },

    'casino.cancel': async (): Promise<{ withdrawn: boolean }> => ({ withdrawn: deps.ui.cancel() }),

    'casino.lock': async (): Promise<{ locked: true }> => { lockNow(); refreshIdle(); return { locked: true }; }
  };

  refreshIdle();
  return { handlers, lock: () => { lockNow(); refreshIdle(); }, status };
}
