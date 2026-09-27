// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CollectionCoverImage from '../CollectionCoverImage';

afterEach(cleanup);
const renderCover = (coverImage: unknown) => render(
  <QueryClientProvider client={new QueryClient()}>
    <CollectionCoverImage coverImage={coverImage} collectionId="col-1" alt="Cover" placeholderClassName="ph" emptyMessage="none" />
  </QueryClientProvider>
);

describe('collection cover image', () => {
  it('shows an HTML collection file as a sandboxed, non-interactive frame', () => {
    const { container } = renderCover({ source: 'collection-asset', assetId: 'a1', mimeType: 'text/html' });
    const frame = container.querySelector('iframe')!;
    expect(frame).toBeTruthy();
    expect(frame.getAttribute('src')).toBe('/collections/col-1/asset-preview?assetId=a1&purpose=cover');
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts');
    expect(frame.style.pointerEvents).toBe('none');
    expect(frame.getAttribute('tabindex')).toBe('-1');
    expect(container.querySelector('img')).toBeNull();
  });

  it('keeps image collection files as images', () => {
    const { container } = renderCover({ source: 'collection-asset', assetId: 'a2', mimeType: 'image/png' });
    expect(container.querySelector('img')).toBeTruthy();
    expect(container.querySelector('iframe')).toBeNull();
  });
});
