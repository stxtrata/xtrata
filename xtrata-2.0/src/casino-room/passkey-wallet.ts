/**
 * ParallaX Casino: page side of the casino wallet (TESTNET). Built to public/casino/passkey-wallet.js by
 * `npm run build:casino-passkey` and loaded by public/casino/index.html. Sets `window.ParallaxPasskeyWallet`.
 *
 * Holds no key and can get none: the wallet lives on casino-wallet.xtrata.xyz in an iframe (src/casino-wallet/frame) and this side
 * only asks it things over the bridge. Like the radio, the wallet box is offline (connect-src 'none'), so this side does the network
 * work: the faucet, the nonce, checking what the box signed (checkSignedBuy) and broadcasting it.
 * Plan: docs/plans/CASINO-PASSKEY-WALLET-PLAN.md.
 */
import { WalletBridgeClient } from '../lib/wallet/passkey/bridge/client';
import { BUY_FEE, checkSignedBuy, EXCHANGE_ADDRESS } from '../lib/casino-wallet/tx';
import type { CasinoOpenResult, CasinoSignBuyResult, CasinoStatus } from '../lib/casino-wallet/messages';
import { verifyRoomProof, type RoomChallenge } from '../../functions/lib/casino-room-proof';

const w = window as any;
/** Overridable before this script loads, for local tests only. */
const ORIGIN: string = typeof w.ParallaxCasinoWalletOrigin === 'string' ? w.ParallaxCasinoWalletOrigin : 'https://casino-wallet.xtrata.xyz';
const API: string = typeof w.ParallaxCasinoTestnetApi === 'string' ? w.ParallaxCasinoTestnetApi : 'https://api.testnet.hiro.so';
const OPEN_TIMEOUT_MS = 30 * 60_000;
const QUICK_TIMEOUT_MS = 15_000;

/** An error that means nothing reached the network, so the exchange can drop its pending record. */
const notSent = (message: string) => Object.assign(new Error(message), { code: 'NOT_SENT' });

let host: HTMLElement | null = null;
let frame: HTMLIFrameElement | null = null;
let client: WalletBridgeClient | null = null;
let loading: Promise<WalletBridgeClient> | null = null;

/** The element the wallet frame sits in. Set once by the page; the frame is only made when first needed. */
function attach(el: HTMLElement) { host = el; }

function connectFrame(): Promise<WalletBridgeClient> {
  if (client) return Promise.resolve(client);
  if (loading) return loading;
  if (!host) return Promise.reject(new Error('The casino wallet has nowhere to appear. Reload the page.'));
  const where = host;
  loading = new Promise<WalletBridgeClient>((resolve, reject) => {
    const f = document.createElement('iframe');
    f.title = 'Xtrata casino wallet (testnet)';
    f.className = 'lx-wallet-frame';
    // A cross-origin frame may use passkeys only when the page grants it (docs/PASSKEY-WALLET.md §5a rule 2).
    f.setAttribute('allow', `publickey-credentials-get ${ORIGIN}; publickey-credentials-create ${ORIGIN}`);
    f.referrerPolicy = 'no-referrer';
    const timer = setTimeout(() => { loading = null; reject(new Error('The casino wallet did not load. Check your connection and try again.')); }, 15_000);
    f.addEventListener('load', () => {
      clearTimeout(timer);
      frame = f;
      client = new WalletBridgeClient({ walletOrigin: ORIGIN, frame: f, timeoutMs: OPEN_TIMEOUT_MS });
      resolve(client);
    }, { once: true });
    f.src = ORIGIN + '/';
    where.replaceChildren(f);
  });
  return loading;
}

/** Quick calls must not hang the page if the frame stops answering. */
const quick = <T>(c: WalletBridgeClient, method: Parameters<WalletBridgeClient['request']>[0], params?: unknown) =>
  Promise.race([
    c.request<T>(method, params),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('The casino wallet is not answering. Reload the page.')), QUICK_TIMEOUT_MS))
  ]);

/** Show the frame only while the player has something to do in it (create, unlock, confirm). */
const show = (on: boolean) => { if (host) host.hidden = !on; };

async function status(): Promise<CasinoStatus> {
  return quick<CasinoStatus>(await connectFrame(), 'casino.status');
}

async function open(mode: 'create' | 'unlock' | 'device', anyPasskey = false): Promise<CasinoOpenResult> {
  const c = await connectFrame();
  show(true);
  try {
    return await c.request<CasinoOpenResult>('casino.open', { mode, anyPasskey });
  } finally {
    show(false);
  }
}

async function cancel(): Promise<void> {
  if (client) { try { await quick(client, 'casino.cancel'); } catch { /* nothing waiting */ } }
  show(false);
}

async function lock(): Promise<void> {
  if (client) { try { await quick(client, 'casino.lock'); } catch { /* frame gone: the key went with it */ } }
}

async function json(path: string, init?: RequestInit) {
  const r = await fetch(API + path, { ...init, cache: 'no-store', signal: AbortSignal.timeout(15_000) });
  const body = await r.json().catch(() => null);
  return { status: r.status, ok: r.ok, body };
}

async function nextNonce(address: string): Promise<bigint> {
  const r = await json(`/extended/v1/address/${encodeURIComponent(address)}/nonces`);
  const n = r.body?.possible_next_nonce;
  if (!r.ok || !Number.isSafeInteger(n) || n < 0) throw notSent('Could not read this wallet from the testnet. Nothing was sent; try again.');
  return BigInt(n);
}

const hexToBytes = (hex: string) => Uint8Array.from(hex.replace(/^0x/, '').match(/../g)!, (b) => parseInt(b, 16));

/** Broadcast the same signed bytes. A refusal on the first try means nothing was sent; after a lost answer the outcome is unknown. */
async function broadcast(raw: string, txid: string): Promise<{ txid: string; uncertain?: true }> {
  let lostAnswer = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    let r: Response;
    try {
      r = await fetch(API + '/v2/transactions', { method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: hexToBytes(raw), signal: AbortSignal.timeout(15_000) });
    } catch {
      lostAnswer = true;
      await new Promise((ok) => setTimeout(ok, 1500 * (attempt + 1)));
      continue;
    }
    const body = await r.json().catch(() => null);
    if (r.ok && typeof body === 'string' && body.replace(/^0x/, '') === txid.replace(/^0x/, '')) return { txid };
    if (r.status >= 500) { lostAnswer = true; await new Promise((ok) => setTimeout(ok, 1500 * (attempt + 1))); continue; }
    if (!lostAnswer) throw notSent(`The testnet refused the transfer (${body?.reason || r.status}). Nothing was sent.`);
    break; // an earlier try may have landed: let the exchange check the transaction id
  }
  return { txid, uncertain: true };
}

/** Buy chips: sign one 1-10 STX transfer to the exchange in the box, check it, broadcast it. Resolves with { txid }. */
async function buy(o: { stx: number; address: string }): Promise<{ txid: string }> {
  if (!client) throw notSent('Open your casino wallet first.');
  if (o.address === EXCHANGE_ADDRESS) throw notSent('The exchange cannot pay itself.');
  const nonce = await nextNonce(o.address);
  let signed: CasinoSignBuyResult;
  try {
    signed = await quick<CasinoSignBuyResult>(client, 'casino.signBuy', { stx: o.stx, fee: BUY_FEE.toString(), nonce: nonce.toString() });
  } catch (e) {
    throw notSent((e as Error).message || 'The casino wallet did not sign. Nothing was sent.');
  }
  let txid: string;
  try {
    txid = checkSignedBuy(signed.raw, { address: o.address, stx: o.stx, fee: BUY_FEE, nonce });
  } catch (e) {
    throw notSent((e as Error).message);
  }
  if (txid !== signed.txid) throw notSent('The casino wallet reported a different transaction. Nothing was sent.');
  return broadcast(signed.raw, txid);
}

/** Ask Hiro's testnet faucet for STX (it sends 500). Resolves with the faucet's transaction id. */
async function faucet(address: string): Promise<string> {
  let r: { status: number; ok: boolean; body: any };
  try {
    r = await json(`/extended/v1/faucets/stx?address=${encodeURIComponent(address)}`, { method: 'POST' });
  } catch {
    throw new Error('The testnet faucet did not answer. Try again in a minute.');
  }
  if (r.status === 429) throw new Error('The testnet faucet is busy (one request a minute). Try again in a minute.');
  if (!r.ok || r.body?.success !== true || typeof r.body?.txId !== 'string')
    throw new Error(`The testnet faucet could not send STX right now (${r.body?.error || r.status}). Try again shortly.`);
  return r.body.txId;
}

/**
 * The casino room's free sign-in, signed by the open casino wallet (docs/plans/CASINO-ROOM-NEW-WALLETS-PLAN.md). Only the
 * challenge's public fields go to the box; the signature is checked here with the room server's own check before it is used.
 */
async function signRoomJoin(challenge: RoomChallenge): Promise<string> {
  if (!client) throw new Error('Open your casino wallet first.');
  const { signature } = await quick<{ signature: string }>(client, 'casino.signRoomJoin', {
    address: challenge.address, network: challenge.network, nonce: challenge.nonce, expires: challenge.expires
  });
  if (!verifyRoomProof(challenge, signature)) throw new Error('The casino wallet did not sign the room sign-in correctly. Nothing was sent.');
  return signature;
}

w.ParallaxPasskeyWallet = Object.freeze({
  version: '1.1.0',
  origin: ORIGIN,
  /** Network fee for one buy, in microSTX (add it to the amount when checking the balance). */
  fee: Number(BUY_FEE),
  attach, status, open, cancel, lock, buy, faucet, signRoomJoin
});
try { window.dispatchEvent(new Event('parallax-passkey-wallet')); } catch { /* old browsers */ }
