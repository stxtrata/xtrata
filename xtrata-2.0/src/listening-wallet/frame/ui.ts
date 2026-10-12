/** DOM for the wallet frame. Every approval button lives here, on the wallet origin. */
import { CancelledError, type IdleView, type Panel, type UiPort } from './engine';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-4);

/** Panels can't be confirmed until they have been on screen this long (clickjacking/keyboard guard). */
export const ARM_DELAY_MS = 800;

/**
 * Where the browser supports IntersectionObserver v2, track whether the frame is actually visible
 * (not covered, transformed or faded by the embedding page). Unsupported browsers report visible.
 */
function visibilityGuard(target: Element) {
  let visible = true;
  let since = -Infinity; // when it last became fully visible
  try {
    const io = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1] as IntersectionObserverEntry & { isVisible?: boolean };
      if (typeof e.isVisible !== 'boolean') return;
      if (e.isVisible && !visible) since = performance.now();
      visible = e.isVisible;
    }, { threshold: [1.0], trackVisibility: true, delay: 100 } as IntersectionObserverInit);
    io.observe(target);
    // Only browsers with IntersectionObserver v2 report occlusion; elsewhere the arming delay alone applies.
    if (typeof IntersectionObserverEntry !== 'undefined' && 'isVisible' in IntersectionObserverEntry.prototype) visible = false;
  } catch { /* v1 only: cannot tell, rely on the arming delay */ }
  return {
    isVisible: () => visible,
    /** Fully visible, and has been for `ms` (the page may have just moved or resized the frame). */
    steady: (ms: number) => visible && performance.now() - since >= ms
  };
}

export function domUi(local: { stop: () => void; lock: () => void }): UiPort {
  let open = false;
  let withdraw: (() => boolean) | null = null;
  const guard = visibilityGuard($('p-ok'));
  $('idle-stop').addEventListener('click', local.stop);
  $('idle-lock').addEventListener('click', local.lock);

  return {
    act<T>(panel: Panel, action: () => Promise<T>): Promise<T> {
      if (open) return Promise.reject(new Error('The listening wallet is already waiting for you.'));
      open = true;
      const ok = $<HTMLButtonElement>('p-ok'), cancel = $<HTMLButtonElement>('p-cancel'), error = $('p-error');
      $('p-title').textContent = panel.title;
      $('p-lines').replaceChildren(...panel.lines.map((l) => Object.assign(document.createElement('p'), { textContent: l })));
      $('p-warn').replaceChildren(...(panel.warnings ?? []).map((w) => Object.assign(document.createElement('li'), { textContent: w })));
      $('p-warn').hidden = !panel.warnings?.length;
      ok.textContent = panel.confirmLabel;
      error.textContent = '';
      ok.disabled = cancel.disabled = false;
      $('panel').hidden = false;
      $('idle').hidden = true;
      // No autofocus: a stray Enter/Space aimed at the radio must not approve anything.
      // Confirm stays disabled until the panel has been up, and fully visible, for the arming delay,
      // so it never invites a tap it would then refuse (e.g. while the page moves the frame).
      const armedAt = performance.now() + ARM_DELAY_MS;
      ok.disabled = true;
      let running = false;
      const ready = () => performance.now() >= armedAt && guard.steady(ARM_DELAY_MS);
      const arming = setInterval(() => {
        if (!open) { clearInterval(arming); return; }
        if (!running) ok.disabled = !ready();
      }, 100);

      return new Promise<T>((resolve, reject) => {
        const close = () => { open = false; withdraw = null; clearInterval(arming); $('panel').hidden = true; $('idle').hidden = false; ok.onclick = cancel.onclick = null; };
        withdraw = () => { if (running) return false; close(); reject(new CancelledError()); return true; };
        // The action starts synchronously inside the click so WebAuthn keeps the user activation.
        ok.onclick = (event) => {
          if (!event.isTrusted || performance.now() < armedAt) return;
          if (!guard.isVisible()) { error.textContent = 'This panel is partly hidden by the page. Scroll it fully into view, then confirm.'; return; }
          if (!guard.steady(ARM_DELAY_MS)) return; // just moved into view: the button re-enables shortly
          ok.disabled = cancel.disabled = true;
          error.textContent = '';
          running = true;
          action().then(
            (value) => { close(); resolve(value); },
            (err: unknown) => {
              const e = err as { retryable?: boolean; message?: string };
              if (e?.retryable) { running = false; error.textContent = e.message ?? 'Try again.'; ok.disabled = cancel.disabled = false; return; }
              close(); reject(err);
            }
          );
        };
        cancel.onclick = () => { close(); reject(new CancelledError()); };
      });
    },

    cancel() { return withdraw ? withdraw() : false; },

    idle(view: IdleView) {
      const lines: string[] = [];
      if (view.state === 'unsupported') lines.push('Passkeys are not available in this browser. Listening stays free.');
      else if (view.state === 'none') lines.push('No listening wallet on this device yet.');
      else if (view.state === 'known') lines.push(`Locked · ${short(view.address!)}`);
      else {
        lines.push(`Unlocked · ${short(view.address!)}`);
        lines.push(view.linked ? `Returns go to your main wallet ${short(view.linked)}` : 'Not linked to a main wallet yet.');
        lines.push(view.session
          ? `Paying as you listen · up to ${view.session.playsLeft.toLocaleString()} more plays remaining`
          : 'Not paying. Music plays free.');
      }
      $('idle-lines').replaceChildren(...lines.map((l) => Object.assign(document.createElement('p'), { textContent: l })));
      $('idle-stop').hidden = !view.session;
      $('idle-lock').hidden = view.state !== 'unlocked';
    }
  };
}
