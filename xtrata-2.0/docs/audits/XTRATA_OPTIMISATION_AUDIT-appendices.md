# Xtrata 2.0 optimisation audit — appendices

Verbatim git output supporting [`XTRATA_OPTIMISATION_AUDIT.md`](./XTRATA_OPTIMISATION_AUDIT.md) §2. Split into its own file only because of length; nothing here is analysis.

Captured 2026-08-01 at `main-staging` = `6601bc31c1042cb104e3d45a450d4933e778ee76`, after `git fetch --all --prune`.

---

## Appendix A — every commit touching `xtrata-2.0/` in the last 21 days

```
$ git log --all --since="21 days ago" --date=short --pretty=format:'%h %ad %an %s' -- xtrata-2.0/
```

270 commits, one author (`stxtrata <stxtrata@gmail.com>`). `%s` gives the subject only; where a commit's body runs to paragraphs, `[...]` marks the truncation and the body is quoted in the main report where it is cited.

```
6601bc31 2026-07-31 stxtrata The Builder draws the machinery it keeps describing
31fa7194 2026-07-31 stxtrata Name the menu after what each destination does, and drop the Wizard from it
ffccbf09 2026-07-31 stxtrata Take the relations strip out of the size calculation entirely
52acf1bc 2026-07-31 stxtrata Nine scenarios that trade, and the two that cannot
1cc4e616 2026-07-31 stxtrata Reserve the relations row, and put ancestors and siblings in it
4b3cf656 2026-07-31 stxtrata A receipt is not a reply
553aaa0e 2026-07-31 stxtrata Align the artwork with the bars above it
3167abb5 2026-07-31 stxtrata Navigate an inscription's family without leaving the enlarged view
14eca936 2026-07-31 stxtrata A nonce can prove absence; it cannot prove arrival
b4e9b0e5 2026-07-31 stxtrata Give the enlarged viewer an identity, and arrows that look like arrows
81a52e8e 2026-07-31 stxtrata A runner that stops rather than guesses
6b2583fb 2026-07-31 stxtrata Two things the first real mints exposed
cabeb3d1 2026-07-30 stxtrata Verify the quote before it becomes permanent
0c9b8149 2026-07-30 stxtrata Three wizards that transact, and a gate before they can
4f717fdb 2026-07-30 stxtrata Markets: stop offering v2-1-0-welded markets, and say so to agents
fb43fd01 2026-07-30 stxtrata Fix: "/" sponsorApi silently disabled sponsored buying everywhere
3026a159 2026-07-30 stxtrata Sponsored market buy: remove the false promise, then wire it properly
9fdedbbe 2026-07-30 stxtrata Mosaic grid must be a fixed square, not auto-fill
543e2322 2026-07-30 stxtrata Mosaic simulator: a fake chain served from folders
27c4561c 2026-07-30 stxtrata Plan: the seed list is fixed, and add the pre-render gate
a93697c5 2026-07-30 stxtrata Rewrite the collection plan for 1,024 tiny seeds
9db3f13d 2026-07-30 stxtrata Correct the plan: duplicate content is allowed, the client is not
d2ae6b95 2026-07-30 stxtrata Plan: a Collection Wizard for up to 10,000 items
2216dae8 2026-07-29 stxtrata Controls a finger can actually hit, on the players and the radio
c7653614 2026-07-29 stxtrata Inscribed player: the tap that asks for sound now makes the sound
4b7fdf22 2026-07-29 stxtrata SUNO: warn when edits have not been applied to the player
6f0e5532 2026-07-29 stxtrata The player hides its own controls the instant you lift your finger
745a7e01 2026-07-29 stxtrata Rescue already-inscribed players that cannot play on a phone
644b47fa 2026-07-29 stxtrata Stop the inscribed player killing its own audio on phones
298c08e6 2026-07-29 stxtrata Let a tapped inscription actually play on mobile
950925f3 2026-07-29 stxtrata Never let a text inscription be attached to something you cannot see
ae2d60f2 2026-07-29 stxtrata Merge branch 'main-staging' of https://github.com/stxtrata/xtrata into main-staging
4e3e7e7c 2026-07-29 stxtrata Stop asking the chain for more than it is allowed to give in one read
d0de3efb 2026-07-29 stxtrata Stop asking the chain for more than it is allowed to give in one read
1dccc79c 2026-07-29 stxtrata Show the drops that were already claimed
295fb0f4 2026-07-29 stxtrata Notes: how the radio gets embedded, and the batch size that was breaking reads
e31fd8cd 2026-07-29 stxtrata SUNO: cap the INSCRIPTION at the contract limit, not the source file
063ab22c 2026-07-29 stxtrata SUNO takes any audio now, and asks for what is missing
1c7d27f6 2026-07-28 stxtrata Stop nagging about jobs that never took a penny
a24fffe5 2026-07-28 stxtrata Fix the /debug page dying on a newline that was never meant to survive
c432a522 2026-07-28 stxtrata Move job history between sites, without ever moving a key
de76470d 2026-07-28 stxtrata Unstick: fill the nonce hole underneath the queue, not just the queue
bec19e43 2026-07-28 stxtrata Unstick: send the replacement to the payer, not to the wallet itself
7dabf318 2026-07-28 stxtrata Fix the open job collapsing on every poll, and stop hiding jobs that still hold money
b3fd8140 2026-07-28 stxtrata Wizard history: expand jobs in place, and stop the panel flickering
2db22622 2026-07-28 stxtrata Radio: keep the dial sweep for power on/off, drop it between songs
c9e6e334 2026-07-28 stxtrata Radio: two more reasons a click landed on the wrong song
7972c7cb 2026-07-28 stxtrata Radio: clicking a song in Your Station plays THAT song
6082465d 2026-07-27 stxtrata Check the chain, not contracts/live: both open v3.2.4 questions were moot
4cfb332e 2026-07-27 stxtrata v3.2.4 candidate: let a publisher pay for an author's inscription
63535bc6 2026-07-27 stxtrata Unstick a jammed wallet, and stop transfers getting stuck in the first place
cb38667c 2026-07-27 stxtrata Show progress in the tab title, and offer a notification when it finishes
b14f9c94 2026-07-27 stxtrata Embedded jobs now warn before you leave the site
f2830b74 2026-07-27 stxtrata Radio page: stop the transport buttons jumping on every track change
04804b01 2026-07-27 stxtrata Revert the drops thumbnail change — it left the Claim page blank
8cdf1f15 2026-07-27 stxtrata Plan: bring SUNO into the main page's tabs
87fbacbb 2026-07-27 stxtrata Repair the SyntaxError I introduced, and make it impossible to miss again
910ba31a 2026-07-27 stxtrata Fix the two SUNO errors my keep-open extraction caused
bff4ba19 2026-07-27 stxtrata Never strand a half-finished upload, and let the user let it go
48b5ea53 2026-07-27 stxtrata Wizard fee, and stop the drops grid flashing white boxes
ad39ba15 2026-07-27 stxtrata Passkey wallet: put a real origin boundary between the site and the key
ba2ca8e3 2026-07-27 stxtrata Passkey canary: GO on iPhone, and stop calling a cancelled prompt a dead device
76acdcb1 2026-07-27 stxtrata Take the legacy /workspace mint panel offline before it costs anyone else
0440b93d 2026-07-27 stxtrata Passkey wallet: prove the design on real hardware, and write it down
b2ac6127 2026-07-27 stxtrata Make the wallet playbook findable, and correct its ship checklist
41a4da82 2026-07-27 stxtrata Drops: one contract version only, and write the rule down
0f5fc5b1 2026-07-27 stxtrata Wizard: preview the player, check the deps, and say who holds the money
e29660ec 2026-07-27 stxtrata Drops: stop the grid waiting on things it does not need
0628c883 2026-07-27 stxtrata Keep-open banner: shared, and now on the main wizard too
c4403367 2026-07-27 stxtrata One cancel dialog, and a reminder for jobs left unfinished
be90bd1a 2026-07-27 stxtrata A mistyped token id no longer destroys a nearly-complete job
c0fa07cc 2026-07-26 stxtrata Runtime: read the content hash from the index, not the chain
e4571b31 2026-07-26 stxtrata Xplorer: stop bare HTML inscriptions rendering as white cards in the grid
3cb46af3 2026-07-26 stxtrata Home: stop downloading ~10 MB of music before anyone asks for it
d7c70e03 2026-07-26 stxtrata Report: the whole chain is 0.55 GB, so cache all of it permanently
8509c5e2 2026-07-26 stxtrata Bind the runtime content cache bucket that was never created
574be05b 2026-07-26 stxtrata Runtime: answer 404 when no core holds a token, and say which were searched
b4b0d03f 2026-07-26 stxtrata Create STORAGE-AND-SPEED-REPORT.md
a1b01bb2 2026-07-26 stxtrata Agent One: a parent that has arrived stays arrived
25a4c227 2026-07-26 stxtrata Wizard: four UX fixes, and stop SUNO buying a receipt nobody asked for
53b8b50c 2026-07-26 stxtrata Wizard: say the self-custody part out loud, where the doubt actually is
5461f0b0 2026-07-26 stxtrata Wizard: protect a job when the tab closes, and let the user hand it over
241c62cc 2026-07-26 stxtrata Plan: wizard resilience — failsafes and buffers, sized from measurement
4b96b7cc 2026-07-26 stxtrata Agent One: escalate the fee when a transaction is accepted but never mined
a60fc76f 2026-07-26 stxtrata Wizard: make a redeploy actually reach the browser, and fix an init-time crash
fc20bd0e 2026-07-26 stxtrata Agent One: size the miner reserve from the network floor, one model for both quotes
a6b81425 2026-07-26 stxtrata Agent One: pay the node's LOW fee estimate, not the middle one
9dc56647 2026-07-26 stxtrata Agent One: stop the escrow checklist asking for a parent it already has, and cap per-batch fees
47eff7ac 2026-07-26 stxtrata Agent One: finish the sweep for reads that lie when they fail
9354aa8b 2026-07-25 stxtrata Agent One: fix the fee and broadcast paths, and put them under the harness
289a3aa8 2026-07-25 stxtrata Agent One: fault-injection harness, and the funds-safety bug it found
8c4a6464 2026-07-25 stxtrata Agent One: gate the parent on chain state, not the lagging holdings index
e1768ade 2026-07-25 stxtrata Agent One: move off the Hiro endpoints that are throttled regardless of key
c321bf88 2026-07-25 stxtrata Agent One: a failed balance read is not an empty wallet
4d2ae471 2026-07-25 stxtrata Agent One: end the resume loop, and let a cancel rest as cancelled
03269a54 2026-07-25 stxtrata Wizard: stop the Song details overlay covering the page on every load
47eed217 2026-07-25 stxtrata Agent One: stop the refund loop that hammered the API
b00f982f 2026-07-25 stxtrata Agent One: stop a running job and get everything back
0611908b 2026-07-25 stxtrata SUNO: send the parent to the right contract, and reattach a stranded job
6129a52b 2026-07-25 stxtrata Wizard: build a player for one song; SUNO: parent and dependency links
11e278e5 2026-07-25 stxtrata Drops: choose the claiming BNS name in the page, not in a browser prompt
59560897 2026-07-25 stxtrata BNS: read the primary name from the registry, stop guessing it
56985d06 2026-07-25 stxtrata Wizard agent: survive background tabs, clear Suno resume path (build 2026-07-25.1)
40bff9d8 2026-07-25 stxtrata Wallet: stop listing the same wallet twice in the chooser
007c00c2 2026-07-25 stxtrata Inscribe: allow a parent on text inscriptions, under one Advanced panel
8c6d806d 2026-07-25 stxtrata Drops: parallelise the read phase and cache drops reads at the proxy
d69d5814 2026-07-25 stxtrata proof of free campaign cards
edb9605f 2026-07-25 stxtrata Drops: move the blocked-claim notice onto the card that was pressed
364ed9ab 2026-07-25 stxtrata Drops: tell the claimer why a claim was blocked
6fc69472 2026-07-25 stxtrata The rebuild is code-complete. 965 tests pass across all four packages, clarinet check reports zero errors, and the UI builds. [...]
ea9cad00 2026-07-25 stxtrata Retry transient upstream failures on sponsor read-only calls
b91eb7c4 2026-07-25 stxtrata Accept the attestor key in either compression form
53d36e76 2026-07-25 stxtrata Fix the hidden key prompt in check-attestor-key.mjs
b4e2b411 2026-07-25 stxtrata Add scripts/check-attestor-key.mjs to diagnose ATTESTOR_KEY_MISMATCH
4f95adaf 2026-07-25 stxtrata Drops: show a full campaign, and fix the drop-canary chain reads
6d6eabe9 2026-07-24 stxtrata Merge pull request #247 from stxtrata/main
9ca39254 2026-07-24 stxtrata Free drop edits
ab0957fe 2026-07-24 stxtrata proof of Free canary
896414f5 2026-07-24 stxtrata fix: harden debug issue diagnostics
9e87465a 2026-07-24 stxtrata Proof of Free and Drops update
49db77b8 2026-07-24 stxtrata Prepare Proof of Free deployment console
f347cfb6 2026-07-24 stxtrata Proof of Free updates
51807c38 2026-07-23 stxtrata Agent One: delivery reliability + transaction-accurate wizard progress
307f1b78 2026-07-23 stxtrata feat: add Xtrata Contract Studio leaderboard prototype
cf43901c 2026-07-23 stxtrata docs: plan safe xtrata 1.0 documentation migration
caa7c95a 2026-07-23 stxtrata fix: render PDF inscriptions in previews
4e6596b0 2026-07-23 stxtrata Harden Living Synth registry and deployment gates
68abefbb 2026-07-23 stxtrata feat: add Living Synth recording fees
c38c49e1 2026-07-23 stxtrata feat: add gated Living Synth deployment console
7ab57324 2026-07-22 stxtrata fix: use deployed BNS attestation secret name
a8abacdc 2026-07-22 stxtrata feat: wire Proof of Free campaign claims
34ffe4ae 2026-07-22 stxtrata fix: surface live telemetry activity
924bf718 2026-07-22 stxtrata feat: add claim-gated Proof of Free mosaic
48ce6bf4 2026-07-22 stxtrata feat: add privacy-safe journey telemetry
d2a1a1cd 2026-07-22 stxtrata feat: add restricted collection drop console
8dbd1ec5 2026-07-21 stxtrata feat: add campaign-aware drops v1.1
1f69ade9 2026-07-21 stxtrata fix(wallet): bridge embedded Xverse payments
9dc3e0c9 2026-07-21 stxtrata wizard wallet fixes
13f0c13a 2026-07-21 stxtrata fix(wallet): restore Xverse wizard payment provider
f8666f6a 2026-07-21 stxtrata Auto-recover Xverse stale-session network mismatch on signing requests
c178c7a7 2026-07-21 stxtrata Repair Xverse preflight (ban stx_getAccounts, add cache + timeout), add wallet playbook
deae7cb7 2026-07-21 stxtrata Fix Xverse network-mismatch on wizard pay, force account chooser on connect
f7faae86 2026-07-21 stxtrata Wallet chooser on every connect, wizard iframe provider fix, inscribe re-prepare deadlocks
4c915312 2026-07-21 stxtrata Add homepage campaign spotlight banners
6db07c4a 2026-07-21 stxtrata Fix Pages build after proofzero rename
2847205d 2026-07-21 stxtrata Proof of creation
45268ed9 2026-07-21 stxtrata Regenerate SDK changelog and example lockfiles from 0.2.0 release dry-run
9a41683a 2026-07-21 stxtrata Docs: point at published npm packages (0.2.0 live)
a061b9a1 2026-07-21 stxtrata Merge branch 'main-staging'
0a6d3f87 2026-07-21 stxtrata Machine-readable docs for LLMs: llms.txt, API JSON, capabilities, OpenAPI
c4ca5c4f 2026-07-21 stxtrata Copy proofzero into dist so /proofzero/ deploys
fa8d0ae0 2026-07-21 stxtrata proofzero
15c242a9 2026-07-21 stxtrata proof zero
0510fddc 2026-07-21 stxtrata proof zero - proof of create
deaab878 2026-07-21 stxtrata new index landing page for bounty
97737e28 2026-07-21 stxtrata updated landing page for bounty
6e977bc3 2026-07-21 stxtrata index update for ZeroDAO bounty
f782c59f 2026-07-21 stxtrata Ignore _to_delete/ recycle folder
cd6c4da1 2026-07-21 stxtrata SDK 0.2.0: sponsor + payments modules, publish metadata, transfer/query skills
f5ac5bbf 2026-07-21 stxtrata Port SDK docs into 2.0; sdk:docs:validate now passes
7b22f130 2026-07-21 stxtrata Embed Inscription Wizard in site shell at /create-wizard
1e314151 2026-07-18 stxtrata Send bounty creation links to Create
e60684c1 2026-07-18 stxtrata Make bounty prizes an equal split
5de9d358 2026-07-17 stxtrata first masterpiece updates
1a4a1265 2026-07-17 stxtrata Route complex create uploads to wizard
3f341e65 2026-07-17 stxtrata Match first masterpiece page to dark Xtrata theme
26799758 2026-07-17 stxtrata Add Xtrata first masterpiece campaign page
0d0e0d00 2026-07-17 stxtrata Add Xtrata first masterpiece campaign page
fbe7bf5b 2026-07-17 stxtrata chore(arcade): fill v5 pacer parent with minted leaves 2803/2804
390d1a87 2026-07-17 stxtrata fix(arcade): pace requestAnimationFrame to 60fps in the v5 parent
fe168183 2026-07-17 stxtrata New astro blaster parent inscription with new modukes and duels demo update
8d38f67b 2026-07-17 stxtrata fix(arcade): v5.2 — lead every wallet with the combined-contract call form
ee122101 2026-07-17 stxtrata fix(arcade): v5.1 — shared wallet session, correct request() call form, sandbox-safe storage
016e43e0 2026-07-17 stxtrata feat(arcade): v5 mobile parent — floating joystick controls and confirm-guarded restart
0832f90c 2026-07-17 stxtrata fix(arcade): dedupe deprecated provider aliases and gate legacy stacks-connect auth
f9ef4f08 2026-07-17 stxtrata chore(arcade): fill v4-mobile parent with leaf ids 2797/2798 and refresh manifest hashes
03b8c7ac 2026-07-17 stxtrata fix(wallet): prefer silent wallet_getAccount over prompting stx_getAccounts in Xverse preflight
b559db1c 2026-07-17 stxtrata feat(canary): v0.2.0 — getInfo probe and account/network change event watchers
5bc854a7 2026-07-17 stxtrata fix(arcade): use bundling CDN endpoints for the stacks-connect fallback import
88add0a1 2026-07-17 stxtrata fix(wallet): pin host Xverse contract calls to canary-proven spec param shape
5ff372cf 2026-07-17 stxtrata fix(arcade): carry sender stxAddress in legacy transactionRequest payloads
f96288d8 2026-07-17 stxtrata fix(arcade): stop Leather popup loop from passive wallet status polling
4ff95952 2026-07-17 stxtrata fix(canary): v0.1.1 — readable provider error objects, dedupe arguments log, Leather legacy note
d7a733dd 2026-07-17 stxtrata feat(canary): add Xtrata Wallet Canary diagnostic app
a7b677ef 2026-07-17 stxtrata fix(wallet): add Xverse sender aliases and signing watchdog diagnostics
fdf9ffcd 2026-07-17 stxtrata fix(wallet): send spec-only stx_callContract params and verify Xverse account before signing
2f56d26f 2026-07-17 stxtrata game updates
981f76bf 2026-07-17 stxtrata fix(wallet): keep Xverse score calls on connected provider
a2ca9c58 2026-07-17 stxtrata feat(arcade): add Astro Blaster mobile parent controls
488d5e08 2026-07-16 stxtrata Astro game updates
451253ed 2026-07-16 stxtrata new astro blaster updates
07365316 2026-07-16 stxtrata Add toggleable drop claim policies
4ea8dc56 2026-07-15 stxtrata feat(wallet): add BNS transfers and improve claim diagnostics [...]
21c986b2 2026-07-15 stxtrata version numbers added
f0e4e13c 2026-07-15 stxtrata mplemented the duplicate-claim protection and clearer progress guidance. [...]
13f9847f 2026-07-15 stxtrata listings
bee1ff82 2026-07-15 stxtrata Wallet fixes imported from main-staging-fable to fix issues with batch inscription processing.
ecbf93d3 2026-07-15 stxtrata Add event-backed drops history and collection lock
77fd9fa4 2026-07-15 stxtrata Refresh drops actions on wallet changes
f8cfb4d2 2026-07-15 stxtrata Show full active drops set
e92cb5c0 2026-07-15 stxtrata Enforce one claim per drops campaign group
9ee5126c 2026-07-15 stxtrata Add expandable drops claim history
446e7fa8 2026-07-15 stxtrata Sync drop creation token to URL
014ab67b 2026-07-15 stxtrata Retry transient sponsored claim relayer submits
12cc3382 2026-07-15 stxtrata Centralize wallet sessions and transaction routing
b54cf12c 2026-07-15 stxtrata This round of logs changed the diagnosis. wallet_getAccount isn't hung — it's just slow [...]
f63038c8 2026-07-15 stxtrata Fixed. Your log showed the exact culprit: Xverse's wallet_getAccount answered the first read [...]
ee932f9b 2026-07-15 stxtrata Wizard activity log
704dae67 2026-07-15 stxtrata rename button
8ef39960 2026-07-15 stxtrata Diagnosed and fixed. GPT's premise was backwards, which is why every attempt failed. [...]
e4ff6eb2 2026-07-15 stxtrata Bind Wizard payments to active Xverse account
c01bae1b 2026-07-15 stxtrata Reset Xverse session before wizard payment
8e8bd3de 2026-07-15 stxtrata Unblock Xverse wizard payment popup
8b634836 2026-07-15 stxtrata Fix wizard Xverse payment network preflight
f5184827 2026-07-14 stxtrata Fix Xverse wizard mainnet payment sessions
f8281f84 2026-07-14 stxtrata Harden Agent One deposit recovery polling
e32507d6 2026-07-14 stxtrata Wizard updates
074074b6 2026-07-14 stxtrata Fix Xverse Agent One payment handoff
e57621ea 2026-07-14 stxtrata Document Agent One ownership recovery fix
94e5e326 2026-07-14 stxtrata Improve ownership refresh and cache bypass for recovery flows
205c6b57 2026-07-14 stxtrata Add browser-native Agent One recovery
dc566e29 2026-07-14 stxtrata hove rtext
d44fe30e 2026-07-14 stxtrata Add My Xtrata free drop shortcut
207abc29 2026-07-14 stxtrata Add premerge smoke gate and repair market feed
593bb409 2026-07-14 stxtrata Recover transiently dropped sponsor claims
4b57bf41 2026-07-14 stxtrata Recover failed sponsor broadcasts
a431c289 2026-07-14 stxtrata Refresh drops after creation confirms
566bab0f 2026-07-14 stxtrata Keep market routes inside SPA
5f836b20 2026-07-14 stxtrata Update claimed state during settlement
881352c0 2026-07-14 stxtrata Cap transient free-claim fee spikes
c134b703 2026-07-14 stxtrata Repair sponsor balance Hiro headers
3ecbee72 2026-07-14 stxtrata Reduce off-page browser warnings
0f3293e7 2026-07-14 stxtrata Expose sponsored relayer failure stages
c75f949d 2026-07-14 stxtrata Repair ESLint source gate
d3f92cbc 2026-07-14 stxtrata Route sponsored claims through wallet RPC APIs
e7371d9f 2026-07-14 stxtrata Fix sponsored claim wallet signing
2f1aae9b 2026-07-14 stxtrata Harden free sponsored claims
4d6c9d99 2026-07-14 stxtrata fix(wallet): restore Xverse connection flow
ae4c47a1 2026-07-14 stxtrata fix(sponsor): expose actionable relayer failures
df16459a 2026-07-14 stxtrata fix(wallet): normalize sponsored claims across wallets
b8990d55 2026-07-14 stxtrata Fix sponsored drop claims: sign without broadcasting
2cdfd4ba 2026-07-14 stxtrata fix(home): keep hero and drop actions current
33da0847 2026-07-14 stxtrata refine(home): unify wizard and payment copy
faf0f3c2 2026-07-14 stxtrata fix(home): count featured stories correctly
fbfda0cc 2026-07-13 stxtrata feat(home): restore active campaign banners
3e78e667 2026-07-13 stxtrata fix: scope migration quote to direct holdings
f8bb083d 2026-07-13 stxtrata feat(home): keep wizard inside site shell
029a9190 2026-07-13 stxtrata Add quote-first migration rollout
e8862da1 2026-07-13 stxtrata Redesign homepage around living objects
5c471195 2026-07-13 stxtrata Persist market listing thumbnails
7a4504e1 2026-07-13 stxtrata Hide non-buyable legacy market listings
fed10181 2026-07-13 stxtrata Show previews for escrowed wallet listings
5ce291c4 2026-07-12 stxtrata Show seller controls on own market listings
c5c7b9db 2026-07-12 stxtrata Keep escrowed market listings in seller wallets
ba5875eb 2026-07-12 stxtrata usd prices listings
578437f2 2026-07-12 stxtrata Fix Forever Twin liquid-side resolution
c0280f15 2026-07-12 stxtrata Merge pull request #221 from stxtrata/main-staging-fab-opt
5f6aa05d 2026-07-12 stxtrata Block xtrata-market-v1-0 purchases in the workspace market too [...]
4f7a1abb 2026-07-12 stxtrata Merge branch 'main-staging-fable' into main-staging-fab-opt
889d84a5 2026-07-12 stxtrata Restore text inscription previews lost in the branch switch [...]
5ab6565b 2026-07-12 stxtrata Mirror production bindings into Pages preview deployments [...]
f16d1e93 2026-07-12 stxtrata Harden the sponsor relayer and fix wallet post-condition warnings [...]
892f84ad 2026-07-12 stxtrata Delist the broken xtrata-market-v1-0 from sale [...]
9d088a7b 2026-07-12 stxtrata view drops correctly
23ed4475 2026-07-12 stxtrata Document sponsor relayer fixes for Fable 5
ef56ff08 2026-07-11 stxtrata Fix /drops (and /market) direct navigation [...]
d788b43a 2026-07-11 stxtrata Fix market showing empty when the listings cache degrades [...]
d0a61fd2 2026-07-11 stxtrata Fix market showing empty when the listings cache degrades [...]
53de7ef2 2026-07-11 stxtrata deploy console
5b9a9071 2026-07-11 stxtrata Add Drops: sponsored free claims as a named product [...]
```

**Two further duplicated-subject pairs appear here**, beyond the three recorded in the main report's §7.6, both on a single day each: `26799758` / `0d0e0d00` ("Add Xtrata first masterpiece campaign page", 2026-07-17) and `d788b43a` / `d0a61fd2` ("Fix market showing empty when the listings cache degrades", 2026-07-11, with identical multi-paragraph bodies). That makes **five** same-subject pairs in three weeks — a pattern rather than three accidents. Pass 3 should check whether any pair applied a non-idempotent change twice.

---

## Appendix B — full remote branch inventory

```
$ git for-each-ref --sort=-committerdate \
    --format='%(committerdate:short) %(refname:short) %(ahead-behind:origin/main-staging)' \
    refs/remotes/origin
```

Two trailing numbers are `ahead behind` **relative to `origin/main-staging`**. 111 branches.

```
2026-07-31 origin/main-staging                                0    0
2026-07-29 origin/main                                        6   24
2026-07-25 origin/ms-rebuild                                  1  138
2026-07-23 origin/main-staging-fixes                          0  165
2026-07-16 origin/main-staging-astro                          0  262
2026-07-15 origin/main-staging-wal-fix                        5  265
2026-07-15 origin/main-staging-gate-opt                      13  275
2026-07-15 origin/main-staging-gate                          12  275
2026-07-14 origin/main-staging-sol                            0  283
2026-07-14 origin/main-staging-sol-2                          0  285
2026-07-14 origin/main-staging-sol-wiz                       10  298
2026-07-12 origin/main-staging-fable                          0  304
2026-07-12 origin/main-staging-fab-opt                        0  310
2026-07-09 origin/main-staging-terra                          0  350
2026-07-08 origin/main-staging-wizard                         0  364
2026-07-08 origin/main-text-deps2                             0  365
2026-07-08 origin/main-text-deps                              2  366
2026-07-08 origin/main-staging-1.2                            0  371
2026-07-07 origin/main-text-thread                            0  379
2026-07-07 origin/main-text-insc                              0  382
2026-07-05 origin/new-layout                                  0  392
2026-07-05 origin/new-layout-2                                0  393
2026-07-05 origin/new-layout-batch                            0  399
2026-07-04 origin/main-agent1                                 0  421
2026-07-02 origin/main-f5-optim                               0  490
2026-07-01 origin/main-XA1                                    0  485
2026-06-19 origin/xplorer-filters                             0  584
2026-06-16 origin/switch-to-core                              0  626
2026-06-16 origin/opus-image-comp                             0  648
2026-06-16 origin/opus                                        0  657
2026-06-13 origin/main-staging-fix                            0  720
2026-06-11 origin/rescue-contract-app-review                  0  725
2026-06-11 origin/rescue-current-mess                         1  891
2026-06-11 origin/add-parents                                 0  727
2026-06-10 origin/caching                                     0  752
2026-06-09 origin/standards                                   0  765
2026-06-05 origin/x-board                                     0  807
2026-06-03 origin/staging-grid-fix                            0  837
2026-05-31 origin/main-staging-optim                          0  860
2026-05-31 origin/main-staging-optim-2                        0  862
2026-05-29 origin/opus-updates                                6  879
2026-05-28 origin/txn-issues                                  0  889
2026-05-26 origin/optimise-runtime                            0  911
2026-05-26 origin/contract-cleaning                           0  891
2026-05-26 origin/opus-only                                   0  908
2026-05-26 origin/Opus-File_generator_ONLY                    0  912
2026-05-24 origin/mobile-view                                 0  920
2026-05-23 origin/fee-estimator-updates                       0  928
2026-05-22 origin/Galleries                                   1  929
2026-05-22 origin/bns-test                                    0  934
2026-05-22 origin/bns-test-2                                  0  935
2026-05-22 origin/main-staging-3                              0  937
2026-05-22 origin/style-updates                               0  939
2026-05-22 origin/Xtrata-Backup-Migration-Service             0  948
2026-05-22 origin/main-staging-2                              0  948
2026-05-18 origin/new-xtrata-homepage                         0  974
2026-05-18 origin/narrate-AI                                  0  983
2026-04-22 origin/agent-27-staging                           17 1057
2026-04-17 origin/BVST-Fix                                    0  994
2026-04-13 origin/social-auto                                11 1022
2026-04-12 origin/meta-col                                    0  996
2026-04-12 origin/html-loader                                 0 1000
2026-04-10 origin/agent-27                                    8 1113
2026-04-01 origin/animate                                     2 1022
2026-04-01 origin/live-disp                                   2 1022
2026-04-01 origin/live-mint-disp                              2 1032
2026-03-31 origin/v3-contract                                 5 1033
2026-03-29 origin/nearest-n                                   0 1034
2026-03-29 origin/staging-clarity                             1 1037
2026-03-27 origin/runtime-v3                                 28 1037
2026-03-27 origin/new-runtime                                27 1037
2026-03-27 origin/runtime-v2                                 24 1037
2026-03-25 origin/caching-update                              0 1038
2026-03-24 origin/lab                                         0 1041
2026-03-24 origin/staging                                     0 1044
2026-03-24 origin/hero-coll-image                             0 1049
2026-03-20 origin/dependency                                  0 1062
2026-03-19 origin/codex/pricing-staging-integration           3 1084
2026-03-19 origin/free-mint-advprice                          0 1069
2026-03-19 origin/free-mint-mode                              0 1076
2026-03-19 origin/free-mint                                   0 1077
2026-03-19 origin/pricing-oracle                              2 1078
2026-03-19 origin/manageportal                                0 1079
2026-03-19 origin/bnsnames                                    0 1081
2026-03-18 origin/inscribe-button                             1 1083
2026-03-17 origin/edit-staged-collection                      0 1085
2026-03-17 origin/fx-update-RR                                0 1086
2026-03-17 origin/mint-preview-and-address/stacks-explorer-links  0 1087
2026-03-16 origin/leather-wallet-fix                          0 1096
2026-03-15 origin/recursive-app-plans                         0 1101
2026-03-13 origin/leather-warning-messages                    0 1104
2026-03-13 origin/hackathon-demo                              3 1113
2026-03-09 origin/staging-usdc-sbtc-contracts                 0 1113
2026-03-07 origin/creator-portal                              0 1134
2026-03-07 origin/inscription-cover-images                    0 1141
2026-03-06 origin/small-mint-contract-implementation          0 1151
2026-03-04 origin/siblings-mint-order                         0 1167
2026-03-04 origin/banner-on-mint-page                         2 1182
2026-03-04 origin/New-Homepage-Designs                        0 1182
2026-03-04 origin/fees-into-mint-price                        0 1195
2026-03-01 origin/collection-mint-setup-flow-highlights       0 1208
2026-02-28 origin/collection-mint-setup-flow                  0 1215
2026-02-28 origin/OPTIMISATIONS                               0 1234
2026-02-23 origin/http-fullscreen-app                         2 1278
2026-02-17 origin/SDKs                                        0 1340
2026-02-16 origin/Collection-Mint-Page                        0 1368
2026-02-15 origin/batch-resume-fixed                          0 1416
2026-02-11 origin/artist-manage-portal                        0 1458
2026-02-09 origin/parent-child                                0 1466
2026-02-08 origin/v2-1-0                                      0 1481
```

Nine branches carry commits that are ancestors of neither `main` nor `main-staging` and predate 2026-05-01: `runtime-v3` (28), `new-runtime` (27), `runtime-v2` (24), `agent-27-staging` (17), `social-auto` (11), `agent-27` (8), `v3-contract` (5), `hackathon-demo` (3), `codex/pricing-staging-integration` (3). None touch `xtrata-2.0/` — the subtree post-dates them — so they are out of scope and listed only for completeness.
