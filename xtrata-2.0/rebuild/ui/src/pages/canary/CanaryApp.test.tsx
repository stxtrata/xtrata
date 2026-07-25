import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '../../shell/ToastContext';
import type { NetworkType } from '../../wallet/network';

/**
 * Page-level wiring.
 *
 * The gate rules are covered in `store.test.ts`; this asserts the page renders
 * all fifteen stages, exposes the gate through the controls, and never offers a
 * later stage's action before its predecessor settles.
 */

const walletState = {
  address: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT' as string | undefined,
  walletNetwork: 'testnet' as NetworkType | null,
  appNetwork: 'testnet' as NetworkType,
  wrongNetwork: false,
  isConnected: true
};

const appConfig = {
  network: 'testnet' as NetworkType,
  networkName: 'testnet',
  apiBaseUrl: 'https://api.testnet.hiro.so',
  coreContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-v3-2-3',
  dropsContractId: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT.xtrata-drops-v3',
  appName: 'Xtrata',
  appIcon: ''
};

vi.mock('../../shell/WalletContext', () => ({
  useWallet: () => walletState,
  WalletProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  shortenAddress: (value: string) => value
}));

vi.mock('../../config', () => ({ loadConfig: () => appConfig }));

vi.mock('../../shell/WalletButton', () => ({
  WalletButton: () => <button type="button">Wallet</button>
}));

const { CanaryApp } = await import('./CanaryApp');

const renderPage = () =>
  render(
    <ToastProvider>
      <CanaryApp />
    </ToastProvider>
  );

beforeEach(() => {
  Object.assign(walletState, {
    address: 'ST3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQR6P0PT',
    walletNetwork: 'testnet',
    appNetwork: 'testnet',
    wrongNetwork: false,
    isConnected: true
  });
});

const stageCard = (container: HTMLElement, stage: string): HTMLElement => {
  const card = container.querySelector(`[data-stage="${stage}"]`);
  if (!card) throw new Error(`no card for ${stage}`);
  return card as HTMLElement;
};

describe('CanaryApp', () => {
  it('renders all fifteen stages in order', () => {
    const { container } = renderPage();
    const cards = container.querySelectorAll('.canary-stage');
    expect(cards).toHaveLength(15);
    expect(cards[0]).toHaveAttribute('data-stage', 'sources');
    expect(cards[14]).toHaveAttribute('data-stage', 'activation');
  });

  it('starts with every stage pending and only stage 1 runnable', () => {
    const { container } = renderPage();
    expect(
      within(stageCard(container, 'sources')).getByRole('button', { name: 'Run stage' })
    ).toBeEnabled();
    expect(
      within(stageCard(container, 'testnet-deploy')).getByRole('button', { name: 'Run stage' })
    ).toBeDisabled();
    expect(stageCard(container, 'testnet-deploy')).toHaveAttribute('data-status', 'pending');
  });

  it('shows the lock reason on every gated stage', () => {
    const { container } = renderPage();
    expect(within(stageCard(container, 'source-parity')).getByRole('status')).toHaveTextContent(
      /Locked — stage 1/
    );
    expect(within(stageCard(container, 'activation')).getByRole('status')).toHaveTextContent(
      /Locked — stage 1/
    );
  });

  it('marks the attested stages honestly and quotes their commands', () => {
    const { container } = renderPage();
    const card = stageCard(container, 'contract-tests');
    expect(within(card).getByText(/NOT machine-verified/)).toBeInTheDocument();
    expect(within(card).getByLabelText('Commands for stage 2')).toHaveTextContent(
      'clarinet check && npm test'
    );
    expect(card).toHaveTextContent('This browser cannot run these commands');
    expect(card).toHaveTextContent('the report says so wherever this stage appears');
  });

  it('offers a skip control only on the one skippable stage', () => {
    const { container } = renderPage();
    expect(
      within(stageCard(container, 'sponsored-claim-canary')).getByRole('button', {
        name: /Skip with this reason/
      })
    ).toBeInTheDocument();
    expect(
      within(stageCard(container, 'testnet-deploy')).queryByRole('button', {
        name: /Skip with this reason/
      })
    ).not.toBeInTheDocument();
  });

  it('keeps the production approval phrase behind an acknowledgment and a name', async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    const card = stageCard(container, 'production-approval');

    const input = within(card).getByRole('textbox', { name: /Type/ });
    await user.type(input, 'DEPLOY TO MAINNET');
    await user.click(within(card).getByRole('button', { name: 'Arm' }));
    // Armed, but the gate is still shut: stage 12 is unreachable and the
    // acknowledgment is unticked, so confirming produces an error toast rather
    // than an approval.
    await user.click(within(card).getByRole('button', { name: /Grant production approval/ }));
    expect(card).toHaveAttribute('data-status', 'pending');
    expect(await screen.findByRole('alert')).toHaveTextContent(/plan-invalid/);
  });

  it('offers both report formats from the first render, before anything has run', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /Download report \(JSON\)/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Download report \(Markdown\)/ })).toBeEnabled();
    expect(screen.getByText(/0 passed/)).toBeInTheDocument();
  });

  it('records an operator attestation and unlocks the next stage', async () => {
    const user = userEvent.setup();
    const { container } = renderPage();

    await user.click(
      within(stageCard(container, 'sources')).getByRole('button', { name: 'Run stage' })
    );
    await vi.waitFor(() =>
      expect(stageCard(container, 'sources')).toHaveAttribute('data-status', 'passed')
    );

    const card = stageCard(container, 'contract-tests');
    await user.type(within(card).getByLabelText('Paste the command output'), '124 tests passed');
    await user.type(within(card).getByLabelText('Attested by'), 'operator');
    await user.click(within(card).getByRole('button', { name: 'Record attestation' }));

    expect(card).toHaveAttribute('data-status', 'passed');
    expect(card).toHaveTextContent('operator-attested — NOT machine-verified');
    expect(
      within(stageCard(container, 'source-parity')).getByRole('button', { name: 'Run stage' })
    ).toBeEnabled();
  });
});
