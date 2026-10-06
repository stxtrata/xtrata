import { describe, expect, it } from 'vitest';
import v19Template from '../../../../contracts/live/xtrata-collection-mint-v1.9.clar?raw';
import v19Clarinet from '../../../../contracts/clarinet/contracts/xtrata-collection-mint-v1.9.clar?raw';
import v17Template from '../../../../contracts/live/xtrata-collection-mint-v1.7.clar?raw';
import preinscribedTemplate from '../../../../contracts/live/xtrata-preinscribed-collection-sale-v1.0.clar?raw';
import { buildArtistDeployContractSource } from '../artist-deploy';
import {
  COLLECTION_TEMPLATE_FINGERPRINTS,
  compactClaritySource,
  fingerprintCollectionSource,
  normalizeCollectionSource,
  verifyCollectionSource
} from '../template-fingerprint';

const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const LEGACY_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0';
const ARTIST = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
const expectedCoreFor = (template: string) =>
  template === 'xtrata-preinscribed-collection-sale-v1.0' ? LEGACY_CORE : CORE;

/** What the studio deploys: the builder's output, compacted like the wizard does. */
const deployed = (overrides: Partial<Parameters<typeof buildArtistDeployContractSource>[0]['input']> = {}) => {
  const build = buildArtistDeployContractSource({
    input: {
      collectionName: 'Audionauts "2.0" \\ test',
      symbol: 'NAUT',
      description: 'Two layers. One signal.',
      supply: '111',
      mintType: 'standard',
      mintPriceStx: '20',
      artistAddress: ARTIST,
      marketplaceAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
      parentInscriptions: '3060, 3059',
      ...overrides
    },
    templateSources: { standardSource: v19Template, preinscribedSource: preinscribedTemplate },
    coreContractId: overrides.mintType === 'pre-inscribed' ? LEGACY_CORE : CORE,
    operatorAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'
  });
  expect(build.errors).toEqual([]);
  return compactClaritySource(build.source);
};

describe('approved template fingerprints', () => {
  it('match the templates in contracts/live (update the constant if this fails)', async () => {
    expect({
      'xtrata-collection-mint-v1.9': await fingerprintCollectionSource(v19Template),
      'xtrata-preinscribed-collection-sale-v1.0': await fingerprintCollectionSource(preinscribedTemplate)
    }).toEqual(COLLECTION_TEMPLATE_FINGERPRINTS);
  });

  it('the Clarinet variant differs only in the core pin', async () => {
    expect(await fingerprintCollectionSource(v19Clarinet)).toBe(COLLECTION_TEMPLATE_FINGERPRINTS['xtrata-collection-mint-v1.9']);
    expect(normalizeCollectionSource(v19Clarinet).coreReferences.every((ref) => ref === '.xtrata-v3-2-3')).toBe(true);
  });
});

describe('verifyCollectionSource', () => {
  it('accepts what the studio deploys for v1.9, whatever the collection values', async () => {
    for (const source of [deployed(), deployed({ collectionName: 'X', mintPriceStx: '0', parentInscriptions: '' })]) {
      await expect(verifyCollectionSource({ source, expectedCoreFor })).resolves.toEqual({
        ok: true, template: 'xtrata-collection-mint-v1.9'
      });
    }
  });

  it('accepts an uncompacted deploy of the same code (e.g. from the SDK)', async () => {
    const build = buildArtistDeployContractSource({
      input: { collectionName: 'A', symbol: 'A', description: '', supply: '1', mintType: 'standard', mintPriceStx: '1',
        artistAddress: ARTIST, marketplaceAddress: ARTIST },
      templateSources: { standardSource: v19Template, preinscribedSource: preinscribedTemplate },
      coreContractId: CORE, operatorAddress: ARTIST
    });
    await expect(verifyCollectionSource({ source: build.source, expectedCoreFor })).resolves.toMatchObject({ ok: true });
  });

  it('accepts the pre-inscribed sale pinned to its core', async () => {
    const source = deployed({ mintType: 'pre-inscribed' });
    await expect(verifyCollectionSource({ source, expectedCoreFor })).resolves.toEqual({
      ok: true, template: 'xtrata-preinscribed-collection-sale-v1.0'
    });
  });

  it('refuses v1.7, where the creator can set Xtrata\'s share to zero', async () => {
    const verdict = await verifyCollectionSource({ source: v17Template, expectedCoreFor });
    expect(verdict.ok).toBe(false);
  });

  it('refuses any change to the logic, however small', async () => {
    const source = deployed();
    const tampered = [
      source.replace('(define-constant PLATFORM-MIN-BPS u250)', '(define-constant PLATFORM-MIN-BPS u0)'),
      source.replace('(define-constant PLATFORM-MAX-BPS u1500)', '(define-constant PLATFORM-MAX-BPS u10000)'),
      source.replace('(try! (assert-finance-admin))', '(try! (ok true))'),
      `${source}\n(define-public (drain) (ok true))`,
      source.replace(/\(asserts! \(get valid check\) ERR-INVALID-SPLITS\)\n/, '')
    ];
    for (const variant of tampered) {
      expect(variant).not.toBe(source);
      await expect(verifyCollectionSource({ source: variant, expectedCoreFor })).resolves.toMatchObject({ ok: false });
    }
  });

  it('refuses code smuggled onto a value line', async () => {
    const source = deployed();
    const smuggled = source.replace(
      /^\(define-data-var collection-name \(string-ascii 64\) ".*"\)$/m,
      '(define-data-var collection-name (string-ascii 64) "x") (define-public (drain) (ok true)) (define-data-var y (string-ascii 64) "z")'
    );
    const price = source.replace(/^\(define-data-var mint-price uint u\d+\)$/m, '(define-data-var mint-price uint (+ u1 u2))');
    for (const variant of [smuggled, price]) {
      expect(variant).not.toBe(source);
      await expect(verifyCollectionSource({ source: variant, expectedCoreFor })).resolves.toMatchObject({ ok: false });
    }
  });

  it('refuses a contract pinned to, or calling, anything but the Xtrata core', async () => {
    const source = deployed();
    const fakeCore = 'SP1A5M0ZRSNQMF8BNPQPM8WWC5PJ6HJ4GEKFP8W4M.xtrata-v3-2-3';
    const repinned = source.split(CORE).join(fakeCore);
    const oneCall = source.replace(`(contract-call? '${CORE} get-owner`, `(contract-call? '${fakeCore} get-owner`);
    for (const variant of [repinned, oneCall]) {
      expect(variant).not.toBe(source);
      const verdict = await verifyCollectionSource({ source: variant, expectedCoreFor });
      expect(verdict).toMatchObject({ ok: false });
      expect((verdict as { reason: string }).reason).toContain('not pinned');
    }
  });
});
