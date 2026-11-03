/** The casino wallet's passkey settings, shared by the frame (main.ts) and the top-level create page (create.ts). */
import { CASINO_PRF_SALT } from '../../lib/casino-wallet/derive';
import type { PasskeyOptions } from '../../listening-wallet/frame/passkey';

export const PASSKEY_NAME = 'Xtrata casino wallet (testnet)';
/** Only the casino's own passkey names may come through the create page: "Xtrata casino wallet (testnet) · ABCD". */
export const CASINO_NAME = /^Xtrata casino wallet \(testnet\) · [A-Z0-9]{4}$/;

export const CASINO_PASSKEY: PasskeyOptions = {
  salt: CASINO_PRF_SALT,
  rpName: 'Xtrata casino wallet',
  defaultName: PASSKEY_NAME,
  messages: {
    duplicate: 'This device already has a casino-wallet passkey. Use "Open my wallet" instead.',
    noPrf: 'This passkey cannot make a casino wallet on this device, so no wallet was made. You can delete the "Xtrata casino wallet" passkey from your password manager and choose "Play without a passkey".',
    prfMissing: 'This passkey did not return what the casino wallet needs on this device. Nothing was signed. Choose "Play without a passkey" instead.'
  }
};
