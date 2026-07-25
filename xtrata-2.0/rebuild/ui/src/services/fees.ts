import {
  CHUNK_SIZE,
  flatFeeSchedule,
  type FeeSchedule,
  type ReadOnlyTransport
} from '@xtrata/collections-client';
import { quoteInscriptionFee } from './transport';

/**
 * Fee schedule derived from the core's own `quote-inscription-fee`.
 *
 * v3.2.3 quotes a whole inscription from `(total-size, total-chunks)`, while
 * the planner needs the fee split across the transactions it actually emits
 * (begin / chunk batches / seal). Two samples one chunk apart identify the
 * affine model the core uses:
 *
 *   quote(n) = base + perChunk · n
 *
 * so `base` is what a begin costs and `perChunk` is what each uploaded chunk
 * costs. This is a cost ESTIMATE for the plan-review screen; the on-chain
 * spend caps in `CollectionTxBuilder` are what actually bound spending, and
 * they are built from the same schedule.
 */

export interface FeeScheduleResult {
  schedule: FeeSchedule;
  /** microSTX charged before any chunk is uploaded. */
  baseFeeMicroStx: bigint;
  perChunkFeeMicroStx: bigint;
  /** True when the quote read failed and the fallback constants are in use. */
  fallback: boolean;
  source: string;
}

/** Fallback used only when the core cannot be read (offline plan review). */
export const FALLBACK_BASE_FEE = 3_000n;
export const FALLBACK_PER_CHUNK_FEE = 3_000n;

export const buildFeeSchedule = (params: {
  baseFeeMicroStx: bigint;
  perChunkFeeMicroStx: bigint;
  mintPriceMicroStx?: bigint;
}): FeeSchedule =>
  flatFeeSchedule({
    beginFee: params.baseFeeMicroStx,
    perChunkFee: params.perChunkFeeMicroStx,
    sealBaseFee: 0n,
    mintPrice: params.mintPriceMicroStx ?? 0n
  });

export const loadFeeSchedule = async (params: {
  transport: ReadOnlyTransport;
  coreContractId: string;
  mintPriceMicroStx?: bigint;
}): Promise<FeeScheduleResult> => {
  try {
    const [oneChunk, twoChunks] = await Promise.all([
      quoteInscriptionFee(params.transport, params.coreContractId, {
        totalSize: CHUNK_SIZE,
        totalChunks: 1
      }),
      quoteInscriptionFee(params.transport, params.coreContractId, {
        totalSize: CHUNK_SIZE * 2,
        totalChunks: 2
      })
    ]);
    const perChunk = twoChunks > oneChunk ? twoChunks - oneChunk : 0n;
    const base = oneChunk > perChunk ? oneChunk - perChunk : 0n;
    return {
      schedule: buildFeeSchedule({
        baseFeeMicroStx: base,
        perChunkFeeMicroStx: perChunk,
        ...(params.mintPriceMicroStx !== undefined
          ? { mintPriceMicroStx: params.mintPriceMicroStx }
          : {})
      }),
      baseFeeMicroStx: base,
      perChunkFeeMicroStx: perChunk,
      fallback: false,
      source: `${params.coreContractId}.quote-inscription-fee`
    };
  } catch {
    return {
      schedule: buildFeeSchedule({
        baseFeeMicroStx: FALLBACK_BASE_FEE,
        perChunkFeeMicroStx: FALLBACK_PER_CHUNK_FEE,
        ...(params.mintPriceMicroStx !== undefined
          ? { mintPriceMicroStx: params.mintPriceMicroStx }
          : {})
      }),
      baseFeeMicroStx: FALLBACK_BASE_FEE,
      perChunkFeeMicroStx: FALLBACK_PER_CHUNK_FEE,
      fallback: true,
      source: 'fallback constants (core fee quote unavailable)'
    };
  }
};

export const microToStx = (micro: bigint): string => {
  const negative = micro < 0n;
  const abs = negative ? -micro : micro;
  const whole = abs / 1_000_000n;
  const fraction = (abs % 1_000_000n).toString().padStart(6, '0').replace(/0+$/, '');
  return `${negative ? '-' : ''}${whole}${fraction ? `.${fraction}` : ''} STX`;
};
