// The free-player giveaway: /players. It is the giveaway page (public/giveaway.html) reading its own list
// (GET /radio/giveaway/players), with its own title and share card: see functions/lib/players-page.ts.
import { playersPage } from './lib/players-page';

type Fetcher = { fetch: (request: Request) => Promise<Response> };

export const onRequest = async ({ request, env }: { request: Request; env: { ASSETS: Fetcher } }) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
  // No request headers are passed on: a conditional request would get an empty "not changed" answer with nothing to rewrite.
  const page = await env.ASSETS.fetch(new Request(new URL('/giveaway', request.url), { method: 'GET' }));
  if (!page.ok) return new Response('The giveaway page is unavailable right now.', { status: 502, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  const html = await page.text();
  const out = playersPage(html);
  const headers = new Headers({ 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60', 'x-content-type-options': 'nosniff' });
  for (const name of ['content-security-policy', 'referrer-policy', 'x-frame-options', 'permissions-policy']) {
    const v = page.headers.get(name);
    if (v) headers.set(name, v);
  }
  return new Response(request.method === 'HEAD' ? null : (out ?? html), { status: 200, headers });
};
