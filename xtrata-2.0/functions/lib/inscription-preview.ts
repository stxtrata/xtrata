/**
 * Read an inscription once, through the same handler as /i/<id>, to write link-preview tags.
 * Used only for crawlers (and registered articles skip it), so normal page loads never pay for it.
 */
import { onInscriptionRequest } from '../inscription/handler';
import { readHead, type HeadInfo } from './article-reader';

const MAX_HEAD_BYTES = 2_000_000;

export type Peeked = { head: HeadInfo | null; type: string | null; missing: boolean };

type Ctx = Parameters<PagesFunction>[0];

export async function peekInscription(ctx: Ctx, id: string): Promise<Peeked> {
  try {
    const url = new URL(`/i/${id}`, ctx.request.url);
    const res = await onInscriptionRequest({
      ...ctx,
      request: new Request(url.toString(), { method: 'GET', headers: { accept: '*/*' } }),
      params: { tokenId: id }
    } as Ctx);
    return readPeek(res);
  } catch {
    return { head: null, type: null, missing: false };
  }
}

/** Turn an /i/<id> response into preview inputs without reading big bodies. */
export async function readPeek(res: Response): Promise<Peeked> {
  if (res.status === 404) return { head: null, type: null, missing: true };
  if (!res.ok) return { head: null, type: null, missing: false };
  const type = res.headers.get('content-type');
  const size = Number(res.headers.get('content-length') || res.headers.get('x-xtrata-runtime-total-size') || 0);
  if (type && /html/i.test(type) && (!size || size <= MAX_HEAD_BYTES)) {
    return { head: readHead(await res.text()), type, missing: false };
  }
  try {
    await res.body?.cancel();
  } catch {
    /* already consumed or not cancellable */
  }
  return { head: null, type, missing: false };
}
