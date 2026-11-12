/**
 * Novice mode for the pay-per-play radio (docs/music/HANDBOOK.md, "Novice mode").
 *
 * A listener who has never used crypto should be able to read the main path of the page without meeting the
 * words STX, wallet, address, seed or sign. This module holds only wording and flags: no money logic, no keys,
 * nothing the controller or the wallet box depends on. Everything it hides stays one tap away in the folds.
 *
 * OFF BY DEFAULT. Switched on per device:
 *   ?novice=1        plain wording, the album page, no setup track
 *   ?novice=preview  the same, plus one unpaid first song from a shared album before the player is made
 *   ?novice=0        back to the classic page
 * The choice is remembered on the device (localStorage `xtrata.radio.novice`).
 */
import type { GiftStopReason, Step } from './controller';

export const NOVICE_KEY = 'xtrata.radio.novice';
/** Album ids whose free first song this device has already heard. */
export const PREVIEWED_KEY = 'xtrata.radio.novice.previewed.v1';
/** A preview never runs longer than this, whatever the radio reports. */
export const PREVIEW_MAX_MS = 6 * 60_000;

export interface NoviceFlags { on: boolean; preview: boolean }
export interface FlagStore { get(key: string): string | null; set(key: string, value: string | null): void }

/** Reads the flag from the address bar (and remembers it), else from the device. Anything unreadable is "off". */
export function readNovice(search: string, store: FlagStore): NoviceFlags {
  let value: string | null = null;
  try {
    const asked = new URLSearchParams(search).get('novice');
    if (asked === '1' || asked === 'preview') { store.set(NOVICE_KEY, asked); value = asked; }
    else if (asked === '0') { store.set(NOVICE_KEY, null); return { on: false, preview: false }; }
    else value = store.get(NOVICE_KEY);
  } catch { value = null; }
  return { on: value === '1' || value === 'preview', preview: value === 'preview' };
}

/** Words a newcomer should not need on the main path. Tested against everything novice mode shows outside a fold. */
export const BANNED_WORDS = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i;
export const hasBannedWord = (text: string | null | undefined) => BANNED_WORDS.test(text ?? '');

/** Button labels that say the same thing without the crypto word. */
export const PLAIN_LABEL: Record<string, string> = {
  'Start listening · no wallet needed': 'Start listening',
  'Claim my gift · no wallet needed': 'Open my gift',
  'I already have a listening wallet': 'I’ve listened here before',
  'Use a different listening wallet': 'Use a different passkey'
};

/** What the radio's screen says while it will not play, by reason, in plain words. */
export const PLAIN_STOP: Record<GiftStopReason, string> = {
  connect: 'MAKE YOUR PLAYER TO LISTEN',
  setup: 'MAKE YOUR PLAYER TO LISTEN',
  checking: 'CHECKING YOUR PLAYER',
  unavailable: 'XTRATA MUSIC IS UNAVAILABLE HERE',
  locked: 'UNLOCK TO LISTEN',
  link: 'FINISH SETUP TO LISTEN',
  over: 'TOO MUCH IN YOUR PLAYER — SEE THIS DEVICE',
  arriving: 'YOUR PLAYS ARE ARRIVING',
  out: 'OUT OF PLAYS — ADD MORE TO KEEP LISTENING',
  off: 'SWITCH PLAYS ON TO LISTEN',
  tab: 'PLAYING IN ANOTHER TAB'
};
export const plainStop = (reason: GiftStopReason, fallback: string) => PLAIN_STOP[reason] ?? fallback;

/**
 * The lines a newcomer reads at a step when the classic ones (which name STX or an address) have been folded away.
 * Returned only for steps where the classic main path would otherwise be left empty.
 */
export function plainLines(step: Step, o: { played: boolean; arriving: boolean }): string[] {
  switch (step) {
    case 'fund':
      if (o.arriving) return [];
      return [
        o.played ? 'Out of plays.' : 'No plays yet.',
        'Tap “Add plays” to top up, or open an album someone shares with you.'
      ];
    case 'over':
      return ['Your player is holding more than it should, so plays are paused. Open “This device” below to send the extra back.'];
    default:
      return [];
  }
}

/** The note under the receiver while the radio is not playing. */
export const PLAIN_NUDGE = 'Make your player once, with Face ID or your fingerprint, and the music starts.';
export const PLAIN_CHECKING = 'Checking your player…';

// ---------------------------------------------------------------- the free first song
export type PreviewPhase = 'idle' | 'open' | 'playing' | 'done';
export interface PreviewState { album: string | null; phase: PreviewPhase; track: string | null; since: number; heard: number }
export const newPreview = (): PreviewState => ({ album: null, phase: 'idle', track: null, since: 0, heard: 0 });

export function previewedAlbums(store: FlagStore): string[] {
  try { const v = JSON.parse(store.get(PREVIEWED_KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(-50) : []; } catch { return []; }
}
export function markPreviewed(store: FlagStore, album: string) {
  const list = previewedAlbums(store).filter((a) => a !== album);
  list.push(album);
  store.set(PREVIEWED_KEY, JSON.stringify(list.slice(-50)));
}

/**
 * One unpaid song, once per album per device, before the listener has made a player. It ends at the first of:
 * the radio moving to a different song, a second song being heard for 30 seconds, or PREVIEW_MAX_MS.
 * The page marks the album as previewed the moment the song starts, so reloading does not start it again. That
 * memory is the device's own storage: a courtesy of the page, like the album lock, not something that is enforced.
 * Pure: the page feeds it what the radio reports and acts on the phase it returns.
 */
export function stepPreview(p: PreviewState, ev:
  | { kind: 'offer'; album: string; already: boolean }
  | { kind: 'withdraw' }
  | { kind: 'now'; track: string | null; playing: boolean; at: number }
  | { kind: 'listened'; at: number }
  | { kind: 'tick'; at: number }): PreviewState {
  switch (ev.kind) {
    case 'offer':
      // The same album again (every redraw offers it): whatever state it is in stands.
      if (p.album === ev.album && p.phase !== 'idle') return p;
      return { ...newPreview(), album: ev.album, phase: ev.already ? 'done' : 'open' };
    case 'withdraw':
      return p.phase === 'idle' ? p : newPreview();
    case 'now':
      if (p.phase === 'open' && ev.playing && ev.track) return { ...p, phase: 'playing', track: ev.track, since: ev.at };
      if (p.phase === 'playing' && ev.track && ev.track !== p.track) return { ...p, phase: 'done' };
      if (p.phase === 'playing' && ev.at - p.since > PREVIEW_MAX_MS) return { ...p, phase: 'done' };
      return p;
    case 'listened':
      if (p.phase !== 'playing') return p;
      return p.heard >= 1 ? { ...p, phase: 'done' } : { ...p, heard: p.heard + 1 };
    case 'tick':
      return p.phase === 'playing' && ev.at - p.since > PREVIEW_MAX_MS ? { ...p, phase: 'done' } : p;
  }
}
/** The radio may play (the shared album only) while a preview is open or playing. */
export const previewLive = (p: PreviewState) => p.phase === 'open' || p.phase === 'playing';
