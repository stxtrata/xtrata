/**
 * Dataing OAuth 2.0 (authorization code + S256 PKCE) — shared helpers.
 *
 * WHY THE TOKEN EXCHANGE HAPPENS HERE AND NOT IN THE BROWSER
 * ----------------------------------------------------------
 * Dataing's developer guidance is explicit that a profile token stays "out of
 * browser bundles, repos, logs, analytics, and shared screenshots" — it is a
 * bearer credential for somebody's dating profile (docs/DATAING-COLLAB.md).
 *
 * Their partner console currently issues PUBLIC PKCE clients, and the textbook
 * public-client flow finishes the exchange in the page. We do not. PKCE needs
 * no client secret, so a Pages Function completes the exchange perfectly well
 * server-side — which keeps the access token on our edge and hands the browser
 * nothing but an opaque session id. No Dataing token is ever exposed to script
 * on xtrata.xyz. Do not "simplify" this into a client-side exchange.
 *
 * Endpoints and scopes are NOT hardcoded. They come from Dataing's setup guide
 * and are unknown until the business review clears, so everything is env-driven
 * and the callback answers 200 while still unconfigured — which is what lets the
 * redirect URI be registered before any of it exists.
 */

export const STATE_COOKIE = 'xt_dataing_state';
export const VERIFIER_COOKIE = 'xt_dataing_verifier';
export const SESSION_COOKIE = 'xt_dataing_session';

/** Cookies are scoped to the flow, so they are not attached to ordinary page loads. */
export const COOKIE_PATH = '/auth/dataing';

/** The authorization request is only valid for as long as a person takes to consent. */
export const FLOW_COOKIE_MAX_AGE_SECONDS = 600;

/**
 * PINNED, not derived from request.origin. Dataing matches redirect URIs
 * exactly and rejects wildcards, so a preview build on *.pages.dev must fail
 * loudly rather than silently send people to an unregistered URL.
 * Must match the "Exact redirect URIs" field in the partner console byte for byte.
 */
export const REDIRECT_URI = 'https://xtrata.xyz/auth/dataing/callback';

/** Where a person lands once the session exists. */
export const POST_AUTH_PATH = '/radio.html';

export interface DataingEnv {
  DATAING_CLIENT_ID?: string;
  DATAING_AUTHORIZE_URL?: string;
  DATAING_TOKEN_URL?: string;
  DATAING_SCOPES?: string;
}

export interface DataingConfig {
  clientId: string;
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string;
}

/**
 * Returns null until every value is set. Partial configuration is treated as no
 * configuration: half a flow that redirects somewhere undefined is worse than a
 * flow that plainly says it is not set up yet.
 */
export function dataingConfig(env: DataingEnv): DataingConfig | null {
  const clientId = env.DATAING_CLIENT_ID?.trim() ?? '';
  const authorizeUrl = env.DATAING_AUTHORIZE_URL?.trim() ?? '';
  const tokenUrl = env.DATAING_TOKEN_URL?.trim() ?? '';
  // openid + profile are what the console shows for the required sign-in
  // capability; ticking wallet/monetization in the console adds to this string.
  const scopes = env.DATAING_SCOPES?.trim() || 'openid profile';
  if (!clientId || !authorizeUrl || !tokenUrl) return null;
  return { clientId, authorizeUrl, tokenUrl, scopes };
}

function base64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** 32 random bytes → 43 base64url chars, the low end of RFC 7636's 43–128. */
export function randomUrlSafe(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

export async function codeChallengeS256(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

export function readCookie(request: Request, name: string): string {
  const cookie = request.headers.get('cookie') ?? '';
  const raw = new RegExp(`(?:^|;\\s*)${name}=([^;]+)`).exec(cookie)?.[1] ?? '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return '';
  }
}

/**
 * Length-independent compare for the state check. `===` on a secret is a
 * timing oracle; this costs nothing and removes the question.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

export function flowCookie(name: string, value: string): string {
  return `${name}=${encodeURIComponent(value)}; Path=${COOKIE_PATH}; Max-Age=${FLOW_COOKIE_MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}

/** SameSite=Lax, not Strict: the browser arrives here on a top-level cross-site redirect from Dataing. */
export function clearedFlowCookie(name: string): string {
  return `${name}=; Path=${COOKIE_PATH}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

export function sessionCookie(sessionId: string, maxAgeSeconds: number): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Lax`;
}
