/** Exact X-Chess 2.6.0 release. IDs are provenance, not contract configuration. */
export const XCHESS_HELPER_NAME = 'xchess-browser-house-v2';
export const XCHESS_HELPER_SOURCE = 'contracts/live/xchess-browser-house-v2.clar';
export const XCHESS_HELPER_SHA256 = '7a40233b69c1406ec92e2672d16add3c30c158e4ffa02cab8c4b4cdbc93d089d';
export function inspectXChessSource(code: string, sha256: string): string[] {
  return sha256 === XCHESS_HELPER_SHA256 && new TextEncoder().encode(code).length === 16171
    ? [] : ['X-Chess helper source differs from the tested 2.6.0 release / inscription #3048. Do not deploy edited bytes.'];
}
