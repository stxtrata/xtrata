import { describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import {
  MIN_FEE_BUDGET,
  sponsorExposure,
  type CollectionInfo,
  type ItemRow,
  type ScanEntry
} from '@xtrata/collections-client';
import { ToastProvider } from '../../shell/ToastContext';
import { DropsServicesContext, type DropsServices } from './services';
import { DropsStoreContext } from './useDropsStore';
import { DropsBuilderStore, type CollectionReadsLike } from './store';
import { ModeStep } from './steps/ModeStep';
import { CostsStep } from './steps/CostsStep';
import { InventoryStep } from './steps/InventoryStep';
import { MODE_COPY } from './copy';
import { parseRoute } from './DropsApp';

const DEPLOYER = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const DROPS = `${DEPLOYER}.xtrata-drops-v3`;
const CORE = `${DEPLOYER}.xtrata-v3-2-3`;
const COLLECTION = `${DEPLOYER}.my-collection`;

const info = (patch: Partial<CollectionInfo> = {}): CollectionInfo => ({
  name: 'Test Collection',
  symbol: 'TEST',
  description: '',
  artworkUri: '',
  baseUri: '',
  owner: DEPLOYER,
  operatorAdmin: DEPLOYER,
  financeAdmin: DEPLOYER,
  supplyMode: 1,
  maxSupply: 0,
  mintedCount: 40,
  reservedCount: 0,
  nextIndex: 40,
  freeCount: 0,
  mintPrice: 0n,
  activePhaseId: 1,
  reservationExpiryBlocks: 144,
  paused: false,
  finalized: false,
  dropsAuthority: DROPS,
  coreContract: CORE,
  ...patch
});

const collectionReads = (assigned: number[] = []): CollectionReadsLike => {
  const row = info();
  const taken = new Set(assigned);
  return {
    getCollectionInfo: async () => row,
    getUnassignedScan: async (start: number): Promise<ScanEntry[]> => {
      const entries: ScanEntry[] = [];
      for (let index = start; index < Math.min(start + 50, row.nextIndex); index += 1) {
        entries.push({ index, minted: true, assigned: taken.has(index) });
      }
      return entries;
    },
    getItems: async (indexes: number[]): Promise<(ItemRow | null)[]> =>
      indexes.map((index) => ({
        tokenId: index,
        ownerAtMint: DEPLOYER,
        phaseId: 1,
        mintedAt: 1,
        contentHashHex: '00'.repeat(32)
      }))
  };
};

const services = (patch: Partial<DropsServices> = {}): DropsServices => ({
  apiBaseUrl: 'https://api.example',
  network: 'mainnet',
  coreContractId: CORE,
  dropsContractId: DROPS,
  relayerBaseUrl: 'https://xtrata.example',
  canSign: true,
  ...patch
});

const renderWith = (store: DropsBuilderStore, node: ReactNode, overrides: Partial<DropsServices> = {}) =>
  render(
    <ToastProvider>
      <DropsStoreContext.Provider value={store}>
        <DropsServicesContext.Provider value={services(overrides)}>{node}</DropsServicesContext.Provider>
      </DropsStoreContext.Provider>
    </ToastProvider>
  );

const makeStore = (reads?: CollectionReadsLike): DropsBuilderStore => {
  const store = new DropsBuilderStore({
    dropsContractId: DROPS,
    coreContractId: CORE,
    network: 'mainnet',
    ...(reads ? { collectionReads: reads } : {})
  });
  store.setCollectionId(COLLECTION);
  return store;
};

describe('ModeStep — the copy rule reaches the screen', () => {
  it('never renders "free" as the cost of a zero-price claim', () => {
    renderWith(makeStore(), <ModeStep />);

    const zeroPrice = screen.getByTestId('claim-cost-zero-price');
    expect(zeroPrice.textContent).not.toMatch(/\bfree\b/i);
    expect(zeroPrice).toHaveTextContent(/network fee/i);
  });

  it('renders "free" only for the sponsored mode', () => {
    renderWith(makeStore(), <ModeStep />);

    expect(screen.getByTestId('claim-cost-sponsored').textContent).toMatch(/\bfree\b/i);
    expect(screen.getByTestId('claim-cost-pre-inscribed').textContent).not.toMatch(/\bfree\b/i);
  });

  it('warns the creator, in its own line, not to advertise a zero-price drop as free', () => {
    renderWith(makeStore(), <ModeStep />);
    expect(screen.getByTestId('advertising-rule-zero-price')).toHaveTextContent(
      /not advertise this drop as free/i
    );
  });

  it('puts the claim fee on the claimer for modes 1 and 2 and on the budget for mode 3', () => {
    renderWith(makeStore(), <ModeStep />);
    const row = screen.getByRole('row', { name: /claim transaction network fee/i });
    const cells = within(row).getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Claimer');
    expect(cells[1]).toHaveTextContent('Claimer');
    expect(cells[2]).toHaveTextContent(/sponsor budget/i);
  });

  it('selects a mode and shows that mode’s activation gates', async () => {
    const user = userEvent.setup();
    const store = makeStore();
    renderWith(store, <ModeStep />);

    await user.click(screen.getByRole('radio', { name: /sponsored/i }));

    expect(store.getState().config.mode).toBe('sponsored');
    for (const gate of MODE_COPY.sponsored.activationGates) {
      expect(screen.getByText(gate)).toBeInTheDocument();
    }
  });
});

describe('CostsStep — exposure on screen equals the client calculation', () => {
  const preparedStore = async (mode: 'sponsored' | 'zero-price', totalLimit = 0) => {
    const store = makeStore(collectionReads());
    await store.loadCollection();
    await store.selectAllUnassigned();
    await store.loadChainContext();
    store.setMode(mode);
    store.updateConfig({ totalLimit });
    return store;
  };

  it('shows the contract’s activation gate, to the microSTX', async () => {
    const store = await preparedStore('sponsored');
    const expected = sponsorExposure({ mode: 'sponsored', inventoryCount: 40, totalLimit: 0 });
    renderWith(store, <CostsStep />);

    expect(screen.getByTestId('claimable-count')).toHaveTextContent('40');
    expect(expected.minimumBudget).toBe(MIN_FEE_BUDGET * 40n);
    // 50_000 µSTX × 40 = 2 STX
    expect(screen.getByTestId('minimum-budget')).toHaveTextContent('2 STX');
  });

  it('caps claimable at the total limit exactly as the contract does', async () => {
    const store = await preparedStore('sponsored', 10);
    renderWith(store, <CostsStep />);

    expect(screen.getByTestId('claimable-count')).toHaveTextContent('10');
    expect(screen.getByTestId('minimum-budget')).toHaveTextContent('0.5 STX');
  });

  it('shows the worst case from the contract’s own claim-fee cap', async () => {
    const store = makeStore(collectionReads());
    await store.loadCollection();
    await store.selectAllUnassigned();
    store.bindChain({
      dropsReads: {
        getDrop: async () => null,
        getNextDropId: async () => 0,
        getRemaining: async () => 0,
        getAllClaims: async () => [],
        getClaimFeeCap: async () => 250_000n,
        getMinFeeBudget: async () => MIN_FEE_BUDGET,
        getEscrowedToken: async () => null,
        getAttestorPubkeyHash: async () => null,
        isPaused: async () => false
      }
    });
    await store.loadChainContext();
    store.setMode('sponsored');

    renderWith(store, <CostsStep />);

    // 250_000 µSTX × 40 claims = 10 STX
    expect(screen.getByTestId('worst-case')).toHaveTextContent('10 STX');
    expect(store.exposure.worstCaseSettlement).toBe(250_000n * 40n);
  });

  it('states plainly that unsponsored modes have no exposure', async () => {
    const store = await preparedStore('zero-price');
    renderWith(store, <CostsStep />);

    const text = screen.getByTestId('no-exposure').textContent ?? '';
    expect(text).toMatch(/none/i);
    expect(text).not.toMatch(/\bfree\b/i);
    expect(screen.queryByTestId('minimum-budget')).not.toBeInTheDocument();
  });

  it('repeats the honest claim-cost sentence on the costs screen', async () => {
    const store = await preparedStore('zero-price');
    renderWith(store, <CostsStep />);
    expect(screen.getByTestId('claim-cost-statement')).toHaveTextContent(/network fee/i);
  });
});

describe('InventoryStep — one action selects everything available', () => {
  it('names the real number of available items once the scan lands', async () => {
    const reads = collectionReads([0, 1, 2]);
    const store = makeStore(reads);
    await store.loadCollection();
    renderWith(store, <InventoryStep />, { collectionReads: reads });

    await waitFor(() =>
      expect(screen.getByTestId('select-all-unassigned')).toHaveTextContent('Select all 37 available items')
    );
  });

  it('selects all unassigned items and shows the bounded transaction plan', async () => {
    const user = userEvent.setup();
    const reads = collectionReads([5, 6, 7, 20]);
    const store = makeStore(reads);
    await store.loadCollection();
    renderWith(store, <InventoryStep />, { collectionReads: reads });

    await waitFor(() => expect(screen.getByTestId('select-all-unassigned')).toBeEnabled());
    await user.click(screen.getByTestId('select-all-unassigned'));

    await waitFor(() => expect(screen.getByTestId('selection-count')).toHaveTextContent('36'));
    expect(screen.getByTestId('selection-description')).toHaveTextContent('0–4, 8–19, 21–39');
    expect(screen.getByTestId('range-txs')).toHaveTextContent('3');
    expect(screen.getByTestId('explicit-txs')).toHaveTextContent('0');
    // ceil(36 / 25)
    expect(screen.getByTestId('escrow-txs')).toHaveTextContent('2');
  });

  it('says out loud that inventory is frozen at activation', async () => {
    const user = userEvent.setup();
    const reads = collectionReads();
    const store = makeStore(reads);
    await store.loadCollection();
    renderWith(store, <InventoryStep />, { collectionReads: reads });

    await waitFor(() => expect(screen.getByTestId('select-all-unassigned')).toBeEnabled());
    await user.click(screen.getByTestId('select-all-unassigned'));

    await waitFor(() =>
      expect(screen.getByText(/Inventory becomes immutable at activation/i)).toBeInTheDocument()
    );
  });
});

describe('routing', () => {
  it('sends ?drop= to the claim view', () => {
    expect(parseRoute('https://xtrata.example/drops.html?drop=12')).toEqual({
      view: 'claim',
      dropId: 12,
      collectionId: null
    });
  });

  it('sends ?collection= to the builder as a handoff', () => {
    expect(parseRoute(`https://xtrata.example/drops.html?collection=${COLLECTION}`)).toEqual({
      view: 'builder',
      dropId: null,
      collectionId: COLLECTION
    });
  });

  it('accepts an explicit claim view with no drop id', () => {
    expect(parseRoute('https://xtrata.example/drops.html?view=claim')).toMatchObject({
      view: 'claim',
      dropId: null
    });
  });

  it('ignores a non-numeric drop id instead of NaN-ing into a claim page', () => {
    expect(parseRoute('https://xtrata.example/drops.html?drop=abc')).toMatchObject({
      view: 'builder',
      dropId: null
    });
  });

  it('survives a malformed href', () => {
    expect(parseRoute('')).toEqual({ view: 'builder', dropId: null, collectionId: null });
  });
});
