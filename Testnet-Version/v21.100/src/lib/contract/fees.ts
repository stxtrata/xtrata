import { MAX_BATCH_SIZE } from '../chunking/hash';
import { resolveContractCapabilities } from './capabilities';

export const MICROSTX_PER_STX = 1_000_000;

export const FIXED_FEE_SCHEDULE = {
  beginMicroStx: 100_000,
  sealBaseMicroStx: 100_000,
  sealPerChunkMicroStx: 10_000
};

export const DEFAULT_FEE_UNIT_MICROSTX = 100_000;

export type FeeSchedule =
  | {
      model: 'fixed';
      beginMicroStx: number;
      sealBaseMicroStx: number;
      sealPerChunkMicroStx: number;
    }
  | {
      model: 'fee-unit';
      feeUnitMicroStx: number;
    };

export type FeeEstimate = {
  beginMicroStx: number;
  sealMicroStx: number;
  totalMicroStx: number;
  feeBatches: number;
};

const normalizeMicroStx = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return DEFAULT_FEE_UNIT_MICROSTX;
  }
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_FEE_UNIT_MICROSTX;
  }
  return Math.round(value);
};

export const getFeeSchedule = (contract: {
  protocolVersion?: string;
  contractName?: string;
}, feeUnitMicroStx?: number | null): FeeSchedule => {
  const capabilities = resolveContractCapabilities(contract);
  if (capabilities.feeModel === 'fixed') {
    return {
      model: 'fixed',
      beginMicroStx: FIXED_FEE_SCHEDULE.beginMicroStx,
      sealBaseMicroStx: FIXED_FEE_SCHEDULE.sealBaseMicroStx,
      sealPerChunkMicroStx: FIXED_FEE_SCHEDULE.sealPerChunkMicroStx
    };
  }

  return {
    model: 'fee-unit',
    feeUnitMicroStx: normalizeMicroStx(feeUnitMicroStx)
  };
};

const normalizeTotalChunks = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return Math.floor(value);
};

export const estimateContractFees = (params: {
  schedule: FeeSchedule;
  totalChunks: number;
}): FeeEstimate => {
  const totalChunks = normalizeTotalChunks(params.totalChunks);

  if (params.schedule.model === 'fixed') {
    const sealMicroStx =
      totalChunks > 0
        ? params.schedule.sealBaseMicroStx +
          params.schedule.sealPerChunkMicroStx * totalChunks
        : 0;
    const beginMicroStx = params.schedule.beginMicroStx;
    return {
      beginMicroStx,
      sealMicroStx,
      totalMicroStx: beginMicroStx + sealMicroStx,
      feeBatches: 0
    };
  }

  const feeUnitMicroStx = params.schedule.feeUnitMicroStx;
  const feeBatches =
    totalChunks > 0 ? Math.ceil(totalChunks / MAX_BATCH_SIZE) : 0;
  const sealMicroStx =
    totalChunks > 0 ? feeUnitMicroStx * (1 + feeBatches) : 0;
  const beginMicroStx = feeUnitMicroStx;
  return {
    beginMicroStx,
    sealMicroStx,
    totalMicroStx: beginMicroStx + sealMicroStx,
    feeBatches
  };
};

export const formatMicroStx = (value: number) =>
  `${(value / MICROSTX_PER_STX).toFixed(6)} STX`;
