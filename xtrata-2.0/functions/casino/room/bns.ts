/**
 * Casino room: check my BNS name again.  POST /casino/room/bns
 *
 * For a signed-in player who has just registered or set a primary BNS name, or whose check at sign-in failed. Reads the name
 * again (no new wallet signature), renews the session cookie with the answer, and returns { bns, bnsChecked }. The page then
 * reconnects so the room sees the new answer. "No name" answers are remembered for 30 seconds, which also stops this being
 * used to hammer the BNS API. Plan: docs/plans/CASINO-SALON-BNS-PLAN.md.
 */
import { readRoomSession, roomSessionCookie, signRoomSession } from '../../lib/casino-room-proof';
import { roomConfig, roomJson, roomOffline, sameOriginRequest } from '../../lib/casino-room-http';
import { primaryNameOf } from '../../lib/casino-room-bns';

export const onRequest: PagesFunction = async ({ request, env }) => {
  const config = roomConfig(env);
  if (!config.ok) return roomOffline(config.reason);
  if (request.method !== 'POST') return roomJson({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (!sameOriginRequest(request)) return roomJson({ error: 'Not allowed from here.' }, 403);
  const session = readRoomSession(config.secret, request);
  if (!session) return roomJson({ error: 'Join the room first.' }, 401);
  const read = await primaryNameOf(session.a, env as Record<string, unknown>);
  // A failed re-check never throws away an answer the player already has: it only says this check did not work.
  const bns = !read.checked && session.bc === true ? { name: session.bn ?? null, checked: true } : read;
  const token = signRoomSession(config.secret, { ...session, bn: bns.name, bc: bns.checked });
  const maxAge = Math.max(1, Math.floor((session.exp - Date.now()) / 1000));
  return roomJson(
    { address: session.a, bns: bns.name, bnsChecked: bns.checked, expiresAt: session.exp, failed: !read.checked },
    200,
    { 'Set-Cookie': roomSessionCookie(token, request, maxAge) }
  );
};
