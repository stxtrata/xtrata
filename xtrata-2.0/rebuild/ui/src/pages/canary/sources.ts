import { parseContractId } from '@xtrata/collections-client';
import dropsTemplateSource from '../../assets/xtrata-drops-v3.clar.tpl?raw';
import {
  buildCollectionSource,
  createDefaultTemplateDraft,
  replaceLine,
  sourceHash,
  type CollectionTemplateDraft
} from '../studio/template';
import { COLLECTION_CLARITY_VERSION } from '../../services/deploy';
import type { CanaryDeployConfig } from './config';
import { plannedContractId } from './config';

/**
 * The exact bytes this run will deploy.
 *
 * Both contracts ship from the repo with `.mock-xtrata-core` in the core slot,
 * because that is what Clarinet's simnet resolves. That is deliberate: the
 * checked-in source is the one the contract test-suite runs against, and the
 * deploy templater is the single place where the real core principal is
 * substituted. Substitution here reuses the Studio's anchored `replaceLine`, so
 * a marker that has moved is an ERROR rather than a silent no-op — and a
 * leftover `.mock-xtrata-core` anywhere in the output is fatal (threat 15).
 *
 * The collection contract references the core only through
 * `ALLOWED-XTRATA-CONTRACT` (it takes the core as a trait argument and compares
 * `contract-of`). The drops contract additionally makes two direct
 * `contract-call?` references, because escrow transfers are static calls, so
 * three sites move rather than one.
 */

export const DROPS_TEMPLATE_SOURCE = dropsTemplateSource;

/**
 * Clarity 4: `xtrata-drops-v3` uses `current-contract` and `as-contract?` with
 * `with-nft` allowances, none of which exist in Clarity 3. Pinned explicitly
 * for the same reason the collection pins 3 — a wallet that picks a version for
 * us produces a contract that either fails to analyze or loses its allowance
 * precision.
 */
export const DROPS_CLARITY_VERSION = 4;

/** The simnet placeholder both contracts carry in the repo. */
export const MOCK_CORE_REFERENCE = '.mock-xtrata-core';

export interface TemplateSubstitution {
  marker: string;
  /** How many sites this marker rewrote. */
  count: number;
}

export interface DropsTemplateResult {
  source: string;
  errors: string[];
  substitutions: TemplateSubstitution[];
}

/**
 * Substitute the pinned core into the drops singleton.
 *
 * `contract-call? .mock-xtrata-core` sites are counted, and an unexpected count
 * is an error: the point of the count is that adding a fourth core call site to
 * the contract without updating this templater cannot pass stage 1 unnoticed.
 */
export const EXPECTED_DROPS_CORE_CALL_SITES = 2;

export const buildDropsSource = (
  params: { coreContractId: string },
  source: string = DROPS_TEMPLATE_SOURCE
): DropsTemplateResult => {
  const errors: string[] = [];
  const substitutions: TemplateSubstitution[] = [];

  try {
    parseContractId(params.coreContractId);
  } catch {
    errors.push(`Core contract must be a full contract id, received "${params.coreContractId}".`);
    return { source, errors, substitutions };
  }

  let out = replaceLine({
    source,
    pattern: /^\(define-constant ALLOWED-NFT-CONTRACT .*\)$/m,
    replacement: `(define-constant ALLOWED-NFT-CONTRACT '${params.coreContractId})`,
    marker: 'XTRATA-CORE-TEMPLATE-LINE (ALLOWED-NFT-CONTRACT)',
    errors
  });
  if (errors.length === 0) {
    substitutions.push({ marker: 'ALLOWED-NFT-CONTRACT', count: 1 });
  }

  const callSite = /\(contract-call\? \.mock-xtrata-core\b/g;
  const callSiteCount = (out.match(callSite) ?? []).length;
  if (callSiteCount !== EXPECTED_DROPS_CORE_CALL_SITES) {
    errors.push(
      `Expected ${EXPECTED_DROPS_CORE_CALL_SITES} direct core call sites in the drops template, found ${callSiteCount}.`
    );
  } else {
    out = out.replace(callSite, `(contract-call? '${params.coreContractId}`);
    substitutions.push({ marker: 'contract-call? <core>', count: callSiteCount });
  }

  if (out.includes(MOCK_CORE_REFERENCE)) {
    errors.push(
      `The simnet placeholder ${MOCK_CORE_REFERENCE} still appears in the substituted drops source.`
    );
  }

  return { source: out, errors, substitutions };
};

export interface Deployable {
  id: 'drops' | 'collection';
  contractName: string;
  /** `SPxxx.name` this will occupy once deployed. */
  contractId: string;
  clarityVersion: number;
  source: string;
  /** sha256 of the exact bytes to be deployed, lowercase hex. */
  sourceHash: string;
  /** Contract ids this source depends on, as substituted. */
  dependencies: string[];
  substitutions: TemplateSubstitution[];
}

export interface DeployablesResult {
  deployables: Deployable[];
  errors: string[];
  warnings: string[];
}

/**
 * The canary collection draft: a throwaway, unpaused, open-supply, free
 * collection whose only job is to prove the mint → assign → drop → claim path
 * on the freshly deployed drops singleton.
 */
export const canaryCollectionDraft = (params: {
  coreContractId: string;
  dropsAuthority: string;
}): CollectionTemplateDraft => ({
  ...createDefaultTemplateDraft({
    coreContract: params.coreContractId,
    dropsAuthority: params.dropsAuthority
  }),
  name: 'Xtrata deployment canary',
  symbol: 'CANARY',
  description: 'Throwaway collection created by the deployment canary. Not a production collection.',
  supplyMode: 'open',
  maxSupply: 0,
  mintPriceMicroStx: 0n,
  maxPerWallet: 0,
  paused: false
});

/**
 * Everything stage 1 needs: both sources, substituted, hashed and ordered by
 * dependency (drops first — the collection bakes the drops principal in).
 */
export const buildDeployables = (
  config: CanaryDeployConfig,
  overrides: { collectionDraft?: CollectionTemplateDraft } = {}
): DeployablesResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const deployables: Deployable[] = [];

  const dropsContractId = plannedContractId(config, config.dropsContractName);
  const collectionContractId = plannedContractId(config, config.collectionContractName);

  const drops = buildDropsSource({ coreContractId: config.coreContractId });
  errors.push(...drops.errors.map((message) => `drops: ${message}`));
  if (drops.errors.length === 0) {
    deployables.push({
      id: 'drops',
      contractName: config.dropsContractName,
      contractId: dropsContractId,
      clarityVersion: DROPS_CLARITY_VERSION,
      source: drops.source,
      sourceHash: sourceHash(drops.source),
      dependencies: [config.coreContractId],
      substitutions: drops.substitutions
    });
  }

  const draft =
    overrides.collectionDraft ??
    canaryCollectionDraft({ coreContractId: config.coreContractId, dropsAuthority: dropsContractId });
  const collection = buildCollectionSource(draft);
  errors.push(...collection.errors.map((message) => `collection: ${message}`));
  warnings.push(...collection.warnings.map((message) => `collection: ${message}`));
  if (collection.errors.length === 0) {
    if (collection.source.includes(MOCK_CORE_REFERENCE)) {
      errors.push(
        `collection: the simnet placeholder ${MOCK_CORE_REFERENCE} still appears in the substituted source.`
      );
    } else {
      deployables.push({
        id: 'collection',
        contractName: config.collectionContractName,
        contractId: collectionContractId,
        clarityVersion: COLLECTION_CLARITY_VERSION,
        source: collection.source,
        sourceHash: sourceHash(collection.source),
        dependencies: [config.coreContractId, dropsContractId],
        substitutions: [
          { marker: 'ALLOWED-XTRATA-CONTRACT', count: 1 },
          { marker: 'drops-authority', count: 1 }
        ]
      });
    }
  }

  return { deployables, errors, warnings };
};

/** Deploy order is dependency order: the singleton, then the template instance. */
export const DEPLOY_ORDER: readonly Deployable['id'][] = ['drops', 'collection'];

export const orderDeployables = (deployables: Deployable[]): Deployable[] =>
  [...deployables].sort((a, b) => DEPLOY_ORDER.indexOf(a.id) - DEPLOY_ORDER.indexOf(b.id));
