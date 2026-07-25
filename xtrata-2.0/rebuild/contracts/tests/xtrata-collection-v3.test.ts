import { createHash } from 'node:crypto';
import { Cl, ClarityType, cvToValue } from '@stacks/transactions';
import { describe, expect, it, beforeEach } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const w1 = accounts.get('wallet_1')!;
const w2 = accounts.get('wallet_2')!;
const w3 = accounts.get('wallet_3')!;
const w4 = accounts.get('wallet_4')!;
const w5 = accounts.get('wallet_5')!;

const core = `${deployer}.mock-xtrata-core`;
const coll = `${deployer}.xtrata-collection-v3`;
const corePrincipal = Cl.contractPrincipal(deployer, 'mock-xtrata-core');
const wrongCorePrincipal = Cl.contractPrincipal(deployer, 'mock-xtrata-core-b');
const collPrincipal = Cl.contractPrincipal(deployer, 'xtrata-collection-v3');
const mime = 'text/plain';
const CORE_BEGIN_FEE = 1000n;

const ERR = {
  NOT_AUTHORIZED: 100, PAUSED: 101, FINALIZED: 102, NOT_FOUND: 103,
  MAX_SUPPLY: 104, DUPLICATE_HASH: 105, ALREADY_RESERVED: 106,
  INVALID_BATCH: 107, INVALID_PHASE: 108, PHASE_NOT_ACTIVE: 109,
  PHASE_CAP: 110, WALLET_LIMIT: 111, NOT_ALLOWLISTED: 112,
  INVALID_ALLOWLIST_MODE: 113, INVALID_BPS: 114, INVALID_CORE_CONTRACT: 115,
  PENDING_OWNER: 116, NO_PENDING_OWNER: 117, RESERVATION_NOT_EXPIRED: 118,
  NOT_FINALIZABLE: 119, ALREADY_SET: 120, INVALID_SUPPLY_MODE: 121,
  ALREADY_ASSIGNED: 122, ASSIGNMENT_MISMATCH: 123,
  DEFAULT_DEPENDENCIES_BATCH: 124, NOT_MINTED: 125,
};
const CORE_ERR = { INVALID_BATCH: 902, HASH_MISMATCH: 903, PAUSED: 904 };
const MODE = { FIXED: 1, OPEN: 2, CAPPED: 3 };
const DEFAULT_URI = 'data:text/plain,xtrata-collection-default';

// --- helpers ---

function makeChunks(seed: number, n: number): Uint8Array[] {
  return Array.from({ length: n }, (_, i) =>
    Uint8Array.from([seed & 0xff, (seed >> 8) & 0xff, i & 0xff, 7])
  );
}

// Real core hash chain: H0 = 32 zero bytes, H(i+1) = sha256(H(i) || chunk_i)
function finalHash(chunks: Uint8Array[]): Uint8Array {
  let running = Buffer.alloc(32, 0);
  for (const chunk of chunks) {
    running = createHash('sha256').update(Buffer.concat([running, Buffer.from(chunk)])).digest();
  }
  return Uint8Array.from(running);
}

function totalSize(chunks: Uint8Array[]): number {
  return chunks.reduce((s, c) => s + c.length, 0);
}

function call(contract: string, fn: string, args: any[], sender: string) {
  return simnet.callPublicFn(contract, fn, args, sender).result;
}

function read(contract: string, fn: string, args: any[] = []) {
  return simnet.callReadOnlyFn(contract, fn, args, deployer).result;
}

function unwrapOk(result: any) {
  expect(result.type, `expected ok, got ${JSON.stringify(cvToValue(result))}`).toBe(ClarityType.ResponseOk);
  return result.value;
}

function stx(address: string): bigint {
  return simnet.getAssetsMap().get('STX')!.get(address)!;
}

interface SetupOpts {
  mode?: number;
  max?: number;
  price?: number;
}

function setup(opts: SetupOpts = {}) {
  const { mode = MODE.FIXED, max = mode === MODE.FIXED ? 50 : 0, price = 0 } = opts;
  unwrapOk(call(coll, 'set-supply-mode', [Cl.uint(mode), Cl.uint(max)], deployer));
  unwrapOk(call(coll, 'set-mint-price', [Cl.uint(price)], deployer));
  unwrapOk(call(coll, 'set-paused', [Cl.bool(false)], deployer));
}

function reserve(sender: string, hash: Uint8Array, itemUri?: string) {
  return call(
    coll,
    'reserve',
    [Cl.buffer(hash), itemUri === undefined ? Cl.none() : Cl.some(Cl.stringAscii(itemUri))],
    sender
  );
}

function mintBegin(sender: string, hash: Uint8Array, chunks: Uint8Array[]) {
  return call(
    coll,
    'mint-begin',
    [corePrincipal, Cl.buffer(hash), Cl.stringAscii(mime), Cl.uint(totalSize(chunks)), Cl.uint(chunks.length)],
    sender
  );
}

function addChunks(sender: string, hash: Uint8Array, chunks: Uint8Array[]) {
  return call(
    coll,
    'mint-add-chunk-batch',
    [corePrincipal, Cl.buffer(hash), Cl.list(chunks.map((c) => Cl.buffer(c)))],
    sender
  );
}

function mintSeal(sender: string, hash: Uint8Array, uri = 'ipfs://fallback') {
  return call(coll, 'mint-seal', [corePrincipal, Cl.buffer(hash), Cl.stringAscii(uri)], sender);
}

function smallMint(sender: string, chunks: Uint8Array[], uri = 'ipfs://fallback') {
  const hash = finalHash(chunks);
  return {
    hash,
    result: call(
      coll,
      'mint-small-single-tx',
      [
        corePrincipal,
        Cl.buffer(hash),
        Cl.stringAscii(mime),
        Cl.uint(totalSize(chunks)),
        Cl.list(chunks.map((c) => Cl.buffer(c))),
        Cl.stringAscii(uri),
      ],
      sender
    ),
  };
}

// Full staged mint of one item, returns { hash, tokenId }
function fullMint(sender: string, seed: number, nChunks = 1) {
  const chunks = makeChunks(seed, nChunks);
  const hash = finalHash(chunks);
  unwrapOk(mintBegin(sender, hash, chunks));
  unwrapOk(addChunks(sender, hash, chunks));
  const sealed = unwrapOk(mintSeal(sender, hash));
  expect(sealed.type).toBe(ClarityType.UInt);
  return { hash, tokenId: sealed.value as bigint };
}

function info(): any {
  return cvToValue(read(coll, 'get-collection-info')).value;
}

beforeEach(() => {
  // simnet is reset between tests by vitest-environment-clarinet
});

// --- supply + reservations ---

describe('supply modes and reservation accounting', () => {
  it('fixed supply is one-shot; second set-supply-mode fails', () => {
    unwrapOk(call(coll, 'set-supply-mode', [Cl.uint(MODE.FIXED), Cl.uint(3)], deployer));
    expect(call(coll, 'set-supply-mode', [Cl.uint(MODE.OPEN), Cl.uint(0)], deployer))
      .toBeErr(Cl.uint(ERR.ALREADY_SET));
  });

  it('rejects invalid supply configs', () => {
    expect(call(coll, 'set-supply-mode', [Cl.uint(MODE.FIXED), Cl.uint(0)], deployer))
      .toBeErr(Cl.uint(ERR.INVALID_SUPPLY_MODE));
    expect(call(coll, 'set-supply-mode', [Cl.uint(MODE.OPEN), Cl.uint(9)], deployer))
      .toBeErr(Cl.uint(ERR.INVALID_SUPPLY_MODE));
    expect(call(coll, 'set-supply-mode', [Cl.uint(9), Cl.uint(0)], deployer))
      .toBeErr(Cl.uint(ERR.INVALID_SUPPLY_MODE));
  });

  it('reservations count against supply immediately; concurrent wallets cannot oversubscribe', () => {
    setup({ max: 3 });
    expect(reserve(w1, finalHash(makeChunks(1, 1)))).toBeOk(Cl.uint(0));
    expect(reserve(w2, finalHash(makeChunks(2, 1)))).toBeOk(Cl.uint(1));
    expect(reserve(w3, finalHash(makeChunks(3, 1)))).toBeOk(Cl.uint(2));
    // exact exhaustion: fourth reservation from any wallet fails
    expect(reserve(w4, finalHash(makeChunks(4, 1)))).toBeErr(Cl.uint(ERR.MAX_SUPPLY));
    expect(reserve(w1, finalHash(makeChunks(5, 1)))).toBeErr(Cl.uint(ERR.MAX_SUPPLY));
    expect(BigInt(info()['reserved-count'].value)).toBe(3n);
    expect(BigInt(info()['minted-count'].value)).toBe(0n);
  });

  it('collection of size 1: reserve, exhaust, mint, finalize', () => {
    setup({ max: 1 });
    const chunks = makeChunks(11, 1);
    const hash = finalHash(chunks);
    expect(reserve(w1, hash)).toBeOk(Cl.uint(0));
    expect(reserve(w2, finalHash(makeChunks(12, 1)))).toBeErr(Cl.uint(ERR.MAX_SUPPLY));
    // resume own session through mint-begin (reserve-or-resume)
    unwrapOk(mintBegin(w1, hash, chunks));
    unwrapOk(addChunks(w1, hash, chunks));
    unwrapOk(mintSeal(w1, hash));
    expect(BigInt(info()['minted-count'].value)).toBe(1n);
    expect(BigInt(info()['reserved-count'].value)).toBe(0n);
    unwrapOk(call(coll, 'finalize', [], deployer));
    const item = cvToValue(read(coll, 'get-item', [Cl.uint(0)]));
    expect(item.value['owner-at-mint'].value).toBe(w1);
  });

  it('open mode has no cap; capped-closable close-supply is one-way', () => {
    setup({ mode: MODE.CAPPED, max: 0 });
    unwrapOk(reserve(w1, finalHash(makeChunks(21, 1))));
    unwrapOk(reserve(w2, finalHash(makeChunks(22, 1))));
    expect(call(coll, 'close-supply', [], deployer)).toBeOk(Cl.uint(2));
    expect(BigInt(info()['supply-mode'].value)).toBe(1n);
    expect(BigInt(info()['max-supply'].value)).toBe(2n);
    expect(reserve(w3, finalHash(makeChunks(23, 1)))).toBeErr(Cl.uint(ERR.MAX_SUPPLY));
    expect(call(coll, 'close-supply', [], deployer)).toBeErr(Cl.uint(ERR.INVALID_SUPPLY_MODE));
    expect(call(coll, 'set-supply-mode', [Cl.uint(MODE.OPEN), Cl.uint(0)], deployer))
      .toBeErr(Cl.uint(ERR.ALREADY_SET));
  });

  it('close-supply requires capped-closable mode', () => {
    setup({ mode: MODE.OPEN, max: 0 });
    expect(call(coll, 'close-supply', [], deployer)).toBeErr(Cl.uint(ERR.INVALID_SUPPLY_MODE));
  });
});

// --- free-list / dense index ---

describe('free-list and dense index ordering', () => {
  it('recycles cancelled indexes LIFO before extending next-index', () => {
    setup({ max: 10 });
    const h1 = finalHash(makeChunks(31, 1));
    const h2 = finalHash(makeChunks(32, 1));
    const h3 = finalHash(makeChunks(33, 1));
    expect(reserve(w1, h1)).toBeOk(Cl.uint(0));
    expect(reserve(w1, h2)).toBeOk(Cl.uint(1));
    expect(reserve(w1, h3)).toBeOk(Cl.uint(2));
    // cancel the middle reservation
    expect(call(coll, 'cancel-reservation', [Cl.buffer(h2)], w1)).toBeOk(Cl.uint(1));
    expect(read(coll, 'get-free-count')).toBeOk(Cl.uint(1));
    // recycled index 1 is reused
    expect(reserve(w2, finalHash(makeChunks(34, 1)))).toBeOk(Cl.uint(1));
    expect(read(coll, 'get-free-count')).toBeOk(Cl.uint(0));
    // then a fresh index
    expect(reserve(w2, finalHash(makeChunks(35, 1)))).toBeOk(Cl.uint(3));
  });

  it('cancel releases hash for re-reservation and finalize requires density', () => {
    setup({ max: 2 });
    const c1 = makeChunks(41, 1);
    const c2 = makeChunks(42, 1);
    const h1 = finalHash(c1);
    const h2 = finalHash(c2);
    unwrapOk(reserve(w1, h1)); // index 0
    unwrapOk(reserve(w1, h2)); // index 1
    unwrapOk(call(coll, 'cancel-reservation', [Cl.buffer(h1)], w1)); // free 0
    unwrapOk(mintBegin(w1, h2, c2));
    unwrapOk(addChunks(w1, h2, c2));
    unwrapOk(mintSeal(w1, h2));
    // reserved==0 but free-count==1 and minted != max -> not finalizable
    expect(call(coll, 'finalize', [], deployer)).toBeErr(Cl.uint(ERR.NOT_FINALIZABLE));
    // re-reserving the same hash works (HashIndex entry was cleared on cancel)
    expect(reserve(w2, h1)).toBeOk(Cl.uint(0));
    unwrapOk(mintBegin(w2, h1, c1));
    unwrapOk(addChunks(w2, h1, c1));
    unwrapOk(mintSeal(w2, h1));
    unwrapOk(call(coll, 'finalize', [], deployer));
    expect(info().finalized.value).toBe(true);
  });
});

// --- staged mint flow through the mock core ---

describe('staged mint lifecycle (begin / chunks / seal)', () => {
  it('runs the full flow with a real multi-batch hash chain', () => {
    setup({ max: 5 });
    const chunks = makeChunks(51, 3);
    const hash = finalHash(chunks);
    unwrapOk(mintBegin(w1, hash, chunks));
    unwrapOk(addChunks(w1, hash, chunks.slice(0, 2)));
    unwrapOk(addChunks(w1, hash, chunks.slice(2)));
    const tokenId = unwrapOk(mintSeal(w1, hash)).value as bigint;
    const item = cvToValue(read(coll, 'get-item', [Cl.uint(0)])).value;
    expect(BigInt(item['token-id'].value)).toBe(tokenId);
    expect(item['content-hash'].value).toBe('0x' + Buffer.from(hash).toString('hex'));
    // core advisory dedupe index agrees
    const coreId = cvToValue(read(core, 'get-id-by-hash', [Cl.buffer(hash)]));
    expect(BigInt(coreId.value)).toBe(tokenId);
  });

  it('rejects sealing before the upload completes and rejects overflow batches', () => {
    setup({ max: 5 });
    const chunks = makeChunks(52, 3);
    const hash = finalHash(chunks);
    unwrapOk(mintBegin(w1, hash, chunks));
    unwrapOk(addChunks(w1, hash, chunks.slice(0, 2)));
    expect(mintSeal(w1, hash)).toBeErr(Cl.uint(CORE_ERR.INVALID_BATCH));
    // more chunks than declared
    expect(addChunks(w1, hash, chunks.slice(0, 2))).toBeErr(Cl.uint(CORE_ERR.INVALID_BATCH));
    // finish correctly
    unwrapOk(addChunks(w1, hash, chunks.slice(2)));
    unwrapOk(mintSeal(w1, hash));
  });

  it('rejects a wrong hash chain at seal (hash mismatch surfaces from core)', () => {
    setup({ max: 5 });
    const chunks = makeChunks(53, 2);
    const wrongHash = finalHash(makeChunks(54, 2));
    unwrapOk(mintBegin(w1, wrongHash, chunks));
    unwrapOk(addChunks(w1, wrongHash, chunks));
    expect(mintSeal(w1, wrongHash)).toBeErr(Cl.uint(CORE_ERR.HASH_MISMATCH));
  });

  it('chunk upload requires an existing session', () => {
    setup({ max: 5 });
    const chunks = makeChunks(55, 1);
    expect(addChunks(w1, finalHash(chunks), chunks)).toBeErr(Cl.uint(ERR.NOT_FOUND));
  });

  it('rejects any core principal other than the pinned one', () => {
    setup({ max: 5 });
    const chunks = makeChunks(56, 1);
    const hash = finalHash(chunks);
    expect(
      call(
        coll,
        'mint-begin',
        [wrongCorePrincipal, Cl.buffer(hash), Cl.stringAscii(mime), Cl.uint(totalSize(chunks)), Cl.uint(1)],
        w1
      )
    ).toBeErr(Cl.uint(ERR.INVALID_CORE_CONTRACT));
  });
});

// --- small single-tx path ---

describe('small single-tx mint', () => {
  it('mints at the 32-chunk boundary', () => {
    setup({ max: 5 });
    const { result } = smallMint(w1, makeChunks(61, 32));
    unwrapOk(result);
    expect(BigInt(info()['minted-count'].value)).toBe(1n);
  });

  it('rejects 33 chunks (exceeds the list 32 type)', () => {
    setup({ max: 5 });
    const chunks = makeChunks(62, 33);
    const hash = finalHash(chunks);
    let failed = false;
    try {
      const res = call(
        coll,
        'mint-small-single-tx',
        [
          corePrincipal,
          Cl.buffer(hash),
          Cl.stringAscii(mime),
          Cl.uint(totalSize(chunks)),
          Cl.list(chunks.map((c) => Cl.buffer(c))),
          Cl.stringAscii('ipfs://x'),
        ],
        w1
      );
      failed = res.type === ClarityType.ResponseErr;
    } catch {
      failed = true;
    }
    expect(failed).toBe(true);
    expect(BigInt(info()['minted-count'].value)).toBe(0n);
  });

  it('recursive variant records dependencies in the core', () => {
    setup({ max: 5 });
    const first = smallMint(w1, makeChunks(63, 1));
    const firstId = unwrapOk(first.result).value as bigint;
    const chunks = makeChunks(64, 1);
    const hash = finalHash(chunks);
    const res = call(
      coll,
      'mint-small-single-tx-recursive',
      [
        corePrincipal,
        Cl.buffer(hash),
        Cl.stringAscii(mime),
        Cl.uint(totalSize(chunks)),
        Cl.list(chunks.map((c) => Cl.buffer(c))),
        Cl.stringAscii('ipfs://rec'),
        Cl.list([Cl.uint(firstId)]),
      ],
      w1
    );
    const tokenId = unwrapOk(res).value as bigint;
    const deps = cvToValue(read(core, 'get-dependencies', [Cl.uint(tokenId)]));
    expect(deps.map((d: any) => BigInt(d.value))).toEqual([firstId]);
  });

  it('default-dependencies apply to seal paths; explicit recursive is then rejected', () => {
    setup({ max: 5 });
    const first = smallMint(w1, makeChunks(65, 1));
    const firstId = unwrapOk(first.result).value as bigint;
    unwrapOk(call(coll, 'set-default-dependencies', [Cl.list([Cl.uint(firstId)])], deployer));
    const second = smallMint(w1, makeChunks(66, 1));
    const secondId = unwrapOk(second.result).value as bigint;
    const deps = cvToValue(read(core, 'get-dependencies', [Cl.uint(secondId)]));
    expect(deps.map((d: any) => BigInt(d.value))).toEqual([firstId]);
    const chunks = makeChunks(67, 1);
    expect(
      call(
        coll,
        'mint-small-single-tx-recursive',
        [
          corePrincipal,
          Cl.buffer(finalHash(chunks)),
          Cl.stringAscii(mime),
          Cl.uint(totalSize(chunks)),
          Cl.list(chunks.map((c) => Cl.buffer(c))),
          Cl.stringAscii('ipfs://x'),
          Cl.list([Cl.uint(0)]),
        ],
        w1
      )
    ).toBeErr(Cl.uint(ERR.DEFAULT_DEPENDENCIES_BATCH));
  });
});

// --- batch seal ---

describe('mint-seal-batch', () => {
  function stageSessions(sender: string, seeds: number[]) {
    return seeds.map((seed) => {
      const chunks = makeChunks(seed, 1);
      const hash = finalHash(chunks);
      unwrapOk(mintBegin(sender, hash, chunks));
      unwrapOk(addChunks(sender, hash, chunks));
      return hash;
    });
  }

  function batchItems(hashes: Uint8Array[]) {
    return Cl.list(
      hashes.map((h) =>
        Cl.tuple({ hash: Cl.buffer(h), 'token-uri': Cl.stringAscii('ipfs://batch') })
      )
    );
  }

  it('seals a batch atomically and records dense items with core token ids', () => {
    setup({ max: 10 });
    const hashes = stageSessions(w1, [71, 72, 73]);
    const res = unwrapOk(call(coll, 'mint-seal-batch', [corePrincipal, batchItems(hashes)], w1));
    const val = cvToValue(res);
    expect(BigInt(val.count.value)).toBe(3n);
    const start = BigInt(val.start.value);
    for (let i = 0; i < 3; i++) {
      const item = cvToValue(read(coll, 'get-item', [Cl.uint(i)])).value;
      expect(BigInt(item['token-id'].value)).toBe(start + BigInt(i));
      expect(item['content-hash'].value).toBe('0x' + Buffer.from(hashes[i]).toString('hex'));
    }
    expect(BigInt(info()['minted-count'].value)).toBe(3n);
    expect(BigInt(info()['reserved-count'].value)).toBe(0n);
  });

  it('fails atomically when one item has no session', () => {
    setup({ max: 10 });
    const hashes = stageSessions(w1, [74, 75]);
    const bogus = finalHash(makeChunks(76, 1));
    expect(
      call(coll, 'mint-seal-batch', [corePrincipal, batchItems([...hashes, bogus])], w1)
    ).toBeErr(Cl.uint(ERR.NOT_FOUND));
    // nothing minted, sessions intact
    expect(BigInt(info()['minted-count'].value)).toBe(0n);
    expect(BigInt(info()['reserved-count'].value)).toBe(2n);
    expect(read(coll, 'get-session', [Cl.principal(w1), Cl.buffer(hashes[0])]).type)
      .toBe(ClarityType.OptionalSome);
  });

  it('rejects duplicate hashes and empty batches', () => {
    setup({ max: 10 });
    const hashes = stageSessions(w1, [77]);
    expect(
      call(coll, 'mint-seal-batch', [corePrincipal, batchItems([hashes[0], hashes[0]])], w1)
    ).toBeErr(Cl.uint(ERR.INVALID_BATCH));
    expect(call(coll, 'mint-seal-batch', [corePrincipal, Cl.list([])], w1))
      .toBeErr(Cl.uint(ERR.INVALID_BATCH));
  });

  it('rejects mixed-phase batches', () => {
    setup({ max: 10 });
    const phase0 = stageSessions(w1, [78]);
    unwrapOk(call(coll, 'set-phase',
      [Cl.uint(1), Cl.bool(true), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(1)],
      deployer));
    unwrapOk(call(coll, 'set-active-phase', [Cl.uint(1)], deployer));
    const phase1 = stageSessions(w1, [79]);
    expect(
      call(coll, 'mint-seal-batch', [corePrincipal, batchItems([...phase0, ...phase1])], w1)
    ).toBeErr(Cl.uint(ERR.INVALID_BATCH));
  });

  it('seals a full 50-item batch (boundary)', () => {
    setup({ max: 60 });
    const seeds = Array.from({ length: 50 }, (_, i) => 1000 + i);
    const hashes = stageSessions(w1, seeds);
    const res = unwrapOk(call(coll, 'mint-seal-batch', [corePrincipal, batchItems(hashes)], w1));
    expect(BigInt(cvToValue(res).count.value)).toBe(50n);
    expect(BigInt(info()['minted-count'].value)).toBe(50n);
  });
});

// --- duplicate hash ---

describe('collection-level duplicate detection', () => {
  it('rejects reserving a hash already reserved by another wallet', () => {
    setup({ max: 5 });
    const hash = finalHash(makeChunks(81, 1));
    unwrapOk(reserve(w1, hash));
    expect(reserve(w2, hash)).toBeErr(Cl.uint(ERR.DUPLICATE_HASH));
    expect(reserve(w1, hash)).toBeErr(Cl.uint(ERR.ALREADY_RESERVED));
  });

  it('rejects reserving a hash after it was minted (core dedupe is advisory only)', () => {
    setup({ max: 5 });
    const chunks = makeChunks(82, 1);
    const hash = finalHash(chunks);
    unwrapOk(mintBegin(w1, hash, chunks));
    unwrapOk(addChunks(w1, hash, chunks));
    unwrapOk(mintSeal(w1, hash));
    expect(reserve(w2, hash)).toBeErr(Cl.uint(ERR.DUPLICATE_HASH));
  });
});

// --- payments ---

describe('payments and splits', () => {
  it('charges only the core begin fee at begin, price + splits at seal, remainder to operator', () => {
    setup({ max: 5, price: 1_000_000 });
    unwrapOk(call(coll, 'set-recipients', [Cl.principal(w2), Cl.principal(w3), Cl.principal(w4)], deployer));
    unwrapOk(call(coll, 'set-splits', [Cl.uint(5000), Cl.uint(2500), Cl.uint(2400)], deployer));
    const chunks = makeChunks(91, 1);
    const hash = finalHash(chunks);

    const before = stx(w1);
    unwrapOk(mintBegin(w1, hash, chunks));
    // invariant 2: only the core begin fee moved
    expect(before - stx(w1)).toBe(CORE_BEGIN_FEE);
    unwrapOk(addChunks(w1, hash, chunks));
    expect(before - stx(w1)).toBe(CORE_BEGIN_FEE);

    const b2 = stx(w2), b3 = stx(w3), b4 = stx(w4), b1 = stx(w1);
    unwrapOk(mintSeal(w1, hash));
    expect(stx(w2) - b2).toBe(500_000n); // artist 5000 bps
    expect(stx(w3) - b3).toBe(250_000n); // marketplace 2500 bps
    expect(stx(w4) - b4).toBe(250_000n); // operator 2400 bps + 10000 remainder
    expect(b1 - stx(w1)).toBe(1_000_000n); // mock seal fee is 0
  });

  it('rejects splits above 10000 bps', () => {
    expect(call(coll, 'set-splits', [Cl.uint(6000), Cl.uint(4000), Cl.uint(1)], deployer))
      .toBeErr(Cl.uint(ERR.INVALID_BPS));
  });

  it('charges phase price captured at reservation time', () => {
    setup({ max: 5 });
    unwrapOk(call(coll, 'set-recipients', [Cl.principal(w2), Cl.principal(w2), Cl.principal(w2)], deployer));
    unwrapOk(call(coll, 'set-splits', [Cl.uint(10000), Cl.uint(0), Cl.uint(0)], deployer));
    unwrapOk(call(coll, 'set-phase',
      [Cl.uint(1), Cl.bool(true), Cl.uint(0), Cl.uint(0), Cl.uint(7000), Cl.uint(0), Cl.uint(0), Cl.uint(1)],
      deployer));
    unwrapOk(call(coll, 'set-active-phase', [Cl.uint(1)], deployer));
    const chunks = makeChunks(92, 1);
    const hash = finalHash(chunks);
    unwrapOk(reserve(w1, hash));
    const session = cvToValue(read(coll, 'get-session', [Cl.principal(w1), Cl.buffer(hash)]));
    expect(BigInt(session.value.price.value)).toBe(7000n);
    unwrapOk(mintBegin(w1, hash, chunks));
    unwrapOk(addChunks(w1, hash, chunks));
    const b2 = stx(w2);
    unwrapOk(mintSeal(w1, hash));
    expect(stx(w2) - b2).toBe(7000n);
  });
});

// --- phases ---

describe('phases', () => {
  const setPhase = (id: number, opts: Partial<{ enabled: boolean; start: number; end: number; price: number; perWallet: number; supply: number; mode: number }> = {}) =>
    call(coll, 'set-phase', [
      Cl.uint(id),
      Cl.bool(opts.enabled ?? true),
      Cl.uint(opts.start ?? 0),
      Cl.uint(opts.end ?? 0),
      Cl.uint(opts.price ?? 0),
      Cl.uint(opts.perWallet ?? 0),
      Cl.uint(opts.supply ?? 0),
      Cl.uint(opts.mode ?? 1),
    ], deployer);

  it('enforces phase scheduling windows', () => {
    setup({ max: 10 });
    const h = simnet.blockHeight;
    unwrapOk(setPhase(1, { start: h + 10, end: h + 20 }));
    unwrapOk(call(coll, 'set-active-phase', [Cl.uint(1)], deployer));
    expect(reserve(w1, finalHash(makeChunks(101, 1)))).toBeErr(Cl.uint(ERR.PHASE_NOT_ACTIVE));
    simnet.mineEmptyBlocks(12);
    unwrapOk(reserve(w1, finalHash(makeChunks(102, 1))));
    simnet.mineEmptyBlocks(20);
    expect(reserve(w1, finalHash(makeChunks(103, 1)))).toBeErr(Cl.uint(ERR.PHASE_NOT_ACTIVE));
  });

  it('enforces per-phase wallet limits and phase supply caps', () => {
    setup({ max: 10 });
    unwrapOk(setPhase(1, { perWallet: 1, supply: 2 }));
    unwrapOk(call(coll, 'set-active-phase', [Cl.uint(1)], deployer));
    unwrapOk(reserve(w1, finalHash(makeChunks(104, 1))));
    expect(reserve(w1, finalHash(makeChunks(105, 1)))).toBeErr(Cl.uint(ERR.WALLET_LIMIT));
    unwrapOk(reserve(w2, finalHash(makeChunks(106, 1))));
    expect(reserve(w3, finalHash(makeChunks(107, 1)))).toBeErr(Cl.uint(ERR.PHASE_CAP));
  });

  it('disabled phase blocks reservations', () => {
    setup({ max: 10 });
    unwrapOk(setPhase(1, { enabled: false }));
    unwrapOk(call(coll, 'set-active-phase', [Cl.uint(1)], deployer));
    expect(reserve(w1, finalHash(makeChunks(108, 1)))).toBeErr(Cl.uint(ERR.PHASE_NOT_ACTIVE));
  });

  it('phase allowlist mode gates by per-phase allowance', () => {
    setup({ max: 10 });
    unwrapOk(setPhase(1, { mode: 3 }));
    unwrapOk(call(coll, 'set-active-phase', [Cl.uint(1)], deployer));
    unwrapOk(call(coll, 'set-phase-allowlist', [Cl.uint(1), Cl.principal(w1), Cl.uint(1)], deployer));
    unwrapOk(reserve(w1, finalHash(makeChunks(109, 1))));
    expect(reserve(w1, finalHash(makeChunks(110, 1)))).toBeErr(Cl.uint(ERR.WALLET_LIMIT));
    expect(reserve(w2, finalHash(makeChunks(111, 1)))).toBeErr(Cl.uint(ERR.NOT_ALLOWLISTED));
  });

  it('global allowlist via batch setter applies in inherit mode', () => {
    setup({ max: 10 });
    unwrapOk(call(coll, 'set-allowlist-enabled', [Cl.bool(true)], deployer));
    unwrapOk(call(coll, 'set-allowlist-batch', [
      Cl.list([
        Cl.tuple({ owner: Cl.principal(w1), allowance: Cl.uint(2) }),
        Cl.tuple({ owner: Cl.principal(w2), allowance: Cl.uint(1) }),
      ]),
    ], deployer));
    unwrapOk(reserve(w1, finalHash(makeChunks(112, 1))));
    unwrapOk(reserve(w1, finalHash(makeChunks(113, 1))));
    expect(reserve(w1, finalHash(makeChunks(114, 1)))).toBeErr(Cl.uint(ERR.WALLET_LIMIT));
    unwrapOk(reserve(w2, finalHash(makeChunks(115, 1))));
    expect(reserve(w3, finalHash(makeChunks(116, 1)))).toBeErr(Cl.uint(ERR.NOT_ALLOWLISTED));
  });

  it('validates phase config', () => {
    expect(call(coll, 'set-phase',
      [Cl.uint(0), Cl.bool(true), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(1)],
      deployer)).toBeErr(Cl.uint(ERR.INVALID_PHASE));
    expect(call(coll, 'set-phase',
      [Cl.uint(1), Cl.bool(true), Cl.uint(10), Cl.uint(5), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(1)],
      deployer)).toBeErr(Cl.uint(ERR.INVALID_PHASE));
    expect(call(coll, 'set-phase',
      [Cl.uint(1), Cl.bool(true), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(9)],
      deployer)).toBeErr(Cl.uint(ERR.INVALID_ALLOWLIST_MODE));
    expect(call(coll, 'set-active-phase', [Cl.uint(9)], deployer)).toBeErr(Cl.uint(ERR.INVALID_PHASE));
  });
});

// --- expiry + permissionless release ---

describe('reservation expiry', () => {
  it('anyone can release only after expiry; index and hash are recycled', () => {
    setup({ max: 5 });
    unwrapOk(call(coll, 'set-reservation-expiry-blocks', [Cl.uint(10)], deployer));
    const hash = finalHash(makeChunks(121, 1));
    unwrapOk(reserve(w1, hash));
    expect(call(coll, 'release-expired-reservation', [Cl.principal(w1), Cl.buffer(hash)], w3))
      .toBeErr(Cl.uint(ERR.RESERVATION_NOT_EXPIRED));
    simnet.mineEmptyBlocks(10);
    expect(call(coll, 'release-expired-reservation', [Cl.principal(w1), Cl.buffer(hash)], w3))
      .toBeOk(Cl.uint(0));
    expect(BigInt(info()['reserved-count'].value)).toBe(0n);
    expect(read(coll, 'get-free-count')).toBeOk(Cl.uint(1));
    // hash free again
    expect(reserve(w2, hash)).toBeOk(Cl.uint(0));
  });

  it('admin release works without expiry; non-admin cannot use it', () => {
    setup({ max: 5 });
    const hash = finalHash(makeChunks(122, 1));
    unwrapOk(reserve(w1, hash));
    expect(call(coll, 'release-reservation', [Cl.principal(w1), Cl.buffer(hash)], w2))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'release-reservation', [Cl.principal(w1), Cl.buffer(hash)], deployer))
      .toBeOk(Cl.uint(0));
  });
});

// --- pause ---

describe('pause semantics', () => {
  it('deploys paused; pause blocks mint entrypoints but never cancel/release/unassign', () => {
    // deploy default is paused
    expect(reserve(w1, finalHash(makeChunks(131, 1)))).toBeErr(Cl.uint(ERR.PAUSED));
    setup({ max: 5 });
    const chunks = makeChunks(132, 1);
    const hash = finalHash(chunks);
    unwrapOk(reserve(w1, hash));
    // mint + assign one item so unassign can be tested under pause
    const minted = fullMint(w2, 133);
    void minted;
    unwrapOk(call(coll, 'set-drops-authority', [Cl.some(Cl.principal(w5))], deployer));
    unwrapOk(call(coll, 'assign-to-drop', [Cl.uint(1), Cl.uint(1)], w5));

    unwrapOk(call(coll, 'set-paused', [Cl.bool(true)], deployer));
    expect(mintBegin(w1, hash, chunks)).toBeErr(Cl.uint(ERR.PAUSED));
    expect(addChunks(w1, hash, chunks)).toBeErr(Cl.uint(ERR.PAUSED));
    expect(mintSeal(w1, hash)).toBeErr(Cl.uint(ERR.PAUSED));
    expect(smallMint(w2, makeChunks(134, 1)).result).toBeErr(Cl.uint(ERR.PAUSED));
    expect(reserve(w2, finalHash(makeChunks(135, 1)))).toBeErr(Cl.uint(ERR.PAUSED));
    // recovery paths stay open
    expect(call(coll, 'cancel-reservation', [Cl.buffer(hash)], w1)).toBeOk(Cl.uint(0));
    expect(call(coll, 'unassign-from-drop', [Cl.uint(1), Cl.uint(1)], w5)).toBeOk(Cl.bool(true));
  });

  it('paused core blocks proxied inscription unless the collection is an allowed caller', () => {
    setup({ max: 5 });
    unwrapOk(call(core, 'set-paused', [Cl.bool(true)], deployer));
    const chunks = makeChunks(136, 1);
    const hash = finalHash(chunks);
    expect(mintBegin(w1, hash, chunks)).toBeErr(Cl.uint(CORE_ERR.PAUSED));
    unwrapOk(call(core, 'set-allowed-caller', [collPrincipal, Cl.bool(true)], deployer));
    unwrapOk(mintBegin(w1, hash, chunks));
  });
});

// --- roles ---

describe('role separation', () => {
  it('operator-admin can pause/configure phases but cannot touch money settings', () => {
    unwrapOk(call(coll, 'set-operator-admin', [Cl.principal(w2)], deployer));
    unwrapOk(call(coll, 'set-paused', [Cl.bool(false)], w2));
    unwrapOk(call(coll, 'set-phase',
      [Cl.uint(1), Cl.bool(true), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(1)], w2));
    unwrapOk(call(coll, 'set-allowlist', [Cl.principal(w1), Cl.uint(1)], w2));
    unwrapOk(call(coll, 'set-reservation-expiry-blocks', [Cl.uint(100)], w2));
    expect(call(coll, 'set-splits', [Cl.uint(1), Cl.uint(1), Cl.uint(1)], w2))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'set-recipients', [Cl.principal(w2), Cl.principal(w2), Cl.principal(w2)], w2))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'set-mint-price', [Cl.uint(1)], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
  });

  it('finance-admin can set money settings but cannot pause or configure phases', () => {
    unwrapOk(call(coll, 'set-finance-admin', [Cl.principal(w3)], deployer));
    unwrapOk(call(coll, 'set-mint-price', [Cl.uint(123)], w3));
    unwrapOk(call(coll, 'set-splits', [Cl.uint(100), Cl.uint(100), Cl.uint(100)], w3));
    unwrapOk(call(coll, 'set-recipients', [Cl.principal(w1), Cl.principal(w2), Cl.principal(w3)], w3));
    expect(call(coll, 'set-paused', [Cl.bool(false)], w3)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'set-phase',
      [Cl.uint(1), Cl.bool(true), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(1)], w3))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
  });

  it('unauthorized wallets are rejected everywhere; owner-only functions stay owner-only', () => {
    expect(call(coll, 'set-paused', [Cl.bool(false)], w4)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'set-supply-mode', [Cl.uint(MODE.FIXED), Cl.uint(1)], w4))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'set-operator-admin', [Cl.principal(w4)], w4)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'set-drops-authority', [Cl.some(Cl.principal(w4))], w4))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'finalize', [], w4)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    // operator-admin cannot use owner-only setters
    unwrapOk(call(coll, 'set-operator-admin', [Cl.principal(w2)], deployer));
    expect(call(coll, 'set-supply-mode', [Cl.uint(MODE.FIXED), Cl.uint(1)], w2))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'close-supply', [], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
  });
});

// --- ownership ---

describe('two-step ownership transfer', () => {
  it('requires the pending owner to accept', () => {
    expect(call(coll, 'accept-contract-ownership', [], w1)).toBeErr(Cl.uint(ERR.NO_PENDING_OWNER));
    unwrapOk(call(coll, 'initiate-contract-ownership-transfer', [Cl.principal(w1)], deployer));
    expect(call(coll, 'accept-contract-ownership', [], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(call(coll, 'accept-contract-ownership', [], w1));
    expect(info().owner.value).toBe(w1);
    // old owner loses owner-only powers
    expect(call(coll, 'set-supply-mode', [Cl.uint(MODE.FIXED), Cl.uint(1)], deployer))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(call(coll, 'set-supply-mode', [Cl.uint(MODE.FIXED), Cl.uint(1)], w1));
  });

  it('can be cancelled and rejects self-transfer', () => {
    expect(call(coll, 'initiate-contract-ownership-transfer', [Cl.principal(deployer)], deployer))
      .toBeErr(Cl.uint(ERR.PENDING_OWNER));
    unwrapOk(call(coll, 'initiate-contract-ownership-transfer', [Cl.principal(w1)], deployer));
    unwrapOk(call(coll, 'cancel-contract-ownership-transfer', [], deployer));
    expect(call(coll, 'accept-contract-ownership', [], w1)).toBeErr(Cl.uint(ERR.NO_PENDING_OWNER));
  });
});

// --- drops assignment ---

describe('drop assignment ledger', () => {
  function setupWithItems(n: number) {
    setup({ max: 10 });
    for (let i = 0; i < n; i++) fullMint(w1, 140 + i);
    unwrapOk(call(coll, 'set-drops-authority', [Cl.some(Cl.principal(w5))], deployer));
  }

  it('only the drops authority can assign; minted + unassigned required', () => {
    setupWithItems(2);
    expect(call(coll, 'assign-to-drop', [Cl.uint(0), Cl.uint(1)], w2))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(call(coll, 'assign-to-drop', [Cl.uint(0), Cl.uint(1)], w5));
    // double assignment rejected
    expect(call(coll, 'assign-to-drop', [Cl.uint(0), Cl.uint(2)], w5))
      .toBeErr(Cl.uint(ERR.ALREADY_ASSIGNED));
    // unminted index rejected
    expect(call(coll, 'assign-to-drop', [Cl.uint(5), Cl.uint(1)], w5))
      .toBeErr(Cl.uint(ERR.NOT_MINTED));
    const assignment = cvToValue(read(coll, 'get-assignment', [Cl.uint(0)]));
    expect(BigInt(assignment.value['drop-id'].value)).toBe(1n);
    expect(assignment.value['drop-contract'].value).toBe(w5);
  });

  it('unassign requires matching authority and drop id', () => {
    setupWithItems(1);
    unwrapOk(call(coll, 'assign-to-drop', [Cl.uint(0), Cl.uint(7)], w5));
    expect(call(coll, 'unassign-from-drop', [Cl.uint(0), Cl.uint(7)], w2))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(coll, 'unassign-from-drop', [Cl.uint(0), Cl.uint(8)], w5))
      .toBeErr(Cl.uint(ERR.ASSIGNMENT_MISMATCH));
    expect(call(coll, 'unassign-from-drop', [Cl.uint(1), Cl.uint(7)], w5))
      .toBeErr(Cl.uint(ERR.NOT_FOUND));
    unwrapOk(call(coll, 'unassign-from-drop', [Cl.uint(0), Cl.uint(7)], w5));
    expect(read(coll, 'get-assignment', [Cl.uint(0)]).type).toBe(ClarityType.OptionalNone);
  });

  it('assign-range assigns [start, end) and fails atomically on any bad index', () => {
    setupWithItems(3);
    unwrapOk(call(coll, 'assign-to-drop', [Cl.uint(1), Cl.uint(1)], w5));
    // range hits an already-assigned index: whole call fails, index 0 untouched
    expect(call(coll, 'assign-range-to-drop', [Cl.uint(0), Cl.uint(3), Cl.uint(2)], w5))
      .toBeErr(Cl.uint(ERR.ALREADY_ASSIGNED));
    expect(read(coll, 'get-assignment', [Cl.uint(0)]).type).toBe(ClarityType.OptionalNone);
    // range past minted items fails
    expect(call(coll, 'assign-range-to-drop', [Cl.uint(2), Cl.uint(5), Cl.uint(2)], w5))
      .toBeErr(Cl.uint(ERR.NOT_MINTED));
    // valid remaining range
    unwrapOk(call(coll, 'unassign-from-drop', [Cl.uint(1), Cl.uint(1)], w5));
    expect(call(coll, 'assign-range-to-drop', [Cl.uint(0), Cl.uint(3), Cl.uint(2)], w5))
      .toBeOk(Cl.uint(3));
    // shape checks
    expect(call(coll, 'assign-range-to-drop', [Cl.uint(3), Cl.uint(3), Cl.uint(2)], w5))
      .toBeErr(Cl.uint(ERR.INVALID_BATCH));
    expect(call(coll, 'assign-range-to-drop', [Cl.uint(0), Cl.uint(51), Cl.uint(2)], w5))
      .toBeErr(Cl.uint(ERR.INVALID_BATCH));
  });

  it('get-unassigned-scan reports minted/assigned flags up to next-index', () => {
    setupWithItems(3);
    unwrapOk(call(coll, 'assign-to-drop', [Cl.uint(1), Cl.uint(1)], w5));
    const scan = cvToValue(unwrapOk(read(coll, 'get-unassigned-scan', [Cl.uint(0)])));
    expect(scan.length).toBe(3);
    expect(scan[0].value.assigned.value).toBe(false);
    expect(scan[1].value.assigned.value).toBe(true);
    expect(scan[1].value.minted.value).toBe(true);
    expect(scan[2].value.assigned.value).toBe(false);
  });

  it('assignment survives finalize (drops operate post-finalize)', () => {
    setup({ max: 1 });
    fullMint(w1, 150);
    unwrapOk(call(coll, 'set-drops-authority', [Cl.some(Cl.principal(w5))], deployer));
    unwrapOk(call(coll, 'finalize', [], deployer));
    unwrapOk(call(coll, 'assign-to-drop', [Cl.uint(0), Cl.uint(1)], w5));
    unwrapOk(call(coll, 'unassign-from-drop', [Cl.uint(0), Cl.uint(1)], w5));
    // but authority can no longer be changed
    expect(call(coll, 'set-drops-authority', [Cl.none()], deployer)).toBeErr(Cl.uint(ERR.FINALIZED));
  });
});

// --- uri resolution ---

describe('token uri resolution: session item-uri -> registered -> default -> fallback', () => {
  it('resolves in priority order', () => {
    setup({ max: 5 });
    // 1. session item-uri wins
    const c1 = makeChunks(161, 1);
    const h1 = finalHash(c1);
    unwrapOk(call(coll, 'reserve', [Cl.buffer(h1), Cl.some(Cl.stringAscii('ipfs://item-uri'))], w1));
    unwrapOk(mintBegin(w1, h1, c1));
    unwrapOk(addChunks(w1, h1, c1));
    const id1 = unwrapOk(mintSeal(w1, h1, 'ipfs://fallback')).value as bigint;
    expect(cvToValue(read(core, 'get-token-uri', [Cl.uint(id1)])).value.value).toBe('ipfs://item-uri');

    // 2. registered uri
    const c2 = makeChunks(162, 1);
    const h2 = finalHash(c2);
    unwrapOk(call(coll, 'set-registered-token-uri', [Cl.buffer(h2), Cl.stringAscii('ipfs://registered')], deployer));
    unwrapOk(mintBegin(w1, h2, c2));
    unwrapOk(addChunks(w1, h2, c2));
    const id2 = unwrapOk(mintSeal(w1, h2, 'ipfs://fallback')).value as bigint;
    expect(cvToValue(read(core, 'get-token-uri', [Cl.uint(id2)])).value.value).toBe('ipfs://registered');

    // 3. default token uri
    const c3 = makeChunks(163, 1);
    const h3 = finalHash(c3);
    unwrapOk(mintBegin(w1, h3, c3));
    unwrapOk(addChunks(w1, h3, c3));
    const id3 = unwrapOk(mintSeal(w1, h3, 'ipfs://fallback')).value as bigint;
    expect(cvToValue(read(core, 'get-token-uri', [Cl.uint(id3)])).value.value).toBe(DEFAULT_URI);

    // 4. explicit fallback once default is cleared
    unwrapOk(call(coll, 'set-default-token-uri', [Cl.stringAscii('')], deployer));
    const c4 = makeChunks(164, 1);
    const h4 = finalHash(c4);
    unwrapOk(mintBegin(w1, h4, c4));
    unwrapOk(addChunks(w1, h4, c4));
    const id4 = unwrapOk(mintSeal(w1, h4, 'ipfs://fallback')).value as bigint;
    expect(cvToValue(read(core, 'get-token-uri', [Cl.uint(id4)])).value.value).toBe('ipfs://fallback');
  });
});

// --- finalize ---

describe('finalize', () => {
  it('requires zero reservations and full mint for fixed supply', () => {
    setup({ max: 2 });
    const hash = finalHash(makeChunks(171, 1));
    unwrapOk(reserve(w1, hash));
    expect(call(coll, 'finalize', [], deployer)).toBeErr(Cl.uint(ERR.NOT_FINALIZABLE));
    unwrapOk(call(coll, 'cancel-reservation', [Cl.buffer(hash)], w1));
    // free-count now 1 -> still not finalizable (dense-index invariant)
    expect(call(coll, 'finalize', [], deployer)).toBeErr(Cl.uint(ERR.NOT_FINALIZABLE));
    fullMint(w1, 172);
    fullMint(w2, 173);
    unwrapOk(call(coll, 'finalize', [], deployer));
    expect(call(coll, 'finalize', [], deployer)).toBeErr(Cl.uint(ERR.FINALIZED));
  });

  it('freezes all setters and mint entrypoints', () => {
    setup({ max: 1 });
    fullMint(w1, 174);
    unwrapOk(call(coll, 'finalize', [], deployer));
    const frozen: Array<[string, any[]]> = [
      ['set-collection-metadata', [Cl.stringAscii('x'), Cl.stringAscii('X'), Cl.stringAscii(''), Cl.stringAscii(''), Cl.stringAscii('')]],
      ['set-paused', [Cl.bool(true)]],
      ['set-mint-price', [Cl.uint(1)]],
      ['set-splits', [Cl.uint(1), Cl.uint(1), Cl.uint(1)]],
      ['set-recipients', [Cl.principal(w1), Cl.principal(w1), Cl.principal(w1)]],
      ['set-max-per-wallet', [Cl.uint(1)]],
      ['set-allowlist', [Cl.principal(w1), Cl.uint(1)]],
      ['set-default-token-uri', [Cl.stringAscii('x')]],
      ['set-default-dependencies', [Cl.list([])]],
      ['set-reservation-expiry-blocks', [Cl.uint(1)]],
      ['set-operator-admin', [Cl.principal(w1)]],
      ['set-finance-admin', [Cl.principal(w1)]],
      ['set-active-phase', [Cl.uint(0)]],
      ['set-allowlist-enabled', [Cl.bool(true)]],
      ['close-supply', []],
    ];
    for (const [fn, args] of frozen) {
      expect(call(coll, fn, args, deployer), fn).toBeErr(Cl.uint(ERR.FINALIZED));
    }
    expect(reserve(w1, finalHash(makeChunks(175, 1)))).toBeErr(Cl.uint(ERR.FINALIZED));
    expect(smallMint(w1, makeChunks(176, 1)).result).toBeErr(Cl.uint(ERR.FINALIZED));
  });

  it('open-mode collection can finalize once dense with no reservations', () => {
    setup({ mode: MODE.OPEN, max: 0 });
    fullMint(w1, 177);
    fullMint(w2, 178);
    unwrapOk(call(coll, 'finalize', [], deployer));
    expect(BigInt(info()['minted-count'].value)).toBe(2n);
  });
});

// --- metadata + read-onlys ---

describe('metadata and readers', () => {
  it('metadata settable until finalized and reflected in get-collection-info', () => {
    unwrapOk(call(coll, 'set-collection-metadata', [
      Cl.stringAscii('My Collection'),
      Cl.stringAscii('MYC'),
      Cl.stringAscii('A test collection'),
      Cl.stringAscii('ipfs://artwork'),
      Cl.stringAscii('ipfs://base/'),
    ], deployer));
    const i = info();
    expect(i.name.value).toBe('My Collection');
    expect(i.symbol.value).toBe('MYC');
    expect(i['artwork-uri'].value).toBe('ipfs://artwork');
    expect(i['base-uri'].value).toBe('ipfs://base/');
    expect(i['core-contract'].value).toBe(core);
    expect(i.paused.value).toBe(true);
  });

  it('get-items returns optionals per index', () => {
    setup({ max: 5 });
    fullMint(w1, 181);
    fullMint(w1, 182);
    const items = cvToValue(unwrapOk(read(coll, 'get-items', [Cl.list([Cl.uint(0), Cl.uint(1), Cl.uint(9)])])));
    expect(items[0].value).not.toBeNull();
    expect(items[1].value).not.toBeNull();
    expect(items[2]?.value ?? null).toBeNull();
  });

  it('tracks wallet and phase stats through the lifecycle', () => {
    setup({ max: 5 });
    const chunks = makeChunks(183, 1);
    const hash = finalHash(chunks);
    unwrapOk(reserve(w1, hash));
    let stats = cvToValue(unwrapOk(read(coll, 'get-wallet-stats', [Cl.principal(w1)])));
    expect(BigInt(stats.reserved.value)).toBe(1n);
    expect(BigInt(stats.minted.value)).toBe(0n);
    unwrapOk(mintBegin(w1, hash, chunks));
    unwrapOk(addChunks(w1, hash, chunks));
    unwrapOk(mintSeal(w1, hash));
    stats = cvToValue(unwrapOk(read(coll, 'get-wallet-stats', [Cl.principal(w1)])));
    expect(BigInt(stats.reserved.value)).toBe(0n);
    expect(BigInt(stats.minted.value)).toBe(1n);
  });
});
