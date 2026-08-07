# X Chess, described well enough to rebuild

This is a specification, not a tour. It is written so that somebody who has
never seen the code could build the same thing and arrive at the same decisions,
including the ones that look wrong until you know what they are for.

Everything in "Traps" at the end was found the hard way. Most of it is invisible
in local development and only appears in the artifact that gets inscribed, which
cannot be corrected afterwards.

---

## 1. What it is

One shared chess game on the Stacks blockchain. Anyone may submit a move to any
game. The move list is permanent. The page that draws it is itself an
inscription, so the whole thing is a permanent front end reading a live smart
contract.

---

## 2. The invariant everything rests on

> **The contract may filter, never adjudicate.**

The contract does not know the rules of chess and must never learn them. It
stores short strings in a total order and forms no opinion about them.

Two consequences, and they are the design:

- **Anything the contract rejects never enters the log.** So a filter is safe:
  every reader sees the same log because the rejected thing is not in it.
- **Anything the contract wrongly accepts is skipped identically by every
  reader**, because replay is a pure, total function of the log.

This is what makes the system trustless without the chain knowing chess. Nobody
has to agree about the position; everybody computes it from the same bytes.

The corollary, which the UI must state plainly: **an illegal move is still
stored and still charged.** It simply does not count.

### Replay as consensus

```
replay(log, rules) -> { position, accepted[], rejected[] }
```

Pure. Total. Never throws on arbitrary input, because the input is arbitrary by
construction — anyone can submit anything of the right shape.

Every derived fact in the product is a function of the log: the position, the
move list, whose turn it is, who won, and (proposed) a ranking table. **Derived,
not stored.** Anyone can recompute any of it and get the same answer, which is
why none of it needs to be trusted.

---

## 3. Layers

```
  Clarity contract        an append-only log, keyed by (game, seq)
        │                 knows: strings, senders, heights, a rules hash
        ▼
  replay.js               pure function: log -> position + verdicts
        │                 knows chess, knows the rules, decides what counted
        ▼
  the board               renders it, and is the referee
                          inscribed, immutable, reads the chain live
```

The middle layer is where all the meaning is. The bottom layer is deliberately
ignorant; the top layer is deliberately replaceable.

---

## 4. The contract

Three deployed versions, all on mainnet under
`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`. **Never edit a deployed contract —
deploy a new one and migrate.** A version is a new registry entry, never a
mutation.

| | v1 | v2 | v3 |
|---|---|---|---|
| charges | nothing | one fee for both calls | opening and moving priced apart |
| owner | none | yes, renounceable | yes, renounceable |
| sha256 | `fae33656…` | `cf1c00c2…` | `04559c87…` |

v3 is current. Live values: **open 1 STX, move 0.001 STX**, 2 games.

### Storage

```clarity
(define-map Games uint {
  opened-by:  principal,
  opened-at:  uint,          ;; stacks-block-height
  next-seq:   uint,
  rules-hash: (optional (buff 32))
})

(define-map Moves { game: uint, seq: uint } {
  mv:     (string-ascii 5),
  sender: principal,
  height: uint
})
```

**Keyed by `(game, seq)`, not a list.** This is load-bearing: a map keyed by
sequence gives flat cost per move. Measured, move 82 costs about 1% more than
move 1. A list would grow linearly and make long games progressively more
expensive — exactly the games most worth having.

`MAX-SEQ` is 65,536. It started at 4,096, which was a cheap denial of service:
fill a game's log and nobody can ever move in it again.

### Public functions

- `open-game (optional (buff 32))` → game id. Charges the open fee.
- `submit-move (uint) (string-ascii 5)` → seq. Charges the move fee.
- `set-move-fee`, `set-open-fee`, `set-fee-recipient`, `transfer-ownership`.

### The only filter

Length. Four or five characters, nothing else. Five is for promotion (`e7e8q`).
The contract has no idea what a square is.

### Fees

Both may be zero. Both are capped by a constant no owner can exceed (1 STX per
move, 10 STX per open). `transfer-ownership none` renounces permanently, which
freezes both fees and makes the contract as unowned as v1.

Charging happens **after the checks and before any write**, so a refusal costs
nothing and a sender who cannot pay leaves no trace and consumes no game id.

`charge` takes the amount as a parameter rather than reading one. With two fees,
a function that picked its own would be one edit away from charging the wrong
one silently.

---

## 5. Rules, and the commitment that pins them

The contract stores a **hash** of a game's rules and never the rules. That keeps
it ignorant and keeps opening a game cheap.

```js
{ version, white, black, allow[], cooldown, noConsecutive, startFen }
```

Hashed as a canonical JSON array in fixed key order. **The order can never
change** — a committed game must keep hashing to the same bytes forever.

- `white` / `black`: a principal, `anyone`, or `anyone-else`.
- `anyone-else` means everybody except whoever holds the other side. It exists
  because naming White and leaving Black open lets the named player answer their
  own moves, which is a different game.
- `cooldown`: **counted in moves, not blocks.** A Stacks block is seconds, so a
  wait in blocks stopped nobody. A wait of 1 is exactly `noConsecutive`.
- A wait of N needs N+1 different people able to move, or the game deadlocks
  permanently. This is refused at creation, not warned about, because the rules
  are hashed on chain and there is no fixing it afterwards.

### Who referees

The rules live in **the page**, not the chain. So:

- A **generated child board** carries one game's rules and checks them against
  the commitment. That is the normal path: whoever opens a ruled game generates
  the board that enforces it.
- The **open board** carries the rules for the flagship game only, and checks
  them the same way.
- For any other committed game it says so and referees nothing.

Every path that is not an exact hash match ends with the board enforcing
nothing. A board enforcing rules a game never agreed to would skip moves every
other reader accepts, and the log would stop being a shared record.

### Recovering rules from a hash

A hash cannot be turned back into rules. It can **confirm** them. If what
somebody sets in the rules panel hashes to what a game committed, that is proof
— no other rule set could produce it — and the board adopts them and says where
they came from.

Consequence worth knowing: for simple rule sets this is a short search, so a
game's rules are not private.

---

## 6. Modules

| module | responsibility |
|---|---|
| `engine.js` | 0x88 chess. Dependency-free. Verified by perft against six standard positions, ~16M nodes. |
| `replay.js` | log → position + accepted/rejected, with reasons. Pure and total. |
| `rules.js` | the rule shape, canonical hashing, `checkSender`, readiness checks. |
| `known-games.js` | rules the board carries, keyed by `<contract>#<game>`. |
| `live-chain.js` | reads the contract over HTTP, writes through a wallet. |
| `sealed-chain.js` | a game that carries its own log and touches no network. |
| `mock-chain.js` | in-memory contract, same interface. Tests only. |
| `wallet.js` | provider discovery, ranking, calling. See §8. |
| `api-base.js` | which Stacks API to talk to. See §9. |
| `clarity.js` | minimal Clarity codec and address encoding. No SDK. |
| `bns.js` | principals → names, and names → principals, via **BNS-V2**. |
| `board-ui.js` | board rendering, click-to-move, piece glyphs and names. |
| `app.js` | the application. Panels, state, everything derived. |
| `boot.js` | mounts the shell and starts exactly one board. |
| `child.js` | generates a child board for one game. |

`clarity.js` is hand-written on purpose: an inscription cannot carry an SDK, and
every byte is permanent.

---

## 7. The Xtrata runtime

An inscription does not simply load. The viewer:

1. fetches the inscription's bytes,
2. injects into `<head>`: `<base href>`, `url-support.js`, `module-bootstrap.js`,
   `wallet-shim.js?network=…&walletBridgeToken=…`,
3. `document.open()` → `document.write(html)` → `document.close()`.

Separately, at serve time, `https://api.mainnet.hiro.so` is rewritten to
`/hiro/mainnet` — **only for `text/html`**.

---

## 8. Wallets

Painfully derived, not designed. Do not simplify without re-running the matrix.

- **Resolve providers per call, never at startup.** The shim installs at load and
  again at 400ms, 1400ms, 3200ms and on focus. Anything that captured a provider
  early captured nothing.
- **Rank by `request()`**, not by `transactionRequest`. Xverse injects a
  `StacksProvider` whose `request` is a stub that throws, and a `BitcoinProvider`
  that actually answers. Ranking on a capability you do not use picks the broken
  one.
- **Suppress generic aliases** when a named wallet is present, or the user
  approves twice for one action — except under the runtime, where the shim *is*
  `window.StacksProvider` and may be the only route.
- **Post conditions must be serialised hex strings.** Objects make Xverse hang
  forever with no dialog.
- **Shape parameters per provider.** A wallet that validates against the
  sats-connect schema gets exactly the fields that schema names —
  `contract, functionName, functionArgs, arguments, postConditionMode,
  postConditions` — and nothing else. Out-of-spec fields are not uniformly
  ignored.
- **The network fee cannot be set for Xverse.** Its schema has no fee field, and
  the runtime host drops `fee` before a wallet ever sees it. Do not pretend
  otherwise in the payload.
- **Connect timing**: the first call gets a long budget because the wallet may be
  behind an unlock screen; once anything has answered, subsequent probes get
  ~3s, because a method a wallet intends to answer answers at once.

### The bridge

`stx_callContract` is **refused with -32601 unless a host bridge exists** — a
`walletBridgeToken` in the page URL plus a parent or opener. The Xtrata site
supplies one. A raw link to `/i/<id>` reads and replays fine and cannot sign
anything, and the board says so rather than letting someone meet it as a failed
transaction.

---

## 9. Which API

The Hiro rewrite is HTML-only. Every API call lives in the engine, which is
inscribed as **JavaScript**, so none of it would be rewritten and every viewer
would burn the public per-IP rate limit.

So the engine chooses: the proxy when it can see the runtime's injected scripts,
the public host otherwise, a build-time override above both. It falls back to
the public host on a 5xx or transport failure — an inscription cannot be
corrected and must degrade rather than break. **A 404 is a real answer** and
never triggers a fallback.

---

## 10. Build artifacts

| mode | output |
|---|---|
| default | one self-contained HTML file, everything inlined |
| `--engine` | the engine as one JavaScript inscription (~150KB) |
| `--board --engine-id` | a thin HTML page depending on that engine |
| `--canary` | the launch/deploy page, contracts inlined |
| `--seal` | a finished game carrying its own log, no network |

Two guards that exist because of one bug: an inlined module containing
`</script>` truncated every self-contained build silently. The build escapes
`</script` and asserts exactly one unescaped closing tag.

Built boards carry `exact: true` so an inscribed board cannot talk to a contract
other than the one it was built against. A fallback chain would let one failed
request silently show a different log under the same game number.

---

## 11. The harness

**There is no Xtrata testnet.** `scripts/harness.mjs` is the only pre-mainnet
gate, so it is built to be faithful rather than convenient: real runtime scripts
read from xtrata-2.0, the same four injections, the same `document.write`, the
same serve-time rewrite, a `/hiro` proxy so the rewrite's target exists, and
`/i/<id>` proxied to the live site so recursion resolves.

`--framed` adds the host bridge, which is not optional — it is the only way a
contract call reaches a wallet.

It found the double-boot, the fee-per-call bug, and the API base problem. None
of them were visible in local development.

---

## 12. Traps

Every one of these was live at some point.

1. **`document.currentScript` is truthy inside a bundle.** A guard meant to
   separate "classic script" from "module import" fires in both, so the app
   booted twice. Markup guards made the second mount a no-op, so the page looked
   perfect and every button had two listeners: two wallet prompts per connect,
   **two signed transactions per move**. Invisible in dev, where the page loads
   as a module. Make `boot()` idempotent.

2. **A post condition for the wrong fee aborts the transaction.** It is a cap,
   not a preference. Capping `open-game` at the move fee does not shrink the
   transfer, it fails — and an aborted transaction still costs the network fee.
   Read the fee per function.

3. **`/v1/names/<name>` answers from the legacy BNS index.** For `jim.btc` it
   returns an address that has not held the name for years. That lookup feeds
   the one value that gets hashed and committed, so a wrong answer assigns a
   side to the wrong person permanently. **Use the BNS-V2 registry.**

4. **`document.open()` removes every listener on the window**, not just the
   document. A flag saying "already attached" survives the wipe that removed the
   listeners.

5. **An `Error` from an iframe fails `instanceof Error`.** Different realm. A
   good stack trace collapses to `{}`.

6. **A raw `"` in an HTML attribute terminates it early.** Tooltips were
   truncated mid-sentence and stray attributes appeared.

7. **Class-name collisions.** `.notice info` already meant an info-level
   message; adding a `.info` rule for icons gave every notice the icon's
   `inline-flex`, 15px width and absolutely positioned hit area. Both halves
   worked perfectly alone. Never style a bare status word.

8. **The render overwrites the markup.** Text written into `index.html` is
   replaced the moment a panel draws, so the version in the markup was never on
   screen. Twice.

9. **A missing element-map entry throws in `_wire()`**, so nothing after it
   runs: the page renders perfectly and does nothing. Add markup, its map entry
   and its handler in one change.

10. **`title` tooltips do not exist on touch**, which is where an explanation is
    most needed. And a 15px icon is not a tap target.

11. **BigInt breaks `JSON.stringify`.** The Clarity codec returns uints as
    BigInt so nothing is silently rounded, and a throw inside a try made a
    *successful* read report itself as a failure.

---

## 13. Testing

~415 JS tests plus a Clarinet suite across all three contracts.

- **Perft** for the engine, against six standard positions. Non-negotiable: it
  is the only way to know a chess engine is correct.
- **Contract tests assert absences**, not just behaviour — that there is no
  `map-delete`, and exactly which public functions exist. An owner who could
  rewrite history would break everything above.
- **Artifact tests read `dist/`**, not the source, because the double-boot bug
  was correct in every source file and wrong in the bundle.
- **Copy is pinned.** Three tests failed on a wording change, which is the system
  working: those strings are what a player reads.

When a test fails, check the fixture first. In this project the engine was right
and the fixture wrong more often than the reverse.

---

## 14. If you rebuild it

Build in this order. Each layer is testable without the next.

1. **Engine**, verified by perft. Nothing else matters if this is wrong.
2. **Replay** as a pure total function. Feed it junk deliberately.
3. **Rules and canonical hashing.** Fix the key order now; it is permanent.
4. **Contract**, filtering on length only. Resist every urge to validate a move.
5. **A mock chain** with the same interface as the live one, and drive the whole
   board against it.
6. **The board**, deriving everything from replay and storing no position.
7. **Wallets**, last, and copy the rules in §8 rather than rediscovering them.
8. **A harness that replicates the runtime**, before inscribing anything.

The one rule that matters more than the rest: **if you find yourself teaching the
contract about chess, stop.** That is the design failing, not the contract.
