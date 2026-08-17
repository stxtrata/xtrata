# The two passkey designs, compared

Written to be readable without knowing the cryptography. If you only read one
thing about the passkey strand, read this.

## First, the thing that confuses everyone

You have signed things with a passkey. That memory is correct. "Sign" just means
two different things.

**Signing in.** The passkey proves you are you. This is what passkeys were built
for and what happens on most sites.

**Signing a blockchain transaction.** Producing the specific proof a chain
accepts as "this account authorised this exact action".

On Ethereum and its layer twos, a passkey can genuinely do the second one. A
smart contract there can check a passkey signature directly, so tap Face ID and
you have really signed a transaction.

**Stacks cannot do that.** Passkeys make one type of signature and Stacks only
understands another. Stacks contracts have a built in checker for their own type
and none for the passkey type, so there is nowhere to plug it in.

It is a Stacks limitation, not a passkey one. It changes the day Stacks adds
that checker, and not before.

## So what does a passkey wallet on Stacks actually do

The only thing available:

> The passkey does not sign. The passkey unlocks an ordinary Stacks key, and
> that key signs.

Face ID, unlock, the key signs, transaction goes. To the user it is
indistinguishable from signing with a passkey, which is the point.

Both teams built exactly this, independently, and reached it by the same
reasoning.

## Where the designs differ

One decision: where the Stacks key comes from.

**Theirs, derived.** The key is calculated from the passkey. Same passkey, same
maths, same key, every time. Nothing is stored anywhere.

**Ours, encrypted.** The key is a normal random 24 word wallet. The passkey
encrypts it, and the scrambled version is stored.

### What that costs each side

| If you lose | Theirs | Ours |
|---|---|---|
| Your phone | Fine, the passkey syncs back | Fine |
| Your Apple or Google account, never exported | **Wallet gone permanently** | Fine |
| The stored ciphertext | Nothing to lose | **Need the 24 words** |
| Nothing, you just want out | Export re-derives the phrase | The phrase already exists |

Neither is safer. Steve said so plainly and unprompted, which is worth
remembering when weighing anything else he claims.

One observation that is ours: **the two failure modes are uncorrelated.** Nothing
that loses our ciphertext touches their provider account, and nothing that loses
an Apple account touches our storage. That is not an argument for either. It may
be an argument for letting an integrator choose.

## What matches, and what is deliberately different

Their framing, and it is the right one.

**Above the mnemonic the designs diverge on purpose.** They derive entropy from
the passkey. We encrypt a random seed. Different constants, different roots.
Expected, not a bug, and not to be reconciled.

**Below the mnemonic there is exactly one right answer.** Given the same 24
words, both sides must produce the same Stacks address. If that ever diverges,
somebody's money is in an account they cannot reach.

That lower layer is the gate. **We have run it: four vectors, four matches**, in
`src/lib/wallet/passkey/__tests__/derivation-cross-check.test.ts` on
`main-staging-chess`. Their vectors are vendored at `03f19fb` so drift shows as a
deliberate update.

Scope worth stating: we compared Stacks only. Their vectors also pin Bitcoin
paths and we derive none.

## The disagreement nobody has resolved

Their signing function takes the root secret as its first argument:

```ts
signStacksTransaction(prfBytes, transaction, options?)
```

`prfBytes` is the master secret. Everything comes from it, permanently. So any
app calling this holds the crown jewels in its own page memory. A cross site
scripting bug there does not steal a session, it steals the wallet forever.

Our design exists to prevent exactly that: the wallet runs on its own hostname in
a sandboxed iframe, and the protocol has no field capable of carrying a secret
across the boundary.

Nobody has raised this in #12's twelve comments. The nearest anyone gets is one
of Steve's own comments treating "host apps holding PRF bytes" as a given.

**It needs no change to their locked API.** That signature is correct when the
caller is the wallet origin. The problem is only when the caller is the host
page. Their library running inside our iframe gives both.

## Where each side actually is

Neither can sign. That is the honest summary.

| | Them | Us |
|---|---|---|
| Account creation | Shipped, npm `0.2.2` | Built, not deployed |
| Transaction signing | **Not built**, being designed at #12 | **Not built**, bridge exists, no hostname |
| Mobile proven | Safari iOS confirmed, Chrome iOS open | GO on all four iOS browsers, 27 July |
| Independent vectors | Yes, 4 plus 5 negative controls | Yes, 111 tests plus address locks |

Their iOS caveat and ours are probably the same evidence, since Apple forces
every iOS browser onto one engine.

## Why v3.2.4 matters here

Because receiving is not signing.

v3.2.4 adds a recipient parameter to the mint path. The payer covers the fee and
the recipient ends up owner and on chain creator. **The recipient does nothing.**
No signature, no STX, no funded wallet.

So a player taps Face ID, their library hands over a real Stacks address, and we
mint them something they own. That works today with neither side able to sign.

It does not help chess, where every move is a contract call. It does cover the
first asset moment on a phone, which is the part of their pitch with no signing
dependency in it.
