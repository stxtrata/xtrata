# Audionaut AI development supplement

Read [the repository guide](../AI_DEVELOPMENT_GUIDE.md) first, along with the
app-level [AGENTS.md](AGENTS.md). This supplement applies to Audionaut work across
the DAW runtime, host pages, shared helpers and integrations.

## Identify the edition and integration boundary

Resolve the requested edition from the user's request and session context:
`public/audionaut`, `public/audionaut-beta` or `public/audionaut-beta-pro`.
Do not assume that similarly named folders share implementations or that a fix
should be copied across all editions. Trace shared dependencies and change the
necessary surfaces only. Inspect host code under `src/audionaut` and
`src/audionaut-beta-pro` when relevant, plus build configuration and chain-runtime
packaging. A local runtime change does not update already-inscribed code.

### Beta and Beta Pro release policy

Keep the community Beta and Beta Pro workstation features in sync. For new
DAW behaviour, apply and verify the same relevant runtime and UI changes in
both editions, preserving their distinct browser storage namespaces, routes,
labels and build configuration. The community Beta is public without a wallet
or Audionaut NFT. Beta Pro and the original edition retain their existing
membership access policies; do not copy the public host or middleware into
those editions.

Before synth work, inspect the selected edition's registry, representative
instruments, shared voice helpers and parameter/preset handling. Use its
`daw/js/synths/README.md` as a starting point, then verify the current interfaces
in code. Do not freeze instrument counts or interface assumptions in this guide.

## Turn musical intent into observable outcomes

The user may ask for a sound or interaction in musical terms. Translate this
into implementation and listening/measurement criteria without requiring DSP
terminology from them. Keep engineering constraints explicit while preserving
creative freedom over timbre and control design.

For new instruments, trace the complete path: registration and picker, voice
creation, controls, presets, automation where supported, playback, save/reload
and cleanup. A standalone sound demo is not completed host integration.

## Select checks relevant to the change

| Changed area | Evidence to consider |
| --- | --- |
| Synthesis or DSP | Finite/non-silent output where expected, level and pitch where meaningful, parameter extremes, velocity and note lengths; compare intended character through listening if available. |
| Voice lifecycle | Note-on/off, sustain, overlapping notes, switching instruments, Stop/Panic, disposal and bounded source/timer use. |
| Transport or scheduling | Play/pause/seek/loop, tempo changes, recording timing and offline export consistency where affected. |
| Parameters or project data | Preset recall, save/reopen, undo/redo where supported, older project fixtures and edition storage isolation. |
| Interface | Actual controls and picker interactions, keyboard/pointer behaviour, focus and desktop/mobile fit. |
| Host, gate or packaging | Correct edition/build output, simulated access-state changes, runtime assets and recursive dependencies where affected. |

Do not claim to have listened when only offline measurements ran. Non-silent
output does not establish musical quality. Desktop browser emulation does not
establish behaviour on a physical phone or audio interface. State what remains
for human listening or device verification without treating it as a passed check.

## Use existing validation tools

Read the selected edition's `tools/README.md` and inspect relevant scripts before
running them. For Beta Pro, start with
[the validation reference](public/audionaut-beta-pro/tools/README.md).
It documents targeted audio, lifecycle, persistence, UI and integration checks,
as well as the combined suite. Choose targeted checks first, then the required
broader checks for the change. Use the documented working directory for each
command. Report missing browser/dependency support explicitly.

Preserve old projects and existing sounds unless the task calls for a change.
For DSP refactors intended to preserve audio, consider the existing null-test
tools with a trusted baseline where applicable. Keep generated audio and images
local under the repository's media rules. Use simulated or authorized disposable
wallet workflows for access testing; never the user's personal wallet.
