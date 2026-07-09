# Model Routing Guide

Route by *task shape*, not brand. Model names change; these classes don't.

## Model classes

- **Fast/cheap** (small or "mini/flash/haiku-class" models, fast local models) — high volume, low stakes.
- **Frontier reasoning** (largest current models, extended-thinking modes) — hard thinking, high stakes.
- **Coding-tuned** (agentic coding models/tools) — implementation inside real codebases.
- **Long-context** (whatever currently takes the largest input well) — whole-corpus work.
- **Local/private** — anything that must not leave your machine.

## Routing table

| Task | Class | Notes |
|---|---|---|
| Scanning, triage, classification, extraction | Fast/cheap | Volume work; verify samples, not everything |
| Summarising documents | Fast/cheap → frontier | Cheap first pass; frontier only if it matters or the cheap summary reads shallow |
| Architecture, trade-offs, hard debugging, maths | Frontier reasoning | Use thinking/extended modes; this is where paying more pays back |
| Planning & decomposition (orchestrator role) | Frontier reasoning | The plan quality caps everything downstream |
| Writing/refactoring code | Coding-tuned | Pair with playbook (doc 04) |
| Boilerplate, small scripts, regex, config | Fast/cheap | Escalate if it fails twice |
| Ideation, naming, creative drafts | Whichever writes best for you, high temperature/variety | Generate wide with cheap models, select with a strong one |
| Critique & verification | A *different* model than the producer | Diversity of failure modes is the point; a strong verifier on weak output beats the reverse |
| Research with sources | Search-enabled model | Then evidence-check the citations |
| Whole-repo / book-length input | Long-context | Still quiz it on mid-document details |
| Sensitive/private data | Local/private | Accept the capability hit; verify harder |
| Final editing & polish | Strong writing model | Last pass only |

## Routing rules

1. **Start cheap, escalate on failure.** If a cheap model fails the same task twice, stop retrying — route up. Retrying a failing model burns more than escalating.
2. **Match spend to stakes, not difficulty.** A trivial task in a critical path deserves a strong model; a hard task in a throwaway experiment doesn't.
3. **Producer ≠ verifier.** Cross-model checking catches correlated blind spots that same-model self-review misses.
4. **Don't route mid-artifact.** Switching models mid-deliverable loses context; hand off at clean boundaries with a brief (doc 05 format).
5. **Benchmark on your own tasks.** Keep 3–5 personal test prompts (one coding, one reasoning, one writing, one extraction). Run them when a new model appears; update this table from results, not from launch marketing.
