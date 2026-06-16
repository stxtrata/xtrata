const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

async function ensureSchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS gallery_cache (
      collection TEXT NOT NULL,
      network TEXT NOT NULL,
      source_contract TEXT NOT NULL,
      token_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      token_uri TEXT,
      resolved_metadata_uri TEXT,
      image_field TEXT,
      image_uri TEXT,
      resolved_image_uri TEXT,
      error TEXT,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (collection, network, source_contract, token_id)
    )
  `).run();
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_gallery_cache_range
    ON gallery_cache (collection, network, source_contract, token_id)
  `).run();
}

function cleanParam(value, fallback = '') {
  return String(value || fallback).trim().slice(0, 300);
}

function parseRange(url) {
  const start = Number(url.searchParams.get('start') || 1);
  const end = Number(url.searchParams.get('end') || start);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end - start > 5000) {
    throw new Error('Invalid token range');
  }
  return { start, end };
}

export async function onRequestGet({ env, request }) {
  if (!env.DB) return json({ error: 'D1 binding DB is not available' }, 503);
  const url = new URL(request.url);
  const collection = cleanParam(url.searchParams.get('collection'), 'leo-cats');
  const network = cleanParam(url.searchParams.get('network'), 'mainnet');
  const source = cleanParam(url.searchParams.get('source'));
  if (!source) return json({ error: 'source is required' }, 400);

  let range;
  try { range = parseRange(url); }
  catch (err) { return json({ error: err.message }, 400); }

  await ensureSchema(env.DB);
  const result = await env.DB.prepare(`
    SELECT token_id AS id, status, token_uri, resolved_metadata_uri, image_field, image_uri,
      resolved_image_uri, error, updated_at AS cached_at
    FROM gallery_cache
    WHERE collection = ? AND network = ? AND source_contract = ? AND token_id BETWEEN ? AND ?
    ORDER BY token_id ASC
  `).bind(collection, network, source, range.start, range.end).all();

  return json({ collection, network, source_contract: source, range, items: result.results || [] });
}

export async function onRequestPost({ env, request }) {
  if (!env.DB) return json({ error: 'D1 binding DB is not available' }, 503);
  let body;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON body' }, 400); }

  const collection = cleanParam(body.collection, 'leo-cats');
  const network = cleanParam(body.network, 'mainnet');
  const source = cleanParam(body.source_contract || body.source);
  const items = Array.isArray(body.items) ? body.items.slice(0, 500) : [];
  if (!source) return json({ error: 'source_contract is required' }, 400);
  if (!items.length) return json({ error: 'items must be a non-empty array' }, 400);

  await ensureSchema(env.DB);
  const updatedAt = new Date().toISOString();
  const statements = items
    .filter((item) => Number.isInteger(Number(item.id)) && Number(item.id) > 0)
    .map((item) => env.DB.prepare(`
      INSERT INTO gallery_cache (
        collection, network, source_contract, token_id, status, token_uri,
        resolved_metadata_uri, image_field, image_uri, resolved_image_uri, error, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(collection, network, source_contract, token_id) DO UPDATE SET
        status = excluded.status,
        token_uri = excluded.token_uri,
        resolved_metadata_uri = excluded.resolved_metadata_uri,
        image_field = excluded.image_field,
        image_uri = excluded.image_uri,
        resolved_image_uri = excluded.resolved_image_uri,
        error = excluded.error,
        updated_at = excluded.updated_at
    `).bind(
      collection,
      network,
      source,
      Number(item.id),
      cleanParam(item.status, 'loaded'),
      item.token_uri || null,
      item.resolved_metadata_uri || null,
      item.image_field || null,
      item.image_uri || null,
      item.resolved_image_uri || null,
      item.error || null,
      updatedAt,
    ));

  if (!statements.length) return json({ error: 'No valid item IDs supplied' }, 400);
  await env.DB.batch(statements);
  return json({ ok: true, saved: statements.length, updated_at: updatedAt });
}
