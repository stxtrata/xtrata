import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { showContractCall } from '../lib/wallet/connect';
import {
  bufferCV,
  type ClarityValue,
  FungibleConditionCode,
  listCV,
  makeStandardSTXPostCondition,
  principalCV,
  PostConditionMode,
  type PostCondition,
  stringAsciiCV,
  uintCV
} from '@stacks/transactions';
import { getLegacyContract, type ContractRegistryEntry } from '../lib/contract/registry';
import type { WalletSession } from '../lib/wallet/types';
import {
  batchChunks,
  chunkBytes,
  computeExpectedHash,
  CHUNK_SIZE,
  MAX_BATCH_SIZE,
  MAX_UPLOAD_BATCH_SIZE
} from '../lib/chunking/hash';
import { createSelectionGuard } from './mint/selection-guard';
import {
  resolveMintTokenUri,
  type TokenUriChoice
} from './mint/token-uri';
import { bytesToHex } from '../lib/utils/encoding';
import { formatBytes } from '../lib/utils/format';
import { logInfo, logWarn } from '../lib/utils/logger';
import { getNetworkMismatch } from '../lib/network/guard';
import { getApiBaseUrl } from '../lib/network/config';
import { getContractId, type ContractConfig } from '../lib/contract/config';
import { resolveContractCapabilities } from '../lib/contract/capabilities';
import { useContractAdminStatus } from '../lib/contract/admin-status';
import { createXtrataClient } from '../lib/contract/client';
import { useTokenSummaries, useTokenExistence } from '../lib/viewer/queries';
import {
  DEFAULT_BATCH_SIZE,
  DEFAULT_TOKEN_URI,
  DEFAULT_TEXT_MIME,
  TEXT_MIME_PRESETS,
  defaultTextFileName,
  MAX_MIME_LENGTH,
  MAX_TOKEN_URI_LENGTH,
  SIP16_COLLECTION_NAME,
  SIP16_COLLECTION_SYMBOL,
  SIP16_PLACEHOLDER_IMAGE,
  SIP16_PREVIEW_HOST_PLACEHOLDER,
  SIP16_RESOLVER_HOST_PLACEHOLDER,
  SIP16_TOKEN_ID_PLACEHOLDER,
  SMALL_MINT_HELPER_MAINNET_ADDRESS,
  SMALL_MINT_HELPER_CONTRACT_NAME,
  SMALL_MINT_HELPER_MAX_CHUNKS,
  TX_DELAY_SECONDS
} from '../lib/mint/constants';
import {
  estimateDataMiningFeeMicroStx,
  estimateSequentialMintTransactions
} from '../lib/mint/estimates';
import {
  clearMintAttempt,
  loadMintAttempt,
  saveMintAttempt,
  type MintAttempt
} from '../lib/mint/attempt-cache';
import { resolveInscriptionMimeType } from '../lib/mint/mime';
import {
  fromDependencyStrings,
  mergeDependencySources,
  parseDependencyInput,
  toDependencyStrings,
  validateDependencyIds
} from '../lib/mint/dependencies';
import {
  estimateContractFeeCaps,
  estimateContractFees,
  firstBatchChunks,
  formatMicroStx,
  getFeeSchedule,
  MICROSTX_PER_STX
} from '../lib/contract/fees';
import { formatMicroStxWithUsd } from '../lib/pricing/format';
import { useUsdPriceBook } from '../lib/pricing/hooks';
import {
  computeUsdFromBaseUnits,
  formatFiat,
  useDisplayCurrency,
  useGbpPerUsd
} from '../lib/pricing/fiat';
import { getAvailablePaymentAssets } from '../lib/contract/payment-assets';
import type { UsdPriceBook } from '../lib/pricing/types';
import type { InscriptionMeta, UploadState } from '../lib/protocol/types';
import TokenCardMedia from '../components/TokenCardMedia';
import type { TokenSummary } from '../lib/viewer/types';

type MintScreenProps = {
  contract: ContractRegistryEntry;
  walletSession: WalletSession;
  onInscriptionSealed?: (payload: { txId: string }) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  parentDraftIds?: bigint[];
  onClearParentDrafts?: () => void;
  restrictions?: MintRestrictions;
  usdPriceBook?: UsdPriceBook | null;
};

type StepState = 'idle' | 'pending' | 'done' | 'error';

type TxPayload = {
  txId: string;
};

type MintRestrictions = {
  fixedBatchSize?: number;
  fixedTokenUri?: string;
  maxFileBytes?: number;
  hideDelegate?: boolean;
  hideTokenUri?: boolean;
  hideBatchSize?: boolean;
  hideMetadataTools?: boolean;
  hideFeeRateFetch?: boolean;
  disableDuplicateOverride?: boolean;
};

type Sip16MetadataParams = {
  contractId: string;
  contractName: string;
  collectionName: string;
  collectionSymbol: string;
  network: string;
  protocolVersion: string;
  fileName: string;
  mimeType: string;
  totalBytes: number;
  totalChunks: number;
  expectedHashHex: string;
  creator: string | null;
  dependencies: bigint[];
  parents: bigint[];
};

const BATCH_OPTIONS = Array.from(
  { length: MAX_UPLOAD_BATCH_SIZE },
  (_, index) => index + 1
);
const MAX_UPLOAD_RETRIES = 3;
// How many relationship previews to fetch per "Load more" page. Selection only
// runs cheap existence checks; full previews (metadata/media) are fetched on
// demand, this many at a time.
const RELATIONSHIP_PREVIEW_PAGE = 12;
// Byte budget for text/HTML-source previews. HTML renders from a Blob URL, but
// the "View source" representation is capped to this to avoid decoding large
// files in full.
const PREVIEW_SOURCE_BUDGET = 4000;
const EXPIRED_ERROR_CODE = 'u112';
const SINGLE_MINT_UPLOAD_EXPIRY_BLOCKS = 4320;
const CLEANUP_PENDING_STATUS =
  'Cleanup transactions are pending confirmation. Wait for confirmations, then refresh upload state before resuming.';
const CLEANUP_CONFIRMED_STATUS =
  'Cleanup confirmed on-chain. You can begin mint again.';

const isExpiredContractError = (message: string) => {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('err-expired') ||
    normalized.includes('err_expired') ||
    normalized.includes(EXPIRED_ERROR_CODE)
  );
};

const formatExpiredMintMessage = () =>
  `Upload session expired on-chain (u112). Single mints can resume for up to ~${SINGLE_MINT_UPLOAD_EXPIRY_BLOCKS.toLocaleString()} blocks after the last upload; this session is now past that window. Click Start over and begin again.`;

const isAscii = (value: string) => /^[\x00-\x7F]*$/.test(value);
const isHttpUrl = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://');
const toSequentialIndexBatches = (total: number, batchSize = 50) => {
  const batches: number[][] = [];
  for (let start = 0; start < total; start += batchSize) {
    const end = Math.min(total, start + batchSize);
    const batch: number[] = [];
    for (let index = start; index < end; index += 1) {
      batch.push(index);
    }
    batches.push(batch);
  }
  return batches;
};

const formatStx = (value: number, decimals = 2) =>
  `${(value / MICROSTX_PER_STX).toFixed(decimals)} STX`;

const formatStepStatus = (state: StepState) => {
  if (state === 'pending') {
    return 'In progress';
  }
  if (state === 'done') {
    return 'Complete';
  }
  if (state === 'error') {
    return 'Error';
  }
  return 'Idle';
};

const isSupportiveMintLog = (message: string) =>
  message.startsWith('No problem') ||
  message.startsWith('Existing upload data') ||
  message.startsWith('On-chain confirmed') ||
  message.startsWith('Matched your last inscription attempt');

type InfoTipProps = {
  text: string;
  label: string;
};

const InfoTip = ({ text, label }: InfoTipProps) => (
  <span className="info-tip">
    <button
      type="button"
      className="info-tip__icon"
      aria-label={label}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      i
    </button>
    <span className="info-tip__bubble" role="tooltip">
      {text}
    </span>
  </span>
);

type LabelWithInfoProps = {
  label: string;
  info: string;
  tone: 'field' | 'meta';
};

const LabelWithInfo = ({ label, info, tone }: LabelWithInfoProps) => {
  const className =
    tone === 'field' ? 'field__label info-label' : 'meta-label info-label';
  return (
    <span className={className}>
      <span>{label}</span>
      <InfoTip text={info} label={`About ${label}`} />
    </span>
  );
};

const runWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
) => {
  if (items.length === 0) {
    return [] as R[];
  }
  const results: R[] = new Array(items.length);
  let index = 0;
  const workerCount = Math.max(1, Math.min(limit, items.length));
  const workers = Array.from({ length: workerCount }, async () => {
    while (true) {
      const current = index;
      if (current >= items.length) {
        return;
      }
      index += 1;
      results[current] = await fn(items[current]);
    }
  });
  await Promise.all(workers);
  return results;
};

const parseTokenIdInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const parsed = BigInt(trimmed);
    if (parsed < 0n) {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
};

const areStringArraysEqual = (left: string[] = [], right: string[] = []) =>
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

const isSameAddress = (left?: string | null, right?: string | null) => {
  const normalizedLeft = left?.trim().toUpperCase();
  const normalizedRight = right?.trim().toUpperCase();
  return !!normalizedLeft && !!normalizedRight && normalizedLeft === normalizedRight;
};

const getSip16Category = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType.startsWith('audio/')) {
    return 'audio';
  }
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  if (mimeType === 'text/html' || mimeType === 'application/xhtml+xml') {
    return 'html';
  }
  if (mimeType.startsWith('text/')) {
    return 'text';
  }
  if (mimeType.includes('json')) {
    return 'json';
  }
  return 'application';
};

const sanitizeFilename = (value: string) => {
  const cleaned = value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-');
  const trimmed = cleaned.replace(/^[-.]+/, '').replace(/[-.]+$/, '');
  return trimmed || 'xtrata-metadata';
};

const buildSip16Metadata = (params: Sip16MetadataParams) => {
  const rawMediaUri = `https://${SIP16_RESOLVER_HOST_PLACEHOLDER}/xtrata/${params.contractId}/${SIP16_TOKEN_ID_PLACEHOLDER}`;
  const previewUri = `https://${SIP16_PREVIEW_HOST_PLACEHOLDER}/xtrata/${params.contractId}/${SIP16_TOKEN_ID_PLACEHOLDER}`;
  const category = getSip16Category(params.mimeType);
  const isImage = params.mimeType.startsWith('image/');
  const metadata: Record<string, unknown> = {
    sip: 16,
    name: `${params.collectionName} #${SIP16_TOKEN_ID_PLACEHOLDER}`,
    description: `xtrata inscription for ${params.fileName} (${params.mimeType}, ${params.totalBytes} bytes).`,
    image: isImage ? rawMediaUri : SIP16_PLACEHOLDER_IMAGE
  };
  const properties: Record<string, unknown> = {
    collection: params.collectionName,
    id: SIP16_TOKEN_ID_PLACEHOLDER,
    symbol: params.collectionSymbol,
    category,
    raw_media_file_uri: rawMediaUri,
    raw_media_file_type: params.mimeType,
    raw_media_file_signature_type: 'sha256',
    raw_media_file_signature: params.expectedHashHex,
    files: [
      {
        uri: rawMediaUri,
        type: params.mimeType,
        signature: params.expectedHashHex,
        signature_type: 'sha256'
      }
    ],
    xtrata: {
      contract_id: params.contractId,
      contract_name: params.contractName,
      network: params.network,
      protocol_version: params.protocolVersion,
      total_size: params.totalBytes,
      total_chunks: params.totalChunks,
      expected_hash: params.expectedHashHex,
      preview_uri: previewUri
    }
  };
  if (params.creator) {
    properties.creators = [{ address: params.creator, share: 100 }];
  }
  if (!isImage) {
    metadata.animation_url = rawMediaUri;
    properties.animation_url = rawMediaUri;
  }
  if (params.dependencies.length > 0) {
    (properties.xtrata as Record<string, unknown>).dependencies =
      params.dependencies.map((dependency) => dependency.toString());
  }
  if (params.parents.length > 0) {
    (properties.xtrata as Record<string, unknown>).parents =
      params.parents.map((parent) => parent.toString());
  }
  metadata.properties = properties;
  return metadata;
};

const buildDelegateHtml = (params: {
  contractAddress: string;
  contractName: string;
  apiBaseUrl: string;
  tokenId: bigint;
  totalChunks: number;
  mimeType: string;
}) => {
  const safeMime = params.mimeType || 'application/octet-stream';
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Delegate #${params.tokenId.toString()}</title>
<style>
html,body{margin:0;width:100%;height:100%;background:#0f172a;color:#f8fafc;font:13px/1.4 "IBM Plex Sans",system-ui,sans-serif}
#app{display:grid;place-items:center;width:100%;height:100%}
img,video,iframe{max-width:100%;max-height:100%}
pre{white-space:pre-wrap;padding:16px}
</style>
</head>
<body>
<div id="app">Loading delegate...</div>
<script>
const CONTRACT_ADDRESS="${params.contractAddress}";
const CONTRACT_NAME="${params.contractName}";
const API_BASE="${params.apiBaseUrl}";
const TOKEN_ID=${params.tokenId.toString()}n;
const TOTAL_CHUNKS=${params.totalChunks};
const MIME=${JSON.stringify(safeMime)};
const app=document.getElementById("app");
const uintToHex=(n)=>{const hex=BigInt(n).toString(16).padStart(32,"0");return "0x01"+hex};
const hexToBytes=(hex)=>{const clean=hex.startsWith("0x")?hex.slice(2):hex;const out=new Uint8Array(clean.length/2);for(let i=0;i<clean.length;i+=2){out[i/2]=parseInt(clean.slice(i,i+2),16)}return out};
const bytesToHex=(b)=>Array.from(b).map(x=>x.toString(16).padStart(2,"0")).join("");
const clarityToBytes=(hex)=>{const bytes=hexToBytes(hex);if(!bytes.length)return bytes;const tag=bytes[0];if(tag===0x08)return new Uint8Array();if(tag===0x07)return clarityToBytes("0x"+bytesToHex(bytes.slice(1)));if(tag===0x09)return new Uint8Array();if(tag===0x0a)return clarityToBytes("0x"+bytesToHex(bytes.slice(1)));if(tag!==0x02)return new Uint8Array();const len=(bytes[1]<<24)|(bytes[2]<<16)|(bytes[3]<<8)|bytes[4];return bytes.slice(5,5+len)};
const callReadOnly=async(fn,args)=>{const url=\`\${API_BASE}/v2/contracts/call-read/\${CONTRACT_ADDRESS}/\${CONTRACT_NAME}/\${fn}\`;const res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sender:CONTRACT_ADDRESS,arguments:args})});const text=await res.text();let json;try{json=JSON.parse(text)}catch(e){throw new Error("Invalid response")};if(!json.okay)throw new Error(json.cause||"Read-only failed");return json.result};
const fetchChunk=async(i)=>{const result=await callReadOnly("get-chunk",[uintToHex(TOKEN_ID),uintToHex(BigInt(i))]);return clarityToBytes(result)};
const renderBytes=(bytes)=>{const blob=new Blob([bytes],{type:MIME});const url=URL.createObjectURL(blob);const type=MIME||"application/octet-stream";if(type.startsWith("image/")){const img=new Image();img.src=url;app.textContent="";app.appendChild(img);return}if(type.startsWith("audio/")){const audio=document.createElement("audio");audio.controls=true;audio.src=url;app.textContent="";app.appendChild(audio);return}if(type.startsWith("video/")){const video=document.createElement("video");video.controls=true;video.src=url;app.textContent="";app.appendChild(video);return}if(type==="application/pdf"){const frame=document.createElement("iframe");frame.src=url;frame.setAttribute("sandbox","");app.textContent="";app.appendChild(frame);return}const text=new TextDecoder().decode(bytes);const pre=document.createElement("pre");pre.textContent=text;app.textContent="";app.appendChild(pre)};
(async()=>{try{const chunks=[];let total=0;for(let i=0;i<TOTAL_CHUNKS;i++){const chunk=await fetchChunk(i);if(!chunk.length)break;chunks.push(chunk);total+=chunk.length}const bytes=new Uint8Array(total);let offset=0;chunks.forEach(c=>{bytes.set(c,offset);offset+=c.length});if(MIME==="text/html"||MIME==="application/xhtml+xml"){const html=new TextDecoder().decode(bytes);document.open();document.write(html);document.close();return}renderBytes(bytes)}catch(e){app.textContent="Delegate load failed.";console.error(e)}})();
</script>
</body>
</html>`;
};

const readFileBytes = async (file: File) => {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
};

const getFileMimeType = (file: File, bytes?: Uint8Array | null) =>
  resolveInscriptionMimeType({
    fileName: file.name,
    declaredMimeType: file.type,
    bytes
  });

export default function MintScreen(props: MintScreenProps) {
  const client = useMemo(
    () => createXtrataClient({ contract: props.contract }),
    [props.contract]
  );
  const legacyContract = useMemo(
    () => getLegacyContract(props.contract),
    [props.contract]
  );
  const legacyClient = useMemo(
    () =>
      legacyContract ? createXtrataClient({ contract: legacyContract }) : null,
    [legacyContract]
  );
  const contractId = getContractId(props.contract);
  const smallMintHelperContract = useMemo<ContractConfig | null>(
    () =>
      props.contract.network === 'mainnet'
        ? {
            address: SMALL_MINT_HELPER_MAINNET_ADDRESS,
            contractName: SMALL_MINT_HELPER_CONTRACT_NAME,
            network: 'mainnet'
          }
        : null,
    [props.contract.network]
  );
  const smallMintHelperContractId = smallMintHelperContract
    ? getContractId(smallMintHelperContract)
    : null;
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [chunks, setChunks] = useState<Uint8Array[]>([]);
  const [expectedHash, setExpectedHash] = useState<Uint8Array | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  // Blob URL of the original HTML file, fed to the preview iframe so large HTML
  // renders without a full in-memory decode.
  const [previewHtmlUrl, setPreviewHtmlUrl] = useState<string | null>(null);
  // Total HTML byte size when the source view is truncated to the preview
  // budget; null means the source shown is complete.
  const [previewHtmlTruncatedBytes, setPreviewHtmlTruncatedBytes] = useState<
    number | null
  >(null);
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [delegateTargetIdInput, setDelegateTargetIdInput] = useState('');
  const [delegateTargetId, setDelegateTargetId] = useState<bigint | null>(null);
  const [delegateMeta, setDelegateMeta] = useState<InscriptionMeta | null>(null);
  const [delegateStatus, setDelegateStatus] = useState<string | null>(null);
  const [delegatePending, setDelegatePending] = useState(false);
  const [dependencyInput, setDependencyInput] = useState('');
  const [manualDependencyIds, setManualDependencyIds] = useState<bigint[]>([]);
  const [dependencyUiError, setDependencyUiError] = useState<string | null>(null);
  const [dependenciesHydrated, setDependenciesHydrated] = useState(false);
  const [parentInput, setParentInput] = useState('');
  const [manualParentIds, setManualParentIds] = useState<bigint[]>([]);
  const [parentUiError, setParentUiError] = useState<string | null>(null);
  const [parentsHydrated, setParentsHydrated] = useState(false);
  const [metadataJson, setMetadataJson] = useState<string | null>(null);
  const [metadataStatus, setMetadataStatus] = useState<string | null>(null);
  const [duplicateState, setDuplicateState] = useState<
    'idle' | 'checking' | 'clear' | 'found' | 'error'
  >('idle');
  const [duplicateMatch, setDuplicateMatch] = useState<{
    id: bigint;
    owner: string | null;
  } | null>(null);
  const [resumeState, setResumeState] = useState<UploadState | null>(null);
  const [resumeCheckKey, setResumeCheckKey] = useState(0);
  const [cleanupPending, setCleanupPending] = useState(false);
  const restrictions = props.restrictions ?? {};
  const fixedBatchSize = restrictions.fixedBatchSize;
  const fixedTokenUri = restrictions.fixedTokenUri;
  const maxFileBytes = restrictions.maxFileBytes ?? null;
  const hideDelegate = restrictions.hideDelegate ?? false;
  const hideTokenUri = restrictions.hideTokenUri ?? false;
  const hideBatchSize = restrictions.hideBatchSize ?? false;
  const hideMetadataTools = restrictions.hideMetadataTools ?? false;
  const hideFeeRateFetch = restrictions.hideFeeRateFetch ?? false;
  const disableDuplicateOverride = restrictions.disableDuplicateOverride ?? false;
  const resolvedFixedBatchSize =
    fixedBatchSize && fixedBatchSize > 0 ? fixedBatchSize : undefined;
  const initialBatchSize = Math.min(
    resolvedFixedBatchSize ?? DEFAULT_BATCH_SIZE,
    MAX_UPLOAD_BATCH_SIZE
  );
  // Do NOT pre-fill the opaque default here; the default is only ever used when
  // the user affirmatively selects it (see tokenUriChoice / resolveMintTokenUri).
  const initialTokenUri = fixedTokenUri ?? '';

  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const duplicateCheckRef = useRef(0);
  const fileSelectionGuardRef = useRef(createSelectionGuard());
  // Relationship previews are opt-in: selection only validates existence, full
  // metadata/media previews are fetched on demand, RELATIONSHIP_PREVIEW_PAGE at
  // a time.
  const [showRelationshipPreviews, setShowRelationshipPreviews] =
    useState(false);
  const [dependencyPreviewCount, setDependencyPreviewCount] = useState(
    RELATIONSHIP_PREVIEW_PAGE
  );
  const [parentPreviewCount, setParentPreviewCount] = useState(
    RELATIONSHIP_PREVIEW_PAGE
  );
  const [batchSize, setBatchSize] = useState(initialBatchSize);
  const [tokenUri, setTokenUri] = useState(initialTokenUri);
  // Explicit metadata choice: Xtrata default vs a user-supplied URI. The default
  // is transparent (its URL is shown) and is never applied unless selected here.
  const [tokenUriChoice, setTokenUriChoice] = useState<TokenUriChoice>(
    'default'
  );
  // "What would you like to inscribe?" — File vs pasted text. Text builds a File
  // internally and reuses the shared mint pipeline (handleFileSelect).
  const [inscribeSource, setInscribeSource] = useState<'file' | 'text'>('file');
  const [textPayload, setTextPayload] = useState('');
  const [textFileName, setTextFileName] = useState('');
  const [textMime, setTextMime] = useState<string>(DEFAULT_TEXT_MIME);
  const [tokenUriStatus, setTokenUriStatus] = useState<string | null>(null);
  const [tokenUriStatusTone, setTokenUriStatusTone] = useState<
    'idle' | 'ok' | 'error' | 'pending'
  >('idle');
  const [lastAttempt, setLastAttempt] = useState<MintAttempt | null>(null);
  const [resumeHint, setResumeHint] = useState<string | null>(null);
  const [txDelaySeconds, setTxDelaySeconds] = useState<number | null>(null);
  const [txDelayLabel, setTxDelayLabel] = useState<string | null>(null);
  const [mintStatus, setMintStatus] = useState<string | null>(null);
  const [mintLog, setMintLog] = useState<string[]>([]);
  const [mintPending, setMintPending] = useState(false);
  const [beginState, setBeginState] = useState<StepState>('idle');
  const [uploadState, setUploadState] = useState<StepState>('idle');
  const [sealState, setSealState] = useState<StepState>('idle');
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [feeRate, setFeeRate] = useState<number | null>(null);
  const [feeRateStatus, setFeeRateStatus] = useState<string | null>(null);
  const [feeRatePending, setFeeRatePending] = useState(false);
  const [feeRateUpdatedAt, setFeeRateUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    if (resolvedFixedBatchSize) {
      setBatchSize(Math.min(resolvedFixedBatchSize, MAX_UPLOAD_BATCH_SIZE));
    }
  }, [resolvedFixedBatchSize]);

  useEffect(() => {
    if (fixedTokenUri) {
      setTokenUri(fixedTokenUri);
    }
  }, [fixedTokenUri]);

  useEffect(() => {
    setManualDependencyIds([]);
    setDependencyInput('');
    setDependencyUiError(null);
    setDependenciesHydrated(false);
    setManualParentIds([]);
    setParentInput('');
    setParentUiError(null);
    setParentsHydrated(false);
  }, [contractId]);

  useEffect(() => {
    let active = true;
    void loadMintAttempt(contractId).then((attempt) => {
      if (active) {
        setLastAttempt(attempt);
      }
    });
    return () => {
      active = false;
    };
  }, [contractId]);

  useEffect(() => {
    if (!lastAttempt || dependenciesHydrated) {
      return;
    }
    const restored = fromDependencyStrings(lastAttempt.dependencyIds ?? []);
    setManualDependencyIds(restored);
    setDependenciesHydrated(true);
  }, [lastAttempt, dependenciesHydrated]);

  useEffect(() => {
    if (!lastAttempt || parentsHydrated) {
      return;
    }
    const restored = fromDependencyStrings(lastAttempt.parentIds ?? []);
    setManualParentIds(restored);
    setParentsHydrated(true);
  }, [lastAttempt, parentsHydrated]);

  const mismatch = getNetworkMismatch(
    props.contract.network,
    props.walletSession.network
  );
  const capabilities = useMemo(
    () => resolveContractCapabilities(props.contract),
    [props.contract]
  );
  const readOnlySender =
    props.walletSession.address ?? props.contract.address;
  const adminStatusQuery = useContractAdminStatus({
    client,
    senderAddress: readOnlySender,
    enabled: capabilities.supportsFeeUnit || capabilities.supportsPause
  });

  const effectiveBatchSize = Math.min(
    resolvedFixedBatchSize ?? batchSize,
    MAX_UPLOAD_BATCH_SIZE
  );
  const batches = useMemo(() => {
    if (chunks.length === 0) {
      return [];
    }
    return batchChunks(chunks, effectiveBatchSize);
  }, [chunks, effectiveBatchSize]);

  const expectedHashHex = expectedHash ? bytesToHex(expectedHash) : null;
  const importedParentIds = props.parentDraftIds ?? [];
  const resolvedDependencyIds = useMemo(
    () =>
      mergeDependencySources(
        manualDependencyIds,
        delegateTargetId ? [delegateTargetId] : []
      ),
    [manualDependencyIds, delegateTargetId]
  );
  const resolvedParentIds = useMemo(
    () => mergeDependencySources(manualParentIds, importedParentIds),
    [manualParentIds, importedParentIds]
  );
  const dependencyIdStrings = useMemo(
    () => toDependencyStrings(resolvedDependencyIds),
    [resolvedDependencyIds]
  );
  const parentIdStrings = useMemo(
    () => toDependencyStrings(resolvedParentIds),
    [resolvedParentIds]
  );
  const legacyContractId = legacyContract ? getContractId(legacyContract) : null;
  // Cheap, always-on existence/ownership validation for every selected
  // dependency (single getOwner read each) — no metadata/media fetched here.
  const { tokenQueries: dependencyPrimaryExistence } = useTokenExistence({
    client,
    senderAddress: readOnlySender,
    tokenIds: resolvedDependencyIds,
    enabled: !props.collapsed && resolvedDependencyIds.length > 0,
    contractIdOverride: contractId
  });
  const dependencyPrimaryStatusById = useMemo(() => {
    const map = new Map<
      string,
      { owner: string | null; isLoading: boolean; isError: boolean }
    >();
    resolvedDependencyIds.forEach((id, index) => {
      const query = dependencyPrimaryExistence[index];
      map.set(id.toString(), {
        owner: query?.data?.owner ?? null,
        isLoading: query?.isLoading ?? false,
        isError: query?.isError ?? false
      });
    });
    return map;
  }, [dependencyPrimaryExistence, resolvedDependencyIds]);
  const missingDependencyIds = useMemo(
    () =>
      resolvedDependencyIds.filter((id) => {
        const status = dependencyPrimaryStatusById.get(id.toString());
        if (!status || status.isLoading) {
          return false;
        }
        return !status.owner;
      }),
    [resolvedDependencyIds, dependencyPrimaryStatusById]
  );
  const { tokenQueries: dependencyLegacyExistence } = useTokenExistence({
    client: legacyClient ?? client,
    senderAddress: readOnlySender,
    tokenIds: missingDependencyIds,
    enabled:
      !props.collapsed && !!legacyClient && missingDependencyIds.length > 0,
    contractIdOverride: legacyContractId ?? contractId
  });
  const dependencyLegacyStatusById = useMemo(() => {
    const map = new Map<
      string,
      { owner: string | null; isLoading: boolean; isError: boolean }
    >();
    missingDependencyIds.forEach((id, index) => {
      const query = dependencyLegacyExistence[index];
      map.set(id.toString(), {
        owner: query?.data?.owner ?? null,
        isLoading: query?.isLoading ?? false,
        isError: query?.isError ?? false
      });
    });
    return map;
  }, [dependencyLegacyExistence, missingDependencyIds]);
  // Full previews (metadata + media) are opt-in and paginated.
  const dependencyPreviewIds = useMemo(
    () =>
      showRelationshipPreviews
        ? resolvedDependencyIds.slice(0, dependencyPreviewCount)
        : [],
    [showRelationshipPreviews, resolvedDependencyIds, dependencyPreviewCount]
  );
  const { tokenQueries: dependencyPreviewPrimaryQueries } = useTokenSummaries({
    client,
    senderAddress: readOnlySender,
    tokenIds: dependencyPreviewIds,
    enabled:
      !props.collapsed &&
      showRelationshipPreviews &&
      dependencyPreviewIds.length > 0,
    contractIdOverride: contractId
  });
  const dependencyPreviewLegacyIds = useMemo(
    () =>
      dependencyPreviewIds.filter((id) => {
        const key = id.toString();
        return (
          !dependencyPrimaryStatusById.get(key)?.owner &&
          !!dependencyLegacyStatusById.get(key)?.owner
        );
      }),
    [
      dependencyPreviewIds,
      dependencyPrimaryStatusById,
      dependencyLegacyStatusById
    ]
  );
  const { tokenQueries: dependencyPreviewLegacyQueries } = useTokenSummaries({
    client: legacyClient ?? client,
    senderAddress: readOnlySender,
    tokenIds: dependencyPreviewLegacyIds,
    enabled:
      !props.collapsed &&
      showRelationshipPreviews &&
      !!legacyClient &&
      dependencyPreviewLegacyIds.length > 0,
    contractIdOverride: legacyContractId ?? contractId
  });
  const dependencyPreviewSummaryById = useMemo(() => {
    const map = new Map<string, TokenSummary>();
    dependencyPreviewIds.forEach((id, index) => {
      const summary = dependencyPreviewPrimaryQueries[index]?.data;
      if (summary?.meta) {
        map.set(id.toString(), summary);
      }
    });
    dependencyPreviewLegacyIds.forEach((id, index) => {
      const key = id.toString();
      if (map.has(key)) {
        return;
      }
      const summary = dependencyPreviewLegacyQueries[index]?.data;
      if (summary?.meta) {
        map.set(key, summary);
      }
    });
    return map;
  }, [
    dependencyPreviewIds,
    dependencyPreviewPrimaryQueries,
    dependencyPreviewLegacyIds,
    dependencyPreviewLegacyQueries
  ]);
  const dependencyDisplayItems = useMemo(() => {
    return resolvedDependencyIds.map((id) => {
      const key = id.toString();
      const primary = dependencyPrimaryStatusById.get(key);
      const legacy = dependencyLegacyStatusById.get(key);
      const primaryOwner = primary?.owner ?? null;
      const legacyOwner = legacy?.owner ?? null;
      const isLoading =
        primary?.isLoading || (!primaryOwner && legacy?.isLoading) || false;
      let status: 'loading' | 'available' | 'legacy' | 'missing' = 'loading';
      if (!isLoading) {
        if (primaryOwner) {
          status = 'available';
        } else if (legacyOwner) {
          status = 'legacy';
        } else {
          status = 'missing';
        }
      }
      const summary = dependencyPreviewSummaryById.get(key) ?? null;
      const summaryContractId =
        summary?.sourceContractId ??
        (primaryOwner ? contractId : legacyContractId ?? contractId);
      const summaryClient =
        summaryContractId === legacyContractId && legacyClient
          ? legacyClient
          : client;
      return {
        id,
        summary,
        summaryClient,
        summaryContractId,
        status
      };
    });
  }, [
    resolvedDependencyIds,
    dependencyPrimaryStatusById,
    dependencyLegacyStatusById,
    dependencyPreviewSummaryById,
    contractId,
    legacyContractId,
    legacyClient,
    client
  ]);
  const dependencyStatusSummary = useMemo(() => {
    const legacyOnly: bigint[] = [];
    const missing: bigint[] = [];
    const loading: bigint[] = [];
    dependencyDisplayItems.forEach((item) => {
      if (item.status === 'loading') {
        loading.push(item.id);
      } else if (item.status === 'legacy') {
        legacyOnly.push(item.id);
      } else if (item.status === 'missing') {
        missing.push(item.id);
      }
    });
    return { legacyOnly, missing, loading };
  }, [dependencyDisplayItems]);
  const visibleDependencyItems = useMemo(
    () =>
      showRelationshipPreviews
        ? dependencyDisplayItems.slice(0, dependencyPreviewCount)
        : [],
    [showRelationshipPreviews, dependencyDisplayItems, dependencyPreviewCount]
  );
  const dependencyPreviewRemaining = Math.max(
    0,
    dependencyDisplayItems.length - visibleDependencyItems.length
  );
  // Cheap, always-on existence/ownership validation for every selected parent.
  const { tokenQueries: parentPrimaryExistence } = useTokenExistence({
    client,
    senderAddress: readOnlySender,
    tokenIds: resolvedParentIds,
    enabled: !props.collapsed && resolvedParentIds.length > 0,
    contractIdOverride: contractId
  });
  const parentPrimaryStatusById = useMemo(() => {
    const map = new Map<
      string,
      { owner: string | null; isLoading: boolean; isError: boolean }
    >();
    resolvedParentIds.forEach((id, index) => {
      const query = parentPrimaryExistence[index];
      map.set(id.toString(), {
        owner: query?.data?.owner ?? null,
        isLoading: query?.isLoading ?? false,
        isError: query?.isError ?? false
      });
    });
    return map;
  }, [parentPrimaryExistence, resolvedParentIds]);
  const missingParentIds = useMemo(
    () =>
      resolvedParentIds.filter((id) => {
        const status = parentPrimaryStatusById.get(id.toString());
        if (!status || status.isLoading) {
          return false;
        }
        return !status.owner;
      }),
    [resolvedParentIds, parentPrimaryStatusById]
  );
  const { tokenQueries: parentLegacyExistence } = useTokenExistence({
    client: legacyClient ?? client,
    senderAddress: readOnlySender,
    tokenIds: missingParentIds,
    enabled:
      !props.collapsed && !!legacyClient && missingParentIds.length > 0,
    contractIdOverride: legacyContractId ?? contractId
  });
  const parentLegacyStatusById = useMemo(() => {
    const map = new Map<
      string,
      { owner: string | null; isLoading: boolean; isError: boolean }
    >();
    missingParentIds.forEach((id, index) => {
      const query = parentLegacyExistence[index];
      map.set(id.toString(), {
        owner: query?.data?.owner ?? null,
        isLoading: query?.isLoading ?? false,
        isError: query?.isError ?? false
      });
    });
    return map;
  }, [parentLegacyExistence, missingParentIds]);
  // Full previews (metadata + media) are opt-in and paginated.
  const parentPreviewIds = useMemo(
    () =>
      showRelationshipPreviews
        ? resolvedParentIds.slice(0, parentPreviewCount)
        : [],
    [showRelationshipPreviews, resolvedParentIds, parentPreviewCount]
  );
  const { tokenQueries: parentPreviewPrimaryQueries } = useTokenSummaries({
    client,
    senderAddress: readOnlySender,
    tokenIds: parentPreviewIds,
    enabled:
      !props.collapsed &&
      showRelationshipPreviews &&
      parentPreviewIds.length > 0,
    contractIdOverride: contractId
  });
  const parentPreviewLegacyIds = useMemo(
    () =>
      parentPreviewIds.filter((id) => {
        const key = id.toString();
        return (
          !parentPrimaryStatusById.get(key)?.owner &&
          !!parentLegacyStatusById.get(key)?.owner
        );
      }),
    [parentPreviewIds, parentPrimaryStatusById, parentLegacyStatusById]
  );
  const { tokenQueries: parentPreviewLegacyQueries } = useTokenSummaries({
    client: legacyClient ?? client,
    senderAddress: readOnlySender,
    tokenIds: parentPreviewLegacyIds,
    enabled:
      !props.collapsed &&
      showRelationshipPreviews &&
      !!legacyClient &&
      parentPreviewLegacyIds.length > 0,
    contractIdOverride: legacyContractId ?? contractId
  });
  const parentPreviewSummaryById = useMemo(() => {
    const map = new Map<string, TokenSummary>();
    parentPreviewIds.forEach((id, index) => {
      const summary = parentPreviewPrimaryQueries[index]?.data;
      if (summary?.meta) {
        map.set(id.toString(), summary);
      }
    });
    parentPreviewLegacyIds.forEach((id, index) => {
      const key = id.toString();
      if (map.has(key)) {
        return;
      }
      const summary = parentPreviewLegacyQueries[index]?.data;
      if (summary?.meta) {
        map.set(key, summary);
      }
    });
    return map;
  }, [
    parentPreviewIds,
    parentPreviewPrimaryQueries,
    parentPreviewLegacyIds,
    parentPreviewLegacyQueries
  ]);
  const parentDisplayItems = useMemo(() => {
    return resolvedParentIds.map((id) => {
      const key = id.toString();
      const primary = parentPrimaryStatusById.get(key);
      const legacy = parentLegacyStatusById.get(key);
      const primaryOwner = primary?.owner ?? null;
      const legacyOwner = legacy?.owner ?? null;
      const isLoading =
        primary?.isLoading || (!primaryOwner && legacy?.isLoading) || false;
      let status: 'loading' | 'owned' | 'not-owned' | 'legacy' | 'missing' =
        'loading';
      if (!isLoading) {
        if (primaryOwner) {
          status = isSameAddress(primaryOwner, props.walletSession.address)
            ? 'owned'
            : 'not-owned';
        } else if (legacyOwner) {
          status = 'legacy';
        } else {
          status = 'missing';
        }
      }
      const summary = parentPreviewSummaryById.get(key) ?? null;
      const summaryContractId =
        summary?.sourceContractId ??
        (primaryOwner ? contractId : legacyContractId ?? contractId);
      const summaryClient =
        summaryContractId === legacyContractId && legacyClient
          ? legacyClient
          : client;
      return {
        id,
        summary,
        summaryClient,
        summaryContractId,
        status
      };
    });
  }, [
    resolvedParentIds,
    parentPrimaryStatusById,
    parentLegacyStatusById,
    parentPreviewSummaryById,
    props.walletSession.address,
    contractId,
    legacyContractId,
    legacyClient,
    client
  ]);
  const parentStatusSummary = useMemo(() => {
    const notOwned: bigint[] = [];
    const legacyOnly: bigint[] = [];
    const missing: bigint[] = [];
    const loading: bigint[] = [];
    parentDisplayItems.forEach((item) => {
      if (item.status === 'loading') {
        loading.push(item.id);
      } else if (item.status === 'not-owned') {
        notOwned.push(item.id);
      } else if (item.status === 'legacy') {
        legacyOnly.push(item.id);
      } else if (item.status === 'missing') {
        missing.push(item.id);
      }
    });
    return { notOwned, legacyOnly, missing, loading };
  }, [parentDisplayItems]);
  const visibleParentItems = useMemo(
    () =>
      showRelationshipPreviews
        ? parentDisplayItems.slice(0, parentPreviewCount)
        : [],
    [showRelationshipPreviews, parentDisplayItems, parentPreviewCount]
  );
  const parentPreviewRemaining = Math.max(
    0,
    parentDisplayItems.length - visibleParentItems.length
  );
  const hasDuplicate = duplicateMatch !== null;
  const resumeInfo = useMemo(() => {
    if (!resumeState) {
      return null;
    }
    const totalChunks = Number(resumeState.totalChunks);
    const currentIndex = Number(resumeState.currentIndex);
    if (
      !Number.isSafeInteger(totalChunks) ||
      !Number.isSafeInteger(currentIndex) ||
      totalChunks < 0 ||
      currentIndex < 0
    ) {
      return { error: 'Upload state is too large to resume safely.' };
    }
    if (currentIndex > totalChunks) {
      return { error: 'On-chain upload state is ahead of expected chunks.' };
    }
    const remainingChunks = Math.max(0, totalChunks - currentIndex);
    const batchLimit = effectiveBatchSize;
    const remainingBatches =
      batchLimit > 0 ? Math.ceil(remainingChunks / batchLimit) : 0;
    return {
      totalChunks,
      currentIndex,
      remainingChunks,
      remainingBatches,
      batchLimit
    };
  }, [resumeState, effectiveBatchSize]);

  useEffect(() => {
    if (!file || !expectedHashHex || !lastAttempt) {
      return;
    }
    if (lastAttempt.expectedHashHex !== expectedHashHex) {
      return;
    }
    if (
      areStringArraysEqual(lastAttempt.dependencyIds ?? [], dependencyIdStrings) &&
      areStringArraysEqual(lastAttempt.parentIds ?? [], parentIdStrings)
    ) {
      return;
    }
    const updatedAttempt: MintAttempt = {
      ...lastAttempt,
      dependencyIds: dependencyIdStrings,
      parentIds: parentIdStrings,
      updatedAt: Date.now()
    };
    setLastAttempt(updatedAttempt);
    void saveMintAttempt(updatedAttempt);
  }, [dependencyIdStrings, expectedHashHex, file, lastAttempt, parentIdStrings]);
  const resumeMismatch = useMemo(() => {
    if (!resumeState || !file || !fileBytes) {
      return null;
    }
    const mimeType = getFileMimeType(file, fileBytes);
    if (resumeState.mimeType !== mimeType) {
      return 'Selected file does not match the on-chain upload mime type.';
    }
    if (resumeState.totalSize !== BigInt(fileBytes.length)) {
      return 'Selected file size does not match the on-chain upload.';
    }
    if (resumeState.totalChunks !== BigInt(chunks.length)) {
      return 'Selected file chunk count does not match the on-chain upload.';
    }
    return null;
  }, [resumeState, file, fileBytes, chunks.length]);
  const resumeBlocked =
    !!resumeMismatch || (resumeInfo ? 'error' in resumeInfo : false);
  // v3+ cores have their own one-transaction mint-single-tx route, so they must
  // NOT use the external small-mint helper (which is bound to an older core and
  // would mint into the wrong contract). The helper is only for older cores
  // (v2.x) that lack a native single-tx route.
  const supportsNativeSingleTx = capabilities.supportsNativeSingleTx;
  const supportsSmallMintHelper =
    !supportsNativeSingleTx &&
    capabilities.version !== '1.1.1' &&
    !!smallMintHelperContract;
  const isSmallMintEligible =
    !resumeState &&
    chunks.length > 0 &&
    chunks.length <= SMALL_MINT_HELPER_MAX_CHUNKS;
  const shouldUseNativeSingleTx = supportsNativeSingleTx && isSmallMintEligible;
  const shouldUseHelperSingleTx = supportsSmallMintHelper && isSmallMintEligible;
  const shouldAutoRouteSmallMint =
    shouldUseNativeSingleTx || shouldUseHelperSingleTx;
  // Contract id shown for the single-tx route (the core itself when native).
  const singleTxRouteContractId = shouldUseNativeSingleTx
    ? getContractId(props.contract)
    : smallMintHelperContractId;
  const totalBytes = fileBytes ? BigInt(fileBytes.length) : 0n;
  const uploadBatchCount = batches.length;
  const feeUnitNumber = useMemo(() => {
    if (!adminStatusQuery.data?.feeUnitMicroStx) {
      return null;
    }
    const asNumber = Number(adminStatusQuery.data.feeUnitMicroStx);
    if (!Number.isSafeInteger(asNumber) || asNumber <= 0) {
      return null;
    }
    return asNumber;
  }, [adminStatusQuery.data?.feeUnitMicroStx]);
  const feeSchedule = useMemo(
    () => getFeeSchedule(props.contract, feeUnitNumber),
    [props.contract, feeUnitNumber]
  );
  const feeEstimate = useMemo(
    () =>
      estimateContractFees({
        schedule: feeSchedule,
        totalChunks: chunks.length
      }),
    [feeSchedule, chunks.length]
  );
  // Post-condition caps, NOT the displayed estimate. The five fee units are
  // admin-mutable and only the legacy aggregate is read here, so the caps carry
  // headroom; capping at the exact estimate would abort a stage whose earlier
  // stages have already been paid for.
  const feeCaps = useMemo(
    () =>
      estimateContractFeeCaps({
        schedule: feeSchedule,
        totalChunks: chunks.length
      }),
    [feeSchedule, chunks.length]
  );
  const hasChunks = chunks.length > 0;
  const mintUsdPriceBookQuery = useUsdPriceBook({
    enabled: hasChunks && !props.usdPriceBook
  });
  const usdPriceBook =
    props.usdPriceBook ?? mintUsdPriceBookQuery.data ?? null;
  const sequentialMintTxEstimate = useMemo(
    () =>
      estimateSequentialMintTransactions({
        totalChunks: chunks.length,
        batchSize: effectiveBatchSize
      }),
    [chunks.length, effectiveBatchSize]
  );
  const dataMiningFeeMicroStx = useMemo(
    () => estimateDataMiningFeeMicroStx(totalBytes),
    [totalBytes]
  );
  const dataMiningFeeDisplay = useMemo(
    () => formatMicroStxWithUsd(dataMiningFeeMicroStx, usdPriceBook),
    [dataMiningFeeMicroStx, usdPriceBook]
  );
  const combinedFeeMicroStx = useMemo(
    () =>
      BigInt(Math.max(0, Math.round(feeEstimate.totalMicroStx))) +
      dataMiningFeeMicroStx,
    [dataMiningFeeMicroStx, feeEstimate.totalMicroStx]
  );
  const combinedFeeDisplay = useMemo(
    () => formatMicroStxWithUsd(combinedFeeMicroStx, usdPriceBook),
    [combinedFeeMicroStx, usdPriceBook]
  );
  // Fiat display (WS-3.3): USD by default, GBP via a persisted toggle + FX rate.
  const [displayCurrency, setDisplayCurrency] = useDisplayCurrency();
  const gbpRateQuery = useGbpPerUsd({
    enabled: hasChunks && displayCurrency === 'GBP'
  });
  const combinedFeeFiat = useMemo(() => {
    const usd = computeUsdFromBaseUnits({
      amount: combinedFeeMicroStx,
      decimals: 6,
      assetKey: 'stx',
      priceBook: usdPriceBook
    });
    return formatFiat(usd, displayCurrency, gbpRateQuery.data ?? null);
  }, [combinedFeeMicroStx, usdPriceBook, displayCurrency, gbpRateQuery.data]);
  // Payment-asset options (WS-3.2). STX only unless the core advertises
  // multi-asset payment — no shipped version does, so the picker stays hidden.
  const paymentAssets = useMemo(
    () => getAvailablePaymentAssets(capabilities),
    [capabilities]
  );
  const [paymentAssetSymbol, setPaymentAssetSymbol] = useState('STX');
  const feeUnitValue =
    feeSchedule.model === 'fee-unit' ? feeSchedule.feeUnitMicroStx : null;
  const isPaused = adminStatusQuery.data?.paused ?? null;
  const isOwner =
    !!props.walletSession.address &&
    !!adminStatusQuery.data?.admin &&
    props.walletSession.address === adminStatusQuery.data.admin;
  const pauseBlocked = isPaused === true && !isOwner;
  const feeUnitError =
    feeSchedule.model === 'fee-unit' && adminStatusQuery.isError
      ? adminStatusQuery.error instanceof Error
        ? adminStatusQuery.error.message
        : 'Unable to load fee unit.'
      : null;
  const resolveFeePostConditions = (amountMicroStx: number) => {
    const sender = props.walletSession.address;
    if (!sender || !Number.isFinite(amountMicroStx) || amountMicroStx < 0) {
      return undefined;
    }
    const amount = BigInt(Math.round(amountMicroStx));
    const royaltyRecipient = adminStatusQuery.data?.royaltyRecipient ?? null;
    const conditionCode =
      !royaltyRecipient || royaltyRecipient === sender
        ? FungibleConditionCode.LessEqual
        : FungibleConditionCode.Equal;
    return [
      makeStandardSTXPostCondition(sender, conditionCode, amount)
    ] as PostCondition[];
  };
  const estimatedTxBytes = useMemo(() => {
    if (!fileBytes) {
      return null;
    }
    if (shouldAutoRouteSmallMint) {
      return 920 + fileBytes.length;
    }
    let uploadBytes = 0;
    for (const batch of batches) {
      const batchBytes = batch.reduce((sum, chunk) => sum + chunk.length, 0);
      uploadBytes += 520 + batchBytes;
    }
    return 380 + 420 + uploadBytes;
  }, [batches, fileBytes, shouldAutoRouteSmallMint]);
  const networkFeeEstimate =
    feeRate && estimatedTxBytes
      ? Math.ceil(estimatedTxBytes * feeRate)
      : null;
  const handleBackToViewer = () => {
    if (typeof document === 'undefined') {
      return;
    }
    const anchor = document.getElementById('collection-viewer');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
    }
  };

  const pauseBeforeNextTx = async (label: string) => {
    setTxDelayLabel(label);
    for (let remaining = TX_DELAY_SECONDS; remaining > 0; remaining -= 1) {
      setTxDelaySeconds(remaining);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setTxDelaySeconds(null);
    setTxDelayLabel(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewHtmlUrl) {
        URL.revokeObjectURL(previewHtmlUrl);
      }
    };
  }, [previewHtmlUrl]);

  useEffect(() => {
    if (!expectedHash) {
      setDuplicateState('idle');
      setDuplicateMatch(null);
      setResumeState(null);
      setCleanupPending(false);
      setAllowDuplicate(false);
      setResumeHint(null);
      return;
    }
    const checkId = duplicateCheckRef.current + 1;
    duplicateCheckRef.current = checkId;
    setDuplicateState('checking');
    setDuplicateMatch(null);
    setAllowDuplicate(false);
    const runCheck = async () => {
      let uploadState: UploadState | null = null;
      if (props.walletSession.address) {
        try {
          uploadState = await client.getUploadState(
            expectedHash,
            props.walletSession.address,
            readOnlySender
          );
        } catch (error) {
          uploadState = null;
        }
      }

      if (duplicateCheckRef.current !== checkId) {
        return;
      }
      setResumeState(uploadState);
      if (cleanupPending) {
        if (uploadState) {
          setMintStatus((prev) =>
            prev === CLEANUP_PENDING_STATUS ? prev : CLEANUP_PENDING_STATUS
          );
        } else {
          setCleanupPending(false);
          setMintStatus((prev) =>
            prev === CLEANUP_CONFIRMED_STATUS ? prev : CLEANUP_CONFIRMED_STATUS
          );
        }
      }

      // When an upload session exists for this hash+owner, prioritize resume flow.
      // Otherwise check the contract's hash index directly instead of scanning history.
      if (uploadState) {
        setDuplicateState('clear');
        setDuplicateMatch(null);
        return;
      }

      try {
        const duplicateId = await client.getIdByHash(expectedHash, readOnlySender);
        if (duplicateCheckRef.current !== checkId) {
          return;
        }
        if (duplicateId === null) {
          setDuplicateState('clear');
          return;
        }

        let owner: string | null = null;
        try {
          const meta = await client.getInscriptionMeta(duplicateId, readOnlySender);
          if (duplicateCheckRef.current !== checkId) {
            return;
          }
          owner = meta?.owner ?? null;
        } catch {
          owner = null;
        }

        setDuplicateMatch({ id: duplicateId, owner });
        setDuplicateState('found');
      } catch (error) {
        if (duplicateCheckRef.current !== checkId) {
          return;
        }
        setDuplicateState('error');
      }
    };

    void runCheck();
  }, [
    client,
    cleanupPending,
    expectedHash,
    readOnlySender,
    resumeCheckKey
  ]);

  useEffect(() => {
    if (!resumeState || mintPending) {
      return;
    }
    if (beginState === 'idle') {
      setBeginState('done');
    }
  }, [resumeState, mintPending, beginState]);

  const appendLog = (message: string) => {
    setMintLog((prev) => {
      const next = [...prev, message];
      return next.slice(-30);
    });
    // eslint-disable-next-line no-console
    console.log(`[mint] ${message}`);
  };

  const setTokenUriStatusState = (
    message: string,
    tone: 'idle' | 'ok' | 'error' | 'pending'
  ) => {
    setTokenUriStatus(message);
    setTokenUriStatusTone(tone);
  };

  const resolveTokenUri = async () => {
    const value = tokenUri.trim();
    if (!value) {
      setTokenUriStatusState('Enter a metadata URI to resolve.', 'error');
      return;
    }
    if (!isHttpUrl(value)) {
      setTokenUriStatusState('Invalid URL. Use http(s).', 'error');
      return;
    }
    setTokenUriStatusState('Resolving...', 'pending');
    try {
      const response = await fetch(value, {
        redirect: 'follow',
        cache: 'no-store'
      });
      const finalUrl = response.url || value;
      if (finalUrl !== value) {
        setTokenUri(finalUrl);
      }
      const contentType = response.headers.get('content-type') || '';
      const suffix = contentType ? ` (${contentType})` : '';
      setTokenUriStatusState(`Resolved: ${finalUrl}${suffix}`, 'ok');
      appendLog(`Token URI resolved to ${finalUrl}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setTokenUriStatusState('Resolve failed. See log for details.', 'error');
      appendLog(`Token URI resolve failed: ${message}`);
    }
  };

  const extractFeeRate = (value: unknown): number | null => {
    if (value == null) {
      return null;
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    if (Array.isArray(value)) {
      const rates = value
        .map(extractFeeRate)
        .filter((rate): rate is number => !!rate && rate > 0);
      return rates.length ? Math.max(...rates) : null;
    }
    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const direct =
        record.fee_rate ??
        record.feeRate ??
        record.fee_rate_per_byte ??
        record.feeRatePerByte;
      const directRate = extractFeeRate(direct);
      if (directRate) {
        return directRate;
      }
      if (Array.isArray(record.estimations)) {
        const rates = record.estimations
          .map((entry) => extractFeeRate(entry))
          .filter((rate): rate is number => !!rate && rate > 0);
        return rates.length ? Math.max(...rates) : null;
      }
    }
    return null;
  };

  const fetchFeeRate = async () => {
    setFeeRatePending(true);
    setFeeRateStatus('Fetching fee rate...');
    const baseUrl = getApiBaseUrl(props.contract.network);
    try {
      const response = await fetch(`${baseUrl}/v2/fees/transfer`, {
        cache: 'no-store',
        redirect: 'follow'
      });
      const text = await response.text();
      let data: unknown = null;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        data = null;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
      }
      const rate = extractFeeRate(data);
      if (!rate || !Number.isFinite(rate)) {
        throw new Error('Unrecognized fee response.');
      }
      setFeeRate(rate);
      setFeeRateUpdatedAt(Date.now());
      setFeeRateStatus(`Loaded fee rate: ${rate} microSTX/byte.`);
      appendLog(`Fee rate loaded: ${rate} microSTX/byte.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setFeeRate(null);
      setFeeRateStatus(`Fee rate fetch failed: ${message}`);
      appendLog(`Fee rate fetch failed: ${message}`);
    } finally {
      setFeeRatePending(false);
    }
  };

  const generateSip16Metadata = () => {
    if (!file || !expectedHashHex) {
      setMetadataStatus('Select a file to generate SIP-016 metadata.');
      return;
    }
    const mimeType = getFileMimeType(file, fileBytes);
    const metadata = buildSip16Metadata({
      contractId,
      contractName: props.contract.contractName,
      collectionName: SIP16_COLLECTION_NAME,
      collectionSymbol: SIP16_COLLECTION_SYMBOL,
      network: props.contract.network,
      protocolVersion: props.contract.protocolVersion,
      fileName: file.name,
      mimeType,
      totalBytes: file.size,
      totalChunks: chunks.length,
      expectedHashHex,
      creator: props.walletSession.address ?? null,
      dependencies: resolvedDependencyIds,
      parents: resolvedParentIds
    });
    const json = JSON.stringify(metadata, null, 2);
    setMetadataJson(json);
    setMetadataStatus(
      'SIP-016 metadata generated. Replace {resolver-host}/{preview-host}, host the JSON, then set token URI.'
    );
    appendLog('SIP-016 metadata generated.');
  };

  const copySip16Metadata = async () => {
    if (!metadataJson) {
      return;
    }
    if (!navigator.clipboard?.writeText) {
      setMetadataStatus('Clipboard unavailable. Copy from the preview.');
      return;
    }
    try {
      await navigator.clipboard.writeText(metadataJson);
      setMetadataStatus('SIP-016 metadata copied to clipboard.');
      appendLog('SIP-016 metadata copied.');
    } catch (error) {
      setMetadataStatus('Copy failed. Copy from the preview.');
    }
  };

  const downloadSip16Metadata = () => {
    if (!metadataJson) {
      return;
    }
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'xtrata';
    const safeBase = sanitizeFilename(baseName);
    const hashSuffix = expectedHashHex ? expectedHashHex.slice(0, 8) : 'meta';
    const filename = `${safeBase}-sip016-${hashSuffix}.json`;
    const blob = new Blob([metadataJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setMetadataStatus(`Downloaded ${filename}.`);
    appendLog('SIP-016 metadata downloaded.');
  };

  const clearSip16Metadata = () => {
    setMetadataJson(null);
    setMetadataStatus(null);
  };

  const resetSteps = () => {
    setBeginState('idle');
    setUploadState('idle');
    setSealState('idle');
    setBatchProgress(null);
  };

  const resetPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (previewHtmlUrl) {
      URL.revokeObjectURL(previewHtmlUrl);
    }
    setPreviewUrl(null);
    setPreviewText(null);
    setPreviewHtml(null);
    setPreviewHtmlUrl(null);
    setPreviewHtmlTruncatedBytes(null);
    setShowHtmlSource(false);
  };

  const handleFileSelect = async (
    selected: File,
    options?: { clearDelegate?: boolean }
  ) => {
    // Invalidate any in-flight selection; a newer pick supersedes this one.
    const isCurrentSelection = fileSelectionGuardRef.current.begin();
    resetSteps();
    setMintStatus(null);
    setMintLog([]);
    setMetadataJson(null);
    setMetadataStatus(null);
    setResumeHint(null);
    resetPreview();
    if (options?.clearDelegate !== false) {
      setDelegateTargetId(null);
      setDelegateMeta(null);
      setDelegateStatus(null);
    }
    if (maxFileBytes !== null && selected.size > maxFileBytes) {
      const maxReadable = formatBytes(BigInt(maxFileBytes));
      const actualReadable = formatBytes(BigInt(selected.size));
      const message = `File is too large (${actualReadable}). Max allowed is ${maxReadable}.`;
      setMintStatus(message);
      appendLog('Mint blocked: file too large.');
      logWarn('mint', 'Mint blocked: file too large', {
        fileName: selected.name,
        bytes: selected.size,
        maxBytes: maxFileBytes
      });
      setFile(null);
      setFileBytes(null);
      setChunks([]);
      setExpectedHash(null);
      setMetadataJson(null);
      setMetadataStatus(null);
      resetPreview();
      return;
    }
    setIsPreparing(true);
    setFile(selected);
    try {
      const bytes = await readFileBytes(selected);
      if (!isCurrentSelection()) {
        // A newer file was selected while this one was being read; discard.
        return;
      }
      const nextChunks = chunkBytes(bytes, CHUNK_SIZE);
      const expectedHash = computeExpectedHash(nextChunks);
      const expectedHashHex = bytesToHex(expectedHash);
      const batchLimit = effectiveBatchSize;
      const batchCount =
        batchLimit > 0 ? Math.ceil(nextChunks.length / batchLimit) : 0;
      setFileBytes(bytes);
      setChunks(nextChunks);
      setExpectedHash(expectedHash);
      const previousAttempt = lastAttempt ?? (await loadMintAttempt(contractId));
      if (!isCurrentSelection()) {
        return;
      }
      if (previousAttempt) {
        setLastAttempt(previousAttempt);
      }
      if (previousAttempt && previousAttempt.expectedHashHex === expectedHashHex) {
        const name = previousAttempt.fileName ?? selected.name;
        setResumeHint(
          `No problem - matched your last inscription attempt (${name}). Resume inscription will pick up where you left off.`
        );
      } else {
        setResumeHint(null);
      }
      // For the saved attempt/resume hint only; the authoritative resolution
      // (with blank-custom guarding) happens at mint time via resolveMintTokenUri.
      const tokenUriResolution = resolveMintTokenUri({
        fixedTokenUri,
        choice: tokenUriChoice,
        customValue: tokenUri,
        defaultTokenUri: DEFAULT_TOKEN_URI
      });
      const resolvedTokenUri = tokenUriResolution.ok
        ? tokenUriResolution.value
        : '';
      const attempt: MintAttempt = {
        contractId,
        expectedHashHex,
        fileName: selected.name,
        mimeType: getFileMimeType(selected, bytes),
        totalBytes: bytes.length,
        totalChunks: nextChunks.length,
        batchSize: batchLimit,
        tokenUri: resolvedTokenUri,
        dependencyIds: dependencyIdStrings,
        parentIds: parentIdStrings,
        updatedAt: Date.now()
      };
      void saveMintAttempt(attempt);
      setLastAttempt(attempt);
      logInfo('mint', 'Prepared inscription file', {
        fileName: selected.name,
        fileType: getFileMimeType(selected, bytes),
        bytes: bytes.length,
        chunks: nextChunks.length,
        chunkSize: CHUNK_SIZE,
        expectedHash: expectedHashHex,
        batchSize: batchLimit,
        batches: batchCount
      });

      const name = selected.name.toLowerCase();
      const isHtml =
        selected.type === 'text/html' ||
        selected.type === 'application/xhtml+xml' ||
        selected.type.includes('html') ||
        name.endsWith('.html') ||
        name.endsWith('.htm');
      if (selected.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else if (
        selected.type.startsWith('audio/') ||
        selected.type.startsWith('video/')
      ) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else if (isHtml) {
        // Render from a Blob URL (no full decode); cap the source view to the
        // preview budget so a large HTML file never gets fully decoded.
        const decoder = new TextDecoder();
        setPreviewHtml(decoder.decode(bytes.slice(0, PREVIEW_SOURCE_BUDGET)));
        setPreviewHtmlTruncatedBytes(
          bytes.length > PREVIEW_SOURCE_BUDGET ? bytes.length : null
        );
        setPreviewHtmlUrl(URL.createObjectURL(selected));
        setShowHtmlSource(false);
      } else if (
        selected.type.startsWith('text/') ||
        selected.type.includes('json')
      ) {
        const decoder = new TextDecoder();
        setPreviewText(decoder.decode(bytes.slice(0, PREVIEW_SOURCE_BUDGET)));
      }
    } catch (error) {
      if (!isCurrentSelection()) {
        // Newer selection owns the state now; don't clobber it with this error.
        return;
      }
      const message = error instanceof Error ? error.message : String(error);
      logWarn('mint', 'Failed to read file', {
        fileName: selected.name,
        error: message
      });
      setMintStatus(`Failed to read file: ${message}`);
      setFile(null);
      setFileBytes(null);
      setChunks([]);
      setExpectedHash(null);
      setMetadataJson(null);
      setMetadataStatus(null);
      resetPreview();
    } finally {
      // Only clear the preparing flag if this is still the active selection;
      // otherwise a newer in-flight read is still preparing.
      if (isCurrentSelection()) {
        setIsPreparing(false);
      }
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) {
      return;
    }
    void handleFileSelect(selected);
  };

  // Byte size of the pasted text (UTF-8), used for the live counter.
  const textPayloadBytes = useMemo(
    () => new TextEncoder().encode(textPayload).length,
    [textPayload]
  );

  // Build a File from the pasted text and run it through the shared mint
  // pipeline exactly as a picked file would be.
  const handlePrepareText = () => {
    if (!textPayload) {
      return;
    }
    const name = textFileName.trim() || defaultTextFileName(textMime);
    const textFile = new File([textPayload], name, { type: textMime });
    void handleFileSelect(textFile);
  };

  const applyDependencyInput = () => {
    const parsed = parseDependencyInput(dependencyInput);
    if (parsed.invalidTokens.length > 0) {
      setDependencyUiError(
        `Invalid token IDs: ${parsed.invalidTokens.join(', ')}.`
      );
      return;
    }
    if (parsed.ids.length === 0) {
      setDependencyUiError('Enter at least one token ID.');
      return;
    }
    const mergedManual = mergeDependencySources(
      manualDependencyIds,
      parsed.ids
    );
    const combined = mergeDependencySources(
      mergedManual,
      delegateTargetId ? [delegateTargetId] : []
    );
    const validation = validateDependencyIds(combined);
    if (!validation.ok) {
      const message =
        validation.reason === 'max-50'
          ? 'A maximum of 50 dependency IDs is allowed.'
          : validation.reason === 'duplicate-ids'
            ? 'Duplicate dependency IDs are not allowed.'
            : validation.reason === 'negative-id'
              ? 'Dependency IDs must be non-negative.'
              : 'Invalid dependency IDs.';
      setDependencyUiError(message);
      return;
    }
    setManualDependencyIds(mergedManual);
    setDependencyInput('');
    setDependencyUiError(null);
  };

  const removeManualDependency = (id: bigint) => {
    setManualDependencyIds((current) =>
      current.filter((value) => value !== id)
    );
    setDependencyUiError(null);
  };

  const clearManualDependencies = () => {
    setManualDependencyIds([]);
    setDependencyInput('');
    setDependencyUiError(null);
  };

  const applyParentInput = () => {
    if (!capabilities.supportsRelationships) {
      setParentUiError('Parent-child relationships require a v3 contract.');
      return;
    }
    const parsed = parseDependencyInput(parentInput);
    if (parsed.invalidTokens.length > 0) {
      setParentUiError(`Invalid token IDs: ${parsed.invalidTokens.join(', ')}.`);
      return;
    }
    if (parsed.ids.length === 0) {
      setParentUiError('Enter at least one parent token ID.');
      return;
    }
    const mergedManual = mergeDependencySources(manualParentIds, parsed.ids);
    const combined = mergeDependencySources(mergedManual, importedParentIds);
    const validation = validateDependencyIds(combined);
    if (!validation.ok) {
      const message =
        validation.reason === 'max-50'
          ? 'A maximum of 50 parent IDs is allowed.'
          : validation.reason === 'duplicate-ids'
            ? 'Duplicate parent IDs are not allowed.'
            : validation.reason === 'negative-id'
              ? 'Parent IDs must be non-negative.'
              : 'Invalid parent IDs.';
      setParentUiError(message);
      return;
    }
    setManualParentIds(mergedManual);
    setParentInput('');
    setParentUiError(null);
  };

  const removeManualParent = (id: bigint) => {
    setManualParentIds((current) => current.filter((value) => value !== id));
    setParentUiError(null);
  };

  const clearManualParents = () => {
    setManualParentIds([]);
    setParentInput('');
    setParentUiError(null);
  };

  const handleGenerateDelegate = async () => {
    const parsedId = parseTokenIdInput(delegateTargetIdInput);
    if (parsedId === null) {
      setDelegateStatus('Enter a valid token ID.');
      return;
    }
    setDelegatePending(true);
    setDelegateStatus(null);
    setDelegateMeta(null);
    logInfo('mint', 'Generating delegate clone', {
      tokenId: parsedId.toString(),
      contractId: getContractId(props.contract)
    });
    try {
      const meta = await client.getInscriptionMeta(parsedId, readOnlySender);
      if (!meta) {
        setDelegateStatus(`No inscription found for ID ${parsedId.toString()}.`);
        setDelegateTargetId(null);
        logWarn('mint', 'Delegate target not found', {
          tokenId: parsedId.toString()
        });
        return;
      }
      const totalChunks = Number(meta.totalChunks);
      if (!Number.isFinite(totalChunks) || totalChunks <= 0) {
        setDelegateStatus('Unable to derive chunk count for this inscription.');
        setDelegateTargetId(null);
        logWarn('mint', 'Delegate target missing chunk data', {
          tokenId: parsedId.toString()
        });
        return;
      }
      logInfo('mint', 'Delegate target loaded', {
        tokenId: parsedId.toString(),
        mimeType: meta.mimeType,
        totalChunks
      });
      const delegateHtml = buildDelegateHtml({
        contractAddress: props.contract.address,
        contractName: props.contract.contractName,
        apiBaseUrl: getApiBaseUrl(props.contract.network),
        tokenId: parsedId,
        totalChunks,
        mimeType: meta.mimeType
      });
      const delegateFile = new File(
        [delegateHtml],
        `delegate-${parsedId.toString()}.html`,
        { type: 'text/html' }
      );
      setDelegateTargetId(parsedId);
      setDelegateMeta(meta);
      setDelegateTargetIdInput(parsedId.toString());
      if (!meta.sealed) {
        setDelegateStatus('Inscription is not sealed yet.');
      } else if (!props.walletSession.address) {
        setDelegateStatus('Connect a wallet to verify ownership.');
      } else if (meta.owner !== props.walletSession.address) {
        setDelegateStatus('Owner mismatch. Proceed only if this is yours.');
      }
      await handleFileSelect(delegateFile, { clearDelegate: false });
      appendLog(`Delegate clone generated for token #${parsedId.toString()}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setDelegateStatus(`Delegate generation failed: ${message}`);
      setDelegateTargetId(null);
      logWarn('mint', 'Delegate generation failed', {
        tokenId: parsedId.toString(),
        error: message
      });
    } finally {
      setDelegatePending(false);
    }
  };

  const requestContractCall = (options: {
    contract?: ContractConfig;
    functionName: string;
    functionArgs: ClarityValue[];
    logDetails?: Record<string, unknown>;
    postConditionMode?: PostConditionMode;
    postConditions?: PostCondition[];
  }) => {
    const targetContract = options.contract ?? props.contract;
    const targetContractId = getContractId(targetContract);
    const network = props.walletSession.network ?? targetContract.network;
    const stxAddress = props.walletSession.address;
    logInfo('mint', 'Requesting contract call', {
      contractId: targetContractId,
      functionName: options.functionName,
      network,
      sender: stxAddress ?? null,
      ...(options.logDetails ?? {})
    });
    return new Promise<TxPayload>((resolve, reject) => {
      showContractCall({
        contractAddress: targetContract.address,
        contractName: targetContract.contractName,
        functionName: options.functionName,
        functionArgs: options.functionArgs,
        network,
        stxAddress,
        postConditionMode: options.postConditionMode,
        postConditions: options.postConditions,
        onFinish: (payload) => {
          const resolved = payload as TxPayload;
          logInfo('mint', 'Contract call broadcast', {
            contractId: targetContractId,
            functionName: options.functionName,
            txId: resolved.txId
          });
          resolve(resolved);
        },
        onCancel: () => {
          logWarn('mint', 'Contract call cancelled', {
            contractId: targetContractId,
            functionName: options.functionName
          });
          reject(new Error('Wallet cancelled or failed to broadcast.'));
        }
      });
    });
  };

  const getMintInputs = () => {
    const walletAddress = props.walletSession.address;
    if (!walletAddress) {
      setMintStatus('Connect a wallet to inscribe.');
      appendLog('Mint blocked: wallet not connected.');
      logWarn('mint', 'Mint blocked: wallet not connected');
      return null;
    }
    if (mismatch) {
      setMintStatus(
        `Network mismatch: wallet on ${mismatch.actual}, contract is ${mismatch.expected}.`
      );
      appendLog('Mint blocked: network mismatch.');
      logWarn('mint', 'Mint blocked: network mismatch', {
        wallet: mismatch.actual,
        contract: mismatch.expected
      });
      return null;
    }
    if (!file || !fileBytes || !expectedHash) {
      setMintStatus('Select a file before continuing an inscription.');
      appendLog('Mint blocked: missing file.');
      logWarn('mint', 'Mint blocked: missing file');
      return null;
    }
    if (maxFileBytes !== null && file.size > maxFileBytes) {
      const maxReadable = formatBytes(BigInt(maxFileBytes));
      const actualReadable = formatBytes(BigInt(file.size));
      setMintStatus(
        `File is too large (${actualReadable}). Max allowed is ${maxReadable}.`
      );
      appendLog('Mint blocked: file too large.');
      logWarn('mint', 'Mint blocked: file too large', {
        fileName: file.name,
        bytes: file.size,
        maxBytes: maxFileBytes
      });
      return null;
    }
    const mimeType = getFileMimeType(file, fileBytes);
    if (!isAscii(mimeType) || mimeType.length > MAX_MIME_LENGTH) {
      setMintStatus('File type must be ASCII and <= 64 characters.');
      appendLog(`Mint blocked: invalid mime type (${mimeType}).`);
      logWarn('mint', 'Mint blocked: invalid mime type', { mimeType });
      return null;
    }
    const tokenUriResolution = resolveMintTokenUri({
      fixedTokenUri,
      choice: tokenUriChoice,
      customValue: tokenUri,
      defaultTokenUri: DEFAULT_TOKEN_URI
    });
    if (!tokenUriResolution.ok) {
      setMintStatus(tokenUriResolution.error);
      appendLog('Mint blocked: no metadata URI selected.');
      logWarn('mint', 'Mint blocked: no token URI selected');
      return null;
    }
    const tokenUriValue = tokenUriResolution.value;
    if (tokenUriChoice === 'default' && !fixedTokenUri) {
      appendLog('Token URI: using Xtrata default metadata (explicit choice).');
    }
    if (!isAscii(tokenUriValue) || tokenUriValue.length > MAX_TOKEN_URI_LENGTH) {
      setMintStatus('Token URI must be ASCII and <= 256 characters.');
      appendLog('Mint blocked: invalid token URI.');
      logWarn('mint', 'Mint blocked: invalid token URI', {
        tokenUriLength: tokenUriValue.length
      });
      return null;
    }
    const dependencyIds = resolvedDependencyIds;
    const parentIds = resolvedParentIds;
    if (delegateTargetId !== null && !delegateMeta) {
      setMintStatus('Delegate target missing. Regenerate the delegate file.');
      appendLog('Mint blocked: delegate target missing.');
      logWarn('mint', 'Mint blocked: delegate target missing');
      return null;
    }
    const dependencyValidation = validateDependencyIds(dependencyIds);
    if (!dependencyValidation.ok) {
      const message =
        dependencyValidation.reason === 'max-50'
          ? 'Dependency list exceeds the maximum of 50 ids.'
          : dependencyValidation.reason === 'duplicate-ids'
            ? 'Dependency list contains duplicate ids.'
            : dependencyValidation.reason === 'negative-id'
              ? 'Dependency list includes a negative id.'
              : 'Dependency list is invalid.';
      setMintStatus(message);
      appendLog(`Mint blocked: ${message}`);
      logWarn('mint', 'Mint blocked: invalid dependencies', {
        reason: dependencyValidation.reason,
        dependencyCount: dependencyIds.length
      });
      return null;
    }
    const parentValidation = validateDependencyIds(parentIds);
    if (!parentValidation.ok) {
      const message =
        parentValidation.reason === 'max-50'
          ? 'Parent list exceeds the maximum of 50 ids.'
          : parentValidation.reason === 'duplicate-ids'
            ? 'Parent list contains duplicate ids.'
            : parentValidation.reason === 'negative-id'
              ? 'Parent list includes a negative id.'
              : 'Parent list is invalid.';
      setMintStatus(message);
      appendLog(`Mint blocked: ${message}`);
      logWarn('mint', 'Mint blocked: invalid parents', {
        reason: parentValidation.reason,
        parentCount: parentIds.length
      });
      return null;
    }
    if (dependencyIds.length > 0) {
      if (dependencyStatusSummary.loading.length > 0) {
        setMintStatus('Waiting for dependency status checks to finish.');
        appendLog('Mint blocked: dependency status checks still loading.');
        logWarn('mint', 'Mint blocked: dependency checks loading');
        return null;
      }
      if (dependencyStatusSummary.legacyOnly.length > 0) {
        const ids = dependencyStatusSummary.legacyOnly
          .map((id) => id.toString())
          .join(', ');
        setMintStatus(
          `Dependency IDs only exist in the legacy contract. Migrate before minting: ${ids}.`
        );
        appendLog('Mint blocked: dependency ids require migration.');
        logWarn('mint', 'Mint blocked: dependency ids require migration', { ids });
        return null;
      }
      if (dependencyStatusSummary.missing.length > 0) {
        const ids = dependencyStatusSummary.missing
          .map((id) => id.toString())
          .join(', ');
        setMintStatus(`Dependency IDs not found on-chain: ${ids}.`);
        appendLog('Mint blocked: dependency ids missing.');
        logWarn('mint', 'Mint blocked: dependency ids missing', { ids });
        return null;
      }
    }
    if (parentIds.length > 0) {
      if (!capabilities.supportsRelationships) {
        setMintStatus('Parent-child relationships require a v3 contract.');
        appendLog('Mint blocked: selected contract does not support parents.');
        logWarn('mint', 'Mint blocked: parent relationships unsupported');
        return null;
      }
      if (parentStatusSummary.loading.length > 0) {
        setMintStatus('Waiting for parent ownership checks to finish.');
        appendLog('Mint blocked: parent ownership checks still loading.');
        logWarn('mint', 'Mint blocked: parent checks loading');
        return null;
      }
      if (parentStatusSummary.legacyOnly.length > 0) {
        const ids = parentStatusSummary.legacyOnly
          .map((id) => id.toString())
          .join(', ');
        setMintStatus(
          `Parent IDs only exist in the legacy contract. Migrate before minting: ${ids}.`
        );
        appendLog('Mint blocked: parent ids require migration.');
        logWarn('mint', 'Mint blocked: parent ids require migration', { ids });
        return null;
      }
      if (parentStatusSummary.missing.length > 0) {
        const ids = parentStatusSummary.missing
          .map((id) => id.toString())
          .join(', ');
        setMintStatus(`Parent IDs not found on-chain: ${ids}.`);
        appendLog('Mint blocked: parent ids missing.');
        logWarn('mint', 'Mint blocked: parent ids missing', { ids });
        return null;
      }
      if (parentStatusSummary.notOwned.length > 0) {
        const ids = parentStatusSummary.notOwned
          .map((id) => id.toString())
          .join(', ');
        setMintStatus(
          `Parent IDs are not in the connected wallet for this mint flow: ${ids}.`
        );
        appendLog('Mint blocked: parent ids not in wallet.');
        logWarn('mint', 'Mint blocked: parent ids not in wallet', { ids });
        return null;
      }
    }
    if (hasDuplicate && !allowDuplicate) {
      setMintStatus(
        'Existing inscription found. Confirm the notice to proceed anyway.'
      );
      appendLog('Mint blocked: existing inscription notice not acknowledged.');
      logWarn('mint', 'Mint blocked: duplicate hash not acknowledged');
      return null;
    }
    return {
      walletAddress,
      mimeType,
      tokenUriValue,
      dependencyIds,
      parentIds
    };
  };

  const checkDependencyPresence = async (dependencyIds: bigint[]) => {
    if (dependencyIds.length === 0) {
      return {
        ok: true,
        missing: [] as bigint[],
        legacyAvailable: [] as bigint[]
      };
    }
    appendLog('Checking dependency IDs on-chain...');
    const metaResults = await runWithConcurrency(
      dependencyIds,
      4,
      (id) => client.getInscriptionMeta(id, readOnlySender)
    );
    const missing = dependencyIds.filter((id, index) => !metaResults[index]);
    if (missing.length === 0) {
      return { ok: true, missing, legacyAvailable: [] as bigint[] };
    }
    let legacyAvailable: bigint[] = [];
    if (legacyClient) {
      const legacyResults = await runWithConcurrency(
        missing,
        4,
        (id) => legacyClient.getInscriptionMeta(id, readOnlySender)
      );
      legacyAvailable = missing.filter((id, index) => !!legacyResults[index]);
    }
    return { ok: false, missing, legacyAvailable };
  };

  const checkParentOwnership = async (parentIds: bigint[]) => {
    if (parentIds.length === 0) {
      return {
        ok: true,
        missing: [] as bigint[],
        notOwned: [] as bigint[]
      };
    }
    const walletAddress = props.walletSession.address;
    if (!walletAddress) {
      return {
        ok: false,
        missing: [] as bigint[],
        notOwned: parentIds
      };
    }
    appendLog('Checking parent ownership on-chain...');
    const ownerResults = await runWithConcurrency(parentIds, 4, (id) =>
      client.getOwner(id, readOnlySender)
    );
    const missing: bigint[] = [];
    const notOwned: bigint[] = [];
    parentIds.forEach((id, index) => {
      const owner = ownerResults[index];
      if (!owner) {
        missing.push(id);
      } else if (!isSameAddress(owner, walletAddress)) {
        notOwned.push(id);
      }
    });
    return {
      ok: missing.length === 0 && notOwned.length === 0,
      missing,
      notOwned
    };
  };

  const getSealFunctionName = (dependencyIds: bigint[], parentIds: bigint[]) => {
    if (parentIds.length > 0) {
      return 'seal-with-relationships';
    }
    return dependencyIds.length > 0 ? 'seal-recursive' : 'seal-inscription';
  };

  const getSealLogLabel = (dependencyIds: bigint[], parentIds: bigint[]) => {
    if (parentIds.length > 0) {
      const parentLabel = parentIds.map((id) => id.toString()).join(', ');
      const dependencyLabel =
        dependencyIds.length > 0
          ? `, deps: ${dependencyIds.map((id) => id.toString()).join(', ')}`
          : '';
      return `Step 3: seal-with-relationships (parents: ${parentLabel}${dependencyLabel})`;
    }
    return dependencyIds.length > 0
      ? `Step 3: seal-recursive (deps: ${dependencyIds
          .map((id) => id.toString())
          .join(', ')})`
      : 'Step 3: seal-inscription';
  };

  const buildSealFunctionArgs = (
    expectedHash: Uint8Array,
    tokenUriValue: string,
    dependencyIds: bigint[],
    parentIds: bigint[]
  ) => {
    if (parentIds.length > 0) {
      return [
        bufferCV(expectedHash),
        stringAsciiCV(tokenUriValue),
        listCV(dependencyIds.map((id) => uintCV(id))),
        listCV(parentIds.map((id) => uintCV(id)))
      ];
    }
    if (dependencyIds.length > 0) {
      return [
        bufferCV(expectedHash),
        stringAsciiCV(tokenUriValue),
        listCV(dependencyIds.map((id) => uintCV(id)))
      ];
    }
    return [bufferCV(expectedHash), stringAsciiCV(tokenUriValue)];
  };

  const formatParentCheckFailure = (check: {
    missing: bigint[];
    notOwned: bigint[];
  }) => {
    if (check.missing.length > 0) {
      return `Parent IDs not found in ${props.contract.label}: ${check.missing
        .map((id) => id.toString())
        .join(', ')}.`;
    }
    return `Parent IDs are not in the connected wallet: ${check.notOwned
      .map((id) => id.toString())
      .join(', ')}.`;
  };

  const getResumeValidationError = (
    state: UploadState,
    mimeType: string
  ) => {
    if (!fileBytes) {
      return 'Select the original file to resume this upload.';
    }
    if (state.mimeType !== mimeType) {
      return 'Selected file does not match the on-chain upload mime type.';
    }
    if (state.totalSize !== BigInt(fileBytes.length)) {
      return 'Selected file size does not match the on-chain upload.';
    }
    if (state.totalChunks !== BigInt(chunks.length)) {
      return 'Selected file chunk count does not match the on-chain upload.';
    }
    if (state.currentIndex > state.totalChunks) {
      return 'On-chain upload state is ahead of the selected file.';
    }
    return null;
  };

  const sendChunkBatchWithRetry = async (
    batch: Uint8Array[],
    label: string,
    details?: {
      batchIndex?: number;
      totalBatches?: number;
      batchBytes?: number;
      resume?: boolean;
    }
  ) => {
    if (!expectedHash) {
      throw new Error('Missing expected hash for batch upload.');
    }
    let attempt = 0;
    while (attempt < MAX_UPLOAD_RETRIES) {
      attempt += 1;
      try {
        const uploadTx = await requestContractCall({
          functionName: 'add-chunk-batch',
          functionArgs: [
            bufferCV(expectedHash),
            listCV(batch.map((chunk) => bufferCV(chunk)))
          ],
          logDetails: {
            action: 'add-chunk-batch',
            label,
            chunkCount: batch.length,
            batchBytes: details?.batchBytes ?? null,
            batchIndex: details?.batchIndex ?? null,
            totalBatches: details?.totalBatches ?? null,
            resume: details?.resume ?? false
          }
        });
        appendLog(`${label} tx sent: ${uploadTx.txId}`);
        return;
      } catch (error) {
        const rawMessage = error instanceof Error ? error.message : String(error);
        const message = isExpiredContractError(rawMessage)
          ? formatExpiredMintMessage()
          : rawMessage;
        appendLog(
          `${label} failed (attempt ${attempt}/${MAX_UPLOAD_RETRIES}): ${message}`
        );
        logWarn('mint', 'Batch upload failed', {
          label,
          attempt,
          error: message
        });
        if (isExpiredContractError(rawMessage)) {
          throw new Error(message);
        }
        if (attempt >= MAX_UPLOAD_RETRIES) {
          throw error;
        }
        appendLog(
          'No problem - retrying this batch after the wallet error. If it stops, re-select the same file and click Resume inscription.'
        );
      }
    }
  };

  const handleStartOver = async () => {
    const walletAddress = props.walletSession.address;
    if (!walletAddress) {
      setMintStatus('Connect a wallet to clear the upload state.');
      appendLog('Start over blocked: wallet not connected.');
      logWarn('mint', 'Start over blocked: wallet not connected');
      return;
    }
    if (mismatch) {
      setMintStatus(
        `Network mismatch: wallet on ${mismatch.actual}, contract is ${mismatch.expected}.`
      );
      appendLog('Start over blocked: network mismatch.');
      logWarn('mint', 'Start over blocked: network mismatch', {
        wallet: mismatch.actual,
        contract: mismatch.expected
      });
      return;
    }
    if (pauseBlocked) {
      setMintStatus('Contract is paused. Only the contract owner can clear uploads.');
      appendLog('Start over blocked: contract paused.');
      logWarn('mint', 'Start over blocked: contract paused');
      return;
    }
    if (!capabilities.supportsAbandonUpload) {
      setMintStatus('This contract does not support clearing uploads.');
      appendLog('Start over blocked: abandon-upload unsupported.');
      logWarn('mint', 'Start over blocked: abandon-upload unsupported');
      return;
    }
    if (!expectedHash) {
      setMintStatus('Select a file before clearing the upload.');
      appendLog('Start over blocked: missing file.');
      logWarn('mint', 'Start over blocked: missing file');
      return;
    }

    setMintPending(true);
    setCleanupPending(true);
    setMintStatus('Clearing expired upload state...');
    appendLog('Clearing in-progress upload state (abandon + purge).');
    logInfo('mint', 'Sending abandon-upload', {
      contractId: getContractId(props.contract),
      expectedHash: bytesToHex(expectedHash)
    });
    try {
      let state = resumeState;
      if (!state) {
        state = await client.getUploadState(
          expectedHash,
          walletAddress,
          readOnlySender
        );
      }
      if (!state) {
        setMintStatus(
          'No active upload state found for this hash. You can start a new mint.'
        );
        appendLog('No upload state found. Nothing to clear.');
        setResumeState(null);
        setCleanupPending(false);
        setResumeCheckKey((prev) => prev + 1);
        return;
      }

      const abandonTx = await requestContractCall({
        functionName: 'abandon-upload',
        functionArgs: [bufferCV(expectedHash)],
        logDetails: {
          action: 'abandon-upload'
        }
      });
      appendLog(`Abandon tx sent: ${abandonTx.txId}`);
      logInfo('mint', 'Abandon upload broadcast', {
        txId: abandonTx.txId
      });

      const totalChunks = Number(state.totalChunks);
      if (!Number.isSafeInteger(totalChunks) || totalChunks < 0) {
        throw new Error('Unable to compute purge batches for upload cleanup.');
      }

      const purgeBatches = toSequentialIndexBatches(totalChunks, MAX_BATCH_SIZE);
      for (let batchIndex = 0; batchIndex < purgeBatches.length; batchIndex += 1) {
        const batch = purgeBatches[batchIndex];
        appendLog(
          `Submitting purge batch ${batchIndex + 1}/${purgeBatches.length}.`
        );
        const purgeTx = await requestContractCall({
          functionName: 'purge-expired-chunk-batch',
          functionArgs: [
            bufferCV(expectedHash),
            principalCV(walletAddress),
            listCV(batch.map((index) => uintCV(BigInt(index))))
          ],
          logDetails: {
            action: 'purge-expired-chunk-batch',
            batchIndex: batchIndex + 1,
            totalBatches: purgeBatches.length
          }
        });
        appendLog(`Purge batch tx sent: ${purgeTx.txId}`);
      }

      setResumeState(null);
      setResumeCheckKey((prev) => prev + 1);
      resetSteps();
      setMintStatus(CLEANUP_PENDING_STATUS);
      void clearMintAttempt(getContractId(props.contract));
      setLastAttempt(null);
      setResumeHint(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        message.toLowerCase().includes('wallet cancelled') ||
        message.toLowerCase().includes('failed to broadcast')
      ) {
        setCleanupPending(false);
      }
      setMintStatus(`Unable to clear upload state: ${message}`);
      appendLog(`Abandon upload failed: ${message}`);
      logWarn('mint', 'Abandon upload failed', { error: message });
    } finally {
      setMintPending(false);
    }
  };

  const startMint = async () => {
    if (pauseBlocked) {
      setMintStatus('Contract is paused. Only the contract owner can mint.');
      appendLog('Mint blocked: contract paused.');
      logWarn('mint', 'Mint blocked: contract paused');
      return;
    }
    if (resumeState) {
      setMintStatus(
        'Existing upload data found. No problem - use Resume inscription to continue.'
      );
      appendLog(
        'Existing upload data found. No problem - click Resume inscription to continue from the saved chunks.'
      );
      logWarn('mint', 'Mint blocked: upload already in progress');
      return;
    }
    const mintInputs = getMintInputs();
    if (!mintInputs || !expectedHash || !fileBytes) {
      return;
    }

    const batchLimit = effectiveBatchSize;
    logInfo('mint', 'Mint start requested', {
      contractId,
      network: props.contract.network,
      wallet: mintInputs.walletAddress,
      fileName: file?.name ?? null,
      mimeType: mintInputs.mimeType,
      bytes: fileBytes.length,
      chunks: chunks.length,
      batchSize: batchLimit,
      batches: batches.length,
      tokenUriLength: mintInputs.tokenUriValue.length,
      dependencyCount: mintInputs.dependencyIds.length,
      parentCount: mintInputs.parentIds.length,
      expectedHash: bytesToHex(expectedHash)
    });
    setMintPending(true);
    setMintStatus('Preparing transactions...');
    resetSteps();
    appendLog('Starting inscription.');

    let activeStage: 'begin' | 'upload' | 'seal' | 'single' = 'begin';

    try {
      if (shouldAutoRouteSmallMint) {
        if (shouldUseHelperSingleTx && !smallMintHelperContract) {
          throw new Error('Small mint helper deployment is unavailable for this network.');
        }
        const helperContractId = shouldUseNativeSingleTx
          ? getContractId(props.contract)
          : getContractId(smallMintHelperContract!);
        activeStage = 'single';
        setBeginState('pending');
        setUploadState('pending');
        setSealState('pending');
        appendLog(
          shouldUseNativeSingleTx
            ? `Native single-tx route active on ${getContractId(props.contract)} (<=${SMALL_MINT_HELPER_MAX_CHUNKS} chunks).`
            : `Small-file helper route active (<=${SMALL_MINT_HELPER_MAX_CHUNKS} chunks).`
        );

        const dependencyCheck = await checkDependencyPresence(
          mintInputs.dependencyIds
        );
        if (!dependencyCheck.ok) {
          const missingList = dependencyCheck.missing
            .map((id) => id.toString())
            .join(', ');
          const legacyList = dependencyCheck.legacyAvailable
            .map((id) => id.toString())
            .join(', ');
          const legacyLabel = legacyContract?.label ?? 'legacy contract';
          const stillMissing = dependencyCheck.missing.filter(
            (id) => !dependencyCheck.legacyAvailable.includes(id)
          );
          const stillMissingList = stillMissing
            .map((id) => id.toString())
            .join(', ');
          const message =
            dependencyCheck.legacyAvailable.length > 0
              ? stillMissing.length > 0
                ? `Dependency IDs missing in ${props.contract.label}: ${stillMissingList}. IDs found in ${legacyLabel}: ${legacyList}. Migrate legacy dependencies before sealing.`
                : `Dependency IDs found in ${legacyLabel} but not yet migrated: ${legacyList}. Migrate them before sealing.`
              : `Dependency IDs not found in ${props.contract.label}: ${missingList}.`;
          setMintStatus(message);
          appendLog(`Mint blocked: ${message}`);
          setBeginState('error');
          setUploadState('error');
          setSealState('error');
          setResumeCheckKey((prev) => prev + 1);
          return;
        }
        const parentCheck = await checkParentOwnership(mintInputs.parentIds);
        if (!parentCheck.ok) {
          const message = formatParentCheckFailure(parentCheck);
          setMintStatus(message);
          appendLog(`Mint blocked: ${message}`);
          setBeginState('error');
          setUploadState('error');
          setSealState('error');
          setResumeCheckKey((prev) => prev + 1);
          return;
        }

        // Native v3+ route pays single-tx-fee-for-chunks; the external helper
        // route runs begin -> upload -> seal on the core and pays the staged
        // fees instead.
        const helperPostConditions = resolveFeePostConditions(
          shouldUseNativeSingleTx
            ? feeCaps.singleTxMicroStx
            : feeCaps.totalMicroStx
        );
        const hasDependencies = mintInputs.dependencyIds.length > 0;
        const hasParents = mintInputs.parentIds.length > 0;
        // Native (v3+): call the core's own mint-single-tx, which does NOT take a
        // target-core principal. Helper (v2.x): call the helper, passing the
        // target core as the first argument.
        const singleTxContract = shouldUseNativeSingleTx
          ? props.contract
          : smallMintHelperContract!;
        const singleTxFunctionName = shouldUseNativeSingleTx
          ? hasParents
            ? 'mint-single-tx-with-relationships'
            : hasDependencies
            ? 'mint-single-tx-recursive'
            : 'mint-single-tx'
          : hasDependencies
            ? 'mint-small-single-tx-recursive'
            : 'mint-small-single-tx';
        const coreArgs = [
          bufferCV(expectedHash),
          stringAsciiCV(mintInputs.mimeType),
          uintCV(BigInt(fileBytes.length)),
          listCV(chunks.map((chunk) => bufferCV(chunk))),
          stringAsciiCV(mintInputs.tokenUriValue)
        ];
        const dependencyArg = listCV(
          mintInputs.dependencyIds.map((id) => uintCV(id))
        );
        const parentArg = listCV(mintInputs.parentIds.map((id) => uintCV(id)));
        const singleTxArgs = shouldUseNativeSingleTx
          ? hasParents
            ? [...coreArgs, dependencyArg, parentArg]
            : hasDependencies
            ? [...coreArgs, dependencyArg]
            : coreArgs
          : hasDependencies
            ? [principalCV(getContractId(props.contract)), ...coreArgs, dependencyArg]
            : [principalCV(getContractId(props.contract)), ...coreArgs];
        const helperTx = await requestContractCall({
          contract: singleTxContract,
          functionName: singleTxFunctionName,
          functionArgs: singleTxArgs,
          postConditionMode: helperPostConditions
            ? PostConditionMode.Deny
            : undefined,
          postConditions: helperPostConditions,
          logDetails: {
            action: singleTxFunctionName,
            helperContractId,
            targetCoreContractId: getContractId(props.contract),
            route: shouldUseNativeSingleTx ? 'native-single-tx' : 'helper-single-tx',
            totalChunks: chunks.length,
            tokenUriLength: mintInputs.tokenUriValue.length,
            dependencyCount: mintInputs.dependencyIds.length,
            parentCount: mintInputs.parentIds.length,
            expectedHash: bytesToHex(expectedHash)
          }
        });

        appendLog(`Single-tx mint sent: ${helperTx.txId}`);
        setBeginState('done');
        setUploadState('done');
        setSealState('done');
        setMintStatus(
          'Single-transaction mint submitted. Await on-chain confirmation.'
        );
        appendLog(
          'Single-tx mint submitted. Final success depends on chain confirmation.'
        );
        props.onInscriptionSealed?.({ txId: helperTx.txId });
        void clearMintAttempt(contractId);
        setLastAttempt(null);
        setResumeHint(null);
        setResumeState(null);
        return;
      }

      setBeginState('pending');
      appendLog('Step 1: begin-inscription');
      const beginPostConditions = resolveFeePostConditions(feeCaps.beginMicroStx);
      const beginTx = await requestContractCall({
        functionName: 'begin-inscription',
        functionArgs: [
          bufferCV(expectedHash),
          stringAsciiCV(mintInputs.mimeType),
          uintCV(BigInt(fileBytes.length)),
          uintCV(BigInt(chunks.length))
        ],
        postConditionMode: beginPostConditions ? PostConditionMode.Deny : undefined,
        postConditions: beginPostConditions,
        logDetails: {
          action: 'begin-inscription',
          mimeType: mintInputs.mimeType,
          totalSize: fileBytes.length,
          totalChunks: chunks.length,
          expectedHash: bytesToHex(expectedHash)
        }
      });
      appendLog(`Begin tx sent: ${beginTx.txId}`);
      setBeginState('done');
      await pauseBeforeNextTx('Next transaction in');

      activeStage = 'upload';
      setUploadState('pending');
      const totalBatches = batches.length;
      if (totalBatches === 0) {
        throw new Error('No batches to upload. Select a non-empty file.');
      }
      setBatchProgress({ current: 0, total: totalBatches });
      for (let index = 0; index < batches.length; index += 1) {
        const batch = batches[index];
        const batchBytes = batch.reduce((sum, chunk) => sum + chunk.length, 0);
        setBatchProgress({ current: index + 1, total: totalBatches });
        appendLog(`Step 2: upload batch ${index + 1}/${totalBatches}`);
        await sendChunkBatchWithRetry(
          batch,
          `Batch ${index + 1}/${totalBatches}`,
          {
            batchIndex: index + 1,
            totalBatches,
            batchBytes,
            resume: false
          }
        );
        if (index < batches.length - 1) {
          await pauseBeforeNextTx('Next batch in');
        }
      }
      setUploadState('done');

      activeStage = 'seal';
      setSealState('pending');
      appendLog(
        getSealLogLabel(mintInputs.dependencyIds, mintInputs.parentIds)
      );
      const dependencyCheck = await checkDependencyPresence(
        mintInputs.dependencyIds
      );
      if (!dependencyCheck.ok) {
        const missingList = dependencyCheck.missing
          .map((id) => id.toString())
          .join(', ');
        const legacyList = dependencyCheck.legacyAvailable
          .map((id) => id.toString())
          .join(', ');
        const legacyLabel = legacyContract?.label ?? 'legacy contract';
        const stillMissing = dependencyCheck.missing.filter(
          (id) => !dependencyCheck.legacyAvailable.includes(id)
        );
        const stillMissingList = stillMissing.map((id) => id.toString()).join(', ');
        const message =
          dependencyCheck.legacyAvailable.length > 0
            ? stillMissing.length > 0
              ? `Dependency IDs missing in ${props.contract.label}: ${stillMissingList}. IDs found in ${legacyLabel}: ${legacyList}. Migrate legacy dependencies before sealing.`
              : `Dependency IDs found in ${legacyLabel} but not yet migrated: ${legacyList}. Migrate them before sealing.`
            : `Dependency IDs not found in ${props.contract.label}: ${missingList}.`;
        setMintStatus(message);
        appendLog(`Mint blocked: ${message}`);
        logWarn('mint', 'Mint blocked: dependency ids missing on-chain', {
          missing: dependencyCheck.missing.map((id) => id.toString()),
          legacyAvailable: dependencyCheck.legacyAvailable.map((id) =>
            id.toString()
          )
        });
        setSealState('error');
        setResumeCheckKey((prev) => prev + 1);
        return;
      }
      const parentCheck = await checkParentOwnership(mintInputs.parentIds);
      if (!parentCheck.ok) {
        const message = formatParentCheckFailure(parentCheck);
        setMintStatus(message);
        appendLog(`Mint blocked: ${message}`);
        logWarn('mint', 'Mint blocked: parent ownership check failed', {
          missing: parentCheck.missing.map((id) => id.toString()),
          notOwned: parentCheck.notOwned.map((id) => id.toString())
        });
        setSealState('error');
        setResumeCheckKey((prev) => prev + 1);
        return;
      }
      await pauseBeforeNextTx('Sealing in');
      const sealPostConditions = resolveFeePostConditions(feeCaps.sealMicroStx);
      const sealFunctionName = getSealFunctionName(
        mintInputs.dependencyIds,
        mintInputs.parentIds
      );
      const sealTx = await requestContractCall({
        functionName: sealFunctionName,
        functionArgs: buildSealFunctionArgs(
          expectedHash,
          mintInputs.tokenUriValue,
          mintInputs.dependencyIds,
          mintInputs.parentIds
        ),
        postConditionMode: sealPostConditions ? PostConditionMode.Deny : undefined,
        postConditions: sealPostConditions,
        logDetails: {
          action: sealFunctionName,
          tokenUriLength: mintInputs.tokenUriValue.length,
          dependencyCount: mintInputs.dependencyIds.length,
          parentCount: mintInputs.parentIds.length,
          expectedHash: bytesToHex(expectedHash)
        }
      });
      appendLog(`Seal tx sent: ${sealTx.txId}`);
      setSealState('done');

      setMintStatus('Seal transaction submitted. Await on-chain confirmation.');
      appendLog('Mint flow submitted. Final success depends on chain confirmation.');
      logInfo('mint', 'Mint flow completed', {
        contractId,
        txId: sealTx.txId
      });
      props.onInscriptionSealed?.({ txId: sealTx.txId });
      void clearMintAttempt(contractId);
      setLastAttempt(null);
      setResumeHint(null);
      setResumeState(null);
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : String(error);
      const expired = isExpiredContractError(rawMessage);
      const message = expired ? formatExpiredMintMessage() : rawMessage;
      setMintStatus(
        `Mint stopped: ${message}. ${
          expired
            ? 'No problem - start over from chunk 0 when ready.'
            : 'No problem - restart the inscription when ready.'
        }`
      );
      appendLog(`Mint failed: ${message}`);
      appendLog(
        expired
          ? 'No problem - this upload window expired. Click Start over to clear it, then begin again from chunk 0.'
          : activeStage === 'begin'
          ? 'No problem - restart the inscription when ready. Re-select the same file and the app will check for any existing upload data.'
          : 'No problem - restart the inscription with the same file. Existing upload data will be found and the button will switch to Resume inscription.'
      );
      logWarn('mint', 'Mint failed', { error: message });
      setTxDelaySeconds(null);
      setTxDelayLabel(null);
      if (activeStage === 'begin') {
        setBeginState('error');
      } else if (activeStage === 'upload') {
        setUploadState('error');
      } else if (activeStage === 'seal') {
        setSealState('error');
      } else if (activeStage === 'single') {
        setBeginState('error');
        setUploadState('error');
        setSealState('error');
      }
      if (activeStage !== 'begin') {
        setResumeCheckKey((prev) => prev + 1);
      }
    } finally {
      setTxDelaySeconds(null);
      setTxDelayLabel(null);
      setMintPending(false);
    }
  };

  const resumeMint = async () => {
    if (pauseBlocked) {
      setMintStatus('Contract is paused. Only the contract owner can resume.');
      appendLog('Resume blocked: contract paused.');
      logWarn('mint', 'Resume blocked: contract paused');
      return;
    }
    const mintInputs = getMintInputs();
    if (!mintInputs || !expectedHash || !fileBytes) {
      return;
    }
    if (!resumeState) {
      setMintStatus('No in-progress upload found for this hash.');
      appendLog('Resume blocked: no upload state.');
      logWarn('mint', 'Resume blocked: no upload state');
      return;
    }
    if (resumeMismatch) {
      setMintStatus(resumeMismatch);
      appendLog(`Resume blocked: ${resumeMismatch}`);
      logWarn('mint', 'Resume blocked: mismatch', { reason: resumeMismatch });
      return;
    }
    if (resumeInfo && 'error' in resumeInfo) {
      const resumeError =
        resumeInfo.error ?? 'Upload state is too large to resume safely.';
      setMintStatus(resumeError);
      appendLog(`Resume blocked: ${resumeError}`);
      logWarn('mint', 'Resume blocked: resume info error', {
        reason: resumeError
      });
      return;
    }

    const batchLimit = effectiveBatchSize;
    logInfo('mint', 'Resume requested', {
      contractId,
      network: props.contract.network,
      wallet: mintInputs.walletAddress,
      fileName: file?.name ?? null,
      mimeType: mintInputs.mimeType,
      bytes: fileBytes.length,
      chunks: chunks.length,
      batchSize: batchLimit,
      tokenUriLength: mintInputs.tokenUriValue.length,
      dependencyCount: mintInputs.dependencyIds.length,
      parentCount: mintInputs.parentIds.length,
      expectedHash: bytesToHex(expectedHash)
    });
    setMintPending(true);
    setMintStatus('Confirming on-chain upload state...');
    resetSteps();
    setBeginState('done');
    appendLog('Resuming inscription.');
    appendLog(
      `Existing upload data found: ${resumeState.currentIndex.toString()}/${resumeState.totalChunks.toString()} chunks already saved.`
    );

    let activeStage: 'upload' | 'seal' = 'upload';

    try {
      const latestState = await client.getUploadState(
        expectedHash,
        mintInputs.walletAddress,
        readOnlySender
      );
      if (!latestState) {
        throw new Error('No on-chain upload state found for this hash.');
      }
      setResumeState(latestState);
      logInfo('mint', 'Upload state loaded', {
        currentIndex: latestState.currentIndex.toString(),
        totalChunks: latestState.totalChunks.toString()
      });
      const resumeError = getResumeValidationError(
        latestState,
        mintInputs.mimeType
      );
      if (resumeError) {
        throw new Error(resumeError);
      }
      const totalChunks = Number(latestState.totalChunks);
      const currentIndex = Number(latestState.currentIndex);
      if (
        !Number.isSafeInteger(totalChunks) ||
        !Number.isSafeInteger(currentIndex)
      ) {
        throw new Error('Upload state is too large to resume safely.');
      }
      if (currentIndex > chunks.length) {
        throw new Error('On-chain upload state exceeds local chunk count.');
      }
      const remainingChunks = chunks.slice(currentIndex);
      const batchLimit = effectiveBatchSize;
      const remainingBatches = batchChunks(remainingChunks, batchLimit);
      const didUploadBatches = remainingBatches.length > 0;
      appendLog(
        `On-chain confirmed: ${currentIndex}/${totalChunks} chunks uploaded. ${remainingBatches.length} batch${remainingBatches.length === 1 ? '' : 'es'} remaining.`
      );
      setMintStatus('Resuming upload batches...');

      if (remainingBatches.length > 0) {
        setUploadState('pending');
        setBatchProgress({ current: 0, total: remainingBatches.length });
        for (let index = 0; index < remainingBatches.length; index += 1) {
          const batch = remainingBatches[index];
          const batchBytes = batch.reduce((sum, chunk) => sum + chunk.length, 0);
          setBatchProgress({ current: index + 1, total: remainingBatches.length });
          appendLog(
            `Resume batch ${index + 1}/${remainingBatches.length}`
          );
          await sendChunkBatchWithRetry(
            batch,
            `Resume batch ${index + 1}/${remainingBatches.length}`,
            {
              batchIndex: index + 1,
              totalBatches: remainingBatches.length,
              batchBytes,
              resume: true
            }
          );
          if (index < remainingBatches.length - 1) {
            await pauseBeforeNextTx('Next batch in');
          }
        }
        setUploadState('done');
      } else {
        setUploadState('done');
        appendLog('All chunks already uploaded. Proceeding to seal.');
      }

      activeStage = 'seal';
      setSealState('pending');
      appendLog(
        getSealLogLabel(mintInputs.dependencyIds, mintInputs.parentIds)
      );
      const dependencyCheck = await checkDependencyPresence(
        mintInputs.dependencyIds
      );
      if (!dependencyCheck.ok) {
        const missingList = dependencyCheck.missing
          .map((id) => id.toString())
          .join(', ');
        const legacyList = dependencyCheck.legacyAvailable
          .map((id) => id.toString())
          .join(', ');
        const legacyLabel = legacyContract?.label ?? 'legacy contract';
        const stillMissing = dependencyCheck.missing.filter(
          (id) => !dependencyCheck.legacyAvailable.includes(id)
        );
        const stillMissingList = stillMissing.map((id) => id.toString()).join(', ');
        const message =
          dependencyCheck.legacyAvailable.length > 0
            ? stillMissing.length > 0
              ? `Dependency IDs missing in ${props.contract.label}: ${stillMissingList}. IDs found in ${legacyLabel}: ${legacyList}. Migrate legacy dependencies before sealing.`
              : `Dependency IDs found in ${legacyLabel} but not yet migrated: ${legacyList}. Migrate them before sealing.`
            : `Dependency IDs not found in ${props.contract.label}: ${missingList}.`;
        setMintStatus(message);
        appendLog(`Resume blocked: ${message}`);
        logWarn('mint', 'Resume blocked: dependency ids missing on-chain', {
          missing: dependencyCheck.missing.map((id) => id.toString()),
          legacyAvailable: dependencyCheck.legacyAvailable.map((id) =>
            id.toString()
          )
        });
        setSealState('error');
        setResumeCheckKey((prev) => prev + 1);
        return;
      }
      const parentCheck = await checkParentOwnership(mintInputs.parentIds);
      if (!parentCheck.ok) {
        const message = formatParentCheckFailure(parentCheck);
        setMintStatus(message);
        appendLog(`Resume blocked: ${message}`);
        logWarn('mint', 'Resume blocked: parent ownership check failed', {
          missing: parentCheck.missing.map((id) => id.toString()),
          notOwned: parentCheck.notOwned.map((id) => id.toString())
        });
        setSealState('error');
        setResumeCheckKey((prev) => prev + 1);
        return;
      }
      if (didUploadBatches) {
        await pauseBeforeNextTx('Sealing in');
      }
      const sealPostConditions = resolveFeePostConditions(feeCaps.sealMicroStx);
      const sealFunctionName = getSealFunctionName(
        mintInputs.dependencyIds,
        mintInputs.parentIds
      );
      const sealTx = await requestContractCall({
        functionName: sealFunctionName,
        functionArgs: buildSealFunctionArgs(
          expectedHash,
          mintInputs.tokenUriValue,
          mintInputs.dependencyIds,
          mintInputs.parentIds
        ),
        postConditionMode: sealPostConditions ? PostConditionMode.Deny : undefined,
        postConditions: sealPostConditions,
        logDetails: {
          action: sealFunctionName,
          tokenUriLength: mintInputs.tokenUriValue.length,
          dependencyCount: mintInputs.dependencyIds.length,
          parentCount: mintInputs.parentIds.length,
          expectedHash: bytesToHex(expectedHash)
        }
      });
      appendLog(`Seal tx sent: ${sealTx.txId}`);
      setSealState('done');

      setMintStatus('Seal transaction submitted. Await on-chain confirmation.');
      appendLog('Resume flow submitted. Final success depends on chain confirmation.');
      logInfo('mint', 'Resume flow completed', {
        contractId,
        txId: sealTx.txId
      });
      props.onInscriptionSealed?.({ txId: sealTx.txId });
      void clearMintAttempt(contractId);
      setLastAttempt(null);
      setResumeHint(null);
      setResumeState(null);
      setResumeCheckKey((prev) => prev + 1);
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : String(error);
      const expired = isExpiredContractError(rawMessage);
      const message = expired ? formatExpiredMintMessage() : rawMessage;
      setMintStatus(
        `Mint stopped: ${message}. ${
          expired
            ? 'No problem - start over from chunk 0 when ready.'
            : 'No problem - keep this file selected and resume again when ready.'
        }`
      );
      appendLog(`Mint failed: ${message}`);
      appendLog(
        expired
          ? 'No problem - this upload window expired. Click Start over to clear it, then begin again from chunk 0.'
          : 'No problem - keep this file selected and click Resume inscription again after the wallet or network issue is clear.'
      );
      logWarn('mint', 'Resume failed', { error: message });
      setTxDelaySeconds(null);
      setTxDelayLabel(null);
      if (activeStage === 'upload') {
        setUploadState('error');
      } else if (activeStage === 'seal') {
        setSealState('error');
      }
      setResumeCheckKey((prev) => prev + 1);
    } finally {
      setTxDelaySeconds(null);
      setTxDelayLabel(null);
      setMintPending(false);
    }
  };

  const mintActionLabel = resumeState
    ? 'Resume inscription'
    : shouldAutoRouteSmallMint
      ? 'Begin single-tx inscription'
      : 'Begin inscription';
  const mintActionPendingLabel = resumeState
    ? 'Resuming...'
    : shouldAutoRouteSmallMint
      ? 'Submitting single-tx...'
      : 'Minting...';
  const allowDuplicateOverride = disableDuplicateOverride ? false : allowDuplicate;
  const mintActionDisabled =
    mintPending ||
    cleanupPending ||
    isPreparing ||
    delegatePending ||
    !file ||
    !expectedHash ||
    !props.walletSession.address ||
    !!mismatch ||
    pauseBlocked ||
    duplicateState === 'checking' ||
    (hasDuplicate && !allowDuplicateOverride) ||
    (resumeState ? resumeBlocked : false);
  const startOverUnsupported = !capabilities.supportsAbandonUpload;
  const startOverDisabled =
    mintPending ||
    isPreparing ||
    delegatePending ||
    !expectedHash ||
    !props.walletSession.address ||
    !!mismatch ||
    pauseBlocked ||
    startOverUnsupported;
  const metadataDisabled = isPreparing || !file || !expectedHashHex;
  const formattedTxDelay =
    txDelaySeconds === null ? null : txDelaySeconds.toString().padStart(2, '0');
  const isImagePreview = Boolean(previewUrl && file?.type.startsWith('image/'));
  const isAudioPreview = Boolean(previewUrl && file?.type.startsWith('audio/'));
  const isVideoPreview = Boolean(previewUrl && file?.type.startsWith('video/'));
  const isRenderedHtmlPreview = Boolean(previewHtmlUrl && !showHtmlSource);
  const useSquareMintPreview =
    isImagePreview || isVideoPreview || isRenderedHtmlPreview;

  return (
    <section
      className={`panel mint app-section app-section--fit${props.collapsed ? ' panel--collapsed' : ''}`}
      id="inscribe"
    >
      <span id="mint" aria-hidden="true" />
      <div className="panel__header">
        <div>
          <div className="info-heading">
            <h2>Inscribe data</h2>
            <InfoTip
              label="About inscribing data"
              text={
                shouldAutoRouteSmallMint
                  ? `Small-file helper route is active for <=${SMALL_MINT_HELPER_MAX_CHUNKS} chunks: one transaction performs init, upload, and seal.`
                  : 'Full inscription workflow: prepare file, review plan and fees, then run init, upload batches, and seal transactions.'
              }
            />
          </div>
          <p>Upload a file, review fees, and inscribe on-chain.</p>
          <p className="meta-value">
            Public inscriptions are open. Collection contracts are available now. Contact Jim.BTC
            (@JimDotBTC) to request Creator Portal access.
          </p>
        </div>
        <div className="panel__actions">
          <span className={`badge badge--${props.contract.network}`}>
            {props.contract.network}
          </span>
          <button
            className="button button--ghost button--collapse"
            type="button"
            onClick={props.onToggleCollapse}
            aria-expanded={!props.collapsed}
          >
            {props.collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>
      <div className="panel__body">
        <fieldset className="mint-source-choice">
          <legend>
            <LabelWithInfo
              tone="field"
              label="What would you like to inscribe?"
              info="Inscribe an existing file, or paste text to inscribe directly."
            />
          </legend>
          <div
            className="mint-source-choice__options"
            role="radiogroup"
            aria-label="Inscription source"
          >
            <label className="mint-source-choice__option">
              <input
                type="radio"
                name="inscribe-source"
                checked={inscribeSource === 'file'}
                onChange={() => setInscribeSource('file')}
              />
              <span>File</span>
            </label>
            <label className="mint-source-choice__option">
              <input
                type="radio"
                name="inscribe-source"
                checked={inscribeSource === 'text'}
                onChange={() => setInscribeSource('text')}
              />
              <span>Paste text</span>
            </label>
          </div>
        </fieldset>
        {inscribeSource === 'file' && (
          <label className="field">
            <LabelWithInfo
              tone="field"
              label="Select a file"
              info="Choose the asset to inscribe. The file is chunked and uploaded on-chain during mint."
            />
            <input className="input" type="file" onChange={onFileChange} />
          </label>
        )}
        {inscribeSource === 'text' && (
          <div className="mint-text-input">
            <label className="field">
              <LabelWithInfo
                tone="field"
                label="Text to inscribe"
                info="Pasted text is turned into a file and inscribed through the same on-chain pipeline as a picked file."
              />
              <textarea
                className="textarea"
                placeholder="Paste or type the text to inscribe..."
                value={textPayload}
                onChange={(event) => setTextPayload(event.target.value)}
                rows={6}
              />
            </label>
            <label className="field">
              <LabelWithInfo
                tone="field"
                label="Content type"
                info="The MIME type stored on-chain for this text inscription."
              />
              <select
                className="input"
                value={textMime}
                onChange={(event) => setTextMime(event.target.value)}
              >
                {TEXT_MIME_PRESETS.map((preset) => (
                  <option key={preset.mime} value={preset.mime}>
                    {preset.label} ({preset.mime})
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <LabelWithInfo
                tone="field"
                label="Filename (optional)"
                info="Name stored for the inscription. Defaults from the content type if left blank."
              />
              <input
                className="input"
                placeholder={defaultTextFileName(textMime)}
                value={textFileName}
                onChange={(event) => setTextFileName(event.target.value)}
              />
            </label>
            <span className="meta-value">
              {textPayload.length} characters · {textPayloadBytes} bytes
            </span>
            <div className="mint-actions">
              <button
                className="button"
                type="button"
                onClick={handlePrepareText}
                disabled={!textPayload || isPreparing}
              >
                Use this text
              </button>
            </div>
          </div>
        )}
        {maxFileBytes !== null && (
          <span className="meta-value">
            Max file size: {formatBytes(BigInt(maxFileBytes))}.
          </span>
        )}
        {isPreparing && <p>Preparing file for inscription...</p>}

        <details className="mint-advanced">
          <summary className="mint-advanced__summary">
            Advanced: relationships &amp; delegate
          </summary>
        {!hideDelegate && (
          <div className="mint-panel mint-delegate">
            <LabelWithInfo
              tone="meta"
              label="Delegate clone"
              info="Build a lightweight recursive HTML inscription that mirrors content from an existing token ID."
            />
            <p className="meta-value">
              Generate a tiny recursive HTML wrapper that mirrors an existing
              inscription.
            </p>
            <label className="field">
              <LabelWithInfo
                tone="field"
                label="Original token ID"
                info="Token ID to mirror. The generated delegate file reads the target token chunks at render time."
              />
              <input
                className="input"
                placeholder="e.g. 12"
                value={delegateTargetIdInput}
                onChange={(event) => {
                  setDelegateTargetIdInput(event.target.value);
                  setDelegateStatus(null);
                }}
              />
            </label>
            <div className="mint-actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={() => void handleGenerateDelegate()}
                disabled={delegatePending}
              >
                {delegatePending ? 'Generating...' : 'Generate delegate file'}
              </button>
              {delegateTargetId !== null && (
            <button
              className="button button--ghost"
              type="button"
              onClick={() => {
                setDelegateTargetId(null);
                setDelegateMeta(null);
                setDelegateStatus(null);
              }}
            >
              Clear delegate
            </button>
          )}
            </div>
            {delegateStatus && (
              <span className="meta-value">{delegateStatus}</span>
            )}
            {delegateMeta && delegateTargetId !== null && (
              <div className="mint-kv">...</div>
            )}
          </div>
        )}

        <div className="mint-panel mint-dependencies">
          <LabelWithInfo
            tone="meta"
            label="Dependencies (optional)"
            info="Dependency token IDs create recursive links and only need to exist on-chain."
          />
          <p className="meta-value">
            Add recursive dependency IDs. These can be owned by any wallet.
          </p>
          <label className="field">
            <LabelWithInfo
              tone="field"
              label="Dependency IDs"
              info="Enter one or more existing token IDs separated by spaces, commas, or new lines."
            />
            <textarea
              className="textarea"
              placeholder="e.g. 12, 48 102"
              value={dependencyInput}
              onChange={(event) => {
                setDependencyInput(event.target.value);
                setDependencyUiError(null);
              }}
            />
          </label>
          <div className="mint-actions">
            <button
              className="button button--ghost"
              type="button"
              onClick={applyDependencyInput}
              disabled={!dependencyInput.trim()}
            >
              Add dependencies
            </button>
            {manualDependencyIds.length > 0 && (
              <button
                className="button button--ghost"
                type="button"
                onClick={clearManualDependencies}
              >
                Clear dependencies
              </button>
            )}
          </div>
          {dependencyUiError && (
            <span className="meta-value">{dependencyUiError}</span>
          )}
          {manualDependencyIds.length > 0 && (
            <div className="mint-actions">
              {manualDependencyIds.map((id) => (
                <button
                  key={id.toString()}
                  className="button button--ghost"
                  type="button"
                  onClick={() => removeManualDependency(id)}
                >
                  {id.toString()}
                </button>
              ))}
            </div>
          )}
          {resolvedDependencyIds.length > 0 && (
            <span className="meta-value">
              Resolved dependencies: {resolvedDependencyIds.map((id) => id.toString()).join(', ')}
            </span>
          )}
          {resolvedDependencyIds.length > 0 && (
            <div className="relation-panel">
              <LabelWithInfo
                tone="meta"
                label="Dependency thumbnails"
                info="Preview cards for selected dependencies, including existence and migration status checks."
              />
              {dependencyStatusSummary.loading.length > 0 && (
                <span className="meta-value">Loading dependency status...</span>
              )}
              {dependencyStatusSummary.legacyOnly.length > 0 && (
                <span className="relation-status relation-status--warn">
                  Needs migration: {dependencyStatusSummary.legacyOnly.map((id) => id.toString()).join(', ')}
                </span>
              )}
              {dependencyStatusSummary.missing.length > 0 && (
                <span className="relation-status relation-status--error">
                  Missing on-chain: {dependencyStatusSummary.missing.map((id) => id.toString()).join(', ')}
                </span>
              )}
              {!showRelationshipPreviews && (
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => setShowRelationshipPreviews(true)}
                >
                  Show previews
                </button>
              )}
              {showRelationshipPreviews && (
              <div className="relation-grid">
                {visibleDependencyItems.map((item) => (
                  <div key={item.id.toString()} className="relation-card">
                    <div className="relation-frame">
                      {item.summary ? (
                        <TokenCardMedia
                          token={item.summary}
                          contractId={item.summaryContractId}
                          senderAddress={readOnlySender}
                          client={item.summaryClient}
                          isActiveTab={!props.collapsed}
                        />
                      ) : (
                        <span className="relation-placeholder">
                          {item.status === 'loading' ? 'Loading...' : 'No preview'}
                        </span>
                      )}
                    </div>
                    <span className="relation-label">#{item.id.toString()}</span>
                    {item.status === 'available' && (
                      <span className="relation-status relation-status--ok">Found</span>
                    )}
                    {item.status === 'legacy' && (
                      <span className="relation-status relation-status--warn">Legacy only</span>
                    )}
                    {item.status === 'missing' && (
                      <span className="relation-status relation-status--error">Missing</span>
                    )}
                    {item.status === 'loading' && (
                      <span className="relation-status">Checking...</span>
                    )}
                  </div>
                ))}
              </div>
              )}
              {showRelationshipPreviews && dependencyPreviewRemaining > 0 && (
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() =>
                    setDependencyPreviewCount(
                      (count) => count + RELATIONSHIP_PREVIEW_PAGE
                    )
                  }
                >
                  Load more ({dependencyPreviewRemaining} more)
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mint-panel mint-dependencies">
          <LabelWithInfo
            tone="meta"
            label="Parents (optional)"
            info="Parent token IDs create v3 parent-child links and must exist in the connected wallet."
          />
          <p className="meta-value">
            Add parent IDs only when this inscription should become a child of inscriptions you own.
          </p>
          {!capabilities.supportsRelationships && (
            <span className="relation-status relation-status--warn">
              Parent-child links require a v3 relationship-aware contract.
            </span>
          )}
          <label className="field">
            <LabelWithInfo
              tone="field"
              label="Parent IDs"
              info="Enter one or more existing token IDs separated by spaces, commas, or new lines."
            />
            <textarea
              className="textarea"
              placeholder="e.g. 12, 48 102"
              value={parentInput}
              onChange={(event) => {
                setParentInput(event.target.value);
                setParentUiError(null);
              }}
              disabled={!capabilities.supportsRelationships}
            />
          </label>
          <div className="mint-actions">
            <button
              className="button button--ghost"
              type="button"
              onClick={applyParentInput}
              disabled={!parentInput.trim() || !capabilities.supportsRelationships}
            >
              Add parents
            </button>
            {manualParentIds.length > 0 && (
              <button
                className="button button--ghost"
                type="button"
                onClick={clearManualParents}
              >
                Clear parents
              </button>
            )}
          </div>
          {parentUiError && <span className="meta-value">{parentUiError}</span>}
          {manualParentIds.length > 0 && (
            <div className="mint-actions">
              {manualParentIds.map((id) => (
                <button
                  key={id.toString()}
                  className="button button--ghost"
                  type="button"
                  onClick={() => removeManualParent(id)}
                >
                  {id.toString()}
                </button>
              ))}
            </div>
          )}
          {importedParentIds.length > 0 && (
            <div className="mint-actions">
              <span className="meta-value">
                Imported parents: {importedParentIds.map((id) => id.toString()).join(', ')}
              </span>
              {props.onClearParentDrafts && (
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={props.onClearParentDrafts}
                >
                  Clear imported
                </button>
              )}
            </div>
          )}
          {resolvedParentIds.length > 0 && (
            <span className="meta-value">
              Resolved parents: {resolvedParentIds.map((id) => id.toString()).join(', ')}
            </span>
          )}
          {resolvedParentIds.length > 0 && (
            <div className="relation-panel">
              <LabelWithInfo
                tone="meta"
                label="Parent thumbnails"
                info="Preview cards for selected parents, including wallet ownership and migration status checks."
              />
              {parentStatusSummary.loading.length > 0 && (
                <span className="meta-value">Loading parent status...</span>
              )}
              {parentStatusSummary.legacyOnly.length > 0 && (
                <span className="relation-status relation-status--warn">
                  Needs migration: {parentStatusSummary.legacyOnly.map((id) => id.toString()).join(', ')}
                </span>
              )}
              {parentStatusSummary.missing.length > 0 && (
                <span className="relation-status relation-status--error">
                  Missing on-chain: {parentStatusSummary.missing.map((id) => id.toString()).join(', ')}
                </span>
              )}
              {parentStatusSummary.notOwned.length > 0 && (
                <span className="relation-status relation-status--error">
                  Not in connected wallet: {parentStatusSummary.notOwned.map((id) => id.toString()).join(', ')}
                </span>
              )}
              {!showRelationshipPreviews && (
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => setShowRelationshipPreviews(true)}
                >
                  Show previews
                </button>
              )}
              {showRelationshipPreviews && (
              <div className="relation-grid">
                {visibleParentItems.map((item) => (
                  <div key={item.id.toString()} className="relation-card">
                    <div className="relation-frame">
                      {item.summary ? (
                        <TokenCardMedia
                          token={item.summary}
                          contractId={item.summaryContractId}
                          senderAddress={readOnlySender}
                          client={item.summaryClient}
                          isActiveTab={!props.collapsed}
                        />
                      ) : (
                        <span className="relation-placeholder">
                          {item.status === 'loading' ? 'Loading...' : 'No preview'}
                        </span>
                      )}
                    </div>
                    <span className="relation-label">#{item.id.toString()}</span>
                    {item.status === 'owned' && (
                      <span className="relation-status relation-status--ok">In wallet</span>
                    )}
                    {item.status === 'not-owned' && (
                      <span className="relation-status relation-status--error">Not in wallet</span>
                    )}
                    {item.status === 'legacy' && (
                      <span className="relation-status relation-status--warn">Legacy only</span>
                    )}
                    {item.status === 'missing' && (
                      <span className="relation-status relation-status--error">Missing</span>
                    )}
                    {item.status === 'loading' && (
                      <span className="relation-status">Checking...</span>
                    )}
                  </div>
                ))}
              </div>
              )}
              {showRelationshipPreviews && parentPreviewRemaining > 0 && (
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() =>
                    setParentPreviewCount(
                      (count) => count + RELATIONSHIP_PREVIEW_PAGE
                    )
                  }
                >
                  Load more ({parentPreviewRemaining} more)
                </button>
              )}
            </div>
          )}
        </div>
        </details>

        {file && (
          <div className="mint-grid">
            <div className="mint-panel">
              <div className="mint-preview__header">
                <LabelWithInfo
                  tone="meta"
                  label="Preview"
                  info="Local preview of the selected file before any transactions are sent."
                />
                <div className="mint-preview__actions">
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={handleBackToViewer}
                  >
                    Back to viewer
                  </button>
                  {previewHtml && (
                    <button
                      className="button button--ghost"
                      type="button"
                      onClick={() => setShowHtmlSource((value) => !value)}
                    >
                      {showHtmlSource ? 'Render HTML' : 'View source'}
                    </button>
                  )}
                </div>
              </div>
              <div
                className={`mint-preview${useSquareMintPreview ? ' mint-preview--square' : ''}`}
              >
                {!previewUrl && !previewText && !previewHtml && (
                  <span className="mint-placeholder">No preview available.</span>
                )}
                {isImagePreview && (
                  <img
                    className="mint-preview__media"
                    src={previewUrl ?? undefined}
                    alt={file.name}
                  />
                )}
                {isAudioPreview && (
                  <audio controls src={previewUrl ?? undefined} />
                )}
                {isVideoPreview && (
                  <video
                    className="mint-preview__media"
                    controls
                    src={previewUrl ?? undefined}
                  />
                )}
                {isRenderedHtmlPreview && (
                  <iframe
                    className="mint-preview__media mint-preview__media--frame"
                    title="Mint HTML preview"
                    sandbox="allow-scripts"
                    referrerPolicy="no-referrer"
                    src={previewHtmlUrl ?? undefined}
                  />
                )}
                {previewHtml && showHtmlSource && (
                  <>
                    {previewHtmlTruncatedBytes !== null && (
                      <span className="mint-placeholder">
                        Source preview truncated to the first{' '}
                        {formatBytes(BigInt(PREVIEW_SOURCE_BUDGET))} of{' '}
                        {formatBytes(BigInt(previewHtmlTruncatedBytes))}. The full
                        file will still be inscribed.
                      </span>
                    )}
                    <pre className="mint-text">{previewHtml}</pre>
                  </>
                )}
                {!previewHtml && previewText && (
                  <pre className="mint-text">{previewText}</pre>
                )}
              </div>
            </div>
            <div className="mint-panel">
              <LabelWithInfo
                tone="meta"
                label="Inscription plan"
                info="Calculated upload plan and file stats derived from the selected file and mint settings."
              />
              <div className="mint-kv">
                <div>
                  <LabelWithInfo
                    tone="meta"
                    label="File"
                    info="Original filename from your local upload."
                  />
                  <span className="meta-value">{file.name}</span>
                </div>
                <div>
                  <LabelWithInfo
                    tone="meta"
                    label="Type"
                    info="Detected MIME type used when rendering and sealing the inscription."
                  />
                  <span className="meta-value">
                    {getFileMimeType(file, fileBytes)}
                  </span>
                </div>
                <div>
                  <LabelWithInfo
                    tone="meta"
                    label="Size"
                    info="Total file bytes that will be committed across inscription chunks."
                  />
                  <span className="meta-value">
                    {formatBytes(totalBytes)}
                  </span>
                </div>
                <div>
                  <LabelWithInfo
                    tone="meta"
                    label="Chunks"
                    info="Number of on-chain chunk records required for this file."
                  />
                  <span className="meta-value">{chunks.length}</span>
                </div>
                <div>
                  <LabelWithInfo
                    tone="meta"
                    label="Chunk size"
                    info="Per-chunk byte size used by the upload process."
                  />
                  <span className="meta-value">{CHUNK_SIZE} bytes</span>
                </div>
                <div>
                  <LabelWithInfo
                    tone="meta"
                    label="Batches"
                    info="Estimated number of upload transactions based on current batch size."
                  />
                  <span className="meta-value">{uploadBatchCount}</span>
                </div>
                {shouldAutoRouteSmallMint && (
                  <div>
                    <LabelWithInfo
                      tone="meta"
                      label="Route"
                      info="Small-file helper route uses one transaction and internally executes begin, upload, and seal."
                    />
                    <span className="meta-value">
                      Single transaction via {singleTxRouteContractId}
                    </span>
                  </div>
                )}
                {resolvedDependencyIds.length > 0 && (
                  <div>
                    <LabelWithInfo
                      tone="meta"
                      label="Dependencies"
                      info="Resolved dependency token IDs that will be linked during seal."
                    />
                    <span className="meta-value">
                      {resolvedDependencyIds
                        .map((id) => id.toString())
                        .join(', ')}
                    </span>
                  </div>
                )}
                {resolvedParentIds.length > 0 && (
                  <div>
                    <LabelWithInfo
                      tone="meta"
                      label="Parents"
                      info="Resolved parent token IDs that will be linked during seal."
                    />
                    <span className="meta-value">
                      {resolvedParentIds
                        .map((id) => id.toString())
                        .join(', ')}
                    </span>
                  </div>
                )}
                {expectedHashHex && (
                  <div>
                    <LabelWithInfo
                      tone="meta"
                      label="Expected hash"
                      info="SHA-256 hash of the file used for integrity and duplicate detection."
                    />
                    <span className="meta-value mint-hash">
                      {expectedHashHex}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <details className="mint-advanced">
          <summary className="mint-advanced__summary">
            Advanced: metadata &amp; batch settings
          </summary>
        <div className="mint-settings">
          {!hideTokenUri && (
            <label className="field">
              <LabelWithInfo
                tone="field"
                label="Metadata (token URI)"
                info="Metadata URI stored with the inscription. Choose Xtrata's shared default metadata, or supply your own stable URL / ar:// reference."
              />
              <div
                className="token-uri-choice"
                role="radiogroup"
                aria-label="Metadata source"
              >
                <label className="token-uri-choice__option">
                  <input
                    type="radio"
                    name="token-uri-choice"
                    checked={tokenUriChoice === 'default'}
                    onChange={() => {
                      setTokenUriChoice('default');
                      setTokenUriStatus(null);
                      setTokenUriStatusTone('idle');
                    }}
                  />
                  <span>Use Xtrata default metadata</span>
                </label>
                <label className="token-uri-choice__option">
                  <input
                    type="radio"
                    name="token-uri-choice"
                    checked={tokenUriChoice === 'custom'}
                    onChange={() => setTokenUriChoice('custom')}
                  />
                  <span>Enter my own URI</span>
                </label>
              </div>
              {tokenUriChoice === 'default' && (
                <span className="meta-value">
                  Xtrata default metadata will be inscribed:{' '}
                  <span className="mint-hash">{DEFAULT_TOKEN_URI}</span>
                </span>
              )}
              {tokenUriChoice === 'custom' && (
                <input
                  className="input"
                  placeholder="https://example.com/metadata.json"
                  value={tokenUri}
                  onChange={(event) => {
                    setTokenUri(event.target.value);
                    setTokenUriStatus(null);
                    setTokenUriStatusTone('idle');
                  }}
                />
              )}
              {tokenUriChoice === 'custom' && !hideMetadataTools && (
                <div className="token-uri-actions">
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={() => void resolveTokenUri()}
                  >
                    Resolve token URI
                  </button>
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={generateSip16Metadata}
                    disabled={metadataDisabled}
                  >
                    Generate SIP-016 metadata
                  </button>
                  {tokenUriStatus && (
                    <span
                      className={`token-uri-status token-uri-status--${tokenUriStatusTone}`}
                    >
                      {tokenUriStatus}
                    </span>
                  )}
                </div>
              )}
              {tokenUriChoice === 'custom' &&
                !hideMetadataTools &&
                metadataStatus && (
                  <span className="meta-value">{metadataStatus}</span>
                )}
              {tokenUriChoice === 'custom' && !hideMetadataTools && metadataJson && (
                <>
                  <LabelWithInfo
                    tone="meta"
                    label="Generated SIP-016 metadata"
                    info="Auto-generated metadata JSON template you can copy, download, host, and use as the token URI."
                  />
                  <details className="mint-metadata" open>
                    <summary>View metadata JSON</summary>
                    <div className="mint-metadata__body">
                      <div className="mint-actions">
                        <button
                          className="button button--ghost"
                          type="button"
                          onClick={() => void copySip16Metadata()}
                        >
                          Copy JSON
                        </button>
                        <button
                          className="button button--ghost"
                          type="button"
                          onClick={downloadSip16Metadata}
                        >
                          Download JSON
                        </button>
                        <button
                          className="button button--ghost"
                          type="button"
                          onClick={clearSip16Metadata}
                        >
                          Clear
                        </button>
                      </div>
                      <pre className="mint-text mint-metadata__pre">
                        {metadataJson}
                      </pre>
                    </div>
                  </details>
                </>
              )}
            </label>
          )}
          {!hideBatchSize ? (
            <label className="field">
              <LabelWithInfo
                tone="field"
                label="Batch size"
                info="How many chunks to include in each upload transaction. Higher values reduce tx count but increase tx size."
              />
              <select
                className="select"
                value={batchSize}
                onChange={(event) => setBatchSize(Number(event.target.value))}
              >
                {BATCH_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value} chunks / tx
                  </option>
                ))}
              </select>
              <span className="meta-value">
                Max {MAX_UPLOAD_BATCH_SIZE} chunks per batch.
              </span>
            </label>
          ) : (
            <div className="mint-panel">
              <LabelWithInfo
                tone="meta"
                label="Batch size"
                info="Batch size locked by module restrictions for this mint mode."
              />
              <span className="meta-value">
                {effectiveBatchSize} chunks / tx
              </span>
            </div>
          )}
        </div>
        </details>

        <details className="mint-fees-disclosure" open>
          <summary className="mint-advanced__summary">
            Fee breakdown &amp; estimate
          </summary>
        <div className="mint-cost-controls">
          <div
            className="currency-toggle"
            role="radiogroup"
            aria-label="Display currency"
          >
            <span className="meta-value">Show fiat in:</span>
            {(['USD', 'GBP'] as const).map((code) => (
              <label key={code} className="currency-toggle__option">
                <input
                  type="radio"
                  name="display-currency"
                  checked={displayCurrency === code}
                  onChange={() => setDisplayCurrency(code)}
                />
                <span>{code}</span>
              </label>
            ))}
          </div>
          {combinedFeeFiat && (
            <span className="meta-value">
              Estimated total: {combinedFeeDisplay.primary} (~{combinedFeeFiat})
            </span>
          )}
          {displayCurrency === 'GBP' &&
            !gbpRateQuery.data &&
            hasChunks && (
              <span className="meta-value">
                GBP rate unavailable right now — showing USD only.
              </span>
            )}
          {paymentAssets.length > 1 && (
            <label className="field">
              <LabelWithInfo
                tone="field"
                label="Pay protocol fee with"
                info="Choose the asset used to pay the protocol fee. Only assets the connected contract accepts are listed."
              />
              <select
                className="input"
                value={paymentAssetSymbol}
                onChange={(event) =>
                  setPaymentAssetSymbol(event.target.value)
                }
              >
                {paymentAssets.map((asset) => (
                  <option key={asset.symbol} value={asset.symbol}>
                    {asset.symbol}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="mint-fees">
          <div>
            <LabelWithInfo
              tone="meta"
              label="Fee unit"
              info="Per-call contract fee unit from the active contract. Used to estimate mint contract fees."
            />
            <span className="meta-value">
              {feeUnitValue !== null ? formatMicroStx(feeUnitValue) : 'Unknown'}
            </span>
            {adminStatusQuery.isFetching && (
              <span className="meta-value">Fetching fee unit...</span>
            )}
            {feeUnitError && <span className="meta-value">{feeUnitError}</span>}
          </div>
          <div>
            <LabelWithInfo
              tone="meta"
              label="Init fee"
              info="Estimated contract fee for begin-inscription transaction."
            />
            <span className="meta-value">
              {formatStx(feeEstimate.beginMicroStx)}
            </span>
          </div>
          <div>
            <LabelWithInfo
              tone="meta"
              label="Seal fee"
              info="Estimated contract fee for upload batches plus final seal call."
            />
            <span className="meta-value">
              {hasChunks ? (
                <>
                  Seal fee + {firstBatchChunks(chunks.length)} chunk fee
                  {firstBatchChunks(chunks.length) === 1 ? '' : 's'}
                  {feeEstimate.feeBatches > 0
                    ? ` + ${feeEstimate.feeBatches} batch fee${
                        feeEstimate.feeBatches === 1 ? '' : 's'
                      }`
                    : ''}{' '}
                  = {formatStx(feeEstimate.sealMicroStx)}
                </>
              ) : (
                'Select a file to estimate.'
              )}
            </span>
          </div>
          <div>
            <LabelWithInfo
              tone="meta"
              label="Total contract fees"
              info="Estimated total contract-side fees for init, all upload batches, and seal."
            />
            <span className="meta-value">
              {formatStx(feeEstimate.totalMicroStx)}
            </span>
          </div>
          <div>
            <LabelWithInfo
              tone="meta"
              label="Sequential txns"
              info="Begin plus upload batches plus seal, using the prepared file chunk count and current chunks-per-transaction setting."
            />
            <span className="meta-value">
              {hasChunks ? (
                <>
                  {sequentialMintTxEstimate.beginTransactions} init +{' '}
                  {sequentialMintTxEstimate.uploadTransactions} upload +{' '}
                  {sequentialMintTxEstimate.sealTransactions} seal ={' '}
                  {sequentialMintTxEstimate.totalTransactions} txns at{' '}
                  {sequentialMintTxEstimate.batchSize} chunks/tx
                </>
              ) : (
                'Select a file to estimate.'
              )}
            </span>
          </div>
          <div>
            <LabelWithInfo
              tone="meta"
              label="Data mining estimate"
              info="Ballpark variable mining fee for the data payload only, using 1 STX per MB and the current STX/USD price when available."
            />
            <span className="meta-value">
              {hasChunks
                ? `${dataMiningFeeDisplay.combined} at 1 STX/MB`
                : 'Select a file to estimate.'}
            </span>
            {hasChunks &&
              !dataMiningFeeDisplay.secondary &&
              mintUsdPriceBookQuery.isFetching && (
                <span className="meta-value">Fetching STX/USD...</span>
              )}
          </div>
          <div>
            <LabelWithInfo
              tone="meta"
              label="Est. total fees"
              info="Contract protocol fees plus the ballpark data mining estimate. Wallet mining quotes can vary by network conditions."
            />
            <span className="meta-value">
              {hasChunks
                ? combinedFeeDisplay.combined
                : 'Select a file to estimate.'}
            </span>
          </div>
          {!hideFeeRateFetch && (
            <div className="fee-fetch">
              <button
                className="button button--ghost"
                type="button"
                onClick={() => void fetchFeeRate()}
                disabled={feeRatePending}
              >
                {feeRatePending ? 'Fetching fee rate...' : 'Fetch fee rate'}
              </button>
              {feeRateStatus && (
                <span className="meta-value">{feeRateStatus}</span>
              )}
              {feeRate && networkFeeEstimate && (
                <span className="meta-value">
                  Estimated network fees: {formatMicroStx(networkFeeEstimate)}
                  {feeRateUpdatedAt
                    ? ` (updated ${Math.round(
                        (Date.now() - feeRateUpdatedAt) / 1000
                      )}s ago)`
                    : ''}
                </span>
              )}
            </div>
          )}
        </div>
        </details>

        {shouldAutoRouteSmallMint ? (
          <div className="alert">
            <strong>Single transaction route.</strong> This file is within the
            helper limit ({SMALL_MINT_HELPER_MAX_CHUNKS} chunks), so minting
            will run in one wallet approval via {singleTxRouteContractId}.
          </div>
        ) : (
          <div className="alert alert--supportive">
            <strong>Automated sequence.</strong> After you approve the first
            transaction, all remaining transactions will appear automatically in
            order. If anything goes wrong, it is no problem: restart this
            inscription, re-select the exact same file, and the app will find
            existing upload data so you can use Resume inscription.
          </div>
        )}

        {resumeHint && <div className="alert alert--supportive">{resumeHint}</div>}

        <div className="mint-steps">
          <div className={`mint-step mint-step--${beginState}`}>
            <span className="info-label">
              <span>1. Initialization</span>
              <InfoTip
                label="About initialization"
                text="Starts the inscription and reserves on-chain upload state for this file hash."
              />
            </span>
            <span>{formatStepStatus(beginState)}</span>
          </div>
          <div className={`mint-step mint-step--${uploadState}`}>
            <span className="info-label">
              <span>
                2. Upload batches
                {batchProgress
                  ? ` (${batchProgress.current}/${batchProgress.total})`
                  : ''}
              </span>
              <InfoTip
                label="About upload batches"
                text="Uploads chunk data in sequential batch transactions until all chunks are committed."
              />
            </span>
            <span>{formatStepStatus(uploadState)}</span>
          </div>
          <div className={`mint-step mint-step--${sealState}`}>
            <span className="info-label">
              <span>3. Seal inscription</span>
              <InfoTip
                label="About seal inscription"
                text="Finalizes the inscription, locks metadata, and mints the token ID."
              />
            </span>
            <span>{formatStepStatus(sealState)}</span>
          </div>
          {formattedTxDelay && (
            <div className="mint-step mint-step--pending mint-step--countdown">
              <span className="info-label">
                <span>Automated sequence</span>
                <InfoTip
                  label="About automated sequence"
                  text="After first approval, the app schedules remaining transactions in order with delay guards."
                />
              </span>
              <span>
                {(txDelayLabel ?? 'Next transaction in')} {formattedTxDelay}s
              </span>
            </div>
          )}
        </div>

        <div className="mint-actions">
          <button
            className="button"
            type="button"
            disabled={mintActionDisabled}
            onClick={() => void (resumeState ? resumeMint() : startMint())}
          >
            {mintPending ? mintActionPendingLabel : mintActionLabel}
          </button>
          {!props.walletSession.address && (
            <span className="meta-value">
              Connect a wallet to enable minting.
            </span>
          )}
          {mismatch && (
            <span className="meta-value">
              Switch wallet to {mismatch.expected} to mint.
            </span>
          )}
        </div>

        {mismatch && (
          <div className="alert">
            Wallet network is {mismatch.actual}. Switch to{' '}
            {mismatch.expected} to mint with this contract.
          </div>
        )}

        {pauseBlocked && (
          <div className="alert">
            Contract is paused. Only the contract owner can inscribe.
          </div>
        )}

        {mintStatus && <div className="alert">{mintStatus}</div>}

        {cleanupPending && (
          <div className="alert">
            <div>
              <strong>Cleanup pending confirmation.</strong> Resume is temporarily
              locked until upload cleanup confirms on-chain.
            </div>
            <div className="mint-actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={() => setResumeCheckKey((prev) => prev + 1)}
                disabled={mintPending || isPreparing}
              >
                Refresh upload state
              </button>
            </div>
          </div>
        )}

        {formattedTxDelay && (
          <div className="alert">
            {(txDelayLabel ?? 'Next transaction in')} {formattedTxDelay}s
          </div>
        )}

        {delegateTargetId !== null && (
          <div className="alert">
            Delegate clone active. Seal will link to token #
            {delegateTargetId.toString()}.
          </div>
        )}

        {duplicateState === 'checking' && (
          <div className="alert">
            Checking for existing inscriptions of this hash...
          </div>
        )}

        {resumeState && (
          <div className="alert alert--supportive">
            <div>
              <strong>Existing upload data found. No problem.</strong>{' '}
              {resumeState.currentIndex.toString()}/
              {resumeState.totalChunks.toString()} chunks uploaded.
              {resumeInfo && !('error' in resumeInfo) && (
                <div className="meta-value">
                  {resumeInfo.remainingBatches} batch
                  {resumeInfo.remainingBatches === 1 ? '' : 'es'} remaining.
                </div>
              )}
              {resumeInfo && !('error' in resumeInfo) && (
                <div className="meta-value">
                  {resumeInfo.remainingBatches > 0
                    ? 'Next: upload remaining batches, then seal.'
                    : 'Next: seal inscription.'}
                </div>
              )}
              <div className="meta-value">
                Click Resume inscription to continue from the saved chunks.
                Single-mint uploads are not auto-cancelled, and you can resume for up to ~
                {SINGLE_MINT_UPLOAD_EXPIRY_BLOCKS.toLocaleString()} blocks after the
                last upload transaction.
              </div>
              {resumeInfo && 'error' in resumeInfo && (
                <div className="meta-value">{resumeInfo.error}</div>
              )}
              {resumeMismatch && (
                <div className="meta-value">{resumeMismatch}</div>
              )}
              {startOverUnsupported && (
                <div className="meta-value">
                  Clearing uploads is not supported by this contract.
                </div>
              )}
              {!startOverUnsupported && (
                <div className="meta-value">
                  Start over discards this upload (abandon + purge). Use it only if the
                  session is expired or you want to restart from chunk 0.
                </div>
              )}
            </div>
            <div className="mint-actions">
              <button
                className="button button--ghost"
                type="button"
                onClick={() => void handleStartOver()}
                disabled={startOverDisabled}
              >
                Start over
              </button>
            </div>
          </div>
        )}

        {duplicateMatch && (
          <div className="alert alert--supportive">
            <div>
              <strong>Existing inscription found.</strong> Good news: token #
              {duplicateMatch.id.toString()} already matches this content
              {duplicateMatch.owner
                ? ` (owner ${duplicateMatch.owner}).`
                : '.'}
            </div>
            {!disableDuplicateOverride ? (
              !allowDuplicate ? (
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => setAllowDuplicate(true)}
                >
                  Proceed anyway
                </button>
              ) : (
                <span className="meta-value">Proceeding anyway.</span>
              )
            ) : (
              <span className="meta-value">Minting blocked for duplicates.</span>
            )}
          </div>
        )}

        {duplicateState === 'error' && (
          <div className="alert">
            Unable to check for duplicate inscriptions right now.
          </div>
        )}

        {mintLog.length > 0 && (
          <details className="mint-advanced">
            <summary className="mint-advanced__summary">Diagnostic logs</summary>
          <div className="mint-log">
            {mintLog.map((entry, index) => (
              <div
                key={`${entry}-${index}`}
                className={`mint-log__item${
                  isSupportiveMintLog(entry) ? ' mint-log__item--supportive' : ''
                }`}
              >
                {entry}
              </div>
            ))}
          </div>
          </details>
        )}
      </div>
    </section>
  );
}
