// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cvToHex, Cl, PostConditionMode } from '@stacks/transactions';

const ADDR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const mocks = vi.hoisted(() => ({
  session: { isConnected: false, address: undefined as string | undefined, network: undefined as string | undefined },
  send: vi.fn(),
  rankFails: false
}));
vi.mock('../../lib/wallet/adapter', () => ({
  createStacksWalletAdapter: () => ({
    getSession: () => mocks.session,
    connect: async () => { mocks.session = { isConnected: true, address: ADDR, network: 'mainnet' }; return mocks.session; },
    disconnect: async () => { mocks.session = { isConnected: false, address: undefined, network: undefined }; }
  })
}));
vi.mock('../../lib/wallet/connect', () => ({ showContractCall: mocks.send }));

let link = '';
beforeEach(async () => {
  vi.resetModules();
  mocks.send.mockReset(); mocks.rankFails = false;
  mocks.session = { isConnected: false, address: undefined, network: undefined };
  const { engine } = await import('../core');
  const A = engine as any;
  const pilot = Uint8Array.from('e55cbbaafd88b6e63b036a3a2303b029e039cbbd'.match(/../g)!.map((h: string) => parseInt(h, 16)));
  const st = A.createGame({ seed: 12, pilot, pilotVersion: 22 }); const rec = new A.Recorder();
  for (let f = 0; f < 2000; f++) { const i = A.botInput(st); rec.push(i); A.step(st, i); }
  const bytes = await A.encodeReplay(st, rec);
  const payload = { v: 1, game: 'astro-blaster-3', network: 'mainnet', contract: ADDR + '.xtrata-arcade-scores-v2', board: 'astro3', period: 0, score: st.score, name: 'TESTER', replay: A.toBase64Url(bytes) };
  link = '#p=' + A.toBase64Url(new TextEncoder().encode(JSON.stringify(payload))) + '&id=ab3-77';
  window.location.hash = link;
  document.documentElement.innerHTML = readFileSync('public/arcade/submit.html', 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  vi.stubGlobal('fetch', vi.fn(async (input: string) => {
    const fn = String(input).split('/').pop();
    if (fn === 'get-board') {
      const v = Cl.some(Cl.tuple({ mode: Cl.uint(0), 'max-score': Cl.uint(1_000_000_000), fee: Cl.uint(0), 'engine-id': Cl.uint(1), daily: Cl.bool(false), enabled: Cl.bool(true) }));
      return new Response(JSON.stringify({ okay: true, result: cvToHex(v) }));
    }
    if (fn === 'preview-rank') {
      if (mocks.rankFails) return new Response('oops', { status: 503 });
      return new Response(JSON.stringify({ okay: true, result: cvToHex(Cl.uint(3)) }));
    }
    return new Response('{}', { status: 404 });
  }));
});
afterEach(() => { vi.unstubAllGlobals(); document.body.replaceChildren(); });
const btn = (id: string) => document.getElementById(id) as HTMLButtonElement;
const text = (id: string) => document.getElementById(id)?.textContent || '';

it('verifies the replay, shows the rank and submits only after the player clicks', async () => {
  mocks.send.mockImplementation((o: any) => o.onFinish({ txId: 'ab'.repeat(32) }));
  await import('../page');
  await vi.waitFor(() => expect(text('rVerified')).toContain('✓'), { timeout: 10000 });
  expect(btn('submit').disabled).toBe(true);
  btn('connect').click();
  await vi.waitFor(() => expect(text('rank')).toContain('#3'));
  expect(mocks.send).not.toHaveBeenCalled();
  btn('submit').click();
  await vi.waitFor(() => expect(mocks.send).toHaveBeenCalledTimes(1));
  const o = mocks.send.mock.calls[0][0];
  expect(o.functionName).toBe('submit-score');
  expect(o.stxAddress).toBe(ADDR);
  expect(o.postConditionMode).toBe(PostConditionMode.Deny);
  expect(o.postConditions).toEqual([]);
  expect(o).not.toHaveProperty('sender');
  await vi.waitFor(() => expect(text('status')).toContain('Submitted'));
  expect(btn('submit').disabled).toBe(true); // no double submit
});

it('treats a failed rank read as unknown, not as "not in the Top 10"', async () => {
  mocks.rankFails = true;
  await import('../page');
  await vi.waitFor(() => expect(text('rVerified')).toContain('✓'), { timeout: 10000 });
  btn('connect').click();
  await vi.waitFor(() => expect(text('rank')).toContain('Could not check'));
  expect(btn('submit').disabled).toBe(false);
});

it('reports a cancelled wallet request without sending anything else', async () => {
  mocks.send.mockImplementation((o: any) => o.onCancel());
  await import('../page');
  await vi.waitFor(() => expect(text('rVerified')).toContain('✓'), { timeout: 10000 });
  btn('connect').click();
  await vi.waitFor(() => expect(btn('submit').disabled).toBe(false));
  btn('submit').click();
  await vi.waitFor(() => expect(text('status')).toContain('Cancelled'));
  expect(mocks.send).toHaveBeenCalledTimes(1);
  expect(btn('submit').disabled).toBe(false);
});

it('refuses a tampered score before any wallet step', async () => {
  const parts = link.split('#p=')[1].split('&');
  const json = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((parts[0].length + 3) % 4)), (c) => c.charCodeAt(0))));
  json.score += 1000;
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(json)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  window.location.hash = '#p=' + b64;
  await import('../page');
  await vi.waitFor(() => expect(text('status')).toContain('cannot be submitted'), { timeout: 10000 });
  expect(btn('connect').disabled).toBe(true);
  expect(mocks.send).not.toHaveBeenCalled();
});
