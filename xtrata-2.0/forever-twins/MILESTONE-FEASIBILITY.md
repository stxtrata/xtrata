# Milestone feasibility: can we actually hit the minimums?

Assessment of the three milestones in `BLUEPRINT-FORM-ENTRIES.md` against what is
actually in the repo and on chain. 17 August 2026.

Verdict per milestone, then the three wording changes that matter.

| Milestone | Week | Amount | Verdict |
|---|---|---|---|
| 1. Tooling proven and open sourced | 4 | $1,000 | **Comfortable.** One genuine unknown, spike it on day one. |
| 2. Service, registry and documentation live | 8 | $1,500 | **Achievable, most exposed.** Depends on work the grant does not pay for. |
| 3. Deployer public and impact reported | 12 | $1,500 | **Achievable.** One criterion is worded wrong and looks harder than it is. |

Nothing here is overreach. Three things need rewording before submission.

---

## Milestone 1: Tooling proven and open sourced

### What we committed to

Contract template with substitution slots and a hard-coded fee. Prior-binding guard.
Clarinet suite covering the escrow invariant, non-canonical rejection and fee routing.
Hash harvester. Evidence: public repo with licence, tests green, a testnet contract
through the full lifecycle, and a byte-exact Bitcoin Pepes replay across 2,089 tokens.

### What already exists

**The harvester is much further along than the earlier audit implied.**
`forever-twins/scripts/measure-collection.mjs` is 263 lines of working code that reads
supply from a source contract, resolves token URIs, fetches the art, and reports bytes
and chunk counts. It has already been run successfully across **nineteen collections**,
including 200 LeoCats PNGs sampled across the whole id range, 20 Miami Degens, and 56
Bitcoin Pepes twins read back off chain. Two independent LeoCats measurements agree to
within 0.6 per cent.

That matters because "reading art out of arbitrary collections" was named as the
hardest and most unbounded engineering in the grant. It is substantially solved and
demonstrated on real collections. What remains is the hash chain, the manifest output,
and emitting the seed transactions. The hash algorithm is known and simple.

The three other scripts in that directory are TODO stubs that exit 1, which is what
the audit saw. The fourth is the one that counts.

**The contract template starts from working production code.**
`leo-fakfun-xtrata.clar` is 295 lines and live on mainnet. The changes are repointing
`MASTER`, adding a three-line prior-binding guard, and converting fee and payouts from
data-vars to constants. This is a day or two, not a rewrite.

**Bitcoin Pepes is the easiest possible proof case.** 2,089 items, mean 5,538 bytes,
every single one fitting a single chunk. No staged-path complexity.

### The one genuine unknown

**The Clarinet manifest.** No twin helper is registered in any Clarinet manifest today,
and the v3.2.4 sub-manifest is deliberately pinned to Clarity 3 because `as-contract`
does not resolve under Clarity 4. The helper needs Clarity 4, since `as-contract?`,
`with-nft` and `current-contract` are all Clarity 4 constructs. Nobody has measured how
big that problem is, and it sits in front of the entire test suite.

**Action: spike this on day one, not in week three.** If simnet cannot compile the
helper under Clarity 4, the fallback is testing the lifecycle on testnet directly. That
is slower and less pleasant but it works, and the milestone evidence already names a
testnet contract rather than a simnet run.

### Wording change 1

"Reproduces Bitcoin Pepes' existing on-chain canonical hashes byte for byte across all
2,089 tokens, with zero mismatches" is the strongest claim in the milestone and it
contains a trap that is not our fault.

The Pepes canonical hashes were seeded from source art in the past. If any of that
source art has since gone unreachable, the harvester cannot fetch it, cannot hash it,
and "zero mismatches" fails for reasons that have nothing to do with whether the code
is correct. This is the exact decay the project exists to fight, and it would be
absurd to be defeated by it inside the proof.

Reword to separate the two things:

> For every token whose source art is still retrievable, the computed hash matches the
> on-chain canonical hash exactly, with zero mismatches. Tokens whose source art can no
> longer be fetched are counted and published separately as a link-rot measurement.

That is still rigorous. A single mismatch on retrievable art still fails the milestone.
And it converts a possible embarrassment into a finding, because the count of
already-unreachable Bitcoin Pepes art is exactly the sort of number this project should
be publishing.

---

## Milestone 2: Preservation service, registry and documentation live

### What we committed to

Public registry with template verification status. Public preservation service on
mainnet. Successor twin contracts for LEO Cats and Miami Degens, seeded and finalised.
Four long-form documents fact verified, plus a how-to and onboarding docs.

### The parts that are comfortable

**The successor seeding is mechanical and cheap.** LEO Cats is 10,000 tokens, which is
50 seed transactions at 200 per transaction. Miami Degens is 420, which is three. At
observed miner fee rates that is roughly 10 STX in total. More importantly the LEO
Cats canonical hashes are recoverable byte-exact from the old helper's own
`seed-canonical` transaction arguments, so **no IPFS fetch is needed for LEO Cats at
all**. Miami Degens needs a genuine harvest of 420 items, which is small.

**`finalize-canonical` has never been called on either helper**, so this milestone
makes a frozen canonical set true for those collections for the first time. That is a
real, checkable improvement and it is entirely ours to deliver.

**The documents are drafted.** 457 lines across the four. The work is fact verification
against live contract state, and the README already enumerates what is unverified. That
is bounded work with a known list.

**The resolver exists.** `src/lib/twins/` is 709 lines, tested, and fully generic over
the collection registry. The registry page is new UI on top of a solved data layer.

### The real exposure

**This is the milestone most coupled to work the grant does not pay for.** The successor
contracts point at `xtrata-v3-2-4`, which pins the core as a Clarity constant. They
cannot be written until the new core address is final, and they cannot be deployed until
it is live. The core cutover is separate unpaid work with an audited readiness report,
a long pole of its own, and an open question about whether the target is v3.2.4 or
v3.4.1.

The blueprint's stated fallback is to ship on the current core if the cutover slips.
That fallback is weaker than it sounds, because the current core is the one being
paused. Deploying a successor against a core that is about to stop accepting
inscriptions creates rework rather than avoiding it.

### Wording change 2

**Move the LEO Cats and Miami Degens successor contracts out of Milestone 2 and into
Milestone 3.**

Milestone 2 then contains only things nobody else can delay: the registry, the service,
the six documents, and the counter instrumentation. Zero external dependencies, zero
core-cutover coupling.

Milestone 3 is where the successors belong anyway, because a preserved collection is
evidence of use rather than evidence of build, and Milestone 3 already carries the new
collections for the same reason.

One fix to schedule regardless: `src/lib/twins/resolver.ts` keys its reverse-index cache
on `collection.key`, so registering two helper generations for one collection makes the
second silently inherit the first's index. That has to be fixed before any registry
shows both generations.

---

## Milestone 3: Self-serve deployer public and impact reported

### What we committed to

Public deployer with no action from us and no key held. Claim page per registry entry.
At least two collections beyond the three already live. A payment and access path that
removes the requirement to hold STX. Metrics page. Recap post. Preservation ledger.

### The parts that are comfortable

**The two new collections are already chosen and analysed.** `COLLECTION-SIZING.md`
ranks nineteen candidates by volume with measured data sizes. Wasteland Apes is the
standout: second-highest lifetime volume on Stacks at 251,253 STX, 10,000 items, and
only 64.8 MB in total because the art is about 6.5 KB per item, every one a single
chunk. Contract checks already passed, including a public `transfer`, which the escrow
model requires. Bitcoin Bulls OG at 400 items and 0.7 MB is a trivial second.

The commitment is a live twin contract with a fixed canonical set and at least one twin
inscribed. It is not the whole collection. So this is roughly 50 seed transactions and
one inscription, not 10,000 inscriptions.

**The full Wasteland Apes collection is affordable if we want the headline.** About 110
STX of protocol fees plus about 64 STX of miner fees, if the run is scripted at a chosen
fee rate rather than letting a wallet estimate each transaction. Observed rates vary by
32 times across the three live helpers, so fee strategy matters more than payload size.
Under 200 STX for a complete 10,000-item collection is well within the preservation fund.

### Wording change 3, and this is the important one

**"One mainnet preservation completed by a wallet that held no STX at the time" is
worded wrong, and the wrong wording makes it much harder than it needs to be.**

As written it implies a wallet with no STX signs an inscription transaction. That needs
either the sponsor relayer or a passkey wallet, and both are currently poor bets:

- The sponsor relayer is not production-equivalent. `FABLE-5-SPONSOR-RELAYER-HANDOFF.md`
  names three protections present in the Node implementation and absent from the
  deployed Pages one, and the 17 passing tests do not exercise the production path at
  all.
- The passkey route is blocked. The wallet's extension whitelist is gated on an admin
  who is seeded as the burn address, every extension-capable wallet sampled on chain is
  in that uninitialised state, and the unlock flow is a three-day propose, accept and
  confirm cycle.

**But the goal is already achievable with no new infrastructure whatsoever**, because
inscribing is permissionless in the helper contract. Anyone can inscribe any token's
twin. The caller pays both fees, the twin mints into escrow, and the binding resolves
ownership to the current holder of the original. So a holder with an empty wallet, who
does nothing and signs nothing, ends up with their artwork preserved on Bitcoin and
their twin correctly bound to them.

That is the accessibility story, it is stronger than a payment button, and it works on
the contract as it exists today.

Reword to:

> One mainnet preservation completed on behalf of a holder who held no STX and signed
> nothing, with the transaction id and the resulting binding.

Same intent, far better story, no dependency on a relayer or a wallet vendor. It also
makes the preservation fund and the absent-holder narrative the same mechanism rather
than two separate promises.

### Remaining honest risk

The deployer itself is the largest single piece of new UI in the grant. Code generation
is string substitution against the template and is easy. Deploy-from-your-own-wallet is
a standard contract-deploy transaction. The manifest review step and the seed-and-
finalise flow are the fiddly parts. It is tractable in the weeks allowed but it is the
place to spend any slack that turns up earlier in the plan.

---

## Summary of changes to make before submitting

1. **Milestone 1 evidence:** qualify the Pepes replay proof so already-dead source art
   is counted and published rather than failing the milestone.
2. **Milestone 2 scope:** move the LEO Cats and Miami Degens successor contracts to
   Milestone 3, leaving Milestone 2 with nothing that depends on the core cutover.
3. **Milestone 3 evidence:** reword the no-STX criterion to preservation performed on
   behalf of a holder, which the contract already supports.

None of these reduce what was promised in the pitch. Two of them make the commitments
more honest and one of them makes an existing capability visible instead of inventing a
new dependency.

## What to spike in week one, before anything else

- Can Clarinet compile a Clarity 4 helper at all? This gates the whole Milestone 1 test
  suite and nobody has measured it.
- Does the harvester's hash chain reproduce a known Bitcoin Pepe canonical hash? One
  token is enough to prove the algorithm before running 2,089.
