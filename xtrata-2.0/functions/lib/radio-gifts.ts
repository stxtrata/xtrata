/**
 * Radio gift wallets (server). Plan: Xtrata Music project, claude/radio-gift-wallets-plan.md.
 *
 * A gift link funds a NEW listening wallet from the gift treasury: a dedicated wallet whose key is a
 * Cloudflare secret and which holds only gift money (never the admin's own, deployer or sponsor
 * wallets).
 *
 * How the treasury never pays twice:
 *  - ONE send at a time. A send (claim or refund) is a row in radio_gift_sends with its nonce and
 *    signed bytes, written BEFORE broadcast; a partial unique index allows only one unsettled send,
 *    so concurrent requests cannot both send.
 *  - The send row and the gift's change of state are written in ONE transaction (D1 batch), so there
 *    is never a send without its gift marked, nor a gift marked without its send.
 *  - A send is settled only by the chain, read from ONE source (the Hiro indexer): one of its
 *    transactions succeeded (done), or the indexer shows its nonce executed by something that did not
 *    pay (seen twice, minutes apart) before the gift is released to be sent again.
 *  - Nothing is ever released because a broadcast failed: a refused or unanswered broadcast stays
 *    open and is retried. A stuck send is re-signed with the SAME nonce and a higher fee, so at most
 *    one of its transactions can ever land.
 *  - A friend's deposit is never forgotten: unpaid gifts are kept (abandoned) and still matched by
 *    memo; a memo'd deposit that matches no gift is recorded for a refund (radio_gift_orphans).
 *  - A prefunded BATCH is N gift rows (source 'friend', gifter = the creator) made dormant by one signed request and made
 *    live together, in one transaction, by ONE deposit (memo `batch <id>`). The treasury therefore never pays a copy out
 *    of its own money: every claimable copy is backed by a confirmed deposit, and an unclaimed copy goes back to the creator.
 *
 * Variables (Cloudflare Pages):
 *   RADIO_GIFT_ENABLED = "1"            kill switch; anything else stops claims, new gifts and refunds
 *   RADIO_GIFT_TREASURY_KEY             the treasury's private key (secret)
 *   RADIO_GIFT_ADMIN = "SP…"            the addresses that may sign campaign and player requests (several: separate with commas)
 *   RADIO_GIFT_ESCROW_CAP               most creator- and friend-funded money held at once, including batches still waiting for their payment (default 50 STX)
 *   RADIO_GIFT_TURNSTILE_SITE_KEY / _SECRET   optional Cloudflare Turnstile check on claims
 *   TELEMETRY_SALT                      salts the IP hash used for per-IP limits (no IP is stored)
 * Gifts also need pay-per-play to be on and the radio host (functions/lib/radio-listening-wallet.ts).
 */
import { AnchorMode, cvToHex, cvToJSON, getAddressFromPrivateKey, hexToCV, makeSTXTokenTransfer, TransactionVersion, encodeStructuredData, uintCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { queryAll, run } from './db';
import { applyHiroApiKey, getHiroApiKeys, isTransientHiroStatus, shouldRetryWithNextHiroKey } from './hiro-keys';
import { checkSlotBinding, ensureSlotTable, gate, type PppEnv, type SlotSubmission } from './radio-listening-wallet';
import { isMainnetStandardAddress } from '../../src/lib/listening-wallet/link';
import {
  isPlayerId, playerData, playerHash, validatePlayer, validatePlayerRequest, verifyPlayerSignature, type PlayerDefinition, type PlayerRequest, type PlayerView
} from '../../src/lib/listening-wallet/gift-players';
import {
  batchDeposit, batchDepositMemo, batchRequestHash, BATCH_MEMO, isBatchId, validateBatch, verifyBatchSignature, type BatchRequest, type BatchView
} from '../../src/lib/listening-wallet/batches';
import {
  GIFT_EXPIRY_MS, GIFT_FEE, GIFT_FEE_CAP, GIFT_MEMO, giftCodeHash, giftDepositMemo, isGiftCode, newGiftCode,
  validGiftAmount, type GiftView
} from '../../src/lib/listening-wallet/gifts';

export type GiftEnv = PppEnv & {
  RADIO_GIFT_ENABLED?: string;
  RADIO_GIFT_TREASURY_KEY?: string;
  RADIO_GIFT_ADMIN?: string;
  RADIO_GIFT_ESCROW_CAP?: string;
  /** Shared secret for the scheduled sweep (workers/radio-gift-sweep). Unset: the sweep endpoint does not exist. */
  RADIO_GIFT_SWEEP_SECRET?: string;
  RADIO_GIFT_TURNSTILE_SITE_KEY?: string;
  RADIO_GIFT_TURNSTILE_SECRET?: string;
  TELEMETRY_SALT?: string;
};

/** The most money held for creators and friends at once (a batch still waiting for its payment counts too). */
export const DEFAULT_ESCROW_CAP = 50_000_000n;
/** Unpaid batches one creator may have waiting at once (each is dropped after PENDING_DEPOSIT_MS). */
export const MAX_PENDING_BATCHES = 10;
/** Claims per IP (hashed) per 24 hours. */
export const CLAIMS_PER_IP = 10;
/** Friend gifts started per IP per hour (each needs a real deposit to go live). */
export const CREATES_PER_IP = 10;
/** A friend gift nobody paid for is dropped after this long (after one last look for its deposit). */
export const PENDING_DEPOSIT_MS = 24 * 3600_000;
/** A sent transaction not yet confirmed is broadcast again (same bytes) this often. */
export const REBROADCAST_MS = 2 * 60_000;
/** ...and this often while its last broadcast failed. */
export const RETRY_FAILED_MS = 20_000;
/** A send still unconfirmed this long after its last signature is re-signed: same nonce, higher fee. */
export const BUMP_AFTER_MS = 15 * 60_000;
export const SCAN_EVERY_MS = 10 * 60_000;
export const SCAN_WHILE_EXPECTING_MS = 60_000;
/** Most expired copies one refund transfer returns (one gifter, one transfer, one network fee). */
export const REFUND_GROUP_MAX = 40;
/** A used nonce with no successful send must still be the case this much later before release. */
export const NONCE_SETTLE_MS = 5 * 60_000;

export class GiftError extends Error {
  constructor(message: string, public status = 400) { super(message); this.name = 'GiftError'; }
}

// ---------------------------------------------------------------------------- chain

export interface ChainTransfer {
  /** aborted: mined but failed (its nonce is used); dropped: left the mempool (may still come back). */
  status: 'success' | 'pending' | 'aborted' | 'dropped';
  sender: string; recipient: string; amount: bigint; memo: string;
}
export interface GiftChain {
  /** Confirmed balance (microSTX). */
  balance(address: string): Promise<bigint>;
  /** Number of transactions involving the address (sent or received), including the mempool. */
  activity(address: string): Promise<number>;
  /** Next nonce counting the mempool (to sign with). */
  nonce(address: string): Promise<bigint>;
  /**
   * The highest nonce the INDEXER has seen executed for the address (null: none yet). Read from the
   * same source as `transfer`, so "nonce used" and "our transaction succeeded" can never disagree
   * because one of them lags.
   */
  executedNonce(address: string): Promise<bigint | null>;
  /** Broadcast signed bytes, once (never re-posted). Throws on any failure; callers treat that as "maybe sent". */
  broadcast(raw: Uint8Array, txid: string): Promise<string>;
  /** An STX transfer by txid, or null when the chain does not know it (yet). */
  transfer(txid: string): Promise<ChainTransfer | null>;
  /** STX transfers TO an address with their memos: the mempool, then the newest confirmed pages. */
  inbound(address: string): Promise<(ChainTransfer & { txid: string })[]>;
  /** Who holds a song (an inscription of the radio's core contract); null when no one does. Throws when the chain cannot say. */
  ownerOf(tokenId: number): Promise<string | null>;
}

/** The core contract the radio's songs live on. */
const SONG_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

const HIRO = 'https://api.mainnet.hiro.so';
const memoText = (hex: unknown) => {
  if (typeof hex !== 'string') return '';
  try { return new TextDecoder().decode(hexToBytes(hex.replace(/^0x/, ''))).replace(/\0+$/, '').trim(); } catch { return ''; }
};
const parseTransfer = (tx: any): ChainTransfer & { txid: string } => {
  const s = String(tx.tx_status);
  const status = s === 'success' && tx.canonical !== false && !tx.is_unanchored ? 'success'
    : s === 'pending' || s === 'success' ? 'pending' : s.startsWith('dropped') ? 'dropped' : 'aborted';
  return { txid: String(tx.tx_id), status, sender: String(tx.sender_address), recipient: String(tx.token_transfer.recipient_address), amount: BigInt(tx.token_transfer.amount), memo: memoText(tx.token_transfer.memo) };
};

export function hiroGiftChain(env: GiftEnv): GiftChain {
  const fetchHiro = async (path: string, init: RequestInit = {}) => {
    const keys = [...getHiroApiKeys(env), null];
    let last: unknown;
    for (let i = 0; i < keys.length; i++) {
      const headers = new Headers(init.headers); applyHiroApiKey(headers, keys[i]);
      try {
        const r = await fetch(HIRO + path, { ...init, headers, signal: AbortSignal.timeout(10_000) });
        if (i < keys.length - 1 && shouldRetryWithNextHiroKey(r.status)) continue;
        return r;
      } catch (e) { last = e; }
    }
    throw last instanceof Error ? last : new Error('Hiro request failed');
  };
  const read = async <T,>(path: string): Promise<T> => {
    for (let attempt = 0; ; attempt++) {
      const r = await fetchHiro(path);
      if (r.ok) return (await r.json()) as T;
      if (attempt < 2 && isTransientHiroStatus(r.status)) { await new Promise((ok) => setTimeout(ok, 300 * (attempt + 1))); continue; }
      throw new GiftError('Could not reach the chain right now. Try again shortly.', 503);
    }
  };
  const int = (v: unknown, what: string) => { if (!Number.isSafeInteger(v) || (v as number) < 0) throw new GiftError(`Could not read ${what} right now.`, 503); return v as number; };
  return {
    async balance(address) {
      const b = await read<{ balance?: unknown }>(`/extended/v2/addresses/${address}/balances/stx`);
      if (typeof b.balance !== 'string' || !/^\d+$/.test(b.balance)) throw new GiftError('Could not read a balance right now.', 503);
      return BigInt(b.balance);
    },
    async activity(address) {
      const [done, waiting] = await Promise.all([
        read<{ total?: unknown }>(`/extended/v1/address/${address}/transactions?limit=1`),
        read<{ total?: unknown }>(`/extended/v1/address/${address}/mempool?limit=1`)
      ]);
      return int(done.total, 'the wallet') + int(waiting.total, 'the wallet');
    },
    async nonce(address) {
      return BigInt(int((await read<{ possible_next_nonce?: unknown }>(`/extended/v1/address/${address}/nonces`)).possible_next_nonce, 'the treasury nonce'));
    },
    async executedNonce(address) {
      const n = await read<{ last_executed_tx_nonce?: unknown }>(`/extended/v1/address/${address}/nonces`);
      if (n.last_executed_tx_nonce === null) return null;
      return BigInt(int(n.last_executed_tx_nonce, 'the treasury nonce'));
    },
    async broadcast(raw, txid) {
      // Keys are tried in turn ONLY when Hiro turned the request away before reading it (401/403/429):
      // that is the same rotation as every read, and without it one bad or throttled key meant no gift
      // was ever broadcast. A POST that threw (lost response) is never repeated here: the send stays
      // open and the sweep sends the same bytes again later.
      // api.hiro.so first: it is the host the sponsor relay has broadcast through from these same
      // Functions in production for months; the mainnet host is the fallback.
      const attempts = ['https://api.hiro.so', HIRO].flatMap((host) => [...getHiroApiKeys(env), null].map((key) => ({ host, key })));
      for (let i = 0; i < attempts.length; i++) {
        const headers = new Headers({ 'content-type': 'application/octet-stream' });
        applyHiroApiKey(headers, attempts[i].key);
        const r = await fetch(attempts[i].host + '/v2/transactions', { method: 'POST', headers, body: raw.slice() as BodyInit, signal: AbortSignal.timeout(15_000) });
        if (r.ok) return txid;
        if (i < attempts.length - 1 && shouldRetryWithNextHiroKey(r.status)) continue;
        const text = await r.text().catch(() => '');
        let reason = '';
        try { const j = JSON.parse(text); reason = [j.reason, j.error].filter(Boolean).join(': '); } catch { reason = text.slice(0, 120); }
        throw new GiftError(`Broadcast refused (HTTP ${r.status}${reason ? `, ${reason}` : ''})`, 502);
      }
      throw new GiftError('Broadcast refused', 502);
    },
    async transfer(txid) {
      const r = await fetchHiro(`/extended/v1/tx/${txid}`);
      if (r.status === 404) return null;
      if (!r.ok) throw new GiftError('Could not check the transaction right now.', 503);
      const tx = await r.json() as any;
      if (tx.tx_type !== 'token_transfer' || !tx.token_transfer) throw new GiftError('That transaction is not an STX transfer.', 400);
      return parseTransfer(tx);
    },
    async inbound(address) {
      const pages = await Promise.all([
        read<{ results?: unknown }>(`/extended/v1/address/${address}/mempool?limit=50`),
        ...[0, 50, 100, 150].map((offset) => read<{ results?: unknown }>(`/extended/v1/address/${address}/transactions?limit=50&offset=${offset}`))
      ]);
      if (pages.some((p) => !Array.isArray(p.results))) throw new GiftError('Could not read the treasury right now.', 503);
      return pages.flatMap((p) => p.results as any[]).filter((tx) => tx?.tx_type === 'token_transfer' && tx.token_transfer?.recipient_address === address).map(parseTransfer);
    },
    async ownerOf(tokenId) {
      const [address, name] = SONG_CONTRACT.split('.');
      const r = await fetchHiro(`/v2/contracts/call-read/${address}/${name}/get-owner`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sender: address, arguments: [cvToHex(uintCV(tokenId))] })
      });
      if (!r.ok) throw new GiftError(`Could not check who owns song #${tokenId} right now. Try again shortly.`, 503);
      const body = await r.json().catch(() => null) as { okay?: boolean; result?: string } | null;
      if (!body?.okay || typeof body.result !== 'string') throw new GiftError(`Could not check who owns song #${tokenId} right now. Try again shortly.`, 503);
      const holder = principalIn(cvToJSON(hexToCV(body.result)));
      if (holder === undefined) throw new GiftError(`Could not read who owns song #${tokenId}.`, 503);
      return holder;
    }
  };
}

/** The principal inside a `(ok (some principal))` reply; null for `(ok none)`; undefined when it is neither. */
export function principalIn(json: any): string | null | undefined {
  let v = json;
  for (let i = 0; i < 4 && v; i++) {
    if (v.type === 'principal' && typeof v.value === 'string') return v.value;
    if (typeof v.type === 'string' && v.type.includes('none')) return null;
    v = v.value;
  }
  return v === null ? null : undefined;
}

// ---------------------------------------------------------------------------- config

export function treasuryAddress(env: GiftEnv): string | null {
  const key = typeof env.RADIO_GIFT_TREASURY_KEY === 'string' ? env.RADIO_GIFT_TREASURY_KEY.trim() : '';
  if (!/^[0-9a-fA-F]{64}(01)?$/.test(key)) return null;
  try { return getAddressFromPrivateKey(key, TransactionVersion.Mainnet); } catch { return null; }
}
/** The gift admins: `RADIO_GIFT_ADMIN` is one address or several separated by commas or spaces. Anything that is not a mainnet address is ignored. */
export const adminAddresses = (env: GiftEnv): string[] =>
  [...new Set((env.RADIO_GIFT_ADMIN ?? '').split(/[\s,;]+/).map((a) => a.trim()).filter((a) => isMainnetStandardAddress(a)))];
const isAdmin = (env: GiftEnv, address: unknown) => typeof address === 'string' && adminAddresses(env).includes(address);
const micro = (value: string | undefined, fallback: bigint) => (typeof value === 'string' && /^\d{1,12}$/.test(value.trim()) ? BigInt(value.trim()) : fallback);

/** What the radio page needs to know (public). Gifts are off unless every piece is in place. */
export function giftsConfig(env: GiftEnv, main: string | null, request?: Request) {
  const g = gate(env, null, request);
  const treasury = treasuryAddress(env);
  const enabled = g.enabled && g.here && env.RADIO_GIFT_ENABLED === '1' && !!treasury;
  const turnstile = enabled && env.RADIO_GIFT_TURNSTILE_SITE_KEY && env.RADIO_GIFT_TURNSTILE_SECRET ? env.RADIO_GIFT_TURNSTILE_SITE_KEY : null;
  return { enabled, treasury: enabled ? treasury : null, turnstileSiteKey: turnstile, admin: enabled && !!main && isAdmin(env, main), fee: GIFT_FEE.toString() };
}

const requireEnabled = (env: GiftEnv, request?: Request) => {
  const c = giftsConfig(env, null, request);
  if (!c.enabled || !c.treasury) throw new GiftError('Gifts are switched off right now. Listening stays free.', 503);
  return { treasury: c.treasury, key: env.RADIO_GIFT_TREASURY_KEY!.trim() };
};

// ---------------------------------------------------------------------------- storage

export async function ensureGiftTables(env: GiftEnv) {
  await run(env, `CREATE TABLE IF NOT EXISTS radio_gifts(
    id TEXT PRIMARY KEY, code_hash TEXT NOT NULL UNIQUE, amount INTEGER NOT NULL, source TEXT NOT NULL,
    gifter TEXT, label TEXT NOT NULL DEFAULT '', status TEXT NOT NULL, deposit_txid TEXT UNIQUE,
    created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, claimed_by TEXT UNIQUE, claim_txid TEXT,
    claimed_at INTEGER, ip_hash TEXT, refund_txid TEXT, updated_at INTEGER NOT NULL)`);
  await run(env, 'CREATE INDEX IF NOT EXISTS radio_gifts_status ON radio_gifts(status, expires_at)');
  await run(env, 'CREATE INDEX IF NOT EXISTS radio_gifts_claimed ON radio_gifts(claimed_at)');
  await run(env, `CREATE TABLE IF NOT EXISTS radio_gift_sends(
    id TEXT PRIMARY KEY, gift_id TEXT NOT NULL, kind TEXT NOT NULL, nonce INTEGER NOT NULL, recipient TEXT NOT NULL,
    amount INTEGER NOT NULL, fee INTEGER NOT NULL, txids TEXT NOT NULL, raw TEXT NOT NULL, status TEXT NOT NULL,
    created_at INTEGER NOT NULL, signed_at INTEGER NOT NULL, broadcast_at INTEGER NOT NULL, nonce_used_at INTEGER, updated_at INTEGER NOT NULL)`);
  await run(env, "CREATE UNIQUE INDEX IF NOT EXISTS radio_gift_sends_one_open ON radio_gift_sends(status) WHERE status='sent'");
  // Added after the first release: why the last broadcast failed (null when it went through).
  await run(env, 'ALTER TABLE radio_gift_sends ADD COLUMN last_error TEXT').catch(() => undefined);
  await run(env, 'CREATE TABLE IF NOT EXISTS radio_gift_campaigns(hash TEXT PRIMARY KEY, admin TEXT NOT NULL, created_at INTEGER NOT NULL)');
  await run(env, `CREATE TABLE IF NOT EXISTS radio_gift_players(
    id TEXT PRIMARY KEY, hash TEXT NOT NULL UNIQUE, owner TEXT NOT NULL, title TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '',
    tracks TEXT NOT NULL, cover INTEGER, status TEXT NOT NULL DEFAULT 'active', created_at INTEGER NOT NULL)`);
  // Added with gift players: the player a link opens (null for every earlier gift).
  await run(env, 'ALTER TABLE radio_gifts ADD COLUMN player_id TEXT').catch(() => undefined);
  // Added with derived wallets: a gift claimed into one of a passkey's numbered wallets records which passkey (its first
  // wallet, `root`) and which number. One gift per (root, number): two phones with the same passkey can never share a wallet.
  await run(env, 'ALTER TABLE radio_gifts ADD COLUMN root TEXT').catch(() => undefined);
  await run(env, 'ALTER TABLE radio_gifts ADD COLUMN slot INTEGER').catch(() => undefined);
  await run(env, 'CREATE UNIQUE INDEX IF NOT EXISTS radio_gifts_root_slot ON radio_gifts(root, slot) WHERE root IS NOT NULL');
  await run(env, `CREATE TABLE IF NOT EXISTS radio_gift_orphans(txid TEXT PRIMARY KEY, gift_id TEXT, sender TEXT NOT NULL, amount INTEGER NOT NULL,
    reason TEXT NOT NULL, status TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`);
  // Added with prefunded batches: a creator pays for N copies in one deposit. The batch row holds the signed request's hash
  // (each works once) and the one payment that made it live (unique: one payment can never fund two batches).
  await run(env, `CREATE TABLE IF NOT EXISTS radio_gift_batches(
    id TEXT PRIMARY KEY, request_hash TEXT NOT NULL UNIQUE, creator TEXT NOT NULL, player_id TEXT, count INTEGER NOT NULL,
    amount INTEGER NOT NULL, label TEXT NOT NULL DEFAULT '', status TEXT NOT NULL, deposit_txid TEXT UNIQUE,
    created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`);
  await run(env, 'CREATE INDEX IF NOT EXISTS radio_gift_batches_creator ON radio_gift_batches(creator, created_at)');
  await run(env, 'ALTER TABLE radio_gifts ADD COLUMN batch_id TEXT').catch(() => undefined);
  await run(env, 'CREATE INDEX IF NOT EXISTS radio_gifts_batch ON radio_gifts(batch_id)');
}

type Row = {
  id: string; code_hash: string; amount: number; source: 'campaign' | 'friend'; gifter: string | null; label: string; status: string;
  deposit_txid: string | null; created_at: number; expires_at: number; claimed_by: string | null; claim_txid: string | null;
  claimed_at: number | null; ip_hash: string | null; refund_txid: string | null; updated_at: number; player_id?: string | null; root?: string | null; slot?: number | null;
  batch_id?: string | null;
};
type BatchRow = {
  id: string; request_hash: string; creator: string; player_id: string | null; count: number; amount: number; label: string;
  status: 'pending-deposit' | 'live' | 'abandoned'; deposit_txid: string | null; created_at: number; expires_at: number; updated_at: number;
};
type Send = {
  id: string; gift_id: string; kind: 'claim' | 'refund'; nonce: number; recipient: string; amount: number; fee: number;
  txids: string; raw: string; status: 'sent' | 'done' | 'void'; created_at: number; signed_at: number; broadcast_at: number; nonce_used_at: number | null;
  last_error: string | null;
};
const all = async <T,>(env: GiftEnv, sql: string, binds: unknown[] = []) => ((await queryAll(env, sql, binds)).results ?? []) as T[];
const one = async <T = Row,>(env: GiftEnv, sql: string, binds: unknown[] = []) => (await all<T>(env, sql, binds))[0] ?? null;
const changed = (r: unknown) => { const x = r as { meta?: { changes?: number }; changes?: number }; return x?.meta?.changes ?? x?.changes ?? 0; };
const isConstraint = (e: unknown) => /UNIQUE|constraint/i.test(String((e as Error)?.message ?? e));
const randomId = () => bytesToHex(crypto.getRandomValues(new Uint8Array(12)));
export const ipHash = (env: GiftEnv, ip: string | null) => (ip ? bytesToHex(sha256(new TextEncoder().encode(`${env.TELEMETRY_SALT || 'xtrata-radio-gifts'}:${ip}`))).slice(0, 32) : null);
const gift = (env: GiftEnv, id: string) => one(env, 'SELECT * FROM radio_gifts WHERE id=?', [id]);

const view = (r: Row): GiftView => ({
  // An abandoned gift is still waiting for its payment, as far as anyone looking at it is concerned.
  status: (r.status === 'abandoned' ? 'pending-deposit' : ['pending-deposit', 'live', 'claiming', 'claimed', 'expired', 'refunding', 'refunded'].includes(r.status) ? r.status : 'unknown') as GiftView['status'],
  amount: String(r.amount), source: r.source, from: r.gifter, label: r.label, expires: r.expires_at
});

/** Money the treasury holds for others: unclaimed friend gifts (amount + fee) and deposits awaiting a refund. */
const owedToFriends = async (env: GiftEnv) => {
  const r = await one<{ owed: number }>(env, `SELECT COALESCE(SUM(amount + ?), 0) AS owed FROM radio_gifts WHERE source='friend' AND status IN ('live','refunding')`, [Number(GIFT_FEE)]);
  const o = await one<{ owed: number }>(env, "SELECT COALESCE(SUM(amount), 0) AS owed FROM radio_gift_orphans WHERE status='needs-refund'");
  return BigInt(r?.owed ?? 0) + BigInt(o?.owed ?? 0);
};
const d1 = (env: GiftEnv) => ((env as any).DB ?? (env as any).D1 ?? (env as any).db) as { prepare(q: string): any; batch(list: any[]): Promise<any[]> };

// ---------------------------------------------------------------------------- treasury sends

async function sign(key: string, recipient: string, amount: bigint, nonce: bigint, fee: bigint) {
  const tx = await makeSTXTokenTransfer({ recipient, amount, senderKey: key, network: new StacksMainnet(), nonce, fee, memo: GIFT_MEMO, anchorMode: AnchorMode.Any });
  return { raw: tx.serialize(), txid: '0x' + tx.txid() };
}

/**
 * Starts the one open send. The gift's change of state and the send row (nonce, bytes, txid) are
 * written in one transaction BEFORE broadcast: if the gift is no longer in the expected state, or
 * another send is open, nothing is written and nothing is sent. After that, the send stays open
 * whatever the broadcast says; only the chain settles it.
 */
async function startSend(env: GiftEnv, deps: GiftDeps, treasury: string, key: string, kind: 'claim' | 'refund', r: Row, recipient: string, ip: string | null = null, bind: SlotSubmission | null = null, group: Row[] = [r]) {
  if (await one(env, "SELECT id FROM radio_gift_sends WHERE status='sent'")) throw new GiftError('The gift treasury is sending another gift. Trying again in a moment…', 503);
  const done = await one<{ n: number | null }>(env, "SELECT MAX(nonce) AS n FROM radio_gift_sends WHERE status='done'");
  const floor = done?.n === null || done?.n === undefined ? 0n : BigInt(done.n) + 1n;
  const fromChain = await deps.chain.nonce(treasury);
  const nonce = fromChain > floor ? fromChain : floor;
  // A refund may return several expired copies of one gifter in ONE transfer. The gifter paid a network fee with every
  // copy and the treasury pays only one, so they get the other fees back too: they lose exactly one network fee.
  if (kind === 'claim' && group.length !== 1) throw new GiftError('A claim sends exactly one gift.', 500);
  const total = group.reduce((sum, g) => sum + BigInt(g.amount), 0n) + GIFT_FEE * BigInt(group.length - 1);
  const amount = kind === 'refund' ? total : BigInt(r.amount);
  const tx = await sign(key, recipient, amount, nonce, GIFT_FEE);
  const id = randomId(), now = deps.now, db = d1(env);
  const markGifts = kind === 'refund' ? group.map((g) => db.prepare(`UPDATE radio_gifts SET status='refunding', refund_txid=?, updated_at=? WHERE id=? AND status='live'`).bind(tx.txid, now, g.id)) : [];
  const markGift = kind === 'claim'
    ? db.prepare(`UPDATE radio_gifts SET status='claiming', claimed_by=?, claim_txid=?, claimed_at=?, ip_hash=COALESCE(?, ip_hash), root=?, slot=?, updated_at=? WHERE id=? AND status='live'`)
      .bind(recipient, tx.txid, now, ip, bind?.root ?? null, bind?.slot ?? null, now, r.id)
    : null;
  // The send is recorded only if EVERY copy it returns moved to `refunding` with this transaction; otherwise the copies
  // that did move are put back in the same transaction, so a refund can never be half-recorded.
  const insertSend = db.prepare(`INSERT INTO radio_gift_sends(id, gift_id, kind, nonce, recipient, amount, fee, txids, raw, status, created_at, signed_at, broadcast_at, updated_at)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent', ?, ?, ?, ?
    WHERE ${kind === 'claim' ? "EXISTS (SELECT 1 FROM radio_gifts WHERE id=? AND status='claiming' AND claim_txid=?)" : "(SELECT COUNT(*) FROM radio_gifts WHERE status='refunding' AND refund_txid=?) = ?"}`)
    .bind(id, r.id, kind, Number(nonce), recipient, amount.toString(), Number(GIFT_FEE), JSON.stringify([tx.txid]), bytesToHex(tx.raw), now, now, now, now, ...(kind === 'claim' ? [r.id, tx.txid] : [tx.txid, group.length]));
  // The proof that this numbered wallet belongs to the passkey is kept with the gift, in the same transaction, so credit
  // for its plays can follow the passkey's link (INSERT OR IGNORE: a released claim leaves a still-true binding behind).
  const writes = [...(markGift ? [markGift] : markGifts), insertSend];
  if (kind === 'refund') writes.push(db.prepare("UPDATE radio_gifts SET status='live', refund_txid=NULL, updated_at=? WHERE status='refunding' AND refund_txid=? AND NOT EXISTS (SELECT 1 FROM radio_gift_sends WHERE id=?)").bind(now, tx.txid, id));
  if (kind === 'claim' && bind) writes.push(db.prepare(`INSERT OR IGNORE INTO radio_listening_slots(address, root, slot, issued, root_signature, slot_signature, created_at)
    SELECT ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM radio_gifts WHERE id=? AND status='claiming' AND claim_txid=?)`)
    .bind(bind.address, bind.root, bind.slot, bind.issued, bind.rootSignature, bind.slotSignature, now, r.id, tx.txid));
  try { await db.batch(writes); }
  catch (e) {
    if (bind && isConstraint(e) && /root|slot/i.test(String((e as Error)?.message)) && await one(env, 'SELECT id FROM radio_gifts WHERE root=? AND slot=?', [bind.root, bind.slot]))
      throw new GiftError('That wallet number was just taken by another gift. Trying the next one…', 409);
    if (isConstraint(e)) throw new GiftError(/claimed_by/.test(String((e as Error)?.message)) ? 'This listening wallet has already had a gift.' : 'The gift treasury is sending another gift. Trying again in a moment…', /claimed_by/.test(String((e as Error)?.message)) ? 409 : 503);
    throw e;
  }
  if (!(await one(env, 'SELECT id FROM radio_gift_sends WHERE id=?', [id]))) throw new GiftError('This gift has just changed. Refresh and try again.', 409);
  // Any failure here only means "maybe not sent yet": the sweep sends the same bytes again (soon,
  // because the failure is recorded), and the reason is kept so it can be seen and fixed.
  await sendBytes(env, deps, id, tx.raw, tx.txid);
  return tx.txid;
}

/** Broadcasts and records how it went (`last_error`), so a failing send is retried soon and visible. */
async function sendBytes(env: GiftEnv, deps: GiftDeps, sendId: string, raw: Uint8Array, txid: string) {
  try {
    await deps.chain.broadcast(raw, txid);
    await run(env, 'UPDATE radio_gift_sends SET last_error=NULL, updated_at=? WHERE id=?', [deps.now, sendId]);
    return true;
  } catch (e) {
    const reason = String((e as Error)?.message || e).slice(0, 200);
    console.error('[radio:gifts] broadcast failed', { send: sendId, txid, reason });
    await run(env, 'UPDATE radio_gift_sends SET last_error=?, broadcast_at=?, updated_at=? WHERE id=?', [reason, deps.now, deps.now, sendId]).catch(() => undefined);
    return false;
  }
}

/** Puts a gift back after its send can no longer land, so it can be claimed (or refunded) again. */
async function release(env: GiftEnv, kind: 'claim' | 'refund', giftId: string, txids: string[], now: number) {
  const list = txids.map(() => '?').join(',');
  if (kind === 'claim') await run(env, `UPDATE radio_gifts SET status='live', claimed_by=NULL, claim_txid=NULL, claimed_at=NULL, root=NULL, slot=NULL, updated_at=? WHERE id=? AND status='claiming' AND claim_txid IN (${list})`, [now, giftId, ...txids]);
  // Every copy a refund returns shares its transaction, so they all go back together.
  else await run(env, `UPDATE radio_gifts SET status='live', refund_txid=NULL, updated_at=? WHERE status='refunding' AND refund_txid IN (${list})`, [now, ...txids]);
}

/**
 * Settles the open send from the chain: done when any of its transactions succeeded; released when its
 * nonce is used without a success (seen twice, NONCE_SETTLE_MS apart); otherwise kept alive by
 * rebroadcasting, and re-signed with the same nonce and a higher fee when stuck.
 */
async function settleOpenSend(env: GiftEnv, deps: GiftDeps, key: string, treasury: string) {
  const s = await one<Send>(env, "SELECT * FROM radio_gift_sends WHERE status='sent'");
  if (!s) return null;
  const txids: string[] = JSON.parse(s.txids);
  // Written together with its gift (startSend), so the gift must point at one of these transactions.
  const g = await gift(env, s.gift_id);
  const ref = s.kind === 'claim' ? g?.status === 'claiming' && g.claim_txid : g?.status === 'refunding' && g.refund_txid;
  if (!ref || !txids.includes(ref)) {
    // Fail closed: nothing is sent until the admin looks. Loud, because every gift waits on it.
    console.error('[radio:gifts] ALERT treasury blocked: open send without its gift', { send: s.id, gift: s.gift_id });
    return 'inconsistent';
  }
  const seen = await Promise.all(txids.map((t) => deps.chain.transfer(t)));
  const won = txids.find((_, i) => seen[i]?.status === 'success');
  const now = deps.now;
  if (won) {
    if (!changed(await run(env, "UPDATE radio_gift_sends SET status='done', updated_at=? WHERE id=? AND status='sent'", [now, s.id]))) return 'raced';
    if (s.kind === 'claim') await run(env, `UPDATE radio_gifts SET status='claimed', claim_txid=?, updated_at=? WHERE id=? AND status='claiming'`, [won, now, s.gift_id]);
    else await run(env, `UPDATE radio_gifts SET status='refunded', refund_txid=?, updated_at=? WHERE status='refunding' AND refund_txid IN (${txids.map(() => '?').join(',')})`, [won, now, ...txids]);
    return 'settled';
  }
  const executed = await deps.chain.executedNonce(treasury);
  if (executed !== null && executed >= BigInt(s.nonce)) {
    // The indexer has executed this nonce and shows none of ours paid: none of them ever can. Seen
    // again minutes later before acting, as a second guard against a half-indexed block.
    if (!s.nonce_used_at) { await run(env, 'UPDATE radio_gift_sends SET nonce_used_at=?, updated_at=? WHERE id=?', [now, now, s.id]); return 'nonce-used'; }
    if (now - s.nonce_used_at < NONCE_SETTLE_MS) return 'nonce-used';
    if (!changed(await run(env, "UPDATE radio_gift_sends SET status='void', updated_at=? WHERE id=? AND status='sent'", [now, s.id]))) return 'raced';
    await release(env, s.kind, s.gift_id, txids, now);
    return 'released';
  }
  if (now - s.signed_at > BUMP_AFTER_MS && BigInt(s.fee) < GIFT_FEE_CAP) {
    // Same nonce, same recipient and amount, higher fee: whichever lands first, only one can.
    const fee = BigInt(s.fee) * 2n > GIFT_FEE_CAP ? GIFT_FEE_CAP : BigInt(s.fee) * 2n;
    const tx = await sign(key, s.recipient, BigInt(s.amount), BigInt(s.nonce), fee);
    const next = [...txids, tx.txid];
    if (!changed(await run(env, "UPDATE radio_gift_sends SET fee=?, txids=?, raw=?, signed_at=?, broadcast_at=?, updated_at=? WHERE id=? AND status='sent' AND txids=?",
      [Number(fee), JSON.stringify(next), bytesToHex(tx.raw), now, now, now, s.id, s.txids]))) return 'raced';
    if (s.kind === 'claim') await run(env, "UPDATE radio_gifts SET claim_txid=?, updated_at=? WHERE id=? AND status='claiming'", [tx.txid, now, s.gift_id]);
    else await run(env, `UPDATE radio_gifts SET refund_txid=?, updated_at=? WHERE status='refunding' AND refund_txid IN (${txids.map(() => '?').join(',')})`, [tx.txid, now, ...txids]);
    await sendBytes(env, deps, s.id, tx.raw, tx.txid);
    return 'bumped';
  }
  // Sent again every 2 minutes while unconfirmed; every 20 seconds while the last attempt failed.
  if (now - s.broadcast_at > (s.last_error ? RETRY_FAILED_MS : REBROADCAST_MS)) {
    await run(env, 'UPDATE radio_gift_sends SET broadcast_at=?, updated_at=? WHERE id=?', [now, now, s.id]);
    await sendBytes(env, deps, s.id, hexToBytes(s.raw), txids[txids.length - 1]);
    return 'rebroadcast';
  }
  return 'pending';
}

// ---------------------------------------------------------------------------- deps

export interface GiftDeps {
  chain: GiftChain;
  now: number;
  /** Cloudflare Turnstile check; true when it passes or when Turnstile is not configured. */
  human?: (token: unknown, ip: string | null) => Promise<boolean>;
}

export async function turnstilePasses(env: GiftEnv, token: unknown, ip: string | null): Promise<boolean> {
  if (!env.RADIO_GIFT_TURNSTILE_SECRET || !env.RADIO_GIFT_TURNSTILE_SITE_KEY) return true;
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  const body = new FormData();
  body.set('secret', env.RADIO_GIFT_TURNSTILE_SECRET); body.set('response', token);
  if (ip) body.set('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body, signal: AbortSignal.timeout(8000) });
    return !!(await r.json() as { success?: boolean }).success;
  } catch { return false; }
}

// ---------------------------------------------------------------------------- gifts

/** A gift by its code (the recipient, POST so the code stays out of URLs) or its id (the friend who paid). */
export async function giftStatus(env: GiftEnv, by: { code?: string | null; id?: string | null }): Promise<GiftView & { id?: string }> {
  await ensureGiftTables(env);
  let r: Row | null = null;
  if (by.code !== undefined && by.code !== null) {
    if (!isGiftCode(by.code)) throw new GiftError('That gift link is not valid.', 404);
    r = await one(env, 'SELECT * FROM radio_gifts WHERE code_hash=?', [giftCodeHash(by.code)]);
  } else if (typeof by.id === 'string' && /^[0-9a-f]{24}$/.test(by.id)) r = await gift(env, by.id);
  if (!r) throw new GiftError('That gift link is not valid.', 404);
  return { ...view(r), ...(r.player_id ? { player: await playerView(env, r.player_id) } : {}), ...(by.id ? { id: r.id } : {}) };
}

/** If this listening wallet was funded by a gift: who it came from and where returns go. */
export async function giftForWallet(env: GiftEnv, wallet: string) {
  if (!isMainnetStandardAddress(wallet)) throw new GiftError('Mainnet wallet address required.');
  await ensureGiftTables(env);
  const r = await one(env, "SELECT * FROM radio_gifts WHERE claimed_by=? AND status IN ('claiming','claimed')", [wallet]);
  if (!r) return { gift: null };
  // While it is on its way: whether the last broadcast went through, and why not if it did not.
  const send = r.status === 'claiming' ? await one<Send>(env, "SELECT * FROM radio_gift_sends WHERE gift_id=? AND kind='claim' AND status='sent'", [r.id]) : null;
  return { gift: {
    returnTo: r.gifter ?? treasuryAddress(env), from: r.gifter, source: r.source, amount: String(r.amount), txid: r.claim_txid, label: r.label,
    state: r.status === 'claimed' ? 'arrived' : 'sending', problem: send?.last_error ?? null,
    // The gift treasury is where the gift's money came from: the page needs it to tell the gift from a later top-up.
    treasury: treasuryAddress(env),
    player: r.player_id ? await playerView(env, r.player_id) : null
  } };
}

/**
 * The next free wallet number for a passkey (its first wallet is `root`): one above the highest used or reserved so far,
 * counting gifts still on their way. A suggestion only; the unique index on (root, number) settles a race.
 */
export async function nextSlot(env: GiftEnv, root: string) {
  if (!isMainnetStandardAddress(root)) throw new GiftError('Mainnet wallet address required.');
  await ensureGiftTables(env);
  await ensureSlotTable(env);
  const a = await one<{ n: number | null }>(env, "SELECT MAX(slot) AS n FROM radio_gifts WHERE root=? AND status IN ('claiming','claimed')", [root]);
  const b = await one<{ n: number | null }>(env, 'SELECT MAX(slot) AS n FROM radio_listening_slots WHERE root=?', [root]);
  return { next: Math.max(a?.n ?? 0, b?.n ?? 0) + 1 };
}

/**
 * The albums in a passkey's numbered wallets, in number order, a page at a time (a listener may hold hundreds). Public
 * data only: which catalogue songs, no balances. The wallet box re-derives every address from its number and ignores
 * a row whose address does not match, so this list can only ever add what the passkey itself would derive.
 */
export async function shelfFor(env: GiftEnv, root: string, after = 0, limit = 50) {
  if (!isMainnetStandardAddress(root)) throw new GiftError('Mainnet wallet address required.');
  await ensureGiftTables(env);
  const from = Number.isSafeInteger(after) && after > 0 ? after : 0, n = Math.min(Math.max(Number.isSafeInteger(limit) ? limit : 50, 1), 100);
  const rows = await all<Row>(env, "SELECT * FROM radio_gifts WHERE root=? AND slot>? AND status IN ('claiming','claimed') ORDER BY slot LIMIT ?", [root, from, n + 1]);
  const page = rows.slice(0, n);
  const total = await one<{ n: number }>(env, "SELECT COUNT(*) AS n FROM radio_gifts WHERE root=? AND status IN ('claiming','claimed')", [root]);
  return {
    total: total?.n ?? 0,
    next: rows.length > n ? page[page.length - 1].slot : null,
    shelf: await Promise.all(page.map(async (g) => ({
      slot: g.slot!, address: g.claimed_by!, state: g.status === 'claimed' ? 'arrived' : 'sending', amount: String(g.amount), label: g.label,
      from: g.gifter, source: g.source, player: g.player_id ? await playerView(env, g.player_id) : null
    })))
  };
}

// ---------------------------------------------------------------------------- gift players

/** The songs of a definition, as the catalogue knows them. Anything not a ready song is simply absent. */
async function catalogueSongs(env: GiftEnv, ids: number[]) {
  const rows = ids.length
    ? await all<{ token_id: number; title: string | null; artist: string | null }>(
        env, `SELECT token_id, title, artist FROM radio_metadata WHERE status='ready' AND is_song=1 AND token_id IN (${ids.map(() => '?').join(',')})`, ids)
    : [];
  return new Map(rows.map((r) => [Number(r.token_id), { title: r.title ?? '', artist: r.artist ?? '' }]));
}

/** A player as a recipient sees it. Titles and artists come from the catalogue, never from whoever made the player. */
export async function playerView(env: GiftEnv, id: string): Promise<PlayerView | null> {
  const p = await one<{ id: string; title: string; subtitle: string; tracks: string; cover: number | null; status: string }>(env, 'SELECT * FROM radio_gift_players WHERE id=?', [id]);
  if (!p || p.status !== 'active') return null;
  const ids = JSON.parse(p.tracks) as number[];
  const songs = await catalogueSongs(env, ids);
  return {
    id: p.id, title: p.title, subtitle: p.subtitle,
    tracks: ids.filter((n) => songs.has(n)).map((n) => ({ id: n, ...songs.get(n)! })),
    cover: p.cover ?? null, paidOnly: true
  };
}

/** Every song must be held by this wallet right now. A song held by a contract (for example listed for sale) does not count. */
export async function requireSongOwner(deps: GiftDeps, owner: string, ids: number[]) {
  for (let i = 0; i < ids.length; i += 8) {
    const holders = await Promise.all(ids.slice(i, i + 8).map(async (id) => [id, await deps.chain.ownerOf(id)] as const));
    for (const [id, holder] of holders) {
      if (holder === owner) continue;
      throw new GiftError(holder && holder.includes('.')
        ? `Song #${id} is held by a contract (listed for sale?). An album can only be made from songs in your own wallet.`
        : `Song #${id} is not in this wallet. An album can only be made by the wallet that owns all of its songs.`, 403);
    }
  }
}

/** Admin: store a player definition. Needs the admin's signature over its hash; each signed request works once. */
export async function createPlayer(env: GiftEnv, body: { definition: PlayerDefinition; request: PlayerRequest; signature: string }, deps: GiftDeps, request?: Request) {
  requireEnabled(env, request);
  if (!adminAddresses(env).length) throw new GiftError('No gift admin is set for this deployment.', 403);
  let def: PlayerDefinition, req: PlayerRequest;
  try { def = validatePlayer(body?.definition); req = validatePlayerRequest(body?.request, def, deps.now); } catch (e) { throw new GiftError((e as Error).message, 400); }
  if (!isAdmin(env, req.admin) || !verifyPlayerSignature(req, body.signature, req.admin)) throw new GiftError('Only the gift admin can make gift players.', 403);
  const admin = req.admin;
  await ensureGiftTables(env);
  // Only the songs must be ready songs. The cover is any inscription (an image, or a page with one): it need not be a song.
  const wanted = [...new Set(def.tracks)];
  const songs = await catalogueSongs(env, wanted);
  const missing = wanted.find((n) => !songs.has(n));
  if (missing !== undefined) throw new GiftError(`Song #${missing} is not a ready song in the radio catalogue.`, 400);
  // An album is made by whoever owns all of its songs, and nobody else (the core contract applies the same rule to an
  // inscription whose parents are the songs). Checked here against the chain, for every song, at the moment of creation.
  await requireSongOwner(deps, req.admin, wanted);
  const hash = playerHash(def);
  const existing = await one<{ id: string }>(env, 'SELECT id FROM radio_gift_players WHERE hash=?', [hash]);
  if (existing) return { id: existing.id, title: def.title, tracks: def.tracks.length, existing: true };
  const signed = bytesToHex(sha256(encodeStructuredData(playerData(req))));
  try { await run(env, 'INSERT INTO radio_gift_campaigns(hash, admin, created_at) VALUES(?, ?, ?)', [signed, admin, deps.now]); }
  catch (e) { if (isConstraint(e)) throw new GiftError('That request was already used. Sign a new one.', 409); throw e; }
  const id = randomId().slice(0, 16);
  if (!isPlayerId(id)) throw new GiftError('Could not make a player id. Try again.', 500);
  await run(env, `INSERT INTO radio_gift_players(id, hash, owner, title, subtitle, tracks, cover, status, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
    [id, hash, admin, def.title, def.subtitle, JSON.stringify(def.tracks), def.cover, deps.now]);
  return { id, title: def.title, tracks: def.tracks.length, existing: false };
}

/** Any listener with a Stacks wallet: start a friend gift. It goes live once their deposit (with its memo) confirms. */
export async function createFriendGift(env: GiftEnv, body: { gifter: string; amount: string }, deps: GiftDeps, ip: string | null, request?: Request) {
  const { treasury } = requireEnabled(env, request);
  if (!isMainnetStandardAddress(body?.gifter) || body.gifter === treasury) throw new GiftError('Connect a Stacks wallet to give a gift.');
  if (typeof body.amount !== 'string' || !/^\d{1,9}$/.test(body.amount) || !validGiftAmount(BigInt(body.amount))) throw new GiftError('A gift is 0.1 to 1 STX.');
  await ensureGiftTables(env);
  const h = ipHash(env, ip);
  if (h && (await all(env, "SELECT id FROM radio_gifts WHERE ip_hash=? AND source='friend' AND created_at>?", [h, deps.now - 3600_000])).length >= CREATES_PER_IP)
    throw new GiftError('Too many gifts started from here in the last hour. Try again later.', 429);
  if ((await owedToFriends(env)) + BigInt(body.amount) + GIFT_FEE > micro(env.RADIO_GIFT_ESCROW_CAP, DEFAULT_ESCROW_CAP))
    throw new GiftError('The gift treasury is full right now. Try again in a few days.', 503);
  const code = newGiftCode(), id = randomId();
  await run(env, `INSERT INTO radio_gifts(id, code_hash, amount, source, gifter, label, status, created_at, expires_at, ip_hash, updated_at)
    VALUES(?, ?, ?, 'friend', ?, '', 'pending-deposit', ?, ?, ?, ?)`, [id, giftCodeHash(code), Number(body.amount), body.gifter, deps.now, deps.now + GIFT_EXPIRY_MS, h, deps.now]);
  return { id, code, depositTo: treasury, deposit: (BigInt(body.amount) + GIFT_FEE).toString(), memo: giftDepositMemo(id), expires: deps.now + GIFT_EXPIRY_MS };
}

/**
 * The gifter's deposit: from the gifter, to the treasury, for amount + fee, with this gift's memo.
 * With a txid it checks that transaction; without one (the wallet never reported it) it looks for the
 * memo among the treasury's recent deposits. Safe to call again while it confirms.
 */
export async function confirmFriendGift(env: GiftEnv, body: { id: string; txid?: string }, deps: GiftDeps, request?: Request) {
  const { treasury } = requireEnabled(env, request);
  if (typeof body?.id !== 'string' || !/^[0-9a-f]{24}$/.test(body.id)) throw new GiftError('Unknown gift.', 404);
  let txid: string | null = null;
  if (body.txid !== undefined && body.txid !== null && body.txid !== '') {
    txid = typeof body.txid === 'string' ? '0x' + body.txid.replace(/^0x/, '').toLowerCase() : '';
    if (!/^0x[0-9a-f]{64}$/.test(txid)) throw new GiftError('Transaction id required.');
  }
  await ensureGiftTables(env);
  const r = await gift(env, body.id);
  if (!r || r.source !== 'friend') throw new GiftError('Unknown gift.', 404);
  return checkDeposit(env, r, txid, treasury, deps);
}

async function checkDeposit(env: GiftEnv, r: Row, txid: string | null, treasury: string, deps: GiftDeps): Promise<GiftView> {
  if (r.status !== 'pending-deposit' && r.status !== 'abandoned') return view(r);
  const expected = BigInt(r.amount) + GIFT_FEE, memo = giftDepositMemo(r.id);
  const matches = (t: ChainTransfer) => t.sender === r.gifter && t.recipient === treasury && t.amount === expected && t.memo === memo;
  let t: (ChainTransfer & { txid: string }) | null = null;
  const known = txid ?? r.deposit_txid;
  if (known) { const x = await deps.chain.transfer(known); t = x ? { ...x, txid: known } : null; }
  else t = (await deps.chain.inbound(treasury)).find(matches) ?? null;
  if (!t) return view(r); // not seen yet
  if (!matches(t)) throw new GiftError('That transaction does not match this gift (it needs this gift’s memo, amount and your address).', 400);
  if (t.status === 'aborted' || t.status === 'dropped') {
    await run(env, "UPDATE radio_gifts SET deposit_txid=NULL, updated_at=? WHERE id=? AND status IN ('pending-deposit','abandoned') AND deposit_txid=?", [deps.now, r.id, t.txid]);
    throw new GiftError('That payment did not go through. Nothing was taken; try again.', 400);
  }
  // Only a verified match is ever stored, so a made-up txid cannot hold a gift open.
  if (r.deposit_txid !== t.txid) {
    try { await run(env, "UPDATE radio_gifts SET deposit_txid=?, updated_at=? WHERE id=? AND status IN ('pending-deposit','abandoned')", [t.txid, deps.now, r.id]); }
    catch (e) { if (isConstraint(e)) throw new GiftError('That payment already paid for another gift.', 409); throw e; }
  }
  // A payment that pays for its gift is never also owed back (in case a scan listed it earlier).
  await run(env, "UPDATE radio_gift_orphans SET status='resolved', reason=reason || ' (paid for its gift)', updated_at=? WHERE txid=? AND status='needs-refund'", [deps.now, t.txid]);
  if (t.status === 'pending') return view((await gift(env, r.id))!);
  // Confirmed (even long after it was abandoned): live from now, for 30 days.
  await run(env, "UPDATE radio_gifts SET status='live', expires_at=?, updated_at=? WHERE id=? AND status IN ('pending-deposit','abandoned')", [deps.now + GIFT_EXPIRY_MS, deps.now, r.id]);
  return view((await gift(env, r.id))!);
}

// ---------------------------------------------------------------------------- prefunded batches

const batchRow = (env: GiftEnv, id: string) => one<BatchRow>(env, 'SELECT * FROM radio_gift_batches WHERE id=?', [id]);
/** What the unpaid batches of the last day would add to escrow if they were all paid: counted against the cap up front. */
const pendingBatchTotal = async (env: GiftEnv, now: number) => {
  const rows = await all<{ count: number; amount: number }>(env, "SELECT count, amount FROM radio_gift_batches WHERE status='pending-deposit' AND created_at>?", [now - PENDING_DEPOSIT_MS]);
  return rows.reduce((sum, b) => sum + batchDeposit(b.count, BigInt(b.amount)), 0n);
};

/** A batch as the creator's page sees it: the bill, the memo, and where each copy stands. No codes (they are shown once). */
async function batchView(env: GiftEnv, b: BatchRow): Promise<BatchView> {
  const rows = await all<{ status: string; n: number }>(env, 'SELECT status, COUNT(*) AS n FROM radio_gifts WHERE batch_id=? GROUP BY status', [b.id]);
  const n = (...states: string[]) => rows.filter((r) => states.includes(r.status)).reduce((sum, r) => sum + r.n, 0);
  return {
    id: b.id, status: b.status === 'live' ? 'live' : 'pending-deposit', count: b.count, amount: String(b.amount), label: b.label, player: b.player_id,
    deposit: batchDeposit(b.count, BigInt(b.amount)).toString(), memo: batchDepositMemo(b.id), expires: b.expires_at,
    copies: { waiting: n('live'), claiming: n('claiming'), claimed: n('claimed'), refunding: n('refunding'), refunded: n('refunded') }
  };
}

/**
 * A gift admin funds a batch: N dormant gift links, paid for by ONE deposit from the creator to the treasury (memo
 * `batch <id>`). Nothing can be claimed until that payment confirms, and then every copy goes live together. The
 * creator is the gift's payer, so a copy nobody claims is refunded to them, and so are a listener's leftover plays.
 * The codes exist in clear only in this reply. Gift admins only for now; later the same check can be the album's owner.
 */
export async function createBatch(env: GiftEnv, body: { request: BatchRequest; signature: string }, deps: GiftDeps, request?: Request) {
  const { treasury } = requireEnabled(env, request);
  if (!adminAddresses(env).length) throw new GiftError('No gift admin is set for this deployment.', 403);
  let req: BatchRequest;
  try { req = validateBatch(body?.request, deps.now); } catch (e) { throw new GiftError((e as Error).message, 400); }
  if (req.creator === treasury) throw new GiftError('The gift treasury cannot fund its own batch.', 400);
  if (!isAdmin(env, req.creator) || !verifyBatchSignature(req, body.signature, req.creator)) throw new GiftError('Only a gift admin can fund a batch.', 403);
  await ensureGiftTables(env);
  // An album's copies can only be funded by the wallet that made the album (and so held all its songs).
  if (req.player) {
    const p = await one<{ id: string; owner: string }>(env, "SELECT id, owner FROM radio_gift_players WHERE id=? AND status='active'", [req.player]);
    if (!p) throw new GiftError('That gift player does not exist.', 400);
    if (p.owner !== req.creator) throw new GiftError('Only the wallet that made an album can fund copies of it.', 403);
  }
  const total = batchDeposit(req.count, BigInt(req.amount));
  const waiting = await one<{ n: number }>(env, "SELECT COUNT(*) AS n FROM radio_gift_batches WHERE creator=? AND status='pending-deposit' AND created_at>?", [req.creator, deps.now - PENDING_DEPOSIT_MS]);
  if ((waiting?.n ?? 0) >= MAX_PENDING_BATCHES) throw new GiftError('Several batches are still waiting for their payment. Pay or wait for them first.', 429);
  // Counted before anything is made, including batches not yet paid, so unpaid batches cannot add up past the cap once paid.
  if ((await owedToFriends(env)) + (await pendingBatchTotal(env, deps.now)) + total > micro(env.RADIO_GIFT_ESCROW_CAP, DEFAULT_ESCROW_CAP))
    throw new GiftError('The gift treasury is full right now. Try a smaller batch, or try again in a few days.', 503);
  const id = randomId().slice(0, 16), db = d1(env), now = deps.now, amount = Number(req.amount);
  const codes = Array.from({ length: req.count }, () => newGiftCode());
  // One transaction: the batch and every copy, or nothing. Copies go in a few rows per statement (D1 allows 100 bound values).
  const writes: any[] = [db.prepare(`INSERT INTO radio_gift_batches(id, request_hash, creator, player_id, count, amount, label, status, created_at, expires_at, updated_at)
    VALUES(?, ?, ?, ?, ?, ?, ?, 'pending-deposit', ?, ?, ?)`).bind(id, batchRequestHash(req), req.creator, req.player ?? null, req.count, amount, req.label, now, now + GIFT_EXPIRY_MS, now)];
  for (let i = 0; i < codes.length; i += 9) {
    const part = codes.slice(i, i + 9);
    writes.push(db.prepare(`INSERT INTO radio_gifts(id, code_hash, amount, source, gifter, label, status, created_at, expires_at, updated_at, player_id, batch_id)
      VALUES ${part.map(() => "(?, ?, ?, 'friend', ?, ?, 'pending-deposit', ?, ?, ?, ?, ?)").join(', ')}`)
      .bind(...part.flatMap((code) => [randomId(), giftCodeHash(code), amount, req.creator, req.label, now, now + GIFT_EXPIRY_MS, now, req.player ?? null, id])));
  }
  try { await db.batch(writes); }
  catch (e) { if (isConstraint(e)) throw new GiftError('That request was already used. Sign a new one.', 409); throw e; }
  return { id, codes, count: req.count, amount: req.amount, depositTo: treasury, deposit: total.toString(), memo: batchDepositMemo(id), links: GIFT_EXPIRY_MS };
}

/** The creator's deposit. With a txid it checks that transaction; without one it looks for the memo among the treasury's recent deposits. */
export async function confirmBatch(env: GiftEnv, body: { id: string; txid?: string }, deps: GiftDeps, request?: Request) {
  const { treasury } = requireEnabled(env, request);
  if (!isBatchId(body?.id)) throw new GiftError('Unknown batch.', 404);
  let txid: string | null = null;
  if (body.txid !== undefined && body.txid !== null && body.txid !== '') {
    txid = typeof body.txid === 'string' ? '0x' + body.txid.replace(/^0x/, '').toLowerCase() : '';
    if (!/^0x[0-9a-f]{64}$/.test(txid)) throw new GiftError('Transaction id required.');
  }
  await ensureGiftTables(env);
  const b = await batchRow(env, body.id);
  if (!b) throw new GiftError('Unknown batch.', 404);
  return checkBatchDeposit(env, b, txid, treasury, deps);
}

/** A batch by its id (the creator who paid for it). */
export async function batchStatus(env: GiftEnv, id: string) {
  if (!isBatchId(id)) throw new GiftError('Unknown batch.', 404);
  await ensureGiftTables(env);
  const b = await batchRow(env, id);
  if (!b) throw new GiftError('Unknown batch.', 404);
  return batchView(env, b);
}

/** A creator's recent batches, newest first (public data: addresses, counts and states; never a code). */
export async function batchesFor(env: GiftEnv, creator: string) {
  if (!isMainnetStandardAddress(creator)) throw new GiftError('Mainnet wallet address required.');
  await ensureGiftTables(env);
  const rows = await all<BatchRow>(env, 'SELECT * FROM radio_gift_batches WHERE creator=? ORDER BY created_at DESC LIMIT 30', [creator]);
  return { batches: await Promise.all(rows.map((b) => batchView(env, b))) };
}

async function checkBatchDeposit(env: GiftEnv, b: BatchRow, txid: string | null, treasury: string, deps: GiftDeps): Promise<BatchView> {
  if (b.status === 'live') return batchView(env, b);
  const expected = batchDeposit(b.count, BigInt(b.amount)), memo = batchDepositMemo(b.id);
  const matches = (t: ChainTransfer) => t.sender === b.creator && t.recipient === treasury && t.amount === expected && t.memo === memo;
  let t: (ChainTransfer & { txid: string }) | null = null;
  const known = txid ?? b.deposit_txid;
  if (known) { const x = await deps.chain.transfer(known); t = x ? { ...x, txid: known } : null; }
  else t = (await deps.chain.inbound(treasury)).find(matches) ?? null;
  if (!t) return batchView(env, b); // not seen yet
  if (!matches(t)) throw new GiftError('That transaction does not match this batch (it needs this batch’s memo, the exact total and your address).', 400);
  if (t.status === 'aborted' || t.status === 'dropped') {
    await run(env, "UPDATE radio_gift_batches SET deposit_txid=NULL, updated_at=? WHERE id=? AND status IN ('pending-deposit','abandoned') AND deposit_txid=?", [deps.now, b.id, t.txid]);
    throw new GiftError('That payment did not go through. Nothing was taken; try again.', 400);
  }
  // Only a verified match is ever stored, so a made-up txid cannot hold a batch open (and one payment cannot fund two batches).
  if (b.deposit_txid !== t.txid) {
    try { await run(env, "UPDATE radio_gift_batches SET deposit_txid=?, updated_at=? WHERE id=? AND status IN ('pending-deposit','abandoned')", [t.txid, deps.now, b.id]); }
    catch (e) { if (isConstraint(e)) throw new GiftError('That payment already paid for another batch.', 409); throw e; }
  }
  await run(env, "UPDATE radio_gift_orphans SET status='resolved', reason=reason || ' (paid for its batch)', updated_at=? WHERE txid=? AND status='needs-refund'", [deps.now, t.txid]);
  if (t.status === 'pending') return batchView(env, (await batchRow(env, b.id))!);
  // Confirmed (even long after it was set aside): the batch and every copy go live in ONE transaction, for 30 days.
  const db = d1(env), expires = deps.now + GIFT_EXPIRY_MS;
  await db.batch([
    db.prepare("UPDATE radio_gift_batches SET status='live', expires_at=?, updated_at=? WHERE id=? AND status IN ('pending-deposit','abandoned')").bind(expires, deps.now, b.id),
    db.prepare("UPDATE radio_gifts SET status='live', expires_at=?, updated_at=? WHERE batch_id=? AND status IN ('pending-deposit','abandoned')").bind(expires, deps.now, b.id)
  ]);
  return batchView(env, (await batchRow(env, b.id))!);
}

/** One batch-memo'd deposit seen by the scan: it makes its batch live, or (a definite mismatch) is kept for a refund. */
async function scanBatchDeposit(env: GiftEnv, treasury: string, deps: GiftDeps, t: ChainTransfer & { txid: string }, id: string) {
  const b = await batchRow(env, id);
  if (b && b.status !== 'live' && (!b.deposit_txid || b.deposit_txid === t.txid)) {
    // Only a definite mismatch (wrong sender or amount) makes an orphan; a failed read is retried on the next scan.
    try { if ((await checkBatchDeposit(env, b, t.txid, treasury, deps)).status === 'live') return; }
    catch (e) { if (!(e instanceof GiftError && e.status === 400)) return; }
    if ((await batchRow(env, id))?.status === 'pending-deposit') return; // still confirming: not an orphan
  }
  if (b?.deposit_txid === t.txid) return; // this payment is the one that made its batch live
  await run(env, `INSERT INTO radio_gift_orphans(txid, gift_id, sender, amount, reason, status, created_at, updated_at) VALUES(?, ?, ?, ?, ?, 'needs-refund', ?, ?)
    ON CONFLICT(txid) DO NOTHING`, [t.txid, id, t.sender, Number(t.amount), b ? `batch ${b.status}` : 'unknown batch', deps.now, deps.now]);
}

/**
 * Matches every memo'd deposit the treasury can see: one for a waiting gift makes it live; one that
 * belongs to no waiting gift is recorded in radio_gift_orphans as `needs-refund` (and set aside from
 * campaign money) for the admin to return. Confirmed deposits only.
 */
async function scanDeposits(env: GiftEnv, treasury: string, deps: GiftDeps) {
  for (const t of await deps.chain.inbound(treasury)) {
    const bm = BATCH_MEMO.exec(t.memo);
    if (bm && t.status === 'success') { await scanBatchDeposit(env, treasury, deps, t, bm[1]); continue; }
    const m = /^gift ([0-9a-f]{24})$/.exec(t.memo);
    if (!m || t.status !== 'success') continue;
    const r = await gift(env, m[1]);
    if (r && ['pending-deposit', 'abandoned'].includes(r.status) && (!r.deposit_txid || r.deposit_txid === t.txid)) {
      // Only a definite mismatch (wrong sender or amount) makes an orphan. A read that failed is retried
      // on the next scan, never turned into "this payment belongs to nothing".
      try { if ((await checkDeposit(env, r, t.txid, treasury, deps)).status === 'live') continue; }
      catch (e) { if (!(e instanceof GiftError && e.status === 400)) continue; }
      if ((await gift(env, m[1]))?.status === 'pending-deposit') continue; // still confirming: not an orphan
    }
    if (r?.deposit_txid === t.txid) continue; // this payment is the one that made its gift live
    await run(env, `INSERT INTO radio_gift_orphans(txid, gift_id, sender, amount, reason, status, created_at, updated_at) VALUES(?, ?, ?, ?, ?, 'needs-refund', ?, ?)
      ON CONFLICT(txid) DO NOTHING`, [t.txid, m[1], t.sender, Number(t.amount), r ? `gift ${r.status}` : 'unknown gift', deps.now, deps.now]);
  }
}

/** The recipient: fund this brand-new listening wallet from the gift. */
export async function claimGift(env: GiftEnv, body: { code: string; wallet: string; turnstile?: string; binding?: SlotSubmission }, deps: GiftDeps, ip: string | null, request?: Request) {
  const { treasury, key } = requireEnabled(env, request);
  if (!isGiftCode(body?.code)) throw new GiftError('That gift link is not valid.', 404);
  if (!isMainnetStandardAddress(body.wallet) || body.wallet === treasury) throw new GiftError('A listening wallet address is required.');
  await ensureGiftTables(env);
  let r = await one(env, 'SELECT * FROM radio_gifts WHERE code_hash=?', [giftCodeHash(body.code)]);
  if (!r) throw new GiftError('That gift link is not valid.', 404);
  if (r.claimed_by === body.wallet && ['claiming', 'claimed'].includes(r.status)) return { txid: r.claim_txid!, amount: String(r.amount), already: true };
  // A gift can go into one of the listener's numbered wallets (one per album) when the wallet is proven to belong to
  // their passkey. Only albums do: a starter gift goes to the listener's own wallet, once.
  let bind: SlotSubmission | null = null;
  if (body.binding !== undefined) {
    try { bind = { ...checkSlotBinding(body.binding, deps.now), rootSignature: body.binding.rootSignature, slotSignature: body.binding.slotSignature }; }
    catch (e) { throw new GiftError((e as Error).message, (e as { status?: number }).status ?? 400); }
    if (bind.address !== body.wallet) throw new GiftError('That proof is for a different wallet.', 400);
    if (!r.player_id) throw new GiftError('A starter gift goes to your own listening wallet. Open it there.', 400);
    await ensureSlotTable(env);
    const taken = await one<{ id: string }>(env, 'SELECT id FROM radio_gifts WHERE root=? AND slot=? AND id<>?', [bind.root, bind.slot, r.id]);
    if (taken) throw new GiftError('That wallet number was just taken by another gift. Trying the next one…', 409);
  }
  if (r.status === 'pending-deposit' || r.status === 'abandoned') {
    try {
      // A copy in a batch is paid for by its batch's deposit; any other gift by its own.
      const batch = r.batch_id ? await batchRow(env, r.batch_id) : null;
      if (batch) await checkBatchDeposit(env, batch, null, treasury, deps);
      else await checkDeposit(env, r, null, treasury, deps);
    }
    catch { throw new GiftError('Could not check this gift’s payment right now. Try again shortly.', 503); }
    r = (await gift(env, r.id))!;
    if (r.status === 'pending-deposit' || r.status === 'abandoned') throw new GiftError('This gift is not paid for yet. Ask whoever sent it to finish paying for it.', 409);
  }
  if (r.status === 'claiming') throw new GiftError('This gift is being sent to another wallet right now.', 409);
  if (r.status !== 'live') throw new GiftError(['expired', 'refunding', 'refunded'].includes(r.status) ? 'This gift has expired.' : 'This gift has already been claimed.', 410);
  if (r.expires_at < deps.now) throw new GiftError('This gift has expired.', 410);
  if (deps.human && !(await deps.human(body.turnstile, ip))) throw new GiftError('Please complete the quick check and try again.', 403);
  if (await one(env, 'SELECT id FROM radio_gifts WHERE claimed_by=?', [body.wallet])) throw new GiftError('This listening wallet has already had a gift.', 409);
  const h = ipHash(env, ip);
  // Per-IP limit for treasury-paid (campaign) links only: a friend's gift is paid by the friend and is single-use, so
  // limiting it would only block a household or a venue sharing one connection. Campaign links an admin made on
  // purpose are not held to a daily amount either (that cap made a link someone was handed fail "for today"); the
  // treasury balance check below is what bounds them.
  if (r.source === 'campaign' && h && (await all(env, "SELECT id FROM radio_gifts WHERE ip_hash=? AND source='campaign' AND claimed_at>? AND status IN ('claiming','claimed')", [h, deps.now - 86_400_000])).length >= CLAIMS_PER_IP)
    throw new GiftError('A lot of gifts have been opened on this connection today. Try this one again tomorrow, or on another connection (for example mobile data).', 429);
  const amount = BigInt(r.amount);
  // Only a brand-new wallet: gifts are for getting started, not for topping up.
  if ((await deps.chain.activity(body.wallet)) > 0 || (await deps.chain.balance(body.wallet)) > 0n)
    throw new GiftError('Gifts are for brand-new listening wallets. This one has already been used.', 409);
  // Campaign gifts never spend friends' money: what the treasury owes them is set aside.
  const spare = (await deps.chain.balance(treasury)) - (r.source === 'campaign' ? await owedToFriends(env) : 0n);
  if (spare < amount + GIFT_FEE) throw new GiftError('The gift treasury needs topping up. Try again later.', 503);
  // Only one send can be open at a time (startSend), so these checks cannot be raced past: a
  // concurrent claim waits for this one to settle, then checks again with it counted.
  const txid = await startSend(env, deps, treasury, key, 'claim', r, body.wallet, h, bind);
  return { txid, amount: amount.toString(), already: false };
}

/**
 * The treasury must always hold at least what it owes to creators, friends and unrefunded deposits. Checked every scan
 * and shouted about in the logs when it does not: that means money left that should not have, or a deposit was never seen.
 * A balance that cannot be read is skipped (never turned into "fine" or "short").
 */
async function collateralAlarm(env: GiftEnv, treasury: string, deps: GiftDeps) {
  try {
    const [balance, owed] = [await deps.chain.balance(treasury), await owedToFriends(env)];
    if (balance < owed) console.error('[radio:gifts] ALERT treasury under-collateralised', { balance: balance.toString(), owed: owed.toString() });
    return balance >= owed;
  } catch { return null; }
}

/**
 * Housekeeping (runs after gift requests, in the background). In order:
 *  1. the open send, settled from the chain (see settleOpenSend)
 *  2. campaign links past expiry become `expired` (their STX stays in the treasury)
 *  3. friend gifts nobody paid for: one last look for the deposit, then dropped after a day
 *  4. an expired friend gift is refunded to the gifter (amount; the fee they paid covers the refund)
 * A chain read that fails skips that item; it never turns into "nothing there".
 */
export async function sweepGifts(env: GiftEnv, deps: GiftDeps) {
  if (env.RADIO_GIFT_ENABLED !== '1') return { did: 'off' };
  const treasury = treasuryAddress(env), key = env.RADIO_GIFT_TREASURY_KEY?.trim();
  if (!treasury || !key) return { did: 'off' };
  await ensureGiftTables(env);
  const open = await settleOpenSend(env, deps, key, treasury).catch(() => 'unreadable');
  if (open) return { did: open }; // one item per call: anything else waits for the next request
  if (changed(await run(env, "UPDATE radio_gifts SET status='expired', updated_at=? WHERE source='campaign' AND status='live' AND expires_at<?", [deps.now, deps.now]))) return { did: 'expired' };
  // A friend gift nobody paid for within a day is set aside (abandoned), never deleted: its memo is
  // still recognised if the payment turns up later.
  const setAside = changed(await run(env, "UPDATE radio_gifts SET status='abandoned', updated_at=? WHERE status='pending-deposit' AND deposit_txid IS NULL AND created_at<?", [deps.now, deps.now - PENDING_DEPOSIT_MS]));
  const setAsideBatches = changed(await run(env, "UPDATE radio_gift_batches SET status='abandoned', updated_at=? WHERE status='pending-deposit' AND deposit_txid IS NULL AND created_at<?", [deps.now, deps.now - PENDING_DEPOSIT_MS]));
  if (setAside || setAsideBatches) return { did: 'abandoned' };
  // Every few minutes: memo'd deposits that belong to no waiting gift (paid twice, wrong amount, a
  // gift already live with another payment) are recorded for a refund. Friends' money is never lost.
  // Every ten minutes, or every minute while a payment is expected (a creator or friend has just been asked to pay).
  const last = await one<{ value: number }>(env, "SELECT created_at AS value FROM radio_gift_orphans WHERE txid='scan'");
  const expecting = !!(await one(env, "SELECT id FROM radio_gift_batches WHERE status='pending-deposit' AND created_at>? LIMIT 1", [deps.now - PENDING_DEPOSIT_MS]))
    || !!(await one(env, "SELECT id FROM radio_gifts WHERE status='pending-deposit' AND batch_id IS NULL AND created_at>? LIMIT 1", [deps.now - PENDING_DEPOSIT_MS]));
  if (!last || deps.now - last.value > (expecting ? SCAN_WHILE_EXPECTING_MS : SCAN_EVERY_MS)) {
    await run(env, "INSERT INTO radio_gift_orphans(txid, gift_id, sender, amount, reason, status, created_at, updated_at) VALUES('scan', NULL, '', 0, 'scan marker', 'marker', ?, ?) ON CONFLICT(txid) DO UPDATE SET created_at=excluded.created_at", [deps.now, deps.now]);
    try { await scanDeposits(env, treasury, deps); } catch { /* could not read: try again later */ }
    await collateralAlarm(env, treasury, deps);
    return { did: 'deposits-scanned' };
  }
  const due = await one(env, "SELECT * FROM radio_gifts WHERE source='friend' AND status='live' AND expires_at<? ORDER BY expires_at LIMIT 1", [deps.now]);
  if (!due?.gifter) return { did: 'nothing' };
  // All of that gifter's expired copies go back in one transfer (up to REFUND_GROUP_MAX), so a batch is refunded in one go.
  const group = await all<Row>(env, "SELECT * FROM radio_gifts WHERE source='friend' AND status='live' AND expires_at<? AND gifter=? ORDER BY expires_at, id LIMIT ?", [deps.now, due.gifter, REFUND_GROUP_MAX]);
  try {
    const txid = await startSend(env, deps, treasury, key, 'refund', group[0] ?? due, due.gifter, null, null, group.length ? group : [due]);
    return { did: 'refund-sent', id: (group[0] ?? due).id, txid, copies: group.length || 1 };
  } catch { return { did: 'refund-later' }; }
}

// ---------------------------------------------------------------------------- scheduled sweep

/** What a sweep step can answer when there is nothing more to do right now. */
const SWEEP_IDLE = new Set(['off', 'nothing', 'pending', 'nonce-used', 'inconsistent', 'unreadable', 'refund-later', 'raced', 'rebroadcast']);

/**
 * The scheduled sweep (workers/radio-gift-sweep calls POST /radio/gift/sweep every 5 minutes): does the housekeeping
 * that otherwise waits for someone to open a page (settle the open send, set aside unpaid batches, scan for deposits,
 * refund expired copies). One step at a time as always, at most `maxSteps` of them, stopping as soon as nothing can move.
 */
export async function runSweep(env: GiftEnv, deps: GiftDeps, maxSteps = 8) {
  const steps: string[] = [];
  for (let i = 0; i < maxSteps; i++) {
    const r = await sweepGifts(env, deps);
    steps.push(r.did);
    if (SWEEP_IDLE.has(r.did)) break;
  }
  return { steps };
}

/** True only for `Authorization: Bearer <RADIO_GIFT_SWEEP_SECRET>` (a long secret; compared without early exit). */
export function sweepAuthorised(env: GiftEnv, header: string | null): boolean {
  const secret = env.RADIO_GIFT_SWEEP_SECRET?.trim();
  if (!secret || secret.length < 24 || !header) return false;
  const given = header.replace(/^Bearer\s+/i, '');
  const a = new TextEncoder().encode(given), b = new TextEncoder().encode(secret);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}
