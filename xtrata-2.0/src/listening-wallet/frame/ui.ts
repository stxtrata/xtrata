/** DOM for the wallet frame. Every approval button lives here, on the wallet origin. */
import { stx } from '../../lib/listening-wallet/policy';
import { CancelledError, type IdleView, type Panel, type UiPort } from './engine';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-4);
const time = (ms: number) => new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** Panels can't be confirmed until they have been on screen this long (clickjacking/keyboard guard). */
export const ARM_DELAY_MS = 800;

/**
 * Where the browser supports IntersectionObserver v2, track whether the frame is actually visible
 * (not covered, transformed or faded by the embedding page). Unsupported browsers report visible.
 */
function visibilityGuard(target: Element) {
  let visible = true;
  try {
    const io = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1] as IntersectionObserverEntry & { isVisible?: boolean };
      if (typeof e.isVisible === 'boolean') visible = e.isVisible;
    }, { threshold: [1.0], trackVisibility: true, delay: 100 } as IntersectionObserverInit);
    io.observe(target);
  } catch { /* v1 only: cannot tell, rely on the arming delay */ }
  return () => visible;
}

export function domUi(local: { stop: () => void; lock: () => void }): UiPort {
  let open = false;
  const isVisible = visibilityGuard($('p-ok'));
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
      const armedAt = performance.now() + ARM_DELAY_MS;
      ok.disabled = true;
      setTimeout(() => { if (open) ok.disabled = false; }, ARM_DELAY_MS);

      return new Promise<T>((resolve, reject) => {
        const close = () => { open = false; $('panel').hidden = true; $('idle').hidden = false; ok.onclick = cancel.onclick = null; };
        // The action starts synchronously inside the click so WebAuthn keeps the user activation.
        ok.onclick = (event) => {
          if (!event.isTrusted || performance.now() < armedAt) return;
          if (!isVisible()) { error.textContent = 'This panel is partly hidden by the page. Scroll it fully into view, then confirm.'; return; }
          ok.disabled = cancel.disabled = true;
          error.textContent = '';
          action().then(
            (value) => { close(); resolve(value); },
            (err: unknown) => {
              const e = err as { retryable?: boolean; message?: string };
              if (e?.retryable) { error.textContent = e.message ?? 'Try again.'; ok.disabled = cancel.disabled = false; return; }
              close(); reject(err);
            }
          );
        };
        cancel.onclick = () => { close(); reject(new CancelledError()); };
      });
    },

    idle(view: IdleView) {
      const lines: string[] = [];
      if (view.state === 'unsupported') lines.push('Passkeys are not available in this browser. Listening stays free.');
      else if (view.state === 'none') lines.push('No listening wallet on this device yet.');
      else if (view.state === 'known') lines.push(`Locked · ${short(view.address!)}`);
      else {
        lines.push(`Unlocked · ${short(view.address!)}`);
        lines.push(view.linked ? `Returns go to your main wallet ${short(view.linked)}` : 'Not linked to a main wallet yet.');
        lines.push(view.session
          ? `Paying as you listen · ${view.session.playsLeft} plays or ${stx(BigInt(view.session.budgetLeft))} STX left · until ${time(view.session.expires)}`
          : 'Not paying. Music plays free.');
      }
      $('idle-lines').replaceChildren(...lines.map((l) => Object.assign(document.createElement('p'), { textContent: l })));
      $('idle-stop').hidden = !view.session;
      $('idle-lock').hidden = view.state !== 'unlocked';
    }
  };
}
