/**
 * The pay-per-play radio host (e.g. radio.xtrata.xyz).
 *
 * The listening wallet trusts exactly one parent origin. xtrata.xyz cannot be it: the executable
 * runtime (/runtime/) and the gallery deliberately run inscriptions AS xtrata.xyz so wallet
 * extensions work for the arcade and X-Board, and those inscriptions have that URL on-chain.
 * So pay-per-play lives on its own host, served by the same Pages project, where nothing but the
 * radio may run as the origin:
 *   - function routes that could execute inscription HTML redirect to the main site, or are
 *     served with `Content-Security-Policy: sandbox` (opaque origin, no scripts);
 *   - static pages get the same sandbox from public/_headers, except the radio's own pages.
 *
 * RADIO_PPP_HOST (a bare hostname) switches this on. Unset: pay-per-play is off everywhere.
 */
import type { Env } from './db';

export type RadioHostEnv = Env & { RADIO_PPP_HOST?: string };
export const MAIN_SITE = 'https://xtrata.xyz';
export const CONTENT_SANDBOX = 'sandbox';

export function radioHost(env: RadioHostEnv): string | null {
  const h = typeof env.RADIO_PPP_HOST === 'string' ? env.RADIO_PPP_HOST.trim().toLowerCase() : '';
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(h) ? h : null;
}

export const isRadioHost = (request: Request, env: RadioHostEnv) => {
  const host = radioHost(env);
  return !!host && new URL(request.url).hostname === host;
};

export const toMainSite = (request: Request) => {
  const url = new URL(request.url);
  return Response.redirect(MAIN_SITE + url.pathname + url.search, 302);
};

/** Paths the radio needs as data or media. Served sandboxed so HTML among them cannot run here. */
export const isSandboxedContentPath = (path: string) =>
  path === '/runtime/content' || path.startsWith('/i/') || path.startsWith('/inscription/');

type Ctx = { request: Request; env: RadioHostEnv; next: () => Promise<Response> };

/** Folder middleware for routes that can render or execute inscription content. */
export async function radioHostGuard({ request, env, next }: Ctx): Promise<Response> {
  if (!isRadioHost(request, env)) return next();
  const path = new URL(request.url).pathname;
  if (!isSandboxedContentPath(path)) return toMainSite(request);
  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set('Content-Security-Policy', CONTENT_SANDBOX);
  return out;
}
