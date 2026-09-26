// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const state = vi.hoisted(() => ({ ctx: {} as any }));
vi.mock('../ManageWalletContext', () => ({
  ManageWalletProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useManageWallet: () => state.ctx
}));
vi.mock('../../components/WalletTopBar', () => ({ default: () => <div>wallet-bar</div> }));
vi.mock('../../components/AddressLabel', () => ({ default: ({ address }: { address: string }) => <span>{address}</span> }));
import ArtistManagerGate from '../ArtistManagerGate';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ raw: '', source: null })));
  state.ctx = {
    walletSession: { address: ADDRESS, network: 'mainnet', isConnected: true },
    connect: vi.fn(), disconnect: vi.fn(), refreshCreatorSession: vi.fn(),
    signIn: vi.fn(async () => undefined), creatorSession: { status: 'signed-out', mode: 'log' }
  };
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('creator gate', () => {
  it('asks a connected wallet to sign in before opening the studio', async () => {
    render(<ArtistManagerGate><p>studio</p></ArtistManagerGate>);
    fireEvent.click(await screen.findByRole('button', { name: 'Sign in with your wallet' }));
    await waitFor(() => expect(state.ctx.signIn).toHaveBeenCalledOnce());
    expect(screen.queryByText('studio')).toBeNull();
  });

  it('opens the studio for a signed-in, listed creator', async () => {
    state.ctx.creatorSession = { status: 'signed-in', mode: 'log', address: ADDRESS, admin: false, allowlisted: true, allowlistChecked: true, expiresAt: Date.now() + 1e6 };
    render(<ArtistManagerGate><p>studio</p></ArtistManagerGate>);
    expect(await screen.findByText('studio')).toBeTruthy();
  });

  it('offers Request access to a signed-in wallet that is not listed, without revealing the list', async () => {
    state.ctx.creatorSession = { status: 'signed-in', mode: 'enforce', address: ADDRESS, admin: false, allowlisted: false, allowlistChecked: true, expiresAt: Date.now() + 1e6 };
    render(<ArtistManagerGate><p>studio</p></ArtistManagerGate>);
    const link = await screen.findByRole('link', { name: 'Request access' });
    expect(link.getAttribute('href')).toContain('XtrataLayers');
    expect(screen.queryByText(/Workspace access list/)).toBeNull();
  });

  it('asks to sign in again when the session belongs to another wallet', async () => {
    state.ctx.creatorSession = { status: 'signed-in', mode: 'log', address: 'SP2SA0DJXM5106NWT4S45AE442ZHYQPR0T5VSJA19', admin: true, allowlisted: true, allowlistChecked: true, expiresAt: Date.now() + 1e6 };
    render(<ArtistManagerGate><p>studio</p></ArtistManagerGate>);
    expect(await screen.findByText(/signed in with a different wallet/)).toBeTruthy();
    expect(screen.queryByText('studio')).toBeNull();
  });
});
