// A library of sounds, a list of events, and the wire between them.
//
// THERE ARE NO AUDIO FILES HERE, and there cannot be. Every byte of this
// application is inscribed permanently; one short WAV, base64ed into the page,
// costs twenty to fifty kilobytes, and the whole board is a hundred. A library
// of two dozen recorded sounds would be several times the size of the chess
// engine, the replay, the wallet handling and the entire interface combined.
//
// So each sound is a handful of oscillators with an envelope on them, described
// by a table of numbers and built at play time. That is not a compromise forced
// by the size: it is what makes the set PROGRAMMABLE, and it is why the library
// can be twice the length of the event list at almost no cost.
//
// THE TWO TABLES ARE SEPARATE ON PURPOSE. VOICES is what a sound IS - pitches,
// envelopes, timbre - and knows nothing about chess. EVENTS is what can HAPPEN
// on a board, and each one merely names the voice it starts out using. Nothing
// in a voice mentions an event and nothing in an event describes a sound, so a
// player reassigning them is not overriding a design decision, it is using a
// join that was always meant to be moved. The panel that does it is generated
// from both tables, so it cannot fall behind either.
//
// Nothing in this file touches the DOM or an AudioContext. Two tables and some
// pure functions, all of which can be tested without a browser making a noise.

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
  | 'decided'
  | 'draw-offered'
  | 'sent'
  | 'skipped'
  | 'select'
  | 'refused';

export type VoiceId =
  | 'chime-up'
  | 'chime-down'
  | 'bell'
  | 'triad-up'
  | 'triad-down'
  | 'level-pair'
  | 'arpeggio'
  | 'knock'
  | 'double-knock'
  | 'thump'
  | 'deep-thump'
  | 'thud'
  | 'tick'
  | 'blip'
  | 'blip-up'
  | 'blip-down'
  | 'ping'
  | 'alarm'
  | 'buzz-down'
  | 'rasp'
  | 'clunk'
  | 'swoosh-up'
  | 'swoosh-down';

/**
 * How the library is grouped in the picker.
 *
 * Two dozen names in one flat list is a list nobody reads to the end. Grouped
 * by what they sound LIKE rather than by what they might be for, because what
 * they are for is exactly the thing being handed over to the player.
 */
export const FAMILIES = ['Chimes', 'Wood', 'Digital', 'Rough', 'Air'] as const;
export type Family = (typeof FAMILIES)[number];

/**
 * One layer in a voice.
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

/** One entry in the library: a sound, and nothing about when to play it. */
export interface Voice {
  /** What the picker calls it. */
  label: string;
  family: Family;
  /**
   * Its own loudness against the rest of the library.
   *
   * Level belongs to the SOUND rather than to the event, so a voice is as loud
   * wherever it is assigned. A quiet voice on a loud event is then a real
   * choice somebody made, and the slider beside it is how they undo it.
   */
  gain: number;
  layers: Layer[];
}

/** One thing that can happen on a board, and the voice it starts out using. */
export interface EventSpec {
  /** What the panel calls it. */
  label: string;
  /** What it means, because an unlabelled beep teaches nobody. */
  say: string;
  /** The voice it uses until somebody picks another. Only a default. */
  voice: VoiceId;
  /** Whether it is on for somebody who has never opened the panel. */
  on: boolean;
}

/**
 * A layer, with the boring parts defaulted.
 *
 * Written out in full the tables below would be hundreds of lines of `attack:
 * 0.001`, hiding the four numbers per sound that actually matter. `note` is the
 * same thing at a fixed pitch, which is most of them.
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

const note = (
  wave: Layer['wave'],
  hz: number,
  decay: number,
  level = 1,
  delay = 0,
  attack = 0.004
): Layer => tone(wave, hz, hz, decay, level, delay, attack);

/**
 * The library.
 *
 * Deliberately longer than the event list. A set with exactly one sound per
 * event is a set where every choice has already been made, and the point of
 * this table is that the choices have not been.
 *
 * The pitches are chosen rather than arbitrary. Anything that climbs reads as
 * good news and anything that falls reads as bad, which holds across every
 * family here - so a player reassigning voices can follow the same instinct
 * without having been told the rule.
 */
export const VOICES: Record<VoiceId, Voice> = {
  // ---- Chimes: clean, tuned, and the ones that carry furthest ------------
  'chime-up': {
    label: 'Rising chime',
    family: 'Chimes',
    gain: 0.85,
    layers: [
      note('sine', 587.33, 0.22, 0.9, 0, 0.01),
      note('sine', 880, 0.5, 1, 0.16, 0.01),
      note('triangle', 293.66, 0.45, 0.28, 0.16, 0.02)
    ]
  },
  'chime-down': {
    label: 'Falling chime',
    family: 'Chimes',
    gain: 0.8,
    layers: [
      note('sine', 880, 0.2, 0.9, 0, 0.01),
      note('sine', 587.33, 0.45, 1, 0.15, 0.01),
      note('triangle', 293.66, 0.4, 0.25, 0.15, 0.02)
    ]
  },
  bell: {
    label: 'Bell',
    family: 'Chimes',
    gain: 0.7,
    // A bell is its overtones. The inharmonic third partial is what stops this
    // reading as an organ note.
    layers: [
      note('sine', 880, 0.6, 1, 0, 0.006),
      note('sine', 1320, 0.4, 0.45, 0, 0.006),
      note('sine', 2640, 0.25, 0.3, 0, 0.006)
    ]
  },
  'triad-up': {
    label: 'Rising triad',
    family: 'Chimes',
    gain: 0.9,
    layers: [
      note('sine', 523.25, 0.16, 0.8, 0, 0.006),
      note('sine', 659.25, 0.16, 0.85, 0.11, 0.006),
      note('sine', 783.99, 0.7, 1, 0.22, 0.006),
      note('triangle', 261.63, 0.7, 0.35, 0.22, 0.02)
    ]
  },
  'triad-down': {
    label: 'Falling triad',
    family: 'Chimes',
    gain: 0.75,
    layers: [
      note('triangle', 392, 0.18, 0.8, 0, 0.01),
      note('triangle', 329.63, 0.18, 0.85, 0.13, 0.01),
      note('triangle', 261.63, 0.6, 1, 0.26, 0.012)
    ]
  },
  'level-pair': {
    label: 'Level pair',
    family: 'Chimes',
    gain: 0.7,
    // Neither rising nor falling. Two of the same note, one slightly detuned.
    layers: [note('sine', 440, 0.22, 1, 0, 0.01), note('sine', 442.5, 0.55, 0.7, 0.14, 0.01)]
  },
  arpeggio: {
    label: 'Arpeggio',
    family: 'Chimes',
    gain: 0.7,
    layers: [
      note('sine', 659.25, 0.12, 0.7, 0, 0.005),
      note('sine', 987.77, 0.12, 0.8, 0.07, 0.005),
      note('sine', 1318.51, 0.34, 1, 0.14, 0.005)
    ]
  },

  // ---- Wood: a piece meeting a board ------------------------------------
  knock: {
    label: 'Knock',
    family: 'Wood',
    gain: 0.5,
    layers: [tone('noise', 1800, 600, 0.03, 0.5, 0, 0.001), tone('triangle', 190, 120, 0.07, 1, 0, 0.001)]
  },
  'double-knock': {
    label: 'Double knock',
    family: 'Wood',
    gain: 0.55,
    // Two pieces, so two knocks. The gap is the whole sound.
    layers: [
      tone('noise', 1800, 600, 0.03, 0.45, 0, 0.001),
      tone('triangle', 200, 130, 0.06, 1, 0, 0.001),
      tone('noise', 1800, 600, 0.03, 0.45, 0.085, 0.001),
      tone('triangle', 240, 150, 0.07, 1, 0.085, 0.001)
    ]
  },
  thump: {
    label: 'Thump',
    family: 'Wood',
    gain: 0.65,
    layers: [
      tone('noise', 2600, 400, 0.07, 0.8, 0, 0.001),
      tone('triangle', 150, 62, 0.16, 1, 0, 0.001),
      tone('square', 96, 60, 0.1, 0.3, 0.01, 0.002)
    ]
  },
  'deep-thump': {
    label: 'Deep thump',
    family: 'Wood',
    gain: 0.7,
    layers: [
      tone('noise', 1400, 200, 0.09, 0.7, 0, 0.001),
      tone('triangle', 96, 42, 0.26, 1, 0, 0.002),
      tone('sine', 62, 34, 0.2, 0.5, 0, 0.002)
    ]
  },
  thud: {
    label: 'Thud',
    family: 'Wood',
    gain: 0.4,
    layers: [tone('triangle', 118, 92, 0.09, 1, 0, 0.002)]
  },
  tick: {
    label: 'Tick',
    family: 'Wood',
    gain: 0.3,
    layers: [note('sine', 1244.51, 0.035, 1, 0, 0.001)]
  },

  // ---- Digital: unmistakably a machine talking --------------------------
  blip: {
    label: 'Blip',
    family: 'Digital',
    gain: 0.45,
    layers: [note('square', 880, 0.05, 1, 0, 0.002)]
  },
  'blip-up': {
    label: 'Rising blip',
    family: 'Digital',
    gain: 0.5,
    layers: [tone('square', 440, 1320, 0.09, 1, 0, 0.003)]
  },
  'blip-down': {
    label: 'Falling blip',
    family: 'Digital',
    gain: 0.5,
    layers: [tone('square', 1320, 440, 0.09, 1, 0, 0.003)]
  },
  ping: {
    label: 'Ping',
    family: 'Digital',
    gain: 0.55,
    layers: [note('sine', 1568, 0.18, 1, 0, 0.003), note('sine', 3136, 0.07, 0.35, 0, 0.003)]
  },
  alarm: {
    label: 'Alarm',
    family: 'Digital',
    gain: 0.7,
    // Two tones a semitone apart, held. They beat against each other, which is
    // unpleasant on purpose: this is the voice for interrupting somebody.
    layers: [
      note('sine', 740, 0.3, 1, 0, 0.008),
      note('sine', 784, 0.3, 0.75, 0, 0.008),
      note('triangle', 370, 0.26, 0.3, 0, 0.01)
    ]
  },

  // ---- Rough: something did not go well ---------------------------------
  'buzz-down': {
    label: 'Falling buzz',
    family: 'Rough',
    gain: 0.6,
    layers: [tone('sawtooth', 240, 104, 0.28, 1, 0, 0.006), tone('sawtooth', 121, 52, 0.28, 0.4, 0.01, 0.006)]
  },
  rasp: {
    label: 'Rasp',
    family: 'Rough',
    gain: 0.5,
    layers: [note('sawtooth', 160, 0.16, 1, 0, 0.006), tone('noise', 900, 300, 0.12, 0.5, 0, 0.004)]
  },
  clunk: {
    label: 'Clunk',
    family: 'Rough',
    gain: 0.55,
    layers: [tone('square', 140, 70, 0.12, 1, 0, 0.003), tone('noise', 700, 180, 0.05, 0.7, 0, 0.001)]
  },

  // ---- Air: motion rather than an object --------------------------------
  'swoosh-up': {
    label: 'Rising swoosh',
    family: 'Air',
    gain: 0.4,
    layers: [tone('noise', 400, 2400, 0.14, 0.6, 0, 0.03), tone('sine', 330, 660, 0.12, 0.5, 0, 0.02)]
  },
  'swoosh-down': {
    label: 'Falling swoosh',
    family: 'Air',
    gain: 0.4,
    layers: [tone('noise', 2400, 400, 0.16, 0.6, 0, 0.03), tone('sine', 660, 300, 0.14, 0.5, 0, 0.02)]
  }
};

/**
 * The events, and where each one points to start with.
 *
 * Every `voice` here is a DEFAULT and nothing more. It is the assignment
 * somebody gets before they have an opinion, chosen so the board makes sense
 * out of the box, and the picker beside each row is the whole point of the
 * table being separate from the library.
 *
 * Ordered as the panel lists them: the one this module exists for first, then
 * the run of play, then the endings, then what a submission did, then the local
 * ones that report a finger rather than a chain.
 */
export const EVENTS: Record<SoundEvent, EventSpec> = {
  'your-turn': {
    label: 'Your turn',
    say: 'the opponent move confirmed on chain, and it is now your move',
    voice: 'chime-up',
    on: true
  },
  move: {
    label: 'Move',
    say: 'a move was accepted by replay',
    voice: 'knock',
    on: true
  },
  capture: {
    label: 'Capture',
    say: 'a move that took a piece',
    voice: 'thump',
    on: true
  },
  castle: {
    label: 'Castle',
    say: 'castling, on either side',
    voice: 'double-knock',
    on: true
  },
  promote: {
    label: 'Promotion',
    say: 'a pawn reached the far rank and became a piece',
    voice: 'arpeggio',
    on: true
  },
  check: {
    label: 'Check',
    say: 'the king of the side to move is in check',
    voice: 'alarm',
    on: true
  },
  win: {
    label: 'Win',
    say: 'the game ended in your favour',
    voice: 'triad-up',
    on: true
  },
  lose: {
    label: 'Loss',
    say: 'the game ended against you',
    voice: 'triad-down',
    on: true
  },
  draw: {
    label: 'Draw',
    say: 'the game ended level',
    voice: 'level-pair',
    on: true
  },
  // What a WATCHER hears when a game ends decisively.
  //
  // A spectator has no side, so `win` and `lose` are not theirs to hear -
  // inventing a stake they do not have would be the board asserting something
  // untrue. Without this they got nothing at all for a resignation, and the
  // ordinary check sound for a checkmate: the most important moment in a
  // watched game rendered as its second least.
  decided: {
    label: 'Game decided',
    say: 'a game you are watching ended with a winner (not your game)',
    voice: 'bell',
    on: true
  },
  // For everyone, players included. A draw offer is a decision somebody now
  // has to make, and before this it was the one thing on the board that
  // appeared nowhere in sound at all.
  'draw-offered': {
    label: 'Draw offered',
    say: 'a draw was offered, and is waiting for an answer',
    voice: 'ping',
    on: true
  },
  sent: {
    label: 'Move sent',
    say: 'your submission was broadcast, and is not in a block yet',
    voice: 'swoosh-up',
    on: true
  },
  skipped: {
    label: 'Submission skipped',
    say: 'something you sent was stored and charged for, but replay refused it',
    voice: 'buzz-down',
    on: true
  },
  select: {
    label: 'Piece picked up',
    say: 'you selected a piece (local, nothing on chain)',
    voice: 'tick',
    // Off until asked for: this fires far more often than anything else here.
    on: false
  },
  refused: {
    label: 'Refused',
    say: 'the board would not send something it is certain replay would skip',
    voice: 'thud',
    on: true
  }
};

/** The panel's order, and the order tests iterate. */
export const SOUND_EVENTS = Object.keys(EVENTS) as SoundEvent[];
export const VOICE_IDS = Object.keys(VOICES) as VoiceId[];

/** True when a stored or typed name is really in the library. */
export function isVoiceId(value: unknown): value is VoiceId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(VOICES, value);
}

/** The library grouped for the picker, in FAMILIES order. */
export function voicesByFamily(): { family: Family; voices: VoiceId[] }[] {
  return FAMILIES.map((family) => ({
    family,
    voices: VOICE_IDS.filter((id) => VOICES[id].family === family)
  }));
}

/**
 * How long a voice lasts, in seconds.
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
// Choosing an event
// ---------------------------------------------------------------------------

/**
 * The order events beat each other in.
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
 *
 * This is about EVENTS, not about voices. Which sound comes out is whatever the
 * player has assigned, and reassigning cannot change what beats what.
 */
const ORDER: readonly SoundEvent[] = [
  'win',
  'lose',
  'draw',
  'decided',
  'skipped',
  // Above `check`, deliberately. A draw offer is a decision somebody now has to
  // make and it appears NOWHERE else on the page as anything but a line of
  // text, whereas a check already lights the king's square red and animates it.
  // The sound is worth more to the thing that has no other way of being seen.
  'draw-offered',
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
 * Which event a change of state deserves, if any.
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
    } else {
      // A spectator neither won nor lost, and saying otherwise would invent a
      // stake they do not have - but a game ending is still the biggest thing
      // that happens in one, so it gets a sound of its own rather than nothing.
      candidates.add('decided');
    }
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
    if (involved(after, me) && mayMoveNow(after, me) && !same(last.sender, me)) {
      candidates.add('your-turn');
    }

    // The batch, not just the last record. Two submissions can land in one
    // poll, and a capture in the first of them still happened.
    for (const record of fresh) {
      if (record.kind === 'event' && record.event === 'draw-offer') {
        candidates.add('draw-offered');
      }
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

/**
 * Which side caused the change, if a side did.
 *
 * What "tell the sides apart" is keyed off. Read from the last new accepted
 * record rather than from whose turn it now is, because those are not the same
 * question: after White moves it is Black to play, and the sound is about the
 * move that happened, not the one that has not.
 *
 * Null for anything with no colour behind it - the first draw of a game, a poll
 * that changed nothing, and every local sound, none of which any side did.
 */
export function actorOf(before: ReplayState | null, after: ReplayState): 'white' | 'black' | null {
  if (!before) return null;
  const fresh = after.accepted.slice(before.accepted.length);
  return fresh.length ? fresh[fresh.length - 1].color : null;
}
