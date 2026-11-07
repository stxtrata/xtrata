/**
 * /x/<id>: the Explorer. Same app shell as before (this replaces the `/x/* / 200` rewrite, which
 * Functions take precedence over). For link-preview crawlers only, the shell's <head> gets the
 * inscription's own title, description and preview image, so a shared /x/ link unfurls properly.
 * People get the unchanged shell, with no extra work on the way.
 */
import { buildMeta, cleanId, findArticle, injectMeta, isPreviewBot, SITE } from '../lib/article-reader';
import { peekInscription } from '../lib/inscription-preview';

type Fetcher = { fetch: (request: Request) => Promise<Response> };

export const onRequest: PagesFunction = async (ctx) => {
  const { request } = ctx;
  const env = ctx.env as { ASSETS: Fetcher; LINK_PREVIEWS?: unknown };
  const url = new URL(request.url);
  const shell = () => env.ASSETS.fetch(new Request(new URL('/', url), { method: 'GET', headers: request.headers }));

  const seg = Array.isArray(ctx.params?.path) ? ctx.params.path[0] : ctx.params?.path;
  const id = cleanId(seg);
  const wantsPreview =
    request.method === 'GET' &&
    !!id &&
    String(env.LINK_PREVIEWS ?? '').trim() !== '0' &&
    isPreviewBot(request.headers.get('user-agent'));
  if (!wantsPreview || !id) return shell();

  const page = await env.ASSETS.fetch(new Request(new URL('/', url), { method: 'GET' }));
  if (!page.ok || !(page.headers.get('content-type') || '').includes('text/html')) return page;

  const peeked = findArticle(id) ? { head: null, type: 'text/html' } : await peekInscription(ctx, id);
  const meta = buildMeta(id, peeked.head, peeked.type, `${SITE}/x/${id}`);
  const title = `${meta.article ? meta.article.title : meta.title} · #${id} · Xtrata Explorer`;
  const headers = new Headers(page.headers);
  headers.delete('etag');
  headers.delete('content-length');
  headers.set('cache-control', 'no-store');
  headers.set('vary', 'User-Agent');
  return new Response(injectMeta(await page.text(), meta, title), { status: 200, headers });
};
