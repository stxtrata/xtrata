/**
 * "Replace my old player": for someone who made a player before the giveaway and now has a free one to claim.
 * Empty the old player, remove it from this device, then claim the new one (which has 24 backup words).
 *
 * Nothing here moves money or forgets anything by itself: each step is the listener's own tap on something that
 * already exists (unlock, "return all", the wallet box's own "remove from this device" panel, the ordinary claim).
 * This module only keeps the place, refuses to go on when that would leave something behind, and says what stays with
 * the old player. The old passkey is never deleted by us (a page cannot): at the end the listener is told which
 * passkey is the new one, so they can delete the old one themselves if they want to.
 *
 * It stops, and points to "keep both players" instead, when the old player has albums of its own or holds a Music
 * Hero record: those would be left behind.
 */
import type { Snapshot } from './controller';
import { connectStacksWallet } from './connect-stacks';

export interface ReplaceDeps {
  json(url: string): Promise<any>;
  unlock(): void;
  /** Send everything in the open player back where it came from (the wallet box shows and confirms it). */
  returnAll(): void;
  /** The wallet box's own "remove this player from this device" panel. Resolves once it is removed. */
  forget(): Promise<void>;
  /** Write down the new player's backup words (in the wallet box). */
  backup(): void;
  /** Claim the free player as a second player instead, keeping the old one. Null when that is not on offer. */
  keepBoth(s: Snapshot): (() => void) | null;
  who(address?: string): string;
  changed(): void;
  store: { get(key: string): string | null; set(key: string, value: string | null): void };
  /** Balance at or below this cannot be moved (less than the network fee to send it): the player counts as empty. */
  dust(s: Snapshot): bigint;
}

const KEY = 'xtrata.radio.replace.v1';
const el = (tag: string, text = '', cls = '') => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
const button = (label: string, run: () => void, cls = '') => { const b = el('button', label, cls) as HTMLButtonElement; b.type = 'button'; b.onclick = run; return b; };
const stxOf = (v: bigint) => (Number(v) / 1e6).toLocaleString('en-GB', { maximumFractionDigits: 6 });

type Kept = { old: string; removed?: true };
export function createReplace(deps: ReplaceDeps) {
  const read = (): Kept | null => { try { const v = JSON.parse(deps.store.get(KEY) || 'null'); return v && typeof v.old === 'string' ? v : null; } catch { return null; } };
  let state = read();
  const keep = (next: Kept | null) => { state = next; deps.store.set(KEY, next ? JSON.stringify(next) : null); deps.changed(); };
  let albums: { for: string; n: number | null; at: number } | null = null; // n null: could not be read
  let asking = false;
  let note = '';
  let working = false;

  function countAlbums(old: string) {
    if (asking || (albums?.for === old && (albums.n !== null || Date.now() - albums.at < 30_000))) return;
    asking = true;
    deps.json('/radio/gift/shelf?root=' + encodeURIComponent(old) + '&limit=1').then(
      (r) => { albums = { for: old, n: Number.isSafeInteger(r?.total) ? r.total : null, at: Date.now() }; },
      () => { albums = { for: old, n: null, at: Date.now() }; }).finally(() => { asking = false; deps.changed(); });
  }

  const active = () => !!state;
  /** Between removing the old player and making the new one: the next player made is the replacement. */
  const claiming = () => !!state?.removed;
  function start(s: Snapshot) { if (s.listening) { note = ''; keep({ old: s.listening }); } }
  const stop = () => { note = ''; keep(null); };

  /** The lines for the player panel, or null when no replacement is under way. */
  function lines(s: Snapshot): HTMLElement[] | null {
    if (!state) return null;
    // The old player was opened again after being removed (its passkey still works): carry on from where that leaves it.
    if (state.removed && s.listening === state.old) { state = { old: state.old }; deps.store.set(KEY, JSON.stringify(state)); }
    const out: HTMLElement[] = [];
    const head = (step: number, text: string) => out.push(el('p', `Replacing your old player · step ${step} of 3 · ${text}`, 'ppp-cyan'));
    const stopButton = () => button('Stop · keep my old player', stop, 'quiet');
    // 3. The new player exists.
    if (s.listening && s.listening !== state.old) {
      if (!state.removed) { stop(); return null; } // another player was opened instead: nothing to replace here
      out.push(el('p', 'Your new player is ready ✓ Your old one is empty and no longer on this device.', 'ppp-ok'));
      if (s.phrase && !s.backedUp) out.push(el('p', 'First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost.'), button('Back up my player · 24 words', deps.backup, 'primary'));
      else if (s.backedUp) out.push(el('p', 'Its 24 backup words are written down ✓', 'ppp-ok'));
      const mine = s.passkeyName ? `the one called “${s.passkeyName}”` : 'the newest one';
      out.push(el('p', `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${mine}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, 'ppp-mute'));
      out.push(button('Done', stop, 'quiet'));
      return out;
    }
    // 3 (before): the old one is gone from this device; the ordinary claim is on screen.
    if (!s.listening || state.removed) {
      if (!state.removed) return null; // the device shows no player and nothing was removed: not ours to describe
      head(3, 'claim your new player');
      out.push(el('p', 'Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.', 'ppp-ok'));
      out.push(button('Hide this', stop, 'quiet'));
      return out;
    }
    // 1 and 2: the old player is this device's player.
    countAlbums(state.old);
    if (s.step === 'locked' || s.step === 'intro') { head(1, 'empty it'); out.push(el('p', 'Unlock your old player so it can be emptied.'), button('Unlock my old player', deps.unlock, 'primary'), stopButton()); return out; }
    const both = deps.keepBoth(s);
    const blocked = (why: string) => { head(1, 'empty it'); out.push(el('p', why, 'ppp-warn')); if (both) out.push(button('Keep both players instead', () => { stop(); both(); }, 'primary')); out.push(stopButton()); return out; };
    if (s.slot !== 0) return blocked('An album is open. Go back to your own player first.');
    if (albums?.for !== state.old) { head(1, 'empty it'); out.push(el('p', 'Checking what this player has…', 'ppp-mute'), stopButton()); return out; }
    if (albums.n === null) return blocked('Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.');
    if (albums.n > 0) return blocked(`This player has ${albums.n === 1 ? 'an album' : `${albums.n} albums`} of its own. Replacing it would leave ${albums.n === 1 ? 'it' : 'them'} behind, so it stays.`);
    if (s.award?.state === 'claimed' && s.award.holds !== false) return blocked('This player holds a Music Hero record. Send the record to another address first, or keep both players.');
    if (s.depositPending || s.entries.some((e) => ['prepared', 'signed', 'unknown', 'pending'].includes(String(e.status)))) { head(1, 'empty it'); out.push(el('p', 'Something is still on its way in or out of this player. This carries on by itself once it has settled.', 'ppp-mute'), stopButton()); return out; }
    if (s.balance === undefined) { head(1, 'empty it'); out.push(el('p', 'Checking what it holds…', 'ppp-mute'), stopButton()); return out; }
    if (s.balance > deps.dust(s)) {
      head(1, 'empty it');
      out.push(el('p', `It holds ${stxOf(s.balance)} STX. Send it back${s.returnTo ? ` to ${deps.who(s.returnTo)}` : ''} first: nothing may be left in a player you are about to remove.`));
      if (s.returnTo || s.gift) out.push(button('Send everything back', deps.returnAll, 'primary'));
      else out.push(el('p', 'There is nowhere set to send it. Connect a Stacks wallet and link it to this player, then come back here.', 'ppp-warn'), button('Connect Stacks wallet', connectStacksWallet, 'primary'));
      out.push(stopButton());
      return out;
    }
    head(2, 'remove it from this device');
    out.push(el('p', s.balance > 0n ? `Empty ✓ (the ${stxOf(s.balance)} STX left is less than the network fee to move it).` : 'Empty ✓', 'ppp-ok'));
    out.push(el('p', 'What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.', 'ppp-mute'));
    const go = button(working ? 'Check the box below…' : 'Remove my old player', () => {
      if (working) return;
      working = true; note = ''; deps.changed();
      deps.forget().then(() => { keep({ old: state!.old, removed: true }); }, (e) => { note = /cancel/i.test((e as Error)?.message || '') ? '' : ((e as Error)?.message || 'It was not removed.'); })
        .finally(() => { working = false; deps.changed(); });
    }, 'primary');
    go.disabled = working || !!s.busy;
    out.push(go, stopButton());
    if (note) out.push(el('p', note, 'ppp-warn'));
    return out;
  }

  return { active, claiming, start, stop, lines };
}
