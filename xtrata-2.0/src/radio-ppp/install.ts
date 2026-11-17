/**
 * "Add to Home Screen": a button at the top of the radio that puts the player on the listener's phone like an app
 * (public/radio/app.webmanifest).
 *
 *   - Android and desktop Chrome/Edge hand the page an install prompt (`beforeinstallprompt`): the button shows it.
 *   - iPhone and iPad give a web page no such thing, so the button opens a short sheet showing the three taps in the
 *     browser's own Share menu.
 *   - Already opened from the home screen, or a browser with neither: no button.
 *
 * It only ever shows the browser's own prompt or these instructions. It stores nothing and touches no money logic.
 */
export type InstallKind = 'prompt' | 'ios' | null;
export interface InstallEnv {
  userAgent: string;
  maxTouchPoints: number;
  /** Opened from the home screen already (display-mode: standalone, or iOS's navigator.standalone). */
  standalone: boolean;
}
export const isIos = (e: Pick<InstallEnv, 'userAgent' | 'maxTouchPoints'>) =>
  /iPhone|iPad|iPod/.test(e.userAgent) || (/Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1); // an iPad says it is a Mac
/** Which kind of help this visitor gets: the browser's prompt (once it has offered one), the iPhone steps, or none. */
export function installKind(e: InstallEnv, promptReady: boolean): InstallKind {
  if (e.standalone) return null;
  if (promptReady) return 'prompt';
  return isIos(e) ? 'ios' : null;
}
export const INSTALL_TEXT = {
  label: 'Add to Home Screen',
  title: 'Keep it on your phone',
  body: 'One tap to your player, like an app.',
  steps: ['Tap Share', 'Add to Home Screen', 'Tap Add'],
  close: 'Not now'
} as const;

const el = (tag: string, cls = '', text = '') => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
const svg = (path: string) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 26 26'); s.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', path); s.append(p); return s; };
const ICONS = ['M13 16V4M8.5 8L13 3.5 17.5 8M6 12v9h14v-9', 'M9 4h8a5 5 0 015 5v8a5 5 0 01-5 5H9a5 5 0 01-5-5V9a5 5 0 015-5zM13 9v8M9 13h8', 'M6 13.5l4.5 4.5L20 8.5'];

/** The iPhone sheet: the icon, one line, three numbered taps. */
export function installSheet(icon: string, close: () => void): HTMLElement {
  const sheet = el('div', 'a2hs-sheet');
  sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', INSTALL_TEXT.title);
  const card = el('div', 'a2hs-card');
  const head = el('div', 'a2hs-head');
  const img = el('img', 'a2hs-icon') as HTMLImageElement; img.src = icon; img.alt = '';
  const t = el('div'); t.append(el('h2', '', INSTALL_TEXT.title), el('p', '', INSTALL_TEXT.body));
  head.append(img, t);
  const list = el('ol', 'a2hs-steps');
  INSTALL_TEXT.steps.forEach((text, i) => { const li = el('li'); li.append(el('i', '', String(i + 1)), el('span', '', text), svg(ICONS[i])); list.append(li); });
  const no = el('button', 'a2hs-close', INSTALL_TEXT.close) as HTMLButtonElement; no.type = 'button'; no.onclick = close;
  card.append(head, list, no);
  sheet.append(card);
  sheet.onclick = (e) => { if (e.target === sheet) close(); };
  return sheet;
}

export interface InstallDeps {
  button: HTMLButtonElement;
  env(): InstallEnv;
  icon: string;
  /** Where the sheet goes (document.body). */
  mount: HTMLElement;
  /** The window, for the browser's install events. */
  target: Pick<Window, 'addEventListener'>;
}
export function createInstall(deps: InstallDeps) {
  let prompt: { prompt(): Promise<unknown> | void } | null = null;
  let sheet: HTMLElement | null = null, done = false;
  const close = () => { sheet?.remove(); sheet = null; deps.button.focus(); };
  const sync = () => {
    const kind = done ? null : installKind(deps.env(), !!prompt);
    deps.button.hidden = !kind;
    deps.button.dataset.kind = kind ?? '';
  };
  deps.button.setAttribute('aria-label', INSTALL_TEXT.label);
  deps.button.title = INSTALL_TEXT.label;
  deps.button.onclick = () => {
    const kind = installKind(deps.env(), !!prompt);
    if (kind === 'prompt' && prompt) { const p = prompt; prompt = null; try { void p.prompt(); } catch { /* the browser withdrew it */ } sync(); return; }
    if (kind === 'ios' && !sheet) { sheet = installSheet(deps.icon, close); deps.mount.append(sheet); (sheet.querySelector('.a2hs-close') as HTMLElement | null)?.focus(); }
  };
  deps.target.addEventListener('beforeinstallprompt', (e: Event) => { e.preventDefault(); prompt = e as unknown as { prompt(): Promise<unknown> }; sync(); });
  deps.target.addEventListener('appinstalled', () => { done = true; prompt = null; close(); sync(); });
  sync();
  return { sync, kind: () => (done ? null : installKind(deps.env(), !!prompt)) };
}
