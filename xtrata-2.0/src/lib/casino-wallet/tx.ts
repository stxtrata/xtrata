/**
 * The ONE transaction the casino wallet will sign: a plain TESTNET STX transfer of 1 to 10 whole STX to the LAYR exchange address,
 * memo "ParallaX LAYR". The recipient is fixed here, never taken from the page. Fees and nonces are explicit, so signing makes no
 * network call (the wallet origin has `connect-src 'none'`).
 *
 * `checkSignedBuy` is the page's own check of what the wallet signed, run before anything is broadcast.
 */
import {
  addressFromVersionHash,
  AddressVersion,
  addressToString,
  AnchorMode,
  AuthType,
  deserializeTransaction,
  PayloadType,
  TransactionVersion
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

export const EXCHANGE_ADDRESS = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';
export const BUY_MEMO = 'ParallaX LAYR';
export const MIN_STX = 1;
export const MAX_STX = 10;
/** Default network fee for a buy (testnet): 0.003 STX. */
export const BUY_FEE = 3_000n;
/** The most the wallet will pay in fees for one buy: 0.05 STX. */
export const BUY_FEE_CAP = 50_000n;
const TESTNET_CHAIN_ID = 0x80000000;

export interface BuyRequest { stx: number; fee: bigint; nonce: bigint }

export function validateBuy(p: { stx: unknown; fee: unknown; nonce: unknown }): BuyRequest {
  const stx = p.stx;
  if (typeof stx !== 'number' || !Number.isInteger(stx) || stx < MIN_STX || stx > MAX_STX)
    throw new Error(`Choose a whole amount from ${MIN_STX} to ${MAX_STX} STX.`);
  const fee = typeof p.fee === 'string' && /^[1-9]\d{0,9}$/.test(p.fee) ? BigInt(p.fee) : typeof p.fee === 'bigint' ? p.fee : -1n;
  if (fee < 1n || fee > BUY_FEE_CAP) throw new Error('That network fee is not allowed.');
  const nonce = typeof p.nonce === 'string' && /^(0|[1-9]\d{0,15})$/.test(p.nonce) ? BigInt(p.nonce) : typeof p.nonce === 'bigint' ? p.nonce : -1n;
  if (nonce < 0n || nonce > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Invalid nonce.');
  return { stx, fee, nonce };
}

/** Options for makeSTXTokenTransfer (add senderKey inside the wallet origin). */
export function buyTransferOptions(b: BuyRequest) {
  return {
    recipient: EXCHANGE_ADDRESS,
    amount: BigInt(b.stx) * 1_000_000n,
    fee: b.fee,
    nonce: b.nonce,
    memo: BUY_MEMO,
    network: new StacksTestnet(),
    anchorMode: AnchorMode.Any
  };
}

const unhex = (v: string) => {
  const s = v.replace(/^0x/, '');
  if (!/^(?:[0-9a-f]{2})+$/i.test(s) || s.length > 4096) throw new Error('The signed transaction is not readable.');
  return Uint8Array.from(s.match(/../g)!, (b) => parseInt(b, 16));
};

/**
 * Decode what the wallet signed and check it is exactly the buy that was asked for, from `address`, before it is broadcast.
 * Returns the transaction id (0x…).
 */
export function checkSignedBuy(raw: string, expected: { address: string; stx: number; fee: bigint; nonce: bigint }): string {
  const tx = deserializeTransaction(unhex(raw));
  const auth = tx.auth as any;
  const condition = auth.spendingCondition;
  const payload = tx.payload as any;
  const signer = addressToString(addressFromVersionHash(AddressVersion.TestnetSingleSig, condition.signer));
  const bad =
    tx.version !== TransactionVersion.Testnet || tx.chainId !== TESTNET_CHAIN_ID || auth.authType !== AuthType.Standard ||
    condition.hashMode !== 0 || signer !== expected.address || BigInt(condition.fee) !== expected.fee ||
    BigInt(condition.nonce) !== expected.nonce || payload.payloadType !== PayloadType.TokenTransfer ||
    addressToString(payload.recipient.address) !== EXCHANGE_ADDRESS || BigInt(payload.amount) !== BigInt(expected.stx) * 1_000_000n ||
    String(payload.memo?.content ?? '').replace(/\0+$/, '') !== BUY_MEMO;
  if (bad) throw new Error('The casino wallet signed something other than the buy that was asked for. Nothing was sent.');
  tx.verifyOrigin();
  return '0x' + tx.txid();
}
