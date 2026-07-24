import { describe, expect, it } from 'vitest';
import source from '../../../../contracts/live/xtrata-drops-v1.2.clar?raw';
import {
  DROPS_V12_CONTRACT_NAME,
  DROPS_V12_SOURCE_PATH,
  classifyTxStatus,
  deploymentConfirmation,
  extractTxId,
  formatCanaryLog,
  inspectDropsV12Source
} from '../drops-v1-2-canary';

describe('Drops v1.2 deployment canary helpers', () => {
  it('pins and validates the bundled immutable source', () => {
    expect(DROPS_V12_CONTRACT_NAME).toBe('xtrata-drops-v1-2');
    expect(DROPS_V12_SOURCE_PATH).toBe('contracts/live/xtrata-drops-v1.2.clar');
    expect(inspectDropsV12Source(source)).toEqual([]);
  });

  it('fails closed when draft campaigns would start claimable', () => {
    expect(inspectDropsV12Source(source.replace('active: false', 'active: true'))).toContain(
      'campaigns must start claim-closed'
    );
  });

  it('binds typed deployment confirmation to the contract and source hash', () => {
    expect(deploymentConfirmation('1234567890abcdef')).toBe(
      'DEPLOY xtrata-drops-v1-2 1234567890ab'
    );
  });

  it('classifies transaction states conservatively', () => {
    expect(classifyTxStatus('success')).toBe('success');
    expect(classifyTxStatus('abort_by_response')).toBe('failed');
    expect(classifyTxStatus('pending')).toBe('pending');
    expect(classifyTxStatus(undefined)).toBe('pending');
  });

  it('normalizes wallet transaction IDs and audit output', () => {
    expect(extractTxId({ txId: '0xabc' })).toBe('0xabc');
    expect(extractTxId({ txid: '0xdef' })).toBe('0xdef');
    expect(extractTxId({})).toBeNull();
    expect(
      formatCanaryLog([
        {
          at: '2026-07-24T12:00:00.000Z',
          action: 'preflight',
          level: 'success',
          message: 'Source passed.'
        }
      ])
    ).toContain('SUCCESS | preflight | Source passed.');
  });
});
