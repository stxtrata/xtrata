/**
 * Reasons to come back (docs/plans/CASINO-COME-BACK-PLAN.md, phase 3 of the engagement review): levels and badges, daily
 * missions, weekly leaderboards, slot tournaments, a shared progressive jackpot, a LAYR balance that follows the player between
 * devices, friends, and happy hour. Pure (no Cloudflare types) like casino-social.ts; the room's Durable Object stores the records
 * and moves the messages.
 *
 * Trust, honestly: LAYR is play money kept by each player's page, and the page reports its own hands and spins (`log`). The room
 * checks shape and rate and keeps the numbers plausible, but a player running modified code could inflate their own level, board
 * entries or balance. That is acceptable for play money; real prizes wait for on-chain LAYR (phase 4), where the contracts are the
 * record. Nothing here moves STX or touches a contract.
 */
import { DAY_MS, TABLES, dayOf } from './casino-social';

export const PROGRESS_FEATURES = ['progress', 'missions', 'boards', 'tourney', 'jackpot', 'bal', 'friends', 'hh'] as const;

export const MACHINES = ['drop', 'twins', 'ds', 'bf', 'nv'] as const;
export type Machine = (typeof MACHINES)[number];
export const isMachine = (v: unknown): v is Machine => typeof v === 'string' && (MACHINES as readonly string[]).includes(v);
const isGame = (v: unknown): v is string => isMachine(v) || (typeof v === 'string' && (TABLES as readonly string[]).includes(v));
const short = (a: string) => (a.length <= 12 ? a : `${a.slice(0, 5)}…${a.slice(-4)}`);
const addressLike = (v: unknown): v is string => typeof v === 'string' && /^S[0-9A-Z]{4,63}$/.test(v);
const r2 = (n: number) => Math.round(n * 100) / 100;

// ------------------------------------------------------------------ the schedule: happy hour and the slot tournament

/**
 * Times of day (UTC): happy hour from 19:00 for an hour, then the slot tournament from 20:00 for 30 minutes (UK evening; 20:00 UK
 * in winter, 21:00 in summer). The tournament machine changes every day. `period` lets a test run the schedule every few minutes.
 */
export type Schedule = { period: number; hh: [number, number]; tour: [number, number] };
export const DEFAULT_SCHEDULE: Schedule = { period: DAY_MS, hh: [19 * 3_600_000, 3_600_000], tour: [20 * 3_600_000, 1_800_000] };
/** From the Worker variable CASINO_SCHEDULE (JSON, for tests); anything odd falls back to the default. */
export const parseSchedule = (raw: unknown): Schedule => {
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const ok = (p: unknown): p is [number, number] => Array.isArray(p) && p.length === 2 && p.every((n) => Number.isSafeInteger(n) && n >= 0);
    if (v && Number.isSafeInteger(v.period) && v.period >= 60_000 && ok(v.hh) && ok(v.tour) && v.hh[1] > 0 && v.tour[1] > 0) return { period: v.period, hh: v.hh, tour: v.tour };
  } catch { /* the default */ }
  return DEFAULT_SCHEDULE;
};
/** The current or next window that starts `offset` into each period and lasts `length`. `n` numbers the periods. */
const windowAt = (now: number, period: number, [offset, length]: [number, number]) => {
  let n = Math.floor((now - offset) / period);
  if (now >= n * period + offset + length) n += 1;
  const start = n * period + offset, end = start + length;
  return { n, start, end, on: now >= start && now < end };
};
export const happyHour = (now: number, s: Schedule = DEFAULT_SCHEDULE) => { const w = windowAt(now, s.period, s.hh); return { start: w.start, end: w.end, on: w.on }; };
export const tourneyAt = (now: number, s: Schedule = DEFAULT_SCHEDULE) => {
  const w = windowAt(now, s.period, s.tour);
  return { ...w, g: MACHINES[((w.n % MACHINES.length) + MACHINES.length) % MACHINES.length] as Machine };
};
/** The most recent tournament that has finished (to settle it lazily: the room has no timers). */
export const lastFinishedTourney = (now: number, s: Schedule = DEFAULT_SCHEDULE) => {
  const n = tourneyAt(now, s).n - 1;      // tourneyAt gives the running or the next one; the one before it has ended
  return { n, end: n * s.period + s.tour[0] + s.tour[1] };
};

// ------------------------------------------------------------------ messages a client may send

export type LogMessage = { t: 'log'; k: 'hand' | 'spin'; g: string; bet: number; won: number; free: boolean; sh: boolean };
export type ProgressMessage =
  | LogMessage
  | { t: 'bal'; init: number }
  | { t: 'bal'; d: number }
  | { t: 'board' }
  | { t: 'friends'; list: string[] }
  | { t: 'tjoin' }
  | { t: 'card'; a: string }
  | { t: 'mission' };

export const MAX_BET = 1_000_000;
export const MAX_WIN = 1_000_000_000;
export const MAX_BAL_STEP = 50_000_000;
export const MAX_BALANCE = 10_000_000_000;
export const MAX_FRIENDS = 100;

export const parseProgressMessage = (value: any): { ok: true; msg: ProgressMessage } | { ok: false; code: string } | null => {
  switch (value?.t) {
    case 'log': {
      const { k, g, bet, won } = value;
      if ((k !== 'hand' && k !== 'spin') || !isGame(g)) return { ok: false, code: 'log-bad' };
      if (k === 'spin' && !isMachine(g)) return { ok: false, code: 'log-bad' };
      if (typeof bet !== 'number' || !Number.isFinite(bet) || bet <= 0 || bet > MAX_BET) return { ok: false, code: 'log-bad' };
      if (typeof won !== 'number' || !Number.isFinite(won) || won < 0 || won > MAX_WIN) return { ok: false, code: 'log-bad' };
      return { ok: true, msg: { t: 'log', k, g, bet: r2(bet), won: r2(won), free: value.free === true, sh: value.sh === true } };
    }
    case 'bal': {
      if (value.init !== undefined) {
        const v = value.init;
        return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= MAX_BALANCE ? { ok: true, msg: { t: 'bal', init: r2(v) } } : { ok: false, code: 'bal-bad' };
      }
      const d = value.d;
      return typeof d === 'number' && Number.isFinite(d) && Math.abs(d) <= MAX_BAL_STEP && d !== 0 ? { ok: true, msg: { t: 'bal', d: r2(d) } } : { ok: false, code: 'bal-bad' };
    }
    case 'board': return { ok: true, msg: { t: 'board' } };
    case 'tjoin': return { ok: true, msg: { t: 'tjoin' } };
    case 'mission': return { ok: true, msg: { t: 'mission' } };
    case 'card': return addressLike(value.a) ? { ok: true, msg: { t: 'card', a: value.a } } : { ok: false, code: 'card-bad' };
    case 'friends': {
      if (!Array.isArray(value.list) || value.list.length > MAX_FRIENDS || !value.list.every(addressLike)) return { ok: false, code: 'friends-bad' };
      return { ok: true, msg: { t: 'friends', list: [...new Set(value.list as string[])] } };
    }
    default: return null;
  }
};

// ------------------------------------------------------------------ levels and badges

/** XP: for playing, never for the amount staked or lost. Twice as much in happy hour. Play XP is capped per day (autoplay). */
export const XP = { hand: 10, spin: 4, win: 5, big: 25, gift: 15, daily: 50, mission: 100, allMissions: 150, tourney: 40 } as const;
export const DAILY_PLAY_XP = 3000;
/** Total XP needed to reach level L: 50·L·(L−1) (level 2 at 100, 3 at 300, 5 at 1,000, 10 at 4,500, 20 at 19,000). */
export const xpFor = (level: number) => 50 * level * (level - 1);
export const levelOf = (xp: number) => Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * Math.max(0, xp)) / 50)) / 2));

export type Stats = {
  h: number; s: number; w: number; bx: number; bw: number; bg: string | null;
  g: string[]; gv: number; rx: number; tw: number; jp: number; dk: number; tp: number;
};
export type Profile = {
  v: 1; xp: number; bd: string[]; st: Stats;
  day: { d: number; xp: number };
  wk: { id: number; h: number; xp: number; gv: number };
  ms: { d: number; p: number[]; paid: boolean[]; all: boolean };
  nt: Array<{ why: string; v: number; at: number }>;
};
export const newProfile = (): Profile => ({
  v: 1, xp: 0, bd: [],
  st: { h: 0, s: 0, w: 0, bx: 0, bw: 0, bg: null, g: [], gv: 0, rx: 0, tw: 0, jp: 0, dk: 0, tp: 0 },
  day: { d: 0, xp: 0 }, wk: { id: 0, h: 0, xp: 0, gv: 0 }, ms: { d: 0, p: [0, 0, 0], paid: [false, false, false], all: false }, nt: []
});
/** A stored profile, completed with any field an older record lacks. */
export const loadProfile = (raw: unknown): Profile => {
  const base = newProfile();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<Profile>;
  return {
    ...base, ...r, v: 1,
    st: { ...base.st, ...(r.st || {}) }, day: { ...base.day, ...(r.day || {}) }, wk: { ...base.wk, ...(r.wk || {}) },
    ms: { ...base.ms, ...(r.ms || {}) }, bd: Array.isArray(r.bd) ? r.bd : [], nt: Array.isArray(r.nt) ? r.nt.slice(-10) : []
  };
};

export const BADGES: Array<{ id: string; e: string; name: string; how: string; test: (st: Stats, lv: number) => boolean }> = [
  { id: 'first-win', e: '🍀', name: 'First win', how: 'Win a hand or a spin', test: (s) => s.w >= 1 },
  { id: 'hundred', e: '💯', name: 'Hundred hands', how: 'Play 100 hands or spins', test: (s) => s.h + s.s >= 100 },
  { id: 'big-win', e: '💥', name: 'Big winner', how: 'Win 10× your bet', test: (s) => s.bx >= 10 },
  { id: 'monster', e: '🐉', name: 'Monster win', how: 'Win 50× your bet', test: (s) => s.bx >= 50 },
  { id: 'high-roller', e: '💎', name: 'High roller', how: 'Win 100,000 LAYR at once', test: (s) => s.bw >= 100_000 },
  { id: 'grand-tour', e: '🗺️', name: 'Grand tour', how: 'Play every table', test: (s) => TABLES.every((t) => s.g.includes(t)) },
  { id: 'slot-fan', e: '🎰', name: 'Slot fan', how: 'Spin every machine', test: (s) => MACHINES.every((m) => s.g.includes(m)) },
  { id: 'regular', e: '📅', name: 'Regular', how: 'Come back 7 days in a row', test: (s) => s.dk >= 7 },
  { id: 'generous', e: '🍾', name: 'Generous', how: 'Send 10 drinks', test: (s) => s.gv >= 10 },
  { id: 'party', e: '🎉', name: 'Life of the party', how: 'React 50 times', test: (s) => s.rx >= 50 },
  { id: 'marathon', e: '🏃', name: 'Marathon', how: 'Play 1,000 hands or spins', test: (s) => s.h + s.s >= 1000 },
  { id: 'contender', e: '🎟️', name: 'Contender', how: 'Play in a slot tournament', test: (s) => s.tp >= 1 },
  { id: 'champion', e: '🏆', name: 'Champion', how: 'Win a slot tournament', test: (s) => s.tw >= 1 },
  { id: 'jackpot', e: '👑', name: 'Jackpot', how: 'Hit the progressive jackpot', test: (s) => s.jp >= 1 },
  { id: 'level-10', e: '⭐', name: 'Level 10', how: 'Reach level 10', test: (_, lv) => lv >= 10 }
];
/** Badges the profile has just earned (added to `p.bd`, returned so the room can announce them). */
export const awardBadges = (p: Profile): string[] => {
  const lv = levelOf(p.xp), fresh: string[] = [];
  for (const b of BADGES) if (!p.bd.includes(b.id) && b.test(p.st, lv)) { p.bd.push(b.id); fresh.push(b.id); }
  return fresh;
};
/** The badge shown on a name tag: the rarest one held (the latest in BADGES order). */
export const topBadge = (p: Pick<Profile, 'bd'>) => {
  let best: string | null = null, at = -1;
  for (const id of p.bd) { const i = BADGES.findIndex((b) => b.id === id); if (i > at) { at = i; best = id; } }
  return best;
};

/** Adds XP (doubled in happy hour; play XP capped per UTC day). Returns the XP actually added. */
export const addXp = (p: Profile, amount: number, now: number, happy: boolean, play: boolean) => {
  let add = Math.round(amount * (happy ? 2 : 1));
  const d = dayOf(now);
  if (p.day.d !== d) p.day = { d, xp: 0 };
  if (play) { add = Math.max(0, Math.min(add, DAILY_PLAY_XP - p.day.xp)); p.day.xp += add; }
  p.xp += add;
  weekOf(p, now).xp += add;
  return add;
};

// ------------------------------------------------------------------ the week (leaderboards reset every Monday 00:00 UTC)

/** Weeks numbered from Monday 5 January 1970 (1 January 1970 was a Thursday). */
export const weekId = (now: number) => Math.floor((dayOf(now) - 4) / 7);
export const weekStart = (id: number) => (id * 7 + 4) * DAY_MS;
const weekOf = (p: Profile, now: number) => {
  const id = weekId(now);
  if (p.wk.id !== id) p.wk = { id, h: 0, xp: 0, gv: 0 };
  return p.wk;
};

export type BoardEntry = { a: string; n: string; v: number; g?: string; x?: number };
export type Boards = { id: number; big: BoardEntry[]; xp: BoardEntry[]; play: BoardEntry[]; gift: BoardEntry[] };
export const BOARD_SIZE = 10;
export const emptyBoards = (id: number): Boards => ({ id, big: [], xp: [], play: [], gift: [] });
export const loadBoards = (raw: unknown, id: number): Boards => {
  const r = raw as Partial<Boards> | null;
  if (!r || r.id !== id) return emptyBoards(id);
  const list = (x: unknown) => (Array.isArray(x) ? (x as BoardEntry[]) : []);
  return { id, big: list(r.big), xp: list(r.xp), play: list(r.play), gift: list(r.gift) };
};
/**
 * Puts a player on one board: `big` keeps each player's single best win (by amount), the others hold each player's running weekly
 * total. Highest first, at most BOARD_SIZE. Returns true when the board changed.
 */
export const placeOnBoard = (b: Boards, kind: 'big' | 'xp' | 'play' | 'gift', entry: BoardEntry) => {
  const list = b[kind], before = JSON.stringify(list), prev = list.find((e) => e.a === entry.a);
  if (kind === 'big' && prev && prev.v >= entry.v) return false;
  const rest = list.filter((e) => e.a !== entry.a);
  b[kind] = (entry.v > 0 ? [...rest, entry] : rest).sort((x, y) => y.v - x.v).slice(0, BOARD_SIZE);
  return JSON.stringify(b[kind]) !== before;
};

// ------------------------------------------------------------------ daily missions

export type MissionKind = 'hand' | 'spin' | 'win' | 'shared' | 'gift' | 'react' | 'tchat' | 'salon';
export type Mission = { id: string; kind: MissionKind; g: string | null; need: number; text: string; reward: number };
const GAME_NAME: Record<string, string> = {
  blackjack: 'blackjack', baccarat: 'baccarat', sicbo: 'Sic Bo', holdem: "Hold'em", roulette: 'roulette', videopoker: 'video poker',
  drop: 'The Drop', twins: 'Forever Twins', ds: 'Deep Strata', bf: 'Block Fortune', nv: 'Neon Vault'
};
const PLAY_POOL: Mission[] = [
  ...['blackjack', 'baccarat'].map((g) => ({ id: 'hands-' + g, kind: 'hand' as const, g, need: 5, text: `Play 5 hands of ${GAME_NAME[g]}`, reward: 2_500 })),
  // Sic Bo took Hold'em's place in the main room and in this list (docs/plans/CASINO-MAIN-ROOM-PLAN.md), so everyone else's missions stay as they were
  { id: 'hands-sicbo', kind: 'hand' as const, g: 'sicbo', need: 5, text: 'Play 5 rounds of Sic Bo', reward: 2_500 },
  ...['roulette', 'videopoker'].map((g) => ({ id: 'hands-' + g, kind: 'hand' as const, g, need: 5, text: `Play 5 hands of ${GAME_NAME[g]}`, reward: 2_500 })),
  ...MACHINES.map((g) => ({ id: 'spins-' + g, kind: 'spin' as const, g, need: 20, text: `Spin ${GAME_NAME[g]} 20 times`, reward: 2_500 }))
];
const SOCIAL_POOL: Mission[] = [
  { id: 'drink', kind: 'gift', g: null, need: 1, text: 'Send someone a drink (or buy a round)', reward: 2_500 },
  { id: 'react', kind: 'react', g: null, need: 3, text: 'React 3 times', reward: 2_500 },
  { id: 'tchat', kind: 'tchat', g: null, need: 1, text: 'Say something in table chat', reward: 2_500 },
  { id: 'shared', kind: 'shared', g: null, need: 3, text: 'Play 3 shared rounds of roulette, baccarat or Sic Bo', reward: 2_500 }
];
const STRETCH_POOL: Mission[] = [
  { id: 'wins', kind: 'win', g: null, need: 3, text: 'Win 3 times, anywhere', reward: 5_000 },
  { id: 'salon', kind: 'salon', g: null, need: 1, text: "Play a game in the Salon (Hold'em or Liar's Dice)", reward: 5_000 },
  { id: 'variety', kind: 'hand', g: null, need: 10, text: 'Play 10 hands at any tables', reward: 5_000 }
];
/** Finishing all three on one day also pays this. */
export const ALL_MISSIONS_BONUS = 5_000;
const hashOf = (text: string) => { let h = 2166136261; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
/** The player's three missions for a UTC day: one to play, one social, one stretch. The same all day, different for each player. */
export const missionsFor = (who: string, day: number): Mission[] => {
  const h = hashOf(`${who}:${day}`);
  return [PLAY_POOL[h % PLAY_POOL.length], SOCIAL_POOL[(h >>> 8) % SOCIAL_POOL.length], STRETCH_POOL[(h >>> 16) % STRETCH_POOL.length]];
};
/** One event counted against today's missions. Returns the missions just completed (their rewards are paid by the room). */
export const advanceMissions = (p: Profile, who: string, now: number, ev: { kind: MissionKind; g?: string | null; n?: number }) => {
  const day = dayOf(now);
  if (p.ms.d !== day) p.ms = { d: day, p: [0, 0, 0], paid: [false, false, false], all: false };
  const list = missionsFor(who, day), done: Mission[] = [];
  list.forEach((m, i) => {
    if (p.ms.paid[i]) return;
    const match = m.kind === ev.kind && (!m.g || m.g === ev.g);
    if (!match) return;
    p.ms.p[i] = Math.min(m.need, p.ms.p[i] + (ev.n || 1));
    if (p.ms.p[i] >= m.need) { p.ms.paid[i] = true; done.push(m); }
  });
  const allNow = !p.ms.all && p.ms.paid.every(Boolean);
  if (allNow) p.ms.all = true;
  return { done, all: allNow };
};
export const missionView = (p: Profile, who: string, now: number) => {
  const day = dayOf(now), mine = p.ms.d === day ? p.ms : { p: [0, 0, 0], paid: [false, false, false], all: false };
  return { day, next: (day + 1) * DAY_MS, bonus: ALL_MISSIONS_BONUS, list: missionsFor(who, day).map((m, i) => ({ id: m.id, text: m.text, need: m.need, have: mine.p[i], done: mine.paid[i], reward: m.reward })) };
};

// ------------------------------------------------------------------ a hand or a spin, as the player's page reports it

export const BIG_X = 10;
/**
 * Applies one played hand or spin to the profile: counts, best win, games played, XP (with the win and big-win bonuses), and the
 * missions it advances. Free spins add their win but are not a new spin.
 */
export const applyLog = (p: Profile, who: string, msg: LogMessage, now: number, happy: boolean) => {
  const counted = !msg.free, x = msg.won / msg.bet, won = msg.won > msg.bet;
  if (counted) {
    if (msg.k === 'spin') p.st.s++; else p.st.h++;
    weekOf(p, now).h++;
    if (!p.st.g.includes(msg.g)) p.st.g.push(msg.g);
  }
  let xp = counted ? (msg.k === 'spin' ? XP.spin : XP.hand) : 0;
  let big: { x: number; w: number } | null = null;
  if (won) {
    p.st.w++; xp += XP.win;
    if (x > p.st.bx) p.st.bx = r2(x);
    const net = msg.won - msg.bet;
    if (net > p.st.bw) { p.st.bw = r2(net); p.st.bg = msg.g; }
    if (x >= BIG_X) xp += XP.big;
    big = { x: r2(x), w: r2(net) };
  }
  const added = addXp(p, xp, now, happy, true);
  const ms = [advanceMissions(p, who, now, { kind: msg.k === 'spin' ? 'spin' : 'hand', g: msg.g, n: counted ? 1 : 0 })];
  if (won) ms.push(advanceMissions(p, who, now, { kind: 'win' }));
  if (msg.sh && counted) ms.push(advanceMissions(p, who, now, { kind: 'shared' }));
  if (counted && (msg.g === 'pvpholdem' || msg.g === 'liars')) ms.push(advanceMissions(p, who, now, { kind: 'salon' }));
  return { added, big, done: ms.flatMap((m) => m.done), all: ms.some((m) => m.all) };
};

// ------------------------------------------------------------------ the slot tournament

/**
 * One tournament: 30 minutes on one machine. Joining is free; a player's score is the total of their wins as multiples of the bet
 * over their first TOURNEY_SPINS spins on that machine (so the size of the bet makes no difference: nobody is pushed to bet more).
 * Prizes are play LAYR, credited to the balance the room keeps (`bal`).
 */
export const TOURNEY_SPINS = 50;
export const TOURNEY_PRIZES = [50_000, 25_000, 10_000] as const;
export type TourneyEntry = { a: string; n: string; sc: number; sp: number };
export type Tourney = { n: number; g: Machine; start: number; end: number; e: Record<string, TourneyEntry>; done: boolean };
export const newTourney = (t: { n: number; g: Machine; start: number; end: number }): Tourney => ({ n: t.n, g: t.g, start: t.start, end: t.end, e: {}, done: false });
export const joinTourney = (t: Tourney, who: string, a: string) => {
  if (t.e[who]) return false;
  t.e[who] = { a, n: short(a), sc: 0, sp: 0 };
  return true;
};
/** A spin on the tournament machine by a player who joined, while it runs. Returns true when the score changed. */
export const scoreTourney = (t: Tourney, who: string, msg: LogMessage, now: number) => {
  const e = t.e[who];
  if (!e || t.done || now < t.start || now >= t.end || msg.k !== 'spin' || msg.g !== t.g) return false;
  if (!msg.free) { if (e.sp >= TOURNEY_SPINS) return false; e.sp++; } else if (e.sp === 0) return false;
  e.sc = r2(e.sc + msg.won / msg.bet);
  return true;
};
export const tourneyTop = (t: Tourney, size = 10) => Object.values(t.e).sort((x, y) => y.sc - x.sc || x.sp - y.sp).slice(0, size);
export const tourneyView = (t: Tourney | null, now: number, s: Schedule, who: string | null) => {
  const cur = tourneyAt(now, s);
  const live = t && t.n === cur.n ? t : null;
  return {
    t: 'tourney', n: cur.n, g: cur.g, start: cur.start, end: cur.end, on: cur.on, spins: TOURNEY_SPINS, prizes: TOURNEY_PRIZES,
    top: live ? tourneyTop(live) : [], players: live ? Object.keys(live.e).length : 0,
    mine: live && who && live.e[who] ? live.e[who] : null, at: now
  };
};
/** Ends a tournament: the top three with a score above zero win, in order. */
export const settleTourney = (t: Tourney) => {
  t.done = true;
  return Object.entries(t.e).filter(([, e]) => e.sc > 0).sort(([, x], [, y]) => y.sc - x.sc || x.sp - y.sp).slice(0, TOURNEY_PRIZES.length)
    .map(([who, e], i) => ({ who, a: e.a, n: e.n, sc: e.sc, place: i + 1, prize: TOURNEY_PRIZES[i] }));
};

// ------------------------------------------------------------------ the progressive jackpot

/**
 * One jackpot for every machine in the room. Each paid spin adds 1% of its bet (paid by the house: nothing is taken from the
 * spin), and each paid spin has the same small chance to win it, whatever the bet. The room draws the chance itself.
 */
export const JACKPOT_SEED = 100_000;
export const JACKPOT_SHARE = 0.01;
export const JACKPOT_ODDS = 5_000;
export type Jackpot = { v: number; last: { a: string; n: string; w: number; g: string; at: number } | null; hits: number };
export const loadJackpot = (raw: unknown): Jackpot => {
  const r = raw as Partial<Jackpot> | null;
  return { v: r && Number.isFinite(r.v) && (r.v as number) >= JACKPOT_SEED ? (r.v as number) : JACKPOT_SEED, last: r?.last || null, hits: r?.hits || 0 };
};
/** `roll` is a uniform number in [0, 1) from the room's own random source. */
export const feedJackpot = (j: Jackpot, msg: LogMessage, roll: number, odds = JACKPOT_ODDS) => {
  if (msg.k !== 'spin' || msg.free) return { hit: false as const, before: j.v };
  const before = j.v;
  j.v = r2(j.v + Math.max(1, msg.bet * JACKPOT_SHARE));
  if (roll * odds < 1) return { hit: true as const, before, win: j.v };
  return { hit: false as const, before };
};
export const resetJackpot = (j: Jackpot, winner: { a: string; g: string; w: number }, now: number) => {
  j.last = { a: winner.a, n: short(winner.a), w: winner.w, g: winner.g, at: now }; j.v = JACKPOT_SEED; j.hits++;
};
/** The jackpot is broadcast when it passes each 500 LAYR, not on every spin. */
export const jackpotStep = (before: number, after: number) => Math.floor(before / 500) !== Math.floor(after / 500);

// ------------------------------------------------------------------ the balance that follows the player

/**
 * The room keeps each player's LAYR balance (play money) so it follows them to another device. A page sends changes as deltas
 * (`bal {d}`), so two devices playing at once both count; the first page ever to sync sets the starting value (`bal {init}`). The
 * room also credits prizes here (missions, tournaments, the jackpot), and tells every connection of that player the new value.
 */
export type Balance = { v: number; rev: number };
export const applyBalance = (b: Balance | null, msg: { init: number } | { d: number }) => {
  if ('init' in msg) return b ? { store: null, bal: b } : { store: { v: msg.init, rev: 1 }, bal: { v: msg.init, rev: 1 } };
  const cur = b || { v: 0, rev: 0 };
  const next = { v: r2(Math.min(MAX_BALANCE, Math.max(0, cur.v + msg.d))), rev: cur.rev + 1 };
  return { store: next, bal: next };
};
export const creditBalance = (b: Balance | null, amount: number): Balance => ({ v: r2(Math.min(MAX_BALANCE, (b ? b.v : 0) + amount)), rev: (b ? b.rev : 0) + 1 });

// ------------------------------------------------------------------ what a player's own page and other players see

export const meView = (p: Profile, who: string, now: number) => {
  const lv = levelOf(p.xp);
  return { t: 'me', xp: p.xp, lv, from: xpFor(lv), to: xpFor(lv + 1), bd: p.bd, st: p.st, wk: p.wk.id === weekId(now) ? p.wk : { id: weekId(now), h: 0, xp: 0, gv: 0 }, missions: missionView(p, who, now), at: now };
};
/** The public card: what anyone in the room may see about a player (no balance, nothing they said). */
export const cardView = (p: Profile, a: string) => ({ t: 'card', a, n: short(a), lv: levelOf(p.xp), bd: p.bd, st: { h: p.st.h, s: p.st.s, w: p.st.w, bx: p.st.bx, bw: p.st.bw, bg: p.st.bg, tw: p.st.tw, jp: p.st.jp } });
