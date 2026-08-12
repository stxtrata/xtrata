# Forever Twins: The Decisions That Matter Now

Plain-language companion to `GRANT-DELIVERY-PLAN.md`.

Ten issues, worst first. Each one says what the problem actually is, why it
matters, what the options are, and what I would do.

**The single most important fact on this page: the blueprint has not been
submitted yet.** Once it is approved it becomes the yardstick for the final
$4,000. Right now you can still choose what you are being measured against.
That will not be true in a fortnight.

---

## 0. Upgrading the core: the twins survive, but you cannot keep v3.2.3 minting

**The worry:** upgrading the core contract stops the three existing Forever
Twins collections working.

**The finding:** existing twins are safe unconditionally, but the obvious fix
(allow-listing the helpers so a paused v3.2.3 keeps minting) is wrong and would
corrupt the ID sequence. The way through is a second helper contract per
collection, which Jim can deploy alone and which needs nothing from Rapha.

> **Correction.** An earlier version of this section recommended allow-listing
> the three helpers on a paused v3.2.3. That is unsafe. See "Why the allow-list
> is wrong" below.

### The calls are identical

I diffed `contracts/live/xtrata-v3.2.3.clar` against
`contracts/drafts/xtrata-v3.2.4-draft.clar`. Forty changed lines out of 1,663.
Every function the twin contracts use is untouched:

| Call the twins make | v3.2.3 | v3.2.4 |
|---|---|---|
| `quote-single-tx-fee` | same signature | same signature |
| `mint-single-tx` | same signature | same signature |
| `transfer` | same signature | same signature |
| NFT asset name `xtrata-inscription` | same | same |

v3.2.4 is purely additive. It raises the chunk cap from 2,048 to 8,192, adds
five functions, and adds `migrate-from-v3-2-3`. Nothing is removed or renamed.
`contracts/drafts/v3.2.4/V3.2.3-TO-V3.2.4-DIFF.md` says the same thing in its
own words: "Nothing you call changes."

### So why did it look like a problem?

Because the twin contracts pin the core as a **constant**:

```clarity
(define-constant MASTER 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3)
```

All six reference contracts do this. A constant in a deployed Clarity contract
can never be changed. **The three live twin contracts will call v3.2.3 forever
and there is no upgrade path for them, only redeployment at a new address.**

That sounds fatal. It is not, because v3.2.3 does not go anywhere when v3.2.4
ships. The real question is not "how do they move" but "what happens to them if
v3.2.3 gets paused", since pausing the old core is how a supersede works.

### Three facts that make this safe

**1. Transfers can never be paused.** Line 621 of v3.2.3 carries the comment
`;; IMPORTANT: transfers are NOT paused`, and the code matches. So
`swap-nft-for-xtrata` and `swap-xtrata-for-nft` keep working no matter what you
do to the core. Every existing holder can always get their twin out, or their
original back. **The custody promise you made to Pepes, LEO Cats and Miami
Degens holders is safe unconditionally.** That is the thing that would have been
reputationally serious, and it is not at risk.

**2. Only new inscribing is gated by pause.** `assert-inscription-allowed`
guards minting. If you pause v3.2.3, new twins on those three collections stop.

**3. But new minting cannot continue on v3.2.3.** See below. This is the part
that constrains the whole decision.

### Why the allow-list is wrong

Inscription ids are one incrementing counter per contract. A supersede keeps
them globally unique by handing the counter over: v3.2.4 calls `set-next-id`
with whatever v3.2.3 reached, and carries on from there.

```clarity
(define-public (set-next-id (value uint))
  ...
  (asserts! (is-eq (var-get next-id) u0) ERR-ALREADY-SET)
```

Two consequences, both hard.

**The handover only works if the old contract stops.** If v3.2.3 is paused but
still has allow-listed callers, it keeps minting from its own counter while
v3.2.4 mints from the same starting number. Both produce id 5,000, then 5,001,
and so on. On chain these are different assets and nothing errors, because
identity is (contract, asset, id). But "Xtrata #5000" and `xtrata.xyz/i/5000`
stop meaning one thing, which is the entire invariant the continuity mechanism
exists to protect.

**And it is a one-shot, irreversible decision.** `set-next-id` only works while
`next-id` is still zero, so it can be called exactly once, before the new core
mints anything. Get the number wrong at deploy and there is no correcting it.

So the choice is real: **either v3.2.3 keeps minting and the id space forks, or
v3.2.3 closes with an empty allow-list and the three collections need somewhere
else to mint.**

### The way through: a second helper per collection

This is the idea you had, and it is the right one. It works, and it is better
than the alternative.

For each of the three collections, deploy a **new** Forever Twins helper
pointing at the new core. The original Rapha helpers are left completely
untouched and keep working forever for swaps. The collection ends up split
across two twin contracts: the ~100 LEO Cats and the single Miami Degen already
done stay where they are, everything after mints on the new one.

That split does not matter to anyone. The original Stacks collection is
unchanged and still one collection. Both twins are permanent, both are real
Xtrata inscriptions with real ids, both are hash-verified. A holder cannot tell
which helper they used except by looking.

Crucially: **nobody needs Rapha for any of this.** A helper contract calls
`get-owner` on the source collection and needs no permission from it, which is
the same property that makes the grant's self-serve deployer possible at all.
Jim writes and deploys these alone.

**The one thing that must be added, or it breaks.** Each helper has its own
`Bindings` map, so with two helpers live, LEO Cat #5 could be inscribed on both
and end up with two different twins. That destroys the one-twin-per-token
invariant. The new helper has to refuse anything the old one already bound:

```clarity
(define-constant PRIOR 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata)

;; inside inscribe, alongside the existing checks
(asserts! (is-none (contract-call? PRIOR get-binding token-id)) ERR-ALREADY-INSCRIBED)
```

`get-binding` is a read-only on all three existing helpers (line 255 in each),
so this call is available and cheap. The prior helper's address is fixed and
known, so it can be a constant.

### Why this is better than the alternative

The alternative is reserving an id band: set v3.2.4's `set-next-id` far above
v3.2.3's counter, leaving a gap for the old helpers to keep minting into. It
works arithmetically. It is worse in every other way. It leaves two contracts
minting forever, it depends on a one-shot irreversible guess about how many
twins three collections will ever produce, and if that guess is low the ids
collide years later with no recourse.

The two-helper approach has none of that. v3.2.3 closes cleanly, allow-list
empty, counter handed over exactly. Nothing is ever ambiguous again.

It also costs less than it appears, because **building those three helpers is
milestone 1 work, not overhead.** They are the first real use of the grant's
contract template, dogfooded on three collections whose communities you already
know. The canonical hashes have to be re-seeded into each new contract, which is
exactly what the harvester in section 3 is for. The dependency runs in the right
direction.

### The ordered runbook

The full cutover sequence, including three ordering defects found in the
existing 26-step core migration plan, is in
`contracts/drafts/v3.2.4/CUTOVER-ADDENDUM.md`, written in the `steps.json`
schema so it merges into the existing canary machinery.

The three edges that matter: pause v3.2.3 before reading its counter, empty its
allow-list before handing the counter over, and call `set-next-id` before any
migration.

### What to check before committing

- **Confirm the remaining supply** of LEO Cats and Miami Degens, so the size of
  the re-seed is known rather than assumed.
- **Decide the payout split** on the new helpers. Rapha's contracts split fees
  50/50 via `payout-a` and `payout-b`. Keeping his share on the three
  successor contracts costs nothing to implement and is the decent read of the
  partnership. Worth raising with him as part of the section 8 conversation.
- **Confirm the new core's pause state** and allow-list the new helpers on it if
  it ships paused.

### The actual trap: escrowed twins cannot be migrated by anyone

`migrate-from-v3-2-3` moves a token by calling
`(contract-call? .xtrata-v3-2-3 transfer token-id tx-sender ...)`, which means
**the current owner has to call it**. For a twin sitting in escrow, the current
owner is the helper contract. And the helper contracts expose no function that
would make them call it. Their entire public surface is inscribe, the two swaps,
seed and finalize canonical, and the fee and ownership setters.

So every twin currently in escrow is permanently pinned to v3.2.3. Not
temporarily, not pending a tool. There is no sequence of transactions by you,
by Rapha, or by the holder that migrates it while it stays bound.

Worse, the obvious workaround is a trap. If a holder swaps their twin out of
escrow into their own wallet and then migrates it to v3.2.4, they can never swap
it back, because the helper's swap function expects a v3.2.3 token to be
deposited. They would break the pairing between their NFT and its twin and
there would be no way to repair it.

**If you ship v3.2.4, holders of the three live collections must be told not to
migrate their twins.** That warning is more important than the upgrade itself.

### Recommendation

**Do not migrate existing twins. Leave them on v3.2.3 permanently, close v3.2.3
with an empty allow-list, hand the counter over cleanly, and deploy one
successor helper per collection on the new core with the prior-binding guard.**

This sounds like it violates the newest-only rule in `CLAUDE.md`, and it does
not. That rule has an explicit carve-out for records of where on-chain activity
actually happened, using `collection-lock.ts` as the example. These twins live
on v3.2.3. Pointing at v3.2.3 for them is the record being accurate, not the
codebase being untidy. The cost the rule exists to prevent, enumerating two
versions on every page load, does not apply either, because the twin registry
names the core per collection, so the app only reads v3.2.3 when someone is
actually looking at one of those three collections.

New collections, including everything the grant funds, target the newest core.

### One thing to settle first

`contracts/live/xtrata-v3.4.0.clar` already exists, and
`contracts/drafts/V3.4.1-MERGE-PLAN.md` is an active plan for building v3.4.1
from parts of v3.2.4. Its section 6 is literally titled "does v3.4.1 need
migration at all?" **Decide whether the target is v3.2.4 or v3.4.1 before
spending any time on migration mechanics**, because that plan may already have
answered this question in a way that changes the whole shape of it.

### Two smaller things that do change

Neither touches the twin contracts, both touch the app and any indexer.

- `get-contract-info` returns `"xtrata-v3.2.4"`. Any code comparing that string
  to `"xtrata-v3.2.3"` breaks.
- The `inscription-sealed` event gained a `payer` field, so any strict schema
  parser needs loosening.

---

## 1. The people whose art you are saving may not be there to save it

**The problem in one line:** a Forever Twin only gets created when somebody pays
to create it, and the collections most worth rescuing are the ones whose holders
have already walked away.

The pitch says holders preserve their own twin for a modest fee. That works
beautifully for a live collection with an active Discord. It does not work for a
collection from 2021 whose founder is gone and whose holders have not opened
that wallet in two years. Those are exactly the collections you described as
at-risk. So the deliverable "a first cohort of at-risk collections preserved"
has a hole in the middle of it: you can deploy the contract, announce it, and
have nobody show up.

**The good news is the contract already solves this and you may not have
noticed.** The v2 contract header says inscribing is permissionless. Anyone can
inscribe any token's twin. Only the owner can ever swap. So a third party, you,
a patron, or the community, can pay to preserve art on behalf of an absent
holder, and the twin still ends up correctly tied to the real owner. Nothing is
taken from anyone.

**Options**

- (a) Only onboard collections with active communities. Safe numbers, weak
  story, and it quietly abandons the actual mission.
- (b) Use grant money to inscribe at-risk art directly, as a preservation fund.
- (c) Hope holders turn up.

**Recommendation: (b), funded from the $1,500 "onboarding support" line.** It
turns "a drive to preserve at-risk collections" from a marketing phrase into
something you can actually point at in the impact report. It also gives you a
much stronger public line: you are not waiting for permission to save things.

**If you get this wrong:** week 11 arrives, the at-risk cohort has four twins
between them, and the impact report has no adoption story.

---

## 2. Every week you wait, some of the art you promised to save gets harder to save

**The problem in one line:** the tool has to download the artwork before it can
preserve it, and the whole reason these collections need preserving is that the
artwork is disappearing.

This is the uncomfortable irony at the centre of the project. You cannot
preserve a dead link. If a collection's IPFS pinning lapses in September, that
collection is no longer rescuable in October.

**What follows from it**

- Do the art harvesting for your target collections **early**, before you have
  built anything else. Downloading and hashing the files is cheap and can happen
  in week 1. Inscribing them can happen later.
- Harvest more collections than you plan to onboard. Storage is nearly free and
  a hard drive full of hashed collection art is itself a preservation act.
- This is also your best outreach line to founders. "Your art is still there
  today, I checked" is a real conversation. "Your art is gone" is a different
  and more urgent one.

**Recommendation: add a week 1 task to harvest and hash the art of every
collection on the prospect list, whether or not they have agreed to anything.**
It costs a day and it buys you the ability to say yes later.

---

## 3. The hardest thing to build is the thing you have not started

**The problem in one line:** the self-serve tool needs to read the artwork out
of any NFT collection on Stacks, and every collection stores it differently.

Generating a contract from a template is easy. Deploying it from a wallet is
easy. The hard part, and it is much harder than it looks, is the step in
between: point the tool at a collection and have it reliably fetch every piece
of art, hash it correctly, and produce the list the contract needs.

Collections differ in where the metadata lives, how the image is referenced,
which IPFS gateway works, how big the files are, and whether the links resolve
at all. There is no standard. This is genuinely unbounded work if you promise it
works for everything.

**Options**

- (a) Promise it works for any collection. You will not finish.
- (b) Support the specific patterns that actually cover most Stacks collections,
  test against real ones, and say plainly which patterns are supported.
- (c) Skip the verification step so no hashing is needed. This would gut the
  "provably faithful" claim, which is the thing that makes Forever Twins
  trustworthy rather than a copy.

**Recommendation: (b), and build it in weeks 1 and 2, not week 8.** Prove it by
running it against Bitcoin Pepes, where you already know the right answer,
because the hashes are already on chain. If your tool reproduces them exactly,
it works. That is a genuinely rigorous test and it is available to you for free.

**Build the risky thing first.** If the harvester turns out to take four weeks
instead of two, you want to find that out in week 3 with nine weeks left, not in
week 9 with three.

---

## 4. You cannot build one contract that handles every collection

**The problem in one line:** the way the escrow works forces one contract per
collection, so the "deployer" has to generate and deploy contracts rather than
register collections into a single shared one.

The technical reason: the contract holds NFTs in escrow, and Clarity requires it
to name the exact asset it is allowed to move, spelled out in the code at the
moment the contract is written. It cannot be told at runtime. So one contract
cannot custody arbitrary collections.

This is not bad news. It matches what you actually promised, which is that
anyone can stand up **their own** Forever Twins contract. It just means the
deployer is a code generator, and each user ends up owning their own contract.

**The catch, and the fix.** If people deploy their own contract, they can edit
the fee before deploying, and your "modest fee hard-coded" promise evaporates.
The fix is to stop trying to enforce it in the contract and enforce it in the
registry instead: the public registry only lists a contract if its deployed code
matches the official template exactly. Change the fee, and you get a contract
that works but is not listed, not verified, and not shown anywhere.

**Recommendation: codegen plus a registry that checks the code matches.** This
is better than the original plan, not a compromise. It makes the registry a real
piece of infrastructure with a job to do, and it gives you a concrete thing to
teach in the educational content: here is how to check that a Forever Twins
contract is the real thing.

---

## 5. The payment rails line does less than it sounds like, and I was wrong about this yesterday

**Correction to what I told you before.** I said the USDCx and sBTC work was
mostly reusable wiring. Having read the code properly, it is not.

The app has a payment-picker abstraction that can offer sBTC and USDCx, but its
own comment says no shipped contract actually accepts them, so it always falls
back to STX. More importantly, the inscription fee paid to the Xtrata core is
STX, in code, in the part of the flow you are not changing.

**What that means in practice:** even if you add sBTC payment for the service
fee, the user still needs STX in their wallet to pay for the inscription itself.
The stated goal of the $1,500 line was to widen access. Adding a second way to
pay one of the two fees, while the other still requires STX, does not widen
access much.

**The thing that would actually widen access is sponsorship**, where somebody
else covers the STX so the user needs none at all. You already have sponsor
relayer infrastructure in this repo and a working sponsor arrangement through
AIBTC.

**Options**

- (a) Build USDCx and sBTC as promised, and accept that users still need STX.
- (b) Build sBTC only, because it is the on-brand Bitcoin story, and put the
  remaining effort into sponsorship so a user genuinely needs nothing but the
  wallet.
- (c) Build sponsorship only, and describe the payment rails as deferred.

**Recommendation: (b).** It honours the promise in spirit and in visible fact,
sBTC payment does appear, and it delivers the actual accessibility goal instead
of the proxy for it. Say plainly in the blueprint that multi-asset payment
covers the service fee and that sponsorship covers the network cost. That
sentence protects you at review time.

---

## 6. Almost all the money arrives at the end

**The problem in one line:** $1,000 comes after the blueprint is approved, and
$4,000 only after the final report is approved, so you fund about eleven of the
twelve weeks yourself.

The panel milestones do not match the two-milestone structure in your pitch.
Your pitch has a real deliverable landing at week 6 with nothing paid against
it.

**Recommendation: ask for the split before signing the blueprint.** Something
like $1,000 on blueprint approval, $2,000 at milestone 1, $2,000 on the final
report. This is a normal request, it matches the structure you already proposed,
and the moment to ask is while the blueprint is still being agreed. Asking
afterwards is asking for a change. Asking now is agreeing terms.

Also confirm what asset the $5,000 is paid in and at what rate. Twelve weeks is
a long time for that to drift.

---

## 7. The blueprint is your one chance to define what "finished" means

**The problem in one line:** the pitch contains phrases that sound great and
cannot be objectively judged, and those phrases are about to become the test for
your final payment.

The riskiest one is "no need for me to be in the loop". A reviewer in October
could reasonably read that as "a stranger with no technical skill can preserve a
collection unaided". If what you ship is "run a tool, review the output, sign
about eleven transactions", that is genuinely self-serve, but only if you said
so up front.

**Recommendation: in the blueprint, define each deliverable as something
observable.** Not "self-serve deployer" but "a public tool where a collection
owner can generate, deploy and seed their own Forever Twins contract from their
own wallet, demonstrated by at least one deployment carried out by someone other
than the grantee". That second clause is your evidence and your finish line in
the same sentence.

Do the same for the cohort. Name a number. "At least four collections beyond the
three already live" is checkable. "A first cohort" is not.

**Do not paste the pitch text into the blueprint.** The pitch was written to win
the grant. The blueprint is written to be delivered against, and it is allowed
to be more precise.

---

## 8. Rapha built the three collections you are about to replace

**The problem in one line:** the grant funds an Xtrata-native version of
contracts that Rapha at Fak.fun built with you, and nobody has had that
conversation yet.

Your own pitch credits the partnership and says the three live collections came
out of it. The grant then funds moving that capability in-house. That is a
completely legitimate next step and it is what the grant is for. It just reads
very differently depending on whether Rapha hears it from you first or sees it
in an announcement.

**Recommendation: talk to Rapha in week 0, before the blueprint goes in.** List
his three contracts in the public registry as the originals, credit Fak.fun
prominently in the registry and the docs, and agree what happens to new
collections. This costs you nothing. The registry is meant to be a public record
of what has been preserved, and leaving out the first three because of who
deployed them would make it a worse record.

---

## 9. Everything depends on one contract that you can already check

**The problem in one line:** every Forever Twin mints through
`xtrata-v3-2-3`, and if that contract is paused, every twin contract stops at
once unless each one is on its allowed-callers list.

The contract source itself warns about this. It is a five minute check and a
one-line note in the docs, and it is the kind of thing that is invisible until
the day it takes everything down.

**Recommendation: verify the allowed-callers behaviour on testnet in week 3,
before any collection depends on it**, and write the dependency into the
onboarding docs so anyone deploying their own contract knows it exists.

---

## What I would do in the next fortnight

In order.

0. **Settle the core version question**, because it gates the contract template
   the grant builds. Decide v3.2.4 or v3.4.1, plan the three successor helpers
   with the prior-binding guard, and write the "do not migrate your twin"
   warning. Section 0. Do not deploy a new core until this is settled, because
   `set-next-id` cannot be called twice.
1. **Ask the steward the money questions.** Payment split, payout asset, start
   date. Section 6.
2. **Talk to Rapha.** Section 8.
3. **Harvest and hash the art of every prospect collection.** Cheap, urgent,
   and it decays if you wait. Sections 2 and 3.
4. **Write the blueprint with observable finish lines**, and hold back the two
   promises that overreach: reframe multi-asset payment as service fee plus
   sponsorship, and define self-serve as a demonstrated third-party deployment.
   Sections 5 and 7.
5. **Clear the unverified claims list** in the README before anything gets
   published under a grant deliverable.

None of that requires the grant to be confirmed, and all of it gets harder once
the blueprint is signed.
