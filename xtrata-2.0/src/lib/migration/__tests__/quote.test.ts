import { describe, expect, it, vi } from 'vitest';
import {
  buildMigrationQuote,
  getMigrationAvailability,
  mergeEscrowedMigrationItems,
  parseMigrationTokenId,
  scanMigrationHoldings,
  summarizeMigrationItems,
  type MigrationSourceDefinition
} from '../quote';

const sources: MigrationSourceDefinition[] = [
  {
    key: 'v1',
    contractName: 'legacy-v1',
    label: 'Legacy v1',
    migrationFunction: 'migrate-from-v1'
  },
  {
    key: 'unsupported',
    contractName: 'legacy-unsupported',
    label: 'Legacy unsupported'
  }
];

describe('migration quote helpers', () => {
  it('parses only SIP-009 uint token representations', () => {
    expect(parseMigrationTokenId('u36')).toBe(36n);
    expect(parseMigrationTokenId('  u2402  ')).toBe(2402n);
    expect(parseMigrationTokenId('36')).toBeNull();
    expect(parseMigrationTokenId(undefined)).toBeNull();
  });

  it('scans all sources and keeps blocked or unreadable tokens visible', async () => {
    const fetchPage = vi.fn(async (source: MigrationSourceDefinition) => ({
      total: source.key === 'v1' ? 3 : 1,
      tokenIds: source.key === 'v1' ? [1n, 2n, 3n] : [9n],
      resultCount: source.key === 'v1' ? 3 : 1
    }));
    const result = await scanMigrationHoldings({
      sources,
      fetchPage,
      existsOnTarget: async (tokenId) => {
        if (tokenId === 2n) return true;
        if (tokenId === 3n) throw new Error('temporary read failure');
        return false;
      }
    });

    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(result.items.map((item) => [item.tokenId, item.status])).toEqual([
      [1n, 'ready'],
      [2n, 'already-migrated'],
      [3n, 'unreadable'],
      [9n, 'unsupported']
    ]);
    expect(summarizeMigrationItems(result.items)).toEqual({
      ready: 1,
      alreadyMigrated: 1,
      listedEscrowed: 0,
      unsupported: 1,
      unreadable: 1
    });
  });

  it('merges seller listings as escrow blockers and excludes them from the quote', () => {
    const readyItem = {
      sourceKey: 'v1',
      sourceLabel: 'Legacy v1',
      sourceContractName: 'legacy-v1',
      migrationFunction: 'migrate-from-v1',
      tokenId: 36n,
      status: 'ready' as const
    };
    const items = mergeEscrowedMigrationItems({
      items: [readyItem],
      escrowed: [{ sourceKey: 'v1', tokenId: 36n }],
      sources
    });
    const quote = buildMigrationQuote({
      items,
      protocolFeePerItemMicroStx: 100_000n,
      miningAllowancePerItemMicroStx: 5_000n
    });

    expect(items[0].status).toBe('listed-escrowed');
    expect(items[0].detail).toContain('Cancel this market listing');
    expect(quote.itemCount).toBe(0);
  });

  it('reports a failed source without silently omitting other source results', async () => {
    const result = await scanMigrationHoldings({
      sources,
      fetchPage: async (source) => {
        if (source.key === 'v1') throw new Error('holdings unavailable');
        return { total: 1, tokenIds: [9n], resultCount: 1 };
      },
      existsOnTarget: async () => false
    });

    expect(result.sourceErrors).toEqual([
      {
        sourceKey: 'v1',
        sourceLabel: 'Legacy v1',
        message: 'holdings unavailable'
      }
    ]);
    expect(result.items.map((item) => item.status)).toEqual(['unsupported']);
  });

  it('separates exact protocol fees from the mining allowance by source', () => {
    const items = [1n, 2n].map((tokenId) => ({
      sourceKey: 'v1',
      sourceLabel: 'Legacy v1',
      sourceContractName: 'legacy-v1',
      migrationFunction: 'migrate-from-v1',
      tokenId,
      status: 'ready' as const
    }));
    const quote = buildMigrationQuote({
      items,
      protocolFeePerItemMicroStx: 100_000n,
      miningAllowancePerItemMicroStx: 5_000n
    });

    expect(quote.protocolFeeMicroStx).toBe(200_000n);
    expect(quote.miningAllowanceMicroStx).toBe(10_000n);
    expect(quote.estimatedTotalMicroStx).toBe(210_000n);
    expect(quote.bySource).toEqual([
      {
        sourceKey: 'v1',
        sourceLabel: 'Legacy v1',
        itemCount: 2,
        estimatedTotalMicroStx: 210_000n
      }
    ]);
  });

  it('keeps a direct-holdings quote actionable when market discovery is incomplete', () => {
    expect(
      getMigrationAvailability({
        directHoldingsComplete: true,
        marketDiscoveryComplete: false,
        protocolFeeAvailable: true
      })
    ).toEqual({
      directHoldingsComplete: true,
      marketDiscoveryComplete: false,
      quoteReady: true,
      portfolioComplete: false
    });

    expect(
      getMigrationAvailability({
        directHoldingsComplete: false,
        marketDiscoveryComplete: true,
        protocolFeeAvailable: true
      }).quoteReady
    ).toBe(false);
  });
});
