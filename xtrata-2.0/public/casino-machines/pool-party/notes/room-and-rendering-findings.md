# Room and rendering findings

These notes carry forward the applicable DOG Army structure and record the Pool Party corrections.

- Preserve the five exact room patch anchors checked by `tools/build-pack.mjs` and `tools/check-engine.mjs`. The LAYR/account line keeps the plain `E=LAYR.machine(GAME_ID,BF)` form.
- Three r128, ACES exposure1.15, linear output match the supplied room. The packed model is scaled to2.6m tall.
- Call `updateMatrixWorld(true)` after scaling. Fit all screen/deck corners at pitch0.16, with40-iteration bisection,4% side margins and the lintel allowance. Exclude the lever from deck bounds. Observe header/footer size changes too.
- The game's screen is2800×1920 physical pixels at1400×960 logical units. Reel tile sources are480px so they stay crisp in close-up.
- Scene actions belong inside the reel window. The inherited room reserves screen y780–872 for its feature strip and y890 for turbo/gamble controls.
- Fullscreen belongs to the packed game. Lift the logic frame, request native fullscreen on the visible host document, and fall back to the fixed viewport layer when unavailable. Pause host3D rendering while fullscreen is active.
- Use one pending-action button during bonuses; a duplicate ordinary Spin key can overflow the desktop bar. Gamble choices/Collect replace it while a call is waiting. At narrow widths wrap the controls; don't cover balance/bet/win with a floating action.
- A screenshot or DOM action may take time on software GPU. Re-read the current stage after a capture before clicking, and finish an actual feature before opening a new preview. Tests must distinguish rendering infrastructure timeouts from game failures.
- This environment permits primary Hiro/GitHub/protocol reads used in the bundled evidence; individual unavailable endpoints remain explicitly recorded. Do not assume a failed read is zero or infer APR from APY.
- The local canonical v2 engine already performs jackpot accrual/settlement. The future service adapter must not duplicate those writes.
- Preview uses the pristine PX_PURE copy and closure-local forcing. No global force-result helper is available in production.
