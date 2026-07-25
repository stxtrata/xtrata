import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { NetworkType } from '../wallet/network';

/**
 * The wrong-network guard is the last thing standing between a person and a
 * transaction signed against the wrong chain, so it is tested against the two
 * independent failure modes it covers: a misconfigured build (fatal) and a
 * session on the other network (recoverable).
 */

const walletState = {
  appNetwork: 'mainnet' as NetworkType,
  walletNetwork: 'mainnet' as NetworkType | null,
  wrongNetwork: false,
  isConnected: true
};

const config = {
  network: 'mainnet' as NetworkType,
  coreContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
  dropsContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v3'
};

vi.mock('./WalletContext', () => ({
  useWallet: () => walletState
}));

vi.mock('../config', () => ({
  loadConfig: () => config
}));

const { NetworkGuardBanner, useCanSign } = await import('./NetworkGuardBanner');

const CanSignProbe = (): JSX.Element => <span data-testid="can-sign">{String(useCanSign())}</span>;

const setWallet = (patch: Partial<typeof walletState>): void => {
  Object.assign(walletState, patch);
};

const setConfig = (patch: Partial<typeof config>): void => {
  Object.assign(config, patch);
};

beforeEach(() => {
  setWallet({
    appNetwork: 'mainnet',
    walletNetwork: 'mainnet',
    wrongNetwork: false,
    isConnected: true
  });
  setConfig({
    network: 'mainnet',
    coreContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
    dropsContractId: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v3'
  });
});

describe('NetworkGuardBanner', () => {
  it('renders nothing when the wallet and the app agree', () => {
    const { container } = render(<NetworkGuardBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when no wallet is connected', () => {
    setWallet({ isConnected: false, walletNetwork: null, wrongNetwork: false });
    const { container } = render(<NetworkGuardBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('warns, as an alert, when a testnet account is connected to a mainnet app', () => {
    setWallet({ walletNetwork: 'testnet', wrongNetwork: true });
    render(<NetworkGuardBanner />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Wrong network.');
    expect(alert).toHaveTextContent('mainnet');
    expect(alert).toHaveTextContent('testnet');
    expect(alert).toHaveTextContent(/transactions are blocked/i);
    expect(alert.closest('.banner')).toHaveClass('banner--warn');
  });

  it('warns when a mainnet account is connected to a testnet build', () => {
    setConfig({
      network: 'testnet',
      coreContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3',
      dropsContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-drops-v3'
    });
    setWallet({ appNetwork: 'testnet', walletNetwork: 'mainnet', wrongNetwork: true });
    render(<NetworkGuardBanner />);

    expect(screen.getByRole('alert')).toHaveTextContent('Wrong network.');
  });

  it('escalates to a fatal banner when a pinned contract is on the wrong network', () => {
    setConfig({ coreContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3' });
    render(<NetworkGuardBanner />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Configuration is on the wrong network.');
    expect(alert).toHaveTextContent(/Nothing can be signed/);
    expect(alert.closest('.banner')).toHaveClass('banner--danger');
    // The specific offending principal is named.
    expect(alert).toHaveTextContent('ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT');
  });

  it('prefers the configuration error over the session warning', () => {
    setConfig({ dropsContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-drops-v3' });
    setWallet({ walletNetwork: 'testnet', wrongNetwork: true });
    render(<NetworkGuardBanner />);

    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByRole('alert')).toHaveTextContent('Configuration is on the wrong network.');
  });
});

describe('useCanSign', () => {
  it('is true only when connected, on the right network, with a valid configuration', () => {
    render(<CanSignProbe />);
    expect(screen.getByTestId('can-sign')).toHaveTextContent('true');
  });

  it('is false while disconnected', () => {
    setWallet({ isConnected: false });
    render(<CanSignProbe />);
    expect(screen.getByTestId('can-sign')).toHaveTextContent('false');
  });

  it('is false on the wrong network', () => {
    setWallet({ wrongNetwork: true, walletNetwork: 'testnet' });
    render(<CanSignProbe />);
    expect(screen.getByTestId('can-sign')).toHaveTextContent('false');
  });

  it('is false when the build points at contracts on another network', () => {
    setConfig({ coreContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3' });
    render(<CanSignProbe />);
    expect(screen.getByTestId('can-sign')).toHaveTextContent('false');
  });
});
