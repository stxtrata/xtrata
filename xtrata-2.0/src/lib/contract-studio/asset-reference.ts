import { createXtrataClient } from '../contract/client';
import { getContractId, parseContractId } from '../contract/config';
import { bytesToHex } from '../utils/encoding';
import type { XtrataAssetRef } from './model';

export const resolveXtrataAssetRef = async (params: {
  coreContractId: string;
  tokenId: string;
  senderAddress?: string;
}): Promise<XtrataAssetRef> => {
  const contract = parseContractId(params.coreContractId);
  if (!contract) {
    throw new Error('Enter a valid Stacks contract principal.');
  }
  if (!/^(0|[1-9]\d*)$/.test(params.tokenId.trim())) {
    throw new Error('Token id must be a non-negative integer.');
  }
  const tokenId = BigInt(params.tokenId.trim());
  const sender = params.senderAddress?.trim() || contract.address;
  const client = createXtrataClient({ contract });
  const [meta, owner, parents, dependencies, contractInfo] = await Promise.all([
    client.getInscriptionMeta(tokenId, sender),
    client.getOwner(tokenId, sender),
    client.getParents(tokenId, sender).catch(() => []),
    client.getDependencies(tokenId, sender).catch(() => []),
    client.getContractInfo(sender)
  ]);
  if (!meta || !owner) {
    throw new Error('No inscription exists at this core contract and token id.');
  }
  if (!meta.sealed) {
    throw new Error('The inscription exists but is not sealed.');
  }
  return {
    network: contract.network,
    coreContractId: getContractId(contract),
    tokenId: tokenId.toString(),
    contentHash: bytesToHex(meta.finalHash),
    creator: meta.creator ?? owner,
    owner,
    mimeType: meta.mimeType,
    totalSize: meta.totalSize.toString(),
    parents: parents.map(String),
    dependencies: dependencies.map(String),
    protocolVersion: contractInfo.version
  };
};

