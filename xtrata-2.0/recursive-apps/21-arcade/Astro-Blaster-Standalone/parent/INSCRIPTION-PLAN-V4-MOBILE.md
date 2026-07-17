# Astro Blaster v4 Mobile - Parent-Only Test Plan

This release adds phone controls without changing the game, wallet, leaderboard,
or score-submission leaves. The new parent converts pointer events into the
keyboard events Astro Blaster already consumes.

## Why this is parent-only

The v2.37 game runtime already listens for:

- arrow keys: movement (up/down become useful after vertical mobility unlocks)
- Space: fire
- X: EMP
- P: pause
- R: restart

The v4 parent adds a fixed touch D-pad plus Fire, EMP, Pause, and Restart
buttons. Each held pointer owns one key until `pointerup`, `pointercancel`, or
lost capture, so movement + firing works with two fingers. All held keys are
also released on blur, page hide, or visibility loss.

The touch deck appears only after the game canvas exists and when the device
has a coarse/touch pointer or is at most 760px wide. For diagnostics, append
`?mobileControls=1` to force it on or `?mobileControls=0` to force it off on a
normal top-level page.

## Reused leaf inscriptions (do not re-inscribe)

1. styles — #69
2. utils — #70
3. highscores — #80
4. gameRuntime — #71
5. main-v3 — #2789

Only `parent/astro-blaster-parent-v4-mobile.template.html` is new. Seal it with
dependency order `[69, 70, 80, 71, 2789]`.

## Verify before minting

From `Astro-Blaster-Standalone/`:

```bash
node sandbox-test/run-harness.mjs
```

The sandbox harness runs at a 390x844 touch viewport. It verifies module boot,
wallet handshake, score contract submission, fallback runtime intent, canvas
fit, and actual pointer-to-game input for Pause, Move, Fire, and EMP.

Manual check:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/sandbox-test/host.html` from a phone on the same
network, or use mobile emulation. Start the game and verify that simultaneous
movement + Fire remains responsive and that rotating the phone does not leave
a direction held.

## Prepare and mint the new parent

The IDs are already filled, but this command validates and records them in the
dedicated v4 manifest:

```bash
node parent/fill-inscription-ids.mjs \
  --manifest parent/astro-blaster-mobile-v4.inscription-manifest.json \
  --template parent/astro-blaster-parent-v4-mobile.template.html \
  --styles 69 --utils 70 --highscores 80 --game-runtime 71 --main 2789
```

Inscribe the v4 HTML as `text/html`, seal it recursively with dependencies
`[69, 70, 80, 71, 2789]`, then record the new parent ID:

```bash
node parent/fill-inscription-ids.mjs \
  --manifest parent/astro-blaster-mobile-v4.inscription-manifest.json \
  --template parent/astro-blaster-parent-v4-mobile.template.html \
  --parent <PARENT_V4_MOBILE_ID>
```

Use this as a separate test parent first. The score contract remains
`xtrata-arcade-scores-v1-3`, so existing leaderboard entries and wallet flows
are shared with the desktop parent.
