# Testnet rehearsal: result (2026-10-19)

Run on the public Stacks testnet from disposable wallets only (admin wallet and mainnet untouched). Transactions were signed offline in the workspace (`relay.mjs`) and sent through a browser pane, because the workspace cannot reach the node itself.

| | Address |
|---|---|
| Deployer / testnet admin | `ST3N1VYG563049PE8C2Z24QY6ANW222Y1TQG583X9` |
| Disposable publisher | `ST18222E20QGZPCEAJ7W88G9EGZJNVFCGZBRQG0F3` |
| `mock-xtrata-core` | `ST3N1VYG...583X9.mock-xtrata-core` (tx `83343a49`) |
| `xtrata-posters-v1` | `ST3N1VYG...583X9.xtrata-posters-v1` (tx `638cf981`) |
| `xtrata-world-v1` | `ST3N1VYG...583X9.xtrata-world-v1` (tx `0ae39e67`) |

## What ran, and the outcome

| Step | Result |
|---|---|
| Deploy the three contracts (Clarity 4, one address, in order) | All `(ok true)`, same burn block |
| Fund publisher with 20 test STX | ok |
| Register 22 built-in looks | Ids u0..u21, identical to the hall's `defaultLookBook` |
| Register rooms `arcade-hall` (2 bays) and `lobby` (2 bays) | ok. Note: the hall now has four bays, and a room's bay count cannot be changed after registration, so this testnet `arcade-hall` has only bays 0 and 1. Mainnet will register it with 4. |
| `set-publisher` on both contracts | ok |
| `add-scenes` with 4 scenes (curtain/sign/sounds/light, knock door, enter door linked to lobby, posters bay) | `(ok u4)`; timeline, `get-bay` and `get-scene` read back as submitted |
| 3 admin posters (core) + 7 publisher posters (community) | `(ok u3)`, `(ok u7)`; all 10 in `get-live` |
| Review lane on, publisher posts | Poster #10 stored hidden and absent from `get-live` |
| Admin `release-posters [10]` | #10 appears in `get-live` |
| Pause the world contract | Publisher `add-scene` refused `u201`; admin `add-scene` still works (by design) |
| Unpause; publisher `add-scene` | `u200` (publishers cannot write rooms they do not own: correct) |
| Revert bay 0 to posters | `(ok u3)`; `get-bay` shows scene #3, base posters |
| Retract a scheduled scene | `(ok true)`; it leaves the bay's timeline (so it can never start), and its record stays readable, marked retracted |
| Kill switch (`ops/KILL`) | `REFUSED: kill switch is on`, exit 2, nothing signed |

## Things the rehearsal taught us

1. **Posters min-gap is counted in burn blocks.** A publisher's second write inside the same burn block fails `u109` (the admin is exempt from this gap, publishers are not). A burn block is about 10 minutes, so a bot must leave at least one burn block between runs (it already sends one batch per run). Not a contract bug.
2. **Revert does not cancel later scheduled scenes.** The revert scene starts "now", but a scene already scheduled for later still takes over when its time comes. To stop the story, retract the later scenes as well (the revert tool already prints this note). Verified: retract works.
3. **Scene times are burn heights.** On testnet only two burn blocks passed in about 25 minutes; Stacks blocks (seconds) are not what the scene timeline counts. Rehearsal scene offsets should be a few burn blocks.
4. **Pause stops publishers and room owners, not the admin.** So the admin can still revert or retract while paused, which is what you want in an emergency.
5. **Costs:** 3 deploys at 2 STX plus about 40 calls at 0.03 STX, so roughly 7.2 STX of the 500 test STX.

## Not yet done

- Watch scene #1 (starts at burn block 29228) go live on its own.
- View the testnet contracts inside the real hall (`view.mjs` page); the workspace browser cannot reach testnet.
- Real-GPU frame rate, sounds, touch, and the admin wallet extension signing flow (all unchanged from before).

## Four-bay room on testnet (2026-10-19)

The first testnet room (`arcade-hall`) was registered with 2 bays, and a room's bay count cannot change, so a second room, `arcade-hall-4`, was registered with 4 bays to test the real hall layout. Same disposable admin wallet, same contracts.

| Step | Result |
| --- | --- |
| `register-room arcade-hall-4` (4 bays) | `(ok true)`, tx `cc7ba26e839fd12d2447753e35e84fa5a4fbe968c69656e3645aaca6914a1e22`, burn block 29232 |
| `add-scenes` with 4 scenes (one per bay) | `(ok u4)`, tx `38b20d6f4d7c2d0fefa0909be31337085d12f30fc617683b55c218016c851b6e`, burn block 29232 |
| Right after confirming | `get-bays` showed nothing active, first start at 29234 |
| At burn block 29240 | All four bays active with seq 0, no signing after the scheduling call |

What each bay showed once live (read back from the contract): bay 0 far left a closed curtain with a "coming soon" sign (peek, from 29234); bay 1 far right an arch door, knock, "staff only" (29234); bay 2 near left a gothic door, enter, "lobby", linked to the lobby room (29237); bay 3 near right a wall, no interaction, "new room" sign with a pulsing light (29240).

Also confirmed: scene seq 1 on `arcade-hall` bay 0 (knock door, scheduled for 29228) went live by itself and was the active scene at 29240.

Not covered: seeing these in the real hall page (the hall cannot be pointed at testnet from the build sandbox).
