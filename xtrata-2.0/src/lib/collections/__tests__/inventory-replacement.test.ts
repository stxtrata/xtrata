import { describe, expect, it } from 'vitest';
import {
  buildCollectionAssetPreviewUrl,
  parseReplacementRecord,
  planReplacement,
  replacementStartBlockers,
  replacementUploadProblems,
  type InventoryReplacementRecord,
  type ReplacementChainState
} from '../inventory-replacement';

const OLD = 'a'.repeat(64);
const NEW = 'b'.repeat(64);
const record = (replacement = true): InventoryReplacementRecord => ({
  version: 1, id: 'r1', status: 'open', contractId: 'SP1.helper', startedAt: 1, startedBy: null, updatedAt: 1, completedAt: null,
  items: [{
    assetId: 'a84', path: '84.html',
    original: { hash: OLD, storageKey: 'c/old', bytes: 600, chunks: 1, mimeType: 'text/html', tokenUri: 'data:x' },
    replacement: replacement ? { hash: NEW, storageKey: 'c/new', bytes: 900, chunks: 1, mimeType: 'text/html' } : null
  }],
  txs: { register: [], clear: [] }
});
const chain = (item: Partial<ReplacementChainState['items'][number]> = {}, top: Partial<ReplacementChainState> = {}): ReplacementChainState => ({
  paused: true, finalized: false,
  items: [{ assetId: 'a84', originalRegistered: true, originalMinted: false, originalReserved: false, replacementRegistered: false, replacementOnCore: false, ...item }],
  ...top
});

describe('planReplacement', () => {
  it('walks upload → register → clear → finish from the chain alone', () => {
    expect(planReplacement(record(false), chain({ replacementRegistered: null, replacementOnCore: null })).step).toBe('upload');
    expect(planReplacement(record(), chain())).toMatchObject({ step: 'register', toRegister: [NEW], toClear: [OLD] });
    expect(planReplacement(record(), chain({ replacementRegistered: true }))).toMatchObject({ step: 'clear', toClear: [OLD] });
    expect(planReplacement(record(), chain({ replacementRegistered: true, originalRegistered: false })).step).toBe('finish');
    expect(planReplacement({ ...record(), status: 'complete' }, chain()).step).toBe('done');
  });

  it('blocks when minting reopened, the file was minted or reserved, or the new file is already inscribed', () => {
    expect(planReplacement(record(), chain({}, { paused: false })).blockers[0]).toContain('Pause');
    expect(planReplacement(record(), chain({}, { finalized: true })).step).toBe('blocked');
    expect(planReplacement(record(), chain({ originalMinted: true })).blockers.join(' ')).toContain('minted');
    expect(planReplacement(record(), chain({ originalReserved: true })).blockers.join(' ')).toContain('reserved');
    expect(planReplacement(record(), chain({ replacementOnCore: true })).blockers.join(' ')).toContain('already inscribed');
    expect(planReplacement(record(), { paused: true, finalized: false, items: [] }).step).toBe('blocked');
  });
});

describe('start and upload checks', () => {
  it('names every reason a file cannot be replaced', () => {
    const blockers = replacementStartBlockers({ paused: false, finalized: true, items: [
      { path: '84.html', assetState: 'draft', minted: true, reserved: false },
      { path: '90.html', assetState: 'draft', minted: false, reserved: true },
      { path: '91.html', assetState: 'sold-out', minted: false, reserved: false }
    ] });
    expect(blockers).toHaveLength(5);
    expect(replacementStartBlockers({ paused: true, finalized: false, items: [{ path: '84.html', assetState: 'draft', minted: false, reserved: false }] })).toEqual([]);
  });

  it('rejects identical, duplicate and already-inscribed replacement files', () => {
    const base = { path: '84.html', newHash: NEW, originalHash: OLD, otherHashes: [] as string[], inscribedOnCore: false };
    expect(replacementUploadProblems(base)).toEqual([]);
    expect(replacementUploadProblems({ ...base, newHash: OLD })[0]).toContain('identical to the current');
    expect(replacementUploadProblems({ ...base, otherHashes: [NEW] })[0]).toContain('another file');
    expect(replacementUploadProblems({ ...base, inscribedOnCore: true })[0]).toContain('inscribed');
  });
});

describe('records and preview URLs', () => {
  it('round-trips a record and ignores malformed ones', () => {
    expect(parseReplacementRecord({ inventoryReplacement: record() })).toEqual(record());
    expect(parseReplacementRecord({ inventoryReplacement: { ...record(), items: [] } })).toBeNull();
    expect(parseReplacementRecord({ inventoryReplacement: { ...record(), status: 'weird' } })).toBeNull();
    expect(parseReplacementRecord(null)).toBeNull();
  });

  it('versions preview URLs by content so a replaced file is a new URL', () => {
    expect(buildCollectionAssetPreviewUrl('c 1', 'a84', { version: NEW })).toBe(`/collections/c%201/asset-preview?assetId=a84&v=${NEW.slice(0, 16)}`);
    expect(buildCollectionAssetPreviewUrl('c1', 'a84', { version: 'not-a-hash', purpose: 'cover' })).toBe('/collections/c1/asset-preview?assetId=a84&purpose=cover');
  });
});
