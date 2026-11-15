/**
 * Music Hero awards: the server's part (docs/music/AWARDS-SERVER.md).
 *
 * The award contract (contracts/live/xtrata-music-awards-v1.0.clar) inscribes a record for whoever brings it a note
 * signed by the awards signer. This file is the only thing that signs notes, so it answers three questions and
 * nothing else: is this address one of the numbered wall players (and which), has it paid for enough plays, and
 * what goes on its plaque. It holds no money and sends no transaction: its key signs notes only, and a note is good
 * for one address, one wall number and one exact record.
 *
 * Rules that must hold:
 *  - Plays are counted from the CHAIN (confirmed, successful `play` calls on the plays contract sent by the player's
 *    own address or by an album wallet bound to it), never from the server's own play counter.
 *  - A read that fails is "unavailable": never zero, never "no name", and nothing is signed on one.
 *  - The plaque carries the listener address; a name is added beside it (its own, else its linked main wallet's).
 *  - The target is a setting (RADIO_AWARDS_TARGET_PERCENT of the plays the disc came with) until claiming opens.
 */
import { cvToHex, cvToJSON, hexToCV, principalCV, uintCV } from '@stacks/transactions';
import { bytesToHex } from '@noble/hashes/utils';
import { queryAll, run } from './db';
import { applyHiroApiKey, getHiroApiKeys, isTransientHiroStatus, shouldRetryWithNextHiroKey } from './hiro-keys';
import { primaryNameOf } from './casino-room-bns';
import { wallPlayerOf, type GiveawayEnv } from './radio-giveaway';
import { ensureSlotTable, mainsFor } from './radio-listening-wallet';
import { isMainnetStandardAddress } from '../../src/lib/listening-wallet/link';
import { PLAYS_CONTRACT } from '../../src/lib/listening-wallet/tx';
import { AWARD_CLASS, buildRecord, cleanAwardName, recordHash, type AwardClassId } from '../../src/lib/music-awards/record';
import { MAINNET_CHAIN_ID, signNote } from '../../src/lib/music-awards/note';

export type AwardsEnv = GiveawayEnv & {
  RADIO_AWARDS_ENABLED?: string;
  /** The deployed award contract, `SP….xtrata-music-awards-v1-0`. */
  RADIO_AWARDS_CONTRACT?: string;
  RADIO_AWARDS_DROP?: string;
  /** Share of the plays a disc came with that earns its record: 1 to 100. 10 until decided otherwise. */
  RADIO_AWARDS_TARGET_PERCENT?: string;
  /** Secret. Signs notes and nothing else; the contract holds only its hash. */
  RADIO_AWARDS_SIGNER_KEY?: string;
};

const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const HIRO = 'https://api.mainnet.hiro.so';
const PAGE = 50;
/** Transaction pages read in one request (each is one call to the chain API). A longer history carries on next time. */
export const MAX_PAGES = 20;
/** A count below the target is read again at most this often per address. */
export const RECOUNT_MS = 60_000;
/** Notes one address may be given in an hour (a note is re-signed when the name on it changes). */
export const NOTES_PER_HOUR = 12;
const MAX_ALBUM_WALLETS = 24;

export class AwardError extends Error {
  constructor(message: string, readonly status = 400) { super(message); this.name = 'AwardError'; }
}
/** The chain or our records could not be read. Never to be shown as zero or as "none". */
export class AwardUnavailable extends Error {
  constructor(message = 'Could not check right now. Try again shortly.') { super(message); this.name = 'AwardUnavailable'; }
}

// ---------------------------------------------------------------- settings
const CONTRACT = /^SP[0-9A-Z]{28,41}\.[a-z][a-z0-9-]{0,39}$/;
export function awardsConfig(env: AwardsEnv) {
  const contract = String(env.RADIO_AWARDS_CONTRACT ?? '').trim();
  const drop = Number(env.RADIO_AWARDS_DROP ?? '1');
  const raw = Number(env.RADIO_AWARDS_TARGET_PERCENT ?? '10');
  const percent = Number.isFinite(raw) ? Math.min(100, Math.max(1, Math.round(raw))) : 10;
  const key = String(env.RADIO_AWARDS_SIGNER_KEY ?? '').trim().toLowerCase();
  const signerKey = /^[0-9a-f]{64}(01)?$/.test(key) ? key.slice(0, 64) + '01' : null;
  const enabled = env.RADIO_AWARDS_ENABLED === '1' && CONTRACT.test(contract) && Number.isSafeInteger(drop) && drop >= 1;
  return { enabled, contract, drop, percent, signerKey };
}
/** Plays that earn the record for a disc that came with `giftedPlays`. */
export const targetFor = (giftedPlays: number, percent: number) => Math.max(1, Math.floor((giftedPlays * percent) / 100));

// ---------------------------------------------------------------- the chain, as this file needs it
export interface ChainTx { height: number; ok: boolean; sender: string; contract: string | null; fn: string | null }
export interface AwardChain {
  /** Height of the newest block. */
  tip(): Promise<number>;
  /** One page (50) of an address's confirmed transactions up to block `until`, newest first, with the total. */
  page(address: string, until: number, offset: number): Promise<{ total: number; txs: ChainTx[] }>;
  /** The inscription this hero was awarded in this drop, or null. */
  awardOf(contract: string, drop: number, hero: string): Promise<number | null>;
  /** The inscription awarded to this wall number, or null. */
  awardAt(contract: string, drop: number, number: number): Promise<number | null>;
  classOf(contract: string, drop: number, cls: number): Promise<{ template: number; cap: number; minted: number } | null>;
  paused(contract: string): Promise<boolean>;
  /** Who holds an inscription on the Xtrata core, or null if nobody does. */
  ownerOf(inscription: number): Promise<string | null>;
  /** The address's primary .btc name; null when it has none. Throws AwardUnavailable when that could not be read. */
  primaryName(address: string): Promise<string | null>;
}

const isPlay = (tx: ChainTx, address: string) => tx.ok && tx.sender === address && tx.contract === PLAYS_CONTRACT && tx.fn === 'play';

// ---------------------------------------------------------------- tables
let tablesReady: WeakSet<object> | null = null;
export async function ensureAwardTables(env: AwardsEnv) {
  tablesReady ??= new WeakSet();
  const db = env.DB as unknown as object;
  if (db && tablesReady.has(db)) return;
  // plays: confirmed plays counted for one address up to block `through_block`. scan_*: a long first count in progress.
  await run(env, `CREATE TABLE IF NOT EXISTS radio_award_plays(
    address TEXT PRIMARY KEY, plays INTEGER NOT NULL DEFAULT 0, through_block INTEGER NOT NULL DEFAULT 0,
    scan_until INTEGER, scan_offset INTEGER, scan_plays INTEGER, checked_at INTEGER NOT NULL DEFAULT 0)`);
  await run(env, `CREATE TABLE IF NOT EXISTS radio_award_notes(
    address TEXT PRIMARY KEY, drop_id INTEGER NOT NULL, class INTEGER NOT NULL, number INTEGER NOT NULL, plays INTEGER NOT NULL,
    name TEXT, record TEXT NOT NULL, signature TEXT NOT NULL, issued_at INTEGER NOT NULL, window_at INTEGER NOT NULL, window_n INTEGER NOT NULL)`);
  if (db) tablesReady.add(db);
}
const rows = async <T,>(env: AwardsEnv, sql: string, binds: unknown[] = []) => ((await queryAll(env, sql, binds)).results ?? []) as T[];
const one = async <T,>(env: AwardsEnv, sql: string, binds: unknown[] = []) => (await rows<T>(env, sql, binds))[0] ?? null;

// ---------------------------------------------------------------- counting paid plays
type PlaysRow = { address: string; plays: number; through_block: number; scan_until: number | null; scan_offset: number | null; scan_plays: number | null; checked_at: number };

/**
 * Confirmed paid plays sent by one address. Counted once and then kept up to date: each look reads only the
 * transactions newer than the last block already counted. The set being read is pinned to a finished block
 * (`until`), so pages cannot shift while they are read. A history too long for one request is carried on by the
 * next one; until it is complete the answer is "unavailable", never a part count.
 */
export async function playsOf(env: AwardsEnv, chain: AwardChain, address: string, now: number): Promise<number> {
  await ensureAwardTables(env);
  const row = await one<PlaysRow>(env, 'SELECT * FROM radio_award_plays WHERE address=?', [address]);
  if (row && row.scan_until === null && now - row.checked_at < RECOUNT_MS) return row.plays;
  const through = row?.through_block ?? 0, base = row?.plays ?? 0;
  let until = row?.scan_until ?? null, offset = row?.scan_offset ?? 0, found = row?.scan_plays ?? 0;
  try {
    if (until === null) {
      until = (await chain.tip()) - 1; // a finished block: nothing can be added at or below it
      offset = 0; found = 0;
      if (!Number.isSafeInteger(until) || until < 0) throw new AwardUnavailable();
      if (until <= through) { await savePlays(env, { address, plays: base, through_block: through, scan_until: null, scan_offset: null, scan_plays: null, checked_at: now }); return base; }
    }
    for (let pages = 0; pages < MAX_PAGES; pages++) {
      const p = await chain.page(address, until, offset);
      if (!Number.isSafeInteger(p.total) || p.total < 0 || p.txs.length > PAGE) throw new AwardUnavailable();
      let done = p.txs.length === 0;
      for (const tx of p.txs) {
        if (!Number.isSafeInteger(tx.height) || tx.height > until) throw new AwardUnavailable();
        if (tx.height <= through) { done = true; break; } // already counted last time
        if (isPlay(tx, address)) found++;
      }
      offset += p.txs.length;
      if (done || offset >= p.total) {
        const plays = base + found;
        await savePlays(env, { address, plays, through_block: until, scan_until: null, scan_offset: null, scan_plays: null, checked_at: now });
        return plays;
      }
    }
  } catch (e) {
    throw e instanceof AwardUnavailable ? e : new AwardUnavailable();
  }
  // More history than one request reads: keep the place and carry on next time.
  await savePlays(env, { address, plays: base, through_block: through, scan_until: until, scan_offset: offset, scan_plays: found, checked_at: now });
  throw new AwardUnavailable('Still counting this player’s plays. Try again in a moment.');
}
const savePlays = (env: AwardsEnv, r: PlaysRow) => run(env,
  `INSERT INTO radio_award_plays(address, plays, through_block, scan_until, scan_offset, scan_plays, checked_at) VALUES(?,?,?,?,?,?,?)
   ON CONFLICT(address) DO UPDATE SET plays=excluded.plays, through_block=excluded.through_block, scan_until=excluded.scan_until,
     scan_offset=excluded.scan_offset, scan_plays=excluded.scan_plays, checked_at=excluded.checked_at`,
  [r.address, r.plays, r.through_block, r.scan_until, r.scan_offset, r.scan_plays, r.checked_at]);

/** Every listen counts: the player's own plays plus those of the album wallets bound to it (both keys signed that binding). */
export async function heroPlays(env: AwardsEnv, chain: AwardChain, hero: string, now: number): Promise<number> {
  await ensureSlotTable(env);
  const albums = await rows<{ address: string }>(env, 'SELECT address FROM radio_listening_slots WHERE root=? ORDER BY slot LIMIT ?', [hero, MAX_ALBUM_WALLETS]);
  let total = await playsOf(env, chain, hero, now);
  for (const a of albums) if (isMainnetStandardAddress(a.address) && a.address !== hero) total += await playsOf(env, chain, a.address, now);
  return total;
}

// ---------------------------------------------------------------- where a player stands
export type AwardStatus =
  | { state: 'off' | 'not-a-player' }
  | { state: 'unavailable'; reason: string; cls?: AwardClassId; number?: number; need?: number }
  | { state: 'earning' | 'ready' | 'paused' | 'class-full' | 'not-open'; cls: AwardClassId; number: number; need: number; have: number }
  | { state: 'claimed'; cls: AwardClassId; number: number; inscription: number; /** false once the record was sent to someone else */ holds: boolean | null };

export async function awardStatus(env: AwardsEnv, chain: AwardChain, address: unknown, now: number): Promise<AwardStatus> {
  const cfg = awardsConfig(env);
  if (!cfg.enabled) return { state: 'off' };
  if (typeof address !== 'string' || !isMainnetStandardAddress(address)) throw new AwardError('A mainnet player address is required.');
  let player: Awaited<ReturnType<typeof wallPlayerOf>>;
  try { player = await wallPlayerOf(env, address); }
  catch { return { state: 'unavailable', reason: 'Could not check right now. Try again shortly.' }; }
  if (!player) return { state: 'not-a-player' };
  const cls = player.tier as AwardClassId, number = player.number, need = targetFor(player.plays, cfg.percent);
  try {
    const inscription = await chain.awardOf(cfg.contract, cfg.drop, address);
    if (inscription !== null) {
      let holds: boolean | null = null;
      try { holds = (await chain.ownerOf(inscription)) === address; } catch { /* holding is unknown: say so, never "sent away" */ }
      return { state: 'claimed', cls, number, inscription, holds };
    }
    const have = await heroPlays(env, chain, address, now);
    if (have < need) return { state: 'earning', cls, number, need, have };
    if (await chain.paused(cfg.contract)) return { state: 'paused', cls, number, need, have };
    const info = await chain.classOf(cfg.contract, cfg.drop, AWARD_CLASS[cls]);
    if (!info) return { state: 'not-open', cls, number, need, have };
    if (info.minted >= info.cap) return { state: 'class-full', cls, number, need, have };
    return { state: 'ready', cls, number, need, have };
  } catch (e) {
    if (e instanceof AwardError) throw e;
    return { state: 'unavailable', reason: e instanceof AwardUnavailable ? e.message : 'Could not check right now. Try again shortly.', cls, number, need };
  }
}

// ---------------------------------------------------------------- the plaque's name
/**
 * The name beside the address: the listener address's own primary .btc name if it has one, else the primary name of
 * the main wallet the player is linked to, else none. A failed lookup throws: a record never goes out nameless
 * because the name could not be read.
 */
export async function plaqueName(env: AwardsEnv, chain: AwardChain, address: string): Promise<string | null> {
  const own = cleanAwardName(await chain.primaryName(address));
  if (own) return own;
  let main: string | undefined;
  try { main = (await mainsFor(env, [address]))[0]?.main; } catch { throw new AwardUnavailable('Could not check for a name right now. Try again, or choose to use your address.'); }
  if (!main || main === address) return null;
  return cleanAwardName(await chain.primaryName(main));
}

// ---------------------------------------------------------------- the note
export interface AwardNote {
  contract: string; drop: number; cls: number; className: AwardClassId; number: number; plays: number; hero: string;
  name: string | null;
  /** The exact bytes to inscribe, as hex, and the signature over their note (65 bytes, hex). */
  record: string; signature: string; bytes: number;
}

/**
 * The record and its signed note, for a player whose record is ready. `name`: 'auto' looks a name up (and refuses
 * if it cannot); 'none' uses the address alone. No login: a note is useless to anyone but its hero, because the
 * contract takes the hero from whoever sends the claim.
 */
export async function awardNote(env: AwardsEnv, chain: AwardChain, body: { address?: unknown; name?: unknown }, now: number): Promise<AwardNote> {
  const cfg = awardsConfig(env);
  if (!cfg.enabled) throw new AwardError('Awards are not open.', 404);
  if (!cfg.signerKey) throw new AwardError('Awards cannot be signed right now.', 503);
  if (body?.name !== 'auto' && body?.name !== 'none') throw new AwardError('Choose a name or your address.');
  const st = await awardStatus(env, chain, body?.address, now);
  const hero = body.address as string;
  if (st.state === 'unavailable') throw new AwardError(st.reason, 503);
  if (st.state === 'claimed') throw new AwardError('This player has already claimed its record.', 409);
  if (st.state === 'earning') throw new AwardError(`Not yet: ${st.have} of ${st.need} plays.`, 409);
  if (st.state !== 'ready') throw new AwardError(st.state === 'not-a-player' ? 'This is not one of the numbered players.' : 'Awards are not open for this player right now.', 409);
  let info: Awaited<ReturnType<AwardChain['classOf']>>, name: string | null;
  try {
    info = await chain.classOf(cfg.contract, cfg.drop, AWARD_CLASS[st.cls]);
    name = body.name === 'none' ? null : await plaqueName(env, chain, hero);
  } catch (e) { throw new AwardError(e instanceof AwardUnavailable ? e.message : 'Could not check right now. Try again shortly.', 503); }
  if (!info) throw new AwardError('Awards are not open for this player right now.', 409);

  await ensureAwardTables(env);
  const prior = await one<{ window_at: number; window_n: number }>(env, 'SELECT window_at, window_n FROM radio_award_notes WHERE address=?', [hero]);
  const fresh = !prior || now - prior.window_at >= 3_600_000;
  if (!fresh && prior!.window_n >= NOTES_PER_HOUR) throw new AwardError('Too many tries. Wait a while and try again.', 429);

  const record = buildRecord({ template: info.template, cls: st.cls, hero, number: st.number, plays: st.need, name, drop: cfg.drop });
  const cls = AWARD_CLASS[st.cls];
  const signature = signNote({ chain: MAINNET_CHAIN_ID, contract: cfg.contract, drop: cfg.drop, cls, number: st.number, plays: st.need, hero, recordHash: recordHash(record) }, cfg.signerKey);
  const hex = bytesToHex(record);
  await run(env,
    `INSERT INTO radio_award_notes(address, drop_id, class, number, plays, name, record, signature, issued_at, window_at, window_n) VALUES(?,?,?,?,?,?,?,?,?,?,1)
     ON CONFLICT(address) DO UPDATE SET drop_id=excluded.drop_id, class=excluded.class, number=excluded.number, plays=excluded.plays, name=excluded.name,
       record=excluded.record, signature=excluded.signature, issued_at=excluded.issued_at,
       window_at=CASE WHEN ? THEN excluded.window_at ELSE window_at END, window_n=CASE WHEN ? THEN 1 ELSE window_n+1 END`,
    [hero, cfg.drop, cls, st.number, st.need, name, hex, signature, now, now, fresh ? 1 : 0, fresh ? 1 : 0]);
  return { contract: cfg.contract, drop: cfg.drop, cls, className: st.cls, number: st.number, plays: st.need, hero, name, record: hex, signature, bytes: record.length };
}

/** For the wall: has disc `number` claimed its record, and which inscription is it. */
export async function awardAtNumber(env: AwardsEnv, chain: AwardChain, number: unknown) {
  const cfg = awardsConfig(env);
  if (!cfg.enabled) return { state: 'off' as const };
  const n = Number(number);
  if (!Number.isSafeInteger(n) || n < 1 || n > 1_000_000) throw new AwardError('There is no player with that number.', 404);
  try {
    const inscription = await chain.awardAt(cfg.contract, cfg.drop, n);
    return inscription === null ? { state: 'none' as const, number: n } : { state: 'claimed' as const, number: n, inscription };
  } catch { return { state: 'unavailable' as const, number: n }; }
}

// ---------------------------------------------------------------- the chain through Hiro
export function hiroAwardChain(env: AwardsEnv): AwardChain {
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
  const json = async <T,>(path: string, init?: RequestInit): Promise<T> => {
    for (let attempt = 0; ; attempt++) {
      let r: Response;
      try { r = await fetchHiro(path, init); } catch { throw new AwardUnavailable(); }
      if (r.ok) { try { return (await r.json()) as T; } catch { throw new AwardUnavailable(); } }
      if (attempt < 2 && isTransientHiroStatus(r.status)) { await new Promise((ok) => setTimeout(ok, 300 * (attempt + 1))); continue; }
      throw new AwardUnavailable();
    }
  };
  /** A read-only call's answer as JSON, or AwardUnavailable. */
  const read = async (contract: string, fn: string, args: string[], sender: string): Promise<any> => {
    const [address, name] = contract.split('.');
    const out = await json<{ okay?: boolean; result?: unknown }>(`/v2/contracts/call-read/${address}/${name}/${fn}`, {
      method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ sender, arguments: args })
    });
    if (!out?.okay || typeof out.result !== 'string') throw new AwardUnavailable();
    try { return cvToJSON(hexToCV(out.result)); } catch { throw new AwardUnavailable(); }
  };
  const uint = (v: unknown) => { const n = Number((v as { value?: unknown })?.value); if (!Number.isSafeInteger(n) || n < 0) throw new AwardUnavailable(); return n; };
  /** `(optional uint)` → the number, or null for none. Anything else: unavailable. */
  const optionalUint = (j: any): number | null => {
    if (!j || typeof j.type !== 'string' || !j.type.startsWith('(optional')) throw new AwardUnavailable();
    return j.value === null || j.value === undefined ? null : uint(j.value);
  };
  const owner = (contract: string) => contract.split('.')[0];
  return {
    async tip() {
      const info = await json<{ stacks_tip_height?: unknown }>('/v2/info');
      if (!Number.isSafeInteger(info.stacks_tip_height) || (info.stacks_tip_height as number) < 1) throw new AwardUnavailable();
      return info.stacks_tip_height as number;
    },
    async page(address, until, offset) {
      const p = await json<{ total?: unknown; results?: unknown }>(`/extended/v1/address/${address}/transactions?until_block=${until}&limit=${PAGE}&offset=${offset}`);
      if (!Number.isSafeInteger(p.total) || !Array.isArray(p.results)) throw new AwardUnavailable();
      return {
        total: p.total as number,
        txs: (p.results as any[]).map((t) => ({
          height: Number(t?.block_height),
          ok: t?.tx_status === 'success' && t?.canonical !== false && t?.microblock_canonical !== false && t?.is_unanchored !== true,
          sender: String(t?.sender_address ?? ''),
          contract: t?.tx_type === 'contract_call' && typeof t?.contract_call?.contract_id === 'string' ? t.contract_call.contract_id : null,
          fn: t?.tx_type === 'contract_call' && typeof t?.contract_call?.function_name === 'string' ? t.contract_call.function_name : null
        }))
      };
    },
    async awardOf(contract, drop, hero) { return optionalUint(await read(contract, 'get-award-of', [cvToHex(uintCV(drop)), cvToHex(principalCV(hero))], hero)); },
    async awardAt(contract, drop, number) { return optionalUint(await read(contract, 'get-award-by-number', [cvToHex(uintCV(drop)), cvToHex(uintCV(number))], owner(contract))); },
    async classOf(contract, drop, cls) {
      const j = await read(contract, 'get-class', [cvToHex(uintCV(drop)), cvToHex(uintCV(cls))], owner(contract));
      if (!j || typeof j.type !== 'string' || !j.type.startsWith('(optional')) throw new AwardUnavailable();
      if (j.value === null || j.value === undefined) return null;
      const f = j.value?.value;
      return { template: uint(f?.template), cap: uint(f?.cap), minted: uint(f?.minted) };
    },
    async paused(contract) {
      const j = await read(contract, 'is-paused', [], owner(contract));
      if (j?.success !== true || typeof j.value?.value !== 'boolean') throw new AwardUnavailable();
      return j.value.value;
    },
    async ownerOf(inscription) {
      const j = await read(CORE, 'get-owner', [cvToHex(uintCV(inscription))], owner(CORE));
      if (j?.success !== true) throw new AwardUnavailable();
      const o = j.value;
      if (!o || o.value === null || o.value === undefined) return null;
      if (typeof o.value?.value !== 'string') throw new AwardUnavailable();
      return o.value.value;
    },
    async primaryName(address) {
      const r = await primaryNameOf(address, env as Record<string, unknown>, { fresh: true });
      if (!r.checked) throw new AwardUnavailable('Could not check for a name right now. Try again, or choose to use your address.');
      return r.name;
    }
  };
}
