/**
 * Link previews for /i/<id>, for crawlers only.
 *
 * /i/<id> serves raw inscription bytes, and that stays true for people and for every other
 * client. When a link-preview crawler (X, Discord, LinkedIn, Slack, Telegram…) asks for an
 * inscription that is not itself an image, video or audio file, it gets a tiny page of preview
 * tags instead, so a shared /i/ link shows a title, a line and a picture. Media is passed through
 * untouched, because crawlers fetch og:image targets through this same route.
 *
 * The preview is never cached (no-store, Vary: User-Agent), so a crawler's copy cannot be served
 * to a person. Switch: LINK_PREVIEWS = "0" turns it off without a code push.
 */
import { buildMeta, cleanId, isPreviewBot, renderPreview, SITE } from './article-reader';
import { readPeek } from './inscription-preview';

type Ctx = { request: Request; env: { LINK_PREVIEWS?: unknown }; next: () => Promise<Response> };

const isMedia = (type: string | null) => !!type && /^(image|video|audio)\//i.test(type);

export async function linkPreviewGuard({ request, env, next }: Ctx): Promise<Response> {
  if (String(env?.LINK_PREVIEWS ?? '').trim() === '0') return next();
  if (request.method !== 'GET' || !isPreviewBot(request.headers.get('user-agent'))) return next();
  const url = new URL(request.url);
  const id = cleanId(url.pathname.split('/')[2]);
  if (!url.pathname.startsWith('/i/') || !id) return next();

  const res = await next();
  const type = res.headers.get('content-type');
  if (!res.ok || isMedia(type)) return res;

  const peeked = await readPeek(res);
  const meta = buildMeta(id, peeked.head, peeked.type, `${SITE}/i/${id}`);
  const title = meta.article ? `${meta.article.title} · by ${meta.article.author}` : meta.title;
  return new Response(renderPreview(meta, title), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      vary: 'User-Agent',
      'x-xtrata-link-preview': '1'
    }
  });
}
