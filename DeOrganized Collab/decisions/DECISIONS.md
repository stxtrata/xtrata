# Decisions

What we settled, and why, so it is not re-argued. Newest first. Add a row when a
question stops being open.

---

## 2026-08-17 — v3.2.4 is the successor, v3.4.0 is retired

Two unshipped contracts both branched from v3.2.3 and neither contained the
other. The version numbers misled: v3.4.0 is dated 2 July and v3.2.4 is 27 July,
so the higher number was the older work.

**Decision: base on v3.2.4.** Every definition v3.4.0 added over v3.2.3 was
migration machinery, and its migration made the person migrating upload the whole
inscription again, putting the same bytes on chain twice. Jim rejected that
outright, correctly: paying twice to store what we sell once is the wrong trade.
Removing that left nothing of v3.4.0 to keep.

Consequence accepted knowingly: v3.2.4 keeps the proxy migration, so it depends
permanently on v3.2.3 staying readable. Stacks contracts are immutable and reads
are free, so the old cores become the storage layer for anything migrated off
them.

## 2026-08-17 — parent links keep their ownership gate, with consent as the escape

The `-to` mints let a publisher pay for an author. That raised whether a parent
link should check the payer or the recipient.

**Decision: neither. The default does not move.** Today the children of your
inscription are exactly the ones you made, and there is no reverse index, so that
ownership gate is the whole guarantee. Jim refused to weaken it, correctly: a
stranger could otherwise hang junk off an album and gift it in.

Instead `set-parent-delegate` is an opt-in the owner controls. One call, specific
to one delegate, revocable, and it only permits children that mint back to the
owner. It transfers no STX, so a publisher can sponsor the miner fee and the
author still needs no funded wallet.

Steve confirmed this is the right posture and asked us not to bend it.

## 2026-08-17 — expiry is pegged to Bitcoin blocks

The 4320 constant meant 30 days when a Stacks block was a Bitcoin block. Post
Nakamoto it silently became about 15 hours.

**Decision: measure expiry in `burn-block-height`.** Same constant, restored
meaning, and it stops drifting the next time Stacks block production changes.

## 2026-08-17 — v3.2.4 ships priced as v3.2.3 actually is

Two fee defaults were the values v3.2.3 shipped with rather than what it charges.

**Decision: bake in the live numbers.** Correct pricing from the moment it lands,
no admin transaction in between. Also the only comfortable route, since the fee
guard caps a change at 10x down and correcting one of them afterwards would have
sat exactly on that limit.

## 2026-08-05 — the answer to fee notification is a mechanism, not a promise

Steve asked whether there is an announcement channel for fee changes.

**Decision: do not promise a notice period.** Jim's reasoning was that a promise
he has to remember is not a guarantee. Better that the contract enforces it.

What we told them instead is what is already enforced: a 1 STX ceiling and a 2x
per change cap, deployed and unforgettable. A propose/confirm/cancel timelock
with a readable pending change is proposed but not committed.

Steve called the guard table the answer he wanted and said he would close the
issue with it.

## 2026-08-04 — the derivation cross-check is a gate, not a courtesy

Both sides agreed neither ships until the two derivations are checked against
each other's vectors.

**Our half is done: four vectors, four matches.** Their vectors vendored at
`03f19fb`, their framing of the seam adopted exactly, and the deliberate
divergence above the mnemonic asserted so nobody later "fixes" it.

---

## Still open

| Question | Why it matters |
|---|---|
| **Salt universe** | Their salt is overridable per app. Is an Xtrata wallet the same wallet as a Skullcoin wallet on one phone? Permanent once chosen, invisible until it surprises someone |
| **Isolation** | Their signing function takes the root secret as its first argument. Our bridge exists to stop that. Unraised in #12 |
| **Whose adapter** | Both sides say either direction is fine. Nobody has picked |
| **Does v3.2.4 ship, and when** | Candidate, tested, undeployed. Deploy order matters and one step is unrecoverable if missed |
