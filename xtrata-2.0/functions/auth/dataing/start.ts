/**
 * Begin Dataing sign-in.  GET /auth/dataing/start
 *
 * Mints the PKCE verifier and the CSRF state, parks both in HttpOnly cookies
 * that only this flow's path can see, and bounces the person to Dataing's
 * consent screen. The verifier never reaches page script, which is the whole
 * point — see functions/lib/dataing-oauth.ts for why the exchange is server-side.
 *
 * Configure before this does anything (Workers & Pages -> xtrata -> Settings ->
 * Variables and Secrets, for BOTH Production and Preview, as with every other
 * secret in this project):
 *
 *   DATAING_CLIENT_ID       issued by the partner console once the business review clears
 *   DATAING_AUTHORIZE_URL   from Dataing's setup guide — NOT guessed
 *   DATAING_TOKEN_URL       from Dataing's setup guide — NOT guessed
 *   DATAING_SCOPES          optional; defaults to "openid profile"
 */
import {
  REDIRECT_URI,
  STATE_COOKIE,
  VERIFIER_COOKIE,
  codeChallengeS256,
  dataingConfig,
  flowCookie,
  randomUrlSafe
} from '../../lib/dataing-oauth';

export const onRequest: PagesFunction = async ({ request, env }) => {
  if (request.method !== 'GET') {
    return new Response('Method not allowed.', { status: 405 });
  }

  const config = dataingConfig(env);
  if (!config) {
    // 503, not 500: this is "not switched on yet", and it should read that way
    // in logs rather than looking like a fault.
    return new Response(
      'Dataing sign-in is not configured on this deployment yet.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } }
    );
  }

  const state = randomUrlSafe();
  const verifier = randomUrlSafe();
  const challenge = await codeChallengeS256(verifier);

  const authorize = new URL(config.authorizeUrl);
  authorize.searchParams.set('response_type', 'code');
  authorize.searchParams.set('client_id', config.clientId);
  authorize.searchParams.set('redirect_uri', REDIRECT_URI);
  authorize.searchParams.set('scope', config.scopes);
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('code_challenge', challenge);
  authorize.searchParams.set('code_challenge_method', 'S256');

  const headers = new Headers({ location: authorize.toString() });
  headers.append('set-cookie', flowCookie(STATE_COOKIE, state));
  headers.append('set-cookie', flowCookie(VERIFIER_COOKIE, verifier));
  // An authorization request must never be replayed out of a cache.
  headers.set('cache-control', 'no-store');
  return new Response(null, { status: 302, headers });
};
