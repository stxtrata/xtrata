/**
 * Tab icon for raw inscription documents opened directly in a browser tab.
 *
 * Why this exists: `/inscription/<id>` and `/i/<id>` serve the inscription's own HTML as the top-level
 * document, so the tab shows whatever that HTML declares, and most inscriptions declare no icon. The
 * browser then falls back to `/favicon.ico`, which used to hit the SPA fallback and return HTML, so
 * the Xtrata icon vanished (reported on /inscription/6343). `public/favicon.ico` fixes that fallback for
 * every page; this guard is the belt-and-braces for inscription tabs, because many inscriptions carry
 * `<base href="null">` and run under a CSP sandbox, where a relative icon URL would not resolve.
 *
 * Rules, each one deliberate:
 *   - Only top-level navigations (`Sec-Fetch-Dest: document`). In-app frames (`iframe`), `fetch()`
 *     callers (the /runtime launcher, hash checks) and range reads get the inscription's exact bytes.
 *   - Only a full 200 HTML/XHTML response. SVG and media are never touched.
 *   - An inscription that declares its own icon keeps it. We only add one when it has none.
 *   - The icon URL is absolute, so `<base href>` inside the inscription cannot break it.
 *   - `Vary: Sec-Fetch-Dest` so a cached tab copy is never handed to a byte-exact reader.
 */

export const TAB_ICON_PATH = '/favicon.svg';
export const TAB_ICON_FALLBACK_PATH = '/favicons/xtrata-favicon-32.png';

export const isHtmlDocumentType = (contentType: string | null) => {
  const type = (contentType ?? '').split(';')[0].trim().toLowerCase();
  return type === 'text/html' || type === 'application/xhtml+xml';
};

export const shouldInjectTabIcon = (request: Request, res: Response) =>
  request.method === 'GET' &&
  res.status === 200 &&
  !request.headers.has('range') &&
  (request.headers.get('sec-fetch-dest') ?? '').toLowerCase() === 'document' &&
  isHtmlDocumentType(res.headers.get('content-type'));

export const tabIconMarkup = (origin: string) =>
  `<link rel="icon" type="image/svg+xml" href="${origin}${TAB_ICON_PATH}">` +
  `<link rel="icon" type="image/png" sizes="32x32" href="${origin}${TAB_ICON_FALLBACK_PATH}">`;

const addVary = (headers: Headers, value: string) => {
  const current = headers.get('vary');
  if (!current) {
    headers.set('vary', value);
    return;
  }
  const parts = current.split(',').map((part) => part.trim().toLowerCase());
  if (!parts.includes(value.toLowerCase()) && !parts.includes('*')) {
    headers.set('vary', `${current}, ${value}`);
  }
};

type RewriterElement = {
  getAttribute(name: string): string | null;
  append(content: string, options?: { html?: boolean }): unknown;
  onEndTag?(handler: (tag: { before(content: string, options?: { html?: boolean }): unknown }) => void): unknown;
};
type RewriterDocEnd = { append(content: string, options?: { html?: boolean }): unknown };
type Rewriter = {
  on(selector: string, handlers: { element?(el: RewriterElement): void }): Rewriter;
  onDocument(handlers: { end?(end: RewriterDocEnd): void }): Rewriter;
  transform(res: Response): Response;
};

type Ctx = { request: Request; next: () => Promise<Response> };

export async function tabIconGuard({ request, next }: Ctx): Promise<Response> {
  const res = await next();
  const RewriterCtor = (globalThis as { HTMLRewriter?: new () => Rewriter }).HTMLRewriter;

  // Byte-exact readers must be able to tell the variants apart even when we change nothing.
  const isRawHtml = isHtmlDocumentType(res.headers.get('content-type'));
  if (!isRawHtml || !RewriterCtor) return res;
  if (!shouldInjectTabIcon(request, res)) {
    const out = new Response(res.body, res);
    addVary(out.headers, 'Sec-Fetch-Dest');
    return out;
  }

  const markup = tabIconMarkup(new URL(request.url).origin);
  let hasIcon = false;
  let injected = false;

  const rewritten = new RewriterCtor()
    .on('link', {
      element(el) {
        const rel = (el.getAttribute('rel') ?? '').toLowerCase().split(/\s+/);
        if (rel.includes('icon')) hasIcon = true;
      }
    })
    .on('head', {
      element(el) {
        el.onEndTag?.((tag) => {
          if (hasIcon || injected) return;
          injected = true;
          tag.before(markup, { html: true });
        });
      }
    })
    .onDocument({
      end(end) {
        // No explicit </head> (the parser implied it): browsers still honour an icon link here.
        if (hasIcon || injected) return;
        injected = true;
        end.append(markup, { html: true });
      }
    })
    .transform(res);

  const out = new Response(rewritten.body, rewritten);
  out.headers.delete('content-length');
  const etag = out.headers.get('etag');
  if (etag && !etag.startsWith('W/')) out.headers.set('etag', `W/${etag}`);
  addVary(out.headers, 'Sec-Fetch-Dest');
  return out;
}
