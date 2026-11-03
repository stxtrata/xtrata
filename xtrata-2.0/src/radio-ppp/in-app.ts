/**
 * Apps' built-in browsers. A link tapped inside Instagram, Facebook, X, TikTok and others opens in that app's own
 * web view, where passkeys are unreliable: creating or using one may simply fail, so a listening wallet cannot be
 * made there. These views add their app's name to the user agent. Apps that hand links to Safari's own view
 * (Messages, Mail and others) keep Safari's user agent and behave like Safari, so they are not matched here.
 *
 * Tokens from Corbado, "Passkeys in in-app browsers" (2026); heuristic, review as apps change. Meta's own apps are
 * checked before the generic Facebook tokens they share.
 */
const APPS: [name: string, pattern: RegExp][] = [
  ['Instagram', /Instagram/],
  ['Threads', /Barcelona/],
  ['Messenger', /Messenger|FB_IAB\/MESSENGER/i],
  ['Facebook', /FBAN|FBAV|FB_IAB|FBIOS|FB4A/],
  ['X', /Twitter/],
  ['TikTok', /BytedanceWebview|musical_ly|TikTok|aweme|Trill/],
  ['LinkedIn', /LinkedInApp/],
  ['Snapchat', /Snapchat/],
  ['Telegram', /Telegram/],
  ['WhatsApp', /WhatsApp/],
  ['LINE', /\bLine\//],
  ['WeChat', /MicroMessenger/],
  ['Discord', /Discord/],
  ['the Google app', /\bGSA\//]
];

/** The app whose built-in browser this is, or null for a normal browser. */
export function inAppBrowser(ua: string): string | null {
  for (const [name, pattern] of APPS) if (pattern.test(ua)) return name;
  return null;
}

const isIos = (ua: string) => /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && /Mobile\//.test(ua));
const isAndroid = (ua: string) => /Android/.test(ua);

/**
 * A link that asks the phone to open `url` in its real browser: Safari on iPhone (`x-safari-https:`), Chrome on
 * Android (an intent, falling back to the page itself). Best effort: some apps ignore it, so "Copy link" is always
 * offered beside it. Null where there is no such link (desktop).
 */
export function openInBrowserHref(url: string, ua: string): string | null {
  const u = new URL(url);
  if (u.protocol !== 'https:') return null;
  if (isIos(ua)) return 'x-safari-' + u.href;
  if (isAndroid(ua))
    return `intent://${u.host}${u.pathname}${u.search}${u.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(u.href)};end`;
  return null;
}

/** What the listener's real browser is called, for the button. */
export const browserName = (ua: string) => (isIos(ua) ? 'Safari' : isAndroid(ua) ? 'Chrome' : 'your browser');
