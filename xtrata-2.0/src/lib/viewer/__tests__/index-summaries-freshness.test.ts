import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchIndexedSummaries } from '../index-summaries';

const CONTRACT =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const OWNER = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';

const indexResponse = () =>
  new Response(
    JSON.stringify({
      tokens: [
        {
          id: 2763,
          sourceContract: CONTRACT,
          owner: OWNER,
          creator: 'SPCREATOR',
          finalHash: null,
          mime: 'image/webp',
          totalSize: 9150,
          totalChunks: 1,
          sealed: true,
          tokenUri: 'xtrata:image/dropped-v2-25-r5c5',
          migrationSource: null
        }
      ]
    }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );

describe('indexed summary ownership freshness', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('marks forced index reads as fresh so browser and edge caches are bypassed', async () => {
    const fetchMock = vi.fn().mockImplementation(async () => indexResponse());
    vi.stubGlobal('fetch', fetchMock);

    const summaries = await fetchIndexedSummaries({
      primaryContractId: CONTRACT,
      lineageContractIds: [],
      ids: [2763n],
      origin: 'https://xtrata.test',
      bypassCache: true
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('&fresh=1');
    expect(summaries.get('2763')?.owner).toBe(OWNER);
  });

  it('keeps the normal indexed read on the cacheable fast path', async () => {
    const fetchMock = vi.fn().mockImplementation(async () => indexResponse());
    vi.stubGlobal('fetch', fetchMock);

    await fetchIndexedSummaries({
      primaryContractId: CONTRACT,
      lineageContractIds: [],
      ids: [2763n],
      origin: 'https://xtrata.test'
    });

    expect(String(fetchMock.mock.calls[0]?.[0])).not.toContain('fresh=1');
  });
});
