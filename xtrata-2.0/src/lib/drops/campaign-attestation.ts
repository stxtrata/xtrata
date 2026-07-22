import {
  bufferCV,
  contractPrincipalCV,
  createMessageSignature,
  createStacksPrivateKey,
  getPublicKey,
  hash160,
  noneCV,
  principalCV,
  publicKeyFromSignatureRsv,
  publicKeyToString,
  serializeCV,
  signMessageHashRsv,
  someCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';

export const DROPS_V11_MAINNET_CONTRACT_ID =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-drops-v1-1';
export const STACKS_MAINNET_CHAIN_ID = 1n;
export const CAMPAIGN_ATTESTATION_TTL_BLOCKS = 20n;

export type CampaignAttestationPayload = {
  contractId: string;
  campaignId: bigint;
  dropId: bigint;
  claimer: string;
  bnsKeyHex: string | null;
  expiresAt: bigint;
  chainId?: bigint;
};

const canonicalHex = (value: string, bytes?: number) => {
  const hex = value.trim().replace(/^0x/i, '').toLowerCase();
  if (!/^[0-9a-f]+$/.test(hex) || hex.length % 2 !== 0 || (bytes && hex.length !== bytes * 2)) {
    throw new Error(
      bytes ? `Expected ${bytes}-byte hexadecimal value` : 'Expected hexadecimal value'
    );
  }
  return hex;
};

export const campaignHexToBytes = (value: string, bytes?: number) => {
  const hex = canonicalHex(value, bytes);
  const output = new Uint8Array(hex.length / 2);
  for (let index = 0; index < output.length; index += 1) {
    output[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return output;
};

export const campaignBytesToHex = (value: ArrayLike<number>) => {
  let output = '';
  for (let index = 0; index < value.length; index += 1) {
    output += Number(value[index]).toString(16).padStart(2, '0');
  }
  return output;
};

const splitContractId = (contractId: string) => {
  const [address, contractName, extra] = contractId.split('.');
  if (!address || !contractName || extra) throw new Error('Invalid contract principal');
  return { address, contractName };
};

export const buildCampaignAttestationCV = (payload: CampaignAttestationPayload) => {
  const contract = splitContractId(payload.contractId);
  const bnsKey = payload.bnsKeyHex
    ? someCV(bufferCV(campaignHexToBytes(payload.bnsKeyHex, 32)))
    : noneCV();
  return tupleCV({
    'bns-key': bnsKey,
    'campaign-id': uintCV(payload.campaignId),
    'chain-id': uintCV(payload.chainId ?? STACKS_MAINNET_CHAIN_ID),
    claimer: principalCV(payload.claimer),
    contract: contractPrincipalCV(contract.address, contract.contractName),
    'drop-id': uintCV(payload.dropId),
    'expires-at': uintCV(payload.expiresAt)
  });
};

export const serializeCampaignAttestation = (payload: CampaignAttestationPayload) => {
  const serialized = serializeCV(buildCampaignAttestationCV(payload));
  if (typeof serialized === 'string') return campaignHexToBytes(serialized);
  if (serialized instanceof Uint8Array) return serialized;
  throw new Error('Unexpected Clarity serialization result');
};

const sha256 = async (bytes: Uint8Array) =>
  new Uint8Array(await crypto.subtle.digest('SHA-256', bytes as BufferSource));

export const campaignAttestationDigest = async (payload: CampaignAttestationPayload) =>
  sha256(serializeCampaignAttestation(payload));

export const bnsNameKey = async (name: string) =>
  campaignBytesToHex(await sha256(new TextEncoder().encode(name.trim().toLowerCase())));

export const attestorPubkeyHash = (privateKey: string) => {
  const key = canonicalHex(privateKey);
  if (key.length !== 64 && key.length !== 66) throw new Error('Invalid attestor private key');
  const publicKey = publicKeyToString(getPublicKey(createStacksPrivateKey(key)));
  return campaignBytesToHex(hash160(campaignHexToBytes(publicKey)));
};

export const signCampaignAttestation = async (
  payload: CampaignAttestationPayload,
  privateKey: string
) => {
  const digest = await campaignAttestationDigest(payload);
  return signMessageHashRsv({
    messageHash: campaignBytesToHex(digest),
    privateKey: createStacksPrivateKey(canonicalHex(privateKey))
  }).data;
};

export const verifyCampaignAttestation = async (
  payload: CampaignAttestationPayload,
  signatureHex: string,
  expectedPubkeyHash: string
) => {
  try {
    const digest = await campaignAttestationDigest(payload);
    const publicKey = publicKeyFromSignatureRsv(
      campaignBytesToHex(digest),
      createMessageSignature(canonicalHex(signatureHex, 65))
    );
    const recoveredHash = campaignBytesToHex(hash160(campaignHexToBytes(publicKey)));
    return recoveredHash === canonicalHex(expectedPubkeyHash, 20);
  } catch {
    return false;
  }
};
