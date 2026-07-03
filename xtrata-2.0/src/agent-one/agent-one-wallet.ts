// agent-one-wallet.ts
// Exposes the Xtrata site's PROVEN, bundled wallet-connect logic to the standalone
// Agent One wizard as a global `window.XtrataWallet`. Built by Vite (IIFE) into
// xtrata-agent-one/wizard/agent-one-wallet.js, which the wizard loads via <script>.
//
// Build:  npx vite build -c vite.agent-one-wallet.config.ts   (from the repo root)

import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { showStxTransfer, showContractCall } from '../lib/wallet/connect';
import {
  uintCV, standardPrincipalCV, PostConditionMode,
  makeStandardNonFungiblePostCondition, NonFungibleConditionCode, createAssetInfo,
} from '@stacks/transactions';

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
  // Opens the connected wallet to transfer an xtrata inscription NFT (e.g. an escrowed parent) to a
  // recipient the WIZARD supplies (the job's deposit address) — the user just signs. A Deny-mode NFT
  // post-condition pins exactly this one token leaving the sender: nothing else can move.
  sendInscription(opts: { contractAddress: string; contractName: string; tokenId: string | number; sender: string; recipient: string; assetName?: string }): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        showContractCall({
          contractAddress: opts.contractAddress,
          contractName: opts.contractName,
          functionName: 'transfer',
          functionArgs: [uintCV(BigInt(opts.tokenId)), standardPrincipalCV(opts.sender), standardPrincipalCV(opts.recipient)],
          postConditionMode: PostConditionMode.Deny,
          postConditions: [makeStandardNonFungiblePostCondition(
            opts.sender, NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(opts.contractAddress, opts.contractName, opts.assetName || 'xtrata-inscription'),
            uintCV(BigInt(opts.tokenId)),
          )],
          appDetails: { name: 'Xtrata Agent One', icon: '/favicon.ico' },
          onFinish: () => resolve(),
          onCancel: () => resolve(),
        } as unknown as Parameters<typeof showContractCall>[0]);
      } catch (e) { reject(e); }
    });
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
