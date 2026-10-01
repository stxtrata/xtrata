// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { cvToString, standardPrincipalCV } from '@stacks/transactions';
import ReplaceFilesPanel from '../ReplaceFilesPanel';

const OWNER = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
const OLD = 'a'.repeat(64);
const NEW = 'b'.repeat(64);
const mocked = vi.hoisted(() => ({
  write: vi.fn(),
  read: vi.fn(),
  wait: vi.fn(),
  wallet: 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX',
  step: 'register' as string,
  posts: [] as Array<Record<string, unknown>>
}));
vi.mock('@stacks/transactions', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@stacks/transactions')>()),
  callReadOnlyFunction: mocked.read
}));
vi.mock('../../../lib/wallet/connect', () => ({ showContractCall: mocked.write }));
vi.mock('../../lib/tx-confirmation', () => ({ waitForTxConfirmation: mocked.wait }));
vi.mock('../../ManageWalletContext', () => ({
  useManageWallet: () => ({ walletSession: { address: mocked.wallet, network: 'mainnet' } })
}));

const record = () => ({
  version: 1, id: 'r1', status: 'open', contractId: `${OWNER}.xtrata-collection-audionauts-1-3c855746`,
  startedAt: 1, startedBy: OWNER, updatedAt: 1, completedAt: null, txs: { register: [], clear: [] },
  items: [{ assetId: 'a84', path: '84.html',
    original: { hash: OLD, storageKey: 'k/old', bytes: 600, chunks: 1, mimeType: 'text/html', tokenUri: 'data:text/plain,collection' },
    replacement: { hash: NEW, storageKey: 'k/new', bytes: 900, chunks: 1, mimeType: 'text/html' } }]
});
const statusFor = (step: string) => step === 'complete'
  ? { record: { ...record(), status: 'complete', completedAt: 2 }, chain: null, plan: null, activeFileCount: 111 }
  : { record: record(), chain: { paused: true, finalized: false, items: [] }, activeFileCount: 111,
      plan: { step, blockers: [], toRegister: step === 'register' ? [NEW] : [], toClear: ['register', 'clear'].includes(step) ? [OLD] : [] } };

beforeEach(() => {
  mocked.step = 'register';
  mocked.posts = [];
  mocked.wallet = OWNER;
  mocked.write.mockReset().mockImplementation((options: any) => options.onFinish({ txId: 'c'.repeat(64) }));
  mocked.wait.mockReset().mockResolvedValue({ status: 'success' });
  mocked.read.mockReset().mockResolvedValue({ type: 7, value: standardPrincipalCV(OWNER) });
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith('/assets')) return Response.json([]);
    if (init?.method === 'POST') {
      const body = JSON.parse(String(init.body));
      mocked.posts.push(body);
      if (body.action === 'record-tx') { mocked.step = body.kind === 'register' ? 'clear' : 'finish'; return Response.json({ record: record() }); }
      if (body.action === 'finish') { mocked.step = 'complete'; return Response.json(statusFor('complete')); }
    }
    return Response.json(statusFor(mocked.step));
  }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('ReplaceFilesPanel', () => {
  it('is hidden for unpublished collections', () => {
    const { container } = render(<ReplaceFilesPanel collectionId="c1" published={false} />);
    expect(container.textContent).toBe('');
  });

  it('registers the new hash with the original token URI, records the tx and waits for it', async () => {
    render(<ReplaceFilesPanel collectionId="c1" published />);
    fireEvent.click(await screen.findByRole('button', { name: 'Register 1 new file' }));
    await waitFor(() => expect(mocked.write).toHaveBeenCalled());
    const call = mocked.write.mock.calls[0][0];
    expect(call.functionName).toBe('set-registered-token-uri-batch');
    expect(call.postConditions).toEqual([]);
    expect(cvToString(call.functionArgs[0])).toContain(`0x${NEW}`);
    expect(cvToString(call.functionArgs[0])).toContain('data:text/plain,collection');
    await waitFor(() => expect(mocked.posts).toContainEqual({ action: 'record-tx', kind: 'register', txId: 'c'.repeat(64) }));
    expect(mocked.wait).toHaveBeenCalledWith('c'.repeat(64), 'mainnet');
    await screen.findByRole('button', { name: 'Remove 1 old registration' });
  });

  it('refuses a wallet that is not the owner or operator admin, before opening the wallet', async () => {
    mocked.wallet = 'SP2Z5RE2TDDAE9VGSNQB4DKG5KKZPVP720Z0MV4BB';
    render(<ReplaceFilesPanel collectionId="c1" published />);
    fireEvent.click(await screen.findByRole('button', { name: 'Register 1 new file' }));
    await screen.findByText(/can't make this change/);
    expect(mocked.write).not.toHaveBeenCalled();
  });

  it('clears the old registration, then finishes and asks the studio to re-check before minting', async () => {
    mocked.step = 'clear';
    const onReplaced = vi.fn();
    render(<ReplaceFilesPanel collectionId="c1" published onReplaced={onReplaced} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Remove 1 old registration' }));
    await waitFor(() => expect(mocked.write).toHaveBeenCalled());
    expect(mocked.write.mock.calls[0][0].functionName).toBe('clear-registered-token-uri');
    expect(cvToString(mocked.write.mock.calls[0][0].functionArgs[0])).toBe(`0x${OLD}`);
    fireEvent.click(await screen.findByRole('button', { name: 'Finish replacement' }));
    await screen.findByText(/Minting stays paused/);
    expect(onReplaced).toHaveBeenCalled();
    expect(screen.getByText(/111 files in the collection/)).toBeTruthy();
  });

  it('resumes waiting on a transaction submitted before a reload', async () => {
    mocked.step = 'clear';
    const pending = { ...statusFor('clear'), record: { ...record(), txs: { register: ['0x' + 'd'.repeat(64)], clear: ['0x' + 'e'.repeat(64)] } } };
    vi.stubGlobal('fetch', vi.fn(async (url: string) => (url.endsWith('/assets') ? Response.json([]) : Response.json(pending))));
    render(<ReplaceFilesPanel collectionId="c1" published />);
    await waitFor(() => expect(mocked.wait).toHaveBeenCalledWith('0x' + 'e'.repeat(64), 'mainnet'));
    expect(mocked.write).not.toHaveBeenCalled();
  });
});
