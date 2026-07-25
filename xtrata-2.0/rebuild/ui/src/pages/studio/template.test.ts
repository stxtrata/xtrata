import { describe, expect, it } from 'vitest';
import { XtrataClientError } from '@xtrata/collections-client';
import {
  assertDeployedSourceMatches,
  buildCollectionSource,
  COLLECTION_TEMPLATE_SOURCE,
  createDefaultTemplateDraft,
  normalizeSource,
  replaceLine,
  sourceHash,
  validateContractName,
  verifyDeployedSource,
  type CollectionTemplateDraft
} from './template';

const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const DROPS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v3';

const draft = (patch: Partial<CollectionTemplateDraft> = {}): CollectionTemplateDraft => ({
  ...createDefaultTemplateDraft({ coreContract: CORE, dropsAuthority: DROPS }),
  name: 'Test Collection',
  symbol: 'TEST',
  description: 'A collection built by the studio tests.',
  artworkUri: 'ipfs://cover',
  baseUri: 'https://example.test/',
  ...patch
});

/** Cheap structural sanity check in place of a Clarity parser. */
const parenBalance = (source: string): number => {
  let depth = 0;
  let inString = false;
  let escaped = false;
  let inComment = false;
  for (const char of source) {
    if (inComment) {
      if (char === '\n') inComment = false;
      continue;
    }
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === ';') inComment = true;
    else if (char === '"') inString = true;
    else if (char === '(') depth += 1;
    else if (char === ')') depth -= 1;
  }
  return depth;
};

describe('template source', () => {
  it('ships the real contract, with its template marker intact', () => {
    expect(COLLECTION_TEMPLATE_SOURCE).toContain('XTRATA-CORE-TEMPLATE-LINE');
    expect(COLLECTION_TEMPLATE_SOURCE).toContain('(define-constant ALLOWED-XTRATA-CONTRACT');
    // The untouched template points at the simnet mock, never at a live core.
    expect(COLLECTION_TEMPLATE_SOURCE).toContain('.mock-xtrata-core');
    expect(parenBalance(COLLECTION_TEMPLATE_SOURCE)).toBe(0);
  });
});

describe('replaceLine', () => {
  it('rewrites a whole anchored line', () => {
    const errors: string[] = [];
    const out = replaceLine({
      source: 'a\n(define-data-var paused bool true)\nb',
      pattern: /^\(define-data-var paused bool (?:true|false)\)$/m,
      replacement: '(define-data-var paused bool false)',
      marker: 'paused',
      errors
    });
    expect(out).toBe('a\n(define-data-var paused bool false)\nb');
    expect(errors).toEqual([]);
  });

  it('reports a missing marker instead of silently doing nothing', () => {
    const errors: string[] = [];
    const out = replaceLine({
      source: 'nothing here',
      pattern: /^\(define-data-var paused bool (?:true|false)\)$/m,
      replacement: 'x',
      marker: 'paused',
      errors
    });
    expect(out).toBe('nothing here');
    expect(errors).toEqual(['Template marker missing: paused']);
  });
});

describe('buildCollectionSource', () => {
  it('substitutes every deploy-time constant', () => {
    const { source, errors } = buildCollectionSource(draft());

    expect(errors).toEqual([]);
    expect(source).toContain(`(define-constant ALLOWED-XTRATA-CONTRACT '${CORE})`);
    expect(source).toContain('(define-data-var collection-name (string-ascii 64) "Test Collection")');
    expect(source).toContain('(define-data-var collection-symbol (string-ascii 16) "TEST")');
    expect(source).toContain('(define-data-var artwork-uri (string-ascii 256) "ipfs://cover")');
    expect(source).toContain('(define-data-var base-uri (string-ascii 256) "https://example.test/")');
    expect(source).toContain('(define-data-var supply-mode uint MODE-OPEN)');
    expect(source).toContain('(define-data-var max-supply uint u0)');
    expect(source).toContain('(define-data-var reservation-expiry-blocks uint u1440)');
    expect(source).toContain('(define-data-var paused bool true)');
    expect(source).toContain(`(define-data-var drops-authority (optional principal) (some '${DROPS}))`);
  });

  it('removes every trace of the simnet mock core', () => {
    const { source } = buildCollectionSource(draft());
    const live = source
      .split('\n')
      .filter((line) => !line.trimStart().startsWith(';;'))
      .join('\n');
    expect(live).not.toContain('.mock-xtrata-core');
  });

  it('keeps the source structurally balanced after substitution', () => {
    const { source } = buildCollectionSource(draft());
    expect(parenBalance(source)).toBe(0);
    expect(source.split('\n').length).toBe(COLLECTION_TEMPLATE_SOURCE.split('\n').length);
  });

  it('encodes a fixed supply with its cap and the matching mode constant', () => {
    const { source, errors } = buildCollectionSource(draft({ supplyMode: 'fixed', maxSupply: 100 }));
    expect(errors).toEqual([]);
    expect(source).toContain('(define-data-var supply-mode uint MODE-FIXED)');
    expect(source).toContain('(define-data-var max-supply uint u100)');
  });

  it('encodes capped-closable', () => {
    const { source } = buildCollectionSource(draft({ supplyMode: 'capped-closable' }));
    expect(source).toContain('(define-data-var supply-mode uint MODE-CAPPED-CLOSABLE)');
  });

  it('encodes the mint price in microSTX', () => {
    const { source } = buildCollectionSource(draft({ mintPriceMicroStx: 2_500_000n }));
    expect(source).toContain('(define-data-var mint-price uint u2500000)');
  });

  it('writes `none` when no drops authority is configured, and warns', () => {
    const { source, warnings } = buildCollectionSource(draft({ dropsAuthority: null }));
    expect(source).toContain('(define-data-var drops-authority (optional principal) none)');
    expect(warnings.join(' ')).toMatch(/drops authority/i);
  });

  it('escapes quotes so a name cannot break out of the Clarity string', () => {
    const { source } = buildCollectionSource(draft({ name: 'Say "hi"' }));
    expect(source).toContain('(define-data-var collection-name (string-ascii 64) "Say \\"hi\\"")');
    expect(parenBalance(source)).toBe(0);
  });

  it('rejects a fixed supply with no cap', () => {
    const { errors } = buildCollectionSource(draft({ supplyMode: 'fixed', maxSupply: 0 }));
    expect(errors.join(' ')).toMatch(/max supply greater than zero/);
  });

  it('rejects a non-zero cap on an open collection', () => {
    const { errors } = buildCollectionSource(draft({ supplyMode: 'open', maxSupply: 10 }));
    expect(errors.join(' ')).toMatch(/must start with max supply 0/);
  });

  it('rejects non-ASCII metadata the contract could not store', () => {
    const { errors } = buildCollectionSource(draft({ name: 'Ünicode' }));
    expect(errors.join(' ')).toMatch(/printable ASCII/);
  });

  it('rejects a malformed core contract id and does not substitute anything', () => {
    const { errors, source } = buildCollectionSource(draft({ coreContract: 'not-a-contract' }));
    expect(errors.join(' ')).toMatch(/full contract id/);
    expect(source).toBe(COLLECTION_TEMPLATE_SOURCE);
  });

  it('reports a missing marker when the template has drifted', () => {
    const drifted = COLLECTION_TEMPLATE_SOURCE.replace(
      '(define-data-var paused bool true)',
      '(define-data-var is-paused bool true)'
    );
    const { errors } = buildCollectionSource(draft(), drifted);
    expect(errors).toContain('Template marker missing: paused');
  });
});

describe('validateContractName', () => {
  it.each(['my-collection-v1', 'a', 'x9-y'])('accepts %s', (name) => {
    expect(validateContractName(name)).toBeNull();
  });

  it.each(['My-Collection', '1abc', 'has_underscore', '', 'a'.repeat(41)])(
    'rejects %s',
    (name) => {
      expect(validateContractName(name)).not.toBeNull();
    }
  );
});

describe('deployed-source verification', () => {
  const built = buildCollectionSource(draft()).source;

  it('hashes deterministically', () => {
    expect(sourceHash(built)).toBe(sourceHash(built));
    expect(sourceHash(built)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('reports an exact match for identical bytes', () => {
    const result = verifyDeployedSource({ expected: built, actual: built });
    expect(result.match).toBe('exact');
    expect(result.expectedHash).toBe(result.actualHash);
  });

  it('reports a normalized match for whitespace-only differences', () => {
    const reformatted = `${built.replace(/\n/g, '\r\n')}\n\n`;
    const result = verifyDeployedSource({ expected: built, actual: reformatted });
    expect(result.match).toBe('normalized');
    expect(result.expectedHash).not.toBe(result.actualHash);
    expect(result.expectedNormalizedHash).toBe(result.actualNormalizedHash);
  });

  it('reports no match when a single constant differs', () => {
    const tampered = built.replace(
      `(define-constant ALLOWED-XTRATA-CONTRACT '${CORE})`,
      "(define-constant ALLOWED-XTRATA-CONTRACT 'SP000000000000000000002Q6VF78.evil-core)"
    );
    expect(verifyDeployedSource({ expected: built, actual: tampered }).match).toBe('none');
  });

  it('normalizeSource collapses line endings and trailing whitespace only', () => {
    expect(normalizeSource('a  \r\nb\t\n\n\n')).toBe('a\nb\n');
  });

  it('assertDeployedSourceMatches throws checksum-mismatch on a real difference', () => {
    const tampered = built.replace('MODE-OPEN', 'MODE-FIXED');
    expect(() =>
      assertDeployedSourceMatches({
        expected: built,
        actual: tampered,
        contractId: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.c-v1'
      })
    ).toThrow(XtrataClientError);
    try {
      assertDeployedSourceMatches({
        expected: built,
        actual: tampered,
        contractId: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.c-v1'
      });
    } catch (error) {
      expect((error as XtrataClientError).code).toBe('checksum-mismatch');
      expect((error as XtrataClientError).retryable).toBe(false);
    }
  });

  it('assertDeployedSourceMatches passes a whitespace-only reformat', () => {
    const result = assertDeployedSourceMatches({
      expected: built,
      actual: `${built}\n`,
      contractId: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.c-v1'
    });
    expect(result.match).toBe('normalized');
  });
});
