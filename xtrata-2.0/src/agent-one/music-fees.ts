import { jobKey } from './unfinished';
/** Non-secret, durable funding policy for opt-in Music Economy jobs. */
export type MusicFeeState = {
  version: 1; mode: 'economy' | 'standard'; networkBudget: string; spent: string;
  protocolSpent: string; remainingWeight: string; approvedTotal: string;
  nextNonce?: string;
  extraReceived: string; service: string; lastConfirmedAt: number; waitSince: number;
  pending?: {
    fn: string; args: string[]; nonce: string; fee: string; weight: string;
    protocol: string; ids: string[]; fees: Record<string, string>; since: number;
  };
  upgrade?: {
    id: string; state: 'review' | 'payment' | 'confirmed' | 'failed'; additional: string;
    total: string; networkBudget: string; service: string; expires: number;
    balance: string; sender: string; minNonce?: number; minBlockHeight?: number; txid?: string; error?: string;
  };
  startedUploads?: string[]; sealedUploads?: string[];
  expiryBlocks?: number; expiryUnknown?: boolean;
};
export class MusicFeeWait extends Error {}
export class MusicFeeRecovery extends Error {}
export const musicFeeKey = (id: string) => `xao:music-fees:${id}`;
export function readMusicFees(id: string | null): MusicFeeState | null {
  if (!id) return null;
  const raw = localStorage.getItem(musicFeeKey(id));
  if (!raw) {
    const job = JSON.parse(localStorage.getItem(jobKey(id)) || 'null');
    if (job?.feePolicy === 'music-v1') throw new Error('Music funding record is missing; restore the job before continuing.');
    return null;
  }
  const value = JSON.parse(raw);
  if (value.version !== 1) throw new Error('Unsupported Music funding record');
  return value;
}
export function writeMusicFees(id: string, state: MusicFeeState) {
  // Fail closed: a wallet/broadcast must not open if its recovery record cannot save.
  localStorage.setItem(musicFeeKey(id), JSON.stringify(state));
}
export function musicWeight(bytes: number, single: boolean, txs: number) {
  return BigInt(bytes) + BigInt(txs) * 30000n;
}
export function musicTransactionCap(s: MusicFeeState, weight: bigint, serializedBytes: number) {
  const remaining = BigInt(s.networkBudget) - BigInt(s.spent);
  const allWeight = BigInt(s.remainingWeight);
  const allocated = allWeight > 0n ? remaining * weight / allWeight : 0n;
  const rateCap = BigInt(serializedBytes) * (s.mode === 'economy' ? 1n : 3n);
  return [allocated, rateCap, 2000000n].reduce((a, b) => a < b ? a : b);
}
export function confirmedMusicTransaction(s: MusicFeeState, txid: string) {
  if (!s.pending || !s.pending.ids.includes(txid)) throw new Error('Unknown pending transaction');
  if (s.pending.fn === 'begin-or-get') s.startedUploads = [...new Set([...(s.startedUploads || []), s.pending.args[0]])];
  if (s.pending.fn.startsWith('seal-')) s.sealedUploads = [...new Set([...(s.sealedUploads || []), s.pending.args[0]])];
  s.spent = (BigInt(s.spent) + BigInt(s.pending.fees[txid])).toString();
  s.protocolSpent = (BigInt(s.protocolSpent) + BigInt(s.pending.protocol)).toString();
  s.remainingWeight = (BigInt(s.remainingWeight) - BigInt(s.pending.weight)).toString();
  s.nextNonce = String(BigInt(s.pending.nonce) + 1n);
  s.lastConfirmedAt = Date.now(); s.waitSince = 0;
  delete s.pending;
  return s;
}
export function speedUpAmounts(s: MusicFeeState, standardNetwork: bigint, balance: bigint, protectedFunds: bigint, pct: bigint) {
  const networkBudget = standardNetwork > BigInt(s.networkBudget) ? standardNetwork : BigInt(s.networkBudget);
  const remainingMining = networkBudget - BigInt(s.spent);
  // protectedFunds includes the already-approved service. Extra funding carries the
  // same explicitly quoted service percentage, rounded up, so no reserve is borrowed.
  const missing = remainingMining + protectedFunds - balance;
  const additional = missing > 0n ? ((missing * 100n + (100n - pct) - 1n) / (100n - pct) + 9999n) / 10000n * 10000n : 0n;
  return { additional: additional.toString(), total: (BigInt(s.approvedTotal) + additional).toString(),
    service: (BigInt(s.service) + additional * pct / 100n).toString(), networkBudget: networkBudget.toString() };
}
export function verifyMusicTopUp(tx: any, job: any, request: NonNullable<MusicFeeState['upgrade']>) {
  if (tx.tx_status !== 'success' || tx.canonical !== true || tx.microblock_canonical === false || tx.is_unanchored === true) return false;
  if (tx.tx_type !== 'token_transfer' || tx.sender_address !== request.sender ||
      !Number.isSafeInteger(tx.block_height) || request.minBlockHeight == null || tx.block_height < request.minBlockHeight ||
      !Number.isSafeInteger(tx.nonce) || request.minNonce == null || tx.nonce < request.minNonce ||
      tx.token_transfer?.recipient_address !== job.depositAddress || tx.token_transfer?.amount !== request.additional) {
    throw new Error('This transaction does not match the approved top-up sender, address and amount');
  }
  return true;
}
