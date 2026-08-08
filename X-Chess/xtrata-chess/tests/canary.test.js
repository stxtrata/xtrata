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

describe('logging what the chain returns', () => {
  // The Clarity codec returns uints as BigInt so nothing is silently rounded,
  // and JSON.stringify throws on those. On the live deploy this made a
  // successful read of game #1 report itself as "read failed", and killed Copy
  // report outright. Anything that stringifies chain data must survive it.
  const chainReply = {
    'next-seq': 0n,
    'opened-at': 8706789n,
    'opened-by': 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    'rules-hash': null
  };

  it('plain JSON.stringify is exactly what broke', () => {
    expect(() => JSON.stringify(chainReply)).toThrow(/BigInt/);
  });

  it('the replacer keeps the value rather than dropping or rounding it', () => {
    const out = JSON.parse(
      JSON.stringify(chainReply, (_k, v) => (typeof v === 'bigint' ? `${v}` : v))
    );
    expect(out['opened-at']).toBe('8706789');
    expect(out['next-seq']).toBe('0');
    expect(out['opened-by']).toBe(chainReply['opened-by']);
    expect(out['rules-hash']).toBe(null);
  });

  it('survives a uint beyond what a Number holds exactly', () => {
    const huge = { seq: 2n ** 100n };
    const out = JSON.parse(
      JSON.stringify(huge, (_k, v) => (typeof v === 'bigint' ? `${v}` : v))
    );
    expect(out.seq).toBe('1267650600228229401496703205376');
    // Why BigInt is used at all: going through Number loses digits, and the
    // string keeps every one of them.
    expect(String(Number(out.seq))).not.toBe(out.seq);
  });
});

describe('post conditions for a contract that charges', () => {
  const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

  it('denies every transfer when nothing should move', async () => {
    const { feePostConditions } = await import('../src/wallet.js');
    const guard = feePostConditions({ sender: ALICE, fee: 0 });
    expect(guard.postConditionMode).toBe('deny');
    expect(guard.postConditions).toEqual([]);
  });

  // A hex string, not an object. Xverse hangs on the object form without ever
  // settling, which looks like a wallet that never opened. This is the shape the
  // repo's wallet canary settled on.
  it('sends a serialised hex condition, not an object', async () => {
    const { feePostConditions } = await import('../src/wallet.js');
    const [pc] = feePostConditions({ sender: ALICE, fee: 10_000 }).postConditions;

    expect(typeof pc).toBe('string');
    expect(pc).toMatch(/^[0-9a-f]{64}$/);
  });

  it('lays the bytes out the way the wire expects', async () => {
    const { stxPostConditionHex } = await import('../src/wallet.js');
    const pc = stxPostConditionHex(ALICE, 10_000);

    expect(pc.slice(0, 2)).toBe('00'); // an STX condition
    expect(pc.slice(2, 4)).toBe('02'); // about a standard principal
    expect(pc.slice(4, 6)).toBe('16'); // mainnet version byte
    expect(pc.slice(46, 48)).toBe('05'); // sent at most
    expect(parseInt(pc.slice(48), 16)).toBe(10_000);
    expect(pc.length / 2).toBe(32);
  });

  // Both bound the loss identically, but an exact condition fails a perfectly
  // good transaction if the owner lowers the fee between reading and signing.
  it('caps rather than pins, and can pin when asked', async () => {
    const { feePostConditions } = await import('../src/wallet.js');
    const capped = feePostConditions({ sender: ALICE, fee: 10_000 }).postConditions[0];
    const exact = feePostConditions({ sender: ALICE, fee: 10_000, shape: 'exact' })
      .postConditions[0];

    expect(capped.slice(46, 48)).toBe('05');
    expect(exact.slice(46, 48)).toBe('01');
  });

  it('has a last resort that is honestly weaker', async () => {
    const { feePostConditions } = await import('../src/wallet.js');
    const guard = feePostConditions({ sender: ALICE, fee: 10_000, shape: 'allow' });
    expect(guard.postConditionMode).toBe('allow');
    expect(guard.postConditions).toEqual([]);
  });

  it('refuses to write a condition about an address that is not one', async () => {
    const { stxPostConditionHex } = await import('../src/wallet.js');
    expect(() => stxPostConditionHex('not-an-address', 10_000)).toThrow();
  });
});

describe('which contract the canary deploys', () => {
  it('offers all three, newest first, and only v3 prices the two calls apart', async () => {
    const { CONTRACTS } = await import('../src/canary.js');
    expect(Object.keys(CONTRACTS)).toEqual([
      'xtrata-chess-log-v3',
      'xtrata-chess-log-v2',
      'xtrata-chess-log-v1'
    ]);
    expect(CONTRACTS['xtrata-chess-log-v3'].splitFees).toBe(true);
    expect(CONTRACTS['xtrata-chess-log-v2'].charges).toBe(true);
    expect(CONTRACTS['xtrata-chess-log-v2'].splitFees).toBe(false);
    expect(CONTRACTS['xtrata-chess-log-v1'].charges).toBe(false);
  });

  it('names the contract it is deploying in every shape', async () => {
    const { DEPLOY_SHAPES } = await import('../src/canary.js');
    for (const build of Object.values(DEPLOY_SHAPES)) {
      expect(build(';; src', 'mainnet', 'xtrata-chess-log-v3').name).toBe('xtrata-chess-log-v3');
      expect(build(';; src', 'mainnet', 'xtrata-chess-log-v2').name).toBe('xtrata-chess-log-v2');
      expect(build(';; src', 'mainnet', 'xtrata-chess-log-v1').name).toBe('xtrata-chess-log-v1');
    }
  });
});
