import { describe, expect, it, vi } from 'vitest';
import type { InscriptionMeta } from '../../protocol/types';
import type { XStrataClient } from '../../contract/client';
import { fetchTokenSummary } from '../queries';

const createMeta = (mimeType: string, owner = 'STOWNER'): InscriptionMeta => ({
  owner,
  creator: null,
  mimeType,
  totalSize: 1n,
  totalChunks: 1n,
  sealed: true,
  finalHash: new Uint8Array([0])
});

describe('viewer queries', () => {
  it('skips svg fetch for non-svg mime types', async () => {
    const client = {
      getInscriptionMeta: vi.fn().mockResolvedValue(createMeta('image/png')),
      getTokenUri: vi.fn().mockResolvedValue('data:image/png;base64,AA=='),
      getOwner: vi.fn().mockResolvedValue('STOWNER'),
      getSvgDataUri: vi.fn().mockResolvedValue('data:image/svg+xml;base64,AA==')
    } as unknown as XStrataClient;

    const summary = await fetchTokenSummary({
      client,
      id: 1n,
      senderAddress: 'STTEST'
    });

    expect(client.getSvgDataUri).not.toHaveBeenCalled();
    expect(summary.svgDataUri).toBeNull();
  });

  it('handles svg errors and owner fallback', async () => {
    const client = {
      getInscriptionMeta: vi.fn().mockResolvedValue(createMeta('image/svg+xml', 'STMETA')),
      getTokenUri: vi.fn().mockResolvedValue(null),
      getOwner: vi.fn().mockResolvedValue(null),
      getSvgDataUri: vi.fn().mockRejectedValue(new Error('missing'))
    } as unknown as XStrataClient;

    const summary = await fetchTokenSummary({
      client,
      id: 2n,
      senderAddress: 'STTEST'
    });

    expect(client.getSvgDataUri).toHaveBeenCalledTimes(1);
    expect(summary.svgDataUri).toBeNull();
    expect(summary.owner).toBe('STMETA');
  });
});
