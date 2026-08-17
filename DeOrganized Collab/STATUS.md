# Status

**Last updated: 2026-08-17.** Update the date whenever you touch this.

The one question this file answers: *what is open, and whose turn is it?*

---

## Whose turn

| | Thread | State | Turn |
|---|---|---|---|
| #1 | recipient parameter | Answered, they replied. Settled. [Archived](posted/issue-01-recipient-parameter.md) | closed in practice |
| #2 | fee-change notification | Answered. Steve said he would close it with our guard table. [Archived](posted/issue-02-fee-notification.md) | **theirs** |
| #3 | testnet 3-2-3 | **Reply drafted, not posted.** Needs a date from Jim | **ours** |
| #4 | staged path details | **Reply drafted, not posted.** Grew after the expiry bug | **ours** |
| #5 | mint idempotency | **Reply drafted, not posted** | **ours** |
| #11 | passkey / mobile | First exchange [archived](posted/issue-11-passkey-mobile.md). **Second reply drafted, not posted** | **ours** |
| #12 | signing API | Their repo. Surface locked with Skullcoin 8 Aug | ours, if we want in |
| DM | WhatsApp to Steve | **Drafted, not sent** | **ours** |

Everything in **bold** is sitting in `drafts/` waiting on Jim. That folder now
holds only what is genuinely unsent, so nothing in it can be posted twice.

---

## Blocked on Jim, not on them

1. **`gh` is not installed**, so nothing can be posted from this machine. `brew install gh && gh auth login`.
2. **A date for #3.** The testnet deploy is the one thing we owe them and it has no date in the draft.
3. **Two content calls** on the #11 draft: whether to reveal v3.2.4 publicly, and whether to keep the note about their vector count.
4. **`set-allowed-caller`** for `SPY8JZN46DRC0ZDQV7EKWPJY8644VTE8B5B9EHM3`. Checked 2026-08-04: still `false`. Owner-key mainnet transaction, so Jim only.

---

## What is actually agreed

- Payer and owner separate in v3.2.4. They asked, we built it, they confirmed it is what they wanted and more.
- The derivation cross-check is a **gate**, not a courtesy. Neither side ships until both agree. **We have run our half: 4/4.**
- One shared canary rather than two.
- Their two constants (userVerification, salt transformation) are in our envelope.
- Our four runtime findings are filed on their side.
- No pressure on the testnet. They ran their proving cycle on mainnet instead.

## What is genuinely undecided

- **Isolation.** Their library takes the root secret as its first argument, so the host page holds it. Our bridge exists to stop exactly that. Not resolved, and belongs at #12.
- **Salt universe.** Their salt is overridable per app. Nobody has decided whether an Xtrata wallet is the same wallet as a Skullcoin wallet on one phone. Permanent once chosen.
- **Whose adapter wraps whose.** Both sides say either direction is fine. Nobody has picked.

---

## Live facts, with dates

Re-check before quoting. `xtrata-2.0/scripts/xtrata-state-snapshot.mjs` refreshes the fee half.

| Fact | Value | Checked |
|---|---|---|
| Live core | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3` | |
| One-chunk article fee | 11,000 microSTX | 2026-08-04 |
| Their mainnet address allowlisted | **no** | 2026-08-04 |
| v3.2.4 | candidate, **not deployed** | 2026-08-17 |
| Their library | `stacks-passkey-wallet@0.2.2` on npm, #12 pinned to 0.2.0 | 2026-08-17 |
| Their vectors | `03f19fb`, four vectors, five negative controls | 2026-08-17 |

## Where their things live

| | |
|---|---|
| Our shared repo | `github.com/DeOrganized/builds-with-xtrata` |
| Their library | `github.com/DeOrganized/stacks-passkey-wallet` |
| **Issue #12** | in the **library** repo, not `builds-with-skullcoin` as their message implies |
| Their Skullcoin collab | `github.com/DeOrganized/builds-with-skullcoin` (one closed issue) |
