import { queryAll, run, type Env } from '../lib/db';
import { jsonResponse } from '../lib/utils';

type GalleryCacheRow = {
  collection: string;
  network: string;
  source_contract: string;
  id: number;
  status: string | null;
  token_uri: string | null;
  resolved_metadata_uri: string | null;
  image_field: string | null;
  image_uri: string | null;
  resolved_image_uri: string | null;
  error: string | null;
  cached_at: string | null;
};

type GalleryCacheItem = Partial<Omit<GalleryCacheRow, 'collection' | 'network' | 'source_contract'>> & {
  id?: unknown;
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, x-api-key',
  'Cache-Control': 'no-store'
};

const asRequiredString = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const asInteger = (value: unknown) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(numeric) ? numeric : null;
};

const nullableString = (value: unknown) =>
  typeof value === 'string' ? value : value == null ? null : String(value);

const json = (payload: unknown, status = 200) =>
  jsonResponse(payload, status, CORS_HEADERS);

const badRequest = (message: string) => json({ error: message }, 400);
const serverError = (message: string) => json({ error: message }, 500);

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: CORS_HEADERS });

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const collection = asRequiredString(url.searchParams.get('collection'));
    const network = asRequiredString(url.searchParams.get('network'));
    const source = asRequiredString(url.searchParams.get('source'));
    const start = asInteger(url.searchParams.get('start'));
    const end = asInteger(url.searchParams.get('end'));

    if (!collection || !network || !source || start === null || end === null) {
      return badRequest('Missing required query params: collection, network, source, start, end');
    }
    if (start > end) {
      return badRequest('Invalid range: start must be less than or equal to end');
    }

    const result = await queryAll(
      env as Env,
      `SELECT
        collection,
        network,
        source_contract,
        id,
        status,
        token_uri,
        resolved_metadata_uri,
        image_field,
        image_uri,
        resolved_image_uri,
        error,
        cached_at
      FROM gallery_cache
      WHERE collection = ?
        AND network = ?
        AND source_contract = ?
        AND id BETWEEN ? AND ?
      ORDER BY id ASC`,
      [collection, network, source, start, end]
    );

    return json({ items: (result.results ?? []) as GalleryCacheRow[] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gallery cache read failed';
    console.error('[api/gallery-cache] GET failed', { message });
    return serverError(message);
  }
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return badRequest('Expected JSON body');
    }

    const payload = body as {
      collection?: unknown;
      network?: unknown;
      source_contract?: unknown;
      items?: unknown;
    };
    const collection = asRequiredString(payload.collection);
    const network = asRequiredString(payload.network);
    const sourceContract = asRequiredString(payload.source_contract);

    if (!collection || !network || !sourceContract || !Array.isArray(payload.items)) {
      return badRequest(
        'Missing required body fields: collection, network, source_contract, items'
      );
    }

    const now = new Date().toISOString();
    let saved = 0;

    for (const rawItem of payload.items) {
      if (!rawItem || typeof rawItem !== 'object') {
        continue;
      }
      const item = rawItem as GalleryCacheItem;
      const id = asInteger(item.id);
      if (id === null) {
        continue;
      }

      await run(
        env as Env,
        `INSERT INTO gallery_cache (
          collection,
          network,
          source_contract,
          id,
          status,
          token_uri,
          resolved_metadata_uri,
          image_field,
          image_uri,
          resolved_image_uri,
          error,
          cached_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(collection, network, source_contract, id) DO UPDATE SET
          status = excluded.status,
          token_uri = excluded.token_uri,
          resolved_metadata_uri = excluded.resolved_metadata_uri,
          image_field = excluded.image_field,
          image_uri = excluded.image_uri,
          resolved_image_uri = excluded.resolved_image_uri,
          error = excluded.error,
          cached_at = excluded.cached_at`,
        [
          collection,
          network,
          sourceContract,
          id,
          nullableString(item.status),
          nullableString(item.token_uri),
          nullableString(item.resolved_metadata_uri),
          nullableString(item.image_field),
          nullableString(item.image_uri),
          nullableString(item.resolved_image_uri),
          nullableString(item.error),
          nullableString(item.cached_at) ?? now
        ]
      );
      saved += 1;
    }

    return json({ ok: true, saved }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gallery cache write failed';
    console.error('[api/gallery-cache] POST failed', { message });
    return serverError(message);
  }
};
