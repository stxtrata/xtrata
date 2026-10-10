declare module "*.html" { const source: string; export default source; }
declare module "*.clar" { const source: string; export default source; }
/** Built by scripts/build-snes-catalogue-canary.mjs (checked and pinned there). Files are base64. */
declare module "snes:pack" {
  const pack: {
    romMime: string;
    emulator: { html: string; sha256: string };
    games: Array<{
      slug: string; title: string; note: string; profile: string; board: string | null; coreMin: number;
      size: number; romSha: string; rom: string; cover: string | null; icon: string | null; coverSha: string | null; iconSha: string | null;
    }>;
  };
  export default pack;
}
