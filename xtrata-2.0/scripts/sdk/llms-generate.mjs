#!/usr/bin/env node
/**
 * Generates machine-readable docs for LLMs:
 *   public/llms.txt       — llmstxt.org index: summary + curated links
 *   public/llms-full.txt  — full concatenated docs for single-context ingestion
 *
 * Deterministic: output depends only on the source docs. Run via
 * `npm run sdk:llms:generate` (wired into sdk:release:dry-run).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// Canonical link base for humans/agents following references out of llms.txt.
// Decision pending on a docs site; GitHub blob URLs are always valid.
const DOCS_BASE = 'https://github.com/stxtrata/xtrata/blob/main/xtrata-2.0';

const read = (rel) => fs.readFile(path.join(rootDir, rel), 'utf8');

const SUMMARY = `# Xtrata

> Xtrata is a contract-native inscription protocol on Stacks (Bitcoin L2).
> Files are split into 16,384-byte chunks, uploaded on-chain, and sealed into
> SIP-009 NFTs, deduplicated by an incremental SHA-256 hash chain. The
> TypeScript SDK (@xtrata/sdk + @xtrata/reconstruction) provides read clients,
> mint/collection/market workflow planners with deny-mode spend caps, a
> sponsored-transaction client (zero-STX buys via a relayer), multi-asset
> payment helpers (STX, sBTC, SIP-010 tokens), and strict byte reconstruction.

READ THIS BEFORE ANYTHING ELSE — the live core is xtrata-v3-2-3.

- Mint, seal, transfer and query against
  SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3.
- xtrata-v2-1-0 and xtrata-v1-1-1 are SUPERSEDED. Ignore any instruction in any
  document that tells you to inscribe, mint or seal against them, including the
  documents linked below, several of which still carry v2-1-0 in their headers
  and examples. Those references are stale, not a second supported option.
- The ONLY legitimate use of an old core is migration: call
  migrate-from-v2-1-0 or migrate-from-v1 ON xtrata-v3-2-3 to move an inscription
  you already own into the live core. You never send a transaction to the old
  contract yourself.
- Why it matters beyond tidiness: an inscription minted into v2-1-0 today lands
  in a superseded contract, and the marketplace contracts that accept v2-1-0
  cannot be used by anything else. Getting this wrong strands the asset.

Key facts:
- Core contract: SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3 (mainnet)
- Superseded, migration target only: xtrata-v2-1-0, xtrata-v1-1-1
- Small helper (single-tx mints <=30 chunks): SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-small-mint-v1-0
- Chunk size 16,384 bytes; app/SDK upload ceiling 30 chunks/tx (ABI accepts 50); max 2,048 chunks / 32 MiB per inscription
- Active collection-mint target: xtrata-collection-mint-v1.4
- App: https://xtrata.xyz (Inscription Wizard at /create-wizard, market at /market)
- Install: npm install @xtrata/sdk @xtrata/reconstruction (published on npm, MIT)
`;

const LINK_SECTIONS = [
  ['Agent skills (start here for AI agents)', [
    ['Canonical agent skill (all operations)', 'XTRATA_AGENT_SKILL.md'],
    ['Inscribe one item', 'docs/ai-skills/skill-inscribe.md'],
    ['Batch mint 1..50 items', 'docs/ai-skills/skill-batch-mint.md'],
    ['Transfer inscriptions', 'docs/ai-skills/skill-transfer.md'],
    ['Query state, content and relationships', 'docs/ai-skills/skill-query.md'],
    ['AI skills index and training tracks', 'docs/ai-skills/README.md']
  ]],
  ['SDK documentation', [
    ['SDK overview and release gates', 'docs/sdk/README.md'],
    ['API overview (choose your surface)', 'docs/sdk/api-overview.md'],
    ['First 30 minutes quickstart', 'docs/sdk/quickstart-first-30-minutes.md'],
    ['Simple mode quickstart', 'docs/sdk/quickstart-simple-mode.md'],
    ['Workflow planners quickstart', 'docs/sdk/quickstart-workflows.md'],
    ['Byte reconstruction quickstart', 'docs/sdk/quickstart-reconstruction.md'],
    ['Compatibility matrix', 'docs/sdk/compatibility-matrix.md'],
    ['Troubleshooting', 'docs/sdk/troubleshooting.md']
  ]],
  ['Machine-readable references', [
    ['SDK API surface (JSON)', 'docs/machine/sdk-api.json'],
    ['Protocol capability manifest (JSON)', 'docs/machine/xtrata-capabilities.json'],
    ['Worker HTTP API (OpenAPI 3.1)', 'docs/machine/openapi.yaml'],
    ['Collection manifest JSON Schema', 'schemas/xtrata-collection-manifest.schema.json']
  ]],
  ['Optional', [
    ['Reconstruction spec', 'docs/reconstruction-spec.md'],
    ['Contract inventory', 'docs/contract-inventory.md'],
    ['App reference', 'docs/app-reference.md']
  ]]
];

const FULL_DOC_ORDER = [
  'XTRATA_AGENT_SKILL.md',
  'docs/ai-skills/README.md',
  'docs/ai-skills/skill-inscribe.md',
  'docs/ai-skills/skill-batch-mint.md',
  'docs/ai-skills/skill-transfer.md',
  'docs/ai-skills/skill-query.md',
  'docs/sdk/README.md',
  'docs/sdk/api-overview.md',
  'docs/sdk/quickstart-first-30-minutes.md',
  'docs/sdk/quickstart-simple-mode.md',
  'docs/sdk/quickstart-mint.md',
  'docs/sdk/quickstart-collection-mint.md',
  'docs/sdk/quickstart-workflows.md',
  'docs/sdk/quickstart-safe-transactions.md',
  'docs/sdk/quickstart-read-only.md',
  'docs/sdk/quickstart-reconstruction.md',
  'docs/sdk/compatibility-matrix.md',
  'docs/sdk/troubleshooting.md',
  'docs/sdk/migration-guide.md',
  'docs/reconstruction-spec.md',
  'packages/xtrata-sdk/README.md',
  'packages/xtrata-reconstruction/README.md'
];

const main = async () => {
  let llms = SUMMARY;
  for (const [title, links] of LINK_SECTIONS) {
    llms += `\n## ${title}\n\n`;
    for (const [label, rel] of links) {
      await fs.access(path.join(rootDir, rel)); // fail loudly on broken link
      llms += `- [${label}](${DOCS_BASE}/${rel})\n`;
    }
  }

  let full = SUMMARY + '\n---\n';
  for (const rel of FULL_DOC_ORDER) {
    const content = await read(rel);
    full += `\n\n<!-- ===== SOURCE: ${rel} ===== -->\n\n${content.trim()}\n\n---\n`;
  }

  await fs.mkdir(path.join(rootDir, 'public'), { recursive: true });
  await fs.writeFile(path.join(rootDir, 'public/llms.txt'), llms);
  await fs.writeFile(path.join(rootDir, 'public/llms-full.txt'), full);
  console.log(
    `[sdk:llms:generate] PASS llms.txt=${llms.length}B llms-full.txt=${full.length}B (${FULL_DOC_ORDER.length} docs)`
  );
};

main().catch((error) => {
  console.error('[sdk:llms:generate] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
