/**
 * Casino room usage.  GET /casino/room/stats
 *
 * The room's anonymous day counters (UTC days, newest first): connections, players who signed in (new and returning), the most
 * connections at once, chat lines, reactions, big wins, shared-round bets, drinks given, daily drops and Salon relay messages.
 * No address, name or message is kept or returned (functions/lib/casino-social.ts, COUNTERS). Used to judge whether the social
 * features bring people back (docs/plans/CASINO-PLAY-TOGETHER-PLAN.md, the check after phase 1).
 */
import { roomConfig, roomJson, roomOffline, roomStub } from '../../lib/casino-room-http';

export const onRequest: PagesFunction = async ({ request, env }) => {
  const config = roomConfig(env);
  if (!config.ok) return roomOffline(config.reason);
  if (request.method !== 'GET') return roomJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  try {
    const res = await roomStub(config.namespace).fetch(new Request('https://room.internal/stats', { method: 'GET' }));
    return roomJson(await res.json(), res.ok ? 200 : 502, { 'cache-control': 'no-store' });
  } catch {
    return roomOffline('room-unreachable');
  }
};
