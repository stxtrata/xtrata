#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const CONTRACTS = [
  {
    name: 'xstrata-v1.0.5',
    files: {
      clarinet: 'contracts/clarinet/contracts/xstrata-v1.0.5.clar',
      testnet: 'contracts/other/xstrata-v1.0.5.clar',
      mainnet: 'contracts/live/xstrata-v1.0.5.clar'
    }
  },
  {
    name: 'xtrata-v1.1.0',
    files: {
      clarinet: 'contracts/clarinet/contracts/xtrata-v1.1.0.clar',
      testnet: 'contracts/other/xtrata-v1.1.0.clar',
      mainnet: 'contracts/live/xtrata-v1.1.0.clar'
    }
  }
];

const VARIANT_TYPES = [
  { name: 'clarinet', trait: 'local', fallback: 'testnet' },
  { name: 'testnet', trait: 'testnet', fallback: 'clarinet' },
  { name: 'mainnet', trait: 'mainnet', fallback: 'testnet' }
];

const MARKERS = {
  local: ';; [LOCAL / CLARINET]',
  testnet: ';; [TESTNET]',
  mainnet: ';; [MAINNET]'
};

const isTraitLine = (line) =>
  line.includes('(impl-trait') || line.includes('(use-trait');

const normalizeTraitLines = (content, targetTrait) => {
  const lines = content.split('\n');
  let section = null;
  const sectionsFound = new Set();
  const updated = lines.map((line) => {
    if (line.includes(MARKERS.local)) {
      section = 'local';
      sectionsFound.add('local');
      return line;
    }
    if (line.includes(MARKERS.testnet)) {
      section = 'testnet';
      sectionsFound.add('testnet');
      return line;
    }
    if (line.includes(MARKERS.mainnet)) {
      section = 'mainnet';
      sectionsFound.add('mainnet');
      return line;
    }
    if (!section || !isTraitLine(line)) {
      return line;
    }

    const match = line.match(/^(\s*)(?:;;\s*)?(.*)$/);
    if (!match) {
      return line;
    }
    const indent = match[1] ?? '';
    const body = (match[2] ?? '').trim();
    if (!body.startsWith('(')) {
      return line;
    }
    const enabled = section === targetTrait;
    return enabled ? `${indent}${body}` : `${indent};; ${body}`;
  });

  return {
    content: updated.join('\n'),
    sectionsFound
  };
};

const stripTraitBlock = (content) => {
  const lines = content.split('\n');
  let section = null;
  const normalized = [];
  for (const line of lines) {
    if (line.includes(MARKERS.local)) {
      section = 'local';
      normalized.push(line);
      continue;
    }
    if (line.includes(MARKERS.testnet)) {
      section = 'testnet';
      normalized.push(line);
      continue;
    }
    if (line.includes(MARKERS.mainnet)) {
      section = 'mainnet';
      normalized.push(line);
      continue;
    }
    if (section && isTraitLine(line)) {
      continue;
    }
    normalized.push(line);
  }
  return normalized.join('\n');
};

const loadFile = async (filePath, fallbackPath, fix) => {
  const absolute = path.join(ROOT, filePath);
  try {
    return {
      path: filePath,
      content: await fs.readFile(absolute, 'utf8'),
      existed: true
    };
  } catch (error) {
    if (!fix) {
      throw new Error(`Missing contract file: ${filePath}`);
    }
    const fallbackAbsolute = path.join(ROOT, fallbackPath);
    const fallbackContent = await fs.readFile(fallbackAbsolute, 'utf8');
    await fs.writeFile(absolute, fallbackContent, 'utf8');
    return {
      path: filePath,
      content: fallbackContent,
      existed: false
    };
  }
};

const main = async () => {
  const mode = process.argv[2] ?? 'verify';
  const fix = mode === 'sync' || mode === 'fix' || mode === '--fix';
  for (const contract of CONTRACTS) {
    const results = [];
    for (const variant of VARIANT_TYPES) {
      const file = contract.files[variant.name];
      const fallback = contract.files[variant.fallback];
      const loaded = await loadFile(file, fallback, fix);
      const normalized = normalizeTraitLines(loaded.content, variant.trait);
      const missing = ['local', 'testnet', 'mainnet'].filter(
        (entry) => !normalized.sectionsFound.has(entry)
      );
      if (missing.length > 0) {
        throw new Error(
          `${contract.name}:${variant.name} missing trait markers: ${missing.join(', ')}`
        );
      }

      const updated = normalized.content;
      const changed = updated !== loaded.content;
      if (changed && fix) {
        const absolute = path.join(ROOT, file);
        await fs.writeFile(absolute, updated, 'utf8');
      }

      results.push({
        name: variant.name,
        file,
        trait: variant.trait,
        changed,
        existed: loaded.existed,
        content: updated
      });
    }

    const reference = stripTraitBlock(results[0].content);
    for (const result of results.slice(1)) {
      const normalized = stripTraitBlock(result.content);
      if (normalized !== reference) {
        throw new Error(
          `Contract sources differ beyond trait block: ${results[0].file} vs ${result.file}`
        );
      }
    }

    const rows = results.map((entry) => {
      const status = entry.changed ? (fix ? 'updated' : 'mismatch') : 'ok';
      const created = entry.existed ? '' : ' (created)';
      return `- ${entry.name}: ${entry.file} -> ${entry.trait} [${status}]${created}`;
    });

    // eslint-disable-next-line no-console
    console.log(`Contract trait variants (${contract.name})`);
    // eslint-disable-next-line no-console
    console.log(rows.join('\n'));

    if (!fix) {
      const mismatches = results.filter((entry) => entry.changed);
      if (mismatches.length > 0) {
        const detail = mismatches.map((entry) => entry.file).join(', ');
        throw new Error(`Trait variants out of sync: ${detail}`);
      }
    }
  }
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`Contract variant check failed: ${message}`);
  process.exit(1);
});
