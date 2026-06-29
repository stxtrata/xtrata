# Xtrata Agent One — Progressive Hardening (agentic-first → deterministic)

The north star: **start each capability as an agentic flow, then replace as much
of it as possible with deterministic, hardened code** — until the system keeps the
*feel* of an agent but the substance is mostly verifiable code. The LLM is
scaffolding we deliberately remove, not a permanent dependency.

Build every flow with this end-state in mind from the start.

## Why

- **Safety:** money-touching and irreversible actions must be predictable, capped,
  and testable — not at the mercy of a model's judgement.
- **Cost & speed:** deterministic code is zero-inference — cheap, fast, reproducible.
- **Auditability:** deterministic branches can be unit-tested and replayed; agentic
  ones can't be fully.
- **The feel stays:** natural-language UX and good defaults make it *feel* agentic
  even when a state machine is doing the work.

## Rules to apply from day one

1. **Model every flow as an explicit state machine** with enumerated states and
   transitions (the service and the runways already do this). Deterministic code
   can then take ownership of transitions one at a time without disturbing the rest.
2. **Railroad user input into multiple-choice.** Wherever a decision is needed,
   present a small set of validated options (AskUserQuestion-style) rather than
   free text. Free text only where genuinely unavoidable — and then immediately
   normalise it into an enumerated value. Enumerable inputs = test-coverable
   branches = deterministic handling.
3. **Keep the model out of the spend/sign/irreversible path — permanently.**
   Signing, fees, seal, key handling, transfers are deterministic, capped, and
   confirmed from the first version. The agent may *propose*; deterministic code
   *disposes*. (Already true across the loops.)
4. **Classify every step** as `agentic` (provisional), `hybrid`, or `deterministic`
   (hardened), and track the mix. The roadmap is to migrate agentic → deterministic.
5. **Graduation criteria** (when an agentic step becomes code): its input space is
   enumerable, its branches are known and handled, edge cases are covered, and
   tests exist. Then swap the LLM call for code behind the *same state-machine
   contract*, so nothing downstream changes.
6. **Log every decision + input as structured data.** An agentic run then becomes a
   deterministic test fixture — the cheapest path from "model did it" to "code does it".
7. **Idempotent, resumable, pure where possible.** Each step checks state first and
   can re-run safely (the runways already do). Pure functions are trivially testable.
8. **Reserve the model for genuinely open-ended work** — content authoring, fuzzy
   triage, natural-language explanation — and even then put a deterministic
   validation gate before any irreversible action.

## How to annotate flows

Tag each step with its hardening status so progress is visible, e.g.:

```
[D] quote file            deterministic (chunk + on-chain quote)
[D] generate deposit wallet deterministic (BIP-39)
[A] gather file/uri/intent  agentic now -> railroad to multiple-choice -> [D]
[D] watch deposit          deterministic (poll balance)
[D] inscribe / deliver / refund / wipe  deterministic (the runway + transfers)
```

`[A]` agentic · `[H]` hybrid · `[D]` deterministic. The goal is to move `[A]` → `[D]`.

## Target shape

- A thin agentic shell for conversation, intent capture (as multiple-choice), and
  explanation.
- A deterministic core state machine that owns every validated transition,
  especially anything that spends, signs, or is irreversible.
- The user is guided by constrained choices into channels the deterministic code
  fully handles — "railroaded appropriately" — so there are no un-handled branches.

Build new modules already split this way: agentic shell on top, deterministic state
machine underneath, and a written list of which `[A]` steps are slated to become `[D]`.
