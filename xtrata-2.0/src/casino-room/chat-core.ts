/**
 * The parts of the casino chat that need no page: the line buffer, which lines are still on screen, the block list's rules,
 * what to attach to a report, the friendly wording for the room's refusals. Kept free of the DOM so it can be tested on its own.
 * The page side is chat.ts. The room's own rules (280 characters, no links, one message every two seconds, signed-in only,
 * two-way blocking) are enforced by the room itself; nothing here is the only line of defence.
 */

export const MAX_LINES = 200;          // what this browser remembers (a report can attach a few of these)
export const MAX_BLOCKS = 40;          // the room refuses a longer list
export const SEND_GAP_MS = 2000;       // the room's own limit is one message every two seconds
export const MAX_CHARS = 280;
export const PINNED_MAX_AGE_MS = 5 * 60_000;   // while typing, lines stay up, but not for ever: an hour-old line is not "what was just said"
export const BLOCKS_KEY = 'px_room_blocks_v1';     // the same key the test page uses, so a block made there holds here
export const UI_KEY = 'px_chat_ui_v1';

export type Who = { a: string; n?: string };
/**
 * `who` is null for a note from the page itself ("Report sent."). `to` is set on a direct message: the person it was sent to.
 * A direct message is between two people, but it is not secret: it passes through the room service like everything else.
 */
export type Line = { id: number; who: Who | null; mine: boolean; text: string; at: number; to?: Who };
export const DM_HOLD_MS = 30_000;      // a direct message stays up longer than room chat: it was meant for you
export type Side = 'left' | 'right';
export type UiPrefs = { hidden: boolean; side: Side };
export const DEFAULT_PREFS: UiPrefs = { hidden: false, side: 'left' };

export const REPORT_REASONS = [
  { code: 'spam', label: 'Spam' },
  { code: 'abuse', label: 'Abuse' },
  { code: 'scam', label: 'Scam' },
  { code: 'other', label: 'Something else' }
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number]['code'];

/** Stacks addresses are upper-case letters and digits; anything else in a stored list is dropped, and the list is capped and de-duplicated. */
export const sanitizeBlocks = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const v of value) {
    if (typeof v !== 'string' || !/^S[A-Z0-9]{19,60}$/.test(v) || out.includes(v)) continue;
    out.push(v);
    if (out.length >= MAX_BLOCKS) break;
  }
  return out;
};

export const parseBlocks = (raw: string | null): string[] => {
  if (!raw) return [];
  try { return sanitizeBlocks(JSON.parse(raw)); } catch { return []; }
};

export const parsePrefs = (raw: string | null): UiPrefs => {
  if (!raw) return { ...DEFAULT_PREFS };
  try {
    const v = JSON.parse(raw);
    return { hidden: v?.hidden === true, side: v?.side === 'right' ? 'right' : 'left' };
  } catch { return { ...DEFAULT_PREFS }; }
};

/** What the room says when it refuses something, in words for the player. Unknown codes get a calm generic line. */
export const ERROR_TEXT: Record<string, string> = {
  'no-links': 'Links are not allowed in messages.',
  'too-long': `That message is too long (${MAX_CHARS} characters at most).`,
  'empty': 'Type something first.',
  'bad-message': 'That message could not be sent.',
  'slow-down': 'Slow down a little: one message every two seconds.',
  'sign-in-first': 'Join the room first to chat.',
  'blocked': 'You have blocked this person.',
  'not-you': 'You cannot do that to yourself.',
  'not-here': 'That person has left the room.',
  'no-such-player': 'That person is not in the room.',
  'gone': 'That person has left the room.',
  'too-many-blocks': 'Your block list is full (40 people).',
  'rate-limited': 'You are sending too much. Wait a moment.'
};
/** Refusals that belong to chat (the room also sends others, such as a seat being taken, which are not chat's business). */
export const isChatError = (code: unknown): boolean => typeof code === 'string' && Object.prototype.hasOwnProperty.call(ERROR_TEXT, code);
export const errorText = (code: unknown): string => ERROR_TEXT[String(code)] ?? 'The room could not take that. Try again in a moment.';

/** Collapse whitespace the way the room does, so what the player sees is what will be sent. */
export const tidy = (text: string): string => text.replace(/\s+/g, ' ').trim();
export const lengthOf = (text: string): number => Array.from(text).length;

/** The checks the page makes before it bothers the room. The room repeats all of them, and alone decides what counts as a link (the page does not guess). */
export type SendCheck = { ok: true; text: string } | { ok: false; code: string };
export const checkSend = (raw: string, o: { signed: boolean; connected: boolean; now: number; lastSentAt: number }): SendCheck => {
  const text = tidy(raw);
  if (!o.signed) return { ok: false, code: 'sign-in-first' };
  if (!o.connected) return { ok: false, code: 'offline' };
  if (!text) return { ok: false, code: 'empty' };
  if (lengthOf(text) > MAX_CHARS) return { ok: false, code: 'too-long' };
  if (o.now - o.lastSentAt < SEND_GAP_MS) return { ok: false, code: 'slow-down' };
  return { ok: true, text };
};

export class ChatLog {
  private lines: Line[] = [];
  private seq = 0;
  blocked = new Set<string>();

  setBlocked(list: string[]) { this.blocked = new Set(list); }

  add(who: Who | null, text: string, mine: boolean, at: number, to?: Who): Line | null {
    if (who && !mine && this.blocked.has(who.a)) return null;       // the room already keeps these from us; this covers a block made a moment ago
    const line: Line = { id: (this.seq += 1), who, mine, text, at };
    if (to) line.to = to;
    this.lines.push(line);
    if (this.lines.length > MAX_LINES) this.lines.splice(0, this.lines.length - MAX_LINES);
    return line;
  }

  /** Blocking someone takes what they already said off the screen too, and the direct messages you sent them. */
  dropFrom(address: string) { this.lines = this.lines.filter((l) => l.who?.a !== address && l.to?.a !== address); }

  /** The last few things somebody said, as this browser received them: what a report can attach (short, so a report stays small). */
  lastFrom(address: string, count = 5, chars = 120): string[] {
    return this.lines.filter((l) => l.who?.a === address).slice(-count).map((l) => l.text.slice(0, chars));
  }

  /**
   * Which lines to show. A line stays fully visible for `holdMs`, fades over `fadeMs`, and is gone after that. While the player is typing
   * (or has a menu open) the last `max` lines stay for up to five minutes. At most `max` lines are ever shown.
   */
  visible(now: number, o: { max: number; holdMs: number; fadeMs: number; pinned: boolean }): Array<{ line: Line; opacity: number }> {
    const out: Array<{ line: Line; opacity: number }> = [];
    for (const line of this.lines.slice(-o.max)) {
      const age = now - line.at;
      if (o.pinned && age <= PINNED_MAX_AGE_MS) { out.push({ line, opacity: 1 }); continue; }
      const hold = line.to ? Math.max(o.holdMs, DM_HOLD_MS) : o.holdMs;
      if (age <= hold) { out.push({ line, opacity: 1 }); continue; }
      const left = 1 - (age - hold) / o.fadeMs;
      if (left > 0) out.push({ line, opacity: Math.round(left * 100) / 100 });
    }
    return out;
  }

  get size() { return this.lines.length; }
  clear() { this.lines = []; }
}

/**
 * Who is signed in to the room right now, kept from the room's own messages: the full list arrives with every connect, then
 * `join` and `leave` keep it current. `known` stays false until the room has said who is here: a room we have not heard from
 * is not an empty room.
 */
export class Roster {
  private people = new Map<string, Who>();
  known = false;

  set(list: unknown) {
    this.people.clear();
    if (Array.isArray(list)) for (const p of list) if (p && typeof p.a === 'string') this.people.set(p.a, { a: p.a, n: typeof p.n === 'string' ? p.n : undefined });
    this.known = true;
  }
  join(who: unknown) {
    const w = who as Who | null;
    if (w && typeof w.a === 'string') this.people.set(w.a, { a: w.a, n: w.n });
  }
  leave(address: unknown) { if (typeof address === 'string') this.people.delete(address); }
  has(address: string) { return this.people.has(address); }
  forget() { this.people.clear(); this.known = false; }
  /** Everybody but you, in the order they arrived. */
  others(me: string | null): Who[] { return [...this.people.values()].filter((p) => p.a !== me); }
}
