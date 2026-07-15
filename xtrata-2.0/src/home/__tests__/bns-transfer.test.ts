import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const homeMain = readFileSync(new URL('../main.js', import.meta.url), 'utf8');

describe('My Wallet BNS recipients', () => {
  it('shows the resolved address and keeps it associated with the send field', () => {
    expect(indexHtml).toContain('placeholder="ST... or name.btc"');
    expect(indexHtml).toContain('id="transferRecipientResolution"');
    expect(indexHtml).toContain('aria-describedby="transferRecipientResolution transferStatus"');
    expect(homeMain).toContain('resolveBnsAddress({');
    expect(homeMain).toContain('resolveBnsNames({');
    expect(homeMain).toContain('`${lookup.name} → ${lookup.address}`');
    expect(homeMain).toContain('resolvedRecipientAddress: getResolvedTransferRecipientAddress()');
    expect(homeMain).toContain("addEventListener('input', queueTransferRecipientLookup)");
  });

  it('guards against stale lookups and prefers known BNS wallet labels', () => {
    expect(homeMain).toContain('requestId !== state.transferRecipientLookupRequestId');
    expect(homeMain).toContain('state.transferRecipientLookupAbortController?.abort()');
    expect(homeMain).toContain('state.connectedWalletNameAddress, viewingAddress');
    expect(homeMain).toContain('Using connected wallet ${getConnectedWalletLabel()');
  });
});
