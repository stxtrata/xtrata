import { describe, expect, it } from 'vitest';
import { buildTwinMetadata, cacheControlFor, findToken, parseTokenFile, type Manifest, type ResolverConfig } from '../lib';

const config: ResolverConfig = {
  publicBase: 'https://xtrata.xyz',
  network: 'mainnet',
  master: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
  collections: {
    'nyc-degens': {
      label: 'NYC Degens',
      source: 'SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.nyc-degens',
      helper: 'SP000000000000000000002Q6VF78.helper',
      manifestPath: '/ft/data/nyc-degens.manifest.json',
      manifestSha256: 'abc',
      manifestStatus: 'draft'
    }
  }
};
const manifest: Manifest = {
  collectionKey: 'nyc-degens',
  source: config.collections['nyc-degens'].source,
  count: 2,
  snapshot: { stacksTipHeight: 9127020, takenAt: '2026-10-05T12:50:39.145Z' },
  tokens: [1, 2].map((id) => ({
    id,
    original: { metadataUri: `ipfs://x/${id}.json`, mediaUris: [`ipfs://y/${id}.png`], mediaSha256: ['aa'] },
    twin: { contentHash: '0x01', sha256: 'aa', mime: 'image/png', totalSize: 100 }
  }))
};
const collection = config.collections['nyc-degens'];

describe('parseTokenFile', () => {
  it('accepts plain integers with .json', () => {
    expect(parseTokenFile('12.json')).toBe(12);
    expect(parseTokenFile('420.json')).toBe(420);
  });
  it('rejects everything else', () => {
    for (const bad of ['0.json', '012.json', '-1.json', '1.JSON', '1', '1.json.js', '../1.json', '1e3.json', '']) {
      expect(parseTokenFile(bad)).toBeNull();
    }
  });
});

describe('findToken', () => {
  it('finds by id and returns undefined for out of range', () => {
    expect(findToken(manifest, 2)?.id).toBe(2);
    expect(findToken(manifest, 3)).toBeUndefined();
  });
});

describe('buildTwinMetadata', () => {
  it('points at the on-chain inscription once inscribed', () => {
    const m = buildTwinMetadata({ config, key: 'nyc-degens', collection, manifest, token: manifest.tokens[0], state: { status: 'inscribed', xtrataId: 3456n } }) as Record<string, any>;
    expect(m.name).toBe('NYC Degens #1 (Forever Twin)');
    expect(m.image).toBe('https://xtrata.xyz/inscription/mainnet/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3/3456');
    expect(m.properties.twin.xtrata_id).toBe('3456');
    expect(m.properties.original.token_id).toBe(1);
  });
  it('has no image before the twin exists', () => {
    const m = buildTwinMetadata({ config, key: 'nyc-degens', collection, manifest, token: manifest.tokens[0], state: { status: 'not-inscribed' } }) as Record<string, any>;
    expect(m.image).toBeUndefined();
    expect(m.properties.status).toBe('not-inscribed');
    expect(m.properties.twin.xtrata_id).toBeNull();
  });
});

describe('cacheControlFor', () => {
  it('caches inscribed twins for a day and pending ones briefly', () => {
    expect(cacheControlFor({ status: 'inscribed', xtrataId: 1n })).toContain('86400');
    expect(cacheControlFor({ status: 'not-inscribed' })).toContain('30');
  });
});
