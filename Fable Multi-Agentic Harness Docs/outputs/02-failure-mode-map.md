# Failure Mode Map

The recurring ways AI models fail on complex work. For each: what it looks like, how to detect it, how to prevent it. Use this as a review checklist and as material for critic/verifier roles.

---

## 1. Hallucination (invented facts, APIs, files, citations)
- **Looks like:** plausible specifics that don't exist — a function name, a paper, a config option, a quote.
- **Detect:** spot-check any load-bearing specific against a real source. Suspicious signs: no source given, unusual precision, "as documented in...".
- **Prevent:** require inspection before claims (Constitution §5). Ask the model to mark verified vs assumed. For code: run it. For facts: demand the source it actually read.

## 2. Overconfidence / unflagged uncertainty
- **Looks like:** fluent, certain prose about things the model can't know; no hedging where hedging is warranted.
- **Detect:** ask "what's your confidence and why?" — a good agent can decompose it; a bluffing one repeats itself louder.
- **Prevent:** mandate confidence labels on conclusions. Reward "unverified" flags. Have a second model attack the answer.

## 3. Solving the wrong problem
- **Looks like:** technically good output that doesn't serve the actual goal; answering the literal words instead of the intent, or the intent instead of the words.
- **Detect:** compare output against the original request, not against the model's restatement. The drift usually happens in the restatement.
- **Prevent:** require goal restatement upfront and confirm it. Re-read the original ask before final delivery ("does this answer what was asked?").

## 4. Hidden assumptions
- **Looks like:** output that only works if unstated conditions hold (environment, versions, data shape, audience).
- **Detect:** ask "what did you assume?" after any deliverable. Check edge inputs.
- **Prevent:** require an explicit assumptions list on every non-trivial deliverable. Empty list is a red flag, not a good sign.

## 5. Over-refactoring / scope creep
- **Looks like:** asked for a bug fix, got a rewrite; renamed variables, restructured files, "improved" style; diff far bigger than the task.
- **Detect:** diff size vs task size. Any change not traceable to the request is creep.
- **Prevent:** rule: change only what the task requires (Playbook §3). Require the model to list every changed file/section with a reason.

## 6. Context loss / drift in long sessions
- **Looks like:** forgetting earlier decisions, re-introducing rejected ideas, contradicting earlier constraints, losing the thread mid-project.
- **Detect:** contradictions with earlier session content; the model re-asking settled questions.
- **Prevent:** maintain a short living summary (decisions, constraints, open items) and re-paste it at intervals or into fresh sessions. Start long projects with a state document, not raw chat history.

## 7. Skipped verification / premature "done"
- **Looks like:** "This should now work", "All tests should pass" — untested claims of completion.
- **Detect:** the word "should". Ask "what did you actually run/check?"
- **Prevent:** Verification Loop (doc 03) is mandatory before "done". If verification is impossible, the required output is "complete but unverified", never "done".

## 8. Bloat and padding
- **Looks like:** long preambles, restated questions, filler caveats, three examples where one suffices, summaries of the summary.
- **Detect:** can 30% be deleted without losing meaning? Then it's bloated.
- **Prevent:** set output-size expectations in the prompt. Ask for the deliverable first, commentary only if needed.

## 9. Sycophancy / false agreement
- **Looks like:** the model validates a flawed plan, mirrors your stated opinion, or reverses correct positions under mild pushback.
- **Detect:** assert the opposite of what it said and watch whether it folds without new evidence.
- **Prevent:** explicitly license disagreement ("tell me if this is a bad idea and why"). Use a critic role whose only job is to find problems.

## 10. Error cascades
- **Looks like:** one early mistake (wrong assumption, misread file) silently propagates through everything downstream.
- **Detect:** when something is wrong, trace it to its earliest occurrence rather than patching the symptom.
- **Prevent:** checkpoint at step boundaries — validate step N's output before it becomes step N+1's input. Riskiest step first.

## 11. Lost-in-the-middle / incomplete reading
- **Looks like:** the model handles the start and end of long inputs but misses constraints buried in the middle; skims attached files.
- **Detect:** quiz it on a mid-document detail before relying on its summary.
- **Prevent:** put critical constraints at the top and bottom of prompts. For long documents, ask for a section-by-section pass, not a single gulp.

## 12. Tool/format failures treated as success
- **Looks like:** a failed search, empty file read, or errored command gets papered over with generated content.
- **Detect:** ask for raw tool outputs or evidence of the successful call.
- **Prevent:** rule: a failed operation must be reported as failed, never substituted with a guess.
