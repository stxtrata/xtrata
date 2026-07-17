export type ProtocolVersion =
  | '1.1.1'
  | '2.1.0'
  | '2.1.1'
  | '3.0.0'
  | '3.2.3'
  | '3.4.0';

export const PROTOCOL_VERSIONS = [
  '1.1.1',
  '2.1.0',
  '2.1.1',
  '3.0.0',
  '3.2.3',
  '3.4.0'
] as const;

export const isProtocolVersion = (value: string): value is ProtocolVersion =>
  PROTOCOL_VERSIONS.includes(value as ProtocolVersion);

export type ContractCapabilities = {
  version: ProtocolVersion;
  feeModel: 'fee-unit';
  supportsFeeUnit: boolean;
  supportsPause: boolean;
  supportsAdminReadOnly: boolean;
  supportsRoyaltyRecipientRead: boolean;
  supportsOwnershipTransfer: boolean;
  supportsAbandonUpload: boolean;
  supportsChunkBatchRead: boolean;
  pendingChunkRequiresCreator: boolean;
  metaHasCreator: boolean;
  supportsNextTokenId: boolean;
  supportsMintedIndex: boolean;
  supportsRelationships: boolean;
  // The core has its own one-transaction mint-single-tx route. When true, small
  // mints must use the core directly rather than the external small-mint helper
  // (which is bound to a specific older core).
  supportsNativeSingleTx: boolean;
  // Whether the core accepts a non-STX SIP-010 asset (sBTC, USDCx, USDT, ...)
  // as the protocol-fee payment. No shipped core version supports this yet, so
  // the multi-asset payment picker stays hidden until a core exposes it. See
  // contracts/MULTI-ASSET-PAYMENT-FOLLOWUP.md.
  supportsMultiAssetPayment: boolean;
};

const CAPABILITIES_BY_VERSION: Record<ProtocolVersion, ContractCapabilities> = {
  '1.1.1': {
    version: '1.1.1',
    feeModel: 'fee-unit',
    supportsFeeUnit: true,
    supportsPause: true,
    supportsAdminReadOnly: true,
    supportsRoyaltyRecipientRead: true,
    supportsOwnershipTransfer: true,
    supportsAbandonUpload: true,
    supportsChunkBatchRead: true,
    pendingChunkRequiresCreator: true,
    metaHasCreator: true,
    supportsNextTokenId: true,
    supportsMintedIndex: false,
    supportsRelationships: false,
    supportsNativeSingleTx: false,
    supportsMultiAssetPayment: false
  },
  '2.1.0': {
    version: '2.1.0',
    feeModel: 'fee-unit',
    supportsFeeUnit: true,
    supportsPause: true,
    supportsAdminReadOnly: true,
    supportsRoyaltyRecipientRead: true,
    supportsOwnershipTransfer: true,
    supportsAbandonUpload: true,
    supportsChunkBatchRead: true,
    pendingChunkRequiresCreator: true,
    metaHasCreator: true,
    supportsNextTokenId: true,
    supportsMintedIndex: true,
    supportsRelationships: false,
    supportsNativeSingleTx: false,
    supportsMultiAssetPayment: false
  },
  '2.1.1': {
    version: '2.1.1',
    feeModel: 'fee-unit',
    supportsFeeUnit: true,
    supportsPause: true,
    supportsAdminReadOnly: true,
    supportsRoyaltyRecipientRead: true,
    supportsOwnershipTransfer: true,
    supportsAbandonUpload: true,
    supportsChunkBatchRead: true,
    pendingChunkRequiresCreator: true,
    metaHasCreator: true,
    supportsNextTokenId: true,
    supportsMintedIndex: true,
    supportsRelationships: false,
    supportsNativeSingleTx: false,
    supportsMultiAssetPayment: false
  },
  '3.0.0': {
    version: '3.0.0',
    feeModel: 'fee-unit',
    supportsFeeUnit: true,
    supportsPause: true,
    supportsAdminReadOnly: true,
    supportsRoyaltyRecipientRead: true,
    supportsOwnershipTransfer: true,
    supportsAbandonUpload: true,
    supportsChunkBatchRead: true,
    pendingChunkRequiresCreator: true,
    metaHasCreator: true,
    supportsNextTokenId: true,
    supportsMintedIndex: true,
    supportsRelationships: true,
    supportsNativeSingleTx: true,
    supportsMultiAssetPayment: false
  },
  '3.2.3': {
    version: '3.2.3',
    feeModel: 'fee-unit',
    supportsFeeUnit: true,
    supportsPause: true,
    supportsAdminReadOnly: true,
    supportsRoyaltyRecipientRead: true,
    supportsOwnershipTransfer: true,
    supportsAbandonUpload: true,
    supportsChunkBatchRead: true,
    pendingChunkRequiresCreator: true,
    metaHasCreator: true,
    supportsNextTokenId: true,
    supportsMintedIndex: true,
    supportsRelationships: true,
    supportsNativeSingleTx: true,
    supportsMultiAssetPayment: false
  },
  '3.4.0': {
    version: '3.4.0',
    feeModel: 'fee-unit',
    supportsFeeUnit: true,
    supportsPause: true,
    supportsAdminReadOnly: true,
    supportsRoyaltyRecipientRead: true,
    supportsOwnershipTransfer: true,
    supportsAbandonUpload: true,
    supportsChunkBatchRead: true,
    pendingChunkRequiresCreator: true,
    metaHasCreator: true,
    supportsNextTokenId: true,
    supportsMintedIndex: true,
    supportsRelationships: true,
    supportsNativeSingleTx: true,
    supportsMultiAssetPayment: false
  }
};

const inferProtocolVersion = (contractName: string): ProtocolVersion | null => {
  const normalized = contractName.toLowerCase();
  if (normalized.includes('v1-1-1') || normalized.includes('v1.1.1')) {
    return '1.1.1';
  }
  if (normalized.includes('v2-1-0') || normalized.includes('v2.1.0')) {
    return '2.1.0';
  }
  if (normalized.includes('v2-1-1') || normalized.includes('v2.1.1')) {
    return '2.1.1';
  }
  if (normalized.includes('v3-0-0') || normalized.includes('v3.0.0')) {
    return '3.0.0';
  }
  if (
    normalized.includes('v3-2-3') ||
    normalized.includes('v3.2.3') ||
    normalized.includes('v3-2-2') ||
    normalized.includes('v3.2.2')
  ) {
    return '3.2.3';
  }
  if (normalized.includes('v3-4-0') || normalized.includes('v3.4.0')) {
    return '3.4.0';
  }
  return null;
};

export const resolveContractCapabilities = (contract: {
  protocolVersion?: string;
  contractName?: string;
}): ContractCapabilities => {
  if (contract.protocolVersion && isProtocolVersion(contract.protocolVersion)) {
    return CAPABILITIES_BY_VERSION[contract.protocolVersion];
  }
  if (contract.contractName) {
    const inferred = inferProtocolVersion(contract.contractName);
    if (inferred) {
      return CAPABILITIES_BY_VERSION[inferred];
    }
  }
  return CAPABILITIES_BY_VERSION['1.1.1'];
};
