import {
  Cl,
  ClarityType,
  cvToString,
  type ClarityValue,
  type BufferCV,
  type ListCV,
  type TupleCV,
  type UIntCV,
  type StringAsciiCV,
  type SomeCV,
  type ResponseOkCV,
  type ResponseErrorCV
} from '@stacks/transactions';
import { XtrataClientError } from '../errors.js';
import { hexToBytes, CHUNK_SIZE, MAX_CHUNK_BATCH } from '../hash.js';

/**
 * Clarity value encode/decode helpers for the shapes xtrata-collection-v3 (and
 * the pinned core) exchange. Every decoder is strict: an unexpected shape
 * throws a normalized `internal` XtrataClientError rather than silently
 * mis-parsing chain state.
 */

// --- collection error table (contract header, u100–u125) ---

export const COLLECTION_ERROR_CODES: Record<number, string> = {
  100: 'ERR-NOT-AUTHORIZED (caller lacks the required role)',
  101: 'ERR-PAUSED (mint entrypoints blocked while paused)',
  102: 'ERR-FINALIZED (config/mint action after finalize)',
  103: 'ERR-NOT-FOUND (session/item/assignment missing)',
  104: 'ERR-MAX-SUPPLY (supply exhausted: minted+reserved >= max)',
  105: 'ERR-DUPLICATE-HASH (hash already reserved/minted in collection)',
  106: 'ERR-ALREADY-RESERVED (caller already holds a session for hash)',
  107: 'ERR-INVALID-BATCH (bad batch shape/size/validation)',
  108: 'ERR-INVALID-PHASE (unknown/invalid phase id or bounds)',
  109: 'ERR-PHASE-NOT-ACTIVE (phase disabled or outside schedule)',
  110: 'ERR-PHASE-CAP (per-phase supply cap reached)',
  111: 'ERR-WALLET-LIMIT (global/phase per-wallet limit reached)',
  112: 'ERR-NOT-ALLOWLISTED (wallet not on required allowlist)',
  113: 'ERR-INVALID-ALLOWLIST-MODE (mode not in {inherit,public,global,phase})',
  114: 'ERR-INVALID-BPS (splits sum exceeds 10000 bps)',
  115: 'ERR-INVALID-CORE-CONTRACT (trait arg is not the pinned core)',
  116: 'ERR-PENDING-OWNER (invalid ownership-transfer initiation)',
  117: 'ERR-NO-PENDING-OWNER (accept without a pending transfer)',
  118: 'ERR-RESERVATION-NOT-EXPIRED (permissionless release before expiry)',
  119: 'ERR-NOT-FINALIZABLE (finalize preconditions unmet)',
  120: 'ERR-ALREADY-SET (one-shot config already set)',
  121: 'ERR-INVALID-SUPPLY-MODE (bad supply mode / close-supply misuse)',
  122: 'ERR-ALREADY-ASSIGNED (item already assigned to a drop)',
  123: 'ERR-ASSIGNMENT-MISMATCH (unassign with wrong drop/authority)',
  124: 'ERR-DEFAULT-DEPENDENCIES-BATCH (explicit deps while defaults configured)',
  125: 'ERR-NOT-MINTED (assignment target index not minted)'
};

// --- drops error table (xtrata-drops-v3 header, u200–u231) ---

export const DROPS_ERROR_CODES: Record<number, string> = {
  200: 'ERR-NOT-AUTHORIZED (caller lacks the required role)',
  201: 'ERR-NOT-FOUND (drop/claim/reservation missing)',
  202: 'ERR-INVALID-MODE (mode not in {1,2,3} / eligibility not in {1,2,3})',
  203: 'ERR-INVALID-STATUS (action not allowed in current drop status)',
  204: 'ERR-INVALID-CONFIG (bad create/config parameters)',
  205: 'ERR-INVALID-BATCH (bad batch shape/size)',
  206: "ERR-WRONG-COLLECTION (trait arg is not the drop's collection)",
  207: 'ERR-RANGE-LIMIT (too many range segments for one drop)',
  208: 'ERR-NOT-IN-INVENTORY (escrow/claim index outside drop inventory)',
  209: 'ERR-ALREADY-ESCROWED (index already has an escrowed token)',
  210: 'ERR-NOT-ESCROWED (no escrowed token for index)',
  211: 'ERR-NOT-ACTIVE (drop is not active)',
  212: 'ERR-PAUSED (drop or contract paused)',
  213: 'ERR-WINDOW (outside the claim window)',
  214: 'ERR-SOLD-OUT (no claimable inventory remaining)',
  215: 'ERR-WALLET-LIMIT (per-wallet limit / allowance reached)',
  216: 'ERR-NOT-ALLOWLISTED (wallet not on the drop allowlist)',
  217: 'ERR-SIGNATURE-INVALID (attestation signature invalid)',
  218: 'ERR-ATTESTATION-EXPIRED (attestation expired)',
  219: 'ERR-ATTESTOR-NOT-CONFIGURED (no attestor pubkey hash set)',
  220: 'ERR-ALREADY-CLAIMED (item already claimed)',
  221: 'ERR-ALREADY-RESERVED (claimer already holds a reservation)',
  222: 'ERR-RESERVATION-NOT-EXPIRED (release before expiry)',
  223: 'ERR-INVALID-BUDGET (budget below minimum / zero funding)',
  224: 'ERR-FEE-TOO-LARGE (claim-fee above cap or budget)',
  225: 'ERR-NOT-CLAIMED (fee settlement without unsettled claims)',
  226: 'ERR-REFUND-LOCKED (creator refund before delay)',
  227: 'ERR-PENDING-OWNER (invalid ownership-transfer initiation)',
  228: 'ERR-NO-PENDING-OWNER (accept without a pending transfer)',
  229: 'ERR-ESCROW-INCOMPLETE (activation before full escrow)',
  230: 'ERR-ELIGIBILITY (wrong claim entrypoint for eligibility mode)',
  231: 'ERR-TRANSFER-FAILED (escrow transfer / allowance violation)'
};

const chainErrorMessage = (code: number): string | undefined =>
  COLLECTION_ERROR_CODES[code] ?? DROPS_ERROR_CODES[code];

/** Map a collection/drops/core `(err uNNN)` onto the client error taxonomy. */
export const collectionChainError = (
  code: number,
  detail?: Record<string, unknown>
): XtrataClientError =>
  new XtrataClientError(
    'chain-rejected',
    `Contract rejected transaction: u${code}${
      chainErrorMessage(code) !== undefined ? ` ${chainErrorMessage(code)}` : ''
    }`,
    { chainErrorCode: code, ...(detail !== undefined ? { detail } : {}) }
  );

// --- encoding helpers ---

const badShape = (expected: string, cv: ClarityValue): XtrataClientError =>
  new XtrataClientError('internal', `unexpected clarity shape: expected ${expected}, received ${cvToString(cv)}`);

/** 32-byte content hash → (buff 32). */
export const encodeHash = (contentHashHex: string): BufferCV => {
  const bytes = hexToBytes(contentHashHex);
  if (bytes.length !== 32) {
    throw new XtrataClientError('plan-invalid', `content hash must be 32 bytes, received ${bytes.length}`);
  }
  return Cl.buffer(bytes);
};

/** chunk payload → (list 32 (buff 16384)); bounds enforced. */
export const encodeChunkList = (chunks: readonly Uint8Array[]): ListCV<BufferCV> => {
  if (chunks.length === 0 || chunks.length > MAX_CHUNK_BATCH) {
    throw new XtrataClientError(
      'plan-invalid',
      `chunk batch must contain 1..${MAX_CHUNK_BATCH} chunks, received ${chunks.length}`
    );
  }
  for (const [i, chunk] of chunks.entries()) {
    if (chunk.length === 0 || chunk.length > CHUNK_SIZE) {
      throw new XtrataClientError('plan-invalid', `chunk ${i} has invalid size ${chunk.length}`);
    }
  }
  return Cl.list(chunks.map((c) => Cl.buffer(c)));
};

/** token-id dependency list → (list 50 uint). */
export const encodeUintList = (values: readonly number[], max = 50): ListCV<UIntCV> => {
  if (values.length > max) {
    throw new XtrataClientError('plan-invalid', `list exceeds ${max} entries: ${values.length}`);
  }
  return Cl.list(values.map((v) => Cl.uint(v)));
};

export const encodeOptionalAscii = (value: string | undefined, maxLen: number): ClarityValue => {
  if (value === undefined) return Cl.none();
  if (value.length > maxLen) {
    throw new XtrataClientError('plan-invalid', `string exceeds ${maxLen} chars`);
  }
  return Cl.some(Cl.stringAscii(value));
};

export const encodeSealBatchItems = (
  items: readonly { contentHashHex: string; tokenUri: string }[]
): ListCV<TupleCV> => {
  if (items.length === 0 || items.length > 50) {
    throw new XtrataClientError('plan-invalid', `seal batch must contain 1..50 items, received ${items.length}`);
  }
  return Cl.list(
    items.map((item) =>
      Cl.tuple({ hash: encodeHash(item.contentHashHex), 'token-uri': Cl.stringAscii(item.tokenUri) })
    )
  );
};

// --- decoding primitives ---

export const expectUInt = (cv: ClarityValue): bigint => {
  if (cv.type !== ClarityType.UInt) throw badShape('uint', cv);
  return BigInt((cv as UIntCV).value);
};

export const expectBool = (cv: ClarityValue): boolean => {
  if (cv.type === ClarityType.BoolTrue) return true;
  if (cv.type === ClarityType.BoolFalse) return false;
  throw badShape('bool', cv);
};

export const expectAscii = (cv: ClarityValue): string => {
  if (cv.type !== ClarityType.StringASCII) throw badShape('string-ascii', cv);
  return (cv as StringAsciiCV).value;
};

export const expectBufferHex = (cv: ClarityValue): string => {
  if (cv.type !== ClarityType.Buffer) throw badShape('buff', cv);
  return (cv as BufferCV).value.toLowerCase();
};

export const expectPrincipal = (cv: ClarityValue): string => {
  if (cv.type !== ClarityType.PrincipalStandard && cv.type !== ClarityType.PrincipalContract) {
    throw badShape('principal', cv);
  }
  return cvToString(cv);
};

export const expectTuple = (cv: ClarityValue): Record<string, ClarityValue> => {
  if (cv.type !== ClarityType.Tuple) throw badShape('tuple', cv);
  return (cv as TupleCV).value as Record<string, ClarityValue>;
};

export const expectList = (cv: ClarityValue): ClarityValue[] => {
  if (cv.type !== ClarityType.List) throw badShape('list', cv);
  return [...(cv as ListCV).value];
};

/** (optional T) → T | null. */
export const expectOptional = (cv: ClarityValue): ClarityValue | null => {
  if (cv.type === ClarityType.OptionalNone) return null;
  if (cv.type === ClarityType.OptionalSome) return (cv as SomeCV).value;
  throw badShape('optional', cv);
};

/**
 * (response T uint) → T; an err is normalized to `chain-rejected` with the
 * collection error table applied.
 */
export const expectOk = (cv: ClarityValue): ClarityValue => {
  if (cv.type === ClarityType.ResponseOk) return (cv as ResponseOkCV).value;
  if (cv.type === ClarityType.ResponseErr) {
    const err = (cv as ResponseErrorCV).value;
    if (err.type === ClarityType.UInt) {
      throw collectionChainError(Number((err as UIntCV).value));
    }
    throw new XtrataClientError('chain-rejected', `contract returned err ${cvToString(err)}`);
  }
  throw badShape('response', cv);
};

const tupleField = (tuple: Record<string, ClarityValue>, key: string): ClarityValue => {
  const value = tuple[key];
  if (value === undefined) {
    throw new XtrataClientError('internal', `tuple missing field '${key}'`);
  }
  return value;
};

// --- typed row decoders (shapes from xtrata-collection-v3.clar) ---

export interface SessionRow {
  index: number;
  phaseId: number;
  price: bigint;
  createdAt: number;
  itemUri?: string;
}

/** Sessions row: { index, phase-id, price, created-at, item-uri }. */
export const decodeSession = (cv: ClarityValue): SessionRow | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  const t = expectTuple(inner);
  const itemUri = expectOptional(tupleField(t, 'item-uri'));
  return {
    index: Number(expectUInt(tupleField(t, 'index'))),
    phaseId: Number(expectUInt(tupleField(t, 'phase-id'))),
    price: expectUInt(tupleField(t, 'price')),
    createdAt: Number(expectUInt(tupleField(t, 'created-at'))),
    ...(itemUri !== null ? { itemUri: expectAscii(itemUri) } : {})
  };
};

export interface ItemRow {
  tokenId: number;
  ownerAtMint: string;
  phaseId: number;
  mintedAt: number;
  contentHashHex: string;
}

/** Items row: { token-id, owner-at-mint, phase-id, minted-at, content-hash }. */
export const decodeItem = (cv: ClarityValue): ItemRow | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  const t = expectTuple(inner);
  return {
    tokenId: Number(expectUInt(tupleField(t, 'token-id'))),
    ownerAtMint: expectPrincipal(tupleField(t, 'owner-at-mint')),
    phaseId: Number(expectUInt(tupleField(t, 'phase-id'))),
    mintedAt: Number(expectUInt(tupleField(t, 'minted-at'))),
    contentHashHex: expectBufferHex(tupleField(t, 'content-hash'))
  };
};

/** HashIndex row: (optional { index: uint }) → index | null. */
export const decodeHashIndex = (cv: ClarityValue): number | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  return Number(expectUInt(tupleField(expectTuple(inner), 'index')));
};

export interface CollectionInfo {
  name: string;
  symbol: string;
  description: string;
  artworkUri: string;
  baseUri: string;
  owner: string;
  operatorAdmin: string;
  financeAdmin: string;
  supplyMode: number;
  maxSupply: number;
  mintedCount: number;
  reservedCount: number;
  nextIndex: number;
  freeCount: number;
  mintPrice: bigint;
  activePhaseId: number;
  reservationExpiryBlocks: number;
  paused: boolean;
  finalized: boolean;
  dropsAuthority: string | null;
  coreContract: string;
}

/** get-collection-info (ok { ...twenty-one fields }). */
export const decodeCollectionInfo = (cv: ClarityValue): CollectionInfo => {
  const t = expectTuple(expectOk(cv));
  const dropsAuthority = expectOptional(tupleField(t, 'drops-authority'));
  return {
    name: expectAscii(tupleField(t, 'name')),
    symbol: expectAscii(tupleField(t, 'symbol')),
    description: expectAscii(tupleField(t, 'description')),
    artworkUri: expectAscii(tupleField(t, 'artwork-uri')),
    baseUri: expectAscii(tupleField(t, 'base-uri')),
    owner: expectPrincipal(tupleField(t, 'owner')),
    operatorAdmin: expectPrincipal(tupleField(t, 'operator-admin')),
    financeAdmin: expectPrincipal(tupleField(t, 'finance-admin')),
    supplyMode: Number(expectUInt(tupleField(t, 'supply-mode'))),
    maxSupply: Number(expectUInt(tupleField(t, 'max-supply'))),
    mintedCount: Number(expectUInt(tupleField(t, 'minted-count'))),
    reservedCount: Number(expectUInt(tupleField(t, 'reserved-count'))),
    nextIndex: Number(expectUInt(tupleField(t, 'next-index'))),
    freeCount: Number(expectUInt(tupleField(t, 'free-count'))),
    mintPrice: expectUInt(tupleField(t, 'mint-price')),
    activePhaseId: Number(expectUInt(tupleField(t, 'active-phase-id'))),
    reservationExpiryBlocks: Number(expectUInt(tupleField(t, 'reservation-expiry-blocks'))),
    paused: expectBool(tupleField(t, 'paused')),
    finalized: expectBool(tupleField(t, 'finalized')),
    dropsAuthority: dropsAuthority !== null ? expectPrincipal(dropsAuthority) : null,
    coreContract: expectPrincipal(tupleField(t, 'core-contract'))
  };
};

export interface ScanEntry {
  index: number;
  minted: boolean;
  assigned: boolean;
}

/** get-unassigned-scan (ok (list 50 { index, minted, assigned })). */
export const decodeUnassignedScan = (cv: ClarityValue): ScanEntry[] =>
  expectList(expectOk(cv)).map((entry) => {
    const t = expectTuple(entry);
    return {
      index: Number(expectUInt(tupleField(t, 'index'))),
      minted: expectBool(tupleField(t, 'minted')),
      assigned: expectBool(tupleField(t, 'assigned'))
    };
  });

export interface PhaseRow {
  enabled: boolean;
  startBlock: number;
  endBlock: number;
  mintPrice: bigint;
  maxPerWallet: number;
  maxSupply: number;
  allowlistMode: number;
}

export const decodePhase = (cv: ClarityValue): PhaseRow | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  const t = expectTuple(inner);
  return {
    enabled: expectBool(tupleField(t, 'enabled')),
    startBlock: Number(expectUInt(tupleField(t, 'start-block'))),
    endBlock: Number(expectUInt(tupleField(t, 'end-block'))),
    mintPrice: expectUInt(tupleField(t, 'mint-price')),
    maxPerWallet: Number(expectUInt(tupleField(t, 'max-per-wallet'))),
    maxSupply: Number(expectUInt(tupleField(t, 'max-supply'))),
    allowlistMode: Number(expectUInt(tupleField(t, 'allowlist-mode')))
  };
};

export interface MintedReserved {
  minted: number;
  reserved: number;
}

/** (ok { minted, reserved }) — phase stats / wallet stats. */
export const decodeMintedReserved = (cv: ClarityValue): MintedReserved => {
  const t = expectTuple(expectOk(cv));
  return {
    minted: Number(expectUInt(tupleField(t, 'minted'))),
    reserved: Number(expectUInt(tupleField(t, 'reserved')))
  };
};

export interface AssignmentRow {
  dropContract: string;
  dropId: number;
  assignedAt: number;
}

export const decodeAssignment = (cv: ClarityValue): AssignmentRow | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  const t = expectTuple(inner);
  return {
    dropContract: expectPrincipal(tupleField(t, 'drop-contract')),
    dropId: Number(expectUInt(tupleField(t, 'drop-id'))),
    assignedAt: Number(expectUInt(tupleField(t, 'assigned-at')))
  };
};

export interface UploadStateRow {
  mimeType: string;
  totalSize: number;
  totalChunks: number;
  currentIndex: number;
  runningHashHex: string;
}

/** Core get-upload-state: (optional { mime-type, total-size, total-chunks, current-index, running-hash }). */
export const decodeUploadState = (cv: ClarityValue): UploadStateRow | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  const t = expectTuple(inner);
  return {
    mimeType: expectAscii(tupleField(t, 'mime-type')),
    totalSize: Number(expectUInt(tupleField(t, 'total-size'))),
    totalChunks: Number(expectUInt(tupleField(t, 'total-chunks'))),
    currentIndex: Number(expectUInt(tupleField(t, 'current-index'))),
    runningHashHex: expectBufferHex(tupleField(t, 'running-hash'))
  };
};

/** Core get-id-by-hash: (optional uint) → token id | null. */
export const decodeOptionalUint = (cv: ClarityValue): number | null => {
  const inner = expectOptional(cv);
  return inner === null ? null : Number(expectUInt(inner));
};

/** (ok uint) → bigint — e.g. get-free-count, close-supply result. */
export const decodeOkUint = (cv: ClarityValue): bigint => expectUInt(expectOk(cv));

/** (ok (list 50 uint)) → number[] — get-default-dependencies. */
export const decodeOkUintList = (cv: ClarityValue): number[] =>
  expectList(expectOk(cv)).map((v) => Number(expectUInt(v)));

/** RegisteredTokenUris row → token uri | null. */
export const decodeRegisteredTokenUri = (cv: ClarityValue): string | null => {
  const inner = expectOptional(cv);
  if (inner === null) return null;
  return expectAscii(tupleField(expectTuple(inner), 'token-uri'));
};
