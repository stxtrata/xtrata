// agent-one-wallet.ts
// Exposes the Xtrata site's PROVEN, bundled wallet-connect logic to the standalone
// Agent One wizard as a global `window.XtrataWallet`. Built by Vite (IIFE) into
// xtrata-agent-one/wizard/agent-one-wallet.js, which the wizard loads via <script>.
//
// Build:  npx vite build -c vite.agent-one-wallet.config.ts   (from the repo root)

import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { showStxTransfer } from '../lib/wallet/connect';

const adapter = createStacksWalletAdapter({
  appName: 'Xtrata Agent One',
  appIcon: '/favicon.ico',
});

const XtrataWallet = {
  async connect(): Promise<string | null> {
    const session = await adapter.connect();
    return session.address ?? null;
  },
  async disconnect(): Promise<void> {
    await adapter.disconnect();
  },
  getAddress(): string | null {
    const s = adapter.getSession();
    return s.isConnected ? (s.address ?? null) : null;
  },
  // Opens the connected wallet to send STX. showStxTransfer already prefers the
  // modern stx_transferStx request that current Xverse expects (legacy popup fallback).
  pay(opts: { recipient: string; amount: string | number; network?: string }): Promise<void> {
    return new Promise<void>((resolve) => {
      showStxTransfer({
        recipient: opts.recipient,
        amount: String(opts.amount),
        memo: 'Xtrata Agent One',
        network: (opts.network ?? 'mainnet'),
        appDetails: { name: 'Xtrata Agent One', icon: '/favicon.ico' },
        onFinish: () => resolve(),
        onCancel: () => resolve(),
      } as unknown as Parameters<typeof showStxTransfer>[0]);
    });
  },
};

(window as unknown as { XtrataWallet: typeof XtrataWallet }).XtrataWallet = XtrataWallet;
export {};
