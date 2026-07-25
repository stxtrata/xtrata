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
      'dropsHistoryList',
      'dropsRuleOnePerWallet',
      'dropsRuleRequireBns',
      'dropsRuleOnePerBns'
    ]) {
      expect(indexHtml).toContain(`id="${id}"`);
    }
    expect(indexHtml).toContain(
      'Raw signed transactions and private wallet data are never printed.'
    );
    expect(indexHtml).toContain('1 = one claim per wallet for this campaign');
  });

  it('keeps free claims on the validated sponsored path only', () => {
    expect(homeMain).toContain(
      'installGlobalTelemetry'
    );
    expect(homeMain).toContain('installGlobalTelemetry();');
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
    expect(homeMain).toContain("new URLSearchParams({ drop: tokenIdRaw })");
    expect(homeMain).toContain("window.history.pushState(null, '', `/drops?${targetParams.toString()}`)");
    expect(homeMain).toContain("await switchToPage('drops', targetParams)");
    expect(homeMain).toContain('pollIntervalMs: 4000');
    expect(homeMain).toContain('confirmed, rules saved, and now live');
    expect(homeMain).toContain('registerDropPolicy({');
    expect(homeMain).toContain('chooseClaimBnsName(drop, policyRules, round)');
    expect(homeMain).toContain('sponsorClient.attestCampaign({');
    expect(homeMain).toContain("functionName: isCampaignClaim ? 'claim-campaign' : 'claim'");
    expect(homeMain).toContain('campaignAttestation.bnsKeyHex');
    expect(homeMain).toContain('campaignAttestation.signatureHex');
    expect(homeMain).toContain('bnsName,');
    expect(homeMain).toContain('generateUniqueDropGroupId');
    expect(homeMain).toContain('claimer: optionalPrincipalValue(tuple.claimer)');
    expect(homeMain).toContain('renderDropsHistory();');
    expect(homeMain).toContain("'drops-history__row'");
    expect(homeMain).toContain('Claimed${drop.claimedAt ? ` at block ${drop.claimedAt}` : \'\'} by ');
    expect(homeMain).toContain('const DEFAULT_DROP_GROUP_ID = 1n');
    // Asserted as a floor rather than a literal: the limit caps how many drops the
    // page can show, and a value below a full campaign silently truncates the grid
    // (33 editions rendered as 25 under the previous value). The scan is also
    // bounded by candidate count now, not by results, because the reads run
    // concurrently through runReadOnlyLimited instead of one at a time.
    const displayLimit = Number(/const DROPS_DISPLAY_LIMIT = (\d+)/.exec(homeMain)?.[1]);
    expect(displayLimit).toBeGreaterThanOrEqual(33);
    expect(homeMain).toContain('candidates.length < DROPS_DISPLAY_LIMIT');
    expect(homeMain).toContain('runReadOnlyLimited(candidates, DROPS_READ_CONCURRENCY');
    expect(homeMain).toContain('stopped drop scan at safety cap');
    expect(homeMain).toContain('wallet changed. This drop can only be cancelled by its creator');
    expect(homeMain).toContain('renderDrops();');
    expect(homeMain).toContain('hasClaimedAnyDropGroup');
    expect(homeMain).toContain('this wallet has already claimed a drop from ${lockLabel}');
    expect(homeMain).toContain('dropsState.historyEvents');
    expect(homeMain).toContain('Claim tx');
    expect(homeMain).toContain("functionName: 'has-claimed-in-group'");
    expect(homeMain).toContain("'GROUP_LIMIT'");
    expect(homeMain).toContain('already claimed a drop from ${lockLabel}');
    expect(homeMain).toContain(': policyRules.onePerWallet');
    expect(homeMain).toContain('? DEFAULT_DROP_GROUP_ID');
    expect(homeMain).not.toContain('dropClaimSelfPaid');
    expect(homeMain).not.toContain('claiming self-paid instead');
  });
});
