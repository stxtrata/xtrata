// agent-one-wallet.ts
// Tiny wallet shim that exposes the Xtrata site's PROVEN wallet-connect logic to the
// standalone Agent One wizard as a global `window.XtrataWallet`.
//
// Build this with Vite (library/IIFE) into `agent-one-wallet.js` and place it next to
// the wizard's index.html. The wizard loads it via <script src="agent-one-wallet.js">
// and calls window.XtrataWallet.{connect,disconnect,getAddress,pay}.
//
// Place this file at:  xtrata-1.0/src/agent-one/agent-one-wallet.ts
// (so the relative imports below resolve to the app's wallet lib).

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
  // Opens the connected wallet to send STX (deposit). Uses showStxTransfer, which
  // already prefers the modern stx_transferStx request that current Xverse expects.
  pay(opts: { recipient: string; amount: string | number; network?: string }): Promise<void> {
    return new Promise<void>((resolve) => {
      showStxTransfer({
        recipient: opts.recipient,
        amount: String(opts.amount),
        memo: 'Xtrata Agent One',
        appDetails: { name: 'Xtrata Agent One', icon: '/favicon.ico' },
        onFinish: () => resolve(),
        onCancel: () => resolve(),
      } as Parameters<typeof showStxTransfer>[0]);
    });
  },
};

(window as unknown as { XtrataWallet: typeof XtrataWallet }).XtrataWallet = XtrataWallet;
export {};
