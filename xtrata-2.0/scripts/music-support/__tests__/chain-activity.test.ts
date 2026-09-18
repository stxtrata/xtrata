import {describe, expect, it} from 'vitest';
import {PAID_PLAYS_CONTRACT, parsePaidPlayEvent} from '../../../public/radio/chain-activity.js';

const txid = `0x${'a'.repeat(64)}`;
const repr = '(tuple (amount u50) (core u3) (event "radio-paid-play") (id u315) (payer \'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7) (receipt 0x0102) (recipient \'SP13MTGDX16JT7PVP60PSV6DQV422KZ8WXGXD34PY) (total u7) (version u1))';

const event = (overrides:Record<string, unknown> = {}) => ({
  event_type: 'smart_contract_log',
  tx_id: txid,
  contract_log: {
    contract_id: PAID_PLAYS_CONTRACT,
    topic: 'print',
    value: {repr}
  },
  ...overrides
});

describe('public paid-play contract reader', () => {
  it('extracts the verified public fields from the contract print event', () => {
    expect(parsePaidPlayEvent(event())).toEqual({
      txid,
      core: 3,
      id: 315,
      amount: 50,
      total: 7,
      payer: 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7',
      recipient: 'SP13MTGDX16JT7PVP60PSV6DQV422KZ8WXGXD34PY'
    });
  });

  it('rejects logs outside the exact deployed contract and paid-play schema', () => {
    expect(parsePaidPlayEvent(event({contract_log: {...event().contract_log, contract_id: 'SP000.bad'}}))).toBeNull();
    expect(parsePaidPlayEvent(event({contract_log: {...event().contract_log, value: {repr: repr.replace('radio-paid-play', 'other')}}}))).toBeNull();
    expect(parsePaidPlayEvent(event({contract_log: {...event().contract_log, value: {repr: repr.replace('(amount u50)', '(amount u51)')}}}))).toBeNull();
    expect(parsePaidPlayEvent(event({tx_id: 'not-a-transaction'}))).toBeNull();
  });

  it('rejects unsafe numeric values and oversized payloads', () => {
    const unsafe = repr.replace('(id u315)', '(id u999999999999999999999999999999)');
    expect(parsePaidPlayEvent(event({contract_log: {...event().contract_log, value: {repr: unsafe}}}))).toBeNull();
    expect(parsePaidPlayEvent(event({contract_log: {...event().contract_log, value: {repr: 'x'.repeat(2001)}}}))).toBeNull();
  });
});
