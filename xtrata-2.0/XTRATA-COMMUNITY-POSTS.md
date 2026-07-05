# Xtrata — community posts

Four ready-to-post drafts, each tuned to its audience. All written in first person
(builder voice). Suggested subreddits are just that — check each community's
self-promo rules before posting; several allow builder posts only on specific days.

Links used: https://xtrata.xyz · https://xtrata.xyz/radio

---

## 1. Stacks community (r/stacks)

**Title:** I built Xtrata: full audio files stored in Clarity contracts, plus a radio station whose entire catalogue lives on-chain

**Body:**

Most "music NFTs" are a token pointing at a URL. I wanted to see how far the other
direction could go on Stacks: the entire file on-chain, no pointers, no IPFS, no
pinning service.

Xtrata inscribes complete media files into Clarity contract storage. The mint flow
is init → chunked writes (batches up to ~440KB) → seal, so a full 96kbps Opus master
ends up living in contract data forever. Songs are inscribed either as raw audio or
as self-contained HTML players — cover art, title, artist, lyrics and the audio
itself embedded in one document. Once sealed, nothing about it depends on me or my
servers: any Stacks node can reconstruct the file.

The fun part is Xtrata Radio (xtrata.xyz/radio): an internet radio station whose
entire catalogue is inscriptions. It has three bands — FM (curated), LIKED (your
saved songs), CHAIN (walks every playable token on the contract) — and it discovers
new songs as they're minted by watching the contract's token counter. There's also a
relations layer: inscriptions can declare parents/dependencies, which forms a
mint-ordered DAG, so the radio can show a playing song's relatives (the artwork it
references, other songs by the same lineage) and let you tune straight to them.

Everything is verifiable: every song has an /i/<id> endpoint that serves the actual
on-chain bytes.

Happy to answer anything about chunked storage costs, the resolver ladder across
contract versions, or the indexing (D1 edge index synced from the append-only
minted-id list). Site: xtrata.xyz

---

## 2. Bitcoin audience (r/BitcoinBeginners, Stacks-adjacent Bitcoin spaces — r/Bitcoin generally removes project posts)

**Title:** Permanent music, anchored to Bitcoin: what I learned building an on-chain audio archive on a Bitcoin layer

**Body:**

Ordinals proved something important: people want media that inherits Bitcoin's
permanence, not a receipt pointing at a web server. I've been exploring the same
ethos from a different angle — full audio files written into contract storage on
Stacks, which settles to Bitcoin.

To be upfront: this is a Stacks project, not L1 inscriptions. The tradeoff I chose
is different from Ordinals — larger files are practical (a complete ~3–4 minute song
as 96k Opus, or a whole self-contained HTML player with embedded audio, art and
lyrics), writes are cheap enough to be routine, and the data sits in Clarity
contract state whose history is anchored to Bitcoin finality. The cost is an extra
trust layer versus pure L1 — I think that's an honest trade for full songs rather
than file fragments.

What convinced me the permanence framing matters: I built a radio station
(xtrata.xyz/radio) that plays *only* on-chain songs. No CDN library, no licensing
database, no backend catalogue — the station list is derived from the chain itself,
and if my site vanished tomorrow the songs wouldn't. Every track has an endpoint
serving the actual reconstructed bytes.

Not selling anything to this crowd — no token, and the only fees are the mining
fees to write your file. Mostly interested in whether Bitcoiners think "full file on
a Bitcoin-anchored layer" is a legitimate branch of the inscription idea, or whether
anything short of L1 misses the point. Genuinely curious about the arguments either
way.

---

## 3. Wider crypto (r/CryptoCurrency, r/CryptoTechnology — flair as project/dev post where required)

**Title:** Your music NFT is probably a URL. I built the opposite: the whole song on-chain, and a radio station to prove it

**Body:**

Quick test for any music NFT you own: find the tokenURI, follow it. If it resolves
to somebody's API or an unpinned IPFS hash, your "permanent" collectible has a
landlord.

Xtrata is my attempt at the opposite architecture. The complete file — not metadata,
the actual audio — is chunked and written into smart-contract storage on Stacks
(init → ~440KB write batches → seal). Songs can be raw Opus/MP3 audio or fully
self-contained HTML players: one document with the audio, cover art, title and
lyrics embedded. There is no pointer to rot. Any node can reconstruct the file; the
site's /i/<id> endpoints just serve the on-chain bytes.

The existence proof is Xtrata Radio (xtrata.xyz/radio): a station whose entire
catalogue is on-chain inscriptions. It reads the contract's minted-token counter to
discover new songs, has a curated band and a full-chain exploration band, and the
listeners' probes even share a communal "this token isn't playable" memory so the
dial gets smarter over time. If the company/me/the website disappears, the music
doesn't — that's the whole point.

Honest limitations: it's on Stacks (Bitcoin-anchored, but a layer — judge that
tradeoff yourself), audio is optimised to 96k Opus rather than lossless (storage
costs scale with bytes), and this is one builder's project, not a funded platform.
No token, nothing to ape into — you pay mining fees to inscribe, that's the entire
business model.

Architecture questions welcome.

---

## 4. Music communities (r/WeAreTheMusicMakers, r/SunoAI, producer Discords/forums — check self-promo rules; many require feedback-first framing)

**Title:** I made a permanent home for finished tracks — one payment, no subscription, and a little radio station that plays them forever

**Body:**

Every place we put music is rented. Streaming platforms delist, hosting bills lapse,
"lifetime" services get acquired and sunset. I lost work that way, so I built the
most stubborn archive I could: your track gets written, in full, into a public
blockchain's permanent storage — and after that it doesn't need me, my website, or
any company to keep existing.

How it works, minus the jargon:

You drop in a finished track (there's a dedicated flow for Suno exports that pulls
the cover art, title, artist and lyrics automatically). Your browser optimises the
audio and builds a small self-contained player — one file containing the song, the
artwork and the lyrics, plays in any browser. You pay once (a network fee based on
file size — no subscription, no renewal, nothing recurring, change refunded), and
the whole thing is written permanently to the chain. Nothing uploads anywhere until
you approve the payment.

Then it gets airplay: Xtrata Radio (xtrata.xyz/radio) is a station whose entire
catalogue is these permanently stored songs. New tracks join the rotation
automatically, listeners can heart your song into their own personal band, and
there's a genuinely pleasing walnut-and-VFD receiver UI to fiddle with.

To be clear about the blockchain part, because I know the word is radioactive
around here: there's no token, no speculation, no "investment", and you're not
minting collectibles at anyone. It's used purely as write-once permanent storage
that outlives companies. That's it.

I'd love ears on it — the radio is free to listen to, and I'm happy to answer
anything about costs or the audio pipeline (96k Opus — transparent for most
material, and honest people will tell you it's not for archiving stems).

---

### Posting notes

- r/Bitcoin removes nearly all project posts — post #2 is written for
  Bitcoin-adjacent spaces and to survive a hostile reading, but expect friction.
- r/CryptoCurrency requires project flair and has karma/age gates on links.
- Most music subs (WATMM especially) ban plain promo: post #4 leads with the
  problem and openly invites criticism, which usually passes "feedback-first"
  rules — but read each sub's sticky first.
- All four posts are honest about tradeoffs (Stacks layer, 96k Opus, solo builder).
  Resist the urge to trim the caveats; they're what makes these audiences engage.
