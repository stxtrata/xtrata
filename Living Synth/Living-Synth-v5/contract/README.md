# Living Synth contracts

| contract | role |
|---|---|
| `living-synth-registry` | reveal, child recordings, live sets, fees |
| `mock-xtrata-core` | test double for `xtrata-v3-2-3`, never deployed |
| `recording-fees` | **superseded**, see the bottom of this file |

Everything about the *content* stays on Xtrata. The editions are Xtrata
inscriptions and therefore SIP-009 tokens, so ownership, transfers and
marketplaces are Xtrata's. Child recordings are Xtrata parent-child
inscriptions. The registry never stores audio or artwork. It stores the two
facts the mosaic cannot read off the chain any other way: which cells have been
distributed, and which recording each cell currently plays.

## `living-synth-registry`

Targets `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3` directly. No
gateway adapter is needed, because v3.2.3's readers already return responses.
The core is chosen once through `lock-core-contract` and then frozen, so it can
never be swapped for a contract that lies about ownership or parent links.

### 1. Editions

`register-edition-batch` maps each of the 1,024 editions to the Xtrata token
that carries it, up to 50 at a time. Writes use `map-insert`, so a duplicate
anywhere in a batch aborts the whole transaction and no edition can ever be
repointed at a different token.

### 2. Sticky reveal

A cell is revealed the first time its token leaves treasury custody, and stays
revealed forever after. It can go back to the treasury, be sold on, be sent
anywhere. Once lit, always lit.

That has to be latched when it happens, because "has this ever left" is history
and cannot be recovered from current ownership later. And 1,024 separate flags
would cost the mosaic 1,024 read-only calls to load. So each flag is one bit
inside a 128-bit uint. Eight uints hold the whole collection, and
**`get-reveal-bits` returns all 1,024 states in a single call**.

Latching is `bit-or`, which cannot clear a bit. "Permanently revealed" is a
property of the arithmetic rather than a rule some later function has to
remember to respect.

**Custody is the full history of treasury addresses, not just the current one.**
`set-treasury` retires the old address into `PastTreasuries` rather than
forgetting it, so rotating the treasury cannot make the tokens still sitting in
the old wallet look distributed. That is what makes it safe to rotate if a
treasury wallet is ever compromised mid-distribution.

Two ways a cell lights up:

- **`transfer-and-reveal (core) (edition) (recipient)`** is how the treasury
  distributes. The transfer and the latch are the same transaction, so a reveal
  can never be missed. Treasury only, and it refuses a recipient that is itself
  in custody.
- **`reveal (core) (edition)`** is permissionless catch-up for a token that left
  by another route, a marketplace sale say. It verifies against live ownership,
  so nobody can light a cell that is still held, and it returns `false` rather
  than an error if the cell was already lit. The new owner always has the motive
  to call it.

**Known gap:** if a token leaves custody and returns before anybody calls
`reveal`, that history is gone. Distribute through `transfer-and-reveal` and the
gap never opens.

### 3. Child recordings

`register-child (core) (edition) (recording-id) (expected-fee)` checks all of
this in one transaction before it takes the fee:

- the caller currently owns the edition's token
- the caller owns the recording inscription
- the recording is sealed, `application/json`, non-empty and under 256 KiB
- the edition's token appears in the recording's immutable Xtrata parent list
- this recording has not been registered before
- `expected-fee` matches the live fee, so a price change cannot surprise anyone
  mid-flow

The newest child becomes the mosaic default. Every earlier one stays indexed and
playable through `get-child-at`. A second bitmap, `get-child-bits`, says which
cells have a child at all, so the mosaic fetches only the children that exist
instead of paging all 1,024.

`register-live-set` does the same for a whole-mosaic `xtrata-session` recording.
No parent and no edition ownership, since a live set belongs to the mosaic
rather than one cell.

### Fees

`child-fee` 0.1 STX and `live-set-fee` 1 STX by default, both owner-updatable
and capped at 100 STX. Fees go to the treasury in the same transaction that
registers the recording, so paying and registering can never drift apart.

### Admin

`lock-core-contract` (once) · `set-treasury` · `set-paused` · `set-child-fee` ·
`set-live-set-fee` · two-step ownership through
`initiate-contract-ownership-transfer` then `accept-contract-ownership`, with
`cancel-contract-ownership-transfer`.

`reveal` is deliberately **not** gated on `paused`. Pausing stops new writes to
the collection, but recording the truth about a token that has already moved
should never be blocked.

### Reading the mosaic

| call | returns |
|---|---|
| `get-reveal-bits` | all 1,024 reveal flags, 8 uints, one call |
| `get-child-bits` | all 1,024 has-a-child flags, one call |
| `get-state` | owner, core, treasury, fees, counts, paused |
| `get-mosaic-page (page)` | 32 full cells, so 32 pages covers everything |
| `get-cell (edition)` | one cell in full |
| `is-revealed` · `has-child` · `get-active-child` · `get-child-count` · `get-child-at` · `get-child-info` · `get-live-set` · `is-in-custody` · `was-treasury` | single lookups |

## Verify

```sh
clarinet check
```

```sh
npm install && npm test
```

Current state: **3 contracts checked, 0 errors** and **46 tests passing**, 38
for the registry and 8 for the superseded fee contract.

Registry coverage: core locking, edition mapping and atomic batch rejection,
the sticky property (out, back to the treasury, out again, still lit, counted
once), bitmap slot and bit maths at editions 1, 128, 129 and 1024, no underflow
at edition 0, treasury rotation in both directions, every rejection path on
`register-child`, live sets, pausing, fee guards, and two-step ownership.

## Not yet wired

`apps/mosaic/mosaic.html` still reads reveal state from a `holdersUrl` HTTP
endpoint and keeps child recordings in `localStorage`. Nothing reads this
registry yet. Until that front-end work lands, the tested mechanism is unused
and the live one is the spoofable one. `apps/canary/canary.html` also predates
the registry and still walks the `recording-fees` deployment.

## Superseded: `recording-fees`

Deployed to mainnet at
`SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7.recording-fees`
(tx `0x704d780d94638c798764c46fb677c3b9de07a2e7a6ff07f5d259e98e83dbdb9a`,
block 8,628,536). Its on-chain source is byte-identical to the copy in this
folder, and its receipt count is zero, so nothing is lost by retiring it.

It took a fee and wrote a receipt, but it verified nothing: no proof the payer
owned the edition, and no link between the receipt and the recording it claimed
to pay for. A fee could be paid for someone else's edition, and a child could be
inscribed without paying at all. `living-synth-registry` folds the fee into the
transaction that actually verifies and registers the recording, which is what
makes the payment mean something.

Do not build on it. It is kept here only so the deployed source stays
reviewable.
