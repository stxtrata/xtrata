import { describe, expect, it } from 'vitest';
import { classify, errorDiagnosticContext } from '../classify';

describe('telemetry error classification', () => {
  it('gives wallet JSON-RPC internal errors a stable code', () => {
    expect(classify(Object.assign(new Error('Internal error.'), { code: -32603 }), 'mint')).toBe(
      'WALLET_RPC_INTERNAL'
    );
    expect(classify(new Error('Internal error.'), 'mint')).toBe('WALLET_RPC_INTERNAL');
  });

  it('allowlists provider diagnostics and excludes arbitrary data', () => {
    expect(
      errorDiagnosticContext({
        code: -32603,
        stage: 'stx_callContract',
        data: { reason: 'failed', signature: 'secret', transaction: 'raw' }
      })
    ).toEqual({
      code: -32603,
      stage: 'stx_callContract',
      data: { reason: 'failed' }
    });
  });
});
