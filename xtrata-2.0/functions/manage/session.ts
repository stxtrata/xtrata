import { jsonResponse } from '../lib/utils';
import {
  clearSessionCookie,
  completeCreatorSignIn,
  createCreatorChallenge,
  creatorAuthMode,
  isCreatorAllowlisted,
  readCreatorSession,
  revokeCreatorSession,
  sessionCookie
} from '../lib/creator-auth';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

/**
 * Collection studio sign-in.
 *   GET                         → { signedIn, address?, admin?, allowlisted?, expiresAt?, mode }
 *   POST { action:'challenge', address } → { challenge }   (wallet signs it; no transaction)
 *   POST { action:'verify', id, signature } → sets the 7-day HttpOnly session cookie
 *   DELETE                      → sign out (revokes the session and clears the cookie)
 */
export const onRequest: PagesFunction = async ({ request, env }) => {
  const mode = creatorAuthMode(env);
  try {
    if (request.method === 'GET') {
      const { session, ok } = await readCreatorSession(request, env);
      if (!ok) return jsonResponse({ signedIn: false, available: false, mode }, 200, NO_STORE);
      if (!session) return jsonResponse({ signedIn: false, available: true, mode }, 200, NO_STORE);
      const allow = await isCreatorAllowlisted(env, session.address);
      return jsonResponse({ signedIn: true, available: true, mode, address: session.address, admin: session.admin,
        allowlisted: allow.allowed, allowlistChecked: allow.checked, expiresAt: session.expiresAt }, 200, NO_STORE);
    }
    if (request.method === 'DELETE') {
      await revokeCreatorSession(request, env);
      return jsonResponse({ signedIn: false }, 200, { ...NO_STORE, 'Set-Cookie': clearSessionCookie(request) });
    }
    if (request.method === 'POST') {
      const payload = (await request.json()) as Record<string, unknown>;
      if (payload.action === 'challenge') {
        const challenge = await createCreatorChallenge(env, String(payload.address ?? ''));
        return jsonResponse({ challenge }, 200, NO_STORE);
      }
      if (payload.action === 'verify') {
        const result = await completeCreatorSignIn(env, String(payload.id ?? ''), payload.signature);
        return jsonResponse({ signedIn: true, address: result.address, expiresAt: result.expiresAt }, 200,
          { ...NO_STORE, 'Set-Cookie': sessionCookie(result.token, request) });
      }
      return jsonResponse({ error: 'Unsupported action.' }, 400, NO_STORE);
    }
    return jsonResponse({ error: 'Method not allowed' }, 405, NO_STORE);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : 'Sign-in failed.' }, 400, NO_STORE);
  }
};
