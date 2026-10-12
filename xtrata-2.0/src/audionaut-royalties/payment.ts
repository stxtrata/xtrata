import { XTRATA_ROYALTY_ADMIN } from '../music-artist/routes';
import type { RoyaltyRow } from '../../functions/lib/audionaut-royalties';
import type { WalletSession } from '../lib/wallet/types';

export type PaymentQuote = { id: string; edition: number; recipient: string; sender: string; amountMicroStx: number; memo: string };
export type PendingReceipt = { intentId: string; edition: number; txId: string };
export class WalletPaymentCancelled extends Error {}
/** A single explicit payment, with dependencies injected for wallet-free tests. */
export async function executeRoyaltyPayment(options: {
  row: RoyaltyRow; address: string; admin: boolean;
  connect: () => Promise<WalletSession>;
  post: (body: unknown) => Promise<any>; transfer: (quote: PaymentQuote) => Promise<string>;
  remember: (receipt: PendingReceipt) => void; submitted: (receipt: PendingReceipt) => void;
  forget: (intentId: string) => void;
}) {
  const { row } = options;
  if (!options.admin || options.address !== XTRATA_ROYALTY_ADMIN || row.status !== 'unrecorded' || !row.receivingAddress || row.receivingAddress === XTRATA_ROYALTY_ADMIN)
    throw Error('This edition cannot be paid from this wallet.');
  // Re-select the live account for every canary payment; a cached wallet
  // session alone cannot authorize spending from the intended account.
  const wallet = await options.connect();
  if (!wallet.isConnected || wallet.address !== XTRATA_ROYALTY_ADMIN || wallet.network !== 'mainnet') throw Error('Select the Xtrata admin wallet on Stacks mainnet. No payment was requested.');
  const quote: PaymentQuote = await options.post({ action: 'prepare', edition: row.edition });
  if (!quote.id || quote.edition !== row.edition || quote.sender !== XTRATA_ROYALTY_ADMIN || quote.recipient !== row.receivingAddress ||
      quote.amountMicroStx !== 5_000_000 || quote.memo !== `audionaut:${row.edition}`) {
    if (quote.id) await options.post({ action: 'cancel', intentId: quote.id }).catch(() => undefined);
    throw Error('Payment details changed. Refresh and review the receiving wallet again.');
  }
  let txId: string;
  try { txId = await options.transfer(quote); }
  catch (error) {
    if (error instanceof WalletPaymentCancelled) await options.post({ action: 'cancel', intentId: quote.id });
    throw error;
  }
  if (!/^(0x)?[a-f0-9]{64}$/i.test(txId ?? '')) throw Error('The wallet returned no usable transaction ID. Check the wallet history before doing anything else.');
  txId = '0x' + txId.replace(/^0x/i, '').toLowerCase();
  const receipt = { intentId: quote.id, edition: row.edition, txId };
  options.submitted(receipt);
  try { options.remember(receipt); } catch { /* Keep the visible ID and try server storage immediately. */ }
  try { await options.post({ action: 'submitted', intentId: quote.id, txId }); options.forget(quote.id); }
  catch { throw Error(`Payment submitted: ${txId}. Receipt storage will retry; do not send again.`); }
  return receipt;
}
