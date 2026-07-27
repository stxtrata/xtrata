import {
  buildRuntimeModuleBaseHref,
  injectHtmlBaseHref
} from '../../src/lib/viewer/module-paths';
import {
  buildRuntimeContentCacheKey,
  getRuntimeContractId,
  hasRuntimeContentCache,
  readRuntimeContentCache,
  runtimeBytesToHex,
  writeRuntimeContentCache,
  type RuntimeByteRange,
  type RuntimeCacheStatus,
  type RuntimeContentCacheRecord
} from './cache';
import { lookupIndexedRuntimeMeta } from './index-meta';
import {
  createRuntimeUpstreamRequestTracker,
  fetchRuntimeTokenUri,
  getRuntimeReadConfig,
  getRuntimeApiBases,
  isCloudflareSubrequestQuotaError,
  isRuntimeContentNotFoundError,
  parseRuntimeContractRef,
  parseRuntimeNetwork,
  parseRuntimeTokenId,
  resolveRuntimeContent,
  resolveRuntimeMeta,
  syncRuntimeUpstreamRequests,
  type RuntimeContractRef,
  type RuntimeEnv,
  type RuntimeNetworkType,
  type RuntimeReconstructionDiagnostics
} from './lib';
import {
  isHtmlMimeType,
  isRawSourceRequested,
  rewriteHiroApiBasesInBytes,
  shouldRewriteHiroBases
} from './html-hiro-rewrite';

const RUNTIME_CONTENT_BUILD = 'stream-v1';
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, range, if-range',
  'Access-Control-Expose-Headers': [
    'Content-Type',
    'Content-Length',
    'Accept-Ranges',
    'Content-Range',
    'ETag',
    'Server-Timing',
    'X-Xtrata-Runtime-Cache',
    'X-Xtrata-Runtime-Build',
    'X-Xtrata-Runtime-Contract',
    'X-Xtrata-Runtime-Source-Contract',
    'X-Xtrata-Runtime-Network',
    'X-Xtrata-Runtime-Token-Uri',
    'X-Xtrata-Runtime-Module-Base',
    'X-Xtrata-Runtime-Module-Base-Injected',
    'X-Xtrata-Runtime-Final-Hash',
    'X-Xtrata-Runtime-Total-Size',
    'X-Xtrata-Runtime-Total-Chunks',
    'X-Xtrata-Runtime-Response-Mode',
    'X-Xtrata-Runtime-Read-Batch-Size',
    'X-Xtrata-Runtime-Read-Concurrency',
    'X-Xtrata-Runtime-Read-Retries',
    'X-Xtrata-Runtime-Reconstruction-Read-Mode',
    'X-Xtrata-Runtime-Reconstruction-Fallback',
    'X-Xtrata-Runtime-Reconstruction-Batch-Reads',
    'X-Xtrata-Runtime-Reconstruction-Single-Reads',
    'X-Xtrata-Runtime-Reconstruction-Batch-Fallbacks',
    'X-Xtrata-Runtime-Reconstruction-Errors',
    'X-Xtrata-Runtime-Upstream-Requests',
    'X-Xtrata-Runtime-Prepared-Ms'
  ].join(', '),
  'Cross-Origin-Resource-Policy': 'cross-origin'
};

const toRuntimeDiagnosticsSummary = (
  diagnostics: RuntimeReconstructionDiagnostics | null | undefined
) =>
  diagnostics
    ? {
        requestedSourceId: diagnostics.requestedSourceId,
        metaSourceId: diagnostics.metaSourceId,
        chunkSourceId: diagnostics.chunkSourceId,
        fallbackUsed: diagnostics.fallbackUsed,
        readMode: diagnostics.readMode,
        batchReads: diagnostics.batchReads,
        singleReads: diagnostics.singleReads,
        batchFallbacks: diagnostics.batchFallbacks,
        upstreamRequests: diagnostics.upstreamRequests,
        missingChunks: diagnostics.missingChunks.map((index) => index.toString()),
        errors: diagnostics.errors.map((error) => ({
          sourceId: error.sourceId,
          operation: error.operation,
          index: error.index?.toString(),
          indexes: error.indexes?.map((index) => index.toString()),
          message: error.message
        }))
      }
    : null;

const isRuntimeContentDebugEnabled = (env: RuntimeEnv) => {
  const value = env.RUNTIME_CONTENT_DEBUG;
  return value === true || value === '1' || value === 'true';
};

const logRuntimeContentDebug = (
  env: RuntimeEnv,
  phase: string,
  details: Record<string, unknown>
) => {
  if (!isRuntimeContentDebugEnabled(env)) {
    return;
  }
  console.log(`[runtime/content] ${phase}`, details);
};

const getErrorDiagnostics = (error: unknown): RuntimeReconstructionDiagnostics | null => {
  const candidate = error as { diagnostics?: RuntimeReconstructionDiagnostics };
  return candidate && candidate.diagnostics ? candidate.diagnostics : null;
};

const asJsonError = (
  status: number,
  message: string,
  detail?: string,
  diagnostics?: RuntimeReconstructionDiagnostics | null,
  upstreamRequests?: number
) =>
  new Response(
    JSON.stringify({
      error: message,
      detail: detail || null,
      diagnostics: toRuntimeDiagnosticsSummary(diagnostics)
    }),
    {
      status,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        ...(typeof upstreamRequests === 'number'
          ? { 'X-Xtrata-Runtime-Upstream-Requests': upstreamRequests.toString() }
          : {})
      }
    }
  );

const buildRuntimeContentHeaders = (params: {
  mimeType: string;
  cacheStatus: RuntimeCacheStatus;
  network: string;
  contractId: string;
  sourceContractId: string;
  tokenUri: string;
  moduleBaseHref: string;
  finalHash: string;
  totalSize: bigint;
  totalChunks: bigint;
  contentLength: number | null;
  contentRange?: string;
  responseMode: 'cache' | 'head' | 'range' | 'stream';
  apiRewrite?: boolean;
  readBatchSize?: number;
  readConcurrency?: number;
  readRetries?: number;
  upstreamRequests?: number;
  diagnostics?: RuntimeReconstructionDiagnostics | null;
  preparedMs?: number;
}) => {
  const headers: Record<string, string> = {
    ...CORS_HEADERS,
    'Content-Type': params.mimeType,
    'Cache-Control': params.finalHash
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=60',
    'X-Content-Type-Options': 'nosniff',
    'X-Xtrata-Runtime-Cache': params.cacheStatus,
    'X-Xtrata-Runtime-Build': RUNTIME_CONTENT_BUILD,
    'X-Xtrata-Runtime-Contract': params.contractId,
    'X-Xtrata-Runtime-Source-Contract': params.sourceContractId,
    'X-Xtrata-Runtime-Network': params.network,
    'X-Xtrata-Runtime-Token-Uri': params.tokenUri,
    'X-Xtrata-Runtime-Module-Base': params.moduleBaseHref,
    'X-Xtrata-Runtime-Final-Hash': params.finalHash,
    'X-Xtrata-Runtime-Total-Size': params.totalSize.toString(),
    'X-Xtrata-Runtime-Total-Chunks': params.totalChunks.toString(),
    'X-Xtrata-Runtime-Response-Mode': params.responseMode
  };
  if (params.apiRewrite) {
    headers['X-Xtrata-Runtime-Api-Rewrite'] = 'hiro-proxy';
  }
  if (params.totalSize <= BigInt(Number.MAX_SAFE_INTEGER)) {
    headers['Accept-Ranges'] = 'bytes';
  }
  if (params.contentRange) {
    headers['Content-Range'] = params.contentRange;
    headers.Vary = 'Range';
  }
  if (typeof params.readBatchSize === 'number') {
    headers['X-Xtrata-Runtime-Read-Batch-Size'] = params.readBatchSize.toString();
  }
  if (typeof params.readConcurrency === 'number') {
    headers['X-Xtrata-Runtime-Read-Concurrency'] = params.readConcurrency.toString();
  }
  if (typeof params.readRetries === 'number') {
    headers['X-Xtrata-Runtime-Read-Retries'] = params.readRetries.toString();
  }
  if (typeof params.upstreamRequests === 'number') {
    headers['X-Xtrata-Runtime-Upstream-Requests'] = params.upstreamRequests.toString();
  }
  if (params.diagnostics) {
    headers['X-Xtrata-Runtime-Reconstruction-Read-Mode'] = params.diagnostics.readMode;
    headers['X-Xtrata-Runtime-Reconstruction-Fallback'] = params.diagnostics.fallbackUsed
      ? 'true'
      : 'false';
    headers['X-Xtrata-Runtime-Reconstruction-Batch-Reads'] =
      params.diagnostics.batchReads.toString();
    headers['X-Xtrata-Runtime-Reconstruction-Single-Reads'] =
      params.diagnostics.singleReads.toString();
    headers['X-Xtrata-Runtime-Reconstruction-Batch-Fallbacks'] =
      params.diagnostics.batchFallbacks.toString();
    headers['X-Xtrata-Runtime-Reconstruction-Errors'] = params.diagnostics.errors.length.toString();
  }
  if (typeof params.preparedMs === 'number') {
    headers['X-Xtrata-Runtime-Prepared-Ms'] = params.preparedMs.toFixed(1);
    headers['Server-Timing'] = `runtime_prepare;dur=${params.preparedMs.toFixed(1)}`;
  }
  if (params.finalHash) {
    headers.ETag = `"${params.finalHash}"`;
  }
  if (typeof params.contentLength === 'number' && params.contentLength >= 0) {
    headers['Content-Length'] = params.contentLength.toString();
  }
  return headers;
};

type ParsedRange =
  | { status: 'none' }
  | { status: 'valid'; range: RuntimeByteRange; contentRange: string }
  | { status: 'unsatisfiable'; contentRange: string };

const parseRuntimeRange = (headerValue: string | null, totalSize: bigint): ParsedRange => {
  if (!headerValue) {
    return { status: 'none' };
  }
  if (totalSize < 0n || totalSize > BigInt(Number.MAX_SAFE_INTEGER)) {
    return {
      status: 'unsatisfiable',
      contentRange: 'bytes */*'
    };
  }
  const total = Number(totalSize);
  const normalized = headerValue.trim();
  const prefix = 'bytes=';
  if (!normalized.toLowerCase().startsWith(prefix) || normalized.includes(',')) {
    return {
      status: 'unsatisfiable',
      contentRange: `bytes */${total}`
    };
  }

  const spec = normalized.slice(prefix.length).trim();
  const separator = spec.indexOf('-');
  if (separator < 0) {
    return {
      status: 'unsatisfiable',
      contentRange: `bytes */${total}`
    };
  }

  const startPart = spec.slice(0, separator).trim();
  const endPart = spec.slice(separator + 1).trim();
  const isDigits = (value: string) => /^\d+$/.test(value);
  let start: number;
  let end: number;

  if (!startPart) {
    if (!isDigits(endPart)) {
      return {
        status: 'unsatisfiable',
        contentRange: `bytes */${total}`
      };
    }
    const suffixLength = Number.parseInt(endPart, 10);
    if (suffixLength <= 0 || total === 0) {
      return {
        status: 'unsatisfiable',
        contentRange: `bytes */${total}`
      };
    }
    start = Math.max(0, total - suffixLength);
    end = total - 1;
  } else {
    if (!isDigits(startPart) || (endPart && !isDigits(endPart))) {
      return {
        status: 'unsatisfiable',
        contentRange: `bytes */${total}`
      };
    }
    start = Number.parseInt(startPart, 10);
    end = endPart ? Number.parseInt(endPart, 10) : total - 1;
    if (start >= total || start > end || total === 0) {
      return {
        status: 'unsatisfiable',
        contentRange: `bytes */${total}`
      };
    }
    end = Math.min(end, total - 1);
  }

  const length = end - start + 1;
  return {
    status: 'valid',
    range: {
      start,
      end,
      length
    },
    contentRange: `bytes ${start}-${end}/${total}`
  };
};

const shouldHonorRange = (request: Request, finalHash: string) => {
  const ifRange = request.headers.get('If-Range')?.trim();
  if (!ifRange || !finalHash) {
    return true;
  }
  return ifRange === finalHash || ifRange === `"${finalHash}"`;
};

const sliceBytes = (bytes: Uint8Array, range: RuntimeByteRange) =>
  bytes.slice(range.start, range.end + 1);

const injectRuntimeModuleBaseInBytes = (params: {
  bytes: Uint8Array;
  mimeType: string | null | undefined;
  moduleBaseHref: string | null | undefined;
  requestUrl: URL;
}) => {
  if (
    !params.moduleBaseHref ||
    !isHtmlMimeType(params.mimeType) ||
    isRawSourceRequested(params.requestUrl)
  ) {
    return { bytes: params.bytes, changed: false };
  }
  let html: string;
  try {
    html = textDecoder.decode(params.bytes);
  } catch {
    return { bytes: params.bytes, changed: false };
  }
  const injected = injectHtmlBaseHref(html, params.moduleBaseHref);
  if (injected === html) {
    return { bytes: params.bytes, changed: false };
  }
  return {
    bytes: textEncoder.encode(injected),
    changed: true
  };
};

// Shared by both cache-hit paths: the one reached after a chain metadata read,
// and the faster one reached straight from the index. Identical output either
// way — the only difference is where the content hash came from.
const buildCachedRuntimeResponse = async (params: {
  cached: RuntimeContentCacheRecord;
  request: Request;
  url: URL;
  network: RuntimeNetworkType;
  tokenId: bigint;
  contract: RuntimeContractRef;
  mimeType: string;
  totalSize: bigint;
  totalChunks: bigint;
  finalHash: string;
  requestedRange: ParsedRange;
  readConfig: { batchSize: number; concurrency: number; retries: number };
  upstreamRequests: number;
  startedAt: number;
}) => {
  const { cached, request, url, requestedRange } = params;
  const isRangeResponse = requestedRange.status === 'valid';
  const sourceContractId =
    cached.customMetadata?.sourceContractId ?? getRuntimeContractId(params.contract);
  const cachedModuleBaseHref =
    cached.customMetadata?.moduleBaseHref ??
    buildRuntimeModuleBaseHref({
      network: params.network,
      contractId: sourceContractId,
      tokenUriPath: cached.customMetadata?.tokenUri,
      entryTokenId: params.tokenId
    });
  const rangeContentLength = isRangeResponse ? requestedRange.range.length : null;
  const cachedMimeType =
    params.mimeType || cached.httpMetadata?.contentType || 'application/octet-stream';
  let cachedResponseBody: BodyInit | null =
    request.method === 'HEAD' ? null : cached.body;
  let cachedContentLength = rangeContentLength ?? cached.size;
  let cachedApiRewrite = false;
  let cachedModuleBaseInjected = false;
  if (
    cachedResponseBody &&
    shouldRewriteHiroBases({
      requestUrl: url,
      mimeType: cachedMimeType,
      method: request.method,
      isRangeResponse
    })
  ) {
    const cachedBytes = new Uint8Array(
      await new Response(cachedResponseBody as BodyInit).arrayBuffer()
    );
    const rewritten = rewriteHiroApiBasesInBytes(cachedBytes, url.origin);
    cachedResponseBody = rewritten.bytes;
    cachedContentLength = rewritten.bytes.length;
    cachedApiRewrite = rewritten.changed;
  }
  if (cachedResponseBody && request.method === 'GET' && !isRangeResponse) {
    const cachedBytes = new Uint8Array(
      await new Response(cachedResponseBody as BodyInit).arrayBuffer()
    );
    const baseInjected = injectRuntimeModuleBaseInBytes({
      bytes: cachedBytes,
      mimeType: cachedMimeType,
      moduleBaseHref: cachedModuleBaseHref,
      requestUrl: url
    });
    cachedResponseBody = baseInjected.bytes;
    cachedContentLength = baseInjected.bytes.length;
    cachedModuleBaseInjected = baseInjected.changed;
  }
  const headers = buildRuntimeContentHeaders({
    mimeType: cachedMimeType,
    cacheStatus: 'HIT',
    network: params.network,
    contractId: getRuntimeContractId(params.contract),
    sourceContractId,
    tokenUri: cached.customMetadata?.tokenUri ?? '',
    moduleBaseHref: cachedModuleBaseHref ?? '',
    finalHash: params.finalHash,
    totalSize: params.totalSize,
    totalChunks: params.totalChunks,
    contentLength: cachedContentLength,
    contentRange: isRangeResponse ? requestedRange.contentRange : undefined,
    responseMode:
      request.method === 'HEAD' ? 'head' : isRangeResponse ? 'range' : 'cache',
    apiRewrite: cachedApiRewrite,
    readBatchSize: params.readConfig.batchSize,
    readConcurrency: params.readConfig.concurrency,
    readRetries: params.readConfig.retries,
    upstreamRequests: params.upstreamRequests,
    preparedMs: performance.now() - params.startedAt
  });
  if (cachedModuleBaseInjected) {
    headers['X-Xtrata-Runtime-Module-Base-Injected'] = 'true';
  }
  return new Response(cachedResponseBody, {
    status: isRangeResponse ? 206 : 200,
    headers
  });
};

export const onRequest = async (context: {
  request: Request;
  env: RuntimeEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
}) => {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return asJsonError(405, 'Method not allowed.');
  }
  const startedAt = performance.now();

  const url = new URL(request.url);
  const contractId = parseRuntimeContractRef(url.searchParams.get('contractId'));
  const fallbackContractId = parseRuntimeContractRef(url.searchParams.get('fallbackContractId'));
  const tokenId = parseRuntimeTokenId(url.searchParams.get('tokenId'));
  const network = parseRuntimeNetwork(url.searchParams.get('network'));

  if (!contractId) {
    return asJsonError(400, 'Invalid contractId parameter.');
  }
  if (tokenId === null || tokenId < 0n) {
    return asJsonError(400, 'Invalid tokenId parameter.');
  }

  const apiBases = getRuntimeApiBases(network, env);
  if (apiBases.length === 0) {
    return asJsonError(500, 'No API base URLs configured for runtime content.');
  }
  const readConfig = getRuntimeReadConfig(env);
  const upstreamTracker = createRuntimeUpstreamRequestTracker();

  // Fast path: the cache is keyed by content hash, and for a SEALED inscription
  // the index already knows that hash. Reading it from D1 instead of the chain
  // turns a cache hit from ~600ms and up to five upstream calls into a single
  // indexed lookup. Strictly an optimisation — the index is only ever used to
  // FIND an assembled copy, never to reconstruct one, so a stale or wrong row
  // can cost a wasted lookup but can never produce wrong bytes. Any miss falls
  // through to the unchanged chain path below.
  if (hasRuntimeContentCache(env)) {
    try {
      const indexed = await lookupIndexedRuntimeMeta({
        env,
        candidates: [contractId, fallbackContractId],
        tokenId
      });
      if (indexed) {
        const indexedRange = shouldHonorRange(request, indexed.finalHashHex)
          ? parseRuntimeRange(request.headers.get('Range'), indexed.totalSize)
          : ({ status: 'none' } as const);
        // An unsatisfiable range needs the 416 path below, which reports the
        // chain's view of the token; let it fall through rather than answering
        // an error from the index.
        if (indexedRange.status !== 'unsatisfiable') {
          const indexedCached = await readRuntimeContentCache(
            env,
            buildRuntimeContentCacheKey({
              network,
              contract: indexed.contract,
              tokenId,
              finalHash: indexed.finalHash
            }),
            indexedRange.status === 'valid' ? indexedRange.range : null
          );
          if (indexedCached) {
            return await buildCachedRuntimeResponse({
              cached: indexedCached,
              request,
              url,
              network,
              tokenId,
              contract: indexed.contract,
              mimeType: indexed.mimeType,
              totalSize: indexed.totalSize,
              totalChunks: indexed.totalChunks,
              finalHash: indexed.finalHashHex,
              requestedRange: indexedRange,
              readConfig,
              upstreamRequests: upstreamTracker.attempts,
              startedAt
            });
          }
        }
      }
    } catch (error) {
      // The fast path must never be able to fail a request that the normal
      // path could still serve.
      logRuntimeContentDebug(env, 'index-fast-path-failed', {
        tokenId: tokenId.toString(),
        detail: error instanceof Error ? error.message : String(error)
      });
    }
  }

  try {
    const resolvedMeta = await resolveRuntimeMeta({
      env,
      apiBases,
      tokenId,
      primaryContract: contractId,
      fallbackContract: fallbackContractId,
      upstreamTracker
    });
    const finalHash = runtimeBytesToHex(resolvedMeta.meta.finalHash);
    const cacheKey =
      resolvedMeta.meta.sealed && finalHash
        ? buildRuntimeContentCacheKey({
            network,
            contract: resolvedMeta.contract,
            tokenId,
            finalHash: resolvedMeta.meta.finalHash
          })
        : null;
    const cacheEnabled = hasRuntimeContentCache(env);
    const requestedRange = shouldHonorRange(request, finalHash)
      ? parseRuntimeRange(request.headers.get('Range'), resolvedMeta.meta.totalSize)
      : ({ status: 'none' } as const);
    const range = requestedRange.status === 'valid' ? requestedRange.range : null;

    if (requestedRange.status === 'unsatisfiable') {
      const resolvedContractId = getRuntimeContractId(resolvedMeta.contract);
      return new Response(null, {
        status: 416,
        headers: buildRuntimeContentHeaders({
          mimeType: resolvedMeta.meta.mimeType || 'application/octet-stream',
          cacheStatus: cacheEnabled ? 'MISS' : 'BYPASS',
          network,
          contractId: resolvedContractId,
          sourceContractId: resolvedContractId,
          tokenUri: '',
          moduleBaseHref: '',
          finalHash,
          totalSize: resolvedMeta.meta.totalSize,
          totalChunks: resolvedMeta.meta.totalChunks,
          contentLength: 0,
          contentRange: requestedRange.contentRange,
          responseMode: 'range',
          readBatchSize: readConfig.batchSize,
          readConcurrency: readConfig.concurrency,
          readRetries: readConfig.retries,
          upstreamRequests: upstreamTracker.attempts,
          preparedMs: performance.now() - startedAt
        })
      });
    }

    const cached = await readRuntimeContentCache(env, cacheKey, range);
    if (cached) {
      return buildCachedRuntimeResponse({
        cached,
        request,
        url,
        network,
        tokenId,
        contract: resolvedMeta.contract,
        mimeType: resolvedMeta.meta.mimeType,
        totalSize: resolvedMeta.meta.totalSize,
        totalChunks: resolvedMeta.meta.totalChunks,
        finalHash,
        requestedRange,
        readConfig,
        upstreamRequests: upstreamTracker.attempts,
        startedAt
      });
    }

    if (request.method === 'HEAD') {
      const resolvedContractId = getRuntimeContractId(resolvedMeta.contract);
      return new Response(null, {
        status: requestedRange.status === 'valid' ? 206 : 200,
        headers: buildRuntimeContentHeaders({
          mimeType: resolvedMeta.meta.mimeType || 'application/octet-stream',
          cacheStatus: cacheEnabled ? 'MISS' : 'BYPASS',
          network,
          contractId: resolvedContractId,
          sourceContractId: resolvedContractId,
          tokenUri: '',
          moduleBaseHref: '',
          finalHash,
          totalSize: resolvedMeta.meta.totalSize,
          totalChunks: resolvedMeta.meta.totalChunks,
          contentLength:
            requestedRange.status === 'valid'
              ? requestedRange.range.length
              : resolvedMeta.meta.totalSize <= BigInt(Number.MAX_SAFE_INTEGER)
                ? Number(resolvedMeta.meta.totalSize)
                : null,
          contentRange: requestedRange.status === 'valid' ? requestedRange.contentRange : undefined,
          responseMode: 'head',
          readBatchSize: readConfig.batchSize,
          readConcurrency: readConfig.concurrency,
          readRetries: readConfig.retries,
          upstreamRequests: upstreamTracker.attempts,
          preparedMs: performance.now() - startedAt
        })
      });
    }

    const cacheContractId = getRuntimeContractId(resolvedMeta.contract);
    if (requestedRange.status === 'valid') {
      const resolved = await resolveRuntimeContent({
        env,
        apiBases,
        tokenId,
        primaryContract: contractId,
        fallbackContract: fallbackContractId,
        resolvedMeta,
        upstreamTracker
      });
      let tokenUri: string | null = null;
      try {
        tokenUri = await fetchRuntimeTokenUri({
          env,
          apiBases,
          contract: resolved.contract,
          tokenId,
          upstreamTracker
        });
      } catch (error) {
        syncRuntimeUpstreamRequests(resolved.diagnostics, upstreamTracker);
        if (isCloudflareSubrequestQuotaError(error)) {
          if (error && typeof error === 'object') {
            (error as { diagnostics?: RuntimeReconstructionDiagnostics }).diagnostics =
              resolved.diagnostics;
          }
          throw error;
        }
        tokenUri = null;
      }
      syncRuntimeUpstreamRequests(resolved.diagnostics, upstreamTracker);
      const resolvedContractId = getRuntimeContractId(resolved.contract);
      const resolvedFinalHash = runtimeBytesToHex(resolved.meta.finalHash);
      const moduleBaseHref = buildRuntimeModuleBaseHref({
        network,
        contractId: resolvedContractId,
        tokenUriPath: tokenUri,
        entryTokenId: tokenId
      });
      logRuntimeContentDebug(env, 'reconstructed-range', {
        network,
        tokenId: tokenId.toString(),
        requestedContractId: getRuntimeContractId(contractId),
        sourceContractId: resolvedContractId,
        range: requestedRange.contentRange,
        diagnostics: toRuntimeDiagnosticsSummary(resolved.diagnostics)
      });
      if (cacheKey && resolved.meta.sealed && resolvedFinalHash === finalHash) {
        const cacheWrite = writeRuntimeContentCache({
          env,
          key: cacheKey,
          bytes: resolved.bytes,
          mimeType: resolved.meta.mimeType || 'application/octet-stream',
          metadata: {
            network,
            contractId: cacheContractId,
            sourceContractId: resolvedContractId,
            tokenId: tokenId.toString(),
            finalHash: resolvedFinalHash,
            totalSize: resolved.meta.totalSize.toString(),
            totalChunks: resolved.meta.totalChunks.toString(),
            tokenUri: tokenUri ?? '',
            moduleBaseHref,
            createdAt: new Date().toISOString()
          }
        }).catch(() => false);
        if (context.waitUntil) {
          context.waitUntil(cacheWrite);
        } else {
          await cacheWrite;
        }
      }
      return new Response(sliceBytes(resolved.bytes, requestedRange.range), {
        status: 206,
        headers: buildRuntimeContentHeaders({
          mimeType: resolved.meta.mimeType || 'application/octet-stream',
          cacheStatus: cacheEnabled ? 'MISS' : 'BYPASS',
          network,
          contractId: cacheContractId,
          sourceContractId: resolvedContractId,
          tokenUri: tokenUri ?? '',
          moduleBaseHref,
          finalHash: resolvedFinalHash,
          totalSize: resolved.meta.totalSize,
          totalChunks: resolved.meta.totalChunks,
          contentLength: requestedRange.range.length,
          contentRange: requestedRange.contentRange,
          responseMode: 'range',
          readBatchSize: readConfig.batchSize,
          readConcurrency: readConfig.concurrency,
          readRetries: readConfig.retries,
          upstreamRequests: upstreamTracker.attempts,
          diagnostics: resolved.diagnostics,
          preparedMs: performance.now() - startedAt
        })
      });
    }

    const resolved = await resolveRuntimeContent({
      env,
      apiBases,
      tokenId,
      primaryContract: contractId,
      fallbackContract: fallbackContractId,
      resolvedMeta,
      upstreamTracker
    });
    let tokenUri: string | null = null;
    try {
      tokenUri = await fetchRuntimeTokenUri({
        env,
        apiBases,
        contract: resolved.contract,
        tokenId,
        upstreamTracker
      });
    } catch (error) {
      syncRuntimeUpstreamRequests(resolved.diagnostics, upstreamTracker);
      if (isCloudflareSubrequestQuotaError(error)) {
        if (error && typeof error === 'object') {
          (error as { diagnostics?: RuntimeReconstructionDiagnostics }).diagnostics =
            resolved.diagnostics;
        }
        throw error;
      }
      tokenUri = null;
    }
    syncRuntimeUpstreamRequests(resolved.diagnostics, upstreamTracker);
    const resolvedContractId = getRuntimeContractId(resolved.contract);
    const resolvedFinalHash = runtimeBytesToHex(resolved.meta.finalHash);
    const moduleBaseHref = buildRuntimeModuleBaseHref({
      network,
      contractId: resolvedContractId,
      tokenUriPath: tokenUri,
      entryTokenId: tokenId
    });
    if (cacheKey && resolved.meta.sealed && resolvedFinalHash === finalHash) {
      const cacheWrite = writeRuntimeContentCache({
        env,
        key: cacheKey,
        bytes: resolved.bytes,
        mimeType: resolved.meta.mimeType || 'application/octet-stream',
        metadata: {
          network,
          contractId: cacheContractId,
          sourceContractId: resolvedContractId,
          tokenId: tokenId.toString(),
          finalHash: resolvedFinalHash,
          totalSize: resolved.meta.totalSize.toString(),
          totalChunks: resolved.meta.totalChunks.toString(),
          tokenUri: tokenUri ?? '',
          moduleBaseHref,
          createdAt: new Date().toISOString()
        }
      }).catch(() => false);
      if (context.waitUntil) {
        context.waitUntil(cacheWrite);
      } else {
        await cacheWrite;
      }
    }
    logRuntimeContentDebug(env, 'reconstructed-stream', {
      network,
      tokenId: tokenId.toString(),
      requestedContractId: getRuntimeContractId(contractId),
      sourceContractId: resolvedContractId,
      diagnostics: toRuntimeDiagnosticsSummary(resolved.diagnostics)
    });
    const streamMimeType = resolved.meta.mimeType || 'application/octet-stream';
    let streamBytes = resolved.bytes;
    let streamApiRewrite = false;
    let streamModuleBaseInjected = false;
    if (
      shouldRewriteHiroBases({
        requestUrl: url,
        mimeType: streamMimeType,
        method: request.method,
        isRangeResponse: false
      })
    ) {
      const rewritten = rewriteHiroApiBasesInBytes(streamBytes, url.origin);
      streamBytes = rewritten.bytes;
      streamApiRewrite = rewritten.changed;
    }
    const baseInjected = injectRuntimeModuleBaseInBytes({
      bytes: streamBytes,
      mimeType: streamMimeType,
      moduleBaseHref,
      requestUrl: url
    });
    streamBytes = baseInjected.bytes;
    streamModuleBaseInjected = baseInjected.changed;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(streamBytes);
        controller.close();
      }
    });

    const headers = buildRuntimeContentHeaders({
      mimeType: streamMimeType,
      cacheStatus: cacheEnabled ? 'MISS' : 'BYPASS',
      network,
      contractId: cacheContractId,
      sourceContractId: resolvedContractId,
      tokenUri: tokenUri ?? '',
      moduleBaseHref: moduleBaseHref ?? '',
      finalHash: resolvedFinalHash,
      totalSize: resolved.meta.totalSize,
      totalChunks: resolved.meta.totalChunks,
      contentLength: streamBytes.length,
      responseMode: 'stream',
      apiRewrite: streamApiRewrite,
      readBatchSize: readConfig.batchSize,
      readConcurrency: readConfig.concurrency,
      readRetries: readConfig.retries,
      upstreamRequests: upstreamTracker.attempts,
      diagnostics: resolved.diagnostics,
      preparedMs: performance.now() - startedAt
    });
    if (streamModuleBaseInjected) {
      headers['X-Xtrata-Runtime-Module-Base-Injected'] = 'true';
    }

    return new Response(stream, {
      status: 200,
      headers
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const diagnostics = getErrorDiagnostics(error);
    const subrequestQuotaExhausted = isCloudflareSubrequestQuotaError(error);
    const notFound = isRuntimeContentNotFoundError(error);
    logRuntimeContentDebug(env, 'reconstruction-error', {
      network,
      tokenId: tokenId?.toString(),
      requestedContractId: contractId ? getRuntimeContractId(contractId) : null,
      detail,
      upstreamRequests: upstreamTracker.attempts,
      diagnostics: toRuntimeDiagnosticsSummary(diagnostics)
    });
    // Always log a failed content request, not just in debug mode. These are
    // invisible otherwise: client-side telemetry never sees them (the browser
    // just gets a status code), and an unreachable inscription is exactly the
    // kind of thing that should not be discovered by someone reporting it.
    console.warn('[runtime/content] request failed', {
      network,
      tokenId: tokenId?.toString() ?? null,
      requestedContractId: contractId ? getRuntimeContractId(contractId) : null,
      fallbackContractId: fallbackContractId
        ? getRuntimeContractId(fallbackContractId)
        : null,
      outcome: notFound
        ? 'not-found'
        : subrequestQuotaExhausted
          ? 'upstream-quota'
          : 'reconstruction-failed',
      triedContracts: notFound ? error.triedContracts : undefined,
      upstreamRequests: upstreamTracker.attempts,
      detail
    });

    if (notFound) {
      // 404, not 502, for two reasons. It is the honest status — every contract
      // we asked answered, and none of them has this token. And Cloudflare
      // replaces a 502 body with its own generic error page, so the caller was
      // previously getting a bare "error code: 502" with no explanation of
      // which contracts were searched.
      return asJsonError(
        404,
        'Inscription not found on this contract lineage.',
        detail,
        diagnostics,
        upstreamTracker.attempts
      );
    }

    return asJsonError(
      subrequestQuotaExhausted ? 503 : 502,
      subrequestQuotaExhausted
        ? 'Runtime upstream request limit exhausted.'
        : 'Failed to reconstruct runtime content.',
      detail,
      diagnostics,
      upstreamTracker.attempts
    );
  }
};
