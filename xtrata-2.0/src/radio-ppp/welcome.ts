/**
 * Novice mode's first screen (docs/music/HANDBOOK.md, "Novice mode"). A newcomer with no player and no album sees
 * one short page and one button, not the whole radio. It uses the album page's mount and its `html[data-view="album"]`
 * rule, so the radio and the panel are hidden behind it and the wallet box opens as a sheet when it asks for a tap.
 *
 * It only calls the actions the panel already has (make a player, sign in with a passkey) and holds no money logic.
 *   checking  the page does not know yet who this is: a quiet holding screen, never the full radio flashing by
 *   new       no player on this device: "Make my player"
 *   back      this device has a player, locked: "Unlock my player"
 *   empty     a player was just made and has no plays yet: say so plainly, and offer the radio
 */
export type WelcomeMode = 'checking' | 'new' | 'back' | 'empty';
export interface WelcomeInput {
  mode: WelcomeMode;
  /** Real errors and waits, already worded (a cancelled passkey, an in-app browser, a browser without passkeys). */
  status: HTMLElement[];
  /** The wallet box is asking for a tap: it shows in its own sheet, so the screen says where to look. */
  asking: boolean;
  busy: boolean;
  /** False where this browser cannot make a player at all: no button, the status says what to do. */
  canStart: boolean;
  start(): void;
  returning(): void;
  unlock(): void;
  /** Leave this screen for the full radio page (for this visit). */
  full(): void;
}

const el = (tag: string, cls = '', text = '') => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
const button = (cls: string, label: string, run: () => void, disabled = false) => {
  const b = el('button', cls, label) as HTMLButtonElement;
  b.type = 'button'; b.disabled = disabled; b.onclick = run;
  return b;
};

export const WELCOME_TEXT = {
  new: { title: 'Music that pays the artist', body: 'Every play counts for whoever owns the song. Make your player once and you’re in.', primary: 'Make my player',
    hint: 'One tap with Face ID or your fingerprint. No app, no account, no password.', returning: 'I’ve listened here before', full: 'Look around first' },
  back: { title: 'Welcome back', body: 'Unlock your player and carry on listening.', primary: 'Unlock my player', hint: 'One tap with Face ID or your fingerprint.', returning: 'Use a different passkey', full: 'Look around first' },
  empty: { title: 'Your player is ready', body: 'It has no plays yet. Plays come with music someone shares with you: open their link on this device and the album lands here.',
    note: 'Paying by card is on its way.', primary: 'Look around the radio' },
  checking: 'One moment…',
  asking: 'Continue in the box below.'
} as const;

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
      brand.append('Xtrata ', el('b', '', 'Music'));
      top.append(brand);
      const body = el('div', 'al-body al-body--welcome');
      const box = el('div', 'al-welcome');
      if (input.mode === 'checking') {
        box.append(el('p', 'al-welcome-wait', WELCOME_TEXT.checking));
      } else {
        const t = WELCOME_TEXT[input.mode];
        box.append(el('h1', '', t.title), el('p', '', t.body));
        if (input.mode === 'empty') box.append(el('p', 'al-welcome-note', WELCOME_TEXT.empty.note));
        if (input.status.length) { const s = el('div', 'al-status'); s.setAttribute('role', 'status'); s.append(...input.status); box.append(s); }
        if (input.asking) box.append(el('p', 'al-hint al-hint--ask', WELCOME_TEXT.asking));
        else if (input.mode === 'new' || input.mode === 'back') {
          const w = WELCOME_TEXT[input.mode];
          if (input.canStart) box.append(button('al-primary', w.primary, input.mode === 'new' ? input.start : input.unlock, input.busy), el('p', 'al-hint', w.hint));
          if (input.canStart) box.append(button('al-link', w.returning, input.returning, input.busy));
          box.append(button('al-link', w.full, input.full));
        } else box.append(button('al-primary', WELCOME_TEXT.empty.primary, input.full));
      }
      body.append(box);
      mount.hidden = false;
      mount.replaceChildren(top, body);
    }
  };
}
