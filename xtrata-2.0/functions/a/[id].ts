/**
 * /a/<id>: reading view for any inscription, best for articles. See functions/lib/article-reader.ts.
 *
 * Registered articles are rendered from the registry alone. For anything else, link-preview
 * crawlers get a title, description and image read from the inscription (they do not run
 * JavaScript). People get the page straight away and the browser loads the content itself.
 */
import { buildMeta, cleanId, findArticle, isPreviewBot, renderReader } from '../lib/article-reader';
import { peekInscription, type Peeked } from '../lib/inscription-preview';

export const onRequestGet: PagesFunction = async (ctx) => {
  const id = cleanId(ctx.params?.id);
  if (!id) return new Response('Not an inscription number.', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  const raw = String(Array.isArray(ctx.params?.id) ? ctx.params.id[0] : ctx.params?.id);
  if (raw !== id) return Response.redirect(new URL(`/a/${id}${new URL(ctx.request.url).search}`, ctx.request.url).toString(), 301);

  const bot = isPreviewBot(ctx.request.headers.get('user-agent'));
  const peeked: Peeked =
    findArticle(id) || !bot ? { head: null, type: findArticle(id) ? 'text/html' : null, missing: false } : await peekInscription(ctx, id);
  const html = renderReader(buildMeta(id, peeked.head, peeked.type));
  return new Response(html, {
    status: peeked.missing ? 404 : 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': bot ? 'no-store' : 'public, max-age=300',
      vary: 'User-Agent',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin'
    }
  });
};
