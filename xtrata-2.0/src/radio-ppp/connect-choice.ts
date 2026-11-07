/**
 * The radio's connect pop-up: "Xtrata Music Wallet" rows (passkey wallets on this device) first, then a Stacks wallet
 * (Xverse or Leather, through the usual chooser). This decides which Xtrata Music Wallet rows are offered and what
 * tapping each one does. Pure, so it is tested without a page.
 *
 * - A listening wallet on this device that is linked to a Stacks wallet gets a row of its own
 *   ("Xtrata Music Wallet · jim.btc"): it opens without connecting that Stacks wallet, and every play and like is
 *   still credited to it (the controller's `useLinked`).
 * - A passkey-only wallet (no Stacks wallet behind it) gets one row: make one, or open the one here. Only where the
 *   deployment allows passkey-only listeners (RADIO_PPP_PASSKEY_ONLY=1).
 *
 * Nothing is offered while a Stacks wallet is connected, or where pay-per-play does not run: the Stacks chooser then
 * opens straight away, as before.
 */
import type { Snapshot } from './controller';

export type MusicWalletAction = 'create' | 'unlock' | 'show' | 'linked';

export interface MusicWalletOption {
  /** What tapping the row does: make a new passkey wallet, unlock the one here, show the open one, or open a linked one. */
  action: MusicWalletAction | null;
  label: string;
  detail: string;
  /** For `linked`: the Stacks wallet this listening wallet is linked to. */
  main?: string;
  disabled?: boolean;
}

export const MUSIC_WALLET_NAME = 'Xtrata Music Wallet';

type ChoiceInput = Pick<Snapshot, 'step' | 'solo' | 'main'> & {
  gate?: { passkeyOnly?: boolean; here?: boolean; enabled?: boolean } | null;
  mainConnected?: boolean;
  /** The listening wallet's link, and the device's other linked wallets (Snapshot.linked / Snapshot.others). */
  linked?: string;
  others?: string[];
  standIn?: string;
};

const OPEN_STEPS = new Set(['fund', 'over', 'ready', 'link', 'wrong-wallet']);

export function musicWalletOptions(s: ChoiceInput, nameOf: (address: string) => string = (a) => a): MusicWalletOption[] {
  // A connected Stacks wallet: the button switches Stacks wallets, as before. (`main` alone may be a stand-in.)
  const connected = s.mainConnected ?? !!s.main;
  if (connected) return [];
  if (s.step === 'off' || s.step === 'elsewhere') return [];
  if (s.gate && (s.gate.enabled === false || s.gate.here === false)) return [];
  if (s.step === 'unsupported') {
    const any = s.gate?.passkeyOnly || s.linked || s.others?.length;
    return any ? [{ action: null, label: MUSIC_WALLET_NAME, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: true }] : [];
  }

  const rows: MusicWalletOption[] = [];
  // Every Stacks wallet that has a listening wallet on this device, the one in use first.
  const linkedMains = [...new Set([s.standIn, s.linked, ...(s.others ?? [])].filter((a): a is string => !!a))];
  for (const main of linkedMains) {
    const inUse = s.standIn === main && OPEN_STEPS.has(s.step);
    rows.push({
      action: 'linked', main, label: `${MUSIC_WALLET_NAME} · ${nameOf(main)}`,
      detail: inUse ? 'Open on this device.' : `Face ID or your fingerprint. Plays and likes count for ${nameOf(main)}.`
    });
  }

  if (s.gate?.passkeyOnly && s.solo) {
    switch (s.step) {
      case 'intro':
        rows.push({ action: 'create', label: MUSIC_WALLET_NAME, detail: 'Make one with Face ID or your fingerprint. No app or seed phrase.' }); break;
      case 'locked':
        rows.push({ action: 'unlock', label: MUSIC_WALLET_NAME, detail: 'Open the one on this device with Face ID or your fingerprint.' }); break;
      case 'loading':
        rows.push({ action: 'show', label: MUSIC_WALLET_NAME, detail: 'Face ID or your fingerprint. No app or seed phrase.' }); break;
      case 'connect': case 'not-invited':
        break;
      default:
        rows.push({ action: 'show', label: MUSIC_WALLET_NAME, detail: 'Open on this device.' });
    }
  }
  return rows;
}
