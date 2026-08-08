// The sounds, as numbers, and the rule that decides which one to play.
//
// THERE ARE NO AUDIO FILES HERE, and there cannot be. Every byte of this
// application is inscribed permanently; one short WAV, base64ed into the page,
// costs twenty to fifty kilobytes, and the whole board is a hundred. A library
// of a dozen recorded sounds would be several times the size of the chess
// engine, the replay, the wallet handling and the entire interface combined.
//
// So each sound is a handful of oscillators with an envelope on them, described
// by the table below and built at play time. That is not a compromise forced by
// the size: it is what makes the set PROGRAMMABLE. Retuning every sound in the
// application means editing numbers in one table, and the panel that adjusts
// them is generated from the same table, so the two cannot drift apart. It is
// the same decision as SCALE in pieces.ts, for the same reason.
//
// Nothing in this file touches the DOM or an AudioContext. It is a table and a
// pure function, both of which can be tested without a browser making a noise.

import { KING } from '../chess/board.js';
import { checkSender } from '../protocol/rules.js';
import { sideOf } from '../replay/events.js';
import type { AcceptedRecord, ReplayState } from '../replay/replay.js';

export type SoundEvent =
  | 'your-turn'
  | 'move'
  | 'capture'
  | 'castle'
  | 'promote'
  | 'check'
  | 'win'
  | 'lose'
  | 'draw'
  | 'sent'
  | 'skipped'
  | 'select'
  | 'refused';

/**
 * One voice in a sound.
 *
 * A tone that glides from `from` to `to` over its own lifetime, under an
 * attack-and-decay envelope. `noise` is the same shape with a band-pass filter
 * instead of an oscillator, which is what makes a wooden click sound like wood
 * rather than like a beep.
 *
 * Layers are stacked with a delay, so a two-note chime and a click with a
 * transient on the front are the same construction with different numbers.
 */
export interface Layer {
  wave: 'sine' | 'triangle' | 'square' | 'sawtooth' | 'noise';
  /** Hz at the start. */
  from: number;
  /** Hz at the end. Equal to `from` for a steady tone. */
  to: number;
  /** Seconds to reach full level. Near zero for anything percussive. */
  attack: number;
  /** Seconds to fall back to silence. */
  decay: number;
  /** This layer's share of the sound, 0 to 1. */
  level: number;
  /** Seconds after the sound begins. */
  delay: number;
}

export interface Voice {
  /** What the panel calls it. */
  label: string;
  /** What it means, in the panel, because an unlabelled beep teaches nobody. */
  say: string;
  /** Its own loudness against the others, so the table is balanced here. */
  gain: number;
  /** Whether it is on for somebody who has never opened the panel. */
  on: boolean;
  layers: Layer[];
}

/**
 * A layer, with the boring parts defaulted.
 *
 * Written out in full, the table below would be four hundred lines of `attack:
 * 0.001` and would hide the four numbers per sound that actually matter.
 */
const tone = (
  wave: Layer['wave'],
  from: number,
  to: number,
  decay: number,
  level = 1,
  delay = 0,
  attack = 0.004
): Layer => ({ wave, from, to, attack, decay, level, delay });

/**
 * The library.
 *
 * Ordered as the panel lists them: the one this whole module exists for first,
 * then the run of play, then the endings, then the small local ticks that are
 * off until somebody asks for them.
 *
 * The pitches are chosen rather than arbitrary. Everything that reports the
 * chain uses clean intervals and lands on a rising shape; everything that
 * reports a problem falls. A player should be able to tell good news from bad
 * from another room without having learned which sound is which.
 */
export const VOICES: Record<SoundEvent, Voice> = {
  // A rising perfect fifth, twice as long as anything else and the only sound
  // with a tail on it. It has to carry from another tab, through whatever else
  // is making noise, to somebody who is not looking at the screen.
  'your-turn': {
    label: 'Your turn',
    say: 'the opponent move confirmed on chain, and it is now your move',
    gain: 0.85,
    on: true,
    layers: [
      tone('sine', 587.33, 587.33, 0.22, 0.9, 0, 0.01),
      tone('sine', 880, 880, 0.5, 1, 0.16, 0.01),
      tone('triangle', 293.66, 293.66, 0.45, 0.28, 0.16, 0.02)
    ]
  },

  // A piece set down on a board. Short, dry, low, and quiet enough to hear a
  // hundred times without noticing it.
  move: {
    label: 'Move',
    say: 'a move was accepted by replay',
    gain: 0.5,
    on: true,
    layers: [
      tone('noise', 1800, 600, 0.03, 0.5, 0, 0.001),
      tone('triangle', 190, 120, 0.07, 1, 0, 0.001)
    ]
  },

  // The same gesture with more behind it: lower, longer, and with the noise
  // transient turned up, which is what a piece knocking another one off a
  // square actually sounds like.
  capture: {
    label: 'Capture',
    say: 'a move that took a piece',
    gain: 0.65,
    on: true,
    layers: [
      tone('noise', 2600, 400, 0.07, 0.8, 0, 0.001),
      tone('triangle', 150, 62, 0.16, 1, 0, 0.001),
      tone('square', 96, 60, 0.1, 0.3, 0.01, 0.002)
    ]
  },

  // Two pieces, so two clicks. The gap is the whole sound; a single click here
  // would be indistinguishable from a move.
  castle: {
    label: 'Castle',
    say: 'castling, on either side',
    gain: 0.55,
    on: true,
    layers: [
      tone('noise', 1800, 600, 0.03, 0.45, 0, 0.001),
      tone('triangle', 200, 130, 0.06, 1, 0, 0.001),
      tone('noise', 1800, 600, 0.03, 0.45, 0.085, 0.001),
      tone('triangle', 240, 150, 0.07, 1, 0.085, 0.001)
    ]
  },

  // A pawn becoming something else, so the sound climbs out of the range every
  // other move sound sits in.
  promote: {
    label: 'Promotion',
    say: 'a pawn reached the far rank and became a piece',
    gain: 0.7,
    on: true,
    layers: [
      tone('sine', 659.25, 659.25, 0.12, 0.7, 0, 0.005),
      tone('sine', 987.77, 987.77, 0.12, 0.8, 0.07, 0.005),
      tone('sine', 1318.51, 1318.51, 0.34, 1, 0.14, 0.005)
    ]
  },

  // Two tones a semitone apart, held. They beat against each other, which is
  // unpleasant on purpose: this is the one sound in the set that is meant to
  // interrupt somebody.
  check: {
    label: 'Check',
    say: 'the king of the side to move is in check',
    gain: 0.7,
    on: true,
    layers: [
      tone('sine', 740, 740, 0.3, 1, 0, 0.008),
      tone('sine', 784, 784, 0.3, 0.75, 0, 0.008),
      tone('triangle', 370, 370, 0.26, 0.3, 0, 0.01)
    ]
  },

  // A major triad, arriving.
  win: {
    label: 'Win',
    say: 'the game ended in your favour',
    gain: 0.9,
    on: true,
    layers: [
      tone('sine', 523.25, 523.25, 0.16, 0.8, 0, 0.006),
      tone('sine', 659.25, 659.25, 0.16, 0.85, 0.11, 0.006),
      tone('sine', 783.99, 783.99, 0.7, 1, 0.22, 0.006),
      tone('triangle', 261.63, 261.63, 0.7, 0.35, 0.22, 0.02)
    ]
  },

  // The same three notes, descending, on a softer wave. Losing does not need a
  // fanfare and it does not need a raspberry either.
  lose: {
    label: 'Loss',
    say: 'the game ended against you',
    gain: 0.75,
    on: true,
    layers: [
      tone('triangle', 392, 392, 0.18, 0.8, 0, 0.01),
      tone('triangle', 329.63, 329.63, 0.18, 0.85, 0.13, 0.01),
      tone('triangle', 261.63, 261.63, 0.6, 1, 0.26, 0.012)
    ]
  },

  // Level, because a draw is level. Two of the same note, one slightly detuned,
  // so it neither rises nor falls.
  draw: {
    label: 'Draw',
    say: 'the game ended level',
    gain: 0.7,
    on: true,
    layers: [
      tone('sine', 440, 440, 0.22, 1, 0, 0.01),
      tone('sine', 442.5, 442.5, 0.55, 0.7, 0.14, 0.01)
    ]
  },

  // Your own submission leaving. Quiet and upward: it says gone, not landed.
  sent: {
    label: 'Move sent',
    say: 'your submission was broadcast, and is not in a block yet',
    gain: 0.4,
    on: true,
    layers: [
      tone('noise', 400, 2400, 0.14, 0.6, 0, 0.03),
      tone('sine', 330, 660, 0.12, 0.5, 0, 0.02)
    ]
  },

  // A submission that is on chain, was charged for, and counts for nothing.
  // The only buzz in the set, and the only sawtooth.
  skipped: {
    label: 'Submission skipped',
    say: 'something you sent was stored and charged for, but replay refused it',
    gain: 0.6,
    on: true,
    layers: [
      tone('sawtooth', 240, 104, 0.28, 1, 0, 0.006),
      tone('sawtooth', 121, 52, 0.28, 0.4, 0.01, 0.006)
    ]
  },

  // The two local ones. Nothing on chain has happened when either of these
  // plays, and picking a piece up happens far more often than anything else in
  // the set - so it is off until somebody asks for it.
  select: {
    label: 'Piece picked up',
    say: 'you selected a piece (local, nothing on chain)',
    gain: 0.3,
    on: false,
    layers: [tone('sine', 1244.51, 1244.51, 0.035, 1, 0, 0.001)]
  },

  // The board declining to open a wallet for something it is sure replay would
  // skip. A dull thud rather than an alarm: nothing went wrong and nothing was
  // charged for, which is the entire point of the refusal.
  refused: {
    label: 'Refused',
    say: 'the board would not send something it is certain replay would skip',
    gain: 0.4,
    on: true,
    layers: [tone('triangle', 118, 92, 0.09, 1, 0, 0.002)]
  }
};

/** The panel's order, and the order tests iterate. */
export const SOUND_EVENTS = Object.keys(VOICES) as SoundEvent[];

/**
 * How long a sound lasts, in seconds.
 *
 * The last layer to finish decides, not the first. Used to stop the oscillators
 * and, in the tests, to hold every sound to something shorter than a move.
 */
export function voiceLength(voice: Voice): number {
  return voice.layers.reduce(
    (longest, layer) => Math.max(longest, layer.delay + layer.attack + layer.decay),
    0
  );
}

// ---------------------------------------------------------------------------
// Choosing one
// ---------------------------------------------------------------------------

/**
 * The order sounds beat each other in.
 *
 * ONE STATE CHANGE PLAYS AT MOST ONE SOUND. This is the rule the whole
 * classifier exists to enforce, and it is not fussiness. A single poll can
 * return three new submissions at once, and a single move can be a capture, a
 * promotion, a check and a checkmate simultaneously. Played faithfully that is
 * four overlapping noises for one event, which communicates less than one.
 *
 * `check` sits above `your-turn` on purpose. Being in check is strictly more
 * information: only the side to move can be in check, so the check sound
 * already tells you it is your turn AND tells you the thing you most need to
 * know about the position. Announcing your turn instead would be throwing that
 * away to say something you would have worked out anyway.
 */
const ORDER: readonly SoundEvent[] = [
  'win',
  'lose',
  'draw',
  'skipped',
  'check',
  'promote',
  'your-turn',
  'capture',
  'castle',
  'move'
];

const FILES = 'abcdefgh';

/** True when an accepted move is a castling move. */
export function isCastle(record: AcceptedRecord): boolean {
  if (record.kind !== 'move' || record.piece !== KING) return false;
  const from = FILES.indexOf(record.uci[0]);
  const to = FILES.indexOf(record.uci[2]);
  return from >= 0 && to >= 0 && Math.abs(from - to) === 2;
}

const same = (a: string | null, b: string | null): boolean =>
  Boolean(a) && Boolean(b) && String(a).toUpperCase() === String(b).toUpperCase();

/**
 * Is this account a party to this game, rather than somebody watching it?
 *
 * Asked because of open boards. On a game where both sides are `anyone`,
 * `checkSender` says yes to everybody, so without this every spectator would be
 * told it was their turn every time anybody moved. Being named in the rules, or
 * having already submitted something, is the difference between a player and an
 * audience.
 */
export function involved(state: ReplayState, me: string | null): boolean {
  if (!me) return false;
  const up = me.toUpperCase();
  if (state.rules.white === up || state.rules.black === up) return true;
  if (state.rules.allow.includes(up)) return true;
  return state.accepted.some((record) => same(record.sender, me));
}

/**
 * May this account move in the position reached?
 *
 * Asks the referee rather than reimplementing it. Turn order, `anyone-else`,
 * the allow list, cooldown and the no-consecutive rule all decide whether it is
 * really your turn, and a second implementation of any of them here is how the
 * board and the replay end up disagreeing.
 */
export function mayMoveNow(state: ReplayState, me: string | null): boolean {
  if (!me || state.status !== 'live') return false;
  return (
    checkSender(state.rules, {
      sender: me,
      turn: state.turn,
      history: state.accepted
        .filter((record) => record.kind === 'move')
        .map((record) => ({ sender: record.sender }))
    }) === null
  );
}

/**
 * Which sound a change of state deserves, if any.
 *
 * `before` is the state this board was showing and `after` is the state it has
 * just replayed. Both come from the same deterministic replay, so this compares
 * two positions rather than trying to interpret a chain event - which is what
 * makes it testable, and what makes it agree with the board by construction.
 *
 * Returns null when nothing happened worth a noise, WHICH INCLUDES THE FIRST
 * DRAW OF A GAME. Loading a forty move game replays forty moves; announcing
 * them would be forty sounds for the act of opening a page. The caller passes
 * `before` as null to mean exactly that, and gets silence.
 */
export function soundFor(
  before: ReplayState | null,
  after: ReplayState,
  me: string | null
): SoundEvent | null {
  if (!before) return null;

  // A shorter log than last time is a host a block behind, not a rewind. The
  // poll that feeds this refuses to shorten for the same reason; this is the
  // second lock on the same door, because a sound fired on a phantom rewind
  // would be announcing a move that never un-happened.
  const fresh = after.accepted.slice(before.accepted.length);
  const skipped = after.rejected.slice(before.rejected.length);
  if (after.accepted.length < before.accepted.length) return null;

  const candidates = new Set<SoundEvent>();

  // An ending, first, and only at the moment it happens - not on every poll of
  // a game that is already over.
  if (before.status === 'live' && after.status === 'over') {
    const mine = sideOf(after.rules, me);
    if (after.result === '1/2-1/2' || !after.result) {
      candidates.add('draw');
    } else if (mine) {
      candidates.add(after.result === (mine === 'white' ? '1-0' : '0-1') ? 'win' : 'lose');
    }
    // A spectator neither won nor lost, and saying otherwise would be inventing
    // a stake they do not have. They still hear the move that ended it, below.
  }

  // Something of yours was stored, charged for, and refused. Worth its own
  // sound precisely because nothing else on the page makes a noise about it.
  if (skipped.some((record) => same(record.sender, me))) candidates.add('skipped');

  if (fresh.length) {
    // Check is read from the POSITION, not from a plus sign in the notation.
    // Only the side to move can be in check, which is what makes this sound
    // mean "your king" when it is your turn and "you gave check" when it is
    // not, without either reading being a guess about who is watching.
    //
    // Not restricted to a live game, because a checkmate is a check. Both
    // players outrank it with their own result; a spectator, who has no result,
    // hears the mate rather than the plain move that happened to deliver it.
    if (after.inCheck) candidates.add('check');

    const last = fresh[fresh.length - 1];
    if (
      involved(after, me) &&
      mayMoveNow(after, me) &&
      !same(last.sender, me)
    ) {
      candidates.add('your-turn');
    }

    // The batch, not just the last record. Two submissions can land in one
    // poll, and a capture in the first of them still happened.
    for (const record of fresh) {
      if (record.kind !== 'move') continue;
      if (record.promotion) candidates.add('promote');
      if (record.captured) candidates.add('capture');
      if (isCastle(record)) candidates.add('castle');
      candidates.add('move');
    }
  }

  for (const event of ORDER) {
    if (candidates.has(event)) return event;
  }
  return null;
}
