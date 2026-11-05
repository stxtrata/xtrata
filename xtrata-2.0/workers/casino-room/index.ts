/**
 * Casino room: the Durable Object that holds who is in the casino and where they sit (P0 spike of
 * docs/plans/CASINO-PRESENCE-PLAN.md).
 *
 * - One object (`idFromName('main')`) is the whole room. WebSockets use the Hibernation API, so an idle room costs almost
 *   nothing; the room's state lives in each connection's attachment and is rebuilt from `ctx.getWebSockets()` after a wake-up.
 * - No timers or alarms (they keep a Durable Object awake). Clean-up happens when a socket closes.
 * - This Worker has NO public route (workers_dev = false, no routes). Only the Pages project can reach the object, through
 *   its binding, and the Pages Function (functions/casino/room/ws.ts) is the only place that sets the trusted `x-px-addr`
 *   header after checking the player's session cookie. Never add a route or workers.dev address to this Worker.
 * - Everything the room decides is in functions/lib/casino-room.ts and is unit tested; this file only moves data.
 * - The room never touches money. A seat here does not give a seat at a contract table.
 * - Talk: the room also passes on public chat and private messages between signed-in players. Nothing said is stored or
 *   replayed to later joiners; only reports are written down (newest REPORT_KEEP, and a `[casino-room] report` log line).
 * - Spins: a player at a machine sends each spin's reel stops; the room passes them to everyone else so their copy of that
 *   cabinet spins to the same result. Only the player seated at that cabinet may send one, spins have their own limit (they
 *   never count against the general one), and nothing about them is kept. The `room` message lists `features: ['play']` so a
 *   newer client only sends spins to a room that understands them.
 * - Walking: a signed-in player on the floor sends `move {x, z, r}` a couple of times a second (or `move {off}`); the room keeps
 *   each connection's last position (in its attachment, so it survives hibernation), passes it to everyone else and lists the
 *   walkers in the `room` message. Moves have their own limit too. Still no timers: the room hibernates between messages.
 * - Chess (docs/plans/CASINO-CHESS-PLAN.md, section 12; functions/lib/casino-bets.ts and casino-chess-room.ts): the room compares the two
 *   pages' result reports, holds the players' stakes and spectators' bets (play money, through the balances it already keeps), runs
 *   the leaving rule (90 s grace) and pays out. It never reads a move. No new timers or alarms: deadlines are checked when someone
 *   connects, sends a chess message, or the existing once-a-minute check runs. Switches: CASINO_BETS_DISABLED (no new bets),
 *   CASINO_CHESS_RES_DISABLED (no new games tracked; games already tracked still finish).
 * - Guests (not signed in) see the room only when the Pages Function says so (`x-px-watch: 1`, from the Pages variable
 *   CASINO_ROOM_GUESTS). Otherwise they get the head count and nothing else: no seats, walkers, spins or arrivals
 *   (docs/plans/CASINO-ROOM-NEW-WALLETS-PLAN.md, step 6). Signed-in players always see everything.
 */
import { DurableObject } from 'cloudflare:workers';
import {
  MAX_SOCKETS,
  ROOM_FEATURES,
  applyAway,
  applyLeave,
  applyMove,
  applySit,
  applyStand,
  buildReport,
  canSee,
  deriveView,
  leaveFloor,
  newPeer,
  overflowForAddress,
  parseClientMessage,
  routeDm,
  routePlay,
  roomMessage,
  routeSay,
  setBlocks,
  shortAddress,
  staleIds,
  STALE_MS,
  SWEEP_MS,
  takeChatRate,
  takeMoveRate,
  takePlayRate,
  takeRate,
  upgradePeer,
  type Change,
  type Peer
} from '../../functions/lib/casino-room';
import {
  SOCIAL_FEATURES,
  applyBet,
  applySeek,
  bump,
  claimDaily,
  counterKey,
  currentBets,
  markSeen,
  pushWin,
  routeGift,
  routeReact,
  routeRelay,
  routeSpec,
  routeWin,
  seekers,
  tableAudience,
  takeLimit,
  type Counter,
  type DailyRecord,
  type DayCounts,
  type Out,
  type SeenRecord,
  type WinEntry
} from '../../functions/lib/casino-social';
import { ROUND_TABLES, roundInfo } from '../../functions/lib/casino-rounds';
import { CHESS_FEATURES } from '../../functions/lib/casino-bets';
import { ChessDesk, type Conn, type DeskStore } from '../../functions/lib/casino-chess-room';
import {
  ALL_MISSIONS_BONUS,
  JACKPOT_ODDS,
  PROGRESS_FEATURES,
  XP,
  addXp,
  advanceMissions,
  applyBalance,
  applyLog,
  awardBadges,
  cardView,
  creditBalance,
  feedJackpot,
  happyHour,
  jackpotStep,
  joinTourney,
  lastFinishedTourney,
  levelOf,
  loadBoards,
  loadJackpot,
  loadProfile,
  meView,
  newTourney,
  parseSchedule,
  placeOnBoard,
  resetJackpot,
  scoreTourney,
  settleTourney,
  topBadge,
  tourneyAt,
  tourneyView,
  weekId,
  weekStart,
  type Balance,
  type Boards,
  type LogMessage,
  type MissionKind,
  type Profile,
  type Schedule,
  type Tourney
} from '../../functions/lib/casino-progress';

/** Everything this room can do; a client only uses what is listed (an older client ignores what it does not know). */
const FEATURES = [...ROOM_FEATURES, ...SOCIAL_FEATURES, ...PROGRESS_FEATURES, ...CHESS_FEATURES] as const;
const switchedOn = (v: unknown) => v === '1' || v === 'true' || v === 1 || v === true;

interface Env { [key: string]: unknown }

const NONCE_PREFIX = 'n:';
/** Reports people have made about each other (plan section 5.3). Only the newest REPORT_KEEP are kept. */
const REPORT_PREFIX = 'r:';
const REPORT_KEEP = 200;
/** The social layer's storage: the round secret, the win feed, daily drops and first/last days per player, and day counters. */
const SECRET_KEY = 'sec';
const WINS_KEY = 'wins';
const DAILY_PREFIX = 'd:';
const SEEN_PREFIX = 'u:';
const COUNTER_PREFIX = 'c:';
/** Phase 3 (functions/lib/casino-progress.ts): profiles (XP, badges, stats, missions), balances, friends, the weekly boards, the
 *  tournaments and the jackpot. Players are keyed by their key hash (`k`), like the daily drop, so testnet and mainnet addresses of
 *  one key are one player. */
const PROFILE_PREFIX = 'p:';
const BALANCE_PREFIX = 'b:';
const FRIENDS_PREFIX = 'f:';
const BOARDS_PREFIX = 'wk:';
const TOURNEY_PREFIX = 't:';
const JACKPOT_KEY = 'jp';

export class CasinoRoom extends DurableObject<Env> {
  /** When this in-memory instance was created. After a hibernation the constructor runs again, so a changed value in a
   *  pong shows the room slept and woke (the P0 idle test uses this). Nothing depends on it. */
  private readonly up = Date.now();

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    // Who is here (docs/plans/CASINO-WHO-IS-HERE-PLAN.md): a bare "ping" is answered "pong" without waking the room, and the
    // time of the answer is kept per connection (getWebSocketAutoResponseTimestamp), so heartbeats cost nothing.
    try { ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong')); } catch { /* a stand-in runtime (tests) */ }
    const store: DeskStore = {
      get: (key) => ctx.storage.get(key) as Promise<any>,
      put: (entries) => ctx.storage.put(entries),
      delete: (keys) => ctx.storage.delete(keys),
      list: (options) => ctx.storage.list(options) as Promise<Map<string, any>>
    };
    this.desk = new ChessDesk(store, {
      on: () => !switchedOn(this.env.CASINO_CHESS_RES_DISABLED),
      betsOn: () => !switchedOn(this.env.CASINO_BETS_DISABLED) && !switchedOn(this.env.CASINO_CHESS_RES_DISABLED),
      count: (k) => { void this.count([k]); }
    });
  }

  /** The chess desk (functions/lib/casino-chess-room.ts): results, held stakes, bets and the leaving rule. */
  private readonly desk: ChessDesk;
  /** What this room offers: bets are left out while CASINO_BETS_DISABLED is set, and chess entirely while CASINO_CHESS_RES_DISABLED is. */
  private features() {
    const noRes = switchedOn(this.env.CASINO_CHESS_RES_DISABLED), noBets = noRes || switchedOn(this.env.CASINO_BETS_DISABLED);
    return FEATURES.filter((f) => !(noRes && f === 'cres') && !(noBets && f === 'cbet'));
  }
  /** Connections as the chess desk sees them (the desk sends through them and may note rate limits on their peer; callers save). */
  private conns(entries: Array<{ ws: WebSocket; peer: Peer }>): Conn[] {
    return entries.map((e) => ({ id: e.peer.id, peer: e.peer, send: (m: unknown) => this.send(e.ws, m) }));
  }

  // ------------------------------------------------------------------ who is here: closing connections that have gone quiet

  private swept = 0;
  /** STALE_MS, or the Worker variable CASINO_ROOM_STALE_MS for a test (normally unset). The check runs at least this often. */
  private staleMs() { const n = Number(this.env.CASINO_ROOM_STALE_MS); return Number.isFinite(n) && n >= 1000 ? n : STALE_MS; }
  private sweepMs() { return Math.min(SWEEP_MS, Math.max(1000, Math.floor(this.staleMs() / 2))); }
  private autoAt(ws: WebSocket): number | null {
    try { const d = this.ctx.getWebSocketAutoResponseTimestamp(ws); return d ? d.getTime() : null; } catch { return null; }
  }
  /** Closes every connection that promised heartbeats and has gone quiet (not `keep`, which just spoke), and frees its seat. */
  private async sweep(now: number, keep?: WebSocket) {
    this.swept = now;
    const all = this.peers();
    const stale = staleIds(all.filter((e) => e.ws !== keep).map(({ ws, peer }) => ({ id: peer.id, since: peer.since, hb: peer.hb, hd: peer.hd, auto: this.autoAt(ws) })), now, this.staleMs());
    for (const id of stale) {
      const e = all.find((x) => x.peer.id === id); if (!e) continue;
      try { e.ws.serializeAttachment(null); } catch { /* closing already */ }     // out of every list from now on
      try { e.ws.close(4002, 'quiet'); } catch { /* already closed */ }
      await this.gone(e.ws, e.peer);
    }
  }
  /** The once-a-minute check, only while someone is connected (an alarm wakes the room briefly; an empty room sets none). */
  private async keepSweeping(now: number) {
    try { if ((await this.ctx.storage.getAlarm()) == null) await this.ctx.storage.setAlarm(now + this.sweepMs()); } catch { /* a stand-in runtime (tests) */ }
  }
  async alarm() {
    const now = Date.now();
    await this.sweep(now);
    // The chess deadlines (the wait for the other page's report, a player's grace, a game that never ended) fall due here too, at no extra cost.
    try { await this.desk.tick(this.conns(this.peers()), now); } catch (e) { console.warn('[casino-room] chess deadlines failed', e); }
    if (this.peers().length) { try { await this.ctx.storage.setAlarm(now + this.sweepMs()); } catch { /* ignore */ } }
  }

  /** Every open connection with its peer record. Rebuilt from attachments, so it is correct after hibernation. */
  private peers(): Array<{ ws: WebSocket; peer: Peer }> {
    const list: Array<{ ws: WebSocket; peer: Peer }> = [];
    for (const ws of this.ctx.getWebSockets()) {
      const peer = ws.deserializeAttachment() as Peer | null;
      if (peer && typeof peer.id === 'string') list.push({ ws, peer: upgradePeer(peer) });
    }
    return list;
  }

  private save(entries: Array<{ ws: WebSocket; peer: Peer }>) {
    for (const { ws, peer } of entries) {
      try { ws.serializeAttachment(peer); } catch { /* a closing socket cannot take an attachment */ }
    }
  }

  private send(ws: WebSocket, message: unknown) {
    try { ws.send(JSON.stringify(message)); } catch { /* the socket is closing; its close handler cleans up */ }
  }

  /** To every connection that may see the room's people; `everyone` (the head count only) also reaches guests who may not watch. */
  private broadcast(entries: Array<{ ws: WebSocket; peer: Peer }>, message: unknown, everyone = false) {
    const text = JSON.stringify(message);
    for (const { ws, peer } of entries) {
      if (!everyone && !canSee(peer)) continue;
      try { ws.send(text); } catch { /* ignore */ }
    }
  }

  private counts(entries: Array<{ peer: Peer }>) {
    const view = deriveView(entries.map((e) => e.peer));
    return { joined: view.joined, guests: view.guests };
  }

  private announce(entries: Array<{ ws: WebSocket; peer: Peer }>, changes: Change[]) {
    for (const change of changes) {
      if (change.kind === 'moved') {
        const target = entries.find((e) => e.peer.id === change.peerId);
        if (target) this.send(target.ws, { t: 'moved', spot: change.spot });
      } else if (change.kind === 'sat') {
        this.broadcast(entries, { t: 'sat', spot: change.spot, who: change.who });
      } else {
        this.broadcast(entries, { t: 'stood', spot: change.spot });
      }
    }
  }

  /** The `room` message, plus the social layer: the win feed, everyone's bets on the current shared rounds, and Salon seekers. */
  private async welcome(peers: Peer[], me: Peer, now: number) {
    const base = roomMessage(peers, me, now, this.features()) as Record<string, unknown>;
    if (base.watch === false) return base;
    const wins = (await this.ctx.storage.get<WinEntry[]>(WINS_KEY)) || [];
    const bets: Record<string, unknown> = {};
    for (const tb of ROUND_TABLES) bets[tb] = currentBets(peers, tb, now);
    // Phase 3: everyone's level and tag badge, the jackpot, the tournament and happy hour; and for a signed-in player their own
    // profile, missions, balance, friends and any prize notices waiting for them (shown once).
    const levels: Record<string, { lv: number; bd: string | null }> = {};
    for (const p of peers) if (p.a && p.lv) levels[p.a] = { lv: p.lv, bd: p.bd ?? null };
    const jp = loadJackpot(await this.ctx.storage.get(JACKPOT_KEY));
    const who = me.k || me.a;
    const tour = await this.tourney(now);
    const extra: Record<string, unknown> = {
      levels, jackpot: { v: jp.v, last: jp.last }, tourney: tourneyView(tour, now, this.schedule(), who), hh: happyHour(now, this.schedule())
    };
    if (who && me.a) {
      const prof = await this.profile(who);
      extra.me = meView(prof, who, now);
      extra.bal = (await this.ctx.storage.get<Balance>(BALANCE_PREFIX + who)) || null;
      extra.friends = (await this.ctx.storage.get<string[]>(FRIENDS_PREFIX + who)) || [];
      if (prof.nt.length) { extra.notices = prof.nt; prof.nt = []; await this.ctx.storage.put(PROFILE_PREFIX + who, prof); }
    }
    return { ...base, wins, bets, seekers: seekers(peers), ...extra };
  }

  // ------------------------------------------------------------------ phase 3: coming back (functions/lib/casino-progress.ts)

  private sched: Schedule | null = null;
  /** Happy hour and the tournament (UTC). The Worker variable CASINO_SCHEDULE can shorten them for a test; normally unset. */
  private schedule() { return this.sched || (this.sched = parseSchedule(this.env.CASINO_SCHEDULE)); }
  private jackpotOdds() { const n = Number(this.env.CASINO_JACKPOT_ODDS); return Number.isFinite(n) && n >= 1 ? n : JACKPOT_ODDS; }
  private async profile(who: string) { return loadProfile(await this.ctx.storage.get(PROFILE_PREFIX + who)); }
  private happy(now: number) { return happyHour(now, this.schedule()).on; }

  /** The running tournament's record (made when the first player joins), or null. */
  private async tourney(now: number): Promise<Tourney | null> {
    const t = tourneyAt(now, this.schedule());
    if (!t.on) return null;
    return (await this.ctx.storage.get<Tourney>(TOURNEY_PREFIX + t.n)) || null;
  }

  private settledUpTo: number | null = null;
  /** Pays the last finished tournament if nobody has yet (the room has no timers, so this runs when someone next does something). */
  private async settleDue(entries: Array<{ ws: WebSocket; peer: Peer }>, now: number) {
    const last = lastFinishedTourney(now, this.schedule());
    if (this.settledUpTo === last.n) return;
    this.settledUpTo = last.n;
    const key = TOURNEY_PREFIX + last.n;
    const t = await this.ctx.storage.get<Tourney>(key);
    if (!t || t.done) return;
    const winners = settleTourney(t);
    await this.ctx.storage.put(key, t);
    for (const w of winners) {
      await this.credit(entries, w.who, w.a, w.prize, `tourney-${w.place}`, now);
      const prof = await this.profile(w.who);
      if (w.place === 1) prof.st.tw++;
      addXp(prof, XP.tourney * (4 - w.place), now, false, false);
      await this.afterChange(entries, w.who, w.a, prof, now);
    }
    this.broadcast(entries, { t: 'tourney-end', n: t.n, g: t.g, winners: winners.map(({ who: _w, ...rest }) => rest), at: now });
  }

  /** Every open connection of one player (by address). */
  private connectionsOf(entries: Array<{ ws: WebSocket; peer: Peer }>, address: string) { return entries.filter((e) => e.peer.a === address); }

  /**
   * Play LAYR from the room (a mission, a tournament prize, the jackpot): added to the balance the room keeps, and every open page of
   * that player told, so it adds it to its own balance. A player who is not here finds it, with a notice, on their next visit.
   */
  private async credit(entries: Array<{ ws: WebSocket; peer: Peer }>, who: string, address: string, amount: number, why: string, now: number) {
    const key = BALANCE_PREFIX + who;
    const bal = creditBalance((await this.ctx.storage.get<Balance>(key)) || null, amount);
    await this.ctx.storage.put(key, bal);
    const here = this.connectionsOf(entries, address);
    for (const e of here) this.send(e.ws, { t: 'bal', v: bal.v, rev: bal.rev, got: amount, why, at: now });
    if (!here.length) {
      const prof = await this.profile(who);
      prof.nt = [...prof.nt, { why, v: amount, at: now }].slice(-10);
      await this.ctx.storage.put(PROFILE_PREFIX + who, prof);
    }
  }

  /**
   * After a profile changed: new badges, a new level (both told to the room, and kept on the player's connections for their name
   * tag), the player's own view, and the weekly boards. Saves the profile.
   */
  private async afterChange(entries: Array<{ ws: WebSocket; peer: Peer }>, who: string, address: string, prof: Profile, now: number, big?: { x: number; w: number; g: string } | null) {
    const fresh = awardBadges(prof);
    const lv = levelOf(prof.xp), bd = topBadge(prof);
    await this.ctx.storage.put(PROFILE_PREFIX + who, prof);
    const mine = this.connectionsOf(entries, address);
    const levelUp = mine.some((e) => (e.peer.lv || 0) < lv && e.peer.lv !== undefined);
    const tagChanged = mine.some((e) => e.peer.lv !== lv || (e.peer.bd ?? null) !== bd);
    for (const e of mine) { e.peer.lv = lv; e.peer.bd = bd; }
    if (mine.length) this.save(mine);
    if (tagChanged) this.broadcast(entries, { t: 'lvl', a: address, lv, bd, up: levelUp });
    for (const id of fresh) this.broadcast(entries, { t: 'badge', a: address, id, at: now });
    const view = meView(prof, who, now);
    for (const e of mine) this.send(e.ws, view);
    // The weekly boards (one small record per week).
    const bkey = BOARDS_PREFIX + weekId(now), boards = loadBoards(await this.ctx.storage.get(bkey), weekId(now));
    const n = shortAddress(address);
    let changed = placeOnBoard(boards, 'xp', { a: address, n, v: prof.wk.xp });
    changed = placeOnBoard(boards, 'play', { a: address, n, v: prof.wk.h }) || changed;
    changed = placeOnBoard(boards, 'gift', { a: address, n, v: prof.wk.gv }) || changed;
    if (big && big.w > 0) changed = placeOnBoard(boards, 'big', { a: address, n, v: big.w, g: big.g, x: big.x }) || changed;
    if (changed) await this.ctx.storage.put(bkey, boards);
  }

  /** Missions just completed: their rewards (and the bonus for all three) are credited, and the player told. */
  private async payMissions(entries: Array<{ ws: WebSocket; peer: Peer }>, who: string, address: string, prof: Profile, r: { done: Array<{ id: string; text: string; reward: number }>; all: boolean }, now: number) {
    for (const m of r.done) {
      addXp(prof, XP.mission, now, this.happy(now), false);
      await this.credit(entries, who, address, m.reward, 'mission', now);
      for (const e of this.connectionsOf(entries, address)) this.send(e.ws, { t: 'mission-done', id: m.id, text: m.text, reward: m.reward, at: now });
    }
    if (r.all) {
      addXp(prof, XP.allMissions, now, this.happy(now), false);
      await this.credit(entries, who, address, ALL_MISSIONS_BONUS, 'missions-all', now);
    }
  }

  /** A social event that counts towards missions and stats (a drink, a reaction, a table-chat line, the daily drop). */
  private async socialEvent(entries: Array<{ ws: WebSocket; peer: Peer }>, me: Peer, kind: MissionKind | 'daily', now: number, n = 1, streak = 0) {
    const who = me.k || me.a, address = me.a;
    if (!who || !address) return;
    try {
      const prof = await this.profile(who);
      const happy = this.happy(now);
      if (kind === 'gift') { prof.st.gv += n; addXp(prof, XP.gift, now, happy, false); }
      if (kind === 'react') prof.st.rx += n;
      if (kind === 'daily') { prof.st.dk = Math.max(prof.st.dk, streak); addXp(prof, XP.daily, now, happy, false); }
      if (kind === 'gift') { const wk = prof.wk.id === weekId(now) ? prof.wk : (prof.wk = { id: weekId(now), h: 0, xp: 0, gv: 0 }); wk.gv += n; }
      if (kind !== 'daily') await this.payMissions(entries, who, address, prof, advanceMissions(prof, who, now, { kind }), now);
      await this.afterChange(entries, who, address, prof, now);
    } catch (e) { console.warn('[casino-room] progress failed', e); }
  }

  /** One hand or spin the player's page reports: profile, missions, the tournament, the jackpot and the boards. */
  private async playLog(entries: Array<{ ws: WebSocket; peer: Peer }>, mine: { ws: WebSocket; peer: Peer }, msg: LogMessage, now: number) {
    const who = mine.peer.k || mine.peer.a, address = mine.peer.a;
    if (!who || !address) { this.send(mine.ws, { t: 'err', code: 'log-sign-in-first' }); return; }
    const prof = await this.profile(who);
    const r = applyLog(prof, who, msg, now, this.happy(now));
    await this.payMissions(entries, who, address, prof, r, now);
    // The tournament: spins on its machine by players who joined.
    const tour = await this.tourney(now);
    if (tour && scoreTourney(tour, who, msg, now)) {
      await this.ctx.storage.put(TOURNEY_PREFIX + tour.n, tour);
      this.broadcast(entries, tourneyView(tour, now, this.schedule(), null));
      this.send(mine.ws, { ...tourneyView(tour, now, this.schedule(), who) });
    }
    // The jackpot: every paid spin feeds it, and has the same chance to win it.
    if (msg.k === 'spin' && !msg.free) {
      const jp = loadJackpot(await this.ctx.storage.get(JACKPOT_KEY));
      const roll = crypto.getRandomValues(new Uint32Array(1))[0] / 0x1_0000_0000;
      const fed = feedJackpot(jp, msg, roll, this.jackpotOdds());
      if (fed.hit) {
        resetJackpot(jp, { a: address, g: msg.g, w: fed.win }, now);
        await this.ctx.storage.put(JACKPOT_KEY, jp);
        prof.st.jp++;
        await this.credit(entries, who, address, fed.win, 'jackpot', now);
        this.broadcast(entries, { t: 'jackpot', a: address, n: shortAddress(address), w: fed.win, g: msg.g, at: now });
        this.broadcast(entries, { t: 'jp', v: jp.v });
      } else {
        await this.ctx.storage.put(JACKPOT_KEY, jp);
        if (jackpotStep(fed.before, jp.v)) this.broadcast(entries, { t: 'jp', v: jp.v });
      }
    }
    await this.afterChange(entries, who, address, prof, now, r.big ? { ...r.big, g: msg.g } : null);
  }

  private secret: Uint8Array | null = null;
  /** The round secret: 32 random bytes made once and kept, so rounds stay the same across wake-ups (and their seeds can be checked). */
  private async roundSecret() {
    if (this.secret) return this.secret;
    let stored = await this.ctx.storage.get<number[]>(SECRET_KEY);
    if (!Array.isArray(stored) || stored.length !== 32) {
      stored = [...crypto.getRandomValues(new Uint8Array(32))];
      await this.ctx.storage.put(SECRET_KEY, stored);
    }
    this.secret = Uint8Array.from(stored);
    return this.secret;
  }

  /** Adds to today's anonymous counters (one small record per UTC day; never an address or a message). */
  private async count(keys: Counter[], at = Date.now(), peakNow?: number) {
    if (!keys.length && peakNow === undefined) return;
    const key = counterKey(at);
    let counts = (await this.ctx.storage.get<DayCounts>(key)) || {};
    for (const k of keys) counts = bump(counts, k);
    if (peakNow !== undefined) counts = { ...counts, pk: Math.max(counts.pk || 0, peakNow) };
    await this.ctx.storage.put(key, counts);
  }

  /** A new connection: counted, and a signed-in player's first visit today is counted as returning or new (by key hash, not address). */
  private async counted(peer: Peer, connections: number) {
    try {
      const keys: Counter[] = ['v'];
      const who = peer.k || peer.a;
      if (who) {
        const seenKey = SEEN_PREFIX + who;
        const marked = markSeen(await this.ctx.storage.get<SeenRecord>(seenKey), Date.now());
        if (marked.store) await this.ctx.storage.put(seenKey, marked.store);
        keys.push(...marked.counts);
      }
      await this.count(keys, Date.now(), connections);
    } catch (e) { console.warn('[casino-room] counting failed', e); }
  }

  private deliver(entries: Array<{ ws: WebSocket; peer: Peer }>, outs: Out[]) {
    for (const out of outs) {
      const text = JSON.stringify(out.message);
      for (const e of entries) {
        if (!out.to.includes(e.peer.id)) continue;
        try { e.ws.send(text); } catch { /* closing; its close handler cleans up */ }
      }
    }
  }

  /** A new connection, already upgraded: its peer record, the welcome, and the news for everyone else. (Separate from fetch so the
   *  two-browser test, scripts/test-casino-together.mjs, can run the real room without a Workers runtime.) */
  private async accept(server: WebSocket, address: string | null, hash160: string | null, watch: boolean,
    bns: { name: string | null; checked: boolean } = { name: null, checked: false }) {
    const now = Date.now();
    const peer = newPeer(crypto.randomUUID(), address, hash160, now, watch, bns);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment(peer);
    void this.keepSweeping(now);

    // No address may hold more than two connections: the oldest extras are closed and their seats freed.
    const fresh = this.peers();   // includes the connection just accepted
    const dropped = overflowForAddress(fresh.map((e) => e.peer), address);
    for (const extra of dropped) {
      const target = fresh.find((e) => e.peer.id === extra.id);
      if (!target) continue;
      const changes = applyStand(fresh.map((e) => e.peer), extra.id);
      this.save([target]);
      this.announce(fresh, changes);
      try { target.ws.close(4001, 'replaced'); } catch { /* already closing */ }
    }

    const live = fresh.filter((e) => !dropped.some((d) => d.id === e.peer.id));
    // Phase 3: the player's level and tag badge travel with the connection (for everyone's name tags).
    const who = hash160 || address;
    if (who && address) {
      try {
        const prof = await this.profile(who);
        peer.lv = levelOf(prof.xp); peer.bd = topBadge(prof);
        server.serializeAttachment(peer);
        const self = live.find((e) => e.ws === server); if (self) self.peer = peer;
      } catch (e) { console.warn('[casino-room] could not read a profile', e); }
    }
    try { await this.settleDue(live, now); } catch (e) { console.warn('[casino-room] tournament settling failed', e); }
    const view = deriveView(live.map((e) => e.peer));
    this.send(server, await this.welcome(live.map((e) => e.peer), peer, now));
    // Chess: a player coming back is welcomed into their game (or told how it ended while they were away), and anything due is settled.
    try {
      const cs = this.conns(live), self = cs.find((c) => c.id === peer.id);
      if (self) await this.desk.onConnect(cs, self, now);
      await this.desk.tick(cs, now);
    } catch (e) { console.warn('[casino-room] chess welcome failed', e); }
    void this.counted(peer, live.length);
    const others = live.filter((e) => e.ws !== server);
    // A second tab of someone already here is not a new person.
    if (address && !others.some((e) => e.peer.a === address)) {
      this.broadcast(others, { t: 'join', who: { a: address, n: shortAddress(address) } });
      if (peer.lv) this.broadcast(others, { t: 'lvl', a: address, lv: peer.lv, bd: peer.bd ?? null, up: false });
    }
    this.broadcast(others, { t: 'count', joined: view.joined, guests: view.guests }, true);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Used once by the Pages Function that exchanges a signature for a session: a sign-in request can be used one time.
    if (url.pathname === '/nonce' && request.method === 'POST') {
      let body: { n?: unknown; exp?: unknown };
      try { body = (await request.json()) as { n?: unknown; exp?: unknown }; } catch { return new Response('bad', { status: 400 }); }
      const nonce = typeof body.n === 'string' && /^[a-f0-9]{64}$/.test(body.n) ? body.n : null;
      const exp = typeof body.exp === 'number' && Number.isSafeInteger(body.exp) ? body.exp : null;
      if (!nonce || !exp) return new Response('bad', { status: 400 });
      const key = NONCE_PREFIX + nonce;
      if (await this.ctx.storage.get(key)) return Response.json({ ok: false }, { status: 409 });
      await this.ctx.storage.put(key, exp);
      // Forget nonces that can no longer be replayed (a challenge lasts two minutes).
      const now = Date.now();
      const old = await this.ctx.storage.list<number>({ prefix: NONCE_PREFIX, limit: 200 });
      const stale = [...old.entries()].filter(([, v]) => typeof v !== 'number' || v < now).map(([k]) => k);
      if (stale.length) await this.ctx.storage.delete(stale);
      return Response.json({ ok: true });
    }

    // The anonymous day counters, newest first (the Pages Function /casino/room/stats passes this on; nothing personal is in it).
    if (url.pathname === '/stats' && request.method === 'GET') {
      const all = await this.ctx.storage.list<DayCounts>({ prefix: COUNTER_PREFIX, reverse: true, limit: 60 });
      const days = [...all.entries()].map(([k, v]) => ({ day: k.slice(COUNTER_PREFIX.length), ...v }));
      return Response.json({ days, now: Date.now() }, { headers: { 'cache-control': 'no-store' } });
    }

    if (url.pathname.endsWith('/ws')) {
      if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected a WebSocket.', { status: 426 });
      const entries = this.peers();
      if (entries.length >= MAX_SOCKETS) return new Response('The room is full.', { status: 503 });

      const address = request.headers.get('x-px-addr') || null;
      const hash160 = request.headers.get('x-px-k') || null;
      // Only the Pages Function sets this (it drops every x-px-* header a browser sends). Missing = guests may not watch.
      const watch = request.headers.get('x-px-watch') === '1';
      // The Salon's rule: the primary BNS name read at sign-in, and whether it was checked (set only by the Pages Function).
      const bns = { name: request.headers.get('x-px-bns') || null, checked: request.headers.get('x-px-bnsc') === '1' };
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      await this.accept(server, address, hash160, watch, bns);
      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response('Not found.', { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const t0 = Date.now();
    if (t0 - this.swept > 15_000) await this.sweep(t0, ws);       // who is here: anyone else gone quiet goes first
    const entries = this.peers();
    const mine = entries.find((e) => e.ws === ws);
    if (!mine) return;
    const now = Date.now();
    mine.peer.hd = now;                                            // heard from (saved with the rest of this message's changes)
    const parsed = parseClientMessage(message);
    // A spin has its own limit and never counts against the general one, so autoplay cannot slow a player's seat or chat.
    if (parsed.ok && parsed.msg.t === 'play') {
      if (!takePlayRate(mine.peer, now)) { this.save([mine]); this.send(ws, { t: 'err', code: 'play-too-fast' }); return; }
      this.save([mine]);
      const routed = routePlay(entries.map((e) => e.peer), mine.peer.id, parsed.msg, now);
      if (!routed.ok) { this.send(ws, { t: 'err', code: routed.code }); return; }
      const text = JSON.stringify(routed.message);
      for (const e of entries) {
        if (!routed.to.includes(e.peer.id)) continue;
        try { e.ws.send(text); } catch { /* closing; its close handler cleans up */ }
      }
      return;
    }
    // A move has its own limit too: walking never slows a player's seat updates or chat.
    if (parsed.ok && parsed.msg.t === 'move') {
      if (!takeMoveRate(mine.peer, now)) { this.save([mine]); this.send(ws, { t: 'err', code: 'move-too-fast' }); return; }
      const routed = applyMove(entries.map((e) => e.peer), mine.peer.id, parsed.msg, now);
      this.save([mine]);
      if (!routed.ok) { this.send(ws, { t: 'err', code: routed.code }); return; }
      const text = JSON.stringify(routed.message);
      for (const e of entries) {
        if (!routed.to.includes(e.peer.id)) continue;
        try { e.ws.send(text); } catch { /* closing; its close handler cleans up */ }
      }
      return;
    }
    // Phase 3: hands and spins (`log`) and balance changes (`bal`) have their own limits; a finished tournament is paid first.
    if (parsed.ok && (parsed.msg.t === 'log' || parsed.msg.t === 'bal')) {
      const msg = parsed.msg;
      const lim = msg.t === 'log' ? takeLimit(mine.peer.lg, now, 0, 150) : takeLimit(mine.peer.bl, now, 0, 90);
      if (msg.t === 'log') mine.peer.lg = lim.list; else mine.peer.bl = lim.list;
      this.save([mine]);
      if (!lim.ok) { this.send(ws, { t: 'err', code: msg.t + '-too-fast' }); return; }
      try { await this.settleDue(entries, now); } catch (e) { console.warn('[casino-room] tournament settling failed', e); }
      if (msg.t === 'log') { await this.playLog(entries, mine, msg, now); return; }
      const who = mine.peer.k || mine.peer.a, address = mine.peer.a;
      if (!who || !address) { this.send(ws, { t: 'err', code: 'bal-sign-in-first' }); return; }
      const key = BALANCE_PREFIX + who;
      const r = applyBalance((await this.ctx.storage.get<Balance>(key)) || null, msg);
      if (r.store) await this.ctx.storage.put(key, r.store);
      for (const e of this.connectionsOf(entries, address)) this.send(e.ws, { t: 'bal', v: r.bal.v, rev: r.bal.rev, mine: e.ws === ws, at: now });
      return;
    }
    // The social layer's own limits (reactions, wins, drinks, the Salon relay): never counted against the seat and chat limit.
    if (parsed.ok && (parsed.msg.t === 'react' || parsed.msg.t === 'win' || parsed.msg.t === 'gift' || parsed.msg.t === 'pvp')) {
      const peers = entries.map((e) => e.peer), msg = parsed.msg;
      if (msg.t === 'win') {
        const r = routeWin(peers, mine.peer, msg, now);
        this.save([mine]);
        if (!r.ok) { this.send(ws, { t: 'err', code: r.code }); return; }
        await this.ctx.storage.put(WINS_KEY, pushWin(await this.ctx.storage.get<WinEntry[]>(WINS_KEY), r.entry));
        this.deliver(entries, r.out); void this.count(['w']);
        return;
      }
      const r = msg.t === 'react' ? routeReact(peers, mine.peer, msg, now) : msg.t === 'gift' ? routeGift(peers, mine.peer, msg, now) : routeRelay(peers, mine.peer, msg, now);
      this.save([mine]);
      if (!r.ok) { this.send(ws, { t: 'err', code: r.code }); return; }
      this.deliver(entries, r.out);
      void this.count([msg.t === 'react' ? 'rx' : msg.t === 'gift' ? 'g' : 'pv']);
      if (msg.t === 'react') await this.socialEvent(entries, mine.peer, 'react', now);
      if (msg.t === 'gift') {
        const sent = r.out[0]?.message as { to?: string[] } | undefined;
        await this.socialEvent(entries, mine.peer, 'gift', now, Math.max(1, sent?.to?.length || 1));
      }
      return;
    }
    // Watching a chess game (docs/plans/CASINO-CHESS-PLAN.md, section 7): snapshots and asks have their own limits.
    if (parsed.ok && parsed.msg.t === 'spec') {
      const r = routeSpec(entries.map((e) => e.peer), mine.peer, parsed.msg, now);
      this.save([mine]);
      if (!r.ok) { this.send(ws, { t: 'err', code: r.code }); return; }
      this.deliver(entries, r.out);
      // The first snapshot of a new game opens it (holds the stakes, opens betting); the room never reads the rest of it.
      if ('d' in parsed.msg) {
        try { await this.desk.onSnapshot(this.conns(entries), parsed.msg.tb, parsed.msg.d, now); } catch (e) { console.warn('[casino-room] chess snapshot failed', e); }
      }
      return;
    }
    // Chess results and bets: their own limits, and never counted against the seat and chat limit.
    if (parsed.ok && (parsed.msg.t === 'cres' || parsed.msg.t === 'cbet')) {
      const cs = this.conns(entries), me = cs.find((c) => c.id === mine.peer.id);
      if (!me) return;
      try {
        await this.desk.tickTable(cs, parsed.msg.tb, now);
        if (parsed.msg.t === 'cres') await this.desk.onReport(cs, me, parsed.msg, now);
        else await this.desk.onBet(cs, me, parsed.msg, now);
      } catch (e) { console.warn('[casino-room] chess message failed', e); this.send(ws, { t: 'err', code: parsed.msg.t + '-failed' }); }
      this.save([mine]);
      return;
    }
    if (!takeRate(mine.peer, now)) {
      this.save([mine]);
      this.send(ws, { t: 'err', code: 'slow-down' });
      return;
    }
    if (!parsed.ok) { this.save([mine]); this.send(ws, { t: 'err', code: parsed.code }); return; }

    const peers = entries.map((e) => e.peer);
    switch (parsed.msg.t) {
      case 'ping':
        this.save([mine]);
        this.send(ws, { t: 'pong', at: now, up: this.up });
        return;
      case 'here':
        mine.peer.hb = true; this.save([mine]);
        return;
      case 'away': {
        const r = applyAway(peers, mine.peer.id, parsed.msg.on);
        this.save(entries);
        if (!r.ok) { this.send(ws, { t: 'err', code: r.code }); return; }
        this.announce(entries, r.changes);
        this.deliver(entries, [{ message: r.message, to: r.to }]);
        return;
      }
      case 'hello': {
        this.save([mine]);
        this.send(ws, await this.welcome(peers, mine.peer, now));
        return;
      }
      case 'sit': {
        const result = applySit(peers, mine.peer.id, parsed.msg.spot, now);
        this.save(entries);
        if (!result.ok) { this.send(ws, { t: 'err', code: result.code }); return; }
        this.announce(entries, result.changes);
        return;
      }
      case 'stand': {
        const changes = applyStand(peers, mine.peer.id);
        this.save(entries);
        this.announce(entries, changes);
        return;
      }
      case 'say':
      case 'dm':
      case 'report': {
        // Guests only watch. Chat is also slower than the room's general limit: one message every 2 s, 20 a minute.
        if (!mine.peer.a) { this.save([mine]); this.send(ws, { t: 'err', code: 'sign-in-first' }); return; }
        if (!takeChatRate(mine.peer, now)) { this.save([mine]); this.send(ws, { t: 'err', code: 'slow-down' }); return; }
        this.save([mine]);
        if (parsed.msg.t === 'report') {
          const built = buildReport(peers, mine.peer.id, parsed.msg.who, parsed.msg.why, parsed.msg.lines, now);
          if (!built.ok) { this.send(ws, { t: 'err', code: built.code }); return; }
          await this.keepReport(built.report);
          this.send(ws, { t: 'reported', who: parsed.msg.who });
          return;
        }
        if (parsed.msg.t === 'say' && parsed.msg.ch === 'table') {
          // Table chat: only the people at the speaker's table (sitting or watching) hear it.
          const audience = tableAudience(peers, mine.peer);
          if (!audience) { this.send(ws, { t: 'err', code: 'no-table' }); return; }
          this.deliver(entries, [{ to: audience.ids, message: { t: 'say', ch: 'table', tb: audience.table, from: { a: mine.peer.a, n: shortAddress(mine.peer.a) }, text: parsed.msg.text, at: now } }]);
          void this.count(['ch']);
          await this.socialEvent(entries, mine.peer, 'tchat', now);
          return;
        }
        const routed = parsed.msg.t === 'say'
          ? routeSay(peers, mine.peer.id, parsed.msg.text, now)
          : routeDm(peers, mine.peer.id, parsed.msg.to, parsed.msg.text, now);
        void this.count(['ch']);
        if (!routed.ok) { this.send(ws, { t: 'err', code: routed.code }); return; }
        const text = JSON.stringify(routed.message);
        for (const e of entries) {
          if (!routed.to.includes(e.peer.id)) continue;
          try { e.ws.send(text); } catch { /* closing; its close handler cleans up */ }
        }
        return;
      }
      case 'blocks': {
        const list = setBlocks(peers, mine.peer.id, parsed.msg.list);
        this.save(entries);
        this.send(ws, list ? { t: 'blocks', list } : { t: 'err', code: 'sign-in-first' });
        return;
      }
      case 'watch': {
        mine.peer.wt = parsed.msg.tb;
        this.save([mine]);
        return;
      }
      case 'round': {
        const info = await roundInfo(await this.roundSecret(), parsed.msg.tb, now);
        this.save([mine]);
        this.send(ws, { ...info, bets: currentBets(peers, parsed.msg.tb, now) });
        return;
      }
      case 'bet': {
        const r = applyBet(peers, mine.peer, parsed.msg, now);
        this.save([mine]);
        if (!r.ok) { this.send(ws, { t: 'err', code: r.code }); return; }
        this.deliver(entries, r.out); void this.count(['b']);
        return;
      }
      case 'seek': {
        const r = applySeek(peers, mine.peer, parsed.msg, now);
        // The stake of a chess game is checked against a seek the players made (casino-chess-room.ts), so the last one is remembered.
        if (r.ok && !('off' in parsed.msg)) mine.peer.ls = { tb: parsed.msg.tb, stake: parsed.msg.stake, at: now };
        this.save([mine]);
        if (!r.ok) { this.send(ws, { t: 'err', code: r.code }); return; }
        this.deliver(entries, r.out);
        return;
      }
      case 'daily': {
        this.save([mine]);
        const who = mine.peer.k || mine.peer.a;
        if (!who) { this.send(ws, { t: 'err', code: 'daily-sign-in-first' }); return; }
        const key = DAILY_PREFIX + who;
        const claim = claimDaily(await this.ctx.storage.get<DailyRecord>(key), now);
        // Happy hour doubles the daily drop (a reason to come at the same time as everyone else).
        const happy = this.happy(now) && claim.reply.got > 0;
        if (claim.store) { await this.ctx.storage.put(key, claim.store); void this.count(['dd']); }
        this.send(ws, happy ? { ...claim.reply, got: claim.reply.got * 2, hh: true } : claim.reply);
        if (claim.store) await this.socialEvent(entries, mine.peer, 'daily', now, 1, claim.reply.streak);
        return;
      }
      case 'board': {
        this.save([mine]);
        const id = weekId(now);
        const cur = loadBoards(await this.ctx.storage.get(BOARDS_PREFIX + id), id);
        const last = loadBoards(await this.ctx.storage.get(BOARDS_PREFIX + (id - 1)), id - 1);
        const top3 = (b: Boards) => ({ big: b.big.slice(0, 3), xp: b.xp.slice(0, 3), play: b.play.slice(0, 3), gift: b.gift.slice(0, 3) });
        this.send(ws, { t: 'board', wk: id, starts: weekStart(id), ends: weekStart(id + 1), cur, last: top3(last), at: now });
        return;
      }
      case 'friends': {
        this.save([mine]);
        const who = mine.peer.k || mine.peer.a;
        if (!who || !mine.peer.a) { this.send(ws, { t: 'err', code: 'friends-sign-in-first' }); return; }
        const list = parsed.msg.list.filter((a) => a !== mine.peer.a);
        await this.ctx.storage.put(FRIENDS_PREFIX + who, list);
        for (const e of this.connectionsOf(entries, mine.peer.a)) this.send(e.ws, { t: 'friends', list });
        return;
      }
      case 'tjoin': {
        this.save([mine]);
        const who = mine.peer.k || mine.peer.a, address = mine.peer.a;
        if (!who || !address) { this.send(ws, { t: 'err', code: 'tourney-sign-in-first' }); return; }
        const cur = tourneyAt(now, this.schedule());
        if (!cur.on) { this.send(ws, { t: 'err', code: 'tourney-not-on' }); return; }
        const key = TOURNEY_PREFIX + cur.n;
        const t = (await this.ctx.storage.get<Tourney>(key)) || newTourney(cur);
        if (joinTourney(t, who, address)) {
          await this.ctx.storage.put(key, t);
          const prof = await this.profile(who);
          prof.st.tp++; addXp(prof, XP.tourney, now, this.happy(now), false);
          await this.afterChange(entries, who, address, prof, now);
        }
        this.broadcast(entries, tourneyView(t, now, this.schedule(), null));
        this.send(ws, tourneyView(t, now, this.schedule(), who));
        return;
      }
      case 'card': {
        this.save([mine]);
        const wanted = parsed.msg.a;
        const target = peers.find((p) => p.a === wanted);
        if (!target || !target.a) { this.send(ws, { t: 'err', code: 'card-not-here' }); return; }
        this.send(ws, cardView(await this.profile(target.k || target.a), target.a));
        return;
      }
      case 'mission': {
        this.save([mine]);
        const who = mine.peer.k || mine.peer.a;
        if (!who) { this.send(ws, { t: 'err', code: 'mission-sign-in-first' }); return; }
        // Also what is on now (the page asks when a tournament or happy hour begins or ends), after paying a finished tournament.
        try { await this.settleDue(entries, now); } catch (e) { console.warn('[casino-room] tournament settling failed', e); }
        this.send(ws, meView(await this.profile(who), who, now));
        this.send(ws, tourneyView(await this.tourney(now), now, this.schedule(), who));
        this.send(ws, { t: 'hh', ...happyHour(now, this.schedule()), at: now });
        return;
      }
    }
  }

  /** Stores a report and writes it to the Worker's log (`wrangler tail xtrata-casino-room`). There is no admin page yet. */
  private async keepReport(report: { at: number; by: string; who: string; why: string; lines: string[] }) {
    const key = REPORT_PREFIX + String(report.at).padStart(15, '0') + ':' + crypto.randomUUID().slice(0, 8);
    await this.ctx.storage.put(key, report);
    console.log('[casino-room] report', JSON.stringify(report));
    const all = await this.ctx.storage.list({ prefix: REPORT_PREFIX });
    const extra = [...all.keys()].slice(0, Math.max(0, all.size - REPORT_KEEP));
    if (extra.length) await this.ctx.storage.delete(extra);
  }

  private async gone(ws: WebSocket, known?: Peer) {
    const entries = this.peers().filter((e) => e.ws !== ws);
    let peer: Peer | null = known || null;
    if (!peer) try { peer = ws.deserializeAttachment() as Peer | null; } catch { /* nothing to free */ }
    if (peer) {
      const changes = applyLeave([peer], peer.id);
      this.announce(entries, changes);
      const off = leaveFloor(entries.map((e) => upgradePeer(e.peer)), upgradePeer(peer), Date.now());
      if (off) this.broadcast(entries, off);
      if (peer.a && !entries.some((e) => e.peer.a === peer!.a)) {
        if (peer.sk) this.broadcast(entries, { t: 'seek', a: peer.a, off: true, at: Date.now() });
        this.broadcast(entries, { t: 'leave', a: peer.a });
      }
      // Chess: a player in a game who has no connection left starts the 90-second grace (the opponent and the table are told).
      try { await this.desk.onGone(this.conns(entries), peer, Date.now()); } catch (e) { console.warn('[casino-room] chess leaving failed', e); }
    }
    this.broadcast(entries, { t: 'count', ...this.counts(entries) }, true);
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string) {
    try { ws.close(code, reason); } catch { /* already closed */ }
    await this.gone(ws);
  }

  async webSocketError(ws: WebSocket) {
    await this.gone(ws);
  }
}

export default {
  // No route reaches this Worker (workers_dev is off); this answer only matters if someone adds one by mistake.
  async fetch() { return new Response('Casino room service. No public route.', { status: 404 }); }
};
