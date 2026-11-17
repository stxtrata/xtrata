/**
 * "Add to Home Screen": a button at the top of the radio that puts the player on the listener's phone like an app
 * (public/radio/app.webmanifest).
 *
 *   - Android and desktop Chrome/Edge hand the page an install prompt (`beforeinstallprompt`): the button shows it.
 *   - iPhone and iPad give a web page no such thing (a page cannot open the browser's menu or add itself), so the
 *     button shows where to tap: the steps for THIS browser, as plain numbered lines that do not look like buttons, with
 *     an arrow pointing at the browser's own control.
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
  title: 'Add it to your Home Screen',
  body: 'Your phone only lets you do this from its own menu. It takes a few taps:',
  close: 'Got it'
} as const;

/** Which iPhone browser this is, since each keeps Share somewhere else. */
export type IosBrowser = 'safari-dots' | 'safari' | 'other';
export function iosBrowser(userAgent: string): IosBrowser {
  if (/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(userAgent)) return 'other';
  // Safari 26 moved Share inside the "..." button at the bottom right; before that Share had its own button.
  const v = Number(/Version\/(\d+)/.exec(userAgent)?.[1] ?? 0);
  return v >= 26 ? 'safari-dots' : 'safari';
}
/** The taps, in order, for that browser. `where` is the side of the screen the first control is on, for the arrow. */
export function installSteps(browser: IosBrowser): { steps: string[]; where: 'bottom-right' | 'bottom' | 'top-right' } {
  if (browser === 'safari-dots') return { steps: ['Tap ••• at the bottom right of your screen', 'Tap Share', 'Scroll down and tap “Add to Home Screen”', 'Tap Add'], where: 'bottom-right' };
  if (browser === 'safari') return { steps: ['Tap the Share button at the bottom of your screen (a square with an arrow)', 'Scroll down and tap “Add to Home Screen”', 'Tap Add'], where: 'bottom' };
  return { steps: ['Tap the Share button beside the address bar (a square with an arrow)', 'Tap “Add to Home Screen”', 'Tap Add'], where: 'top-right' };
}

const el = (tag: string, cls = '', text = '') => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
const svg = (path: string) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 26 26'); s.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', path); s.append(p); return s; };
/**
 * The iPhone sheet. It sits at the TOP of the screen so the browser's own bar at the bottom stays in view, with an
 * arrow at the edge pointing to the control to tap first. The steps are plain numbered lines: nothing in the sheet
 * but "Got it" can be tapped, and nothing looks as if it could.
 */
export function installSheet(icon: string, close: () => void, browser: IosBrowser = 'safari'): HTMLElement {
  const plan = installSteps(browser);
  const sheet = el('div', 'a2hs-sheet a2hs-sheet--' + plan.where);
  sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', INSTALL_TEXT.title);
  const card = el('div', 'a2hs-card');
  const head = el('div', 'a2hs-head');
  const img = el('img', 'a2hs-icon') as HTMLImageElement; img.src = icon; img.alt = '';
  const t = el('div'); t.append(el('h2', '', INSTALL_TEXT.title), el('p', '', INSTALL_TEXT.body));
  head.append(img, t);
  const list = el('ol', 'a2hs-steps');
  plan.steps.forEach((text, i) => { const li = el('li'); li.append(el('i', '', String(i + 1)), el('span', '', text)); list.append(li); });
  const arrow = el('div', 'a2hs-arrow'); arrow.setAttribute('aria-hidden', 'true'); arrow.append(svg(plan.where === 'top-right' ? 'M13 22V5M6 12l7-7 7 7' : 'M13 4v17M6 14l7 7 7-7'));
  const no = el('button', 'a2hs-close', INSTALL_TEXT.close) as HTMLButtonElement; no.type = 'button'; no.onclick = close;
  card.append(head, list, no);
  sheet.append(card, arrow);
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
    if (kind === 'ios' && !sheet) { sheet = installSheet(deps.icon, close, iosBrowser(deps.env().userAgent)); deps.mount.append(sheet); (sheet.querySelector('.a2hs-close') as HTMLElement | null)?.focus(); }
  };
  deps.target.addEventListener('beforeinstallprompt', (e: Event) => { e.preventDefault(); prompt = e as unknown as { prompt(): Promise<unknown> }; sync(); });
  deps.target.addEventListener('appinstalled', () => { done = true; prompt = null; close(); sync(); });
  sync();
  return { sync, kind: () => (done ? null : installKind(deps.env(), !!prompt)) };
}
