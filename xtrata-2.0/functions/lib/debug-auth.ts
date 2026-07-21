export const DEBUG_COOKIE_NAME = 'xt_debug_key';
export const DEBUG_KEY_MIN_LENGTH = 24;

export function configuredDebugKey(env: { DEBUG_VIEW_KEY?: string }): string | null {
  const key = env.DEBUG_VIEW_KEY?.trim() ?? '';
  return key.length >= DEBUG_KEY_MIN_LENGTH ? key : null;
}

function cookieValue(request: Request): string {
  const cookie = request.headers.get('cookie') ?? '';
  const raw = new RegExp(`(?:^|;\\s*)${DEBUG_COOKIE_NAME}=([^;]+)`).exec(cookie)?.[1] ?? '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return '';
  }
}

export function hasDebugAccess(request: Request, expectedKey: string): boolean {
  const provided = request.headers.get('x-debug-key') ?? cookieValue(request);
  return provided === expectedKey;
}

export function debugAccessCookie(key: string): string {
  return `${DEBUG_COOKIE_NAME}=${encodeURIComponent(key)}; Path=/debug; Max-Age=28800; HttpOnly; Secure; SameSite=Strict`;
}
