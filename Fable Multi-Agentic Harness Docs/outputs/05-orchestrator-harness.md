# Orchestrator Harness

A generic pattern for running multiple AI agents (or multiple sessions of one model) on a project. One agent leads; others fill roles. Works with any mix of models.

## Core idea

The orchestrator never does the work — it decomposes, routes, checks handoffs, and integrates. Every worker gets a self-contained brief and returns a structured result. Quality comes from separating **creation** from **criticism** from **verification**: never let the same agent do all three on the same artifact.

## Roles

| Role | Job | Use when |
|---|---|---|
| **Orchestrator** | Decompose goal, write briefs, route to roles, track state, integrate results, decide "done" | Always — it's the spine |
| **Researcher** | Gather facts, sources, prior art, constraints; report with citations and confidence | Before planning anything with external unknowns |
| **Implementer** | Produce the artifact (code, doc, design) per brief; minimal scope; reports assumptions | Every build step |
| **Critic** | Attack the plan or artifact: find flaws, gaps, risks, simpler alternatives. Finds problems, doesn't fix them | After planning; after major artifacts |
| **Verifier** | Run the Verification Loop (doc 03) against the original brief: execute, test, check evidence | Before anything is accepted |
| **Debugger** | Reproduce, isolate root cause, propose minimal fix | When verification fails or bugs surface |
| **Documenter** | Record what was built, why, decisions, usage | After acceptance, before final edit |
| **UX reviewer** | Judge the artifact from the end-user's seat: clarity, friction, missing states | User-facing artifacts |
| **Final editor** | Polish, cut bloat, unify tone, format for delivery | Last step only |

## Standard order of operations

```
1. Orchestrator: restate goal, list unknowns, decompose into steps
2. Researcher:   resolve unknowns              (skip if none)
3. Orchestrator: plan → Critic attacks plan → revise plan
4. Loop per work item:
     Implementer → Verifier → (fail? Debugger → Implementer → Verifier)
     Critic on high-stakes items before Verifier
5. UX reviewer:  on user-facing results
6. Documenter:   capture what/why
7. Final editor: polish and deliver
8. Orchestrator: final intent check vs original goal
```

Cheap insurance: criticize the *plan* (step 3) — it's far cheaper to fix a plan than an implementation.

## Handoff format

Every brief from orchestrator to worker:

```
GOAL:        one sentence
CONTEXT:     only what this role needs (files, decisions, constraints)
CONSTRAINTS: what must not change; scope limits
DELIVERABLE: exact expected output and format
DONE-WHEN:   acceptance criteria the Verifier will use
```

Every result from worker back to orchestrator:

```
RESULT:      the artifact or findings
ASSUMPTIONS: what was assumed and why
CONFIDENCE:  high / medium / low, with the weakest point named
OPEN ITEMS:  anything unresolved or out of scope
```

Workers get *briefs*, not chat history. The orchestrator owns a **state document** (goal, decisions, completed items, open items) and updates it after every handoff — this is what survives context loss and model switches.

## Rules of the harness

- One role per pass. An agent asked to "implement and also verify" will do neither well.
- The Critic and Verifier must not be the agent (ideally not even the model) that produced the work.
- Disagreement between Critic and Implementer goes to the orchestrator, resolved by evidence — never by seniority of model.
- Any role may return "cannot complete with given context" — that's a valid, useful output.
- Failed verification loops back to Debugger/Implementer, max 2–3 cycles; then the orchestrator escalates to the human rather than thrashing.
- Solo mode: one model can play all roles *sequentially in separate passes* (ideally separate sessions for critic/verifier). Weaker than true multi-agent, far stronger than a single pass.
