export type MigrationSourceDefinition = {
  key: string;
  contractName: string;
  label: string;
  migrationFunction?: string;
};

export type MigrationItemStatus =
  'ready' | 'already-migrated' | 'listed-escrowed' | 'unsupported' | 'unreadable';

export type MigrationItem = {
  sourceKey: string;
  sourceLabel: string;
  sourceContractName: string;
  migrationFunction?: string;
  tokenId: bigint;
  status: MigrationItemStatus;
  detail?: string;
};

export type MigrationSourceError = {
  sourceKey: string;
  sourceLabel: string;
  message: string;
};

export type MigrationHoldingsPage = {
  total: number;
  tokenIds: bigint[];
  resultCount: number;
};

export type MigrationScanProgress = {
  source: MigrationSourceDefinition;
  items: MigrationItem[];
  owned: number;
  checked: number;
};

export type MigrationScanResult = {
  items: MigrationItem[];
  sourceErrors: MigrationSourceError[];
  owned: number;
  checked: number;
  stopped: boolean;
};

export type MigrationQuote = {
  itemCount: number;
  protocolFeePerItemMicroStx: bigint;
  protocolFeeMicroStx: bigint;
  miningAllowancePerItemMicroStx: bigint;
  miningAllowanceMicroStx: bigint;
  estimatedTotalMicroStx: bigint;
  bySource: Array<{
    sourceKey: string;
    sourceLabel: string;
    itemCount: number;
    estimatedTotalMicroStx: bigint;
  }>;
};

export type MigrationAvailability = {
  directHoldingsComplete: boolean;
  marketDiscoveryComplete: boolean;
  quoteReady: boolean;
  portfolioComplete: boolean;
};

export const getMigrationAvailability = (params: {
  directHoldingsComplete: boolean;
  marketDiscoveryComplete: boolean;
  protocolFeeAvailable: boolean;
}): MigrationAvailability => ({
  directHoldingsComplete: params.directHoldingsComplete,
  marketDiscoveryComplete: params.marketDiscoveryComplete,
  // Market discovery can reveal additional escrowed inscriptions, but it cannot
  // invalidate an authoritative direct holding. A direct-only quote is usable
  // once the holdings/status scan and live fee read have both completed.
  quoteReady: params.directHoldingsComplete && params.protocolFeeAvailable,
  portfolioComplete: params.directHoldingsComplete && params.marketDiscoveryComplete
});

export const parseMigrationTokenId = (repr: string | undefined): bigint | null => {
  const match = String(repr ?? '')
    .trim()
    .match(/^u(\d+)$/);
  return match ? BigInt(match[1]) : null;
};

const itemKey = (item: Pick<MigrationItem, 'sourceKey' | 'tokenId'>) =>
  `${item.sourceKey}:${item.tokenId.toString()}`;

export const scanMigrationHoldings = async (params: {
  sources: MigrationSourceDefinition[];
  fetchPage: (
    source: MigrationSourceDefinition,
    offset: number,
    limit: number
  ) => Promise<MigrationHoldingsPage>;
  existsOnTarget: (tokenId: bigint) => Promise<boolean>;
  pageSize?: number;
  shouldContinue?: () => boolean;
  onProgress?: (progress: MigrationScanProgress) => void;
}): Promise<MigrationScanResult> => {
  const pageSize = params.pageSize ?? 200;
  const items: MigrationItem[] = [];
  const sourceErrors: MigrationSourceError[] = [];
  let owned = 0;
  let checked = 0;
  let stopped = false;

  for (const source of params.sources) {
    if (params.shouldContinue && !params.shouldContinue()) {
      stopped = true;
      break;
    }
    try {
      let offset = 0;
      let total = 0;
      do {
        if (params.shouldContinue && !params.shouldContinue()) {
          stopped = true;
          break;
        }
        const page = await params.fetchPage(source, offset, pageSize);
        total = Math.max(0, page.total);
        owned += page.tokenIds.length;

        for (const tokenId of page.tokenIds) {
          if (params.shouldContinue && !params.shouldContinue()) {
            stopped = true;
            break;
          }
          const base = {
            sourceKey: source.key,
            sourceLabel: source.label,
            sourceContractName: source.contractName,
            migrationFunction: source.migrationFunction,
            tokenId
          };
          if (!source.migrationFunction) {
            items.push({
              ...base,
              status: 'unsupported',
              detail: 'The current v3 contract has no migration entry point for this source.'
            });
          } else {
            try {
              const alreadyMigrated = await params.existsOnTarget(tokenId);
              checked += 1;
              items.push({
                ...base,
                status: alreadyMigrated ? 'already-migrated' : 'ready',
                detail: alreadyMigrated
                  ? 'This token id already exists on the current v3 core.'
                  : undefined
              });
            } catch (error) {
              checked += 1;
              items.push({
                ...base,
                status: 'unreadable',
                detail: error instanceof Error ? error.message : String(error)
              });
            }
          }
          params.onProgress?.({ source, items: [...items], owned, checked });
        }

        if (stopped) break;
        if (page.resultCount === 0 && offset < total) {
          throw new Error('Holdings pagination ended before the reported total. Please retry.');
        }
        offset += pageSize;
      } while (offset < total);
    } catch (error) {
      sourceErrors.push({
        sourceKey: source.key,
        sourceLabel: source.label,
        message: error instanceof Error ? error.message : String(error)
      });
    }
    params.onProgress?.({ source, items: [...items], owned, checked });
    if (stopped) break;
  }

  items.sort((a, b) => {
    const sourceOrder =
      params.sources.findIndex((source) => source.key === a.sourceKey) -
      params.sources.findIndex((source) => source.key === b.sourceKey);
    if (sourceOrder !== 0) return sourceOrder;
    return a.tokenId < b.tokenId ? -1 : a.tokenId > b.tokenId ? 1 : 0;
  });

  return { items, sourceErrors, owned, checked, stopped };
};

export const mergeEscrowedMigrationItems = (params: {
  items: MigrationItem[];
  escrowed: Array<{ sourceKey: string; tokenId: bigint }>;
  sources: MigrationSourceDefinition[];
}): MigrationItem[] => {
  const merged = new Map(params.items.map((item) => [itemKey(item), item]));
  for (const escrowed of params.escrowed) {
    const source = params.sources.find((candidate) => candidate.key === escrowed.sourceKey);
    if (!source) continue;
    const key = `${source.key}:${escrowed.tokenId.toString()}`;
    const existing = merged.get(key);
    merged.set(key, {
      ...existing,
      sourceKey: source.key,
      sourceLabel: source.label,
      sourceContractName: source.contractName,
      migrationFunction: source.migrationFunction,
      tokenId: escrowed.tokenId,
      status: source.migrationFunction ? 'listed-escrowed' : 'unsupported',
      detail: source.migrationFunction
        ? 'Cancel this market listing to return the legacy token before migration.'
        : 'This token is listed in market escrow and its source is not supported by v3 migration.'
    });
  }
  return Array.from(merged.values()).sort((a, b) => {
    const sourceOrder =
      params.sources.findIndex((source) => source.key === a.sourceKey) -
      params.sources.findIndex((source) => source.key === b.sourceKey);
    if (sourceOrder !== 0) return sourceOrder;
    return a.tokenId < b.tokenId ? -1 : a.tokenId > b.tokenId ? 1 : 0;
  });
};

export const summarizeMigrationItems = (items: MigrationItem[]) => ({
  ready: items.filter((item) => item.status === 'ready').length,
  alreadyMigrated: items.filter((item) => item.status === 'already-migrated').length,
  listedEscrowed: items.filter((item) => item.status === 'listed-escrowed').length,
  unsupported: items.filter((item) => item.status === 'unsupported').length,
  unreadable: items.filter((item) => item.status === 'unreadable').length
});

export const buildMigrationQuote = (params: {
  items: MigrationItem[];
  protocolFeePerItemMicroStx: bigint;
  miningAllowancePerItemMicroStx: bigint;
}): MigrationQuote => {
  const ready = params.items.filter((item) => item.status === 'ready');
  const count = BigInt(ready.length);
  const protocolFeeMicroStx = params.protocolFeePerItemMicroStx * count;
  const miningAllowanceMicroStx = params.miningAllowancePerItemMicroStx * count;
  const bySourceMap = new Map<string, { sourceLabel: string; itemCount: number }>();
  for (const item of ready) {
    const current = bySourceMap.get(item.sourceKey) ?? {
      sourceLabel: item.sourceLabel,
      itemCount: 0
    };
    current.itemCount += 1;
    bySourceMap.set(item.sourceKey, current);
  }

  return {
    itemCount: ready.length,
    protocolFeePerItemMicroStx: params.protocolFeePerItemMicroStx,
    protocolFeeMicroStx,
    miningAllowancePerItemMicroStx: params.miningAllowancePerItemMicroStx,
    miningAllowanceMicroStx,
    estimatedTotalMicroStx: protocolFeeMicroStx + miningAllowanceMicroStx,
    bySource: Array.from(bySourceMap.entries()).map(([sourceKey, value]) => ({
      sourceKey,
      sourceLabel: value.sourceLabel,
      itemCount: value.itemCount,
      estimatedTotalMicroStx:
        BigInt(value.itemCount) *
        (params.protocolFeePerItemMicroStx + params.miningAllowancePerItemMicroStx)
    }))
  };
};
