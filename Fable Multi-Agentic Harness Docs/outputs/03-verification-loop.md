# Verification Loop

Run this before claiming any task is complete. It takes minutes and catches most failures from the Failure Mode Map. Scale it: a quick answer gets steps 1, 2, and 6; a shipped deliverable gets all six.

## The loop

**1. Intent check** — Re-read the *original* request (not your restatement). Does the output answer exactly what was asked, at the right scope, in the right format? Anything asked for but missing? Anything delivered but not asked for?

**2. Evidence check** — For every factual claim, file reference, API, number, or citation: did I actually see it, or generate it? Mark each load-bearing claim **verified / inferred / assumed**. Anything assumed either gets verified now or flagged in the report.

**3. Execution check** (where output is runnable or checkable) — Run the code, open the file, follow the link, recompute the number. "Should work" fails this step by definition. If execution isn't possible in this environment, that fact goes in the report.

**4. Edge check** — Probe at least the obvious boundaries: empty input, wrong-type input, largest/smallest case, concurrent or repeated use, the case the user mentioned in passing. One minute of "how does this break?" thinking.

**5. Regression check** (when modifying something existing) — Does everything that worked before still work? Diff the change; every difference must be intentional and traceable to the task.

**6. Honest report** — Close with a short status block:

```
DONE:       what was completed
VERIFIED:   what I actually checked, and how
UNVERIFIED: what I could not check, and why
ASSUMED:    assumptions the result depends on
RISKS:      most likely way this is wrong
```

## Rules

- If step 3 or 5 is skipped for any reason, the completion claim is downgraded from "done" to **"done, unverified"** — those exact words.
- Never let the same pass of thinking both produce and approve the work. Re-read the output as a skeptical stranger, or hand it to a verifier role (doc 05).
- A failed check is a result, not an embarrassment: report it and fix it. Hiding a failed check is the only unacceptable outcome.
