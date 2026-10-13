/**
 * Copy and Share buttons that show what happened: "Copied ✓", "Shared ✓" or "Copy failed" with a
 * green or red flash, for a moment. The panel re-renders often, so the outcome is remembered by key
 * and every rebuilt button shows it until it expires.
 */
const SHOW_MS = 1800;
const outcomes = new Map<string, { label: string; ok: boolean; until: number }>();

/** Copies text; falls back to a hidden textarea where the clipboard API is missing or refused. */
export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* try the old way */ }
  try {
    const area = document.createElement('textarea');
    area.value = text; area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0';
    document.body.append(area); area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch { return false; }
}

/** Opens the device's share sheet; where there is none, copies the link instead. */
export async function shareLink(data: { title: string; text: string; url: string }): Promise<{ label: string; ok: boolean } | null> {
  const nav = navigator as Navigator & { share?: (d: typeof data) => Promise<void> };
  if (nav.share) {
    try { await nav.share(data); return { label: 'Shared ✓', ok: true }; }
    catch (e) { if ((e as Error)?.name === 'AbortError') return null; /* closed the sheet: nothing to say */ }
  }
  return (await copyText(data.url)) ? { label: 'Link copied ✓', ok: true } : { label: 'Copy failed', ok: false };
}

/**
 * A button whose click runs `act` and then shows its outcome. `act` returns the label to show
 * (e.g. "Copied ✓") and whether it worked, or null to show nothing. `changed` re-renders the panel
 * once the outcome has expired.
 */
export function feedbackButton(key: string, label: string, act: () => Promise<{ label: string; ok: boolean } | null>, cls: string, changed: () => void) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.dataset.feedback = key;
  const show = () => {
    const o = outcomes.get(key);
    const live = !!o && o.until > Date.now();
    b.textContent = live ? o!.label : label;
    b.classList.toggle('is-done', live && o!.ok);
    b.classList.toggle('is-failed', live && !o!.ok);
  };
  show();
  b.onclick = async () => {
    const o = await act();
    if (!o) return;
    outcomes.set(key, { ...o, until: Date.now() + SHOW_MS });
    // The button the listener sees right now, even if the panel rebuilt it while the copy ran.
    for (const el of document.querySelectorAll<HTMLButtonElement>('button[data-feedback]')) {
      if (el.dataset.feedback !== key) continue;
      el.textContent = o.label;
      el.classList.remove('is-done', 'is-failed', 'is-pop');
      void el.offsetWidth; // restart the pop
      el.classList.add(o.ok ? 'is-done' : 'is-failed', 'is-pop');
    }
    setTimeout(() => { outcomes.delete(key); changed(); }, SHOW_MS + 50);
  };
  return b;
}

/** A copy button: "Copied ✓" when it worked. */
export const copyButton = (key: string, label: string, text: () => string, cls: string, changed: () => void) =>
  feedbackButton(key, label, async () => ((await copyText(text())) ? { label: 'Copied ✓', ok: true } : { label: 'Copy failed', ok: false }), cls, changed);
