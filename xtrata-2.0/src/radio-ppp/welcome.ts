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
 */
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
  albums?: { title: string; by: string; run(): void }[];
  /** gift: do not say how many plays it holds yet (a lottery drop): that is the reveal when it lands. */
  mystery?: boolean;
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

/** The three things a player is, said the same way everywhere a newcomer meets one. */
export const PLAYER_PROMISES = [
  ['It pays the artist', 'Each play goes straight to whoever owns the song. Nobody in the middle.'],
  ['It’s yours', 'It lives on this device, opened by your face or fingerprint. No account, no password.'],
  ['Likes build your playlist', 'Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.']
] as const;

export const WELCOME_TEXT = {
  gift: { title: 'Your free player is waiting', primary: 'Claim my free player', hint: 'One tap with Face ID or your fingerprint. No app, no account, no password.', returning: 'I already have a player', full: 'Look around first' },
  new: { title: 'Music that pays the artist', body: 'Every play counts for whoever owns the song. Make your player once and you’re in.', primary: 'Make my player',
    hint: 'One tap with Face ID or your fingerprint. No app, no account, no password.', returning: 'I’ve listened here before', full: 'Look around first' },
  back: { title: 'Welcome back', body: 'Unlock your player and carry on listening.', primary: 'Unlock my player', hint: 'One tap with Face ID or your fingerprint.', returning: 'Use a different passkey', full: 'Look around first' },
  arriving: { title: 'Your player is made', body: 'Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself.' },
  landed: { title: 'You’re in', primary: 'Start listening' },
  empty: { title: 'Your player is ready', body: 'It has no plays yet. Add some and every song you hear pays its artist.', primary: 'Add plays', full: 'Look around the radio' },
  checking: 'One moment…',
  asking: 'Continue in the box below.'
} as const;

export const giftBody = (plays: number | null | undefined, from: string | null | undefined, mystery = false) =>
  mystery ? `${from || 'Xtrata Music'} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.`
    : `${from || 'Xtrata Music'} has covered ${plays ? `${count(plays)} plays` : 'your first plays'}. Play any song you like, and every play pays the artist.`;
export const landedBody = (plays: number | null | undefined) =>
  plays ? `Your player holds ${count(plays)} plays. Play anything: each one pays the artist you’re hearing.` : 'Your player is ready. Play anything: each play pays the artist you’re hearing.';
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
  const promises = () => {
    const list = el('ul', 'al-welcome-points');
    for (const [title, text] of PLAYER_PROMISES) { const li = el('li'); li.append(el('b', '', title), el('span', '', text)); list.append(li); }
    return list;
  };
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
      brand.append('Xtrata ', el('b', '', 'Music'));
      top.append(brand);
      const body = el('div', 'al-body al-body--welcome');
      const box = el('div', 'al-welcome');
      const m = input.mode;
      if (m === 'checking') {
        box.append(el('p', 'al-welcome-wait', WELCOME_TEXT.checking));
      } else {
        // The player's class, as a record in its colours: the reveal when it lands, and there again on every return.
        if (input.tier && (m === 'landed' || m === 'back' || m === 'empty')) box.append(tierDisc(input.tier));
        box.append(el('h1', '', m === 'landed' ? landedTitle(input.tier) : m === 'back' && input.tier ? `Your ${input.tier.name} player` : WELCOME_TEXT[m].title));
        box.append(el('p', '', m === 'gift' ? giftBody(input.plays, input.from, input.mystery) : m === 'landed' ? landedBody(input.plays) : WELCOME_TEXT[m].body));
        if (m === 'landed' || m === 'gift') box.append(promises());
        if (input.status.length) { const s = el('div', 'al-status'); s.setAttribute('role', 'status'); s.append(...input.status); box.append(s); }
        if (input.asking) box.append(el('p', 'al-hint al-hint--ask', WELCOME_TEXT.asking));
        else if (m === 'gift' || m === 'new' || m === 'back') {
          const w = WELCOME_TEXT[m];
          if (input.canStart) box.append(button('al-primary', w.primary, m === 'back' ? input.unlock : input.start, input.busy), el('p', 'al-hint', w.hint));
          if (input.canStart) box.append(button('al-link', w.returning, input.returning, input.busy));
          box.append(button('al-link', w.full, input.full));
        } else if (m === 'landed') {
          box.append(button('al-primary', WELCOME_TEXT.landed.primary, input.full));
          if (input.albums?.length) {
            box.append(el('p', 'al-hint', 'Or start with an album that comes with your player:'));
            for (const a of input.albums) { const b = button('al-album', '', a.run); b.append(el('b', '', a.title), el('span', '', a.by)); box.append(b); }
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
