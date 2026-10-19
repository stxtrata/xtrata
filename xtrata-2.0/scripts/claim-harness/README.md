# Claim-flow harness

Measures what a first-time listener has to do between tapping a free-album link and being able to play it, and
keeps that number going down. It drives the real radio page and the real wallet frame in Chromium with a virtual
passkey; the server, the gift treasury and the chain are mocked, so nothing is ever signed or broadcast (AGENTS.md).

```
VITE_LISTENING_WALLET_PARENTS=https://radio.xtrata.test npm run build:listening-wallet && npm run build:radio-ppp
npm run claim-harness                      # all scenarios, scoreboard, fails on a regression
npm run claim-harness -- first-claim       # one scenario
npm run claim-harness -- --diag --shots    # also print where each person ended up, and keep screenshots
npm run claim-harness -- --update-baseline # accept the numbers once nothing got worse
```

Needs a Chromium: `npx playwright install chromium`, or point `CHROME_PATH` at one. Scenarios run four at a time
(`CLAIM_HARNESS_JOBS`). The whole set takes about three minutes.

## What it measures (per scenario, lower is better)

| metric | meaning |
| --- | --- |
| `taps` | taps the person made (page, wallet box, the phone's second tab, picking from the passkey list) |
| `prompts` | times the device itself asked for Face ID / fingerprint (passkey made or used) |
| `passkeys` | passkeys **made** for this one person. Must be 1. Counted as they are made, so a passkey that a later step hides or replaces still counts |
| `panels` | different questions the wallet box put to them |
| `jargon` | crypto words on screen (STX, wallet, on-chain, seed, address, Stacks, gas, blockchain, crypto). "passkey" is allowed: the phone says it itself |
| `playable` | the claim went through and the album's plays are showing |
| `score` | `taps + prompts + jargon + 10 × extra passkeys + 50 if never playable` |

The chain is instant here: the harness measures what the listener must **do**, not how long a block takes (about a
minute in real life; see BACKLOG.md for how to watch that on a live canary).

## Scenarios (scenarios/index.mjs)

Each is a real way people end up with a gift link, and says why it exists. The messy ones are the point: a clean claim
is the floor, the mess is where passkeys get duplicated.

- `first-claim`, `first-claim-albumpage`: brand-new desktop listener, in the normal player and in the Album First page
- `reload-after-create`, `close-panel-after-create`: the passkey exists, then the page reloads or the panel is closed
- `prompt-fails-then-works`: control. Face ID fails once on the check and works on retry (must stay at one passkey)
- `second-album-same-device`: one passkey must hold many albums
- `storage-lost-then-second-album`: the browser forgot the wallet but the passkey is still in the password manager
- `iphone-first-claim`, `iphone-reload-while-in-new-tab`: WebKit rules, passkey made in a second tab; phone discards the tab

## The ratchet

`baseline.json` is the committed scoreboard. A run fails if any scenario gets **more passkeys** or a **worse score**, or
stops being playable. Taps, prompts, panels and jargon may rise as a trade-off while the score still falls; the run
prints them under "Trade-offs" and the change's entry in LOG.md must say why. `--update-baseline` refuses while
anything is worse. Scenarios are never edited to make a number look better: when reality shows a new mess, add a
scenario for it first and let it fail.

## What it cannot see

- **Real WebKit.** iPhone is Chromium wearing Safari's user agent, with the "new tab" modelled as a full-screen wallet
  page in the same tab (Chromium's virtual passkeys belong to one tab). Real iOS tab discarding, iCloud sync timing and
  Stolen Device Protection are modelled only by the reload and failed-prompt scenarios. Anything that changes the
  iPhone path must be tried on a real phone (docs/radio/ iPhone notes in the Xtrata Music project).
- Apps' built-in browsers (Instagram, X), real Face ID timing, real chain delays, the Turnstile check.
- The picker people see when several passkeys exist: the harness's person always picks the newest and counts that as a tap.

## Layout

```
run.mjs            runner, scoreboard and ratchet
lib/world.mjs      Chromium, mocked server and chain, virtual passkey, device profiles
lib/person.mjs     the person: looks at the screen, does the obvious thing, counts every tap and every crypto word
lib/measure.mjs    events → numbers
scenarios/         the scenarios
baseline.json      the ratchet
LOG.md             one entry per change: before/after, trade-offs, what to check on a real phone
LOOP.md            how an agent runs this daily, one change at a time
BACKLOG.md         ranked ideas, with the decisions only a person can make
```
