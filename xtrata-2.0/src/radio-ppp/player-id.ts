/**
 * The player's address at the top of the radio (public/radio.html #playerId): which address, and how it is shortened.
 */
import type { Snapshot } from './controller';

/** The player's own address: the passkey's wallet (the root, even while an album's wallet is open), else the last one known on this device. */
export const playerIdAddress = (s: Pick<Snapshot, 'step' | 'root' | 'listening'>): string | undefined => {
  if (s.step === 'off' || s.step === 'elsewhere' || s.step === 'not-invited' || s.step === 'unsupported') return undefined;
  const a = s.root ?? s.listening;
  return a && /^S[PM][0-9A-Z]{20,60}$/.test(a) ? a : undefined;
};

/** SP3FZP…0Q8: enough of each end to recognise it. */
export const shortAddress = (a: string) => (a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a);

/** A BNS name as it is when it fits, otherwise its start and its end (so the .btc stays): averyve…me.btc. */
export const condenseName = (name: string, max = 16) => {
  const chars = [...name];
  if (chars.length <= max) return name;
  const tail = Math.min(7, Math.max(4, Math.floor((max - 1) / 2)));
  return chars.slice(0, max - 1 - tail).join('') + '…' + chars.slice(-tail).join('');
};
