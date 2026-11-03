# The improvement loop

One change per run. Each run leaves the claim flow measurably simpler or leaves it alone. Changes arrive as a pull
request for Jim to review and merge; nothing merges itself.

## Each run

1. **Build and measure.** Build the wallet frame and the radio page (see README), run `npm run claim-harness -- --diag`.
   If the baseline numbers moved with no code change, say so and stop: the harness itself is broken.
2. **Pick the one thing to fix**, in this order:
   1. a scenario that makes more than one passkey for one person
   2. a scenario that never reaches playable
   3. a crypto word a listener has to read (`jargon`)
   4. the highest-cost clean path (taps and prompts)
3. **Write the scenario first** if the problem is a mess the harness cannot yet reproduce (a new bug report, something
   seen on a phone). Run it, watch it fail, commit it. Never change a scenario to make a number look better.
4. **Make the smallest change that fixes it.** Add a unit test that pins the rule next to the code (the engine's rules
   live in `src/listening-wallet/frame/__tests__/`). Run `npx vitest run src/listening-wallet src/lib/listening-wallet src/radio-ppp`.
5. **Re-run the harness.** The score must fall, no scenario may get more passkeys or stop being playable.
   `npm run claim-harness -- --update-baseline` to accept.
6. **Write the LOG.md entry**: the problem in one sentence, before/after for the scenarios that moved, trade-offs,
   whether the wallet box must be redeployed (frame changes do: `npm run build:listening-wallet` then the wrangler
   Pages deploy), and **what to try on a real phone** because the harness cannot see real WebKit.
7. **Open a PR** with the LOG entry as its description. Do not merge it.

## Hard rules

- Never weaken the PRF rule (docs/PASSKEY-WALLET.md §3.1): no wallet address is shown or funded before two matching
  PRF results. If a change needs that rule relaxed, it goes in BACKLOG.md under "Decisions for Jim" and is not built.
- Never use a personal, hot, deployer or sponsor wallet; the harness uses only mocks and virtual passkeys.
- A change to what a listener is told or asked (wording, steps, which button is first) is a product decision. Build it
  only when BACKLOG.md says Jim chose it; otherwise add it to "Decisions for Jim" with the number it would move.
- One change per PR. If the harness is flaky on a scenario, fix the harness first and say so in LOG.md.
- Stop when `Open problems` is empty and the last three runs found nothing worth changing; say so and wait for new
  scenarios from real reports.
