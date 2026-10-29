/**
 * Casino room sign-in, step 1.  GET /casino/room/challenge?address=SP...
 *
 * Returns a short-lived challenge for that address. The page builds the SIP-018 message from it (roomProofData), the wallet
 * signs it (free, not a transaction), and step 2 (session.ts) exchanges the signature for a 4 hour session.
 * Stateless: the challenge carries an HMAC, so nothing is stored. Plan: docs/plans/CASINO-PRESENCE-PLAN.md (P0 spike).
 */
import { issueRoomChallenge } from '../../lib/casino-room-proof';
import { roomConfig, roomJson, roomOffline, sameOriginRequest } from '../../lib/casino-room-http';

export const onRequest: PagesFunction = async ({ request, env }) => {
  if (request.method !== 'GET') return roomJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const config = roomConfig(env);
  if (!config.ok) return roomOffline(config.reason);
  if (!sameOriginRequest(request)) return roomJson({ error: 'Not allowed from here.' }, 403);
  const address = new URL(request.url).searchParams.get('address') || '';
  try {
    return roomJson({ challenge: issueRoomChallenge(config.secret, address) });
  } catch (error) {
    return roomJson({ error: error instanceof Error ? error.message : 'Invalid address.' }, 400);
  }
};
