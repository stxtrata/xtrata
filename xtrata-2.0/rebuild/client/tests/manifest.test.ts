import { describe, it, expect } from 'vitest';
import {
  canonicalJson,
  computeManifestChecksum,
  exportManifest,
  importManifest,
  sealManifest,
  superseding
} from '../src/manifest.js';
import { XtrataClientError } from '../src/errors.js';
import { manifestOf } from './fixtures.js';

describe('canonicalJson', () => {
  it('sorts object keys at every level and is whitespace-free', () => {
    expect(canonicalJson({ b: 1, a: { z: [1, 2], y: 'x' } })).toBe('{"a":{"y":"x","z":[1,2]},"b":1}');
  });

  it('key insertion order does not affect output', () => {
    expect(canonicalJson({ a: 1, b: 2 })).toBe(canonicalJson({ b: 2, a: 1 }));
  });

  it('omits undefined-valued keys, keeps nulls', () => {
    expect(canonicalJson({ a: undefined, b: null })).toBe('{"b":null}');
  });

  it('rejects non-finite numbers', () => {
    expect(() => canonicalJson({ a: Infinity })).toThrow(XtrataClientError);
  });
});

describe('manifest round-trip', () => {
  it('export → import preserves the manifest exactly', () => {
    const manifest = manifestOf(3, (i) => i + 1);
    const json = exportManifest(manifest);
    const imported = importManifest(json);
    expect(imported).toEqual(manifest);
    // Deterministic serialization: exporting again is byte-identical.
    expect(exportManifest(imported)).toBe(json);
  });

  it('checksum is stable and matches recomputation', () => {
    const manifest = manifestOf(2);
    expect(computeManifestChecksum(manifest)).toBe(manifest.checksum);
  });

  it('tampered content fails import with checksum-mismatch', () => {
    const manifest = manifestOf(2);
    const tampered = JSON.parse(exportManifest(manifest));
    tampered.items[0].fileName = 'evil.bin';
    let caught: unknown;
    try {
      importManifest(JSON.stringify(tampered));
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(XtrataClientError);
    expect((caught as XtrataClientError).code).toBe('checksum-mismatch');
  });

  it('tampered checksum field also fails', () => {
    const manifest = manifestOf(1);
    const tampered = JSON.parse(exportManifest(manifest));
    tampered.checksum = '0'.repeat(64);
    expect(() => importManifest(JSON.stringify(tampered))).toThrow(/checksum mismatch/);
  });

  it('structurally invalid manifests fail with manifest-invalid', () => {
    expect(() => importManifest('not json')).toThrow(/not valid JSON/);
    const manifest = JSON.parse(exportManifest(manifestOf(1)));
    manifest.items[0].index = 5; // breaks dense ordering
    let caught: unknown;
    try {
      importManifest(JSON.stringify(manifest));
    } catch (err) {
      caught = err;
    }
    expect((caught as XtrataClientError).code).toBe('manifest-invalid');
  });

  it('rejects duplicate item indexes', () => {
    const manifest = JSON.parse(exportManifest(manifestOf(2)));
    manifest.items[1].index = 0;
    expect(() => importManifest(JSON.stringify(manifest))).toThrow();
  });
});

describe('supersedes versioning', () => {
  it('records the previous checksum and keeps createdAt', () => {
    const v1 = manifestOf(2);
    const { checksum: _drop, supersedes: _s, ...body } = v1;
    const v2 = superseding(v1, { ...body, updatedAt: '2026-07-25T00:00:00.000Z' });
    expect(v2.supersedes).toBe(v1.checksum);
    expect(v2.createdAt).toBe(v1.createdAt);
    expect(v2.checksum).not.toBe(v1.checksum);
    // v2 round-trips
    expect(importManifest(exportManifest(v2))).toEqual(v2);
  });
});

describe('sealManifest', () => {
  it('export rejects a manifest whose checksum is stale', () => {
    const manifest = manifestOf(1);
    const stale = { ...manifest, updatedAt: '2027-01-01T00:00:00.000Z' };
    expect(() => exportManifest(stale)).toThrow(/checksum/);
    const resealed = sealManifest(stale);
    expect(() => exportManifest(resealed)).not.toThrow();
  });
});
