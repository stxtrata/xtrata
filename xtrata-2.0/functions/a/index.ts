// /a/: the list of registered articles. See functions/lib/article-reader.ts.
import { renderIndex } from '../lib/article-reader';

export const onRequestGet: PagesFunction = async () =>
  new Response(renderIndex(), {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' }
  });
