/**
 * The radio's connect pop-up: "Xtrata Music Wallet" (a passkey wallet made on this device) first, then a Stacks
 * wallet (Xverse or Leather, through the usual chooser). This decides whether the Xtrata Music Wallet row is
 * offered and what tapping it does. Pure, so it is tested without a page.
 *
 * The row only appears where a passkey-only listener is possible: the deployment allows it
 * (RADIO_PPP_PASSKEY_ONLY=1), no Stacks wallet is connected, and the passkey on this device (if any) is not
 * already linked to a Stacks wallet. Everywhere else the pop-up is skipped and the Stacks chooser opens as before.
 */
import type { Snapshot } from './controller';

export type MusicWalletAction = 'create' | 'unlock' | 'show';

export interface MusicWalletOption {
  /** What tapping the row does: make a new passkey wallet, unlock the one here, or just show the open wallet. */
  action: MusicWalletAction | null;
  label: string;
  detail: string;
  disabled?: boolean;
}

export const MUSIC_WALLET_NAME = 'Xtrata Music Wallet';

type ChoiceInput = Pick<Snapshot, 'step' | 'solo' | 'main'> & { gate?: { passkeyOnly?: boolean } | null };

export function musicWalletOption(s: ChoiceInput): MusicWalletOption | null {
  if (!s.gate?.passkeyOnly || s.main) return null;
  if (s.step === 'off' || s.step === 'elsewhere' || s.step === 'not-invited') return null;
  // A passkey here that belongs to a Stacks wallet holder needs that wallet; it is never passkey-only.
  if (!s.solo) return null;
  switch (s.step) {
    case 'unsupported':
      return { action: null, label: MUSIC_WALLET_NAME, detail: "This browser can't make one. Open the page in Safari or Chrome.", disabled: true };
    case 'intro':
      return { action: 'create', label: MUSIC_WALLET_NAME, detail: 'Make one with Face ID or your fingerprint. No app or seed phrase.' };
    case 'locked':
      return { action: 'unlock', label: MUSIC_WALLET_NAME, detail: 'Open the one on this device with Face ID or your fingerprint.' };
    case 'loading':
      return { action: 'show', label: MUSIC_WALLET_NAME, detail: 'Face ID or your fingerprint. No app or seed phrase.' };
    default:
      // Already unlocked and in use on this page.
      return { action: 'show', label: MUSIC_WALLET_NAME, detail: 'Open on this device.' };
  }
}
