// Bounded, local-only parsing. No imported document can execute code or fetch data.
export const DOCUMENT_HARD_LIMITS = Object.freeze({
  inputBytes: 256 * 1024 * 1024,
  expandedBytes: 256 * 1024 * 1024,
  depth: 64,
  nodes: 2000000
});
export const DOCUMENT_LIMITS = Object.freeze({
  inputBytes: 8 * 1024 * 1024,
  expandedBytes: 16 * 1024 * 1024,
  depth: 48,
  nodes: 500000,
  workerThreshold: 256 * 1024
});
export class LegacyImportError extends Error {
  constructor(code, message, path = '') {
    super(message);
    this.name = 'LegacyImportError';
    this.code = code;
    this.path = path;
  }
}
export const fail = (code, message, path) => {
  throw new LegacyImportError(code, message, path);
};
export function checkAbort(signal) {
  if (signal?.aborted) throw new DOMException('Import cancelled.', 'AbortError');
}
export async function sha256(bytes) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}
export function validateDocumentTree(document, limits = DOCUMENT_LIMITS) {
  const pending = [[document, 0, '']],
    seen = new Set();
  let nodes = 0;
  while (pending.length) {
    const [value, depth, path] = pending.pop();
    if (++nodes > limits.nodes)
      fail('DOCUMENT_TOO_COMPLEX', 'The document contains too many values.', path);
    if (depth > limits.depth) fail('DOCUMENT_TOO_DEEP', 'The document is nested too deeply.', path);
    if (value && typeof value === 'object') {
      if (seen.has(value)) fail('INVALID_JSON', 'Cyclic documents are unsupported.', path);
      seen.add(value);
      if (
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) !== Object.prototype &&
        Object.getPrototypeOf(value) !== null
      )
        fail('INVALID_JSON', 'Only plain JSON objects are supported.', path);
      if (
        Array.isArray(value) &&
        (Object.keys(value).length !== value.length ||
          Object.keys(value).some((k) => !/^(?:0|[1-9]\d*)$/.test(k) || Number(k) >= value.length))
      )
        fail('INVALID_JSON', 'Sparse arrays are unsupported.', path);
      for (const key of Object.keys(value)) {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !Object.hasOwn(descriptor, 'value'))
          fail('INVALID_JSON', 'Accessor properties are unsupported.', path + '/' + key);
        const child = descriptor.value;
        if (['__proto__', 'prototype', 'constructor'].includes(key))
          fail('UNSAFE_KEY', 'This document contains an unsafe object key.', path + '/' + key);
        pending.push([child, depth + 1, path + '/' + key]);
      }
    } else if (
      (typeof value === 'number' && !Number.isFinite(value)) ||
      !['string', 'number', 'boolean', 'object'].includes(typeof value)
    )
      fail('INVALID_JSON', 'Only finite JSON values are supported.', path);
  }
  if (!document || Array.isArray(document) || typeof document !== 'object')
    fail('INVALID_DOCUMENT', 'Choose a JSON project object.');
  return document;
}
function checkNesting(text, limit) {
  let quoted = false,
    escaped = false,
    depth = 0;
  for (const char of text) {
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === '{' || char === '[') {
      if (++depth > limit) fail('DOCUMENT_TOO_DEEP', 'The JSON document is nested too deeply.');
    } else if (char === '}' || char === ']') depth--;
  }
}
export async function decodeDocumentBytes(bytes, { signal, limits = DOCUMENT_LIMITS } = {}) {
  checkAbort(signal);
  const gzip = bytes[0] === 31 && bytes[1] === 139;
  let expanded = bytes;
  // A direct byte stream also avoids WebKit worker Blob I/O failures.
  if (gzip) {
    if (typeof DecompressionStream !== 'function')
      fail(
        'GZIP_UNAVAILABLE',
        'This browser cannot decompress gzip. Decompress the file locally, or use a current desktop browser.'
      );
    const reader = new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        }
      })
        .pipeThrough(new DecompressionStream('gzip'))
        .getReader(),
      chunks = [];
    let length = 0;
    const abort = () => {
      void reader.cancel().catch(() => {});
    };
    signal?.addEventListener('abort', abort, { once: true });
    try {
      while (true) {
        checkAbort(signal);
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > limits.expandedBytes)
          fail(
            'DOCUMENT_TOO_LARGE',
            `Expanded JSON exceeds the ${limits.expandedBytes / 1048576} MiB import limit.`
          );
        chunks.push(value);
      }
      checkAbort(signal);
      expanded = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) {
        expanded.set(chunk, offset);
        offset += chunk.length;
      }
    } catch (error) {
      void reader.cancel().catch(() => {});
      if (error.name === 'AbortError' || error instanceof LegacyImportError) throw error;
      fail('INVALID_GZIP', 'The gzip file is truncated or invalid.');
    } finally {
      signal?.removeEventListener('abort', abort);
      reader.releaseLock();
    }
  }
  if (expanded.byteLength > limits.expandedBytes)
    fail('DOCUMENT_TOO_LARGE', 'JSON exceeds the expanded import limit.');
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(expanded);
  } catch {
    fail('INVALID_UTF8', 'The project must contain UTF-8 JSON.');
  }
  checkNesting(text, limits.depth);
  let document;
  try {
    document = JSON.parse(text);
  } catch {
    fail('INVALID_JSON', 'The file does not contain valid JSON.');
  }
  validateDocumentTree(document, limits);
  checkAbort(signal);
  return { document, container: gzip ? 'gzip' : 'json', expandedBytes: expanded.byteLength };
}
async function parseInWorker(bytes, { signal, limits }) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./read-document-worker.js', import.meta.url), {
      type: 'module'
    });
    let settled = false;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      worker.terminate();
      error ? reject(error) : resolve(value);
    };
    const abort = () => finish(new DOMException('Import cancelled.', 'AbortError'));
    const timer = setTimeout(
      () =>
        finish(new LegacyImportError('IMPORT_TIMEOUT', 'Document decoding exceeded 30 seconds.')),
      30000
    );
    signal?.addEventListener('abort', abort, { once: true });
    worker.onerror = (e) =>
      finish(
        new LegacyImportError('IMPORT_WORKER_FAILED', e.message || 'Document decoding failed.')
      );
    worker.onmessage = ({ data }) =>
      data.error
        ? finish(new LegacyImportError(data.error.code, data.error.message, data.error.path))
        : finish(null, data.result);
    try {
      const copy = bytes.slice();
      worker.postMessage({ bytes: copy, limits }, [copy.buffer]);
      if (signal?.aborted) abort();
    } catch (error) {
      finish(error);
    }
  });
}
export async function readDocument(
  input,
  { signal, filename = '', limits: overrides = {}, useWorker = true } = {}
) {
  const limits = { ...DOCUMENT_LIMITS, ...overrides };
  for (const key of ['inputBytes', 'expandedBytes', 'depth', 'nodes'])
    if (
      !Number.isSafeInteger(limits[key]) ||
      limits[key] < 1 ||
      limits[key] > DOCUMENT_HARD_LIMITS[key]
    )
      fail('INVALID_LIMIT', 'Import limits exceed the bounded document reader maximum.');
  checkAbort(signal);
  let bytes;
  if (typeof input === 'string') {
    if (input.length > limits.inputBytes)
      fail('DOCUMENT_TOO_LARGE', `The input exceeds the ${limits.inputBytes / 1048576} MiB limit.`);
    bytes = new TextEncoder().encode(input);
  } else if (input instanceof ArrayBuffer) bytes = new Uint8Array(input);
  else if (ArrayBuffer.isView(input))
    bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  else if (typeof Blob !== 'undefined' && input instanceof Blob) {
    if (input.size > limits.inputBytes)
      fail('DOCUMENT_TOO_LARGE', `The input exceeds the ${limits.inputBytes / 1048576} MiB limit.`);
    filename ||= input.name || '';
    bytes = new Uint8Array(await input.arrayBuffer());
  } else {
    validateDocumentTree(input, limits);
    bytes = new TextEncoder().encode(JSON.stringify(input));
  }
  checkAbort(signal);
  if (bytes.byteLength > limits.inputBytes)
    fail('DOCUMENT_TOO_LARGE', `The input exceeds the ${limits.inputBytes / 1048576} MiB limit.`);
  bytes = bytes.slice();
  const sourceHash = await sha256(bytes);
  checkAbort(signal);
  const decoded =
    useWorker &&
    typeof Worker === 'function' &&
    (bytes.length >= limits.workerThreshold || (bytes[0] === 31 && bytes[1] === 139))
      ? await parseInWorker(bytes, { signal, limits })
      : await decodeDocumentBytes(bytes, { signal, limits });
  return {
    ...decoded,
    bytes,
    sourceHash,
    byteLength: bytes.length,
    filename: String(filename).slice(0, 256)
  };
}
