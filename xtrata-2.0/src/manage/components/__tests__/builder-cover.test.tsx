// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CollectionBuilder from '../CollectionBuilder';

afterEach(cleanup);

describe('builder sidebar cover', () => {
  it('shows an HTML collection-file cover as a live, non-interactive frame', () => {
    const noop = vi.fn();
    const signals = {walletConnected:true,hasActiveCollection:true,mintType:'standard' as const,activeAssetCount:111,deployPricingLockPresent:true,deployReady:true,deployPending:false,launchMintPriceConfigured:true,launchMaxSupplyConfigured:true,hasLivePageCover:true,hasLivePageDescription:true,published:true,unpaused:false,uploadReadinessReason:null,deployReadinessReason:null};
    const { container } = render(
      <QueryClientProvider client={new QueryClient()}>
        <CollectionBuilder collectionId="c1" collectionName="Audionauts" walletKey="k" signals={signals} loading={false} error={null}
          previewCover="/collections/c1/asset-preview?assetId=a1&purpose=cover"
          previewCoverImage={{ source: 'collection-asset', assetId: 'a1', mimeType: 'text/html' }}
          wallet={null} picker={null} deploy={() => null} artwork={null} inventory={null} rules={null} page={null} storage={null}
          onRefresh={noop} onAdvanced={noop} onCreate={noop} />
      </QueryClientProvider>
    );
    const frame = container.querySelector('.creator-builder__cover iframe') as HTMLIFrameElement;
    expect(frame).toBeTruthy();
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts');
    expect(frame.style.pointerEvents).toBe('none');
    expect(container.querySelector('.creator-builder__cover img')).toBeNull();
  });
});
