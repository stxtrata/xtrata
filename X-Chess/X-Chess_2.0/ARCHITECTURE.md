# X Chess 2, described well enough to rebuild

A specification, not a tour. Written so that somebody who has never seen the code
could build the same thing and arrive at the same decisions, including the ones
that look wrong until you know what they are for.

---

## 1. What it is

Chess on Stacks, where the board itself is a permanent Xtrata inscription.

- Every game is on chain. Every submitted move is a transaction.
- The move history is permanent and append-only.
- The position, the result and every rating are **derived** by replaying the log,
  never stored.
- Players keep their own Stacks identities and their own keys.
- A player holding zero STX can be funded on chain by their opponent and play.
- **No X Chess server exists.** No API, no database, no signing service, no
  indexer, no leaderboard.

The permanent system is exactly four things: an Xtrata inscription, Stacks
contracts, users' wallets, and access to *some* Stacks RPC endpoint. The last is
transport, is replaceable, and is never a source of truth.

---

## 2. The invariant everything rests on

> **The contract may filter, never adjudicate.**

The contract does not know the rules of chess and must never learn them. It
stores short strings in a total order and forms no opinion about them. It does
not know whose turn it is, what check is, who won, or that some of the strings it
stores are not moves at all.

Two consequences, and they are the design:

- **Anything the contract rejects never enters the log**, so a filter is safe:
  every reader sees the same log because the rejected thing is not in it.
- **Anything it wrongly accepts is skipped identically by every reader**, because
  replay is a pure total function of the log.

This is what makes the system trustless without the chain knowing chess. Nobody
has to agree about the position; everybody computes it from the same bytes.

The corollary the UI must state plainly: **an illegal move is still stored and
still charged.** It simply does not count.

If you ever find yourself teaching the contract about chess, stop. That is the
design failing, not the contract.

---

## 3. Layers

```
  xchess-core-v1.clar     an append-only log keyed by (game, seq)
        |                 knows: strings, senders, heights, a rules hash, money
        v
  replay-v1               pure total function: log -> position + verdicts
        |                 knows chess, knows the rules, decides what counted
        v
  the board               renders it, and is the referee
                          inscribed, immutable, reads the chain live
```

The middle layer holds all the meaning. The bottom is deliberately ignorant; the
top is deliberately replaceable.

---

## 4. Versioning

There is no global "v2". Each protocol carries its own version and moves on its
own schedule, because a UI release must not redefine what an old game meant.

```
core contract    xchess-core-v1
rules            rules-v1        committed per game, in the hash
replay           replay-v1       committed per game, in the hash
events           events-v1       committed per game, in the hash
ranked           ranked-v1
rating           elo-v1
UI               ordinary build version
```

A game carries enough commitments to say how it must be read. That is what makes
§79 possible: a reader arriving with only the chain and the published documents
does not have to know which version was current.

---

## 5. The contract

Clarity 4. Not a preference — `as-contract` does not exist in Clarity 4, and the
sponsorship reserve requires the contract to spend from its own balance. See
ADR-0001.

### Storage

```clarity
(define-map Games uint {
  opened-by, opened-at, next-seq,
  rules-hash: (optional (buff 32)),
  ranked: bool                      ;; a DISCOVERY HINT, not the truth
})

(define-map Entries { game: uint, seq: uint } {
  value: (string-ascii 5), sender: principal, height: uint
})
```

**Keyed by `(game, seq)`, not a list.** Load-bearing: a map keyed by sequence
gives flat cost per entry, while appending to a list means reading and rewriting
the whole list, so move eighty would cost far more than move two — and long games
are exactly the ones most worth having.

`MAX-SEQ` is 65,536. A lower ceiling is a cheap denial of service: fill a game's
log and nobody can ever move in it again. It cannot be raised after deployment.

Deliberately absent: the board position, whose turn it is, and who won.

### The only filter

Length. Four or five characters. Five is for promotion (`e7e8q`) and for the
control strings. No character validation: replay rejects anything unparseable
anyway, and the contract must not acquire an opinion.

Anything longer than five is not rejected — it is **unrepresentable**, because
the parameter is `(string-ascii 5)`. The explicit check exists for the short end,
which the type cannot express.

### Money

Everything paid in is **held by the contract**, not forwarded, which is what lets
solvency be stated about a single balance:

```
balance >= total-reserved            asserted after every operation in every test
withdrawable = balance - total-reserved
```

There is exactly **one** place STX leaves, so there is exactly one place the
invariant has to be defended. Every payout is wrapped in an `as-contract?`
allowance written for the exact amount the accounting says is owed. If the
arithmetic were wrong, the language aborts the call before the money moves.

---

## 6. Rules and the commitment that pins them

The contract stores a **hash** of a game's rules and never the rules. See
RULES-V1.md for the exact bytes.

A hash cannot be turned back into rules; it can only **confirm** them. Every path
that is not an exact hash match ends with the board refereeing nothing and saying
so. A board enforcing rules a game never agreed to would skip submissions every
other reader accepts, and the log would stop being a shared record.

---

## 7. Sponsorship

Creator-funded bootstrap plus fixed on-chain rebates. See SPONSORSHIP-V1.md.

The constants were **measured, not guessed**: the brief's illustrative figures
would have stranded every sponsored player after two moves at the fee legacy
X Chess actually confirmed on mainnet (ADR-0004).

Only a **named** beneficiary can be bootstrapped. An anonymous open game cannot
fund an unknown future player, because they would need a transaction to identify
themselves and have no STX to pay for it. Stated in the UI, not hidden.

---

## 8. Wallets

Painfully derived, not designed. Do not simplify without re-running
`harness/wallets/MATRIX.md`.

- **Resolve providers per call, never at startup.** The shim installs at load and
  again at 400ms, 1400ms, 3200ms and on focus.
- **Rank by `request()`**, not by `transactionRequest`. Xverse injects a
  `StacksProvider` whose `request` is a stub that throws, and a `BitcoinProvider`
  that actually answers. Ranking on a capability you do not use picks the broken
  one.
- **Suppress generic aliases** when a named wallet is present, or the user
  approves twice for one action — except under the runtime, where the shim *is*
  `window.StacksProvider`.
- **Post conditions must be serialised hex.** Objects make Xverse hang forever
  with no dialog.
- **Shape parameters per provider.** A schema-validating wallet gets exactly the
  fields its schema names. Out-of-spec fields are not uniformly ignored.
- **Never send `feeRate`.** A rate is per byte; 10,000 there is a hundredfold
  overcharge.
- **A cancellation is an answer**, not a reason to ask a different wallet.

### New in X Chess 2

A sponsored move makes the **contract** send STX. Under deny mode every transfer
must be covered, including that one, so a second post condition is required with
a contract-principal encoding. Without it every sponsored move would abort while
still charging the network fee. ADR-0006.

### The bridge

`stx_callContract` is **refused with -32601 unless a host bridge exists** — a
`walletBridgeToken` in the page URL plus a parent or opener. A raw link to
`/i/<id>` reads and replays fine and cannot sign anything, and the board says so
rather than letting somebody meet it as a failed transaction.

---

## 9. Chain access

An ordered **list** of endpoints, not a host. Any of them answering is enough.

- The runtime proxy first when the injected scripts are visible, because the
  serve-time Hiro rewrite is HTML-only and every API call lives in JavaScript.
- More than one public host, so no company is a permanent dependency.
- An explicit override is the only entry and never falls away.
- **A 404 is a real answer** and never triggers a fallback. Only a transport
  failure or a 5xx means an endpoint is unusable.
- Chain unavailability is reported distinctly from the chain saying no.

---

## 10. Testing

| layer | what it proves |
|---|---|
| perft | move generation is correct, not nearly correct |
| replay fuzz | totality and determinism under hostile input |
| golden rule vectors | the canonical bytes have not moved |
| Clarinet | every public function, and that dangerous ones are absent |
| parity | the mock agrees with the contract |
| economic property | solvency, reconciliation, isolation, monotonicity |
| zero-STX sweep | the sponsorship constants, measured |
| wallet conformance | every documented misbehaviour, reproduced |
| serverlessness audit | no server dependency, with canaries proving it is live |

Contract tests **assert absences**, not just behaviour: no `map-delete`, exactly
one write to `Entries`, exactly one STX outflow site, and exactly which public
functions exist. An owner who could rewrite history would break everything above.

When a test fails, **check the fixture first.** In this project the engine has
been right and the fixture wrong more often than the reverse — three times during
the initial build.

---

## 11. If you rebuild it

Each layer is testable without the next.

1. **Engine**, verified by perft. Nothing else matters if this is wrong.
2. **Replay** as a pure total function. Feed it junk deliberately.
3. **Canonical hashing.** Fix the encoding now; it is permanent.
4. **Contract**, filtering on length only. Resist every urge to validate a move.
5. **A mock chain** with the same interface, and a parity suite against the real
   one.
6. **The board**, deriving everything from replay and storing no position.
7. **Wallets**, last, copying §8 rather than rediscovering it.
8. **A harness that replicates the Xtrata runtime**, before inscribing anything.
