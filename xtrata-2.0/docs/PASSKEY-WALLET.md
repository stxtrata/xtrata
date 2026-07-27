# Passkey Wallet — design notes and spike results

Goal: let someone use Xtrata from ordinary Safari or Chrome on a phone, with
Face ID, without installing Xverse or Leather and without their in-app browser.

Status: **spike passed — GO.** Desktop Chrome and all four iPhone browsers pass
end to end, including reload survival (§3). Nothing here is wired into the app
yet — Xverse and Leather remain the only live connect paths, and must stay that
way until the sandboxed wallet origin exists (§7.1).

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
| iPhone Safari 26.5.2 (iOS 18.7) | **GO** — all 5 pass | 2026-07-27 |
| iPhone Chrome 150 | **GO** — all 5 pass | 2026-07-27 |
| iPhone Firefox 153 | **GO** — all 5 pass | 2026-07-27 |
| iPhone Edge 150 | **GO** on retry — see §3.1 | 2026-07-27 |
| iPad Safari | not yet run | |
| Desktop Safari | not yet run | |

**Verdict: GO.** The design is viable — proceed with the self-hosted route.

Read the iOS coverage honestly: Apple requires every iOS browser to use WebKit,
so those four are four shells over one engine and one keychain. Strong for iOS,
but one implementation, not four. Desktop Safari and Android remain unsampled.

### 3.1 The Edge failure, and the invariant it bought

iPhone Edge failed step 3 with `NotAllowedError`, immediately after step 2 had
created the passkey successfully. An identical retry passed everything. The
cause was **iOS Stolen Device Protection** — active away from a familiar
location, it delays or blocks exactly this operation. Environmental and
transient, not a browser limitation.

But note the sequence: **credential created, PRF then failed.** Had we sealed a
seed against that credential and the user funded it, the funds would have been
behind a passkey that would not open, recoverable only from the 24 words.

**Rule: never seal a seed against a credential whose PRF is unproven.**
Create the passkey → run a live PRF round-trip → only then generate and seal the
seed. If PRF fails, discard the credential and start over; nothing is lost,
because no wallet exists yet. Enforce this in the WebAuthn wrapper (§7.2) — it
is the ordering that makes the difference between a retry and a lost wallet.

Corollary: `NotAllowedError` is **not** a capability verdict. It covers a
cancelled prompt, a timeout and Stolen Device Protection alike. Treat it as
retryable; never record it as "this device cannot do passkeys". The canary was
wrong about this on the first run and now says "retry" instead.

Second corollary: the 24 words are not optional, and this is the scenario that
proves it. They must be shown and confirmed before any funds can reach the
wallet.

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

## 5a. The wallet origin (isolation)

An in-page key means any XSS anywhere on Xtrata becomes seed theft. Browsers
isolate by **origin**, so the wallet runs on its own hostname in an iframe: the
seed is unsealed, used and wiped inside that origin, and script on the main site
cannot reach it. An injection on the main site can still ask the wallet to sign
(the user sees the prompt and can refuse) but cannot take the key.

### Three deployment rules

1. **A genuinely different hostname.** `wallet.xtrata.xyz`, or a separate Pages
   project. A path like `xtrata.xyz/wallet/` is the SAME origin and gives zero
   isolation — it looks like a boundary and is not one. This is the single
   easiest thing to get wrong here.
2. **The embedding page must grant WebAuthn to the frame.** Cross-origin iframes
   cannot use passkeys unless the parent opts in:
   `<iframe allow="publickey-credentials-get *; publickey-credentials-create *">`.
   Without it the wallet fails with `NotAllowedError` — which looks exactly like
   the transient failure in §3.1, so check this first when debugging.
3. **The passkey binds to the wallet origin,** not the embedding site. That is
   the desired behaviour: one wallet across every Xtrata property. It also means
   changing the wallet hostname orphans every wallet, so treat it as permanent.

### CSP for the wallet origin

The point of a separate origin is that nothing else runs there. Serve at minimum:

```
Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self';
  connect-src 'self' https://api.hiro.so; img-src 'self' data:;
  frame-ancestors https://xtrata.xyz https://main-staging.xtrata.pages.dev;
  base-uri 'none'; form-action 'none'
```

`frame-ancestors` must list the embedding origins explicitly — it is the
server-side twin of the host's allowlist. No CDN, no analytics, no fonts, no
third-party anything on this origin, ever. Adding one script tag here undoes the
whole design.

### Protocol

`src/lib/wallet/passkey/bridge/`. Both sides validate independently:

- **Client** (main site) accepts a reply only if the origin matches exactly, the
  source is our iframe's window, and the id matches a request we sent. Posts with
  an explicit `targetOrigin`, never `'*'` — with `'*'` a redirect could hand our
  request to whoever now occupies the frame.
- **Host** (wallet origin) answers only allowlisted parent origins, and silently
  ignores everything else so an unrecognised embedder learns nothing. Wildcards
  are refused at construction: one forgotten subdomain is a stolen wallet.

**The protocol cannot carry a secret.** There is no method that returns a seed or
a private key, and the 24-word phrase is rendered *inside* the iframe — it never
crosses the boundary. `assertNoSecrets` scans every outgoing response for
key-shaped fields and raw bytes and fails closed. That backstop exists because a
protocol that merely omits a dangerous field can grow one in a later change.

## 6. What exists now

| File | What it does |
| --- | --- |
| `recursive-apps/23-passkey-canary/index.html` | Device GO/NO-GO canary, no dependencies |
| `src/lib/wallet/passkey/envelope.ts` | PRF → HKDF → AES-GCM seal/open, `withSeed` wipe discipline |
| `src/lib/wallet/passkey/seed.ts` | 24-word generation, validation, `m/44'/5757'/n'/0/0` derivation |
| `src/lib/wallet/passkey/session-return.ts` | Pre-signed rolling return + cap and staleness guards |
| `src/lib/wallet/passkey/bridge/protocol.ts` | Message shapes, method allowlist, `assertNoSecrets` |
| `src/lib/wallet/passkey/bridge/client.ts` | Main-site side: origin/source/id validation, timeouts |
| `src/lib/wallet/passkey/bridge/host.ts` | Wallet-origin side: parent allowlist, leak backstop |

111 tests across `__tests__/` and `bridge/__tests__/`. The derivation tests carry
known-answer address locks: if they change, existing wallets have been silently
relocated to addresses their owners cannot reach. Fix the code, never the vector.

## 7. Not built yet

1. **Deploy the wallet origin.** The bridge exists; the hostname does not. Needs
   a separate Pages project or subdomain plus the §5a headers. Until then none of
   this is reachable, which is the correct state.
2. WebAuthn ceremony wrapper — the canary proves it, the app has no wrapper yet.
   Must enforce the §3.1 ordering: prove PRF on the credential *before* any seed
   is generated or sealed, and treat `NotAllowedError` as retryable.
3. The wallet iframe UI: the confirmation screen the user actually reads before
   signing, and the in-frame 24-word reveal.
4. Ciphertext blob storage endpoint.
5. Registration as a third provider behind the existing `connectWallet` seam.
6. Wiring to the sponsor relay so a fresh, STX-empty passkey wallet can transact.
   This is the combination worth having: Face ID, no app, no STX, and you can
   still inscribe.
7. Fallback path for devices where PRF fails.
8. Android and desktop Safari canary runs (§3).
