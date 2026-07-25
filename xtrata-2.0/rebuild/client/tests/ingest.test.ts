import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { CHUNK_SIZE, MAX_SINGLE_TX_BYTES } from '../src/hash.js';
import { ingestFiles, naturalSortByName, type IngestFile } from '../src/ingest.js';
import { XtrataClientError } from '../src/errors.js';
import { baseOptions, bytesOf } from './fixtures.js';

const file = (name: string, bytes: Uint8Array, mimeType = 'image/png'): IngestFile => ({
  name,
  bytes,
  mimeType
});

describe('ingestFiles', () => {
  it('preserves caller order and assigns dense indexes', () => {
    const result = ingestFiles(
      [file('c.png', bytesOf(1, 10)), file('a.png', bytesOf(2, 10)), file('b.png', bytesOf(3, 10))],
      baseOptions
    );
    expect(result.manifest.items.map((i) => i.fileName)).toEqual(['c.png', 'a.png', 'b.png']);
    expect(result.manifest.items.map((i) => i.index)).toEqual([0, 1, 2]);
  });

  it('computes plain sha256 and chain hash per item', () => {
    const bytes = bytesOf(9, 100);
    const { manifest } = ingestFiles([file('x.png', bytes)], baseOptions);
    const item = manifest.items[0]!;
    expect(item.sha256Hex).toBe(createHash('sha256').update(Buffer.from(bytes)).digest('hex'));
    expect(item.contentHashHex).toHaveLength(64);
    expect(item.contentHashHex).not.toBe(item.sha256Hex);
    expect(item.byteLength).toBe(100);
    expect(item.chunkCount).toBe(1);
  });

  it('mode selection: single-tx at ≤32 chunks, staged at 33', () => {
    const { manifest } = ingestFiles(
      [
        file('exact-32.bin', bytesOf(1, MAX_SINGLE_TX_BYTES), 'application/octet-stream'),
        file('over-32.bin', bytesOf(2, MAX_SINGLE_TX_BYTES + 1), 'application/octet-stream'),
        file('one-chunk.bin', bytesOf(3, CHUNK_SIZE), 'application/octet-stream')
      ],
      baseOptions
    );
    expect(manifest.items.map((i) => [i.chunkCount, i.mode])).toEqual([
      [32, 'single-tx'],
      [33, 'staged'],
      [1, 'single-tx']
    ]);
  });

  describe('duplicate handling matrix', () => {
    const dup = bytesOf(42, 50);
    const files = [file('a.png', dup), file('b.png', bytesOf(7, 50)), file('c.png', dup)];

    it('reject (default): throws duplicate-content with a report', () => {
      let caught: unknown;
      try {
        ingestFiles(files, baseOptions);
      } catch (err) {
        caught = err;
      }
      expect(caught).toBeInstanceOf(XtrataClientError);
      expect((caught as XtrataClientError).code).toBe('duplicate-content');
      expect((caught as XtrataClientError).message).toContain('a.png');
      expect((caught as XtrataClientError).message).toContain('c.png');
    });

    it('dedupe: keeps first occurrence, reports dropped positions', () => {
      const result = ingestFiles(files, { ...baseOptions, duplicatePolicy: 'dedupe' });
      expect(result.manifest.items.map((i) => i.fileName)).toEqual(['a.png', 'b.png']);
      expect(result.manifest.items.map((i) => i.index)).toEqual([0, 1]);
      expect(result.droppedPositions).toEqual([2]);
      expect(result.duplicates.groups).toHaveLength(1);
      expect(result.duplicates.groups[0]!.fileNames).toEqual(['a.png', 'c.png']);
    });

    it('allow: keeps all items and still reports duplicates', () => {
      const result = ingestFiles(files, { ...baseOptions, duplicatePolicy: 'allow' });
      expect(result.manifest.items).toHaveLength(3);
      expect(result.droppedPositions).toEqual([]);
      expect(result.duplicates.groups).toHaveLength(1);
    });

    it('no duplicates: empty report under every policy', () => {
      for (const duplicatePolicy of ['reject', 'dedupe', 'allow'] as const) {
        const result = ingestFiles(
          [file('a.png', bytesOf(1, 10)), file('b.png', bytesOf(2, 10))],
          { ...baseOptions, duplicatePolicy }
        );
        expect(result.duplicates.groups).toEqual([]);
        expect(result.manifest.items).toHaveLength(2);
      }
    });
  });

  describe('validation', () => {
    it('rejects empty files, empty names, bad mime types', () => {
      expect(() => ingestFiles([file('x.png', new Uint8Array(0))], baseOptions)).toThrow(/empty/);
      expect(() => ingestFiles([file('', bytesOf(1, 10))], baseOptions)).toThrow(/empty name/);
      expect(() => ingestFiles([file('x.png', bytesOf(1, 10), 'notamime')], baseOptions)).toThrow(
        /MIME/
      );
    });

    it('rejects >50 relationships and negative ids', () => {
      const tooMany = { ...file('x.png', bytesOf(1, 10)), dependencies: Array(51).fill(1) };
      expect(() => ingestFiles([tooMany], baseOptions)).toThrow(/50/);
      const negative = { ...file('y.png', bytesOf(2, 10)), parents: [-1] };
      expect(() => ingestFiles([negative], baseOptions)).toThrow(/relationship/);
    });

    it('carries through uri, relationships, and metadata', () => {
      const input = {
        ...file('x.png', bytesOf(1, 10)),
        itemUri: 'ipfs://abc',
        dependencies: [107],
        parents: [5],
        metadata: { trait: 'blue' }
      };
      const { manifest } = ingestFiles([input], baseOptions);
      const item = manifest.items[0]!;
      expect(item.itemUri).toBe('ipfs://abc');
      expect(item.dependencies).toEqual([107]);
      expect(item.parents).toEqual([5]);
      expect(item.metadata).toEqual({ trait: 'blue' });
    });
  });
});

describe('naturalSortByName', () => {
  it('sorts numerically embedded names naturally', () => {
    const files = [{ name: 'img10.png' }, { name: 'img2.png' }, { name: 'img1.png' }];
    expect(naturalSortByName(files).map((f) => f.name)).toEqual(['img1.png', 'img2.png', 'img10.png']);
  });

  it('is stable and does not mutate the input', () => {
    const files = [{ name: 'b' }, { name: 'a' }];
    const sorted = naturalSortByName(files);
    expect(files.map((f) => f.name)).toEqual(['b', 'a']);
    expect(sorted.map((f) => f.name)).toEqual(['a', 'b']);
  });
});
