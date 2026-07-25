import { bytesToHex, parseContractId, plainSha256, XtrataClientError } from '@xtrata/collections-client';
import templateSource from '../../assets/xtrata-collection-v3.clar.tpl?raw';

/**
 * Collection contract templating.
 *
 * `xtrata-collection-v3.clar` is a template: one instance is deployed per
 * collection with its identity, supply policy and pinned dependencies baked in
 * as constants / data-var initializers. The substitution is line-oriented and
 * anchored (`^…$` with the `m` flag) so it can only ever rewrite a whole
 * declaration line — a marker that has moved or changed shape produces an
 * error, never a silent no-op. This is the `replaceLine` pattern from
 * `src/lib/deploy/collection-template.ts`, kept deliberately identical.
 *
 * The only marker the contract calls out explicitly is XTRATA-CORE-TEMPLATE-LINE
 * (the pinned core principal — the one value that must never be wrong). The
 * rest are `define-data-var` initializers, substituted so that the collection
 * is correct at genesis rather than after a sequence of admin transactions.
 *
 * Everything NOT baked in here (phases, allowlists, splits, recipients) is
 * configured post-deploy through `CollectionTxBuilder`, because those are
 * mutable policy rather than deploy-time identity.
 */

export const COLLECTION_TEMPLATE_SOURCE = templateSource;

export type SupplyMode = 'fixed' | 'open' | 'capped-closable';

/** Contract-side supply-mode constants (MODE-FIXED / OPEN / CAPPED-CLOSABLE). */
export const SUPPLY_MODE_VALUES: Record<SupplyMode, number> = {
  fixed: 1,
  open: 2,
  'capped-closable': 3
};

const SUPPLY_MODE_CONSTANTS: Record<SupplyMode, string> = {
  fixed: 'MODE-FIXED',
  open: 'MODE-OPEN',
  'capped-closable': 'MODE-CAPPED-CLOSABLE'
};

export interface CollectionTemplateDraft {
  /** `SPxxx.xtrata-v3-2-3` — the pinned core. */
  coreContract: string;
  /** `SPxxx.xtrata-drops-v3`, or null to leave drops-authority unset. */
  dropsAuthority: string | null;
  name: string;
  symbol: string;
  description: string;
  artworkUri: string;
  baseUri: string;
  defaultTokenUri: string;
  supplyMode: SupplyMode;
  /** Only meaningful for `fixed`; must be 0 for open / capped-closable. */
  maxSupply: number;
  mintPriceMicroStx: bigint;
  maxPerWallet: number;
  allowlistEnabled: boolean;
  reservationExpiryBlocks: number;
  /** Deploy paused (contract default) and unpause explicitly before minting. */
  paused: boolean;
}

export interface TemplateBuildResult {
  source: string;
  errors: string[];
  warnings: string[];
}

export const createDefaultTemplateDraft = (params: {
  coreContract: string;
  dropsAuthority: string | null;
}): CollectionTemplateDraft => ({
  coreContract: params.coreContract,
  dropsAuthority: params.dropsAuthority,
  name: '',
  symbol: '',
  description: '',
  artworkUri: '',
  baseUri: '',
  defaultTokenUri: 'data:text/plain,xtrata-collection-default',
  supplyMode: 'open',
  maxSupply: 0,
  mintPriceMicroStx: 0n,
  maxPerWallet: 0,
  allowlistEnabled: false,
  reservationExpiryBlocks: 1440,
  paused: true
});

const ASCII_PRINTABLE = /^[\x20-\x7E]*$/;

const escapeClarityAscii = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

/**
 * Anchored whole-line replacement. A missing marker is an ERROR, so a contract
 * refactor can never produce a quietly under-substituted deployment.
 */
export const replaceLine = (params: {
  source: string;
  pattern: RegExp;
  replacement: string;
  marker: string;
  errors: string[];
}): string => {
  if (!params.pattern.test(params.source)) {
    params.errors.push(`Template marker missing: ${params.marker}`);
    return params.source;
  }
  return params.source.replace(params.pattern, params.replacement);
};

/** Contract-name rules for the deployed instance (Clarity identifier subset). */
export const CONTRACT_NAME_PATTERN = /^[a-z][a-z0-9-]{0,39}$/;

export const validateContractName = (name: string): string | null =>
  CONTRACT_NAME_PATTERN.test(name)
    ? null
    : 'Contract name must be lowercase letters, digits and dashes, starting with a letter (max 40).';

export const buildCollectionSource = (
  draft: CollectionTemplateDraft,
  source: string = COLLECTION_TEMPLATE_SOURCE
): TemplateBuildResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    parseContractId(draft.coreContract);
  } catch {
    errors.push('Core contract must be a full contract id, e.g. SP…​.xtrata-v3-2-3.');
  }
  if (draft.dropsAuthority !== null) {
    try {
      parseContractId(draft.dropsAuthority);
    } catch {
      errors.push('Drops authority must be a full contract id or left unset.');
    }
  } else {
    warnings.push('No drops authority baked in — set it before creating a drop from this collection.');
  }

  const ascii = (value: string, max: number, label: string): void => {
    if (!ASCII_PRINTABLE.test(value)) errors.push(`${label} must use printable ASCII only.`);
    if (value.length > max) errors.push(`${label} must be ${max} characters or fewer.`);
  };
  ascii(draft.name, 64, 'Collection name');
  ascii(draft.symbol, 16, 'Collection symbol');
  ascii(draft.description, 256, 'Description');
  ascii(draft.artworkUri, 256, 'Artwork URI');
  ascii(draft.baseUri, 256, 'Base URI');
  ascii(draft.defaultTokenUri, 256, 'Default token URI');

  if (draft.name.trim().length === 0) errors.push('Collection name is required.');
  if (draft.symbol.trim().length === 0) errors.push('Collection symbol is required.');

  if (draft.supplyMode === 'fixed' && draft.maxSupply <= 0) {
    errors.push('Fixed supply requires a max supply greater than zero.');
  }
  if (draft.supplyMode !== 'fixed' && draft.maxSupply !== 0) {
    errors.push('Open and capped-closable supply must start with max supply 0.');
  }
  if (!Number.isInteger(draft.reservationExpiryBlocks) || draft.reservationExpiryBlocks <= 0) {
    errors.push('Reservation expiry must be a positive whole number of blocks.');
  }
  if (draft.mintPriceMicroStx < 0n) errors.push('Mint price cannot be negative.');
  if (!Number.isInteger(draft.maxPerWallet) || draft.maxPerWallet < 0) {
    errors.push('Max per wallet must be a whole number (0 = unlimited).');
  }

  if (errors.length > 0) return { source, errors, warnings };

  let out = source;

  out = replaceLine({
    source: out,
    pattern: /^\(define-constant ALLOWED-XTRATA-CONTRACT .*\)$/m,
    replacement: `(define-constant ALLOWED-XTRATA-CONTRACT '${draft.coreContract})`,
    marker: 'XTRATA-CORE-TEMPLATE-LINE',
    errors
  });

  out = replaceLine({
    source: out,
    pattern: /^\(define-data-var paused bool (?:true|false)\)$/m,
    replacement: `(define-data-var paused bool ${draft.paused ? 'true' : 'false'})`,
    marker: 'paused',
    errors
  });

  out = replaceLine({
    source: out,
    pattern: /^\(define-data-var supply-mode uint [A-Z-]+\)$/m,
    replacement: `(define-data-var supply-mode uint ${SUPPLY_MODE_CONSTANTS[draft.supplyMode]})`,
    marker: 'supply-mode',
    errors
  });

  out = replaceLine({
    source: out,
    pattern: /^\(define-data-var max-supply uint u\d+\)$/m,
    replacement: `(define-data-var max-supply uint u${draft.maxSupply})`,
    marker: 'max-supply',
    errors
  });

  out = replaceLine({
    source: out,
    pattern: /^\(define-data-var reservation-expiry-blocks uint u\d+\)$/m,
    replacement: `(define-data-var reservation-expiry-blocks uint u${draft.reservationExpiryBlocks})`,
    marker: 'reservation-expiry-blocks',
    errors
  });

  out = replaceLine({
    source: out,
    pattern: /^\(define-data-var mint-price uint u\d+\)$/m,
    replacement: `(define-data-var mint-price uint u${draft.mintPriceMicroStx.toString()})`,
    marker: 'mint-price',
    errors
  });

  out = replaceLine({
    source: out,
    pattern: /^\(define-data-var max-per-wallet uint u\d+\)$/m,
    replacement: `(define-data-var max-per-wallet uint u${draft.maxPerWallet})`,
    marker: 'max-per-wallet',
    errors
  });

  out = replaceLine({
    source: out,
    pattern: /^\(define-data-var allowlist-enabled bool (?:true|false)\)$/m,
    replacement: `(define-data-var allowlist-enabled bool ${draft.allowlistEnabled ? 'true' : 'false'})`,
    marker: 'allowlist-enabled',
    errors
  });

  const asciiVar = (
    varName: string,
    length: number,
    value: string,
    marker: string
  ): void => {
    out = replaceLine({
      source: out,
      pattern: new RegExp(
        `^\\(define-data-var ${varName} \\(string-ascii ${length}\\) [^\\n]*\\)$`,
        'm'
      ),
      replacement: `(define-data-var ${varName} (string-ascii ${length}) "${escapeClarityAscii(value)}")`,
      marker,
      errors
    });
  };

  asciiVar('collection-name', 64, draft.name, 'collection-name');
  asciiVar('collection-symbol', 16, draft.symbol, 'collection-symbol');
  asciiVar('collection-description', 256, draft.description, 'collection-description');
  asciiVar('artwork-uri', 256, draft.artworkUri, 'artwork-uri');
  asciiVar('base-uri', 256, draft.baseUri, 'base-uri');
  asciiVar('default-token-uri', 256, draft.defaultTokenUri, 'default-token-uri');

  out = replaceLine({
    source: out,
    pattern: /^\(define-data-var drops-authority \(optional principal\) .*\)$/m,
    replacement: `(define-data-var drops-authority (optional principal) ${
      draft.dropsAuthority === null ? 'none' : `(some '${draft.dropsAuthority})`
    })`,
    marker: 'drops-authority',
    errors
  });

  return { source: out, errors, warnings };
};

// --- deployed-source verification -----------------------------------------

const textEncoder = new TextEncoder();

/** sha256 of the exact bytes submitted / returned. Hex, lowercase. */
export const sourceHash = (source: string): string =>
  bytesToHex(plainSha256(textEncoder.encode(source)));

/**
 * Some wallets and the API round-trip whitespace differently (trailing newline,
 * CRLF). Compare on a normalized form as well as the exact bytes, and report
 * which of the two matched so a "whitespace only" difference is never confused
 * with a source mismatch.
 */
export const normalizeSource = (source: string): string =>
  source.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '\n');

export interface SourceVerification {
  match: 'exact' | 'normalized' | 'none';
  expectedHash: string;
  actualHash: string;
  expectedNormalizedHash: string;
  actualNormalizedHash: string;
}

export const verifyDeployedSource = (params: {
  expected: string;
  actual: string;
}): SourceVerification => {
  const expectedHash = sourceHash(params.expected);
  const actualHash = sourceHash(params.actual);
  const expectedNormalizedHash = sourceHash(normalizeSource(params.expected));
  const actualNormalizedHash = sourceHash(normalizeSource(params.actual));
  const match: SourceVerification['match'] =
    expectedHash === actualHash
      ? 'exact'
      : expectedNormalizedHash === actualNormalizedHash
        ? 'normalized'
        : 'none';
  return { match, expectedHash, actualHash, expectedNormalizedHash, actualNormalizedHash };
};

/** Throwing wrapper for the deploy step: a real mismatch stops the flow. */
export const assertDeployedSourceMatches = (params: {
  expected: string;
  actual: string;
  contractId: string;
}): SourceVerification => {
  const verification = verifyDeployedSource(params);
  if (verification.match === 'none') {
    throw new XtrataClientError(
      'checksum-mismatch',
      `deployed source of ${params.contractId} does not match the source built here ` +
        `(expected sha256 ${verification.expectedHash}, on-chain ${verification.actualHash})`,
      { detail: { ...verification, contractId: params.contractId } }
    );
  }
  return verification;
};
