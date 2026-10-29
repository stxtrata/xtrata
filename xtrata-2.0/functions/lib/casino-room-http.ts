/**
 * Shared bits of the three casino room Pages Functions (challenge, session, ws): configuration, the same-origin rule and
 * the one place that reaches the Durable Object. Plan: docs/plans/CASINO-PRESENCE-PLAN.md (P0 spike).
 *
 * Fail-closed and quiet: with no Durable Object binding, no usable secret or the kill switch on, every room endpoint
 * answers 503 "room offline" and the casino pages carry on exactly as before. Setting CASINO_ROOM_DISABLED to "1" (a Pages
 * variable) is the kill switch.
 */
import { jsonResponse } from './utils';
import { secretUsable } from './casino-room-proof';

export type RoomNamespace = {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch(request: Request): Promise<Response> };
};

export type RoomConfig =
  | { ok: true; secret: string; namespace: RoomNamespace }
  | { ok: false; reason: 'disabled' | 'no-binding' | 'no-secret' };

export const roomConfig = (env: Record<string, unknown> | undefined): RoomConfig => {
  const e = env || {};
  if (e.CASINO_ROOM_DISABLED === '1') return { ok: false, reason: 'disabled' };
  const namespace = e.CASINO_ROOM as RoomNamespace | undefined;
  if (!namespace || typeof namespace.idFromName !== 'function' || typeof namespace.get !== 'function') {
    return { ok: false, reason: 'no-binding' };
  }
  const secret = e.CASINO_ROOM_SECRET;
  if (!secretUsable(secret)) return { ok: false, reason: 'no-secret' };
  return { ok: true, secret, namespace };
};

const NO_STORE = { 'Cache-Control': 'no-store' };

export const roomOffline = (reason: string) => jsonResponse({ error: 'The casino room is offline.', reason }, 503, NO_STORE);
export const roomJson = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  jsonResponse(body, status, { ...NO_STORE, ...headers });

/** The room object is a single, named instance. */
export const roomStub = (namespace: RoomNamespace) => namespace.get(namespace.idFromName('main'));

/**
 * Browser requests from our own site only.
 * - POST and WebSocket requests from a page always carry `Origin`, which must equal this request's origin.
 * - A plain same-site GET (the sign-in challenge) carries NO `Origin`; the browser says `Sec-Fetch-Site: same-origin` instead,
 *   which a web page cannot forge. A cross-site page sends `cross-site` (or `same-site`), which is refused.
 * Neither header stops a command-line client from lying; that is fine, because this gate only exists to keep other websites
 * from driving a visitor's browser. Nothing here is a secret: the signature and the session cookie are what prove identity.
 */
export const sameOriginRequest = (request: Request) => {
  const origin = request.headers.get('origin');
  if (origin) {
    try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
  }
  return request.method === 'GET' && request.headers.get('sec-fetch-site') === 'same-origin';
};

/** Single-use sign-in: asks the room object to remember this nonce. False when it has already been used. */
export const burnNonce = async (namespace: RoomNamespace, nonce: string, expires: number) => {
  const response = await roomStub(namespace).fetch(
    new Request('https://room.internal/nonce', { method: 'POST', body: JSON.stringify({ n: nonce, exp: expires }) })
  );
  return response.status === 200;
};
