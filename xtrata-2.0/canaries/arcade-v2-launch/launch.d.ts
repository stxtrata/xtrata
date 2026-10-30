declare module "*.cjs" { const api: any; export default api; }
declare module "*/v2-plan.mjs" { const plan: any; export = plan; }
/** Built by scripts/build-arcade-v2-launch-canary.mjs (checked and pinned there). */
declare module "xa:launch" {
  type Net = 'mainnet' | 'testnet';
  const launch: {
    release: {
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
      equivalentParents: number[];
    };
    releaseSha: string;
    networks: Record<Net, {
      root: string; treasury: string; core: string; posterPublishers: string[]; hallPublisher: string | null;
      screenFeeRecipient: string; gamesDelay: number; lockGamesDelay: boolean; parents: number[] | string; bundleId: number | string; canDeployCore: boolean;
    }>;
    contracts: Record<Net, Record<string, string>>;
    contractSha: Record<Net, Record<string, string>>;
    coreTestnet: Record<string, string>;
    coreTestnetSha: Record<string, string>;
    boards: { id: string; game: string; mode: number; max: number }[];
    testGames: { id: string; title: string; file: string; mode: number; max: number; source: string }[];
    /** score-client.js, world.js and world2.js: the hall's own registry reader */
    reader: Record<string, string>;
  };
  export default launch;
}
