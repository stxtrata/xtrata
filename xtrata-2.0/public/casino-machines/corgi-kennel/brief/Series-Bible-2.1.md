# ParallaX Machine Series: Series Bible 2.1

Nov 3, 2026 · @Jim

## 1. The model in one page

Every bet feeds one casino-wide jackpot that anyone can win, and one fund for the machine it was played on that pays holders of Xtrata inscriptions.

1. **Casino Jackpot.** One set of meters shared by every machine. The jackpot result on any machine pays the player who hit it, with no conditions.
2. **Machine Fund.** A smaller fund on each machine, paid from the house's share to people who hold Xtrata twins or inscriptions.
3. **Equal terms.** Every player returns 94.38% whatever they hold. Holder rewards are the house sharing its margin, never a cut of anyone's winnings.
4. **Xtrata only.** Funds pay holders of Xtrata inscriptions and nothing else. Machines themed on Ordinals, Runes, sats or tokens keep the theme as art and pay the floor-wide twin pool.
5. **Pull, not push.** Holders claim their share, so payouts never wait on a server.
6. **One shared engine.** Block Fortune v3 moves the jackpot meter into a shared Casino Service now and into contracts later (section 9). Reels, pay tables and bonus maths do not change.
7. **Fewer streams.** Casino Jackpot, Machine Fund, Cameo royalty and Forever Fund. Holder spins and the Collection Cup stay parked.

| What | Paid to | Source |
| --- | --- | --- |
| Line wins, scatters, free spins, pick bonus, hold and respin, gamble | Whoever plays | Player return, 91.98% of each bet |
| Casino Jackpot | Whoever lands the jackpot result on any machine | 2.4% of each bet, inside the 94.38% |
| Machine Fund | Holders of Xtrata twins or inscriptions, each period | 1.0% of each bet, from the house edge |
| Cameo royalty | The holder of a twin shown on a winning line | About 0.6%, from the house edge |
| Forever Fund | Whoever inscribes a new twin (refunds the fee) | About 0.3%, from the house edge |

## 2. Where each bet goes

Of every 100 LAYR bet, 96.28 goes back out to players and funds, and the house keeps about 3.72. The player return of 94.38% from v1 is unchanged; nothing changes for any player.

| Share of each paid bet | Goes to | Paid to |
| --- | --- | --- |
| 91.98% | Base game and bonuses (lines, scatters, free spins, pick, hold and respin) | Any player |
| 2.4% | Casino Jackpot: 2.0% into the meter, about 0.4% is the seed the house refills after each hit | Any player who hits it |
| 1.0% | Machine Fund of the machine played, taken from the house edge | Holders of Xtrata twins and inscriptions, each period |
| 0.6% | Cameo royalty: 1% of a winning line's pay, to the holder of the twin shown | Twin holder |
| 0.3% | Forever Fund | New twin inscribers |
| about 3.72% | House |  |

The house share was about 3.2% in v1 because holder spins (0.3%) and the Collection Cup (0.2%) were also funded. Parking them lifts it to about 3.7%. Cameo and Forever Fund sizes are v1's estimates and are tuned once real play data exists.

## 3. The Casino Jackpot

The Casino Jackpot is five meters, one per bet level, and every machine pays into the meter for the bet level being played.

| Bet level (LAYR) | 20 | 40 | 100 | 200 | 500 |
| --- | --- | --- | --- | --- | --- |
| Seed after each hit (500× bet) | 10,000 | 20,000 | 50,000 | 100,000 | 250,000 |

- **Fills from:** 2% of every paid bet on any machine, into the meter for that bet level. Free spins, Bonus Lab runs and gamble stakes add nothing.
- **Pays on:** the same result as today: five top symbols on the centre row (wilds don't count) or a full hold-and-respin grid. Odds stay about 1 in 113,000 spins on each machine.
- **Pays to:** whoever's spin hit, the full meter at that moment. The meter then resets to its seed. No holding or wallet condition applies.
- **Two hits at once:** the first to arrive takes the meter; the second finds the freshly reset seed.
- **Shown everywhere:** the topper of every machine shows the meter for the player's bet level, and a Casino Jackpot sign in the room shows all five.
- **Each machine keeps its own jackpot name** (Block Reward, Total Crash, Heist of the Century) and its own celebration, but the amount and the label CASINO JACKPOT are shared.
- **Bonus Lab:** Lab jackpots use a separate lab meter and never touch the real one.

The average jackpot stays about 2,760× the bet, as in v1. With 30 machines feeding one meter it is hit somewhere on the floor far more often and grows faster in real time, which is the point of pooling it.

## 4. Machine Funds

Each machine's fund is 1% of that machine's paid bets, taken from the house edge and shared out every period to holders of Xtrata twins or inscriptions, who claim it. It replaces v1's Holder Pot.

A share is always one Xtrata inscription, and every machine uses one of four fund types.

| Type | What earns shares | Machines |
| --- | --- | --- |
| **T, Twin fund** | One share per Forever Twin of the machine's own collection or collections | 2, 3, 6, 7, 8, 9, 12, 16, 17, 18 |
| **W, Floor-wide fund** | One share per Forever Twin in any live collection | 1, 5, 10, 11, 13, 15, 19, 20, 21, 22, 23, 24, 25 |
| **X, Xtrata-native fund** | One share per inscription from a named set (Audionauts and other inscribed originals) | 14 |
| **F, Forever Fund machine** | No shares: the fund refunds the inscription fee of new twins | 4 |

Machines 18 (half T, half F) and 25 (half W, half F) split their fund.

**Machines with an outside theme.** Machines about Ordinals, Runes, sats, memecoins and DeFi tokens (1, 13, 19, 21, 22, 23, 24) keep their theme as art only and pay the floor-wide fund. There is no Bitcoin address linking, no token threshold and no payout to holders of outside assets.

**Periods.** Weekly by default (Monday 00:00 UTC). Machine 10 uses one Stacks stacking cycle (2,100 Bitcoin blocks), machine 15 one difficulty epoch (2,016 blocks) and machine 20 every 144 blocks. The snapshot block is public.

**Special splits.** Machine 9 splits 60/40 between the leading and trailing city. Machine 17 sends 10% of each payout to the cause Chemical X chooses. Machine 11 pays its whole fund to one twin per period, drawn from the snapshot block's hash so anyone can check it.

**Claims.** Nothing is pushed. Each period's fund is divided by the number of twins counted from the collection helpers, and the holder of each twin claims its share. Unclaimed shares roll into the next period.

**On the topper.** Fund balance, period end, and last period's pay per twin (for example "LAST CYCLE: 412 LAYR PER TWIN").

**Cameo royalty and the Forever Fund** keep their v1 rules. Machines with no twin art on their reels (1, 10, 11, 13, 15, 19, 20, 21, 22, 23, 24, 25) record no cameos.

Payouts stay display-only on testnet, as in v1. Real payouts arrive with the on-chain design (section 9).

## 5. Who earns from a fund

A wallet earns from a fund by holding a Xtrata twin or inscription that counts for it; nothing is required to play, win or hit the jackpot.

- **What counts:** a sealed inscription on the Xtrata core contract (`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`). For a type T fund that means a twin of the machine's collection, for type W any twin, for type X an inscription from the named set.
- **Held for the whole period:** the wallet must hold it at the period's first block and at its snapshot block, so moving one twin between wallets mid-period earns nothing twice.
- **Shares count inscriptions, not wallets,** so splitting holdings across wallets gains nothing.
- **Unknown is not zero.** A failed read shows "checking" and never counts as no twins, as Forever Twins already does.
- **Not a gate.** A player with or without a twin plays, wins and hits the jackpot on equal terms.

## 6. What players without a twin see

Nobody loses a win, so there are no missed-win messages. Players without a twin see what holders earn and where to start, and nothing more.

| Where | Who sees it | What it says |
| --- | --- | --- |
| Topper of every machine | Everyone | "LAST CYCLE: 412 LAYR PER TWIN" and the fund balance |
| Fund panel, opened from the topper | Everyone | Three lines on how the fund works, and a link to Xtrata to inscribe or twin |
| Win message when a twin sits on the line | Everyone | "Monkey #378 on your line earned its holder 4 LAYR" |
| Account panel | A connected wallet holding no twin | "Holders earned X LAYR across the floor last period. One twin would have earned Y." |

Rules for every message:

- Figures come from a closed period or a committed result, never an estimate.
- Plain information in the machine's normal type: no countdown, no expiring offer, no flashing, and never worded as a lost win or a prize.
- Shown where the player looks for it, never as a full-screen interruption.
- Respects reduced motion.
- Bonus Lab gets a "Fund info" item, and the test panel keeps the twins switch (none, some, all).

## 7. Maths and fair play

Nothing about a player's return changes: every player gets the 94.38% design return, whatever they hold. The reels, strips, pay tables and bonus maths are untouched, so v1's exact model over all 33,554,432 reel positions still holds.

Section 2 has the split: 91.98% base game and bonuses plus 2.4% jackpot is the 94.38% every player receives, and holder rewards come out of the house's 5.62% edge. Pooling the jackpot across machines changes only who shares the meter. The average jackpot stays about 2,760× the bet and the odds stay about 1 in 113,000 spins per machine.

**Fair Play panel, new lines on every machine:**

- "The Casino Jackpot meter is shared by all machines and pays whoever hits it."
- "Holder rewards are paid by the house and do not reduce any player's return."
- The 94.38% stays labelled a design estimate, not certified.

**New tests, on top of v1's.**

1. A 5,000,000-spin seeded run on v3: base return matches v2 within ±0.3%.
2. Meter conservation: contributions plus seeds equal payouts plus the change in the meter, over a simulated floor of several machines.
3. Two machines hitting at once, in both orders.
4. Fund maths: claims never exceed the fund balance, unclaimed shares roll forward, and a failed twin read never counts as zero twins.

## 8. One shared engine

Block Fortune v3 keeps v2's maths byte for byte and moves the jackpot meters and the fund bookkeeping out of every machine into one Casino Service.

&#91;embedded content: architecture · pack, Casino Service, Xtrata reads\]

Every pack sends bets and hits to the one service and gets the meters back; the service reads Xtrata and the twin helpers, and the room's UI reads the service.

| Piece | Lives in | What it does | Differs per machine? |
| --- | --- | --- | --- |
| Block Fortune v3 core | Every machine pack, one hash for all 30 | v2 reels, bonuses and pay tables unchanged. The jackpot meter becomes a call to the Casino Service, and each result records `jackpot` (level, hit) before any animation | No |
| Casino Service | One shared service, outside every pack | Jackpot ledger (five meters, contributions, hit settlement, arrival order); Fund ledger (1% accrual, periods, share maths); holder reader (twin counts and owners from the Forever Twins helpers) | No |
| Fund config | One small JSON per machine | Fund type (T, W, X or F), collections, period, split rules | Yes |
| Casino Kit UI | Shared script in the room | Casino Jackpot sign, topper line, Fund panel, new Lab items | No |
| Machine skin | Per machine | Art, cabinet, bonus scenes, names, jackpot title | Yes |

**Why a service.** Today every spin runs in the player's browser and LAYR balances are stored there, and a meter shared by many players cannot live in a browser. The service is the stepping stone: a small server on testnet with play money now, replaced by the contracts and sessions in section 9 before any real STX.

**What must not break.** The room patches each pack's game HTML by exact text (the LAYR account block, the `GAME_ID` line, the screen canvas line, `connect(ac.destination)` and `PX_CASINO_ENGINE`). v3 keeps every one of those anchors. The "result fixed first, art chosen after" rule from v1 is unchanged.

## 9. On-chain design

Keep spins instant and off-chain inside a session, and put the money, the jackpot and the fund claims on-chain. At 1 STX = 100,000 LAYR a 20 LAYR bet is 0.0002 STX, so a transaction fee per spin would likely cost more than the bet.

| Piece | Where | What it does |
| --- | --- | --- |
| Player wallet | One per player | A passkey-controlled smart-contract wallet (Face ID or Touch ID, the same wallet on laptop and phone). It grants a session key with a spend cap, an expiry and the casino contracts only, so spins sign silently |
| Bankroll contract | One each | STX is the bankroll, with sBTC added later. LAYR is the credit unit (1 STX = 100,000 LAYR). Players deposit into the bankroll contract and cash out from it |
| Casino Jackpot contract | One address | Holds the five meters, receives 2% of settled bets, verifies hit proofs and pays the winner |
| Machine Fund contracts | One address per machine | Each machine has its own address; 1% of its settled bets accrues there and holders claim per twin |
| Dealer and keeper | The Casino Service, off-chain and small | Plays the casino side of each session, settles sessions and pays fees through sponsored transactions. It holds no funds and cannot change a result |

**One session.**

1. The player deposits LAYR and opens a session; the wallet hands the browser a session key.
2. Each spin is instant. The dealer has committed to a hash chain of seeds, the player adds a client seed, and the result is the hash of both plus the spin number, turned into reel stops by the same engine as today. Both sides sign the spin record.
3. Every N spins, or on cash-out, the session settles on-chain in one transaction: the net balance moves, 2% of settled bets goes to the jackpot contract and 1% to the machine's fund contract.
4. On a jackpot result the player's wallet submits the signed spin record. The jackpot contract rebuilds the five reel stops from the hash, checks the centre row against the strips and pays the meter. Only this check runs on-chain.
5. Each period the fund contract reads the twin count from the collection's helper, and each twin's holder claims fund ÷ twins. Unclaimed shares roll forward. No snapshot service and no loops.

**Why a server is still there.** A contract cannot run itself: every state change needs someone's transaction. The rule is that whoever benefits sends it (the player settles, the holder claims) and the keeper covers the rest, settling abandoned sessions and paying fees. Stacks supports [sponsored transactions](https://docs.stacks.co/cookbook/stacks.js/transaction-building/create-a-sponsored-tx) natively, where a user signs and another party pays the fee, but that needs a backend as sponsor, with rate limits and caps against abuse. The keeper has no power over results or funds.

**Fairness.** The dealer commits to its seeds before the player adds theirs, so it cannot change a result afterwards. If the dealer disappears, the player can withdraw their last settled balance after a timeout. The contracts need an independent review before mainnet.

**Passkeys.** Clarity 4 added `secp256r1-verify`, and a [Stacks forum post](https://forum.stacks.org/t/clarity-webauthn-passkey-verification-library-for-clarity-5-follow-up/18590) says a double-hash bug in it is fixed in Clarity 5 and that a passkey library and a reference smart wallet are live on mainnet, with gas-station support so users need no STX. Treat that as a lead to test on testnet, not a given. A [separate forum thread](https://forum.stacks.org/t/sip-clarification-of-claritys-secp256r1-verify-behavior/18564) documents the Clarity 4 behaviour discrepancy.

**Later option.** A top-bet tier that settles every spin on-chain using the Stacks VRF seed of a later block. It is fully trustless, but costs two transactions and a wait per spin, and has a theoretical miner-influence concern on very large prizes. See [the Stacks VRF analysis](https://forum.stacks.org/t/analysing-the-randomness-provided-by-stacks-vrf-within-a-smart-contract/17609) and [why secure randomness needs two steps](https://pyth.network/blog/secure-random-numbers-for-blockchains).

Sources are search results, not read in full; as of 3 November 2026.

## 10. Machine standard

I went through the 22 built machines (test pages, packed games and check scripts) and their build notes. 22 of the 25 machines are built; only 21 to 23 are still prompts. They were built in generations, so the same feature exists in up to four forms. This section fixes the best form of each as the standard, so v3 and every later machine only moves forward.

**1. Screen view: keep exactly this**

The standard is the one Mooneeb and DOG Army use:

- The whole game screen fills the window, with the deck's physical buttons just beneath it and nothing of the cabinet below them. The controls strip is dark so no cabinet shows under it.
- The camera is straight on at a pitch of 0.16, slightly above. A lower angle shows the underside of the marquee over the top of the screen.
- It is solved numerically (40-step bisection) at the start and on every resize: the top of the screen sits 10 px under the top bar, the front bottom edge of the deck sits on the top of the controls strip, and the sides keep a 4% margin.
- The deck is every `pxMachineAction` mesh plus `spinPhysical`; the lever is left out.
- A bezel or lintel above the glass gets an allowance (0.45 for Club X, 0.3 for The Halving, in model units).

Where the 22 stand today:

| Method | Machines | Result |
| --- | --- | --- |
| Solved from the model: screen plus deck | Mooneeb, DOG Army, Club X, The Halving, The Stack, Sat Hunter | Fits any window |
| Solved, screen only | Genesis 21, Plebs & Legends | The deck can fall outside the view |
| Fixed margins round a box | Robot Factory, Degen City, Hot Wallet, Mempool Madness, Ordinal Rush, Rare Pepe Directory, Rugged, Rune Pit | Sizes to the screen, but odd window shapes can crop it |
| Fixed preset | Snow Crash, Nine Lives, Monkey Hash, Who Is Satoshi?, Xtrata Originals | Does not adapt at all |
| Not compared | The Archive | Uses its own host page |

Each machine's check script only takes a screenshot of the screen view; nothing asserts it. The new test is pass or fail at five window sizes (1440×900, 1366×768, 1024×768, 390×844 and 844×390): the top of the screen is below the top bar, every deck button is inside the window and above the controls strip, and clicking each deck button in screen view fires its action.

**2. Physical buttons and lever: keep**

- Each deck cap sinks along the deck's own z axis on a spring, and its label moves with it (DOG Army). Club X's push bar dips while held and springs back, and Robot Factory presses its own press meshes.
- The lever is pulled by a hand: it eases down, rests on the bottom stop, springs back and bounces once off the top stop (`leverCurve` in DOG Army).
- DOG Army and Mooneeb return the lever's timing from `mechanics()`, and DOG Army, Mooneeb, The Halving and The Stack return `buttons`. I found no `buttons` in the other 18, so there the cap motion lives only on the test page and the caps will not move in the room. The standard is that every game returns both, and the Kit holds the spring and the lever curve once.
- The deck check from the newer scripts stays for all: bet up goes 100 to 200 and back, the labels read the machine's own names in order, and the spin cap starts a spin.

**3. Bonus testing: one tool everywhere**

| Form | Machines |
| --- | --- |
| Bonus Lab behind a test flag: 12 to 13 items, seeded or random, replay, Run all, separate lab balance | Club X, Degen City, DOG Army, Hot Wallet, Mempool Madness, Monkey Hash, Mooneeb, Rare Pepe Directory, Robot Factory, Rugged, Rune Pit, Sat Hunter, The Halving, The Stack, Who Is Satoshi?, Xtrata Originals |
| Bonus preview with no flag: practice chips, a pristine copy of the engine, opened from Pays or the fullscreen TEST button | The Archive, Plebs & Legends |
| Older in-game lab, no Replay or Run all | Snow Crash, Nine Lives |
| No in-game tool found | Ordinal Rush (test-page trigger buttons only), Genesis 21 (test build flag) |

Your rule is that any bonus can be played in production, and only the Bonus preview meets it. The standard is one Kit module with the preview's safety and the Lab's features:

- Practice chips and a separate game state; the real state is set aside and put back on exit, and saving is switched off meanwhile.
- A pristine copy of the engine (`PX_PURE`), so preview rounds never reach the round log, the jackpot meter, the fund or spectators.
- Forcing is refused outside the preview, and nothing is exposed on `window`.
- A strip across the screen reads BONUS PREVIEW · PRACTICE CHIPS, NOT REAL LAYR.
- Leaving the machine or reconnecting ends it; seeded and random runs, Replay and Run all stay.
- One test flag instead of 12 (the room sets none in production), and one way in for the room, `action('lab')`, instead of the six routes it tries today.

**4. Fullscreen: one API**

The room's own notes show three kinds: `fullscreenHost` (8 machines: Ordinal Rush, Robot Factory, Degen City, Rare Pepe Directory, Rune Pit, Rugged, Mempool Madness, Hot Wallet), `fullscreen.enter` and `exit` (11) and `fullscreen(on)` (Genesis 21, Mooneeb, DOG Army). The standard is `fullscreenHost`: the room owns the frame, which avoids the problem The Archive found, that the rest of the page cannot be clicked while a hidden frame is truly full screen. Hot Wallet is the reference for it (the game side and the room side are in Appendix A.6); DOG Army still uses the older `fullscreen(on)` alone and gets `fullscreenHost` added. Everything the newer builds learned stays: the bottom bar holds every control except the lever, every target is at least 44 px, the bar fits one row on desktop and wraps on a phone (five rows at 390 wide in DOG Army), every panel opens inside fullscreen, safe-area insets are respected, and no button floats over the bottom of the screen where the balance, bet and win readouts live.

**5. Quality bars to keep**

- Skip pays the same total as playing it out, checked with real numbers (DOG Army: 1,600, 1,340 and 54,302).
- Reduced motion: at most 3 particles through a whole jackpot.
- A reload mid-spin settles once, with the same round id.
- The Lab or preview leaves balance, jackpot meters, fund and spin count exactly as they were.
- No button under 44 px and no sideways scroll at 390 wide, listed button by button.
- An unknown twin count shows as unknown, never zero; untwinned art carries the NOT YET FOREVER stamp; cameo records are `{tokenId, collection, lineWin}`.
- Anything that cannot be what it looks like says so (DOG Army's 20 Runestone thumbnails are one shared render, so it never presents them as 20 artworks).
- Fair Play says "design estimate, not certified", and sources.json lists the logos that still need permission (Mempool Madness's list is empty on purpose).
- Sound is recorded where a free recording exists, with code-made sound as the fallback (DOG Army ships 16 CC0 mp3s with a sources file). Nobody has listened to any machine's audio by ear, so a listening sign-off is part of the gate.
- Every Lab stage is screenshotted and a results file is written (only 7 of 22 have one).

**6. Streamline once, in the Kit**

| What | Today | Standard |
| --- | --- | --- |
| Screen view | Four methods | The solver above |
| Fullscreen | Three APIs (8, 11 and 3 machines) | `fullscreenHost` |
| Bonus testing | Four forms | One preview and Lab module |
| Test flags | 12 different names | One: `PX_STANDALONE_TEST` |
| The room's way into the Lab | Six routes tried in order | `action('lab')` |
| Anchor line the room patches | `E=LAYR.machine(GAME_ID,BF)` in 9, `E0=…; let E=E0` in 9, `E_REAL` in 3, `BF.create` in Robot Factory | One form, so the round-log hook matches all |
| Engine | One identical block in 21 machines, plus the cascade in Robot Factory | v3 replaces that block |
| `mechanics()` | Lever timing in 2 machines, `buttons` in 4 | Both in all |
| Check scripts | A copy per machine | One shared suite |
| Results file | 7 of 22 | All |
| README | 11 of 22 | All |
| Leftover `_to_delete` folders | DOG Army, Hot Wallet, Mempool Madness, Robot Factory | Cleared |
| Pack size | 0.9 to 7.0 MB (Rare Pepe Directory 7.0, Monkey Hash 3.2) | A stated budget, with outliers flagged |

**7. Lessons already paid for**

- The Three.js build in the machines is a subset: no `ConeGeometry` or `FrontSide`.
- Never draw many strips while `shadowBlur` is set; it starved the software canvas in Rugged's jackpot.
- Tile makers are called `maker(item, sym)`, so the second argument is not a number.
- The room renders with Three r128, ACES tone mapping at 1.15 and linear output. Preview cabinets with the same settings or the colours look washed out.
- Call `updateMatrixWorld(true)` after scaling a cabinet before measuring it with `Box3`, and remember Forever Twins' rounded `box()` grows by its bevel.
- Reel tiles are drawn at 352 device px. Draw photos and portraits at 480 px to stay sharp.
- The room overlays its bonus strip (y 780 to 872) and the turbo and gamble buttons (y 890) on every screen, so scene buttons go inside the reel window.
- Test harnesses must re-read the scene after each screenshot and finish any real bonus before starting a Lab item. Headless Chromium can mis-composite a fully opaque fixed bar over WebGL, so use a near-opaque colour.
- The build sandbox reaches only xtrata.xyz (Hiro reads through its proxy), package registries and GitHub, so art-fetch scripts run on the Mac.
- Every check so far used software rendering. A real-GPU pass in Safari and Chrome is still owed on all 22.
- Delivering to the Mac needs `tar --overwrite`, or existing files are not replaced.

A machine counts as at standard only when the checklist in section 12 passes, including the five-size screen-view test, with the results written to a file in its folder.

## 11. Machine by machine

All 25 new machines pay into the Casino Jackpot the same way; this table shows only each one's Machine Fund. Types are T twin, W floor-wide, X Xtrata-native and F Forever Fund (section 4). "Built" means a standalone pack exists (22 of 25). Machines 1, 13, 19 and 24 were built with outside-holder code (linked wallets, DOG minimums) that the roll-out removes.

| # | Machine | Type | What earns shares | Period | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Ordinal Rush | W | Every Forever Twin in a live collection; the reel collections stay as art | Weekly | Built |
| 2 | Snow Crash | T | Crash Punks twins; machine stays dark until a helper exists and 100 twins are made | Weekly | Built |
| 3 | Genesis 21 | T | Twins in every OG collection that has a helper | Weekly | Built |
| 4 | The Archive | F | No shares: the fund refunds the fee of new twins; Degens earn cameos through City Mining | Weekly | Built |
| 5 | Plebs & Legends | W | Every twin; stand-in PFPs are twins, so cameos work; personality seats parked | Weekly | Built |
| 6 | Robot Factory | T | Megapont Ape twins (6 exist today) | Weekly | Built |
| 7 | Monkey Hash | T | Bitcoin Monkeys twins (6 exist) | Weekly | Built |
| 8 | Nine Lives | T | LEO Cats twins, plus cameo in If It Fits | Weekly | Built |
| 9 | Degen City | T | Miami and NYC Degens twins, 60% leading city, 40% trailing (3 exist) | Weekly | Built |
| 10 | The Stack | W | Every twin in every live collection | One stacking cycle | Built |
| 11 | Who Is Satoshi? | W, draw | One twin, drawn by block hash, takes the whole fund | Weekly | Built |
| 12 | Rare Pepe Directory | T | Bitcoin Pepes twins; Ordinal Pepe once its helper is live | Weekly | Built |
| 13 | Rune Pit | W | Every twin; runes stay as art | Weekly | Built |
| 14 | Xtrata Originals | X | Audionauts and other inscribed originals, plus cameo | Weekly | Built |
| 15 | The Halving | W | Every twin in every live collection | 2,016 blocks | Built |
| 16 | Mooneeb | T | LEO Cats twins, plus cameo in Moonshot | Weekly | Built |
| 17 | Club X | T | This Is Number One twins (no helper yet); 10% of each payout to Chemical X's cause | Weekly | Built |
| 18 | Rugged | T, F | Half per twin of rescued collections (Bitcoin Birds, 400), half to the Forever Fund | Weekly | Built |
| 19 | Sat Hunter | W | Every twin; sats stay as art | Weekly | Built |
| 20 | Mempool Madness | W | Every twin in every live collection | 144 blocks | Built |
| 21 | Corgi Kennel | W | Every twin; Happy Welsh twins join once it has a helper | Weekly | Prompt only |
| 22 | Launchpad | W | Every twin; reel tokens stay as art | Weekly | Prompt only |
| 23 | Pool Party | W | Every twin; reel tokens stay as art | Weekly | Prompt only |
| 24 | DOG Army | W | Every twin; DOG and Runestone stay as art | Weekly | Built |
| 25 | Hot Wallet | W, F | Half per twin across all collections, half to the Forever Fund | Weekly | Built |

**The five machines already on the floor** (Forever Twins, The Drop, Block Fortune, Neon Vault, Deep Strata) get the v3 engine and the topper line. Suggested funds: Forever Twins pays every twin like machine 10, and the other four pay only the Casino Jackpot. Jim to confirm.

## 12. Upgrade plan

Build the shared pieces once, prove them on three machines, then roll the rest through the same checklist. Each phase has a gate that must pass before the next starts.

&#91;embedded content: roadmap · 7 phases, each with a gate\]

Phases 2 and 3 carry the risk for the testnet casino, and phase 7, the on-chain design, is the largest piece; phases 4 and 5 repeat one checklist.

1. **Decide (Jim).** Done: the answers are recorded in section 13.
2. **Casino Kit, built once.** Block Fortune v3 core, the Casino Service on testnet with play money, the holder reader, the shared UI (Casino Jackpot sign, topper line, Fund panel), the fund config schema, and the Machine Kit from section 10: the screen-view solver, the deck spring and lever curve, one fullscreen module, the Bonus preview module and one shared check suite. Gate: exact model unchanged, 5M-spin run, meter conservation, two browsers sharing one meter, fund claims never exceeding the balance, and the five-size screen-view test passing on a pilot cabinet.
3. **Pilot on three built machines, one per generation.** Monkey Hash (fixed-preset screen view, `fullscreen.enter`), Mempool Madness (fixed-box screen view, `fullscreenHost`) and DOG Army (the newest, outside-holder code removed). Gate: every Lab item plays through four stages, fullscreen works on desktop and phone, the screen view matches DOG Army's at all five sizes, and you sign off the topper and panel wording.
4. **Roll out to the other 19 built machines,** in parallel, one checklist each (below). The oldest need the most: Snow Crash, Nine Lives, Ordinal Rush, Genesis 21, The Archive and Plebs & Legends lack the full Lab or the solved screen view or both.
5. **Build the three remaining machines:** 21 Corgi Kennel, 22 Launchpad and 23 Pool Party, directly on v3 and the Kit, from regenerated prompts that carry sections 1 to 10 of this bible.
6. **Integrate into the casino.** The five floor machines move to v3, the Casino Jackpot sign goes up, `pxMachineFullscreen` hands over to each pack, and the floor layout is settled for 30 machines. Gate: casino files changed only through each machine's INTEGRATION.md.
7. **On-chain, then real STX (section 9).** On testnet, in order: passkey wallet and session keys, the bankroll contract (STX first, sBTC later), the Casino Jackpot and Machine Fund contracts, sessions with the dealer and keeper, then an independent contract review and legal advice. Gate: nothing on mainnet before all of it passes.

**Checklist for each built machine (phases 3 and 4).**

1. Swap in the v3 core through the machine's own build script; the `const BF` block must match the standard hash.
2. Add `fund.json` (type, collections, period, split).
3. Replace the Holder Pot meter and panel with the Machine Fund and keep cameo records. Remove outside-holder code (wallet linking, token minimums): Ordinal Rush, Rune Pit, Sat Hunter and DOG Army.
4. Show the shared Casino Jackpot meter and the topper line with last period's pay per twin.
5. Bring the machine to the standard in section 10: the screen-view solver, one fullscreen API, `mechanics()` with lever and buttons, the shared Bonus preview and Lab, one anchor line and one test flag.
6. Run the checks: the 5,000,000-spin return, every Lab or preview item with a screenshot of each stage, the five-size screen-view test, the deck check, Skip totals equal to played totals, reduced motion, reload mid-spin, Lab isolation, and a fullscreen session at desktop and phone width with every target at least 44 px.
7. Update INTEGRATION.md and the README, write a results file, clear any `_to_delete` folder, and confirm no casino file was touched.

## 13. Risks and open questions

**Decisions.** Jim chose the first two; the rest take the simplest and safest option and can change at any time.

1. **Outside-theme machines** (1, 13, 19, 21 to 24) pay the floor-wide twin pool and keep their theme as art. Decided.
2. **STX is the bankroll,** with sBTC added later. Players deposit STX and play with LAYR credits (1 STX = 100,000 LAYR). Decided.
3. **Five meters,** one per bet level, as v1 does per machine.
4. **Parked streams:** holder spins, the Collection Cup and machine 5's personality seats wait until the rest works.
5. **Funds for the five floor machines:** Forever Twins pays all twins; the other four pay only the Casino Jackpot.
6. **On-chain shape:** the session model in section 9, with a fully on-chain top-bet tier as a later option.
7. **Bonus preview for every player,** as The Archive does it. It runs on practice chips and cannot touch LAYR, which also meets your rule that any bonus can be played in production. The alternative is to show it only to your wallet.

**Risks.**

- **Sharing revenue with holders is still a licensing question on real STX.** Rewards come from the house edge and never reduce a player's return, which is the simplest version, but take legal advice before mainnet, as v1 already says.
- **The dealer is a trust point inside sessions.** Commit-first seeds, a timeout withdrawal and an independent contract review are required before real money.
- **Passkey support is new.** Forum posts say it is live on Clarity 5; prove it on testnet before building on it.
- **Sponsored fees cost the casino real STX.** Batch settlement and per-wallet sponsorship caps keep that small.
- **Real money from the first deposit.** Players deposit and cash out STX, so licensing and gambling law apply from the first mainnet deposit. Get legal advice in phase 7 before any deposit or cash-out is built, and keep every earlier phase on testnet with play money.
- **Until phase 7 the shared meter is a trusted server** running on play money.
- **The engine is one engine.** Hashing the `const BF` block in every packed game gives the same result for the 21 standard machines (sha256 starting `203f873500`, 11,429 characters); Robot Factory uses the Deep Strata cascade. The two different hashes in older build notes (`7f619182…` and `7a5ae848…`) were probably taken over different spans of the file, so this block check replaces them and v3 swaps this block and nothing else.
- **The casino code has moved.** Others changed `index.html`, `room.js` and `chess.js` on 2 and 3 November. I have not seen how the five floor machines store their jackpot meters, so re-read the casino before phase 6.
- **Tiny twin counts** (6 Megapont, 6 Bitcoin Monkeys, 3 Degens) make single shares large and uneven. Machines 2 and 17 have no helper and pay nothing yet.
- **The room's round-log hook.** `pxRlPatch` only knows five games, and the line it patches comes in four forms across the 22 machines (section 10). The Kit fixes one form and the room gets a small change for the new machines.
- **Checks so far ran in software rendering.** A real-GPU pass in Safari and Chrome, and a listen to each machine's audio, is owed on all 22 before launch.
- **v1's open items stand:** logo permissions, Muneeb's, Chemical X's and Leonidas's OKs, floor space and the rescued list.

## 14. What carries over from Series Bible 1.0

Version 1.0 stays in the project as the reference for everything below, and where the two disagree this bible wins.

| Stays as in v1 | Replaced by v2 |
| --- | --- |
| Reels, strips, pay tables, free spins, pick bonus, hold and respin, gamble | The per-machine jackpot meter (now the Casino Jackpot) |
| Each machine's symbols, art rules, sources and permissions | The "Forever incentives" section and the Holder Pot (now Machine Fund, section 4) |
| Cabinet anatomy, fullscreen, Bonus Lab, four-stage bonus scenes | Each machine's "Holder hook" paragraph (use the table in section 11) |
| Standard features, packaging, checks, brand assets | The "Holder layer v1" block of the one-shot build prompt |
| Cameo royalty and Forever Fund rules | Holder spins, the Collection Cup and outside-asset holder pots (parked or dropped) |

The three one-shot build prompts for the machines still to build (21 Corgi Kennel, 22 Launchpad and 23 Pool Party) are regenerated from this bible and carry its Appendix A, so each stands alone.

## 15. Appendix A: reference code and interfaces

This appendix is the only part of the bible that is code. It is here so the bible and the build prompts stand alone: everything a builder needs to make a machine that the casino room accepts, copied verbatim from the newest finished builds (DOG Army, machine 24, and Hot Wallet, machine 25). Nothing outside this document is needed. Where a piece of code refers to a function of the game that is not shown (for example `spinClick`, `openRules`, `drawScreen`), that function is the machine's own and each machine writes it for itself; the interface is the point.

| Part | What it is |
| --- | --- |
| A.1 | The Block Fortune v2 engine: copied byte for byte, never edited |
| A.2 | The LAYR account script: the one account the room and every cabinet share |
| A.3 | Compatibility guard, the canvas stand-in renderer and the Xtrata mark's vector code |
| A.4 | How the game page is assembled and the exact text the room patches |
| A.5 | The host object `window.PX_CASINO_ENGINE`: the canvas-and-controls API the room calls |
| A.6 | Fullscreen: the game's side and the room's side |
| A.7 | The packed cabinet model: format, serializer, loader and required parts |
| A.8 | Screen view solver, deck-cap spring and lever curve |
| A.9 | The pack entry (`pack.json`) |
| A.10 | The return simulator |
| A.11 | The check recipes |

### A.1 The engine (copy byte for byte)

This is the whole file `engine.js`. Two hashes prove a copy is exact. The sha256 of the whole file is `7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168`. In the finished game page, the text from `const BF = (() => {` through the first `\n})();` after it (inclusive) is exactly 11,429 characters and its sha256 starts `203f873500`. Every built machine carries this block. Do not reformat it, minify it, rename anything in it or change one number. The engine is pure logic: no DOM, no timers, every random draw goes through the `rng` argument (`rng(n)` returns an integer from 0 to n−1), so a seeded generator makes runs repeatable. State is a plain object from `BF.fresh()`; the functions are `start`, `settle`, `feature`, `featureDone`, `pick`, `respin`, `collect`, `endFree`, `gamble`.

```js
/* Block Fortune v2 engine. Pure game logic: no DOM, no timers. Every random draw goes through the
   rng argument (defaults to crypto with rejection sampling), so tests can be seeded and a future
   on-chain version can supply block-hash randomness. Exported for Node tests via module.exports. */
const BF = (() => {
  'use strict';
  const STATE_VERSION = 2;
  const CODE = { C: 'cherry', L: 'lemon', M: 'chip', K: 'block', I: 'artifact', B: 'bitcoin', W: 'wild', S: 'scatter', V: 'vault', N: 'chain' };
  // Five weighted 32-stop strips. A spin picks one stop per reel; the window shows that stop and the
  // next two (wrapping). One confirmation and one vault key per reel, so a reel never shows two of
  // either. Chain nodes sit in N.N pairs (N..N on reel 3), so a reel shows at most two.
  const stripCodes = [
    'NCNLLCWILBSIMKCKIBKMLVCCBMMLKMIC',
    'NWNLBIMKILSICMCMCKLKBVKCBLLMIKLM',
    'NCMNWCILKCSCIMLBKKKMMVIIMCKMLBBL',
    'NBNCCBLKMLSKLLIKIICMIVCLCBLKMWMK',
    'NCNIMLCIKCSLKLMLBKICBVIWMCKMBMLC'
  ];
  const strips = Object.freeze(stripCodes.map(s => Object.freeze([...s].map(c => CODE[c]))));
  const symbols = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin', 'wild', 'scatter', 'vault', 'chain'];
  const NAMES = { cherry: 'Cherry', lemon: 'Lemon', chip: 'Mining chip', block: 'Block', artifact: 'Inscription', bitcoin: 'Bitcoin', wild: 'Wild', scatter: 'Confirmation', vault: 'Vault key', chain: 'Chain node' };
  // Multiples of the line bet (total bet / 20) for 3, 4 and 5 of a kind.
  const pays = Object.freeze({ cherry: [6, 16, 50], lemon: [7, 20, 60], chip: [9, 28, 90], block: [13, 38, 140], artifact: [20, 80, 300], bitcoin: [35, 150, 700], wild: [80, 400, 2500] });
  const lines = [[1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],[2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2],[1,0,1,2,1],[1,2,1,0,1],[0,1,0,1,0],[2,1,2,1,2],[1,1,0,1,1],[1,1,2,1,1],[0,2,0,2,0],[2,0,2,0,2],[0,2,1,2,0]];
  const bets = [20, 40, 100, 200, 500];
  const scatterPays = { 3: 2, 4: 5, 5: 10 };          // x total bet, doubled in free spins
  const vaultPrizes = [1, 2, 2, 3, 4, 5, 8, 10, 15];  // x total bet, each tile drawn independently
  const chainValues = [1, 2, 3, 5, 10];               // x total bet, each node drawn independently
  const CHAIN_ODDS = 25;                              // each empty cell locks with chance 1/25 (4%) per respin
  const FREE_SPINS = 8, RETRIGGER = 4, FREE_CAP = 24, FREE_MULT = 2;
  const JACKPOT_RATE = 0.02, JACKPOT_SEED = 500;      // Genesis Block: seed 500x bet, +2% of each paid bet at that level

  function randomInt(n) {
    if (!Number.isInteger(n) || n < 1) throw Error('Invalid random range');
    const a = new Uint32Array(1), cap = Math.floor(4294967296 / n) * n;
    do { crypto.getRandomValues(a); } while (a[0] >= cap);
    return a[0] % n;
  }
  const windowAt = (c, stop) => [0, 1, 2].map(r => strips[c][(stop + r) % strips[c].length]);
  function spinReels(rng = randomInt) {
    const stops = strips.map(s => rng(s.length));
    return { stops, grid: stops.map((s, c) => windowAt(c, s)) };
  }
  function evaluate(g, bet, mult = 1) {
    if (!bets.includes(bet)) throw Error('Invalid bet');
    const wins = []; let lineTotal = 0;
    lines.forEach((line, index) => {
      let best = null;
      for (const [sym, p] of Object.entries(pays)) {
        let count = 0;
        for (let x = 0; x < 5; x++) { const id = g[x][line[x]]; if (id === sym || (id === 'wild' && sym !== 'wild')) count++; else break; }
        if (count >= 3) { const amount = p[count - 3] * (bet / 20) * mult; if (!best || amount > best.amount) best = { line: index, symbol: sym, count, amount }; }
      }
      if (best) { wins.push(best); lineTotal += best.amount; }
    });
    const flat = g.flat(), count = s => flat.filter(x => x === s).length;
    const scatters = count('scatter'), vaults = count('vault'), chains = count('chain');
    const scatterPay = scatters >= 3 ? scatterPays[Math.min(5, scatters)] * bet * mult : 0;
    return { wins, lineTotal, scatters, vaults, chains, scatterPay, total: lineTotal + scatterPay,
      triggers: { chain: chains >= 5, vault: vaults >= 3, free: scatters >= 3 },
      jackpot: g.every(col => col[1] === 'bitcoin') };
  }
  const seedFor = bet => bet * JACKPOT_SEED;
  const freshJackpots = () => Object.fromEntries(bets.map(b => [b, seedFor(b)]));
  const meter = (state, bet) => (state.jackpots && state.jackpots[bet] != null) ? state.jackpots[bet] : seedFor(bet);
  function claimJackpot(state, bet) { const win = Math.floor(meter(state, bet) + 1e-6); state.jackpots[bet] = seedFor(bet); return win; }
  function makeVault(bet, free, rng) {
    return { type: 'vault', bet, free, awards: Array.from({ length: 9 }, () => vaultPrizes[rng(vaultPrizes.length)]), picks: [] };
  }
  function makeChain(g, bet, free, rng) {
    let cells = Array(15).fill(0);
    g.forEach((col, x) => col.forEach((s, y) => { if (s === 'chain') cells[y * 5 + x] = chainValues[rng(chainValues.length)]; }));
    const frames = [{ cells: [...cells], left: 3, added: [] }]; let left = 3;
    while (left && cells.includes(0)) {
      const added = [];
      cells = cells.map((v, i) => { if (v || rng(CHAIN_ODDS) !== 0) return v; added.push(i); return chainValues[rng(chainValues.length)]; });
      left = added.length ? 3 : left - 1;
      frames.push({ cells: [...cells], left, added });
    }
    return { type: 'chain', bet, free, frames, index: 0, sum: cells.reduce((a, v) => a + v, 0), full: cells.every(Boolean) };
  }
  
  const roundId = rng => Array.from({ length: 16 }, () => rng(256).toString(16).padStart(2, '0')).join('');
  function busy(state) { return !!state.pending || state.features.length > 0; }
  function start(state, rng = randomInt) {
    if (busy(state)) throw Error('Finish the current spin or feature first');
    const free = state.free > 0, bet = free ? state.freeBet : state.bet;
    if (!bets.includes(bet)) throw Error('Invalid bet');
    if (!free && state.balance < bet) throw Error('Insufficient LAYR in the shared account');
    state.gamble = 0; state.lastWin = 0;
    if (!state.jackpots) state.jackpots = freshJackpots();
    if (free) state.free--;
    else { state.balance -= bet; state.wagered += bet; state.jackpots[bet] = Math.round((meter(state, bet) + bet * JACKPOT_RATE) * 1e4) / 1e4; }
    const spin = spinReels(rng);
    const ev = evaluate(spin.grid, bet, free ? FREE_MULT : 1), features = [];
    if (ev.triggers.chain) features.push(makeChain(spin.grid, bet, free, rng));
    if (ev.triggers.vault) features.push(makeVault(bet, free, rng));
    state.pending = { id: roundId(rng), time: Date.now(), grid: spin.grid, stops: spin.stops, bet, free, features };
    return state.pending;
  }
  function credit(state, amount) { state.balance += amount; state.paidOut += amount; }
  function settle(state) {
    const p = state.pending; if (!p) return null;
    state.pending = null;
    const r = evaluate(p.grid, p.bet, p.free ? FREE_MULT : 1);
    r.jackpotWin = r.jackpot ? claimJackpot(state, p.bet) : 0;
    r.total += r.jackpotWin;
    credit(state, r.total);
    state.grid = p.grid; state.stops = p.stops; state.lastWin = r.total;
    state.spins++;
    if (p.free) { state.freeTotal += r.total; state.freeCount++; }
    r.freeAward = 0;
    if (r.triggers.free) {
      if (!state.freeActive) { state.freeActive = true; state.freeAwarded = 0; state.freeTotal = 0; state.freeCount = 0; state.freeBet = p.bet; }
      const add = state.freeAwarded === 0 ? FREE_SPINS : Math.min(RETRIGGER, FREE_CAP - state.freeAwarded);
      state.free += add; state.freeAwarded += add; r.freeAward = add;
    }
    for (const f of p.features) { f.roundId = p.id; state.features.push(f); }
    state.gamble = (!p.free && !p.features.length && !r.triggers.free && r.total > 0) ? r.total : 0;
    const feature = [r.jackpotWin ? 'GENESIS BLOCK' : '', ...p.features.map(f => f.type === 'chain' ? 'CHAIN' : 'VAULT'), r.triggers.free ? (p.free ? 'RETRIGGER' : 'FREE SPINS') : ''].filter(Boolean).join(' + ');
    state.history.unshift({ id: p.id, time: p.time, bet: p.free ? 0 : p.bet, win: r.total, kind: p.free ? 'Free spin' : 'Spin', feature, grid: p.grid });
    state.history = state.history.slice(0, 50);
    r.round = p;
    return r;
  }
  const feature = state => state.features[0] || null;
  function pick(state, index) {
    const f = feature(state);
    if (!f || f.type !== 'vault' || f.picks.length >= 3 || f.picks.includes(index) || !(index >= 0 && index < 9)) return null;
    f.picks.push(index); return { multiple: f.awards[index], amount: f.awards[index] * f.bet };
  }
  function respin(state) {
    const f = feature(state);
    if (!f || f.type !== 'chain' || f.index >= f.frames.length - 1) return null;
    f.index++; return f.frames[f.index];
  }
  function featureDone(f) { return f.type === 'vault' ? f.picks.length === 3 : f.index === f.frames.length - 1; }
  function collect(state) {
    const f = feature(state); if (!f || !featureDone(f)) return null;
    let amount = f.type === 'vault' ? f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet : f.sum * f.bet;
    const jackpotWin = f.type === 'chain' && f.full ? claimJackpot(state, f.bet) : 0;
    amount += jackpotWin;
    credit(state, amount);
    state.lastWin += amount;
    if (f.free) state.freeTotal += amount;
    const h = state.history.find(x => x.id === f.roundId); if (h) h.win += amount;
    state.features.shift();
    return { type: f.type, amount, jackpotWin };
  }
  function endFree(state) {
    if (!state.freeActive || state.free || busy(state)) return null;
    state.freeActive = false; state.freeAwarded = 0;
    return { total: state.freeTotal, count: state.freeCount };
  }
  function gamble(state, choice, rng = randomInt) {
    if (!state.gamble || busy(state) || state.free || !['odd', 'even'].includes(choice)) return null;
    const stake = state.gamble, odd = rng(2) === 1, win = (choice === 'odd') === odd;
    const digits = odd ? '13579bdf' : '02468ace';
    const hash = Array.from({ length: 63 }, () => '0123456789abcdef'[rng(16)]).join('') + digits[rng(8)];
    state.balance += win ? stake : -stake; state.gambleNet += win ? stake : -stake;
    state.lastWin = win ? stake * 2 : 0; state.gamble = 0;
    return { win, hash, parity: odd ? 'odd' : 'even', amount: win ? stake * 2 : 0, stake };
  }
  function fresh() {
    const stops = [1, 2, 13, 5, 16];
    return { version: STATE_VERSION, bet: 100, lastWin: 0, spins: 0, wagered: 0, paidOut: 0, gambleNet: 0,
      free: 0, freeBet: 100, freeAwarded: 0, freeTotal: 0, freeCount: 0, freeActive: false, 
      jackpots: freshJackpots(), stops, grid: stops.map((s, c) => windowAt(c, s)), pending: null, features: [], gamble: 0,
      history: [], muted: false, volume: 0.4, ambient: false, turbo: false, reduced: false, showLines: false, quality: 'auto', notes: [] };
  }
  function load(raw) {
    const base = fresh();
    if (!raw || raw.version !== STATE_VERSION || !bets.includes(raw.bet) || !Array.isArray(raw.grid) || raw.grid.length !== 5) return base;
    return { ...base, ...raw, jackpots: { ...base.jackpots, ...(raw.jackpots || {}) }, features: raw.features || [], history: raw.history || [], notes: [] };
  }
  const weights = symbols.map(sym => strips.map(st => st.filter(x => x === sym).length));
  return { STATE_VERSION, symbols, NAMES, strips, stripCodes, weights, pays, lines, bets, scatterPays, vaultPrizes, chainValues, CHAIN_ODDS,
    FREE_SPINS, RETRIGGER, FREE_CAP, FREE_MULT, JACKPOT_RATE, JACKPOT_SEED, randomInt, windowAt, spinReels, evaluate, meter, seedFor,
    fresh, load, start, settle, feature, featureDone, pick, respin, collect, endFree, gamble, busy };
})();
if (typeof module !== 'undefined') module.exports = BF;
```

### A.2 The LAYR account script (the room's shared account)

Paste this script first in the game page, unchanged. Its first line is the text the room searches for. In the room, the cabinet runs in a frame and this script reuses the room's account (`window.parent.ParallaxLAYRAccount`); on a standalone page it creates a local one. `LAYR.machine(GAME_ID, BF)` wraps the engine so every state change is one committed transaction on the shared balance.

```js
/* One existing LAYR account for the room and every cabinet.
   This local adapter does not claim to verify or transfer on-chain tokens. */
(() => {
  'use strict';
  try {
    if (window.parent !== window && window.parent.ParallaxLAYRAccount) {
      window.ParallaxLAYRAccount = window.parent.ParallaxLAYRAccount;
      return;
    }
  } catch (_) {}
  const KEY = 'xtrata.parallax.layr.account.v1', LEGACY_KEY='royalflush_v2', LOCK = 'xtrata.parallax.layr.account.v1';
  let owned = false, acquiring = null, releaseLock = null, room = null, draft = null, fault = '';
  const LEASE_KEY='xtrata.parallax.layr.lease.v1',LEASE_MS=60000;
  let leaseDB=null,leaseToken=null,leaseTimer=null,leaseFallback=false;
  const metadata = new WeakMap(), listeners = new Set();
  const copy = value => JSON.parse(JSON.stringify(value));
  function amount(value) {
    if (!Number.isFinite(value) || value < 0 || !Number.isSafeInteger(Math.round(value * 100))) throw Error('Invalid LAYR amount.');
    return Math.round(value * 100) / 100;
  }
  function read() {
    const raw = localStorage.getItem(KEY),legacy=raw===null?localStorage.getItem(LEGACY_KEY):null,r = raw ? JSON.parse(raw) : legacy ? JSON.parse(legacy) : {};
    if (!r || typeof r !== 'object' || Array.isArray(r)) throw Error('The shared LAYR account could not be read.');
    // Preserve an existing room balance; a new installation starts at zero.
    r.bank = typeof r.bank === 'number' ? amount(r.bank) : 0;
    r.layrGames = r.layrGames && typeof r.layrGames === 'object' && !Array.isArray(r.layrGames) ? r.layrGames : {};
    return r;
  }
  function ready(){
    if(!owned)return false;
    if(!leaseFallback)return true;
    try{const lease=JSON.parse(localStorage.getItem(LEASE_KEY)||'null');return !!lease&&lease.id===leaseToken&&lease.expires>Date.now()+5000;}catch(_){return false;}
  }
  function assertOwned() { if (!ready()) throw Error(fault || 'The LAYR account is active in another tab or its lease has paused. Reconnect before playing.'); }
  function publish() { for (const fn of listeners) { try { fn(); } catch (e) { console.warn('LAYR display could not refresh.', e); } } }
  function write(r) {
    assertOwned();
    r.bank = amount(r.bank); r.layrSchema = 1; r.layrMode = 'local';
    delete r.cashier; // The former STX faucet and unverified exchange receipts are retired.
    localStorage.setItem(KEY, JSON.stringify(r));
  }
  function balance() {
    try { return draft ? draft.bank : amount(room ? room.available() : read().bank); }
    catch (e) { fault = e.message; return 0; }
  }
  async function openLeaseDB(){
    if(leaseDB)return leaseDB;
    if(!window.indexedDB)throw Error('Shared LAYR storage is unavailable in this browser.');
    leaseDB=await new Promise((resolve,reject)=>{
      const request=indexedDB.open('xtrata-parallax-account-lock',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('leases');
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    return leaseDB;
  }
  async function leaseOperation(release=false){
    const db=await openLeaseDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('leases','readwrite'),store=tx.objectStore('leases'),request=store.get(LOCK);let next=null,accepted=false;
      request.onsuccess=()=>{
        const current=request.result,now=Date.now();
        if(release){if(current?.id===leaseToken){store.delete(LOCK);accepted=true;}return;}
        // IndexedDB serializes simultaneous acquisition and renewal attempts.
        if(current&&current.id!==leaseToken&&current.expires>now)return;
        next={id:leaseToken,expires:now+LEASE_MS};store.put(next,LOCK);accepted=true;
      };
      tx.oncomplete=()=>{
        if(accepted){
          try{
            if(release){const mirror=JSON.parse(localStorage.getItem(LEASE_KEY)||'null');if(mirror?.id===leaseToken)localStorage.removeItem(LEASE_KEY);}
            else localStorage.setItem(LEASE_KEY,JSON.stringify(next));
          }catch(e){reject(e);return;}
        }
        resolve(accepted);
      };
      tx.onerror=tx.onabort=()=>reject(tx.error||Error('LAYR account lock failed.'));
    });
  }
  async function acquireFallback(){
    try{
      read();leaseFallback=true;
      if(!leaseToken)leaseToken=Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16)).join('-');
      if(!await leaseOperation()){fault='The LAYR account is active in another tab. Close it, then reload or reconnect.';return false;}
      owned=true;
      if(!leaseTimer)leaseTimer=setInterval(()=>{
        if(!owned)return;
        leaseOperation().then(ok=>{if(!ok){owned=false;fault='The LAYR account moved to another tab. Reconnect before playing.';publish();}}).catch(e=>{owned=false;fault=e.message;publish();});
      },10000);
      publish();return true;
    }catch(e){fault=e.message;owned=false;return false;}
  }
  async function acquire() {
    if (ready()) return true;
    if (acquiring) return acquiring;
    fault = '';
    if(!navigator.locks){acquiring=acquireFallback().finally(()=>{acquiring=null;});return acquiring;}
    acquiring = new Promise(resolve => {
      navigator.locks.request(LOCK, { ifAvailable: true }, async lock => {
        if (!lock) { fault = 'The LAYR account is active in another tab. Close it, then reload or reconnect.'; resolve(false); return; }
        try { read(); } catch (e) { fault = e.message; resolve(false); return; }
        owned = true;
        const held = new Promise(done => { releaseLock = done; });
        resolve(true); publish(); await held;
        owned = false; releaseLock = null;
      }).catch(e => { fault = e.message; resolve(false); });
    }).finally(() => { acquiring = null; });
    return acquiring;
  }
  function serialize(state) {
    const saved = copy(state);
    for (const key of ['balance', 'cashouts', 'previewPaid', 'freePreview']) delete saved[key];
    return saved;
  }
  function attach(state, id, revision = 0) {
    delete state.balance;
    Object.defineProperty(state, 'balance', { configurable: true, enumerable: false,
      get: balance,
      set(value) {
        if (!draft || draft.state !== state) throw Error('Only a committed game action can change the shared LAYR balance.');
        draft.bank = amount(value);
      }
    });
    metadata.set(state, { id, revision });
    return state;
  }
  function commitState(state, r, nextBank) {
    const meta = metadata.get(state); if (!meta) throw Error('Machine is not linked to the LAYR account.');
    const previous = r.layrGames[meta.id];
    if ((previous?.revision || 0) !== meta.revision) throw Error('Machine state changed. Disconnect and reconnect before playing.');
    const revision = meta.revision + 1;
    r.layrGames[meta.id] = { revision, state: serialize(state) };
    r.bank = amount(nextBank + (room ? room.held() : 0));
    // Funds and the resulting pending/settled game state are one storage write.
    write(r); meta.revision = revision;
    if (room) { try { room.changed(nextBank); } catch (e) { console.warn('LAYR room display could not refresh.', e); } }
    publish();
  }
  function transact(state, fn) {
    assertOwned(); if (draft) throw Error('A LAYR transaction is already running.');
    const before = serialize(state), r = read();
    draft = { state, bank: balance() };
    try {
      const result = fn(), next = draft.bank;
      draft = null;
      commitState(state, r, next);
      return result;
    } catch (e) {
      draft = null;
      for (const key of Object.keys(state)) delete state[key];
      Object.assign(state, before);
      throw e;
    }
  }
  function saveGame(state) {
    if (!ready()) return false;
    if (draft) return true;
    commitState(state, read(), balance()); return true;
  }
  function machine(id, engine) {
    const api = { ...engine };
    api.fresh = () => attach(engine.fresh(), id);
    api.load = raw => attach(engine.load ? engine.load(raw) : { ...engine.fresh(), ...(raw || {}) }, id);
    for (const name of ['start', 'settle', 'pick', 'respin', 'collect', 'endFree', 'gamble']) {
      if (typeof engine[name] === 'function') api[name] = (state, ...args) => transact(state, () => engine[name](state, ...args));
    }
    return Object.freeze(api);
  }
  function openGame(id, engine) {
    const saved = read().layrGames[id], state = engine.load(saved?.state);
    return attach(state, id, saved?.revision || 0);
  }
  function saveRoom(values) {
    if (!ready()) return false;
    const r = read(); Object.assign(r, values); write(r); publish(); return true;
  }
  window.ParallaxLAYRAccount = Object.freeze({
    version: '1.0.0', mode: 'local', onChainConnected: false,
    acquire, ready, error: () => fault, balance, machine, openGame, saveGame, saveRoom,
    bindRoom(callbacks) { room = callbacks; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    roomState(){const r=read();return {bank:r.bank,hands:r.hands||0,net:r.net||0};},
    snapshot() { const r = read(); return { balance: balance(), currency: 'LAYR', mode: 'local', onChainConnected: false, available: ready(), games: Object.keys(r.layrGames) }; }
  });
  addEventListener('pagehide', () => { owned=false;if(releaseLock)releaseLock();if(leaseFallback){clearInterval(leaseTimer);leaseOperation(true).catch(()=>{});} });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&leaseFallback&&owned)leaseOperation().then(ok=>{if(!ok){owned=false;publish();}}).catch(()=>{owned=false;publish();});});
})();
```

### A.3 Compatibility guard, canvas stand-in and the Xtrata mark's vector code

`compat.js` goes in the game page straight after the account script. `canvasengine.js` is the stand-in renderer the room hands a cabinet that has no WebGL; it only has to exist as shown. `xlogo.js` draws the Xtrata mark as vector strokes (no image) onto any 2D canvas; the cabinet's lower door and the reel screen use it.

```js
(function(){
 'use strict';
 function show(title,detail){var l=document.getElementById('loading');if(!l||window.__bfReady)return;l.innerHTML='<div class="error-panel"><h2>'+title+'</h2><p>'+detail+'</p></div>';l.style.opacity=1;}
 var missing=[];
 try{new Function('var a={b:1};return a?.b??2;');}catch(e){missing.push('modern JavaScript (optional chaining)');}
 if(!(window.crypto&&crypto.getRandomValues))missing.push('secure random numbers');
 if(!(window.HTMLDialogElement&&HTMLDialogElement.prototype.showModal))missing.push('dialog windows');
 var c=document.createElement('canvas');if(!(c.getContext&&c.getContext('2d')))missing.push('canvas graphics');
 if(!Array.prototype.at)Object.defineProperty(Array.prototype,'at',{value:function(i){i=Math.trunc(i)||0;if(i<0)i+=this.length;return i<0||i>=this.length?undefined:this[i];},writable:true,configurable:true});
 var P=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
 if(P&&!P.roundRect)P.roundRect=function(x,y,w,h,r){r=Math.max(0,Math.min(typeof r==='number'?r:(r&&r[0])||0,w/2,h/2));this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();};
 if(missing.length){window.__bfUnsupported=true;show('This browser is too old','Block Fortune needs '+missing.join(', ')+'. Please open it in an up-to-date Chrome, Edge, Firefox or Safari.');return;}
 window.addEventListener('error',function(e){show('Something went wrong','The machine could not start ('+(e&&e.message?String(e.message).slice(0,140):'unknown error')+'). Try reloading the page or another browser.');});
 window.addEventListener('unhandledrejection',function(e){show('Something went wrong','The machine could not start ('+String((e&&e.reason&&e.reason.message)||e.reason||'unknown error').slice(0,140)+').');});
})();
```

```js
class CasinoCanvasEngineRenderer{constructor(){this.domElement=document.createElement('canvas');this.software=true;this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>16};this.info={render:{calls:0,triangles:0}};}setPixelRatio(){}setSize(){}setClearColor(){}render(){}compileAsync(){return Promise.resolve();}}
```

```js
/* Xtrata logo, traced from the brand mark onto an 851-unit grid and drawn as vector strokes (no image data). */
const XLOGO = (() => {
  const M = 851, mirror = pts => pts.map(([x, y]) => [M - x, y]);
  const outer = [[31, 244], [229, 244], [405, 439], [227, 634], [31, 634], [100, 559], [196, 559], [304, 438], [197, 320], [100, 320]];
  const inner = [[120, 320], [197, 320], [304, 438], [196, 559], [120, 559], [221, 439]];
  return {
    white: [[[24, 70], [290, 70], [425.5, 218], [561, 70], [827, 70], [827, 186], [606, 186], [425.5, 382], [245, 186], [24, 186]]],
    whiteOpen: [[[24, 112], [273, 112], [425.5, 276], [578, 112], [827, 112]]],
    blue: [outer, inner, mirror(outer), mirror(inner)],
    orange: [[[24, 691], [250, 691], [425.5, 500], [601, 691], [827, 691], [827, 784], [563, 784], [425.5, 635], [288, 784], [24, 784]]],
    depth: [[[38, 192], [68, 238]], [[813, 192], [783, 238]], [[38, 683], [68, 640]], [[813, 683], [783, 640]]]
  };
})();
function xtrataLogo(g, cx, cy, size) {
  const s = size / 851; g.save(); g.translate(cx - size / 2, cy - size / 2); g.scale(s, s); g.lineJoin = 'miter'; g.miterLimit = 6; g.lineCap = 'butt';
  const path = (pts, closed) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (closed) g.closePath(); };
  const metal = (c1, c2, c3, y0, y1) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, c1); gr.addColorStop(.5, c2); gr.addColorStop(1, c3); return gr; };
  g.lineWidth = 6; g.strokeStyle = '#2b4a78aa'; XLOGO.depth.forEach(p => { path(p); g.stroke(); });
  const layers = [['blue', metal('#6593cf', '#4675b6', '#315c95', 240, 640)], ['orange', metal('#f2aa5a', '#e28c3b', '#c9762c', 495, 790)], ['white', metal('#ffffff', '#e2e3e1', '#b9bbb8', 64, 392)]];
  for (const [k, stroke] of layers) {
    g.shadowColor = '#000c'; g.shadowBlur = 10; g.shadowOffsetY = 5; g.lineWidth = 13; g.strokeStyle = stroke;
    XLOGO[k].forEach(p => { path(p, true); g.stroke(); });
    if (k === 'white') XLOGO.whiteOpen.forEach(p => { path(p); g.stroke(); });
    g.shadowColor = 'transparent'; g.lineWidth = 2; g.strokeStyle = '#ffffff33'; XLOGO[k].forEach(p => { path(p, true); g.stroke(); });
  }
  g.restore();
}
```

### A.4 How the game page is assembled, and the exact text the room patches

The game is one self-contained HTML file. Its scripts come in this order: the LAYR account script (A.2), the compatibility guard (A.3), the engine (A.1), the Xtrata mark (A.3), the machine's bundled art as one script that sets a global, then the machine's own game code. All art, sound and data are inlined as data URIs, so the page works offline.

The game draws its whole screen onto one 2D canvas of 2800×1920 pixels with a 2× transform (so the drawing space is 1400×960). That canvas is what the cabinet's `screenMesh` shows and what the host object returns as `screen`. The page works two ways: opened on its own it claims the account and plays in a page view (it detects this with `HOSTED`, true when it sits in a frame); inside the room or a test host it waits for the host to call `activate()`.

The room patches the page's text by exact match, so each of these must appear **exactly once**, in exactly this form (replace `my-slug` with the machine's id). The machine's build script must fail if any count is not one:

```text
1. the text  <script>/* One existing LAYR account            (the start of the account script, A.2)
2. a regular expression match of
   GAME_ID='my-slug', *LAYR=window\.ParallaxLAYRAccount, *E=LAYR\.machine\(GAME_ID,BF\)
   (always this plain form: not "E0=...; let E=E0" and not "E_REAL")
3. a regular expression match of
   const screen *= *canvas\(2800, *1920\), *sg *= *screen\.getContext\('2d'\); *sg\.setTransform\(2, *0, *0, *2, *0, *0\);
4. a regular expression match of   connect\(\s*ac\.destination\s*\)     (the Web Audio output)
5. the text  window.PX_CASINO_ENGINE={                       (the host object, A.5)
```

The room also looks for `#fbGo` (the main feature-bar button) and `[data-pick]` elements (pick-bonus choices) so that its non-player guests can play a machine.

### A.5 The host object `window.PX_CASINO_ENGINE`

This is the whole contract between a game and whatever hosts it (the room or a test page). It is DOG Army's, shown exactly, with the surrounding session code. Every machine provides the same members: `screen` (the 2800×1920 canvas), `revision()` (a number that changes whenever the screen has been redrawn), `mechanics()`, `activate()`, `deactivate()`, `action(name)`, `stopAuto()`, `tap(x, y)` (in the 1400×960 drawing space), `key(code, key)`, `closeModal()`, `click(token)`, `input(token, value, checked, event)`, `fullscreen(on)`, `fullscreenHost(fn)` (see A.6), `refreshAccount()`, `ui()` and `dev`.

`mechanics()` is how the cabinet moves in the room: `lever` is `{id, elapsed, duration, angle}` while the lever is being pulled (the id changes with each pull) and null otherwise; `buttons` is `{spin, betUp, betDown, auto, pays}` where each is 1 for about 150 ms after that control is used (a deck click, Space, the fullscreen bar, Auto) and 0 otherwise; `lights` is 0 to 1 excitement; `scene` names the current bonus and stage; `jackpot` is true during the jackpot scene. Machines may add more (DOG Army adds `tags`, the glow of its eight dog-tag rows). Without these the machine plays the same, but the caps and lever do not move in the room.

`action(name)` accepts at least `spin`, `betUp`, `betDown`, `auto`, `pays`, `settings`, `history`, `account`, `fairplay`, `skip`, `primary`, `lab`, `test`, `fullscreen`, `gamble`, `max`, `sound`, `turbo`, and the machine's own words (DOG Army adds `holder`, `moon`, `doom`). `action('lab')` is the one way the room opens the Bonus preview and Lab. `ui()` returns what the room needs to mirror the machine's state in its own interface (the HTML of any open modal and of the feature bar, with data-px-source tokens that `click` and `input` use to drive them).

```js
// Cached cabinets borrow the room's LAYR account; they never own a second wallet.
let pxSessionOwned=false,pxSessionEpoch=0,pxSessionPending=null;
function pxReleaseLease(){pxSessionEpoch++;pxSessionOwned=false;sessionLock=true;}
async function pxClaimSession(){
  if(pxSessionOwned&&LAYR.ready())return true;
  if(pxSessionPending)return pxSessionPending;
  const epoch=pxSessionEpoch;
  pxSessionPending=(async()=>{
    if(!await LAYR.acquire()||epoch!==pxSessionEpoch){sessionLock=true;update();status(LAYR.error()||'LAYR connection was cancelled.');return false;}
    sessionLock=false;state=LAYR.openGame(GAME_ID,E);resume();pxSessionOwned=true;return true;
  })().finally(()=>{pxSessionPending=null;});
  return pxSessionPending;
}

// A canvas-and-controls API. The casino owns all visible 3D rendering and cameras.
const pxSourceElements=new Map(),pxSourceTokens=new WeakMap();let pxToken=0;
function pxPort(element){if(!element)return '';for(const n of [element,...element.querySelectorAll('*')]){if(!pxSourceTokens.has(n)){const id=String(++pxToken);pxSourceTokens.set(n,id);pxSourceElements.set(id,n);}n.setAttribute('data-px-source',pxSourceTokens.get(n));}return element.outerHTML;}
function pxControl(action){
  const map={spin:spinClick,betDown:()=>changeBet(-1),betUp:()=>changeBet(1),auto:autoClick,pays:openRules,settings:openSettings,history:openHistory,account:openAccount,fairplay:openFairPlay,holder:openHolder,skip:skipScene,primary:primaryAction,lab:openLab,test:openTest,fullscreen:()=>setFullscreen(!fsOn),gamble:openGamble,moon:()=>scene?callGamble('moon'):openGamble(),doom:()=>scene?callGamble('doom'):openGamble(),max:()=>changeBet(0,true),
    sound:()=>$('sound').click(),turbo:()=>$('turbo').click()};
  (map[action]||(()=>{}))();
}
window.PX_CASINO_ENGINE={
  screen,revision:()=>screenRev,
  refreshAccount(){screenDirty=true;update();drawScreen(performance.now());},
  // lever and spin button as the room expects; lights, tags and topper excitement are extras a host may use for the light show.
  // tags: eight numbers 0..1, the glow of the cabinet's px-tag0 (bottom) .. px-tag7 (top) rows: they step in time on wins, sweep during bonuses and all light on the jackpot.
  mechanics(){return {lever:leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:null,armZ:null,buttons:{spin:pressing('spin'),betUp:pressing('betUp'),betDown:pressing('betDown'),auto:pressing('auto'),pays:pressing('pays')},lights:excite,tags:tagGlow.slice(),scene:scene?scene.kind+':'+scene.stage:freeMode?'free:play':'',jackpot:!!(scene&&scene.kind==='jackpot')};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;animate.last=performance.now();screenDirty=true;update();drawScreen(performance.now());},
  deactivate(){if(spinning)return false;stopAuto();if(fsOn)setFullscreen(false);clearTimeout(freeTimer);music(false);if(labRun)endLab();if(pxEngineActive)save();pxEngineActive=false;if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
  action(name){if(pxEngineActive)pxControl(name);},
  stopAuto(){stopAuto();},
  tap(x,y){screenTap(x,y);},
  key(code,key){document.body.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},
  closeModal(){closeModal();},
  click(token){const el=pxSourceElements.get(token);if(el)el.click();},
  input(token,value,checked,event){const el=pxSourceElements.get(token);if(!el)return;if('value'in el)el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},
  fullscreen(on){setFullscreen(on===undefined?!fsOn:!!on);return fsOn;},
  dev:DEV,
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'MARCH',spinDisabled:$('spin').disabled,betDownDisabled:$('minus').disabled,betUpDisabled:$('plus').disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,lab:!!labRun,scene:scene?scene.kind+':'+scene.stage:'',modal:modal?.open&&!fsOn?pxPort(modal):'',feature:bar&&!bar.hidden&&!fsOn?pxPort(bar):''};}
};
// Opened on its own (not inside a casino or test host), the page claims the account and plays in page view.
if(!HOSTED){window.PX_CASINO_ENGINE.activate().catch(e=>toast(e.message));}
```

`pxPort`, `pxControl` and the session functions above are shown in full. `spinClick`, `changeBet`, `autoClick`, `openRules`, `openSettings`, `openHistory`, `openAccount`, `openFairPlay`, `openHolder`, `skipScene`, `primaryAction`, `openLab`, `openTest`, `setFullscreen`, `openGamble`, `callGamble`, `screenTap`, `drawScreen`, `update`, `save`, `resume`, `stopAuto`, `music` and the variables around them are the machine's own code. `pxEngineActive` gates everything so a cached cabinet does nothing until activated, and `deactivate()` returns false while a spin is running.

### A.6 Fullscreen: `fullscreenHost`

The game owns the fullscreen layout (the screen fills the view; one bar along the bottom carries every control except the lever, labelled with the machine's own deck words and the plain action in small type; every panel opens inside it). The browser only grants fullscreen to the page that received the click, so the room does the browser part and the game does the layout. The game side (Hot Wallet's, with its own button list as an example; use your own labels and actions):

```js
let fsOn = false, fsHost = null, fsSelf = false;
const FS_BUTTONS = [
  ['primary', 'TIME TRAVEL', 'spin', 'fb primary'], ['skip', 'SKIP', 'skip bonus', 'fb'], ['hot', 'HOT', 'call hot', 'fb gold'], ['cold', 'COLD', 'call cold', 'fb gold'], ['keep', 'KEEP', 'keep win', 'fb'], ['gamble', 'HOT OR COLD?', 'gamble win', 'fb gold'], ['collect', 'COLLECT', 'take the prize', 'fb gold'],
  ['betDown', '−YEARS', 'bet down', 'fb'], ['bet', '', 'bet', 'fb chip'], ['betUp', '+YEARS', 'bet up', 'fb'], ['max', 'MAX YEARS', 'max bet', 'fb'], ['auto', 'AUTO-TOUR', 'auto', 'fb'],
  ['pays', 'GUIDE', 'pays & rules', 'fb'], ['exhibits', 'EXHIBITS', 'every tile, sourced', 'fb'], ['timeline', 'TIMELINE', '2011 to 2026', 'fb'], ['lessons', 'LESSONS', 'and words', 'fb'], ['pot', 'POT', 'cold storage pot', 'fb'], ['fair', 'FAIR PLAY', 'rules & RTP', 'fb'], ['turbo', 'TURBO', 'speed', 'fb'], ['sound', 'SOUND', 'mute', 'fb'], ['volume', '', 'volume', 'fb vol'], ['history', 'LOG', 'rounds', 'fb'],
  ['account', 'ACCOUNT', 'LAYR account', 'fb'], ['settings', 'SETTINGS', 'make it yours', 'fb'], ['balance', '', 'LAYR balance', 'fb chip'], ['lab', 'LAB', 'bonus lab', 'fb'], ['test', 'TEST', 'test panel', 'fb'], ['exit', 'EXIT', 'leave fullscreen', 'fb']];
const FS_ACT = { primary: () => spinClick(), skip: () => skipScene(), hot: () => callGamble('hot'), cold: () => callGamble('cold'), keep: () => keepWin(), gamble: () => openGamble(), collect: () => { const f = feature(); if (scene && f && E.featureDone(f)) collectScene(); }, betDown: () => changeBet(-1), betUp: () => changeBet(1), max: () => changeBet(0, true), auto: () => autoClick(), pays: () => openRules(), exhibits: () => openCollections(), timeline: () => openTimeline(), lessons: () => openLessons(), pot: () => openHolders(), account: () => openAccount(), settings: () => openSettings(), fair: () => openFair(), turbo: () => $('turbo').click(), sound: () => $('sound').click(), history: () => openHistory(), lab: () => openLab(), test: () => openTestPanel(), exit: () => requestFullscreen(false) };
(function buildFsBar() { const bar = $('fsBar'), html = ([id, label, small, cls]) => id === 'volume' ? `<label class="${cls}" data-fs="volume"><input type="range" min="0" max="1" step=".05" aria-label="Volume"><small>${small}</small></label>` : `<button class="${cls}" data-fs="${id}" type="button"><b>${label}</b><small>${small}</small></button>`;
  $('fsMain').innerHTML = FS_BUTTONS.slice(0, 7).map(html).join(''); $('fsMore').innerHTML = FS_BUTTONS.slice(7).map(html).join('');
  bar.querySelectorAll('button[data-fs]').forEach(b => b.onclick = () => { audioInit(); const f = FS_ACT[b.dataset.fs]; if (f) f(); updateFsBar(); });
  const vol = bar.querySelector('[data-fs=volume] input'); vol.oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  screen.addEventListener('pointerup', e => { if (!fsOn) return; const r = screen.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); updateFsBar(); }); })();
function updateFsBar() { if (!fsOn) return; const q = id => $('fsBar').querySelector(`[data-fs="${id}"]`), show = (id, on) => { const el = q(id); if (el) el.hidden = !on; };
  const gambleIntro = scene && scene.kind === 'gamble' && scene.stage === 'intro', idle = !spinning && !scene && !feature() && !state.free, f = feature();
  q('primary').querySelector('b').textContent = spinning ? 'TRAVELLING…' : primaryLabel(!scene && !feature() && !state.free && state.balance < state.bet); q('primary').querySelector('small').textContent = scene || feature() ? 'bonus action' : 'spin'; q('primary').disabled = spinning || sessionLock || gambleIntro || (scene && scene.stage === 'play' && scene.kind === 'gamble' && !scene.data.landed);
  show('skip', canSkip()); show('hot', gambleIntro); show('cold', gambleIntro); show('keep', gambleIntro); show('gamble', idle && state.gamble > 0); show('collect', !!(scene && scene.stage === 'play' && f && E.featureDone(f)));
  q('bet').querySelector('b').textContent = fmt(state.free ? state.freeBet : state.bet); q('balance').querySelector('b').textContent = fmt(state.balance); q('balance').querySelector('small').textContent = lab ? 'LAB balance' : 'LAYR balance';
  for (const id of ['betDown', 'betUp', 'max']) q(id).disabled = busy() || sessionLock; q('auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-TOUR';
  q('turbo').setAttribute('aria-pressed', String(!!state.turbo)); q('sound').querySelector('b').textContent = state.muted ? 'SOUND OFF' : 'SOUND'; q('volume').querySelector('input').value = state.volume; show('test', TEST_OK); show('lab', LAB_OK); q('lab').setAttribute('aria-pressed', String(!!lab));
}
function fitFs() { if (!fsOn) return; const st = $('fsStage'), w = st.clientWidth - 16, h = st.clientHeight - 16, k = Math.max(.1, Math.min(w / 1400, h / 960)); screen.style.width = `${Math.floor(1400 * k)}px`; screen.style.height = `${Math.floor(960 * k)}px`; }
// Show or hide the fullscreen layout. Hosts call this through PX_CASINO_ENGINE.fullscreen(on) once they have made the frame visible.
function setFullscreenLayout(on) { fsOn = !!on; $('fs').hidden = !fsOn; document.body.classList.toggle('fs-on', fsOn);
  if (fsOn) { $('fsStage').appendChild(screen); fitFs(); updateFsBar(); } else if (screen.parentNode) screen.remove(); screenDirty = true; return fsOn; }
async function requestFullscreen(on) { if (fsHost) { fsHost(!!on); return; }
  if (on) { setFullscreenLayout(true); fsSelf = true; try { if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch (e) { /* the fixed full-viewport layer stays as the fallback */ } }
  else { fsSelf = false; try { if (document.fullscreenElement) await document.exitFullscreen(); } catch (e) {} setFullscreenLayout(false); } }
document.addEventListener('fullscreenchange', () => { if (fsSelf && !document.fullscreenElement) { fsSelf = false; setFullscreenLayout(false); } fitFs(); });
addEventListener('resize', fitFs);
```

The members the host object exposes for it:

```js
  fullscreen(on){return setFullscreenLayout(on);},
  fullscreenHost(fn){fsHost=typeof fn==='function'?fn:null;},
```

The room's side: once it has the engine it registers a host; its Full screen button then calls `enterMachineFullscreen`. Without a registered host the game fullscreens its own document, falling back to a fixed full-viewport layer where the Fullscreen API is missing (iPhone Safari). The logic frame needs `allow="fullscreen"`. The game's own Exit button, the F key and Esc call the registered host.

```js
// once, after createCasinoEngine(type) has the engine:
engine.api.fullscreenHost(on => on ? enterMachineFullscreen(engine) : exitMachineFullscreen(engine));
// the room's Full screen button (pxMachineFullscreen) calls enterMachineFullscreen(engine):
async function enterMachineFullscreen(engine){const f=engine.frame;f.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;border:0;background:#000';f.removeAttribute('aria-hidden');
  try{await f.requestFullscreen({navigationUI:'hide'});}catch(e){/* fixed full-viewport fallback (iPhone Safari) */}
  engine.api.fullscreen(true);f.focus();}
async function exitMachineFullscreen(engine){const f=engine.frame;try{if(document.fullscreenElement)await document.exitFullscreen();}catch(e){}
  engine.api.fullscreen(false);f.style.cssText='';f.setAttribute('aria-hidden','true');}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)/* for the active engine */exitMachineFullscreen(getActiveEngine());});
```

### A.7 The packed cabinet model

A cabinet is a tree of nodes plus shared lists, serialized as JSON and gzip+base64'd into the pack. It is built with Three.js r128 (a subset build: no `ConeGeometry`, no `FrontSide`). The room scales every cabinet to 2.6 m tall, stands it on the floor, and finds parts by name.

**Format.** `{ root, geometries, materials, textures }`. A node is `{ p:[x,y,z], q:[x,y,z,w], s:[x,y,z], visible, role, children:[...] }`; a mesh node adds `g` (an index into `geometries`), `m` (an index, or an array of indexes, into `materials`) and, for a deck button, `action` (a string). A geometry is `{ attributes: { position, normal, uv }, index?, groups? }` where each attribute is `{ size, array }`, `index` is an array of vertex indexes and a group is `{ start, count, materialIndex }`. A material is `{ type: 'standard' | 'basic', color, roughness, metalness, transparent, opacity, side, depthWrite, alphaTest, flatShading, map, emissive, emissiveIntensity }` (colours as integers, `map` an index into `textures` or null). A texture is `{ image (a data URL), wrapS, wrapT, repeat:[x,y], offset:[x,y], flipY }`. The serializer, exactly:

```js
function packCabinet(THREE, root) {
  const geos = [], gIdx = new Map(), mats = [], mIdx = new Map(), texs = [], tIdx = new Map();
  const R = v => Math.round(v * 1e5) / 1e5, R4 = v => Math.round(v * 1e4) / 1e4, R3 = v => Math.round(v * 1e3) / 1e3;
  const colorInt = c => c ? c.getHex() : 0;
  function texture(t) { if (!t) return null; if (tIdx.has(t.uuid)) return tIdx.get(t.uuid); const img = t.image, opaque = t.userData && t.userData.opaque, q = (t.userData && t.userData.q) || .9; const data = img.toDataURL ? img.toDataURL(opaque ? 'image/jpeg' : 'image/png', q) : img.src; texs.push({ image: data, wrapS: t.wrapS, wrapT: t.wrapT, repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y], flipY: t.flipY }); tIdx.set(t.uuid, texs.length - 1); return texs.length - 1; }
  function material(m) { if (mIdx.has(m.uuid)) return mIdx.get(m.uuid); const basic = m.isMeshBasicMaterial; mats.push({ type: basic ? 'basic' : 'standard', color: colorInt(m.color), roughness: basic ? 1 : m.roughness, metalness: basic ? 0 : m.metalness, transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest, flatShading: !!m.flatShading, map: texture(m.map), emissive: basic ? 0 : colorInt(m.emissive), emissiveIntensity: basic ? 1 : m.emissiveIntensity }); mIdx.set(m.uuid, mats.length - 1); return mats.length - 1; }
  function geometry(g) { if (gIdx.has(g.uuid)) return gIdx.get(g.uuid); const out = { attributes: {} }; for (const k of ['position', 'normal', 'uv']) { const a = g.attributes[k]; if (a) out.attributes[k] = { size: a.itemSize, array: Array.from(a.array, k === 'normal' ? R3 : R4) }; } if (g.index) out.index = Array.from(g.index.array); if (g.groups && g.groups.length) out.groups = g.groups.map(x => ({ start: x.start, count: x.count, materialIndex: x.materialIndex })); geos.push(out); gIdx.set(g.uuid, geos.length - 1); return geos.length - 1; }
  function node(o) { const n = { p: o.position.toArray().map(R), q: o.quaternion.toArray().map(R), s: o.scale.toArray().map(R), visible: o.visible, role: (o.userData && o.userData.role) || '', children: [] }; if (o.isMesh) { n.g = geometry(o.geometry); n.m = Array.isArray(o.material) ? o.material.map(material) : material(o.material); } if (o.userData && typeof o.userData.action === 'string') n.action = o.userData.action; o.children.forEach(c => n.children.push(node(c))); return n; }
  return { root: node(root), geometries: geos, materials: mats, textures: texs };
}
```

**The loader** the test host (and the room) uses to turn it back into Three.js objects. A node with a `role` is named `px-<role>`, and a node with an `action` gets `userData.pxMachineAction`:

```js
function packedCabinet(data){
  const geos=data.geometries.map(g=>{const out=new THREE.BufferGeometry();for(const [key,a] of Object.entries(g.attributes))out.setAttribute(key,new THREE.BufferAttribute(new Float32Array(a.array),a.size));if(g.index)out.setIndex(g.index);for(const group of g.groups||[])out.addGroup(group.start,group.count,group.materialIndex);out.computeBoundingSphere();return out;});
  const textures=data.textures.map((t,i)=>{const out=new THREE.Texture(data.images[i]);out.wrapS=t.wrapS;out.wrapT=t.wrapT;out.repeat.fromArray(t.repeat);out.offset.fromArray(t.offset);out.flipY=t.flipY;out.anisotropy=16;out.needsUpdate=true;return out;});
  const mats=data.materials.map(m=>{const props={color:m.color,map:m.map==null?null:textures[m.map],transparent:m.transparent,opacity:m.opacity,side:m.side,depthWrite:m.depthWrite,alphaTest:m.alphaTest};if(m.type==='basic')return new THREE.MeshBasicMaterial(props);return new THREE.MeshStandardMaterial(Object.assign(props,{roughness:m.roughness,metalness:m.metalness,emissive:m.emissive,emissiveIntensity:m.emissiveIntensity,flatShading:m.flatShading,envMap:envTex,envMapIntensity:.65}));});
  function node(n){const out=n.g==null?new THREE.Group():new THREE.Mesh(geos[n.g],Array.isArray(n.m)?n.m.map(id=>mats[id]):mats[n.m]);out.position.fromArray(n.p);out.quaternion.fromArray(n.q);out.scale.fromArray(n.s);out.visible=n.visible;if(n.role)out.name='px-'+n.role;if(n.action)out.userData.pxMachineAction=n.action;out.castShadow=!!out.isMesh;out.receiveShadow=!!out.isMesh;n.children.forEach(c=>out.add(node(c)));return out;}
  const out=node(data.root);out.updateMatrixWorld(true);return out;
}
// The room scales every cabinet to 2.6 m tall and stands it on the floor.
const model = packedCabinet(data), bb = new THREE.Box3().setFromObject(model), size = bb.getSize(new THREE.Vector3()), k = 2.6 / size.y;
model.scale.multiplyScalar(k); model.position.y -= bb.min.y * k; const cabinet = new THREE.Group(); cabinet.add(model); scene.add(cabinet);
```

**Required parts.** Roles: `screenMesh` (the plane that shows the game canvas), `crest` (the topper, turning on its own clock), `spinPhysical` (the big spin button), `lever` (the arm, pivoting about its own origin so rotating it about x pulls it down), and for the deck caps `btn-<action>` (the cap) and `btnface-<action>` (its label) for each of `spin`, `betUp`, `betDown`, `auto`, `pays`. Deck button meshes carry `action` set to exactly one of `spin`, `betUp`, `betDown`, `auto`, `pays`. A machine may add its own roles (DOG Army adds `tag0` to `tag7`, rows of lights with their own cloned emissive materials). The cabinet model must be about 2.6 m tall once scaled, with the screen facing +z.

**Colour pipeline.** The room renders with Three r128, ACES tone mapping at exposure 1.15 and linear output (no sRGB encoding). Preview with the same settings or the colours look washed out. `updateMatrixWorld(true)` before measuring with `Box3`.

### A.8 Screen view solver, deck-cap spring and lever curve

These are the standard from DOG Army (the test page's copy; the room does the same). The top and bottom bars in the solver are the test page's own elements (`#topbar`, `#hud`, `#hint`), so name them whatever your page calls its top bar and its controls strip.

**Finding the deck and animating the topper** (the model has been scaled and stood on the floor first):

```js
const animations = []; for (const role of ['crest', 'recordGroup', 'core', 'lever', 'spinPhysical', 'armPivot']) { const o = model.getObjectByName('px-' + role); if (o) animations.push({ o, role, base: o.rotation.clone(), homePosition: o.position.clone() }); }
```

**Deck caps on a spring.** Each cap and its label sink along the deck's own z axis; held by the pointer or pulsed by `mechanics().buttons`; released with a small rebound:

```js
// Deck buttons: each cap (and its label) sits on a spring and moves along the deck's own z axis (out of the panel face).
// Held down by the pointer, or pulsed for a moment by the game itself (Space, the fullscreen bar, Bet +/-); released with a small rebound.
const caps = {}, heldAction = { a: null };
model.traverse(o => { const m = /^px-(btn|btnface)-(\w+)$/.exec(o.name || ''); if (m) (caps[m[2]] = caps[m[2]] || { parts: [], x: 0, v: 0, hold: false, depth: .034 }).parts.push({ o, z0: o.position.z }); });
{ const sp = animations.find(a => a.role === 'spinPhysical'); if (sp) caps.spin = { parts: [{ o: sp.o, z0: sp.o.position.z }], x: 0, v: 0, hold: false, depth: .05 }; }
function stepCaps(dt, mech) { let moving = false; const b = mech.buttons || {};
  for (const k in caps) { const c = caps[k], target = (c.hold || b[k]) ? 1 : 0, w = target ? 62 : 36, z = target ? 1 : .36; let x = c.x, v = c.v; const n = Math.max(4, Math.ceil(dt * 240)), h = dt / n;
    for (let i = 0; i < n; i++) { v += (-w * w * (x - target) - 2 * z * w * v) * h; x += v * h; }
    c.x = Math.max(-.14, Math.min(1.03, x)); c.v = v; if (Math.abs(c.x - target) > .002 || Math.abs(v) > .02) moving = true; else { c.x = target; c.v = 0; }
    for (const p of c.parts) p.o.position.z = p.z0 - c.x * c.depth; }
  return moving; }
```

**The lever.** A hand pulls it down (ease in and out), it rests against the bottom stop, then springs back and bounces once off the top stop. `s` is seconds since the pull began (0 to 0.9); the result is 0 to 1, multiplied by `mechanics().lever.angle`:

```js
// The lever: a hand pulls it down (ease in and out), it rests against the bottom stop, then springs back and bounces once off the top stop.
function leverCurve(s) { if (s < .26) { const u = s / .26; return u * u * (3 - 2 * u); } if (s < .38) return 1 + .02 * Math.sin((s - .26) * 70) * Math.exp(-(s - .26) * 12);
```

**How the frame loop applies them** (`mech` is `api.mechanics()`; the lever's `id` changing starts a new pull):

```js
function frameLoop(now) {
  requestAnimationFrame(frameLoop);
  const rev = api.revision(); if (rev !== revision) { revision = rev; texture.needsUpdate = true; if (!webglOK) $('fallback2d').getContext('2d').drawImage(api.screen, 0, 0, 1400, 960); }
  const mech = api.mechanics(), t = now / 1000;
  if (mech.lever && mech.lever.id !== lastLever) { lastLever = mech.lever.id; leverPull = { start: now - mech.lever.elapsed, duration: mech.lever.duration, angle: mech.lever.angle }; }
  const kick = mech.lights || 0, capsMoving = stepCaps(Math.min(.12, Math.max(.001, (now - (frameLoop.last || now)) / 1000)), mech); frameLoop.last = now;
  for (const a of animations) {
    if (a.role === 'lever') { const u = leverPull ? Math.max(0, Math.min(1, (now - leverPull.start) / leverPull.duration)) : 1; a.o.rotation.x = a.base.x + (leverPull && u < 1 ? leverCurve(u * leverPull.duration / 1000) * leverPull.angle : 0); if (u >= 1) leverPull = null; }
    else if (a.role === 'spinPhysical') { /* moved by the button spring below */ }
    else a.o.rotation.y = a.base.y + t * (.4 + kick * 1.6);   // the crest turns on its own clock, faster when the machine is excited
  }
```

**Screen view.** Straight on at a pitch of 0.16 (`SV_PITCH`), slightly above, because a lower angle shows the underside of the marquee over the top of the screen. It is solved numerically with a 40-iteration bisection at the start and on every resize, so that the top of the screen sits 10 px under the top bar, the front bottom edge of the deck sits on the top of the controls strip, and the sides keep a 4% margin. The deck is every `pxMachineAction` mesh plus `spinPhysical`; the lever is left out. If the cabinet has a bezel or lintel above the glass, give the top edge an allowance (0.45 for Club X, 0.3 for The Halving, in model units). `screenBox` is the world-space `Box3` of `screenMesh`.

```js
// Screen view: straight on, zoomed so the top of the screen sits under the top bar and the deck buttons sit on the bottom edge
// of the view (just above the controls), with nothing of the cabinet showing below them.
const deckBox = new THREE.Box3(); model.traverse(o => { if (o.isMesh && (o.userData.pxMachineAction || /spinPhysical/.test(o.name) || (o.parent && (o.parent.userData.pxMachineAction || /spinPhysical/.test(o.parent.name))))) deckBox.expandByObject(o); });
function fitDist(cab) { const a = innerWidth / innerHeight; return a < .75 ? 9.2 : a < 1.1 ? 7.4 : 6.2; }
// Solved numerically with a test camera: a player's-eye view from slightly above, looking down over the deck.
const SV_PITCH = .16, svCam = new THREE.PerspectiveCamera();
function svProject(p, ty, dist, tx, tz) { const cp = Math.cos(SV_PITCH); svCam.position.set(tx, ty + Math.sin(SV_PITCH) * dist, tz + dist * cp); svCam.lookAt(tx, ty, tz); svCam.updateMatrixWorld(); return p.clone().project(svCam); }
function screenGoal() {
  const H = innerHeight, W = innerWidth; svCam.fov = camera.fov; svCam.aspect = W / H; svCam.near = camera.near; svCam.far = camera.far; svCam.updateProjectionMatrix();
  const topPx = Math.max($('topbar').getBoundingClientRect().bottom, $('hint').offsetParent ? $('hint').getBoundingClientRect().bottom : 0) + 10, botPx = $('hud').getBoundingClientRect().top;
  const nT = 1 - 2 * topPx / H, nB = 1 - 2 * botPx / H, tx = (screenBox.min.x + screenBox.max.x) / 2, tz = screenBox.getCenter(new THREE.Vector3()).z;
  const topP = new THREE.Vector3(tx, screenBox.max.y, screenBox.max.z), botP = new THREE.Vector3(tx, deckBox.min.y, deckBox.max.z);
  const halfW = Math.max(screenBox.max.x - screenBox.min.x, deckBox.max.x - deckBox.min.x) / 2 * 1.04, sideP = new THREE.Vector3(tx + halfW, (deckBox.min.y + screenBox.max.y) / 2, Math.max(screenBox.max.z, deckBox.max.z));
  const tyFor = dist => { let lo = -5, hi = 10; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (svProject(botP, m, dist, tx, tz).y > nB) lo = m; else hi = m; } return (lo + hi) / 2; };   // the deck's front bottom edge on the bottom line
  let lo = .3, hi = 30;
  for (let i = 0; i < 40; i++) { const d = (lo + hi) / 2, ty = tyFor(d), fitsTop = svProject(topP, ty, d, tx, tz).y <= nT, fitsSide = svProject(sideP, ty, d, tx, tz).x <= .98; if (fitsTop && fitsSide) hi = d; else lo = d; }
  const dist = hi; return { target: new THREE.Vector3(tx, tyFor(dist), tz), dist, pitch: SV_PITCH };
}
function setView(v) { view = v; document.body.classList.toggle('sv', v === 'screen'); $('vCab').setAttribute('aria-pressed', String(v === 'cabinet')); $('vScr').setAttribute('aria-pressed', String(v === 'screen')); if (v === 'screen') { const sgoal = screenGoal(); goal.yaw = 0; goal.pitch = sgoal.pitch; goal.dist = sgoal.dist; goal.target.copy(sgoal.target); } else { goal.yaw = .3; goal.pitch = .12; goal.dist = fitDist(true); goal.target.set(0, 1.45, 0); } }
```

### A.9 The pack entry (`pack.json`)

One object in the same format as every machine in the room's `window.PX_MACHINE_PACKS` list: `{ name, description, color, accent, model, game, css }`. `model` is the cabinet JSON (A.7) and `game` is the whole game page (A.4), each gzip (level 9) then base64; `color` and `accent` are CSS hex colours; `css` is a string of any extra styles the room panel needs (may be empty). The build script round-trips it (decode, compare to the source page, parse the model, check the four model keys), checks the five patched texts of A.4 appear once each, and checks the model has every required part and the five deck actions of A.7. A machine's position in the list is its `type`. The room's machines panel gets one button per machine with `data-machine-type`, a colour pair, a title and a one-line subtitle, plus a floor glow colour and a floor position.

### A.10 The return simulator

Runs the engine as shipped, seeded, plays every bonus to completion, counts paid spins only and reports the return by part against 94.38%. Run it as `node rtp.mjs 5000000 20261102` from a folder where `../src/engine.js` is the engine file of A.1 (or change the path). Expect 94.38% within about 0.3%; two different seeds should straddle it. It exits non-zero when out of tolerance. Adapt the labels in the `frequency` object to the machine's own bonus names.

```js
// Seeded return-to-player check on the exact engine DOG Army ships (src/engine.js, the Block Fortune v2 engine).
//   node tools/rtp.mjs [spins=5000000] [seed=20261102]
// Plays every bonus to completion (Dog Tags flips three tags; prizes are independent so which three doesn't matter),
// counts paid spins only, and reports the return by part against the published 94.38%.
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const BF = require(join(dirname(fileURLToPath(import.meta.url)), '../src/engine.js'));
const N = Number(process.argv[2] || 5e6), SEED = Number(process.argv[3] || 20261102);
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED), rng = n => Math.floor(rnd() * n);
const st = BF.fresh(); st.balance = 1e15; st.bet = 100;
const parts = { lines: 0, scatters: 0, free: 0, pick: 0, hold: 0, jackpot: 0 }, trig = { free: 0, vault: 0, chain: 0, jackpot: 0 };
let paid = 0; const t0 = Date.now();
while (paid < N) {
  const freeSpin = st.free > 0; if (!freeSpin) paid++;
  BF.start(st, rng); const r = BF.settle(st);
  if (freeSpin) parts.free += r.total - r.jackpotWin;
  else { parts.lines += r.lineTotal; parts.scatters += r.scatterPay; if (r.triggers.free) trig.free++; if (r.triggers.vault) trig.vault++; if (r.triggers.chain) trig.chain++; }
  parts.jackpot += r.jackpotWin; if (r.jackpotWin) trig.jackpot++;
  // Bonuses landed during free spins count towards free spins, as in the published breakdown.
  while (st.features.length) { const f = BF.feature(st), inFree = f.free; if (f.type === 'vault') { BF.pick(st, 0); BF.pick(st, 1); BF.pick(st, 2); } else while (BF.respin(st)); const c = BF.collect(st), base = c.amount - c.jackpotWin; if (inFree) parts.free += base; else if (c.type === 'vault') parts.pick += base; else parts.hold += base; parts.jackpot += c.jackpotWin; if (c.jackpotWin) trig.jackpot++; }
  if (st.freeActive && !st.free) BF.endFree(st);
  st.history.length = 0; st.gamble = 0;
}
const pct = v => (v / st.wagered * 100).toFixed(3) + '%', rtp = st.paidOut / st.wagered * 100;
const out = { spins: N, seed: SEED, seconds: (Date.now() - t0) / 1000, rtp: +rtp.toFixed(4), target: 94.38, withinTolerance: Math.abs(rtp - 94.38) <= .3,
  parts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, pct(v)])), published: { lines: '59.7%', scatters: '1.5%', free: '8.5%', pick: '11.9%', hold: '10.3%', jackpot: '2.4%' },
  frequency: { airdrop: `1 in ${(N / trig.free).toFixed(1)}`, dogTags: `1 in ${(N / trig.vault).toFixed(1)}`, march: `1 in ${(N / trig.chain).toFixed(1)}`, jackpots: trig.jackpot } };
console.log(JSON.stringify(out, null, 2));
if (!out.withinTolerance) process.exit(1);
```

### A.11 The check recipes

Write these with Playwright (headless Chromium with software rendering is fine) against a local static server, and keep every result in a results folder.

- **Five-size screen-view test, pass or fail.** For each of 1440×900, 1366×768, 1024×768, 390×844 and 844×390: open the test page, switch to the screen view, wait for the camera to settle, then assert from the page (expose a function that projects `screenBox`'s top edge and each deck button's box to pixels): the top of the screen is below the top bar, every deck button's box is inside the window and above the controls strip, and clicking each deck button (by its projected centre) fires its action. Screenshot each size.
- **Touch targets and scrolling.** At 390×844 (mobile emulation, touch, device scale 2): list every visible button with its width and height and fail if any is under 44 px; fail if `document.documentElement.scrollWidth > innerWidth + 1`. Repeat at 1440×900.
- **Deck check.** Bet up goes 100 to 200 and back, the deck labels read the machine's own names in order, and the spin cap starts a spin.
- **Lab, every item.** Run each item of the Lab through all four stages, taking a screenshot at each stage; then Run all. Re-read the scene after every screenshot and finish any real bonus before starting a Lab item.
- **Skip totals.** For free spins, the hold-and-respin bonus and the full-grid run, play it out and record the total; run the same seed with Skip and require the same total (DOG Army's were 1,600, 1,340 and 54,302).
- **Reduced motion.** With reduced motion on, count particles through a whole jackpot: at most 3.
- **Reload mid-spin.** Reload during a spin: it settles once, with the same round id, and the balance changes once.
- **Lab isolation.** Record balance, the five jackpot meters, the fund and the spin count; run Lab items and the preview; require them unchanged.
- **Fullscreen session.** At 1366×900 and at 390×844 with touch: enter fullscreen, then using only the bottom bar spin, change the bet, start and stop Auto, toggle Turbo and Sound, open and close every panel (pays, fair play, history, fund, settings, lab and test where available), play the gamble and every bonus, then exit. Record each step.
- **Software rendering note.** Headless Chromium can mis-composite a fully opaque fixed bar over WebGL; use a near-opaque colour. Say in the results that the checks ran in software rendering and that a real-GPU pass in Safari and Chrome is owed.
