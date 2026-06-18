import { afterEach, describe, expect, it, vi } from 'vitest';

// Mock the Hiro access layer so the resolver logic can be tested without network.
vi.mock('../hiro', async () => {
  const actual = await vi.importActual<typeof import('../hiro')>('../hiro');
  return {
    ...actual,
    callReadOnly: vi.fn(),
    fetchContractPrintEvents: vi.fn(),
    getSourceOwner: vi.fn()
  };
});

import * as hiro from '../hiro';
import {
  buildReverseIndex,
  clearTwinCaches,
  resolveTwinByXtrataId,
  resolveTwinOwnership
} from '../resolver';
import {
  FOREVER_TWIN_COLLECTIONS,
  getCollectionByHelperId
} from '../registry';

const PEPE = FOREVER_TWIN_COLLECTIONS.find((c) => c.key === 'bitcoin-pepes')!;
const MIAMI = FOREVER_TWIN_COLLECTIONS.find((c) => c.key === 'miami-degens')!;
const HELPER = PEPE.helperContractId;
const MIAMI_HELPER = MIAMI.helperContractId;
const HOLDER = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';

const printEvent = (localId: number, xtrataId: number) => ({
  event: { type: '(string-ascii 32)', value: 'inscribed' },
  'token-id': { type: 'uint', value: String(localId) },
  'xtrata-id': { type: 'uint', value: String(xtrataId) }
});

async function* gen(events: unknown[]) {
  for (const e of events) {
    yield e as Record<string, unknown>;
  }
}

const mockEvents = (events: unknown[]) => {
  vi.mocked(hiro.fetchContractPrintEvents).mockImplementation(
    () => gen(events)
  );
};

const mockEventsByHelper = (eventsByHelper: Record<string, unknown[]>) => {
  vi.mocked(hiro.fetchContractPrintEvents).mockImplementation(
    ({ contractId }: { contractId: string }) => gen(eventsByHelper[contractId] ?? [])
  );
};

// get-binding tuple JSON shape (cvToJSON of (optional (tuple ...))).
const bindingJson = (xtrataId: number, escrowed: boolean) => ({
  type: '(optional (tuple (xtrata-id uint) (xtrata-escrowed bool)))',
  value: {
    type: '(tuple (xtrata-id uint) (xtrata-escrowed bool))',
    value: {
      'xtrata-id': { type: 'uint', value: String(xtrataId) },
      'xtrata-escrowed': { type: 'bool', value: escrowed }
    }
  }
});

// get-owner result shape (ok (optional principal)).
const ownerJson = (principal: string) => ({
  type: '(response (optional principal) uint)',
  success: true,
  value: {
    type: '(optional principal)',
    value: { type: 'principal', value: principal }
  }
});

afterEach(() => {
  clearTwinCaches();
  vi.clearAllMocks();
});

describe('Forever Twin reverse index', () => {
  it('maps xtrata id to local token id from inscribed events', async () => {
    mockEvents([printEvent(44, 512), printEvent(45, 513)]);
    const index = await buildReverseIndex(PEPE);
    expect(index.get('512')).toBe(44n);
    expect(index.get('513')).toBe(45n);
  });

  it('ignores non-inscribed prints', async () => {
    mockEvents([
      { event: { type: '(string-ascii 32)', value: 'swap-pepe-for-xtrata' } },
      printEvent(44, 512)
    ]);
    const index = await buildReverseIndex(PEPE);
    expect(index.size).toBe(1);
    expect(index.get('512')).toBe(44n);
  });

  it('caches the index across calls', async () => {
    mockEvents([printEvent(44, 512)]);
    await buildReverseIndex(PEPE);
    await buildReverseIndex(PEPE);
    expect(hiro.fetchContractPrintEvents).toHaveBeenCalledTimes(1);
  });
});

describe('resolveTwinByXtrataId', () => {
  it('confirms the live binding for a matched id', async () => {
    mockEvents([printEvent(44, 512)]);
    vi.mocked(hiro.callReadOnly).mockResolvedValue(
      bindingJson(512, true)
    );
    const binding = await resolveTwinByXtrataId(512n);
    expect(binding?.collection.key).toBe('bitcoin-pepes');
    expect(binding?.localTokenId).toBe(44n);
    expect(binding?.xtrataEscrowed).toBe(true);
  });

  it('returns null for an unknown id', async () => {
    mockEvents([printEvent(44, 512)]);
    const binding = await resolveTwinByXtrataId(999n);
    expect(binding).toBeNull();
  });
});

describe('resolveTwinOwnership', () => {
  it('reports Escrowed and the real source holder when owned by the helper', async () => {
    mockEvents([printEvent(44, 578)]);
    vi.mocked(hiro.callReadOnly).mockImplementation(
      async ({ functionName }: { functionName: string }) =>
        functionName === 'get-binding'
          ? bindingJson(578, true)
          : ownerJson(HOLDER)
    );
    const result = await resolveTwinOwnership({ xtrataId: 578n, rawOwner: HELPER });
    expect(result?.escrowed).toBe(true);
    expect(result?.localTokenId).toBe(44n);
    expect(result?.collection.name).toBe('Bitcoin Pepes');
    expect(result?.effectiveOwner).toBe(HOLDER);
    expect(result?.rawOwner).toBe(HELPER);
  });

  it('hops through a marketplace custodian to the real seller', async () => {
    const MARKET = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.pepe-nft-marketplace';
    mockEvents([printEvent(44, 578)]);
    vi.mocked(hiro.callReadOnly).mockImplementation(
      async ({ contractId, functionName }: { contractId: string; functionName: string }) => {
        if (functionName === 'get-binding') return bindingJson(578, true);
        // Source NFT is held by the marketplace contract...
        if (contractId.endsWith('.bitcoin-pepe')) return ownerJson(MARKET);
        // ...whose listing names the real seller.
        if (functionName === 'get-listing') {
          return {
            type: '(optional (tuple (seller principal)))',
            value: {
              type: '(tuple (seller principal))',
              value: { seller: { type: 'principal', value: HOLDER } }
            }
          };
        }
        return ownerJson(HOLDER);
      }
    );
    const result = await resolveTwinOwnership({ xtrataId: 578n, rawOwner: HELPER });
    expect(result?.escrowed).toBe(true);
    expect(result?.effectiveOwner).toBe(HOLDER);
  });

  it('shows the normal owner when not escrowed', async () => {
    mockEvents([printEvent(44, 578)]);
    vi.mocked(hiro.callReadOnly).mockResolvedValue(
      bindingJson(578, false)
    );
    const result = await resolveTwinOwnership({ xtrataId: 578n, rawOwner: HOLDER });
    expect(result?.escrowed).toBe(false);
    expect(result?.effectiveOwner).toBe(HOLDER);
  });

  it('returns null for a non-twin token', async () => {
    mockEvents([printEvent(44, 578)]);
    const result = await resolveTwinOwnership({ xtrataId: 1n, rawOwner: HOLDER });
    expect(result).toBeNull();
  });

  it('registry maps helper id back to its collection', () => {
    expect(getCollectionByHelperId(HELPER)?.key).toBe('bitcoin-pepes');
  });

  it('registry maps Miami Degens helper and resolves its xtrata/local ids', async () => {
    mockEventsByHelper({ [MIAMI_HELPER]: [printEvent(17, 888)] });
    vi.mocked(hiro.callReadOnly).mockResolvedValue(
      bindingJson(888, true)
    );
    expect(getCollectionByHelperId(MIAMI_HELPER)?.key).toBe('miami-degens');

    const binding = await resolveTwinByXtrataId(888n);
    expect(binding?.collection.key).toBe('miami-degens');
    expect(binding?.localTokenId).toBe(17n);
    expect(binding?.xtrataEscrowed).toBe(true);
  });
});
