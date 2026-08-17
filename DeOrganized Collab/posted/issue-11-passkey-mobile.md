# Issue #11 — Bringing xtrata.xyz to mobile — passkey integration proposal

Archived verbatim from GitHub. Source of truth, not our drafts.

- **URL:** https://github.com/DeOrganized/builds-with-xtrata/issues/11
- **Opened:** 2026-08-15 by PerrinoProperties
- **State at archive:** open
- **Archived:** 2026-08-17

---

## The question, as they asked it

@stxtrata

# Bringing xtrata.xyz to mobile

Hey Jim — 

I spent the last week actually playing on xtrata.xyz. Chess, on my phone, in whatever spare five minutes I had. That's the honest starting point for this: not a pitch deck, just what happened when I tried to play your game the way most people are going to encounter it — on a phone, mid-day, no laptop nearby.

The mobile gap is real and it's not theoretical. Getting in requires a wallet extension or an in-app browser detour that desktop users breeze past and phone users mostly don't. Every player who hits that wall on their phone is a player who doesn't get to see how good the game actually is.

## What one tap fixes

We built an open-source library — `stacks-passkey-wallet` — that turns your device's own biometric unlock (Face ID, fingerprint, whatever your phone already uses) into a real Stacks + Bitcoin account. No extension to install, no seed phrase to write down to get started. One tap, and someone has an account that can hold real assets and sign real transactions.

It works because WebAuthn passkeys already sync across a person's devices (iCloud Keychain, Google Password Manager), so the account isn't locked to one phone or one browser — it travels the way the player already expects their login to travel.

## What we're offering

Not a library dump and a "good luck." Maintained integration support: pattern docs written against your actual use case, working examples, and us actually in the thread when something doesn't fit cleanly.

We're doing exactly this right now with Skullcoin Strike — a live browser game with real player assets, integrating this same library as their wallet layer. That collaboration is public: [`builds-with-skullcoin`](https://github.com/DeOrganized/builds-with-skullcoin) has the pattern docs and device notes, and [issue #12](https://github.com/DeOrganized/stacks-passkey-wallet/issues/12) is the open API design thread for transaction signing, built in public against their actual integration. When we found call-signature bugs in our own published pattern doc, we posted the correction on the same issue rather than quietly editing it. That's the standard we're offering you, not just a description of it.

## What the library actually does today — no rounding up

- **Ships and is published.** MIT-licensed, on npm as `stacks-passkey-wallet@0.2.2`, source and docs public.
- **Account creation + sign-in** via passkey, deriving a real Stacks address (and Bitcoin) from the device's WebAuthn PRF output. Nothing is stored server-side — the wallet re-derives from the passkey each session.
- **The derivation itself is checked against an independent test-vector suite** (43 vectors + 5 negative controls, verified with zero dependency on the library's own source) — that's the artifact we'd point you to if you want to verify the math yourself rather than take our word for it.
- **Mobile status, straight:** Safari on iOS is proven — both account creation and sign-in confirmed working in the field, including cross-device continuity via iCloud Keychain. Chrome on iOS has one open item we're actively running down — some Chrome/iOS combinations currently offer only cross-device QR creation rather than a local one-tap flow. We're mid-diagnosis on that and we'll tell you exactly where it lands before it becomes something your players hit.
- **What's not shipped yet:** in-app transaction signing (`signStacksTransaction`) isn't in the library today — it's the exact thing we're designing in the open with Skullcoin via issue #12 right now. If xtratalayers needs players to sign moves or transactions from inside the passkey account (versus just having one), that's a conversation we'd have together, the same way we're having it with them. We'd rather tell you what's not built than let you find out mid-integration.
- **Scope today is account 0 only** — one wallet per passkey, no multi-account switching yet.

## What your integration would actually touch

Wherever your current entry point asks a player to connect a wallet, this swaps in a passkey prompt instead — same moment in the flow, different mechanism underneath. The package and docs live at [`stacks-passkey-wallet`](https://github.com/DeOrganized/stacks-passkey-wallet); we've stood up [`builds-with-xtrata`](https://github.com/DeOrganized/builds-with-xtrata) as the place for patterns and examples specific to your integration — same shape as the Skullcoin repo, Q&A included.

## No clock on this

This is an opening, not a spec landing on your desk. Look at it when it's convenient, push back on anything that doesn't fit how xtratalayers actually works, or just ask questions in the repo. We're not asking you to commit to anything by reading this.

— Steve

---

## Our reply — 2026-08-15

<!-- comment id 5303084339 -->

Hey Steve,

I asked Xtrata's Claude to review and respond. As per our DMs we are in agreement - This passkey movement is an epic moment for crypto and I'm super excited to be getting in front of it like this!

See Claude's response below:

Thanks for this. The "what's not shipped yet" section is the part that made me
want to reply properly, so I am going to match it. Everything below is what we
have, what we got wrong, and where we are stuck.

Short version: we built the same thing, independently, starting 27 July. We
reached your conclusion by the same route. I would rather pool this than have
two half-finished passkey wallets in the same ecosystem.

## We agree on the hard constraint

A passkey cannot sign a Stacks transaction. WebAuthn signs secp256r1, Stacks
needs secp256k1, and WebAuthn does not let you choose the signed message.
Clarity has `secp256k1-verify` and no P-256 equivalent, so on-chain account
abstraction is closed too. We wrote "do not re-litigate this" in our own notes.
Only worth revisiting if Clarity gains a P-256 primitive.

So the passkey unlocks the key. It is not the key. I think that is your design
too, and it is the only design available.

## The one place we may have diverged, and it is worth settling

You describe deriving the Stacks address from the PRF output. We went a step
sideways:

1. Generate a 24 word BIP39 mnemonic in the browser, derive `m/44'/5757'/0'/0/0`
2. Create the passkey with `prf`, `residentKey: required`, `userVerification: required`
3. HKDF the PRF output into an AES-256-GCM key, encrypt the seed
4. Store the ciphertext, keyed by credential ID. The server cannot decrypt it
5. To sign: Face ID, PRF, decrypt in memory, sign, zero the seed

The reason is recovery. If the key is the PRF output, then losing the passkey
loses the account permanently, the account can never be imported into Xverse or
Leather, and the account is bound to the RP ID. Change the domain and you change
the wallet.

With a seed underneath, the 24 words import into any Stacks wallet forever. That
is the escape hatch, and it is why we can say this is not a lock-in play and
mean it.

Genuine question rather than a criticism: is there a seed under your derivation
and the summary just elided it, or is the PRF output the key material directly?
If it is the latter I would push hard on recovery before anyone funds one of
these, and I would be happy to be talked out of my position.

Two constants of ours that must never change, as an example of the shape of the
problem: `PRF_SALT` is `xtrata.wallet.v1.seed-encryption` and the HKDF info
string is `xtrata-seed-v1`. Editing either orphans every existing wallet. They
get versioned, never mutated. You will have the same class of constant somewhere.

## Something we found the hard way, which may be your Chrome on iOS item

iPhone Edge created a passkey successfully and then failed the very next PRF
call with `NotAllowedError`. An identical retry passed everything. The cause was
iOS Stolen Device Protection, which is active away from a familiar location and
delays or blocks exactly this operation. Environmental and transient, not a
browser limitation.

The sequence is the dangerous part. Credential created, PRF then failed. Had we
sealed a seed against that credential and the user funded it, the money would
have been behind a passkey that would not open.

The rule we now enforce: **never seal a seed against a credential whose PRF is
unproven.** Create the passkey, run a live PRF round trip, and only then generate
and seal. If PRF fails, discard the credential and start over. Nothing is lost
because no wallet exists yet.

Corollary: `NotAllowedError` is not a capability verdict. It covers a cancelled
prompt, a timeout and Stolen Device Protection alike. Treat it as retryable and
never record it as "this device cannot do passkeys". Our canary was wrong about
this on the first run and now says retry.

If your Chrome on iOS diagnosis is landing on "this combination cannot do local
creation", it is worth checking whether you are looking at a verdict or at a
transient refusal wearing the same error name.

Two testing gotchas while I am at it. `python3 -m http.server` advertises itself
as `[::]`, which is not a secure context, so use `http://localhost:<port>`. And
a LAN address will not work either, because passkeys bind to a domain. There is
no way to test a phone without a real HTTPS deploy, which cost us an afternoon.

## Our device results, read honestly

Five tests per device ending in a GO or NO-GO verdict, run 27 July.

| Device | Result |
| --- | --- |
| Desktop Chrome 150, macOS | GO, all 5 including reload survival |
| iPhone Safari 26.5.2, iOS 18.7 | GO, all 5 |
| iPhone Chrome 150 | GO, all 5 |
| iPhone Firefox 153 | GO, all 5 |
| iPhone Edge 150 | GO on retry, see above |
| iPad Safari | not run |
| Desktop Safari | not run |
| Android | not run |

The iOS coverage needs reading carefully. Apple requires every iOS browser to
use WebKit, so those four are four shells over one engine and one keychain.
Strong for iOS, but that is one implementation, not four. Your Safari on iOS
result and ours are probably the same evidence.

The canary itself is a single dependency free HTML file. You are welcome to it,
and it would be more useful to both of us if there were one canary rather than
two.

## What we have built, and what we have not

Built, with 111 tests, including known answer address locks so that a change to
the derivation fails loudly rather than silently relocating existing wallets:

- `envelope.ts`, the PRF to HKDF to AES-GCM seal and open, with wipe discipline
- `seed.ts`, 24 word generation, validation, derivation
- `session-return.ts`, pre-signed rolling return with cap and staleness guards
- `bridge/protocol.ts`, `bridge/client.ts`, `bridge/host.ts`

Not built, and this is the honest list:

1. The wallet origin is not deployed. The bridge exists, the hostname does not
2. No WebAuthn ceremony wrapper yet, so the ordering rule above is documented
   rather than enforced in code
3. No wallet iframe UI, which means no confirmation screen and no in-frame
   24 word reveal
4. No ciphertext storage endpoint
5. Not registered as a provider behind our own `connectWallet` seam
6. Not wired to the sponsor relay, which is the combination actually worth
   having. Face ID, no app, no STX, and you can still transact
7. No fallback for devices where PRF fails

So we are roughly where you are. Neither of us can sign in shipped form.

## The isolation position, which I would defend strongly

Our bridge runs the wallet on its own hostname in a sandboxed iframe, and the
protocol is designed so that it has no field capable of carrying a secret. There
is no "return me the seed" method and no "return me the private key" result. The
24 words render inside the iframe and never cross the boundary. There is a
runtime assertion that enforces this, because a protocol that merely omits a
dangerous field can grow one by accident.

A same origin iframe gives none of this. `/wallet/` on the main host is not
isolation, it is decoration. It needs a genuinely different hostname, so that an
injection on the main site stops at the iframe wall.

I raise it because a library that expects to be imported into the host page is
making the opposite bet, and I would like to understand how you are thinking
about blast radius before we converge on an API.

## Four things about the Xtrata runtime you will want, for everything we build together

These are not chess specific. They apply to the newspaper and to every inscribed
app either of us ships, and all four are invisible in local development.

**1. A contract call needs a host bridge or the shim refuses it.** `shimRequest`
rejects `stx_callContract` with -32601 unless there is a `walletBridgeToken` in
the page URL and a parent or opener. The shim also patches
`window.LeatherProvider` and the Xverse Stacks providers in place, so an app
cannot sidestep it by preferring an extension. A raw link to an inscription with
no token renders and reads fine and cannot sign anything.

The consequence for a passkey wallet is that it is a runtime level provider, not
an app level import. Registration behind the `connectWallet` seam is item 5 on
our own not built list, and it is the same seam yours would need.

**2. The Hiro rewrite is HTML only.** `api.mainnet.hiro.so` is rewritten to the
shared proxy at serve time, but only for `text/html`. Anything served as
JavaScript keeps calling the public host and every viewer burns the per IP rate
limit. A JS inscription has to pick its own base.

**3. `document.currentScript` is truthy inside a bundled inscription.** A guard
like `if (document.currentScript) boot()` is meant to separate a classic script
from a module import, but a bundle is a classic script and `currentScript` stays
set through its whole synchronous execution. If the bundle footer also boots, the
app starts twice. Nothing looks wrong, because markup guards make the second
mount a no-op, so the page renders perfectly and every button has two listeners.
On our chess board that meant two wallet prompts per connect and two signed
transactions per move. Real money, twice.

**4. A hang under the runtime may be microtask starvation, and no timeout can
rescue it.** The shim's own promise chains can loop without ever yielding to the
macrotask queue. When that happens every `setTimeout` in the tab stops, so a
wallet timeout, a poll or a spinner cannot fire to report it. The symptom is a
button that does nothing and a console that looks healthy.

Number four matters most for you. If your SDK detects a hung provider with a
timeout, that detection does not run under this condition. We diagnose by
counting calls across `await Promise.resolve()` turns instead, because those are
the only thing still scheduled. The same trap catches test suites, since a test
runner timeout is also a timer, so this class of regression hangs the worker
rather than failing the test.

## The origin question, which is the interesting one

WebAuthn credentials bind to an RP ID. An inscription is servable from anywhere,
forever, which is most of the point of putting it on chain. A passkey account
created on one host does not exist on another.

That is not a blocker and I do not think it argues against passkeys at all. It
does mean a passkey wallet is a property of a host rather than of the artefact,
and any inscribed app has to keep working through the extension path when it is
served somewhere else. Worth deciding deliberately rather than discovering, and
it applies to the publishing work as much as to the games.

If you have a view on RP ID strategy across multiple gateways I would like to
hear it, because I do not have a clean answer.

## Signing, and what I would like to do next

For chess, signing is not a nice to have, it is the whole thing. Every move is a
contract call, so an account that can hold assets and cannot sign is not
partially useful here, it is not useful at all. Same for the publishing work.

So yes to issue #12, and we will turn up with something rather than opinions.
Our bridge protocol already declares the method set we needed:

    wallet.status         does a wallet exist on this device, what is its address
    wallet.create         create, with PRF proven before any seal
    wallet.sign           sign a prepared transaction, return signed bytes, never the key
    wallet.preSignReturn  pre-sign a session wallet return for the server to hold
    wallet.revealPhrase   display the phrase inside the iframe, acknowledgement only

I am not claiming that is the right API. It is one that survived contact with our
own threat model, and I would rather hand it over as input to yours than defend
it. If the answer is that our bridge protocol becomes an adapter over your
library, that is a good outcome. If it is the other way round, also fine.

Happy to share the design notes, the test vectors, the address locks and the
canary. Tell me the most useful form, whether that is a PR into
`stacks-passkey-wallet`, a document in `builds-with-xtrata`, or just a long thread
on #12.

One ask in return. Before either of us calls this shipped, I would like the two
derivations to be cross checked against each other's vectors. If your library and
our envelope disagree about what address a given passkey produces, the person who
finds out is a user who cannot reach their funds.

Hope that all makes sense!

Jim

---

## Reply from PerrinoProperties — 2026-08-15

<!-- comment id 5303932238 -->

Hey Jim (and Xtrata's Claude) —

This is the reply that section made me want to write carefully, so I'm doing the same back: what we have, where we agree, where we differ, and where I genuinely don't know yet.

**The hard constraint — same page.** Yes: a passkey can't sign a Stacks transaction directly, for the reason you gave — secp256r1 vs secp256k1, and Clarity has no P-256 verify. The passkey unlocks the key; it isn't the key. That's our design too, and I don't see a way around it without a chain-level primitive neither of us controls. Same as #11 already said, still true: nothing on our side signs yet either — zero passkey-signed transactions in any shipped path. #12 is where that gets built, together.

**Your question, answered straight: yes, there's a real seed underneath.** PRF output → HKDF-SHA256 → 32 bytes of entropy → a 24-word BIP-39 mnemonic, no passphrase → standard BIP-32 derivation (`m/44'/5757'/0'/0/0` for Stacks, `m/84'/0'/0'/0/0` for Bitcoin). Nothing in the original summary elided a step — it's deterministic the whole way through, and the honest part to name is that the seed is never stored anywhere; it's recomputed from the passkey each time it's needed, and buffers get zeroed after use. Export exists — it re-derives via a fresh ceremony, gated behind a backup warning, shown once, redacted out of anything that would accidentally log or serialize it. A produced phrase imports cleanly into Xverse, and the derivation itself is checked against `@stacks/wallet-sdk` and `bitcoinjs-lib` independently — not just against our own math.

Your recovery worry is fair, and I'd rather answer it than talk around it: because the wallet is deterministic from the passkey, the passkey provider — Apple's or Google's account-recovery security — is a de facto custodian until someone exports. Losing a device is fine; the same passkey syncs back in. Losing the *provider account* with no prior export is not recoverable, full stop. That's a real trade, and it's a different one from yours, not a safer one dressed up — you're trading a stored-ciphertext dependency for a derivation that binds hard to the provider account. Both cost something. I'd rather say that plainly than let either of us imply otherwise.

**RP ID — the mechanical answer, since you asked and I actually have one.** Our derivation is credential-bound, not domain-bound — the KDF never sees the RP ID at all. The same credential produces the identical wallet from any origin it's valid for. Change the registrable domain and WebAuthn treats it as a different credential, which derives a different, empty wallet — the exported phrase is the only thing that crosses that boundary. That's mechanics, not a claim about what either of us should build across gateways. I don't have a view yet on RP ID strategy for inscriptions-served-from-anywhere, and I don't want to pretend I do.

**Two constants of ours, in the spirit of yours.** `userVerification` is key material, not a UI toggle — the UV and non-UV PRF outputs are different, frozen, never treated as interchangeable. And the salt that actually reaches the authenticator isn't the raw salt we pick — the browser transforms it first (`SHA-256("WebAuthn PRF" || 0x00 || salt)`) before it gets there. Get either wrong and you silently derive a different wallet from the one you tested against. Filing both next to your `PRF_SALT` / HKDF-info pair feels like the right home for them.

**Stolen Device Protection — thank you, genuinely.** That's a real candidate cause we hadn't landed on, and your framing — NotAllowedError is not a capability verdict — is exactly right; we've been treating it too close to a verdict in places. Your Chrome-iOS GO is also directly contrary evidence to where our own diagnosis was leaning, and I'd rather have that now than after we published something wrong. Not calling either settled yet — the honest move is rerunning our differential with location/SDP-state as a controlled variable rather than assuming your result generalizes to our setup — but this changes what we're testing for, not just what we expect to find.

**The cross-check — yes, and I'd like it to be a real gate, not a courtesy.** Agreed: neither of us should call this shipped until the two derivations are checked against each other's vectors. Ours are pinned here: `github.com/DeOrganized/stacks-passkey-wallet/tree/03f19fb/test/vectors` — the verifier imports nothing from the library itself, so it's an independence check, not a self-consistency one. Worth being precise about where the honest seam is: your envelope and our derivation diverge above the mnemonic layer by design — different salt universes producing different roots is expected, not a bug to reconcile. What should never diverge is the BIP-32 math once each of us has a seed in hand, and that's the layer worth cross-checking hardest. One flag before you point anything real at them: our published vectors are synthetic test material — never fund an address derived from them, and I'd say the same caution back about pointing ours at yours.

**Isolation — I want to answer this honestly rather than resolve it here.** Our bet has been different from yours by necessity: nothing is stored, so there's no vault to isolate — the exposure window is the moment of derivation and signing, not a ciphertext at rest. That's a real answer to a different threat model than the one your sandboxed-iframe-with-no-secret-shaped-field design is solving. Your position deserves to be argued at full strength, and I don't think a comment thread is where that gets decided — #12 is where the actual signing API gets designed, and blast radius has to be part of that conversation, not a footnote to it. I don't have a verdict on whose shape wins, and I'd be suspicious of anyone who did before that conversation happens.

**Your method set — yes, bring it to #12.** `status` / `create` / `sign` / `preSignReturn` / `revealPhrase` is exactly the shape of thing that issue needs as input, not commentary. Adapter-either-direction is the right posture to start from — whether your bridge becomes an adapter over our library, ours over yours, or neither, that's a design question for #12 to actually work through, not something either of us should call from a reply.

**One shared canary — yes.** Two canaries testing the same claim is exactly the kind of duplicated, easy-to-diverge work that gets one of us burned later. Happy to converge on yours, ours, or a new one — whatever's least disruptive to what you've already got running.

Your four runtime findings — the bridge-token gate, the HTML-only Hiro rewrite, the `currentScript` double-boot, the microtask-starvation blind spot — are exactly the kind of thing that would've cost us real time to discover independently. Filing all four on our side now; they'll shape anything we build against your runtime whether or not it ends up touching signing.

See you at #12.

— Steve
