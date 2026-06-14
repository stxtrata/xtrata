# Forever Twins Campaign - Live Next Steps

Concise operating plan for moving the Bitcoin Pepes Forever Twins campaign forward now that the helper contract is live, claims are running, and holders are already creating Xtrata twins.

## Current Operating Status

Use this as the live framing unless the contract/read-only checks show otherwise.

- The campaign is no longer pre-launch. It is live and already running.
- The Bitcoin Pepes helper contract is live.
- Pepes are already being converted into Forever Twins on Xtrata.
- Working public count: around 200 Pepes have already been added to Xtrata. Use `around 200` in casual copy until the live read-only count is pulled.
- The public story should now shift from `coming soon / preparing to launch` to `live proof / holders are already using it`.
- Remaining checks are now admin hygiene, accuracy, support, and campaign amplification, not blockers to the basic fact that the system is running.

## Updated Operating Principle

The job now is to keep the live campaign tidy, provable, and easy to explain.

Use this rule throughout:

- **Live** = already happening and safe to describe in broad terms.
- **Verified exact** = checked against contract state or a confirmed source, safe to publish as a hard number/fact.
- **Approximate** = okay for casual updates, but do not use in press or formal docs.
- **Still TBC** = do not use as a public claim.
- **Internal only** = useful for planning, not for public wording.

Public copy should now say things like:

- `Bitcoin Pepes holders are already creating Forever Twins on Xtrata.`
- `Around 200 Pepes have already been added to Xtrata.`
- `This is now a live collection-level permanence case study, not just a concept.`


## Phase 1 - Reset the Campaign Admin Board

**Goal:** Move the campaign board from launch-prep mode into live-operations mode.

Create or update the campaign board with these columns:

1. **Live / Done**
2. **Needs exact verification**
3. **Content to update**
4. **Community support**
5. **Proof / screenshots / clips**
6. **Founder outreach**
7. **Finalization**
8. **Blocked / waiting on Rapha**

For every task, track:

- owner;
- status: `Live`, `Verified`, `Needs update`, `Published`, `Blocked`;
- evidence link, transaction, screenshot, or file reference;
- date last checked;
- next action.

Move these items out of blocker language:

- helper contract live;
- Pepes are being converted;
- Xtrata twins exist;
- campaign has live traction;
- claim count is already substantial, currently around 200.

Keep these as live admin checks rather than launch blockers:

- exact current claim count;
- exact claim URL;
- live fee state;
- listing/transfer behaviour wording;
- wallet support wording;
- finalization timing;
- approved Rapha / Fak.fun partner wording.

## Phase 2 - Source-of-Truth Files Updated

**Status:** Completed in the active campaign pack.

The source-of-truth, holder-facing, social, outreach, and publishable copy files have been moved from prelaunch framing into live campaign framing. They now describe Bitcoin Pepes Forever Twins as live, name the helper contract as live, include the working Fak.fun claim route, and treat `around 200` as approximate casual wording until a fresh read-only count is recorded.

Updated files include:

1. `Campaign-Facts-and-Open-Questions.md`
2. `README.md`
3. `Launch-Checklist.md`
4. `FAQ-and-Objections.md`
5. `publish/Bitcoin-Pepes-Case-Study.md`
6. `publish/Verify-It-Yourself-Guide.md`
7. `copy/X-Threads.md`
8. `copy/Landing-Page-Copy.md`
9. `ops/Social-Content-Calendar.md`
10. `copy/Founder-Outreach-Sequences.md`
11. `copy/Press-Pitch.md`
12. `copy/Hero-Video-Script.md`
13. `ops/Discord-Activation-Plan.md`
14. `Source-Claims-and-Citations.md`
15. `publish/State-of-Link-Rot-2026.md`
16. `data/contracts.json`

Do not reopen this as launch-prep work unless new public copy introduces stale prelaunch wording again.

## Phase 3 - Pull the Live Contract Facts

**Goal:** Keep public numbers and support answers accurate while the campaign is running.

Run or manually check these read-only values:

- `get-inscribed-count`
- `get-free-threshold`
- `get-fee`
- `fee-for`
- `get-binding`
- `is-inscribed`
- `get-canonical-hash`
- `is-finalized`
- `get-owner`

Minimum checks to run now:

1. Pull the current `get-inscribed-count` and replace `around 200` where exact wording is needed.
2. Confirm the live fee now that the free threshold has likely passed.
3. Check a known converted Pepe with `get-binding`.
4. Check one unconverted Pepe with `is-inscribed`.
5. Confirm whether `is-finalized` is still false.
6. Confirm whether the working Fak.fun route should be replaced by any approved redirect.
7. Confirm transfer/listing behaviour in the UI and FAQ.

Admin process:

- Save each result as a screenshot, explorer link, or terminal output.
- Add the result to `data/claims-ledger.csv` or a new `ops/live-checks.md`.
- Record the date/time checked.
- Use exact numbers only when they are less than 24 hours old, unless clearly labelled as `as of [date]`.

## Phase 4 - Tighten the Holder Support Flow

**Goal:** Make sure holders understand what they are doing and where to get help.

Update the public FAQ around these questions:

1. What is a Forever Twin?
2. Has this already launched?
3. How many Pepes have been added to Xtrata?
4. Does this replace the original Bitcoin Pepe?
5. Where does the original go?
6. Where does the Xtrata twin go?
7. What happens if I sell or transfer after creating a twin?
8. Can listed Pepes claim?
9. Why is there a fee?
10. Is the artwork fully on-chain after conversion?
11. Can I verify my twin myself?
12. What if the old IPFS/media path breaks later?

Support admin:

- Create a simple issue log with: token ID, wallet, issue, screenshot, status, owner, resolution.
- Keep wallet addresses private unless the holder is already public or has opted in.
- Keep a pinned explanation of the two-token model in Discord.
- Add a standard response for `Why does it show the contract as owner?` if the UI is reading escrow ownership rather than the live bound holder relationship.
- Add a standard response for `Why am I paying after others got it free?` if the first-87 promo has ended.

## Phase 5 - Shift the Public Campaign Copy

**Goal:** Move from announcement copy to proof-led momentum.

Priority copy updates:

1. `Live now` post.
2. `Around 200 already converted` post.
3. `How to claim` walkthrough.
4. `Why two tokens?` explanation.
5. `Verify your twin` guide.
6. `What permanence actually means` thread.
7. `Bitcoin Pepes as the first live Forever Twins case study` post.
8. Daily or every-other-day progress update.
9. Holder shoutout format.
10. Founder-facing case study summary.

Use this framing:

- Lead with live traction.
- Then explain the permanence problem.
- Then show Bitcoin Pepes as the working proof.
- Then invite holders and founders to act.

Example public wording:

> Bitcoin Pepes Forever Twins are live.
>
> Holders are already converting Pepes into permanent Xtrata twins, with around 200 added so far.
>
> The original collection stays the original collection. The Forever Twin gives the artwork a bound on-chain counterpart that can survive even if old media paths fail.

## Phase 6 - Capture Proof While It Is Happening

**Goal:** Turn the live campaign into a case study.

Capture these assets now:

1. Screenshot of the claim page.
2. Screenshot of a successful claim.
3. Screenshot of a Pepe on Xtrata.
4. Screenshot of the mapping/binding result.
5. Short clip of the holder journey.
6. Short clip showing old pointer risk vs Xtrata permanence.
7. Claim count screenshot or script output.
8. A few opted-in holder examples.
9. Rapha / Fak.fun quote.
10. Jim / Xtrata quote.

Admin process:

- Store proof assets in a dated folder.
- Name files clearly: `YYYY-MM-DD-token-id-proof-type`.
- Keep raw files separate from edited social assets.
- Do not use wallet addresses in graphics unless approved.
- Keep a `case-study-evidence.md` file listing each claim and its source.

## Phase 7 - Community and Social Rhythm

**Goal:** Keep momentum without sounding spammy.

Suggested daily rhythm while claims are active:

- Morning: check live count and support issues.
- Midday: post one useful proof, explanation, or holder-facing update.
- Afternoon: reply to holders and founder comments.
- Evening: log questions, update FAQ, prepare next post.

Content mix:

- 40% proof and progress;
- 30% education about permanence and broken pointers;
- 20% holder/community shoutouts;
- 10% founder-facing permanence audit angle.

Do not over-post the same claim count. Use the count when it has changed meaningfully or when it supports a bigger point.

## Phase 8 - Finalization Planning

**Goal:** Prepare finalization as a trust moment, not a rushed admin task.

This still remains a gated event.

Do not finalize until:

1. Manifest is complete.
2. Token ID mapping has been reviewed.
3. Canonical hashes have been reviewed.
4. Batch size is planned.
5. Operator wallet is confirmed privately.
6. Dry run or rehearsal is complete.
7. `is-finalized` is confirmed false before the event.
8. Verification guide is updated.
9. Backup plan is agreed.

Event order:

1. Explain that the campaign is already live and claims have already happened.
2. Explain what finalization locks in.
3. Show the manifest/mapping.
4. Show sample verification.
5. Execute any required `seed-canonical` calls.
6. Re-check sample canonical hashes.
7. Execute `finalize-canonical`.
8. Wait for confirmation.
9. Show `is-finalized`.
10. Publish transaction links and verification steps.

Hard stop rules:

- If any mapping mismatch appears, do not finalize.
- If any manifest issue appears, do not finalize.
- If explorer/API results disagree, pause and reconcile.
- If transaction fails, do not improvise public claims.

## Phase 9 - Founder Outreach

**Goal:** Use Bitcoin Pepes as a live proof point for other collections.

Founder outreach can now begin softly because there is already live traction. Keep it proof-led and non-accusatory.

Before sending broader outreach, prepare:

1. exact current Bitcoin Pepes twin count;
2. one clean claim example;
3. one clean Xtrata viewer example;
4. one clear explanation of the bound-pair model;
5. one sentence on current fee/process;
6. one honest note on finalization status;
7. one private audit offer.

Founder CTA:

> I am not saying your collection is broken. I am saying every collection that depends on external media paths should understand exactly what those paths are and what happens if they fail.

Process:

1. Fill `data/founder-prospects.csv` with 10 to 20 targets.
2. Keep risk notes internal.
3. Do not publicly accuse any collection of being broken.
4. Offer a private permanence audit.
5. Track response status, next action, and any technical findings.

## Immediate Next Actions

Use this as the working checklist.

- [ ] Pull exact `get-inscribed-count` and record the result with date/time.
- [ ] Confirm the live fee and whether the first-87 promo is now historical.
- [ ] Confirm whether the working Fak.fun route should be replaced by any approved redirect.
- [ ] Check at least one converted Pepe using `get-binding` and save the proof.
- [ ] Check one unconverted Pepe using `is-inscribed` and save the proof.
- [ ] Tighten the FAQ once transfer/listing behaviour has been verified.
- [ ] Create a simple issue log for wallet, listing, transfer, and UI ownership questions.
- [ ] Capture screenshots/video of the live claim flow and Xtrata inscription view.
- [ ] Publish a `live now / already around 200` progress post once the wording is approved.
- [ ] Begin soft founder outreach using Bitcoin Pepes as the live case study.
- [ ] Keep hard link-rot statistics out of public copy until `Source-Claims-and-Citations.md` is completed.
- [ ] Keep finalization separate from the basic live campaign and only run it after mapping/hash review.

## One-Line Internal Summary

Bitcoin Pepes Forever Twins is live, running, and already has real traction. The next job is not launch permission; it is tightening the admin, proving the live numbers, supporting holders, capturing evidence, and turning the campaign into a repeatable founder-facing case study.
