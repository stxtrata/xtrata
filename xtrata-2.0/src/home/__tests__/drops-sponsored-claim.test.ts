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
      'dropsDiagnosticsLog'
    ]) {
      expect(indexHtml).toContain(`id="${id}"`);
    }
    expect(indexHtml).toContain('Raw signed transactions and private wallet data are never printed.');
  });

  it('keeps free claims on the validated sponsored path only', () => {
    expect(homeMain).toContain('sponsored: true');
    expect(homeMain).toContain('inspectSponsoredClaimTransaction(payload');
    expect(homeMain).toContain('pollSponsorJob({');
    expect(homeMain).toContain("'RELAYER_RESUME'");
    expect(homeMain).toContain('claimsInFlight');
    expect(homeMain).not.toContain('dropClaimSelfPaid');
    expect(homeMain).not.toContain('claiming self-paid instead');
  });
});
