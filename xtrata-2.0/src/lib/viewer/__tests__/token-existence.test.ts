import { describe, expect, it, vi } from 'vitest';
import { fetchTokenExistence } from '../queries';
import type { XtrataClient } from '../../contract/client';

const makeClient = (
  overrides: Partial<XtrataClient> & {
    contract: XtrataClient['contract'];
  }
): XtrataClient => overrides as unknown as XtrataClient;

const contract = {
  address: 'SP000000000000000000002Q6VF78',
  name: 'xtrata-core'
} as XtrataClient['contract'];

describe('fetchTokenExistence', () => {
  it('issues only a getOwner read and returns an owner-only summary', async () => {
    const getOwner = vi.fn().mockResolvedValue('SP1OWNER');
    const getInscriptionMeta = vi.fn();
    const getTokenUri = vi.fn();
    const getSvgDataUri = vi.fn();

    const client = makeClient({
      contract,
      getOwner,
      getInscriptionMeta,
      getTokenUri,
      getSvgDataUri
    });

    const summary = await fetchTokenExistence({
      client,
      id: 7n,
      senderAddress: 'SP1SENDER'
    });

    expect(getOwner).toHaveBeenCalledTimes(1);
    expect(getOwner).toHaveBeenCalledWith(7n, 'SP1SENDER');
    // No metadata/URI/media reads — this is validation only.
    expect(getInscriptionMeta).not.toHaveBeenCalled();
    expect(getTokenUri).not.toHaveBeenCalled();
    expect(getSvgDataUri).not.toHaveBeenCalled();

    expect(summary.owner).toBe('SP1OWNER');
    expect(summary.meta).toBeNull();
    expect(summary.tokenUri).toBeNull();
    expect(summary.svgDataUri).toBeNull();
  });

  it('returns a null owner when the token does not exist (read fails)', async () => {
    const client = makeClient({
      contract,
      getOwner: vi.fn().mockRejectedValue(new Error('no such token'))
    });

    const summary = await fetchTokenExistence({
      client,
      id: 999n,
      senderAddress: 'SP1SENDER'
    });

    expect(summary.owner).toBeNull();
  });
});
