import { expect, it, vi } from 'vitest';
import { executeRoyaltyPayment, WalletPaymentCancelled } from '../payment';
import { XTRATA_ROYALTY_ADMIN } from '../../music-artist/routes';
const receiver = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX', txId = '0x' + 'a'.repeat(64);
function fixture() {
  const row = { edition: 5, status: 'unrecorded', receivingAddress: receiver } as any;
  const quote = { id: 'intent-1', edition: 5, recipient: receiver, sender: XTRATA_ROYALTY_ADMIN, amountMicroStx: 5000000, memo: 'audionaut:5' };
  const wallet = { isConnected: true, address: XTRATA_ROYALTY_ADMIN, network: 'mainnet' } as any;
  return { row, quote, options: { row, address: XTRATA_ROYALTY_ADMIN, admin: true, getWallet: () => wallet,
    connect: vi.fn(async () => wallet), post: vi.fn(async (body: any) => body.action === 'prepare' ? quote : { ok: true }),
    transfer: vi.fn(async () => txId), remember: vi.fn(), submitted: vi.fn(), forget: vi.fn() } };
}
it('reserves before the wallet, captures the ID before storage and then acknowledges it', async () => {
  const { options, quote } = fixture();
  expect(await executeRoyaltyPayment(options)).toEqual({ intentId: 'intent-1', edition: 5, txId });
  expect(options.transfer).toHaveBeenCalledWith(quote);
  expect(options.post.mock.calls.map(([body]) => body.action)).toEqual(['prepare', 'submitted']);
  expect(options.submitted.mock.invocationCallOrder[0]).toBeLessThan(options.remember.mock.invocationCallOrder[0]);
  expect(options.remember.mock.invocationCallOrder[0]).toBeLessThan(options.post.mock.invocationCallOrder[1]);
  expect(options.forget).toHaveBeenCalledWith('intent-1');
});
it.each(['other-admin', 'recipient', 'paid', 'retained', 'unverified', 'self'])('does not request a transfer for %s', async mode => {
  const { options } = fixture();
  if (mode === 'other-admin') options.address = receiver;
  if (mode === 'recipient') options.admin = false;
  if (['paid', 'retained', 'unverified'].includes(mode)) options.row.status = mode;
  if (mode === 'self') options.row.receivingAddress = XTRATA_ROYALTY_ADMIN;
  await expect(executeRoyaltyPayment(options)).rejects.toThrow();
  expect(options.post).not.toHaveBeenCalled(); expect(options.transfer).not.toHaveBeenCalled();
});
it('requires the actual connected wallet to match the canary address and mainnet', async () => {
  const { options } = fixture(); options.getWallet = () => ({ isConnected: true, address: receiver, network: 'mainnet' });
  options.connect.mockResolvedValue({ isConnected: true, address: XTRATA_ROYALTY_ADMIN, network: 'testnet' });
  await expect(executeRoyaltyPayment(options)).rejects.toThrow('Select the Xtrata');
  expect(options.post).not.toHaveBeenCalled(); expect(options.transfer).not.toHaveBeenCalled();
});
it.each(['amount', 'recipient', 'memo'])('refuses a changed %s before wallet approval', async changed => {
  const { options, quote } = fixture();
  if (changed === 'amount') quote.amountMicroStx = 6000000;
  if (changed === 'recipient') quote.recipient = XTRATA_ROYALTY_ADMIN;
  if (changed === 'memo') quote.memo = 'wrong';
  await expect(executeRoyaltyPayment(options)).rejects.toThrow('details changed');
  expect(options.transfer).not.toHaveBeenCalled(); expect(options.post.mock.calls.at(-1)?.[0].action).toBe('cancel');
});
it('releases an explicit cancellation but retains an ambiguous wallet error', async () => {
  const first = fixture().options; first.transfer.mockRejectedValue(new WalletPaymentCancelled('cancelled'));
  await expect(executeRoyaltyPayment(first)).rejects.toThrow('cancelled'); expect(first.post.mock.calls.at(-1)?.[0].action).toBe('cancel');
  const next = fixture().options; next.transfer.mockRejectedValue(Error('connection lost'));
  await expect(executeRoyaltyPayment(next)).rejects.toThrow('connection lost'); expect(next.post).toHaveBeenCalledTimes(1);
});
it('keeps the submitted ID if storage fails and never retries the transfer', async () => {
  const { options } = fixture(); options.post.mockReset();
  options.post.mockImplementation(async (body: any) => { if (body.action === 'prepare') return fixture().quote; throw Error('offline'); });
  await expect(executeRoyaltyPayment(options)).rejects.toThrow(txId);
  expect(options.remember).toHaveBeenCalled(); expect(options.forget).not.toHaveBeenCalled(); expect(options.transfer).toHaveBeenCalledTimes(1);
});
it('still records the ID on the server if local storage is unavailable', async () => {
  const { options } = fixture(); options.remember.mockImplementation(() => { throw Error('quota'); });
  await executeRoyaltyPayment(options); expect(options.post.mock.calls.at(-1)?.[0]).toMatchObject({ action: 'submitted', txId });
});
