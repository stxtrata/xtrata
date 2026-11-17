/**
 * Novice mode's simple screens (docs/music/HANDBOOK.md, "Novice mode"). A newcomer sees one short page and one
 * button at a time, not the whole radio. It uses the album page's mount and its `html[data-view="album"]` rule, so the
 * radio and the panel are hidden behind it and the wallet box opens as a sheet when it asks for a tap.
 *
 * It only calls actions the panel already has and holds no money logic.
 *   checking  the page does not know yet who this is: a quiet holding screen, never the full radio flashing by
 *   gift      a free starter player is waiting on this device: "Claim my player"
 *   new       no player on this device and no gift: "Make my player"
 *   back      this device has a player, locked: "Unlock my player"
 *   arriving  a player was just made and its plays are on their way
 *   landed    the plays have arrived: what this player is, and "Start listening"
 *   empty     a player with no plays: say so plainly, and lead to "Add plays"
 *
 * Getting started is shown as three lights (stepLights), with the Xtrata mark at the top and a record to look at on
 * every screen: a newcomer should see where they are without reading.
 */
import { xtrataMark } from './brand';
export type WelcomeMode = 'checking' | 'gift' | 'new' | 'back' | 'arriving' | 'landed' | 'empty';
export interface WelcomeInput {
  mode: WelcomeMode;
  /** Progress, waits and real errors, already worded (a gift on its way, a cancelled passkey, an in-app browser). */
  status: HTMLElement[];
  /** The wallet box is asking for a tap: it shows in its own sheet, so the screen says where to look. */
  asking: boolean;
  busy: boolean;
  /** False where this browser cannot make or open a player at all: no button, the status says what to do. */
  canStart: boolean;
  /** gift: plays that come with it and who it is from. landed: plays the player now holds. */
  plays?: number | null;
  from?: string | null;
  /** The player's class from the giveaway (tiers.ts), when it has one: shown as a coloured record. */
  tier?: { id: string; name: string; mark: string } | null;
  /** landed: albums the player comes loaded with; tapping one starts it. */
  albums?: { title: string; by: string; cover?: string; run(): void }[];
  /** gift: do not say how many plays it holds yet (a lottery drop): that is the reveal when it lands. */
  mystery?: boolean;
  /**
   * new: this is the home-screen app. A phone keeps an installed app's storage apart from the browser's, so someone who
   * made their player in the browser arrives here looking new: opening the player they have comes first.
   */
  installed?: boolean;
  /** gift: the number of the disc they picked on the wall, when known. */
  spot?: number | null;
  /** gift: an intro song is set, so the one button is "Play": it starts the music and asks for the passkey together. */
  intro?: { ready: boolean } | null;
  /** The intro song sounding during the claim: shown in place of words while the passkey is made and the plays land. */
  now?: { title: string; artist: string; art: string; playing: boolean } | null;
  /**
   * back, arriving with a free player to claim on a device whose player was made before the giveaway: claim it as a new,
   * separate player (its own passkey). Null for everyone else.
   */
  claimNew?: (() => void) | null;
  /** With `claimNew`: replace the old player instead (empty it, remove it, then claim). Leads when on offer. */
  replaceOld?: (() => void) | null;
  start(): void;
  returning(): void;
  unlock(): void;
  /** Open "Add plays". */
  restock(): void;
  /** Leave these screens for the full radio page (for this visit). */
  full(): void;
}

const el = (tag: string, cls = '', text = '') => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
const button = (cls: string, label: string, run: () => void, disabled = false) => {
  const b = el('button', cls, label) as HTMLButtonElement;
  b.type = 'button'; b.disabled = disabled; b.onclick = run;
  return b;
};
const count = (n: number) => n.toLocaleString();

/**
 * Where a newcomer is, as three lights: the ones behind them are lit, the one they are on glows. Shown from the first
 * screen until they are in, so every step visibly moves them along. Words stay short: the lights do the telling.
 */
export const WELCOME_STEPS = { gift: ['Picked', 'Passkey', 'Listen'], fresh: ['Welcome', 'Passkey', 'Listen'] } as const;
/** Which light glows: -1 when the screen is not part of getting started (a return visit, an empty player). */
export const stepNow = (mode: WelcomeMode): number => (mode === 'gift' || mode === 'new' ? 1 : mode === 'arriving' ? 2 : mode === 'landed' ? 3 : -1);
export function stepLights(labels: readonly string[], now: number): HTMLElement {
  const list = el('ol', 'al-steps');
  list.setAttribute('aria-label', now >= labels.length ? 'All steps done' : `Step ${now + 1} of ${labels.length}: ${labels[now]}`);
  labels.forEach((label, i) => {
    const li = el('li', i < now ? 'is-done' : i === now ? 'is-now' : '');
    li.append(el('i', '', i < now ? '✓' : String(i + 1)), el('span', '', label));
    list.append(li);
  });
  return list;
}
/** A player nobody has opened yet: a record in all the classes' colours with a question mark where its label would be. */
export function mysteryDisc(): HTMLElement {
  const d = el('div', 'tier-disc tier-disc--mid');
  d.dataset.tier = 'mystery';
  d.setAttribute('role', 'img'); d.setAttribute('aria-label', 'A player waiting to be opened');
  d.append(el('span', 'tier-disc__mark', '?'));
  return d;
}

/** The three things a player is, said the same way everywhere a newcomer meets one. */
export const PLAYER_PROMISES = [
  ['It pays the artist', 'Each play goes straight to whoever owns the song. Nobody in the middle.', '♪'],
  ['It’s yours', 'It lives on this device, opened by your face or fingerprint. No account, no password.', '◉'],
  ['Likes build your playlist', 'Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.', '♥']
] as const;

export const WELCOME_TEXT = {
  gift: { title: 'Your disc is ready', primary: 'Claim my free player', play: 'Play', hint: 'Free. Face ID or fingerprint.', returning: 'I already have a player', full: 'Look around first' },
  installedNew: { title: 'Open your player', body: 'Use your face or fingerprint to open the player you already have.', primary: 'Open my player', hint: 'Face ID or fingerprint.', fresh: 'I’m new: make my player' },
  new: { title: 'Music that pays the artist', body: 'Every play counts for whoever owns the song. Make your player once and you’re in.', primary: 'Make my player',
    hint: 'One tap with Face ID or your fingerprint. No app, no account, no password.', returning: 'I’ve listened here before', full: 'Look around first' },
  back: { title: 'Welcome back', body: 'Unlock your player and carry on listening.', primary: 'Unlock my player', hint: 'One tap with Face ID or your fingerprint.', returning: 'Use a different passkey', full: 'Look around first' },
  backClaim: { title: 'A free player is waiting', body: 'This device already has a player you made before. You can claim the free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is.',
    primary: 'Claim it as a new player', hint: 'One tap with Face ID or your fingerprint. You can switch between your players at any time.', unlock: 'Open my existing player instead',
    replace: 'Replace my old player', replaceHint: 'Its balance is sent back first, then it is removed from this device. You end up with one player that has 24 backup words.', both: 'Keep both players' },
  arriving: { title: 'Your player is made', body: 'Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself.', playing: 'Your player is made' },
  landed: { title: 'You’re in', primary: 'Start listening', playing: 'Keep listening' },
  empty: { title: 'Your player is ready', body: 'It has no plays yet. Add some and every song you hear pays its artist.', primary: 'Add plays', full: 'Look around the radio' },
  checking: 'One moment…',
  asking: 'Continue in the box below.'
} as const;

/** Few words: a newcomer is here to hear music, and the screens that follow show the rest. */
export const giftTitle = (spot: number | null | undefined) => (spot ? `Disc ${spot} is yours` : WELCOME_TEXT.gift.title);
export const giftBody = (plays: number | null | undefined, _from?: string | null, mystery = false) =>
  mystery ? 'What is inside? Play it to find out.' : plays ? `${count(plays)} plays inside. Every play pays the artist.` : 'Every play pays the artist.';
export const landedBody = (plays: number | null | undefined) => (plays ? `${count(plays)} plays. Every one pays the artist.` : 'Every play pays the artist.');
/** The song sounding during the claim: its artwork, its name and who it is by. A picture, not a sentence. */
export function nowPlaying(now: NonNullable<WelcomeInput['now']>, big = false): HTMLElement {
  const box = el('div', 'al-now' + (big ? ' al-now--big' : ''));
  const img = el('img', 'al-now__art') as HTMLImageElement; img.src = now.art; img.alt = '';
  const t = el('div', 'al-now__t');
  t.append(el('b', '', now.title || 'Playing now'), el('span', '', now.artist));
  const eq = el('i', 'al-now__eq' + (now.playing ? ' is-on' : '')); eq.setAttribute('aria-hidden', 'true'); eq.append(el('s'), el('s'), el('s'));
  box.append(img, t, eq);
  box.setAttribute('role', 'group'); box.setAttribute('aria-label', `${now.playing ? 'Playing' : 'Starting'}: ${now.title || 'your first song'}${now.artist ? ` by ${now.artist}` : ''}`);
  return box;
}
export const landedTitle = (tier: WelcomeInput['tier']) => (tier ? `You got a ${tier.name} player` : WELCOME_TEXT.landed.title);
/** The record a tier is drawn as (public/radio.html styles `.tier-disc[data-tier]`). */
export function tierDisc(tier: NonNullable<WelcomeInput['tier']>, big = true): HTMLElement {
  const d = el('div', 'tier-disc' + (big ? ' tier-disc--big' : ''));
  d.dataset.tier = tier.id;
  d.setAttribute('role', 'img'); d.setAttribute('aria-label', `${tier.name} player`);
  d.append(el('span', 'tier-disc__mark', tier.mark));
  return d;
}

export function createWelcomeView(mount: HTMLElement) {
  const root = document.documentElement;
  let on = false;
  return {
    showing: () => on,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(input: WelcomeInput | null, albumActive = false) {
      if (!input) {
        if (on && !albumActive) { mount.hidden = true; mount.replaceChildren(); delete root.dataset.view; delete root.dataset.asking; }
        on = false;
        delete root.dataset.welcome;
        return;
      }
      on = true;
      root.dataset.view = 'album';
      root.dataset.welcome = input.mode;
      if (input.asking) root.dataset.asking = '1'; else delete root.dataset.asking;
      const top = el('header', 'al-top');
      const brand = el('a', 'al-brand') as HTMLAnchorElement;
      brand.href = '/radio';
      brand.append(xtrataMark('al-logo'), el('span', '', 'Xtrata '), el('b', '', 'Music'));
      top.append(brand);
      const body = el('div', 'al-body al-body--welcome');
      const box = el('div', 'al-welcome');
      const m = input.mode;
      if (m === 'checking') {
        box.append(el('p', 'al-welcome-wait', WELCOME_TEXT.checking));
      } else {
        // Where they are, as three lights, from the first screen until they are in.
        const now = stepNow(m);
        if (now >= 0) box.append(stepLights(m === 'new' ? WELCOME_STEPS.fresh : WELCOME_STEPS.gift, now));
        // Something to look at on every screen. The player's class, as a record in its colours: the reveal when it lands,
        // and there again on every return. Before that: the unopened record, or the Xtrata mark for someone arriving cold.
        if (input.tier && (m === 'landed' || m === 'back' || m === 'empty')) box.append(tierDisc(input.tier));
        else if (m === 'gift' || m === 'arriving') box.append(mysteryDisc());
        else if (m === 'new') box.append(xtrataMark('al-hero-mark'));
        const sounding = input.now && (m === 'gift' || m === 'arriving' || m === 'landed') ? input.now : null;
        const home = m === 'new' && !!input.installed;
        box.append(el('h1', '', m === 'landed' ? landedTitle(input.tier) : m === 'back' && input.tier ? `Your ${input.tier.name} player` : m === 'gift' ? giftTitle(input.spot) : home ? WELCOME_TEXT.installedNew.title : WELCOME_TEXT[m].title));
        // With the intro song sounding, the song stands where the explanation was: nobody reads while music starts.
        if (sounding && m === 'arriving') box.append(nowPlaying(sounding, true));
        else box.append(el('p', '', m === 'gift' ? giftBody(input.plays, input.from, input.mystery) : m === 'landed' ? landedBody(input.plays) : home ? WELCOME_TEXT.installedNew.body : WELCOME_TEXT[m].body));
        if (sounding && m !== 'arriving') box.append(nowPlaying(sounding));
        if (input.status.length) { const s = el('div', 'al-status'); s.setAttribute('role', 'status'); s.append(...input.status); box.append(s); }
        if (input.asking) box.append(el('p', 'al-hint al-hint--ask', WELCOME_TEXT.asking));
        else if (m === 'back' && input.claimNew) {
          const w = WELCOME_TEXT.backClaim;
          box.append(el('p', 'al-hint', w.body));
          if (input.canStart && input.replaceOld) box.append(button('al-primary', w.replace, input.replaceOld, input.busy), el('p', 'al-hint', w.replaceHint), button('al-link', w.both, input.claimNew, input.busy), button('al-link', w.unlock, input.unlock, input.busy));
          else if (input.canStart) box.append(button('al-primary', w.primary, input.claimNew, input.busy), el('p', 'al-hint', w.hint), button('al-link', w.unlock, input.unlock, input.busy));
          box.append(button('al-link', WELCOME_TEXT.back.full, input.full));
        } else if (m === 'gift') {
          // One button. With an intro song it is "Play": the music starts in that tap and the passkey is asked for with it.
          const w = WELCOME_TEXT.gift;
          if (input.canStart) { const b = button('al-primary' + (input.intro ? ' al-primary--play' : ''), input.intro ? w.play : w.primary, input.start, input.busy); box.append(b, el('p', 'al-hint', w.hint)); }
          if (input.canStart) box.append(button('al-link', w.returning, input.returning, input.busy));
          else box.append(button('al-link', w.full, input.full));
        } else if (m === 'new' && input.installed) {
          const w = WELCOME_TEXT.installedNew;
          if (input.canStart) box.append(button('al-primary', w.primary, input.returning, input.busy), el('p', 'al-hint', w.hint), button('al-link', w.fresh, input.start, input.busy));
          box.append(button('al-link', WELCOME_TEXT.new.full, input.full));
        } else if (m === 'new' || m === 'back') {
          const w = WELCOME_TEXT[m];
          if (input.canStart) box.append(button('al-primary', w.primary, m === 'back' ? input.unlock : input.start, input.busy), el('p', 'al-hint', w.hint));
          if (input.canStart) box.append(button('al-link', w.returning, input.returning, input.busy));
          box.append(button('al-link', w.full, input.full));
        } else if (m === 'landed') {
          box.append(button('al-primary', input.now?.playing ? WELCOME_TEXT.landed.playing : WELCOME_TEXT.landed.primary, input.full));
          if (input.albums?.length && !input.now) {
            box.append(el('p', 'al-hint', 'Or start with an album that comes with your player:'));
            for (const a of input.albums) { const b = button('al-album', '', a.run);
              // The album's own cover beside its name (art.ts finds it); a plain row until it is known.
              if (a.cover) { const img = el('img', 'al-album__art') as HTMLImageElement; img.src = a.cover; img.alt = ''; b.classList.add('al-album--art'); b.append(img); }
              const t = el('span', 'al-album__t'); t.append(el('b', '', a.title), el('span', '', a.by)); b.append(t); box.append(b); }
          }
        }
        else if (m === 'empty') box.append(button('al-primary', WELCOME_TEXT.empty.primary, input.restock), button('al-link', WELCOME_TEXT.empty.full, input.full));
      }
      body.append(box);
      mount.hidden = false;
      mount.replaceChildren(top, body);
    }
  };
}
