/**
 * Casino room sign-in, step 2 and the session itself.  /casino/room/session
 *
 *   POST   { challenge, signature }  verify the wallet signature, burn the nonce (single use), set the session cookie
 *   GET                              who am I? { address: string | null, expiresAt }
 *   DELETE                           sign out (clears the cookie)
 *
 * The cookie is HttpOnly, SameSite=Strict, scoped to /casino/room, valid for 4 hours. It proves control of an address only;
 * it grants no spending permission and is never used for anything but the room. Plan: docs/plans/CASINO-PRESENCE-PLAN.md.
 */
import {
  ROOM_SESSION_TTL_MS,
  clearRoomSessionCookie,
  readRoomSession,
  roomSessionCookie,
  signRoomSession,
  validateRoomChallenge,
  verifyRoomProof
} from '../../lib/casino-room-proof';
import { burnNonce, roomConfig, roomJson, roomOffline, sameOriginRequest } from '../../lib/casino-room-http';
import { primaryNameOf } from '../../lib/casino-room-bns';

const MAX_BODY_BYTES = 4096;

export const onRequest: PagesFunction = async ({ request, env }) => {
  const config = roomConfig(env);
  if (!config.ok) return roomOffline(config.reason);
  if (!sameOriginRequest(request) && request.method !== 'GET') return roomJson({ error: 'Not allowed from here.' }, 403);

  if (request.method === 'GET') {
    const session = readRoomSession(config.secret, request);
    return roomJson(session
      ? { address: session.a, hash160: session.k, expiresAt: session.exp, bns: session.bn ?? null, bnsChecked: session.bc === true }
      : { address: null, expiresAt: null });
  }

  if (request.method === 'DELETE') {
    return roomJson({ ok: true }, 200, { 'Set-Cookie': clearRoomSessionCookie(request) });
  }

  if (request.method !== 'POST') return roomJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST, DELETE' });

  let body: { challenge?: unknown; signature?: unknown };
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return roomJson({ error: 'Request too large.' }, 413);
    body = JSON.parse(text);
  } catch {
    return roomJson({ error: 'Invalid request.' }, 400);
  }

  const now = Date.now();
  let challenge;
  try {
    challenge = validateRoomChallenge(config.secret, body.challenge, now);
  } catch (error) {
    return roomJson({ error: error instanceof Error ? error.message : 'Invalid sign-in request.' }, 400);
  }

  const proof = verifyRoomProof(challenge, body.signature);
  if (!proof) return roomJson({ error: 'That signature does not match this address. Nothing changed.' }, 401);

  let fresh = false;
  try {
    fresh = await burnNonce(config.namespace, challenge.nonce, challenge.expires);
  } catch {
    return roomOffline('room-unreachable');
  }
  if (!fresh) return roomJson({ error: 'This sign-in request was already used. Start again.' }, 409);

  // The Salon's rule (docs/plans/CASINO-SALON-BNS-PLAN.md): read the player's primary BNS name once, now. A failed read is kept
  // as "not checked" (the Salon then offers "try again"), never as "no name".
  const bns = await primaryNameOf(proof.address, env as Record<string, unknown>);
  const token = signRoomSession(config.secret, {
    a: proof.address, k: proof.hash160, n: challenge.nonce, iat: now, exp: now + ROOM_SESSION_TTL_MS, bn: bns.name, bc: bns.checked
  });
  return roomJson(
    { address: proof.address, hash160: proof.hash160, network: challenge.network, expiresAt: now + ROOM_SESSION_TTL_MS, bns: bns.name, bnsChecked: bns.checked },
    200,
    { 'Set-Cookie': roomSessionCookie(token, request) }
  );
};
