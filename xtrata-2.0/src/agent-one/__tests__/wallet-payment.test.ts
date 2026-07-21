import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const walletSource = readFileSync(new URL('../agent-one-wallet.ts', import.meta.url), 'utf8');
const coreSource = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');
const wizardRoot = new URL('../../../xtrata-agent-one/wizard/', import.meta.url);

describe('Agent One wallet payment handoff', () => {
  it('binds payment to the connected address and exposes real bridge errors', () => {
    expect(walletSource).toContain('const sender = adapter.getSession().address;');
    expect(walletSource).toContain('...(sender ? { stxAddress: sender } : {})');
    expect(walletSource).toContain('onError: (error) => reject(');
  });

  it('cache-busts the combined wallet bundle consistently on every wizard surface', () => {
    expect(coreSource).toMatch(/AGENT_BUILD = '\d{4}-\d{2}-\d{2}/);
    // Every wizard page must load agent-one.js with the SAME numeric cache-bust
    // version — a mismatch means one surface serves a stale wallet bundle.
    const versions = ['index.html', 'suno.html', 'manifests.html'].map((file) => {
      const html = readFileSync(new URL(file, wizardRoot), 'utf8');
      const match = html.match(/<script src="agent-one\.js\?v=(\d+)"><\/script>/);
      expect(match, `${file} must load agent-one.js?v=<n>`).toBeTruthy();
      return match?.[1];
    });
    expect(new Set(versions).size).toBe(1);
  });
});
