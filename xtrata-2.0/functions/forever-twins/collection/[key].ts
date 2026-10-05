// Forever Twins: serve the shared collection page for /forever-twins/collection/<key>.
// The page reads <key> from location.pathname, so the URL must stay as typed.
// A _redirects rewrite to the .html file makes Pages redirect to a canonical URL and lose the key,
// so the static page is fetched here and returned under the requested URL instead.
type Fetcher = { fetch: (request: Request) => Promise<Response> };

export const onRequest = async ({
  request,
  params,
  env
}: {
  request: Request;
  params: { key?: string | string[] };
  env: { ASSETS: Fetcher };
}) => {
  const key = Array.isArray(params.key) ? params.key[0] : params.key;
  const url = new URL(request.url);
  // Static files that share this folder are served as they are.
  if (!key || key === 'index.html' || key === 'view.html' || key === 'view') {
    return env.ASSETS.fetch(request);
  }
  const page = await env.ASSETS.fetch(
    new Request(new URL('/forever-twins/collection/view', url), { method: 'GET', headers: request.headers })
  );
  const headers = new Headers(page.headers);
  headers.set('cache-control', 'public, max-age=60');
  return new Response(page.body, { status: page.status, headers });
};
