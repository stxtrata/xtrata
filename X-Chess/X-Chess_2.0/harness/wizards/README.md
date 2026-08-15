# The wizards

**Four disposable mainnet wallets — a Director and three players — that play
chess at the canary contract so that "does signing actually work right now" has
an answer other than nobody being sure.**

**You fund one address.** The Director distributes to the players and takes the
floats back when you sweep.

Every transaction they sign is real, on mainnet, with real money, and none of it
is reversible. They hold nothing beyond their float and some throwaway games on
a canary contract. If a key leaks you lose the float, and you generate four
more. That is the whole security model and it only holds while they stay
disposable.

Modelled on `xtrata-2.0/scripts/wizard/`, which does the same thing for
inscriptions.

---

## What this proves, and what it does not

**It cannot replace the wallet matrix, and the difference is not a technicality.**

A wizard signs with a raw key through `@stacks/transactions`. A player signs
through Xverse or Leather, which parse the request, apply their own schema, and
forward what they choose to. Those are different paths, and only the second is
what a person meets. Every wallet fault found in this project so far lived in
the second one.

| | wizards | `harness/wallets/MATRIX.md` |
|---|---|---|
| the contract accepts the call | ✅ | ✅ |
| the post condition encoding is right | ✅ | ✅ |
| a **wallet** will send it | ❌ | ✅ |
| runs unattended, as often as you like | ✅ | ❌ |
| needs a person | ❌ | ✅ |

So the fleet is the half that can be automated. **Row 4 of the matrix — the
contract-principal post condition on a sponsored move — has never run anywhere,
and the wizards can exercise its encoding against the real chain today while the
wallet half still waits for a person.**

---

## Getting a fleet

```bash
node harness/wizards/make-wizards.mjs
```

Prints four keys and addresses **once**, and forgets them. Nothing in this
directory writes a key to disk, touches the network, or derives anything from a
wallet you already own.

It prints the keys once. To have it write the file for you:

```bash
node harness/wizards/make-wizards.mjs --write
```

That puts them in `harness/wizards/.env.wizards` at mode 600, having first
checked the file is gitignored — and **refuses to overwrite one that already
exists**, because that file may belong to a funded fleet whose keys are the only
thing that can move its money. Without `--write` it prints and forgets, and the
file is yours to create by hand.

Then send **the Director** a few STX — one address, one transfer — and let it do
the rest:

```bash
node harness/wizards/play.mjs fund          # what it would send, and to whom
node harness/wizards/play.mjs fund --live   # sends it
```

It tops each player up **to a float** rather than by an amount, so running it
twice costs nothing: a wizard already at its float is skipped rather than
doubled. For something meant to run unattended, the safe response to being
unsure has to be "run it again".

### Why one funded address is safer, not just easier

The Director holds the whole float rather than a third of one, so a leaked
director key loses everything the fleet has. What makes that a good trade is a
single rule, asserted in the tests:

> **A Director may only pay its own wizards.**

It is not a hot wallet that can send anywhere. The one exception is `sweep`,
which needs an address typed on the command line and `--live` — that is the door
money leaves by, and it is a different door on purpose.

The alternative was three transfers by hand, with one of them mistyped, to an
address that is gone for good.

**Generate your own.** Do not reuse a key from a transcript, a screenshot or a
shared terminal — including one generated while somebody was watching.

### Getting the money back

```bash
node harness/wizards/play.mjs sweep            # players -> Director
node harness/wizards/play.mjs sweep --to SP…   # out of the fleet entirely
```

With no `--to` it sweeps **home to the Director**, because the players' floats
belong in the wallet you already fund. `--to` is how money leaves the fleet, and
it has to be typed.

These are raw keys with no seed phrase, so they cannot be imported into Xverse
or Leather. That is a deliberate trade: a phrase would need two more
dependencies in a project that keeps them countable, and `sweep` is the same key
signing a transfer.

---

## Running them

```bash
node harness/wizards/play.mjs            # a dry run: what it would do, and what it would cost
node harness/wizards/play.mjs --live     # signs and broadcasts, for real
node harness/wizards/play.mjs balances   # what each one holds
```

**Dry by default, and that is not a convenience.** Every act spends real STX and
none of it can be undone, so the default has to be the one that costs nothing. A
dry run reads the open fee from the contract, prices the whole run, and prints
it — with no wallets provisioned at all, which makes it useful before you have
any.

### What a run does

| act | who | what it proves |
|---|---|---|
| open | Opener | the fee moves, a game id is consumed, and the 1 STX is capped by a post condition the chain has to accept |
| play | Opener and Responder | two independent signers alternate to a real checkmate; one transaction, one entry, each time |
| sponsor | Patron | the contract pays a bootstrap **out**, to a wallet holding nothing, in the same transaction |
| rebate | the sponsored wallet | the contract-principal post condition is accepted and the rebate arrives |

The game is fool's mate — four moves to a genuine checkmate, derived by replay
rather than asserted. A longer game costs more in fees and proves the same
things.

---

## The rules that keep it safe

Every one of these is asserted in `tests/wizards/wizards.test.ts`, because a
safety property that is only described is one that can be deleted without
anything noticing.

- **Dry by default.** `--live` or nothing is signed.
- **One contract.** An allow-list, not a check on an argument — a key with STX
  on it that can call *any* contract can be talked into calling one that empties
  it.
- **Four functions.** `open-game`, `open-sponsored-game`, `submit`,
  `top-up-sponsorship`. Notably **not** `settle-sponsorship`: any principal may
  settle an expired reserve, and doing so bars that player from ever being
  sponsored on that game again. A robot must not be able to do that at all.
- **A spend cap** for the whole run, counting what it has already spent.
- **A balance floor.** Not politeness: a wallet at zero cannot pay the fee to
  move its own float, so the money is stranded and the wizard is dead.
- **Mainnet only**, and never a project wallet.
- **The Director never plays.** A wallet that both holds the money and signs the
  experiments is one mistake away from being the only wallet.
- **A ceiling on any single transfer**, whatever it was asked for.
- **Keys are scrubbed** out of anything on its way to a log, by shape.

---

## When one of these fails

A wizard run failing means one of three things, and they want different
responses:

1. **The chain refused something it accepted before.** The interesting case, and
   the reason the fleet exists. Read the transaction, not the script.
2. **A wallet ran out.** Look at `balances`, top it up.
3. **The script is wrong.** Most likely if it fails at the same act every time.
   The safety gate throws before signing, so a refusal here has cost nothing.
