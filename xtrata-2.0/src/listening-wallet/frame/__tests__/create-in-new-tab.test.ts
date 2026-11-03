import { describe, expect, it } from 'vitest';
import { getAddressFromPrivateKey, makeRandomPrivKey, privateKeyToString, TransactionVersion } from '@stacks/transactions';
import { createListeningEngine, type Panel, type PasskeyPort } from '../engine';
import { parseCreateRequest } from '../create-request';
import { webkitOnly } from '../passkey';
import { deriveListeningIdentity } from '../../../lib/listening-wallet/derive';

const MAIN = getAddressFromPrivateKey(privateKeyToString(makeRandomPrivKey()).slice(0, 64) + '01', TransactionVersion.Mainnet);
const prfOf = (seed: number) => Uint8Array.from({ length: 32 }, (_, i) => (i * 7 + seed) % 256);

/**
 * A WebKit-like device: the frame cannot create passkeys, so it opens the create page. The test plays the
 * listener: it "makes" the passkey in the other tab with the user id it was given, then signs in with whichever
 * passkeys `picks` lists, in order (an old synced one first, if asked).
 */
function webkitBox(opts: { picks?: ('old' | 'new')[]; storedOld?: boolean } = {}) {
  const panels: Panel[] = [];
  const opened: { exclude: string[]; name: string; userId: string }[] = [];
  const evaluated: (string | undefined)[] = [];
  const map = new Map<string, string>();
  const picks = [...(opts.picks ?? ['new'])];
  // Passkeys on the device: an older one synced from elsewhere, and the one made in the new tab.
  const passkeys = new Map<string, { prf: Uint8Array; userHandle: string }>([['cred-old', { prf: prfOf(1), userHandle: 'old-user-handle-xxxxxx' }]]);
  let createdInFrame = 0;
  const passkey: PasskeyPort = {
    available: () => true,
    create: async () => { createdInFrame++; throw new Error('WebKit refuses creation in a frame'); },
    evaluate: async (id) => {
      evaluated.push(id);
      const pick = id ?? (picks.shift() === 'old' ? 'cred-old' : 'cred-new');
      const k = passkeys.get(pick)!;
      return { credentialId: pick, prf: k.prf.slice(), userHandle: k.userHandle };
    },
    createsInNewTab: () => true,
    openCreator: (exclude, name, userId) => {
      opened.push({ exclude, name, userId });
      passkeys.set('cred-new', { prf: prfOf(2), userHandle: userId }); // the listener makes it in the new tab
    }
  };
  const engine = createListeningEngine({
    passkey,
    store: { get: (k) => map.get(k) ?? null, set: (k, v) => void map.set(k, v) },
    now: () => 1_760_000_000_000,
    ui: {
      // Retries a step the way the frame does: a retryable error keeps the panel open for another tap.
      act: async (panel, action) => {
        panels.push(panel);
        for (let tries = 0; ; tries++) {
          try { return await action(); } catch (e) { if (!(e as { retryable?: boolean }).retryable || tries > 3) throw e; panels.push({ ...panel, title: `retry: ${(e as Error).message}` }); }
        }
      },
      cancel: () => false,
      idle: () => {}
    }
  });
  return { h: engine.handlers, panels, opened, evaluated, createdInFrame: () => createdInFrame };
}

describe('making the passkey in a new tab (WebKit)', () => {
  it('opens the create page instead of creating in the frame, then signs in with the new passkey and checks it twice', async () => {
    const b = webkitBox();
    const r = await b.h['listening.unlock']({ mode: 'create' });
    expect(b.createdInFrame()).toBe(0);
    expect(b.opened).toHaveLength(1);
    expect(r.address).toBe((await deriveListeningIdentity(prfOf(2))).address);
    // first sign-in offers any passkey, the stability check then asks for exactly that one
    expect(b.evaluated).toEqual([undefined, 'cred-new']);
    expect(b.panels.map((p) => p.kind)).toEqual(['create', 'confirm-passkey', 'verify-passkey']);
    expect(b.panels[0].confirmLabel).toBe('Make my passkey (new tab)');
  });

  it('refuses an older passkey synced to this device, even when this device has no record of it', async () => {
    const b = webkitBox({ picks: ['old', 'new'] });
    const r = await b.h['listening.unlock']({ mode: 'create' });
    expect(r.address).toBe((await deriveListeningIdentity(prfOf(2))).address);
    expect(r.address).not.toBe((await deriveListeningIdentity(prfOf(1))).address);
    expect(b.panels.some((p) => p.title.startsWith('retry: That is a different passkey'))).toBe(true);
  });

  it('sends the create page only what it accepts: a valid user id and a name naming the address, with a short tag', async () => {
    const b = webkitBox();
    await b.h['listening.unlock']({ mode: 'create', main: MAIN });
    const o = b.opened[0];
    expect(o.name).toMatch(new RegExp(`^Xtrata listening wallet · ${MAIN.slice(0, 6)}…${MAIN.slice(-4)} · [0-9A-F]{4}$`));
    expect(o.exclude).toEqual([]); // a wallet for an address is a new passkey beside the others
    const parsed = parseCreateRequest('#' + new URLSearchParams({ u: o.userId, n: o.name }).toString());
    expect(parsed).toEqual({ userId: o.userId, name: o.name, exclude: [] });
    // and the summary names the passkey to choose
    expect(b.panels.find((p) => p.kind === 'confirm-passkey')?.summary).toContain(o.name);
  });
});

describe('create page request', () => {
  const u = 'A'.repeat(22);
  const ok = (extra: Record<string, string> = {}) => '#' + new URLSearchParams({ u, n: 'Xtrata listening wallet · 1F2E', ...extra });
  it('accepts the exact shapes the frame sends', () => {
    expect(parseCreateRequest(ok())).toEqual({ userId: u, name: 'Xtrata listening wallet · 1F2E', exclude: [] });
    expect(parseCreateRequest(ok({ x: 'c'.repeat(20) + ',' + 'd'.repeat(20) }))?.exclude).toHaveLength(2);
    expect(parseCreateRequest(ok({ n: 'Xtrata listening wallet · SP10W2…9TM7 · ABCD' }))?.name).toContain('SP10W2');
  });
  it('refuses anything else: other names, bad ids, too many credentials', () => {
    expect(parseCreateRequest(ok({ n: 'Your bank · 1F2E' }))).toBeNull();
    expect(parseCreateRequest(ok({ n: 'Xtrata listening wallet' }))).toBeNull(); // no tag
    expect(parseCreateRequest(ok({ n: 'Xtrata listening wallet · <b>x</b>' }))).toBeNull();
    expect(parseCreateRequest(ok({ u: 'short' }))).toBeNull();
    expect(parseCreateRequest(ok({ x: 'bad id!' }))).toBeNull();
    expect(parseCreateRequest(ok({ x: Array.from({ length: 26 }, () => 'c'.repeat(20)).join(',') }))).toBeNull();
    expect(parseCreateRequest('')).toBeNull();
  });
});

describe('which browsers create in a new tab', () => {
  it('WebKit: Safari, and every iPhone and iPad browser', () => {
    expect(webkitOnly('Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1')).toBe(true);
    expect(webkitOnly('Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0 Mobile/15E148 Safari/604.1')).toBe(true);
    expect(webkitOnly('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15')).toBe(true);
  });
  it('not Chromium or Firefox on desktop and Android, which create in the frame', () => {
    expect(webkitOnly('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36')).toBe(false);
    expect(webkitOnly('Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36')).toBe(false);
    expect(webkitOnly('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0')).toBe(false);
    expect(webkitOnly('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0')).toBe(false);
  });
});
