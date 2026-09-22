/**
 * Windows-only wrapper around Electron safeStorage.
 *
 * Electron maps this to DPAPI on Windows.  This module deliberately has no
 * plaintext or file-key fallback: a Windows wallet either has OS protection or
 * it cannot be created/opened for signing.
 */
const SCHEME = 'windows-dpapi-v1';

function encryptedBuffer(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) {
    throw Error('Protected Windows wallet data is invalid. It was not replaced.');
  }
  const bytes = Buffer.from(value, 'base64');
  if (!bytes.length || bytes.toString('base64') !== value) {
    throw Error('Protected Windows wallet data is invalid. It was not replaced.');
  }
  return bytes;
}

/**
 * The Electron main process supplies safeStorage after app.ready. Keeping this
 * adapter small makes the wallet backend testable without loading Electron in
 * Node, while the Windows smoke test exercises the real provider.
 */
export function createWindowsVaultProtector(safeStorage) {
  if (!safeStorage || typeof safeStorage.isAsyncEncryptionAvailable !== 'function' ||
      typeof safeStorage.encryptStringAsync !== 'function' ||
      typeof safeStorage.decryptStringAsync !== 'function') {
    throw Error('Windows protected storage is unavailable. Xtrata Music will not create a spending wallet without it.');
  }

  async function available() {
    if (!(await safeStorage.isAsyncEncryptionAvailable())) {
      throw Error('Windows protected storage is unavailable. Xtrata Music will not create or unlock a spending wallet without DPAPI.');
    }
  }

  const protect = async secret => {
    if (typeof secret !== 'string' || !secret) throw Error('Wallet secret is invalid.');
    await available();
    const encrypted = await safeStorage.encryptStringAsync(secret);
    if (!Buffer.isBuffer(encrypted) || encrypted.length < 1) throw Error('Windows protected storage returned no encrypted wallet data.');
    return encrypted.toString('base64');
  };

  return Object.freeze({
    scheme: SCHEME,
    protect,
    async unprotect(value) {
      await available();
      const response = await safeStorage.decryptStringAsync(encryptedBuffer(value));
      // Electron returns { result, shouldReEncrypt }. Supporting a string keeps
      // the adapter compatible with the stable Electron API shape in tests.
      const secret = typeof response === 'string' ? response : response?.result;
      if (typeof secret !== 'string' || !secret) throw Error('Windows protected storage could not unlock this wallet. It was not replaced.');
      return {
        secret,
        reprotected: response?.shouldReEncrypt === true ? await protect(secret) : null,
      };
    },
  });
}

export const WINDOWS_VAULT_SCHEME = SCHEME;
