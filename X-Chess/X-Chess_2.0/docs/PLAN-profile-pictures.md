# Profile pictures, from inscriptions a player already holds

A square thumbnail in the profile section, set from any inscription the
connected address holds, declared through a manifest that address inscribed and
changed by inscribing another. Optionally, small thumbnails beside names
wherever a name appears: games, Explore, Leaderboard, Tournaments.

Nothing here is built. This is what it would take, and the four things that
would go wrong if it were built the obvious way.

## What already exists

Most of this is a new document type and a picker, not new machinery.

`X-CHESS-PLAYER/1` in `packages/protocol/player.ts` is already a self-attested
identity manifest — `address`, `name`, `about` — and `attested()` compares the
document's address against the INSCRIPTION'S CREATOR rather than its holder. A
name therefore cannot be bought, sold or gifted. `PlayerNames` in
`packages/chain/players.ts` finds it by listing NFT holdings, newest first, and
reading up to `MAX_SCAN = 12` candidates until one parses and attests.

The rule that falls out of that, and which this feature has to keep: **holding
finds it, creating proves it.**

## The one call that does almost all the work

`get-inscription-meta` returns everything a picture needs to be judged, in a
single read. Live, against inscription 3002:

```
creator       SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X
owner         SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X
mime-type     "image/webp"
total-size    u443652
total-chunks  u28
sealed        true
final-hash    0x85423ae6…
```

So "is this an image", "does that wallet still hold it", and "how big is it" are
ONE call rather than three, and the size is known before a byte of image is
fetched. Any design that fetches first and asks afterwards is doing avoidable
work.

## Four things that would go wrong

### 1. Adding a field to `X-CHESS-PLAYER/1` would cost players their NAME

This is the one that matters most, and it is not obvious from reading the format.

`parsePlayer` ends:

```js
const ok = problems.length === 0;
return { ok, problems, player: ok ? ({ ...found } as Player) : null };
```

and an unrecognised label pushes a problem rather than being skipped — for a
good reason, stated in its own comment: an inscription cannot be edited, so
somebody who believes a field did something has been misled permanently.

The consequence is that a manifest carrying `image:` parses as `ok: false` and
`player: null` on **every board already inscribed** — 2988, 3008, 3009, 3014,
and 2.1.3 the moment it goes up. Those readers would not merely ignore the
picture. They would stop seeing the player's NAME, permanently, on artefacts
nobody can correct.

**So the picture belongs in its own document**, say `X-CHESS-PFP/1` carrying
`address` and `image`, attested exactly the same way. An old board scanning
holdings does not match the header and skips it, which costs one read and
changes nothing. A new board scans for both in the same pass, so the scan does
not get longer.

It also happens to be the argument `player.ts` already makes about itself. It
declines to be an entry because identity should not require a playing style; a
picture is decoration and should not require an identity document to be reissued.

### 2. Attestation is permanent. Holding is not.

The manifest is signed by the key it names, so the CLAIM is authentic for ever.
But an NFT transfers. A player can set a picture on Monday and sell it on
Tuesday, and the document still says what it said.

That needs deciding rather than defaulting:

* **Check ownership when it is displayed.** Honest, and it costs one
  `get-inscription-meta` per player shown. The picture can disappear, which is
  correct but has to be designed for rather than looking like a bug.
* **Check only when it is set.** Free at render, and the board then shows a
  picture on the strength of a fact that was true once.

The recommendation is to check at display and cache the answer, because a board
whose stated purpose is never to repeat an unchecked claim should not make an
exception for the one part of the screen a person chose about themselves. But it
is a real cost, and the cheaper rule is defensible provided nothing in the UI
implies current ownership.

### 3. A picture URL is a host dependency, and this artefact is permanent

The Xtrata runtime injects `<base href="null">`, so a bare relative URL resolves
to nothing. Root-relative (`/i/<id>`) resolves against the origin and works. That
much is just the trap this codebase has already been caught by twice.

The larger question is what an `<img src>` points at. Naming a gateway host
writes a permanent dependency on somebody else's server into a permanent
artefact, which is exactly what `endpoint.ts` refuses to do for API calls, at
length and for good reasons. The same shape answers it:

1. same-origin `/i/<id>` when `underXtrataRuntime()` — free, adds no dependency,
   and the runtime is serving the page anyway;
2. an ORDERED list of gateways otherwise, no one of them essential;
3. chunks assembled from the contract into a blob as the last resort — correct,
   dependency-free, and about twenty-eight reads for a 443 KB image, which is
   why it is last rather than first.

### 4. The holdings scan already reads too much, and this points it at images

`players.ts:117` fetches the FULL TEXT of up to twelve holdings to find a
manifest, with no filter on type or size. That is affordable today because most
holdings are small documents.

The people who will use this feature are, by definition, the people who hold
pictures. A 443 KB webp read as text, twelve times, is the cost this feature
would silently add to every name lookup.

**Fix it first, and it pays for itself:** filter with `get-inscription-meta` and
only read the text of `text/plain` candidates under a size bound. It is the same
call the picture needs, so the two are one piece of work.

## Two smaller decisions

**Refuse `image/svg+xml`.** SVG carries script. An `<img>` context does not
execute it in current browsers, and an allowlist of `image/png`, `image/jpeg`,
`image/webp` and `image/gif` costs nothing and does not depend on that remaining
true, or on the picture never being rendered some other way later.

**One picture per player, not per row.** A ninety-game tournament shows ten
pictures, not a hundred and eighty. Cache by inscription id and never invalidate
— the bytes behind an id cannot change, which makes this one of the few things
here safe to keep for ever.

## What a player should be told plainly

**Every change of picture is an inscription**, permanent, at roughly 0.31 STX.
That argues for choosing locally and previewing before anything is signed, so
somebody can try five and pay once.

It also writes their address into a new public document. That is fine and it is
the same thing a player manifest already does, but it should not be a surprise
to somebody who thought they were setting an avatar.

## Order of work

**Phase 1 — the canvas.** `X-CHESS-PFP/1`, the meta-based scan filter, a picker
in Profile listing the address's image holdings, and the square thumbnail.
Self-contained, testable, and it makes the scan cheaper rather than dearer.

**Phase 2 — thumbnails beside names.** Only once Phase 1 has shown how the cache
behaves against real wallets. This is where the cost actually lands, and it is
easy to make Explore noticeably slower in exchange for decoration.
