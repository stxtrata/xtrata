/**
 * Host dialogs (connect, payment, score review) live in the Xtrata page, outside an inscription's iframe.
 * When the inscription has taken the browser's real fullscreen (the arcade's fullscreen button), the browser
 * draws only the fullscreen element, so a host dialog opened then is invisible and the app seems to hang.
 * So: leave fullscreen just before a host dialog opens, and go back into it when the dialog closes.
 */
const held = new WeakMap<Document, Element>();

export function leaveFullscreenForDialog(doc: Document): void {
  try {
    const el = doc.fullscreenElement;
    if (!el || held.has(doc)) return;
    held.set(doc, el);
    void Promise.resolve(doc.exitFullscreen()).catch(() => undefined);
  } catch {
    // No fullscreen API here: nothing to do.
  }
}

export function restoreFullscreenAfterDialog(doc: Document): void {
  const el = held.get(doc);
  held.delete(doc);
  if (!el || !el.isConnected || doc.fullscreenElement) return;
  try {
    void Promise.resolve(el.requestFullscreen()).catch(() => undefined); // may be refused without a click: harmless
  } catch {
    // ignore
  }
}
