import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { basename, join, parse, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

const FOREVER_TWINS_INTERNAL_DIRS = new Set(['ft-harness', 'ops', 'strategy', 'copy', 'publish', 'scripts', 'functions', 'docs']);

const staticApps = [
  { source: 'music', target: 'dist/music' },
  {
    source: 'opus-file-generator',
    target: 'dist/opus-file-generator'
  },
  {
    source: 'recursive-apps/x-board',
    target: 'dist/recursive-apps/x-board'
  },
  {
    source: 'forever-twins',
    target: 'dist/forever-twins',
    // Internal working files are not published: the test harness, campaign and outreach drafts,
    // prospect/ledger spreadsheets and loose markdown notes. Public pages, assets, registry and
    // guides are everything else.
    exclude: (rel) => {
      const parts = rel.split('/');
      if (parts.length === 1) return /\.md$/i.test(parts[0]) || FOREVER_TWINS_INTERNAL_DIRS.has(parts[0]);
      return FOREVER_TWINS_INTERNAL_DIRS.has(parts[0]) || (parts[0] === 'data' && /\.csv$/i.test(parts[parts.length - 1]));
    }
  },
  {
    source: 'suno-more',
    target: 'dist/suno-more'
  },
  {
    source: 'flowproof',
    target: 'dist/flowproof'
  },
  {
    source: 'proofzero',
    target: 'dist/proofzero'
  },
  {
    source: 'umg',
    target: 'dist/umg'
  },
  {
    // Public path renamed from /agent-one to /wizard (old links 301 in _redirects).
    source: 'xtrata-agent-one/wizard',
    target: 'dist/wizard'
  },
  {
    source: 'recursive-apps/22-wallet-canary',
    target: 'dist/wallet-canary'
  },
  {
    source: 'recursive-apps/23-passkey-canary',
    target: 'dist/passkey-canary'
  }
];

// NOTE: .env / .env.local are excluded so secrets (e.g. a signer key) can never
// be published to the static site. node_modules/dist excluded for size.
const ignoredNames = new Set(['.DS_Store', '.git', '.gitignore', '.gitIgnore', 'node_modules', '.env', '.env.local', 'dist']);

const copyStaticApp = async ({ source, target, exclude }) => {
  const sourcePath = join(repoRoot, source);
  const targetPath = join(repoRoot, target);
  const sourceStats = await stat(sourcePath).catch(() => null);

  if (!sourceStats?.isDirectory()) {
    throw new Error(`Static app source directory not found: ${source}`);
  }

  await mkdir(join(repoRoot, 'dist'), { recursive: true });
  await rm(targetPath, { recursive: true, force: true });
  await cp(sourcePath, targetPath, {
    recursive: true,
    filter: (path) => {
      const name = basename(path);
      if (ignoredNames.has(name)) return false;
      if (exclude) {
        const rel = relative(sourcePath, path).split(sep).join('/');
        if (rel && exclude(rel)) return false;
      }
      return true;
    }
  });

  console.log(`[static-apps] copied ${source} -> ${target}`);
};

for (const staticApp of staticApps) {
  await copyStaticApp(staticApp);
}

const createXboardAliases = async () => {
  const versionSourceDir = join(repoRoot, 'recursive-apps/x-board/xboard-version-testing');
  const aliasDir = join(repoRoot, 'dist/x-board');
  const entries = await readdir(versionSourceDir, { withFileTypes: true });
  const versionFiles = entries
    .filter((entry) => entry.isFile() && /^x-board-v\d+(?:\.\d+)?(?:-[^.]+)?\.html$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  await rm(aliasDir, { recursive: true, force: true });
  await mkdir(aliasDir, { recursive: true });

  await cp(join(versionSourceDir, 'index.html'), join(aliasDir, 'index.html'));
  await cp(join(versionSourceDir, 'latest-manifest.js'), join(aliasDir, 'latest-manifest.js'));

  for (const fileName of versionFiles) {
    const sourcePath = join(versionSourceDir, fileName);
    const slug = parse(fileName).name;
    await cp(sourcePath, join(aliasDir, fileName));
    await mkdir(join(aliasDir, slug), { recursive: true });
    await cp(sourcePath, join(aliasDir, slug, 'index.html'));
  }

  console.log(`[static-apps] generated x-board aliases -> dist/x-board (${versionFiles.length} versions)`);
};

await createXboardAliases();
