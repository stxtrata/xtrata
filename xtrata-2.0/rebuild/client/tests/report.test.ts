import { describe, it, expect } from 'vitest';
import { buildReport, reportToJson, reportToMarkdown } from '../src/report.js';
import { initialProgress, transition } from '../src/progress.js';
import { manifestOf } from './fixtures.js';
import { XtrataClientError, chainRejected, isRetryable, ERROR_TAXONOMY } from '../src/errors.js';

const now = () => new Date('2026-07-24T12:00:00.000Z');

describe('buildReport', () => {
  const manifest = manifestOf(3);

  const progress = (() => {
    let a = initialProgress(0, 1, now);
    a = transition(a, 'seal-submitted', { txid: 'tx-a', feePaidMicroStx: 3000n, now });
    a = transition(a, 'confirmed', { tokenId: 101, now });
    a = transition(a, 'indexed', { now });
    let b = initialProgress(1, 1, now);
    b = transition(b, 'reserved', { txid: 'tx-b', feePaidMicroStx: 500n, now });
    b = transition(b, 'failed', { error: 'wallet-rejected', now });
    const c = initialProgress(2, 1, now);
    return [a, b, c];
  })();

  it('per-item outcomes with token ids, tx counts, fees, errors', () => {
    const report = buildReport({ manifest, progress, estimatedFeeMicroStx: 4000n, now });
    expect(report.items).toHaveLength(3);
    expect(report.items[0]).toMatchObject({
      index: 0,
      state: 'indexed',
      tokenId: 101,
      txCount: 1,
      feePaidMicroStx: '3000'
    });
    expect(report.items[1]).toMatchObject({ state: 'failed', error: 'wallet-rejected' });
    expect(report.items[2]).toMatchObject({ state: 'prepared', txCount: 0 });
    expect(report.totals).toMatchObject({
      items: 3,
      succeeded: 1,
      failed: 1,
      inFlight: 1,
      txCount: 2,
      feePaidMicroStx: '3500',
      estimatedFeeMicroStx: '4000',
      feeDeltaMicroStx: '-500'
    });
    expect(report.manifestChecksum).toBe(manifest.checksum);
  });

  it('items with no progress default to prepared', () => {
    const report = buildReport({ manifest, progress: [], now });
    expect(report.items.every((i) => i.state === 'prepared')).toBe(true);
    expect(report.totals.estimatedFeeMicroStx).toBeUndefined();
  });

  it('serializes to JSON round-trippably', () => {
    const report = buildReport({ manifest, progress, now });
    const parsed = JSON.parse(reportToJson(report));
    expect(parsed).toEqual(report);
  });

  it('renders markdown with totals and per-item rows', () => {
    const report = buildReport({ manifest, progress, estimatedFeeMicroStx: 4000n, now });
    const md = reportToMarkdown(report);
    expect(md).toContain('# Collection Report — Test Collection');
    expect(md).toContain('| 0 | file-1.bin | indexed | 101 | 1 | 0.003000 STX |');
    expect(md).toContain('wallet-rejected');
    expect(md).toContain('Estimate: 0.004000 STX');
    expect(md).toContain('Delta: -0.000500 STX');
  });
});

describe('errors taxonomy', () => {
  it('every code carries retryable flag and user message', () => {
    for (const [code, descriptor] of Object.entries(ERROR_TAXONOMY)) {
      const err = new XtrataClientError(code as never, 'msg');
      expect(err.retryable).toBe(descriptor.retryable);
      expect(err.userMessage).toBe(descriptor.userMessage);
      expect(err.code).toBe(code);
    }
  });

  it('retryable classification: wallet/broadcast/timeout retryable; mismatch/chain not', () => {
    expect(isRetryable(new XtrataClientError('wallet-rejected', 'x'))).toBe(true);
    expect(isRetryable(new XtrataClientError('broadcast-failed', 'x'))).toBe(true);
    expect(isRetryable(new XtrataClientError('timeout-unconfirmed', 'x'))).toBe(true);
    expect(isRetryable(new XtrataClientError('reconcile-mismatch', 'x'))).toBe(false);
    expect(isRetryable(new XtrataClientError('checksum-mismatch', 'x'))).toBe(false);
    expect(isRetryable(new Error('plain'))).toBe(false);
  });

  it('chainRejected carries the contract error code and annotation', () => {
    const err = chainRejected(103);
    expect(err.code).toBe('chain-rejected');
    expect(err.chainErrorCode).toBe(103);
    expect(err.message).toContain('u103');
    expect(err.message).toContain('HASH-MISMATCH');
    expect(err.retryable).toBe(false);
  });
});
