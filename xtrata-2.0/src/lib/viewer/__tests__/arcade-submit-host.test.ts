// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PostConditionMode } from '@stacks/transactions';
import * as inline from '../../../arcade-submit/inline';
import { engine, ARCADE_CONTRACT_ID } from '../../../arcade-submit/core';
import { runArcadeSubmit, type ArcadeSubmitPorts } from '../arcade-submit-host';

type Sim = {
  createGame(o: object): { score: number; phase: string };
  step(st: unknown, i: unknown): void;
  botInput(st: unknown): unknown;
  Recorder: new () => { push(i: unknown): void };
  encodeReplay(st: unknown, rec: unknown): Promise<Uint8Array>;
  toBase64Url(b: Uint8Array): string;
};
const AB3 = engine as unknown as Sim;
const PILOT_ADDR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const PILOT = Uint8Array.from('e55cbbaafd88b6e63b036a3a2303b029e039cbbd'.match(/../g)!.map((h) => parseInt(h, 16)));
const OTHER = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';

async function payload() {
  const st = AB3.createGame({ seed: 4, pilot: PILOT, pilotVersion: 22 }); const rec = new AB3.Recorder();
  for (let f = 0; f < 600 && st.phase !== 'over'; f++) { const i = AB3.botInput(st); rec.push(i); AB3.step(st, i); }
  const bytes = await AB3.encodeReplay(st, rec);
  return { v: 1, game: 'astro-blaster-3', network: 'mainnet', contract: ARCADE_CONTRACT_ID, board: 'astro3', period: 0,
    score: st.score, name: 'jim.btc', pilot: PILOT_ADDR, replay: AB3.toBase64Url(bytes) };
}
const logic = (rank: number | null = 1) => async () => ({
  ...inline,
  loadBoard: async () => ({ fee: 0n, enabled: true, maxScore: 10n ** 10n }),
  previewRank: async () => rank,
  isPeriodClosed: async () => false
});
const until = async (fn: () => boolean) => { for (let i = 0; i < 400 && !fn(); i++) await new Promise((r) => setTimeout(r, 10)); expect(fn()).toBe(true); };
const buttons = () => Array.from(document.querySelectorAll('dialog button')) as HTMLButtonElement[];
const button = (text: string) => buttons().find((b) => b.textContent === text);

afterEach(() => { document.body.replaceChildren(); vi.restoreAllMocks(); });

describe('in-place arcade submit (viewer host)', () => {
  it('re-plays the run and signs submit-score with the connected pilot wallet', async () => {
    const calls: any[] = [];
    const ports: ArcadeSubmitPorts = {
      wallet: { getSession: () => ({ isConnected: true, address: PILOT_ADDR, network: 'mainnet' }), connect: vi.fn() },
      showContractCall: (o) => { calls.push(o); o.onFinish({ txid: 'd'.repeat(64) }); },
      loadLogic: logic(1)
    };
    const p = await payload();
    const done = runArcadeSubmit(window, p, 'Inscription #3073', 'ab3-1', ports);
    await until(() => !!button('Sign and submit') && !button('Sign and submit')!.disabled);
    expect(document.querySelector('dialog')!.textContent).toContain('rank #1');
    button('Sign and submit')!.click();
    await expect(done).resolves.toEqual({ kind: 'tx', txId: '0x' + 'd'.repeat(64) });
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ functionName: 'submit-score', stxAddress: PILOT_ADDR, network: 'mainnet', postConditionMode: PostConditionMode.Deny, postConditions: [] });
    expect(calls[0]).not.toHaveProperty('sender');
    expect(calls[0].functionArgs).toHaveLength(5);
    await until(() => !!button('Done'));
    button('Done')!.click();
    expect(document.querySelector('dialog')).toBeNull();
  });

  it('never signs for a wallet that did not fly the run', async () => {
    const show = vi.fn();
    const p = await payload();
    const done = runArcadeSubmit(window, p, 'Inscription #3073', 'ab3-2', {
      wallet: { getSession: () => ({ isConnected: true, address: OTHER, network: 'mainnet' }), connect: vi.fn(async () => ({ isConnected: true, address: OTHER, network: 'mainnet' as const })) },
      showContractCall: show, loadLogic: logic(1)
    });
    await until(() => !!button('Switch wallet'));
    expect(document.querySelector('dialog')!.textContent).toContain(`flown as ${PILOT_ADDR}`);
    expect(button('Sign and submit')).toBeUndefined();
    button('Not now')!.click();
    await expect(done).resolves.toBeNull();
    expect(show).not.toHaveBeenCalled();
  });

  it('connects when no wallet is connected, and blocks a score the contract would refuse', async () => {
    let session: any = { isConnected: false };
    const connect = vi.fn(async () => (session = { isConnected: true, address: PILOT_ADDR, network: 'mainnet' }));
    const sessionChanged = vi.fn();
    const p = await payload();
    const done = runArcadeSubmit(window, p, 'Inscription #3073', 'ab3-3', {
      wallet: { getSession: () => session, connect }, showContractCall: vi.fn(), sessionChanged, loadLogic: logic(0)
    });
    await until(() => !!button('Connect wallet'));
    button('Connect wallet')!.click();
    await until(() => document.querySelector('dialog')!.textContent!.includes('would refuse'));
    expect(connect).toHaveBeenCalledTimes(1);
    expect(sessionChanged).toHaveBeenCalledWith(session);
    expect(button('Submit')!.disabled).toBe(true);
    button('Not now')!.click();
    await expect(done).resolves.toBeNull();
  });

  it('keeps the dialog open after a wallet cancel so the player can retry', async () => {
    let attempt = 0;
    const p = await payload();
    const done = runArcadeSubmit(window, p, 'Inscription #3073', 'ab3-4', {
      wallet: { getSession: () => ({ isConnected: true, address: PILOT_ADDR, network: 'mainnet' }), connect: vi.fn() },
      showContractCall: (o) => { attempt++; if (attempt === 1) o.onCancel(); else o.onFinish({ txId: '0x' + 'e'.repeat(64) }); },
      loadLogic: logic(2)
    });
    await until(() => !!button('Sign and submit') && !button('Sign and submit')!.disabled);
    button('Sign and submit')!.click();
    await until(() => document.querySelector('dialog')!.textContent!.includes('Nothing was sent') && !!button('Sign and submit') && !button('Sign and submit')!.disabled);
    button('Sign and submit')!.click();
    await expect(done).resolves.toEqual({ kind: 'tx', txId: '0x' + 'e'.repeat(64) });
  });
});
