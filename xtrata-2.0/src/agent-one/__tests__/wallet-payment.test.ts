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

  it('cache-busts the repaired combined wallet bundle on every wizard surface', () => {
    expect(coreSource).toContain("AGENT_BUILD = '2026-07-14.4'");
    for (const file of ['index.html', 'suno.html', 'manifests.html']) {
      const html = readFileSync(new URL(file, wizardRoot), 'utf8');
      expect(html).toContain('<script src="agent-one.js?v=10"></script>');
    }
  });
});
