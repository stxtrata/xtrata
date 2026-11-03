import { describe, expect, it } from 'vitest';
import { CancelledError, createListeningEngine, type Panel, type PasskeyPort } from '../engine';

/**
 * One person must end up with one passkey, however the first attempt went wrong: a closed panel, a reload, a tab the phone
 * discarded. The harness (scripts/claim-harness) measures this in a real browser; these tests pin the rule.
 */
const PRF = Uint8Array.from({ length: 32 }, (_, i) => i);
const KEY = 'xtrata.listening-wallet.v1';

function box(opts: { newTab?: boolean; cancelOn?: { kind: Panel['kind']; times: number }[] } = {}) {
  const map = new Map<string, string>();
  const created: string[] = [];
  const opened: string[] = [];
  const cancels = (opts.cancelOn ?? []).map((c) => ({ ...c }));
  let userHandle = '';
  const passkey: PasskeyPort = {
    available: () => true,
    create: async () => { const id = 'cred-' + (created.length + 1); created.push(id); return { credentialId: id }; },
    evaluate: async (id) => ({ credentialId: id ?? 'cred-' + created.length, prf: PRF.slice(), userHandle }),
    createsInNewTab: () => !!opts.newTab,
    openCreator: (_x, _n, userId) => { opened.push(userId); userHandle = userId; if (!created.length || opened.length > created.length) created.push('cred-' + (created.length + 1)); }
  };
  const engine = createListeningEngine({
    passkey,
    store: { get: (k) => map.get(k) ?? null, set: (k, v) => void map.set(k, v) },
    now: () => 1_760_000_000_000,
    ui: {
      act: async (panel, action) => {
        const c = cancels.find((x) => x.kind === panel.kind && x.times > 0);
        if (c) { c.times--; throw new CancelledError(); }
        return action();
      },
      cancel: () => false, idle: () => {}
    }
  });
  const stored = () => JSON.parse(map.get(KEY) ?? '{"wallets":[]}');
  return { h: engine.handlers, created, opened, stored };
}

describe('a passkey that was made but not yet proven is picked up, not duplicated', () => {
  it('after the confirmation panel is closed, the next attempt reuses the passkey that exists', async () => {
    const b = box({ cancelOn: [{ kind: 'verify-passkey', times: 1 }] });
    await expect(b.h['listening.unlock']({ mode: 'create' })).rejects.toThrow(/Cancelled/);
    expect(b.created).toEqual(['cred-1']);
    expect(b.stored().pending).toMatchObject({ credentialId: 'cred-1' });
    const r = await b.h['listening.unlock']({ mode: 'create' });
    expect(r.address).toMatch(/^SP/);
    expect(b.created).toEqual(['cred-1']); // still one
    expect(b.stored().pending).toBeUndefined(); // proven: it is a wallet now
    expect(b.stored().wallets).toHaveLength(1);
  });

  it('on a phone, a reload while the new tab is open goes back to "Made your passkey?" without opening a second tab', async () => {
    const b = box({ newTab: true, cancelOn: [{ kind: 'confirm-passkey', times: 1 }] });
    await expect(b.h['listening.unlock']({ mode: 'create' })).rejects.toThrow(/Cancelled/);
    expect(b.opened).toHaveLength(1);
    expect(b.stored().pending).toMatchObject({ userId: b.opened[0] });
    await b.h['listening.unlock']({ mode: 'create' });
    expect(b.opened).toHaveLength(1); // the same tab and passkey, not a second one
    expect(b.stored().wallets).toHaveLength(1);
  });

  it('gives up on a half-made passkey after a few failed pick-ups and makes a fresh one', async () => {
    const b = box({ cancelOn: [{ kind: 'verify-passkey', times: 4 }] });
    for (let i = 0; i < 4; i++) await expect(b.h['listening.unlock']({ mode: 'create' })).rejects.toThrow(/Cancelled/);
    expect(b.created).toEqual(['cred-1']);
    await b.h['listening.unlock']({ mode: 'create' });
    expect(b.created).toEqual(['cred-1', 'cred-2']);
  });
});
