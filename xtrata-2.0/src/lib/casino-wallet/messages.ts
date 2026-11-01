/** Bridge message shapes for the casino wallet (casino.* methods). Public data only: nothing here can carry a key. */

export type CasinoWalletKind = 'passkey' | 'device';

export interface CasinoStatus {
  /** none: no wallet on this device. known: one exists, locked. unlocked: open and approved for buys. */
  state: 'none' | 'known' | 'unlocked';
  kind?: CasinoWalletKind;
  address?: string;
  /** This browser can make or use passkeys at all (PRF is only known after a real ceremony). */
  passkeys: boolean;
  features: string[];
  /** The passkey wallet this device used last, if any (public). */
  passkeyAddress?: string;
  /** The browser-only wallet kept on this device, if any (public). */
  deviceAddress?: string;
}

export interface CasinoOpenParams {
  /**
   * auto: the passkey wallet this device knows (several: the browser's list), else "use my passkey or make one".
   * create: a new passkey wallet. unlock: an existing passkey wallet. device: the no-passkey fallback (made if missing).
   */
  mode: 'auto' | 'create' | 'unlock' | 'device';
  /** unlock only: offer any casino passkey instead of the one this device used last. */
  anyPasskey?: boolean;
}

export interface CasinoOpenResult { address: string; kind: CasinoWalletKind }

/** Amounts as strings, so they survive postMessage without losing precision. */
export interface CasinoSignBuyParams { stx: number; fee: string; nonce: string }
export interface CasinoSignBuyResult { raw: string; txid: string }

export const CASINO_FEATURES = ['buy', 'device', 'held', 'room', 'choose'] as const;
