# AI Project Harness

A model-agnostic operating system for running serious projects with any AI (Claude, GPT, Gemini, local models, future models). It captures working methods, order of operations, checks, and orchestration patterns — not any model's internals.

## Files

1. **01-project-constitution.md** — Principles every agent follows on every project.
2. **02-failure-mode-map.md** — The common ways AI fails, how to detect, how to prevent.
3. **03-verification-loop.md** — The repeatable check every agent runs before saying "done".
4. **04-coding-playbook.md** — Rules for AI-assisted coding work.
5. **05-orchestrator-harness.md** — Multi-agent roles, ordering, and handoff format.
6. **06-model-routing-guide.md** — Which class of model to use for which task.
7. **07-master-prompt.md** — Compact paste-anywhere prompt that activates the harness.

## How to use

- **Single model, quick task:** paste the master prompt (07) at the start of the session.
- **Single model, serious project:** paste the master prompt, then attach or paste the constitution (01) and verification loop (03).
- **Multi-agent / orchestrated work:** the orchestrator gets 01 + 05 + 06; each worker role gets the master prompt plus the role card from 05.
- **Coding projects:** add 04 to whichever setup above you're using.

Keep the documents versioned. When a model fails in a new way, add it to 02 and, if needed, a rule to 01. The harness improves by accumulating your real failure data.
