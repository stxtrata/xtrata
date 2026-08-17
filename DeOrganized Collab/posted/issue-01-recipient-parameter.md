# Issue #1 — Feature request: recipient parameter on mint-single-tx (payer ≠ owner in one tx)

Archived verbatim from GitHub. Source of truth, not our drafts.

- **URL:** https://github.com/DeOrganized/builds-with-xtrata/issues/1
- **Opened:** 2026-08-03 by PerrinoProperties
- **State at archive:** open
- **Archived:** 2026-08-17

---

## The question, as they asked it

From DeOrganized: our platform signer pays inscription fees on behalf of members. Today payer and owner are structurally the same principal on mint-single-tx, so member-owned inscriptions require mint-then-transfer orchestration. A recipient parameter allowing payer ≠ owner in a single transaction would let us ship author-owned inscriptions and member-targeted badge mints cleanly. Two concrete use cases on our side: (a) limited supporter badges minted for named members; (b) author-owned article inscriptions with platform-covered fees. Formally registering our interest here so the use case is on the record.

---

## Our reply — 2026-08-04

<!-- comment id 5183776928 -->

Good news. This exists in a candidate core, and it does a bit more than you asked for.

Three new functions, each mirroring an existing one with `recipient` added as the first argument:

| Existing | New |
|---|---|
| `mint-single-tx` | `mint-single-tx-to` |
| `mint-single-tx-recursive` | `mint-single-tx-recursive-to` |
| `mint-single-tx-with-relationships` | `mint-single-tx-with-relationships-to` |

The recipient becomes **both owner and creator**. You asked for payer to differ from owner. You also get payer differing from creator, so your writer holds full on-chain authorship and the platform appears only as a `payer` field on the emitted event. That closes the provenance caveat I raised in DM in July.

The fee still leaves `tx-sender`, so your existing `<=` post-condition pattern needs no change.

It is a candidate, not a deployment. Written and tested, never deployed. No date from me yet. Your use case is the reason it exists, so you will hear when that changes.

**Parent links needed more thought than the mint did.** A parent link is gated on ownership, so today the children of your inscription are exactly the ones you made. We did not want to weaken that just to make sponsored minting work, because it would mean anyone could hang junk off your collection and gift it to you.

So the default does not move. Instead an owner can opt in, once:

```clarity
(set-parent-delegate (delegate principal) (allowed bool))
```

After your author calls that naming your signer, your signer can attach children to inscriptions that author owns, but only children that mint back to that author. It cannot be used to build someone else's lineage, it is specific to one delegate rather than a blanket opt-in, and it is revocable at any time. It is not an admin function, so we are not in the middle of it.

It transfers no STX, which matters for you. Sponsored transactions do cover the miner fee on a call like this, unlike the protocol fee. So it is a one-time handshake your author signs and you sponsor, and they still never need a funded wallet.

Question back to you. Is a one-time opt-in per author acceptable in your flow, or does even that extra signature hurt? The design is still open and yours is the use case driving it.

---

## Reply from PerrinoProperties — 2026-08-04

<!-- comment id 5184022436 -->

This is better than what we asked for @stxtrata — recipient as owner AND creator closes the provenance question completely. Writer holds authorship, we're just the payer on the event. That's the design we'd have drawn if we could.

Direct answer to your question: yes, a one-time opt-in per author is acceptable — and honestly it's the right security posture. You were right not to weaken the ownership gate on parent links; a revocable, per-delegate, non-admin opt-in is exactly what we'd want defending our own members' lineages from junk.

One precision on where the signature lands in our flow, so the design accounts for reality on our side: the -to mints themselves need zero signatures from our members, which means author-owned inscriptions work for our passkey-native members on day one of a deploy — that's the core use case fully covered. The set-parent-delegate handshake is the one place a member signs a contract call, and today our passkey accounts hold and receive but don't yet sign arbitrary calls — that's our roadmap, not yours. Practical effect: delegation works immediately for our wallet-linked authors, and passkey-only authors pick it up when our signing layer lands. Since lineage features trail plain authorship in our sequencing anyway, the one-time signature doesn't hurt — don't bend the design for it.

The sponsored-tx detail (delegate call transfers no STX → we can cover the miner fee) is a genuinely nice touch — author signs once, never needs a funded wallet. Confirmed that works for us.

No pressure on deploy timing. When the candidate moves, we'll be ready to integrate the -to path quickly — the use case is live on our side and waiting for it.
