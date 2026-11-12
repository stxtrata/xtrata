import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the Hiro access layer so the resolver logic can be tested without network.
vi.mock('../hiro', async () => {
  const actual = await vi.importActual<typeof import('../hiro')>('../hiro');
  return {
    ...actual,
    callReadOnly: vi.fn(),
    fetchContractPrintEvents: vi.fn(),
    // Default: the on-chain map read is unavailable, so helpers that declare a
    // reverseMap fall back to the event scan unless a test says otherwise.
    readMapUint: vi.fn(async () => ({ ok: false, value: null })),
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

beforeEach(() => {
  vi.mocked(hiro.readMapUint).mockResolvedValue({ ok: false, value: null });
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

describe('Bitcoin Monkeys: two helpers for one source collection', () => {
  const OURS = FOREVER_TWIN_COLLECTIONS.find((c) => c.key === 'bitcoin-monkeys')!;
  const FAKFUN = FOREVER_TWIN_COLLECTIONS.find(
    (c) => c.key === 'bitcoin-monkeys-fakfun'
  )!;
  const OURS_HELPER = OURS.helperContractId;
  const FAKFUN_HELPER = FAKFUN.helperContractId;

  // Binding and owner reads for Monkey #1296, which has a twin in each helper:
  // Xtrata #3117 in ours and #5123 in FACFUN's.
  const monkeyReads = async ({
    contractId,
    functionName
  }: {
    contractId: string;
    functionName: string;
  }) => {
    if (functionName === 'get-binding') {
      return bindingJson(contractId === FAKFUN_HELPER ? 5123 : 3117, true);
    }
    return ownerJson(HOLDER);
  };

  const scannedHelpers = () =>
    vi
      .mocked(hiro.fetchContractPrintEvents)
      .mock.calls.map(([args]) => (args as { contractId: string }).contractId);

  it('registers the FACFUN helper next to ours, for the same source NFT', () => {
    expect(FAKFUN.helperContractId).toBe(
      'SP2P8BYKPPREPTW7N4CZ4ZHP1VTHKCJGXECRAKA4C.btc-monkeys-fakfun-x'
    );
    expect(FAKFUN.reverseMap).toBe('BoundTwins');
    expect(FAKFUN.sourceContractId).toBe(OURS.sourceContractId);
    expect(FAKFUN.sourceAssetName).toBe(OURS.sourceAssetName);
    expect(FAKFUN.helperContractId).not.toBe(OURS.helperContractId);
    expect(FAKFUN.key).not.toBe(OURS.key);
    expect(getCollectionByHelperId(FAKFUN_HELPER)?.key).toBe('bitcoin-monkeys-fakfun');
    expect(getCollectionByHelperId(OURS_HELPER)?.key).toBe('bitcoin-monkeys');
    // Only the helper that has such a map declares one.
    expect(OURS.reverseMap).toBeUndefined();
  });

  it('reads the Monkey id from the BoundTwins map and never scans events', async () => {
    vi.mocked(hiro.readMapUint).mockResolvedValue({ ok: true, value: 1296n });
    vi.mocked(hiro.callReadOnly).mockImplementation(monkeyReads);
    const result = await resolveTwinOwnership({
      xtrataId: 5123n,
      rawOwner: FAKFUN_HELPER
    });
    expect(hiro.readMapUint).toHaveBeenCalledWith({
      contractId: FAKFUN_HELPER,
      mapName: 'BoundTwins',
      key: 5123n,
      network: 'mainnet'
    });
    expect(result?.collection.key).toBe('bitcoin-monkeys-fakfun');
    expect(result?.collection.itemNoun).toBe('Bitcoin Monkey');
    expect(result?.localTokenId).toBe(1296n);
    expect(result?.xtrataId).toBe(5123n);
    expect(result?.escrowed).toBe(true);
    expect(result?.effectiveOwner).toBe(HOLDER);
    expect(scannedHelpers()).not.toContain(FAKFUN_HELPER);
  });

  it('treats "no entry" as authoritative: not one of its twins, no scan', async () => {
    mockEventsByHelper({});
    vi.mocked(hiro.readMapUint).mockResolvedValue({ ok: true, value: null });
    const result = await resolveTwinOwnership({
      xtrataId: 3117n,
      rawOwner: FAKFUN_HELPER
    });
    expect(result).toBeNull();
    expect(scannedHelpers()).not.toContain(FAKFUN_HELPER);
  });

  it('falls back to the event scan when the map read FAILS, not to "not a twin"', async () => {
    mockEventsByHelper({ [FAKFUN_HELPER]: [printEvent(1296, 5123)] });
    vi.mocked(hiro.readMapUint).mockResolvedValue({ ok: false, value: null });
    vi.mocked(hiro.callReadOnly).mockImplementation(monkeyReads);
    const result = await resolveTwinOwnership({
      xtrataId: 5123n,
      rawOwner: FAKFUN_HELPER
    });
    expect(result?.collection.key).toBe('bitcoin-monkeys-fakfun');
    expect(result?.localTokenId).toBe(1296n);
    expect(scannedHelpers()).toContain(FAKFUN_HELPER);
  });

  it('resolves a twin that was swapped out to a wallet, via the map', async () => {
    mockEventsByHelper({});
    vi.mocked(hiro.readMapUint).mockImplementation(async ({ key }) =>
      key === 5123n ? { ok: true, value: 1296n } : { ok: true, value: null }
    );
    vi.mocked(hiro.callReadOnly).mockImplementation(async (args) =>
      args.functionName === 'get-binding' ? bindingJson(5123, false) : ownerJson(HOLDER)
    );
    const result = await resolveTwinOwnership({ xtrataId: 5123n, rawOwner: HOLDER });
    expect(result?.collection.key).toBe('bitcoin-monkeys-fakfun');
    expect(result?.localTokenId).toBe(1296n);
    expect(result?.escrowed).toBe(false);
    expect(result?.effectiveOwner).toBe(HOLDER);
  });

  it('shows both Xtrata ids for Monkey #1296, each against its own helper', async () => {
    mockEventsByHelper({ [OURS_HELPER]: [printEvent(1296, 3117)] });
    vi.mocked(hiro.readMapUint).mockImplementation(async ({ key }) =>
      key === 5123n ? { ok: true, value: 1296n } : { ok: true, value: null }
    );
    vi.mocked(hiro.callReadOnly).mockImplementation(monkeyReads);

    const ours = await resolveTwinOwnership({ xtrataId: 3117n, rawOwner: OURS_HELPER });
    const theirs = await resolveTwinOwnership({ xtrataId: 5123n, rawOwner: FAKFUN_HELPER });

    expect(ours?.collection.key).toBe('bitcoin-monkeys');
    expect(ours?.localTokenId).toBe(1296n);
    expect(ours?.xtrataId).toBe(3117n);
    expect(theirs?.collection.key).toBe('bitcoin-monkeys-fakfun');
    expect(theirs?.localTokenId).toBe(1296n);
    expect(theirs?.xtrataId).toBe(5123n);
  });
});
