/**
 * Dataing OAuth redirect target.  GET /auth/dataing/callback
 *
 * This exact URL goes in the "Exact redirect URIs" field of the Dataing partner
 * console. It answers 200 even before DATAING_* is configured, deliberately: the
 * console validates the URI at registration time, which is long before the
 * business review clears and a client id exists.
 *
 * What happens on a real callback:
 *   1. `state` is compared against the HttpOnly cookie set by /auth/dataing/start.
 *   2. The code is exchanged for a token HERE, on the edge, with the verifier
 *      from the second cookie.
 *   3. The token is stored server-side against an opaque session id, and only
 *      that id is written to the browser.
 *
 * The token is a bearer credential for someone's dating profile. It is never
 * logged, never put in a query string, and never returned in a response body —
 * including on error paths. Keep it that way.
 */
import { run } from '../../lib/db';
import {
  POST_AUTH_PATH,
  REDIRECT_URI,
  STATE_COOKIE,
  VERIFIER_COOKIE,
  clearedFlowCookie,
  dataingConfig,
  randomUrlSafe,
  readCookie,
  sessionCookie,
  timingSafeEqual
} from '../../lib/dataing-oauth';

const DEFAULT_SESSION_SECONDS = 3600;

const page = (title: string, body: string, status: number) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8" />` +
      `<meta name="viewport" content="width=device-width, initial-scale=1" />` +
      `<meta name="robots" content="noindex" />` +
      `<title>${title} · Xtrata</title>` +
      `<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#07090f;color:#e6edf6;` +
      `font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}` +
      `main{max-width:34rem;padding:2rem}h1{font-size:1.25rem;margin:0 0 .75rem}` +
      `p{margin:0 0 .75rem;color:#8b9bb4}a{color:#3ea6ff}</style></head>` +
      `<body><main><h1>${title}</h1>${body}</main></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
  );

export const onRequest: PagesFunction = async ({ request, env }) => {
  if (request.method !== 'GET') {
    return new Response('Method not allowed.', { status: 405 });
  }

  const url = new URL(request.url);
  const config = dataingConfig(env);

  if (!config) {
    return page(
      'Dataing sign-in is not live yet',
      `<p>This endpoint is registered and reachable, but the integration is not ` +
        `switched on for this deployment.</p><p><a href="/">Back to Xtrata</a></p>`,
      200
    );
  }

  // Dataing declined, or the person did. Their error text is not ours to render
  // verbatim, so only the stable code is shown.
  const authError = url.searchParams.get('error');
  if (authError) {
    const safeCode = /^[a-z_]{1,64}$/.test(authError) ? authError : 'unknown_error';
    return page(
      'Sign-in was not completed',
      `<p>Dataing returned <code>${safeCode}</code>.</p><p><a href="${POST_AUTH_PATH}">Back to Xtrata Radio</a></p>`,
      400
    );
  }

  const expectedState = readCookie(request, STATE_COOKIE);
  const providedState = url.searchParams.get('state') ?? '';
  const verifier = readCookie(request, VERIFIER_COOKIE);
  const code = url.searchParams.get('code') ?? '';

  // Cookies are gone on a replayed or forged callback, and on one that simply
  // sat in a tab past FLOW_COOKIE_MAX_AGE. Same answer either way.
  if (!code || !verifier || !timingSafeEqual(expectedState, providedState)) {
    return page(
      'That sign-in link has expired',
      `<p>Start again from Xtrata rather than reusing the link.</p>` +
        `<p><a href="/auth/dataing/start">Try again</a></p>`,
      400
    );
  }

  let token: { access_token?: string; expires_in?: number; scope?: string } | null = null;
  try {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: config.clientId,
        code_verifier: verifier
      })
    });
    // The body may carry the token on success and an error description on
    // failure. Neither is echoed to the browser or to logs.
    token = response.ok ? await response.json() : null;
  } catch {
    token = null;
  }

  if (!token?.access_token) {
    return page(
      'Could not complete sign-in',
      `<p>Dataing did not return a usable session.</p><p><a href="${POST_AUTH_PATH}">Back to Xtrata Radio</a></p>`,
      502
    );
  }

  const sessionId = randomUrlSafe();
  const lifetime = Number.isFinite(token.expires_in) ? Number(token.expires_in) : DEFAULT_SESSION_SECONDS;
  const now = Date.now();

  await run(
    env,
    `INSERT INTO dataing_sessions (session_id, access_token, scope, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [sessionId, token.access_token, token.scope ?? config.scopes, now, now + lifetime * 1000]
  );

  const headers = new Headers({ location: `${POST_AUTH_PATH}?dataing=connected` });
  headers.append('set-cookie', sessionCookie(sessionId, lifetime));
  headers.append('set-cookie', clearedFlowCookie(STATE_COOKIE));
  headers.append('set-cookie', clearedFlowCookie(VERIFIER_COOKIE));
  headers.set('cache-control', 'no-store');
  return new Response(null, { status: 302, headers });
};
