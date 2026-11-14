# Players with a backup phrase

Since November 2026 every NEW player is made with a 24-word backup phrase that opens in other Stacks wallets
(Leather, Xverse). Xtrata never sees the words and cannot recover them. Players made before this are unchanged.

## How it works

- Nothing is stored, as before. The passkey gives a secret (PRF); HKDF-SHA256 with the label
  `xtrata-radio-listening-phrase-v2` turns it into 256 bits; those are an ordinary BIP39 phrase of 24 words; the
  phrase gives ordinary Stacks accounts at `m/44'/5757'/0'/0/<n>`. Code: `src/lib/listening-wallet/phrase.ts`.
- The same passkey always gives the same words and addresses, so a passkey synced to another device opens the same
  player there, exactly as with the original players.
- Slot n is account n. The player itself (slot 0) is "Account 1" in Leather and Xverse. Album wallets are higher
  accounts; a wallet app only lists them if the listener adds accounts up to that number.
- Tested against `@stacks/wallet-sdk` (the library those wallets build on): the first four accounts match key for
  key. Known-answer tests lock the label, the path, the words and the addresses.

## Two kinds of player, side by side

| | Original (version 1) | With a phrase (version 2) |
|---|---|---|
| Key | the passkey's secret itself (`derive.ts`) | the passkey's secret as a 24-word phrase (`phrase.ts`) |
| Backup | none: the passkey is the only key | 24 words, written down in the wallet box |
| Opens in other wallets | no | yes |
| Made | before this shipped | every player made after |

A player's kind is fixed when its passkey is made and never changes (its address would move). The device's record
says which it is (`v: 2`); for a passkey new to a device, its public user id does (20 bytes starting `58 4d 02 00`;
an original passkey's id is 16 random bytes, so the two cannot be confused). A passkey with neither is read as
original, as it always was. The original labels in `derive.ts` and their known-answer tests are untouched.

## Writing the words down

`listening.backup`, asked by the page, done entirely inside the wallet box:

1. a fresh passkey tap, and a check that it gives the open player;
2. the 24 words, numbered, on screen;
3. three of them asked back (tap the right word out of four);
4. the device's record is marked `backedUp`; the page is told only `{ backedUp: true }`.

The words are never stored, never sent, never returned to the page. Closing the box part-way records nothing.
The radio offers it under "Wallet & history": "Back up my player · 24 words".

## Not done yet

- The 1 STX rule and its warnings are unchanged. Relaxing them for a backed-up player is a separate decision
  (a backup covers losing the passkey, not the fact that the player signs plays from a web page).
- Typing the 24 words back into Xtrata to rebuild a player on a new device. Until then: the synced passkey opens
  it, or the words open the same wallet in Leather or Xverse.
- **Before launch: make a throwaway player on the deployed box, write its words down, import them into Leather and
  into Xverse, and check "Account 1" shows the player's address.** The library check passes; the apps themselves
  have not been tried.
