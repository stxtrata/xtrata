# Radio: one passkey, many derived wallets

Step 1 of the plan in the Xtrata Music project (`claude/radio-derived-wallets-plan.md`). This step changes the wallet box only: nothing on the radio page uses it yet, so it is safe to ship alone.

## What it is
A listening wallet's key is `HKDF(passkey secret, label)`. Slot 0 keeps the original label (`xtrata-radio-listening-key-v1`) and is the wallet every listener already has. Slot n >= 1 uses `<label>/slot/<n>`, so the same passkey gives as many separate wallets as are needed (limit `MAX_SLOT`, 100,000), each with its own balance and nonce. Money is kept apart by address, so no ledger is needed to say whose it is.

Never change the labels or the HKDF settings: `src/lib/listening-wallet/__tests__/listening-wallet.test.ts` locks slot 0, 1, 2 and 100 against an independent RFC 5869 implementation.

## Wallet box (`src/listening-wallet/frame/engine.ts`)
- On unlock the engine keeps a non-extractable HKDF `CryptoKey`, not the passkey bytes. Slots are derived on demand, with no further passkey tap. Lock, or closing the page, drops it.
- New calls (feature flag `slots`):
  - `listening.slotAddress {slot}`: the address of that wallet. Moves nothing.
  - `listening.openSlot {slot}`: makes that wallet the open one. Refused while a panel is waiting or a signature is being made.
  - `listening.bindSlot {slot, issued}`: returns a binding signed by BOTH the passkey's own wallet and the derived wallet (`src/lib/listening-wallet/slots.ts`). It spends nothing and shows no panel. The server will use it to credit an album's plays and likes to the listener's one linked main wallet.
- `listening.status` reports `slot` while unlocked.
- `listening.link` works only on slot 0. Returns from any slot go to the passkey's linked main wallet (the link is stored per passkey), and still show the full address in the panel.
- One session budget covers all wallets (plays and fees of the listener, whichever wallet pays).

## Shipping
The wallet box deploys separately: `npm run build:listening-wallet`, then `wrangler pages deploy` from `dist-listening-wallet`. The radio page checks `features` for `slots` before using any of these calls, as it does for `partial`.
