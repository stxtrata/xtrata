import { sha256 } from '@noble/hashes/sha256';
import type { Env } from '../db';
export function cleanupAccess(request: Request, env: Env, scanOnly = false) {
  const expected = String(scanOnly ? env.COLLECTION_CLEANUP_SCAN_TOKEN ?? '' : env.COLLECTION_CLEANUP_ADMIN_TOKEN ?? '');
  if (expected.length < 32) return false;
  const supplied = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  const a = sha256(new TextEncoder().encode(expected));
  const b = sha256(new TextEncoder().encode(supplied));
  let different = 0;
  for (let i = 0; i < a.length; i++) different |= a[i] ^ b[i];
  return different === 0;
}
