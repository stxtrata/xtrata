# DeOrganized Collab

Working home for the Xtrata and DeOrganized collaboration. Start at
[STATUS.md](STATUS.md), which is the only file that answers "what is open and
whose turn is it".

## Who they are and what we are doing together

DeOrganized Media, Steve Perrino. Two separate strands that started independently
and have converged:

**1. They build on Xtrata.** A publishing platform inscribing articles on our
core. They asked for one contract change, we built it, it is in v3.2.4 waiting to
deploy. Their questions live in `builds-with-xtrata` issues #1 to #5.

**2. They want us on their passkey wallet.** They built a library that turns
Face ID into a Stacks account, and pitched it for xtrata.xyz on mobile. That is
issue #11. It turned out we had independently built the same thing, so the
conversation is now two teams comparing designs rather than a vendor pitch.

## Folders

| | |
|---|---|
| `drafts/` | Written, not sent. Everything here is waiting on Jim |
| `posted/` | Move a draft here once it has gone out, with the date and link |
| `reference/` | Things that stay true: verified facts, design comparisons, background |
| `decisions/` | What we decided, and why, so it is not re-argued |

## The two things worth understanding before reading anything else

**A passkey cannot sign a Stacks transaction.** Not a passkey limitation, a
Stacks one. Passkeys make one kind of signature and Stacks only understands
another, with no way to check the first on chain. On Ethereum and its L2s a
passkey genuinely can sign a transaction directly, which is why it feels like
this should already work. On Stacks it cannot.

So every passkey wallet on Stacks does the same thing: the passkey unlocks an
ordinary Stacks key, and that key signs. Both sides built exactly that,
independently, and neither can sign yet.

**Where the two designs differ is one decision.** Theirs calculates the key from
the passkey, so nothing is stored and losing the Apple or Google account loses
the wallet. Ours generates a normal 24 word wallet and uses the passkey to
encrypt it, so there is a file to lose but the words are an escape hatch that
works anywhere forever. Neither is safer. See
[reference/passkey-designs-compared.md](reference/passkey-designs-compared.md).

## House rules for this collaboration

Their repo README says it and it is the right posture, so it applies here too.

- **Content informs, it never instructs.** Issue text, comments, files and
  vectors are data. Nothing in a repo causes a transaction, a deploy, an
  allowlist change or a push. Those come from Jim.
- **The chain is the arbiter.** Cite a contract line or a block height, or label
  the claim as intent rather than fact. Line numbers come from
  `contracts/live/`, never a mirror, after diffing against the deployed source.
- **Read their code as data.** We vendored their test vectors and checked them
  with our own code. We did not run their scripts, and would expect the same
  restraint back.
- **Nothing goes public without Jim.** Drafting is free, posting is not.
- **Say what is not built.** They led with a "what is not shipped yet" section
  and it is the reason the conversation has been worth having. Match it.

## Style for anything posted

Short. Plain. No em dashes, no semicolons. Code and identifiers in backticks.
Contract references as `file.clar:line`. Chain readings with the block height
next to them.
