import { getNetworkFromAddress } from '../network/guard';
import { parseContractPrincipal } from './contract-link';

export type CoverImageSource =
  | 'collection-asset'
  | 'inscribed-image-url'
  | 'inscription-id';

export type CollectionCoverInscriptionReference = {
  coreContractId: string;
  tokenId: string;
  mimeType: string | null;
  preferDataUriRender: boolean;
};

const UINT_PATTERN = /^\d+$/;

const toRecord = (value: unknown) =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const toText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

export const normalizeCoverImageSource = (
  value: unknown
): CoverImageSource | null => {
  if (value === 'collection-asset') {
    return 'collection-asset';
  }
  if (value === 'inscribed-image-url') {
    return 'inscribed-image-url';
  }
  if (value === 'inscription-id') {
    return 'inscription-id';
  }
  return null;
};

export const parseInscriptionTokenId = (value: unknown): string | null => {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
      return null;
    }
    return BigInt(value).toString();
  }
  if (typeof value === 'bigint') {
    return value >= 0n ? value.toString() : null;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!UINT_PATTERN.test(trimmed)) {
    return null;
  }
  try {
    return BigInt(trimmed).toString();
  } catch {
    return null;
  }
};

export const isSvgCoverImageMimeType = (value: unknown) =>
  toText(value).toLowerCase() === 'image/svg+xml';

/**
 * What an on-chain inscription can be used as a collection cover.
 *  - image: shown as an <img>
 *  - html:  shown live in a sandboxed runtime frame (animated or recursive covers)
 *  - script / other: cannot display on its own; a page has to load it
 */
export type CoverMimeKind = 'image' | 'html' | 'script' | 'unsupported';

const SCRIPT_MIME_TYPES = new Set([
  'text/javascript',
  'application/javascript',
  'application/x-javascript',
  'text/ecmascript',
  'application/ecmascript'
]);

export const classifyCoverMimeType = (value: unknown): CoverMimeKind => {
  const mimeType = toText(value).toLowerCase().split(';')[0].trim();
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType === 'text/html' || mimeType === 'application/xhtml+xml') {
    return 'html';
  }
  if (SCRIPT_MIME_TYPES.has(mimeType)) {
    return 'script';
  }
  return 'unsupported';
};

/** Null when the inscription can be a cover, else a plain-language reason. */
export const coverInscriptionMimeProblem = (tokenId: string, mimeType: unknown) => {
  const kind = classifyCoverMimeType(mimeType);
  if (kind === 'image' || kind === 'html') {
    return null;
  }
  const shown = toText(mimeType) || 'unknown';
  if (kind === 'script') {
    return `Inscription #${tokenId} is a script (${shown}). A script can't be shown on its own — it needs a page that loads it. Use an image or HTML inscription instead, for example the HTML page (or one of your items) that loads this script.`;
  }
  return `Inscription #${tokenId} is ${shown}. Covers can be an image or an HTML inscription.`;
};

const parseRuntimeContentUrl = (value: unknown) => {
  const imageUrl = toText(value);
  if (!imageUrl) {
    return null;
  }
  try {
    const parsed = new URL(imageUrl, 'https://xtrata.local');
    if (parsed.pathname !== '/runtime/content') {
      return null;
    }
    const coreContractId = toText(parsed.searchParams.get('contractId'));
    const tokenId = parseInscriptionTokenId(parsed.searchParams.get('tokenId'));
    if (!coreContractId || !tokenId) {
      return null;
    }
    return {
      coreContractId,
      tokenId
    };
  } catch {
    return null;
  }
};

export const resolveCollectionCoverInscriptionReference = (params: {
  coverImage: unknown;
  fallbackCoreContractId?: string | null;
}): CollectionCoverInscriptionReference | null => {
  const coverImage = toRecord(params.coverImage);
  if (!coverImage) {
    return null;
  }
  const source = normalizeCoverImageSource(coverImage.source);
  if (source === 'inscription-id') {
    const tokenId = parseInscriptionTokenId(
      coverImage.tokenId ?? coverImage.inscriptionId
    );
    const coreContractId =
      toText(coverImage.coreContractId) || toText(params.fallbackCoreContractId);
    if (!tokenId || !coreContractId) {
      return null;
    }
    return {
      coreContractId,
      tokenId,
      mimeType: toText(coverImage.mimeType) || null,
      preferDataUriRender: isSvgCoverImageMimeType(coverImage.mimeType)
    };
  }
  if (source !== 'inscribed-image-url') {
    return null;
  }
  const runtimeContentTarget = parseRuntimeContentUrl(coverImage.imageUrl);
  if (!runtimeContentTarget) {
    return null;
  }
  return {
    coreContractId: runtimeContentTarget.coreContractId,
    tokenId: runtimeContentTarget.tokenId,
    mimeType: toText(coverImage.mimeType) || null,
    preferDataUriRender: true
  };
};

export const buildRuntimeInscriptionContentUrl = (params: {
  coreContractId: string | null | undefined;
  tokenId: unknown;
}) => {
  const parsedContract = parseContractPrincipal(toText(params.coreContractId));
  const parsedTokenId = parseInscriptionTokenId(params.tokenId);
  if (!parsedContract || !parsedTokenId) {
    return null;
  }
  const contractId = `${parsedContract.address}.${parsedContract.contractName}`;
  const network = getNetworkFromAddress(parsedContract.address) ?? 'mainnet';
  const query = new URLSearchParams({
    contractId,
    tokenId: parsedTokenId,
    network
  });
  return `/runtime/content?${query.toString()}`;
};

export const resolveCollectionCoverImageUrl = (params: {
  coverImage: unknown;
  collectionId?: string | null;
  fallbackCoreContractId?: string | null;
}) => {
  const coverImage = toRecord(params.coverImage);
  if (!coverImage) {
    return null;
  }
  const source = normalizeCoverImageSource(coverImage.source);
  if (!source) {
    return null;
  }

  if (source === 'collection-asset') {
    const collectionId = toText(params.collectionId);
    const assetId = toText(coverImage.assetId);
    if (!collectionId || !assetId) {
      return null;
    }
    const query = new URLSearchParams({
      assetId,
      purpose: 'cover'
    });
    return `/collections/${encodeURIComponent(collectionId)}/asset-preview?${query.toString()}`;
  }

  if (source === 'inscribed-image-url') {
    const imageUrl = toText(coverImage.imageUrl);
    return imageUrl || null;
  }

  const runtimeUrl = buildRuntimeInscriptionContentUrl({
    coreContractId: toText(coverImage.coreContractId) || params.fallbackCoreContractId,
    tokenId: coverImage.tokenId ?? coverImage.inscriptionId
  });
  if (runtimeUrl) {
    return runtimeUrl;
  }
  const fallbackImageUrl = toText(coverImage.imageUrl);
  return fallbackImageUrl || null;
};

export const hasCoverImageMetadata = (value: unknown) => {
  const coverImage = toRecord(value);
  if (!coverImage) {
    return false;
  }
  const source = normalizeCoverImageSource(coverImage.source);
  if (source === 'collection-asset') {
    return toText(coverImage.assetId).length > 0;
  }
  if (source === 'inscribed-image-url') {
    return toText(coverImage.imageUrl).length > 0;
  }
  if (source === 'inscription-id') {
    return (
      parseInscriptionTokenId(coverImage.tokenId ?? coverImage.inscriptionId) !==
      null
    );
  }
  return false;
};
