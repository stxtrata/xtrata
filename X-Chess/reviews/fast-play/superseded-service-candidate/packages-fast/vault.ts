import { generateKey, insist } from './protocol.js';
import type { Key } from './protocol.js';
// Game keys never go to the clock service. A failed durable write blocks setup.
export class KeyVault {
  private async db(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('xchess-fast-keys-v1', 1);
      const timer = setTimeout(() => reject(Error('Game-key storage is unavailable')), 5000);
      request.onupgradeneeded = () => request.result.createObjectStore('keys');
      request.onerror = () => { clearTimeout(timer); reject(request.error); };
      request.onblocked = () => { clearTimeout(timer); reject(Error('Close older X Chess tabs to unlock game-key storage')); };
      request.onsuccess = () => { clearTimeout(timer); resolve(request.result); };
    });
  }
  async create(): Promise<Key> {
    const key = await generateKey();
    const db = await this.db();
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('keys', 'readwrite');
        tx.objectStore('keys').put(key.secret, key.public);
        tx.oncomplete = () => resolve(); tx.onerror = tx.onabort = () => reject(tx.error ?? Error('Game-key storage failed'));
      });
      insist(await this.get(key.public), 'Unable to read saved game key');
      return key;
    } finally { db.close(); }
  }
  async get(publicKey: string): Promise<Key | null> {
    const db = await this.db();
    try {
      const secret = await new Promise<CryptoKey | undefined>((resolve, reject) => {
        const tx = db.transaction('keys', 'readonly');
        const req = tx.objectStore('keys').get(publicKey);
        req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
      });
      return secret ? { public: publicKey, secret } : null;
    } finally { db.close(); }
  }
}
