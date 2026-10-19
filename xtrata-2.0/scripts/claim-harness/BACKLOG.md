# Backlog: what to make simpler next

Ranked by what the harness says it would move. Numbers are from baseline.json. "Decision" items need Jim before anyone builds them.

## 1. Stop making a second passkey when the browser forgot the first  — DECISION
Scenario: `storage-lost-then-second-album` (2 passkeys, 6 taps). The passkey is still in the phone's password manager,
but the wallet frame's own storage is gone (cleared site data, a different browser or an app's built-in browser on the
same phone, Safari's storage limits). The page cannot tell "new" from "forgot", so it offers to make one, and the person
who does not recognise "I've used Xtrata Music here before" taps the big button.
Options, cheapest first:
- **A. Say it where they are looking.** The frame's create panel itself carries a plain second button, "I already have one
  on this phone", beside "Create". Costs 0 taps for a new person, removes the hidden-link problem. Harness: the scenario's
  person is told by the panel; add a "recognises the passkey" persona for it.
- **B. Look first, create second.** One button, "Open album": the frame first asks the phone for an existing Xtrata
  passkey and only offers to create when there is none. Costs a prompt for new people (one extra Face ID before the
  create) unless the browser can ask without showing a prompt when nothing exists (WebAuthn "immediate mediation": check
  that it exists in the browsers that matter before relying on it; this has NOT been verified here).
- **C. Keep a recoverable trail on the server.** The gift claim already records the passkey's root address; a returning
  visitor could be matched by something they hold (email/phone) at the cost of an account. Probably against the "no
  account" promise.
Recommendation to evaluate with the harness: A first (free), B only if A does not move the number on a real phone.

## 2. Hide the crypto steps from album claimers  — DECISION (wording)
Every claim shows a "SETUP: 1 Passkey · 2 Add 1 STX · 3 Listen" stepper and the words STX, wallet and on-chain
(`jargon` 3 on nearly every scenario). A free album never needs "Add 1 STX". Your own brief for the listener-facing
player is no pay/STX/crypto wording. The Album First page (`?albumpage=1`) is already at `jargon` 2. Fix: for a claim
that carries an album, show a two-step "Open · Listen" or no steps at all. Harness target: `jargon` 0 on every album
scenario, no new taps.

## 3. Remove the first tap on the page
Clean desktop is 3 taps: "Claim my gift" on the page, then the wallet box's own button (needed: the box must be
tapped inside itself so the page can never approve a passkey for you), then "One more check". The first one only opens
the box. Showing the box's button as the page's primary button (the frame visible from the start, labelled "Open album")
makes it 2 taps desktop and 5 on iPhone. Risk: the frame's click guard (visible for 0.8 s, not covered) must still hold;
`ARM_DELAY_MS` in frame/ui.ts.

## 4. iPhone: do not send them to a second tab  (6 taps, 3 prompts clean; the longest clean path)
The second tab costs: tap to open, tap "Create passkey" there, switch back, tap "I made it", and a phone that discards
the radio tab while they are away (covered by the first fix, but the trip is still the cause). Try top-level navigation
instead: the same tab goes to wallet.xtrata.xyz/create with a return address, makes the passkey, and comes back to the radio
page with the gift code still held in localStorage. Needs a real iPhone to judge (the harness models it, it cannot
prove it), and a decision on what happens in apps' built-in browsers.

## 5. The extra confirmation after resuming
The first fix resumes a half-made passkey through the normal "Confirm your passkey" panel (one more panel, no more taps
or prompts; shown as a `panels` trade-off in LOG.md #1). If resume feels slow on a phone, resume straight into the
single "One more check".

## 6. Decisions for Jim (not to be built by the loop)
- The two-prompt PRF rule (docs/PASSKEY-WALLET.md §3.1) is the floor on prompts: create, then a sign-in that proves the
  secret is stable, before any address is shown. A gift wallet holds under 1 STX. Relaxing this for a zero-balance gift
  wallet (prove stability on the next unlock instead) would save one Face ID on desktop and iPhone. The rule was bought
  with a real iPhone Edge failure; leave it unless you decide the saving is worth the risk.

## Not measured yet (ideas for new scenarios)
- Claim inside an app's built-in browser (Instagram, X): "Open in Safari" detour.
- Two devices, same iCloud passkey (the passkey syncs; the wallet record does not).
- The gift treasury busy or the network slow (`failClaimOnce` exists in the mock; no scenario uses it yet).
- Time from claim to first sound on the live site, with a real canary gift (needs Jim's approval for a real broadcast).
