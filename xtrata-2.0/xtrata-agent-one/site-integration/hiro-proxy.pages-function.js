// Cloudflare Pages Function — Hiro proxy that injects HIRO_API_KEY server-side.
// The browser client calls same-origin /hiro/... and never sees the key.
//
// DEPLOY: copy this file to  functions/hiro/[[path]].js  in the xtrata site repo.
//   (Pages Functions live under /functions; [[path]] is a catch-all.)
//   HIRO_API_KEY is already set as a Pages secret, so nothing else to configure.
//   The wizard then uses Hiro base = "/hiro" (set window.XAO_HIRO = "/hiro").
//
// Allows only Hiro read + broadcast paths; same-origin so no CORS headache.

const HIRO = 'https://api.hiro.so';
const ALLOW = [/^\/v2\//, /^\/extended\//];

export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const path = '/' + ((params.path || []).join('/'));
  if (!ALLOW.some((re) => re.test(path))) return new Response('Not found', { status: 404 });
  if (!['GET', 'POST', 'OPTIONS'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

  const init = {
    method: request.method,
    headers: { 'x-api-key': env.HIRO_API_KEY || '', 'content-type': request.headers.get('content-type') || 'application/json' },
  };
  if (request.method === 'POST') init.body = await request.text();

  const resp = await fetch(HIRO + path + url.search, init);
  const headers = new Headers(resp.headers);
  headers.set('cache-control', 'no-store');
  return new Response(resp.body, { status: resp.status, headers });
}
