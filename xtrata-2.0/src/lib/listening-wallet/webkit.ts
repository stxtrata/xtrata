/**
 * WebKit (Safari, and every browser on iPhone and iPad, which must use WebKit) refuses to CREATE a passkey inside
 * a cross-origin frame, even with permission and a tap: the request fails at once with no system prompt. It does
 * allow signing in there. Seen on iOS 26 Safari and Chrome, 13 Oct 2026.
 */
export function webkitOnly(ua: string) {
  if (/(CriOS|FxiOS|EdgiOS|OPiOS)\//.test(ua) || /iP(hone|ad|od)/.test(ua)) return true;
  return /AppleWebKit\//.test(ua) && /Safari\//.test(ua) && !/(Chrome|Chromium|Edg|OPR|Firefox)\//.test(ua);
}
