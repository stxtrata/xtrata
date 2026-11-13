/**
 * Casino room: put my inscriptions on my cube's screens.  POST /casino/room/screens   { sc: "b12,l340" }   ("" clears them)
 *
 * For a signed-in player (docs/plans/CASINO-CHARACTER-PLAN.md, "Programmable screens"). Checks on the chain that the mainnet
 * twin of the signed-in address holds every inscription named (functions/lib/casino-room-screens.ts), and only then tells the
 * room, which keeps the string in the player's profile and passes it to everyone there. Answers:
 *
 *   200 { ok: true, sc }                       saved (sc in its canonical form)
 *   400 { error: 'screens-bad' }               not a screens string
 *   401                                        not signed in
 *   409 { error: 'screens-not-yours', ids }    the wallet does not hold these
 *   429 { error: 'screens-too-fast' }          asked again within 3 seconds (each ask can be six reads of the chain)
 *   503 { error: 'screens-could-not-check' }   the chain could not be read just now: nothing was changed
 *   503 { error: 'screens-off' }               switched off (Pages variable CASINO_SCREENS_DISABLED = "1")
 *
 * The holder's page asks again about once a day while they play, so screens follow a sale or a transfer.
 */
import { readRoomSession } from '../../lib/casino-room-proof';
import { roomConfig, roomJson, roomOffline, roomStub, sameOriginRequest } from '../../lib/casino-room-http';
import { checkScreens } from '../../lib/casino-room-screens';

// One ask per player every few seconds, so this cannot be used to hammer the chain API. Kept per running copy of the Function,
// which is enough for a brake (the session it needs is itself rate-limited by a wallet signature).
const MIN_GAP_MS = 3_000;
const lastAsk = new Map<string, number>();

export const onRequest: PagesFunction = async ({ request, env }) => {
  const config = roomConfig(env);
  if (!config.ok) return roomOffline(config.reason);
  if (request.method !== 'POST') return roomJson({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  if (!sameOriginRequest(request)) return roomJson({ error: 'Not allowed from here.' }, 403);
  const session = readRoomSession(config.secret, request);
  if (!session) return roomJson({ error: 'Join the room first.' }, 401);
  let body: { sc?: unknown };
  try { body = (await request.json()) as { sc?: unknown }; } catch { return roomJson({ error: 'screens-bad' }, 400); }
  const now = Date.now(), last = lastAsk.get(session.a) ?? 0;
  if (now - last < MIN_GAP_MS) return roomJson({ error: 'screens-too-fast' }, 429, { 'Retry-After': '3' });
  if (lastAsk.size > 2_000) lastAsk.clear();
  lastAsk.set(session.a, now);
  const check = await checkScreens(session.a, body?.sc ?? '', env as Record<string, unknown>);
  if (!check.ok) {
    const status = check.code === 'screens-bad' ? 400 : check.code === 'screens-not-yours' ? 409 : 503;
    return roomJson({ error: check.code, ids: 'ids' in check ? check.ids : undefined }, status);
  }
  try {
    const res = await roomStub(config.namespace).fetch(new Request('https://room.internal/screens', {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-px-addr': session.a, 'x-px-k': session.k }, body: JSON.stringify({ sc: check.sc })
    }));
    if (!res.ok) return roomJson({ error: 'screens-room-refused' }, 502);
    return roomJson({ ok: true, sc: check.sc });
  } catch {
    return roomOffline('room-unreachable');
  }
};
