/**
 * /a/<id>: reading view for any inscription, best for articles. See functions/lib/article-reader.ts.
 *
 * Registered articles are rendered from the registry alone. For anything else the server reads the
 * inscription once (through the same handler as /i/<id>) to write a title, description and preview
 * image into the page, because link-preview crawlers do not run JavaScript.
 */
import { onInscriptionRequest } from '../inscription/handler';
import { buildMeta, cleanId, findArticle, readHead, renderReader, type HeadInfo } from '../lib/article-reader';

const MAX_HEAD_BYTES = 2_000_000;

type Ctx = Parameters<PagesFunction>[0];

async function peek(ctx: Ctx, id: string): Promise<{ head: HeadInfo | null; type: string | null; missing: boolean }> {
  try {
    const url = new URL(`/i/${id}`, ctx.request.url);
    const res = await onInscriptionRequest({
      ...ctx,
      request: new Request(url.toString(), { method: 'GET', headers: { accept: '*/*' } }),
      params: { tokenId: id }
    } as Ctx);
    if (res.status === 404) return { head: null, type: null, missing: true };
    if (!res.ok) return { head: null, type: null, missing: false };
    const type = res.headers.get('content-type');
    const size = Number(res.headers.get('content-length') || res.headers.get('x-xtrata-runtime-total-size') || 0);
    if (type && /html/i.test(type) && (!size || size <= MAX_HEAD_BYTES)) {
      return { head: readHead(await res.text()), type, missing: false };
    }
    await res.body?.cancel();
    return { head: null, type, missing: false };
  } catch {
    return { head: null, type: null, missing: false };
  }
}

export const onRequestGet: PagesFunction = async (ctx) => {
  const id = cleanId(ctx.params.id);
  if (!id) return new Response('Not an inscription number.', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  const raw = String(Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id);
  if (raw !== id) return Response.redirect(new URL(`/a/${id}${new URL(ctx.request.url).search}`, ctx.request.url).toString(), 301);

  const peeked = findArticle(id) ? { head: null, type: 'text/html', missing: false } : await peek(ctx, id);
  const html = renderReader(buildMeta(id, peeked.head, peeked.type));
  return new Response(html, {
    status: peeked.missing ? 404 : 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin'
    }
  });
};
