/**
 * Content isolation for the routes that serve raw inscription bytes on the main host.
 *
 * Why this exists (see CONTENT-ORIGIN-SPLIT-PLAN.md): the protocol is permissionless, so anyone can
 * inscribe an HTML or SVG page, and `/i/<id>`, `/inscription/<id>` and `/runtime/content` serve it
 * as a top-level document on xtrata.xyz with no Content-Security-Policy. It then runs AS xtrata.xyz.
 * Reputation scanners treat that as user-generated content on the main origin, and the app itself
 * already refuses to run inscriptions that way: every in-app frame is `sandbox="allow-scripts"`
 * without `allow-same-origin`. This guard gives direct loads the same treatment.
 *
 * What it does NOT touch:
 *   - the `/runtime/` launcher, which `fetch`es `/runtime/content` as text and writes it into
 *     itself (public/runtime/index.html). A response CSP cannot affect a fetch. Arcade and X-Board
 *     keep working, and the wallet bridge is not involved (docs/WALLET-PLAYBOOK.md).
 *   - media, JSON, JS modules and raw-source responses: only document-capable types are sandboxed.
 *   - the radio host, which radioHostGuard already sandboxes (it runs first and wins).
 *
 * Switches (dashboard variables, no code push needed; see wrangler.toml):
 *   INSCRIPTION_SANDBOX          "1" turns the sandbox on. Anything else: off (the default).
 *   INSCRIPTION_SANDBOX_EXEMPT   comma or space separated token ids that must keep running as the
 *                                main origin. An entry is `<tokenId>` (any contract) or
 *                                `<contractId>:<tokenId>` (exactly that contract).
 */

export type ContentIsolationEnv = {
  INSCRIPTION_SANDBOX?: unknown;
  INSCRIPTION_SANDBOX_EXEMPT?: unknown;
};

/** Same capabilities the app grants in-app frames that need them. No allow-same-origin, ever. */
export const CONTENT_ISOLATION_CSP =
  'sandbox allow-scripts allow-pointer-lock allow-downloads';

export const CONTENT_ISOLATION_HEADER = 'X-Xtrata-Content-Isolation';

export type InscriptionRef = { contractId: string | null; tokenId: string | null };

export const isIsolationEnabled = (env: ContentIsolationEnv | undefined) =>
  String(env?.INSCRIPTION_SANDBOX ?? '').trim() === '1';

export const parseExemptions = (env: ContentIsolationEnv | undefined) =>
  new Set(
    String(env?.INSCRIPTION_SANDBOX_EXEMPT ?? '')
      .split(/[\s,]+/)
      .map((entry) => entry.trim().replace(/^#/, ''))
      .filter(Boolean)
  );

/** Routes that return raw inscription bytes. Anything else (launcher, modules, pages) is not ours. */
export const isInscriptionContentPath = (pathname: string) =>
  pathname === '/runtime/content' ||
  pathname.startsWith('/i/') ||
  pathname.startsWith('/inscription/');

const cleanId = (value: string | null | undefined) => {
  const text = (value ?? '').trim().replace(/^#/, '');
  return /^\d+$/.test(text) ? text : null;
};

/**
 * Pull the token (and contract, when the URL names one) out of a content URL:
 *   /i/123                                        /inscription/123
 *   /inscription/<network>/<address>/<name>/123   /runtime/content?contractId=…&tokenId=123
 */
export const inscriptionRefFromUrl = (url: URL): InscriptionRef => {
  // Decode like the handler does (it strips a leading "#"). A malformed escape stays as-is, and an
  // unparseable id means "no ref", which can never be exempt: failing closed keeps it sandboxed.
  const parts = url.pathname
    .split('/')
    .filter(Boolean)
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });
  if (parts[0] === 'runtime') {
    return {
      contractId: url.searchParams.get('contractId')?.trim() || null,
      tokenId: cleanId(url.searchParams.get('tokenId'))
    };
  }
  if (parts[0] === 'inscription' && parts.length >= 5) {
    return {
      contractId: `${parts[2]}.${parts[3]}`,
      tokenId: cleanId(parts[4])
    };
  }
  return {
    contractId: url.searchParams.get('contractId')?.trim() || null,
    tokenId: cleanId(parts[1])
  };
};

export const isExempt = (ref: InscriptionRef, exemptions: Set<string>) => {
  if (!ref.tokenId || exemptions.size === 0) return false;
  if (exemptions.has(ref.tokenId)) return true;
  return !!ref.contractId && exemptions.has(`${ref.contractId}:${ref.tokenId}`);
};

/** Types a browser will render as a document that can run script. Everything else cannot. */
export const isDocumentCapableType = (contentType: string | null) => {
  const type = (contentType ?? '').split(';')[0].trim().toLowerCase();
  return (
    type === 'text/html' ||
    type === 'application/xhtml+xml' ||
    type === 'image/svg+xml' ||
    type === 'text/xml' ||
    type === 'application/xml'
  );
};

type Ctx = {
  request: Request;
  env: ContentIsolationEnv;
  next: () => Promise<Response>;
};

export async function contentIsolationGuard({ request, env, next }: Ctx): Promise<Response> {
  const res = await next();
  if (!isIsolationEnabled(env)) return res;

  const url = new URL(request.url);
  if (!isInscriptionContentPath(url.pathname)) return res;
  if (!isDocumentCapableType(res.headers.get('content-type'))) return res;

  const out = new Response(res.body, res);
  if (isExempt(inscriptionRefFromUrl(url), parseExemptions(env))) {
    out.headers.set(CONTENT_ISOLATION_HEADER, 'exempt');
    return out;
  }
  out.headers.set('Content-Security-Policy', CONTENT_ISOLATION_CSP);
  out.headers.set(CONTENT_ISOLATION_HEADER, 'sandboxed');
  return out;
}
