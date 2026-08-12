# Forever Twins: DeGrants Delivery Plan

Stacks Community DeGrants Cohort 4. $5,000 awarded, announced 2026-08-05.
Steward: mrwagmi.btc. Solo delivery (Jim Crane).

This is the execution spine for the grant. It tracks what was promised, what the
repo already has, what is genuinely unbuilt, and the order to build it in.

Status as of 2026-08-10: **award announced, grant not yet confirmed.** The
DeGrants panel still shows stage "Initial Pitch", $0 received, and "No action
required at this time." The 12 week clock anchors to the confirmed start date,
so it has not started. Week numbers below are relative (W1 = first week after
confirmation), not calendar dates.

---

## 1. Read the payment schedule before planning the work

The panel milestones do **not** match the two milestone structure in the pitch.

| Panel milestone | Amount | Gate |
|---|---|---|
| Initial Payment | $1,000 | Released after blueprint approval |
| Submit Impact Report | $4,000 | Locked until all milestones completed |
| Project Complete | n/a | Locked until final Impact Report approved |

The pitch promised Milestone 1 at week 6 and Milestone 2 at week 12. The panel
has no week 6 payment. **80% of the money lands after the final impact report is
approved.** That means roughly 11 of 12 weeks are self funded, which is the same
position as the last six years, but it should be a deliberate choice rather than
a surprise in October.

Two things to raise with the steward before signing the blueprint:

1. Ask whether the $4,000 can be split to match the pitch milestones (for
   example $1,000 / $2,000 / $2,000), or confirm it is genuinely end loaded.
2. Confirm the payout asset and the rate used to convert $5,000. STX, sBTC, and
   USD all move differently over 12 weeks and the pitch does not say.

Neither blocks starting work. Both change how the 12 weeks are paced.

---

## 2. What the promise actually commits to

Extracted from the blueprint text, restated as testable deliverables.

**Milestone 1, end of week 6**
- M1.1 Public preservation service launched
- M1.2 A first cohort of at-risk collections preserved, **beyond** the three
  already live (Bitcoin Pepes, LEO Cats, Miami Degens)
- M1.3 Public preservation registry listing each collection and its twin contract
- M1.4 Educational explainer on off-chain art fragility
- M1.5 "Preserve your collection" how-to guide plus onboarding docs
- M1.6 Tooling and registry published open source

**Milestone 2, end of week 12**
- M2.1 Self-serve deployer, public, fee hard-coded, no founder in the loop
- M2.2 Per collection claim page
- M2.3 Optional USDCx and sBTC payment alongside STX
- M2.4 Adoption metrics: collections preserved, self-deployments, holder wallets
  holding a twin, on-chain mint transactions
- M2.5 Public recap

**Budget lines**
- $2,500 development and tooling (deployer, registry, claim tooling)
- $1,500 payment rails and onboarding support (USDCx and sBTC, cohort onboarding)
- $1,000 educational content and docs

---

## 3. What already exists, verified in repo

This is better news than the pitch implies. Three of the six M1 items are mostly
done and two of the M2 items have reusable plumbing.

| Asset | Location | State |
|---|---|---|
| Working helper contract, production proven | `forever-twins/contracts-reference/rapha-fakfun/leo-fakfun-xtrata.clar` | Live pattern, canonical-hash gated, 295 lines |
| Resolver + app integration, fully generic over registry | `src/lib/twins/` (registry, hiro, resolver) | Done, 709 lines, tested |
| Collection reference data | `forever-twins/data/contracts.json` | 3 collections wired |
| Linking + escrow spec | `docs/forever-twins-linking.md` | Canonical, includes "add a new collection" checklist |
| Educational long-form | `forever-twins/publish/` (State-of-Link-Rot-2026, Verify-It-Yourself-Guide, Repoint-Your-Collection-Playbook, Bitcoin-Pepes-Case-Study) | Drafted, needs fact verification |
| Campaign copy, FAQ, outreach | `forever-twins/copy/`, `FAQ-and-Objections.md`, `data/founder-prospects.csv` | Drafted |
| Claim ledger, KOL list | `forever-twins/data/` | Starter data |
| USDCx and sBTC contract patterns | `contracts/live/xtrata-market-*-usdcx-v1.1.clar`, `*-sbtc-v1.1.clar` | Live, reusable |
| Payment asset abstraction | `src/lib/contract/payment-assets.ts`, `fungible-assets.ts` | Tested |

**The gap is narrower than the pitch, and sharper.** M1.4, M1.5 and much of M1.6
are drafting-complete and need verification, not authorship. The real unbuilt
work is the Xtrata-native contract and the deployer.

---

## 4. The two hard problems the pitch does not name

These are the reason this plan exists. Both need a decision in W1, before any
code, because they change what gets built.

### Problem A: the contract cannot be a factory

Every live twin contract is a **clone**. Its own header says so: "Clone this
contract per collection (swap the two source constants)." The escrow uses
Clarity 4 `as-contract?` with `with-nft` asset allowances:

```clarity
(as-contract? ((with-nft SOURCE "leo-cats" (list id)))
  (try! (contract-call? SOURCE transfer id current-contract recipient)))
```

The asset name `"leo-cats"` is a **compile-time literal**. A single factory
contract holding many collections cannot express this, so it cannot custody
arbitrary collections' NFTs under post-condition-safe escrow.

**Recommendation: codegen, not factory.** The deployer is a template plus a
substitution step plus deploy-from-the-user's-wallet. The user ends up owning
their own contract, which is exactly what "anyone can stand up a collection's
own Forever Twins contract" describes.

This raises a follow-on: if the deployer owns the contract, what stops them
editing the hard-coded fee before deploying? Answer, and it is a good one:

> **The registry is the trust anchor, not the contract.** The registry only
> lists contracts whose deployed source hashes to the canonical template hash
> for a given version. A tampered fee produces an unlisted contract.

That makes the registry a real public good with teeth rather than a JSON file,
and it gives a verification story for the explainer content.

### Problem B: canonical hash seeding blocks true self-serve

`inscribe` asserts the supplied bytes match a pre-seeded canonical hash:

```clarity
(asserts! (is-eq (some expected-hash) (map-get? CanonicalHash token-id)) ERR-NOT-CANONICAL)
```

Seeding runs 200 entries per tx and then freezes with `finalize-canonical`. For
Bitcoin Pepes that was 2,089 tokens, roughly 11 transactions, and before any of
that someone had to pull the whole collection's art off IPFS and hash it.

"No need for me to be in the loop" cannot mean a stranger does that by hand.
Three ways out:

- **(a) Drop canonical gating for self-serve deploys.** Cheapest. Destroys the
  "provably faithful rather than an approximation" claim, which is the core of
  the pitch. Reject.
- **(b) Ship a hash harvester.** A CLI/worker that reads the source collection's
  token URIs, fetches each asset, computes the hash chain, writes a manifest,
  and emits the seed transactions. Self-serve means "run one tool and sign
  the txs", which is honest and deliverable.
- **(c) Permissionless lazy seeding**, first writer wins per token id. Removes
  the setup burden but lets a hostile first writer permanently poison a token
  with a wrong hash. Reject on those grounds.

**Recommendation: (b).** The harvester becomes an explicit named deliverable and
it is the single highest-risk item in the 12 weeks. Build it early, not in W9.

---

## 5. Schedule

W0 is now, pre-confirmation, and costs nothing but time.

### W0 (now, before confirmation)

- [ ] Draft the Project Blueprint document for submission
- [ ] Raise the payment-split question and payout-asset question with the steward
- [ ] Lock the Problem A and Problem B decisions above
- [ ] Run the verification sweep already listed in `forever-twins/README.md`
      ("Verify Before Formal Publication") so published claims are safe:
      live claim count, live `get-free-threshold` and `get-fee`, claim URL,
      listed-token behaviour, post-twin transfer behaviour
- [ ] Confirm with Rapha how the fak.fun contracts and the new Xtrata-native
      contract co-exist, and whether the three live collections get relisted
- [ ] Shortlist 5 to 8 at-risk collections from `data/founder-prospects.csv`,
      ranked by how dead their art hosting already is

### W1 to W2: the contract and the harvester

- [ ] `xtrata-forever-twin-v1.clar` template, generalised from the leo-cats
      contract, with SOURCE, asset name, and fee as substitution slots
- [ ] Fee hard-coded as a constant (not an owner-settable data-var) in the
      self-serve template. Keep the owner-settable variant for cohort deploys
      where a launch promo is wanted.
- [ ] Clarinet test suite covering the escrow invariant (exactly one side liquid),
      canonical rejection, and fee routing
- [ ] Hash harvester CLI: token URIs to fetched assets to hash manifest to
      seed transactions
- [ ] Harvester dry-run against Bitcoin Pepes, hashes must reproduce the already
      seeded canonical set exactly. This is the correctness proof.

### W3: testnet end to end

- [ ] Deploy template to testnet against a throwaway collection
- [ ] Full lifecycle: seed, finalize, inscribe, swap both directions
- [ ] Confirm the master allow-list interaction (the pause note in the contract
      header: if `xtrata-v3-2-3` is paused, the new contract must be on its
      AllowedCallers list). Verify before mainnet, not after.

### W4: registry

- [ ] Registry data model, extending `src/lib/twins/registry.ts` and
      `forever-twins/data/contracts.json` into one source of truth
- [ ] Template source hash verification, per section 4
- [ ] Public registry page listing collection, twin contract, tokens preserved,
      verification status
- [ ] **Metrics instrumentation lands here, not in W11.** M2.4 needs
      collections preserved, self-deployments, holder wallets holding a twin,
      and mint tx counts. Reconstructing those in W12 from chain history is a
      week of work. Counting them from W4 is free.

### W5: cohort onboarding

- [ ] Onboard cohort collections 1 and 2 onto the new Xtrata-native contract
      (dogfood it, do not use the fak.fun clones for new work)
- [ ] Fact-verify and publish the four `publish/` documents
- [ ] Write the "preserve your collection" how-to from what actually happened in
      W5, not from theory

### W6: Milestone 1 delivery

- [ ] Preservation service live on mainnet
- [ ] Cohort preserved and listed
- [ ] Registry public
- [ ] Guide and docs published
- [ ] Repo open sourced with licence
- [ ] M1 evidence pack assembled (see section 6)

### W7 to W8: deployer

- [ ] Deployer UI: pick collection, run harvester, review manifest, deploy from
      your own wallet, seed, finalize
- [ ] Auto-generated claim page per deployed contract
- [ ] Testnet self-deploy by someone who is not Jim. This is the real test of
      "no need for me to be in the loop" and it must happen before W10.

### W9: payment rails

- [ ] USDCx and sBTC fee paths, reusing `payment-assets.ts` and the
      `xtrata-market-*-usdcx/sbtc-v1.1` patterns
- [ ] Post-conditions per the wallet playbook. Note the known trap: exact-match
      post-conditions abort and burn the miner fee.

### W10: public launch

- [ ] Deployer public on mainnet
- [ ] First external self-deployment
- [ ] Announcement thread, tagging @StacksEndowment and the stewards

### W11: adoption push

- [ ] Cohort collections 3 onwards
- [ ] Founder outreach from `copy/Founder-Outreach-Sequences.md`
- [ ] Metrics snapshot

### W12: close out

- [ ] Public recap post
- [ ] Impact report submitted with the evidence pack
- [ ] Sustainability note: what the fee revenue covers post-grant

---

## 6. Evidence capture, from day one

$4,000 depends on an approved impact report. Capture as you go into a running
log rather than reconstructing in W12.

Suggested: `forever-twins/grant-log.md`, appended weekly, one short entry with
date, what shipped, tx ids, links, and numbers. Screenshots of community
response at the time they happen, because threads get deleted.

Metrics to have instrumented by W4:

- Collections preserved, split into cohort-onboarded and self-deployed
- Twins minted (on-chain mint tx count)
- Distinct holder wallets holding a Forever Twin
- Contracts deployed through the self-serve tool
- Fee revenue, as the sustainability evidence

---

## 7. Risks, ranked

1. **Harvester complexity.** Collections store art in inconsistent ways.
   Fetching and hashing an arbitrary collection reliably is the hardest
   engineering in the grant and it gates M2. Mitigation: build in W1 to W2,
   prove against Bitcoin Pepes, and scope self-serve to the URI patterns that
   actually work rather than promising all of them.
2. **Cash flow.** Roughly 11 of 12 weeks unfunded. Mitigation: resolve the split
   question in W0.
3. **Cohort recruitment.** M1.2 needs real collections to say yes inside six
   weeks. This depends on other people. Mitigation: start outreach in W0, target
   more than needed, and prefer collections whose art is visibly already
   breaking, because the pitch writes itself.
4. **Scope on payment rails.** USDCx and sBTC were pitched as "forward-looking
   accessibility". If W9 is tight, ship one rail well rather than two badly, and
   say so in the recap.
5. **Master contract coupling.** Everything mints through
   `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`. A pause, a version
   bump, or an allow-list gap breaks every twin contract at once. Verify the
   allow-list in W3 and note the dependency in the docs.
6. **Unverified public claims.** The campaign pack's own README flags claim
   counts, promo terms, and claim URLs as unverified. Publishing those under a
   grant deliverable raises the cost of being wrong. Clear the list in W0.

---

## 8. Open questions for the steward

1. Can the $4,000 be split to match the pitched week 6 and week 12 milestones?
2. What asset is the grant paid in, and at what conversion?
3. What is the confirmed start date, and does the 12 week clock run from
   confirmation or from first payment?
4. Is there an interview stage before blueprint submission, per the panel
   stepper, and should the blueprint be drafted now or after it?
5. What format does the impact report need to be in?
