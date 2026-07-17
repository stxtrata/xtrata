import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const agentSource = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');
const wizardSource = readFileSync(
  new URL('../../../xtrata-agent-one/wizard/index.html', import.meta.url),
  'utf8'
);

const recoveryStart = agentSource.indexOf('async function recoverJobAssets');
const recoveryEnd = agentSource.indexOf('async function sendStxRetry', recoveryStart);
const recoverySource = agentSource.slice(recoveryStart, recoveryEnd);

describe('Agent One browser recovery safety', () => {
  it('only recovers parked jobs with their browser-held key', () => {
    expect(recoveryStart).toBeGreaterThan(-1);
    expect(recoverySource).toContain("job.status !== 'NEEDS_RECOVERY'");
    expect(recoverySource).toContain('if (!job.ephemeralMnemonic)');
    expect(recoverySource).toContain('dep.address !== job.depositAddress');
    expect(recoverySource).toContain('does not match the fast-track wallet');
  });

  it('returns inscriptions and verifies an empty inventory before sweeping STX', () => {
    const returnIndex = recoverySource.indexOf('await returnAllHeldNfts');
    const emptyGateIndex = recoverySource.indexOf('if (heldAfter.length)');
    const sweepIndex = recoverySource.indexOf('await sweepStxTo');

    expect(returnIndex).toBeGreaterThan(-1);
    expect(emptyGateIndex).toBeGreaterThan(returnIndex);
    expect(sweepIndex).toBeGreaterThan(emptyGateIndex);
    expect(recoverySource).toContain('STX retained for transfer fees');
    expect(recoverySource).not.toContain('inscribeReceipt');
    expect(agentSource).toContain('inscriptions — #${id} confirmed');
    expect(agentSource).toContain('inscription #${id} return failed');
  });

  it('keeps the key until both NFT and STX recovery have been verified', () => {
    const finalInventoryIndex = recoverySource.indexOf('const finalHeld = await heldInscriptions');
    const deleteKeyIndex = recoverySource.lastIndexOf('delete job.ephemeralMnemonic');
    const indexRefreshIndex = recoverySource.indexOf('await refreshIndexedOwners(returnedTokenIds)');

    expect(finalInventoryIndex).toBeGreaterThan(-1);
    expect(deleteKeyIndex).toBeGreaterThan(finalInventoryIndex);
    expect(indexRefreshIndex).toBeGreaterThan(deleteKeyIndex);
    expect(recoverySource).toContain("new Set((job.nftReturns || []).filter");
    expect(recoverySource).toContain("job.status = 'CANCELLED'");
    expect(recoverySource).toContain('must never turn a successful asset recovery back into NEEDS_RECOVERY');
    expect(agentSource).toContain("if (j.status === 'RECOVERING')");
    expect(agentSource).toContain("j.status = 'NEEDS_RECOVERY'");
  });

  it('requires an explicit, informed confirmation in the wizard', () => {
    expect(wizardSource).toContain("A.recoverJob(mm[1])");
    expect(wizardSource).toContain('Recover inscriptions + STX now');
    expect(wizardSource).toContain('This broadcasts transfers for ${minted} known inscribed token');
    expect(wizardSource).toContain('only after the wallet is confirmed NFT-empty');
    expect(wizardSource).toContain('Keep this tab open until recovery completes.');
    expect(wizardSource).toContain('Xplorer will live-check the owner while the index catches up.');
    expect(wizardSource).not.toContain('svc/recover-all.mjs');
  });
});
