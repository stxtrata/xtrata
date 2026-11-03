/**
 * Pure helpers for the casino round-log ingest endpoint (functions/casino/log.ts).
 * Kept separate from the route so they are unit-testable without a live D1 binding
 * (tests: functions/lib/__tests__/casino-ingest.test.ts).
 *
 * Contract v1, POST /casino/log, JSON body:
 *   { v:1, page:'casino'|'casino-b', pid:'p_…', sid:'s_…', addr:null|'ST…', events:[ … up to 50 … ] }
 * Every event carries seq (counter per sid), t (client epoch ms), m (machine) and k (kind). Per-kind fields are in
 * docs/plans/CASINO-ROUND-LOG.md and the column mapping in migrations/033_casino_events.sql.
 *
 * Validation is strict and silent: a bad envelope drops the whole request, a bad event drops only that event.
 * Nothing here ever throws on hostile input.
 */
export const MAX_EVENTS = 50;
export const MAX_BODY_BYTES = 64_000;
export const MAX_DETAIL_CHARS = 400;
/** Largest number accepted for amounts and counters (whole LAYR, sequence numbers, block heights). */
export const MAX_NUMBER = 1e12;
/** Latest client timestamp accepted: 1 Jan 2100 in epoch milliseconds. Today's epoch ms (about 1.8e12) is above MAX_NUMBER. */
export const MAX_CLIENT_TIME = 4_102_444_800_000;
/** Design return to player of all five fruit machines (docs/plans/CASINO-ROUND-LOG.md). */
export const THEORY_RTP = 0.9438;

/** Shown beside every RTP reading so a lucky or unlucky stretch is not mistaken for a fault. */
export const SAMPLE_CAUTION =
  "Small samples swing widely. A slot machine's real return only settles near its design figure after about a million paid spins (plus or minus 1%). Before that, a high or low reading is mostly luck.";

export const PAGES = ['casino', 'casino-b'] as const;
export const GAME_MACHINES = ['bf', 'drop', 'twins', 'ds', 'nv'] as const;
export const MACHINES = [...GAME_MACHINES, 'ex', 'bank'] as const;
export const KINDS = ['spin', 'bonus', 'gamble', 'buy', 'move'] as const;

export type CasinoPage = (typeof PAGES)[number];
export type CasinoMachine = (typeof MACHINES)[number];
export type CasinoKind = (typeof KINDS)[number];

export const PID_PATTERN = /^p_[a-z0-9]{10,24}$/;
export const SID_PATTERN = /^s_[a-z0-9]{6,16}$/;
/** Testnet addresses (ST single-sig, SN multisig): the only ones this casino stores. */
export const ADDRESS_PATTERN = /^S[TN][0-9A-HJKMNP-TV-Z]{26,40}$/;
/** Mainnet-shaped addresses (SP, SM) are accepted but NOT stored: the batch is kept and addr is null. */
const MAINNET_ADDRESS_PATTERN = /^S[PM][0-9A-HJKMNP-TV-Z]{26,40}$/;
const TX_PATTERN = /^(?:0x)?([0-9a-f]{64})$/i;
const RID_PATTERN = /^[0-9a-f]{1,32}$/i;
const CHOICE_PATTERN = /^[a-z]{1,8}$/;

export interface Envelope {
  page: CasinoPage;
  pid: string;
  sid: string;
  addr: string | null;
  events: unknown[];
}

/** An event after validation: only the columns it fills. Everything else is null. */
export interface CasinoEvent {
  seq: number;
  ct: number;
  machine: CasinoMachine;
  kind: CasinoKind;
  bet: number | null;
  win: number | null;
  jp: number | null;
  free: number | null;
  stops: string | null;
  flags: string | null;
  rid: string | null;
  tx: string | null;
  detail: string | null;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** A whole number from 0 to max (default MAX_NUMBER), or null. Strings, NaN, fractions and negatives are all refused. */
export const wholeNumber = (value: unknown, max: number = MAX_NUMBER): number | null =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= max ? value : null;

/** 0 or 1 (a boolean is accepted and turned into 0/1), or null. */
const flag = (value: unknown): 0 | 1 | null =>
  value === 0 || value === false ? 0 : value === 1 || value === true ? 1 : null;

const inList = <T extends string>(list: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && (list as readonly string[]).includes(value);

/** Checks the outer object. Returns null for anything that is not a well-formed v1 envelope. */
export function parseEnvelope(payload: unknown): Envelope | null {
  if (!isRecord(payload) || payload.v !== 1) return null;
  const { page, pid, sid, addr, events } = payload;
  if (!inList(PAGES, page)) return null;
  if (typeof pid !== 'string' || !PID_PATTERN.test(pid)) return null;
  if (typeof sid !== 'string' || !SID_PATTERN.test(sid)) return null;
  if (
    addr != null &&
    (typeof addr !== 'string' ||
      !(ADDRESS_PATTERN.test(addr) || MAINNET_ADDRESS_PATTERN.test(addr)))
  ) {
    return null;
  }
  if (!Array.isArray(events)) return null;
  const stored = typeof addr === 'string' && ADDRESS_PATTERN.test(addr) ? addr : null;
  return { page, pid, sid, addr: stored, events: events.slice(0, MAX_EVENTS) };
}

const blank = (seq: number, ct: number, machine: CasinoMachine, kind: CasinoKind): CasinoEvent => ({
  seq,
  ct,
  machine,
  kind,
  bet: null,
  win: null,
  jp: null,
  free: null,
  stops: null,
  flags: null,
  rid: null,
  tx: null,
  detail: null
});

/** The optional round id: hex up to 32 characters. Returns undefined when present but malformed. */
function readRid(value: unknown): string | null | undefined {
  if (value == null) return null;
  return typeof value === 'string' && RID_PATTERN.test(value) ? value.toLowerCase() : undefined;
}

const intList = (value: unknown, max: number, limit: number): number[] | null => {
  if (!Array.isArray(value) || value.length > max) return null;
  const out: number[] = [];
  for (const item of value) {
    const n = wholeNumber(item);
    if (n === null || n > limit) return null;
    out.push(n);
  }
  return out;
};

/**
 * Bonus detail is rebuilt from a whitelist, never copied: nothing the client sends beyond these keys is stored.
 * Too long to fit (over MAX_DETAIL_CHARS) means the detail is left out, not cut, so the column is always valid JSON.
 */
function readBonusDetail(type: string, raw: unknown): string | null | undefined {
  if (raw == null) return null;
  if (!isRecord(raw)) return undefined;
  const out: Record<string, unknown> = {};
  if (type === 'vault') {
    if (raw.aw !== undefined) {
      const aw = intList(raw.aw, 9, 1_000_000);
      if (!aw) return undefined;
      out.aw = aw;
    }
    if (raw.pk !== undefined) {
      const pk = intList(raw.pk, 3, 8);
      if (!pk) return undefined;
      out.pk = pk;
    }
  } else if (type === 'chain') {
    if (raw.sum !== undefined) {
      const sum = wholeNumber(raw.sum);
      if (sum === null) return undefined;
      out.sum = sum;
    }
    if (raw.full !== undefined) {
      const full = flag(raw.full);
      if (full === null) return undefined;
      out.full = full;
    }
  } else {
    if (raw.mult !== undefined) {
      const mult = wholeNumber(raw.mult);
      if (mult === null) return undefined;
      out.mult = mult;
    }
  }
  if (Object.keys(out).length === 0) return null;
  const text = JSON.stringify(out);
  return text.length > MAX_DETAIL_CHARS ? null : text;
}

/** Validates one event. Returns the columns to store, or null when anything about it is wrong. */
export function validateEvent(raw: unknown): CasinoEvent | null {
  if (!isRecord(raw)) return null;
  const seq = wholeNumber(raw.seq);
  const ct = wholeNumber(raw.t, MAX_CLIENT_TIME);
  if (seq === null || ct === null) return null;
  if (!inList(MACHINES, raw.m) || !inList(KINDS, raw.k)) return null;
  const machine = raw.m;
  const kind = raw.k;
  const isGame = (GAME_MACHINES as readonly string[]).includes(machine);
  const ev = blank(seq, ct, machine, kind);

  if (kind === 'spin') {
    if (!isGame) return null;
    const bet = wholeNumber(raw.bet);
    const win = wholeNumber(raw.win);
    const jp = wholeNumber(raw.jp ?? 0);
    const free = flag(raw.free);
    const stops = intList(raw.st, 5, 31);
    const rid = readRid(raw.rid);
    if (bet === null || bet < 20 || bet > 100_000) return null;
    if (win === null || jp === null || jp > win || free === null) return null;
    if (!stops || stops.length !== 5 || rid === undefined) return null;
    let fx = '';
    if (raw.fx != null) {
      if (typeof raw.fx !== 'string' || !/^[FVC]{0,3}$/.test(raw.fx)) return null;
      fx = raw.fx;
    }
    Object.assign(ev, { bet, win, jp, free, stops: stops.join(','), flags: fx || null, rid });
    return ev;
  }

  if (kind === 'bonus') {
    if (!isGame) return null;
    const bet = wholeNumber(raw.bet);
    const win = wholeNumber(raw.win);
    const jp = wholeNumber(raw.jp ?? 0);
    const rid = readRid(raw.rid);
    if (!inList(['vault', 'chain', 'pick'] as const, raw.ty)) return null;
    if (bet === null || bet < 20 || bet > 100_000) return null;
    if (win === null || jp === null || jp > win || rid === undefined) return null;
    const detail = readBonusDetail(raw.ty, raw.d);
    if (detail === undefined) return null;
    Object.assign(ev, { bet, win, jp, rid, flags: raw.ty, detail });
    return ev;
  }

  if (kind === 'gamble') {
    if (!isGame) return null;
    const stake = wholeNumber(raw.stake);
    const win = wholeNumber(raw.win);
    const w = flag(raw.w);
    if (stake === null || stake < 1 || win === null || w === null) return null;
    if (win !== (w ? stake * 2 : 0)) return null;
    let ch: string | null = null;
    if (raw.ch != null) {
      if (typeof raw.ch !== 'string' || !CHOICE_PATTERN.test(raw.ch)) return null;
      ch = raw.ch;
    }
    Object.assign(ev, { bet: stake, win, detail: JSON.stringify(ch ? { w, ch } : { w }) });
    return ev;
  }

  if (kind === 'buy') {
    const layr = wholeNumber(raw.layr);
    if (layr === null || layr < 1 || typeof raw.tx !== 'string') return null;
    const match = TX_PATTERN.exec(raw.tx);
    if (!match) return null;
    let detail: string | null = null;
    if (raw.bh != null) {
      const bh = wholeNumber(raw.bh);
      if (bh === null) return null;
      detail = JSON.stringify({ bh });
    }
    Object.assign(ev, { tx: `0x${match[1].toLowerCase()}`, win: layr, detail });
    return ev;
  }

  // move
  const n = wholeNumber(raw.n);
  if (n === null || n < 1 || !inList(['in', 'out'] as const, raw.dir)) return null;
  Object.assign(ev, { flags: raw.dir, win: n });
  return ev;
}

export const CASINO_COLUMNS = [
  'at',
  'ct',
  'day',
  'page',
  'pid',
  'sid',
  'seq',
  'addr',
  'machine',
  'kind',
  'bet',
  'win',
  'jp',
  'free',
  'stops',
  'flags',
  'rid',
  'tx',
  'detail'
] as const;

/**
 * INSERT OR IGNORE against UNIQUE(pid, sid, seq): sending the same batch twice (a retry, a double beacon) stores it once.
 * 19 bound values per row, so one statement per row (D1 allows 100 bound values per statement, and a batch of statements).
 */
export const CASINO_INSERT_SQL = `INSERT OR IGNORE INTO casino_events
  (${CASINO_COLUMNS.join(', ')})
 VALUES (${CASINO_COLUMNS.map(() => '?').join(',')})`;

export const utcDay = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

/** The bound values for CASINO_INSERT_SQL, in CASINO_COLUMNS order. */
export function eventBinds(envelope: Envelope, ev: CasinoEvent, now: number): unknown[] {
  return [
    now,
    ev.ct,
    utcDay(now),
    envelope.page,
    envelope.pid,
    envelope.sid,
    ev.seq,
    envelope.addr,
    ev.machine,
    ev.kind,
    ev.bet,
    ev.win,
    ev.jp,
    ev.free,
    ev.stops,
    ev.flags,
    ev.rid,
    ev.tx,
    ev.detail
  ];
}

export interface PreparedIngest {
  rows: unknown[][];
  accepted: number;
  rejected: number;
}

/** From a parsed JSON body to the rows to write. Null when the envelope is bad or nothing in it is usable. */
export function prepareIngest(payload: unknown, now: number): PreparedIngest | null {
  const envelope = parseEnvelope(payload);
  if (!envelope) return null;
  const rows: unknown[][] = [];
  for (const raw of envelope.events) {
    const ev = validateEvent(raw);
    if (ev) rows.push(eventBinds(envelope, ev, now));
  }
  if (rows.length === 0) return null;
  return { rows, accepted: rows.length, rejected: envelope.events.length - rows.length };
}
