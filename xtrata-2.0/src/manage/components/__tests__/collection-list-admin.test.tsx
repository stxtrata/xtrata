// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import CollectionListPanel from '../CollectionListPanel';

const OWNER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CREATOR = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
const wallet = vi.hoisted(() => ({ address: '' }));
vi.mock('../../ManageWalletContext', () => ({ useManageWallet: () => ({ walletSession: { address: wallet.address, network: 'mainnet' } }) }));

const fetchMock = vi.fn(async () => Response.json([
  { id: 'a1', slug: 'audionauts-1-0', display_name: 'Audionauts 1.0', state: 'published', artist_address: CREATOR, contract_address: CREATOR, metadata: { templateVersion: 'xtrata-collection-mint-v1.7', coreContractId: `${OWNER}.xtrata-v3-2-3` } }
]));
beforeEach(() => { fetchMock.mockClear(); vi.stubGlobal('fetch', fetchMock); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const listUrls = () => (fetchMock.mock.calls as unknown as [string][]).map(([url]) => String(url)).filter((url) => url.startsWith('/collections?') || url === '/collections');

describe('collection picker', () => {
  it("lets the Xtrata owner see every creator's collections, and switch back to their own", async () => {
    wallet.address = OWNER;
    render(<CollectionListPanel activeCollectionId="" onSelectCollection={() => {}} />);
    await screen.findByText('Audionauts 1.0');
    expect(listUrls()[0]).not.toContain('artistAddress');
    expect(screen.getByText(CREATOR)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Show only my collections' }));
    await waitFor(() => expect(listUrls().at(-1)).toContain(`artistAddress=${OWNER}`));
  });

  it('keeps other creators to their own collections', async () => {
    wallet.address = CREATOR;
    render(<CollectionListPanel activeCollectionId="" onSelectCollection={() => {}} />);
    await screen.findByText('Audionauts 1.0');
    expect(listUrls()[0]).toContain(`artistAddress=${CREATOR}`);
    expect(screen.queryByRole('button', { name: "Show every creator's collections" })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Show only my collections' })).toBeNull();
  });
});
