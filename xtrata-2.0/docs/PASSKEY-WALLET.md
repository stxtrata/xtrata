# Passkey Wallet — design notes and spike results

Goal: let someone use Xtrata from ordinary Safari or Chrome on a phone, with
Face ID, without installing Xverse or Leather and without their in-app browser.

Status: **spike in progress.** Desktop Chrome passes end to end. iPhone Safari
is the gate that decides whether the design ships. Nothing here is wired into
the app yet — Xverse and Leather remain the only live connect paths.

## 1. A passkey cannot sign a Stacks transaction

This is the constraint the whole design bends around, and it is not negotiable:

- WebAuthn signs **secp256r1** (P-256). Stacks signs **secp256k1**. The passkey's
  key is not a Stacks key and cannot be converted into one.
- WebAuthn does not let the caller choose the signed message — it signs
  `authenticatorData || sha256(clientDataJSON)`. There is no way to hand it a
  Stacks transaction hash.
- The account-abstraction escape used on other chains — a contract that verifies
  the P-256 signature on-chain — is closed here. Clarity has `secp256k1-verify`
  and `secp256k1-recover?` and **no P-256 equivalent**. Hand-rolling r1 field
  arithmetic in Clarity is not economically viable.

So "turn the passkey into a wallet" is not a thing. Do not revisit this without
new Clarity primitives.

## 2. What we do instead: the passkey unlocks the key, it is not the key

The passkey's PRF extension (`hmac-secret`) returns a stable 32-byte secret
derived from (credential, salt) that never leaves the authenticator. We use it
to encrypt an ordinary Stacks seed.

1. Generate a 24-word BIP39 mnemonic in the browser; derive `m/44'/5757'/0'/0/0`.
2. Create a passkey with `prf`, `residentKey: required`, `userVerification: required`.
3. HKDF the PRF output → AES-256-GCM key → encrypt the seed.
4. Store the **ciphertext** (server-side, keyed by credential ID).
5. To sign: Face ID → PRF → decrypt in memory → sign → zero the seed.

The account is indistinguishable on-chain from an Xverse one, and the 24 words
import into any Stacks wallet forever. That is the real escape hatch, and it is
why this is not a lock-in play.

**Holding the ciphertext is not custody.** The server cannot decrypt it. The
passkey secret is in the Secure Enclave / iCloud Keychain and never transmitted.

### Constants that must never change

`PRF_SALT` (`xtrata.wallet.v1.seed-encryption`) and the HKDF info string
(`xtrata-seed-v1`), both in `src/lib/wallet/passkey/envelope.ts`. Editing either
orphans **every existing wallet** — the seed becomes undecryptable and only the
24 words recover it. Version them, never mutate them.

## 3. Spike results

`recursive-apps/23-passkey-canary/` (ships to `/passkey-canary/`). Five tests
ending in a GO/NO-GO verdict per device.

| Device | Result | Date |
| --- | --- | --- |
| Desktop Chrome 150 (macOS) | **GO** — all 5 pass, including reload survival | 2026-07-27 |
| iPhone Safari | not yet run — **this is the gate** | |
| iPad Safari | not yet run | |
| Desktop Safari | not yet run | |

Desktop Chrome is the friendliest environment there is; a pass there is
necessary, not sufficient. Note also that the recorded run did not capture
**which authenticator** was chosen (iCloud Keychain vs Chrome's own profile
store). Only an iCloud Keychain pass predicts iPhone behaviour.

### Gotchas found while testing

- `python3 -m http.server` advertises itself as `[::]`, which is **not** a secure
  context. Use `http://localhost:<port>`. The canary now detects this and says so.
- A LAN address (`192.168.x.x`) will not work either. Passkeys bind to a domain,
  so **there is no way to test a phone without a real HTTPS deploy**.

## 4. Risks

- **XSS becomes catastrophic.** With Xverse, injected script can request a
  signature the user may refuse. With an in-page key it can exfiltrate the seed.
  Mitigation is non-optional: the wallet must live on **its own origin in a
  sandboxed iframe**, strict CSP, zero third-party scripts on that origin. Not
  yet built — do not ship the wallet without it.
- **Compromised iCloud account ⇒ compromised wallet**, if the attacker can also
  reach our site. True of every passkey wallet; say so in the UI.
- **PRF coverage** is the open unknown. Needs a fallback for devices that fail:
  either a password-derived key or "use Xverse on this device".
- We take on key-security responsibility we do not currently carry. Permanent.

## 5. Session wallets (temporary deposit wallets)

`DEPLOY-BACKEND.md` notes the deposit-wallet model "means the agent briefly
custodies user funds" — the server generates the wallet and holds its key. The
passkey design removes that: the session wallet is generated in the user's
browser and sealed under their passkey. Same UX, no custody window.

### The hard part: returning funds when the browser is closed

After ~24h the user's browser is shut and the seed is sealed behind a passkey
nobody can present. The server cannot sign — that is the point.

**Solution: pre-signed rolling return** (`session-return.ts`). While the browser
is open, sign a return-everything-to-the-depositor transaction and hand the
*finished signed transaction* to the server to hold. It is not a key; it can do
exactly one thing. A compromised server cannot steal — the worst it can do is
return the user's own money early. At expiry the server broadcasts it.

"Rolling" because a signed transaction pins both nonce and amount: after any job
that moves either, the browser must sign a replacement. `isReturnStale()` is how
the server checks what it holds is still live.

Considered and rejected for now: a Clarity timelock escrow with a permissionless
refund. Strictly better trust-wise, but it is a new contract plus an audit and it
changes how the wizard pays for things. Right answer eventually.

### Two rules for the return address

- **Never silently return to the observed depositor.** Exchange deposit addresses
  are a common funding source and funds returned to one are routinely lost. Show
  the address, default it to the sender, require confirmation.
- **The deposit cap is not enforceable.** Nothing stops someone sending more than
  the limit. Treat an over-cap balance as "return it immediately", never as
  "reject it" — `assertWithinCap()` exists for exactly this.

## 6. What exists now

| File | What it does |
| --- | --- |
| `recursive-apps/23-passkey-canary/index.html` | Device GO/NO-GO canary, no dependencies |
| `src/lib/wallet/passkey/envelope.ts` | PRF → HKDF → AES-GCM seal/open, `withSeed` wipe discipline |
| `src/lib/wallet/passkey/seed.ts` | 24-word generation, validation, `m/44'/5757'/n'/0/0` derivation |
| `src/lib/wallet/passkey/session-return.ts` | Pre-signed rolling return + cap and staleness guards |

46 tests in `src/lib/wallet/passkey/__tests__/`. The derivation tests carry
known-answer address locks: if they change, existing wallets have been silently
relocated to addresses their owners cannot reach. Fix the code, never the vector.

## 7. Not built yet

1. Sandboxed wallet origin + postMessage bridge (**blocker for shipping**).
2. WebAuthn ceremony wrapper — the canary proves it, the app has no wrapper yet.
3. Ciphertext blob storage endpoint.
4. Registration as a third provider behind the existing `connectWallet` seam.
5. Wiring to the sponsor relay so a fresh, STX-empty passkey wallet can transact.
   This is the combination worth having: Face ID, no app, no STX, and you can
   still inscribe.
6. Fallback path for devices where PRF fails.
