# Mint a copy — song and album editions

Let a song's owner offer copies of it for sale, priced by them, capped by them,
stoppable by them, with a fixed 5% to Xtrata on every mint.

Status: **design**. Nothing here is built. Most of it does not need to be.

## Decisions taken

1. **Only the original may be made mintable.** A copy is a copy. It can never
   itself be enabled for minting, so there is no chain of clones.
2. **A copy is just a token** representing a delegate copy of the song or album.
   Stems, licences and other grants are later work, through separate manifests or
   helper contracts, and deliberately not in scope here.
3. **Xtrata takes a fixed 5%.** Not negotiable, not settable by the artist.
4. **No pre-inscribed supply.** Copies are minted on demand. An owner who wants
   to stop before the cap is reached can stop it.

## The part that already exists

`contracts/live/xtrata-collection-mint-v1.4.clar` already enforces every rule
this feature needs:

| Rule | Function |
|---|---|
| Price per copy | `set-mint-price` |
| Maximum copies | `set-max-supply`, and `set-max-per-wallet` |
| Time window | Phases carry `start-block`, `end-block`, `enabled` |
| Artist / Xtrata split | `set-splits(artist, marketplace, operator)` in basis points |
| Stop it now | `set-paused` |

So price, cap, window, split and stop are written and deployed. This is mostly a
question of configuration, a manifest, and a player.

## Manifests declare. Contracts enforce.

The X-Chess picture manifest is the model, and it works because of one line in
`packages/protocol/pfp.ts`:

```js
return Boolean(pfp && sameAddress(pfp.address, creator));
```

The manifest is trusted **only because the chain records who inscribed it**. The
creator field is the signature. Nobody can forge a manifest claiming to be you.

But that proves who *said* something, not that anyone obeyed it. A manifest
cannot make a buyer pay, and cannot refuse the 101st mint. If price and supply
lived in the manifest, a minter could ignore both.

So:

- **The contract holds the money rules.** Price, cap, window, splits. It is what
  moves STX, so it is the only thing that can enforce.
- **The manifest holds intent and discovery.** Which song, which contract, open
  or closed. It is how the player finds the mint.

The manifest is the shop window. The contract is the till. Closing the window
stops customers arriving; only the till can refuse money.

## A copy references the original. It does not duplicate it.

`mint-small-single-tx-recursive` takes `dependencies (list 50 uint)`.

A copy is therefore a few hundred bytes naming the original as a dependency, not
a second upload of the audio. Song #1107 is 3.6 MB and is never re-inscribed.

The difference is the whole feasibility of the feature:

| | Duplicating | Referencing |
|---|---|---|
| One copy | ~3.5 STX in protocol fees | ~0.011 STX |
| One hundred copies | ~360 MB re-inscribed | ~100 tiny inscriptions |

An album works the same way: one recursive inscription naming several songs.

## Roles: how the 5% is locked and the artist still owns their mint

The contract already separates two admins, and the separation is exactly the one
this feature needs:

- `set-splits` asserts **finance-admin**.
- `set-mint-price`, `set-max-supply`, `set-phase`, `set-paused` assert
  **config-admin**.

So:

| Role | Held by | Can do |
|---|---|---|
| finance-admin | **Xtrata** | Set the splits. Nothing else. |
| config-admin | **The song's owner** | Price, cap, per-wallet, phases, pause |

The artist controls their own mint completely and cannot touch the 5%. Xtrata
controls the 5% and cannot touch their price or supply.

Splits are basis points summing to at most 10000, so the 5% is
`operator = 500`, `artist = 9500`, `marketplace = 0`. Worth knowing:
`calc-splits` assigns rounding remainder to the operator, so the artist's share
is exact and Xtrata absorbs the dust.

## Stopping a mint early

Two things happen, and only one of them is authoritative.

1. **Call `set-paused true`.** This is the real stop. The contract refuses mints
   from that block. Costs a transaction fee.
2. **Inscribe a superseding manifest** with `state: closed`. Instant, and the
   player stops offering it immediately.

Do both. The manifest is what a reader sees; the contract is what a determined
minter meets. A manifest alone leaves the contract mintable by anyone who knows
how to call it directly, which is a real gap and not a theoretical one.

Newest manifest wins, following the picture convention already proven in
`tests/chain/pictures.test.ts`: *"takes the newest manifest, since holdings come
back newest first."*

## The manifest

Header `XTRATA-MINT/1`, following three rules the picture manifest establishes
and explains, each for a reason worth restating.

**A new concern gets a new header.** `pfp.ts` refuses to add an `image:` line to
the player manifest because a manifest carrying an unknown field parses as
invalid on every board already inscribed, and those boards "would stop showing
that player's NAME, for ever, on artefacts nobody can correct." The same applies
here: this must not be an extra field on an existing manifest type.

**Unknown fields are refused.** An inscription cannot be edited, so somebody who
believes a field did something has been misled permanently.

**Values that the contract enforces are NOT copied into the manifest.**

```
XTRATA-MINT/1
song: 1107
mint: SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-song-mint-1107
state: open
```

Three fields. Price, cap, window and splits are read live from the contract by
the player, never mirrored here.

That last rule is the one most likely to be argued with, so: a manifest saying
`price: 1000000` while the contract says `2000000` is a page telling a buyer
something only the contract can answer. That is the same defect the marketplace
had this month, where a registry label promised "no STX needed" beside a card
that charged 0.193 STX. Read the live value or say nothing.

## Copies must never be mintable

A copy names the original in its `dependencies`. So the check is:

- The `song` named by a mint manifest must be an inscription that is **not itself
  a copy** — it must not carry a `XTRATA-MINT` lineage dependency.
- A manifest naming a copy is invalid and the player ignores it.

Cheap to verify from `get-inscription-meta` and `get-dependencies`, which the
reconstruction path already reads.

## The one question still open

**Creator or current owner?**

`attestedPfp` checks the manifest against the inscription's **creator**. For a
picture that is right: it is a wallet pointing at something it holds.

For mint rights it is a genuine fork:

- **Creator** — the artist keeps the right to sell copies even after selling the
  original token. Rights stay with the maker.
- **Current owner** — the right moves with the asset. Whoever holds token #1107
  can sell copies of it.

"The mint right should only be for the original song/owner" reads as owner to me,
but the two produce different products and the answer belongs in this document
before anything is built. It also decides whether a sale of the original silently
transfers a revenue stream.

## What is left to build

1. **A per-song mint contract, or a multi-song variant.** `collection-mint` is
   deployed per collection. One deploy per song is heavy; a variant keyed by
   original token id would serve many. This is the only real contract question.
2. **`XTRATA-MINT/1` parser**, with a strict field allowlist, in the same shape
   as `pfp.ts`.
3. **Player affordance.** A "Mint a copy" control that reads price and remaining
   supply from the contract at render time.
4. **Owner console.** Enable, price, cap, window, pause. All of it is existing
   contract calls.

## Before any of this ships

"Mint a copy" of a song implies a licence, and **holding an edition token is not
holding rights**. Fine when the person enabling the mint is the rights-holder,
and a real problem the first time somebody enables mints on a track they do not
control. The same question sits under the Dataing radio royalties idea in
`DATAING-COLLAB.md`. One position, applied to both.
