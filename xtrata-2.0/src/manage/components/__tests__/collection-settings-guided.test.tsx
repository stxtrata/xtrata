// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { boolCV, contractPrincipalCV, noneCV, standardPrincipalCV, tupleCV, uintCV } from '@stacks/transactions';
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
  mocked.chain = { paused: true, price: 0n, supply: 0n, splits: [0n, 0n, 0n] };
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
      case 'get-splits': { const [a, m, o] = mocked.chain.splits as bigint[]; return ok(tupleCV({ artist: uintCV(a), marketplace: uintCV(m), operator: uintCV(o) })); }
      case 'get-minted-count': return ok(uintCV(0));
      case 'get-reserved-count': return ok(uintCV(0));
      case 'get-pending-owner': return ok(noneCV());
      case 'get-recipients': return ok(tupleCV({ artist: standardPrincipalCV(ADDRESS), marketplace: standardPrincipalCV('SP2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB'), operator: standardPrincipalCV('SP2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB') }));
      case 'get-owner': case 'get-finance-admin': case 'get-operator-admin': return ok(standardPrincipalCV(ADDRESS));
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

describe('payout split', () => {
  it('guided Mint rules offers the standard 95% split when it is 0/0/0', async () => {
    mocked.template = 'xtrata-collection-mint-v1.7';
    mocked.chain.price = 20_000_000n;
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={10} />);
    await screen.findByText(/Not set yet\. Until it is, 100% of every payout would go to the Xtrata operator/);
    fireEvent.click(screen.getByRole('button', { name: 'Set standard split (95% to you)' }));
    await waitFor(() => expect(mocked.write).toHaveBeenCalled());
    const call = mocked.write.mock.calls[0][0];
    expect(call.functionName).toBe('set-splits');
    expect(call.functionArgs.map((a: any) => BigInt(a.value))).toEqual([9500n, 250n, 250n]);
  });

  it('shows the standard split as done', async () => {
    mocked.chain.splits = [9500n, 250n, 250n];
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={10} />);
    await screen.findByText(/Standard split set/);
    expect(screen.queryByRole('button', { name: 'Set standard split (95% to you)' })).toBeNull();
  });

  it('keeps Open minting locked while a paid mint has 0/0/0 splits', async () => {
    mocked.published = true;
    mocked.chain.price = 20_000_000n;
    render(<CollectionSettingsPanel mode="launch" activeCollectionId="c1" launchChecks={[{ label: 'Price set', ok: true }]} />);
    await screen.findByText(/Paused — collectors cannot mint yet/);
    await screen.findByText(/Payout split set/);
    expect((screen.getByRole('button', { name: 'Open minting' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('advanced contract status', () => {
  it('shows the payout split and all three recipients', async () => {
    mocked.chain.splits = [9500n, 250n, 250n];
    render(<CollectionSettingsPanel activeCollectionId="c1" />);
    fireEvent.click(await screen.findByRole('button', { name: 'Refresh on-chain status' }));
    await screen.findByText('95% / 2.5% / 2.5%');
    expect(screen.getByText('Artist recipient')).toBeTruthy();
    expect(screen.getAllByText('SP2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB')).toHaveLength(2);
    expect(screen.getAllByText(ADDRESS).length).toBeGreaterThan(0);
  });
});

describe('recipient editor access survives a flaky read', () => {
  const selectEditorAccess = async (container: HTMLElement) => {
    const select = await waitFor(() => {
      const el = container.querySelector('#manage-contract-action-select') as HTMLSelectElement | null;
      if (!el) throw new Error('no action select yet');
      return el;
    });
    const groupButton = screen.queryAllByRole('button', { name: 'Ownership and Roles' })[0];
    if (groupButton) fireEvent.click(groupButton);
    fireEvent.change(select, { target: { value: 'set-recipient-editor-access' } });
    const editor = await waitFor(() => {
      const el = container.querySelector('#action-set-recipient-editor-access-editor') as HTMLInputElement | null;
      if (!el) throw new Error('no editor field yet');
      return el;
    });
    fireEvent.change(editor, { target: { value: ADDRESS } });
    fireEvent.change(container.querySelector('#action-set-recipient-editor-access-can-operator')!, { target: { value: 'true' } });
  };
  const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Submit wallet transaction' }));
  const coreArg = () => {
    const call = mocked.write.mock.calls.at(-1)?.[0] as { functionName: string; functionArgs: Array<{ type: number; address?: string; contractName?: string; value?: string }> };
    return call;
  };

  it('keeps the core contract when the fee read fails', async () => {
    const base = mocked.read.getMockImplementation()!;
    mocked.read.mockImplementation(async (opts: { functionName: string }) => {
      if (opts.functionName === 'get-fee-unit') throw new Error('429 rate limited');
      return base(opts);
    });
    const { container } = render(<CollectionSettingsPanel mode="advanced" activeCollectionId="c1" isXtrataOwner />);
    await screen.findByText(/On-chain status refreshed|Payout split/);
    await selectEditorAccess(container);
    submit();
    await waitFor(() => expect(mocked.write).toHaveBeenCalled());
    const call = coreArg();
    expect(call.functionName).toBe('set-recipient-editor-access');
    expect(JSON.stringify(call.functionArgs[0])).toContain('xtrata-v3-2-3');
  });

  it('reads the core contract on submit when the refresh could not', async () => {
    const base = mocked.read.getMockImplementation()!;
    let lockedReads = 0;
    mocked.read.mockImplementation(async (opts: { functionName: string }) => {
      if (opts.functionName === 'get-locked-core-contract') {
        lockedReads += 1;
        if (lockedReads <= 2) throw new Error('429 rate limited');
      }
      return base(opts);
    });
    const { container } = render(<CollectionSettingsPanel mode="advanced" activeCollectionId="c1" isXtrataOwner />);
    await waitFor(() => expect(lockedReads).toBeGreaterThanOrEqual(2), { timeout: 4000 });
    await selectEditorAccess(container);
    submit();
    await waitFor(() => expect(mocked.write).toHaveBeenCalled(), { timeout: 4000 });
    expect(JSON.stringify(coreArg().functionArgs[0])).toContain('xtrata-v3-2-3');
  });
});
