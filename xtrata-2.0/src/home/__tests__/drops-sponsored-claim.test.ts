import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const homeMain = readFileSync(new URL('../main.js', import.meta.url), 'utf8');

describe('public Drops sponsored-claim surface', () => {
  it('ships the embedded claim-round diagnostic panel', () => {
    for (const id of [
      'dropsDiagnostics',
      'dropsDiagnosticsBadge',
      'dropsDiagnosticsCopy',
      'dropsDiagnosticsClear',
      'dropsDiagnosticsLog',
      'dropsHistory',
      'dropsHistoryList'
    ]) {
      expect(indexHtml).toContain(`id="${id}"`);
    }
    expect(indexHtml).toContain(
      'Raw signed transactions and private wallet data are never printed.'
    );
    expect(indexHtml).toContain('1 = one claim per wallet for this campaign');
  });

  it('keeps free claims on the validated sponsored path only', () => {
    expect(homeMain).toContain('sponsored: true');
    expect(homeMain).toContain('showSponsoredContractCall({');
    expect(homeMain).toContain('stx_signTransaction with broadcast=false');
    expect(homeMain).toContain('fetchAddressNonce(');
    expect(homeMain).toContain('inspectSponsoredClaimTransaction(payload');
    expect(homeMain).toContain('submitSponsorClaimWithRetry({');
    expect(homeMain).toContain("import { getDropsCollectionLockForDrop } from '/src/lib/drops/collection-lock.ts'");
    expect(homeMain).toContain("import { loadDropsActivity } from '/src/lib/drops/history.ts'");
    expect(homeMain).toContain("'RELAYER_RETRY'");
    expect(homeMain).toContain('sponsor relayer is temporarily slow');
    expect(homeMain).toContain('Your wallet signature is valid; retrying safely');
    expect(homeMain).toContain('pollSponsorJob({');
    expect(homeMain).toContain("'RELAYER_RESUME'");
    expect(homeMain).toContain("'RELAYER_REJECTED'");
    expect(homeMain).toContain('error.requestId');
    expect(homeMain).toContain('error.traceId');
    expect(homeMain).toContain('claimsInFlight');
    expect(homeMain).toContain('recentlyClaimed');
    expect(homeMain).toContain("'CLAIM_CONFIRMED'");
    expect(homeMain).toContain('Claimed successfully');
    expect(homeMain).toContain('isSponsorClaimConfirmedState');
    expect(homeMain).toContain('watchCreatedDrop({');
    expect(homeMain).toContain('new URLSearchParams({ drop: tokenIdRaw })');
    expect(homeMain).toContain("window.history.pushState(null, '', `/drops?${targetParams.toString()}`)");
    expect(homeMain).toContain("await switchToPage('drops', targetParams)");
    expect(homeMain).toContain('pollIntervalMs: 4000');
    expect(homeMain).toContain('confirmed and now live');
    expect(homeMain).toContain('claimer: optionalPrincipalValue(tuple.claimer)');
    expect(homeMain).toContain('renderDropsHistory();');
    expect(homeMain).toContain("'drops-history__row'");
    expect(homeMain).toContain('Claimed${drop.claimedAt ? ` at block ${drop.claimedAt}` : \'\'} by ');
    expect(homeMain).toContain('const DEFAULT_DROP_GROUP_ID = 1n');
    expect(homeMain).toContain('const DROPS_DISPLAY_LIMIT = 25');
    expect(homeMain).toContain('const DROPS_SCAN_BATCH_SIZE = 12');
    expect(homeMain).toContain("const DROPS_BROWSER_CACHE_KEY = 'xtrata:drops:live:v2'");
    expect(homeMain).toContain("fetch(`/drops/listings${fresh ? '?fresh=1' : ''}`");
    expect(homeMain).toContain("cache: fresh ? 'no-store' : 'default'");
    expect(homeMain).toContain('await Promise.all(ids.map(readDrop))');
    expect(homeMain).toContain('void refreshDropsHistory();');
    expect(homeMain).toContain(
      'drop.claimedAt === null && !dropsState.recentlyClaimed.has(claimKey)'
    );
    expect(homeMain).toContain('DROPS_REFRESH_INTERVAL_MS');
    expect(homeMain).toContain('event.key !== DROPS_BROWSER_CACHE_KEY');
    expect(homeMain).toContain('background: true');
    expect(homeMain).toContain('fresh: true');
    expect(homeMain).toContain('results.length < DROPS_DISPLAY_LIMIT');
    expect(homeMain).toContain('stopped drop scan at safety cap');
    expect(homeMain).toContain('wallet changed. This drop can only be cancelled by its creator');
    expect(homeMain).toContain('renderDrops();');
    expect(homeMain).toContain('hasClaimedAnyDropGroup');
    expect(homeMain).toContain('this wallet has already claimed a free drop from ${lockLabel}');
    expect(homeMain).toContain('dropsState.historyEvents');
    expect(homeMain).toContain('Claim tx');
    expect(homeMain).toContain("functionName: 'has-claimed-in-group'");
    expect(homeMain).toContain("'GROUP_LIMIT'");
    expect(homeMain).toContain('already claimed a free drop from ${lockLabel}');
    expect(homeMain).toContain(': DEFAULT_DROP_GROUP_ID');
    expect(homeMain).not.toContain('dropClaimSelfPaid');
    expect(homeMain).not.toContain('claiming self-paid instead');
  });

  it('locks each claim before the first asynchronous check and explains every wait', () => {
    const handlerStart = homeMain.indexOf('const dropClaim = async (drop) =>');
    const handlerEnd = homeMain.indexOf('const hydrateDropThumbnails', handlerStart);
    const claimHandler = homeMain.slice(handlerStart, handlerEnd);

    expect(handlerStart).toBeGreaterThan(-1);
    expect(claimHandler.indexOf('dropsState.claimsInFlight.add(claimKey)')).toBeLessThan(
      claimHandler.indexOf('await hasClaimedAnyDropGroup')
    );
    expect(homeMain).toContain('claimProgress: new Map()');
    expect(homeMain).toContain("button.setAttribute('aria-busy', 'true')");
    expect(homeMain).toContain('a second transaction will not be created');
    expect(homeMain).toContain('Please wait — checking eligibility…');
    expect(homeMain).toContain('Please wait — creating claim transaction…');
    expect(homeMain).toContain('Approve the claim in your wallet…');
    expect(homeMain).toContain('Please wait — validating wallet approval…');
    expect(homeMain).toContain('Please wait — submitting claim…');
    expect(homeMain).toContain('Please wait — confirming on-chain…');
    expect(indexHtml).toContain('id="dropsStatus" role="status" aria-live="polite"');
  });
});
