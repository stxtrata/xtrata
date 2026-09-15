import { describe, it, expect } from 'vitest';
import { cvToJSON } from '@stacks/transactions';
import { songArgs, receiptArgs } from '../radio-plays-management';
const payer = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
describe('paid-play canary read inputs', () => {
  it('preserves explicit core and large ID without numeric rounding', () => {
    expect(songArgs('2', '9007199254740993').map(cvToJSON)).toEqual([{type:'uint',value:'2'}, {type:'uint',value:'9007199254740993'}]);
  });
  it('rejects unsupported cores, negative, fractional and overflowing IDs', () => {
    for (const [core,id] of [['4','1'],['1','-1'],['1','1.5'],['1',(2n**128n).toString()]]) expect(() => songArgs(core,id)).toThrow();
  });
  it('accepts exactly a wallet-scoped 16-byte receipt', () => {
    expect(receiptArgs(payer, '0x'+'ab'.repeat(16))).toHaveLength(2);
    expect(() => receiptArgs(payer, 'ab'.repeat(32))).toThrow();
    expect(() => receiptArgs(payer, 'xx'.repeat(16))).toThrow();
    expect(() => receiptArgs('invalid', 'ab'.repeat(16))).toThrow();
  });
});
