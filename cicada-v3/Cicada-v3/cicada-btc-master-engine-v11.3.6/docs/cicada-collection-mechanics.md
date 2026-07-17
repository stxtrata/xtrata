# The Cicada Collection — Mechanics & Lore Concept

*Working draft, July 2026 — v2, integrating "The Emirp Generations" (see companion doc `emirp-generations.md`)*

---

## 0. The two number systems, reconciled

The project now runs on **two complementary prime structures operating at different layers**:

- **The Supply Layer (mints & sales):** cumulative token supply grows through emirp milestones drawn from the same routes — **3, 5 or 7 mint generations** (see §1), always beginning at 13 and sealing at 3,301. This governs how many cicadas exist and when the public can buy in.
- **The Gameplay Layer (the Emirp Generations):** each *lineage* progresses through emirp generations — the five-step **Rapid Ascension** route (13 → 37 → 167 → 743 → 3301) or the seven-step **Deep Lineage** route (13 → 31 → 71 → 167 → 389 → 1151 → 3301). This governs how a colony evolves, breeds and earns its final form. Full spec in `emirp-generations.md`.

The emirp numbers are **generational power targets**, not mint counts — a composite score of population, genetic diversity, reproductive potential, stored energy and lineage value. So the supply layer says *how many cicadas exist in the world*; the emirp layer says *how strong and deep each family line has become*. Both layers converge on 3301, and the convergence is the point: when total supply seals at 3,301 tokens **and** the first lineages complete their 3301 Generation, the collection's final chapter (the distributed cipher, §4) unlocks.

All nine route numbers are verified emirps (prime, and prime when reversed): 13↔31, 37↔73, 71↔17, 167↔761, 389↔983, 743↔347, 1151↔1511, 3301↔1033. The founding pair is the collection's founding myth — **13 and 31 mirror each other**, the first brood already containing its own descendant.

## 1. The supply layer — 3, 5 or 7 mint generations, one emirp lattice

3301 is prime. Its reverse, 1033, is also prime — 3301 is itself an emirp. It is the 464th prime.

The emirp routes can serve as the **literal mint schedule**: cumulative token supply lands exactly on each emirp milestone. All three candidate mint structures come from the *same lattice*, sharing 13 as genesis, 167 as convergence, and 3301 as the seal:

**3 mint generations** (compressed route — the shared skeleton of both journeys):

| Mint event | New mints | Cumulative supply | Emirp ↔ mirror |
|---|---|---|---|
| Genesis | 13 | 13 | 13 ↔ 31 |
| Emergence | 154 | 167 | 167 ↔ 761 |
| Great Brood | 3,134 | 3,301 | 3301 ↔ 1033 |

**5 mint generations** (Rapid Ascension route as supply):

| Mint event | New mints | Cumulative supply | Emirp ↔ mirror |
|---|---|---|---|
| 1 | 13 | 13 | 13 ↔ 31 |
| 2 | 24 | 37 | 37 ↔ 73 |
| 3 | 130 | 167 | 167 ↔ 761 |
| 4 | 576 | 743 | 743 ↔ 347 |
| 5 | 2,558 | 3,301 | 3301 ↔ 1033 |

**7 mint generations** (Deep Lineage route as supply):

| Mint event | New mints | Cumulative supply | Emirp ↔ mirror |
|---|---|---|---|
| 1 | 13 | 13 | 13 ↔ 31 |
| 2 | 18 | 31 | 31 ↔ 13 |
| 3 | 40 | 71 | 71 ↔ 17 |
| 4 | 96 | 167 | 167 ↔ 761 |
| 5 | 222 | 389 | 389 ↔ 983 |
| 6 | 762 | 1,151 | 1151 ↔ 1511 |
| 7 | 2,150 | 3,301 | 3301 ↔ 1033 |

A mathematical constraint worth knowing: **mint sizes after the first can never all be prime.** The difference between two odd primes is always even, so if cumulative milestones are emirps, per-event mint counts are necessarily even. The numerology therefore lives in the milestones — the supply is always *sitting on* an emirp — not in the batch sizes. (Nice accident in the 7-gen route: mint event 6 adds 762 = one more than 761, the mirror of 167.)

Trade-offs between the three:

- **3 generations:** simplest story, biggest emergences, least operational risk — but the final mint of 3,134 is a huge single sale to fill. First sale of 13 is very exclusive.
- **5 generations:** the Rapid Ascension identity — dramatic ~4–5× leaps, each mint feels like an eruption. Final mint 2,558 still large.
- **7 generations:** the Deep Lineage identity — steadier growth, more touchpoints to onboard new buyers, more chances to build ritual and mythology between events, but demands sustained momentum across seven launches.

**A stronger option: don't choose — let the collection choose.** Run route selection at the *world* level, mirroring the emergent-selection idea in the emirp doc (§17): after the 13 Genesis nymphs are claimed, the community's collective behaviour (or a Genesis-holder vote, or the outcome of the first puzzle) determines whether the world follows the 5-route or the 7-route to 3301. The mint schedule itself becomes the first gameplay decision — and outsiders watching won't know which path the brood will take, which is very 3301. (The 3-gen compression then remains as the fallback/minimum-viable schedule.)

Every generation is an emergence — near-silence, then abundance — and supply is never "round"; it's always resting on a prime with a hidden mirror. Deeply on-brand: the original 2012 puzzle image was 509×503 pixels, both prime; 509×503×3301 gave the first domain.

Secondary numerology to weave in: real periodical cicadas emerge on **13- and 17-year cycles** (both prime — evolution's own predator-avoidance cryptography). 13 is now doubly loaded: it's the brood cycle *and* the founding emirp generation. Note also that 71↔17 appears in the Deep Lineage route — so both real-world brood cycles (13 and 17) live inside the emirp system, one as a generation, one as a mirror. Use 13 and 17 as timing constants throughout: reveal windows, ritual durations, trait counts.

**Mirrors already latent in the lore:** the reversed emirp of 167 is **761** — and in the real 2012 Cicada puzzle, 845145127.com decomposed into the primes 509 × 503 × 3301. Hidden prime structure inside visible numbers is exactly the 3301 aesthetic; the emirp mirror-trait system (§20 of the emirp doc) makes it a game mechanic.

## 2. Cicada 3301: the actual history (the raw material)

What's documented, so you know exactly what you're referencing:

**The 2012 puzzle.** January 4, 2012: a black-and-white image on 4chan — "We are looking for highly intelligent individuals. To find them, we have devised a test." Steganography (OutGuess) hidden in the image → Caesar cipher → a URL → a book code keyed to Tennyson's *The Lady of Shalott* → a phone number (dial-up modem tone) → the prime-product domain 845145127.com → a cicada image and a countdown → **GPS coordinates for physical posters in 14 cities worldwide** (Warsaw, Paris, Seoul, Sydney, Miami, Seattle and more), each bearing a cicada and a QR code → Tor onion addresses. Solvers who moved fast enough got emails; the rest were told "we want the best, not the followers."

**The 2013 puzzle.** Same date, one year later. Introduced the **Gematria Primus**: a 29-character runic alphabet (Anglo-Saxon futhorc) where each rune maps to a letter *and* a prime number. Solvers like Marcus Wanner were asked about their views on information freedom, privacy and censorship, then invited to a private forum (Tor) to build a project furthering those ideals.

**The 2014 puzzle and the Liber Primus.** Third puzzle, January 4, 2014, ended in the **Liber Primus** ("First Book") — 75 pages written entirely in runes. Only ~17 pages have ever been decrypted. **The remaining ~58 pages are still unsolved twelve years later.** It is one of the great unsolved ciphertexts, alongside Kryptos.

**The silence.** Final authenticated PGP-signed message: April 2017, warning that anything unsigned is fake. Nothing verified since. Nobody knows who they were — theories range from NSA/GCHQ recruitment to a cypherpunk collective to a private individual.

**What was never answered:** who they are, what the recruits built, what the Liber Primus says, and why they went silent. That negative space is your creative license — you can rhyme with the mystery without ever claiming to *be* it (important: never impersonate 3301 or forge their style of signed messages; the community is hostile to fakes, and the 2017 message exists precisely to disavow them. Homage, not hoax.)

## 3. The lore frame: "Brood 3301"

The fiction, in one paragraph:

> Somewhere in the decrypted margins of a book nobody finished reading, a brood was seeded. Thirteen nymphs, buried in the dark, each carrying a fragment of an instruction set — and each carrying its own reflection, for thirteen mirrored is thirty-one, and both are prime. Like all periodical cicadas they count in primes, because primes are how you avoid your predators. No one knows how many emergences there will be — three, five, or seven — only that when the last one climbs, the brood will number 3,301, and the instruction set will be complete.

The collection is not "a Cicada 3301 tribute project." It's a *brood that behaves the way 3301 behaved*: appears without warning, communicates in ciphers, rewards the diligent, ignores the loud, and goes silent between emergences.

## 4. The three generations, gamified

### Gen I — The Genesis Brood (13 Nymphs)
- 13 tokens, sold or awarded quietly. Consider making some of the 13 **only obtainable by solving a puzzle chain** (steganography in the announcement image → cipher → claim page), so the collection's first collectors are literally recruited the way 3301 recruited. The rest auctioned.
- Art state: **nymphs underground** — subterranean palettes, root systems, soil strata, glowing eyes in the dark. Animated/evolving metadata: they *dig*. Owners see their nymph's depth change over time.
- Each nymph carries the **base genome**: a set of on-chain trait genes (carapace, wing-vein pattern, eye color, song signature, rune mark from the Gematria Primus, brood-cycle number 13 or 17). These genes are the only source of heredity in the entire collection — everything in Gen II and III descends from these 31.
- Each nymph also carries **one shard of a master key** (a Shamir secret share or similar). This matters later.

### The First Emergence → Gen II (+300 = 331)
- After a fixed period (e.g. 13 weeks — prime, cicada-coded), the nymphs "surface": art transforms from underground nymph to **teneral adult climbing a tree** (this can be an actual metadata/art evolution on the same token — Gen I holders' pieces visibly molt, leaving behind an exuvia; consider minting the shed skin as a bonus artifact).
- **The Mating Ritual:** Gen I holders pair their cicadas (owner-to-owner social mechanic — two holders must *agree* to pair, on-chain). Each pairing produces offspring slots for the Gen II mint. Traits are inherited genuinely: offspring genes are derived deterministically (with a randomness beacon for mutation) from both parents' genomes. Rare mutations introduce Gen-II-only traits.
- Gen II mint = 300 new tokens, open to the public — this is where new buyers enter. Pricing/access can favor people who solved public puzzles during the "quiet period" between generations.
- Breeding rewards: parents earn royalties or "song points" from their lineage. A Genesis cicada with many descendants becomes visibly (in the art — richer wing iridescence?) and economically distinguished.

### The Second Emergence → Gen III (+2,970 = 3,301)
- Same cycle at scale: Gen II adults (and surviving Gen I elders) pair; the Great Brood of 2,970 emerges. Total: 3,301. **The contract then seals — no mint function remains.** Immutable prime supply forever.
- By now every token traces a verifiable on-chain **family tree back to one of the 31 Genesis nymphs**. Lineage becomes the collection's social graph: brood-lines, family crests, "descendant of Nymph #17" flex.

### How the Emirp Generations plug into the mint structure

The mint generations above describe the *world*; the emirp routes describe each *player's lineage* within it:

- Every Genesis nymph founds a lineage at **Generation 13** — a colony power score, not a token count. (Lore: 13 nymphs, each destined to mirror into 31. The mirror is the founding myth.)
- Through breeding, trait choices, environmental events and ritual participation, each lineage accumulates generational value toward its next emirp target. Route choice — **Rapid Ascension (5 steps)** or **Deep Lineage (7 steps)** — is either declared after Gen 13 or emerges from play style (emirp doc §17).
- The world-level mint events (First and Second Emergence) are when lineages *convert* accumulated generational power into offspring tokens: a lineage's emirp generation at mint time determines how many offspring slots it earns, what traits pass on, and mutation odds. Fast-route lineages arrive at mints with concentrated power and volatility; deep-route lineages arrive with diversity and stability (route balance, emirp doc §23).
- **Convergence at 167** (the Divergence Brood, shared by both routes) should be timed to coincide with the Second Emergence — every mature lineage passes through the same gate just as the Great Brood mints, whatever path it took.
- After supply seals at 3,301, lineages continue playing toward their **3301 Generation**. A completed 3301 lineage earns its ascension marker ("Rapid Ascension" or "Deep Lineage"), the final cicada form, and — see below — a piece of the endgame.
- **Cross-route breeding** (a Rapid-Ascension 3301 × a Deep-Lineage 3301 producing a new advanced lineage, emirp doc §26) is the post-seal replayability engine: no new supply, but new lineage layers inscribed on existing tokens (Xtrata-style composable inscriptions, emirp doc §25).

### The Final Puzzle — your Liber Primus
- Remember the 31 key shards? Across the entire collection, tokens carry rune-fragments (drawn from the Gematria Primus) hidden in their art and metadata. Once all 3,301 exist, the fragments collectively encode **one final cipher** — solvable only by the community cooperating across the whole collection, exactly as the real Liber Primus community works. Twist from the emirp system: fragments held by tokens read one way; tokens whose lineage has revealed its **mirrored state** (emirp doc §20) read the fragment *reversed*. The cipher needs both readings — visible and mirror — so completed lineages from both routes are structurally required to solve it.
- The prize can be substantial (a treasury, a 1/1 "Queen" piece, or governance of what the brood does next). Crucially: like 3301, **don't announce there is a final puzzle.** Let someone find it.

## 5. Weaving the mystery in subtly (a menu)

- **Timing:** major announcements on **January 4** (the date all three real puzzles dropped), at 17:00 UTC where possible.
- **Gematria Primus runes** as a native trait layer — each cicada bears one rune with its prime value; rune+prime combos are the trait rarity backbone.
- **Steganography in every promotional image.** Always. Even when it's just a thank-you note. Train the audience to run OutGuess on everything you publish.
- **"Patience is a virtue"** and **"We want the best, not the followers"** as recurring copy — countdown pages between generations echo the 845145127.com cicada-countdown moment.
- **Physical layer:** for the Gen II emergence, put QR-coded cicada posters in a handful of real cities. This is the single most legendary 3301 move and almost nobody in NFTs has done it properly.
- **A signed voice:** publish everything under one PGP key from day one. Never break signature. When you go quiet between generations, go *fully* quiet — silence is part of the aesthetic.
- **Song:** 3301's 2014 puzzle included a piece of music ("Interconnectedness"; the 2012 trail had "The Instar Emergence"). Each cicada could carry a generative **song signature** — cicada chorus synthesis from its genes; a mating pair's offspring inherits a blended call. (Instar = the developmental stage between molts — "instar" is superb vocabulary for your generation names: Instar I, II, III.)
- **The unsolved 58 pages:** as pure homage, encode your lore documents in runes and release them page by page. Solvable ones. Except maybe the last one.

## 6. Technical ambition checklist

- **Evolving tokens:** one token whose art/metadata progresses nymph → teneral → adult (+ exuvia artifact), rather than separate collections per stage.
- **On-chain genetics:** deterministic trait inheritance from two parents + beacon-driven mutation, verifiable by anyone.
- **Consent-based breeding:** two-holder handshake mechanic (social layer, drives community formation before Gen II).
- **Lineage graph:** every token's ancestry queryable on-chain back to a Genesis nymph.
- **Distributed cipher:** rune-fragments across 3,301 tokens forming one community-scale puzzle; shard-based key held by the Genesis 13.
- **Prime-sealed supply:** contract provably incapable of exceeding 3,301.
- **Generative audio genome** per cicada.

## 7. Open decisions

0. **Layer coupling:** how tightly should emirp generation progress gate mint participation? (Hard gate: only lineages ≥167 breed into Gen III. Soft gate: any lineage breeds, but emirp generation scales offspring slots/traits. Soft recommended — hard gates punish latecomers.)

1. How many mint generations: 3, 5 or 7 — or community-determined after Genesis (see §1)?
2. How many of the Genesis 13 are puzzle-claimed vs. sold? (Suggest 6 puzzle / 7 auction, or all 13 puzzle-claimed for maximum mythos.)
2. Real-time between generations: weeks (13) or months? Longer = more mythos, more risk of losing momentum.
3. Do Gen I tokens transform in place, or do holders also receive the adult as a new token (keeping the exuvia)?
4. Chain choice and whether breeding/mutation randomness comes from a VRF or a public beacon (drand).
5. Whether the final puzzle prize is financial (treasury) or narrative (control of "what the brood does next").

---

*Never claim to be 3301. Be the brood they would have counted.*
