// The one wallet step: hand a built submit-score call to showContractCall
// (src/lib/wallet, docs/WALLET-PLAYBOOK.md) and resolve with the txid.
import type { WalletCallProgress } from '../lib/wallet/connect';
import { SUBMIT_ERRORS, type buildSubmitCall } from './core';

export const progressText: Record<WalletCallProgress, string> = {
  'provider-selected': 'Wallet selected. Preparing the request…',
  'account-read': 'Checking the active wallet account. Nothing has been signed yet…',
  'account-cached': 'Wallet account confirmed. Preparing the transaction…',
  'account-read-failed': 'The wallet did not share its account. Trying its connection flow…',
  'account-reconnect': 'Waiting for your wallet to confirm account access. Check the extension.',
  'signing-request': 'Approve the transaction in your wallet. Check the network fee before signing.',
  'legacy-request': 'Wallet popup requested. Check your extension and popup permissions.'
};

export type ShowContractCall = (options: any) => void;
export class SubmitCancelled extends Error {}

export function signSubmit(show: ShowContractCall, call: ReturnType<typeof buildSubmitCall>, onStatus: (text: string) => void): Promise<string> {
  return new Promise<string>((resolve, reject) => show({
    ...call,
    onProgress: (stage: WalletCallProgress) => onStatus(progressText[stage] ?? 'Waiting for your wallet…'),
    onFinish: (result: { txId?: string; txid?: string }) => {
      const id = String(result?.txId || result?.txid || '');
      if (!/^(0x)?[0-9a-f]{64}$/i.test(id)) { reject(new Error('The wallet did not return a transaction ID. Check your wallet history before trying again.')); return; }
      resolve(id.startsWith('0x') ? id : '0x' + id);
    },
    onCancel: () => reject(new SubmitCancelled('Cancelled. Nothing was sent.')),
    onError: (e: unknown) => reject(e)
  }));
}

export function submitErrorMessage(e: unknown): string {
  const text = String((e as { message?: string })?.message || '');
  const m = /\(err u(\d+)\)/.exec(text);
  return m && SUBMIT_ERRORS[+m[1]] ? SUBMIT_ERRORS[+m[1]] : (text || 'The wallet request failed.');
}
