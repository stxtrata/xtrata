# Design: Agent One for Bitcoin L1 — post-BIP-110 chunked inscriber

**Status:** contingency design. Build triggers and phasing at the end — nothing
here ships unless/until BIP-110's activation becomes likely. Author context:
Jim built Audionals on Ordinals; Xtrata's chunk→batch→confirm→reassemble
pipeline (Agent One) is the direct ancestor of everything below.

## 1. What BIP-110 changes (as proposed — re-verify at build time)

- Disables `OP_IF` / `OP_NOTIF` in tapscript → kills the classic ord envelope
  (`OP_FALSE OP_IF "ord" … OP_ENDIF`).
- Caps data pushes at **256 bytes** → no more single big content pushes.
- Intent: discourage arbitrary data on L1. Explicitly acknowledged in the BIP:
  determined users can still embed data via many small pushes — costlier, not
  impossible.
- Existing inscriptions are untouched: consensus rules constrain **new**
  transactions only. History (incl. Audionals) remains in the chain forever.

## 2. The replacement envelope (ord PR #4545 — track, don't fork)

The ord project's draft "push-drop" envelope:

```
<protocol-push "ord">          ; bare push, no OP_IF wrapper
<data-push ≤256B> … <data-push ≤256B>
OP_DROP / OP_2DROP …           ; sweep everything off the stack
<normal spend conditions>
```

Bitcoin consensus only checks the script executes validly; ord's indexer reads
the pushed data before it's dropped. **Design rule #1: we implement whatever
ord standardises, byte-for-byte.** Our value is the pipeline, not a dialect —
a private envelope nobody indexes is worthless. Watch: ord PR #4545 merge
status, the finalized field layout (content-type, metadata, pointer tags), and
any per-script push-count or size limits that affect how much fits per input.

## 3. Architecture: Agent One's job model → Bitcoin transactions

The Stacks flow today: estimate → create job → one deposit payment → agent
signs upload batches → confirm each → seal → deliver + refund. The L1 mapping:

| Stacks concept | L1 equivalent |
|---|---|
| Deposit wallet (per-job Stacks key) | Per-job **taproot keypair**; user pays BTC to its address once |
| Chunk (contract arg) | ≤256-byte push inside a push-drop envelope |
| Upload batch tx | One **commit+reveal pair** carrying as many chunks as fit in the reveal witness |
| Confirm-before-next | Chain reveals: each reveal spends an output of the previous tx (CPFP-style linkage keeps ordering + enables fee bumping) |
| Seal | Final reveal carrying the manifest/terminator; ord assigns the inscription to the target sat |
| Deliver + refund | Inscribed sat → user's ordinals address; residual BTC → user's payment address |

Key engineering notes:
- **Multi-tx assembly:** a 400KB file at 256B/push with witness discount fits
  far fewer bytes per tx than old-style inscriptions; the splitter must plan a
  tx DAG up front (like today's 32-chunk batches) with resume checkpoints in
  the job record. Agent-core's retry/park/resume logic ports almost directly.
- **Fee strategy:** estimate at job creation with a safety margin (same
  over-collect + refund model); RBF on stuck commits; the fee-spike pause
  behaviour Agent One already has maps 1:1.
- **Key handling:** same one-shot deposit-wallet discipline as Stacks Agent One
  (keys in browser memory / job record, swept + discarded at completion).
- **Reading:** rely on ord + public indexers once the envelope is standard. We
  add L1 inscription rendering to the Xtrata explorer via an ord-compatible
  indexer API rather than running our own indexer initially.

## 4. Cost model (build the calculator before the product)

Per-byte witness costs don't change under BIP-110; overhead does:
- Envelope overhead: ~2–4 bytes per 256B push (push opcode + drop) ≈ 1–2%.
- Per-tx overhead: commit+reveal pair ≈ 300–400 vbytes fixed cost each; a
  10MB file needing dozens of tx pairs pays that dozens of times.
- Ballpark at 10 sat/vB: ~1MB file ≈ 0.003–0.004 BTC ($200–300 at $70k).
  **Xtrata equivalent: under a dollar.** Surface both numbers side-by-side in
  the wizard — the honest comparison IS the marketing.

Deliverable: `scripts/l1-cost-model.mjs` — bytes in → tx plan, vbytes, fee at
current rates, next to the Xtrata quote. Ship this publicly even before the
inscriber exists ("what will your file cost after BIP-110?").

## 5. Product surface: one wizard, two destinations

Extend the existing Agent One wizard with a destination selector:

- **Xtrata (default):** full file, sub-cent, Bitcoin-anchored via Stacks —
  unchanged flow.
- **Bitcoin L1 (post-110):** the new pipeline. Show the tx plan, total BTC
  quote, and the Xtrata price alongside. Payment in BTC to the job's taproot
  address; progress UI reuses the existing job phases (Payment → Inscribe →
  Deliver) with per-reveal confirmation ticks.
- **Both:** inscribe on Xtrata and anchor a content-hash attestation on L1 in
  a single small envelope — the cheap "notarised on L1, stored on L2" bundle
  and likely the most-used option.

Positioning line for all copy: *"Keep inscribing to Bitcoin — either layer.
Built by the creator of Audionals."*

## 6. Build phases + triggers

- **Phase 0 (now, ~1 day):** publish the cost calculator + a fair explainer of
  BIP-110 and the ord adaptation. Zero wasted work regardless of outcome.
- **Phase 1 (trigger: BIP-110 gains a credible activation path — client
  release with activation params, or miner signalling begins):** implement the
  envelope encoder/splitter as a library with golden-vector tests against
  ord's implementation; testnet/signet end-to-end inscribe of a 1MB file.
- **Phase 2 (trigger: activation locked in):** wire into Agent One wizard
  (destination selector, BTC deposit flow, resume logic); soak on signet under
  BIP-110 rules; security review of key handling.
- **Phase 3 (activation day):** mainnet launch, timed with the marketing push
  ("the only painless way to inscribe after BIP-110 — or skip the pain
  entirely on Xtrata").

**Kill criteria:** BIP-110 rejected/stalled >12 months → archive at Phase 0/1;
ord chooses a different envelope → re-implement to match before Phase 2.

## 7. Risks

- **Standard drift:** ord's envelope isn't merged; building early risks a
  rewrite. Mitigation: phase gating above; encoder isolated behind one module.
- **Cost kills demand:** post-110 L1 inscribing may be so expensive that only
  attestations (tiny payloads) see real use — the "Both" option may be the
  actual product. Design the splitter to be excellent at small payloads first.
- **Optics:** helping users "get around" BIP-110 could draw Bitcoin-community
  heat. Mitigation: we implement the community's own (ord's) format, never a
  bypass of consensus rules — and the honest framing is that we also offer the
  off-L1 alternative Bitcoin developers say they want.
- **Regulatory/abuse surface:** an easy big-file L1 pipeline can carry abuse;
  keep the existing wizard content policies and size caps.

## 8. What we reuse from this repo

`src/agent-one/agent-core.ts` job state machine (phases, retries, park/resume,
receipts); wizard UI (estimate/quote/progress components); deposit-wallet key
lifecycle; the `/warm`-style background patterns for tx-plan precomputation;
`suno-build.js`-style client-side media pre-processing (offer Opus conversion
before L1 inscription — smaller file, exactly the Audionals ethos).
