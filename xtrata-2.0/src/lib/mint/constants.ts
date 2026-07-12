import { MAX_UPLOAD_BATCH_SIZE } from '../chunking/hash';

export const DEFAULT_BATCH_SIZE = MAX_UPLOAD_BATCH_SIZE;
export const TX_DELAY_SECONDS = 5;
// Xtrata's shared default metadata JSON (hosted on ArDrive). This is inscribed
// ONLY when the user affirmatively selects "Use Xtrata default metadata" in the
// mint flow — it is never silently substituted for a blank field. See
// src/screens/mint/token-uri.ts (resolveMintTokenUri).
export const DEFAULT_TOKEN_URI =
  'https://yfa7uhk4vmrr3jjwr57fnm6ccvwi2r2ycufcjs6nsmrpjmr25azq.ardrive.net/wUH6HVyrIx2lNo9-VrPCFWyNR1gVCiTLzZMi9LI66DM';
// Text-inscription MIME presets for the "Paste text" flow. Kept here so the
// wizard/mint text path and the embedded /inscribe single-tx text path share one
// source of truth for the on-chain mime + a sensible default filename/extension.
export interface TextMimePreset {
  label: string;
  mime: string;
  extension: string;
}
export const TEXT_MIME_PRESETS: TextMimePreset[] = [
  { label: 'Plain text', mime: 'text/plain', extension: 'txt' },
  { label: 'JSON', mime: 'application/json', extension: 'json' },
  { label: 'Markdown', mime: 'text/markdown', extension: 'md' },
  { label: 'HTML', mime: 'text/html', extension: 'html' }
];
export const DEFAULT_TEXT_MIME = TEXT_MIME_PRESETS[0].mime;
export const defaultTextFileName = (mime: string): string => {
  const preset = TEXT_MIME_PRESETS.find((entry) => entry.mime === mime);
  return `inscription.${preset?.extension ?? 'txt'}`;
};

export const MAX_TOKEN_URI_LENGTH = 256;
export const MAX_MIME_LENGTH = 64;
export const SMALL_MINT_HELPER_MAX_CHUNKS = 30;
export const SMALL_MINT_HELPER_MAINNET_ADDRESS =
  'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
export const SMALL_MINT_HELPER_CONTRACT_NAME = 'xtrata-small-mint-v1-0';
export const SIP16_TOKEN_ID_PLACEHOLDER = '{id}';
export const SIP16_RESOLVER_HOST_PLACEHOLDER = '{resolver-host}';
export const SIP16_PREVIEW_HOST_PLACEHOLDER = '{preview-host}';
export const SIP16_COLLECTION_NAME = 'xtrata';
export const SIP16_COLLECTION_SYMBOL = 'XTRATA';
export const SIP16_PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA1MCA1MCc+PGNpcmNsZSBjeD0nMjUnIGN5PScyNScgcj0nMjAnIGZpbGw9J25vbmUnIHN0cm9rZT0nIzYzNjZmMScgc3Ryb2tlLXdpZHRoPSc0Jy8+PGNpcmNsZSBjeD0nMjUnIGN5PScyNScgcj0nMTInIGZpbGw9J25vbmUnIHN0cm9rZT0nI2VjNDg5OScgc3Ryb2tlLXdpZHRoPSc0Jy8+PC9zdmc+';
