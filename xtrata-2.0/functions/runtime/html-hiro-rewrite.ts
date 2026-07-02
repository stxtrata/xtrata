/**
 * Serve-time rewrite of direct Hiro API bases inside HTML inscriptions.
 *
 * Inscribed apps (e.g. XBoard) call https://api.mainnet.hiro.so directly,
 * which means every viewer burns the public per-IP rate limit (observed as
 * hundreds of 503s on /i/350). The site already runs a caching, key-rotating
 * Hiro proxy at /hiro/<network>/*, so rewriting the API base at serve time
 * gives every viewer a shared server-side cache without touching the
 * canonical on-chain bytes.
 *
 * Canonical bytes remain available with ?raw=1.
 */

const HIRO_BASE_REWRITES: Array<[RegExp, string]> = [
  [/https:\/\/api\.mainnet\.hiro\.so/g, '/hiro/mainnet'],
  [/https:\/\/api\.testnet\.hiro\.so/g, '/hiro/testnet'],
  [/https:\/\/stacks-node-api\.mainnet\.stacks\.co/g, '/hiro/mainnet'],
  [/https:\/\/stacks-node-api\.testnet\.stacks\.co/g, '/hiro/testnet']
];

const RAW_QUERY_PARAMS = ['raw', 'rawSource', 'noApiRewrite'];

export const isHtmlMimeType = (mimeType: string | null | undefined) =>
  /^text\/html\b/i.test(String(mimeType || '').trim());

export const isRawSourceRequested = (url: URL) =>
  RAW_QUERY_PARAMS.some((param) => {
    const value = url.searchParams.get(param);
    return value !== null && value !== '0' && value.toLowerCase() !== 'false';
  });

export const shouldRewriteHiroBases = (params: {
  requestUrl: URL;
  mimeType: string | null | undefined;
  method: string;
  isRangeResponse: boolean;
}) =>
  isHtmlMimeType(params.mimeType) &&
  String(params.method || 'GET').toUpperCase() === 'GET' &&
  !params.isRangeResponse &&
  !isRawSourceRequested(params.requestUrl);

const normalizeOrigin = (origin?: string) => {
  const value = String(origin || '').trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(value) ? value : '';
};

/**
 * Rewrites to absolute same-site URLs (`https://<origin>/hiro/<network>`)
 * because rewritten HTML may end up inside blob: documents, where relative
 * paths cannot be resolved.
 */
export const rewriteHiroApiBasesInText = (source: string, origin?: string) => {
  const proxyOrigin = normalizeOrigin(origin);
  let output = source;
  let changed = false;
  for (const [pattern, proxyPath] of HIRO_BASE_REWRITES) {
    if (pattern.test(output)) {
      pattern.lastIndex = 0;
      output = output.replace(pattern, `${proxyOrigin}${proxyPath}`);
      changed = true;
    }
    pattern.lastIndex = 0;
  }
  return { source: output, changed };
};

export const rewriteHiroApiBasesInBytes = (bytes: Uint8Array, origin?: string) => {
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch (error) {
    // Not valid UTF-8 despite the HTML mime type; serve untouched.
    return { bytes, changed: false };
  }
  const { source, changed } = rewriteHiroApiBasesInText(text, origin);
  if (!changed) {
    return { bytes, changed: false };
  }
  return { bytes: new TextEncoder().encode(source), changed: true };
};
