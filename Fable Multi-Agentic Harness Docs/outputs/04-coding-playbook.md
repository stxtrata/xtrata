# Coding Playbook Rules

Practical rules for AI on coding projects. Applies to any model, any codebase, any language.

## 1. Inspect first
- Read the relevant code before proposing changes. Never edit from memory of "how such code usually looks".
- Before touching anything: identify how the code is run, how it's tested, and what depends on the part you're changing.
- If you can't see a file you need, say so and ask — don't reconstruct it from imagination.

## 2. Reproduce before fixing
- For bugs: reproduce the failure (or at minimum, trace the exact failing path in the code) before writing a fix. A fix for an unreproduced bug is a guess.
- State the diagnosed root cause in one sentence. If you can't, you're not ready to fix.

## 3. Minimal diff
- Change only what the task requires. No drive-by renames, reformatting, restructuring, or style "improvements".
- If you notice unrelated problems, list them separately — don't fix them in the same change.
- One task, one change set. Big diff for a small task means something went wrong.

## 4. Preserve working behaviour
- Existing behaviour is the spec unless the task says otherwise. Odd-looking code may be load-bearing; understand why it exists before removing it.
- Keep public interfaces, formats, and side effects stable unless the task is to change them.
- Prefer extending over rewriting. A rewrite requires explicit agreement, never a unilateral decision.

## 5. Test what you change
- Run the existing tests before and after. If tests exist and you didn't run them, say so.
- Add or update a test that captures the change — especially for bug fixes (the test that would have caught the bug).
- No test infrastructure available? Then manually exercise the changed path and report exactly what you ran.

## 6. Fail loudly
- Don't swallow errors, add silent fallbacks, or return fake success. If a dependency, file, or command fails, surface it.
- Never fabricate command output, test results, or file contents.

## 7. Document the change
- Every change ships with: what changed, why, what was verified, and any assumptions or follow-ups. Three to six lines is usually enough.
- Update comments/docs that the change made wrong. Don't add comment noise to unchanged code.

## 8. Separate implementation from verification
- Whoever (or whichever pass) wrote the code doesn't get the final word on whether it works. Verify in a distinct step: fresh read of the diff, run of the tests, check against the Verification Loop (doc 03).
- In multi-agent setups, implementer and verifier are different roles by design (doc 05).

## 9. Manage context deliberately
- On long coding sessions, maintain a short state note: goal, decisions, files touched, remaining work. Refresh it into new sessions rather than replaying full history.
- After context loss or a new session, re-inspect before continuing — the codebase may have moved.

## 10. Security and dependencies
- Don't add dependencies for what the standard library or existing deps already do. New dependency = named justification.
- Treat all external input as hostile by default. Never hardcode secrets. Flag, don't silently "fix", anything that looks like a security issue.
