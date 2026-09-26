import { jsonResponse, badRequest, notFound, serverError } from '../../lib/utils';
import { queryAll, run } from '../../lib/db';
import { authorizeCreator, denyPrivateRead, hashToken } from '../../lib/creator-auth';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

const loadCollection = async (env: Parameters<typeof queryAll>[0], collectionId: string) =>
  ((await queryAll(env, 'SELECT id, state, artist_address FROM collections WHERE id = ?', [collectionId])).results ?? [])[0] as
    | Record<string, unknown>
    | undefined;

const newToken = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Off-chain reservation records.
 *   GET   — the collection's creator or an admin (in enforce mode)
 *   POST  — anyone; returns a one-time `reservationToken` (stored hashed)
 *   PATCH — must present that token, or be the collection's creator / an admin
 */
export const onRequest: PagesFunction = async ({ request, env, params }) => {
  const collectionId = String(params?.collectionId ?? '').trim();
  if (!collectionId) {
    return badRequest('Collection id missing.');
  }

  if (request.method === 'GET') {
    try {
      const collection = await loadCollection(env, collectionId);
      if (!collection) return notFound('Collection not found.');
      const denied = await denyPrivateRead(request, env, collection);
      if (denied) return denied;
      const result = await queryAll(
        env,
        'SELECT reservation_id, collection_id, asset_id, buyer_address, hash_hex, status, tx_id, expires_at, created_at, updated_at FROM reservations WHERE collection_id = ? ORDER BY created_at DESC',
        [collectionId]
      );
      return jsonResponse(result.results ?? [], 200, NO_STORE);
    } catch (error) {
      return serverError(
        error instanceof Error ? error.message : 'Failed to load reservations'
      );
    }
  }

  if (request.method === 'POST') {
    try {
      const payload = (await request.json()) as Record<string, unknown>;
      if (!payload.assetId || !payload.buyerAddress || !payload.hashHex) {
        return badRequest('assetId, buyerAddress, and hashHex are required.');
      }
      const collection = await loadCollection(env, collectionId);
      if (!collection) return notFound('Collection not found.');
      const reservationId = crypto.randomUUID();
      const token = newToken();
      const now = Date.now();
      const duration = Number(payload.durationMs);
      const expiresAt = now + (Number.isFinite(duration) && duration > 0 ? Math.min(duration, 24 * 3600000) : 1200000);
      const values = [reservationId, collectionId, payload.assetId, payload.buyerAddress, payload.hashHex, 'created', payload.txId ?? null, expiresAt, now, now];
      let tokenIssued = true;
      try {
        await run(env,
          `INSERT INTO reservations (reservation_id, collection_id, asset_id, buyer_address, hash_hex, status, tx_id, expires_at, created_at, updated_at, token_hash)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [...values, hashToken(token)]
        );
      } catch (error) {
        // Before migration 018 the column does not exist; keep reservations working.
        if (!/token_hash/i.test(error instanceof Error ? error.message : '')) throw error;
        tokenIssued = false;
        await run(env,
          `INSERT INTO reservations (reservation_id, collection_id, asset_id, buyer_address, hash_hex, status, tx_id, expires_at, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          values
        );
      }
      const inserted = await queryAll(
        env,
        'SELECT reservation_id, collection_id, asset_id, buyer_address, hash_hex, status, tx_id, expires_at, created_at, updated_at FROM reservations WHERE reservation_id = ?',
        [reservationId]
      );
      return jsonResponse({ ...(inserted.results?.[0] ?? {}), ...(tokenIssued ? { reservationToken: token } : {}) }, 200, NO_STORE);
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'Failed to create reservation');
    }
  }

  if (request.method === 'PATCH') {
    try {
      const payload = (await request.json()) as Record<string, unknown>;
      if (!payload.reservationId || !payload.action) {
        return badRequest('reservationId and action are required.');
      }
      const status = ({ confirm: 'confirmed', release: 'released', cancel: 'cancelled' } as Record<string, string>)[String(payload.action)];
      if (!status) return badRequest('Unsupported reservation action.');
      let existing: { token_hash?: string | null } | undefined;
      try {
        existing = ((await queryAll(env,
          'SELECT reservation_id, token_hash FROM reservations WHERE reservation_id = ? AND collection_id = ?',
          [payload.reservationId, collectionId])).results ?? [])[0] as { token_hash?: string | null } | undefined;
      } catch (error) {
        if (!/token_hash/i.test(error instanceof Error ? error.message : '')) throw error;
        existing = ((await queryAll(env,
          'SELECT reservation_id FROM reservations WHERE reservation_id = ? AND collection_id = ?',
          [payload.reservationId, collectionId])).results ?? [])[0] as { token_hash?: string | null } | undefined;
      }
      if (!existing) return notFound('Reservation not found.');
      const tokenMatches = typeof payload.reservationToken === 'string' && existing.token_hash &&
        hashToken(payload.reservationToken) === existing.token_hash;
      if (!tokenMatches) {
        const collection = await loadCollection(env, collectionId);
        const decision = await authorizeCreator(request, env, { action: `reservation-${status}`, collection: collection ?? null });
        if (!decision.allowed) return decision.response!;
      }
      await run(env,
        'UPDATE reservations SET status = ?, tx_id = COALESCE(?, tx_id), updated_at = ? WHERE reservation_id = ? AND collection_id = ?',
        [status, payload.txId ?? null, Date.now(), payload.reservationId, collectionId]
      );
      const select = await queryAll(
        env,
        'SELECT reservation_id, collection_id, asset_id, buyer_address, hash_hex, status, tx_id, expires_at, created_at, updated_at FROM reservations WHERE reservation_id = ?',
        [payload.reservationId]
      );
      return jsonResponse(select.results?.[0], 200, NO_STORE);
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'Failed to update reservation');
    }
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
};
