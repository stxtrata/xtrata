/**
 * The free-album giveaway (public/giveaway.html): a list of gift links held on the server and shown to the public
 * ONE AT A TIME. When the shown link has been claimed (its funds have reached the new wallet) a pause of a minute or
 * so follows, then the next link appears. Nobody can read the list: the page only ever receives the current code.
 *
 * Where each thing lives:
 *   - the links are ordinary gift links (radio_gifts, made as an album batch). This table only remembers their codes
 *     in order, because a gift row keeps just a hash and the page has to be able to show the code itself;
 *   - whether a link is still free is NEVER copied here: it is read from radio_gifts each time, so the giveaway can
 *     not disagree with the gift (a claim that fails and goes back to `live` simply shows the link again);
 *   - the state row says which link is on show now, when the next one may appear, and the operator's pause and pace.
 *
 * Everything moves in `advance`, called by every public read and by the scheduled sweep. It is safe to run twice at
 * once: each change is a conditional update on the state row, so only one caller can win it.
 *
 * Operator: POST /radio/giveaway/admin with `Authorization: Bearer <RADIO_GIVEAWAY_SECRET>` (see the handler).
 */
import type { GiftEnv } from './radio-gifts';
import { GiftError, playerView } from './radio-gifts';
import { giftCodeHash, giftPlays, isGiftCode } from '../../src/lib/listening-wallet/gifts';
import { listedTracks } from '../../src/lib/listening-wallet/gift-players';
import { tierOfPlays, type TierId } from '../../src/lib/listening-wallet/tiers';

export type GiveawayEnv = GiftEnv & { RADIO_GIVEAWAY_SECRET?: string };

/** Ten minutes from the moment a link is claimed to the next one appearing, so a crowd never turns into a rush. */
export const DEFAULT_GAP_MIN_S = 600;
export const DEFAULT_GAP_MAX_S = 600;
/** Longest pause an operator can ask for between links: a day. */
export const MAX_GAP_S = 24 * 60 * 60;

type Link = { pos: number; code: string; code_hash: string; added_at: number; shown_at: number | null; ended_at: number | null; outcome: string | null };
type State = { current: number | null; next_at: number; paused: number; gap_min: number; gap_max: number; held: number };
type GiftRow = { status: string; expires_at: number; claimed_at: number | null; claimed_by: string | null; player_id: string | null };

const q = async <T,>(env: GiveawayEnv, sql: string, binds: unknown[] = []) => ((await env.DB.prepare(sql).bind(...binds).all()).results ?? []) as T[];
const first = async <T,>(env: GiveawayEnv, sql: string, binds: unknown[] = []) => (await q<T>(env, sql, binds))[0] ?? null;
const exec = async (env: GiveawayEnv, sql: string, binds: unknown[] = []) => {
  const r = await env.DB.prepare(sql).bind(...binds).run() as { meta?: { changes?: number }; changes?: number };
  return r?.meta?.changes ?? r?.changes ?? 0;
};

export async function ensureGiveawayTables(env: GiveawayEnv) {
  await exec(env, `CREATE TABLE IF NOT EXISTS radio_giveaway_links(
    pos INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, code_hash TEXT NOT NULL UNIQUE, added_at INTEGER NOT NULL,
    shown_at INTEGER, ended_at INTEGER, outcome TEXT)`);
  await exec(env, `CREATE TABLE IF NOT EXISTS radio_giveaway_state(
    id INTEGER PRIMARY KEY CHECK (id = 1), current INTEGER, next_at INTEGER NOT NULL DEFAULT 0, paused INTEGER NOT NULL DEFAULT 0,
    gap_min INTEGER NOT NULL DEFAULT ${DEFAULT_GAP_MIN_S}, gap_max INTEGER NOT NULL DEFAULT ${DEFAULT_GAP_MAX_S}, updated_at INTEGER NOT NULL DEFAULT 0)`);
  // Added later: copies of the edition that are not in this list (given out another way). They count in the edition's size
  // and numbering, so the page says "Copy No. 6 of 100" when 5 are held and 95 are in the list.
  await exec(env, 'ALTER TABLE radio_giveaway_state ADD COLUMN held INTEGER NOT NULL DEFAULT 0').catch(() => undefined);
  // Added with drops: a finished or withdrawn drop is archived (operator action `archive`), so the next one starts its
  // counts and its wall from nothing. Archived rows are kept as a record and never counted or shown again.
  await exec(env, 'ALTER TABLE radio_giveaway_links ADD COLUMN archived INTEGER NOT NULL DEFAULT 0').catch(() => undefined);
  await exec(env, 'INSERT OR IGNORE INTO radio_giveaway_state(id) VALUES(1)');
}

const readState = async (env: GiveawayEnv) => (await first<State>(env, 'SELECT current, next_at, paused, gap_min, gap_max, held FROM radio_giveaway_state WHERE id=1'))!;
const giftOf = (env: GiveawayEnv, hash: string) =>
  first<GiftRow>(env, 'SELECT status, expires_at, claimed_at, claimed_by, player_id FROM radio_gifts WHERE code_hash=?', [hash]);

/** A link someone can still claim: it exists, is live and has not expired. */
const isFree = (g: GiftRow | null, now: number) => !!g && g.status === 'live' && g.expires_at > now;
/** A link that will never be claimable: the gift is gone, expired, refunded or set aside. (`claiming`/`claimed` are not dead: someone has it.) */
const isDead = (g: GiftRow | null, now: number) => !g || ['expired', 'refunding', 'refunded', 'abandoned', 'pending-deposit'].includes(g.status) || (g.status === 'live' && g.expires_at <= now);

/** `SP3JNS…X743X`: enough to recognise, short enough to read. The address is public on the chain anyway. */
export const shortAddress = (a: string | null | undefined) => (a ? `${a.slice(0, 5)}…${a.slice(-5)}` : '');

/** A pause drawn between the operator's minimum and maximum: "every now and then", never on a rhythm. */
const gapMs = (s: Pick<State, 'gap_min' | 'gap_max'>, rand: () => number) => Math.round((s.gap_min + rand() * Math.max(0, s.gap_max - s.gap_min)) * 1000);

/**
 * Brings the giveaway up to date and says what the public should see. Each pass changes at most one thing; a link that
 * can never be claimed is stepped over at once, so a few dead links in the list cost nothing.
 */
export async function advance(env: GiveawayEnv, now: number, rand: () => number = Math.random) {
  await ensureGiveawayTables(env);
  for (let pass = 0; pass < 12; pass++) {
    let s = await readState(env);
    if (s.paused) return { s, link: s.current ? await first<Link>(env, 'SELECT * FROM radio_giveaway_links WHERE pos=?', [s.current]) : null, gift: null as GiftRow | null };
    if (s.current) {
      const link = await first<Link>(env, 'SELECT * FROM radio_giveaway_links WHERE pos=?', [s.current]);
      const gift = link ? await giftOf(env, link.code_hash) : null;
      if (link && gift && ['live', 'claiming'].includes(gift.status) && !(gift.status === 'live' && gift.expires_at <= now)) {
        // The pause before the next link runs from the moment this one was claimed, not from when its funds land (that
        // can take a while on the chain). It is drawn once: a claim not yet counted for (`next_at` older than it) gets one.
        if (gift.status === 'claiming') {
          const at = gift.claimed_at ?? now;
          if (s.next_at < at) {
            const next = at + gapMs(s, rand);
            if (await exec(env, 'UPDATE radio_giveaway_state SET next_at=?, updated_at=? WHERE id=1 AND current=? AND next_at=?', [next, now, s.current, s.next_at])) s = { ...s, next_at: next };
            else s = await readState(env);
          }
        }
        return { s, link, gift };
      }
      // Claimed (funds sent), or dead: this link is finished. A claim carries the pause that started when it was claimed
      // (drawn here if a sweep first sees it already settled); a dead link carries none.
      const claimed = !!gift && gift.status === 'claimed';
      const settledAt = gift?.claimed_at ?? now;
      const won = await exec(env, 'UPDATE radio_giveaway_state SET current=NULL, next_at=?, updated_at=? WHERE id=1 AND current=?',
        [claimed && s.next_at < settledAt ? settledAt + gapMs(s, rand) : s.next_at, now, s.current]);
      if (won) await exec(env, 'UPDATE radio_giveaway_links SET ended_at=?, outcome=? WHERE pos=? AND ended_at IS NULL', [now, claimed ? 'claimed' : 'lost', s.current]);
      continue;
    }
    if (now < s.next_at) return { s, link: null, gift: null };
    const next = await first<Link>(env, 'SELECT * FROM radio_giveaway_links WHERE shown_at IS NULL AND ended_at IS NULL ORDER BY pos LIMIT 1');
    if (!next) return { s, link: null, gift: null };
    const gift = await giftOf(env, next.code_hash);
    if (isDead(gift, now)) { await exec(env, "UPDATE radio_giveaway_links SET ended_at=?, outcome='lost' WHERE pos=? AND ended_at IS NULL", [now, next.pos]); continue; }
    // Not free but not dead either (someone claimed it before it was ever shown): counts as given away, no pause.
    if (!isFree(gift, now)) { await exec(env, "UPDATE radio_giveaway_links SET ended_at=?, outcome='claimed' WHERE pos=? AND ended_at IS NULL", [now, next.pos]); continue; }
    const won = await exec(env, 'UPDATE radio_giveaway_state SET current=?, updated_at=? WHERE id=1 AND current IS NULL', [next.pos, now]);
    if (won) await exec(env, 'UPDATE radio_giveaway_links SET shown_at=? WHERE pos=?', [now, next.pos]);
  }
  const s = await readState(env);
  return { s, link: null, gift: null };
}

export type GiveawayView = {
  /** live: a link is on show · taken: it was just claimed · waiting: the next one is coming · paused · done: the list is used up */
  state: 'live' | 'taken' | 'waiting' | 'paused' | 'done';
  /** Only while `live`. */
  code?: string;
  /** Only while `live`: what the album is. */
  album?: { title: string; subtitle: string; cover: number | null; songs: { title: string; artist: string }[] };
  /** How many have been given away, and how many are still to come (including the one on show). */
  claimed: number;
  left: number;
  /** While `taken` or `waiting` after a claim: who got it (shortened) and when the next link appears (ms). */
  wallet?: string;
  nextAt?: number;
  /** The server's clock, so the page can count down correctly whatever its own clock says. */
  now: number;
  /** Copies of the edition outside this list (set aside); they come first in the numbering. Omitted when none. */
  held?: number;
  /**
   * What is being given away: an album, or a starter player (a gift with no album: plays for any music). Read from the
   * link on show, else the next one to come, else the last one given. Omitted when the list is empty.
   */
  kind?: 'album' | 'player';
  /** Paid plays each link of this kind carries. Omitted when it cannot be read: never shown as zero. */
  plays?: number;
  /**
   * A lottery: the players in the list carry different numbers of plays, so what the link on show holds is NOT told
   * (`plays` is omitted). Instead: the smallest and largest, how many of each tier there are and how many are still to
   * be won, and the tier of every player already claimed, in the order they went (the wall colours them in).
   */
  lottery?: { min: number; max: number; tiers: { id: TierId; plays: number; total: number; left: number }[]; won: TierId[] };
};

/** The public answer: counts, and the one link on show. Never the list, never an upcoming code, never a time. */
export async function giveawayView(env: GiveawayEnv, now: number, rand: () => number = Math.random): Promise<GiveawayView> {
  const { s, link, gift } = await advance(env, now, rand);
  const v: GiveawayView = { ...(await viewOf(env, now, s, link, gift)), ...(await dropOf(env)) };
  const lottery = v.kind === 'player' ? await lotteryOf(env) : null;
  if (lottery) { delete v.plays; v.lottery = lottery; }
  return s.held > 0 ? { ...v, held: s.held } : v;
}

/**
 * The lottery picture, or null when every player in the list carries the same plays (or it cannot be read). Counts
 * and past winners only: nothing here says which link holds what.
 */
async function lotteryOf(env: GiveawayEnv): Promise<GiveawayView['lottery'] | null> {
  try {
    const groups = await q<{ amount: number; total: number; left: number }>(env,
      `SELECT g.amount AS amount, COUNT(*) AS total, SUM(CASE WHEN l.ended_at IS NULL THEN 1 ELSE 0 END) AS left
       FROM radio_giveaway_links l JOIN radio_gifts g ON g.code_hash=l.code_hash WHERE l.archived=0 AND g.player_id IS NULL GROUP BY g.amount`);
    const rows = groups.map((r) => ({ plays: giftPlays(BigInt(Number(r.amount))), total: Number(r.total), left: Number(r.left) })).filter((r) => r.plays > 0);
    if (rows.length < 2) return null;
    rows.sort((a, b) => b.plays - a.plays);
    const won = await q<{ amount: number }>(env,
      `SELECT g.amount AS amount FROM radio_giveaway_links l JOIN radio_gifts g ON g.code_hash=l.code_hash
       WHERE l.archived=0 AND l.outcome='claimed' AND g.player_id IS NULL ORDER BY l.ended_at, l.pos LIMIT 2000`);
    return {
      min: rows[rows.length - 1].plays, max: rows[0].plays,
      tiers: rows.map((r) => ({ id: tierOfPlays(r.plays).id, ...r })),
      won: won.map((w) => tierOfPlays(giftPlays(BigInt(Number(w.amount)))).id)
    };
  } catch { return null; }
}

/** What kind of gift this list is giving away, and the plays it carries: from the link on show or next up, else the last one. */
async function dropOf(env: GiveawayEnv): Promise<Pick<GiveawayView, 'kind' | 'plays'>> {
  const join = 'SELECT g.player_id, g.amount FROM radio_giveaway_links l JOIN radio_gifts g ON g.code_hash=l.code_hash';
  type Row = { player_id: string | null; amount: number | null };
  // Extra detail for the page's wording: if it cannot be read, the page is told nothing rather than something wrong.
  const row = await (async () => (await first<Row>(env, `${join} WHERE l.archived=0 AND l.ended_at IS NULL ORDER BY l.pos LIMIT 1`)) ?? (await first<Row>(env, `${join} WHERE l.archived=0 ORDER BY l.pos DESC LIMIT 1`)))().catch(() => null);
  if (!row) return {};
  const amount = Number(row.amount);
  const plays = Number.isSafeInteger(amount) && amount > 0 ? giftPlays(BigInt(amount)) : 0;
  return { kind: row.player_id ? 'album' : 'player', ...(plays > 0 ? { plays } : {}) };
}

async function viewOf(env: GiveawayEnv, now: number, s: State, link: Link | null, gift: GiftRow | null): Promise<GiveawayView> {
  const counts = await first<{ claimed: number; left: number }>(env,
    "SELECT SUM(CASE WHEN outcome='claimed' THEN 1 ELSE 0 END) AS claimed, SUM(CASE WHEN ended_at IS NULL THEN 1 ELSE 0 END) AS left FROM radio_giveaway_links WHERE archived=0");
  let claimed = Number(counts?.claimed ?? 0), left = Number(counts?.left ?? 0);
  const base = { claimed, left, now };
  if (s.paused) return { state: 'paused', ...base };
  if (link && gift) {
    if (gift.status === 'claiming') {
      claimed += 1; left = Math.max(0, left - 1);
      return { state: 'taken', claimed, left, now, wallet: shortAddress(gift.claimed_by), ...(s.next_at > now ? { nextAt: s.next_at } : {}) };
    }
    const player = gift.player_id ? await playerView(env, gift.player_id).catch(() => null) : null;
    return {
      state: 'live', code: link.code, ...base,
      ...(player ? { album: { title: player.title, subtitle: player.subtitle, cover: player.cover, songs: listedTracks(player).map((t) => ({ title: t.title, artist: t.artist })) } } : {})
    };
  }
  if (left <= 0) return { state: 'done', ...base };
  // Between links: congratulate the last winner and count down to the next.
  const last = await first<{ claimed_by: string | null }>(env,
    "SELECT g.claimed_by FROM radio_giveaway_links l JOIN radio_gifts g ON g.code_hash=l.code_hash WHERE l.archived=0 AND l.outcome='claimed' AND g.claimed_by IS NOT NULL ORDER BY g.claimed_at DESC LIMIT 1");
  return { state: 'waiting', ...base, ...(last?.claimed_by && s.next_at > now ? { wallet: shortAddress(last.claimed_by) } : {}), ...(s.next_at > now ? { nextAt: s.next_at } : {}) };
}

// ---------------------------------------------------------------------------- operator

/** Every gift code in a pasted blob: full links (`…#gift=CODE`, `?gift=CODE`) or bare 22-character codes, one or many. */
export function codesIn(text: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const m of text.matchAll(/gift=([A-Za-z0-9_-]{22})(?![A-Za-z0-9_-])|(?<![A-Za-z0-9_=-])([A-Za-z0-9_-]{22})(?![A-Za-z0-9_-])/g)) {
    const code = (m[1] ?? m[2])!;
    if (!seen.has(code)) { seen.add(code); out.push(code); }
  }
  return out;
}

/** The operator's secret: Authorization: Bearer <RADIO_GIVEAWAY_SECRET> (24+ characters, compared without early exit). */
export function giveawayAuthorised(env: GiveawayEnv, header: string | null): boolean {
  const secret = env.RADIO_GIVEAWAY_SECRET?.trim();
  if (!secret || secret.length < 24 || !header) return false;
  const a = new TextEncoder().encode(header.replace(/^Bearer\s+/i, '')), b = new TextEncoder().encode(secret);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

/**
 * Operator actions. `add` takes `text`, any blob with links or codes in it; only codes that are real, live gifts are
 * kept (a typo cannot sit in the list unnoticed) and the report says what was left out. No action ever returns a code.
 */
export async function giveawayAdmin(env: GiveawayEnv, body: { action?: string; text?: unknown; minSeconds?: unknown; maxSeconds?: unknown; count?: unknown; shuffle?: unknown }, now: number) {
  await ensureGiveawayTables(env);
  const act = String(body.action ?? 'status');
  if (act === 'add') {
    if (typeof body.text !== 'string') throw new GiftError('text required (a list of gift links).');
    const codes = codesIn(body.text);
    let added = 0, duplicates = 0;
    const notFound: number[] = [], notLive: number[] = [];
    const good: { code: string; hash: string }[] = [];
    for (const [i, code] of codes.entries()) {
      const hash = giftCodeHash(code);
      const g = await giftOf(env, hash);
      if (!g) { notFound.push(i + 1); continue; }
      if (!isFree(g, now)) { notLive.push(i + 1); continue; }
      good.push({ code, hash });
    }
    // `shuffle: true` (a lottery): the links go in in a random order, so nobody can tell from the batch they were made
    // in which one holds what. Drawn with the platform's secure random source.
    if (body.shuffle === true) {
      for (let i = good.length - 1; i > 0; i--) {
        const r = new Uint32Array(1); crypto.getRandomValues(r);
        const j = r[0] % (i + 1);
        [good[i], good[j]] = [good[j], good[i]];
      }
    }
    for (const { code, hash } of good) {
      const n = await exec(env, 'INSERT OR IGNORE INTO radio_giveaway_links(code, code_hash, added_at) VALUES(?,?,?)', [code, hash, now]);
      if (n) added++; else duplicates++;
    }
    // `notFound` / `notLive` are the positions (1 = first) of the entries in what was pasted, never the codes.
    return { added, duplicates, notFound, notLive, ...(await adminStatus(env, now)) };
  }
  if (act === 'archive') {
    // Close the drop that is in the list and start from nothing: every link not yet given away is withdrawn from the
    // page (its gift is untouched: a link someone already holds still works, and an unclaimed one refunds to whoever
    // paid for it when it expires), the counts and the wall reset, and "held" goes back to none. Nothing is deleted.
    const withdrawn = await exec(env, "UPDATE radio_giveaway_links SET ended_at=?, outcome='archived' WHERE archived=0 AND ended_at IS NULL", [now]);
    const archived = await exec(env, 'UPDATE radio_giveaway_links SET archived=1 WHERE archived=0');
    await exec(env, 'UPDATE radio_giveaway_state SET current=NULL, next_at=0, held=0, updated_at=? WHERE id=1', [now]);
    return { archived, withdrawn, ...(await adminStatus(env, now)) };
  }
  if (act === 'pause' || act === 'resume') {
    await exec(env, 'UPDATE radio_giveaway_state SET paused=?, updated_at=? WHERE id=1', [act === 'pause' ? 1 : 0, now]);
  } else if (act === 'gap') {
    const lo = Number(body.minSeconds), hi = Number(body.maxSeconds);
    if (![lo, hi].every((n) => Number.isFinite(n) && n >= 0 && n <= MAX_GAP_S) || hi < lo) throw new GiftError(`minSeconds and maxSeconds must be 0-${MAX_GAP_S}, min no larger than max.`);
    await exec(env, 'UPDATE radio_giveaway_state SET gap_min=?, gap_max=?, updated_at=? WHERE id=1', [Math.round(lo), Math.round(hi), now]);
  } else if (act === 'skip') {
    // Retire the link on show without waiting for it: it is simply never offered again, and the next one comes after the pause.
    const s = await readState(env);
    if (s.current && await exec(env, 'UPDATE radio_giveaway_state SET current=NULL, next_at=?, updated_at=? WHERE id=1 AND current=?', [now + gapMs(s, Math.random), now, s.current])) {
      await exec(env, "UPDATE radio_giveaway_links SET ended_at=?, outcome='skipped' WHERE pos=?", [now, s.current]);
    }
  } else if (act === 'held') {
    const n = Number(body.count);
    if (!Number.isInteger(n) || n < 0 || n > 10_000) throw new GiftError('count must be a whole number from 0 to 10000.');
    await exec(env, 'UPDATE radio_giveaway_state SET held=?, updated_at=? WHERE id=1', [n, now]);
  } else if (act === 'now') {
    await exec(env, 'UPDATE radio_giveaway_state SET next_at=0, updated_at=? WHERE id=1', [now]); // show the next link without waiting out the pause
  } else if (act !== 'status') throw new GiftError('Unknown action.');
  return adminStatus(env, now);
}

async function adminStatus(env: GiveawayEnv, now: number) {
  const { s, link } = await advance(env, now);
  const c = await first<{ total: number; claimed: number; lost: number; skipped: number; unseen: number }>(env,
    `SELECT COUNT(*) AS total, SUM(outcome='claimed') AS claimed, SUM(outcome='lost') AS lost, SUM(outcome='skipped') AS skipped,
            SUM(shown_at IS NULL AND ended_at IS NULL) AS unseen FROM radio_giveaway_links WHERE archived=0`);
  return {
    total: Number(c?.total ?? 0), claimed: Number(c?.claimed ?? 0), lost: Number(c?.lost ?? 0), skipped: Number(c?.skipped ?? 0), unseen: Number(c?.unseen ?? 0),
    onShow: link && !link.ended_at ? link.pos : null, held: s.held, paused: !!s.paused, gap: { minSeconds: s.gap_min, maxSeconds: s.gap_max },
    nextInSeconds: s.current ? null : Math.max(0, Math.ceil((s.next_at - now) / 1000))
  };
}
