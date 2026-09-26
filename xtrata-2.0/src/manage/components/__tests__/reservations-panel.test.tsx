// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { noneCV, principalCV, responseOkCV, someCV, tupleCV, uintCV } from '@stacks/transactions';
import ReservationsPanel from '../ReservationsPanel';

const OWNER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BUYER = 'SP2SA0DJXM5106NWT4S45AE442ZHYQPR0T5VSJA19';
const HASH = 'ab'.repeat(32);
const mocked = vi.hoisted(() => ({ read: vi.fn(), write: vi.fn(), wallet: { address: '', network: 'mainnet' } }));
vi.mock('@stacks/transactions', async (orig) => ({ ...(await orig<typeof import('@stacks/transactions')>()), callReadOnlyFunction: mocked.read }));
vi.mock('../../../lib/wallet/connect', () => ({ showContractCall: mocked.write }));
vi.mock('../../ManageWalletContext', () => ({ useManageWallet: () => ({ walletSession: mocked.wallet }) }));

beforeEach(() => {
  mocked.wallet.address = OWNER;
  mocked.write.mockReset().mockImplementation((o: any) => o.onFinish({ txId: 'x' }));
  mocked.read.mockReset().mockImplementation(async ({ functionName }: { functionName: string }) => ({
    'get-reserved-count': responseOkCV(uintCV(1)),
    'get-reservation-expiry-blocks': responseOkCV(uintCV(1440)),
    'get-hash-reservation': someCV(principalCV(BUYER)),
    'get-reservation': someCV(tupleCV({ 'created-at': uintCV(100), 'mint-price': uintCV(0) })),
    'get-owner': responseOkCV(principalCV(OWNER)),
    'get-operator-admin': responseOkCV(principalCV(OWNER))
  } as Record<string, any>)[functionName] ?? noneCV());
  vi.stubGlobal('fetch', vi.fn(async (url: string) => Response.json(
    url.includes('/v2/info') ? { stacks_tip_height: 5000 }
      : url.endsWith('/assets') ? [{ expected_hash: HASH, state: 'draft' }]
      : { id: 'c', slug: 'c', contract_address: `${OWNER}.xtrata-collection-c`, metadata: { templateVersion: 'xtrata-collection-mint-v1.7' } })));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('reservations panel', () => {
  it('finds an expired reservation and releases it with the admin wallet', async () => {
    render(<ReservationsPanel collectionId="c" />);
    fireEvent.click(await screen.findByRole('button', { name: 'Find reservations' }));
    await screen.findByText('expired');
    fireEvent.click(screen.getByRole('button', { name: 'Release' }));
    await waitFor(() => expect(mocked.write).toHaveBeenCalledOnce());
    expect(mocked.write.mock.calls[0][0]).toMatchObject({ functionName: 'release-expired-reservation' });
  });

  it('never opens the wallet for a wallet that cannot release', async () => {
    mocked.wallet.address = BUYER;
    render(<ReservationsPanel collectionId="c" />);
    fireEvent.click(await screen.findByRole('button', { name: 'Find reservations' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Release' }));
    await screen.findByText(/can't make this change/);
    expect(mocked.write).not.toHaveBeenCalled();
  });
});
