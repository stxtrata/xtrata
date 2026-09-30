// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import {
  boolCV,
  contractPrincipalCV,
  cvToString,
  listCV,
  noneCV,
  someCV,
  standardPrincipalCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import CollectionSettingsPanel from '../CollectionSettingsPanel';

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X'; // connected wallet: owner and Xtrata here
const CO_ARTIST = 'SP1A5M0ZRSNQMF8BNPQPM8WWC5PJ6HJ4GEKFP8W4M';
const HOLDER = 'SP2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB';
const mocked = vi.hoisted(() => ({
  read: vi.fn(),
  write: vi.fn(),
  template: 'xtrata-collection-mint-v1.9',
  allowance: 3,
  splits: [] as Array<{ recipient: string; holderOf: number | null; share: number }>
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
const slot = (bps: number) => tupleCV({ recipient: standardPrincipalCV(ADDRESS), bps: uintCV(bps) });

beforeEach(() => {
  mocked.write.mockReset();
  mocked.template = 'xtrata-collection-mint-v1.9';
  mocked.allowance = 3;
  mocked.splits = [
    { recipient: ADDRESS, holderOf: null, share: 9500 },
    { recipient: ADDRESS, holderOf: 3060, share: 500 }
  ];
  mocked.read.mockReset().mockImplementation(async ({ functionName }: { functionName: string }) => {
    const ok = (value: unknown) => ({ type: 7, value }) as never; // ResponseOk wrapper
    if (functionName in FEES) return ok(uintCV(FEES[functionName]));
    switch (functionName) {
      case 'get-locked-core-contract': return ok(contractPrincipalCV(ADDRESS, 'xtrata-v3-2-3'));
      case 'is-paused': return ok(boolCV(true));
      case 'get-mint-price': return ok(uintCV(20_000_000));
      case 'get-max-supply': return ok(uintCV(111));
      case 'get-finalized': return ok(boolCV(false));
      case 'get-active-phase': return ok(uintCV(0));
      case 'get-minted-count': return ok(uintCV(0));
      case 'get-reserved-count': return ok(uintCV(0));
      case 'get-pending-owner': return ok(noneCV());
      case 'get-splits': return ok(tupleCV({ artist: uintCV(9500), marketplace: uintCV(250), operator: uintCV(250), auxiliary: uintCV(0) }));
      case 'get-recipients': return ok(tupleCV({ artist: standardPrincipalCV(ADDRESS), marketplace: standardPrincipalCV(ADDRESS), operator: standardPrincipalCV(ADDRESS), auxiliary: standardPrincipalCV(ADDRESS) }));
      case 'get-platform-splits': return ok(tupleCV({
        marketplace: slot(250), operator: slot(250), auxiliary: slot(0),
        'total-bps': uintCV(500), 'min-bps': uintCV(250), 'max-bps': uintCV(1500), launched: boolCV(false)
      }));
      case 'get-artist-splits': return ok(tupleCV({
        allowance: uintCV(mocked.allowance), 'max-slots': uintCV(8),
        splits: listCV(mocked.splits.map((entry) => tupleCV({
          recipient: standardPrincipalCV(entry.recipient),
          'holder-of': entry.holderOf === null ? noneCV() : someCV(uintCV(entry.holderOf)),
          share: uintCV(entry.share)
        })))
      }));
      case 'get-artist-payees': return ok(listCV(mocked.splits.map((entry) => tupleCV({
        payee: standardPrincipalCV(entry.holderOf === null ? entry.recipient : HOLDER),
        share: uintCV(entry.share),
        'holder-of': entry.holderOf === null ? noneCV() : someCV(uintCV(entry.holderOf))
      }))));
      case 'get-owner': case 'get-finance-admin': case 'get-operator-admin': return ok(standardPrincipalCV(ADDRESS));
      default: return ok(contractPrincipalCV(ADDRESS, 'owner'));
    }
  });
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({
    id: 'c1', slug: 'audionauts', state: 'draft', contract_address: ADDRESS,
    metadata: {
      templateVersion: mocked.template, contractName: 'xtrata-collection-audionauts-c1',
      coreContractId: `${ADDRESS}.xtrata-v3-2-3`,
      deployPricingLock: { lockedAt: '2026-10-01T00:00:00Z', assetCount: 111, maxChunks: 32, maxBytes: 500000, totalBytes: 900000 }
    }
  })));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const actionSelect = async (container: HTMLElement) => waitFor(() => {
  const el = container.querySelector('#manage-contract-action-select') as HTMLSelectElement | null;
  if (!el) throw new Error('no action select yet');
  return el;
});
const optionValues = (select: HTMLSelectElement) => Array.from(select.options).map((option) => option.value);

describe('v1.9 guided payout split', () => {
  it('shows Xtrata\'s fixed share and who the artist share pays, with no creator split button', async () => {
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={111} />);
    await screen.findByText(/Xtrata's share:/);
    expect(screen.getByText(/only Xtrata can change it/)).toBeTruthy();
    expect(screen.getByText('95%')).toBeTruthy();
    expect(screen.getByText(/Holder of #3060/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Set standard split (95% to you)' })).toBeNull();
  });

  it('saves a new artist split from the guided editor', async () => {
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={111} />);
    await screen.findByText(/Xtrata's share:/);
    const editor = screen.getByLabelText('Artist payout lines') as HTMLTextAreaElement;
    expect(editor.value).toBe(`${ADDRESS} 95\n#3060 5`);
    fireEvent.change(editor, { target: { value: `${ADDRESS} 47.5\n${CO_ARTIST} 47.5\n#3060 5` } });
    expect(screen.getByText(/whoever holds #3060: 5% of the artist share \(4.75% of each sale's payout\)/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Save artist split' }));
    await waitFor(() => expect(mocked.write).toHaveBeenCalled());
    const call = mocked.write.mock.calls[0][0];
    expect(call.functionName).toBe('set-artist-splits');
    expect(cvToString(call.functionArgs[0])).toBe(cvToString(listCV([
      tupleCV({ recipient: standardPrincipalCV(ADDRESS), 'holder-of': noneCV(), share: uintCV(4750) }),
      tupleCV({ recipient: standardPrincipalCV(CO_ARTIST), 'holder-of': noneCV(), share: uintCV(4750) }),
      tupleCV({ recipient: standardPrincipalCV(ADDRESS), 'holder-of': someCV(uintCV(3060)), share: uintCV(500) })
    ])));
  });

  it('refuses a split that does not add up, without opening the wallet', async () => {
    render(<CollectionSettingsPanel mode="guided" activeCollectionId="c1" stagedFileCount={111} />);
    await screen.findByText(/Xtrata's share:/);
    fireEvent.change(screen.getByLabelText('Artist payout lines'), { target: { value: `${ADDRESS} 50\n${CO_ARTIST} 45` } });
    expect(screen.getAllByText(/add up to 95%/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Save artist split' }));
    await screen.findByText(/Nothing was sent/);
    expect(mocked.write).not.toHaveBeenCalled();
  });

  it('keeps Open minting available: a v1.9 split is always valid', async () => {
    render(<CollectionSettingsPanel mode="launch" activeCollectionId="c1" launchChecks={[{ label: 'Price set', ok: true }]} />);
    const item = await screen.findByText(/Payout split set/);
    await waitFor(() => expect(item.closest('li')?.textContent ?? item.textContent).not.toMatch(/could not read/));
  });
});

describe('v1.9 advanced controls', () => {
  it('offers the creator only the artist split, not the v1.7 split or Xtrata controls', async () => {
    const { container } = render(<CollectionSettingsPanel activeCollectionId="c1" />);
    const select = await actionSelect(container);
    await waitFor(() => expect(optionValues(select)).toContain('set-artist-splits'));
    for (const hidden of ['set-splits', 'set-recipients', 'set-artist-recipient', 'set-marketplace-recipient',
      'set-operator-recipient', 'set-recipient-editor-access', 'set-platform-split', 'set-artist-slot-allowance', 'set-platform-editor']) {
      expect(optionValues(select)).not.toContain(hidden);
    }
  });

  it('gives Xtrata the platform controls, sending the pinned core as the first argument', async () => {
    const { container } = render(<CollectionSettingsPanel activeCollectionId="c1" isXtrataOwner />);
    fireEvent.click(await screen.findByRole('button', { name: 'Refresh on-chain status' }));
    await screen.findByText('5% (2.5% / 2.5% / 0%)');
    const select = await actionSelect(container);
    expect(optionValues(select)).toEqual(expect.arrayContaining(['set-platform-split', 'set-artist-slot-allowance', 'set-platform-editor']));
    expect(optionValues(select)).not.toContain('set-recipient-editor-access');
    fireEvent.change(select, { target: { value: 'set-artist-slot-allowance' } });
    const field = await waitFor(() => {
      const el = container.querySelector('#action-set-artist-slot-allowance-allowance') as HTMLInputElement | null;
      if (!el) throw new Error('no allowance field yet');
      return el;
    });
    fireEvent.change(field, { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit wallet transaction' }));
    await waitFor(() => expect(mocked.write).toHaveBeenCalled());
    const call = mocked.write.mock.calls.at(-1)[0];
    expect(call.functionName).toBe('set-artist-slot-allowance');
    expect(cvToString(call.functionArgs[0])).toBe(`${ADDRESS}.xtrata-v3-2-3`);
    expect(cvToString(call.functionArgs[1])).toBe('u4');
  });

  it('shows both tiers in the on-chain status', async () => {
    render(<CollectionSettingsPanel activeCollectionId="c1" />);
    fireEvent.click(await screen.findByRole('button', { name: 'Refresh on-chain status' }));
    const share = await screen.findByText('Xtrata share');
    const tile = share.closest('.collection-settings-panel__summary-item') as HTMLElement;
    expect(within(tile).getByText('5% (2.5% / 2.5% / 0%)')).toBeTruthy();
    expect(screen.getByText('95% across 2 of 3 slots')).toBeTruthy();
    expect(screen.getByText(`${ADDRESS} 95% · #3060 → ${HOLDER} 5%`)).toBeTruthy();
    expect(screen.queryByText('Payout split')).toBeNull();
  });

  it('leaves v1.7 collections (e.g. Audionauts) on their existing controls', async () => {
    mocked.template = 'xtrata-collection-mint-v1.7';
    const { container } = render(<CollectionSettingsPanel activeCollectionId="c1" isXtrataOwner />);
    const select = await actionSelect(container);
    await waitFor(() => expect(optionValues(select)).toContain('set-splits'));
    expect(optionValues(select)).toContain('set-recipient-editor-access');
    expect(optionValues(select)).not.toContain('set-artist-splits');
    expect(optionValues(select)).not.toContain('set-platform-split');
  });
});
