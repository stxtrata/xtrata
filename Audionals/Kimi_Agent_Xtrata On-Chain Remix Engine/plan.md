# Plan: Xtrata.xyz Research + Revolutionary Use Case Ideation

## Goal
Research Xtrata.xyz (what the technology is, how it works, ecosystem, current traction), then produce
a high-quality report of the most innovative / revolutionary / attention-grabbing use cases and
services that could be built on Xtrata — solving real pain points and maximizing visibility.

## Stage 1 — Research (Skill: deep-research-swarm)
Load `/app/.agents/skills/deep-research-swarm/SKILL.md`. Deploy parallel research agents:
- Agent A: Core technology deep-dive — read xtrata.xyz directly (site, docs, whitepaper, GitHub),
  what Xtrata actually does (on-chain data / inscriptions / compression?), architecture, tokenomics if any.
- Agent B: Ecosystem & traction — Twitter/X presence, community, founders (note: user has prior
  context on Xtrata branding/radio design — likely a Bitcoin Ordinals/Stacks-adjacent project),
  partnerships, current products (e.g. Xtrata radio?), competitors/comparables.
- Agent C: Adjacent landscape — similar tech (Ordinals, recursive inscriptions, on-chain storage,
  Bitcoin L2 data layers, IPFS/Arweave comparisons) to identify Xtrata's unique differentiators
  and white-space opportunities.
Cross-validate findings. Output: validated research brief.

## Stage 2 — Ideation + Writing (Skill: report-writing)
Load `/app/.agents/skills/report-writing/SKILL.md`. Feed research brief to a writer agent:
- Structure: What Xtrata is (short) → why it matters → top "head-turning" use cases, each with:
  pain point solved, how Xtrata's tech uniquely enables it, why it would grab attention, feasibility.
- Include both near-term achievable demos and moonshot concepts.
- Tone: energetic, concrete, non-hype-but-exciting. Output: `.agent.final.md`.

## Stage 3 — Formatting (Skill: docx)
Load `/app/.agents/skills/docx/SKILL.md`. Convert final markdown to a polished .docx.
Deliver both .md and .docx in /mnt/agents/output/.

## Validation gates
- Stage 1→2: research brief must concretely explain Xtrata's actual tech (not guesses).
- Stage 2→3: use cases must each map to a real Xtrata capability, not generic NFT ideas.
