# Xtrata AI development guide

Canonical workflow for AI-assisted development, introduced for Astra 6.2.
This is a working agreement, not a claim about model benchmarks or a guarantee
against mistakes. Apply it with the applicable AGENTS.md files and the user's
current instructions. User instructions determine task scope and authorization.

## Start here

Read this guide before a new task, once per session unless it changes or context
is lost. Read the relevant project instructions and references before editing.
For Audionaut, also read [the supplement](xtrata-2.0/AUDIONAUT_AI_GUIDE.md).
Scale the process to the task: a label edit does not need an architecture review.

## Short prompts are enough

The user may describe work briefly, conversationally, with typos or incomplete
technical detail. Do not require them to write an engineering specification.
Use the conversation and repository to translate intent into a practical task.

- For a request to fix or build something, investigate, implement, integrate and
  verify it. Do not stop at a plan or an offer to do the requested work.
- For a question, review, proposal or planning-only request, deliver that result;
  do not turn it into unauthorized implementation.
- Infer ordinary technical details from the code. State material, reversible
  assumptions and proceed. Do not invent product requirements.
- Ask a focused question when different interpretations would materially change
  correctness, scope, data compatibility or authorization. Continue independent
  work while a necessary answer is pending.
- Keep existing authorization across turns. A progress question or clarification
  does not cancel the original objective unless the user says so.

For substantial tasks, briefly state the intended outcome, target app/version
and a few observable acceptance criteria. This is a progress update, not an
approval checkpoint. For small tasks, keep this to a sentence.

## Establish what is actually present

1. Confirm the repository, branch, working-tree changes and target surface.
   Preserve unrelated work; stage only files belonging to the task.
2. Trace the relevant implementation, callers, data formats and existing tests.
   Identify source files, generated output and any deployed/inscribed variants.
3. Read the relevant references. Treat old plans and remembered facts as leads
   to verify, not proof of current behaviour.
4. Reproduce reported defects where possible. Separate observed behaviour from
   a suspected cause. If reproduction is unavailable, state the limitation.

### Missing-context procedure

When a required file is absent, check whether it is excluded by sparse checkout
before declaring it missing. From the repository root, for example:

```sh
git ls-tree HEAD xtrata-2.0/docs/app-reference.md
git show HEAD:xtrata-2.0/docs/app-reference.md
```

Use the working-tree version when available, since it may include local edits.
Label a Git fallback as the version at HEAD. Do not silently read another branch
as if it describes the current work. If a Git object is unavailable locally,
report that rather than assuming the document does not exist.

If information remains unavailable, report what is missing, what was checked,
the effect on the task, and the safe next step. Continue work that does not
depend on it. Ask only for decisions or information genuinely needed to proceed.
Never claim to have read a missing reference or fabricate an interface, contract
address, fee, test result or environment capability.

## Complete the requested behaviour

- Reuse suitable existing modules and conventions. Preserve behaviour relied on
  by callers, saved projects, caches and external integrations.
- Keep changes focused. Do not silently substitute a prototype, stub, reduced
  feature or future-work note for required integration.
- Follow project-specific rules for protocol flows, wallets, caching, layout,
  tests and documentation. Verify live values when a task depends on them.
- For visual changes, use the existing interface or supplied references to guide
  layout, typography and interaction. Inspect the result at relevant sizes.
- Continue through routine obstacles with bounded diagnosis and alternatives.
  Do not repeat the same failing approach indefinitely.
- Report material blockers when found. Distinguish an implementation defect,
  an environment limitation, a pre-existing failure and a missing user decision.

Follow existing rules for commits, pushing, deployment and wallet operations.
This guide grants no additional authority to spend funds, sign transactions,
publish changes, destroy data or use personal wallets for testing.

## Verify with evidence

Choose checks that exercise the changed behaviour and likely failure modes.
Run repository-required checks and add regression coverage where required or
where existing coverage misses the concrete risk. Avoid tests that merely repeat
the implementation or unrelated test expansion.

- A build passing proves build success; it does not prove a user interaction works.
- A simulated wallet test does not prove a live transaction succeeded.
- A local change is not automatically committed, pushed, merged or deployed.
- A skipped, timed-out or unavailable check is not a passing check.
- Do not weaken assertions or remove coverage simply to obtain a passing result.

Exercise UI interactions when tools are available. For data changes, inspect
round trips and compatibility. For network changes, cover failure/retry behaviour
as relevant. Use the Audionaut supplement for audio-specific verification.

Inspect the final diff against the acceptance criteria. Fix supported issues
within scope and repeat affected checks. Broaden testing only when risk,
repository requirements or new evidence justify it. When required work and
checks are complete, finish; do not invent improvements to prolong the task.

## Report completion clearly

Keep the final report self-contained and proportional to the task. Cover:

- What changed and the resulting user-visible behaviour.
- What was verified, with commands or other concrete evidence where useful.
- Failed, skipped or unavailable checks and their practical consequences.
- Any remaining work, material assumption or decision needed from the user.
- Commit and publication status when relevant.

For a substantial task, account for each acceptance criterion as **verified**,
**failed** or **unverified**. Implemented but unverified work must remain labelled
as such. Keep explanations concise without reducing implementation completeness
or hiding uncertainty. Do not end by offering to do an authorized remaining step
that can be completed now.

## Prompt examples for the user

You can continue writing naturally. Adding the desired result or an example of
the failure helps more than repeating this guide or asking the model to try harder.

**Normal development:**

> Follow AGENTS.md and AI_DEVELOPMENT_GUIDE.md. Fix [problem] in [surface].
> I want [observable result]. Investigate, implement and verify it.

**A very short request, once the context is clear:**

> The instrument settings disappear when I reopen the song. Please fix it.

The agent should identify the save/load path, preserve older projects, implement
the fix and verify the round trip without requiring a detailed prompt from you.

**Creative work with compatibility requirements:**

> Create [feature] in Audionaut Beta Pro using the existing framework. You can
> choose the creative design, but preserve project compatibility and complete
> the host integration and relevant audio/UI checks.

**Review an implementation:**

> Check the current diff against the original request. Look for missing
> integration, unsupported assumptions and tests that do not exercise the change.
> Fix concrete issues within scope and rerun affected checks. Do not broaden it.

**Planning only:**

> Investigate [goal] and propose a plan with trade-offs. Do not edit code yet.

## Keeping this useful

Maintain this single canonical guide; use short links from nested AGENTS.md
files rather than copies that drift. Keep task-specific facts in the relevant
project documentation. When a real failure recurs, add a focused instruction or
regression check instead of growing every prompt. Assess success by completed
behaviour, regression rate, honest verification and fewer unnecessary follow-ups.

Tools that do not automatically discover AGENTS.md need the explicit startup
prompt above and access to the referenced files. Instructions improve the
workflow; they do not replace testing or review.
