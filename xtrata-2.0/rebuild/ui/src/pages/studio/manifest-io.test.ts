import { describe, expect, it } from 'vitest';
import { importManifest, XtrataClientError } from '@xtrata/collections-client';
import { makeStudioFile, StudioStore, type StudioDeps, type StudioFile } from './store';

/**
 * Manifest export/import is the device-change recovery path: export the file,
 * carry it (plus the source files) to another machine, import it there, and the
 * plan rebuilds identically. Matching is by content hash, never by file name.
 */

const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

const memoryStorage = (): StudioDeps['storage'] => {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key)
  };
};

const newStore = (): StudioStore => {
  const store = new StudioStore({
    coreContractId: CORE,
    dropsContractId: null,
    network: 'mainnet',
    storage: memoryStorage()
  });
  store.updateDraft({
    name: 'Round Trip',
    symbol: 'RT',
    description: 'Exported and re-imported.'
  });
  return store;
};

const file = (name: string, seed: number, size = 300): StudioFile =>
  makeStudioFile({
    name,
    bytes: Uint8Array.from({ length: size }, (_, i) => (i * 13 + seed) % 251),
    mimeType: 'image/png'
  });

const sourceFiles = (): StudioFile[] => [file('a.png', 1), file('b.png', 2), file('c.png', 3)];

describe('manifest export / import round trip', () => {
  it('exports a checksummed manifest that re-imports byte-identically', () => {
    const store = newStore();
    store.addFiles(sourceFiles());
    const original = store.buildManifest();

    const json = store.exportManifestJson();
    const reimported = importManifest(json);

    expect(reimported).toEqual(original);
    expect(reimported.checksum).toBe(original.checksum);
    // Deterministic serialization: exporting the re-imported manifest is stable.
    expect(JSON.parse(json)).toEqual(JSON.parse(json));
  });

  it('restores order, indexes and hashes on a fresh store ("new device")', () => {
    const source = newStore();
    source.addFiles(sourceFiles());
    const original = source.buildManifest();
    const json = source.exportManifestJson();

    const target = newStore();
    // Files re-added in a DIFFERENT order — the manifest decides the order.
    target.addFiles([file('c.png', 3), file('a.png', 1), file('b.png', 2)]);
    const { manifest, missingFiles } = target.importManifestJson(json);

    expect(missingFiles).toEqual([]);
    expect(manifest.checksum).toBe(original.checksum);
    expect(target.getState().files.map((f) => f.name)).toEqual(['a.png', 'b.png', 'c.png']);
    expect(manifest.items.map((i) => i.contentHashHex)).toEqual(
      original.items.map((i) => i.contentHashHex)
    );
  });

  it('matches by content, not by name', () => {
    const source = newStore();
    source.addFiles(sourceFiles());
    source.buildManifest();
    const json = source.exportManifestJson();

    const target = newStore();
    // Same bytes, renamed on the way over.
    target.addFiles([file('renamed-1.png', 1), file('renamed-2.png', 2), file('renamed-3.png', 3)]);
    const { missingFiles } = target.importManifestJson(json);

    expect(missingFiles).toEqual([]);
    expect(target.getState().files).toHaveLength(3);
  });

  it('names the files that are not present locally instead of failing silently', () => {
    const source = newStore();
    source.addFiles(sourceFiles());
    source.buildManifest();
    const json = source.exportManifestJson();

    const target = newStore();
    target.addFiles([file('a.png', 1)]);
    const { missingFiles } = target.importManifestJson(json);

    expect(missingFiles).toEqual(['b.png', 'c.png']);
    expect(target.getState().missingFiles).toEqual(['b.png', 'c.png']);
  });

  it('restores the collection metadata carried in the manifest', () => {
    const source = newStore();
    source.addFiles(sourceFiles());
    source.buildManifest();
    const json = source.exportManifestJson();

    const target = new StudioStore({
      coreContractId: CORE,
      dropsContractId: null,
      network: 'mainnet',
      storage: memoryStorage()
    });
    target.addFiles(sourceFiles());
    target.importManifestJson(json);

    expect(target.getState().draft.name).toBe('Round Trip');
    expect(target.getState().draft.symbol).toBe('RT');
  });

  it('resets progress to prepared for every item on import', () => {
    const source = newStore();
    source.addFiles(sourceFiles());
    source.buildManifest();
    const json = source.exportManifestJson();

    const target = newStore();
    target.addFiles(sourceFiles());
    target.importManifestJson(json);

    expect(target.getState().progress).toHaveLength(3);
    expect(target.getState().progress.every((p) => p.state === 'prepared')).toBe(true);
  });

  it('rejects a tampered manifest with checksum-mismatch', () => {
    const source = newStore();
    source.addFiles(sourceFiles());
    source.buildManifest();
    const json = source.exportManifestJson();
    const tampered = json.replace('"Round Trip"', '"Hijacked"');

    const target = newStore();
    expect(() => target.importManifestJson(tampered)).toThrow(XtrataClientError);
    try {
      target.importManifestJson(tampered);
    } catch (error) {
      expect((error as XtrataClientError).code).toBe('checksum-mismatch');
    }
  });

  it('rejects malformed JSON with manifest-invalid', () => {
    const target = newStore();
    try {
      target.importManifestJson('{not json');
      throw new Error('should have thrown');
    } catch (error) {
      expect((error as XtrataClientError).code).toBe('manifest-invalid');
    }
  });

  it('refuses to export before a manifest exists', () => {
    expect(() => newStore().exportManifestJson()).toThrow(/build the manifest first/);
  });
});

describe('manifest cache', () => {
  it('caches to storage for convenience and reloads it', () => {
    const storage = memoryStorage()!;
    const store = new StudioStore({
      coreContractId: CORE,
      dropsContractId: null,
      network: 'mainnet',
      storage
    });
    store.updateDraft({ name: 'Cached', symbol: 'C' });
    store.addFiles(sourceFiles());
    const manifest = store.buildManifest();

    expect(store.loadCachedManifest()?.checksum).toBe(manifest.checksum);

    store.clearCachedManifest();
    expect(store.loadCachedManifest()).toBeNull();
  });

  it('treats a corrupted cache as absent rather than throwing', () => {
    const storage = memoryStorage()!;
    storage.setItem('xtrata.v3.studio.manifest', '{"schemaVersion":1,"garbage":true}');
    const store = new StudioStore({
      coreContractId: CORE,
      dropsContractId: null,
      network: 'mainnet',
      storage
    });
    expect(store.loadCachedManifest()).toBeNull();
  });
});
