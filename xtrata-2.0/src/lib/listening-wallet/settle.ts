/**
 * Paid plays, version 2: the shapes and sums for settling several plays in one transaction
 * (contracts/drafts/xtrata-radio-plays-v2.0.clar, docs/music/PLAYS-V2-DRAFT.md).
 *
 * DRAFT. Nothing imports this yet: the wallet box and the radio page still pay one play at a time through version 1
 * (tx.ts). It is here so the next step (the box signing a settlement, the page keeping a list of owed plays) builds on
 * something already tested against the contract's own format.
 *
 * A settlement is ONE contract call, `settle-packed`, whose single argument is
 *   rate (2 bytes, big-endian) + receipt (16 bytes) + for each play: core (1 byte) + song id (4 bytes, big-endian).
 * Ten plays are 68 bytes, which keeps the whole transaction under 300 bytes: the network refuses a transaction whose
 * fee is under one microSTX a byte, so this is what lets ten plays go out for the 0.0003 STX fee one play pays today.
 */
import { AnchorMode, Cl, FungibleConditionCode, makeStandardSTXPostCondition, PostConditionMode } from '@stacks/transactions';
import { StacksMainnet, type StacksNetwork } from '@stacks/network';
import { DEFAULT_PLAY_FEE, RESERVE } from './policy';

/** Where version 2 lives on mainnet. Not deployed: nothing may sign a settlement until this names a contract. */
export const SETTLE_CONTRACT: string | null = null;
/** The contract's own fixed limits (RATE-MIN, RATE-MAX, BATCH-MAX): the owner's settings can never leave them. */
export const RATE_MIN = 50n;
export const RATE_MAX = 1_000n;
export const BATCH_MAX = 10;
/** The network's floor: a transaction must pay at least one microSTX for each of its bytes. */
export const FEE_PER_BYTE = 1n;

export interface OwedPlay { core: number; song: number }
export interface Settlement {
  plays: OwedPlay[];
  /** 16-byte receipt as 32 lowercase hex characters; one per settlement, never reused. */
  receipt: string;
  /** microSTX per play the listener agreed to. The contract pays nothing if its rate is different. */
  rate: bigint;
}
export interface SettleRequest extends Settlement { fee: bigint; nonce: bigint }
/** The contract's two settings as the page reads them from `get-config`. */
export interface PlaySettings { rate: bigint; batch: number }

export function validateSettlement<T extends Settlement>(s: T, settings?: PlaySettings): T {
  if (!s || !Array.isArray(s.plays) || s.plays.length < 1 || s.plays.length > BATCH_MAX) throw new Error(`A settlement holds 1 to ${BATCH_MAX} plays.`);
  for (const p of s.plays) {
    if (![1, 2, 3].includes(p?.core)) throw new Error('Unsupported core contract.');
    if (!Number.isSafeInteger(p.song) || p.song < 0 || p.song > 0xffffffff) throw new Error('Invalid song id.');
  }
  if (typeof s.receipt !== 'string' || !/^[0-9a-f]{32}$/.test(s.receipt)) throw new Error('Invalid settlement receipt.');
  if (typeof s.rate !== 'bigint' || s.rate < RATE_MIN || s.rate > RATE_MAX) throw new Error(`The rate must be ${RATE_MIN} to ${RATE_MAX} microSTX a play.`);
  if (settings) {
    if (s.rate !== settings.rate) throw new Error('The rate has changed. Check the new rate before paying.');
    if (s.plays.length > settings.batch) throw new Error(`At most ${settings.batch} plays can be settled at once right now.`);
  }
  return s;
}

const bytes = (hex: string) => Uint8Array.from(hex.match(/../g)!, (b) => parseInt(b, 16));
const hex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');

/** The contract call's one argument. */
export function packSettlement(s: Settlement): Uint8Array {
  validateSettlement(s);
  const out = new Uint8Array(18 + 5 * s.plays.length);
  const view = new DataView(out.buffer);
  view.setUint16(0, Number(s.rate));
  out.set(bytes(s.receipt), 2);
  s.plays.forEach((p, i) => { out[18 + 5 * i] = p.core; view.setUint32(19 + 5 * i, p.song); });
  return out;
}

/** The reverse, for checking what a transaction would settle before it is signed. Throws on anything the contract would refuse as malformed. */
export function unpackSettlement(data: Uint8Array): Settlement {
  if (data.length < 23 || (data.length - 18) % 5 !== 0 || data.length > 18 + 5 * BATCH_MAX) throw new Error('Malformed settlement.');
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const plays: OwedPlay[] = [];
  for (let at = 18; at < data.length; at += 5) plays.push({ core: data[at], song: view.getUint32(at + 1) });
  return validateSettlement({ plays, receipt: hex(data.subarray(2, 18)), rate: BigInt(view.getUint16(0)) });
}

/** The most a settlement can move: every play paid. A play the contract skips (the song changed hands into a contract, say) moves less. */
export const settlementMax = (s: Settlement) => BigInt(s.plays.length) * s.rate;

/**
 * The one transaction shape for a settlement. Deny mode with a ceiling, not an exact amount: the contract skips a play
 * it cannot pay, so the listener may be charged less than every play, never more.
 */
export function settleCallOptions(contract: string, address: string, publicKey: string, r: SettleRequest, network: StacksNetwork = new StacksMainnet()) {
  validateSettlement(r);
  if (typeof r.nonce !== 'bigint' || r.nonce < 0n) throw new Error('Invalid nonce.');
  if (typeof r.fee !== 'bigint' || r.fee < 0n) throw new Error('Invalid fee.');
  const [contractAddress, contractName] = contract.split('.');
  if (!contractAddress || !contractName) throw new Error('No settlement contract.');
  return {
    contractAddress, contractName, functionName: 'settle-packed',
    functionArgs: [Cl.buffer(packSettlement(r))],
    publicKey, fee: r.fee, nonce: r.nonce, network, anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [makeStandardSTXPostCondition(address, FungibleConditionCode.LessEqual, settlementMax(r))]
  };
}

// ---- sums: what plays cost once they are settled together ----

/** Everything one settlement of `plays` plays costs the listener: the holders' payments and one network fee. */
export const settlementCost = (plays: number, settings: PlaySettings, fee = DEFAULT_PLAY_FEE) => BigInt(plays) * settings.rate + fee;

/**
 * Whole plays a balance covers after keeping the return reserve, when plays are settled `batch` at a time (the last
 * settlement may be smaller, and still pays a whole network fee).
 */
export function playsCoveredAt(balance: bigint, settings: PlaySettings, fee = DEFAULT_PLAY_FEE): number {
  if (balance <= RESERVE || settings.batch < 1) return 0;
  const spend = balance - RESERVE, full = settlementCost(settings.batch, settings, fee);
  const whole = spend / full, rest = spend - whole * full;
  const extra = rest > fee ? (rest - fee) / settings.rate : 0n;
  return Number(whole) * settings.batch + Number(extra);
}

/** What a player must hold to play `plays` songs at these settings (the reverse of playsCoveredAt), reserve included. */
export function amountForPlaysAt(plays: number, settings: PlaySettings, fee = DEFAULT_PLAY_FEE): bigint {
  const settlements = Math.ceil(plays / settings.batch);
  return RESERVE + BigInt(plays) * settings.rate + BigInt(settlements) * fee;
}

/** Of what a listener spends on full settlements, the share that reaches the holders (0 to 1). */
export const holderShare = (settings: PlaySettings, fee = DEFAULT_PLAY_FEE) =>
  Number(BigInt(settings.batch) * settings.rate * 10_000n / settlementCost(settings.batch, settings, fee)) / 10_000;

/** The smallest fee the network will relay for a transaction of this many bytes. */
export const feeFloor = (txBytes: number) => BigInt(txBytes) * FEE_PER_BYTE;
