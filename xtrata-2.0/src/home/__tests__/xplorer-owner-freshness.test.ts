import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homeMain = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const pageFunction = readFileSync(
  new URL('../../../functions/index/page.ts', import.meta.url),
  'utf8'
);
const contractFunction = readFileSync(
  new URL('../../../functions/index/[contract].ts', import.meta.url),
  'utf8'
);

describe('Xplorer mutable-owner freshness', () => {
  it('live-checks a selected inscription and repairs every summary cache', () => {
    expect(homeMain).toContain('const refreshSelectedTokenOwner = async');
    expect(homeMain).toContain('await client.getOwner(token.id, getReadOnlySenderAddress())');
    expect(homeMain).toContain('selected owner corrected from live chain state');
    expect(homeMain).toContain('for (const cache of state.summaryCacheScopes.values())');
    expect(homeMain).toContain('saveTokenSummaryToCache(');
    expect(homeMain).toContain('void requestIndexedOwnerRefresh([updated]);');
  });

  it('uses Hiro wallet holdings as the owner for direct holdings only', () => {
    expect(homeMain).toContain('const applyKnownWalletOwner =');
    expect(homeMain).toContain('getInjectedEscrowTwinIds()');
    expect(homeMain).toContain('applyKnownWalletOwner(pageIds, viewingAddress);');
    expect(homeMain).toContain('if (corrected.length) void requestIndexedOwnerRefresh(corrected);');
  });

  it('passes force through to both browser and edge index cache bypasses', () => {
    expect(homeMain).toContain('bypassCache: options.force === true');
    for (const source of [pageFunction, contractFunction]) {
      expect(source).toContain("url.searchParams.get('fresh') === '1'");
      expect(source).toContain('edgeCache && !bypassCache');
      expect(source).toContain("bypassCache\n          ? 'no-store'");
    }
  });
});
