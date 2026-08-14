# The wallet matrix

Everything a machine cannot check.

`tests/wallet/conformance.test.ts` reproduces every wallet misbehaviour we know
about, against fakes. That is what makes this pass short rather than a
rediscovery from scratch — but it drives no real extension, and the legacy
project's entire wallet layer exists because real extensions do things no
reasonable fake would.

**A release cannot be declared complete until every REQUIRED row below is signed
off by a person, against the artefact being released.** Not a development build.

---

## How to run it

```
node harness/runtime/serve.mjs --framed          # the Xtrata runtime emulator
```

Framed is not an extra. `stx_callContract` is refused with -32601 unless the page
carries a `walletBridgeToken` and has a parent or opener, so an unframed run
cannot sign anything at all. That is the runtime behaving as written.

Record the build hash from `dist/manifest.json` in the sign-off, because a matrix
signed against a different artefact proves nothing about this one.

---

## Required before any mainnet inscription

| # | wallet | environment | scenario | expected | state |
|---|---|---|---|---|---|
| 1 | Xverse | desktop | connect | the wallet opens and an address comes back | not run |
| 2 | Xverse | desktop | open a Standard Game | one prompt, one transaction, 1.00 STX capped | not run |
| 3 | Xverse | desktop | submit a move | one prompt, one transaction, nothing sent | not run |
| 4 | Xverse | desktop | **submit a SPONSORED move** | **the contract-principal post condition is accepted and the rebate arrives** | not run |
| 5 | Xverse | mobile | 1-4 | as above | not run |
| 6 | Leather | desktop | 1-4 | as above | not run |
| 7 | Leather | mobile | 1-4 | as above | not run |
| 8 | any | Xtrata framed | submit a move | signs through the host bridge | not run |
| 9 | any | Xtrata unframed | submit a move | refused up front with a clear message, never a failed transaction | not run |
| 10 | any | no wallet installed | connect | says no wallet, does not hang | not run |
| 11 | any | wallet locked | connect | waits for the unlock screen, then connects | not run |
| 12 | any | user cancels | submit a move | reports the cancellation, does not retry other providers | not run |
| 13 | any | wrong network | connect | refuses and says which network | not run |
| 14 | any | provider appears late | connect immediately on load | finds it once it installs | not run |

**Row 4 is the one that has never run anywhere.** It is new to X Chess 2 and it
is the whole product: under deny mode the contract's rebate is a transfer that
needs its own post condition, with a contract-principal encoding no previous
X Chess build ever sent. The bytes match `@stacks/transactions`, which proves the
encoding and does not prove that Xverse and Leather accept it, or that the Xtrata
host bridge forwards it intact. See ADR-0006.

---

## What to watch for

Each of these was live at some point in the legacy project.

- **Two prompts for one click.** Means a provider was offered twice under
  different aliases, or the app booted twice.
- **A prompt that never appears and never rejects.** Xverse does this on the
  object form of a post condition. The promise simply never settles.
- **A confirm button that is disabled.** Means the call reached the deprecated
  `transactionRequest` screen through a btckit alias.
- **A fee of about 0.5 STX suggested.** Means `feeRate` reached the wallet, or
  the wallet is estimating on its own. An inscribed board cannot set the fee.
- **A rejection before any confirmation UI.** Means an out-of-spec field reached
  a schema-validating wallet.
- **Two transactions for one move.** The double-boot bug. Every button has two
  listeners and the page looks perfect.

---

## Results

**This is the part the release gate reads.** It used to search this file for the
words `not run` and refuse if it found them — which made the table's only
machine-readable property a phrase whose ABSENCE was treated as proof of work
done. Editing fourteen cells to "done" satisfied it with no evidence at all, and
typing "pending" satisfied it by accident.

Each row now needs a line in this block, in this shape:

```
RESULT row=<n> build=<htmlSha256> provider=<label> outcome=pass|fail txid=<id or ->
```

`npm run release` refuses unless all fourteen are present, all say `pass`, and
all carry THIS build's hash. The hash is per row rather than once at the bottom
because rows get re-run one at a time, and a single signature cannot say which
rows were run against what.

**Do not write these by hand.** Open `dist/xchess-gates.html?track=wallet`
and work down it, then paste what the last step prints. It uses the board's own
`connectWallet`, `walletCall`,
`contractCallParams` and `guardFor` rather than its own copies — a page that
signs through its own code proves things about that code — and it records which
provider actually served each call, which is what every wallet fault found so far
has turned on.

```
(no results yet)
```

---

## Sign-off

```
Build          dist/manifest.json -> build:            ______
               htmlSha256:                             ______
Contract       ______________________________________________
Date           ______________________
Signed         ______________________

Rows passed    ____ / 14
Rows failed    ____        (list them, with what happened)
```

An unsigned matrix, or one signed against a different build, blocks the release.
`npm run release` refuses without it.
