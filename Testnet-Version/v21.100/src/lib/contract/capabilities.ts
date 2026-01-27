export type ProtocolVersion = '9.2.14' | '9.2.17' | '1.0.5' | '1.1.0';

export const PROTOCOL_VERSIONS = ['9.2.14', '9.2.17', '1.0.5', '1.1.0'] as const;

export const isProtocolVersion = (value: string): value is ProtocolVersion =>
  PROTOCOL_VERSIONS.includes(value as ProtocolVersion);

export type ContractCapabilities = {
  version: ProtocolVersion;
  feeModel: 'fixed' | 'fee-unit';
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
};

const CAPABILITIES_BY_VERSION: Record<ProtocolVersion, ContractCapabilities> = {
  '9.2.14': {
    version: '9.2.14',
    feeModel: 'fixed',
    supportsFeeUnit: false,
    supportsPause: false,
    supportsAdminReadOnly: false,
    supportsRoyaltyRecipientRead: false,
    supportsOwnershipTransfer: false,
    supportsAbandonUpload: false,
    supportsChunkBatchRead: false,
    pendingChunkRequiresCreator: false,
    metaHasCreator: false,
    supportsNextTokenId: false
  },
  '9.2.17': {
    version: '9.2.17',
    feeModel: 'fee-unit',
    supportsFeeUnit: true,
    supportsPause: true,
    supportsAdminReadOnly: true,
    supportsRoyaltyRecipientRead: true,
    supportsOwnershipTransfer: true,
    supportsAbandonUpload: true,
    supportsChunkBatchRead: false,
    pendingChunkRequiresCreator: true,
    metaHasCreator: true,
    supportsNextTokenId: true
  },
  '1.0.5': {
    version: '1.0.5',
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
    supportsNextTokenId: true
  },
  '1.1.0': {
    version: '1.1.0',
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
    supportsNextTokenId: true
  }
};

const inferProtocolVersion = (contractName: string): ProtocolVersion | null => {
  const normalized = contractName.toLowerCase();
  if (normalized.includes('v9-2-17') || normalized.includes('v9.2.17')) {
    return '9.2.17';
  }
  if (normalized.includes('v9-2-14') || normalized.includes('v9.2.14')) {
    return '9.2.14';
  }
  if (normalized.includes('v1-0-5') || normalized.includes('v1.0.5')) {
    return '1.0.5';
  }
  if (normalized.includes('v1-1-0') || normalized.includes('v1.1.0')) {
    return '1.1.0';
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
  return CAPABILITIES_BY_VERSION['9.2.14'];
};
