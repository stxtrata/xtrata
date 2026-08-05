// The launch canary's pure parts.
//
// The wiring can only really be checked in a browser against a wallet, but the
// pieces that decide what gets sent, and what gets read back out of a reply,
// are ordinary functions and worth pinning down. Getting an address wrong means
// deploying to the wrong account; getting the deploy payload wrong means a
// wallet refusing a transaction for reasons nobody can see.

import { describe, expect, it } from 'vitest';
import { DEPLOY_SHAPES, harvestAddress, txidFrom } from '../src/canary.js';
import { CONTRACT_NAME } from '../src/protocol.js';

const ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const TESTNET = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

describe('harvesting an address from a wallet reply', () => {
  // Every one of these is a shape some wallet has actually answered with.
  const shapes = [
    ['bare string', ADDRESS],
    ['leather result.addresses', { result: { addresses: [{ symbol: 'STX', address: ADDRESS }] } }],
    ['flat addresses', { addresses: [{ address: ADDRESS }] }],
    ['stxAddress', { stxAddress: ADDRESS }],
    ['nested accounts', { result: { accounts: [{ selectedAddress: ADDRESS }] } }],
    ['mainnet key', { addresses: { mainnet: ADDRESS } }],
    ['array of strings', [ADDRESS]]
  ];

  for (const [name, payload] of shapes) {
    it(`finds it in ${name}`, () => {
      expect(harvestAddress(payload)).toBe(ADDRESS);
    });
  }

  it('finds a testnet address too', () => {
    expect(harvestAddress({ addresses: [{ address: TESTNET }] })).toBe(TESTNET);
  });

  it('returns null rather than guessing', () => {
    for (const payload of [null, undefined, {}, [], 42, 'hello', { address: 'nope' }]) {
      expect(harvestAddress(payload)).toBe(null);
    }
  });

  it('does not recurse forever on a cyclic reply', () => {
    const cyclic = { result: {} };
    cyclic.result.result = cyclic;
    expect(() => harvestAddress(cyclic)).not.toThrow();
  });

  it('ignores a bitcoin address sitting alongside the stacks one', () => {
    const reply = {
      addresses: [
        { symbol: 'BTC', address: 'bc1qj5uxfxkukjvh9d3s8acuh0x9yfnppea7ufm938' },
        { symbol: 'STX', address: ADDRESS }
      ]
    };
    expect(harvestAddress(reply)).toBe(ADDRESS);
  });
});

describe('deploy payloads', () => {
  const source = ';; contract\n(define-public (noop) (ok true))';

  it('all shapes carry the name, the source and Clarity 3', () => {
    for (const [label, build] of Object.entries(DEPLOY_SHAPES)) {
      const params = build(source, 'mainnet');
      expect(params.name, label).toBe(CONTRACT_NAME);
      expect(params.clarityCode, label).toBe(source);
      // Pinned, not left to the wallet: the deployed version has to be the one
      // the tests ran against.
      expect(params.clarityVersion, label).toBe(3);
      expect(params.network, label).toBe('mainnet');
    }
  });

  it('are genuinely different from each other, so falling back means something', () => {
    const keys = Object.values(DEPLOY_SHAPES).map((build) =>
      Object.keys(build(source, 'mainnet')).sort().join(',')
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('B adds deny post conditions, since the deploy moves nothing', () => {
    const params = DEPLOY_SHAPES.B(source, 'mainnet');
    expect(params.postConditionMode).toBe('deny');
    expect(params.postConditions).toEqual([]);
  });

  it('C spells the source and name both ways for wallets that want the old keys', () => {
    const params = DEPLOY_SHAPES.C(source, 'mainnet');
    expect(params.codeBody).toBe(source);
    expect(params.contractName).toBe(CONTRACT_NAME);
  });

  it('carries the network it was given', () => {
    expect(DEPLOY_SHAPES.A(source, 'testnet').network).toBe('testnet');
  });
});

describe('reading a txid back', () => {
  it('finds it wherever a wallet puts it', () => {
    expect(txidFrom({ txid: '0xabc' })).toBe('0xabc');
    expect(txidFrom({ txId: '0xabc' })).toBe('0xabc');
    expect(txidFrom({ result: { txid: '0xabc' } })).toBe('0xabc');
    expect(txidFrom({ result: { txId: '0xabc' } })).toBe('0xabc');
  });

  it('returns null when there is none, rather than a misleading truthy value', () => {
    for (const reply of [null, undefined, {}, { result: {} }, 'ok']) {
      expect(txidFrom(reply)).toBe(null);
    }
  });
});
