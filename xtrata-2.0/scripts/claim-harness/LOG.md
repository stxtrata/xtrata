# Change log

One entry per change, newest last. Each says what moved, what got worse, and what to try on a real phone.

## 0. Baseline (before any change), 19 Oct 2026

Total friction score 138. Clean claim: 3 taps and 2 passkey prompts on desktop, 6 taps and 3 prompts on iPhone. Four
scenarios made a second passkey for one person: `reload-after-create`, `close-panel-after-create`,
`storage-lost-then-second-album`, `iphone-reload-while-in-new-tab`. Every scenario showed 2 or 3 crypto words (STX,
wallet, on-chain) to someone claiming a free album.

Cause of the first three: the wallet frame wrote a new passkey into its list only after the second PRF check had passed
(`remember()` in frame/engine.ts), so a reload, a closed panel or a tab the phone discarded between "passkey made" and
"check passed" left a passkey that nothing knew about. The next try saw an empty list and made another.

## 1. Remember a passkey the moment it is made (the frame keeps it as "pending")

**Problem.** One person, one passkey. Reload / closed panel / discarded tab between creating the passkey and the PRF check
made a second one.

**Change** (`src/listening-wallet/frame/engine.ts`, tests in `__tests__/pending-passkey.test.ts`). When a passkey is made,
the frame stores only its public id (on the phone path, the random user id of the tab it opened) as `pending`. The next
create picks that up instead of making another: in the frame it goes straight to the check, on the phone it goes back to
"Made your passkey?" without opening a second tab. It becomes a wallet only through `remember()` after the two matching
PRF results, exactly as before, so the §3.1 rule (no address shown or funded before PRF is proven) is unchanged. A
definite failure (PRF output not stable) forgets it, as does a pending older than a day or three failed pick-ups.
No secret is stored: ids only.

| scenario | passkeys | taps | prompts | score |
| --- | --- | --- | --- | --- |
| reload-after-create | 2 → 1 | 5 → 5 | 3 → 3 | 21 → 11 |
| close-panel-after-create | 2 → 1 | 5 → 5 | 3 → 3 | 21 → 11 |
| iphone-reload-while-in-new-tab | 2 → 1 | 10 → 7 | 4 → 3 | 27 → 13 |
| every other scenario | unchanged | unchanged | unchanged | unchanged |

Total score 138 → 104.

**Trade-off.** `panels` 2 → 3 on the two desktop reload/close scenarios: picking up a passkey that returned no secret at
creation goes through the normal "Confirm your passkey" panel. No extra tap or prompt (the person taps it in place of the
create panel they skipped). Backlog item 5 shortens it if it feels slow.

**Left open.** `storage-lost-then-second-album` still makes a second passkey: this change cannot help when the
browser's storage is gone. See BACKLOG.md #1 (needs Jim's call).

**Deploy.** A frame change: needs the wallet box rebuilt and redeployed (`npm run build:listening-wallet` + wrangler
Pages deploy). The radio page is untouched.

**Try on a real phone before merging.** On an iPhone: tap a free-album link, tap "Make my passkey (new tab)", make the
passkey, then pull-to-refresh the radio tab (or swipe it away and reopen the link) BEFORE tapping "I made it". Expected:
the box offers "Made your passkey?" again and you finish with one "Xtrata listening wallet · XXXX" in Settings →
Passwords. Also: Cancel the "One more check" panel, then tap Open album again: still one passkey.

Existing test `src/radio-ppp/__tests__/page-gift.test.ts` ("a slow or failing send is an amber still sending…") fails with
and without this change.
