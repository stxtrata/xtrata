import { isThumbnailVersion, parseThumbnailRequest, thumbnailKey } from '../../lib/thumbnails';

// GET /thumb/<contract>/<tokenId>?v=<version>
//
// Serves the small stored WebP that an Explorer grid tile shows in place of the
// inscription itself. The version in `?v=` comes from /index/page (it is the
// thumbnail's etag), so a URL that carries one never changes content and can be
// cached for a year. Without it we cache briefly, so a replaced picture shows up.
//
// The bucket binding is THUMBNAILS. If it is not configured (or the object is
// missing) the answer is a plain 404 and the grid keeps its text poster.

type ThumbnailObject = {
  body: ReadableStream<Uint8Array> | null;
  size?: number;
  httpEtag?: string;
};
type ThumbnailBucket = { get(key: string): Promise<ThumbnailObject | null> };
type ThumbEnv = { THUMBNAILS?: ThumbnailBucket };

const IMMUTABLE = 'public, max-age=31536000, immutable';
const SHORT = 'public, max-age=3600, s-maxage=86400';

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'content-security-policy': "default-src 'none'; sandbox",
  'referrer-policy': 'no-referrer'
};

const notFound = () =>
  new Response(null, {
    status: 404,
    headers: { 'cache-control': 'public, max-age=60', ...SECURITY_HEADERS }
  });

export const onRequest = async (context: {
  request: Request;
  env: ThumbEnv;
  params?: Record<string, string | string[] | undefined>;
  waitUntil?: (promise: Promise<unknown>) => void;
}): Promise<Response> => {
  const { request, env } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: { allow: 'GET, HEAD' } });
  }

  const contract = Array.isArray(context.params?.contract)
    ? context.params?.contract[0]
    : context.params?.contract;
  const tokenId = Array.isArray(context.params?.tokenId)
    ? context.params?.tokenId[0]
    : context.params?.tokenId;
  const parsed = parseThumbnailRequest(contract, tokenId);
  if (!parsed) {
    return new Response(null, { status: 400, headers: { 'cache-control': 'no-store' } });
  }

  const bucket = env.THUMBNAILS;
  if (!bucket || typeof bucket.get !== 'function') return notFound();

  const url = new URL(request.url);
  const version = url.searchParams.get('v');
  const cacheControl = isThumbnailVersion(version) ? IMMUTABLE : SHORT;

  // The edge cache spares R2 reads for tiles that many people load. The key is
  // normalised so equivalent requests share one entry.
  const edge = (globalThis as { caches?: { default?: Cache } }).caches?.default ?? null;
  const cacheKey = new Request(
    `${url.origin}/thumb/${parsed.contractId}/${parsed.tokenId}?v=${isThumbnailVersion(version) ? version : ''}`,
    { method: 'GET' }
  );
  if (edge && request.method === 'GET') {
    const hit = await edge.match(cacheKey);
    if (hit) return hit;
  }

  let object: ThumbnailObject | null = null;
  try {
    object = await bucket.get(thumbnailKey(parsed.contractId, parsed.tokenId));
  } catch {
    return notFound();
  }
  if (!object || !object.body) return notFound();

  const headers = new Headers({
    'content-type': 'image/webp',
    'cache-control': cacheControl,
    ...SECURITY_HEADERS
  });
  if (typeof object.size === 'number') headers.set('content-length', String(object.size));
  if (object.httpEtag) headers.set('etag', object.httpEtag);

  if (request.method === 'HEAD') {
    await object.body.cancel();
    return new Response(null, { status: 200, headers });
  }

  const response = new Response(object.body, { status: 200, headers });
  if (edge && context.waitUntil) {
    context.waitUntil(edge.put(cacheKey, response.clone()));
  }
  return response;
};
