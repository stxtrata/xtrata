/**
 * Client-side mirror of functions/runtime/html-hiro-rewrite.ts.
 *
 * Inscription HTML rendered through srcDoc iframes (grid cards, preview
 * panels, workspace viewers) is decoded from canonical bytes in the browser,
 * so the server-side /i/ route rewrite never touches it. Heavy inscribed apps
 * like XBoard call https://api.mainnet.hiro.so directly and trip the public
 * per-IP rate limit. Routing them through the site's caching /hiro/<network>
 * proxy keeps every embedded surface fast and protects the shared quota.
 *
 * URLs are rewritten to absolute same-site form so they resolve correctly
 * from about:srcdoc and blob: documents.
 */

const HIRO_BASE_REWRITES: Array<[RegExp, string]> = [
  [/https:\/\/api\.mainnet\.hiro\.so/g, '/hiro/mainnet'],
  [/https:\/\/api\.testnet\.hiro\.so/g, '/hiro/testnet'],
  [/https:\/\/stacks-node-api\.mainnet\.stacks\.co/g, '/hiro/mainnet'],
  [/https:\/\/stacks-node-api\.testnet\.stacks\.co/g, '/hiro/testnet']
];

const resolveProxyOrigin = (origin?: string) => {
  if (typeof origin === 'string') {
    return origin.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin?.startsWith('http')) {
    return window.location.origin;
  }
  return '';
};

export const rewriteHiroApiBasesForEmbeddedHtml = (
  html: string,
  options: { origin?: string } = {}
) => {
  const proxyOrigin = resolveProxyOrigin(options.origin);
  let output = html;
  let changed = false;
  for (const [pattern, proxyPath] of HIRO_BASE_REWRITES) {
    if (pattern.test(output)) {
      pattern.lastIndex = 0;
      output = output.replace(pattern, `${proxyOrigin}${proxyPath}`);
      changed = true;
    }
    pattern.lastIndex = 0;
  }
  return { html: output, changed };
};

export const containsDirectHiroApiBase = (html: string) =>
  HIRO_BASE_REWRITES.some(([pattern]) => {
    const result = pattern.test(html);
    pattern.lastIndex = 0;
    return result;
  });
