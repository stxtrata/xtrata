Draft reply for DeOrganized/builds-with-xtrata#11. Not posted.

One decision before it goes: the last section describes v3.2.4's mint-single-tx-to,
which is a candidate and not deployed. It commits us to nothing but it does tell
them it exists.

═══════════════════════════════════════════════════════════════════════

Steve,

You asked for the cross-check to be a real gate rather than a courtesy, so rather than agree to it I went and ran it.

**Four vectors, four matches.** Our derivation reproduces every Stacks address in your published set, at `03f19fb`.

```
all-zero        SP37B02PN2BK8T1DCEQBF8E0MD5B6CQ06Y25J1AYH   match
all-ff          SP2VRDRY5G0KFBKTSWFBHDY4W6AXH2BDJR4MH0SW3   match
counter-0..31   SP5Y2VZYN3B1Y38AQR1970XYBN3QF0D0A0PXRPZ7    match
sha256-tagged   SP3JA93Y4FPDNZ9QVXXSBATCZKB0QE60CQ0W61DG9   match
```

Your framing of the seam was the thing that made it runnable, so I took it literally. Above the mnemonic we diverge on purpose and I have not tried to reconcile it. The test asserts your salt and HKDF info differ from ours, so that nobody later mistakes a deliberate difference for a bug and "fixes" it. Below the mnemonic there is one right answer and that is what is under test.

Your vectors are vendored into our tree at that commit rather than fetched, so if either side moves it shows up as a deliberate update instead of a silent drift. And I read the JSON as data. I did not run `verify.mjs` or `negctl.mjs`, on the same principle you would apply to ours.

Three honest qualifications, because a gate that overstates itself is worse than no gate.

**We checked Stacks only.** Your vectors also pin `m/84'/0'/0'/0/0` and the testnet path. We derive no Bitcoin path at all, so there was nothing on our side to compare. Call it four for four on the layer we both implement, not on your whole suite.

**Your suite is bigger than the comparison.** The negative controls are the part I would point other people at. Number four in particular, the testnet coin type pinned as a regression control after 0.2.0, is exactly the failure this gate exists to catch: an address that looks right, shares its hash160 with the mainnet one, and differs only in the prefix. That is the kind of thing that reaches a user before it reaches a test.

**One small thing to flag rather than let it propagate.** The opening message says 43 vectors and 5 negative controls. The 5 is exact. The vectors file at `03f19fb` holds four, and your own README says "re-derives all four vectors", so I assume 43 is the assertion count across them. Worth pinning down before the number gets quoted onward, given you led with no rounding up.

## Your two constants, taken

Both are filed next to `PRF_SALT` and `HKDF_INFO`, which was the right home for them.

The userVerification one is sharper for us than for you, and it is worth saying why rather than just agreeing.

Our envelope module never runs the WebAuthn ceremony. The PRF output arrives as a parameter, so there is nothing in that code that can enforce the invariant even in principle. It is a contract with the caller and nothing more.

And the cost of getting it wrong is not symmetric. On your design a wrong PRF derives a different, empty wallet. Visible immediately, and the real one is still reachable once the ceremony is corrected. On ours it means `openSeed` throws against an intact ciphertext for a funded wallet, and the only way back in is the 24 words. Same mistake, and it is recoverable for you and close to terminal for us. So thank you for it, and it is now written down in the one place a future caller will look.

The salt transformation note is in the same comment, because it explains why raw salt comparisons across implementations never line up, which is the sort of thing two teams waste a day on separately.

## The recovery trade

You stated it more plainly than I would have, and I am not going to re-argue it. You are right that it is a different trade and not a safer one. We depend on a stored ciphertext surviving. You bind hard to the provider account until someone exports. Both cost something and neither of us should imply otherwise in public.

The one thing I would add is that the two failure modes are uncorrelated, which is mildly interesting. Nothing that loses our ciphertext touches your provider account, and nothing that loses an Apple account touches our storage. That is not an argument for either design. It might be an argument for an integrator being able to choose.

## Isolation, and what I will bring to #12

Agreed that a comment thread is not where this gets decided, so I will keep it to one sentence here and bring the substance there.

I have read #12 and I can see the surface is settled with Skullcoin, so to be clear up front: what I want to raise is not a change to it. The signing surface looks right to me. My question is about where the caller lives rather than what the caller calls, and I think that is a deployment question sitting underneath an API that does not need to move to accommodate it.

Two practical notes for anyone else reading this thread later. #12 is in `stacks-passkey-wallet`, not in `builds-with-skullcoin` as the opening message reads. And it is pinned to `0.2.0` while npm is on `0.2.2`.

## The canary

Ours is yours if it is the least disruptive option. Single HTML file, no dependencies, no build step, five tests per device ending in a GO or NO-GO. It is deliberately dumb so that a result from it is hard to argue with.

The one thing I would want carried into whichever we converge on is the retry rule, since it is the bit ours got wrong first: a `NotAllowedError` gets retried and never recorded as a device verdict.

## A question that decides our integration

Your default salt is overridable per app. That makes it a product decision rather than a configuration detail, and I do not think either of us has taken it.

If Xtrata uses the default, a player's Xtrata wallet and their Skullcoin wallet are the same wallet on the same phone. If we set our own, they are two wallets that share a passkey and no funds. Both are defensible. It is permanent once chosen, it is invisible to the user until the moment it surprises them, and it wants deciding before anyone funds anything rather than after.

Do you have a view? Ours leans toward one Xtrata universe covering chess, the newspaper and the inscriptions, but I hold that loosely and the cross-ecosystem argument is real.

## One thing we can ship before either of us can sign

You were straight that `signStacksTransaction` is not built, and I said the same about our bridge. So neither of us can currently offer a player an account that does anything.

Except that receiving is not signing.

We have a contract candidate, v3.2.4, that adds a recipient parameter to the mint path. It exists because you asked for it back in issue #1. The payer covers the fee, the recipient ends up as owner and as on-chain creator, and the payer appears only as a field on the emitted event.

What matters here is what the recipient has to do, which is nothing. No signature, no STX, no funded wallet. They only have to be a principal.

So a player taps Face ID, your library gives them a real Stacks address, and we mint them something they genuinely own. That path is complete today with neither of us able to sign a thing.

It does not help chess, where every move is a contract call and an account that cannot sign is no use at all. But the first-asset moment on a phone is the part of your original pitch with no signing dependency in it, and it is available now rather than after #12 ships.

Worth a conversation about whether that is a useful place to start.

— Jim (and Xtrata's Claude)
