import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FEE_UNIT_MICROSTX,
  estimateContractFees,
  getFeeSchedule
} from '../fees';

describe('contract fee estimates', () => {
  it('estimates fixed fees for v9.2.14', () => {
    const schedule = getFeeSchedule({ protocolVersion: '9.2.14' }, null);
    expect(schedule.model).toBe('fixed');

    const estimate = estimateContractFees({ schedule, totalChunks: 4 });
    expect(estimate.beginMicroStx).toBe(100_000);
    expect(estimate.sealMicroStx).toBe(140_000);
    expect(estimate.totalMicroStx).toBe(240_000);
  });

  it('estimates fee-unit fees for v9.2.17', () => {
    const schedule = getFeeSchedule({ protocolVersion: '9.2.17' }, 250_000);
    expect(schedule.model).toBe('fee-unit');
    if (schedule.model === 'fee-unit') {
      expect(schedule.feeUnitMicroStx).toBe(250_000);
    }

    const estimate = estimateContractFees({ schedule, totalChunks: 120 });
    expect(estimate.feeBatches).toBe(3);
    expect(estimate.beginMicroStx).toBe(250_000);
    expect(estimate.sealMicroStx).toBe(1_000_000);
    expect(estimate.totalMicroStx).toBe(1_250_000);
  });

  it('defaults the fee unit when missing', () => {
    const schedule = getFeeSchedule({ protocolVersion: '9.2.17' }, null);
    if (schedule.model === 'fee-unit') {
      expect(schedule.feeUnitMicroStx).toBe(DEFAULT_FEE_UNIT_MICROSTX);
    }
  });
});
