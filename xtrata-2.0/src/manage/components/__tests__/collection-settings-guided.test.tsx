// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { boolCV, contractPrincipalCV, noneCV, uintCV } from '@stacks/transactions';
import CollectionSettingsPanel from '../CollectionSettingsPanel';

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const mocked = vi.hoisted(() => ({
  read: vi.fn(),
  write: vi.fn(),
  chain: {} as Record<string, unknown>,
  published: false,
  template: 'xtrata-collection-mint-v1.6'
}));
vi.mock('@stacks/transactions', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@stacks/transactions')>()),
  callReadOnlyFunction: mocked.read
}));
vi.mock('../../../lib/wallet/connect', () => ({ showContractCall: mocked.write }));
vi.mock('../../ManageWalletContext', () => ({
  useManageWallet: () => ({
    walletSession: { address: ADDRESS, network: 'mainnet' },
    walletAdapter: { getSession: () => ({ address: ADDRESS, network: 'mainnet' }) },
    connect: vi.fn()
  })
}));

const FEES: Record<string, bigint> = {
  'get-begin-fee-unit': 100_000n,
  'get-upload-chunk-fee-unit': 2_000n,
  'get-upload-batch-fee-unit': 100_000n,
  'get-seal-fee-unit': 100_000n,
  'get-fee-unit': 100_000n
};

beforeEach(() => {
  mocked.write.mockReset();
  mocked.published = false;
  mocked.template = 'xtrata-collection-mint-v1.6';
  mocked.chain = { paused: true, price: 0n, supply: 0n };
  mocked.read.mockReset().mockImplementation(async ({ functionName }: { functionName: string }) => {
    const ok = (value: unknown) => ({ type: 7, value }) as never; // ResponseOk wrapper
    if (functionName in FEES) return ok(uintCV(FEES[functionName]));
    switch (functionName) {
      case 'get-locked-core-contract': return ok(contractPrincipalCV(ADDRESS, 'xtrata-v3-2-3'));
      case 'is-paused': return ok(boolCV(mocked.chain.paused as boolean));
      case 'get-mint-price': return ok(uintCV(mocked.chain.price as bigint));
      case 'get-max-supply': return ok(uintCV(mocked.chain.supply as bigint));
      case 'get-finalized': return ok(boolCV(false));
      case 'get-active-phase': return ok(uintCV(0));
      case 'get-minted-count': return ok(uintCV(0));
      case 'get-reserved-count': return ok(uintCV(0));
      case 'get-pending-owner': return ok(noneCV());
      default: return ok(contractPrincipalCV(ADDRESS, 'owner'));
    }
  });
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({
    id: 'c1', slug: 'numbers', state: mocked.published ? 'published' : 'draft', contract_address: ADDRESS,
    metadata: {
      templateVersion: mocked.template, contractName: 'xtrata-collection-numbers-c1',
      coreContractId: `${ADDRESS}.xtrata-v3-2-3`,
      deployPricingLock: { lockedAt: '2026-09-26T00:00:00Z', assetCount: 10, maxChunks: 32, maxBytes: 500000, totalBytes: 900000 }
    }
  })));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('guided mint rules', () => {
  it('prices from the v3.2.3 staged fees of the largest file', async () => {
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={10} />);
    // 32 chunks: begin 0.1 + seal 0.1 + 32 × 0.002 = 0.264 STX
    await screen.findByText(/Inscription cost for your largest file: 0\.264000 STX/);
    fireEvent.change(screen.getByLabelText('Price collectors pay (STX)'), { target: { value: '1' } });
    expect(screen.getByText('0.736000 STX')).toBeTruthy();
  });

  it('requires an explicit acknowledgement before the set-once max supply and prefills the file count', async () => {
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={10} />);
    const input = await screen.findByLabelText('Max supply') as HTMLInputElement;
    await waitFor(() => expect(input.value).toBe('10'));
    const button = screen.getByRole('button', { name: 'Set max supply' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.change(input, { target: { value: '12' } });
    expect(screen.getByText(/doesn't match your 10 uploaded files/)).toBeTruthy();
  });

  it('treats an already-set supply as permanent', async () => {
    mocked.chain.supply = 10n;
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={10} />);
    await screen.findByText(/This is permanent/);
    expect(screen.queryByRole('button', { name: 'Set max supply' })).toBeNull();
  });
});

describe('v1.7 fixed collector price', () => {
  it('uses the entered price as the on-chain price and shows the minimum payout', async () => {
    mocked.template = 'xtrata-collection-mint-v1.7';
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={10} />);
    await screen.findByText(/Inscription cost for your largest file: 0\.264000 STX/);
    fireEvent.change(screen.getByLabelText('Price collectors pay (STX)'), { target: { value: '1' } });
    expect(screen.getByText('Collectors pay (every file)')).toBeTruthy();
    expect(screen.getByText('0.736000 STX')).toBeTruthy();
    expect(screen.getByText(/every collector pays exactly the price you enter/)).toBeTruthy();
  });

  it('refuses a price below the largest file inscription cost', async () => {
    mocked.template = 'xtrata-collection-mint-v1.7';
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={10} />);
    await screen.findByText(/Inscription cost for your largest file/);
    fireEvent.change(screen.getByLabelText('Price collectors pay (STX)'), { target: { value: '0.1' } });
    expect(screen.getByText(/to cover the inscription cost/)).toBeTruthy();
  });
});

describe('launch mode', () => {
  it('keeps Open minting disabled until every check passes and the page is published', async () => {
    render(<CollectionSettingsPanel mode="launch" activeCollectionId="c1"
      launchChecks={[{ label: 'Every uploaded file registered on the contract', ok: false, hint: 'register files' }]} />);
    const open = await screen.findByRole('button', { name: 'Open minting' }) as HTMLButtonElement;
    await screen.findByText(/Paused — collectors cannot mint yet/);
    expect(open.disabled).toBe(true);
    expect(screen.getByText(/register files/)).toBeTruthy();
  });

  it('enables Open minting once published, paused and all checks pass', async () => {
    mocked.published = true;
    render(<CollectionSettingsPanel mode="launch" activeCollectionId="c1"
      launchChecks={[{ label: 'Price set', ok: true }]} />);
    await screen.findByText(/Paused — collectors cannot mint yet/);
    await waitFor(() => expect((screen.getByRole('button', { name: 'Open minting' }) as HTMLButtonElement).disabled).toBe(false));
    expect(mocked.write).not.toHaveBeenCalled();
  });
});
