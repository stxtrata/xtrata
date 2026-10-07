// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { fetchOnChainContent } = vi.hoisted(() => ({
  fetchOnChainContent: vi.fn(async () => {
    throw new Error('should not be called');
  })
}));
vi.mock('../../lib/viewer/content', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  fetchOnChainContent
}));

import TokenCardMedia from '../TokenCardMedia';

afterEach(() => {
  cleanup();
  fetchOnChainContent.mockClear();
});

const makeToken = (mimeType: string) =>
  ({
    id: 3111n,
    owner: null,
    tokenUri: null,
    svgDataUri: null,
    meta: {
      owner: 'SP1',
      creator: null,
      mimeType,
      totalSize: 50_000n,
      totalChunks: 4n,
      sealed: true,
      finalHash: null
    }
  }) as never;

const renderCard = (mimeType: string, defer: boolean) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <TokenCardMedia
        token={makeToken(mimeType)}
        contractId="SP1.contract"
        senderAddress="SP1"
        client={{} as never}
        isActiveTab
        deferPlayableMedia={defer}
      />
    </QueryClientProvider>
  );

describe('TokenCardMedia deferPlayableMedia', () => {
  it.each(['text/html', 'audio/mpeg', 'video/mp4'])(
    'does not load or mount %s in grid mode',
    async (mime) => {
      const { container } = renderCard(mime, true);
      await new Promise((r) => setTimeout(r, 30));
      expect(fetchOnChainContent).not.toHaveBeenCalled();
      expect(container.querySelector('iframe')).toBeNull();
      expect(container.querySelector('video')).toBeNull();
      expect(container.querySelector('.token-card__doc-play')).toBeTruthy();
    }
  );

  it('still loads HTML when not deferred', async () => {
    renderCard('text/html', false);
    await new Promise((r) => setTimeout(r, 30));
    expect(fetchOnChainContent).toHaveBeenCalled();
  });
});
