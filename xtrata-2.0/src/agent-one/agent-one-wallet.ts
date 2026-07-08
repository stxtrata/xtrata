// agent-one-wallet.ts
// Exposes the Xtrata site's PROVEN, bundled wallet-connect logic to the standalone
// Agent One wizard as a global `window.XtrataWallet`. Built by Vite (IIFE) into
// xtrata-agent-one/wizard/agent-one-wallet.js, which the wizard loads via <script>.
//
// Build:  npx vite build -c vite.agent-one-wallet.config.ts   (from the repo root)

import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { showStxTransfer, showContractCall } from '../lib/wallet/connect';
import { buildTransferCall } from '../lib/contract/client';
import { buildTransferPostCondition } from '../lib/contract/post-conditions';
import { validateTransferRequest, getTransferValidationMessage } from '../lib/wallet/transfer';
import { PostConditionMode } from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

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
  // Opens the connected wallet to transfer an xtrata inscription NFT (e.g. an escrowed parent).
  // This is the SAME proven path as the site's "Send selected inscription" (ViewerScreen/MyWallet):
  // buildTransferCall + Deny-mode Sends post-condition + stxAddress, via showContractCall — except
  // the recipient is supplied by the wizard (the active job's deposit address), never user-editable.
  // Resolves { txId } on submit; REJECTS on cancel/failure so the UI can tell the user what happened.
  sendInscription(opts: { contractAddress: string; contractName: string; tokenId: string | number; sender: string; recipient: string; assetName?: string; network?: string }): Promise<{ txId?: string }> {
    return new Promise<{ txId?: string }>((resolve, reject) => {
      try {
        const validation = validateTransferRequest({
          senderAddress: opts.sender,
          recipientAddress: opts.recipient,
          tokenId: BigInt(opts.tokenId),
        });
        if (!validation.ok) { reject(new Error(getTransferValidationMessage(validation) || 'Transfer is not ready yet.')); return; }
        const contract = { address: opts.contractAddress, contractName: opts.contractName, network: (opts.network === 'testnet' ? 'testnet' : 'mainnet') as 'mainnet' | 'testnet' };
        const network = opts.network === 'testnet' ? new StacksTestnet() : new StacksMainnet();
        const callOptions = buildTransferCall({
          contract,
          network,
          id: BigInt(opts.tokenId),
          sender: opts.sender,
          recipient: validation.recipient as string,
          overrides: {
            postConditionMode: PostConditionMode.Deny,
            postConditions: [buildTransferPostCondition({
              contract,
              senderAddress: opts.sender,
              tokenId: BigInt(opts.tokenId),
              ...(opts.assetName ? { assetName: opts.assetName } : {}),
            })],
          },
        });
        showContractCall({
          ...(callOptions as Parameters<typeof showContractCall>[0]),
          stxAddress: opts.sender,
          appDetails: { name: 'Xtrata Agent One', icon: '/favicon.ico' },
          onFinish: (payload: any) => resolve({ txId: payload && payload.txId }),
          onCancel: () => reject(new Error('Transfer cancelled or failed in wallet.')),
        } as Parameters<typeof showContractCall>[0]);
      } catch (e) { reject(e instanceof Error ? e : new Error(String(e))); }
    });
  },
  isConnected(): boolean {
    return adapter.getSession().isConnected === true;
  },
  // Generic contract call over the site's PROVEN showContractCall path (the same
  // one inscribe/swap use on the core site). Args and post-conditions are passed
  // as serialized Clarity hex strings so a caller can build them with its own
  // @stacks/transactions version without cross-version object incompatibility.
  callContract(opts: {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgsHex: string[];
    postConditionsHex?: string[];
    postConditionMode?: 'allow' | 'deny';
    sender?: string;
    network?: string;
  }): Promise<{ txId?: string }> {
    return new Promise<{ txId?: string }>((resolve, reject) => {
      try {
        showContractCall({
          contractAddress: opts.contractAddress,
          contractName: opts.contractName,
          functionName: opts.functionName,
          functionArgs: opts.functionArgsHex as unknown as Parameters<typeof showContractCall>[0]['functionArgs'],
          postConditions: (opts.postConditionsHex && opts.postConditionsHex.length
            ? opts.postConditionsHex
            : undefined) as unknown as Parameters<typeof showContractCall>[0]['postConditions'],
          postConditionMode:
            opts.postConditionMode === 'allow' ? PostConditionMode.Allow : PostConditionMode.Deny,
          network: (opts.network === 'testnet' ? 'testnet' : 'mainnet'),
          stxAddress: opts.sender,
          appDetails: { name: 'Xtrata', icon: '/favicon.ico' },
          onFinish: (payload: any) => resolve({ txId: payload && (payload.txId || payload.txid) }),
          onCancel: () => reject(new Error('Transaction cancelled or failed in wallet.')),
        } as Parameters<typeof showContractCall>[0]);
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)));
      }
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
