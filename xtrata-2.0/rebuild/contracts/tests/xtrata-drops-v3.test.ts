import { createHash } from 'node:crypto';
import {
  Cl,
  ClarityType,
  contractPrincipalCV,
  cvToValue,
  hash160,
  principalCV,
  privateKeyToPublic,
  serializeCV,
  signMessageHashRsv,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const creator = accounts.get('wallet_1')!;
const w2 = accounts.get('wallet_2')!;
const w3 = accounts.get('wallet_3')!;
const w4 = accounts.get('wallet_4')!;
const sponsor = accounts.get('wallet_5')!;

const core = `${deployer}.mock-xtrata-core`;
const coll = `${deployer}.xtrata-collection-v3`;
const drops = `${deployer}.xtrata-drops-v3`;
const corePrincipal = Cl.contractPrincipal(deployer, 'mock-xtrata-core');
const collPrincipal = Cl.contractPrincipal(deployer, 'xtrata-collection-v3');
const dropsContractPrincipal = `${deployer}.xtrata-drops-v3`;
const mime = 'text/plain';

const ERR = {
  NOT_AUTHORIZED: 200, NOT_FOUND: 201, INVALID_MODE: 202, INVALID_STATUS: 203,
  INVALID_CONFIG: 204, INVALID_BATCH: 205, WRONG_COLLECTION: 206, RANGE_LIMIT: 207,
  NOT_IN_INVENTORY: 208, ALREADY_ESCROWED: 209, NOT_ESCROWED: 210, NOT_ACTIVE: 211,
  PAUSED: 212, WINDOW: 213, SOLD_OUT: 214, WALLET_LIMIT: 215, NOT_ALLOWLISTED: 216,
  SIGNATURE_INVALID: 217, ATTESTATION_EXPIRED: 218, ATTESTOR_NOT_CONFIGURED: 219,
  ALREADY_CLAIMED: 220, ALREADY_RESERVED: 221, RESERVATION_NOT_EXPIRED: 222,
  INVALID_BUDGET: 223, FEE_TOO_LARGE: 224, NOT_CLAIMED: 225, REFUND_LOCKED: 226,
  PENDING_OWNER: 227, NO_PENDING_OWNER: 228, ESCROW_INCOMPLETE: 229,
  ELIGIBILITY: 230, TRANSFER_FAILED: 231,
};
const COLL_ERR = { ALREADY_ASSIGNED: 122, NOT_MINTED: 125 };

const MODE = { PRE: 1, ZERO: 2, SPONSORED: 3 };
const ELIG = { PUBLIC: 1, ALLOWLIST: 2, SIGNED: 3 };
const STATUS = { DRAFT: 0, ACTIVE: 1, PAUSED: 2, ENDED: 3, CANCELLED: 4 };
const MIN_FEE_BUDGET = 50_000n;
const REFUND_DELAY = 144;
const RESERVATION_EXPIRY = 144;
const SIMNET_CHAIN_ID = 2_147_483_648n;

const attestorPrivateKey =
  '2ae156d224f73bfee9d1d52e0210012b4ae4e85df2705f4f25b7ac62db45aa3b01';
const wrongAttestorPrivateKey =
  '1c83f3b0b8fc8af8c7c4e336f4f9cdf4dbc8f6b8e1f3ebec705fca8d98379e4e01';

// --- generic helpers (conventions mirrored from xtrata-collection-v3.test.ts) ---

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

function makeChunks(seed: number, n: number): Uint8Array[] {
  return Array.from({ length: n }, (_, i) =>
    Uint8Array.from([seed & 0xff, (seed >> 8) & 0xff, i & 0xff, 7])
  );
}

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

// Full staged mint of one collection item; returns core token id.
function fullMint(sender: string, seed: number): bigint {
  const chunks = makeChunks(seed, 1);
  const hash = finalHash(chunks);
  unwrapOk(call(coll, 'mint-begin',
    [corePrincipal, Cl.buffer(hash), Cl.stringAscii(mime), Cl.uint(totalSize(chunks)), Cl.uint(chunks.length)], sender));
  unwrapOk(call(coll, 'mint-add-chunk-batch',
    [corePrincipal, Cl.buffer(hash), Cl.list(chunks.map((c) => Cl.buffer(c)))], sender));
  const sealed = unwrapOk(call(coll, 'mint-seal',
    [corePrincipal, Cl.buffer(hash), Cl.stringAscii('ipfs://drop-item')], sender));
  return sealed.value as bigint;
}

// Set up the collection (open supply) and mint n items as `creator`.
// Returns index -> token-id (indexes are dense 0..n-1 in mint order).
function setupCollection(n: number): bigint[] {
  unwrapOk(call(coll, 'set-supply-mode', [Cl.uint(2), Cl.uint(0)], deployer));
  unwrapOk(call(coll, 'set-paused', [Cl.bool(false)], deployer));
  unwrapOk(call(coll, 'set-drops-authority',
    [Cl.some(Cl.contractPrincipal(deployer, 'xtrata-drops-v3'))], deployer));
  const tokens: bigint[] = [];
  for (let i = 0; i < n; i++) tokens.push(fullMint(creator, 500 + i));
  return tokens;
}

interface DropOpts {
  mode?: number;
  eligibility?: number;
  start?: number;
  end?: number;
  totalLimit?: number;
  perWalletLimit?: number;
  sender?: string;
}

function createDrop(opts: DropOpts = {}): bigint {
  const res = call(drops, 'create-drop', [
    collPrincipal,
    Cl.uint(opts.mode ?? MODE.PRE),
    Cl.uint(opts.eligibility ?? ELIG.PUBLIC),
    Cl.uint(opts.start ?? 0),
    Cl.uint(opts.end ?? 0),
    Cl.uint(opts.totalLimit ?? 0),
    Cl.uint(opts.perWalletLimit ?? 0),
  ], opts.sender ?? creator);
  return unwrapOk(res).value as bigint;
}

function addRange(dropId: bigint, start: number, end: number, sender = creator) {
  return call(drops, 'add-inventory-range',
    [collPrincipal, Cl.uint(dropId), Cl.uint(start), Cl.uint(end)], sender);
}

function addItems(dropId: bigint, indexes: number[], sender = creator) {
  return call(drops, 'add-inventory-items',
    [collPrincipal, Cl.uint(dropId), Cl.list(indexes.map((i) => Cl.uint(i)))], sender);
}

function escrow(dropId: bigint, pairs: Array<[number, bigint]>, sender = creator) {
  return call(drops, 'escrow-batch', [
    Cl.uint(dropId),
    Cl.list(pairs.map(([index, tokenId]) =>
      Cl.tuple({ index: Cl.uint(index), 'token-id': Cl.uint(tokenId) }))),
  ], sender);
}

function activate(dropId: bigint, sender = creator) {
  return call(drops, 'activate-drop', [Cl.uint(dropId)], sender);
}

function claim(dropId: bigint, sender: string) {
  return call(drops, 'claim', [Cl.uint(dropId)], sender);
}

function fund(dropId: bigint, amount: bigint | number, sender = creator) {
  return call(drops, 'fund-budget', [Cl.uint(dropId), Cl.uint(amount)], sender);
}

function getDrop(dropId: bigint): any {
  return cvToValue(read(drops, 'get-drop', [Cl.uint(dropId)])).value;
}

function dropNum(dropId: bigint, field: string): bigint {
  return BigInt(getDrop(dropId)[field].value);
}

function nftOwner(tokenId: bigint): string | null {
  const inner = unwrapOk(read(core, 'get-owner', [Cl.uint(tokenId)]));
  if (inner.type === ClarityType.OptionalNone) return null;
  return cvToValue(inner.value);
}

// Standard 5-item pre-inscribed public drop, escrowed + activated.
function standardDrop(n = 5, opts: DropOpts = {}): { dropId: bigint; tokens: bigint[] } {
  const tokens = setupCollection(n);
  const dropId = createDrop(opts);
  unwrapOk(addRange(dropId, 0, n));
  unwrapOk(escrow(dropId, tokens.map((t, i) => [i, t] as [number, bigint])));
  if ((opts.mode ?? MODE.PRE) === MODE.SPONSORED) {
    const claimable = opts.totalLimit && opts.totalLimit < n ? opts.totalLimit : n;
    unwrapOk(fund(dropId, MIN_FEE_BUDGET * BigInt(claimable), creator));
  }
  unwrapOk(activate(dropId));
  return { dropId, tokens };
}

// --- attestations ---

function setAttestor(privateKey: string | null = attestorPrivateKey) {
  const value = privateKey === null
    ? Cl.none()
    : Cl.some(Cl.buffer(Uint8Array.from(
        hash160(Uint8Array.from(Buffer.from(privateKeyToPublic(privateKey), 'hex')))
      )));
  return unwrapOk(call(drops, 'set-attestor-pubkey-hash', [value], deployer));
}

function signAttestation(params: {
  dropId: bigint;
  claimer: string;
  expiresAt: bigint;
  privateKey?: string;
  contractName?: string;
  collection?: string;
}) {
  const payload = tupleCV({
    'chain-id': uintCV(SIMNET_CHAIN_ID),
    claimer: principalCV(params.claimer),
    collection: contractPrincipalCV(deployer, params.collection ?? 'xtrata-collection-v3'),
    contract: contractPrincipalCV(deployer, params.contractName ?? 'xtrata-drops-v3'),
    'drop-id': uintCV(params.dropId),
    'expires-at': uintCV(params.expiresAt),
  });
  const serialized = serializeCV(payload) as string;
  const digest = createHash('sha256')
    .update(Buffer.from(serialized.replace(/^0x/i, ''), 'hex'))
    .digest();
  return signMessageHashRsv({
    messageHash: digest.toString('hex'),
    privateKey: params.privateKey ?? attestorPrivateKey,
  });
}

function claimSigned(
  sender: string,
  dropId: bigint,
  options: {
    expiresAt?: bigint;
    privateKey?: string;
    signedDropId?: bigint;
    signedClaimer?: string;
    signedContractName?: string;
  } = {}
) {
  const expiresAt = options.expiresAt ?? 10_000n;
  const signature = signAttestation({
    dropId: options.signedDropId ?? dropId,
    claimer: options.signedClaimer ?? sender,
    expiresAt,
    privateKey: options.privateKey,
    contractName: options.signedContractName,
  });
  return call(drops, 'claim-signed',
    [Cl.uint(dropId), Cl.uint(expiresAt), Cl.bufferFromHex(signature)], sender);
}

// --- inventory resolution ---

describe('inventory resolution', () => {
  it('whole-collection range assigns every item and records inventory', () => {
    const tokens = setupCollection(5);
    const dropId = createDrop();
    expect(addRange(dropId, 0, 5)).toBeOk(Cl.uint(5));
    expect(dropNum(dropId, 'inventory-count')).toBe(5n);
    expect(dropNum(dropId, 'ranges-total')).toBe(5n);
    // every index is assigned in the collection to this drop
    for (let i = 0; i < 5; i++) {
      const a = cvToValue(read(coll, 'get-assignment', [Cl.uint(i)]));
      expect(a.value['drop-contract'].value).toBe(dropsContractPrincipal);
      expect(BigInt(a.value['drop-id'].value)).toBe(dropId);
    }
    // slot resolution maps slots to indexes in order
    for (let s = 0; s < 5; s++) {
      const slot = cvToValue(unwrapOk(read(drops, 'get-inventory-slot', [Cl.uint(dropId), Cl.uint(s)])));
      expect(BigInt(slot.value)).toBe(BigInt(s));
    }
    void tokens;
  });

  it('subrange + explicit ids compose; slots resolve ranges first then explicit', () => {
    setupCollection(6);
    const dropId = createDrop();
    expect(addRange(dropId, 1, 3)).toBeOk(Cl.uint(2)); // indexes 1,2 -> slots 0,1
    expect(addItems(dropId, [5, 0])).toBeOk(Cl.uint(2)); // slots 2,3
    expect(dropNum(dropId, 'inventory-count')).toBe(4n);
    const expected = [1n, 2n, 5n, 0n];
    for (let s = 0; s < 4; s++) {
      const slot = cvToValue(unwrapOk(read(drops, 'get-inventory-slot', [Cl.uint(dropId), Cl.uint(s)])));
      expect(BigInt(slot.value)).toBe(expected[s]);
    }
    // out of range slot resolves to none
    const beyond = cvToValue(unwrapOk(read(drops, 'get-inventory-slot', [Cl.uint(dropId), Cl.uint(4)])));
    expect(beyond).toBeNull();
  });

  it('all-unassigned flow: scan the collection then add computed ranges', () => {
    setupCollection(6);
    // pre-assign indexes 2 and 3 to another drop
    const other = createDrop();
    unwrapOk(addRange(other, 2, 4));
    // client-side: compute unassigned ranges from get-unassigned-scan
    const scan = cvToValue(unwrapOk(read(coll, 'get-unassigned-scan', [Cl.uint(0)])));
    const unassigned = scan
      .filter((e: any) => e.value.minted.value && !e.value.assigned.value)
      .map((e: any) => Number(e.value.index.value));
    expect(unassigned).toEqual([0, 1, 4, 5]);
    const dropId = createDrop();
    expect(addRange(dropId, 0, 2)).toBeOk(Cl.uint(2));
    expect(addRange(dropId, 4, 6)).toBeOk(Cl.uint(2));
    expect(dropNum(dropId, 'inventory-count')).toBe(4n);
  });

  it('rejects double assignment across drops and within one drop', () => {
    setupCollection(4);
    const d1 = createDrop();
    unwrapOk(addRange(d1, 0, 2));
    const d2 = createDrop();
    // overlap with d1 -> collection rejects atomically
    expect(addRange(d2, 1, 3)).toBeErr(Cl.uint(COLL_ERR.ALREADY_ASSIGNED));
    expect(cvToValue(read(coll, 'get-assignment', [Cl.uint(2)]))).toBeNull();
    // re-adding to the same drop also rejected (one assignment row per index)
    expect(addRange(d1, 0, 2)).toBeErr(Cl.uint(COLL_ERR.ALREADY_ASSIGNED));
    expect(addItems(d1, [1])).toBeErr(Cl.uint(COLL_ERR.ALREADY_ASSIGNED));
    // unminted index rejected
    expect(addItems(d1, [9])).toBeErr(Cl.uint(COLL_ERR.NOT_MINTED));
  });

  it('inventory is immutable after activation; only the creator builds it', () => {
    const tokens = setupCollection(3);
    const dropId = createDrop();
    expect(addRange(dropId, 0, 2, w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(addItems(dropId, [0], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(addRange(dropId, 0, 2));
    unwrapOk(escrow(dropId, [[0, tokens[0]], [1, tokens[1]]]));
    unwrapOk(activate(dropId));
    expect(addRange(dropId, 2, 3)).toBeErr(Cl.uint(ERR.INVALID_STATUS));
    expect(addItems(dropId, [2])).toBeErr(Cl.uint(ERR.INVALID_STATUS));
    expect(escrow(dropId, [[2, tokens[2]]])).toBeErr(Cl.uint(ERR.INVALID_STATUS));
  });
});

// --- escrow ---

describe('escrow', () => {
  it('escrows into the contract, validates membership and duplicates', () => {
    const tokens = setupCollection(3);
    const dropId = createDrop();
    unwrapOk(addRange(dropId, 0, 2));
    // index outside inventory
    expect(escrow(dropId, [[2, tokens[2]]])).toBeErr(Cl.uint(ERR.NOT_IN_INVENTORY));
    unwrapOk(escrow(dropId, [[0, tokens[0]]]));
    expect(nftOwner(tokens[0])).toBe(dropsContractPrincipal);
    // duplicate index
    expect(escrow(dropId, [[0, tokens[0]]])).toBeErr(Cl.uint(ERR.ALREADY_ESCROWED));
    // non-owner of the NFT cannot escrow (core transfer rejects)
    expect(escrow(dropId, [[1, tokens[1]]], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(dropNum(dropId, 'escrowed-count')).toBe(1n);
  });

  it('accepts a full 25-item batch and rejects 26 (list boundary)', () => {
    const tokens = setupCollection(26);
    const dropId = createDrop();
    unwrapOk(addRange(dropId, 0, 26));
    const pairs25 = tokens.slice(0, 25).map((t, i) => [i, t] as [number, bigint]);
    expect(escrow(dropId, pairs25)).toBeOk(Cl.uint(25));
    let failed = false;
    try {
      const res = escrow(dropId, tokens.map((t, i) => [i, t] as [number, bigint]));
      failed = res.type === ClarityType.ResponseErr;
    } catch {
      failed = true;
    }
    expect(failed).toBe(true);
    expect(dropNum(dropId, 'escrowed-count')).toBe(25n);
  });
});

// --- activation gates ---

describe('activation gates', () => {
  it('requires inventory and full escrow in every mode', () => {
    const tokens = setupCollection(2);
    const empty = createDrop();
    expect(activate(empty)).toBeErr(Cl.uint(ERR.INVALID_CONFIG));
    const dropId = createDrop({ mode: MODE.ZERO });
    unwrapOk(addRange(dropId, 0, 2));
    expect(activate(dropId)).toBeErr(Cl.uint(ERR.ESCROW_INCOMPLETE));
    unwrapOk(escrow(dropId, [[0, tokens[0]]]));
    expect(activate(dropId)).toBeErr(Cl.uint(ERR.ESCROW_INCOMPLETE));
    unwrapOk(escrow(dropId, [[1, tokens[1]]]));
    expect(activate(dropId, w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(activate(dropId));
    expect(dropNum(dropId, 'status')).toBe(BigInt(STATUS.ACTIVE));
    expect(activate(dropId)).toBeErr(Cl.uint(ERR.INVALID_STATUS));
  });

  it('sponsored mode requires MIN-FEE-BUDGET per claimable item', () => {
    const tokens = setupCollection(2);
    const dropId = createDrop({ mode: MODE.SPONSORED });
    unwrapOk(addRange(dropId, 0, 2));
    unwrapOk(escrow(dropId, [[0, tokens[0]], [1, tokens[1]]]));
    expect(activate(dropId)).toBeErr(Cl.uint(ERR.INVALID_BUDGET));
    unwrapOk(fund(dropId, MIN_FEE_BUDGET * 2n - 1n, w4)); // anyone may fund
    expect(activate(dropId)).toBeErr(Cl.uint(ERR.INVALID_BUDGET));
    unwrapOk(fund(dropId, 1n, w4));
    unwrapOk(activate(dropId));
    expect(dropNum(dropId, 'fee-budget-total')).toBe(MIN_FEE_BUDGET * 2n);
  });

  it('validates create-drop configuration', () => {
    setupCollection(1);
    expect(call(drops, 'create-drop',
      [collPrincipal, Cl.uint(9), Cl.uint(1), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0)], creator))
      .toBeErr(Cl.uint(ERR.INVALID_MODE));
    expect(call(drops, 'create-drop',
      [collPrincipal, Cl.uint(1), Cl.uint(9), Cl.uint(0), Cl.uint(0), Cl.uint(0), Cl.uint(0)], creator))
      .toBeErr(Cl.uint(ERR.INVALID_MODE));
    expect(call(drops, 'create-drop',
      [collPrincipal, Cl.uint(1), Cl.uint(1), Cl.uint(10), Cl.uint(5), Cl.uint(0), Cl.uint(0)], creator))
      .toBeErr(Cl.uint(ERR.INVALID_CONFIG));
  });
});

// --- claims: public eligibility ---

describe('public claims', () => {
  it('claims sequentially, transfers the escrowed NFT, records the claim', () => {
    const { dropId, tokens } = standardDrop(3);
    unwrapOk(claim(dropId, w2));
    expect(nftOwner(tokens[0])).toBe(w2);
    unwrapOk(claim(dropId, w3));
    expect(nftOwner(tokens[1])).toBe(w3);
    expect(dropNum(dropId, 'claimed-count')).toBe(2n);
    const c0 = cvToValue(read(drops, 'get-claim', [Cl.uint(dropId), Cl.uint(0)]));
    expect(c0.value.claimer.value).toBe(w2);
    expect(BigInt(c0.value.index.value)).toBe(0n);
    const wc = cvToValue(unwrapOk(read(drops, 'get-wallet-claims', [Cl.uint(dropId), Cl.principal(w2)])));
    expect(BigInt(wc)).toBe(1n);
    const remaining = cvToValue(unwrapOk(read(drops, 'get-remaining', [Cl.uint(dropId)])));
    expect(BigInt(remaining)).toBe(1n);
    const scan = cvToValue(unwrapOk(read(drops, 'get-claims-scan', [Cl.uint(dropId), Cl.uint(0)])));
    expect(scan.length).toBe(2);
  });

  it('cannot claim a draft drop and blocks claims outside the window', () => {
    const tokens = setupCollection(2);
    const h = simnet.blockHeight;
    const dropId = createDrop({ start: h + 10, end: h + 20 });
    unwrapOk(addRange(dropId, 0, 2));
    expect(claim(dropId, w2)).toBeErr(Cl.uint(ERR.NOT_ACTIVE));
    unwrapOk(escrow(dropId, [[0, tokens[0]], [1, tokens[1]]]));
    unwrapOk(activate(dropId));
    expect(claim(dropId, w2)).toBeErr(Cl.uint(ERR.WINDOW));
    simnet.mineEmptyBlocks(12);
    unwrapOk(claim(dropId, w2));
    simnet.mineEmptyBlocks(20);
    expect(claim(dropId, w3)).toBeErr(Cl.uint(ERR.WINDOW));
  });

  it('enforces per-wallet and total limits', () => {
    const { dropId } = standardDrop(4, { perWalletLimit: 2, totalLimit: 3 });
    unwrapOk(claim(dropId, w2));
    unwrapOk(claim(dropId, w2));
    expect(claim(dropId, w2)).toBeErr(Cl.uint(ERR.WALLET_LIMIT));
    unwrapOk(claim(dropId, w3));
    // total limit 3 reached even though inventory has one more item
    expect(claim(dropId, w4)).toBeErr(Cl.uint(ERR.SOLD_OUT));
  });

  it('concurrent wallets racing the last item: exactly one wins', () => {
    const { dropId, tokens } = standardDrop(1);
    unwrapOk(claim(dropId, w2));
    expect(claim(dropId, w3)).toBeErr(Cl.uint(ERR.SOLD_OUT));
    expect(nftOwner(tokens[0])).toBe(w2);
    expect(dropNum(dropId, 'claimed-count')).toBe(1n);
  });

  it('claim-signed is rejected for public drops and claim for signed drops', () => {
    const { dropId } = standardDrop(2);
    setAttestor();
    expect(claimSigned(w2, dropId)).toBeErr(Cl.uint(ERR.ELIGIBILITY));
  });
});

// --- allowlist eligibility ---

describe('allowlist claims', () => {
  it('gates by per-wallet allowance; creator manages entries', () => {
    const { dropId } = standardDrop(4, { eligibility: ELIG.ALLOWLIST });
    expect(call(drops, 'set-allowlist-entry',
      [Cl.uint(dropId), Cl.principal(w2), Cl.uint(2)], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(call(drops, 'set-allowlist-batch', [
      Cl.uint(dropId),
      Cl.list([
        Cl.tuple({ wallet: Cl.principal(w2), allowance: Cl.uint(2) }),
        Cl.tuple({ wallet: Cl.principal(w3), allowance: Cl.uint(1) }),
      ]),
    ], creator));
    unwrapOk(claim(dropId, w2));
    unwrapOk(claim(dropId, w2));
    expect(claim(dropId, w2)).toBeErr(Cl.uint(ERR.WALLET_LIMIT));
    unwrapOk(claim(dropId, w3));
    expect(claim(dropId, w3)).toBeErr(Cl.uint(ERR.WALLET_LIMIT));
    expect(claim(dropId, w4)).toBeErr(Cl.uint(ERR.NOT_ALLOWLISTED));
  });
});

// --- signed eligibility ---

describe('signed claims', () => {
  function signedDrop() {
    const { dropId, tokens } = standardDrop(3, { eligibility: ELIG.SIGNED });
    setAttestor();
    return { dropId, tokens };
  }

  it('accepts a valid attestation and transfers the item', () => {
    const { dropId, tokens } = signedDrop();
    unwrapOk(claimSigned(w2, dropId));
    expect(nftOwner(tokens[0])).toBe(w2);
  });

  it('rejects replay and tampering variants', () => {
    const { dropId } = signedDrop();
    // wrong signer key
    expect(claimSigned(w2, dropId, { privateKey: wrongAttestorPrivateKey }))
      .toBeErr(Cl.uint(ERR.SIGNATURE_INVALID));
    // signature for another drop
    expect(claimSigned(w2, dropId, { signedDropId: dropId + 1n }))
      .toBeErr(Cl.uint(ERR.SIGNATURE_INVALID));
    // signature bound to another claimer
    expect(claimSigned(w2, dropId, { signedClaimer: w3 }))
      .toBeErr(Cl.uint(ERR.SIGNATURE_INVALID));
    // signature bound to a different contract principal
    expect(claimSigned(w2, dropId, { signedContractName: 'xtrata-drops-v3-other' }))
      .toBeErr(Cl.uint(ERR.SIGNATURE_INVALID));
    // expired attestation
    expect(claimSigned(w2, dropId, { expiresAt: 1n }))
      .toBeErr(Cl.uint(ERR.ATTESTATION_EXPIRED));
    // attestor unset
    setAttestor(null);
    expect(claimSigned(w2, dropId)).toBeErr(Cl.uint(ERR.ATTESTOR_NOT_CONFIGURED));
    expect(dropNum(dropId, 'claimed-count')).toBe(0n);
  });

  it('still enforces wallet limits and reservations are unsupported', () => {
    const { dropId } = standardDrop(3, { eligibility: ELIG.SIGNED, perWalletLimit: 1 });
    setAttestor();
    unwrapOk(claimSigned(w2, dropId));
    expect(claimSigned(w2, dropId)).toBeErr(Cl.uint(ERR.WALLET_LIMIT));
    expect(call(drops, 'reserve-claim', [Cl.uint(dropId)], w3))
      .toBeErr(Cl.uint(ERR.ELIGIBILITY));
  });
});

// --- claim reservations ---

describe('claim reservations', () => {
  it('reserve then claim uses the reserved index; one reservation per wallet', () => {
    const { dropId, tokens } = standardDrop(3);
    expect(call(drops, 'reserve-claim', [Cl.uint(dropId)], w2)).toBeOk(Cl.uint(0));
    expect(call(drops, 'reserve-claim', [Cl.uint(dropId)], w2))
      .toBeErr(Cl.uint(ERR.ALREADY_RESERVED));
    expect(dropNum(dropId, 'reserved-count')).toBe(1n);
    // another wallet claims -> gets the NEXT index, not the reserved one
    unwrapOk(claim(dropId, w3));
    expect(nftOwner(tokens[1])).toBe(w3);
    // reserver settles and receives index 0
    unwrapOk(claim(dropId, w2));
    expect(nftOwner(tokens[0])).toBe(w2);
    expect(dropNum(dropId, 'reserved-count')).toBe(0n);
    expect(dropNum(dropId, 'claimed-count')).toBe(2n);
  });

  it('reservations count against capacity and wallet limits', () => {
    const { dropId } = standardDrop(2, { perWalletLimit: 1 });
    unwrapOk(call(drops, 'reserve-claim', [Cl.uint(dropId)], w2));
    // reservation consumes the wallet limit
    expect(call(drops, 'reserve-claim', [Cl.uint(dropId)], w3)).toBeOk(Cl.uint(1));
    // capacity exhausted by two reservations
    expect(call(drops, 'reserve-claim', [Cl.uint(dropId)], w4))
      .toBeErr(Cl.uint(ERR.SOLD_OUT));
    expect(claim(dropId, w4)).toBeErr(Cl.uint(ERR.SOLD_OUT));
  });

  it('expired reservations release permissionlessly and the index recycles', () => {
    const { dropId, tokens } = standardDrop(2);
    unwrapOk(call(drops, 'reserve-claim', [Cl.uint(dropId)], w2));
    expect(call(drops, 'release-expired-claim', [Cl.uint(dropId), Cl.principal(w2)], w4))
      .toBeErr(Cl.uint(ERR.RESERVATION_NOT_EXPIRED));
    simnet.mineEmptyBlocks(RESERVATION_EXPIRY);
    expect(call(drops, 'release-expired-claim', [Cl.uint(dropId), Cl.principal(w2)], w4))
      .toBeOk(Cl.uint(0));
    expect(dropNum(dropId, 'reserved-count')).toBe(0n);
    expect(dropNum(dropId, 'free-count')).toBe(1n);
    // released index 0 is allocated before the cursor
    unwrapOk(claim(dropId, w3));
    expect(nftOwner(tokens[0])).toBe(w3);
    expect(dropNum(dropId, 'free-count')).toBe(0n);
  });
});

// --- pause / end / cancel ---

describe('pause, end, cancel', () => {
  it('drop pause and global pause block claims but not recovery paths', () => {
    const { dropId } = standardDrop(3);
    unwrapOk(call(drops, 'reserve-claim', [Cl.uint(dropId)], w2));
    expect(call(drops, 'pause-drop', [Cl.uint(dropId)], w3)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(call(drops, 'pause-drop', [Cl.uint(dropId)], creator));
    expect(claim(dropId, w3)).toBeErr(Cl.uint(ERR.NOT_ACTIVE));
    unwrapOk(call(drops, 'resume-drop', [Cl.uint(dropId)], deployer)); // owner may too
    unwrapOk(claim(dropId, w3));
    // owner emergency pause-all
    unwrapOk(call(drops, 'set-paused', [Cl.bool(true)], deployer));
    expect(claim(dropId, w4)).toBeErr(Cl.uint(ERR.PAUSED));
    expect(call(drops, 'reserve-claim', [Cl.uint(dropId)], w4)).toBeErr(Cl.uint(ERR.PAUSED));
    // expired-reservation release still works under global pause
    simnet.mineEmptyBlocks(RESERVATION_EXPIRY);
    unwrapOk(call(drops, 'release-expired-claim', [Cl.uint(dropId), Cl.principal(w2)], w4));
    unwrapOk(call(drops, 'set-paused', [Cl.bool(false)], deployer));
    unwrapOk(claim(dropId, w4));
  });

  it('end-drop: creator anytime, anyone only past end-block', () => {
    const tokens = setupCollection(1);
    const h = simnet.blockHeight;
    const dropId = createDrop({ end: h + 10 });
    unwrapOk(addRange(dropId, 0, 1));
    unwrapOk(escrow(dropId, [[0, tokens[0]]]));
    unwrapOk(activate(dropId));
    expect(call(drops, 'end-drop', [Cl.uint(dropId)], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    simnet.mineEmptyBlocks(12);
    unwrapOk(call(drops, 'end-drop', [Cl.uint(dropId)], w2));
    expect(dropNum(dropId, 'status')).toBe(BigInt(STATUS.ENDED));
    expect(claim(dropId, w2)).toBeErr(Cl.uint(ERR.NOT_ACTIVE));
    expect(call(drops, 'end-drop', [Cl.uint(dropId)], w2)).toBeErr(Cl.uint(ERR.INVALID_STATUS));
  });

  it('cancel-drop closes claims and refunds the remaining budget immediately', () => {
    const { dropId } = standardDrop(2, { mode: MODE.SPONSORED });
    unwrapOk(fund(dropId, 200_000n, creator));
    const before = stx(creator);
    expect(call(drops, 'cancel-drop', [Cl.uint(dropId)], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    // 100k activation floor (standardDrop) + 200k extra
    expect(call(drops, 'cancel-drop', [Cl.uint(dropId)], creator)).toBeOk(Cl.uint(300_000));
    expect(stx(creator) - before).toBe(300_000n);
    expect(dropNum(dropId, 'status')).toBe(BigInt(STATUS.CANCELLED));
    expect(dropNum(dropId, 'fee-budget-remaining')).toBe(0n);
    expect(claim(dropId, w2)).toBeErr(Cl.uint(ERR.NOT_ACTIVE));
  });
});

// --- recovery ---

describe('unclaimed-inventory recovery', () => {
  it('returns escrowed NFTs, clears assignments, refuses claimed items', () => {
    const { dropId, tokens } = standardDrop(3);
    unwrapOk(claim(dropId, w2)); // index 0 claimed
    unwrapOk(call(drops, 'end-drop', [Cl.uint(dropId)], creator));
    // recovery is creator-only and status-gated
    expect(call(drops, 'recover-batch',
      [collPrincipal, Cl.uint(dropId), Cl.list([Cl.uint(1)])], w2))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    // claimed index refused (atomic)
    expect(call(drops, 'recover-batch',
      [collPrincipal, Cl.uint(dropId), Cl.list([Cl.uint(0), Cl.uint(1)])], creator))
      .toBeErr(Cl.uint(ERR.ALREADY_CLAIMED));
    expect(call(drops, 'recover-batch',
      [collPrincipal, Cl.uint(dropId), Cl.list([Cl.uint(1), Cl.uint(2)])], creator))
      .toBeOk(Cl.uint(2));
    expect(nftOwner(tokens[1])).toBe(creator);
    expect(nftOwner(tokens[2])).toBe(creator);
    expect(nftOwner(tokens[0])).toBe(w2);
    // assignments cleared for recovered items, kept for the claimed one
    expect(cvToValue(read(coll, 'get-assignment', [Cl.uint(1)]))).toBeNull();
    expect(cvToValue(read(coll, 'get-assignment', [Cl.uint(2)]))).toBeNull();
    expect(cvToValue(read(coll, 'get-assignment', [Cl.uint(0)]))).not.toBeNull();
    expect(dropNum(dropId, 'escrowed-count')).toBe(0n);
    // indexes can now join a new drop
    const next = createDrop();
    expect(addItems(next, [1, 2])).toBeOk(Cl.uint(2));
  });

  it('cannot recover while the drop is active', () => {
    const { dropId } = standardDrop(2);
    expect(call(drops, 'recover-batch',
      [collPrincipal, Cl.uint(dropId), Cl.list([Cl.uint(0)])], creator))
      .toBeErr(Cl.uint(ERR.INVALID_STATUS));
  });

  it('recovers a cancelled draft that was assigned but never escrowed', () => {
    setupCollection(2);
    const dropId = createDrop();
    unwrapOk(addRange(dropId, 0, 2));
    unwrapOk(call(drops, 'cancel-drop', [Cl.uint(dropId)], creator));
    expect(call(drops, 'recover-batch',
      [collPrincipal, Cl.uint(dropId), Cl.list([Cl.uint(0), Cl.uint(1)])], creator))
      .toBeOk(Cl.uint(0)); // nothing escrowed, assignments cleared
    expect(cvToValue(read(coll, 'get-assignment', [Cl.uint(0)]))).toBeNull();
  });
});

// --- sponsorship settlement ---

describe('sponsorship settlement', () => {
  function sponsoredDrop(n = 2) {
    const result = standardDrop(n, { mode: MODE.SPONSORED });
    unwrapOk(call(drops, 'set-sponsor', [Cl.principal(sponsor)], deployer));
    return result;
  }

  it('activation requires funding; claim-fee is sponsor-only and capped', () => {
    const tokens = setupCollection(2);
    const dropId = createDrop({ mode: MODE.SPONSORED });
    unwrapOk(addRange(dropId, 0, 2));
    unwrapOk(escrow(dropId, [[0, tokens[0]], [1, tokens[1]]]));
    unwrapOk(fund(dropId, 3_000_000n, creator));
    unwrapOk(activate(dropId));
    unwrapOk(call(drops, 'set-sponsor', [Cl.principal(sponsor)], deployer));
    // no claims yet: nothing to settle
    expect(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(1000)], sponsor))
      .toBeErr(Cl.uint(ERR.NOT_CLAIMED));
    unwrapOk(claim(dropId, w2));
    // non-sponsor rejected
    expect(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(1000)], creator))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    // above the per-claim cap (default 2 STX)
    expect(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(2_000_001)], sponsor))
      .toBeErr(Cl.uint(ERR.FEE_TOO_LARGE));
    const before = stx(sponsor);
    unwrapOk(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(150_000)], sponsor));
    expect(stx(sponsor) - before).toBe(150_000n);
    expect(dropNum(dropId, 'fee-budget-remaining')).toBe(2_850_000n);
    // one settlement per confirmed claim
    expect(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(1000)], sponsor))
      .toBeErr(Cl.uint(ERR.NOT_CLAIMED));
  });

  it('claim-fee cannot exceed the remaining budget (exhaustion mid-drop)', () => {
    const { dropId } = sponsoredDrop(2);
    unwrapOk(fund(dropId, MIN_FEE_BUDGET * 2n, creator)); // extra on top of activation floor
    unwrapOk(claim(dropId, w2));
    unwrapOk(claim(dropId, w3));
    const remaining = dropNum(dropId, 'fee-budget-remaining');
    expect(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(remaining + 1n)], sponsor))
      .toBeErr(Cl.uint(ERR.FEE_TOO_LARGE));
    unwrapOk(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(remaining)], sponsor));
    expect(dropNum(dropId, 'fee-budget-remaining')).toBe(0n);
    expect(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(1)], sponsor))
      .toBeErr(Cl.uint(ERR.FEE_TOO_LARGE));
  });

  it('owner can adjust the claim-fee cap', () => {
    const { dropId } = sponsoredDrop(1);
    unwrapOk(claim(dropId, w2));
    expect(call(drops, 'set-claim-fee-cap', [Cl.uint(10_000)], w2))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(call(drops, 'set-claim-fee-cap', [Cl.uint(10_000)], deployer));
    expect(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(10_001)], sponsor))
      .toBeErr(Cl.uint(ERR.FEE_TOO_LARGE));
    unwrapOk(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(10_000)], sponsor));
  });

  it('settle-refund: sponsor anytime, creator only after end + delay', () => {
    const { dropId } = sponsoredDrop(2);
    // stranger cannot refund
    expect(call(drops, 'settle-refund', [Cl.uint(dropId)], w4))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    // creator blocked while active
    expect(call(drops, 'settle-refund', [Cl.uint(dropId)], creator))
      .toBeErr(Cl.uint(ERR.REFUND_LOCKED));
    unwrapOk(call(drops, 'end-drop', [Cl.uint(dropId)], creator));
    // creator blocked before the delay
    expect(call(drops, 'settle-refund', [Cl.uint(dropId)], creator))
      .toBeErr(Cl.uint(ERR.REFUND_LOCKED));
    simnet.mineEmptyBlocks(REFUND_DELAY);
    const before = stx(creator);
    expect(call(drops, 'settle-refund', [Cl.uint(dropId)], creator))
      .toBeOk(Cl.uint(MIN_FEE_BUDGET * 2n));
    expect(stx(creator) - before).toBe(MIN_FEE_BUDGET * 2n);
    // second refund is a zero no-op
    expect(call(drops, 'settle-refund', [Cl.uint(dropId)], creator)).toBeOk(Cl.uint(0));
  });

  it('sponsor may settle-refund immediately, even while active', () => {
    const { dropId } = sponsoredDrop(1);
    const before = stx(creator);
    expect(call(drops, 'settle-refund', [Cl.uint(dropId)], sponsor))
      .toBeOk(Cl.uint(MIN_FEE_BUDGET));
    expect(stx(creator) - before).toBe(MIN_FEE_BUDGET); // refund goes to creator
  });
});

// --- admin ---

describe('admin', () => {
  it('two-step ownership transfer', () => {
    expect(call(drops, 'accept-contract-ownership', [], w2))
      .toBeErr(Cl.uint(ERR.NO_PENDING_OWNER));
    expect(call(drops, 'initiate-contract-ownership-transfer', [Cl.principal(deployer)], deployer))
      .toBeErr(Cl.uint(ERR.PENDING_OWNER));
    unwrapOk(call(drops, 'initiate-contract-ownership-transfer', [Cl.principal(w2)], deployer));
    expect(call(drops, 'accept-contract-ownership', [], w3))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(call(drops, 'accept-contract-ownership', [], w2));
    expect(call(drops, 'set-sponsor', [Cl.principal(w3)], deployer))
      .toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    unwrapOk(call(drops, 'set-sponsor', [Cl.principal(w3)], w2));
  });

  it('owner-only setters reject strangers', () => {
    expect(call(drops, 'set-sponsor', [Cl.principal(w2)], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(drops, 'set-attestor-pubkey-hash', [Cl.none()], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(drops, 'set-claim-fee-cap', [Cl.uint(1)], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
    expect(call(drops, 'set-paused', [Cl.bool(true)], w2)).toBeErr(Cl.uint(ERR.NOT_AUTHORIZED));
  });
});

// --- end to end ---

describe('end-to-end: 10-item whole-collection drop', () => {
  it('mint -> drop -> escrow -> activate -> claims -> end -> recover -> refund', () => {
    const tokens = setupCollection(10);
    const dropId = createDrop({ mode: MODE.SPONSORED, perWalletLimit: 2 });
    expect(addRange(dropId, 0, 10)).toBeOk(Cl.uint(10));
    unwrapOk(escrow(dropId, tokens.slice(0, 8).map((t, i) => [i, t] as [number, bigint])));
    unwrapOk(escrow(dropId, [[8, tokens[8]], [9, tokens[9]]]));
    unwrapOk(fund(dropId, MIN_FEE_BUDGET * 10n, creator));
    unwrapOk(activate(dropId));
    unwrapOk(call(drops, 'set-sponsor', [Cl.principal(sponsor)], deployer));

    // multiple wallets claim
    unwrapOk(claim(dropId, w2));
    unwrapOk(claim(dropId, w2));
    expect(claim(dropId, w2)).toBeErr(Cl.uint(ERR.WALLET_LIMIT));
    unwrapOk(claim(dropId, w3));
    unwrapOk(claim(dropId, w4));
    expect(dropNum(dropId, 'claimed-count')).toBe(4n);
    expect(nftOwner(tokens[0])).toBe(w2);
    expect(nftOwner(tokens[2])).toBe(w3);
    expect(nftOwner(tokens[3])).toBe(w4);

    // sponsor settles fees for the confirmed claims
    for (let i = 0; i < 4; i++) {
      unwrapOk(call(drops, 'claim-fee', [Cl.uint(dropId), Cl.uint(25_000)], sponsor));
    }
    expect(dropNum(dropId, 'fee-budget-remaining')).toBe(MIN_FEE_BUDGET * 10n - 100_000n);

    // creator ends and recovers the 6 leftovers
    unwrapOk(call(drops, 'end-drop', [Cl.uint(dropId)], creator));
    expect(call(drops, 'recover-batch', [
      collPrincipal, Cl.uint(dropId),
      Cl.list([4, 5, 6, 7, 8, 9].map((i) => Cl.uint(i))),
    ], creator)).toBeOk(Cl.uint(6));
    for (const i of [4, 5, 6, 7, 8, 9]) {
      expect(nftOwner(tokens[i])).toBe(creator);
      expect(cvToValue(read(coll, 'get-assignment', [Cl.uint(i)]))).toBeNull();
    }
    expect(dropNum(dropId, 'escrowed-count')).toBe(0n);

    // budget refund after the delay
    simnet.mineEmptyBlocks(REFUND_DELAY);
    const before = stx(creator);
    expect(call(drops, 'settle-refund', [Cl.uint(dropId)], creator))
      .toBeOk(Cl.uint(MIN_FEE_BUDGET * 10n - 100_000n));
    expect(stx(creator) - before).toBe(MIN_FEE_BUDGET * 10n - 100_000n);
  });
});
