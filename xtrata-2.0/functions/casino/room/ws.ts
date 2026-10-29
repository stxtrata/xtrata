/**
 * Casino room WebSocket.  GET /casino/room/ws  (Upgrade: websocket)
 *
 * Checks the Origin and the session cookie (a guest has none and may only watch), then forwards the connection to the room's
 * Durable Object with the signed-in address in a header only this function can set: every x-px-* header a browser sends is
 * dropped first. Plan: docs/plans/CASINO-PRESENCE-PLAN.md (P0 spike).
 */
import { readRoomSession } from '../../lib/casino-room-proof';
import { roomConfig, roomJson, roomOffline, roomStub, sameOriginRequest } from '../../lib/casino-room-http';

export const onRequest: PagesFunction = async ({ request, env }) => {
  const config = roomConfig(env);
  if (!config.ok) return roomOffline(config.reason);
  if (request.method !== 'GET') return roomJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  if ((request.headers.get('Upgrade') || '').toLowerCase() !== 'websocket') {
    return roomJson({ error: 'Expected a WebSocket.' }, 426, { Upgrade: 'websocket' });
  }
  if (!sameOriginRequest(request)) return roomJson({ error: 'Not allowed from here.' }, 403);

  const session = readRoomSession(config.secret, request);
  const headers = new Headers();
  for (const name of ['upgrade', 'connection', 'sec-websocket-key', 'sec-websocket-version', 'sec-websocket-protocol', 'sec-websocket-extensions']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (session) {
    headers.set('x-px-addr', session.a);
    headers.set('x-px-k', session.k);
  }
  try {
    const url = new URL(request.url);
    return await roomStub(config.namespace).fetch(new Request(`https://room.internal${url.pathname}`, { method: 'GET', headers }));
  } catch {
    return roomOffline('room-unreachable');
  }
};
