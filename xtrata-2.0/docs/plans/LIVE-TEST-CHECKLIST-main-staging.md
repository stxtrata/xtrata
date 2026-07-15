# Live Test Checklist — main-staging → main (PR #212, 26 commits)

Wallet release testing is now canonicalized in
[`docs/wallet-live-testing.md`](../wallet-live-testing.md). Complete its full
Xverse/Leather surface and transaction matrix in addition to the historical
checks below.

Verified against the shipped source (`src/home/main.js`, `xtrata-agent-one/wizard/*`), not just commit titles. Work top to bottom on the live site; each item says what to do and what "pass" looks like.

## 1. Inscribe panel — collapsed landing & mode switching

- [ ] Open `/inscribe`. Panel opens **collapsed** to two choice cards only: "Inscribe a file" and "Inscribe text" — no dropzone, meta, steps, or Prepare button visible yet.
- [ ] Click **Inscribe a file** → file path reveals (dropzone, name, Advanced, Relationships, preview/mint-plan meta, Start inscription, Begin·Upload·Seal steps). The standalone **Prepare button stays hidden**.
- [ ] Click **Inscribe text** → minimal text card only (textarea, live `N characters · M bytes`, cost line, one Inscribe text button). No name/Advanced/meta/steps.
- [ ] Use the **← Change** control to return to the two cards; confirm switching modes **clears the other input** (text → file clears draft, file → text clears file).

## 2. Text inscription — "type and inscribe"

- [ ] Type a short message; confirm live **character + byte counter** updates and the **cost line** (`≈ 0.00X STX · ~$Y`) updates (debounced).
- [ ] Verify the laddered fee estimator changes across size bands: paste ~90 B, ~400 B, ~900 B, ~3 KB, ~10 KB and confirm the quoted STX steps up by band (≤100 B, ≤500 B, ≤1 KB, then per-KB).
- [ ] Paste **over 16 KB** → Inscribe button disabled and message shows "Over the 16 KB limit by N bytes — trim it". Trim back under 16 KB → button re-enables.
- [ ] Empty textarea → Inscribe text button is disabled (never inscribes 0 bytes).
- [ ] With wallet connected, inscribe a small text → single transaction broadcasts, receipt/confirmation shown.
- [ ] **No-wallet prompt:** with wallet disconnected, the text button shows the friendly enable/connect prompt (not a silently stuck/disabled button). After connecting, the button becomes usable without reloading.

## 3. File inscription

- [ ] Drop/select a small file → it **auto-prepares on load** (no Prepare click); preview + mint-plan meta (FILE/NAME/SIZE/TYPE/CHUNKS/HASH) populate; **Start inscription** enables.
- [ ] Select a file while still on the landing (`none`) → it flips to file mode then prepares.
- [ ] **Large-file nudge:** select a file big enough to trigger it → the panel warns and **suggests using the Wizard** (Agent One) rather than the single-tx path.
- [ ] Run a full small-file inscription: Begin → Upload → Seal steps advance correctly and finish.

## 4. Log collapse & resume safety

- [ ] During/after an inscription, the activity **log collapses/expands** correctly.
- [ ] Interrupt a staged upload (reload mid-flow) → resuming works; if the saved upload state is oversized it refuses with "Upload state is too large to resume safely." rather than corrupting.

## 5. Text threads / recursive replies

- [ ] From an inscription in Xplorer, use **reply** → the text card lets you reply to any inscription; confirm the recursive **dependency** is recorded on the new inscription.
- [ ] Reply to a reply (nested) and confirm the chain forms.

## 6. Xplorer — dependencies & navigation

- [ ] Select an inscription that is a reply → **"In reply to"** (its dependency) is shown on the detail view, linking to the parent.
- [ ] Select an inscription that has replies → **replies (reverse dependency)** list is shown.
- [ ] **Prev / Next buttons** navigate between inscriptions and the detail view + URL update to match.
- [ ] Switch quickly between several inscriptions → no **stale preview** left over from the previous selection; URL stays in sync.

## 7. Wallet lookup / connect

- [ ] Search a wallet address in Xplorer → its inscriptions load. Switch to a different wallet → results **refresh** (no stale list from the previous wallet).
- [ ] Deep-link a wallet-lookup URL directly → loads correct wallet on first paint; URL sync holds on back/forward.
- [ ] Connect / disconnect wallet repeatedly → no stuck state; connect works from both the Xplorer and inscribe panels.
- [ ] **Reverse BNS resolution:** an address that owns a BNS name shows the **.btc name**; a searched BNS name resolves to the address.

## 8. Forever Twins

- [ ] Open a Forever Twins collection / linked pair → twin linking resolves and holder labels display correctly (this path was refactored to derive from the registry — verify parity, no missing twins).

## 9. Homepage — Galleries rename

- [ ] Homepage shows **"Galleries"** where "View examples" used to be; each gallery opens and renders its curated set.

## 10. Wizard (Agent One) — splitting change & airdropped inscriptions

- [ ] Run a multi-chunk inscription through the Wizard → **change is split** back correctly (no lost/locked funds; change returns to the funding address).
- [ ] Inscribe to a **different destination address** (airdrop) → the inscription lands on the target address, and the flow handles the different-address case end to end.
- [ ] Pre-flight guards fire before broadcast (insufficient balance / bad address / oversized) with a clear message rather than a failed broadcast.

## Regression sanity (things that should be unchanged)

- [ ] Homepage grid, theme switching, and existing galleries render as before.
- [ ] Existing single-file inscribe and staged upload still work for a mid-size file.
- [ ] Standard BNS (forward) lookups and existing Xplorer search still work.

---
**Priority order if short on time:** §1–§3 (new inscribe UX), §6–§7 (Xplorer/wallet, the biggest cluster of fixes), then §10 (wizard money-movement — highest risk).
