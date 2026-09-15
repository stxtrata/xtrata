import { describe, expect, it } from 'vitest';
import {
  shouldUseCollectionSmallSingleTx,
  supportsCollectionSmallSingleTx
} from '../routing';

describe('collection mint routing', () => {
  it('supports single-tx collection mint for v1.4+', () => {
    expect(supportsCollectionSmallSingleTx('xtrata-collection-mint-v1.4')).toBe(
      true
    );
    expect(supportsCollectionSmallSingleTx('xtrata-collection-mint-v1.5')).toBe(
      true
    );
  });

  it('honors the deployed v1.5 limit: 30 chunks, despite the 32-item ABI list', () => {
    for (const chunkCount of [1, 30, 31, 32, 33]) {
      expect(shouldUseCollectionSmallSingleTx({ templateVersion: 'xtrata-collection-mint-v1.5', chunkCount, hasReservation: false, hasUploadState: false })).toBe(chunkCount <= 30);
    }
  });

  it('does not support single-tx collection mint before v1.4', () => {
    expect(supportsCollectionSmallSingleTx('xtrata-collection-mint-v1.3')).toBe(
      false
    );
    expect(supportsCollectionSmallSingleTx('xtrata-collection-mint-v1.2')).toBe(
      false
    );
  });

  it('routes to single-tx when file is within chunk limit and no resume state exists', () => {
    expect(
      shouldUseCollectionSmallSingleTx({
        templateVersion: 'xtrata-collection-mint-v1.4',
        chunkCount: 30,
        hasReservation: false,
        hasUploadState: false
      })
    ).toBe(true);
  });

  it('falls back to 3-step flow when chunk count exceeds limit', () => {
    expect(
      shouldUseCollectionSmallSingleTx({
        templateVersion: 'xtrata-collection-mint-v1.4',
        chunkCount: 31,
        hasReservation: false,
        hasUploadState: false
      })
    ).toBe(false);
  });

  it('falls back to 3-step flow when reservation or upload state already exists', () => {
    expect(
      shouldUseCollectionSmallSingleTx({
        templateVersion: 'xtrata-collection-mint-v1.4',
        chunkCount: 12,
        hasReservation: true,
        hasUploadState: false
      })
    ).toBe(false);
    expect(
      shouldUseCollectionSmallSingleTx({
        templateVersion: 'xtrata-collection-mint-v1.4',
        chunkCount: 12,
        hasReservation: false,
        hasUploadState: true
      })
    ).toBe(false);
  });
});
