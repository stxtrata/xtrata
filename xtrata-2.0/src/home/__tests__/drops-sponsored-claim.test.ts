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
    expect(homeMain).toContain("new URLSearchParams({ drop: tokenIdRaw })");
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
    expect(homeMain).toContain('results.length < DROPS_DISPLAY_LIMIT');
    expect(homeMain).toContain('stopped drop scan at safety cap');
    expect(homeMain).toContain("functionName: 'has-claimed-in-group'");
    expect(homeMain).toContain("'GROUP_LIMIT'");
    expect(homeMain).toContain('already claimed a free drop from this campaign group');
    expect(homeMain).toContain(': DEFAULT_DROP_GROUP_ID');
    expect(homeMain).not.toContain('dropClaimSelfPaid');
    expect(homeMain).not.toContain('claiming self-paid instead');
  });
});
