/** Byte → lowercase hex, copied from `src/lib/utils/encoding.ts`. */
export const bytesToHex = (bytes: Uint8Array): string => {
  let hex = '';
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
};
