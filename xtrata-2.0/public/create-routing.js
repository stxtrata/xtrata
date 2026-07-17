export const STANDARD_CREATE_MAX_BYTES = 512 * 1024;

const HANDOFF_DB_NAME = 'xtrata-create-handoff';
const HANDOFF_STORE_NAME = 'pending';
const HANDOFF_DB_VERSION = 1;
const HANDOFF_TTL_MS = 30 * 60 * 1000;

const toFiles = (files) => Array.from(files ?? []).filter((file) => file instanceof Blob);

export const classifyCreateFiles = (files, { containsDirectory = false } = {}) => {
  const normalizedFiles = toFiles(files);
  if (containsDirectory) {
    return { destination: 'wizard', reason: 'folder', files: normalizedFiles };
  }
  if (normalizedFiles.length > 1) {
    return { destination: 'wizard', reason: 'multiple', files: normalizedFiles };
  }
  if (normalizedFiles[0]?.size > STANDARD_CREATE_MAX_BYTES) {
    return { destination: 'wizard', reason: 'large', files: normalizedFiles };
  }
  return {
    destination: normalizedFiles.length === 1 ? 'create' : null,
    reason: normalizedFiles.length === 1 ? 'standard' : 'empty',
    files: normalizedFiles
  };
};

const readDirectoryBatch = (reader) =>
  new Promise((resolve, reject) => reader.readEntries(resolve, reject));

const readAllDirectoryEntries = async (reader) => {
  const entries = [];
  let batch = await readDirectoryBatch(reader);
  while (batch.length) {
    entries.push(...batch);
    batch = await readDirectoryBatch(reader);
  }
  return entries;
};

const readEntryFile = (entry) =>
  new Promise((resolve, reject) => entry.file(resolve, reject));

const collectEntryFiles = async (entry, parentPath = '') => {
  const relativePath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
  if (entry.isFile) {
    const file = await readEntryFile(entry);
    try {
      Object.defineProperty(file, 'xtrataRelativePath', {
        configurable: true,
        value: relativePath
      });
    } catch {
      // The path is helpful metadata, but the file must still route if a browser
      // exposes a non-extensible native File object.
    }
    return [file];
  }
  if (!entry.isDirectory) {
    return [];
  }
  const children = await readAllDirectoryEntries(entry.createReader());
  const nested = await Promise.all(
    children.map((child) => collectEntryFiles(child, relativePath))
  );
  return nested.flat();
};

export const collectDroppedFiles = async (dataTransfer) => {
  const items = Array.from(dataTransfer?.items ?? []);
  const entries = items
    .map((item) =>
      typeof item.webkitGetAsEntry === 'function' ? item.webkitGetAsEntry() : null
    )
    .filter(Boolean);

  if (entries.length) {
    const containsDirectory = entries.some((entry) => entry.isDirectory);
    const nested = await Promise.all(entries.map((entry) => collectEntryFiles(entry)));
    return { files: nested.flat(), containsDirectory };
  }

  return {
    files: Array.from(dataTransfer?.files ?? []),
    containsDirectory: false
  };
};

const openHandoffDb = () =>
  new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
      reject(new Error('This browser cannot preserve files between Create and Wizard.'));
      return;
    }
    const request = globalThis.indexedDB.open(HANDOFF_DB_NAME, HANDOFF_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(HANDOFF_STORE_NAME)) {
        db.createObjectStore(HANDOFF_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open file handoff.'));
  });

const transact = async (mode, operation) => {
  const db = await openHandoffDb();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(HANDOFF_STORE_NAME, mode);
      const store = transaction.objectStore(HANDOFF_STORE_NAME);
      const request = operation(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('File handoff failed.'));
      transaction.onabort = () =>
        reject(transaction.error ?? new Error('File handoff was cancelled.'));
    });
  } finally {
    db.close();
  }
};

const newHandoffId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export const storeCreateHandoff = async (
  files,
  { reason = 'standard', source = 'create', containsDirectory = false } = {}
) => {
  const normalizedFiles = toFiles(files);
  if (!normalizedFiles.length) {
    throw new Error('No files were found in that selection.');
  }
  const id = newHandoffId();
  const record = {
    id,
    reason,
    source,
    containsDirectory,
    createdAt: Date.now(),
    files: normalizedFiles.map((file) => ({
      blob: file.slice(0, file.size, file.type || 'application/octet-stream'),
      name: file.name || 'inscription',
      type: file.type || 'application/octet-stream',
      lastModified: file.lastModified || Date.now(),
      relativePath: file.xtrataRelativePath || file.webkitRelativePath || file.name || ''
    }))
  };
  await transact('readwrite', (store) => store.put(record));
  return id;
};

export const takeCreateHandoff = async (id) => {
  if (!id) {
    return null;
  }
  const record = await transact('readonly', (store) => store.get(id));
  if (!record) {
    return null;
  }
  await transact('readwrite', (store) => store.delete(id));
  if (Date.now() - record.createdAt > HANDOFF_TTL_MS) {
    return null;
  }
  return {
    ...record,
    files: record.files.map((item) => {
      const file = new File([item.blob], item.name, {
        type: item.type,
        lastModified: item.lastModified
      });
      try {
        Object.defineProperty(file, 'xtrataRelativePath', {
          configurable: true,
          value: item.relativePath
        });
      } catch {
        // Wizard can still process the file without its optional relative path.
      }
      return file;
    })
  };
};

export const createHandoffUrl = (pathname, id, source = 'create') => {
  const url = new URL(pathname, globalThis.location?.origin ?? 'https://xtrata.xyz');
  url.searchParams.set('handoff', 'create-selection');
  url.searchParams.set('handoffId', id);
  url.searchParams.set('from', source);
  return `${url.pathname}${url.search}`;
};

globalThis.XtrataCreateRouting = Object.freeze({
  STANDARD_CREATE_MAX_BYTES,
  classifyCreateFiles,
  collectDroppedFiles,
  storeCreateHandoff,
  takeCreateHandoff,
  createHandoffUrl
});
if (typeof globalThis.dispatchEvent === 'function' && typeof globalThis.Event === 'function') {
  globalThis.dispatchEvent(new Event('xtrata-create-routing-ready'));
}
