declare module "*.html" { const source: string; export default source; }
declare module "*.cjs" { const api: any; export default api; }
/** Built by scripts/build-arcade-launch-canary.mjs from recursive-apps/xtrata-arcade (checked and pinned there). */
declare module "xa:release" {
  const release: {
    version: string;
    bundle: { id: number; sha256: string; bytes: number; chunks: number; chainHash: string };
    packOrder: string[];
    inscribe: string[];
    packs: Record<string, string>;
    packSha: Record<string, string>;
    fromBundle: string[];
    ids: { version: string; bundleId: number; packs: Record<string, number>; parts: Record<string, number>; parentTokenId: number };
    shell: string;
    shellSha: string;
    partSha: Record<string, string>;
    single: string;
    singleSha: string;
  };
  export default release;
}
