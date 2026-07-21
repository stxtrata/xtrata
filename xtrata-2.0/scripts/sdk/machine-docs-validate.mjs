#!/usr/bin/env node
/**
 * Validation gate for the machine-readable docs:
 * - public/llms.txt + llms-full.txt exist and are non-trivial
 * - docs/machine/sdk-api.json parses and includes required core exports
 * - docs/machine/xtrata-capabilities.json parses and matches the schema's
 *   required shape (lightweight structural check, no ajv dependency)
 * - docs/machine/openapi.yaml exists and declares openapi 3.x
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const problems = [];
const read = (rel) => fs.readFile(path.join(rootDir, rel), 'utf8');

const REQUIRED_SDK_EXPORTS = [
  'createXtrataReadClient',
  'createSimpleSdk',
  'buildCoreMintWorkflowPlan',
  'buildMarketBuyWorkflowPlan',
  'createSponsorClient',
  'buildPaymentPostCondition',
  'sip10Asset',
  'SBTC_MAINNET'
];

const main = async () => {
  for (const rel of ['public/llms.txt', 'public/llms-full.txt']) {
    try {
      const text = await read(rel);
      if (text.length < 500) problems.push(`${rel}: suspiciously small (${text.length}B)`);
    } catch {
      problems.push(`${rel}: missing — run npm run sdk:llms:generate`);
    }
  }

  try {
    const api = JSON.parse(await read('docs/machine/sdk-api.json'));
    const names = new Set(
      Object.values(api.packages['@xtrata/sdk']?.modules ?? {}).flat().map((e) => e.name)
    );
    for (const required of REQUIRED_SDK_EXPORTS) {
      if (!names.has(required)) problems.push(`sdk-api.json: missing core export ${required}`);
    }
  } catch (error) {
    problems.push(`docs/machine/sdk-api.json: ${error.message}`);
  }

  try {
    const caps = JSON.parse(await read('docs/machine/xtrata-capabilities.json'));
    for (const key of ['protocol', 'contracts', 'limits', 'fees', 'endpoints', 'payments', 'workflows']) {
      if (!(key in caps)) problems.push(`xtrata-capabilities.json: missing "${key}"`);
    }
    if (caps.limits && caps.limits.uploadBatchCeilingChunks !== 30) {
      problems.push('xtrata-capabilities.json: uploadBatchCeilingChunks must be 30 (app/SDK policy)');
    }
  } catch (error) {
    problems.push(`docs/machine/xtrata-capabilities.json: ${error.message}`);
  }

  try {
    const spec = await read('docs/machine/openapi.yaml');
    if (!/^openapi:\s*["']?3\./m.test(spec)) problems.push('openapi.yaml: not an OpenAPI 3.x document');
  } catch {
    problems.push('docs/machine/openapi.yaml: missing');
  }

  if (problems.length > 0) {
    console.error('[sdk:machine:validate] FAIL');
    for (const p of problems) console.error(`- ${p}`);
    process.exit(1);
  }
  console.log('[sdk:machine:validate] PASS (llms.txt, sdk-api.json, capabilities, openapi)');
};

main().catch((error) => {
  console.error('[sdk:machine:validate] FAIL');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
